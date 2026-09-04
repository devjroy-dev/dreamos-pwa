# M-FINISH · S2/4 · THE GATE-RED CURES — F-38.56 · F-38.57 · F-38.58

**BASE (R-38.15): `256e5d4` = `origin/worklist`, re-derived at the moment of cutting.**
**Railway/Vercel green: NOT CLAIMED** — nothing here ran against a deploy.

Five files. One product byte, two instruments, a manifest and this document.

---

## §1 · F-38.57 · THE R-38.1 CELL DID READ THE SET. ITS EXTRACTOR READ A COMMENT.

**The chair's finding is real and its diagnosis needs one correction, which is filed rather
than quietly worked around.** The ruling read *the cell doesn't consult their set*. It does —
`INTERIM_HUB_PRIMERS` has been in `ALLOWED` since §4-2. What failed is the parser that
builds it, and **the byte that broke it is mine.**

```
INTERIM_HUB_PRIMERS[^=]*=\s*\[([\s\S]*?)\] as const;
```

That finds the FIRST occurrence of the symbol. At §4-3 the first occurrence stopped being
the declaration: C-2's ruling text, which I wrote above `INTERIM_VENDOR_LINKS`, cites
`INTERIM_HUB_PRIMERS` by name to explain why the two sets are separate. There is no `=`
between that mention and the LINKS declaration below it, so `[^=]*` walked across the prose
and **captured the links array**. Derived, not inferred:

```
INTERIM_HUB_PRIMERS   occurrences: 3 | first at 10185 | declaration at 21939  ← first is prose
```

So `HUB_PRIMERS` came back as the three `/vendor/discover*` links plus comment fragments, the
two primer strings were absent from `ALLOWED`, and the seven declared doors reported as
strays. **A FAIL ABOUT THE TREE FOR A FAULT IN THE READER**, and the tree was correct —
both entries are declared in the registry with their source lines, exactly where the third
band ratified them.

**THE COMMENT THAT BROKE IT WAS RIGHT TO EXIST.** Naming the other set is how a reader
learns why there are two. The defect is a parser keyed on a bare symbol against a file that
discusses its own symbols in prose — **a census keyed on a symbol counts homonyms**, which is
CE-38's own banked law and which F-38.53 restated one sitting ago, filed by this seat, about
this seat. Third sighting on this arc.

### The cure

One helper, `registryDeclaredSet(name)`, anchored on **`export const NAME`** — the
declaration, which cannot be written in passing — and read by both `registryVendorLinks()`
and `registryHubPrimers()`. `INTERIM_VENDOR_ROOMS` and `INTERIM_VENDOR_LINKS` were checked
and their first occurrences ARE their declarations today; they go through the same helper
anyway, because "it happens to be first" is not a property either file promises to keep.

**AND IT REFUSES RATHER THAN RETURNING `[]`.** An empty set here does not read as broken — it
reads as *nothing is allowed*, so every declared exception becomes a stray and the gate
reports a catastrophe about a correct tree. F-38.44's shape, third sighting.

### The report, per the ruling

Primer hits now resolve against the set and are counted as PAIRS, not as set size:

```
N declared interim rooms, N declared interim links,
7 declared primers (F-38.47) through 2 registry entries, 0 strays across N shell surfaces
```

A set has two entries and the shell carries seven doors through them. **The number worth
watching is the number of DOORS**, because that is what the F-38.47 design sitting has to
re-point. A stray outside all three sets still FAILs.

**Calendar's `/vendor?aiPrimer=` is confirmed declared** — verified by command at the
registry, entry present with its source line (`CalendarDaySheet.tsx:431`), arrived with
calendar's crossing at §4-2. No named entry was owed.

**Both-ways, run:** the seven real doors → `primer pairs: 7 | strays: []`. A forged
`/vendor?forged=` beside them → `strays: ["/vendor?forged="]`.

---

## §2 · F-38.58 · THE EYEBROW AT x=0 IS REAL, AND IT IS NOT NEW

