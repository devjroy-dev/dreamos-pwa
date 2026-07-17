'use client';
// components/vendor/FreshThreadControl.tsx — TDW_06 D-7: the new-thread button.
//
// D-4's law, honoured in structure not caption: the button must not say — or
// act like — "Clear chat". Nothing on screen is cleared; on confirm the server
// abandons the active conversation (memory.ts's own shape, never a delete) and
// the on-screen scrollback gains a visible seam ("Fresh thread") with every
// message above it standing exactly where it was. The persistence is a thing
// the vendor SEES, not a sentence they are asked to believe.
//
// Confirm is INLINE (the estate's convention — RemoveConfirmModal's own header
// records that modals retired into inline confirms). One tap opens the confirm
// row; [Start fresh] fires the endpoint; [Keep going] folds it away.
//
// COPY (all four strings on the veto-on-sight list; persona-free per the A4
// copy law): trigger `Start a fresh thread` (founder YES, recorded at sitting
// open) · body `A clean start on your next message — everything above stays
// right here.` · confirm `Start fresh` · dismiss `Keep going`.
import { useState } from 'react';
import { useT } from '@/lib/vendor/ThemeContext';

const F = { label: 'var(--font-jost), system-ui, sans-serif' };

export function FreshThreadControl({ onConfirm, disabled }: {
  onConfirm: () => Promise<boolean>;
  disabled?: boolean;
}) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const dim  = T.isLight ? 'rgba(26,15,8,0.5)'  : 'rgba(233,228,217,0.42)';
  const line = T.isLight ? 'rgba(122,56,40,0.40)' : 'rgba(201,168,76,0.45)';
  const accent = T.isLight ? T.accent : 'var(--atelier-label)';

  async function confirm() {
    if (busy) return;
    setBusy(true);
    const ok = await onConfirm();
    setBusy(false);
    if (ok) setOpen(false); // the divider in the thread is the confirmation — no toast
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '2px 22px 4px' }}>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          style={{
            background: 'none', border: 'none', padding: '4px 0', cursor: disabled ? 'default' : 'pointer',
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: dim, opacity: disabled ? 0.4 : 1,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ color: accent }}>↺</span>
          Start a fresh thread
        </button>
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7,
          padding: '8px 12px', borderRadius: 2,
          border: `0.5px solid ${line}`,
          background: 'var(--atelier-input-bg)',
          maxWidth: 320,
        }}>
          <span style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 11, lineHeight: 1.5,
            letterSpacing: '0.01em', color: dim, textAlign: 'right' as const,
          }}>
            A clean start on your next message — everything above stays right here.
          </span>
          <div style={{ display: 'flex', gap: 7 }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={busy}
              style={{
                height: 30, paddingInline: 12, background: 'transparent',
                border: `0.5px dashed ${line}`, borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                color: dim, whiteSpace: 'nowrap' as const,
              }}
            >Keep going</button>
            <button
              type="button"
              onClick={confirm}
              disabled={busy}
              style={{
                height: 30, paddingInline: 12, background: 'var(--atelier-input-bg)',
                border: `0.5px solid ${line}`, borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                color: accent, whiteSpace: 'nowrap' as const, opacity: busy ? 0.5 : 1,
              }}
            >{busy ? 'Starting…' : 'Start fresh'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
