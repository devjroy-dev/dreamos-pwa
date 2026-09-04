// R-37.80: the selected chip is a CONTROL, so it carries the signal, not the metal. It sat
// outside ZIP 5’s split because it reads a raw CSS variable rather than A.brass — a whole
// class the classifier was structurally blind to. Converted here with its class-mates below.
'use client';
// components/vendor/slices/FilterRail.tsx — TDW_04 A4 (P4's rail, built).
// Sticky chips under search. Per-slice sets (owner supplies chips+counts);
// single-select; tap the active chip again to clear. Pure presentational.

import type { ListSlice } from '@/hooks/vendor/useLastSlice';

export interface FilterChip { key: string; label: string; count?: number }

export interface FilterRailProps {
  slice: ListSlice;
  chips: FilterChip[];
  active: string | null;
  onSelect: (key: string | null) => void;
}

const F = { label: 'var(--font-jost), system-ui, sans-serif' };

export function FilterRail({ chips, active, onSelect }: FilterRailProps) {
  if (!chips.length) return null;
  return (
    <div style={{
      display: 'flex', gap: 6, overflowX: 'auto', padding: '2px var(--slice-inset, 22px) 10px',
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }}>
      {chips.map(c => {
        const on = active === c.key;
        return (
          <button key={c.key} type="button" onClick={() => onSelect(on ? null : c.key)} style={{
            flexShrink: 0, padding: '6px 11px', borderRadius: 999, cursor: 'pointer',
            border: `0.5px solid ${on ? 'var(--atelier-accent-text)' : 'var(--atelier-card-border)'}`,
            background: on ? 'rgba(201,168,76,0.12)' : 'transparent',
            fontFamily: F.label, fontWeight: on ? 400 : 300, fontSize: 9,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: on ? 'var(--atelier-accent-text)' : 'var(--atelier-ink-mute, #8a8578)',
          }}>
            {c.label}{c.count != null ? ` · ${c.count}` : ''}
          </button>
        );
      })}
    </div>
  );
}
