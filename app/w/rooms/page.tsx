"use client";
// app/w/rooms/page.tsx — the directory. Sixteen tiles, two bands, frozen order.
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomsGrid } from '@/components/worklist/RoomsGrid';
import { COPY } from '@/lib/worklist/copy';
import { useVendorHandle } from '@/hooks/vendor/useVendorHandle';

export default function RoomsPage() {
  const handle = useVendorHandle();
  return (
    <WorklistShell title={COPY.navRooms}>
      <RoomsGrid handle={handle} />
    </WorklistShell>
  );
}
