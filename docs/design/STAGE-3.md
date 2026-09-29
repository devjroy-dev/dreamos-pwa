# DESIGN-1 · Stage 3: five tabs, More behind the coin, the layout switch, and the consolidated additions

Branch `design/stage-3-tabs`, built on `design/stage-2-home`. Every changed path is in `STAGE-3-PATHS.txt`.
dream-os's half is on its own branch, `design/layout-switch` (never merged by this work).

What the founder sanctioned for this stage:
- five tabs, Today, Enquiries, Calendar, Clients and Money, holding the rooms `docs/review/REPORT.md` §3 lists for
  each, except Billing, which goes under More;
- More as the profile coin, in his groups;
- Portfolio scrolls as one page, and every vendor page is checked for nested scroll boxes;
- the layout switch;
- the consolidated additions: the universal search, which is also Ask TDW; a Home card for a Get found room not
  set up yet; More keeps his headings; and R-46.17.

## The layout switch (read this first)

**Every vendor sees today's layout unless her setting says otherwise.** The redesign (stages 1 to 3, and 4 and 5
when they come) is a parallel tree. Today's layout is kept whole as the standby, and switching back is one setting.

**The setting (dream-os, `design/layout-switch`).** It uses the switchboard the estate already has, the way
`IG_DM_WALK_VENDOR_IDS` works; there is no new column.
- **Global default:** the flag `flag.vendor_layout_v2` on the capabilities switchboard. Migration
  `0185_vendor_layout_flag.sql` seeds it **off**. It is written, not applied.
- **Per vendor:** the Railway variable `LAYOUT_V2_VENDOR_IDS`, a comma list of vendor ids, read as whole ids.
- **One predicate home:** `src/lib/vendorLayout.js` `layoutFor(vendorId)` answers `'v2'` when the flag is on or the
  vendor is listed, and `'classic'` otherwise, including when the switchboard cannot be read.
- `GET /me` carries it as `vendor.layout`. The admin read door `GET /api/admin/capabilities/layout` reports the
  default and the list.
- Bench: `b0185_layout_switch_bench.js`, 13/13.

**The pwa.** The layout is decided once, at the shell's root.
- `components/worklist/LayoutSwitch.tsx` is mounted in each shell layout and names the tree it serves. It reads
  `/me` and keeps the answer in one cookie, `tdw_layout`. If the answer names the other tree, it reloads once per
  tab (guarded, never a loop).
- `middleware.ts` serves `/vendor/*` from the v2 route tree (`app/v2/vendor`, thin shims over the code in `v2/`)
  when the cookie says `v2`, and leaves every other request alone. A direct `/v2/...` address redirects to the
  address it mirrors.
- No cookie, a cookie that is not a layout, or an older `/me` without the field: today's layout.

**The standby is identical to the user, not only in the source.**
- The shared tree differs from `main` in four places, and nowhere else: `middleware.ts`, the classic shell layout's
  one `<LayoutSwitch tree="classic" />`, and two new files (`lib/worklist/layoutSwitch.ts`,
  `components/worklist/LayoutSwitch.tsx`).
- Every file stages 1 to 3 changed is back to `main` at its own path. Its redesigned copy lives at `v2/<same path>`,
  and every module it reaches is copied beside it.
- **Proof (pixels):** with the switch OFF, main vs this tree, the eight pages the chair named (Home, Leads,
  Calendar, Clients, Invoices, Portfolio, Settings, Posts and ads), at 374, dark and light: **16 of 16 identical**.
  GPU raster was off; main was shot twice to separate its own noise. The tool is `docs/design/tools/offcompare.mjs`.
  The full set of pages runs in the final floor.
- **Proof (benches):** every bench stages 1 to 3 amended is split by label.
  - The original, at its own path, is `main`'s again, byte for byte except `b20`'s scope label (below). It proves
    the classic tree.
  - A `_v2` copy proves the redesign. It reads the tree as v2 serves it: shared files plus `v2/`, with a shared file
    left out where its v2 twin exists.
  - The dev-server copies serve v2 through the bench seam `TDW_LAYOUT_DEFAULT=v2`, which is unset in production.
  - The split is generated, never hand-copied: `docs/design/tools/layout-switch/` (`closure.py`, `restructure.py`,
    `splitbench.py`, `postbench.py`).
