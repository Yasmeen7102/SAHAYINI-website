import { useCallback, useEffect, useRef, useState } from 'react';
import { LanguageCode } from '../types';
import { getBestVoiceForLanguage } from '../utils/speechUtils';

export type ExclusiveSpeechState = 'idle' | 'playing';

/** Splits text into sentence-sized chunks (long utterances get cut off by some browsers). */
function chunkText(text: string, maxLen = 200): string[] {
  const sentences = text.match(/[^.!?।]+[.!?।]*\s*/g) || [text];
  const chunks: string[] = [];
  let current = '';
  const push = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };
  for (const sentence of sentences) {
    if (sentence.length > maxLen) {
      push();
      // Break very long sentences on commas / spaces.
      let rest = sentence;
      while (rest.length > maxLen) {
        let cut = rest.lastIndexOf(',', maxLen);
        if (cut < 40) cut = rest.lastIndexOf(' ', maxLen);
        if (cut < 1) cut = maxLen;
        chunks.push(rest.slice(0, cut + 1).trim());
        rest = rest.slice(cut + 1);
      }
      current = rest;
      continue;
    }
    if ((current + sentence).length > maxLen) push();
    current += sentence;
  }
  push();
  return chunks.filter(Boolean);
}

/**
 * Text-to-speech where only ONE playback can exist at a time.
 * Every call to speak() cancels whatever is playing first (including audio started
 * elsewhere in the app, because it uses the single global speechSynthesis queue), and a
 * token guard ignores late "end"/"error" events from the cancelled playback so the UI
 * state never gets out of sync.
 */
export function useExclusiveSpeech() {
  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const [state, setState] = useState<ExclusiveSpeechState>('idle');
  const [notice, setNotice] = useState('');

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stop = useCallback(() => {
    tokenRef.current += 1;
    clearTimer();
    if (supported) window.speechSynthesis.cancel();
    setState('idle');
  }, [supported]);

  const speak = useCallback(
    (text: string, lang: LanguageCode, voiceUnavailableMessage?: string): boolean => {
      if (!supported) {
        setNotice('Text-to-speech is not supported in this browser.');
        return false;
      }

      // Stop any previous playback before starting a new one.
      tokenRef.current += 1;
      const myToken = tokenRef.current;
      clearTimer();
      window.speechSynthesis.cancel();
      setNotice('');

      const voiceInfo = getBestVoiceForLanguage(lang);
      if (!voiceInfo.isNativeAvailable && lang !== 'en') {
        setState('idle');
        setNotice(
          voiceUnavailableMessage ||
            `No ${voiceInfo.languageName} voice is installed on this device. Please read the text instead.`
        );
        return false;
      }

      const clean = text.replace(/[*#_`>]/g, '').replace(/\s+/g, ' ').trim();
      if (!clean) {
        setState('idle');
        return false;
      }
      const chunks = chunkText(clean);
      setState('playing');

      // Small delay: some browsers drop an utterance queued in the same tick as cancel().
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        if (tokenRef.current !== myToken) return;
        chunks.forEach((chunk, i) => {
          const u = new SpeechSynthesisUtterance(chunk);
          u.lang = voiceInfo.langLocale;
          if (voiceInfo.voice) u.voice = voiceInfo.voice;
          u.rate = 0.95;
          u.onend = () => {
            if (tokenRef.current === myToken && i === chunks.length - 1) setState('idle');
          };
          u.onerror = () => {
            if (tokenRef.current === myToken) setState('idle');
          };
          window.speechSynthesis.speak(u);
        });
      }, 80);

      return true;
    },
    [supported]
  );

  // Never leave audio playing after the component is closed.
  useEffect(() => {
    return () => {
      tokenRef.current += 1;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { state, notice, speak, stop, clearNotice: () => setNotice('') };
}
