// lib/worklist/openDates.ts — CE-42 · SHELL · R-42.12 AMENDED.
// EVERY VENDOR-FACING BYTE ON `/vendor/dates`, ONE HOME.
//
// Founder-vetoed 2026-09-10 on the chair's sheet, `docs/mocks/SHELL_VETO_SHEET.md`
// rows D1-D6, frames `docs/mocks/shell-screens-mock.html` D1/D2. `b73` pins each
// string here against that sheet BY VALUE, both ways: a byte not on the sheet does
// not ship, and a sheet row with no byte here reds.
//
// ⚠ WHAT IS NOT HERE, AND WHY. The title is `ROOM_ROWS`' own label (R-40.1),
// read through `roomLabel('dates')`. The tap byte is `COPY.launchingSoon` in
// `lib/solutions/copy.ts`, shared with `/vendor/number`. The door's label is the
// registry's `Storefront` (`lib/worklist/rooms.ts`), read from `ROOMS`. Three
// carried bytes, three homes, none retyped.
//
// ⚠ THIS FILE IS THE REAL ROOM'S HOME TOO. R8 (roadmap row F) grows its copy
// here when `/vendor/dates` becomes the room; the shell's bytes are replaced or
// kept by that sitting's veto, never forked into a second file.
//
// No persona name (b40 C32 walks the shell tree), no money (R-41.114 binds the
// rate nudge when it ships; nothing here prices), U+2019 wherever an apostrophe
// is needed (R-40.57) — none is, today.

export const DATES = {
  /** D1 · the lede. "In demand", not "couples ask": a check is one look at one
   *  date, not one person (`storefrontPulseFine`), and the lede must not claim
   *  otherwise. */
  lede:    'See which of your dates are in demand, and price them to match.',
  /** D2-D4 · what she will be able to do. D2 is live today in Storefront. */
  can: [
    'See how often each date was checked on your page.',
    'Offer your open dates to couples who already asked.',
    'Get a suggested rate when a date is in demand.',
  ],
  /** D5 · the line above the Storefront door (S2(a)). */
  already: 'Date checks already work on your page.',
  /** D6 · the act. On tap: `COPY.launchingSoon`. */
  cta:     'Suggest rates',
} as const;

// CE-47 L4 (FE-7): the reworked room's own words (veto rows 1 to 4), in their own object so DATES keeps its four vetted
// keys (b73's sheet) and classic reads it unchanged.
export const DATES_ROWS = {
  rowChecks: 'Date checks on your page',            // veto 1
  rowChecksFacts: 'How often each date was checked, in Storefront',
  rowOffer: 'Offer your open dates',                 // veto 2 (the chair's 4b sentence, split)
  rowOfferFacts: 'To people who already enquired',
  rowRates: 'Suggested rates',                       // veto 3
  rowRatesFacts: 'A rate for a date that is in demand',
  comingSoon: 'Coming soon',                         // R-46.14
} as const;
