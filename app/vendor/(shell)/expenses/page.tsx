"use client";
// app/w/expenses/page.tsx — EXPENSES, INSIDE THE SHELL. R-38.1 + R-38.11.
//
// The layout crossed; the DATA DID NOT. Nothing about the source moved.
//
// ── THIS PARAGRAPH HAS NOW BEEN WRONG IN BOTH DIRECTIONS, AND BOTH ARE FILED ─
// It first read 「Reads the typed plane through the expenses door」 while the
// room read `engine.records` — corrected at 2b with the engine path derived by
// command, and the correction carried its own expiry: 「when 2c lands, this
// paragraph goes with the plane it describes」.
//
// 2c LANDED AT `d38d0ab` AND THE PARAGRAPH DID NOT GO. It kept naming
// `fetchLedger -> GET /api/v2/vendor/binders/:vendorId` for six days after
// `fetchExpenses` stopped calling either. The path at this tip, derived by
// command and not remembered:
//   lib/vendor/api/vendor.ts :: fetchExpenses
//     -> getJson(`${moneyBase(vendorId)}/expenses/${vendorId}`)
//     -> src/api/vendor/money.js -> public.expenses
// TYPED PLANE, reads and writes, since 2c. F-39.3 is CLOSED.
//
// ⚠ THE EXPIRY WAS THE PART THAT FAILED, NOT THE FACT. A comment that names the
// condition of its own retirement still has to be retired BY SOMEBODY, and
// nothing was watching this one — it was found at 2b-2 by a callers-down sweep
// looking for something else entirely (F-2b2.2's `/binders` readers), which is
// to say by luck. F-39.26's class exactly: present-tense ink that reads as a
// description and functions as a promise, and the hardest kind to catch because
// it is not wrong about anything it can be tested on. `C76` asserts the CODE
// path (re-point `fetchExpenses` at `fetchLedger` -> RED); no cell can assert a
// paragraph, which is why the sweep is the instrument and it is a slow one.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of app/w/layout.tsx, so tapping the Expenses tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. The module below is the
// SAME module the /vendor fallback renders — imported, never copied. Two list screens would
// be two homes for every row, every fetch and every vetoed byte, drifting apart without
// either one erroring.
//
// ── THE DECLARED GAP, NAMED HERE AND NOT ONLY IN A HANDOVER ─────────────────
// The slice tree still carries thirty colour LITERALS (F-38.22) and its own older type
// register. Inside the shell's scope those literals bypass the variable layer and paint
// Espresso brass where the shell's accent is teal. It is CAPTURED, named as excluded from
// the render arm's tuple cell, and priced — not swept inside a structural crossing, and not
// passed over quietly, which is the failure S1 refused for AtelierForm on the same reasoning.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import ExpensesSlice from './body';

export default function ShellExpensesPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.expensesTitle}>
      <RoomBody><ExpensesSlice vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
