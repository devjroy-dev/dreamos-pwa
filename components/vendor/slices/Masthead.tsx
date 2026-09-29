// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// components/vendor/slices/Masthead.tsx — TDW_04 A3 (P5's card, ST-4/L-4).
//
// THE number. Since CE-45 FE-2 TYPE_1b (the founder's "b"): a money figure at t2, then ONE line of
// his words naming it (LEGACY_ROOM_HEAD); a count room shows the line alone. The eyebrow above and
// the lane sub-line below it retired together. Counts up once per mount over 300ms.
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
import { A, T } from './SliceRow';
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

// ── CE-45 · FE-2 · TYPE_1b · ONE LINE, AND A FIGURE ONLY WHERE IT IS MONEY (the founder's "b", 24 Sept 2026) ──
// The eyebrow and sub-line pair collapses to ONE line, his words from lib/worklist/copy.ts
// LEGACY_ROOM_HEAD (the caller passes the line; nothing here types a word). The room's name above
// is the surface's one t1 (theme.ts :49), so a MONEY figure stands at t2, the nearest rung, and a
// COUNT room shows no separate figure: its line already says the count.
export function Masthead({ line, value, isMoney }: {
  /** The room's one headline line, from LEGACY_ROOM_HEAD. */
  line: string;
  /** The figure. Money renders as Rs with Indian grouping and is drawn; a count is carried by the line. */
  value: number;
  isMoney?: boolean;
}) {
  const shown = useCountUp(value);
  const text = value > 0 ? formatRs(shown) : '\u2014'; // TDW_09 R-U25
  return (
    <div data-room-head="" style={{ padding: '0 var(--slice-inset, 22px) 12px' }}>
      {isMoney && (
        <div style={{
          font: T.t2,
          color: A.ink,
          fontVariantNumeric: 'tabular-nums',
        }}>{text}</div>
      )}
      <div style={{
        font: T.t4,
        color: A.inkMute,
        marginTop: isMoney ? 2 : 0,
      }}>{line}</div>
    </div>
  );
}
