"use client";
// app/w/collab/[post_id]/responses/page.tsx — COLLAB'S INTERIOR, INSIDE THE SHELL.
//
// ── §4-4 BATCH ③ · RULED TO CROSS WITH ITS PARENT ────────────────────────
// A crossed room holding an uncrossed interior is F-38.1 inside one room's walls: the
// vendor taps 「View responses」 on a shell surface and lands under a second layout, one tap
// in. The chair ruled the sub-route crosses in the same cut, and the parent's push is
// tree-aware so each tree keeps its own vendor.
//
// ── THE MASTHEAD NAMES THE ROOM, THE BODY NAMES THE THREAD ───────────────
// `title` is `COPY.collabTitle` and not a second byte: the vendor is in Collab, and 「Collab」
// is where the shell says she is. The body's own 「Interested vendors」 heading is the
// SUBJECT she is looking at, not a second name for the room, so it stays in both trees.
// Team's `SectionLabel` finding was two names for ONE thing; this is two different things.
//
// ── NO ROOM TILE POINTS HERE, AND THAT IS CORRECT ────────────────────────
// This is an interior, not a room. It takes no registry entry, no tile and no frame in
// `wl_render`'s derived capture set — that set derives from `rooms.ts`, and a sub-route
// that appeared there would be a room the grid does not have.
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { ResponsesScreen } from '@/app/vendor/collab/[post_id]/responses/screen';

export default function ShellCollabResponsesPage() {
  const params  = useParams<{ post_id: string }>();
  const post_id = params?.post_id ?? '';
  const router  = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.collabTitle}>
      <RoomBody><ResponsesScreen post_id={post_id} /></RoomBody>
    </WorklistShell>
  );
}
