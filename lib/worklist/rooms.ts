// lib/worklist/rooms.ts — THE NINETEEN ROOMS, IN FROZEN ORDER.
//
// R-37.60 (six seats for the slices) \u00b7 R-37.61 (Settings and Billing take tiles)
// \u00b7 R-37.62 (Portfolio pinnable, not pre-pinned) \u00b7 R-37.66 as amended (Contact Support
// is a ROOM, bottom band, beside Billing and Settings) \u00b7 rider \u2461 (two bands,
// positions never reorder).
//
// THE ORDER IS A RULED ANTI-FEATURE. Tiles do not sort by recency, count, or anything else.
// Badges move (Phase 4); positions do not. R-37.22 is the cited reasoning: a control that
// moves under the thumb is a control that cannot be learned. The cell below asserts the
// order by index, so a reorder in a later edit reddens.
//
// A-4 INTERIM. Every href points into the EXISTING /vendor route, so no job becomes
// unreachable while the branch shell is a shell. Phase 2 replaces these with native routes;
// the room registry is the one place that changes when it does.
//
// \u26a0 CROSSING THE THRESHOLD LEAVES THE PALETTE. A deep-linked room renders under the OLD
// shell's theme (Espresso / Editorial Paper), because app/vendor/layout.tsx owns its own
// token layer. That is inherent to A-4 and is stated on the walk card so the founder reads
// it before he sees it.
'use strict';

import type { AttentionKind } from '@/lib/vendor/types/vendor';

export type Band = 'work' | 'business';

export interface Room {
  /** Stable id. Never rendered; the label is the byte. */
  id: string;
  /** Vendor-facing tile label. */
  label: string;
  band: Band;
  /** A-4 interim destination, or an internal shell route. */
  href: string;
  /** R-37.62: pinnable rooms may be pinned by the vendor; none but the defaults start pinned. */
  pinnable: boolean;
  /**
   * R-40.98 \u00b7 THE HEADLINE TILE. The head of each band, drawn in the accent
   * hairline: same shape, same size, same 64px height as every other tile, its
   * own .5px border in `--atelier-accent-text` instead of `--atelier-card-border`.
   * Founder's pick of 2026-09-07 from three treatments (a: teal label ink, b:
   * hairline, c: leading edge) \u2014 (b), because the whole outline reads as a
   * different KIND of tile while the label stays in the page ink, so it does not
   * fight the accent-ink badge sitting in the same tile's corner.
   *
   * ⚠ THIS FIELD REPLACES `wide`, WHICH RETIRED WITH ITS READER. R-40.22/.24
   * ruled the two heads FULL-WIDTH; the founder's own word of 2026-09-07
   * superseded that \u2014 the tiles keep every other tile's shape and are
   * distinguished by colour alone. The full-width CSS, the `wide` flag, the
   * `WIDE_TILES_EXPECTED` declaration and both benches' cells for them are gone
   * rather than left dark. RETIRE-WITH-THE-READER; the reason stands where the
   * name stood.
   *
   * ⚠ AND IT IS STILL A REGISTRY FIELD, NOT A DERIVED RULE. R-40.22's fork was
   * argued once and its answer did not change with the treatment: a rule like
   * 「index 0 of a band is the headline」 would be one fewer byte and would
   * silently re-decide itself the next time the founder reorders a band. He
   * ruled TWO tiles by name; a name is what the registry stores.
   *
   * Optional, for the same reason `wide` was: sixteen `headline: false` entries
   * are a column of noise that hides the two that matter.
   */
  headline?: boolean;

