// lib/solutions/routes.ts — TDW_19 P0-B · THE SURFACE ADDRESS BOOK.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS FILE EXISTS AT ALL — R-38.1's DOCTRINE, IN A FOOTPRINT R-38.1 CANNOT REACH
// ═══════════════════════════════════════════════════════════════════════════
// `f542795` replaced four hardcoded `/vendor` literals with `roomHref`, and
// `b40` C31 now polices strays. That cure covers ROOMS. These six surfaces are
// not rooms and cannot become rooms: `lib/worklist/rooms.ts` belongs to the
// M-FINISH S2 seat (kickoff §2) and this seat does not edit it.
//
// So without this file the six addresses would be six scattered string
// literals in exactly the shape R-38.1 has just finished deleting — and C31
// would not catch them, because its matcher is keyed on `/vendor` and these
// live under `/vendor/support`. The doctrine would have a hole precisely where the
// newest code is.
//
// `bs_audit.mjs` carries C31's shape in this seat's own gate: **no
// `/vendor/support/` literal may appear anywhere outside this file.**
//
// ── A MISS RETURNS THE INDEX RATHER THAN THROWING ──────────────────────────
// Same reasoning `roomHref` states at rooms.ts:254 and for the same reason:
// this runs inside render on a vendor's surface, and a thrown error there costs
// her the page to save a typo the bench catches anyway. The audit asserts every
// slug passed here resolves, so the fallback is a net that is never reached
// rather than a silent wrong answer.

// ── RETIRED WITH THEIR READERS — R-40.23, founder-ruled 2026-09-04 ──────────
// `SURFACE_SLUGS`, `SurfaceSlug` and `surfaceHref` are GONE, together with the
// six pages under `app/vendor/(shell)/support/` they addressed. The nine R-40.1
// rows replace the six R-19.2 ones. Each retired address carries its named
// successor in `docs/TDW_19_G11_BUILD_HANDOVER.md`; four distinct successors
// absorb the six, and five of the nine inherit no predecessor at all.
//
// Retire WITH the reader, never a commented corpse: nothing here is left
// disabled or behind a flag. The audit cells keyed to the six retire in the
// same edit (tools/bs_audit.mjs, amended by label).

import { roomHref, ROOMS, type ShelfItem } from '@/lib/worklist/rooms';
import type { RoomKey } from '@/lib/solutions/copy';
/** The room index. Still the one home for this address. */
export const SOLUTIONS_INDEX_HREF = '/vendor/support';

// ── R-G11.12 · THE WEDDING-PAGES ROOM'S ADDRESS ─────────────────────────────
// FOUNDER-RULED (a): the room lives here, on the NOT-A-ROOM precedent this file
// was written for, and NOT in `lib/worklist/rooms.ts` — `ROOM_COUNT_EXPECTED`
// stays 19 and the tile grid gains nothing.
//
// ⚠ WHY IT NEEDS A HOME AT ALL, DERIVED RATHER THAN ASSUMED (F-40.35's sibling,
// F-40.34's discipline): `b40` C31 walks the import graph from every shell page
// and matches any `/vendor…` string literal, then compares EXACTLY against a
// declared set built from `rooms.ts` hrefs plus `LEGACY_VENDOR_LINKS` plus three
// nav seats. `/vendor/wedding-pages` is in none of them, so a bare literal in
// the hub would be a stray and C31 would redden on a correct build. C31 is
// amended by label to read this constant into its declared set — one home, and
// the cell tightens with it rather than being loosened.
export const WEDDING_PAGES_HREF = '/vendor/wedding-pages';
/**
 * R-40.132 · YOUR WEBSITE & SEO IS A PAGE, NOT A ROOM. Sitting 2's room
 * (R-40.123) lives here, off the registry, so Storefront (sitting 1's, restored
 * byte for byte at 82612b3) keeps its tile, its pin and its count. The hub row
 * `Your website & SEO` opens this address; ROOM_HREFS.website reads this constant
 * and nothing else; b40 C31 demands it, as it demands its three siblings.
 */
