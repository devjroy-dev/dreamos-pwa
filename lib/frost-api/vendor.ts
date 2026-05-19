// lib/frost-api/vendor.ts
// ─────────────────────────────────────────────────────────────────────────────
// Typed vendor API client. 11 endpoints, one function each. Mirrors P2-6a
// contract from dream-os docs/API_CONTRACTS.md exactly.
//
// USAGE FROM SCREENS:
//   import { fetchVendorToday } from '@/lib/frost-api/vendor';
//   const data = await fetchVendorToday(vendorId);
//   data.needs_attention.overdue_invoices.forEach(...)
//
// FLIP TO REAL BACKEND:
//   .env.local:  NEXT_PUBLIC_USE_MOCKS=false
//   That's it. No code changes anywhere.
//
// CONTRACT ASSURANCE: every function's return type is the contract response
// shape from lib/types/vendor.ts. Mocks are shaped to the same types.
// TypeScript catches drift at compile time, not runtime.
// ─────────────────────────────────────────────────────────────────────────────

import { USE_MOCKS, apiGet, apiPost, apiPatch, mockDelay } from './_base';
import {
  MOCK_VENDOR_ME, MOCK_VENDOR_TODAY, MOCK_VENDOR_LEADS,
  MOCK_VENDOR_CLIENTS, MOCK_VENDOR_CLIENT_DETAIL,
  MOCK_VENDOR_INVOICES, MOCK_VENDOR_EXPENSES, MOCK_VENDOR_EVENTS,
  MOCK_VENDOR_CONTEXT, MOCK_VENDOR_CHAT_REPLY,
} from '../mocks/vendor';
import type {
  VendorMeResponse, VendorTodayResponse,
  VendorLeadsResponse, VendorLeadsQuery,
  LeadStatePatchBody, LeadStatePatchResponse,
  VendorClientsResponse, VendorClientsQuery,
  VendorClientDetailResponse,
  VendorInvoicesResponse, VendorInvoicesQuery,
  VendorExpensesResponse, VendorExpensesQuery,
  VendorEventsResponse, VendorEventsQuery,
  VendorContextResponse,
  VendorChatBody, VendorChatResponse,
} from '../types/vendor';

// ─── GET /api/v2/vendor/me ──────────────────────────────────────────────────
export async function fetchVendorMe(): Promise<VendorMeResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_VENDOR_ME);
  return apiGet<VendorMeResponse>('/api/v2/vendor/me');
}

// ─── GET /api/v2/vendor/today/:vendorId ─────────────────────────────────────
export async function fetchVendorToday(vendorId: string): Promise<VendorTodayResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_VENDOR_TODAY);
  return apiGet<VendorTodayResponse>(`/api/v2/vendor/today/${vendorId}`);
}

// ─── GET /api/v2/vendor/leads/:vendorId ─────────────────────────────────────
export async function fetchVendorLeads(
  vendorId: string,
  query: VendorLeadsQuery = {},
): Promise<VendorLeadsResponse> {
  if (USE_MOCKS) {
    const filtered = query.state && query.state !== 'all'
      ? { ...MOCK_VENDOR_LEADS, leads: MOCK_VENDOR_LEADS.leads.filter(l => l.state === query.state) }
      : MOCK_VENDOR_LEADS;
    return mockDelay({ ...filtered, total: filtered.leads.length });
  }
  return apiGet<VendorLeadsResponse>(
    `/api/v2/vendor/leads/${vendorId}`,
    { state: query.state, limit: query.limit, offset: query.offset },
  );
}

// ─── PATCH /api/v2/vendor/leads/:leadId/state ───────────────────────────────
export async function patchVendorLeadState(
  leadId: string,
  body: LeadStatePatchBody,
): Promise<LeadStatePatchResponse> {
  if (USE_MOCKS) {
    return mockDelay({
      ok: true as const,
      lead: { id: leadId, state: body.state },
    });
  }
  return apiPatch<LeadStatePatchResponse>(
    `/api/v2/vendor/leads/${leadId}/state`,
    body,
  );
}

