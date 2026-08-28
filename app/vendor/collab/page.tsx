'use client';
// app/vendor/collab/page.tsx — THE SURVIVING FALLBACK ROUTE.
//
// ── §4-4 BATCH ③ · COLLAB CROSSED, AND THIS FILE IS WHAT STAYED BEHIND ──
// The room the vendor reaches from the tile is `/w/collab` now. This route is not deleted
// and must not be: R-38.11's "nothing deletes" holds until Phase 7 retires
// `app/vendor/layout.tsx` with the whole old tree, and a vendor on a stale bookmark, a
// shared link or a service-worker cache still lands here.
//
// ── IT OWNS THE CHROME, AND THAT IS THE WHOLE REASON THE FILE SPLIT ────────
// `<Header/>` is mounted HERE and imported HERE, and it appears in no file the shell's
// chunk can reach. A conditional does not remove a module from a bundle; only not
// importing it does.
//
// ── THE MOUNT CENSUS HOLDS AT 1 FOR THIS PATH ─────────────────────────────
// Body and route were ONE file, so the mount moved WITHIN the crossing rather than out of
// it — calendar's §4-2 precedent, and the third time this batch family has taken it.
// `INTERIM_VENDOR_ROOMS` is the constant that shrinks, and with this crossing it EMPTIES.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { CollabScreen } from '@/app/vendor/collab/screen';

export default function CollabPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <CollabScreen vendorId={session.id} tier={session.tier} />
    </div>
  );
}
