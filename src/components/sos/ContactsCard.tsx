import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { SosCard } from './SosCard';
import { SosRecipients } from '../../hooks/useSosRecipients';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { fill } from '../../i18n/locationStrings';
import { LanguageCode } from '../../types';

/** Summary tile for Emergency Contacts. The manage list lives in ContactsPanel (one place, no duplicate forms). */
export const ContactsCard: React.FC<{ language: LanguageCode; recipients: SosRecipients; open: boolean; onToggle: () => void }> = ({
  language,
  recipients,
  open,
  onToggle,
}) => {
  const D = getSosDashStrings(language);
  return (
    <SosCard id="sos-contacts" title={D.ctTitle} desc={D.ctDesc} tone="green" icon={<Users className="h-7 w-7" />}>
      <p className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-center text-xs font-semibold text-emerald-900">
        {fill(D.ctCount, { n: recipients.trusted.length, m: recipients.selected.length })}
      </p>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="sos-contacts-panel"
        className="mt-auto flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" /> {open ? D.ctHide : D.ctBtn}
      </button>
    </SosCard>
  );
};
