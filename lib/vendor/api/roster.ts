// lib/vendor/api/roster.ts
// TDW_04.5 · P4 — the roster plane's client, and Appendix A's one map.
import { getJson, postJson } from './_base';

export interface RosterEntry {
  id:               string;
  owner_vendor_id:  string;
  member_vendor_id: string | null;
  name:             string;
  phone:            string | null;
  category:         string | null;
  source:           'collab_accepted' | 'manual';
  created_at?:      string;
  /** D1 — this entry already has a team_members identity. The server decides
   *  this (one read for the page); the row never infers it. Deactivated bridge
   *  rows count as bridged: ensureBridgeMember REVIVES rather than re-mints. */
  bridged?:         boolean;
}

export interface BridgeMember {
  id:               string;
  vendor_id:        string;
  name:             string;
  role:             string;
  phone:            string | null;
  active:           boolean;
  page_token:       string;
  roster_vendor_id: string | null;
}

export function fetchRoster(): Promise<{ ok: boolean; roster: RosterEntry[]; count: number }> {
  return getJson('/api/v2/vendor/roster');
}

// The 409 duplicate case is NOT an exception here — it is an answer. The caller
// shows the founder's words; it does not invent its own.
export interface AddRosterResult {
  ok:      boolean;
  entry?:  RosterEntry;
  error?:  string;
  message?: string;
}

export async function addRosterEntry(body: { name: string; phone: string; category?: string }):
  Promise<AddRosterResult> {
  try {
    return await postJson('/api/v2/vendor/roster', body);
  } catch (err) {
    const message = (err as { message?: string })?.message;
    return { ok: false, error: 'request_failed', message };
  }
}

/** Mint-or-return the external's team_members row. Idempotent by construction. */
export function bridgeRosterEntry(rosterId: string): Promise<{ ok: boolean; member: BridgeMember; created: boolean }> {
  return postJson(`/api/v2/vendor/roster/${rosterId}/bridge`, {});
}

// ── Appendix A (spec :107) — function kind → requirement_type ────────────────
// The pip's prefill. Mirrors src/lib/vendor/collabItems.js's KIND_TO_REQUIREMENT
// exactly; a string prefills one chip, an array means ASK (two-chip choice), and
// null means prefill NOTHING rather than guess.
export const KIND_TO_REQUIREMENT: Record<string, string | string[] | null> = {
  shoot:    'photography',
  ceremony: 'planning',
  fitting:  ['makeup', 'attire'],
  trial:    ['makeup', 'attire'],
  recce:    'venue',
  social:   'music_dj',
  other:    null,
  blocked:  null,
};

/** Unknown kinds prefill nothing. A wrong prefill is worse than none. */
export function requirementForKind(kind: string | null | undefined): string | null {
  if (!kind) return null;
  const hit = KIND_TO_REQUIREMENT[String(kind).toLowerCase()];
  // The two-chip ASK deliberately prefills nothing — the composer opens with
  // both chips available and the vendor picks. Guessing "makeup" for a fitting
  // that was about attire is exactly the guess Appendix A refuses to make.
  return typeof hit === 'string' ? hit : null;
}

// ── TDW_04.5 P4 — the owner's view of one member's board ────────────────────
export interface MemberAssignment {
  event_id:     string;
  date:         string;
  slot:         string | null;
  title:        string;
  wedding:      string | null;
  call_time:    string | null;
  confirmation: 'pending' | 'confirmed' | 'declined';
  /** crew_confirmations.note ONLY (F7). Founder-vetoed to show: a decline
   *  without its reason just sends the owner hunting. */
  note:         string | null;
}

export function fetchMemberAssignments(memberId: string):
  Promise<{ ok: boolean; assignments: MemberAssignment[] }> {
  return getJson(`/api/v2/vendor/studio/team/${memberId}/assignments`);
}
