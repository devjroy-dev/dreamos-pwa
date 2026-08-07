'use client';
// components/vendor/slices/DetailSheet.tsx — TDW_03 P1
// Bottom sheet chrome (blur 40px, brass hairline) — content injected per slice.
// JSX extracted VERBATIM from the monofile's detail sheet block (ln 450–677).
// State stays with the SliceScreen owner (as in the monofile); this component
// is purely presentational. P2 injects binder-card story timelines here;
// P3 injects the wishbone. Not yet.

import type { ReactNode } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';
import { A, F, LABELS, cap, type Row } from './SliceRow';

interface DetailSheetProps {
  slice: ListSlice;
  sel: Row | null;
  onClose: () => void;
  onEditHere: (row: Row) => void;
  confirmDel: boolean;
  setConfirmDel: (b: boolean) => void;
  deleting: boolean;
  deleteMsg: string | null;
  setDeleteMsg: (m: string | null) => void;
  confirmDelete: () => void;
  /** Per-slice content rendered inside the scroll area, after the detail fields
      (invoice schedule + PDF block; lead summary + conversation thread). */
  detailExtra?: ReactNode;
  /** Per-slice content rendered at the top of the footer actions
      (leads WhatsApp/Call row). */
  footerExtra?: ReactNode;
}

export function DetailSheet({
  slice, sel, onClose, onEditHere,
  confirmDel, setConfirmDel, deleting, deleteMsg, setDeleteMsg, confirmDelete,
  detailExtra, footerExtra,
}: DetailSheetProps) {
  return (
    <>
      {sel && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'var(--atelier-overlay)' }} />}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--atelier-sheet-bg)',
        backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderTop: '0.5px solid var(--atelier-sheet-border)',
        padding: `0 0 calc(20px + env(safe-area-inset-bottom))`,
        transform: sel ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        maxHeight: '88dvh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>
        {/* Calling-card header */}
        <div style={{ padding: '6px 24px 14px', borderBottom: '0.5px solid var(--atelier-card-border)' }}>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 4 }}>{LABELS[slice]}</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', letterSpacing: '0.005em', lineHeight: 1.15 }}>{sel?.primary ?? ''}</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 24px' }}>
          {(sel?.detail ?? []).map((f, ii) => (
            <div key={ii} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '10px 0', gap: 14,
              borderBottom: ii < (sel?.detail.length ?? 0) - 1 ? '0.5px solid var(--atelier-card-border)' : 'none',
            }}>
              <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 3 }}>{f.label}</span>
              <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em', textAlign: 'right' }}>{cap(f.value)}</span>
            </div>
          ))}

          {detailExtra}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '12px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {footerExtra}

          {!confirmDel ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => sel && onEditHere(sel)} className="atelier-fab" style={{
                flex: 1, padding: '12px 16px', borderRadius: 2, cursor: 'pointer',
                border: '0.5px solid var(--atelier-label)',
                fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>Edit Here</button>

              <button type="button" onClick={() => { setConfirmDel(true); setDeleteMsg(null); }} style={{
                flex: 1, padding: '12px 16px', background: 'transparent',
                border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.red,
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>Delete</button>
            </div>
          ) : deleteMsg ? (
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16,
              color: deleteMsg.startsWith('Done') || deleteMsg.includes('cancelled') ? A.brassWarm : A.red,
              textAlign: 'center', lineHeight: 1.5, padding: '8px 0',
            }}>{deleteMsg}</div>
          ) : (
            <>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkSoft, textAlign: 'center', lineHeight: 1.6 }}>
                {slice === 'invoices' ? 'Cancel' : 'Remove'} <span style={{ color: 'var(--atelier-ink)', fontStyle: 'normal' }}>{sel?.primary}</span>?<br/>
                <span style={{ fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
                  {/* TDW_04 A3.3 (F-04.15): each line now names what its door
                      actually does. It said leads would be "marked as lost" —
                      the M3 masquerade's own words, still on screen long after
                      A2 killed the behaviour and wired the real DELETE door.
                      And it said expenses would be "permanently deleted" when
                      the door is /hide, recoverable by TDW_03's own rider.
                      Copy that outlives its behaviour is a masquerading button
                      hiding in a different file.
                      Q7 boundary: utility copy, drafted, listed in the handover
                      for founder veto. Any clause naming Victor/Donna is his
                      words and is deliberately not written here. */}
                  {/* TDW_04 A4 (founder copy law, ruled 2026-07-15): persona names
                      never in chrome. The leads line is the FOUNDER'S RULED WORDING,
                      first variant, verbatim. */}
                  {slice === 'invoices' ? 'Invoice will be marked cancelled.' :
                   slice === 'leads'    ? 'Leaves your list and your assistant\u2019s memory. Undo for 30 seconds.' :
                   slice === 'events'   ? 'Event will be cancelled.' :
                   slice === 'expenses' ? 'Expense is set aside — recoverable, never destroyed.' :
                   'This will be removed.'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setConfirmDel(false)} style={{
                  flex: 1, padding: '12px 16px', background: 'transparent',
                  border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Back</button>
                <button type="button" onClick={confirmDelete} disabled={deleting} style={{
                  flex: 1, padding: '12px 16px',
                  background: deleting ? 'rgba(224,123,92,0.4)' : A.red,
                  border: 'none', borderRadius: 2,
                  cursor: deleting ? 'default' : 'pointer',
                  fontFamily: F.label, fontWeight: 400, fontSize: 9, color: 'var(--role-ink-on-metal)',
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>{deleting ? 'Working…' : 'Confirm'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
