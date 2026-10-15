import { LanguageCode } from '../types';
import { getExtraStrings } from '../i18n/extraStrings';
import {
  analyzeScamLocally,
  localExplanation,
  SCAM_SAFETY_STEPS,
  ScamRisk,
} from '../utils/scamHeuristics';

export interface ScamAnalysisResult {
  riskScore: ScamRisk;
  flags: string[];
  explanation: string;
  safetySteps: string[];
  /** 'ai' = AI-assisted online analysis, 'local' = on-device / built-in pattern checks only */
  source: 'ai' | 'local';
}

export type LocalReason = 'offline' | 'unavailable' | null;

// Short, speech-friendly safety steps (no URLs read letter by letter).
const SPOKEN_STEPS = [
  'Do not reply, click links, or download attachments.',
  'Never share your OTP or UPI PIN with anyone.',
  'If you have lost money, call 1930 immediately.',
  'You can report fraud at cybercrime dot gov dot in.',
];

function localResult(content: string): ScamAnalysisResult {
  const local = analyzeScamLocally(content);
  return {
    riskScore: local.riskScore,
    flags: local.flags,
    explanation: localExplanation(local.riskScore),
    safetySteps: SCAM_SAFETY_STEPS,
    source: 'local',
  };
}

/**
 * Analyses a suspicious message with the existing /api/analyze-scam service.
 * Offline, or when that service fails, it falls back to on-device pattern checks and says so.
 */
export async function analyzeScamMessage(
  content: string,
  language: LanguageCode
): Promise<{ result: ScamAnalysisResult; localReason: LocalReason }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { result: localResult(content), localReason: 'offline' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);
  try {
    const res = await fetch('/api/analyze-scam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        type: content.includes('http') ? 'url' : 'message',
        language,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Analysis service responded with HTTP ${res.status}`);
    const data = await res.json();
    if (!data || !data.riskScore || typeof data.explanation !== 'string') {
      throw new Error('Analysis service returned an unexpected response');
    }
    const result: ScamAnalysisResult = {
      riskScore: data.riskScore,
      flags: Array.isArray(data.flags) ? data.flags : [],
      explanation: data.explanation,
      safetySteps:
        Array.isArray(data.safetySteps) && data.safetySteps.length ? data.safetySteps : SCAM_SAFETY_STEPS,
      source: data.source === 'ai' ? 'ai' : 'local',
    };
    return { result, localReason: result.source === 'local' ? 'unavailable' : null };
  } catch (err) {
    console.warn('Online scam analysis unavailable, using on-device checks:', err);
    const offlineNow = typeof navigator !== 'undefined' && !navigator.onLine;
    return { result: localResult(content), localReason: offlineNow ? 'offline' : 'unavailable' };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Text to read aloud. AI explanations come back in the user's language and are spoken in that
 * language; built-in checks are English and are spoken with an English voice.
 */
export function buildScamSpeech(
  r: ScamAnalysisResult,
  language: LanguageCode
): { text: string; lang: LanguageCode } {
  const extra = getExtraStrings(language);
  if (r.source === 'ai') {
    return {
      lang: language,
      text: `${extra.scamAudioIntro} ${extra.scamRiskWord[r.riskScore]}. ${r.explanation} ${extra.scamUncertainty}`,
    };
  }
  const en = getExtraStrings('en');
  const signs = r.flags.length
    ? `Suspicious signs: ${r.flags.map((f) => f.split(':')[0]).join('. ')}.`
    : en.scamNoSigns;
  return {
    lang: 'en',
    text: `${en.scamAudioIntro} Risk level: ${en.scamRiskWord[r.riskScore]}. ${r.explanation} ${signs} What you should do: ${SPOKEN_STEPS.join(' ')} ${en.scamUncertainty}`,
  };
}

/** Readable chat-message version of the analysis. */
export function formatScamChatReply(r: ScamAnalysisResult, language: LanguageCode, localReason: LocalReason): string {
  const extra = getExtraStrings(language);
  const word = extra.scamRiskWord[r.riskScore].toUpperCase();
  const parts: string[] = [`🛡️ ${extra.scamAudioIntro} ${word}`, '', r.explanation];
  parts.push('', `${extra.scamSigns}:`);
  if (r.flags.length) r.flags.forEach((f) => parts.push(`• ${f}`));
  else parts.push(extra.scamNoSigns);
  parts.push('', `${extra.scamActions}:`);
  r.safetySteps.forEach((s) => parts.push(`• ${s}`));
  if (r.source === 'local' && localReason) parts.push('', extra.scamLocalNote);
  parts.push('', extra.scamUncertainty);
  return parts.join('\n');
}

/** True when a chat message looks like a pasted suspicious message rather than a question. */
export function looksLikeSuspiciousMessage(text: string): boolean {
  const t = text.trim();
  if (t.length < 40) return false;
  if (analyzeScamLocally(t).flags.length > 0) return true;
  return /\b(scam|fraud|phishing|fake (?:call|sms|message|link)|suspicious)\b/i.test(t) && t.length >= 60;
}
