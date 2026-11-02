/**
 * Ask SAHAYINI: instant on-device answers.
 *
 * Everything here is synchronous and local, so a saved answer appears immediately, with or without internet.
 *  1. The 20 starter (suggested) questions, exact or near-exact, in ANY of the 8 languages, are answered
 *     in the user's SELECTED language from the saved answers (offlineChatAnswers.ts).
 *  2. When there is no connection, a small set of precise multilingual topic keywords can map a free-typed or
 *     spoken question to the matching saved answer. If nothing matches we return null: callers must say
 *     "no saved answer" instead of inventing one or showing an unrelated answer.
 *
 * Native-speaker review is recommended for the topic keywords in the non-English languages.
 */
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { getDefaultOfflineAnswer } from './offlineChatAnswers';
import { getSosStrings } from '../i18n/sosStrings';
import { normalizeSpeech } from '../utils/sosLogic';

export interface LocalAnswer {
  text: string;
  kind: 'starter' | 'topic';
  /** Index (0-19) of the saved answer that was used. */
  index: number;
  via: 'exact' | 'near' | 'topic';
}

const LANGS: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'mr', 'ml', 'gu', 'kn'];

/** Same normalisation as the voice monitor (zero-width marks, punctuation, nukta, case) so spoken text matches typed text. */
export const norm = (s: string) => normalizeSpeech(s || '');

// --- Starter questions (normalised once) ----------------------------------------------------------------------
interface StarterEntry {
  index: number;
  text: string;
  compact: string;
  tokens: Set<string>;
  grams: Set<string>;
}
const grams3 = (s: string): Set<string> => {
  const out = new Set<string>();
  const c = s.replace(/ /g, '');
  if (c.length < 3) {
    if (c) out.add(c);
    return out;
  }
  for (let i = 0; i <= c.length - 3; i++) out.add(c.slice(i, i + 3));
  return out;
};
const dice = (a: Set<string>, b: Set<string>) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return (2 * inter) / (a.size + b.size);
};

let starters: StarterEntry[] | null = null;
function getStarters(): StarterEntry[] {
  if (starters) return starters;
  const list: StarterEntry[] = [];
  for (const lang of LANGS) {
    const qs = translations[lang]?.ask?.suggestions || [];
    qs.forEach((q, index) => {
      const text = norm(q);
      list.push({ index, text, compact: text.replace(/ /g, ''), tokens: new Set(text.split(' ').filter(Boolean)), grams: grams3(text) });
    });
  }
  starters = list;
  return list;
}

function matchStarter(query: string): { index: number; via: 'exact' | 'near' } | null {
  const q = norm(query);
  if (!q) return null;
  const all = getStarters();
  const qc = q.replace(/ /g, '');
  for (const s of all) if (s.text === q || s.compact === qc) return { index: s.index, via: 'exact' };

  // Near match: typed/spoken variants of a starter question (missing "?" or a word, different spacing).
  const qTokens = new Set(q.split(' ').filter(Boolean));
  const qGrams = grams3(q);
  if (qTokens.size < 3) return null;
  let best: { index: number; score: number } | null = null;
  for (const s of all) {
    const score = Math.max(dice(qGrams, s.grams), dice(qTokens, s.tokens));
    if (score >= 0.82 && (!best || score > best.score)) best = { index: s.index, score };
  }
  return best ? { index: best.index, via: 'near' } : null;
}

