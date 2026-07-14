'use client';
// app/vendor/list/[slice]/leads.tsx — TDW_03 P1
// Leads slice module. toRows mapping + delete route verbatim from the monofile.
// P3 adds draft chips; P4 adds swipe (right → booked, left → call/lost),
// FilterRail state segments, and the one-tap wa.me reply.

import { useLeadsData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtRs, fmtLeadDate, type Row } from '@/components/vendor/slices/SliceRow';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Lead } from '@/lib/vendor/types/vendor';

function toRows(leads: Lead[]): Row[] {
  return leads.map(l => ({ id: l.id, primary: l.name??'Unknown', secondary: l.wedding_city??undefined, meta: l.wedding_date?fmtLeadDate(l.wedding_date, l.wedding_date_precision):undefined, badge: l.state, badgeAlert: l.state==='lost', phone: l.phone??undefined, aiPrimer: `What would you like to change about the ${l.name??'unnamed'} lead?`, deletePrimer: `Delete the lead for ${l.name??'unknown'} (id: ${l.id}).`, detail: [{label:'State',value:l.state},{label:'Wedding date',value:fmtLeadDate(l.wedding_date, l.wedding_date_precision)},{label:'City',value:l.wedding_city??'—'},{label:'Budget',value:fmtRs(l.budget_total)},{label:'Source',value:l.source??'—'}] }));
}

function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/leads/${sel.id}/state`, method: 'PATCH', body: JSON.stringify({ state: 'lost', reason: 'Removed from list' }) };
}

export default function LeadsSlice({ vendorId }: { vendorId: string }) {
  return <SliceScreen slice="leads" vendorId={vendorId} useData={useLeadsData} toRows={toRows} deleteRequest={deleteRequest} />;
}
