"use client";
// components/worklist/RoomBody.tsx — THE ONE HOME FOR A CROSSED ROOM'S OUTER BOX.
//
// ── M-FINISH S2 · R-38.11 · WHY THIS EXISTS AT ALL ──────────────────────────
// Six room routes cross in one motion and every one of them needs the same three lines:
// a flex column that fills the shell's scroll area, and the gutter declaration below.
// Six copies of three lines is six homes for one decision, and the sixth copy is the one
// that drifts. It is a component so that the audit can assert ONE definition rather than
// six identical fragments it would have to compare with each other.
//
// ── THE GUTTER DECLARATION, AND WHY IT IS A VARIABLE AND NOT A SWEEP ────────
// R-37.82 (1) as raised at R-38.5: the scroll column owns ONE horizontal gutter and no
// component under it sets its own. WorklistShell applies that gutter to its direct
// children, and this wrapper IS one — so the room inside it must contribute zero.
//
// The list family hand-set a 22px inset at thirteen sites, written years before the shell
// existed. Crossing without touching them put the room at 16 + 22 = 38px while every other
// shell surface sat at 16, which is the founder's original misalignment grievance
// reproduced by the very motion that was supposed to end it.
//
// EACH LITERAL BECAME `var(--slice-inset, 22px)` AND THIS FILE SETS THE VARIABLE ONCE.
// The fallback in each call site is the literal that was already there, so the /vendor
// tree — which declares this variable nowhere — renders byte-identically to before. That
// is what makes the change a MOVE rather than a fork (D-2): one branch declares a value,
// the other keeps the value it always had, and neither has a second copy of the number.
//
// A SWEEP TO 0 WOULD HAVE BEEN THE WRONG SHAPE and is worth naming so nobody tries it:
// it would have pinned every list row flush to the glass on main, where nothing supplies
// a gutter, and no cell on this branch would ever have caught it.
export function RoomBody({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="wl-room"
      style={{
        // The cast is the only way to write a custom property in a React style object and
        // it is confined to this one line, which is the point of having one home.
        ['--slice-inset' as string]: '0px',
        flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
      }}
    >
      {children}
    </div>
  );
}
