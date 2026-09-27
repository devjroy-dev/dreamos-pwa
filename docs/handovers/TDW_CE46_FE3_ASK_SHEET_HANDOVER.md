# TDW · CE-46 · FE-3 · THE ASK TDW SHEET · HANDOVER · dreamos-pwa

Base `5833b4f1` (the runner cure r3). dreamos-pwa only. This cut is CE-45 FE-2's sheet WIP
(`TDW_CE45_FE2_ASK_SHEET_WIP.zip`, sha256 `57aa55f5…`, written against `4d5a5dc2`, b134 187/187 there) carried
onto `5833b4f1` byte for byte (the patch applied clean; r3 touched none of its 8 paths), plus three amendments
made here and labelled at site: b134's local stop_tree fallback removed (the home landed with r3), and the cures
of F-44.201 and F-44.202 below. Rung **b134**: 183 cells bare, 187 with `--mutate`. Eleven paths.

This handover was written AFTER the floor ended (C-44.1's class): the floor pins a declared file's contents
during a run, so the file was an empty placeholder while the slices ran.

## What the sheet cut does (the WIP's content, unchanged)

1. **The untrue note is gone.** The sheet once said `TDW replies on WhatsApp.` under its head; since ASK-1's cut 2
   the answer arrives in the sheet itself. The key `askSheetNote` is retired from `lib/worklist/copy.ts` and
   nothing is drawn under the head. Every `copy.ts` line moved, verbatim: ONE line removed,
   `  askSheetNote: 'TDW replies on WhatsApp.',`, plus the retirement note beside its old place. No other
   vendor-facing byte in `copy.ts` changes.
2. **Every reply shape renders whole.** `MessageBubble.tsx` draws ASK-1's plain sentences (median one line) and its
   long shapes up to the 42-line ceiling without clipping, and the Advisor room's markdown (headings, emphasis,
   code, lists, tables' separator rows dropped) as structure, never as raw marks. The renderer reduces what it does
   not draw to plain text.
3. **The re-dress.** Every text in the sheet sits on the app's own type rungs (`RUNG_FONT` from
   `lib/worklist/theme`), nothing italic, no control above t5 set in capitals, in the real faces (A-45.9), dark and
   light.
4. **The wait.** With the door taking 20 seconds, the typing dots are on glass at every sample until the answer
   lands, and it lands whole.

## Control inventory

No control moved or removed. `AskSheet.tsx`: 3 buttons before and after (the Close glyph, aria-label "Close", and
the dock control, aria-label `COPY.dockAria`). `InputBar.tsx` and `ChatThread.tsx`: 3 controls each before and
after. b134 §5 states the controls by element.

## The rung, b134 (183 bare · 187 with --mutate)

§1 the source (2): no `askSheetNote` key, nothing under the head. §2 on glass (100): every ASK-1 reply shape, the
Advisor's markdown, the glitch line, dark and light, on both phone widths. §3 the wait (1). §4 mutations (4, with
`--mutate`, each planted in production source, rendered by the running server's reload, restored by sha): M1
plainMarkdown bypassed reddens 2.3; M2 reddens 2.2; M3 reddens 2.4; M4 reddens 5.2. §5 the re-dress (80).
Record here on `5833b4f1`: bare 183/183 twice, `--mutate` 187/187 once (detached, dirt after == the cut's paths,
no leftover next dev). The chair's "187/187 at 4d5a5dc2" is the `--mutate` count; the floor runs it bare (183).

## Declared context, ASK-1's measured shapes (not cells)

ASK-1's runs over 548 replies: median 107 characters (one line), 90th percentile 238 (up to 5 lines), longest 484
(16 lines); no markdown, no dashes, no persona. b134 §2 drives those shapes on glass; the 42-line cell is the
ceiling test and stands. No new cell was added for the numbers, by the chair's ruling.

## The differential (A-45.12), 21 readers of the six touched files

Derived by path string and by bare file name over `scripts/`. Base = `5833b4f1` under `git stash push -u`; cut =
this tree; each side run in series with `.next/dev` cleared and the reaper after every member (0 leaks); the
8 WIP paths sha-identical before and after. **Every reader: same exit both sides, same reached-cell count.**
18 with zero output difference; b122 differs by PID lines only. Two differed in substance and both were this
cut's, found and cured before the floor:

