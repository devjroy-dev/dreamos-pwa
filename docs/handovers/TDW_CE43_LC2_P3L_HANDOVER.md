# repo: dreamos-pwa @ 4e98b7a7 (re-cut, docs only; the code was cut on dd8a1e0c)
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

## §4 · THE METHOD, RECORDED FOR THE NEXT SEAT (C-43.18, chair-ruled)

**C-43.18, standing:** a surface cell that never renders the surface inside its room is not a surface cell. Every pwa bench for a sheet, a card or a control drives the real component inside its real room, in headless Chromium, with the room's palette and stacking present, before it counts. This packet and its two predecessors are why: three defects in a row lived in what the room does to a component, and no source-reading cell could see any of them.

**The instruments, as used at 3j to 3l.**
- **A real browser in the seat's container.** `npm i @sparticuz/chromium@131 puppeteer-core@23` from the registry. `chromium.executablePath()` gives the binary; launch headless with `chromium.args`. No CDN outside the registry is needed.
- **The room, running.** `NEXT_PUBLIC_USE_MOCKS=true NEXT_PUBLIC_API_BASE=http://localhost:3999/__api npx --no-install next dev -p 3999`. The mock session skips login; the API base points at the app's own origin so `page.setRequestInterception` catches every call (a cross-origin base is not caught, because the CORS preflight goes out unintercepted). Google Fonts fail in this container and Next falls back with a warning, which does not block dev.
- **Components out of their page.** Where a room cannot be reached (the leads list needs a live read), bundle the real components with esbuild, alias `@` to the repo and `next/navigation` to a stub, and serve the bundle from a stubbed origin through request interception. Stub `window.fetch` with `page.evaluateOnNewDocument`; it does not apply to a document created by `setContent` on `about:blank`.
- **Touch.** Raw CDP: `Input.dispatchTouchEvent` touchStart, twenty touchMoves at about 16 ms, touchEnd. **`Input.synthesizeScrollGesture` moves nothing in this build** and was proven inert on a plain overflow div before it was abandoned.
- **The keyboard.** Redefine `window.visualViewport` with an `EventTarget` carrying `height` and `offsetTop` (570 of 900 is a 330 px keyboard), then read what each sheet does. iOS cannot be emulated this way; the handset remains its witness.
- **What to measure.** `document.elementsFromPoint` for who owns a tap, `scrollTop` before and after a drag for who owns the gesture, computed `backgroundColor` and `color` against the room's for the palette, and the action row's rect against the keyboard line.

## §5 · Card 3l

1. In Chalk, open Packages and tap Add package: the sheet is white, and its ink matches the room. Cancel, open a client, tap Edit: the same.
2. Switch to Graphite and repeat: the sheets are dark.
3. Taps still register on Leads and Packages; the three-deep stack from card 3j still dims and deadens what is beneath.

Sequencing beyond this sitting is the founder's.
