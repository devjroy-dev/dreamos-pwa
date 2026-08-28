'use client';
// app/vendor/couture/page.tsx — THE SURVIVING FALLBACK ROUTE.
//
// ── §4-3 · COUTURE CROSSED, AND THIS FILE IS WHAT STAYED BEHIND ─────────────
// The room the vendor reaches from the tile is `/w/couture` now. This route is not deleted
// and must not be: R-38.11's "nothing deletes" holds until Phase 7 retires
// `app/vendor/layout.tsx` with the whole old tree, and a vendor on a stale bookmark, a
// shared link or a service-worker cache still lands here.
//
// ── IT OWNS THE CHROME, AND THAT IS THE WHOLE REASON THE FILE SPLIT ────────
// `<Header/>` is mounted HERE and imported HERE, and it appears in no file the shell's
// chunk can reach. A conditional does not remove a module from a bundle; only not
// importing it does (S2's `SliceShell` finding, paid for once).
//
// THE SHAPE IS `app/vendor/calendar/page.tsx`'s, WHICH IS `app/vendor/list/[slice]/
// page.tsx`'s: the same wrapper, the same `session.name ?? null`, the same body-as-child.
// One precedent, one shape, so a reader comparing four fallback routes finds no difference
// to explain.
//
// ── ONE MOUNT HERE COVERS BOTH OF THE BODY'S ARMS, WHICH IS THE SHRINK ─────
// `CoutureScreen` carried two `<Header/>` mounts — one in the ineligible gate, one in the
// main screen. A route-level mount sits above both arms, so the two become this one and
// `INTERIM_VENDOR_MOUNTS` goes 2 → 1 for this path. Storefront and Portfolio each had one
// and theirs MOVED here rather than leaving, so their entries hold at 1 (calendar's §4-2
// precedent). Three rooms crossing, one census line shrinking, and the difference is
// structural rather than an omission in the other two.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { CoutureScreen } from '@/app/vendor/couture/screen';

export default function CouturePage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <CoutureScreen vendorId={session.id} />
    </div>
  );
}
