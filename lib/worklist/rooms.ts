// lib/worklist/rooms.ts — THE SEVENTEEN ROOMS, IN FROZEN ORDER.
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
  // ── TOP BAND \u00b7 seven ───────────────────────────────────────
  { id: 'leads',     label: 'Leads',     band: 'work', href: '/w/leads',     pinnable: true  },
  { id: 'clients',   label: 'Clients',   band: 'work', href: '/w/clients',   pinnable: true  },
  { id: 'invoices',  label: 'Invoices',  band: 'work', href: '/w/invoices',  pinnable: true  },
  { id: 'expenses',  label: 'Expenses',  band: 'work', href: '/w/expenses',  pinnable: true  },
  { id: 'events',    label: 'Events',    band: 'work', href: '/w/events',    pinnable: true  },
  { id: 'notes',     label: 'Notes',     band: 'work', href: '/w/notes',     pinnable: true  },
  { id: 'calendar',  label: 'Calendar',  band: 'work', href: '/w/calendar',           pinnable: true  },
  // ── BOTTOM BAND \u00b7 eleven ──────────────────────────────────
  { id: 'storefront',label: 'Storefront',band: 'business', href: '/vendor/storefront',  pinnable: true  },
  { id: 'portfolio', label: 'Portfolio', band: 'business', href: '/vendor/portfolio',   pinnable: true  },
  { id: 'couture',   label: 'Couture',   band: 'business', href: '/vendor/couture',     pinnable: true  },
  { id: 'team',      label: 'Team',      band: 'business', href: '/vendor/team-hub',    pinnable: true  },
  { id: 'contracts', label: 'Contracts', band: 'business', href: '/vendor/contracts',   pinnable: true  },
  { id: 'tds',       label: 'TDS',       band: 'business', href: '/vendor/tds',         pinnable: true  },
  // R-38.1 \u00b7 CROSSED AT M-FINISH S1. These two now render as children of WorklistShell
  // under app/w/, so tapping them mounts no second layout, no second header and no second
  // session resolve. The /vendor routes survive on disk as untouched fallbacks and nothing
  // in the shell links to them.
  { id: 'billing',   label: 'Billing',   band: 'business', href: '/w/billing',          pinnable: true  },
  { id: 'settings',  label: 'Settings',  band: 'business', href: '/w/settings',         pinnable: true  },
  { id: 'support',   label: 'Business Solutions', band: 'business', href: '/w/support', pinnable: false },
  // R-37.87. A-4 interim like every other /vendor href: the tile DEEP-LINKS the existing
  // collab surface, carried not rebuilt, until it crosses. Position is the founder's to
  // reorder in one word — the frozen-order cell asserts wherever he puts it.
  { id: 'collab',    label: 'Collab',    band: 'business', href: '/vendor/collab',      pinnable: true  },
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
  { id: 'advisor',   label: 'Advisor',   band: 'business', href: '/w/advisor',          pinnable: false },
] as const;

// R-37.87's seventeen AMENDED BY FOUNDER WORD to eighteen (CE-38 R-38.9). Count history,
// every step worded or derived: 11 → 15 → 16 → 17 → 18. Eighteen is six full rows of
// three; the orphan row that R-37.87 left behind dies with this amendment.
export const ROOM_COUNT_EXPECTED = 18;
export const TOP_BAND_EXPECTED = 7;
export const BOTTOM_BAND_EXPECTED = 11;

/** The frozen order, by id. The cell compares against this and nothing else. */
export const FROZEN_ORDER: readonly string[] = [
  'leads', 'clients', 'invoices', 'expenses', 'events', 'notes', 'calendar',
  'storefront', 'portfolio', 'couture', 'team', 'contracts', 'tds', 'billing', 'settings', 'support',
  'collab', 'advisor',
] as const;

/**
 * THE ROOMS THAT HAVE NOT CROSSED YET — DECLARED, NOT COUNTED BY HAND.
 *
 * R-38.1's cell cannot honestly read "no /vendor href exists in the registry" this sitting,
 * because fourteen rooms are still carried surfaces. An assertion that is false on purpose
 * is worse than no assertion — a seat reading it would either loosen it or ignore it, and
 * both teach that this cell may be argued with.
 *
 * So the cell asserts the SET instead: every /vendor href in ROOMS appears below, and every
 * id below still carries a /vendor href. A room that silently slides back out of the shell
 * reddens; a room that crosses without leaving this list reddens too. The number of
 * remaining crossings is derived from the registry rather than kept in a handover sentence
 * that nobody re-derives.
 */