  /**
   * c-40.42 \u00b7 THE HOSTED ROOM. R-40.99 took Contracts off the grid and left
   * the route standing: the hub's own row opens it. This field is how a room
   * leaves the GRID without leaving the DIRECTORY, and the distinction is the
   * whole reason the field exists rather than a deletion.
   *
   * ⚠ `ROOMS` IS TWO THINGS AND ONLY ONE OF THEM WAS RULED AWAY. It is the grid's
   * directory AND the address book: `ROOM_FOR_KIND.contract_unsigned` points at
   * `contracts`, and `TodayCards` routes the unsigned-contract card through
   * `roomHref(ROOM_FOR_KIND[kind])`. Deleting the entry would have made
   * `roomHref` MISS, and a miss returns `/vendor/rooms` \u2014 quietly, by design
   * (see the fallback below). A live Today card would have opened the directory
   * instead of the room, correctly, with no bench able to see it.
   *
   * The value is the HOST'S id, not a boolean, because the host is a fact the
   * grid needs: the hosted room's attention count is summed onto the host's tile
   * (`roomsHostedBy` below), so Business Solutions wears the unsigned-contract
   * figure that Contracts' own tile used to carry. A boolean would say a room is
   * hidden and leave the count with nowhere to go.
   */
  hostedBy?: string;
}

/** \u00a78.2: Calendar and Storefront are the two default pins. Nothing else pre-pins. */
export const DEFAULT_PINS: readonly string[] = ['calendar', 'storefront'] as const;

