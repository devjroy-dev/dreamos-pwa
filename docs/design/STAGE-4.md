# DESIGN-1 · Stage 4: the one-tap Book, and the switches

Branch `design/stage-4-book`, built on `design/stage-3-tabs`. dream-os's half is on its own branches:
- `design/layout-switch` for the switches;
- `design/stage-4-book` (built on it) for the booking.

Nothing is merged. Every changed path is in `STAGE-4-PATHS.txt`. Stage 4 is in the new layout only; the classic layout
is untouched.

## The switches (the founder and the chair)

All three live on the admin panel's Switchboard, in one "Vendor layout" card.

- **Per vendor (built in stage 3).** `LAYOUT_V2_VENDOR_IDS` in Railway names the vendors who see the new layout while
  the master is off, so the founder and Swati can test on their own accounts. The card lists them and says where they
  are set.
- **Master: "New layout for everyone".**
  - One control, Off and On, on its own door (`POST /api/admin/capabilities/layout/master`), instant, no deploy.
  - ON: every vendor gets the new layout.
  - OFF: today's layout for everyone except the per-vendor list.
  - It is the switchboard's `flag.vendor_layout_v2`. The Switchboard's generic flip of that flag goes through the same
    home, so the date is kept either way.
- **The 30 days.**
  - The first time the master turns on, the date is recorded once, in its own switchboard row
    (`flag.vendor_layout_v2.first_on`, seeded off by the same 0185, still written and not applied). That row's
    `flipped_at` is the date, it is never flipped by hand, and it never moves again.
  - The card shows **"Classic layout kept until \<date + 30 days\>"** beside the master; before the first ON it says so.
  - Until that date the classic layout stays whole, and the master can be turned off at any time.
  - The removal is the separate later cut planned in STAGE-3.md. Nothing reads the date to act.
- **Benches:**
  - dream-os `d1_layout_master_bench.js`, 16/16:
    - master off, the list sees v2 and others classic;
    - master on, everyone v2;
    - off again, back to the list only;
    - no date before the first ON;
    - the date recorded at the first ON and shown +30 days;
    - off and on again keeps the first date;
    - the doors and the seed;
    - four mutations, one per claim.
  - pwa `d1_layout_panel_bench.mjs`, 15/15:
    - the date shown as a calendar date;
    - an older or odd answer reads as unread, never a broken Switchboard (found by b87 and fixed);
    - the master posts to its own door;
    - the two layout rows are drawn on this card only;
    - five mutations.

## The one-tap Book

From an enquiry, "Booking confirmed" or "Advance paid" opens one sheet, **Book**, in two steps. There is no second
sheet for the booking itself.

**1 · Book**, top to bottom:
- **How she was paid:** the two kinds; for Advance paid, the day it arrived.
- **Dates.** "Each date goes on your calendar as its own event."
  - The wedding date is there already. Add a date for each function, with an optional "What" (Haldi, Sangeet, Wedding).
  - The calendar is always filled. With no date, nothing is sent and the sheet says "Add at least one date." The
    server refuses the same case before writing anything.
- **Package:**
  - *With a package attached:* its name and **the payment plan as one sentence**, for example "Payment plan: Rs 1,14,000
    on booking, Rs 1,52,000 on 14 January 2027 and Rs 1,14,000 on 14 February 2027."
  - **Change plan** sits right under that sentence, one tap. It opens the package's own editor, the existing
    AttachSheet, on the same fields as before.
  - *With none attached:* her packages to pick from, the default one first ticked, and **No package, enter an amount**
    in the same sheet. For Advance paid there is also "Advance received".
- **Invoice for Rs X:** ticked, and it cannot be unticked. "Every booking gets an invoice."

**Confirm booking** sends it all in one act. A package picked in the sheet is attached first.

**2 · Booked**, in the same sheet:
- One line: "Aanya Kapoor is booked. Both dates are on your calendar, and invoice TDW/DEV440/12 is ready."
- **A confirmation for Aanya.** "Nothing has been sent. Copy it, or send it on WhatsApp yourself." That explanation
  sits outside the box. The draft sits **in its own box with Copy** (R-46.17).
- **Send on WhatsApp**, which opens WhatsApp with the draft to her number, sent only on her tap. **No message goes by
  itself.**
- **Undo (10)**, counting down for ten seconds. It removes exactly what the booking wrote:
  - the events it created, never an older one;
  - the invoice only if the booking created it;
  - the lead goes back to the state it had.
- **Done.**

**Cancel booking, from the client's page.** On a client card with a booked lead behind it, Cancel booking opens a
sheet that first asks the server what the booking holds (a dry run), then asks her:
- "Also remove the N dates from your calendar", with each date listed;
- "Also remove the unpaid invoice TDW/…".