export const INTERIM_VENDOR_ROOMS: readonly string[] = [
  // SHRANK BY SIX AT M-FINISH S2 \u00a74-1 (fourteen \u2192 eight). The list family left this
  // list in the SAME edit that changed its hrefs, which is the whole point of asserting the
  // SET rather than a count: a room that crosses without leaving here reddens, and a room
  // that slides back out of the shell reddens too.
  // SHRANK BY ONE AT \u00a74-2 (eight \u2192 seven). Calendar crossed first, and its removal from
  // this list is the SAME EDIT that changed its href above — which is the whole point of
  // asserting the SET rather than a count: a room that crosses without leaving here reddens,
  // and a room that slides back out of the shell reddens too.
  'storefront', 'portfolio', 'couture', 'team', 'contracts', 'tds', 'collab',
] as const;

/**
 * THE ONE /vendor LINK A CROSSED SHELL SURFACE STILL CARRIES.
 *
 * R-38.7 puts 「Profile layout」 inside Settings, and Settings crossed this sitting while
 * /vendor/discover/preview did not. So a shell surface links out of the shell exactly once,
 * and the cell asserts THE SET rather than the absence — an exception that is counted
 * cannot grow without reddening, whereas an exception that is merely explained can.
 */
export const INTERIM_VENDOR_LINKS: readonly string[] = [
  // R-38.7's row: 「Profile layout」, inside Settings.
  '/vendor/discover/preview',
  // DERIVED BY THE GATE, NOT BY READING. SettingsScreen's own edit-profile control. It was
  // missing from the first cut of this list because the body's outbound links had never
  // been enumerated before the surface crossed — the audit found it in one run, and the
  // list is honest only because it is asserted rather than described.
  '/vendor/discover/profile',
] as const;

/**
 * THE OLD CHROME'S SURVIVING MOUNTS \u2014 ENUMERATED, BECAUSE "ZERO" WAS NOT REACHABLE.
 *
 * R-38.11 first read "`Header.tsx` and `BottomNav.tsx` end this sitting with zero mounts on
 * the branch". Derived at 7af1e82 that could not be met and could not be met LATER either,
 * and the two reasons are worth writing down rather than discovering twice:
 *
 *   \u00b7 Of the twenty-seven Header mounts on the branch, only twelve belonged to rooms that
 *     are crossing at all. The rest sit on the /vendor hub itself, on Discover, Featured,
 *     More and the four Studio surfaces \u2014 pages that are not rooms, are not in this
 *     registry, and are not chartered to cross in this block.
 *   \u00b7 `BottomNav` has exactly ONE mount in the whole tree and it is not in any room:
 *     `app/vendor/layout.tsx` mounts it. Crossing every room in this registry removes zero
 *     BottomNav mounts. Only retiring that layout does, and R-38.11's own "nothing deletes"
 *     forbids it this block.
 *
 * SO THE CELL ASSERTS THE SET, in the shape this file already uses twice above. The ruling
 * was struck and re-cut at CE-38 relay #1 item 2. An assertion that is false on purpose is
 * worse than no assertion \u2014 a seat reading it would either loosen it or ignore it, and both
 * teach that this cell may be argued with.
 *
 * THE COUNTS ARE COMMENT-BLIND, and that is not a detail. S1's census read 28 by eye and
 * counted a `<Header \u2026/>` written INSIDE a comment explaining `<Header \u2026/>`. The bench's
 * own `strip()` law exists for exactly this and was not applied to the census that produced
 * the number. Re-derived through `strip()` at 7af1e82 the true base was 27 across 23 files;
 * after \u00a74-1 it is 26 across 22. Filed as F-38.24.
 *
 * A RE-ADD REDDENS. A REMOVAL REDDENS UNTIL THIS SHRINKS. That is the whole contract: the
 * exception is counted rather than explained, so it cannot grow quietly, and a room that
 * crosses without deleting its line here does not get to call itself crossed.
 */
