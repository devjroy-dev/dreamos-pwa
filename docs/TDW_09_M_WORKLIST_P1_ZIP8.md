# ZIP 8 — THE FOUNDER WALK ON `54d8e78`, POINT 1 CURED

**Applied over `54d8e78`. Floor: twenty-one cells, exit 0. `npx tsc --noEmit`: exit 0.**

## §1 · THE ROOT — a class used by two components and owned by one

The founder saw three containers in a row that did not belong to the same system. Derived:

`RoomsGrid` renders `className="wl-card wl-linkcard"` and `className="wl-cardtitle"`, but only
**`FirstRun.tsx`** defined those rules — and `FirstRun` mounts on **Today only**. So on Rooms the
link card fell through to browser defaults: a pale block with a sentence-case `<h3>`, sitting
between two correctly-styled containers.

**That is a single-home violation wearing CSS.** It renders styled on one screen and naked on
the other, which is exactly how it surfaced.

**CURE — one home, and the right one.** The shared chrome (`wl-card`, `wl-card-lead`,
`wl-cardtitle`, `wl-cardbody`, `wl-cardaction` and its states) moves into the shell, because the
shell is the one thing every surface is inside. The duplicate copy is deleted from `FirstRun`
rather than left as a second declaration.

**RHYTHM — one column, one gutter.** The two rows ran full-bleed against inset cards. They now
sit on the same 16px gutter, carry the same border, radius and 10px stride, and the whole stack
below the bands reads as one system instead of three.

## §2 · C21 — the cell that would have caught it

`C21` collects every `.wl-*` rule a surface can actually see (its own style block plus the
shell's and the dock's) and fails on any class the surface *renders* but nothing it mounts
*defines*.

**Proved RED on the original defect:** putting `.wl-cardtitle` back in `FirstRun` alone →
*RoomsGrid uses .wl-cardtitle but nothing it mounts defines it*. Restored `cmp`-identical.

## §3 · THREE CELLS AMENDED BY LABEL

C8, C10 and C11 all reddened the instant the shared chrome left `FirstRun` — which is the cells
working, not the cells breaking. Each now reads the rule at its new home in the shell. Count
preserved, reasons stated at the site.

## §4 · POINT 2 — THE DOCK OPENING WHATSAPP IS REPORTED, NOT CHANGED

The founder tapped the dock and got `api.whatsapp.com`. That is what R-37.76 ① ruled — *"tapping
it opens WhatsApp to the vendor line… the honest destination, since WhatsApp is the assistant's
home today"* — so this seat is not reversing a ruling on a walk observation. The arms and their
prices are in the delivery message; the founder's word picks.
