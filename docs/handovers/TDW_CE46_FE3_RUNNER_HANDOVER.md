# TDW · CE-46 · FE-3 · THE RUNNER CURE r3 · A-46.2, F1(a), F2(c) · HANDOVER · dreamos-pwa

Base `4d5a5dc2` (FE-2's Calendar). dreamos-pwa only. Supersedes the unlanded r2 (`TDW_CE45_FE2_RUNNER_r2.zip`, sha256
`4984f0b1…`), whose bytes it carries and whose ten paths R0 undoes by name in the founder's tree before block 1. Rung
**b133**, amended by label from 6 to 15 cells. No product file is touched; no vendor word changes; no SQL.

This handover was written AFTER floor 3 ended (C-44.1's class): the floor pins a declared file's contents during a
run, so the file was an empty placeholder while the slices ran and took its text once the verdict printed.

## The disease, and what the read-first found

The runner ran every member as `>/dev/null 2>&1` (`scripts/run-floor.sh:296-297` at `4d5a5dc2`), so a red member could
not name its cell. The founder's floor with r2 applied read `RED: b120_g61_own_number_bench` (41 against a base of
40) while b120 alone in the same tree was 50/50, and nothing anywhere held the failing line.

Derived in the read-first: b120 is the FIRST dev-server member of the whole floor (order: the two clean-tree benches,
b05, then b120), so no earlier member can leave a server ahead of it. In this seat's container b120 ran INSIDE a floor
three times with r2's bytes: 50/50, 50/50, 50/50; alone once: 50/50. The red did not reproduce here; by the chair's
amended F3 bound, the cure ships without a named cell and the founder's machine becomes the instrument: on any future
red HIS floor prints the member's last 25 lines beside the verdict, which he pastes.

## What changed

1. **The kept output (F1(a), F2(c)), in `scripts/run-floor.sh`.** Every member's stdout and stderr go to one file in
   ONE per-floor directory, `${TMPDIR:-/tmp}/tdw-floor-pwa`, wiped at the start of every fresh floor and named in the
   floor's own output as `FLOOR LOGS: <dir> (floor <id> …)`. Each log opens with a header (floor id, member, UTC time)
   and closes with a trailer the runner writes after it reads the exit code: `KEPT GREEN floor=<id>`, or
   `KEPT RED|ERROR|REFUSED rc=<n> floor=<id>`. A log with no trailer is a member cut off mid-run. After the whole set
   the runner prints the LAST 25 LINES of every RED, ERROR and REFUSED member under `---- <verdict> ----`; the full
   log stays on disk. The exit code is still the verdict; the kept text is evidence beside it, never a classifier.
   A-45.6's own last-run logs for dev-server rungs stand beside these.
2. **The resume ledger (A-46.2), in the same file.** The directory is also the floor's ledger. `--resume DIR` skips only
   a member whose log in DIR ends `KEPT GREEN floor=<id>` for the id in `DIR/floor.id`, runs every other member again
   (missing, red, errored, refused, or trailer-less), announces the skips, and REFUSES with exit 1 if HEAD or the dirty
   SET differs from what `floor.id` recorded ("the tree moved"): a GREEN kept on another tree is not this floor's.
   **This is the seat's slice path, never the founder's: his block 2 is ONE whole floor with no `--resume`.**
3. **Carried from r2, byte for byte:** A-45.13 (the runner reaps and NAMES any next dev a member leaves in the root,
   before the floor and after every member, `scripts/lib/floor_reap.sh`); F-44.163 closed (b87:101, b83:175 and
   b120:261 stop their servers with `scripts/lib/stop_tree.js`'s `stopTree(pid)`, the whole tree waited on; b120's
   50 cells untouched); BINARY_READS in `scripts/tdw_f0774_readers.proof.mjs` (§2.1b). r2's own handover and manifest
   do not return; this handover and `scripts/floor-manifest-ce46-fe3-runner.txt` replace them.

## The rung, b133 (15 cells)

