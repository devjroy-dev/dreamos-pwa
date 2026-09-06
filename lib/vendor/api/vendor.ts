// lib/vendor/api/vendor.ts
// One exported async function per vendor contract endpoint.
// Screen components import from here — never raw fetch.

import { getJson, postJson, patchJson, API_BASE, getAuthHeader, handleResponse } from './_base';
import { getVendorSession, setVendorSession, clearVendorSession } from '@/lib/vendor/session';
import type {
  MeResponse, VendorContextResponse, TodayResponse, WorklistTodayResponse,
  LeadsResponse,
  ClientsResponse, ClientDetailResponse,
  InvoicesResponse, ExpensesResponse, EventsResponse,
  BooksResponse,
  ChatResponse, ContactCard, ClarifyPayload,
  SendOtpResponse, VerifyOtpResponse, PinStatusResponse, PinLoginResponse,
} from '../types/vendor';

// ── Profile ───────────────────────────────────────────────────────────────
export function fetchMe(): Promise<MeResponse> {
  return getJson<MeResponse>('/api/v2/vendor/me');
}

// ── Victor mode (Business·Advisor) ─────────────────────────────────────────
// TDW_06 P6d (R-2): the SERVER-persisted victor_mode that governs Victor's ROOM
// (business vs advisor routing). Distinct from the client nav mode (useVendorMode /
// ModePill, localStorage 'vendor_app_mode') — this is engine.agents.victor_mode, read
// and written through the vendor-e mode door. No localStorage; the server is the truth.
export type VictorMode = 'business' | 'advisor';
export type VictorModeResponse = { ok: boolean; victor_mode: VictorMode; thread_reset?: boolean };

export function fetchVictorMode(): Promise<VictorModeResponse> {
  return getJson<VictorModeResponse>('/api/v2/vendor-e/mode');
}

