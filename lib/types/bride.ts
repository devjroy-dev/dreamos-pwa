// lib/types/bride.ts
// ─────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces for all couple (bride) endpoints.
// Source of truth: dream-os docs/API_CONTRACTS.md "Couple (bride) endpoints"
// section, lines 362–620.
//
// IMPORTANT: dream-os couple API handlers (src/api/couple/) are NOT YET BUILT
// beyond auth. These shapes are the P2-7a contract spec — the backend will be
// built to match these interfaces. When flipping USE_MOCKS=false, screens
// consume the same shape.
//
// SESSION KEYS (written by app/(auth)/couple/pin-login/page.tsx):
//   - access_token           — JWT Bearer
//   - couple_session         — JSON: { id, userId, coupleId, name, pin_set, ... }
//   - couple_web_session     — mirror of couple_session
//
// COUPLE vs VENDOR differences:
//   - 2 modes: PLAN / DISCOVER (not 3)
//   - chat response: { ok, reply } only — no tool_calls (brideEngine suppresses)
//   - Muse board is the primary visual surface (no equivalent on vendor side)
// ─────────────────────────────────────────────────────────────────────────────

// ─── /couple/me ─────────────────────────────────────────────────────────────
export interface CoupleMe {
  id: string;
  name: string | null;
  partner_name: string | null;
  wedding_date: string | null;
  wedding_city: string | null;
  budget_total: number | null;
  phone: string;
}

export interface CoupleMeResponse {
  ok: true;
  couple: CoupleMe;
}

// ─── /couple/today ───────────────────────────────────────────────────────────
export interface TodayUpcomingEvent {
  id: string;
  title: string;
  kind: string;
  event_date: string;
  event_time: string | null;
}

export interface TodayRecentMuse {
  id: string;
  image_url: string;
  tags: string[];
}

export interface TodayCircleActivity {
  member_name: string;
  action: string;
  created_at: string;
}

export interface CoupleTodayResponse {
  ok: true;
  couple: {
    name: string | null;
    wedding_date: string | null;
    days_to_wedding: number | null;
  };
  upcoming_events: TodayUpcomingEvent[];
  recent_muse: TodayRecentMuse[];
  circle_activity: TodayCircleActivity[];
  bookings_count: number;
  muse_count: number;
}

// ─── /couple/muse ────────────────────────────────────────────────────────────
export type MuseCeremony =
  | 'haldi' | 'mehendi' | 'sangeet' | 'reception' | 'wedding' | 'all';

export interface MuseSave {
  id: string;
  image_url: string;
  cloudinary_public_id: string | null;
  tags: string[];
  source_url: string | null;
  ceremony: MuseCeremony | string | null;
  created_at: string;
}

export interface CoupleMuseResponse {
  ok: true;
  saves: MuseSave[];
  total: number;
}

export interface CoupleMuseQuery {
  ceremony?: MuseCeremony;
  limit?: number;
  offset?: number;
}

export interface DeleteMuseResponse {
  ok: true;
}

// ─── /couple/chat ────────────────────────────────────────────────────────────
export interface CoupleChatBody {
  couple_id: string;
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
}

export interface CoupleChatResponse {
  ok: true;
  reply: string;
  // NOTE: brideEngine does not expose tool_calls in the response (by design).
  // The agent acts — the reply describes what it did, in natural language.
}

// ─── /couple/circle ──────────────────────────────────────────────────────────
export interface CircleMember {
  id: string;
  name: string;
  phone: string;
  role: string | null;
  joined_at: string;
}

export interface CircleActivity {
  id: string;
  member_name: string;
  action: string;
  content: string | null;
  created_at: string;
}

export interface CoupleCircleResponse {
  ok: true;
  members: CircleMember[];
  activity: CircleActivity[];
}

// ─── /couple/circle/invite ───────────────────────────────────────────────────
export interface CircleInviteBody {
  couple_id: string;
  phone: string;
  name: string;
  role: string | null;
}

export interface CircleInviteResponse {
  ok: true;
  token: string;
}

// ─── /couple/circle/messages ─────────────────────────────────────────────────
export type CircleMessageKind = 'text' | 'muse_share' | 'ai_summary';

export interface CircleMessage {
  id: string;
  sender_name: string;
  content: string;
  kind: CircleMessageKind;
  created_at: string;
}

export interface CircleMessagesResponse {
  ok: true;
  messages: CircleMessage[];
}

export interface CircleMessageBody {
  couple_id: string;
  content: string;
  sender_name: string;
}

// ─── /couple/events ──────────────────────────────────────────────────────────
export type CoupleEventKind =
  | 'fitting' | 'trial' | 'ceremony' | 'reminder' | 'other';

export interface CoupleEvent {
  id: string;
  title: string;
  kind: CoupleEventKind | string;
  event_date: string;
  event_time: string | null;
  state: string;
  notes: string | null;
}

export interface CoupleEventsResponse {
  ok: true;
  events: CoupleEvent[];
}

export interface CoupleEventsQuery {
  from?: string;
  to?: string;
  kind?: CoupleEventKind;
}

// ─── /couple/bookings ────────────────────────────────────────────────────────
export interface CoupleBooking {
  id: string;
  vendor_name: string;
  category: string | null;
  amount_total: number | null;
  amount_paid: number | null;
  state: string;
  notes: string | null;
  booked_at: string | null;
}

export interface CoupleBookingsResponse {
  ok: true;
  bookings: CoupleBooking[];
  total_committed: number;
  total_paid: number;
}

// ─── /couple/receipts ────────────────────────────────────────────────────────
export interface CoupleReceipt {
  id: string;
  label: string | null;
  amount: number | null;
  image_url: string | null;
  vendor_name: string | null;
  receipt_date: string | null;
  created_at: string;
}

export interface CoupleReceiptsResponse {
  ok: true;
  receipts: CoupleReceipt[];
  total: number;
}
