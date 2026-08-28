"use client";
// app/w/portfolio/page.tsx — PORTFOLIO, INSIDE THE SHELL. §4-3, batch ① of the seven.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Portfolio tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `PortfolioScreen` is the
// SAME module the /vendor fallback renders — imported, never copied. The §C singularity
// principle this manager was built under asks for ONE photo editor in the estate, and a
// copied body would have made two on the day it crossed.
//
// ── R-37.62 · PORTFOLIO IS PINNABLE AND NOT PRE-PINNED ────────────────────
// Unchanged by this crossing and stated so it is not re-derived: the two default pins are
// Calendar and Storefront (§8.2). Portfolio may be pinned by the vendor and starts unpinned.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals, and its
// Instagram picker and photo detail sheet are `position:fixed` — so inside the shell they
// sit over the dock and the nav, exactly as calendar's sheets have since §4-2. Captured,
// excluded from the render arm's tuple cell by name, priced. Not swept inside a structural
// crossing, and not passed over quietly.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { PortfolioScreen } from '@/app/vendor/portfolio/screen';

export default function ShellPortfolioPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.portfolioTitle}>
      <RoomBody><PortfolioScreen vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
