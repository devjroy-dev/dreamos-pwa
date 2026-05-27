'use client';
// hooks/useVendorData.ts
// Per-slice data loaders for the List hub.
// Module-scoped cache (30s TTL) avoids re-fetching on every tab switch.
// refresh() forces a re-fetch and cache bust — called after agent write tools fire.
// Block 1b: also subscribes to the pub/sub invalidation bus (lib/cache/invalidate).
// Form-driven writes call invalidateSlice(slice) → hook refetches within one tick.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchClients, fetchLeads, fetchInvoices,
  fetchExpenses, fetchEvents,
} from '@/lib/vendor/api/vendor';
import type {
  Client, Lead, Invoice, Expense, VendorEvent,
} from '@/lib/vendor/types/vendor';
import { subscribeToSlice } from '@/lib/vendor/cache/invalidate';

type Kind = 'clients' | 'leads' | 'invoices' | 'expenses' | 'events';

// ── Demo data — shown when tdw_is_demo is set or session has demo:true ───────
function isDemoVendor(): boolean {
  if (typeof window === 'undefined') return false;
  // Check localStorage flag (set during session hydration)
  try { if (localStorage.getItem('tdw_is_demo') === 'true') return true; } catch { /* ignore */ }
  // Check tdw_is_demo cookie (set directly by /api/demo route — works in Private Browsing)
  try {
    const demoFlag = document.cookie.split('; ').find(r => r.startsWith('tdw_is_demo='));
    if (demoFlag && demoFlag.split('=')[1] === 'true') return true;
  } catch { /* ignore */ }
  // Check session cookie's demo field (covers all entry paths including /api/auth/set-session)
  try {
    const match = document.cookie.split('; ').find(r => r.startsWith('tdw_vendor_session='));
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
      if (parsed?.demo === true) return true;
    }
  } catch { /* ignore */ }
  return false;
}

function d(daysFromNow: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() + daysFromNow);
  return dt.toISOString().split('T')[0];
}
function m(monthsFromNow: number): string {
  const dt = new Date(); dt.setMonth(dt.getMonth() + monthsFromNow);
  return dt.toISOString().split('T')[0];
}
function dAgo(daysAgo: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString();
}

const DEMO_LEADS: Lead[] = [
  { id: 'dl1', name: 'Priya Sharma',  phone: null, wedding_date: m(6), wedding_city: 'Delhi',  budget_total: 300000, state: 'new',    source: 'discover', referrer: null, raw_message: 'Interested in candid + cinematic. Saw us on TDW.', created_at: dAgo(1) },
  { id: 'dl2', name: 'Meera Kapoor',  phone: null, wedding_date: m(9), wedding_city: 'Jaipur', budget_total: 500000, state: 'quoted', source: 'discover', referrer: null, raw_message: 'Destination wedding at a palace property. Very specific about golden hour.', created_at: dAgo(4) },
  { id: 'dl3', name: 'Isha Malhotra', phone: null, wedding_date: m(4), wedding_city: 'Mumbai', budget_total: 800000, state: 'quoted', source: 'referral', referrer: null, raw_message: 'Referred by Meera. Wants full coverage — pre-wedding, mehndi, wedding, reception.', created_at: dAgo(7) },
];

const DEMO_CLIENTS: Client[] = [
  { id: 'dc1', name: 'Ananya Verma', phone: null, email: null, notes: 'Wedding in Udaipur — Lake Palace. Dec 2025. Delivered.', created_at: dAgo(90) } as Client,
  { id: 'dc2', name: 'Radhika Singh', phone: null, email: null, notes: 'Pre-wedding Ranthambore + wedding Delhi. Exceptional shoot.', created_at: dAgo(60) } as Client,
];

const DEMO_INVOICES: Invoice[] = [
  { id: 'di1', client_name: 'Priya Sharma', invoice_number: 'TDW/001', amount_total: 275000, amount_paid: 75000, amount_owed: 200000, state: 'advance_paid', due_date: m(5), created_at: dAgo(2) } as Invoice,
  { id: 'di2', client_name: 'Meera Kapoor', invoice_number: 'TDW/002', amount_total: 450000, amount_paid: 0, amount_owed: 450000, state: 'unpaid', due_date: m(1), created_at: dAgo(3) } as Invoice,
];

const DEMO_EVENTS: VendorEvent[] = [
  { id: 'de1', title: 'Priya Sharma — Pre-Wedding Shoot', kind: 'shoot', event_date: d(18), event_time: '06:00', state: 'upcoming', notes: 'Lodhi Garden. Golden hour. Bring 85mm and wide.' } as VendorEvent,
  { id: 'de2', title: 'Meera Kapoor — Site Visit', kind: 'recce', event_date: d(26), event_time: '11:00', state: 'upcoming', notes: 'Dera Amer, Jaipur. Check light at the havelis.' } as VendorEvent,
  { id: 'de3', title: 'Isha Malhotra — Mehndi Coverage', kind: 'shoot', event_date: m(4), event_time: '14:00', state: 'upcoming', notes: 'Home setup, Bandra. 4 hours coverage.' } as VendorEvent,
];

