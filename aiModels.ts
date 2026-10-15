// Gemini model chain used by Ask SAHAYINI (server-side only).
//
// VERIFIED against Google's official docs (ai.google.dev/gemini-api/docs/models and /deprecations,
// checked 14 Oct 2026). All three are STABLE Flash-family model codes with no shutdown announced
// before 2027:
//   gemini-3.8-flash       newest stable Flash (preferred)
//   gemini-3.6-flash       previous stable Flash
//   gemini-3.5-flash-lite  stable Flash-Lite (separate, lighter capacity pool)
//
// Deliberately NOT listed: gemini-3.7-flash and gemini-3.5-flash. Google documents that these are
// aliases that route to gemini-3.8-flash / gemini-3.6-flash, so they would hit the same overloaded
// capacity and would not be a real fallback. gemini-2.5-* is excluded (new API keys cannot use it).
//
// Run `npm run check:ai` to confirm which of these your own API key can actually use.
export const DEFAULT_MODEL_CHAIN: readonly string[] = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
];

// Optional GEMINI_MODEL (env) is tried first; the verified chain always follows it as fallback.
export function buildModelChain(envModel?: string): string[] {
  const custom = (envModel || '').trim();
  const valid = /^[a-z0-9][a-z0-9.-]{2,60}$/i.test(custom) ? [custom] : [];
  return Array.from(new Set([...valid, ...DEFAULT_MODEL_CHAIN]));
}
