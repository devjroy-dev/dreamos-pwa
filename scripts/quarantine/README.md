# `scripts/quarantine/` — benches that are OUT OF THE FLOOR, BY RULING

**A bench in this directory still exists, still runs, and is still the estate's
property. What it does not do is gate a delivery.** Nothing here is deleted and
nothing here is disabled; a quarantined bench is one whose VERDICT has been shown
not to be evidence, kept runnable so the finding it holds can be worked on.

## Why the directory, and not a flag

`run-floor.sh:186` discovers benches with a FLAT glob:

```
ALL=$(ls scripts/*.proof.mjs scripts/*.mjs scripts/*.js 2>/dev/null | sort -u)
```

`ls scripts/*.js` does not recurse, so a file one directory down is outside the
floor **by construction** rather than by a list someone has to maintain.

That mechanism was chosen after the alternative was tried and failed. R-G11c.11's
seat declared `b50` out of its gate inside a floor manifest and recorded, in that
same file, that the declaration was **inert**: `run-floor.sh:121` strips `#`
before reading a manifest, so a manifest carries a FILE LIST and nothing else,
and the runner has **no bench-exclusion hook at all**. The ruling could not
execute as worded (protocol §9), the seat reported it rather than adapting it
quietly, and this directory is the arm that closes it.

**A declaration in a comment is not a mechanism. A directory is.**

## What is in here, and why

### `b50_fetch_loop_bench.js` — quarantined 2026-09-05 under R-40.34

Its SUBJECT is real and uncured. `useLoader`'s own header describes the race it
hunts: `run` re-identifies on every render and one effect issues
`fetcher(vendorId)` **before** its own `tick` abort check, so a superseded fetch
has already left the tab. That is F-39.46 at small amplitude and it is still
there. **Nothing in this quarantine says the defect is absent.**

What is quarantined is the bench's ability to answer the question *"did this
delivery break something?"*, on two derived counts:

- **F-40.70 — it cannot tell which build it is measuring.** It guards on
  `.next/BUILD_ID` *existing* (`:195`), never on it *matching the tree on disk*.
  R-38.22 exists for precisely this class — a surface a gate reads must stamp the
  commit it was built from, and the gate must refuse a build that is not the tree
  — and this gate does not implement it. Witnessed live: three runs read GREEN
  against a `.next` built inside a `git stash` block while the working tree looked
  cured.

- **F-40.71 — it is nondeterministic, so its GREEN is not evidence either.**
  GREEN and RED on IDENTICAL bytes, one build, one machine, minutes apart, with
  the count itself moving (2x then 3x on `money/invoices`). A varying count is a
  race; a static defect returns a stable number. Measured rather than asserted:

  | Build | Chair-ruled samples | Pooled, every correctly-built run |
  |---|---|---|
  | the R-G11c.11 micro | 2 RED / 10 | 5 RED / 15 |
  | `250d420` | 0 RED / 10 | 0 RED / 14 |

  Fisher one-tailed: **p = 0.237** on the ruled 10-vs-10, **p = 0.025** pooled.
  **The pooled figure is deliberately NOT treated as attribution** — pooling across
  sessions with different machine load is exactly how a significance number gets
  manufactured. What it does suggest is that a race's firing RATE is
  timing-sensitive, so any byte that changes chunk layout can move the rate
  without being on the path.

**A bench that convicts or exonerates by luck cannot police a base.** It did both
to one micro before a reach derivation settled it, and the cost was a sitting.

## Running it anyway

It is not disabled. From the repo root:

```
node scripts/quarantine/b50_fetch_loop_bench.js
```

It needs `next build` to have succeeded and a free port; in an LE container the
build fails on `next/font` reaching `fonts.googleapis.com`, which the egress proxy
refuses, and the bench REFUSES rather than reds. That environment note is
`run-floor.sh`'s own and it still stands.

## What takes a bench back OUT of quarantine

Both, not either:

1. **A build-identity gate (F-40.70).** The bench derives the tree's HEAD and
   refuses a `.next` that was not built from it — R-38.22 implemented rather than
   cited. `scripts/g11c_couple_switch.proof.mjs`'s sibling-ancestry check is the
   shape to copy: it REFUSES with the tip named, and it can still become a FAIL,
   because a refusal that cannot fail is an excuse.
2. **A determinism result (F-40.71).** Either the race is cured at
   `useLoader` and the bench returns a stable number over n runs, or the bench is
   re-authored to assert a RATE against a recorded baseline instead of a
   pass/fail. Twenty consecutive identical verdicts on unchanged bytes is the
   floor for "deterministic" here, and the number is derived at the time, never
   carried from this file.

Until then it lives here, and the floor is clean **by construction** rather than
by anyone remembering to ignore a red.

## The standing law this directory carries

**Moving a bench here is a CHAIR RULING, never a seat's convenience.** A seat that
finds a bench inconvenient has found a finding, not a quarantine candidate; the
finding goes up with its evidence and the chair decides. Every entry in this file
names its ruling, its findings, and the conditions of its own release — and a
bench with no release conditions written down is not quarantined, it is abandoned.
