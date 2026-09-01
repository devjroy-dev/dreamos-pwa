// lib/vendor/types/common.ts
// Shared enum union types — single source of truth for state/kind values.
// Mirrors the Supabase schema (BLOCK 13, DEVS_HOLY_GRAIL.md).

export type LeadState = 'new' | 'contacted' | 'quoted' | 'booked' | 'lost';

export type InvoiceState = 'unpaid' | 'advance_paid' | 'paid' | 'cancelled';

export type EventKind =
  | 'shoot'
  | 'call'
  | 'meeting'
  | 'task'
  | 'reminder'
  | 'recce'
  | 'fitting'
  | 'trial'
  | 'family'
  | 'ceremony'
  | 'social'
  | 'other';

export type EventState = 'upcoming' | 'done' | 'cancelled';

// ─────────────────────────────────────────────────────────────────────────────
// THE MIRROR — NOT A HOME. (CE-39 writer-hygiene, ruling 1.)
//
// THE AUTHORED HOME IS dream-os `src/lib/vendor/expenses.js` → ALLOWED_CATEGORIES,
// which itself mirrors the database's `expenses_category_check`. This file is a
// COPY, held byte-equal to that array — same tokens, same order — by a bench cell
// (`scripts/b40_worklist_shell_bench.js` §C84) that reads the dream-os sibling and
// REFUSES rather than passes when the sibling is absent.
//
// THE TWO REPOS DEPLOY SEPARATELY AND SHARE NO PACKAGE, so this cannot be an
// import. A runtime `GET /categories` door was proposed and REFUSED at the chair:
// runtime coupling on a picker, for a list that only ever changes by migration.
// The copy is the honest shape; the cell is what keeps it honest.
//
// ⚠ DO NOT EDIT THIS LIST HERE. Editing it here changes nothing the server will
// accept — it only moves where the vendor is refused, and moves it to the place
// where the refusal is least legible. Change the CHECK by migration, then the
// home, then this mirror, then re-run the cell.
//
// WHAT THIS FILE'S HEADER USED TO SAY: "single source of truth for state/kind
// values." It was not one, and this list is the proof — it carried `supplies`,
// a token NO layer of the estate has ever accepted, and offered it in the
// vendor's picker; it carried `commission`, which the database accepts and the
// server was refusing; and it lacked `shoot` and `inventory` entirely. Four
// lists disagreed across two repos. F-2c.p1, cured at CE-39.
//
// LABELS ARE NOT TOKENS. The picker title-cases these at the point of display.
// ─────────────────────────────────────────────────────────────────────────────
export type ExpenseCategory =
  | 'travel'
  | 'equipment'
  | 'assistant'
  | 'studio'
  | 'marketing'
  | 'software'
  | 'food'
  | 'printing'
  | 'commission'
  | 'shoot'
  | 'inventory'
  | 'other';

/**
 * The mirror as a VALUE, in the CHECK's own order — the picker's option order is
 * this order (founder, 2026-09-01). The type above and this array are one list
 * stated twice because TypeScript unions do not survive to runtime; the cell
 * asserts them equal to each other and to the home, so neither can drift alone.
 */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'travel', 'equipment', 'assistant', 'studio',
  'marketing', 'software', 'food', 'printing',
  'commission', 'shoot', 'inventory', 'other',
] as const;