export function setVictorMode(victor_mode: VictorMode): Promise<VictorModeResponse> {
  return patchJson<VictorModeResponse>('/api/v2/vendor-e/mode', { victor_mode });
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
  booked: CabinetEvent[];
  reminders: CabinetReminder[];
  counts?: { clients: number; leads: number; booked: number; reminders: number };
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

// ── invoiceState RETIRED AT 2c  [§8.9, retire-with-the-reader] ────────────
// It derived a state word from a binder's received/pending figures so the room
// pill could not contradict the masthead (F-04.13). Its only caller was
// `binderToInvoice`, which retired above; the typed door emits `state` from the
// column, and the home's positive-list transition is the one place a state is
// decided. `pendingOf` left with it — this was its last caller here. Both stay
// live in `lib/vendor/derive.ts` for the hub and Cabinet, which still read the
// binder plane.


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
// ── binderToInvoice / binderToExpense RETIRED AT 2c  [§8.9] ───────────────
// Both adapters existed to manufacture a typed shape from a free-form binder,
// because no typed door spoke it. `GET /money/invoices/:v` and
// `/money/expenses/:v` now answer in `InvoicesResponse` / `ExpensesResponse`
// field for field, so there is nothing left to adapt. Retired WITH their
// readers, in the same delivery that removed the last one — a converter kept
// past its last caller is the shape that grows a second reader by accident.
// `binderToClient` STAYS: the Clients room still reads the binder plane.

function binderBase(v: string) { return `/api/v2/vendor/binders/${v}`; }

// ── THE TYPED MONEY DOOR · ROAD STEP 2c  [F-39.3 CLOSED] ─────────────────
// One base for eleven routes, derived from the live router at dream-os
// 4918275 and not from a handover — three documents had said "eight" because
// `books` and `pdf` were never counted (c-2c.5 / c-39.36).
//
// EVERY MONEY VERB IN THIS FILE NOW ADDRESSES THIS BASE. What retires with
// them is below: `binderToInvoice`, `binderToExpense`, `moneyBinders`, and the
// client-side arithmetic that used to compute `status`, `amount_owed` and the
// summary totals. The server states each of those once.
function moneyBase(v: string) { return `/api/v2/vendor/money`; }

// ONE HOME FOR THE MONEY BLOCK'S FALLBACK SENTENCE. Vetoed by delegation
// 2026-09-01; the founder may re-word it, and when he does there is one line to
// change rather than five.
// ── F-39.26 · THE MONEY VERBS' HALF OF THE INVALIDATION DOOR  [CE-39 2c] ──
// `WorklistShell` drops the memoised Today reading on navigation and on focus.
// That covers a vendor who writes here and walks to Today. It does NOT cover a
// write and a read on ONE route — Add an invoice from the Invoices FAB and the
// masthead count behind it is the reading taken before the write.
//
// So every money write calls the SAME function the shell calls. Not a
// verb-specific patch of the cached body: that would be a second derivation of
// one reading, which is the disease the memo exists to cure. One door, two
// callers, and `refreshToday()` is the only way in.
import { refreshToday } from '@/lib/worklist/feed';

const MONEY_FALLBACK = 'Could not save that — nothing was changed. Try again in a moment.';


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

// ── Fresh thread (TDW_06 D-7 — the new-thread button's one endpoint) ───────
// Closes the active conversation cleanly (memory.ts's own abandonment shape,
// server-side; never a delete — the scrollback persists on the estate). The
// next message starts a fresh thread, exactly as the 30-minute timeout does.
// Idempotent: `closed: null` means nothing was active — already fresh.
export type FreshThreadResponse = { ok: boolean; closed: string | null; error?: string };
export function startFreshThread(): Promise<FreshThreadResponse> {
  return postJson<FreshThreadResponse>('/api/v2/vendor/chat/thread/fresh', {});
}

// TDW_06 F-06.130 — the Report chip's endpoint. FORK 6b: it posts NOTHING but the session.
// The backend resolves the newest DELIVERED witness for this agent inside its own window, so
// this leg and the WhatsApp REPORT word can never disagree about which turn is being flagged,
// and no internal row id crosses the wire. Sited on `startFreshThread`'s exact pattern.
export type GlitchReportResponse = { ok: boolean; filed: boolean; message: string };
export function reportGlitch(): Promise<GlitchReportResponse> {
  return postJson<GlitchReportResponse>('/api/v2/vendor/chat/glitch-report', {});
}

// ── Today dashboard ───────────────────────────────────────────────────────
export function fetchToday(vendorId: string): Promise<TodayResponse> {
  return getJson<TodayResponse>(`/api/v2/vendor/today/${vendorId}`);
}

// ── THE WORKLIST FEED · GET /api/v2/vendor/worklist/today  [F-39.9, RULED] ──
//
// A SECOND DOOR, NOT A REPOINT, AND THE REASON IS THE WHOLE OF F-39.9. The Phase 4
// kickoff read `fetchToday` above as "the pwa door" for the frozen contract. It is not:
// different route (F-P3.9's deleted `/today/:vendorId`), different shape
// (`TodayResponse` — three kinds, no `has_any`, no `counts`, no `truncated`, no
// `done_today`), and a `:vendorId` argument the contract explicitly forbids.
//
// NO ARGUMENT, AND THAT IS THE CONTRACT SPEAKING. §3: 「the vendor is the token's;
// there is no :vendorId」. A vendorId parameter here would be a second statement of a
// fact the Bearer already carries, and two statements of one fact can disagree — which
// is the whole reason the endpoint was built without one.
export function fetchWorklistToday(): Promise<WorklistTodayResponse> {
  return getJson<WorklistTodayResponse>('/api/v2/vendor/worklist/today');
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
  // ── CROSSED AT 2c. THE ADAPTER AND BOTH REDUCES RETIRED WITH IT ─────────
  // It read `fetchCabinet`, reshaped binders through `binderToInvoice`, and
  // then summed `total_outstanding` and `total_collected` here. The typed door
  // answers in this exact shape and states both figures itself — one home for
  // the arithmetic, which is the rule the running balance has always obeyed
  // (F-04.13). A `reduce` here would be the second derivation.
  //
  // `state` FILTERING STAYS CLIENT-SIDE, deliberately: the door answers the
  // whole set and mints no filter vocabulary, because a second vocabulary for
  // one column is how `invoices_state_check` grows a rival.
  const r = await getJson<InvoicesResponse>(`${moneyBase(vendorId)}/invoices/${vendorId}`);
  if (!r.ok || state === 'all') return r;
  const invoices = r.invoices.filter((i) => i.state.toLowerCase() === state.toLowerCase());
  return { ...r, invoices, total: invoices.length };
}

// ── Expenses ──────────────────────────────────────────────────────────────
export async function fetchExpenses(vendorId: string): Promise<ExpensesResponse> {
  // Crossed at 2c with `fetchInvoices`. `total_spent` is the server's, for the
  // same reason.
  return getJson<ExpensesResponse>(`${moneyBase(vendorId)}/expenses/${vendorId}`);
}

// ── Books (ROAD STEP 2b — the typed money plane) ──────────────────────────
// ONE GET, NO ADAPTER, NO DERIVATION. Contrast `fetchInvoices` and
// `fetchExpenses` directly above: each fans out to an engine reader and then
// reshapes binders through `binderToInvoice` / `binderToExpense`, because the
// typed shape had to be manufactured from a free-form ledger. This door already
// speaks the shape, so there is nothing to adapt and no second place for the
// arithmetic to live.
//
// THE TWO ABOVE HAVE NOW CROSSED (2c). The paragraph that stood here said they
// had not, and named arm (c) as the reason — true at 2b, false the moment this
// delivery landed. Retire-with-the-reader applies to a comment stating a state
// of the world exactly as it applies to code. F-39.3 is CLOSED.
export function fetchBooks(vendorId: string): Promise<BooksResponse> {
  return getJson<BooksResponse>(`/api/v2/vendor/money/books/${vendorId}`);
}

// ── Events ────────────────────────────────────────────────────────────────
// TDW_04 B6-S1 (surfaces item 3, the horizon contract — F-04.47's real cure):
// the client can now SAY its window. Windowless calls keep the server default
// (400 days from today, the ruled interim) — existing behaviour is sacred for
// the callers that still want "everything ahead" (the list slice, the rail).
export function fetchEvents(vendorId: string, state = 'upcoming', from?: string, to?: string): Promise<EventsResponse> {
  const win = from && to ? `&from=${from}&to=${to}` : '';
  return getJson<EventsResponse>(`/api/v2/vendor/events/${vendorId}?state=${state}${win}`);
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
  // TDW_06 M-3 (the wire guard's Stage 2, SSE seat). ADDITIVE. The model's body has already
  // streamed token-by-token by the time the guard runs, so this seat cannot intercept before
  // delivery — it replaces AT DONE, and the transient glimpse was put to the founder and
  // accepted. `text` is the founder's vetoed line; the client swaps the message wholesale.
  // The three sibling SSE consumers (lib/demo/api.ts's own independent StreamDonePayload,
  // lib/frost-api/couple.ts, the sanctuary page) take no payload on `done` and are untouched
  // by this field — asserted by command, not assumed.
  intercept?: { replaced: boolean; text: string };
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
              intercept:  event.intercept, // TDW_06 M-3: the wire guard's replacement, if any
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

// F-05.11: verify the reset OTP. Distinct from verifyOtp() above, which hardcodes
// purpose:'login' — the reset rail MUST send purpose:'reset' so the server routes
// through the reset branch (auth.js:335, which clears any lockout and mints tokens).
// Shape fits VerifyOtpResponse exactly: {ok, vendor_id, user_id, pin_set, tokens}.
export function verifyResetOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
  return postJson<VerifyOtpResponse>('/api/v2/vendor/auth/verify-otp', { phone, otp, purpose: 'reset' }, false);
}

// F-05.11 + F-05.13(i) forward-compat (CE ruling, Fork B): the reset rail's set-pin
// call SENDS Authorization: Bearer <access_token from verify-otp> even though the
// server ignores it today (set-pin is unauthenticated — F-05.13 filed, dream-os).
// When the server guard lands, this caller already complies. It deliberately does
// NOT use the session-store auth path: no vendor session exists at this step (we
// write it only on set-pin success), and routing through fetchWithAuth would fire
// its 401→refresh→redirect-to-'/' machinery on a store-less context. The token is
// passed explicitly from verify-otp's response body.
export async function setPinWithToken(
  vendorId: string, pin: string, accessToken: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${API_BASE}/api/v2/vendor/auth/set-pin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ vendor_id: vendorId, pin }),
  });
  return handleResponse<{ ok: boolean; error?: string }>(res);
}

