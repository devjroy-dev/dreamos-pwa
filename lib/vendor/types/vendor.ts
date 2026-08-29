// lib/vendor/types/vendor.ts
// TypeScript interfaces mirroring vendor contract request/response shapes.
// Every endpoint in lib/api/vendor.ts has a corresponding interface here.
// Contract drift = TypeScript compile error, not runtime bug.
// No `any`.

import type { LeadState, InvoiceState, EventKind, EventState, ExpenseCategory } from './common';

// ── Common ────────────────────────────────────────────────────────────────
export interface ApiOk { ok: true; }
export interface ApiErr { ok: false; error: string; }

// ── GET /api/v2/vendor/me ─────────────────────────────────────────────────
export interface MeResponse {
  ok: boolean;
  vendor: {
    id: string;
    name: string;
    business_name: string;
    category: string;
    city: string;
    handle: string;
    upi_id: string | null;
    gstin: string | null;
    open_to_travel: boolean;
    // F-10.81 — this union was ALREADY FALSE before the rename: 0114's tier flip
    // wrote 'free' on every halt and cancel, a value this type called impossible,
    // and tsc read zero because the value arrives at runtime from an API. 0115
    // retires both 'trial' and 'free' into the four ruled canon words, so the
    // union is true for the first time. Mirrors src/api/admin/vendors.js
    // VALID_TIERS and 0115's vendors_tier_check (live, proven refusing).
    tier: 'basic' | 'essential' | 'signature' | 'prestige';
    founding_cohort: boolean;
    // ── 0115 · THE VENDOR'S OWN MONEY STATE (Fork H, arm (a)) ───────────────
    // GET /api/v2/vendor/me gained these two rather than a second endpoint —
    // ADDING fields is RETIRE-WITH-THE-READER's safe direction, so no existing
    // surface can go dark on them. Typed here in the same arc the backend ships
    // them, because F-10.73 and F-10.81 are the same disease: a contract that
    // moved on one side while the other side's types said otherwise, and tsc,
    // reading no runtime values, said nothing.
    //
    // `billing_status` mirrors 0114's CHECK exactly. `null` on the link is a REAL
    // and currently COMMON answer — no Subscription Link has been issued for any
    // vendor yet — and the surface is required to say so plainly rather than
    // render a button that goes nowhere.
    billing_status: 'none' | 'active' | 'pending' | 'halted' | 'cancelled';
    razorpay_subscription_link: string | null;
    // TDW_10 BILLING v2. Declared because the SURFACE now needs it: a null link
    // no longer means one thing. A vendor who never subscribed and a vendor
    // whose plan is dead both read `link === null`, and only the id tells them
    // apart. Not a secret and not actionable — every self-serve door re-derives
    // the vendor from her own JWT and no endpoint accepts an id from the caller.
    razorpay_subscription_id: string | null;
    // F-10.92 — the lane flag, carried so the SURFACE can shut with the route.
    // Not a vendor attribute: an estate state, read from admin_config per request
    // through laneFlags' own cache so the client and the server cannot disagree.
    selfserve_enabled: boolean;
    aesthetic_tags: string[] | null;
    rate_min: number | null;
    rate_max: number | null;
    discover_preview: boolean;
    // TDW_04 B6-S1 (surfaces item 2): the capacity row. slot_capacity NULL = the
    // category default; capacity_default/capacity_applicable are computed BACKEND-
    // SIDE from occupancy.js's one-home map — the PWA never carries a copy.
    slot_capacity: number | null;
    capacity_default: number | null;
    capacity_applicable: boolean;
    // ── TDW_07 P2 ──────────────────────────────────────────────────────────
    // F-07.9's cure, client half. These fields ALWAYS existed as columns and the
    // vendor could always PATCH them; GET simply never returned them, so
    // hooks/vendor/useSettings.ts initialised five of them to '' and the screen
    // showed a placeholder over a stored value. instagram_handle was the worst of
    // them: the response DID carry it and the hook dropped it anyway. Declared here
    // so a field the editor writes is a field the editor can read.
    // instagram_handle was RETURNED by GET /me since before this sitting and never
    // declared here — which is part of how the hook came to drop it unnoticed.
    instagram_handle: string | null;
    style_notes: string | null;
    travel_notes: string | null;
    about: string | null;
    invoice_prefix: string | null;
    briefing_enabled: boolean;
    rate_display: boolean;
    discover_paused: boolean;
  };
}

// ── PATCH /api/v2/vendor/me ───────────────────────────────────────────────
export interface UpdateMeRequest {
  name?:             string;
  business_name?:    string;
  style_notes?:      string;
  city?:             string;
  open_to_travel?:   boolean;
  travel_notes?:     string;
  instagram_handle?: string;
  upi_id?:           string;
  gstin?:            string;
  briefing_enabled?: boolean;
  aesthetic_tags?:   string[];
  rate_min?:         number;
  rate_max?:         number;
  // B6-S1: null is MEANINGFUL here — it resets to the category default.
  slot_capacity?:    number | null;
  // TDW_07 P2 — the three additive allowlist entries (src/api/vendor/me.js).
  // `about` is F-07.8's cure: scored at 0.135 and rendered on the Discover card,
  // with zero writers anywhere in the estate until this sitting.
  about?:            string;
  rate_display?:     boolean;
  discover_paused?:  boolean;
}

