# TDW_09/10 · THE WALK HOTFIX MICRO — LE HANDOVER

**Base:** `dreamos-pwa @ 7e39385` (re-fetched at delivery; origin/main unmoved since).
**Repo:** `dreamos-pwa` only. Zero `dream-os` bytes.
**Delivery:** one pwa ZIP, this document riding it.
**Floor:** `tsc 0` · `tdw09_hotfix 38/38` · full floor **40 green · 5 red, all five attributed**.
**Chair:** twenty-fifth. Rulings: hotfix relay #1 (Forks 1, 2 ruled; 3 held) and relay #2 (Fork 1 amended, Fork 3 reversed on the founder's word).

---

## 1 · WHAT SHIPPED

| finding | defect | file(s) |
|---|---|---|
| **F-10.74** | admin sign-out: DOM-absent below 768px · present-but-unfindable on desktop | `app/admin/layout.tsx` |
| **F-09.111** | storefront bio card unmounts while loading, then shoves the page down | `app/vendor/storefront/page.tsx` |
| **F-09.112** | home greeting prints a provisional sentence, then rewrites it | `app/vendor/page.tsx` |
| **F-09.113** | calendar asserts "Nothing on the horizon." before it has asked | `app/vendor/calendar/page.tsx` |
| **F-09.114** | calendar `+` routed to chat — R-B6-18 reversed | `app/vendor/calendar/page.tsx` |
| — | the one cure primitive | `components/vendor/Reserve.tsx` **(new)** |
| — | the sitting's bench | `scripts/tdw09_hotfix.proof.mjs` **(new)** |
| — | §2.3 labelled re-aim | `scripts/tdw07_f0784_panel.proof.mjs` |

**Ranges spent:** F-09.111 · .112 · .113 · .114 · F-10.74. **Unspent and returned to the issue: F-09.115, F-09.116, F-10.75.** Next chair-free re-derives at origin.

---

## 2 · F-10.74 — THE SIGN-OUT, BOTH LIMBS

The founder's verbatims, carried for the band:

> 「 cant see the signout in desktop or phone. the button i have no idea where it is. 」
> 「 just an icon---its for admin panel only. the power button shall do fine. 」

- **Limb 1 (mobile, ADDED 0→1):** power glyph in `#m-bar`, top-right beside Jump, 44px, `aria-label="Sign out"`. Below 768px `#d-nav { display: none !important }` meant the only sign-out was **absent from the DOM**, not hidden behind a tap.
- **Limb 2 (desktop, MOVED 1→1):** the sidebar-foot text button retires; the **same handler byte** hangs on a power glyph in the sidebar **header row**, beside the wordmark. Zero scroll, first glance. It was bench-green the whole time — CE-115's twin law, *benched-the-mechanism-not-the-affordance*.
- **Glyph minted:** `power` in the layout's own `Icon` map. Derived before minting — no power/exit sense existed in that map. One glyph, two seats, one vocabulary.
- **Copy:** **zero rendered words**, per the founder's icon ruling. `aria-label="Sign out"` at both seats is the a11y byte.
- **`#m-bar` structural note:** that bar is `justify-content: space-between` and carried exactly two children; a third would have floated Jump into the middle. The two right-hand controls now group in a flex wrapper. Named because it is a layout change nobody asked for and a reader will wonder.

**Bench:** `tdw07_f0784_panel` §2.3 re-aimed by labelled amendment, **count preserved 34/34**. The old assertion was a bare `/clearAdminSession\(\)/` over the whole file — which the layout's *auth gate* satisfies on its own, so it would have stayed green with every sign-out control deleted. That vacuity is closed: the cell now demands the handler hang on a control carrying the accessible name, and it is **RED at the uncured tree (33/34)**.

---

## 3 · THE FLASH CLASS — ONE PRIMITIVE, THREE MECHANISMS

`components/vendor/Reserve.tsx`. Rides globals.css's **existing** `shimmer` keyframe (`:596`); grounds on `var(--atelier-card-border)`, a published theme-aware token. **Zero raw hex** — Phase C's sweep finds nothing here. **No spinner.**

