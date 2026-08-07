// lib/frost/journey.ts
// ─────────────────────────────────────────────────────────────────────────────
// Typed API client for all Frost Journey sub-screens.
// All shapes verified against actual dream-os src/api/couple/* handlers.
// USE_MOCKS controlled by NEXT_PUBLIC_USE_MOCKS env var.
// FLIP TO REAL: NEXT_PUBLIC_USE_MOCKS=false — zero code changes.
// ─────────────────────────────────────────────────────────────────────────────

// F-05.39 (CE rulings R2 + R3). This module — the circle-invite machinery and
// the sanctuary's data layer — used to gate its mocks on its OWN authority and
// consult the demo session NEVER. The consequence was not that a demo bride
// fell through to a harmless 401: it was CROSS-SESSION CONTAMINATION. On any
// device that had ever held a real couple login the real token survives under
// the demo blob (nothing clears either — F-05.65), so couple.ts and muse.ts
// served mocks off the blob while THIS file wrote real rows to that real
// couple. Both authorities live, on one device, disagreeing.
//
// The cure imports the one authority from _base and lets it win first, in the
// sibling pattern couple.ts and muse.ts already use. The token reads fold onto
// getAccessToken — the cookie-before-localStorage source (F-05.29's own cure,
// the D2 pattern) — because the iOS-Safari law forbids shipping NEW
// localStorage-only reads and the correct source is one import away.
//
// KNOWN INHERITED PROPERTY, named exactly as sanctuary/page.tsx names it:
// getAccessToken falls back to the VENDOR cookie for couple surfaces
// (_base.ts, F-05.30). That is filed to the coordinated auth sitting and is
// NOT this micro's to resolve — it arrives here with its eyes open.
import { isBrideDemoMode, getAccessToken } from '../frost-api/_base';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
// Demo mode is the FIRST authority: a demo walk is served mocks whatever the
// env var says and whatever token happens to be sitting on the device.
// Below it, the pre-existing runtime override is untouched — if a real couple
// token exists, always use the real API regardless of USE_MOCKS. Prevents
// "member not found" and empty canvases when NEXT_PUBLIC_USE_MOCKS is not set
// in Vercel.
function shouldUseMocks(): boolean {
  if (isBrideDemoMode()) return true;
  if (!USE_MOCKS) return false;
  if (typeof window === 'undefined') return true;
  try { return !getAccessToken(); } catch { return true; }
}
const API_BASE  = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return getAccessToken(); } catch { return null; }
}


// ── F-07.72 · THE BRIDE'S CREDENTIAL REACHES THE SHARED CIRCLE DOORS ─────────
// Three of the circle doors are DUAL-LANE: the co-planner reaches them and so
// does the bride, from here and from sanctuary. `src/api/circle/messages.js:27`
// was built for exactly that ("The bride passes her couple_id directly; a circle
// member passes their users.id"), which is why those doors take a RESOLVER and
// not a circle-member guard — a guard would answer the bride's own circle chat
// with "Not a circle member."
//
// These three fetches sent NO credential at all. `sanctuary:2585` had been
// sending its Bearer since it was written and the server ignored it; these
// siblings never sent one, so a census that looked only at that call site would
// have concluded the bride was already covered. She was not, on four of her five
// call sites, and the enforcement delivery would have locked her out of her own
// conversation. Named at the read-first, ratified into this ZIP.
//
// NO NEW AUTHORITY IS INTRODUCED: `getToken()` above is F-07.70's one authority
// (cookie-before-localStorage via `_base`'s `getAccessToken`), already imported
// and already used by this module. The iOS-Safari law is satisfied by borrowing
// it rather than by writing a fourth token read.
function circleBrideHeaders(extra?: Record<string, string>): Record<string, string> {
  const t = getToken();
  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };
}

