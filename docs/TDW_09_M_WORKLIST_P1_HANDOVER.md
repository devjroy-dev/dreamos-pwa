# M-WORKLIST PHASE 1 — THE SHELL ON ITS OWN DOMAIN

**repo: dreamos-pwa · branch `worklist` · base `09cc166` (empty wake commit over `aae3f99`)**
**dream-os read at `409c602`. Production `main` carries zero bytes of this arc.**

---

## §1 · THE HAZARD THAT TRAVELS WITH EVERY WALK CARD

**The branch PWA is a second front door onto the live house** — production backend, real writes
behind A-4's interim deep-links. Walks on `9888294440` only.

`lib/api.ts:12-14` reads `NEXT_PUBLIC_API_BASE` and falls through to the production Railway
host, so the branch talks to production dream-os whether or not a Preview-scoped env var
exists. That is the hazard working as designed, not a defect.

---

## §2 · WHAT SHIPPED

Fifteen files: eleven new, two edits to pre-existing files, one bench, this document.

| file | new/edit |
|---|---|
| `lib/worklist/copy.ts` | new — one home for all eleven vendor-facing bytes |
| `lib/worklist/theme.ts` | new — Graphite & Chalk, 33 tokens each |
| `lib/worklist/rooms.ts` | new — the sixteen rooms, frozen |
| `components/worklist/WorklistShell.tsx` | new — scope, header, coin, two seats |
| `components/worklist/RoomsGrid.tsx` | new — two bands, 7 + 9 |
| `components/worklist/FirstRun.tsx` | new — the manual that deletes itself |
| `components/worklist/AiDock.tsx` | new — the slim dock |
| `app/w/layout.tsx` · `page.tsx` · `rooms/page.tsx` · `support/page.tsx` | new |
| `public/worklist-manifest.json` | new |
| `lib/waNumbers.ts` | **edit** — `supportWaNumber()` added beside the lane pair |
| `app/layout.tsx` | **edit** — one line, the manifest href |
| `scripts/b40_worklist_shell_bench.js` | new |

The two edits are the only pre-existing files this arc touches, and neither travels to `main`.

---

## §3 · THE FLOOR

`node scripts/b40_worklist_shell_bench.js` → **exit 0, six cells GREEN.**

**Non-vacuity — every cell proved RED on a mutation of production code, then restored
byte-identically (`cmp` IDENTICAL on all five files):**

| cell | mutation that reddened it |
|---|---|
| C1 tokens | dropped `'grain'` from `GRAPHITE` → *32 tokens, expected 33* |
| C2 rooms | swapped `leads`/`clients` in `FROZEN_ORDER` → order drift, both lists printed |
| C3 number | replaced `supportWaNumber()` with the literal → *number literal in app/w/support/page.tsx* |
| C4 register | `What TDW does for you` → `What this app does for you` → reduction found |
| C5 persona | `DreamAi answers for you` → `Victor answers for you` → seat-name in chrome |
| C6 container | added `<input />` beside the second seat → search-as-navigation banned |

**Type floor: `npx tsc --noEmit` → exit 0, zero errors across the whole tree.**

**`npx next build` DID NOT COMPLETE IN THE EXECUTOR CONTAINER, and the reason is
environmental, named rather than waved at.** Four errors, all `next/font` failing to fetch
Cormorant Garamond, DM Sans, Italiana and Jost from Google Fonts; `curl https://fonts.googleapis.com/`
returns **403** from this container's egress proxy. **Zero build errors name any file in this
delivery** — `grep -iE "worklist|app/w/"` over the build log returns nothing. Vercel's builder
has network, so the branch deployment is the first real witness of the compile. Declared here
as a gap rather than claimed as a green.

---

## §4 · R-37.72 — THE SELF-REFERENCE SWEEP, CENSUS

All eleven Phase 1 bytes plus the five first-run strings swept for the reduction:

| byte | verdict |
|---|---|
| 1 manifest name · 2 short_name · 3 `Today` · 4 `Rooms` | clean |
| 5 honest-empty, both sentences | clean — "Today" names the surface, not the product |
| 6 `All clear.` · 7 resting summary and scope | clean |
| 8 support body · 9 action label | clean |
| 10 `Graphite` · 11 `Chalk` | clean |
| first-run header | **the sole offender**, amended to `What TDW does for you` |
| cards 1–4, chips | clean — card 1's "Nothing for them to install" speaks of the couple's experience, ruled to stand |

**One offender, cured.** The chair's own pass found the same one; this is the record. Cell C4
holds the line going forward.

