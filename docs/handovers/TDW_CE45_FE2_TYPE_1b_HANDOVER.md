# TDW · CE-45 · FE-2 · TYPE_1b · HANDOVER

The tops of the six legacy rooms in the founder's words. Base `97031c40` (TYPE_2, G6-1 FE2b_1, IGD-1 cut 1, then G6-1 F-44.167 on disjoint files; r3: b123 §3.5 re-cut to read the title element's own box and padding, e-134, A-45.9; TYPE_1b was built on `612a5b76` and carried under R-45.14: every path byte for byte except `scripts/b122_ce45_home_shelves_bench.js`, the one path IGD-1 also changed (its :119 icon hash, H_ROW, 2.7's name and 1.6), where FE-2's hunks were merged three-way onto IGD-1's bytes with no conflict, each side's lines proven to arrive whole). dreamos-pwa only. Rung **b123**, re-cut; **b122** hardened (F-44.160).

## What he said, and what was ruled

Walking TYPE_1 live, he said the tops of the rooms hugged the header, the rooms had no names at the top, and lines like "From your binders" and "Enquiries pipeline" needed simplifying. He took the chair's table whole ("Ill go with your recomendation"). On the collision between the new title and the headline figure, he chose **B** ("b it is").

- **(i)** The room opens as the reference surface opens: 16px above its first line.
- **(ii)** That first line is the room's own name at t1, the registry's label byte. There is no kicker (row 10).
- **Rows 1 to 3 and 9** are dropped: the lane lines and the foot lines.
- **Rows 4 to 8** are his headline lines:
  - Enquiries · N open / none open
  - Booked · N clients / 1 client / no clients yet
  - Outstanding · N open / settled
  - This month · N filed / nothing filed
  - This week · N ahead / 1 ahead / nothing ahead
- **B**: the name is the surface's one t1 (theme.ts :49). A money figure (Leads, Invoices, Expenses) stands at t2, and a count room (Clients, Events) carries its count in his line alone.

## What changed

- **`lib/worklist/copy.ts`**: `LEGACY_ROOM_HEAD` holds rows 4 to 8 as five functions of the rooms' own live counts. It is the one home; the family never types these words. "Binders" leaves every line.
- **`components/vendor/slices/SliceShell.tsx`**:
  - The title `ROOM_NAME[slice]` is built from `ROOMS[].label`, at t1 with 16px above.
  - `LANE_LINE` and `CHIP_BLINDNESS` are retired with their readers.
  - The five mastheads take `line={LEGACY_ROOM_HEAD.<room>(count)}` from the same derivations as before: `derivePipeline`, `deriveClients`, the open count, `deriveExpensesThisMonth` and `deriveEventsThisWeek`.
  - The sort control sits on the headline row.
- **`components/vendor/slices/Masthead.tsx`**: one line at t4, the money figure at t2, no figure for a count. The eyebrow and sub-line are retired, with the header comment that described them.
- **`app/vendor/(shell)/clients/body.tsx`**: its masthead the same way.
- **`app/vendor/(shell)/notes/body.tsx`**: its title from the registry.

Nothing else moved: the property multiset against the tip changes only the listed words and paddings. `tsc` is clean.

## The benches, by label

- `tdw09_money`: the figure's pin moves from T.t1 to T.t2 (B). 18/18.
- `tdw09_walkrider` §3.1: the body-voice line is read at `{line}`. 16/16.

## The rung, b123, re-cut

- **e-123's cure**: each dev server's output goes to a log beside the run, and a server that does not come up prints its last 25 lines. `stdio: 'ignore'` is retired.
- **A-45.5**: each tree's `.next/dev` is cleared before every dev start.
- **The base** is `612a5b76`.
- **New cells**:
  - 1.7: `LEGACY_ROOM_HEAD` by sha.
  - 1.8: every headline is from the home and every title from the registry; no lane, foot, eyebrow or sub-line survives.
  - 3.4: the head is his: the registry title, the t2 money figure or none, and his line for the base's own count.
  - 3.5: the title's text sits 16 to 22px below the room's top, at t1.
- **3.1** compares the words below the head, with row 9's three foot lines as the one listed removal. **4.1** is amended by label to t2. **3.3** expects no case movement where F5 is already whole.
- **M5** is re-aimed at a list word (the retired lane line was its old target). **M8** changes one of his bytes (1.7) and **M9** types the title (1.8). **M2** is re-anchored on T.t2.
- **Two defects in my own rung, cured**:
  - 3.5 first measured the heading's padded box instead of its text line; it now uses a Range.
  - A tree with no home threw in 3.4; it now reds there. The Notes head is taken only where its title is present.

## The record of runs

