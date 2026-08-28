"use client";
// app/w/team/page.tsx — TEAM, INSIDE THE SHELL. §4-4, batch ② of the seven.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Team tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `TeamHubScreen` is the
// SAME module the /vendor fallback renders — imported, never copied — and it reads the same
// `STUDIO_ITEMS` the Studio page reads, so the founder's three rows still exist once.
//
// ── ⚠ WHAT THIS ROOM IS, STATED PLAINLY BECAUSE IT IS UNUSUAL ─────────────
// Every one of its three rows leaves the shell. `/vendor/studio/team`, `/vendor/studio/
// tasks` and `/vendor/studio/team-payments` are carried Studio surfaces with no registry
// entry and no crossing chartered this block, so this is a ROOM OF DECLARED DOORS: the
// structure crosses, the destinations do not, and the vendor who taps one gets the old
// shell back until those surfaces cross at their own block or die at Phase 7.
//
// That is not a defect hidden inside a crossing — it is the ledger doing its job. All three
// are named in `INTERIM_VENDOR_LINKS` with their source line, ruled in advance at the
// survey rather than declared afterwards, and the count in `wl_audit`'s R-38.1 line is what
// tells the chair when they retire.
//
// ── THE DECLARED GAP ───────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals. Excluded
// from the render arm's tuple cell by construction; priced, not swept.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { TeamHubScreen } from '@/app/vendor/team-hub/screen';

export default function ShellTeamPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.teamTitle}>
      <RoomBody><TeamHubScreen tier={session.tier} /></RoomBody>
    </WorklistShell>
  );
}
