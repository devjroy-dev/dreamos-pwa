'use client';
// app/vendor/team-hub/page.tsx — THE SURVIVING FALLBACK ROUTE.
//
// ── §4-4 · TEAM CROSSED, AND THIS FILE IS WHAT STAYED BEHIND ───────────────
// The room the vendor reaches from the tile is `/w/team` now. This route is not deleted and
// must not be: R-38.11's "nothing deletes" holds until Phase 7, and this was always the
// SECOND entry point to the Team Hub — More → Team Hub lands here and the Studio page shows
// the same section beneath Your Studio. Both still render it from one module.
//
// ── IT OWNS THE CHROME, AND THAT IS THE WHOLE REASON THE FILE SPLIT ────────
// `<Header/>` is mounted HERE and imported HERE. A conditional does not remove a module
// from a bundle; only not importing it does.
//
// ── THE MOUNT CENSUS HOLDS AT 1 FOR THIS PATH ─────────────────────────────
// Body and route were ONE file, so the mount moved WITHIN the crossing rather than out of
// it — calendar's §4-2 precedent. `INTERIM_VENDOR_ROOMS` is the constant that shrinks.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { TeamHubScreen } from '@/app/vendor/team-hub/screen';

export default function TeamHubPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <TeamHubScreen tier={session.tier} />
    </div>
  );
}
