'use client';
// app/vendor/list/[slice]/invoices.tsx — TDW_03 P1
// Invoices slice module. toRows + cancel route verbatim from the monofile.
// The schedule/PDF machinery stays in SliceScreen verbatim for P1 (guarded by
// slice === 'invoices'); P4 migrates it here when swipe/mark-paid lands.

import { roomHref } from '@/lib/worklist/rooms';
import { useCallback, useMemo } from 'react';
import { useInvoicesData, useLeadsData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtRs, fmtDate, cap, type Row } from '@/components/vendor/slices/SliceRow';
import { phoneKey } from '@/lib/vendor/cabinet';
import type { Lead } from '@/lib/vendor/types/vendor';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Invoice } from '@/lib/vendor/types/vendor';

function toRows(invoices: Invoice[]): Row[] {
  const today = new Date().toISOString().slice(0,10);
  return invoices.map(inv => ({ id: inv.id, primary: inv.client_name, secondary: inv.invoice_number, meta: inv.due_date?`due ${fmtDate(inv.due_date)}`:undefined, badge: cap(inv.state), badgeAlert: inv.state==='unpaid'&&!!inv.due_date&&inv.due_date<today, client_phone: inv.client_phone??undefined, payAmount: inv.amount_owed, aiPrimer: `About the invoice for ${inv.client_name}: `, deletePrimer: `Delete invoice ${inv.invoice_number} for ${inv.client_name} — ${fmtRs(inv.amount_total)} (id: ${inv.id}).`, detail: [{label:'Invoice #',value:inv.invoice_number},{label:'Total',value:fmtRs(inv.amount_total)},{label:'Paid',value:fmtRs(inv.amount_paid)},{label:'Owed',value:fmtRs(inv.amount_owed)},{label:'State',value:inv.state},{label:'Due',value:fmtDate(inv.due_date)}] }));
}

// ── THE ONE SHAPE CHANGE IN THE CROSSING  [2c] ────────────────────────────
// The typed cancel door carries `:vendorId`, so this builder can no longer be a
// module-level function reading only the row. It becomes a closure over the
// vendorId the component already receives — the exact shape `expenses.tsx` has
// carried since TDW_03, so the two slices now differ in nothing but their door.
//
// The row id is `public.invoices.id` now, not an engine binder uuid. That is
// the whole of the crossing at this call site: same verb, same method, an
// address in a different id space.
function makeDeleteRequest(vendorId: string) {
  return (sel: Row) => ({
    url: `${API_BASE}/api/v2/vendor/money/invoices/${vendorId}/${sel.id}/cancel`,
    method: 'PATCH',
  });
}

export default function InvoicesSlice({ vendorId }: { vendorId: string }) {
  // TDW_04 A3 (L-3): the cross-chip reaches invoices — a money row whose client
  // shares a phone with a typed enquiry says so, and jumps there. Display-only;
  // phone-asymmetric twins wear no chip (disclosed, per ST-2).
  const leads = useLeadsData(vendorId);
  const leadByPhone = useMemo(() => {
    const m = new Map<string, Lead>();
    for (const l of leads.data ?? []) { const k = phoneKey(l.phone); if (k && !m.has(k)) m.set(k, l); }
    return m;
  }, [leads.data]);

  const toRowsChipped = useCallback((invoices: Parameters<typeof toRows>[0]): Row[] =>
    toRows(invoices).map(row => {
      const k = phoneKey(row.client_phone);
      const l = k ? leadByPhone.get(k) : undefined;
      if (!l) return row;
      // R-38.1 CURE (S2 ZIP bounce, scope widened by founder word). The whisper's
      // destination is asked of the registry rather than spelled here \u2014 a cross-plane
      // chip is a door out of this room, and R-38.11 amended by label covers every file in
      // a crossed room's import graph, not only the ones it mounts.
      return { ...row, crossChip: `Also an enquiry · ${cap(l.state)}`, crossChipHref: roomHref('leads') };
    }), [leadByPhone]);

  const deleteRequest = useCallback(makeDeleteRequest(vendorId), [vendorId]);

  return <SliceScreen slice="invoices" vendorId={vendorId} useData={useInvoicesData} toRows={toRowsChipped} deleteRequest={deleteRequest} />;
}
