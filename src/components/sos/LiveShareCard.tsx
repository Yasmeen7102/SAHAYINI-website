import React, { useState } from 'react';
import { Copy, Check, Loader2, MapPin, Navigation, Send, Share2, Square, Info, AlertTriangle } from 'lucide-react';
import { SosCard, MapArt } from './SosCard';
import { RecipientPicker } from './RecipientPicker';
import { LiveLocation } from '../../hooks/useLiveLocation';
import { SosRecipients } from '../../hooks/useSosRecipients';
import { getSosDashStrings } from '../../i18n/sosDashboardStrings';
import { fill } from '../../i18n/locationStrings';
import { mapsLink, smsHref } from '../../utils/emergencyShare';
import { formatClock } from '../../utils/sosLogic';
import { LanguageCode } from '../../types';

interface Props {
  live: LiveLocation;
  recipients: SosRecipients;
  language: LanguageCode;
}

/**
 * Start/stop foreground live location sharing and send the latest position to chosen contacts.
 * "Sharing" here means the user taps SMS / Share / Copy; the browser cannot send in the background
 * and SAHAYINI cannot tell whether a message was delivered, and the text says so.
 */
export const LiveShareCard: React.FC<Props> = ({ live, recipients, language }) => {
  const D = getSosDashStrings(language);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { status, coords, lastUpdated, hidden } = live;
  const time = lastUpdated ? formatClock(lastUpdated, language) : '';
  const message = coords && lastUpdated ? fill(D.liveMsg, { time, link: mapsLink(coords) }) : '';
  const canShareApi = typeof navigator !== 'undefined' && 'share' in navigator;

  const statusText: Record<typeof status, string> = {
    idle: D.stIdle,
    requesting: D.stRequesting,
    live: D.stLive,
    stale: D.stStale,
    denied: D.stDenied,
    unsupported: D.stUnsupported,
  };

  const needContact = (e?: React.SyntheticEvent): boolean => {
    if (recipients.selected.length > 0) return true;
    e?.preventDefault();
    setNotice(D.selectOne);
    return false;
  };

  const doShare = async () => {
    if (!message || !needContact()) return;
    try {
      await navigator.share({ title: D.liveTitle, text: message });
      setNotice(D.shareOpened);
    } catch (e) {
      if ((e as { name?: string })?.name !== 'AbortError') setNotice(D.copyFail);
    }
  };

  const doCopy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setNotice(D.copied);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice(D.copyFail);
    }
  };

  const isLive = status === 'live';
  const pillTone =
    status === 'live'
      ? 'bg-blue-50 text-blue-800 border-blue-200'
      : status === 'stale' || status === 'denied' || status === 'unsupported'
      ? 'bg-slate-100 text-slate-700 border-slate-300'
      : 'bg-white text-slate-700 border-slate-200';

  return (
    <SosCard
      id="sos-live"
      title={D.liveTitle}
      desc={D.liveDesc}
      tone="blue"
      icon={<MapPin className="h-6 w-6" />}
      badge={
        isLive ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" /> {D.liveBadge}
          </span>
        ) : null
      }
    >
      <div className="relative">
        <MapArt pulse={isLive} />
        <div
          role="status"
          aria-live="polite"
          className={`absolute left-2 top-2 inline-flex max-w-[85%] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-xs ${pillTone}`}
        >
          {status === 'requesting' ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-blue-600' : 'bg-slate-400'}`} aria-hidden="true" />}
          <span className="truncate">{statusText[status]}</span>
        </div>
      </div>

      <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-slate-800">
        <p className="font-bold">{lastUpdated ? fill(D.lastUpdated, { time }) : D.notUpdated}</p>
        {coords && (
          <dl className="mt-1 grid grid-cols-2 gap-x-3 text-[11px]">
            <div className="flex justify-between gap-1">
              <dt className="text-slate-600">{D.lat}</dt>
              <dd className="font-mono">{coords.lat.toFixed(5)}</dd>
            </div>
            <div className="flex justify-between gap-1">
              <dt className="text-slate-600">{D.lng}</dt>
              <dd className="font-mono">{coords.lng.toFixed(5)}</dd>
            </div>
          </dl>
        )}
      </div>

      {status === 'stale' && (
        <p role="status" className="flex items-start gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
          <span>{fill(D.staleNote, { time: lastUpdated ? time : '—' })}</span>
        </p>
      )}
      {(status === 'denied' || status === 'unsupported') && (
        <p role="status" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
          {status === 'denied' ? D.stDenied : D.stUnsupported}
        </p>
      )}
      {live.isActive && hidden && (
        <p role="status" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
          {D.bgPaused}
        </p>
      )}

      {live.isActive ? (
        <button
          type="button"
          onClick={live.stop}
          className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#0A2E65] bg-white px-4 py-2.5 text-sm font-extrabold text-[#0A2E65] transition hover:bg-slate-50"
        >
          <Square className="h-4 w-4" aria-hidden="true" /> {D.stopLive}
        </button>
      ) : (
        <button
          type="button"
          onClick={live.start}
          className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0A2E65] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#072344]"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" /> {D.startLive}
        </button>
      )}

      {coords && message && (
        <div className="space-y-2">
          <details className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
            <summary className="min-h-8 cursor-pointer text-xs font-bold text-slate-800">
              {fill(D.chooseContacts, { n: recipients.selected.length })}
            </summary>
            <div className="mt-2">
              <RecipientPicker recipients={recipients} language={language} idPrefix="live-rcp" />
            </div>
          </details>

          <div className="flex flex-wrap gap-2">
            <a
              href={recipients.selected.length ? smsHref(recipients.selected.map((c) => c.phone), message) : undefined}
              aria-disabled={recipients.selected.length === 0}
              onClick={(e) => {
                if (!needContact(e)) return;
                setNotice(D.smsOpened);
              }}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white ${recipients.selected.length ? 'bg-blue-700 hover:bg-blue-800' : 'cursor-not-allowed bg-slate-400'}`}
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" /> {D.shareSms}
            </a>
            {canShareApi && (
              <button
                type="button"
                onClick={doShare}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" /> {D.shareShare}
              </button>
            )}
            <button
              type="button"
              onClick={doCopy}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />} {D.copyMsg}
            </button>
          </div>
        </div>
      )}

      {notice && (
        <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-900">
          {notice}
        </p>
      )}

      <p className="mt-auto flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{D.liveNote}</span>
      </p>
    </SosCard>
  );
};
