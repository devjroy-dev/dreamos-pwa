'use client';

// app/(frost)/frost/page.tsx
// Frost entry point — Discover is the home. No intermediary hub.
// Sticky mode: if bride last used Sanctuary, we could theoretically
// land there, but the strategy decision is Discover-first always.
// The Sanctuary pill on the Discover feed handles the return path.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FrostRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/frost/canvas/discover');
  }, [router]);

  // Blank during redirect — matched bg so there's no white flash
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0C0A09',
    }} />
  );
}