**The chair's second finding holds; its "and new" does not, and the correction matters
because it changes who owns it.** Nothing between S3's cure, the F-38.55 restore and batch ①
moved this. Derived by `git log -S`:

```
.wl-fr{padding:0 0 24px}          011e6c9  M-WORKLIST P1 — the shell's first commit
.wl-main > *{padding-left:…}      c61a541  ZIP9 — the gutter law
.wl-frhead added to C-R7a         947cde4  H-1(b) — the first cell that ever looked
```

**The rule has taken the gutter back since the gutter law landed.** What changed at H-1(b) is
that an instrument finally measured a text element inside `.wl-fr`.

### The mechanism

`padding:0 0 24px` sets padding-left and padding-right to **zero**. `.wl-main > *` has the
**same specificity** — `(0,1,0)` each, since `*` contributes nothing — so source order
decides, `FR_CSS` mounts after `SHELL_CSS`, and the first-run region paints at x=0.

### WHY 16.5, AND IT IS THE CHAIR'S QUESTION ANSWERED: SAME BASELINE, CAMOUFLAGED

`.wl-card` carries its own `padding:16px` and a `.5px` border. A card sitting at x=0 puts
its title at **16.5** — half a pixel off the house edge, which reads as correct to the eye
and to any cell measuring card INTERIORS. **The cards hid the defect for the whole arc.**

