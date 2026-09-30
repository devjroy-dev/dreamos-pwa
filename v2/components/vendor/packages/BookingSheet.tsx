'use client';
import { RUNG_FONT as RUNG } from '@/v2/lib/worklist/theme'; // CE-45 FE-2 TYPE_2: the app's own type, holding outside the shell (F7)
// components/vendor/packages/BookingSheet.tsx — DESIGN-1 · STAGE 4 · THE ONE-TAP BOOK (the founder; words and derivations
// in lib/worklist/book.ts). It replaces the CE-43 LC-2 packet 3 sheet in the new layout; the classic layout keeps that one.
//
// One sheet, two steps, never a second sheet for the booking itself:
//   1 · BOOK. Top to bottom: how she was paid (the A2 pair, and the day the advance arrived); the DATES, each its own
//       event on her calendar (the wedding date is there already; Add a date for each function); the PACKAGE, the one
//       attached with its payment plan as one sentence and Change plan beside it, or, with none attached, her packages
//       to pick from and "No package, enter an amount"; the INVOICE, ticked and fixed, because every booking gets one.
//       Confirm booking sends it all in one act (dream-os POST /leads/:leadId/promote).
//   2 · BOOKED. What happened, in one line; the ready confirmation in its own box with Copy (R-46.17), sent only when she
//       taps Send on WhatsApp; Undo for ten seconds (it removes exactly what the booking wrote: dream-os unbooking.js);
//       Done.
// The server's refusals stay the last guard, each a NeedFirst control (R-43.16): a package without a fee or a handover
// date opens the package's own sheet at that field. Tokens only (R-42.6).
import { useEffect, useRef, useState } from 'react';
import { NeedFirst } from '@/v2/components/vendor/NeedFirst';
import type { LeadFacts } from '@/lib/vendor/bookingNeeds';
import {
  promoteLead, fetchLeadPackage, fetchPackages, attachLeadPackage, unbookBooking,
  type BookingKind, type LeadPackage, type VendorPackage, type Promoted,
} from '@/v2/lib/vendor/api/vendor';
import { LEAD_PACKAGE, PACKAGES, PACKAGE_FAILURES, BOOKING } from '@/v2/lib/worklist/packages';
import {
  BOOK, UNDO_SECONDS, MAX_DATES, functionsOf, planSentence, confirmationDraft, firstName, waLink, type DateRow,
} from '@/v2/lib/worklist/book';
import { CopyBox } from '@/v2/components/worklist/CopyBox';
import { invalidateSlice } from '@/lib/vendor/cache/invalidate';
import { formatRs } from '@/lib/vendor/format';
import { istTodayISO } from '@/lib/vendor/istDay';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { Sheet, FieldLabel, inputStyle, flagged, actionButton, primaryButton, T } from './PackageFields';
import { AttachSheet } from './LeadPackageCard';
import { HelpButton } from '@/v2/components/worklist/PageHelp'; // DESIGN-1: the sheet's "?"
import { SHEET_HELP } from '@/v2/lib/worklist/pageHelp';

type RefusalCode = keyof typeof LEAD_PACKAGE.refusals;
const isRefusal = (c: unknown): c is RefusalCode => typeof c === 'string' && c in LEAD_PACKAGE.refusals;
type Need = RefusalCode | 'received_on' | 'dates' | 'package' | 'amount' | 'advance';

/** The slices a booking changes: the lead's state, the client, the events, the invoice. */
export function refreshAfterBooking() {
  invalidateSlice('leads');
  invalidateSlice('cabinet');
  invalidateSlice('clients');
  invalidateSlice('events');
  invalidateSlice('invoices');
}

const NO_PKG = '__none__';

