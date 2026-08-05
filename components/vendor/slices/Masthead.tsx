'use client';
// components/vendor/slices/Masthead.tsx — TDW_04 A3 (P5's card, ST-4/L-4).
//
// THE number, per the spec: slice-name eyebrow (Cormorant italic 13,
// letterspaced) → the figure (Cormorant 44) → a Jost 10 sub-line NAMING the
// figure and its lane. Counts up once per mount over 300ms.
//
// Every figure here comes from lib/vendor/derive.ts — the same function the hub
// Ledger reads. That is A3's whole thesis: the masthead and the chat screen
// cannot disagree, because there is only one derivation to disagree with.

import { useEffect, useRef, useState } from 'react';
import { A, F } from './SliceRow';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

function useCountUp(target: number, ms = 300): number {
  const [v, setV] = useState(target);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) { setV(target); return; }   // animate once per mount, then track truth
    done.current = true;
    if (target === 0) { setV(0); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function Masthead({ eyebrow, value, sub, isMoney }: {
  /** The slice's own word — "Pipeline", "Outstanding", "This month"… */
  eyebrow: string;
  /** The figure. Money renders as Rs with Indian grouping; counts render bare. */
  value: number;
  /** Jost 10 line naming the figure and its lane (L-1's honesty, at masthead scale). */
  sub: string;
  isMoney?: boolean;
}) {
  const shown = useCountUp(value);
  const text = isMoney
    ? (value > 0 ? formatRs(shown) : '—')  // TDW_09 R-U25
    : String(shown);

  return (
    <div style={{ padding: '10px 22px 12px' }}>
      <div style={{
        fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5,
        letterSpacing: '0.06em', color: A.inkMute,
      }}>{eyebrow}</div>
      <div style={{
        fontFamily: F.display, fontWeight: 300,
        fontSize: isMoney && value >= 1_000_000 ? 34 : 44,
        lineHeight: 1.05, color: A.ink, letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums',
      }}>{text}</div>
      <div style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
        letterSpacing: '0.08em', color: A.inkMute, marginTop: 2,
      }}>{sub}</div>
    </div>
  );
}
