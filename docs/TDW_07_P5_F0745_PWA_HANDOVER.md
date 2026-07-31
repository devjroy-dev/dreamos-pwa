# TDW_07 P5 — F-07.45 SURFACE ARM (pwa half) · EXECUTOR HANDOVER
**Base:** `dreamos-pwa @ ed6a07c` · **Executor:** Opus-LE · **Date:** 2026-07-31
**Rides:** ZIP 2 of 2. Applies AFTER the `dream-os` ZIP.

---

## 1 · WHAT SHIPPED

| # | File | What |
|---|---|---|
| 1 | `components/frost/EnquirySheet.tsx` | `EnquiryResult` gains `vendor_notified` + `notify_refusal`; both read from the response; the refused-ping warning logged at one home. |
| 2 | `app/(frost)/frost/canvas/discover/page.tsx` | Comment only — records that `r.ok` is now the server's write-fact. |
| 3 | `app/(frost)/frost/canvas/sanctuary/page.tsx` | Comment only — same. |

**Zero copy change.** No user-facing string is added, removed, or altered. Every vetoed
byte (V1–V9) is untouched.

## 2 · PROOF

```
tsc, paired, deps present:  origin ed6a07c  0 errors
                            cured           0 errors
```

## 3 · WHY THE HANDLERS ONLY GAINED COMMENTS

The ruling said "the callers read them." Behaviourally nothing needed to change in the
two `onDone` handlers: they **already** branch on `r.ok`, and the backend arm is what
made that branch meaningful. Before this sitting the door returned `ok: true`
unconditionally, so V6's `Could not send. Try again.` was **unreachable by
construction** — a vetoed string that could never render. It is reachable now, with the
copy byte-identical.

`vendor_notified` is read at **one** home — `EnquirySheet.submit()`, where the response
actually arrives — and logged, not rendered. Two reasons, both stated in-file:

1. **A second reader of the same fact buys nothing.** The handlers receive a typed result;
   re-deriving the ping's fate there would be the duplicate-predicate shape this block has
   already paid for twice (F-07.30, F-07.34).
2. **Rendering it would be NEW COPY.** A visible line telling her the vendor's WhatsApp
   ping was refused is a user-facing string with no veto. Per §0.2 that is reported, not
   invented. If the founder wants it visible, the strings go to the veto slot first.

**If the chair intended a visible surface change, this is the deviation to correct — it is
named here rather than resolved by guessing.**

## 4 · THE ARRIVAL-STATE CELL LIVES IN THE OTHER REPO

Chair-ruled buildable statically; built as `b07_p5_bench` §9.1–§9.3 in `dream-os`,
following the convention `b07_p1_bench.js:349` already established (sibling-tree path,
skip with a named reason when absent). **The F-A handover's claim that this would be a
smuggled cross-repo grep was wrong** — the estate had already settled the honest form.
The cells are **regression guards, not cure proofs**: they pass on both trees, because
the arrival-state layer shipped at `5de3324`. The walk step stays as the affordance
witness.

## 5 · NEXT

Nothing owed on this side. The pwa half of P5 is complete pending the chair's ruling on
F-07.46 (the floor's determinism) and the founder's veto answer on §3 above.
