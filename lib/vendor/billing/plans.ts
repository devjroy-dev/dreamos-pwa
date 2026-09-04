// lib/vendor/billing/plans.ts — THE VETOED MONEY BYTES, ONE HOME, ZERO COMPONENTS.
// ─────────────────────────────────────────────────────────────────────────────
// M-FINISH S1 · PURE MOVE from `components/vendor/SubscriptionCard.tsx`. Every byte below
// is carried verbatim: same strings, same prices, same functions, same order. Nothing was
// reworded and nothing was renamed.
//
// ══ WHY IT MOVED, AND THE GATE IS WHAT SAID SO ══════════════════════════════
//
// `BillingRoom.tsx` needed `PLAN_LABEL`, `PLAN_PRICE` and `V2`, and the first cut simply
// exported them from `SubscriptionCard.tsx` — three `export` keywords, zero value changes,
// which looked like the smallest possible diff and therefore the right one.
//
// THE AUDIT REDDENED, AND IT WAS RIGHT:
//
//   FAIL  R-38.6 retired strings absent — still shipped:
//         Cancelled. You're on Basic. · Payment failed. You're on Basic. ·
//         Moved to Basic — subscription cancelled · Free — no AI
//
// Importing three constants from a component module drags THE WHOLE MODULE into the
// importing chunk — the component, its JSX, and its own import of
// `lib/vendor/billing/statusLine.ts`. So the four sentences R-38.8 retires BY NAME were
// shipping to the vendor's browser on the very surface built to retire them. They did not
// render. They shipped, and R-38.6's cell asserts served bytes rather than rendered ones,
// deliberately: a retired sentence that is present but unrendered is one conditional away
// from being visible again, and nobody would have known it was there to look at.
//
// THE LESSON IS ABOUT MODULE SHAPE, NOT ABOUT COPY. A constants module and a component
// module are different things, and putting vetoed copy inside a component means every
// consumer of that copy also consumes the component. The copy block's own warrant — that
// bytes under founder veto sit in ONE readable place, diffable against the veto record
// without reading JSX — is BETTER served here than it was there: this file contains no JSX
// at all.
//
// ══ THE MONEY REGISTER IS LAW HERE ══════════════════════════════════════════
// `Rs X,XXX`, zero rupee glyphs, zero k/L/Cr shorthand. Canon prices mirror dream-os
// `src/lib/billing/razorpay.js` TIER_PAISE, which pins them as integers so prose cannot
// drift them (F-10.63).
'use strict';

export const PLAN_LABEL: Record<string, string> = {
  basic: 'Basic', essential: 'Essential', signature: 'Signature', prestige: 'Prestige',
};

export const PLAN_PRICE: Record<string, string> = {
  essential: 'Rs 999 / month',
  signature: 'Rs 1,999 / month',
  prestige:  'Rs 2,999 / month',
};

