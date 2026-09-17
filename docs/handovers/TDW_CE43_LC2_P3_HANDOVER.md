# repo: dreamos-pwa @ 49b1a44cd42ef30fec5819f2ab5b8de380095ff9
# TDW · CE-43 · SEAT LC-2r · PACKET 3 · HANDOVER (the dreamos-pwa packet) · 2026-09-17

Cut on dreamos-pwa `49b1a44cd42ef30fec5819f2ab5b8de380095ff9` (P2b), re-derived at origin at the moment of cutting.

- **Depends on the dream-os half.** It stands on dream-os packet 3 (`ff25992e`) and packet 3b (F-43.86's cure), at origin as `c2c9c91d0ca7b2f1ee6b39adc48d6bddd0acea75` (parent `ff25992`), re-derived by `git fetch` before this cut: its changed set equals the 3b manifest (7 files) and every file is byte-identical to the 3b ZIP (R-38.16).
- **Where the rest lives.** The contract, the rulings and the veto record (Appendix) are in dream-os `docs/handovers/TDW_CE43_LC2_P3_HANDOVER.md` and `TDW_CE43_LC2_P3B_HANDOVER.md`.
- **Rung and findings.** Rung b82. No new finding.
- **Status.** Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §1 · What shipped

| File | What |
|---|---|
| `components/vendor/packages/BookingSheet.tsx` | NEW. The booking sheet (A12). Both openers use it. The act is `promoteLead`. A9 by code, F29 otherwise, A13 on success with the five slices refreshed. Cancel outlined in the muted ink. |
| `components/vendor/packages/LeadPackageCard.tsx` | A2's `Booking confirmed` and `Advance paid` appear under an attached package on a lead that is not booked; they hand their kind to the shell. The attach sheet's Cancel is outlined (C-43.16). |
| `components/vendor/packages/PackageEditSheet.tsx` | The edit sheet's Cancel is outlined in the muted ink (C-43.16; P2b Report 1). |
| `components/vendor/slices/SliceShell.tsx` | See the list below the table. |
| `components/vendor/slices/SliceRow.tsx` | `Row.isPackage`. |
| `components/vendor/ClientBookingSheet.tsx` | Live on `POST /clients/direct`. F28(b): `Advance received` is a switch, and `Received on` shows only on yes. C4, C5 or F29. Fields are flagged with the packet 2 byte. |
| `app/vendor/(shell)/clients/body.tsx` | The sheet's `onDone` refetches the cabinet. |
| `app/vendor/(shell)/invoices/body.tsx` | The row carries `isPackage` off `lead_package_id` (F-43.86 (a1)). |
| `lib/worklist/packages.ts` | A2's booking bytes, `BOOKING` (A12, A13, F29), C4, C5, `paymentMarked` (D3/D4) and `istDateOf`. The header cites the veto record in the tree (F-43.84); the PENDING label on the eight packet 2 bytes is retired (vetoed YES). |
| `lib/vendor/api/vendor.ts` | `promoteLead`, `createDirectClient`. `recordPayment` carries the paid milestone. `deleteSchedule`'s failure type carries the code. |
| `lib/vendor/types/vendor.ts` | `Invoice.lead_package_id`, `PaidMilestone`, `RecordPaymentResponse.milestone`. |
| `scripts/b82_lc2_p3_booking_bench.js` | NEW, rung b82. |
| `scripts/b80_lc2_p1_shell_bench.js` | AMENDED BY LABEL. §6.2, §6.3 and §6.6 now hold packet 3's live sheet; M8 is re-aimed. |
| `scripts/tdw37_hygiene_false_success.proof.mjs` | AMENDED BY LABEL. See §4. |
| `scripts/verify-lc2-p3-pwa.sh` | The founder's one verify command: tsc, the four benches, a cold `next build`, then the floor with declared dirt. |
| `scripts/floor-manifest-lc2-p3-pwa.txt` | The declared dirt. No new directory. |

**What changed in `SliceShell.tsx`:**
- **One booking-sheet mount on Leads.** The card is told `booked` and handed `onBook`.
- **F15(a).** The swipe-right `Booked` opens the sheet.
- **F16.** Remove schedule is not drawn on a booking's invoice, and `PACKAGE_SCHEDULE` maps to `COPY.studioScheduleRemoveFailed` (b1).
- **F17 (c2).** On a booking's invoice, mark-paid speaks D3 (D4 after the last milestone) from the answer.

## §2 · Control inventory (CE-115)

- **Leads, swipe right `Booked`.** Label KEPT; act MOVED. It opens the booking sheet, and the write is the promotion act on `Confirm booking` (F15(a)). No bare state write to `booked` survives in the shell.
- **Lead detail, package card.**
  - ADDED: `Booking confirmed` and `Advance paid`, only with a package attached and the lead not booked.
  - `Attach package` and `Change package` KEPT.
- **Booking sheet (NEW).**
  - The two kind controls (A2).
  - `Advance received on` (A12), shown for Advance paid only.
  - `Cancel`, and `Confirm booking` (A12).
  - Backdrop tap closes.
- **Clients sheet.**
  - `Advance received` MOVED from an amount field to a yes/no switch (F28(b)).
  - `Received on` now shows only on yes.
  - `Add client` now acts (was `Launching soon.`).
  - Every other field KEPT.
- **Invoices, on a booking's invoice only.**
  - `Remove` (Payment Schedule header) REMOVED BY RULING (F16).
  - The swipe-right and the row's `Mark paid` MOVED from the deferred-fire undo window to an immediate write. **Disclosed:** D3/D4 needs the door's answer (c2), so the toast cannot be shown ahead of the write the way the undo toast is. The chair may reverse this in one word.
  - The bulk `Mark paid` is unchanged; its summary (`n done.`) stays true.
- **Invoices, every other invoice.** Unchanged, including "marked fully paid".
- **Packages edit sheet and attach sheet.** `Cancel` MOVED from muted text to the outlined muted form (C-43.16).

## §3 · Copy

Every rendered byte is from the veto record (dream-os P3 handover, Appendix). New in this packet: A2 `Booking confirmed` and `Advance paid`, A12, A13, C4, C5, F29, D3 and D4.

Carried bytes, not coined:
- `Check the highlighted field.` (packet 2, vetoed YES), for the Clients and booking sheets' field flags;
- `COPY.studioScheduleRemoveFailed` (b1);
- `Select…`;
- `Payment on {invoice} failed.` (the existing failure toast).

## §4 · What is proven

- **b82, cured.** `b82_lc2_p3_booking_bench`: 81/81 on the cured tree, run from `/tmp`. It drives the copy home and the API client through the real TypeScript, reads the sheets, the card and the shell from comment-stripped source, and runs 19 mutations of production source, each turning its named cell RED.
- **b82, both ways.** On a clean worktree at `49b1a44` with the bench copied in: 6 passed, 75 failed. The 6 are true facts at base:
  - §1.10: Send quote is absent;
  - §4.11: "marked fully paid" is present;
  - §5.7: the card writes nothing;
  - §6.4: no advance amount is sent;
  - §8.2 and §8.3: tokens in two files the packet changes only in structure.

  One seat defect was caught before the cut: §3.12 passed vacuously at base, and is now gated on the file existing.
- **`tsc --noEmit` on the whole tree:** exit 0.
- **Labelled amendments, both ways.**
  - `b80`: §6.2, §6.3 and §6.6 describe packet 1's inert sheet, which packet 3 retires by ruling. §6.2 would otherwise have passed on a false sentence, because `createDirectClient(` does not match its old `createClient` pattern. M8's anchor was the retired `Launching soon.` click. Run against the base sources, the amended b80 reds exactly §6.2, §6.3, §6.6 and M8; on the cured tree it reads 0 failures.
  - `tdw37_hygiene_false_success`: the cell asked "a new one is this delivery's to explain", and this is the explanation.
    - "leads RIGHT … still a real write (patchLeadState)" now asserts the label, the sheet opener, and that no bare booked write survives.
    - The success-site census now pins exactly two sites: the known early return, and the D3/D4 toast placed after an ok answer (a failed answer returns first).
    - Run against the base sources, the amended proof reds exactly those two cells.
- **b80 §5.1 and §5.5, and b81 §5.8.** These read the card mount as `<LeadPackageCard leadId={sel.id}` on one line. The mount is written that way, so the cells hold unamended; the facts they assert (leads only, tokens only) are unchanged.
- **Readers.** 25 pwa benches that read the touched files are identical to base by exit code and failing-line count, after the amendments. The non-green ones are non-green identically on base.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build`, which cannot fetch Google Fonts here (F-40.134);
  - rendering on a device, both themes, and the swipe under a thumb;
  - the database.

  The founder's provisional apply (the verify runs a cold `next build` and the floor) and card P3 are their witnesses.

## §5 · The walk (card P3; the founder performs and pastes, the seat reads)

**A push is not a deploy (R-40.87). Start only when both hold:**
- Vercel's dreamos-pwa production deployment reads Ready on the commit you push for this packet.
- Railway's vendor service is Active on a deployment newer than your dream-os 3b push (`c2c9c91`). Railway shows an id, not a commit, so step 2's A13 toast is the witness: only packet 3's door can answer it.

**Q-P3-f1 · the fixture, read-only, run FIRST.** Paste the rows.

Witness: `public.leads` (id, name, state, binder_id, wedding_date, wedding_date_precision, deleted_at) and `public.lead_packages` (lead_id, total, schedule, delivery_on, deleted_at), dream-os `docs/db/PUBLIC_SCHEMA.md` at ladder 0168.

```sql
select l.name, l.state, l.binder_id, l.wedding_date, l.wedding_date_precision, lp.total, jsonb_array_length(lp.schedule) as milestones, lp.schedule, lp.delivery_on
from public.leads l
left join public.lead_packages lp on lp.lead_id = l.id and lp.deleted_at is null
where l.id = '88dbb52b-c275-420c-bb12-1c84403bf139' and l.deleted_at is null;
```

Expect `Sarah`, state not `booked`, `binder_id` empty, and a live package with total 80000. The seat states the milestone count from YOUR `milestones` value before you tap; do not take the tap until it has.

On the phone, signed in as DEV440 (9888294440):

1. **The card, Chalk.** Open Leads → Sarah.
   - Expect: under the schedule, two outlined buttons, `Booking confirmed` and `Advance paid`.
   - Evidence: screenshot.
2. **The booking.** Tap `Advance paid`.
   - The sheet reads `Confirm booking`. `Advance paid` is lit in the accent, and `Advance received on` shows today's date.
   - Tap `Confirm booking`. The toast reads `Booked. The client, the event and the invoice are ready.` and the two buttons are gone.
   - Evidence: screenshot of the sheet before the tap, and of the card after it.
3. **The rows.** Run Q-P3-a to Q-P3-e below, one block at a time, and paste each result.
4. **Clients and Events.**
   - Clients shows Sarah. Events shows `Sarah · wedding` on 22 Dec 2026.
   - Evidence: screenshots.
5. **A second tap writes nothing.** On Leads, swipe Sarah's row to the right.
   - The same sheet opens. Tap `Confirm booking`; A13 shows again.
   - Run Q-P3-d and Q-P3-e again. Expect still one invoice, the same rows, and one paid.
6. **The invoice (F16, F17).** Open Invoices → Sarah's invoice.
   - The Payment Schedule shows the rows from step 3, with no `Remove` in its header.
   - Tap `Mark paid` on the row. Expect the toast `Payment marked: Sarah · 30% one month before the first function (optional) · Rs 24,000 · {today in full}. Next due 5 February 2027.`
   - Run Q-P3-e again: the middle milestone is paid.
   - **The mirror, confessed:** Clients' card for Sarah still shows Rs 24,000 received. The binder's figures follow the invoice only once packet 5 switches `PACKAGE_MONEY_MIRROR` on. That is expected, not a defect.
   - Evidence: screenshot of the toast and of the schedule.
7. **A walk-in.** Clients → +.
   - Enter Name `Riya Test`, no phone, Wedding date 20 January 2027, Package `Photographs and film` (no Fee field, because it has one), and Advance received left off. `Received on` stays hidden until you switch it on. Tap `Add client`.
   - Expect `Added. The client, the event and the invoice are ready.`; Riya Test appears on Clients a moment later.
   - Run Q-P3-g.
   - Evidence: screenshot of the sheet before the tap.
8. **The swipe on a lead with no package.** On Leads, swipe right on a lead with no package (e.g. Kunal Dhillon).
   - The sheet opens. Tap `Confirm booking`: the sheet says `Attach a package first.`
   - Tap `Cancel`; nothing changed.
   - Evidence: screenshot.
9. **Graphite.** Switch to the dark theme and screenshot the booking sheet (open it from any unbooked lead with a package, then Cancel), Sarah's card, and the Clients sheet with the switch on.

Truths only the handset holds: both palettes on the sheet, the card and the Clients sheet (R-42.6); the swipe under a thumb; the reach to `Confirm booking` and `Add client`.

**Q-P3-a · the lead.** Witness: `public.leads` (id, name, state, binder_id, source), PUBLIC_SCHEMA.md at 0168.

```sql
select name, state, binder_id, source from public.leads where id = '88dbb52b-c275-420c-bb12-1c84403bf139';
```

Expect `booked` and a `binder_id`.

**Q-P3-b · the binder.** Witness: `engine.records` (id, client, stage, date, amount, direction, amount_received, amount_pending, payment_status), dream-os `docs/db/ENGINE_SCHEMA.md`; `public.leads` as above.

```sql
select r.id, r.client, r.stage, r.date, r.amount, r.direction, r.amount_received, r.amount_pending, r.payment_status
from engine.records r
where r.id = (select binder_id from public.leads where id = '88dbb52b-c275-420c-bb12-1c84403bf139');
```

Expect `confirmed booking` and 2026-12-22. If this binder was opened by the act: 80000, `in`, 24000, 56000, `partial`. If an existing Sarah binder was adopted (same phone and name), its own money stands and only empty cells were filled (choice 4).

**Q-P3-c · the event.** Witness: `public.events` (title, kind, event_date, state, linked_lead_id, linked_binder_id, deleted_at), PUBLIC_SCHEMA.md at 0168.

```sql
select title, kind, event_date, state, linked_binder_id, deleted_at from public.events where linked_lead_id = '88dbb52b-c275-420c-bb12-1c84403bf139';
```

Expect one row, `Sarah · wedding`, `ceremony`, 2026-12-22, `upcoming`.

**Q-P3-d · the one invoice.** Witness: `public.invoices` (invoice_number, lead_id, lead_package_id, binder_id, amount_total, amount_paid, state, due_date, has_schedule, deleted_at), PUBLIC_SCHEMA.md at 0168.

```sql
select invoice_number, lead_package_id, binder_id, amount_total, amount_paid, state, due_date, has_schedule, deleted_at from public.invoices where lead_id = '88dbb52b-c275-420c-bb12-1c84403bf139';
```

Expect one row: 80000, 24000, `advance_paid`, due 2026-11-22, `has_schedule` true.

**Q-P3-e · the schedule.** Witness: `public.payment_schedules` (invoice_id, ordinal, milestone_label, amount_due, due_date, state, paid_at, paid_amount) and `public.invoices` (id, lead_id), PUBLIC_SCHEMA.md at 0168.

```sql
select ps.ordinal, ps.milestone_label, ps.amount_due, ps.due_date, ps.state, ps.paid_at, ps.paid_amount
from public.payment_schedules ps
join public.invoices i on i.id = ps.invoice_id
where i.lead_id = '88dbb52b-c275-420c-bb12-1c84403bf139'
order by ps.ordinal;
```

Expect the count stated from Q-P3-f1. With three rows: 24000 paid on the received day, 24000 due 2026-11-22 pending, and 32000 due 2027-02-05 pending. The editor shows `paid_at` in UTC, so a payment dated today reads as 18:30 on the previous day: that is midnight IST.

**Q-P3-g · the walk-in.** Witness: `public.leads` (vendor_id, name, state, source, binder_id, created_at, deleted_at) and `public.invoices` (lead_id, invoice_number, amount_total, amount_paid, state, due_date), PUBLIC_SCHEMA.md at 0168.

```sql
select l.name, l.state, l.source, l.binder_id, i.invoice_number, i.amount_total, i.amount_paid, i.state as invoice_state, i.due_date
from public.leads l
left join public.invoices i on i.lead_id = l.id
where l.vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742' and l.source = 'direct' and l.deleted_at is null
order by l.created_at desc;
```

Expect `Riya Test`, `booked`, `direct`, a binder, and one invoice with nothing paid and due on the deposit's day.

## §6 · What packet 4 picks up

- Victor's hands V1 to V12, the door lines D1 to D4 on both lanes, and the quote send (A2's `Send quote`, A10, A11, Q1).
- F-43.67 and F-43.82, as the kickoff's §3 lists them.

Sequencing beyond this sitting is the founder's.
