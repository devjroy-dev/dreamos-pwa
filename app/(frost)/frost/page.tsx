'use client';

// app/(frost)/frost/page.tsx
// Frost entry — Sanctuary is home. Discover lives inside Sanctuary bloom.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FrostRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/frost/canvas/sanctuary'); }, [router]);
  return <div style={{ position: 'fixed', inset: 0, background: '#0C0405' }} />;
}
