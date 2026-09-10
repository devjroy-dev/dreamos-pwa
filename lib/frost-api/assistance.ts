// lib/frost-api/assistance.ts — BLOCK 20 · CONCIERGE s1 · the couple's API client.
// POST /api/v2/couple/assistance (dream-os src/api/couple/assistance.js @ 1feb1cc).
// Read the handler before writing this (protocol §6): body is
//   { city?, area?, wedding_date?, brief?, items: [{ category, budget_rs }] }
// and the door reads her phone from the session, never from the body.
// Framework-agnostic (native-implications clause): fetch + JSON, no window.

import { apiGet, apiPost, USE_MOCKS, isBrideDemoMode, mockDelay } from './_base';

export type AssistCategory =
  | 'planning' | 'designer' | 'photography' | 'makeup' | 'hairstylist' | 'jewellery'
  | 'decor' | 'venue_catering' | 'performer' | 'content_creator' | 'other';

export interface AssistItemInput { category: AssistCategory; budget_rs: number | null }

export interface AssistRequestBody {
  city?: string | null;
  area?: string | null;
  wedding_date?: string | null;
  brief?: string | null;
  items: AssistItemInput[];
}

export interface AssistRequestResponse {
  ok: true;
  request_id: string;
  items: { id: string; category: AssistCategory; budget_rs: number | null }[];
  message: string;
  admin_notified: boolean;
  admin_notify_refusal: string | null;
}

// The sheet's rows, in the veto-sheet's order (#14, R-41.27: mehendi rides `other`).
// Plain words are the couple's; the token is the estate's (src/agent/categories.js).
export const ASSIST_ROWS: { category: AssistCategory; label: string }[] = [
  { category: 'photography',     label: 'Photography' },
  { category: 'makeup',          label: 'Makeup' },
  { category: 'decor',           label: 'Décor' },
  { category: 'planning',        label: 'Planning' },
  { category: 'venue_catering',  label: 'Venue & catering' },
  { category: 'hairstylist',     label: 'Hair' },
  { category: 'designer',        label: 'Outfits' },
  { category: 'other',           label: 'Mehendi & anything else' },
  { category: 'jewellery',       label: 'Jewellery' },
  { category: 'performer',       label: 'Music & anchors' },
  { category: 'content_creator', label: 'Content' },
];

function mockSubmit(body: AssistRequestBody) {
  return mockDelay({
    ok: true as const, request_id: 'mock-request', message: 'Sent. We’re on it.',
    items: body.items.map((i, k) => ({ id: `mock-item-${k}`, category: i.category, budget_rs: i.budget_rs })),
    admin_notified: false, admin_notify_refusal: 'mock',
  }, 600);
}

export async function submitAssistanceRequest(body: AssistRequestBody): Promise<AssistRequestResponse> {
  if (USE_MOCKS || isBrideDemoMode()) return mockSubmit(body);
  return apiPost<AssistRequestResponse>('/api/v2/couple/assistance', body);
}

// ── THE SECOND DOOR · R-41.94 (D5 ruling ii) ────────────────────────────────
// POST /api/v2/couple/assistance/public (dream-os src/api/couple/assistance.js:128
// @ 6164472). The SAME body type, deliberately: `AssistRequestBody` gained no
// `origin` field and never will. `origin` is a provenance fact chosen by the route
// that was matched, on the server, because a body field would let any signed-in
// bride label her own request `public`.
//
// BOTH DOORS SIT UNDER requireCoupleAuth. This one is not an anonymous mount — by
// the time /plan calls it the caller has been through the bride-line OTP and holds
// a session, so `getAuthHeader()` finds the token `persistSession` just wrote and
// her couple_id comes from the session, never from a phone in the body.
export async function submitPublicAssistanceRequest(body: AssistRequestBody): Promise<AssistRequestResponse> {
  if (USE_MOCKS || isBrideDemoMode()) return mockSubmit(body);
  return apiPost<AssistRequestResponse>('/api/v2/couple/assistance/public', body);
}

// F-41.29 · her own read: GET /api/v2/couple/assistance (dream-os 534059f,
// getLatestAssistanceForCouple). `request: null` when she has none. TDW vendors
// found are named; outsiders are a count, unnamed until they join (§6.3).
export interface AssistFound { business_name: string | null; routing_handle: string | null }
export interface AssistMineItem { id: string; category: AssistCategory; budget_rs: number | null; found: AssistFound[]; outsiders_asked: number }
export interface AssistMine {
  ok: true;
  request: { id: string; status: 'open' | 'forwarded' | 'closed'; city: string | null; area: string | null; wedding_date: string | null; brief: string | null; created_at: string } | null;
  items: AssistMineItem[];
}

export async function fetchMyAssistance(): Promise<AssistMine> {
  if (USE_MOCKS || isBrideDemoMode()) return mockDelay({ ok: true as const, request: null, items: [] }, 200);
  return apiGet<AssistMine>('/api/v2/couple/assistance');
}
