# TDW_07 · F-07.70 / F-07.73 — V2 PACKET (executor)

REPO: devjroy-dev/dreamos-pwa
BASE COMMIT: 63c60c2 (the deployed v1 tree, re-derived at origin by `git fetch`)
SCOPE: one production file + one proof. No soul bytes. No new copy.

---

## 1 · WHY THERE IS A V2

The founder walk of the v1 packet returned **step 4 RED**. Steps 1, 2, 3, 5, 6, 7, 8 green.

Step 4: from the virtual end slot, swipe-down did not return the bride to the last
card. Her only exit was the SANCTUARY chrome at top-left.

**Root cause, derived by command.** The end-state branch at `page.tsx:1649` is an
EARLY RETURN with its own `<div>`. The deck's `onTouchStart`/`onTouchEnd` are
attached at the MAIN return below it. The end slot therefore mounted no gesture at
all. `goPrevV` was never unreachable — it was never CALLED.

**This is the executor's defect, shipped under a green bench.**

## 2 · THE CELL THAT PASSED OVER IT

`§8.5` asserted `goPrevV`'s BODY:

    /const goPrevV=React\.useCallback\(\(\)=>\{\s*\n\s*if\(vIdx<=0\)return;/

True at the shipped tree. Still true. And it certified a gesture that did not
exist, because the function it examined had no caller on the surface in question.

CE-119's inked law — **a true cell aimed one surface over** — with the executor as
its author, written hours after quoting the law in this same packet's read-first.
The in-comment reasoning ("goPrevV needs nothing") checked the function and never
checked the mount.

**Proven in the harness, not argued.** Mutation M-21 restores the exact byte-state
the founder walked. Under it:

    FAIL §8.5a REACHABILITY — the end-state mount carries a touch-end handler
    ok   §8.5c (supporting) goPrevV remains unguarded against the slot

The retired assertion stays GREEN under the very defect it failed to catch. A
mutation that leaves a cell green is evidence about the cell.

## 3 · THE CURE

A **dedicated** handler pair on the end-state mount — not the deck's handler reused.

Reuse would have cured the swipe and minted two new defects on the same surface:
the deck handler also routes TAPS (`:1529` → `setPanelOpen(true)`, a vendor panel
opened over no vendor) and HORIZONTAL swipes (`nextImg`/`prevImg` into a pager
holding no photos). The new handler answers exactly one gesture — downward swipe —
and is deliberately deaf to the rest.

Swipe-UP is ignored on purpose: there is nothing after the end slot, and a silent
no-op is the honest answer to a request the deck cannot satisfy.

`touchAction:'none'` joins the handlers on that div. Without it the downward drag
is eligible to be consumed as a scroll/pull gesture before the handler sees it —
the same silence through a second mechanism. Both are now closed.

Thresholds are the deck's own (`SWIPE_THRESHOLD`/`SWIPE_VELOCITY`): one wrist
motion for the whole journey, not a second gesture language at the end of it.

Safety on every path through the branch: `goPrevV` is already clamped at
`vIdx<=0`, so on the genuinely-empty and empty-filter arms this is a no-op **by
the callee's own guard**, not by a condition duplicated at the call site.

## 4 · THE PROOF DELTA

`scripts/tdw_f0770_authority.proof.mjs` — **92 → 101 cells**, mutations **20 → 24**.

| cell | asserts |
|---|---|
| §8.5a | REACHABILITY — handler mounted on the end-state div |
| §8.5b | the mounted handler routes downward swipe to `goPrevV` |
| §8.5c | (supporting, demoted) `goPrevV` unguarded against the slot |
| §8.5d | the slot is deaf to tap / photo routes it cannot honour |
| §8.5e | gesture parity — deck thresholds reused |
| §8.5f | `touchAction:'none'` — the drag is not consumed first |

| mutation | turns red |
|---|---|
| M-21 | THE WALK-WITNESSED DEFECT reproduced — §8.5a/§8.5b |
| M-22 | swipe inverted — §8.5b |
| M-23 | drag scroll-eligible again — §8.5a/§8.5f |
| M-24 | slot given a route it cannot honour — §8.5d |

**A SECOND EXECUTOR MISS, DISCLOSED.** §8.5d first shipped as a regex with a
900-character lookahead and FAILED on the cured tree — the window ran past the
handler's closing brace into unrelated code that legitimately mentions
`setPanelOpen`. A cell whose boundary is a guessed character count reports on
whatever happens to sit nearby. The end-handler cells now assert against a slice
derived to the closing brace (`END_HANDLER`), true of the handler AND ONLY the
handler. If it is ever deleted the slice is empty and the presence cells fail
rather than silently pass.

## 5 · WHAT IS NOT IN THIS PACKET

- **The 1600ms bounce delay is UNCHANGED.** Still the executor's disclosed call,
  still awaiting founder ratification. No byte moved on an unruled question.
- **F-07.81** (mount-only auth guard — no `storage` listener, so a lane crossover
  written by another tab under an already-open Sanctuary is never caught) is
  minted and NOT built here. Scope uncensused; may not be a one-file micro.
- **F-07.80** (markdown rendered literally in both chat surfaces) untouched —
  prompt-side cure is soul bytes under founder veto.
- No soul bytes. No copy. W-1 intact.

## 6 · FLOOR — WHOLE, GREEN, ON THE CURED TREE

    tsc                                ZERO
    tdw06_f06133_drawer                41/41
    tdw06_m3_report_chip               GREEN
    tdw07_f0760_claim                  76/76
    tdw07_f0766_orphan                 21/21
    tdw07_p1_discover                  35/35
    tdw07_p2_profile                   42/42
    tdw07_p3_portfolio               111/111
    tdw07_p4a_ig                       63/63
    tdw07_p4b_body                   125/125
    tdw07_p4b_probe                    27/27
    tdw07_p4b_slice1                   24/24
    tdw07_p6_fold                      60/60
    tdw_auth_crossover                 30/30
    tdw_f0770_authority              101/101   (24/24 mutations RED)

## 7 · WALK LEDGER AT V1 (for the record)

| step | result |
|---|---|
| 1 Sanctuary loads | green |
| 2 Meridian sends | green (after F-07.78 constraint widen — first time in production) |
| 3 end slot reachable | green |
| 4 swipe back from slot | **RED — cured by this packet** |
| 5 filtered deck end | green |
| 6 empty-filter arm | green |
| 7 crossed device | green BOTH ARMS — refused on crossover, admitted on clean slot with vendor blob still present |
| 8 bride returns | green |

Step 7 is the micro's charter and it was witnessed in production, both arms, same
browser, same session: `CROSSOVER_CONDITION true` → bounce to landing;
`CROSSOVER_CONDITION false` with `vendor_blob_present true` → Sanctuary normal.
The refusal discriminates on the crossover, not on the presence of a vendor
session.

## 8 · FOUNDER CARD (v2)

1. Apply the ZIP (§7 chain), confirm the verify chain ends on its STOP sentence.
2. Push. Wait for Vercel.
3. Open Discover, walk the deck to **That's everyone, for now.**
4. **Swipe down.** You land on the last vendor card. (This is the step that failed.)
5. Filter to something with results, walk it to the end, swipe down — same.
6. Filter to nothing → **Nothing matches those filters yet.** + CLEAR FILTERS.
   Tap CLEAR FILTERS; it still works (the new handler ignores taps).
