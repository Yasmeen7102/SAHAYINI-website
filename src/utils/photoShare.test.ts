import assert from 'node:assert/strict';
import { buildCaptureMessage, canShareFiles, fitWithin, photoFileName, cameraErrorMessage } from './photoShare';

const fix = { lat: 13.0827, lng: 80.2707, accuracy: 12.4, capturedAt: new Date(2026, 9, 14, 1, 5, 9) };

const m = buildCaptureMessage(fix);
assert.ok(m.includes('https://maps.google.com/?q=13.0827,80.2707'), 'maps link uses the real coordinates');
assert.ok(m.includes('lat 13.082700') && m.includes('lng 80.270700') && m.includes('±12 m'));
assert.ok(!m.includes('Nearest police station'), 'no station line unless a station was found');
const m2 = buildCaptureMessage(fix, { name: 'T4 Police Station', phone: '044 1234' });
assert.ok(m2.includes('Nearest police station: T4 Police Station (044 1234).'));
assert.ok(!buildCaptureMessage(fix, { name: 'X' }).includes('()'), 'no empty phone brackets');

assert.equal(canShareFiles([]), false, 'no navigator.share in node => false, never throws');
assert.deepEqual(fitWithin(4000, 3000, 1600), { width: 1600, height: 1200 });
assert.deepEqual(fitWithin(800, 600, 1600), { width: 800, height: 600 });
assert.equal(photoFileName(fix.capturedAt), 'sahayini-location-20261014-010509.jpg');
assert.ok(cameraErrorMessage({ name: 'NotAllowedError' }).includes('denied'));
assert.ok(cameraErrorMessage({ name: 'NotFoundError' }).includes('No camera'));
assert.ok(cameraErrorMessage({ name: 'NotReadableError' }).includes('in use'));
assert.ok(cameraErrorMessage(null).includes('could not be started'));
console.log('✓ photoShare helpers: all tests passed');
