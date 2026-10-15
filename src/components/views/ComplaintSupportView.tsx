import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { ComplaintPoliceFinder } from '../common/ComplaintPoliceFinder';
import { getComplaintStrings } from '../../i18n/complaintStrings';
import {
  COMPLAINT_TYPES,
  ComplaintForm,
  ComplaintGroup,
  NOT_SUBMITTED_LABEL,
  OFFICIAL_LINKS,
  buildComplaintDraft,
  buildPrintHtml,
  ensureNotSubmittedLabel,
  isComplaintFormComplete,
} from '../../utils/complaintDraft';
import {
  FileText,
  ShieldAlert,
  Laptop,
  ClipboardList,
  Eye,
  Copy,
  Check,
  Printer,
  Save,
  PhoneCall,
  ExternalLink,
  AlertTriangle,
  FilePen,
  X,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'sahayini_complaint_draft';

const GROUPS: { id: ComplaintGroup; icon: React.ReactNode }[] = [
  { id: 'women', icon: <ShieldAlert className="w-5 h-5" aria-hidden="true" /> },
  { id: 'cyber', icon: <Laptop className="w-5 h-5" aria-hidden="true" /> },
  { id: 'other', icon: <ClipboardList className="w-5 h-5" aria-hidden="true" /> },
];

const todayIso = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const inputCls =
  'w-full px-3 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#123A70]';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const ComplaintSupportView: React.FC = () => {
  const { language, user } = useApp();
  const cs = getComplaintStrings(language);

  const [group, setGroup] = useState<ComplaintGroup>('women');
  const [form, setForm] = useState<ComplaintForm>({
    typeKey: '',
    date: '',
    time: '',
    location: '',
    description: '',
    name: user?.name || '',
    phone: '',
    address: '',
    suspect: '',
    witnesses: '',
    evidence: '',
    amountLost: '',
    transactionRef: '',
  });
  const [draft, setDraft] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState<string | null>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  // Restore a draft the user saved earlier on this device (still labelled Not Yet Submitted).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) setDraft(ensureNotSubmittedLabel(saved));
    } catch {
      /* storage unavailable: ignore */
    }
  }, []);

  const set = <K extends keyof ComplaintForm>(key: K, value: ComplaintForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Evidence stays in this browser session. It is never uploaded automatically, so this also
  // works offline. The user can save/share the original file separately with the draft.
  useEffect(() => {
    if (!evidencePhoto) { setEvidencePhotoUrl(null); return; }
    const url = URL.createObjectURL(evidencePhoto);
    setEvidencePhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [evidencePhoto]);

  const isCyber = COMPLAINT_TYPES.find((t) => t.key === form.typeKey)?.group === 'cyber';

  const handleGenerate = () => {
    if (!isComplaintFormComplete(form)) {
      setError(cs.requiredMissing);
      return;
    }
    setError(null);
    setNotice(null);
    const formWithPhoto = evidencePhoto
      ? { ...form, evidence: [form.evidence?.trim(), `Photo evidence attached separately: ${evidencePhoto.name}`].filter(Boolean).join('; ') }
      : form;
    setDraft(buildComplaintDraft(formWithPhoto));
    // Show the generated complaint immediately in a review modal.
    setShowPreview(true);
  };

  const currentText = () => ensureNotSubmittedLabel(draft || '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice('Could not copy automatically. Please select the text in the box and copy it manually.');
    }
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc || !iframe.contentWindow) {
      iframe.remove();
      setNotice('Printing is not available in this browser.');
      return;
    }
    doc.open();
    doc.write(buildPrintHtml(currentText()));
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1500);
    }, 200);
  };

  const handleDownload = () => {
    const text = currentText();
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sahayini-complaint-draft-NOT-YET-SUBMITTED.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setNotice('Complaint draft downloaded. Review it, complete any blanks, sign it, and take it to the police station. It has not been submitted.');
    } catch {
      setNotice('Download failed in this browser. Use Print / Save as PDF instead.');
    }
  };

  const handleSave = () => {
    const text = currentText();
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
    } catch {
      /* ignore: the file download below still works */
    }
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sahayini-complaint-draft-NOT-YET-SUBMITTED.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
    setNotice(cs.saved);
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setDraft(null);
    setShowPreview(false);
    setNotice(null);
  };

  const typesInGroup = COMPLAINT_TYPES.filter((t) => t.group === group);
  const groupTitle = (g: ComplaintGroup) => (g === 'women' ? cs.groupWomen : g === 'cyber' ? cs.groupCyber : cs.groupOther);

  const actionBtn =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-11 rounded-full text-xs font-bold transition-colors cursor-pointer';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123A70] tracking-tight">{cs.pageTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{cs.pageSubtitle}</p>
        </div>
        <Logo size="md" showText={false} className="shrink-0" />
      </div>

      {/* Honest-status banner */}
      <div className="bg-[#123A70] text-white rounded-2xl p-4 border-l-4 border-[#FF9933] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-extrabold">{cs.disclaimerTitle}</p>
          <p className="mt-1 text-white/90">{cs.disclaimerBody}</p>
        </div>
      </div>

      {/* Emergency strip */}
      <a
        href={`tel:${OFFICIAL_LINKS.emergency}`}
        className="flex items-center justify-center gap-2 py-3 bg-[#FF9933] hover:bg-[#f08a22] text-[#123A70] font-extrabold text-sm rounded-full shadow-xs"
      >
        <PhoneCall className="w-4 h-4" aria-hidden="true" />
        <span>{cs.emergency112}</span>
      </a>

      {/* 1. Category selection */}
      <section aria-labelledby="cs-type-title" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <h2 id="cs-type-title" className="text-base font-bold text-slate-900 mb-3">{cs.chooseType}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="tablist" aria-label={cs.chooseType}>
          {GROUPS.map((g) => {
            const active = group === g.id;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setGroup(g.id)}
                className={`flex items-center gap-2.5 px-4 py-3 min-h-11 rounded-2xl border text-sm font-bold text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#123A70] text-white border-[#123A70]'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={active ? 'text-[#FF9933]' : 'text-[#123A70]'}>{g.icon}</span>
                <span>{groupTitle(g.id)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label={groupTitle(group)}>
          {typesInGroup.map((t) => {
            const selected = form.typeKey === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => set('typeKey', t.key)}
                className={`px-3.5 py-2 min-h-11 rounded-full border text-xs font-bold transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[#FF9933] text-[#123A70] border-[#FF9933]'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-[#123A70]'
                }`}
              >
                {cs.types[t.key] || t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Complaint form */}
      <section aria-labelledby="cs-form-title" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 id="cs-form-title" className="text-base font-bold text-slate-900">{cs.formTitle}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cs-date" className={labelCls}>{cs.incidentDate} *</label>
            <input id="cs-date" type="date" max={todayIso()} value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="cs-time" className={labelCls}>{cs.incidentTime}</label>
            <input id="cs-time" type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="cs-location" className={labelCls}>{cs.location} *</label>
          <input id="cs-location" type="text" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder={cs.locationHint} className={inputCls} />
        </div>

        <div>
          <label htmlFor="cs-description" className={labelCls}>{cs.description} *</label>
          <textarea id="cs-description" rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={cs.descriptionHint} className={`${inputCls} resize-y`} />
        </div>

        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-bold text-[#123A70] min-h-8">{cs.optionalDetails}</summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cs-name" className={labelCls}>{cs.yourName}</label>
              <input id="cs-name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="cs-phone" className={labelCls}>{cs.yourPhone}</label>
              <input id="cs-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cs-address" className={labelCls}>{cs.yourAddress}</label>
              <input id="cs-address" type="text" value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} autoComplete="street-address" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cs-suspect" className={labelCls}>{cs.suspectDetails}</label>
              <textarea id="cs-suspect" rows={2} value={form.suspect} onChange={(e) => set('suspect', e.target.value)} className={`${inputCls} resize-y`} />
            </div>
            <div>
              <label htmlFor="cs-witnesses" className={labelCls}>{cs.witnesses}</label>
              <input id="cs-witnesses" type="text" value={form.witnesses} onChange={(e) => set('witnesses', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="cs-evidence" className={labelCls}>{cs.evidence}</label>
              <input id="cs-evidence" type="text" value={form.evidence} onChange={(e) => set('evidence', e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2 rounded-xl border border-dashed border-slate-300 bg-white p-3 space-y-2">
              <label htmlFor="cs-evidence-photo" className={labelCls}>Photo evidence (optional)</label>
              <p className="text-xs text-slate-600">Take a photo or choose an existing image. It stays on this device, works offline, and is not automatically sent to police. Save/share it separately with your complaint.</p>
              <input id="cs-evidence-photo" type="file" accept="image/*" capture="environment" onChange={(e) => setEvidencePhoto(e.target.files?.[0] || null)} className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-full file:border-0 file:bg-[#123A70] file:px-4 file:py-2.5 file:font-bold file:text-white" />
              {evidencePhoto && evidencePhotoUrl && (
                <div className="flex flex-wrap items-center gap-3">
                  <img src={evidencePhotoUrl} alt="Selected photo evidence preview" className="max-h-36 max-w-36 rounded-lg border border-slate-200 object-contain" />
                  <div className="min-w-0 flex-1 text-xs text-slate-700"><p className="font-bold break-all">{evidencePhoto.name}</p><p>{Math.max(1, Math.round(evidencePhoto.size / 1024))} KB</p>
                    <a href={evidencePhotoUrl} download={evidencePhoto.name || 'sahayini-evidence.jpg'} className="inline-flex mt-2 rounded-full bg-orange-100 px-3 py-2 font-bold text-[#123A70]">Download photo evidence</a>
                    <button type="button" onClick={() => { setEvidencePhoto(null); const el = document.getElementById('cs-evidence-photo') as HTMLInputElement | null; if (el) el.value = ''; }} className="ml-2 mt-2 underline text-red-700">Remove</button>
                  </div>
                </div>
              )}
            </div>
            {isCyber && (
              <>
                <div>
                  <label htmlFor="cs-amount" className={labelCls}>{cs.amountLost}</label>
                  <input id="cs-amount" type="text" inputMode="decimal" value={form.amountLost} onChange={(e) => set('amountLost', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="cs-txn" className={labelCls}>{cs.transactionRef}</label>
                  <input id="cs-txn" type="text" value={form.transactionRef} onChange={(e) => set('transactionRef', e.target.value)} className={inputCls} />
                </div>
              </>
            )}
          </div>
        </details>

        {error && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          className={`${actionBtn} w-full sm:w-auto bg-[#123A70] hover:bg-[#0d2d57] text-white`}
        >
          <FilePen className="w-4 h-4 text-[#FF9933]" aria-hidden="true" />
          <span>{cs.generateDraft}</span>
        </button>
      </section>

      {/* 3. Editable draft */}
      {draft !== null && (
        <section ref={draftRef} aria-labelledby="cs-draft-title" className="bg-white rounded-3xl p-6 border-2 border-[#FF9933] shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="cs-draft-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#123A70]" aria-hidden="true" />
              {cs.draftTitle}
            </h2>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-400 text-xs font-extrabold uppercase tracking-wide">
              {cs.notYetSubmitted}
            </span>
          </div>
          <p className="text-xs text-slate-600">{cs.draftEditHint}</p>

          <label htmlFor="cs-draft-text" className="sr-only">{cs.draftTitle}</label>
          <textarea
            id="cs-draft-text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={18}
            className="w-full px-3 py-3 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#123A70] resize-y"
          />

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowPreview((v) => !v)} className={`${actionBtn} bg-white border border-slate-300 text-slate-900 hover:bg-slate-50`}>
              <Eye className="w-4 h-4" aria-hidden="true" /> {showPreview ? cs.closePreview : cs.preview}
            </button>
            <button type="button" onClick={handleCopy} className={`${actionBtn} bg-white border border-slate-300 text-slate-900 hover:bg-slate-50`}>
              {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              {copied ? cs.copied : cs.copy}
            </button>
            <button type="button" onClick={handlePrint} className={`${actionBtn} bg-white border border-slate-300 text-slate-900 hover:bg-slate-50`}>
              <Printer className="w-4 h-4" aria-hidden="true" /> {cs.print}
            </button>
            <button type="button" onClick={handleSave} className={`${actionBtn} bg-[#FF9933] hover:bg-[#f08a22] text-[#123A70]`}>
              <Save className="w-4 h-4" aria-hidden="true" /> {cs.save}
            </button>
            <button type="button" onClick={handleClearDraft} className={`${actionBtn} text-slate-600 hover:text-red-700`}>
              <X className="w-4 h-4" aria-hidden="true" /> Clear draft
            </button>
          </div>

          {notice && (
            <div role="status" className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              {notice}
            </div>
          )}

          {showPreview && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-white">
              <div className="inline-block mb-3 px-3 py-1 border-2 border-amber-600 text-amber-700 font-extrabold text-xs rounded-md">
                {NOT_SUBMITTED_LABEL}
              </div>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-900 leading-relaxed">{currentText()}</pre>
            </div>
          )}
        </section>
      )}

      {/* 4. Nearby police stations */}
      <ComplaintPoliceFinder cs={cs} />

      {/* 5. Official reporting links */}
      <section aria-labelledby="cs-official-title" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <h2 id="cs-official-title" className="text-base font-bold text-slate-900 mb-3">{cs.officialTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={OFFICIAL_LINKS.cybercrimePortal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-4 py-3 min-h-11 bg-[#123A70] hover:bg-[#0d2d57] text-white rounded-2xl text-xs font-bold"
          >
            <span>{cs.portalLabel}</span>
            <ExternalLink className="w-4 h-4 text-[#FF9933] shrink-0" aria-hidden="true" />
          </a>
          <a
            href={`tel:${OFFICIAL_LINKS.financialFraudHelpline}`}
            className="flex items-center justify-between gap-2 px-4 py-3 min-h-11 bg-white border-2 border-[#123A70] text-[#123A70] rounded-2xl text-xs font-bold"
          >
            <span>{cs.helpline1930}</span>
            <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
          <a
            href={`tel:${OFFICIAL_LINKS.emergency}`}
            className="flex items-center justify-between gap-2 px-4 py-3 min-h-11 bg-[#FF9933] text-[#123A70] rounded-2xl text-xs font-extrabold"
          >
            <span>{cs.emergency112}</span>
            <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
          Opening a link or dialler does not file anything by itself. Any acknowledgement, complaint number or FIR copy
          comes only from the police or the official portal.
        </p>
      </section>

      {/* Complaint draft review modal: generated locally, never submitted automatically. */}
      {showPreview && draft !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cs-preview-modal-title"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setShowPreview(false); }}
        >
          <section className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-[#123A70] px-5 py-4 text-white sm:px-6">
              <div>
                <h2 id="cs-preview-modal-title" className="text-lg font-extrabold">Complaint draft preview</h2>
                <p className="mt-1 text-xs text-white/85">Review your details before downloading. This is not an official police filing.</p>
              </div>
              <button type="button" onClick={() => setShowPreview(false)} className="rounded-full p-2 hover:bg-white/15" aria-label="Close complaint preview">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>
            <div className="overflow-y-auto p-4 sm:p-6">
              <div className="mb-3 inline-flex rounded-md border-2 border-amber-600 px-3 py-1 text-xs font-extrabold tracking-wide text-amber-800">{NOT_SUBMITTED_LABEL}</div>
              <p className="mb-4 text-xs leading-relaxed text-slate-600">Check names, dates, location and description carefully. Complete any blank police-station or signature fields before submitting in person.</p>
              <pre className="whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-sm leading-relaxed text-slate-900">{currentText()}</pre>
            </div>
            <footer className="flex flex-col gap-2 border-t border-slate-200 bg-white p-4 sm:flex-row sm:justify-end sm:px-6">
              <button type="button" onClick={() => setShowPreview(false)} className={`${actionBtn} border border-slate-300 bg-white text-slate-900 hover:bg-slate-50`}>
                <FilePen className="h-4 w-4" aria-hidden="true" /> Edit details
              </button>
              <button type="button" onClick={handlePrint} className={`${actionBtn} border border-slate-300 bg-white text-slate-900 hover:bg-slate-50`}>
                <Printer className="h-4 w-4" aria-hidden="true" /> Print / Save as PDF
              </button>
              <button type="button" onClick={handleDownload} className={`${actionBtn} bg-[#FF9933] text-[#123A70] hover:bg-[#f08a22]`}>
                <Save className="h-4 w-4" aria-hidden="true" /> Download complaint
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
};
