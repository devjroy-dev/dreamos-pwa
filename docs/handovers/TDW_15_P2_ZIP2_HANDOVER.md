# repo: dreamos-pwa · TDW_15 · P2 · ZIP 2 — THE ENVELOPE ROOM

Authored by the executor seat under CE-35, 2026-08-18.
Base tip: `c6e631d` (fetch-first at origin, clean at seating).
Sibling: `dream-os 7afdbcc` (sibling-full clone; three pwa benches refuse without it).
Repo: `devjroy-dev/dreamos-pwa`.

---

## 1 · WHAT THIS ZIP IS

The pwa half of P2 — Envelopes (R-4). Nine files: two new library homes, the
room, the client, three amended benches, one new bench, and the matrix.

| file | state |
|---|---|
| `lib/frost/categoryLabels.ts` | **NEW** — the eleven's one home, a MOVE |
| `lib/frost/envelopeCopy.ts` | **NEW** — nine founder-vetoed bytes, closed set |
| `scripts/tdw15_p2_envelopes.proof.mjs` | **NEW** — 41 cells, 10 mutations |
| `components/frost/blooms/expenses.tsx` | MODIFIED — the fourth slice |
| `lib/frost/journey.ts` | MODIFIED — the ENVELOPES section, the tag, the census |
| `app/vendor/onboarding/page.tsx` | MODIFIED — the map leaves; the import arrives |
| `scripts/obp_vendor_form.proof.mjs` | MODIFIED — R-34.52 |
| `scripts/tdw09_frost_parity.proof.mjs` | MODIFIED — R-34.53 + R-35.11 |
| `scripts/tdw13_d4_extraction.proof.mjs` | MODIFIED — R-34.54 |
| `docs/BRIDE_PARITY_MATRIX.md` | MODIFIED — the amendment, dated and signed |

**ZERO dream-os bytes.** `brideTools.js`, `brideEngine.js`, `miraSoul.js`: zero
lines (R-34.15, R-31.2, W-1 shut). No SQL, no migration — `0088` was applied at
ZIP 1 and this half is client-only.

---

## 2 · THE MOVE, AND WHY THE BENCH GOT STRONGER RATHER THAN QUIETER

`CAT_LABEL` (`:58-:70`) and `labelFor` (`:75-:76`) left
`app/vendor/onboarding/page.tsx` for `lib/frost/categoryLabels.ts`, **byte for
byte**. Not one of the eleven was re-cased, re-ordered or re-punctuated. They are
FOUNDER-SIGNED, 2026-08-13, and the new file's header carries the refusal story
so the next hand meets it before it meets the strings.

**Only `labelFor` is imported by the form.** `CAT_LABEL` has no reader there, and
importing it for symmetry would have been dead interface ink — F-15.13's exact
class, on the delivery that filed F-15.13.

Cells **1.5** and **5.1** asserted those bytes *inside* the form, so the move
alone would have reddened them — a cell going red because a cure landed is
F-15.12's disease, not a defect caught. Amended under R-34.52 to the INVARIANT:
declared at the new home · imported by the page · rendered through `labelFor`.
**Strictly stronger** — the originals could not tell a present map from a wired
one. Two new cells carry the seam: **5.1a** (the form is WIRED, not merely
coexisting) and **5.1b** (the map really LEFT — a duplicate left behind is what
a MOVE can hide).

**1.2 is untouched, per ruling, and here is the honest note it is owed:** after
the move it asserts an absence that is trivially true, since `CAT_LABEL` is no
longer in the form at all. That weakening is real. It is a later sitting's ruled
edit — a ninth-entry class — not this delivery's to take.

---

## 3 · THE ROOM — R-35.4's FOURTH SLICE

`type ExpenseSlice = 'my'|'vendor'|'receipts'|'env'`. That single line is
**R-34.54's earned allowlist entry**, verified present in the pre-extraction
corpus at `b1448c4` (expenses span `[254,546]`, relative line 5) before it was
honoured. Seven → eight. **A ninth still reds.**

