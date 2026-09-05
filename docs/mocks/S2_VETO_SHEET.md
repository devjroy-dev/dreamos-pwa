# S2 · THE INVOICE DOCUMENT — VETO SHEET · SEALED

**THE PICK (founder, 2026-09-03): SHAPE (ii)** — milestones as a ruled table, the state as
a canted stamp. **Header: city always, address when present.**

| | |
|---|---|
| **Frames of record** | **`S2-addr` (PRIMARY)** · `S2-city` (the no-address case) |
| **Not picked, retained for the record** | `S1-city` `S1-addr` — captioned `NOT PICKED` in the file |
| **State variants** | `S1-paid` `S1-cancelled` — drawn on shape (i); E5/H3 carry to shape (ii) unchanged, no second pick |
| **Every string** | ships **AS PROPOSED** by founder delegation, 2026-09-03, except the rows marked RULED below, which are his own words |

**A charter §2 must name the FRAMES, not only the file** — D-1's tuition, applied here: a
cell reading this file finds six frames and only two of them are the build target. The S2
build charter pins *frames `S2-addr` and `S2-city`*, and `src/lib/invoicePdf.js` at
dream-os `2fc20eb` names them in its own header.

**BUILT AND SHIPPED** at dream-os `2fc20eb`, bench `b51_invoice_document_bench` 57/57 with
four mutations both ways.

**Two document bytes are RULED and NOT YET BUILT** — they ride the next dream-os ZIP, not a
re-cut of `2fc20eb`:
- **the month is `Sep`, never `Sept`.** `Intl('en-IN')` renders `Sept`; that is a locale
  artefact, and the mock's word is the vetoed byte. One home: the estate's date formatter
  renders the three-letter month **by table**, not by Intl.
- **H4, RULED:** `Due` prints on `unpaid` and `advance_paid` only. `paid` and `cancelled`
  print `Issued` alone.

---


**Base** `fdb230b` (dreamos-pwa/worklist, "CE-39 smalls A"), sibling `83d2eb8` (dream-os/main).
The subject lives in the sibling — `src/lib/invoicePdf.js` and `invoicePdfSource` in
`src/lib/vendor/invoices.js`. **Every string in the CURRENT column is the byte at `83d2eb8`,
read out of the generator, not remembered.** Where the current column says *(absent)* the
document does not say the thing at all today.

**How to read this.** One **YES/NO per string**, and one **shape**: (i) milestones inline
and the state as a line, or (ii) milestones as a table and the state as a stamp. Your pick
and your vetoes become the §2 of the S2 build charter as
*match `docs/mocks/invoice-document-mock.html@<hash>`, frames `S1-*`* (or `S2-*`).

**The file.** `docs/mocks/invoice-document-mock.html` — one self-contained A4 page, six
frames, no signal needed. The faces are embedded, so it renders true on your phone.

---

## THE TWO SHAPES AS DRAWN

| Shape | Frames | What it is |
|---|---|---|
| **(i)** | `S1-city` `S1-addr` `S1-paid` `S1-cancelled` | Milestones as ledger lines under an eyebrow; the state word is a **line** above the invoice number. |
| **(ii)** | `S2-city` `S2-addr` | Milestones as a **ruled table** with column heads; the state is a **canted stamp** in its own slot. |

Both header variants are drawn for each shape: `-city` prints `Delhi · GSTIN …`, `-addr`
adds the street line beneath. **The address row is conditional on the column being filled**
— an empty `address` prints nothing, it does not print a gap.

The two **state variants** are drawn on shape (i) only, because they change the same block
in both shapes and drawing them twice would be two pictures of one decision.

---

## 0 · WHAT THE MOCK IS FOR

The fork was settled before it was drawn: **not a longer invoice, a correct one.** Today's
document tells a couple four things that are not true or not there —

- it prints `BOOKING CONFIRMED`, **a literal with no column behind it**, on every invoice
  including a cancelled one, while `state` is selected from the database and thrown away;
- it prints **no paid figure and no balance** unless `amount_advance > 0`, so an invoice
  paid in full through the balance door shows only a total (**F-39.49**);
- when it does print them, the received line reads `amount_advance` while the balance
  subtracts `amount_paid`, so on a scheduled invoice **the two lines contradict each other
  on the same page** (**F-39.49(b)**);
- it renders a live UPI QR **on a cancelled invoice**, and an `am=0` QR on a paid one
  (**F-39.58**).

Eight columns the document needs are not selected at all: `notes`, `has_schedule`,
`created_at` (read), `state` (read), `city`, `gstin`, and the four bank/address columns
that did not exist until migration `0130`.

