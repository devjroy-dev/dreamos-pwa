# DESIGN-1 · Landing handover (for FE-5)

The approved vendor-app redesign (DESIGN-1, stages 1 to 5b), ready to land **behind its switches, with the master OFF**.
One landing branch per repo, each built from the stage branches and brought onto that repo's current main:

| Repo | Branch | Tip | Built on |
|---|---|---|---|
| dream-os | `design/landing` | see the report | `design/stage-4-book` (which holds `design/layout-switch`) + main `93f054f`, then main `24854d2` (derived again at the moment of the last merge) |
| dreamos-pwa | `design/landing` | see the report (this file is in it) | `design/stage-5b-pages` (which holds stages 2 to 5a) + `design/stage-1-look` + main `640d77e`, then main `3de27e0` (derived again at the moment of the last merge) |

Nothing is merged to main and there is no pull request. With the master off and no vendor on the per-vendor list, every
vendor sees today's layout; the new layout lives beside it (pwa `v2/`), served only to a vendor the switches name.

## 1 · The order

**dream-os first**, then dreamos-pwa. The pwa reads `layout` from `/me` and the search door; both must stand first.

1. **dream-os `design/landing`**, its four commits, in this order (plus the merge of main):
   - `539d082` **the per-vendor switch**: `src/lib/vendorLayout.js` `layoutFor(vendorId)` ('v2' when the switchboard
     flag is on, or the vendor's id is in the Railway variable `LAYOUT_V2_VENDOR_IDS`, a comma list of whole ids; else
     'classic'); `/me` carries it as `vendor.layout`. Migration **0185** (below).
   - `76a3b81` **the search door**: `GET /api/v2/vendor/search?q=` (`src/api/vendor/search.js`, one matcher home
     `src/lib/vendorSearch.js`), mounted in `src/api/vendor/core.js`; read only, scoped to her; no new table.
   - `d0fe005` **the master switch and its 30-day date**: `POST /api/admin/capabilities/layout/master` flips
     `flag.vendor_layout_v2` (the generic flip goes through the same home); the first ON is recorded once in
     `flag.vendor_layout_v2.first_on` (never flipped by hand); `GET /layout` shows it and the date the classic layout
     is kept until (+30 days). Removal is never automatic.
   - `9d3308e` **the one-tap Book, the server's half**: `src/lib/vendor/promotion.js` takes the function dates and the
     amount; `src/lib/vendor/unbooking.js` is Undo and Cancel booking (`POST /leads/unbook`).
   - the merges of main `93f054f` and then `24854d2`.
2. **Apply migration 0185** (written, never applied here). Main's latest is 0184 (with 0183 applied after it, recorded in
   `OUT_OF_ORDER.json`), so 0185 is the next number, no clash. It seeds two switchboard rows, both **off**:
   `flag.vendor_layout_v2` and `flag.vendor_layout_v2.first_on` (`on conflict (key) do nothing`).
3. **Leave `LAYOUT_V2_VENDOR_IDS` empty** until the founder's walk (section 6).
4. **dreamos-pwa `design/landing`**: the switch (middleware.ts serves `v2/` on the `tdw_layout=v2` cookie the pwa sets
   from `/me`), the switchboard's Vendor layout card, and the whole new layout under `v2/` and `app/v2/`.

## 2 · Every path

### dream-os (14)

```
A db/migrations/0185_vendor_layout_flag.sql
A scripts/b0185_layout_switch_bench.js
A scripts/d1_booking_bench.js
A scripts/d1_layout_master_bench.js
A scripts/d1_search_bench.js
M src/api/admin/capabilities.js
M src/api/vendor/core.js
M src/api/vendor/leadPackages.js
M src/api/vendor/me.js
A src/api/vendor/search.js
M src/lib/vendor/promotion.js
A src/lib/vendor/unbooking.js
A src/lib/vendorLayout.js
A src/lib/vendorSearch.js
```

### dreamos-pwa (292 code, bench and doc paths, and the screenshots under `docs/design/shots/`)

- **Shared with today's layout (8)**, the switch itself; main changed none of them:
  `middleware.ts`, `app/vendor/(shell)/layout.tsx`, `components/worklist/LayoutSwitch.tsx`,
  `lib/worklist/layoutSwitch.ts`, `app/admin/switchboard/LayoutPanel.tsx`, `app/admin/switchboard/page.tsx`,
  `lib/admin-api/index.ts`, `lib/admin-api/layoutSwitchCopy.ts`.
