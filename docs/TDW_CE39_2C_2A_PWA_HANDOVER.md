# TDW · CE-39 · ROAD STEP 2c · 2a-pwa — HANDOVER

**Base `bb4a9ad` (worklist), re-derived fetch-first at the cut. Sibling dream-os
`4918275` (band 4), whose money door mounts the eleven routes this delivery
addresses.**

**FLOOR = NAMED BASE, no delta** (`run-floor.sh --check`, sibling present).
**`b40` FLOOR GREEN**, 73 cells. **`tdw09_p2b` 29/0** — cured, see §7.
`tsc --noEmit` clean.

---

## 1 · WHAT MOVED

| file | what |
|---|---|
| `lib/vendor/api/vendor.ts` | ten money call sites cross; four dead symbols retire; the six-byte split |
| `app/vendor/list/[slice]/expenses.tsx` | the ELEVENTH site — the inline binder `/hide` door |
| `app/vendor/list/[slice]/invoices.tsx` | `makeDeleteRequest(vendorId)` closure; cancel on the typed path |
| `lib/vendor/types/vendor.ts` | `BooksParticular`; `opening`/`closing`; the `id`-doc amendment |
| `lib/worklist/copy.ts` | six Books bytes, each marked by delegation |
| `components/worklist/BooksBody.tsx` | rebuilt to `B2-months` |
| `docs/mocks/books-register-mock.html` + 8 PNGs | head byte amended, re-shot |
| `scripts/b40_worklist_shell_bench.js` | `C76`–`C79`; the `lineStrip` helper |
| `scripts/tdw09_p2b.proof.mjs` | `3.6` amended (F-39.34) |

## 2 · THE CHARTER PIN, AMENDED  [c-39.34]

**`books-register-mock.html` `bdf83bd466f0` → `e7ac23979fc8`.**

D-1/c4 was ruled AFTER the frames were shot, so the build target and the ruled
copy disagreed at the head. The mock is re-shot rather than annotated: the head
byte is amended in the HTML (both frames), `tools/mock_shot.cjs` re-shot all 8,
and file, frame and ruling now agree. Card step ① — 「the founder says it reads
like the mock」 — has nothing to trip on. Column heads are untouched: `Received`
/ `Paid out` were picked at D-1 and only the HEAD PAIR moved.

## 3 · THE ELEVEN SITES — THE CHARTER SAID FIVE

| site | was | now |
|---|---|---|
| `vendor.ts:269` `fetchInvoices` | `fetchCabinet` + adapter + 2 client reduces | `GET /money/invoices/:v` |
| `vendor.ts:285` `fetchExpenses` | `fetchLedger` + adapter + reduce | `GET /money/expenses/:v` |
| `vendor.ts` `createInvoice` | binder-open + `money-edit` | `POST /money/invoices/:v` |
| `vendor.ts` `updateInvoice` | `/edit` + ledger read + `money-edit` (3 trips) | `PATCH /money/invoices/:v/:id` |
| `vendor.ts` `recordPayment` | ledger read + `money-edit` | `POST /money/invoices/:v/:id/payments` |
| `vendor.ts` `fetchInvoicePdf` | `/vendor/invoices/:id/pdf` (binder id) | `GET /money/invoices/:v/:id/pdf` |
| `vendor.ts` cancel | `/vendor/invoices/:id/cancel` (binder id) | `PATCH /money/invoices/:v/:id/cancel` |
| `vendor.ts` `createExpense` | `binderBase` | `POST /money/expenses/:v` |
| `vendor.ts` `updateExpense` | `/edit` + `money-edit` | `PATCH /money/expenses/:v/:id` |
| `vendor.ts` `deleteExpense` | `binders/:id/hide` | `DELETE /money/expenses/:v/:id` |
| **`expenses.tsx:21`** | `binders/:v/:id/hide`, **inline** | `DELETE /money/expenses/:v/:id` |

**c-2c.6, mine.** The eleventh was missing from my own call-site table because I
derived it from `vendor.ts`'s exports, and `expenses.tsx` builds its URL inline.
Found by parity — `invoices.tsx` gained the `vendorId` closure `expenses.tsx`
already had, and reading the two doors side by side showed one was never crossed.
**The instrument was the export table; the surface was the file.**

