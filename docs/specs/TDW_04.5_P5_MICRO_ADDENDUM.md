# TDW_04.5 · P5 — HANDOVER ADDENDUM: the closing micro-cycle

**Bases (re-derived fetch-first):** `b73dc64` (dream-os) · `1cfd8fb` (dreamos-pwa)
**Role:** executor (CE-49) · **ONE ZIP, dreamos-pwa only.**

## THE DREAM-OS LINE THAT WASN'T NEEDED — STATED IN THE HEADER AS ORDERED

The charter allowed "possibly one dream-os line for the link read." **Zero were
required, and refusing the obvious one is the point.**

The crew view needed the function behind a payment. The obvious cure was to widen
`GET /team-payments` with an events join. That would have put a **second**
resolution of *"which function does this money belong to"* into the estate —
F-04.104's class, on a money surface, one release after the first resolution
shipped.

The link was already in the by-wedding payload this page fetches **on the same
reload**. So the board's endpoint stays the one home and the crew view asks it.
**dream-os `git status` at delivery: zero changes.** Its floor is byte-stable by
construction, and re-run anyway: `b0455 73 · b0453 71 · b0450 46`.

---

## THE FOUR

| | Cure |
|---|---|
| **F-04.118(a)** | The reachability gate drops its `state` term and the card gains a tap target. Predicate hoisted to `lib/vendor/postAccess.ts` so it can be PROVEN. |
| **F-04.117** | Team page: `Rs 40,000/day` → **`Rs 40,000 per event`**. The founder's word. The assign sheet's bare `₹40,000` stays bare, as ruled. |
| **the plural** | `1 events` → `1 event`, `2 events`, `3 events`. And the line's own noun follows his vocabulary: **`Rs {n} suggested — {d} events at Rs {rate} each`**. |
| **the truth gap** | The crew view now renders the function on the row that has one, and the logged date on the row that doesn't. |

### Why F-04.118(a) is two changes, not one

The defect's mechanism was that **the button had a rule and the card had none**.
Widening the button alone would have left a filled post's card inert while its
own button was live. Both now ask the same function, and §3 of the proof asserts
they cannot diverge across seven post shapes.

**The action row's gate stays on `open`** — you do not mark a closed post filled
again. `View Responses` moved OUT of that gate because it is not an action on the
post; it is a look at the people. `stopPropagation` on both buttons so the card's
handler cannot double-fire.

---

## PROOF

**`postAccess.proof` — 16/16 (new).** Drives the REAL predicate.

**Non-vacuous by PRODUCTION mutation:** restoring the shipped gate
(`&& post.state === 'open'`) → **9/7 RED**, and the seven are exactly the
state-blindness asserts including the founder's own blocked row. Revert → 16/16.

**`settleWords.proof` — 41/41** (was 37; §3 gains four for the vocabulary and the
plural).

| Mutation | Result |
|---|---|
| the plural hardcoded again (`unit = 'events'`) | **39/2 RED** |
| the chair's word restored (`function`/`functions`) | **37/4 RED** |
| revert | **41/41 restored** |

**THE PWA FLOOR — my own run, byte-stable:**

```
tsc --noEmit whole tree: 0
settleWords 41 (was 37) · postAccess 16 (new)
bands 11 · crewCommit 11 · rosterMint 22 · cityMatch 17 · assignmentWords 24
```

**Bench-blind, named:** the card's tap target and the crew view's new line are
JSX render conditions — F-04.105's class. The predicate behind the first is
proven; the *wiring* of both is covered by tsc and the founder's eye. That is the
same gap F-04.118 fell through, and hoisting the predicate is as far as this
sitting closes it.

---

## DISCLOSURES

1. **`View Responses` is now full-width on its own row**, above the action row
   rather than beside `Mark Filled`. On a filled post there is no action row at
   all, so a two-up layout would have left a lone half-width button. **No new
   string; a layout consequence of the ruling.**
2. **The whole card is tappable when it has responses**, so an accidental tap on
   a card opens the responses screen. Judged correct: the screen is read-only and
   the back arrow returns. Ratify-or-revert.
3. **The crew view's linked rows now show the FUNCTION instead of the logged
   date**, not in addition. Two lines would have been the alternative; one line
   matches the By-wedding lane's shape and the row keeps telling one truth.
4. **`daily_rate_inr` keeps its column name.** DB columns are never renamed from
   code; only the screen's word changed, which is exactly what the house law
   permits.

---

## WHAT I DID NOT DO

- **No SQL, no migration, no dream-os change.**
- **F-04.118(b)** — Settle on the Roster tab — **is the roster-provenance
  sitting's**, as chartered. Not started, not stubbed.
- **The initials divergence and the `BY WEDDING` chip's affordance** stay filed to
  Block 09.
- **`mark-paid`'s auto-inserted expenses row** stays as it is, named for a future
  money sitting.
- **No live witness is claimed.** Three frames are owed: a filled post opening ·
  `per event` on the Team page · the crew view naming `ANANYA · RECCE`.

**Sequencing beyond this sitting is the founder's.**
