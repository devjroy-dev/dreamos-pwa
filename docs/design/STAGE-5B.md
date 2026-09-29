# DESIGN-1 · Stage 5b: the invoice and the event as full pages

Branch `design/stage-5b-pages`, built on `design/stage-5a-pages`. Nothing is merged, and there is no pull request.
dream-os has no change for 5b: every read the pages use is a door the pwa already calls. Every changed path is in
`STAGE-5B-PATHS.txt`. 5b is in the new layout only; the classic layout is untouched.

## What changed

- **Two record pages**, `/vendor/invoices/<id>` and `/vendor/events/<id>`. They have the same shape as 5a's, top to
  bottom:
  - Back to the list; the name (the page's head, with its "?") and the status.
  - **The next action, as one button:**
    - the invoice: Send on WhatsApp (E12's likely next step, as the sheet had it), or Download PDF when there is no
      number; none once cancelled;
    - the event: Mark done on or after its day, Open the client before it (when the calendar row names one); none once
      done or cancelled.
  - **Dates:**
    - the invoice: the day it was made, and its due date;
    - the event: its day, its time and its crew.
  - **Money:**
    - the invoice: total, received and still due, and under them the **payment schedule** with Add, Remove schedule,
      and Remind, Edit and Paid on each part;
    - the event: its client's received and still due.
  - **Notes:** the event's own. An invoice carries no notes on its wire, so its page draws no Notes section rather than
    an empty one that could never fill.
  - **History**, newest first:
    - the invoice: the day it was made, each part paid, and each reminder that actually went. It is "sent" only when
      WhatsApp accepted it, never merely asked (F-41.15);
    - the event: its booking's history (messages, invoices, other dates), from the one lead-detail read, when the event
      names its enquiry.
  - **The small jobs:**
    - the invoice: Download PDF, Mark paid, Enquiry and Client (each only when exactly one has this number, the 5a
      rule), Ask in chat, Edit, and Cancel invoice (it asks first);
    - the event: Mark done, Enquiry, Client, Ask in chat, Edit, and Cancel event (it asks first).
- **One home for every act.** Each page is its room's own screen in a new record mode (`SliceScreen`'s `recordId`),
  with its layout in `v2/components/vendor/records/SliceRecord.tsx`. So every act is the list's own handler, not a copy:
  - Mark paid is the row's Mark paid (package invoices included);
  - Done is the swipe's Done, and Edit opens the same edit sheet;
  - Send on WhatsApp and the PDF are the sheet's own, now named functions;
  - the payment schedule is one panel (`schedulePanel`), read by the invoice sheet and the invoice page, with its
    Remind, Edit and Remove sheets unchanged.
- **Cancel keeps the page.** Cancel on a page uses the same door and the same 30-second Undo as the sheet's, but the
  page stays, reading Cancelled, so the Undo on its toast is still in reach. Undo brings it back.
- **Never a sheet on a sheet.** A page never opens the old record sheet (`sel={recordId ? null : sel}`); its jobs each
  open one small sheet over the page.
- **Back to the same list at the same scroll**, as in 5a. The Invoices and Events lists save their place as they open a
  record, and the shell reads the two new pages as records. Measured live at 374 and 360, dark and light: exact every
  time (189 = 189, 215 = 215).
- **Ways in:**
  - tapping an invoice or an event row opens its page;
  - `?invoice=` and `?event=` (Today's cards, the search's results) open the pages.

## The search's client results now open the client's page (your 5b ask)

It could be done without putting any private id on the network:
- The search still sends the client's id from the typed client roster (`?client=<id>`), exactly as before. There is no
  phone and no binder id in any address.
- The Clients list resolves the page itself:
  - it reads the client's number from the typed client roster, the door Contracts already calls (`fetchTypedClients`,
    now paged by the door's own offset, only while a `?client=` is waiting);
  - it matches that number against the list's own clients by the estate's phone fold;
  - it opens the page only when exactly one client has that number (`foundClientPage`, the same rule as 5a's).
- With none, several, no number, or an id the roster lacks, she stays on the list, as before.
- The first read I reached for, the pwa's `fetchClients`, turned out to be a view over the cabinet that carries binder
  ids, so it could never match. The resolution uses the real typed roster instead.

## Two 5a slips, fixed here

- **The client page's Open the invoice** carried the client's own id where the Invoices list expects an invoice's, so
  it opened the list and focused nothing. It now opens the invoice's page: the one invoice still owed with the client's
  number (`owedInvoiceFor`, exactly one; paid and cancelled invoices never count), else the Invoices list.
- **Hide on the client page** left for the list at once, taking its Undo with it. The page now stays, reading Hidden,
  with the Undo in reach; the list refreshes as she leaves.

## The "?" cards: new and changed (new layout only; the classic cards are exactly as they were)

| Card | New or changed | What it says (naming only what that screen draws) |
|---|---|---|
| Invoice page `/vendor/invoices/[id]` | **new** | What: "One invoice, whole: what it asks for, what has come in, and each payment and reminder." The top button is the next step: Send on WhatsApp sends the invoice to the client, and with no number it is Download PDF. Money shows the total, what has come in and what is still due. Under it is the payment schedule: Add makes one; each part has Remind, Edit and Paid; Remove schedule takes it off. The jobs at the end are Download PDF, Mark paid, Enquiry and Client (when one has this number), Ask in chat, Edit and Cancel invoice. Connects: Back to Invoices returns to the list where you left it, and a reminder you send is kept in Payment reminders. |
| Event page `/vendor/events/[id]` | **new** | What: "One event, whole: the day, the crew, the client and the booking behind it." The top button is the next step: Mark done once the day has come, or Open the client before it. Dates has the day, the time and the crew. Money is the client's: what has come in and what is still due. History is the booking's, newest first. The jobs at the end are Mark done, Enquiry, Client, Ask in chat, Edit and Cancel event. Connects: Back to Events returns to the list where you left it, and the event is on your Calendar too. |
| Events list | changed (was only its line 1) | Search events, or tap This week, Later or Done to see only those, and Recent changes the order. Tap an event to open its page. Swipe right to mark it done or left to cancel it, and + adds an event. Connects: every event is on the Calendar too, and a booking puts each of its dates here. |
| Invoices list | changed | "Tap an invoice to open its page." (It said "open it", which was the sheet.) |

The sheets the pages open (Remind, Edit a part, Remove schedule, Add, the edit sheet) keep the words they already had.

## Benches (only those reading changed files, plus the d1_ benches; no floor, by ruling)

Each ran alone, in the foreground, under 10 minutes. Each was checked by pid afterwards: nothing was left running.

| Bench | Result |
|---|---|
| `d1_records5b_bench_v2.mjs` (new) | 39/39: 25 cells and 14 mutations. It covers the next actions, the invoice's history, both pages' order, one home for every act, never a sheet on a sheet, Cancel keeping the page, back and scroll, the ways in, the found client (one match, two sharing a number, none, and nothing new on the wire), the two 5a fixes, and the cards. |
| `d1_records_bench_v2.mjs` (5a) | 24/24 |
| `d1_help_bench_v2.mjs` | 10/10. Amended by label: the Events list and both new pages are checked word by word against what they draw. |
| `d1_stage3_bench_v2.mjs` | 37/37 |
| `d1_book_bench_v2.mjs` | 32/32. M11's planted text is amended by label: the room's sheets sit two spaces deeper now, so the mutation had stopped biting. |
| `b140_ce46_fe4_page_help_bench_v2.js` | 618/618, with both new pages on glass. Amended by label: fixture ids inv-0001 and ev-0001, the typed count 6 → 8, and the probe folds the seen key for both. |
| `tdw41_g34s2_pwa_v2.proof.mjs` | 25/25 and 10/10 mutations. Its `--mutate` had crashed on every run since the split, because it copied `components/` and `lib/` but not `v2/`. Fixed by label, and carried in `postbench.py`. M6's text is amended for the indent, as with d1_book. |
| `b80_lc2_p1_shell_bench_v2.js` | 47/47 |
| `b81_lc2_p2_room_bench_v2.js` | 65/65 |
| `b82_lc2_p3_booking_bench_v2.js` | As in 5a: only §12.3 and its M33, which need the dream-os font file absent here (REFUSED). |
| `b40_worklist_shell_bench_v2.js` | Main's two reds only (C50, C102, identical to 5a). C80, C81 and C84 are REFUSED because the sibling is absent. |
| `b57_contracts_wiring_bench_v2.js` | 192/192. It was run because the Contracts roster fetcher gained an optional offset. |
| `b126_igd1_meta_room_bench_v2.js` | 48/48 |
| `b122_ce45_home_shelves_bench_v2.js` | 80/81. The one red is 3.5, main's (the sibling is absent). |
| `b77_shell2_hierarchy_bench_v2.js` | 47/51, the same four split reds as at 5a and at the stage-4 tip. Left for landing. |
| typecheck (`tsc --noEmit`) | clean |
| eslint on the changed files | No new error. One error stands on `invoices/body.tsx`: `useCallback(makeDeleteRequest(vendorId), …)`, a line older than 5b that 5b only moved down one. The warnings were already there. |

**Driven live** by `docs/design/tools/recordprobe5b.mjs`, in the design harness at 374: 14/14.
- On the invoice page, Remind opens its sheet over the page and the record sheet stays shut.
- Cancel invoice asks, then reads Cancelled on the same page with Undo, and Undo brings it back.
- Mark paid reads Paid, with Undo.
- On the event page, Mark done reads Done, with Undo, and Edit opens the edit sheet.
- `?invoice=`, `?event=` and `?client=` open their pages, and an unknown client id stays on the list.
- On the client page, Open the invoice goes to that invoice's page, and Hide stays on the page with Undo.

Not run here, by ruling: b123 and b123_v2, and the whole floor (the founder's Codespace, at landing).

## Shots

`docs/design/shots/stage-5b/`: the invoice and the event, at the top, middle and end of the page, in dark and light,
at 374 and 360 wide. They were taken by `docs/design/tools/recordshots.mjs` (`STAGE=5b`), which opens each page from
its list with a real tap, then taps Back and measures the scroll.

## Left for landing

- The whole floor, including b123 and b123_v2.
- b77_v2's four split reds, which predate 5a.
- The lint error on `invoices/body.tsx`'s `useCallback(makeDeleteRequest(…))`, which is older than this work.
- The Calendar room's own lists (its Coming up rows and its day sheet) still act as they did. The pages are reached
  from Events, Today's cards and the search.

## Size

- **5b:** 26 files of code, routes, benches and tools, at +914 / −132 lines ignoring whitespace (+1,426 / −644 as
  stored, the difference being SliceShell's sheet block moved two spaces deeper). With 32 shots, this report and the
  paths list, 60 paths in all. dream-os: none.
- **After 5b:** stage 5 is complete. The next step is the landing, behind the switches with the master off, and the
  whole floor in the founder's Codespace.