// \u00a74-2 \u00b7 CALENDAR CROSSED FIRST, AND ONE AT A TIME IS THE RULE HERE. The list family
// crossed together because six rooms were ONE definition mounted six times; the remaining
// eight are eight separate bodies with nothing shared, so a family motion would buy nothing
// and cost the ability to say which crossing broke what. Smallest radius, one at a time.
//
// R-38.11 \u00b7 CROSSED AT M-FINISH S2, \u00a74-1. THE LIST FAMILY CROSSED AS A FAMILY, and the
// reason is structural rather than tidy: six of these rooms are ONE definition
// (components/vendor/slices/SliceShell.tsx) mounted six times. Crossing them one at a time
// would have meant the shared shell losing its masthead on the first crossing and the other
// five rendering headless under the OLD layout until they caught up \u2014 five broken
// surfaces as a deliberate intermediate state, for no gain.
export const ROOMS: readonly Room[] = [
  // ── TOP BAND \u00b7 NINE ───────────────────────────────────────
  // ── R-40.20 \u00b7 BUSINESS SOLUTIONS TAKES INDEX 0 OF YOUR WORK ──────────────
  // FOUNDER-RULED 2026-09-04. It leaves the BUSINESS band, where it had sat since
  // R-37.66, and heads YOUR WORK before Leads. The bands move 8\u21929 and 11\u219210;
  // ROOM_COUNT_EXPECTED does not move, because nothing was added \u2014 a room
  // changed bands, which is a reorder the founder worded (R-37.22 forbids tiles
  // SORTING THEMSELVES, never the founder placing one).
  //
  // ⚠ THE ID STAYS `support`. That was the build seat's read-first fork and the
  // cheap answer is the right one: the id is stable and never rendered (see the
  // interface), the label is the byte, and `/vendor/support` is an address five
  // other files and two benches already spell. Renaming it would buy a tidier
  // symbol and cost a route, a redirect and every reader of both.
  { id: 'support',   label: 'Business Solutions', band: 'work', href: '/vendor/support', pinnable: false, headline: true },
  { id: 'leads',     label: 'Leads',     band: 'work', href: '/vendor/leads',     pinnable: true  },
  { id: 'clients',   label: 'Clients',   band: 'work', href: '/vendor/clients',   pinnable: true  },
  { id: 'invoices',  label: 'Invoices',  band: 'work', href: '/vendor/invoices',  pinnable: true  },
  { id: 'expenses',  label: 'Expenses',  band: 'work', href: '/vendor/expenses',  pinnable: true  },
  // ── R-38.10 · BOOKS, THE NINETEENTH ROOM. LANDED AT ROAD STEP 2b ─────────
  // INDEX 4, BESIDE INVOICES AND EXPENSES, BY FOUNDER WORD — it is the ledger
  // those two write into, so it sits with them rather than at the end of the
  // band. THAT IS AN INSERTION, AND AN INSERTION SHIFTS INDICES: events, notes
  // and calendar each move down one. The freeze law (R-37.22) forbids tiles
  // SORTING THEMSELVES — by recency, count, or anything a vendor did not ask
  // for. It does not forbid the founder placing a new room, which is why C2
  // reads FROZEN_ORDER rather than a set: a reorder nobody worded reddens, and
  // this one is worded.
  //
  // ⚠ THE TILE BYTE IS 「Books」 AND NOT 「Khata」. R-38.10 and the whole 2b
  // charter said Khata; the founder's veto of 2026-08-29 answered Books on all
  // ten lines, and an eleventh after the build. The earlier byte survives in no
  // string, symbol, route, comment or register row — including this one, which
  // names it once to record that it was ruled away rather than lost.
  //
  // READ-ONLY BY CONSTRUCTION. The room mounts zero verbs: its door is
  // `GET /api/v2/vendor/money/books/:vendorId` and dream-os's money router
  // declares no non-GET. It is the only money surface on the TYPED plane —
  // Invoices and Expenses still read `engine.records` and cross at step 2c,
  // reads and writes together (F-39.3 stays OPEN by ruling until then).
  { id: 'books',     label: 'Books',     band: 'work', href: '/vendor/books',     pinnable: true  },
  { id: 'events',    label: 'Events',    band: 'work', href: '/vendor/events',    pinnable: true  },
  { id: 'notes',     label: 'Notes',     band: 'work', href: '/vendor/notes',     pinnable: true  },
  { id: 'calendar',  label: 'Calendar',  band: 'work', href: '/vendor/calendar',           pinnable: true  },
  // ── BOTTOM BAND \u00b7 eleven ──────────────────────────────────
  // \u00a74-3 \u00b7 THE FIRST BATCH OF THE SEVEN CROSSED TOGETHER, AND THE KINSHIP IS THE
  // REASON. These three are the VISUAL family \u2014 how the vendor looks to a couple. They do
  // not share a definition the way the six list rooms did, so the family motion buys less
  // here; what it buys is that Storefront's own Portfolio row crosses in the SAME cut as
  // Portfolio, so the address book answers correctly at every instant rather than pointing
  // a crossed surface at an uncrossed one for the length of a sitting.
  // R-40.22's second wide tile. ⚠ STOREFRONT DOES NOT MOVE \u2014 it has been the head
  // of this band since \u00a74-3 and is already FROZEN_ORDER's first business id. The
  // charter's phrase 「storefront to the head of business」 describes a motion that
  // does not exist; only the flag is new (c-40.10, third limb).
  { id: 'storefront',label: 'Storefront',band: 'business', href: '/vendor/storefront',       pinnable: true, headline: true },
  { id: 'portfolio', label: 'Portfolio', band: 'business', href: '/vendor/portfolio',        pinnable: true  },
  { id: 'couture',   label: 'Couture',   band: 'business', href: '/vendor/couture',          pinnable: true  },
  // \u00a74-4 \u00b7 BATCH \u2461. Three bodies with nothing shared \u2014 a hub of Studio rows, a document
  // list and a ledger \u2014 so this batch buys none of the family coherence \u00a74-3 did. It is a
  // batch because the three crossings are mechanically identical after \u00a74-3 proved the
  // shape, and because splitting them would cost three floor runs to learn the same thing.
  // \u26a0 `team`'s href moves from `/vendor/team-hub` to `/vendor/team`, so the ROUTE SEGMENT
  // changes name as well as tree. The fallback keeps its own spelling; only the tile's
  // destination is renamed, and no other file spells either one (derived, not assumed).
  { id: 'team',      label: 'Team',      band: 'business', href: '/vendor/team',             pinnable: true  },
  { id: 'contracts', label: 'Contracts', band: 'business', href: '/vendor/contracts',        pinnable: true, hostedBy: 'support' },
  { id: 'tds',       label: 'TDS',       band: 'business', href: '/vendor/tds',              pinnable: true  },
  // R-38.1 \u00b7 CROSSED AT M-FINISH S1. These two now render as children of WorklistShell
  // under app/w/, so tapping them mounts no second layout, no second header and no second
  // session resolve. The /vendor routes survive on disk as untouched fallbacks and nothing
  // in the shell links to them.
  { id: 'billing',   label: 'Billing',   band: 'business', href: '/vendor/billing',          pinnable: true  },
  { id: 'settings',  label: 'Settings',  band: 'business', href: '/vendor/settings',         pinnable: true  },
  // R-37.87, and CROSSED AT §4-4 BATCH ③ — THE LAST ROOM. The tile deep-linked the carried
  // collab surface for four sittings; it points into the shell now, and its own interior
  // (the responses thread) crossed in the SAME cut, because a room whose interior stayed
  // behind is F-38.1 inside that room's walls. Position is the founder's to reorder in one
  // word — the frozen-order cell asserts wherever he puts it.
  { id: 'collab',    label: 'Collab',    band: 'business', href: '/vendor/collab',           pinnable: true  },
  // ── R-38.9 \u00b7 THE ADVISOR ROOM ─────────────────────────────────
  // F-38.2: `victor_mode` is live server truth (engine.agents.victor_mode, PATCH
  // /api/v2/vendor-e/mode — lib/vendor/api/vendor.ts:33-35) and the branch had ZERO
  // vendor-reachable doors to it. The chip was re-homed inside the OLD hub's risen chat at
  // F-09.129 (app/vendor/page.tsx:1132, inside `{risen && (`), and AskSheet never carried
  // it. A live capability with no door is a field that rots.
  //
  // IT IS A ROOM, NOT A CHIP. The mode control does not return to chrome anywhere — the
  // founder's verdict on the pill was on PLACEMENT and REGISTER (F-09.129 Fork A(a)) and a
  // room honours both: the vendor goes somewhere to advise, rather than carrying a switch.
  //
  // THE LABEL IS 「Advisor」, NEVER 「Victor」. R-37.70: persona names appear in no product
  // chrome. Founder's byte, ruled shippable pending his veto at CE-38 relay #1.
  { id: 'advisor',   label: 'Advisor',   band: 'business', href: '/vendor/advisor',          pinnable: false },
] as const;

