'use client';
import { RUNG_FONT as RUNG } from '@/lib/worklist/theme'; // CE-45 FE-2 TYPE_2: the app's own type, holding outside the shell (F7)
// components/vendor/packages/BookingSheet.tsx — CE-43 · LC-2 · packet 3 · THE BOOKING SHEET (A12).
//
// One sheet, two openers:
//   · the lead's package card (LeadPackageCard): A2's `Booking confirmed` or `Advance paid`,
//     which preselects the kind;
//   · the Leads list's swipe-right `Booked` (SliceShell, F15(a)): the sheet opens, and NOTHING
//     is written until the vendor taps `Confirm booking`.
// The act is dream-os POST /leads/:leadId/promote (src/lib/vendor/promotion.js). The server
// opens the client, the event and the one invoice; this sheet computes nothing.
//
// FIELDS (vetted bytes only; the record is dream-os docs/handovers/TDW_CE43_LC2_P3_HANDOVER.md,
// Appendix):
//   · the kind, as A2's two controls (the chosen one in the accent, the other in the muted ink);
//   · A12 `Advance received on`, shown only for `Advance paid`, today (IST) by default.
// OUTCOMES: A13 on success (toast, sheet closes, the five slices refetch); A9's lines inline by
// code (`no_package`, `no_fee`); a bad or missing date flags the field with the packet 2 byte
// `Check the highlighted field.`; F29 inline for anything else, the sheet stays open.
// C-43.16: Cancel is outlined in the muted ink; Confirm booking keeps the full-width outline.
// Packet 3f · R-43.16 (founder's rule; F-43.104 the seat's, c-43.17 the chair's): every refusal line
// is a NeedFirst control and nothing redirects. `Attach a package first.` opens the attach sheet over
// this one; `Set the fee first.` opens it on the fee; `Add the handover date first.` on the handover
// field; `Add the wedding date first.` opens the lead's wedding-date completion. After the fix the
// vendor is back here and taps Confirm booking herself. 3e's separate Attach package button is gone.
// Packet 3g (CE-43, corrected on the founder's word): Confirm booking is never disabled. On a tap,
// if the lead lacks what a booking needs (lib/vendor/bookingNeeds.ts), nothing is sent: a toast says
// `Still missing: …` and the same chips the lead detail shows appear at the top, each opening its own
// fix. She taps Confirm booking again when they are gone. The refusal lines stay as the last guard.
// Tokens only (R-42.6).
import { useEffect, useRef, useState } from 'react';
import { NeedFirst } from '@/components/vendor/NeedFirst';
import { MissingChips } from '@/components/vendor/MissingChips';
import { bookingNeeds, type LeadFacts, type NeedCell } from '@/lib/vendor/bookingNeeds';
import { promoteLead, type BookingKind } from '@/lib/vendor/api/vendor';
import { LEAD_PACKAGE, PACKAGES, PACKAGE_FAILURES, BOOKING } from '@/lib/worklist/packages';
import { invalidateSlice } from '@/lib/vendor/cache/invalidate';
import { istTodayISO } from '@/lib/vendor/istDay';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { Sheet, FieldLabel, inputStyle, flagged, actionButton, primaryButton, T } from './PackageFields';
import { AttachSheet } from './LeadPackageCard';
import { fetchLeadPackage, type LeadPackage } from '@/lib/vendor/api/vendor';

type RefusalCode = keyof typeof LEAD_PACKAGE.refusals;
const isRefusal = (c: unknown): c is RefusalCode => typeof c === 'string' && c in LEAD_PACKAGE.refusals;

/** The slices a booking changes: the lead's state, the client, the event, the invoice. */
export function refreshAfterBooking() {
  invalidateSlice('leads');
  invalidateSlice('cabinet');
  invalidateSlice('clients');
  invalidateSlice('events');
  invalidateSlice('invoices');
}

