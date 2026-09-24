'use client';
// app/vendor/list/[slice]/notes.tsx — TDW_06 P7d (item 4): the NOTES tab on the business screen.
// Beside EVENTS in the slice door, the SAME owner_notes reader as the studio door — both render
// the shared NotesBody, so the two doors are one source of truth. Surface chrome: NotesBody
// alone (CE-45 FE-2 TYPE_1 retired the SliceDoor tab bar that sat above it). Search, create, delete, and the 128f882
// Send-to-Chat signpost all live in NotesBody.
//
// ── M-FINISH S2 · R-38.11 · THE SECOND HEADER MOUNT IN THE FAMILY ───────────
// This module carried its OWN <Header>, separately from SliceShell's — it is the one list
// room that does not go through SliceShell at all. It was easy to miss for exactly that
// reason, and it is the reason the zero-mount question is asked of the TREE (the census in
// lib/worklist/rooms.ts INTERIM_VENDOR_MOUNTS) rather than of SliceShell alone.
// The mount is not conditional here either: `Header` is NOT IMPORTED. It mounts at the
// fallback route, app/vendor/list/[slice]/page.tsx, which is the only place it is wanted.
import { NotesBody } from '@/components/vendor/NotesBody';

export default function NotesSlice({ vendorId }: { vendorId: string }) {
  void vendorId; // the slice-module contract passes vendorId; NotesBody reads by the session cookie
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <NotesBody />
    </div>
  );
}
