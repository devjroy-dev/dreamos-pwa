# repo: dreamos-pwa @ 6d8d2751f63a219778227e55f524b0c3c890d6a4
# TDW · CE-43 · SEAT LC-2r · PACKET 3e · HANDOVER (the dreamos-pwa half) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `6d8d2751f63a219778227e55f524b0c3c890d6a4` (3d), re-derived at origin at the moment of cutting.
- The dream-os half of 3e (point 5 (a), `booked_lead` on the Clients binders) is at origin as `3e0b0851921cbff7fc257eb3e0e42b86c8a94cfa` (parent `22ea0b0`), re-derived by `git fetch` before this cut: its changed set equals the 3e dream-os manifest (5 files), and every file is byte-identical to its ZIP (R-38.16). Its handover is dream-os `docs/handovers/TDW_CE43_LC2_P3E_HANDOVER.md`.

**Scope.**
- No new byte.
- Rung unchanged (b82).
- New finding: F-43.103 (disclosed, §3).

**Status.** Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §1 · The ruling built (CE-43, card P3 closed; packet 3e; F-43.100 fork (a))

| Item | What | Where |
|---|---|---|
| **F-43.102 (a)** | The swipe-right `Booked` on a lead with no package reads the lead's package (`GET /leads/:leadId/package`, the existing read). With none, it opens the attach sheet first; once the package is attached, the booking sheet opens. With a package, or on a failed read, it opens the booking sheet as before. | `SliceShell.tsx` (`openBookingFromSwipe`, `attachFirst`, an `AttachSheet` mounted on Leads) |
| **F-43.102 (b)** | On a `no_package` refusal the booking sheet shows A2's `Attach package` under the A9 line. It opens the attach sheet beside the booking sheet (a sibling, never nested inside the sheet's transformed container). Once attached, the refusal clears and `Confirm booking` can run. | `BookingSheet.tsx` (`needsPackage`, `attachOpen`) |
| **F-43.102, shared** | The one attach sheet is exported and reused, not copied. | `LeadPackageCard.tsx` (`export function AttachSheet`) |
| **F-43.100 (a)** | The toast message wraps and clips with an ellipsis only past the fourth line (`-webkit-line-clamp:4`, `white-space:normal`). This is app-wide. | `components/worklist/WlToast.tsx` |
| **F-43.101** | An open invoice detail follows its row: when the list refetches, the open sheet takes the fresh row with the same id, so Paid, Owed, State and Due update. The schedule panel's `Paid` now refetches the list, as the row, swipe and bulk paths already did. | `SliceShell.tsx` |
| **Point 5 (a)** | The binder card's "No story yet" line is not shown when the binder carries `booked_lead: true` (dream-os 3e). The booking summary on the client card stays LC-3 (F-43.90). | `BinderCard.tsx`; `lib/vendor/api/vendor.ts` (`CabinetBinder.booked_lead`) |

## §2 · The F-43.100 measurement (the method, stated as ruled)

**The font.** DM Sans **Medium** advance widths, read from the sibling `../dream-os/tools/card_fonts/DMSans-Medium.woff2` by a small WOFF2 reader inside b82 (cmap, head, hhea, hmtx).
- The toast sets DM Sans 400 at 14px (`--wl-t3`). Medium is a touch wider, so the line counts are conservative (accepted by the chair).
- At the cut, the reader was cross-checked against fontTools on the same file: 360, 803, 958 and 260 px, equal in both methods.

**The width.** Greedy word wrap into the toast's text width at a 374px handset, derived from WlToast's own CSS and pinned by b82 §12.2:
- max-width `calc(100vw - 40px)`;
- padding 18px each side;
- a 6px dot and an 8px gap;
- so 374 − 40 − 36 − 6 − 8 = **284px**.

**Measured lines.**

| Line | Lines at 284px |
|---|---|
| C4 `Added. The client, the event and the invoice are ready.` | 2 |
| A13 `Booked. …` | 2 |
| C5 `Saved as a lead. …` | 2 |
| D3 with the deposit label (Riya Test, Rs 24,000, 17 September 2026, 6 March 2027) | 3 |
| D3 with the middle label | 4 |
| D3 with the remainder label, the longest | 4 |
| D4 | 1 |