Both start **unticked**, so nothing is removed unless she says so. An invoice with any payment on it is never offered:
"Invoice … has payments on it, so it stays." The client goes back to her enquiries.

### The server (dream-os `design/stage-4-book`)

- **`promotion.js`**, the booking act, takes three new inputs, all optional (the old callers send none):
  - `functions`: each date its own event; a date the booking already has is kept, never doubled.
  - `amount`: with no package, the full amount.
  - `advance_amount`: the advance and the balance, the advance paid on its day.

  It refuses `no_date` before any write when no date would reach the calendar. It returns what it wrote: the created
  events, whether the invoice was new, and the state before. A full-amount booking with no package records no advance.
- **`unbooking.js`**, one home for Undo and Cancel booking, at `POST /leads/unbook`, found by the lead or by the
  client's binder:
  - a dry run lists what would go and writes nothing;
  - nothing is removed unasked;
  - an invoice with money on it is never removed (and the binder is hidden only when its invoice is removed, the
    existing `donna_hide`);
  - only a booked lead, only hers.
- **Bench:** `d1_booking_bench.js`, 19/19, with four mutations. It drives the real modules against b83's fake store,
  read from b83's own source. b83 and its neighbours read the same as before.

## Found and fixed by this stage's own screenshots

- **The room closed the sheet on booking**, so the Booked step (the draft and Undo) never showed. It now stays open
  until Done. Bench cell 2.8, with a mutation.
- **The sheet reset whenever the room re-rendered.** It was keyed on an object the room rebuilds on every render, and
  it refetched each time. It is now keyed on the date's own values. Bench cell 2.9, with a mutation.
- **The date field was cut to "02/14/20" at 374.** Each date now has its own row, with "What" under it.

## The "?" on everything stages 3 and 4 made (the founder's reminder)

Every page and tab of the new layout has its "?". The pages that stages 3 and 4 made or changed now have **full cards**:
what the page does, its steps, and what it connects to, naming only controls that screen draws. Each card's first line
is still the registry's (`ROOM_DESC`), as b140 1.2 requires. The classic layout's cards are untouched: `lib/worklist/pageHelp.ts`
and `components/worklist/PageHelp.tsx` are byte for byte main's.

**New or completed cards** (words in `v2/lib/worklist/pageHelp.ts`):

