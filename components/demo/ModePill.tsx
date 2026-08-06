'use client';
// components/demo/ModePill.tsx — THE RETIRED PILL, RELOCATED TO ITS LAST READER.
//
// TDW_09 PACKAGE 2 · fork 8.4/8.5 (chair relay #3): the live vendor nav retired
// `ModePill` by subtraction with the mode (R-X27 arm (a) — the five stable
// doors). The DEMO twin is DECLARED-HELD on the OLD two-membership nav under
// F-09.89, founder-sequenced — and the held state includes this pill, which
// DemoVendorHeader still renders. So the pill does not die; it MOVES to the one
// lane that still speaks its vocabulary, byte-preserved from
// components/vendor/BottomNav.tsx at base 84848e8 (only the imports and this
// header changed). Same warrant as SwipeRow's `data-pager-inert` surviving for
// the demo pager: the held twin's organs stay whole until its own rider retires
// them together (F-09.89's pre-noted cure: the twin adopts the five-door bar
// wholesale).
//
// When F-09.89's rider lands, this file retires WITH the demo's old nav — a
// named line in that sitting's delivery, never a silent orphan.

import { useT } from '@/lib/vendor/ThemeContext';
import type { VendorMode } from '@/hooks/vendor/useVendorMode';

const A = {
  inkMute:   'var(--atelier-ink-mute)',
  brassWarm: 'var(--atelier-label)',
} as const;
const F = {
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

interface ModePillProps {
  key?: React.Key; mode: VendorMode; onChange: (m: VendorMode) => void; }

const SEGMENTS: { key: VendorMode; label: string; star?: boolean }[] = [
  { key: 'studio',   label: 'Studio' },
  { key: 'ai',       label: 'AI',  star: true },
  { key: 'discover', label: 'Discover' },
];

export function ModePill({ mode, onChange }: ModePillProps) {
  const T = useT();
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--atelier-input-bg)',
      border: '0.5px solid rgba(201,168,76,0.22)',
      borderRadius: 999, padding: 3,
    }}>
      {SEGMENTS.map(seg => {
        const active = mode === seg.key;
        return (
          <button key={seg.key} type="button" onClick={() => onChange(seg.key)} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 11px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
            boxShadow: active ? 'inset 0 0 0 0.5px rgba(201,168,76,0.5)' : 'none',
            transition: `all 200ms ${EASE}`,
            WebkitTapHighlightColor: 'transparent',
          }}>
            {seg.star && (
              <span style={{
                fontSize: 16,
                color: active ? A.brassWarm : A.inkMute,
                transition: `color 200ms ${EASE}`,
                lineHeight: 1,
              }}>✦</span>
            )}
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: active ? A.brassWarm : T.inkMute,
              transition: `color 200ms ${EASE}`, lineHeight: 1,
            }}>{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}
