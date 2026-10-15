import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, ShieldCheck, HardDrive, ArrowRight } from 'lucide-react';
import { OfflineSafetyKitModal } from './OfflineSafetyKitModal';

export const OfflineStatusBanner: React.FC = () => {
  const { isOffline } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {isOffline && (
        <div className="bg-amber-600 dark:bg-amber-700 text-white px-4 py-2 text-xs shadow-inner flex items-center justify-between flex-wrap gap-2 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
            <span className="font-semibold">
              Offline Mode Active (Low Connectivity)
            </span>
            <span className="hidden sm:inline text-white/90">
              — All 15+ Government Schemes, Emergency Helplines, and Safety Protocols are cached on your device.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-amber-800 hover:bg-amber-50 font-bold px-3 py-1 rounded-lg text-xs shadow-sm flex items-center gap-1 transition cursor-pointer"
            >
              <span>Open Offline Kit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <OfflineSafetyKitModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
