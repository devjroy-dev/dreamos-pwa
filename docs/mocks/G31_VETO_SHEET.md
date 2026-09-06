# G3.1 · YOUR WEBSITE & SEO — COPY INVENTORY & VETO SHEET

**Packet** `docs/mocks/your-website-mock.html` · sha256 `c6e00ec61c7ef03f32b3f502397eb054ef3fb42410c9d591530db1b2622b635c` (**RIDER 1**; the cut vetoed at R-40.42 was `4c9243ce…c307`)
**Frames** V1-check · V1-weddings · V2-booked · V2-held · V2-free · V2-unknown · V3-room · V3-on · V3-noswitch — 9 frames, **three shapes**, **16 shots**.
**Tips** dreamos-pwa `35b9ec48` (main) · dream-os `ce32c2e` (main), both re-derived from origin at the moment of cutting.
**Authored against** R-G31.1–.5, R-G31.2/.3's fork rulings, R-40.70 (the three control bytes), R-40.26, R-40.42.

> **⚠ THE TIPS MOVED UNDER THIS SITTING AND THE MOCK WAS DRAWN ON THE OLDER PAIR — R-38.16, reported here rather than discovered at apply.** The read-first was filed at dream-os `de19290` / pwa `cfe45257`. Four commits landed while the mock was being drawn, and **three of them touch this sitting**:
>
> - **`5b3f61f` — the PAIR regen landed. F-40.99 CLOSED.** `PUBLIC_SCHEMA.md:1292` now reads `public.weddings · 19 columns` with `wedding_date` at ordinal 18. **The chair's instruction to cite migrations by line is discharged** — every schema citation below is the regenerated doc, not a migration.
> - **`63a1735` — band 7 §6 landed.** R-40.17–.68, F-40.20–.140, c-40.8–.32, protocol §13, master Amendment 2. Every CE-addendum ruling now resolves in the register. **F-40.135 is confirmed `the storefront preloads (verify)`** — the chair's correction was right and the disposition is the walk. **F-40.96 is registered as `the RS price line (mock-only?)` — with the question mark still on it; §E1 below closes it by command.**
> - **`24d6ed70` — R-40.57's apostrophe pass landed, and it shipped a guard.** `b40` **C102** walks `lib/`, `components/`, `app/` and reds on a straight apostrophe in any shipped prose byte. **Every string on this sheet is in C102's radius**, and each below carries U+2019 where it needs one.
>
> One commit lands **inside my radius**: `ce32c2e` added `owner.enquire_link` to `src/api/public/weddingPage.js:129` (F-40.136). It does not change the weddings-section read, which takes `weddings` rows and not that payload — re-read at `ce32c2e`, stated rather than assumed.

**CURRENT is empty on every guest-facing line below.** Nothing in `lib/public/copy.ts` addresses a date today. The room's three existing bytes (`Storefront`, `Your bio`, `How couples see you`, `See your profile`) are **untouched and not re-vetoed**. Silence ships a line as authored; strike anything and it is struck.

---

## A · THE GUEST'S FOUR ANSWERS — R-G31.1, ALREADY RULED

Recorded here for the record, not re-opened. Home: `lib/public/copy.ts`, joining `PUBLIC_MISS` and `PUBLIC_DOWNLOAD` under R-G11.15's hoist law.

| # | Condition | RULED BYTE |
|---|---|---|
| A1 | `blocked === true`, **or every slot at capacity** | `Booked` |
| A2 | `blocked === false`, any slot `held > 0` | `Some of the day is held` |
| A3 | `blocked === false`, no slot held | `Free` |
| A4 | `blocked === null` | `Couldn\u2019t check just now. Try again in a moment.` |

**A1's second limb is doing all the work at the walk's own date, and it is not a footnote.** `describeDate` was driven over the founder's row (§F1) and returned `blocked: **false**` with morning, noon and evening each `held 1 / capacity 1`. A `ceremony` at `full_day` is not a *block* — `blocked` is true only for rows of `kind='blocked'`, which this is not. The word **Booked** is right; the mechanism is the capacity arithmetic, and **the leaf must compute it**. A leaf that read `blocked` alone would answer `Some of the day is held` for a studio whose entire day is sold.

