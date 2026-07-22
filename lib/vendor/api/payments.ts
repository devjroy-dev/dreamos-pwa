// lib/vendor/api/payments.ts
// TDW_04.5 · P5 — the money loop's client.
//
// THREE READS, ZERO WRITES. The loop's only write is `logPayment`, which already
// lived in lib/vendor/api/vendor.ts and already TYPED `linked_event_id` and
// `notes` — the server has accepted them since the route was born and no caller
// ever sent them. P5 sends them. Nothing was widened to make that possible.
import { getJson } from './_base';

/** One payout line, as the By-wedding board renders it. */
export interface WeddingPayment {
  id:              string;
  team_member_id:  string;
  member_name:     string | null;
  amount_inr:      number;
  state:           'owed' | 'paid';
  description:     string | null;
  notes:           string | null;
  linked_event_id: string | null;
  event_title:     string | null;
  event_date:      string | null;
  /** 'cancelled' is lawful here — a cancelled function's crew is still owed. */
  event_state:     string | null;
  paid_at:         string | null;
  paid_via:        string | null;
  created_at:      string;
}

export interface WeddingGroup {
  binder_id: string;
  /** null when the binder cannot be named — the screen says "Untitled wedding". */
  title:     string | null;
  payments:  WeddingPayment[];
  owed_inr:  number;
  paid_inr:  number;
}

export interface ByWeddingResponse {
  ok:        boolean;
  weddings:  WeddingGroup[];
  /** Not an error state. Three lawful roads lead here; see the route's comment. */
  loose:     { payments: WeddingPayment[]; owed_inr: number; paid_inr: number };
  total_owed_inr: number;
  total_paid_inr: number;
}

/** A function the vendor may attach money to. Cancelled ones are NOT offered. */
export interface PayableFunction {
  event_id:      string;
  title:         string;
  event_date:    string;
  slot:          string | null;
  kind:          string;
  binder_id:     string | null;
  wedding_title: string | null;
}

export interface SuggestionResponse {
  ok:         boolean;
  suggestion: { rate_inr: number; functions: number; amount_inr: number } | null;
  /** NAMED absence, never a zero: no_rate · no_wedding · not_assigned. */
  reason:     'no_rate' | 'no_wedding' | 'not_assigned' | null;
}

export function fetchPaymentsByWedding() {
  return getJson<ByWeddingResponse>('/api/v2/vendor/studio/team-payments/by-wedding');
}

export function fetchPayableFunctions() {
  return getJson<{ ok: boolean; functions: PayableFunction[]; truncated: boolean }>(
    '/api/v2/vendor/studio/team-payments/functions'
  );
}

/**
 * The auto-suggest. Asked only when a function is picked — a suggestion with no
 * wedding behind it is a naked number, so the route refuses to produce one and
 * this client does not ask for one.
 */
export function fetchPaymentSuggestion(teamMemberId: string, linkedEventId: string) {
  const qs = new URLSearchParams({ team_member_id: teamMemberId, linked_event_id: linkedEventId });
  return getJson<SuggestionResponse>('/api/v2/vendor/studio/team-payments/suggest?' + qs.toString());
}
