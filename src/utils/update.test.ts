/**
 * Tests for the chatbot / scam-protection / localization update.
 * Run with: npm test
 */
import { offlineStorage } from '../services/offlineStorage';
import { analyzeScamLocally, maxRisk, localExplanation } from './scamHeuristics';
import { getExtraStrings } from '../i18n/extraStrings';
import { LANGUAGES, translations } from '../i18n/translations';
import { FEATURED_LESSONS_BY_LANG, TOPICS_DATA_BY_LANG, getLessonsForLang, getTopicsForLang } from '../data/lessonsData';
import { EXTRA_LESSONS, EXTRA_TOPICS } from '../data/legalLessons';
import { toIndianDigits, isIndianMobile, distanceKm, buildAlertText, smsHref, whatsappHref } from './emergencyShare';
import { looksLikeSuspiciousMessage, formatScamChatReply, buildScamSpeech } from '../services/scamCheck';

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    console.log(`✓ ${name}`);
  } else {
    failures++;
    console.error(`✗ ${name}`);
  }
}

console.log('--- Running SAHAYINI update tests ---');

// 1. Offline chatbot: topic answers are flagged as matched, generic text is not.
const scholarship = offlineStorage.getOfflineChatResult('Tell me about scholarship schemes', 'en');
check('offline: scholarship question matches a saved answer', scholarship.matched === true);
const sos = offlineStorage.getOfflineChatResult('emergency helpline number', 'en');
check('offline: emergency question matches a saved answer', sos.matched === true && sos.text.includes('112'));
const unknown = offlineStorage.getOfflineChatResult('what is the capital of australia', 'en');
check('offline: unrelated question is reported as NOT matched', unknown.matched === false);
check(
  'offline: legacy getOfflineChatResponse still returns the same text',
  offlineStorage.getOfflineChatResponse('emergency helpline number', 'en') === sos.text &&
    offlineStorage.getOfflineChatResponse('what is the capital of australia', 'en') === unknown.text
);

// 1b. Every localized starter question has a device-saved answer for offline use.
let starterAnswersOk = true;
let starterCount = 0;
for (const lang of LANGUAGES) {
  const suggestions = translations[lang.code].ask.suggestions;
  if (suggestions.length !== 20) starterAnswersOk = false;
  for (const question of suggestions) {
    starterCount++;
    const result = offlineStorage.getOfflineChatResult(question, lang.code);
    if (!result.matched || !result.text.includes('Offline saved answer')) starterAnswersOk = false;
  }
}
check(`offline: all ${starterCount} localized starter questions return saved answers`, starterAnswersOk && starterCount === 160);

// 2. Scam heuristics (shared by server and offline browser check)
const hi = analyzeScamLocally(
  'Your SBI account is suspended. Update KYC immediately at sbi-kyc-update.apk and share OTP'
);
check('scam: multi-signal message is HIGH or CRITICAL', hi.riskScore === 'HIGH' || hi.riskScore === 'CRITICAL');
check('scam: flags are reported', hi.flags.length >= 2);
const none = analyzeScamLocally('Hi, are we meeting for lunch tomorrow?');
check('scam: ordinary message has no flags', none.flags.length === 0 && none.riskScore === 'LOW');
check(
  'scam: LOW explanation never claims the message is safe',
  /does not prove|cannot|not prove/i.test(localExplanation('LOW')) && !/is safe\b(?! )/i.test(localExplanation('LOW').replace('is safe','is safe '))
);
check('scam: maxRisk never lowers risk', maxRisk('HIGH', 'LOW') === 'HIGH' && maxRisk('LOW', 'CRITICAL') === 'CRITICAL');

// 3. Localized strings exist for every supported language and are non-empty
const keys = Object.keys(getExtraStrings('en')) as (keyof ReturnType<typeof getExtraStrings>)[];
let missing = 0;
for (const lang of LANGUAGES) {
  const s = getExtraStrings(lang.code);
  for (const k of keys) {
    const v = s[k] as unknown;
    if (v === undefined || v === '' || v === null) missing++;
    if (typeof v === 'object' && v) {
      for (const inner of Object.values(v as Record<string, string>)) if (!inner) missing++;
    }
  }
}
check('i18n: all extra strings present in all 8 languages', missing === 0);