// R-37.87's seventeen AMENDED BY FOUNDER WORD to eighteen (CE-38 R-38.9), AND AMENDED
// AGAIN BY LABEL to nineteen at ROAD STEP 2b (R-38.10, founder veto 2026-08-29): Books
// joins the WORK band, so the top band moves 7 → 8 and the bottom band holds at 11. Count
// history, every step worded or derived: 11 → 15 → 16 → 17 → 18 → 19.
//
// NINETEEN IS SIX FULL ROWS OF THREE PLUS ONE. Eighteen's tidiness was named when it
// landed and it is being spent here, deliberately: the orphan row R-37.87 killed comes
// back. The founder was told and ruled the placement anyway, because a ledger that sits
// away from the two rooms it reconciles is a ledger nobody opens. Geometry is MEASURED at
// 374x844 by the render arm rather than argued from this note — nineteen at 64px is
// arithmetic until the arm says otherwise (R-38.10's own STOP clause).
/**
 * KIND → ROOM. THE ONE-LINER, AND THE ONLY ONE.
 *
 * `TDW_09_WORKLIST_P3_HANDOVER.md` §7: 「the endpoint does not know the room registry and
 * must not learn it」. So the wire ships a kind, this file owns where a kind lives, and
 * `roomHref` below turns that into an address. Three facts, one home each.
 *
 * ⚠ IT MAPS TO AN `id`, NEVER TO A PATH. A literal `/vendor/leads` here would be the R-38.1
 * disease with a new spelling: a second place that spells a destination, drifting the
 * moment a room moves. Every consumer reads `roomHref(ROOM_FOR_KIND[k])`.
 *
 * ⚠ AND IT IS TOTAL OVER THE FIVE KINDS BY TYPE, not by convention. `Record<AttentionKind,
 * string>` means a sixth kind arriving on the wire cannot be added to the contract without
 * this object failing to compile — which is the alarm, not the inconvenience.
 */
