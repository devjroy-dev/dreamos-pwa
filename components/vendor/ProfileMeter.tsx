'use client';
// components/vendor/ProfileMeter.tsx — the brass arc, MOVED whole from the
// profile page (TDW_09 Phase B, F11(c) precedent) so Storefront §1 and the
// profile screen render one meter, one look, one number.
import { A, F } from '@/components/vendor/AtelierForm';

// ── The meter: a brass arc. The screen's single gold, per the house law. ──────────
export function Meter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score));
  const R = 52, C = Math.PI * R;           // half-circumference — the arc is a semicircle
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
      <svg width="140" height="80" viewBox="0 0 140 80" role="img"
           aria-label={`Profile completeness ${Math.round(pct * 100)} percent`}>
        <path d="M 18 70 A 52 52 0 0 1 122 70" fill="none"
              stroke="rgba(201,168,76,0.16)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 18 70 A 52 52 0 0 1 122 70" fill="none"
              stroke="var(--role-metal)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${C * pct} ${C}`}
              style={{ transition: 'stroke-dasharray 420ms cubic-bezier(0.22,1,0.36,1)' }} />
      </svg>
      <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 25, lineHeight: 1.5, color: A.ink, marginTop: -18 }}>
        {Math.round(pct * 100)}
      </div>
      <div style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.42em',
        textTransform: 'uppercase', color: A.inkMute, marginTop: 4,
      }}>Profile strength</div>
    </div>
  );
}
