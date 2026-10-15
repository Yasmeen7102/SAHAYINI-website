import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'compact' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running inside standalone PWA mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  if (variant === 'banner') {
    if (!isInstallable && !isIOS) return null;
    return (
      <div className={`bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-700 text-white p-3 rounded-xl shadow-md flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">Install SAHAYINI on your Phone</p>
            <p className="text-[11px] text-white/80 leading-tight">
              Instant offline safety access even without internet or network connectivity.
            </p>
          </div>
        </div>
        <div>
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="bg-white text-indigo-700 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap transition cursor-pointer"
            >
              {installing ? 'Installing...' : 'Install App'}
            </button>
          )}
          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="bg-white text-indigo-700 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap transition cursor-pointer"
            >
              Install on iOS
            </button>
          )}
        </div>
      </div>
    );
  }

  // Compact button for header / navigation
  return (
    <>
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700 transition cursor-pointer ${className}`}
          title="Install app for offline access"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Install App</span>
        </button>
      )}

      {isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700 transition cursor-pointer ${className}`}
          title="Install on iOS Safari"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Install</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">Install on iOS Safari</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              To install SAHAYINI on your iPhone or iPad for offline safety and schemes access:
            </p>

            <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-200 mb-6">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> at the bottom of Safari toolbar.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down the share menu and select <strong>"Add to Home Screen"</strong> (+).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Tap <strong>Add</strong> in the top-right corner. The SAHAYINI icon will appear on your home screen.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
