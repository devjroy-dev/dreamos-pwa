# TDW_10 · THE BILLING TAB — BILLING LEAVES SETTINGS (dreamos-pwa)

**Base:** `1959023` · re-derived at cut, **unmoved** — the founder's nine approved
bytes are anchored to this tree and render on it (APPROVED-COPY-CARRIES-ITS-HASH,
discharged). · **tsc `--noEmit`: 0 errors**, with the strict:false caveat honoured
below. · **Radius:** 5 production files + 3 bench files + this doc. `chat.js`
untouched; zero dream-os bytes.

---

## 0 · READ THIS FIRST — FOUR EXECUTOR DISCLOSURES

**D-1 · I TOOK A RADIUS EXTENSION. Two floor benches, ratify or reverse it.**
The ruled radius named five production files. Cutting them reddened two benches
the charter said would hold: `tdw09_uivendor` 76 → 69 and `tdw10_tier` 98 → 82,
**23 red cells**. Every one was a **subject-address** red — the properties they
assert are byte-identical, they simply moved file. I performed **labelled
re-aims** in this ZIP under the CE-205 / CE-206 precedent (the property follows
the control to its new home) rather than shipping a red floor or stopping. Both
now read **76/76** and **98/98**. Three bench files entered my radius without a
ruling; that is the chair's to bless or reverse, and it is stated first because
it is the largest thing I did that was not ruled.

