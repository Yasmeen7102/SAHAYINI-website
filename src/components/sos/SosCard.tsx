import React from 'react';

type Tone = 'blue' | 'purple' | 'green' | 'orange' | 'sky';

const TONES: Record<Tone, { card: string; icon: string }> = {
  blue: { card: 'border-sky-200 bg-gradient-to-b from-white to-sky-50/60', icon: 'bg-rose-50 text-rose-600' },
  purple: { card: 'border-indigo-200 bg-gradient-to-b from-white to-indigo-50/60', icon: 'bg-indigo-100 text-indigo-700' },
  green: { card: 'border-emerald-200 bg-gradient-to-b from-white to-emerald-50/60', icon: 'bg-emerald-100 text-emerald-700' },
  orange: { card: 'border-orange-200 bg-gradient-to-b from-white to-orange-50/70', icon: 'bg-orange-100 text-orange-600' },
  sky: { card: 'border-sky-200 bg-gradient-to-b from-white to-sky-50/60', icon: 'bg-sky-100 text-sky-700' },
};

interface SosCardProps {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tone?: Tone;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Shared rounded card used by every tile on the SOS dashboard. */
export const SosCard: React.FC<SosCardProps> = ({ id, title, desc, icon, tone = 'sky', badge, className = '', children }) => {
  const t = TONES[tone];
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`relative flex flex-col rounded-3xl border p-4 sm:p-5 shadow-xs ${t.card} ${className}`}
    >
      {badge && <div className="absolute right-3 top-3">{badge}</div>}
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${t.icon}`} aria-hidden="true">
          {icon}
        </div>
        <div className="min-w-0 pr-10">
          <h2 id={`${id}-title`} className="text-base font-extrabold leading-tight text-[#0A2E65]">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-snug text-slate-600">{desc}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-3">{children}</div>
    </section>
  );
};

/** Decorative stylised map (not a real map). Used behind status chips on the live-location card. */
export const MapArt: React.FC<{ pulse?: boolean; className?: string }> = ({ pulse = false, className = '' }) => (
  <svg viewBox="0 0 320 120" className={`w-full rounded-2xl border border-slate-200 bg-slate-50 ${className}`} aria-hidden="true" focusable="false">
    <rect width="320" height="120" fill="#EEF3F8" />
    <path d="M0 78 C60 60 90 96 150 74 S260 52 320 70 L320 120 L0 120 Z" fill="#DCEBD8" />
    <path d="M-10 40 C50 52 90 20 150 36 S250 60 330 30" stroke="#BFD9F2" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M20 0 L70 120 M120 0 L150 120 M210 0 L190 120 M290 0 L260 120" stroke="#FFFFFF" strokeWidth="5" />
    <path d="M0 58 L320 52 M0 98 L320 92" stroke="#FFFFFF" strokeWidth="5" />
    <path d="M100 66 L172 52 L190 84" stroke="#1D4ED8" strokeWidth="3" fill="none" strokeLinecap="round" />
    {pulse && <circle cx="100" cy="66" r="16" fill="#2563EB" opacity="0.18" />}
    <circle cx="100" cy="66" r="8" fill="#2563EB" stroke="#fff" strokeWidth="3" />
    <circle cx="190" cy="84" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
  </svg>
);