---

## B · THE CONTROL — R-40.70, RULED; ONE QUESTION BACK

| # | Slot | RULED BYTE |
|---|---|---|
| B1 | section label | `Check a date` |
| B2 | field label | `Your wedding date` |
| B3 | submit | `Check` |

**B4 · RULED = (c).** `Check a date` carries the meaning on glass; `Your wedding date` moves to the input’s `aria-label`. **Neither ruled byte is dropped — one stops being visible**, which is the distinction that let this go to (c) without losing a founder byte. Both remain in `lib/public/copy.ts`; B2’s only reader becomes the attribute. Read `V1-check` at 374: label, field, verb, one line each.

⚠ **The build owes this an `aria-label` and not a `placeholder`.** F-40.137 is the estate’s own specimen of a placeholder standing in for a label on a date input, and `type="date"` ignores `placeholder` outright — the `dd / mm / yyyy` in the frame is the browser’s own format hint, not a byte this estate ships.

---

## C · THE ANSWER LEAF'S OWN LINES — PROPOSED, NEW

Each is a **new guest-facing byte** and none was in R-G31.1's four. They exist because a bare word is an answer with no next step.

| # | Where | PROPOSED | Why |
|---|---|---|---|
| C1 | under `Booked` | `Send an enquiry anyway \u2014 dates do change.` | The vendor's interest and the guest's coincide here. Without it, `Booked` is a door closing; the enquire button underneath then reads as TDW ignoring its own answer. |
| C2 | under `Some of the day is held` | **RULED:** `Send an enquiry with the hours you need.` | The proposed byte promised on the vendor’s behalf (*she’ll say*); this asks the guest to act and promises nothing. **It still does not name the slot** — naming `morning` would leak the shape of someone else’s booking. |
| C3 | under `Free` | `Nothing is held until she confirms it.` | The one state that can oversell. This is said in the **vendor's** favour, not TDW's: a guest who reads `Free` and assumes a hold is a guest who is angry at the vendor later. |
| C4 | under A4 | *(none — no line, no button)* | She asked and got nothing back. A next step under a failure would be TDW converting a technical fault. `V2-unknown` draws only the way back. |
| C5 | the way back, every state | `Back to <business name>` | Her name, not `Back to the page`. The guest came from a person. |

**C6 · RULED: the four answers at 28px Cormorant; A4 at body size.** *A failure is not an answer and should not wear its type.* `.pvs-ansfail`, 15px system stack — read `V2-unknown`. The type now tells the guest which kind of thing she is looking at before she reads a word of it.

---

## D · THE WEDDINGS SECTION AND THE ROOM

| # | Where | PROPOSED | Why |
|---|---|---|---|
| D1 | storefront section label | `Weddings` | Not `Real weddings` — the word *real* only makes sense if you suspected the others were not. Not `Recent`, which makes a claim about dates the section does not sort on beyond newest-first. |
| D2 | room band label | `Your public page` | |
| D3 | room band label | `Weddings on your page` | Says *on your page*, not *your weddings* — the room is reporting what a stranger can see, which is a narrower set than what she has. |
| D4 | **beside the switch, in the room** | `Couples can check a date on this page. It answers free, held or booked \u2014 never a client\u2019s name.` | **The most important line on this sheet, and R-40.77 made it the switch’s own line.** It sits beside the switch in BOTH states — a sentence that appears only once the door is open is a sentence she reads too late to decide. ⚠ **§E7 puts one clause of it in question.** |

| # | Where | PROPOSED (**NEW at rider 1**) | Why |
|---|---|---|---|
| D5 | the switch, R-40.77 | `Let couples check a date` | *Let*, not *Enable* or *Show* — it is a permission she grants, which is exactly what R-40.77 made it. Not `Date checks`, which names a feature rather than a decision. |
| D6 | in the switch’s place, R-40.78 | `Date checks aren\u2019t available for your kind of work.` | ⚠ **See §E6 — one sentence is being asked to serve two different reasons and it can only be honest about one.** |

