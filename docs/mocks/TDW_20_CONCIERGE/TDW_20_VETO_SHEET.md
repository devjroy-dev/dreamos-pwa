# TDW_20 · Concierge sitting 1 · A1 · the journey, for the founder's veto

**Cut by** LE-A under CE-41 **at** dreamos-pwa `966eb1c1e084d2890f00ecfda64c261ce0b61446` / dream-os `57d12d493e1719feb95b3186c9d9ec0a6ce84f29`, both derived fetch-first by command. **Status:** PROPOSED. Nothing here is on the tree as product; no byte in `src/` or `app/` moves until the veto lands. Silence is not approval.

> **RULED 2026-09-08 (R-41.33 under R-41.32; the A1 veto).** Every string below is KEEP except: #3 → `Tell us your date, your city and what you need. We find and book your vendors for you — planners included.` · #4 → `Find my vendors` · #13 → `What you need, and roughly how much for each` · #17 → `Colours, style, anything you've saved in your Muse` · #20 → `Pick at least one and tell us roughly how much.` · #30/#31 STRUCK · #36 → `Want a personal concierge?` · #37 → `The Dream Wedding finds and books your vendors — photography, makeup, décor, planning, all of it. One sheet.` · #38 → `Ask a Personal Concierge →`. §5: popup once per login, never after her first request, never after her second dismissal · fan-out 3 · S2 as drawn minus #30–#31 · typography **(b) `Discover · Storefront`**, all three bytes · no Back trap · `Your wedding assistant` on the sheet and Settings, `Personal Concierge` inside Meridian only. §4 forks ruled R-41.24–.29; F-4 mehendi rides `other` (F-41.3 → seat D). **`TEMPLATE_BODIES.txt` is SUPERSEDED** by seat B's filed bodies — Meta names `tdw_assist_lead_outside` (1627376372249131, Marketing), `tdw_assist_found_vendor` (3160852754105015, Utility), `tdw_assist_found_outside` (3115277355330375, Utility); the file stays as the A1 record. Built at A3 (dreamos-pwa) against dream-os `1feb1cc`.

**Files in this folder:** `concierge-journey-mock.html` (six frames — `P1-popup` · `S1-sheet` · `S2-sent` · `E1-settings` · `E2-meridian` · `A1-queue`) · `TEMPLATE_BODIES.txt` (the three bodies, §1-checked) · this sheet. Shot arm: `node tools/mock_shot.cjs docs/mocks/TDW_20_CONCIERGE/concierge-journey-mock.html` (the seat's container has no font egress, so the PNGs are the founder's to cut if he wants them; the HTML opens in any browser).

**The rulings this draws against:** R-41.1 (popup + Settings + Meridian), R-41.2 (a wedding planning assistant — TDW finds and books, planners included; one sheet, no `kind`), R-41.3 (admin forwards, on-platform or outside), R-41.4 (three bodies), R-41.5 + R-41.17 (Discover-Storefront, three bytes), R-41.14–.23 (the first-message rulings), roadmap §7 refusals. Copy law: no persona name in chrome — "Meridian" appears only as the existing room's own title, where the persona already speaks.

---

## 1 · Couple-facing strings — each is a veto slot (write KEEP, or the replacement, beside it)

Format: **#N** `frame` · proposed byte · *why*.

### The popup (`P1-popup`, `/frost` on login)
- **#1** eyebrow · `The Dream Wedding` · *the actor is TDW, not a persona (§6.7 open — see last page).*
- **#2** title · `Let us find your vendors.` · *the offer in six words; the verb is ours.*
- **#3** body · `Tell us your date, your city and what you need. We find and book the vendors for you — planners included.` · *R-41.2 verbatim in spirit: find AND book, planners included, so nobody reads it as "a planner".*
- **#4** primary · `Ask for help`
- **#5** secondary · `Not now` · *dismissable; the behaviour is §6.1's.*

