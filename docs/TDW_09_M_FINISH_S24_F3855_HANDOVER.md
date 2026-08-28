# M-FINISH · S2/4 · F-38.55 — THE HUNK A SKIPPED GUARD COST, AND THE CELL THAT REPLACES THE GUARD

**BASE (R-38.15): `9e099e1` = `origin/worklist`, re-derived at the moment of cutting.**
**Railway/Vercel green: NOT CLAIMED** — nothing here ran against a deploy.

**Four files. The smallness is the point:** a whole-file copy reverted one region of one
file, so the repair touches that region, the cell that now guards it, its manifest and this
document.

---

## §1 · F-38.55 · WHAT HAPPENED, DERIVED RATHER THAN RECONSTRUCTED

Batch ①'s ZIP was cut on base `a22e391`. The founder's push line read
**`e3db79e..9e099e1`** — so the remote tip when he applied was `e3db79e`, and **three S3
commits had landed beneath the sitting**:

```
947cde4  H-2 + H-1(b) — the mode gets one persisted home (F-38.41)
77808c9  F-38.52 — the interim mode bridge to the /vendor lane
e3db79e  H-1(a) RE-WITHHELD (c-38.28) + F-38.49 — one home for the vendor's address
```

`tools/base_guard.sh` is written for exactly this and **it was not run** — the transcript
opens at `unzip`. `cp -r deploy/*` is a whole-file copy, so it silently reverted S3's work in
any file this ZIP also carried.

**THE COLLISION SET IS ONE FILE.** Derived by command, not assumed from the commit messages:
S3 touched 17 files, the manifest declared 23, and `comm -12` on the two sorted lists returns
`lib/worklist/copy.ts` alone. The other sixteen S3 files were never in the ZIP and stand
untouched.

### What the revert cost

S3 had **deleted** `cardLinkAddressBase: 'thedreamwedding.in/v/'`, for two reasons:

- **F-38.49** — it was a SECOND home for the vendor's domain literal, beside
  `pathAddressFor()`/`subdomainFor()` in `lib/solutions/types.ts`, which already owned that
  decision.
- **c-38.28** — its withholding had been discharged on a MISREAD TRIGGER. The dated condition
  was 「`/v/<code>` lands as a 200」; the seat verified 「`app/v` exists in the branch」 and
  called it fired. Those are not the same proposition — the key is the PRODUCTION apex, and
  production serves `main`, which has never carried `app/v`. **The founder opened
  thedreamwedding.in/v/DEV440 and got a 404 off his own first-run card.**

The whole-file copy put the key back **with the stale comment announcing the discharge**, so
`copy.ts` stood contradicting `FirstRun.tsx` two files over, which still carried the
re-withheld block and its curl.

### What it did NOT cost, and it is the half that matters

`FirstRun.tsx` was not in the ZIP and survived intact: the address row is still inside its
withheld comment block and reads `pathAddressFor(handle)`. **No vendor-facing byte
regressed; nothing rendered a 404 address.** Batch ①'s own three header words landed
correctly and are untouched by this repair.

### THE ENTRY IS NOT "A GUARD WAS SKIPPED". IT IS THAT THE GUARD WAS THE ONLY CONTROL.

`b40` ran GREEN on the reverted tree and the floor came back at the named base, **and both
were right** — nothing anywhere asserted the key's absence. The re-withhold was a rule
written down twice, in two files, in careful prose, **with no cell behind it**. A rule that
cannot fail on the broken tree is D-38.1 pointed at a withholding instead of at an
assertion, and a control that is one command a human can forget is a thin place to keep one.

---

## §2 · THE RESTORE — BYTE-FAITHFUL, DERIVED FROM THE COMMIT

S3's block was extracted from `git show e3db79e:lib/worklist/copy.ts` and re-seated over the
resurrected region. **Not retyped from the diff and not reconstructed from memory.**

Proof the repair is exactly a repair, by command:

```
diff <(git show e3db79e:lib/worklist/copy.ts) lib/worklist/copy.ts
  removed-from-S3 lines: 0
  added lines: 14      ← batch ①'s three header words and their note, nothing else
```

