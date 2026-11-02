import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getExamName, resolveExamStatus } from '../../data/examData';
import type { Exam } from '../../data/examData';
import { StatusBadge } from './StatusBadge';
import { btnGhost, btnNavy, btnPrimary, linkBack } from './examUi';
import type { ExamUiProps } from './examUi';

interface Props extends ExamUiProps {
  exam: Exam;
  onBack: () => void;
  onEligibility: () => void;
  onLessons: () => void;
  onTests: () => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid sm:grid-cols-[190px_1fr] gap-1 sm:gap-3 py-2 border-b border-slate-500/20 last:border-0">
    <dt className="font-semibold">{label}</dt>
    <dd className="opacity-90">{children}</dd>
  </div>
);

const formatDate = (iso: string, language: string) => {
  const d = new Date(iso + 'T00:00:00');
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const ExamDetail: React.FC<Props> = ({ t, legacy, language, card, exam, onBack, onEligibility, onLessons, onTests }) => {
  const { status, record } = resolveExamStatus(exam.id);
  const applyUrl = record?.applyUrl || exam.url;
  const steps = [t.ap1, t.ap2, t.ap3, t.ap4, t.ap5];

  return (
    <section className={`rounded-2xl border p-5 space-y-5 ${card}`} aria-labelledby="exam-detail-title">
      <button className={linkBack} onClick={onBack}><ArrowLeft className="w-4 h-4" aria-hidden="true" />{t.backToExams}</button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="exam-detail-title" className="text-xl font-bold">{getExamName(exam, language)}</h2>
          <p className="text-sm opacity-75">{exam.authority} · {exam.state}</p>
        </div>
        <StatusBadge status={status} t={t} />
      </div>

      <dl>
        <Row label={t.conducting}>{exam.authority}</Row>
        <Row label={legacy.qual}>{exam.education}</Row>
        <Row label={legacy.age}>{exam.age}</Row>
        <Row label={legacy.syllabus}>{exam.syllabus}</Row>
        <Row label={legacy.pattern}>{exam.pattern}</Row>
        <Row label={t.appStatus}>
          <div className="space-y-1">
            <StatusBadge status={status} t={t} />
            {record ? (
              <p className="text-sm">
                {t.stSource}: <a className="underline" href={record.sourceUrl} target="_blank" rel="noreferrer noopener">{record.sourceName}</a>
                {' · '}{t.stVerifiedOn}: {formatDate(record.lastVerified, language)}
              </p>
            ) : (
              <p className="text-sm">{t.stUnverifiedHelp}</p>
            )}
          </div>
        </Row>
        <Row label={t.importantDates}>
          {record?.importantDates && record.importantDates.length > 0 ? (
            <ul className="space-y-0.5">
              {record.importantDates.map((d) => (
                <li key={d.label + d.date}>{d.label}: <b>{formatDate(d.date, language)}</b></li>
              ))}
            </ul>
          ) : (
            <span className="text-sm">{t.noVerifiedDates}</span>
          )}
        </Row>
        <Row label={t.sources}>
          <ul className="space-y-1">
            <li>
              <a className="inline-flex items-center gap-1.5 text-blue-700 underline break-all" href={exam.url} target="_blank" rel="noreferrer noopener">
                {legacy.official}: {exam.url}<ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </li>
            {record && (
              <li>
                <a className="inline-flex items-center gap-1.5 text-blue-700 underline" href={record.sourceUrl} target="_blank" rel="noreferrer noopener">
                  {t.viewNotification}<ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              </li>
            )}
          </ul>
        </Row>
      </dl>

      {exam.note && <p className="text-sm opacity-80">{exam.note}</p>}
      <p className="text-sm font-medium rounded-xl bg-amber-50 text-amber-900 border border-amber-200 p-3" role="note">{t.stReminder}</p>

      <div className="space-y-2">
        <a href={applyUrl} target="_blank" rel="noreferrer noopener" className={`${btnNavy} inline-flex items-center gap-2`}>
          {t.applyBtn}<ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
        <p className="text-xs opacity-75">{t.applyNote}</p>
      </div>

      <div>
        <h3 className="font-bold mb-2">{t.howToApply}</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={onEligibility} className={btnPrimary}>{legacy.elig}</button>
        <button onClick={onLessons} className={btnGhost}>{legacy.lessons}</button>
        <button onClick={onTests} className={btnGhost}>{legacy.tests}</button>
      </div>
    </section>
  );
};
