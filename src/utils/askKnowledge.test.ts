/**
 * Ask SAHAYINI offline / instant answers and Listen playback logic (the browser's speechSynthesis is replaced
 * by a small recording stand-in so the real playback code runs under Node).
 */
import fs from 'node:fs';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { findLocalAnswer } from '../services/askKnowledge';
import { getDefaultOfflineAnswer } from '../services/offlineChatAnswers';
import { offlineStorage } from '../services/offlineStorage';
import { getExtraStrings } from '../i18n/extraStrings';
import { cleanForSpeech, chunkForSpeech, speakAnswer, stopSpeaking } from './askSpeech';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(`TEST FAILED: ${m}`);
}
const LANGS: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'mr', 'ml', 'gu', 'kn'];
const script: Record<LanguageCode, RegExp> = {
  en: /[A-Za-z]/, ta: /[\u0B80-\u0BFF]/, hi: /[\u0900-\u097F]/, te: /[\u0C00-\u0C7F]/,
  mr: /[\u0900-\u097F]/, ml: /[\u0D00-\u0D7F]/, gu: /[\u0A80-\u0AFF]/, kn: /[\u0C80-\u0CFF]/,
};

async function main() {
  console.log('--- Ask SAHAYINI instant/offline answer + Listen tests ---');

  // 1) Every suggested question, in every language, is answered instantly from the device IN THAT LANGUAGE (online path: topics off)
  let n = 0;
  for (const lang of LANGS) {
    const qs = translations[lang].ask.suggestions;
    assert(qs.length === 20, `${lang}: 20 suggestions`);
    qs.forEach((q, i) => {
      const t0 = performance.now();
      const r = findLocalAnswer(q, lang, { topics: false });
      const ms = performance.now() - t0;
      assert(!!r && r.kind === 'starter' && r.index === i, `${lang} #${i} resolves to its own saved answer`);
      assert(r!.text === getDefaultOfflineAnswer(i, lang), `${lang} #${i} uses the ${lang} text`);
      assert(script[lang].test(r!.text), `${lang} #${i} is written in the ${lang} script`);
      assert(ms < 50, `${lang} #${i} answered in ${ms.toFixed(1)}ms (target: well under 1s)`);
      n++;
    });
  }
  assert(n === 160, '160 suggested questions checked');

  // 2) Microphone-style variants (no question mark, different case/spacing, extra punctuation) still match
  for (const lang of LANGS) {
    const q = translations[lang].ask.suggestions[9];
    for (const variant of [q.replace(/[?？]/g, ''), '  ' + q.toUpperCase() + '  ', q.replace(/\?/g, ' ?'), q.replace(/ /g, '  ')]) {
      const r = findLocalAnswer(variant, lang, { topics: false });
      assert(!!r && r.index === 9, `${lang}: spoken/typed variant of question 9 matches`);
    }
  }
  // A question typed in English while another language is selected is answered in the SELECTED language
  const crossed = findLocalAnswer(translations.en.ask.suggestions[1], 'ta', { topics: false });
  assert(!!crossed && script.ta.test(crossed.text) && crossed.text === getDefaultOfflineAnswer(1, 'ta'), 'English question, Tamil selected -> Tamil answer');

  // 3) No guessing: unrelated questions get NO saved answer (online and offline), in every language
  for (const q of ['what is the capital of australia', 'how can you help me with my homework', 'what is pinterest', 'tell me a joke', 'who won the match', 'What is UPI?', 'police']) {
    for (const lang of LANGS) {
      assert(findLocalAnswer(q, lang, { topics: true }) === null, `"${q}" (${lang}) must not match a saved answer`);
      assert(offlineStorage.getOfflineChatResult(q, lang).matched === false, `"${q}" (${lang}) is reported as not matched`);
    }
  }

  // 4) Offline topic questions typed freely map to the right saved answer, answered in the selected language
  const topics: [string, LanguageCode, number][] = [
    ['someone is following me at night', 'en', 3],
    ['how do I report cyber fraud', 'en', 9],
    ['my UPI money was stolen', 'hi', 7],
    ['I gave my OTP to a stranger', 'ta', 8],
    ['what is a safety plan for me', 'te', 4],
    ['domestic violence help', 'mr', 11],
    ['someone is blackmailing me', 'ml', 14],
    ['I received a suspicious link', 'gu', 6],
    ['how to apply for a scheme', 'kn', 17],
    ['how can I check eligibility for a scheme', 'en', 16],
    ['women helpline number', 'ta', 13],
  ];
  for (const [q, lang, idx] of topics) {
    const r = findLocalAnswer(q, lang, { topics: true });
    assert(!!r && r.index === idx, `"${q}" -> answer #${idx} (got ${r?.index})`);
    assert(script[lang].test(r!.text), `"${q}" answered in ${lang} script`);
  }
  // Native-script free questions (typed or spoken) also map correctly
  const native: [string, LanguageCode, number][] = [
    ['मेरे UPI से पैसे चोरी हो गए', 'hi', 7],
    ['யாரோ என்னை பின்தொடர்கிறார்கள்', 'ta', 3],
    ['సైబర్ నేరం ఫిర్యాదు', 'te', 9],
    ['मला धमकी मिळाली', 'mr', 14],
    ['ഓഫ്‌ലൈൻ ആയാൽ എന്ത് ചെയ്യും', 'ml', 19],
    ['ઘરેલુ હિંસા થાય તો', 'gu', 11],
    ['ಸರ್ಕಾರಿ ಯೋಜನೆ ಅರ್ಹತೆ', 'kn', 16],
  ];
  for (const [q, lang, idx] of native) {
    const r = findLocalAnswer(q, lang, { topics: true });
    assert(!!r && r.index === idx, `"${q}" (${lang}) -> #${idx} (got ${r?.index})`);
  }
  // Online instant path never answers free-form questions locally (the AI should)
  assert(findLocalAnswer('someone is following me at night', 'en', { topics: false }) === null, 'free-form is left to the AI when online');

  // 5) Offline result carries no English label/markdown for starter answers, and labels topic data in the selected language
  for (const lang of LANGS) {
    const r = offlineStorage.getOfflineChatResult(translations[lang].ask.suggestions[0], lang);
    assert(r.matched && r.kind === 'starter' && !/Offline|\*\*/.test(r.text), `${lang}: starter answer is plain saved text`);
    const s = offlineStorage.getOfflineChatResult('scholarship scheme', lang);
    assert(s.matched && s.text.includes('myscheme.gov.in') && !/\*\*/.test(s.text), `${lang}: scheme answer is plain text and offers the official portal`);
  }
  const en = offlineStorage.getOfflineChatResult('Tell me about scholarships', 'en');
  assert(/PM-USHA|Scholarship/.test(en.text), 'cached scheme data still used');
  const ta = offlineStorage.getOfflineChatResult('scholarship scheme', 'ta');
  assert(!/Benefits|Official portal/.test(ta.text) && /பலன்கள்/.test(ta.text), 'scheme labels are localised (Tamil)');

  // 6) New UI strings exist and are translated in all 8 languages
  const base = getExtraStrings('en');
  for (const k of ['chatLocalBadge', 'chatTtsUnsupported', 'chatMicUnsupported', 'chatMicDenied', 'chatMicNetwork', 'chatMicNoSpeech', 'chatMicLang'] as const) {
    for (const lang of LANGS) {
      const v = getExtraStrings(lang)[k];
      assert(typeof v === 'string' && v.trim().length > 0, `${lang}.${k} present`);
      if (lang !== 'en') assert(v !== base[k] && script[lang].test(v), `${lang}.${k} translated`);
    }
  }

  // 7) Speech text preparation
  assert(!/[*#`]|💾|https?:/.test(cleanForSpeech('💾 **Saved** answer: see https://cybercrime.gov.in')), 'markdown/emoji/link prefix removed');
  const longText = 'நடக்கும் ஒன்று. '.repeat(40) + 'முடிவு। Last one!';
  const parts = chunkForSpeech(longText, 120);
  assert(parts.length > 3 && parts.every((p) => p.length <= 125), 'long answers are split into short pieces');
  assert(chunkForSpeech('').length === 0, 'empty text -> nothing to speak');

  // 8) Listen playback with a recording stand-in for the browser's speech engine
  const spoken: { text: string; lang: string; voice: string | null }[] = [];
  let cancelled = 0;
  const voices = [
    { name: 'V en', lang: 'en-IN' }, { name: 'V ta', lang: 'ta-IN' }, { name: 'V hi', lang: 'hi-IN' }, { name: 'V te', lang: 'te-IN' },
    { name: 'V mr', lang: 'mr-IN' }, { name: 'V ml', lang: 'ml-IN' }, { name: 'V gu', lang: 'gu-IN' }, { name: 'V kn', lang: 'kn-IN' },
  ];
  let installed = voices;
  let pending: any = null;
  (globalThis as any).window = {
    speechSynthesis: {
      getVoices: () => installed,
      speak: (u: any) => { spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name ?? null }); pending = u; },
      cancel: () => { cancelled++; pending = null; },
      addEventListener() {}, removeEventListener() {},
    },
  };
  (globalThis as any).SpeechSynthesisUtterance = class { text: string; lang = ''; voice: any = null; rate = 1; onstart: any; onend: any; onerror: any; constructor(t: string) { this.text = t; } };
  const finishChunk = () => { const u = pending; pending = null; u?.onstart?.(); u?.onend?.(); };

  assert(spoken.length === 0, 'nothing is spoken until Listen is clicked');
  for (const lang of LANGS) {
    spoken.length = 0;
    let ended = false, started = false;
    const answer = getDefaultOfflineAnswer(0, lang)!;
    const res = await speakAnswer(answer, lang, { onStart: () => (started = true), onEnd: () => (ended = true) });
    assert(res.ok, `${lang}: playback starts`);
    assert(spoken.length === 1 && spoken[0].voice === `V ${lang}` && spoken[0].lang === `${lang}-IN`, `${lang}: uses the ${lang} voice (${spoken[0]?.voice}/${spoken[0]?.lang})`);
    for (let guard = 0; pending && guard < 50; guard++) finishChunk();
    assert(started && ended, `${lang}: start and end reported`);
    assert(spoken.map((s) => s.text).join(' ').replace(/\s+/g, '').length > answer.replace(/\s+/g, '').length * 0.9, `${lang}: whole answer was read`);
  }

  // Stop: cancels and prevents the next piece
  spoken.length = 0; cancelled = 0;
  let endedAfterStop = false;
  await speakAnswer('One sentence here. Two sentence here. Three sentence here.'.repeat(6), 'en', { onEnd: () => (endedAfterStop = true) });
  const firstCount = spoken.length;
  stopSpeaking();
  const u = pending; u?.onend?.();
  assert(cancelled >= 1 && spoken.length === firstCount && !endedAfterStop, 'Stop cancels speech and does not continue');

  // No voice installed for the language -> clear refusal, never an English voice reading Indian-language text
  installed = voices.filter((v) => v.lang !== 'ml-IN');
  spoken.length = 0;
  const noVoice = await speakAnswer(getDefaultOfflineAnswer(0, 'ml')!, 'ml');
  assert(!noVoice.ok && (noVoice as any).reason === 'no_voice' && spoken.length === 0, 'missing voice is reported, nothing spoken');

  // No speech support at all
  delete (globalThis as any).window.speechSynthesis;
  const unsup = await speakAnswer('hello', 'en');
  assert(!unsup.ok && (unsup as any).reason === 'unsupported', 'unsupported browser reported');

  // 9) Text first: the Ask view starts audio ONLY from the Listen button's click handler (static guard; run from the project root)
  const view = fs.readFileSync('src/components/views/AskSahayiniView.tsx', 'utf8');
  const listenFn = view.slice(view.indexOf('const handleListen'), view.indexOf('const handleStopListening'));
  assert((view.match(/speakAnswer\(/g) || []).length === 1 && listenFn.includes('speakAnswer('), 'speakAnswer is called only inside handleListen');
  assert(!/speechSynthesis\.speak|new SpeechSynthesisUtterance/.test(view), 'the view never starts the browser voice directly');
  const calls = view.match(/.{0,30}handleListen\(/g) || [];
  assert(calls.length === 1 && /onClick=\{\(\) => void handleListen\($/.test(calls[0]), 'handleListen is only wired to the Listen button onClick');
  const sendFn = view.slice(view.indexOf('const handleSendMessage'), view.indexOf('const handleRetry'));
  assert(!/handleListen|speakAnswer/.test(sendFn), 'sending a message / receiving an answer never triggers speech');
  assert(/stopSpeaking\(\)/.test(sendFn) || /handleStopListening\(\)/.test(sendFn), 'a new question silences any answer still playing');

  console.log('✓ Ask SAHAYINI instant/offline answer + Listen tests passed');
}

// An unhandled rejection makes Node exit with a failure code, which fails `npm test`.
main().catch((e) => {
  console.error(e);
  throw e;
});