The six r2 cells stand. §4 and §5 add nine, driven on a FIXTURE FLOOR: a throwaway git repo holding the REAL runner
bytes, `floor_reap.sh`, and four fixture members exiting 0, 1, 2 and 3, so the runner is driven end to end in seconds
without running this estate's 141 members inside a bench. The fixture keeps the runner UNTRACKED so its dirty SET is
the same under real and mutant bytes and the ledger's tree check never masks the resume mutation.

- **4.1** the floor names its directory, keeps one log per member, and every trailer is exact for this floor's id.
- **4.2** the tails of the RED, ERROR and REFUSED members print under their names, ending on each trailer with the cell
  line above it; the green member's output is absent.
- **4.3** the bound: 25 lines. Line 37 of the red member is on screen, line 36 is on disk only.
- **4.4 MUTATION** (`TAIL_LINES=0`): the red member's cell vanishes from the floor's output, so 4.2 reddens on it.
- **5.1** `--resume`: the kept GREEN is not run again (its run counter unchanged), red, error and refused run again
  (+1 each), and the skip is announced.
- **5.2** a missing log runs again. **5.3** a trailer-less (cut-off) log runs again.
- **5.4 MUTATION** (the `KEPT GREEN floor=<id>` test replaced by `true`): the red is skipped, so 5.1 reddens on it; the
  cell refuses to pass on a "tree moved" STOP, so it tests the skip rule and never the refusal.
- **5.5** a `floor.id` naming another tree is refused, exit 1, nothing run.

Record: **b133 15 pass, 0 fail**, twice (UTC and `TZ=Asia/Kolkata`; the only date in play is the floor id's label; no
`faketime` in the container). b120 alone 50/50.

**e-187 (this seat's own):** the first form of 4.2 and 4.3 expected the cell's marker as the tail's last line; the
trailer is the last line, as the runner prints it. The cells were wrong, the runner was not; both fixed at site and
the header says so.

## The floor at the cut: floor 3, on r3's own runner, in gated slices

Container: 1 CPU, 3 GB; a whole floor outlives one turn here, so the floor ran as the ruling allowed, every slice
opening on the A-45.4 gate (leftover processes, `git status -uall` against the manifest, `.next/dev`):

- **Floor 1** (r2 applied): cut off at b125 by the turn's end; the gate found b125's mutation killed in place in
  `app/vendor/(shell)/settings/page.tsx` (1 line), restored by checkout of that one path; `.next/dev` cleared.
- **Floor 2** (r2 applied): ran on ~35 min past the turn, died during the wrappers at member 133; gate clean.
- **Floor 3** (r3, `--delivery scripts/floor-manifest-ce46-fe3-runner.txt --check`, id
  `20260926T203623Z-4d5a5dc2-5772`): slice 1 cut off at b125 (trailer-less), gate clean, `.next/dev` cleared;
  slice 2 with `--resume /tmp/tdw-floor-pwa` kept 5 GREEN, re-ran b125 and everything after, and ended
  **`FLOOR = NAMED BASE, no delta  (refusals, not in base: 0)`**: 141 members, 101 KEPT GREEN, 40 KEPT RED (the named
  base, set-equal), 0 REFUSED, 0 trailer-less; 40 tails printed. The founder's block 2 is one whole floor.

## Named, not cured here

- **F-44.200** (chair-minted): `b125_g61_enquiry_row_bench` leaves a next dev running in the root; r2's reaper named
  and stopped it in floor 2 AND floor 3 here (`LEAK: b125_g61_enquiry_row_bench … ports  `: the port unread, the
  candidate's own args carry no `-p`). b125's stop is `process.kill(-dev.pid)` with no wait; b129's is a group
  SIGKILL. Both are their own later small cut (the chair's F4: leave, named), to `stopTree`.
- b122 and b126 both bind :3991; safe in a serial floor; recorded.
- b133 keeps its r2 file name (the rung number is fixed; a rename would be a new path for nothing).

## The founder's walk

None: no surface moves. His block 2 (the whole floor) is the live witness, declared not claimed; its tail is the
card's last step. On any future red, the runner prints `FLOOR LOGS: <dir>` and the member's last 25 lines; he pastes
the block from `---- RED: <member> ----` to the next `----` line.
