'use client';
// ActionCard — legacy component. Not used by new screens.
// Kept for potential future use. Types updated to new paths.
import { COLORS } from '@/lib/vendor/tokens';

export type CardState = 'active' | 'confirmed' | 'cancelled';
export interface PendingTool {
  id: string; name: string; input: Record<string, unknown>; preview: string;
}

interface ActionCardProps {
  pendingTool: PendingTool;
  cardState: CardState;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export function ActionCard({ pendingTool, cardState, onConfirm, onCancel }: ActionCardProps) {
  const isActive = cardState === 'active';
  return (
    <div style={{ margin: '4px 20px 8px', padding: 14, backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 9, color: COLORS.gold, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Action</span>
      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 16, color: COLORS.ink, lineHeight: 1.45 }}>{pendingTool.preview}</p>
      {isActive ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => onConfirm(pendingTool.id)} style={{ flex: 1, padding: '10px 14px', backgroundColor: COLORS.ink, border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-jost)', fontWeight: 400, fontSize: 10, color: COLORS.cream, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Confirm</button>
          <button type="button" onClick={() => onCancel(pendingTool.id)} style={{ flex: 1, padding: '10px 14px', backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 10, color: COLORS.muted, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Cancel</button>
        </div>
      ) : (
        <span style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 9, color: cardState === 'confirmed' ? COLORS.gold : COLORS.muted, letterSpacing: '0.3em', textTransform: 'uppercase' }}>{cardState === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span>
      )}
    </div>
  );
}
