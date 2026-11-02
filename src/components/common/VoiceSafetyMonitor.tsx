import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Download,
  ExternalLink,
  Info,
  Mic,
  MicOff,
  PhoneCall,
  Share2,
  ShieldCheck,
  Timer,
  X,
} from 'lucide-react';
import { SosCard } from '../sos/SosCard';
import { contactName } from '../sos/contactLabels';
import { SosRecipients } from '../../hooks/useSosRecipients';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { fill } from '../../i18n/locationStrings';
import { getSosStrings } from '../../i18n/sosStrings';
import { Coords, buildAlertText, mapsLink, smsHref } from '../../utils/emergencyShare';
import {
  CANCEL_COOLDOWN_MS,
  COUNTDOWN_OPTIONS,
  DEFAULT_COUNTDOWN,
  LoudSoundGate,
  PhraseGate,
  classifyAlternatives,
  normalizeCountdown,
} from '../../utils/sosLogic';
import { LanguageCode } from '../../types';

/**
 * Automatic Voice Safety Monitor (web version).
 *
 * What it really does: while the SOS page is open and the microphone is allowed, it listens for
 * emergency phrases (browser speech recognition, where available) and for a sustained loud sound.
 * When one is detected it starts a cancellable countdown (10 s by default), records a short voice clip,
 * looks up a fresh location and then PREPARES an alert (SMS links per selected contact, share sheet,
 * audio download). It never sends anything by itself and never claims delivery.
 *
 * What a web page cannot do: listen in the background or with the screen off, or send SMS/WhatsApp
 * silently. Those need the native Android app (see ANDROID_NATIVE_REQUIREMENTS.md).
 */

type Phase = 'idle' | 'countdown' | 'ready';
type StatusCode = 'off' | 'active' | 'stopped' | 'unsupported' | 'denied' | 'needsTap' | 'countdown' | 'cancelled' | 'prepared';
type Reason = { kind: 'phrase'; phrase: string } | { kind: 'loud' };
type ErrorCode = 'denied' | 'unsupported' | 'noRecorder' | 'recordFail' | 'shareFail';
type AudioNotice = 'shared' | 'downloaded' | null;

const PREFS_KEY = 'sahayini_voice_monitor';
const RECOGNITION_LANG: Record<LanguageCode, string> = {
  en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN', te: 'te-IN', mr: 'mr-IN', ml: 'ml-IN', gu: 'gu-IN', kn: 'kn-IN',
};
const AFTER_DISMISS_COOLDOWN_MS = 30_000;

interface Prefs {
  enabled: boolean;
  seconds: number;
}

const loadPrefs = (): Prefs => {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return { enabled: p.enabled === true, seconds: normalizeCountdown(p.seconds) };
  } catch {
    return { enabled: false, seconds: DEFAULT_COUNTDOWN };
  }
};

const savePrefs = (p: Prefs) => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* storage blocked: settings last for this session only */
  }
};

interface Props {
  recipients: SosRecipients;
  language: LanguageCode;
  /** Latest location known to the SOS page (from live sharing), used if a fresh fix is unavailable. */
  coords: Coords | null;
}

