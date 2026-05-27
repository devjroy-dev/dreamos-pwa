'use client';
// hooks/useVendorMode.ts
// Persists the vendor's active mode across sessions.
// Key: vendor_app_mode
// Values: 'ai' | 'studio' | 'discover'
// Default: 'ai' (DreamAi is the landing mode per strategy)

import { useCallback, useEffect, useState } from 'react';

export type VendorMode = 'ai' | 'studio' | 'discover';

const KEY     = 'vendor_app_mode';
const DEFAULT: VendorMode = 'ai';
const VALID: VendorMode[] = ['ai', 'studio', 'discover'];

function readMode(): VendorMode {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw && VALID.includes(raw as VendorMode)) return raw as VendorMode;
  } catch { /* ignore */ }
  return DEFAULT;
}

export function useVendorMode(): [VendorMode, (m: VendorMode) => void] {
  const [mode, setModeState] = useState<VendorMode>(DEFAULT);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setModeState(readMode());
  }, []);

  const setMode = useCallback((next: VendorMode) => {
    setModeState(next);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(KEY, next);
    } catch { /* ignore */ }
  }, []);

  return [mode, setMode];
}
