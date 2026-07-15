// lib/vendor/api/vendor.ts
// One exported async function per vendor contract endpoint.
// Screen components import from here — never raw fetch.

import { getJson, postJson, patchJson, API_BASE, getAuthHeader } from './_base';
import { getVendorSession, setVendorSession, clearVendorSession } from '@/lib/vendor/session';
import type {
  MeResponse, VendorContextResponse, TodayResponse,
  LeadsResponse,
  ClientsResponse, ClientDetailResponse,
  InvoicesResponse, ExpensesResponse, EventsResponse,
  ChatResponse, ContactCard, ClarifyPayload,
  SendOtpResponse, VerifyOtpResponse, PinStatusResponse, PinLoginResponse,
} from '../types/vendor';

// ── Profile ───────────────────────────────────────────────────────────────
export function fetchMe(): Promise<MeResponse> {
  return getJson<MeResponse>('/api/v2/vendor/me');
}

// ── Context (snapshot panel) ──────────────────────────────────────────────
export function fetchContext(vendorId: string): Promise<VendorContextResponse> {
  return getJson<VendorContextResponse>(`/api/v2/vendor/context/${vendorId}`);
}

// ---- The Cabinet (binder-native dashboard read) ----
export type CabinetBinder = {
  id: string;
  client: string | null;
  amount: number | null;
  amount_received: number | null;
  amount_pending: number | null;
  payment_status: string | null;
  direction: 'in' | 'out' | null;
  date: string | null;
  stage: string | null;
  note: string | null;
  followup_on: string | null;
  followup_note: string | null;
  phone: string | null;
  created_at?: string | null;
  // TDW_03 P2: the rest of the live payload (vendor-engine/cabinet.js
  // RECORD_SELECT + the TDW_02 P3 completeness wire) — typed to code truth.
  updated_at?: string | null;
  reason_for_action?: string | null;
  doc_ref?: string | null;
  repeat_every?: string | null;
  missing_cells?: string[];
  draft?: {
    missing: string[];
    complete_inline: { method: 'POST'; path: string };
    tell_victor: { path: '/vendor'; primer: string };
  };
};
export type CabinetEvent = {
  id: string;
  title: string | null;
  kind: string | null;
  event_date: string | null;
  event_time: string | null;
  state: string | null;
  notes: string | null;
};
export type CabinetReminder =
  | ({ source: 'event' } & CabinetEvent)
  | { source: 'binder'; id: string; client: string | null; followup_on: string | null; followup_note: string | null; binder?: CabinetBinder };
export type CabinetResponse = {
  ok: boolean;
  vendor?: { name: string | null; category: string | null; city: string | null; handle: string | null };
  clients: CabinetBinder[];
  leads: CabinetBinder[];
  paid: CabinetBinder[];
  owed: CabinetBinder[];
  booked: CabinetEvent[];
  reminders: CabinetReminder[];
  counts?: { clients: number; leads: number; paid: number; owed: number; booked: number; reminders: number };
  error?: string;
};
export function fetchCabinet(vendorId: string): Promise<CabinetResponse> {
  return getJson<CabinetResponse>(`/api/v2/vendor/cabinet/${vendorId}`);
}

// ── Binder adapters (Piece 4-A) ──────────────────────────────
// The List is binder-native now: the four typed reads are VIEWS over the one
// free-form ledger. /cabinet already slices clients/leads/paid/owed with the soft
// match; /binders gives the flat ledger (expenses = direction 'out'). The typed
// shapes below are populated from binders — components and the Studio look untouched.
// Fields with no binder column (wedding_city, budget, email, category) live in the
// note as prose and map to null; they surface in the binder's story.

export type LedgerResponse = { ok: boolean; count: number; binders: CabinetBinder[]; error?: string };
export function fetchLedger(vendorId: string): Promise<LedgerResponse> {
  return getJson<LedgerResponse>(`/api/v2/vendor/binders/${vendorId}`);
}

function binderToClient(b: CabinetBinder): ClientsResponse['clients'][number] {
  return { id: b.id, name: b.client ?? '', phone: b.phone ?? null, email: null, notes: b.note ?? null, created_at: b.created_at ?? '' };
}
// binderToLead RETIRED (TDW_03 (A), CE-ruled): the leads adapter crossed LD-1.
// Clients/invoices/expenses adapters stay — records own binders and money.

function invoiceState(b: CabinetBinder): string {
  const owed = b.amount_pending ?? 0;
  const paid = b.amount_received ?? 0;
  // Derive from the real figures so the pill never contradicts the paid/owed shown.
  if (paid > 0 || owed > 0) {
    if (owed <= 0) return 'paid';        // nothing left to collect
    if (paid > 0) return 'advance_paid'; // money in, balance still owed
    return 'unpaid';                     // nothing received yet
  }
  // No received/pending breakdown on this binder — fall back to stored status.
  return b.payment_status ?? 'unpaid';
}
function binderToInvoice(b: CabinetBinder): InvoicesResponse['invoices'][number] {
  const paid = b.amount_received ?? 0;
  const owed = b.amount_pending ?? 0;
  const total = (paid + owed) || (b.amount ?? 0);
  return {
    id: b.id, invoice_number: '', client_name: b.client ?? '',
    amount_total: total, amount_paid: paid, amount_owed: owed,
    state: invoiceState(b), due_date: b.date ?? null, created_at: b.created_at ?? '',
  };
}
function binderToExpense(b: CabinetBinder): ExpensesResponse['expenses'][number] {
  return {
    id: b.id, description: b.note ?? null, amount: b.amount ?? 0,
    category: null, expense_date: b.date ?? null, client_name: b.client ?? null, created_at: b.created_at ?? '',
  };
}

