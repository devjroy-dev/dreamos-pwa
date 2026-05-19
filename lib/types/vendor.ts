// lib/types/vendor.ts
// ─────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces mirroring the exact response shapes of dream-os vendor
// endpoints. Verified against:
//   - docs/API_CONTRACTS.md (contract spec)
//   - src/api/vendor/*.js   (actual handler output — schema mapping included)
//
// Field naming uses snake_case to match the wire format 1:1. Components that
// want camelCase can rename at the boundary; doing it in the type would create
// a layer where drift can happen.
//
// IMPORTANT NULLABILITY NOTES (from reading the route handlers, not contract):
//   - me.js: every nullable field falls back to null, EVEN those typed as
//     boolean in the contract. Verified: open_to_travel uses `=== true`, so
//     never null. founding_cohort same. But name/business_name/category/city
//     can legitimately be null for partially-onboarded vendors — handlers
//     return `|| null` for each.
//   - today.js: vendor.name is users.name (joined). NOT vendors.name (no such
//     column). vendor.category and vendor.city come from vendors table.
//   - leads.js: contract shape uses `referrer` and `budget_total`. Schema
//     uses referrer_name and budget_max. Mapping happens server-side.
//
// CONTRACT IDENTITY ASSURANCE: when USE_MOCKS=false, every endpoint returns
// these exact shapes. When USE_MOCKS=true, mocks/vendor.ts returns the same.
// Screens consume from these interfaces — never from raw fetch — so the flip
// is invisible to the UI layer.
// ─────────────────────────────────────────────────────────────────────────────

// ─── /vendor/me ─────────────────────────────────────────────────────────────
export type VendorTier = 'trial' | 'essential' | 'signature' | 'prestige';

export interface VendorMe {
  id: string;
  name: string | null;            // users.name (the person)
  business_name: string | null;   // vendors.business_name (studio)
  category: string | null;
  city: string | null;
  handle: string | null;          // vendors.routing_handle (e.g. DEV550)
  upi_id: string | null;
  gstin: string | null;
  open_to_travel: boolean;
  tier: VendorTier | null;
  founding_cohort: boolean;
  // P2-9 fields (currently stubbed null/false on backend until migrations 0024+0029)
  aesthetic_tags: string[] | null;
  rate_min: number | null;
  rate_max: number | null;
  discover_preview: boolean;
}

export interface VendorMeResponse {
  ok: true;
  vendor: VendorMe;
}

// ─── /vendor/today/:vendorId ────────────────────────────────────────────────
export interface TodayOverdueInvoice {
  id: string;
  client_name: string;
  amount_owed: number;
  due_date: string;
}

export interface TodayNewLead {
  id: string;
  name: string | null;
  wedding_date: string | null;
  budget_total: number | null;
  created_at: string;
}

export interface TodayEventToday {
  id: string;
  title: string;
  kind: string;
  event_time: string | null;
}

export interface TodayThisWeekEvent {
  id: string;
  title: string;
  kind: string;
  event_date: string;
  event_time: string | null;
}

export interface VendorTodayResponse {
  ok: true;
  vendor: {
    name: string | null;
    category: string | null;
    city: string | null;
  };
  needs_attention: {
    overdue_invoices: TodayOverdueInvoice[];
    new_leads: TodayNewLead[];
    events_today: TodayEventToday[];
  };
  this_week: TodayThisWeekEvent[];
  money_snapshot: {
    total_outstanding: number;
    unpaid_count: number;
    advance_paid_count: number;
  };
  open_leads_count: number;
}

// ─── /vendor/leads/:vendorId ────────────────────────────────────────────────
export type LeadState = 'new' | 'contacted' | 'quoted' | 'booked' | 'lost';

export interface Lead {
  id: string;
  name: string | null;
  wedding_date: string | null;
  wedding_city: string | null;
  budget_total: number | null;   // mapped from leads.budget_max server-side
  state: LeadState;
  source: string | null;
  referrer: string | null;       // mapped from leads.referrer_name server-side
  raw_message: string | null;
  created_at: string;
}

export interface VendorLeadsResponse {
  ok: true;
  leads: Lead[];
  total: number;
}

export interface VendorLeadsQuery {
  state?: LeadState | 'all';
  limit?: number;
  offset?: number;
}

// ─── PATCH /vendor/leads/:leadId/state ──────────────────────────────────────
export interface LeadStatePatchBody {
  state: LeadState;
  reason?: string | null;
}

