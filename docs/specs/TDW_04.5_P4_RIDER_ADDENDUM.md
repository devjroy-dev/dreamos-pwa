# TDW_04.5 · P4 — HANDOVER ADDENDUM: the two-item rider

**Base (re-derived fetch-first):** `9490868` (dreamos-pwa) · dream-os `44cc167` UNTOUCHED
**Role:** executor (CE-59)

Both items were found by the executor reading the founder's own seal-walk
screenshot. Neither is chartered work; both were filed rather than allowed to
ride into the seal unnamed.

## ITEM 1 — THE CALL TIME READ DIFFERENTLY ON TWO SURFACES
The crew page rendered `19:00`; the owner's sheet rendered `19:00:00`, for the
same booking. The sheet exists precisely to mirror the crew page, so the two
reading differently is exactly the drift `slotWords.ts` was created to prevent.

**Cure:** `hhmm` hoisted to `lib/vendor/slotWords.ts` — F8(d)'s argument applied
to the field beside the slot word. **PURE MOVE:** byte-identical to the copy at
`app/crew/[token]/page.tsx:73` apart from the `export` keyword, verified by
command against origin. Both surfaces already imported that file, so the hoist
adds no new import anywhere.

## ITEM 2 — THE FAILURE COULD NOT SPEAK
The first cut swallowed every failure into the empty state, under a comment
reading *"the empty state is honest when the read fails."* **It is not.** An
empty state is honest only when it is TRUE. A 404, a 500 and a genuinely empty
board all rendered identically, so the screen told the owner something it did not
know — and when the section first appeared empty at the seal walk, neither the
founder nor the executor could tell which it was.

**This is F-04.110's class, rebuilt by the executor in the same sitting that
cured it.** There, the composer read `message` while the server wrote `error` and
a specific refusal became "Something went wrong." Same disease, different swallow.
Recorded plainly: knowing a lesson and applying it are different acts.

**Cure:** three states, not two — loading · could-not-load · loaded-and-empty.
`getJson` does not throw on a 404 (it returns the envelope), so the `ok` flag is
the ONLY thing that distinguishes "none" from "could not tell".

**STRING — ONE NEW, and a correction to the executor's own proposal.** Proposed
in chat as "Couldn't load assignments."; shipped as **"Could not load
assignments."** to match the estate's own register (`Could not save crew.` /
the founder-vetoed `Could not add. Try again.`). Founder said "go with your
lean"; the correction is declared, not assumed. One word to change.

## PROOF
`assignmentWords.proof` **24/24** (was 16), driving the REAL modules.

**Non-vacuous by PRODUCTION mutation, each reverted:**

| Mutation | Result |
|---|---|
| `hhmm` strips nothing (the drift restored) | **22/2 RED** |
| `hhmm` blanks an unparseable value | **23/1 RED** |
| the failure string collapses into the empty state | **COMPILE-FAIL** |

**The third is disclosed as its own class, not counted as a RED:** `tsc` refuses
the mutation outright, because the literal types stop overlapping. Stronger than
a RED in effect — the change cannot ship at all — but it is a different kind of
evidence and is named as one rather than folded into the count.

One proof assert was widened to `string` for the same reason: `tsc` proves the
two literals cannot overlap and rejects the comparison. It still earns its place
as a regression guard — if anyone ever sets the error constant to the empty-state
sentence, it REDs.

**FLOOR — byte-stable:**

```
pwa: tsc 0 · bands 11/11 · crewCommit 11/11 · rosterMint 22/22
     cityMatch 17/17 · assignmentWords 24/24 (was 16)
dream-os: UNTOUCHED at 44cc167; b0454 19/19 re-run at origin
```

## SCOPE
`app/crew/[token]/page.tsx` is P3's surface (sealed CE-58). Item 1 touches it as
a PURE MOVE — the delete of a local copy in favour of an import. Recorded as a
P3 rider, as D4 was.

**Sequencing beyond this sitting is the founder's.**