export const INTERIM_VENDOR_MOUNTS: readonly (readonly [string, number])[] = [
  ['app/vendor/billing/page.tsx', 1],
  ['app/vendor/calendar/page.tsx', 1],
  ['app/vendor/collab/[post_id]/responses/page.tsx', 1],
  ['app/vendor/collab/page.tsx', 1],
  ['app/vendor/contracts/page.tsx', 1],
  ['app/vendor/couture/page.tsx', 2],
  ['app/vendor/discover/page.tsx', 1],
  ['app/vendor/discover/profile/page.tsx', 1],
  ['app/vendor/discover/submit/page.tsx', 1],
  ['app/vendor/featured/page.tsx', 2],
  // THE FAMILY'S ONE SURVIVING MOUNT, AND IT IS NEW. `SliceShell` and the `notes` module
  // each carried their own; both gave them up, and the fallback ROUTE took one mount that
  // covers all six modules. Net for \u00a74-1: minus two, plus one.
  ['app/vendor/list/[slice]/page.tsx', 1],
  ['app/vendor/more/page.tsx', 1],
  ['app/vendor/page.tsx', 1],
  ['app/vendor/portfolio/page.tsx', 1],
  ['app/vendor/settings/page.tsx', 1],
  ['app/vendor/storefront/page.tsx', 1],
  ['app/vendor/studio/notes/page.tsx', 1],
  ['app/vendor/studio/tasks/page.tsx', 2],
  ['app/vendor/studio/team-payments/page.tsx', 2],
  ['app/vendor/studio/team/page.tsx', 1],
  ['app/vendor/tds/page.tsx', 1],
  ['app/vendor/team-hub/page.tsx', 1],
] as const;

/**
 * `BottomNav`'s one mount. Separate from the list above because it is a DIFFERENT FACT with
 * a different retirement: it is not a room's chrome at all, it is the old root layout's, and
 * it leaves when that layout does. Ruled at CE-38 relay #1 item 2 \u2014 Phase 7, with the layout.
 */
export const INTERIM_BOTTOMNAV_MOUNTS: readonly string[] = [
  'app/vendor/layout.tsx',
] as const;

/**
 * WHERE A ROOM LIVES \u2014 THE ONE ANSWER, READ FROM THE ONE PLACE THAT KNOWS.
 *
 * R-38.1 FAILED at the S2 ZIP bounce on nine reachable pairs from four source sites, and
 * every one of them was a HARDCODED `/vendor/\u2026` string written years before the shell:
 * a tier-gate nudge and three cross-plane whispers. R-38.11's SliceDoor re-point never
 * touched them because they are not doors, and the seat that wrote that re-point never
 * looked past the doors. **Reachable is reachable** \u2014 R-38.11 amended by label: a crossing
 * covers every file in a crossed room's import graph, not only the files the room mounts.
 *
 * THE CURE IS NOT A SWEEP, IT IS AN ADDRESS BOOK. A literal spells a destination; this
 * function ASKS the registry, which is already the one home for where every room lives. A
 * room that crosses at \u00a74-2 takes its inbound links with it, in the same edit that changes
 * its href, with nothing else to remember.
 *
 * \u26a0 IT IS DELIBERATELY NOT TREE-AWARE, AND THE ASYMMETRY WITH `SliceDoor` IS RULED, NOT
 * ACCIDENTAL (CE-38 relay, S2 ZIP bounce). The Door is LATERAL movement inside one family:
 * six slices, one component, and staying in the tree you are already in is what keeps the
 * /vendor fallback coherent as a whole surface. A cross-link to a DIFFERENT room is a
 * departure whichever tree it starts in, so the registry's answer is the one answer and
 * both trees get it. Two rules, two shapes, each with its reason at its own site.
 */
/**
 * THE SLICE DOOR'S FALLBACK BASE \u2014 THE ONE `/vendor` PREFIX A CROSSED ROOM STILL SHIPS.
 *
 * `SliceDoor` is LATERAL movement inside one family and is ruled tree-aware (CE-38 relay,
 * S2 ZIP bounce): mounted under /w it pushes `/w/<slice>`, mounted on the surviving
 * fallback it pushes `/vendor/list/<slice>`, so a vendor deep-linked into the old tree does
 * not get thrown half-way into the new one mid-family.
 *
 * That second branch is a `/vendor` string inside the six crossed rooms' chunks, and it
 * stopped being covered the moment those six left INTERIM_VENDOR_ROOMS. **So it is
 * DECLARED, not allowed.** The alternative was to notice it, judge it legitimate, and leave
 * both the audit and the bench with an exception they cannot see \u2014 which is the shape the
 * ZIP bounce just convicted: a cell that passes while a link rots.
 *
 * It retires with `app/vendor/list/` at Phase 7, not before.
 */
export const FALLBACK_SLICE_BASE = '/vendor/list/';

export function roomHref(id: string): string {
  const room = ROOMS.find((r) => r.id === id);
  // A miss returns the directory rather than throwing. This runs inside render on a
  // vendor's money surface, and a thrown error there costs her the page to save a typo the
  // cell below catches at the bench. `b40` C31 asserts every id passed here resolves, so
  // the fallback is a safety net that is never reached rather than a silent wrong answer.
  return room ? room.href : '/w/rooms';
}

export function roomsInBand(band: Band): Room[] {
  return ROOMS.filter((r) => r.band === band);
}
