'use client';
// app/vendor/list/page.tsx — TDW_03 P1 (landing retired)
// The static section landing is retired per the spec's LOCKED table.
// This page now redirects to the vendor's last-used slice; when nothing is
// stored, the spec's default is `leads` (CE ruling Q2, 2026-07-14 — the
// hook's own `clients` default is an implementation accident and does not
// overrule the spec). readStoredSlice() is the read-only, null-aware door.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { readStoredSlice } from '@/hooks/vendor/useLastSlice';

export default function ListLandingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/vendor/list/${readStoredSlice() ?? 'leads'}`);
  }, [router]);
  return <div style={{ flex: 1 }} aria-busy="true" />;
}
