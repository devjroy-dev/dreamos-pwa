# DESIGN-1 · Stage 2: Home as the day's work

Branch `design/stage-2-home`, built on `design/stage-1-look`. What the founder sanctioned for this stage: Home in
the report's order (`docs/review/REPORT.md` §3, "What a vendor sees first"), crew shown wherever an event shows, and
the pinned rooms kept but moved under More. Every changed path is in `STAGE-2-PATHS.txt`.

## What changed

### Home (`/vendor/today`)
`components/worklist/TodayHome.tsx`, with every word in `lib/worklist/home.ts`. In this order and nothing else:

1. **Check a date.** A date box with a Check button, always at the top, starting on today. The answer is in words:
   **Free all day**, **Booked** (with what is on the day: each function's time, name and client, or "Blocked:"
   and the reason) or **Enquiry** ("Meera Shah asked for this date"). A lost or booked enquiry does not count as
   an enquiry. A good date for weddings says so. "Open in calendar" opens the Calendar on that day
   (`?day=`, which the Calendar now reads and opens the day sheet for).
2. **Reply to.** Every new enquiry the feed sends, in the feed's order (the backend's ranking; nothing is
   re-sorted), each with the last message of its conversation (or the enquiry's own words when there is no
   conversation yet) and how long ago ("3 h ago", "2 days ago"). A capped list says so and links to all of them.
3. **Today.** Each function today with its time, place and crew ("Shoot · Lodhi Garden · Rhea, Arjun (not replied
   yet)"). A function nobody is on says "No crew yet" in red. **This week** opens the next seven days by day.
4. **Money due.** One line: "Rs 75,000 owed · 2 clients · next due 2 Oct". It opens Invoices.

The head line is the day itself ("Tuesday 29 September", the IST day the feed was cut for). The "open items"
numeral, the kind line ("1 enquiry · 1 invoice · 2 events"), the cards and the Done today table are gone with
`components/worklist/TodayCards.tsx`, as the report says (each repeated what a list already shows; E2, E13).

Every read is an existing door (the worklist feed, leads, lead detail, the day, the bands, events, invoices);
nothing writes, and nothing in dream-os changed.

### Crew wherever an event shows
`lib/worklist/crew.ts` reads the crew for a window from the bands door once and gives it to every surface, in
words: first names, "(not replied yet)", "(declined)", and "No crew yet" in red.
- Home's Today and This week.
- Events: each row's facts end with its crew. The row's client chip ("Also a client · Aanya Kapoor · Booked · Rs
  1,000 in") is stage 1's, whole; a first cut had shortened it to "Also a client", which took away what the founder
  did not ask to remove, and b123 caught it (below).
- Calendar: Coming up lists each function's crew; the Weddings board shows first names instead of initials;
  the day sheet shows the crew under each function.

### The pinned rooms: kept, moved under More
`PinnedRooms` is unchanged and now mounts on More (`/vendor/rooms`), above the rooms, instead of on Home. Nothing
about the pins was deleted.

### Help cards
Today's "?" names only what Home draws: Check and Open in calendar, Reply to, This week; it connects Money due to
Invoices and says the pinned rooms are in More.

## Screenshots
`shots/stage-2/before/` (stage 1's tip) and `shots/stage-2/after/` (this branch): Today, Enquiries, Calendar, a
client and Money, at 374x812 and 360x800, dark and light.

## The floor

Run with `bash scripts/run-floor.sh`, `ANTHROPIC_API_KEY` and `DEEPSEEK_API_KEY` unset, in a clean worktree at
`8c11c91`, alone (no other bench or dev server running).

| | RED | ERROR | REFUSED |
|---|---|---|---|
| main (`85c66ef`) | 43 | 1 | 7 |
| stage 1 (as run at `ba004c1`; three reds there were a port clash and a probe fix, green alone) | 45 | 1 | 7 |
| **stage 2 (`8c11c91`)** | **42** | **1** | **7** |

Against main the only difference is `tdw09_type`, green here (the new rungs satisfy it). No member is red here that
is not red on main. The reds main already had that this work touches fail only their main cells: b40 C50 and C102
(C102's count main's), b42's mock and byte cells, b82 (REFUSED on the sibling repo, the same two §12.3/§9 cells as
main), b122 3.5 (the sibling repo). The benches this stage wrote or amended: **b123 501/501, b140 552/552,
b146 65/65** in the floor, as they were run alone before it.

## Benches updated, and why

Each by label, with a note in the bench. None was loosened.

- **b146 (new)**: proves the Home in the real app against its own fixtures: the four parts in order; Check a date
  answering Free all day, Booked, Enquiry, a lost enquiry as free, a blocked day as booked; Reply to in the feed's
  order with last message and age; Today with time, place and crew, "No crew yet" in the critical ink, This week
  behind its link; Money due's one line; no dash or he/she; no sideways scroll at 374 and 360, nothing cut off;
  the pins kept and moved; crew read by Events and the Calendar; no words typed in the component.
- **b40**: C60, C65 and C68 to C74 retired by id with their reason (they held the numeral, the kind line, the fold,
  the invoice card's due line and the Done today ledger, all retired with TodayCards). Amended where they stand:
  C34 (no figure paints without a reading; the head's last arm is the day), C37 (t0 has no consumer on Home now), C61 (Reply to renders the feed's own list and
  re-sorts nothing; Home takes the earliest due date by walking, not sorting), C63 (FirstRun's gate), C64 (the
  truncation tell on Reply to), C66 (figures), C100 (Home's rows open their records by the keys those rooms read).
- **b122**: the pins scene reads More, where the pins now stand (4.5a: above the rooms; 4.5d: More's title and
  seat; 4.7: the list below does not move when they arrive); a new `today` scene gives Home's own chrome to the
  dock cells (4.6a/b).
- **b140**: 1.3, Today hands the head its date line (was its resting line); the "own status h1" check reads
  TodayHome in place of TodayCards.
- **b123**: its word and control comparison against main (3.1, 3.2) now takes the crew off both sides: the crew
  words stage 2 adds on Events and the Calendar, and the base's initials ring they replaced ("RS"). Everything else is
  compared exactly as before, which is how it found the shortened chip above. A new cell, **3.1c**, holds on every
  Events and Calendar scene that the crew IS drawn, in words (first names, their answer, or "No crew yet"), so the
  excusal cannot hide a missing crew. The crew elements carry one marker (`data-crew` and the row, list and sheet
  markers) that the probe reads. 16 new cells; 501/501.
