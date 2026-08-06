# TDW_09 · MICRO-2 · THE THREE SCREENS — EXECUTOR HANDOVER

**Session:** fresh Opus 5, EXECUTOR, under CE-197 (twenty-fourth chair), relays #1–#3.
**Repo:** `dreamos-pwa` ONLY. `dream-os` **ZERO-BYTE**.
**Base:** `d05086b` (fetch-first at read-first, at attestation, and again at build; dream-os context `ee0c60a`).
**Range issued:** F-09.71–.80, CLOSED. **Allocated: .71–.78. Free: .79–.80.**
**Rulings executed:** R-M1 · R-M2 · R-M3 · R-M4 · R-M5 · FORK 5 = (a), founder-ruled.

---

## 1 · THE SPINE — one disease, four surfaces

The kickoff issued three separate cures. Derivation at tip found that **(b) and (c) are
one disease in two costumes**, and the chair's A-1 amendment fixed its membership:

> **A surface whose GROUND is pinned — hardcoded, or an undeclared `var()` falling to
> its literal — while its INK reads tokens that flip with theme. On Editorial Paper the
> ink travels and the ground does not.**

This is F-09.28's theme-coherence question along an axis `tdw09_roles.proof.mjs` was
blind to **by construction**: cell ④ hunts *literals used as ink*, and here the ink was
a correctly-authored *token* while the *ground* was the literal — and a ground literal's
own contrast ratio is ~1.0 against any page, below every threshold ④ tests. The bench
read **37/37 GREEN over three screens the founder could not read.** That is the specimen,
and it is why the new cells live in this file rather than in a bench of their own.

The drawer (F-09.71) is *not* this disease. It is geometry, and it is separate.

---

## 2 · WHAT SHIPPED — SIX LIMBS

### L1 · F-09.71 — the drawer is bounded  *(R-M1 = (a), dvh ruled)*

`components/vendor/Header.tsx` — the calling-card positioner gains
`maxHeight:'calc(100dvh - 88px)'` + `overflowY:'auto'` + `WebkitOverflowScrolling:'touch'`.
`88px` = sticky header (10+34+12) + the panel's own 12px gap + a 20px foot margin.

**Derived, spec-arithmetic, method stated:** at 374×691 the declared contents want
**≈679px** and **≈623px** exist — a ≈56px overflow, and the Sign Out row is 48px. It sat
entirely below the fold. The founder's walk is the conviction; this arithmetic only
explains it.

**One leaf, 23 mount sites.** `Header` is imported by 22 route files plus `SliceShell`.
PROPERTY-OVER-ROSTER: one property on one panel, every mirror follows. No roster ships.

**D-1 · DISCLOSED DEVIATION.** `overflow-y:auto` forces `overflow-x` to `auto` as well,
so a scroll container clips its child's box-shadow on all four sides — and the inner
card's ornate shadow is chrome R-M1 ruled **byte-intact**. Building the ruling literally
would have broken another clause of the same ruling. The positioner therefore carries
`padding:'0 16px 16px'` and pays for it exactly: `right` shifts to `-16` and `minWidth`
grows by the 32px the padding consumes (260 → 292), so the **card still renders 260 wide
with its right edge on the coin's right edge**, unchanged. The uncompensated form is the
revert if the chair prefers literal bytes.

### L2 · F-09.72 — the pin trio's ground becomes known  *(R-M2 = (b), R-M3 = (b))*

`app/vendor/pin-login/page.tsx` · `pin-reset/page.tsx` · `pin/page.tsx` — the vendor trio,
which A-1 promoted from "natural unit" to **the species' entire live membership**.

- panel ground `rgba(12,10,9,0.3)` → **`var(--atelier-sheet-top)`** — one flat, known surface
- `var(--atelier-ink-dim)` → `var(--atelier-ink-mute)`
- `var(--atelier-ink-fade)` → `var(--atelier-ink-mute)`  (×2 / ×3 / ×1)
- `#F8F7F5` → `var(--atelier-ink)`  (headings and PIN digits)
- `GOLD = var(--role-metal)` — unchanged, and now **audited on the same ground** as ruled

**MEASURED over the worst case** — a blown-out white slide region at the declared slide
opacity, under the declared scrim, under the panel. `backdrop-filter` blurs that region
without moving its mean luminance, so the blur buys nothing and is not credited:

| | Espresso | Editorial Paper |
|---|---|---|
| ink | 14.06:1 | 16.87:1 |
| ink-mute | 5.48:1 | 6.72:1 |
| metal | 7.66:1 | 4.66:1 |

Before: `The Dream Wedding` measured **1.13:1** on Paper over a typical slide. Not dim — gone.

