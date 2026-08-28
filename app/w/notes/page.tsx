"use client";
// app/w/notes/page.tsx — NOTES, INSIDE THE SHELL. R-38.1 + R-38.11.
//
// The one module with no SliceShell at all: it is the SliceDoor tab bar plus NotesBody. It
// carried its OWN <Header> and that is the second mount the family gave up this sitting.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of app/w/layout.tsx, so tapping the Notes tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. The module below is the
// SAME module the /vendor fallback renders — imported, never copied. Two list screens would
// be two homes for every row, every fetch and every vetoed byte, drifting apart without
// either one erroring.
//
// ── THE DECLARED GAP, NAMED HERE AND NOT ONLY IN A HANDOVER ─────────────────
// The slice tree still carries thirty colour LITERALS (F-38.22) and its own older type
// register. Inside the shell's scope those literals bypass the variable layer and paint
// Espresso brass where the shell's accent is teal. It is CAPTURED, named as excluded from
// the render arm's tuple cell, and priced — not swept inside a structural crossing, and not
// passed over quietly, which is the failure S1 refused for AtelierForm on the same reasoning.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import NotesSlice from '@/app/vendor/list/[slice]/notes';

export default function ShellNotesPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.notesTitle}>
      <RoomBody><NotesSlice vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
