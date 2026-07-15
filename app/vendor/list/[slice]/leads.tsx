'use client';
// app/vendor/list/[slice]/leads.tsx — TDW_03 P1 · R1(b) cross-chip added
// Leads slice module: typed plane (post-(A) repoint). R1(b), CE-ruled:
// each lead row carries a display-only whisper when a records-plane binder
// shares its phone — "In your books · booked · ₹20k in". Reads, never
// writes; 16's engagements spine sending a postcard ahead of itself.
// DISCLOSED: phone-asymmetric twins won't chip (absence ≠ no twin).

import { useCallback, useMemo } from 'react';
import { useLeadsData, useCabinetData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtRs, fmtLeadDate, cap, type Row } from '@/components/vendor/slices/SliceRow';
import { amountWordsAdjacent, phoneKey } from '@/lib/vendor/cabinet';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Lead } from '@/lib/vendor/types/vendor';
import type { CabinetBinder } from '@/lib/vendor/api/vendor';

// F-04.9 (founder-ruled 2026-07-15): every primer is a completable STEM in the
// tell_victor grammar — "About {name}: …" — mid-sentence, never a question.
// A question invites an answer; a stem invites the fact.
function baseRows(leads: Lead[]): Row[] {
  return leads.map(l => ({ id: l.id, primary: l.name??'Unknown', secondary: l.wedding_city??undefined, meta: l.wedding_date?fmtLeadDate(l.wedding_date, l.wedding_date_precision):undefined, badge: l.state, badgeAlert: l.state==='lost', phone: l.phone??undefined, aiPrimer: `About ${l.name??'this enquiry'}: `, deletePrimer: `Delete the lead for ${l.name??'unknown'} (id: ${l.id}).`, draftMissing: l.draft?.missing, pipelineValue: l.budget_total ?? 0, detail: [{label:'State',value:l.state},{label:'Wedding date',value:fmtLeadDate(l.wedding_date, l.wedding_date_precision)},{label:'City',value:l.wedding_city??'—'},{label:'Budget',value:fmtRs(l.budget_total)},{label:'Source',value:l.source??'—'},{label:'Notes',value:l.notes??'—'}] })); // Notes: F-04.7 read-row (display-only, CE fence)
}

// TDW_04 A2 (L-2, F-04.2's ratified cure): DELETE means the REAL soft-delete
// door — the row leaves the list AND its snapshot line dies server-side. The
// masquerade (PATCH state:'lost' dressed as delete — M3) is DEAD on every
// caller; "Mark lost" is now its own deliberate action with its own confirm.
function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/leads/${sel.id}`, method: 'DELETE', successMessage: 'Deleted.' };
}

export default function LeadsSlice({ vendorId }: { vendorId: string }) {
  const cab = useCabinetData(vendorId);

  // Phone-keyed view of the records plane (first binder per key; cabinet
  // arrives newest-first).
  const binderByPhone = useMemo(() => {
    const m = new Map<string, CabinetBinder>();
    const groups = [cab.data?.clients, cab.data?.leads, cab.data?.paid, cab.data?.owed];
    for (const g of groups) for (const b of g ?? []) {
      const k = phoneKey(b.phone);
      if (k && !m.has(k)) m.set(k, b);
    }
    return m;
  }, [cab.data]);

  const toRows = useCallback((leads: Lead[]): Row[] => {
    return baseRows(leads).map(row => {
      const k = phoneKey(row.phone);
      const b = k ? binderByPhone.get(k) : undefined;
      if (!b) return row;
      const recv = b.amount_received ?? 0;
      const bits = ['In your books'];
      if (b.stage) bits.push(cap(b.stage));
      if (recv > 0) bits.push(`${amountWordsAdjacent(recv)} in`);
      return { ...row, crossChip: bits.join(' · ') };
    });
  }, [binderByPhone]);

  return <SliceScreen slice="leads" vendorId={vendorId} useData={useLeadsData} toRows={toRows} deleteRequest={deleteRequest} />;
}
