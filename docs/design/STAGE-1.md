# DESIGN-1 · Stage 1: the look

Branch `design/stage-1-look`, from `main` at `85c66ef`. What the founder sanctioned for this stage, and nothing
else: the Teal Ledger palette, Inter for the app's text, tap targets, the notch, the word clean-up, and the type
and spacing rules from `docs/review/REPORT.md` §3 and §5. Every changed path is in `STAGE-1-PATHS.txt`.

## What changed

### Colour: Teal Ledger
- `lib/worklist/theme.ts`: GRAPHITE (dark) and CHALK (light) take the Teal Ledger values from
  `docs/review/palettes/palettes.json`. Two new role tokens, `primary` and `on-primary`, carry the one filled
  button colour for the whole app (`--role-primary`, `--role-on-primary`; the token count is 35).
- Gold stays the brand mark's (the coin and the metal); the old gold-at-alpha literals across the vendor pages
  became token reads (hover ground, muted ink, card and input borders).
- Every pair meets its threshold (4.5:1 for text, 3:1 for controls and borders), in both themes:

| Pair | Needs | Graphite (dark) | Chalk (light) |
|---|---|---|---|
| ink on page-bg | 4.5:1 | 15.42:1 | 15.18:1 |
| ink on card-bg | 4.5:1 | 14.02:1 | 16.48:1 |
| ink-soft on card-bg | 4.5:1 | 10.28:1 | 12.25:1 |
| ink-dim on card-bg | 4.5:1 | 7.10:1 | 8.36:1 |
| ink-mute on page-bg | 4.5:1 | 6.19:1 | 5.54:1 |
| ink-mute on card-bg | 4.5:1 | 5.63:1 | 6.01:1 |
| ink-mute on sheet-bg | 4.5:1 | 5.37:1 | 6.01:1 |
| label on card-bg | 4.5:1 | 7.10:1 | 8.36:1 |
| accent-text on page-bg | 4.5:1 | 8.46:1 | 5.96:1 |
| accent-text on card-bg | 4.5:1 | 7.69:1 | 6.47:1 |
| positive on card-bg | 4.5:1 | 8.00:1 | 6.07:1 |
| caution on card-bg | 4.5:1 | 8.31:1 | 6.67:1 |
| critical on card-bg | 4.5:1 | 6.58:1 | 6.33:1 |
| critical on sheet-bg | 4.5:1 | 6.28:1 | 6.33:1 |
| on-primary on primary | 4.5:1 | 7.64:1 | 6.43:1 |
| ink-on-metal on metal | 4.5:1 | 8.50:1 | 6.55:1 |
| primary on page-bg | 3:1 | 7.61:1 | 5.56:1 |
| input-border on input-bg | 3:1 | 5.63:1 | 6.01:1 |
| metal on header-bg | 3:1 | 8.00:1 | 5.98:1 |

### Type: Inter, on the review's scale
- `app/layout.tsx` loads Inter through `next/font/google` (`display: 'block'`, so text never draws in a fallback
  face first) as `--font-inter`. The serif (`--font-brand`) is kept for the name "The Dream Wedding" only.
