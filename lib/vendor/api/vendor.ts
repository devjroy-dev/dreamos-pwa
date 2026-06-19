// lib/api/vendor.ts
// One exported async function per vendor contract endpoint.
// Screen components import from here — never raw fetch.

import { getJson, postJson, patchJson, API_BASE, getAuthHeader, USE_MOCKS } from './_base';
import { getVendorSession, setVendorSession, clearVendorSession } from '@/lib/vendor/session';
import { getMockContext, getMockLeads, getMockClients, getMockInvoices,
         getMockExpenses, getMockEvents, getMockMe } from '../mocks/vendor';
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
  if (USE_MOCKS) return Promise.resolve(getMockMe());
  return getJson<MeResponse>('/api/v2/vendor/me');
}

// ── Context (snapshot panel) ──────────────────────────────────────────────
export function fetchContext(vendorId: string): Promise<VendorContextResponse> {
  if (USE_MOCKS) return Promise.resolve(getMockContext());
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
  if (USE_MOCKS) return Promise.resolve({ ok: true, count: 0, binders: [] });
  return getJson<LedgerResponse>(`/api/v2/vendor/binders/${vendorId}`);
}

function binderToClient(b: CabinetBinder): ClientsResponse['clients'][number] {
  return { id: b.id, name: b.client ?? '', phone: b.phone ?? null, email: null, notes: b.note ?? null, created_at: b.created_at ?? '' };
}
function binderToLead(b: CabinetBinder): Lead {
  return {
    id: b.id, name: b.client ?? null, phone: b.phone ?? null, wedding_date: b.date ?? null,
    wedding_city: null, budget_total: null, state: b.stage ?? 'lead',
    source: null, referrer: null, raw_message: b.note ?? null, created_at: b.created_at ?? '',
  };
}
function invoiceState(b: CabinetBinder): string {
  const owed = b.amount_pending ?? 0;
  const paid = b.amount_received ?? 0;
  if (owed > 0) return 'unpaid';
  if (paid > 0) return 'paid';
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

// ── Chat history (3.0-B: display-only scrollback) ─────────────────────────
export type ChatHistoryMessage = { id: string; role: 'user' | 'ai'; text: string; at: string };
export type ChatHistoryResponse = { ok: boolean; messages: ChatHistoryMessage[]; error?: string };
export function fetchChatHistory(vendorId: string, limit = 10): Promise<ChatHistoryResponse> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, messages: [] });
  return getJson<ChatHistoryResponse>(`/api/v2/vendor/chat/history/${vendorId}?limit=${limit}`);
}

// ── Today dashboard ───────────────────────────────────────────────────────
export function fetchToday(vendorId: string): Promise<TodayResponse> {
  if (USE_MOCKS) {
    return Promise.resolve({
      ok: true,
      vendor: { name: 'Dev', category: 'photography', city: 'Delhi' },
      needs_attention: { overdue_invoices: [], new_leads: [], events_today: [] },
      this_week: [],
      money_snapshot: { total_outstanding: 0, unpaid_count: 0, advance_paid_count: 0 },
      open_leads_count: 0,
    });
  }
  return getJson<TodayResponse>(`/api/v2/vendor/today/${vendorId}`);
}

// ── Leads ─────────────────────────────────────────────────────────────────
export async function fetchLeads(vendorId: string, state = 'all'): Promise<LeadsResponse> {
  if (USE_MOCKS) return getMockLeads();
  const cab = await fetchCabinet(vendorId);
  let leads = (cab.leads ?? []).map(binderToLead);
  if (state !== 'all') leads = leads.filter((l) => (l.state ?? '').toLowerCase() === state.toLowerCase());
  return { ok: cab.ok, leads, total: leads.length };
}

