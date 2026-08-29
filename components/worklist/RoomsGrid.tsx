"use client";
// components/worklist/RoomsGrid.tsx — the two bands, EIGHTEEN tiles, frozen.
//
// THE GRID IS THE DIRECTORY (R-37.61). A room reachable only through the coin is a hidden
// room, and hidden capability one layer above where the eye looks is the whole complaint
// the worklist exists to answer. So Settings and Billing take tiles even though the coin
// also reaches them: coin as shortcut, grid as directory, two homes by standing ruling.
//
// POSITIONS NEVER REORDER. R-37.22 cited. The FIGURES moved at Phase 4; the tiles did not.
// The order comes from FROZEN_ORDER and nowhere else.
//
// ── R-37.63 ① · THE TILE FIGURE AND THE FEED READ THE SAME RESPONSE ─────────
// Not the same endpoint — the SAME RESPONSE. `lib/worklist/feed.ts` memoises the promise
// so this grid and Today's masthead await one body; two requests across a write would let
// a tile say 11 beside a feed holding 12, and a vendor cannot tell which of two numbers
// from the same product is the true one.
//
// ⚠ THE FIGURE IS `counts[k]`, NEVER A LIST LENGTH. §3 property 1 makes them equal today
// and property 3 makes `counts[k]` a FLOOR when the cap fires, so a tile authored from
// `rows.length` would be right until it silently was not. b40's badge-equals-count cell
// mutates exactly that.
//
// ⚠ AND IT IS CALLED `count`, NEVER `badge`. `components/vendor/slices/SliceShell.tsx`
// owns the word `badge` for a ROW-LEVEL state chip (a lead reading 「New」), and the six
// list rooms import that module. One word, two meanings, one import graph is how a later
// reader wires the wrong one.
//
// ── R-38.7 · ROOMS SHOWS THE TILE GRID AND NOTHING ELSE ─────────────────────
// The `.wl-panel` strip (「TDW on WhatsApp」 and 「Profile layout」) and the `.wl-pointer`
// card are both GONE from this file. The founder vetoed the horizontal-strip treatment;
// each byte moved to its one home rather than being deleted — the WhatsApp row is a coin
// drawer row (WorklistShell), the profile row is a row inside Settings. The pointer
// retired outright with its copy: a directory does not advertise a manual.
//
// ── R-38.2 · EVERY TILE IS AN ANCHOR ────────────────────────────────────────
// It was `<button onClick={router.push}>`, so eighteen destinations were unannounced to
// Next and every chunk was fetched on tap. `<Link>` prefetches by default.
import Link from 'next/link';
import { ROOMS, ROOM_FOR_KIND, roomsInBand, type Room } from '@/lib/worklist/rooms';
import { useTodayFeed } from '@/lib/worklist/feed';
import { COPY } from '@/lib/worklist/copy';
import type { AttentionKind } from '@/lib/vendor/types/vendor';

/** room id → the kind whose count it carries. Derived from the one-liner, never re-spelled. */
const KIND_FOR_ROOM: Record<string, AttentionKind> = Object.fromEntries(
  (Object.keys(ROOM_FOR_KIND) as AttentionKind[]).map((k) => [ROOM_FOR_KIND[k], k]),
);

function Tile({ room, count, truncated }: { room: Room; count: number | null; truncated: boolean }) {
  // `data-interim` marks a room that has NOT crossed into the shell yet. It is read by the
  // render arm and by the audit, and it is derived from the href rather than hand-listed,
  // so a room that crosses stops being marked in the same edit that moves it.
  const interim = room.href.startsWith('/vendor');
  return (
    <Link href={room.href} className="wl-tile" data-room={room.id}
          data-interim={interim ? 'true' : undefined}>
      <span className="wl-tname">{room.label}</span>
      {/* GATED ON A READING, LIKE THE MASTHEAD. No reading and no figure — never a `0`
          standing in for a count nothing took (F-38.31). A REAL zero does not render
          either: a tile wearing 「0」 is chrome that says nothing, and eighteen of them
          would be a wall of zeros. */}
      {count !== null && count > 0 && (
        <span className="wl-tcount" data-truncated={truncated ? 'true' : undefined}>
          {count}{truncated ? COPY.todayTruncatedSuffix : ''}
        </span>
      )}
    </Link>
  );
}

