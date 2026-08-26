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
