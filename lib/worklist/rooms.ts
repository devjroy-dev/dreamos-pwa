// lib/worklist/rooms.ts — THE EIGHTEEN ROOMS, IN FROZEN ORDER.
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
  // \u00a74-3 \u00b7 THE FIRST BATCH OF THE SEVEN CROSSED TOGETHER, AND THE KINSHIP IS THE
  // REASON. These three are the VISUAL family \u2014 how the vendor looks to a couple. They do
  // not share a definition the way the six list rooms did, so the family motion buys less
  // here; what it buys is that Storefront's own Portfolio row crosses in the SAME cut as
  // Portfolio, so the address book answers correctly at every instant rather than pointing
  // a crossed surface at an uncrossed one for the length of a sitting.
  { id: 'storefront',label: 'Storefront',band: 'business', href: '/w/storefront',       pinnable: true  },
  { id: 'portfolio', label: 'Portfolio', band: 'business', href: '/w/portfolio',        pinnable: true  },
  { id: 'couture',   label: 'Couture',   band: 'business', href: '/w/couture',          pinnable: true  },
  // \u00a74-4 \u00b7 BATCH \u2461. Three bodies with nothing shared \u2014 a hub of Studio rows, a document
  // list and a ledger \u2014 so this batch buys none of the family coherence \u00a74-3 did. It is a
  // batch because the three crossings are mechanically identical after \u00a74-3 proved the
  // shape, and because splitting them would cost three floor runs to learn the same thing.
  // \u26a0 `team`'s href moves from `/vendor/team-hub` to `/w/team`, so the ROUTE SEGMENT
  // changes name as well as tree. The fallback keeps its own spelling; only the tile's
  // destination is renamed, and no other file spells either one (derived, not assumed).
  { id: 'team',      label: 'Team',      band: 'business', href: '/w/team',             pinnable: true  },
  { id: 'contracts', label: 'Contracts', band: 'business', href: '/w/contracts',        pinnable: true  },
  { id: 'tds',       label: 'TDS',       band: 'business', href: '/w/tds',              pinnable: true  },
  // R-38.1 \u00b7 CROSSED AT M-FINISH S1. These two now render as children of WorklistShell
  // under app/w/, so tapping them mounts no second layout, no second header and no second
  // session resolve. The /vendor routes survive on disk as untouched fallbacks and nothing
  // in the shell links to them.
  { id: 'billing',   label: 'Billing',   band: 'business', href: '/w/billing',          pinnable: true  },
  { id: 'settings',  label: 'Settings',  band: 'business', href: '/w/settings',         pinnable: true  },
  { id: 'support',   label: 'Business Solutions', band: 'business', href: '/w/support', pinnable: false },
  // R-37.87, and CROSSED AT §4-4 BATCH ③ — THE LAST ROOM. The tile deep-linked the carried
  // collab surface for four sittings; it points into the shell now, and its own interior
  // (the responses thread) crossed in the SAME cut, because a room whose interior stayed
  // behind is F-38.1 inside that room's walls. Position is the founder's to reorder in one
  // word — the frozen-order cell asserts wherever he puts it.
  { id: 'collab',    label: 'Collab',    band: 'business', href: '/w/collab',           pinnable: true  },
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
  // SHRANK BY THREE AT \u00a74-3 (seven \u2192 four). Storefront, Portfolio and Couture left in the
  // SAME EDIT that changed their hrefs above. THIS IS THE LOAD-BEARING ASSERTION OF THE
  // WHOLE ARC and it is the one set R-38.11's shrink-or-hold standing binds hardest: four
  // rooms remain, the number is derived from this list rather than kept in a handover
  // sentence, and the next batch is team \u00b7 contracts \u00b7 tds, then collab alone.
  // SHRANK BY THREE AT \u00a74-4 (four \u2192 one). Team, Contracts and TDS left in the SAME EDIT
  // that changed their hrefs above. ONE ROOM REMAINS \u2014 collab \u2014 and when it goes this
  // list is empty, which is the condition F-38.52's mode bridge names for its own
  // retirement. The number is derived from this list and from nowhere else.
  //
  // ── SHRANK BY ONE AT \u00a74-4 BATCH \u2462 (one \u2192 ZERO). THE LIST IS EMPTY. ──────────
  // Collab left in the SAME EDIT that changed its href above, for the fifth and last time.
  // EIGHTEEN ROOMS, EIGHTEEN SHELL ROUTES: no tile in this registry deep-links the old tree
  // any more, and the count that says so was derived from this list at every step rather
  // than carried in a handover sentence nobody re-derives. The arc ran 14 \u2192 8 \u2192 7 \u2192
  // 4 \u2192 1 \u2192 0.
  //
  // ⚠ EMPTY IS NOT RETIRED, AND THE DIFFERENCE IS THE WHOLE REASON THIS STAYS. The cell
  // asserts the SET BOTH WAYS \u2014 every /vendor href in ROOMS appears here, and every id
  // here still carries one \u2014 so at zero it now asserts that NO room has a /vendor href.
  // A room that slides back out of the shell reddens against an empty list exactly as it
  // would have against a full one. Deleting the constant would delete that guard on the day
  // it finally became simple to state.
  //
  // ITS CONDITION FIRED. F-38.52's mode bridge named this emptiness as its own retirement
  // trigger and the bridge retires in this same cut \u2014 derivable by command from this
  // file, which is why nothing had to remember it.
] as const;

