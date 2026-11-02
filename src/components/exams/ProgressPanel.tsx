import React from 'react';
import { ChartNoAxesColumn, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { getExamName, exams } from '../../data/examData';
import { lessonById, lessonTitle } from '../../data/examLessons';
import type { TopicId } from '../../data/examLessons';
import type { ExamProgress, ProgressStats } from '../../utils/examProgress';
import { btnNavy } from './examUi';
import type { ExamUiProps } from './examUi';

interface Props extends ExamUiProps {
  progress: ExamProgress;
  stats: ProgressStats;
  saveFailed: boolean;
  onRetryTopic: (topic: TopicId) => void;
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border p-3">
    <p className="text-xs opacity-75">{label}</p>
    <p className="text-2xl font-extrabold">{value}</p>
  </div>
);

export const ProgressPanel: React.FC<Props> = ({ t, legacy, language, card, progress, stats, saveFailed, onRetryTopic }) => {
  const topicName = (id: TopicId) => { const l = lessonById(id); return l ? lessonTitle(l, language) : id; };
  const attemptLabel = (a: ExamProgress['attempts'][number]) => {
    if (a.scope === 'topic' && a.topic) return topicName(a.topic);
    const ex = exams.find((e) => e.id === a.examId);
    return `${t.mixedLabel}${ex ? ` — ${getExamName(ex, language)}` : ''}`;
  };

  return (
    <section className={`rounded-2xl border p-5 space-y-5 ${card}`}>
      <h2 className="text-xl font-bold"><ChartNoAxesColumn className="inline w-5 h-5 mr-2" aria-hidden="true" />{legacy.progress}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label={t.progLessons} value={`${stats.lessonsCompleted} / ${stats.lessonsTotal}`} />
        <Stat label={t.progTests} value={String(stats.testsCompleted)} />
        <Stat label={t.progAnswered} value={String(stats.answered)} />
        <Stat label={t.progAvg} value={`${stats.averageScore}%`} />
        <Stat label={t.progCorrect} value={String(stats.correct)} />
        <Stat label={t.progIncorrect} value={String(stats.incorrect)} />
        <div className="rounded-xl border p-3 col-span-2">
          <p className="text-xs opacity-75">{t.progOverall}</p>
          <p className="text-2xl font-extrabold">{stats.overallPercent}%</p>
          <div className="h-2 rounded-full bg-slate-500/20 mt-1" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={stats.overallPercent} aria-label={t.progOverall}>
            <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${stats.overallPercent}%` }} />
          </div>
          <p className="text-xs opacity-75 mt-1">{t.progOverallHelp}</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">{t.progTopics}</h3>
        <ul className="space-y-2">
          {stats.topics.map((s) => (
            <li key={s.topic} className="rounded-xl border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{topicName(s.topic)}</span>
                <span className="text-sm">
                  {s.percent === null ? (
                    <span className="inline-flex items-center gap-1 opacity-75"><Info className="w-4 h-4" aria-hidden="true" />{t.progNoData}</span>
                  ) : s.needsPractice ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-800"><AlertTriangle className="w-4 h-4" aria-hidden="true" />{t.progNeeds} · {s.percent}%</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />{t.progOnTrack} · {s.percent}%</span>
                  )}
                </span>
              </div>
              {s.percent !== null && (
                <div className="h-2 rounded-full bg-slate-500/20 mt-2" aria-hidden="true">
                  <div className={`h-2 rounded-full ${s.needsPractice ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${s.percent}%` }} />
                </div>
              )}
              {(s.needsPractice || s.percent === null) && (
                <button onClick={() => onRetryTopic(s.topic)} className={`${btnNavy} mt-2 text-sm !py-1.5`}>{t.retryTopic}</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold mb-2">{t.progRecent}</h3>
        {progress.attempts.length === 0 ? <p className="text-sm opacity-80">{t.progNoRecent}</p> : (
          <ul className="space-y-2">
            {progress.attempts.slice(0, 8).map((a) => (
              <li key={a.id} className="rounded-xl border p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  <span className="font-semibold">{attemptLabel(a)}</span>
                  <span className="block text-xs opacity-75">{new Date(a.ts).toLocaleString(language)}</span>
                </span>
                <span>{t.scoreWord}: <b>{a.correct}/{a.total}</b> ({a.percent}%)</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {saveFailed && <p role="alert" className="text-sm rounded-xl bg-amber-50 text-amber-900 border border-amber-300 p-3">{t.progSaveFailed}</p>}
      <p className="text-sm rounded-xl bg-sky-50 text-sky-900 border border-sky-200 p-3" role="note">{t.progStorage}</p>
    </section>
  );
};
