import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, LanguageCode } from '../../types';
import { getBestVoiceForLanguage } from '../../utils/speechUtils';
import { LOCALIZED_VOICE_ASSISTANT } from '../../i18n/translations';
import { offlineStorage } from '../../services/offlineStorage';
import { getExtraStrings } from '../../i18n/extraStrings';
import {
  analyzeScamMessage,
  buildScamSpeech,
  formatScamChatReply,
  looksLikeSuspiciousMessage,
} from '../../services/scamCheck';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  User as UserIcon,
  Play,
  Square,
  XCircle,
  Lightbulb,
  CornerDownLeft,
  X,
  AlertCircle,
  HardDrive,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const AskSahayiniView: React.FC = () => {
  const { language, isOffline, t } = useApp();
  const extra = getExtraStrings(language);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'user',
      text: t.ask.initialUserMsg,
      timestamp: '10:24 AM',
    },
    {
      id: 'init-2',
      sender: 'sahayini',
      text: t.ask.initialBotMsg,
      timestamp: '10:24 AM',
      source: 'knowledge_engine',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string>('');
  const [readingMessage, setReadingMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync initial message when language changes if no custom user message was sent
  useEffect(() => {
    setMessages((prev) => {
      const hasCustomMessages = prev.some((m) => !m.id.startsWith('init-'));
      if (!hasCustomMessages) {
        return [
          {
            id: 'init-1',
            sender: 'user',
            text: t.ask.initialUserMsg,
            timestamp: '10:24 AM',
          },
          {
            id: 'init-2',
            sender: 'sahayini',
            text: t.ask.initialBotMsg,
            timestamp: '10:24 AM',
            source: 'knowledge_engine',
          },
        ];
      }
      return prev;
    });
  }, [language, t.ask.initialUserMsg, t.ask.initialBotMsg]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Set language code mapping
      const langMap: Record<string, string> = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        ml: 'ml-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTranscriptPreview(transcript);
        setInputValue(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceStatus('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceStatus === 'listening') {
          setVoiceStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [language]);

  const startVoiceInput = () => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (recognitionRef.current) {
      try {
        setTranscriptPreview('');
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition already active:', err);
      }
    } else {
      setVoiceNotice('Speech recognition is not supported in this browser. Please type your question in the text box below.');
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setVoiceStatus('idle');
  };

  const cancelVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    window.speechSynthesis?.cancel();
    setIsListening(false);
    setIsSpeaking(false);
    setVoiceStatus('idle');
    setTranscriptPreview('');
  };

  // Text-To-Speech for responses
  const handleSpeakText = (text: string, msgId: string, speakLang: LanguageCode = language) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking && activeSpeechMsgId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechMsgId(null);
      setVoiceStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();
    setVoiceNotice('');

    const voiceInfo = getBestVoiceForLanguage(speakLang);

    // Do not silently read another language's voice as if it matched the selected language.
    if (!voiceInfo.isNativeAvailable && speakLang !== 'en') {
      setVoiceNotice(t.ask.voiceNotInstalled || t.learn.voiceUnavailableNotice);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceInfo.langLocale;
    if (voiceInfo.voice) {
      utterance.voice = voiceInfo.voice;
    }
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeechMsgId(msgId);
      setVoiceStatus('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechMsgId(null);
      setVoiceStatus('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechMsgId(null);
      setVoiceStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const nowLabel = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSendMessage = async (textToSend?: string, opts?: { retry?: boolean }) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    // On retry the question is already on screen, so don't add it a second time.
    if (!opts?.retry) {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text,
        timestamp: nowLabel(),
      };
      setMessages((prev) => [...prev, userMsg]);
    }
    setInputValue('');
    setTranscriptPreview('');
    setIsSending(true);
    setVoiceStatus('processing');

    const pushBot = (msg: Omit<ChatMessage, 'id' | 'sender' | 'timestamp'>): string => {
      const id = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id, sender: 'sahayini', timestamp: nowLabel(), ...msg }]);
      return id;
    };

    // A pasted suspicious message (not a question): analyse it and answer in text AND voice.
    // Anything phrased as a question goes to the AI chat below.
    if (!/[?？]/.test(text) && looksLikeSuspiciousMessage(text)) {
      try {
        const { result, localReason } = await analyzeScamMessage(text, language);
        const replyText = formatScamChatReply(result, language, localReason);
        const id = pushBot({
          text: replyText,
          source:
            result.source === 'ai' ? 'gemini' : localReason === 'offline' ? 'offline_cache' : 'local_fallback',
          fallbackReason:
            result.source === 'ai' ? undefined : localReason === 'offline' ? 'offline' : 'server_unreachable',
        });
        const speech = buildScamSpeech(result, language);
        setVoiceStatus('idle');
        handleSpeakText(speech.text, id, speech.lang);
      } finally {
        setIsSending(false);
        setVoiceStatus((v) => (v === 'processing' ? 'idle' : v));
      }
      return;
    }

    // 1) Device has no connection at all: answer ONLY from on-device knowledge and say so.
    //    (navigator.onLine is read at send time so it can never be stale.)
    const answerOffline = () => {
      const result = offlineStorage.getOfflineChatResult(text, language);
      if (result.matched) {
        const id = pushBot({ text: result.text, source: 'offline_cache', fallbackReason: 'offline' });
        handleSpeakText(result.text, id, language);
      } else {
        // No suitable saved answer: be honest instead of pretending to answer.
        const id = pushBot({ text: extra.chatOfflineNoAnswer, source: 'offline_no_match', fallbackReason: 'offline' });
        handleSpeakText(extra.chatOfflineNoAnswer, id, language);
      }
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      answerOffline();
      setVoiceStatus('idle');
      setIsSending(false);
      return;
    }

    // 2) Device says it is online: ask the real AI service (with a timeout).
    //    Only a genuine AI reply is shown as an answer. Any failure becomes a clear error with Retry.
    const pushError = (
      errorKind: 'not_configured' | 'unsupported_model' | 'rate_limit' | 'busy' | 'network',
      errorDetail?: string
    ) => {
      const msg =
        errorKind === 'not_configured'
          ? extra.chatErrNotConfigured
          : errorKind === 'unsupported_model'
          ? extra.chatErrModel
          : errorKind === 'rate_limit'
          ? extra.chatErrRateLimit
          : errorKind === 'network'
          ? extra.chatErrNetwork
          : extra.chatErrBusy;
      pushBot({ text: msg, source: 'error', errorKind, errorDetail, retryText: text });
    };

    // Only real AI answers are sent back as history (never errors, offline or built-in text).
    let history = messages.filter(
      (m) => !m.id.startsWith('init-') && (m.sender === 'user' || m.source === 'gemini')
    );
    if (opts?.retry && history.length && history[history.length - 1].sender === 'user' && history[history.length - 1].text === text) {
      history = history.slice(0, -1);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: history.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
        signal: controller.signal,
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && data && data.source === 'gemini' && typeof data.reply === 'string' && data.reply.trim()) {
        // Genuine live AI response: keep it visible as text and read it aloud.
        const id = pushBot({ text: data.reply, source: 'gemini' });
        handleSpeakText(data.reply, id, language);
      } else {
        const code: string = (data && data.error) || '';
        if (code === 'no_api_key' || code === 'invalid_api_key') {
          pushError('not_configured', data?.message);
        } else if (code === 'model_unavailable') {
          pushError('unsupported_model', data?.message);
        } else if (code === 'quota' || res.status === 429) {
          pushError('rate_limit');
        } else {
          pushError('busy');
        }
      }
      setVoiceStatus('idle');
    } catch (err) {
      console.warn('Chat request failed:', err);

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // Connection dropped while we were waiting.
        answerOffline();
      } else if ((err as { name?: string })?.name === 'AbortError') {
        pushError('busy');
      } else {
        // The browser could not reach our server at all.
        pushError('network');
      }
      setVoiceStatus('idle');
    } finally {
      clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  // Retry a failed question without duplicating it in the conversation.
  const handleRetry = (errorMsgId: string, question: string) => {
    if (isSending) return;
    setMessages((prev) => prev.filter((m) => m.id !== errorMsgId));
    handleSendMessage(question, { retry: true });
  };

  const suggestionPills = t.ask.suggestions || [
    'Government schemes',
    'Eligibility criteria',
    'Application process',
    'How to report cyber fraud?',
    'What is Digital Arrest scam?',
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Columns: Main Chat Area matching Image 3 */}
        <div className="lg:col-span-8 flex flex-col h-[78vh] bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Header matching Image 3 */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              {/* Official SAHAYINI logo as the chatbot avatar */}
              <div
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-xs shrink-0 flex items-center justify-center"
                style={{ backgroundColor: '#ffffff' }}
              >
                <img
                  src="/sahayini-emblem.png"
                  alt="SAHAYINI"
                  className="w-9 h-9 object-contain"
                  draggable={false}
                />
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#0A2E65] leading-tight">
                  {t.ask.title}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {t.ask.subtitle}
                </p>
              </div>
            </div>

            {/* Sparkle banner pill matching Image 3 */}
            <div className="mt-3 px-3 py-1.5 bg-blue-50/70 rounded-full border border-blue-100 flex items-center gap-1.5 text-[11px] font-semibold text-[#0A2E65]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{t.ask.sparkleBanner}</span>
            </div>
          </div>

          {/* Honest offline notice: answers come only from this device */}
          {isOffline && (
            <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
              <HardDrive className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{extra.chatOfflineBanner}</span>
            </div>
          )}

          {/* Voice Notification Banner */}
          {voiceNotice && (
            <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-2.5 text-xs text-amber-900 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{voiceNotice}</span>
              </div>
              <button
                onClick={() => setVoiceNotice('')}
                className="text-amber-700 hover:text-amber-950 font-bold px-1.5 text-sm cursor-pointer"
                aria-label="Dismiss notice"
              >
                ✕
              </button>
            </div>
          )}

          {/* Scrollable Messages Stream matching Image 3 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* User or Bot Avatar */}
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-2xs mt-1">
                      {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-[#0A2E65] text-white flex items-center justify-center text-xs font-bold">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full border border-emerald-300 flex items-center justify-center"
                          style={{ backgroundColor: '#ffffff' }}
                        >
                          <img
                            src="/sahayini-emblem.png"
                            alt="SAHAYINI"
                            className="w-6 h-6 object-contain"
                            draggable={false}
                          />
                        </div>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl shadow-2xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        isUser
                          ? 'bg-[#0A2E65] text-white rounded-tr-none font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal'
                      }`}
                    >
                      {/* Distinct Source Badge for SAHAYINI responses */}
                      {!isUser && (
                        <div className="mb-2 pb-1.5 border-b border-slate-100 space-y-1.5">
                          {msg.source === 'gemini' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              <Sparkles className="w-2.5 h-2.5 text-blue-700" />
                              <span>{extra.chatLiveBadge}</span>
                            </span>
                          ) : msg.source === 'offline_cache' || msg.source === 'offline_no_match' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              <HardDrive className="w-2.5 h-2.5 text-amber-700" />
                              <span>{extra.chatOfflineBadge}</span>
                            </span>
                          ) : msg.source === 'error' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-300">
                              <AlertCircle className="w-2.5 h-2.5 text-red-700" />
                              <span>{extra.chatErrBadge}</span>
                            </span>
                          ) : msg.source === 'local_fallback' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-900 border border-orange-300">
                              <AlertCircle className="w-2.5 h-2.5 text-orange-700" />
                              <span>{extra.chatFallbackBadge}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                              <span>Verified Knowledge Base</span>
                            </span>
                          )}
                          {msg.source === 'local_fallback' && msg.fallbackReason !== 'server_unreachable' && (
                            <p className="text-[11px] text-orange-900 leading-snug">{extra.chatAiErrorNote}</p>
                          )}
                        </div>
                      )}

                      {msg.text}

                      {/* Technical detail for server configuration problems (never contains secrets) */}
                      {msg.source === 'error' && (msg.errorKind === 'not_configured' || msg.errorKind === 'unsupported_model') && msg.errorDetail && (
                        <p className="mt-2 text-[11px] text-slate-500 leading-snug">{msg.errorDetail}</p>
                      )}

                      {/* Retry for failed AI requests */}
                      {msg.source === 'error' && msg.retryText && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <button
                            onClick={() => handleRetry(msg.id, msg.retryText as string)}
                            disabled={isSending}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#0A2E65] text-white hover:bg-[#072344] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{extra.chatRetry}</span>
                          </button>
                        </div>
                      )}

                      {/* Listen and Read pill buttons on SAHAYINI responses matching Image 3 */}
                      {!isUser && msg.source !== 'error' && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => handleSpeakText(msg.text, msg.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              isSpeaking && activeSpeechMsgId === msg.id
                                ? 'bg-emerald-600 text-white shadow-2xs animate-pulse'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {isSpeaking && activeSpeechMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>{t.learn.stopAudio || 'Stop'}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{t.learn.listen}</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setReadingMessage(msg.text)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0A2E65] hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{t.learn.read}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-10">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-10">
                <span className="w-2 h-2 rounded-full bg-[#0A2E65] animate-ping" />
                <span>{t.ask.preparingAnswer}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Pills matching Image 3 */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestionPills.map((pill) => (
              <button
                key={pill}
                onClick={() => handleSendMessage(pill)}
                className="px-3 py-1 rounded-full text-xs font-medium text-[#0A2E65] bg-blue-50/70 hover:bg-blue-100 border border-blue-150 shrink-0 transition-colors cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Editable Live Speech Transcript Box (when mic active) */}
          {transcriptPreview && (
            <div className="p-2.5 bg-emerald-50 border-t border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="font-bold">{t.ask.heardPrefix} </span>
                <span className="italic">"{transcriptPreview}"</span>
              </div>
              <button
                onClick={() => handleSendMessage(transcriptPreview)}
                className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[11px] font-bold shrink-0 cursor-pointer"
              >
                {t.ask.sendNow}
              </button>
            </div>
          )}

          {/* Input Bar matching Image 3 */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              maxLength={1500}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={t.ask.typePlaceholder}
              className="flex-1 py-2.5 px-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65] transition-all"
            />

            {/* Green Microphone Button matching Image 3 */}
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-2.5 rounded-full text-white shadow-xs transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
              title={isListening ? 'Stop recording' : 'Tap to speak'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Blue Send Arrow Button matching Image 3 */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isSending}
              className={`p-2.5 rounded-full text-white shadow-xs transition-all cursor-pointer ${
                inputValue.trim() && !isSending
                  ? 'bg-[#0A2E65] hover:bg-[#072344]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right 4 Columns: Voice Assistant Panel matching Image 3 */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#0A2E65]">
                {LOCALIZED_VOICE_ASSISTANT[language]?.title || 'Voice Assistant'}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {LOCALIZED_VOICE_ASSISTANT[language]?.subtitle || 'Hands-free audio companion in your language'}
              </p>
            </div>

            {/* Voice Avatar with Animated Ripples matching Image 3 */}
            <div className="py-6 flex flex-col items-center text-center">
              <div className="relative mb-3">
                {/* Outer pulsing ring when listening or speaking */}
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-emerald-100 ring-8 ring-emerald-200 animate-pulse'
                      : isSpeaking
                      ? 'bg-blue-100 ring-8 ring-blue-200 animate-pulse'
                      : 'bg-slate-100'
                  }`}
                >
                  {/* Big Green Mic circle matching Image 3 */}
                  <button
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Mic className="w-9 h-9 fill-white" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">
                {t.ask.tapToSpeak}
              </h3>
              <p className="text-xs text-slate-500">
                {t.ask.askInYourLanguage}
              </p>
            </div>

            {/* Status indicators matching Image 3 */}
            <div className="space-y-2 py-3 border-y border-slate-100">
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                  voiceStatus === 'listening'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-400'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.ask.listening}</span>
              </div>

              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                  voiceStatus === 'processing'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                    : 'text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.ask.processing}</span>
              </div>

              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                  voiceStatus === 'speaking'
                    ? 'bg-blue-50 text-[#0A2E65] border border-blue-200'
                    : 'text-slate-400'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.ask.speaking}</span>
              </div>
            </div>

            {/* Voice Controls: Start, Stop, Cancel matching Image 3 */}
            <div className="pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t.ask.voiceControlsLabel}
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  onClick={startVoiceInput}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-emerald-700 text-emerald-700" />
                  <span>{t.ask.start}</span>
                </button>

                <button
                  onClick={stopVoiceInput}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-slate-700 text-slate-700" />
                  <span>{t.ask.stop}</span>
                </button>

                <button
                  onClick={cancelVoice}
                  className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>{t.ask.cancel}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Helpful Note Card matching Image 3 */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px]">{t.ask.optionsNote}</p>
          </div>
        </div>
      </div>

      {/* Accessible Reading Modal for Message Content */}
      {readingMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0A2E65]" />
                <h3 className="text-base font-bold text-[#0A2E65]">
                  {LOCALIZED_VOICE_ASSISTANT[language]?.readModalTitle || 'Message Details'}
                </h3>
              </div>
              <button
                onClick={() => setReadingMessage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close message viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {readingMessage}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setReadingMessage(null)}
                className="px-5 py-2 bg-[#0A2E65] text-white text-xs font-bold rounded-full hover:bg-[#072344] transition-colors cursor-pointer"
              >
                {t.schemes.closeBtn || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
