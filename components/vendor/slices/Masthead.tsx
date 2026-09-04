// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// components/vendor/slices/Masthead.tsx — TDW_04 A3 (P5's card, ST-4/L-4).
//
// THE number, per the spec: slice-name eyebrow (Cormorant italic 13,
// letterspaced) → the figure (Cormorant 44) → a DM Sans body sub-line NAMING
// the figure and its lane. Counts up once per mount over 300ms.
// [F-09.86, TDW_09 walk rider: the sub-line was authored as Jost 10 — a
// whisper; the T-1 floor raise moved it to 16 and Jost-at-body-size read wrong
// (founder-walked 2026-08-07). A sentence takes the body font; the drifted
// 「 Jost 10 」 citations here and at the prop doc amended in the same edit —
// a comment describing a dead value is F-10.34's citation class.]
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
  /** Body sub-line naming the figure and its lane (L-1's honesty, at masthead scale; F-09.86: DM Sans, was Jost). */
  sub: string;
  isMoney?: boolean;
}) {
  const shown = useCountUp(value);
  const text = isMoney
    ? (value > 0 ? formatRs(shown) : '—')  // TDW_09 R-U25
    : String(shown);

  return (
    <div style={{ padding: '10px var(--slice-inset, 22px) 12px' }}>
      <div style={{
        fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
        letterSpacing: '0.06em', color: A.inkMute,
      }}>{eyebrow}</div>
      <div style={{
        fontFamily: F.display, fontWeight: 300,
        fontSize: isMoney && value >= 1_000_000 ? 34 : 44,
        lineHeight: 1.05, color: A.ink, letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums',
      }}>{text}</div>
      <div style={{
        fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
        letterSpacing: '0.08em', color: A.inkMute, marginTop: 2,
      }}>{sub}</div>
    </div>
  );
}