---

## §5 · CARD 3 — THE TOOL CENSUS, PER-EXAMPLE VERDICTS

Derived at dream-os `409c602`, `src/agent/tools.js`, 24 tools. **Zero drops.**

| chip | tool | line | verdict |
|---|---|---|---|
| `Am I free on 14 February?` | `query_day` | `:443` | BACKED — the description directs its own use for date-specific asks |
| `How many open leads do I have?` | `list_leads` | `:90` | BACKED — the description names the ask nearly verbatim |
| `Log a studio hire expense` | `log_expense` | `:351` | BACKED — studio hire is an enumerated trigger |
| `Mark Aarti's invoice paid` | `record_payment` | `:291` | BACKED, **with a chain** — the tool instructs itself to call `list_invoices` first when the invoice is named by client. Works from a text ask; two tools, not one. |

Also surfaced: `get_my_tdw_link` (`:282`) — card 1's link is retrievable by asking as well as by
tapping. A second door to the same fact, not a second home for it.

---

## §6 · FINDINGS AND DECLARED GAPS

**F-09.191 (candidate) — `ChatThread` cannot inherit the branch palette.**
R-37.69 asks Phase 1 to ship "the dock and the carried chat behind it". Derived before building:
`ChatThread` reads its colours from `useT()` (`lib/vendor/ThemeContext.tsx:174`), a React context
of hard-coded hex from the old two-theme pair — **not** from `var(--atelier-*)`. So R-37.65's
"shared components inherit through the existing theme variables" does not reach it: mounting it
inside the shell scope renders an Espresso-coloured thread inside a Graphite shell. The pipeline
itself is liftable (`useChat({ vendorId })` is a hook, `hooks/vendor/useChat.ts:56`); the palette
is the blocker, and curing it means teaching `ThemeProvider` to accept an override token set — an
addition to a shared single home, which is a ruling and not a Phase 1 byte.

**Phase 1 therefore ships the dock summoning the existing chat door by the same interim pattern
A-4 already rules for every room tile.** Destination real, reachable, never a 404. The carried
mount is bound by label to the ThemeContext ruling. `AiDock.tsx` carries this reasoning in its own
header so no later reader mistakes it for a shortcut.

**F-09.190 extended — the number now has SIX homes.** Beyond `Header.tsx:331`, the same literal
`917982159047` is inlined at `settings/page.tsx:105` (which composes the TDW link) and
`OnboardingOverlay.tsx:107`. Declared homes: `lib/waNumbers.ts`, dream-os `src/lib/waNumbers.js`,
migration `0099`. Undeclared: the three above. **This delivery makes no seventh** — cell C3 is the
standing guard.

**Card 1 is a routed chat, not a page.** `settings/page.tsx:105` composes the "TDW link" as
`wa.me/<vendor>?text=TDW-<HANDLE>`. Copy claims routing only; the card is hidden entirely when
`routing_handle` is unset, and the fetch fails closed.

**`chip-inactive` ships UNDER BAR, arm (iii) ruled.** 4.02:1 on Graphite, 3.01:1 on Chalk, against
4.5. `SliceShell.tsx:104` hard-codes `opacity: 0.45` and D-2 forbids a branch fork; no ink value
clears it — pure black at 0.45 over Chalk's card composites to `#888888` and ceilings at
**3.33:1**. Bound by label to the Phase 2 `SliceDoor` sitting. Recorded in `theme.ts`'s header.

**⚠ CROSSING A TILE LEAVES THE PALETTE.** A deep-linked room renders under the OLD shell's theme,
because `app/vendor/layout.tsx` owns its own token layer. Inherent to A-4, stated on the walk card
so the founder reads it before he sees it.

---

## §7 · PHASE 2 AND PHASE 3, BOUND BY LABEL

**Phase 2 — the `SliceDoor` sitting, three things in one edit:**
1. a base-path prop (`SliceDoor:99` hard-codes `/vendor/list/${s}`)
2. theme-conditional inactive-chip opacity — the `chip-inactive` cure
3. the `ThemeProvider` override that unblocks F-09.191

**Phase 2 — `/vendor/more` retirement:** every §4 M-row gets a named destination —
CARRIED-to-tile / CARRIED-to-coin / already-elsewhere — before the page retires.

**Phase 3 — the `today` response contract, one fetch and three consumers:**
- per-kind counts a tile badge can read cheaply (rider ①)
- a `has_any` flag or totals, so first-run is distinguishable from a quiet day (R-37.68)
- the badge-equals-feed-count cell ships with the feature