### The sheet (`S1-sheet`, `/frost/canvas/assistance`)
- **#6** back · `← Sanctuary` · *the existing bloom back-link word.*
- **#7** title · `Your wedding assistant` · *§6.7 open; alternatives on the last page.*
- **#8** lede · `One sheet. We do the rest.`
- **#9** label · `Wedding date` — pre-filled from `couples.wedding_date` with hint **#10** `from your profile`; editable.
- **#11** label · `City · area` — city pre-filled from `couples.wedding_city`; area placeholder **#12** `Area, if you know it`.
- **#13** label · `What you need, and roughly what for each`
- **#14** the category rows, plain words for the eleven canonical trades (`src/agent/categories.js:36–47`), in this order: `Photography` · `Makeup` · `Décor` · `Planning` · `Venue & catering` · `Hair` · `Outfits` · `Mehendi & anything else` · `Jewellery` · `Music & anchors` · `Content` · *the row order is a proposal (the four the roadmap names first); see fork F-4 below on mehendi.*
- **#15** the budget cell placeholder · `Rs` · *wallet law: `Rs X,XX,XXX`, typed digits grouped Indian-style on blur, never the glyph.*
- **#16** label · `The look` — placeholder **#17** `Colours, style, anything you've saved…`
- **#18** primary · `Send`
- **#19** fine print · `We share your request only with the vendors we choose for you.` · *consent is the act (roadmap §2); this line says who sees it and nothing else.*
- **#20** validation, one line, shown under Send · `Pick at least one and tell us roughly what for.` · *expected-zero state, named.*
- **#21** failure, one line · `That didn't send. Try once more, or message us on WhatsApp.`

### After Send (`S2-sent`) — §6.3 is open; this is the chair's proposal drawn
- **#22** lede · `Sent. We're on it.`
- **#23** card title · `We'll message you on WhatsApp as we find each vendor.`
- **#24** card body · the echo: `Photography · Makeup — 14 February 2027, Delhi.` (built from her own sheet, no new words).
- **#25** label · `Found so far` — appears only once a forward exists.
- **#26** row, TDW vendor · the business name + category, status chip **#27** `On TDW →` (opens `/v/<code>`).
- **#28** row, outsider · `A photographer we're bringing on` + status chip **#29** `Not on TDW yet` · *outsiders unnamed until they join (§6.3, roadmap §7).*
- **#30** row, asked-not-yet-answered · `Two more photographers` + chip **#31** `Asked` · *this row exists only if §6.3 rules that she sees the count; strike it if not.*
- **#32** fine print · `Need to change something? Message us on WhatsApp.` · **#33** ghost button · `Message The Dream Wedding` (the existing WA deep link).

### Settings entry (`E1-settings`)
- **#34** row title · `Wedding assistant` · **#35** row sub · `Ask us to find and book your vendors.`

### Meridian, folded (`E2-meridian`)
- **#36** card title · `Need vendors found and booked?`
- **#37** card body · `The Dream Wedding does that for you — photography, makeup, décor, planning, all of it. One sheet.`
- **#38** card link · `Ask us →` (opens the sheet)
- **STRUCK** the current button `Ask a Personal Concierge` and its sent-state `Our concierge will reach you at the earliest.` (`meridian.tsx:23–:70`) — the empty POST is folded; the sentence claimed a row that is now a real request.

### Discover-Storefront — three bytes (R-41.5, R-41.17), typography §6.4 open
| site | current | proposed (a) | proposed (b) |
|---|---|---|---|
| `sanctuary/page.tsx:162` slice label | `Discover` | `Discover-Storefront` | `Discover · Storefront` |
| `discover.tsx:130` bloom title (Italianno 46) | `Discover` | `Discover-Storefront` | `Discover · Storefront` |
| `MuseRow.tsx:69` empty state | `Start saving vendors in Discover to build your Muse.` | `Start saving vendors in Discover-Storefront to build your Muse.` | `Start saving vendors in Discover · Storefront to build your Muse.` |

*Measured, not guessed: at Fraunces italic 300 / `FT.room` the slice row has the hint at its right edge (`maxWidth:160`); "Discover-Storefront" is the longest label the rail will carry and is drawn in `E1-settings` at rail width. At 46px Italianno the bloom title fits 374 with margin. The seat's `tsc` sweep cannot measure pixels; the frame is the measurement, the founder's glass is the truth (walking law).*

---

## 2 · Admin-facing strings (`A1-queue`, `/admin/assistance`) — the chair holds copy veto on admin chrome unless the founder takes it
- `Assistance requests` · `N open · N forwarded · N closed` · chips `Open` `Forwarded` `Closed` · `+ Type a request` (the admin-typed intake door, R-41 A2(b)).
- Row: couple name · phone · date · city · asked-when · categories with `Rs X,XX,XXX` each (via `formatRs`, c-41.2).
- Detail: `The look` · per item `Forwarded N of 3` (fan-out default §6.2 open) · `Forward to a TDW vendor · <trade> · <city>` with search `name or handle` (alphabetical, trade-first, city-first; no ranking) · `Forward` / `Sent` · the sent line `Lead created for <handle> · source tdw_assist · <time>` · `Forward to someone not on TDW` with `Instagram handle` + `WhatsApp number` · the dark line `Dark: the join message is filed, not yet approved. The forward is recorded; nothing is sent, and the log says so.` · `They get one message to join; her number stays with TDW until they do.` · `Close request` · `Closing tells her nothing. She hears from us only when a vendor is found.`
- Typed-by-admin rows are titled `Typed by admin · <phone>` until a couple row exists for that phone (s2 materialises it).

