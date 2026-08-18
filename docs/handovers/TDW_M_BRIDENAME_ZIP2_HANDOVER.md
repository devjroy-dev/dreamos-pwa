# TDW · M-BRIDE-NAME · ZIP 2 (dreamos-pwa) — HANDOVER

Charter: `M-BRIDE-NAME`, CE-35, 2026-08-18. Built under the founder's
**both-roles** word and **R-35.12** (arm 3b).

**⚠ TIP CORRECTION.** The charter named `dreamos-pwa c6e631d`. At build time
`origin/main` was **`21fb5ea`** — `TDW_15 P2 ZIP2: her envelopes, the tray, and
the hairline that says nothing` had landed in between. **This ZIP is built and
benched at `21fb5ea`, not at the charter tip.** `app/(landing)/page.tsx` was
verified untouched across that delta (`git diff --stat c6e631d 21fb5ea` on the
file is empty) and both cites re-read there, so the charter's derivation holds —
but the tip in the charter is stale and any later reader should use this one.

dream-os sibling at **`0704c6a`** (ZIP 1, pushed).

---

## 1 · WHAT SHIPPED — three files

| file | what moved |
|---|---|
| `app/(landing)/page.tsx` | Two expressions. The Send-code gate at the join screen; the onboarding routing decision after provision. |
| `scripts/tdw_m_bridename_gate.proof.mjs` | NEW. 22 cells, both-ways, five production-source mutations. |
| `docs/handovers/TDW_M_BRIDENAME_ZIP2_HANDOVER.md` | NEW. This file. |

**Zero new copy.** The button label, the `Your first name` label and the
`First name` placeholder all pre-date this sitting, and a disabled button mints
no string. **Zero controls minted or removed** — the join screen's nine controls
are all present and unchanged; one `disabled` expression grew a term.

### The gate (both roles)

```
disabled={phone.length < country.maxDigits || !joinName.trim() || (role === 'Maker' && !joinCategory)}
```

Three terms, in the ruled order. **The name term carries no role guard.** The
vendor category gate stands untouched beside it.

### The routing (arm 3b)

```
const coupleNeedsOnboarding = !isVendor && (!pinSet || !d.name);
```

`!pinSet` is preserved byte-exact — every pinless couple still reaches the form,
which is today's behaviour and §8 SCOPE LAW's requirement. `|| !d.name` is the
new arm: a **pinned, nameless** returning bride now reaches the form for the
first time. That is the case F-OB.14 was minted for, and the old conjunction
short-circuited past it at `!pinSet` before her missing name was ever consulted.

---

## 2 · WHAT IS PROVEN, AND HOW

**Both cures are boolean expressions, so the bench does not grep them — it
extracts each from the shipped source and EVALUATES it across a truth table.**
The cells assert what the screen *decides*. A rewrite that preserves the
decisions passes; one that preserves the wording and breaks the decisions fails.
That distinction is the whole reason this defect survived: the old expression
*read* like a name check while never once consulting a name.

- **UNCURED tree (`21fb5ea`, bench only): exit 1 — 13 FAIL, 9 ok.**
- **CURED tree: exit 0 — 22/22 GREEN.**
- **`npx tsc --noEmit`: exit 0, clean.**

Five mutation cells break production source and restore byte-identically
(CE-127 anchor-uniqueness asserted on each):

| cell | mutation | reddens |
|---|---|---|
| §M.1 | remove the name term from the gate | §1.2 |
| §M.2 | give the name term a `role === 'Dreamer'` guard | §1.7 |
| §M.3 | drop `.trim()` | §1.3 |
| §M.4 | revert the routing to the old conjunction | §2.4 |
| §M.5 | narrow `(!pinSet \|\| !d.name)` to `&&` — the 3a regression | §2.2 |

**Two cells failed on the first cured run and both were mine, not the code's.**
`§0.2`'s comment-blindness proof pointed at a literal I had never actually
written in the comments, and `§M.3`'s anchor `!joinName.trim()` occurred twice
once the gate's own comment quoted the bride-only shape it refused. Both were
caught by the bench's own guards — the anchor-uniqueness assert and the strip
proof — which is those guards doing exactly their job. Repaired, then re-run
both ways.

### The floor — one delta, DERIVED not dismissed

