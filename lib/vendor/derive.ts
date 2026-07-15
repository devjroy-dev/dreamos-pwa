'use client';
// lib/vendor/derive.ts — TDW_04 A3 (ST-4/L-4): ONE DERIVATION, TWO RENDERERS.
//
// The audit's verdict (d): the chat masthead and the Invoices page disagreed
// because they read different planes — the hub totalled `public.invoices`
// (the stale typed rows, phantoms included) while the Invoices page derived
// from binders (engine.records via the cabinet). Two derivations cannot agree
// by luck; they can only agree by being one function.
//
// This is that function. Every money/count figure the vendor sees — hub Ledger,
// hub greeting, CommandBar, and every slice masthead — comes from HERE, off the
// cabinet payload the surfaces already fetch. The Invoices slice's own mapper
// (binderToInvoice in api/vendor.ts) feeds the same rows through the same
// arithmetic, so "outstanding" on the hub and "outstanding" on the Invoices
// page are the same number by construction, not by coincidence.
//
// LANE HONESTY (L-4's ruling, verbatim): money and invoice counts are
// BINDER-derived. "New Enquiries"/Letters stays TYPED (public.leads) — and
// says so on its own sub-line. This file never mixes the planes silently.

import type { CabinetResponse, CabinetBinder } from '@/lib/vendor/api/vendor';

// ── F-04.13 (CE-RATIFIED 2026-07-15) — THE money rule, and its only home ──
//
//   pending = amount_pending ?? max(amount - amount_received, 0)   [direction 'in' only]
//
// This function is the CANON. src/api/vendor-engine/cabinet.js carries a mirror
// (different repo, same rule); nothing else may compute "owed" by any other
// means. Every renderer is a consumer.
//
// WHY (the founder's phone proved it): money filed through Victor's donna_money
// door writes `amount` and never touches the settlement cells — only money-edit
// writes those. The old predicate read an UNFILED cell as ZERO OWED, hiding
// Rs 85,000 across two unpaid clients who appeared on no money surface at all,
// while the cabinet drawer — which inferred — showed the truth. The CE's
// ruling: an unfiled cell means unfiled, not Rs 0. An explicit cell still wins:
// a binder filed as settled (pending 0) stays settled.
//
// The direction guard is load-bearing: without it an expense binder (direction
// 'out', amount 5000, no cells) would infer Rs 5,000 "owed" and invent debt.
export function pendingOf(b: CabinetBinder): number {
  if ((b.direction ?? 'in').toLowerCase() === 'out') return 0;
  const explicit = b.amount_pending;
  if (explicit !== null && explicit !== undefined) {
    return Math.max(Number(explicit) || 0, 0);
  }
  return Math.max((Number(b.amount) || 0) - (Number(b.amount_received) || 0), 0);
}

export type MoneyDerivation = {
  /** Σ amount_pending across binders that owe — the vendor's outstanding. */
  outstanding: number;
  /** Σ amount_received across the same money binders — what's landed. */
  received: number;
  /** How many binders carry an unsettled balance (the "invoices" a vendor means). */
  owedCount: number;
  /** Of those, how many have taken an advance (part-paid) vs nothing at all. */
  advanceCount: number;
  unpaidCount: number;
  /** Every money binder, newest first — the rows a list renders. */
  rows: CabinetBinder[];
};

/** Money binders = the cabinet's paid + owed columns, deduped by id (a binder
    can legitimately appear in both when partly settled). Mirrors fetchInvoices'
    own composition exactly — same source, same de-dupe, same order. */
export function moneyBinders(cab: CabinetResponse | null | undefined): CabinetBinder[] {
  const byId = new Map<string, CabinetBinder>();
  for (const b of [...(cab?.paid ?? []), ...(cab?.owed ?? [])]) byId.set(b.id, b);
  return [...byId.values()];
}

export function deriveMoney(cab: CabinetResponse | null | undefined): MoneyDerivation {
  const rows = moneyBinders(cab);
  let outstanding = 0, received = 0, owedCount = 0, advanceCount = 0, unpaidCount = 0;
  for (const b of rows) {
    const owed = pendingOf(b); // F-04.13: the ruled rule, never the raw cell
    const recv = Number(b.amount_received) || 0;
    received += recv;
    if (owed > 0) {
      outstanding += owed;
      owedCount += 1;
      if (recv > 0) advanceCount += 1; else unpaidCount += 1;
    }
  }
  return { outstanding, received, owedCount, advanceCount, unpaidCount, rows };
}

/** Clients masthead: active engagements = non-hidden client-stage binders.
    The stage vocabulary mirrors the backend's CLIENT_STAGE_WORDS (cabinet.js /
    today.js) — one grammar for who counts as a client, wherever it's counted. */
export const CLIENT_STAGE_WORDS = ['client', 'booked', 'confirmed', 'signed', 'advance', 'paid'];
export function isClientStage(b: CabinetBinder): boolean {
  const s = (b.stage ?? '').toLowerCase();
  return CLIENT_STAGE_WORDS.some(w => s.includes(w));
}
export function deriveClients(cab: CabinetResponse | null | undefined): { count: number } {
  return { count: (cab?.clients ?? []).length };
}

/** Leads masthead: pipeline value = Σ budget_max over OPEN states. Typed plane
    by ruling (L-4) — enquiries are typed rows and the surface says so. */
const OPEN_LEAD_STATES = ['new', 'contacted', 'quoted'];
export function derivePipeline(leads: Array<{ state?: string | null; budget_total?: number | null }> | null | undefined): { value: number; count: number } {
  const open = (leads ?? []).filter(l => OPEN_LEAD_STATES.includes((l.state ?? '').toLowerCase()));
  return { value: open.reduce((s, l) => s + (Number(l.budget_total) || 0), 0), count: open.length };
}

/** Expenses masthead: this calendar month's spend, from the expense rows the
    slice already holds. */
export function deriveExpensesThisMonth(expenses: Array<{ amount?: number | null; expense_date?: string | null }> | null | undefined): { total: number; count: number } {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rows = (expenses ?? []).filter(e => (e.expense_date ?? '').startsWith(prefix));
  return { total: rows.reduce((s, e) => s + (Number(e.amount) || 0), 0), count: rows.length };
}

/** Events masthead: how many events fall inside the next 7 days (inclusive of
    today), counted off the rows the slice already holds. */
export function deriveEventsThisWeek(events: Array<{ event_date?: string | null; state?: string | null }> | null | undefined): { count: number } {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(today.getTime() + 7 * 86_400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const t = iso(today), e = iso(end);
  const rows = (events ?? []).filter(ev => {
    const d = ev.event_date ?? '';
    return d >= t && d <= e && (ev.state ?? 'upcoming') === 'upcoming';
  });
  return { count: rows.length };
}