function getCoupleId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      // pin-login writes { id, userId, ... } — id IS the couple_id
      const id = s?.coupleId || s?.id;
      if (id) return id;
    }
  } catch { /* fall through to cookie */ }
  // Cookie fallback — iOS Safari may have blocked the localStorage write at sign-in.
  try {
    const m = document.cookie.split('; ').find(r => r.startsWith('tdw_couple_session='));
    if (m) {
      const s = JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
      return s?.coupleId || s?.id || null;
    }
  } catch { /* ignore */ }
  return null;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // F-09.165 walk: the server's 409 carries Dream Ai's QUESTION as its message,
    // and a bare Error discards everything a caller needs to tell a question from
    // a failure. Status and body ride along; the message is unchanged, so every
    // existing catch keeps behaving exactly as it did.
    const err = new Error(body?.error || `HTTP ${res.status}`) as Error & { status?: number; body?: any };
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

function delay<T>(v: T, ms = 240): Promise<T> {
  return new Promise(r => setTimeout(() => r(v), ms));
}

// ─── TYPES (matched to actual backend response shapes) ─────────────────────

// events table: id, title, event_date, event_time, kind, state, notes, created_at
export interface CoupleEvent {
  id: string;
  title: string;
  kind: string;        // shoot|call|meeting|task|reminder|recce|fitting|trial|family|ceremony|social|other
  event_date: string;  // YYYY-MM-DD
  event_time: string | null;
  state: string;       // upcoming|done|cancelled
  notes: string | null;
  created_at?: string;
}

// couple_receipts table: id, booking_id, amount, vendor_name, description, receipt_date, image_url, tags, created_at
export interface CoupleReceipt {
  id: string;
  booking_id: string | null;
  amount: number | null;
  vendor_name: string | null;
  description: string | null;
  receipt_date: string | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
}

// couple_bookings table: id, vendor_name, vendor_id, category, amount_total, amount_advance, amount_paid, balance_due_date, state, notes
export interface CoupleBooking {
  id: string;
  vendor_name: string;
  vendor_id: string | null;
  category: string;
  amount_total: number | null;
  amount_advance: number | null;
  amount_paid: number;
  balance_due_date: string | null;
  state: string;  // booked|advance_paid|paid
  notes: string | null;
  created_at?: string;
}

// circle from /api/v2/couple/circle/:coupleId
export interface CircleMember {
  id: string;
  invitee_name: string;
  role: string;
  status: string;  // active|pending|removed
  joined_at: string | null;
  conversation_id: string | null;
  last_active: string | null;
}

export interface CircleActivity {
  id: string;
  activity_type: string;  // save_added|comment|joined|vendor_booked|task_completed
  member_name: string | null;
  actor_role: string | null;
  content: string | null;
  created_at: string;
  // enriched fields (populated for save_added rows)
  image_url: string | null;
  caption: string | null;
  aesthetic_tags: string[] | null;
  save_number: number | null;
  source_type: string | null;
}

export interface CircleData {
  members: CircleMember[];
  activity: CircleActivity[];
  pending_invites: { id: string; invitee_name: string; role: string; expires_at: string | null; created_at: string }[];
}

// Individual member feed — GET /couple/circle/member/:memberId
export interface MemberFeedData {
  member: CircleMember & { invitee_phone: string | null };
  activity: CircleActivity[];
}

// threads from /api/v2/frost/circle/threads/:brideId
export interface CircleThread {
  thread_id: string;
  kind: string;
  label: string | null;
  last_message: { content: string | null; sender_name: string | null; created_at: string | null } | null;
  last_active: string | null;
}

// messages from /api/v2/frost/circle/threads/:brideId/:threadId/messages
// F-07.107/109 — `sender_name` is now the persisted author (null on pre-0105
// rows), not the role wearing a name field, and `sender_user_id` joins it.
// NAMED, NOT SILENTLY CORRECT: these three helpers — fetchCircleThreads,
// fetchThreadMessages, sendThreadMessage — have ZERO consumers anywhere in this
// tree (derived by command at F-07.107's read-first). The type is corrected
// because a dead export with a lying type is what the next reader inherits.
export interface CircleMessage {
  id: string;
  body: string | null;
  content: string | null;
  sender_name: string | null;
  sender_user_id: string | null;
  sender_role: string | null;
  created_at: string;
}

