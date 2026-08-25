// lib/frost/budgetBands.ts
// ─────────────────────────────────────────────────────────────────────────────
// TDW_07 P5 — F-07.34 CURED · THE BUDGET BANDS, ONE HOME.
//
// ── THE DISEASE ──────────────────────────────────────────────────────────────
// This list lived as THREE byte-identical copies:
//   app/demodiscover/page.tsx:50                      const BUDGET_OPTIONS
//   app/(frost)/frost/canvas/discover/page.tsx:64     const BUDGET_OPTIONS
//   app/(frost)/frost/canvas/sanctuary/page.tsx:1110  const DISC_BUDGETS
// and every copy carried the FORBIDDEN money register — `Under Rs 1L`,
// `Rs 1L – 3L`, `Rs 3L – 5L`, `Rs 5L – 10L`, `Rs 10L+`. The register law admits
// grouped `Rs X,XX,XXX` and forbids the ₹ glyph and the k/L/Cr short forms.
// F-07.16 cured every RENDERING site of that law at the P4 arc; these five
// labels are literals in a filter list, so they survived the sweep — the last
// L-forms on the couple plane, named at CE-116 and chartered as P5's opening
// rider.
//
// Three copies is also why they were still wrong: a register cure that has to
// find three homes finds two.
//
// ── THE VALUES ARE UNTOUCHED — ZERO FILTER LOSS ─────────────────────────────
// Each `value` is the upper bound in whole rupees, passed verbatim to
// GET /api/v2/discover/feed?budget=… and read there as `budget_max`. The empty
// string on the top band means "no ceiling" and is the shape the feed already
// expects. NOT ONE of these strings changes. The cure is the LABEL and the
// number of homes; anything else would be a filter change wearing a register
// cure's clothes.
//
// ── THE LABELS ARE FOUNDER-VETOED, BYTE-EXACT ───────────────────────────────
// Executed in-chat 2026-07-31 per the veto-slot law (protocol §10.6), current
// and proposed side by side, discharged 「 perfect 」. These are those bytes. A
// change here needs a new veto, not a judgement call.

// ── F-16.25 · THE FLOOR JOINS (R-37.21 Fork A · R-37.25) ────────────────────
// EVERY BAND HAD A CEILING AND NONE HAD A FLOOR, and the top band is a FLOOR
// WITH NO CEILING. So `Rs 10,00,000+` posted `value: ''`, the door's
// `bandCeiling` correctly returned null — there is no ceiling to record — and
// the richest bride on the feed was stored identically to a bride who answered
// nothing. Her card read `Rs —`.
//
// THE FLOOR WAS ALWAYS HERE AND WAS NEVER DATA: it is the PREVIOUS band's
// ceiling. R-37.25 refused deriving it that way in the executor's own words —
// this array is a thing people edit, and a reorder would silently shift every
// floor while every label went on reading correctly. So the floor becomes an
// explicit field: one home, survives reordering, fails loudly if a band is added
// without one because the type demands it.
//
// NOT ONE LABEL BYTE MOVES. The labels are founder-vetoed (2026-07-31,
// 「 perfect 」) and a change here needs a new veto. This adds a number; it
// renames nothing and re-registers nothing.
export interface BudgetBand {
  /** The couple-facing label. Founder-vetoed; full register; never abbreviated. */
  label: string;
  /** Upper bound in whole rupees, or '' for the open-ended top band. */
  value: string;
  /**
   * Lower bound in whole rupees, or '' for the bottom band — which is a ceiling
   * with no floor, exactly as the top band is a floor with no ceiling. The two
   * ends of this list are mirror images and both are honest.
   *
   * Posted to the enquiry door as `budget_floor` and parsed there by `bandFloor`
   * (dream-os src/lib/discover/enquiryFields.js) onto `public.leads.budget_min`.
   */
  floor: string;
}

export const BUDGET_BANDS: readonly BudgetBand[] = [
  { label: 'Under Rs 1,00,000',        value: '100000',  floor: ''        },
  { label: 'Rs 1,00,000 – 3,00,000',   value: '300000',  floor: '100000'  },
  { label: 'Rs 3,00,000 – 5,00,000',   value: '500000',  floor: '300000'  },
  { label: 'Rs 5,00,000 – 10,00,000',  value: '1000000', floor: '500000'  },
  { label: 'Rs 10,00,000+',            value: '',        floor: '1000000' },
] as const;

/**
 * The label for a band value, for surfaces that hold a value and must show a
 * word — the enquiry sheet's prefilled budget row is the first caller.
 * Returns null for an unknown value rather than inventing a label, because a
 * band we cannot name is a band we must not display.
 */
export function bandLabelFor(value: string | null | undefined): string | null {
  if (value == null) return null;
  const hit = BUDGET_BANDS.find((b) => b.value === value);
  return hit ? hit.label : null;
}

/**
 * The band whose ceiling first covers a whole-rupee amount — used to prefill the
 * sheet from `couples.budget_total`. The top band has no ceiling and therefore
 * catches everything above the last bounded band.
 */
export function bandForAmount(amount: number | null | undefined): BudgetBand | null {
  if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) return null;
  for (const b of BUDGET_BANDS) {
    if (b.value === '') return b;
    if (amount <= Number(b.value)) return b;
  }
  return null;
}

/**
 * The label for an OPEN-ENDED band identified by its floor — the vendor card's
 * caller (F-16.25).
 *
 * A lead carrying `budget_min` with a NULL ceiling is the top-band answer, and
 * this turns that pair back into the words the bride actually chose. It matches
 * ONLY bands that are genuinely open (`value === ''`), so a bounded band's floor
 * can never borrow an open band's label, and it returns null rather than
 * inventing — a band we cannot name is a band we must not display, which is
 * `bandLabelFor`'s own rule and this function inherits it deliberately.
 */
export function openBandLabelFor(floor: number | null | undefined): string | null {
  if (typeof floor !== 'number' || !isFinite(floor) || floor <= 0) return null;
  const hit = BUDGET_BANDS.find((b) => b.value === '' && b.floor === String(floor));
  return hit ? hit.label : null;
}