- **F-44.201** · b40 C102 (a base red) listed three MORE sites on the cut. C102's own lexer, run on the five
  product files, named them: `MessageBubble.tsx` 101, 106, 259, all comments. Cause: the WIP's fence test
  `/^\s*(```|~~~)/`, three backticks inside a regex literal; the lexer reads a backtick outside a comment as a
  template edge and read the rest of the file as prose. Cured at the byte, labelled: the fence is spelled
  `\x60{3}`; the regex still matches ``` and ~~~ and not text. C102 back to the base's site count. `tsc --noEmit`
  clean after `.next/dev` cleared.
- **F-44.202** · `tdw_f0774_readers` (the named-debt bench) counted two new debtors: b134's hand-rolled block
  stripper (§2.3c 65 → 66) and `scripts/lib/b134_ask_probe.mjs`'s font read (§2.2 34 → 35). Cured: b134 strips
  through `scripts/lib/stripComments.cjs`; the probe's `.woff2` read is declared in BINARY_READS beside b123's
  (r2's mechanism, which landed after the WIP was written). §2.1b holds (2 declared); §2.2 and §2.3c back to the
  base's 34 and 65. `scripts/tdw_f0774_readers.proof.mjs` joins the touched set for that declaration.
- **e-188** (this seat's own): a first guess (the apostrophes in three import-line comments) was applied and
  reverted once the lexer was actually run; the bytes are the WIP's again.

## The floor at the cut

r3's runner, `--delivery scripts/floor-manifest-ce46-fe3-ask-sheet.txt --check`, on this tree, in two gated
slices (container 1 CPU; A-45.4 gate between: no leftover process, dirt == the 11 paths, `.next/dev` cleared),
floor id `20260927T083356Z-5833b4f1-96`: slice 1 kept 39 trailers (b87 cut off); slice 2 with `--resume` kept
35 GREEN, re-ran the 4 reds and everything after, and ended **`FLOOR = NAMED BASE, no delta (refusals, not in
base: 0)`**: 142 members (b134 new, GREEN), 102 KEPT GREEN, 40 KEPT RED (the named base, set-equal), 0 REFUSED,
0 trailer-less. One LEAK line each slice, the known F-44.200 (b125), reaped. The founder's block 2 is one whole
floor with no `--resume`.

## The founder's walk, in two parts

The vendor app's question lane is OFF for every vendor at the current dream-os tip (ASK-1's cut 1 landed both
lanes dark; the app lane ON is ASK-2's cut 2). **Part A, now:** Ask TDW opens on both phones, dark then light;
the thread renders; the waiting state shows; the close glyph and the input box behave; the Advisor room's thread
renders its markdown; a typed question shows whatever the OFF lane returns today, read whole and pasted.
**Part B, HELD until ASK-2's cut 2 lands:** "What are my events" (the 16-line shape, q030), then "Am I free
tomorrow?" (one line, the today cure), each read whole on both phones.

## Named, not this cut

**F-44.203** (chair-minted, 27 Sept 2026, OPEN) · a pwa bench's bounded route wait is shorter than a route's first
compile late in a long founder floor. Seen on the founder's first floor of this cut: b129 RED, 2.1 and 2.2 in both
themes, its tail (A-46.2) showing `main: null`, no scrollers, no Sign out, `errors: []`, a blank document; the
control room right after it green; b129 alone on the same tree 9/9. The class b120 shares (its unnamed red of 26
Sept). The red now names its cell; the bound (b129's 120 × 500 ms) is the defect. Cure shape, ruled: warm the
route once before the bounded wait, or a bound keyed to the first response; the cure's own read-first says which.
Its own tiny pwa cut, benched both ways; if b129 reds again on the same cell it is cut FIRST and the sheet floor
runs again on top. Not this cut's.

F-44.200 (b125's leak) stands with b129 for their own small cut. b40's C102 lexer treats a backtick in a regex
literal as a template edge (the H2 class); this cut moved its own byte out of the lexer's way rather than edit
another arc's instrument.
