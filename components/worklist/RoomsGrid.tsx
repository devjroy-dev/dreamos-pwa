"use client";
// ── CE-45 FE-1 · THE FOUNDER'S LAYOUT (BS-1 close; R-45.19; R-45.20) · READ THIS FIRST ──────────
// The two-band tile grid is replaced by the ruled mock (docs/mocks/TDW_CE45_BS1_UI_HOME_AND_
// SHELVES.html): the top pair (Business Solutions, Storefront) with their names in the headline
// ink, then three shelves (Business, Money, Studio) of at most six ROWS, each row its name and one
// line. The notes below about bands, eighteen tiles and 3·3·3 describe the grid this replaced and
// are kept as the record; what still binds from them is every tile is an anchor (R-38.2), the
// figure is counts[k] and rides the host (c-40.42), and null is not 0 (F-38.31). ORDER now comes
// from SHELVES and HEADLINE_TILES_EXPECTED (lib/worklist/rooms.ts), not FROZEN_ORDER. The class
// names are kept (wl-band, wl-bandlabel, wl-tile, wl-tname, wl-tcount) because the shell's
// benches pin the tap floor and type floor by them; a tile is now a full-width row of the same
// stated height floor.
// components/worklist/RoomsGrid.tsx — the two bands, EIGHTEEN tiles, frozen.
//
// EIGHTEEN IS NOW LITERAL AGAIN, AND FOR A NEW REASON. The header said eighteen
// through the nineteen-room era (a stale byte carried since R-38.9); R-40.99 makes
// it true a second time by hosting Contracts on the hub. Nineteen rooms, eighteen
// tiles, both bands 3·3·3.
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
import { ROOM_FOR_KIND, ROOMS, roomsHostedBy, SHELVES, type Room, type ShelfItem } from '@/lib/worklist/rooms';
import { useTodayFeed } from '@/lib/worklist/feed';
import { COPY, ROOM_DESC } from '@/lib/worklist/copy';
import { roomLabel, ROW_DESC } from '@/lib/solutions/copy';
import { itemHref, itemComing } from '@/lib/solutions/routes';
import { StateChip } from '@/components/solutions/SolutionsPieces';
import type { AttentionKind } from '@/lib/vendor/types/vendor';

const KIND_FOR_ROOM: Record<string, AttentionKind> = Object.fromEntries(
  (Object.keys(ROOM_FOR_KIND) as AttentionKind[]).map((k) => [ROOM_FOR_KIND[k], k]),
);

/**
 * CE-45 FE-1 · AN ITEM'S NAME AND LINE, EACH READ FROM ITS ONE HOME. A room's name is its
 * registry label and its line ROOM_DESC's; a Business Solutions row's name is roomLabel's and its
 * line ROW_DESC's. Home's pins read the same function, so a name is never typed twice.
 */
export function itemText(i: ShelfItem): { key: string; label: string; desc: string } {
  if ('room' in i) {
    const r = ROOMS.find((x) => x.id === i.room);
    return { key: i.room, label: r ? r.label : '', desc: ROOM_DESC[i.room] || '' };
  }
  return { key: i.row, label: roomLabel(i.row), desc: ROW_DESC[i.row] };
}

function Tile({ item, head, count, truncated }: { item: ShelfItem; head: boolean; count: number | null; truncated: boolean }) {
  const t = itemText(item);
  const coming = itemComing(item);
  return (
    <Link
      href={itemHref(item)}
      className={head ? 'wl-tile wl-tilehead' : 'wl-tile'}
      data-room={t.key}
      data-item-href={itemHref(item)}
      data-headline={head ? 'true' : undefined}
    >
      <span className="wl-ttext">
        <span className="wl-tname">{t.label}</span>
        {t.desc ? <span className="wl-tdesc">{t.desc}</span> : null}
      </span>
      {/* GATED ON A READING, AS BEFORE (F-38.31): no reading, no figure; a real zero draws
          nothing either. */}
      {count !== null && count > 0 && (
        <span className="wl-tcount" data-truncated={truncated ? 'true' : undefined}>
          {count}{truncated ? COPY.todayTruncatedSuffix : ''}
        </span>
      )}
      {/* F-19.20: a row whose screen cannot act yet says so where it stands. No shelf row is
          Coming today; the arm exists so that one ruled onto a shelf later cannot read as live. */}
      {coming && <StateChip state="coming" />}
    </Link>
  );
}

const SHELF_NAME: Record<'business' | 'money' | 'studio', string> = {
  business: COPY.shelfBusiness, money: COPY.shelfMoney, studio: COPY.shelfStudio,
};

