import { useCallback, useRef, useState } from 'react';
import { Coords } from '../utils/emergencyShare';
import { openPoliceSearch } from '../utils/policeMaps';
import { getPoliceMapsStrings } from '../i18n/policeMapsStrings';
import { LanguageCode } from '../types';

/**
 * Shared click behaviour for every "Find Nearby Police Stations" / "Find Your Police Station" button.
 * `search()` opens Google Maps immediately (see utils/policeMaps.ts). It never waits for, or depends on,
 * the SAHAYINI station-list API. `coords` is returned so a page can optionally load its in-page list.
 */
export function usePoliceSearch(language: LanguageCode) {
  const P = getPoliceMapsStrings(language);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const runId = useRef(0);

  const search = useCallback(
    async (manualPlace?: string) => {
      const id = ++runId.current;
      setBusy(true);
      setNote(null);
      setFallbackUrl(null);
      try {
        const r = await openPoliceSearch({ manualPlace, loadingText: P.opening });
        if (id !== runId.current) return r;
        setCoords(r.coords);
        if (!r.opened) {
          setNote(P.noteBlocked);
          setFallbackUrl(r.url);
        } else if (r.gpsIssue) {
          setNote(P.noteGeneral);
        }
        return r;
      } finally {
        if (id === runId.current) setBusy(false);
      }
    },
    [P]
  );

  return { search, busy, note, fallbackUrl, coords, P };
}
