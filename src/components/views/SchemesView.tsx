import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMES_DATA, getLocalizedScheme } from '../../data/schemesData';
import { SchemeItem } from '../../types';
import { SchemeDetailModal } from '../modals/SchemeDetailModal';
import { OfflineSafetyKitModal } from '../common/OfflineSafetyKitModal';
import { Logo } from '../common/Logo';
import {
  Landmark,
  Search,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Shield,
  X,
  Filter,
  HardDrive,
  WifiOff,
  Zap,
} from 'lucide-react';

export const SchemesView: React.FC = () => {
  const { savedSchemeIds, toggleSaveScheme, language, isOffline, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Schemes');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeItem | null>(null);
  const [showOfflineKitModal, setShowOfflineKitModal] = useState(false);

  const filterOptions = [
    'All Schemes',
    'Central Government',
    'Tamil Nadu Government',
    'Education',
    'Scholarships',
    'Women',
    'Employment',
    'Health',
    'Agriculture',
    'Housing',
    'Financial Assistance',
  ];

  // Filtering logic
  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATA.filter((scheme) => {
      // Saved filter
      if (showSavedOnly && !savedSchemeIds.includes(scheme.id)) {
        return false;
      }

      // Category / Tag filter
      if (selectedFilter !== 'All Schemes') {
        const matchesTag = scheme.tags.some(
          (t) => t.toLowerCase() === selectedFilter.toLowerCase()
        );
        const matchesCat =
          selectedFilter.toLowerCase() === scheme.category.toLowerCase() ||
          (selectedFilter === 'Scholarships' && scheme.category === 'scholarship') ||
          (selectedFilter === 'Women' && scheme.category === 'women') ||
          (selectedFilter === 'Education' && scheme.category === 'education') ||
          (selectedFilter === 'Health' && scheme.category === 'health') ||
          (selectedFilter === 'Agriculture' && scheme.category === 'agriculture') ||
          (selectedFilter === 'Tamil Nadu Government' && scheme.stateName === 'Tamil Nadu') ||
          (selectedFilter === 'Central Government' && scheme.tags.includes('Central Government'));

        if (!matchesTag && !matchesCat) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = scheme.title.toLowerCase().includes(query);
        const inSummary = scheme.summary.toLowerCase().includes(query);
        const inBenefits = scheme.benefits.toLowerCase().includes(query);
        const inTags = scheme.tags.some((t) => t.toLowerCase().includes(query));
        return inTitle || inSummary || inBenefits || inTags;
      }

      return true;
    });
  }, [searchQuery, selectedFilter, showSavedOnly, savedSchemeIds]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedFilter('All Schemes');
    setShowSavedOnly(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner Header matching Image 6 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
            <Landmark className="w-7 h-7" />
          </div>
          <Logo size="md" showText={false} className="shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
              {t.schemes.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {t.schemes.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          {/* Offline Ready Indicator / Kit Opener */}
          <button
            onClick={() => setShowOfflineKitModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            title="All 15 schemes are cached locally on your device for low-connectivity rural access"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
            <span>15 Schemes Cached Offline</span>
          </button>

          {(selectedFilter !== 'All Schemes' || searchQuery || showSavedOnly) && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.schemes.clearFilters}</span>
            </button>
          )}

          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
              showSavedOnly
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span>
              {t.schemes.savedSchemes} ({savedSchemeIds.length})
            </span>
          </button>
        </div>
      </div>

      {/* Offline Status Sub-banner */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Low-Connectivity / Offline Mode Active:</strong> You are viewing locally cached welfare schemes. Search, filter, required documents checklist, and official application protocols are fully functional offline.
            </span>
          </div>
          <button
            onClick={() => setShowOfflineKitModal(true)}
            className="text-amber-800 underline font-bold whitespace-nowrap cursor-pointer hover:text-amber-950"
          >
            Offline Kit
          </button>
        </div>
      )}

      {/* Search Input Bar matching Image 6 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.schemes.searchPlaceholder}
          className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-full shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Pills matching Image 6 */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((filter) => {
          const isActive = selectedFilter === filter && !showSavedOnly;
          const filterLabel = t.schemes.filters?.[filter] || filter;
          return (
            <button
              key={filter}
              onClick={() => {
                setSelectedFilter(filter);
                setShowSavedOnly(false);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filterLabel}
            </button>
          );
        })}
      </div>

      {/* Scheme Cards Grid matching Image 6 (3 columns) */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <p className="text-base font-bold text-slate-800">{t.schemes.noSchemesFound}</p>
          <p className="text-xs text-slate-500">{t.schemes.noSchemesDesc}</p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-[#0A2E65] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#072344] transition-colors"
          >
            {t.schemes.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => {
            const isSaved = savedSchemeIds.includes(scheme.id);
            const localized = getLocalizedScheme(scheme, language);
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category Pills matching Image 6 */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {scheme.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Zap className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
                      <span>Offline Ready</span>
                    </span>
                  </div>

                  {/* Title in selected language */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {localized.title}
                  </h3>

                  {/* Brief summary in selected language */}
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {localized.summary}
                  </p>

                  {/* Details Highlights matching Image 6 */}
                  <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-800 shrink-0">🛡️ {t.schemes.benefitsLabel}:</span>
                      <span className="text-slate-600 line-clamp-1">{localized.benefits}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-800 shrink-0">👤 {t.schemes.eligibilityLabel}:</span>
                      <span className="text-slate-600 line-clamp-1">{localized.eligibility[0]}</span>
                    </div>

                    <div className="flex items-start gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600 shrink-0">🏛️ {t.schemes.sourceLabel}:</span>
                      <span className="truncate">{scheme.sourceName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions matching Image 6 */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="flex-1 py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t.schemes.viewDetails} →</span>
                  </button>

                  <button
                    onClick={() => toggleSaveScheme(scheme.id)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200'
                    }`}
                    title={isSaved ? 'Saved' : 'Save Scheme'}
                    aria-label="Save Scheme"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Disclaimer Box matching Image 6 */}
      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-emerald-950 text-xs leading-relaxed flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Official Transparency Disclaimer: </span>
          {t.schemes.disclaimer}
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          isSaved={savedSchemeIds.includes(selectedScheme.id)}
          onToggleSave={() => toggleSaveScheme(selectedScheme.id)}
        />
      )}

      {/* Offline Safety & Schemes Kit Modal */}
      <OfflineSafetyKitModal
        isOpen={showOfflineKitModal}
        onClose={() => setShowOfflineKitModal(false)}
      />
    </div>
  );
};