**THE DOUBLE APPEARANCE IS BY DESIGN AND IS NAMED IN-FILE.** `myExpenses` and
`imageReceipts` partition `couple_receipts` on `image_url`; the tray partitions
the same table on `envelope_id IS NULL`. The axes cross, so an unfiled receipt
renders twice: vault ink in its own slice, filing candidate in the tray. Same
row, two honest roles. **No row leaves any existing slice.**

**The snapshot strip does not render for `env`**, and that is a copy ruling
rather than a design shortcut: every other snapshot carries a label, and the copy
set is closed at nine. It is also the honest choice — `spent` is a floor and not
a total, so one aggregate figure at the top of this room would read as a total
and be wrong by every untyped receipt.

### 3a · THE GATE IS A WRAPPER, AND THE CANARY IS WHY

The first draft gated the snapshot by editing its container line and its comment.
`tdw13_d4_extraction` cell **2a** convicted it: two relocated lines EATEN, which
would have wanted an unruled eighth allowlist entry for a presentational gate.
Cured by **wrapping** — two new lines, both original bytes intact, allowlist
untouched. The canary caught a real thing on the delivery that amended it.

The same run's cell **6a** convicted an invented colour (`#B5544A` on the delete
confirm's Remove). Replaced with the bytes the receipt delete confirm already
uses. **Zero colour literals were minted by this delivery**, and cell 5.4 proves
it by deriving the base hex set from `git show c6e631d` rather than from a list.

---

## 4 · THE HAIRLINE, AND THE SILENCE THAT IS NOT AN OMISSION

`inkSoft` below the threshold, `ac` at full strength above, rail stays `line`
(R-34.29). **No new token.** `ac` is the room's LIVE accent (`expenses.tsx:37`),
never the destructured `accent` prop, which has zero readers — **R-35.2's
ruling, and F-15.13 is the register entry for the dead prop.** It ships
byte-untouched.

**THE 90% SIGNAL IS WORDLESS, AND THE MECHANISM IS WHY IT HAS TO BE** (F-06.85's
law applied). `spent` is a COALESCE sum over TYPED amounts on FILED receipts. A
receipt can be FILED and UNTYPED — no OCR exists on any plane — so it contributes
zero and the figure is an honest FLOOR. A percentage label would claim a
precision the number does not have; a hue does not. **A zero ceiling renders the
rail and no fill**: there is no ratio to draw, and a full bar over a ceiling she
has not set would invent alarm.

---

## 5 · PRESS, NEVER DRAG — AND THE TAP THAT DID NOT MOVE

Press-to-file (R-34.28, R-35.5). HTML5 DnD does not fire on touch; the bride
plane is a phone. The affordance is a **new control on receipt rows wherever
receipts render** — the `my` slice, the `receipts` slice, and the tray — opening
a scrim-and-bottom-sheet picker, the surface's own idiom, **third use**.

`expenses.tsx`'s `my` row tap (`onClick={()=>setConfirmId(r.id)}`) ships
**BYTE-UNTOUCHED with its meaning unchanged**, accounted KEPT. The file control
sits inside that row and **stops the event** rather than sharing it — a file
gesture that also armed a delete would be the worst control on the surface. Cell
6.2 convicts the propagating form; cell 6.3 convicts any edit to the tap.

### 5a · THE DECLARED GAP

**There is no unfile control in this delivery.** The server accepts
`envelope_id: null` as a legal body — that is unfiling by her hand — and
`fileReceipt` takes `string | null` so the client needs no change when that
control is chartered. **Nothing calls it with null**, and cell 6.4 reds if
anything starts to. Re-filing into another envelope is the misfile cure this ZIP
ships. The gap is declared, not hidden behind a narrower type.

---

## 6 · TWO CARRIED NOTES