export const ROOM_FOR_KIND: Readonly<Record<AttentionKind, string>> = {
  lead_unanswered:   'leads',
  invoice_due:       'invoices',
  events_today:      'events',
  contract_unsigned: 'contracts',
  team_tasks:        'team',
} as const;

// ── R-40.99 / c-40.42 · TWO COUNTS NOW, BECAUSE THERE ARE TWO ANSWERS ────────
// The directory and the grid stopped being the same number the moment a room was
// hosted. Both are declared, because a single constant would have to be one of
// them and the other would then be derived, unstated, in whichever file happened
// to need it — which is how a count drifts from a ruling with nothing red.
//
// ROOM_COUNT_EXPECTED is the DIRECTORY: every room the address book answers for,
// hosted or not. It does NOT move at R-40.99 — nothing joined or left the estate;
// a room left the GRID. GRID_TILE_COUNT_EXPECTED is what the vendor's thumb can
// reach on Rooms: nineteen less the hosted one. Count history, every step worded
// or derived: 11 → 15 → 16 → 17 → 18 → 19 directory, and 19 → 18 on the glass.
export const ROOM_COUNT_EXPECTED = 19;
export const GRID_TILE_COUNT_EXPECTED = 18;
// R-40.20: Business Solutions crosses from business to work. 8\u21929 and 11\u219210.
// R-40.99: Contracts is hosted by the hub, so the BOTTOM BAND'S GRID count falls
// 10 → 9 while its DIRECTORY count holds at 10. Both bands now fall 3·3·3 and the
// orphan row that has followed this grid since R-37.87 is gone from both.
// ⚠ THESE TWO ARE GRID COUNTS, not directory counts — they are what `roomsInBand`
// returns, because that is the function the constants exist to check.
export const TOP_BAND_EXPECTED = 9;
export const BOTTOM_BAND_EXPECTED = 9;

/**
 * R-40.98 \u00b7 THE HEADLINE TILES, DECLARED SO A BENCH READS THE RULING AND NOT A COUNT.
 * Two, by founder word: the head of each band. A cell asserting 「two tiles are
 * headlines」 would pass on the wrong two.
 *
 * AMENDED BY LABEL from `WIDE_TILES_EXPECTED` (R-40.22), which retired with the
 * shape it declared. The names did not move; the treatment did.
 */
export const HEADLINE_TILES_EXPECTED: readonly string[] = ['support', 'storefront'] as const;

/**
 * R-40.99 \u00b7 THE HOSTED ROOMS, DECLARED FOR THE SAME REASON. One, by founder
 * word: Contracts, housed by the hub. A cell that counted hosted rooms would pass
 * on the wrong one, and a cell that read only `roomsInBand`'s length would pass on
 * a room that vanished from the grid AND the directory together.
 */
export const HOSTED_TILES_EXPECTED: readonly string[] = ['contracts'] as const;

/** The frozen order, by id. The cell compares against this and nothing else. */
export const FROZEN_ORDER: readonly string[] = [
  'support',
  'leads', 'clients', 'invoices', 'expenses', 'books', 'events', 'notes', 'calendar',
  'storefront', 'portfolio', 'couture', 'team', 'contracts', 'tds', 'billing', 'settings',
  'collab', 'advisor',
] as const;

