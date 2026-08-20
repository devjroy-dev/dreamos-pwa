# repo: dreamos-pwa · M-ROWFIX · PASS 2 — THE TRIGGER

Authored by the executor seat under CE-35, 2026-08-20.
Base tip: `a2233c1` (fetch-first at origin, clean at seating).
Sibling: `dream-os 64fbd64`, sibling-full.
Cure: **F-15.15**, second pass (R-35.16, arm Q1).

---

## 1 · WHY THERE IS A SECOND PASS

Pass 1 shipped green on two benches and green on a 374px founder walk, **and it
did not work.** At 320px the founder photographed a row reading `A…` — invariant
1 of R-35.15, by its own words, failed: the vendor name was fully consumed.

**The bytes were not wrong; they were inert.** `flexShrink:1, minWidth:64,
maxWidth:96` shipped on the pill exactly as described, and **the shrink pass they
armed never ran at any width.**

The text block is `flex:1`, which is `flex-basis:0`. A zero basis gives it a
**scaled shrink factor of zero**: it absorbs no shrinkage — and, decisively, **it
never creates overflow either.** It simply takes the free space left after the
fixed children. No overflow means no shrink pass, so the pill sat at its full
96px cap at every width and its 64px floor was never once reached.

```
374px  [text | pill] = 186  ->  pill 96, text 90     (looks cured)
320px  [text | pill] = 132  ->  pill 96, text 36     NAME STARVED
```

**And the sharper half, recorded because it is the useful part:** the comment
this delivery shipped in production said *"at the 96 cap the text keeps only
32px."* **32px is what the founder photographed.** The executor derived the
failing number, wrote it into the file, and concluded the opposite — assuming a
floor would rescue the case without checking that anything ever *invokes* a
floor. Watch-list entry one, demonstrated in production ink.

**The benches could not have caught it.** They pin invariants structurally, which
was correct doctrine. **The walk is the layout's witness**, and pass 1 is now the
estate's standing proof that a green bench is not a walked row.

---

## 2 · THE CURE — ONE BYTE, AND IT IS THE TRIGGER

`TEXT_MIN = 68` on the text block of the **two bitten rows only**.

That single positive minimum is what lets the row **overflow** — and overflow is
the only thing that starts the shrink pass. With it, every byte pass 1 shipped
becomes load-bearing:

| byte | before | now |
|---|---|---|
| `TEXT_MIN` on the row | — | **the trigger** |
| `flexShrink:1` on the pill | inert | the pill is the item that yields |
| `minWidth:64` on the pill | never reached | invariant 2's guard, now live |
| `maxWidth:96` on the pill | did all the work | the resting width when space is plentiful |

**THE FIGURE IS DERIVED, and every input was read from the tree** —
`gutter: 24` from `lib/frost/tokens.ts`, `gap: 14` and `icon: 40` from the row
itself, the pill's floor and cap from its own style line. Only the amount
column's ~58px is an estimate, taken conservatively.

```
worst case, the `my` row at 320px:
  320 − 2×24 gutter − 40 icon − 3×14 gaps − ~58 amount = 132px for [text | pill]
  132 − 64 (the pill's floor)                          = 68
```