export async function patchLeadState(leadId: string, state: string, _reason?: string): Promise<LeadStateResponse> {
  if (USE_MOCKS) return { ok: true, lead: { id: leadId, state } };
  const v = currentVendorId();
  if (!v) return { ok: false, lead: { id: leadId, state } };
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${leadId}/stage`, { stage: state });
  return { ok: r.ok, lead: { id: leadId, state: r.binder?.stage ?? state } };
}

// ── Clients ───────────────────────────────────────────────────────────────
export async function fetchClients(vendorId: string): Promise<ClientsResponse> {
  if (USE_MOCKS) return getMockClients();
  const cab = await fetchCabinet(vendorId);
  const clients = (cab.clients ?? []).map(binderToClient);
  return { ok: cab.ok, clients, total: clients.length };
}

export async function fetchClientDetail(vendorId: string, clientId: string): Promise<ClientDetailResponse> {
  if (USE_MOCKS) {
    const clients = getMockClients().clients;
    const client = clients.find(c => c.id === clientId) ?? clients[0];
    return {
      ok: true,
      client: { id: client.id, name: client.name, phone: client.phone, email: client.email, notes: client.notes },
      leads: [],
      invoices: [],
    };
  }
  const led = await fetchLedger(vendorId);
  const b = (led.binders ?? []).find((x) => x.id === clientId);
  const client = b
    ? { id: b.id, name: b.client ?? '', phone: b.phone ?? null, email: null, notes: b.note ?? null }
    : { id: clientId, name: '', phone: null, email: null, notes: null };
  return { ok: led.ok && !!b, client, leads: [], invoices: [] };
}

// ── Invoices ──────────────────────────────────────────────────────────────
export async function fetchInvoices(vendorId: string, state = 'all'): Promise<InvoicesResponse> {
  if (USE_MOCKS) return getMockInvoices();
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
  if (USE_MOCKS) return getMockExpenses();
  const led = await fetchLedger(vendorId);
  const expenses = (led.binders ?? []).filter((b) => b.direction === 'out').map(binderToExpense);
  const total_spent = expenses.reduce((s, e) => s + e.amount, 0);
  return { ok: led.ok, expenses, total_spent, total: expenses.length };
}

// ── Events ────────────────────────────────────────────────────────────────
export function fetchEvents(vendorId: string, state = 'upcoming'): Promise<EventsResponse> {
  if (USE_MOCKS) return Promise.resolve(getMockEvents());
  return getJson<EventsResponse>(`/api/v2/vendor/events/${vendorId}?state=${state}`);
}

// ── Chat — JSON fallback (mock / non-streaming clients) ───────────────────
export function sendChat(vendorId: string, message: string, history: {role:string;content:string}[], aiPrimer?: string): Promise<ChatResponse> {
  if (USE_MOCKS) {
    return Promise.resolve({ ok: true, reply: `Mock reply to: "${message}"`, tool_calls: [] });
  }
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
  tool_calls: string[];
  refresh?: boolean;
  contact?: ContactCard;
  clarify?: ClarifyPayload;
  suggestions?: SuggestionsPayload;
};

export function streamChat(
  vendorId: string,
  message: string,
  aiPrimer: string | undefined,
  onDelta: (text: string) => void,
  onDone: (result: StreamDonePayload) => void,
  onError: (msg: string) => void,
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
          } else if (event.type === 'done') {
            onDone({
              tool_calls: event.tool_calls ?? [],
              refresh:    event.refresh,
              contact:    event.contact,
              clarify:    event.clarify,
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
  // Shared row types for mocks
  Lead, Client, Invoice, Expense, VendorEvent,
} from '../types/vendor';
import {
  makeMockLead, makeMockClient, makeMockInvoice,
  makeMockExpense, makeMockEvent,
} from '../mocks/vendor';

// ── Leads ─────────────────────────────────────────────────────────────────

export async function createLead(body: CreateLeadRequest): Promise<CreateLeadResponse | ApiErr> {
  if (USE_MOCKS) return { ok: true, data: makeMockLead(body), deduped: false };
  const v = currentVendorId();
  if (!v) return noVendor();
  const note = foldNote(
    body.raw_message, body.notes,
    body.wedding_city ? `City: ${body.wedding_city}` : null,
    rupeeLine(body.budget_min, body.budget_max),
    body.event_types?.length ? `Events: ${body.event_types.join(', ')}` : null,
    body.source ? `Source: ${body.source}` : null,
    body.referrer_name ? `Referred by: ${body.referrer_name}` : null,
    body.email ? `Email: ${body.email}` : null,
  );
  const r = await postJson<BinderWriteResponse>(binderBase(v), {
    client: body.name, phone: body.phone, date: body.wedding_date, note, stage: 'lead',
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not create lead.' };
  return { ok: true, data: binderToLead(r.binder), deduped: false };
}

export async function updateLead(leadId: string, body: UpdateLeadRequest): Promise<UpdateLeadResponse | ApiErr> {
  if (USE_MOCKS) {
    const base = makeMockLead({ name: body.name ?? 'Mock Lead', ...body });
    return { ok: true, lead: { ...base, id: leadId } };
  }
  const v = currentVendorId();
  if (!v) return noVendor();
  const note = foldNote(
    body.wedding_city ? `City: ${body.wedding_city}` : null,
    rupeeLine(body.budget_min, body.budget_max),
    body.source ? `Source: ${body.source}` : null,
    body.referrer_name ? `Referred by: ${body.referrer_name}` : null,
    body.email ? `Email: ${body.email}` : null,
    body.raw_message, body.notes,
  );
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${leadId}/edit`, {
    client: body.name, date: body.wedding_date, phone: body.phone, note,
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not update lead.' };
  return { ok: true, lead: binderToLead(r.binder) };
}

export async function fetchLeadDetail(leadId: string): Promise<LeadDetailResponse | ApiErr> {
  if (USE_MOCKS) {
    const lead = makeMockLead({ name: 'Mock Lead Detail' });
    return { ok: true, lead: { ...lead, id: leadId }, vendor_summary: null, conversation: [], invoices: [], events: [] };
  }
  const v = currentVendorId();
  if (!v) return noVendor();
  const led = await fetchLedger(v);
  const b = (led.binders ?? []).find((x) => x.id === leadId);
  if (!b) return { ok: false, error: 'Lead not found.' };
  return { ok: true, lead: binderToLead(b), vendor_summary: null, conversation: [], invoices: [], events: [] };
}

/** Convenience wrapper — sets state to 'lost'. */
export function loseLead(leadId: string, reason?: string): Promise<LeadStateResponse | ApiErr> {
  return patchLeadState(leadId, 'lost', reason);
}

// ── Clients ───────────────────────────────────────────────────────────────

export async function createClient(body: CreateClientRequest): Promise<CreateClientResponse | ApiErr> {
  if (USE_MOCKS) return { ok: true, client: makeMockClient(body), deduped: false, restored: false };
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
  if (USE_MOCKS) {
    const base = makeMockClient({ name: body.name ?? 'Mock Client', ...body });
    return { ok: true, client: { ...base, id: clientId } };
  }
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
  if (USE_MOCKS) return { ok: true, deleted: true };
  const v = currentVendorId();
  if (!v) return noVendor();
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${clientId}/hide`, {});
  if (!r.ok) return { ok: false, error: r.error || 'Could not remove.' };
  return { ok: true, deleted: true };
}

// ── Invoices ──────────────────────────────────────────────────────────────

export function createInvoice(body: CreateInvoiceRequest): Promise<CreateInvoiceResponse | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, invoice: makeMockInvoice(body), pdf_pending: true });
  return postJson<CreateInvoiceResponse | ApiErr>('/api/v2/vendor/invoices', body);
}

export function updateInvoice(invoiceId: string, body: UpdateInvoiceRequest): Promise<UpdateInvoiceResponse | ApiErr> {
  if (USE_MOCKS) {
    const base = makeMockInvoice({ amount_total: body.amount_total ?? 0, ...body });
    return Promise.resolve({ ok: true, invoice: { ...base, id: invoiceId } });
  }
  return patchJson<UpdateInvoiceResponse | ApiErr>(`/api/v2/vendor/invoices/${invoiceId}`, body);
}

export function recordPayment(invoiceId: string, body: RecordPaymentRequest): Promise<RecordPaymentResponse | ApiErr> {
  if (USE_MOCKS) {
    return Promise.resolve({ ok: true, invoice: null, payment_recorded: body.amount, new_state: 'advance_paid' });
  }
  return postJson<RecordPaymentResponse | ApiErr>(`/api/v2/vendor/invoices/${invoiceId}/payments`, body);
}

export function fetchInvoicePdf(invoiceId: string): Promise<InvoicePdfResponse | ApiErr> {
  if (USE_MOCKS) {
    return Promise.resolve({ ok: true, pdf_url: 'https://example.com/mock.pdf', expires_in: 3600 });
  }
  return getJson<InvoicePdfResponse | ApiErr>(`/api/v2/vendor/invoices/${invoiceId}/pdf`);
}

/** Cancel invoice — sets state to 'cancelled'. Alias: "delete" / "remove" per standing rule. */
export { patchInvoiceCancel as cancelInvoice };
function patchInvoiceCancel(invoiceId: string): Promise<{ ok: true; invoice: { id: string; state: string } } | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, invoice: { id: invoiceId, state: 'cancelled' } });
  return patchJson<{ ok: true; invoice: { id: string; state: string } } | ApiErr>(`/api/v2/vendor/invoices/${invoiceId}/cancel`, {});
}

// ── Expenses ──────────────────────────────────────────────────────────────

export async function createExpense(body: CreateExpenseRequest): Promise<CreateExpenseResponse | ApiErr> {
  if (USE_MOCKS) return { ok: true, expense: makeMockExpense(body) };
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
  if (USE_MOCKS) {
    const base = makeMockExpense({ amount: body.amount ?? 0, ...body });
    return { ok: true, expense: { ...base, id: expenseId } };
  }
  const v = currentVendorId();
  if (!v) return noVendor();
  // Money (amount) is corrected through the witnessed money door — see 4-C. Here: non-money cells.
  const note = foldNote(body.description, body.category ? `Category: ${body.category}` : null, body.notes);
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${expenseId}/edit`, {
    client: body.client_name, date: body.expense_date, note,
  });
  if (!r.ok || !r.binder) return { ok: false, error: r.error || 'Could not update expense.' };
  return { ok: true, expense: binderToExpense(r.binder) };
}

