# DESIGN-1 · Stage 3: five tabs, and More behind the coin

Branch `design/stage-3-tabs`, built on `design/stage-2-home`. What the founder sanctioned for this stage: five tabs,
Today, Enquiries, Calendar, Clients and Money, holding the rooms `docs/review/REPORT.md` §3 lists for each, except
Billing, which goes under More; and More as the profile coin, in his groups. Every changed path is in
`STAGE-3-PATHS.txt`.

## What changed

### Five tabs
The bar is five seats, drawn from one registry, `lib/worklist/tabs.ts`:

| Tab | Opens | Holds (the seat is lit on each) |
|---|---|---|
| Today | Home | Home, Events (Home's This week is the week; Events is the full list) |
| Enquiries | Enquiries | Enquiries, Referrals (received), Where enquiries go (the routing section in Settings) |
| Calendar | Calendar | Calendar (blocked dates, good dates and each day's crew are the Calendar's own) |
| Clients | Clients | Clients, Contracts, Notes |
| Money | Invoices | Invoices, Payment reminders, Expenses, TDS, Books |

On every room a tab holds except its first, a row under the room's head lists the tab's rooms, the current one
marked, so Expenses, TDS and Books are one tap from each other and from Invoices. "Where enquiries go" opens
Settings at that section (`#enquiry-routing`). The report's "Notes due today" on Home and its merges (one Money
page with tabs, Events into Calendar) were not sanctioned for this stage and are not built.

The app now opens on Today: the manifest's `start_url`, the bare `/vendor` address and the front door for a signed-in
vendor all say `/vendor/today` (they said `/vendor/rooms`, the directory that became More).

### More is the coin
The coin (the vendor's initials, top right) is a link to More (`/vendor/rooms`). More holds, in order:
- **Pinned**: the pinned rooms, moved here in stage 2, unchanged.
- The founder's groups, as rows (each 64 high: the room's icon, his name for it, its one line):
  - **Your business**: Packages, Team, Settings, Billing
  - **Get found**: Your website, Storefront, Portfolio, Wedding pages, Google reviews, Posts and ads
  - **Work together**: Collab, Influencer exchange, Introductions, Referrals
  - **Messages**: WhatsApp and Instagram (wears Coming, as it did on Business Solutions)
  - **Help**: Advisor, Business Solutions, Support (opens TDW on WhatsApp)
- **Your account**: the coin's old menu, the same component (`AccountDrawer`), minus the rows now in the groups
  (Settings and Billing are in Your business; TDW on WhatsApp is Support): Report an issue, Graphite, Chalk,
  Sign out.
- The add button stays on this page, as before.

The three shelves (Business, Money, Studio) and the top pair are gone with their reader; `SHELVES` and the shelf
names left the registry and the copy register, with a note where each stood.

### For the founder: Couture
Couture ("Client appointments, for designers") is in no tab and in none of the More groups he listed. It is still
reached by the trade it serves: it is one of a designer's six pinned rooms, which sit at the top of More. If it
should also have a row in More, it is one line in `MORE_GROUPS`.

### Help cards
- More's "?" names what More draws: the groups and their rows, the account rows (Report an issue, Graphite, Chalk,
  Sign out), the pinned rooms; its one sentence about the app says the five tabs hold the daily work and the
  initials open More.
- Today's "?" says the pinned rooms are in More, behind the initials.

## Screenshots
`shots/stage-3/before/` (stage 2's tip) and `shots/stage-3/after/` (this branch): Today, Enquiries, Calendar, a
client and Money, at 374x812 and 360x800, dark and light; and More.

## The floor

STAGE3_FLOOR

## Benches updated, and why

Each by label, with a note in the bench. None was loosened.

STAGE3_BENCHES
