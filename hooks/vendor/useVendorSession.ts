'use client';
// hooks/useVendorSession.ts
// Reads vendor session from localStorage. Mock bypass when USE_MOCKS=true —
// always returns the mock session so login is skipped during visual dev.

import { useEffect, useState } from 'react';
import { getVendorSession } from '@/lib/vendor/session';
import type { VendorSession } from '@/lib/vendor/types/vendor';

interface SessionState {
  session: VendorSession | null;
  loading: boolean;
}

export function useVendorSession(): SessionState {
  const [state, setState] = useState<SessionState>({ session: null, loading: true });

  useEffect(() => {
    const s = getVendorSession();
    setState({ session: s, loading: false });
  }, []);

  return state;
}
