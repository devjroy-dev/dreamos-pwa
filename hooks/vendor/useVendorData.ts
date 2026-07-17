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
  fetchExpenses, fetchEvents, fetchCabinet,
  type CabinetResponse,
} from '@/lib/vendor/api/vendor';
import type {
  Client, Lead, Invoice, Expense, VendorEvent,
} from '@/lib/vendor/types/vendor';
import { subscribeToSlice, consumeDirty } from '@/lib/vendor/cache/invalidate';

type Kind = 'clients' | 'leads' | 'invoices' | 'expenses' | 'events' | 'cabinet';


type CacheEntry<T> = { data: T; ts: number };
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 30_000;

function cacheKey(vendorId: string, kind: Kind, suffix?: string) {
  return suffix ? `${vendorId}:${kind}:${suffix}` : `${vendorId}:${kind}`;
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
  keySuffix?: string,  // B6-S1: windowed entries get their own cache rows; the
                       // kind stays the same so the invalidation bus reaches them.
): LoadState<T> {
  const key = vendorId ? cacheKey(vendorId, kind, keySuffix) : null;
  const cached = key ? (cache.get(key) as CacheEntry<T> | undefined) : undefined;

  const [data, setData] = useState<T | null>(cached?.data ?? null);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<string | null>(null);
  const tick = useRef(0);

  const run = useCallback(async (force: boolean) => {
    if (!vendorId || !key) return;
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

  // TDW_04 A4.1 (F-04.20): if a write landed for this slice while no hook was
  // mounted (deferred commit after navigation), the bus holds a debt — consume
  // it and force past the TTL cache; otherwise the normal cached path.
  useEffect(() => { run(consumeDirty(kind)); }, [run, kind]);

  // Block 1b: subscribe to pub/sub invalidation bus.
  // When form-driven writes call invalidateSlice(slice), this hook refetches.
  useEffect(() => subscribeToSlice(kind, () => run(true)), [kind, run]);

  const refresh = useCallback(() => run(true), [run]);
  return { data, loading, error, refresh };
}

// Public invalidation — call after agent writes
// B6-S1: prefix delete — windowed entries (`vendor:events:from:to`) fall with
// their kind; before this, a windowed row would have survived its slice's bust.
export function invalidateSlice(vendorId: string, kind: Kind) {
  const prefix = cacheKey(vendorId, kind);
  for (const k of Array.from(cache.keys())) {
    if (k === prefix || k.startsWith(prefix + ':')) cache.delete(k);
  }
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

// TDW_04 B6-S1 (surfaces item 3, the horizon contract). The GRID's data: the
// visible month ± a buffer, re-fetched on month-nav, with the server's honest
// truncation tell riding along. This hook is a SIBLING of useEventsData, never
// its replacement: the rail ("what's coming up") keeps the default horizon,
// whose date-asc sort makes its head rows immune to tail truncation — windowing
// the rail would have emptied it for a far-out season, a regression. Two
// questions, two reads, each honest about what it witnessed.
export interface EventsWindowData {
  events: VendorEvent[];
  total: number;
  truncated: boolean;
}

export function useEventsWindow(
  vendorId: string | null, from: string, to: string,
): LoadState<EventsWindowData> {
  const fetcher = useCallback(
    (id: string) => fetchEvents(id, 'upcoming', from, to) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    [from, to],
  );
  const extract = useCallback(
    (raw: Record<string, unknown>) => Array.isArray(raw.events)
      ? {
          events: raw.events as VendorEvent[],
          total: typeof raw.total === 'number' ? raw.total : 0,
          truncated: raw.truncated === true,
        }
      : null,
    [],
  );
  return useLoader<EventsWindowData>(vendorId, 'events', fetcher, extract, `${from}:${to}`);
}

// TDW_03 P2 — the RAW cabinet for the binder cards (the adapted useClientsData
// flattens binders into the typed Client shape and loses the story). Same
// loader, cache, and TTL; its own cache key; ALSO listens to 'clients'
// invalidations so form writes that bust the adapted view bust this one too.
export function useCabinetData(vendorId: string | null): LoadState<CabinetResponse> {
  const state = useLoader<CabinetResponse>(
    vendorId, 'cabinet',
    (id) => fetchCabinet(id) as unknown as Promise<{ ok: boolean; error?: string } & Record<string, unknown>>,
    (raw) => (raw as unknown as CabinetResponse) ?? null,
  );
  const { refresh } = state;
  useEffect(() => subscribeToSlice('clients', () => refresh()), [refresh]);
  return state;
}

// ── Block 1b — subscribe to pub/sub invalidation per slice ────────────────
