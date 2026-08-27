"use client";
// app/w/rooms/page.tsx — the directory. Sixteen tiles, two bands, frozen order.
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomsGrid } from '@/components/worklist/RoomsGrid';
import { COPY } from '@/lib/worklist/copy';

export default function RoomsPage() {
  return (
    <WorklistShell title={COPY.navRooms}>
      <RoomsGrid />
    </WorklistShell>
  );
}
