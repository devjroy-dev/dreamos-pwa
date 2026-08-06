# TDW_09 · VENDOR REHAUL R-1 — THE IG-CONNECT CURE + THE MOVEMENT PLAN · EXECUTOR HANDOVER

**Session:** LE under the twenty-fourth chair, relays #1–#2. **Repo:** `dreamos-pwa` ONLY — **dream-os ZERO-BYTE** (P3 was live on it; its mid-sitting push `03dd194 → c738d7c` touched `docs/` + `src/lib/templates.js` + its own bench — disjoint from this delivery by inspection at the actual tips).
**Base:** `dreamos-pwa 54a090e`, re-fetched immediately before delivery per the rebase clause (origin unmoved on the pwa side; dream-os context re-based to `c738d7c` and restated).
**Range issued:** F-09.82–.99. **Allocated: none — zero findings minted.** The one defect found this sitting (the §5.2 vacuity) was the executor's own, in its own bench, cured at birth and carried as disclosure D-2, not a number.
**Rulings executed:** F-1 = (a) · F-2 = (a) · F-3 = labelled re-aims, CE-199 precedent · F-4 = wording B, founder 「 ok 」 at relay #2 · the anchor-only rider, chair-ratified as law for this cure.

---

## 1 · WHAT SHIPPED — ONE FILE, TWO BENCHES

### `app/vendor/portfolio/page.tsx`

- **H19 executes its veto.** The P4b draft (`On iPhone: press and hold the button above…`, marked `DRAFT — veto owed`) becomes the founder-vetoed byte, wording B: `Press and hold Connect Instagram, then choose "Open in New Tab". A normal tap gets caught by the Instagram app.` — marker `// VETOED 2026-08-06 (wording B, relay #2)`. The `On iPhone:` prefix left with the draft because only iPhone-standalone readers can now see the line. The H3 ordering doctrine (gesture first, explanation second) is preserved and cell-asserted.
- **`IOS_FALLBACK_ARMED` retires (F-2(a))** with a succession comment recording the P4b archaeology: the constant was built dark, gated on the ladder's answer AND the founder's veto of H19 — both arrived in the R-1 kickoff, so the switch retires into the thing it stood in for.
- **`isIosStandalone()` is the gate (F-1(a))** — `navigator.standalone === true`, the iOS-Safari-only standalone signal, one property, no UA sniffing, SSR-guarded. The mechanism comment (F-06.85) names the policy so no future session simplifies it away: *the standalone PWA cannot receive the IG app's permission grant; a plain tap on the connect anchor is claimed by the Universal Link; long-press → Open in New Tab is the founder's device-witnessed escape (2026-07-30 walk, his own account connected through it).*
- **The render site** is the conjunction `{isIosStandalone() && igAuthUrl && (…H19…)}` — **the anchor-only rider, ratified as law**: when the mint has not landed the control degrades to a `<button>`, which has no long-press → Open-in-New-Tab affordance, and an instruction for a gesture the control cannot perform would be its own small lie.
- **No hydration hazard, derived not hoped:** the block sits inside `{ig && ig.ig_import_enabled && …}`, and `ig` is set only by a client effect — the subtree is absent at hydration on every platform, so the server/client detection difference never renders a mismatch.
- The stale `IT IS NOT RENDERED` narration above H19 amended in the same edit (the F-09.81 falsified-comment class, not left to a future mint).

### `scripts/tdw07_p4b_probe.proof.mjs` — labelled re-aims + growth, 33 → **35**

§1.4–§1.6 re-aimed (3→3, labelled): the dark-constant cells follow their subject to the runtime gate — detection method stated in-cell as ruled. §5 re-aimed + grown (3→5, labelled): §5.1 the executed veto · §5.3 = **acceptance ①** (the only `COPY.H19` render site sits behind the conjunction) · §5.4 = **acceptance ①**'s absent-elsewhere half (false wherever `navigator.standalone !== true`, SSR guard asserted) · §5.5 = **acceptance ②** (anchor-only: `igAuthUrl` null is exactly the button branch). §5.2's doctrine cell kept, with its `-1` vacuity closed (D-2 below). Warrant on every label: the founder's R-1 kickoff verbatim; CE-199's follow-the-subject precedent cited in-bench.

### `scripts/tdw07_p4b_slice1.proof.mjs` — comment-only amendment, 30/30 unchanged

Its §4.5 amendment note narrated H19 as a live marked draft — now false. Amended in place, labelled, scope and count untouched.

---

## 2 · PROOF — BOTH-WAYS AND THE FLOOR

**The correct both-ways shape, run and stated:** the AMENDED bench against the UNCURED page (`git checkout origin/main -- app/vendor/portfolio/page.tsx`, benches kept) — **28/35, all seven cure/re-aim cells RED and only those** (§1.4 · §1.5 · §1.6 · §5.1 · §5.3 · §5.4 · §5.5). Restored cured page: **35/35 GREEN**. A first, wrong both-ways attempt stashed the benches along with the cure and proved nothing (D-1).

