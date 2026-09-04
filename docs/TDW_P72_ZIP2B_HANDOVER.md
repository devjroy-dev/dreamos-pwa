# P7.2 · ZIP 2b — ARM D, F-39.72, AND FORK 3's DERIVATION · HANDOVER

**Base** dreamos-pwa `worklist` **0d761e2**. Six files, no deletions. `tsc` exit 0 ·
b40 **FLOOR GREEN** (94 cells) · floor measured on a committed tree: **23 RED + 1 REFUSED, SET IDENTICAL to ZIP 2a's**.

## §0 · APPLY — two blocks

```
unzip -o TDW_P72_ZIP2B.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP2B.zip
```

```
git add -A && git commit -m "P7.2 ZIP 2b: every Today card opens its record by a key its room reads; the not-live byte waits for a settled failure [F-39.68 · F-39.72 · F-39.85 · c-P72.19 · c-P72.20]" && git push origin worklist
```

## §1 · ARM D — THE FOUR KEYS, UNIFORM (F-39.68)

`TodayCards` declares `KEY_FOR_KIND` beside the kind→room map, so each card writes its own key
and the registry (`ROOM_FOR_KIND`) decides which room reads it. `SliceShell`'s `?lead=` arm is
generalised by one map — `leads→lead`, `invoices→invoice`, `events→event` — same gate as before:
it opens the record and never enters select-mode. The lead **detail** fetch stays leads-only; the
conversation endpoint has no twin in the other slices. Opening a record is the sheet; enriching
it is not.

**`?contract=` is absent on purpose.** The contracts room has no record sheet (F-39.76), so its
card lands on the room root — stated at the site, asserted by C100, and stated on the card.

**c-P72.19 — `?event=` does NOT open `CalendarDaySheet`.** `ROOM_FOR_KIND.events_today` is
`events`, a SliceShell slice; `CalendarDaySheet` belongs to the **calendar** room. A Today card
may not send a kind to a room the registry does not name for it. `?event=` opens the events
slice's own record sheet, same arm as leads and invoices.

**c-P72.20 — `?task=` does NOT open "the Tasks sheet".** `TaskSheet` is the **create** sheet
(`draft` + `onCreate`, opened with `EMPTY_TASK`); the Team room has no per-task record sheet.
Sending a vendor who tapped a real task into an empty form is worse than the room root. `?task=`
selects the **Tasks tab** — the record's home to the depth this room supports. **Row-level focus
is not faked:** Team rows carry no anchor, so there is nothing to scroll to. **F-39.85** filed
for the task record sheet and its row anchor in Block 09.

**C100** asserts all four keys, the deliberate absence of the fifth, the encode, the shared gate,
the no-select-mode rule, and that the task key selects a tab rather than opening the create
sheet. Mutation: pointing the task key at `setSheet({k:'task'})` reds it with both reasons named.

## §2 · F-39.72 — CURED AT THE CAUSE

`responded: false` answered **two questions with one flag**: *the read failed*, and *the read has
not answered yet*. The not-live byte is a claim about the first and rendered during the second,
so every visit to Today flashed "Today isn't reading your work yet" moments before it read the
vendor's work.

The feed now carries **`pending`** (true from mount until the first reading settles either way)
and a separate **`READ_FAILED`** state on every failure path — so the flag cannot lie in the
other direction either. The byte waits for a settled failure. **While pending the surface says
nothing:** a skeleton would be a second claim about a fact not yet in hand (R-38.4, one t1 per
surface). Anything reading `responded` alone behaves exactly as before.

**C34 amended** to assert both halves: the byte's gate, and that the feed still distinguishes the
two states.

## §3 · FORK 3 — THE DERIVATION, AND WHY (a) SHIPS NOTHING

**The live defect is NOT live.** `AskSheet.tsx:72` still mounts `<ThemeProvider pinned={mode}>`,
and `applyThemePinned` sets the context tokens with **zero documentElement mutations** (E-1's
arm). `useT()` inside the sheet already answers the shell's mode, so bubbles and input follow
Chalk today. Nothing to restore; card ④ walks it.

**(a)'s yield is ZERO, and the reason is the finding.** Of **22** `T.isLight` conditionals across
the four components, exactly **one** has both branches already tokenised — and even that one
picks a *different token per mode* (`T.accent` in light, `var(--atelier-label)` in dark). These
conditionals do not select one token that varies by mode; they select **different tokens**, and
several carry raw `rgba(...)` literals with no token behind them at all. Collapsing any of them
to a single CSS var would **mint a token value**, which is a design act, not a port.

**F-38.50 NARROWS** to that residue, named here for Block 09's design pass (frame + veto sheet):
the 22 conditionals in `ChatThread` (8), `InputBar` (7), `MessageBubble` (7); `TypingDots` reads
`T` but carries no conditional; and the `isLight` **child contract** (`<FilingChip isLight={…} />`),
which is a component API question, not styling. Nothing was ported, so nothing was minted.

## §4 · FOUNDER CARD — alias, **incognito**, both modes
① identity ② Today: tap the invoice card → its sheet · a task card → the **Tasks tab** · an event
card → its record in the events room · the contract card → the Contracts **room root** (stated,
no sheet exists) ③ **hard-reload Today**: no "isn't reading your work yet" flash — blank, then the
reading ④ open the ask sheet in Chalk: bubbles and input read light ⑤ light and dark both.

## §5 · NOT IN THIS ZIP
Arm E (dream-os companion), P7.3 (the demo studio in the Graphite shell), P7.4 (the merge, the
production walk, the seal). F-38.50's residue → Block 09.