export function BookingSheet({ open, leadId, initialKind, onClose, onBooked, onToast, onNeedWeddingDate, leadFacts }: {
  open: boolean;
  leadId: string | null;
  initialKind: BookingKind;
  onClose: () => void;
  onBooked: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** R-43.16: opens the lead's wedding-date completion over this sheet; this sheet stays open. */
  onNeedWeddingDate: (leadId: string) => void;
  /** 3g: the lead's date facts from the Leads room's own read; null when unknown. */
  leadFacts: LeadFacts | null;
}) {
  const [kind, setKind] = useState<BookingKind>(initialKind);
  const [receivedOn, setReceivedOn] = useState('');
  // Packet 3f · R-43.16: a refusal is a control. `need` is a line with its fix; `failed` is F29,
  // which is a failure, not a thing to add, and stays a plain line.
  const [need, setNeed] = useState<{ code: RefusalCode | 'received_on' } | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attach, setAttach] = useState<{ focus: 'fee' | 'handover' | null } | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  // 3g: the lead's package, read when the sheet opens (undefined while out), and whether the vendor
  // has tapped with something missing (the chips then track what is still missing).
  const [lp, setLp] = useState<LeadPackage | null | undefined>(undefined);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKind(initialKind);
    setReceivedOn(istTodayISO());
    setNeed(null); setFailed(false); setBusy(false); setAttach(null); setAsked(false);
    setLp(undefined);
    if (!leadId) return;
    let alive = true;
    void fetchLeadPackage(leadId)
      .then((r) => { if (alive) setLp(r && r.ok ? r.lead_package : undefined); })
      .catch(() => { /* unknown: the server decides */ });
    return () => { alive = false; };
  }, [open, initialKind, leadId]);

  const needsNow: NeedCell[] = bookingNeeds(lp, leadFacts);
  const pickNeed = (cell: string) => {
    if (cell === 'wedding_date') { if (leadId) onNeedWeddingDate(leadId); return; }
    setAttach({ focus: cell === 'fee' ? 'fee' : cell === 'handover' ? 'handover' : null });
  };

  const fixFor = (code: RefusalCode | 'received_on') => () => {
    if (code === 'received_on') { if (dateRef.current) dateRef.current.focus(); return; }
    if (code === 'no_wedding_date') { if (leadId) onNeedWeddingDate(leadId); return; }
    setAttach({ focus: code === 'no_fee' ? 'fee' : code === 'no_handover_date' ? 'handover' : null });
  };
  const needText = (code: RefusalCode | 'received_on') =>
    code === 'received_on' ? PACKAGE_FAILURES.fieldGate : LEAD_PACKAGE.refusals[code];

  async function confirm() {
    if (busy || !leadId) return;
    // 3g: nothing is sent while the lead lacks what a booking needs; the toast names it and the
    // chips at the top fix it. The server's refusals below stay as the last guard.
    if (needsNow.length) {
      setAsked(true); setNeed(null); setFailed(false);
      onToast(LEAD_PACKAGE.stillMissing(needsNow.map((c) => LEAD_PACKAGE.needLabel[c])), 'error');
      return;
    }
    if (kind === 'advance_paid' && !/^\d{4}-\d{2}-\d{2}$/.test(receivedOn)) { setNeed({ code: 'received_on' }); setFailed(false); return; }
    setBusy(true); setNeed(null); setFailed(false);
    try {
      const r = await promoteLead(leadId, kind === 'advance_paid' ? { kind, advance_received_on: receivedOn } : { kind });
      if (r && r.ok) {
        refreshAfterBooking();
        onToast(BOOKING.booked, 'success');
        onBooked();
        return;
      }
      const code = r && !r.ok && 'code' in r ? r.code : undefined;
      const field = r && !r.ok && 'field' in r ? r.field : undefined;
      if (isRefusal(code)) setNeed({ code });
      else if (field === 'advance_received_on') setNeed({ code: 'received_on' });
      else setFailed(true);
    } catch {
      setFailed(true);
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

  return (
    <>
    <Sheet
      open={open}
      testId="booking-sheet"
      title={BOOKING.confirm}
      onClose={onClose}
      footer={(
        <>
          <button type="button" style={actionButton('mute')} onClick={onClose}>{PACKAGES.cancel}</button>
          <button type="button" style={primaryButton()} onClick={() => { void confirm(); }} aria-busy={busy}>{BOOKING.confirm}</button>
        </>
      )}
    >
      {asked && (
        <MissingChips testId="booking" onPick={pickNeed}
          cells={needsNow.map((c) => ({ key: c, label: LEAD_PACKAGE.needLabel[c] }))} />
      )}
      {need && <NeedFirst text={needText(need.code)} onFix={fixFor(need.code)} testId="booking" />}
      {failed && <p role="alert" style={{ font: RUNG.t3, margin: 0, color: T.accent }}>{BOOKING.failed}</p>}
      <div style={{ display: 'flex', gap: 10 }}>
        {kindButton('booking_confirmed', LEAD_PACKAGE.bookingConfirmed)}
        {kindButton('advance_paid', LEAD_PACKAGE.advancePaid)}
      </div>
      {kind === 'advance_paid' && (
        <div>
          <FieldLabel text={BOOKING.receivedOn} htmlFor="booking-received-on" />
          <input id="booking-received-on" ref={dateRef} type="date" style={{ ...inputStyle, ...(need && need.code === 'received_on' ? flagged : {}) }}
            value={receivedOn} onChange={(e) => { setReceivedOn(e.target.value); if (need && need.code === 'received_on') setNeed(null); }} />
        </div>
      )}
    </Sheet>
    <AttachSheet
      open={!!attach}
      leadId={leadId || ''}
      current={null}
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