**Disclosed, not silently forked:** globals.css `:602` already defines `.skeleton` / `.skeleton-text`. Those ground on `--bg-tertiary` (`#F3F4F6` / `#1F2937`) — the pre-atelier palette — and would paint a cold grey block on a warm espresso screen. They have **zero consumers today**. Left alone rather than repointed: repointing a shared class is a sweep, and this is a hotfix.

**GHOST mode is the load-bearing idea.** `<Reserve ghost><Meter score={0}/></Reserve>` renders the real component with `visibility:hidden` + `aria-hidden`, so the browser lays out its **exact** box and nothing is painted or announced. No executor guessed a pixel height off a viewBox, and no cell had to re-derive that guess by the same method that produced it — the independent-method law avoided by construction rather than satisfied by a second opinion.

| screen | mechanism |
|---|---|
| **F-09.111** storefront | `if (loading) return null` — the card unmounted entirely. **Second jump underneath:** the score's inputs (`fetchDiscoverStatus`, `fetchPortfolio`) settle independently of `useSettings`, and the meter's arc carries a 420ms stroke transition — gating on `loading` alone would have shown a wrong number sweeping to a right one. `metricsReady` holds the skeleton until the score's own inputs land. **A failed fetch resolves it too** (`.finally` on both legs) — a dead network cannot hang the card in skeleton. |
| **F-09.112** home greeting | not a blank — a **provisional sentence** (`Welcome back.`) that then rewrote itself. Worse than blank: it reads as the answer. |
| **F-09.113** calendar | `useLoader` has always returned `loading`; this call site **destructured it away**, so "not asked yet" and "nothing to show" became one state and the screen printed an assertion it could not support. The **claimed-truth class** (F-07.37 family) wearing a flash's clothes. Cured to SliceShell's own gate shape, by name. The byte 「 Nothing on the horizon. 」 is **gated, never rewritten**. |

### RESIDUALS, DECLARED (§8) — read these before claiming zero-jump

