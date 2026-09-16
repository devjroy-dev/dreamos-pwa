'use client';
// components/vendor/ClientBookingSheet.tsx — CE-43 · LC-2 · THE CLIENTS ADD SHEET, RE-SHAPED (R-43.5).
//
// No path creates a client without a lead. A walk-in is a lead born booked, so the Clients
// room's Add opens THIS sheet, which asks what the lead's booking act asks: name, phone,
// wedding date, package (the default preselected), the fee when the package has none (F8(a)),
// the advance received and the day it arrived. Packet 3 wires the submit to the promotion
// act; in packet 1 the submit answers `Launching soon.` and writes nothing (R-42.14).
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
//     (packet 3; `Launching soon.` until then).
//   · The backdrop tap closes → KEPT.
// AddSheet itself is UNTOUCHED (ruled): the demo route still renders its clients schema.
//
// ── THE BYTES ────────────────────────────────────────────────────────────────
// C1 to C3 are founder-vetoed (lib/worklist/packages.ts). The package select's empty option
// reads `Select…`, AddSheet's existing byte, carried rather than coined. The act byte is
// `COPY.launchingSoon` (lib/solutions/copy.ts). C-43.15 applies to package names upstream.
// Tokens only (R-42.6).
import { useEffect, useMemo, useState } from 'react';
import { fetchPackages, type VendorPackage } from '@/lib/vendor/api/vendor';
import { CLIENT_BOOKING } from '@/lib/worklist/packages';
import { COPY } from '@/lib/solutions/copy';
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
}

type Field = 'name' | 'phone' | 'weddingDate' | 'packageId' | 'fee' | 'advance' | 'receivedOn';

export function ClientBookingSheet({ open, onClose, onToast }: ClientBookingSheetProps) {
  const [packages, setPackages] = useState<VendorPackage[] | null>(null);
  const [values, setValues] = useState<Record<Field, string>>({
    name: '', phone: '', weddingDate: '', packageId: '', fee: '', advance: '', receivedOn: '',
  });

  useEffect(() => {
    if (!open) return;
    let alive = true;
    void fetchPackages().then((r) => {
      if (!alive || !r || !r.ok) return;
      setPackages(r.packages);
      const def = r.packages.find((p) => p.is_default);
      setValues((v) => (v.packageId ? v : { ...v, packageId: def ? def.id : '' }));
    }).catch(() => { /* the select stays empty; the act is Launching soon. in packet 1 */ });
    return () => { alive = false; };
  }, [open]);

  const chosen = useMemo(
    () => (packages || []).find((p) => p.id === values.packageId) || null,
    [packages, values.packageId],
  );
  // F8(a): the sheet asks for the fee when the chosen package has none.
  const needsFee = !!chosen && chosen.total == null;

  const set = (k: Field, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

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
      <div data-lc2="client-booking-sheet" aria-hidden={!open} style={{
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
          <div>{label(CLIENT_BOOKING.name)}
            <input style={input} value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="off" />
          </div>
          <div>{label(CLIENT_BOOKING.phone)}
            <input style={input} type="tel" inputMode="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>{label(CLIENT_BOOKING.weddingDate)}
            <input style={input} type="date" value={values.weddingDate} onChange={(e) => set('weddingDate', e.target.value)} />
          </div>
          <div>{label(CLIENT_BOOKING.pkg)}
            <select style={selectStyle(input)} value={values.packageId} onChange={(e) => set('packageId', e.target.value)}>
              <option value="">Select…</option>
              {(packages || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {needsFee && (
            <div>{label(CLIENT_BOOKING.fee)}
              <input style={input} inputMode="numeric" value={values.fee} onChange={(e) => set('fee', e.target.value.replace(/[^\d]/g, ''))} />
            </div>
          )}
          <div>{label(CLIENT_BOOKING.advance)}
            <input style={input} inputMode="numeric" value={values.advance} onChange={(e) => set('advance', e.target.value.replace(/[^\d]/g, ''))} />
          </div>
          <div>{label(CLIENT_BOOKING.receivedOn)}
            <input style={input} type="date" value={values.receivedOn} onChange={(e) => set('receivedOn', e.target.value)} />
          </div>
        </div>
        <div style={{ padding: '12px 24px 16px', borderTop: `1px solid ${D.border}` }}>
          <button type="button" onClick={() => onToast(COPY.launchingSoon)} style={{
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
