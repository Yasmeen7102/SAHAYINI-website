import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Loader2, AlertTriangle, ExternalLink, Send, Copy, Check, Share2, Info, Camera, ImagePlus, RefreshCw, Trash2, Phone, Navigation, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLocationStrings, fill, LocationStrings } from '../../i18n/locationStrings';
import { mapsLink, smsHref, whatsappHref, isIndianMobile } from '../../utils/emergencyShare';
import { NearbyStation, fetchNearbyPolice, NearbyPoliceError, telHref } from '../../utils/nearbyPolice';
import { CapturedFix, buildCaptureMessage, canShareFiles, cameraErrorMessage, fitWithin, photoFileName } from '../../utils/photoShare';

type Capture = CapturedFix;
type PoliceState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'found'; station: NearbyStation }
  | { status: 'none' }
  | { status: 'error'; message: string };

const geoErrorMessage = (err: GeolocationPositionError, L: LocationStrings): string => {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return L.geoDenied;
    case err.POSITION_UNAVAILABLE:
      return L.geoUnavailable;
    case err.TIMEOUT:
      return L.geoTimeout;
    default:
      return L.geoOther;
  }
};

/**
 * Captures a fresh GPS fix and helps the user send it to chosen saved contacts.
 * Opening a message app only PREPARES a message. The browser cannot tell whether it was sent.
 */
