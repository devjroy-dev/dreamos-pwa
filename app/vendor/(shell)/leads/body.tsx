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
import { fmtRs, fmtLeadDate, fmtArrival, cap, type Row } from '@/components/vendor/slices/SliceRow';
import { openBandLabelFor } from '@/lib/frost/budgetBands'; // F-16.25: the band's own byte, one home

// ── F-16.25 (R-37.21) · THE BUDGET CELL READS THE PAIR, NOT THE CEILING ─────
// `budget_total` is the CEILING (aliased from budget_max). The top band has
// none, so `fmtRs(l.budget_total)` rendered `Rs —` for the richest enquiry on
// the board — identical to a bride who answered nothing.
//
// The floor and the ceiling are now read TOGETHER, and the three states are
// distinct: a ceiling renders the money as it always has · a floor with NO
// ceiling renders the band's OWN founder-vetoed label ('Rs 10,00,000+'), which
// is what she actually chose · neither renders `Rs —`, which is now true again
// because it means she said nothing.
//
// THE LABEL IS NOT A NEW STRING. It comes from `budgetBands.ts`, the same array
// the sheet showed her — one home, and the vendor reads the words the bride saw.
// `openBandLabelFor` returns null rather than inventing when the floor matches
// no open band, and this falls back to plain money in that case.
function leadBudget(l: Lead): string {
  if (l.budget_total != null) return fmtRs(l.budget_total);
  const open = openBandLabelFor(l.budget_min ?? null);
  if (open) return open;
  return fmtRs(l.budget_total);
}
import { amountWordsAdjacent, phoneKey } from '@/lib/vendor/cabinet';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Lead } from '@/lib/vendor/types/vendor';
import type { CabinetBinder } from '@/lib/vendor/api/vendor';

// F-04.9 (founder-ruled 2026-07-15): every primer is a completable STEM in the
// tell_victor grammar — "About {name}: …" — mid-sentence, never a question.
// A question invites an answer; a stem invites the fact.
// M-LEADS-TRUTH · the meta line now leads with WHEN THE LEAD ARRIVED.
// Founder copy, approved 2026-08-22, frozen: '21 Aug' — day + short month, no
// year (fmtArrival, not fmtDate; the reason is at that function's home).
//
// WHY IT LEADS. F-16.21's wound was a vendor who could not tell that anything
// had arrived. `created_at` was on the wire and in the handler's mapper since
// TDW_04 and simply was never shown — the truth existed and had no surface.
// The wedding date keeps its place behind it: SliceRow joins these with ' · '
// and ellipsises from the right, so on the narrowest phone the row loses the
// wedding date before it loses the arrival, which is the correct order of
// sacrifice for a page whose question is "who came in, and when".
function leadMeta(l: Lead): string | undefined {
  const arrived = fmtArrival(l.created_at);
  const wedding = l.wedding_date ? fmtLeadDate(l.wedding_date, l.wedding_date_precision) : '';
  const parts = [arrived, wedding].filter(Boolean);
  return parts.length ? parts.join(' · ') : undefined;
}

// ── R2 · THE `ENQUIRED VIA TDW` ROW (founder copy, 2026-08-22, frozen) ──────
// LINKAGE-GATED: it is spread into the detail array only when `l.tdw` is true,
// so an unbadged lead grows no row at all rather than an em-dash. The gate is
// the SAME fact the badge reads — one linkage answer, two renders — and its
// banked meaning is "a Discover enquiry is on record" (CE-224 doctrine:
// leads.source names the DOOR, not the ORIGIN).
//
// IT SITS DIRECTLY UNDER `Arrived`, as ruled, and the two together are the
// point: 5 Aug is when this LEAD was born, 21 Aug is when the ENQUIRY came.
// F-16.22 was never a wrong number — it was a correct number about the wrong
// event, which invites no suspicion. Both dates read through fmtArrival, which
// is now IST-correct at the one home; `tdw_enquired_at` gets no third date path.
//
// DISPLAY-ONLY. F-04.7's fence holds: this is a read-row and no editor grows on
// it. The sheet's actions are untouched.
function baseRows(leads: Lead[]): Row[] {
  return leads.map(l => ({ id: l.id, primary: l.name??'Unknown', secondary: l.wedding_city??undefined, meta: leadMeta(l), badge: l.state, badgeAlert: l.state==='lost', phone: l.phone??undefined, redacted: l.redacted === true, budgetMin: l.budget_min ?? null, aiPrimer: `About ${l.name??'this enquiry'}: `, deletePrimer: `Delete the lead for ${l.name??'unknown'} (id: ${l.id}).`, draftMissing: l.draft?.missing, pipelineValue: l.budget_total ?? l.budget_min ?? 0, /* R-37.28: a floor is an "at least", and a masthead that counts the richest lead as zero is the same lie one level up. MIXED SEMANTIC, NAMED (F-06.85): this sum mixes ceilings with floors, so it is an ESTIMATE of pipeline value and not a bound in either direction — the alternative was excluding open-band leads entirely, which understates worse. If a per-band pipeline ever lands, THIS LINE IS ITS FIRST READER. */ tdw: l.tdw === true, detail: [{label:'State',value:l.state},{label:'Arrived',value:fmtArrival(l.created_at)||'—'},...(l.tdw === true ? [{label:'ENQUIRED VIA TDW',value:fmtArrival(l.tdw_enquired_at)||'—'}] : []),{label:'Wedding date',value:fmtLeadDate(l.wedding_date, l.wedding_date_precision)},{label:'City',value:l.wedding_city??'—'},{label:'Budget',value:leadBudget(l)},{label:'Source',value:l.source??'—'},{label:'Notes',value:l.notes??'—'}] })); // Notes: F-04.7 read-row (display-only, CE fence)
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
    const groups = [cab.data?.clients, cab.data?.leads];
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
