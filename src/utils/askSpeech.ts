/**
 * Ask SAHAYINI "Listen" playback. Speech is NEVER started automatically: speakAnswer() is only called from the
 * Listen button's click handler, and stop() from the Stop button (or when leaving the page / starting the mic).
 * Uses the browser's own speech synthesis with a voice for the selected language; if the device has no voice for
 * that language we say so (the caller shows a message) instead of reading it with an English voice.
 */
import { LanguageCode } from '../types';
import { getBestVoiceForLanguage } from './speechUtils';

/** Removes characters a voice would read badly (markdown, emoji, bullets, link prefixes). */
export function cleanForSpeech(text: string): string {
  return (text || '')
    .replace(/https?:\/\//gi, '')
    .replace(/[*#_`>~|]/g, ' ')
    .replace(/[\p{Extended_Pictographic}\u200D\uFE0F]/gu, ' ')
    .replace(/^[\s]*[•\-–]\s+/gm, '')
    .replace(/\s*\n\s*/g, '. ')
    .replace(/\.\s*\.+/g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Splits into sentence-sized pieces (works for English and the Indian-script danda) of at most `max` characters. */
export function chunkForSpeech(text: string, max = 200): string[] {
  const sentences = cleanForSpeech(text).match(/[^.!?।]+[.!?।]*\s*/gu) || [];
  const out: string[] = [];
  let cur = '';
  const flush = () => {
    if (cur.trim()) out.push(cur.trim());
    cur = '';
  };
  for (const raw of sentences) {
    let s = raw;
    while (s.length > max) {
      // very long sentence: cut at the last space before the limit
      const cut = s.lastIndexOf(' ', max);
      const at = cut > 40 ? cut : max;
      if (cur) flush();
      out.push(s.slice(0, at).trim());
      s = s.slice(at);
    }
    if ((cur + s).length > max) flush();
    cur += s;
  }
  flush();
  return out.filter(Boolean);
}

function waitForVoices(timeoutMs = 1500): Promise<void> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (synth.getVoices().length > 0) return resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener?.('voiceschanged', finish);
      resolve();
    };
    synth.addEventListener?.('voiceschanged', finish);
    setTimeout(finish, timeoutMs);
  });
}

export type SpeakStart = { ok: true } | { ok: false; reason: 'unsupported' | 'no_voice' | 'empty' };

let session = 0;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function stopSpeaking(): void {
  session++;
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

/**
 * Reads `text` aloud in `lang`. Call ONLY from a user click. `onEnd` fires when playback finishes or is stopped.
 */
export async function speakAnswer(
  text: string,
  lang: LanguageCode,
  handlers: { onStart?: () => void; onEnd?: () => void } = {}
): Promise<SpeakStart> {
  if (!isSpeechSupported()) return { ok: false, reason: 'unsupported' };
  const chunks = chunkForSpeech(text);
  if (chunks.length === 0) return { ok: false, reason: 'empty' };

  stopSpeaking();
  const mine = session;
  await waitForVoices();
  if (mine !== session) return { ok: true }; // stopped while waiting

  const info = getBestVoiceForLanguage(lang);
  if (!info.isNativeAvailable && lang !== 'en') return { ok: false, reason: 'no_voice' };

  let i = 0;
  const next = () => {
    if (mine !== session) return; // stopped or replaced
    if (i >= chunks.length) {
      handlers.onEnd?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[i++]);
    u.lang = info.langLocale;
    if (info.voice) u.voice = info.voice;
    u.rate = 0.95;
    if (i === 1) u.onstart = () => mine === session && handlers.onStart?.();
    u.onend = next;
    u.onerror = (e: SpeechSynthesisErrorEvent) => {
      // "canceled"/"interrupted" happen when we call stop(); anything else ends playback too.
      if (mine === session) {
        session++;
        handlers.onEnd?.();
      }
      void e;
    };
    window.speechSynthesis.speak(u);
  };
  next();
  return { ok: true };
}