export async function deleteExpense(expenseId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  if (USE_MOCKS) return { ok: true, deleted: true };
  const v = currentVendorId();
  if (!v) return noVendor();
  const r = await postJson<BinderWriteResponse>(`${binderBase(v)}/${expenseId}/hide`, {});
  if (!r.ok) return { ok: false, error: r.error || 'Could not remove.' };
  return { ok: true, deleted: true };
}

// ── Events ────────────────────────────────────────────────────────────────

export function createEvent(body: CreateEventRequest): Promise<CreateEventResponse | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, event: makeMockEvent(body) });
  return postJson<CreateEventResponse | ApiErr>('/api/v2/vendor/events', body);
}

export function updateEvent(eventId: string, body: UpdateEventRequest): Promise<UpdateEventResponse | ApiErr> {
  if (USE_MOCKS) {
    const base = makeMockEvent({ title: body.title ?? 'Event', event_date: body.event_date ?? new Date().toISOString().split('T')[0], ...body });
    return Promise.resolve({ ok: true, event: { ...base, id: eventId } });
  }
  return patchJson<UpdateEventResponse | ApiErr>(`/api/v2/vendor/events/${eventId}`, body);
}

export function deleteEvent(eventId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, deleted: true });
  return deleteJson<{ ok: true; deleted: true } | ApiErr>(`/api/v2/vendor/events/${eventId}`);
}

