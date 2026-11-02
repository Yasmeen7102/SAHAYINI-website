import type { ExamText } from '../../i18n/examStrings';

// Props shared by all Government Exams panels.
export interface ExamUiProps {
  t: ExamText;                       // new interface strings (8 languages)
  legacy: Record<string, string>;    // existing strings from examCopy
  language: string;
  dark: boolean;
  card: string;                      // existing card classes (light/dark)
}

export const btnPrimary = 'rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';
export const btnNavy = 'rounded-xl bg-[#0A2E65] hover:bg-[#08244f] text-white px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2';
export const btnGhost = 'rounded-xl border px-4 py-2 font-semibold hover:bg-slate-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
export const linkBack = 'inline-flex items-center gap-1 text-sm underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded';