export interface LeadStatePatchResponse {
  ok: true;
  lead: {
    id: string;
    state: LeadState;
  };
}

// ─── /vendor/clients/:vendorId ──────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export interface VendorClientsResponse {
  ok: true;
  clients: Client[];
  total: number;
}

export interface VendorClientsQuery {
  limit?: number;
  offset?: number;
}

// ─── /vendor/clients/:vendorId/:clientId ────────────────────────────────────
export interface ClientDetail {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
}

export interface ClientLinkedLead {
  id: string;
  wedding_date: string | null;
  state: LeadState;
  budget_total: number | null;
}

export interface ClientLinkedInvoice {
  id: string;
  amount_total: number;
  amount_paid: number;
  state: InvoiceState;
  due_date: string | null;
}

export interface VendorClientDetailResponse {
  ok: true;
  client: ClientDetail;
  leads: ClientLinkedLead[];
  invoices: ClientLinkedInvoice[];
}

// ─── /vendor/invoices/:vendorId ─────────────────────────────────────────────
export type InvoiceState = 'unpaid' | 'advance_paid' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount_total: number;
  amount_paid: number;
  amount_owed: number;   // computed server-side: amount_total - amount_paid
  state: InvoiceState;
  due_date: string | null;
  created_at: string;
}

export interface VendorInvoicesResponse {
  ok: true;
  invoices: Invoice[];
  summary: {
    total_outstanding: number;
    total_collected: number;
  };
  total: number;
}

export interface VendorInvoicesQuery {
  state?: InvoiceState | 'all';
  limit?: number;
  offset?: number;
}

// ─── /vendor/expenses/:vendorId ─────────────────────────────────────────────
export type ExpenseCategory =
  | 'travel' | 'equipment' | 'assistant' | 'studio' | 'marketing'
  | 'software' | 'food' | 'printing' | 'commission' | 'shoot'
  | 'inventory' | 'other';

export interface Expense {
  id: string;
  description: string | null;
  amount: number;
  category: ExpenseCategory | string | null;  // schema CHECK constraint, but accept any string for forward compat
  expense_date: string | null;
  client_name: string | null;
  created_at: string;
}

export interface VendorExpensesResponse {
  ok: true;
  expenses: Expense[];
  total_spent: number;
  total: number;
}

export interface VendorExpensesQuery {
  limit?: number;
  offset?: number;
}

// ─── /vendor/events/:vendorId ───────────────────────────────────────────────
export type EventKind =
  | 'shoot' | 'call' | 'meeting' | 'recce' | 'fitting'
  | 'trial' | 'ceremony' | 'reminder' | 'other'
  | 'task' | 'family' | 'social'; // schema CHECK widened to 12 values in B1

export type EventState = 'upcoming' | 'done' | 'cancelled';

export interface VendorEvent {
  id: string;
  title: string;
  kind: EventKind | string;
  event_date: string;
  event_time: string | null;
  state: EventState;
  lead_id: string | null;
  notes: string | null;
}

export interface VendorEventsResponse {
  ok: true;
  events: VendorEvent[];
  total: number;
}

export interface VendorEventsQuery {
  from?: string;     // YYYY-MM-DD
  to?: string;       // YYYY-MM-DD
  state?: EventState | 'all';
  kind?: EventKind;
}

// ─── /vendor/context/:vendorId ──────────────────────────────────────────────
export interface ContextPendingInvoice {
  client_name: string;
  amount_owed: number;
  due_date: string | null;
  overdue: boolean;
}

export interface ContextUpcomingEvent {
  title: string;
  kind: string;
  event_date: string;
  event_time: string | null;
}

export interface ContextNewLead {
  name: string | null;
  wedding_date: string | null;
  budget_total: number | null;
}

export interface ContextRecentNote {
  content: string;
}

export interface VendorContextResponse {
  ok: true;
  vendor: {
    name: string | null;
    category: string | null;
    city: string | null;
    handle: string | null;
  };
  pending_invoices: ContextPendingInvoice[];
  upcoming_events: ContextUpcomingEvent[];
  new_leads: ContextNewLead[];
  recent_notes: ContextRecentNote[];
}

// ─── POST /vendor/chat ──────────────────────────────────────────────────────
export interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface VendorChatBody {
  vendor_id: string;
  message: string;
  history: ChatHistoryTurn[];
}

export interface VendorChatResponse {
  ok: true;
  reply: string;
  tool_calls: string[];
}
