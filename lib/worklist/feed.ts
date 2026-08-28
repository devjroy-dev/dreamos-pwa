// lib/worklist/feed.ts — DID THE FEED ANSWER? ONE HOME FOR THE ONE FACT.
//
// ── WHY THIS FILE EXISTS  [R-38.17 as amended at c-38.14] ───────────────────
//
// Today's masthead has one status slot and two vetoed bytes for it, and choosing between
// them is not a copy decision — it is a question about whether an instrument answered:
//
//   · the feed has NOT answered  ->  `todayNotLive`, and NO NUMERAL
//   · the feed answered with zero ->  `todayNothingYet`, with the numeral it returned
//
// The chair amended his own byte to get here (c-38.14). R-38.17 first put
// 「Nothing needs you yet.」 on the surface unconditionally, and this seat filed F-38.31:
// that sentence asserts an absence NOTHING HAS CHECKED. The same objection convicts the
// t0 numeral standing beside it — a `0` no instrument produced is the identical claim in
// digits, and curing the sentence while keeping the digit would have been a cosmetic fix
// to an honesty defect.
//
// ── WHY IT IS A FUNCTION AND NOT A CONSTANT ─────────────────────────────────
//
// A `const FEED_RESPONDED = false` would have been shorter and would have made the
// component's conditional dead in one direction — a branch no cell could reach and no
// reader would trust. This is a READER with a null answer: it has the shape it will have
// when Phase 4 wires it, so the surface's two arms are both live code today, the bench can
// assert both, and the Phase 4 edit is confined to this function's body.
//
// ⚠ IT DOES NOT FETCH, AND THAT IS NOT A PLACEHOLDER — IT IS THE HONEST ANSWER TODAY.
// There is no feed endpoint. Returning `{ responded: false }` is not a stub standing in
// for a real reading; it is the true statement that no reading exists. The moment one
// does, this function makes the request and the surface changes with nothing else to edit.
//
// ── THE PHASE 4 STEP, STATED SO NOBODY HAS TO INFER IT ──────────────────────
// Replace the body with the read, keep the shape:
//   · `responded` is true ONLY on a 200 that carried a count. A network error, a 401 or a
//     malformed body all leave it false, because each of those is 「no reading」 and the
//     not-reading line is the honest thing to print for all of them. Fail closed, the same
//     direction app/w/layout.tsx's guard fails.
//   · `openItems` is whatever the server said, including a real 0. A real 0 is the state
//     `todayNothingYet` exists for.
'use strict';

export interface TodayFeed {
  /** True only when a reading actually came back. Never true by default, ever. */
  responded: boolean;
  /** The server's count. `null` whenever `responded` is false — never coerced to 0. */
  openItems: number | null;
}

/**
 * THE ONE SITE THAT ANSWERS 「has Today read anything?」.
 *
 * Synchronous today because there is nothing to wait for. When Phase 4 lands it becomes a
 * hook and the two call sites in app/w/today/page.tsx follow it; the surface's shape,
 * its two status arms and its numeral gate do not change.
 */
export function todayFeed(): TodayFeed {
  return { responded: false, openItems: null };
}
