// lib/worklist/billingChip.ts — R-38.8 · THE STATUS IS A CHIP, NOT A SENTENCE.
//
// ══ WHAT THIS REPLACES, AND WHAT IT KEEPS ═══════════════════════════════════
//
// `lib/vendor/billing/statusLine.ts` stays exactly where it is and `main` keeps rendering
// it. This module is the SHELL's resolver, and the difference between them is a ruling,
// not a rewrite:
//
//   R-38.8 RETIRES THE BLENDED BYTES BY NAME —
//     「Cancelled. You're on Basic.」  ·  「Payment failed. You're on Basic.」
//     「Moved to Basic — subscription cancelled. …」  and its halted twin
//   because a status row has no business making a claim about her PLAN. The plan card one
//   line above already names it, correctly, and the two together were how a vendor at
//   `tier: 'signature'` with a dead rail read 「you're on Basic」 while dream-os
//   `chat.js:buildLlmForTurn` was actively serving her Signature AI.
//
//   IT KEEPS THE MECHANISM THAT MADE THAT DIAGNOSABLE. F-10.110's cure was reading the
//   PAIR, and the pair is read here too. ⚠ IF A LATER TIDY COLLAPSES THIS TO ONE KEY, THE
//   DEFECT RETURNS WHOLE — the plan side of the answer comes from `tier` and the chip side
//   comes from `billing_status`, and the two genuinely disagree in production because two
//   sanctioned admin surfaces write `tier` alone (dream-os `src/api/admin/vendors.js`
//   PATCH /:vendorId/tier, and `src/admin/router.js`'s unified-invite mint). Comping a
//   vendor after her subscription lapsed lands her on a divergent pair with nobody
//   editing a row.
//
//   SO THE BLEND IS CURED BY SEPARATION RATHER THAN BY REWORDING. The plan card says
//   `Signature`. The chip says `Cancelled`. Both are true, neither implies the other, and
//   no sentence has to hold them together.
//
// ══ WHAT R-38.8 ASKED FOR AND THIS CANNOT GIVE ══════════════════════════════
// The ruling's third chip example is 「Ends 14 Sep」. THERE IS NO SUCH DATE IN THE ESTATE.
// `billing_status` has no companion timestamp, `tierFlip.js` writes none, and
// `vendors.updated_at` moves on any profile save — SubscriptionCard.tsx's own vetoed block
// records this, and records that a first draft's flip date was DROPPED at the founder's
// ruling for exactly that reason: a plausible wrong date is worse than no date. Reported
// to the chair rather than invented here.
//
// ══ WHY THIS MODULE IMPORTS NOTHING BUT COPY ════════════════════════════════
// `statusLine.ts`'s header records that a `.mjs` bench can `import` and EXECUTE it over
// every pair only while it stays free of `@/` aliases and JSX. This module carries one
// alias import (COPY) and is therefore NOT executable by that bench. That is a real cost
// and it is paid deliberately: the alternative is a second home for six vetoed strings.
// The shell's own bench asserts the mapping by source text; the pair logic below is small
// enough to read, which is the trade being made.
'use strict';

import { COPY } from '@/lib/worklist/copy';

/**
 * The rail's five words, `db/migrations/0114_billing_rails.sql`'s CHECK exactly:
 * `CHECK (billing_status IN ('none','active','pending','halted','cancelled'))`.
 * A word outside this set is UNRECOGNISED and yields no chip at all.
 */
const KNOWN_STATUS = ['none', 'active', 'pending', 'halted', 'cancelled'];

/**
 * The tiers carrying a live AI entitlement — `0115_tier_vocabulary.sql`'s canon minus the
 * floor. AN ALLOWLIST, NOT `tier !== 'basic'`, AND THAT IS THE CELL: `useSettings.ts`
 * seeds `tier: ''` and maps `v.tier ?? ''`, so the EMPTY STRING reaches this function on
 * the pre-fetch frame and on any `/me` that omits the field. `'trial'` is the same shape
 * one migration back. A negated test would classify both as paid and tell a vendor
 * mid-load that her plan is still on.
 */
const PAID_TIERS = ['essential', 'signature', 'prestige'];

export type ChipTone = 'neutral' | 'live' | 'caution';
export interface BillingChip {
  /** The chip's word. `null` means RENDER NO CHIP — honest under ignorance. */
  label: string | null;
  tone: ChipTone;
}

/**
 * Resolve the status chip from the PAIR.
 *
 * AN UNRECOGNISED STATUS RETURNS `label: null` AND THE CALLER RENDERS NOTHING. The retired
 * `?? 'Not set up yet.'` fallback did not absorb neutrally — it asserted a specific false
 * state to a vendor whose status word it could not read. Rendering nothing is honest under
 * ignorance; rendering a chip is not.
 */
export function billingChip(tier: string, billingStatus: string): BillingChip {
  if (!KNOWN_STATUS.includes(billingStatus)) return { label: null, tone: 'neutral' };

  const paid = PAID_TIERS.includes(tier);

  if (billingStatus === 'active')  return { label: COPY.chipActive,   tone: 'live' };
  if (billingStatus === 'pending') return { label: COPY.chipRetrying, tone: 'caution' };

  // `none` on a paid tier is the comped vendor: an entitlement someone set by hand, with
  // no money ever landed. She is told the rail is not set up; she is NOT told she is on
  // Basic, because she is not.
  if (billingStatus === 'none') {
    return paid ? { label: COPY.chipNotSetUp, tone: 'neutral' }
                : { label: COPY.chipBasic,    tone: 'neutral' };
  }

  if (billingStatus === 'halted') {
    return paid ? { label: COPY.chipFailed, tone: 'caution' }
                : { label: COPY.chipBasic,  tone: 'neutral' };
  }

  // `cancelled` — the only word left, and the one the founder's own walk sits on.
  return paid ? { label: COPY.chipCancelled, tone: 'neutral' }
              : { label: COPY.chipBasic,     tone: 'neutral' };
}
