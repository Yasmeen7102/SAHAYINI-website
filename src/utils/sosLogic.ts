/**
 * Pure helpers for the redesigned SOS page. No React or browser APIs here so they can be unit tested.
 */
import { LanguageCode } from '../types';

/** A live location is treated as "cannot refresh" if no fix arrived within this time. */
export const STALE_AFTER_MS = 75_000;

export function isLocationStale(lastOkMs: number | null, nowMs: number, limitMs: number = STALE_AFTER_MS): boolean {
  if (lastOkMs === null) return false;
  return nowMs - lastOkMs > limitMs;
}

const CLOCK_LOCALE: Record<LanguageCode, string> = {
  en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN', te: 'te-IN', mr: 'mr-IN', ml: 'ml-IN', gu: 'gu-IN', kn: 'kn-IN',
};

export function formatClock(d: Date, lang: LanguageCode): string {
  try {
    return d.toLocaleTimeString(CLOCK_LOCALE[lang] || 'en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return d.toLocaleTimeString();
  }
}

/**
 * Which trusted contacts receive SOS messages.
 * stored === null means the user has never chosen: every trusted contact is pre-selected so the safety
 * feature works out of the box. Once the user chooses, only their choice is used (an empty list stays empty).
 */
export function resolveRecipients<T extends { id: string }>(trusted: T[], stored: string[] | null): T[] {
  if (stored === null) return trusted;
  const set = new Set(stored);
  return trusted.filter((c) => set.has(c.id));
}

/* ---------------- Voice monitor false-alarm protection ---------------- */

/**
 * Strong phrases are unambiguous calls for help and trigger on one finished utterance.
 * Weak phrases are single common words ("help", "emergency") that TV and conversation also contain,
 * so they must be heard twice within a short window.
 */
export const STRONG_PHRASES: Record<LanguageCode, string[]> = {
  en: ['help me', 'save me', 'call the police', 'call police', 'somebody help', 'someone help', 'please help'],
  ta: ['காப்பாற்றுங்கள்', 'காப்பாத்துங்க', 'காப்பாற்றுங்க', 'என்னை காப்பாற்று', 'உதவி செய்யுங்கள்', 'காவல்துறையை அழைக்கவும்', 'காவல்துறையை அழையுங்கள்', 'போலீசை கூப்பிடுங்கள்', 'kaapathunga', 'kaapaatrungal'],
  hi: ['बचाओ', 'मुझे बचाओ', 'बचाइए', 'मदद करो', 'मेरी मदद करो', 'मदद कीजिए', 'पुलिस बुलाओ', 'पुलिस को बुलाओ', 'bachao', 'madad karo'],
  te: ['నన్ను కాపాడండి', 'కాపాడండి', 'రక్షించండి', 'సహాయం చేయండి', 'పోలీసులను పిలవండి', 'పోలీసులకు ఫోన్ చేయండి', 'kapadandi'],
  mr: ['वाचवा', 'मला वाचवा', 'मदत करा', 'मला मदत करा', 'पोलिसांना बोलवा', 'पोलिसांना बोलावा', 'बचाओ', 'vachva', 'madat kara'],
  ml: ['രക്ഷിക്കൂ', 'രക്ഷിക്കണേ', 'എന്നെ രക്ഷിക്കൂ', 'സഹായിക്കൂ', 'സഹായിക്കണേ', 'പോലീസിനെ വിളിക്കൂ', 'പൊലീസിനെ വിളിക്കൂ', 'rakshikku'],
  gu: ['મદદ કરો', 'મારી મદદ કરો', 'બચાવો', 'મને બચાવો', 'પોલીસને બોલાવો', 'પોલીસ બોલાવો', 'bachavo'],
  kn: ['ಸಹಾಯ ಮಾಡಿ', 'ನನ್ನನ್ನು ಕಾಪಾಡಿ', 'ಕಾಪಾಡಿ', 'ಉಳಿಸಿ', 'ರಕ್ಷಿಸಿ', 'ಪೊಲೀಸರನ್ನು ಕರೆಸಿ', 'ಪೊಲೀಸರಿಗೆ ಕರೆ ಮಾಡಿ', 'kapadi'],
};

export const WEAK_PHRASES: Record<LanguageCode, string[]> = {
  en: ['help', 'emergency', 'stop it'],
  ta: ['உதவி', 'அவசரம்', 'எமர்ஜென்சி'],
  hi: ['मदद', 'आपातकाल', 'इमरजेंसी', 'हेल्प'],
  te: ['సహాయం', 'అత్యవసరం', 'ఎమర్జెన్సీ', 'హెల్ప్'],
  mr: ['आपत्कालीन', 'आणीबाणी', 'मदत', 'इमर्जन्सी'],
  ml: ['അടിയന്തരാവസ്ഥ', 'അടിയന്തര', 'സഹായം', 'എമർജൻസി'],
  gu: ['કટોકટી', 'મદદ', 'ઇમરજન્સી'],
  kn: ['ತುರ್ತು', 'ಸಹಾಯ', 'ಎಮರ್ಜೆನ್ಸಿ'],
};

/**
 * Speech engines return the same word in slightly different Unicode forms (zero-width joiners, nukta,
 * chandrabindu vs anusvara, old/new Malayalam chillu spelling, punctuation, spacing). Both the heard text and
 * the phrase lists go through this, so a phrase matches whichever form the engine produced.
 */
const CHILLU: Record<string, string> = {
  '\u0D23': '\u0D7A', '\u0D28': '\u0D7B', '\u0D30': '\u0D7C', '\u0D32': '\u0D7D', '\u0D33': '\u0D7E', '\u0D15': '\u0D7F',
};
export function normalizeSpeech(input: string): string {
  return (input || '')
    .normalize('NFKC')
    .replace(/([\u0D23\u0D28\u0D30\u0D32\u0D33\u0D15])\u0D4D\u200D/g, (_m, c: string) => CHILLU[c]) // Malayalam chillu sequence -> single letter
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '') // zero-width characters
    .toLocaleLowerCase()
    .replace(/\u093C/g, '') // Devanagari nukta
    .replace(/\u0901/g, '\u0902') // Devanagari chandrabindu -> anusvara
    .replace(/\u0A81/g, '\u0A82') // Gujarati chandrabindu -> anusvara
    .replace(/[\p{P}\p{S}]/gu, ' ') // punctuation, danda, symbols
    .replace(/\s+/g, ' ')
    .trim();
}

const escapeRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isLatinPhrase = (p: string) => /^[a-z0-9 ]+$/.test(p);
const compact = (x: string) => x.replace(/ /g, '');

/** Occurrences of an (already normalised) phrase in (already normalised) text. */
function phraseCount(text: string, phrase: string): number {
  if (!phrase) return 0;
  if (isLatinPhrase(phrase)) {
    // Latin words need word boundaries so "help" does not match "helpful".
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(phrase)}(?![\\p{L}\\p{N}])`, 'gu');
    return (text.match(re) || []).length;
  }
  const direct = countOccurrences(text, phrase);
  // Indic engines may split or join compound words differently, so also compare without spaces.
  return direct > 0 || !phrase.includes(' ') ? direct : countOccurrences(compact(text), compact(phrase));
}

export function countOccurrences(text: string, phrase: string): number {
  if (!phrase) return 0;
  let n = 0;
  let i = text.indexOf(phrase);
  while (i !== -1) {
    n += 1;
    i = text.indexOf(phrase, i + phrase.length);
  }
  return n;
}

export interface TranscriptMatch {
  /** A strong phrase was heard: trigger immediately. */
  strong: string | null;
  /** Number of weak-phrase occurrences (after removing strong-phrase text), and the first one heard. */
  weakCount: number;
  weak: string | null;
}

export function classifyTranscript(transcript: string, lang: LanguageCode): TranscriptMatch {
  const text = normalizeSpeech(transcript);
  // Selected language first, plus English: people mix "help me" into any language.
  const strongList = [...new Set([...(STRONG_PHRASES[lang] || []), ...STRONG_PHRASES.en])];
  const weakList = [...new Set([...(WEAK_PHRASES[lang] || []), ...WEAK_PHRASES.en])];

  const strong = strongList.find((p) => phraseCount(text, normalizeSpeech(p)) > 0) || null;
  if (strong) return { strong, weakCount: 0, weak: null };

  let weakCount = 0;
  let weak: string | null = null;
  for (const p of weakList) {
    const c = phraseCount(text, normalizeSpeech(p));
    if (c > 0) {
      weakCount += c;
      weak = weak ?? p;
    }
  }
  return { strong: null, weakCount, weak };
}

/**
 * Speech engines can return several candidate transcripts for one utterance. A strong phrase in any of
 * them counts; weak words are counted from the best (first) candidate only so they are never triple-counted.
 */
export function classifyAlternatives(transcripts: string[], lang: LanguageCode): TranscriptMatch {
  let first: TranscriptMatch | null = null;
  for (const t of transcripts) {
    const m = classifyTranscript(t, lang);
    if (m.strong) return m;
    if (!first) first = m;
  }
  return first || { strong: null, weakCount: 0, weak: null };
}

/** Counts weak-phrase hits; fires when `needed` hits land within `windowMs`. */
export class PhraseGate {
  private hits: number[] = [];
  constructor(private windowMs = 8000, private needed = 2) {}

  register(count: number, nowMs: number): boolean {
    for (let i = 0; i < count; i += 1) this.hits.push(nowMs);
    this.hits = this.hits.filter((t) => nowMs - t <= this.windowMs);
    if (this.hits.length >= this.needed) {
      this.hits = [];
      return true;
    }
    return false;
  }

  reset(): void {
    this.hits = [];
  }
}

/** Fires only when the sound level stays above the threshold continuously for `sustainMs`. */
export class LoudSoundGate {
  private since: number | null = null;
  constructor(private threshold = 0.3, private sustainMs = 2500) {}

  update(rms: number, nowMs: number): boolean {
    if (rms > this.threshold) {
      if (this.since === null) this.since = nowMs;
      if (nowMs - this.since >= this.sustainMs) {
        this.since = null;
        return true;
      }
    } else {
      this.since = null;
    }
    return false;
  }

  reset(): void {
    this.since = null;
  }
}

/** After the user cancels an alert, ignore new triggers for this long. */
export const CANCEL_COOLDOWN_MS = 60_000;

export const COUNTDOWN_OPTIONS = [5, 10, 15, 20, 30] as const;
export const DEFAULT_COUNTDOWN = 10;

export function normalizeCountdown(v: unknown): number {
  const n = Number(v);
  return (COUNTDOWN_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_COUNTDOWN;
}