// ── Binder write helpers (Piece 4-B) ────────────────────────────
// Form writes go free-form through Kriya via /binders/* — the SAME hands the chat
// path uses. The screen is just another caller. vendorId is resolved from the
// session here, so form signatures don't change. Fields with no binder column
// (city, budget, source, email, category) fold into the note as prose.
type BinderWriteResponse = { ok: boolean; message?: string; binder?: CabinetBinder | null; error?: string };
function currentVendorId(): string | null { return getVendorSession()?.id ?? null; }
function noVendor(): ApiErr { return { ok: false, error: 'No vendor session — please sign in again.' }; }
function foldNote(...lines: Array<string | null | undefined>): string | undefined {
  const out = lines.map((l) => (l ?? '').toString().trim()).filter(Boolean);
  return out.length ? out.join('\n') : undefined;
}
function rupeeLine(min?: number | null, max?: number | null): string | null {
  const f = (n: number) => 'Rs ' + n.toLocaleString('en-IN');
  if (min != null && max != null) return `Budget: ${f(min)}–${f(max)}`;
  if (min != null) return `Budget: ${f(min)}`;
  if (max != null) return `Budget: ${f(max)}`;
  return null;
}
function binderBase(v: string) { return `/api/v2/vendor/binders/${v}`; }

// TDW_03 P2 — the binder edit door (POST, the door's real verb; SCHEMA.md
// appendix corrected the spec literal's PATCH). Field names are the handler's
// exactly (vendor-engine/binderWrite.js /edit → donna_edit): client, date,
// note, phone, doc_ref, stage. NOTE APPENDS through this door — a line beneath
// what stands (verified: donna_edit passes appendAlso {'note'}); the UI labels
// it as adding to the story, never as replacing.
export type BinderEditFields = {
  client?: string; date?: string; note?: string;
  phone?: string; doc_ref?: string; stage?: string;
};
export function editBinder(binderId: string, fields: BinderEditFields): Promise<BinderWriteResponse> {
  const v = currentVendorId();
  if (!v) return Promise.resolve({ ok: false, error: 'No vendor session — please sign in again.' });
  return postJson<BinderWriteResponse>(`${binderBase(v)}/${binderId}/edit`, fields);
}

// ── Chat history (3.0-B: display-only scrollback) ─────────────────────────
export type ChatHistoryMessage = { id: string; role: 'user' | 'ai'; text: string; at: string };
export type ChatHistoryResponse = { ok: boolean; messages: ChatHistoryMessage[]; error?: string };
export function fetchChatHistory(vendorId: string, limit = 10): Promise<ChatHistoryResponse> {
  return getJson<ChatHistoryResponse>(`/api/v2/vendor/chat/history/${vendorId}?limit=${limit}`);
}

// ── Today dashboard ───────────────────────────────────────────────────────
export function fetchToday(vendorId: string): Promise<TodayResponse> {
  return getJson<TodayResponse>(`/api/v2/vendor/today/${vendorId}`);
}

// ── Leads ─────────────────────────────────────────────────────────────────
// TDW_03 (A) repoint, CE-ruled 2026-07-14: leads read the TYPED plane again.
// LD-1: typed tables own leads. 02-P1 moved the writes to public.leads; the
// Piece 4-A binder adapter kept the reads on cabinet.leads — retired as drift.
// The typed route carries the full P3 wire (draft + wishbone) per row.
export function fetchLeads(vendorId: string, state = 'all'): Promise<LeadsResponse> {
  return getJson<LeadsResponse>(`/api/v2/vendor/leads/${vendorId}?state=${state}`);
}

export function patchLeadState(leadId: string, state: string, reason?: string): Promise<LeadStateResponse> {
  // TDW_03 (A): typed door restored — PATCH /leads/:id/state (reason optional,
  // lands in the notes trail per the handler's own contract).
  return patchJson<LeadStateResponse>(`/api/v2/vendor/leads/${leadId}/state`, reason ? { state, reason } : { state });
}

// ── Clients ───────────────────────────────────────────────────────────────
export async function fetchClients(vendorId: string): Promise<ClientsResponse> {
  const cab = await fetchCabinet(vendorId);
  const clients = (cab.clients ?? []).map(binderToClient);
  return { ok: cab.ok, clients, total: clients.length };
}

export async function fetchClientDetail(vendorId: string, clientId: string): Promise<ClientDetailResponse> {
  const led = await fetchLedger(vendorId);
  const b = (led.binders ?? []).find((x) => x.id === clientId);
  const client = b
    ? { id: b.id, name: b.client ?? '', phone: b.phone ?? null, email: null, notes: b.note ?? null }
    : { id: clientId, name: '', phone: null, email: null, notes: null };
  return { ok: led.ok && !!b, client, leads: [], invoices: [] };
}

// ── Invoices ──────────────────────────────────────────────────────────────
export async function fetchInvoices(vendorId: string, state = 'all'): Promise<InvoicesResponse> {
  const cab = await fetchCabinet(vendorId);
  const byId = new Map<string, CabinetBinder>();
  for (const b of [...(cab.paid ?? []), ...(cab.owed ?? [])]) byId.set(b.id, b);
  let invoices = [...byId.values()].map(binderToInvoice);
  if (state !== 'all') invoices = invoices.filter((i) => i.state.toLowerCase() === state.toLowerCase());
  const summary = {
    total_outstanding: invoices.reduce((s, i) => s + i.amount_owed, 0),
    total_collected: invoices.reduce((s, i) => s + i.amount_paid, 0),
  };
  return { ok: cab.ok, invoices, summary, total: invoices.length };
}

// ── Expenses ──────────────────────────────────────────────────────────────
export async function fetchExpenses(vendorId: string): Promise<ExpensesResponse> {
  const led = await fetchLedger(vendorId);
  const expenses = (led.binders ?? []).filter((b) => b.direction === 'out').map(binderToExpense);
  const total_spent = expenses.reduce((s, e) => s + e.amount, 0);
  return { ok: led.ok, expenses, total_spent, total: expenses.length };
}