**Zero lines of S3's file removed.** The two seats' work now coexists in one file exactly as
it would have if the guard had run.

---

## §3 · C38 — THE SECOND CONTROL

`scripts/b40_worklist_shell_bench.js`, thirty-eighth cell: **the withheld vendor address is
not a live export anywhere in `lib/`.**

Scoped to `lib/` entire rather than `copy.ts` alone, deliberately. The finding is not "this
key is in this file", it is **"this address has one home"** — a key re-added one directory
over is the identical defect at a new address, and a cell that could not see it would be
guarding the spelling instead of the rule.

**The S2 law it enforces, restated at its site:** *a withheld byte must not be a live
export.* 「Nothing needs you yet.」 sat on a retired list and shipped anyway, because a live
export ships and a list stops nobody.

### ⚠ THE FIRST CUT OF THIS CELL FAILED ITS OWN SCOPE CLAIM

The matcher read `cardLinkAddressBase\s*:` — the OBJECT-LITERAL KEY, which is the shape the
byte had in `copy.ts` when I wrote it. Its NAME claimed *a live export anywhere in lib/*, and
a plant of `export const cardLinkAddressBase = '…'` in `lib/solutions/types.ts` **passed it
green**. A binding declaration spells itself with `=`, not `:`.

**That is F-38.45's law firing inside the cell written to be the second control** — a matcher
widened for the byte in front of the seat and never for the CLASS the cell names, and
D-38.1's corollary again: a cell agreeing with a description of itself. The shapes are a
declared TABLE now — object-literal key · binding declaration · named re-export · function or
class declaration — never inline.

**AND THE PROBE THAT FOUND IT FIRST FAILED VACUOUSLY**, which is worth its own line. The
initial plant landed inside a comment block (the file's first `export ` occurrence is prose
about the export shape), `strip()` removed it correctly, and the cell passed for the right
reason. **A green from a mutation that did not mutate live code proves nothing** — the second
attempt planted above the first live `export` line and the cell held.

### Non-vacuity, all three shapes, by mutating production source

| plant | file | verdict |
|---|---|---|
| `cardLinkAddressBase: '…'` | `lib/worklist/copy.ts` | RED — *(object-literal key)* |
| `export const cardLinkAddressBase = '…'` | `lib/solutions/types.ts` | RED — *(binding declaration)* |
| `export { cardLinkAddressBase };` | `lib/worklist/theme.ts` | RED — *(named re-export)* |

Each names its own shape and its own file. Restored after each: **GREEN**.

---

## §4 · GATE

`npx tsc --noEmit` **exit 0** · `b40` **FLOOR GREEN, 38 cells** · floor by SET in
`--delivery` mode against `scripts/floor-manifest-ce38-s24-f3855.txt`.

---

## §5 · WHAT THIS SEAT OWNS

- **Nothing here ran against a deploy.** The address row's withholding is a source fact and
  is asserted as one; whether production serves `/v/` is the founder's curl and nobody
  else's.
- **The discharge condition is unchanged and is a COMMAND, not a sentence:**
  `curl -sS -o /dev/null -w '%{http_code}\n' https://thedreamwedding.in/v/DEV440`, discharge
  only on **200**. `git ls-tree` on a branch is not that command and never was.
- **C38 guards `lib/` only.** A key re-added under `components/` or `app/` would not red it.
  That is a deliberate scope, not an oversight — the address's one home is in `lib/`, and
  widening to the whole tree would make the cell assert something it has not reasoned about.
  Named here so the next seat does not discover it as a gap.
- **The two dirt-enumeration homes from batch ① remain cured-but-not-unified.** Untouched
  here; still the chair's to sequence.

## §6 · THE NEXT SITTING

**Batch ② — team · contracts · tds** opens on the tip this ZIP makes. The six-step shape
stands unchanged, and batch ③'s pre-granted `wl_render.cjs` byte (`['room-collab',
'/vendor/collab']`, commented *a room that has NOT crossed*) still waits for collab.

**And one line the founder should read before batch ② applies:** the guard block is not
ceremony. It is one command, it copies nothing, and on this arc it was the only thing
standing between two seats' work and a silent revert.
