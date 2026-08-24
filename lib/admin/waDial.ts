// lib/admin/waDial.ts — MICRO-WA-DIAL, CE-225 board (2026-08-24).
//
// ONE HOME for the founder's outbound WhatsApp link off an admin People row.
// Two readers: app/admin/makers/page.tsx and app/admin/dreamers/page.tsx. It is
// a separate file rather than a pair of inline expressions for the same reason
// FORK C was ruled against two inline anchors — two copies of a predicate is
// divergence by construction, and this one guards a real hazard.
//
// ── WHAT THIS IS NOT ─────────────────────────────────────────────────────────
// NOT lib/waNumbers.ts. That file holds TDW'S OWN two numbers — the ones a
// bride or a vendor messages INBOUND — and is a declared drift twin of dream-os
// src/lib/waNumbers.js. This file holds no number at all. It reads a PERSON's
// stored number and decides whether the founder may be handed a link to it.
// Different direction, different authority, different failure mode.
//
// ── THE PREDICATE, AND WHY IT REFUSES RATHER THAN REPAIRS (R-225.A, A3) ──────
// The rendered number's true origin is public.users.phone (text NOT NULL),
// served through dream-os src/api/admin/vendors.js:62 and couples.js:56, both
// off a `users!inner(name, phone)` join. It is written by toE164
// (dream-os src/lib/phone.js:26-31), whose third branch is `return raw` — an
// escape hatch that stores whatever it could not normalise.
//
// So the stored shape is NOT uniformly E.164, and the naive rule (strip every
// non-digit, keep what's left) fails SILENTLY rather than loudly:
//
//   ·  '+919888294440'   → 919888294440   correct
//   ·  '+91 98882-94440' → 919888294440   correct
//   ·  '9431101193'      → 9431101193     WRONG COUNTRY, and it still opens.
//        This shape is not hypothetical: dream-os src/api/admin/vendors.js:19
//        records it verbatim as what the mint at 800d7a1 stored before F-10.50
//        cured it. The cure was forward-only; no backfill is claimed.
//   ·  a 20-digit, 30-char sentinel beginning 'RET' — a retirement tombstone
//        parked where a freed number's bytes were. Ruled INTENTIONAL DATA at
//        CE-225: a retired account SHOULD have no WhatsApp button, so absence
//        here is the true rendering and not merely caution.
//
// A wrong link is worse than no link: it opens, it looks like it worked, and
// the founder discovers the mistake at the other end. Absent is honest.
//
// ── THE PREDICATE IS THE CENSUS'S OWN CASE ──────────────────────────────────
// The founder's 2026-08-24 shape census over all 79 People rows bucketed on:
//
//     u.phone like '+%' and length(regexp_replace(u.phone,'\D','','g')) > 10
//
// and returned 27 makers + 51 dreamers in that bucket, 0 bare-ten, 1 sentinel.
// The line below is that CASE expressed in TypeScript. The rule that COUNTED
// the estate is the rule that RENDERS it — one semantic, provable against a
// number the founder can re-run. If this predicate is ever widened, the census
// above is the thing that must be re-run to justify it.
//
// No normalisation happens here BY DESIGN. Repairing a number client-side would
// mint a second normaliser semantic in a second repo, which is precisely the
// divergence dream-os src/lib/phone.js's own header exists to prevent.

/** The digits wa.me wants: every non-digit stripped, country code kept, no '+'. */
export function waDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * The href for a People row's WhatsApp affordance, or `null` when this row must
 * render NO affordance at all — an absent button, never a dead or wrong one.
 *
 * `null` is returned for a missing number, an empty string, a bare national
 * number carrying no country code, and the retirement sentinel. Callers render
 * nothing on `null`; they do not render a disabled control.
 */
export function waDialHref(phone: string | null | undefined): string | null {
  if (!phone) return null;
  if (!phone.startsWith('+')) return null;
  const digits = waDigits(phone);
  if (digits.length <= 10) return null;
  return `https://wa.me/${digits}`;
}
