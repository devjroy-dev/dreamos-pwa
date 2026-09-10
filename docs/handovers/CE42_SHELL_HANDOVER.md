# CE-42 · SEAT SHELL · R-42.12 AMENDED — EVERY ROW NAVIGATES (dreamos-pwa) — HANDOVER

**Base:** dreamos-pwa `85f6f3c1c5938bd6ee7ddd5951f868ab18515ae0` (R6's 4b-1 handover on `5ab27e88`).
**Sibling at every number below:** dream-os `aa1f5ec0b142b20f41b09667555b97b54cfa5340`, a FULL clone.
**Rulings this packet executes:** R-42.12 as amended · S2(a) · S3(i) · S4(c) · S5(b) · F-42.200 ·
F-42.202 · the veto sheet (`docs/mocks/SHELL_VETO_SHEET.md`) · frames accepted 5 × 2 arms.

## 1 · Shipped

- **Two shell screens.** `/vendor/dates` (Open dates & rates) and `/vendor/number` (Your own number).
  Each is titled with `ROOM_ROWS`' own label via `roomLabel()`, carries a lede and a three-line
  can-do list, and has ONE enabled control whose only act is `show(COPY.launchingSoon)` through a
  mounted `WlToast`. `/vendor/dates` also carries the S2(a) door: D5 plus a `RoomRow` to
  `roomHref('storefront')`, labelled with the registry's own byte. `/vendor/number`'s control reads
  `BUTTONS.connect` (N5(a), zero new byte). No `/me` read (S3(i)). No persona name.
- **The hub.** `ROOM_HREFS` is a total `Record<RoomKey, string>`: a row without a destination, or
  a key that is not a row, fails `tsc`. `PREVIEW_KEYS = {dates, number}` decides the chip —
  those two read `Coming` (register §1a), the other eight `Open`. `RoomRow` is Link-only with a
  required `href`; its `<div>` branch retired. No hub toast (none was ever mounted).
- **Addresses.** `DATES_HREF` and `NUMBER_HREF` in `lib/solutions/routes.ts` — the EIGHTH and
  NINTH constants (R6's `POSTS_HREF` took the seventh after c-42.42 was written).
- **Copy.** Two homes, `lib/worklist/openDates.ts` (D1–D6) and `lib/worklist/ownNumber.ts` (N1–N4).
  `COPY.launchingSoon` (T1) in `lib/solutions/copy.ts` with its register row. `RoomKey` and
  `roomLabel()` beside `ChipKey`.
- **F-42.202.** `.wl-toast` takes `pointer-events:none`; `.wl-toastaction` takes `auto` back. The
  carve-out is load-bearing: three toasts carry an action through WlToast (`SliceShell.tsx:552`,
  `:1021`, `BinderCard.tsx:202`), and a blanket `none` would have killed every Undo and Retry.
- **F-42.200, four sites, the register wins.** Register §1a gains a dated note (eight chips,
  closed; S4(c) adds none) · the §4 row for `Coming` reads APPROVED · `CHIPS.open` gets its row ·
  `copy.ts`'s CHIPS note says APPROVED and points at §1a · `bs_audit` C8 amended by label
  (Coming joins the approved list) · `bs_audit` C24 TIGHTENED to a table-cell match (radius
  derived before the edit: 1 of 39, `CHIPS.open`, cured in the same edit).
- **Benches amended by label.** `b42` C4 → "every row is a Link with an href" (+ the chip re-aimed
  to the preview set) · `b40` C31 reads the two new constants. **New:** `b73`.
- **Frames.** `docs/mocks/shell-screens-mock.html` + 20 captures (5 frames × Graphite/Chalk ×
  374/390), re-cut from this packet's own tree: tokens from the SHIPPED `scopeCss`/`typeCss`,
  rules extracted from the four component literals and `app/globals.css:947-948`.
- **THE CHAIR'S ACT, carried, not authored:** `scripts/run-floor.sh`'s named base re-based per
  c-42.43 — thirteen join, `tdw10_p2_retint` leaves. Derived by set arithmetic against a clean
  worktree at the base: the ruled edit equals the measured set exactly (28 → 40).

## 2 · Proven (sibling-full, `npm ci`, at the cut)

| Instrument | Base `85f6f3c1` | This packet |
|---|---|---|
| `run-floor.sh --check` | 40 RED, 0 REFUSED (the re-based list) | **`FLOOR = NAMED BASE, no delta`** (`--delivery` mode, 38 dirty paths all declared) |
| `b73_shell_screens_bench` | REFUSES (subjects absent) | **69/69 GREEN** · `--mutate` **21/21 RED**, no-op control GREEN, tree restored byte-for-byte |
| `b42` | 175/176, red = C7 | 178/179, red = C7 — same set |
| `b40` | FLOOR RED 2 (C50, C102) | FLOOR RED 2 — **red lines byte-identical** |
| `bs_audit` | 35 PASS · 1 FAIL (C36) · 0 INCO | 35 PASS · 1 FAIL (C36) · 0 INCO |
| `b57` · `b69` · `b74` | green | 192/192 · 71/71 · 8/8 |
| `tsc --noEmit` | — | exit 0 |

`b73` drives behaviour wherever a subject can run: a real TypeScript program over the real copy
home (TS2741 on a missing row, TS2353 on an extra key, TS2322 on a non-row key); `RoomRow`
transpiled and rendered with `react-dom/server`; the preview set driven through the real row
(two Coming, eight Open); every shipped byte against the sheet by value, length and sha256, both
ways; and F-42.202 in a real browser — `elementFromPoint` at the notice lands on the row beneath,
at the action lands on the action. With no browser that section prints INCONCLUSIVE and counts
nothing; it launched here.

## 3 · Not proven, declared

- **`npm run build`** — the founder's gate (R-40.66); this container reaches no font host.
- **The rendered surfaces on a device.** The frames are the container's rasteriser: ledes 2 lines
  at 374 and 390; can-do lines wrap 2/2/1 at 374 (D2, D3, N2, N3 end on one word — accepted as
  measured, the founder overrules on the walk); rows 56px, CTA 44px, no horizontal scroll.
- **The toast still SITS on the Storefront row** on `/vendor/dates` for its 3 seconds — F-42.202
  makes it transparent to the finger, not absent. That is ruled; the card below witnesses it.

## 4 · Errors owned in the cut

- **e-1 · A killed mutation pass left a mutation in the tree.** The first full `--mutate` run hit
  this container's time limit while M14 was applied, and `WlToast` kept the mutated rule —
  `pointer-events:none` gone, F-42.202 silently reverted — until the plain bench re-run read RED.
  Reversed by edit, not checkout (R-40.65). The pass now holds the pending original and writes it
  back on SIGINT/SIGTERM/SIGHUP and exit, and takes `--from=/--to=` slices; run whole by the
  founder. SIGKILL still cannot be caught — the plain bench is the witness after any interruption.
- **e-2 · A straight apostrophe inside a shipped CSS literal.** The new rule's comment read
  `W5-hub's`; `b40` C102 reads a template literal as shipped bytes, and its `(+7 more)` became
  `(+8 more)`. Caught by comparing the red LINES, not the count — the count was 2 both sides.
  Rewritten; the comment now says why it holds no apostrophe.
- **e-3 · A refusal that was my clone.** `g11c_couple_switch` REFUSED because this seat's dream-os
  clone was shallow and `286cdb4` was not an ancestor. Unshallowed; 36/36. A clone fact, not a
  tree fact — but it would have gone into this handover as the latter.
- **e-4 · Two bench windows, both caught on first run.** `b42` C4's `RoomRow` window stopped at the
  destructuring's brace; `b73` §4's `<button[^>]*>` stopped at the `=>` in the onClick. Both now
  bind to the statement's own close.

## 5 · For the chair's record (not this seat's to write)

- **F-42.113, second specimen, derived:** `tools/advisor_frame_emit.mjs` emits **0** `--role-*`
  declarations where the shipped `scopeCss('.wl')` emits **18** (nine role keys × two arms):
  its `prefixFor` reader matches `return '<literal>'` and the function is a ternary, so the branch
  list prints empty (visible at `docs/mocks/j1-introductions-mock.html:5`) and every key is
  written `--atelier-*`. A shipped rule reading `--role-metal` (the toast's dot), `--role-caution`
  or `--role-critical` renders unresolved through it. This packet's frames bypass it by calling
  the shipped function. Not cured here.

## 6 · Founder card — DEV440, after the deploy equals the pushed tip

1. Open **Business Solutions**. Ten rows. **Open dates & rates** and **Your own number** read
   **COMING**; the other eight read **OPEN**.
2. Tap **Open dates & rates** → a screen titled *Open dates & rates*: two-line lede, three lines,
   **Suggest rates**, then *Date checks already work on your page.* and a **Storefront** row.
3. Tap **Suggest rates** → **Launching soon.** in the centre for about three seconds; the screen
   does not move.
4. Tap it again, and **while the toast is showing** tap the **Storefront** row. On a 374/390 × 844
   screen the toast sits over that row (measured on the frames); on yours it may sit a little
   higher or lower — tap the row wherever the pill overlaps it. **Storefront opens** (F-42.202:
   the notice never takes the tap). Screenshot the toast over the row if you can.
5. Back to Business Solutions → **Your own number** → **Connect** → **Launching soon.**
6. Back → **Wedding pages** → opens as before.

## 7 · Next

R8's room replaces `/vendor/dates` at the same address and removes `dates` from `PREVIEW_KEYS` in
the same edit; R9's does the same for `number`. `lib/worklist/openDates.ts` / `ownNumber.ts` are
their copy homes.