export function RoomsGrid() {
  const feed = useTodayFeed();
  function figure(room: Room): { count: number | null; truncated: boolean } {
    const kind = KIND_FOR_ROOM[room.id];
    if (!kind || !feed.responded || !feed.today) return { count: null, truncated: false };
    return { count: feed.today.counts[kind] ?? null, truncated: feed.today.truncated[kind] === true };
  }
  const tile = (r: Room) => { const f = figure(r); return <Tile key={r.id} room={r} count={f.count} truncated={f.truncated} />; };
  return (
    <div className="wl-bands">
      <section className="wl-band" aria-label="Your work">
        <div className="wl-bandlabel">your work</div>
        <div className="wl-tiles">{roomsInBand('work').map(tile)}</div>
      </section>
      <section className="wl-band" aria-label="Your business">
        <div className="wl-bandlabel">your business</div>
        <div className="wl-tiles">{roomsInBand('business').map(tile)}</div>
      </section>
      <div hidden data-room-count={ROOMS.length} />
      <style>{GRID_CSS}</style>
    </div>
  );
}

const GRID_CSS = `
/* ZIP 14 · F-16.39's cure stands: LONGHAND padding only. This line once read
   "padding:18px 0 28px", and the shorthand's horizontal 0 overrode the gutter
   ".wl-main > *" supplies — flush to both screen edges for twelve ZIPs, in the founder's
   own screenshots, passed every time by a gate that asserted the rule was PRESENT and
   never that it APPLIED. */
.wl-bands{padding-top:16px;padding-bottom:24px;flex:1}
.wl-band+.wl-band{margin-top:24px}
/* R-38.4: a section eyebrow — the second of the two places letter-spaced uppercase is
   permitted, at .08em. The em-dash bracketing retired with the engraved register; a label
   that needs decoration to read as a label is not a label. */
.wl-bandlabel{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.wl-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--wl-step)}
/* ── F-38.4 · FIXED HEIGHT, NOT ASPECT (CE-38 relay #2) ───────────────────────
   R-38.5 first ruled 1:1. At three-up on a 390px viewport with a 16px gutter and 8px gaps
   a tile is 114px wide, so 1:1 makes it 114 tall — and eighteen rooms then measure ~946px
   of grid against ~651px of work area. Settings, Business Solutions, Collab and Advisor
   would sit permanently below the fold, which defeats R-37.61: a room reachable only by
   scrolling past the fold is a hidden room wearing a tile. 64 clears the 44 tap floor with
   air, fits the two-line label at t5, and puts all eighteen on screen at rest. */
/* THE FIGURE SITS IN THE TILE'S CORNER, SO THE TILE BECOMES ITS POSITIONING CONTEXT —
   AND the relative positioning GOES INSIDE THE EXISTING RULE, NOT IN A SECOND ONE.
   NO BACKTICKS IN THIS BLOCK: it is inside a JS template literal, and a backtick written
   around a declaration while explaining that declaration ends the literal. The estate has
   paid for this six times; this was the seventh, caught by tsc. A second
   rule for the same selector reddened C10 immediately: that cell reads the declarations
   of the FIRST such rule to prove the 44px tap floor is STATED rather than survived by
   accident, and a split hid the height from it. It reddened a SECOND time on the comment
   explaining the first fix, because the selector was spelled inside it and the cell's
   matcher found the prose before the rule — comment-blindness in the other direction, and
   worth leaving recorded rather than tidied away. No selector is written out in this
   block. Nothing about the tile's geometry is renegotiated by a number arriving. */
.wl-tcount{position:absolute;top:6px;right:8px;font:var(--wl-t5);color:var(--atelier-accent-text)}
.wl-tcount{font-variant-numeric:tabular-nums}
.wl-tile{position:relative;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;height:var(--wl-tile);display:flex;align-items:center;justify-content:center;padding:6px;cursor:pointer;text-decoration:none}
/* t4, NOT t5, and NOT uppercase-tracked. Two rulings meet on this one line and both bind:
   R-37.73 ② put the interactive floor at 12px after 9px was convicted as illegible chrome,
   and t5 is 11 — a tile is a control, so t5 would have walked that conviction back by one
   pixel while looking like a tidy. And R-38.4 permits letter-spaced uppercase in exactly
   two places, the nav seats and section eyebrows; a tile is neither, so the engraved
   costume comes off and the label is simply the room's name. */
.wl-tname{font:var(--wl-t4);color:var(--atelier-ink-soft);text-align:center}
.wl-tile:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-tile:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