---

## 3 · Control inventory — the surfaces A3 touches (§10 part 4(iv), CE-115)
| surface | control | disposition |
|---|---|---|
| `meridian.tsx` `MeridianConciergeBtn` (compact + full) | the tap that POSTs `{}` to `/couple/concierge/request` | **REMOVED-BY-RULING** (R-41.19 — the door 308s in A2, the caller folds in A3); replaced by the card #36–#38 which navigates, never POSTs |
| `meridian.tsx` chat input, send, message list | | KEPT, byte-untouched |
| `sanctuary/page.tsx` `BASE_SLICES` `discover` | label | KEPT, label byte changes per §6.4 |
| `sanctuary/page.tsx` `BASE_SLICES` `meridian` | doorway | KEPT — still opens the Meridian room; the sheet is reached from the card inside it (R-41.1 "reachable from Meridian") — *fork F-1 below asks whether the slice should open the sheet directly instead* |
| `sanctuary/page.tsx` `BASE_SLICES` `settings` | doorway | KEPT; the Settings room gains row #34 |
| `settings.tsx` profile row · mode toggle · WA shortcut · publish switch | | KEPT, byte-untouched; one row added |
| `discover.tsx:130` title | | KEPT, byte changes per §6.4 |
| `app/(landing)/page.tsx` sign-in, role toggle, entry doors | | KEPT; on mount at `/` a present session redirects (F-41.1) and the stale comment at :645–:647 is deleted (R-41.16, F-41.2) |

---

## 4 · Forks the mock surfaced (none built; the founder or chair rules)
- **F-1 · The Meridian slice.** R-41.1 says "reachable from Meridian". Drawn: the slice still opens the Meridian room, and a card inside it opens the sheet. Alternative: the `meridian` slice opens the sheet directly and the chat moves one tap deeper. The chair's kickoff §4 A3(c) reads "`meridian` becomes the entry to the sheet" — that is the alternative, not the drawing. Rule which.
- **F-2 · Pre-fill.** The sheet pre-fills date and city from `couples` (witnessed `PUBLIC_SCHEMA.md:399–:403`). If she edits them on the sheet, does the sheet write back to `couples`, or does `assistance_requests` hold its own copy only (drawn: its own copy; `couples` untouched — one writer per plane)?
- **F-3 · Budget as a band or a number.** Drawn: one number per category. The outsider body says "around Rs {{5}}" — a number reads as a band there. Alternative: a picker of bands. The wallet law holds either way.
- **F-4 · Mehendi.** The roadmap names mehendi as a category; the canonical list files it under `other`. Drawn: the row `Mehendi & anything else` mapped to `other`, and the admin forward searches `other` by trade. Alternative: a free-text "anything else" row with mehendi as its placeholder.
- **F-5 · The popup's home.** Drawn on `/frost` as a bottom sheet over the sanctuary. Alternative: a full-screen interstitial before the sanctuary renders. §6.1 governs the frequency; this fork is the shape.
- **F-6 · `Typed by admin` intake and the couple row.** The admin-typed door (A2) writes a request with no `couple_id` until s2 materialises a couple from the phone. `assistance_requests.couple_id` is drawn NOT NULL in the kickoff; the admin door needs it nullable, or a `phone` column beside it. Rule: nullable `couple_id` + `phone text NOT NULL`, or the admin door is held to couples that already exist.

---

## 5 · The §6 questions — asked once, each open, the founder rules here
1. **The popup** — chair proposes: once per login, dismissable, never again after her first request. *Open.* Your word: ______
2. **Fan-out default** — chair proposes 3 vendors per category, founder override in the queue; ≤10 is the precedent (R-40.72). *Open.* Your word: ______
3. **What she sees after Send** — drawn as `S2-sent`: the echo, then `Found so far` naming TDW vendors, outsiders unnamed until they join, an `Asked` count row (#30–#31) that you may strike. *Open.* Your word: ______
4. **The label's typography** — `Discover-Storefront` (a) or `Discover · Storefront` (b); both drawn in `E1-settings` at rail width and as the bloom title. *Open.* Your word: ______
5. **Introductions** — not this seat's; carried on the roadmap (R-41.11). *Open, elsewhere.*
6. **F-41.1** — Back from `/vendor/rooms` stays inside the shell? *Open.* Your word: ______
7. **The assistant's name on the surface** — drawn as `Your wedding assistant` with `The Dream Wedding` as the actor. Alternatives: `Ask The Dream Wedding` · `Concierge` · `Find my vendors`. No persona name in chrome either way. *Open.* Your word: ______

Sequencing beyond this sitting is the founder's.