**c-2c.5** — the money door mounts **ELEVEN** routes, not eight. `books` and
`pdf` were never counted; three documents said eight.

**Retired with their readers (§8.9):** `binderToInvoice`, `binderToExpense`,
`invoiceState`, and the `moneyBinders`/`pendingOf` import.
**Byte-untouched, and this is the load-bearing half:** `fetchCabinet`,
`fetchLedger`, `binderBase`, `binderToClient`, every Clients caller, and
`components/vendor/Cabinet.tsx:297`. The binder plane is SHARED — a wholesale
retirement takes the Clients room down with it.

**The one shape change:** `invoices.tsx`'s `deleteRequest` becomes a closure over
`vendorId`, because the typed cancel door carries `:vendorId`. That is the exact
shape `expenses.tsx` has carried since TDW_03; the two slices now differ in
nothing but their door.

## 4 · FINDINGS FROM THE CROSSING

**F-2c.p5 — CURED BY THE CROSSING.** `createInvoice` folded `description` /
`due_date` / `notes` into a free-text binder NOTE. That is F-39.23's disease
from the pwa side: prose written into a column another surface must later render.
Each now lands in its own witnessed column — `description`(7), `due_date`(11),
`notes`(14), field parity verified against `CreateInvoiceRequest` before a byte
moved.

**F-2c.p6 — RETIRED.** Three client-side state machines: `createInvoice`,
`updateInvoice` and `recordPayment` each computed `payment_status` from amounts
before posting. The home's positive-list transition is now the only place a
state is decided. `C77` guards it.

**Under F-39.8's cure:** `recordPayment` was a read-modify-write across the
network — it fetched the whole ledger to find one row's figures. The door takes
the amount; the home does the arithmetic, including the `last_payment_at` stamp
no prior writer set.

**F-2c.p7 — OPEN, NOT CURED HERE.** `lib/vendor/api/_base.ts:97` returns
`'Invalid JSON from server.'` — developer prose reachable by a vendor on any
non-JSON failure. The money block cannot surface it: every failure now lands on
a written sentence first (§5). The estate-wide cure — one vendor-safe fallback
in `_base.ts` — is a hygiene item, post-2c.

## 5 · THE SIX BYTES — SPLIT BY TRUTH

The crossing deleted six vendor-facing strings from `vendor.ts`. Ruled:

**KEPT, still true, as `r.error || '<byte>'`:** `'Could not update invoice.'` on
the update path · `'Invoice not found.'` on both paths that can 404 (cancel, pdf).

**RETIRED with the plane:** `'Could not open invoice binder.'` ·
`'Could not set invoice amount.'` · `'Could not update invoice amount.'` · the
second `'Invoice not found.'`, whose path is gone. **A fallback that names a
thing which no longer exists is false copy, and copy law protects true bytes,
not old ones.**

**ONE NEW BYTE, one home, vetoed by delegation 2026-09-01:**
`MONEY_FALLBACK = 'Could not save that — nothing was changed. Try again in a moment.'`
Five callers, one line to change when the founder re-words it.

*Also caught: the `expenses.tsx` edit dropped `successMessage: 'Expense removed.'`
and it was restored. **A plane change is never a copy change.***

## 6 · THE REGISTER

Built to `books-register-mock.html@e7ac23979fc8`, frame `B2-months`. Month groups
with `Opening` / `Closing` per group; the particular on its own row beneath each
movement; the caveat rides the END of that line.

**The surface sums nothing.** `groupsOf` slices and never accumulates: a group's
opening is the previous group's closing, read; its closing is its last row's own
balance cell, read. `C79` fails on any `.reduce(` in the file. F-04.13's tuition
kept rather than repaid.

**Zero verbs, and the guard changed character.** At 2b the room was read-only
partly BY CONSTRUCTION — the composite ids were unusable as addresses because
the rooms keyed on engine binder ids. The rooms are typed now. The ids are
unchanged; **`C78` is the only thing keeping the room read-only**, which is why
it exists and why the file says so at the top.

**Copy, all marked by delegation:** `Total received` (D-1/c4, 2026-09-01) ·
`Outstanding` · `Received` · `Paid out` · `Opening` · `Closing` (D-1, 2026-08-29).

