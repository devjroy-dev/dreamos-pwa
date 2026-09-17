# repo: dreamos-pwa @ dd8a1e0c
# TDW · CE-43 · SEAT LC-2s · PACKET 3l · HANDOVER (dreamos-pwa only) · 2026-09-18

**Cut on** dreamos-pwa `dd8a1e0c` (packet 3k, live), re-derived at origin at the moment of cutting. dream-os stands at `5139968`, untouched. One file plus the bench. No new byte. Rung unchanged (b82, by label). Provisional under C-43.17.

## §1 · The defect (F-43.120, the seat's, disclosed)

> "the cards are showing in gra[hiite in chalk mode as well"

The founder's console on the live site, in Chalk, returned `['dark', '__variable_… (no theme-light)', 'dark']` for the shell's mode, the html classes and the layer's mode. So mirroring `data-wl-mode` was the wrong instrument: the vendor lane carries its palette by other means, and a sheet mounted at the page root reads none of them. 3k's mirror copied a mode that is not the one the room is painted with.

## §2 · The cure

The layer mounts **inside the room** (`.wl`), not at `document.body`, with `document.body` as the fallback when there is no room. Being inside the room, a sheet wears its palette and type whatever sets them. It still escapes the record sheet's transformed panel, which was the anchor defect F-43.116 named, and it keeps 3k's own z-index so it stays above the room's content.

## §3 · What is proven

- **In the browser, against the running app**, the Packages edit sheet's computed colours now follow the room:
  - Graphite: sheet `rgb(35,37,39)`, ink `rgb(237,238,239)`, the room's ink identical.
  - Chalk: sheet `rgb(248,249,249)`, ink `rgb(14,17,18)`, the room's ink identical.
  - Before, at 3k, the sheet read Graphite in a Chalk room.
- **Taps and scroll hold.** With the sheet open, the top element at its centre is the sheet's own (`LABEL` inside it); the room stays put while the sheet scrolls.
- **b82 cured:** 204/204, with §17.4 and §17.9 re-aimed at the in-room mount and M63 re-aimed.
- `tsc --noEmit` exits 0; ESLint clean.

## §4 · Card 3l

1. In Chalk, open Packages and tap Add package: the sheet is white, and its ink matches the room. Cancel, open a client, tap Edit: the same.
2. Switch to Graphite and repeat: the sheets are dark.
3. Taps still register on Leads and Packages; the three-deep stack from card 3j still dims and deadens what is beneath.

Sequencing beyond this sitting is the founder's.