export function RoomsGrid() {
  const feed = useTodayFeed();
  // c-40.42 · THE BADGE RIDES THE HOST, unchanged: a room's figure is its own kind's count plus
  // the counts of every room it hosts, so Contracts' unsigned figure still appears on Business
  // Solutions. A Business Solutions ROW on a shelf carries no figure of its own: rows have no
  // attention kind, and the one hosted count already has its home on the host.
  function figure(room: Room): { count: number | null; truncated: boolean } {
    if (!feed.responded || !feed.today) return { count: null, truncated: false };
    const today = feed.today;
    const readOne = (id: string): { count: number | null; truncated: boolean } => {
      const kind = KIND_FOR_ROOM[id];
      if (!kind) return { count: null, truncated: false };
      return { count: today.counts[kind] ?? null, truncated: today.truncated[kind] === true };
    };
    const own = readOne(room.id);
    let count = own.count;
    let truncated = own.truncated;
    for (const hosted of roomsHostedBy(room.id)) {
      const h = readOne(hosted.id);
      if (h.count === null) continue;
      count = (count ?? 0) + h.count;
      truncated = truncated || h.truncated;
    }
    return { count, truncated };
  }
  const tile = (i: ShelfItem, head: boolean) => {
    const room = 'room' in i ? ROOMS.find((r) => r.id === i.room) : undefined;
    const f = room ? figure(room) : { count: null, truncated: false };
    const t = itemText(i);
    return <Tile key={t.key} item={i} head={head} count={f.count} truncated={f.truncated} />;
  };
  return (
    <div className="wl-bands">
      {/* REPAIR r6 (FE-1, CE-45): the top pair is read off each room’s own `headline` (R-40.98: the
          ruling lives in the REGISTRY, never an index or a list retyped at the grid). */}
      <div className="wl-band wl-top">
        <div className="wl-tiles">{ROOMS.filter((r) => r.headline).map((r) => tile({ room: r.id }, true))}</div>
      </div>
      {SHELVES.map((sh) => (
        <section key={sh.id} className="wl-band" aria-label={SHELF_NAME[sh.id]} data-shelf={sh.id}>
          <div className="wl-bandlabel">{SHELF_NAME[sh.id]}</div>
          <div className="wl-tiles">{sh.items.map((i) => tile(i, false))}</div>
        </section>
      ))}
      <style>{GRID_CSS}</style>
    </div>
  );
}