| Card | Its steps (the controls it names) | Connects |
|---|---|---|
| Enquiries | Search, New, Contacted, Quoted, Booked, Recent; open an enquiry: WhatsApp, Call, Attach package, Forward to a peer, Mark lost; Booking confirmed or Advance paid opens Book; the + button | Clients, Calendar, Money |
| Calendar | Month, Weddings, the arrows, Good dates; tap a day to see and block it; Coming up; the + button | each booking's dates |
| Clients | Search; open a client: Ask in chat, Edit, Hide, Cancel booking; the + button | Money, Calendar |
| Money (Invoices) | Search, Overdue, Unpaid, Part paid, Recent; Mark paid; the + button | Payment reminders, Expenses, TDS and Books, through the search box |
| Today and More | already full since stages 2 and 3; Today's gained the Get found line, More's the search sentence | |
| **Search or ask** (new, its own "?" beside the box) | names, the last four digits, a page such as TDS; Ask TDW about this; recent searches | the Ask TDW bar |
| **Book** (new, "?" on the sheet's title line) | Add a date; Change plan; No package, enter an amount; Confirm booking; Copy, Send on WhatsApp, Undo | Clients, Calendar, Money |
| **Cancel booking** (new, "?" on the sheet's title line) | the dates line, the invoice line, Keep booking | Enquiries |

**How the surface cards work.** `HelpButton` (in `v2/components/worklist/PageHelp.tsx`) draws the same "?" and the same
card as a page's, with its own seen key. A sheet's card goes up through the one vendor layer (`SheetLayer`), so it
sits above the sheet it explains. Screenshots: `shots/stage-4/help/`.

**Benches:**
- `d1_help_bench_v2.mjs`, 10/10:
  - the five tabs and More each have a full card;
  - the search, Book and Cancel booking each have their own;
  - every control a card names is one its screen draws, checked against the source that draws it (including the
    filter chips' and sort's derived labels);
  - no dash;
  - each "?" is mounted, and a sheet's card sits above its sheet;
  - five mutations.
- **b140 passes on both layouts:**
  - `b140_v2`: 561/561, whole.
  - Classic `b140`: 550/550 on this stage's code. It was run in the stage-3 worktree, detached at this commit, because
    that worktree has a real `node_modules`. In the stage-4 worktree, whose `node_modules` is a hard-linked copy,
    Turbopack refused the classic layout's Jost font ("next/font/google queries have exactly one entry") before any
    card was tested. It did so twice, the same way. That is this session's copy, not the code: the landing floor runs
    in a normal checkout.
- **b140_v2 amended by label.** Stage 3 left two of its source cells red, and I had not run it then:
  - 1.1 now reads the two v2 redirects (`/vendor` and `/vendor/rooms` go to Today);
  - 1.3 allows the held-rooms row under the head, and walks the v2 tree rather than the classic;
  - 1.5 accepts the second seen-key reader (HelpButton), still only in the after-mount effect.

**For the founder, one thing the Money card had to say plainly.** Expenses, TDS, Books and Payment reminders are the
Money tab's other pages. Stage 3 shows the row linking them only on those pages themselves, not on Invoices, and they
are not in More. So from Invoices the way to them is the search box ("TDS" opens TDS), and the card says exactly that.
If he wants them one tap from Invoices, the row can show on Invoices too. That's a one-line change, left for his word.

## Screenshots

- `shots/stage-4/before/`: stage 3's after shots.
- `shots/stage-4/after/`: this branch as the v2 tree.
- Both sets: Today, Enquiries, Calendar, a client and Money, at 374x812 and 360x800, dark and light. The five screens
  change only where a client card now offers Cancel booking.
- `shots/stage-4/book/`: the Book sheet with no package (the picker), with an amount and a second date, the Booked
  step (the draft in its box, Send on WhatsApp, Undo), and with a package (the plan sentence and Change plan), at
  374 and 360, dark and light.
- The tool is `docs/design/tools/bookshots.mjs`. The harness answers the booking door and, with `HARNESS_LP=1`, a
  package already attached.

## What ran here, and what is left for the landing floor

By ruling, only the benches that read the files this stage changed, and the `d1_` benches, ran here, one at a time, in
the foreground.

| Bench | Result |
|---|---|
| `d1_book_bench_v2.mjs` | 32/32 |
| `d1_help_bench_v2.mjs` | 10/10 |
| `b140_ce46_fe4_page_help_bench_v2.js` | 561/561 (whole) |
| `b140_ce46_fe4_page_help_bench.js` (classic) | 550/550 on this stage's code (see the help section) |
| `d1_layout_panel_bench.mjs` | 15/15 |
| dream-os `d1_booking_bench.js` | 19/19 |
| dream-os `d1_layout_master_bench.js` | 16/16 |
| dream-os `b0185_layout_switch_bench.js` | 13/13 |
| `b82_lc2_p3_booking_bench_v2.js` | amended by label (below); its red set equals stage 3's (the sibling-repo refusals) |
| `b80_lc2_p1_shell_bench_v2.js` | 47/47 |
| `b40_worklist_shell_bench_v2.js` | main's two reds only (C50, C102), as stage 3 |
| `b59_seven_ink_census_v2.js` | 20/20 |
| `d1_stage3_bench_v2.mjs` | 37/37 |
| `d1_layout_switch_bench.mjs` | 19/19 |
| `b87_lcv_p2_panel_bench.js` | 26/26 |
| `b61_f2`, `ce41_e2i`, `ce41_e2ivb`, `tdw10_p3_deck`, `tdw41_c3_switchboard_copy` (Switchboard benches) | as on stage 3 |
| `b20_a3_assistance_pwa` | 204/204 |
| dream-os b83, b84, b88, b90, b05 (promotion); b61, b63 (switchboard) | the same red sets as before the change (this clone has no packages installed) |

**Left for the landing floor:** everything STAGE-3.md lists, and the dev-server `_v2` benches that read the changed
files: b81_v2, b123_v2 (at landing only, by ruling) and tdw41_g34s2_pwa_v2's live cells.

## Benches updated, and why

- **b82_lc2_p3_booking_bench_v2** (the v2 copy only; main's original is untouched), by label, "DESIGN-1 · STAGE 4":
  - the booking sheet's cells keep their claims, restated for the Book sheet:
    - the date rides only with Advance paid;
    - refusals by code as NeedFirst controls;
    - the Booked step only after the door answers ok, with the slices refreshed;
    - the dates and the package are asked in the sheet, with nothing sent while either is missing;
    - Confirm booking is never disabled;
  - its mutations are re-aimed at the new anchors.
- **New:**
  - `d1_book_bench_v2.mjs`: the words and derivations; the Book sheet; Cancel booking; R-46.17's "joined" mutation
    for the draft's box among its twelve mutations.
  - `d1_layout_panel_bench.mjs`.
  - dream-os `d1_booking_bench.js` and `d1_layout_master_bench.js`.

## The landing

After this stage the branches land behind the switches, with the master off. Every vendor keeps today's layout, and
the founder and Swati see the new one through `LAYOUT_V2_VENDOR_IDS`. dream-os's 0185 is written, not applied: it
goes through the chair's queue with the landing.
