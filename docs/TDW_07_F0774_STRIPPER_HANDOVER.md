# TDW_07 — F-07.74 THE STRIPPER AUDIT · EXECUTOR HANDOVER (dreamos-pwa half)

**Base:** dreamos-pwa `5535e24c0c51214da6054da0754dbcaaed419295` · sibling ZIP: dream-os on `614e96270c9a8e02f91430ded22bd72aeb88540f`, **applied second**.
**Scope as ruled (CE §4):** both repos, **bench machinery only**. Zero `app/` bytes. Zero `lib/` bytes. Zero `components/` bytes. Zero SQL. W-1 trivially clean.

---

## 1 · WHAT SHIPPED, pwa

| path | what |
|---|---|
| `scripts/lib/stripComments.mjs` | **NEW — THE definition.** The dream-os donor's mechanism, promoted to a module. Exports `stripComments` and `NAIVE_RETIRED` (the retired rule, for vacuity twins only). |
| `scripts/tdw_f0774_stripper.proof.mjs` | **NEW — 35/35 with the sibling clone present; 34/34 + 1 named skip in a lone checkout.** α/β/γ over all seven `image/*` files, both declared holes canaried, cross-repo identity, derivable coverage. |
| `scripts/tdw_stripper_census.mjs` | **NEW — the committed census instrument.** TypeScript-lexer oracle. Loud named skip when `node_modules` is absent; gates nothing. |
| `scripts/tdw_stripper_census.out.txt` | its captured output at this tip. |
| `scripts/tdw_f0774_vacuity_probe.mjs` | **NEW — the plant-inside-the-bite probe, shipped re-runnable.** The evidence behind the 21 class-(a) findings. Refuses to start on a dirty tree; plants, runs, restores byte-identical, verifies the restore. |
| `scripts/tdw_f0774_coverage_red_at_5535e24.txt` | the coverage cell's captured RED at the uncured tree. |
| 14 proof files | converged on the module; each gained a §0 canary section. |

**The eleven naive copies are gone.** `§6.3` derives that by command and reddens if one grows back.

---

## 2 · THE FLOOR, run by command · every movement classified

| proof | before | after | Δ | class |
|---|---|---|---|---|
| `tdw07_p1_discover` | 35 | **43** | +8 | (c) |
| `tdw07_p2_profile` | 42 | **48** | +6 | (c) |
| `tdw07_p3_portfolio` | 111 | **117** | +6 | (c) |
| `tdw07_p4a_ig` | 63 | **69** | +6 | (c) |
| `tdw07_p4b_slice1` | 24 | **30** | +6 | (c) |
| `tdw07_p4b_probe` | 27 | **33** | +6 | (c) |
| `tdw07_p4b_body` | 125 | **133** | +8 | (c) |
| `tdw07_f0760_claim` | 76 | **82** | +6 | (c) |
| `tdw07_p6_fold` | 60 | **68** | +8 | (c) |
| `tdw_auth_crossover` | 30 | **36** | +6 | (c) |
| `tdw_f0770_authority` | 101 | **104** | +3 | (c) |
| `tdw07_f0784_panel` | 31 | **34** | +3 | (c) |
| `tdw07_f0789_conversations` | 24 | **30** | +6 | (c) |
| `tdw07_f0790_dashboard` | 34 | **37** | +3 | (c) |
| `tdw06_f06133_drawer` | 41 | 41 | 0 | — |
| `tdw07_f0766_orphan` | 21 | 21 | 0 | — |
| `tdw06_m3_report_chip` | GREEN | GREEN | 0 | — |
| `tdw_f0774_stripper` | — | **35/35** (sibling present) / **34/34 + 1 skip** (lone) | new | — |
| `tsc --noEmit` on cleared `.next` | 0 | **0** | 0 | — |

**Zero (a) movements. Zero (b) re-aims. Every Δ is (c), honest additions.**

The intermediate state — module in, canaries not yet — held **every count byte-identical**. That is the cleanest evidence the mechanism swap changed no verdict; the additions are canaries and nothing else.

**`tsc` is unaffected by construction, and it was still run.** `tsconfig.json` includes `**/*.ts`, `**/*.tsx`, `**/*.mts`; every file in this delivery is `.mjs`. Derived, then verified anyway on a cleared cache.

---

## 3 · §5's PROBE — 21 hollow greens, minted per instance

**Re-runnable: `node scripts/tdw_f0774_vacuity_probe.mjs`.** Q-SP-5 binds a conviction as hard as a cure — evidence nobody can re-run quietly stops being evidence. The probe anchors to the two `accept="image/*"` sites by TEXT, never by stored character offsets, which rot the moment anyone edits above them; it STOPs on a dirty tree; and it verifies its own restore before exiting. Verified on a clean cured tree: **21 reds, `git status` clean afterwards.**

Forbidden specimens planted **inside sanctuary's two former bites** (sanctuary restored byte-identical, verified).

- **Naive stripper (the tree as it stood):** `p6_fold` 60/60, `p4b_body` 125/125 — **ZERO REDS.**
- **Cured module, same specimens:** `p6_fold` **48/60**, `p4b_body` **116/125** — **21 REDS.**

