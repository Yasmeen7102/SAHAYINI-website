import React from 'react';
import { ExternalLink } from 'lucide-react';

/** Small neutral line (not an alert) shown under a police-search button when GPS was unavailable or the tab was blocked. */
export const PoliceSearchNote: React.FC<{ note: string | null; fallbackUrl: string | null; linkLabel: string }> = ({ note, fallbackUrl, linkLabel }) => {
  if (!note && !fallbackUrl) return null;
  return (
    <div role="status" aria-live="polite" className="space-y-1.5 text-[11px] leading-relaxed text-slate-600">
      {note && <p>{note}</p>}
      {fallbackUrl && (
        <a href={fallbackUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-[#0A2E65] underline">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> {linkLabel}
        </a>
      )}
    </div>
  );
};
