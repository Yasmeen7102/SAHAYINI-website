import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardCheck, RotateCcw, XCircle } from 'lucide-react';
import { getExamName } from '../../data/examData';
import type { Exam } from '../../data/examData';
import { lessonById, lessonTitle, topicsForExam } from '../../data/examLessons';
import type { TopicId } from '../../data/examLessons';
import { mixedQuestionsForExam, questionsForTopic } from '../../data/examQuestions';
import type { ExamQuestion } from '../../data/examQuestions';
import { buildAttempt, scoreAnswers } from '../../utils/examProgress';
import type { ExamAttempt } from '../../utils/examProgress';
import { btnGhost, btnNavy, btnPrimary, linkBack } from './examUi';
import type { ExamUiProps } from './examUi';

export type TestTarget = { kind: 'topic'; topic: TopicId } | { kind: 'mixed' };

interface Props extends ExamUiProps {
  exam: Exam | null;
  initialTarget: TestTarget | null;
  onRecord: (attempt: ExamAttempt) => void;
}

interface Session {
  questions: ExamQuestion[];
  selected: (number | null)[];
  checked: boolean[];
  index: number;
  submitted: boolean;
}

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal';
const LETTERS = ['A', 'B', 'C', 'D'];

const Option: React.FC<{ letter: string; text: string; state: OptionState; disabled: boolean; onPick: () => void; tag?: string }> = ({ letter, text, state, disabled, onPick, tag }) => {
  const style: Record<OptionState, string> = {
    idle: 'border-slate-300 hover:bg-slate-500/10',
    selected: 'border-sky-600 bg-sky-50 text-sky-950 ring-1 ring-sky-600',
    correct: 'border-emerald-600 bg-emerald-100 text-emerald-950 ring-1 ring-emerald-600',
    reveal: 'border-emerald-600 bg-emerald-100 text-emerald-950 ring-1 ring-emerald-600',
    wrong: 'border-red-600 bg-red-100 text-red-950 ring-1 ring-red-600',
  };
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state === 'selected' || state === 'correct' || state === 'wrong'}
      disabled={disabled}
      onClick={onPick}
      className={`w-full text-left flex items-start gap-3 rounded-xl border-2 p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${style[state]} ${disabled ? 'cursor-default' : ''}`}
    >
      <span className="font-bold shrink-0 w-6">{letter}.</span>
      <span className="flex-1">{text}</span>
      {(state === 'correct' || state === 'reveal') && <span className="inline-flex items-center gap-1 text-xs font-bold shrink-0"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />{tag}</span>}
      {state === 'wrong' && <span className="inline-flex items-center gap-1 text-xs font-bold shrink-0"><XCircle className="w-4 h-4" aria-hidden="true" />{tag}</span>}
    </button>
  );
};

const optionState = (i: number, q: ExamQuestion, selected: number | null, revealed: boolean): OptionState => {
  if (!revealed) return selected === i ? 'selected' : 'idle';
  if (i === q.answer) return selected === i ? 'correct' : 'reveal';
  return selected === i ? 'wrong' : 'idle';
};

const Feedback: React.FC<{ q: ExamQuestion; selected: number | null; t: ExamUiProps['t'] }> = ({ q, selected, t }) => {
  if (selected === null) {
    return (
      <div role="status" className="rounded-xl border-2 border-slate-400 bg-slate-100 text-slate-900 p-3 space-y-1">
        <p className="font-bold">{t.notAnswered}</p>
        <p className="text-sm">{t.rightAnswerIs}: <b>{LETTERS[q.answer]}. {q.options[q.answer]}</b></p>
        <p className="text-sm"><b>{t.explanation}:</b> {q.explanation}</p>
      </div>
    );
  }
  const ok = selected === q.answer;
  return (
    <div role="status" className={`rounded-xl border-2 p-3 space-y-1 ${ok ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-red-600 bg-red-50 text-red-950'}`}>
      <p className="font-bold flex items-center gap-2">
        {ok ? <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> : <XCircle className="w-5 h-5" aria-hidden="true" />}
        {ok ? t.correctAns : t.incorrectAns}
      </p>
      {!ok && <p className="text-sm">{t.rightAnswerIs}: <b>{LETTERS[q.answer]}. {q.options[q.answer]}</b></p>}
      <p className="text-sm"><b>{t.explanation}:</b> {q.explanation}</p>
    </div>
  );
};

