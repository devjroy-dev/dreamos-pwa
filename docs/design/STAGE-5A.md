# DESIGN-1 · Stage 5a: the enquiry and the client as full pages

Branch `design/stage-5a-pages`, built on `design/stage-4-book`. Nothing is merged, and there is no pull request.
dream-os has no change for 5a: the lead-detail read already carries the whole history, so no door was added or widened.
Every changed path is in `STAGE-5A-PATHS.txt`. 5a is in the new layout only; the classic layout is untouched.

## What changed

- **Two record pages**, `/vendor/leads/<id>` (the enquiry) and `/vendor/clients/<id>` (the client). Their parts are in
  `v2/components/worklist/RecordPage.tsx`, and their words and rules in `v2/lib/worklist/record.ts`. Top to bottom:
  - Back to the list; then the name (the page's head, with its "?") and the status.
  - **The next action, as one button:**
    - on an enquiry: Reply on WhatsApp for a new one, Book for one in talks, Open the client once booked, and none when
      lost;
    - on a client: Open the invoice while money is due, otherwise Message on WhatsApp, and none without a number.
  - **Dates:**
    - the enquiry: the wedding date and the day it was received;
    - the client: the wedding date and every calendar date linked to this client.
  - **Money:**
    - the enquiry: the package and its payment plan, or the budget;
    - the client: total, received and still due.
  - **Notes.**
  - **History**, newest first, drawn from the one lead-detail read:
    - the enquiry: the conversation, invoices and dates;
    - the client: the same, plus the notes.
  - **The small jobs:**
    - the enquiry: WhatsApp, Call, Attach or Change package, and Mark lost (it asks first);
    - the client: Enquiries (only when linked), Ask in chat, Edit, Hide (it asks first, then gives a 30-second Undo)
      and, on a booked client, Cancel booking.
- **Ways in:**
  - tapping an enquiry row or a client card opens its page;
  - the old `?lead=` deep link now goes to the enquiry page;
  - the search's enquiry results open the page.
- **Money row on Invoices** (the founder's yes): the row linking Payment reminders, Expenses, TDS and Books now shows
  on Invoices too (`ROW_ON_FIRST` in `v2/lib/worklist/tabs.ts`).
- **A client's enquiry, by phone (the founder's rule):**
  - `linkedLeadFor` compares the estate's own fold, `phoneKey` (the last ten digits, with degenerate numbers rejected);
  - it links **only when exactly one** enquiry matches;
  - with none, or two or more sharing the number, the page shows no linked enquiry rather than guess;
  - a number that doesn't fold never matches.
  - The enquiry page uses the same rule the other way round, for its Open the client.
- **Never a sheet on a sheet:**
  - each page holds one open sheet at most;
  - Book's form hides while its Attach package sheet is open (`BookingSheet.tsx`, the one place a sheet could stack).
- **Back to the same list at the same scroll position:**
  - the list saves where its scroller stood as it opens a record (`sessionStorage`, per tab);
  - Back uses history back;
  - the shell puts the list back once its rows have drawn.
  - Measured live at 374 and 360, dark and light: the exact position every time (16 = 16, 22 = 22).

## The "?" cards: new and changed (new layout only; the classic cards are exactly as they were)

| Card | New or changed | What it says (naming only what that screen draws) |
|---|---|---|
| Enquiry page `/vendor/leads/[id]` | **new** | What: "One enquiry, whole: who, when, the money and everything said so far." It says the top button is the next step (Reply on WhatsApp, Book, or Open the client). Dates, Money, Notes and History read top to bottom, and History is newest first. The jobs at the end are WhatsApp, Call, Attach package and Mark lost. Connects: Back to Enquiries returns to the list where you left it, and Book puts the dates on the Calendar and the invoice in Money. |
| Client page `/vendor/clients/[id]` | **new** | What: "One client, whole: the dates, the money and the story so far." It says the top button is the next step (Open the invoice while money is due, otherwise Message on WhatsApp). Dates, Money, Notes and History read top to bottom. The jobs at the end are Enquiries (when one enquiry has this number), Ask in chat, Edit, Hide and, on a booked client, Cancel booking. Connects: Back to Clients returns to the list where you left it. |
| Enquiries list | changed | Tapping an enquiry opens its page, with the next step on top. Swipe right to book, and + adds an enquiry. |
| Clients list | changed | Tapping a client opens their page, with the next step on top. |
| Money (Invoices) | changed | Connects: "The row under the heading opens the rest of Money: Payment reminders, Expenses, TDS and Books." |

The sheets the pages open (Book, Attach package, Edit, Cancel booking) keep the cards they already had; each is drawn
one layer above its sheet.

## Benches (only those reading changed files, plus the d1_ benches; no floor, by ruling)

Each ran alone, in the foreground, under 10 minutes, and each was checked by pid afterwards: nothing was left running.

| Bench | Result |
|---|---|
| `d1_records_bench_v2.mjs` (new) | 24/24 with 7 mutations. It covers the founder's four phone cells (1.1 one match, 1.2 no match, 1.3 two enquiries sharing a number, 1.4 an enquiry with no phone), the next actions, history, the page order, one sheet at a time, back and scroll, the ways in and the cards. |
| `d1_help_bench_v2.mjs` | 10/10 (the Enquiries and Clients names amended; the Money row's four rooms added) |
| `d1_stage3_bench_v2.mjs` | 37/37 (1.6 amended by label: the enquiry link is now the page) |
| `d1_book_bench_v2.mjs` | 32/32 |
| `b140_ce46_fe4_page_help_bench_v2.js` | 589/589. The two record routes are on glass, amended by label: fixture ids for dynamic routes, and the typed count 4 → 6. The probe folds the seen key onto the pattern. |
| classic `b140` | not rerun: it reads no changed file (the classic tree is untouched); it was 550/550 at stage 4 |
| `b81_lc2_p2_room_bench_v2.js` | 65/65. A stage-3 miss is fixed by label: the v2 client reaches `_base` by `@/lib/vendor/api/_base`. |
| `b82_lc2_p3_booking_bench_v2.js` | The same stub fix, by label, turns §2.1–2.5 green. What stays red is only what needs the dream-os sibling's font file, which is absent here (§12.3 and its M33, REFUSED). |
| `b80_lc2_p1_shell_bench_v2.js` | 47/47 |
| `b40_worklist_shell_bench_v2.js` | Main's two reds only (C50, C102), as in stages 3 and 4. C80, C81 and C84 are REFUSED because the sibling is absent. |
| `b126_igd1_meta_room_bench_v2.js` | 48/48 |
| `b122_ce45_home_shelves_bench_v2.js` | 80/81. The one red is 3.5, main's (the sibling is absent), as in stage 3. |
| `b77_shell2_hierarchy_bench_v2.js` | 47/51. The same four reds at the stage-4 tip (checked there), so they come from the layout split, not 5a: the copy's path (v2/lib vs lib), the .sol-* mock, the theme tokens and the header rules. Left for landing. |
| typecheck (`tsc --noEmit`) | clean |
| eslint on the changed files | 0 errors. One new warning: a `router` dependency, which is stable. The rest were already there. |

The stub fix is also carried in `docs/design/tools/layout-switch/postbench.py`, so a fresh split carries it.

Not run here, by ruling: b123 and b123_v2, and the whole floor (the founder's Codespace, at landing).

## Shots

`docs/design/shots/stage-5a/`: the enquiry and the client, top and end of page, dark and light, at 374 and 360 wide.
They were taken by `docs/design/tools/recordshots.mjs`, which opens each page from its list with a real tap, then
taps Back and measures the list's scroll.

## Left for landing

- The whole floor, including b123 and b123_v2.
- b77_v2's four split reds, which predate 5a.
- The search's **client** results still open the Clients list (`?client=`): they carry public.clients ids, not
  binder ids, and binder ids stay off every wire (F-43.73).
- In the fixture, "Enquiry received" sorts as the newest history line, because the fixture's created_at is later
  than its messages. Real data is ordered by its own dates.

## Size

- **5a:** 24 files of code, routes, benches and tools, at +796 / −23 lines; with the 24 shots, this report and the paths
  list, 50 paths in all. dream-os: none.
- **5b** (the event and the invoice as full pages, with their "?" cards, and benches in the same shape):
  - about the same as 5a, a little larger, at roughly 26–30 files and +900–1,100 lines;
  - the invoice page carries the payments and milestones, and the event carries its calendar and links;
  - it needs the same bench set plus a d1_ bench for the two pages; there is likely no dream-os change.
