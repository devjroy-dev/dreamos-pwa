'use client';
// components/CalendarBlockSheet.tsx
// Bottom sheet for blocking/unblocking a calendar date.
// Custom pill-picker replaces native <select> — no OS popup.

import { useState } from 'react';
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
  const [reason,  setReason]  = useState('Out of town');
  const [custom,  setCustom]  = useState('');
  const [working, setWorking] = useState(false);

  async function doBlock() {
    if (!dateIso || working) return;
    setWorking(true);
    try {
      const r = reason === 'Other' ? custom.trim() || 'Other' : reason;
      const res = await blockDate({ blocked_date: dateIso, reason: r });
      if (!res.ok) { onToast((res as { error?: string }).error ?? 'Failed to block date.', 'error'); return; }
      onToast('Date blocked', 'success');
      onRefresh(); onClose();
    } catch { onToast('Network error.', 'error'); }
    finally { setWorking(false); }
  }

  async function doUnblock() {
    if (!existingBlock || working) return;
    setWorking(true);
    try {
      const res = await unblockDate(existingBlock.id);
      if (!res.ok) { onToast((res as { error?: string }).error ?? 'Failed to unblock.', 'error'); return; }
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
