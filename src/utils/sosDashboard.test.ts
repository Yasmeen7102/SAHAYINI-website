/**
 * Tests for the redesigned SOS page: staleness, recipients, false-alarm gates, transcript
 * classification, and completeness of the new strings in all 8 languages.
 */
import {
  CANCEL_COOLDOWN_MS,
  LoudSoundGate,
  PhraseGate,
  STALE_AFTER_MS,
  classifyTranscript,
  countOccurrences,
  isLocationStale,
  normalizeCountdown,
  resolveRecipients,
} from './sosLogic';
import { SOS_DASH_EN, SOS_DASH_LANGUAGES, getSosDashStrings } from '../i18n/sosDashboardStrings';
import { fill } from '../i18n/locationStrings';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(`TEST FAILED: ${m}`);
}

console.log('--- SOS dashboard tests ---');

// Staleness
assert(!isLocationStale(null, 1_000_000), 'no fix yet is not stale');
assert(!isLocationStale(1_000, 1_000 + STALE_AFTER_MS), 'exactly at limit is not stale');
assert(isLocationStale(1_000, 1_001 + STALE_AFTER_MS), 'past the limit is stale');

// Recipients
const trusted = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
assert(resolveRecipients(trusted, null).length === 3, 'never chosen: all trusted contacts pre-selected');
assert(resolveRecipients(trusted, ['b']).map((c) => c.id).join() === 'b', 'explicit choice is honoured');
assert(resolveRecipients(trusted, []).length === 0, 'explicit empty choice stays empty');
assert(resolveRecipients(trusted, ['zzz']).length === 0, 'unknown/deleted ids are ignored');

// Countdown
assert(normalizeCountdown(undefined) === 10, 'default countdown is 10 seconds');
assert(normalizeCountdown('15') === 15, 'valid option kept');
assert(normalizeCountdown(7) === 10, 'invalid option falls back to 10');

// Transcript classification
assert(countOccurrences('help help help', 'help') === 3, 'counts repeated words');
assert(classifyTranscript('please HELP ME now', 'en').strong === 'help me', 'strong english phrase');
assert(classifyTranscript('call the police', 'en').strong === 'call the police', 'strong english phrase 2');
const weak = classifyTranscript('this is an emergency', 'en');
assert(weak.strong === null && weak.weakCount === 1, 'single weak word is not strong');
assert(classifyTranscript('the weather is nice', 'en').weakCount === 0, 'ordinary speech does not match');
assert(classifyTranscript('बचाओ बचाओ', 'hi').strong === 'बचाओ', 'strong hindi phrase');
assert(classifyTranscript('உதவி', 'ta').weakCount === 1, 'tamil weak phrase');
assert(classifyTranscript('help me', 'ta').strong === 'help me', 'english phrases work in every language');

// PhraseGate: weak words need two hits within the window
const pg = new PhraseGate(8000, 2);
assert(!pg.register(1, 0), 'one weak hit does not fire');
assert(!pg.register(1, 9000), 'second hit outside the window does not fire');
assert(pg.register(1, 12000), 'two hits within 8s fire');
assert(!pg.register(1, 13000), 'gate resets after firing');
assert(new PhraseGate().register(2, 0), 'a word repeated twice in one utterance fires');

// LoudSoundGate: must stay loud continuously
const lg = new LoudSoundGate(0.3, 2500);
assert(!lg.update(0.5, 0), 'start of loud sound does not fire');
assert(!lg.update(0.5, 2000), 'not yet sustained');
assert(lg.update(0.5, 2600), 'sustained loud sound fires');
const lg2 = new LoudSoundGate(0.3, 2500);
lg2.update(0.5, 0);
lg2.update(0.1, 1000); // quiet gap resets
assert(!lg2.update(0.5, 2600), 'a quiet gap resets the timer (e.g. TV bursts)');
assert(!new LoudSoundGate().update(0.2, 0), 'normal conversation level never fires');
assert(CANCEL_COOLDOWN_MS >= 30000, 'cooldown after cancel is meaningful');

// Strings: every language has every key, non-empty, with the same placeholders as English
const placeholders = (s: string) => (s.match(/\{\w+\}/g) || []).sort().join(',');
assert(SOS_DASH_LANGUAGES.length === 8, 'exactly 8 languages');
for (const lang of SOS_DASH_LANGUAGES) {
  const d = getSosDashStrings(lang);
  for (const key of Object.keys(SOS_DASH_EN) as (keyof typeof SOS_DASH_EN)[]) {
    const v = d[key];
    assert(typeof v === 'string' && v.trim().length > 0, `${lang}.${key} must be non-empty`);
    assert(placeholders(v) === placeholders(SOS_DASH_EN[key]), `${lang}.${key} placeholders must match English`);
    if (lang !== 'en' && key !== 'liveBadge') {
      // untranslated English left in a non-English language is a bug (allow short/brand-only strings)
      assert(!(v === SOS_DASH_EN[key] && v.length > 12), `${lang}.${key} appears untranslated`);
    }
  }
}
assert(fill(getSosDashStrings('ta').lastUpdated, { time: '11:45' }).includes('11:45'), 'fill works on translated text');

console.log('✓ SOS dashboard tests passed');
