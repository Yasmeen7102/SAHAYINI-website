import type { TopicId } from '../data/examLessons';
import { examLessons } from '../data/examLessons';
import { examQuestions, questionById } from '../data/examQuestions';
import type { ExamQuestion } from '../data/examQuestions';

// Progress for the Government Exams module. Stored in this browser's
// localStorage like the rest of SAHAYINI (no account sync, no new database).

export const PROGRESS_KEY = 'sahayini_exam_progress_v1';
const LEGACY_LESSONS_KEY = 'sahayini_exam_lessons';
export const MAX_ATTEMPTS = 50;
export const WEAK_THRESHOLD_PERCENT = 60;
export const WEAK_MIN_ANSWERED = 3;

export interface AttemptAnswer { qid: string; selected: number | null }

export interface ExamAttempt {
  id: string;
  ts: number;
  scope: 'topic' | 'mixed';
  topic?: TopicId;
  examId?: string | null;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  percent: number;
  answers: AttemptAnswer[];
}

export interface ExamProgress {
  version: 1;
  completedLessons: string[];
  attempts: ExamAttempt[];
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const emptyProgress = (): ExamProgress => ({ version: 1, completedLessons: [], attempts: [] });

// Old checklist used topic names as ids. Map them to the new lesson ids.
const LEGACY_LESSON_IDS: Record<string, TopicId> = {
  'Indian Polity and Constitution': 'polity',
  'Indian History': 'history',
  'Indian Geography': 'geography',
  'Indian Economy': 'economy',
  'General Science': 'science',
  'Current Affairs': 'current',
  'Quantitative Aptitude': 'quant',
  'Logical Reasoning': 'reasoning',
};

const defaultStorage = (): StorageLike | null => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
};

function sanitize(raw: unknown): ExamProgress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<ExamProgress>;
  const lessonIds = new Set(examLessons.map((l) => l.id as string));
  if (Array.isArray(r.completedLessons)) {
    base.completedLessons = [...new Set(r.completedLessons.filter((x): x is string => typeof x === 'string' && lessonIds.has(x)))];
  }
  if (Array.isArray(r.attempts)) {
    base.attempts = r.attempts
      .filter((a): a is ExamAttempt => !!a && typeof a.id === 'string' && typeof a.total === 'number' && Array.isArray(a.answers))
      .slice(0, MAX_ATTEMPTS);
  }
  return base;
}

export function loadProgress(storage: StorageLike | null = defaultStorage()): ExamProgress {
  if (!storage) return emptyProgress();
  try {
    const stored = storage.getItem(PROGRESS_KEY);
    if (stored) return sanitize(JSON.parse(stored));
    const legacy = storage.getItem(LEGACY_LESSONS_KEY);
    if (legacy) {
      const names = JSON.parse(legacy);
      if (Array.isArray(names)) {
        const migrated = sanitize({ completedLessons: names.map((n: unknown) => (typeof n === 'string' ? LEGACY_LESSON_IDS[n] || n : n)) });
        return migrated;
      }
    }
  } catch {
    /* corrupt data: start fresh */
  }
  return emptyProgress();
}

export function saveProgress(progress: ExamProgress, storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function setLessonCompleted(progress: ExamProgress, lessonId: string, done: boolean): ExamProgress {
  const has = progress.completedLessons.includes(lessonId);
  if (done === has) return progress;
  return {
    ...progress,
    completedLessons: done ? [...progress.completedLessons, lessonId] : progress.completedLessons.filter((x) => x !== lessonId),
  };
}

export function scoreAnswers(questions: ExamQuestion[], selected: (number | null)[]) {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  questions.forEach((q, i) => {
    const s = selected[i];
    if (s === null || s === undefined) skipped++;
    else if (s === q.answer) correct++;
    else incorrect++;
  });
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { total, correct, incorrect, skipped, percent };
}

export function buildAttempt(
  questions: ExamQuestion[],
  selected: (number | null)[],
  meta: { scope: 'topic' | 'mixed'; topic?: TopicId; examId?: string | null },
  now: number = Date.now(),
): ExamAttempt {
  const s = scoreAnswers(questions, selected);
  return {
    id: `a${now}`,
    ts: now,
    scope: meta.scope,
    topic: meta.topic,
    examId: meta.examId ?? null,
    ...s,
    answers: questions.map((q, i) => ({ qid: q.id, selected: selected[i] ?? null })),
  };
}

export function addAttempt(progress: ExamProgress, attempt: ExamAttempt): ExamProgress {
  return { ...progress, attempts: [attempt, ...progress.attempts].slice(0, MAX_ATTEMPTS) };
}

export interface TopicStat { topic: TopicId; answered: number; correct: number; percent: number | null; needsPractice: boolean }

export interface ProgressStats {
  lessonsCompleted: number;
  lessonsTotal: number;
  testsCompleted: number;
  answered: number;
  correct: number;
  incorrect: number;
  averageScore: number;
  overallPercent: number;
  topics: TopicStat[];
  weakTopics: TopicId[];
}

export function computeStats(progress: ExamProgress): ProgressStats {
  const lessonsTotal = examLessons.length;
  const validLessons = new Set<string>(examLessons.map((l) => l.id));
  const lessonsCompleted = progress.completedLessons.filter((x) => validLessons.has(x)).length;

  const perTopic = new Map<TopicId, { answered: number; correct: number }>();
  let answered = 0;
  let correct = 0;
  for (const a of progress.attempts) {
    for (const ans of a.answers) {
      if (ans.selected === null) continue;
      const q = questionById(ans.qid);
      if (!q) continue;
      answered++;
      const t = perTopic.get(q.topic) || { answered: 0, correct: 0 };
      t.answered++;
      if (ans.selected === q.answer) {
        correct++;
        t.correct++;
      }
      perTopic.set(q.topic, t);
    }
  }

  const questionTopics = [...new Set(examQuestions.map((q) => q.topic))];
  const topics: TopicStat[] = questionTopics.map((topic) => {
    const t = perTopic.get(topic) || { answered: 0, correct: 0 };
    const percent = t.answered === 0 ? null : Math.round((t.correct / t.answered) * 100);
    return {
      topic,
      answered: t.answered,
      correct: t.correct,
      percent,
      needsPractice: percent !== null && t.answered >= WEAK_MIN_ANSWERED && percent < WEAK_THRESHOLD_PERCENT,
    };
  });

  const testsCompleted = progress.attempts.length;
  const averageScore = testsCompleted === 0 ? 0 : Math.round(progress.attempts.reduce((s, a) => s + a.percent, 0) / testsCompleted);
  const lessonPct = lessonsTotal === 0 ? 0 : lessonsCompleted / lessonsTotal;
  const practised = topics.filter((t) => t.answered > 0).length;
  const practicePct = topics.length === 0 ? 0 : practised / topics.length;
  const overallPercent = Math.round(((lessonPct + practicePct) / 2) * 100);

  return {
    lessonsCompleted,
    lessonsTotal,
    testsCompleted,
    answered,
    correct,
    incorrect: answered - correct,
    averageScore,
    overallPercent,
    topics,
    weakTopics: topics.filter((t) => t.needsPractice).map((t) => t.topic),
  };
}
