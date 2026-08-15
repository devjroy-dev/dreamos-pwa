# repo: dreamos-pwa · TDW_15 · P1 · ZIP 2 — THE DAYS BECOME A ROOM SHE CAN KEEP

**Seat:** LE (executor) · **Rulings:** CE-34 · R-34.6 → R-34.13 · founder veto 2026-08-15
**Laws:** R-33.1–.9 · D-10 · apply-verbatim · head-guard · shell-boundary · no localStorage · the matrix is the contract
**Base:** `dreamos-pwa 6107ff3` — fresh sibling-full clone, fetch-first, clean.
**Sibling:** `dream-os 0a89a6b` — ZIP 1 banked. **Zero dream-os bytes move in this ZIP.**

---

## 1 · WHAT SHIPPED

| Path | State |
|---|---|
| `lib/frost/eventCopy.ts` | **NEW** — the one home for the write vocabulary |
| `components/frost/blooms/events.tsx` | create · edit · the done ring · remove · `'all'` + the Done section · `+ Ask Mira` |
| `components/frost/blooms/expenses.tsx` | the receipt-photo control (β1's caller) |
| `lib/frost/journey.ts` | `setEventState` · `uploadReceiptImage` |
| `lib/frost-api/muse.ts` | `fileToBase64` exported rather than forked |
| `docs/BRIDE_PARITY_MATRIX.md` | **rows 3, 6, 7, 13 ticked** + two dated amendments |
| `scripts/run-floor.sh` | **F-14.24 cured** + base amended by label |
| `scripts/tdw15_p1_events.proof.mjs` | **NEW** — 38 cells, 7 mutations |
| `scripts/tdw09_frost_parity.proof.mjs` | census amended, 169 → 186 |
| `scripts/tdw13_d6_parity_matrix.proof.mjs` | G-1 cells re-authored; the flattener cured |
| `scripts/tdw14_d4b_delegation.proof.mjs` | the second home of the same ruling |
| `scripts/tdw13_d4_extraction.proof.mjs` | 2a's ruled-edit allowlist + M1's probe |
| `scripts/tdw07_p4b_body.proof.mjs` | §8.10's radius bounded |

**No migration. No localStorage. No soul, prompt or lens byte. `brideTools.js`/`brideEngine.js` untouched.**

---

## 2 · THE MATRIX MOVED, IN THE DOCUMENT, THIS DELIVERY

Rows **3** (`add_event`), **6** (`update_event`), **7** (`delete_event`) and **13** (`save_receipt`) tick in the write column. **G-1 CLOSES. G-3 CLOSES.** Both carry dated, signed amendments, and the D-4b amendment is asserted **still present** rather than replaced — an amendment that erases its predecessor destroys the record of what was true when.

Row 4 (`create_task`) is untouched and stays G-5's, per R-34.5.

---

## 3 · THE ASSIGN SURVIVED, AND THE PROOF CHANGED SHAPE

D-4b's cell asserted `updateEvent` appears in the bloom **exactly once**, because at that delivery one call site and one PATCH body were the same fact. They are not any more: the edit sheet writes through the same door, correctly — a client function named `editEvent` calling the identical endpoint is the `assignEvent` anti-pattern D-4b refused **on this very ruling**.

So the cells read **bodies**: the assign writes `assigned_circle_member_id` and nothing else, the edit sheet writes content fields and never the delegation column, and the state toggle rides `PATCH /:eventId/state` so the count of two stays two **by construction rather than by care**. §4.5 in the delegation bench is byte-unchanged — what D-4b actually shipped is pinned exactly as strictly as before.

---

## 4 · ONE DEFECT, THREE INSTANCES, AND THE THIRD IS LIVE

A naive block-comment stripper reads any slash-then-star as an opener, **including inside string literals and line comments**.

**① MINE — caught, cured, and it cost the census its honesty for one measurement.** The photo control was first written with an accept value of image-slash-wildcard. A comment followed it, the stripper swallowed the receipt list's thumbnail tap and its delete control, and `expenses.tsx` measured **23 → 22** — a *decrease*, on a delivery that only added. Cured with an explicit MIME list (HEIC and HEIF included: an iPhone's own camera writes them). Then the comment *explaining* the trap closed itself early, twice, because it quoted the sequence. Same disease, two more rounds.

