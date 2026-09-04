# COPY REGISTER — M-FINISH S1 · R-38.6
**The veto surface. Founder passes this once; only the approved column ships.**
Derived at `366a7b5` + this delivery. Every `current` below was read from the tree at the
moment of writing; nothing is quoted from a handover.

## HOW TO READ THIS

R-38.6 is a **shape** rule, not a tone rule:

- labels are **nouns** of at most two words
- buttons are **verbs** of at most two words
- an empty state is **one sentence** naming what will appear here, and one action
- no paragraph explains the product on any surface except the first-run cards, which are
  three cards of one sentence each

`RETIRED` means the key is gone from `lib/worklist/copy.ts`, not merely unrendered — an
unrendered vetoed byte drifts unnoticed until someone renders it again. `b40` cell C13
asserts each retired key is absent, and `wl_audit`'s R-38.6 cell asserts the retired
*sentences* are absent from every shell surface's served bytes.

**Proposed copy ships fully in place**, per R-38.6: the sheet is the veto surface, and a
round-trip is the cost of a rejected line rather than of every line.

---

## 1 · TODAY

| current | proposed |
|---|---|
| `todayPromise` — "Once your work starts flowing, Today becomes your morning brief — what needs attention, what's due, what got done." | **RETIRED.** Two clauses standing where a page title goes. Today had no stature because its loudest line was an explanation. |
| — | `todayTitle` — **"Your morning brief."** t1, one per surface. |
| `todayEmptyLine1` + `todayEmptyLine2` — "Today is still being built." / "Nothing is being read yet." | **MERGED, not dropped** → `todayNotLive` — **"Today is not reading your work yet."** The honesty survives: this says the instrument is not running, which is not the same claim as a zero reading. |
| — | `todayEmpty` — **"When your work starts flowing, what needs attention lands here."** The empty state's one sentence. |
| — | `todayEmptyAction` — **"See your rooms"** |
| `todayMastheadCaption` — "needing you today" | **RETIRED** → `todayCountCaption` — **"open items"**. A phrase becomes a noun. |
| `todayRestingHead` · `todayRestingScope` | **UNCHANGED.** Phase 4 bytes, not rendered yet, vetoed already. |

**One thing the founder should weigh.** The numeral reads `0` while nothing is being read.
`todayNotLive` is what keeps that honest. If it is cut, the `0` becomes a measurement the
product never took.

## 2 · THE FIRST-RUN CARDS — five become three

| current | proposed |
|---|---|
| `firstRunHeader` — "What TDW does for you" | **UNCHANGED.** |
| `cardDeskBody` — "DreamAi answers every enquiry on WhatsApp, at any hour, in your name. It asks what you'd ask — date, city, budget — and hands the conversation over once it's worth your time. You stay the one who quotes." | **"DreamAi answers every enquiry on WhatsApp, at any hour, in your name."** |
| `cardLinkBody` — "One link that routes every enquiry straight to you. Share it in your bio, a story, a reply — whoever taps it lands in WhatsApp already routed to you, with nothing to install. No enquiry ends up in an inbox you forget to open." | **"One link that routes every enquiry straight to you, with nothing for anyone to install."** |
| `cardAskBody` — "You never have to open TDW to use it. Text DreamAi the way you'd text a colleague, and the work lands here." | **"Text DreamAi the way you would text a colleague, and the work lands here."** |
| `cardRoomsTitle` · `cardRoomsBody` · `cardRoomsAction` | **RETIRED.** A card captioning a directory, sitting on top of the directory. The tile grid explains the rooms by being them. |
| `cardMoreTitle` · `cardMoreBody` | **RETIRED.** A second door to Business Solutions, which has had a tile and a surface since R-37.66. |
| `cardDeskTitle` · `cardLinkTitle` · `cardAskTitle` · actions · the five chips | **UNCHANGED.** Chip count stays five, one per backed tool. |

## 3 · ROOMS AND THE DRAWER

