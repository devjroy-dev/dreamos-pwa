'use client';
// components/vendor/ClientBookingSheet.tsx — CE-43 · LC-2 · THE CLIENTS ADD SHEET, RE-SHAPED (R-43.5).
//
// No path creates a client without a lead. A walk-in is a lead born booked, so the Clients
// room's Add opens THIS sheet, which asks what the lead's booking act asks: name, phone,
// wedding date, package (the default preselected), the fee when the package has none (F8(a)),
// the advance received and the day it arrived.
//
// PACKET 3 (live). `Add client` posts dream-os POST /api/v2/vendor/clients/direct: the lead is
// created (source `direct`), the chosen package is attached, and the promotion act books it
// (dream-os docs/handovers/TDW_CE43_LC2_P3_HANDOVER.md §2). Outcomes: C4 and the sheet closes;
// C5 (`saved_as_lead`: the lead exists, the booking did not finish) and the sheet closes, since
// the finish is on Leads; F29 for anything else, the sheet stays open with what she typed.
// A missing name, date or package, or a field the door names, flags the field with the packet 2
// byte `Check the highlighted field.`.
// F28(b): `Advance received` is yes or no (a switch, the P9 pattern); its amount is always the
// package's deposit; `Received on` shows only on yes, today (IST) by default.
//
// ── THE CONTROL INVENTORY (CE-115) ───────────────────────────────────────────
// Replaces `AddSheet slice="clients"` as the Clients room's create surface. Its controls:
//   · Name, Phone, Email, Notes fields → Name and Phone KEPT; Email and Notes REMOVED BY
//     RULING (R-43.5's field list, C2); Wedding date, Package, Fee, Advance received,
//     Received on ADDED.
//   · `Ask TDW →` (the chat door in AddSheet's header) → REMOVED BY RULING: the sheet's act
//     is the booking, and a chat detour would file the half client R-43.5 forbids.
//   · `All details ↓` and the draft-first chips → REMOVED BY RULING: a promotion needs every
//     field at once; there is no draft client.
//   · `Add client` → KEPT (C3), its act MOVED from `POST /vendor/clients` to the promotion
//     (live at packet 3).
//   · PACKET 3: `Advance received` MOVED from an amount field to a yes/no switch (F28(b));
//     `Received on` now shows only on yes.
//   · The backdrop tap closes → KEPT.
// AddSheet itself is UNTOUCHED (ruled): the demo route still renders its clients schema.
//
// ── THE BYTES ────────────────────────────────────────────────────────────────
// C1 to C5 and F29 are founder-vetoed (lib/worklist/packages.ts; the record is the handover's
// Appendix). The package select's empty option reads `Select…`, AddSheet's existing byte,
// carried rather than coined. C-43.15 applies to package names upstream.
// Tokens only (R-42.6).
import { useEffect, useMemo, useState } from 'react';
import { fetchPackages, createDirectClient, type VendorPackage, type DirectClientInput } from '@/lib/vendor/api/vendor';
import { CLIENT_BOOKING, BOOKING, PACKAGE_FAILURES } from '@/lib/worklist/packages';
import { refreshAfterBooking } from '@/components/vendor/packages/BookingSheet';
import { istTodayISO } from '@/lib/vendor/istDay';
import { selectStyle } from '@/lib/vendor/controls';
import type { ToastKind } from '@/hooks/vendor/useToast';

const D = {
  card: 'var(--atelier-sheet-top)', border: 'var(--atelier-sheet-border)',
  muted: 'var(--atelier-ink-mute)', ink: 'var(--atelier-ink)', accent: 'var(--atelier-accent-text)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label: 'var(--font-jost), system-ui, sans-serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
};

const input: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '12px 14px', minHeight: 44,
  background: 'transparent', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
  fontFamily: F.body, fontSize: 16, color: D.ink,
};

export interface ClientBookingSheetProps {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** Called after C4 or C5, once the slices are refreshed. */
  onDone?: () => void;
}

type Field = 'name' | 'phone' | 'weddingDate' | 'packageId' | 'fee' | 'receivedOn';
const EMPTY: Record<Field, string> = { name: '', phone: '', weddingDate: '', packageId: '', fee: '', receivedOn: '' };
const WIRE_FIELD: Record<string, Field> = { name: 'name', wedding_date: 'weddingDate', package_id: 'packageId', fee: 'fee', total: 'fee', received_on: 'receivedOn' };

