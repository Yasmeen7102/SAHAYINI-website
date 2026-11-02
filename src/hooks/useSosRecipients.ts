import { useCallback, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyContact } from '../types';
import { resolveRecipients } from '../utils/sosLogic';

const KEY = 'sahayini_sos_recipients';

const read = (): string[] | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : null;
  } catch {
    return null;
  }
};

/**
 * Which trusted contacts receive SOS messages (live location, voice-monitor alert).
 * Uses the existing contacts list from AppContext; official helplines (isPrimary) are never recipients.
 * Call once in SosView and pass the result down so every card shows the same selection.
 */
export function useSosRecipients() {
  const { contacts } = useApp();
  const [stored, setStored] = useState<string[] | null>(read);

  const trusted = useMemo(() => contacts.filter((c) => !c.isPrimary && Boolean(c.phone)), [contacts]);
  const selected = useMemo(() => resolveRecipients(trusted, stored), [trusted, stored]);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(selected.map((c) => c.id));
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const list = [...next];
      setStored(list);
      try {
        localStorage.setItem(KEY, JSON.stringify(list));
      } catch {
        /* storage unavailable: selection still works for this session */
      }
    },
    [selected]
  );

  return { trusted, selected, toggle, isSelected: (id: string) => selected.some((c) => c.id === id) };
}

export type SosRecipients = ReturnType<typeof useSosRecipients> & { trusted: EmergencyContact[] };