/**
 * THE /vendor LINKS CROSSED SHELL SURFACES STILL CARRY.
 *
 * R-38.7 puts 「Profile layout」 inside Settings, and Settings crossed at S1 while
 * /vendor/discover/preview did not. So a shell surface links out of the shell, and the cell
 * asserts THE SET rather than the absence — an exception that is counted cannot grow
 * without reddening, whereas an exception that is merely explained can.
 *
 * ── §4-3 · C-2 · THIS SET GROWS AT A CROSSING, AND THAT IS RULED ────────────
 * R-38.11 as amended reads that "the interim sets may only shrink or hold with the movement
 * stated", and this file's own `INTERIM_HUB_PRIMERS` note cites that standing over THIS
 * set. Storefront's crossing convicted the reading: its Discover row points at
 * `/vendor/discover`, a surface with no registry entry and no crossing chartered this
 * block, so the crossing could not happen without adding an entry here.
 *
 * **SHRINK-ONLY IS UNSATISFIABLE FOR THIS SET BY CONSTRUCTION.** It is not a crossing
 * ledger. `INTERIM_VENDOR_ROOMS` and `INTERIM_VENDOR_MOUNTS` count what has NOT crossed, so
 * they shrink as the arc proceeds and shrink-only is exactly right for them. This one
 * counts what crossed surfaces still POINT AT — so it necessarily grows whenever a room
 * crosses holding a link to an uncrossed non-room, and it can only shrink when the TARGET
 * crosses at Phase 7. Forbidding its growth forbids crossing itself.
 *
 * RULED AT CE-38 RELAY #1, §4-3: shrink-or-hold binds the two crossing ledgers; this set
 * grows by NAMED ENTRY at a crossing and shrinks only at Phase 7. No fourth set was minted
 * — the `INTERIM_HUB_PRIMERS` precedent bought a separate name for a CLASS no instrument
 * could see, and this is an existing class gaining a member.
 *
 * EVERY ENTRY NAMES ITS SOURCE LINE, per the same ruling: an entry whose site is not named
 * is an entry nobody can retire, because retiring it means proving the last caller is gone.
 */
