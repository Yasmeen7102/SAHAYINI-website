import React, { useState } from 'react';
import { PhoneCall, Trash2, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SosRecipients } from '../../hooks/useSosRecipients';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { getSosStrings } from '../../i18n/sosStrings';
import { contactName, contactRelation } from './contactLabels';

/**
 * The single place on the SOS page to manage trusted contacts (add, delete, call, choose who receives
 * alerts). It uses the existing AppContext contacts model (addContact / deleteContact) unchanged.
 */
export const ContactsPanel: React.FC<{ recipients: SosRecipients }> = ({ recipients }) => {
  const { contacts, addContact, deleteContact, t, language } = useApp();
  const D = getSosDashStrings(language);
  const ss = getSosStrings(language);

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Parent / Family');

  const official = contacts.filter((c) => c.isPrimary);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addContact({ name: name.trim(), phone: phone.trim(), relationship: relation });
    setName('');
    setPhone('');
    setShowAdd(false);
  };

  return (
    <section
      id="sos-contacts-panel"
      aria-label={D.ctTitle}
      className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-xs sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t.sos.trustedContactsTitle}</h2>
          <p className="text-xs text-slate-600">{D.ctUseForAlerts}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" /> {t.sos.addContact}
        </button>
      </div>

      <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-600">{D.ctTrusted}</h3>
      {recipients.trusted.length === 0 ? (
        <p className="mt-2 text-xs text-slate-600">{D.noTrusted}</p>
      ) : (
        <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {recipients.trusted.map((c) => {
            const cid = `use-${c.id}`;
            return (
              <li key={c.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{contactName(c, ss)}</p>
                    <p className="text-[11px] text-slate-600">{contactRelation(c, ss)}</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-slate-700">{c.phone}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <a
                      href={`tel:${c.phone}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700"
                      aria-label={ss.callName.replace('{name}', contactName(c, ss))}
                    >
                      <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => deleteContact(c.id)}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`${ss.deleteContact}: ${contactName(c, ss)}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <label htmlFor={cid} className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold text-slate-800">
                  <input
                    id={cid}
                    type="checkbox"
                    checked={recipients.isSelected(c.id)}
                    onChange={() => recipients.toggle(c.id)}
                    className="h-4 w-4 accent-[#0A2E65]"
                  />
                  {D.ctUseForAlerts}
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {official.length > 0 && (
        <>
          <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-600">{D.ctOfficial}</h3>
          <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {official.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{contactName(c, ss)}</p>
                  <p className="text-[11px] text-slate-600">{contactRelation(c, ss)}</p>
                  <p className="mt-0.5 font-mono text-xs font-semibold text-slate-700">{c.phone}</p>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700"
                  aria-label={ss.callName.replace('{name}', contactName(c, ss))}
                >
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="add-contact-title" className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 id="add-contact-title" className="mb-3 text-base font-bold text-slate-900">
              {t.sos.addContactModalTitle}
            </h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label htmlFor="ac-name" className="mb-1 block text-xs font-bold text-slate-700">{t.sos.contactName}</label>
                <input
                  id="ac-name"
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={ss.namePlaceholder}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                />
              </div>
              <div>
                <label htmlFor="ac-phone" className="mb-1 block text-xs font-bold text-slate-700">{t.sos.contactPhone}</label>
                <input
                  id="ac-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={ss.phonePlaceholder}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                />
              </div>
              <div>
                <label htmlFor="ac-rel" className="mb-1 block text-xs font-bold text-slate-700">{t.sos.relationshipLabel}</label>
                <select
                  id="ac-rel"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs"
                >
                  <option value="Parent / Family">{ss.relations.family}</option>
                  <option value="Sibling">{ss.relations.sibling}</option>
                  <option value="Close Friend">{ss.relations.friend}</option>
                  <option value="Neighbor / Local Contact">{ss.relations.neighbor}</option>
                  <option value="Colleague / Mentor">{ss.relations.colleague}</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="min-h-11 flex-1 cursor-pointer rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                  {t.sos.cancelBtn}
                </button>
                <button type="submit" className="min-h-11 flex-1 cursor-pointer rounded-xl bg-[#0A2E65] py-2 text-xs font-bold text-white hover:bg-[#072344]">
                  {t.sos.saveContactBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