---

## A · THE HEADER

| # | Current at `83d2eb8` | Proposed | Note | YES / NO |
|---|---|---|---|---|
| A1 | `<business_name>` | unchanged | 22 pt bold, top left | |
| A2 | `TDW` | unchanged | 9 pt, grey, top right | |
| A3 | *(absent)* | **`<city> · GSTIN <gstin>`** | **NEW.** Middle dot separator. Prints the city alone when `gstin` is empty, and neither line when both are | |
| A4 | *(absent)* | **`<address>`** | **NEW.** Its own line, lighter, only when `address` is filled — frames `S1-addr` `S2-addr` | |

---

## B · THE STATE WORD — RULED

**Founder 2026-09-03: the state words are the database's own vocabulary, title-cased. No
synonyms.** The check constraint on `public.invoices.state` is
`unpaid · advance_paid · paid · cancelled`, so the positive list is exactly four and the
document can never print a fifth.

| # | Current | Proposed | Note | Ruling |
|---|---|---|---|---|
| B1 | `BOOKING CONFIRMED` | **retired** | A literal, printed on every invoice regardless of state. It is the finding, not a string to improve | **RULED** |
| B2 | *(absent)* | **`Unpaid`** | | **RULED 2026-09-03** |
| B3 | *(absent)* | **`Advance paid`** | | **RULED 2026-09-03** |
| B4 | *(absent)* | **`Paid`** | | **RULED 2026-09-03** |
| B5 | *(absent)* | **`Cancelled`** | | **RULED 2026-09-03** |

Set in tracked caps at 10 pt in the accent as a line (shape i) or 12 pt boxed and canted
(shape ii). **The word itself is identical in both shapes** — only its dress differs.

---

## C · THE META BLOCK

| # | Current | Proposed | Note | YES / NO |
|---|---|---|---|---|
| C1 | `Invoice No` | **`Invoice`** | Eyebrow above the number rather than a label beside it; the number is 13 pt bold and reads as the document's name | |
| C2 | *(absent)* | **`Issued`** | **NEW.** `created_at`. Selected today and never read | |
| C3 | `Balance due by` | **`Due`** | Paired with `Issued` on one right-aligned stack. The old string carried "balance" into a row that is only a date | |

---

## D · THE PARTIES

| # | Current | Proposed | Note | YES / NO |
|---|---|---|---|---|
| D1 | `Client` | **`Billed to`** | Tracked-caps eyebrow. "Client" is the vendor's word for the couple; the document is addressed *to* them | |
| D2 | *(absent)* | **`<client_phone>`** | **NEW.** Selected today, never printed | |
| D3 | `For` | unchanged | Now an eyebrow rather than an inline label. Still `description`, still first-letter-capitalised | |

---

## E · THE MONEY — the F-39.49 family

| # | Current | Proposed | Note | YES / NO |
|---|---|---|---|---|
| E1 | `Total amount` | unchanged | | |
| E2 | `Booking amount received (40%)` | **`Paid`** | **The cure.** Always printed, never gated; the figure is **`amount_paid`**, which is the one the balance subtracts. The percentage goes with it — a share belongs to a milestone row, not to a running total | |
| E3 | `Balance due` | unchanged | Always printed. Bold, above a hairline, `amount_total − amount_paid` | |
| E4 | — | *(register)* | **`Rs 45,000`** — no ₹ glyph, no `k`/`L`/`Cr`, lining tabular figures. Unchanged law, restated because this is a money surface | |

| # | Current | Proposed | Note | Ruling |
|---|---|---|---|---|
| E5 | *(n/a)* | **`Amount`** — one row, no `Paid`, no `Balance due` | **CANCELLED ONLY.** "Balance due" on a released date is false: nothing is owed and nothing will be. The figure stays as **history**, so the couple can still see what the invoice was for; the `Paid` row goes with the balance, because `Rs 0` under a cancelled amount is noise | **RULED 2026-09-03** |

---

## F · THE SCHEDULE — new, gated on `has_schedule`

| # | Current | Proposed | Note | YES / NO |
|---|---|---|---|---|
| F1 | *(absent)* | **`Payment schedule`** | Eyebrow. The whole block prints only when `has_schedule` is true | |
| F2 | *(absent)* | **`Milestone` `Share` `Due` `Amount` `Status`** | **Shape (ii) only** — the table's column heads. Shape (i) has no heads; the columns are read by alignment | |
| F3 | *(absent)* | **`Pending` · `Paid` · `Waived`** | `payment_schedules.state`'s own three-word vocabulary, title-cased, same law as B | |

