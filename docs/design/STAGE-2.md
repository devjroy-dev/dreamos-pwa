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

### Portfolio: the photos are the page (the founder, 29 Sept)
Before, a vendor with photos saw the Upload row, a full-width preview button, the filters, and up to four lines of
explanation before the first photo, which started 469 px down an 812 px screen. Now, above the grid:
- **One row of buttons:** Upload, and beside it Import from Instagram (Connect Instagram until an account is
  linked). The Instagram button keeps its gate: it shows only when the server reports the import wired.
- **The filters,** in one row at every width (at 360 they wrapped to two rows before).
- **At most one short line:** the count ("9 of 40 photos"), or at the cap the cap sentence; an expired Instagram
  link or, on an iPhone home-screen app, the press-and-hold instruction beside Connect Instagram take its place.

The grid starts at 281 px, edge to edge inside the 16 px margin, at 374 and 360, both themes. Below the grid: "See
your profile as couples do", "Connected as @…" and Disconnect Instagram.

Every explanation moved to the page's "?" card, word for word, into `PORTFOLIO_HELP` in `lib/worklist/pageHelp.ts`
(their one home now; the screen reads H3 from there for its "?ig=cancelled" toast):
- "Instagram is just the quicker way. Uploading from your phone works exactly the same, always." followed by
  "Instagram only allows this for professional accounts (business or creator). …"
- "Press and drag to reorder. The first photo is your cover." followed by "Switch to All to reorder. Filters show
  only some of your photos."
- "Couples see your approved photos. The rest are with our team."
- The connects line: "Photos are copied into your portfolio, so they stay put even if your Instagram changes."

Sentences on one subject share a line; none is reworded. On a 374×812 phone the card reaches its 60% height and its
two buttons need a short scroll inside it (b140's fit check passes).

Screenshots: `shots/stage-2/portfolio/` (before at 374; after at 374 and 360, both themes, linked and unlinked, below
the grid, and the "?" card), taken against fixtures (9 photos, a 40-photo cap) because the mock account has none.

**Every other page with photos or a list, checked** (each route measured at 374×812, and the with-data state read in
the code):
- **Changed: Collab responses.** Two sentences of explanation stood above the list of interested vendors ("Their
  identity is revealed to you because you posted the requirement. Tap Connect to share contact details with both of
  you."). They moved, word for word, to that page's "?" card (`RESPONSES_HELP`).
- **Left as they are, and why:**
  - Enquiries, Clients, Invoices, Expenses, Events, Notes, Team, Packages, Wedding pages, Google reviews, Referrals,
    Collab: only controls (search, tabs, filters) and state (a total, a count, a section head) above the first row.
  - Introductions, the Influencer exchange, Posts and Your website: one short line above the list or photo (the
    exchange's line is a notice of a temporary state).
  - Contracts: the policies card above the agreements carries one sentence, which changes with whether the policies
    are set; it is the card's call to set them up.
  - Storefront has no photos; its two rows sit under the bio and the public page blocks. That page's order is a
    different question from this one, and is left for the founder.

### Help cards
Today's "?" names only what Home draws: Check and Open in calendar, Reply to, This week; it connects Money due to
Invoices and says the pinned rooms are in More.

## Screenshots
`shots/stage-2/before/` (stage 1's tip) and `shots/stage-2/after/` (this branch): Today, Enquiries, Calendar, a
client and Money, at 374x812 and 360x800, dark and light.

## The floor

Run with `bash scripts/run-floor.sh`, `ANTHROPIC_API_KEY` and `DEEPSEEK_API_KEY` unset, in a clean worktree, alone
(no other bench or dev server running), on the branch's final code commit `d822ae9`.

| | RED | ERROR | REFUSED |
|---|---|---|---|
| main (`85c66ef`) | 43 | 1 | 7 |
| stage 1 (as run at `ba004c1`; three reds there were a port clash and a probe fix, green alone) | 45 | 1 | 7 |
| stage 2 before the Portfolio change (`8c11c91`) | 42 | 1 | 7 |
| **stage 2 final (`d822ae9`)** | **43** | **1** | **7** |

Against main: `tdw09_type` is green here (the new rungs satisfy it), and **b140 was red in this run and green on its
re-run**. In the floor its dev server answered 500 on every page with Turbopack's "next/font/google queries have
exactly one entry", a stale `.next/dev` font cache left in the floor tree by an earlier member (the same error this
work met once before and cured the same way). No cell past the static seven ran. Run once more, alone, on the same
commit in the same tree with that cache cleared: **b140 554/554**. The floor before it (`ef77d84`, the same b140 and
the same pages) had it at 554/554 as well.

The reds main already had that this work touches fail only their main cells: b40 C50 and C102 (C102 one below main's
count), b42's mock and byte cells, b82 (REFUSED on the sibling repo; its same two §12.3/§9 cells), b122 3.5 (the
sibling repo), tdw07_p3_portfolio (its 85 main cells, no more). The benches this stage wrote or amended, in the floor:
**b123 501/501, b146 65/65, b126 48/48, tdw07_p4a_ig 69/69, tdw07_p4b_probe 35/35, tdw07_p4b_slice1 30/30**, and
b140 554/554 on its re-run.

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
- **tdw07_p4a_ig** (Portfolio): §1.5 and §1.6 pinned the earlier doctrine that H3 is read on the page before the
  Connect action. By the founder's word H3 left the page; the cells now hold that H3 is read FIRST in the Portfolio
  "?" card (before the account rule) and renders nowhere on the page, and that the Instagram action keeps its gate
  beside Upload. §5.1 for H2, H3 and H12 now holds their exact bytes in `PORTFOLIO_HELP`, stricter than the slot names
  it read before. The mutation ledger's V-2 was rewritten and checked by hand: putting H2 before H3 in the card turns
  §1.5 red (restored byte for byte after).
- **b126**: 1.2 reads the portfolio's H2 where it lives now (`PORTFOLIO_HELP`), still byte for byte against the Meta
  room's sentence.
- **tdw07_p4b_probe**: unchanged. The Connect anchor and the iPhone instruction keep the exact shapes it pins.
- **b140**: 1.3, Today hands the head its date line (was its resting line); the "own status h1" check reads
  TodayHome in place of TodayCards.
- **b123**: its word and control comparison against main (3.1, 3.2) now takes the crew off both sides: the crew
  words stage 2 adds on Events and the Calendar, and the base's initials ring they replaced ("RS"). Everything else is
  compared exactly as before, which is how it found the shortened chip above. A new cell, **3.1c**, holds on every
  Events and Calendar scene that the crew IS drawn, in words (first names, their answer, or "No crew yet"), so the
  excusal cannot hide a missing crew. The crew elements carry one marker (`data-crew` and the row, list and sheet
  markers) that the probe reads. 16 new cells; 501/501.
