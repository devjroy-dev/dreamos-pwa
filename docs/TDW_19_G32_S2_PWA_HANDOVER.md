# TDW_19 · G3.2 — CONTRACTS & DEPOSITS · SITTING 2 · THE pwa HALF · HANDOVER

**Seat:** CE-40 · G3.2 s2 · LE, code-capable · 2026-09-07.
**Base:** `dreamos-pwa a2e7fe32`, re-derived at the cut. **Sibling `dream-os 6e590ec`** —
packet 2, which landed *under this seat mid-sitting*.
**Floor:** 27 REDs, **set identical to the base**, member by member.
`tsc --noEmit` clean. `b57` **126/126**, up from 89 cells.

---

## 1 · WHAT THE SITTING WAS FOR, AND WHETHER IT DID IT

Four surfaces. All four are built.

| Surface | Frame | State |
|---|---|---|
| The profile sheet | `R4-profile`, Q1–Q10 | **built** — 28 labels, 7 sections, `Save my policies` |
| The clause list | `T1-clauses`, rows 16–29 | **built** — six switches, clause 5 gated, clause 10 without one |
| The annex chooser | `T2-annexes` / `T2-unmapped`, rows 30–35, 42–43 | **built** — from the `annex-map` door |
| What the Client will receive | `T3-preview`, rows 36–41 | **built in part** — see §4(a) |

Plus **F-40.199** (one site), **F-40.170** (the constant retired), **R-40.113** (two failure
bytes vetoed), **R-G32.20** (the policies card draws on every record).

---

## 2 · THE THING THIS SITTING TURNS ON

**The read-first was filed at `a0d127c` and the build ran at `6e590ec`.** Everything the
tailoring surfaces rest on was **re-derived after packet 2 landed**, and it had to be,
because *packet 2 is not what the kickoff's read ladder said it would be*.

The ladder named two response keys to derive from packet 2's diff:
`compose`'s `existing_client` and the refusal `{ code: 'required_missing', fields }`.
**Census at `6e590ec`: zero hits for either, in all of `src/`.** `src/api/vendor/contracts.js`
is not in packet 2's diff at all — packet 2 rebuilt the *renderer*, shipped three TTF faces,
allocated `contracts.number`, and touched no door.

So two of the kickoff's four §2 items had no door to build against, and the answer was not
to guess one. What packet 2 *did* carry, and what this delivery reads out of it:

- **`CLAUSE_SWITCHES`** — six keys, at `contract.terms.clauses.<key>`, read from
  `contractPdf.js:122`. Not agreed in a kickoff; read.
- **`switchOn` is `!== false`** — absent means **ON**. A default of off on this plane would
  make her contract quietly thinner than the surface she reviewed, and *neither side would
  report anything*, because each would be internally consistent.
- **Clause 5's gate** — `terms.functions[<eventId>].city` against `vendors.city`
  (`contractPdf.js:393`). A fact, not a control.
- **Clause 10 has no switch** — `publication` is deliberately absent from `CLAUSE_SWITCHES`
  and `b56` reds on the mutation that adds it.

---

## 3 · WHAT LANDED

### (a) The profile sheet — the largest gap of sitting 1, closed

Twenty-eight labels over twenty-eight **register tokens**, and the two vocabularies are kept
apart on purpose: the tokens are the instrument's (`cancel_tier_2_pct`, `late_interest_pct`,
`fm_window_months`) and **a vendor never meets one**. She meets 「60–90 days before」.

Every key was **read out of `TDW_19_CONTRACT_FIELD_REGISTER_v2.md`**, not invented. The proof
that the shape is the estate's and not this file's is `gst_treatment` / `gst_pct`:
`contractSource.js:118` already reads both off this exact object.

**Q6's four slab labels are generated** from `cancel_tier_1_days` / `_2_days` / `_3_days`
where she has them, and stand on the ratified wording where she does not. TDW authors neither
the numbers nor a policy: 90 / 60 / 30 are the bytes the founder vetoed on the frame.

**The sitting-1 orphan closes.** `GET`/`POST /profile/fields` shipped with no pwa caller and
the API client said so in a comment; that comment is deleted rather than left contradicting
the tree, and `b57 §1` polices both addresses from this cut.

### (b) The clause list

Six switches under 「Yours to choose」, each writing `terms.clauses.<key>` through `PATCH /fill`
— **save on the tap**, optimistic, revert on refusal, and the **door's echo** into state rather
than the object we sent. The storefront switch's posture verbatim.

