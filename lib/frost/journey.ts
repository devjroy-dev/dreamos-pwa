// lib/frost/journey.ts
// ─────────────────────────────────────────────────────────────────────────────
// Typed API client for all Frost Journey sub-screens.
// Same USE_MOCKS pattern as lib/frost-api/vendor.ts.
// Interfaces match tdw-2/services/frostApi.ts shapes exactly.
//
// FLIP TO REAL: NEXT_PUBLIC_USE_MOCKS=false — zero code changes.
// ─────────────────────────────────────────────────────────────────────────────

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';
const API_BASE  = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    // Try couple_session first (set by couple auth flow)
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      if (s?.access_token) return s.access_token;
    }
    return localStorage.getItem('access_token');
  } catch { return null; }
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
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function delay<T>(v: T, ms = 240): Promise<T> {
  return new Promise(r => setTimeout(() => r(v), ms));
}

function getCoupleId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s?.coupleId || s?.id || null;
  } catch { return null; }
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

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

export interface Expense {
  id: string;
  couple_id: string;
  event?: string | null;
  category?: string | null;
  description?: string | null;
  vendor_name?: string | null;
  planned_amount?: number | null;
  actual_amount?: number | null;
  payment_status?: 'pending' | 'paid' | 'committed' | string | null;
  receipt_url?: string | null;
  due_date?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface CoupleVendor {
  id: string;
  couple_id: string;
  vendor_id?: string | null;
  name: string;
  category?: string | null;
  phone?: string | null;
  status?: string | null;
  quoted_total?: number | null;
  paid_total?: number | null;
  events?: string[] | null;
  notes?: string | null;
}

export interface CoupleEvent {
  id: string;
  couple_id: string;
  event_name?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  venue?: string | null;
  task_count?: number;
  vendor_count?: number;
}

export interface CircleActivityEvent {
  id: string;
  event_type: string;
  actor_role: 'bride' | 'member';
  payload?: Record<string, any>;
  created_at: string;
}

export interface CircleThread {
  thread_id: string;
  kind: 'group' | 'dm';
  label: string;
  role?: string | null;
  last_message?: { content: string } | null;
  last_active?: string | null;
}

export interface CircleMessage {
  id: string;
  sender_name: string;
  sender_role: 'bride' | 'member';
  content: string;
  created_at: string;
}

export interface CoupleProfile {
  name: string;
  partner_name: string;
  wedding_date: string;
  wedding_city: string;
  phone: string;
  avatar_url?: string | null;
  tier?: string;
}

// ─── MOCKS ───────────────────────────────────────────────────────────────────

const MOCK_REMINDERS: Reminder[] = [
  { id: 'r1', couple_id: '', text: 'Confirm lehenga fitting time with Anita Dongre', due_date: '2026-11-16', is_complete: false, event: 'Wedding' },
  { id: 'r2', couple_id: '', text: 'Send final guest list to caterer', due_date: '2026-11-16', is_complete: false, event: 'Wedding' },
  { id: 'r3', couple_id: '', text: 'Collect kalire from Chandni Chowk', due_date: '2026-11-17', is_complete: false },
  { id: 'r4', couple_id: '', text: 'Send Mehndi artist entry pass', due_date: '2026-11-17', is_complete: false, event: 'Mehndi' },
  { id: 'r5', couple_id: '', text: 'Pay balance to Aanya Studio', due_date: '2026-11-18', is_complete: false },
  { id: 'r6', couple_id: '', text: 'Makeup trial done', due_date: '2026-11-13', is_complete: true },
  { id: 'r7', couple_id: '', text: 'Final venue walkthrough completed', due_date: '2026-11-10', is_complete: true },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', couple_id: '', vendor_name: 'Aanya Studio',     category: 'Photography', actual_amount: 450000, payment_status: 'committed', due_date: '2026-11-08', event: 'Wedding' },
  { id: 'e2', couple_id: '', vendor_name: 'Swati Roy MUA',    category: 'Makeup',      actual_amount: 180000, payment_status: 'committed', due_date: '2026-11-17', event: 'Wedding' },
  { id: 'e3', couple_id: '', vendor_name: 'Bloom & Petals',   category: 'Decor',       actual_amount: 850000, payment_status: 'pending',   due_date: '2026-11-15', event: 'Wedding' },
  { id: 'e4', couple_id: '', vendor_name: 'Shivam Caterers',  category: 'Catering',    actual_amount: 900000, payment_status: 'pending',   due_date: '2026-11-16', event: 'Wedding' },
  { id: 'e5', couple_id: '', vendor_name: 'Anita Dongre',     category: 'Lehenga',     actual_amount: 320000, payment_status: 'paid',      due_date: null,          event: 'Wedding' },
  { id: 'e6', couple_id: '', vendor_name: 'GRT Jewellers',    category: 'Jewellery',   actual_amount: 280000, payment_status: 'paid',      due_date: null,          event: 'Wedding' },
];

const MOCK_VENDORS: CoupleVendor[] = [
  { id: 'v1', couple_id: '', name: 'Aanya Studio',    category: 'Photography', status: 'booked', quoted_total: 450000, paid_total: 275000, events: ['Mehndi', 'Wedding'] },
  { id: 'v2', couple_id: '', name: 'Swati Roy MUA',   category: 'Makeup',      status: 'booked', quoted_total: 180000, paid_total: 90000,  events: ['Wedding', 'Sangeet'] },
  { id: 'v3', couple_id: '', name: 'Bloom & Petals',  category: 'Decor',       status: 'booked', quoted_total: 850000, paid_total: 425000, events: ['Mehndi', 'Wedding'] },
  { id: 'v4', couple_id: '', name: 'Shivam Caterers', category: 'Catering',    status: 'booked', quoted_total: 900000, paid_total: 450000, events: ['Wedding'] },
  { id: 'v5', couple_id: '', name: 'Reel Makers',     category: 'Videography', status: 'shortlisted', quoted_total: 170000, paid_total: 0, events: ['Wedding'] },
  { id: 'v6', couple_id: '', name: 'The Band Wale',   category: 'Music',       status: 'booked', quoted_total: 250000, paid_total: 75000,  events: ['Sangeet', 'Baraat'] },
];

const MOCK_EVENTS: CoupleEvent[] = [
  { id: 'ev1', couple_id: '', event_name: 'Haldi',   event_type: 'ceremony', event_date: '2026-11-17', venue: 'Home',       task_count: 3, vendor_count: 2 },
  { id: 'ev2', couple_id: '', event_name: 'Mehndi',  event_type: 'ceremony', event_date: '2026-11-17', venue: 'Home',       task_count: 4, vendor_count: 3 },
  { id: 'ev3', couple_id: '', event_name: 'Sangeet', event_type: 'ceremony', event_date: '2026-11-18', venue: 'Rooftop',    task_count: 5, vendor_count: 4 },
  { id: 'ev4', couple_id: '', event_name: 'Wedding', event_type: 'ceremony', event_date: '2026-11-19', venue: 'ITC Maurya', task_count: 8, vendor_count: 6 },
];

const MOCK_CIRCLE_FEED: CircleActivityEvent[] = [
  { id: 'ca1', event_type: 'muse_saved',          actor_role: 'member', payload: { actor_name: 'Ananya' },              created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'ca2', event_type: 'circle_message_sent', actor_role: 'member', payload: { actor_name: 'Mrs Sharma' },          created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'ca3', event_type: 'circle_invite_accepted', actor_role: 'member', payload: { member_name: 'Riya Kapoor' },     created_at: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_CIRCLE_THREADS: CircleThread[] = [
  { thread_id: 't1', kind: 'group', label: 'Wedding Family', last_message: { content: 'What time should we arrive?' }, last_active: new Date(Date.now() - 3600000).toISOString() },
  { thread_id: 't2', kind: 'dm',    label: 'Ananya (Sister)', role: 'sister', last_message: { content: 'Saved that red lehenga for you ♥' }, last_active: new Date(Date.now() - 3600000).toISOString() },
  { thread_id: 't3', kind: 'dm',    label: 'Mrs Sharma (Mom)', role: 'mother', last_message: { content: 'This is beautiful!' }, last_active: new Date(Date.now() - 7200000).toISOString() },
  { thread_id: 't4', kind: 'dm',    label: 'Riya Kapoor', role: 'best friend', last_message: null, last_active: null },
];

const MOCK_PROFILE: CoupleProfile = {
  name: 'Priya',
  partner_name: 'Rohan',
  wedding_date: '2026-11-19',
  wedding_city: 'Delhi',
  phone: '+918757788550',
  tier: 'platinum',
};

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────

// -- API FUNCTIONS ------------------------------------------------------------

export async function fetchReminders(): Promise<Reminder[]> {
  if (USE_MOCKS) return delay(MOCK_REMINDERS);
  const id = getCoupleId();
  // Reminders are events with kind='reminder' stored in the events table
  const r: any = await apiFetch(`/api/v2/couple/events/${id}?state=all`);
  const raw: any[] = (r?.events ?? []).filter((e: any) => e.kind === 'reminder');
  return raw.map(e => ({
    id:          e.id,
    couple_id:   id || '',
    text:        e.title || '',
    due_date:    e.event_date || null,
    is_complete: e.state === 'done',
    event:       e.notes || null,
  }));
}

export async function toggleReminder(id: string, is_complete: boolean): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try {
    await apiFetch(`/api/v2/couple/events/${id}/state`, {
      method: 'PATCH',
      body: JSON.stringify({ state: is_complete ? 'done' : 'upcoming' }),
    });
    return true;
  } catch { return false; }
}

export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/events/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function createReminder(data: {
  text: string; due_date?: string; event?: string;
}): Promise<Reminder | null> {
  if (USE_MOCKS) {
    const mock: Reminder = { id: `r-${Date.now()}`, couple_id: '', text: data.text, due_date: data.due_date||null, is_complete: false, event: data.event||null };
    return delay(mock);
  }
  try {
    const id = getCoupleId();
    const r: any = await apiFetch(`/api/v2/couple/events/${id}`, {
      method: 'POST',
      body: JSON.stringify({ title: data.text, event_date: data.due_date || new Date().toISOString().split('T')[0], kind: 'reminder', notes: data.event || null }),
    });
    const e = r?.event;
    if (!e) return null;
    return { id: e.id, couple_id: id||'', text: e.title||data.text, due_date: e.event_date||null, is_complete: false, event: e.notes||data.event||null };
  } catch { return null; }
}

export async function fetchExpenses(): Promise<Expense[]> {
  if (USE_MOCKS) return delay(MOCK_EXPENSES);
  const id = getCoupleId();
  // couple_receipts: id, booking_id, amount, vendor_name, description, receipt_date, image_url, tags
  const r: any = await apiFetch(`/api/v2/couple/expenses/${id}`);
  const raw: any[] = r?.expenses ?? [];
  return raw.map(e => ({
    id:             e.id,
    couple_id:      id || '',
    vendor_name:    e.vendor_name  || null,
    description:    e.description  || null,
    actual_amount:  e.amount       || null,   // amount → actual_amount
    payment_status: 'paid' as const,          // receipts vault = already paid
    receipt_url:    e.image_url    || null,   // image_url → receipt_url
    due_date:       e.receipt_date || null,
    category:       e.tags?.[0]   || null,
    event:          e.tags?.[1]   || null,
    notes:          null,
  }));
}

export async function createExpense(data: {
  vendor_name: string; amount: number; category?: string; event?: string; due_date?: string; notes?: string;
}): Promise<Expense | null> {
  if (USE_MOCKS) {
    const mock: Expense = { id: `exp-${Date.now()}`, couple_id: '', payment_status: 'pending', actual_amount: data.amount, ...data };
    return delay(mock);
  }
  try {
    const id = getCoupleId();
    // Map frontend fields → backend receipt fields
    const r: any = await apiFetch(`/api/v2/couple/receipts/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        vendor_name:  data.vendor_name,
        amount:       data.amount,
        description:  data.notes       || null,   // notes → description
        receipt_date: data.due_date    || null,   // due_date → receipt_date
        tags:         [data.category, data.event].filter(Boolean),  // category+event → tags[]
      }),
    });
    const e = r?.expense;
    if (!e) return null;
    return { id: e.id, couple_id: id||'', vendor_name: e.vendor_name||data.vendor_name, description: e.description||null, actual_amount: e.amount||data.amount, payment_status: 'paid' as const, category: e.tags?.[0]||data.category||null, event: e.tags?.[1]||data.event||null, due_date: e.receipt_date||data.due_date||null, notes: data.notes||null };
  } catch { return null; }
}

export async function markExpensePaid(_id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  return true; // couple_receipts are filed receipts — already paid
}

export async function deleteExpense(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/receipts/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchVendors(): Promise<CoupleVendor[]> {
  if (USE_MOCKS) return delay(MOCK_VENDORS);
  const id = getCoupleId();
  // couple_bookings: id, vendor_name, vendor_id, category, amount_total, amount_paid, state, notes
  const r: any = await apiFetch(`/api/v2/couple/bookings/${id}`);
  const raw: any[] = r?.bookings ?? [];
  return raw.map(b => ({
    id:           b.id,
    couple_id:    id || '',
    vendor_id:    b.vendor_id    || null,
    name:         b.vendor_name  || 'Vendor', // vendor_name → name
    category:     b.category     || null,
    phone:        null,
    status:       b.state        || null,     // state → status
    quoted_total: b.amount_total || null,     // amount_total → quoted_total
    paid_total:   b.amount_paid  || null,     // amount_paid → paid_total
    events:       null,
    notes:        b.notes        || null,
  }));
}

export async function createVendorRow(data: {
  name: string; category?: string; status?: string; quoted_total?: number; notes?: string;
}): Promise<CoupleVendor | null> {
  if (USE_MOCKS) {
    const mock: CoupleVendor = { id: `v-${Date.now()}`, couple_id: '', ...data };
    return delay(mock);
  }
  try {
    const id = getCoupleId();
    const r: any = await apiFetch(`/api/v2/couple/bookings/${id}`, {
      method: 'POST',
      body: JSON.stringify({ vendor_name: data.name, category: data.category, state: (['booked','advance_paid','paid'].includes(data.status||'') ? data.status : 'booked'), amount_total: data.quoted_total, notes: data.notes }),
    });
    const b = r?.booking;
    if (!b) return null;
    return { id: b.id, couple_id: id||'', name: b.vendor_name||data.name, category: b.category||null, status: b.state||'booked', quoted_total: b.amount_total||null, paid_total: 0, notes: b.notes||null };
  } catch { return null; }
}

export async function deleteVendorRow(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/bookings/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchEvents(): Promise<CoupleEvent[]> {
  if (USE_MOCKS) return delay(MOCK_EVENTS);
  const id = getCoupleId();
  // events table: id, title, event_date, event_time, kind, state, notes
  const r: any = await apiFetch(`/api/v2/couple/events/${id}`);
  const raw: any[] = (r?.events ?? []).filter((e: any) => e.kind !== 'reminder');
  return raw.map(e => ({
    id:           e.id,
    couple_id:    id || '',
    event_name:   e.title      || null, // title → event_name
    event_type:   e.kind       || null, // kind → event_type
    event_date:   e.event_date || null,
    venue:        null,
    task_count:   0,
    vendor_count: 0,
  }));
}

export async function createEvent(data: {
  event_name: string; event_date: string; venue?: string; notes?: string;
}): Promise<CoupleEvent | null> {
  if (USE_MOCKS) {
    const mock: CoupleEvent = { id: `ev-${Date.now()}`, couple_id: '', ...data, task_count: 0, vendor_count: 0 };
    return delay(mock);
  }
  try {
    const id = getCoupleId();
    const r: any = await apiFetch(`/api/v2/couple/events/${id}`, {
      method: 'POST',
      body: JSON.stringify({ title: data.event_name, event_date: data.event_date, venue: data.venue, notes: data.notes }),
    });
    const e = r?.event;
    if (!e) return null;
    return { id: e.id, couple_id: id||'', event_name: e.title||data.event_name, event_type: e.kind||null, event_date: e.event_date||data.event_date, venue: data.venue||null, task_count: 0, vendor_count: 0 };
  } catch { return null; }
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/events/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchCircleFeed(): Promise<CircleActivityEvent[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_FEED);
  const id = getCoupleId();
  // GET /api/v2/couple/circle/:id → { members, activity, pending_invites }
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  const raw: any[] = r?.activity ?? [];
  return raw.map(a => ({
    id:         a.id,
    event_type: a.activity_type || 'change',
    actor_role: (a.actor_role === 'bride' ? 'bride' : 'member') as 'bride' | 'member',
    payload: {
      actor_name:  a.member_name || null,
      member_name: a.member_name || null,
      content:     a.content     || null,
    },
    created_at: a.created_at,
  }));
}

export async function fetchCircleThreads(): Promise<CircleThread[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_THREADS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  const members: any[] = r?.members ?? [];
  // Use conversation_id (real conversations.id) not member.id for thread lookup
  // Only show members who have an active conversation (have sent at least one WA message)
  return members
    .filter(m => m.conversation_id)
    .map(m => ({
      thread_id:    `dm:${m.conversation_id}`,
      kind:         'dm' as const,
      label:        m.invitee_name || 'Circle member',
      role:         m.role         || null,
      last_message: null,
      last_active:  m.last_active  || m.joined_at || null,
    }));
}

export async function fetchCircleMessages(threadId: string): Promise<CircleMessage[]> {
  if (USE_MOCKS) return delay([]);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/frost/circle/threads/${id}/${threadId}/messages`);
  const raw: any[] = r?.data ?? [];
  return raw.map(m => ({
    id:          m.id,
    sender_name: m.direction === 'inbound' ? 'Circle member' : 'You',
    sender_role: (m.direction === 'inbound' ? 'member' : 'bride') as 'bride' | 'member',
    content:     m.body       || '',
    created_at:  m.created_at || new Date().toISOString(),
  }));
}

export async function sendCircleMessage(threadId: string, content: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true, 600);
  try {
    const coupleId = getCoupleId();
    const convoId = threadId.replace(/^dm:/, '');
    await apiFetch('/api/v2/frost/circle/messages', {
      method: 'POST',
      body: JSON.stringify({ userId: coupleId, thread_id: 'dm:' + convoId, body: content }),
    });
    return true;
  }
  catch { return false; }
}

export async function fetchProfile(): Promise<CoupleProfile> {
  if (USE_MOCKS) return delay(MOCK_PROFILE);
  const id = getCoupleId();
  // GET /api/v2/couple/profile/:id (public) → { success, data: { bride_name, groom_name, wedding_date } }
  const r: any = await apiFetch(`/api/v2/couple/profile/${id}`);
  const d = r?.data;
  if (!d) return MOCK_PROFILE;
  return {
    name:         d.bride_name   || '',
    partner_name: d.groom_name   || '',
    wedding_date: d.wedding_date || '',
    wedding_city: '',
    phone:        '',
    tier:         'lite',
  };
}

export async function saveProfile(patch: Partial<CoupleProfile>): Promise<boolean> {
  if (USE_MOCKS) return delay(true, 600);
  try {
    const id = getCoupleId();
    await apiFetch(`/api/v2/couple/me/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        partner_name: patch.partner_name,
        wedding_date: patch.wedding_date,
        wedding_city: patch.wedding_city,
      }),
    });
    return true;
  } catch { return false; }
}

export async function inviteCircleMember(invitee_name: string, _role: string): Promise<string | null> {
  if (USE_MOCKS) return delay('https://wa.me/14787788550?text=Hi', 600);
  try {
    const r: any = await apiFetch('/api/v2/couple/circle/invite', {
      method: 'POST',
      body: JSON.stringify({ invitee_name, role: 'inner_circle' }),
    });
    return r?.wa_me_link || null;
  } catch { return null; }
}

export async function createMuseSaveFromUrl(image_url: string, tags?: string[]): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try {
    const r: any = await apiFetch('/api/v2/couple/muse/save', {
      method: 'POST',
      body: JSON.stringify({ image_url, source_type: 'photo', aesthetic_tags: tags || [] }),
    });
    return r?.ok === true || r?.save_id != null;
  } catch { return false; }
}

export function fmtINR(n: number | null | undefined): string {
  if (!n) return '\u20b90';
  return '\u20b9' + n.toLocaleString('en-IN');
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

export function formatActivityLine(e: CircleActivityEvent): string {
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || e.payload?.member_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    // Real activity_type values from circle_activity table
    case 'save_added':              return `${actor} saved to Muse`;
    case 'comment':                 return `${actor} commented`;
    case 'removed':                 return `${actor} removed a save`;
    // Legacy / future values
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed a task`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}