At 68 the two land **exactly full**: the row overflows by 32, the shrink pass
runs, all of it falls on the pill (the text's scaled factor is still zero), and
the pill is driven to **exactly** its 64 floor. Text 68, pill 64.

**At 374 nothing changes.** Free space is 90px, above the minimum, so the clamp
never engages and the width the founder witnessed green is untouched.

**Below 320 the row genuinely overflows.** That cost is **accepted by ruling and
named in-comment** rather than hidden: 320 is the floor this estate stands on,
and an honest overflow below it beats a starved name at it.

---

## 3 · THE RIDERS

**Rider 1 — the false ink cures with the cure.** The disproved comment is
**rewritten, not patched**: a future seat must not inherit prose the founder's
device already falsified. `TEXT_MIN` names why it exists — *it is the overflow
trigger; without it every shrink byte on this row is decorative* — so nobody
deletes it as noise. Cell **8a.9c** reds if the false sentence returns.

**Rider 2 — one labelled bench amendment.** Cell 8a.9 asserted the text block
declares `minWidth:0`. That was **true and insufficient**, and it is why pass 1
shipped green over a walked failure — a zero minimum is precisely what starved
the name. It now asserts **both bitten rows declare a positive minimum**: the
mechanism's *precondition*, a surface assertion of the invariant's trigger.
**No number appears in the cell**, so the figure can be retuned without touching
a bench (F-15.12's doctrine).

**And the honest limit is written into the amendment:** this bench cannot witness
layout. It can only witness that the thing which *makes* the layout possible is
present.

**Rider 3 — the walk re-runs at both widths**, same two steps, stated on the card.

---

## 4 · RADIUS — TWO ROWS, NOT THREE, AND THE CONTROL NOW SAYS SO

`expenses.tsx` has four `flex:1` text blocks. **Two changed:** the `my` expenses
row and the tray row — the two that render the pill beside their text.
**Two untouched:** the bookings row (no pill) and **the Receipts row**, which
stacks amount / pill / ✕ in a `flexDirection:'column'` container and therefore
never competed with its own text. R-35.15 ships that row byte-untouched and it
still is.

**A self-catch worth its line.** Cell 8a.9a first asserted *"at least one zero
minimum remains"* — and it **stayed GREEN under the mutation that spread the cure
into the Receipts row**, because an unrelated bookings row also carries a zero.
**A control that counts instead of identifying is no control at all.** It now
names that row by what it *contains*: S3 renders in the Receipts row and nowhere
else, so it is the landmark. M16 reds it.

A second anchor defect, caught the same way: M16's first anchor was a bare
14-space line, which is a **substring** of the 16-space one — the harness counted
two hits and refused it under R-33.4. Anchored at line start so the indent is
load-bearing.

---

## 5 · GATES

- `npx tsc --noEmit`: **0 errors.**
- `tdw15_p2_envelopes` **57 passed, 0 failed · 17 mutations, 17 bit, 0 dead**
  (two new: M15 zeroes the trigger and reproduces pass 1's exact disease; M16
  spreads the cure into the row that was never sick).
- `tdw09_frost_parity` green · `tdw13_d4_extraction` 53/0 · `obp_vendor_form`
  66/0 · `tdw13_d6_parity_matrix` 56/0 · `tdw15_p1_events` 38/0.
- **The ratified census, shown from the bench's own output rather than asserted:**
  `3.1 … 201 controls` and `3.2 … per-class split matches`. Zero controls minted,
  moved or removed. R-34.53's figure stands.
- **Floor before and after, warm, `--check`, sibling-full:**
  `FLOOR = NAMED BASE, no delta` on both sides.

### 5a · F-14.26 — DECLARED, NOT RESOLVED

`scripts/run-floor.sh` reads `$1` at `:136` and accepts `--check` only; **no
`--delivery` arm.** On a delivery tree the runner emits its dirt NOTE and
`tdw_f0774_vacuity_probe` reds by derivation — its guard at `:64-70` STOPs on a
dirty tree because it writes to production source and cannot prove its restore
was clean; the runner's own header records it is not base.

**BASE REDS, NAMED (6):** `run-assign-words-proof` · `tdw08_p5_prospects_console`
· `tdw10_p3_deck` · `tdw_auth_crossover` · `tdw_f0770_authority` ·
`tdw_f0774_stripper`.
**DELIVERY FILES, DECLARED (2):** `components/frost/blooms/expenses.tsx` ·
`scripts/tdw15_p2_envelopes.proof.mjs`.

Floor-after taken against a **local harness commit made in the executor container
and never pushed**. **The founder's floor, after he commits, is the settling one.**

---

## 6 · THE SEAL — HELD, KNOWINGLY

**P2 does not seal on this delivery.** It seals after this pass's walk goes green
at **both** widths. **F-15.8 stays cured and founder-witnessed** — `15 AUG 2026`
on both photo receipts, and the Incognito console settled the extension question
by the founder's own device. **F-15.15's cure is in second pass**, said plainly.
No green-looking delivery stands in for a done one.

---

## 7 · CARRIED FORWARD

- **F-15.13** — the dead `accent` prop, untouched.
- **The env-slice headings fork** — raised, unauthored, the founder's.
- **The hardcoded `dream-os-production.up.railway.app` POST** in
  `handleAddExpense` — observed, unnumbered, unacted.
- **`fmtDate`'s many homes** — M-CELLSWEEP's census; thirteen untouched here.
- **Below-320 overflow** — accepted by R-35.16, named in-comment, not a finding.
