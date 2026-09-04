'use client';
// app/vendor/list/[slice]/expenses.tsx — TDW_03 P1
// Expenses slice module. toRows + delete route verbatim from the monofile.
// P4 adds swipe (right → repeat last, left → delete) and month chips.

import { useExpensesData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtRs, fmtDate, type Row } from '@/components/vendor/slices/SliceRow';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Expense } from '@/lib/vendor/types/vendor';

function toRows(expenses: Expense[]): Row[] {
  return expenses.map(exp => ({ id: exp.id, primary: exp.description??'Expense', secondary: exp.category??undefined, meta: exp.expense_date?fmtDate(exp.expense_date):undefined, badge: fmtRs(exp.amount), pipelineValue: exp.amount, sortDate: exp.expense_date, aiPrimer: `About the ${fmtRs(exp.amount)} expense: `, deletePrimer: `Delete expense "${exp.description??'this expense'}" — ${fmtRs(exp.amount)} (id: ${exp.id}).`, detail: [{label:'Amount',value:fmtRs(exp.amount)},{label:'Category',value:exp.category??'—'},{label:'Description',value:exp.description??'—'},{label:'Date',value:fmtDate(exp.expense_date)},{label:'Client',value:exp.client_name??'—'}] }));
}

export default function ExpensesSlice({ vendorId }: { vendorId: string }) {
  // TDW_03 (B), CE-ruled: expenses are money-OUT binders (6-B) — the typed
  // ── CROSSED AT 2c · THE ELEVENTH SITE ──────────────────────────────────
  // The seat's own call-site table named TEN and this was not one of them: it
  // builds its URL inline instead of calling `vendor.ts`, so a sweep of that
  // file's exports could not see it. Found by parity — `invoices.tsx` gained
  // the vendorId closure this file already had, and the two doors were then
  // read side by side.
  //
  // WHAT IT SAID: 「DELETE can't know binder ids (F4). Delete = the binder
  // /hide door」. Both halves retire together — the row id is
  // `public.expenses.id` now, and the typed door soft-deletes by stamping
  // `deleted_at`, which every typed read filters. The row leaves the room
  // without leaving the database, exactly as `/hide` meant to.
  const deleteRequest = (sel: Row) => ({
    url: `${API_BASE}/api/v2/vendor/money/expenses/${vendorId}/${sel.id}`,
    method: 'DELETE',
    // The byte survives the crossing untouched. A plane change is not a copy
    // change, and the first cut of this edit dropped it — caught by reading the
    // diff rather than the result.
    successMessage: 'Expense removed.',
  });
  return <SliceScreen slice="expenses" vendorId={vendorId} useData={useExpensesData} toRows={toRows} deleteRequest={deleteRequest} />;
}
