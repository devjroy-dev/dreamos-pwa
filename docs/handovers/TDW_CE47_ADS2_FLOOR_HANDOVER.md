# TDW · CE-47 · ADS-2 · PACKAGE B: ONE FLOOR AT A TIME · A MEMBER THAT RUNS ALONE · OLD BASE WORKTREES REMOVED · dreamos-pwa

BASE: 0038eb41 (main's tip) with PACKAGE A under it (the APPLY stops otherwise). Scripts only; nothing a vendor sees.

## F-44.423 · one floor at a time (scripts/run-floor.sh)
Pressed three times on a frozen Codespace, the train's start line started three floors; each start removed the logs
and the resume ledger of the one before, and with --affected rebuilt .next under it. Two locks are now the first thing
run-floor.sh does, before any argument is read or any file removed: the clone's lock in $(git rev-parse --git-dir)/
tdw-floor.lock (inside .git, so never a dirty path), and the log folder's lock ${TMPDIR:-/tmp}/tdw-floor-pwa.lock (two
clones on one TMPDIR). Each is a mkdir, atomic on Linux and on the Mac. Its owner file names the pid and that process's
start time, so a reused pid is not taken for the owner. A live owner: the start REFUSES with rc 3, "REFUSED — a floor is
already running in this tree (pid …, started …). Nothing was run, nothing removed." A dead owner (kill -9, a restart):
the lock is moved aside to <lock>.stale, said so, and taken. Both are released on exit. b206 §11: 11.1 a second start in
the clone refuses and removes nothing; 11.2 a start in another clone on the same TMPDIR refuses on the log folder's lock;
11.3 after kill -9 the next start moves both stale locks aside, runs, and releases its locks. M9 and M10 bite them.
11.1's "removes nothing" (the chair's yes, 8 Oct): it first compared the folder's listing before and after the second
start, and under load the running floor wrote a new log in between (red on sB run 4, kept in the ledger). It now checks
what it says: every name listed before is still there after, and floor.id is byte for byte unchanged; a red names the part.

## F-44.421 · a member that runs strictly alone (scripts/run-floor.sh, scripts/lib/floor_reap.sh, b123)
A bench whose header carries `// FLOOR-ALONE: yes` runs after every other member, one at a time. Before it: every next
dev in ANY root is stopped by pid and named (floor_reap.sh "(alone: <member>)"); the floor waits, bounded (60 s), until
no headless browser is left from earlier members; .next is moved aside, the newest kept in $(git rev-parse --git-dir)/
next-aside (lesson 3: kept, never a dirty path); and the member gets a TMPDIR of its own. After it, the root pass b133
pins, then the any-root pass again. b123 declares it (amended by label). b206 §12: 12.1 it runs last though its name
sorts first; 12.2 a next dev an earlier member left in another root is stopped and named; 12.3 .next is moved aside;
12.4 its own TMPDIR. M11 and M12 bite them.
b189: it does NOT declare FLOOR-ALONE. Its red on the founder's floor was a Codespace restart killing it mid-mutation
(F-44.424), not state an earlier member left; package A cures that (the kit plants through the guard, and the floor
settles every marker before it reads the dirt). b123_v2 has b123's shape (two servers and a base worktree); it is a
candidate for FLOOR-ALONE, not declared here without the chair's word.

## F-44.425 · old base worktrees removed on start (scripts/lib/base_worktrees.js, b123, b123_v2)
b123 and b123_v2 added `.b123-base-<sha12>` beside the repo for each base and never removed one (six at 870 MB). On
start, before adding its own, each now removes every `.b123-base-*` worktree of THIS repo but the one it needs, with
`git worktree remove --force`, then `git worktree prune`. Never touched: another clone's (not in this repo's `git
worktree list`; the folder beside the repo is shared by every clone in it), and one a process still runs in (cwd read by
/proc, or lsof on the Mac), which is named and kept. The two share the prefix, so one removes the other's idle base,
which the other adds again when it runs. b122 and b140 make no base worktree (only b123 and b123_v2 run `git worktree
add`). b206 §13: 13.1 on a fixture with three of this repo's worktrees, one in use, and another clone's: only the idle
old one goes. M13 and M14 bite it.

## b206's own mutations through the guard (lesson 5)
b206 mutates run-floor.sh and the selector; its loop now plants through mutation_guard.js, with free space checked first
(8.0) and recoverOrRefuse at its start (the parent only).