export const WEBSITE_HREF = '/vendor/your-website';

// ── G2 · THE GOOGLE REVIEWS ROOM'S ADDRESS ──────────────────────────────────
// The second of R-40.1's nine to open, and it takes the same home for the same
// reason the block above states: `b40` C31 walks the import graph from every
// shell page and matches any `/vendor…` string literal against a declared set
// built from `rooms.ts`, `LEGACY_VENDOR_LINKS`, three nav seats and — since
// G1.1 — this file. `/vendor/google-reviews` is in none of the others, so a
// bare literal in the hub would be a stray and C31 would redden on a correct
// build.
//
// ⚠ C31 IS AMENDED BY LABEL IN THE SAME DELIVERY to read this constant into
// its declared set, exactly as it already reads `WEDDING_PAGES_HREF`. The cell
// TIGHTENS with the room rather than loosening: delete this constant and C31
// reddens on the missing declaration.
//
// It does NOT enter `lib/worklist/rooms.ts`: R-G11.12's not-a-room precedent
// covers every one of the nine, `ROOM_COUNT_EXPECTED` stays 19, and the tile
// grid gains nothing.
export const GOOGLE_REVIEWS_HREF = '/vendor/google-reviews';

// ── G5.1 · THE REFERRALS & PARTNERS ROOM'S ADDRESS ──────────────────────────
// R-40.1's R7, and the third of the nine to open. Same home, same reason the two
// blocks above give, and stated once more rather than by cross-reference because
// the next seat to open one of the remaining six will read whichever block sits
// nearest their edit: `b40` C31 walks the import graph from every shell page and
// matches any `/vendor…` literal against a declared set. `/vendor/referrals` is
// in `rooms.ts` nowhere, in `LEGACY_VENDOR_LINKS` nowhere, and is not a nav
// seat, so a bare literal in the hub would be a stray and C31 would redden on a
// correct build.
//
// ⚠ C31 IS AMENDED BY LABEL IN THE SAME DELIVERY to read this constant, exactly
// as it already reads the other two. The cell TIGHTENS: delete this constant and
// C31 reddens on the missing declaration rather than passing quietly.
//
// Not a registry room (R-G11.12): `ROOM_COUNT_EXPECTED` stays 19 and the tile
// grid gains nothing. Reached from the Business Solutions hub.
export const REFERRALS_HREF = '/vendor/referrals';

/**
 * The backend's own addresses. Held here rather than in `client.ts` so that the
 * two kinds of address — where the vendor goes, and where the data comes from —
 * have one home between them instead of one each plus a third nobody maintains.
 *
 * ⚠ NAMED `SOLUTIONS_API_PATH`, NOT `API_BASE`. `lib/vendor/api/_base.ts:14`
 * already exports `API_BASE` and it means something else entirely — the API
 * ORIGIN, which `getJson` prefixes to every path. A second `API_BASE` meaning
 * "the solutions path" would read identically at every import site and mean the
 * opposite thing, and the first person to import both into one file would get a
 * collision that only shows up at runtime as a doubled or missing origin. These
 * are PATHS, relative, and `getJson` supplies the origin.
 */
export const SOLUTIONS_API_PATH = '/api/v2/vendor/solutions';

// ── THE WEDDING-PAGES DOORS (Block 19 G1.1, dream-os 3a35567) ───────────────
// The studio doors are Studio Suite doors, so they do NOT hang off
// SOLUTIONS_API_PATH — a second prefix here would be a second spelling of an
// address that already has one owner.
export const WEDDINGS_API_PATH = '/api/v2/vendor/studio/weddings';

