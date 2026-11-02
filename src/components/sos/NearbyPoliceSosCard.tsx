import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2, MapPin, Phone, Shield } from 'lucide-react';
import { SosCard } from './SosCard';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { fill, getLocationStrings } from '../../i18n/locationStrings';
import { NearbyStation, fetchNearbyPolice, telHref } from '../../utils/nearbyPolice';
import { Coords } from '../../utils/emergencyShare';
import { usePoliceSearch } from '../../hooks/usePoliceSearch';
import { PoliceSearchNote } from '../common/PoliceSearchNote';
import { LanguageCode } from '../../types';

const SAVED_KEY = 'sahayini_saved_police';
const MAX_SHOWN = 3;

interface Saved {
  savedAt: string;
  stations: NearbyStation[];
}

const loadSaved = (): Saved | null => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Saved;
    return p && Array.isArray(p.stations) && p.stations.length ? p : null;
  } catch {
    return null;
  }
};

const persist = (stations: NearbyStation[]) => {
  try {
    const data: Saved = { savedAt: new Date().toISOString(), stations: stations.slice(0, 5) };
    localStorage.setItem(SAVED_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: results still show for this session */
  }
};

type Phase = 'idle' | 'loading' | 'done';

/**
 * Compact "Find Nearby Police Stations" tile.
 * Clicking it opens Google Maps straight away through the shared usePoliceSearch behaviour (latest GPS fix,
 * or a general search when GPS is unavailable). The SAHAYINI station list below is an optional extra: it is
 * loaded in the background when coordinates are known, saved on the device for offline reading, and any
 * failure is silent because Google Maps has already opened. Finding a station never alerts the police.
 */
export const NearbyPoliceSosCard: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const D = getSosDashStrings(language);
  const L = getLocationStrings(language);
  const { search, busy: opening, note, fallbackUrl, P } = usePoliceSearch(language);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stations, setStations] = useState<NearbyStation[]>([]);
  const [saved, setSaved] = useState<Saved | null>(null);
  const listRun = useRef(0);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const loadList = async (c: Coords) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    const id = ++listRun.current;
    setPhase('loading');
    try {
      const r = await fetchNearbyPolice(c);
      if (id !== listRun.current) return;
      setStations(r.stations);
      if (r.stations.length) {
        persist(r.stations);
        setSaved(loadSaved());
      }
      setPhase('done');
    } catch {
      // Optional list only: Google Maps is already open, so no error banner.
      if (id === listRun.current) setPhase('idle');
    }
  };

  const run = async () => {
    const r = await search();
    if (r?.coords) void loadList(r.coords);
  };

  const busy = opening || phase === 'loading';
  // Live results win; otherwise fall back to the saved list so it stays readable offline.
  const showingSaved = phase !== 'done' && !!saved;
  const list = (phase === 'done' ? stations : showingSaved ? saved!.stations : []).slice(0, MAX_SHOWN);
  const savedDate = saved ? new Date(saved.savedAt).toLocaleDateString() : '';

  return (
    <SosCard id="sos-police" title={D.npTitle} desc={D.npDesc} tone="sky" icon={<Shield className="h-6 w-6" />}>
      <button
        type="button"
        onClick={run}
        disabled={opening}
        className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0A2E65] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#072344] disabled:opacity-70"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <MapPin className="h-4 w-4" aria-hidden="true" />}
        <span>{opening ? D.npLocating : phase === 'loading' ? D.npSearching : phase === 'done' || showingSaved ? D.npAgain : D.npTitle}</span>
      </button>

      <div aria-live="polite" className="space-y-2">
        <PoliceSearchNote note={note} fallbackUrl={fallbackUrl} linkLabel={P.openLink} />

        {phase === 'done' && stations.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">{D.npNone}</p>
        )}

        {showingSaved && list.length > 0 && (
          <p className="text-[11px] text-slate-600">{fill(D.npSavedFrom, { date: savedDate })}</p>
        )}

        {list.length > 0 && (
          <ul className="space-y-2">
            {list.map((s) => {
              const tel = s.phone ? telHref(s.phone) : '';
              return (
                <li key={s.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-snug text-slate-900">{s.name}</h3>
                    <span className="shrink-0 font-bold text-[#0A2E65]">{s.distanceKm.toFixed(1)} km</span>
                  </div>
                  <p className="mt-1 text-slate-600">{s.address || L.addrNA}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={s.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0A2E65] px-3 py-2 font-bold text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> {D.npOpenMaps}
                    </a>
                    {tel && (
                      <a
                        href={tel}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-800"
                      >
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {L.callStation}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-auto text-[11px] leading-relaxed text-slate-600">{D.npNotAlert}</p>
    </SosCard>
  );
};
