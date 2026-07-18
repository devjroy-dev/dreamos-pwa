'use client';
// hooks/vendor/useVictorMode.ts
// TDW_06 P6d (R-2): the SERVER-persisted victor_mode that governs Victor's ROOM.
//
// DELIBERATELY DISJOINT from useVendorMode (the client nav mode: 'ai'|'studio'|'discover',
// localStorage 'vendor_app_mode'). This hook shares NO state, NO types, NO storage with it:
//   • the truth is engine.agents.victor_mode, read/written via the vendor-e mode door
//   • NO localStorage — a stale local copy would lie about which room Victor is serving
//   • the values are victor_mode vocabulary end to end ('business' | 'advisor')

import { useCallback, useEffect, useState } from 'react';
import { fetchVictorMode, setVictorMode as apiSetVictorMode, type VictorMode } from '@/lib/vendor/api/vendor';

export type { VictorMode };

export interface UseVictorMode {
  mode: VictorMode | null; // null while the first read is in flight
  loading: boolean;
  saving: boolean;
  change: (next: VictorMode) => Promise<boolean>; // resolves true iff the server flipped + reset the thread
}

export function useVictorMode(): UseVictorMode {
  const [mode, setMode] = useState<VictorMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Read the current room from the server on mount (no localStorage seed).
  useEffect(() => {
    let live = true;
    fetchVictorMode()
      .then((r) => { if (live) setMode(r.victor_mode); })
      .catch(() => { if (live) setMode('business'); }) // fail-safe to the 0080 default
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);

  // Optimistic flip; on failure re-read the server truth so the chip never lies.
  const change = useCallback(async (next: VictorMode): Promise<boolean> => {
    setSaving(true);
    setMode(next); // optimistic
    try {
      const r = await apiSetVictorMode(next);
      setMode(r.victor_mode);
      return r.thread_reset === true; // the PWA renders the fresh-thread seam off this
    } catch {
      try { const r = await fetchVictorMode(); setMode(r.victor_mode); } catch { /* keep optimistic */ }
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { mode, loading, saving, change };
}
