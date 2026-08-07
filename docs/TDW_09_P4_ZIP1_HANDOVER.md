# TDW_09 · PACKAGE 4 (BRIDE) · ZIP 1 — THE BAR AND THE FIVE DOORS

**Repo:** dreamos-pwa · **Base:** `339ba5a` · **Executor:** Opus LE under the twenty-fifth chair · 2026-08-07
**Phase:** F-A arm (1), chair-ruled — doors first, theme second. **ZIP 2 (the theme re-solve) does not ride this delivery.**

---

## 1 · WHAT SHIPPED

**NEW — `components/frost/BrideBar.tsx`.** The five ruled doors, built from zero (F-09.136: `CanvasShell` carried a safe-area pad and no tab bar; the bride lane had no nav to amend).

| Door | Route | Why this route |
|---|---|---|
| Home | `/frost/canvas/sanctuary` | her rest state, unchanged |
| Discover | `/frost/canvas/explore` | the re-seated room — **not** the grave, see §2 |
| Muse | `/frost/canvas/muse` | the live 547-line grid, reading `muse_saves` |
| Journey | `/frost/canvas/journey` | the shipped hub, elevated |
| Circle | `/frost/canvas/journey/circle` | the standalone pages, promoted (F-09.137) |

The floor, each clause benched: 48px stable tabs · labels always visible · `pressedStyle` **imported** from `lib/vendor/controls`, never re-rolled · active = ink-weight shift · **no accent, no brass, no signal, no gold anywhere in the file** · safe-area · `prefers-reduced-motion` handled inside the primitive. The bar is **on-token from birth** — zero colour literals, zero `dark ?` ternaries, so F-09.27's disease is not re-seeded by its own cure's chrome.

**NEW — `app/(frost)/frost/canvas/explore/page.tsx`.** The Discover door: feed → card grid → `VendorProfileView`, through `lib/frost-api/discover` and `lib/frost-api/img`, with `ImageDots` mounted at its one home and never re-positioned by its caller.

**EDITED — `app/(frost)/layout.tsx`.** One seat for the bar. `barIsSeatedOn(pathname)` gates both the bar and its spacer, and the spacer's height is read from the bar's own exported constant — the reservation cannot drift from the thing it reserves. Onboarding, dream and surprise stay bare.

**EDITED — `app/(frost)/frost/canvas/journey/page.tsx`.** F-F(b): Couture, Memory Box and Honeymoon removed whole, with their `disabled` arm, their `soon` badge, and their now-readerless `Scissors`/`Plane` imports (P-1 corpse duty). Moments survives — it is a real route with honest copy already shipped.

**NEW — `scripts/tdw09_p4_bar.proof.mjs`.** 48 cells, eight of them mutations that bite production code.

---

## 2 · THE GRAVE STAYS A GRAVE

F-B arm (a) was refused by the chair and this delivery honours the refusal mechanically. `app/(frost)/frost/canvas/discover/page.tsx` is **byte-untouched**; `tdw07_p6_fold` runs 68/68 unmoved, including its `deadCode.length < 900` cell, which is the exact cell arm (a) would have reddened. The Discover **room** gets its door at a new path; the **deck** the founder killed in two letters stays killed, still honouring bookmarks.

**Executor's disclosure — a route name is mine, not the founder's.** `explore` is a URL segment, not a bride-facing byte: nothing on screen says it, and the door's label is the approved `Discover`. If the chair wants the segment to read `discover-room` or anything else, it is a one-line change in `BRIDE_DOORS` plus a directory rename, and the bench cell that matters (`§1.5`, Discover ≠ the grave) holds either way.

---

## 3 · PROOF

| Gate | Result |
|---|---|
| `tdw09_p4_bar` at the **cured** tree | **48/48** |
| `tdw09_p4_bar` at the **uncured** tree (`339ba5a`) | **17/48** — non-vacuous, reports cleanly, does not crash |
| Mutations | **8/8 bitten**, every one applied to real production source |
| `tsc --noEmit` | **0** |
| Whole bench floor, uncured vs cured | **byte-stable — the only diff in the entire directory is the new bench's own line** |
| Attributed reds | `tdw_f0774_stripper` **32/34** (F-10.49) reproduced as attributed · `tdw10_p3_deck` unmoved |

The floor was proven by running **every** `scripts/*.proof.mjs` at both trees and diffing the two count tables, not by re-running a named subset.

---

## 4 · DISCLOSURES, BY NAME

**D-1 — THE STRIPPER TRAP, BOTH SPECIES, WALKED INTO BY THIS BENCH.** The first run went RED on two of its own cells: `§3.4` convicted the bar because the bar's *header comment* says it carries no `dark ?` ternary, and `§4.1` convicted the journey hub because the *cure note* quotes the `route: null` it removed. The absence cells convicted the documentation of the cure — F-07.74's own disease, in its own successor. Cured the ruled way: the estate's one stripper, imported and invoked, with both an invocation cell and a canary.

**D-2 — MY BENCH BROKE A SEALED BENCH'S FLOOR AND I MOVED IT BACK.** Landing a stripper-importing proof pushed `tdw_f0774_stripper` from its attributed **32/34** to **30/34**: its §6 coverage roster is *derived from the directory*, so my file joined it the instant it landed and immediately failed §6.1 (no canary) and §6.4 (no `§0.Z INVOCATION` cell). Two of the four reds were mine, two were the pre-existing F-10.49 pair. I derived the actual offenders by re-running the roster's own detection rather than guessing — they are `tdw10_p1_shell.proof.mjs` and `tdw10_p2_bridge.proof.mjs`, neither of them mine and neither touched. With the canary and the invocation cell added, f0774 is back at **32/34**, attributed and unmoved.

