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

export interface BudgetBand {
  /** The couple-facing label. Founder-vetoed; full register; never abbreviated. */
  label: string;
  /** Upper bound in whole rupees, or '' for the open-ended top band. */
  value: string;
}

export const BUDGET_BANDS: readonly BudgetBand[] = [
  { label: 'Under Rs 1,00,000',        value: '100000'  },
  { label: 'Rs 1,00,000 – 3,00,000',   value: '300000'  },
  { label: 'Rs 3,00,000 – 5,00,000',   value: '500000'  },
  { label: 'Rs 5,00,000 – 10,00,000',  value: '1000000' },
  { label: 'Rs 10,00,000+',            value: ''        },
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
