# ZIP 9 — R-37.82 THE FOOTER REFINEMENT · R-37.83 THE HONEST DOCK

**Over `54d8e78`. Floor: twenty-two cells, exit 0. tsc: exit 0. Carries ZIP 8's rehoming.**

## §1 · R-37.82 ① THE GUTTER LAW — cured by construction, not by care

`--wl-gutter` is declared on `.wl` and applied by `.wl-main > *`. The column owns it; nothing
below it may take it back. **C22 asserts no `.wl-*` rule sets a horizontal margin, a side
margin, or a width computed against the gutter.**

It caught four on its first run. **Three were real** and are cured — `wl-hero` and
`wl-stillbuilt` each carried an 18px inset, `wl-fr` and `wl-masthead` a 16/18px padding, and
`.wl-card` a 16px margin. **The fourth was my own false positive:** the cell flagged
`margin: 0 0 8px`, which has no horizontal component at all. Tightened to a nonzero horizontal
value — a cell that cries wolf teaches the reader to ignore it, which is worse than no cell.

**Proved RED** by giving `wl-hero` its inset back → *wl-hero sets a horizontal margin*.

## §2 · R-37.82 ② THE ROW DISCIPLINE

The two rows and the link are **one grouped panel**, tile-matched: same `card-bg`, same `.5px`
border, same 3px radius, flush to the column's gutter. It reads as the grid's sibling because it
is built from the grid's own chrome.

Three rows, `.5px` hairlines between them, `min-height: 52px`, padding `0 14px`, glyph 12px
metal · title DM Sans 13/500 sentence case · chevron 10px `ink-dim`.

**Deleted as ruled:** 「YOUR 24/7 ENQUIRY DESK」, 「HOW COUPLES SEE YOU」, 「YOUR TDW LINK」. The
link row is mono 11px with middle-ellipsis and a Signal 「Copy」 right-aligned — no boxed card,
no label. A row that shows a link explains itself.

## §3 · R-37.83 · THE DOCK STOPS LYING WITH ITS SHAPE

ZIP 7's field costume was right about the shape and wrong about the promise: tapping it opened
WhatsApp. **A field that teleports lies on every deploy it survives.** So the dock takes the
panel's row idiom — glyph, a title that names its destination, chevron — until the chat can
answer it. The WhatsApp deep-link keeps exactly one home: the panel's top row.

## §4 · R-37.83 · THE CHAT CARRY — DERIVED, AND THE VERDICT INVERTED

**The blocker I filed as F-09.191 is already cured, and I did not notice when it happened.**

`ChatThread` and `InputBar` both call `useT()`. `ThemeContext.tsx:3` imports `DARK` and `LIGHT`
from `lib/vendor/theme.ts` — **and ZIP 3's arm ④ rewrote those two objects to Graphite and
Chalk on this branch.** So `useT()` already returns the new palette. The Espresso-inside-Graphite
failure F-09.191 described cannot happen on this tree any more.

**Remaining dependencies, enumerated:**

| dependency | verdict |
|---|---|
| `useT()` / `ThemeProvider` | `/w` does not mount the provider. Mounting the estate's own single-home provider is **not a shim** |
| `useChat({ vendorId })` | a hook; `vendorId` comes from the session `/w` already reads |
| `messages`, `loading`, `send`, `reportGlitch`, `markFreshThread` | all returned by `useChat` |
| `chatScrollRef` | a local ref at the mount site |

**So the carry now looks clean.** But *looks clean* is not *is clean*, and R-37.83 asked for a
derivation, not a guess: **I have not compiled or mounted it.** Shipping a chat I have only read
about would be the haunted mount the ruling warned against. **Priced as the next ZIP**, one
sitting: mount `ThemeProvider` in `app/w/layout.tsx`, lift `useChat`, rise `ChatThread` +
`InputBar` on dock tap, restore the field costume, and a cell asserting the dock's shape and its
destination agree.

`33652aa` exists in this repo; I did not read it. Its lesson is honoured by the shape of this
decision rather than by its content — an honest one-ZIP delay over a shim.

## §5 · R-37.82 ③ THE RHYTHM AUDIT — disposition

| surface | verdict |
|---|---|
| Rooms bands, panel, pointer | **complies** — 24px stride, 8px grid-to-label, gutter inherited |
| Today masthead, hero, still-built line | **complies** — gutter inherited, 8-scale |
| the first-run cards | **complies** — 10px stride, gutter inherited |
| the Business Solutions sheet | **Phase 2** — it is a full-page surface, not a column item; its rhythm is the sheet rebuild's business |
| the carried `/vendor` rooms | **Phase 2**, as R-37.76 ③ already ruled — full typographic rhythm parity inside rooms is the rebuild |

## §6 · THE ACCEPTANCE SCREENSHOT IS OWED, AND NOT SUPPLIED

R-37.82 asks for a screenshot with a vertical guide proving tile-edge and panel-edge are
pixel-identical in both modes. **This seat cannot produce it** — it has no renderer; the mock
was hand-authored HTML, not a screenshot of the build. Declaring the gap rather than
substituting a drawing for a measurement. **C22 proves the property by construction** — the
panel cannot have a different edge, because neither it nor the tiles set one. The founder's
glass supplies the picture.