// ─── GET /api/v2/vendor/clients/:vendorId ───────────────────────────────────
export async function fetchVendorClients(
  vendorId: string,
  query: VendorClientsQuery = {},
): Promise<VendorClientsResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_VENDOR_CLIENTS);
  return apiGet<VendorClientsResponse>(
    `/api/v2/vendor/clients/${vendorId}`,
    { limit: query.limit, offset: query.offset },
  );
}

// ─── GET /api/v2/vendor/clients/:vendorId/:clientId ─────────────────────────
export async function fetchVendorClient(
  vendorId: string,
  clientId: string,
): Promise<VendorClientDetailResponse> {
  if (USE_MOCKS) {
    return mockDelay({
      ...MOCK_VENDOR_CLIENT_DETAIL,
      client: { ...MOCK_VENDOR_CLIENT_DETAIL.client, id: clientId },
    });
  }
  return apiGet<VendorClientDetailResponse>(
    `/api/v2/vendor/clients/${vendorId}/${clientId}`,
  );
}

// ─── GET /api/v2/vendor/invoices/:vendorId ──────────────────────────────────
export async function fetchVendorInvoices(
  vendorId: string,
  query: VendorInvoicesQuery = {},
): Promise<VendorInvoicesResponse> {
  if (USE_MOCKS) {
    const filtered = query.state && query.state !== 'all'
      ? { ...MOCK_VENDOR_INVOICES, invoices: MOCK_VENDOR_INVOICES.invoices.filter(i => i.state === query.state) }
      : MOCK_VENDOR_INVOICES;
    return mockDelay({ ...filtered, total: filtered.invoices.length });
  }
  return apiGet<VendorInvoicesResponse>(
    `/api/v2/vendor/invoices/${vendorId}`,
    { state: query.state, limit: query.limit, offset: query.offset },
  );
}

// ─── GET /api/v2/vendor/expenses/:vendorId ──────────────────────────────────
export async function fetchVendorExpenses(
  vendorId: string,
  query: VendorExpensesQuery = {},
): Promise<VendorExpensesResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_VENDOR_EXPENSES);
  return apiGet<VendorExpensesResponse>(
    `/api/v2/vendor/expenses/${vendorId}`,
    { limit: query.limit, offset: query.offset },
  );
}

// ─── GET /api/v2/vendor/events/:vendorId ────────────────────────────────────
export async function fetchVendorEvents(
  vendorId: string,
  query: VendorEventsQuery = {},
): Promise<VendorEventsResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_VENDOR_EVENTS);
  return apiGet<VendorEventsResponse>(
    `/api/v2/vendor/events/${vendorId}`,
    { from: query.from, to: query.to, state: query.state, kind: query.kind },
  );
}

// ─── GET /api/v2/vendor/context/:vendorId ───────────────────────────────────
export async function fetchVendorContext(vendorId: string): Promise<VendorContextResponse> {
  if (USE_MOCKS) return mockDelay(MOCK_VENDOR_CONTEXT);
  return apiGet<VendorContextResponse>(`/api/v2/vendor/context/${vendorId}`);
}

// ─── POST /api/v2/vendor/chat ───────────────────────────────────────────────
// NOTE: history is accepted by the backend but ignored — engine reads history
// from DB. Frontend passes it anyway for contract compliance and so a future
// stateless mode (e.g. anonymous demo) can opt into client-side memory.
export async function vendorChat(body: VendorChatBody): Promise<VendorChatResponse> {
  if (USE_MOCKS) {
    // Cycle through mock replies based on message content patterns.
    const reply = MOCK_VENDOR_CHAT_REPLY(body.message);
    return mockDelay({ ok: true as const, reply: reply.reply, tool_calls: reply.tool_calls }, 800);
  }
  return apiPost<VendorChatResponse>('/api/v2/vendor/chat', body);
}
