// lib/vendor/bookingNeeds.ts — CE-43 · LC-2 · packet 3g · what an act needs that the lead lacks.
//
// Ruled (CE-43, 3g item 1 as corrected on the founder's word): Confirm booking, Advance paid and
// Attach package are never disabled. On tap, if the lead lacks what the act needs, NO request is
// sent: a toast states what is missing and the sheet shows those chips at its top, each tappable to
// its own cell (R-43.16). After she fills them she taps the same button again and it proceeds. The
// server's refusals stay as the last guard only.
//
// The needs mirror the server exactly (dream-os at 3e0b085):
//   · booking (src/lib/vendor/promotion.js): an attached package (`no_package`) with a fee above
//     zero (`no_fee`). A lead with no package must first attach one, and the attach needs an exact
//     wedding date, so a booking with no package also lacks the date when the lead has none.
//   · attach (src/lib/vendor/packageSchedule.js computeSchedule): a fee above zero (`no_fee`); a
//     wedding date at day precision, where a null precision on a dated row reads as day
//     (`no_wedding_date`); a handover date on a handover package (`no_handover_date`).
// An unknown state (a read still out) yields no needs: the act proceeds and the server decides.
//
// Pure: no React, no network. b82 §14 drives it.

export type NeedCell = 'wedding_date' | 'package' | 'fee' | 'handover';

export interface LeadFacts {
  wedding_date: string | null | undefined;
  wedding_date_precision: 'day' | 'month' | 'year' | null | undefined;
}

const isDateKey = (s: unknown): boolean => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.slice(0, 10)) && s.length >= 10;

/** The lead's wedding date is exact enough for a schedule (the server's F24 rule). */
export function hasExactDate(lead: LeadFacts | null | undefined): boolean | null {
  if (!lead) return null;
  const precision = lead.wedding_date_precision == null ? 'day' : lead.wedding_date_precision;
  return isDateKey(lead.wedding_date) && precision === 'day';
}

/** What a booking lacks. `lp`: undefined while its read is out, null when none is attached. */
export function bookingNeeds(lp: { total: number | null } | null | undefined, lead: LeadFacts | null | undefined): NeedCell[] {
  if (lp === undefined) return [];
  if (lp === null) {
    const out: NeedCell[] = [];
    if (hasExactDate(lead) === false) out.push('wedding_date');
    out.push('package');
    return out;
  }
  return Number.isInteger(lp.total) && (lp.total as number) > 0 ? [] : ['fee'];
}

/** What an attach lacks, from the sheet's own fields and the lead. */
export function attachNeeds(input: {
  chosen: { delivery_basis: string } | null;
  fee: number | null;
  handover: string;
  lead: LeadFacts | null | undefined;
}): NeedCell[] {
  const out: NeedCell[] = [];
  if (hasExactDate(input.lead) === false) out.push('wedding_date');
  if (!input.chosen) { out.push('package'); return out; }
  if (!(Number.isInteger(input.fee) && (input.fee as number) > 0)) out.push('fee');
  if (input.chosen.delivery_basis === 'handover' && !isDateKey(input.handover)) out.push('handover');
  return out;
}