## b133 §2.3 · the bystander outlives a slow fixture (the chair's yes, 9 Oct 2026; amended by label)
Under load b133's leak fixture took over a minute to answer (183 s for the run), and 2.3's bystander, a `sleep 60`, ended
on its own first; "not alive" read as "the reaper stopped a shell" (red on sC run 1, kept in the ledger). It sleeps 600
now and is still killed at the cell's end. bash runs a one-command -c string by exec, so the old bystander was a bare
`sleep 60` whose command line did not say "next dev"; a second command keeps it a shell that mentions it, the cell checks
that it does, and a red prints the bystander's age. RED-ABLE: a reaper planted through the guard to treat bash as a
server (is_server_prog admits bash) reddens 2.3 on the cut: "the reaper stopped a shell (the bystander was 28 s old;
its own sleep is 600 s)", 14 passed 1 failed, the reaper restored by sha. The same planted reaper reddens the old 2.3 on
the base too; how it reached the bare sleep there I have not traced.

## PATHS SHARED WITH OTHER PACKAGES
Every path this package moves on top of package A: scripts/run-floor.sh AGAIN (A moved it for F-44.424's recovery line;
this package adds the locks and FLOOR-ALONE on A's bytes); scripts/lib/floor_reap.sh; scripts/b123_ce45_fe2_type_bench.js;
scripts/b123_ce45_fe2_type_bench_v2.js; scripts/b206_ce47_floor_affected_bench.mjs; scripts/lib/base_worktrees.js (new);
scripts/b133_ce45_fe2_runner_reap_bench.js. Besides run-floor.sh, none of them is in package A; on 0038eb41 none is in
another seat's package that I can see.

## PROOF

Base: 0038eb41 with package A applied (/home/claude/pwa-c7A, A's 17 paths as shipped). Cut: the base plus these 9 paths
(/home/claude/pwa-c7B). Every row is a line of the series ledger; the two reds that stopped the series are kept, with
the cure each one got. "Under load" means every core held busy by a spin loop for the whole run, one bench at a time.

### Quiet, base against cut, one at a time

| bench | base | cut | the cells |
|---|---|---|---|
| b206 | rc 0 34/0 | rc 0 49/0 | cut adds 15: 11.1 a second start in the same clone refuses with · 11.2 a start in ANOTHER clone with the same TMPDIR · 11.3 after the running floor is killed (kill -9),  · 12.1 the FLOOR-ALONE member runs after every other · 12.2 before it, a next dev in ANOTHER root is stop · 12.3 .next is moved aside into the clones .git (ke · 12.4 the member runs with a TMPDIR of its own · 13.1 its own old worktree is removed; the one it n · 8.0 free space before the first mutation (256 MB a · M10 a live owner not honoured (F-44.423): reddens  · M11 FLOOR-ALONE not read (F-44.421): reddens 12.1, · M12 .next not moved aside (F-44.421): reddens 12.3 · M13 a worktree in use removed (F-44.425): reddens  · M14 the needed worktree removed too (F-44.425): re · M9 the clone's lock not taken (F-44.423): reddens  |
| b133 | rc 0 15/0 | rc 0 15/0 | IDENTICAL |
| b174 | rc 0 34/0 | rc 0 34/0 | IDENTICAL |
| b140 | rc 0 10/0 | rc 0 10/0 | IDENTICAL |
| b140_v2 | rc 0 10/0 | rc 0 10/0 | IDENTICAL |
| b123 | rc 0 486/0 | rc 0 486/0 | IDENTICAL |
| b123_v2 | rc 1 245/108 | rc 1 245/108 | IDENTICAL (red cells included: F-44.263, b123_v2's standing debt) |
| b206 (after the §11.1 cure) | (the base is unchanged, run in qB) | rc 0 49/0 |  |
| b133 (after the §2.3 cure) | rc 0 15/0 | rc 0 15/0 | IDENTICAL |

b140 and b140_v2 ran --source. b123 and b123_v2 each ran in about 15 minutes, base and cut alike.

### The cut under load

| set | bench | runs | green | red |
|---|---|---|---|---|
| sB | b206 | 5 | 4 at 49/0 | run 4 48/1 (11.1) |
| sC | b206 | 10 | 10 at 49/0 | none |
| sC | b133 | 5 | 4 at 15/0 | run 1 14/1 (2.3) |
| sD | b133 | 5 | 5 at 15/0 | none |
| sD | b174 | 5 | 5 at 34/0 | none |

sB stopped on b206 run 4 (11.1, the listing compared for equality while the running floor wrote a new log). The cure,
ruled 8 Oct: 11.1 checks that nothing was removed and that floor.id is unchanged, and names the failing part; M9 and
M10 still redden it. sC then ran b206 ten times green and stopped on b133 run 1 (2.3, the bystander's own sleep 60
ended while the fixture took over a minute). The cure, ruled 9 Oct, is above; a planted reaper that kills the shell
reddens 2.3. sD ran b133 five times and b174 five times green. b206's ten sC rows stand: neither cure touches b206.
