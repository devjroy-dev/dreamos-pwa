"use client";
// app/w/collab/page.tsx — COLLAB, INSIDE THE SHELL. §4-4, batch ③ — THE LAST CROSSING.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Collab tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `CollabScreen` is the
// SAME module the /vendor fallback renders — imported, never copied.
//
// ── AND WITH THIS ROUTE, `INTERIM_VENDOR_ROOMS` IS EMPTY ──────────────────
// Eighteen rooms, eighteen shell routes. The registry's load-bearing set went 14 → 8 → 7
// → 4 → 1 → 0 across five sittings, and every step was the SAME EDIT that changed an href.
// The number was never kept in a handover sentence, which is why it is trustworthy now.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals. Its post
// composer and its sheets are full-cover `position:fixed` with live catchers, which R-38.22
// has ruled the estate's standing sheet behaviour — and NOT C39's subject, which is a fixed
// control with a bottom OFFSET. Collab ships no such control, so it clears that cell
// without an edit rather than by exemption. Priced, not swept.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { CollabScreen } from '@/app/vendor/collab/screen';

export default function ShellCollabPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.collabTitle}>
      <RoomBody><CollabScreen vendorId={session.id} tier={session.tier} /></RoomBody>
    </WorklistShell>
  );
}
