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
  try { return localStorage.getItem('access_token'); } catch { return null; }
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

export async function fetchReminders(): Promise<Reminder[]> {
  if (USE_MOCKS) return delay(MOCK_REMINDERS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/couple/checklist/${id}`);
  return r?.data ?? [];
}

export async function toggleReminder(id: string, is_complete: boolean): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/checklist/${id}`, { method: 'PATCH', body: JSON.stringify({ is_complete }) }); return true; }
  catch { return false; }
}

export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/checklist/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchExpenses(): Promise<Expense[]> {
  if (USE_MOCKS) return delay(MOCK_EXPENSES);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/couple/expenses/${id}`);
  return r?.data ?? [];
}

export async function markExpensePaid(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/expenses/${id}`, { method: 'PATCH', body: JSON.stringify({ payment_status: 'paid' }) }); return true; }
  catch { return false; }
}

export async function deleteExpense(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/expenses/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchVendors(): Promise<CoupleVendor[]> {
  if (USE_MOCKS) return delay(MOCK_VENDORS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/couple/vendors/${id}`);
  return r?.data ?? [];
}

export async function deleteVendorRow(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/vendors/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchEvents(): Promise<CoupleEvent[]> {
  if (USE_MOCKS) return delay(MOCK_EVENTS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/couple/events/${id}`);
  return r?.data ?? [];
}

export async function fetchCircleFeed(): Promise<CircleActivityEvent[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_FEED);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/frost/circle/feed/${id}`);
  return r?.data ?? [];
}

export async function fetchCircleThreads(): Promise<CircleThread[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_THREADS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/frost/circle/threads/${id}`);
  return r?.data ?? [];
}

export async function fetchCircleMessages(threadId: string): Promise<CircleMessage[]> {
  if (USE_MOCKS) return delay([]);
  const r: any = await apiFetch(`/api/v2/frost/circle/messages/${threadId}`);
  return r?.data ?? [];
}

export async function sendCircleMessage(threadId: string, content: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true, 600);
  try { await apiFetch(`/api/v2/frost/circle/messages`, { method: 'POST', body: JSON.stringify({ thread_id: threadId, content }) }); return true; }
  catch { return false; }
}

export async function fetchProfile(): Promise<CoupleProfile> {
  if (USE_MOCKS) return delay(MOCK_PROFILE);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/couple/profile/${id}`);
  return r?.data ?? MOCK_PROFILE;
}

export async function saveProfile(patch: Partial<CoupleProfile>): Promise<boolean> {
  if (USE_MOCKS) return delay(true, 600);
  try { const id = getCoupleId(); await apiFetch(`/api/v2/couple/profile/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }); return true; }
  catch { return false; }
}

export function fmtINR(n: number | null | undefined): string {
  if (!n) return '₹0';
  return '₹' + n.toLocaleString('en-IN');
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
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed: ${p.task_text || 'a task'}`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}