**`npx tsc --noEmit` on a cleared `.next`: exit 0, zero errors.** `next build` remains the standing declared container gap (Google-Fonts egress; Vercel unaffected).

**The pwa floor at the cured tree — every count from the bench's own summary line, exit 0 on all:**
`home 67/67` · `landing 98/98` · `type 16/16` · `surface 51/51` · `roles 130/130` · `money 18/18` · `palette 18/18` · `theme_retire 16/16` · `p3_landing 89/89` · `console 55/55` · `factory 45/45` · `invite_spent 14/14` · `prospects_console 54/54` — the thirteen 09-era, byte-stable. Plus `tdw10_p1_shell 53/53` · `tdw10_p2_bridge 44/44` · `tdw10_p2_retint 76/76` (P3's labelled growth, derived at tip) · **`tdw10_p3_deck 130/130` — P3's bench at the true tip, grown past its handover's 104 by P3's own hotfixes; derived, not assumed.** Amended benches: `p4b_probe 35/35` · `p4b_slice1 30/30`; adjacent IG family re-run: `p4a_ig 69/69` · `p3_portfolio 117/117`.

**dream-os at `c738d7c` (zero bytes shipped, floor witnessed):** `tdw09_micro 23/23` · the four known-reds reproducing EXACTLY as attributed — `b06_meter 28/29` (F-06.41) · `b05_f0555 22/23` (F-07.11) · `b07_f0772 158/159` (§12.14) · `b07_p4b_body 75/76` (§5.26). `selftest` not re-derived (keyless container by design, the standing declaration).

---

## 3 · COPY INVENTORY

**One string changes, founder-vetoed:** H19 draft → wording B (relay #2, 「 ok 」; the chair's standing offer to the founder: one word before push swaps to wording A at no cost). **Zero strings added beyond it, zero removed.** No persona name in chrome. Money register: expected-zero, confirmed zero. W-1: no soul, lens, prompt, or engine file in radius. Control inventory: zero interactive controls added, moved, or removed — the instruction is a `<p>`, and the connect anchor/button pair is byte-untouched.

---

## 4 · FOUNDER SMOKE CARD — fixture state derived first

**The fixture problem, named:** the instruction renders only on the not-connected (or expired) branch, and the founder's own IG **is connected** (the P4b walk completed). The disconnect control (H13) exists on the connected branch and is the lawful fixture act — and reconnecting via long-press is itself the cure working end-to-end.

On the **iPhone, installed PWA (home-screen icon, not Safari)**, vendor account with IG import enabled:

| # | do this | look at | paste back |
|---|---|---|---|
| 1 | Open the installed PWA → Portfolio → the Instagram section | If connected: tap `Disconnect Instagram` (photos stay, the copy says so) | one word |
| 2 | The connect section renders | **The long-press line renders under `Connect Instagram`**, wording B verbatim | screenshot |
| 3 | Same page in **Safari** (not the installed app) | **The line is ABSENT** — Safari is not standalone | screenshot |
| 4 | Back in the PWA: press and hold `Connect Instagram` → `Open in New Tab` → complete consent | Connection completes; on return/reload the section shows `Connected as @…` | one word |
| 5 | (Only if the mint ever fails and the control shows as a plain button) | **The line is ABSENT beside the button** — the anchor-only rider | one word, only if seen |

Steps 2/3 are acceptance ① witnessed live; step 5 is ② (bench-proven; live witness opportunistic). Step 4 re-establishes the founder's connected state — nothing is left disconnected.

---

## 5 · DISCLOSURES

**D-1 — the wrong both-ways.** My first uncured run `git stash`ed the benches together with the cure and reran the OLD bench against the OLD tree: 33/33, proving nothing. Caught by reading my own output; re-run in the correct shape (new bench, old page). A green produced by testing nothing is the vacuous-green class at the process level.

**D-2 — the `-1` vacuity, self-caught.** The inherited §5.2 doctrine cell asserted gesture-index < explanation-index; `indexOf` returning `-1` for an absent gesture still satisfies `<`. My re-aim initially inherited the hole; the both-ways run's green pattern exposed it; cured in-cell (`g >= 0 && e >= 0 && g < e`), labelled.

**D-3 — the read-first's clipped floor.** My first floor sweep captured empty summary lines for most benches (a `tail -1` over decorative rules) and I stated the gap rather than the numbers. The full floor above is capture-corrected and complete.

**Carried from the read-first, already chair-credited:** the kickoff's "P3's deck renders VendorProfileView" corrected at tip — the deck links, does not mount (`approvals/discover/page.tsx:314`, Fork 6(a)); the hold on the file stands regardless.

---

## 6 · THE MOVEMENT PLAN — RATIFIED AT RELAY #1 · THE REHAUL'S CHARTER SPINE

Every verdict derived by command at `54a090e` / dream-os `03dd194` (re-checked unmoved-in-radius at `c738d7c`). **Each Package sitting kicks off against this table and re-verifies at its own tip.**

### 6.1 · The S-doc verdicts

| S-doc | Verdict | Evidence at tip |
|---|---|---|
| S1_LANDING_AND_FIRST_OPEN | **SHIPPED** | O-1 sealed (CE-195, two doors); O-B ruled + built (CE-197) |
| S2_SIGNUP_FLOW_FORK | **SHIPPED** | arm (a); ceremony's 57 sites dead; `src/api/waitlist.js` ABSENT |
| S3_HOME_CONTENT_SPEC | **SHIPPED** | O-2 = the three zones, `home 67/67` |
| S3_INTERACTION_FORK | **SHIPPED** | Model 1 (R-X22) = O-2's rising room |
| S1_TOKEN_CANON | **DEAD-AT-TIP (layer 2)** | `lib/design/` and `app/tokens.css` DO NOT EXIST; values partially rescued by R-U18/T-1 but the canon homes never ran |
| S1_SPOTLIGHT_CONSOLIDATION | **DEAD-AT-TIP (never ran)** | `discoverHeroes.js` alive, mounts at `router.js:55/:63`, both screens present, `adminNav.ts` still marks RETIRES-AT |
| S5_NAV_REMAP | **STANDING** | ModePill live (`Header.tsx:130`); five-doors unbuilt both lanes |
| S4_THEME_STRATEGY | **STANDING (bride half)** | vendor half + flair retirement EXECUTED (R-U16/R-U19 swept); Warm Porcelain + sanctuary's 31 ternaries unbuilt |
| S2_HEURISTIC_STATES_TOUCH | **STANDING** | coplanner `catch {}` live (`threads:70`, `muse:39`); pressed/44px primitives not canon-homed; F-09.24 cured-by-consolidation (`cabinet.ts` `fmtINR` wraps `formatRs`) |
| S2_IA_MAP | **STANDING (as instrument)** | F-09.17 cured at O-1 · F-09.18 partial (Notes door live, studio hub stands) · F-09.19 UNCURED (`/about`+`/privacy` still linkless) |
| S1_POLISH_CENSUS | **STANDING** | F-09.9's two backend strings LIVE (`requirePrestige.js:15`, `couture.js:26`) · F-09.10 pin owed · F-09.11 date voice unbuilt · Maker/Dreamer unopened |
| S1_CENSUS_AND_AUDIT | **STANDING (as instrument)** | F-09.4/.5 substantially cured downstream (R-U18, T-1); F-09.3's admin half superseded by Block 10's retint arc |
| S3_MUSE_MODES_BASELINE | **STANDING** | Muse arm (a) unbuilt (bride) · mode-controls paper resolves by subtraction at the nav remap · Row primitive not canon-homed (R-X24 acceptance numbers stand) |
| S5_FLOW_AND_GRAMMAR | **STANDING (partially met via O-2)** | lead-reply is 1-tap; grammar rules await the canon's audit gates |
| S6_DISCOVER_DOOR_CENSUS | **STANDING** | bride phase unopened |
| S6_CURE_QUEUE | **STANDING (the debt register)** | folds below |

### 6.2 · The phasing, as ratified

- **PACKAGE 1 — canon primitives + token homes** (`lib/design/tokens.ts`+`money.ts`+`date.ts`, `app/tokens.css`, pressed-state, 44px touch boxes, the Row primitive). S–M. **Zero P3 collision.** Folds S6 Tier-1 №1. Everything downstream reads it. **Charters on this sitting's seal.**
- **PACKAGE 2 — the five-doors nav remap**, vendor lane only (R-X27 arm (a)); ModePill retires by subtraction; folds Tier-1 №2/№3/№4/№5 as riders. Radius `components/vendor/**` + `app/vendor/**` — disjoint from P3's `app/admin/**` + `lib/admin-api` + `src/api/admin/**`. **`components/shared/VendorProfileView.tsx` byte-untouched until P3 seals** (mounting it is P3's own named next rider).
- **PACKAGE 3 — the spotlight consolidation** (S1 paper's five limbs). **GATED on the founder's §5 provenance SELECT** — the spotlight rows sit on his shelf and the gate is his.
- **PACKAGE 4 — the bride phase**, whole (S4 bride half · five doors · Discover door census · Muse arm (a) · system-follow), recorded here as landing in the bride charter per the founder's sequencing 「 charter admin thereafter charter bride and then we do the left overs 」.

### 6.3 · Standing collision discipline

P3 is live and pushing. Every Package delivery: re-fetch both repos immediately before the ZIP, restate the context line, re-prove disjointness at the actual tips; the later ZIP rebases, never assumes. The two F-09.9 backend strings and F-09.81's DORMANT comment are dream-os debts that ride whichever Package first lawfully opens their files (F-09.81 → the `vendor-engine/` covenant sitting, per CE-197).

---

## 7 · OPEN AT DELIVERY

- **Acceptance ① and ②'s live witness** — the smoke card (§4); bench cells cover the wiring meanwhile.
- **F-09.77 / .78 / .79** — inherited open-watches, untouched, cells armed as attributed.
- **F-09.81** — named, not cured; zero `vendor-engine/` files opened, per charter.
- **F-09.82–.99** — the range returns to the chair UNSPENT.
- The founder's standing one-word option on wording A vs B, per relay #2.

Sequencing beyond this sitting is the founder's.
