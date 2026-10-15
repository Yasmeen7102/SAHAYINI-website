/**
 * Rule-based scam signal checks. These are the SAME patterns the server's
 * /api/analyze-scam endpoint has always used; they now live in one shared place
 * so the browser can run them on-device when the server / internet is not available.
 *
 * IMPORTANT: this is a simple pattern check, not proof. "No flags" never means "safe".
 */
export type ScamRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocalScamResult {
  riskScore: ScamRisk;
  flags: string[];
}

export const SCAM_SAFETY_STEPS: string[] = [
  'Do not reply, click unverified links, or download attachments.',
  'Never enter your UPI PIN or share OTP with anyone.',
  'If financial fraud occurred, immediately call 1930 to freeze transactions.',
  'Report online fraud at official portal: https://cybercrime.gov.in or Chakshu portal: https://sancharsaathi.gov.in',
];

export function analyzeScamLocally(content: string): LocalScamResult {
  const flags: string[] = [];

  if (/immediately|within 24 hours|tonight at|urgent|block your|suspend|deactivate|last warning/i.test(content)) {
    flags.push('High Urgency & Fear Tactics: Creating false panic to prevent calm thinking.');
  }
  if (/lottery|won|cashback|prize|crore|lakh|free gift|lucky winner|kbc/i.test(content)) {
    flags.push('Unsolicited Prize/Lottery: Classic advance-fee scam lure.');
  }
  if (/otp|pin|password|cvv|aadhaar number|pan card update|kyc expired|link aadhaar/i.test(content)) {
    flags.push('Credential / KYC Solicitation: Legitimate banks never ask for PIN or OTP over text.');
  }
  if (/electricity|power supply|bill unpaid|disconnection|officer number/i.test(content)) {
    flags.push('Utility Disconnection Fraud: Threatening service cut-off with a private mobile number.');
  }
  if (/police|cbi|customs|narcotics|parcel intercepted|arrest warrant|video call/i.test(content)) {
    flags.push('Digital Arrest / Law Enforcement Impersonation: Fraudsters posing as police or customs officials.');
  }
  if (/bit\.ly|tinyurl|\.apk|ngrok|free-gift|sbi-kyc|reward|claim-now|wp\.me/i.test(content)) {
    flags.push('Suspicious URL / Potential Malicious APK: Hidden destination or fake website clone.');
  }

  const riskScore: ScamRisk =
    flags.length >= 3 ? 'CRITICAL' : flags.length === 2 ? 'HIGH' : flags.length === 1 ? 'MEDIUM' : 'LOW';

  return { riskScore, flags };
}

const ORDER: ScamRisk[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
/** Returns the higher of two risk levels (we never lower a risk reading). */
export function maxRisk(a: ScamRisk, b: ScamRisk): ScamRisk {
  return ORDER.indexOf(a) >= ORDER.indexOf(b) ? a : b;
}

/** Plain-English, uncertainty-aware summary used when no AI explanation is available. */
export function localExplanation(risk: ScamRisk): string {
  if (risk === 'CRITICAL' || risk === 'HIGH') {
    return 'This content contains several patterns that are common in fraud, such as artificial urgency, threats, or requests for confidential information. It is very likely unsafe, but this simple check cannot be certain. Do not click any links, do not share OTPs, and do not send money.';
  }
  if (risk === 'MEDIUM') {
    return 'This content shows at least one caution signal that is common in scams. It may or may not be fraudulent. Verify through official channels before acting or clicking links.';
  }
  return 'No known scam patterns were detected by this simple check. That does not prove the message is safe, because new scams keep changing. Stay careful and never share your banking passwords, PIN or OTP.';
}