const DEMO_EXPENSES: Expense[] = [
  { id: 'dx1', description: 'Travel — Jaipur recce', category: 'travel', amount: 8500, expense_date: dAgo(10), client_name: 'Meera Kapoor', created_at: dAgo(10) } as Expense,
  { id: 'dx2', description: 'Second shooter — Ananya shoot', category: 'team', amount: 15000, expense_date: dAgo(20), client_name: null, created_at: dAgo(20) } as Expense,
];

type CacheEntry<T> = { data: T; ts: number };
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 30_000;

function cacheKey(vendorId: string, kind: Kind) {
  return `${vendorId}:${kind}`;
}

interface LoadState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function useLoader<T>(
  vendorId: string | null,
  kind: Kind,
  fetcher: (id: string) => Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
  extract: (raw: Record<string, unknown>) => T | null,
): LoadState<T> {
  const key = vendorId ? cacheKey(vendorId, kind) : null;
  const cached = key ? (cache.get(key) as CacheEntry<T> | undefined) : undefined;

  const [data, setData] = useState<T | null>(cached?.data ?? null);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<string | null>(null);
  const tick = useRef(0);

  const run = useCallback(async (force: boolean) => {
    if (!vendorId || !key) return;
    // Demo mode — return seeded data without hitting the API
    if (isDemoVendor()) {
      const demoMap: Record<Kind, unknown> = {
        leads: DEMO_LEADS, clients: DEMO_CLIENTS,
        invoices: DEMO_INVOICES, expenses: DEMO_EXPENSES, events: DEMO_EVENTS,
      };
      setData(demoMap[kind] as T);
      setLoading(false);
      return;
    }
    const existing = cache.get(key) as CacheEntry<T> | undefined;
    if (!force && existing && Date.now() - existing.ts < CACHE_TTL) {
      setData(existing.data);
      setLoading(false);
      return;
    }
    const my = ++tick.current;
    setLoading(true);
    setError(null);
    try {
      const raw = await fetcher(vendorId);
      if (my !== tick.current) return;
      if (!raw.ok) throw new Error(raw.error ?? 'Request failed');
      const extracted = extract(raw as Record<string, unknown>);
      cache.set(key, { data: extracted as T, ts: Date.now() });
      setData(extracted);
    } catch (e) {
      if (my !== tick.current) return;
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      if (my === tick.current) setLoading(false);
    }
  }, [vendorId, key, fetcher, extract]);

  useEffect(() => { run(false); }, [run]);

  // Block 1b: subscribe to pub/sub invalidation bus.
  // When form-driven writes call invalidateSlice(slice), this hook refetches.
  useEffect(() => subscribeToSlice(kind, () => run(true)), [kind, run]);

  const refresh = useCallback(() => run(true), [run]);
  return { data, loading, error, refresh };
}

// Public invalidation — call after agent writes
export function invalidateSlice(vendorId: string, kind: Kind) {
  cache.delete(cacheKey(vendorId, kind));
}

// ── Public hooks ──────────────────────────────────────────────────────────

export function useClientsData(vendorId: string | null): LoadState<Client[]> {
  return useLoader<Client[]>(
    vendorId, 'clients',
    (id) => fetchClients(id) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    (raw) => Array.isArray(raw.clients) ? (raw.clients as Client[]) : null,
  );
}

export function useLeadsData(vendorId: string | null): LoadState<Lead[]> {
  return useLoader<Lead[]>(
    vendorId, 'leads',
    (id) => fetchLeads(id) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    (raw) => Array.isArray(raw.leads) ? (raw.leads as Lead[]) : null,
  );
}

export function useInvoicesData(vendorId: string | null): LoadState<Invoice[]> {
  return useLoader<Invoice[]>(
    vendorId, 'invoices',
    (id) => fetchInvoices(id) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    (raw) => Array.isArray(raw.invoices) ? (raw.invoices as Invoice[]) : null,
  );
}

export function useExpensesData(vendorId: string | null): LoadState<Expense[]> {
  return useLoader<Expense[]>(
    vendorId, 'expenses',
    (id) => fetchExpenses(id) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    (raw) => Array.isArray(raw.expenses) ? (raw.expenses as Expense[]) : null,
  );
}

export function useEventsData(vendorId: string | null): LoadState<VendorEvent[]> {
  return useLoader<VendorEvent[]>(
    vendorId, 'events',
    (id) => fetchEvents(id) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    (raw) => Array.isArray(raw.events) ? (raw.events as VendorEvent[]) : null,
  );
}

// ── Block 1b — subscribe to pub/sub invalidation per slice ────────────────
