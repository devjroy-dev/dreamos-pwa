"use client";
// app/w/storefront/page.tsx — STOREFRONT, INSIDE THE SHELL. §4-3, batch ① of the seven.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Storefront
// tile mounts no second layout, no second masthead, no second medallion, no second nav and
// no second session resolve. Storefront is one of the two DEFAULT PINS (§8.2), so it is a
// tile the vendor reaches without going through Rooms — which makes the second-layout lag
// on it expensive in the same way calendar's was.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `StorefrontScreen` is the
// SAME module the /vendor fallback renders — imported, never copied.
//
// ── THIS ROOM IS A DOOR, SO ITS CROSSING IS MOSTLY ABOUT WHERE ITS ROWS GO ─
// Storefront is a hub page whose sections LINK other surfaces. One of the two — Portfolio —
// is a room, and it crosses in this same batch, so its row asks `roomHref` and moved with
// it. The other — Discover — is a carried surface with no registry entry, so it stays a
// declared `/vendor` link and the vendor who taps it leaves the shell. That is a REAL seam
// and it is declared rather than hidden: `INTERIM_VENDOR_LINKS` counts it, and it retires
// when Discover itself crosses at Phase 7.
//
// ── THE DECLARED GAP ───────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals. Captured,
// excluded from the render arm's tuple cell by name, priced.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { StorefrontScreen } from '@/app/vendor/storefront/screen';

export default function ShellStorefrontPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.storefrontTitle}>
      <RoomBody><StorefrontScreen vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
