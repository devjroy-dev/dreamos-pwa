// lib/vendor/billing/statusLine.ts
// ─────────────────────────────────────────────────────────────────────────────
// TDW_10 · F-10.110's CURE (R-26.18, Fork 1 arm B) — THE STATUS LINE READS THE
// PAIR.
//
// ══ WHY THIS READS TWO COLUMNS AND NOT ONE (F-06.85 mechanism comment) ═══════
// A vendor's ENTITLEMENT and her PAYMENT RAIL are two different facts living in
// two different columns, and they can disagree.
//
//   ENTITLEMENT is `vendors.tier`, and it is the TRUE half. dream-os
//   `src/api/vendor-engine/chat.js`, `buildLlmForTurn` — `const productTier =
//   (vendor && vendor.tier) || 'basic'`. That expression is the whole of AI
//   entitlement on both lanes. `billing_status` appears ZERO times in
//   `chat.js` and ZERO times in `src/lib/vendorInbound.js` (counted, both
//   files, at dream-os 90d67ba). The rail's state does not gate her AI.
//
//   THE RAIL is `vendors.billing_status`, five values, 0114's CHECK.
//
// THEY DIVERGE THROUGH THE PANEL WORKING AS DESIGNED — this is not manual data
// entry and not a test artifact. The webhook path CANNOT produce a divergence:
// `src/lib/billing/razorpay.js:entitlementFor` returns tier AND status together
// and `tierFlip.js:applyEntitlement` writes them in ONE `update()`. But TWO
// sanctioned admin surfaces write `tier` ALONE and never touch `billing_status`:
// `src/api/admin/vendors.js` (`PATCH /:vendorId/tier` → `.update({ tier })`) and
// `src/admin/router.js` (the unified-invite mint → `.update({ tier: cleanTier })`).
// Comping a vendor after her subscription lapsed lands her on a divergent pair
// with nobody editing a row.
//
// SO A SINGLE-COLUMN LOOKUP IS FALSE BY CONSTRUCTION. Before this module the
// Status row read `BILLING_STATUS[current.billing_status]` and told a vendor at
// `tier: 'signature'`, `billing_status: 'cancelled'` that she was 「 on Basic 」
// while `buildLlmForTurn` was actively serving her Signature AI — and F-10.77's
// explanation went silent, because its gate (`tier === 'basic'`) excluded exactly
// the vendor who most needed it.
//
// ⚠ IF A LATER TIDY COLLAPSES THIS BACK TO ONE KEY, THAT DEFECT RETURNS WHOLE.
// The pair is the mechanism. Do not key on `billingStatus` alone.
//
// ══ WHY BOTH OUTPUTS COME FROM ONE FUNCTION ═════════════════════════════════
// R-26.18 Fork 2 ruled FOLD, not WIDEN. The old shape had the sentence in one
// place and its explanation behind a separate gate in JSX, and the defect WAS
// the gap between them. One function owning both means the gap has nowhere to
// exist — that is stronger than being careful about it. There is no second gate
// downstream; the component renders `note` iff it is non-null.
//
// ══ WHY THIS MODULE IMPORTS NOTHING ═════════════════════════════════════════
// DELIBERATE, AND IT IS AN INSTRUMENT DECISION. Every bench in `scripts/` is a
// source-text bench; asserting 「 every pair renders a true sentence 」 by
// pattern-matching JSX would reproduce the method under test, which is not a
// check under the independent-method law. Node strips types, so a `.mjs` bench
// can `import` this file and EXECUTE it over all 25 pairs — but only while it
// stays free of `@/` aliases and JSX. ADDING AN IMPORT HERE BLINDS THE BENCH.
//
// ══ THE COPY ════════════════════════════════════════════════════════════════
// Every rendered byte below is founder-veto. The strings are hoisted into ONE
// readable block for the reason `components/vendor/SubscriptionCard.tsx`'s own
// vetoed block gives: copy under veto lives in one place so it can be diffed
// against the veto record without reading logic. MONEY REGISTER: this surface
// names no figure at all — zero rupee glyphs, zero k/L/Cr shorthand.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The rail's five words, 0114's CHECK exactly:
 * `db/migrations/0114_billing_rails.sql` —
 * `CHECK (billing_status IN ('none','active','pending','halted','cancelled'))`.
 * A word outside this set is UNRECOGNISED and yields no row (see below).
 */
const KNOWN_STATUS = ['none', 'active', 'pending', 'halted', 'cancelled'];

/**
 * The tiers that carry a live AI entitlement — `0115_tier_vocabulary.sql`'s
 * canon minus the floor: `CHECK (tier IN ('basic','essential','signature','prestige'))`.
 *
 * AN ALLOWLIST, NOT `tier !== 'basic'`, AND THAT IS THE CELL. `useSettings.ts`
 * seeds `tier: ''` in EMPTY and maps `v.tier ?? ''`, so the EMPTY STRING reaches
 * this function on the pre-fetch frame and on any `/me` that omits the field.
 * `'trial'` is the same shape one migration back — 0115 backfilled it to
 * `'basic'` but the column's default was `'trial'` and a straggler row would
 * arrive here unannounced. A negated test would classify BOTH as paid tiers and
 * tell a vendor mid-load that her plan is still on. The allowlist sends every
 * unrecognised word to the floor arm, which is what `PLAN_LABEL[tier] ?? 'Basic'`
 * already does one row above — the currently-safe path, preserved on purpose.
 *
 * `strict: false` is set in this repo's tsconfig, so the compiler will not warn
 * about any of this. It is hand-derived and cell-asserted.
 */
