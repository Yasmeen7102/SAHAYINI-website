import React from 'react';
import { SchemeItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { getLocalizedScheme } from '../../data/schemesData';
import {
  X,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  FileText,
  Users,
  Gift,
  HelpCircle,
  Building,
} from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: SchemeItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const { language, t } = useApp();

  if (!scheme) return null;

  const localized = getLocalizedScheme(scheme, language);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-50/50 via-white to-blue-50/40">
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {scheme.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0A2E65] leading-tight">
              {localized.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.schemes.sourceLabel}: {scheme.sourceName}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onToggleSave}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
              }`}
              title={isSaved ? 'Saved' : 'Save Scheme'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Overview */}
          <div>
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>{t.schemes.modalOverview}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {localized.summary}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Gift className="w-4 h-4 text-orange-600" />
              <span>{t.schemes.modalBenefits}</span>
            </h3>
            <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 text-slate-700 leading-relaxed">
              {localized.benefits}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{t.schemes.modalEligibility}</span>
            </h3>
            <ul className="space-y-2">
              {localized.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents Required */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>{t.schemes.modalDocs}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {localized.documentsRequired.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Steps */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>{t.schemes.modalSteps}</span>
            </h3>
            <ol className="space-y-2.5">
              {localized.applicationProcess.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-[11px] text-amber-800 leading-snug">
            {t.schemes.modalWarning}
          </div>
        </div>

        {/* Modal Footer with External Link */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            {t.schemes.officialSource}: <span className="font-mono text-slate-700">{scheme.officialUrl}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t.schemes.closeBtn}
            </button>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{t.schemes.visitPortal}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
