import React, { useRef, useState } from 'react';
import { Siren, Loader2, MapPin, Navigation, ExternalLink, Search } from 'lucide-react';
import { Coords } from '../../utils/emergencyShare';
import { NearbyStation, fetchNearbyPolice } from '../../utils/nearbyPolice';
import { mapsPoliceSearchUrl } from '../../utils/complaintDraft';
import { policeMapsUrl } from '../../utils/policeMaps';
import { usePoliceSearch } from '../../hooks/usePoliceSearch';
import { useApp } from '../../context/AppContext';
import { ComplaintStrings } from '../../i18n/complaintStrings';
import { PoliceSearchNote } from './PoliceSearchNote';

type Phase = 'idle' | 'loading' | 'done';

/**
 * "Find Nearby Police Stations" for Complaint & FIR Support.
 * - The button opens Google Maps immediately through the shared usePoliceSearch behaviour (latest GPS fix, or a
 *   general police-station search when GPS is unavailable). It does not wait for the SAHAYINI station list.
 * - The in-page station list (existing /api/nearby-police backend: Google Places / OpenStreetMap) is an optional
 *   extra loaded in the background when coordinates are known. If it fails nothing is shown: Maps already opened.
 * - If location is unavailable the user can type an area and search Google Maps.
 */
export const ComplaintPoliceFinder: React.FC<{ cs: ComplaintStrings }> = ({ cs }) => {
  const { language } = useApp();
  const { search, busy: opening, note, fallbackUrl, P } = usePoliceSearch(language);
  const [phase, setPhase] = useState<Phase>('idle');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [stations, setStations] = useState<NearbyStation[] | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState('');
  const listRun = useRef(0);

  const loadList = async (c: Coords) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    const id = ++listRun.current;
    setPhase('loading');
    try {
      const r = await fetchNearbyPolice(c);
      if (id !== listRun.current) return;
      setCoords(c);
      setStations(r.stations);
      setPhase('done');
    } catch {
      if (id === listRun.current) setPhase('idle');
    }
  };

  const run = async () => {
    const r = await search();
    if (!r) return;
    if (r.gpsIssue) setShowManual(true); // location unavailable: offer manual entry
    if (r.coords) void loadList(r.coords);
  };

  const busy = opening || phase === 'loading';

  return (
    <section aria-labelledby="cs-police-title" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#123A70] text-[#FF9933] flex items-center justify-center shrink-0">
            <Siren className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="cs-police-title" className="text-base font-bold text-slate-900">{cs.findPolice}</h3>
            <p className="text-xs text-slate-600">{cs.findPoliceDesc}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={opening}
          className="px-4 py-2.5 min-h-11 bg-[#123A70] hover:bg-[#0d2d57] disabled:opacity-70 text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
          <span>{opening ? cs.locating : phase === 'loading' ? cs.searching : `🚔 ${cs.findPolice}`}</span>
        </button>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        <PoliceSearchNote note={note} fallbackUrl={fallbackUrl} linkLabel={P.openLink} />

        {coords && phase === 'done' && (
          <a
            href={policeMapsUrl(coords)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> {P.openLink}
          </a>
        )}

        {phase === 'done' && stations && stations.length === 0 && (
          <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
            No police stations were found in the map data near you. Use the Google Maps button above, or call 112.
          </p>
        )}

        {phase === 'done' && stations && stations.length > 0 && (
          <ul className="space-y-3">
            {stations.map((s) => (
              <li key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                  <span className="shrink-0 font-bold text-[#123A70]">{s.distanceKm.toFixed(1)} km</span>
                </div>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#123A70]" aria-hidden="true" />
                  <span>{s.address || 'Address not available'}</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-11 bg-white border border-slate-300 rounded-lg font-bold text-slate-900">
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View on Map
                  </a>
                  <a href={s.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-11 bg-[#123A70] text-white rounded-lg font-bold">
                    <Navigation className="w-3.5 h-3.5" aria-hidden="true" /> Get Directions
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="text-[11px] text-slate-600 leading-relaxed">{P.notAlert}</p>

        {/* Manual location entry: shown automatically when permission is denied / unavailable */}
        {!showManual && phase !== 'done' && (
          <button
            type="button"
            onClick={() => setShowManual(true)}
            className="text-xs font-bold text-[#123A70] underline cursor-pointer min-h-11"
          >
            {cs.manualTitle}
          </button>
        )}
        {showManual && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <label htmlFor="cs-manual-location" className="block text-xs font-bold text-slate-900">{cs.manualTitle}</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="cs-manual-location"
                type="text"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder={cs.manualPlaceholder}
                className="flex-1 px-3 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              {manual.trim() ? (
                <a
                  href={mapsPoliceSearchUrl(manual)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-11 bg-[#123A70] text-white rounded-lg text-xs font-bold"
                >
                  <Search className="w-3.5 h-3.5" aria-hidden="true" /> {cs.manualSearch}
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-11 bg-slate-300 text-slate-600 rounded-lg text-xs font-bold"
                >
                  <Search className="w-3.5 h-3.5" aria-hidden="true" /> {cs.manualSearch}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
