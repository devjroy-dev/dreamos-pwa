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
// hub greeting, and every slice masthead — comes from HERE, off the
// cabinet payload the surfaces already fetch.
//
// TDW_07 MICRO-2: the CommandBar was a fourth consumer and is removed-by-founder-ruling
// ("delete completely. serves no purpose"). Struck from the list rather than left standing,
// because a census that names a deleted component teaches the next reader to look for it.
//
// The Invoices slice's own mapper
// (binderToInvoice in api/vendor.ts) feeds the same rows through the same
// arithmetic, so "outstanding" on the hub and "outstanding" on the Invoices
// page are the same number by construction, not by coincidence.
//
// LANE HONESTY (L-4's ruling, verbatim): money and invoice counts are
// BINDER-derived. "New Enquiries"/Letters stays TYPED (public.leads) — and
// says so on its own sub-line. This file never mixes the planes silently.

import type { CabinetResponse, CabinetBinder } from '@/lib/vendor/api/vendor';

import { istTodayISO, istPlusDaysISO } from './istDay';
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
// ── F-04.104 (CE-ruled 2026-07-22, TDW_04.5 P2 — a DISCLOSED LABELED RIDER) ──
// The canon and its mirror were declared "one rule, written twice" and had drifted
// by exactly one clause: cabinet.js:105 tested `explicit !== ''`, this function did
// not. An empty string therefore took DIFFERENT paths in the two repos — the mirror
// inferred from amount − received, the canon ran `Number('') || 0` and returned 0.
//
// ALIGNMENT DIRECTION, ruled by the estate's own law: "an unfiled cell means
// unfiled, not Rs 0." An empty string IS unfiled, so it must fall through to the
// inference — cabinet.js's semantic. The canon moves to the mirror, not the reverse.
//
// WHY IT RODE THIS SITTING: P2's band-view money whisper imports THIS function.
// Shipping a new consumer onto a rule with a known divergence is wiring a convicted
// class knowingly; the one-clause rider is cheaper than the finding it prevents.
// TYPE-ONLY WIDENING, disclosed (TDW_04.5 P2, an inescapable consequence of CE ruling
// F2(b), not scope creep): the band view must apply THIS canon to the four raw cells the
// bands endpoint ships, and those cells are not a whole CabinetBinder. The rule has only
// ever READ these four fields — the signature now says so. `CabinetBinder` is structurally
// assignable to `MoneyCells`, so every existing call site is untouched and unchanged.
// ZERO runtime bytes change here; the only runtime delta in this function is F-04.104's clause.
export interface MoneyCells {
  direction:       string | null | undefined;
  amount:          number | string | null | undefined;
  amount_received: number | string | null | undefined;
  amount_pending:  number | string | null | undefined;
}
export function pendingOf(b: MoneyCells): number {
  if ((b.direction ?? 'in').toLowerCase() === 'out') return 0;
  const explicit = b.amount_pending;
  if (explicit !== null && explicit !== undefined && (explicit as unknown) !== '') {
    return Math.max(Number(explicit) || 0, 0);
  }
  return Math.max((Number(b.amount) || 0) - (Number(b.amount_received) || 0), 0);
}

// P7.2 (CE-39, 2026-09-04) — `MoneyDerivation`, `moneyBinders` and `deriveMoney` RETIRED.
// They read the engine cabinet's `paid`/`owed` slices; FORK 4 dropped those from
// `CabinetResponse` (their readers were the shell's leads/events bodies and the invoices
// masthead, cured at the shell), and `tsc` at this tip named `moneyBinders` as the last
// reader of the two columns. The invoices figure now comes from the typed read's
// `summary.total_outstanding` (money.js, OUTSTANDING_STATES — the one rule). `pendingOf`
// STAYS: CalendarBands reads it (F-04.13's rule), unchanged.

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
  // P7.2 (FORK 6): the week's two edges are IST days from the one home; the old form
  // zeroed the local clock and then sliced the UTC string, which is a third answer.
  const t = istTodayISO(), e = istPlusDaysISO(7);
  const rows = (events ?? []).filter(ev => {
    const d = ev.event_date ?? '';
    return d >= t && d <= e && (ev.state ?? 'upcoming') === 'upcoming';
  });
  return { count: rows.length };
}