**② LATENT — now guarded rather than convicted.** `moments.tsx:279` and `muse.tsx:294` carry the same wildcard and have since long before this sitting. They are harmless **only by luck**: neither file has a comment-close after that line, so the match never completes. The luck is one block comment deep. The first draft of cell 6.1 convicted both — a cell taking pre-existing code hostage, R-33.2's violation. Bounded to this delivery's files, and **§6.1b now asserts the luck still holds**: add a comment below either input and it reds, before the census moves and with the reason already written.

**③ EXPLODING TODAY, UNNOTICED.** `lib/frost/journey.ts:4` is a **line** comment reading *"verified against actual dream-os src/api/couple/&#42; handlers"*. Those two characters open a block comment the stripper closes **eighty-three lines later**. Every comment-stripped read of that file is missing lines 4–87 — the entire import block. Cell 7.2 was green over text that had been eaten and **would have stayed green with the import deleted**. Now read raw and line-anchored, with §7.2b as the control that reds when the strip is fixed upstream.

**Filed for the chair, not taken here:** the stripper is the real cure — `FROST_BLOOMS.md` already files that class as wanting its own micro. **And the unaudited half: other cells across the estate may be green over `journey.ts`'s swallowed region.** This delivery guarded its own and audited nothing else.

---

## 5 · THE FLOOR, AND A RED THAT WAS ALWAYS THERE

```
FLOOR = NAMED BASE, no delta
```

**F-14.24 is cured by derivation, not by a better list.** The glob reached `.proof.mjs`, `.mjs` and `.js`, so the seven `.proof.ts` benches behind their `run-*-proof.sh` wrappers **had never once been executed by this floor**. The wrappers are now found by glob, each verified to name a live `.proof.ts`, with the counterpart guard that every `.proof.ts` is reachable — the disease stated from both sides. They dispatch through `bash`; exit code stays the verdict, which is what makes two runners one floor.

**The base grows by one, and it is not this delivery's red.** `run-assign-words-proof` fails its *"declined is terracotta"* cell **at the untouched tip `6107ff3`** — verified standalone on a pristine clone before any file was copied in. It appears now only because it became runnable now. Entered as base **with its ground stated**, because a base entry nobody can account for is how a real regression gets absorbed. The other six are green, first run.

---

## 6 · THE CONTROL INVENTORY — 169 KEPT · 17 ADDED · 0 MOVED · 0 REMOVED

Counted with the bench's own instrument, never by hand (F-13.12's lesson):

```
events.tsx    5 -> 21   +9 button · +3 input · +1 textarea · +1 select · +2 tapdiv
expenses.tsx 23 -> 24   +1 input (the photo)
SURFACE      169 -> 186
```

Every one itemised in `tdw09_frost_parity`'s amendment. **`docs/FROST_BLOOMS.md` still says 152** — true at its 2026-08-13 derivation, false since D-4b, and stale by seventeen before this delivery added one. Its regeneration is not a UI sitting's to forge by hand; carried forward by name.

**Clause 2 — verbs:** nothing extracted, so no component-identity cell goes blind. **Clause 3 — the real account:** Fixture 1 stands at 3 upcoming / 0 done / 0 delegated and Fixture 2 at 0 receipts, so the walk must **create the state it observes** (§9).

---

## 7 · TWO SEALED BENCHES AMENDED, AND WHY NEITHER IS A SILENCING

**`tdw13_d4_extraction` cell 2a** is a relocation canary. This delivery edits **seven** relocated lines by ruling, so an unamended canary would go red and stay red — and a permanently red cell grades nothing, which retires it. Each of the seven is listed **verbatim with the ruling that moved it**; an eighth still reds. `2a0` refuses a stale exemption, `2a2` proves the exemption is narrow. **M1's probe had to be amended with the cell** — it re-derived the original predicate, read false at the cured tree, and the harness reported M1 **DEAD**, grading nothing. A probe that does not track its cell retires the mutation silently.