export function ClientBookingSheet({ open, onClose, onToast, onDone }: ClientBookingSheetProps) {
  const [packages, setPackages] = useState<VendorPackage[] | null>(null);
  const [values, setValues] = useState<Record<Field, string>>(EMPTY);
  const [advance, setAdvance] = useState(false);
  const [bad, setBad] = useState<Field | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setBad(null); setMessage(null); setBusy(false);
    setValues((v) => (v.receivedOn ? v : { ...v, receivedOn: istTodayISO() }));
    let alive = true;
    void fetchPackages().then((r) => {
      if (!alive || !r || !r.ok) return;
      setPackages(r.packages);
      const def = r.packages.find((p) => p.is_default);
      setValues((v) => (v.packageId ? v : { ...v, packageId: def ? def.id : '' }));
    }).catch(() => { /* the select stays empty; submit then flags the package field */ });
    return () => { alive = false; };
  }, [open]);

  const chosen = useMemo(
    () => (packages || []).find((p) => p.id === values.packageId) || null,
    [packages, values.packageId],
  );
  // F8(a): the sheet asks for the fee when the chosen package has none.
  const needsFee = !!chosen && chosen.total == null;

  const set = (k: Field, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  const gate = (f: Field) => { setBad(f); setMessage(PACKAGE_FAILURES.fieldGate); };

  async function submit() {
    if (busy) return;
    if (values.name.trim().length < 2) return gate('name');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.weddingDate)) return gate('weddingDate');
    if (!chosen) return gate('packageId');
    if (needsFee && !(Number(values.fee) > 0)) return gate('fee');
    if (advance && !/^\d{4}-\d{2}-\d{2}$/.test(values.receivedOn)) return gate('receivedOn');
    const body: DirectClientInput = {
      name: values.name.trim(),
      wedding_date: values.weddingDate,
      package_id: chosen.id,
      advance_received: advance,
    };
    if (values.phone.trim()) body.phone = values.phone.trim();
    if (needsFee) body.fee = Number(values.fee);
    if (advance) body.received_on = values.receivedOn;
    setBusy(true); setBad(null); setMessage(null);
    try {
      const r = await createDirectClient(body);
      if (r && r.ok) {
        refreshAfterBooking();
        onToast(CLIENT_BOOKING.added, 'success');
        setValues(EMPTY); setAdvance(false);
        onDone?.();
        onClose();
        return;
      }
      const err = r && 'error' in r ? r.error : undefined;
      if (err === 'saved_as_lead') {
        refreshAfterBooking();
        onToast(CLIENT_BOOKING.savedAsLead, 'error');
        setValues(EMPTY); setAdvance(false);
        onDone?.();
        onClose();
        return;
      }
      const field = r && !r.ok && 'field' in r && r.field ? WIRE_FIELD[r.field] : undefined;
      if (err === 'invalid' && field) gate(field);
      else setMessage(BOOKING.failed);
    } catch {
      setMessage(BOOKING.failed);
    } finally {
      setBusy(false);
    }
  }

  const flag = (f: Field): React.CSSProperties => (bad === f ? { borderColor: D.accent, borderWidth: 1.5 } : {});

  const label = (text: string) => (
    <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted,
      letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>{text}</label>
  );

  return (
    <>
      {open && (
        <div onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'var(--atelier-overlay)' }} />
      )}
      {/* CE-43 LC-2 packet 3d · F-43.94 (chair YES): inert, not aria-hidden (F-43.89's cure). */}
      <div data-lc2="client-booking-sheet" inert={!open} style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: D.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderTop: `1px solid ${D.border}`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        maxHeight: '88dvh', display: 'flex', flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--atelier-ink-dim)' }} />
        </div>
        <div style={{ padding: '6px 24px 12px', borderBottom: `1px solid ${D.border}` }}>
          <h2 style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, lineHeight: 1.5, color: D.ink, margin: 0 }}>
            {CLIENT_BOOKING.title}
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {message && <p role="alert" style={{ margin: 0, fontFamily: F.body, fontSize: 14, color: D.accent }}>{message}</p>}
          <div>{label(CLIENT_BOOKING.name)}
            <input style={{ ...input, ...flag('name') }} value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="off" />
          </div>
          <div>{label(CLIENT_BOOKING.phone)}
            <input style={input} type="tel" inputMode="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>{label(CLIENT_BOOKING.weddingDate)}
            <input style={{ ...input, ...flag('weddingDate') }} type="date" value={values.weddingDate} onChange={(e) => set('weddingDate', e.target.value)} />
          </div>
          <div>{label(CLIENT_BOOKING.pkg)}
            <select style={selectStyle({ ...input, ...flag('packageId') })} value={values.packageId} onChange={(e) => set('packageId', e.target.value)}>
              <option value="">Select…</option>
              {(packages || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {needsFee && (
            <div>{label(CLIENT_BOOKING.fee)}
              <input style={{ ...input, ...flag('fee') }} inputMode="numeric" value={values.fee} onChange={(e) => set('fee', e.target.value.replace(/[^\d]/g, ''))} />
            </div>
          )}
          <label data-lc2="advance-switch" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.body, fontSize: 15, color: D.ink, minHeight: 44 }}>
            <input type="checkbox" checked={advance} onChange={(e) => setAdvance(e.target.checked)} style={{ width: 20, height: 20, accentColor: D.accent }} />
            {CLIENT_BOOKING.advance}
          </label>
          {advance && (
            <div>{label(CLIENT_BOOKING.receivedOn)}
              <input style={{ ...input, ...flag('receivedOn') }} type="date" value={values.receivedOn} onChange={(e) => set('receivedOn', e.target.value)} />
            </div>
          )}
        </div>
        <div style={{ padding: '12px 24px 16px', borderTop: `1px solid ${D.border}` }}>
          <button type="button" onClick={() => { void submit(); }} aria-busy={busy} style={{
            width: '100%', minHeight: 48, background: 'transparent', cursor: 'pointer',
            border: `0.5px solid ${D.accent}`, borderRadius: 2,
            fontFamily: F.label, fontWeight: 300, fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: D.accent,
          }}>{CLIENT_BOOKING.submit}</button>
        </div>
      </div>
    </>
  );
}
