import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { getExamName } from '../../data/examData';
import type { Exam } from '../../data/examData';
import { btnPrimary } from './examUi';
import type { ExamUiProps } from './examUi';

const EDU_VALUES = ['Below 10th', '10th pass', '12th pass', 'Diploma', 'Graduate', 'Postgraduate'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];
type Level = 'ok' | 'maybe' | 'more';

// Same screening rules as before (age 17 to 60, qualification completed,
// education above "Below 10th"), now with a readable explanation.
export function screen(ageText: string, education: string, completed: string): Level {
  const a = Number(ageText);
  if (!ageText || !education) return 'more';
  if (completed === 'no' || education === 'Below 10th') return 'maybe';
  if (a < 17 || a > 60) return 'maybe';
  return 'ok';
}

export const EligibilityChecker: React.FC<ExamUiProps & { exam: Exam | null }> = ({ t, legacy, language, card, exam }) => {
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [completed, setCompleted] = useState('yes');
  const [category, setCategory] = useState('General');
  const [level, setLevel] = useState<Level | null>(null);

  const field = 'block w-full rounded-lg border bg-transparent p-2 mt-1';
  const eduLabel = education ? t.eduOptions[EDU_VALUES.indexOf(education)] || education : '—';
  const headline = level === 'ok' ? legacy.eligible : level === 'maybe' ? legacy.maybe : legacy.more;
  const tone = level === 'ok' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : level === 'maybe' ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-sky-50 text-sky-900 border-sky-300';
  const Icon = level === 'ok' ? CheckCircle2 : level === 'maybe' ? AlertTriangle : Info;

  return (
    <section className={`rounded-2xl border p-5 space-y-4 ${card}`}>
      <h2 className="text-xl font-bold">{legacy.eligTitle} — {exam ? getExamName(exam, language) : legacy.title}</h2>
      <p className="text-sm opacity-80">{legacy.result}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label>{legacy.dob}
          <input type="number" inputMode="numeric" min="0" max="100" value={age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)} className={field} />
        </label>
        <label>{legacy.edu}
          <select value={education} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEducation(e.target.value)} className={field}>
            <option value="">—</option>
            {EDU_VALUES.map((v, i) => <option key={v} value={v}>{t.eduOptions[i] || v}</option>)}
          </select>
        </label>
        <label>{legacy.completed}
          <select value={completed} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCompleted(e.target.value)} className={field}>
            <option value="yes">{t.yes}</option>
            <option value="no">{t.no}</option>
          </select>
        </label>
        <label>{legacy.category}
          <select value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} className={field}>
            {CATEGORIES.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
      </div>
      <button onClick={() => setLevel(screen(age, education, completed))} className={btnPrimary}>{legacy.check}</button>

      {level && (
        <div role="status" className={`rounded-xl border p-4 space-y-3 ${tone}`}>
          <p className="font-bold flex items-center gap-2"><Icon className="w-5 h-5 shrink-0" aria-hidden="true" />{headline}</p>
          <div className="text-sm grid sm:grid-cols-2 gap-3">
            <div>
              <p className="font-semibold">{t.eligYour}</p>
              <ul className="list-disc pl-5">
                <li>{legacy.dob}: {age || '—'}</li>
                <li>{legacy.edu}: {eduLabel}</li>
                <li>{legacy.completed}: {completed === 'yes' ? t.yes : t.no}</li>
                <li>{legacy.category}: {category}</li>
              </ul>
            </div>
            {exam && (
              <div>
                <p className="font-semibold">{t.eligListed}</p>
                <ul className="list-disc pl-5">
                  <li>{legacy.qual}: {exam.education}</li>
                  <li>{legacy.age}: {exam.age}</li>
                </ul>
              </div>
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold">{t.eligNext}</p>
            <ul className="list-disc pl-5">
              <li>{t.eligNext1}</li>
              <li>{t.eligNext2}</li>
            </ul>
          </div>
          <p className="text-xs">{t.eligBroad}</p>
          <p className="text-sm font-semibold">{t.eligFinal}</p>
        </div>
      )}
    </section>
  );
};
