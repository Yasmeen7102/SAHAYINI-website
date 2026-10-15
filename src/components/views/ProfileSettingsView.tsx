import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode, ThemeMode, TextScale } from '../../types';
import {
  User,
  Settings,
  Globe,
  Sun,
  Moon,
  Eye,
  Type,
  Bookmark,
  Database,
  Trash2,
  ShieldCheck,
  Check,
  MapPin,
  Phone,
  Briefcase,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const ProfileSettingsView: React.FC = () => {
  const {
    user,
    logoutUser,
    language,
    setLanguage,
    theme,
    setTheme,
    textScale,
    setTextScale,
    savedSchemeIds,
    completedLessonIds,
    setActiveTab,
    resetAllData,
    t,
  } = useApp();

  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    if (confirm('Are you sure you want to reset demo data and clear local cache?')) {
      resetAllData();
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
            {t.nav.profile} & {t.nav.settings}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal preferences, saved bookmarks, language, and accessibility display.
          </p>
        </div>
        <Logo size="md" showText={false} className="shrink-0" />
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0A2E65] text-white flex items-center justify-center font-black text-2xl uppercase shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="capitalize">{user.role}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{user.state}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-mono mt-1">
                  {user.emailOrPhone}
                </p>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-full border border-red-200 transition-colors self-start sm:self-center cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Guest User</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are exploring SAHAYINI in guest mode. Sign in to sync your saved schemes and progress across sessions.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-5 py-2 bg-[#0A2E65] text-white font-bold text-xs rounded-full shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="px-5 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-200"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#0A2E65]" />
          <h2 className="text-base font-bold text-slate-900">
            Platform Language / மொழி தேர்வு
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Choose from 8 Indian languages supported natively across SAHAYINI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                language === lang.code
                  ? 'bg-blue-50/80 border-[#0A2E65] text-[#0A2E65] font-bold shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-sm block">{lang.nativeName}</span>
              <span className="text-[11px] text-slate-400 font-normal">({lang.name})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance & Accessibility */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#0A2E65]" />
          <h2 className="text-base font-bold text-slate-900">
            Appearance & Accessibility Settings
          </h2>
        </div>

        {/* Theme mode */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">Display Theme</span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span className="text-xs">Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-900 border-indigo-700 text-white font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
              <span className="text-xs">Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('contrast')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'contrast'
                  ? 'bg-black border-yellow-400 text-yellow-300 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Eye className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs">High Contrast</span>
            </button>
          </div>
        </div>

        {/* Text Scaling */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">Font Size (Accessibility)</span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setTextScale('normal')}
              className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                textScale === 'normal'
                  ? 'bg-blue-50 border-[#0A2E65] text-[#0A2E65] font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Default (A)
            </button>

            <button
              onClick={() => setTextScale('large')}
              className={`p-2.5 rounded-xl border text-sm font-medium cursor-pointer ${
                textScale === 'large'
                  ? 'bg-blue-50 border-[#0A2E65] text-[#0A2E65] font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Large (A+)
            </button>

            <button
              onClick={() => setTextScale('xlarge')}
              className={`p-2.5 rounded-xl border text-base font-medium cursor-pointer ${
                textScale === 'xlarge'
                  ? 'bg-blue-50 border-[#0A2E65] text-[#0A2E65] font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Extra Large (A++)
            </button>
          </div>
        </div>
      </div>

      {/* Saved Bookmarks & Data */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Saved Data & Offline Cache
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Saved Government Schemes</span>
              <p className="text-slate-500 mt-0.5">{savedSchemeIds.length} schemes bookmarked</p>
            </div>
            <button
              onClick={() => setActiveTab('schemes')}
              className="text-[#0A2E65] font-bold hover:underline"
            >
              View →
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Completed Lessons</span>
              <p className="text-slate-500 mt-0.5">{completedLessonIds.length} modules completed</p>
            </div>
            <button
              onClick={() => setActiveTab('learn')}
              className="text-orange-600 font-bold hover:underline"
            >
              Learn →
            </button>
          </div>
        </div>

        {/* Clear Cache Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Local browser storage holds cached lessons and contacts for offline use.
          </span>
          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold rounded-full transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{cacheCleared ? 'Data Cleared!' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Privacy Pledge */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">SAHAYINI Privacy & Data Integrity Pledge</p>
          <p className="text-emerald-800 leading-relaxed">
            Your emergency contacts, GPS location logs, and bookmarked schemes are never sold or transmitted to commercial third parties. All emergency calls and geolocation sharing are strictly user-initiated.
          </p>
        </div>
      </div>
    </div>
  );
};
