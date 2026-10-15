import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Navigation, Send, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Coords,
  PoliceStation,
  buildAlertText,
  findNearestPoliceStation,
  isIndianMobile,
  smsHref,
  whatsappHref,
} from '../../utils/emergencyShare';

/**
 * Shown after the user shares their live GPS location. Finds the nearest police station and
 * lets the user send the location to that station (if it has a mobile number) and to every
 * emergency contact they saved, in one tap.
 */
export const LiveLocationShare: React.FC<{ coords: Coords }> = ({ coords }) => {
  const { contacts } = useApp();
  const [station, setStation] = useState<PoliceStation | null>(null);
  const [status, setStatus] = useState<'searching' | 'found' | 'none' | 'error'>('searching');

  useEffect(() => {
    let cancelled = false;
    setStatus('searching');
    setStation(null);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setStatus('error');
      return;
    }
    findNearestPoliceStation(coords)
      .then((s) => {
        if (cancelled) return;
        setStation(s);
        setStatus(s ? 'found' : 'none');
      })
      .catch((err) => {
        console.warn('Police station lookup failed:', err);
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [coords.lat, coords.lng]);

  const message = buildAlertText(coords, station);
  const contactPhones = contacts.map((c) => c.phone).filter(Boolean);
  const policeSms = station?.smsPhone ? [station.smsPhone] : [];
  const allRecipients = [...policeSms, ...contactPhones];
  const directionsUrl = station
    ? `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`
    : `https://www.google.com/maps/search/police+station/@${coords.lat},${coords.lng},14z`;

  return (
    <div className="mt-3 p-4 bg-white rounded-2xl border border-indigo-200 space-y-3 text-slate-900">
      <div className="flex items-center gap-2 text-sm font-extrabold text-[#0A2E65]">
        <ShieldCheck className="w-4 h-4" />
        <span>Send my live location to police &amp; my contacts</span>
      </div>

      {/* Nearest police station */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        {status === 'searching' && (
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Finding the nearest police station…</span>
          </div>
        )}
        {status === 'found' && station && (
          <>
            <div className="font-bold text-slate-900 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-red-700 shrink-0" />
              <span>
                {station.name} — {station.distanceKm.toFixed(1)} km away
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {station.phone && (
                <a
                  href={`tel:${station.phone.split(/[;,/]/)[0].replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-700 text-white rounded-lg font-bold"
                >
                  <Phone className="w-3.5 h-3.5" /> Call station
                </a>
              )}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-lg font-bold"
              >
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
            </div>
            {!station.smsPhone && (
              <p className="text-slate-700 leading-relaxed">
                This station has no mobile number listed for SMS, so the message below goes to your contacts. Please
                also call the station or dial 112.
              </p>
            )}
          </>
        )}
        {(status === 'none' || status === 'error') && (
          <div className="flex items-start gap-2 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {status === 'error'
                ? 'Could not look up the nearest police station (no internet or the map service did not respond).'
                : 'No police station was found near you in the map data.'}{' '}
              Please dial 112 now. Your contacts can still receive your location by SMS.
            </span>
          </div>
        )}
        <a
          href="tel:112"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-300 text-red-800 rounded-lg font-bold"
        >
          <Phone className="w-3.5 h-3.5" /> Call 112 (Police / Emergency)
        </a>
      </div>

      {/* Send to everyone */}
      {allRecipients.length > 0 ? (
        <a
          href={smsHref(allRecipients, message)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-extrabold"
        >
          <Send className="w-4 h-4" />
          <span>
            Send SMS
            {policeSms.length ? ' to police station + ' : ' to '}
            {contactPhones.length} contact{contactPhones.length === 1 ? '' : 's'}
          </span>
        </a>
      ) : (
        <p className="text-xs font-semibold text-amber-950 bg-amber-50 border border-amber-300 rounded-xl p-2.5">
          You have no emergency contacts saved. Add them in the SOS page under “Trusted Emergency Contacts”.
        </p>
      )}

      {/* Per-contact buttons */}
      {contacts.length > 0 && (
        <ul className="space-y-1.5">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-slate-200 text-xs"
            >
              <span className="font-bold text-slate-900">
                {c.name} <span className="font-medium text-slate-700">({c.phone})</span>
              </span>
              <span className="flex gap-1.5">
                <a
                  href={smsHref([c.phone], message)}
                  className="px-2.5 py-1 bg-blue-700 text-white rounded-md font-bold"
                >
                  SMS
                </a>
                {isIndianMobile(c.phone) && (
                  <a
                    href={whatsappHref(c.phone, message)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-emerald-700 text-white rounded-md font-bold"
                  >
                    WhatsApp
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] leading-relaxed text-slate-700">
        Your phone’s messaging app opens with the message ready; tap Send to deliver it. SAHAYINI cannot send SMS
        or contact the police by itself. In danger, always call 112 first.
      </p>
    </div>
  );
};