**§8.10 division, stated so Phase 4 retires the right thing:** the tour points at chrome once and
is dismissed; the first-run feed explains capability every time until data arrives, then never
again. First real data is the product explaining itself by working.

**R-37.71 — the basic-tier variant of card 2 drafts and vetoes at Phase 4, never silently.**

---

## §8 · WHAT IS NOT DONE

- **Pins are not implemented.** `DEFAULT_PINS` names Calendar and Storefront per §8.2 and
  `Room.pinnable` carries R-37.62, but no pin surface renders in this phase. Declared, not hidden.
- Tile badges: Phase 4.
- The resting Today (bytes 6 · 7): Phase 4. The bytes have a home from the moment they were vetoed.
- The FAB alternative to the dock: switchable at the walk, per R-37.69.

---
---

# ZIP 3 — R-37.73, THE QUALITY BAR

**Applied over `011e6c9` + ZIP 2. Floor: twelve cells, exit 0. `npx tsc --noEmit`: exit 0.**

## §9 · ① THE TAP-TARGET CENSUS

Floor is 44×44 CSS px. Every interactive control in the shell, before and after:

| control | file | before | after | verdict |
|---|---|---|---|---|
| `.wl-coin` | WorklistShell | 40×40 | **46×46** | was UNDER — chair's conviction confirmed |
| `.wl-seat` (nav) | WorklistShell | *no min-height* — cleared 44 by padding alone | **52** explicit | was a target surviving by accident |
| `.wl-coinitem` | WorklistShell | *no min-height* (~42 computed) | **48** explicit | was UNDER |
| `.wl-tile` | RoomsGrid | 62 → 68 (ZIP 2) | **74** | passed; given air |
| `.wl-dock` | AiDock | 44 exactly | **50** | met the floor to the pixel; given air |
| `.wl-cardaction` | FirstRun | 40 | **46** | was UNDER |
| `.wl-chip` | FirstRun | *no min-height* (~30 computed) | **44** | chip-shaped things invite a thumb; a dead chip teaches that some chips are dead |
| `.wl-supportaction` | support page | 44 exactly | **48** | met the floor; given air |

Cell **C10** reads `min-height` off the shipped CSS and fails a control that has none — a target
without a stated height is a target that survives by accident.

## §10 · ② THE TYPE SCALE

Named tokens in `lib/worklist/theme.ts` (`TYPE`, `TYPE_FLOORS`, `TAP_MIN`). Floors ruled:
**label ≥ 11 · interactive ≥ 12 · body ≥ 14.**

| element | before | after |
|---|---|---|
| tile name | **9** (convicted) | **12** |
| band caption | 8.5 | **11** |
| nav seat | 9.5 | **12** |
| header label | 10 | **11** |
| coin sub-label | 9 | **11** |
| dock glyph | **10** | **12** |
| dock text | 9.5 | **12** |
| card title | 9.5 | **12** |
| card body | 13.5 | **14.5** |
| chip | 11.5 | **13** |
| action label | 9 | **12** |
| Today empty (dim) | 12.5 | **14** |

Cell **C11** asserts each against its floor.

## §11 · ③ PARITY AGAINST THE APPROVED SHEET

Deltas found, each cured or declared:

| delta | verdict |
|---|---|
| tile names 9px vs the sheet's rendered weight | **CURED** — 12px/500 |
| chrome gutters 18px vs sheet's 22px | **CURED** — header now 22px |
| band spacing 20px vs 22px | **CURED** |
| card padding 16 vs 17 | **CURED** |
| chip height ~30 vs the sheet's padded shape | **CURED** — 44 |
| the sheet's slice-room mock rendered in Graphite | **THE DELTA THAT MATTERED** — cured by ④, not by a spacing tweak |
| sheet's phone frame at 308px fixed | **DELIBERATE** — the shell is fluid; the frame was a rendering device, not a spec |
| sheet's `.rn`/`.rs` row type | **DEFERRED** — those rows belong to the carried slice room, which ④ now themes; Phase 2 owns their type |

## §12 · ④ THE ROOMS ARM — GRAPHITE IN THE CARRIED ROOMS

**Three colour homes, all three moved, because two would have shipped a half-converted room —
which reads worse than uniform brown:**

1. `lib/vendor/theme.ts` — DARK/LIGHT **values only**, all 31 keys, keys and structure and
   comments untouched. This is what every `useT()` consumer reads (SliceShell, ChatThread,
   every sheet). Verified: zero Espresso/Paper values remain in either block.
