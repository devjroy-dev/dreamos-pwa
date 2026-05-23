'use client';

// app/(frost)/frost/page.tsx
// Frost entry — Discover is the home. Redirects immediately.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FrostRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/frost/canvas/discover'); }, [router]);
  return <div style={{ position: 'fixed', inset: 0, background: '#0C0A09' }} />;
}