Row content on both surfaces is `publicWedding`’s existing shape — `title` then `venue · city · season`. **No new field, no new door, no new wire key.**

---

## E · FINDINGS AND DISPOSITIONS

**E1 · F-40.96 CLOSES, and here is the command that closes it.** `docs/mocks/google-reviews-mock.html:477` carries the source byte `From Rs 60,000`; its rule at `:313` sets `text-transform:uppercase`, so the **capture** reads `FROM RS 60,000` and the file never did. The live leaf does not use that class: `components/shared/VendorProfileContent.tsx:243` renders `Starting at {formatRs(...)}`, `formatRs` prefixes `CURRENCY_PREFIX = 'Rs'` (`lib/vendor/tokens.ts:42`), and the rule carries no `text-transform`. **Rendered byte: `Starting at Rs 60,000`.** Mock-only artefact; the register's question mark can come off.

**E2 · RULED → R-40.77 / F-40.157. The check is a vendor switch in the room, OFF by default; the control on `/v/<code>` renders only when it is on.** Drawn: `V3-room` is the OFF default every vendor sees on day one, `V3-on` is after she flips it. **`V1-check` therefore draws a control that does not exist until the founder flips DEV440’s switch, and that flip is a walk step.** The original filing is kept below because the reasoning is the ruling’s. — *the vendor never consented to a calendar door.* Master §2.4: *consent is a switch the vendor or couple owns; silence never means yes.* `discover_paused` is the only switch touching `/v/`, and it means *don't show me publicly* — a vendor who left it off in August did not thereby agree that in September strangers could ask whether she is free on a named date. This is R-G11.6's own reasoning one surface over: *she was never asked to make that assumption.* **(b) was ruled.**

**E3 · RULED → R-40.78 / F-40.158. For an `occupancy:'off'` trade the control is absent, the room’s switch is absent, and R-G31.1’s fifth limb is withdrawn.** Drawn: `V3-noswitch`. **Absent, not disabled** — a greyed control is a thing she keeps tapping. The original filing: — *an `occupancy:\'off\'` trade answers `Free` on every date, forever.* R-G31.1's fifth clause takes `Booked`/`Free` from `blocked` alone when occupancy is off. For a planner (`RULED_OFF`, `occupancy.js:302`) `describeDate` returns `off('ruled_off')` with `blocked:false` and `slots:[]` — so **every date she has ever had answers `Free`**, including her own wedding days. That is null-as-free wearing the ruling's clothes, one category over. **DEV440 is `photography` so the walk cannot see it**; `MAKEUPBYSWATIROY` is `makeup` (capacity 2) and cannot either.

**E4 · NAMED, NOT CURED — the Check tap cannot be acknowledged, and it is UNCLOSEABLE for the same reason F-40.108 is.** R-G12.10 keeps script off the public lane; a `<form method="GET">` gives no pending state, so on mobile data a guest taps `Check` and the page sits still until the next paint. Same shape as the download tap, same ruling, same non-cure. Stated so it is not found on the walk and mistaken for a defect.

**E5 · F-40.135 held for the walk** as ruled. Zero `preload` in `app/v`, `lib/public` or `VendorProfileContent.tsx` at `35b9ec48` — the console on the served page is the witness, not this tree.

**E6 · THE NEW BYTE D6 IS BEING ASKED TO SERVE TWO REASONS AND CAN ONLY BE HONEST ABOUT ONE.** `occupancy:'off'` has **two distinct causes** in `occupancy.js`, and R-40.78 covers both:

- **`ruled_off`** (`RULED_OFF = new Set(['planning'])`, `:302`) — a **decision**. Occupancy is off for planners *because the crew math lands at 04.5*, and the code says so.
- **`unmapped`** — **nobody has decided yet.** `hairstylist`, `performer` and `content_creator` are unkeyed in `CATEGORY_CAPACITY` (`:288`) and reach the same `off`.