// ════════════════════════════════════════════════════════════════════
// Block 1b — typed write functions (20 new exports)
// ════════════════════════════════════════════════════════════════════

import { deleteJson } from './_base';
// `moneyBinders` / `pendingOf` no longer imported here: their last money
// readers crossed at 2c. `lib/vendor/derive.ts` keeps both — the hub and
// Cabinet.tsx:297 still read the binder plane, and this file no longer does.
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
  refreshToday();
  return { ok: true, deleted: true };
}

// ── Invoices ──────────────────────────────────────────────────────────────

export async function createInvoice(body: CreateInvoiceRequest): Promise<CreateInvoiceResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // ── CROSSED AT 2c · FIELD-FOR-FIELD ONTO REAL COLUMNS ───────────────────
  // It opened a binder, folded `description`/`due_date`/`notes` into a free-text
  // NOTE, and then computed `payment_status` here from `amount_advance`. Three
  // defects in one call, all cured by the address change:
  //   · the fold is F-39.23's disease from the pwa side — prose written into a
  //     column another surface must later render. Each field now lands in its
  //     own witnessed column: description(7) · due_date(11) · notes(14).
  //   · `status` was a SECOND state machine. The home's positive-list
  //     transition is the one home (b47 2.2); nothing here derives state again.
  //   · two round-trips became one.
  const r = await postJson<{ ok: true; invoice: Invoice } | ApiErr>(
    `${moneyBase(v)}/invoices/${v}`, body as unknown as Record<string, unknown>,
  );
  // ── THE MONEY BLOCK'S FALLBACK  [CE-39, ruled 2026-09-01] ───────────────
  // Its predecessors named the binder plane — 「Could not open invoice binder.」,
  // 「Could not set invoice amount.」 — and retired with it: a fallback naming a
  // thing that no longer exists is false copy, and copy law protects TRUE bytes
  // rather than old ones. This byte replaces them for the create and record
  // paths. It also keeps `_base.ts`'s 「Invalid JSON from server.」 (F-2c.p7,
  // developer prose) off a money surface, because every failure here lands on a
  // written sentence before it can surface.
  if (!('ok' in r) || !r.ok) return { ok: false, error: (r as ApiErr).error || MONEY_FALLBACK };
  refreshToday();
  return { ok: true, invoice: r.invoice, pdf_pending: true };
}

