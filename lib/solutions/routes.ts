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
// live under `/w/support`. The doctrine would have a hole precisely where the
// newest code is.
//
// `bs_audit.mjs` carries C31's shape in this seat's own gate: **no
// `/w/support/` literal may appear anywhere outside this file.**
//
// ── A MISS RETURNS THE INDEX RATHER THAN THROWING ──────────────────────────
// Same reasoning `roomHref` states at rooms.ts:254 and for the same reason:
// this runs inside render on a vendor's surface, and a thrown error there costs
// her the page to save a typo the bench catches anyway. The audit asserts every
// slug passed here resolves, so the fallback is a net that is never reached
// rather than a silent wrong answer.

import type { SolutionsRow } from './types';

/** The six, in spec §0's delivery order. Mirrors `ROWS` in copy.ts; the audit pins both. */
export const SURFACE_SLUGS = [
  'google',
  'website',
  'seo',
  'marketing',
  'proof',
  'benchmarks',
] as const;

export type SurfaceSlug = SolutionsRow['slug'];

/** The room index — where the six rows live, and the fallback for an unknown slug. */
export const SOLUTIONS_INDEX_HREF = '/w/support';

export function surfaceHref(slug: string): string {
  return (SURFACE_SLUGS as readonly string[]).includes(slug)
    ? `${SOLUTIONS_INDEX_HREF}/${slug}`
    : SOLUTIONS_INDEX_HREF;
}

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

export const API = {
  index:        () => SOLUTIONS_API_PATH,
  google:       () => `${SOLUTIONS_API_PATH}/google`,
  domain:       () => `${SOLUTIONS_API_PATH}/domain`,
  domainSearch: (q: string) => `${SOLUTIONS_API_PATH}/domain/search?q=${encodeURIComponent(q)}`,
  seo:          () => `${SOLUTIONS_API_PATH}/seo`,
  marketing:    () => `${SOLUTIONS_API_PATH}/marketing`,
  proof:        () => `${SOLUTIONS_API_PATH}/proof`,
  benchmarks:   () => `${SOLUTIONS_API_PATH}/benchmarks`,
} as const;
