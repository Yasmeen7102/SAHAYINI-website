import { LanguageCode } from '../types';

export interface SpeechVoiceInfo {
  voice: SpeechSynthesisVoice | null;
  langLocale: string;
  isNativeAvailable: boolean;
  languageName: string;
}

export const LANGUAGE_LOCALE_MAP: Record<
  LanguageCode,
  { locale: string; name: string; altCodes: string[]; nativeName: string }
> = {
  en: { locale: 'en-IN', name: 'English', altCodes: ['en-US', 'en-GB', 'en'], nativeName: 'English' },
  ta: { locale: 'ta-IN', name: 'Tamil', altCodes: ['ta', 'ta_IN', 'ta-LK'], nativeName: 'தமிழ்' },
  hi: { locale: 'hi-IN', name: 'Hindi', altCodes: ['hi', 'hi_IN'], nativeName: 'हिन्दी' },
  te: { locale: 'te-IN', name: 'Telugu', altCodes: ['te', 'te_IN'], nativeName: 'తెలుగు' },
  mr: { locale: 'mr-IN', name: 'Marathi', altCodes: ['mr', 'mr_IN'], nativeName: 'मराठी' },
  ml: { locale: 'ml-IN', name: 'Malayalam', altCodes: ['ml', 'ml_IN'], nativeName: 'മലയാളം' },
  gu: { locale: 'gu-IN', name: 'Gujarati', altCodes: ['gu', 'gu_IN'], nativeName: 'ગુજરાતી' },
  kn: { locale: 'kn-IN', name: 'Kannada', altCodes: ['kn', 'kn_IN'], nativeName: 'ಕನ್ನಡ' },
};

// Prewarm speech synthesis voices cache if in browser
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  } catch (err) {
    // ignore
  }
}

/**
 * Find the best matching browser speech synthesis voice for a given language.
 */
export function getBestVoiceForLanguage(lang: LanguageCode): SpeechVoiceInfo {
  const config = LANGUAGE_LOCALE_MAP[lang] || LANGUAGE_LOCALE_MAP.en;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      voice: null,
      langLocale: config.locale,
      isNativeAvailable: false,
      languageName: `${config.name} (${config.nativeName})`,
    };
  }

  const voices = window.speechSynthesis.getVoices();
  // If voices have not been populated yet by the browser, allow locale-based utterance synthesis
  if (!voices || voices.length === 0) {
    return {
      voice: null,
      langLocale: config.locale,
      isNativeAvailable: true,
      languageName: `${config.name} (${config.nativeName})`,
    };
  }

  // 1. Exact match on locale (e.g. 'ta-IN')
  let matched = voices.find((v) => v.lang.toLowerCase() === config.locale.toLowerCase());

  // 2. Prefix or alternate code match (e.g. 'ta', 'ta_IN')
  if (!matched) {
    const langPrefix = lang.toLowerCase();
    matched = voices.find((v) => {
      const vLang = v.lang.toLowerCase();
      return (
        vLang.startsWith(langPrefix + '-') ||
        vLang === langPrefix ||
        vLang.startsWith(langPrefix + '_') ||
        config.altCodes.some((code) => vLang === code.toLowerCase() || vLang.startsWith(code.toLowerCase()))
      );
    });
  }

  // 3. Name or native script match (e.g. voice name contains "Tamil" or "தமிழ்")
  if (!matched && lang !== 'en') {
    const searchTerms = [
      config.name.toLowerCase(),
      config.nativeName.toLowerCase(),
      lang.toLowerCase(),
    ];
    matched = voices.find((v) => {
      const vName = v.name.toLowerCase();
      return searchTerms.some((term) => vName.includes(term));
    });
  }

  // 4. For English fallback if requested lang is English
  if (!matched && lang === 'en') {
    matched = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  }

  return {
    voice: matched || null,
    langLocale: config.locale,
    isNativeAvailable: Boolean(matched),
    languageName: `${config.name} (${config.nativeName})`,
  };
}

/**
 * Controller class to manage Play, Pause, Resume, Stop of SpeechSynthesis.
 */
export class SpeechPlayer {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChange?: (state: 'idle' | 'playing' | 'paused' | 'unavailable', message?: string) => void;

  constructor(onStateChange?: (state: 'idle' | 'playing' | 'paused' | 'unavailable', message?: string) => void) {
    this.onStateChange = onStateChange;
  }

  public speak(
    text: string,
    lang: LanguageCode,
    onEndCallback?: () => void
  ): { success: boolean; reason?: string } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.onStateChange?.('unavailable', 'Text-to-speech is not supported by your browser.');
      return { success: false, reason: 'speech_not_supported' };
    }

    // Stop existing speech
    this.stop();

    const voiceInfo = getBestVoiceForLanguage(lang);

    // CRITICAL: Never silently speak English while claiming it is another Indian language!
    if (!voiceInfo.isNativeAvailable && lang !== 'en') {
      const msg = `Your browser/device currently does not have a native voice installed for ${voiceInfo.languageName}. Please read the translated lesson text displayed below.`;
      this.onStateChange?.('unavailable', msg);
      return { success: false, reason: 'voice_unavailable' };
    }

    // Strip markdown formatting symbols
    const cleanText = text.replace(/[*#_`>]/g, '').trim();
    if (!cleanText) return { success: false, reason: 'empty_text' };

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceInfo.langLocale;
    if (voiceInfo.voice) {
      utterance.voice = voiceInfo.voice;
    }
    utterance.rate = 0.92; // Slightly measured rate for clear comprehension
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.onStateChange?.('playing');
    };

    utterance.onpause = () => {
      this.onStateChange?.('paused');
    };

    utterance.onresume = () => {
      this.onStateChange?.('playing');
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.onStateChange?.('idle');
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      this.onStateChange?.('idle');
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return { success: true };
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        this.onStateChange?.('paused');
      }
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.onStateChange?.('playing');
      }
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.onStateChange?.('idle');
    }
  }
}