export async function updateInvoice(invoiceId: string, body: UpdateInvoiceRequest): Promise<UpdateInvoiceResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // Crossed at 2c. It was THREE round-trips — `/edit`, then `fetchLedger` for
  // ground truth, then `money-edit` — with the same client-side status
  // arithmetic. The home holds the edit LOCK (`amount_paid > 0` ->
  // INVOICE_LOCKED) and this door adds nothing to it.
  const r = await patchJson<{ ok: true; invoice: Invoice } | ApiErr>(
    `${moneyBase(v)}/invoices/${v}/${invoiceId}`, body as unknown as Record<string, unknown>,
  );
  // STILL TRUE, SO IT KEEPS ITS SEAT. The update path survives the crossing and
  // so does its byte.
  if (!('ok' in r) || !r.ok) return { ok: false, error: (r as ApiErr).error || 'Could not update invoice.' };
  refreshToday();
  return { ok: true, invoice: r.invoice };
}

export async function recordPayment(invoiceId: string, body: RecordPaymentRequest): Promise<RecordPaymentResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // ── CROSSED AT 2c · THE GROUND-TRUTH READ IS THE SERVER'S NOW ───────────
  // It read the whole ledger to find one row's figures, added the payment here,
  // and posted the result — read-modify-write across the network, with the
  // screen's arithmetic deciding the new state. The door takes the AMOUNT and
  // the home does the rest, including stamping `last_payment_at` (F-39.8) that
  // no prior writer set.
  const r = await postJson<{ ok: true; invoice: Invoice; transitioned: boolean; balance: number } | ApiErr>(
    `${moneyBase(v)}/invoices/${v}/${invoiceId}/payments`, { amount: body.amount },
  );
  if (!('ok' in r) || !r.ok) return { ok: false, error: (r as ApiErr).error || MONEY_FALLBACK };
  refreshToday();
  return {
    ok: true,
    invoice: r.invoice,
    payment_recorded: body.amount,
    new_state: r.invoice.state as RecordPaymentResponse['new_state'],
  };
}

export function fetchInvoicePdf(invoiceId: string): Promise<InvoicePdfResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return Promise.resolve(noVendor() as ApiErr);
  // Crossed at 2c. TWO call sites read this — SliceShell.tsx:429 and :921 — and
  // the charter named one. A re-point that cured only the visible button would
  // have left the other on the binder plane.
  // ── F-2c.w7 · CLOSED · THE DOOR AND THE CLIENT SPELL IT ONCE ─────────────
  // THE REAL DOOR IS `src/api/vendor/money.js` (symbol: the PDF arm) — the money
  // plane — and it answers `{ pdf_url, invoice_number }`. It used to answer
  // `url`, alone in the whole estate, and this boundary carried a
  // `url ?? pdf_url` normaliser so the two `SliceShell` call sites could read
  // one name.
  //
  // THE NORMALISER IS GONE BECAUSE THERE IS NOTHING LEFT TO NORMALISE. Its own
  // retirement condition was 「when the door returns `pdf_url`」; the door does,
  // shipped ahead of this half in the same pair. Keeping a `??` against a
  // spelling no server sends is how a retired name stays alive in a reader's
  // head and gets re-invented as a third one later.
  //
  // WHAT DOES NOT GO IS THE GUARD BELOW. An ok carrying no link is still a
  // failure and is still returned as one — that was never about the field's
  // name.
  return getJson<InvoicePdfResponse | ApiErr>(`${moneyBase(v)}/invoices/${v}/${invoiceId}/pdf`)
    .then((r) => {
      if (!('ok' in r) || !r.ok) {
        return { ok: false, error: (r as ApiErr).error || 'Invoice not found.' } as ApiErr;
      }
      const link = (r as InvoicePdfResponse).pdf_url;
      // AN OK WITH NO LINK IS A FAILURE, AND IT IS RETURNED AS ONE — carrying NO
      // sentence. Falling through with an undefined href was F-2c.w7's whole
      // mechanism: the surface could not tell a missing field from a failed
      // generation. This module is read by BOTH trees and must not reach into
      // the shell's register, so the caller's own `?? COPY.studioPdfFailed`
      // supplies the words, exactly as it does for every other ok-false here.
      if (!link) return { ok: false } as ApiErr;
      // THE RESPONSE GOES BACK AS IT CAME. `{ ...r, pdf_url: link }` was the
      // normaliser writing the resolved name onto the body; with one spelling
      // on the wire that line assigns the field to itself, and a no-op that
      // looks like a transformation is the next reader's wasted minute.
      return r as InvoicePdfResponse;
    });
}