**D-2 · MY BENCH WAS AUTHORED AT 31 CELLS. RATIFIED WAS 22. I CUT IT TO 22.**
The §-shape drifted upward during authoring (the copy set is nine bytes, not six;
the chair's 「 prove that with a cell 」 added a guard after ratification). A
ratified number is a contract, so the bench ships at **exactly 22**, matching the
read-first's own §-breakdown. **RIDER-A**, nine cells authored and cut, is listed
in §7 and can be added on one word.

**D-3 · CELL 5.2 SHIPPED VACUOUS IN ITS FIRST DRAFT, AND THE RED RUN CAUGHT IT.**
It declared its own copy of the F-10.91 filter and asserted that copy's behaviour
— so it was **GREEN at the uncured tree** and could never have reddened for any
change to the product. Rewritten to **lift the production expression out of the
component source and run it**. A cell that does not read the tree is not a cell.

**D-4 · MY FIRST MATCHERS WERE WRONG AND SIX CELLS READ RED AGAINST CORRECT CODE.**
`<DItem[^>]*label="…"[^>]*/>` cannot span a JSX attribute list: an arrow handler
contains `=>`, and `[^>]` stops at its `>`. Every element matcher in the new bench
is line-based for that reason, and the reason is recorded in the bench's own head
so the next author does not pay for it twice.

---

## 1 · WHAT SHIPPED

| File | What |
|---|---|
| `components/vendor/SubscriptionCard.tsx` | **NEW.** The whole billing surface — card, `TierPicker`, `CancelBlock`, and the four founder-vetoed string sets — moved here WHOLE. Rendered output byte-unchanged. |
| `app/vendor/billing/page.tsx` | **NEW.** `/vendor/billing`. Settings' shell exactly: same Header, back chevron, eyebrow register, scroll container, safe-area padding. Mounts `<Toast>`. |
| `components/vendor/Header.tsx` | The Billing DItem, seated in Atelier directly after Settings. Settings' subtitle amended. |
| `app/vendor/more/page.tsx` | The donor row's description amended; More gains its Billing row. |
| `app/vendor/settings/page.tsx` | The card removed; the permanent signpost seated **inside the surviving `<div id="tier">`**. |
| `scripts/tdw10_billing_tab.proof.mjs` | **NEW**, 22 cells. |
| `scripts/tdw09_uivendor.proof.mjs` · `scripts/tdw10_tier.proof.mjs` | Labelled re-aims — see D-1 and §5. |

**THE NINE APPROVED BYTES, ALL NINE SHIPPED VERBATIM.** Header subtitle
`Profile and preferences` · More description `profile and preferences` · label
`Billing` · subtitle `Plan and payment` · eyebrow `Billing` · signpost
`Moved to Billing. ›` (an `<SCard title="Subscription">`, a `<button>` not an
anchor, `F.script` italic 300/16/1.5, `A.brassWarm`, `padding: '4px 0'` — the
Discover Profile shape, comment carrying the same sentence) · the More row
verbatim · card title `Subscription` KEPT · glyph `◇`. Nothing reconstructed.

---

## 2 · CE-115 CONTROL INVENTORY — ALL THREE CLAUSES

**Clause 1 — every interactive control on the moved card.**

| Control | Disposition |
|---|---|
| `subscription_link` anchor — "Set up monthly payment" | **MOVED** → SubscriptionCard |
| TierPicker per-tier select buttons (×3, filtered) | **MOVED** |
| TierPicker confirm button ("Choose") | **MOVED** |
| CancelBlock trigger ("Cancel my plan") | **MOVED** |
| CancelBlock confirm ("Cancel my plan") | **MOVED** |
| CancelBlock keep ("Keep my plan") | **MOVED** |
| Settings' own Sign Out button, back chevron, eight other cards | **KEPT**, untouched |
| — | **ZERO removed by ruling.** Nothing on this card was retired. |

**Clause 2 — capabilities a layer above the component.** `subscribeToTier` ·
`upgradeToTier` · `cancelSubscription` (all three POST to already-live endpoints)
· `window.location.href = subscription_link` (the link-is-the-close navigation) ·
`window.location.reload()` on done · **`show()` → `<Toast>`**, the five failure
sentences' only path to the vendor. Cell 2.3 exists solely because a Billing page
without the Toast mount renders a Cancel button that, on failure, does nothing and
says nothing. Asserted, never trusted.

**Clause 3 — the walk against the real account.** Yours, not a fixture:
**9888294440, `basic` / `cancelled`** → `isUpgrade` false → nothing filtered →
**all three tiers offered**, plus the F-10.77 flip-reason line. That is F-10.91's
own case and it is smoke step ③.

---

## 3 · WHAT THE PAUSED RAZORPAY v2 SESSION MUST BE TOLD

Their file changed. Precisely:

- `TierPicker` — **moved whole**, `app/vendor/settings/page.tsx` → `components/vendor/SubscriptionCard.tsx`. Body byte-identical.
- `CancelBlock` — **moved whole**, same journey, body byte-identical.
- `PLAN_LABEL`, `PLAN_PRICE`, `BILLING_STATUS`, `V2` — **moved whole**, byte-identical.
- `subscribeToTier`, `upgradeToTier`, `cancelSubscription` — import moved with them; the settings page no longer imports or calls any of the three.
- The card body (`<SCard title="Subscription">` and everything inside) — moved; what remains at `<div id="tier">` in settings is the signpost only.

**This makes their life easier, not harder, and that was the ruling's point:**
`settings/page.tsx` is no longer a shared surface. F-09.128 — the UI ZIP cut at
`503b254`, applied onto `9f73a8b`, wiping F-10.92's kill switch in eleven minutes
— cannot recur on this file, because their work and the settings page no longer
share one.

---

## 4 · THE WIRE ADDRESS — AND WHAT THE CAP SITTING OWES

**Route name, the downstream dependency: `/vendor/billing`. No fragment — the
page IS the picker.** `src/api/vendor-engine/chat.js` re-points its
`upgrade.href` there.

**THE ANCHOR SURVIVES AND IS LOAD-BEARING UNTIL TWO EVENTS, NOT ONE.**
`components/vendor/TierMeter.tsx` renders `meta.upgrade.href` as a bare `<a>` —
the PWA hardcodes nothing, the address arrives **on the wire from Railway**. So
`/vendor/settings#tier` must keep resolving until **(1)** the cap ZIP ships AND
**(2)** Railway redeploys dream-os. A ZIP landing in the repo is not the gate; a
deploy is. The retirement condition is written at the anchor itself
(mechanism-comment law, F-06.85) and cell 6.2 asserts it names both events, so
the sitting that moves the href is forced to read it.

**F-10.101 — REFINED, AND THE REFINEMENT IS A CORRECTION TO MY OWN READ-FIRST.**
I wrote that the anchor "most likely lands at the top." That was too flat. The
precise claim: the browser retries fragment resolution **until the load event
fires**, and `id="tier"` mounts when the `/me` fetch resolves inside an effect
after hydration. **It is a race.** Fetch resolves before `load` → it scrolls;
after → it does not, and never retries. On a warm cache it may well scroll; on a
cold mobile load the fetch usually loses. Either way the outcome is
*non-deterministic*, which is its own defect for a revenue link.

**I tried to witness it and could not — stated plainly.** I installed a browser in
the container; Ubuntu 24.04 ships Chromium as a snap stub with no snapd available,
and Puppeteer/Playwright fetch their browser binaries from domains outside this
container's allowlist. **So F-10.101 stays DERIVED-UNWITNESSED and smoke step ⑤ is
still its only witness.** I will not upgrade a derivation by asserting it harder.

**The signpost is honest under either outcome** — it is visible wherever the page
lands, which is the property the old buried card never had.

`tdw10_tier`'s own cell says the Upgrade button 「 finally lands 」. That sentence
is under suspicion from F-10.101 and I left it **byte-untouched** pending your
walk. An executor does not quietly rewrite an elder's claim on a derivation.

---

## 5 · ACCEPTANCE

**`tdw10_billing_tab` — 22/22 GREEN cured · 0/22 at the uncured tree.**
Door 4 · route 3 · control inventory 6 · gates 3 · F-10.91 2 · `#tier` 2 · copy
and pure-move 2.

**MUTATION LEDGER — 22 mutations, 22/22 BITE, every file restored byte-identical
(sha256-verified). Every cell has at least one biting mutation**, which matters
here because two of the subject files simply do not exist at the uncured tree and
"file absent" is a trivial red.

| # | Mutation (production code, never test setup) | Reddens |
|---|---|---|
| M1 | the Billing DItem deleted whole | 1.1 1.2 1.3 1.4 |
| M2 | the Billing row moved below the Display label | 1.3 |
| M3 | `<Toast>` mount removed from the Billing page | 2.3 |
| M4 | CancelBlock loses "Keep my plan" | 3.5 |
| M5 | `cancelSubscription` no longer called | 3.6 |
| M6 | F-10.92 dropped from the picker gate (**the F-09.128 wipe, replayed**) | 4.1 |
| M7 | filter reverted to the pre-F-10.91 expression | 5.1 5.2 |
| M8 | `id="tier"` removed | 6.1 |
| M9 | Settings subtitle claims billing again | 7.1 |
| M10 | a SECOND caller renders the card | 7.2 |
| M11 | a price retyped as `Rs 3L` (money register) | 7.2 |
| M12 | the anchor loses its retirement condition | 6.2 |
| M13 | the More donor row keeps the stale noun | 7.1 |
| M14 | the Billing page stops rendering the card | 2.1 7.2 |
| M15 | the Billing page drops its session guard | 2.2 |
| M16 | the `subscription_link` anchor deleted | 3.1 |
| M17 | picker tier buttons lose their handler | 3.2 |
| M18 | picker confirm no longer calls `go()` | 3.3 |
| M19 | CancelBlock loses its trigger | 3.4 |
| M20 | F-10.92 dropped from the CANCEL gate (second seat) | 4.2 |
| M21 | the F-10.77 flip-reason line deleted | 4.3 |
| M22 | `subscribeToTier` dropped from the import | 3.6 |

**THE RE-AIMS ARE PROVEN BOTH WAYS TOO** — a re-aim that merely made a bench
permissive would be worse than the red it cured:

| bench | cured | uncured |
|---|---|---|
| `tdw09_uivendor` | **76/76** | 69/76 — 7 red |
| `tdw10_tier` | **98/98** | 80/98 — 18 red |

**FLOOR — every bench in `scripts/`, run on BOTH trees and diffed. Exactly one
line moved: the new bench, 0 → 22. Zero other movement, repo-wide.**

`tdw07_f0784_panel` **34/34** · `tdw09_uivendor` **76/76** · `tdw09_p2_doors`
**86/86** · `tdw09_home` 67/67 · `tdw09_roles` 131 · `tdw09_landing` 103/103 ·
`tdw09_p2c` 52/52 · `tdw10_p2_retint` 76/76 · `tdw10_tier` **98/98** ·
`tdw07_p4b_body` 133/133 · `tdw10_p1_shell` 57/57 · `tdw07_p2_profile` 48/48 ·
`tdw07_p3_portfolio` 119/119 · `tdw09_hotfix` 38/38 — all AS CHARTED.

Attributed reds **reproduced UNMOVED**: `tdw10_p3_deck` **191/193** (F-10.62) ·
`tdw_f0774_stripper` **33/35** with the dream-os sibling laid (F-10.49) — your
container's number, closed empirically as ruled; it reads 32/34 + 1 named skip
without the sibling, which is NOTE_25 §4's recorded pair.

**tsc — 0 errors, AND NOT CITED AS THE GATE.** Hand-derived per the strict:false
disclosure: **this delivery introduces ZERO new `useState` and ZERO new nullable
state.** The two nullables that travelled (`subscription_link`, `subscription_id`)
are read only in truthiness guards and, for the link, inside its own truthy
branch. No `number | null` flows anywhere in the diff. There is no arithmetic in
the moved surface.

---

## 6 · A SECOND SELF-CAUGHT DEFECT, FOUND BY THE RE-AIM

`tdw09_uivendor`'s file reader **threw** on an absent subject rather than
returning empty. The moment §9 was re-aimed at the new card and the bench was run
at the pre-move tree, it **crashed instead of reddening** — a bench that cannot be
proven both ways. This is F-09.93's exact disease, the one that killed
`tdw07_p3_portfolio` and cost a sitting. CE-206's refuse-never-crash shim applied,
labelled in-file. Found by running, not by reading.

---

## 7 · RIDER-A — nine cells authored and cut to hold the ratified 22

Available on one word: the Billing row closes the panel (separate cell) · glyph
and subtitle as two cells rather than one · the page eyebrow byte · the money
register on the card as its own cell · the one-caller Fork-D guard as its own cell
· `#tier` presence and its live route as two cells · Header and More copy as two
cells · More's Billing row as its own cell. Each currently rides merged inside
1.4, 6.1, 7.1 or 7.2, so **no property is unasserted** — only less finely
separated.

---

## 8 · OPEN, AND OWED TO THE CHAIR

1. **D-1** — ratify or reverse the three-bench radius extension.
2. **Smoke ⑤** — the only witness for F-10.101. Cold load `/vendor/settings#tier`: **scroll, or land?**
3. `tdw10_tier`'s 「 finally lands 」 sentence, left untouched pending ⑤.
4. **Register:** F-10 next chair-free **.102**. Nothing new drawn this sitting — no defect was found that was not either mine (D-2/D-3/D-4, disclosed, not filed) or already numbered.
