/**
 * One shared "Find Nearby Police Stations" behaviour for every page that has the button
 * (SOS, Share Your Location, Complaint & FIR Support).
 *
 * Clicking the button opens Google Maps straight away with a police-station search around the user's
 * latest GPS position. The SAHAYINI station-list API is NOT needed for this, so Maps still opens when
 * that service is down, slow or offline-first. If GPS is unavailable a general "police stations near me"
 * search is opened instead (Google Maps then uses its own location permission), or the user can type an
 * area. Searching never contacts or alerts the police.
 */
import { Coords } from './emergencyShare';
import { mapsPoliceSearchUrl } from './complaintDraft';

const FIX_KEY = 'sahayini_latest_fix';
/** A GPS fix newer than this is reused so Maps opens instantly. */
const RECENT_MS = 3 * 60_000;
const GPS_TIMEOUT_MS = 8000;

let memo: { c: Coords; at: number } | null = null;

/** Remember the newest GPS fix (session only, never sent anywhere). Called by live sharing / capture / this module. */
export function rememberLocation(c: Coords, at: number = Date.now()): void {
  if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return;
  memo = { c: { lat: c.lat, lng: c.lng, accuracy: c.accuracy }, at };
  try {
    sessionStorage.setItem(FIX_KEY, JSON.stringify(memo));
  } catch {
    /* storage blocked: the in-memory copy still works */
  }
}

export function getLatestLocation(maxAgeMs: number = RECENT_MS, now: number = Date.now()): Coords | null {
  let m = memo;
  if (!m) {
    try {
      const raw = sessionStorage.getItem(FIX_KEY);
      if (raw) m = JSON.parse(raw);
    } catch {
      m = null;
    }
  }
  if (!m || !m.c || typeof m.at !== 'number') return null;
  return now - m.at <= maxAgeMs ? m.c : null;
}

/** Google Maps URL listing police stations around the coordinates, or a general search without them. */
export function policeMapsUrl(c?: Coords | null): string {
  return c
    ? `https://www.google.com/maps/search/police+stations/@${c.lat},${c.lng},14z`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('police stations near me')}`;
}

export type GpsIssue = 'denied' | 'timeout' | 'unavailable' | 'unsupported';

export interface PoliceOpenResult {
  url: string;
  mode: 'recent' | 'gps' | 'general' | 'manual';
  /** Coordinates used for the search, if any (lets callers load the optional in-page station list). */
  coords: Coords | null;
  /** False if the browser blocked the new tab; the caller should show `url` as a plain link. */
  opened: boolean;
  gpsIssue?: GpsIssue;
}

function readFix(timeoutMs: number): Promise<{ c: Coords } | { issue: GpsIssue }> {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: { c: Coords } | { issue: GpsIssue }) => {
      if (done) return;
      done = true;
      window.clearTimeout(guard);
      resolve(v);
    };
    // Some browsers never answer while a permission prompt is ignored, so never wait forever.
    const guard = window.setTimeout(() => finish({ issue: 'timeout' }), timeoutMs + 1000);
    navigator.geolocation.getCurrentPosition(
      (p) => finish({ c: { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy } }),
      (e) => finish({ issue: e.code === e.PERMISSION_DENIED ? 'denied' : e.code === e.TIMEOUT ? 'timeout' : 'unavailable' }),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 }
    );
  });
}

async function permissionState(): Promise<string | null> {
  try {
    const perms = (navigator as unknown as { permissions?: { query: (d: { name: string }) => Promise<{ state: string }> } }).permissions;
    return perms ? (await perms.query({ name: 'geolocation' })).state : null;
  } catch {
    return null;
  }
}

function openTab(url: string): Window | null {
  const w = window.open(url, '_blank');
  if (w) {
    try {
      w.opener = null;
    } catch {
      /* cross-origin already */
    }
  }
  return w;
}

function navigateTab(w: Window | null, url: string): boolean {
  if (!w) return false;
  try {
    w.location.href = url;
    return true;
  } catch {
    return false;
  }
}

/**
 * Call this directly from a click handler. The new tab is opened synchronously (so popup blockers allow it)
 * and is then pointed at the best search URL available.
 */
export async function openPoliceSearch(opts: { manualPlace?: string; loadingText?: string } = {}): Promise<PoliceOpenResult> {
  const place = opts.manualPlace?.trim();
  if (place) {
    const url = mapsPoliceSearchUrl(place);
    return { url, mode: 'manual', coords: null, opened: !!openTab(url) };
  }

  const recent = getLatestLocation();
  if (recent) {
    const url = policeMapsUrl(recent);
    return { url, mode: 'recent', coords: recent, opened: !!openTab(url) };
  }

  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    const url = policeMapsUrl(null);
    return { url, mode: 'general', coords: null, opened: !!openTab(url), gpsIssue: 'unsupported' };
  }

  // No recent fix: open the tab now (still inside the click), then fill in the URL once GPS answers.
  const tab = openTab('about:blank');
  try {
    if (tab) {
      tab.document.title = 'Google Maps';
      tab.document.body.style.cssText = 'font-family:system-ui,sans-serif;padding:24px;color:#334155';
      tab.document.body.textContent = opts.loadingText || 'Opening Google Maps…';
    }
  } catch {
    /* placeholder is cosmetic */
  }

  const finishWith = (url: string, mode: 'gps' | 'general', coords: Coords | null, gpsIssue?: GpsIssue): PoliceOpenResult => {
    const ok = navigateTab(tab, url);
    if (!ok && tab) {
      try {
        tab.close();
      } catch {
        /* ignore */
      }
    }
    return { url, mode, coords, opened: ok, gpsIssue };
  };

  if ((await permissionState()) === 'denied') return finishWith(policeMapsUrl(null), 'general', null, 'denied');

  const fix = await readFix(GPS_TIMEOUT_MS);
  if ('c' in fix) {
    rememberLocation(fix.c);
    return finishWith(policeMapsUrl(fix.c), 'gps', fix.c);
  }
  return finishWith(policeMapsUrl(null), 'general', null, fix.issue);
}
