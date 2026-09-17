# repo: dreamos-pwa @ 9983645fc0980f43fad6388422dd5260574ce8b2
# TDW · CE-43 · SEAT LC-2r · PACKET 3f · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `9983645fc0980f43fad6388422dd5260574ce8b2` (3e pwa), re-derived at origin at the moment of cutting.
- 3e pwa at origin was checked before this work began: its parent is `6d8d2751`, its changed set equals the 3e pwa manifest (12 files), and every file is byte-identical to that ZIP.
- dream-os stands at `3e0b085` and is untouched.

**Scope.**
- No new byte.
- One new file, `components/vendor/NeedFirst.tsx`, in an existing directory.
- Rung unchanged (b82).

**Status.** Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §0 · The rule this packet exists for

**R-43.16 (founder's rule, estate-wide, chair-recorded):** a refusal is a control and never a redirect.
- Wherever the vendor is told something is needed first, the line that says so is the control that adds it, on every surface, the same way.
- After the fix she is back where she was, and she acts herself.
- Nothing opens a different sheet in place of the one she asked for.

**How the redirect got built.** F-43.104 is the seat's: the founder's walk-P3 words, "Clicking attach package first should allow me to attach a packet there itself", were re-worded into a redirect. The two rulings that adopted that re-wording are the chair's (c-43.17).

**Standing process, chair-ruled.** A founder remark on a walk that names how a surface should behave is relayed to the chair verbatim, before any lean.

## §1 · What shipped

| Item | What | Where |
|---|---|---|
| **The redirects removed** | `Booking confirmed`, `Advance paid` and the swipe always open the booking sheet. 3c's attach-first in `book()` and 3e's `openBookingFromSwipe` / `attachFirst` are gone. So is 3e's separate `Attach package` button in the booking sheet (F-43.102 (b)). The package card keeps `Attach package` as its own control. | `LeadPackageCard.tsx`, `SliceShell.tsx`, `BookingSheet.tsx` |
| **One component** | `NeedFirst` is the one "needs X first" control. It renders the caller's vetted line in the Packages room's dashed-affordance look (`.pkg-fee--unset`), and `onFix` is required. | `components/vendor/NeedFirst.tsx` |
| **Booking sheet** | Each refusal line is a NeedFirst control:<br>• `Attach a package first.` opens the attach sheet over the booking sheet.<br>• `Set the fee first.` opens it on the fee field.<br>• `Add the handover date first.` opens it on the handover field.<br>• `Add the wedding date first.` opens the lead's wedding-date completion.<br>• A bad `Advance received on` focuses that field.<br>After an attach, the line clears and the vendor taps `Confirm booking` herself. F29 is a failure, not a thing to add, and stays a plain line. | `BookingSheet.tsx` |
| **Attach sheet** | Its own refusals are NeedFirst controls:<br>• package, fee and handover focus their fields;<br>• the wedding date opens the date completion (`onNeedWeddingDate`, required);<br>• field gates focus the flagged field.<br>`focus` opens the sheet on the fee or handover field. | `LeadPackageCard.tsx` (`AttachSheet`) |
| **The date completion** | The WishboneSheet `wedding_date` cell (the walked surface; the Edit sheet was not chosen). A stored date is pre-filled (F-43.76: a month- or year-precision date is made exact without retyping), and saving sends `wedding_date` with `wedding_date_precision: 'day'`. The sheet beneath stays open. | `SliceShell.tsx` (`dateFix`, `openDateFix`); `WishboneSheet.tsx` (`initialValues`); `lib/vendor/types/vendor.ts` (`UpdateLeadRequest.wedding_date_precision`) |
| **The sweep** | Clients sheet: the field gate focuses the flagged field, and F29 stays plain. Package edit sheet: the name, remainder and field gates focus their field (`GATE_FIELD`). Add Milestones: the percentage and label gate focuses the offending input. | `ClientBookingSheet.tsx`, `PackageEditSheet.tsx`, `SliceShell.tsx` |
| **F-43.105** | Opening a lead reads the lead and its package together (`Promise.all`, one await). The detail body shows a still placeholder until both are in, then renders whole, so the package card never pops in. The card takes that read (`initial`). The attach sheet shows a still placeholder until the vendor's packages are in. | `SliceShell.tsx`, `DetailSheet.tsx` (`bodyLoading`), `LeadPackageCard.tsx` |

## §2 · The derivations the chair asked for before cutting

- **Screenshot 3's "double attach sheet" was not two sheets.** It was the one attach sheet drawn before `fetchPackages` answered: an empty `Select…`, no fee, and no identity fields, because `chosen` was null. The form then filled in. On the founder's Fast 4G setting the gap is visible. The cure is the still placeholder in §1.
- **Lead `5998610d-5f2a-4b5b-ba57-1ee89abc6217` is `Dev Test 23`.** Its `wedding_date` is NULL and its `wedding_date_precision` is NULL (the founder's read, 2026-09-17).
  - The attach refusal `no_wedding_date` was therefore correct: there is no date, not a month-only one.
  - On 3f the refusal line opens the date completion with an empty picker.
  - The F-43.76 pre-fill is built and benched (b82 §13.5, §13.8) and applies when a lead has a month- or year-precision date.
- **The client card grew no second request in LC-2.** `booked_lead` rides the cabinet read (3e). No other LC-2 card fetches after mount. The invoice detail's schedule read predates LC-2.

## §3 · The R-43.16 sweep, enumerated (file:line at this cut)

**Converted to NeedFirst:**
- `components/vendor/packages/BookingSheet.tsx:129`: A9's four lines, and the received-on gate.
- `components/vendor/packages/LeadPackageCard.tsx:256`: the attach sheet: A9's four lines, the name gate and the field gate.
- `components/vendor/ClientBookingSheet.tsx:190`: the field gate.
- `components/vendor/packages/PackageEditSheet.tsx:131`: the name, remainder and field gates.
- `components/vendor/slices/SliceShell.tsx:1911`: the Add Milestones percentage and label gate.
- **Leads, "Still missing — tap to complete":** already a control (the wishbone chips), unchanged.

**Not converted, for the chair:**
- **Contracts** (filed to LC-3 by number, as ruled): `app/vendor/(shell)/contracts/screen.tsx:551` ("A function needs a name and a date.", a toast); `:719`, `:729`, `:731`, `:739`, `:922`, `:944` (the `Needed to send` marks on fields).
- **TDS**, outside the named rooms: `app/vendor/(shell)/tds/screen.tsx:317` ("Client name and gross amount are required.").
- **The invoice PDF:** `components/vendor/slices/SliceShell.tsx:1181` (`COPY.studioPdfNoAdvance`, "PDF not ready yet — record the advance first.", a toast).
  - Its fix is a money write (marking the advance paid). The seat will not make one tap record money without a ruling.
  - A toast is also not a line with a control; it would need an action label, which is a byte.
- **Collab calendar:** `components/vendor/CalendarDaySheet.tsx:70` ("This date has passed…"). A past date cannot be added, so this is a refusal with no completion, and it is left as it is.
- **Victor, V6 and V12:** packet 4's, spoken (chat has no tap). Each must name the same fix as the line it mirrors.

## §4 · Control inventory (CE-115)

- **Lead package card.**
  - `Booking confirmed` and `Advance paid` KEPT, now always opening the booking sheet (the 3c attach-first is REMOVED BY RULING).
  - `Attach package` / `Change package` KEPT.
- **Leads, swipe right `Booked`.** KEPT, always opening the booking sheet (the 3e attach-first is REMOVED BY RULING).
- **Booking sheet.**
  - 3e's `Attach package` button is REMOVED BY RULING.
  - Each refusal line becomes a control (ADDED; existing bytes).
- **Attach sheet, Clients sheet, package edit sheet, Add Milestones.** Each gate line becomes a control (ADDED; existing bytes).
- **Lead detail.** No control changed; the body appears whole after a brief still placeholder.

## §5 · What is proven

- **b82 cured.** 146/146.
  - §13 is new: R-43.16's sweep, including **the cell** (§13.2: no needs-first line in the named surfaces renders without a handler, bitten by M43), plus F-43.76 and F-43.105.
  - M38 to M43 are new.
- **Retired and restated in b82 as their opposite** (the founder's rule forbids what they asserted): §5.3, §5.8, §12.4, §12.5.
- **Re-aimed in b82:** §3.6, §3.7, §4.1, M7, M20, M21, M34, M35.
- **b82 both ways.** On a clean worktree at `9983645`: 117 passed and 29 failed, exactly the 3f cells, the restated cells and the re-aimed mutations.
- **b81.** 65/65 cured. §5.4 is amended by label, since the attach sheet's refusal renders through NeedFirst. At base only §5.4 is red.
- **b80 and tdw37_hygiene_false_success.** Unchanged, and green.
- **Readers and scanners.** 22 readers of the eight touched files, plus the whole-tree scanners, are identical to base by exit code and failing-line count.
- **Type check.** `tsc --noEmit` exits 0.
- **ESLint** on the touched files: the one error it names (`react-hooks/set-state-in-effect` in `LeadPackageCard.tsx`'s load effect) is present at base on the same effect. Lint is not part of the build.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build` (Google Fonts are unreachable here);
  - rendering, focus and timing on a device, and both themes;
  - the database.

## §6 · F-43.105, the founder's numbers

**Method.** A console snippet on the founder's DevTools phone view (Fast 4G):
- it arms a `pointerdown` listener, a `PerformanceObserver` for `layout-shift`, and a `MutationObserver` on the page body;
- it reports the time from the tap to the last DOM change or layout shift within six seconds, the number of shifts, and the shift score.

**Before (3e, `9983645`, 2026-09-17), tapping a lead row:**

| Run | Tap to stable | Layout shifts | Shift score |
|---|---|---|---|
| 1 | 1022 ms | 1 | 0.051 |
| 2 | 1274 ms | 0 | 0.000 |

**After (3f):** the founder runs the same snippet the same way; recorded on card 3f.

## §7 · Card 3f (steps 1 and 2 of card 3e re-walked on 3f, as ruled; then the timing)

Start when Vercel reads Ready on this push.

1. **No redirect.**
   - Open a lead with no package (Dev Test 23 or Kunal Dhillon) and tap `Booking confirmed`. The **booking sheet** opens, not the attach sheet.
   - Tap `Confirm booking`. `Attach a package first.` appears with a dashed underline.
   - Tap that line: the attach sheet opens over the booking sheet.
   - 📸
2. **The fix, then back.**
   - In the attach sheet, choose `Photographs and film` and tap `Attach package`.
   - On Dev Test 23 (no wedding date), `Add the wedding date first.` appears, dashed. Tap it: the **Complete the file** sheet opens on `Wedding date`. Pick a date and save.
   - You are back on the attach sheet. Tap `Attach package` again: it attaches, and you are back on the booking sheet.
   - Tap `Confirm booking` only if you want the booking; otherwise tap `Cancel`.
   - 📸
3. **The swipe.** Swipe a no-package lead right. The **booking sheet** opens, and step 1's line and fix behave the same.
4. **One gate elsewhere.** On Packages, open a package, clear its name and tap Save. `Give the package a name to save it.` appears, dashed. Tap it: the cursor lands in the Name field.
5. **The timing, after.** Run the §6 snippet as before on a lead row, a few times. Paste the lines. Also note whether the package card still appears after the rest of the detail; it should not.

Sequencing beyond this sitting is the founder's.