// 4. Learn: every topic with lessons filters correctly, and each lesson belongs to a real topic
let learnOk = true;
for (const lang of LANGUAGES) {
  const topics = TOPICS_DATA_BY_LANG[lang.code];
  const lessons = FEATURED_LESSONS_BY_LANG[lang.code];
  for (const l of lessons) if (!topics.some((tp) => tp.id === l.topicId)) learnOk = false;
}
check('learn: every lesson maps to an existing topic in every language', learnOk);

// 5. New lessons: every language sees them, they map to topics, ids are unique, content is complete
for (const lang of LANGUAGES) {
  const lessons = getLessonsForLang(lang.code);
  const topics = getTopicsForLang(lang.code);
  const ids = lessons.map((l) => l.id);
  check(`lessons[${lang.code}]: ids unique and ${EXTRA_LESSONS.length} new lessons present`,
    new Set(ids).size === ids.length && EXTRA_LESSONS.every((l) => ids.includes(l.id)));
  check(`lessons[${lang.code}]: every lesson maps to a topic; "More" card is last`,
    lessons.every((l) => topics.some((tp) => tp.id === l.topicId)) && topics[topics.length - 1].id === 'more-skills');
}
check('lessons: every new topic has at least one lesson', EXTRA_TOPICS.every((tp) => EXTRA_LESSONS.some((l) => l.topicId === tp.id)));
check('lessons: all complete (sections, summary, audio, English voice)',
  EXTRA_LESSONS.every((l) => l.content.sections.length >= 3 && l.content.summary.length >= 3 && l.audioScript.length > 200 && l.contentLanguage === 'en'));
check('lessons: legal references present (BNS, POSH, Dowry, RBI)',
  ['BNS', 'POSH', 'Dowry', 'RBI'].every((k) => EXTRA_LESSONS.some((l) => JSON.stringify(l).includes(k))));

// 6. Emergency sharing helpers
check('share: phone normalisation', toIndianDigits('98765 43210') === '919876543210' && toIndianDigits('+91 98765-43210') === '919876543210' && toIndianDigits('12') === '');
check('share: mobile vs landline', isIndianMobile('9876543210') && !isIndianMobile('04212345678') && !isIndianMobile('0422 2345678'));
check('share: distance Chennai-Bengaluru ~290 km', Math.abs(distanceKm(13.0827, 80.2707, 12.9716, 77.5946) - 290) < 15);
const alert = buildAlertText({ lat: 11.1085, lng: 77.3411, accuracy: 20 }, { name: 'Tiruppur North PS', lat: 11.11, lng: 77.34, distanceKm: 1.2 });
check('share: alert text has map link, coordinates and station', alert.includes('maps.google.com/?q=11.1085,77.3411') && alert.includes('Tiruppur North PS'));
check('share: sms and whatsapp links address the numbers', smsHref(['9876543210', '+91 90000 11111'], 'hi there').includes('9876543210,+9190000') && whatsappHref('9876543210', 'x').startsWith('https://wa.me/919876543210'));

// 7. Pasted-message detection for the chatbot
check('chat: pasted scam SMS is detected', looksLikeSuspiciousMessage('Dear Customer, your electricity will be disconnected tonight at 9:30 PM. Call officer immediately on 9812345678.'));
check('chat: normal questions are not treated as scam checks', !looksLikeSuspiciousMessage('How do I apply for a scholarship?') && !looksLikeSuspiciousMessage('What is the helpline number for women in distress in Tamil Nadu please tell me'));
const sr = { riskScore: 'HIGH' as const, flags: ['Urgency: x'], explanation: 'Looks like a scam.', safetySteps: ['Do not click.'], source: 'local' as const };
check('chat: scam reply has text, signs, actions, uncertainty; speech is English for local result',
  formatScamChatReply(sr, 'ta', 'offline').includes('Do not click.') && buildScamSpeech(sr, 'ta').lang === 'en');

if (failures > 0) {
  console.error(`\n${failures} test(s) FAILED`);
  process.exit(1);
}
console.log('🎉 ALL UPDATE TESTS PASSED!');
