// lib/img.ts
// TDW_07 P3 · Fork 5(b) as RATIFIED — ONE home for Cloudinary delivery discipline.
// Re-exported at lib/frost-api/img.ts and lib/vendor/img.ts so both the spec's
// named paths resolve; the variant table exists exactly once. A variant table
// copied twice is a drift generator, and the estate already learned this at the
// photo floor (TDW_07 P2 folded three copies of the number into one).
//
// RN-PORTABLE BY CONSTRUCTION: pure string functions, no DOM, no next/image, no
// browser API. The native port takes this file unchanged (protocol §8's
// native-implications clause).
//
// ── THE VARIANTS (spec P3 item 2, verbatim) ───────────────────────────────────
//   card  — w_800,  q_auto, f_auto   the feed card and the manager grid
//   thumb — w_200,  q_auto, f_auto   dense grids and pickers
//   full  — w_1600, q_auto, f_auto   the detail lookbook
// q_auto/f_auto ride every variant: the spec names them on `card` and there is no
// reading under which a thumb or a full page wants a worse codec than a card.
//
// ── THE PASS-THROUGH SAFETY (CE-RULED IN AS BENCH CELLS) ──────────────────────
// Two classes of URL must come back BYTE-UNCHANGED or this helper corrupts live
// surfaces:
//
//   (1) NON-CLOUDINARY HOSTS. Imported-and-mirrored photos are estate-hosted by
//       construction, but demo cards, admin-pasted URLs and any future source are
//       not guaranteed to be.
//
//   (2) URLs THAT ARE NOT A CANONICAL `/upload/v<digits>/<public_id>` SHAPE.
//       This is the important one and it is deliberately conservative. The couple
//       auth surfaces hard-code four splash URLs of the shape
//         .../image/upload/IMG_2544.PNG_cyeqlj
//       — no version segment, a bare public_id carrying dots and underscores.
//       Injecting a transformation ahead of that segment produces a 404 and four
//       login screens lose their background. So the rule is POSITIVE, not
//       negative: transform ONLY when the segment immediately after
//       `/image/upload/` is a version (`v` followed by digits). Anything else —
//       an existing transformation chain, a bare public_id, a delivery type this
//       file has never seen — is returned untouched.
//
//       Cloudinary's `secure_url` (the field both upload paths persist:
//       app/vendor/portfolio/page.tsx and lib/admin-api/_base.ts's adminUploadFile
//       both read `data.secure_url`) always carries the version segment, so every
//       photo this block writes IS transformable. The conservative rule costs
//       nothing on the rows that matter and protects the rows that would break.

export type ImgVariant = 'card' | 'thumb' | 'full';

/** The variant table. The one place a width is written down. */
const VARIANTS: Record<ImgVariant, string> = {
  card:  'w_800,q_auto,f_auto',
  thumb: 'w_200,q_auto,f_auto',
  full:  'w_1600,q_auto,f_auto',
};

/**
 * The LQIP chain — a 24px blurred placeholder that loads in a few hundred bytes
 * and fades to the real image. `e_blur:1000` over a 24px render is what makes it
 * a wash of colour rather than a recognisable thumbnail; f_auto keeps it cheap.
 * The spec's "24px blurred placeholder inline (Cloudinary e_blur chain)".
 */
const LQIP = 'w_24,e_blur:1000,q_auto,f_auto';

const CLOUDINARY_HOST = 'res.cloudinary.com';
const UPLOAD_MARKER = '/image/upload/';
const VERSION_SEGMENT = /^v\d+$/;

/**
 * Is this a URL we may safely rewrite?
 * Exported for the bench: the safety rule is testable on its own, not only
 * through its consequences.
 */
export function isTransformable(url: string | null | undefined): boolean {
  if (typeof url !== 'string' || url === '') return false;
  if (!url.includes(CLOUDINARY_HOST)) return false;
  const marker = url.indexOf(UPLOAD_MARKER);
  if (marker === -1) return false;
  const rest = url.slice(marker + UPLOAD_MARKER.length);
  const firstSegment = rest.split('/')[0];
  return VERSION_SEGMENT.test(firstSegment);
}

/** Insert a transformation chain immediately after /image/upload/. */
function withChain(url: string, chain: string): string {
  if (!isTransformable(url)) return url;
  const marker = url.indexOf(UPLOAD_MARKER);
  const head = url.slice(0, marker + UPLOAD_MARKER.length);
  const tail = url.slice(marker + UPLOAD_MARKER.length);
  return `${head}${chain}/${tail}`;
}

/**
 * The delivery URL for a variant. Returns the input unchanged for anything the
 * safety rule does not recognise — never null, never a broken URL, never a throw.
 */
export function imgUrl(url: string | null | undefined, variant: ImgVariant = 'card'): string {
  if (typeof url !== 'string' || url === '') return '';
  return withChain(url, VARIANTS[variant] ?? VARIANTS.card);
}

/** The blurred placeholder for the same source. Same safety rule. */
export function lqipUrl(url: string | null | undefined): string {
  if (typeof url !== 'string' || url === '') return '';
  return withChain(url, LQIP);
}

/**
 * Both at once — the shape a fading <img> wants. Callers render `placeholder`
 * immediately and swap to `src` on load.
 */
export function imgPair(
  url: string | null | undefined,
  variant: ImgVariant = 'card',
): { src: string; placeholder: string } {
  return { src: imgUrl(url, variant), placeholder: lqipUrl(url) };
}

/** Exported for the bench so the table itself is assertable, not just its output. */
export const IMG_VARIANTS = VARIANTS;
export const IMG_LQIP = LQIP;
