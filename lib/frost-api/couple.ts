// lib/frost-api/couple.ts
// ─────────────────────────────────────────────────────────────────────────────
// Typed couple (bride) API client. All P2-7a endpoints, one function each.
//
// FLIP TO REAL BACKEND:
//   .env.local:  NEXT_PUBLIC_USE_MOCKS=false
//   Zero code changes. USE_MOCKS gate in lib/frost-api/_base.ts controls all.
//
// NOTE: These endpoints are NOT YET BUILT on dream-os (P2-7a pending).
// Mocks are the production surface until backend ships. The types here ARE
// the P2-7a contract spec.
// ─────────────────────────────────────────────────────────────────────────────

import { USE_MOCKS, apiGet, apiPost, mockDelay } from './_base';
import {
  MOCK_COUPLE_ME, MOCK_COUPLE_TODAY, MOCK_COUPLE_MUSE,
  MOCK_COUPLE_CIRCLE, MOCK_COUPLE_EVENTS, MOCK_COUPLE_BOOKINGS,
  MOCK_COUPLE_RECEIPTS, MOCK_COUPLE_CHAT_REPLY,
} from '../mocks/bride';
import type {
  CoupleMeResponse, CoupleTodayResponse,
  CoupleMuseResponse, CoupleMuseQuery, DeleteMuseResponse,
  CoupleChatBody, CoupleChatResponse,
  CoupleCircleResponse, CircleInviteBody, CircleInviteResponse,
  CircleMessagesResponse, CircleMessageBody,
  CoupleEventsResponse, CoupleEventsQuery,
  CoupleBookingsResponse,
  CoupleReceiptsResponse,
} from '../types/bride';

// ─── GET /api/v2/couple/me/:coupleId ────────────────────────────────────────
export async function fetchCoupleMe(coupleId: string): Promise<CoupleMeResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_COUPLE_ME);
  return apiGet<CoupleMeResponse>(`/api/v2/couple/me/${coupleId}`);
}

// ─── GET /api/v2/couple/today/:coupleId ─────────────────────────────────────
export async function fetchCoupleToday(coupleId: string): Promise<CoupleTodayResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_COUPLE_TODAY);
  return apiGet<CoupleTodayResponse>(`/api/v2/couple/today/${coupleId}`);
}

// ─── GET /api/v2/couple/muse/:coupleId ──────────────────────────────────────
export async function fetchCoupleMuse(
  coupleId: string,
  query: CoupleMuseQuery = {},
): Promise<CoupleMuseResponse> {
  if (USE_MOCKS) {
    const filtered = query.ceremony && query.ceremony !== 'all'
      ? { ...MOCK_COUPLE_MUSE, saves: MOCK_COUPLE_MUSE.saves.filter(s => s.ceremony === query.ceremony) }
      : MOCK_COUPLE_MUSE;
    return mockDelay({ ...filtered, total: filtered.saves.length });
  }
  return apiGet<CoupleMuseResponse>(
    `/api/v2/couple/muse/${coupleId}`,
    { ceremony: query.ceremony, limit: query.limit, offset: query.offset },
  );
}

// ─── DELETE /api/v2/couple/muse/:saveId ─────────────────────────────────────
export async function deleteMuseSave(saveId: string): Promise<DeleteMuseResponse> {
  if (USE_MOCKS) return mockDelay({ ok: true as const });
  // DELETE via apiPost-style — build a direct fetch since _base doesn't have apiDelete
  const { API_BASE, getAccessToken } = await import('./_base');
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/api/v2/couple/muse/${saveId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Delete failed');
  return { ok: true };
}

// ─── POST /api/v2/couple/chat ────────────────────────────────────────────────
export async function coupleChat(body: CoupleChatBody): Promise<CoupleChatResponse> {
  if (USE_MOCKS) {
    const reply = MOCK_COUPLE_CHAT_REPLY(body.message);
    return mockDelay({ ok: true as const, reply }, 900);
  }
  return apiPost<CoupleChatResponse>('/api/v2/couple/chat', body);
}

// ─── GET /api/v2/couple/circle/:coupleId ────────────────────────────────────
export async function fetchCoupleCircle(coupleId: string): Promise<CoupleCircleResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_COUPLE_CIRCLE);
  return apiGet<CoupleCircleResponse>(`/api/v2/couple/circle/${coupleId}`);
}

// ─── POST /api/v2/couple/circle/invite ──────────────────────────────────────
export async function inviteCircleMember(body: CircleInviteBody): Promise<CircleInviteResponse> {
  if (USE_MOCKS) return mockDelay({ ok: true as const, token: 'CIRCLE-MOCK01' }, 600);
  return apiPost<CircleInviteResponse>('/api/v2/couple/circle/invite', body);
}

// ─── GET /api/v2/couple/circle/messages/:coupleId ───────────────────────────
export async function fetchCircleMessages(coupleId: string): Promise<CircleMessagesResponse> {
  if (USE_MOCKS) return mockDelay({ ok: true as const, messages: [] });
  return apiGet<CircleMessagesResponse>(`/api/v2/couple/circle/messages/${coupleId}`);
}

// ─── GET /api/v2/couple/events/:coupleId ────────────────────────────────────
export async function fetchCoupleEvents(
  coupleId: string,
  query: CoupleEventsQuery = {},
): Promise<CoupleEventsResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_COUPLE_EVENTS);
  return apiGet<CoupleEventsResponse>(
    `/api/v2/couple/events/${coupleId}`,
    { from: query.from, to: query.to, kind: query.kind },
  );
}

// ─── GET /api/v2/couple/bookings/:coupleId ──────────────────────────────────
export async function fetchCoupleBookings(coupleId: string): Promise<CoupleBookingsResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_COUPLE_BOOKINGS);
  return apiGet<CoupleBookingsResponse>(`/api/v2/couple/bookings/${coupleId}`);
}

// ─── GET /api/v2/couple/receipts/:coupleId ──────────────────────────────────
export async function fetchCoupleReceipts(coupleId: string): Promise<CoupleReceiptsResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_COUPLE_RECEIPTS);
  return apiGet<CoupleReceiptsResponse>(`/api/v2/couple/receipts/${coupleId}`);
}
