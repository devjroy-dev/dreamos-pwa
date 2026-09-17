'use client';
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
// Packet 3e · F-43.102 (b): on a `no_package` refusal the sheet offers A2's `Attach package`, which
// opens the attach sheet over it; once attached, the refusal clears and Confirm booking can run.
// Tokens only (R-42.6).
import { useEffect, useState } from 'react';
import { promoteLead, type BookingKind } from '@/lib/vendor/api/vendor';
import { LEAD_PACKAGE, PACKAGES, PACKAGE_FAILURES, BOOKING } from '@/lib/worklist/packages';
import { invalidateSlice } from '@/lib/vendor/cache/invalidate';
import { istTodayISO } from '@/lib/vendor/istDay';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { Sheet, FieldLabel, inputStyle, flagged, actionButton, primaryButton, T } from './PackageFields';
import { AttachSheet } from './LeadPackageCard';

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

export function BookingSheet({ open, leadId, initialKind, onClose, onBooked, onToast }: {
  open: boolean;
  leadId: string | null;
  initialKind: BookingKind;
  onClose: () => void;
  onBooked: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}) {
  const [kind, setKind] = useState<BookingKind>(initialKind);
  const [receivedOn, setReceivedOn] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);
  const [needsPackage, setNeedsPackage] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKind(initialKind);
    setReceivedOn(istTodayISO());
    setMessage(null); setBad(false); setBusy(false);
    setNeedsPackage(false); setAttachOpen(false);
  }, [open, initialKind]);

  async function confirm() {
    if (busy || !leadId) return;
    if (kind === 'advance_paid' && !/^\d{4}-\d{2}-\d{2}$/.test(receivedOn)) { setBad(true); setMessage(PACKAGE_FAILURES.fieldGate); return; }
    setBusy(true); setMessage(null); setBad(false);
    try {
      const r = await promoteLead(leadId, kind === 'advance_paid' ? { kind, advance_received_on: receivedOn } : { kind });
      if (r && r.ok) {
        refreshAfterBooking();
        onToast(BOOKING.booked, 'success');
        onBooked();
        return;
      }
      const code = r && !r.ok && 'code' in r ? r.code : undefined;
      if (isRefusal(code)) { setMessage(LEAD_PACKAGE.refusals[code]); setNeedsPackage(code === 'no_package'); }
      else {
        const field = r && !r.ok && 'field' in r ? r.field : undefined;
        if (field === 'advance_received_on') { setBad(true); setMessage(PACKAGE_FAILURES.fieldGate); }
        else setMessage(BOOKING.failed);
      }
    } catch {
      setMessage(BOOKING.failed);
    } finally {
      setBusy(false);
    }
  }

  const kindButton = (k: BookingKind, text: string) => (
    <button type="button" data-lc2-kind={k} aria-pressed={kind === k}
      style={{ ...actionButton(kind === k ? 'accent' : 'mute'), flex: 1 }}
      onClick={() => { setKind(k); setMessage(null); setBad(false); }}>
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
      {message && <p role="alert" style={{ margin: 0, fontFamily: T.body, fontSize: 14, color: T.accent }}>{message}</p>}
      {needsPackage && (
        <button type="button" data-lc2="booking-attach" style={actionButton()} onClick={() => setAttachOpen(true)}>{LEAD_PACKAGE.attach}</button>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        {kindButton('booking_confirmed', LEAD_PACKAGE.bookingConfirmed)}
        {kindButton('advance_paid', LEAD_PACKAGE.advancePaid)}
      </div>
      {kind === 'advance_paid' && (
        <div>
          <FieldLabel text={BOOKING.receivedOn} htmlFor="booking-received-on" />
          <input id="booking-received-on" type="date" style={{ ...inputStyle, ...(bad ? flagged : {}) }}
            value={receivedOn} onChange={(e) => setReceivedOn(e.target.value)} />
        </div>
      )}
    </Sheet>
    <AttachSheet
      open={attachOpen}
      leadId={leadId || ''}
      current={null}
      onClose={() => setAttachOpen(false)}
      onAttached={() => { setAttachOpen(false); setNeedsPackage(false); setMessage(null); }}
      onToast={onToast}
    />
    </>
  );
}
