import React from 'react';
import { SosRecipients } from '../../hooks/useSosRecipients';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { getSosStrings } from '../../i18n/sosStrings';
import { contactName, contactRelation } from './contactLabels';
import { LanguageCode } from '../../types';

/** Checkbox list of trusted contacts. Selection is shared by the live-location and voice-monitor alerts. */
export const RecipientPicker: React.FC<{ recipients: SosRecipients; language: LanguageCode; idPrefix: string }> = ({
  recipients,
  language,
  idPrefix,
}) => {
  const D = getSosDashStrings(language);
  const ss = getSosStrings(language);
  if (recipients.trusted.length === 0) {
    return <p className="text-xs text-slate-600">{D.noTrusted}</p>;
  }
  return (
    <ul className="space-y-1.5">
      {recipients.trusted.map((c) => {
        const inputId = `${idPrefix}-${c.id}`;
        return (
          <li key={c.id}>
            <label
              htmlFor={inputId}
              className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={recipients.isSelected(c.id)}
                onChange={() => recipients.toggle(c.id)}
                className="h-4 w-4 accent-[#0A2E65]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-slate-900">{contactName(c, ss)}</span>
                <span className="block truncate text-[11px] text-slate-600">
                  {contactRelation(c, ss)} · <span className="font-mono">{c.phone}</span>
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};