export interface UpdateMeResponse {
  ok: true;
  vendor: {
    id:               string;
    name:             string | null;
    business_name:    string | null;
    city:             string | null;
    open_to_travel:   boolean;
    upi_id:           string | null;
    gstin:            string | null;
    aesthetic_tags:   string[];
    rate_min:         number | null;
    rate_max:         number | null;
    slot_capacity:    number | null;   // B6-S1
    discover_preview: boolean;
  };
}

// ── PATCH /api/v2/vendor/me/routing-handle ────────────────────────────────
export interface UpdateRoutingHandleRequest {
  routing_handle: string;
}

export interface UpdateRoutingHandleResponse {
  ok: true;
  routing_handle: string;
  wa_link: string;
}

// ── PATCH /api/v2/vendor/me/invoice-prefix ────────────────────────────────
export interface UpdateInvoicePrefixRequest {
  prefix: string;
}

export interface UpdateInvoicePrefixResponse {
  ok: true;
  prefix: string;
  current_counter: number;
}

// ── GET /api/v2/vendor/context/:vendorId ──────────────────────────────────
export interface VendorContextResponse {
  ok: boolean;
  vendor: { name: string; category: string; city: string; handle: string; };
  pending_invoices: Array<{ client_name: string; amount_owed: number; due_date: string | null; overdue: boolean; }>;
  upcoming_events: Array<{ title: string; kind: string; event_date: string; event_time: string | null; }>;
  new_leads: Array<{ name: string | null; wedding_date: string | null; budget_total: number | null; }>;
  recent_notes: Array<{ content: string; }>;
}

// ── GET /api/v2/vendor/worklist/today ─────────────────────────────────────
// THE FROZEN PHASE 4 CONTRACT, MIRRORED KEY-FOR-KEY.
// Source of authority: dream-os `docs/TDW_09_WORKLIST_P3_HANDOVER.md` §3, read at
// `7a03699`. This type is built against THAT SECTION and never against the handler.
// Any divergence is a labelled contract amendment, not an edit here.
//
// ⚠ IT IS NOT `TodayResponse`, AND THE TWO MUST NOT BE MERGED. `TodayResponse` below
// describes `/api/v2/vendor/today/:vendorId` — a route F-P3.9 records as deleted since
// `f47c732`, still read by `hooks/vendor/useVendorData.ts` and, until this delivery, by
// the storefront meter. Three attention kinds against five, no `has_any`, no `counts`,
// no `truncated`, no `done_today`, and a `:vendorId` this contract forbids. Two doors,
// two shapes, both named — F-39.9.
export type AttentionKind =
  | 'lead_unanswered' | 'invoice_due' | 'events_today' | 'contract_unsigned' | 'team_tasks';

/**
 * D-4's RANK ORDER, and the one place it is written down on this side of the wire.
 * §3 property 4: key order in `needs_attention` IS the ranking and JSON preserves it.
 * This array exists so a surface can iterate the kinds WITHOUT calling `Object.keys`
 * on a parsed body — but it is never used to re-sort, and the render reads the body's
 * own key order. It is the set, not the sequence authority.
 */
export const ATTENTION_KINDS: readonly AttentionKind[] = [
  'lead_unanswered', 'invoice_due', 'events_today', 'contract_unsigned', 'team_tasks',
] as const;

export interface AttentionLead {
  id: string; name: string | null;
  wedding_date: string | null; wedding_city: string | null;
  budget_min: number | null; budget_max: number | null;
  state: string; created_at: string;
  /** §3 property 7 · the wire's POSITIVE statement, never inferred from a missing field. */
  redacted: boolean;
}
export interface AttentionInvoice {
  id: string; invoice_number: string; client_name: string | null;
  amount_total: number; amount_paid: number; amount_owed: number;
  due_date: string | null; state: string;
}
export interface AttentionEvent {
  id: string; title: string | null; event_date: string;
  event_time: string | null; kind: string; slot: string | null; state: string;
}
export interface AttentionContract {
  id: string; title: string | null; state: string;
  sent_at: string | null; created_at: string;
}
export interface AttentionTask {
  id: string; title: string | null; due_date: string | null;
  priority: string | null; state: string; created_at: string;
}

export interface WorklistTodayResponse {
  ok: boolean;
  /** The IST calendar date the feed was cut for. */
  today: string;
  /** §3 property 6 · "has this vendor EVER had anything", not "is today busy". */
  has_any: boolean;
  needs_attention: {
    lead_unanswered: AttentionLead[];
    invoice_due: AttentionInvoice[];
    events_today: AttentionEvent[];
    contract_unsigned: AttentionContract[];
    team_tasks: AttentionTask[];
  };
  /** §3 property 8 · EXACTLY THREE KEYS. Leads and events carry no completion stamp. */
  done_today: {
    invoice_paid: Array<{ id: string; invoice_number: string; client_name: string | null; amount_total: number; last_payment_at: string | null }>;
    contract_signed: Array<{ id: string; title: string | null; signed_at: string | null }>;
    team_task_done: Array<{ id: string; title: string | null; completed_at: string | null }>;
  };
  counts: Record<AttentionKind, number>;
  truncated: Record<AttentionKind, boolean>;
}