// --- Topic keywords (used when offline / for free-typed questions) --------------------------------------------
type Group = string[];
const G: Record<string, string[]> = {
  report: ['report', 'complain', 'complaint', 'lodge', 'file a', 'புகார்', 'रिपोर्ट', 'शिकायत', 'ఫిర్యాదు', 'నివేదించ', 'तक्रार', 'റിപ്പോർട്ട്', 'പരാതി', 'ફરિયાદ', 'રિપોર્ટ', 'ದೂರು', 'ವರದಿ'],
  cyber: ['cyber', '1930', 'சைபர்', 'साइबर', 'సైబర్', 'सायबर', 'സൈബർ', 'સાયબર', 'ಸೈಬರ್'],
  scam: ['scam', 'fraud', 'phishing', 'cheat', 'மோசடி', 'धोखाधड़ी', 'धोखा', 'ठगी', 'మోసం', 'మోసాన్ని', 'फसवणूक', 'തട്ടിപ്പ്', 'છેતરપિંડી', 'ವಂಚನೆ'],
  link: ['link', 'லிங்க்', 'இணைப்பு', 'लिंक', 'లింక్', 'ലിങ്ക്', 'લિંક'],
  suspicious: ['suspicious', 'suspect', 'fake', 'சந்தேக', 'संदिग्ध', 'संदेह', 'అనుమానాస్పద', 'संशयास्पद', 'സംശയ', 'શંકાસ્પદ', 'ಸಂದೇಹ', 'ಅನುಮಾನ'],
  upi: ['upi'],
  moneyLost: ['stole', 'stolen', 'lost money', 'money lost', 'theft', 'திருட', 'चोरी', 'దొంగ', 'चोरीला', 'മോഷ്ട', 'ચોરા', 'ಕಳು', 'ಕಳವು'],
  otpPin: ['otp', 'pin', 'cvv'],
  shared: ['share', 'shared', 'gave', 'told', 'mistake', 'பகிர', 'साझा', 'పంచుకు', 'शेअर', 'പങ്കി', 'શેર', 'ಹಂಚಿ'],
  harass: ['harass', 'eve teas', 'துன்புறுத்த', 'उत्पीड़न', 'छेड़', 'వేధింప', 'छळ', 'പീഡനം', 'હેરાનગતિ', 'ಕಿರುಕುಳ'],
  domestic: ['domestic violence', 'domestic abuse', 'dowry', 'குடும்ப வன்முறை', 'घरेलू हिंसा', 'గృహ హింస', 'घरगुती हिंसा', 'ഗാർഹിക', 'ઘરેલુ હિંસા', 'ಗೃಹ ಹಿಂಸೆ'],
  police: ['police', 'fir', 'காவல்', 'போலீஸ்', 'पुलिस', 'పోలీసు', 'पोलीस', 'പോലീസ്', 'પોલીસ', 'ಪೊಲೀಸ್'],
  threat: ['blackmail', 'threat', 'extort', 'மிரட்ட', 'धमकी', 'ब्लैकमेल', 'బెదిరి', 'బ్లాక్‌మెయిల్', 'ब्लॅकमेल', 'ഭീഷണി', 'ബ്ലാക്ക്', 'ધમકી', 'બ્લેકમેઇલ', 'ಬೆದರಿ', 'ಬ್ಲ್ಯಾಕ್'],
  following: ['following me', 'followed me', 'stalk', 'பின்தொடர்', 'पीछा', 'వెంబడ', 'पाठलाग', 'പിന്തുടർ', 'પીછો', 'ಹಿಂಬಾಲ'],
  helpline: ['helpline', 'help line', '1091', '181', 'உதவி எண்', 'हेल्पलाइन', 'హెల్ప్‌లైన్', 'ഹെൽപ്‌ലൈൻ', 'હેલ્પલાઇન', 'ಸಹಾಯವಾಣಿ'],
  location: ['location', 'இருப்பிட', 'लोकेशन', 'లొకేషన్', 'ലൊക്കേഷൻ', 'લોકેશન', 'ಸ್ಥಳ'],
  sharing: ['share', 'sharing', 'பகிர', 'साझा', 'పంచు', 'शेअर', 'പങ്കി', 'શેર', 'ಹಂಚಿ'],
  safetyPlan: ['safety plan', 'personal safety', 'பாதுகாப்புத் திட்ட', 'பாதுகாப்பு திட்ட', 'सुरक्षा योजना', 'భద్రతా ప్రణాళిక', 'സുരക്ഷാ പദ്ധതി', 'સુરક્ષા યોજના', 'ಸುರಕ್ಷತಾ ಯೋಜನೆ'],
  protectInfo: ['personal information', 'privacy', 'password', 'தனிப்பட்ட தகவல்', 'निजी जानकारी', 'వ్యక్తిగత సమాచార', 'वैयक्तिक माहिती', 'വ്യക്തിഗത വിവര', 'વ્યક્તિગત માહિતી', 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ'],
  offline: ['offline', 'without internet', 'no internet', 'இணையமின்றி', 'ऑफलाइन', 'ఆఫ్‌లైన్', 'ഓഫ്‌ലൈൻ', 'ઑફલાઇન', 'ઓફલાઇન', 'ಆಫ್‌ಲೈನ್'],
  scheme: ['scheme', 'yojana', 'scholarship', 'திட்டம்', 'திட்டங்கள்', 'योजना', 'పథక', 'पथक', 'പദ്ധതി', 'યોજના', 'ಯೋಜನೆ'],
  eligible: ['eligib', 'qualify', 'தகுதி', 'पात्रता', 'అర్హత', 'അർഹത', 'પાત્રતા', 'ಅರ್ಹತೆ'],
  apply: ['apply', 'application', 'விண்ணப்ப', 'आवेदन', 'अर्ज', 'దరఖాస్తు', 'അപേക്ഷ', 'અરજી', 'ಅರ್ಜಿ'],
  danger: ['in danger', 'danger', 'unsafe', 'attacked', 'sos', 'ஆபத்து', 'ஆபத்தில்', 'खतरे', 'ప్రమాద', 'धोक्य', 'അപകട', 'જોખમ', 'ಅಪಾಯ'],
  emergencyNo: ['112', 'emergency number', 'emergency service', 'emergency', 'call police', 'ambulance', 'அவசர', 'आपातकाल', 'आपत्कालीन', 'అత్యవసర', 'അടിയന്തര', 'ઇમરજન્સી', 'ತುರ್ತು'],
};

interface Rule {
  index: number;
  /** Every group must have at least one keyword present. */
  all: Group[];
  /** Keep the saved answer only (no extra helpline list). */
  withHelplines?: boolean;
}

// Most specific first. Anything not matched here is NOT answered offline (no guessing).
const RULES: Rule[] = [
  { index: 4, all: [G.safetyPlan] },
  { index: 11, all: [G.domestic] },
  { index: 14, all: [G.threat] },
  { index: 3, all: [G.following] },
  { index: 7, all: [G.upi, [...G.moneyLost, ...G.scam, ...G.report]] },
  { index: 8, all: [G.otpPin, G.shared] },
  { index: 6, all: [G.link, G.suspicious] },
  { index: 9, all: [[...G.cyber, ...G.scam], G.report] },
  { index: 5, all: [G.scam] },
  { index: 10, all: [G.harass] },
  { index: 9, all: [G.cyber] },
  { index: 12, all: [G.police, G.report] },
  { index: 13, all: [G.helpline], withHelplines: true },
  { index: 2, all: [G.location, G.sharing] },
  { index: 18, all: [G.protectInfo] },
  { index: 19, all: [G.offline] },
  { index: 16, all: [G.scheme, G.eligible] },
  { index: 17, all: [G.scheme, G.apply] },
  { index: 15, all: [G.scheme] },
  { index: 0, all: [G.danger] },
  { index: 1, all: [G.emergencyNo], withHelplines: true },
];

const isLatin = (p: string) => /^[a-z0-9 ]+$/.test(p);
const escapeRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function has(text: string, keyword: string): boolean {
  const k = norm(keyword);
  if (!k) return false;
  if (isLatin(k)) {
    // Short Latin keywords (pin, otp, sos, fir, upi, 112) must be whole words; longer ones may take suffixes (harass -> harassment).
    const end = k.length <= 3 ? '(?![\\p{L}\\p{N}])' : '';
    return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(k)}${end}`, 'u').test(text);
  }
  return text.includes(k) || text.replace(/ /g, '').includes(k.replace(/ /g, ''));
}

/** Localised list of the national helplines (titles and descriptions come from the SOS page strings). */
const HELPLINE_NUMBERS = ['112', '1091', '181', '1930', '1098', '108', '14567', '14416'];
function helplineList(language: LanguageCode): string {
  const ss = getSosStrings(language);
  const lines = HELPLINE_NUMBERS.filter((n) => ss.helplines[n]).map((n) => `• ${n} — ${ss.helplines[n].title}: ${ss.helplines[n].desc}`);
  return `${ss.helplinesIntro}\n${lines.join('\n')}`;
}

function topicMatch(query: string): Rule | null {
  const q = norm(query);
  if (!q) return null;
  for (const rule of RULES) {
    if (rule.all.every((group) => group.some((k) => has(q, k)))) return rule;
  }
  return null;
}

/**
 * Finds an on-device answer in the selected language.
 *  - `topics: false` (online, instant path): only starter questions (exact or near) are answered locally.
 *  - `topics: true` (offline): additionally uses the precise topic keywords above.
 */
export function findLocalAnswer(query: string, language: LanguageCode, opts: { topics: boolean }): LocalAnswer | null {
  const s = matchStarter(query);
  if (s) {
    const text = getDefaultOfflineAnswer(s.index, language);
    if (text) return { text, kind: 'starter', index: s.index, via: s.via };
  }
  if (!opts.topics) return null;
  const rule = topicMatch(query);
  if (!rule) return null;
  const base = getDefaultOfflineAnswer(rule.index, language);
  if (!base) return null;
  return { text: rule.withHelplines ? `${base}\n\n${helplineList(language)}` : base, kind: 'topic', index: rule.index, via: 'topic' };
}

/** Localised labels for answers built from the device's cached data (scheme list, helplines). */
export const OFFLINE_LABELS: Record<LanguageCode, { header: string; schemesTitle: string; benefits: string; portal: string }> = {
  en: { header: '[Offline Cached Response]', schemesTitle: 'Verified government schemes saved on this device:', benefits: 'Benefits', portal: 'Official portal' },
  ta: { header: '[ஆஃப்லைன் சேமிப்புப் பதில்]', schemesTitle: 'இந்தச் சாதனத்தில் சேமித்த சரிபார்க்கப்பட்ட அரசுத் திட்டங்கள்:', benefits: 'பலன்கள்', portal: 'அதிகாரப்பூர்வ தளம்' },
  hi: { header: '[ऑफ़लाइन सहेजा गया उत्तर]', schemesTitle: 'इस डिवाइस पर सहेजी गई सत्यापित सरकारी योजनाएँ:', benefits: 'लाभ', portal: 'आधिकारिक पोर्टल' },
  te: { header: '[ఆఫ్‌లైన్ సేవ్ చేసిన సమాధానం]', schemesTitle: 'ఈ పరికరంలో సేవ్ చేసిన ధృవీకరించిన ప్రభుత్వ పథకాలు:', benefits: 'ప్రయోజనాలు', portal: 'అధికారిక పోర్టల్' },
  mr: { header: '[ऑफलाइन जतन केलेले उत्तर]', schemesTitle: 'या डिव्हाइसवर जतन केलेल्या सत्यापित सरकारी योजना:', benefits: 'लाभ', portal: 'अधिकृत पोर्टल' },
  ml: { header: '[ഓഫ്‌ലൈൻ സേവ് ചെയ്ത ഉത്തരം]', schemesTitle: 'ഈ ഉപകരണത്തിൽ സേവ് ചെയ്ത പരിശോധിച്ച സർക്കാർ പദ്ധതികൾ:', benefits: 'ആനുകൂല്യങ്ങൾ', portal: 'ഔദ്യോഗിക പോർട്ടൽ' },
  gu: { header: '[ઑફલાઇન સાચવેલો જવાબ]', schemesTitle: 'આ ઉપકરણ પર સાચવેલી ચકાસાયેલ સરકારી યોજનાઓ:', benefits: 'લાભ', portal: 'સત્તાવાર પોર્ટલ' },
  kn: { header: '[ಆಫ್‌ಲೈನ್ ಉಳಿಸಿದ ಉತ್ತರ]', schemesTitle: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಪರಿಶೀಲಿತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು:', benefits: 'ಪ್ರಯೋಜನಗಳು', portal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್' },
};