2. `app/globals.css` — an **appended** override layer, variables only, `!important` narrowly
   because the room atmospheres (`body.room-studio` = 0,1,1) and their own `!important` page
   paints outrank a plain appended `:root`. It changes no layout property, ever.
3. `app/vendor/layout.tsx` — `LIGHT_VARS` repointed to Chalk. This writes **inline** styles on
   `documentElement`, which beat every stylesheet; leaving it would have kept light rooms cream
   no matter what the CSS said.

**Atmospheres (§8.13):** same two gradients, same geometry, same stop positions, re-keyed to
Graphite grounds. Structural delta zero.

**F-09.28 re-measurement — the carried rooms' role usages, composited then computed:**

| role usage | Graphite | Chalk | bar |
|---|---|---|---|
| ink on page | 15.74 | 17.21 | 4.5 |
| inkSoft on card | 10.38 | 13.43 | 4.5 |
| inkDim on card | 6.98 | 9.56 | 4.5 |
| inkMute on card | 4.98 | 6.79 | 3.0 |
| brass/metal on card | 7.47 | 4.50 | 3.0 |
| accent on card | 8.62 | 6.12 | 4.5 |
| label on header | 9.03 | 10.66 | 4.5 |
| positive / caution / critical | 8.46 / 8.46 / 6.41 | 5.42 / 5.55 / 5.76 | 4.5 |
| inputBorder on sheet | 3.72 | 3.25 | 3.0 |

**Nothing under bar.** `metal` stays theme-conditional — `#C9A84C` on Graphite, `#8A6F2A` on
Chalk. Carrying `#C9A84C` across to Chalk would measure **2.15:1**: that is the 7.78-vs-2.05
failure, and it does not return wearing a new palette.

**⚠ PHASE 7 IMPLICATION.** At cutover this divergence becomes the vendor shell's real palette
for ~22 paying vendors. That is a house-visible change needing its own word at that seam.
Living on a branch does not ratify it. Stated in all three files' own headers.

## §13 · ⑤ THE 503 — NAMED

**It is manufactured, and the estate already built the instrument to prove it.**

`public/sw.js` synthesises `503` at four sites. The one that fits every frame the founder pasted
is **branch one, `sw.js:82-83`**:

```
url.hostname.includes('railway.app') || url.pathname.startsWith('/api/')
  → fetch(request).catch(() => new Response('', {
      status: 503, headers: { 'X-TDW-SW-Synthetic': 'api-or-railway' } }))
```

Why it fits: the SW is registered app-wide (`app/layout.tsx:147`), so it intercepts `/w` as
well as `/vendor`; every surface in the estate calls `/api/v2/vendor/me` on load — including
`/w`, whose only network call is exactly that (`FirstRun.tsx:39`); and `fetch()` rejects only
at the network layer, which `sw.js`'s own header (F-07.33) records as happening when a
service worker takes over a live page and purges caches under it.

**VERDICT: not cured here, and not claimed as cured.** The discriminator is a header, and a
header needs the founder's handset. F-07.33 put it there for this sighting:

- header present → self-inflicted, harmless, **F-07.33 closes**
- header absent → a real upstream 503, and it becomes a dream-os finding with its URL

**The one-liner, run in the console on `/w`:**

```
performance.getEntriesByType('resource').filter(e => e.responseStatus >= 400)
  .map(e => e.name + '  ->  ' + e.responseStatus)
```

That prints the URL, which is what ⑤ asks for and what neither of us has yet.

## §14 · ⑥ NON-VACUITY FOR THE NEW CELLS

| cell | mutation that reddened it |
|---|---|
| C10 | `.wl-tile` min-height 74 → 38 → *under the 44px floor: wl-tile at 38px* |
| C11 | `.wl-tname` 12 → 9 (the exact conviction) → *under the type floor: wl-tname at 9px, floor 12* |
| C12 | DARK `pageBg` back to `#1F1612` → *DARK still carries an Espresso/Paper value* |

All three restored `cmp`-identical. **Self-caught during this sitting, disclosed rather than
quietly fixed:** C10 and C11 first shipped with doubled backslashes in their generated regex, so
every rule lookup missed and both cells reported RED with the wrong cause ("rule not found") —
a red that named nothing. Caught on the first run, corrected, re-proved. C12 first asserted
against the whole file and caught `theme.ts`'s own prose, which legitimately quotes the old
palette while explaining the roles; it now reads the DARK/LIGHT value blocks only.

## §15 · THE WITNESS

The emulator is disqualified for this delivery, per ⑥. Every beat below is the founder's real
handset.
