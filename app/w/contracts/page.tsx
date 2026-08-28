"use client";
// app/w/contracts/page.tsx — CONTRACTS, INSIDE THE SHELL. §4-4, batch ②.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Contracts tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `ContractsScreen` is the
// SAME module the /vendor fallback renders — imported, never copied.
//
// ── THE ROOM WITH NO OUTBOUND LINKS AT ALL ────────────────────────────────
// Worth one line because it is the first: Contracts carries zero `/vendor` literals, so it
// adds nothing to any interim set. Its whole surface — list, upload sheet, detail sheet —
// stays inside the shell. Team, three tiles over, is the opposite case in the same batch.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals. Its two
// sheets are full-cover `position:fixed` with live catchers, which R-38.22 has ruled the
// estate's standing sheet behaviour. Excluded from the render arm's tuple cell by
// construction; priced, not swept.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { ContractsScreen } from '@/app/vendor/contracts/screen';

export default function ShellContractsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.contractsTitle}>
      <RoomBody><ContractsScreen /></RoomBody>
    </WorklistShell>
  );
}