// ── THE G5.1 DOORS (Block 19 G5.1, dream-os ccdc70e) ────────────────────────
// The room's reads hang off their own prefix; the forward hangs off the LEADS
// prefix, which already exists in this codebase's api layer but had no constant
// here because nothing in `lib/solutions` addressed a lead before. One home each,
// and neither is spelled at a call site.
// ── THE G3.4 DOORS (Block 19 G3.4, dream-os 8762ffc) ───────────────────────
// ⚠ ITS OWN PREFIX, NOT `SOLUTIONS_API_PATH`, AND THE REASON IS THE BACKEND'S.
// `src/api/vendor/solutions/index.js` declares itself GET-only with POSTs
// conditional-withheld, and this feature has TWO writes — her tap and her
// switch. The seat mounted a segment router at `/api/v2/vendor/reminders`
// rather than make that file lie about itself, and the chair pre-approved the
// divergence on exactly that reasoning. This constant is that address's one
// home; nothing below spells it at a call site.
export const REMINDERS_API_PATH = '/api/v2/vendor/reminders';

export const REFERRALS_API_PATH = '/api/v2/vendor/referrals';

// ── CE-42 · 4a PACKET 3b · R9-J1 · THE THREE INTRODUCTION DOORS ────────────
// DERIVED, NOT ASSUMED: `src/index.js:137` mounts the api router at `/api/v2`,
// `src/api/router.js:59` mounts `./vendor/core` at `/vendor`, and
// `src/api/vendor/core.js:82` mounts `./introductions` at `/introductions`.
// Read at dream-os 876cef2, three files, not from the charter's prose — the
// wedding-pages seat's e-8 is what happens when an address is written from a
// kickoff instead of from the mount line.
export const INTRODUCTIONS_API_PATH = '/api/v2/vendor/introductions';
export const LEADS_API_PATH     = '/api/v2/vendor/leads';

// ── CE-42 · 4b-1 · R6 · THE "POSTS & ADS" ROOM'S DOORS ─────────────────────
// DERIVED, NOT ASSUMED: `src/api/router.js:59` mounts `./vendor/core` at
// `/vendor`, and `src/api/vendor/core.js` mounts `./posts` at `/posts` — the line
// 4b-1 adds directly beneath `/introductions`. `GET /cards` is the only door at
// 4b-1; broadcast (4b-2) and the Sunday brief (4b-3) join the same file.
export const POSTS_API_PATH = '/api/v2/vendor/posts';

// ── CE-42 · SEAT R7 · 4c-1 · THE COLLAB DOORS, FOR THE SHOOT BOARD ───────────
// DERIVED, NOT ASSUMED: dream-os `src/api/vendor/core.js` mounts `./collab` at
// `/collab` under `/vendor`. The Shoots block in Referrals & partners reads the
// SAME doors the Collab room reads, through `?kind=shoot` (ruling 3(ii)); the one
// composer reads `/requirement-types` (ruling 4(b), F-42.184's cure).
export const COLLAB_API_PATH = '/api/v2/vendor/collab';

