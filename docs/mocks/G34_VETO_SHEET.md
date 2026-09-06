# G3.4 · PAYMENT REMINDERS — THE VETO SHEET

**Mock:** `docs/mocks/payment-reminders-mock.html` · ten frames · authored at dreamos-pwa `ee746866` / dream-os `ba368ce`, both derived at origin.
**Rulings this sheet stands on:** R-G34.1–.11 · R-40.76 (the template body, already vetoed and filed) · R-40.1 (the room's name, frozen) · R-40.19 (apostrophes) · R-40.60 (no decoration).

**STATUS: RETURNED AND RATIFIED, 2026-09-06** (founder, delegated to the chair, R-40.42). Every byte below is vetoed. #3, #6 and #7 were **amended** at the veto and the amendment is folded in — the table shows what ships, and the amendment note under §A records what it replaced. Nothing else moved. This sheet is now the authority the build reads, not a proposal.

**Two bytes are NOT open here.** #1 is R-40.1's, frozen. The template body is R-40.76's, already vetoed by you and **already filed at Meta** (`tdw_payment_reminder`, ID `1781270206634381`, In review) — changing it now costs a refiling, so it is reproduced at #21 for sight only.

---

## §A · THE ROOM

| # | Where | Proposed | Current |
|---|---|---|---|
| 1 | Room title | **Payment reminders** | *frozen, R-40.1 — not open* |
| 2 | Band 1 head | **Asked** | none |
| 3 | Band 2 head | **Sent** | none |
| 4 | Band 3 head | **Due** | none |
| 5 | Asked row, right | **Asked** + the day | none |
| 6 | Sent row, right | **Sent** + the day | none |
| 7 | Under band 2 | **Sent means WhatsApp accepted it. We cannot tell you whether it was delivered or read.** | none |

**AMENDED AT THE VETO — #3, #6, #7.** The seat proposed **Landed** and argued for it. The founder ruled **Sent**, on the reasoning the seat had not carried far enough: a `wamid` means WhatsApp *accepted* the message, not that it reached her phone, and *Landed* claims the second. #7 was rewritten in the same breath to name both things the estate cannot see — delivered **and** read — where the seat's draft named only the reading. The bands are **Asked · Sent · Due**.

## §B · THE SWITCH

| # | Where | Proposed | Current |
|---|---|---|---|
| 10 | Switch label | **Send the rest automatically** | none |
| 11 | Switch off, under | **Off. You send every reminder yourself.** | none |
| 12 | Switch on, under | **On. After you send the first reminder on an invoice yourself, the rest go out three days before they are due.** | none |

**#12 carries the whole guarantee in one sentence** — *first reminder is always hers, per invoice*, and the switch only releases the rest. That is R-G34's "silence never means yes" made legible to the person it protects, and it is why the sentence is long.

## §C · THE EMPTY STATE

| # | Where | Proposed | Current |
|---|---|---|---|
| 8 | Empty head | **No reminders sent yet** | none |
| 9 | Empty body | **Open an invoice with a payment schedule and send the first reminder yourself. After that, this room keeps the record.** | none |

## §D · THE DARK GATE — the state on the day the ZIP lands

| # | Where | Proposed | Current |
|---|---|---|---|
| 13 | Under the inert switch | **Reminders are not sending yet. WhatsApp is still approving the message. Nothing you set here will go out until they do.** | none |

Frame `P3-dark` is not a failure mode. It is what DEV440 shows on day one, and it stays until Meta returns Active **and** `PAYMENT_REMINDER_SEND_ENABLED` is set. The switch is drawn but inert: arming a control that cannot act is the lying-control class.

## §E · THE INVOICE RECORD

| # | Where | Proposed | Current |
|---|---|---|---|
| 14 | The one new control | **Send the reminder** | none |
| 15 | Confirm sheet title | **Send this reminder?** | none |
| 16 | Confirm sheet, above the words | **This goes to Priya Nair on 98882 94440.** | none |
| 16b | Confirm sheet, below the words | **Your UPI and bank details are on the invoice PDF. Send that with the reminder if she needs them.** | none |
| 17 | The control after the tap | **Reminder sent** + the day | none |
| 18 | Invoice with no schedule | **No schedule on this invoice. Add one and you can send reminders for each milestone.** | none |

**#16b is where the rails ruling becomes visible to the vendor.** Arm (ii) says the template promises nothing it cannot keep; this line is how she learns where the UPI actually lives, at the moment she would otherwise wonder.

**On #17 — the control neither vanishes nor greys.** It states what happened and when, so a vendor reopening the record an hour later is not left guessing whether she pressed it. Once-per-milestone is enforced by `UNIQUE (milestone_id, kind)`, not by this screen; the surface only reports what the database already decided.

## §F · THE SCHEDULE PANEL — new to the veto, and it is the sheet's one surprise

**F-40.141:** `SCHEDULE_ENABLED = false` at `SliceShell.tsx:92` has held the schedule panel and its create sheet dark in production. Its comment guards a 404 against a route that **now exists** (`src/api/vendor/schedules.js`, five routes; `lib/vendor/api/vendor.ts:1273` already points at it). R-G34.10 conditioned the flip on a ratified frame — **derived: there is none.** The only mock in either repo drawing a payment schedule is `invoice-document-mock.html`, and every frame there is an **A4 PDF page**, not the in-app panel. So the panel joins this veto before the byte flips.

| # | Where | Proposed | Current |
|---|---|---|---|
| 19 | Create sheet title | **Payment schedule** | none |
| 20 | Under the milestones | **The shares must add up to 100. Set a due date on each one and reminders can go out three days before.** | none |
| 20b | The create control | **Add a schedule** | none |

The three default milestones (**Booking 30 · Shoot day 40 · Delivery 30**) are the **shipped code's**, at `SliceShell.tsx:379` — not this seat's invention. If you want different defaults, say so and it is a one-line change in the same ZIP.

## §G · WHAT THE CLIENT RECEIVES — for sight, not for veto

| # | | |
|---|---|---|
| 21 | Filed at Meta, R-40.76 | Hi {{1}}, a payment reminder from {{3}}. {{2}} is due on {{4}}. UPI or cash, whichever suits. |

Rendered: *Hi Priya Nair, a payment reminder from Dev Roy Photography. The second instalment of Rs 60,000 is due on 12 September. UPI or cash, whichever suits.*

`{{2}}` is **code-composed** from `milestone_label` + `amount_due` and **begins uppercase** (R-G34.11), so the message and Meta's lowercase review sample never disagree. Leaves from the **bride** number, `+91 70117 88380` (R-G34.2) — a number the client has not saved, which is the whole reason the body says *a payment reminder from* rather than *this is*.

---

## §H · THE SHOT LIST

Ten frames × light and dark × 374 and 390 = **40 captures**, `tools/mock_shot.cjs`. `P10-wa` carries its own two-mode palette and takes the same four.

`P1-room` · `P2-empty` · `P3-dark` · `P4-record` · `P5-confirm` · `P6-sent` · `P7-noschedule` · `P8-schedule-sheet` · `P9-hub` · `P10-wa`

## §I · WHAT IS NOT IN THIS SHEET, AND WHY

- **The five-year couple** (master :110's second half — anniversary → maternity → newborn → first birthday). R-G34.9: its own charter, its own cron, its own recipient (the vendor, not the client), and the master's own **second** Utility template, which does not exist. Not deferred quietly — deferred by ruling.
- **The rails in the message.** Arm (ii), ruled. They print on the invoice PDF (0130's four columns) and ride #16b.
- **A reply keyword** (`PAID`, `DETAILS`). No inbound handler exists on the bride lane; a reply reaches Mira, who knows nothing of payment schedules. Filed to the anniversary-engine charter with arm (i) and body №3.

---

**Return this sheet with the numbers you want changed.** On your word the mock re-cuts, the shots run, and the build opens — dream-os first (0139, the plane, the job, the doors, the template dark), then the pwa.
