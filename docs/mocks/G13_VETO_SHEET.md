# G13_VETO_SHEET — BLOCK 19 · G1.3
**ANSWERED 2026-09-06.** The founder delegated the veto to the chair (**R-40.42**); the VERDICT column carries the chair's answers and they are the founder's to override by number. Three rows moved — **#5** re-worded, **#29** re-worded, **#32 REFUSED** — and the mock was redrawn against them before this sheet was committed, so the sheet and the frames agree by construction rather than by care.

**Rows still UNVETOED and therefore unshippable: 35, 36** (withheld by ruling, not by omission).

**Source of every proposed byte:** `docs/mocks/wedding-team-mock.html` @ this delivery — ten frames, 23 captures: T1–T4 (public, light), T5 (the cards), T6-reel-off / T7-reel-ready (both probe states, both modes), P1–P2 and P0-scale (paper). A string in this sheet that is not in that file is a defect in this sheet. A string in that file that is not in this sheet is the same defect the other way round.

**CURRENT is empty for every row.** No G1.3 byte exists anywhere in either tree; this is a new surface set, not a re-voicing. Where a proposed byte is an EXISTING approved string being re-used, the row says so and its current home is named — those rows are **reuse decisions, not new copy**, and a `no` on them means "author a new one", never "delete the existing".

---

## A · THE DOOR ON THE ROLL — guest-facing, public leaf (R-G13.3)

| # | Where | Current | Proposed | Note | Verdict |
|---|---|---|---|---|---|
| 1 | the door on each linkable credit | — | `Enquire on WhatsApp` | **REUSE**, byte-identical, from `app/v/[code]/page.tsx:116` (`COPY.enquire`), already vetoed and live on every storefront. One home, two readers. Alternate if the repetition reads heavy down a long roll: `Enquire` | **yes** — reuse as is |

**A note that is not a byte.** The door appears only on a credit that is `claimed` **and** resolves to an active, unpaused vendor. On the fixture that is exactly one of four credits. An unclaimed credit keeps no door — the roll is not a directory (R-G11.6).

## B · BOOK THE SAME TEAM — guest-facing, public leaf (R-G13.1)