**The couple trio does not move.** Per A-1, re-derived here by a second method (reading
their render sites rather than grepping `var(`): their ground *and* their ink are both
literals — theme-blind but internally coherent. They share the slide pattern, not the
disease. Not one byte crossed. They belong to Phase γ.

### L3 · F-09.73 — the splash is a ruled invariant  *(R-M4 = (c))*

`components/vendor/Splash.tsx` — ground `var(--atelier-bg, #171512)` → `'#171512'`;
wordmark `var(--atelier-ink, #EDE6D6)` → `'#EDE6D6'`; skip line pinned likewise. The
invariance decision is **named in-comment per F-06.85**, including the fact that
`--atelier-bg` now exists and this file deliberately does not read it.

Measured on `#171512`: DREAMAI **5.52:1** · wordmark **14.66:1** · skip line **4.95:1**.
Before, on Paper: `#1A0F08` on `#171512` = **1.03:1**. The founder saw nothing because
there was nothing to see.

**Because ink and ground are both pinned, this surface passes acceptance number 4
honestly rather than by exemption.**

### L4 · F-09.74 + F-09.76 — the pre-mount home, completed and corrected  *(R-M5)*

`app/globals.css` (both theme blocks) + `lib/vendor/ThemeContext.tsx`.

**THE MODEL WAS AMBIGUOUS AND IS NOW RULED, in-file.** F-09.28's note in the light block
says a second home *"is the disease this block belongs to"* and **deleted** the light ink
rungs. F-09.35's note at `--atelier-input-border`, in the same file, says the opposite:
*"This block is the PRE-MOUNT home... Both homes move together or the first frame renders
an edge the owner does not hold."* F-09.35 is the later law; R-M5 ratifies it. Deleting a
pre-mount value does not fall back to the owner — it falls back to the inherited initial.

Chair census re-derived at my tip by instrument, and it found **more than was handed**:

| token | dark home | light home | verdict |
|---|---|---|---|
| `--atelier-ink-fade` | ABSENT | ABSENT | added (0.37 / 0.46) |
| `--atelier-ink-dim` | **0.25** vs owner **0.52** | ABSENT | **F-09.76** corrected + added |
| `--atelier-ink-mute` | **0.45** vs owner **0.58** | ABSENT | **F-09.76** corrected + added |
| `--atelier-ink-soft` | agrees | **0.82** vs owner **0.80** | **F-09.76** corrected |
| `--role-*` (six) | ABSENT | ABSENT | added |
| `--atelier-bg` | ABSENT | ABSENT | added (R-M4(c)) |

**F-09.76 is the sharpest of these.** `--atelier-ink-mute` and `--atelier-ink-dim` carried
`.45`/`.25` — the **pre-R-U18** values, 3.87:1 and 2.05:1, both under the body bar R-U18
raised them to clear. The ladder was cured in `theme.ts` and the first frame kept
rendering the failure. F-09.28's cleanup touched only the *light* side.

**Scope widened once, with its reason:** the six roles ship as a **set**, not only the two
the radius reads (`--role-critical`, `--role-metal`). A partial role set in the pre-mount
home is precisely the half-finished adoption F-09.32 names, and cell ① already asserts the
six as a set.

**DISCLOSED BEHAVIOUR CHANGE, outside radius.** `components/vendor/slices/SwipeRow.tsx:117`
writes `var(--atelier-bg, transparent)` and has therefore **always rendered transparent**.
It now renders the page colour — which is what an opaque swipe row is for, and why R-M4
ruled the declaration rather than the deletion of the read. Named here because it is a
live surface this sitting did not walk.

### L5 · F-09.75 — the Request Invite row retires  *(FORK 5 = (a), founder-ruled)*

`Header.tsx` — the `Request Invite · For a client` row and its handler `requestInvite()`
delete **in the same edit**. The row opened `wa.me/917982159047` with an invite prefill —
**the same number the row beneath it opens with `?text=Hi`** — and its noun was the
vocabulary of the invite/waitlist ceremony `dream-os` retired whole.

**Caller-zero re-proven at my own tip before the cut:** `grep -rn requestInvite` across
`app/ components/ lib/ hooks/` returns exactly two hits, both inside `Header.tsx` — the
definition at `:97` and the row at `:213`. Nothing else reaches it.

**Control inventory (CE-115):** the row is accounted **REMOVED-BY-RULING**, warrant
FORK 5(a) + the founder's verbatim, tombstone-commented in-file with path + symbol.
Every other control on the drawer is **KEPT**: Discover Profile · The Dream Wedding ·
Tips & Features · Dark · Light · DreamAi on WhatsApp · Sign Out. **Zero MOVED.**