// ── Events ────────────────────────────────────────────────────────────────
export function fetchEvents(vendorId: string, state = 'upcoming'): Promise<EventsResponse> {
  return getJson<EventsResponse>(`/api/v2/vendor/events/${vendorId}?state=${state}`);
}

// ── Chat — JSON fallback (mock / non-streaming clients) ───────────────────
export function sendChat(vendorId: string, message: string, history: {role:string;content:string}[], aiPrimer?: string): Promise<ChatResponse> {
  const body: Record<string,unknown> = { vendor_id: vendorId, message, history };
  if (aiPrimer) body.ai_primer = aiPrimer;
  return postJson<ChatResponse>('/api/v2/vendor/chat', body);
}

// ── Chat — SSE streaming ──────────────────────────────────────────────────
// Sends Accept: text/event-stream. Backend streams text_delta events
// word-by-word, then a done event with tool_calls, refresh, contact, clarify.
//
// Calls onDelta(text) for each streamed word.
// Calls onDone(result) when the stream closes with the full result.
// Returns a cleanup function — call it to abort the stream.

export type SuggestionsPayload = {
  intro?: string | null;
  suggestions: { label: string; value: string }[];
};

export type StreamDonePayload = {
  meta?: { tier: string; turns_used: number; turns_cap: number; state: 'ok' | 'nearing' | 'capped'; upgrade?: { label: string; href: string } }; // TDW_02 P5
  tool_calls: string[];
  refresh?: boolean;
  contact?: ContactCard;
  clarify?: ClarifyPayload;
  suggestions?: SuggestionsPayload;
};

// The pair-at-work beats the firewall emits on the wire (3-B). Myra's prose
// rides as text_delta; these three describe what her operator did underneath.
export type UndoSpec = { method: string; path: string; body?: Record<string, unknown> };
export type FilingBeat = {
  kind: 'operator_action' | 'error'; action?: string; detail?: string;
  summary?: string; record_ref?: { plane: string; id: string };
  undo?: UndoSpec; retryable?: boolean;
};
export type StreamBeat =
  | { kind: 'handoff'; message: string }
  | ({ kind: 'operator_action' } & Omit<FilingBeat, 'kind'>)
  | ({ kind: 'error' } & Omit<FilingBeat, 'kind'>)
  | { kind: 'operator_report'; message: string };

