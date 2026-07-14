'use client';
// app/vendor/list/page.tsx — TDW_03 P2 (retirement re-executed)
// The static landing retires AGAIN — this time with its successor standing:
// the Slice Door chip row in SliceShell carries the navigation job (CE
// addendum, F1's lesson). Redirect: stored slice, else `leads` per Q2.

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