**D-3 — MY F-F EVIDENCE WAS THINNER THAN I STATED, AND THE CHAIR RULED ON IT.** In the read-first I recommended arm (b) from the data table alone: three tiles with `route: null`. I had not read the render. The render shows them **disabled behind a `soon` badge** — which means arm (a), the honest teaser, was *already shipped*, carrying an unvetoed copy byte. This is the independent-method law's clause 2 (read past the cite) and I failed it. The ruling still executes as worded and I have executed it, because its reasoning stands on its own — a promise-tile goes nowhere whether or not it is labelled. **But the chair ruled with one fact short, and it should know before this seals.** If arm (a) is preferred on the corrected evidence, the reversal is the three table rows plus their two render arms, and the `soon` byte then needs a veto it has never had.

**D-4 — THE THREE JOURNEY STUBS' "RE-AIM" IS A NO-OP BY CONSTRUCTION, so I performed none.** F-C(a) called for the stubs to re-aim as route edits. They cannot: `sanctuary/page.tsx` opens a bloom from `activeRoom` **local state only** — there is no `?room=` reader, no `useSearchParams`, no deep link of any kind. `expenses`, `settings` and `vendors` already redirect to sanctuary, which is precisely and exactly where a re-aim could send them. Adding a deep-link reader would touch the conductor, which is row 13's. Reported, not worked around. Filed below as **F-09.142**.

---

## 5 · FINDINGS

**F-09.142 — SANCTUARY HAS NO DEEP LINK.** `sanctuary/page.tsx` holds `activeRoom` in `useState` with no URL reader, so no external surface can open a named bloom. Consequence for this package: the three journey stubs' re-aim is a no-op (D-4). Consequence for row 13: the conductor it extracts should be born with a deep link, because five doors and twelve blooms make the absence structural rather than cosmetic. **Homed to row 13's conductor work.**

**F-09.143 — THE SCHEMA SNAPSHOT IS TWO COLUMNS BEHIND ON `public.couples`.** The founder's `information_schema` run returns **23 columns**; `docs/db/PUBLIC_SCHEMA.md` documents **21**. Undocumented at the snapshot: `residence_city text`, `wedding_style text`. Both confirmed **absent**: `theme` and `eliza_enabled` — which settles F-09.138 (row 13's server truth does not exist yet, so F-09.26 stays named-not-cured) and F-09.139 (the Eliza flag is an `admin_config` lane flag, not a column) at the settling witness rather than at the snapshot. Doc-gap; rides the founder's shelf-carried regeneration.

---

## 6 · THE FOUNDER'S WALK CARD

Authored from his pasted rows, not from a fixture. **Account: +919625759924 · couple `9f1f84d5-e688-4d4f-9e44-9f5da6315e52` · wedding 2026-12-01, Jaipur · onboarding `complete` · muse saves = 2.**

He performs and pastes; the executor reads the evidence.

| # | Step | What he should see | Evidence read |
|---|---|---|---|
| 1 | Open the bride app | The bar across the bottom: **Home · Discover · Muse · Journey · Circle**, all five labels visible, Home lit | five labels, ink-weight on Home |
| 2 | Tap each door left to right | Each lands; the lit door follows his thumb; nothing dressed in gold | active door tracks |
| 3 | Tap **Muse** | **Two saves** — the number his own SELECT returned | 2 tiles |
| 4 | Tap **Circle**, then a member | Circle stays lit on the member page | active door holds one level down |
| 5 | Tap **Journey** | The hub, and **no Couture, no Memory Box, no Honeymoon** | three tiles gone |
| 6 | Tap **Discover** | The marketplace room with a door of its own | feed renders or says so honestly |
| 7 | Press and hold any door, then slide off it | It lights, then releases — it does not stay lit | the pressed acknowledgment |
| 8 | Start an onboarding or a dream screen | **No bar** | the bar is seated, not universal |

**Declared for step 2, per F-A(1):** he is walking the new nav in **today's Sky & Ivory**, whose muted text reads **2.67** and whose accent reads **3.98** — both under AA. That is the palette ZIP 2 replaces with Warm Porcelain at the values he approved. He should judge the *structure* on this walk and not the colour.

**No step has an underived thumb-path.** The Journey, Circle, Muse and Discover counts beyond `muse_saves` were not witnessed by SQL at this desk; steps 4 and 6 therefore ask what renders rather than asserting a number.

---

## 7 · WHAT ZIP 2 CARRIES (not this delivery)

Warm Porcelain at the approved values into `lib/frost/tokens.ts` · Wine's α.45→.52 · the **83** `dark ?` ternaries and **16** `#1A0810` lines routed onto `getV2Tokens` at my census, with F-09.27's cell asserting over the surviving render sites · landing cells asserting each approved string per F-09.125. F-09.26 named-untouched throughout: there is nowhere server-side to persist to (F-09.143).

---

## 8 · OPEN

- The chair's word on **D-3** (F-F's corrected evidence) and on the `explore` route segment (§2).
- **F-09.142** homed to row 13; **F-09.143** to the schema regeneration.
- Register: F-09 spent through **.143** by this desk; **.144–.145** remain mine.
