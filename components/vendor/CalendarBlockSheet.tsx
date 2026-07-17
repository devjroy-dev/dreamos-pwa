'use client';
// components/CalendarBlockSheet.tsx
// Bottom sheet for blocking/unblocking a calendar date.
// Custom pill-picker replaces native <select> — no OS popup.

import { useEffect, useState } from 'react';
import { blockDate, unblockDate } from '@/lib/vendor/api/vendor';
import type { ToastKind } from '@/hooks/vendor/useToast';

// ── Glass tokens (matching Phase 1 + glass upgrade) ──────────────────────────
const SHEET: React.CSSProperties = {
  background: 'var(--atelier-sheet-top)',
  backdropFilter: 'blur(40px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
};
const D = {
  border: '0.5px solid var(--atelier-card-border)',
  borderStrong: '0.5px solid rgba(201,168,76,0.35)',
  muted: 'var(--atelier-ink-mute)',
  cream: 'var(--atelier-ink)',
  gold: '#C9A84C',
  red: '#E07070',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label: 'var(--font-jost), system-ui, sans-serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
};
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const BLOCK_REASONS = [
  'Out of town', 'Family event', 'Personal', 'Health', 'Already booked elsewhere', 'Other',
];

interface BlockInfo { id: string; reason: string | null; }
interface DaySheetEvent { id: string; title: string; kind: string; event_time: string | null; state: string; }
interface Props {
  open: boolean;
  dateIso: string | null;
  existingBlock: BlockInfo | null;
  onClose: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  onRefresh: () => void;
  events?: DaySheetEvent[];
}

function fmtDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3])} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m[2])-1]} ${m[1]}`;
}

// ── Pill picker — no native OS dropdown ──────────────────────────────────────
function PillPicker({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 8,
      padding: '4px 0',
    }}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)} style={{
            padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: active ? 'var(--atelier-input-border)' : 'var(--atelier-input-bg)',
            outline: active ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid rgba(255,255,255,0.08)',
            fontFamily: F.label, fontWeight: active ? 400 : 300, fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: active ? D.cream : D.muted,
            transition: `all 180ms ${EASE}`,
            WebkitTapHighlightColor: 'transparent',
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

export function CalendarBlockSheet({
  open, dateIso, existingBlock, onClose, onToast, onRefresh, events,
}: Props) {
  // ── TDW_04 B1 SEAL RIDER — F-04.35 (CE-ruled 2026-07-15) ──────────────────
  // The default was 'Out of town'. That was a harmless UX shrug for as long as
  // `reason` wrote to vendor_availability.reason — a column NOTHING rendered. B1's
  // convergence made `reason` become public.events.title: shown on the grid, in the
  // day sheet, through /api/v2/vendor/events, and across all of B5. So a vendor who
  // blocks a date for a family wedding and never touches the pill now has "Out of
  // town" PRINTED ON THEIR CALENDAR. (Founder specimen 2026-07-15: the 22nd reads
  // "Out of town"; he never chose it.) B1 didn't cause the default — it made it
  // visible, and a shrug against a dead column is a correctness bug against a title.
  //
  // 'Blocked' is never wrong, and it matches the backend's ruled fallback (Q-B1-6:
  // title = reason verbatim, else 'Blocked').
  //
  // NOTE, DISCLOSED: 'Blocked' is deliberately NOT in BLOCK_REASONS, so the picker
  // opens with NO pill highlighted. That is intended here — it incidentally delivers
  // the "no default" behaviour logged as B5 polish: nothing is pre-chosen, and a
  // vendor who picks nothing gets a title that is merely true. If the CE would rather
  // 'Blocked' render as a selectable pill, add it to BLOCK_REASONS — one line.
  const [reason,  setReason]  = useState('Blocked');
  const [custom,  setCustom]  = useState('');
  const [working, setWorking] = useState(false);
  // ── TDW_04 B6 rider — F-04.77's RENDER half (Q-S2-1 ADOPTED) ──────────────
  // The shared Toast is a single-line pill (nowrap + ellipsis); the exclusivity
  // refusal, which R-B6-17 REQUIRES to name the existing blocks, cannot fit one
  // line by construction — the founder watched his own refusal truncate (smoke
  // steps 2/8). A refusal the vendor can't finish reading is F-04.55's disease
  // at the render layer. Cure: this sheet gains the day sheet's OWN inline
  // verdict line — ONE rendering convention for refusals (F-04.36's shape
  // argued forward): refusals render inline and whole, verbatim off the wire;
  // toasts keep successes and transport errors (both fit a line). Styles are
  // CalendarDaySheet's verdict block, carried byte-for-byte — the same panel
  // the founder witnessed legible in porcelain at the Move verdict.
  const [verdict, setVerdict] = useState<string | null>(null);
  useEffect(() => { setVerdict(null); }, [open, dateIso]);

  async function doBlock() {
    if (!dateIso || working) return;
    setWorking(true);
    try {
      const r = reason === 'Other' ? custom.trim() || 'Other' : reason;
      setVerdict(null);
      const res = await blockDate({ blocked_date: dateIso, reason: r });
      // F-04.77: the refusal renders INLINE, whole, the wire's own sentence —
      // never the one-line toast (which truncated it).
      if (!res.ok) { setVerdict((res as { error?: string }).error ?? 'Failed to block date.'); return; }
      onToast('Date blocked', 'success');
      onRefresh(); onClose();
    } catch { onToast('Network error.', 'error'); }
    finally { setWorking(false); }
  }

  async function doUnblock() {
    if (!existingBlock || working) return;
    setWorking(true);
    try {
      setVerdict(null);
      const res = await unblockDate(existingBlock.id);
      if (!res.ok) { setVerdict((res as { error?: string }).error ?? 'Failed to unblock.'); return; }  // F-04.77: same convention
      onToast('Date unblocked', 'success');
      onRefresh(); onClose();
    } catch { onToast('Network error.', 'error'); }
    finally { setWorking(false); }
  }

  return (
    <>
      {/* Scrim */}
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'var(--atelier-overlay-bg)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }} />
      )}

      {/* Sheet */}
      <div style={{
        ...SHEET,
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderTop: D.borderStrong,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        padding: `0 0 calc(24px + env(safe-area-inset-bottom))`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 320ms ${EASE}`,
      }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>

        {/* Title row */}
        <div style={{ padding: '6px 24px 16px', borderBottom: D.border }}>
          <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: 'var(--atelier-accent-text)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            {dateIso ? fmtDate(dateIso) : ''}
          </p>
          <h2 style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream, marginTop: 2 }}>
            {existingBlock ? 'Blocked date' : 'Block this date'}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* The verdict line — the wire's sentence, verbatim, never softened.
              (F-04.77's cure; the day sheet's own block, styles byte-for-byte.) */}
          {verdict && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              border: '0.5px solid rgba(224,112,112,0.4)', background: 'rgba(180,40,40,0.10)',
              fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.red,
            }}>{verdict}</div>
          )}
          {(() => {
            const onDay = (events ?? []).filter((e) => e.state !== 'cancelled');
            if (!onDay.length) return null;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12, borderBottom: D.border }}>
                <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: 'var(--atelier-accent-text)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>On this day</span>
                {onDay.map((e) => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: 'var(--atelier-accent-text)', minWidth: 54 }}>
                      {e.event_time ? e.event_time.slice(0, 5) : 'all day'}
                    </span>
                    <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.cream, flex: 1 }}>
                      {e.title}{e.kind ? <span style={{ color: D.muted }}> · {e.kind}</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
          {existingBlock ? (
            <>
              {existingBlock.reason && (
                <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted }}>
                  Reason: <span style={{ color: D.cream }}>{existingBlock.reason}</span>
                </p>
              )}
              <button type="button" onClick={doUnblock} disabled={working} style={{
                width: '100%', padding: '13px 0',
                background: working ? 'rgba(122,26,26,0.4)' : 'rgba(180,40,40,0.18)',
                border: '0.5px solid rgba(224,112,112,0.4)',
                borderRadius: 999, cursor: working ? 'default' : 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 10,
                color: D.red, letterSpacing: '0.3em', textTransform: 'uppercase',
              }}>
                {working ? 'Working…' : 'Unblock'}
              </button>
            </>
          ) : (
            <>
              <div>
                <label style={{
                  display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 9,
                  color: D.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12,
                }}>Reason</label>
                <PillPicker options={BLOCK_REASONS} value={reason} onChange={setReason} />
              </div>

              {reason === 'Other' && (
                <input
                  value={custom} onChange={e => setCustom(e.target.value)}
                  placeholder="Specify reason…"
                  style={{
                    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                    background: 'var(--atelier-input-bg)',
                    border: '0.5px solid var(--atelier-card-border)',
                    borderRadius: 10, fontFamily: F.body, fontWeight: 300, fontSize: 14,
                    color: D.cream, outline: 'none', colorScheme: 'dark',
                  }}
                />
              )}

              <button type="button" onClick={doBlock} disabled={working} style={{
                width: '100%', padding: '13px 0',
                background: working ? 'var(--atelier-input-border)' : 'var(--atelier-accent-text)',
                border: 'none', borderRadius: 999, cursor: working ? 'default' : 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111111',
                letterSpacing: '0.3em', textTransform: 'uppercase',
              }}>
                {working ? 'Working…' : 'Block date'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