export function cancelEvent(eventId: string): Promise<{ ok: true; event: { id: string; state: string } } | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, event: { id: eventId, state: 'cancelled' } });
  return patchJson<{ ok: true; event: { id: string; state: string } } | ApiErr>(`/api/v2/vendor/events/${eventId}/cancel`, {});
}

// ── Profile ───────────────────────────────────────────────────────────────

export function updateMe(body: UpdateMeRequest): Promise<UpdateMeResponse | ApiErr> {
  if (USE_MOCKS) {
    return Promise.resolve({
      ok: true,
      vendor: {
        id: '2eb5d3fb-31eb-4b26-859a-cf10ae477d53',
        name: 'Dev Jroy',
        business_name: body.business_name ?? 'Frost Studio',
        city: body.city ?? 'Delhi',
        open_to_travel: body.open_to_travel ?? true,
        upi_id: body.upi_id ?? null,
        gstin: body.gstin ?? null,
        aesthetic_tags: body.aesthetic_tags ?? [],
        rate_min: body.rate_min ?? null,
        rate_max: body.rate_max ?? null,
        discover_preview: false,
      },
    });
  }
  return patchJson<UpdateMeResponse | ApiErr>('/api/v2/vendor/me', body);
}

export function updateRoutingHandle(body: UpdateRoutingHandleRequest): Promise<UpdateRoutingHandleResponse | ApiErr> {
  if (USE_MOCKS) {
    const h = body.routing_handle.toUpperCase();
    return Promise.resolve({ ok: true, routing_handle: h, wa_link: `https://wa.me/917982159047?text=TDW-${h}` });
  }
  return patchJson<UpdateRoutingHandleResponse | ApiErr>('/api/v2/vendor/me/routing-handle', body);
}

export function updateInvoicePrefix(body: UpdateInvoicePrefixRequest): Promise<UpdateInvoicePrefixResponse | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, prefix: body.prefix.toUpperCase(), current_counter: 16 });
  return patchJson<UpdateInvoicePrefixResponse | ApiErr>('/api/v2/vendor/me/invoice-prefix', body);
}

// ── Availability ──────────────────────────────────────────────────────────

export function fetchAvailability(vendorId: string, from?: string, to?: string): Promise<AvailabilityResponse | ApiErr> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to)   params.set('to', to);
  const qs = params.toString() ? `?${params.toString()}` : '';
  if (USE_MOCKS) return Promise.resolve({ ok: true, blocks: [], total: 0 });
  return getJson<AvailabilityResponse | ApiErr>(`/api/v2/vendor/availability/${vendorId}${qs}`);
}

export function blockDate(body: BlockDateRequest): Promise<BlockDateResponse | ApiErr> {
  if (USE_MOCKS) {
    return Promise.resolve({
      ok: true,
      block: { id: 'mock-block-' + Date.now(), blocked_date: body.blocked_date, reason: body.reason ?? null, created_at: new Date().toISOString() },
    });
  }
  return postJson<BlockDateResponse | ApiErr>('/api/v2/vendor/availability', body);
}

export function unblockDate(blockId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, deleted: true });
  return deleteJson<{ ok: true; deleted: true } | ApiErr>(`/api/v2/vendor/availability/${blockId}`);
}

// ── Hot dates ─────────────────────────────────────────────────────────────

export function fetchHotDates(): Promise<HotDatesResponse | ApiErr> {
  if (USE_MOCKS) return Promise.resolve({ ok: true, dates: [], total: 0 });
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
