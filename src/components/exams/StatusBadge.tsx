import React from 'react';
import { Bell, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ApplicationStatus } from '../../data/examData';
import type { ExamText } from '../../i18n/examStrings';

const styles: Record<ApplicationStatus, string> = {
  open: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  notified: 'bg-sky-100 text-sky-900 border-sky-300',
  closed: 'bg-slate-200 text-slate-800 border-slate-400',
  unverified: 'bg-amber-50 text-amber-900 border-amber-300',
};

// Status is always shown as an icon plus a text label, never colour alone.
export const StatusBadge: React.FC<{ status: ApplicationStatus; t: ExamText }> = ({ status, t }) => {
  const label = { open: t.stOpen, notified: t.stNotified, closed: t.stClosed, unverified: t.stUnverified }[status];
  const Icon = { open: CheckCircle2, notified: Bell, closed: XCircle, unverified: Info }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </span>
  );
};