`Date checks aren’t available for your kind of work.` is true for a planner and **misleading for a hairstylist**, who is not excluded on the merits — she is simply not yet mapped. One sentence, two meanings, and the estate’s own comment at `:292` is explicit that the unmapped signal must *stay loud where it means something*. Arms: **(a)** one byte as proposed; **(b)** two bytes keyed on the reason, which needs `describeDate`’s `reason` to reach the room. Drawn as **(a)**; not built either way.

**E7 · FILED — THE CHECK AND THE WEDDINGS SECTION, ON ONE PAGE, NARROW A NAME ONTO A DATE. D4’s second clause is narrowly true and jointly defeasible.** Neither surface leaks alone: the check answers one word and `publicWedding` (`weddings.js:788`) emits **season only, never a date** — verified by command, `2026-12-04 → Winter 2026`. **Together they compose.** A guest sweeps dates until one answers `Booked`, then reads the section for the single page in that season and binds its **title** to that day. Titles are free text the vendor typed, and the founder’s own rows prove they carry family names — `Verma Event`. The rate limit (R-G31.4, 30 / 10 min / IP) prices a 90-day season at about an hour, which is a speed bump and not a wall.

This matters more than its severity because **D4 is the sentence the founder’s consent rests on**, and `never a client’s name` is a promise about *this door*. It holds for this door. It does not hold for this door *plus the section beside it*. Arms, none built: **(a)** accept and leave D4 — the vendor opted in, and she chose both the titles and the switch; **(b)** D4 gains a clause naming the composition; **(c)** the section renders no title where the check is on. **(a) is drawn.** The founder should rule this one himself rather than inherit it.

**E8 · F-40.159 — THE SECTION’S SHAPE WAS DESIGNED FOR ROWS THAT DO NOT EXIST.** `V1-weddings` is now drawn against **the founder’s real rows**, and it is the sitting’s plainest lesson. Designed as *title · venue · city · season*, the live fixture gives: `Wedding — Delhi · Winter 2026` and `Verma Event — Summer 2026`. **`venue` is NULL on both. `city` is NULL on one. Both titles are record names, not portfolio pieces.** Row 2 degrades to a bare season under a word the vendor typed to find it in a list. This is F-40.140’s shape exactly — a surface designed against imagined rows — caught this time before the walk instead of during it. Not cured here: the cure is either a quality floor on which pages the section renders, or a prompt in the Wedding pages room to title and venue a page before publishing. Both are rulings, neither is this sitting’s.

---

## F · FIXTURE STATE — TWO SELECTS, AND ONE OF THEM IS THE ONE G3.2 PAID FOR LAST NIGHT

**F1 · the calendar row: ANSWERED.** The founder returned `Sharma - sangeet · ceremony · full_day · upcoming · 2026-12-04 · deleted_at null · photography · slot_capacity null`. Driven through the real `describeDate` over a double returning exactly that row: `blocked:false`, three slots at `held 1 / capacity 1`, `occupancy:'on'`. `slot_capacity` NULL resolved to `CATEGORY_CAPACITY['photography'] = 1` (`occupancy.js:290`) — **it did not produce `blocked:null`**, so the chair's alternative branch does not fire. **The acceptance line's word is `Booked`.**

**F2 · the weddings section: ANSWERED, and it changed two frames.** Two rows, both `published`, both `couple_consent`, both delivered — **the section can be walked.**

| slug | title | venue | city | season (derived) | event_date |
|---|---|---|---|---|---|
| `wedding` | `Wedding` | NULL | Delhi | Winter 2026 | 2026-12-04 |
| `verma-event` | `Verma Event` | NULL | NULL | Summer 2026 | 2026-07-31 |

Seasons derived by running `seasonYearFor` on both dates, not read off a column — 0137 added a date column, never a season one (`weddings.js:776`). Newest first puts `Wedding` above `Verma Event`.

