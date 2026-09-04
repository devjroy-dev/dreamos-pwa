# ZIP 13 — THE GATE EARNS TRUST

**Over `03a775995ca12cc450e23ef98e3eaf8e6c8f8154`. tsc: exit 0. `next build --webpack`: exit 0.**
**Floor: NAMED BASE + labeled amendment, ONE declared residual — see §6. Not clean, and it says so.**
**Item ⑥ HELD: `today-stature-mock.html` never arrived. Nothing was reconstructed from prose.**

---

## ① THE INSTRUMENT MOVES — `scripts/` → `tools/` [F-5(a)]

`scripts/run-floor.sh` globs `scripts/*.mjs` and runs every hit **bare**, exit code as verdict.
`wl_audit.mjs`'s usage guard exits **2** with no URL. From the day ZIP 11 placed it there it was a
permanent floor red — which is why **ZIP 11's and ZIP 12's "twenty-three cells, exit 0" is not
reproducible at a pristine tip.** Derived on a clean clone before any of this ZIP's files existed.

The rejected arm is quoted into the file's own header, because the reason should outlive the move:
making it exit 0 bare would be *an instrument that passes when it did nothing, which is the shape
this gate exists to refuse.*

---

## ② THE COVERAGE PREAMBLE, AND A CORRECTION TO THE INSTRUCTION [F-1(a)]

**The kickoff said "walk the Next build manifest." It cannot be done, and the correction is derived,
not asserted:** Next 16's App Router emits no `app-build-manifest.json`, and `build-manifest.json`
is not served over HTTP. There is no manifest at a fetchable URL to walk.

What *is* provable from served bytes is every `/_next/static/*.js` string the HTML carries in **any**
position — script `src`, preload link, or flight payload. That is the enumeration that shipped.
The `slice(0, 40)` cap is gone. The `catch {}` that swallowed a failed chunk is now a hard abort.

```
chunks: 65 fetched / 65 referenced
```

prints **first, on every run**, before any verdict.

**Non-vacuity, proven by mutating the served tree, not the reader:** one real chunk made unreachable
→

```
chunks: 64 fetched / 65 referenced
GATE-UNSOUND — the corpus is incomplete, so no verdict is trustworthy.
Unreachable:
  /w/today → /_next/static/chunks/app/w/today/page-4c11230cf65e449e.js (HTTP 500)
No assertions were run.                                                    exit 3
```

Not one PASS, not one FAIL. **An instrument that cannot prove it looked everywhere does not get to
say "absent," in either direction** — and a partial verdict set is the thing the preamble exists to
prevent.

**A correction I owe the chair on F-16.36's first mechanism.** The kickoff's stated cause — a fetcher
missing lazy chunks — **does not reproduce at this tip.** Derived per page: `src=` refs and total
refs are equal on all five (`/w/rooms` 14/14, `/w/today` 14/14, `/vendor/list` 11/11,
`/vendor/settings` 13/13). The fetch half was latent, not firing. The half that *was* firing is
below, and it is the half that produced the false greens.

---

## ③ THE SWEEP — TWO DEFECTS, AND THE SECOND IS THE ONE THAT MATTERED [F-2(a)]

**(a) THE CORPUS.** Declaration and consumption legitimately live apart. `.wl-card*` is declared in
the shared shell chunk and consumed by `FirstRun` on `/w/today`:

```
declared in : static/chunks/1371-*.js              (WorklistShell)
consumed in : static/chunks/app/w/today/page-*.js  (FirstRun)
```

The sweep read the `/w/rooms` corpus alone, so five live classes read as rot. All five pages now
form one corpus.

**(b) THE MATCH — and curing (a) alone would have LOOKED like a cure.** `used` was
`/"(wl-[a-z-]+)"/`: a class had to occupy a whole quoted string to count as consumed. The built
bundle carries `className:"wl-card wl-card-lead"`, so **`wl-card-lead` was invisible to the reader
even under perfect coverage.** A seat that widened the corpus, watched one name survive, and
excepted it by ruling would have buried a live regex bug under a citation. Each quoted string is
tokenized on whitespace instead. **No exception list, by ruling and by evidence.**

