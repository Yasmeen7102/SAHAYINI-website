import React from 'react';
import { useApp } from '../../context/AppContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  showSubtitle?: boolean;
  showTagline?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * Official SAHAYINI logo.
 * Uses the supplied brand artwork (public/sahayini-logo.png = emblem + wordmark,
 * public/sahayini-emblem.png = emblem only). Images are never stretched: only the
 * width is set and the height follows the intrinsic aspect ratio.
 * In dark / high-contrast themes the artwork is placed on a white tile so the
 * navy wordmark and the white face area of the emblem stay visible.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  showTagline = false,
  layout = 'horizontal',
  className = '',
  theme = 'light',
}) => {
  const { theme: appTheme } = useApp();
  const needsBacking = appTheme === 'dark' || appTheme === 'contrast' || theme === 'dark';

  // Emblem width by size (px)
  const emblemPx = { sm: 40, md: 52, lg: 80, xl: 128, '2xl': 176 }[size];
  // Width of the stacked emblem+wordmark artwork used by the vertical layout
  const fullLogoPx = { sm: 96, md: 140, lg: 190, xl: 240, '2xl': 280 }[size];

  const textSizes = {
    sm: 'text-base font-black tracking-wide',
    md: 'text-xl font-black tracking-wide',
    lg: 'text-3xl font-black tracking-wider',
    xl: 'text-4xl font-black tracking-widest',
    '2xl': 'text-5xl font-black tracking-widest',
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-[#0A2E65]';
  const subtitleColor = theme === 'dark' ? 'text-slate-300' : 'text-[#1E3A8A]';
  const taglineColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-700';

  const isVertical = layout === 'vertical';
  const backingStyle: React.CSSProperties | undefined = needsBacking
    ? { backgroundColor: '#ffffff' }
    : undefined;

  // Vertical + text: show the official stacked logo (emblem over wordmark) as one image.
  const useStackedArtwork = isVertical && showText;

  return (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center' : 'flex-row items-center gap-3 text-left'
      } select-none ${className}`}
    >
      <div
        className={`shrink-0 ${needsBacking ? 'rounded-2xl p-1.5' : ''}`}
        style={backingStyle}
      >
        {useStackedArtwork ? (
          <img
            src="/sahayini-logo.png"
            alt="SAHAYINI logo"
            width={fullLogoPx}
            style={{ width: fullLogoPx, height: 'auto', maxWidth: '100%' }}
            draggable={false}
          />
        ) : (
          <img
            src="/sahayini-emblem.png"
            alt={showText ? 'SAHAYINI emblem' : 'SAHAYINI logo'}
            width={emblemPx}
            style={{ width: emblemPx, height: 'auto', maxWidth: '100%' }}
            draggable={false}
          />
        )}
      </div>

      {/* Typography next to the emblem (horizontal layouts) or subtitle lines under the stacked logo */}
      {showText && (!useStackedArtwork || showSubtitle || showTagline) && (
        <div className={`flex flex-col ${isVertical ? 'items-center mt-3' : 'text-left'}`}>
          {!useStackedArtwork && (
            <span
              className={`${textSizes[size]} ${textColor} font-sans font-black tracking-wider leading-none uppercase`}
            >
              SAHAYINI
            </span>
          )}

          {showSubtitle && (
            <span
              className={`text-xs sm:text-sm font-bold tracking-wide ${subtitleColor} ${
                useStackedArtwork ? '' : 'mt-1'
              } leading-tight`}
            >
              Safety • Support • Digital Access
            </span>
          )}

          {showTagline && (
            <span
              className={`text-[11px] sm:text-xs font-semibold ${taglineColor} mt-0.5 leading-tight`}
            >
              Together for a Safer & Smarter Tomorrow
            </span>
          )}
        </div>
      )}
    </div>
  );
};
