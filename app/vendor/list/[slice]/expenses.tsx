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

function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/expenses/${sel.id}`, method: 'DELETE' };
}

export default function ExpensesSlice({ vendorId }: { vendorId: string }) {
  return <SliceScreen slice="expenses" vendorId={vendorId} useData={useExpensesData} toRows={toRows} deleteRequest={deleteRequest} />;
}
