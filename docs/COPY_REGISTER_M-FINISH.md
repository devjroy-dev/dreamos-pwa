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