export const INTERIM_VENDOR_LINKS: readonly string[] = [
  // R-38.7's row: 「Profile layout」, inside Settings.
  //   components/vendor/SettingsScreen.tsx — the Profile layout row
  //   app/vendor/portfolio/screen.tsx — 「See your profile as couples do」, since §4-3.
  //     A SECOND SITE FOR AN ENTRY THAT WAS ALREADY COUNTED, which is the set working as
  //     designed: the string was already declared, so Portfolio's crossing added a caller
  //     and not an exception.
  '/vendor/discover/preview',
  // DERIVED BY THE GATE, NOT BY READING. SettingsScreen's own edit-profile control. It was
  // missing from the first cut of this list because the body's outbound links had never
  // been enumerated before the surface crossed — the audit found it in one run, and the
  // list is honest only because it is asserted rather than described.
  //   components/vendor/SettingsScreen.tsx — the edit-profile control
  //   app/vendor/storefront/screen.tsx — the 「Your bio」 row, since §4-3.
  '/vendor/discover/profile',
  // ⚠ THE §4-3 ENTRY, AND THE ONE THAT FORCED C-2's RULING ABOVE.
  //   app/vendor/storefront/screen.tsx — `SECTIONS`, the Discover row.
  // Storefront is a hub page whose sections LINK standing surfaces, and Discover is the one
  // section target that is not a room. The vendor who taps it LEAVES THE SHELL — second
  // layout, second Splash, second session resolve — which is F-38.1's shape surviving at a
  // declared seam rather than a hidden one. It retires when Discover crosses at Phase 7,
  // not before, and it is counted here so it cannot grow quietly in the meantime.
  '/vendor/discover',
  // ── §4-4 · TEAM'S THREE, RULED IN ADVANCE RATHER THAN DECLARED AFTERWARDS ──
  // `/w/team` crosses as a ROOM OF DECLARED DOORS: every one of its three rows leaves the
  // shell. That is Storefront's Discover row's class, but three-of-three rather than
  // one-of-two, so it went to the chair at the survey and was ratified before the crossing
  // landed rather than explained after it.
  //
  // All three are Studio surfaces with no registry entry and no crossing chartered this
  // block. They cross at their own block or they die with `app/vendor/layout.tsx` at Phase
  // 7 — and THIS LEDGER IS WHAT WILL SAY WHICH, because a set that must be edited to retire
  // an entry cannot be retired by forgetting.
  //   lib/vendor/studioShared.tsx — `STUDIO_ITEMS`, the Team row
  '/vendor/studio/team',
  //   lib/vendor/studioShared.tsx — `STUDIO_ITEMS`, the Tasks row
  '/vendor/studio/tasks',
  //   lib/vendor/studioShared.tsx — `STUDIO_ITEMS`, the Team Payments row
  '/vendor/studio/team-payments',
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
  // ── \u00a74-4 BATCH \u2462 \u00b7 TWO PATHS MOVE HERE AND BOTH HOLD AT 1 ─────────────────
  // The census does not fall for collab, and R-38.11 as amended is satisfied by the
  // MOVEMENTS BEING STATED rather than by a number being made to drop. In each of the two
  // files below, body and route were ONE file: the split put the body in a `screen.tsx` the
  // shell imports and left the mount on the fallback ROUTE, so each mount moved WITHIN its
  // crossing rather than out of it. Calendar's \u00a74-2 precedent, taken twice in one cut.
  //
  // BOTH MOVEMENTS, NAMED, because the room and its interior crossed together and a reader
  // who saw only one line move would think the other stayed behind:
  //   \u00b7 app/vendor/collab/page.tsx                      \u2014 body \u2192 app/vendor/collab/screen.tsx
  //   \u00b7 app/vendor/collab/[post_id]/responses/page.tsx  \u2014 body \u2192 \u2026/responses/screen.tsx
  // The estate-wide total therefore holds at 25 across 22 files, unchanged by this batch.
  ['app/vendor/collab/[post_id]/responses/page.tsx', 1],
  ['app/vendor/collab/page.tsx', 1],
  ['app/vendor/contracts/page.tsx', 1],
  // ── §4-3 · 2 → 1, THE ONE LINE IN THIS BATCH THAT ACTUALLY SHRINKS ────────
  // `CoutureScreen` carried TWO `<Header/>` mounts, in two RETURN ARMS of one component:
  // the `couture_eligible === false` gate and the main screen. A mount at the fallback
  // ROUTE sits above both arms, so two became one. Storefront and Portfolio each had a
  // single mount and theirs MOVED to their fallback routes rather than leaving, so their
  // lines below hold at 1 — calendar's §4-2 precedent, and R-38.11 as amended is satisfied
  // by the movement being STATED rather than by the number being made to fall.
  // Three rooms crossing, one line shrinking: 26 → 25 across 22 files.
  ['app/vendor/couture/page.tsx', 1],
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
  // ── CE-39 step 2a · R-39.7 · THREE GATES LEFT, AND THEIR MOUNTS WITH THEM ────
  // Each studio page carried a second `<Header/>` inside its `session.tier !== 'prestige'`
  // return arm; the arm is DELETED (Studio Suite is open to every tier), so the mount it
  // carried is gone, not moved. tasks 2 → 1, team-payments 2 → 1, team 1 → 0 (its only
  // counted mount was the gate's; the line leaves). Estate-wide: 25 → 22 across 21 files (derived by count at the cut, not arithmetic).
  ['app/vendor/studio/tasks/page.tsx', 1],
  ['app/vendor/studio/team-payments/page.tsx', 1],
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
/**
 * THE HUB PRIMERS \u2014 FOUR DOORS OUT OF THE SHELL THAT NO INSTRUMENT COULD SEE. CURED AT
 * CE-39 S2/6; the history below is kept in the past tense it now belongs to.
 *
 * ── F-38.41, AND IT PREDATES THIS SITTING BY A CROSSING ────────────────────
 * `wl_audit` and `b40` C31 both match `/vendor/` \u2014 with the trailing slash. Every one of
 * these pushes `/vendor?<query>`: the OLD HUB ROOT with a query string and no path segment.
 * The matcher walked straight past all four, and three have been reachable from crossed
 * rooms since \u00a74-1 while both gates reported zero strays. The audit found the fourth only
 * because calendar crossed today and dragged a persona byte in beside it.
 *
 * **A SHELL SURFACE THAT PUSHES `/vendor?draft=` UNMOUNTS THE SHELL.** The vendor tapped
 * 「Send to Chat」 in Notes and landed on the old hub \u2014 second layout, second Splash, second
 * medallion, second session resolve. That was F-38.1 entire, live on eight rooms behind a
 * control the founder uses, from \u00a74-1 until CE-39 S2/6.
 *
 * ── DECLARED, NOT ALLOWED (the FALLBACK_SLICE_BASE precedent, S2 \u00a79) ────────
 * The alternative was to notice them, judge them legitimate and say nothing, leaving both
 * instruments with an exception they cannot see \u2014 which is the exact shape the S2 ZIP
 * bounce convicted. Counted here so it cannot grow quietly, and matched EXACTLY: `/vendor`
 * with a query passes, `/vendor/anything` does not.
 *
 * ⚠ THESE ARE **NOT** IN `INTERIM_VENDOR_LINKS`, AND THE SEPARATION IS DELIBERATE. That set
 * is shrink-only by R-38.11's amended standing; adding four entries to it would be widening
 * a set the estate has ruled may only narrow. This is a new, separately-named exception with
 * its own retirement, so the shrink-only guarantee on the other set stays literally true.
 *
 * THE CURE WAS NOT A RE-POINT, AND IT HAS LANDED (CE-39 S2/6, R-39.3). These carried a PREFILL
 * into a chat surface, and the shell's own `AskSheet` took no draft parameter \u2014 giving it
 * one was the design sitting this comment priced. `AskSheet` now takes ONE `prefill`, the four
 * doors are tree-blind through lib/worklist/askContext.tsx (openAsk(text)), and inside the
 * shell each opens the sheet IN PLACE. The masthead never leaves.
 *
 * ── THE SET IS EMPTY AND ITS CELL IS INVERTED BY LABEL ──────────────────────
 * C31 used to redden on an ABSENT declaration (「four doors have no home in the registry」).
 * It now reddens on a NON-EMPTY one: a primer that reappears here is a door that has slid
 * back out of the shell, and the declaration stays so that the cell has something to read.
 * The four sites, as they stood at 7addef1 (the predecessor's s-5 corrected the calendar
 * cite from :431 to :594): components/vendor/slices/WishboneSheet.tsx `tellVictor` \u00b7
 * components/vendor/slices/BinderCard.tsx `askVictor` \u00b7 components/vendor/NotesBody.tsx
 * (the detail sheet's 「Send to Chat」) \u00b7 components/vendor/CalendarDaySheet.tsx (「Ask TDW
 * about this date」). The /vendor tree still makes the push \u2014 from app/vendor/layout.tsx's
 * provider, which is NOT reachable from any /w route and retires with the tree at Phase 7.
 */
export const INTERIM_HUB_PRIMERS: readonly string[] = [] as const;

/**
 * THE TREE-AWARE FALLBACK BASES \u2014 EVERY `/vendor` PREFIX A CROSSED ROOM STILL SHIPS.
 *
 * ── \u00a74-4 BATCH \u2462 \u00b7 THIS WAS A SCALAR AND IT IS A SET NOW, BY LABEL ──────────
 * `FALLBACK_SLICE_BASE` held ONE string because at S2 \u00a79 there was one: `SliceDoor`'s
 * lateral movement inside the list family. Collab's crossing produced the SECOND instance of
 * the identical class \u2014 `openResponses` in `app/vendor/collab/screen.tsx` pushes a room's
 * own INTERIOR and is tree-aware for the same reason the Door is.
 *
 * MINTING A SECOND SCALAR WITH A SECOND NAME IS HOW THE CLASS WALKS AWAY FROM ITS CURE, and
 * this arc has filed that shape twice in three sittings (F-38.59, the FAB offset; F-38.60,
 * the quote pairing) \u2014 both times a rule reasoned about carefully at one site and never
 * carried to the next. A set with the reason at each member is the shape that survives a
 * third instance. C31 reads the SET and matches EXACTLY, exactly as it read the scalar.
 *
 * WHAT A MEMBER IS: a BASE, never a whole address. `/vendor/list/` passes and
 * `/vendor/list/leads` does not, because a full carried href in the bytes means a room slid
 * back out of the shell. That exactness is the whole guard and it does not loosen here.
 *
 * DECLARED, NOT ALLOWED. Each of these is a live `/vendor` string inside a crossed room's
 * chunk. The alternative was to notice them, judge them legitimate, and leave the audit and
 * the bench with an exception they cannot see \u2014 the shape the S2 ZIP bounce convicted.
 *
 * THEY RETIRE WITH THEIR OWN FALLBACK ROUTES AT PHASE 7, NOT BEFORE.
 */
export const FALLBACK_TREE_BASES: readonly string[] = [
  // components/vendor/slices/SliceShell.tsx \u2014 `SliceDoor`, mounted on the surviving
  // fallback, pushes `/vendor/list/<slice>` so a vendor deep-linked into the old tree is not
  // thrown half-way into the new one mid-family. Ruled tree-aware at the S2 ZIP bounce.
  '/vendor/list/',
  // app/vendor/collab/screen.tsx \u2014 `openResponses`, since \u00a74-4 batch \u2462. The responses
  // thread is COLLAB'S OWN INTERIOR, so the same rule applies for the same reason: the
  // vendor stays in the tree she is already in. It does NOT ask `roomHref`, because the
  // address book answers for ROOMS and a sub-route is not a room.
  '/vendor/collab/',
] as const;

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
