# M-FINISH · S2/4 · F-38.60 — THE REGISTRY'S PROSE WAS PARSED AS CODE

**BASE (R-38.15): `5c39b8d` = `origin/worklist`, re-derived at the moment of cutting.**
**Railway/Vercel green: NOT CLAIMED.**

Four files, and **no product byte among them.**

---

## §1 · WHICH HALF BROKE — (b), AND THE TREE IS EXONERATED WITHOUT A DEPLOY

The chair's fork was (a) entries absent from the set, or (b) entries present and the reader
at fault. **It is (b), derived three ways:**

1. **The entries are in the file.** Literal grep at the tip: `/vendor/studio/team`,
   `/vendor/studio/tasks`, `/vendor/studio/team-payments` — all three PRESENT, each with its
   source line, exactly as ratified in advance.
2. **The source-side twin is green on the same tree.** `b40` C31 walks the import graph for
   undeclared `/vendor` literals reachable from crossed rooms, reads the SAME set from the
   SAME file, and passes. **Two readers, one registry, opposite verdicts** — which localises
   the defect to the reader that disagrees with the tree.
3. **Running the uncured extractor reproduces the FAIL exactly**, and running it one
   apostrophe lighter makes it pass.

---

## §2 · THE MECHANISM, AND THE ASYMMETRY IS THE WHOLE DIAGNOSTIC

`registryDeclaredSet` matched quoted strings with a PAIR matcher, `'([^']+)'`, against the
raw block — **comments included**. At §4-4 the `INTERIM_VENDOR_LINKS` block reached **21
apostrophes. Odd.** One unmatched apostrophe offsets every pairing after it, so real entries
fall inside phantom strings and out of the set.

Derived by command, running the apostrophe count down the block:

```
  4  ENTRY    '/vendor/discover/preview',      ← count EVEN here
  8  ENTRY    '/vendor/discover/profile',      ← EVEN
 12  ENTRY    '/vendor/discover',              ← EVEN
 13  COMMENT  // ── §4-4 · TEAM'S THREE …              +1
 15  COMMENT  // … Storefront's Discover row's class   +2   ← count now ODD
 17  ENTRY    '/vendor/studio/team',           ← swallowed
 19  ENTRY    '/vendor/studio/tasks',          ← swallowed
 21  ENTRY    '/vendor/studio/team-payments',  ← swallowed
```

**THE CHAIR ASKED WHY THE EARLIER ENTRIES PASSED, AND THE ANSWER IS THAT THEY WERE NEVER
SAFE.** `/vendor/discover/preview`, `/vendor/discover/profile` and `/vendor/discover` parsed
correctly for one reason only: the comment apostrophes above each of them happened to arrive
in EVEN numbers. §4-4's comment contributed three — 「TEAM'S」, 「Storefront's」, 「row's」 — and
the luck ran out on the first entry added after an odd comment.

**Proven, not asserted:** deleting ONE apostrophe from that comment (`row's` → `row`) makes
the uncured reader return all six. One character is the entire difference between a green
gate and a gate that convicts a correct tree.

### It is F-38.46's defect in its third home

`b40` C5 read `copy.ts` — 151 apostrophes — with this same pairing and **structurally could
not fail**. The pairing was *abandoned* there rather than repaired, and the reasoning was
written down. **The lesson reached that cell and not this file.** Fifth firing of the
matcher family; the class walking away from its cure for the second time in two sittings,
after F-38.59.

### And `b40` C24 has read this same registry, with the same shape of matcher, and never broke

Because it calls `strip()` first. **One reader stripped and one did not, and only the
unstripped one was ever going to break.** That is why the twin exonerated the tree, and it is
also why the cure is not a cleverer regex.

---

## §3 · THE CURE — THE ESTATE ALREADY OWNED IT AND THIS FILE WAS NOT CALLING IT

`scripts/lib/stripComments.mjs` is F-07.74's one home: a character scan with string-literal
tracking, written because the naive `/\*[\s\S]*?\*\//` rule treats the `/*` inside
`accept="image/*"` as a comment-open and once swallowed 8,094 characters estate-wide.

**Imported and INVOKED once, at the read.** The invocation is the point rather than a
detail — F-07.99 is the finding about a stripper that was ported into a proof "so the two
cannot drift" and then never called. Every derivation in the audit now sees code, and no
derivation has to remember to strip.

`b40` C31 is anchored on `export const` in the same cut. It has always been safe *because of
what another line in it does*, and "safe because of what the other line does" is not a
property to leave two readers relying on.

---

## §4 · BOTH-WAYS, AT THIS TIP

The audit needs a deploy, so the **source-side twin carries the proof here** (S3's §4-2
precedent) and the founder's run carries the served-bytes half.

- **Forge a fourth undeclared Studio href** in `studioShared.tsx` →
  `RED C31 — /vendor/studio/forged <- lib/vendor/studioShared.tsx:43 (reachable from /w/team)`.
  Restore → **GREEN**.
- **The uncured extractor on the raw registry** → returns three of six.
- **The cured extractor** → returns all six; primers still two; the stripped block carries
  12 apostrophes, which is 6 entries × 2 and no prose.

---

## §5 · GATE

`npx tsc --noEmit` **exit 0** · `b40` **FLOOR GREEN, 39 cells** · `node --check
tools/wl_audit.mjs` clean · floor by SET in `--delivery` mode: **22, identical to the named
base**, `declared files unmoved`.

---

## §6 · WHAT THIS SEAT OWNS

- **The audit has not run against a deploy from this seat and cannot.** The founder's re-run
  of the two gate lines is the verdict; his R-38.1 line should read **six declared interim
  links** and **7 declared primers (F-38.47)**.
- **No product byte moved.** If his run still FAILs on those three hrefs, the diagnosis in §1
  is wrong and the tree is the place to look next — but three independent derivations say
  otherwise.
- **This is the second sitting running in which a cure was written, reasoned about, and left
  at one site while its class walked to the next file.** F-38.59 was the FAB offset;
  F-38.60 is the quote pairing. Both were found by surveying rather than by any cell, and
  neither has a general guard: nothing asserts that a reader of a prose-carrying source file
  strips before it parses. That would be the cell worth having, and it is not in this ZIP —
  it wants a shape the chair rules on, not one I pick inside a gate-red cure.

## §7 · THE NEXT SITTING

**Batch ③ — collab**, closing `INTERIM_VENDOR_ROOMS`, with the chair's three rulings banked:
the responses sub-route crosses with its parent (census states both movements); the
`dreamai_theme` bridge write retires in the same cut with the fallback caveat stated at its
label; and the `wl_render` seam frame's comment becomes true-tense after S3's current shape
is derived.
