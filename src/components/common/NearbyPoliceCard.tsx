import React, { useRef, useState } from 'react';
import { Siren, Loader2, AlertTriangle, MapPin, Navigation, Phone, RefreshCw, Clock, Info, ExternalLink } from 'lucide-react';
import { Coords } from '../../utils/emergencyShare';
import {
  NearbyPoliceError,
  NearbyPoliceResponse,
  fetchNearbyPolice,
  mapsSearchPoliceUrl,
  telHref,
} from '../../utils/nearbyPolice';

type Phase = 'idle' | 'locating' | 'searching' | 'done' | 'error';

/**
 * Finds real police stations near the user's current GPS position via the SAHAYINI backend
 * (/api/nearby-police). Finding a station does NOT notify anyone.
 */
export const NearbyPoliceCard: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [result, setResult] = useState<NearbyPoliceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runId = useRef(0);

  const run = () => {
    setError(null);
    if (!('geolocation' in navigator)) {
      setPhase('error');
      setError('This browser does not support location access. You can still call 112.');
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
          setResult(r);
          setPhase('done');
        } catch (e) {
          if (id !== runId.current) return;
          setResult(null);
          setPhase('error');
          const err = e instanceof NearbyPoliceError ? e : null;
          setError(
            err?.kind === 'offline'
              ? 'You appear to be offline, so nearby stations cannot be searched. Call 112, or try again when you have internet.'
              : err?.kind === 'network'
              ? 'Could not reach the SAHAYINI server. Check your internet connection and try again.'
              : err?.message || 'The search failed. Please try again.'
          );
        }
      },
      (err) => {
        if (id !== runId.current) return;
        setPhase('error');
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access for this site in your browser settings, then try again.'
            : err.code === err.TIMEOUT
            ? 'Getting your location took too long. Check GPS or signal and try again.'
            : 'Your location is currently unavailable. Turn on GPS / location services and try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const busy = phase === 'locating' || phase === 'searching';

  return (
    <section aria-labelledby="nearby-police-title" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
            <Siren className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="nearby-police-title" className="text-base font-bold text-slate-900">Find Nearby Police Stations</h3>
            <p className="text-xs text-slate-600">Find police stations near your current location when you need assistance.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="px-4 py-2.5 min-h-11 bg-red-700 hover:bg-red-800 disabled:opacity-70 text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
          <span>
            {phase === 'locating' ? 'Getting your location…' : phase === 'searching' ? 'Searching…' : '🚔 Find Nearby Police Stations'}
          </span>
        </button>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Finding a station does not alert the police.</strong> Your location is not sent to any station. In an
            emergency, call{' '}
            <a href="tel:112" className="font-extrabold underline">112</a>.
          </span>
        </div>

        {phase === 'error' && error && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-950 flex items-start gap-2 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {phase === 'done' && coords && result && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
              <span>
                Searched near {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                {coords.accuracy ? ` (±${Math.round(coords.accuracy)} m)` : ''} · Source:{' '}
                {result.source === 'google_places' ? 'Google Places' : 'OpenStreetMap contributors'}
              </span>
              <button
                type="button"
                onClick={run}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-11 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Refresh with my latest location
              </button>
            </div>

            {result.stations.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 space-y-2 leading-relaxed">
                <p className="font-bold">No police stations were found near you in the map data.</p>
                <p>The map data may be incomplete in your area. Try Google Maps, or call 112.</p>
                <a
                  href={mapsSearchPoliceUrl(coords)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 bg-[#0A2E65] text-white rounded-lg font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Search police stations in Google Maps
                </a>
              </div>
            ) : (
              <ul className="space-y-3">
                {result.stations.map((s) => {
                  const tel = s.phone ? telHref(s.phone) : '';
                  return (
                    <li key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                        <span className="shrink-0 font-bold text-[#0A2E65]">{s.distanceKm.toFixed(1)} km</span>
                      </div>
                      <p className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
                        <span>{s.address || 'Address not available'}</span>
                      </p>
                      {s.phone && <p className="font-mono">Phone: {s.phone}</p>}
                      {s.openingHours && s.openingHours.length > 0 && (
                        <details>
                          <summary className="cursor-pointer font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            Opening hours{typeof s.openNow === 'boolean' ? (s.openNow ? ' · Open now' : ' · Closed now') : ''}
                          </summary>
                          <ul className="mt-1 ml-5 list-disc">
                            {s.openingHours.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                      {!s.openingHours && <p className="text-slate-600">Opening hours not available</p>}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-11 bg-white border border-slate-300 rounded-lg font-bold text-slate-900">
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View on Map
                        </a>
                        <a href={s.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-11 bg-[#0A2E65] text-white rounded-lg font-bold">
                          <Navigation className="w-3.5 h-3.5" aria-hidden="true" /> Get Directions
                        </a>
                        {tel && (
                          <a href={tel} className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-11 bg-red-700 text-white rounded-lg font-bold">
                            <Phone className="w-3.5 h-3.5" aria-hidden="true" /> Call Police Station
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Station details come from the map provider and may be out of date. Opening a map or dialler does not contact
              or notify anyone until you place the call yourself.
            </p>
          </>
        )}

        {phase === 'error' && coords && (
          <a href={mapsSearchPoliceUrl(coords)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-11 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900">
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Search police stations in Google Maps instead
          </a>
        )}
      </div>
    </section>
  );
};
