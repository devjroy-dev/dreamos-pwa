'use client';
// app/vendor/list/[slice]/invoices.tsx — TDW_03 P1
// Invoices slice module. toRows + cancel route verbatim from the monofile.
// The schedule/PDF machinery stays in SliceScreen verbatim for P1 (guarded by
// slice === 'invoices'); P4 migrates it here when swipe/mark-paid lands.

import { useInvoicesData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtRs, fmtDate, cap, type Row } from '@/components/vendor/slices/SliceRow';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Invoice } from '@/lib/vendor/types/vendor';

function toRows(invoices: Invoice[]): Row[] {
  const today = new Date().toISOString().slice(0,10);
  return invoices.map(inv => ({ id: inv.id, primary: inv.client_name, secondary: inv.invoice_number, meta: inv.due_date?`due ${fmtDate(inv.due_date)}`:undefined, badge: cap(inv.state), badgeAlert: inv.state==='unpaid'&&!!inv.due_date&&inv.due_date<today, client_phone: inv.client_phone??undefined, payAmount: inv.amount_owed, aiPrimer: `What would you like to change about invoice ${inv.invoice_number} for ${inv.client_name}?`, deletePrimer: `Delete invoice ${inv.invoice_number} for ${inv.client_name} — ${fmtRs(inv.amount_total)} (id: ${inv.id}).`, detail: [{label:'Invoice #',value:inv.invoice_number},{label:'Total',value:fmtRs(inv.amount_total)},{label:'Paid',value:fmtRs(inv.amount_paid)},{label:'Owed',value:fmtRs(inv.amount_owed)},{label:'State',value:inv.state},{label:'Due',value:fmtDate(inv.due_date)}] }));
}

function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/invoices/${sel.id}/cancel`, method: 'PATCH' };
}

export default function InvoicesSlice({ vendorId }: { vendorId: string }) {
  return <SliceScreen slice="invoices" vendorId={vendorId} useData={useInvoicesData} toRows={toRows} deleteRequest={deleteRequest} />;
}
