// lib/admin-api/assistance.ts — BLOCK 20 · CONCIERGE s1 · the admin API client.
// Mirrors dream-os src/api/admin/assistance.js @ 1feb1cc, read before writing (§6).

import { adminGet, adminPost } from './_base';

export type AssistStatus = 'open' | 'forwarded' | 'closed';

export interface AssistItem {
  id: string; request_id: string; category: string; budget_rs: number | null; forwarded_count: number;
}
export interface AssistRequestRow {
  id: string; couple_id: string | null; phone: string; name: string | null; status: AssistStatus;
  city: string | null; area: string | null; wedding_date: string | null; brief: string | null;
  origin: 'bride' | 'admin' | 'public'; created_at: string; updated_at: string; items: AssistItem[];
}
export interface AssistForward {
  id: string; item_id: string; target_kind: 'vendor' | 'prospect'; vendor_id: string | null; prospect_id: string | null;
  lead_id: string | null; wamid: string | null; status: string; error_code: string | null; error_title: string | null;
  sent_at: string | null; created_at: string;
  vendor: { id: string; business_name: string | null; routing_handle: string | null; city: string | null } | null;
  prospect: { id: string; name: string | null; ig_handle: string | null; phone: string; state: string } | null;
}
export interface AssistDetail {
  ok: true; request: Omit<AssistRequestRow, 'items'>; items: (AssistItem & { forwards: AssistForward[] })[]; fanout_default: number;
}
export interface AssistVendorTarget { id: string; business_name: string | null; routing_handle: string | null; category: string | null; city: string | null }

export function listAssistance(status?: AssistStatus) {
  return adminGet<{ ok: true; requests: AssistRequestRow[]; counts: Record<AssistStatus, number>; fanout_default: number }>(
    `/api/v2/admin/assistance${status ? `?status=${status}` : ''}`);
}
export function getAssistance(id: string) { return adminGet<AssistDetail>(`/api/v2/admin/assistance/${id}`); }
export function searchAssistVendors(q: { category?: string; city?: string; q?: string }) {
  const p = new URLSearchParams();
  if (q.category) p.set('category', q.category);
  if (q.city) p.set('city', q.city);
  if (q.q) p.set('q', q.q);
  return adminGet<{ ok: true; vendors: AssistVendorTarget[] }>(`/api/v2/admin/assistance/vendors?${p.toString()}`);
}
export function forwardToVendor(itemId: string, vendor_id: string) {
  return adminPost<{ ok: true; forward: AssistForward; lead: { id: string; source: string } }>(`/api/v2/admin/assistance/items/${itemId}/forward`, { kind: 'vendor', vendor_id });
}
export function forwardToProspect(itemId: string, body: { phone: string; ig_handle?: string; name?: string }) {
  return adminPost<{ ok: true; forward: AssistForward; dark?: { reason: string } }>(`/api/v2/admin/assistance/items/${itemId}/forward`, { kind: 'prospect', ...body });
}
export function closeAssistance(id: string) { return adminPost<{ ok: true }>(`/api/v2/admin/assistance/${id}/close`); }
export function createAssistanceTyped(body: { phone: string; name?: string; city?: string; area?: string; wedding_date?: string; brief?: string; items: { category: string; budget_rs: number | null }[] }) {
  return adminPost<{ ok: true; request: { id: string } }>('/api/v2/admin/assistance', body);
}
