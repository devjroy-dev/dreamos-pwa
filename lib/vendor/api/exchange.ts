// lib/vendor/api/exchange.ts
// CE-42 · SEAT R7 · 4c-3b-1p — G5.3 THE INFLUENCER EXCHANGE, THE CLIENT.
//
// ⚠ ANSWERED 2026-09-10. These shapes were this half's PROPOSAL when the pwa landed
// first; dream-os 50781af (4c-3b-1s) implements every path and payload below, compared
// field by field before the flag was flipped. The paragraph that follows is kept as the
// record of how the two halves were sequenced, not as a live warning.
// The pwa lands FIRST (chair's split, 2026-09-10): dream-os 4c-3b-1s has no doors
// at `c5de470` and nothing here has ever been called. So this file is a CONTRACT
// OFFERED, and it says so rather than pretending to describe something live:
// 4c-3b-1s either implements these paths and payloads, or the rider that flips
// EXCHANGE_PREVIEW corrects this file in the same cut. What must NOT happen is a
// flag flip against a shape nobody compared.
//
// Every path is the caller's own side; auth is the vendor JWT that `_base` already
// carries. The role decides which half answers (shape ruling, 2026-09-10): a
// content_creator with the opt-in opens on her inbox and is not a sender.
//
// ⚠ NO MONEY ON THIS PLANE (master §7): no field here is a rupee and b76 greps for
// the words. ⚠ NO FOLLOWER IDENTITY: reach is aggregates, from a table
// (public.influencer_reach_snapshots, 0166 §3) that has no column for one.
import { getJson, postJson } from './_base';

export type ExchangeRole  = 'sender' | 'creator';
export type RequestState  = 'sent' | 'accepted' | 'declined' | 'withdrawn' | 'completed';
export type AskKind       = 'post' | 'reel' | 'story';

/** GET / — which glass opens, and whether she is listed. */
export interface ExchangeHome {
  ok:       boolean;
  role:     ExchangeRole;
  /** creator only; a sender reads null and the room never draws the row. */
  opted_in: boolean | null;
}

/** The reach snapshot as the card reads it. `verified` is the 30-day window
 *  (ruling (ii)) decided SERVER-SIDE — the room never does date arithmetic on a
 *  fact it did not measure. Null reach ⇒ the Pending badge. */
export interface ReachView {
  follower_count:  number;
  engagement_pct:  number;
  verified:        boolean;
  cities:          { city: string; pct: number }[];
  age:             { band: string; pct: number }[];
  gender:          { k: string; pct: number }[];
}

export interface CreatorRow {
  id:             string;
  business_name:  string;
  city:           string;
  /** her public Instagram handle; NOT a follower's. */
  handle:         string | null;
  reach:          ReachView | null;
}

/** One row of either list. `counterpart_name` is the OTHER side's business name —
 *  the sender's list reads the creator, the inbox reads the sender. One shape. */
export interface RequestRow {
  id:               string;
  counterpart_name: string;
  offer_kind:       string;
  offer_note:       string;
  ask_kind:         AskKind;
  ask_count:        number;
  date_from:        string;   // 'YYYY-MM-DD'
  date_to:          string;
  state:            RequestState;
}

export interface SendRequestBody {
  offer_kind:  string;
  offer_note:  string;
  ask_kind:    AskKind;
  ask_count:   number;
  date_from:   string;
  date_to:     string;
}

/** Every act answers this. A refusal is an ANSWER (the door's own byte), never a
 *  thrown thing the room invents a sentence for. */
export interface ActResult { ok: boolean; request?: RequestRow; error?: string; code?: string }

const ROOT = '/api/v2/vendor/exchange';

export function fetchExchangeHome(): Promise<ExchangeHome> {
  return getJson(ROOT);
}

export function fetchCreators(params: { city?: string; craft?: string } = {}):
  Promise<{ ok: boolean; creators: CreatorRow[] }> {
  const q = new URLSearchParams();
  if (params.city)  q.set('city', params.city);
  if (params.craft) q.set('craft', params.craft);
  const s = q.toString();
  return getJson(ROOT + '/creators' + (s ? '?' + s : ''));
}

export function fetchCreatorCard(id: string): Promise<{ ok: boolean; creator: CreatorRow }> {
  return getJson(ROOT + '/creators/' + encodeURIComponent(id));
}

export function sendRequest(creatorId: string, body: SendRequestBody): Promise<ActResult> {
  return postJson(ROOT + '/creators/' + encodeURIComponent(creatorId) + '/requests', body);
}

export function fetchMyRequests(): Promise<{ ok: boolean; requests: RequestRow[] }> {
  return getJson(ROOT + '/requests');
}

export function fetchInbox(): Promise<{ ok: boolean; requests: RequestRow[] }> {
  return getJson(ROOT + '/inbox');
}

// The four transitions. Each is the VERB, never a state the client names: a room
// that can post `{state:'accepted'}` is a room that can post `{state:'completed'}`
// on someone else's row. The door owns the machine (ruling (iii)).
export function withdrawRequest(id: string): Promise<ActResult> {
  return postJson(ROOT + '/requests/' + encodeURIComponent(id) + '/withdraw', {});
}
export function completeRequest(id: string): Promise<ActResult> {
  return postJson(ROOT + '/requests/' + encodeURIComponent(id) + '/complete', {});
}
export function acceptRequest(id: string): Promise<ActResult> {
  return postJson(ROOT + '/inbox/' + encodeURIComponent(id) + '/accept', {});
}
export function declineRequest(id: string): Promise<ActResult> {
  return postJson(ROOT + '/inbox/' + encodeURIComponent(id) + '/decline', {});
}