| current | proposed |
|---|---|
| `roomsPointer` — "New here? Today has a short guide to what TDW does for you." · `roomsPointerAction` — "Read it" | **RETIRED.** R-38.7: Rooms shows the tile grid and nothing else. A directory does not advertise a manual. |
| `roomsAskSub` — "your 24/7 enquiry desk" · `roomsProfileSub` — "how couples see you" | **RETIRED.** Zero consumers since R-37.82 (2) deleted the rows' second line; the keys outlived their markup. |
| `roomsAskTitle` — "TDW on WhatsApp" | **UNCHANGED**, R-37.78 founder byte. New home: the coin drawer. |
| `roomsProfileTitle` — "Profile layout" | **UNCHANGED**, founder byte. New home: a row inside Settings. |
| band captions `— your work —` / `— your business —` | **"your work" / "your business"** — the em-dash bracketing retires with the engraved register. A label needing decoration to read as a label is not a label. |
| drawer section `Atelier` | **`Account`.** It named a design era, not a group of rows. |
| drawer rows `Discover Profile` / `Tips & Features` | **RETIRED from the drawer.** The first is now `Profile layout` in Settings (R-38.7); the second pointed at `/vendor/more`, which R-38.1 forbids from a shell control. |
| drawer row `The Dream Wedding` → thedreamwedding.in | **RETIRED.** Founder's walk: 「why do i have a dream wedding there?」 Product chrome does not need a door to its own homepage. |
| — | `drawerReachUs` — **"Reach us"**. Chair's byte, under founder veto. It exists so 「TDW on WhatsApp」 sits under a heading that is true of it. |
| `Sign Out` | **"Sign out"** — sentence case. R-38.6 puts buttons in sentence case; the engraved Title Case went with the register that carried it. |