**D-2's shape, scoped honestly:** no file dies, so no labelled `rm` line joins the apply
block. The shape's substance — deletion explicit, labelled, never smuggled inside a copy —
is carried by the tombstone and this census line. The §7 chain ships verbatim and untouched.

### L6 · The bench — `scripts/tdw09_roles.proof.mjs`, 37 → **118**

Five new cells plus one **labeled re-aim**, all riding the file whose blindness is the
finding.

- **⑥ RE-AIMED (1 → 1, labeled).** It asserted *"no second copy of the ink ladder"*,
  testing two stale light literals. That question was answered by deletion, and the
  deletion is what F-09.72/.73 cost us. What survives is the narrow guard it was actually
  protecting: the two pre-cure values must never return. Cell ⑧ now asks the real question.
- **⑦ THE PINNED-GROUND CELL** — walks each surface in **source order**, tracking the
  nearest `background:` above each travelling-ink `color:`, and asserts no travelling ink
  lands on a pinned ground.
- **⑧ / ⑧b THE PRE-MOUNT LADDER** — every colour token the radius reads must be declared
  in **both** globals homes and must **equal** its `theme.ts` owner; and every token with
  an owner and a globals home must **also** be published post-mount.
- **⑨ THE TRIO, MEASURED** — worst-case-white-slide composite, both themes, every literal
  parsed from the page and from `theme.ts`. No number is copied from a comment.
- **⑩ THE DRAWER** — bounded by the **dynamic** viewport, scrolls, momentum on, inner clip kept.
- **⑪ THE RETIREMENT** — row absent · handler absent · **the surviving WhatsApp row and
  Sign Out both present**. The last two are the guard against over-deletion: a deletion
  cell that only checks absence cannot tell a correct cut from a careless one.

---

## 3 · BOTH-WAYS — every cure reverted ALONE at `d05086b`

| reverted alone | result |
|---|---|
| `app/globals.css` | **RED** 91/9 — ⑧ pre-mount, six tokens |
| `components/vendor/Header.tsx` | **RED** 94/6 — ⑩ all four, ⑪ row + handler |
| `components/vendor/Splash.tsx` | **RED** 101/1 — ⑦ pinned ground |
| `app/vendor/pin-login/page.tsx` | **RED** 100/2 — ⑦ + the sheet-role cell |
| `app/vendor/pin-reset/page.tsx` | **RED** 100/2 — same pair |
| `app/vendor/pin/page.tsx` | **RED** 100/2 — same pair |
| `lib/vendor/ThemeContext.tsx` | **RED** 117/1 — ⑧b, *after the cell below was written* |

**Seven for seven.** Cell counts vary by file because ⑦/⑧ walk what the tree actually
reads — correct for a property, not a roster.

---

## 4 · THE THREE DEFECTS MY OWN BENCH FOUND — disclosed, not patched over

**C-5 · The first ⑦ measured co-occurrence, not the rendering pair.** It flagged a literal
*anywhere* against a travelling token *anywhere*, and convicted the **cured** pin screens —
they still pin `#0C0A09` as the page colour behind the *photograph*, which no text ever
composites against. Corrected to source-order ground tracking. A cell that convicts a
correct cure is measuring the wrong thing.

**C-6 · The first ⑧ demanded pre-mount homes for `--font-*`.** Those are `next/font`
handles — no colour, no theme twin, no business in a theme block. Excluded as a **declared
class with a reason**, in this file's existing `OUT_OF_SCOPE` idiom, never as a silent filter.

