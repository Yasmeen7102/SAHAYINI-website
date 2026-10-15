import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  offlineStorage,
  EmergencyHelpline,
  OfflineSafetyPlaybook,
  CachedSchemeRecord,
  OfflineCacheMetadata,
} from '../../services/offlineStorage';
import {
  WifiOff,
  Wifi,
  PhoneCall,
  ShieldAlert,
  BookOpen,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  Copy,
  ExternalLink,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  HardDrive,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface OfflineSafetyKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineSafetyKitModal: React.FC<OfflineSafetyKitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isOffline, language, setActiveTab } = useApp();
  const [activeTab, setActiveTabState] = useState<'helplines' | 'sms' | 'playbooks' | 'schemes' | 'status'>('helplines');
  const [metadata, setMetadata] = useState<OfflineCacheMetadata | null>(null);
  const [helplines, setHelplines] = useState<EmergencyHelpline[]>([]);
  const [playbooks, setPlaybooks] = useState<OfflineSafetyPlaybook[]>([]);
  const [expandedPlaybookId, setExpandedPlaybookId] = useState<string | null>('pb-threat');
  const [schemes, setSchemes] = useState<CachedSchemeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  // SMS Dispatcher State
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCacheData();
    }
  }, [isOpen, language]);

  const loadCacheData = () => {
    const meta = offlineStorage.getMetadata() || offlineStorage.precacheAllCriticalData();
    setMetadata(meta);
    setHelplines(offlineStorage.getCachedHelplines());
    setPlaybooks(offlineStorage.getCachedPlaybooks());
    setSchemes(offlineStorage.getCachedSchemes({ language }));
  };

  const handleRefreshCache = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const refreshed = offlineStorage.refreshCache();
      setMetadata(refreshed);
      setHelplines(offlineStorage.getCachedHelplines());
      setPlaybooks(offlineStorage.getCachedPlaybooks());
      setSchemes(offlineStorage.getCachedSchemes({ language }));
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 600);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert('Could not retrieve GPS coordinates. You can still dispatch SOS via SMS without coordinates.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredSchemes = schemes.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const loc = s.localized ? s.localized[language] : null;
    return (
      s.title.toLowerCase().includes(q) ||
      (loc && loc.title.toLowerCase().includes(q)) ||
      s.summary.toLowerCase().includes(q)
    );
  });

  const smsData = offlineStorage.generateEmergencySms(coords, customNote);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Offline Safety & Schemes Kit</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-300/40">
                  <CheckCircle className="w-3 h-3" /> Offline Ready
                </span>
              </div>
              <p className="text-xs text-white/80">
                Low-connectivity shelter: Instant access without 4G/5G mobile internet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connectivity Status Sub-bar */}
        <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                <WifiOff className="w-4 h-4" /> Offline Mode (Using local device storage)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <Wifi className="w-4 h-4" /> Online (All safety records precached locally)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <span>{metadata?.schemesCount || 15} Schemes</span>
            <span>•</span>
            <span>{metadata?.helplinesCount || 11} Helplines</span>
            <span>•</span>
            <span>{metadata?.playbooksCount || 5} Protocols</span>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50 dark:bg-slate-900 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTabState('helplines')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'helplines'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Dialer ({helplines.length})</span>
          </button>
          <button
            onClick={() => setActiveTabState('sms')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'sms'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>No-Data SMS SOS</span>
          </button>
          <button
            onClick={() => setActiveTabState('playbooks')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'playbooks'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety Protocols ({playbooks.length})</span>
          </button>
          <button
            onClick={() => setActiveTabState('schemes')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'schemes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Offline Schemes ({schemes.length})</span>
          </button>
          <button
            onClick={() => setActiveTabState('status')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Cache Manager</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: EMERGENCY HELPLINES DIALER */}
          {activeTab === 'helplines' && (
            <div className="space-y-4">
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl p-3 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Zero Internet Required:</span> Direct cellular calls to 112, 1091, and 1930 work over standard 2G/GSM cellular signals even when mobile internet data pack is expired or offline.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {helplines.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                          {item.number}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.availableHours}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mb-3">
                        {item.description}
                      </p>
                    </div>

                    <a
                      href={`tel:${item.number}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {item.number} Directly</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: NO-DATA SMS SOS DISPATCHER */}
          {activeTab === 'sms' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl p-3.5 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-bold mb-1">📱 Why SMS works when 4G/5G fails:</p>
                <p className="text-[11px] leading-relaxed">
                  SMS travels over the cellular signaling channel (2G control channel) and reaches recipients even in remote hills, basement parking lots, or during complete internet outages. Your phone's GPS antenna connects to orbital satellites without internet.
                </p>
              </div>

              {/* GPS Coordinates Button */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold">GPS Location Attachment</span>
                  </div>
                  <button
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition"
                  >
                    {locating ? 'Acquiring GPS...' : coords ? 'Re-acquire GPS' : 'Fetch GPS Coordinates'}
                  </button>
                </div>

                {coords ? (
                  <div className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-indigo-600 dark:text-indigo-300">
                    <span>
                      Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-sans font-bold">
                      Satellites Locked
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Tap above to append exact GPS satellite coordinates to your emergency SMS.
                  </p>
                )}
              </div>

              {/* Custom Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Emergency Note:
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g., Trapped near Bus Stand / Auto rickshaw following me"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Formatted SMS Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Generated SMS Content (Pre-filled):
                </label>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed select-all">
                  {smsData.text}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={smsData.smsUri}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open SMS App & Send Alert</span>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(smsData.text);
                    setCopiedSms(true);
                    setTimeout(() => setCopiedSms(false), 2000);
                  }}
                  className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedSms ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSms ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OFFLINE SAFETY PROTOCOLS */}
          {activeTab === 'playbooks' && (
            <div className="space-y-3">
              {playbooks.map((pb) => {
                const isExpanded = expandedPlaybookId === pb.id;
                return (
                  <div
                    key={pb.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40"
                  >
                    <button
                      onClick={() => setExpandedPlaybookId(isExpanded ? null : pb.id)}
                      className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/70 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {pb.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {pb.summary}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs space-y-3 animate-in fade-in">
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-900 dark:text-amber-300">
                          <span className="font-bold">Golden Rule: </span>
                          {pb.goldenRule}
                        </div>

                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                            Immediate Action Steps:
                          </h5>
                          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                            {pb.immediateSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                            Low-Connectivity Safeguards:
                          </h5>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                            {pb.offlineActions.map((act, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-indigo-500">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-500">Fast Helplines:</span>
                          {pb.importantHelplines.map((num) => (
                            <a
                              key={num}
                              href={`tel:${num}`}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700 transition"
                            >
                              Call {num}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: OFFLINE SCHEMES DIRECTORY */}
          {activeTab === 'schemes' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Instant offline search (e.g. Scholarship, Sukanya, Mudra, Loan)..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {filteredSchemes.map((scheme) => {
                  const loc = scheme.localized ? scheme.localized[language] : null;
                  const displayTitle = loc?.title || scheme.title;
                  const displaySummary = loc?.summary || scheme.summary;
                  const displayBenefits = loc?.benefits || scheme.benefits;
                  const isExpanded = expandedSchemeId === scheme.id;

                  return (
                    <div
                      key={scheme.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {scheme.category}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              Cached Offline
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {displayTitle}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {displaySummary}
                          </p>
                        </div>
                        <button
                          onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2.5 animate-in fade-in">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">Benefits: </span>
                            <span className="text-slate-600 dark:text-slate-400">{displayBenefits}</span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Documents Checklist:
                            </span>
                            <ul className="space-y-0.5 text-slate-600 dark:text-slate-400 pl-4 list-disc text-[11px]">
                              {(loc?.documentsRequired || scheme.documentsRequired).map((doc, i) => (
                                <li key={i}>{doc}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              How to Apply (Offline / Online):
                            </span>
                            <ol className="space-y-1 text-slate-600 dark:text-slate-400 pl-4 list-decimal text-[11px]">
                              {(loc?.applicationProcess || scheme.applicationProcess).map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="pt-2 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Source: {scheme.sourceName}</span>
                            <button
                              onClick={() => {
                                onClose();
                                setActiveTab('schemes');
                              }}
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                              Open in Full Schemes View →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredSchemes.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">
                    No cached schemes matched "{searchQuery}".
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CACHE MANAGER & SYNC HEALTH */}
          {activeTab === 'status' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Offline Database Status
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Government Schemes</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {metadata?.schemesCount || 15} Available
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Emergency Helplines</span>
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                      {metadata?.helplinesCount || 11} Services
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Safety Playbooks</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {metadata?.playbooksCount || 5} Protocols
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Storage Footprint</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ~{Math.round((metadata?.cacheSizeBytes || 160000) / 1024)} KB
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Last Verified:</span>
                  <span className="font-mono text-[11px]">
                    {metadata?.lastUpdated ? new Date(metadata.lastUpdated).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>

              {syncSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cache updated successfully! All assets are fresh and ready for offline use.</span>
                </div>
              )}

              <button
                onClick={handleRefreshCache}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Refreshing Offline Cache...' : 'Re-sync & Update Offline Cache'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px]">
            SAHAYINI v2.0 • Offline Resilient Mode
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
