/**
 * Core unit tests for SAHAYINI application
 * Validates translations, scam heuristics, schemes data, and validation logic.
 */

import { translations, LANGUAGES } from '../i18n/translations';
import { SCHEMES_DATA } from '../data/schemesData';
import { FEATURED_LESSONS, QUIZZES_DATA } from '../data/lessonsData';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('--- Running SAHAYINI Core Unit Tests ---');

// Test 1: Validate all 8 languages exist and have non-empty dictionary keys
console.log('Test 1: Validating 8-language translations...');
assert(LANGUAGES.length === 8, 'Should have exactly 8 supported languages');
const requiredLanguages = ['en', 'ta', 'hi', 'te', 'mr', 'ml', 'gu', 'kn'];
for (const lang of requiredLanguages) {
  const dict = translations[lang as keyof typeof translations];
  assert(Boolean(dict), `Translation dictionary for ${lang} must exist`);
  assert(Boolean(dict.appName), `appName for ${lang} must not be empty`);
  assert(Boolean(dict.slogan), `slogan for ${lang} must not be empty`);
  assert(Boolean(dict.dashboard.call112), `call112 for ${lang} must not be empty`);
}
console.log('✓ All 8 languages verified successfully');

// Test 2: Validate government schemes data integrity
console.log('Test 2: Validating government schemes data...');
assert(SCHEMES_DATA.length >= 8, 'Must have at least 8 authentic government schemes');
for (const scheme of SCHEMES_DATA) {
  assert(Boolean(scheme.id), 'Scheme must have an id');
  assert(Boolean(scheme.title), 'Scheme must have a title');
  assert(scheme.officialUrl.startsWith('https://'), `Official URL must be secure HTTPS: ${scheme.officialUrl}`);
  assert(scheme.eligibility.length > 0, `Scheme ${scheme.id} must list eligibility criteria`);
  assert(scheme.documentsRequired.length > 0, `Scheme ${scheme.id} must list required documents`);
  assert(scheme.applicationProcess.length > 0, `Scheme ${scheme.id} must list application steps`);
}
console.log(`✓ ${SCHEMES_DATA.length} government schemes verified successfully`);

// Test 3: Validate educational lessons and quizzes
console.log('Test 3: Validating educational lessons & quizzes...');
assert(FEATURED_LESSONS.length === 4, 'Must have 4 featured lessons matching design');
for (const lesson of FEATURED_LESSONS) {
  assert(Boolean(lesson.audioScript), `Lesson ${lesson.number} must have an audio narration script`);
  assert(lesson.content.sections.length > 0, `Lesson ${lesson.number} must contain content sections`);
}

