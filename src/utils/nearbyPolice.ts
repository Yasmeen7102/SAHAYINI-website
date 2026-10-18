/**
 * Shared types + client helpers for the "Find Nearby Police Stations" card.
 * Station data always comes from the backend (/api/nearby-police), which queries a real
 * mapping service. Nothing here invents stations, phone numbers, addresses or distances.
 */
import { Coords, distanceKm } from './emergencyShare';

export interface NearbyStation {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  distanceKm: number;
  /** Only present when the data provider returned a phone number for this station */
  phone?: string;
  openingHours?: string[];
  openNow?: boolean;
  mapsUrl: string;
  directionsUrl: string;
}

export interface NearbyPoliceResponse {
  source: 'google_places' | 'openstreetmap';
  stations: NearbyStation[];
}

export type NearbyPoliceErrorKind = 'offline' | 'network' | 'service' | 'unconfigured';

export class NearbyPoliceError extends Error {
  kind: NearbyPoliceErrorKind;
  constructor(kind: NearbyPoliceErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

export const mapsSearchPoliceUrl = (c?: Coords | null) =>
  c ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('police station')}%20near%20${c.lat},${c.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('police stations near me')}`;

export const stationMapUrl = (s: { lat: number; lng: number; name: string }) =>
  `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;

export const stationDirectionsUrl = (s: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;

/** Makes a number safe for a tel: link. Returns '' if nothing dialable remains. */
export function telHref(phone: string): string {
  const first = phone.split(/[;,/]/)[0].replace(/[^\d+]/g, '');
  return first.replace(/\D/g, '').length >= 5 ? `tel:${first}` : '';
}

export async function fetchNearbyPolice(c: Coords): Promise<NearbyPoliceResponse> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new NearbyPoliceError('offline', 'You appear to be offline.');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res: Response;
  try {
    res = await fetch(`/api/nearby-police?lat=${c.lat}&lng=${c.lng}`, { signal: controller.signal });
  } catch {
    throw new NearbyPoliceError('network', 'Could not reach the SAHAYINI server.');
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    let msg = `The search service returned an error (HTTP ${res.status}).`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {
      /* non-JSON body: keep the generic message */
    }
    throw new NearbyPoliceError('service', msg);
  }
  const data = (await res.json()) as NearbyPoliceResponse;
  // Recompute distance on the device from the user's real coordinates for consistency.
  data.stations = (data.stations || [])
    .map((s) => ({ ...s, distanceKm: distanceKm(c.lat, c.lng, s.lat, s.lng) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return data;
}