const PAID_TIERS = ['essential', 'signature', 'prestige'];

// ── THE FOUNDER-VETOED STRING SET ───────────────────────────────────────────
// UNCHANGED BYTES, carried verbatim from `SubscriptionCard.tsx`'s v1 set. These
// five are not this sitting's to reword and a cell asserts their byte-identity.
const S_NONE    = 'Not set up yet.';
const S_ACTIVE  = 'Active. Renews monthly.';
// `pending` is the retry-window mercy (R-BILL.3): a card that bounced once,
// while Razorpay is still trying, is not a demotion. True on every tier, which
// is why it takes no arm below.
const S_PENDING = "Payment didn't go through. Retrying — nothing changes yet.";
const S_FLOOR_HALTED    = "Payment failed. You're on Basic.";
const S_FLOOR_CANCELLED = "Cancelled. You're on Basic.";

// UNCHANGED NOTES, carried verbatim from F-10.77's cell.
const N_FLOOR_CANCELLED =
  'Moved to Basic — subscription cancelled. Profile and leads unchanged. AI is off on Basic.';
const N_FLOOR_HALTED =
  'Moved to Basic — subscription stopped after failed payments. Profile and leads unchanged. AI is off on Basic.';

// ── NEW BYTES · HELD ON THE FOUNDER'S WORD (R-26.18 §E) ─────────────────────
// THE STATUS ROW REPORTS THE RAIL AND STOPS. It has no business making a claim
// about her plan; the Plan row one line above already says `Signature` correctly.
// The blend was the whole bug.
//
// THE TRAP THIS COPY AVOIDS, named so nobody re-opens it: 「 your Signature plan
// is comped, so nothing changes. 」 That puts 「 comped 」 on her screen, discloses
// an arrangement she may not know she is in, invites the question of how long it
// lasts, and promises something the estate has not decided to keep. The screen
// reports the state; it does not narrate the favour.
//
// CAUSE DIFFERS, CONSEQUENCE DOES NOT (R-26.18 Fork 3). A failed card and a
// deliberate cancellation are different events — after `halted` she may want to
// retry with another card, after `cancelled` she chose — and dream-os
// `src/api/admin/bridge.js` already treats `halted` alone as a degraded-revenue
// signal. Two sentences, one consequence clause.
const S_PAID_HALTED    = 'Payment failed. No monthly payment is set up.';
const S_PAID_CANCELLED = 'Cancelled. No monthly payment is set up.';
const N_PAID = (planLabel: string) =>
  `Your ${planLabel} plan is still on. Profile, leads and AI are unchanged.`;

export interface StatusLine {
  /** The Status row's sentence. `null` means RENDER NO ROW — see below. */
  status: string | null;
  /** The explanation paragraph. `null` means render nothing. */
  note: string | null;
}

/**
 * Resolve the Status row and its explanation from the PAIR.
 *
 * @param tier         `vendors.tier` as it arrives from `/me` — may be `''`.
 * @param billingStatus `vendors.billing_status` — may be any string.
 * @param planLabel    The SAME expression the Plan row renders
 *                     (`PLAN_LABEL[current.tier] ?? 'Basic'`), passed in rather
 *                     than re-derived here so the tier vocabulary keeps ONE home
 *                     in the vetoed block it already lives in. A second copy of
 *                     that map in this file would be F-04.36's family: one fact,
 *                     two homes, drifting apart without either one erroring.
 *
 * AN UNRECOGNISED STATUS RETURNS `status: null` AND THE CALLER RENDERS NO ROW.
 * The retired `?? 'Not set up yet.'` fallback did NOT absorb neutrally — it
 * asserted a specific false state to a vendor whose status word it could not
 * read. Rendering nothing is honest under ignorance; rendering a sentence is not.
 * (This is F-10.106's own logic applied one row down: a frame over nothing is
 * worse than no frame.)
 */
export function statusLine(
  tier: string,
  billingStatus: string,
  planLabel: string,
): StatusLine {
  if (!KNOWN_STATUS.includes(billingStatus)) return { status: null, note: null };

  const paid = PAID_TIERS.includes(tier);

  if (billingStatus === 'none')    return { status: S_NONE,    note: null };
  if (billingStatus === 'active')  return { status: S_ACTIVE,  note: null };
  if (billingStatus === 'pending') return { status: S_PENDING, note: null };

  if (billingStatus === 'halted') {
    return paid
      ? { status: S_PAID_HALTED,  note: N_PAID(planLabel) }
      : { status: S_FLOOR_HALTED, note: N_FLOOR_HALTED };
  }

  // `cancelled` — the only word left, and the one the founder's own walk sits on.
  return paid
    ? { status: S_PAID_CANCELLED,  note: N_PAID(planLabel) }
    : { status: S_FLOOR_CANCELLED, note: N_FLOOR_CANCELLED };
}
