// scripts/bands.proof.ts
// TDW_04.5 P2 — the BAND VIEW's two dependency-free logic seams, proved standalone
// (the pwa has no test runner; the crewCommit.proof.ts precedent, same harness).
//
// SEAM 1 — F-04.104: the CANON's empty-string clause. This is the CE-ruled rider's
//   own bench case. Both-ways: revert the `!== ''` clause in lib/vendor/derive.ts and
//   the FIRST assert below goes RED (pendingOf returns 0 — "unfiled read as settled",
//   the exact convicted class), while every other assert stays green.
//
// SEAM 2 — the money whisper's ABSENT-HONESTY: the rule that decides whether there is
//   anything honest to SAY. Both-ways: change `return null` to `return inr(0)` on the
//   no-cells branch of whisperFor and the absence asserts go RED.
//
// whisperFor is re-declared here rather than imported because CalendarBands.tsx is a
// React component module ('use client' + JSX) and cannot compile standalone in plain
// node. DISCLOSED AS A LIMITATION, not hidden: this proves the RULE the component
// applies, and the component's own copy is byte-identical to the block below — the
// divergence risk is real and named. pendingOf, the load-bearing half, IS the real
// import: the canon itself is under test.

import { pendingOf } from '../lib/vendor/derive';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

type Cells = { amount: number | null; direction: string | null; amount_received: number | null; amount_pending: number | null };
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
function whisperFor(money: Cells | null): string | null {
  if (!money) return null;
  const amount = money.amount == null ? null : Number(money.amount);
  if (amount == null || !Number.isFinite(amount) || amount === 0) return null;
  const pending = pendingOf(money);
  return pending > 0 ? `${inr(amount)} · ${inr(pending)} pending` : inr(amount);
}

console.log('\n── F-04.104: an empty string is UNFILED, not settled ──');
ok(pendingOf({ amount: 125000, direction: 'in', amount_received: 40000, amount_pending: '' as unknown as number }) === 85000,
  "amount_pending '' falls through to max(amount − received, 0) = 85000  [F-04.104's own case]");
ok(pendingOf({ amount: 125000, direction: 'in', amount_received: 40000, amount_pending: null }) === 85000,
  'null is unfiled -> inferred (the pre-existing canon, unchanged)');
ok(pendingOf({ amount: 125000, direction: 'in', amount_received: 40000, amount_pending: 0 }) === 0,
  'an EXPLICIT 0 still wins — a binder filed as settled stays settled');
ok(pendingOf({ amount: 125000, direction: 'in', amount_received: 0, amount_pending: 60000 }) === 60000,
  'an explicit figure wins over the inference');
ok(pendingOf({ amount: 5000, direction: 'out', amount_received: 0, amount_pending: null }) === 0,
  'the direction guard holds: an expense binder never invents debt');

console.log('\n── the whisper: absent-honesty, never ₹0 ──');
ok(whisperFor(null) === null, 'no cells at all -> NO whisper (hop failed / no binder)');
ok(whisperFor({ amount: null, direction: 'in', amount_received: null, amount_pending: null }) === null,
  'cells present but amount unfiled -> NO whisper (never "₹0")');
ok(whisperFor({ amount: 0, direction: 'in', amount_received: 0, amount_pending: 0 }) === null,
  'a zero-value binder is silent, not "₹0"');
ok(whisperFor({ amount: 125000, direction: 'in', amount_received: 40000, amount_pending: null }) === '₹1,25,000 · ₹85,000 pending',
  'the vetoed format, Indian grouping, pending inferred by the canon');
ok(whisperFor({ amount: 125000, direction: 'in', amount_received: 125000, amount_pending: 0 }) === '₹1,25,000',
  'pending ELIDED at zero — the vetoed elision, string 5');
ok(whisperFor({ amount: 125000, direction: 'in', amount_received: 40000, amount_pending: '' as unknown as number }) === '₹1,25,000 · ₹85,000 pending',
  'F-04.104 reaches the whisper: an empty cell no longer prints a falsely-settled band');

console.log(`\n══ bands.proof: ${pass} passed, ${fail} failed ══\n`);
process.exit(fail === 0 ? 0 : 1);