**(a) THE HEADINGS FORK — RAISED, NOT AUTHORED.** The `env` slice renders two
collections — her envelopes, then the tray — with **no section headings**,
separated by a rule line. Headings would be bytes ten and eleven of a copy set
the chair closed at nine, and P1's owned defect was authoring `Edit` and `Remove`
in the build and owing them afterwards. Chair's word on the record: two small
section labels, one line each, are the founder's whenever he wants them.

**(b) THE WORD `envelope` COLLIDES IN THIS REPO.** It has five committed
HTTP-sense readers — `lib/frost-api/_base.ts:273-276` calls a response body an
envelope, and two vendor pages comment about it. **No cell in the new bench greps
the bare word** (R-33.3): every pattern anchors on `envelope_id`,
`budget_envelopes`, `BudgetEnvelope`, `ENVELOPE_COPY`, `categoryLabels`, or a
door path. A naive pattern false-positives in both directions.

---

## 7 · THE FIVE RIDING AMENDMENTS, EACH LABELLED

- **R-34.52** — `obp_vendor_form` 1.5 + 5.1 to the invariant; 5.1a/5.1b added;
  1.2 untouched with its weakening recorded above. **66/0.**
- **R-34.53** — `tdw09_frost_parity` 3.1/3.2 re-baselined **186 → 201**, itemised
  control-by-control below. **The figure was ratified by the chair against the
  itemisation, never pre-approved.**
- **R-34.54** — `tdw13_d4_extraction`'s allowlist seven → eight, the
  `ExpenseSlice` line, corpus-verified first. **53/0.**
- **F-14.26** — declared, §9.
- **R-35.11** — `GLYPH_EXEMPT` 10 → 12, the two sheet ✕ closers named, with the
  doctrine sentence in the label: **the cell pinned a count of exempt sites, not
  the invariant, and convicted a third sheet built in the estate's own idiom.**
  Re-pointing 6.12 at the invariant is strictly stronger and is **banked to
  M-CELLSWEEP as that family's third named instance.** A thirteenth still reds.

---

## 8 · THE CONTROL INVENTORY — 186 KEPT · 15 ADDED · 0 MOVED · 0 REMOVED

`expenses.tsx` **24 → 39**; surface **186 → 201**. Counted by the parity bench's
own line-filter `decomment`, **never** `scripts/lib/stripComments.mjs`, which
leaks on this file: `expenses.tsx:240`'s comment quotes an input tag inside
backticks and the shared stripper reads **25** where the sealed instrument reads
**24**.

**+10 button** — the file affordance (one in source, three render sites) · `+ Add`
· the envelope row ✕ · the new-envelope sheet ✕ · a picker option (one in source,
one per server token) · the create action · the file sheet ✕ · an envelope row in
the file sheet · `Remove` · `Keep`.
**+2 input** — the name field · the amount-set-aside field.
**+3 tapdiv** — three dismiss scrims.

**Two non-movements, stated so they are not misread as oversights:** `SliceBtn`
renders a fourth tab and adds nothing (one `<button` in source; this census counts
source lines, not renders); and `:349`'s tap is unchanged, per §5.

**CE-115 clause 3** — the walk observes state a real account creates. The fixture
SELECT ships in this delivery, placeholder-free; **the walk card is authored from
the founder's pasted rows, never before them** (fixture-state law).

---

## 9 · F-14.26 — DECLARED, NOT RESOLVED

**The pwa floor cannot honestly floor a delivery tree.** `scripts/run-floor.sh`
reads `$1` at `:136` and accepts `--check` only; **there is no `--delivery` arm**.
The dream-os runner has one — ZIP 1 used it — and this one does not.

Run on the delivery tree, the floor reports its own dirt NOTE listing all ten
delivery paths, and **`tdw_f0774_vacuity_probe` reds — by derivation, not by
guess**: it is one of two benches the runner finds via
`grep -l 'git status --porcelain'` and runs FIRST, and its guard at `:64-70`
STOPs on a dirty tree because it writes to production source and cannot prove its
restore was clean. The runner's own header already records that this probe is
**NOT base**. It is not a regression and it is not this delivery's red; it is the
delivery's own uncommitted files, seen by a runner with no way to be told about
them.