---

## ④ THE FIVE LEFTOVERS DIE [F-4 — scope amended by the chair's word]

| class | site | consumers at deletion |
|---|---|---|
| `wl-coindrawer` | `WorklistShell.tsx:187` | 0 |
| `wl-coinitem` (+ `[aria-current]`, `:active`, `:focus-visible` limbs) | `WorklistShell.tsx:188–200` | 0 |
| `wl-glyph` | `WorklistShell.tsx:190` | 0 |
| `wl-sub` | `WorklistShell.tsx:191` | 0 |
| `wl-stack` | `RoomsGrid.tsx:100` | 0 |

Four of the five styled the **two-row coin drawer ZIP 12 replaced when it completed R-37.79** — the
markup went and the stylesheet stayed. That is the `.wl-plink` disease recommitted by the delivery
that named it. `wl-stack` is scope ③: ZIP 12's subject implied it was gone; it was not, and the
claim was never re-derived.

The `.wl-coin` limbs of the two shared pseudo-selector rules stay. The medallion is alive.

---

## ⑤ THE ITALIC SITE — ARM TWO, ONE LINE [F-3(a)]

`components/vendor/TipsCarousel.tsx:353` dropped `fontStyle: 'italic'`. This file's `F.display`
(`:11`) is **Cormorant**, so ZIP 12's "F.display + italic is the display family, not the script role"
exemption never applied — that reasoning was derived on `OnboardingOverlay` and `AddSheet`, whose
`F.display` is **Italiana**, and generalized to a file it had not enumerated. Cormorant upright
survives as the surface's one deliberate display line. Neither ruled KEEP ternary
(`contracts:210`, `discover/submit:270`) is touched; both resolve to DM Sans and never matched.

---

## ⑥ BOTH WAYS, ON REAL SERVED BYTES

The container cannot reach `vercel.app`, so the gate had never met a deploy. Closed locally:
`npm install` → `next build --webpack` → `next start` → audit against `127.0.0.1`. The build needs a
`NEXT_FONT_GOOGLE_MOCKED_RESPONSES` mock, authored **outside the repo**; it ships in nothing.

**RED, at the uncured tree at tip — exactly the cure assertions and no others:**

```
FAIL  R-37.84 ③ italic serif dies — the script family and italic still ship together
FAIL  dead-rule sweep — declared with no consumer:
      wl-coindrawer, wl-coinitem, wl-glyph, wl-sub, wl-stack
14 PASS · 2 FAIL · 2 INCONCLUSIVE          GATE RED
```

**The five/five split is right there and it is the whole proof.** The five card classes
(`wl-card`, `wl-card-lead`, `wl-cardtitle`, `wl-cardbody`, `wl-cardaction`) **PASS** — the reader
stopped lying about the live ones. The five leftovers **RED** — it still sees the dead ones. Same
corpus, same run.

**GREEN, at the cured tree:**

```
chunks: 65 fetched / 65 referenced
16 PASS · 0 FAIL · 2 INCONCLUSIVE          GATE GREEN
dead-rule sweep — 56 rules across 5 pages, every one consumed
```

**The flash stays INCONCLUSIVE**, as ratified. The suspect the glass beat watches is named in the
script's own reason string: `app/vendor/layout.tsx`'s pre-paint pin writing `documentElement.style`
on mount. A first-paint blink cannot be observed by a fetch, and this ZIP does not pretend otherwise.

---

## ⑥ · THE ASSERTION SET — HELD, NOT SKIPPED

R-37.85 ⑥ asks the assertion set to finalize against the mock's four screens.
**`today-stature-mock.html` never arrived.** `/mnt/user-data/uploads/` is empty; the tree's
`docs/mocks/` holds only `tdw09_atelier_language.html`; there is no hash to verify against
`507f9bb1…`. Per §0 nothing was reconstructed from prose.