- The shell's rungs (`TYPE` in `theme.ts`) are the report's sizes in rem, so they follow the phone's text size:
  t0 28/600 (the one big figure), t1 22/600 (record and room titles), t2 17/600, t3 16 body at 1.45, tn 16/500
  (a row's name), t4 14 secondary, tb 15/600 (buttons), t5 13/500 (the smallest anything is set).
- Held at the scope in `WorklistShell.tsx`: tabular figures everywhere, no letter-spacing, no capitals set by
  CSS, no italic, and form controls take the page face. The older pages under `app/vendor/(legacy)/` get the same
  rules through their layout.
- Font sizes in every shell-reachable file were moved onto the scale (nothing under 13).

### Tap targets and the notch
- Every control is at least 44 px; every button is 48 px high with 12 px corners (`BUTTON` in `theme.ts`,
  `--wl-btn-h`, `--wl-btn-r`). One primary per surface, filled with `primary`; secondary buttons are outlined;
  Delete is red text on a neutral border.
- The header's top padding is `max(12px, env(safe-area-inset-top))` and the tab bar pads the home indicator.

### Rows, spacing and cards
- The one list row (`SliceRow`, `BinderCard` collapsed): 64 px or more, the name at tn, one line of facts at t4
  (wrapping, never cut), one thing on the right. Status pills are in sentence case.
- Paddings, margins and gaps were moved onto 4, 8, 12, 16, 24, 32; page edges and card insides are 16.

### Words
- "Enquiries" and "Enquiry" for Leads everywhere a vendor reads it; the nav's "Rooms" is "More", "Home" is
  "Today", "Pinned rooms" is "Pinned". "Edit Here", "Hot dates" (now "Good dates"), "Anno ·" and "Loose
  engagements" (now "Other events") are gone.
- No dashes in shipped words, no he or she (the vendor is "you"; a couple is "they"), no raw machine words
  (event kinds, states and statuses are shown in sentence case; an empty value is "Not given" or "Not set").

## Checked at default and large text
`docs/design/tools/measure.mjs` walked all 34 vendor routes at 374x812 and 360x800 (iOS and Android user
agents), dark and light, with and without the sheets opened, and at the phone's large text setting. What it
still reports, each looked at:
- An inline link inside a sentence on Couture ("Billing", 45x20): inline links in running text are exempt from
  the 44 px rule, as the report's own measure treats them.
- The calendar's today number on its coin, which the walker reads against the page instead of the coin.
- Word flags that are not words to change: GSTIN and IFSC (names of real documents), web addresses, and wrapped
  sentence continuations that start in lower case.
- Today's old masthead words ("open items", "1 enquiry · 1 invoice"), which stage 2 retires with the masthead.
- One real finding, fixed: the payment schedule's pill showed the raw state ("pending"); it reads "Pending" now.
- At the phone's large text setting (every route, both themes, iOS and Android), the walker found nothing cut off,
  overlapping or scrolling sideways; its only report was the same inline "Billing" link on Couture.

## Screenshots
`shots/stage-1/before/` (main) and `shots/stage-1/after/` (this branch): Today, Enquiries, Calendar, a client
(Meera, opened) and Money, at 374x812 and 360x800, dark and light.

## The floor

Run with `bash scripts/run-floor.sh`, `ANTHROPIC_API_KEY` and `DEEPSEEK_API_KEY` unset, in a clean worktree.

- **main (`85c66ef`)**: 43 RED, 1 ERROR, 7 REFUSED. None of these is this work's; they are main's own state
  (most read a sibling `dream-os` checkout that is not beside this tree, or are the older `tdw0x` benches).
- **this branch (`ba004c1`)**: 45 RED, 1 ERROR, 7 REFUSED, as run. Against main that is one green gained and three
  reds that were not this branch's:

  - **tdw09_type: red on main, green here.** Main's type bench failed on the old faces; the new rungs satisfy it.
  - **b123, b126, b134: red in that floor run, green alone.** b126 lost its port (3991) to a b122 run I had started
    in the stage-2 worktree at the same time; b123's base tree did not come up under the same load; b134 compared
    the message box's face as `Inter` against `inter` (the stage-1 amendment to its probe read the text rows' face in
    lower case and missed the box's). The probe now reads both the same way (`e65307c`). Run again alone on this
    branch: **b123 485/485, b126 48/48, b134 183/183.**
  - Every other member is exactly as on main (the same 43 reds, the ERROR and the 7 REFUSED). Of the reds main
    already had, the ones this work touches (b40, b42, b82, b122) fail only their main cells: b40 C50 and C102
    (C102's count is main's, 19), b42's two mock/byte cells, b82 REFUSED on the sibling repo, b122 3.5 on the sibling.
- After the floor, two small commits: `1fb56d6` (typographic apostrophes in the shell's new CSS comments, which had
  added 9 to b40 C102's count; and the payment schedule's state word in sentence case) and `e65307c` (the b134 probe).
  b40, b123, b126 and b134 were run on them; nothing else they touch is read by another bench.

## Benches updated, and why

Each was updated by label to the new value, with a note in the bench naming the change. None was loosened: where
a cell pinned an old colour, face, size or word, it now pins the new one exactly.

- b59: RESTATED_PINNED 110 -> 23 (the gold-at-alpha literals became token reads); in-family probes #C9A84C/#AE3A22 -> #CDB068/#A53420.
- obp_vendor_form 5b.3/5b.3b: the onboarding submit and done buttons pin PRIMARY (was BRASS); 5b.3c added: brass stays on the chosen chip.
- rosterMint.proof.ts: the veto-ledger byte follows the dash removal ("...crew list. Assign them...").
- tdw16_r2_leads_truth: the frozen label byte 'ENQUIRED VIA TDW' -> 'Enquired via TDW' (same words, sentence case); cells 1.1, 1.3, 1.5 key on it.
- tdw41_g34s2_pwa: the retry toast byte follows the dash removal ("The reminder did not go. Try again.").
- b80 §6.8: amended (by label) to compare AddSheet with its base outside type, spacing, corners and the listed DESIGN-1 words (lookFree, designWords).
- tdw07_p4a_ig §4.17: the picker footer is found by its token hairline (var(--atelier-card-border)), which replaced the old gold rgba literal.
- b125 1.1: tdwLine and consentBypass bytes say "in Enquiries" (were "as a lead" / "in your leads"); W5.
- b122 1.1, 1.2, 4.2a, 4.2f, 4.5b to 4.5d: the word bytes move (Home -> Today, Rooms -> More, Pinned rooms -> Pinned, Change pinned rooms -> Change pinned; new hashes). 4.2c/4.2h: the top pair's names take the shelves' ink and the icons the accent (P5: gold is the brand mark's alone).
- b126 1.1/1.2: three Meta-room bytes move (IG.professional no dash, carried from the portfolio's H2; IG.consent and QUIET.line without her/she and with enquiries). New hashes.
- b134 5.1/5.3/5.4: the sheet's rungs are read from theme.ts TYPE (Inter, the review's scale); no tracking anywhere; no control in capitals at any rung.
- b140 3.1/3.3/3.4 and the rung cells: rungs read from theme.ts TYPE (Inter); no tracking; the card's two controls at tb. The '?' keeps its 44 circle (the 48 button floor excludes it and the coin), so 2.3 stands unchanged.
- b57: the strong tap's margin reads 12, the spacing scale (was 10).
- b143 1.1c: the Posts card's button reads 'Open ads' (sentence case, ads.ts).
- b40 C1: 35 tokens (33 + primary, on-primary). C10: a button's stated height is var(--wl-btn-h) (48). C11: tn and tb read as rungs; every floor raised to 13 (tightened). C35: the FAB on --role-primary. C37: t0 is 28/600, the one big figure. C43: the day sheet's actions on an equal-cell grid, 8 apart, 12 above. C69: kindNouns lead pair -> ['enquiry','enquiries']. C98: .wl-btn at var(--wl-btn-h), .wl-btn.pri primary on on-primary. C86, C88, C115: the three bytes lost their dashes.
- b42: the headline pair is told apart by its accent icon (its name in the ink), P5; was the name in the metal.
- b82 (REFUSED on main and here: its §12.3 reads a DM Sans file from the sibling dream-os): §1.5 C5 says enquiry; §10.9 the sender fallback is "Enquiry"; §11.1 to §11.3 read the spacing scale (12, 16); §11.11 the thread's three gold literals became tokens (0 carried); §12.2/§12.3/M33 the toast text width is 288 (padding 12/16) at 16px; §12.8 and §14.5 the bytes lost their dashes; §14.6 the client chips are buttons in the opened row; §14.7 they sit first in the opened row, above the money bar.
- b81 §3.14/§5.11/M15: the outlined button form is 1px, 12px corners, 48 high, at tb (was .5px, 2px, 40).
- b77: the ratified mock is not edited (as every amendment before): its tokens and header are checked against the ratified tree (main 85c66ef, by git), and the .sol-* rules DESIGN-1 moved are derived by selector and excused only as exact pairs; the eyebrow and sub-head are t5 in sentence case with no tracking; the sub-head's space below is 12; the page defines --font-inter; M4 re-anchored.
- b134 probe: the message box's face is read in lower case, as the text rows' faces are (the stage-1 amendment compared 'Inter' with 'inter' and reddened on the box alone).
