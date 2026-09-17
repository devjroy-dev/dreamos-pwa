# repo: dreamos-pwa @ 641ea36c
# TDW · CE-43 · SEAT LC-2s · PACKET 3k · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut on** dreamos-pwa `641ea36c` (packet 3j, live), re-derived at origin at the moment of cutting. dream-os stands at `5139968` and is untouched.

- **Scope.** One file, `components/vendor/SheetLayer.tsx`, plus the bench. No new byte, no new file, rung unchanged (b82, by label).
- **Status.** A HOTFIX on a live defect the founder walked. Provisional under C-43.17.

## §1 · The defect (F-43.119, the seat's, disclosed)

The founder's words on the deployed 3j:

> "Tapping on leads not opening any of the leads. Tapping packages, in packages rom no click is getting registered."
> "The clients field-when in chalk ode i click edit in any client the sheet that opens is in graphite."

**Both are mine, and both come from the root mount.** Derived by command in a real headless Chrome against the running app:

- `app/globals.css:959` carries `body > * { position: relative; z-index: 1; }`, which lifts every root child above the paper grain painted by `body::before`. A layer portaled to `document.body` therefore becomes **its own stacking context at z-index 1**, and the sheet's own z-index 50 is trapped inside it. The shell (`.wl`, also z-index 1) is a later root child, so **the room painted over the sheet**. Measured: `document.elementsFromPoint(187, 400)` with the Packages edit sheet open returned `LI.pkg-card` on top, and a drag over the sheet scrolled the room beneath by 446 px.
- The palette tokens are defined on `.wl[data-wl-mode="light|dark"]` (`lib/worklist/theme.ts` `scopeCss`), so a sheet mounted at the root inherited none of them and fell back to the Graphite defaults, which is the Chalk-versus-Graphite report.

**What this does not touch.** Everything 3j proved about stacking, inertness, the keyboard and scroll holds; the sheets were correct and unreachable.

## §2 · The cure

The layer element itself now carries the depth's z-index (`position: relative; zIndex: z.panel`), so the stacking context the estate's rule creates is the layer's own, ordered by depth and above the room's z-index 1. It also wears the shell's skin: `className="wl"` and `data-wl-mode`, read from `.wl[data-wl-mode]` and followed with a MutationObserver, so a sheet renders in the room's palette and type and follows a theme change while open.

## §3 · What is proven

- **b82 cured:** 204/204. §17.4 re-aimed at the lifted form; §17.9 is new (the layer's own z-index and the shell skin); M62 and M63 are new; M58 re-aimed.
- **Both ways** on a clean worktree at `641ea36c`: 200 passed, 4 failed, exactly §17.4, §17.9, M62 and M63.
- **In the browser, against the running app:** with the edit sheet open, the top element at the sheet's centre is now the sheet's own; a drag scrolls the sheet (296 px to its end) and the room stays at 0.
- **Type check and lint:** `tsc --noEmit` exits 0; ESLint clean on the file.
- **The floor** and the founder's `next build` ride the verify.
- **Not run here:** a handset, both themes on glass, the database.

## §4 · Card 3k

1. Open Packages: taps register, a package folds and unfolds, Add package and Edit open and scroll.
2. Open Leads: a row opens its detail.
3. In Chalk, open a client and tap Edit: the sheet is in **Chalk**, not Graphite. Switch to Graphite with the sheet open: it follows.
4. Then re-walk card 3j's four steps (handover `TDW_CE43_LC2_P3J_HANDOVER.md` §7) on a test-number lead, on the handset, in both themes.

Sequencing beyond this sitting is the founder's.
