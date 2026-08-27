# ZIP 14 — THE ARM OPENS ITS EYES

**Over `7f05ea4843f59c844773597d2f023dc8b4650d9a`. tsc: exit 0. `next build --webpack`: exit 0.**
**Floor: `FLOOR = NAMED BASE, no delta` — the first clean floor this branch has carried.**
**Served-bytes gate: 16 PASS · 0 FAIL · 2 INCONCLUSIVE. Render arm: 10 PASS · 0 FAIL, both modes.**

---

## ① THE RENDER ARM — `tools/wl_render.cjs`

**The browser problem was real and is routed, not assumed.** Playwright's CDN and Google's
storage host are both denied at this estate's egress proxy (`x-deny-reason: host_not_allowed`),
and no system chromium exists in the build container. `@sparticuz/chromium` ships the binary
**inside its npm tarball**, and npm is allow-listed. Driven with `puppeteer-core`.

**Both dependencies are PINNED, not caretted, and that is a finding in itself.** `^131.0.1`
resolved to a package with no default export and no `args`/`executablePath` — the arm threw on
the first run against its own declared range. A caret on a dependency whose *export shape*
moves across majors is a silent future break, which is the disease this whole arc has been
curing. `149.0.0` and `25.9.0` exactly.

### THE LAW THIS FILE OWNS

Ratified by the chair this sitting, and written into the file's header so it outlives the ZIP:

> Computed facts — **does it paint, where, in what style** — are structurally outside a
> served-bytes gate. Served-bytes assertions on that class print INCONCLUSIVE, never PASS.
> The render arm owns them.

A rule present in a stylesheet is not a rule that applies. Presence in a bundle is not presence
on screen. Three defects escaped in one arc on exactly that confusion.

### BOTH WAYS — every cell, both trees, one instrument

Run against the uncured tip and against the delivered tree:

| cell | UNCURED (`7f05ea4`) | CURED |
|---|---|---|
| C-R1 drawer paints inside the viewport | `top 852, bottom 1337, vh 844, visible false` | `top 83 of 844` |
| C-R2 the gutter APPLIES | `declared 12px; rendered left 0, right 390 of 390` | `inset 12px both sides` |
| C-R3 seventeen tiles render | `rendered 16` | `17 tiles on screen` |
| C-R4 chat input in branch tokens | `italic / Cormorant Garamond … serif` | `normal / "DM Sans"` |
| C-R5 chat opens at work-surface height | `h 303, vh 844, ratio 0.359` | `0.85 of viewport` |

```
UNCURED:  0 PASS · 10 FAIL      CURED:  10 PASS · 0 FAIL
```

**`ratio 0.359`.** The founder's conviction was "about thirty-five percent," eyeballed off a
frame. The instrument measured it at 0.359 before the ruling was written. That is the arm's
whole argument for existing.

---

## ② THE TWO WALK-REDS, CURED

**The drawer** — `WorklistShell.tsx`. `.wl-drawer` was a **sibling** of the header it anchors
to; `position:absolute` climbed past the static `.wl` to the initial containing block, so
`top:calc(100% + 8px)` meant *one whole viewport down*, and `.wl`'s `overflow:hidden` clipped
it. The scrim is `position:fixed`, so it painted — which is why the coin looked dead rather
than broken. The block moves **inside** the `<header>` that already carried `position:relative`
for exactly this job, and the header's stacking context rises above the scrim while open.

**The chat costume** — `InputBar.tsx:107-108` shipped `fontFamily: 'var(--font-cormorant)…'`
with `fontStyle: value ? 'normal' : 'italic'`. Both go to branch tokens. **The 「Ask anything…」
byte is untouched** — founder-era copy, flagged never moved. The costume was the violation; the
copy never was.

---

## ③ THE GUTTER — `RoomsGrid.tsx:99`

The line read `padding:18px 0 28px`, and the comment directly above it claimed *"the column
owns the gutter; the bands no longer set their own."* It set its own — to nothing. The
shorthand's `0` overrode the inset `.wl-main > *` supplies.

Measured: `--wl-gutter: 12px` declared, applied inset `0px`, first tile left `0`, third tile
right `390` in a 390px viewport. **Flush to both screen edges for twelve ZIPs**, in the founder's
own walk screenshots, passed every time by a gate that asserted the rule was *present*.
Longhand now, so the horizontal axis is left alone.

---

## ④ R-37.87 — COLLAB TAKES ITS OWN TILE

Seventeen rooms. Bottom band ten. **Count history, every step worded or derived: 11 → 15 → 16 → 17.**

- `lib/worklist/rooms.ts` — the `collab` room joins the registry and `FROZEN_ORDER`; the three
  exported constants become 17 / 7 / 10. Href is `/vendor/collab`, **A-4 interim like every
  other tile: the surface is carried, not rebuilt**, until Phase 2.
- `app/vendor/storefront/page.tsx` — **the Collab pill row is removed.** One home, or it is two,
  and two doors to one room is the disease the tile grid was ruled to end. The surface is
  untouched and the route is byte-identical. On `main` the row stands.
- `b40` cell C2 **amended by label, never by loosening** — it still asserts an exact count and
  an exact order, but now reads its expected numbers from the registry's own exported constants
  instead of literals retyped in the bench. One home for the count, so the cell cannot drift
  from the registry it guards. Position is the founder's to reorder in one word; the cell
  asserts wherever he puts it and reddens on any reorder he did not word.
- `tdw09_p2b` cell 3.7 **amended, labelled, count-preserved** — it pinned the Collab row's
  vetoed description inside Storefront. Its subject was retired by ruling, exactly as its own
  paragraph describes happening to V1's Leads tile. The assertion **inverts rather than
  vanishing**, so a silent re-add of the second door reddens.

---

