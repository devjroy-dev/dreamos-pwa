"use client";
// app/w/couture/page.tsx — COUTURE, INSIDE THE SHELL. §4-3, batch ① of the seven.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Couture tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `CoutureScreen` is the
// SAME module the /vendor fallback renders — imported, never copied. Two couture screens
// would be two homes for every slot and every vetoed byte, drifting apart without either
// one erroring.
//
// ── THE INELIGIBLE ARM CROSSES TOO, AND IT IS WORTH SAYING OUT LOUD ─────────
// Couture is gated on `couture_eligible`, so most vendors who tap this tile get the
// invite-only card rather than the screen. That arm is now inside the shell as well: it
// keeps the shell's chrome and the two nav seats, where on /vendor it depended on the old
// masthead and its own 「Back」 button to not be a dead end. The button stays — `router.back()`
// is honest in both trees — but it is no longer the only way out.
//
// ── THE DECLARED GAP ────────────────────────────────────────────────────────
// The body carries the rooms' older type register and its own colour literals (F-38.22's
// family), and its add-slot sheet is `position:fixed`, so it sits over the dock exactly as
// calendar's sheets have since §4-2. Captured, excluded from the render arm's tuple cell by
// name, priced — not swept inside a structural crossing.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { CoutureScreen } from './screen';

export default function ShellCouturePage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.coutureTitle}>
      <RoomBody><CoutureScreen vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
