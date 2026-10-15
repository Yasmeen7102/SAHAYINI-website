import React from 'react';

interface TricolorWaveProps {
  variant?: 'banner' | 'wave' | 'ribbon' | 'badge';
  className?: string;
}

export const TricolorWave: React.FC<TricolorWaveProps> = ({
  variant = 'wave',
  className = '',
}) => {
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 shadow-xs ${className}`}>
        {/* Ashoka Chakra */}
        <div className="w-5 h-5 relative shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#0A2E65] animate-spin-slow">
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
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </div>
        <div className="flex h-3 w-8 rounded-xs overflow-hidden shadow-2xs">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white border-y border-slate-200" />
          <div className="flex-1 bg-[#138808]" />
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`relative w-full overflow-hidden flex flex-col items-center ${className}`}>
        {/* Ashoka Chakra Center */}
        <div className="relative mb-2 w-14 h-14 md:w-16 md:h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#0A2E65] drop-shadow-sm">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="5" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="2.8"
              />
            ))}
          </svg>
        </div>

        {/* Elegant Flying Ribbons Saffron & Green */}
        <svg
          viewBox="0 0 800 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-xl h-16 drop-shadow-xs"
        >
          {/* Saffron Ribbon (Left to Right flowing curve) */}
          <path
            d="M 50,45 C 200,10 320,65 400,20 C 480,65 600,10 750,45 C 620,20 480,75 400,30 C 320,75 180,20 50,45 Z"
            fill="url(#bannerSaffron)"
          />
          {/* Green Ribbon (Parallel lower wave) */}
          <path
            d="M 70,55 C 210,25 330,75 400,35 C 470,75 590,25 730,55 C 610,35 470,85 400,45 C 330,85 190,35 70,55 Z"
            fill="url(#bannerGreen)"
          />

          <defs>
            <linearGradient id="bannerSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB923C" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#EA580C" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FB923C" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="bannerGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Default elegant dual wave matching Image 2 bottom-left and Image 5
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-8"
      >
        {/* Saffron line */}
        <path
          d="M 5,20 C 50,5 90,30 140,15 C 165,8 185,14 195,18"
          stroke="#EA580C"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* White gap space */}
        {/* Green line */}
        <path
          d="M 10,28 C 55,13 95,38 145,23 C 170,16 188,22 195,25"
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