**The drawer as ruled (CE-38 relay #3, arm (b)):**

```
ACCOUNT    Settings · Billing
REACH US   TDW on WhatsApp
DISPLAY    Graphite · Chalk
ACTIONS    Sign out
```

## 4 · BILLING — R-38.8

| current | proposed |
|---|---|
| Price row fallback — "Free — no AI" | **RETIRED.** Two claims in a figure slot: a price and a capability. |
| — | `planBasicIncludes` — **"Profile and leads. No AI replies."** |
| Status row — "Cancelled. You're on Basic." / "Payment failed. You're on Basic." | **RETIRED.** The blend was F-10.110: a vendor at `tier: 'signature'` with a dead rail read "you're on Basic" while the engine served her Signature AI. |
| Note — "Moved to Basic — subscription cancelled. Profile and leads unchanged. AI is off on Basic." (and its halted twin) | **RETIRED.** |
| — | Status **chips**: `Active` · `Retrying` · `Payment failed` · `Cancelled` · `Not set up` · `Basic`. Each reports the RAIL and stops; the plan card one line above names the plan. |
| — | `billingPlanLead` **"Your plan"** · `billingPlansHead` **"Plans"** · `planAction` **"Choose"** |
| `V2.offer`, `V2.confirm`, `V2.cancelWarn`, `V2.cancelYes/No`, `V2.upgradeExplain`, the four failure sentences | **UNCHANGED, byte-for-byte.** R-38.8 retires the status blend; it retires none of these. They moved file (`lib/vendor/billing/plans.ts`) and not a character. |

### ⚠ TWO THINGS R-38.8 ASKED FOR THAT THIS SITTING CANNOT GIVE

**1 · The `Ends 14 Sep` chip has no date behind it.** `billing_status` has no companion
timestamp, `tierFlip.js` writes none, and `vendors.updated_at` moves on any profile save —
so rendering a flip date would print the day she edited her bio. A first draft's flip date
was DROPPED at your own ruling for exactly this reason. Not shipped, not invented.

**2 · Three of the four plan rows ship with no inclusion line, and this is the sheet's one
real ask.** R-38.8 wants each row to carry a one-line inclusion. Basic's is derivable —
`statusLine.ts`'s own vetoed byte says AI is off there. **Nothing in this repo states what
Essential, Signature or Prestige include.** The only tier-differentiated fact reachable is
the AI message cap, and it lives in runtime admin config keys (`vendor_ai_daily_*`), not in
shipped constants. Three bytes are owed:

| plan | price | inclusion line |
|---|---|---|
| Essential | Rs 999 / month | **owed — founder's byte** |
| Signature | Rs 1,999 / month | **owed — founder's byte** |
| Prestige | Rs 2,999 / month | **owed — founder's byte** |

Inventing them on the estate's money surface is precisely what this register exists to
catch, so the rows ship as name · price · action until the three lines arrive.

## 5 · THE ADVISOR ROOM — R-38.9, all new

| key | proposed |
|---|---|
| tile label · `advisorTitle` | **"Advisor"** — your byte. Never "Victor" (R-37.70). |
| `advisorEmpty` | **"Ask about pricing, positioning or a decision you are weighing."** |
| `advisorThreadNote` | **"Moving between Advisor and the ask bar starts a fresh conversation each time."** The disclosed cost, on the surface rather than only in a handover. |
| `advisorUnset` | **"Could not switch to Advisor just now — try again in a moment."** Rendered only when the mode PATCH did not land: it reports what the screen does not know rather than asserting a state the server never confirmed. |

## 6 · UNTOUCHED BY RULING

`supportTitle` · `supportHeader` · `supportBody` · `supportAction` (R-37.67 founder bytes —
the standing refusals name R-37.67/.78 as untouchable, and this body is the surface's whole
content rather than a paragraph decorating a control) · `manifestName` · `manifestShortName`
· `navToday` · `navRooms` · `themeDarkName` · `themeLightName` · `dockPlaceholder` ·
`dockAria` · `dockRowTitle` · `linkCopy` · `linkCopied`.

## 7 · SETTINGS — NOT IN THIS SHEET, AND SAYING SO IS THE POINT

R-38.6 asks for "every visible byte on Billing and Settings". Billing is above in full.
**Settings is not**, and the reason is structural rather than an omission: its body is
`SettingsScreen`, ~250 lines of AtelierForm fields whose labels are vetoed bytes from
TDW_07 P2, and it crossed into the shell **structurally** this sitting without crossing
**typographically** — Jost at 9px, .42em tracking, the register R-38.4 retires. Recutting
its copy and its type is one sitting, and doing half of it here would leave a surface
speaking two registers with no record of which half was ruled.

Declared, priced, and named as excluded from the render arm's tuple cell in code
(`tools/wl_render.cjs`, `SCALE_SURFACES`) so it cannot be forgotten by being quiet.

## 8 · M-FINISH S2 §4-1 — THE LIST FAMILY'S SIX HEADER WORDS

Six rooms crossed and each gained exactly one new vendor-facing byte: the word the shell
prints in its header. Nouns of one word, so R-38.6's shape rule is met without effort.

| key | byte |
|---|---|
| `leadsTitle` | **"Leads"** |
| `clientsTitle` | **"Clients"** |
| `invoicesTitle` | **"Invoices"** |
| `expensesTitle` | **"Expenses"** |
| `eventsTitle` | **"Events"** |
| `notesTitle` | **"Notes"** |

**THESE ARE NOT NEW WORDS AND THAT IS WORTH SAYING PLAINLY.** They are the same six bytes
the tiles already carry (`lib/worklist/rooms.ts` `label`) and the same the Slice Door
already carries (`components/vendor/slices/SliceRow.tsx` `LABELS`). Three surfaces now
spell each of these words, and this file is **not yet** the one home for them.

It was not made the one home this sitting. `LABELS` is read by the surviving `/vendor`
fallback, so pointing it at the shell's copy register would make a main-side component
depend on a branch-side register — the direction D-2 forbids. The honest shape is the
reverse, and it is a small sitting of its own because `LABELS` is keyed by `DoorSlice`
while the shell is keyed by room id. **Filed as F-38.23, priced.**

The duplication cannot drift while it exists: `b40` C30 compares all six against `LABELS`
and reddens on any disagreement. An exception that is asserted cannot grow quietly,
whereas an exception that is merely explained can.

## 9 · THE SIX CROSSED BODIES — NOT IN THIS SHEET, FOR §7's REASON

Nothing inside the six rooms is in this sheet. Their **chrome** is the header word above;
their **bodies** kept their existing bytes and layout under R-38.12, which limits a crossing
to chrome and forbids the redesign a copy recut would be.

Two facts about those bodies are declared rather than swept, and both are named as excluded
from the render arm's tuple cell in code (`tools/wl_render.cjs`, `SCALE_SURFACES`):

- **F-38.22** — thirty colour literals across seven files in the slice tree. Inside the
  shell's scope they bypass the variable layer and paint Espresso brass where the accent is
  teal. Same root cause as the ZIP 4 gold-FAB finding. The cure is mechanical
  (`color-mix` against `--atelier-accent-text`, which renders identically on main) and it
  is a sitting of its own, not a sweep folded into a structural crossing.
- **F-38.23** — the older type register those bodies were built in.

The frames are still captured. The founder sees the gap he is being asked to price.

## 10 · CE-39 STEP 2a · R-39.6 / R-39.7 — TWO ENTITLEMENT BYTES, FOUR DELETIONS (founder-vetoed 2026-08-29)

The dream-os pre-cutover seat moved two gates; the bytes moved with them, per C50's condition
that a byte may not say what the gate does not do. Predicates live server-side (dream-os
`me.js` `couture_eligible` = invite flag OR tier ∈ {signature, prestige}; `requirePrestige`
retired from the six studio routers); the screens read one boolean or nothing.

| key | byte | status |
|---|---|---|
| `coutureGateLabel` | **"Couture · Signature and Prestige"** | founder-vetoed 2026-08-29 (was 「Couture · Invite Only」) |
| `coutureGateSentence` | **"Couture is part of Signature and Prestige. Upgrade in Billing."** — 「Billing」 is `coutureGateLinkWord`, routed through `roomHref('billing')` | founder-vetoed 2026-08-29 (was 「Couture access is reserved for invited makers. Contact Swati to be considered.」) |
| — `app/vendor/team-hub/screen.tsx` | 「Team Hub is reserved for Prestige. Contact Swati to upgrade.」 | DELETED, not re-cut (R-39.7: no tier to upgrade to) |
| — `app/vendor/studio/{team,tasks,team-payments}/page.tsx` | 「Team Hub is available on the Prestige plan. Contact Swati to upgrade.」 ×3 | DELETED with their `session.tier !== 'prestige'` arms |
| — `lib/vendor/studioShared.tsx` `Row` | 「Prestige」 pill on a locked row | RETIRED with the `locked` arm and `isPrestige` (G-2) |

Plan-card / rate-card bytes naming the Studio Suite as Prestige-only: swept comments-stripped
across `lib/worklist/copy.ts`, `app/w/billing/page.tsx`, `components/vendor/SubscriptionCard.tsx`,
`components/worklist/BillingRoom.tsx`, `lib/vendor/billing/plans.ts` — **zero found**; the
three paid tiers still carry no inclusion line anywhere in this tree (§ above, `planBasicIncludes`).

## 11 · BOOKS — THE NINETEENTH ROOM, ROAD STEP 2b · ELEVEN BYTES, ALL VETOED 2026-08-29

The charter, R-38.10, and every line of the 2b kickoff spelled this room **Khata**. The
founder's veto answered **Books** on all ten lines put to him, and an eleventh was vetoed
after the build (F-39.p3). The earlier byte survives in no string, symbol, route, comment or register
row in either repo — it is named once, here, so the record shows it was ruled away rather
than lost.

| # | key | proposed | founder |
|---|---|---|---|
| 1 | `rooms.ts` label | Books | **YES** |
| 2 | `booksTitle` | Books | **YES** |
| 3 | `booksReceived` | Received | **YES** |
| 4 | `booksOutstanding` | Outstanding | **YES** |
| 5 | `booksColDate` | Date | **YES** |
| 6 | `booksColCredit` | Credit | **YES** |
| 7 | `booksColDebit` | Debit | **YES** |
| 8 | `booksColBalance` | Balance | **YES** |
| 9 | `booksEmpty` | No money movements yet. | **YES** |
| 10 | `booksUndated` | no date on file | **YES** |
| 11 | `booksFailed` | Could not read your books just now — try again in a moment. | **YES**, after the seat withheld it |

**THE TILE BYTE AND THE MASTHEAD BYTE ARE ONE WORD**, which is `teamTitle` and
`collabTitle`'s precedent: the shell's masthead says where the vendor IS, so it says what
the tile she tapped said. §8's `LABELS` duplication does not apply — Books has no
`/vendor` fallback and therefore no `DoorSlice` twin, so this is the first room whose
header word has exactly ONE home. F-38.23 is unaffected; it does not grow.

### Row 10 renders TWICE on the founder's own account, and that is not an edge case

Both of DROY550's credits carry `last_payment_at` NULL. The payment writer leaves it
stale — **F-39.8, filed at the chair's hand and NOT this seat's to cure** — so the door
dates those credits by the invoice's `created_at` and flags `undated: true` on the wire.
The row then SAYS the date is the invoice's rather than the payment's.

Rendering `created_at` silently as though it were a payment date would be the surface
asserting a fact the estate does not hold. The byte is small and lowercase deliberately: it
is a caveat on a figure, not a warning about her money.

### Rows 9 and 11 are OPPOSITE FACTS and neither may carry the other's meaning

`booksEmpty` says the estate looked and found nothing. `booksFailed` says the estate could
not look. Rendering the first over a failed call tells a vendor **with** money that her
money is gone — so the failure path also replaces each head figure with an em-dash rather
than Rs 0, which is the same lie in numerals.

Row 11 was **WITHHELD at the build**, not shipped and explained afterwards: ten bytes had
been ruled, and an executor-invented eleventh on a money surface is precisely what this
register exists to catch (§4's own sentence about the three owed plan inclusion lines is
the same law, and the same answer). It went to veto and came back YES. `advisorUnset`'s
shape and register — it reports what the screen does not know, rather than asserting a
state the server never confirmed.

### The money register, stated once

`Rs X,XX,XXX` from `lib/vendor/format.ts` :: `formatRs` — THE canonical home
(R-U25/R-U27/R-U30). `components/vendor/slices/SliceRow.tsx` :: `fmtRs` is the second home
F-38.p13 names and it is **not** used by this room: a new surface reaching for the second
home is how a second home becomes permanent. No rupee glyph, no k/L/Cr, no truncation.