**⚠ `wedding`’s `event_id` IS `d7ae11d4-…`, the founder’s own `Sharma - sangeet` row.** The published wedding page on her storefront and the event that makes 2026-12-04 answer `Booked` **are the same event.** That is the fixture behind §E7, and it is not a coincidence a walk would have to arrange — it is already there.

**The seal is a separate question and the answer is still no.** `V1-check` draws a seal DEV440 does not have; G2 records her as below the floor of three delivered weddings, and these two rows do not reach it. It is drawn only so the check’s placement *under* a seal can be judged. **The founder card must not expect a seal on `/v/dev440`.**

---

## G · CONTROL INVENTORY

**`/v/<code>` — every control today, and its disposition.** N hidden radios `#pv-h<i>` **KEPT** · N thumbnail `<label>`s **KEPT** · the enquire anchor **KEPT** · the colophon link **KEPT**. **ADDED:** one `<form method="GET" action="/v/<code>/date">`, one `<input type="date" name="d">`, one submit. Nothing moved, nothing removed.

**`/v/<code>/date` — a new surface, so everything on it is ADDED:** the enquire anchor (absent on A4 by ruling, C4), the `Back to <business name>` link. **No form** — a guest re-checks from the storefront, because a second date field here would be a second home for one control.

**Storefront room — every control today:** the bio meter (readout) · `See your profile` button **KEPT** · Portfolio row **KEPT** · Discover row **KEPT** · `11 photos live` (readout) **KEPT**. **ADDED:** the address link. **The `Weddings on your page` rows are READOUTS, not doors** — Wedding pages is its own room with its own hub entry, and a second way in from here would be the two-doors shape R-37.87 closed for Collab. If the chair wants them tappable that is one ruling and one `href`.

**Verbs (CE-116 clause 2).** `/v/` gains a third capability — *select a photograph*, *enquire*, and now *check a date*. It is the first control on that leaf that talks to a door.

**Variable-length collections (CE-116 clause 3):** the weddings list on both surfaces. Walked against DEV440, never a fixture — which is exactly what §F2 is for.

---

## H · SHOT LIST, AND WHY 390 LANDS ON THREE FRAMES

`mock_shot.cjs` derives PRIMARY from the id's shape prefix (`primaryOf`, `tools/mock_shot.cjs:116`) and shoots the first frame of each shape at 374 **and** 390. Three shapes here — **V1** the storefront, **V2** the answer leaf, **V3** the room — so 390 lands on `V1-check`, `V2-booked` and `V3-room`. **I did not split the four answer states into four prefixes to harvest more shots**: they are one shape, and inventing prefixes to game the arm would make its own vocabulary lie. If the chair wants all seven at both widths, that is one word and a `data-shot-width` declaration per frame.

Public frames are **light-only** — the cream lane carries no `[data-wl-mode]`, protocol §13 §4 as amended (*public pages are light-only*, F-40.22/.41). The room carries both.

**16 shots:** V1-check ×2 · V1-weddings ×1 · V2-booked ×2 · V2-held/free/unknown ×3 · V3-room ×4 (two widths, two modes) · V3-on ×2 · V3-noswitch ×2. The two new room states are not primaries of their shape, so they take 374 in both modes.

---

## I · WHAT IS HELD AT RIDER 1

**A1–A4, B1–B4, C1–C6, D1–D4, E1–E5 and §F1/§F2 are all discharged.** Held, and the build waits on them:

- **D5** — the switch’s label, a new vendor-facing byte.
- **D6** — the absent-switch line, new, and **§E6** says one byte may not be able to carry it honestly.
- **§E7** — the composition between the check and the weddings section, and whether **D4** keeps its second clause unamended. **This one should be the founder’s own word**, because D4 is what his consent rests on.
- **§E8 / F-40.159** — whether the weddings section renders at all for a page with no venue and a record-name title, or whether the Wedding pages room prompts for both before publishing.

**Two things the build already owes regardless of the above:** B4’s `aria-label` must not be a `placeholder` (F-40.137’s shape, and `type="date"` ignores it), and the leaf must compute A1’s **second limb** — `blocked` alone answers the walk’s own date wrong.