const GRID_CSS = `
/* ZIP 14 · F-16.39's cure stands: LONGHAND padding only. This line once read
   "padding:18px 0 28px", and the shorthand’s horizontal 0 overrode the gutter
   ".wl-main > *" supplies — flush to both screen edges for twelve ZIPs, in the founder’s
   own screenshots, passed every time by a gate that asserted the rule was PRESENT and
   never that it APPLIED. */
/* ── R-G11.11 · THE GRID EARNS ITS OWN CLEARANCE  [F-40.27] ──────────────────
   The two-wide arm (R-40.22) fills YOUR BUSINESS to 3·3·3 clean, and that is
   what put a live tile under the FAB: today’s grid and the one-wide arm both
   ended that band on a single left-hand tile, so the FAB had always floated
   over empty space. Removing the orphan is what created the collision — the
   clearance was an accident of the ragged row, never a decision.
   THE FAB DOES NOT MOVE (founder, 2026-08-29: 「the FAB sits right on Rooms and
   nowhere else」). The GRID makes room instead, and it does so for ANY tile
   count rather than for this one: bottom padding = the FAB’s own seat plus one
   tile height, so no band’s last row can sit beneath it however the registry is
   reordered later.
   BOTH NUMBERS ARE READ THROUGH THE VARIABLES typeCss EMITS FROM GRID
   (lib/worklist/theme.ts). Neither 136 nor 64 is retyped here — a second copy of
   the FAB’s seat is the exact three-homes defect F-39.4 cured.
   (No backticks in this comment: it lives inside a JS template literal, as the
   block’s own header warns. The first cut used them and tsc caught it.)
   LONGHAND, per F-16.39's standing cure: a shorthand’s horizontal 0 would
   override the gutter that .wl-main > * supplies. */
.wl-bands{padding-top:16px;padding-bottom:calc(var(--wl-fab-bottom) + var(--wl-tile));flex:1}
.wl-band+.wl-band{margin-top:24px}
/* R-38.4: a section eyebrow — the second of the two places letter-spaced uppercase is
   permitted, at .08em. The em-dash bracketing retired with the engraved register; a label
   that needs decoration to read as a label is not a label. */
.wl-bandlabel{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
/* CE-45 FE-1: a shelf is one card holding its rows, as the ruled mock draws it (.list). The card and
   its hairline are the tile’s own tokens; no new colour. */
.wl-tiles{display:flex;flex-direction:column;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;overflow:hidden}
/* R-40.98 · THE HEADLINE TILE IS A COLOUR, NOT A SHAPE. The two full-width rules
   that stood here retired with R-40.22 at the founder’s word of 2026-09-07: the
   heads keep every other tile’s shape, size and rung and are told apart by their
   own border taking the accent. The rule sits AFTER the tile’s own rule below
   rather than before it, because both are single-class selectors and the border
   shorthand there would otherwise win on order alone.
   ONE FILL IS NOT SPENT HERE, WHICH IS WHY THIS TREATMENT AND NOT A FILLED TILE:
   the 3x-per-screen accent law budgets FILLS, the FAB and the dock’s send disc
   already hold two, and a filled tile would also read at 2.71:1 in Chalk
   (F-40.212, outside this radius). A hairline spends no fill and no new token. */
/* ── F-38.4 · FIXED HEIGHT, NOT ASPECT (CE-38 relay #2) ───────────────────────
   R-38.5 first ruled 1:1. At three-up on a 390px viewport with a 16px gutter and 8px gaps
   a tile is 114px wide, so 1:1 makes it 114 tall — and eighteen rooms then measure ~946px
   of grid against ~651px of work area. Settings, Business Solutions, Collab and Advisor
   would sit permanently below the fold, which defeats R-37.61: a room reachable only by
   scrolling past the fold is a hidden room wearing a tile. 64 clears the 44 tap floor with
   air, fits the two-line label at t5, and puts all eighteen on screen at rest. */
/* THE FIGURE SITS IN THE TILE’S CORNER, SO THE TILE BECOMES ITS POSITIONING CONTEXT —
   AND the relative positioning GOES INSIDE THE EXISTING RULE, NOT IN A SECOND ONE.
   NO BACKTICKS IN THIS BLOCK: it is inside a JS template literal, and a backtick written
   around a declaration while explaining that declaration ends the literal. The estate has
   paid for this six times; this was the seventh, caught by tsc. A second
   rule for the same selector reddened C10 immediately: that cell reads the declarations
   of the FIRST such rule to prove the 44px tap floor is STATED rather than survived by
   accident, and a split hid the height from it. It reddened a SECOND time on the comment
   explaining the first fix, because the selector was spelled inside it and the cell’s
   matcher found the prose before the rule — comment-blindness in the other direction, and
   worth leaving recorded rather than tidied away. No selector is written out in this
   block. Nothing about the tile’s geometry is renegotiated by a number arriving. */
.wl-tcount{position:static;flex:none;font:var(--wl-t5);color:var(--atelier-accent-text)}
/* F-39.15: lining figures, stated rather than inherited from a family map. s-39.7 note —
   no backticks anywhere in this literal. */
.wl-tcount{font-variant-numeric:lining-nums tabular-nums}
.wl-tile{position:relative;background:transparent;border:0;border-top:.5px solid var(--atelier-card-border);border-radius:0;min-height:var(--wl-tile);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;cursor:pointer;text-decoration:none}
.wl-tile:first-child{border-top:0}
/* CE-45 FE-1 · THE HEADLINE IS THE NAME’S INK, as the ruled mock draws it (.row.headline .n): the
   metal, a token theme.ts already holds (role metal, lines 24 and 210). It replaces the accent
   hairline of R-40.98, which belonged to the tile grid this layout retires. */
.wl-ttext{display:flex;flex-direction:column;gap:2px;min-width:0}
.wl-tdesc{font:var(--wl-t4);color:var(--atelier-ink-mute)}
.wl-band.wl-top{margin-bottom:0}
/* t4, NOT t5, and NOT uppercase-tracked. Two rulings meet on this one line and both bind:
   R-37.73 ② put the interactive floor at 12px after 9px was convicted as illegible chrome,
   and t5 is 11 — a tile is a control, so t5 would have walked that conviction back by one
   pixel while looking like a tidy. And R-38.4 permits letter-spaced uppercase in exactly
   two places, the nav seats and section eyebrows; a tile is neither, so the engraved
   costume comes off and the label is simply the room’s name. */
.wl-tname{font:var(--wl-t3);color:var(--atelier-ink)}
/* REPAIR r5 (FE-1, CE-45): the headline name’s metal rule sits AFTER the name’s own rule, never before
   it: b40 C11's type-floor census reads the FIRST rule naming wl-tname, and a colour-only rule first
   read as a name with no rung. Same selector weight; order now also lets the metal win honestly. */
.wl-tilehead .wl-tname{color:var(--role-metal)}
.wl-tile:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-tile:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
