import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PROGRESS_KEY,
  addAttempt,
  computeStats,
  loadProgress,
  saveProgress,
  setLessonCompleted,
} from '../utils/examProgress';
import type { ExamAttempt, ExamProgress } from '../utils/examProgress';

// Single source of truth for exam progress. Every panel reads the same state,
// so the My Progress view updates immediately after a lesson is completed or a
// test is submitted. Other browser tabs are kept in sync via the storage event.
export function useExamProgress() {
  const [progress, setProgress] = useState<ExamProgress>(() => loadProgress());
  const [saveFailed, setSaveFailed] = useState(false);
  // Latest state, so actions never rely on a stale closure even if storage is unavailable.
  const latest = useRef<ExamProgress>(progress);
  latest.current = progress;

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY || e.key === null) {
        const fresh = loadProgress();
        latest.current = fresh;
        setProgress(fresh);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const commit = useCallback((next: ExamProgress) => {
    latest.current = next;
    setProgress(next);
    setSaveFailed(!saveProgress(next));
  }, []);

  const setLesson = useCallback(
    (lessonId: string, done: boolean) => commit(setLessonCompleted(latest.current, lessonId, done)),
    [commit],
  );
  const recordAttempt = useCallback(
    (attempt: ExamAttempt) => commit(addAttempt(latest.current, attempt)),
    [commit],
  );

  return { progress, stats: computeStats(progress), setLesson, recordAttempt, saveFailed };
}
