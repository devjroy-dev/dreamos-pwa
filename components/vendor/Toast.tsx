'use client';
import { useEffect, useState } from 'react';
import type { ToastState } from '@/hooks/vendor/useToast';
import { useT } from '@/lib/vendor/ThemeContext';

const F = { label: 'var(--font-jost), system-ui, sans-serif' };

const SHRINK_AFTER_MS = 5000;

export function Toast({ toast }: { toast: ToastState | null }) {
  const T = useT();
  // TDW_04 A3.3 (F-04.16(a), CE-ruled): a 30-second undo window forces a
  // 30-second affordance — but not a 30-second announcement. After ~5s the
  // toast sheds its message and becomes a small tappable pill: the undo stays
  // reachable for its whole ruled life, the vendor's screen gets it back.
  // Zero mechanism change — the window is untouched.
  const [shrunk, setShrunk] = useState(false);
  useEffect(() => {
    setShrunk(false);
    if (!toast?.action) return;
    const t = setTimeout(() => setShrunk(true), SHRINK_AFTER_MS);
    return () => clearTimeout(t);
  }, [toast?.id, toast?.action]);

  if (!toast) return null;
  const isErr = toast.kind === 'error';
  const asPill = shrunk && !!toast.action;
  return (
    <div key={toast.id} style={{
      position: 'fixed', top: '50%',
      left: '50%', transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      backgroundColor: T.isLight
        ? isErr ? 'rgba(90,20,20,0.96)' : T.sheetTop
        : isErr ? 'rgba(60,20,20,0.95)' : 'rgba(20,20,18,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `0.5px solid ${isErr ? 'rgba(224,112,112,0.4)' : T.isLight ? T.sheetBorder : 'rgba(201,168,76,0.35)'}`,
      borderRadius: 999,
      padding: asPill ? '8px 14px' : '10px 18px',
      transition: 'padding 220ms cubic-bezier(0.22,1,0.36,1)',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: T.isLight
        ? isErr ? '0 8px 24px rgba(90,20,20,0.25)' : `0 8px 24px rgba(26,15,8,0.15)`
        : '0 8px 32px rgba(0,0,0,0.5)',
      maxWidth: 'calc(100vw - 40px)',
      animation: 'toastIn 220ms cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        backgroundColor: isErr ? 'var(--role-critical)' : T.isLight ? T.accent : 'var(--role-metal)',
      }} />
      {!asPill && (
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
          // F-04.75 (B6-S2, the CE's legibility line — found by contrast
          // arithmetic, not by eye): the error variant's background is DARK RED
          // in BOTH themes, but this color fell through to var(--atelier-ink),
          // which is THEME-DEPENDENT — #1A0F08 (near-black) in porcelain.
          // Near-black on dark red measured 1.5:1 (WCAG floor is 4.5:1): the
          // refusal sentence was unreadable in the light theme. Literal cream
          // now, both themes: 11.5–13.1:1 computed. The dark theme's
          // var(--atelier-ink) IS #F0E6D2, so dark renders byte-identically.
          // RATIFY-OR-REVERT (the R-B6-20 one-liner convention, named).
          color: isErr ? 'var(--atelier-ink)' : T.isLight ? T.ink : 'var(--atelier-ink)',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {toast.message}
        </span>
      )}
      {toast.action && (
        <button type="button" onClick={toast.action.onAction} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px',
          fontFamily: F.label, fontWeight: 500, fontSize: 10, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: T.isLight && !isErr ? T.accent : 'var(--atelier-label)',
        }}>{toast.action.label}</button>
      )}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translate(-50%,-50%) translateY(-8px)}to{opacity:1;transform:translate(-50%,-50%)}}`}</style>
      {/* A2 smoke fix: the animation's end-state transform was REPLACING the
          centering translate(-50%,-50%) (fill-mode both) — every toast anchored
          its left edge at 50% and clipped off narrow phones. The keyframes now
          carry the centering transform through. */}
    </div>
  );
}