All render whole under the four-line clamp. At two lines, D3 would be cut (b82 M33).

## §3 · F-43.103 (disclosed; filed, not built)

A D3 built from the widest forms needs **five** lines at 374px and would be clipped after the fourth:
- the remainder label;
- `Rs 10,00,000`;
- two `30 September` dates;
- a nine-letter client name.

The walked instances fit. The chair ruled that a toast longer than four lines appearing later is a finding, not a truncation. This is that finding, named in advance, for the chair to route: a shorter D3 on screen (a veto slot), or a five-line clamp.

## §4 · Control inventory (CE-115)

- **Leads, swipe right `Booked`** on a lead that is not booked: KEPT. With no package it now opens the attach sheet first (MOVED).
- **Booking sheet.** ADDED `Attach package`, only on a `no_package` refusal (A2's existing byte).
- **Toasts, app-wide.** No control changed. Long messages wrap to four lines instead of one.
- **Invoice detail.** No control changed. The detail rows now update after a payment. The schedule's `Paid` also refetches the list.
- **Clients binder card.** No control changed. The empty-note line is absent on a booked client.

## §5 · What is proven

- **b82 cured.** 130/130.
  - §12 is new; M32 to M37 are new.
  - §3.6, §4.1 and M7 are amended by label.
- **b82 both ways.** On a clean worktree at `6d8d2751`: 115 passed, 15 failed, exactly the 3e cells and mutations and the amended ones. §12.3 holds at base because it measures the vetoed lines themselves; the clamp is §12.1's.
- **b82 without the sibling font.** It exits 3 and names the file (the b74/b75 conduct).
- **Other packet benches, cured.**
  - b80: 48/48. §5.4 is amended by label to admit `AttachSheet` in the same import, and holds at base.
  - b81: 65/65.
  - tdw37_hygiene_false_success: 20/20. "leads RIGHT" is amended by label for the new opener, and holds at base.
- **Readers and scanners.** 32 readers of the touched files, plus the whole-tree scanners, are identical to base by exit code and failing-line count.
- **Type check.** `tsc --noEmit` exits 0.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build` (Google Fonts are unreachable here);
  - rendering and wrapping on a device, and both themes;
  - the database.

## §6 · Card 3e (as ruled; the founder performs and pastes)

Start when Vercel reads Ready on this push, and Railway's vendor service is Active on a deployment newer than the dream-os 3e push (`3e0b085`).

1. **The swipe from a fresh no-package lead (F-43.102 (a)).**
   - On Leads, swipe right on a lead with no package (Kunal Dhillon, or Anjali Rao). The **attach sheet** opens, not the booking sheet.
   - Attach `Photographs and film`. The booking sheet then opens.
   - Close it with `Cancel`, so no booking is made unless you choose to.
   - 📸
2. **The booking sheet's own attach (F-43.102 (b)) is a safety net, not a walk step.**
   - After (a) and 3c's card rule, every way into the booking sheet attaches a package first. The sheet reaches `Attach a package first.` only when the package read fails.
   - It cannot be walked on purpose. b82 §12.4 and M34 are its witness.
   - What the founder can check: cancel the attach sheet a swipe opens, and nothing opens after it.
3. **One long toast, read whole (F-43.100).** Any long line reads to its last word, with no ellipsis:
   - `Booked. The client, the event and the invoice are ready.`
   - or `Added. …`
   - or a `Payment marked: …` line on a new walk-in with Advance received off.
   - 📸
4. **The invoice detail after a payment (F-43.101).** Open a booking's invoice that has money owed, keep the detail open, and tap `Paid` on its next milestone. The rows above (Paid, Owed, State, Due) update without closing the sheet. 📸
5. **A booked client with no note (point 5).** On Clients, Riya Test's card, and Sarah's when opened, no longer shows `No story yet — it grows as you talk in chat.` 📸

Sequencing beyond this sitting is the founder's.
