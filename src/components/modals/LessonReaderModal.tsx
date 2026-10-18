import { getLegalLocalized } from '../../i18n/legalLocalized';
import React, { useState, useEffect, useRef } from 'react';
import { LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { getLessonsForLang } from '../../data/lessonsData';
import { SpeechPlayer } from '../../utils/speechUtils';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';

interface LessonReaderModalProps {
  lesson: LessonItem | null;
  onClose: () => void;
  startPlayingAudio?: boolean;
}

export const LessonReaderModal: React.FC<LessonReaderModalProps> = ({
  lesson,
  onClose,
  startPlayingAudio = false,
}) => {
  const { language, markLessonComplete, completedLessonIds, t } = useApp();

  const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused' | 'unavailable'>('idle');
  const [speechNotice, setSpeechNotice] = useState<string>('');
  const speechControllerRef = useRef<SpeechPlayer | null>(null);

  // Always resolve the lesson using the currently selected language
  const localizedLesson = lesson
    ? getLessonsForLang(language).find((l) => l.id === lesson.id) || lesson
    : null;

  const isCompleted = localizedLesson ? completedLessonIds.includes(localizedLesson.id) : false;

  useEffect(() => {
    // Initialize speech player
    const player = new SpeechPlayer((state, msg) => {
      setSpeechState(state);
      if (msg) setSpeechNotice(msg);
      if (state === 'idle' && speechState === 'playing') {
        if (localizedLesson) markLessonComplete(localizedLesson.id);
      }
    });
    speechControllerRef.current = player;

    if (startPlayingAudio && localizedLesson) {
      player.speak(localizedLesson.audioScript, localizedLesson.contentLanguage || language, () => {
        markLessonComplete(localizedLesson.id);
      });
    }

    return () => {
      player.stop();
    };
  }, [localizedLesson?.id, language]);

  if (!localizedLesson) return null;

  const handlePlay = () => {
    setSpeechNotice('');
    speechControllerRef.current?.speak(localizedLesson.audioScript, localizedLesson.contentLanguage || language, () => {
      markLessonComplete(localizedLesson.id);
    });
  };

  const handlePause = () => {
    speechControllerRef.current?.pause();
  };

  const handleResume = () => {
    speechControllerRef.current?.resume();
  };

  const handleStop = () => {
    speechControllerRef.current?.stop();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-orange-50 via-white to-blue-50/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                {t.learn.tabs.lessons} {localizedLesson.number}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Clock className="w-3 h-3" />
                <span>{localizedLesson.readTime}</span>
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0A2E65]">
              {localizedLesson.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{localizedLesson.description}</p>
            {localizedLesson.contentLanguage && localizedLesson.contentLanguage !== language && getLegalLocalized(language) && (
              <p role="note" className="mt-2 text-[11px] leading-relaxed bg-amber-50 border border-amber-300 text-amber-950 rounded-lg p-2">
                {getLegalLocalized(language)!.englishOnlyNotice}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              speechControllerRef.current?.stop();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={t.schemes.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Player Controls Bar */}
        <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-bold">
            <Volume2 className="w-4 h-4 text-orange-600 shrink-0" />
            <span>{t.learn.readerAudioNarration} ({localizedLesson.audioDuration})</span>
          </div>

          <div className="flex items-center gap-2">
            {speechState === 'idle' && (
              <button
                onClick={handlePlay}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{t.learn.playAudio}</span>
              </button>
            )}

            {speechState === 'playing' && (
              <>
                <button
                  onClick={handlePause}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>{t.learn.pauseAudio}</span>
                </button>
                <button
                  onClick={handleStop}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>{t.learn.stopAudio}</span>
                </button>
              </>
            )}

            {speechState === 'paused' && (
              <>
                <button
                  onClick={handleResume}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t.learn.resumeAudio}</span>
                </button>
                <button
                  onClick={handleStop}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>{t.learn.stopAudio}</span>
                </button>
              </>
            )}

            {speechState === 'unavailable' && (
              <button
                onClick={handlePlay}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-full text-xs cursor-pointer"
              >
                <span>{t.learn.playAudio}</span>
              </button>
            )}
          </div>
        </div>

        {/* Warning banner if browser has no native TTS voice for this language */}
        {(speechNotice || speechState === 'unavailable') && (
          <div className="px-5 py-2.5 bg-amber-100 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-snug">
              {t.learn.voiceUnavailableNotice || speechNotice}
            </p>
          </div>
        )}

        {/* Scrollable Content Body in Selected Language */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
          {/* Introduction in selected language */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 font-medium text-slate-800 leading-relaxed">
            {localizedLesson.content.introduction}
          </div>

          {/* Sections in selected language */}
          {localizedLesson.content.sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0A2E65]">
                {section.heading}
              </h3>
              <p className="leading-relaxed text-slate-700">{section.body}</p>

              {section.tips && section.tips.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-700" />
                    <span>{t.learn.helpfulTips}</span>
                  </span>
                  <ul className="list-disc pl-5 text-xs text-blue-800 space-y-0.5">
                    {section.tips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {section.warning && (
                <div className="mt-2 p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 flex items-start gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{section.warning}</span>
                </div>
              )}
            </div>
          ))}

          {/* Key Summary Takeaways in selected language */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{t.learn.keyTakeaways}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {localizedLesson.content.summary.map((sum, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  <span>{sum}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            {isCompleted ? `✓ ${t.learn.completed}` : t.learn.allLanguagesNote}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markLessonComplete(localizedLesson.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-[#0A2E65] text-white hover:bg-[#072344]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isCompleted ? t.learn.completed : t.learn.markComplete}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