// ── GET /api/v2/vendor/today/:vendorId ────────────────────────────────────
// ⚠ THE OLD DOOR. F-39.9: left untouched with its two readers
// (`hooks/vendor/useVendorData.ts:216`) so no one tidies it into the new one.
export interface TodayResponse {
  ok: boolean;
  vendor: { name: string; category: string; city: string; };
  needs_attention: {
    overdue_invoices: Array<{ id: string; client_name: string; amount_owed: number; due_date: string; }>;
    new_leads: Array<{ id: string; name: string; wedding_date: string | null; budget_total: number | null; created_at: string; }>;
    events_today: Array<{ id: string; title: string; kind: string; event_time: string | null; }>;
  };
  this_week: Array<{ id: string; title: string; kind: string; event_date: string; event_time: string | null; }>;
  money_snapshot: { total_outstanding: number; unpaid_count: number; advance_paid_count: number; };
  open_leads_count: number;
}

// ── GET /api/v2/vendor/leads/:vendorId ────────────────────────────────────
export interface LeadsResponse {
  ok: boolean;
  leads: Array<{
    id: string; name: string | null; wedding_date: string | null;
    wedding_city: string | null; budget_total: number | null;
    state: string; source: string | null; referrer: string | null;
    raw_message: string | null; created_at: string;
  }>;
  total: number;
}

export interface LeadStateResponse {
  ok: boolean;
  lead: { id: string; state: string; };
}

// ── POST /api/v2/vendor/leads ─────────────────────────────────────────────
export interface CreateLeadRequest {
  name:          string;
  phone?:        string;
  email?:        string;
  wedding_date?: string;
  wedding_city?: string;
  event_types?:  string[];
  budget_min?:   number;
  budget_max?:   number;
  source?:       string;
  referrer_name?: string;
  raw_message?:  string;
  notes?:        string;
}

export interface CreateLeadResponse {
  ok: true;
  data: Lead;
  deduped: boolean;
}

// ── PATCH /api/v2/vendor/leads/:leadId ───────────────────────────────────
// Block 1a — endpoint exists in spec; will be live after dream-os deploys.
export interface UpdateLeadRequest {
  name?:         string;
  phone?:        string;
  email?:        string;
  wedding_date?: string;
  wedding_city?: string;
  budget_min?:   number;
  budget_max?:   number;
  source?:       string;
  referrer_name?: string;
  raw_message?:  string;
  notes?:        string;
}

export interface UpdateLeadResponse {
  ok: true;
  lead: Lead;
}

// ── GET /api/v2/vendor/leads/:leadId/detail ──────────────────────────────

export interface ConversationMessage {
  direction:  'inbound' | 'outbound';
  body:       string;
  created_at: string;
  sent_by:    string;
}

export interface LeadDetailResponse {
  ok:             boolean;
  lead:           Lead;
  vendor_summary: string | null;
  conversation:   ConversationMessage[];
  invoices:       Invoice[];
  events:         VendorEvent[];
}

// ── GET /api/v2/vendor/clients/:vendorId ──────────────────────────────────
export interface ClientsResponse {
  ok: boolean;
  clients: Array<{ id: string; name: string; phone: string | null; email: string | null; notes: string | null; created_at: string; }>;
  total: number;
}

export interface ClientDetailResponse {
  ok: boolean;
  client: { id: string; name: string; phone: string | null; email: string | null; notes: string | null; };
  leads: Array<{ id: string; wedding_date: string | null; state: string; budget_total: number | null; }>;
  invoices: Array<{ id: string; amount_total: number; amount_paid: number; state: string; due_date: string | null; }>;
}