## ⑤ R-37.89 — THE CHAT IS A WORK SURFACE

`.wl-askpanel` read `max-height:82dvh`. **A cap is not a height.** A cap only bites when content
is tall, and a fresh thread is empty, so the sheet opened at whatever an empty body happened to
measure — `0.359` of the viewport. A work surface does not resize itself to how little you have
said yet.

`height:85dvh` with the cap kept beneath it as the safety it always was · scrim behind at
`--role-scrim` (already present) · **a drag-down grabber** that is also a button, so keyboard and
screen-reader users get the same exit · the input pinned at the foot above
`env(safe-area-inset-bottom)` · the thread scrolling within · `.5px` border and sheet-bg tokens ·
the R-37.82 gutter applied **inside** the sheet, which is its own scroll column. Nothing else
about R-37.83's mount moves: same carried `ChatThread`, same in-app answer.

---

## ⑥ THE FLASH — CURED, AND THE MECHANISM WAS NOT THE ONE WE SUSPECTED

`app/w/layout.tsx:22`'s session guard rendered `<div style={{minHeight:'100dvh'}}/>` with **no
background**, so during every session resolution the vendor saw whatever `html, body` paints.
`globals.css:897/:906` paints the **old hub atmosphere** with `!important` — under
`html.theme-light`, a warm bone gradient `#F7F4EF → #F3EFE8`. Chalk's own ground is `#F3F4F4`,
a **cool** neutral.

Measured through the arm: `htmlClass: … theme-light`, `bodyBg: url("data:image/svg+xml,…noise…")`,
`bodyColor: rgb(14,17,18)`. **Warm-bone into cool-Chalk is the blink.** Intermittent because
`html.theme-light` is set by the *old* vendor theme system while this shell keys on
`data-wl-mode` — two mechanisms, and only the old one is in force during the gate.

It was never the Espresso browns the ZIP-13 assertion hunted; those really are gone.

**WHICH ARM THE DERIVATION PICKED, per the chair's rider: THE DEFAULT-DARK ARM.** The mode lives
in `localStorage` under `tdw_worklist_mode` and is read in a `useEffect`; the guard renders
*before* the shell mounts, by construction, so the active mode is **not knowable at first
paint**. The ground is pinned to the dark literal. A dark blink into Chalk is the benign
direction; warm-bone into cool-Chalk was the witnessed offense.

**The walk card's flash-watch beat stays.** This closes the derived mechanism; the founder's
glass confirms nothing else is hiding behind it.

---

## ⑦ THE INSTRUMENT MOVES · R-37.88 · THE CAPTURES

**`tdw09_vendor_census.mjs` → `tools/`.** A generator, not a bench, caught by the floor's
`scripts/*.mjs` glob — same disposition as the audit script. It rewrote its committed snapshot
on every floor run and dirtied the tree, and `tdw_f0774_vacuity_probe` then **correctly refused
to run**, because it writes to production source and cannot prove a clean restore on dirt.

**Derived, and it matters for reading the verify output:** on a committed-clean tree the probe
is now GREEN (exit 0). Its red had two causes — the census generator, cured here, and
working-tree dirt, which is *inherent to verify time* and correct conduct. **It will red in the
verify block and go green once the commit lands.** That is expected and is not a delta.

**R-37.88** — the mock lands at `docs/mocks/today-stature-mock.html`,
`sha256 = 507f9bb1143d002bb04d4ed656f388633c42a6e129f4d3d6f24c52769ce987e2`, 23,884 bytes.
Verified against the kickoff's hash on receipt.

### THE CAPTURE RIDER — and my instrument's two lessons about itself

Sixteen frames, every shell surface and every deep-linked room, both modes, plus tapped drawer
and risen chat. **Every filename carries its data condition:** `…__SYNTHETIC-SPLASH.png`.

**The seed's token is not real, so every authenticated fetch fails closed.** That is why the
coin renders its fallback glyph instead of `DR` — `useVendorHandle.ts:30` fetches
`/api/v2/vendor/me` and fails closed by design. **These frames are chrome-and-layout evidence.
They are NOT evidence about any data-bearing surface**, and the room frames in particular show
empty states that mean nothing about production.

Two corrections this seat owes its own captures:

1. **The first set shipped viewport-cropped**, and a panel row below the fold read as a
   *missing* row. I nearly filed a phantom defect off my own evidence.
2. **`fullPage: true` fixed nothing** — the shell is `height:100dvh` with `overflow:hidden` and
   an **inner** scroll column, so the document is exactly one viewport tall and the content
   scrolls inside an element. The second set clipped in the same place for a different reason.

The arm now expands the inner scroller for the frame and restores it after. **A frame that
silently truncates is the pixel-domain form of a sweep that reads one page — and it took two
tries to stop making one.**

---

## ⑧ WHAT THIS SEAT OWNS

- Two false-PASS verdicts in ZIP 13's gate (the drawer, the chat costume), and a third the arm
  found (the gutter). All three one class, all three now owned by the arm.
- **I shipped a verify line asserting the absence of a class NAME while my own labelled
  deletion comments named those classes** — comment-blind in the opposite direction to the
  defect I had just convicted a sweep for. Cured; ZIP 14's verify reports per clause.
- **Backticks inside a JS template literal**, twice, in comments I wrote about CSS. The type
  floor caught both. Same family: writing *about* a syntax inside that syntax.
- `sans-serif` contains `serif`; my first R2 cell reddened a cured tree on that alone.

## ⑨ THE NEXT SITTING

Item ⑥'s assertion set finalizes against the mock now that it is in the tree · a **fixture layer**
for the arm, so room frames become evidence instead of NOT-EVIDENCE · Phase 4's tile badges ·
and the walk card, which does not come to the chair until the founder's paste prints all-PASS
on both gates.
