import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { TricolorWave } from '../common/TricolorWave';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode } from '../../types';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Globe,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { setActiveTab, language, setLanguage, t, user } = useApp();

  const handleEnterHome = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-gradient-to-b from-slate-100 via-white to-blue-50/40 overflow-hidden">
      {/* Background Indian Tricolor Atmosphere (subtle ambient radial glows) */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-orange-100/50 via-white/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-100/50 via-white/20 to-transparent pointer-events-none" />

      {/* Rounded Mobile-Screen Layout Container matching the reference image */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between transition-all duration-300">
        
        {/* TOP: Indian Tricolor Waves & Ashoka Chakra Crest */}
        <div className="relative w-full overflow-hidden pt-4 pb-1 px-4 flex flex-col items-center bg-gradient-to-b from-orange-50/60 to-white">
          {/* Top Tricolour Ribbon Lines (Saffron - White - Green) */}
          <div className="w-full flex h-2 rounded-full overflow-hidden shadow-2xs mb-4">
            <div className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div className="w-16 bg-white border-x border-slate-200" />
            <div className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600" />
          </div>

          {/* Elegant Top Tricolor Flying Waves SVG */}
          <svg
            viewBox="0 0 400 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-xs h-9 -mt-1 drop-shadow-2xs"
          >
            {/* Saffron Wave */}
            <path
              d="M 10,22 C 70,6 140,36 200,18 C 260,2 330,32 390,16"
              stroke="#EA580C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Green Wave */}
            <path
              d="M 15,32 C 75,16 145,46 205,28 C 265,12 335,42 395,26"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* Quick Language Selector Pill on Top Right */}
          <div className="w-full flex items-center justify-between px-2 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0A2E65] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>National Safety Portal</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-full text-xs font-semibold text-[#0A2E65] border border-slate-200">
              <Globe className="w-3.5 h-3.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-bold text-[#0A2E65] focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CENTER: Official SAHAYINI Logo, Profile Emblem & Typography */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center">
          {/* Centered Large Vector Logo Emblem matching Image 1 */}
          <Logo
            size="2xl"
            layout="vertical"
            showText={true}
            showSubtitle={true}
            showTagline={true}
            className="my-2"
          />

          {/* Core Feature Value Badges */}
          <div className="grid grid-cols-2 gap-2.5 mt-6 w-full text-left">
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 font-semibold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>24x7 Safety SOS (112)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-emerald-900 font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Welfare Schemes</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-amber-50/70 rounded-2xl border border-amber-100 text-xs text-amber-900 font-semibold shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>AI Voice Assistant</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-purple-50/70 rounded-2xl border border-purple-100 text-xs text-purple-900 font-semibold shadow-2xs">
              <BookOpen className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Digital Literacy</span>
            </div>
          </div>

          {/* Enter Home Page CTA Button */}
          <div className="mt-7 w-full flex flex-col items-center gap-2.5">
            <button
              onClick={handleEnterHome}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#0A2E65] via-[#0E3D82] to-[#0A2E65] hover:from-[#072344] hover:to-[#072344] text-white font-extrabold text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{t.getStarted || 'Enter SAHAYINI'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {!user && (
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-1">
                <button
                  onClick={() => setActiveTab('login')}
                  className="hover:text-[#0A2E65] transition underline decoration-slate-300"
                >
                  {t.nav.login}
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab('signup')}
                  className="hover:text-[#0A2E65] transition underline decoration-slate-300"
                >
                  {t.nav.signup}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM: Ashoka Chakra, Indian Monument Skyline & Tricolor Wave */}
        <div className="relative w-full overflow-hidden bg-gradient-to-t from-emerald-50/60 to-white pt-2">
          {/* Central Ashoka Chakra */}
          <div className="w-full flex justify-center mb-1">
            <div className="w-10 h-10 relative text-[#0A2E65] drop-shadow-xs">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="currentColor"
                    strokeWidth="2.4"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Subtle Indian Monument Skyline Silhouette (India Gate, Red Fort, Temple, Qutub) */}
          <div className="w-full flex justify-center opacity-25 pointer-events-none select-none px-4">
            <svg viewBox="0 0 600 70" className="w-full max-w-sm h-12 text-[#0A2E65]" fill="currentColor">
              <path d="M 0,70 L 0,60 L 25,60 L 30,42 L 45,42 L 50,60 L 70,60 L 75,30 L 80,30 L 85,60 L 110,60 L 115,50 L 130,50 L 135,60 L 160,60 L 170,18 L 175,18 L 185,60 L 210,60 L 220,36 L 225,24 L 230,36 L 240,60 L 270,60 L 280,45 L 295,45 L 305,60 L 330,60 L 340,12 L 345,6 L 350,12 L 360,60 L 385,60 L 395,33 L 410,33 L 420,60 L 445,60 L 455,24 L 460,24 L 470,60 L 495,60 L 505,42 L 520,42 L 530,60 L 560,60 L 570,36 L 585,36 L 600,60 L 600,70 Z" />
            </svg>
          </div>

          {/* Bottom Tricolor Wave Ribbon */}
          <div className="w-full h-3 flex">
            <div className="h-full flex-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div className="h-full w-12 bg-white" />
            <div className="h-full flex-1 bg-gradient-to-r from-emerald-500 to-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
