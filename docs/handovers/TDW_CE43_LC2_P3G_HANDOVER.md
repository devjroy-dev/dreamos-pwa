# repo: dreamos-pwa @ 6672399e5e0abb850fa2cc9824e28e7d36bcc09c
# TDW · CE-43 · SEAT LC-2r · PACKET 3g · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `6672399e5e0abb850fa2cc9824e28e7d36bcc09c` (3f), re-derived at origin at the moment of cutting.
- 3f at origin was checked before this work began: its parent is `9983645`, its changed set equals the 3f manifest (14 files), and every file is byte-identical to that ZIP.
- dream-os stands at `3e0b085` and is untouched.

**Scope.**
- One composed line, chair-ruled: `Still missing: {labels}`, built from existing labels.
- Two new files in existing directories.
- Rung unchanged (b82).

**Status.** Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §0 · The founder's words this packet answers (ruled against them, CE-43)

> "the add date comes only when add package button opens" · "there is already a Still missing, tap to complete. why cant the same be integrated with booking confirmation?" · "in few leads, where info is provided, the still missing field is down south and needs scrolling."

> Correction, on the founder's word: "when confirm booking or advance paid is clicked, it just asks to fill in the missing details in a toast and states the missing things."

## §1 · What shipped

| Ruling item | What | Where |
|---|---|---|
| **Item 1 (as corrected)** | `Confirm booking` (with either kind) and `Attach package` are never disabled. On a tap, if the lead lacks what the act needs, **no request is sent**. Instead:<br>• a toast says `Still missing: Wedding date, Package` (the lacking cells, in that order);<br>• the sheet shows those chips at its top, each opening its own fix.<br>She taps the same button again when the chips are gone. The server's refusals (the NeedFirst lines, 3f) stay as the last guard. The swipe path opens the same booking sheet, so it behaves the same. | `lib/vendor/bookingNeeds.ts` (pure); `BookingSheet.tsx`; `LeadPackageCard.tsx` (`AttachSheet`); `lib/worklist/packages.ts` (`LEAD_PACKAGE.stillMissing`, `needLabel`) |
| **The needs** | Mirroring the server exactly (dream-os `promotion.js` and `packageSchedule.js` at `3e0b085`).<br>**Booking:** an attached package with a fee above zero. With no package, it also needs an exact wedding date, because the attach will.<br>**Attach:** a package, a fee above zero, a wedding date at day precision (a null precision on a dated row reads as day), and a handover date on a handover package.<br>**Unknown state:** a read still out yields no needs; the server decides. | `lib/vendor/bookingNeeds.ts` |
| **The chips' fixes** | `Wedding date` opens the lead's date completion (3f). `Package` opens the attach sheet over the booking sheet. `Fee for this couple` and `Handover date` open it on that field. Inside the attach sheet, the package, fee and handover chips focus their own fields. | `BookingSheet.tsx` (`pickNeed`); `AttachSheet` (`pickNeed`) |
| **The facts** | The lead's wedding date and precision come from the Leads room's own leads read (`d.data`). No request is added. After a date is filed, the leads refetch updates them. | `SliceShell.tsx` (`leadFactsOf`) |
| **F-43.108** | A tapped chip opens **its own cell**, not the first missing one, on the lead detail and on the client card. | `WishboneSheet.tsx` (`start`); `SliceShell.tsx` (`wishboneStart`); `BinderCard.tsx` (per-chip tap) |
| **F-43.109** | The `Still missing — tap to complete:` block sits at the top of the lead detail body, directly under the package card and above the detail rows, and is absent when nothing is missing.<br>On the client card, the chips sit directly under the name, above the money and stage lines. They stay spans with `role="button"`, because the whole card is a `<button>`. | `DetailSheet.tsx` (`detailMissing` slot); `SliceShell.tsx` (`missingTop`); `BinderCard.tsx` |
| **One chips component** | `MissingChips`: `onPick` is required, and nothing renders when nothing is missing. It carries the lead detail's existing chip look, tokens only. | `components/vendor/MissingChips.tsx` |
| **F-43.107 (the seat's cure, ratified)** | The lead's package read and its detail read run side by side, and neither waits for the other. The rows and the package card render together the moment the package read is in. Until then the body is empty: **no fixed-height placeholder**, so nothing on screen moves. The conversation waits below in its own collapsed shape (`ConversationWaiting`: the label and three message outlines at the bubble and stamp geometry). The vendor's packages are read **once per Leads visit**: primed on entry, cleared on leaving, and a failed read is not remembered. So the attach sheet renders whole, with no empty-form flash and no placeholder. | `SliceShell.tsx`, `DetailSheet.tsx`, `ConversationThread.tsx`, `LeadPackageCard.tsx` (`loadPackagesOnce`, `resetPackagesCache`) |

## §2 · Control inventory (CE-115)

- **Booking sheet.**
  - `Confirm booking` KEPT, never disabled. With something missing it now sends nothing and shows the toast and chips.
  - ADDED: the chips at its top, only after such a tap (existing labels).
- **Attach sheet.**
  - `Attach package` KEPT, never disabled, with the same behaviour.
  - ADDED: the chips at its top, likewise.
- **Lead detail.** The `Still missing` chips MOVED from below the detail rows to directly under the package card. Each chip now opens its own cell.
- **Client card.** The chips MOVED from below the stage line to directly under the name. Each chip now opens its own cell.
- **Lead detail loading.** 3f's still placeholder is REMOVED BY RULING. The body is empty until the package read is in. The thread shows its waiting shape.
- **Attach sheet loading.** 3f's still placeholder is REMOVED BY RULING.

## §3 · What is proven

- **b82 cured.** 158/158.
  - §14 is new: the needs driven through every case, the composed toast from existing labels, nothing sent with something missing, the one chips component, F-43.108 on both chip sites, F-43.109's placement on both, the read-once list, the waiting shape, and the room facts wired.
  - M44 and M45 are new.
- **Amended or restated in b82, by label.**
  - §10.7 now admits the chips slot.
  - §13.6 and §13.7 are RESTATED as their opposite (the reads don't wait on each other; no placeholder).
  - §13.8 and M40 are re-aimed.
- **b82 both ways.** On a clean worktree at `6672399e`: 142 passed and 16 failed, exactly the 3g cells and mutations.
- **b81.** 65/65 cured. §5.6 is amended by label (the default is picked from the read-once list), and holds at base.
- **b80 and tdw37_hygiene_false_success.** Unchanged, and green.
- **Readers and scanners.** 19 readers of the touched files, plus the whole-tree scanners, are identical to base by exit code and failing-line count.
- **Type check and lint.** `tsc --noEmit` exits 0. ESLint names no problem on the new and chiefly touched files.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build` (Google Fonts are unreachable here);
  - rendering, focus and timing on a device, and both themes;
  - the database.

## §4 · Card 3g (card 3f's unwalked steps folded in, as ruled; nothing re-walks twice)

Start when Vercel reads Ready on this push.

1. **The missing toast, from the lead card.** Open **Dev Test 23** (no package, no wedding date).
   - Its `Still missing — tap to complete:` chips sit directly under the package card, above State.
   - Tap `Booking confirmed`, wait a moment (the sheet reads the lead's package as it opens), then tap `Confirm booking`. No request goes out; the console shows no new 422.
   - If `Confirm booking` is tapped before that read answers, the server decides instead: `Attach a package first.` appears dashed (3f's last guard). Tap `Confirm booking` once more and the toast follows. The toast reads `Still missing: Wedding date, Package`, and those two chips appear at the top of the booking sheet.
   - 📸
2. **Each chip opens its own fix, then back.**
   - On the booking sheet, tap `+ Wedding date`. **Complete the file** opens on `Wedding date`, not on Phone. Pick a date and file it; the chip disappears.
   - Tap `+ Package`. The attach sheet opens over the booking sheet, fully drawn. Tap `Attach package`: it attaches, and you are back on the booking sheet with no chips left.
   - Tap `Cancel` unless you want the booking.
   - 📸
3. **The swipe.** Swipe a no-package lead right. The booking sheet opens, and `Confirm booking` behaves as in step 1.
4. **F-43.108 on the lead detail.** On a lead missing several things, tap its **second** chip. The sheet opens on that cell.
5. **A Packages gate (from 3f).** On Packages, open a package, clear its name and tap Save. `Give the package a name to save it.` is dashed. Tap it: the cursor lands in Name.
6. **The timings, against the ruled targets.** Paste the same console snippet, tap a lead row, and do it **three times**, reloading between.
   - **Targets:** tap-to-stable **≤ 1274 ms** and shift score **≤ 0.051** on each of the three.
   - Paste the three lines.

Sequencing beyond this sitting is the founder's.