**BEFORE (clean tree, `21fb5ea`, `--check`): `FLOOR = NAMED BASE, no delta`,
6 reds by name, exit 0.**

**AFTER (delivery tree, `--check`): exit 1, one added name —
`tdw_f0774_vacuity_probe`.**

The pwa runner's own header says of this bench: *"If it ever reds again, that is
a finding, not a baseline."* So it was derived rather than waved through.

**Cause, derived by command:** `tdw_f0774_vacuity_probe` **refuses on a dirty
tree** — it writes to production source and restores it, and on a dirty tree it
cannot prove the restore was clean. Its own words: `STOP — the tree is dirty.
Nothing was touched.`

**Proven by contrast, not asserted:** the delivery was stashed, the pristine tree
dirtied with a single unrelated byte in `README.md`, and the probe produced the
**identical refusal**. The tree was then restored clean and the probe ran
**GREEN, exit 0, 21 reds**. With the one refusal set aside, the AFTER floor set
is **byte-identical to the BEFORE set** — no other bench moved.

**So this is not this delivery's content. It is F-14.16's exact class on the pwa
side:** a delivery tree is dirty by definition, and a clean-tree refusal on a
runner with no `--delivery` mode makes the floor unmeasurable at precisely the
moment it is meant to gate. dream-os cured this for itself; the pwa has ORDERING
rather than refusal at the runner, but one *bench* carries its own refusal and
reproduces the gap. **Filed as a finding for the chair — a micro to port
`--delivery` to the pwa runner, or to teach that probe the declared-dirt
distinction. Not cured here: this sitting is chartered on two expressions.**

After the founder commits, the tree is clean and this red disappears on its own.

---

## 3 · THE CROSS-REPO SEAM, DECLARED

This bench **assumes** `/provision` returns `name`. If ZIP 1 were reverted, every
cell here would still pass and the screen would still be broken — `d.name` would
be `undefined`, `!d.name` permanently true, and `(!pinSet || true)` would route
**every** couple to onboarding, named or not. The server half is proven in
dream-os by `scripts/bOB_m_bridename_fill_bench.js` at `0704c6a`. Each half names
the other; neither can vouch for the seam alone.

This is also why the ZIP order was not inverted. Both are pushed back-to-back in
one sitting; the walk runs after both.

---

## 4 · WHAT THIS DOES **NOT** CURE

1. **The existing stock of 20 nameless couples.** The gate stops the empty-name
   class at the *door*; it reaches nobody already through it. Arm 3b recovers
   them **only if they return to the web door** — a bride who lives on WhatsApp
   is still unreachable, because the WhatsApp onboarding gate is dark behind
   `laneFlags.js` and the un-vetoed redirect byte. **That flip is the founder's
   separate word and no byte of it is in either ZIP.**
2. **Abandonment after OTP.** A bride who passes the gate, receives her code and
   closes the tab is beyond both ZIPs. The gate cannot stop a closed tab; the
   frost guard catches her whenever she does open the app.
3. **F-OB.15** (Mira told `unknown`) and **F-OB.16** (`pin-login` omits `name`) —
   both minted, both queued, **zero bytes of either here**.
4. **The rendered button.** No cell asserts the `disabled` attribute reaching the
   DOM or `GoldBtn`'s handling of it. A container with no browser cannot see it.
   **That is the founder's walk.**

---

## 5 · WHAT THE FOUNDER RUNS

```
bash scripts/run-floor.sh --check
node scripts/tdw_m_bridename_gate.proof.mjs
npx tsc --noEmit
```

Before committing, expect the floor to show the one derived refusal above and
exit 1; after committing, expect `FLOOR = NAMED BASE, no delta`. The bench should
print `GREEN — tdw_m_bridename_gate 22/22`, and `tsc` should be silent.

---

## 6 · NEXT — the walk

The fixture SELECT ships first, placeholder-free and anchored on the walking
account, so the walk card is authored from the founder's pasted rows rather than
from prediction (fixture-state law). The card then covers: a no-name signup
attempt (**the button stays dead**) · a typed-name signup on a re-bind phone
(**the name LANDS** — the path-(b) proof) · a returning nameless bride with a PIN
(**she finally meets the form** — the 3b proof) · and the SELECT showing
`users.name` written.
