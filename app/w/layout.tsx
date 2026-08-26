"use client";
// app/w/layout.tsx — the branch shell's root. PRODUCTION main CARRIES ZERO BYTES OF THIS.
//
// It sits beside /vendor rather than replacing it, because A-4's interim deep-links need the
// old routes alive: every job stays reachable from day one, and nothing is deleted to make
// room for a shell.
//
// THE SESSION GUARD IS THE OLD ONE'S SHAPE, not a second definition. It asks and it obeys.
// No onboarding verdict is computed here; that belongs to app/vendor/layout.tsx's guard,
// which still runs on every deep-linked destination.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

export default function WorklistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading } = useVendorSession();

  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);

  if (loading || !session) return <div style={{ minHeight: '100dvh' }} aria-busy="true" />;
  return <>{children}</>;
}
