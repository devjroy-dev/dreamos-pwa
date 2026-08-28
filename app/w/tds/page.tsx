"use client";
// app/w/tds/page.tsx — TDS, INSIDE THE SHELL. §4-4, batch ②.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the TDS tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `TdsScreen` is the SAME
// module the /vendor fallback renders — imported, never copied. A ledger is the last
// surface in the estate that should exist twice.
//
// ── THE MONEY REGISTER IS LAW ON THIS SURFACE ─────────────────────────────
// `Rs X,XX,XXX`, no glyph, no k/L/Cr. This crossing authors no figure and reformats none;
// it moves a body between two shells and nothing else. Stated because a ledger crossing is
// exactly where a helpful reformat would look like tidying.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals. Its add
// sheet is full-cover `position:fixed` with a live catcher (R-38.22). Excluded from the
// render arm's tuple cell by construction; priced, not swept.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { TdsScreen } from '@/app/vendor/tds/screen';

export default function ShellTdsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.tdsTitle}>
      <RoomBody><TdsScreen vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
