# repo: dreamos-pwa @ ad3e878b132164cbbfee5233b75203bc90996166
# TDW · CE-43 · SEAT LC-2r · PACKET 3h · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `ad3e878b132164cbbfee5233b75203bc90996166` (3g), re-derived at origin at the moment of cutting.
- 3g at origin was checked before this work: its parent is `6672399e`, its changed set equals the 3g manifest (15 files), and every file is byte-identical to that ZIP.
- dream-os stands at `3e0b085` and is untouched.

**Scope and status.**
- One new byte, VETOED (below).
- Rung unchanged (b82).
- Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §1 · The ruling built (CE-43, packet 3h)

**The founder's words ruled on:**
> "the attach a package doesn't show the toast package added."

| Item | What | Where |
|---|---|---|
| **F-43.110** | A successful attach speaks a toast, once, before the sheet hands the row back. It applies to `Attach package` and to `Change package` alike (the same sheet, the same door). A refusal never speaks it. | `lib/worklist/packages.ts` (`LEAD_PACKAGE.attached`); `LeadPackageCard.tsx` (`AttachSheet`) |
| **F-43.111 (the seat's cure, ratified)** | The lead detail sheet opens at its full height (`88dvh`) from the first frame. The rows, the package card and the chips fill a sheet already in place. The rows do not draw ahead of the card (3g's rule stands: the body is empty until the package read is in). Other slices keep their content height. | `DetailSheet.tsx` (`fullHeight`); `SliceShell.tsx` (`fullHeight={slice === 'leads'}`) |

**The cause F-43.111 answers, derived at 3g's walk.** The sheet is bottom-anchored (`position: fixed; bottom: 0`), with its height following its content up to `88dvh`. So an empty-then-filled body grew the sheet upward and carried its header with it: 0.49 to 0.54 on the founder's three taps.

**The client detail.** The Clients room renders `BinderCard`s and mounts no `DetailSheet` (`app/vendor/(shell)/clients/body.tsx:10`). The ruling's "same rule on the client detail if it shares the sheet" therefore has nothing to apply to.

**"no swipe on booked leads"** was read by the chair as a pass report on F-43.95. No change.

## §2 · The veto record (3h)

| Byte | Where | Ruled |
|---|---|---|
| `Package attached.` | `LEAD_PACKAGE.attached`: the toast on a successful attach or change | VETOED, CE-43 packet 3h, under the founder's "go with your lean", in the packet 2 pattern |

## §3 · Control inventory (CE-115)

- **Attach sheet.** No control changed. A successful attach or change now speaks `Package attached.`
- **Lead detail.** No control changed. The sheet opens at full height from the first frame.

## §4 · What is proven

- **b82, cured.** 163/163. §15 is new (the byte, the one success toast, full height on leads only), and so are M46 and M47.
- **b82, both ways.** On a clean worktree at `ad3e878b`: 158 passed and 5 failed, exactly §15 and its two mutations.
- **Other packet benches.** b80, b81 and tdw37_hygiene_false_success are unchanged and green.
- **Readers.** 16 readers of the touched files, plus the copy and type scanners, are identical to base by exit code and failing-line count.
- **Type check.** `tsc --noEmit` exits 0.
- **Not run in the seat's container, declared before the cut:**
  - the full pwa floor;
  - `next build` (Google Fonts are unreachable here);
  - rendering and timing on a device, and both themes;
  - the database.

## §5 · Card 3h (card 3g's remaining step folds in, with the timings, as ruled)

Start when Vercel reads Ready on this push.

1. **The toast on attach.** On a lead that **has a wedding date** and no package (not the lead you keep for step 2), tap `Attach package`, choose `Photographs and film` and tap `Attach package`. The toast reads `Package attached.` Then tap `Change package`, change nothing (or the fee), and attach again: the same toast. 📸
2. **The swipe on a new lead with no package** (from card 3g). On Leads, swipe right on a **different** lead that is new, with no package (for example `+919327715877`). The booking sheet opens. Tap `Confirm booking`: nothing is sent, the toast names what is missing, and those chips appear at the top. Tap `Cancel`. 📸
3. **The timings, against the ruled targets.** Paste the console snippet, tap one lead row, and do nothing else until the line prints (six seconds). Reload, and repeat for **three** taps. Paste the three lines.
   - **Targets:** tap-to-stable **≤ 1274 ms** and shift score **≤ 0.051** on each.
   - Also say whether the sheet now opens at its full height at once. It should.

Sequencing beyond this sitting is the founder's.