/**
 * THE DOORS OUT OF THE SHELL — DECLARED, NOT COUNTED BY HAND. P7.2 (CE-39, 2026-09-04).
 *
 * The flip (arm (a), R-39.24) retired the old `/vendor` tree in the same commit that moved
 * the shell onto its paths, and with it every INTERIM_* census that described the two trees
 * living side by side: `INTERIM_VENDOR_ROOMS` (already empty since 2b), `INTERIM_VENDOR_MOUNTS`
 * (the Header census of pages that no longer exist), `INTERIM_BOTTOMNAV_MOUNTS` (the one
 * layout that mounted it, deleted), `INTERIM_HUB_PRIMERS` (empty) and `FALLBACK_TREE_BASES`
 * (SliceShell's `/vendor/list/` arm, collapsed with `useInShell`). Their cells (b40 C24, C26,
 * C31, C35) were retired-with-the-reader or inverted, assertions quoted in the P7.2 handover.
 *
 * What survives the flip is smaller and worth declaring: the shell still links OUT to a
 * handful of pages it has no twin for, kept in `app/vendor/(legacy)` under FORK 1 arm (a)
 * (F-39.77 ports the Discover presence in Block 09). This list is the allow-list the
 * inverted C31 reads: a crossed room may reach these and only these outside the shell.
 * Everything under `/vendor/…` is now the shell; the question C31 asks changed from "no
 * undeclared /vendor literal" to "no `/w/` literal, and no door to a page that no longer
 * exists".
 */
export const LEGACY_VENDOR_LINKS: readonly string[] = [
  '/vendor/discover',           // the hub — Storefront's Discover row (screen.tsx) and profile's back door
  '/vendor/discover/preview',   // Settings' "see what couples see" row (R-38.7)
  '/vendor/discover/profile',   // Storefront and SettingsScreen
  '/vendor/onboarding',         // WorklistBoot's guard
] as const;

export function roomHref(id: string): string {
  const room = ROOMS.find((r) => r.id === id);
  // A miss returns the directory rather than throwing. This runs inside render on a
  // vendor's money surface, and a thrown error there costs her the page to save a typo the
  // cell below catches at the bench. `b40` C31 asserts every id passed here resolves, so
  // the fallback is a safety net that is never reached rather than a silent wrong answer.
  return room ? room.href : '/vendor/rooms';
}

/**
 * THE GRID'S OWN VIEW OF THE REGISTRY \u2014 hosted rooms filtered OUT here, once.
 *
 * ⚠ THE FILTER LIVES IN THE REGISTRY, NOT IN THE GRID. `RoomsGrid` calling
 * `.filter((r) => !r.hostedBy)` on the way past would put the rule about what a
 * tile IS inside the component that draws tiles, and the next surface to list
 * rooms would either repeat it or forget it. This function is already the one
 * door every band render goes through; the rule belongs behind it.
 *
 * ⚠ AND `ROOMS` IS UNTOUCHED, WHICH IS THE POINT. `roomHref`, `ROOM_FOR_KIND` and
 * every address the shell resolves still see all nineteen. Only the glass sees
 * eighteen.
 */
export function roomsInBand(band: Band): Room[] {
  return ROOMS.filter((r) => r.band === band && !r.hostedBy);
}

/**
 * THE ROOMS A HOST CARRIES. The host's tile wears their attention counts on top
 * of its own (c-40.42: 「the badge rides the host」), so Business Solutions shows
 * the unsigned-contract figure that Contracts' own tile used to show.
 *
 * ⚠ A DERIVED RULE WITH ONE FIELD BEHIND IT, and that asymmetry with `headline`
 * is deliberate rather than sloppy. `headline` is a DECISION about two named
 * tiles and could have gone either way, so it is stored. This is a CONSEQUENCE of
 * `hostedBy`: once the founder says the hub houses Contracts, where the count goes
 * is not a second question. A second field would be a second thing to forget.
 */
export function roomsHostedBy(id: string): Room[] {
  return ROOMS.filter((r) => r.hostedBy === id);
}
