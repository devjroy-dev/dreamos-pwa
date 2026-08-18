# repo: dreamos-pwa · M-ROWFIX — THE RECEIPT ROW MADE HONEST

Authored by the executor seat under CE-35, 2026-08-18.
Base tip: `21fb5ea` (fetch-first at origin, clean at seating).
Sibling: `dream-os 64fbd64`, sibling-full.
Cures: **F-15.8** (R-35.14) and **F-15.15** (R-35.15, arm P3).

---

## 1 · TWO FILES, AND THE RADIUS CAME IN NARROWER THAN CHARTERED

| file | state |
|---|---|
| `components/frost/blooms/expenses.tsx` | MODIFIED — `fmtDate`'s body, `FileBtn`'s style |
| `scripts/tdw15_p2_envelopes.proof.mjs` | MODIFIED — §8a, twelve cells, five mutations |

**Zero dream-os bytes. Zero SQL. Zero copy.** `ENVELOPE_COPY` stays at nine and its
`1.z` closed-set cell is unmoved. W-1 shut; `brideTools`/`brideEngine`/`miraSoul`
untouched (R-31.2).

**NARROWER THAN CHARTERED, as the chair derived at the pushed tip.** All three
readers already passed `fmtDate(r.receipt_date || r.created_at)` before this
micro, so the `created_at` fallback was wired at every call site and R-35.14's
cure is **entirely inside `fmtDate`'s body — zero reader bytes moved.** Cell
8a.5 asserts that radius rather than trusting it: it counts the three readers and
reds if the cure spreads.

---

## 2 · F-15.8 — WHAT WAS ACTUALLY WRONG

`couple_receipts` holds two date shapes and the old body could read one:

- `receipt_date` is `date` → `2026-08-18`
- `created_at` is `timestamptz` → `2026-08-15T09:33:49.781224+00:00`

A photo receipt has **no** `receipt_date` — nothing sets it, there is no OCR on
any plane — so the fallback fires and **the timestamptz is the tray's normal
case, not an edge one.** The old body appended `'T00:00:00'` unconditionally,
producing `…+00:00T00:00:00`, an invalid Date; the `isNaN` guard then handed the
raw database string to the surface.

**All four timestamptz spellings failed, not just the walked one:**
`…781224+00:00` · `…49Z` · `…49+05:30` · `…781Z`. The bench asserts all four.

### 2a · THE SUFFIX SURVIVES, AND THE COMMENT SAYS WHY

The concat is not superstition. Derived by command:

```
TZ=America/New_York   new Date('2026-08-18')           -> 17 Aug 2026   WRONG
                      new Date('2026-08-18T00:00:00')  -> 18 Aug 2026   right
```

