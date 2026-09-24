# TDW · CE-45 · G6-1 · FE_2b's PWA HALF · HANDOVER · dreamos-pwa

Base: `612a5b76` (given under R-45.14 after FE-2's TYPE_2; built at 8a943ae1, carried byte for byte). Its dream-os half is
FE2b_SRV_1 (F-44.154, toE164). Cures **F-44.155** (the seat's e-118) and carries the founder's words.

## What changed

- **F-44.155 · the page that lied for five minutes.** `/v/<code>` exports `revalidate = 300`; the row now calls
  `/api/revalidate/storefront` after every write the door echoed, exactly as the storefront and website editors do
  (R-G31.7). No echo, no rebuild. On rung 2 this closes an exposure: her number no longer lingers on her public page after
  she withdraws it.
- **His header ask** ("Where enquiries go should read as header to the three options"): E1 and E2 now sit under `SCard`
  (register "rungs"), the "Business" heading's own component, the three options beneath; the second screen under the same
  heading. No new style.
- **Rung 3's switch** (the chair's note, F-19.20): the same switch as its siblings, off, at the rows' own disabled look
  (opacity .6), beside its stated state. Disabled and stated, never absent.
- **His words** (his "yes"): the three options renamed; rung 3's state folded into its description; E11 "Enter a WhatsApp
  number." "TDW’s" carries the typographic apostrophe (R-40.57), the relay having carried a straight one.

## Proof

- tsc clean, preceded by `rm -rf .next/dev` (A-45.5: e-120's cause witnessed, a truncated generated routes file left by a
  stopped dev server). **b125 at 612a5b76: 32 pass, 0 fail**: the words by sha; E1 heading the options and in none of
  them; rung 3's disabled switch; revalidate counted (1 after the confirm, 1 after back-to-TDW, 0 after cancel, 0 without
  an echo); mutations M1 to M5, each red and restored (M4 the revalidate call dropped, M5 rung 3's switch removed).
  b73 70/70, b77 51/51, b120 50/0.
- **The differential, in series on 612a5b76:** 55 benches reading this half's files or walking the tree; the work
  stashed for the base side and restored (0 sha mismatches). Exit codes identical; no output deltas. b123 (FE-2's) not
  run here, as at FE2_1 (A-45.4, the cap): its walks search five names none of this half's files holds.
- **The floor:** its own turn.

## The walk

Settings: the heading "WHERE ENQUIRIES GO" over the three options, rung 3 greyed with its switch; "You answer on your
number", the second screen, 8757788550 typed without +91, confirm; /v/dev440's Enquire opens +91 87577 88550 at once;
"Your TDW agent answers", and the page's link returns to TDW's line at once, with no five-minute wait.