**BASE REDS, NAMED (6):** `run-assign-words-proof` · `tdw08_p5_prospects_console`
· `tdw10_p3_deck` · `tdw_auth_crossover` · `tdw_f0770_authority` ·
`tdw_f0774_stripper`.

**DELIVERY FILES, DECLARED (10):** the ten paths in §1.

**THE SEAT DOES NOT RESOLVE IT.** A `--delivery` mode for this runner is
F-14.26's schema micro, already queued.

**AND THE HONEST FLOOR-AFTER, LABELLED AS SUCH.** To produce evidence rather than
a declaration, the floor was re-run against a **LOCAL HARNESS COMMIT made inside
the executor container and NEVER PUSHED** — it exists only to give the runner a
clean tree, and LE containers hold no write credentials by design. On that tree:

```
FLOOR = NAMED BASE, no delta
```

Six reds, matched by name. **The founder's own floor, after he applies and
commits this ZIP, is the settling one**, and it should read the same.

---

## 10 · GATES

- `npx tsc --noEmit` at a full `npm ci` install: **0 errors**. No file was
  deleted, so the cleared-cache clause does not fire. **The founder's build is
  the settling type check and it is HIS.**
- `tdw15_p2_envelopes` **41 passed, 0 failed · 10 mutations, 10 bit, 0 dead.**
  Every mutation breaks PRODUCTION code, every anchor verified unique in the
  FINAL tree (R-33.4), every file sha256-restored, and **every red claimed from
  the run's own output, never a grep over it** (R-33.10).
- Sealed benches re-run: `obp_vendor_form` 66/0 · `tdw13_d4_extraction` 53/0 ·
  `tdw15_p1_events` 38/0 · `tdw13_d6_parity_matrix` 56/0 ·
  `tdw09_frost_parity` **green, 86 cells**.
- Floor before and after per §9.

### 10a · THE BENCH CAUGHT ITSELF TWICE, AND BOTH CURES CARRY THEIR FAILURE

**Cell 5.4** first hand-listed the room's colours and convicted **six gradient
hexes that predate D-4** — a cell taking pre-existing code hostage (R-33.2), by
exactly the method the independent-method law forbids: an allowlist written from
a window instead of from the tree. It now derives the base set by `git show`.

**Cell 7.1** navigated by section headers *through a stripper that deletes line
comments*, got `-1`, and reported the receipt write path misplaced when it sat
exactly where R-35.7 put it. It now reads raw text. **A cell that deletes the
landmark it navigates by measures nothing**, and that sentence is in the file.

---

## 11 · WHAT IS NOT HERE, AND WHY

- **The WhatsApp/tool arm.** No `set_envelope`, no envelope param on the filing
  tools. Zero lines in the three fenced files; Row 9's seat owns it. The schema
  is additive-only so it lands without a migration.
- **F-15.10's cure.** Not P2's (R-34.32). `couple_bookings_category_check` still
  carries the pre-0123 eleven; an envelope named Jewellery cannot match a booking
  today. **The `/envelopes/categories` door is not that cure** and says so in
  three places.
- **Drag-to-file.** Deferred, chartered separately (R-34.28).
- **The unfile control.** §5a.
- **Section headings for the env slice.** §6(a).
- **6.12 re-pointed at its invariant.** Banked to M-CELLSWEEP (R-35.11).

---

## 12 · CARRIED FORWARD

- **F-15.13** (dead `accent` prop on a live bloom) — untouched, register entry.
- **F-15.12's family** — third named instance minted here; M-CELLSWEEP owns it.
- **`obp_vendor_form` 1.2's post-MOVE weakening** — recorded, unacted.
- **`FROST_BLOOMS.md` is now stale by forty-nine** (says 152; the surface is
  201). It was already stale by seventeen before P1 added one. Carried by name;
  its regeneration is not a UI sitting's to forge by hand.
- **The headings fork** — the founder's, whenever he wants it.