A bare date parses as **UTC midnight**; the suffix forces **local midnight**. In
IST the two agree, so a seat "simplifying" it away would ship a bug **invisible
from India and wrong for every bride west of Greenwich.** That derivation is in
the production comment (F-06.85's form) and **cell 8a.3 runs the live function
under `America/New_York` to prove it** — mutation M11b reverts the concat and the
cell reds.

### 2b · AND THE TIMEZONE SENTENCE, ON THE BRANCH IT GOVERNS

`2026-08-15T21:00:00Z` reads **16 Aug** in IST. The row shows the date **she**
filed it, in her time — the honest answer — and it means a server-side report may
legitimately differ from this row by one day. **Not a defect**, and stated in
production so nobody later files it as one.

### 2c · THE CANARY BIT AGAIN, AND THE CURE WAS SHAPE, NOT PERMISSION

The first draft folded both shapes into a ternary **on the existing line**.
`tdw13_d4_extraction` cell 2a convicted it: `const dt=new Date(d+'T00:00:00');`
is **relocated corpus** from the D-4 extraction, and editing it would have wanted
a **NINTH ruled allowlist entry** — unchartered by this micro, and R-34.54's own
words are that a ninth still reds.

Cured by **branching above it rather than editing it**: the timestamptz path
takes an early return, and the date-only path — including its concat, its `isNaN`
guard and its `toLocaleDateString` — ships **byte-identical to the extracted
tree**. That is both cheaper and truer: the shape that always worked is provably
unchanged.

**This is the second time in two deliveries that the allowlist held under
pressure by wrapping instead of editing.** The discipline is doing real work.

---

## 3 · F-15.15 — ARM P3, AND WHY BOTH BYTES

**The mechanism, stated because "make it smaller" would not have cured it.** The
pill shipped `flexShrink:0` beside a text block that is `flex:1,minWidth:0`. A
flex item with `flex-basis:0` has a **scaled shrink factor of zero**, so the text
block absorbed **none** of the overflow and all of it at once — `Ananya Studio`
became `Ana…` and the date wrapped to three lines.

**The invariants, written where they govern:**

1. **The vendor name is never fully consumed by the pill.**
2. **The pill never vanishes entirely** — it may ellipsise, because `PHOTOG…`
   still names her envelope while `Ana…` named nothing. That second failure *was*
   the disease.

**Why neither byte alone:**

- `maxWidth:96` alone pins a pixel and holds at 374px by arithmetic, saying
  nothing about 320.
- `flexShrink:1` alone is **unbounded here**: `overflow:hidden` makes this item's
  `min-width:auto` resolve to **0**, so the pill can shrink to nothing and
  invariant 2 dies silently.

**THE FLOOR IS DERIVED, NOT CHOSEN** — the bounded discretion R-35.15 granted,
discharged with its arithmetic. Worst case is the `my` row at 320px:

```
320 − 2×24 gutter − 40 icon − 3×14 gaps − ~62 amount = 128px for [text | pill]
   at the 96 cap  -> text keeps 32px   (an ellipsis and nothing else)
   at the 64 floor -> text keeps 64px  (an ellipsised name)
```

The tray row carries no icon and is 40px better off at every width.

**THE BENCH PINS THE INVARIANTS, NEVER THE PIXELS** (F-15.12's doctrine, applied
on the chair's instruction). Cells 8a.6–8a.9 assert that the pill *can shrink*,
*has a nonzero floor*, *is capped above that floor*, and that the text block
keeps its shrinkable share — **structurally.** No cell names 96, 64, 320 or 374.
The pixels are the founder walk's to witness.

**`:483` ships byte-untouched.** The Receipts row stacks amount / pill / ✕ in a
`flexDirection:'column'` container, so the pill never competed with text there.
**Two rows carried this defect, not three**, and cell 8a.10 reds if the cure
spreads to the row that was never sick (R-33.2).

---

## 4 · THE BENCH — EXECUTED, NOT GREPPED

`§8a` **extracts the live `fmtDate` from the tree and runs it.** A regex over the
source would assert *the shape of the fix* rather than the fix, and would stay
green on a body that still returns raw ISO. Cell **8a.0** asserts the extraction
succeeded **before** anything depends on it, so a failed extraction reds loudly
instead of making every cell below it vacuous.

**Twelve cells, five new mutations, all bit:**

| mutation | reds |
|---|---|
| M11 · the shape guard is defeated — timestamps return | `8a.1` |
| M11b · the concat is "simplified" away — western dates shift | `8a.3` |
| M12 · the pill stops yielding — the name absorbs it all again | `8a.6` |
| M13 · the floor goes — `overflow:hidden` lets it reach zero | `8a.7` |
| M14 · a reader drops `receipt_date` — the cure leaves its radius | `8a.5` |

**`tdw15_p2_envelopes`: 53 passed, 0 failed · 15 mutations, 15 bit, 0 dead.**
Every red claimed from the run's own output (R-33.10).

---

## 5 · THE PARITY FIGURE, SHOWN UNMOVED RATHER THAN ASSERTED

`FileBtn` is **KEPT with a style amendment**. Zero controls minted, moved or
removed. From the bench's own output at this tip:

```
ok   3.1 the Sanctuary surface carries 201 controls (186 + TDW_15 P2: 15, itemised above)
ok   3.2 the per-class split matches the amended census
```

R-34.53's ratified 201 and its `108/8/36/4/3/42` split stand untouched.

---

## 6 · GATES

- `npx tsc --noEmit`: **0 errors.**
- `tdw15_p2_envelopes` 53/0 · `tdw09_frost_parity` green · `obp_vendor_form` 66/0
  · `tdw13_d4_extraction` 53/0 · `tdw15_p1_events` 38/0 ·
  `tdw13_d6_parity_matrix` 56/0.
- **Floor-before:** `FLOOR = NAMED BASE, no delta`.

### 6a · F-14.26 — DECLARED, NOT RESOLVED

`scripts/run-floor.sh` reads `$1` at `:136` and accepts `--check` only; **there is
no `--delivery` arm.** On the delivery tree the runner reports its dirt NOTE
listing both delivery paths, and `tdw_f0774_vacuity_probe` reds **by derivation,
not by guess**: it is one of two benches the runner finds via
`grep -l 'git status --porcelain'`, and its guard at `:64-70` STOPs on a dirty
tree because it writes to production source and cannot prove its restore was
clean. The runner's own header records it is **not base**.

**BASE REDS, NAMED (6):** `run-assign-words-proof` · `tdw08_p5_prospects_console`
· `tdw10_p3_deck` · `tdw_auth_crossover` · `tdw_f0770_authority` ·
`tdw_f0774_stripper`.
**DELIVERY FILES, DECLARED (2):** the two paths in §1.

**Floor-after**, taken against a **local harness commit made inside the executor
container and never pushed** — it exists only to give the runner a clean tree:

```
FLOOR = NAMED BASE, no delta
```

**The founder's floor, after he applies and commits, is the settling one.**

---

## 7 · ONE DOCTRINE LINE FOR M-CELLSWEEP

**F-15.8's own text pins `expenses.tsx:71`; the symbol is at `:115` at this tip.**
The finding drifted the moment P2 ZIP2 added 44 lines above it. Committed ink is
never renumbered, so CE-221's text stands and readers map `:71` to the symbol.

**Adopted doctrine, third surfacing of F-15.12's family in three sittings:
FINDINGS PIN SYMBOLS, NOT ADDRESSES** — and this time the victim was a finding
rather than a cell.

---

## 8 · CARRIED FORWARD

- **F-15.13** — the dead `accent` prop, untouched.
- **The `fmtDate` proliferation** — my narrow grep found fourteen declarations;
  the chair's broader pattern counts eighteen files. **The exact count is
  M-CELLSWEEP's to derive**, not this micro's. **Thirteen of them were not
  touched** (R-33.2): this cure is the local function in `expenses.tsx` only.
- **The headings fork** — still raised, still unauthored, still the founder's.
- **The hardcoded `dream-os-production.up.railway.app` POST** at
  `handleAddExpense` — observed during the P2 walk, unnumbered, unacted.