Everything ⑥ names that is derivable without it **did** ship — drawer row-set, no italic-serif in the
chat mount, the standing no-consumer-less-`.wl-*` assertion, methods classified, the coverage line
first. What is held is the *finalization against the mock*. Declared, not skipped.

---

## ⑦ THE FLOOR — AND ONE STOP THAT IS NOT ABSORBED

**LABELED AMENDMENT, in place, reasoned at site**, in `scripts/run-floor.sh`: fifteen benches join
the base — the `tdw07`/`tdw08`/`tdw09`/`tdw10` palette, type, role and surface cells that assert the
**Espresso-era design system R-37.65 replaced on this branch by ruling**. They fail because the
branch changed what they assert. **`main` remains their jurisdiction**; their disposition here
(retire-with-the-reader, or rewrite to Graphite at cutover) is Phase 2 / cutover business.

Seventeen extras were derived; **fifteen** join. `wl_audit` **leaves** the floor rather than joining
the base (it moved to `tools/`; it was never a bench). And:

### **STOP — `tdw_f0774_vacuity_probe` IS NOT BRANCH DIVERGENCE, AND IS NOT IN THE BLOCK**

Cause derived, per the chair's instruction:

```
$ node scripts/tdw_f0774_vacuity_probe.mjs        # clean tree
GREEN  exit 0
$ node scripts/tdw09_vendor_census.mjs && git status --porcelain
 M scripts/tdw09_vendor_census.json
$ node scripts/tdw_f0774_vacuity_probe.mjs        # same tree, now dirty
STOP — the tree is dirty. This probe writes to production source and
restores it; on a dirty tree it cannot prove the restore was clean.   exit 1
```

`scripts/tdw09_vendor_census.mjs` is a **generator, not a bench** — the same class as `wl_audit`.
It is caught by the same `scripts/*.mjs` glob, rewrites its committed snapshot, and dirties the tree.
The probe then **correctly refuses to run**, because it writes to production source and cannot prove
a clean restore on dirt. The floor's own header already half-filed this: *"the floor itself dirtied
the tree… this is filed, not cured here."*

**Tested on `main` as well: same dirt, same probe red.** So it is estate-wide and pre-existing, not
this branch's divergence — which is why it is reported rather than absorbed. Per §0.2 the cure is
proposed, not taken: **move `tdw09_vendor_census.mjs` to `tools/` too**, symmetric to F-5(a).
`tdw09_p1_canon.proof.mjs:172` reads the JSON at `scripts/`, so only the generator moves and the
snapshot path is untouched. One word and it is a two-line ZIP.

**ZIP 13's floor line, honestly:** NAMED BASE + labeled amendment, **one declared residual with a
derived cause and an unruled cure**. Not "no delta." It is still the first floor statement this
branch has carried that a reader can check end to end.

---

## ⑧ WHAT THIS SEAT OWNS

- **F-16.36's first mechanism does not reproduce at tip.** The kickoff's fetch-coverage cause was
  latent; the corpus and the match were what fired. Both cured regardless — the fetch half was one
  deploy away from mattering.
- **`b40_worklist_shell_bench` reddened on my own deletion** (C10 guarding `wl-coinitem`, C11
  guarding `wl-sub`) and is amended in place, labeled, reasoned at site, **cell count unchanged** —
  retire-with-the-reader, the name withdrawn with its subject. Caught by the floor, not by me
  reading; said plainly so the next seat knows which instrument caught it.
- The local build is a **specimen, not the deploy**. Chunk hashes and route splits should hold, but
  the deployed verdict is the founder's paste and nothing here claims otherwise.

## ⑨ THE NEXT SITTING

Item ⑥'s finalization on the mock's arrival · the vacuity-probe cure on a word · the flash walk beat
on glass · the fifteen benches' disposition at Phase 2 / cutover · and the walk card, which does not
come to the chair until the founder's paste prints all-PASS with the coverage line green.
