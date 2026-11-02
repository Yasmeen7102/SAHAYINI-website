/**
 * Behaviour of the shared "Find Nearby Police Stations" opener with mocked browser APIs.
 * Verifies that Google Maps is opened without the SAHAYINI station-list API, and every GPS outcome.
 */
import { openPoliceSearch, rememberLocation } from './policeMaps';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(`TEST FAILED: ${m}`);
}

type Tab = { href: string; opener: unknown; document: { title: string; body: { style: { cssText: string }; textContent: string } }; location: { href: string }; close: () => void };
const g = globalThis as any;
let opened: { url: string; tab: Tab | null }[] = [];
let blockPopups = false;
let geo: 'ok' | 'denied' | 'timeout' | 'unavailable' | 'missing' = 'ok';
let permission: string | null = 'granted';
let fetchCalls = 0;

function setup() {
  opened = [];
  fetchCalls = 0;
  const store: Record<string, string> = {};
  g.sessionStorage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } };
  rememberLocation({ lat: 0, lng: 0 }, 0); // expire any fix remembered by an earlier case
  g.fetch = () => { fetchCalls += 1; throw new Error('station-list API must not be needed to open Maps'); };
  g.window = {
    setTimeout: (f: () => void, ms: number) => setTimeout(f, ms),
    clearTimeout: (id: any) => clearTimeout(id),
    open: (url: string) => {
      if (blockPopups) return null;
      const tab: Tab = { href: url, opener: {}, document: { title: '', body: { style: { cssText: '' }, textContent: '' } }, location: { href: url }, close() {} };
      opened.push({ url, tab });
      return tab;
    },
  };
  const geolocation = geo === 'missing' ? undefined : {
    getCurrentPosition: (ok: any, fail: any) => {
      setTimeout(() => {
        if (geo === 'ok') ok({ coords: { latitude: 13.0827, longitude: 80.2707, accuracy: 12 } });
        else if (geo === 'denied') fail({ code: 1, PERMISSION_DENIED: 1, TIMEOUT: 3 });
        else if (geo === 'timeout') fail({ code: 3, PERMISSION_DENIED: 1, TIMEOUT: 3 });
        else fail({ code: 2, PERMISSION_DENIED: 1, TIMEOUT: 3 });
      }, 5);
    },
  };
  const nav: any = { permissions: permission ? { query: async () => ({ state: permission }) } : undefined };
  if (geolocation) nav.geolocation = geolocation;
  Object.defineProperty(globalThis, 'navigator', { value: nav, configurable: true });
}

async function main() {
  console.log('--- Police search opener tests ---');

  // 1) GPS granted, no recent fix: tab opens immediately (blank), then goes to Maps with coordinates
  geo = 'ok'; permission = 'granted'; blockPopups = false; setup();
  let p = openPoliceSearch();
  assert(opened.length === 1, 'tab opened synchronously inside the click, before GPS answers');
  let r = await p;
  assert(r.mode === 'gps' && r.opened, 'GPS mode');
  assert(opened[0].tab!.location.href.includes('/maps/search/police+stations/@13.0827,80.2707'), 'tab pointed at Google Maps with GPS');
  assert(opened[0].tab!.opener === null, 'opener cleared');
  assert(fetchCalls === 0, 'no station-list API call needed');

  // 2) A recent fix is reused: Maps opens instantly with the final URL
  setup(); rememberLocation({ lat: 11.1, lng: 77.3 });
  r = await openPoliceSearch();
  assert(r.mode === 'recent' && opened.length === 1 && opened[0].url.includes('@11.1,77.3'), 'recent fix opens Maps immediately');

  // 3) GPS denied -> general police-station search, flagged so the UI can show a small neutral note
  for (const [g1, issue] of [['denied', 'denied'], ['timeout', 'timeout'], ['unavailable', 'unavailable']] as const) {
    geo = g1; permission = 'prompt'; setup();
    r = await openPoliceSearch();
    assert(r.mode === 'general' && r.gpsIssue === issue && r.opened, `${g1}: general search with issue`);
    assert(opened[0].tab!.location.href.includes('police%20stations%20near%20me'), `${g1}: general Maps search opened`);
  }

  // 4) Permission already denied: no GPS attempt, general search straight away
  geo = 'ok'; permission = 'denied'; setup();
  r = await openPoliceSearch();
  assert(r.mode === 'general' && r.gpsIssue === 'denied', 'permission denied -> general search');

  // 5) Browser without geolocation -> general search immediately (single tab, final URL)
  geo = 'missing'; permission = null; setup();
  r = await openPoliceSearch();
  assert(r.mode === 'general' && r.gpsIssue === 'unsupported' && opened.length === 1 && opened[0].url.includes('near%20me'), 'unsupported -> general');

  // 6) Manual place
  geo = 'ok'; permission = 'granted'; setup();
  r = await openPoliceSearch({ manualPlace: 'Avinashi Road, Tiruppur' });
  assert(r.mode === 'manual' && opened[0].url.includes('Avinashi'), 'manual place search');

  // 7) Popup blocked: reported so the UI shows a plain link; nothing throws
  geo = 'ok'; permission = 'granted'; blockPopups = true; setup();
  r = await openPoliceSearch();
  assert(!r.opened && r.url.startsWith('https://www.google.com/maps/'), 'blocked popup reported with a usable URL');

  console.log('✓ Police search opener tests passed');
}

main().catch((e) => { console.error(e); process.exit(1); });