**C-7 · The first `ThemeContext` mutation stayed GREEN — a vacuous cell.** Cell ⑧ reads
globals and the radius, never the publisher. Recorded per this file's own M3 precedent
(*"a mutation that fails to redden is evidence about the system, not a hole to paper
over"*) — and then **closed** with cell ⑧b, which reddens on exactly that revert.

**C-8 · A wrong number in my own comment.** I wrote the splash wordmark at 11.06:1 before
measuring it; it is **14.66:1**. Caught by running the arithmetic rather than trusting the
sentence. Corrected in-file.

---

## 5 · F-09.77 · F-09.78 — FILED, NOT CURED

**F-09.77 — `--atelier-card-border` diverges in the light pre-mount home**: globals holds
`rgba(122,56,40,0.20)`, `theme.ts` owns `rgba(122,56,40,0.18)`. Found by the same instrument
as F-09.76. **Not cured: no file in this radius reads it**, and R-M5's scope is tokens this
sitting's surfaces read. Cell ⑧ will convict it the moment a radius file does.

**F-09.78 — `--role-metal` is sub-bar on `--atelier-sheet-bot`.** LIGHT `metal` (`#826A27`)
was derived against `pageBg` (`#F5F2EE`) and measures **4.26:1** against `sheetBot`
(`#EDE8DF`). My first build used the `sheetTop → sheetBot` gradient — the shape Header's
calling card uses — and cell ⑨ caught it: the `MAKER PORTAL` label, the PIN underline and
`Send reset code →` all ride that gold. **Cured here by flattening the panel to one
surface at `sheet-top` (4.66:1)**, which also makes the "known surface" claim stronger.
**The estate still carries it**: any surface placing `--role-metal` text on the sheet
gradient's lower stop is under the bar. Header's calling card was checked and is clean —
it uses `--atelier-label` (`#7A3828`, **7.10:1** on `sheetBot`), not metal.

---

## 6 · THE FLOOR — paired at `d05086b`, byte-stable at the cured tree

`home 67/67 · landing 98 · type 16 · surface 51 · money 18 · palette 18 · theme_retire 16 ·
p3_landing 89 · console 55 · factory 45 · invite_spent 14 · prospects_console 54` —
twelve siblings, exit code 0 on every one, unchanged before and after.
**`roles` moves by design: 37 → 118.** `tsc --noEmit` on a cleared `.next`: **exit 0, zero lines.**

*Disclosed:* my first `tsc` ran with no `node_modules` and returned module-resolution
noise. That result is **void** and was discarded; the run above is after `npm install`.
A check whose failure mode is noise is not a check.

---

## 7 · COPY INVENTORY

**One string leaves the product: `Request Invite` / `For a client`** — deleted under
FORK 5(a), the founder's own ruling. **Zero strings added. Zero strings changed.**
No persona name enters chrome. Money register: expected-zero, confirmed zero.
W-1: trivially clean — no soul, lens, prompt, or engine file in radius.

---

## 8 · FOUNDER SMOKE CARD — the thumb-path derived by command first

**Every path below was derived from the tree, not assumed.** The theme switcher lives
**only** in the avatar drawer (`Header.tsx`, Display section). `Header` is **not** rendered
on the pin screens (`app/vendor/layout.tsx:145` gates on `onLogin`), so the theme must be
set **before** leaving the app. `clearVendorSession()` (`lib/vendor/session.ts:192`) removes
only the session keys — **`dreamai_theme` survives Sign Out**, which is what makes step 4
reach a light-themed pin screen. Landing pushes to `/vendor/pin-login` when `pin_set`
(`app/(landing)/page.tsx:519`, `:549`); pin-login's own guard bounces to `/` without a
session, so OTP is the only door. Splash latches once per session on `sessionStorage`
(`tdw_splash_seen`), so step 6 needs a genuinely fresh launch.

Account: **9888294440**. Handset, portrait.

| # | do this | what to look at | evidence to paste back |
|---|---|---|---|
| 1 | Open the app, tap the profile coin (top right) | The drawer opens | — |
| 2 | **Scroll inside the drawer to its foot** | **Sign Out is reachable and tappable** | screenshot — one word |
| 3 | In the same drawer, count the WhatsApp rows under Actions | **One** row, not two — `Request Invite` is gone, `DreamAi on WhatsApp` stands | screenshot |
| 4 | Drawer → Display → **Light**. Then Sign Out. Sign back in with OTP | You land on the PIN screen **in Editorial Paper** | screenshot — one word |
| 5 | Wait through one full slide rotation (~15s) on the PIN screen | **Every line readable on every slide**, including the bright ones | screenshot on the brightest slide |
| 6 | Enter the PIN. Fully close the app, reopen it | **The splash wordmark is legible** (still in Light) | screenshot — one word |
| 7 | Drawer → Display → **Dark**. Repeat 5 and 6 | Same three surfaces, Espresso | one word |

**Reconciled against the build list:** step 2 → L1 · step 3 → L5 · steps 4–5 → L2 ·
step 6 → L3 · steps 4/6 → L4's first frame · step 7 → both themes on all four.
**No step lacks a derived path.**

**The aesthetic veto is yours (R-M3's rider):** on Editorial Paper the PIN panel now
reads as a **cream sheet** over the photograph, for the first time. That is the ruled
cure working. If you bounce the look, arm (c) — pinning the trio theme-blind — becomes
available **by a later word only**; nothing of (c) is built, shipped, or commented-in.

---

## 9 · OPEN AT DELIVERY

- **F-09.77** — `--atelier-card-border` light divergence, uncured, out of radius.
- **F-09.78** — `--role-metal` on `sheet-bot` is 4.26:1 estate-wide; dodged here, not cured.
- **D-1** — the drawer's padding compensation, ratify or revert.
- **The SwipeRow behaviour change** (L4) — a live surface this sitting did not walk.
- **F-09.79–.80** free.
