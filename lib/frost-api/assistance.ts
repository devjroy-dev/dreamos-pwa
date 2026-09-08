// lib/frost-api/assistance.ts — BLOCK 20 · CONCIERGE s1 · the couple's API client.
// POST /api/v2/couple/assistance (dream-os src/api/couple/assistance.js @ 1feb1cc).
// Read the handler before writing this (protocol §6): body is
//   { city?, area?, wedding_date?, brief?, items: [{ category, budget_rs }] }
// and the door reads her phone from the session, never from the body.
// Framework-agnostic (native-implications clause): fetch + JSON, no window.

import { apiPost, USE_MOCKS, isBrideDemoMode, mockDelay } from './_base';

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

export async function submitAssistanceRequest(body: AssistRequestBody): Promise<AssistRequestResponse> {
  if (USE_MOCKS || isBrideDemoMode()) {
    return mockDelay({
      ok: true as const, request_id: 'mock-request', message: 'Sent. We’re on it.',
      items: body.items.map((i, k) => ({ id: `mock-item-${k}`, category: i.category, budget_rs: i.budget_rs })),
      admin_notified: false, admin_notify_refusal: 'mock',
    }, 600);
  }
  return apiPost<AssistRequestResponse>('/api/v2/couple/assistance', body);
}
