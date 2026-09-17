# repo: dreamos-pwa @ 37b247f83cb227194836ef5951b91c12eeb248d2
# TDW · CE-43 · SEAT LC-2s · PACKET 3j · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `37b247f83cb227194836ef5951b91c12eeb248d2` (the 3i docs re-cut, parent `45f6d906`), re-derived at origin at the moment of cutting. dream-os stands at `5139968` and is untouched.
- Scope: pwa only. No new byte. Two new files in existing directories (`lib/vendor/sheetStack.ts`, `components/vendor/SheetLayer.tsx`). Rung unchanged (b82, by label).
- Findings: F-43.116 is cured here. F-43.117 and F-43.118 were filed by the chair with this packet (§6).
- Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §0 · The founder's words, and the ruling

> "the cards which have been constructed by LC sessions, its not scrolling properly. example, if i click add package and then go to edit package, cant scroll down only."
> "audit the surface for these issues. it immediately lowers the standard of the platform."

The chair ratified one rule, carried in the shared components and not in a patch per sheet:
- **Scroll.** Every sheet scrolls its own body at every stacking depth.
- **Stacking.** The topmost sheet owns the scroll and the touch. Every sheet beneath it is inert, with the topmost sheet's backdrop above it.
- **Height.** No sheet is taller than the visible viewport, and each sits above the keyboard.
- **Reach.** Every action row stays within thumb reach.
- **Reopening.** A reopened sheet starts at the top.

## §1 · How the audit was run

The seat's container obtained a real headless Chromium, `@sparticuz/chromium` 131 with `puppeteer-core` 23, from the npm registry. That makes this the first sitting that measured sheets in a browser rather than reading them.

**The two methods.**
- **The real components in the browser.** They were bundled with esbuild, stacked as they stack in the shell, and served over a stubbed origin.
- **The real Packages room.** It ran on a local `next dev` in mock mode.

**The gestures.** Raw CDP touch sequences, `Input.dispatchTouchEvent` with a drag. A control proved that `Input.synthesizeScrollGesture` moves nothing in this build, so it was not used.

**The keyboard.** It was simulated by shrinking `window.visualViewport` to 570 of 900 px, a 330 px keyboard. That is the value iOS Safari reports. It is also the value Android Chrome reports under the viewport tag that actually applies (F-43.118).

**Not reproduced in Chrome:** the exact "can't scroll down" at 900, 640 and 420 px with no keyboard. Every single sheet body did scroll under touch at base. The defects below are the structural ones that do reproduce, and each can produce the symptom on a handset.

## §2 · The surfaces, before and after

**Base** is `37b247f8`, with z-index values read at base:
- `PackageFields.tsx:71` (shared `Sheet`)
- `DetailSheet.tsx:58`
- `ClientBookingSheet.tsx:167`
- `WishboneSheet.tsx:122`
- `BinderCard.tsx:82`

**Cured** is this tree. The layer mounts at:
- `PackageFields.tsx:80`
- `DetailSheet.tsx:63`
- `ClientBookingSheet.tsx:167`
- `WishboneSheet.tsx:125`
- `BinderCard.tsx:87`

