import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode, TextScale } from '../../types';
import {
  SlidersHorizontal,
  Eye,
  Type,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
} from 'lucide-react';

interface AccessibilityQuickPanelProps {
  className?: string;
}

export const AccessibilityQuickPanel: React.FC<AccessibilityQuickPanelProps> = ({
  className = '',
}) => {
  const {
    theme,
    setTheme,
    textScale,
    setTextScale,
    language,
    setLanguage,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  const isHighContrast = theme === 'contrast';

  const toggleHighContrast = () => {
    if (isHighContrast) {
      setTheme('light');
    } else {
      setTheme('contrast');
    }
  };

  const textScales: { key: TextScale; label: string; iconLabel: string }[] = [
    { key: 'normal', label: 'Default', iconLabel: 'A' },
    { key: 'large', label: 'Large', iconLabel: 'A+' },
    { key: 'xlarge', label: 'X-Large', iconLabel: 'A++' },
  ];

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-300 shadow-md'
          : 'bg-slate-50/90 hover:bg-slate-50 border-slate-200/90 shadow-2xs'
      } ${className}`}
      aria-label="Accessibility quick settings"
    >
      {/* Panel Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2.5 text-left select-none transition-colors group cursor-pointer"
        aria-expanded={isExpanded}
        aria-controls="accessibility-controls-content"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`p-1.5 rounded-lg shrink-0 ${
              isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-[#0A2E65] text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span
              className={`text-xs font-bold block truncate leading-tight ${
                isHighContrast ? 'text-yellow-300' : 'text-slate-900'
              }`}
            >
              Accessibility
            </span>
            <span className="text-[10px] text-slate-500 block truncate leading-tight">
              Contrast • Size • Lang
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-slate-600">
          {isHighContrast && (
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-yellow-400 text-black">
              ON
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Panel Body */}
      {isExpanded && (
        <div
          id="accessibility-controls-content"
          className={`p-2.5 pt-0 space-y-2.5 border-t ${
            isHighContrast ? 'border-yellow-400/40' : 'border-slate-200/70'
          }`}
        >
          {/* 1. High Contrast Mode Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="toggle-high-contrast"
                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 cursor-pointer"
              >
                <Eye
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isHighContrast ? 'text-yellow-300' : 'text-emerald-700'
                  }`}
                />
                <span>High Contrast</span>
              </label>

              {/* Styled Switch */}
              <button
                id="toggle-high-contrast"
                role="switch"
                aria-checked={isHighContrast}
                onClick={toggleHighContrast}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isHighContrast ? 'bg-yellow-400' : 'bg-slate-300'
                }`}
                title="Toggle High Contrast mode"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    isHighContrast ? 'translate-x-4 bg-black!' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. Text Size (A / A+ / A++) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <Type className="w-3.5 h-3.5 text-[#0A2E65]" />
                <span>Text Size</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">
                {textScale}
              </span>
            </div>

            <div
              className={`grid grid-cols-3 gap-1 p-0.5 rounded-xl border ${
                isHighContrast
                  ? 'bg-black border-yellow-400'
                  : 'bg-white border-slate-200'
              }`}
              role="radiogroup"
              aria-label="Text scaling options"
            >
              {textScales.map((scale) => {
                const isSelected = textScale === scale.key;
                return (
                  <button
                    key={scale.key}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setTextScale(scale.key)}
                    className={`py-1 px-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? isHighContrast
                          ? 'bg-yellow-400 text-black font-extrabold shadow-xs'
                          : 'bg-[#0A2E65] text-white font-bold shadow-xs'
                        : isHighContrast
                        ? 'text-white hover:text-yellow-300 font-medium'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                    title={`${scale.label} Font Size`}
                  >
                    <span className="block text-xs leading-none font-bold">
                      {scale.iconLabel}
                    </span>
                    <span className="block text-[9px] leading-tight opacity-90 truncate mt-0.5">
                      {scale.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Global Language Switcher */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span>Language (மொழி)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                8 Languages
              </span>
            </div>

            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className={`w-full appearance-none py-1.5 pl-2.5 pr-7 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-hidden ${
                  isHighContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-white border-slate-200 text-[#0A2E65] hover:border-slate-300'
                }`}
                aria-label="Select website language translation"
              >
                {LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="text-slate-900 bg-white py-1"
                  >
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