// couple profile from /api/v2/couple/me/:coupleId
export interface CoupleProfile {
  id: string;
  bride_name: string | null;    // from users.name
  partner_name: string | null;
  wedding_date: string | null;
  wedding_city: string | null;
  budget_total: number | null;
  events_planned: string[];
  planning_state: string | null;
  onboarding_state: string | null;
}

// ─── MOCKS ────────────────────────────────────────────────────────────────────

function getMockEvents(): CoupleEvent[] {
  // Dates relative to now so they always feel near and real
  const d = (daysFromNow: number) => {
    const dt = new Date(); dt.setDate(dt.getDate() + daysFromNow);
    return dt.toISOString().split('T')[0];
  };
  const m = (monthsFromNow: number) => {
    const dt = new Date(); dt.setMonth(dt.getMonth() + monthsFromNow);
    return dt.toISOString().split('T')[0];
  };
  return [
    { id: 'ev1', title: 'Bridal Trial — Swati Roy',          kind: 'trial',    event_date: d(6),    event_time: '11:00', state: 'upcoming', notes: 'Soft glam look for the mehndi. Bring ref pics.' },
    { id: 'ev2', title: 'Lehenga Fitting — Sabyasachi',      kind: 'fitting',  event_date: d(11),   event_time: '14:00', state: 'upcoming', notes: 'Final drape and blouse alterations. Carry the dupatta.' },
    { id: 'ev3', title: 'Pre-Wedding Shoot — Udaipur',        kind: 'shoot',    event_date: d(19),   event_time: '06:00', state: 'upcoming', notes: 'Golden hour at the Lake Palace ghats. Bring both outfits.' },
    { id: 'ev4', title: 'Venue Recce — The Oberoi Amarvilas', kind: 'recce',    event_date: d(24),   event_time: '10:30', state: 'upcoming', notes: 'Walk the ceremony lawn and the ballroom. Confirm the mandap spot.' },
    { id: 'ev5', title: 'Jewellery Consultation — Saraf',     kind: 'meeting',  event_date: d(30),   event_time: '12:00', state: 'upcoming', notes: 'Polki set shortlisted. Confirm the maang tikka.' },
    { id: 'ev6', title: 'Haldi',                              kind: 'family',   event_date: m(5),    event_time: '09:00', state: 'upcoming', notes: 'Home — terrace garden. Yellow and white florals.' },
    { id: 'ev7', title: 'Mehndi Evening',                     kind: 'ceremony', event_date: m(5),    event_time: '16:00', state: 'upcoming', notes: 'Poolside. Live dhol. 80 guests.' },
    { id: 'ev8', title: 'Sangeet Night',                      kind: 'ceremony', event_date: m(6),    event_time: '19:00', state: 'upcoming', notes: 'Grand Ballroom, The Leela. 200 guests. Choreography confirmed.' },
    { id: 'ev9', title: 'Wedding',                            kind: 'ceremony', event_date: m(6),    event_time: '07:00', state: 'upcoming', notes: 'Phera ceremony at sunrise. ITC Maurya Lawns.' },
    { id: 'ev10', title: 'Reception',                         kind: 'social',   event_date: m(6),    event_time: '19:30', state: 'upcoming', notes: 'Rooftop. Candlelit. 350 guests.' },
  ];
}
const MOCK_EVENTS: CoupleEvent[] = getMockEvents();

const MOCK_RECEIPTS: CoupleReceipt[] = [
  { id: 'r1', booking_id: null, amount: 50000,  vendor_name: 'Aanya Studio',   description: 'Advance payment', receipt_date: '2026-11-01', image_url: null, tags: ['photography'], created_at: '2026-11-01T10:00:00Z' },
  { id: 'r2', booking_id: null, amount: 25000,  vendor_name: 'Swati Roy MUA',  description: 'Trial session',   receipt_date: '2026-11-05', image_url: null, tags: ['makeup'],      created_at: '2026-11-05T14:00:00Z' },
];

