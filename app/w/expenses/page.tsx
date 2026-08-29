"use client";
// app/w/expenses/page.tsx — EXPENSES, INSIDE THE SHELL. R-38.1 + R-38.11.
//
// The layout crossed; the DATA DID NOT. Nothing about the source moved.
//
// ── THE LINE THAT STOOD HERE WAS FALSE, AND HAD BEEN SINCE IT WAS WRITTEN ───
// It read: 「Reads the typed plane through the expenses door」. This room reads
// `engine.records`. The path, derived rather than remembered:
//   lib/vendor/api/vendor.ts :: fetchExpenses
//     -> fetchLedger -> GET /api/v2/vendor/binders/:vendorId
//     -> src/api/vendor-engine/ledger.js -> schema('engine').from('records')
// and `src/api/vendor/expenses.js`'s own GET arm opens `schema('engine')` too.
//
// F-39.3 measured what that costs: `engine.records` money is ZERO for all 28
// vendors while the typed plane holds every rupee. So a reader checking this
// room's plane BY ITS COMMENT was told the disease was already cured, on the one
// surface where it was live. F-06.85's form: a sentence conditioned on a
// mechanical fact names the mechanism, and this one named the wrong one.
//
// ⚠ ENGINE, UNTIL 2c — AND THE EXPIRY IS PART OF THE STATEMENT. Step 2c crosses
// this room's reads AND its writes in one sitting, because its rows' ids are
// engine binder uuids and its delete control (app/vendor/list/[slice]/expenses.tsx
// :: deleteRequest, the binder `/hide` door) is keyed on that id space. Crossing
// the read alone would 404 every delete. When 2c lands, this paragraph goes with
// the plane it describes.
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
import ExpensesSlice from '@/app/vendor/list/[slice]/expenses';

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
