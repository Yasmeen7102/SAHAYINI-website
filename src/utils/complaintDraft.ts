/**
 * Complaint draft builder for Complaint & FIR Support.
 * A draft is only text prepared on the user's device. It is ALWAYS labelled "NOT YET SUBMITTED"
 * and never states that a complaint was filed or an FIR registered.
 */

export type ComplaintGroup = 'women' | 'cyber' | 'other';

export interface ComplaintTypeDef {
  key: string;
  group: ComplaintGroup;
  /** English label used inside the (English) draft text */
  label: string;
}

export const COMPLAINT_TYPES: ComplaintTypeDef[] = [
  { key: 'harassment', group: 'women', label: 'Harassment' },
  { key: 'stalking', group: 'women', label: 'Stalking' },
  { key: 'domestic_violence', group: 'women', label: 'Domestic violence' },
  { key: 'sexual_assault', group: 'women', label: 'Sexual assault' },
  { key: 'threats', group: 'women', label: 'Threats' },
  { key: 'dowry', group: 'women', label: 'Dowry-related harassment' },
  { key: 'upi_fraud', group: 'cyber', label: 'UPI fraud' },
  { key: 'bank_fraud', group: 'cyber', label: 'Bank fraud' },
  { key: 'shopping_scam', group: 'cyber', label: 'Online shopping scam' },
  { key: 'phishing', group: 'cyber', label: 'Phishing' },
  { key: 'fake_account', group: 'cyber', label: 'Fake account' },
  { key: 'cyberstalking', group: 'cyber', label: 'Cyberstalking' },
  { key: 'blackmail', group: 'cyber', label: 'Online blackmail' },
  { key: 'missing_person', group: 'other', label: 'Missing person' },
  { key: 'theft', group: 'other', label: 'Theft' },
  { key: 'physical_assault', group: 'other', label: 'Physical assault' },
  { key: 'property_damage', group: 'other', label: 'Property damage' },
  { key: 'other', group: 'other', label: 'Other incident' },
];

export interface ComplaintForm {
  typeKey: string;
  date: string; // yyyy-mm-dd
  time?: string;
  location: string;
  description: string;
  name?: string;
  phone?: string;
  address?: string;
  suspect?: string;
  witnesses?: string;
  evidence?: string;
  amountLost?: string;
  transactionRef?: string;
}

export const NOT_SUBMITTED_LABEL = 'NOT YET SUBMITTED';

export function typeLabel(key: string): string {
  return COMPLAINT_TYPES.find((t) => t.key === key)?.label ?? 'Incident';
}

export function typeGroup(key: string): ComplaintGroup | undefined {
  return COMPLAINT_TYPES.find((t) => t.key === key)?.group;
}

/** True when the mandatory fields are filled in. */
export function isComplaintFormComplete(f: ComplaintForm): boolean {
  return !!(f.typeKey && f.date && f.location.trim() && f.description.trim());
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

const line = (label: string, value?: string) => (value && value.trim() ? `${label}: ${value.trim()}\n` : '');

export function buildComplaintDraft(f: ComplaintForm): string {
  const group = typeGroup(f.typeKey);
  const label = typeLabel(f.typeKey);
  const isCyber = group === 'cyber';
  const when = `${formatDate(f.date)}${f.time && f.time.trim() ? `, approximately ${f.time.trim()}` : ''}`;

  let out = '';
  out += `*** ${NOT_SUBMITTED_LABEL} ***\n`;
  out += 'DRAFT prepared with SAHAYINI. This has NOT been sent to the police or to any portal.\n';
  out += 'No complaint number or FIR number exists for this draft.\n';
  out += '------------------------------------------------------------\n\n';
  out += 'To,\nThe Station House Officer,\nPolice Station: ____________________ (fill in the station that has jurisdiction)\n\n';
  out += `Date: ____ / ____ / ________\n\n`;
  out += `Subject: Complaint regarding ${label.toLowerCase()}\n\n`;
  out += 'Respected Sir / Madam,\n\n';
  out += `I, ${f.name?.trim() || '____________________'}, wish to report the following incident (${label}) and request that appropriate legal action be taken.\n\n`;
  out += 'Complainant details\n';
  out += `Name: ${f.name?.trim() || '____________________'}\n`;
  out += `Phone: ${f.phone?.trim() || '____________________'}\n`;
  out += `Address: ${f.address?.trim() || '____________________'}\n\n`;
  out += 'Incident details\n';
  out += `Type of incident: ${label}\n`;
  out += `Date and time: ${when}\n`;
  out += `Place / platform: ${f.location.trim()}\n\n`;
  out += 'Description of the incident\n';
  out += `${f.description.trim()}\n\n`;

  const optional =
    line('Person(s) involved (if known)', f.suspect) +
    line('Witnesses', f.witnesses) +
    line('Evidence available', f.evidence) +
    (isCyber ? line('Amount lost (INR)', f.amountLost) + line('Transaction / reference number(s)', f.transactionRef) : '');
  if (optional) {
    out += 'Additional details\n' + optional + '\n';
  }

  if (isCyber) {
    out += 'Note: I will keep screenshots, messages, URLs, account/UPI details and receipts safe and can share them on request.\n\n';
  }
  out += 'I request you to kindly register my complaint, take the necessary action, and provide me an acknowledgement / copy of the record.\n\n';
  out += 'Yours faithfully,\n\n';
  out += `${f.name?.trim() || '____________________'}\n`;
  out += 'Signature: ____________________\n\n';
  out += '------------------------------------------------------------\n';
  out += `${NOT_SUBMITTED_LABEL}: Review and correct this draft before use. A complaint counts as submitted, and an FIR as registered, only when the police or an official portal confirms it to you.\n`;
  return out;
}

/** Makes sure text is still clearly labelled even if the user deleted the label while editing. */
export function ensureNotSubmittedLabel(text: string): string {
  return text.includes(NOT_SUBMITTED_LABEL) ? text : `*** ${NOT_SUBMITTED_LABEL} ***\n\n${text}`;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Standalone HTML used for the print window. All user text is escaped. */
export function buildPrintHtml(text: string): string {
  const body = escapeHtml(ensureNotSubmittedLabel(text));
  return `<!doctype html><html><head><meta charset="utf-8"><title>Complaint draft - NOT YET SUBMITTED</title>
<style>body{font-family:Arial,Helvetica,sans-serif;margin:24px;color:#111}
.badge{display:inline-block;border:2px solid #b45309;color:#b45309;font-weight:bold;padding:4px 10px;border-radius:6px;margin-bottom:12px}
pre{white-space:pre-wrap;word-wrap:break-word;font-family:inherit;font-size:14px;line-height:1.5}</style></head>
<body><div class="badge">${NOT_SUBMITTED_LABEL}</div><pre>${body}</pre></body></html>`;
}

export function mapsPoliceSearchUrl(place: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`police station near ${place.trim()}`)}`;
}

export const OFFICIAL_LINKS = {
  cybercrimePortal: 'https://cybercrime.gov.in/',
  financialFraudHelpline: '1930',
  emergency: '112',
} as const;