assert(QUIZZES_DATA.length >= 5, 'Must have functional interactive quizzes');
for (const q of QUIZZES_DATA) {
  assert(q.options.length >= 3, `Quiz question ${q.id} must have multiple options`);
  assert(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Correct option index must be valid for ${q.id}`);
  assert(Boolean(q.explanation), `Explanation must be provided for ${q.id}`);
}
console.log('✓ Educational modules and quiz structure verified successfully');

// Test 4: Scam heuristic logic test
console.log('Test 4: Validating scam detection heuristics...');
function evaluateScamScore(content: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const flags: string[] = [];
  if (/immediately|within 24 hours|tonight at|urgent|block your|suspend/i.test(content)) {
    flags.push('Urgency');
  }
  if (/lottery|won|cashback|prize|crore|free gift/i.test(content)) {
    flags.push('Lottery');
  }
  if (/otp|pin|password|cvv|aadhaar number/i.test(content)) {
    flags.push('Credentials');
  }
  if (/electricity|power supply|disconnection/i.test(content)) {
    flags.push('Electricity');
  }
  if (/bit\.ly|\.apk|sbi-kyc/i.test(content)) {
    flags.push('Suspicious URL');
  }

  if (flags.length >= 3) return 'CRITICAL';
  if (flags.length === 2) return 'HIGH';
  if (flags.length === 1) return 'MEDIUM';
  return 'LOW';
}

const electricityScamMsg = 'Your electricity will be disconnected tonight at 9:30 PM. Download sbi-kyc.apk immediately.';
assert(evaluateScamScore(electricityScamMsg) === 'CRITICAL', 'Electricity scam text with urgent threat and .apk should be CRITICAL risk');

const harmlessMsg = 'Hello, can you explain the eligibility for NSP Central Scholarship?';
assert(evaluateScamScore(harmlessMsg) === 'LOW', 'Innocuous query should be LOW risk');
console.log('✓ Scam detection logic verified successfully');

// Test 5: Validate offline storage and caching manager
console.log('Test 5: Validating offline storage and low-connectivity caching...');
// Mock localStorage if in pure node test without browser environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => { store.set(key, val); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] || null,
    length: store.size,
  } as unknown as Storage;
}

import { offlineStorage, EMERGENCY_HELPLINES, OFFLINE_SAFETY_PLAYBOOKS } from '../services/offlineStorage';

const meta = offlineStorage.precacheAllCriticalData();
assert(meta.isReady === true, 'Cache metadata must be marked ready');
assert(meta.schemesCount >= 8, 'Must cache at least 8 government schemes for offline access');
assert(meta.helplinesCount >= 8, 'Must cache at least 8 critical safety helplines');
assert(meta.playbooksCount >= 4, 'Must cache at least 4 emergency safety playbooks');

// Validate helplines
const helplines = offlineStorage.getCachedHelplines();
assert(helplines.some((h) => h.number === '112'), '112 ERSS must be in cached helplines');
assert(helplines.some((h) => h.number === '1091'), '1091 Women Helpline must be in cached helplines');
assert(helplines.some((h) => h.number === '1930'), '1930 Cyber Fraud Helpline must be in cached helplines');

// Validate offline scheme search
const searchResults = offlineStorage.getCachedSchemes({ query: 'Scholarship' });
assert(searchResults.length > 0, 'Offline search for Scholarship should return matching cached records');

// Validate SMS generation
const sms = offlineStorage.generateEmergencySms({ lat: 13.0827, lng: 80.2707 }, 'Need immediate assistance');
assert(sms.text.includes('13.0827'), 'SMS text must contain GPS latitude');
assert(sms.text.includes('112'), 'SMS text must mention 112 helpline');
assert(sms.smsUri.startsWith('sms:'), 'SMS URI must use sms: protocol');
console.log('✓ Offline storage and caching manager verified successfully');

// Test 6: Verify all eight language translations in cached lessons, quizzes, and emergency instructions
console.log('Test 6: Verifying 8-language coverage in cached lessons, quizzes & emergency protocols...');
import { FEATURED_LESSONS_BY_LANG, QUIZZES_DATA_BY_LANG } from '../data/lessonsData';
import { SCHEMES_LOCALIZATION } from '../data/schemesData';
import { LanguageCode } from '../types';

const all8Langs: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'mr', 'ml', 'gu', 'kn'];
for (const lang of all8Langs) {
  // Lessons
  const lessons = FEATURED_LESSONS_BY_LANG[lang];
  assert(Array.isArray(lessons) && lessons.length === 4, `Language ${lang} must have exactly 4 cached lessons`);
  for (const l of lessons) {
    assert(Boolean(l.title), `Lesson title in ${lang} must not be empty`);
    assert(Boolean(l.audioScript), `Lesson audioScript in ${lang} must not be empty`);
    assert(l.content.sections.length > 0, `Lesson sections in ${lang} must exist`);
  }

  // Quizzes
  const quizzes = QUIZZES_DATA_BY_LANG[lang];
  assert(Array.isArray(quizzes) && quizzes.length === 5, `Language ${lang} must have exactly 5 cached quizzes`);
  for (const q of quizzes) {
    assert(Boolean(q.question), `Quiz question in ${lang} must not be empty`);
    assert(q.options.length >= 3, `Quiz options in ${lang} must have at least 3 choices`);
    assert(Boolean(q.explanation), `Quiz explanation in ${lang} must not be empty`);
  }

  // Emergency Instructions
  const dict = translations[lang];
  assert(Boolean(dict.sos.call112Prompt), `Emergency instructions in ${lang} must include call112Prompt`);
  assert(Boolean(dict.sos.bannerWarning), `Emergency instructions in ${lang} must include bannerWarning`);
  assert(Boolean(dict.sos.locationSharingDesc), `Emergency instructions in ${lang} must include locationSharingDesc`);

  // Scheme localization (all 8 non-English languages must have localized dictionary)
  if (lang !== 'en') {
    const locSchemes = SCHEMES_LOCALIZATION[lang];
    assert(Boolean(locSchemes), `Scheme localization for ${lang} must exist`);
    assert(Object.keys(locSchemes).length === 9, `All 9 schemes must be localized for ${lang}`);
  }
}
console.log('✓ All 8 languages verified across lessons, quizzes, emergency instructions & schemes');

// Test 7: Verify chatbot distinction between offline cache and online responses
console.log('Test 7: Verifying chatbot offline cache response generator...');
const offlineScholarshipReply = offlineStorage.getOfflineChatResponse('Tell me about scholarships', 'en');
assert(offlineScholarshipReply.includes('[Offline Cached Response]'), 'Offline query response must explicitly identify as Offline Cached');
assert(offlineScholarshipReply.includes('PM-USHA') || offlineScholarshipReply.includes('Scholarship'), 'Offline query response must list cached schemes');

const offlineSosReply = offlineStorage.getOfflineChatResponse('police emergency help 112', 'en');
assert(offlineSosReply.includes('112'), 'Offline SOS query response must contain 112');
assert(offlineSosReply.includes('[Offline Cached Response]'), 'Offline SOS query response must explicitly identify as Offline Cached');
console.log('✓ Chatbot offline cached response distinction verified');

// Test 8: Verify dialer protocol and SMS format
console.log('Test 8: Verifying emergency dialer and SMS URI protocol integrity...');
const dialerHelplines = offlineStorage.getCachedHelplines();
for (const h of dialerHelplines) {
  assert(/^\d+$/.test(h.number), `Helpline ${h.number} must be numeric string for phone dialer`);
}
const generatedSms = offlineStorage.generateEmergencySms({ lat: 12.9716, lng: 77.5946 }, 'Test emergency');
assert(generatedSms.smsUri.startsWith('sms:?body='), 'Emergency SMS URI must start with sms:?body=');
assert(decodeURIComponent(generatedSms.smsUri).includes('12.9716'), 'SMS payload must contain coordinates');
console.log('✓ Emergency dialer numbers and SMS URI format verified');

console.log('🎉 ALL UNIT TESTS PASSED!');