`p6_fold` §3.5 · §4.8 · §5.5 · §5.6 · §5.7 · §5.8 · §6.1 · §6.2 · §8.4 · §10.2 · §11.3 · §12.3
`p4b_body` §2.6 · §2.7 · §2.8 · §5.8 (two sites) · §9.4 · §9.5 · §9.6b · §9.8

Each has been acquitting over code it could not see. **§12.3 is the money register** — the founder's own vetoed byte, unprotected across 6,519 characters of the deck he walks.

With nothing planted, both benches were 60/60 and 125/125 under **both** strippers. The swallow bought no false verdict at this tip. It bought the capacity for one, twenty-one times.

---

## 4 · THE COVERAGE CELL'S RED, CAPTURED (CE §3's demand)

**Committed at `scripts/tdw_f0774_coverage_red_at_5535e24.txt`** — not a chat artefact. A capture that lives only in a transcript is not banked, and the first cut of this delivery made exactly that mistake; the founder caught it before the push.

Against the uncured tree — `5535e24` plus the module and the bench only, nothing else converted:

```
FAIL §6.3 NOBODY else defines a stripper any more — one home, derived
     a copy of the naive rule has grown back in scripts/
RED — tdw_f0774_stripper 32/33
```

**Disclosed, not dressed up:** §6.3 is what convicts there. **§6.1 passes vacuously at the uncured tree** — nothing imports the module yet, so "every importer is canaried" is true of a set of one. §6.1 only becomes load-bearing after convergence. Both facts on the record.

---

## 5 · TWO NEW FINDINGS — reported under §0.2, not adapted around

The census instrument judges the standing scanner **against the compiler**:

> retired naive rule: disagrees with the compiler on **134 files**
> `scripts/lib/stripComments.mjs`: disagrees on **10**

Not zero. The ruling's stated basis — *"kills three of the four shapes outright"* — **holds**. *"Agrees with a compiler"* does **not**, and it was never claimed before it was derived.

**H1 · JSX text apostrophes (under-strips).** In JSX text an apostrophe is prose, not a quote. `we're` opens a string the scanner never closes; while mis-parked it recognises neither `//` nor `/*`, so **real comments survive into the "code" string**. 2,543 non-whitespace chars in sanctuary, 484 in `MessageBubble.tsx`, ten files total. Harm: an absence-cell can **convict on comment prose**; a presence-cell can **pass on comment prose**. It cannot manufacture F-07.74's hollow green — nothing live is deleted.

**H2 · Regex literals (over-strips) — ARMED TODAY.** `/^https?:\/\/(www\.)?instagram\.com\//i` in `lib/frost/igLink.ts`: the tail `\//` trips the line-comment branch and the rest of that line dies. 8 non-whitespace characters. The enclosing function survives, so no absence-cell over that file is vacuous — **§4.4/§4.5 hold exactly that boundary.** `p1_discover` and `p6_fold` both strip igLink.

Both are declared in the module with measured magnitudes and celled at named fixtures (§4.1–§4.6). **(b2) would close both.** F1 is not reopened; the ground is reported as it was found after the ruling.

---

## 6 · F-07.99 EXECUTED AS RULED

p1's dead port is now the module **and its five reads pass through it**. Count held **35/35 across the wiring**, derived before any canary landed — so p1's +8 is canaries alone, not a re-aim. Every proof on the coverage list carries a **§0.Z invocation cell**; `§6.4` derives that list rather than quoting a note.

---

## 7 · THE CROSS-REPO IDENTITY, PROVEN BOTH ENDS + BOTH WAYS

With the two clones side by side, `pwa §5.1` and `dream-os §3.1` both **PASS**. A **one-byte mutation** of the pwa definition (`i += 2` → `i += 3` in the line-comment branch) turned **both cells RED across the repo boundary**; restored byte-identical, `cmp` verified.


**LAYOUT NOTE:** the identity cell resolves `../dreamos-pwa` and `../dream-os`. In the founder's Codespace both repos sit side by side, so the cell RUNS and the counts are the sibling-present ones above. In a single-repo checkout it SKIPS, named and counted.

**In a lone checkout the cell SKIPS — named, counted, never a pass.** To prove it locally, clone `dreamos-pwa` beside `dream-os` and re-run either bench.

---

## 8 · NAMED SKIPS (floor-method law)

1. **`tdw_f0774_stripper §5.1`** — skips when the sibling clone is absent. Proven above with both clones present.
2. **`tdw_stripper_census.mjs`** — skips loudly without `node_modules`. `typescript ^5` is already a devDependency; no dependency was added. **Gates nothing.**

---

## 9 · FOUNDER STEPS

**None beyond apply + verify + push.** No dashboard act, no env var, no SQL, no live witness — this sitting ships bench machinery and its acceptance is the floor re-run, per the kickoff's §6(4) declaration.

---

## 10 · WHAT THE NEXT SITTING PICKS UP

- **H1/H2 are open**, declared and canaried. Closing them means a real lexer in the standing path — the (b2) the chair refused on evidence that has since changed.
- The **21 class-(a) cells** are now protected but were never re-derived on their merits; whether each still asserts the right thing over the newly-visible bytes is a re-aim question this sitting did not open.
- `AddMuseSheet.tsx` is a **latent carrier** — armed by the next block comment added below `:166`. §1 and §3.2 hold it.
