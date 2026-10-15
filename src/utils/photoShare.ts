/**
 * Helpers for sharing a captured photo + GPS location from the "Capture The Location" card.
 * Pure functions, so they can be unit-tested without a browser.
 */
import { Coords, mapsLink } from './emergencyShare';

export interface CapturedFix extends Coords {
  accuracy: number;
  capturedAt: Date;
}

export interface MessageStation {
  name: string;
  phone?: string;
}

/** The emergency message. Uses the real captured coordinates only. */
export function buildCaptureMessage(c: CapturedFix, station?: MessageStation | null): string {
  const base = `🚨 EMERGENCY from SAHAYINI: I need help. My current location: ${mapsLink(c)} (lat ${c.lat.toFixed(6)}, lng ${c.lng.toFixed(6)}, accuracy ±${Math.round(c.accuracy)} m, captured ${c.capturedAt.toLocaleString()}).`;
  const near = station ? ` Nearest police station: ${station.name}${station.phone ? ` (${station.phone})` : ''}.` : '';
  return `${base}${near} Please call me.`;
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

/** Maps a getUserMedia / camera error to a message the user can act on. */
export function cameraErrorMessage(err: unknown): string {
  const name = (err as { name?: string })?.name || '';
  if (name === 'NotAllowedError' || name === 'SecurityError')
    return 'Camera permission was denied (or the page is not secure). Allow camera access in your browser settings, or choose an existing photo instead.';
  if (name === 'NotFoundError' || name === 'OverconstrainedError')
    return 'No camera was found on this device. Choose an existing photo instead.';
  if (name === 'NotReadableError' || name === 'AbortError')
    return 'The camera is in use by another app or could not start. Close other apps using the camera, or choose an existing photo instead.';
  return 'The camera could not be started. Choose an existing photo instead.';
}