export function cancelInvoice(invoiceId: string) {
  const v = currentVendorId();
  if (!v) return Promise.resolve(noVendor() as ApiErr);
  // 'Invoice not found.' KEEPS ITS SEAT on both paths that can 404 — cancel and
  // pdf. It was true before the crossing and it is true after; the SECOND
  // instance of it retired with `updateInvoice`'s ledger re-read, whose 404
  // path no longer exists.
  return patchJson<{ ok: true; invoice: { id: string; state: string } } | ApiErr>(
    `${moneyBase(v)}/invoices/${v}/${invoiceId}/cancel`, {},
  ).then((r) => { if (('ok' in r) && r.ok) { refreshToday(); return r; }
    return { ok: false, error: (r as ApiErr).error || 'Invoice not found.' } as ApiErr; });
}

export async function createExpense(body: CreateExpenseRequest): Promise<CreateExpenseResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // Crossed at 2c. The category rides to the home verbatim and the home
  // validates it — F-2c.p1 is OPEN on that list and is not this door's to cure.
  const r = await postJson<{ ok: true; expense: Expense } | ApiErr>(
    `${moneyBase(v)}/expenses/${v}`, body as unknown as Record<string, unknown>,
  );
  if (!('ok' in r) || !r.ok) return { ok: false, error: (r as ApiErr).error || MONEY_FALLBACK };
  refreshToday();
  return { ok: true, expense: r.expense };
}

export async function updateExpense(expenseId: string, body: UpdateExpenseRequest): Promise<UpdateExpenseResponse | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  const r = await patchJson<{ ok: true; expense: Expense } | ApiErr>(
    `${moneyBase(v)}/expenses/${v}/${expenseId}`, body as unknown as Record<string, unknown>,
  );
  if (!('ok' in r) || !r.ok) return { ok: false, error: (r as ApiErr).error || MONEY_FALLBACK };
  refreshToday();
  return { ok: true, expense: r.expense };
}

