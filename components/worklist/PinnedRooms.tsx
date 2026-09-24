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
// no ROOM until the read settles either way; since HOME_2 it draws the block's frame and six empty
// tiles meanwhile, so its height is held and the masthead beneath it never moves (chair's (a)).
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
import { RoomIcon } from '@/components/worklist/RoomIcon';
import { iconFor, type IconKey } from '@/lib/worklist/icons';

// CE-45 FE-1 HOME_2 · R-45.21 (the founder, walking HOME_1: "it being at the bottom defeats the purpose
// of pinning"; then approving the mock as it opens). THE PINS NOW OPEN HOME, above Today's surface
// (today/page.tsx), in the COMPACT form as drawn: three across, the icon over the name at t4, the
// room's one line kept for screen readers only (it still shows on Rooms). The divider between the
// pins and the day is THIS block's (its bottom border), so Today's surface is untouched.
//
// THE HEIGHT RESERVE (chair's (a)): before /me settles, the SAME block renders with six empty tiles
// of the same fixed height, so the block is one height before and after, and Today's masthead below
// never moves when her trade arrives. The fixed tile height holds because a name clamps to two lines.
const PIN_SLOTS = 6;

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
  const pins = read.settled ? pinsForTrade(read.category) : null;
  return (
    <section
      className="wl-pins"
      aria-busy={pins ? undefined : 'true'}
      data-pins={pins ? pins.map(itemHref).join(' ') : ''}
      data-trade={pins && read.settled ? (read.category || '') : ''}
    >
      <h2 className="wl-pinshead">{COPY.pinnedHead}</h2>
      <div className="wl-pingrid">
        {pins
          ? pins.map((i) => {
            const t = itemText(i);
            return (
              <Link key={t.key} href={itemHref(i)} className="wl-pin" data-room={t.key}>
                {iconFor(t.key) !== null && <RoomIcon k={t.key as IconKey} className="wl-picon" />}
                <span className="wl-pinname">{t.label}</span>
                {t.desc ? <span className="wl-pindesc">{t.desc}</span> : null}
                {itemComing(i) && <StateChip state="coming" />}
              </Link>
            );
          })
          : Array.from({ length: PIN_SLOTS }, (_, n) => <span key={n} className="wl-pin wl-pinwait" aria-hidden="true" />)}
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
.wl-pins{padding-top:16px;padding-bottom:14px;border-bottom:.5px solid var(--atelier-card-border)}
.wl-pinshead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.wl-pingrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--wl-step)}
.wl-pin{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;height:84px;padding:10px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;text-decoration:none;cursor:pointer}
.wl-pin:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-pin:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-pinname{font:var(--wl-t4);color:var(--atelier-ink);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.wl-picon{flex:none;width:20px;height:20px;color:var(--atelier-accent-text)}
.wl-pinwait{cursor:default}
.wl-pindesc{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.wl-pinchange{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin-top:10px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--atelier-ink-mute);cursor:not-allowed}
`;
