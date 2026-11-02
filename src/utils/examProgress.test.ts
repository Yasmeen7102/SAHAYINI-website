import assert from 'node:assert/strict';
import { examLessons, examTopics, topicsForExam } from '../data/examLessons';
import { examQuestions, mixedQuestionsForExam, questionsForTopic } from '../data/examQuestions';
import { exams, resolveExamStatus, STATUS_MAX_AGE_DAYS } from '../data/examData';
import type { ExamStatusRecord } from '../data/examData';
import { examText, examTextRaw, EXAM_LANGUAGES } from '../i18n/examStrings';
import {
  PROGRESS_KEY, addAttempt, buildAttempt, computeStats, emptyProgress, loadProgress,
  saveProgress, scoreAnswers, setLessonCompleted,
} from './examProgress';
import type { StorageLike } from './examProgress';

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log('ok -', name); };
const memory = (): StorageLike & { data: Record<string, string> } => {
  const data: Record<string, string> = {};
  return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = v; } };
};

test('question bank is well formed with unique ids', () => {
  const ids = new Set<string>();
  for (const q of examQuestions) {
    assert.equal(q.options.length, 4, q.id);
    assert.ok(q.answer >= 0 && q.answer <= 3, q.id);
    assert.equal(new Set(q.options).size, 4, `${q.id} has duplicate options`);
    assert.ok(q.explanation.length > 10, q.id);
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`);
    ids.add(q.id);
  }
  assert.ok(examQuestions.length >= 60);
});

test('every lesson has all required sections and 8 localised titles', () => {
  for (const l of examLessons) {
    assert.ok(l.intro && l.recap && l.sections.length >= 1 && l.facts.length >= 3 && l.examples.length >= 1 && l.keyPoints.length >= 3, l.id);
    for (const lang of EXAM_LANGUAGES) assert.ok((l.titles as Record<string, string>)[lang], `${l.id} title ${lang}`);
  }
});

test('every exam maps to existing topics and has a mixed test of distinct questions', () => {
  for (const e of exams) {
    assert.ok(examTopics[e.id], `no topics for ${e.id}`);
    const mixed = mixedQuestionsForExam(e.id);
    assert.ok(mixed.length >= 6, `${e.id} mixed too short`);
    assert.equal(new Set(mixed.map((q) => q.id)).size, mixed.length);
    for (const t of topicsForExam(e.id)) assert.ok(examLessons.some((l) => l.id === t));
  }
});

test('topic tests have several questions; current affairs has none', () => {
  for (const l of examLessons) {
    if (l.id === 'current') assert.equal(questionsForTopic(l.id).length, 0);
    else assert.ok(questionsForTopic(l.id).length >= 5, l.id);
  }
});

test('scoring counts correct, incorrect and skipped', () => {
  const qs = questionsForTopic('polity');
  const sel = [qs[0].answer, (qs[1].answer + 1) % 4, null, qs[3].answer, null, (qs[5].answer + 2) % 4] as (number | null)[];
  const s = scoreAnswers(qs, sel);
  assert.deepEqual(s, { total: 6, correct: 2, incorrect: 2, skipped: 2, percent: 33 });
});

test('lesson completion persists and can be undone', () => {
  const st = memory();
  let p = setLessonCompleted(emptyProgress(), 'polity', true);
  assert.equal(setLessonCompleted(p, 'polity', true), p);
  saveProgress(p, st);
  assert.deepEqual(loadProgress(st).completedLessons, ['polity']);
  p = setLessonCompleted(p, 'polity', false);
  saveProgress(p, st);
  assert.deepEqual(loadProgress(st).completedLessons, []);
});

test('attempts update stats, topic performance and weak topics', () => {
  const qs = questionsForTopic('quant');
  const wrong = qs.map((q) => (q.answer + 1) % 4);
  let p = addAttempt(emptyProgress(), buildAttempt(qs, wrong, { scope: 'topic', topic: 'quant' }, 1));
  p = addAttempt(p, buildAttempt(questionsForTopic('polity'), questionsForTopic('polity').map((q) => q.answer), { scope: 'topic', topic: 'polity' }, 2));
  p = setLessonCompleted(p, 'polity', true);
  const s = computeStats(p);
  assert.equal(s.testsCompleted, 2);
  assert.equal(s.answered, 12);
  assert.equal(s.correct, 6);
  assert.equal(s.incorrect, 6);
  assert.equal(s.averageScore, 50);
  assert.equal(s.lessonsCompleted, 1);
  assert.deepEqual(s.weakTopics, ['quant']);
  assert.equal(s.topics.find((t) => t.topic === 'polity')?.percent, 100);
  assert.ok(s.overallPercent > 0 && s.overallPercent <= 100);
});

test('corrupt or unknown stored data is ignored safely', () => {
  const st = memory();
  st.setItem(PROGRESS_KEY, '{not json');
  assert.deepEqual(loadProgress(st), emptyProgress());
  st.setItem(PROGRESS_KEY, JSON.stringify({ completedLessons: ['polity', 'bogus'], attempts: 'x' }));
  assert.deepEqual(loadProgress(st).completedLessons, ['polity']);
});

test('legacy lesson checklist is migrated', () => {
  const st = memory();
  st.setItem('sahayini_exam_lessons', JSON.stringify(['Indian History', 'Logical Reasoning']));
  assert.deepEqual(loadProgress(st).completedLessons.sort(), ['history', 'reasoning']);
});

test('application status is never invented and stale records expire', () => {
  assert.equal(resolveExamStatus('ssc-cgl').status, 'unverified');
  const rec: ExamStatusRecord = { status: 'open', sourceName: 'Test', sourceUrl: 'https://example.invalid/', lastVerified: '2026-10-20' };
  const now = new Date('2026-10-30');
  assert.equal(resolveExamStatus('x', now, { x: rec }).status, 'open');
  assert.equal(resolveExamStatus('x', new Date(Date.parse('2026-10-20') + (STATUS_MAX_AGE_DAYS + 1) * 86400000), { x: rec }).status, 'unverified');
  assert.equal(resolveExamStatus('x', now, { x: { ...rec, sourceUrl: '' } }).status, 'unverified');
  assert.equal(resolveExamStatus('x', now, { x: { ...rec, lastVerified: 'soon' } }).status, 'unverified');
});

test('all 8 languages define every interface string', () => {
  const keys = Object.keys(examTextRaw('en'));
  for (const lang of EXAM_LANGUAGES) {
    const t = examTextRaw(lang) as unknown as Record<string, unknown>;
    for (const k of keys) assert.ok(t[k] !== undefined && t[k] !== '', `${lang} missing ${k}`);
    assert.equal((t.eduOptions as string[]).length, 6, `${lang} eduOptions`);
  }
});

console.log(`\n${passed} tests passed`);