**`tdw07_p4b_body` §8.10** means *"no couple surface caps photos at five"* and was written as *"contains the characters slice(0, 5)"*. The edit sheet reads a stored `HH:MM:SS` back with `ev.event_time.slice(0,5)`, and `CANVAS` resolves through `surfaceFiles()` to the whole Sanctuary union — so a five that meant **minutes** convicted a cell about **pictures**. The radius was bounded and the product code left alone; renaming `slice` to please a regex is the anti-pattern this estate has refused twice by name. §8.10b refuses a stale carve-out.

---

## 8 · R-33.1 PAID AGAIN, ON THE DELIVERY THAT QUOTED IT

**Two benches carried the same three G-1 claims.** The read-first censused the parity-matrix bench's copy and stopped; `tdw14_d4b_delegation` asserts the identical ruling from D-4b's side, and **the floor found it, not the census**. A readers census that covers documents but not the cells that pin them is half a census — which is the exact sentence R-33.1 exists for, in a delivery whose read-first quoted it.

Also caught by its own cells: the doc-pin flattener collapsed a **wrapped** quoted sentence into `content > fields`, so any pinned phrase spanning two lines failed on a reflow — the landmine the file's own comment warns against, fallen into by the amendment that quoted the warning. Cured by stripping blockquote markers before the flatten, strictly more permissive, every pre-existing pin unmoved.

---

## 9 · GATES

| gate | result |
|---|---|
| `tdw15_p1_events` | **38/38**, 7 mutations, all biting |
| `tdw13_d6_parity_matrix` | **56/56** sibling-full |
| `tdw14_d4b_delegation` | **137/137** |
| `tdw13_d4_extraction` | **53/53**, M1 biting again |
| `tdw07_p4b_body` | **134/134** |
| `tdw09_frost_parity` | green at the amended census |
| floor, `--check`, clean tree, sibling-full | **`FLOOR = NAMED BASE, no delta`** |
| TSX/TS parse, all five touched source files | clean, no `TS1xxx` |
| invented colour literals | **zero** on both blooms — 6a safe |

**Declared gap, not a green:** full type resolution is unproven here — the founder's build is the settling check. The parse was run per file.

---

## 10 · COPY, AND TWO BYTES I OWE

Every byte is the founder's, approved 2026-08-15, frozen at the character in `lib/frost/eventCopy.ts` and asserted per byte by §1. Line 2 became **`+ Ask Mira`** on his override, **radius A — this button alone**; the other eight sites where the bride meets *Dream Ai* stand untouched and are listed in the delivery message. Lines 11 and 12 are struck: the toggle is an unlabelled ring, the Done head renders only over a non-empty section.

**MY DEFECT, OWNED: `Edit` and `Remove` were never on the veto sheet.** It carried the confirm question and the toast but not the words on the controls that raise them. They ship as the plainest available, one constant each, disclosed in the file's own header and by cell `1.disclosed`. A founder change is one line.

**Unruled, therefore unbuilt:** `expenses.tsx:225` — *"Forward receipt images to Dream Ai on WhatsApp"* — goes half-false now that the room has its own control. Raised at the veto, not answered, ships byte-untouched.

---

## 11 · CARRIED FORWARD

- **The walk card**, authored next from the three pasted fixtures, in the derived order — **each step creates its own precondition**, and **P1.2 leads it**: five bookings, zero payments, a sheet shipped long ago and never once used.
- **The stripper micro** (§4) — three instances now, one of them live in `journey.ts` today.
- **The unaudited half:** cells elsewhere may be green over `journey.ts`'s eaten lines 4–87.
- **`FROST_BLOOMS.md` regeneration** — stale by seventeen before this delivery.
- **`run-assign-words-proof`** — "declined is terracotta", old, now visible, uncured.
- **`fileToBase64`'s siting** — a generic reader in a muse-named file; exported, not moved.
- **F-15.5** stands: the create door rewrites an unknown kind to `other` in silence while the edit door 400s it. Not cured; the sheet's closed list is the client's only defence and §5.2/§5.3 pin it to the server's own allowlist, sibling-full.

**Sequencing beyond this delivery is the founder's.**