The caption under each is **hers**: `late_interest_pct` / `late_grace_days` and `overtime_rate`
/ `overtime_unit` out of her profile — the same four tokens the renderer interpolates into
clauses 4.6 and 4.7. **A caption with a missing number is absent, not half-written**: the
renderer omits 4.7 whole when either value is unset, so 「% a month after days」 would describe
a clause that is not going to print.

**Clause 5's row renders only when the gate is open**, and the switch beside it is a *waiver*.
**Clause 10 has no row and no control at all** — not a disabled one, because a greyed switch
beside a consent clause is exactly the misreading row 18 exists to prevent.

### (c) The annex chooser

The seven-name literal at `screen.tsx:60` is **gone** — ruling F8's second home collapsed. The
room asks `annex-map` and branches on the door's **`mapped`**, never on `offered.length`: the
door returns all seven in `offered` for an unmapped vendor too, so a length reads `7` for the
vendor whose trade we know *and* the vendor whose trade we do not.

It renders under the record's own ratified `Annexes` head, so **no navigation byte was invented**.
**Row 39 retires** (founder-ratified): *From your profile — change it here for this couple only*
was true while nothing decided which annexes a vendor was offered; the offer now comes from her
category, so the sentence described a mechanism that does not exist. R-40.104's class, cured the
same way. Rows 35 and 43 stand in its place, each true of the surface it stands under.

**A failed map read draws no annexes.** The room can no longer answer from memory, and that is a
property rather than a cost: a hardcoded fallback would be the third home and would draw seven
annexes for a vendor whose real offer the room had just failed to learn.

### (d) What the Client will receive

The six-row checklist, the Preview, and **Send by absence** (row 41). Each row is derived from
the same place the renderer would read it, so the two cannot disagree about a document nobody
has edited.

**The Send gate widened to all six, on the record as well as on the preview.** Two Sends with
two conditions would be *one act with two opinions*: the record's would appear the moment she
had a number, the preview would say four fields were missing, and whichever she pressed first
would decide which was telling the truth. That is F-40.161's own lesson — a control whose
condition and whose door consult different sources lies about itself — arriving between two
surfaces instead of between a box and a row.

**A refusal sentence only where a ratified byte exists.** The number has P4's line and the
signatory has row 41's. The other four have none, the checklist has already said which row
reads `Not filled`, and **the absence of Send is the refusal**. Four invented sentences would
be four bytes nobody passed.

### (e) The smaller two

- **F-40.199** — `:825` alone. The census found **eight** escape sites, not the charter's six;
  exactly one is outside a literal, template or regex. The other seven are untouched, including
  `:714`'s `.split(' \u2014 ')`, byte-identical to the writer's dash. Corrected to the census
  at c-40.48.
- **F-40.170** — the constant is retired and the hub reads `roomHref('contracts')`.
  **The reason the constant gave for itself was the false part**: it claimed it was needed to
  get `/vendor/contracts` into `b40` C31's declared set, and C31 builds that set from
  `rooms.ts`'s own `href:` values *first*. The address was already declared before the line was
  written. Derived by reading C31, not by assuming.

---

## 4 · WHAT IS OWED — SITTING 3 INHERITS THESE

### (a) `T3-preview`'s two omission lists, and row 37 · **the honest gap of this sitting**

The frame draws three groups. **Two are built and one is not.**

「Needed before you can send」 is built. 「Printed」 and 「Not printed」 are **not**, and the
reason is one fact: the frame's value column for a printed clause is a **page number**
(`Page 1`, `Page 2`, `Page 8`), and row 37 reads 「Nine pages, …」. **The room cannot compute a
page number.** `bufferPages` knows it at render and no door returns it.

The absent halves are derivable (which clauses are switched off, which annexes unattached, why
the tax block is out). The **present** half is not, and a page number the room guessed would be
the fabrication class on a legal instrument's own summary. **Owed: a door that returns the
composed document's page map** — most naturally as a field on `POST /preview`'s response, which
already renders the document and therefore already knows.

### (b) `required_missing`, and the second home this delivery ships

`requiredRows` is **the room's derivation**, not a reader of the door. It is a second home for
a rule the door does not yet carry, rather than a duplicate of one it does — but it is a second
home and it is named here so it is retired rather than accumulated. When
`{ code: 'required_missing', fields }` ships, this reads it and the derivation goes.

**One of the six is not fully derivable client-side today:** the fee is `terms.fee_total` *or*
an invoice's `amount_total`, and the room can only see that `invoice_id` is non-null. It
reports 「From your invoice」 on that branch rather than a figure it has not read.

### (c) F-40.200's picker byte

Still owed. `existing_client` does not exist at `6e590ec`; the byte waits, per the founder's
ruling of this sitting.

