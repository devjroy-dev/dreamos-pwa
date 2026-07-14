'use client';
// hooks/useLastSlice.ts
// Persists the vendor's last-selected list slice.
// Updated for the new 5-slice schema-named taxonomy.

import { useCallback, useEffect, useState } from 'react';

export type ListSlice = 'clients' | 'leads' | 'invoices' | 'events' | 'expenses';

const KEY = 'dreamai_list_last_slice';
const DEFAULT_SLICE: ListSlice = 'clients';

const VALID: ListSlice[] = ['clients', 'leads', 'invoices', 'events', 'expenses'];

function readInitial(): ListSlice {
  if (typeof window === 'undefined') return DEFAULT_SLICE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw && VALID.includes(raw as ListSlice)) return raw as ListSlice;
  } catch { /* ignore */ }
  return DEFAULT_SLICE;
}

// TDW_03 P1 (CE ruling Q2, 2026-07-14): read-only, null-aware view of the
// stored slice. Unlike readInitial() this does NOT fall back to the hook's
// default — the landing redirect needs to distinguish "nothing stored" (spec
// default: leads) from "stored clients". Same key, read-only; consumes the
// existing localStorage pattern, extends nothing. No new writes ride here.
export function readStoredSlice(): ListSlice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw && VALID.includes(raw as ListSlice)) return raw as ListSlice;
  } catch { /* ignore */ }
  return null;
}

export function useLastSlice(): [ListSlice, (s: ListSlice) => void] {
  const [slice, setSliceState] = useState<ListSlice>(() => readInitial());

  useEffect(() => {
    const fromStorage = readInitial();
    if (fromStorage !== slice) setSliceState(fromStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSlice = useCallback((next: ListSlice) => {
    setSliceState(next);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(KEY, next);
      }
    } catch { /* ignore */ }
  }, []);

  return [slice, setSlice];
}
