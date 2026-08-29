"use client";
// components/worklist/Fab.tsx — THE FAB. ONE SEAT, ONE IMPLEMENTATION, EVERY ROOM.
//
// ── F-39.4 · WHY THIS FILE EXISTS, AND IT IS THE FOUNDER'S FINDING ──────────
// Three rooms drew three floating add controls, each with its own geometry:
//
//   components/worklist/AddFab.tsx          56px, gutter, bottom 136   Rooms
//   components/vendor/slices/SliceShell.tsx 46px, right 20, bottom 120 the five list rooms
//   components/vendor/NotesBody.tsx         52px, right 24, bottom  80 Notes
//
// So the button changed size, corner and height as the vendor moved between rooms, and on
// Notes it painted ON the ask dock — the F-38.59 defect, live, in a third file, through
// the very sitting that cured it on SliceShell. **A cure applied where somebody was
// looking, and the class left to find its own way to the next site**, for the fifth time
// on this arc. The founder found it on his walk in under a minute; two instruments did
// not, and §6 of the handover says why.
//
// FOUNDER RULING 2026-08-29: the FAB sits right on Rooms and nowhere else. Rooms is the
// reference. So Rooms' seat is the only seat, it lives in `GRID.fab`
// (lib/worklist/theme.ts) beside `tile` and `row`, and this component is the only thing
// in the shell that draws a FAB.
//
// ── WHAT THIS OWNS AND WHAT IT DOES NOT ────────────────────────────────────
// It owns the SEAT: size, corner, height above the dock, the press, the focus ring. It
// owns no behaviour at all — every caller passes its own `onClick` and its own
// `aria-label`, because what a FAB DOES is the room's business and where it SITS is the
// shell's. AddFab keeps its seven-row sheet; SliceShell keeps `onAdd`; NotesBody keeps its
// composer. Nothing about this consolidation moves a form, a validator or a vetoed byte.
//
// ⚠ THE RULE ITSELF IS NOT HERE, AND THAT IS DELIBERATE. `.wl-fab` is emitted by
// WorklistShell's SHELL_CSS, which is where the estate already keeps chrome used by more
// than one component (the `wl-card` family's own note says so, and C10's file map records
// the rehoming). A rule shipped from this file would only exist on surfaces that mount
// this file — so a room that used the class without mounting the component would paint an
// unstyled button, which is the wl-plink disease with a circle on it.
import { GRID } from '@/lib/worklist/theme';

/** The seat, for the one caller that cannot use the class: the /vendor tree (see below). */
export const FAB_SEAT = GRID.fab;

export function Fab({ label, onClick, children }: {
  /** The control's accessible name. A floating glyph with no name is a control nobody can reach. */
  label: string;
  onClick: () => void;
  /** The glyph. Defaults to the plus every room but one already drew. */
  children?: React.ReactNode;
}) {
  return (
    <button type="button" className="wl-fab" aria-label={label} onClick={onClick}>
      <span aria-hidden>{children ?? '+'}</span>
    </button>
  );
}