So the interiors' 16.5 is **not a second finding and not a healthy baseline** — it is the
same displacement, wearing the card's own padding as a disguise. `C-R7a first-run interiors
are one x` passed throughout because all three interiors were **equally wrong**: an internal
spread cell cannot see a uniform offset, which is D-38.1 in its plainest form.

Only the eyebrow, which has no padding of its own, sat where the container actually was.
That is why the cell that gained it named this in one run.

The residual **0.5 spread** inside the interiors is titles against bodies, within the cell's
own ≤0.5 tolerance and unrelated to this. It is not claimed cured here and it is not asserted
either way — it wants the founder's run to say whether it moves.

### The cure, at the source

`.wl-fr{padding-bottom:24px}`. The region inherits the column's gutter like every other
direct child; the eyebrow lands at the house edge (16) per the standing ruling; the cards
move to 16 with their interiors at 32.5 — **which is where every other card in the shell
already sits**, since `.wl-billcard` measures at the house edge in C-R7a today.

**THE INSTRUMENTATION IS NOT THE LIAR HERE.** C-R7a selects `.wl-frhead` and `.wl-frhead` is
what paints at 0. The selector is right, the measurement is right, and the cascade was
wrong — which is worth stating because the chair's ruling offered the other branch and it
would have been the easy one to take.

### ⚠ AND b40's C22 IS NAMED FOR THIS AND COULD NOT SEE IT

The cell is called **「no component takes back the gutter」** and it read **margin only**.
`.wl-fr` took the gutter back through the padding shorthand's horizontal component, and C22
stood green beside it for the whole arc. **A cell scoped to one mechanism of its subject
cannot see the others** — D-38.1's corollary, third instance in this sitting alone, after
C38's matcher and the audit's extractor.

Widened to flag a ZERO horizontal padding, which is safe in both directions: on a direct
child of `.wl-main` it cancels the gutter, and anywhere else it is a no-op that should have
been written `padding-bottom`. A NONZERO horizontal padding is a component's own interior
(`.wl-card{padding:16px}`) and stays legal — flagging it would teach the reader to ignore the
cell, which the margin half already learned once.

**Both-ways, run:** restore `padding:0 0 24px` → `RED C22 — wl-fr zeroes the horizontal
padding in shorthand`. Restore the cure → GREEN.

---

## §3 · F-38.56 · THE GATE MANUFACTURED ITS OWN GATE-UNSOUND

Chair-filed, witnessed on the founder's terminal. Derived at the source: the fetch loop was
already **serial** — concurrency was never the issue. The appetite was **volume and
repetition**.

Chunk URLs are content-hashed and **shared**: the layout chunk is ONE url referenced by all
nineteen pages, and the loop deduplicated *within* a page and never *across* pages, so it
fetched identical bytes nineteen times. Three cures, ordered by cost:

1. **Cache across pages** — the cheapest half by a wide margin, and a Map is the whole of it.
   The run now reports `N unique urls (M served from cache)` so the saving is visible rather
   than asserted.
2. **Pacing** — `SPACING_MS = 75` between network fetches, so what is left never looks like
   a scrape.
3. **Retry with backoff on 403/429 only.** A 404 is a fact about the deploy and is not
   retried; retrying it would turn one honest fact into four. A 403 from a CDN is a fact
   about US.

**And the report distinguishes them**, which is the half that makes the run readable:

```
GATE-UNSOUND — refused by the CDN after retries, which is this instrument's
appetite and not a defect in the deploy (F-38.56). Raise SPACING_MS or re-run.
```

separate from the `Unreachable:` list, which stays a claim about the deploy. **Collapsing the
two into 「unreachable」 is what sent the founder looking at his deploy for a defect that was
in this file.**

**A refused corpus still STOPS the run.** Naming the cause tells the operator where to look;
it is not a licence to assert against bytes the run never had.

---

## §4 · THE PATTERN, FOR WHOEVER COUNTS THIS SITTING'S FINDINGS

Four instrument defects in one sitting — the audit's extractor, C22, C38's first matcher, and
the audit's appetite — and **every one is a cell or a reader whose NAME claims a class its
BODY does not cover.** None was found by reading. The extractor was found by running its own
regex; C22 by curing the byte it should have caught; C38's matcher by a mutation; the
appetite by the founder's terminal.

**Three of the four were written or touched by this seat**, two of them in the two deliveries
immediately preceding this one. That is not carelessness about a rule; it is the rule being
easy to satisfy in prose and hard to satisfy in a matcher, which is why F-38.45's shape-table
law exists and why it now applies to cells as well as to persona sweeps.

---

## §5 · GATE

`npx tsc --noEmit` **exit 0** · `b40` **FLOOR GREEN, 38 cells** · floor by SET in
`--delivery` mode against `scripts/floor-manifest-ce38-s24-gatered.txt`.

`wl_audit` is syntax-checked and its argument guard fires; **it has not been run against a
deploy from this seat and cannot be.** The two lines the founder re-runs are the verdict.

---

## §6 · WHAT THIS SEAT OWNS

- **F-38.58's cure changes what the founder will SEE.** The first-run cards move 16px right
  and narrow by 32px. That is the correction, not a side effect — they will finally sit where
  Billing's card sits — but it is a visible change to a surface he has walked, and he should
  be told before he looks rather than after.
- **The 0.5 interior spread is untouched and unclaimed.** Titles against bodies, inside
  tolerance. If it moves with this cure, it was downstream; if it does not, it is its own
  small finding and wants its own number.
- **`SPACING_MS = 75` and `RETRIES = 3` are chosen, not derived.** They are a first cut
  against one witnessed 403 storm. If the founder's run still refuses, the constant is the
  thing to raise and it is named at its site so he does not have to find it.
- **The primer PAIR count is a new number in a PASS line.** It should read 7 today. If his
  run prints anything else, that is a finding and not a rounding — a pair appearing means a
  crossed room gained a door out of the shell.

## §7 · THE NEXT SITTING

Batch ② — **team · contracts · tds** — opens on the tip this makes, after the founder's two
lines come back green. Batch ③ is collab alone with its pre-granted `wl_render.cjs` byte.

Still open and unchanged by this cut: F-38.22 · F-38.23 · F-38.24 · F-38.30 = F-19.14 ·
F-38.31's Phase 4 half · F-38.32 · F-38.38 + F-19.18 · F-38.47's design sitting · F-38.52
(the founder's walk, on frames) · the two dirt-enumeration homes.