export const API = {
  // ── RETIRED WITH THEIR READERS (R-40.23) ─────────────────────────────────
  // The six per-surface members and `index` are gone. `GET /api/v2/vendor/
  // solutions` still EXISTS in dream-os and is not deleted — F-40.28: eight
  // routes, three files, one GREEN bench reader (`b43`) and one comment
  // reference, so R-G11.18's removal condition fails. It simply has no reader
  // on this side any more.
  weddings:        () => WEDDINGS_API_PATH,
  wedding:         (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}`,
  weddingCredits:  (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/credits`,
  weddingPublish:  (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/publish`,
  weddingUploadUrl:(id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/upload-url`,
  weddingPhotos:   (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/photos`,
  // ── G1.3 · THE PRINTED UNIT AND THE PROBE ─────────────────────────────────
  // `cards` is a POST that RENDERS and answers `{ card_url, insert_url }` —
  // signed Supabase URLs, the invoice door's own shape. It is NOT a `.pdf`
  // address: every door on this router carries `requireAuth`, and a browser
  // sends no Authorization header on a navigation, so an anchor could never
  // reach one.
  weddingCards:    (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/cards`,
  // ⚠ NO `:id`. The probe is a property of the SERVER, not of a wedding, and it
  // is declared ABOVE `/:id` in dream-os because Express matches in declaration
  // order — below it, `/:id` would swallow `reel-probe` and this address would
  // 404 forever while looking entirely correct.
  weddingReelProbe: () => `${WEDDINGS_API_PATH}/reel-probe`,
  // ── G5.1 · THE OVERFLOW EXCHANGE ────────────────────────────────────────────
  // Three addresses, and the FORWARD is not under the referrals prefix — it is a
  // thing done TO A LEAD, so dream-os mounts it on the leads router where
  // `resolveVendor({ via: 'leads' })` proves the lead is hers. Spelling it
  // `/referrals/forward` here would be this file inventing an address the
  // backend does not serve, which is the 404 the wedding-pages seat's e-8
  // records. Derived from `src/api/vendor/core.js` and `src/api/vendor/leads.js`
  // at dream-os `ccdc70e`, not from the charter's prose.
  referrals:      () => `${REFERRALS_API_PATH}`,
  // ── R-40.104 · THE PICKER BECAME A SEARCH AND THE ADDRESS DID NOT CHANGE.
  // It still answers one question — who may I forward to — so a rename would
  // have cost a byte for nothing. `q` is optional: absent or under the door's
  // minimum, it answers her roster alone rather than the whole table.
  referralPeers:  (q?: string) =>
    q ? `${REFERRALS_API_PATH}/peers?q=${encodeURIComponent(q)}` : `${REFERRALS_API_PATH}/peers`,
  leadForward:    (leadId: string) => `${LEADS_API_PATH}/${encodeURIComponent(leadId)}/forward`,
  // ── G1.2 · two doors, one address home ─────────────────────────────────────
  // No reorder member: R-G12.12 was narrowed after the seat flagged that
  // `POST /:id/photos/order` would ship with no caller — the F-40.28 shape, a
  // door with no reader. F-40.83 holds the gesture; order changes by
  // remove-and-re-add until one is ruled.
  weddingPhoto:    (id: string, photoId: string) =>
    `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`,
  weddingConsent:  (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/consent`,
  weddingConsentResend: (id: string) => `${WEDDINGS_API_PATH}/${encodeURIComponent(id)}/consent/resend`,

  // ── G2 · THE ROOM'S ONE READ ─────────────────────────────────────────────
  // This one DOES hang off `SOLUTIONS_API_PATH`, where the wedding-pages doors
  // deliberately do not: those are Studio Suite doors with their own owner, and
  // this is a Business Solutions door mounted in that router beside the eight
  // that were already there. One prefix, its own owner, no second spelling.
  googleReviews:   () => `${SOLUTIONS_API_PATH}/google-reviews`,

  // ── G3.4 · the room, her tap, her switch ─────────────────────────────────
  // `reminderSend` takes the MILESTONE id, not the invoice id: the unit of the
  // send is one milestone, and the once-per-milestone UNIQUE key is keyed to it.
  // Passing an invoice here would ask the door to choose which milestone to
  // chase, which is a decision no address should be making.
  paymentReminders:    () => REMINDERS_API_PATH,
  reminderSend:        (milestoneId: string) =>
    `${REMINDERS_API_PATH}/${encodeURIComponent(milestoneId)}/send`,
  reminderSettings:    () => `${REMINDERS_API_PATH}/settings`,
  // ── R9-J1 · THE THREE DOORS ─────────────────────────────────────────────
  // GET the list, POST to stage, POST /:id/send to approve. The SEND takes the
  // staged row's id and the door checks the name against ITS OWN ROW — E3 is on
  // the server, so this address carries no name and the screen re-implements no
  // guard. `encodeURIComponent` on the id for the same reason every sibling
  // above does it: it is a uuid today and an address should not care.
  introductions:       () => INTRODUCTIONS_API_PATH,
  introductionSend:    (id: string) =>
    `${INTRODUCTIONS_API_PATH}/${encodeURIComponent(id)}/send`,
  // ── R6 · 4b-1 · THE CARDS ─────────────────────────────────────────────────
  // One GET: her last gallery's three cards and the caption. The door decides;
  // the screen draws (src/api/vendor/posts.js).
  postCards:           () => `${POSTS_API_PATH}/cards`,
  // ── CE-42 4c-1 · the collab doors (see COLLAB_API_PATH). `kind` is the room:
  // absent = the Collab room, 'shoot' = the shoot board. Never both.
  collabRequirementTypes: () => `${COLLAB_API_PATH}/requirement-types`,
  collabFeed:          (kind?: 'shoot') => kind ? `${COLLAB_API_PATH}/feed?kind=${kind}` : `${COLLAB_API_PATH}/feed`,
  collabMyPosts:       (kind?: 'shoot') => kind ? `${COLLAB_API_PATH}/my-posts?kind=${kind}` : `${COLLAB_API_PATH}/my-posts`,
  collabCreate:        () => COLLAB_API_PATH,
  collabRespond:       (postId: string) => `${COLLAB_API_PATH}/${encodeURIComponent(postId)}/respond`,
  // ── R6 · 4b-2 · THE BROADCAST ────────────────────────────────────────────
  // GET the preview (count, list, fee, bodies, gates); POST { kind } to send.
  postBroadcast:       () => `${POSTS_API_PATH}/broadcast`,
  // ── R6 · 4b-3b · THE SUNDAY BRIEF ────────────────────────────────────────
  // GET the stored brief as one of the shell's codes; POST refresh = "Check
  // again" (generate now, throttled server-side). The insights authorize is the
  // ig door's own with ?scope=insights (ruling 13(b)); it returns to /vendor/posts.
  postSunday:          () => `${POSTS_API_PATH}/sunday`,
  postSundayRefresh:   () => `${POSTS_API_PATH}/sunday/refresh`,
  igAuthorizeInsights: () => '/api/v2/vendor/ig/authorize?scope=insights',
  // ── G6 · YOUR OWN NUMBER · CE-45 G6-1 (FK1, chair-ruled 2026-09-24) ──────
  // BOTH DOORS DO NOT EXIST YET: dream-os builds them in cut 2a beside their
  // siblings in src/api/vendor/solutions/index.js. Until then the GET answers
  // 404 and the room renders its shell exactly as before (ruling F-a (a)): the
  // flow is dark by construction, with no flag of its own on this side.
  // GET the room (open, launch, number); POST the Embedded Signup result the
  // instant Meta's code arrives, because the code lives thirty seconds (c-45.27).
  ownNumber:           () => `${SOLUTIONS_API_PATH}/number`,
  ownNumberConnect:    () => `${SOLUTIONS_API_PATH}/number/connect`,
} as const;

// ── G3.2 · R-G32.16 · THE CONTRACTS ROOM'S ADDRESS — RETIRED, F-40.170 ─────
// ⚠ `CONTRACTS_HREF` STOOD HERE AND IT WAS A SECOND HOME FOR AN ADDRESS THE
// REGISTRY ALREADY OWNS. Contracts IS a registry room — `lib/worklist/rooms.ts`
// carries `{ id: 'contracts', href: '/vendor/contracts' }` and has since Block
// 07 — so `roomHref('contracts')` was always the answer and a constant here was
// the sole-writer law broken in the direction this very file exists to prevent.
//
// ⚠ THE REASON THE CONSTANT GAVE FOR ITSELF WAS THE PART THAT WAS WRONG. It
// claimed it was needed to get `/vendor/contracts` into `b40` C31's declared
// set. C31 builds that set from `rooms.ts`'s own `href:` values FIRST, so the
// address was already declared before this line was written; the constant added
// nothing to the cell and a home to the estate. Derived by reading C31, not by
// assuming — the four constants that remain (`WEDDING_PAGES_HREF`,
// `GOOGLE_REVIEWS_HREF`, `REFERRALS_HREF`, `PAYMENT_REMINDERS_HREF`) are each
// for a room `rooms.ts` has NO entry for, which is the real test and the one
// `website` passes from the other direction (C105, R-G31.2).
//
// The hub row now reads `roomHref('contracts')`, exactly as `website` reads
// `roomHref('storefront')`, and this file declares one address fewer.

// ── G3.4 · PAYMENT REMINDERS (R-40.1's R5) ─────────────────────────────────
// The fifth of the nine to open. Same one-line rule: `support/page.tsx`'s
// ROOM_HREFS gains `reminders: PAYMENT_REMINDERS_HREF` and the row's chip flips
// from Coming to Open. `ROOM_ROWS`' label is R-40.1's byte and is not touched.
export const PAYMENT_REMINDERS_HREF = '/vendor/payment-reminders';

// ── CE-42 · 4a PACKET 3b · INTRODUCTIONS — THE SIXTH CONSTANT ──────────────
// R-42.8's screen, and the TENTH row of the hub. Introductions is NOT a
// registry room — `lib/worklist/rooms.ts` has no entry for it and the tile grid
// gains nothing, because the room is reached from Business Solutions and not
// from a tile. So its address lives here, on the not-a-room precedent this file
// was written for and the five constants above use, and `b40` C31 READS THIS
// DECLARATION rather than carrying a literal of its own. Delete this line and
// that cell reddens on the missing declaration rather than passing quietly.
//
// ⚠ THE API PATH TAKES NO ENTRY IN C31'S SET. `INTRODUCTIONS_API_PATH` is
// `/api/v2/vendor/introductions`, and C31 matches strings that BEGIN `/vendor`
// — which that does not. Adding it there would loosen the cell for a literal it
// never sees, exactly as the G5.1 block in that cell says of the forward door.
export const INTRODUCTIONS_HREF = '/vendor/introductions';

// ── CE-42 · 4b-1 · R6 · POSTS & ADS — THE SEVENTH CONSTANT ─────────────────
// `ROOM_ROWS`' `posts` row (R-40.1's R6, label "Posts & ads") has stood since the
// nine with no destination and a Coming chip. Ruling 1(a): that row opens, one
// screen, three sections — no new row, so `b42` C3's count pair is untouched.
// Not a registry room (no tile), so the address lives HERE on the not-a-room
// precedent, and `b40` C31 READS this declaration rather than retyping it.
export const POSTS_HREF = '/vendor/posts';

// ── CE-42 · SHELL · R-42.12 AMENDED · THE EIGHTH AND NINTH CONSTANTS ───────
// `Open dates & rates` and `Your own number` were the two hub rows with no
// destination once R6 opened `posts`. R-42.12 as amended: every Business
// Solutions row NAVIGATES, the screen says what the capability is, and the act
// that cannot run yet says `Launching soon.` on tap. Both are shell screens,
// not registry rooms (no tile), so the addresses live HERE on the not-a-room
// precedent the seven above use, and `b40` C31 READS these declarations.
// When R8 and R9 land their real rooms they take these same addresses: the
// row's `PREVIEW_KEYS` entry leaves and nothing here moves.
export const DATES_HREF  = '/vendor/dates';
export const NUMBER_HREF = '/vendor/number';

// ── CE-42 · 4c-3a · THE TENTH CONSTANT — the influencer exchange SHELL (R-42.14) ──
// Not a registry room and not a hub row: it opens from ONE row under Shoots inside
// Referrals & partners (ruling F1(b)). Same not-a-room precedent as the nine above,
// so `b40` C31 reads this declaration. 4c-3b changes nothing here.
export const EXCHANGE_HREF = '/vendor/exchange';

// ── CE-45 FE-1 · MOVED HERE FROM app/vendor/(shell)/support/page.tsx, BYTE FOR BYTE ─────────
// ROOM_HREFS and PREVIEW_KEYS were module-private to the hub page. The founder's layout (BS-1
// close; R-45.19) puts two of the hub's rows on the Money shelf too and lets a hub row be pinned
// on Home, so three surfaces must resolve a row and know whether it is Coming, by ONE table. A
// MOVE, stated to the chair and accepted (CE-45 read-first ruling): the entries, their order and
// every ruling comment below travel unchanged; only `export` is added. The hub page imports them.
// (its two imports sit at the head of this file)

/**
 * EVERY ROW'S DESTINATION, KEYED BY `ROOM_ROWS`' OWN KEYS — ALL TEN.
 * Every address is read from `lib/solutions/routes.ts`; not one is a literal
 * here, because `b40` C31 matches any `/vendor…` literal reachable from a shell
 * page against a declared set and this file is reachable from all of them.
 *
 * ⚠ A TOTAL `Record<RoomKey, string>`, NOT `Partial<Record<string, string>>`.
 * R-42.12 AMENDED, S5(b): every row navigates, so the type now says so. A row
 * ruled into `ROOM_ROWS` without an entry here fails `tsc` — the destination-
 * less row is caught at the build, not on a vendor's thumb — and a key that is
 * not a row fails the same way. The `Partial` this replaced let both through
 * and rendered the first as a `Coming` row that answered nothing.
 */
export const ROOM_HREFS: Record<RoomKey, string> = {
  wedding_pages: WEDDING_PAGES_HREF,
  google:        GOOGLE_REVIEWS_HREF,
  // G5.1 · R-G51.10 — the third of the nine opens. `RoomRow` renders a
  // `StateChip` on EVERY row (`href ? 'open' : 'coming'`), so this one entry is
  // the whole change: the row gains a destination and its chip flips to `Open`.
  // The key is `ROOM_ROWS`' own, not a new string.
  referrals:     REFERRALS_HREF,
  // ── R-42.16 · THE ELEVENTH ROW, AND IT COSTS NO CONSTANT. Derived at the cut,
  // not chosen: `collab` IS a registry room — `lib/worklist/rooms.ts:181`,
  // `{ id: 'collab', band: 'business', href: '/vendor/collab' }` — so its address
  // comes from `roomHref` for exactly the reason `contracts` above does.
  // `lib/solutions/routes.ts` is the home for rooms the registry does NOT own,
  // and a `COLLAB_HREF` for one it does would be a second home for one address.
  //
  // The row is LIVE, so it is absent from `PREVIEW_KEYS` below and its chip reads
  // `Open` — which on this list has meant "the thing works" since Arm C.
  collabs:       roomHref('collab'),
  // ── G3.2 · R-G32.16, AMENDED BY F-40.170 — THE FOURTH OF THE NINE, AND IT
  // COSTS NO CONSTANT EITHER. Contracts is a REGISTRY room (`rooms.ts:168`), so
  // its address comes from `roomHref` for exactly the reason `website` below
  // does: `lib/solutions/routes.ts` is the home for rooms the registry does NOT
  // own, and a constant for one it does is a second home. This row shipped with
  // `CONTRACTS_HREF` and the constant is retired in the same edit that changes
  // this line, so the two never disagree.
  contracts:     roomHref('contracts'),
  // ── G3.1 · R-G31.2 — THE FIFTH OF THE NINE OPENS, AND IT COSTS NO CONSTANT
  // `website` is R-40.1's R3, 「Your website & SEO」. Its destination is the
  // Storefront room, which is a REGISTRY room — so the address comes from
  // `roomHref('storefront')` and NOT from a `STOREFRONT_HREF` in
  // `lib/solutions/routes.ts`.
  //
  // ⚠ THAT ASYMMETRY IS DERIVED, NOT STYLISTIC. `b40` C31 builds its declared
  // set from `rooms.ts`'s own `href:` values plus LEGACY_VENDOR_LINKS plus three
  // nav seats; `/vendor/storefront` is already in it (`rooms.ts:123`). The four
  // rooms above each needed a constant because they are NOT registry rooms
  // (R-G11.12) and the constant is what gets them into that set at all. A fifth
  // constant here would be a second home for an address the registry already
  // owns — `routes.ts`'s own disease, arriving from the other direction.
  website:       WEBSITE_HREF,   // R-40.132: sitting 2's room, off the registry
  // ── G3.4 · R-G34 — THE SIXTH OF THE NINE OPENS ───────────────────────────
  // `reminders` is `ROOM_ROWS`' own key for 「Payment reminders」 (R-40.1's R5).
  // One line, as the map has promised five times: the row gains a destination
  // and `RoomRow`'s chip flips from `Coming` to `Open`. No ternary, no second
  // string, and `ROOM_ROWS`' label is untouched — it is R-40.1's byte.
  //
  // It takes a CONSTANT rather than `roomHref()` because payment reminders is
  // not a registry room: `rooms.ts` has no entry for it, so `b40` C31's declared
  // set would not contain `/vendor/payment-reminders` and the literal would be
  // unreachable-by-declaration. Same asymmetry the four above document, and the
  // same reason `website` goes the other way.
  reminders:     PAYMENT_REMINDERS_HREF,
  // ── CE-42 4a/3b · R-42.8 — THE SEVENTH ROW WITH A DESTINATION, AND IT IS
  // THE TENTH ROW OF THE LIST. One line, no ternary, no second string, and
  // `RoomRow`'s chip flips from `Coming` to `Open` off the presence of an href
  // alone. A CONSTANT rather than `roomHref()`: introductions is not a registry
  // room, so `b40` C31's declared set would not contain `/vendor/introductions`
  // and the address would be unreachable-by-declaration — the same asymmetry
  // `website` documents from the other direction.
  introductions: INTRODUCTIONS_HREF,
  // ── CE-42 4b-1 · R6 · ruling 1(a) — `posts` ("Posts & ads", R-40.1's own row)
  // gains its destination; the chip flips Coming → Open off the href alone. A
  // CONSTANT for the same not-a-registry-room reason as introductions above.
  posts:         POSTS_HREF,
  // ── CE-42 · SHELL · R-42.12 AMENDED — THE LAST TWO ROWS GAIN SCREENS ──────
  // Shell screens: what the capability is, and the one act that says
  // `Launching soon.` on tap. Constants for the not-a-registry-room reason the
  // five above give. Their chips stay `Coming` through `PREVIEW_KEYS` below.
  dates:         DATES_HREF,
  number:        NUMBER_HREF,
};

/**
 * THE ROWS WHOSE SCREEN CANNOT ACT YET — R-42.12 AMENDED, S4(c).
 * Each opens a screen (`ROOM_HREFS` above) whose one control says `Launching
 * soon.`; the chip on its hub row reads `Coming` (register §1a) rather than
 * `Open`, because `Open` on this list has meant "the thing works" since Arm C.
 * An entry LEAVES this set in the same edit that lands the real room — R8 for
 * `dates`, R9 for `number` — and the chip flips with it. No ninth chip.
 */
export const PREVIEW_KEYS: ReadonlySet<RoomKey> = new Set<RoomKey>(['dates', 'number']);

/**
 * CE-45 FE-1 · THE ONE RESOLVER FROM A SHELF ITEM TO ITS ROUTE (q2: the pin key space is the
 * route). A room resolves through its registry entry, a row through ROOM_HREFS above.
 */
export function itemHref(i: ShelfItem): string {
  return 'room' in i ? roomHref(i.room) : ROOM_HREFS[i.row];
}
/** A row whose screen cannot act yet stays Coming wherever it is shown (F-19.20). */
export function itemComing(i: ShelfItem): boolean {
  return 'row' in i && PREVIEW_KEYS.has(i.row);
}
/** True when a room item names a room that is in the registry (b122 reads this). */
export function itemKnown(i: ShelfItem): boolean {
  return 'room' in i ? ROOMS.some((r) => r.id === i.room) : i.row in ROOM_HREFS;
}
