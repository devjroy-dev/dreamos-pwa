'use client';
import type { ToastState } from '@/hooks/vendor/useToast';
import { useT } from '@/lib/vendor/ThemeContext';

const F = { label: 'var(--font-jost), system-ui, sans-serif' };

export function Toast({ toast }: { toast: ToastState | null }) {
  const T = useT();
  if (!toast) return null;
  const isErr = toast.kind === 'error';
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
      padding: '10px 18px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: T.isLight
        ? isErr ? '0 8px 24px rgba(90,20,20,0.25)' : `0 8px 24px rgba(26,15,8,0.15)`
        : '0 8px 32px rgba(0,0,0,0.5)',
      maxWidth: 'calc(100vw - 40px)',
      animation: 'toastIn 220ms cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        backgroundColor: isErr ? '#E07070' : T.isLight ? T.accent : '#C9A84C',
      }} />
      <span style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 12,
        color: T.isLight && !isErr ? T.ink : 'var(--atelier-ink)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {toast.message}
      </span>
      {toast.action && (
        <button type="button" onClick={toast.action.onAction} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px',
          fontFamily: F.label, fontWeight: 500, fontSize: 12, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: T.isLight && !isErr ? T.accent : '#E0BC6E',
        }}>{toast.action.label}</button>
      )}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