- **Each vendor sees only her own layout:** `scripts/d1_layout_switch_bench.mjs`, 19/19. It drives the real
  `LayoutSwitch`, `layoutSwitch.ts` and `middleware.ts` on one phone:
  - A (v2) signs in and is served v2 at the same addresses;
  - B (classic) signs in after her, and the cookie flips and B is served classic;
  - C's older `/me` changes nothing;
  - a tree that does not flip reloads once, never in a loop.

  Five mutations each turn a cell red.

**Removing the old layout: a separate later cut, 30 days after the global switch.** Once `flag.vendor_layout_v2` has
been on for every vendor for 30 days:
1. delete each classic file that has a v2 twin;
2. move `v2/*` back to its own path, rewriting `@/v2/` imports to `@/`;
3. delete `app/v2/` and the rewrite block in `middleware.ts`;
4. retire `LayoutSwitch`, `lib/worklist/layoutSwitch.ts` and the `tdw_layout` cookie;
5. give each `_v2` bench its original's name, replacing the classic original;
6. in dream-os, retire `vendorLayout.js`, the `/me` field, the admin read door and the flag row (through the
   switchboard), and drop `LAYOUT_V2_VENDOR_IDS` from Railway.

Nothing in this stage depends on that cut.

## What changed in the new layout

### Five tabs
The bar is five seats, drawn from one registry, `v2/lib/worklist/tabs.ts`:

| Tab | Opens | Holds (the seat is lit on each) |
|---|---|---|
| Today | Home | Home, Events (Home's This week is the week; Events is the full list) |
| Enquiries | Enquiries | Enquiries, Referrals (received), Where enquiries go (the routing section in Settings) |
| Calendar | Calendar | Calendar (blocked dates, good dates and each day's crew are the Calendar's own) |
| Clients | Clients | Clients, Contracts, Notes |
| Money | Invoices | Invoices, Payment reminders, Expenses, TDS, Books |

On every room a tab holds except its first, a row under the room's head lists the tab's rooms with the current one
marked. So Expenses, TDS and Books are one tap from each other and from Invoices. "Where enquiries go" opens
Settings at that section (`#enquiry-routing`).

Not built, because they were not sanctioned for this stage: the report's "Notes due today" on Home, and its merges
(one Money page with tabs, Events into Calendar).

The new layout opens on Today:
- the bare `/vendor` goes to Today;
- `/vendor/rooms`, where the installed app and the front door land (the shared manifest and front door are
  `main`'s, unchanged), goes to Today too.

### More is the coin, with the founder's headings
The coin (her initials, top right) links to More (`/vendor/more` in the v2 tree). More holds, in order:
- **Pinned**: the pinned rooms, moved here in stage 2, unchanged.
- The founder's groups, as rows (each 64 high: the room's icon, his name for it, its one line). The headings stay;
  it is never one flat list.
  - **Your business**: Packages, Team, Settings, Billing
  - **Get found**: Your website, Storefront, Portfolio, Wedding pages, Google reviews, Posts and ads
  - **Work together**: Collab, Influencer exchange, Introductions, Referrals
  - **Messages**: WhatsApp and Instagram (wears Coming, as it did on Business Solutions)
  - **Help**: Advisor, Business Solutions, Support (opens TDW on WhatsApp)
- **Your account**: the coin's old menu, the same component (`AccountDrawer`), minus the rows now in the groups:
  Report an issue, Graphite, Chalk, Sign out.
- The add button stays on this page.

The three shelves (Business, Money, Studio) and the top pair are gone with their reader.

**For the founder: Couture.** Couture ("Client appointments, for designers") is in no tab and in none of the More
groups he listed. It is still one of a designer's six pinned rooms, at the top of More. If it should also have a
row in More, that is one line in `MORE_GROUPS`.

### Every page scrolls as one (Settings' cure), Portfolio first
Portfolio's photos scrolled inside a small inner box. Measured at 374 before the fix: the box was 408 high holding
1355, and the page itself did not scroll.

The cure is Settings' shape (F-44.166):
- the page's block takes its natural height (`flex: 0 0 auto`), never `flex: 1; min-height: 0`;
- the inner block clips sideways (`overflow-x: clip`) and sets no vertical overflow;
- `main.wl-main` is the one scroller, and the add button is fixed.

After: the page scrolls (1574) and nothing inside it does. Screenshots are in `shots/stage-3/portfolio-scroll/`:
`before-374-top`, `before-374-scrolled-to-end`, `after-374-top`, `after-374-scrolled-to-end`, `after-360-top`,
`after-360-scrolled-to-end`.

Every vendor page was checked at 374, 360 and desktop (1280) for an element that scrolls vertically inside the page.
Fixed the same way, in the v2 tree:

| Page | The nested box that was there |
|---|---|
| Enquiries, Clients, Invoices, Expenses, Events (list rooms) | `SliceShell`'s list body |
| Calendar | the month screen's body |
| Collab | the screen's body, and the responses list |
| Contracts | the screen's body |
| Notes | `NotesBody`'s list |
| Storefront | the screen's body |
| Portfolio | the screen's body (above) |

Kept on purpose:
- the Advisor's chat thread (a conversation scrolls in its own pane and keeps its composer in view);
- the horizontal filter rails (they scroll sideways, not down);
- the textarea;
- Your website's preview window.

Neither of the last two is a scroll box of page content.

### The universal search, which is also Ask TDW
One box under the header on every page of every tab. It sits outside the scroller, so it is always visible. As she
types, the results come grouped and labelled by kind:
- **Tools** first. A room opens by its name or by her word for it: "website", "TDS", "ads" (Posts and ads),
  "reviews", "photos" (Portfolio). These are matched in the pwa, which owns the rooms (`v2/lib/worklist/search.ts`).
- Then **her records**, from the dream-os search door `GET /api/v2/vendor/search`, in this order: Enquiries,
  Clients, Events, Invoices, Packages, Notes, Crew. There are five of each, with "n more in the room". A record opens
  in its room: `?lead=`, `?client=`, `?event=`, `?invoice=`; packages, notes and crew open their rooms.
- **The door reads her own records only.** Every read is scoped to her vendor id; invoices use her ledger's agent
  id, the scope the invoices door uses.
  - It reads only tables the rooms already list. There is **no new table**, and it never writes.
  - One matcher home, `src/lib/vendorSearch.js`:
    - spelling variants (Priya/Priyaa, Aggarwal/Agarwal; doubled letters, ph/f, w/v, ee/i, oo/u) and one slip in a
      word of five letters or more;
    - every word she types must match;
    - a couple by either partner's name or the wedding's name ("rohan" finds "Priya & Rohan", "kabir" finds
      "Ananya weds Kabir");
    - a phone by its last four digits or any four or more of them, ignoring spaces and +91.
  - Bench: `scripts/d1_search_bench.js`, 22/22.
- **Ask TDW:** when the text reads as a question (a question mark, or a question word and three words or more), the
  last row is **Ask TDW about this**. It opens the assistant in place with her words.
- **The assistant stays one tap away on every tab:** the Ask TDW bar is on every page but the Advisor, which is the
  assistant itself (there the box only searches).
- An empty box shows her **recent searches** (six, newest first, this phone only).

Screenshots are in `shots/stage-3/search/`: records (`meera`), a tool (`ads`), a question, and Home with the card,
at 374 and 360, dark and light. The harness answers the door with one fixed answer for every query, so the question
shot shows records above its Ask row; the real door answers each query.

### The Get found card on Home
One quiet card, last on Home after Money due, for one Get found room she has not set up, in this order. "Not set up"
is read from what each room itself reads:

| Card | Shown when |
|---|---|
| Your website | her page's own lines (`seo_title`, `seo_description` on `/me`) are both unwritten |
| Google reviews | she has not asked a single couple (`askedCount` 0 on the Google reviews door) |
| Posts and ads | Instagram is not connected (`/ig/status`) |

- A failed read shows nothing, because unknown is never "not set up".
- **Hide** puts that card away on this phone, and the next one waits for her next visit.
- It is not shown on a first run (FirstRun is Home then).

### R-46.17: the text she copies or forwards sits in its own box
One component, `v2/components/worklist/CopyBox.tsx`: the text, then Copy, and nothing else. It takes no children,
so no sentence can go inside, and any explanation sits outside it. Every site in the new layout that hands her a
text:

| Site | Text |
|---|---|
| Settings, TDW enquiry link | the wa.me link |
| Home's first-run card, Your link | the wa.me link (it copied a link it never showed; now the link is shown) |
| Your website, address | her address (Share and Open page outside the box) |
| Posts and ads | the caption (Download and Share outside the box) |
| Contracts, sending not open yet | the signing link, with "Send this link to (her first name) yourself" above the box, outside it (it was only copied, and a toast said so) |

`scripts/d1_stage3_bench_v2.mjs` has:
- a cell per site;
- a "joined" mutation per site (an explanation put inside the box turns that site's cell red);
- a mutation in the box itself;
- a census cell that turns red on any new clipboard writer.

The Advisor's message bubble (a bubble is its own box) and the legacy onboarding page (outside the shell; stage 5's
pages replace it) are named in the census.

### Help cards (every "?" stays true)
- More's "?" names what More draws. Its sentence about the app now also says the box at the top of every page
  searches and can ask TDW.
- Today's "?" gains one line for the Get found card: "When your website, Google reviews or posts and ads is not set
  up yet, one card at the end says so and opens it. Hide puts it away."

## Screenshots
- **Before:** `shots/stage-3/before/`, which is stage 2's tip (stage 2's after shots).
- **After:** `shots/stage-3/after/`, this branch served as the v2 tree.
- Both sets: Today, Enquiries, Calendar, a client and Money, at 374x812 and 360x800, dark and light.
- Also: `shots/stage-3/search/` and `shots/stage-3/portfolio-scroll/`.
- The classic layout's screenshots are `main`'s. The pixel proof above shows they are unchanged.

