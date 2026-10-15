import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getTopicsForLang,
  getLessonsForLang,
  getQuizzesForLang,
} from '../../data/lessonsData';
import { LOCALIZED_BADGES } from '../../i18n/translations';
import { LessonItem } from '../../types';
import { LessonReaderModal } from '../modals/LessonReaderModal';
import { Logo } from '../common/Logo';
import { getExtraStrings } from '../../i18n/extraStrings';
import {
  BookOpen,
  Volume2,
  ChevronRight,
  Mic,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Landmark,
  MoreHorizontal,
  Heart,
  GraduationCap,
  Banknote,
  Scale,
  Award,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const {
    language,
    completedLessonIds,
    quizScores,
    saveQuizScore,
    setActiveTab,
    t,
  } = useApp();

  const extra = getExtraStrings(language);
  const [activeSegment, setActiveSegment] = useState<'lessons' | 'quizzes' | 'progress'>('lessons');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('digital-basics');
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [startAudioModal, setStartAudioModal] = useState(false);

  // Dynamic localized data based on currently selected language
  const currentTopics = getTopicsForLang(language);
  const currentLessons = getLessonsForLang(language);
  const currentQuizzes = getQuizzesForLang(language);

  // Each topic card shows its own lessons. If a topic has none yet, show every lesson with a note
  // (instead of an empty page or silently ignoring the tapped card).
  const selectedTopic = currentTopics.find((tp) => tp.id === selectedTopicId) || currentTopics[0];
  const topicLessons = currentLessons.filter((l) => l.topicId === selectedTopicId);
  const topicHasNoLessons = topicLessons.length === 0;
  const lessonsToShow = topicHasNoLessons ? currentLessons : topicLessons;

  // Quiz interactive state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScoreCounter, setQuizScoreCounter] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-sky-700" />;
      case 'Banknote':
        return <Banknote className="w-5 h-5 text-teal-700" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-orange-700" />;
      default:
        return <MoreHorizontal className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleOpenLesson = (lesson: LessonItem, playAudio: boolean) => {
    setActiveLesson(lesson);
    setStartAudioModal(playAudio);
  };

  const handleSelectQuizOption = (optIdx: number) => {
    if (showExplanation) return;
    setSelectedOption(optIdx);
    setShowExplanation(true);
    const q = currentQuizzes[currentQuizIndex];
    if (optIdx === q.correctIndex) {
      setQuizScoreCounter((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex + 1 < currentQuizzes.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      const totalScorePercent = Math.round(
        (quizScoreCounter / currentQuizzes.length) * 100
      );
      saveQuizScore(selectedTopicId, totalScorePercent);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScoreCounter(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Orange Learn Banner with official SAHAYINI Logo (removed girl toy per user request) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-100/95 via-orange-50 to-amber-50/70 rounded-3xl p-6 border border-orange-200/90 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 z-10">
            {/* Orange book icon circle */}
            <div className="w-14 h-14 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-md ring-4 ring-orange-200 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
                {t.learn.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.learn.subtitle}
              </p>
            </div>
          </div>

          {/* Official SAHAYINI Emblem in circular badge replacing girl toy */}
          <div className="shrink-0 flex items-center justify-center p-1.5 rounded-full bg-white/80 border border-orange-200 shadow-sm backdrop-blur-xs">
            <Logo size="md" showText={false} />
          </div>
        </div>
      </div>

      {/* 2. Segmented Tabs in Selected Language */}
      <div className="flex bg-slate-100 p-1.5 rounded-full shadow-2xs">
        <button
          onClick={() => setActiveSegment('lessons')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
            activeSegment === 'lessons'
              ? 'bg-[#0A2E65] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.learn.tabs.lessons}
        </button>
        <button
          onClick={() => setActiveSegment('quizzes')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
            activeSegment === 'quizzes'
              ? 'bg-[#0A2E65] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.learn.tabs.quizzes}
        </button>
        <button
          onClick={() => setActiveSegment('progress')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
            activeSegment === 'progress'
              ? 'bg-[#0A2E65] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.learn.tabs.progress}
        </button>
      </div>

      {/* Lessons Tab */}
      {activeSegment === 'lessons' && (
        <>
          {/* 3. Choose a topic in Selected Language */}
          <div>
            <h2 className="text-base font-extrabold text-slate-900 mb-3">
              {t.learn.chooseTopic}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {currentTopics.map((topic) => {
                const isSelected = selectedTopicId === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    aria-pressed={isSelected}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${topic.bgColor} ${
                      isSelected
                        ? 'ring-2 ring-[#0A2E65] border-transparent shadow-xs scale-102'
                        : `${topic.borderColor} hover:shadow-xs`
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white shadow-2xs">
                      {getTopicIcon(topic.icon)}
                    </div>
                    <span className={`text-xs font-bold leading-tight ${topic.textColor}`}>
                      {topic.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Featured Lessons in Selected Language */}
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-slate-900">
              {t.learn.featuredLessons}
              {selectedTopic && !topicHasNoLessons && (
                <span className="font-semibold text-slate-700">
                  {' — '}
                  {extra.learnShowingTopic} {selectedTopic.title}
                </span>
              )}
            </h2>

            {topicHasNoLessons && (
              <p className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 leading-relaxed">
                {selectedTopic?.title}: {extra.learnComingSoon}
              </p>
            )}

            <div className="space-y-3">
              {lessonsToShow.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Left: Icon & text (tap anywhere here to open the lesson) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenLesson(lesson, false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenLesson(lesson, false);
                        }
                      }}
                      className="flex items-start gap-3.5 flex-1 min-w-0 cursor-pointer text-left"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A2E65] shrink-0">
                        {getTopicIcon(
                          currentTopics.find((tp) => tp.id === lesson.topicId)?.icon || 'Smartphone'
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {lesson.title}
                          </h3>
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {t.learn.completed}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Listen & Read Buttons */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleOpenLesson(lesson, true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
                        title={t.learn.listen}
                      >
                        <Volume2 className="w-4 h-4 text-emerald-700" />
                        <span>{t.learn.listen}</span>
                      </button>

                      <button
                        onClick={() => handleOpenLesson(lesson, false)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0A2E65] border border-blue-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
                        title={t.learn.read}
                      >
                        <BookOpen className="w-4 h-4 text-[#0A2E65]" />
                        <span>{t.learn.read}</span>
                      </button>

                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. "Prefer to listen?" Orange Card */}
          <div className="bg-orange-50 rounded-3xl p-5 border border-orange-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {t.learn.preferToListen}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t.learn.voiceLearningPrompt}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('chat')}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{t.learn.startVoiceLearning}</span>
            </button>
          </div>

          {/* 6. Explanatory Audio/Text card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-3">
              <div className="flex items-center gap-3 p-1">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.learn.listenExplanatory}</h4>
                  <p className="text-[11px] text-slate-500">{t.learn.listenDesc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-1 sm:pl-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A2E65] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.learn.readExplanatory}</h4>
                  <p className="text-[11px] text-slate-500">{t.learn.readDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Language Availability Note */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-2.5 text-xs text-slate-600">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              {t.learn.allLanguagesNote}
            </p>
          </div>
        </>
      )}

      {/* Quizzes Tab in Selected Language */}
      {activeSegment === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
          {!quizFinished ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-[#0A2E65] uppercase tracking-wider">
                  {t.learn.quizQuestionOf} {currentQuizIndex + 1} / {currentQuizzes.length}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {t.learn.currentScore}: {quizScoreCounter}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {currentQuizzes[currentQuizIndex].question}
              </h3>

              <div className="space-y-2.5">
                {currentQuizzes[currentQuizIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === currentQuizzes[currentQuizIndex].correctIndex;

                  let optClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                  if (showExplanation) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      optClass = 'bg-red-50 border-red-300 text-red-900';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-blue-50 border-blue-300 text-[#0A2E65] font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectQuizOption(optIdx)}
                      disabled={showExplanation}
                      className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 cursor-pointer ${optClass}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    selectedOption === currentQuizzes[currentQuizIndex].correctIndex
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <span
                    className={`font-bold block mb-1 ${
                      selectedOption === currentQuizzes[currentQuizIndex].correctIndex
                        ? 'text-emerald-800'
                        : 'text-amber-800'
                    }`}
                  >
                    {selectedOption === currentQuizzes[currentQuizIndex].correctIndex
                      ? `✓ ${t.learn.wellDone}`
                      : `✗ ${t.learn.explanationLabel}`}
                  </span>
                  {currentQuizzes[currentQuizIndex].explanation}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                {showExplanation && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-2.5 bg-[#0A2E65] hover:bg-[#072344] text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
                  >
                    {currentQuizIndex + 1 === currentQuizzes.length
                      ? t.learn.finishQuiz
                      : t.learn.nextQuestion}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">{t.learn.quizCompletedTitle}</h3>
              <p className="text-sm text-slate-600">
                {t.learn.quizCompletedDesc} <strong>{quizScoreCounter}</strong> / <strong>{currentQuizzes.length}</strong>!
              </p>
              <div className="pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A2E65] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.learn.tryAgain}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Tab in Selected Language */}
      {activeSegment === 'progress' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t.learn.progressJourneyTitle}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                <span className="text-2xl font-black text-orange-700">{completedLessonIds.length}</span>
                <p className="text-xs font-bold text-orange-900 mt-1">{t.learn.lessonsCompletedCard}</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-2xl font-black text-emerald-700">
                  {Object.keys(quizScores).length}
                </span>
                <p className="text-xs font-bold text-emerald-900 mt-1">{t.learn.quizzesPassedCard}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <span className="text-2xl font-black text-[#0A2E65]">100%</span>
                <p className="text-xs font-bold text-[#0A2E65] mt-1">{t.learn.offlineReadyCard}</p>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t.learn.badgesTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(LOCALIZED_BADGES[language] || LOCALIZED_BADGES.en).map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
                      {badge.emoji}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{badge.title}</h5>
                      <p className="text-[10px] text-slate-500 leading-snug">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Reader Modal */}
      {activeLesson && (
        <LessonReaderModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          startPlayingAudio={startAudioModal}
        />
      )}
    </div>
  );
};