// ── TDW_10 BILLING v2 · THE FOUNDER-VETOED ACTION SET ───────────────────────
//
// RETIRED WITH THE ERA, and the tombstone travels with the block: 「 Dev will send you a
// payment link. 」 That sentence described the founder minting links by hand, which is the
// mechanism TDW_10 removed. A sentence must not outlive the mechanism it describes.
export const V2 = {
  pickerHeading: 'Choose a plan',
  // ── F-10.108 · SITE 1 · FOUNDER-RULED 「 the free trial stays. no Rs. 2. i know indian
  //    mindset 」 (R-26.16 §A) ────────────────────────────────────────────────────────
  //
  // ⚠ READ THIS BEFORE YOU FILE 「 free 」 AS A DEFECT. IT IS A DECISION.
  //
  // THE FIRST CYCLE IS NOT ZERO. It is Rs 2, and it lives in a METHOD-SCOPED RAZORPAY
  // OFFER — `offer_TMeh1p2GXaMtqt`, UPI-ONLY, witnessed on the dashboard at CE-224. Not
  // the plan. The distinction is the whole of F-10.121: a plan-level price applies to
  // every method, an offer scoped to UPI does not.
  //
  // AND THE REASONING WAS CORRECTED WITH THE SENTENCE. The old paragraph read the tree's
  // silence — no `start_at`, no trial, no `offer_id` in `createSubscription` — as
  // CONFIRMING a plan-level price. It confirms nothing of the kind: an absent `offer_id`
  // is equally consistent with a dashboard offer nobody had looked for, which is exactly
  // what was there. That inference is HOW F-10.121 stayed invisible, and a corrected
  // sentence standing on uncorrected reasoning is how the next one hides.
  //
  // THAT Rs 2 IS KEPT, NOT REFUNDED. `countsAsRevenue` fires on `subscription.charged` +
  // `captured` + amount > 0, so the first cycle is BOOKED AS REVENUE — the estate's own
  // first rupees. The payment Razorpay refunds is the authentication token on
  // `subscription.authenticated`, a DIFFERENT event excluded from revenue by name. So a
  // reader who finds Rs 2 in the ledger and this word on the screen has found exactly what
  // the executor found and reported: 「 free 」 is false by two rupees.
  //
  // THE FOUNDER RULED IT ANYWAY, KNOWING ALL OF THE ABOVE — carried to him twice — on a
  // market-register judgment about how the offer reads to an Indian vendor. That judgment
  // is his and not the estate's to relitigate. This comment exists so the next session
  // inherits the DECISION rather than rediscovering the derivation and filing a defect
  // against a ruling.
  //
  // WHAT IS SAFE AND WHAT IS NOT: the first cycle genuinely GRANTS HER TIER —
  // `tierFromPlan` resolves off `plan_id` FIRST and never consults `TIER_PAISE`, so a
  // 200-paise charge maps to her real plan rather than writing `tier: null` with
  // `billing_status: 'active'`. If anyone ever makes the amount table the primary
  // resolver, this sentence and that cure die together.
  //
  // SCOPE: this line speaks for the SUBSCRIBE path only. Whether the free cycle applies on
  // an UPGRADE is F-10.109, flagged and NOT chartered (founder: 「 this is for a much later
  // build 」), which is why `upgradeExplain` says nothing about it.
  offer: 'First month free. Full price from the second month. Offer applies to UPI payments only.',
  pickerAction: 'Choose',
  // BYTE-UNCHANGED, AND THAT IS A RULING (R-26.16 §B). A first draft proposed naming the
  // offer here too; the founder has not seen that byte, so adding it would ship unvetoed
  // copy on the estate's money surface. Her last read before the mandate screen is the
  // ongoing price with no mention of the free month — flagged to the founder, his to reopen.
  confirm: (label: string, price: string) =>
    `This opens a Razorpay page to approve ${label} — ${price}. You approve once; it renews every month until you cancel.`,
  cancelWarn: (label: string) =>
    `Cancel ${label}? Your plan stops and you move to Basic. This can't be undone — starting again means setting up a new monthly payment.`,
  cancelYes: 'Cancel my plan',
  cancelNo:  'Keep my plan',
  upgradeExplain: (label: string, price: string) =>
    `Moving to ${label} stops your current plan first, then opens a new page to approve ${price}. Until you approve it, you're on Basic.`,
  // The failure set. Never a false done — and never a false "nothing happened", which is
  // the harder half. `mintFailedAfterCancel` is Fork U(a)'s priced seam in her own words:
  // without it she would read a generic error, assume her old plan survived, and be wrong
  // about whether she is currently paying.
  //
  // EVERY SENTENCE HERE REACHES HER THROUGH `show()`. A caller that renders a billing
  // surface without mounting a toast silently swallows all five — a failed cancel that
  // looks like nothing happened. HONEST CONTROLS (CE-209): the mount is asserted by cell
  // at every caller, not trusted.
  mintFailed:   "Couldn't reach Razorpay just now. Nothing has changed — try again in a moment.",
  cancelFailed: "Couldn't cancel just now. Your plan is unchanged — try again in a moment.",
  mintFailedAfterCancel: (label: string) =>
    `Your old plan is already stopped and the new one didn't open. You're on Basic for now — tap ${label} again to finish.`,
  notOpenYet: 'Plan changes are not open yet.',
};
