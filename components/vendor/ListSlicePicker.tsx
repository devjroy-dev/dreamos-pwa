'use client';
// ListSlicePicker — legacy component. Not used by new hub design.
import { COLORS } from '@/lib/vendor/tokens';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';

interface ListSlicePickerProps {
  value: ListSlice;
  onChange: (s: ListSlice) => void;
}

const LABELS: Record<ListSlice, string> = {
  clients: 'Clients', leads: 'Leads', invoices: 'Invoices',
  events: 'Events', expenses: 'Expenses',
};

export function ListSlicePicker({ value, onChange }: ListSlicePickerProps) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 20px', overflowX: 'auto' }}>
      {(Object.keys(LABELS) as ListSlice[]).map(s => (
        <button key={s} type="button" onClick={() => onChange(s)} style={{
          padding: '6px 12px', borderRadius: 999,
          backgroundColor: s === value ? COLORS.ink : 'transparent',
          border: `1px solid ${s === value ? COLORS.ink : COLORS.border}`,
          cursor: 'pointer', flexShrink: 0,
          fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 9,
          color: s === value ? COLORS.cream : COLORS.muted,
          letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>{LABELS[s]}</button>
      ))}
    </div>
  );
}