// TDW_02 P6: fire an undo through its witnessed door. True on ok.
export async function undoCall(undo: UndoSpec): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}${undo.path}`, {
      method: undo.method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      ...(undo.body ? { body: JSON.stringify(undo.body) } : {}),
    });
    const j = await res.json().catch(() => null);
    return !!(j && j.ok);
  } catch { return false; }
}

export function streamChat(
  vendorId: string,
  message: string,
  aiPrimer: string | undefined,
  onDelta: (text: string) => void,
  onDone: (result: StreamDonePayload) => void,
  onError: (msg: string) => void,
  onBeat?: (beat: StreamBeat) => void,
): () => void {
  const controller = new AbortController();
  const bodyPayload: Record<string, unknown> = { vendor_id: vendorId, message, history: [] };
  if (aiPrimer) bodyPayload.ai_primer = aiPrimer;
  const bodyStr = JSON.stringify(bodyPayload);

  async function attemptStream(retried = false): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...getAuthHeader(),
    };

    const res = await fetch(`${API_BASE}/api/v2/vendor/chat`, {
      method: 'POST',
      headers,
      body: bodyStr,
      signal: controller.signal,
    });

    // ── Token refresh on 401 ───────────────────────────────────────────
    if (res.status === 401 && !retried) {
      try {
        // Use getVendorSession() — reads from cookies when localStorage is
        // blocked (iOS Safari Private Browsing) or cleared by ITP.
        const session = getVendorSession();
        if (!session?.refresh_token) throw new Error('no refresh token');

        const refreshRes = await fetch(`${API_BASE}/api/v2/vendor/auth/refresh`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ refresh_token: session.refresh_token }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json().catch(() => null);
          if (data?.access_token) {
            setVendorSession({
              ...session,
              access_token:  data.access_token,
              refresh_token: data.refresh_token || session.refresh_token,
            });
            return attemptStream(true);
          }
        }
      } catch {
        // Refresh failed — fall through to redirect
      }
      clearVendorSession();
      if (typeof window !== 'undefined') window.location.href = '/';
      return;
    }

    if (!res.ok || !res.body) {
      onError('Connection failed. Try again.');
      return;
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer    = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') return;

        try {
          const event = JSON.parse(payload);
          if (event.type === 'text_delta' && event.text) {
            onDelta(event.text);
          } else if (event.type === 'handoff') {
            onBeat?.({ kind: 'handoff', message: event.message ?? '' });
          } else if (event.type === 'operator_action') {
            onBeat?.({
              kind: event.kind === 'error' ? 'error' : 'operator_action',
              action: event.kind ?? '', detail: event.detail ?? '',
              summary: event.summary, record_ref: event.record_ref,
              undo: event.undo, retryable: event.retryable, // TDW_02 P6
            });
          } else if (event.type === 'operator_report') {
            onBeat?.({ kind: 'operator_report', message: event.message ?? '' });
          } else if (event.type === 'done') {
            onDone({
              tool_calls: event.tool_calls ?? [],
              refresh:    event.refresh,
              contact:    event.contact,
              clarify:    event.clarify,
              meta:       event.meta, // TDW_02 P5: the tier meter, every turn
            });
          } else if (event.type === 'error') {
            onError(event.message ?? 'Agent error. Try again.');
          }
        } catch {
          // Malformed SSE line — skip
        }
      }
    }
  }

  (async () => {
    try {
      await attemptStream();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      onError('Network error. Try again.');
    }
  })();

  return () => controller.abort();
}


// ── Auth ──────────────────────────────────────────────────────────────────
export function sendOtp(phone: string): Promise<SendOtpResponse> {
  return postJson<SendOtpResponse>('/api/v2/vendor/auth/send-otp', { phone }, false);
}

export function verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
  return postJson<VerifyOtpResponse>('/api/v2/vendor/auth/verify-otp', { phone, otp, purpose: 'login' }, false);
}

export function pinStatus(phone: string): Promise<PinStatusResponse> {
  return getJson<PinStatusResponse>(`/api/v2/auth/pin-status?phone=${encodeURIComponent(phone)}&role=vendor`, false);
}

export function pinLogin(phone: string, pin: string): Promise<PinLoginResponse> {
  return postJson<PinLoginResponse>('/api/v2/vendor/auth/pin-login', { phone, pin }, false);
}

export function setPin(vendorId: string, pin: string): Promise<{ ok: boolean }> {
  return postJson<{ ok: boolean }>('/api/v2/vendor/auth/set-pin', { vendor_id: vendorId, pin }, false);
}

export function forgotPin(phone: string): Promise<SendOtpResponse> {
  return postJson<SendOtpResponse>('/api/v2/vendor/auth/forgot-pin', { phone }, false);
}

// ════════════════════════════════════════════════════════════════════
// Block 1b — typed write functions (20 new exports)
// ════════════════════════════════════════════════════════════════════

import { deleteJson } from './_base';
import type {
  // Common
  ApiErr,
  LeadStateResponse,
  // Leads
  CreateLeadRequest, CreateLeadResponse,
  UpdateLeadRequest, UpdateLeadResponse, LeadDetailResponse,
  // Clients
  CreateClientRequest, CreateClientResponse,
  UpdateClientRequest, UpdateClientResponse,
  // Invoices
  CreateInvoiceRequest, CreateInvoiceResponse,
  UpdateInvoiceRequest, UpdateInvoiceResponse,
  RecordPaymentRequest, RecordPaymentResponse,
  InvoicePdfResponse,
  // Expenses
  CreateExpenseRequest, CreateExpenseResponse,
  UpdateExpenseRequest, UpdateExpenseResponse,
  // Events
  CreateEventRequest, CreateEventResponse,
  UpdateEventRequest, UpdateEventResponse,
  // Profile
  UpdateMeRequest, UpdateMeResponse,
  UpdateRoutingHandleRequest, UpdateRoutingHandleResponse,
  UpdateInvoicePrefixRequest, UpdateInvoicePrefixResponse,
  // Availability
  AvailabilityResponse, BlockDateRequest, BlockDateResponse,
  // Hot dates
  HotDatesResponse,
  // Shared row types
  Lead, Client, Invoice, Expense, VendorEvent,
} from '../types/vendor';

// ── Leads ─────────────────────────────────────────────────────────────────

export function createLead(body: CreateLeadRequest): Promise<CreateLeadResponse | ApiErr> {
  // TDW_03 (A): typed door — POST /leads takes every field natively (city,
  // budget, source, referrer, email, event_types); the note-folding shim is
  // retired with the adapter. Returns {ok, data, deduped} per the handler.
  return postJson<CreateLeadResponse>('/api/v2/vendor/leads', body);
}

// TDW_04 A2 (L-2, F-04.2's cure): the REAL soft-delete door — removes the
// snapshot line server-side. The masquerade (PATCH state:'lost' as "delete")
// is dead; every delete caller routes here.
export function deleteLead(leadId: string): Promise<{ ok: boolean; deleted?: { id: string }; error?: string }> {
  return deleteJson(`/api/v2/vendor/leads/${leadId}`);
}

// TDW_04 A2: binder hide/unarchive — the honest undo pair (a REAL reversal
// door exists, so hide commits immediately and UNDO calls /unarchive).
export function hideBinder(binderId: string): Promise<BinderWriteResponse> {
  const v = currentVendorId();
  if (!v) return Promise.resolve({ ok: false, error: 'No vendor session — please sign in again.' });
  return postJson<BinderWriteResponse>(`${binderBase(v)}/${binderId}/hide`, {});
}
export function unarchiveBinder(binderId: string): Promise<BinderWriteResponse> {
  const v = currentVendorId();
  if (!v) return Promise.resolve({ ok: false, error: 'No vendor session — please sign in again.' });
  return postJson<BinderWriteResponse>(`${binderBase(v)}/${binderId}/unarchive`, {});
}

export function updateLead(leadId: string, body: UpdateLeadRequest): Promise<UpdateLeadResponse | ApiErr> {
  // TDW_03 (A): typed door — PATCH /leads/:id, native fields, {ok, lead} back.
  // This is also P3's complete_inline target; one door, both callers.
  return patchJson<UpdateLeadResponse>(`/api/v2/vendor/leads/${leadId}`, body);
}

export function fetchLeadDetail(leadId: string): Promise<LeadDetailResponse | ApiErr> {
  // TDW_03 (A): typed detail restored — vendor_summary + the couple
  // conversation ride the handler (the adapter shim returned them empty).
  return getJson<LeadDetailResponse>(`/api/v2/vendor/leads/${leadId}/detail`);
}

/** Convenience wrapper — sets state to 'lost'. */
export function loseLead(leadId: string, reason?: string): Promise<LeadStateResponse | ApiErr> {
  return patchLeadState(leadId, 'lost', reason);
}

// ── Clients ───────────────────────────────────────────────────────────────

export async function createClient(body: CreateClientRequest): Promise<CreateClientResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const note = foldNote(body.notes, body.email ? `Email: ${body.email}` : null);
  const r = await postJson<BinderWriteResponse>(binderBase(v), {
    client: body.name, phone: body.phone, note, stage: 'client',
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not create client.' };
  return { ok: true, client: binderToClient(r.binder), deduped: false, restored: false };
}

export async function updateClient(clientId: string, body: UpdateClientRequest): Promise<UpdateClientResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const note = foldNote(body.notes, body.email ? `Email: ${body.email}` : null);
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${clientId}/edit`, {
    client: body.name, phone: body.phone, note,
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not update client.' };
  return { ok: true, client: binderToClient(r.binder) };
}

