'use client';
// app/vendor/portfolio/page.tsx — THE SURVIVING FALLBACK ROUTE.
//
// ── §4-3 · PORTFOLIO CROSSED, AND THIS FILE IS WHAT STAYED BEHIND ──────────
// The room the vendor reaches from the tile is `/w/portfolio` now, and Storefront's
// Portfolio row asks `roomHref` so it points there too. This route is not deleted and must
// not be: R-38.11's "nothing deletes" holds until Phase 7, and Fork 3(b) put this manager
// at the address that already existed precisely because ELEVEN inbound edges pointed at it.
// Those edges live on `main` and in the world; they still land.
//
// ── IT OWNS THE CHROME, AND THAT IS THE WHOLE REASON THE FILE SPLIT ────────
// `<Header/>` is mounted HERE and imported HERE, and it appears in no file the shell's
// chunk can reach. A conditional does not remove a module from a bundle; only not
// importing it does.
//
// ── THE MOUNT CENSUS HOLDS AT 1 FOR THIS PATH ─────────────────────────────
// Portfolio's body and its route were ONE file, so the mount moved WITHIN the crossing
// rather than out of it — calendar's §4-2 precedent. One Header still renders here and
// `INTERIM_VENDOR_MOUNTS` still declares it at 1; `INTERIM_VENDOR_ROOMS` is the constant
// that shrinks for this room.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { PortfolioScreen } from '@/app/vendor/portfolio/screen';

export default function PortfolioPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <PortfolioScreen vendorId={session.id} />
    </div>
  );
}
