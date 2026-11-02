import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfflineSafetyKitModal } from '../common/OfflineSafetyKitModal';
import { Logo } from '../common/Logo';
import { CaptureLocationCard } from '../common/CaptureLocationCard';
import { VoiceSafetyMonitor } from '../common/VoiceSafetyMonitor';
import { LiveShareCard } from '../sos/LiveShareCard';
import { CaptureSummaryCard } from '../sos/CaptureSummaryCard';
import { NearbyPoliceSosCard } from '../sos/NearbyPoliceSosCard';
import { ContactsCard } from '../sos/ContactsCard';
import { ContactsPanel } from '../sos/ContactsPanel';
import { SosCard } from '../sos/SosCard';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import { useSosRecipients } from '../../hooks/useSosRecipients';
import { getComplaintStrings } from '../../i18n/complaintStrings';
import { getSosStrings } from '../../i18n/sosStrings';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { PhoneCall, Shield, Clock, HeartHandshake, Info, HardDrive, Zap, FileText, Heart } from 'lucide-react';

const HELPLINES = [
  { number: '112', title: 'National Emergency Helpline', desc: 'Police, Fire, Ambulance (All-in-one)', color: 'border-red-300 bg-red-50 text-red-700' },
  { number: '1091', title: 'Women in Distress Helpline', desc: '24x7 dedicated emergency support for women', color: 'border-pink-300 bg-pink-50 text-pink-700' },
  { number: '181', title: 'Women Helpline (Domestic Abuse)', desc: 'Legal aid, counseling, and rescue coordination', color: 'border-rose-300 bg-rose-50 text-rose-700' },
  { number: '1930', title: 'Cyber Financial Fraud Helpline', desc: 'Report online theft within golden hour to freeze funds', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { number: '1098', title: 'Childline India', desc: 'Emergency assistance for children in distress', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { number: '108', title: 'Medical Ambulance Emergency', desc: 'Urgent medical and healthcare response', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { number: '14567', title: 'Senior Citizen Helpline (Elder Line)', desc: 'Free information, guidance, and elder emotional support', color: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { number: '14416', title: 'Tele-MANAS (Mental Health Support)', desc: '24x7 confidential psychological counseling', color: 'border-teal-300 bg-teal-50 text-teal-700' },
];

export const SosView: React.FC = () => {
  const { t, language, setActiveTab } = useApp();
  const cs = getComplaintStrings(language);
  const ss = getSosStrings(language);
  const D = getSosDashStrings(language);

  const live = useLiveLocation();
  const recipients = useSosRecipients();

  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureKey, setCaptureKey] = useState(0);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [showOfflineKitModal, setShowOfflineKitModal] = useState(false);
  const capturePanelRef = useRef<HTMLDivElement>(null);
  const contactsPanelRef = useRef<HTMLDivElement>(null);

  const openCapture = () => {
    setCaptureOpen(true);
    setCaptureKey((k) => k + 1); // starts one GPS capture; permission is requested by the browser
  };

  // Bring a newly opened panel into view (it opens below the tiles, which can be off-screen on phones).
  useEffect(() => {
    if (captureOpen) capturePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [captureOpen, captureKey]);
  useEffect(() => {
    if (contactsOpen) contactsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [contactsOpen]);

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-3 py-5 sm:px-4">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-100 via-amber-50 to-emerald-100 p-4 sm:p-6">
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Logo size="lg" showText={false} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0A2E65] sm:text-3xl">{D.heroTitle}</h1>
            <p className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">{D.heroSub}</p>
          </div>
          <a
            href="tel:112"
            className="flex min-h-14 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-red-600 px-6 py-3 text-white shadow-md transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 sm:w-auto"
          >
            <PhoneCall className="h-7 w-7 fill-white" aria-hidden="true" />
            <span className="text-left leading-tight">
              <span className="block text-xl font-extrabold text-white">{D.call112}</span>
              <span className="block text-[11px] font-semibold text-red-50">{D.call112Sub}</span>
            </span>
          </a>
        </div>
      </header>

      {/* Offline Safety & Emergency Kit: directly below the main SOS card */}
      <section
        aria-labelledby="sos-offline-kit-title"
        className="flex flex-col items-stretch justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#1d2580] via-[#2229b4] to-[#481780] p-4 text-white shadow-md sm:flex-row sm:items-center sm:p-5"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-emerald-300" aria-hidden="true">
            <HardDrive className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="sos-offline-kit-title" className="text-lg font-extrabold leading-tight text-white sm:text-xl">{ss.offlineKitTitle}</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/70 bg-sky-900/50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-200">
                <Zap className="h-3 w-3" aria-hidden="true" /> {ss.precached}
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-snug text-indigo-100">{ss.offlineKitDesc}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowOfflineKitModal(true)}
          className="flex min-h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[#00b373] px-5 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#00a068] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
        >
          <HardDrive className="h-4 w-4" aria-hidden="true" /> {ss.openOfflineKit}
        </button>
      </section>

      {/* Six feature tiles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <LiveShareCard live={live} recipients={recipients} language={language} />
        <CaptureSummaryCard language={language} open={captureOpen} onOpen={openCapture} />
        <NearbyPoliceSosCard language={language} />
        <ContactsCard language={language} recipients={recipients} open={contactsOpen} onToggle={() => setContactsOpen((o) => !o)} />
        <VoiceSafetyMonitor recipients={recipients} language={language} coords={live.coords} />
        <SosCard id="sos-complaint" title={cs.sosLinkTitle} desc={cs.sosLinkDesc} tone="orange" icon={<FileText className="h-6 w-6" />}>
          <button
            type="button"
            onClick={() => setActiveTab('complaint')}
            className="mt-auto flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-700"
          >
            {cs.sosLinkButton}
          </button>
        </SosCard>
      </div>

      {/* Detail panels open here, below the tiles */}
      {captureOpen && (
        <div id="sos-capture-panel" ref={capturePanelRef} className="scroll-mt-20">
          <CaptureLocationCard autoCaptureKey={captureKey} />
        </div>
      )}
      {contactsOpen && (
        <div ref={contactsPanelRef} className="scroll-mt-20">
          <ContactsPanel recipients={recipients} />
        </div>
      )}

      {/* Official helplines (unchanged content) */}
      <section aria-labelledby="sos-helplines-title" className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6">
        <h2 id="sos-helplines-title" className="mb-1 text-base font-bold text-slate-900">{t.sos.helplinesTitle}</h2>
        <p className="mb-4 text-xs text-slate-600">{ss.helplinesIntro}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {HELPLINES.map((line) => (
            <div key={line.number} className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 ${line.color}`}>
              <div className="min-w-0">
                <span className="font-mono text-lg font-black tracking-tight">{line.number}</span>
                <h3 className="mt-0.5 text-xs font-bold text-slate-900">{ss.helplines[line.number]?.title ?? line.title}</h3>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-700">{ss.helplines[line.number]?.desc ?? line.desc}</p>
              </div>
              <a
                href={`tel:${line.number}`}
                className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-900 shadow-2xs"
                aria-label={`${ss.call} ${line.number}`}
              >
                <PhoneCall className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                <span>{ss.call}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Safety guidance (unchanged content) */}
      <section aria-labelledby="sos-guidance-title" className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6">
        <h2 id="sos-guidance-title" className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
          <Shield className="h-5 w-5 text-[#0A2E65]" aria-hidden="true" />
          <span>{t.sos.safetyGuidanceTitle}</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
            <h3 className="mb-1 flex items-center gap-1.5 font-bold text-slate-900"><Clock className="h-4 w-4 text-orange-600" aria-hidden="true" /><span>{t.sos.goldenHourTitle}</span></h3>
            <p className="text-slate-600">{t.sos.goldenHourDesc}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
            <h3 className="mb-1 flex items-center gap-1.5 font-bold text-slate-900"><HeartHandshake className="h-4 w-4 text-pink-600" aria-hidden="true" /><span>{t.sos.womenSafetyTitle}</span></h3>
            <p className="text-slate-600">{t.sos.womenSafetyDesc}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
            <h3 className="mb-1 flex items-center gap-1.5 font-bold text-slate-900"><Info className="h-4 w-4 text-blue-600" aria-hidden="true" /><span>{t.sos.followedTitle}</span></h3>
            <p className="text-slate-600">{t.sos.followedDesc}</p>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm text-slate-800">
          <Info className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <span>{D.footerInfo}</span>
        </p>
        <p className="flex items-center gap-2 text-base font-bold italic text-[#0A2E65]">
          {D.footerTagline} <Heart className="h-5 w-5" aria-hidden="true" />
        </p>
      </div>

      <OfflineSafetyKitModal isOpen={showOfflineKitModal} onClose={() => setShowOfflineKitModal(false)} />
    </div>
  );
};
