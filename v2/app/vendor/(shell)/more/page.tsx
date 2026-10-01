"use client";
// app/w/rooms/page.tsx — the directory. Eighteen tiles, two bands, frozen order.
//
// R-38.18: THE ADD CONTROL MOUNTS HERE AND NOWHERE ELSE. Rooms is the surface the vendor
// is already looking at when she has something to add; on a room's own surface that room's
// own control is the right one and is already there, so a second floating control would be
// two doors to one form. The scoping is a MOUNT, not a prop or a pathname test — a control
// that decides for itself whether to exist is a control with a second copy of the ruling
// inside it.
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { RoomsGrid } from '@/v2/components/worklist/RoomsGrid';
import { AddFab } from '@/v2/components/worklist/AddFab';
import { COPY } from '@/v2/lib/worklist/copy';

export default function RoomsPage() {
  return (
    <WorklistShell title={COPY.navRooms}>
      {/* CE-47 (the founder, after his walk): More is the rooms in today's Rooms order; Pinned and Change pinned go. */}
      {/* CE-46: Add sits at the top of More (its + retired) */}
      <AddFab />
      <RoomsGrid />
    </WorklistShell>
  );
}
