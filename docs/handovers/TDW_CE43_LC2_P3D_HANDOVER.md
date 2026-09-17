# repo: dreamos-pwa @ cf027b315fe965faf5358af864ccb84e0ce340d7
# TDW · CE-43 · SEAT LC-2r · PACKET 3d · HANDOVER (dreamos-pwa only) · 2026-09-17

Cut on dreamos-pwa `cf027b315fe965faf5358af864ccb84e0ce340d7` (3c pwa), re-derived at origin at the moment of cutting.

- **3c at origin.** It is `cf027b31` (parent `3c72a50`). Its changed set equals the 3c pwa manifest (12 files), and every file is byte-identical to that ZIP.
- **dream-os** stands at `83f0bb9` and is untouched by this packet.
- **Bytes.** Two new bytes, both vetoed in the ruling: `Show all messages` and `Show fewer`.
- **Rung.** Unchanged (b82).
- **Status.** Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §1 · The ruling built (CE-43, on the founder's halted walk after 3c)

| Item | What | Where |
|---|---|---|
| **F-43.95 (a)** | The swipe-right `Booked` is withheld on a lead that is already booked. The card already withholds its booking controls there. There is no re-run path. | `SliceShell.tsx`, the leads arm of `swipeSidesFor` |
| **F-43.97 (a)** | One aligned control column follows the package: `Attach package` / `Change package` full width, then `Booking confirmed` and `Advance paid` as an exactly equal pair (a two-column grid). The card closes with spacing and a hairline before the detail rows, and the eyebrow stands alone. Tokens only, so Chalk and Graphite both resolve. | `LeadPackageCard.tsx` |
| **F-43.96** | The thread stamp is `{sender} · {day in full month} · {time}`. The day is the IST calendar day. The stamp uses the existing renderers (`istDateOf`, `packageDate`, the file's `fmtTime`) and renders at the thread's own label size (the `Conversation` label: label face, 8px, uppercase, 0.25em). It is never a bare clock time. | `ConversationThread.tsx` (`stampOf`) |
| **F-43.93 point 6** | The thread opens on its last three messages. `Show all messages` sits above them while collapsed; `Show fewer` sits below the full thread once expanded. A thread of three or fewer messages shows no control. | `ConversationThread.tsx` (`THREAD`, `COLLAPSED_COUNT`, `visibleMessages`) |
| **F-43.94 (YES)** | A closed Clients sheet is `inert`, not `aria-hidden`: the same cure F-43.89 applied to the shared sheet. | `ClientBookingSheet.tsx` |

**Reading disclosed.** "At the label size" is taken as the thread's own label (`Conversation`, 8px uppercase), the same size as the detail sheet's field labels. The chair may name another size in one word.

## §2 · Reported, not built: point 5 cannot execute as a pwa-only change

The ruling asks that the binder card's "No story yet" line be hidden on a client with a booked lead behind it, using the F13(a) predicate. **The pwa cannot see that predicate.**

- F13(a) keys on `leads.binder_id` (dream-os `src/lib/vendor/bookedLeads.js`).
- `binder_id` is on no wire by F-43.73's ruling (dream-os `src/lib/vendor/leadSerializer.js`, `LEADS_COLUMN_CENSUS`).
- The cabinet read (dream-os `src/api/vendor-engine/cabinet.js`) applies the predicate to choose the Clients slice, but does not mark which binders passed it.
- The Clients room's only lead signal is the phone-keyed cross-chip (`clients/body.tsx`, `leadByPhone`). That is an approximation, and it misses phoneless walk-ins such as the card's `Riya Test`.

**Forks for the chair:**
- **(a) Seat's lean.** A one-line dream-os change: the cabinet read marks each client binder with `booked_lead: true` from the set it already reads (no new query). The pwa then hides the line on that flag.
  - That is a small dream-os packet (3e), with its bench cell, plus a pwa cell.
  - No new byte.
- **(b)** The phone-keyed cross-chip reading `booked`: pwa-only, but it misses phoneless clients.
- **(c)** Leave the line to LC-3 with F-43.90's booking summary.

## §3 · Control inventory (CE-115)

- **Leads, swipe right `Booked`.** KEPT on every lead not yet booked; REMOVED BY RULING on a booked lead (F-43.95).
- **Lead package card.**
  - `Attach package` / `Change package` MOVED from the eyebrow row to the full-width head of the control column.
  - `Booking confirmed` and `Advance paid` MOVED into an equal-width pair beneath it.
  - Nothing added or removed.
- **Lead detail thread.**
  - ADDED `Show all messages` / `Show fewer` (F-43.93 point 6, vetoed).
  - The thread opens collapsed.
- **Clients sheet.** No control changed; closed is `inert`.

## §4 · What is proven

- **b82 cured.** 115/115.
  - §11 is new.
  - §4.1, §5.1, §5.2, M7 and M12 are amended by label.
  - §10.9's stub is amended, because the thread now imports the copy home.
  - M25 to M30 are new.
- **b82 both ways.** On a clean worktree at `cf027b31`: 95 passed, 20 failed, exactly the 3d cells and mutations. §11.11 (the thread's three pre-existing colour literals) is a true fact at base.
- **Other packet benches, cured.**
  - b80: 48/48.
  - b81: 65/65.
  - `tdw37_hygiene_false_success`: 20/20. "leads RIGHT" is amended by label to admit the booked guard, and holds at base.
- **Readers and scanners.** 19 readers of the touched files, plus the whole-tree scanners, are identical to base by exit code and failing-line count, except one, amended by label.
- **`tdw37_leadgate_b_slot`.** In the named floor base, red at base with 5 lines.
  - Its cell "the RIGHT side (Booked) is untouched for every row shape" went red under F-43.95.
  - The amendment keeps its subject (redaction and an absent phone never change the right gesture) and admits the booked guard, asserted on the right side's own expression.
  - After it, the cured failing lines equal base, and the amended cell holds on both trees.
  - It stays out of the verify's bench step, because it is red in the base, and is judged by the floor.
- **Type check.** `tsc --noEmit` exits 0.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build` (Google Fonts are unreachable here);
  - rendering, both themes and the gesture on a device;
  - the database.

## §5 · Card P3, resumed after 3d (as ruled: 5b, 7, 8, 9)

Start when Vercel reads Ready on this push. dream-os is unchanged at `83f0bb9`.

5b. **Anjali.** Open Leads → Anjali.
   - The card leads: the `PACKAGE` label, then `Attach package` across the width, then `Booking confirmed` and `Advance paid` side by side at equal width, then a hairline, then the detail rows.
   - Tap `Advance paid`: the attach sheet opens. Cancel it: nothing opens after.
   - Scroll down. The conversation shows its last three messages under `Show all messages`, each stamped like `ANJALI · 17 SEPTEMBER 2026 · 02:05 AM`.
   - Tap `Show all messages`; `Show fewer` appears at the bottom.
   - Also open Sarah: she reads booked, so her card shows `Change package` and no booking pair. Swiping her row right does nothing.
   - 📸 Screenshots.
7. **The walk-in.**
   - Clients → +. Name `Riya Test`, no phone, wedding date 20 January 2027, package `Photographs and film`, Advance received **off**. Tap `Add client`. The toast reads `Added. The client, the event and the invoice are ready.`
   - Invoices → Riya Test. Tap `Mark paid` twice, quickly. The toast reads `Payment marked: Riya Test · Deposit, 30% of the fee, on booking · Rs 24,000 · {today in full}. Next due 6 March 2027.` No failure toast appears.
   - Tap `Mark paid` again. The toast reads `Payment marked: Riya Test · paid in full.`, and the control goes.
   - Run Q-P3-g.
   - With DevTools open, `Add client` logs no "Blocked aria-hidden…" (F-43.94).
8. **The no-package swipe.** Swipe Kunal Dhillon right. The booking sheet opens; `Confirm booking` says `Attach a package first.`; tap `Cancel`.
9. **Graphite.** Screenshot Anjali's card at the top of her detail, the booking sheet, and the Clients + sheet with Advance received on.

Sequencing beyond this sitting is the founder's.
