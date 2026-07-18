'use client';
// app/vendor/list/[slice]/notes.tsx — TDW_06 P7d (item 4): the NOTES tab on the business screen.
// Beside EVENTS in the slice door, the SAME owner_notes reader as the studio door — both render
// the shared NotesBody, so the two doors are one source of truth. List-surface chrome: Header +
// the SliceDoor tab bar (NOTES active) + NotesBody. Search, create, delete, and the 128f882
// Send-to-Chat signpost all live in NotesBody.

import { Header } from '@/components/vendor/Header';
import { SliceDoor } from '@/components/vendor/slices/SliceShell';
import { NotesBody } from '@/components/vendor/NotesBody';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

export default function NotesSlice({ vendorId }: { vendorId: string }) {
  const { session } = useVendorSession();
  void vendorId; // the slice-module contract passes vendorId; NotesBody reads by the session cookie
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session?.name ?? null} />
      <SliceDoor active="notes" />
      <NotesBody />
    </div>
  );
}
