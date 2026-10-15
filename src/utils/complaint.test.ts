/**
 * Tests for Complaint & FIR Support. Run with: npm test
 */
import {
  COMPLAINT_TYPES,
  NOT_SUBMITTED_LABEL,
  buildComplaintDraft,
  buildPrintHtml,
  ensureNotSubmittedLabel,
  isComplaintFormComplete,
  mapsPoliceSearchUrl,
  OFFICIAL_LINKS,
  ComplaintForm,
} from './complaintDraft';
import { getComplaintStrings } from '../i18n/complaintStrings';
import { LANGUAGES } from '../i18n/translations';

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) console.log(`✓ ${name}`);
  else {
    failures++;
    console.error(`✗ ${name}`);
  }
}

console.log('--- Running Complaint & FIR Support tests ---');

const base: ComplaintForm = {
  typeKey: 'upi_fraud',
  date: '2026-10-10',
  time: '14:30',
  location: 'Tiruppur, via a UPI app',
  description: 'I was asked to scan a QR code and Rs 5000 was debited.',
  name: 'Test User',
  amountLost: '5000',
  transactionRef: 'TXN123',
};

// Categories required by the brief
const keys = COMPLAINT_TYPES.map((t) => t.key);
check('categories: women group has 6 required types',
  ['harassment', 'stalking', 'domestic_violence', 'sexual_assault', 'threats', 'dowry'].every((k) => COMPLAINT_TYPES.find((t) => t.key === k)?.group === 'women'));
check('categories: cyber group has 7 required types',
  ['upi_fraud', 'bank_fraud', 'shopping_scam', 'phishing', 'fake_account', 'cyberstalking', 'blackmail'].every((k) => COMPLAINT_TYPES.find((t) => t.key === k)?.group === 'cyber'));
check('categories: other group has 5 required types',
  ['missing_person', 'theft', 'physical_assault', 'property_damage', 'other'].every((k) => COMPLAINT_TYPES.find((t) => t.key === k)?.group === 'other'));
check('categories: keys are unique', new Set(keys).size === keys.length);

// Validation
check('form: complete form is valid', isComplaintFormComplete(base));
check('form: missing description is invalid', !isComplaintFormComplete({ ...base, description: '   ' }));
check('form: missing type is invalid', !isComplaintFormComplete({ ...base, typeKey: '' }));
check('form: missing date is invalid', !isComplaintFormComplete({ ...base, date: '' }));
check('form: missing location is invalid', !isComplaintFormComplete({ ...base, location: '' }));

// Draft honesty: every draft is labelled and never claims submission/registration
for (const t of COMPLAINT_TYPES) {
  const d = buildComplaintDraft({ ...base, typeKey: t.key });
  check(`draft[${t.key}]: labelled NOT YET SUBMITTED at top and bottom`,
    d.startsWith(`*** ${NOT_SUBMITTED_LABEL} ***`) && d.trimEnd().includes(`${NOT_SUBMITTED_LABEL}: Review`));
  check(`draft[${t.key}]: no fake complaint/FIR number or "has been registered" claim`,
    !/FIR (No|Number)\s*[:#]\s*\d/i.test(d) && !/has been (submitted|registered|filed)/i.test(d) && !/successfully (submitted|registered|filed)/i.test(d));
}
const d = buildComplaintDraft(base);
check('draft: includes date in dd/mm/yyyy, place and description',
  d.includes('10/10/2026') && d.includes('Tiruppur, via a UPI app') && d.includes('scan a QR code'));
check('draft: cyber drafts include amount and transaction reference', d.includes('5000') && d.includes('TXN123'));
check('draft: non-cyber drafts omit amount/transaction fields',
  !buildComplaintDraft({ ...base, typeKey: 'theft' }).includes('TXN123'));
check('draft: police station is left blank, not invented', d.includes('Police Station: ____________________'));
check('draft: optional fields omitted when empty', !buildComplaintDraft({ ...base, suspect: '', witnesses: '' }).includes('Witnesses'));

// Label is restored if the user deletes it while editing
check('edit: label is restored when removed', ensureNotSubmittedLabel('my edited text').includes(NOT_SUBMITTED_LABEL));
check('edit: existing label is not duplicated', ensureNotSubmittedLabel(d) === d);

// Print HTML escapes user content (no script injection) and keeps the label
const html = buildPrintHtml('<script>alert(1)</script> & "x"');
check('print: user text is HTML-escaped', !html.includes('<script>alert') && html.includes('&lt;script&gt;') && html.includes('&amp;'));
check('print: label present', html.includes(NOT_SUBMITTED_LABEL));

// Official links / maps
check('links: official portal, 1930 and 112',
  OFFICIAL_LINKS.cybercrimePortal === 'https://cybercrime.gov.in/' && OFFICIAL_LINKS.financialFraudHelpline === '1930' && OFFICIAL_LINKS.emergency === '112');
const mu = mapsPoliceSearchUrl('Avinashi Road, Tiruppur');
check('maps: manual location opens Google Maps search', mu.startsWith('https://www.google.com/maps/search/?api=1&query=') && mu.includes(encodeURIComponent('police station near Avinashi Road, Tiruppur')));

// Translations: all 8 languages, exact English wording for the card
const en = getComplaintStrings('en');
check('i18n: English card text matches the brief',
  en.cardTitle === 'Complaint & FIR Support' &&
  en.cardDesc === 'Prepare a complaint, find nearby police stations, and access official reporting services.' &&
  en.cardButton === 'Open Complaint Support →');
check('i18n: 8 languages supported', LANGUAGES.length === 8);
for (const l of LANGUAGES) {
  const s = getComplaintStrings(l.code);
  check(`i18n[${l.code}]: sidebar/card/label present and all ${COMPLAINT_TYPES.length} type labels resolve`,
    !!s.sidebarLabel && !!s.cardTitle && !!s.notYetSubmitted && COMPLAINT_TYPES.every((t) => !!s.types[t.key]));
  if (l.code !== 'en') check(`i18n[${l.code}]: translated (differs from English)`, s.cardTitle !== en.cardTitle && s.notYetSubmitted !== en.notYetSubmitted);
}

if (failures > 0) {
  console.error(`\n${failures} test(s) FAILED`);
  process.exit(1);
}
console.log('🎉 ALL COMPLAINT TESTS PASSED!');
