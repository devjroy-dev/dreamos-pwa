# repo: dreamos-pwa @ 3c72a50aa8b87d50479c960fa4d1ffaf8b02919e
# TDW · CE-43 · SEAT LC-2r · PACKET 3c · HANDOVER (the dreamos-pwa half) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `3c72a50aa8b87d50479c960fa4d1ffaf8b02919e` (the packet 3 pwa commit), re-derived at origin at the moment of cutting. That commit's parent is `49b1a44`; its changed set equals the packet 3 pwa manifest (17 files), and every file is byte-identical to that ZIP.
- The dream-os half of 3c is at origin as `83f0bb98f05b47cf27a50cc87bb8b597fb332091` (parent `c2c9c91`), checked the same way: 5 files, byte-identical. Its handover (dream-os `docs/handovers/TDW_CE43_LC2_P3C_HANDOVER.md`) records F-43.87 to F-43.92.

**Scope and status.**
- No new byte except "Lead" (vetoed in the ruling).
- Rung unchanged (b82).
- New finding: F-43.94.
- Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §1 · The ruling built (CE-43, 2026-09-17, on the founder's walk and lead-detail questions)

| Item | What | Where |
|---|---|---|
| **F-43.88** | On a booking's invoice, Mark paid marks the row paid the instant it is tapped. Further taps are ignored while the request is out (`payingRef`, read synchronously). A refused call restores the row, then shows the existing byte `Payment on {invoice} failed.`. A fully paid answer settles the row (`settledRef`): its swipe, its row button and the bulk act are withheld until the list refetches with nothing owed. No "Already settled." is added. The founder's Network paste confirmed the refused second call's text: `{"ok":false,"error":"Invoice is already fully paid."}`. | `SliceShell.tsx` (`packagePayBlocked`, the invoice swipe, the row button, `runBulk`) |
| **F-43.89** | A closed shared sheet is `inert` instead of `aria-hidden`, so the browser drops focus from it. | `PackageFields.tsx` `Sheet` (the attach, edit and booking sheets) |
| **3(a) / 4(a)** | `Booking confirmed` and `Advance paid` are always present on a lead that is not booked, once the card has read. With a package they open the booking sheet. With none they open the attach sheet first, and the chosen booking continues once the package is attached. Closing the attach sheet drops it. | `LeadPackageCard.tsx` (`book`, `pendingKind`) |
| **1(a)** | The package card, with its booking controls, sits at the top of the lead detail body, above the detail rows. The footer is untouched. | `DetailSheet.tsx` (new optional `detailTop` slot, rendered before the rows); `SliceShell.tsx` (the card moves from `detailExtra` to `detailTop`) |
| **Point 7** | The thread's inbound sender reads the lead's own name, falling back to `Lead`. `Bride` is gone from the vendor's thread. | `ConversationThread.tsx` (`inboundSender`, `leadName`); `SliceShell.tsx` (the lead detail keeps `lead.name` and hands it over) |

**Filed by the ruling to LC-3 as F-43.93, with F-43.90** (the founder's screenshots are the brief):
- 1(c) and 2: Forward and Mark lost out of the pinned footer (Block 19's R-G51.5 needs its own ruling);
- 5: Mark lost versus Delete;
- 6: the conversation collapsed behind a show-all control.

**F-43.94 · reported, not built (the ruling named one component).** `ClientBookingSheet.tsx` is not the shared `Sheet`. It sets its own `aria-hidden={!open}` and closes itself after C4 or C5 while `Add client` holds focus, so it will log the same warning F-43.89 cured. One word from the chair moves it to `inert` the same way.

## §2 · Control inventory (CE-115)

- **Lead detail.**
  - The package card MOVED from below the detail rows to above them.
  - `Booking confirmed` and `Advance paid` MOVED from "only under an attached package" to "always, on a lead that is not booked". With no package they now open the attach sheet first.
  - Every footer control is KEPT and unmoved.
- **Invoices, on a booking's invoice.**
  - Mark paid (swipe and row button) is KEPT, and is now withheld while its payment is out and once the invoice is settled.
  - Bulk Mark paid is KEPT. A settled or in-flight booking invoice counts as done without a call, the same as any row with nothing owed.
- **Lead detail thread.** No control changed; the sender label is now the lead's name, or `Lead`.
- **Attach, edit and booking sheets.** No control changed; closed sheets are `inert`.

## §3 · What is proven

- **The benches, cured.** b82: 98/98 (§10 is new; §4.8, §5.1 to §5.3 and M10, M12, M13 amended by label; M20 to M24 new). b80: 48/48. b81: 65/65. tdw37: 20/20.
- **The labelled amendments, derived.**
  - b80 §5.1 and M6, b81 §5.8: the card mount moved into `detailTop`; the asserted fact, "on the leads detail only", is unchanged.
  - tdw37 "invoices RIGHT": the pattern admits the F-43.88 guard in front of the same label and write.
  - tdw37 census: the answered D3/D4 site now follows the wrapped call and the restore.
- **Both ways.** On a clean worktree at `3c72a50` with the amended benches copied in:
  - b82 reads 76 passed and 22 failed, exactly the 3c cells and mutations;
  - b80 reads 3 failed (§5.1, §5.5, M6);
  - b81 reads 1 failed (§5.8);
  - tdw37 reads 1 failed (the census).
- **Readers and scanners.** 17 readers of the five touched files, plus the whole-tree scanners, are identical to base by exit code and failing-line count.
- **Type check.** `tsc --noEmit` on the whole tree exits 0.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build` (Google Fonts are unreachable here);
  - rendering, focus behaviour, both themes and gestures on a device;
  - the database.

  The founder's verify (a cold `next build` and the floor) and card P3 are their witness.

## §4 · Card P3, resumed (as ruled: from step 5; the next-due line moves to step 7)

Start only when Vercel reads Ready on this pwa push, and Railway's vendor service is Active on a deployment newer than the dream-os 3c push (`83f0bb9`).

5. **Sarah's event (F-43.87, dream-os 3c).**
   - On Leads, swipe Sarah right, then tap `Confirm booking`. The toast reads `Booked. The client, the event and the invoice are ready.`
   - Events now shows `Sarah · wedding` on 22 Dec 2026.
   - Q-P3-c returns exactly that one row (Verma's reception no longer appears; F-43.91 was cleared). Q-P3-d and Q-P3-e are unchanged: one invoice, two milestones, both paid.
   - 📸 Screenshot of Events.
5b. **The new lead detail (1(a), 3(a), point 7).**
   - Open Leads → Anjali (no package). The package card sits at the top, and shows `Attach package`, `Booking confirmed` and `Advance paid`.
   - Tap `Advance paid`: the attach sheet opens. Close it (Cancel): nothing opens after it.
   - Scroll to the conversation: her messages are signed `Anjali`, not `Bride`.
   - 📸 Screenshot of the top of the detail, and of one message.
7. **The walk-in, with the next-due line.**
   - `Photographs and film` has its middle payment off (Sarah's schedule shows two rows), so the advance stays off here. That way the first payment is the deposit and the next-due line has something to name.
   - Clients → +. Name `Riya Test`, no phone, wedding date 20 January 2027, package `Photographs and film`, Advance received **off**. Tap `Add client`. The toast reads `Added. The client, the event and the invoice are ready.`
   - Open Invoices → Riya Test's invoice and tap `Mark paid` twice, quickly. Only the first tap acts. The toast reads `Payment marked: Riya Test · Deposit, 30% of the fee, on booking · Rs 24,000 · {today in full}. Next due 6 March 2027.` That is the wedding date plus 45 days: the remainder is due on delivery. No `Payment on … failed.` appears.
   - Tap `Mark paid` once more. The toast reads `Payment marked: Riya Test · paid in full.`, and the row's `Mark paid` is gone.
   - Run Q-P3-g.
   - 📸 Screenshots of each toast.
8. **The swipe on a lead with no package.** On Leads, swipe Kunal Dhillon right. The booking sheet opens; `Confirm booking` says `Attach a package first.`; tap `Cancel`.
9. **Graphite.** Screenshot the booking sheet, Anjali's card at the top of her detail, and the Clients + sheet with Advance received on.
   - Also, with DevTools open, confirm that `Confirm booking` no longer logs "Blocked aria-hidden…" (F-43.89).
   - The Clients sheet may still log it: that is F-43.94.

Sequencing beyond this sitting is the founder's.
