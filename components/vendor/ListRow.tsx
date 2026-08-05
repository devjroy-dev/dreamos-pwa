'use client';
// ListRow — legacy row component. Kept for reference.
// New screens use inline row rendering in app/wedding/list/[slice]/page.tsx.
import { COLORS } from '@/lib/vendor/tokens';

export interface ListRowData {
  id: string;
  primary: string;
  secondary?: string;
  amount?: string;
  date?: string;
  removable?: string;
  editable?: string;
  removePrimer?: string;
  tapPrimer: string;
}

interface ListRowProps {
  row: ListRowData;
  onTap: (row: ListRowData) => void;
  onEdit: (row: ListRowData) => void;
  onRemove: (row: ListRowData) => void;
}

export function ListRow({ row, onTap, onEdit, onRemove }: ListRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`, gap: 8 }}>
      <button type="button" onClick={() => onTap(row)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: COLORS.ink }}>{row.primary}</div>
        {row.secondary && <div style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: COLORS.muted, marginTop: 2 }}>{row.secondary}</div>}
      </button>
      {row.editable && <button type="button" onClick={() => onEdit(row)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 4 }}>Edit</button>}
      {row.removable && <button type="button" onClick={() => onRemove(row)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A12B2B', padding: 4 }}>Remove</button>}
    </div>
  );
}