export const CaptureLocationCard: React.FC = () => {
  const { contacts, language } = useApp();
  const L = getLocationStrings(language);
  const [capture, setCapture] = useState<Capture | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);

  // Photo (kept in memory on this device only; never uploaded by SAHAYINI)
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nearest police station (same service as the "Find Nearby Police Stations" card)
  const [includePolice, setIncludePolice] = useState(false);
  const [police, setPolice] = useState<PoliceState>({ status: 'idle' });
  const [consent, setConsent] = useState(false);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  // Release the camera and the preview URL when the card goes away.
  const photoUrlRef = useRef<string | null>(null);
  photoUrlRef.current = photo?.url ?? null;
  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    },
    []
  );

  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => setPhotoError(L.previewFail));
    }
  }, [cameraOn]);

  const replacePhoto = (file: File | null) => {
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return file ? { file, url: URL.createObjectURL(file) } : null;
    });
  };

  const startCamera = async () => {
    setPhotoError(null);
    setNotice(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setPhotoError('Camera access is not available here (it needs a supported browser and a secure https connection). Choose an existing photo instead.');
      return;
    }
    setCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = stream;
      setCameraOn(true);
    } catch (e) {
      setPhotoError(cameraErrorMessage(e, language));
    } finally {
      setCameraStarting(false);
    }
  };

  const takeSnapshot = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth || !v.videoHeight) {
      setPhotoError(L.cameraNotReady);
      return;
    }
    const { width, height } = fitWithin(v.videoWidth, v.videoHeight, 1600);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(v, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setPhotoError(L.saveFail);
          return;
        }
        replacePhoto(new File([blob], photoFileName(new Date()), { type: 'image/jpeg' }));
        setPhotoError(null);
        stopCamera();
      },
      'image/jpeg',
      0.85
    );
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ''; // allow choosing the same file again
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setPhotoError(L.pickImage);
      return;
    }
    stopCamera();
    setPhotoError(null);
    replacePhoto(f);
  };

  const removePhoto = () => {
    replacePhoto(null);
    setPhotoError(null);
    setNotice(null);
  };

  const loadPolice = async (c: Capture) => {
    setPolice({ status: 'loading' });
    try {
      const r = await fetchNearbyPolice(c);
      setPolice(r.stations.length ? { status: 'found', station: r.stations[0] } : { status: 'none' });
    } catch (e) {
      const err = e instanceof NearbyPoliceError ? e : null;
      setPolice({
        status: 'error',
        message:
          err?.kind === 'offline'
            ? 'You appear to be offline, so the nearest station cannot be looked up. You can still send to your contacts by SMS, or call 112.'
            : err?.message || 'The nearest police station could not be looked up. Call 112 if you need help.',
      });
    }
  };

  const togglePolice = () => {
    const next = !includePolice;
    setIncludePolice(next);
    if (next && capture && police.status !== 'found' && police.status !== 'loading') loadPolice(capture);
  };

  const capturePosition = () => {
    setError(null);
    setNotice(null);
    if (!('geolocation' in navigator)) {
      setError('This browser does not support location access. Please call 112 or use another browser.');
      return;
    }
    const id = ++requestId.current;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (id !== requestId.current) return;
        const fix: Capture = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          capturedAt: new Date(pos.timestamp || Date.now()),
        };
        setCapture(fix);
        setConsent(false);
        setBusy(false);
        // The position changed, so the nearest station must be looked up again.
        setPolice({ status: 'idle' });
        if (includePolice) loadPolice(fix);
      },
      (err) => {
        if (id !== requestId.current) return;
        setBusy(false);
        setError(geoErrorMessage(err, L));
      },
      // maximumAge 0 = never reuse a cached position; always a fresh fix.
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const policeStation = includePolice && police.status === 'found' ? police.station : null;
  // Only a real mobile number can receive SMS (landlines cannot).
  const policeSmsPhone = policeStation?.phone?.split(/[;,/]/).map((x) => x.trim()).find((x) => isIndianMobile(x)) || '';
  const link = capture ? mapsLink(capture) : '';
  const message = capture ? buildCaptureMessage(capture, policeStation, language) : '';

  const chosen = contacts.filter((c) => selected.has(c.id));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setNotice(L.copied);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice(L.copyFail);
    }
  };

  const requireConsent = (e?: React.SyntheticEvent): boolean => {
    if (consent) return true;
    e?.preventDefault();
    setNotice(L.tickConsent);
    return false;
  };

  const recipientNames = [...chosen.map((c) => c.name), ...(policeStation ? [policeStation.name] : [])];

  const nativeShare = async () => {
    if (!requireConsent()) return;
    const files = photo ? [photo.file] : [];
    const withFile = photo ? canShareFiles(files) : false;
    try {
      await navigator.share(withFile ? { title: L.capTitle, text: message, files } : { title: L.capTitle, text: message });
      setNotice(
        (withFile ? L.shareOpenedPhoto : photo ? L.sharePhotoUnsupported : L.shareOpened) +
          (recipientNames.length ? fill(L.shareChoose, { names: recipientNames.join(', ') }) : '') +
          L.shareCantTell
      );
    } catch (e) {
      if ((e as { name?: string })?.name !== 'AbortError') {
        setNotice(L.shareFail);
      }
      /* AbortError = the user closed the share sheet */
    }
  };

  return (
    <section aria-labelledby="capture-loc-title" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Crosshair className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="capture-loc-title" className="text-base font-bold text-slate-900">{L.capTitle}</h3>
            <p className="text-xs text-slate-600">
              {L.capDesc}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={capturePosition}
          disabled={busy}
          className="px-4 py-2.5 min-h-11 bg-[#0A2E65] hover:bg-[#072344] disabled:opacity-70 text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : null}
          <span>{busy ? L.capBusy : L.capBtn}</span>
        </button>
      </div>

      <div aria-live="polite" className="mt-4 space-y-3">
        {error && (
          <div role="alert" className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{error} {L.inDanger}</span>
          </div>
        )}

        {capture && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-800">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex justify-between gap-2"><dt className="font-bold">{L.lat}</dt><dd className="font-mono">{capture.lat.toFixed(6)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="font-bold">{L.lng}</dt><dd className="font-mono">{capture.lng.toFixed(6)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="font-bold">{L.accuracy}</dt><dd className="font-mono">±{Math.round(capture.accuracy)} m</dd></div>
              <div className="flex justify-between gap-2"><dt className="font-bold">{L.capturedAt}</dt><dd className="font-mono">{capture.capturedAt.toLocaleTimeString()}</dd></div>
            </dl>
            {capture.accuracy > 100 && (
              <p className="text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2">
                {fill(L.lowAccuracy, { m: Math.round(capture.accuracy) })}
              </p>
            )}

            <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-bold text-[#0A2E65] underline break-all">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {link}
            </a>

            <div>
              <p className="font-bold mb-1">{L.preparedMsg}</p>
              <p className="p-2.5 bg-white rounded-xl border border-slate-200 leading-relaxed break-words select-all">{message}</p>
            </div>

            {/* Photo (part of this location feature) */}
            <div className="space-y-2">
              <p className="font-bold">{L.addPhoto}</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} className="sr-only" aria-label={L.choosePhotoAria} tabIndex={-1} />

              {cameraOn && (
                <div className="space-y-2">
                  <video ref={videoRef} playsInline muted className="w-full max-h-72 rounded-xl bg-black object-contain" aria-label={L.cameraAria} />
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={takeSnapshot} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold text-white bg-[#0A2E65] cursor-pointer">
                      <Camera className="w-3.5 h-3.5" aria-hidden="true" /> {L.takePhoto}
                    </button>
                    <button type="button" onClick={stopCamera} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 cursor-pointer">
                      {L.cancel}
                    </button>
                  </div>
                </div>
              )}

              {photo && !cameraOn && (
                <div className="space-y-2">
                  <img src={photo.url} alt={L.photoAlt} className="w-full max-h-72 rounded-xl border border-slate-200 bg-white object-contain" />
                  <p className="text-[11px] text-slate-600">{fill(L.photoStays, { name: photo.file.name, kb: (photo.file.size / 1024).toFixed(0) })}</p>
                </div>
              )}

              {!cameraOn && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={startCamera} disabled={cameraStarting} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 cursor-pointer">
                    {cameraStarting ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : photo ? <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> : <Camera className="w-3.5 h-3.5" aria-hidden="true" />}
                    {photo ? L.retake : L.takeAPhoto}
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 cursor-pointer">
                    <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" /> {L.chooseExisting}
                  </button>
                  {photo && (
                    <>
                      <a href={photo.url} download={photo.file.name} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800">
                        <Download className="w-3.5 h-3.5" aria-hidden="true" /> {L.savePhoto}
                      </a>
                      <button type="button" onClick={removePhoto} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-red-300 text-red-800 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> {L.removePhoto}
                      </button>
                    </>
                  )}
                </div>
              )}

              {photoError && (
                <div role="alert" className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex items-start gap-2 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{photoError}</span>
                </div>
              )}
              {photo && !canShareFiles([photo.file]) && (
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {L.noShareFiles}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="font-bold mb-1.5">{L.chooseWho}</legend>
              {contacts.length === 0 ? (
                <p className="text-amber-950 bg-amber-50 border border-amber-300 rounded-xl p-2.5">
                  {L.noContacts}
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {contacts.map((c) => (
                    <li key={c.id}>
                      <label className="flex items-center gap-2.5 p-2.5 min-h-11 rounded-xl border border-slate-200 bg-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={() => toggle(c.id)}
                          className="w-4 h-4 accent-[#0A2E65]"
                        />
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-slate-600 font-mono">({c.phone})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>

            {/* Nearest police station as an extra recipient (same lookup as "Find Nearby Police Stations") */}
            <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
              <label className="flex items-center gap-2.5 min-h-11 cursor-pointer">
                <input type="checkbox" checked={includePolice} onChange={togglePolice} className="w-4 h-4 accent-[#0A2E65]" />
                <span className="font-bold text-slate-900">{L.includePolice}</span>
              </label>
              {includePolice && police.status === 'loading' && (
                <p className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> {L.lookingUp}</p>
              )}
              {includePolice && police.status === 'error' && (
                <p role="alert" className="text-amber-950 bg-amber-50 border border-amber-300 rounded-lg p-2 leading-relaxed">
                  {police.message}{' '}
                  <button type="button" onClick={() => capture && loadPolice(capture)} className="underline font-bold cursor-pointer">{L.tryAgain}</button>
                </p>
              )}
              {includePolice && police.status === 'none' && (
                <p className="text-slate-800 leading-relaxed">
                  {L.noStationA}<a href="tel:112" className="font-extrabold underline">112</a>{L.noStationB}
                </p>
              )}
              {policeStation && (
                <div className="space-y-2">
                  <div>
                    <p className="font-bold text-slate-900">{policeStation.name} · {policeStation.distanceKm.toFixed(1)} km</p>
                    <p>{policeStation.address || L.addrNA}</p>
                    <p className="font-mono">{policeStation.phone ? fill(L.phoneLbl, { p: policeStation.phone }) : L.noPhone}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {policeStation.phone && telHref(policeStation.phone) && (
                      <a href={telHref(policeStation.phone)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold text-white bg-red-700 hover:bg-red-800">
                        <Phone className="w-3.5 h-3.5" aria-hidden="true" /> {L.callStation}
                      </a>
                    )}
                    {policeSmsPhone && (
                      <a
                        href={smsHref([policeSmsPhone], message)}
                        onClick={(e) => {
                          if (!requireConsent(e)) return;
                          setNotice(L.smsStationOpened);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800"
                      >
                        <Send className="w-3.5 h-3.5" aria-hidden="true" /> {L.smsStation}
                      </a>
                    )}
                    <a href={policeStation.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800">
                      <Navigation className="w-3.5 h-3.5" aria-hidden="true" /> {L.directions}
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {L.stationDisclaimer}
                  </p>
                </div>
              )}
            </div>

            {!online && (
              <p className="text-amber-950 bg-amber-50 border border-amber-300 rounded-lg p-2 leading-relaxed">
                {L.offline}
              </p>
            )}

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-300 bg-white cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#0A2E65]" />
              <span className="leading-relaxed">
                <strong>{L.consentStrong}</strong>{fill(L.consentRest, { photo: photo ? L.consentPhoto : '' })}
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              <a
                href={chosen.length ? smsHref(chosen.map((c) => c.phone), message) : undefined}
                aria-disabled={!chosen.length}
                onClick={(e) => {
                  if (!requireConsent(e)) return;
                  if (!chosen.length) {
                    e.preventDefault();
                    setNotice(L.selectContact);
                    return;
                  }
                  setNotice(fill(L.smsContactsOpened, { n: chosen.length }) + (photo ? L.smsPhotoHint : ''));
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold text-white ${chosen.length ? 'bg-blue-700 hover:bg-blue-800' : 'bg-slate-400 cursor-not-allowed'}`}
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" /> {L.openSms}
              </a>

              {chosen.filter((c) => isIndianMobile(c.phone)).map((c) => (
                <a
                  key={c.id}
                  href={whatsappHref(c.phone, message)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!requireConsent(e)) return;
                    setNotice(fill(L.waOpened, { name: c.name }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
                >
                  {fill(L.whatsapp, { name: c.name })}
                </a>
              ))}

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button type="button" onClick={nativeShare} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" aria-hidden="true" /> {photo ? L.sharePhoto : L.share}
                </button>
              )}

              <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 cursor-pointer">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                {L.copyMsg}
              </button>

              <button type="button" onClick={capturePosition} disabled={busy} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 cursor-pointer">
                {L.recapture}
              </button>
            </div>

            {notice && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">{notice}</div>
            )}
          </div>
        )}

        <p className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {L.footer}
          </span>
        </p>
      </div>
    </section>
  );
};
