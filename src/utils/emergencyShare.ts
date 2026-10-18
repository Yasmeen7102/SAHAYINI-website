/**
 * Helpers for sharing a live GPS location with the nearest police station and
 * the user's saved emergency contacts.
 *
 * A web app cannot send SMS silently. These helpers build the message and open the phone's
 * own messaging app / WhatsApp pre-addressed to the right numbers; the user taps Send.
 */
import { LanguageCode } from '../types';
import { getLocationStrings, fill } from '../i18n/locationStrings';

export interface Coords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface PoliceStation {
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  phone?: string;
  /** Mobile number usable for SMS (landlines can't receive SMS) */
  smsPhone?: string;
}

const toRad = (d: number) => (d * Math.PI) / 180;

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Returns digits with Indian country code, e.g. "919876543210", or '' if unusable. */
export function toIndianDigits(phone: string): string {
  let d = (phone || '').replace(/[^\d]/g, '');
  if (d.startsWith('0091')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = '91' + d;
  return d.length >= 11 && d.length <= 13 ? d : '';
}

/** True for Indian mobile numbers (10 digits starting 6-9), which can receive SMS. */
export function isIndianMobile(phone: string): boolean {
  const d = toIndianDigits(phone);
  return d.length === 12 && d.startsWith('91') && /^[6-9]/.test(d.slice(2));
}

export function mapsLink(c: Coords): string {
  return `https://maps.google.com/?q=${c.lat},${c.lng}`;
}

export function buildAlertText(c: Coords, station?: PoliceStation | null, lang: LanguageCode = 'en'): string {
  const L = getLocationStrings(lang);
  const acc = c.accuracy ? fill(L.msgAcc, { m: Math.round(c.accuracy) }) : '';
  const base = fill(L.msgAlert, { link: mapsLink(c), lat: c.lat.toFixed(5), lng: c.lng.toFixed(5), acc });
  const near = station ? fill(L.msgNear, { name: `${station.name} (${station.distanceKm.toFixed(1)} km)` }) : '';
  return `${base}${near}${L.msgAlertEnd}`;
}

export function smsHref(phones: string[], body: string): string {
  const nums = phones.map((p) => p.replace(/[^\d+]/g, '')).filter(Boolean);
  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const enc = encodeURIComponent(body);
  return isApple ? `sms:/open?addresses=${nums.join(',')}&body=${enc}` : `sms:${nums.join(',')}?body=${enc}`;
}

export function whatsappHref(phone: string, body: string): string {
  const d = toIndianDigits(phone);
  return `https://wa.me/${d}?text=${encodeURIComponent(body)}`;
}

/** Finds the nearest police station from OpenStreetMap (needs internet). Throws on network failure. */
export async function findNearestPoliceStation(c: Coords): Promise<PoliceStation | null> {
  for (const radius of [5000, 15000, 30000]) {
    const query = `[out:json][timeout:12];nwr(around:${radius},${c.lat},${c.lng})[amenity=police];out center tags 30;`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Police lookup failed: HTTP ${res.status}`);
      const data = await res.json();
      const stations: PoliceStation[] = (data.elements || [])
        .map((el: any) => {
          const lat = el.lat ?? el.center?.lat;
          const lng = el.lon ?? el.center?.lon;
          if (typeof lat !== 'number' || typeof lng !== 'number') return null;
          const tags = el.tags || {};
          const phone: string | undefined = tags.phone || tags['contact:phone'] || undefined;
          const firstMobile = phone
            ?.split(/[;,/]/)
            .map((p: string) => p.trim())
            .find((p: string) => isIndianMobile(p));
          return {
            name: tags.name || tags['name:en'] || 'Police Station',
            lat,
            lng,
            distanceKm: distanceKm(c.lat, c.lng, lat, lng),
            phone,
            smsPhone: firstMobile,
          } as PoliceStation;
        })
        .filter(Boolean) as PoliceStation[];
      if (stations.length) return stations.sort((a, b) => a.distanceKm - b.distanceKm)[0];
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}
