import { useCallback, useEffect, useRef, useState } from 'react';
import { Coords } from '../utils/emergencyShare';
import { STALE_AFTER_MS, isLocationStale } from '../utils/sosLogic';
import { rememberLocation } from '../utils/policeMaps';

export type LiveStatus = 'idle' | 'requesting' | 'live' | 'stale' | 'denied' | 'unsupported';

const REFRESH_MS = 20_000;

/**
 * Foreground "live" location sharing for a web page.
 *
 * It asks for permission when started, then re-reads the GPS position every ~20 seconds while the page
 * is open. A browser cannot track in the background, so while the tab is hidden updates may pause;
 * this is reported through `hidden` and never hidden from the user. Nothing is sent anywhere by this
 * hook: it only keeps the latest position fresh so the user can share it with a tap.
 */
export function useLiveLocation() {
  const [status, setStatus] = useState<LiveStatus>('idle');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hidden, setHidden] = useState(typeof document !== 'undefined' ? document.hidden : false);

  const activeRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const lastOkRef = useRef<number | null>(null);
  const wakeRef = useRef<{ release: () => Promise<void> } | null>(null);

  const releaseWake = useCallback(() => {
    try {
      void wakeRef.current?.release();
    } catch {
      /* already released */
    }
    wakeRef.current = null;
  }, []);

  const acquireWake = useCallback(async () => {
    try {
      const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock;
      if (wl && activeRef.current && !wakeRef.current) wakeRef.current = await wl.request('screen');
    } catch {
      /* optional: not supported or denied */
    }
  }, []);

  const readOnce = useCallback(() => {
    if (!activeRef.current) return;
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!activeRef.current) return;
        lastOkRef.current = Date.now();
        const fix = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        rememberLocation(fix); // lets the police-station search reuse the newest GPS fix
        setCoords(fix);
        setLastUpdated(new Date());
        setStatus('live');
      },
      (err) => {
        if (!activeRef.current) return;
        if (err.code === err.PERMISSION_DENIED) {
          activeRef.current = false;
          if (timerRef.current !== null) window.clearInterval(timerRef.current);
          timerRef.current = null;
          releaseWake();
          setStatus('denied');
        } else {
          // Position unavailable or timed out: keep the last known fix and say it cannot be refreshed.
          setStatus('stale');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [releaseWake]);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    releaseWake();
    setStatus('idle');
  }, [releaseWake]);

  const start = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }
    if (activeRef.current) return;
    activeRef.current = true;
    lastOkRef.current = null;
    setStatus('requesting');
    readOnce();
    timerRef.current = window.setInterval(readOnce, REFRESH_MS);
    void acquireWake();
  }, [acquireWake, readOnce]);

  // Page visibility: refresh immediately when the user comes back, and re-acquire the wake lock.
  useEffect(() => {
    const onVis = () => {
      setHidden(document.hidden);
      if (!document.hidden && activeRef.current) {
        readOnce();
        void acquireWake();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [acquireWake, readOnce]);

  // Mark the fix as stale if no update arrived for too long.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (activeRef.current && isLocationStale(lastOkRef.current, Date.now(), STALE_AFTER_MS)) setStatus('stale');
    }, 10_000);
    return () => window.clearInterval(id);
  }, []);

  // Stop everything when leaving the SOS page.
  useEffect(
    () => () => {
      activeRef.current = false;
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      try {
        void wakeRef.current?.release();
      } catch {
        /* ignore */
      }
    },
    []
  );

  return { status, coords, lastUpdated, hidden, isActive: status === 'requesting' || status === 'live' || status === 'stale', start, stop };
}

export type LiveLocation = ReturnType<typeof useLiveLocation>;
