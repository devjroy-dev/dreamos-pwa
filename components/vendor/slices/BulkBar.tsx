'use client';
// components/vendor/slices/BulkBar.tsx — TDW_04 A2 (P4's bar, built).
// Bottom action bar in select mode: count, per-slice actions, cancel.
// Sequential execution + the `n done · m failed (retry)` summary live with the
// SliceScreen owner (state stays with the owner, per the tenancy pattern).

import type { ListSlice } from '@/hooks/vendor/useLastSlice';

export interface BulkAction { key: string; label: string; destructive?: boolean }

export interface BulkBarProps {
  slice: ListSlice;
  selectedCount: number;
  actions: BulkAction[];
  onAction: (key: string) => void;
  onCancel: () => void;
  busy?: boolean;
}

const F = { label: 'var(--font-jost), system-ui, sans-serif' };

export function BulkBar({ selectedCount, actions, onAction, onCancel, busy }: BulkBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
      background: 'var(--atelier-sheet-bg)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      borderTop: '0.5px solid var(--atelier-sheet-border)',
      padding: '12px 18px calc(14px + env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontFamily: F.label, fontWeight: 400, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-accent-text)' }}>
        {selectedCount} selected
      </span>
      <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {actions.map(a => (
          <button key={a.key} type="button" disabled={busy} onClick={() => onAction(a.key)} style={{
            padding: '9px 12px', borderRadius: 2, cursor: busy ? 'default' : 'pointer',
            border: `0.5px solid ${a.destructive ? 'rgba(224,112,112,0.5)' : 'var(--atelier-sheet-border)'}`,
            background: 'transparent', opacity: busy ? 0.5 : 1,
            fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
            color: a.destructive ? 'var(--role-critical)' : 'var(--atelier-accent-text)',
          }}>{a.label}</button>
        ))}
        <button type="button" onClick={onCancel} style={{
          padding: '9px 12px', borderRadius: 2, cursor: 'pointer', border: 'none', background: 'transparent',
          fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
          color: 'var(--atelier-ink-mute, #8a8578)',
        }}>Cancel</button>
      </div>
    </div>
  );
}
