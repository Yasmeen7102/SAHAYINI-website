/**
 * Helpers for sharing a captured photo + GPS location from the "Capture The Location" card.
 * Pure functions, so they can be unit-tested without a browser.
 */
import { Coords, mapsLink } from './emergencyShare';
import { LanguageCode } from '../types';
import { getLocationStrings, fill } from '../i18n/locationStrings';

export interface CapturedFix extends Coords {
  accuracy: number;
  capturedAt: Date;
}

export interface MessageStation {
  name: string;
  phone?: string;
}

/** The emergency message (in the selected language). Uses the real captured coordinates only. */
export function buildCaptureMessage(c: CapturedFix, station?: MessageStation | null, lang: LanguageCode = 'en'): string {
  const L = getLocationStrings(lang);
  const base = fill(L.msgCapture, { link: mapsLink(c), lat: c.lat.toFixed(6), lng: c.lng.toFixed(6), m: Math.round(c.accuracy), time: c.capturedAt.toLocaleString() });
  const near = station
    ? station.phone
      ? fill(L.msgNearPhone, { name: station.name, phone: station.phone })
      : fill(L.msgNear, { name: station.name })
    : '';
  return `${base}${near}${L.msgCall}`;
}

/** True only if this browser can share the given files through the native share sheet. */
export function canShareFiles(files: File[]): boolean {
  try {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files })
    );
  } catch {
    return false;
  }
}

/** Scales (w,h) down so the longer side is at most `max`, keeping the aspect ratio. */
export function fitWithin(w: number, h: number, max: number): { width: number; height: number } {
  const longest = Math.max(w, h);
  if (longest <= max || longest === 0) return { width: w, height: h };
  const k = max / longest;
  return { width: Math.round(w * k), height: Math.round(h * k) };
}

export function photoFileName(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `sahayini-location-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.jpg`;
}

/** Maps a getUserMedia / camera error to a message the user can act on (selected language). */
export function cameraErrorMessage(err: unknown, lang: LanguageCode = 'en'): string {
  const L = getLocationStrings(lang);
  const name = (err as { name?: string })?.name || '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return L.camDenied;
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return L.camNone;
  if (name === 'NotReadableError' || name === 'AbortError') return L.camBusy;
  return L.camOther;
}