---

## G · THE PAYMENT BLOCK — the F-39.58 family

**Gated on payable state.** `unpaid` and `advance_paid` get rails; `paid` and `cancelled`
do not.

| # | Current | Proposed | Note | YES / NO |
|---|---|---|---|---|
| G1 | `Scan to pay balance` | **`Payment`** + **`Scan to pay`** | Eyebrow over the block; the caption under the QR loses "balance", which the amount line beside it already says | |
| G2 | `UPI: devroy@okhdfcbank` | **`UPI` / `devroy@okhdfcbank`** | Label and value in two columns like every other row on the page | |
| G3 | `Amount: Rs 45,000` | **`Amount` / `Rs 45,000`** | Same. Still the balance due | |
| G4 | *(absent)* | **`Bank transfer`** | **NEW.** Sub-eyebrow. Whole block prints only when `account_number` is filled | |
| G5 | *(absent)* | **`Account name` `Account no.` `IFSC`** | **NEW.** Migration `0130`'s columns | |
| G6 | *(absent)* | **`Paid in full — nothing further is due.`** | **NEW.** Stands where the QR stood on a `paid` invoice | |
| G7 | *(absent)* | **`This invoice has been cancelled. Nothing is payable on it.`** | **NEW.** Founder 2026-09-03: on `cancelled` the block is **stripped** — no UPI string, no QR, no account number anywhere in the file | **RULED** |

---

## H · NOTES AND FOOT

| # | Current | Proposed | Note | YES / NO |
|---|---|---|---|---|
| H1 | *(absent)* | **`Notes`** + `<notes>` | **NEW.** Column 14, never selected today. Prints only when filled | |
| H2 | `Thank you for your booking. We look forward to being part of your celebration.` | **`Thank you — we look forward to being part of your celebration.`** | "for your booking" is dropped: it is the same assumption `BOOKING CONFIRMED` made, and it is wrong on an unpaid and false on a cancelled invoice | |

| H3 | *(n/a)* | **`<business_name>`** | **CANCELLED ONLY.** The celebration line is **struck**. The rule and the footer's position do not move, so the page keeps its shape; the line reads the business name alone | **RULED 2026-09-03** |

| H4 | `Due <date>` on every state | **`Due` on `unpaid` and `advance_paid` only** | **RULED 2026-09-03.** It was the same falsehood E5 retired, one row higher: nothing is due on a settled or released invoice. `paid` and `cancelled` print `Issued` alone. **Not yet built — rides the next dream-os ZIP** | **RULED** |
| H5 | *(absent)* | **`TDW-verified`** + **`<N> weddings · delivers in <D> days`** | **NEW — G2, R-G2.8.** Added by a labelled amendment 2026-09-05, nothing above this line edited. Frame **`S3-seal`**, which is `S2-addr` verbatim plus this one element. **Above the foot rule, inside the same foot block**, so the page adds no height below it — the 40pt clearance is what stopped pdfkit opening a second page. **Grey, not gold:** the accent is spent on the state stamp and the stamp must stay the first word read. **No rating segment** (R-G2.2 — no source exists until GBP). **No `Rs` on the seal, ever.** Prints only at three or more delivered weddings; under three the block does not render at all | |

---

## I · TWO THINGS THAT ARE NOT STRINGS

**I1 · THE FACE — RULED 2026-09-03.** PDFKit prints in **Helvetica**, its built-in. The mock
is drawn in **TeX Gyre Heros**, Helvetica's metric twin, embedded — so what you are looking
at is the width and colour the real PDF will have, not a flattering substitute. That is
**the honest choice for this pick**. TDW's own faces on the document (`doc.registerFont` +
a font file shipped in `dream-os`) is a real change and **its own small sitting, post-smalls
— filed as F-39.61.**

**I2 · COLOUR BY STATE — RULED: NO.** The document uses the generator's existing five
colours and the state word is in the warm gold in all four states, `Cancelled` included.
Meaning is carried by position and weight, not hue. A red for cancelled and a green for paid
would be two new colours in a palette that has neither.

---

## J · WHAT THE MOCK CANNOT SETTLE

The mock is a drawing of a page, so it proves layout, register and vocabulary. It does not
prove that the page is reachable, that `invoicePdfSource` selects the eight new columns, or
that the QR disappears on a real cancelled row. Those are the build's cells, listed in the
charter, and the founder card's steps ③ and ④ are where the real PDF answers for itself.