| # | Where | Current | Proposed | Note | Verdict |
|---|---|---|---|---|---|
| 2 | the control at the foot of the roll | — | `Book the same team` | The master's own phrase (§4 G1.3, `:92`). It is a `<summary>`, so it is both the tap target and the thing that opens the sheet | **yes** |
| 3 | the sheet's head | — | `Book the same team` | Same words as the control, deliberately: the sheet is the control opened, not a new place | **yes** |
| 4 | the sheet's sub-line | — | `One enquiry reaches everyone on this page who is on The Dream Wedding.` | **Honest about the limit.** Not "everyone on this page" — a credit with no TDW account cannot receive a lead, and the sheet must not imply it can | **yes** |
| 5 | the roster's label | — | `The team` | | **AMENDED → `The team`** |
| 6 | the roster | — | *(the vendors' registered business names, one per line)* | **NOT COPY — DATA.** Named because consent to "the team" is not consent if the team is unnamed. Registered `business_name` only, never a typed credit name | **data** |
| 7 | the number field's label | — | `Your number` | **REUSE** from `lib/public/copy.ts` (`PUBLIC_DOWNLOAD.phoneLabel`) | **yes** — reuse |
| 8 | the month field's label | — | `Getting married? Which month` | **REUSE** (`PUBLIC_DOWNLOAD.monthLabel`) | **yes** — reuse |
| 9 | the month field's placeholder | — | `Month and year — optional` | **REUSE** (`PUBLIC_DOWNLOAD.monthPlaceholder`) | **yes** — reuse |
| 10 | **the one question** | — | `Everyone listed above may contact me.` | **A NEW CONSENT, NOT THE DOWNLOAD'S.** The download's question names one party (`PUBLIC_DOWNLOAD.mayContact`); this names the set. Unticked by default — silence never means yes, and neither does a pre-ticked box | **yes**, unticked |
| 11 | the submit | — | `Send my enquiry` | | **yes** |
| 12 | the sheet's fine line | — | `Your number is never shown on this page.` | **REUSE** (`PUBLIC_DOWNLOAD.fine`) | **yes** |
| 13 | the confirmation's head | — | `Your enquiry is with the team.` | Renders on `?team=1`, the same leaf (R-G13.6) | **yes** |
| 14 | the confirmation's roster | — | *(the same names, repeated back)* | **NOT COPY — DATA.** She is told who now holds her enquiry | **data** |
| 15 | the confirmation's control | — | `Message Dev Roy Photography` | The owner's registered name, interpolated. Opens WhatsApp on `TDW-DEV440` — the plain code the intake already parses | **yes** |
| 16 | the confirmation's fine line | — | `Opens WhatsApp with your enquiry ready to send.` | **The expectation set BEFORE the tap**, R-40.50's law: this leaf ships no script and cannot confirm a tap afterwards | **yes** |
| 17 | the failure line | — | `That didn't go through. Try again in a moment.` | **REUSE** (`PUBLIC_DOWNLOAD.readyFailed` / `CLAIM_FAILED`). Typographic apostrophe (R-40.19) | **yes** — reuse |

## C · THE PRINTED UNIT — couple-facing, ON PAPER (R-G13.8)

**These are the strictest rows on the sheet.** A byte here is printed, cut, and put on a table; it cannot be edited after the fact and it is the only TDW surface a guest touches with her hands.

| # | Where | Current | Proposed | Note | Verdict |
|---|---|---|---|---|---|
| 18 | tent card · the eyebrow | — | `Photographs from` | | **yes** |
| 19 | tent card · the title | — | *(the page's own title)* | **NOT COPY — DATA.** The fixture's title is the literal word `Wedding`, which is why P1 reads that way. It is the fixture, not a placeholder | **data** |
| 20 | tent card · the instruction | — | `Scan for every photograph, and for everyone who worked the day.` | One line, and it earns the second clause: the credit roll is the point of the block | **yes** |
| 21 | tent card · the studio line | — | *(registered `business_name`)* | **NOT COPY — DATA** | **data** |
| 22 | both cards · the colophon | — | `Created and managed by The Dream Wedding · thedreamwedding.in` | **REUSE** (`PUBLIC_COLOPHON`). TDW appears exactly once, at the foot, no logo, no gold | **yes** — reuse |
| 23 | insert · the eyebrow | — | `With thanks` | | **yes** |
| 24 | insert · the thank-you | — | `Thank you for being part of the day. The photographs are here whenever you would like them.` | **⚠ THE VOICE IS A FORK — see 24b.** Drawn neutral: the day thanks the guest and nobody is quoted | **CHOSEN** |
| 24b | insert · the thank-you, ALTERNATE | — | `Dev Roy Photography photographed this wedding. The photographs are here whenever you would like them.` | The studio speaking plainly in its own voice. **Choose 24 or 24b.** The card leaves the couple's table in a guest's hand, so 24 reads as the couple's words — which no couple wrote. 24b never puts words in her mouth and is duller | **REFUSED** |

## D · THE RECORD — vendor-facing (R-G13.13; the record gains TWO controls)

| # | Where | Current | Proposed | Note | Verdict |
|---|---|---|---|---|---|
| 25 | the cards section label | — | `Printed cards` | | **yes** |
| 26 | the cards explanation | — | `A tent card for the tables and a thank-you insert, both carrying this page's code.` | Typographic apostrophe | **yes** |
| 27 | the make control | — | `Make the cards` | | **yes** |
| 28 | the two links, after the call returns | — | `Tent card` · `Insert` | They appear only once the door has answered — before that there is one control and no promise | **yes** |
| 29 | the cards' failure | — | `The cards couldn’t be made. Try again.` | Chair's wording. Typographic apostrophe (R-40.19) | **AMENDED** |
| 30 | the reel section label | — | `Reel` | | **yes** |
| 31 | the reel explanation | — | `A fifteen-second cut of this gallery, ready to post.` | | **yes** |
| 32 | the reel control, dark | — | ~~`Not available yet`~~ **no control at all** | **REFUSED: a disabled control is the greyed-control class this arc refuses.** Probe *not detected* → the control is ABSENT and #33 stands alone; probe *ready* → the control ARRIVES as `Make the reel` (vetoed here, R-40.53). Presence is the state, so a vendor never reads a control and a refusal at once. Frames T6-reel-off / T7-reel-ready | **REFUSED** |
| 33 | the probe's line | — | `Video tools on this server: not detected.` / `Video tools on this server: ready.` | Plain register, no jargon: the vendor is not told "ffmpeg". **This line is how F-40.16 closes** — the founder reads it on his walk, from the running service | **yes** |
| 34 | the probe's re-run | — | `Check again` | | **yes** |

## E · DARK, NOT DRAWN — proposed for the record, shipping behind flags

| # | Where | Current | Proposed | Note | Verdict |
|---|---|---|---|---|---|
| 35 | the reel caption template | — | *(withheld pending 33's answer)* | **W-1: a template with the founder's veto, never a Victor byte.** It is not proposed in this delivery because a caption for a reel that cannot render is a byte with no surface — the estate's own rule about withheld strings (F-40.99, `weddingPages.ts`) | **withheld** |
| 36 | the texted-link template body | — | *(withheld)* | F-40.104. It would be the **eighth** Block-19 template, not the seventh — `templates.js:326` already holds that name. Filed for its own veto pass | **withheld** |

---

## THE TWO ROWS THAT ARE NOT COPY QUESTIONS

**Row 6 / 14 / 19 / 21 are DATA, and they carry a rule:** every name printed on any of these surfaces is the vendor's **registered `business_name`**, never the name someone typed into a credit. `publicRoll` already enforces it for linkable credits (`weddings.js:576`) and F-40.54 is why — a hurried credit once mislabelled another business.

**The nameless credit (R-G13.14 = (a)).** The team door inherits `publicRoll`'s filter, so a credit with no name and no vendor is never a target and never appears in row 6's roster. It remains stored and counted; that divergence is filed for the next Wedding-pages pass with its specimen row id `wedding / styled_by / created 2026-09-05 16:50:56.933878+00`.