export const PracticeTest: React.FC<Props> = ({ t, legacy, language, card, exam, initialTarget, onRecord }) => {
  const [target, setTarget] = useState<TestTarget | null>(initialTarget);
  const [session, setSession] = useState<Session | null>(null);
  const [showReview, setShowReview] = useState(true);
  const [result, setResult] = useState<ExamAttempt | null>(null);

  const questionsFor = (tg: TestTarget): ExamQuestion[] => (tg.kind === 'topic' ? questionsForTopic(tg.topic) : mixedQuestionsForExam(exam?.id ?? null));

  const start = (tg: TestTarget) => {
    const questions = questionsFor(tg);
    if (questions.length === 0) return;
    setTarget(tg);
    setResult(null);
    setShowReview(true);
    setSession({ questions, selected: questions.map(() => null), checked: questions.map(() => false), index: 0, submitted: false });
  };

  // Start immediately when arriving from "Practice This Topic" or a weak-topic retry.
  useEffect(() => {
    if (initialTarget) start(initialTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTarget]);

  const leave = () => { setSession(null); setTarget(null); setResult(null); };

  const targetTitle = (tg: TestTarget) => {
    if (tg.kind === 'mixed') return exam ? `${t.mixedTest} — ${getExamName(exam, language)}` : t.mixedTestAll;
    const l = lessonById(tg.topic);
    return l ? lessonTitle(l, language) : tg.topic;
  };

  // ---------- Pick a test ----------
  if (!session) {
    const topics = topicsForExam(exam?.id).filter((id) => questionsForTopic(id).length > 0);
    const mixedCount = mixedQuestionsForExam(exam?.id ?? null).length;
    return (
      <section className={`rounded-2xl border p-5 space-y-4 ${card}`}>
        <h2 className="text-xl font-bold"><ClipboardCheck className="inline w-5 h-5 mr-2" aria-hidden="true" />{legacy.quizTitle}{exam ? ` — ${getExamName(exam, language)}` : ''}</h2>
        <p>{t.testsPick}</p>
        <p className="text-xs opacity-80" role="note">{t.qSource}</p>
        {language !== 'en' && <p className="text-xs rounded-lg bg-sky-50 text-sky-900 border border-sky-200 p-2" role="note">{t.englishOnly}</p>}

        <div className="rounded-xl border p-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold">{exam ? t.mixedTest : t.mixedTestAll}</p>
            <p className="text-xs opacity-75">{mixedCount} {t.questionsWord}</p>
          </div>
          <button onClick={() => start({ kind: 'mixed' })} className={btnPrimary}>{t.startTest}</button>
        </div>

        <h3 className="font-bold">{t.topicTests}</h3>
        <ul className="grid sm:grid-cols-2 gap-3">
          {topics.map((id) => {
            const l = lessonById(id);
            return (
              <li key={id} className="rounded-xl border p-3 flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{l ? lessonTitle(l, language) : id}</p>
                  <p className="text-xs opacity-75">{questionsForTopic(id).length} {t.questionsWord}</p>
                </div>
                <button onClick={() => start({ kind: 'topic', topic: id })} className={btnNavy}>{t.startTest}</button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const { questions, selected, checked, index, submitted } = session;
  const q = questions[index];

  const update = (patch: Partial<Session>) => setSession({ ...session, ...patch });
  const pick = (i: number) => {
    if (checked[index] || submitted) return;
    const next = [...selected]; next[index] = i; update({ selected: next });
  };
  const check = () => {
    if (selected[index] === null) return;
    const next = [...checked]; next[index] = true; update({ checked: next });
  };
  const submit = () => {
    const attempt = buildAttempt(questions, selected, {
      scope: target?.kind === 'topic' ? 'topic' : 'mixed',
      topic: target?.kind === 'topic' ? target.topic : undefined,
      examId: exam?.id ?? null,
    });
    onRecord(attempt);
    setResult(attempt);
    update({ submitted: true });
  };

  // ---------- Results ----------
  if (submitted && result) {
    const s = scoreAnswers(questions, selected);
    return (
      <section className={`rounded-2xl border p-5 space-y-5 ${card}`} aria-labelledby="test-result">
        <button className={linkBack} onClick={leave}><ArrowLeft className="w-4 h-4" aria-hidden="true" />{t.backToTests}</button>
        <div>
          <h2 id="test-result" className="text-xl font-bold">{t.resultTitle}</h2>
          <p className="text-sm opacity-80">{target ? targetTitle(target) : ''}</p>
        </div>
        <div role="status" className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="rounded-xl border p-3"><p className="text-xs opacity-75">{t.scoreWord}</p><p className="text-2xl font-extrabold">{s.correct}/{s.total}</p></div>
          <div className="rounded-xl border p-3"><p className="text-xs opacity-75">{t.percentWord}</p><p className="text-2xl font-extrabold">{s.percent}%</p></div>
          <div className="rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-950 p-3"><p className="text-xs">{t.correctWord}</p><p className="text-2xl font-extrabold">{s.correct}</p></div>
          <div className="rounded-xl border-2 border-red-600 bg-red-50 text-red-950 p-3"><p className="text-xs">{t.incorrectWord}</p><p className="text-2xl font-extrabold">{s.incorrect}</p></div>
          <div className="rounded-xl border p-3 col-span-2 md:col-span-1"><p className="text-xs opacity-75">{t.skippedWord}</p><p className="text-2xl font-extrabold">{s.skipped}</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowReview(!showReview)} aria-expanded={showReview} className={btnNavy}>{t.reviewAnswers}</button>
          <button onClick={() => target && start(target)} className={`${btnPrimary} inline-flex items-center gap-2`}><RotateCcw className="w-4 h-4" aria-hidden="true" />{t.retake}</button>
        </div>
        {showReview && (
          <ol className="space-y-4">
            {questions.map((qq, i) => (
              <li key={qq.id} className="rounded-xl border p-4 space-y-3">
                <p className="font-semibold">{t.qWord} {i + 1} {t.ofWord} {questions.length}: {qq.q}</p>
                <div role="group" aria-label={qq.q} className="space-y-2">
                  {qq.options.map((o, oi) => (
                    <Option key={o} letter={LETTERS[oi]} text={o} disabled onPick={() => undefined}
                      state={optionState(oi, qq, selected[i], true)}
                      tag={oi === qq.answer ? t.correctAns : t.yourAnswer} />
                  ))}
                </div>
                <Feedback q={qq} selected={selected[i]} t={t} />
              </li>
            ))}
          </ol>
        )}
      </section>
    );
  }

  // ---------- Taking the test ----------
  const revealed = checked[index];
  const answeredCount = selected.filter((x) => x !== null).length;
  const isLast = index === questions.length - 1;
  return (
    <section className={`rounded-2xl border p-5 space-y-4 ${card}`} aria-labelledby="test-q">
      <button className={linkBack} onClick={leave}><ArrowLeft className="w-4 h-4" aria-hidden="true" />{t.backToTests}</button>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">{target ? targetTitle(target) : ''}</h2>
        <p className="text-sm" aria-live="polite">{t.qWord} {index + 1} {t.ofWord} {questions.length} · {t.answeredSoFar}: {answeredCount}</p>
      </div>
      <div className="h-2 rounded-full bg-slate-500/20" role="progressbar" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1} aria-label={t.qWord}>
        <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <p id="test-q" className="text-lg font-semibold">{q.q}</p>
      <div role="radiogroup" aria-labelledby="test-q" className="space-y-2">
        {q.options.map((o, i) => (
          <Option key={o} letter={LETTERS[i]} text={o} disabled={revealed}
            onPick={() => pick(i)} state={optionState(i, q, selected[index], revealed)}
            tag={i === q.answer ? t.correctAns : t.yourAnswer} />
        ))}
      </div>

      {revealed ? <Feedback q={q} selected={selected[index]} t={t} /> : <p className="text-sm opacity-75">{t.pickOption}</p>}

      <div className="flex flex-wrap gap-2 pt-1">
        <button onClick={() => update({ index: index - 1 })} disabled={index === 0} className={`${btnGhost} disabled:opacity-40`}>{t.prevQ}</button>
        {!revealed && <button onClick={check} disabled={selected[index] === null} className={`${btnNavy} disabled:opacity-50`}>{t.checkAnswer}</button>}
        {!isLast && <button onClick={() => update({ index: index + 1 })} className={btnGhost}>{t.nextQ}</button>}
        <button onClick={submit} className={isLast ? btnPrimary : btnGhost}>{t.submitTest}</button>
      </div>
    </section>
  );
};
