# TDW · CE-45 · FE-2 · CUT 2 · THE CALENDAR ON THE APP'S TYPE · HANDOVER

Base `4aaad4d3` (TYPE_1b r3, IGD-1 cut 1b, then G6-1 F-44.166, both on disjoint files; built on `afe6b076`, carried under R-45.14). dreamos-pwa only. Rung **b123**, extended. No vendor word changed: the census holds every line (C4).

## What he chose

He was shown an HTML mock-up with three numbered options (`TDW_CE45_FE2_CALENDAR_OPTIONS.html`, sha256 `04869252…`) and answered **"2"**:
- The month's name is the one large title (t1).
- The day numbers in the grid are one step larger (t2), in the unchanged 34px circles.
- The upcoming-list dates are one step down from the old big numerals (t2).

## What changed

**Five files take every size and face through `RUNG_FONT`** (lib/worklist/theme.ts, F7). They are `app/vendor/(shell)/calendar/screen.tsx`, `components/vendor/CalendarDaySheet.tsx`, `CalendarBlockSheet.tsx`, `CalendarBands.tsx` and `CalendarCrewSheet.tsx`. Each file's local face constant `F` is retired. 73 sites in all.

**The rung each site took:**
- The month goes to t1. The ‹ › arrows go to t2. The grid numerals (the fade days and the month's own) go to t2. The upcoming numeral goes to t2.
- An engagement's title in the list goes to t3. A band's title goes to t2. The Next Engagements count goes to t5.
- Chips keep t5 capitals: the Month/Weddings pill, the block reasons, the slot and hold-the-day pills.
- Buttons take t4 in sentence case (F5). That includes the day sheet's action pills (Move, Crew, Collab, Edit, Cancel, Mark paid). The first pass had left them at t5 in capitals; the capture caught it, and cell 6.2 now guards it.

**No other property moved.** The per-file multiset loses only the retired `F` constants' face lines and gains nothing. `tsc` is clean.

**Two markers for the rung**, no word moved: `data-cal-grid` on the month grid and `data-cal-next` on each upcoming row.

## The rung, b123

- **The stand-in** answers the Calendar's reads wire-shaped, from the pwa's own types: availability, hot dates, bands, the day and the team. On a bare `{ok:true}` the room would crash (e-108's class).
- **The scenes**, both themes: the month at rest, the Weddings view, a day's sheet, Block day and Crew. Every second tap is asserted.
- **6.1** checks that the month is the one t1 (the shell's + excluded), and every grid numeral and upcoming numeral is at t2.
- **6.2** checks that the day sheet's action pills are buttons at t4 in sentence case.
- **3.3** requires the Calendar's buttons to move case, and no other room's.
- **The render-mutation harness now runs the planted scene's own cells.** The per-scene cells were lifted into `sceneCells()`, so a mutation names whichever cell it reddens. Before, only 3.1 on Leads could be named.
  - M5 is re-expressed on this harness.
  - **M10**: the grid numerals back at t3 must redden 6.1.
  - **M11**: the action pills back at t5 in capitals must redden 6.2.

## F-44.177, folded into this cut (his order): the lead rows' tags whole

**What he saw.** On /vendor/leads, on his Android and his iPhone, the small outlined tags on a lead row ("WEDDING", "TDW", and "REFERRAL", drawn by the same code) showed their text's bottom cut off, and read awkwardly large.

**Why.** The tags sat INSIDE the row's name line (`components/vendor/slices/SliceRow.tsx`), and that line clips whatever spills out of it, because it ellipses a long name.
- Before TYPE_1 a tag was Jost 9 with `lineHeight: 1`, so its padded box fit inside the name's line.
- TYPE_1 put it on the t5 rung (DM Sans 11, the rung's own 1.3 line) and retired the hand-set line-height, as F1 requires. That made the padded box taller than the line.
- The containers render fallback faces, whose box still fit. The real DM Sans on his phones does not (A-45.9's lesson).

**Witnessed in the seat's container with the real faces loaded.** Today's layout puts each tag's box at 301.6-321.6px, inside a name line clipping at 300.3-320.6px: its bottom is cut.

**The cure.** The name clips alone, in its own span. Each tag becomes its own box beside it (`inline-flex`, never shrunk), which nothing clips. The tag stays the t5 rung in capitals at .08em. No word moved, and the order is the same.

**The rung.**
- The probe registers the REAL faces under next/font's own family names when `B123_FONT_DIR` holds the @fontsource woff2 files. They are fetched from the npm registry in the container and never committed. On his machine next/font loads them itself.
- The faces are registered after the room settles, because a dev server reloads the page once after its first load.
- **6.3**, on Leads at rest in both themes: every tag's text inside its box, and its box inside every clipping ancestor, in the real faces. On fallback faces the cell REFUSES, rather than passing.
- **M12** restores today's layout and must redden 6.3.

The tag is drawn only on lead rows (the TDW, Wedding and Referral flags are lead facts), so Leads is the one room that draws it.

## Named, not cured here

- F-38.22's brass `rgba(201,168,76,…)` hairlines in these files are colour, outside this sitting.
- The Calendar's words ("Anno", "Next Engagements", "Hot Dates", "Month | Weddings", the hot-date sentence) wait for the founder's census.