export function BookingSheet({ open, leadId, initialKind, onClose, onBooked, onToast, onNeedWeddingDate, leadFacts, leadName = '', leadPhone = null }: {
  open: boolean;
  leadId: string | null;
  initialKind: BookingKind;
  onClose: () => void;
  onBooked: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** R-43.16: opens the lead's wedding-date completion over this sheet; this sheet stays open. */
  onNeedWeddingDate: (leadId: string) => void;
  /** the lead's date facts from the Leads room's own read; null when unknown. */
  leadFacts: LeadFacts | null;
  /** DESIGN-1 · STAGE 4: for the confirmation draft and its WhatsApp link */
  leadName?: string;
  leadPhone?: string | null;
}) {
  const [kind, setKind] = useState<BookingKind>(initialKind);
  const [receivedOn, setReceivedOn] = useState('');
  const [dates, setDates] = useState<DateRow[]>([]);
  const [lp, setLp] = useState<LeadPackage | null | undefined>(undefined);
  const [pkgs, setPkgs] = useState<VendorPackage[] | null>(null);
  const [pick, setPick] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [advance, setAdvance] = useState('');
  const [need, setNeed] = useState<Need | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attach, setAttach] = useState<{ focus: 'fee' | 'handover' | null } | null>(null);
  const [booked, setBooked] = useState<{ p: Promoted; sent: string[] } | null>(null);
  const [left, setLeft] = useState(0);
  const dateRef = useRef<HTMLInputElement | null>(null);

  // a fresh sheet each time it opens: the lead's package, her packages, the wedding date as the first date. Keyed on the
  // date's own values, never on the leadFacts object (the room rebuilds it on every render, which reset the Booked step).
  const wd = leadFacts && leadFacts.wedding_date && leadFacts.wedding_date_precision !== 'month' && leadFacts.wedding_date_precision !== 'year'
    ? String(leadFacts.wedding_date).slice(0, 10) : '';
  useEffect(() => {
    if (!open) return;
    setKind(initialKind); setReceivedOn(istTodayISO());
    setDates([{ date: wd, title: '' }]);
    setLp(undefined); setPkgs(null); setPick(''); setAmount(''); setAdvance('');
    setNeed(null); setFailed(false); setBusy(false); setAttach(null); setBooked(null); setLeft(0);
    if (!leadId) return;
    let alive = true;
    void fetchLeadPackage(leadId).then((r) => { if (alive) setLp(r && r.ok ? r.lead_package : null); }).catch(() => { if (alive) setLp(null); });
    void fetchPackages().then((r) => {
      if (!alive) return;
      const list = r && r.ok ? r.packages : [];
      setPkgs(list);
      const def = list.find((p) => p.is_default);
      if (def) setPick(def.id);
    }).catch(() => { if (alive) setPkgs([]); });
    return () => { alive = false; };
  }, [open, initialKind, leadId, wd]);

  // the Undo's ten seconds
  useEffect(() => {
    if (!booked || left <= 0) return;
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [booked, left]);

  const chosen = pkgs && pick && pick !== NO_PKG ? pkgs.find((p) => p.id === pick) || null : null;
  const invoiceAmount = lp ? lp.total : chosen ? chosen.total : pick === NO_PKG && /^\d+$/.test(amount) ? Number(amount) : null;

  const fixFor = (code: Need) => () => {
    if (code === 'received_on') { dateRef.current?.focus(); return; }
    if (code === 'no_wedding_date') { if (leadId) onNeedWeddingDate(leadId); return; }
    if (code === 'dates' || code === 'package' || code === 'amount' || code === 'advance') return;
    setAttach({ focus: code === 'no_fee' ? 'fee' : code === 'no_handover_date' ? 'handover' : null });
  };
  const needText = (code: Need) => ({
    received_on: PACKAGE_FAILURES.fieldGate, dates: BOOK.needDate, package: BOOK.needPackage, amount: BOOK.needAmount, advance: BOOK.needAdvance,
  } as Record<string, string>)[code] ?? LEAD_PACKAGE.refusals[code as RefusalCode];

  async function confirm() {
    if (busy || !leadId) return;
    setNeed(null); setFailed(false);
    const fns = functionsOf(dates);
    if (!fns.length) { setNeed('dates'); return; }
    if (kind === 'advance_paid' && !/^\d{4}-\d{2}-\d{2}$/.test(receivedOn)) { setNeed('received_on'); return; }
    const noPkg = !lp && pick === NO_PKG;
    if (!lp && !noPkg && !chosen) { setNeed('package'); return; }
    const amt = Number(amount), adv = Number(advance);
    if (noPkg && !(/^\d+$/.test(amount) && amt > 0)) { setNeed('amount'); return; }
    if (noPkg && kind === 'advance_paid' && !(/^\d+$/.test(advance) && adv > 0 && adv <= amt)) { setNeed('advance'); return; }
    setBusy(true);
    try {
      // a package picked here is attached first, as the package card would (the booking then reads it)
      if (!lp && chosen) {
        const a = await attachLeadPackage(leadId, { package_id: chosen.id });
        if (!a || !a.ok) {
          const code = a && 'code' in a ? a.code : undefined;
          if (isRefusal(code)) setNeed(code); else setFailed(true);
          return;
        }
        setLp(a.lead_package);
      }
      const r = await promoteLead(leadId, {
        kind, functions: fns,
        ...(kind === 'advance_paid' ? { advance_received_on: receivedOn } : {}),
        ...(noPkg ? { amount: amt, ...(kind === 'advance_paid' ? { advance_amount: adv } : {}) } : {}),
      });
      if (r && r.ok) {
        refreshAfterBooking();
        setBooked({ p: r.promoted, sent: fns.map((f) => f.date) });
        setLeft(UNDO_SECONDS);
        onBooked();
        return;
      }
      const code = r && !r.ok && 'code' in r ? r.code : undefined;
      const field = r && !r.ok && 'field' in r ? r.field : undefined;
      if (isRefusal(code)) setNeed(code);
      else if (code === 'no_date') setNeed('dates');
      else if (field === 'advance_received_on') setNeed('received_on');
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function undo() {
    if (!booked || busy || !leadId) return;
    setBusy(true);
    try {
      const p = booked.p;
      const created = (p.events || []).filter((e) => e.created && e.id).map((e) => e.id as string);
      const back = p.previous_state === 'new' || p.previous_state === 'contacted' || p.previous_state === 'quoted' ? p.previous_state : 'contacted';
      const r = await unbookBooking({ lead_id: leadId, event_ids: created, back_to: back, remove_events: true, remove_invoice: !!p.invoice_created });
      if (r && r.ok) { refreshAfterBooking(); onToast(BOOK.undone, 'success'); onClose(); return; }
      onToast(BOOK.undoFailed, 'error');
    } catch {
      onToast(BOOK.undoFailed, 'error');
    } finally {
      setBusy(false);
    }
  }

  const kindButton = (k: BookingKind, text: string) => (
    <button type="button" data-lc2-kind={k} aria-pressed={kind === k}
      style={{ ...actionButton(kind === k ? 'accent' : 'mute'), flex: 1 }}
      onClick={() => { setKind(k); setNeed(null); setFailed(false); }}>
      {text}
    </button>
  );
  const head = (t: string) => <p style={{ font: RUNG.t2, color: T.ink, margin: '8px 0 0' }}>{t}</p>;

  // ── 2 · BOOKED ───────────────────────────────────────────────────────────────────────
  if (booked) {
    const first = firstName(leadName);
    const draft = confirmationDraft({ first, dates: booked.sent, total: booked.p.total ?? invoiceAmount, invoice: booked.p.invoice_number || null });
    return (
      <Sheet open={open} testId="booking-sheet" title={BOOK.bookedTitle} onClose={onClose} aside={<HelpButton id="sheet:book" title={SHEET_HELP.book.title} help={SHEET_HELP.book.help} layered />}
        footer={(
          <>
            {left > 0 && <button type="button" data-book-undo="" style={actionButton('mute')} onClick={() => { void undo(); }} aria-busy={busy}>{BOOK.undo(left)}</button>}
            <button type="button" style={primaryButton()} onClick={onClose}>{BOOK.done}</button>
          </>
        )}>
        <p data-book-booked="" style={{ font: RUNG.t3, color: T.ink, margin: 0 }}>{BOOK.bookedLine(leadName || first, booked.sent.length, booked.p.invoice_number || null)}</p>
        {head(BOOK.draftHead(first))}
        <p style={{ font: RUNG.t4, color: T.mute, margin: 0 }}>{BOOK.draftNote}</p>
        <CopyBox text={draft} label="Copy" copied="Copied" />
        <a data-book-send="" href={waLink(leadPhone, draft)} target="_blank" rel="noopener noreferrer"
          style={{ ...actionButton('accent'), display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>{BOOK.sendWa}</a>
      </Sheet>
    );
  }

  // ── 1 · BOOK ─────────────────────────────────────────────────────────────────────────
  return (
    <>
    {/* DESIGN-1 · STAGE 5a: never a sheet on a sheet. While the package sheet is open (Change plan, or a refusal's fix),
        Book steps aside and comes back, as it was, when that sheet closes. */}
    <Sheet open={open && !attach} testId="booking-sheet" title={BOOK.title} onClose={onClose} aside={<HelpButton id="sheet:book" title={SHEET_HELP.book.title} help={SHEET_HELP.book.help} layered />}
      footer={(
        <>
          <button type="button" style={actionButton('mute')} onClick={onClose}>{PACKAGES.cancel}</button>
          <button type="button" style={primaryButton()} onClick={() => { void confirm(); }} aria-busy={busy}>{BOOK.confirm}</button>
        </>
      )}>
      {need && <NeedFirst text={needText(need)} onFix={fixFor(need)} testId="booking" />}
      {failed && <p role="alert" style={{ font: RUNG.t3, margin: 0, color: T.accent }}>{BOOKING.failed}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        {kindButton('booking_confirmed', LEAD_PACKAGE.bookingConfirmed)}
        {kindButton('advance_paid', LEAD_PACKAGE.advancePaid)}
      </div>
      {kind === 'advance_paid' && (
        <div>
          <FieldLabel text={BOOKING.receivedOn} htmlFor="booking-received-on" />
          <input id="booking-received-on" ref={dateRef} type="date" style={{ ...inputStyle, ...(need === 'received_on' ? flagged : {}) }}
            value={receivedOn} onChange={(e) => { setReceivedOn(e.target.value); if (need === 'received_on') setNeed(null); }} />
        </div>
      )}

      {/* THE DATES: each its own event on her calendar */}
      <section data-book-dates="">
        {head(BOOK.datesHead)}
        <p style={{ font: RUNG.t4, color: T.mute, margin: '4px 0 8px' }}>{BOOK.datesNote}</p>
        {dates.map((d, i) => (
          <div key={i} data-book-date={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 8, alignItems: 'end', marginBottom: 16 }}>
            <div>
              <FieldLabel text={BOOK.dateLabel(i + 1)} htmlFor={`book-date-${i}`} />
              <input id={`book-date-${i}`} type="date" value={d.date} style={{ ...inputStyle, ...(need === 'dates' && !d.date ? flagged : {}) }}
                onChange={(e) => { const v = e.target.value; setDates((xs) => xs.map((x, j) => (j === i ? { ...x, date: v } : x))); if (need === 'dates') setNeed(null); }} />
            </div>

            {dates.length > 1 ? (
              <button type="button" aria-label={`${BOOK.removeDate} ${BOOK.dateLabel(i + 1)}`} style={{ ...actionButton('mute'), minWidth: 48, padding: '0 12px' }}
                onClick={() => setDates((xs) => xs.filter((_, j) => j !== i))}>{'×'}</button>
            ) : <span />}
            <div style={{ gridColumn: '1 / -1' }}>
              <FieldLabel text={BOOK.whatLabel} htmlFor={`book-what-${i}`} />
              <input id={`book-what-${i}`} type="text" value={d.title} placeholder={BOOK.whatPlaceholder} maxLength={80} style={inputStyle}
                onChange={(e) => { const v = e.target.value; setDates((xs) => xs.map((x, j) => (j === i ? { ...x, title: v } : x))); }} />
            </div>
          </div>
        ))}
        {dates.length < MAX_DATES && (
          <button type="button" data-book-add-date="" style={actionButton('accent')} onClick={() => setDates((xs) => [...xs, { date: '', title: '' }])}>{BOOK.addDate}</button>
        )}
      </section>

      {/* THE PACKAGE: the one attached, with its plan and Change plan; or pick one, or enter an amount */}
      <section data-book-package="">
        {head(BOOK.packageHead)}
        {lp === undefined ? null : lp ? (
          <div>
            <p style={{ font: RUNG.t3, color: T.ink, margin: '4px 0' }}>{lp.snapshot.name}</p>
            <div data-book-plan="" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <p style={{ font: RUNG.t4, color: T.soft, margin: 0, flex: '1 1 200px' }}>{BOOK.planHead}: {planSentence(lp.schedule)}</p>
              <button type="button" data-book-change-plan="" style={{ ...actionButton('accent'), flex: 'none' }} onClick={() => setAttach({ focus: null })}>{BOOK.changePlan}</button>
            </div>
          </div>
        ) : (
          <div role="radiogroup" aria-label={BOOK.packageHead} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {(pkgs || []).map((p) => (
              <label key={p.id} data-book-pkg={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, font: RUNG.t3, color: T.ink }}>
                <input type="radio" name="book-pkg" checked={pick === p.id} onChange={() => { setPick(p.id); setNeed(null); }} />
                <span style={{ flex: 1 }}>{p.name}</span>
                {p.total ? <span style={{ font: RUNG.t4, color: T.soft }}>{formatRs(p.total)}</span> : null}
              </label>
            ))}
            <label data-book-pkg={NO_PKG} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, font: RUNG.t3, color: T.ink }}>
              <input type="radio" name="book-pkg" checked={pick === NO_PKG} onChange={() => { setPick(NO_PKG); setNeed(null); }} />
              <span>{BOOK.noPackage}</span>
            </label>
            {pick === NO_PKG && (
              <div style={{ display: 'grid', gridTemplateColumns: kind === 'advance_paid' ? '1fr 1fr' : '1fr', gap: 8 }}>
                <div>
                  <FieldLabel text={BOOK.amountLabel} htmlFor="book-amount" />
                  <input id="book-amount" inputMode="numeric" value={amount} style={{ ...inputStyle, ...(need === 'amount' ? flagged : {}) }}
                    onChange={(e) => { setAmount(e.target.value.replace(/\D/g, '')); if (need === 'amount') setNeed(null); }} />
                </div>
                {kind === 'advance_paid' && (
                  <div>
                    <FieldLabel text={BOOK.advanceLabel} htmlFor="book-advance" />
                    <input id="book-advance" inputMode="numeric" value={advance} style={{ ...inputStyle, ...(need === 'advance' ? flagged : {}) }}
                      onChange={(e) => { setAdvance(e.target.value.replace(/\D/g, '')); if (need === 'advance') setNeed(null); }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* THE INVOICE: offered ticked, and it cannot be unticked */}
      <section data-book-invoice="">
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, font: RUNG.t3, color: T.ink }}>
          <input type="checkbox" checked disabled readOnly aria-describedby="book-invoice-note" />
          <span>{BOOK.invoiceLine(invoiceAmount)}</span>
        </label>
        <p id="book-invoice-note" style={{ font: RUNG.t4, color: T.mute, margin: 0 }}>{BOOK.invoiceNote}</p>
      </section>
    </Sheet>
    <AttachSheet
      open={!!attach}
      leadId={leadId || ''}
      current={lp || null}
      focus={attach ? attach.focus : null}
      onClose={() => setAttach(null)}
      onAttached={(row) => { setAttach(null); setNeed(null); setLp(row); }}
      onToast={onToast}
      onNeedWeddingDate={() => { if (leadId) onNeedWeddingDate(leadId); }}
      leadFacts={leadFacts}
    />
    </>
  );
}
