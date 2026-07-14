// lib/vendor/cabinet.ts — TDW_03 P2
// The SHARED cabinet pieces (spec §P2: "extract shared pieces into
// lib/vendor/cabinet.ts rather than duplicating"). Two consumers, one truth:
// components/vendor/Cabinet.tsx (the Hub's Books sheet) and the Clients slice
// binder cards. Money math + tone words here; JSX stays with its surfaces.
// Pure functions only — the native clause rides free.

import type { CabinetBinder } from '@/lib/vendor/api/vendor';

// ── money (moved VERBATIM from Cabinet.tsx) ─────────────────────
export function fmtINR(n: number | null | undefined): string {
  if (n == null) return '—';
  return 'Rs ' + Math.round(n).toLocaleString('en-IN');
}
export function primaryAmount(r: CabinetBinder): number | null {
  if (r.amount != null) return r.amount;
  if (r.amount_pending != null) return r.amount_pending;
  if (r.amount_received != null) return r.amount_received;
  return null;
}

// money state for a binder: received / pending / paid|partial|owed
export type MoneyState = 'paid' | 'partial' | 'owed' | null;
export function moneyOf(r: CabinetBinder): { recv: number; pend: number; state: MoneyState } {
  const recv = r.amount_received ?? 0;
  const pend = r.amount_pending != null
    ? Math.max(r.amount_pending, 0)
    : Math.max((r.amount ?? 0) - recv, 0);
  let state: MoneyState = null;
  if (recv > 0 && pend <= 0) state = 'paid';
  else if (recv > 0 && pend > 0) state = 'partial';
  else if (pend > 0) state = 'owed';
  return { recv, pend, state };
}
export const BADGE: Record<'paid' | 'partial' | 'owed', { label: string; color: string }> = {
  paid:    { label: 'Paid',    color: '#3E8B4A' },
  partial: { label: 'Partial', color: 'var(--cab-accent, #C99A63)' },
  owed:    { label: 'Owed',    color: '#C0563B' },
};

// ── P2 additions (binder cards) ─────────────────────────────────

// Words-adjacent rupees per the card anatomy: ₹2.5L, ₹90k, ₹1.2Cr, ₹850.
export function amountWordsAdjacent(n: number | null | undefined): string {
  if (n == null) return '₹—';
  const abs = Math.abs(n);
  const trim = (v: number) => {
    const one = Math.round(v * 10) / 10;
    return Number.isInteger(one) ? String(one) : one.toFixed(1);
  };
  if (abs >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)}Cr`;
  if (abs >= 1_00_000)    return `₹${trim(n / 1_00_000)}L`;
  if (abs >= 1_000)       return `₹${trim(n / 1_000)}k`;
  return `₹${Math.round(n)}`;
}

// Relative last-touched for the card's third line.
export function relativeTouch(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// Manifest tone for the stage word (spec: warm/go/cool). P2 constant —
// the 02 rule "missing cells render cool unless a stronger word stands"
// (recordCompleteness/CE-16 lineage), money-complete stories render go,
// everything else warm. One place; amend HERE.
export type StageTone = 'warm' | 'go' | 'cool';
export function stageTone(r: CabinetBinder): StageTone {
  if (moneyOf(r).state === 'paid') return 'go';
  if ((r.missing_cells ?? []).length > 0) return 'cool';
  return 'warm';
}

// The story timeline: the growing note parsed by its accumulation breaks —
// appends join with a single '\n' (verified in writeFields, dream-os
// recordPrimitives). Money-edit confessions are sentences INSIDE the note
// (donna_money's contract) and render verbatim as entries. Newest last,
// as the raw string accumulates.
export function noteTimeline(note: string | null | undefined): string[] {
  if (!note) return [];
  return note.split('\n').map((l) => l.trim()).filter(Boolean);
}
