import React from 'react';
import { Camera, ImageIcon, MapPin } from 'lucide-react';
import { SosCard } from './SosCard';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { LanguageCode } from '../../types';

/**
 * Summary tile for the one-time "Capture Location" feature. The full capture workflow (GPS fix,
 * optional photo, contact selection, SMS / Share / Copy) is the existing CaptureLocationCard, which
 * opens below the tiles when the button is pressed.
 */
export const CaptureSummaryCard: React.FC<{ language: LanguageCode; open: boolean; onOpen: () => void }> = ({ language, open, onOpen }) => {
  const D = getSosDashStrings(language);
  return (
    <SosCard id="sos-capture" title={D.capTitle} desc={D.capDesc} tone="purple" icon={<Camera className="h-6 w-6" />}>
      <div
        className="flex h-[120px] items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50"
        aria-hidden="true"
      >
        <ImageIcon className="h-10 w-10 text-indigo-300" />
      </div>
      <p className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-center text-xs text-slate-700">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden="true" />
        <span>{D.capNote}</span>
      </p>
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-controls="sos-capture-panel"
        className="mt-auto flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-indigo-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-indigo-800"
      >
        <Camera className="h-4 w-4" aria-hidden="true" /> {D.capBtn}
      </button>
    </SosCard>
  );
};