/** Hard delete — leads.client_id and invoices.client_id are SET NULL on delete. */
export async function deleteClient(clientId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${clientId}/hide`, {});
  if (!r.ok) return { ok: false, error: r.error || 'Could not remove.' };
  return { ok: true, deleted: true };
}

// ── Invoices ──────────────────────────────────────────────────────────────

export async function createInvoice(body: CreateInvoiceRequest): Promise<CreateInvoiceResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const total = body.amount_total ?? 0;
  const received = Math.min(body.amount_advance ?? 0, total);
  const pending = Math.max(0, total - received);
  const status = pending <= 0 ? 'paid' : received > 0 ? 'advance_paid' : 'unpaid';
  // 1. Resolve the binder: an existing client/lead, else open a fresh one.
  let binderId = body.client_id || body.lead_id || null;
  if (!binderId) {
    const note = foldNote(body.description, body.due_date ? `Due: ${body.due_date}` : null, body.notes);
    const opened = await postJson<BinderWriteResponse>(binderBase(v), {
      client: body.client_name, phone: body.client_phone, date: body.due_date, note, stage: 'client',
    });
    if (!opened.ok || !opened.binder) return { ok: false, error: opened.error || 'Could not open invoice binder.' };
    binderId = opened.binder.id;
  }
  // 2. Set owed vs received through the witnessed money door.
  const m = await postJson<BinderWriteResponse>(`${binderBase(v)}/${binderId}/money-edit`, {
    amount_received: String(received), amount_pending: String(pending), payment_status: status,
  });
  if (!m.ok || !m.binder) return { ok: false, error: m.error || 'Could not set invoice amount.' };
  return { ok: true, invoice: binderToInvoice(m.binder), pdf_pending: true };
}

export async function updateInvoice(invoiceId: string, body: UpdateInvoiceRequest): Promise<UpdateInvoiceResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // 1. Non-money cells through /edit (note grows).
  const note = foldNote(body.description, body.notes);
  if (body.client_name != null || body.client_phone != null || body.due_date != null || note) {
    const e = await postJson<BinderWriteResponse>(`${binderBase(v)}/${invoiceId}/edit`, {
      client: body.client_name, phone: body.client_phone, date: body.due_date, note,
    });
    if (!e.ok) return { ok: false, error: e.error || 'Could not update invoice.' };
  }
  // 2. Money cells (total/advance) through the witnessed door, recomputed against ground truth.
  let binder = null as CabinetBinder | null;
  if (body.amount_total != null || body.amount_advance != null) {
    const led = await fetchLedger(v);
    const cur = (led.binders ?? []).find((x) => x.id === invoiceId);
    const curReceived = cur?.amount_received ?? 0;
    const total = body.amount_total ?? curReceived + (cur?.amount_pending ?? 0);
    const received = body.amount_advance != null ? Math.min(body.amount_advance, total) : curReceived;
    const pending = Math.max(0, total - received);
    const status = pending <= 0 ? 'paid' : received > 0 ? 'advance_paid' : 'unpaid';
    const m = await postJson<BinderWriteResponse>(`${binderBase(v)}/${invoiceId}/money-edit`, {
      amount_received: String(received), amount_pending: String(pending), payment_status: status,
    });
    if (!m.ok || !m.binder) return { ok: false, error: m.error || 'Could not update invoice amount.' };
    binder = m.binder;
  }
  // 3. If only non-money changed, re-read for fresh truth.
  if (!binder) {
    const led = await fetchLedger(v);
    binder = (led.binders ?? []).find((x) => x.id === invoiceId) ?? null;
  }
  if (!binder) return { ok: false, error: 'Invoice not found.' };
  return { ok: true, invoice: binderToInvoice(binder) };
}

export async function recordPayment(invoiceId: string, body: RecordPaymentRequest): Promise<RecordPaymentResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // Ground-truth before mutation: read the real figures, never the screen's copy.
  const led = await fetchLedger(v);
  const b = (led.binders ?? []).find((x) => x.id === invoiceId);
  if (!b) return { ok: false, error: 'Invoice not found.' };
  const pay = body.amount ?? 0;
  const newReceived = (b.amount_received ?? 0) + pay;
  const newPending = Math.max(0, (b.amount_pending ?? 0) - pay);
  const status = newPending <= 0 ? 'paid' : 'advance_paid';
  const m = await postJson<BinderWriteResponse>(`${binderBase(v)}/${invoiceId}/money-edit`, {
    amount_received: String(newReceived), amount_pending: String(newPending), payment_status: status,
  });
  if (!m.ok || !m.binder) return { ok: false, error: m.error || 'Could not record payment.' };
  return { ok: true, invoice: binderToInvoice(m.binder), payment_recorded: pay, new_state: status };
}

export function fetchInvoicePdf(invoiceId: string): Promise<InvoicePdfResponse | ApiErr> {
  return getJson<InvoicePdfResponse | ApiErr>(`/api/v2/vendor/invoices/${invoiceId}/pdf`);
}

/** Cancel invoice — sets state to 'cancelled'. Alias: "delete" / "remove" per standing rule. */
export { patchInvoiceCancel as cancelInvoice };
function patchInvoiceCancel(invoiceId: string): Promise<{ ok: true; invoice: { id: string; state: string } } | ApiErr> {
  return patchJson<{ ok: true; invoice: { id: string; state: string } } | ApiErr>(`/api/v2/vendor/invoices/${invoiceId}/cancel`, {});
}

// ── Expenses ──────────────────────────────────────────────────────────────

export async function createExpense(body: CreateExpenseRequest): Promise<CreateExpenseResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const note = foldNote(body.description, body.category ? `Category: ${body.category}` : null, body.notes);
  const r = await postJson<BinderWriteResponse>(binderBase(v), {
    client: body.client_name || body.description || 'Expense',
    amount: body.amount, direction: 'out', date: body.expense_date, note, stage: 'expense',
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not record expense.' };
  return { ok: true, expense: binderToExpense(r.binder) };
}

export async function updateExpense(expenseId: string, body: UpdateExpenseRequest): Promise<UpdateExpenseResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // Non-money cells through /edit.
  const note = foldNote(body.description, body.category ? `Category: ${body.category}` : null, body.notes);
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${expenseId}/edit`, {
    client: body.client_name, date: body.expense_date, note,
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not update expense.' };
  // Amount, if changed, through the witnessed money door (single figure, direction out).
  let binder = r.binder;
  if (body.amount != null) {
    const m = await postJson<BinderWriteResponse>(`${binderBase(v)}/${expenseId}/money-edit`, {
      amount: String(body.amount), direction: 'out',
    });
    if (!m.ok || !m.binder) return { ok: false, error: m.error || 'Could not update expense amount.' };
    binder = m.binder;
  }
  return { ok: true, expense: binderToExpense(binder) };
}

export async function deleteExpense(expenseId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${expenseId}/hide`, {});
  if (!r.ok) return { ok: false, error: r.error || 'Could not remove.' };
  return { ok: true, deleted: true };
}

// ── Events ────────────────────────────────────────────────────────────────

export function createEvent(body: CreateEventRequest): Promise<CreateEventResponse | ApiErr> {
  return postJson<CreateEventResponse | ApiErr>('/api/v2/vendor/events', body);
}

export function updateEvent(eventId: string, body: UpdateEventRequest): Promise<UpdateEventResponse | ApiErr> {
  return patchJson<UpdateEventResponse | ApiErr>(`/api/v2/vendor/events/${eventId}`, body);
}

export function deleteEvent(eventId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  return deleteJson<{ ok: true; deleted: true } | ApiErr>(`/api/v2/vendor/events/${eventId}`);
}

export function cancelEvent(eventId: string): Promise<{ ok: true; event: { id: string; state: string } } | ApiErr> {
  return patchJson<{ ok: true; event: { id: string; state: string } } | ApiErr>(`/api/v2/vendor/events/${eventId}/cancel`, {});
}

// ── Profile ───────────────────────────────────────────────────────────────

export function updateMe(body: UpdateMeRequest): Promise<UpdateMeResponse | ApiErr> {
  return patchJson<UpdateMeResponse | ApiErr>('/api/v2/vendor/me', body);
}

export function updateRoutingHandle(body: UpdateRoutingHandleRequest): Promise<UpdateRoutingHandleResponse | ApiErr> {
  return patchJson<UpdateRoutingHandleResponse | ApiErr>('/api/v2/vendor/me/routing-handle', body);
}

export function updateInvoicePrefix(body: UpdateInvoicePrefixRequest): Promise<UpdateInvoicePrefixResponse | ApiErr> {
  return patchJson<UpdateInvoicePrefixResponse | ApiErr>('/api/v2/vendor/me/invoice-prefix', body);
}

// ── Availability ──────────────────────────────────────────────────────────

export function fetchAvailability(vendorId: string, from?: string, to?: string): Promise<AvailabilityResponse | ApiErr> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to)   params.set('to', to);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return getJson<AvailabilityResponse | ApiErr>(`/api/v2/vendor/availability/${vendorId}${qs}`);
}

export function blockDate(body: BlockDateRequest): Promise<BlockDateResponse | ApiErr> {
  return postJson<BlockDateResponse | ApiErr>('/api/v2/vendor/availability', body);
}

export function unblockDate(blockId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  return deleteJson<{ ok: true; deleted: true } | ApiErr>(`/api/v2/vendor/availability/${blockId}`);
}

// ── Hot dates ─────────────────────────────────────────────────────────────

export function fetchHotDates(): Promise<HotDatesResponse | ApiErr> {
  return getJson<HotDatesResponse | ApiErr>('/api/v2/hot-dates');
}

// ════════════════════════════════════════════════════════════════════
// Block 5 — Discover / Portfolio / Couture / Featured
// ════════════════════════════════════════════════════════════════════

import type {
  PortfolioImage, PortfolioListResponse, UploadUrlResponse,
  DiscoverStatus, CoutureSlot, CoutureAppointment, FeaturedSubmission,
} from '../types/vendor';

export function fetchUploadUrl(filename: string): Promise<UploadUrlResponse | ApiErr> {
  return postJson<UploadUrlResponse | ApiErr>('/api/v2/vendor/portfolio/upload-url', { filename });
}

export function registerPortfolioImage(body: {
  image_url: string; caption?: string; aesthetic_tags?: string[]; is_hero?: boolean; in_carousel?: boolean;
}): Promise<{ ok: boolean; image: PortfolioImage } | ApiErr> {
  return postJson('/api/v2/vendor/portfolio', body);
}

export function fetchPortfolio(vendorId: string, state = 'all'): Promise<PortfolioListResponse | ApiErr> {
  return getJson<PortfolioListResponse | ApiErr>(`/api/v2/vendor/portfolio/${vendorId}?state=${state}`);
}

export function updatePortfolioImage(imageId: string, body: {
  caption?: string; aesthetic_tags?: string[]; in_carousel?: boolean;
}): Promise<{ ok: boolean; image: PortfolioImage } | ApiErr> {
  return patchJson('/api/v2/vendor/portfolio/' + imageId, body);
}

export function setHeroImage(imageId: string): Promise<{ ok: boolean; image: PortfolioImage } | ApiErr> {
  return patchJson('/api/v2/vendor/portfolio/' + imageId + '/hero', {});
}

export function deletePortfolioImage(imageId: string): Promise<{ ok: boolean; deleted: boolean } | ApiErr> {
  return deleteJson('/api/v2/vendor/portfolio/' + imageId);
}

export function fetchDiscoverStatus(): Promise<DiscoverStatus | ApiErr> {
  return getJson<DiscoverStatus | ApiErr>('/api/v2/vendor/discover/status');
}

export function submitDiscoverRequest(body: {
  rate_min: number; rate_max: number; aesthetic_tags: string[];
  pitch?: string; instagram_handle?: string; sample_image_ids?: string[];
}): Promise<{ ok: boolean; request_id: string } | ApiErr> {
  return postJson('/api/v2/vendor/discover/request', body);
}

export function withdrawDiscoverRequest(): Promise<{ ok: boolean } | ApiErr> {
  return postJson('/api/v2/vendor/discover/withdraw', {});
}

export function fetchCoutureSlots(state = 'all'): Promise<{ ok: boolean; slots: CoutureSlot[]; total: number } | ApiErr> {
  return getJson(`/api/v2/vendor/couture/availability?state=${state}`);
}

export function addCoutureSlot(body: { slot_at: string; duration_minutes?: number; fee_inr: number }): Promise<{ ok: boolean; slot: CoutureSlot } | ApiErr> {
  return postJson('/api/v2/vendor/couture/availability', body);
}

export function removeCoutureSlot(slotId: string): Promise<{ ok: boolean; deleted: boolean } | ApiErr> {
  return deleteJson('/api/v2/vendor/couture/availability/' + slotId);
}

export function fetchCoutureAppointments(state = 'all'): Promise<{ ok: boolean; appointments: CoutureAppointment[]; total: number } | ApiErr> {
  return getJson(`/api/v2/vendor/couture/appointments?state=${state}`);
}

export function updateCoutureAppointment(id: string, body: { state?: string; notes?: string }): Promise<{ ok: boolean; appointment: CoutureAppointment } | ApiErr> {
  return patchJson('/api/v2/vendor/couture/appointments/' + id, body);
}

export function fetchFeaturedSubmissions(): Promise<{ ok: boolean; submissions: FeaturedSubmission[]; total: number } | ApiErr> {
  return getJson('/api/v2/vendor/featured');
}

export function submitFeatured(body: {
  slot_kind: string; hero_image_id?: string; caption?: string;
  proposed_start_date?: string; proposed_end_date?: string;
}): Promise<{ ok: boolean; submission_id: string; amount_inr: number } | ApiErr> {
  return postJson('/api/v2/vendor/featured/submit', body);
}

// ── Studio Suite (Block 6) ────────────────────────────────────────────────

import type {
  TeamMember, TeamTask, TeamMessage, TeamPayment, TeamPaymentBalance, StudioBriefing,
} from '@/lib/vendor/types/vendor';

export function fetchStudioBriefing(): Promise<{ ok: true } & StudioBriefing | ApiErr> {
  return getJson('/api/v2/vendor/studio/briefing');
}

// Team
export function fetchTeam(): Promise<{ ok: boolean; members: TeamMember[] } | ApiErr> {
  return getJson('/api/v2/vendor/studio/team');
}
export function addTeamMember(body: {
  name: string; role?: string; phone?: string; daily_rate_inr?: number; notes?: string;
}): Promise<{ ok: boolean; member: TeamMember } | ApiErr> {
  return postJson('/api/v2/vendor/studio/team', body);
}
export function updateTeamMember(memberId: string, body: {
  name?: string; role?: string; phone?: string; daily_rate_inr?: number; notes?: string; active?: boolean;
}): Promise<{ ok: boolean; member: TeamMember } | ApiErr> {
  return patchJson('/api/v2/vendor/studio/team/' + memberId, body);
}
export function deleteTeamMember(memberId: string): Promise<{ ok: boolean; member: TeamMember } | ApiErr> {
  return deleteJson('/api/v2/vendor/studio/team/' + memberId);
}

// Tasks
export function fetchTasks(params?: { state?: string; assigned_to?: string }): Promise<{ ok: boolean; tasks: TeamTask[] } | ApiErr> {
  const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return getJson('/api/v2/vendor/studio/tasks' + (qs ? '?' + qs : ''));
}
export function createTask(body: {
  title: string; description?: string; assigned_to_member_id?: string;
  linked_event_id?: string; due_date?: string; priority?: string;
}): Promise<{ ok: boolean; task: TeamTask } | ApiErr> {
  return postJson('/api/v2/vendor/studio/tasks', body);
}
export function updateTask(taskId: string, body: {
  title?: string; description?: string; assigned_to_member_id?: string;
  due_date?: string; priority?: string; state?: string;
}): Promise<{ ok: boolean; task: TeamTask } | ApiErr> {
  return patchJson('/api/v2/vendor/studio/tasks/' + taskId, body);
}
export function deleteTask(taskId: string): Promise<{ ok: boolean; task: TeamTask } | ApiErr> {
  return deleteJson('/api/v2/vendor/studio/tasks/' + taskId);
}

// ── Notes to Self (owner's scratchpad) ──────────────────────────────────────
export type OwnerNote = { id: string; body: string; binder_id: string | null; created_at: string };
export function fetchNotes(): Promise<{ ok: boolean; notes: OwnerNote[] } | ApiErr> {
  return getJson('/api/v2/vendor/notes');
}
export function createNote(body: string): Promise<{ ok: boolean; note: OwnerNote } | ApiErr> {
  return postJson('/api/v2/vendor/notes', { body });
}
export function deleteNote(id: string): Promise<{ ok: boolean; deleted: true } | ApiErr> {
  return deleteJson('/api/v2/vendor/notes/' + id);
}

// Messages
export function fetchTeamMessages(): Promise<{ ok: boolean; messages: TeamMessage[] } | ApiErr> {
  return getJson('/api/v2/vendor/studio/messages');
}
export function postTeamMessage(body: {
  body: string; pinned?: boolean; linked_event_id?: string;
}): Promise<{ ok: boolean; message: TeamMessage } | ApiErr> {
  return postJson('/api/v2/vendor/studio/messages', body);
}
export function togglePinMessage(messageId: string): Promise<{ ok: boolean; message: TeamMessage } | ApiErr> {
  return patchJson('/api/v2/vendor/studio/messages/' + messageId + '/pin', {});
}

// Payments
export function fetchTeamPayments(params?: { state?: string; member_id?: string }): Promise<{ ok: boolean; payments: TeamPayment[] } | ApiErr> {
  const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return getJson('/api/v2/vendor/studio/team-payments' + (qs ? '?' + qs : ''));
}
export function fetchPaymentBalance(): Promise<{ ok: boolean; balances: TeamPaymentBalance[]; total_owed_inr: number } | ApiErr> {
  return getJson('/api/v2/vendor/studio/team-payments/balance');
}
export function logPayment(body: {
  team_member_id: string; amount_inr: number; description?: string;
  linked_event_id?: string; linked_task_id?: string; notes?: string;
}): Promise<{ ok: boolean; payment: TeamPayment } | ApiErr> {
  return postJson('/api/v2/vendor/studio/team-payments', body);
}
export function markPaymentPaid(paymentId: string, body: {
  paid_via?: string; notes?: string;
}): Promise<{ ok: boolean; payment: TeamPayment } | ApiErr> {
  return patchJson('/api/v2/vendor/studio/team-payments/' + paymentId + '/mark-paid', body);
}

// ── Block 7: Schedules / Contracts / TDS ─────────────────────────────────
import type { ScheduleMilestone, Contract, TdsEntry, TdsSummary } from '@/lib/vendor/types/vendor';

// Schedules
export function fetchSchedule(invoiceId: string): Promise<{ ok: boolean; schedule: ScheduleMilestone[] } | ApiErr> {
  return getJson(`/api/v2/vendor/invoices/${invoiceId}/schedule`);
}
export function createSchedule(invoiceId: string, milestones: Array<{ label: string; pct: number; due_date?: string }>): Promise<{ ok: boolean; schedule: ScheduleMilestone[] } | ApiErr> {
  return postJson(`/api/v2/vendor/invoices/${invoiceId}/schedule`, { milestones });
}
export function markMilestonePaid(milestoneId: string, amount_paid: number): Promise<{ ok: boolean; milestone: ScheduleMilestone } | ApiErr> {
  return postJson(`/api/v2/vendor/schedules/${milestoneId}/paid`, { amount_paid });
}
export function deleteSchedule(invoiceId: string): Promise<{ ok: boolean; deleted: boolean } | ApiErr> {
  return deleteJson(`/api/v2/vendor/invoices/${invoiceId}/schedule`);
}

// Contracts
export function fetchContracts(params?: { client_id?: string; state?: string }): Promise<{ ok: boolean; contracts: Contract[]; total: number } | ApiErr> {
  const qs = params ? '?' + new URLSearchParams(params as Record<string,string>).toString() : '';
  return getJson(`/api/v2/vendor/contracts${qs}`);
}
export function requestContractUpload(title: string, filename: string, clientId?: string): Promise<{ ok: boolean; contract_id: string; upload_url: string; expires_in: number } | ApiErr> {
  return postJson('/api/v2/vendor/contracts/upload-url', { title, filename, client_id: clientId });
}
export function finalizeContract(contractId: string): Promise<{ ok: boolean; contract: Contract } | ApiErr> {
  return postJson(`/api/v2/vendor/contracts/${contractId}/finalize`, {});
}
export function updateContract(contractId: string, body: { title?: string; notes?: string; state?: string; signed_at?: string }): Promise<{ ok: boolean; contract: Contract } | ApiErr> {
  return patchJson(`/api/v2/vendor/contracts/${contractId}`, body);
}
export function sendContract(contractId: string): Promise<{ ok: boolean; contract: Contract; download_url: string } | ApiErr> {
  return postJson(`/api/v2/vendor/contracts/${contractId}/send`, {});
}
export function fetchContractDownload(contractId: string): Promise<{ ok: boolean; download_url: string; expires_in: number } | ApiErr> {
  return getJson(`/api/v2/vendor/contracts/${contractId}/download`);
}
export function cancelContract(contractId: string): Promise<{ ok: boolean; contract: Contract } | ApiErr> {
  return deleteJson(`/api/v2/vendor/contracts/${contractId}`);
}

// TDS
export function fetchTdsEntries(vendorId: string, params?: { financial_year?: string; from?: string; to?: string }): Promise<{ ok: boolean; entries: TdsEntry[]; total: number } | ApiErr> {
  const qs = params ? '?' + new URLSearchParams(params as Record<string,string>).toString() : '';
  return getJson(`/api/v2/vendor/tds/${vendorId}${qs}`);
}
export function fetchTdsSummary(vendorId: string, financialYear: string): Promise<TdsSummary | ApiErr> {
  return getJson(`/api/v2/vendor/tds/${vendorId}/summary?financial_year=${financialYear}`);
}
export function createTdsEntry(body: {
  client_name: string; gross_amount: number; tds_rate: number;
  deduction_date?: string; section?: string; financial_year?: string;
  client_pan?: string; client_tan?: string; invoice_id?: string; certificate_no?: string; notes?: string;
}): Promise<{ ok: boolean; entry: TdsEntry } | ApiErr> {
  return postJson('/api/v2/vendor/tds', body);
}
export function updateTdsEntry(entryId: string, body: Partial<TdsEntry>): Promise<{ ok: boolean; entry: TdsEntry } | ApiErr> {
  return patchJson(`/api/v2/vendor/tds/${entryId}`, body);
}
export function deleteTdsEntry(entryId: string): Promise<{ ok: boolean; deleted: boolean } | ApiErr> {
  return deleteJson(`/api/v2/vendor/tds/${entryId}`);
}
export async function exportTdsCsv(vendorId: string, financialYear: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v2/vendor/tds/${vendorId}/export?financial_year=${encodeURIComponent(financialYear)}`, {
    headers: getAuthHeader(),
  });
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `tds-${financialYear}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
