import React, { useMemo, useState } from 'react';
import { GraduationCap, Search, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exams, getExamName, resolveExamStatus } from '../../data/examData';
import type { Exam } from '../../data/examData';
import type { TopicId } from '../../data/examLessons';
import { examCopy } from '../../i18n/examCopy';
import { examText } from '../../i18n/examStrings';
import { useExamProgress } from '../../hooks/useExamProgress';
import { StatusBadge } from '../exams/StatusBadge';
import { ExamDetail } from '../exams/ExamDetail';
import { EligibilityChecker } from '../exams/EligibilityChecker';
import { LessonsPanel } from '../exams/LessonsPanel';
import { PracticeTest } from '../exams/PracticeTest';
import type { TestTarget } from '../exams/PracticeTest';
import { ProgressPanel } from '../exams/ProgressPanel';
import type { ExamUiProps } from '../exams/examUi';

type Panel = 'elig' | 'lessons' | 'tests' | 'progress' | null;

export const GovernmentExamsView: React.FC = () => {
  const { language, theme } = useApp();
  const legacy: Record<string, string> = { ...examCopy.en, ...(examCopy[language] || {}) };
  const t = examText(language);
  const dark = theme === 'dark';
  const text = dark ? 'text-slate-100' : 'text-slate-800';
  const card = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const ui: ExamUiProps = { t, legacy, language, dark, card };

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Exam | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [testTarget, setTestTarget] = useState<TestTarget | null>(null);
  const { progress, stats, setLesson, recordAttempt, saveFailed } = useExamProgress();

  const filtered = useMemo(
    () => exams.filter((e) => (category === 'All' || e.category === category) && (e.name + ' ' + e.authority + ' ' + e.state).toLowerCase().includes(query.toLowerCase())),
    [query, category],
  );

  const go = (next: Panel) => { setTestTarget(null); setPanel(next); };
  const practiceTopic = (topic: TopicId) => { setTestTarget({ kind: 'topic', topic }); setPanel('tests'); };

  const navBtn = (active: boolean) =>
    `px-4 py-2 rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${active ? 'bg-emerald-700 text-white border-emerald-700' : ''}`;

  return (
    <div className={`max-w-6xl mx-auto px-4 py-6 space-y-5 ${text}`}>
      <header className="rounded-3xl p-6 text-white bg-gradient-to-r from-[#0A2E65] to-emerald-700">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-10 h-10" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-extrabold">{legacy.title}</h1>
            <p className="text-sm text-white/90">{legacy.sub}</p>
          </div>
        </div>
      </header>

      <nav aria-label={legacy.title} className="flex flex-wrap gap-2">
        <button onClick={() => { setSelected(null); go(null); }} aria-current={!panel ? 'page' : undefined} className={navBtn(!panel)}>{legacy.button}</button>
        <button onClick={() => go('lessons')} aria-current={panel === 'lessons' ? 'page' : undefined} className={navBtn(panel === 'lessons')}>{legacy.lessons}</button>
        <button onClick={() => go('tests')} aria-current={panel === 'tests' ? 'page' : undefined} className={navBtn(panel === 'tests')}>{legacy.tests}</button>
        <button onClick={() => go('progress')} aria-current={panel === 'progress' ? 'page' : undefined} className={navBtn(panel === 'progress')}>{legacy.progress}</button>
      </nav>

      {!selected && !panel && (
        <>
          <div className="grid sm:grid-cols-[1fr_220px] gap-3">
            <label className={`flex items-center gap-2 rounded-xl border px-3 ${card}`}>
              <Search className="w-4 h-4" aria-hidden="true" />
              <input className="bg-transparent outline-none py-3 w-full" aria-label={legacy.search} placeholder={legacy.search} value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
            </label>
            <select aria-label={legacy.category} className={`rounded-xl border px-3 py-2 ${card}`} value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}>
              <option value="All">{legacy.all}</option>
              {[...new Set(exams.map((e) => e.category))].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <p className="text-sm opacity-80">{legacy.verified}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((e) => (
              <article key={e.id} className={`rounded-2xl border p-5 shadow-sm flex flex-col ${card}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-lg">{getExamName(e, language)}</h2>
                    <p className="text-sm opacity-75">{e.authority} · {e.state}</p>
                  </div>
                  <GraduationCap className="text-emerald-600 shrink-0" aria-hidden="true" />
                </div>
                <div className="mt-3"><StatusBadge status={resolveExamStatus(e.id).status} t={t} /></div>
                <p className="mt-3 text-sm"><b>{legacy.qual}:</b> {e.education}</p>
                <p className="mt-2 text-sm"><b>{legacy.age}:</b> {e.age}</p>
                <p className="mt-2 text-sm"><b>{legacy.pattern}:</b> {e.pattern}</p>
                <div className="mt-auto pt-4">
                  <button onClick={() => { setSelected(e); setPanel(null); }} className="inline-flex items-center gap-1 rounded-xl bg-[#0A2E65] text-white px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                    {legacy.button}<ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {selected && !panel && (
        <ExamDetail {...ui} exam={selected} onBack={() => setSelected(null)} onEligibility={() => go('elig')} onLessons={() => go('lessons')} onTests={() => go('tests')} />
      )}
      {panel === 'elig' && <EligibilityChecker {...ui} exam={selected} />}
      {panel === 'lessons' && (
        <LessonsPanel {...ui} exam={selected} completedLessons={progress.completedLessons} onSetCompleted={setLesson} onPractice={practiceTopic} />
      )}
      {panel === 'tests' && <PracticeTest {...ui} exam={selected} initialTarget={testTarget} onRecord={recordAttempt} />}
      {panel === 'progress' && <ProgressPanel {...ui} progress={progress} stats={stats} saveFailed={saveFailed} onRetryTopic={practiceTopic} />}
    </div>
  );
};