const MOCK_BOOKINGS: CoupleBooking[] = [
  { id: 'b1', vendor_name: 'Joseph Radhik',         vendor_id: null, category: 'photographer',  amount_total: 850000,  amount_advance: 150000, amount_paid: 150000, balance_due_date: null, state: 'advance_paid', notes: 'Full wedding coverage + pre-wedding Udaipur shoot.' },
  { id: 'b2', vendor_name: 'Swati Roy',              vendor_id: null, category: 'makeup_artist', amount_total: 320000,  amount_advance: 75000,  amount_paid: 75000,  balance_due_date: null, state: 'advance_paid', notes: 'Bridal + 4 bridesmaids across all functions.' },
  { id: 'b3', vendor_name: 'Sabyasachi Mukherjee',  vendor_id: null, category: 'bridal_wear',   amount_total: 4200000, amount_advance: 500000, amount_paid: 500000, balance_due_date: null, state: 'advance_paid', notes: 'Red tissue silk lehenga. Blouse in final fitting.' },
  { id: 'b4', vendor_name: 'Weddingz Décor Studio', vendor_id: null, category: 'decorator',     amount_total: 1800000, amount_advance: null,   amount_paid: 0,      balance_due_date: null, state: 'booked',       notes: 'Marigold + white florals. Proposal shared.' },
  { id: 'b5', vendor_name: 'The Leela New Delhi',   vendor_id: null, category: 'venue',         amount_total: 5500000, amount_advance: 500000, amount_paid: 500000, balance_due_date: null, state: 'advance_paid', notes: 'Grand Ballroom + Lawns. F&B inclusive.' },
  { id: 'b6', vendor_name: 'Shiamak Davar Studio',  vendor_id: null, category: 'choreographer', amount_total: 180000,  amount_advance: null,   amount_paid: 0,      balance_due_date: null, state: 'booked',       notes: 'Sangeet performance — 6 couples, 3 songs.' },
];

const MOCK_CIRCLE: CircleData = {
  members: [],
  activity: [],
  pending_invites: [],
};

const MOCK_PROFILE: CoupleProfile = {
  id: 'couple-demo',
  bride_name: 'Priya',
  partner_name: 'Arjun',
  wedding_date: (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().split('T')[0]; })(),
  wedding_city: 'New Delhi',
  budget_total: 12000000,
  events_planned: ['haldi','mehndi','sangeet','wedding','reception'],
  planning_state: 'shortlisting',
  onboarding_state: 'complete',
};

// ─── API FUNCTIONS — EVENTS ────────────────────────────────────────────────

export async function fetchEvents(state = 'upcoming'): Promise<CoupleEvent[]> {
  if (shouldUseMocks()) return delay(getMockEvents());
  const id = getCoupleId();
  if (!id) return [];
  const r: any = await apiFetch(`/api/v2/couple/events/${id}?state=${state}`);
  return r?.events ?? [];
}