export async function deleteExpense(expenseId: string): Promise<{ ok: true; deleted: true } | ApiErr> {
  const v = currentVendorId();
  if (!v) return noVendor();
  // SOFT delete, as the home has always done it — `deleted_at` stamped, and
  // every typed read filters it. The row leaves the room without leaving the
  // database. Its predecessor was `binders/:id/hide` on the engine plane.
  const r = await deleteJson<{ ok: true } | ApiErr>(`${moneyBase(v)}/expenses/${v}/${expenseId}`);
  if (!('ok' in r) || !r.ok) return { ok: false, error: (r as ApiErr).error || MONEY_FALLBACK };
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

// ── TDW_10 BILLING v2 · SELF-SERVE ──────────────────────────────────────────
// The vendor's own money door. Behind `billing.selfserve_enabled` server-side,
// default OFF — these three will answer 503 `lane_disabled` until the founder
// flips it after his walk, and the surface renders that as a shut door rather
// than as a failure.
//
// `code` is carried on the error shape DELIBERATELY. The surface needs to tell
// three failures apart in her own words: the provider was unreachable (nothing
// changed), payments are not configured (nothing changed), and — the one that
// matters — the upgrade cancelled her old plan and could not open the new one.
// A single generic error would make the third indistinguishable from the first,
// and she would tap again believing nothing had happened.
export interface BillingSubscribeResponse {
  ok: true;
  already?: boolean;
  tier?: string;
  subscription_id: string;
  subscription_link: string | null;
}

export function subscribeToTier(tier: string): Promise<BillingSubscribeResponse | ApiErr> {
  return postJson<BillingSubscribeResponse | ApiErr>('/api/v2/vendor/billing/subscribe', { tier });
}

export function upgradeToTier(tier: string): Promise<BillingSubscribeResponse | ApiErr> {
  return postJson<BillingSubscribeResponse | ApiErr>('/api/v2/vendor/billing/upgrade', { tier });
}

export function cancelSubscription(): Promise<{ ok: true; cancelled: boolean } | ApiErr> {
  return postJson<{ ok: true; cancelled: boolean } | ApiErr>('/api/v2/vendor/billing/cancel', {});
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

// ── Day sheet (TDW_04 B6-S2, item 4 / P5) ─────────────────────────────────
// The sheet's ONE round trip: events + blocks + muhurat note + milestones +
// followup projection. Mark-paid stays markMilestonePaid (the existing door).
export function fetchDay(vendorId: string, date: string): Promise<VendorDayResponse | ApiErr> {
  return getJson<VendorDayResponse | ApiErr>(`/api/v2/vendor/day/${vendorId}/${date}`);
}

// ── Band view (TDW_04.5 P2) ───────────────────────────────────────────────
// The board's ONE round trip: bands (grouped by binder) + loose functions +
// default_view. Rides the SAME window the grid reads (page.tsx's `win`), so
// month-nav re-fetches both together — F-04.47's lesson, applied at birth.
export function fetchBands(vendorId: string, from: string, to: string): Promise<BandsResponse | ApiErr> {
  return getJson<BandsResponse | ApiErr>(`/api/v2/vendor/bands/${vendorId}?from=${from}&to=${to}`);
}

// ════════════════════════════════════════════════════════════════════
// Block 5 — Discover / Portfolio / Couture / Featured
// ════════════════════════════════════════════════════════════════════

import type {
  VendorDayResponse,
  BandsResponse,   // TDW_04.5 P2 — the band view's wire contract
  PortfolioImage, PortfolioListResponse, UploadUrlResponse,
  DiscoverStatus, DiscoverPreviewResponse, CoutureSlot, CoutureAppointment, FeaturedSubmission,
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

// TDW_07 P3 — the manager's drag. The server is fail-closed: it demands the FULL
// id list exactly once each, so the client sends the whole order rather than a
// move instruction, and a stale client can never half-apply a permutation.
export function reorderPortfolio(orderedIds: string[]): Promise<PortfolioListResponse | ApiErr> {
  return patchJson<PortfolioListResponse | ApiErr>('/api/v2/vendor/portfolio/reorder', { ordered_ids: orderedIds });
}

export function fetchDiscoverStatus(): Promise<DiscoverStatus | ApiErr> {
  return getJson<DiscoverStatus | ApiErr>('/api/v2/vendor/discover/status');
}

// TDW_07 P4b · F5 — "See your profile as couples do". The card is shaped SERVER-side by the
// feed's own function; this client assembles nothing. That is the whole design: a client
// that built the card from /me and the portfolio would be a second implementation of the
// couple-facing shape, in another language, where nothing could prove it agreed.
//
// Reachable pre-approval by design — the route carries auth and ownership but NO
// eligibility guard, because the spec calls the pre-approval preview "the strongest
// self-serve motivation to hit the 6-photo floor".
export function fetchDiscoverPreview(): Promise<DiscoverPreviewResponse | ApiErr> {
  return getJson<DiscoverPreviewResponse | ApiErr>('/api/v2/vendor/discover/preview');
}

// ── TDW_07 P4a · THE INSTAGRAM CONNECT ACTION ───────────────────────────────
// Every door below is the server's. This client holds NO opinion about scopes,
// token lifetimes or Meta's endpoints — the authorize URL arrives fully built,
// carrying the signed state, because a state minted in a browser is not a state.
export type IgStatus = {
  ok: boolean;
  ig_import_enabled: boolean;
  connected: boolean;
  connection_state?: 'none' | 'live' | 'expired';
  // F-07.24 — the vendor's own public handle, so the surface can show WHICH
  // account is linked. Nullable: a failed profile read leaves a working
  // connection with no display name rather than no connection.
  ig_username?: string | null;
  connected_at?: string | null;
  expires_at?: string | null;
};

export type IgMediaItem = {
  id: string;
  caption: string | null;
  media_type: string | null;
  source_url: string;
  timestamp: string | null;
};

export function fetchIgStatus(): Promise<IgStatus | ApiErr> {
  return getJson<IgStatus | ApiErr>('/api/v2/vendor/ig/status');
}

export function fetchIgAuthorizeUrl(): Promise<{ ok: boolean; authorize_url: string } | ApiErr> {
  return getJson('/api/v2/vendor/ig/authorize');
}

export function fetchIgMedia(): Promise<{ ok: boolean; items: IgMediaItem[]; truncated: boolean } | ApiErr> {
  return getJson('/api/v2/vendor/ig/media');
}

// The vendor's PICK ORDER is the array order, and the server takes what fits in
// that order — so the first photos they chose are the ones that land.
export function importIgPhotos(sourceUrls: string[]): Promise<{
  ok: boolean; imported_count: number; requested_count: number;
  failed_count: number; no_room_count: number;
} | ApiErr> {
  return postJson('/api/v2/vendor/ig/import', { source_urls: sourceUrls });
}

export function disconnectIg(): Promise<{ ok: boolean; disconnected: boolean } | ApiErr> {
  return deleteJson('/api/v2/vendor/ig/disconnect');
}

export function submitDiscoverRequest(body: {
  // TDW_07 P4b · F4 — `rate_max` REMOVED from the request contract. The server's gate is
  // min-only and its write no longer stores the column, so a required field here would be a
  // client demanding a value the server discards.
  rate_min: number; aesthetic_tags: string[];
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
// TDW_04.5 P3 (CE ruling F9) — mint a new crew-page token. THE BODY IS EMPTY AND THE
// SERVER NEVER READS ONE: the token is generated server-side, so no caller can choose
// it. The spec's "PATCH allowlist addition" was struck on the record as a
// capability-forging hole; there is deliberately no way to SET a token from here.
// The old link dies the moment this resolves.
export function rotateTeamMemberToken(memberId: string): Promise<{ ok: boolean; member: TeamMember } | ApiErr> {
  return postJson('/api/v2/vendor/studio/team/' + memberId + '/rotate-token', {});
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
// ── MARK-PAID CARRIES ITS EXPENSE OUTCOME  [CE-39 · 2c-Studio · ruling 3] ────
// THE DEFECT, IN A TYPE. `PATCH /:id/mark-paid` has answered with
// `{ payment, expense_logged, expense_error }` since the CE-39 hygiene sitting,
// which put those two fields there on purpose — its own comment reads 「FAILURE
// IS DECLARED, NOT SWALLOWED... the response carries `expense_logged`, and when
// it is false it carries WHY. The caller is told」.
//
// This signature declared `{ ok, payment }`. TypeScript does not merely omit an
// undeclared field, it makes reading one an ERROR — so the caller could not have
// read the failure even if it had thought to, and the surface said 「Marked as
// paid」 whether the ledger gained the expense row or not. The money row commits
// either way (reversing it because a derived bookkeeping row failed would be the
// worse lie), so the vendor's ONLY signal is this field, and the type erased it.
//
// That is F-39.26's class one layer over: a truth the wire carries, dropped by
// the layer above it. 2b-2 cured the same shape on `CabinetResponse`. Card ⑤
// asserts the expense row lands; without these two fields the card cannot be
// walked honestly, only optimistically.
//
// BOTH FIELDS ARE OPTIONAL, and that is not hedging — it is the truth about a
// wire this repo deploys separately from the one that fills it. A pwa build can
// meet a dream-os that predates the hygiene sitting; `expense_logged === false`
// and `expense_logged === undefined` are different facts and the caller reads
// them differently (see `TeamTabs`' settle path — undefined takes the plain
// byte, false takes the named one).
export function markPaymentPaid(paymentId: string, body: {
  paid_via?: string; notes?: string;
}): Promise<{ ok: boolean; payment: TeamPayment; expense_logged?: boolean; expense_error?: string | null } | ApiErr> {
  return patchJson('/api/v2/vendor/studio/team-payments/' + paymentId + '/mark-paid', body);
}

// ── THE TENTH VERB  [c-39.46 — the charter said nine, and nine was short] ────
// `PATCH /:id/cancel` has been live in `src/api/vendor/studio/payments.js:368`
// the whole time and had NO typed door. Its only caller was
// `app/vendor/studio/team-payments/page.tsx:116`, which built the request by
// hand: a bare `fetch`, the path spelled inline, and the bearer token dug out of
// `JSON.parse(localStorage.getItem('vendor_session'))` — one surface reaching
// past every convention this file exists to hold.
//
// The 2b-2 read-first's verb table listed the SHEET verbs and missed the ROW
// action, which is how a live control nearly retired with the page that held it.
// It crosses with the other nine and it crosses through here.
//
// ⚠ `cancel`, NEVER `delete`. The route sets `state='cancelled'` and
// `public.team_payments` carries no `deleted_at` column at all. The name of the
// function is the first place that truth is either told or lost.
export function cancelPayment(paymentId: string): Promise<{ ok: boolean; payment: TeamPayment } | ApiErr> {
  return patchJson('/api/v2/vendor/studio/team-payments/' + paymentId + '/cancel', {});
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
// ── `fetchContracts` RETIRED WITH ITS READER — b57 §1, 2026-09-06 ──────────
// It read the door's DEFAULT list, which hides cancelled contracts. The room now
// draws all four states and reads `fetchAllContracts`, so this had exactly ZERO
// callers the moment part 1 landed — a client function nothing calls is the
// F-40.109 class in the pwa's own half: a shipped address mounted on nothing.
//
// ⚠ THE DOOR IS NOT DELETED AND ITS DEFAULT IS NOT WIDENED. `GET
// /api/v2/vendor/contracts` still hides cancelled rows for every caller that does
// not ask, which is exactly what `include_cancelled=1` exists to leave alone.
// Retiring the CLIENT function is not retiring the behaviour; it is removing a
// name with no reader — retire-with-the-reader, never a commented corpse.
//
// FOUND BY THE CELL THE CHAIR ASKED THIS DELIVERY TO WRITE, ON ITS FIRST RUN.

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
// ── G3.2 · THE FILL PATH ───────────────────────────────────────────────────
// The upload path above is untouched and stays — clause 12's last line is that a
// couple who would rather sign on paper can, and the room keeps that door.
//
// ⚠ `include_cancelled` IS A PARAM AND NOT A WIDENED DEFAULT — F-40.115. The
// list door has always hidden cancelled rows and every existing caller expects
// that; only the room asks for all four states.
export function fetchAllContracts(): Promise<{ ok: boolean; contracts: Contract[]; total: number } | ApiErr> {
  return getJson('/api/v2/vendor/contracts?include_cancelled=1');
}
/**
 * ⚠ THE TYPED CLIENT ROSTER, AND IT IS **NOT** `fetchClients` ABOVE.
 *
 * `fetchClients` goes through `fetchCabinet` and `binderToClient`, which maps
 * `b.id` — a BINDER id out of `engine.records`. `POST /compose` looks the id up
 * in `public.clients` and would 404 on every single one of them.
 *
 * Two planes, two id spaces, one word. Derived by READING `binderToClient`
 * (vendor.ts:111) and `src/api/vendor/clients.js:47` rather than by trusting a
 * function whose name says what this composer wants — which is exactly the shape
 * F-40.109 named on the other side of the wire.
 *
 * `GET /api/v2/vendor/clients/:vendorId` is `resolveVendor` mode B: the path id
 * must match the JWT's, so it is not a second authority, only a second address.
 */
export function fetchTypedClients(vendorId: string, limit = 100): Promise<{ ok: boolean; clients: Client[]; total: number } | ApiErr> {
  return getJson(`/api/v2/vendor/clients/${vendorId}?limit=${limit}`);
}

/**
 * ⚠ `client_id` OR `{ name, phone }` — R-G32.17, and the second arm is the whole
 * of F-40.140's cure. `public.clients` was EMPTY for the walk vendor because its
 * three writers all need money or a manual entry; her people live on the binder
 * plane. `contracts_client_id_fkey` points at `public.clients`, so a binder id
 * cannot satisfy it and **promotion is the only mechanism**, whatever the picker
 * chooses to display.
 *
 * `promoted` comes back TRUE only when a row was actually created — the resolver
 * dedups on phone, and the record must not claim to have added someone who was
 * already there.
 */
export function composeContract(body: { client_id?: string; name?: string; phone?: string | null; event_id?: string; invoice_id?: string; deposit_pct?: number }): Promise<{ ok: boolean; contract: Contract; promoted?: boolean } | ApiErr> {
  return postJson('/api/v2/vendor/contracts/compose', body);
}
export function fillContract(contractId: string, body: { terms?: Record<string, unknown>; annexes?: Record<string, boolean>; deposit_pct?: number | null }): Promise<{ ok: boolean; contract: Contract } | ApiErr> {
  return patchJson(`/api/v2/vendor/contracts/${contractId}/fill`, body);
}
/** ⚠ NOT A JSON DOOR. `GET /preview` returns PDF BYTES, so it is opened rather
 *  than fetched — the browser's own viewer is the preview, and a fetch would buy
 *  a blob URL to hand straight back to it. */
export function contractPreviewUrl(contractId: string): string {
  return `${API_BASE}/api/v2/vendor/contracts/${contractId}/preview`;
}
export function sendContractToCouple(contractId: string, signerPhone?: string): Promise<{ ok: boolean; contract_id: string; sign_url: string; sent: boolean; reason: string | null } | ApiErr> {
  return postJson(`/api/v2/vendor/contracts/${contractId}/send-to-couple`, signerPhone ? { signer_phone: signerPhone } : {});
}
export function markContractDeposit(contractId: string, received: boolean): Promise<{ ok: boolean; contract: Contract } | ApiErr> {
  return postJson(`/api/v2/vendor/contracts/${contractId}/deposit`, { received });
}
// ── THE PROFILE DOORS HAVE NO SURFACE, AND NO CLIENT FUNCTION EITHER ───────
// ⚠ THIS IS A HELD FORK, NOT AN OVERSIGHT, AND IT IS THE ONE THING PART 2 DOES
// NOT BUILD. Veto rows 30-31 mint the CARD — `Set your policies once` and its
// sentence — and the ratified frame `R4-record-blank` draws it. But the sheet
// BEHIND that button has no frame and no minted bytes: every PROFILE label would
// be a string the founder's pass never saw, and mock-first (c-39.26) says a byte
// this build discovers it needs is a raised fork, not an authored string.
//
// So the card is NOT drawn either. A card whose button went nowhere would be a
// dead control, which s-G11.2 has ruled against four times in this arc, and one
// drawn with an invented sheet behind it would be worse.
//
// `GET`/`POST /api/v2/vendor/contracts/profile/fields` therefore ship in dream-os
// with no pwa caller. That is a SERVER-side orphan, named here rather than
// papered: it is the one address in this arc that b57 §1 cannot police, because
// §1 reads the client and there is deliberately nothing in the client to read.
// The fork rides the handover for the founder's frame.
//
// `fetchContractProfile` and `saveContractProfile` are NOT SHIPPED.

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
