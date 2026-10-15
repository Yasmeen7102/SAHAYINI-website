import React, { useRef, useState } from 'react';
import { Siren, Loader2, AlertTriangle, MapPin, Navigation, ExternalLink, Search } from 'lucide-react';
import { Coords } from '../../utils/emergencyShare';
import {
  NearbyPoliceError,
  NearbyStation,
  fetchNearbyPolice,
  mapsSearchPoliceUrl,
} from '../../utils/nearbyPolice';
import { mapsPoliceSearchUrl } from '../../utils/complaintDraft';
import { ComplaintStrings } from '../../i18n/complaintStrings';

type Phase = 'idle' | 'locating' | 'searching' | 'done' | 'error';

/**
 * "Find Nearby Police Stations" for Complaint & FIR Support.
 * - Asks the browser for the real location (permission prompt shown by the browser).
 * - Station data comes only from the existing /api/nearby-police backend (Google Places / OpenStreetMap).
 *   Nothing is invented; if the lookup fails the user still gets a Google Maps search link.
 * - If permission is denied or unavailable, the user can type a location and search Google Maps.
 */
export const ComplaintPoliceFinder: React.FC<{ cs: ComplaintStrings }> = ({ cs }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [stations, setStations] = useState<NearbyStation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState('');
  const runId = useRef(0);

  const run = () => {
    setError(null);
    if (!('geolocation' in navigator)) {
      setPhase('error');
      setShowManual(true);
      setError('This browser does not support location access. Please enter your location below.');
      return;
    }
    const id = ++runId.current;
    setPhase('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (id !== runId.current) return;
        const c: Coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setCoords(c);
        setPhase('searching');
        try {
          const r = await fetchNearbyPolice(c);
          if (id !== runId.current) return;
          setStations(r.stations);
          setPhase('done');
        } catch (e) {
          if (id !== runId.current) return;
          setStations(null);
          setPhase('error');
          const err = e instanceof NearbyPoliceError ? e : null;
          setError(
            err?.kind === 'offline'
              ? 'You appear to be offline. You can still open Google Maps below when you are online, or call 112 in an emergency.'
              : 'Could not load the station list. You can search police stations directly in Google Maps below.'
          );
        }
      },
      (err) => {
        if (id !== runId.current) return;
        setPhase('error');
        setShowManual(true);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied. You can allow it in your browser settings, or enter your location manually below.'
            : err.code === err.TIMEOUT
            ? 'Getting your location took too long. Try again, or enter your location manually below.'
            : 'Your location is unavailable. Turn on location services, or enter your location manually below.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const busy = phase === 'locating' || phase === 'searching';

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
          disabled={busy}
          className="px-4 py-2.5 min-h-11 bg-[#123A70] hover:bg-[#0d2d57] disabled:opacity-70 text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
          <span>{phase === 'locating' ? cs.locating : phase === 'searching' ? cs.searching : `🚔 ${cs.findPolice}`}</span>
        </button>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {phase === 'error' && error && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-950 flex items-start gap-2 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {coords && (phase === 'done' || phase === 'error') && (
          <a
            href={mapsSearchPoliceUrl(coords)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Open police stations in Google Maps
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

        {phase === 'done' && (
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Station details come from the map provider and may be out of date. Finding a station does not notify or alert anyone.
          </p>
        )}

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
