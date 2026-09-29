"use client";
// ── DESIGN-1 · STAGE 3 · READ THIS FIRST: this file draws MORE now (the grouped list behind the profile coin), not the
// shelves. The notes below describe the grids it replaced and are kept as the record; itemText still serves the pins.
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
import { ROOMS, type ShelfItem } from '@/lib/worklist/rooms';
import { ROOM_DESC } from '@/lib/worklist/copy';
import { roomLabel, ROW_DESC } from '@/lib/solutions/copy';
import { RoomIcon } from '@/components/worklist/RoomIcon';
import { iconFor, type IconKey } from '@/lib/worklist/icons';
import { MORE_GROUPS, type MoreRow } from '@/lib/worklist/tabs';
import { openSupport } from '@/components/worklist/AccountDrawer';
import { itemComing } from '@/lib/solutions/routes';
import { StateChip } from '@/components/solutions/SolutionsPieces';

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

/**
 * DESIGN-1 · STAGE 3 · MORE, IN THE FOUNDER'S GROUPS (docs/review/REPORT.md §3, "Five tabs"; E1).
 * The three shelves and the headline pair retired: the daily rooms are the five tabs now, and everything else sits
 * here under Your business, Get found, Work together, Messages and Help, in his order. Each row is one tap to its
 * room: its icon and its one line read from their homes (lib/worklist/icons.ts, ROOM_DESC, ROW_DESC), its name the
 * founder's word. Support opens TDW on WhatsApp, the act the coin's menu held.
 */
function rowKey(r: MoreRow): string | null {
  return 'act' in r ? null : r.room ?? r.row ?? null;
}
function rowDesc(r: MoreRow): string {
  if ('act' in r) return '';
  if (r.room) return ROOM_DESC[r.room] || '';
  if (r.row) return ROW_DESC[r.row] || '';
  return '';
}

function MoreItem({ r }: { r: MoreRow }) {
  const k = rowKey(r);
  const desc = rowDesc(r);
  const inner = (
    <>
      {k && iconFor(k) !== null && <RoomIcon k={k as IconKey} className="wl-moreicon" />}
      <span className="wl-moretext">
        <span className="wl-morename">{r.label}</span>
        {desc ? <span className="wl-moredesc">{desc}</span> : null}
      </span>
      {/* F-19.20, kept from the tiles: a row whose screen cannot act yet says so where it stands. */}
      {!('act' in r) && r.row && itemComing({ row: r.row }) && <StateChip state="coming" />}
    </>
  );
  if ('act' in r) return <button type="button" className="wl-morerow" data-more="contact" onClick={openSupport}>{inner}</button>;
  return <Link href={r.href} className="wl-morerow" data-more={k ?? undefined}>{inner}</Link>;
}

export function RoomsGrid() {
  return (
    <div className="wl-more">
      {MORE_GROUPS.map((g) => (
        <section key={g.name} className="wl-moregroup" aria-label={g.name}>
          <h2 className="wl-moreh">{g.name}</h2>
          <div className="wl-morelist">{g.rows.map((r) => <MoreItem key={r.label} r={r} />)}</div>
        </section>
      ))}
      <style>{MORE_CSS}</style>
    </div>
  );
}

// NO BACKTICKS INSIDE THIS LITERAL (the estate's standing warning). Rungs and tokens only; spacing on the scale.
// Longhand vertical padding only: the gutter comes from the scroll column (F-16.39).
// The bottom padding clears the add button that stands on this page (the FAB's seat, read from typeCss).
const MORE_CSS = `
.wl-more{padding-top:8px;padding-bottom:calc(var(--wl-fab-bottom) + var(--wl-tile))}
.wl-moregroup{padding-top:16px}
.wl-moreh{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 8px}
.wl-morelist{display:flex;flex-direction:column;background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border);border-radius:12px;overflow:hidden}
.wl-morerow{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 16px;background:none;border:none;text-align:left;text-decoration:none;color:inherit;cursor:pointer;width:100%}
.wl-morerow + .wl-morerow{border-top:1px solid var(--atelier-card-border)}
.wl-morerow:active{background:var(--atelier-row-hover)}
.wl-morerow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.wl-moreicon{flex:none;width:24px;height:24px;color:var(--atelier-accent-text)}
.wl-moretext{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.wl-morename{font:var(--wl-tn);color:var(--atelier-ink);overflow-wrap:anywhere}
.wl-moredesc{font:var(--wl-t4);color:var(--atelier-ink-mute);overflow-wrap:anywhere}
`;