1. **F-09.112:** the loaded line is one or two line-boxes depending on her real figures. A skeleton cannot reserve exactly what it is waiting for. It reserves **two** 28px boxes (the taller outcome; the founder's own account renders the two-clause sentence). **A one-line outcome collapses upward by one box, once.** Padding the *loaded* state to two lines always was refused — the ruling requires zero visual change once loaded.
2. **F-09.113:** the loaded rail is 0–3 rows; the skeleton reserves **one** — the minimum honest reservation. A busy month still grows by up to two rows on settle. Same refusal, same reason.
3. **F-09.111 has no residual** — GHOST reservation makes it exact.

---

## 4 · F-09.114 — THE FAB REVERSAL

R-B6-18 (`dream-os docs/FINDINGS_LOG.md`, TDW_04 B6-S1) ruled the FAB keeps the chat primer — **when the day popup still existed**. The popup has since retired into the day sheet, whose `+ Booking` is the mechanical date-anchored add; nobody re-read the ruling when its premise left, and the FAB became the last surface sending a vendor to a chat window to do a form's job.

**Founder's reversal, verbatim:** 「 + will open the add-event sheet (date left blank for you to pick) 」

`onAdd()` → `AddSheet slice="events"`, create mode, **no seeded date**. A `+` pressed while the grid shows November must not quietly prefill August (S5 rule 8; the seeded arm was proposed and rejected at read-first, not overlooked). The reversal and its warrant are re-authored **at the handler**, where the old ruling lived — a future reader finds it in the file, not in a chat log.

`CalendarBlockSheet.tsx` **diffs zero**, under its double wall (R-B6-18's record and Phase C's roster). It is the full-day block/unblock flow, not the add sheet — the kickoff named the wrong target and it was corrected on evidence at read-first.

---

## 5 · PROOF

**Both-ways, by mutation of production code** (the four production files reverted to `7e39385`, the bench left cured):

| run | `tdw09_hotfix` | `tdw07_f0784_panel` |
|---|---|---|
| **UNCURED** | **9 passed, 29 failed** | **33 passed, 1 failed** |
| **CURED** | **38 passed, 0 failed** | **34 passed, 0 failed** |

The 9 that survive uncured are the **guard cells** — they assert what the cure must *not* have moved (the handler byte, the auth gate, the vetoed loaded-card copy, the ruled sentence construction, the gated empty byte, the block flow's doors, the events slice). One near-miss caught and fixed in-band: cell 2.3 (`NO SPINNER`) read an absent `Reserve.tsx` as a passing empty string and went **green at the uncured tree** — a vacuous green, closed with a non-emptiness clause. Disclosed by number rather than quietly patched.

**Floor, byte-stable at the delivered tree:**
`tdw07_f0784_panel` 34/34 (re-aimed, count preserved) · `tdw10_p1_shell` 53/53 · `tdw08_console` 55/55 · `tdw08_p5_prospects_console` 54/54 · `tdw09_p2_doors` 86/86 · `tdw09_p2b` 29/29 · `tdw09_home` 67/67 · `tdw09_palette` 18/18 · `tdw09_p2r1` 13/13 · `tsc 0`.

**The five reds reproduced UNMOVED, all attributed:**
`tdw10_p2_retint` **75/76** → F-10.73's rider, the **billing** session's (relay #1 §0) · `tdw10_p3_deck` **191/193** → F-10.62 · `tdw_f0774_stripper` **33/35** → F-10.49 · `tdw07_p2_profile` **43/48** → **F-09.93** · `tdw07_p3_portfolio` crash → **F-09.94**. The last two are **Phase C's to cure**; if C lands before this, they turn green and the attribution is what carries.

---

## 6 · COLLISION, RE-PROVEN AT DELIVERY TIPS

`git fetch` at delivery: pwa origin/main `7e39385` (**unmoved** since my base) · dream-os `01f3bbc`.

My seven files: `app/admin/layout.tsx` · `app/vendor/{storefront,calendar}/page.tsx` · `app/vendor/page.tsx` · `components/vendor/Reserve.tsx` · `scripts/tdw09_hotfix.proof.mjs` · `scripts/tdw07_f0784_panel.proof.mjs`.

- **Billing rider:** owns `app/admin/_components/Bridge.tsx` + `lib/admin-api/bridge.ts`. **Byte-untouched by name. Zero overlap** — my admin file is `layout.tsx`.
- **Phase C:** owns `VictorModeChip.tsx` · **`CalendarBlockSheet.tsx`** · `collab/page.tsx` · `ChatThread.tsx` + a hex sweep. **Zero file overlap.** The sweep's real surface on my three vendor files was measured, not assumed: **0 · 0 · 1** hex-carrying lines, and I touched none of them. `Reserve.tsx` ships hex-free by construction (cell 2.4).

---

## 7 · FOUNDER'S WALK — four glances, no discovery

Founder performs and pastes; the executor reads the evidence.

1. Open `/admin` **on the phone**. Top bar, right of "Jump": a **power icon**. Tap it → you land on `/admin/login`. Press back → you do **not** get back in. *(Evidence: the login screen, and no admin surface behind it.)*
2. Open `/admin` **on the laptop**. Top-right of the sidebar, level with "The Dream Wedding": the **same power icon**, no scrolling. Tap → `/admin/login`.
3. Open `/vendor/storefront` **cold** (hard refresh). The bio card's space is **there from the first paint** — a faint pulsing block, then the meter. **Nothing below it moves.** *(This is the one with no residual — if anything jumps here, say so.)*
4. Open `/vendor` **cold**. "Good Morning" is correct instantly; the sentence under it arrives as pulsing bars and then **appears once, already final**. It should never change its words while you read.
5. Open `/vendor/calendar` **cold**. Under "Next Engagements" you should see a pulsing row — **never** "Nothing on the horizon." unless it is true. Then tap the brass **`+`**: the **add-event sheet** opens, **date blank**.

**Only your device can witness these:** the pulse itself, the absence of a jump, and whether the two declared residuals (§3) are visible or negligible in practice. No bench can see them.

---

## 8 · WHAT THE NEXT SITTING PICKS UP

- **F-09.115 · F-09.116 · F-10.75 are UNSPENT** — returned to the issue, not consumed.
- **The two declared residuals (§3)** are candidates for a later sitting if the founder's walk finds them visible; they are bounded and one-directional, and both alternatives were refused on the ruling's own terms.
- **`.skeleton` in globals.css `:602`** grounds on the retired palette with zero consumers. Not this sitting's; filed here so it is not rediscovered.
- **Phase C** cures F-09.93/.94; **the billing session** cures retint's 76th cell at CE-204.

*Sequencing beyond this sitting is the founder's.*
