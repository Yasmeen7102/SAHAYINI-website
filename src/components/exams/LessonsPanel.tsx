import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { getExamName } from '../../data/examData';
import type { Exam } from '../../data/examData';
import { lessonById, lessonTitle, topicsForExam } from '../../data/examLessons';
import type { TopicId } from '../../data/examLessons';
import { questionsForTopic } from '../../data/examQuestions';
import { btnGhost, btnNavy, btnPrimary, linkBack } from './examUi';
import type { ExamUiProps } from './examUi';

interface Props extends ExamUiProps {
  exam: Exam | null;
  completedLessons: string[];
  onSetCompleted: (lessonId: string, done: boolean) => void;
  onPractice: (topic: TopicId) => void;
  initialLesson?: TopicId | null;
}

export const LessonsPanel: React.FC<Props> = ({ t, legacy, language, card, exam, completedLessons, onSetCompleted, onPractice, initialLesson = null }) => {
  const [openId, setOpenId] = useState<TopicId | null>(initialLesson);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const topicIds = topicsForExam(exam?.id);
  const lessons = topicIds.map((id) => lessonById(id)).filter((l): l is NonNullable<typeof l> => !!l);

  // Move focus to the lesson title when a lesson opens (keyboard and screen-reader friendly).
  useEffect(() => {
    if (openId && headingRef.current) {
      headingRef.current.focus();
      headingRef.current.scrollIntoView?.({ block: 'start' });
    }
  }, [openId]);

  const open = openId ? lessonById(openId) : undefined;

  if (open) {
    const done = completedLessons.includes(open.id);
    const hasQuestions = questionsForTopic(open.id).length > 0;
    return (
      <article className={`rounded-2xl border p-5 space-y-5 ${card}`}>
        <button className={linkBack} onClick={() => setOpenId(null)}><ArrowLeft className="w-4 h-4" aria-hidden="true" />{t.backToLessons}</button>
        <header className="space-y-1">
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">{lessonTitle(open, language)}</h2>
          {done && <p className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />{t.completed}</p>}
          {language !== 'en' && <p className="text-xs rounded-lg bg-sky-50 text-sky-900 border border-sky-200 p-2" role="note">{t.englishOnly}</p>}
        </header>

        <section aria-labelledby="ls-intro">
          <h3 id="ls-intro" className="font-bold text-lg mb-1">{t.lsIntro}</h3>
          <p>{open.intro}</p>
        </section>

        <section aria-labelledby="ls-explain" className="space-y-3">
          <h3 id="ls-explain" className="font-bold text-lg">{t.lsExplain}</h3>
          {open.sections.map((s) => (
            <div key={s.heading} className="space-y-1">
              <h4 className="font-semibold">{s.heading}</h4>
              {s.paragraphs.map((p) => <p key={p} className="text-[0.95em] leading-relaxed">{p}</p>)}
            </div>
          ))}
        </section>

        <section aria-labelledby="ls-facts">
          <h3 id="ls-facts" className="font-bold text-lg mb-1">{t.lsFacts}</h3>
          <ul className="list-disc pl-5 space-y-1">{open.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>

        <section aria-labelledby="ls-examples">
          <h3 id="ls-examples" className="font-bold text-lg mb-1">{t.lsExamples}</h3>
          <ul className="list-disc pl-5 space-y-1">{open.examples.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>

        <section aria-labelledby="ls-key">
          <h3 id="ls-key" className="font-bold text-lg mb-1">{t.lsKey}</h3>
          <ul className="list-disc pl-5 space-y-1">{open.keyPoints.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>

        <section aria-labelledby="ls-recap" className="rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 p-4">
          <h3 id="ls-recap" className="font-bold mb-1">{t.lsRecap}</h3>
          <p>{open.recap}</p>
        </section>

        {!hasQuestions && <p className="text-sm opacity-80">{t.noQuestionsTopic}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSetCompleted(open.id, !done)}
            aria-pressed={done}
            className={done ? btnGhost : btnPrimary}
          >
            {done ? <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />{t.markUndone}</span> : t.markDone}
          </button>
          <button onClick={() => onPractice(open.id)} disabled={!hasQuestions} className={`${btnNavy} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {t.practiceTopic}
          </button>
        </div>
      </article>
    );
  }

  return (
    <section className={`rounded-2xl border p-5 space-y-4 ${card}`}>
      <h2 className="text-xl font-bold"><BookOpen className="inline w-5 h-5 mr-2" aria-hidden="true" />{legacy.lessonTitle}{exam ? ` — ${getExamName(exam, language)}` : ''}</h2>
      <p>{exam ? t.lessonsIntroExam : t.lessonsIntroAll}</p>
      {language !== 'en' && <p className="text-xs rounded-lg bg-sky-50 text-sky-900 border border-sky-200 p-2" role="note">{t.englishOnly}</p>}
      <ul className="grid sm:grid-cols-2 gap-3">
        {lessons.map((l) => {
          const done = completedLessons.includes(l.id);
          const n = questionsForTopic(l.id).length;
          return (
            <li key={l.id}>
              <button
                onClick={() => setOpenId(l.id)}
                className="w-full text-left flex items-center gap-3 rounded-xl border p-3 hover:bg-slate-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span className="flex-1">
                  <span className="block font-semibold">{lessonTitle(l, language)}</span>
                  <span className="block text-xs opacity-75">{n > 0 ? `${n} ${t.questionsWord}` : t.noQuestionsTopic.split(':')[0]}</span>
                </span>
                {done && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />{t.completed}</span>}
                <ChevronRight className="w-4 h-4 opacity-60" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