- **Cured, both themes**: 403 green. The one red was M2's anchor, since re-anchored.
- **The mutations whole** (`--mutate`): 17/17. M1 to M9 each redden their own cell and are restored.
- **The Notes scenes, cured, after the Notes-head fix**: green.
- **At the TYPE_2 tip** (dark): red on the cure cells alone. 1.7, 1.8, 3.4 and 3.5 in every room, and 4.1 (the figure at t1). Notes checked again after the fix: 1.7, 1.8, 3.4 and 3.5 only.
- **Shifted clocks** (leads, events, invoices, expenses; dark): 138/138 at each of 2026-09-24T12:00Z, T19:00Z, 2026-12-31T19:00Z and 2028-02-29T06:00Z.
- **The differential**: 18 scripts (every reader of the five files, and the type censuses), cured against a base worktree at `612a5b76`. Exit codes are identical in all 18. Output is identical in 17; b123 differs only by its own new cells.

## F-44.160 · b122 hardened (ruled into this cut)

Twice, FE-1's b122 reddened inside the founder's floor and passed alone. The runner discards every bench's output (`run-floor.sh` :296-297), so no floor could name the cell.

**The mechanism, WITNESSED in the seat's container**: Next 16 refuses a second `next dev` in one directory ("Another next dev server is already running"), and nothing answers on the second port. In the floor, b120 runs immediately before b122, in the same root, and exits without waiting for its server to die. The same shape explains e-123.

**A second fact, found by b122's own control**: clearing `.next/dev` under a running server deletes its lock, and a second server then starts beside it. So A-45.5's clear happens only when the root is free.

**The hardening:**
- (1) The dev server's output goes to a log, and its last lines print when it does not answer.
- (A-45.6) b122 writes every line of its own run to `b122-last-run.log` in the temp dir, so a red inside a floor names its cell and cause.
- (2) `.next/dev` is cleared before a start, only when no other next dev holds the root.
- (3) A bounded 60s wait for the root's other next dev processes, then the start. A start that does not answer is retried once, and the retry is printed.
- (4) Control 4.00, run every time: with another next dev holding the root, and the wait and retry disabled, the start must fail and its log must say why. It is green in the container.
- b122's own server is now awaited to exit before the bench ends.

**b123** takes the same care: its start waits for its root to be free before clearing, and its stop waits for the server's exit.

b120, b125 and b83 are named for the same care at their next edit.

## F-44.160, b122 hardened (assigned to FE-2; A-45.6, A-45.7)

**The finding.** b122 reddened inside his floors and passed alone. The runner discards every bench's output (`run-floor.sh` :296-297), so no cell could be read.

**The mechanism, witnessed in the seat's container, not inferred.** Next 16 refuses a second `next dev` in one project root: its log names the running server and says "Run kill … to stop it". A rung that signals npx's process group and waits only on npx lets next-server outlive the bench and hold the root, and the next dev-server rung then reds. It was witnessed twice with leftovers: b123's old stop leaving :3964, and b122's first hardened kill leaving its blocker on :3989. The group-only kill leaks as a race, not every time.

**The cure.**
- **(1)** b122 keeps its own record (`$TMPDIR/b122-last-run.log`) and its dev server's log, and prints the tail when a server does not answer.
- **(2)** A-45.5: `.next/dev` is cleared only when the root is free.
- **(3)** The start waits (bounded, 60s) for the root to be free, and a start that does not answer is retried once, printed as a line of the run.
- **(4)** The kill takes the whole process tree, found from `ps` before signalling, and waits until every pid is gone. b123's `stop()` takes the same whole tree.

**The proof cells.**
- **4.00**: the control. A held root fails the start, and its log says why.
- **4.99**: no next dev survives the bench.
- **4.99m**: 4.99's proof of record, as ruled. A kill of npx alone leaves the server alive and the detector sees it; the whole-tree kill then frees the root. The chair's first-named mutation (the group-only kill restored) was ruled non-deterministic and withdrawn (c-45.49).

**On demand**, the npx-only kill reproduced F-44.160's red: the main start and its retry were both refused, and 4.99 was red naming the survivors.

**Record:** b122 alone 89/89; b120 then b122 back to back 50/50 and 88/88 (before 4.99m existed); b123 rendered and `--mutate` 404/404, with its whole-tree stop.

**F-44.163**: b120, b125 and b83 keep the group-only stop, and are named for their next edits.

## A disclosure (e-126, A-45.7)

A detached sequence of the seat's from an earlier turn was still live when the seat edited b122 and b123 and stopped servers by pattern. Its results were set aside as contaminated. From then on, every sequence was gated on its own sentinel, and only exact pids were stopped.

## Named, not cured here

F-44.151 (the WhatsApp glyph's link-default blue), F-44.156 (the `<html>` hydration warning) and F-38.22's colour literals, each for a later small cut.