### (d) Clause 5's gate is a second home too, and the chair chose that arm

`outstationGate` is the pwa twin of `contractPdf.js:393`. The chair offered two arms and ruled
the second. **The difference between the twins is real and bounded, and it is named in the
code**: the renderer iterates the EVENTS and looks each up by id; the room iterates the TERMS,
because it has no event list. A `terms.functions` entry whose event was deleted counts here and
not there — which can only ever draw a row the document then omits. That is the safe direction;
the opposite mistake would hide a clause she is entitled to.

### (e) Three profile tokens the sheet does not ask for

`cancel_tier_1_days` / `_2_days` / `_3_days` are PROFILE tokens with no row: the ratified frame
has eight rows in that section, not eleven. They are the *inputs* to Q6's generated labels, so
today she reads slabs she cannot move. Also unasked: `same_venue`, `rooms` (R-40.73's two
defaults) and `fee_breakdown`.

### (f) The way into the profile sheet

Reached from the record only. A vendor with no contract cannot open it. Contracts settings is
the natural second door and does not exist.

---

## 5 · WHAT THIS SEAT GOT WRONG

Recorded in full, because in all three cases the pattern is worth more than the instance — and
in all three the thing that caught it was **reading the output rather than the count**.

**1 · A mutation string that appeared twice mutated two sites, and the revert restored one.**
Driving the §8e both-ways proof, `setAnnexes(c.annexes ?? {})` was replaced everywhere; the
revert targeted only the site followed by `setContracts`, leaving `openRecord` calling
`setAnnexes(next)` on a name not in scope. **`tsc` caught it**, which is precisely why R-40.66
keeps `tsc --noEmit` as the seat's sweep. Reversed by reversing the edit (R-40.65); no checkout.
Every mutation after this one asserts its own application **and its uniqueness** before running.

**2 · The first §9a mutation never applied, and reported 126/126.** A whitespace mismatch meant
the replacement silently did nothing, so the bench "passed" a mutation that was never made —
a **hollow green** wearing the costume of a both-ways proof. The assert on the mutation string
is what printed it. Re-driven with the applied mutation proved by census: 125/126.

**3 · `run-floor.sh --delivery` printed ZERO reds, and zero was a STOP.** The manifest declared
six paths and was itself the seventh piece of dirt; the mode refused, correctly, and exited
having printed no set at all. **A zero where the base holds twenty-seven is a run that did not
happen, never a floor that came clean.** The manifest now declares itself and says why.

**And three b57 cells reddened on this seat's own cure** — R-38.19's shape, three times:
- two `CONTRACTS_HREF` cells asserting the spelling F-40.170 retires;
- *the three sentences are three branches*, which **counted across the whole file and meant a
  property of one sheet** — green only while the picker was the room's only three-state
  surface, and five once two siblings gained their own;
- *twenty-eight labels*, the same disease one hour later: `CLAUSE_SWITCHES` shares the
  `{ key, label }` shape, so a file-wide match read 34.

All three are now scoped to the block they mean. **A global count is a guess about the file in
the same way a character window is a guess about formatting** — the lesson this bench already
carried, in a shape it had not recognised.

---

## 6 · THE BOTH-WAYS PROOFS, ALL DRIVEN AT THE TREE

| Mutation | Cells |
|---|---|
| 8a · both `fetchContractProfile` call sites removed | 97/99 |
| 8b · the seven-name literal restored | 96/99 |
| 8c · the annex surface keyed on a length | 97/99 |
| 8d · the profile sheet keyed on `Object.keys().length` | 97/99 |
| 8e · the annex toggle stops reading the door's echo | 98/99 |
| F-40.170 · the constant restored | 98/99 |
| 9a · `publication` joins `CLAUSE_SWITCHES` | 125/126 |
| 9b · the switches default OFF | 125/126 |
| 9c · clause 5's row drawn unconditionally | 125/126 |
| 9d · a disabled Send instead of the line | 124/126 |

Each reverted to full green. Each is a real edit to a shipped file.

---

## 7 · WHAT THE BENCH DOES NOT PROVE

- **That the doors work.** This is a static read of the tree. The founder's card is what turns
  a wired address into a witnessed one.
- **Anything about the rendered pixels.** The ratified frames are the authority and the walk is
  what compares them (R-39.15).
- **That `next build` passes.** That gate is the founder's at apply — this container cannot
  fetch Google Fonts (R-40.66, F-40.134).
- **That the two planes agree about `terms.clauses`.** Both sides say `!== false` and both were
  read at `6e590ec`, but nothing in either repo asserts the other's spelling. A cell that reads
  across the two repos would be the cure and this seat did not build one.
