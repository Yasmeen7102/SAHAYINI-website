import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfflineSafetyKitModal } from '../common/OfflineSafetyKitModal';
import { Logo } from '../common/Logo';
import { LiveLocationShare } from '../common/LiveLocationShare';
import { CaptureLocationCard } from '../common/CaptureLocationCard';
import { NearbyPoliceCard } from '../common/NearbyPoliceCard';
import { VoiceSafetyMonitor } from '../common/VoiceSafetyMonitor';
import { getComplaintStrings } from '../../i18n/complaintStrings';
import { getSosStrings, relationLabel } from '../../i18n/sosStrings';
import {
  PhoneCall,
  AlertTriangle,
  Shield,
  MapPin,
  UserPlus,
  Trash2,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Info,
  Clock,
  HeartHandshake,
  CheckCircle2,
  HardDrive,
  WifiOff,
  Zap,
} from 'lucide-react';

export const SosView: React.FC = () => {
  const { contacts, addContact, deleteContact, isOffline, t, language, setActiveTab } = useApp();
  const cs = getComplaintStrings(language);
  const ss = getSosStrings(language);

  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showConfirm112Modal, setShowConfirm112Modal] = useState(false);
  const [showOfflineKitModal, setShowOfflineKitModal] = useState(false);
  const [sharingNotice, setSharingNotice] = useState<string | null>(null);

  // New contact form state
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Parent / Family');

  const helplines = [
    { number: '112', title: 'National Emergency Helpline', desc: 'Police, Fire, Ambulance (All-in-one)', color: 'border-red-500 bg-red-50 text-red-700' },
    { number: '1091', title: 'Women in Distress Helpline', desc: '24x7 dedicated emergency support for women', color: 'border-pink-500 bg-pink-50 text-pink-700' },
    { number: '181', title: 'Women Helpline (Domestic Abuse)', desc: 'Legal aid, counseling, and rescue coordination', color: 'border-rose-500 bg-rose-50 text-rose-700' },
    { number: '1930', title: 'Cyber Financial Fraud Helpline', desc: 'Report online theft within golden hour to freeze funds', color: 'border-blue-500 bg-blue-50 text-blue-700' },
    { number: '1098', title: 'Childline India', desc: 'Emergency assistance for children in distress', color: 'border-amber-500 bg-amber-50 text-amber-700' },
    { number: '108', title: 'Medical Ambulance Emergency', desc: 'Urgent medical and healthcare response', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
    { number: '14567', title: 'Senior Citizen Helpline (Elder Line)', desc: 'Free information, guidance, and elder emotional support', color: 'border-indigo-500 bg-indigo-50 text-indigo-700' },
    { number: '14416', title: 'Tele-MANAS (Mental Health Support)', desc: '24x7 confidential psychological counseling', color: 'border-teal-500 bg-teal-50 text-teal-700' },
  ];

  // Built-in default contacts (ids 1-4) are stored in English; show them in the selected language
  // unless the user renamed them. User-created contacts are always shown exactly as typed.
  const defaultName = (c: { id: string; name: string }) => {
    const d = ss.defaultContacts[c.id];
    const en = getSosStrings('en').defaultContacts[c.id];
    return d && en && c.name === en.name ? d.name : c.name;
  };
  const defaultRel = (c: { id: string; relationship: string }) => {
    const d = ss.defaultContacts[c.id];
    const en = getSosStrings('en').defaultContacts[c.id];
    if (d && en && (c.relationship === en.relationship || c.relationship.startsWith('Toll-free') || c.relationship === 'Financial Fraud Reporting' || c.relationship === 'Official Emergency Center')) return d.relationship;
    return relationLabel(c.relationship, ss);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(ss.geoUnsupported);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        alert(ss.geoDenied);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const getGoogleMapsLink = () => {
    if (!coords) return '';
    return `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
  };

  const copyEmergencyAlert = () => {
    const link = getGoogleMapsLink() || 'GPS location not available';
    const text = `🚨 EMERGENCY ALERT FROM SAHAYINI: I need immediate help. My current GPS location: ${link}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    addContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation,
    });
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContactModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
            {t.sos.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.sos.subtitle}
          </p>
        </div>
        <Logo size="md" showText={false} className="shrink-0" />
      </div>

      {/* Critical Safety Notice Banner */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/90 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{ss.policyLabel}</span>
          {t.sos.bannerWarning}
        </div>
      </div>

      {/* Offline Safety Kit Quick Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-5 border border-indigo-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <HardDrive className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base">{ss.offlineKitTitle}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Zap className="w-2.5 h-2.5 fill-emerald-400" /> {ss.precached}
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5 max-w-xl">
              {ss.offlineKitDesc}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowOfflineKitModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
        >
          <HardDrive className="w-4 h-4" />
          <span>{ss.openOfflineKit}</span>
        </button>
      </div>

      {/* Primary 112 Calling Card */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 ring-8 ring-white/10 animate-pulse">
          <PhoneCall className="w-10 h-10 text-white fill-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          112
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-red-100 max-w-lg">
          {t.sos.call112Prompt}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a
            href="tel:112"
            className="px-8 py-4 bg-white text-red-700 hover:bg-red-50 font-black text-lg rounded-full shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
            <span>{t.sos.dial112Now}</span>
          </a>
        </div>
      </div>

      {/* Live GPS Location Sharing with Permission */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.sos.locationSharingTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.sos.locationSharingDesc}
              </p>
            </div>
          </div>

          <button
            onClick={handleGetLocation}
            disabled={locating}
            className="px-4 py-2 bg-[#0A2E65] hover:bg-[#072344] text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{locating ? t.sos.locating : t.sos.getLocation}</span>
          </button>
        </div>

        {coords ? (
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.sos.gpsLocked}</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {t.sos.accuracyLabel}: ±{Math.round(coords.accuracy || 10)}m
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
              {getGoogleMapsLink()}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  copyEmergencyAlert();
                  setSharingNotice('✓ Copied GPS distress alert to clipboard! Ready to paste into SMS or message.');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.sos.copied : t.sos.copySosText}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🚨 EMERGENCY: I need immediate assistance! My current GPS location: ${getGoogleMapsLink()}`
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setSharingNotice('✓ Opened WhatsApp with pre-filled GPS alert. Please select recipient and tap Send.')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.sos.sendWhatsapp}</span>
              </a>

              <a
                href={`sms:?body=${encodeURIComponent(
                  `EMERGENCY: I need help! My location: ${getGoogleMapsLink()}`
                )}`}
                onClick={() => setSharingNotice('✓ Opened native messaging app with pre-filled GPS distress message. Please confirm recipient and tap Send in your SMS app.')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <span>{t.sos.sendSms}</span>
              </a>
            </div>

            <LiveLocationShare coords={coords} />

            {sharingNotice && (
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between gap-2 animate-in fade-in">
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
        ) : (
          <p className="mt-4 text-xs text-slate-500 italic">
            {t.sos.locationSharingDesc}
          </p>
        )}
      </div>

      {/* Automatic voice safety monitor and emergency voice-message recording */}
      <VoiceSafetyMonitor contacts={contacts} language={language} coords={coords} />

      {/* Capture The Location (separate from police search) */}
      <CaptureLocationCard />

      {/* Find Nearby Police Stations (does not notify police) */}
      <NearbyPoliceCard />

      {/* Link to Complaint & FIR Support */}
      <div className="bg-[#123A70] text-white rounded-3xl p-5 border border-[#0d2d57] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">{cs.sosLinkTitle}</h3>
          <p className="text-xs text-white/85 mt-1">{cs.sosLinkDesc}</p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('complaint')}
          className="w-full sm:w-auto px-5 py-2.5 min-h-11 bg-[#FF9933] hover:bg-[#f08a22] text-[#123A70] font-extrabold text-xs rounded-full transition whitespace-nowrap cursor-pointer"
        >
          {cs.sosLinkButton}
        </button>
      </div>

      {/* Trusted Emergency Contacts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.sos.trustedContactsTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.dashboard.shareLocationDesc}
            </p>
          </div>

          <button
            onClick={() => setShowAddContactModal(true)}
            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.sos.addContact}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {defaultName(contact)}
                  </h4>
                  {contact.isPrimary && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-[#0A2E65] text-[10px] font-bold rounded-xs">
                      Official
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{defaultRel(contact)}</p>
                <p className="text-xs font-mono font-semibold text-slate-700 mt-0.5">
                  {contact.phone}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xs transition-colors"
                  title={ss.callName.replace('{name}', defaultName(contact))}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>

                {!contact.isPrimary && (
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    title={ss.deleteContact}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24x7 Official Helplines Directory */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {t.sos.helplinesTitle}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {ss.helplinesIntro}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((line) => (
            <div
              key={line.number}
              className={`p-3.5 rounded-2xl border ${line.color} flex items-center justify-between gap-3`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight font-mono">
                    {line.number}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                  {ss.helplines[line.number]?.title ?? line.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  {ss.helplines[line.number]?.desc ?? line.desc}
                </p>
              </div>

              <a
                href={`tel:${line.number}`}
                className="px-3 py-1.5 bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 text-xs font-extrabold rounded-full shadow-2xs shrink-0 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                <span>{ss.call}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Guidance Protocols */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#0A2E65]" />
          <span>{t.sos.safetyGuidanceTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>{t.sos.goldenHourTitle}</span>
            </h4>
            <p className="text-slate-600">
              {t.sos.goldenHourDesc}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-pink-600" />
              <span>{t.sos.womenSafetyTitle}</span>
            </h4>
            <p className="text-slate-600">
              {t.sos.womenSafetyDesc}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>{t.sos.followedTitle}</span>
            </h4>
            <p className="text-slate-600">
              {t.sos.followedDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">{t.sos.addContactModalTitle}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {t.sos.locationSharingDesc}
            </p>

            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.sos.contactName}</label>
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder={ss.namePlaceholder}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.sos.contactPhone}</label>
                <input
                  type="tel"
                  required
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder={ss.phonePlaceholder}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.sos.relationshipLabel}</label>
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Parent / Family">{ss.relations.family}</option>
                  <option value="Sibling">{ss.relations.sibling}</option>
                  <option value="Close Friend">{ss.relations.friend}</option>
                  <option value="Neighbor / Local Contact">{ss.relations.neighbor}</option>
                  <option value="Colleague / Mentor">{ss.relations.colleague}</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  {t.sos.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#0A2E65] hover:bg-[#072344] rounded-xl cursor-pointer"
                >
                  {t.sos.saveContactBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offline Safety Kit Modal */}
      <OfflineSafetyKitModal
        isOpen={showOfflineKitModal}
        onClose={() => setShowOfflineKitModal(false)}
      />
    </div>
  );
};
