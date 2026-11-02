/**
 * Tests for: multilingual voice phrase detection (8 languages), Unicode normalisation,
 * the shared police-station Google Maps search, and its localized messages.
 */
import { LanguageCode } from '../types';
import { STRONG_PHRASES, WEAK_PHRASES, classifyAlternatives, classifyTranscript, normalizeSpeech } from './sosLogic';
import { getLatestLocation, policeMapsUrl, rememberLocation } from './policeMaps';
import { mapsSearchPoliceUrl } from './nearbyPolice';
import { POLICE_MAPS_LANGUAGES, getPoliceMapsStrings } from '../i18n/policeMapsStrings';
import { SOS_DASH_EN, getSosDashStrings } from '../i18n/sosDashboardStrings';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(`TEST FAILED: ${m}`);
}

console.log('--- Voice (8 languages) and police search tests ---');

const LANGS: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'mr', 'ml', 'gu', 'kn'];

// Every language has strong + weak phrases, and every strong phrase triggers in its own language.
for (const lang of LANGS) {
  assert(STRONG_PHRASES[lang].length >= 3, `${lang} has strong phrases`);
  assert(WEAK_PHRASES[lang].length >= 1, `${lang} has weak phrases`);
  for (const p of STRONG_PHRASES[lang]) {
    assert(classifyTranscript(`  ${p}!  `, lang).strong !== null, `${lang}: "${p}" is recognised on its own`);
    assert(classifyTranscript(`... ${p}, please`, lang).strong !== null, `${lang}: "${p}" is recognised inside a sentence`);
  }
  for (const p of WEAK_PHRASES[lang]) {
    assert(classifyTranscript(p, lang).weakCount >= 1, `${lang}: weak "${p}" counted`);
    assert(classifyTranscript(p, lang).strong === null, `${lang}: weak "${p}" is not a strong trigger`);
  }
}

// Ordinary speech never triggers (English word boundaries, no Indic matches)
assert(classifyTranscript('this is very helpful, thanks', 'en').weakCount === 0, '"helpful" is not "help"');
for (const lang of LANGS) assert(classifyTranscript('the weather is nice today', lang).weakCount === 0, `${lang}: ordinary English speech`);

// Real phrases per language, written as an engine might return them
assert(classifyTranscript('காப்பாற்றுங்கள்', 'ta').strong !== null, 'ta strong');
assert(classifyTranscript('பேருந்தில் உதவி உதவி', 'ta').weakCount === 2, 'ta weak twice');
assert(classifyTranscript('मुझे बचाओ', 'hi').strong !== null, 'hi strong');
assert(classifyTranscript('నన్ను కాపాడండి', 'te').strong !== null, 'te strong');
assert(classifyTranscript('मला वाचवा', 'mr').strong !== null, 'mr strong');
assert(classifyTranscript('എന്നെ രക്ഷിക്കൂ', 'ml').strong !== null, 'ml strong');
assert(classifyTranscript('મને બચાવો', 'gu').strong !== null, 'gu strong');
assert(classifyTranscript('ನನ್ನನ್ನು ಕಾಪಾಡಿ', 'kn').strong !== null, 'kn strong');
assert(classifyTranscript('help me', 'kn').strong === 'help me', 'English phrase works while another language is selected');

// Normalisation: zero-width characters, punctuation/danda, spacing, nukta, chandrabindu, Malayalam chillu
assert(normalizeSpeech('  बचाओ।  ') === 'बचाओ', 'danda and spaces removed');
assert(normalizeSpeech('ಸಹಾಯ\u200C ಮಾಡಿ') === 'ಸಹಾಯ ಮಾಡಿ', 'zero-width non-joiner removed');
assert(classifyTranscript('ಸಹಾಯಮಾಡಿ', 'kn').strong !== null, 'kn phrase without the space still matches');
assert(classifyTranscript('मदद\u200D करो', 'hi').strong !== null, 'hi phrase with joiner matches');
assert(normalizeSpeech('मदद') === normalizeSpeech('मदद'), 'stable');
assert(normalizeSpeech('\u0915\u093C') === normalizeSpeech('\u0915'), 'nukta ignored');
assert(normalizeSpeech('\u0A81') === normalizeSpeech('\u0A82'), 'gujarati chandrabindu = anusvara');
assert(normalizeSpeech('\u0D23\u0D4D\u200D') === '\u0D7A', 'malayalam chillu sequence -> single letter');

// Alternatives: a strong phrase in any candidate counts; weak words are counted once, from the best one
assert(classifyAlternatives(['mada karo', 'मदद करो', 'madad'], 'hi').strong === 'मदद करो', 'strong phrase in 2nd alternative');
assert(classifyAlternatives(['help', 'help', 'help'], 'en').weakCount === 1, 'weak words not triple-counted');
assert(classifyAlternatives([], 'en').weakCount === 0, 'no alternatives is safe');

// Voice-monitor strings added for honest status exist in every language
for (const lang of LANGS) {
  const d = getSosDashStrings(lang);
  for (const k of ['vmStarting', 'vmNotListening', 'vmLangUnsupported'] as const) {
    assert(typeof d[k] === 'string' && d[k].trim().length > 0, `${lang}.${k} present`);
    if (lang !== 'en') assert(d[k] !== SOS_DASH_EN[k], `${lang}.${k} translated`);
  }
}

// Police search URL: coordinates when known, general search otherwise; never needs the SAHAYINI API
const withGps = policeMapsUrl({ lat: 13.0827, lng: 80.2707 });
assert(withGps.startsWith('https://www.google.com/maps/search/police+stations/@13.0827,80.2707'), 'maps URL uses coordinates');
assert(policeMapsUrl(null).includes('police%20stations%20near%20me'), 'general fallback search');
assert(mapsSearchPoliceUrl({ lat: 1, lng: 2 }) === policeMapsUrl({ lat: 1, lng: 2 }), 'legacy helper delegates to the shared URL');

// Latest-fix memory (age limited)
rememberLocation({ lat: 10, lng: 20, accuracy: 5 }, 1_000);
assert(getLatestLocation(60_000, 30_000)?.lat === 10, 'recent fix reused');
assert(getLatestLocation(60_000, 120_000) === null, 'old fix not reused');

// Police messages complete in 8 languages and never claim police are alerted
assert(POLICE_MAPS_LANGUAGES.length === 8, 'eight languages');
const en = getPoliceMapsStrings('en');
for (const lang of LANGS) {
  const p = getPoliceMapsStrings(lang);
  for (const k of Object.keys(en) as (keyof typeof en)[]) {
    assert(p[k].trim().length > 0, `${lang}.${k} present`);
    if (lang !== 'en') assert(p[k] !== en[k], `${lang}.${k} translated`);
  }
  assert(p.notAlert.includes('112'), `${lang}: not-alert note points to 112`);
}

console.log('✓ Voice and police search tests passed');