// ── POST /api/v2/vendor/clients ───────────────────────────────────────────
export interface CreateClientRequest {
  name:   string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface CreateClientResponse {
  ok: true;
  client:   Client;
  deduped:  boolean;
  restored: boolean;
}

// ── PATCH /api/v2/vendor/clients/:clientId ────────────────────────────────
export interface UpdateClientRequest {
  name?:  string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface UpdateClientResponse {
  ok: true;
  client: Client;
}

// ── GET /api/v2/vendor/invoices/:vendorId ─────────────────────────────────
export interface InvoicesResponse {
  ok: boolean;
  invoices: Array<{
    id: string; invoice_number: string; client_name: string;
    /** TDW_04 A3 (L-3): the binder's phone, for the cross-chip's key. Optional —
        a binder without a phone simply wears no chip (disclosed blindness). */
    client_phone?: string;
    amount_total: number; amount_paid: number; amount_owed: number;
    state: string; due_date: string | null; created_at: string;
  }>;
  summary: { total_outstanding: number; total_collected: number; };
  total: number;
}

// ── POST /api/v2/vendor/invoices ─────────────────────────────────────────
export interface CreateInvoiceRequest {
  client_name?:    string;
  client_phone?:   string;
  client_id?:      string;
  lead_id?:        string;
  description?:    string;
  amount_total:    number;
  amount_advance?: number;
  due_date?:       string;
  notes?:          string;
}

export interface CreateInvoiceResponse {
  ok: true;
  invoice:     Invoice;
  pdf_pending: true;
}

// ── PATCH /api/v2/vendor/invoices/:invoiceId ──────────────────────────────
export interface UpdateInvoiceRequest {
  client_name?:    string;
  client_phone?:   string;
  description?:    string;
  amount_total?:   number;
  amount_advance?: number;
  due_date?:       string;
  notes?:          string;
}

export interface UpdateInvoiceResponse {
  ok: true;
  invoice: Invoice;
}

// ── POST /api/v2/vendor/invoices/:invoiceId/payments ──────────────────────
export interface RecordPaymentRequest {
  amount: number;
  note?:  string;
}

export interface RecordPaymentResponse {
  ok: true;
  invoice:          Invoice | null;
  payment_recorded: number;
  new_state:        InvoiceState;
}

// ── GET /api/v2/vendor/invoices/:invoiceId/pdf ────────────────────────────
export interface InvoicePdfResponse {
  ok: true;
  pdf_url:    string;
  expires_in: number;
}

// ── GET /api/v2/vendor/expenses/:vendorId ─────────────────────────────────
export interface ExpensesResponse {
  ok: boolean;
  expenses: Array<{
    id: string; description: string | null; amount: number;
    category: string | null; expense_date: string | null;
    client_name: string | null; created_at: string;
  }>;
  total_spent: number;
  total: number;
}

// ── GET /api/v2/vendor/money/books/:vendorId ──────────────────────────────
// ROAD STEP 2b. THE ONLY TYPED-PLANE MONEY CONTRACT ON THIS BRANCH.
//
// `InvoicesResponse` and `ExpensesResponse` above still describe the ENGINE
// plane (`engine.records`, through `fetchCabinet` / `fetchLedger`) and they are
// untouched this sitting by ruling — arm (c). They cross at step 2c, reads and
// writes in one motion, because their row ids are binder ids that five live
// controls are keyed on. This shape shares nothing with them and exposes no id
// any control could use.
//
// EVERY FIGURE IS AN INTEGER OF RUPEES AND THE BALANCE IS SERVER-COMPUTED.
// The client never derives the chain: two renderers computing one running
// balance is two homes for it, and F-04.13 is the estate's record of what
// happens to the second one.
export interface BooksMovement {
  /** Composite and DELIBERATELY NOT A ROW ID — `invoice:<uuid>`, `expense:<uuid>`,
      `schedule:<invoice_id>:<ordinal>`. A React key, never an address: nothing
      in this room acts on a row, so nothing may be able to. */
  id: string;
  /** YYYY-MM-DD. */
  date: string;
  /** True when the estate holds no payment clock for this credit and the date
      shown is the invoice's `created_at` instead (F-39.8). The surface renders
      `booksUndated` beside it rather than passing the substitution off silently. */
  undated: boolean;
  credit: number | null;
  debit: number | null;
  balance: number;
}

export interface BooksResponse {
  ok: boolean;
  received: number;
  outstanding: number;
  movements: BooksMovement[];
  total: number;
  error?: string;
}

// ── POST /api/v2/vendor/expenses ─────────────────────────────────────────
export interface CreateExpenseRequest {
  amount:          number;
  category?:       ExpenseCategory;
  description?:    string;
  expense_date?:   string;
  client_name?:    string;
  linked_lead_id?: string;
  notes?:          string;
}

export interface CreateExpenseResponse {
  ok: true;
  expense: Expense;
}

// ── PATCH /api/v2/vendor/expenses/:expenseId ──────────────────────────────
export interface UpdateExpenseRequest {
  amount?:       number;
  category?:     ExpenseCategory;
  description?:  string;
  expense_date?: string;
  client_name?:  string;
  notes?:        string;
}

export interface UpdateExpenseResponse {
  ok: true;
  expense: Expense;
}

// ── GET /api/v2/vendor/events/:vendorId ───────────────────────────────────
export interface EventsResponse {
  ok: boolean;
  events: Array<{
    id: string; title: string; kind: string; event_date: string;
    event_time: string | null; state: string; lead_id: string | null; notes: string | null;
  }>;
  total: number;
  // B6-S1 (surfaces item 3, the horizon contract): the cap's honest tell —
  // true when the server's exact count exceeded the 200-row capped list.
  truncated?: boolean;
}

// ── POST /api/v2/vendor/events ───────────────────────────────────────────
export interface CreateEventRequest {
  title:           string;
  event_date:      string;
  event_time?:     string;
  kind?:           EventKind;
  linked_lead_id?: string;
  notes?:          string;
}

export interface CreateEventResponse {
  ok: true;
  event: VendorEvent;
}

// ── PATCH /api/v2/vendor/events/:eventId ──────────────────────────────────
export interface UpdateEventRequest {
  /** TDW_04 A3 (F-04.8): the events state door — values mirror the handler's
      ALLOWED_STATES, which mirror the DB CHECK. */
  state?:          'upcoming' | 'done' | 'cancelled';
  title?:          string;
  event_date?:     string;
  event_time?:     string;
  kind?:           EventKind;
  linked_lead_id?: string;
  notes?:          string;
  /** TDW_04 B6-S2: the day sheet's Move picker sends date + slot in one PATCH.
      The door validates against C2's four values (the mirrored-CHECK sentence). */
  slot?:           'morning' | 'noon' | 'evening' | 'full_day';
  /** TDW_04.5 P1 #6 (CE Ruling №10, seam a): the full crew SET for this booking.
      Backend semantics (writeEvent, 435a0dc): omitted = untouched · array = SET ·
      [] = clear. The day-sheet crew picker sends the whole toggled set on commit. */
  assigned_member_ids?: string[];
}

export interface UpdateEventResponse {
  ok: true;
  event: VendorEvent;
}

// ── GET /api/v2/vendor/availability/:vendorId ─────────────────────────────
export interface AvailabilityBlock {
  id:           string;
  blocked_date: string;
  reason:       string | null;
  created_at:   string;
  /** TDW_04 B6-S2 (0078): the block's slot — additive on the frozen wire.
      Pre-0078 payloads carry it as 'full_day'; absent means full_day. */
  slot?:        'morning' | 'noon' | 'evening' | 'full_day';
}

export interface AvailabilityResponse {
  ok: true;
  blocks: AvailabilityBlock[];
  total:  number;
}

// ── POST /api/v2/vendor/availability ─────────────────────────────────────
export interface BlockDateRequest {
  blocked_date: string;
  reason?:      string;
  /** TDW_04 B6-S2 (0078): omit = full_day (the pre-0078 behaviour, byte-identical). */
  slot?:        'morning' | 'noon' | 'evening' | 'full_day';
}

export interface BlockDateResponse {
  ok: true;
  block: AvailabilityBlock;
}

// ── GET /api/v2/hot-dates ─────────────────────────────────────────────────
export interface HotDate {
  date:   string;
  note:   string | null;
  region: string | null;
}

// ── GET /api/v2/vendor/day/:vendorId/:date (TDW_04 B6-S2, item 4 / P5) ────
export interface DayEvent {
  id:               string;
  title:            string;
  kind:             string;
  slot:             string | null;
  event_time:       string | null;
  state:            string;
  notes:            string | null;
  lead_id:          string | null;
  linked_binder_id: string | null;
  /** Binder chip name (engine hop, fail-soft): null = no chip, ST-2's disclosed blindness. */
  binder_name:      string | null;
  /** TDW_04.5 P1 #6 (CE Ruling №10, seam b): the crew on this booking. The day-fetch
      normalizes null/absent to [] so this is ALWAYS an array — the picker seeds its
      toggles from it and computes the full-array SET it PATCHes back. */
  assigned_member_ids: string[];
}
export interface DayBlock {
  id:     string;
  slot:   'morning' | 'noon' | 'evening' | 'full_day';
  reason: string | null;
  title:  string;
}
export interface DayMilestone {
  id:             string;
  invoice_id:     string;
  label:          string;
  amount_due:     number;
  client_name:    string | null;
  invoice_number: string | null;
  ordinal:        number;
  of:             number | null;
}
export interface DayFollowup {
  id:           string;
  client:       string | null;
  note:         string | null;
  repeat_every: string | null;
}
export interface VendorDayResponse {
  ok:         true;
  date:       string;
  events:     DayEvent[];
  blocks:     DayBlock[];
  hot:        { note: string | null; label: string | null } | null;
  milestones: DayMilestone[];
  followups:  DayFollowup[];
}

// ── GET /api/v2/vendor/bands/:vendorId?from&to (TDW_04.5 P2 — the band view) ──
// The wire contract of src/api/vendor/bands.js. Every field below is what that
// handler actually returns; nothing is aspirational.
export interface BandCrew {
  member_id:    string;
  name:         string;
  /** "Swati Rao" -> "SR". Computed backend-side so both repos can never disagree. */
  initials:     string;
  role:         string | null;
  /** 0087 §D's three states — the RING vocabulary: pending = hollow ·
      confirmed = solid brass-line · declined = terracotta (CE ruling F6). */
  confirmation: 'pending' | 'confirmed' | 'declined';
  /** P4's assign-external bridge row. False for every crew member today. */
  external:     boolean;
}
export interface BandFunction {
  event_id:   string;
  date:       string;
  slot:       string | null;
  kind:       string;
  title:      string;
  event_time: string | null;
  crew:       BandCrew[];
  /** occupying && crew empty — decided backend-side by occupancy.js's `isOccupying`,
      never by a client-side kind list. Renders the hollow pulsing pip. */
  gap:        boolean;
}
/** The FOUR RAW WITNESSED CELLS (CE ruling F2(b)) — engine.records amount/direction/
    amount_received/amount_pending. NOT a money story: the band view applies the estate's
    CANON (derive.ts::pendingOf, F-04.13) to these. No second rule exists anywhere. */
export interface BandMoneyCells {
  amount:          number | null;
  direction:       string | null;
  amount_received: number | null;
  amount_pending:  number | null;
}
export interface Band {
  binder_id: string;
  /** null = the binder didn't resolve; the view renders "Untitled wedding". */
  title:     string | null;
  span:      { start: string; end: string };
  /** null = no cells, or the engine hop failed => NO whisper is drawn, never ₹0. */
  money:     BandMoneyCells | null;
  functions: BandFunction[];
}
export interface BandsResponse {
  ok:    true;
  bands: Band[];
  /** Functions with no linked_binder_id — rendered, never dropped. */
  loose: BandFunction[];
  /** CE ruling F1(c): computed server-side by normaliseCategory — the predicate's one
      home. The client obeys; absent/unknown falls to 'month'. */
  default_view: 'weddings' | 'month';
  /** The category default_view was computed FROM — makes the founder's smoke witness
      self-evidencing without a DB pre-read. */
  category:  string | null;
  truncated: boolean;
}

export interface HotDatesResponse {
  ok: true;
  dates: HotDate[];
  total: number;
}

// ── Session type ─────────────────────────────────────────────────────────
export interface VendorSession {
  id:            string;
  user_id:       string;
  name:          string | null;
  phone:         string | null;
  tier:          string;
  access_token:  string;
  refresh_token: string;
}

// ── Context sub-types (used by briefing.ts) ───────────────────────────────
export interface PendingInvoice {
  client_name: string;
  amount_owed: number;
  due_date:    string | null;
  overdue:     boolean;
}

export interface UpcomingEvent {
  title:      string;
  kind:       string;
  event_date: string;
  event_time: string | null;
}

// ── Row types (used by hooks/useVendorData, calendar, list pages) ─────────
export interface Client {
  id:         string;
  name:       string;
  phone:      string | null;
  email:      string | null;
  notes:      string | null;
  created_at: string;
}

export interface Lead {
  id:                      string;
  name:                    string | null;
  phone:                   string | null;
  wedding_date:            string | null;
  wedding_date_precision?: 'day' | 'month' | 'year' | null;
  wedding_city:            string | null;
  budget_total:            number | null;
  /** F-16.25 (R-37.21): the band's FLOOR in whole rupees, from
      `public.leads.budget_min`. A floor with a NULL `budget_total` is the
      open-ended top band; both null is silence. Deliberately NOT folded into
      `budget_total`, which is the CEILING wearing an alias. */
  budget_min?:             number | null;
  /** M-LEADGATE-RECUT (R-36.13 / R-37.23): the wire says out loud that this
      row's mode-to-connect was withheld for tier. Absent on paying tiers.
      The surface keys on THIS, never on an absent `phone`. */
  redacted?:               boolean;
  state:                   string;
  source:                  string | null;
  referrer:                string | null;
  raw_message:             string | null;
  notes?:                  string | null; // TDW_04 A2 (F-04.7): on the wire for the read-row
  created_at:              string;
  /** M-LEADS-TRUTH (R-35.35): this lead is linkage-backed — an engagement on the
      TDW_16 spine points at it. Read through src/lib/engagements.js's batched
      export, NEVER off `leads.source`, which createLead's phone-dedupe can never
      set (F-16.21). DECLARED GAP: pre-P1 engagements carry a NULL lead_id and do
      not badge until their next enquiry refreshes them. */
  tdw?:                    boolean;
  /** R2 (R-35.38): WHEN the Discover enquiry came, from the spine's
      `engagements.updated_at` — NOT `created_at`, which is the LEAD's birthday.
      On the founder's own row those are 21 Aug and 5 Aug: the lead was born from
      a WhatsApp arrival and createLead's phone-dedupe returned it untouched
      sixteen days later (F-16.22). Null on unbadged rows.
      F-04.10 binds this field — this type is the mapper half; a wire the
      interface cannot see is no wire at all. */
  tdw_enquired_at?:        string | null;
  // TDW_04 A1: the P3 wishbone wire, typed to leadDraftWire's exact shape
  // (leads.js, verified at HEAD 5773888). Present only while cells are missing;
  // completion promotes the row and the wire disappears.
  draft?: {
    missing: string[];
    complete_inline: { method: 'PATCH'; path: string };
    tell_victor: { path: '/vendor'; primer: string };
  };
}

export interface Invoice {
  id:             string;
  invoice_number: string;
  client_name:    string;
  client_phone?:  string;
  amount_total:   number;
  amount_paid:    number;
  amount_owed:    number;
  state:          string;
  due_date:       string | null;
  created_at:     string;
}

export interface Expense {
  id:           string;
  description:  string | null;
  amount:       number;
  category:     string | null;
  expense_date: string | null;
  client_name:  string | null;
  created_at:   string;
}

export interface VendorEvent {
  id:         string;
  title:      string;
  kind:       string;
  event_date: string;
  event_time: string | null;
  state:      string;
  lead_id:    string | null;
  /** TDW_04 A3 (L-3): the calendar row's twin binder — closes TDW_03's logged
      upstream gap (the column existed; the wire never carried it). OPTIONAL by
      design: payloads that predate the wire (and demo fixtures) simply carry no
      chip, which is ST-2's disclosed blindness, not a lie. */
  linked_binder_id?: string | null;
  notes:      string | null;
}

// ── POST /api/v2/vendor/chat ──────────────────────────────────────────────
export interface ContactCard {
  name:   string;
  phone:  string;
  draft?: string;
  link?:  string;
}

export interface ClarifyOption {
  label: string;
  value: string;
}

export interface ClarifyPayload {
  question: string;
  options:  (ClarifyOption | string)[];
}

export interface ChatResponse {
  ok:       boolean;
  reply:    string;
  tool_calls: string[];
  contact?:  ContactCard;
  clarify?:  ClarifyPayload;
  refresh?:  boolean;
  error?:    string;
}

// ── Auth endpoints ────────────────────────────────────────────────────────
export interface SendOtpResponse    { ok: boolean; error?: string; }
export interface VerifyOtpResponse  { ok: boolean; access_token?: string; refresh_token?: string; vendor_id?: string; user_id?: string; pin_set?: boolean; tier?: string; name?: string; category?: string; error?: string; }
export interface PinStatusResponse  { ok: boolean; has_pin: boolean; }
export interface PinLoginResponse   { ok: boolean; access_token?: string; vendor_id?: string; name?: string; error?: string; }

// ── Block 5 — Discover / Portfolio / Couture / Featured ───────────────────────

export interface PortfolioImage {
  id:             string;
  image_url:      string;
  caption:        string | null;
  aesthetic_tags: string[];
  is_hero:        boolean;
  in_carousel:    boolean;
  approval_state: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at:     string;
  /** TDW_07 P3 (0102) — the ordering authority. position 0 is the cover. */
  position?:      number;
}

export interface PortfolioListResponse {
  ok: boolean;
  images: PortfolioImage[];
  total: number;
}

export interface UploadUrlResponse {
  ok: boolean;
  upload_url: string;
  params: {
    api_key: string;
    timestamp: number;
    signature: string;
    folder: string;
    public_id: string;
  };
}

// ── TDW_07 P4b · F5 — THE PREVIEW'S PAYLOAD ───────────────────────────────────────────
// GET /api/v2/vendor/discover/preview. `vendor` is shaped by the SAME backend function the
// public feed uses (src/lib/discover/shapeVendor.js), so this is deliberately typed as the
// couple-facing `DiscoverVendor` and NOT as a vendor-shaped near-miss. If the two ever
// needed different types, they would have already stopped being the same card.
//
// The flags around it are production truths, not preview decoration: they answer "can a
// couple reach this card right now", which is precisely what the vendor came to find out.
export interface DiscoverPreviewResponse {
  ok: true;
  vendor: import('@/lib/types/discover').DiscoverVendor;
  discover_paused: boolean;
  discover_eligible: boolean;
  is_live: boolean;
  /** Every approved photo the vendor holds. */
  approved_photo_count: number;
  /** How many of them reach the card — the five-photo display rule, server-decided. */
  displayed_photo_count: number;
}

export interface DiscoverStatus {
  ok: boolean;
  discover_request_state: string;
  discover_eligible: boolean;
  portfolio_summary: { total: number; approved: number; pending: number; rejected: number };
  // TDW_07 P2 · CE ruling §F — the SERVER carries the floor so the client renders a
  // number it was told rather than one it typed. Optional because a client may run
  // against a backend deployed before this field; DISCOVER_PHOTO_FLOOR in
  // lib/vendor/discoverFloor.ts is the comment-bound fallback, never the authority.
  min_portfolio_images?: number;
  /** TDW_07 P3 · cap site 4 — the server's number; the surface never mints its own. */
  max_portfolio_images?: number;
  /** TDW_07 P3 · CE §B — the IG entry renders only when the seam is configured. */
  ig_import_enabled?: boolean;
  saves_count?: number;
  current_request: { id: string; state: string; decided_at: string | null } | null;
  last_decision_reason: string | null;
  /** F-10.44 — the vendor's own pitch while a request is OPEN. Exactly one of
   *  this and `last_decision_reason` is ever non-null; the server splits the
   *  double-duty column on state so a pitch is never shown back as a verdict. */
  pitch?: string | null;
  /** ── F-10.59 · WHAT A COUPLE CAN ACTUALLY DO ────────────────────────────────
   *  `discover_request_state` says what the founder DECIDED. `live_now` says
   *  whether a couple can see her RIGHT NOW. They are two facts, and a screen
   *  that branches on the first alone told a vendor 「 You're on Discover. Your
   *  work is live 」 while every couple's feed had already dropped her.
   *  Optional because a client may run against a backend deployed before it —
   *  and the screen degrades to the state alone, which is exactly today's
   *  behaviour, never something worse. */
  live_now?: boolean;
}

export interface CoutureSlot {
  id: string;
  slot_at: string;
  duration_minutes: number;
  fee_inr: number;
  state: 'open' | 'booked' | 'blocked';
}

export interface CoutureAppointment {
  id: string;
  appointment_at: string;
  duration_minutes: number;
  fee_inr: number;
  state: string;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface FeaturedSubmission {
  id: string;
  slot_kind: string;
  caption: string | null;
  proposed_start_date: string | null;
  proposed_end_date: string | null;
  fee_inr: number;
  state: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  rejection_reason: string | null;
  created_at: string;
}


// ── Studio Suite (Block 6) ────────────────────────────────────────────────

export interface TeamMember {
  id:             string;
  vendor_id:      string;
  name:           string;
  role:           string | null;
  phone:          string | null;
  daily_rate_inr: number | null;
  notes:          string | null;
  active:         boolean;
  deleted_at:     string | null;
  created_at:     string;
  updated_at:     string;
  // TDW_04.5 P3 — 0087 §B. The crew page's capability token. It has always been on
  // the wire (team.js answered `select('*')`); it was simply undeclared here. The
  // backend now answers with an explicit column list (F-04.106) of which this is a
  // decided member, because "Send page" builds the link from it.
  // TREAT AS A SECRET: never render it, never log it, never put it in a query string
  // that leaves the vendor's own device except as the crew link itself.
  page_token:     string;
}

// TDW_04.5 P3 — the public crew page's wire contract (GET /api/v2/crew/:token).
// THE SHAPE IS THE SECURITY BOUNDARY: there is no money, no phone, no member id and
// no other member anywhere in it, by construction rather than by filtering. `note` is
// the crew member's OWN note from crew_confirmations — never events.notes (CE ruling
// F7). If you are tempted to widen this interface, that is the conversation.
export interface CrewAssignment {
  event_id:     string;
  date:         string;
  slot:         string | null;
  title:        string;
  wedding:      string | null;
  call_time:    string | null;
  confirmation: 'pending' | 'confirmed' | 'declined';
  note:         string | null;
}
export interface CrewTask {
  task_id:     string;
  title:       string;
  description: string | null;
  due_date:    string | null;
  priority:    string | null;
}
export interface CrewPageResponse {
  ok:          true;
  member:      { name: string };
  vendor:      { name: string | null };
  assignments: CrewAssignment[];
  tasks:       CrewTask[];
}

export interface TeamTask {
  id:                    string;
  vendor_id:             string;
  assigned_to_member_id: string | null;
  linked_event_id:       string | null;
  title:                 string;
  description:           string | null;
  due_date:              string | null;
  priority:              'low' | 'normal' | 'high' | 'urgent';
  state:                 'open' | 'in_progress' | 'done' | 'cancelled';
  completed_at:          string | null;
  deleted_at:            string | null;
  created_at:            string;
  updated_at:            string;
  team_members?:         { id: string; name: string; role: string | null } | null;
}

export interface TeamMessage {
  id:              string;
  vendor_id:       string;
  body:            string;
  pinned:          boolean;
  sent_to_count:   number | null;
  linked_event_id: string | null;
  created_at:      string;
}

export interface TeamPayment {
  id:              string;
  vendor_id:       string;
  team_member_id:  string;
  linked_event_id: string | null;
  linked_task_id:  string | null;
  description:     string | null;
  amount_inr:      number;
  state:           'owed' | 'paid' | 'cancelled';
  paid_at:         string | null;
  paid_via:        string | null;
  notes:           string | null;
  created_at:      string;
  updated_at:      string;
  team_members?:   { name: string } | null;
}

export interface TeamPaymentBalance {
  team_member_id: string;
  name:           string;
  owed_inr:       number;
  paid_inr:       number;
}

export interface StudioBriefing {
  today:                string;
  today_events:         Array<{ id: string; title: string; event_time: string | null; state: string; team_assigned: Array<{ id: string; name: string }> }>;
  open_tasks:           TeamTask[];
  overdue_tasks:        TeamTask[];
  pinned_messages:      TeamMessage[];
  this_week_calendar:   Array<{ id: string; title: string; event_date: string; event_time: string | null; state: string }>;
  team_owed_total_inr:  number;
  team_owed_per_member: Array<{ team_member_id: string; name: string; owed_inr: number }>;
}

// ── Block 7: Schedules / Contracts / TDS ─────────────────────────────────

export interface ScheduleMilestone {
  id:              string;
  invoice_id:      string;
  vendor_id:       string;
  milestone_label: string;
  pct:             number;
  amount_due:      number;
  due_date:        string | null;
  state:           'pending' | 'paid' | 'waived';
  paid_at:         string | null;
  paid_amount:     number | null;
  ordinal:         number;
  created_at:      string;
  updated_at:      string;
}

export interface Contract {
  id:           string;
  vendor_id:    string;
  client_id:    string | null;
  lead_id:      string | null;
  invoice_id:   string | null;
  title:        string;
  storage_path: string | null;
  file_size:    number | null;
  mime_type:    string;
  notes:        string | null;
  state:        'draft' | 'sent' | 'signed' | 'cancelled';
  sent_at:      string | null;
  signed_at:    string | null;
  created_at:   string;
  updated_at:   string;
}

export interface TdsEntry {
  id:             string;
  vendor_id:      string;
  invoice_id:     string | null;
  client_id:      string | null;
  client_name:    string;
  client_pan:     string | null;
  client_tan:     string | null;
  gross_amount:   number;
  tds_rate:       number;
  tds_amount:     number;
  net_received:   number;
  section:        string | null;
  deduction_date: string;
  financial_year: string;
  certificate_no: string | null;
  notes:          string | null;
  created_at:     string;
  updated_at:     string;
}

export interface TdsSummary {
  ok:             boolean;
  financial_year: string;
  total_gross:    number;
  total_tds:      number;
  total_net:      number;
  entry_count:    number;
  by_section:     Array<{ section: string; gross: number; tds: number; count: number }>;
}
