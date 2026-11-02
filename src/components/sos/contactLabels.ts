import { EmergencyContact } from '../../types';
import { SosStrings, getSosStrings, relationLabel } from '../../i18n/sosStrings';

/**
 * Built-in default contacts (ids 1-4) are stored in English and shown in the selected language unless
 * the user renamed them. User-created contacts are always shown exactly as typed.
 * (Moved unchanged from the old SosView so every SOS card labels contacts the same way.)
 */
export function contactName(c: EmergencyContact, ss: SosStrings): string {
  const d = ss.defaultContacts[c.id];
  const en = getSosStrings('en').defaultContacts[c.id];
  return d && en && c.name === en.name ? d.name : c.name;
}

export function contactRelation(c: EmergencyContact, ss: SosStrings): string {
  const d = ss.defaultContacts[c.id];
  const en = getSosStrings('en').defaultContacts[c.id];
  if (
    d &&
    en &&
    (c.relationship === en.relationship ||
      c.relationship.startsWith('Toll-free') ||
      c.relationship === 'Financial Fraud Reporting' ||
      c.relationship === 'Official Emergency Center')
  ) {
    return d.relationship;
  }
  return relationLabel(c.relationship, ss);
}
