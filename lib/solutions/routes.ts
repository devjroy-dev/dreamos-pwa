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
} as const;
