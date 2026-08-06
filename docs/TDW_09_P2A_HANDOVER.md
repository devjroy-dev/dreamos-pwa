# TDW_09 · PACKAGE 2 · PHASE A — THE FIVE DOORS · HANDOVER

**Under:** the twenty-fourth chair · R-X27 arm (a) vendor-ruled · chair relays #1–#3 (build gate, phasing A→B→C, forks F-1…F-7, fork 8 all five limbs) · founder veto relay #2 「 all ok 」 on the Phase-A slate.
**Base:** `dreamos-pwa @ 84848e8`. **Delivery:** one pwa ZIP, this document riding it. **tsc 0 · doors bench 86/86 · full floor green** (the two standing attributed reds — tdw10_p3_deck 191/193 = F-10.62 (P3's desk) and tdw_f0774_stripper 33/35 = F-10.49 — reproduced UNMOVED).

---

## 1 · WHAT SHIPPED

| # | Change | Warrant |
|---|---|---|
| 1 | **BottomNav rebuilt on ONE membership** — `DOORS`: Home ✦ (exact `/vendor`) · Calendar ◐ · Business ≡ · Storefront ▣ (active on `/vendor/storefront` + `/vendor/portfolio` + `/vendor/discover` + `/vendor/collab`) · More ⋯ (exact). Labels are the founder-vetoed bytes. Glyphs CARRIED, never invented (✦ from the pill's AI segment; ▣ from the Portfolio tab the door absorbs). The bar wears `pressedStyle` by construction (F-09.21's first adopter) with pointer-event press state + reduced-motion tracking; tap-highlight suppression stands WITH its replacement. F-07.30's one-authority lesson survives in the DOORS header. | R-X27(a) · relay #2 slate · S5 §3 |
| 2 | **The mode dissolved, organ by organ, each by name (fork 8.4):** ModePill + SEGMENTS retired from the live nav · Header's pill slot, `handleModeChange`, classifier read, and the now-orphaned `usePathname` read retired with tombstone · `useVendorMode` reduced to a TYPE-ONLY residue (hook + `vendor_app_mode` localStorage key deleted; type survives for the held demo twin) · `lib/vendor/vendorModeForPath.ts` **deleted** (caller-zero; apply block below carries the `rm`). `VictorModeChip` byte-untouched — the one surviving mode control. | relay #3 |
| 3 | **The pager retired by subtraction (fork 8.1 = (a))** — layout keeps Splash (ruled invariant), theme init + LIGHT_VARS pin, ThemeProvider, bar mount; loses PANEL_ROOTS, touch handlers, suppression walker, gesture consts, edge hints. `data-pager-inert` STANDS on SwipeRow (the held demo pager reads it); only the live layout stopped listening. | relay #3 |
| 4 | **Room atmospheres re-keyed route-prefix (fork 8.2)** — `roomClassForPath` carries the retired classifier's buckets BYTE-EQUIVALENT (cell §5.2 asserts list equality); `/vendor/storefront` falls to the else bucket (room-studio), the mapping's own default, no new atmosphere minted. Zero visual delta. | relay #3 |
| 5 | **The bar on Home: rest-visible, risen-hidden (fork 8.3)** — the AI-null died; Home wears the bar (ruled visual change to the sealed O-2 screen). The home publishes `chat-risen` on `<body>`; `body.chat-risen .tdw-bottom-nav { display:none }` in globals.css hides it while the chat is risen (R-X22 full-bleed warrant). Mechanism comments both ends (F-06.85). | relay #3 |
| 6 | **`/vendor/storefront` NEW** — hub page, FORK 1 = (a): sections LINK existing routes, paths byte-identical. Labels = the four vetoed words. Descriptions for Portfolio + Discover CARRIED verbatim from More's own retired rows (vetoed bytes, MOVED); Leads + Collab ship description-less — see the veto table. | relay #1/#2 |
| 7 | **`/vendor/studio` → redirect stub** to `/vendor/team-hub` (F-09.18 arm (a)); leaves untouched. Deep links answer, never 404. | S6 queue |
| 8 | **More reworked** — Discover Status + Portfolio rows MOVED to Storefront; Couture + Featured stay; **Notes to Self re-homed (R-X8)** into ACCOUNT with label/desc/glyph carried verbatim from the retired hub; **VictorModeChip pinned top**. | Paper A |
| 9 | **Dead-chrome teaching copy retired under the dissolution warrant** — the 'Three Rooms' tour step (taught pill + swipe) deleted; the Discover tour step re-anchored `mode-pill`→`bottom-nav` (copy bytes untouched); the Tips swipe tip deleted. Deletions of falsehoods, not authored copy — no new vendor-facing byte shipped. | relay #3 |
| 10 | **Demo twin DECLARED-HELD (fork 8.5 = (b), F-09.89)** — zero demo behaviour changed. Mechanical consequence disclosed below: ModePill RELOCATED to `components/demo/ModePill.tsx` byte-preserved, DemoVendorHeader repointed, because the demo imported the pill from the live nav and the held state requires the pill to keep existing. | relay #3 |

**Labelled amendments (count-preserved, rationale in-bench):** canon §3.7 inverted from consumer-zero to carrier-arrived (24/24) · palette ③'s BottomNav cell re-aimed to the retired locked branch + ④'s own CREAM regex (18/18) · p4b_body §8.1–8.9 re-aimed from "the one classifier exists" to "the retired world stays retired" (133/133; inversion-checked — a resurrected leaf file reds §8.1). **Ratify or revert.**

## 2 · PROOF

`scripts/tdw09_p2_doors.proof.mjs` — **86/86** at the delivery tree. Both-ways, each file reverted ALONE at base:

| reverted alone | result |
|---|---|
| BottomNav.tsx | 66/86 (20 red) |
| layout.tsx | 78/86 (8 red) |
| Header.tsx | 85/86 |
| more/page.tsx | 83/86 (3 red) |
| studio/page.tsx | 84/86 (2 red) |
| OnboardingOverlay.tsx | 83/86 (3 red) |
| TipsCarousel.tsx | 85/86 |
| page.tsx (home) | 84/86 (2 red) |
| storefront/page.tsx deleted | 79/86 (7 red) |
| globals.css reverted | 85/86 |

## 3 · CONTROL INVENTORY (CE-115, all three clauses, walked against 9888294440)

**KEPT:** every route (21 proven by §9's per-path table) · Header brand/coin/drawer whole · VictorModeChip · Splash · theme toggle · tour (minus the dead step) · tips (minus the dead tip) · SwipeRow's row-swipe verb + its `data-pager-inert`.
**MOVED:** Discover Status row, Portfolio row (More → Storefront, descriptions travelling) · Notes to Self (studio hub → More, R-X8) · ModePill (live nav → demo lane, held-twin service only) · Discover tour step's anchor (pill → bar).
**REMOVED-BY-RULING (warrant chair relay #3 unless noted):** the panel-swipe VERB · ModePill control (live lane) · the mode itself + `vendor_app_mode` persistence · the 'Three Rooms' tour step · the Tips swipe tip · the studio hub page (F-09.18(a)) · the nav's locked-tab branch (dead in the live lane — neither retired membership ever set `locked`; render count zero, census-witness class).

## 4 · FINDINGS

**F-09.89 (chair-minted, relay #3) — DEMO NAV DIVERGENCE, DECLARED-HELD.** The demo twin (`app/demo/vendor/[handle]/…`) still speaks the two-membership mode nav while the live app speaks five doors — a claimed vendor's demo now promises a structure the product no longer has. HELD by radius law; homed to the demo lane's own rider, founder-sequenced. Cure pre-noted: the twin adopts the five-door bar WHOLESALE (nav + pager + pill + `components/demo/ModePill.tsx` + the `VendorMode` type residue all retire together, named lines). Bench §12 guards the held state.

**F-09.90 (PROPOSED, next free) — MODE VOCABULARY SURVIVING IN TEACHING COPY.** Census: OnboardingOverlay's 'studio' step **label word `Studio`** (body copy is accurate) · TipsCarousel's **section word `Studio`** (renders as a filter pill over Calendar/Clients/Invoices/Expenses/Contracts&TDS tips) · the pre-existing stale **peek-nav tip** ('navigation panel… Studio, Hub, and Discover shortcuts' — PeekNav's own header says it has no nav buttons, and it is caller-zero in the live lane: the wire-or-delete class). These ship UNCHANGED — stale, disclosed, not lies about chrome (the step/section words label content, not the dead pill). Cure = the founder's words below; rider-sized.

## 5 · VETO TABLE (founder words owed; nothing here blocks this push)

| # | Byte | Proposal |
|---|---|---|
| V1 | Storefront 'Leads' row description (ships empty) | optional — his words |
| V2 | Storefront 'Collab' row description (ships empty) | optional — his words |
| V3 | Tour step label `Studio` (F-09.90) | `Business` |
| V4 | Tips section word `Studio` (F-09.90) | `Business` |
| V5 | Peek-nav tip fate (F-09.90) | delete with PeekNav's wire-or-delete ruling |

## 6 · DISCLOSURES (owned by name)

1. **The stripper trap, self-caught:** my layout comment first wrote the auth prefix with a glob — a slash-star inside a line comment that opened a phantom block comment under every comment-stripping instrument; my own bench's §5 convicted it. De-fanged with the lesson in-comment.
2. **Demo pill relocation** was forced by tsc (the demo imported ModePill from the live nav) — two demo files touched under a held ruling, mechanical unbreak only, bytes preserved.
3. **The locked-branch subtraction** (see inventory) rode the rewrite; palette ③ amended rather than resurrecting dead code to keep a cell green.
4. **Census amendment №1:** `scripts/tdw09_vendor_census.json` regenerated at the delivery tree (HEX 168/31 · BRASS 261/38 · 78 files). Suggested commit line carries both attributions: base drift +1/−4/−1 vs f5d4994 = walk-rider/second-shoot files; delivery delta −4 brass / +1 file = this sitting's retirements + the storefront mint.
5. **p4b_body crashed at my first floor run** — it read the deleted leaf. Cured by the labelled §8 amendment (F-09.30's refuse-never-crash class), disclosed rather than quietly patched.

## 7 · FOUNDER SMOKE CARD (the thumb walk — acceptance A④)

On your phone after deploy: **(1)** the bar shows FIVE doors everywhere — Home · Calendar · Business · Storefront · More — and never changes membership; Paper B's five task rows at the after-counts **1 · 2 · 2 · 2 · 2**: *see today's state* = 1 (open app) · *check business leads* = 2 (Business → Leads) · *upload a photo* = 2 (Storefront → Portfolio) · *check TDW enquiries* = 2 (Storefront → Leads) · *reply to Victor* = 2 (Home → type). **(2)** Home wears the bar at rest; tap the input — the chat rises FULL-BLEED and the bar hides; swipe the grabber down — the bar returns. **(3)** Storefront door → four rows, each opens the standing screen. **(4)** `/vendor/studio` typed directly lands on Team Hub. **(5)** More: Advisor chip top, Couture/Featured under Discover, Notes to Self under Account → opens your notes. **(6)** No pill in the header; the tour (fresh profile) teaches without the Three-Rooms step. **(7)** Panel swipe is GONE — a horizontal drag scrolls nothing sideways.