## The floor

STAGE3_FLOOR

## Benches updated, and why

Each by label, with a note in the bench. None was loosened.

- **The split (the layout switch).** Every bench stages 1 to 3 amended keeps `main`'s original at its own path,
  proving the classic tree, and gains a `_v2` copy proving the redesign. The `_v2` copies:
  - b40, b42, b57, b59, b77, b80, b81, b82, b122, b123, b125, b126, b134, b140, b143;
  - obp_vendor_form, rosterMint, tdw07_p4a_ig, tdw16_r2_leads_truth, tdw41_g34s2_pwa;
  - the probes `scripts/lib/b122/b123/b134/b140_*_v2.mjs`.

  The design's own Home bench (stage 2's b146) exists only for the v2 tree and is now `d1_home_bench_v2.js`.
- **Amendments in the `_v2` copies for the v2 world, by label (`postbench.py`):**
  - The walks read the v2 view of the tree (b40 C26, C31's graph, C47, C50 and its neighbours; b42 C5; b59 §1; b122
    5.3), so a classic twin is not counted as a v2 file.
  - b40 C17: the shared manifest and front door open `/vendor/rooms`, which is Today in v2.
  - b40 C31: More (`/vendor/more`) is a shell address.
  - b40 C35: the add button lives on More.
  - b80 §4 and §6.8: the v2 copy imports its twins by `@/v2/`.
- **b20 (main's, one scope label):** its tree walk skips `v2/` and `app/v2/`, the redesign's copies, so it reads the
  classic tree it has always read. 204/204.
- **New:**
  - `d1_layout_switch_bench.mjs` (19/19);
  - `d1_stage3_bench_v2.mjs` (37/37: the search's pwa half, the box's place, the Get found card, R-46.17);
  - dream-os `d1_search_bench.js` (22/22) and `b0185_layout_switch_bench.js` (13/13).
- **Stage 3's own amendments** (made before the split, carried in the `_v2` copies): b40, b42 and b122 for the five
  tabs and More.