- **The new layout**: every file under `v2/` and the route shims under `app/v2/`.
- **Benches**: the `_v2` copies (they prove `v2/`; each classic original still proves today's layout) and the `d1_`
  benches.
- **Docs**: `docs/design/` (the stage reports, this handover, the tools, the shots).

The full list is the appendix at the end.

## 3 · Migrations

| Repo | Migration | State |
|---|---|---|
| dream-os | `0185_vendor_layout_flag.sql`: seeds `flag.vendor_layout_v2` and `flag.vendor_layout_v2.first_on`, both off | written, **not applied** |
| dreamos-pwa | none | |

## 4 · The conflicts resolved (each in favour of main's behaviour)

**dream-os.** The merges of main `93f054f` and `24854d2` (CE-46 G6-4 F-44.252, the shared-way Remove) had no textual
conflict; `24854d2` touches no file of ours. One file changed on both sides, `src/api/vendor/me.js`,
in separate hunks: ours adds `layout`, main's CE-46 ELZ-3 adds `price_share_enabled`. Both are kept.

**dreamos-pwa.** The merges had no textual conflict. `design/stage-1-look` was merged in only for its report commit
(STAGE-1.md and its shots, written after stage 2 branched). The real conflicts were behavioural: main's six new commits
changed 14 classic files whose `v2/` twins were copied before them, so the new layout would have lost main's behaviour.
Each twin was merged three ways (v2 ours, the merge base `85c66ef`, main theirs):

| File (v2 twin) | Conflict | Resolved |
|---|---|---|
| 8 files | none | main's changes merged in as they are: onboarding (b155), the Ads page and `ads.ts`/`adsWire.ts` (ADS-1 cut1e), Storefront, MetaRoomSections, `solutions/routes.ts`, `copy.ts` |
| `app/vendor/(shell)/number/page.tsx` | imports | our `@/v2/` paths, plus main's new `FinishInAppLine` |
| `app/vendor/(shell)/your-website/screen.tsx` | imports | our paths and CopyBox, plus main's `OwnName` and `publicUrlFor` |
| `components/solutions/OwnNumberFlow.tsx` | imports | our path, plus main's `asRemoved` |
| `lib/worklist/metaRoom.ts` | the quiet line | **main's** ruled words, "TDW stays quiet in that chat for" (F-g) |
| `components/worklist/PageHelp.tsx` | the help card | **main's**: "Ask TDW about this" removed from the card, only Got it; the "?" ring in teal. v2's HelpButton (the sheets' "?") kept |
| `lib/worklist/pageHelp.ts` | the Ads help lines | **main's** what and pays (Facebook, the payment method); the leads line keeps the new layout's tab name, Enquiries |
| `lib/worklist/pageHelp.ts` | every room's card (main's FE-4 how-to cards) | **main's card, word for word,** on every room the new layout draws as main does (25 rooms: Packages, Expenses, Books, Notes, Storefront, Couture, Team, Contracts, TDS, Advisor, Billing, Settings, and the Business Solutions, Number, Website, Wedding pages, Google reviews, Posts, Ads, Dates, Introductions, Referrals, Payment reminders, Collab and Exchange rows). The reworked rooms (More, Today, Enquiries, Clients, Invoices, Events, Calendar, Portfolio, Collab responses, the four record pages) keep cards naming their own buttons, since main's steps name buttons those screens no longer draw. Main's two new rules (1.8 a connects line on every card; 1.9 every button a step names is drawn) now hold for the v2 cards too: the Collab-responses card gained its connects line, and the Calendar card was reworded so "to block it" is not read as a button. |

**dreamos-pwa, main's second commit today (`3de27e0`, CE-46 ADS-2: the Posts caption in its own box).** The new layout
already drew the caption in its own box (the one CopyBox, stage 3), so the v2 Posts page conflicted in three places:
- **the caption box** takes **main's behaviour**: main's words (Copy, then Copied) for two seconds, and main's names for
  the box, the caption and its control (`data-caption-box`, `data-caption`, `data-copy`, which main's b143 cells read).
  It stays the one CopyBox;
- **CopyBox** was changed for all sites to match: two seconds, not 1.8; optional data names; and its style moved beside the
  box, so the box holds exactly the text and its one control (main's 10.1);
- **the page's CSS** keeps the new layout's rules; main's `.pst-capbox` and `.pst-copy` rules are not needed, since the
  box is the CopyBox;
- main's now-unused copied state was not carried into the twin.

On the benches:
- `b143_v2` takes main's ADS-2 cells and mutations at the v2 paths. M12 ("Copy moved out of the caption's box") is
  re-expressed by label for the CopyBox: the box loses its control's mark, the same claim broken.
- `d1_stage3` 4.5 is amended by label to main's words on the same box.

- **New on main, with v2 twins:**
  - `OwnName.tsx` is copied as it is, except that the live name sits in a CopyBox. The new layout's R-46.17 requires
    it (d1_stage3 4.7 found it). What the clipboard receives is main's.
  - `RemoveNumberSheet.tsx` is a v2 twin on the v2 theme; the new layout's OwnNumberFlow opens it.
- **Bench twins:**
  - `b126_v2` takes main's re-pin of the quiet line.
  - `b140_v2` takes main's FE-4 mutations at the v2 paths, and its label walk now also reads `v2/` (by label). As
    carried, it counted only main's tree and could not see a single v2 label.
  - `b143_v2` takes main's card line and mutations; its button stays the new layout's sentence case, "Open ads".
  - The b140 probe takes main's changes.

## 5 · The landing list (for the floor in the founder's Codespace)

1. **b123 and b123_v2**: never run in this session, by ruling. The whole floor runs once, in the Codespace.
2. **b77_v2's four reds**, from the layout split. They are the same at the stage-4 tip and on this branch:
   - the byte "written once" is looked for in `lib/solutions/copy.ts`, not `v2/lib/…`;
   - the `.sol-*` mock rules;
   - the theme tokens;
   - the header's rules.
3. **The lint lines** (none is new; each predates the landing):
   - `v2/app/vendor/(shell)/invoices/body.tsx:63`, `useCallback(makeDeleteRequest(vendorId), …)`, which is main's
     line too;
   - `v2/components/worklist/PageHelp.tsx` HelpButton's `setFirst` inside an effect, the same rule main's own line
     draws, since stage 3.
4. **b143_v2 as a whole**: at landing it outran the ten-minute run limit twice (it kept running past its own
   `timeout`), so it was stopped and not retried, by rule. Nothing was left running, and M2's planted width was put back.
   - What it reached: the states phase in full, green but for 2.1 below, and for 10.1, which is fixed since.
   - The caption cells 10.1 and 10.3 then passed in a short live probe of the v2 Posts page.
   - The floor runs it whole.
5. **b143_v2 2.1** (found at landing, and red at the 5b tip too, so it predates the landing): on the Ads draft at 374, Run's bottom is at 711.7
   and the Ask bar's top at 696, where the ruling asks for 44px clear. The new layout's search row takes the height.
   A fix belongs to a rework pass on Ads, which the founder decides from the table below.
6. **Main's own, noted:**
   - main's b140 M9 plants text ("tap Connect ad account. Meta opens") that main's own card no longer contains, so its
     `--mutate` reports the anchor missing on both layouts;
   - main's new benches (b120, b145, b147, b151, b155, b73, b74, obp_vendor_form) prove today's layout only. The split made
     `_v2` copies only of benches the stages amended; their v2 twins carry the same changes by the three-way merge;
   - main's PIN pages log a hydration mismatch (a background image style) in both layouts.
7. **dream-os**: every bench reading a changed file gives the same result on `design/landing` as on main, line for line.
   This clone has no packages, so the reds are the environment's and main's.

## 6 · What the founder walks after landing

1. **Switch DEV440 on**: put DEV440's vendor id in `LAYOUT_V2_VENDOR_IDS` (Railway, dream-os). The switchboard's
   Vendor layout card lists it. The master stays **off**.
2. Sign in as DEV440 and check each tab:
   - **Today:** Check a date, Reply to, Today with crew, This week, Money due, the Get found card.
   - **Enquiries:** the list; tap one for its page; swipe right to Book (Undo, Send on WhatsApp).
   - **Calendar:** the month, Good dates, tap a day.
   - **Clients:** tap one for her page; Open the invoice.
   - **Money:** the Money row; tap an invoice for its page (the schedule, Remind, Mark paid).
   - **More** (the coin), and the search box on every page.
   - A "?" on each.
3. **Switch off**: take the id back out. Everyone, DEV440 included, is on today's layout again.

## 7 · Every vendor page in the new layout

Each room is marked **RESTYLED** (new look only), **REWORKED** (layout changed) or **UNCHANGED**, with one 374-wide shot
of the new layout (Graphite).
- **Method:** each room was opened in both layouts on one server, by the switch's own cookie (`docs/design/tools/roomtable.mjs`).
- **The marks** come from the stage reports and those shots side by side.
- **What every page gains:** the new look (Teal Ledger, Inter on the review's scale, sentence case), the five tabs,
  the search row, and one scroll per page.
- **"RESTYLED"** means that and nothing more (plus the facts named).
- **No room is pixel-identical.** The one UNCHANGED differs only in its single chip's case.
- **Tally:** 12 REWORKED, 31 RESTYLED, 1 UNCHANGED, and the two PIN pages, which a signed-in vendor never sees.

The founder decides from this table which rooms get a rework pass. Nothing further is built here.

| Room | Where | Mark | What changed | 374 shot |
|---|---|---|---|---|
| Today (Home) | Today tab | **REWORKED** | Home is the day's work (stage 2): Check a date, Reply to, Today with crew, This week, Money due; the Get found card (stage 3). Pinned rooms moved to More. | ![Today (Home)](shots/rooms/today.png) |
| Events | Today tab | **REWORKED** | A tap opens the event's page (5b); crew on every row (stage 2); the Today tab's room row above. | ![Events](shots/rooms/events.png) |
| An event (page) | Events | **REWORKED** | New (5b): back, status, Mark done or Open the client, Dates (day, time, crew), Money, Notes, History, jobs. | ![An event (page)](shots/rooms/event-page.png) |
| Enquiries | Enquiries tab | **REWORKED** | A tap opens the enquiry's page (5a); swipe right opens the one-tap Book sheet (stage 4); "Leads" is "Enquiries". | ![Enquiries](shots/rooms/leads.png) |
| An enquiry (page) | Enquiries | **REWORKED** | New (5a): Reply on WhatsApp, Book or Open the client on top; Dates, Money (package and plan), Notes, History; Book and Attach package as sheets. | ![An enquiry (page)](shots/rooms/enquiry-page.png) |
| Referrals | Enquiries tab | **RESTYLED** | New look; the Enquiries tab's room row above. | ![Referrals](shots/rooms/referrals.png) |
| Calendar | Calendar tab | **RESTYLED** | New look; crew named on each function (stage 2); "Hot dates" reads "Good dates"; scrolls as one page. | ![Calendar](shots/rooms/calendar.png) |
| Clients | Clients tab | **REWORKED** | A card opens the client's page (5a); cards otherwise as they were. | ![Clients](shots/rooms/clients.png) |
| A client (page) | Clients | **REWORKED** | New (5a): Open the invoice or Message on WhatsApp on top; Dates, Money, Notes, History; Edit, Hide, Cancel booking. | ![A client (page)](shots/rooms/client-page.png) |
| Contracts | Clients tab | **RESTYLED** | New look; a link she sends sits in its own copy box (R-46.17); scrolls as one page. | ![Contracts](shots/rooms/contracts.png) |
| Notes | Clients tab | **RESTYLED** | New look; scrolls as one page. | ![Notes](shots/rooms/notes.png) |
| Invoices | Money tab | **REWORKED** | A tap opens the invoice's page (5b); the Money row (Payment reminders, Expenses, TDS, Books) on Invoices too. | ![Invoices](shots/rooms/invoices.png) |
| An invoice (page) | Invoices | **REWORKED** | New (5b): Send on WhatsApp on top; Dates, Money with the payment schedule, History; Mark paid, Edit, Cancel invoice. | ![An invoice (page)](shots/rooms/invoice-page.png) |
| Payment reminders | Money tab | **RESTYLED** | New look; the Money row above. | ![Payment reminders](shots/rooms/payment-reminders.png) |
| Expenses | Money tab | **RESTYLED** | New look; the Money row above; scrolls as one page. | ![Expenses](shots/rooms/expenses.png) |
| TDS | Money tab | **RESTYLED** | New look; the Money row above. | ![TDS](shots/rooms/tds.png) |
| Books | Money tab | **RESTYLED** | New look; the Money row above. | ![Books](shots/rooms/books.png) |
| More | the coin (top right) | **REWORKED** | New (stage 3): pinned rooms, the founder's five groups of rows, Your account. It replaces the old Rooms grid (/vendor/rooms now opens Today). | ![More](shots/rooms/more.png) |
| Storefront | More | **RESTYLED** | New look; scrolls as one page. | ![Storefront](shots/rooms/storefront.png) |
| Portfolio | More | **REWORKED** | The photos are the page (stage 2): one line, one row of buttons, the filters in one row, the grid edge to edge; the explanations moved into its "?" card. | ![Portfolio](shots/rooms/portfolio.png) |
| Packages | More | **RESTYLED** | New look. | ![Packages](shots/rooms/packages.png) |
| Your website | More | **RESTYLED** | New look; the address, and your own name once live, sit in copy boxes (R-46.17). | ![Your website](shots/rooms/your-website.png) |
| Wedding pages | More | **RESTYLED** | New look. | ![Wedding pages](shots/rooms/wedding-pages.png) |
| Google reviews | More | **RESTYLED** | New look (its body is empty in the harness, which has no reviews data). | ![Google reviews](shots/rooms/google-reviews.png) |
| Posts & ads | More | **RESTYLED** | New look; a caption she copies sits in its own box (R-46.17). | ![Posts & ads](shots/rooms/posts.png) |
| Ads | Posts & ads | **RESTYLED** | New look (main's ADS-1 cut1e carried in). b143_v2 2.1: Run sits under the Ask bar at 374, on the landing list. | ![Ads](shots/rooms/ads.png) |
| Your own number | More | **RESTYLED** | New look (main's G6-4 "room finished" carried in). | ![Your own number](shots/rooms/number.png) |
| Couture | More | **RESTYLED** | New look. | ![Couture](shots/rooms/couture.png) |
| Team | More | **RESTYLED** | New look. | ![Team](shots/rooms/team.png) |
| Collab | More | **RESTYLED** | New look; scrolls as one page. | ![Collab](shots/rooms/collab.png) |
| Collab responses | Collab | **REWORKED** | Light: the two sentences above the list moved into its "?" card (stage 2). | ![Collab responses](shots/rooms/collab-responses.png) |
| Influencer exchange | More | **RESTYLED** | New look. | ![Influencer exchange](shots/rooms/exchange.png) |
| Introductions | More | **RESTYLED** | New look. | ![Introductions](shots/rooms/introductions.png) |
| Open dates & rates | More | **RESTYLED** | New look. | ![Open dates & rates](shots/rooms/dates.png) |
| Advisor | More | **RESTYLED** | New look (the one page without the Ask TDW bar; it is the assistant). | ![Advisor](shots/rooms/advisor.png) |
| Business Solutions | More | **RESTYLED** | New look. | ![Business Solutions](shots/rooms/support.png) |
| Billing | More | **RESTYLED** | New look. | ![Billing](shots/rooms/billing.png) |
| Settings | More | **RESTYLED** | New look; its Where enquiries go section is also held under the Enquiries tab. | ![Settings](shots/rooms/settings.png) |
| Onboarding | outside the shell | **RESTYLED** | Type only (Inter, sentence case); no layout change. | ![Onboarding](shots/rooms/onboarding.png) |
| Discover | outside the shell | **RESTYLED** | Type only. | ![Discover](shots/rooms/discover.png) |
| Discover profile | outside the shell | **RESTYLED** | Type only. | ![Discover profile](shots/rooms/discover-profile.png) |
| Discover preview | outside the shell | **UNCHANGED** | Its one drawn control, the Preview chip, takes sentence case; 0.3% of pixels differ. | ![Discover preview](shots/rooms/discover-preview.png) |
| Discover submit | outside the shell | **RESTYLED** | Type only. | ![Discover submit](shots/rooms/discover-submit.png) |
| PIN reset | outside the shell | **RESTYLED** | Type only. The dev badge in its shot is a hydration mismatch main's PIN pages log in both layouts. | ![PIN reset](shots/rooms/pin-reset.png) |
| PIN, PIN login | outside the shell | UNCHANGED (not shown) | A signed-in vendor is sent on to Home in both layouts; their files take the new type only. | none (they land on Today) |

## Benches run on each landing branch (only those reading changed files, and the d1_ benches; no floor)

**dream-os `design/landing`**:
- d1_layout_master 16/16, d1_search 22/22, d1_booking 19/19, b0185_layout_switch 13/13, rerun after `24854d2` too.
- The 34 other benches reading a changed file: results identical to main's, line for line.

**dreamos-pwa `design/landing`**:
- d1_records5b 39/39, d1_records 24/24, d1_help 10/10, d1_stage3 37/37, d1_book 32/32, d1_layout_switch 19/19,
  d1_layout_panel 15/15;
- tdw41_v2 25/25; b80_v2 47/47; b81_v2 65/65; b57_v2 192/192; b126_v2 48/48;
- b140_v2 646/646; its mutations each bite except main's stale M9 (5.6);
  CORRECTION (FE-5, CE-47, 30 Sept 2026): the 646/646 cannot have included /vendor/rooms, which the new layout sends to Today; §2 crashed on it at landing. It is now left out of §2 by label, and cell 2.0 proves it lands on /vendor/today.
- b40_v2 has main's C50 and C102 only, as at 5b; b82_v2 only the check that needs the dream-os font file; b122_v2
  80/81 (main's 3.5); b77_v2 47/51 (5.2); b143_v2 as in 5.4 and 5.5;
- after `3de27e0`, every d1_ bench was run again (all green) and the caption probe passed;
- the typecheck is clean.

## Appendix · every dreamos-pwa path in the landing (screenshots under docs/design/shots/ aside)

```
app/admin/switchboard/LayoutPanel.tsx
app/admin/switchboard/page.tsx
app/v2/vendor/(legacy)/discover/page.tsx
app/v2/vendor/(legacy)/discover/preview/page.tsx
app/v2/vendor/(legacy)/discover/profile/page.tsx
app/v2/vendor/(legacy)/discover/submit/page.tsx
app/v2/vendor/(legacy)/layout.tsx
app/v2/vendor/(legacy)/onboarding/page.tsx
app/v2/vendor/(legacy)/pin-login/page.tsx
app/v2/vendor/(legacy)/pin-reset/page.tsx
app/v2/vendor/(legacy)/pin/page.tsx
app/v2/vendor/(shell)/advisor/page.tsx
app/v2/vendor/(shell)/billing/page.tsx
app/v2/vendor/(shell)/books/page.tsx
app/v2/vendor/(shell)/calendar/page.tsx
app/v2/vendor/(shell)/clients/[id]/page.tsx
app/v2/vendor/(shell)/clients/page.tsx
app/v2/vendor/(shell)/collab/[post_id]/responses/page.tsx
app/v2/vendor/(shell)/collab/page.tsx
app/v2/vendor/(shell)/contracts/page.tsx
app/v2/vendor/(shell)/couture/page.tsx
app/v2/vendor/(shell)/dates/page.tsx
app/v2/vendor/(shell)/events/[id]/page.tsx
app/v2/vendor/(shell)/events/page.tsx
app/v2/vendor/(shell)/exchange/page.tsx
app/v2/vendor/(shell)/expenses/page.tsx
app/v2/vendor/(shell)/google-reviews/page.tsx
app/v2/vendor/(shell)/introductions/page.tsx
app/v2/vendor/(shell)/invoices/[id]/page.tsx
app/v2/vendor/(shell)/invoices/page.tsx
app/v2/vendor/(shell)/layout.tsx
app/v2/vendor/(shell)/leads/[id]/page.tsx
app/v2/vendor/(shell)/leads/page.tsx
app/v2/vendor/(shell)/more/page.tsx
app/v2/vendor/(shell)/notes/page.tsx
app/v2/vendor/(shell)/number/page.tsx
app/v2/vendor/(shell)/packages/page.tsx
app/v2/vendor/(shell)/page.tsx
app/v2/vendor/(shell)/payment-reminders/page.tsx
app/v2/vendor/(shell)/portfolio/page.tsx
app/v2/vendor/(shell)/posts/ads/page.tsx
app/v2/vendor/(shell)/posts/page.tsx
app/v2/vendor/(shell)/referrals/page.tsx
app/v2/vendor/(shell)/rooms/page.tsx
app/v2/vendor/(shell)/settings/page.tsx
app/v2/vendor/(shell)/storefront/page.tsx
app/v2/vendor/(shell)/support/page.tsx
app/v2/vendor/(shell)/tds/page.tsx
app/v2/vendor/(shell)/team/page.tsx
app/v2/vendor/(shell)/today/page.tsx
app/v2/vendor/(shell)/wedding-pages/page.tsx
app/v2/vendor/(shell)/your-website/page.tsx
app/v2/vendor/layout.tsx
app/vendor/(shell)/layout.tsx
components/worklist/LayoutSwitch.tsx
docs/design/LANDING-HANDOVER.md
docs/design/STAGE-1-PATHS.txt
docs/design/STAGE-1.md
docs/design/STAGE-2-PATHS.txt
docs/design/STAGE-2.md
docs/design/STAGE-3-PATHS.txt
docs/design/STAGE-3.md
docs/design/STAGE-4-PATHS.txt
docs/design/STAGE-4.md
docs/design/STAGE-5A-PATHS.txt
docs/design/STAGE-5A.md
docs/design/STAGE-5B-PATHS.txt
docs/design/STAGE-5B.md
docs/design/tools/bookshots.mjs
docs/design/tools/harness.mjs
docs/design/tools/helpshots.mjs
docs/design/tools/layout-switch/closure.py
docs/design/tools/layout-switch/postbench.py
docs/design/tools/layout-switch/restructure.py
docs/design/tools/layout-switch/splitbench.py
docs/design/tools/measure.mjs
docs/design/tools/offcompare.mjs
docs/design/tools/recordprobe5b.mjs
docs/design/tools/recordshots.mjs
docs/design/tools/roomtable.mjs
docs/design/tools/searchshots.mjs
docs/design/tools/shots.mjs
lib/admin-api/index.ts
lib/admin-api/layoutSwitchCopy.ts
lib/worklist/layoutSwitch.ts
middleware.ts
scripts/b122_ce45_home_shelves_bench_v2.js
scripts/b123_ce45_fe2_type_bench_v2.js
scripts/b125_g61_enquiry_row_bench_v2.js
scripts/b126_igd1_meta_room_bench_v2.js
scripts/b134_ce45_fe2_ask_sheet_bench_v2.js
scripts/b140_ce46_fe4_page_help_bench_v2.js
scripts/b143_ads1_ads_page_bench_v2.js
scripts/b20_a3_assistance_pwa.proof.mjs
scripts/b40_worklist_shell_bench_v2.js
scripts/b42_g11_wedding_pages_bench_v2.js
scripts/b57_contracts_wiring_bench_v2.js
scripts/b59_seven_ink_census_v2.js
scripts/b77_shell2_hierarchy_bench_v2.js
scripts/b80_lc2_p1_shell_bench_v2.js
scripts/b81_lc2_p2_room_bench_v2.js
scripts/b82_lc2_p3_booking_bench_v2.js
scripts/d1_book_bench_v2.mjs
scripts/d1_help_bench_v2.mjs
scripts/d1_home_bench_v2.js
scripts/d1_layout_panel_bench.mjs
scripts/d1_layout_switch_bench.mjs
scripts/d1_records5b_bench_v2.mjs
scripts/d1_records_bench_v2.mjs
scripts/d1_stage3_bench_v2.mjs
scripts/lib/b122_home_shelves_probe_v2.mjs
scripts/lib/b123_type_probe_v2.mjs
scripts/lib/b134_ask_probe_v2.mjs
scripts/lib/b140_page_help_probe_v2.mjs
scripts/obp_vendor_form_v2.proof.mjs
scripts/rosterMint_v2.proof.ts
scripts/run-roster-mint-v2-proof.sh
scripts/tdw07_p4a_ig_v2.proof.mjs
scripts/tdw16_r2_leads_truth_v2.proof.mjs
scripts/tdw41_g34s2_pwa_v2.proof.mjs
v2/app/vendor/(legacy)/discover/page.tsx
v2/app/vendor/(legacy)/discover/preview/page.tsx
v2/app/vendor/(legacy)/discover/profile/page.tsx
v2/app/vendor/(legacy)/discover/submit/page.tsx
v2/app/vendor/(legacy)/layout.tsx
v2/app/vendor/(legacy)/onboarding/page.tsx
v2/app/vendor/(legacy)/pin-login/page.tsx
v2/app/vendor/(legacy)/pin-reset/page.tsx
v2/app/vendor/(legacy)/pin/page.tsx
v2/app/vendor/(shell)/WorklistBoot.tsx
v2/app/vendor/(shell)/advisor/page.tsx
v2/app/vendor/(shell)/billing/page.tsx
v2/app/vendor/(shell)/books/page.tsx
v2/app/vendor/(shell)/calendar/page.tsx
v2/app/vendor/(shell)/calendar/screen.tsx
v2/app/vendor/(shell)/clients/[id]/page.tsx
v2/app/vendor/(shell)/clients/body.tsx
v2/app/vendor/(shell)/clients/page.tsx
v2/app/vendor/(shell)/collab/[post_id]/responses/page.tsx
v2/app/vendor/(shell)/collab/[post_id]/responses/screen.tsx
v2/app/vendor/(shell)/collab/page.tsx
v2/app/vendor/(shell)/collab/screen.tsx
v2/app/vendor/(shell)/contracts/page.tsx
v2/app/vendor/(shell)/contracts/screen.tsx
v2/app/vendor/(shell)/couture/page.tsx
v2/app/vendor/(shell)/couture/screen.tsx
v2/app/vendor/(shell)/dates/page.tsx
v2/app/vendor/(shell)/events/[id]/page.tsx
v2/app/vendor/(shell)/events/body.tsx
v2/app/vendor/(shell)/events/page.tsx
v2/app/vendor/(shell)/exchange/page.tsx
v2/app/vendor/(shell)/expenses/body.tsx
v2/app/vendor/(shell)/expenses/page.tsx
v2/app/vendor/(shell)/google-reviews/page.tsx
v2/app/vendor/(shell)/introductions/page.tsx
v2/app/vendor/(shell)/invoices/[id]/page.tsx
v2/app/vendor/(shell)/invoices/body.tsx
v2/app/vendor/(shell)/invoices/page.tsx
v2/app/vendor/(shell)/layout.tsx
v2/app/vendor/(shell)/leads/[id]/page.tsx
v2/app/vendor/(shell)/leads/body.tsx
v2/app/vendor/(shell)/leads/page.tsx
v2/app/vendor/(shell)/more/page.tsx
v2/app/vendor/(shell)/notes/body.tsx
v2/app/vendor/(shell)/notes/page.tsx
v2/app/vendor/(shell)/number/page.tsx
v2/app/vendor/(shell)/packages/page.tsx
v2/app/vendor/(shell)/page.tsx
v2/app/vendor/(shell)/payment-reminders/page.tsx
v2/app/vendor/(shell)/portfolio/page.tsx
v2/app/vendor/(shell)/portfolio/screen.tsx
v2/app/vendor/(shell)/posts/ads/page.tsx
v2/app/vendor/(shell)/posts/page.tsx
v2/app/vendor/(shell)/referrals/page.tsx
v2/app/vendor/(shell)/rooms/page.tsx
v2/app/vendor/(shell)/settings/page.tsx
v2/app/vendor/(shell)/storefront/page.tsx
v2/app/vendor/(shell)/storefront/screen.tsx
v2/app/vendor/(shell)/support/page.tsx
v2/app/vendor/(shell)/tds/page.tsx
v2/app/vendor/(shell)/tds/screen.tsx
v2/app/vendor/(shell)/team/page.tsx
v2/app/vendor/(shell)/today/page.tsx
v2/app/vendor/(shell)/wedding-pages/page.tsx
v2/app/vendor/(shell)/your-website/OwnName.tsx
v2/app/vendor/(shell)/your-website/page.tsx
v2/app/vendor/(shell)/your-website/screen.tsx
v2/components/solutions/MetaRoomSections.tsx
v2/components/solutions/OwnNumberFlow.tsx
v2/components/solutions/RemoveNumberSheet.tsx
v2/components/solutions/SolutionsPieces.tsx
v2/components/vendor/AddSheet.tsx
v2/components/vendor/AtelierForm.tsx
v2/components/vendor/CalendarBands.tsx
v2/components/vendor/CalendarBlockSheet.tsx
v2/components/vendor/CalendarCrewSheet.tsx
v2/components/vendor/CalendarDaySheet.tsx
v2/components/vendor/ChatThread.tsx
v2/components/vendor/ClientBookingSheet.tsx
v2/components/vendor/CollabPostForm.tsx
v2/components/vendor/ConversationThread.tsx
v2/components/vendor/FilingChip.tsx
v2/components/vendor/Header.tsx
v2/components/vendor/InputBar.tsx
v2/components/vendor/MessageBubble.tsx
v2/components/vendor/MissingChips.tsx
v2/components/vendor/NeedFirst.tsx
v2/components/vendor/NotesBody.tsx
v2/components/vendor/ProfileMeter.tsx
v2/components/vendor/SettingsScreen.tsx
v2/components/vendor/ShootsBlock.tsx
v2/components/vendor/Toast.tsx
v2/components/vendor/TypingDots.tsx
v2/components/vendor/packages/BookingSheet.tsx
v2/components/vendor/packages/CancelBookingSheet.tsx
v2/components/vendor/packages/LeadPackageCard.tsx
v2/components/vendor/packages/PackageEditSheet.tsx
v2/components/vendor/packages/PackageFields.tsx
v2/components/vendor/records/ClientPage.tsx
v2/components/vendor/records/EnquiryPage.tsx
v2/components/vendor/records/SlicePages.tsx
v2/components/vendor/records/SliceRecord.tsx
v2/components/vendor/slices/BinderCard.tsx
v2/components/vendor/slices/BulkBar.tsx
v2/components/vendor/slices/DetailSheet.tsx
v2/components/vendor/slices/FilterRail.tsx
v2/components/vendor/slices/ForwardSheet.tsx
v2/components/vendor/slices/Masthead.tsx
v2/components/vendor/slices/SliceRow.tsx
v2/components/vendor/slices/SliceShell.tsx
v2/components/vendor/slices/SwipeRow.tsx
v2/components/vendor/slices/WishboneSheet.tsx
v2/components/worklist/AccountDrawer.tsx
v2/components/worklist/AddFab.tsx
v2/components/worklist/AdsCard.tsx
v2/components/worklist/AiDock.tsx
v2/components/worklist/AskSheet.tsx
v2/components/worklist/BillingRoom.tsx
v2/components/worklist/BooksBody.tsx
v2/components/worklist/CopyBox.tsx
v2/components/worklist/Fab.tsx
v2/components/worklist/FirstRun.tsx
v2/components/worklist/GetFoundCard.tsx
v2/components/worklist/PageHelp.tsx
v2/components/worklist/PinnedRooms.tsx
v2/components/worklist/RecordPage.tsx
v2/components/worklist/ReportIssueSheet.tsx
v2/components/worklist/RoomIcon.tsx
v2/components/worklist/RoomsGrid.tsx
v2/components/worklist/SearchBox.tsx
v2/components/worklist/SignOutSheet.tsx
v2/components/worklist/StudioSheets.tsx
v2/components/worklist/SundaySection.tsx
v2/components/worklist/TeamTabs.tsx
v2/components/worklist/TodayHome.tsx
v2/components/worklist/WlToast.tsx
v2/components/worklist/WorklistShell.tsx
v2/hooks/vendor/useChat.ts
v2/hooks/vendor/useOwnNumberRoom.ts
v2/hooks/vendor/useSettings.ts
v2/hooks/vendor/useVendorData.ts
v2/hooks/vendor/useVendorMe.ts
v2/lib/solutions/copy.ts
v2/lib/solutions/routes.ts
v2/lib/vendor/api/vendor.ts
v2/lib/vendor/billing/plans.ts
v2/lib/vendor/cabinet.ts
v2/lib/vendor/derive.ts
v2/lib/vendor/rosterMint.ts
v2/lib/vendor/settleWords.ts
v2/lib/worklist/ads.ts
v2/lib/worklist/adsWire.ts
v2/lib/worklist/billingChip.ts
v2/lib/worklist/book.ts
v2/lib/worklist/copy.ts
v2/lib/worklist/crew.ts
v2/lib/worklist/enquiryRouting.ts
v2/lib/worklist/feed.ts
v2/lib/worklist/getFound.ts
v2/lib/worklist/googleReviews.ts
v2/lib/worklist/home.ts
v2/lib/worklist/icons.ts
v2/lib/worklist/metaRoom.ts
v2/lib/worklist/packages.ts
v2/lib/worklist/pageHelp.ts
v2/lib/worklist/paymentReminders.ts
v2/lib/worklist/record.ts
v2/lib/worklist/referrals.ts
v2/lib/worklist/rooms.ts
v2/lib/worklist/search.ts
v2/lib/worklist/tabs.ts
v2/lib/worklist/theme.ts
```
