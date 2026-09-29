// lib/worklist/googleReviews.ts
// BLOCK 19 · G2 — EVERY GOOGLE-REVIEWS STRING, ONE HOME.
//
// ═══════════════════════════════════════════════════════════════════════════
// NOTHING BELOW IS AUTHORED. EVERY BYTE IS TRANSCRIBED.
// ═══════════════════════════════════════════════════════════════════════════
// Source: `docs/mocks/google-reviews-mock.html` @ `af295a7`, frames `G1-room`,
// `G1-empty` and `G1-gbp`, and `docs/mocks/G2_VETO_SHEET.md` §A–§C — **all
// seventeen strings ratified as proposed by the founder, R-40.42, 2026-09-05.**
// A string not in that sheet is a BOUNCE, not a judgement call.
//
// ── WHY THIS FILE AND NOT `lib/solutions/copy.ts` ─────────────────────────
// A DECLARED DIVERGENCE, because that file's own header claims to be the one
// home for every Business Solutions string and this is the second room to walk
// past it. The sibling decides it: G1.1 put the wedding-pages room's strings in
// `lib/worklist/weddingPages.ts` for the same reason they go here — a ROOM's
// copy is transcribed from a ratified frame and carries a veto date, while
// `solutions/copy.ts` holds the HUB's chrome, the chips and the six sentences
// spec §9 requires to exist. Two rooms splitting that convention between them
// would be worse than either choice.
//
// WHAT STAYS IN `solutions/copy.ts`, AND IS READ FROM THERE UNCHANGED:
//   ROOM_ROWS row 2 `Google reviews`   — R-40.1, byte-frozen
//   CHIPS.open `Open`                  — founder-vetoed 2026-09-05 on his walk
//   COPY.googleEmpty                   — the hub's own row copy, not this room's
//
// ── R-40.19's TYPOGRAPHIC APOSTROPHE IS NOT USED HERE, AND THAT IS DERIVED ──
// Not one of the seventeen contains an apostrophe. The rule stands estate-wide;
// this file simply has no site for it. Said out loud so a later reader does not
// read its absence as an omission.

/**
 * The room. Numbers in the comments are the veto sheet's own row numbers, so a
 * byte can be traced to the line the founder ratified without opening the mock.
 */
export const GR = {
  /** The shell title. `ROOM_ROWS` row 2's label, R-40.1, byte-frozen. */
  roomTitle: 'Google reviews',

  // ── §A · THE BANDS ───────────────────────────────────────────────────────
  /** #1 · what went out. The room's first band because it is the only one with rows on day one. */
  sectionAsked: 'Asked',
  /** #2 · what came back. Reads 0 until the listing is connected; #6 is why that is not broken. */
  sectionReviews: 'Reviews',
  /** #3 · `Your` because it is hers and it is the one thing here she cannot edit. */
  sectionSeal: 'Your seal',
  /**
   * #4 · `listing`, never `page` or `profile`: it is Google's own product name in
   * the vendor's mouth, and `page` already means her `/v/` page in this product.
   */
  sectionListing: 'Google listing',

  /**
   * #5 · the ask row's state, right column. The DATE IS NOT FORMATTED HERE —
   * `askedState` is the word and the day is appended by the room through the
   * estate's one date home. A template string with a date in it would be a
   * second formatter.
   */
  askedState: 'Asked',

  /** #6 · under the Reviews band while it reads 0. It does not apologise. */
  reviewsWaiting: 'Reviews appear here once your Google listing is connected.',

  /** #7 · the seal card's state, accent ink. It says WHERE the seal went. */
  sealState: 'On your page',
  /**
   * #8 · under the seal. Two facts in the order a vendor asks them: where the
   * numbers came from, and whether she can change them. The second sentence is
   * the whole trust position and is stated plainly rather than implied.
   */
  sealNote: 'Counted every night from your own weddings. It is not editable.',
  /** The seal's own mark, on her storefront and here. */
  sealMark: 'TDW-verified',

  // ── §B · THE EMPTY STATE ─────────────────────────────────────────────────
  /** #9 · says the state, not `nothing here`. */
  emptyHead: 'No reviews asked yet',
  /**
   * #10 · names the trigger (publishing, which is hers) and the guarantee (once
   * per couple, ever) — the second being the thing a vendor is actually anxious
   * about: she does not want us pestering her clients.
   */
  emptyBody: 'When you publish a wedding page, we ask that couple for a Google review. Once, and never again.',
  /**
   * #11 · where the seal card would be. A SENTENCE, NEVER A GREYED BADGE — a
   * dimmed seal would be a control lying about being available.
   */
  sealAbsent: 'Your seal appears after three delivered weddings.',

  // ── §C · THE LISTING BAND, DRAWN ABSENT ──────────────────────────────────
  /**
   * #12 · the date is Google's, not ours: a Business Profile must be verified and
   * active for 60+ days before the API admits it. **NEVER A DISABLED BUTTON** —
   * there is no control here, greyed or otherwise, because there is nothing she
   * can do before the date and a dimmed `Connect` would tell her there is.
   *
   * ⚠ THE DATE IS INTERPOLATED FROM THE DOOR'S `gbpAvailableFrom`, NOT TYPED.
   * `{date}` is replaced by the room through the estate's one date home, so this
   * sentence cannot disagree with the field the backend sends.
   */
  listingFrom: 'We can claim and sync your Google listing from {date}.',
  /** #13 · names WHO is waiting on WHAT, and that the clock is hers and running. */
  listingWhy: 'Google requires a profile to be 60 days old before it will let us in. Yours is counted from the day it was verified.',
  /** #14a · the sub-band. */
  listingThenHead: 'What happens then',
  /**
   * #14b · what she gets on the date. NO PROMISE ABOUT TRAFFIC, RANKING OR
   * BEING FOUND — master §7 refuses platform-SEO claims, and this is the byte
   * where such a claim would slip in.
   */
  listingThenBody: 'Your name, hours, service areas and photos stay in step with your rooms, and every couple we ask lands on your listing.',

  /**
   * When the room's own read fails. Same shape as `COPY.indexUnavailable`: says
   * what is missing, not `something went wrong`, which tells her nothing she can
   * act on.
   */
  unavailable: 'Your review requests could not be loaded just now.',
} as const;

/**
 * THE SEAL'S FACTS LINE, BUILT IN ONE PLACE.
 *
 * `4 weddings · delivers in 34 days`, or `3 weddings` alone when `deliveryDays`
 * is null — a studio whose delivered pages are all back catalogue has no wedding
 * day to measure from, and NULL MEANS NOT MEASURABLE, NEVER ZERO. Zero would
 * read as same-day delivery, which is the most flattering possible lie.
 *
 * ⚠ NO SINGULARS, AND THAT IS RULED (R-G2.11). The seal never shows under three,
 * so `1 wedding` is unreachable; `1 day` is reachable in principle and the
 * founder ruled the plural stands rather than growing a pluraliser for one word.
 *
 * NO Rs AND NO RUPEE GLYPH EVER REACHES THIS STRING. It carries counts and days.
 */
export function sealFacts(weddings: number, deliveryDays: number | null): string {
  const n = `${weddings} weddings`;
  return deliveryDays == null ? n : `${n} \u00b7 delivers in ${deliveryDays} days`;
}