export const VoiceSafetyMonitor: React.FC<Props> = ({ recipients, language, coords }) => {
  const D = getSosDashStrings(language);
  const ss = getSosStrings(language);

  const supported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    (typeof window === 'undefined' || window.isSecureContext !== false);

  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [monitoring, setMonitoring] = useState(false);
  const [permDenied, setPermDenied] = useState(false);
  const [statusCode, setStatusCode] = useState<StatusCode>('off');
  const [speechNote, setSpeechNote] = useState<'none' | 'unavailable' | 'interrupted' | 'langUnsupported'>('none');
  const [warmup, setWarmup] = useState(false);
  const [detectors, setDetectors] = useState({ phrase: false, loud: false });
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [reason, setReason] = useState<Reason | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [alertCoords, setAlertCoords] = useState<Coords | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [audioNotice, setAudioNotice] = useState<AudioNotice>(null);
  const [showStatus, setShowStatus] = useState(false);

  // Refs hold values that timers and recognition callbacks must read fresh.
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const languageRef = useRef(language);
  const coordsRef = useRef<Coords | null>(coords);
  coordsRef.current = coords;
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const discardRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const loudTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const monitoringRef = useRef(false);
  const startingRef = useRef(false);
  const triggeredRef = useRef(false);
  const suppressUntilRef = useRef(0);
  const alertCoordsRef = useRef<Coords | null>(null);
  const phraseGate = useRef(new PhraseGate());
  const loudGate = useRef(new LoudSoundGate());

  const speechSupported =
    typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const unavailable = !supported || permDenied;
  // "Monitoring Active" only when at least one detector is genuinely running.
  const running = monitoring && (detectors.phrase || detectors.loud);

  const updatePrefs = (patch: Partial<Prefs>) => {
    const next = { ...prefsRef.current, ...patch };
    prefsRef.current = next;
    setPrefs(next);
    savePrefs(next);
  };

  /* ---------- detectors ---------- */

  const stopRecognition = () => {
    const rec = recognitionRef.current;
    recognitionRef.current = null; // clear first so onend does not restart it
    try {
      rec?.stop();
    } catch {
      /* already stopped */
    }
    setDetectors((d) => ({ ...d, phrase: false }));
  };

  const stopAudioDetection = () => {
    if (loudTimerRef.current !== null) window.clearInterval(loudTimerRef.current);
    loudTimerRef.current = null;
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setDetectors((d) => ({ ...d, loud: false }));
  };

  const clearCountdown = () => {
    if (countdownTimerRef.current !== null) window.clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = null;
  };

  const startRecognition = () => {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      setDetectors((d) => ({ ...d, phrase: false }));
      setSpeechNote('unavailable');
      return;
    }
    const rec = new Recognition();
    recognitionRef.current = rec;
    // The recognition locale follows the selected app language (en-IN, ta-IN, hi-IN, te-IN, mr-IN, ml-IN, gu-IN, kn-IN).
    rec.lang = RECOGNITION_LANG[languageRef.current] || 'en-IN';
    rec.continuous = true;
    rec.interimResults = false; // finished utterances only: fewer false triggers than interim text
    rec.maxAlternatives = 3; // engines often rank the right word second for Indian languages
    rec.onstart = () => {
      // "Phrase detection on" is only reported once the browser really started listening.
      if (recognitionRef.current !== rec) return;
      setSpeechNote('none');
      setDetectors((d) => ({ ...d, phrase: true }));
    };
    rec.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result.isFinal) continue;
        const alternatives: string[] = [];
        for (let k = 0; k < result.length; k += 1) alternatives.push(result[k]?.transcript || '');
        const m = classifyAlternatives(alternatives, languageRef.current);
        if (m.strong) {
          triggerAlert({ kind: 'phrase', phrase: m.strong });
          return;
        }
        if (m.weakCount > 0 && phraseGate.current.register(m.weakCount, Date.now())) {
          triggerAlert({ kind: 'phrase', phrase: m.weak || '' });
          return;
        }
      }
    };
    rec.onerror = (e: any) => {
      const code = e?.error;
      if (code === 'language-not-supported') {
        // This browser has no speech model for the selected language: say so, do not keep retrying.
        recognitionRef.current = null;
        setDetectors((d) => ({ ...d, phrase: false }));
        setSpeechNote('langUnsupported');
      } else if (code === 'not-allowed' || code === 'service-not-allowed') {
        recognitionRef.current = null;
        setDetectors((d) => ({ ...d, phrase: false }));
        setSpeechNote('unavailable');
      } else if (code === 'audio-capture' || code === 'network') {
        setDetectors((d) => ({ ...d, phrase: false }));
        setSpeechNote('interrupted');
      } else if (code !== 'no-speech' && code !== 'aborted') {
        setSpeechNote('interrupted');
      }
    };
    rec.onend = () => {
      if (recognitionRef.current !== rec) return;
      setDetectors((d) => ({ ...d, phrase: false }));
      if (!monitoringRef.current) return;
      // Browsers end continuous recognition after silence; restart it shortly (not in a tight loop).
      window.setTimeout(() => {
        if (!monitoringRef.current || recognitionRef.current !== rec) return;
        try {
          rec.start();
        } catch {
          setSpeechNote('interrupted');
        }
      }, 300);
    };
    try {
      rec.start();
    } catch {
      recognitionRef.current = null;
      setDetectors((d) => ({ ...d, phrase: false }));
      setSpeechNote('unavailable');
    }
  };

  const startLoudDetection = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx: AudioContext = new AudioCtx();
      audioCtxRef.current = ctx;
      void ctx.resume?.().catch(() => {});
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      loudGate.current.reset();
      loudTimerRef.current = window.setInterval(() => {
        if (!monitoringRef.current || triggeredRef.current) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) {
          const x = (v - 128) / 128;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / data.length);
        if (loudGate.current.update(rms, Date.now())) triggerAlert({ kind: 'loud' });
      }, 250);
      // An AudioContext created without a user tap can stay suspended; report that honestly.
      window.setTimeout(() => setDetectors((d) => ({ ...d, loud: ctx.state === 'running' && audioCtxRef.current === ctx })), 700);
    } catch {
      /* phrase detection can still run */
    }
  };

  /* ---------- start / stop ---------- */

  const teardown = () => {
    monitoringRef.current = false;
    setMonitoring(false);
    stopRecognition();
    stopAudioDetection();
    streamRef.current?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    streamRef.current = null;
    setDetectors({ phrase: false, loud: false });
    setSpeechNote('none');
    setWarmup(false);
  };

  const startMonitoring = async (auto = false) => {
    setErrorCode(null);
    if (!supported) {
      setStatusCode('unsupported');
      if (!auto) setErrorCode('unsupported');
      return;
    }
    if (monitoringRef.current || startingRef.current) return;
    startingRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      monitoringRef.current = true;
      triggeredRef.current = false;
      phraseGate.current.reset();
      loudGate.current.reset();
      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          // Microphone taken away (device unplugged, OS revoked it): say so instead of pretending to listen.
          if (!monitoringRef.current) return;
          teardown();
          setStatusCode('needsTap');
        };
      });
      setMonitoring(true);
      setWarmup(true);
      window.setTimeout(() => setWarmup(false), 2500);
      setPermDenied(false);
      setStatusCode('active');
      updatePrefs({ enabled: true });
      startRecognition();
      startLoudDetection(stream);
    } catch (e) {
      monitoringRef.current = false;
      setMonitoring(false);
      const name = (e as { name?: string })?.name;
      const denied = name === 'NotAllowedError' || name === 'SecurityError';
      if (denied) setPermDenied(true);
      setStatusCode(denied ? 'denied' : 'unsupported');
      if (!auto) setErrorCode(denied ? 'denied' : 'unsupported');
    } finally {
      startingRef.current = false;
    }
  };

  const stopMonitoring = () => {
    clearCountdown();
    triggeredRef.current = false;
    setPhase('idle');
    teardown();
    setStatusCode('stopped');
    updatePrefs({ enabled: false });
  };

  /* ---------- alert flow ---------- */

  const revokeAudio = () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;
    if (typeof MediaRecorder === 'undefined') {
      setErrorCode('noRecorder');
      return;
    }
    try {
      chunksRef.current = [];
      discardRef.current = false;
      const preferred = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        setRecording(false);
        if (discardRef.current) return;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size) {
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setAudioUrl(url);
        }
      };
      recorder.start();
      setRecording(true);
    } catch {
      setErrorCode('recordFail');
    }
  };

  const stopRecorder = (discard: boolean) => {
    discardRef.current = discard;
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const finishCountdown = () => {
    stopRecorder(false);
    setAlertCoords(alertCoordsRef.current);
    setCountdown(0);
    setPhase('ready');
    setStatusCode('prepared');
  };

  const triggerAlert = (r: Reason) => {
    if (triggeredRef.current || !monitoringRef.current) return;
    if (Date.now() < suppressUntilRef.current) return;
    triggeredRef.current = true;
    setReason(r);
    setErrorCode(null);
    setAudioNotice(null);
    revokeAudio();
    setPhase('countdown');
    setStatusCode('countdown');

    // Use the freshest location available: a new fix if the device gives one quickly, else the last known.
    alertCoordsRef.current = coordsRef.current;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          alertCoordsRef.current = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy };
        },
        () => {
          /* keep the last known location */
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    }

    startRecording();
    let remaining = prefsRef.current.seconds;
    setCountdown(remaining);
    clearCountdown();
    countdownTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      setCountdown(Math.max(remaining, 0));
      if (remaining <= 0) {
        clearCountdown();
        finishCountdown();
      }
    }, 1000);
  };

  const cancelAlert = () => {
    clearCountdown();
    stopRecorder(true); // a cancelled alert keeps no recording
    revokeAudio();
    triggeredRef.current = false;
    suppressUntilRef.current = Date.now() + CANCEL_COOLDOWN_MS;
    phraseGate.current.reset();
    loudGate.current.reset();
    setPhase('idle');
    setStatusCode('cancelled');
  };

  const dismissReady = () => {
    triggeredRef.current = false;
    suppressUntilRef.current = Date.now() + AFTER_DISMISS_COOLDOWN_MS;
    phraseGate.current.reset();
    loudGate.current.reset();
    setPhase('idle');
    setStatusCode(monitoringRef.current ? 'active' : 'stopped');
  };

  const alertMessage = alertCoords ? buildAlertText(alertCoords, null, language) : D.vmNoLocMsg;

  const shareAudio = async () => {
    if (!audioUrl) return;
    try {
      const blob = await (await fetch(audioUrl)).blob();
      const file = new File([blob], 'sahayini-emergency-voice.webm', { type: blob.type || 'audio/webm' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ title: D.vmTitle, text: alertMessage, files: [file] });
        setAudioNotice('shared');
      } else {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = file.name;
        a.click();
        setAudioNotice('downloaded');
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setErrorCode('shareFail');
    }
  };

  /* ---------- lifecycle ---------- */

  // Settings and mic permission are remembered: if the user enabled monitoring before and the browser
  // still has microphone permission, monitoring resumes on its own (no extra button press).
  useEffect(() => {
    let cancelled = false;
    let perm: any = null;
    (async () => {
      if (!supported) {
        if (prefsRef.current.enabled) setStatusCode('unsupported');
        return;
      }
      try {
        const perms = (navigator as any).permissions;
        if (perms?.query) {
          perm = await perms.query({ name: 'microphone' });
          perm.onchange = () => {
            if (perm.state === 'denied') {
              setPermDenied(true);
              if (monitoringRef.current) teardown();
              setStatusCode('denied');
            } else {
              setPermDenied(false);
            }
          };
          if (cancelled) return;
          if (perm.state === 'denied') {
            setPermDenied(true);
            setStatusCode('denied');
            return;
          }
          if (prefsRef.current.enabled) {
            if (perm.state === 'granted') await startMonitoring(true);
            else setStatusCode('needsTap'); // browser would prompt: that needs a user tap
          }
          return;
        }
      } catch {
        /* Permissions API unavailable for the microphone: fall through */
      }
      // Cannot tell whether permission is still granted, so never prompt without a tap.
      if (prefsRef.current.enabled) setStatusCode('needsTap');
    })();
    return () => {
      cancelled = true;
      if (perm) perm.onchange = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep speech recognition in the selected language.
  useEffect(() => {
    languageRef.current = language;
    if (monitoringRef.current && speechSupported) {
      // Restart recognition with the new locale (also recovers if it had stopped for the old language).
      stopRecognition();
      setSpeechNote('none');
      const t = window.setTimeout(() => {
        if (monitoringRef.current && !recognitionRef.current) startRecognition();
      }, 350);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // After the tab was hidden the browser may have stopped the microphone or recognition: recover or report.
  useEffect(() => {
    const onVisible = () => {
      if (document.hidden || !monitoringRef.current) return;
      const s = streamRef.current;
      const dead = !s || s.getAudioTracks().every((t) => t.readyState === 'ended');
      if (dead) {
        teardown();
        void startMonitoring(true);
        return;
      }
      if (!recognitionRef.current && speechSupported) startRecognition();
      void audioCtxRef.current?.resume?.().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes the status dialog.
  useEffect(() => {
    if (!showStatus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowStatus(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showStatus]);

  // Release the microphone, timers and recording when leaving the SOS page.
  useEffect(
    () => () => {
      monitoringRef.current = false;
      if (countdownTimerRef.current !== null) window.clearInterval(countdownTimerRef.current);
      if (loudTimerRef.current !== null) window.clearInterval(loudTimerRef.current);
      if (audioCtxRef.current) void audioCtxRef.current.close().catch(() => {});
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      try {
        rec?.stop();
      } catch {
        /* ignore */
      }
      discardRef.current = true;
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => {
        t.onended = null;
        t.stop();
      });
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    },
    []
  );

  /* ---------- render ---------- */

  const statusText: Record<StatusCode, string> = {
    off: D.vmStatusOff,
    active: running ? D.vmStatusActive : warmup ? D.vmStarting : D.vmNotListening,
    stopped: D.vmStatusStopped,
    unsupported: D.vmUnsupported,
    denied: D.vmDenied,
    needsTap: D.vmNeedsTap,
    countdown: D.vmCountdownStatus,
    cancelled: D.vmCancelled,
    prepared: D.vmPreparedStatus,
  };
  const errorText: Record<ErrorCode, string> = {
    denied: D.vmDenied,
    unsupported: D.vmUnsupported,
    noRecorder: D.vmNoRecorder,
    recordFail: D.vmRecordFail,
    shareFail: D.vmShareFail,
  };
  const reasonText = reason ? (reason.kind === 'phrase' ? fill(D.vmReasonPhrase, { p: reason.phrase }) : D.vmReasonLoud) : '';
  const speechText =
    speechNote === 'langUnsupported' ? D.vmLangUnsupported : speechNote === 'unavailable' ? D.vmNoSpeech : speechNote === 'interrupted' ? D.vmSpeechIssue : '';

  const pill = running
    ? { text: D.vmActive, cls: 'border-emerald-300 bg-emerald-100 text-emerald-900', dot: 'bg-emerald-600' }
    : monitoring
    ? warmup
      ? { text: D.vmStarting, cls: 'border-slate-300 bg-white text-slate-700', dot: 'bg-slate-400' }
      : { text: D.vmUnavailable, cls: 'border-slate-300 bg-slate-100 text-slate-700', dot: 'bg-slate-400' }
    : unavailable
    ? { text: D.vmUnavailable, cls: 'border-slate-300 bg-slate-100 text-slate-700', dot: 'bg-slate-400' }
    : { text: D.vmInactive, cls: 'border-slate-300 bg-white text-slate-700', dot: 'bg-slate-400' };

  const mainBtn = 'flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition';

  return (
    <>
      <SosCard id="sos-voice" title={D.vmTitle} desc={D.vmDesc} tone="sky" icon={<ShieldCheck className="h-7 w-7 text-emerald-700" />}>
        <div role="status" aria-live="polite" className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${pill.cls}`}>
          {running ? <Mic className="h-4 w-4" aria-hidden="true" /> : <MicOff className="h-4 w-4" aria-hidden="true" />}
          <span>{pill.text}</span>
          <span className={`h-2.5 w-2.5 rounded-full ${pill.dot}`} aria-hidden="true" />
        </div>

        {monitoring && !warmup && speechText && (
          <p role="status" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700">{speechText}</p>
        )}

        {!monitoring && !unavailable && (
          <button type="button" onClick={() => void startMonitoring(false)} className={`${mainBtn} bg-emerald-700 text-white shadow-sm hover:bg-emerald-800`}>
            <Mic className="h-4 w-4" aria-hidden="true" /> {D.vmEnable}
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowStatus(true)}
          aria-haspopup="dialog"
          className={`${mainBtn} mt-auto border-2 border-[#0A2E65] bg-white text-[#0A2E65] hover:bg-slate-50`}
        >
          {D.vmViewStatus}
        </button>
      </SosCard>

      {/* Status and settings */}
      {showStatus && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={() => setShowStatus(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="vm-status-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="vm-status-title" className="text-base font-extrabold text-[#0A2E65]">{D.vmTitle}</h2>
              <button type="button" onClick={() => setShowStatus(false)} aria-label={D.vmClose} className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${pill.cls}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${pill.dot}`} aria-hidden="true" />
              {pill.text}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">{statusText[statusCode]}</p>
            {speechText && monitoring && <p className="mt-1 text-xs leading-relaxed text-slate-700">{speechText}</p>}
            {errorCode && <p role="alert" className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800">{errorText[errorCode]}</p>}

            <dl className="mt-3 grid grid-cols-1 gap-1.5 text-xs">
              {([[D.vmDetPhrase, detectors.phrase], [D.vmDetLoud, detectors.loud]] as const).map(([label, on]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  <dt className="font-semibold text-slate-800">{label}</dt>
                  <dd className={`font-bold ${on ? 'text-emerald-700' : 'text-slate-500'}`}>{on ? D.vmOn : D.vmOff}</dd>
                </div>
              ))}
            </dl>

            <label htmlFor="vm-countdown" className="mt-4 block text-xs font-bold text-slate-800">
              {D.vmCountdownLabel}
            </label>
            <select
              id="vm-countdown"
              value={prefs.seconds}
              disabled={phase === 'countdown'}
              onChange={(e) => updatePrefs({ seconds: normalizeCountdown(e.target.value) })}
              className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            >
              {COUNTDOWN_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {fill(D.vmSecs, { n })}
                  {n === DEFAULT_COUNTDOWN ? ` ${D.vmRecommended}` : ''}
                </option>
              ))}
            </select>

            <div className="mt-4 flex flex-wrap gap-2">
              {monitoring ? (
                <>
                  <button type="button" onClick={stopMonitoring} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#0A2E65] bg-white px-4 py-2 text-sm font-extrabold text-[#0A2E65]">
                    <MicOff className="h-4 w-4" aria-hidden="true" /> {D.vmStop}
                  </button>
                  {(!running || !detectors.loud || (!detectors.phrase && speechSupported && speechNote !== 'langUnsupported')) && (
                    <button
                      type="button"
                      onClick={() => {
                        teardown();
                        void startMonitoring(false);
                      }}
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-extrabold text-white"
                    >
                      {D.vmRestart}
                    </button>
                  )}
                </>
              ) : (
                !unavailable && (
                  <button type="button" onClick={() => void startMonitoring(false)} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-extrabold text-white">
                    <Mic className="h-4 w-4" aria-hidden="true" /> {D.vmEnable}
                  </button>
                )
              )}
            </div>

            <div className="mt-4 space-y-2 text-[11px] leading-relaxed text-slate-600">
              <p className="flex items-start gap-1.5"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span>{D.vmGuard}</span></p>
              <p className="flex items-start gap-1.5"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span>{D.vmLimits}</span></p>
              <p className="flex items-start gap-1.5"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span>{D.vmPrivacy}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Countdown: shown over everything so it cannot be missed or scrolled away */}
      {phase === 'countdown' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4">
          <div role="alertdialog" aria-modal="true" aria-labelledby="vm-cd-title" aria-describedby="vm-cd-desc" className="w-full max-w-sm rounded-3xl border-2 border-orange-300 bg-white p-6 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              <h2 id="vm-cd-title" className="text-lg font-extrabold">{D.vmDetected}</h2>
            </div>
            <p id="vm-cd-desc" className="mt-1 text-xs text-slate-700">{reasonText}</p>
            <div className="my-4 flex items-center justify-center gap-2 text-5xl font-black text-[#0A2E65]" aria-live="assertive">
              <Timer className="h-8 w-8" aria-hidden="true" />
              <span>{countdown}</span>
            </div>
            {recording && (
              <p className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" aria-hidden="true" /> {D.vmRecording}
              </p>
            )}
            {errorCode && <p className="mb-3 text-xs text-slate-700">{errorText[errorCode]}</p>}
            <button type="button" autoFocus onClick={cancelAlert} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0A2E65] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#072344]">
              {D.vmCancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* Alert prepared: the user must still send it */}
      {phase === 'ready' && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4">
          <div role="alertdialog" aria-modal="true" aria-labelledby="vm-ready-title" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
            <h2 id="vm-ready-title" className="text-base font-extrabold text-[#0A2E65]">{D.vmPreparedTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">{D.vmPreparedDesc}</p>
            <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-800 select-all">{alertMessage}</p>

            {audioUrl && (
              <div className="mt-3 space-y-2">
                <audio controls src={audioUrl} className="w-full" />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void shareAudio()} className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg bg-[#0A2E65] px-3 py-2 text-xs font-bold text-white">
                    <Share2 className="h-4 w-4" aria-hidden="true" /> {D.vmShareAudio}
                  </button>
                  <a href={audioUrl} download="sahayini-emergency-voice.webm" onClick={() => setAudioNotice('downloaded')} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800">
                    <Download className="h-4 w-4" aria-hidden="true" /> {D.vmDownloadAudio}
                  </a>
                </div>
              </div>
            )}
            {audioNotice && (
              <p role="status" className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
                {audioNotice === 'shared' ? D.vmAudioShared : D.vmAudioDownloaded}
              </p>
            )}
            {errorCode && <p role="alert" className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800">{errorText[errorCode]}</p>}

            <div className="mt-3 grid grid-cols-1 gap-2">
              {recipients.selected.length === 0 ? (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">{D.vmNoRecipients}</p>
              ) : (
                recipients.selected.map((c) => (
                  <a key={c.id} href={smsHref([c.phone], alertMessage)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">
                    <PhoneCall className="h-4 w-4" aria-hidden="true" /> {fill(D.vmSmsTo, { name: contactName(c, ss) })}
                  </a>
                ))
              )}
              <a href="tel:112" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-extrabold text-white hover:bg-red-700">
                <PhoneCall className="h-4 w-4" aria-hidden="true" /> {D.call112}
              </a>
            </div>

            {alertCoords ? (
              <a href={mapsLink(alertCoords)} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-800 underline">
                <ExternalLink className="h-4 w-4" aria-hidden="true" /> {D.vmOpenLocation}
              </a>
            ) : (
              <p className="mt-3 text-xs text-slate-600">{D.vmNoLocation}</p>
            )}

            <button type="button" onClick={dismissReady} className="mt-4 min-h-11 w-full cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50">
              {D.vmDismiss}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