export async function createEvent(body: {
  title: string; event_date: string; kind: string; event_time?: string; notes?: string;
}): Promise<CoupleEvent> {
  if (shouldUseMocks()) {
    const ev: CoupleEvent = { id: `mock-${Date.now()}`, state: 'upcoming', event_time: null, notes: null, ...body };
    return delay(ev, 400);
  }
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/couple/events/${id}`, { method: 'POST', body: JSON.stringify(body) });
  return r.event;
}

export async function updateEvent(eventId: string, patch: {
  title?: string; event_date?: string; event_time?: string | null; kind?: string; notes?: string | null; state?: string;
}): Promise<CoupleEvent> {
  if (shouldUseMocks()) {
    const ev = MOCK_EVENTS.find(e => e.id === eventId);
    return delay({ ...(ev || MOCK_EVENTS[0]), ...patch } as CoupleEvent, 300);
  }
  const r: any = await apiFetch(`/api/v2/couple/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  return r.event;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  if (shouldUseMocks()) return delay(true, 300);
  try { await apiFetch(`/api/v2/couple/events/${eventId}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

// ─── API FUNCTIONS — RECEIPTS (expense vault) ──────────────────────────────

export async function fetchReceipts(): Promise<CoupleReceipt[]> {
  if (shouldUseMocks()) return delay(MOCK_RECEIPTS);
  const id = getCoupleId();
  if (!id) return [];
  const r: any = await apiFetch(`/api/v2/couple/expenses/${id}`);
  return r?.expenses ?? [];
}

export async function deleteReceipt(receiptId: string): Promise<boolean> {
  if (shouldUseMocks()) return delay(true, 300);
  try { await apiFetch(`/api/v2/couple/receipts/${receiptId}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

// ─── API FUNCTIONS — BOOKINGS (vendor commitments) ────────────────────────

export async function fetchBookings(): Promise<CoupleBooking[]> {
  if (shouldUseMocks()) return delay(MOCK_BOOKINGS);
  const id = getCoupleId();
  if (!id) return [];
  const r: any = await apiFetch(`/api/v2/couple/bookings/${id}`);
  return r?.bookings ?? [];
}

export interface CoupleEnquiry {
  id: string;
  vendor_id: string;
  vendor_name: string | null;
  category: string | null;
  city: string | null;
  routing_handle: string | null;
  created_at: string;
}

export async function fetchEnquiries(): Promise<CoupleEnquiry[]> {
  if (shouldUseMocks()) return delay([]);
  try {
    const r: any = await apiFetch('/api/v2/couple/enquiries');
    return r?.enquiries ?? [];
  } catch { return []; }
}

export async function createBooking(body: {
  vendor_name: string; category: string; amount_total?: number; amount_advance?: number;
  balance_due_date?: string; notes?: string; state?: string;
}): Promise<CoupleBooking> {
  if (shouldUseMocks()) {
    const b: CoupleBooking = { id: `mock-${Date.now()}`, vendor_id: null, amount_advance: null, amount_paid: 0, balance_due_date: null, notes: null, amount_total: null, state: 'booked', ...body };
    return delay(b, 400);
  }
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/couple/bookings/${id}`, { method: 'POST', body: JSON.stringify(body) });
  return r.booking;
}

export async function updateBooking(bookingId: string, patch: {
  vendor_name?: string; category?: string; amount_total?: number | null;
  amount_advance?: number | null; balance_due_date?: string | null; notes?: string | null; state?: string;
}): Promise<CoupleBooking> {
  if (shouldUseMocks()) {
    const b = MOCK_BOOKINGS.find(x => x.id === bookingId);
    return delay({ ...(b || MOCK_BOOKINGS[0]), ...patch } as CoupleBooking, 300);
  }
  const r: any = await apiFetch(`/api/v2/couple/bookings/${bookingId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  return r.booking;
}

export async function deleteBooking(bookingId: string): Promise<boolean> {
  if (shouldUseMocks()) return delay(true, 300);
  try { await apiFetch(`/api/v2/couple/bookings/${bookingId}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function recordPayment(bookingId: string, amount: number, payment_date?: string): Promise<CoupleBooking> {
  if (shouldUseMocks()) {
    const b = MOCK_BOOKINGS.find(x => x.id === bookingId);
    const updated = { ...(b || MOCK_BOOKINGS[0]), amount_paid: (b?.amount_paid || 0) + amount };
    return delay(updated as CoupleBooking, 400);
  }
  const body: any = { amount };
  if (payment_date) body.payment_date = payment_date;
  const r: any = await apiFetch(`/api/v2/couple/bookings/${bookingId}/payment`, { method: 'POST', body: JSON.stringify(body) });
  return r.booking;
}

// ─── API FUNCTIONS — CIRCLE ────────────────────────────────────────────────

export async function fetchCircle(): Promise<CircleData> {
  if (shouldUseMocks()) return delay(MOCK_CIRCLE);
  const id = getCoupleId();
  if (!id) return { members: [], activity: [], pending_invites: [] };
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  return {
    members:         r?.members         ?? [],
    activity:        r?.activity        ?? [],
    pending_invites: r?.pending_invites ?? [],
  };
}

export async function fetchMemberFeed(memberId: string): Promise<MemberFeedData | null> {
  // F-05.39 (R2): this site never went through shouldUseMocks — it read the env
  // var and the token raw, so a demo walk reached the real member feed here too.
  // Demo mode now wins first; the token read folds onto getAccessToken (R3).
  // Always hit real API if a token exists — USE_MOCKS mock returns null which shows "Member not found"
  const hasToken = typeof window !== 'undefined' && !!getAccessToken();
  if (isBrideDemoMode() || (USE_MOCKS && !hasToken)) return delay(null);
  try {
    const r: any = await apiFetch(`/api/v2/couple/circle/member/${memberId}`);
    return {
      member:   r?.member   ?? null,
      activity: r?.activity ?? [],
    };
  } catch { return null; }
}

export async function removeCircleMember(memberId: string): Promise<boolean> {
  try {
    await apiFetch(`/api/v2/couple/circle/member/${memberId}`, { method: 'DELETE' });
    return true;
  } catch { return false; }
}

export async function inviteCircleMember(body: { invitee_name: string; role: string; invitee_phone?: string }): Promise<{ wa_me_link: string; invite_token: string; member_id: string; join_url?: string; has_phone?: boolean }> {
  if (shouldUseMocks()) return delay({ wa_me_link: 'https://wa.me/?text=CIRCLE-MOCK', invite_token: 'MOCK', member_id: 'mock-id', join_url: 'https://thedreamwedding.in/circle/join/CIRCLE-MOCK', has_phone: false }, 600);
  const r: any = await apiFetch('/api/v2/couple/circle/invite', { method: 'POST', body: JSON.stringify(body) });
  return { wa_me_link: r.wa_me_link, invite_token: r.invite_token, member_id: r.member_id, join_url: r.join_url, has_phone: r.has_phone };
}

// Threads — uses the coplanner frost endpoint (no JWT, scoped by brideId)
export async function fetchCircleThreads(): Promise<CircleThread[]> {
  if (shouldUseMocks()) return delay([]);
  const id = getCoupleId();
  if (!id) return [];
  const res = await fetch(`${API_BASE}/api/v2/frost/circle/threads/${id}`, {
    headers: circleBrideHeaders(),
  });
  const r: any = await res.json();
  return r?.data ?? [];
}

// Messages for a specific thread
export async function fetchThreadMessages(threadId: string): Promise<CircleMessage[]> {
  if (shouldUseMocks()) return delay([]);
  const id = getCoupleId();
  if (!id) return [];
  const res = await fetch(`${API_BASE}/api/v2/frost/circle/threads/${id}/${threadId}/messages`, {
    headers: circleBrideHeaders(),
  });
  const r: any = await res.json();
  return r?.data ?? [];
}

// Send a message to a thread
export async function sendThreadMessage(threadId: string, messageBody: string): Promise<boolean> {
  if (shouldUseMocks()) return delay(true, 600);
  try {
    const id = getCoupleId();
    await fetch(`${API_BASE}/api/v2/frost/circle/messages`, {
      method: 'POST',
      headers: circleBrideHeaders({ 'Content-Type': 'application/json' }),
      // F-07.107 — `sender_name: 'couple'` was here: not a name at all, a role
      // string posted into a name field. The server no longer accepts it.
      body: JSON.stringify({ userId: id, thread_id: threadId, body: messageBody }),
    });
    return true;
  } catch { return false; }
}

// ─── API FUNCTIONS — PROFILE ───────────────────────────────────────────────

export async function fetchProfile(): Promise<CoupleProfile> {
  if (shouldUseMocks()) return delay(MOCK_PROFILE);
  const id = getCoupleId();
  if (!id) return MOCK_PROFILE;
  const r: any = await apiFetch(`/api/v2/couple/me/${id}`);
  return r?.couple ?? MOCK_PROFILE;
}

// F-09.165 WALK FINDING — this returned a bare `boolean`, so the Settings sheet
// could only ever say "That didn't save. Check your connection and try again."
// The founder walked it and got exactly that on a 409 whose body was Dream Ai's
// question — a misleading sentence (her connection was fine) in place of the one
// sentence the whole floor mechanism exists to deliver. My own in-file comment on
// the route claimed "the question reaches her with no new UI"; I asserted a client
// behaviour I never traced. It does now.
export interface SaveProfileResult {
  ok: boolean;
  /** the server's own sentence — on a 409 this IS the question, verbatim */
  message?: string;
  /** true when the server is asking her to confirm, not reporting a failure */
  needsConfirmation?: boolean;
  /** the persisted figure, echoed by the route so the caller can compare */
  budget_total?: number;
}

export async function saveProfile(patch: {
  name?: string; partner_name?: string; wedding_date?: string; wedding_city?: string;
  // CE R-26.5 §C: the field forwards the RAW STRING and learns no vocabulary at
  // all. The server coerces — one seat, src/lib/coerceBudget.js — and echoes what
  // it stored. A `number` here would mean the client had an opinion about what a
  // budget is, and that opinion is exactly what must not exist twice.
  budget_total?: number | string;
}): Promise<SaveProfileResult> {
  if (shouldUseMocks()) return delay({ ok: true }, 600);
  try {
    const id = getCoupleId();
    const r: any = await apiFetch(`/api/v2/couple/me/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
    return { ok: true, budget_total: r?.budget_total };
  } catch (e: any) {
    return {
      ok: false,
      message: typeof e?.message === 'string' ? e.message : undefined,
      needsConfirmation: e?.status === 409,
    };
  }
}

// ─── FORMATTING UTILS ──────────────────────────────────────────────────────

// TDW_09 R-U25: compliant already; consolidated so one place builds a money string.
// The couple lane already imports this home (sanctuary, muse).
export function fmtINR(n: number | null | undefined): string {
  return formatRs(!n && n !== 0 ? 0 : n);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatActivityLine(a: CircleActivity): string {
  const actor = a.actor_role === 'bride' ? 'You' : (a.member_name || 'Someone');
  switch (a.activity_type) {
    case 'save_added':            return `${actor} saved to Muse`;
    case 'circle_message':
    case 'circle_message_sent':   return `${actor} sent a message`;
    case 'circle_invite_accepted':return `${a.member_name || 'Someone'} joined your Circle`;
    case 'vendor_booked':         return `${actor} noted a booking`;
    case 'task_completed':        return `${actor} completed a task`;
    default:                      return `${actor} made a change`;
  }
}


// ─── REMINDERS (couple_tasks) — stubs until REST endpoint ships ────────────
// The brideEngine manages tasks via WhatsApp agent tools directly.
// A REST endpoint for couple_tasks is not yet mounted in core.js.
// These stubs keep the reminders canvas functional with mocks.
export interface Reminder {
  id: string;
  couple_id: string;
  text: string;
  event?: string | null;
  priority?: string | null;
  due_date?: string | null;
  is_complete: boolean;
  created_at?: string;
}

const MOCK_REMINDERS: Reminder[] = [
  { id: 'rem1', couple_id: '', text: 'Confirm lehenga fitting with Anita Dongre', due_date: '2026-11-16', is_complete: false, event: 'Wedding' },
  { id: 'rem2', couple_id: '', text: 'Send final guest list to caterer', due_date: '2026-11-16', is_complete: false, event: 'Wedding' },
  { id: 'rem3', couple_id: '', text: 'Collect kalire from Chandni Chowk', due_date: '2026-11-17', is_complete: false },
  { id: 'rem4', couple_id: '', text: 'Makeup trial done', due_date: '2026-11-13', is_complete: true },
];

export async function fetchReminders(): Promise<Reminder[]> {
  if (shouldUseMocks()) return delay(MOCK_REMINDERS);
  // Real endpoint not mounted yet — return empty until /api/v2/couple/tasks ships
  return [];
}

export async function toggleReminder(id: string, is_complete: boolean): Promise<boolean> {
  if (shouldUseMocks()) return delay(true);
  return false;
}

export async function deleteReminder(id: string): Promise<boolean> {
  if (shouldUseMocks()) return delay(true);
  return false;
}

// Stub kept for compatibility — muse canvas uses lib/frost-api/couple.ts
export async function createMuseSaveFromUrl(_url: string): Promise<void> { return; }