## 7 · F-39.34 — A BENCH RED AT ORIGIN SINCE PHASE 4

`tdw09_p2b` cell `3.6` read:

```js
cell('3.6', src.includes('open_leads_count') && src.includes('photos live'),
  'live counts (founder 「 ok 」) from the standing endpoints');
```

F-39.10 retired the storefront leads figure at Phase 4. `open_leads_count`
survives in `screen.tsx` only at `:192`, inside the comment explaining its own
retirement, so `strip()` removes it and the cell reds. Bisected on `screen.tsx`
alone, this delivery stashed:

| tip | result |
|---|---|
| `79fc1db` | 29 / 0 |
| `f915b55` (Phase 4 — Today reads the feed) | **28 / 1** |
| `08a6dfe` | 28 / 1 |
| `d1f2c80` | 28 / 1 |
| `bb4a9ad` | 28 / 1 |

**Phase 4 retired the figure and left its reader, and the seal went over it.**

Amended here under retire-with-the-reader, count preserved 1:1. The half whose
subject moved is INVERTED rather than loosened — the cell now asserts the figure's
ABSENCE from the rendered surface, which is the stronger guard, because a
storefront that grows the figure back is the defect F-39.10 cured. Absence read
RAW so a re-introduction inside a comment cannot pass as a cure; presence read
STRIPPED so prose cannot stand in for a rendered byte. Both-ways: restore the
figure to the render → RED.

**Filed at the chair's hand. Whether `tdw09_p2b` was in the Phase 4 seat's NAMED
SET is the chair's to derive in band 5, not this seat's.**

## 8 · F-39.13's CURE NOTE — ONE LINE FOR BAND 5

**The shared `strip()` is unsafe for `lib/vendor/api/vendor.ts` BY CONSTRUCTION.**
That file holds 3 `/*` openers against 2 `*/` closers, so the block-comment pass
pairs an opener with a closer hundreds of lines away and swallows live code. The
first cut of `C76` reported 「fetchInvoices is gone from vendor.ts」 — the function
was there; the instrument had eaten it. That is F-39.13 exactly, walked into one
arc after it was filed.

RAW is not the answer either: `C77` then reddened on its own comment, which
describes the `payment_status` arithmetic the crossing removed. A cell that reads
its subject's prose as evidence is F-39.25's mirror.

The cure is `lineStrip` in `b40` — strips LINE comments, leaves block comments
alone. **The corruption comes from the block pass; the false positive comes from
line comments.** Saying which half each solves is the only way it stays fixed.

## 9 · NON-VACUITY

`b40` 73 cells GREEN. Four new cells, four mutation proofs: `C76` (re-point
`fetchExpenses` at `fetchLedger` → RED) · `C77` (restore client-side status →
RED) · `C78` (add an `onClick` to a movement row → RED) · `C79` (drop
`p.category` from the particular → RED). `tdw09_p2b` 3.6 proven both ways.

Three instrument defects caught in my own cells, all recorded at their sites:
`C78` returned `true` where `b40`'s contract wants `null`; and the two halves of
§8.

**s-2c.1**, carried for the companion: `b47` 1.3's `enclosing` derivation uses a
900-char lookbehind for `function <name>`, so a route with an arrow handler
preceded within 900 chars by `generateInvoiceForBinder` would be skipped as the
declared exception. Narrow, not live today.

## 10 · WHAT 2b INHERITS

Studio C2 tabs (arm i, `?state=all`, `/by-wedding`, `owed`→`Unpaid`) · E-1's two
writers · `/vendor/billing` stub · `/vendor/onboarding` into
`INTERIM_VENDOR_LINKS` (**LINKS, not ROOMS** — `C24` counts `href:` fields and
would red on the wrong set) · F-39.26 · the fate list · `base_guard.sh` +
the b40 equality cell · `C58` amended (site list changes; its `isPrestige` sweep
and person-name scrub survive verbatim).

**And its dream-os companion:** `cabinet.js`'s paid/owed slices and the two
engine money GET arms retire — **their readers are gone as of this push.**
`generateInvoiceForBinder` does NOT go dead: `b47` 1.3's declared exception
records three live callers (`vendor-engine/chat.js:422`, `vendorInbound.js:1698`,
`index.js:149`), so F-39.33 stays open on its own terms.
