// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// components/vendor/slices/DetailSheet.tsx — TDW_03 P1
// Bottom sheet chrome (blur 40px, brass hairline) — content injected per slice.
// JSX extracted VERBATIM from the monofile's detail sheet block (ln 450–677).
// State stays with the SliceScreen owner (as in the monofile); this component
// is purely presentational. P2 injects binder-card story timelines here;
// P3 injects the wishbone. Not yet.

import type { ReactNode } from 'react';
import { SheetLayer, sheetBound, useSheetScrollReset, SHEET_BODY_SCROLL, SHEET_BOTTOM, SHEET_SAFE } from '@/components/vendor/SheetLayer';
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
  /** CE-43 LC-2 packet 3c · 1(a): per-slice content rendered at the TOP of the scroll area,
      above the detail fields (the lead's package card and its booking controls). */
  detailTop?: ReactNode;
  /** CE-43 LC-2 packet 3f · F-43.105, amended 3g · F-43.107: while the record's first read is out the
      body is empty (no placeholder), and it renders whole once the read is in. */
  bodyLoading?: boolean;
  /** CE-43 LC-2 packet 3g · F-43.109: the "Still missing" chips, directly under `detailTop` and above
      the detail rows. Absent when nothing is missing. */
  detailMissing?: ReactNode;
  /** CE-43 LC-2 packet 3h · F-43.111 (the seat's cure, chair-ratified): the sheet opens at its full
      height from the first frame, so the body fills a sheet already in place and nothing on screen
      moves when the record's read lands. The sheet is bottom-anchored; a content-sized sheet grows
      upward and carries its header with it. */
  fullHeight?: boolean;
  /** Per-slice content rendered at the top of the footer actions
      (leads WhatsApp/Call row). */
  footerExtra?: ReactNode;
}

export function DetailSheet({
  slice, sel, onClose, onEditHere,
  confirmDel, setConfirmDel, deleting, deleteMsg, setDeleteMsg, confirmDelete,
  detailExtra, detailTop, detailMissing, footerExtra, bodyLoading = false, fullHeight = false,
}: DetailSheetProps) {
  // Packet 3j · F-43.116: the record sheet mounts through the one vendor layer (components/vendor/
  // SheetLayer.tsx). A sheet opened over it (the booking sheet, the date completion) covers it with its
  // own backdrop and leaves it inert; its height is bounded by the visible viewport as well as 88dvh.
  const open = !!sel;
  const bodyRef = useSheetScrollReset<HTMLDivElement>(open);
  return (
    <SheetLayer open={open} testId="detail-sheet">{(z) => (<>
      {sel && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: z.scrim, background: 'var(--atelier-overlay)' }} />}
      <div data-lc2="detail-sheet" inert={!open} style={{
        position: 'fixed', bottom: SHEET_BOTTOM, left: 0, right: 0, zIndex: z.panel,
        background: 'var(--atelier-sheet-bg)',
        backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderTop: '0.5px solid var(--atelier-sheet-border)',
        padding: `0 0 calc(20px + ${SHEET_SAFE})`,
        transform: sel ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        maxHeight: sheetBound('88dvh'), ...(fullHeight ? { height: sheetBound('88dvh') } : {}), boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>
        {/* Calling-card header */}
        <div style={{ padding: '6px 24px 14px', borderBottom: '0.5px solid var(--atelier-card-border)', flexShrink: 0 }}>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 4 }}>{LABELS[slice]}</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', letterSpacing: '0.005em', lineHeight: 1.15 }}>{sel?.primary ?? ''}</div>
        </div>

        <div ref={bodyRef} data-sheet-body="" style={{ flex: 1, ...SHEET_BODY_SCROLL, overflowX: 'hidden', padding: '12px 24px' }}>
          {/* 3g · F-43.107: no fixed-height placeholder. Until the record's first read is in the body
              is empty, and then it renders whole, so nothing already on screen moves. */}
          {bodyLoading ? null : (<>
          {detailTop}
          {detailMissing}
          {(sel?.detail ?? []).map((f, ii) => (
            <div key={ii} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '10px 0', gap: 14,
              borderBottom: ii < (sel?.detail.length ?? 0) - 1 ? '0.5px solid var(--atelier-card-border)' : 'none',
            }}>
              <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 3 }}>{f.label}</span>
              <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em', textAlign: 'right', whiteSpace: 'pre-line' }}>{f.verbatim ? f.value : cap(f.value)}</span>
            </div>
          ))}

          {detailExtra}
          </>)}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '12px 24px 0', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          {footerExtra}

          {!confirmDel ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => sel && onEditHere(sel)} className="atelier-fab" style={{
                flex: 1, padding: '12px 16px', borderRadius: 2, cursor: 'pointer',
                border: '0.5px solid var(--atelier-label)',
                fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>Edit Here</button>

              {/* ── R-41.70 §A 4 · IT SAYS WHAT IT DELETES ──────────────────
                  On an invoice this button sits directly beneath the payment
                  schedule, and the founder's walk read it as the schedule's. The
                  schedule has its own Remove in the panel header now; this one
                  names the invoice so the two can never be confused. */}
              <button type="button" onClick={() => { setConfirmDel(true); setDeleteMsg(null); }} style={{
                flex: 1, padding: '12px 16px', background: 'transparent',
                border: '0.5px solid var(--role-critical)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.red,
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>{slice === 'invoices' ? 'Delete invoice' : 'Delete'}</button>
            </div>
          ) : deleteMsg ? (
            <div style={{
              fontFamily: F.script, fontWeight: 300, fontSize: 16,
              color: deleteMsg.startsWith('Done') || deleteMsg.includes('cancelled') ? A.brassWarm : A.red,
              textAlign: 'center', lineHeight: 1.5, padding: '8px 0',
            }}>{deleteMsg}</div>
          ) : (
            <>
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, textAlign: 'center', lineHeight: 1.6 }}>
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
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Back</button>
                <button type="button" onClick={confirmDelete} disabled={deleting} style={{
                  flex: 1, padding: '12px 16px',
                  background: 'transparent', opacity: deleting ? 0.5 : 1,
                  border: '0.5px solid var(--role-critical)', borderRadius: 2,
                  cursor: deleting ? 'default' : 'pointer',
                  fontFamily: F.label, fontWeight: 400, fontSize: 9, color: 'var(--role-critical)',
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>{deleting ? 'Working…' : 'Confirm'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>)}</SheetLayer>
  );
}
