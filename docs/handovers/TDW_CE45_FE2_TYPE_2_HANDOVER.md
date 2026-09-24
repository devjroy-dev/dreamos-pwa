# TDW · CE-45 · FE-2 · TYPE_2 · HANDOVER

The sheets the six legacy rooms open, and the legacy Toast, on the app's own type. This cut is dress only.
Base `8a943ae1`: TYPE_1 (`9b251ad4`), then G6-1 FE2_1 on disjoint files. TYPE_2 was built on `9b251ad4` and rebased cleanly, with no shared path. dreamos-pwa only. Rung **b123**, extended.

## The rulings it carries

- **F4**: the room includes the sheets it opens, and a shared sheet is re-dressed once, at its home.
- **F5**: case follows the rung.
- **F7**: a rung that holds outside the shell.
- **e-112** (ruled (a)): b123 strips comments through the one home.
- The chair's split: TYPE_2 stays dress-only. The founder's words for the room tops ride TYPE_1b.

## What changed, one paragraph each

**The ten modules.** `AddSheet`, `NeedFirst`, `MissingChips`, `ConversationThread`, `ClientBookingSheet`, `NotesBody`, `Toast`, `packages/LeadPackageCard`, `packages/BookingSheet`, `packages/PackageFields`.
- 60 sites take `font: RUNG.tN` and nothing else of type. 12 buttons go to sentence case (F5).
- The overrides: a package's name and fee inside the lead sheet go to t2 (the sheet's title is the lead). Toast's message goes to t3, as WlToast's. NotesBody's empty-state heading goes to t2. PackageFields' 12px label and its three button styles go to t4, as `.sol-btn`. NotesBody's textarea drops its own line-height.
- The local face constant `F` is retired in AddSheet, ConversationThread, ClientBookingSheet, NotesBody and Toast.
- **Held, named**: PackageFields' token object `T` keeps its three face lines, because the Packages room's own edit sheet (`PackageEditSheet`, cut 5) still reads `T.body`. b123 matches those three lines by exact text, and cut 5 retires them with their last reader.

**F7, `RUNG_FONT` in `lib/worklist/theme.ts`.**
- Each rung is `var(--wl-tN, <its own tuple>)`, generated from `TYPE` and `TYPE_ROLE`. It is the scale read twice, never a second copy, and t0 is not offered.
- Inside the shell the variable wins and nothing changes. Where no scope emits the variables (the legacy discover pages, and the demo tree, which is not walked by ruling), the same tuple applies instead of an inherited face.

**Notes' gutter.** NotesBody's own horizontal inset now goes through the room variable (`var(--slice-inset, …)`), so inside the shell the room sits on the 16px gutter alone. It is the family's own mechanism, and NotesBody has no other mount.

**No other property moved.** A multiset of every non-type property, per file, against the tip loses only the retired `F` constants and NotesBody's two paddings (moved to the variable), and gains only those two paddings. `tsc --noEmit` is clean.

## The benches, by label

- **`b82`**: §11.9 (the thread stamp keeps the label size, now t5) and §14.9 (the waiting stamp at the stamp's rung) are amended. The thread's stub gains `@/lib/worklist/theme` from the real source; without it the thread module could not load, which was the four fails of its first run. Now 204/204.
- **`b80`** §6.8: R-43.5's "AddSheet untouched" now compares AddSheet with base `409a130e` with the type taken out of both sides. Proven non-vacuous: a padding change reddens it, restored byte for byte.
- **`b81`** §5.11: the shared button form is read with whitespace free, because the re-dress reflowed the object one property to a line.

## The rung, b123, extended

- **e-112** is cured: comments are stripped through `scripts/lib/stripComments.cjs`. `tdw_f0774_readers` §2.3c drops by one against the tip.
- **§1** covers the ten modules. New cell **1.6** (F7) checks `RUNG_FONT` generated from `TYPE`.
- **New scenes**: each room's +, and clients' + submitted empty so NeedFirst draws. The lead's BookingSheet. The note's own sheet. The legacy Toast, raised by deleting a note.
- Nothing is marked `later` any more.
- **The fixtures** gained a draft gap (MissingChips) and a three-message conversation (ConversationThread) on the lead the rung opens.
- **New mutations**: M6 (a raw 16px back on the Toast) and M7 (`RUNG_FONT`'s fallback no longer read from `TYPE`).
- **The base** is the tip this cut builds on. §3.0 expects no strip there.

**The record of runs:**
- Cured, `--mutate`, both themes: **376/376 GREEN**. M1 to M7 each redden their own cell and are restored byte for byte.
- At the TYPE_1 tip (dark): **146/188 RED**. Every red is a TYPE_2 cure cell: §1.2, 1.3 and 1.6, and 2.1 to 2.4 in the new scenes. The TYPE_1 scenes and every word and control cell are green there.
- Shifted clocks (C-44.13), cured, leads, events, invoices and notes: **136/136 GREEN** at each of 2026-09-24T12:00Z, T19:00Z, 2026-12-31T19:00Z and 2028-02-29T06:00Z.
- The render record ran against `9b251ad4`. The rebase onto `8a943ae1` touched no room, sheet or type file (G6-1's eleven paths are the Settings room, OwnNumberFlow, types, two worklist libs, b120, b125 and their docs). §1 is re-run green on the rebased tree.

## The differential

23 scripts: every reader of the ten files or `theme.ts`, the tree-walking type censuses, and b123 itself. Each was run cured and at a base worktree at `8a943ae1`, outputs diffed.
- **Exit codes identical in 21.**
- The two that differed, b80 and b81, are amended by label above. Both are green now.
- **Output differences, each accounted for:**
  - b123: its own new cells.
  - tdw_f0774_readers: e-112 cured, 65 to 64.
  - tdw09_type.proof and tdw09_type_census: F-44.150's record, with fewer off-scale sites.
  - ce41_e2iia and ce41_e2iv: a Node warning line whose only difference is its pid.
- Zero difference in the rest: b40, b41, b58, b59, b60, b69, b77, b82, b83, ce41_e2i, tdw09_hotfix, tdw10_p2_retint, tdw37_hygiene, tdw_f0774_stripper, tdw_f3942.

## Defects owned

**e-119** (the seat's own tooling): the property splitter read a comma inside a line comment as a separator and broke Toast's two style objects. Comments are now opaque to it, and the ten modules were re-applied from the tip.

## Named, not cured here

- F-38.22's colour literals, and **F-44.151** (the WhatsApp glyph's link-default blue), are for the colour cut.
- PackageFields' three held face lines are for cut 5.

## Next

TYPE_1b, the founder's words for the tops of the six rooms (his table, rows 1 to 10), its own cut after this one lands.
