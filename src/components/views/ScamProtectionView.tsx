import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { getExtraStrings } from '../../i18n/extraStrings';
import { getScamPageStrings } from '../../i18n/scamStrings';
import { useExclusiveSpeech } from '../../hooks/useExclusiveSpeech';
import {
  analyzeScamMessage,
  buildScamSpeech,
  ScamAnalysisResult,
  LocalReason,
} from '../../services/scamCheck';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Info,
} from 'lucide-react';

export const ScamProtectionView: React.FC = () => {
  const { t, language } = useApp();
  const extra = getExtraStrings(language);
  const sp = getScamPageStrings(language);
  const speech = useExclusiveSpeech();

  const [inputContent, setInputContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [localReason, setLocalReason] = useState<LocalReason>(null);

  const [expandedScamId, setExpandedScamId] = useState<string | null>('digital-arrest');

  const sampleScams = [
    'Dear Customer, Your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately on 9812345678.',
    'Congratulations! You have won ₹25,00,000 in KBC Lucky Draw. Click bit.ly/claim-prize to provide bank details.',
    'Your SBI YONO account has been suspended. Update your PAN card and Aadhaar immediately at sbi-kyc-update.apk.',
  ];

  const speakResult = (r: ScamAnalysisResult) => {
    const { text, lang } = buildScamSpeech(r, language);
    speech.speak(text, lang, t.ask?.voiceNotInstalled || t.learn?.voiceUnavailableNotice);
  };

  const handleAnalyze = async () => {
    if (!inputContent.trim() || analyzing) return;

    // Stop any audio from a previous analysis before starting a new one.
    speech.stop();
    setAnalyzing(true);
    setAnalysisResult(null);
    setLocalReason(null);

    const { result, localReason: reason } = await analyzeScamMessage(inputContent, language);

    setLocalReason(reason);
    setAnalysisResult(result);
    setAnalyzing(false);
    // Read the analysis aloud automatically (the Replay button works if the browser blocks autoplay).
    speakResult(result);
  };

  const scamPlaybooks = sp.lessons;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
            {t.scam.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.scam.subtitle}
          </p>
        </div>
        <Logo size="md" showText={false} className="shrink-0" />
      </div>

      {/* 1. Message & Link Risk Checker Tool */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.scam.analyzerTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.scam.analyzerDesc}
            </p>
          </div>
        </div>

        <div>
          <textarea
            rows={4}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder={t.scam.textareaPlaceholder}
            className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65] transition-all"
          />
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.scam.trySample}
          </span>
          {sampleScams.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setInputContent(sample)}
              className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors truncate max-w-[200px] cursor-pointer"
            >
              {sp.sample.replace('{n}', String(idx + 1))}
            </button>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!inputContent.trim() || analyzing}
          className={`w-full py-3 rounded-full text-xs sm:text-sm font-bold text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
            inputContent.trim() && !analyzing
              ? 'bg-[#0A2E65] hover:bg-[#072344]'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {analyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{t.scam.analyzingBtn}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{t.scam.analyzeBtn}</span>
            </>
          )}
        </button>

        {/* Results Card */}
        <div aria-live="polite">
          {analysisResult && (
            <div
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                analysisResult.riskScore === 'CRITICAL' || analysisResult.riskScore === 'HIGH'
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : analysisResult.riskScore === 'MEDIUM'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-sky-50 border-sky-300 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Risk Evaluation Verdict
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                    analysisResult.riskScore === 'CRITICAL' || analysisResult.riskScore === 'HIGH'
                      ? 'bg-red-700 text-white'
                      : analysisResult.riskScore === 'MEDIUM'
                      ? 'bg-amber-700 text-white'
                      : 'bg-sky-700 text-white'
                  }`}
                >
                  {language === 'en'
                    ? `${extra.scamRiskWord[analysisResult.riskScore]} risk`
                    : extra.scamRiskWord[analysisResult.riskScore]}
                </span>
              </div>

              {/* How the result was produced */}
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    analysisResult.source === 'ai'
                      ? 'bg-blue-50 text-blue-900 border-blue-300'
                      : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {analysisResult.source === 'ai' ? (
                    <Sparkles className="w-2.5 h-2.5" />
                  ) : (
                    <ShieldCheck className="w-2.5 h-2.5" />
                  )}
                  {analysisResult.source === 'ai' ? extra.scamAiBadge : extra.scamLocalBadge}
                </span>
              </div>

              {analysisResult.source === 'local' && localReason && (
                <p className="text-xs leading-relaxed text-slate-800 bg-white/70 border border-slate-200 rounded-xl p-2.5">
                  {extra.scamLocalNote}
                </p>
              )}

              {/* Audio controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {speech.state === 'playing' ? (
                  <button
                    onClick={speech.stop}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>{extra.scamStopAudio}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => speakResult(analysisResult)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{extra.scamReplay}</span>
                  </button>
                )}
                {speech.state === 'playing' && (
                  <span className="text-[11px] font-semibold text-slate-700 animate-pulse">
                    {extra.scamListen}…
                  </span>
                )}
              </div>

              {speech.notice && (
                <p className="text-xs leading-relaxed text-amber-950 bg-amber-50 border border-amber-300 rounded-xl p-2.5">
                  {speech.notice}
                </p>
              )}

              {/* What this means */}
              <div className="space-y-1 pt-2 border-t border-black/10">
                <span className="text-xs font-bold block">{extra.scamMeaning}</span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {analysisResult.explanation}
                </p>
              </div>

              {/* Suspicious signs */}
              <div className="space-y-1.5 pt-2 border-t border-black/10">
                <span className="text-xs font-bold block">{extra.scamSigns}</span>
                {analysisResult.flags.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {analysisResult.flags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs leading-relaxed">{extra.scamNoSigns}</p>
                )}
              </div>

              {/* Recommended actions */}
              {analysisResult.safetySteps && analysisResult.safetySteps.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-black/10">
                  <span className="text-xs font-bold block">{extra.scamActions}</span>
                  <ul className="space-y-1 text-xs">
                    {analysisResult.safetySteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Uncertainty */}
              <div className="flex items-start gap-2 pt-2 border-t border-black/10 text-[11px] leading-relaxed text-slate-800">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-700" />
                <p>{extra.scamUncertainty}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Official Cyber Crime Reporting Hub */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0A2E65] rounded-3xl p-6 sm:p-7 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 bg-white/20 text-blue-100 text-[11px] font-bold rounded-full uppercase tracking-wider">
              {sp.portalsBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              {t.scam.reportCybercrime}
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
              {t.scam.goldenHourNotice}
            </p>
          </div>

          <a
            href="tel:1930"
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-full shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.scam.dial1930Btn}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 flex items-center justify-between transition-colors"
          >
            <div>
              <p className="font-bold">{t.scam.nationalPortal.split(' - ')[1] ?? t.scam.nationalPortal}</p>
              <p className="text-[11px] text-blue-200">cybercrime.gov.in</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-300" />
          </a>

          <a
            href="https://sancharsaathi.gov.in/sfc/"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 flex items-center justify-between transition-colors"
          >
            <div>
              <p className="font-bold">{t.scam.chakshuPortal.split(' - ')[0]}</p>
              <p className="text-[11px] text-blue-200">{t.scam.chakshuPortal.split(' - ')[1] ?? ''}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-300" />
          </a>
        </div>
      </div>

      {/* 3. Common Scam Encyclopedia */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          {t.scam.commonScams}
        </h2>
        <p className="text-xs text-slate-500">
          {t.scam.commonScamsDesc}
        </p>

        <div className="space-y-3">
          {scamPlaybooks.map((scam) => {
            const isExpanded = expandedScamId === scam.id;
            return (
              <div
                key={scam.id}
                className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedScamId(isExpanded ? null : scam.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {scam.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {scam.summary}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white border-t border-slate-100 space-y-3 text-xs leading-relaxed text-slate-700">
                    <p>{scam.details}</p>
                    <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 font-medium flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{scam.warning}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
