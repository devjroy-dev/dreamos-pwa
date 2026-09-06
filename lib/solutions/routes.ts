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
export const LEADS_API_PATH     = '/api/v2/vendor/leads';

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
  referralPeers:  () => `${REFERRALS_API_PATH}/peers`,
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
} as const;

// ── G3.2 · R-G32.16 · THE CONTRACTS ROOM'S ADDRESS ─────────────────────────
// ⚠ THE ROOM ALREADY EXISTED AT THIS ADDRESS. `app/vendor/(shell)/contracts/`
// has shipped since Block 07 as an upload plane; G3.2 does not move it and does
// not build a second one. What changes is that the HUB now points at it — the
// fourth of the nine to open, by the one-line rule `ROOM_HREFS` states.
//
// It gets a constant here rather than a literal at the map for the reason this
// whole file exists: `b40` C31 walks the import graph from every shell page and
// matches any `/vendor…` literal against a declared set, and `support/page.tsx`
// is reachable from all of them.
export const CONTRACTS_HREF = '/vendor/contracts';

// ── G3.4 · PAYMENT REMINDERS (R-40.1's R5) ─────────────────────────────────
// The fifth of the nine to open. Same one-line rule: `support/page.tsx`'s
// ROOM_HREFS gains `reminders: PAYMENT_REMINDERS_HREF` and the row's chip flips
// from Coming to Open. `ROOM_ROWS`' label is R-40.1's byte and is not touched.
export const PAYMENT_REMINDERS_HREF = '/vendor/payment-reminders';
