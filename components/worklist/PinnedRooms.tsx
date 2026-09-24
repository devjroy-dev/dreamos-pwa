"use client";
// components/worklist/PinnedRooms.tsx — CE-45 FE-1 · HOME'S PINNED ROOMS (the one added concept).
//
// THE FOUNDER'S WORDS (charter, 24 Sept 2026): "It's merely reorientation with pinned room concept
// as an added one only." Six rooms on Home, beneath the day's work (P2), defaulted by her trade.
//
// P1(b), RULED: pwa-only this cut. Her trade is read from the existing /me door (fetchMe, the same
// door useVendorMe reads); pinsForTrade (lib/worklist/rooms.ts) turns it into six items, and an
// unknown, empty or failed read falls to DEFAULT_PINS SILENTLY: no line says the read failed,
// because the six are a correct answer on their own and a failure sentence would be a second
// claim on a surface that already carries its one status (R-38.4).
//
// ⚠ WHY THIS DOES NOT CALL useVendorMe. That hook returns null BOTH while loading AND after a
// failure, so a caller cannot tell "not yet" from "never". Reading it would draw the default six
// and then swap them for her trade's half a second later, on every visit: the F-39.72 flash with
// pins instead of a sentence. So this block keeps its own settled flag on the same door and draws
// NOTHING until the read settles either way, which is the precedent Today's own masthead set.
//
// THE CHANGE CONTROL IS STATED AND DISABLED (F-19.20; P1(b) ruling): it is drawn, it says what it
// is, it wears the estate's existing Coming chip, and it does nothing. "Hers to change" is the
// server half, a later cut if the founder wants it. No second byte: the label is COPY.pinnedChange
// and the chip is CHIPS.coming.
//
// Every name and line is read through itemText (RoomsGrid), every address through itemHref
// (lib/solutions/routes.ts): a pinned Posts & ads opens exactly the route its hub row opens.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchMe } from '@/lib/vendor/api/vendor';
import { pinsForTrade } from '@/lib/worklist/rooms';
import { itemHref, itemComing } from '@/lib/solutions/routes';
import { COPY } from '@/lib/worklist/copy';
import { StateChip } from '@/components/solutions/SolutionsPieces';
import { itemText } from '@/components/worklist/RoomsGrid';

type TradeRead = { settled: false } | { settled: true; category: string | null };

export function PinnedRooms() {
  const [read, setRead] = useState<TradeRead>({ settled: false });
  useEffect(() => {
    let alive = true;
    fetchMe()
      .then((res) => {
        if (!alive) return;
        const cat = res && res.ok && res.vendor && typeof res.vendor.category === 'string' ? res.vendor.category : null;
        setRead({ settled: true, category: cat });
      })
      .catch(() => { if (alive) setRead({ settled: true, category: null }); });
    return () => { alive = false; };
  }, []);
  if (!read.settled) return null;
  const pins = pinsForTrade(read.category);
  return (
    <section className="wl-pins" data-pins={pins.map(itemHref).join(' ')} data-trade={read.category || ''}>
      <h2 className="wl-pinshead">{COPY.pinnedHead}</h2>
      <div className="wl-pingrid">
        {pins.map((i) => {
          const t = itemText(i);
          return (
            <Link key={t.key} href={itemHref(i)} className="wl-pin" data-room={t.key}>
              <span className="wl-pinname">{t.label}</span>
              {t.desc ? <span className="wl-pindesc">{t.desc}</span> : null}
              {itemComing(i) && <StateChip state="coming" />}
            </Link>
          );
        })}
      </div>
      <button type="button" className="wl-pinchange" disabled aria-disabled="true">
        <span>{COPY.pinnedChange}</span>
        <StateChip state="coming" />
      </button>
      <style>{PIN_CSS}</style>
    </section>
  );
}

// REPAIR r1 (FE-1, adopting the severed run, CE-45 e-100): the found cut reserved the FAB's seat
// under the pins. AddFab mounts on Rooms and nowhere else (rooms/page.tsx, R-38.18), so on Home
// that reserve was dead space; removed. The shell's own padding keeps the dock clear.
// NO BACKTICKS IN THIS LITERAL (the estate's standing warning). Every value is a rung or a token
// the shell already emits (lib/worklist/theme.ts); no new colour, no ad-hoc px for type.
const PIN_CSS = `
.wl-pins{padding-top:22px}
.wl-pinshead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.wl-pingrid{display:grid;grid-template-columns:1fr 1fr;gap:var(--wl-step)}
.wl-pin{display:flex;flex-direction:column;justify-content:center;gap:2px;min-height:var(--wl-tile);padding:12px 14px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;text-decoration:none;cursor:pointer}
.wl-pin:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-pin:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-pinname{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-pindesc{font:var(--wl-t4);color:var(--atelier-ink-mute)}
.wl-pinchange{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin-top:10px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--atelier-ink-mute);cursor:not-allowed}
`;