| Surface (file:line at this cut) | Before (measured at base) | After (measured on this tree) |
|---|---|---|
| **Packages room, add and edit sheets** (`PackageEditSheet.tsx:116` → shared `Sheet`) | Scrolls. Layers 40/50 by hand. A reopened sheet kept its old scroll (Edit after Add opened 21 px down). With the keyboard up, the Save row sits at 836 to 884 under a keyboard starting at 570. | Mounted at `document.body`, 40/50 from depth. Opens at the top. Keyboard up: sheet 12 to 570, Cancel/Save at 506 to 554. A drag scrolled the body 323 px. |
| **Lead card's attach sheet** (`LeadPackageCard.tsx:148` → `AttachSheet` → shared `Sheet`) | Its `position: fixed` resolved against DetailSheet's panel (transform plus backdrop-filter; the panel's top was 88 px): **the wrong-box anchor, defect 2**. Both layers were at 40/50 by hand. | Mounted at `document.body`, so the panel no longer re-anchors it (**defect 2 cured by the root mount**). Attach at 60/70 over the detail at 40/50; the detail is inert. A touch above the sheet lands on the attach sheet's backdrop. A drag on the sheet scrolled it 205 px; a drag above it moved nothing. Keyboard up: Attach row at 506 to 554. |
| **Booking sheet** (`BookingSheet.tsx:150` → shared `Sheet`) over the lead detail | **A touch above the booking sheet landed on the live lead detail panel** (the founder's card-3i experience). The booking sheet's backdrop (40) sat under the detail (50). Keyboard up: the action row sat under the keyboard. | Booking at 60/70 over the detail at 40/50; the detail is inert and dimmed. A touch above the sheet lands on the booking backdrop; a drag there moved nothing. Keyboard up: Cancel/Confirm at 506 to 554. |
| **Attach sheet over the booking sheet** (`BookingSheet.tsx:180`, the `+ Package` chip) | Two layers at 40/50, stacked by DOM order only. The attach sheet's backdrop sat under the booking sheet. | Three deep: detail 40/50 inert, booking 60/70 inert, attach 80/90 on top. A drag on attach scrolled 205 px; a drag above moved nothing in any layer. Keyboard up: Attach row at 506 to 554. |
| **Date completion over the booking sheet** (`WishboneSheet`, the `+ Wedding date` chip; also over a lead-detail chip and a client-card chip) | 60/61 by hand. No height bound and no scroll of its own. Keyboard up: File it sat under the keyboard. | Three deep: wishbone 80/90 over the booking and detail sheets, both inert. Bounded by the visible viewport, with its own scroll. Keyboard up: File it / Ask in chat at 502 to 544. |
| **Clients sheet** (`ClientBookingSheet.tsx`) | Scrolls. 40/50 by hand. Keyboard up: Add client under the keyboard. | Through the layer. Keyboard up: sheet 54 to 570, Add client at 506 to 554. |
| **Client detail edit sheet** (`BinderCard.tsx`, `EditSheet`) | 60 by hand. One scrolling column bounded by `85vh` (which overstates the visible height on iOS). Save sat at the end of the scroll. | Through the layer, bounded by `sheetBound('85dvh')`. **Save sits in a pinned action row** (chair-ruled): 837 to 876 without a keyboard, 507 to 546 with one, while the fields scroll above it (32 px at 330 px of keyboard). |
| **Lead detail and invoice detail** (`DetailSheet.tsx`, mounted at `SliceShell.tsx:2034`) | Scrolls. 40/50 by hand. The full height (`88dvh`) ignored the keyboard. | Through the layer. `height: sheetBound('88dvh')`, border-box. Keyboard up: 12 to 570, Edit Here/Delete at 516 to 550. A drag scrolled 314 px. |
| **The thread** (`ConversationThread`, `SliceShell.tsx:1434`) | Not a sheet: it scrolls inside the lead detail body. | Unchanged. It inherits the detail body's scroll, which is now contained (`overscroll-behavior: contain`) and inert while a sheet is above it. |

**Verified across all five sheet files:**
- No hand-set numeric z-index remains in any of them (b82 §17.6, with M57 as its bite).
- The seven stacked scenarios and the client edit sheet were each walked at 900 px with and without the simulated keyboard.

## §3 · What shipped

| File | What |
|---|---|
| `lib/vendor/sheetStack.ts` | NEW, pure. The open-order stack (`openLayer`, `closeLayer`, `isTop`, `isBeneath`, `depthOf`, `subscribeLayers`), described below. |
| `components/vendor/SheetLayer.tsx` | NEW. The one layer, described below. |
| `components/vendor/packages/PackageFields.tsx` | The shared `Sheet` (package edit, attach, booking) mounts through the layer. It keeps `role="dialog" aria-modal="true" inert={!open}` (F-43.89). |
| `components/vendor/slices/DetailSheet.tsx` | Through the layer. Full height is `sheetBound('88dvh')`, border-box. The closed panel is now inert. |
| `components/vendor/ClientBookingSheet.tsx` | Through the layer. Keeps `inert={!open}` (F-43.94). |
| `components/vendor/slices/WishboneSheet.tsx` | Through the layer. Bounded, with a scroll of its own. The safe area is added to its bottom padding. |
| `components/vendor/slices/BinderCard.tsx` | The edit sheet goes through the layer, with the fields in a scroll body and Save in a pinned action row. |
| `scripts/b82_lc2_p3_booking_bench.js` | AMENDED BY LABEL: §15.3 re-aimed at the bounded form. §17 is new; M54 to M61 are new. |
| `scripts/verify-lc2-p3j-pwa.sh`, `scripts/floor-manifest-lc2-p3j-pwa.txt` | The founder's one verify command, and the declared dirt. |

**`sheetStack.ts` in detail.**
- **Layer order.** `layerZ(depth)` puts depth 0 at the estate's old 40/50. Each further layer adds 20, so a layer's backdrop is strictly above the sheet beneath it (a 10-step tie was caught by §17.2 and corrected before the cut).
- **Keyboard.** `viewportVars()` turns the visual viewport into the height, the keyboard offset and the safe area. It ignores covers of 80 px or less, which are browser chrome settling.
- **Height bound.** `sheetBound(cap)` is `min(cap, visible height − 12px)`.

**`SheetLayer.tsx` in detail.**
- **Root mount.** It portals to `document.body`, with the mount read through `useSyncExternalStore`, so there is no setState in an effect.
- **Stacking.** It registers while open, takes its z from depth, and is `inert` as a whole when beneath.
- **Keyboard.** One ref-counted visual-viewport listener writes `--tdw-vvh`, `--tdw-kb` and `--tdw-safe` on `<html>` while any sheet is open.
- **Shared styles.** `SHEET_BODY_SCROLL` is `overflowY: 'auto'`, `overscrollBehavior: 'contain'`, momentum on, `minHeight: 0`. `SHEET_BOTTOM` puts the bottom on the keyboard line; `SHEET_SAFE` is the safe area, dropped while the keyboard is up.
- **Reopening.** `useSheetScrollReset` returns a body ref and scrolls it to the top on open.

## §4 · Control inventory (CE-115)

- **Client edit sheet.** `Save` MOVED from the end of the scrolling column to a pinned action row (chair-ruled). Every field is KEPT.
- **Every other sheet.** No control added, moved or removed.
- **Behaviour changed without a control change:**
  - a sheet beneath another no longer takes a tap or a scroll;
  - a reopened sheet starts at the top;
  - sheets sit above the keyboard.

## §5 · What is proven

- **b82, cured.** 201/201.
  - **§17.1 to §17.3, driven.** The stack through two and three layers, pop, re-open and a closed middle; the layer order; the keyboard values.
  - **§17.4 and §17.5.** The layer itself.
  - **§17.6.** The five sheets, each through the layer, with no hand-set z-index, a scroll body, the keyboard line and the height bound.
  - **§17.7: a cell per stacking pair, nine pairs.**
    - lead detail → booking sheet
    - booking sheet → attach sheet
    - lead detail → attach sheet (the card)
    - booking sheet → date completion
    - lead detail → date completion
    - Packages room → edit sheet
    - Clients room → Clients sheet
    - client card → client edit sheet
    - client card → date completion

    Each asserts that the inner body's scroll container is present and not locked, and that the outer is locked beneath. The pair cells use the stack module driven, and read the layer and sheet sources.
  - **§17.8.** The pinned Save.
  - **Mutations.**
    - M54 restores the lock on the top sheet; M55 counts the top as beneath. Each turns all nine pairs RED.
    - M56 locks the shared body; M57 puts a hand-set z-index back; M58 mounts the layer in place; M59 ignores the keyboard; M60 returns every layer to 40/50; M61 puts Save back into the scroll. Each turns its own cell RED.
- **b82, both ways.** On a clean worktree at `37b247f8` with the amended bench copied in: 172 passed and 29 failed, exactly §15.3, §17 and M54 to M61. One seat defect was caught before the cut: the pair driver threw at base instead of reddening.
- **Readers of the touched files.** 14 benches, derived by grep over `scripts/`. They are identical to base by exit code and failing-line count, except b82 (amended as above). Non-green on both trees: b40_worklist_shell, tdw07_p4b_body, tdw09_p2_doors, tdw09_roles, tdw37_leadgate_b_slot.
- **Type check.** `tsc --noEmit` exits 0.
- **ESLint.** Clean on the seven touched source files.
- **The full pwa floor on the delivery tree.** `FLOOR = NAMED BASE, no delta`: 40 reds, all in the named base, 0 refusals, declared files unmoved.
- **In the browser, as §1 and §2 state.**
- **Not run in the seat's container, declared before the cut:**
  - `next build` (the founder's gate; the fonts are unreachable here);
  - **a real handset** (iOS Safari's keyboard and gestures, Android Chrome);
  - both themes on glass;
  - the database.

## §6 · Filed with this packet (chair)

- **F-43.116**, cured here.
- **F-43.117.** Dev Test 23's date, filed by the founder on 3f/3g, never landed on `5998610d`. The backend accepts the write (dream-os `src/lib/vendor/leads.js` `updateLead` takes `wedding_date` and `wedding_date_precision`), so the loss is on the pwa path. It is the first item on packet 4's pre-cut note, to be derived by command.
- **F-43.118 → Block 09.** `app/layout.tsx` emits two viewport tags. The later one comes from Next's `viewport` export and drops `interactive-widget=resizes-content`; the seat's `curl` of the served page showed both, in that order. It is root-level, so the bride side is affected too. It is reported, not cured, in 3j. SheetLayer's visual-viewport handling makes the vendor shell independent of it.

## §7 · Card 3j (the founder performs and pastes; R-43.17: test-number leads only)

Start when Vercel reads Ready on this push. Do every step on the handset, not only in Chrome, and in both themes.

1. **Packages.**
   - Open Packages and tap Add package. Scroll the sheet to its bottom; Cancel and Save stay pinned.
   - Cancel. Open a package and tap Edit. The sheet opens **at the top**. Scroll to the bottom and Save.
   - Tap into Name so the keyboard opens: Cancel and Save sit above the keyboard.
   - 📸
2. **The lead, stacked.**
   - Open a lead on 9888294440 or 8595356978 (Q-3i-b in the 3i handover lists them; `Dev Test 3i b` was added for card 3i), and tap Booking confirmed.
   - **The lead detail above the booking sheet is dimmed, and tapping or dragging on it does nothing.**
   - Tap Confirm booking; the chips appear. Tap `+ Package`: the attach sheet opens over both. Scroll it to its Attach package button. The booking sheet and the detail beneath do not move.
   - Cancel the attach sheet.
   - 📸
3. **The date completion, stacked.** On a test-number lead with no date (add one on Leads with a test number if Q-3i-b shows none), tap `+ Wedding date` on the booking sheet. The date sheet opens over both, dimming them. Pick a date and file it; the booking sheet is live again.
4. **The keyboard.**
   - In the attach sheet, tap the fee field; in the Clients + sheet, tap Name; in a client's Edit sheet, tap Client.
   - In each, the action row (Attach package / Add client / Save) is visible above the keyboard and tappable by thumb, and the fields scroll above it.
   - 📸
5. **Graphite.** Repeat steps 2 and 4 in the other theme. Screenshot the three-deep stack and one keyboard-up sheet.

Sequencing beyond this sitting is the founder's.
