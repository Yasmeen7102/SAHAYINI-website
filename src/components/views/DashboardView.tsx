import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfflineSafetyKitModal } from '../common/OfflineSafetyKitModal';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Bell,
  Landmark,
  MessageCircle,
  BookOpen,
  ShieldCheck,
  MapPin,
  ChevronRight,
  PhoneCall,
  Share2,
  Check,
  Copy,
  AlertCircle,
  UserCheck,
  HardDrive,
  Zap,
  FileText,
} from 'lucide-react';
import { TricolorWave } from '../common/TricolorWave';
import { Logo } from '../common/Logo';
import { LiveLocationShare } from '../common/LiveLocationShare';
import { getComplaintStrings } from '../../i18n/complaintStrings';

export const DashboardView: React.FC = () => {
  const { setActiveTab, language, user, isOffline, t } = useApp();

  const cs = getComplaintStrings(language);

  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'ready' | 'error'>('idle');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [sharingNotice, setSharingNotice] = useState<string | null>(null);

  // Dynamic greeting based on language
  const getGreeting = () => {
    switch (language) {
      case 'ta':
        return 'வணக்கம் (Vanakkam)';
      case 'te':
        return 'నమస్కారం (Namaskaram)';
      case 'kn':
        return 'ನಮಸ್ಕಾರ (Namaskara)';
      case 'ml':
        return 'നമസ്കാരം (Namaskaram)';
      case 'mr':
        return 'नमस्कार (Namaskar)';
      case 'gu':
        return 'નમસ્તે (Namaste)';
      case 'hi':
        return 'नमस्ते (Namaste)';
      default:
        return 'Vanakkam & Welcome';
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setGpsCoordinates(coords);
        setLocationStatus('ready');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getMapsUrl = () => {
    if (!gpsCoordinates) return '';
    return `https://maps.google.com/?q=${gpsCoordinates.lat},${gpsCoordinates.lng}`;
  };

  const copyLocationText = () => {
    const text = `🚨 SAHAYINI Emergency Location Alert: I am sharing my live GPS coordinates: ${getMapsUrl()}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* Top Greeting Banner matching Image 5 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-amber-50/50 rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1 z-10">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              {getGreeting()},
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
              {user ? `${user.name}` : 'Welcome to SAHAYINI'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
              Your trusted digital companion for safety, government schemes, and digital learning.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <TricolorWave variant="badge" />
              <span className="text-[11px] text-slate-500 font-medium">
                Together for a Safer & Smarter Tomorrow
              </span>
            </div>
          </div>

          {/* Official SAHAYINI logo (replaces the decorative illustrated girl) */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-emerald-100 rounded-full blur-md opacity-60" />
            <div
              className="relative rounded-2xl border-2 border-white shadow-xs p-2 flex items-center justify-center"
              style={{ backgroundColor: '#ffffff' }}
            >
              <Logo size="lg" showText={false} />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Emergency SOS Card matching Image 5 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-3xl p-5 border-2 border-red-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Pulsing SOS Circle Badge */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 flex flex-col items-center justify-center text-white shadow-md ring-4 ring-red-100">
                <Bell className="w-5 h-5 animate-bounce" />
                <span className="text-xs font-black tracking-wider uppercase mt-0.5">SOS</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {t.dashboard.emergencyTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {t.dashboard.emergencyDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('sos')}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            aria-label="Go to SOS Hub"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Big Orange Call 112 button matching Image 5 */}
        <div className="mt-4 pt-2">
          <a
            href="tel:112"
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-extrabold text-base rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <PhoneCall className="w-5 h-5 fill-white" />
            <span>{t.dashboard.call112}</span>
          </a>
        </div>
      </div>

      {/* Grid of 4 Core Feature Cards matching Image 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Government Schemes Card (Green) */}
        <div
          onClick={() => setActiveTab('schemes')}
          className="group relative cursor-pointer overflow-hidden bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Landmark className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.dashboard.schemesTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {t.dashboard.schemesDesc}
            </p>
          </div>

          {/* Green Bottom Wave Accent matching Image 5 */}
          <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 group-hover:underline">
              Explore Schemes →
            </span>
            <div className="w-16 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full opacity-80" />
          </div>
        </div>

        {/* Ask Sahayini Card (Blue) */}
        <div
          onClick={() => setActiveTab('chat')}
          className="group relative cursor-pointer overflow-hidden bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100/80 flex items-center justify-center text-[#0A2E65] shadow-2xs">
                <MessageCircle className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0A2E65] group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.dashboard.askTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {t.dashboard.askDesc}
            </p>
          </div>

          {/* Blue Bottom Wave Accent matching Image 5 */}
          <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2E65] group-hover:underline">
              Chat & Voice AI →
            </span>
            <div className="w-16 h-2 bg-gradient-to-r from-blue-500 to-[#0A2E65] rounded-full opacity-80" />
          </div>
        </div>

        {/* Learn Card (Orange) */}
        <div
          onClick={() => setActiveTab('learn')}
          className="group relative cursor-pointer overflow-hidden bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100/80 flex items-center justify-center text-orange-600 shadow-2xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.dashboard.learnTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {t.dashboard.learnDesc}
            </p>
          </div>

          {/* Orange Bottom Wave Accent matching Image 5 */}
          <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 group-hover:underline">
              Start Learning →
            </span>
            <div className="w-16 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full opacity-80" />
          </div>
        </div>

        {/* Scam Protection Card (Blue/Cyan) */}
        <div
          onClick={() => setActiveTab('scam')}
          className="group relative cursor-pointer overflow-hidden bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100/80 flex items-center justify-center text-sky-700 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.dashboard.scamTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {t.dashboard.scamDesc}
            </p>
          </div>

          {/* Cyan Bottom Wave Accent matching Image 5 */}
          <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 group-hover:underline">
              Check Messages & URLs →
            </span>
            <div className="w-16 h-2 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full opacity-80" />
          </div>
        </div>
      </div>

      {/* Complaint & FIR Support Card (Navy) - sits between Scam Protection and Offline Safety */}
      <div
        onClick={() => setActiveTab('complaint')}
        className="group relative cursor-pointer overflow-hidden bg-[#123A70] text-white rounded-3xl p-5 border border-[#0d2d57] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/20 border border-[#FF9933]/50 flex items-center justify-center text-[#FF9933] shrink-0">
            <FileText className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white">{cs.cardTitle}</h3>
            <p className="text-xs sm:text-sm text-white/85 mt-1">{cs.cardDesc}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('complaint');
          }}
          className="w-full sm:w-auto px-5 py-2.5 min-h-11 bg-[#FF9933] hover:bg-[#f08a22] text-[#123A70] font-extrabold text-xs rounded-full shadow-xs transition whitespace-nowrap cursor-pointer"
        >
          {cs.cardButton}
        </button>
      </div>

      {/* PWA Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Offline Resilience Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-indigo-900/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Offline Safety & Schemes Resiliency</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                100% Offline
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Critical emergency helplines, no-data SMS alerts, and all 15 government schemes are cached on this device for zero-connectivity zones.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowOfflineModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Offline Kit</span>
        </button>
      </div>

      {/* Share Your Location Bottom Card matching Image 5 */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.dashboard.shareLocationTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {t.dashboard.shareLocationDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLocation}
              disabled={locationStatus === 'locating'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#0A2E65] font-bold text-xs rounded-full border border-indigo-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{locationStatus === 'locating' ? 'Locating...' : t.dashboard.shareNow}</span>
            </button>
          </div>
        </div>

        {/* Live Coordinates Display */}
        {locationStatus === 'ready' && gpsCoordinates && (
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono font-medium">
                Lat: {gpsCoordinates.lat.toFixed(5)}, Lng: {gpsCoordinates.lng.toFixed(5)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  copyLocationText();
                  setSharingNotice('✓ Copied GPS distress alert to clipboard! Ready to paste into SMS or message.');
                }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy GPS Alert'}</span>
              </button>

              <a
                href={`sms:?body=${encodeURIComponent(
                  `EMERGENCY: I am sharing my live GPS coordinates via SAHAYINI: ${getMapsUrl()}`
                )}`}
                onClick={() => setSharingNotice('✓ Opened native messaging app with pre-filled GPS alert. Please confirm recipient and tap Send.')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Open SMS App
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `EMERGENCY: I am sharing my live GPS coordinates via SAHAYINI: ${getMapsUrl()}`
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setSharingNotice('✓ Opened WhatsApp with pre-filled GPS alert. Please select recipient and tap Send.')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
              >
                WhatsApp Contacts
              </a>
            </div>

            {sharingNotice && (
              <div className="mt-2 w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between gap-2 animate-in fade-in">
                <span>{sharingNotice}</span>
                <button
                  onClick={() => setSharingNotice(null)}
                  className="text-blue-500 hover:text-blue-700 font-bold px-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {locationStatus === 'ready' && gpsCoordinates && <LiveLocationShare coords={gpsCoordinates} />}

        {locationStatus === 'error' && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Could not fetch GPS coordinates. Please ensure browser location permission is granted.</span>
          </div>
        )}
      </div>

      {/* Offline Safety Kit Modal */}
      <OfflineSafetyKitModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
      />
    </div>
  );
};
