'use client';
// components/vendor/VictorModeChip.tsx
// TDW_06 P6d (R-2): the Business·Advisor chip — the control for victor_mode (Victor's ROOM).
//
// A DISTINCT control from the nav ModePill (BottomNav): it shares NO state, NO types, NO
// hooks with useVendorMode. It speaks victor_mode vocabulary end to end and persists to the
// server via the vendor-e mode door (no localStorage). It BORROWS the Atelier pill styling
// only for visual consistency, per the CE ruling — not the nav machinery.
//
// CHIP WORDS ('Business' / 'Advisor') and PLACEMENT ride the founder's veto.

import { useEffect } from 'react';
import { useVictorMode, type VictorMode } from '@/hooks/vendor/useVictorMode';
import { useT } from '@/lib/vendor/ThemeContext';

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  inkMute:   'var(--atelier-ink-mute)',
  inputBg:   'var(--atelier-input-bg)',
};
const F = { label: 'var(--font-label, inherit)' };
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const SEGMENTS: { key: VictorMode; label: string }[] = [
  { key: 'business', label: 'Business' }, // founder-veto on the words
  { key: 'advisor',  label: 'Advisor'  },
];

// TDW_09 P2-R1 (founder-asked): `onMode` is an ADDITIVE, optional publisher —
// the chip reports the room it is showing so the risen chat's masthead
// (app/vendor/page.tsx) can speak the same word. The chip stays the ONE
// control; the masthead is a read-only mirror of this very state, so the two
// can never disagree — one hook call, one truth, published outward.
export function VictorModeChip({ onThreadReset, onMode }: { onThreadReset?: () => void; onMode?: (m: VictorMode | null) => void } = {}) {
  const T = useT();
  const { mode, loading, saving, change } = useVictorMode();
  useEffect(() => { onMode?.(mode); }, [mode, onMode]);
  const busy = loading || saving;

  return (
    <div
      role="group"
      aria-label="Victor mode"
      aria-busy={busy}
      style={{
        display: 'inline-flex', alignItems: 'center',
        background: A.inputBg,
        border: '0.5px solid rgba(201,168,76,0.22)',
        borderRadius: 999, padding: 3,
        opacity: loading ? 0.55 : 1,
        transition: `opacity 200ms ${EASE}`,
      }}
    >
      {SEGMENTS.map((seg) => {
        const active = mode === seg.key;
        return (
          <button
            key={seg.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={busy}
            onClick={() => { if (!busy && mode !== seg.key) { void change(seg.key).then((reset) => { if (reset) onThreadReset?.(); }); } }}
            style={{
              padding: '6px 13px', borderRadius: 999, border: 'none',
              cursor: busy ? 'default' : 'pointer',
              background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
              boxShadow: active ? 'inset 0 0 0 0.5px rgba(201,168,76,0.5)' : 'none',
              transition: `all 200ms ${EASE}`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: active ? A.interactiveWarm : (T && T.inkMute) || A.inkMute,
              transition: `color 200ms ${EASE}`, lineHeight: 1,
            }}>{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}
