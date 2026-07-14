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
  return expenses.map(exp => ({ id: exp.id, primary: exp.description??'Expense', secondary: exp.category??undefined, meta: exp.expense_date?fmtDate(exp.expense_date):undefined, badge: fmtRs(exp.amount), aiPrimer: `What would you like to change about the expense "${exp.description??'this expense'}" — ${fmtRs(exp.amount)}?`, deletePrimer: `Delete expense "${exp.description??'this expense'}" — ${fmtRs(exp.amount)} (id: ${exp.id}).`, detail: [{label:'Amount',value:fmtRs(exp.amount)},{label:'Category',value:exp.category??'—'},{label:'Description',value:exp.description??'—'},{label:'Date',value:fmtDate(exp.expense_date)},{label:'Client',value:exp.client_name??'—'}] }));
}

export default function ExpensesSlice({ vendorId }: { vendorId: string }) {
  // TDW_03 (B), CE-ruled: expenses are money-OUT binders (6-B) — the typed
  // DELETE can't know binder ids (F4). Delete = the binder /hide door: the
  // same soft-delete covenant, reversible via unarchive.
  const deleteRequest = (sel: Row) => ({
    url: `${API_BASE}/api/v2/vendor/binders/${vendorId}/${sel.id}/hide`,
    method: 'POST',
  });
  return <SliceScreen slice="expenses" vendorId={vendorId} useData={useExpensesData} toRows={toRows} deleteRequest={deleteRequest} />;
}
