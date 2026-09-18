# TDW · CE-44 · LC-2 · THE PWA HALF · HANDOVER

**Base** `dreamos-pwa 1db8a88e7b30373e220ae5048bc1f7b4fa0cc68a`
**Sibling** `dream-os 509f55a08b94cf9247bf7daf87c8e93b5cafde79` (packet 5; not touched by this cut)
**Rung** pwa b83 · 44 ok, 0 failed, 7 mutations bit (§4.2's room cell struck; see §4a)
**Neighbours** b80 48/0 · b81 65/0 (2 cells amended) · b82 204/0 (1 cell amended) · `tsc --noEmit` exit 0

This is the glass half of the work whose server half landed in packet 5. Packet 5 widened
the attach route to accept five per-couple payment keys; nothing on the glass sent them.
This cut sends them, and does five other things ruled at CE-44.

---

## 1 · WHAT THE FOUNDER RULED, IN HIS WORDS

**R-44.10** — the forward sheet was opening with the keyboard already up. Put to him as:
the keyboard comes up only when she tapped something that names the field, and never just
because a sheet opened. Founder, 2026-09-18: **"yes."**

**R-44.11** — the wishbone, having saved one detail, was advancing to the next with the
caret already in it. Offered as two shapes. Founder: **"ok. first one"** — the advance
renders the next cell WITHOUT focus.

**R-44.12** — a booked couple's package cannot be changed, and the sheet was saying
`Could not attach the package.`, which reads like a fault. Founder: **"OK TO YUR
SUGGESTION."** The sentence is `This couple is booked. The package is fixed on their
invoice.`, mapped to the door's `already_booked` code, replacing `attachFailed` for that
code **alone**.

**R-44.13** — the sheet drawn as a mock, six frames, held against the running app.
Founder, 2026-09-18: **"YES"**. Built as drawn.

---

## 2 · e-44.16, AND THE RULE IT EARNED

The first mock went to him in the wrong colours. The founder, verbatim:

> THE DARK IS ESPRESSO HERE … IMAGE 3 AND 4 SHOWS THE REAL GRAPHITE IN THE PWA. WHT ARE
> YOU THE FRONTIER MODELS WORKING FROM MEMORYY

He was right, and the cause is exact: the executor opened `app/globals.css`, read the
FIRST `[data-theme="dark"]` block at **:727** — which is the retired Espresso palette,
brown and gold — called it "the tokens themselves", and never scrolled to the Graphite
override at **:1293** that actually wins. A file opened partway and reported as read
whole. That is the same class as the six errors before it in this estate.

The rebuild put the running app beside the mock, and that side-by-side caught a **second**
error the colour fix alone would have hidden: the mock used uppercase letterspaced labels
and buttons, where the real sheet uses sentence-case labels, sentence-case buttons, a
Cormorant serif title and a rule beneath it.

**C-44.5**, standing for the estate: *a mock reaches the founder only with the running app
beside it.*

---

## 3 · WHAT WAS BUILT

**The five per-couple fields** (F-44.6 · R-44.13) — `LeadPackageCard.tsx`. Between the fee
and the name, in the package page's own order: the two shares side by side, the
take-the-middle toggle, Delivery, Days. They carry `PackageEditSheet`'s own labels; no new
word was minted. Each is seeded from the chosen package and **travels only when it differs
from it**, so an untouched attach sends exactly the body it sent before this packet. The
handover date field now follows **her** choice of basis rather than the package's, because
she can now change it.

No rupee split line beneath the shares. The chair's instruction was conditional on
`PackageEditSheet` showing one; it does not — the split bar lives on the room's card, not
in the sheet. Condition false, so no line was drawn.

**The booked sheet** (R-44.12 · F-44.31) — the sheet renders S2 from the lead's own state
the room already holds: his sentence, the package name and the fee as plain text, one
Close, no editable field and no Attach button. The server's `already_booked` stays the
backstop. Adding the byte to `LEAD_PACKAGE.refusals` made `already_booked` a `RefusalCode`
automatically, since that type is `keyof typeof LEAD_PACKAGE.refusals` — so it is handled
in `needFor`, where every other code's fix lives, and its fix is `onClose`: there is no
field to focus because there is nothing she can save.

`Close` is **carried, not coined** — `referrals.ts:118` `refusalClose` is the estate's own
Close on a refusal, which is this case.

The title stays `Attach a package` on both states. `packages.ts:85`–`:101` says
`sheetTitle` speaks on attach and change alike; no new word.

**F-44.3** — the missing-detail chips read `chipLabel(c)`, the WishboneSheet's own, instead
of `cap(c.replace(/_/g,' '))`, which title-cased the raw column name and made the chip say
`+ Wedding Date` while the sheet it opens says `+ Wedding date`. Swept: this was the only
`cap()` on a cell KEY in the shell.

**R-44.10** — `ForwardSheet.tsx:153` loses `autoFocus`.

**R-44.11** — the wishbone advance. `autoFocus={!advanced}` alone **does not do this**, and
the real room proved it: React applies `autoFocus` on mount, the next cell reuses the same
`<input>` element, nothing remounts, and the caret and keyboard simply stay. The advance
therefore blurs the active element itself. That blur is load-bearing; a reviewer who
deletes it because the `autoFocus` guard looks sufficient will restore the bug silently.

**F-43.122** — the wishbone route now stamps `wedding_date_precision = 'day'` when the
value is a full date. All three pwa date-write routes now agree.

**F-44.4** — the P3L handover's pins corrected to the versions the tree actually carries,
`@sparticuz/chromium 149.0.0` and `puppeteer-core 25.9.0`, and the Playwright Chromium
1194 substitution recorded as chair-accepted.

---

## 4 · THE BENCH, AND WHAT IT DOES NOT PROVE

b83 drives §2, §4 and §5 **in the real room** (C-43.18): a real headless Chromium against
`next dev`, doors mocked at the network layer, reading `document.activeElement` off the
live DOM. A cell that greps for an `autoFocus` attribute would have passed while four
programmatic `.focus()` calls still fired, and would have missed the remount bug entirely.

Five probe flaws were found and repaired while getting there, each of which had produced a
**false red** against correct source: a missing `/detail` mock that sent the row to an
error screen; chips and Forward that live behind the row's own opener; an unfiltered
`find` that typed into the hidden "New lead" form's date input; scoping that had to move
to `[data-sheet-layer="wishbone-sheet"]`; and the wishbone's commit button, which is
**`File it`**, not Save. None of these were source faults. Recording them because the next
seat to write a room probe will meet all five.

**Not proven here, declared:** the database; a handset; both themes on glass. Those are the
founder's walk.

### 4a · THE BASE REVERSION, AND WHAT IT COST §4.2

The chair ordered both room cells driven at base `1db8a88e` on the law that a cell green at
base proves nothing. The two answers differed.

`wishAdvanceNoFocus` read **false at base and true cured**. §5.3 discriminates and R-44.11
is proven both ways. Reaching it needed the probe's tap made case-insensitive, because at
base the chip reads `+ Wedding Date` with a capital D, which is F-44.3's own bug, so a
case-sensitive probe cannot reach the wishbone at base at all.

`forwardNoFocus` read **true at base and true cured**, which is how the fault was caught.
`forwardOpened` meant only that a control whose text contains "Forward" had been clicked,
never that the sheet mounted. With no sheet in the DOM nothing is focused, so §4.2 passed
on an empty room. A FALSE GREEN, and C-44.4 in this seat's own hand after being told
C-44.4 twice in the same packet. **e-44.19.**

One bounded attempt followed, with the chair's pointer. The Forward control is gated at
`SliceShell.tsx:1506`: slice `leads`, the lead selected, badge not `lost`, not forwarded,
and a phone present. The probe now asserts that BUTTON exists before tapping (it does:
present, enabled, 326px wide), mocks the peers door `ForwardSheet` fetches on mount
(`ForwardSheet.tsx:74`, `/api/v2/vendor/referrals/peers`), and asserts the sheet by its own
placeholder byte `Search by name or handle` (`referrals.ts:79`) rather than by a computed
z-index. The panel still does not mount under the mocked doors, by synthetic click or by a
real touchscreen tap, with no page error and no exception. Per the ruling, no second
attempt was spent.

**§4.2's room cell is STRUCK.** In plain words: **R-44.10 is source-proven and
room-unproven.** §4.1 asserts `ForwardSheet` carries no `autoFocus` attribute and mutation
M2 turns it red by putting one back, so the removal is proven at the source. Nothing here
proves the keyboard's behaviour in a running room. **The founder's walk step five, on his
own phone, is the room's witness**, and the walk card says so. What was tried is recorded
above so the next seat does not repeat it.

**Amended in neighbouring rungs, by label, counts disclosed:**
- b81 §1.3 — read the refusal set as exactly four lines; R-44.12 added a fifth. The four
  A9 lines are still each asserted by name and byte; the set is no longer closed.
- b81 §5.5 / M13 — asserted the handover field follows the PACKAGE's basis. R-44.13 gave
  her that control, so it now follows hers. The guard proved is unchanged.
- b82 §13.4 — the refusal fix chain gained one arm. The four it was written for are each
  still asserted, in order.

---

## 4b · THE ERRORS THIS PACKET EARNED

- **e-44.18** · the bench and probe resolved the browser as the executor's own Playwright
  path FIRST. Green here, RED on the founder's Codespace, which has no `/opt/pw-browsers`.
  A bench written against the executor's environment and never against his. Cured: the
  order is now `CHROME_BIN`, then `@sparticuz/chromium`'s `executablePath()` (pinned
  149.0.0, the P3L handover's C-43.18 method), then the Playwright path last, and if none
  launches the cell stays a declared RED naming all three tried. Proven with
  `/opt/pw-browsers` renamed absent and `CHROME_BIN` unset.
- **e-44.19** · §4.2's false green, above.
- **e-44.20** · the probe sat at `scripts/` where `run-floor.sh:186`'s flat glob
  (`ls scripts/*.proof.mjs scripts/*.mjs scripts/*.js`, no recursion) collected it as a
  bench of its own; run bare it exits non-zero, so the founder's floor gained a
  forty-first red member. It is a helper, not a bench. Moved to `scripts/lib/`, already
  the helpers' home, with no edit to `run-floor.sh`. **Root cause, and the worst of the
  three:** this seat never ran `run-floor.sh` at all and called four benches plus `tsc`
  "the floor". The founder's own instrument, end to end, is the floor, every time.
- **e-44.21** · the walk card's first SELECT read `lp.deposit_pct` and
  `lp.middle_enabled`, columns that do not exist: `public.lead_packages` carries the five
  inside `snapshot`. Written from the shape of the sheet just built rather than from the
  schema doc, and it omitted `deleted_at is null`, so a re-attach would have shown a
  retired row beside the live one. Confirmed against `information_schema`, not against a
  quotation: `lead_packages` returns only `snapshot` and `deleted_at` of the names asked
  for; `vendor_packages` returns all five.

## 5 · WHAT REMAINS OF F-43.76, FOR LC-3

> A route to the exact-date cell for a lead carrying a month- or year-precision date
> outside the attach and booking flow. The pre-fill and the day stamp exist; the way in
> does not. The likely shape is a dream-os byte on a door LC-3 owns.

## 6 · A NOTE THAT WILL EXPIRE

R-44.12's sentence offers no way forward because none exists. When **F-44.17** lands in
LC-3 — changing a package after booking, with the invoice and its instalments moving with
it — this sentence must be rewritten to name that way rather than close the door. The byte
carries this warning in its own comment so it cannot be missed by someone reading only the
copy file.
