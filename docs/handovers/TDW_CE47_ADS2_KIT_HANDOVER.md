# TDW · CE-47 · ADS-2 · e-275: THE FE-7 KIT WAITS ON THE THING ITSELF · dreamos-pwa scripts only

WALK: none. This package changes nothing a vendor sees (scripts only); the founder's walks ruling does not apply.

THE MEASURE BEFORE: scripts/lib/fe7_l4_kit.js had 6 fixed pauses and its 13 benches 20 more; each waited a guessed time.
THE CURE: every wait is on the thing itself, bounded, returning { ms, timedOut }:
  settle(p): no request in flight and no DOM change for 300 ms, capped at 8 s (open() and tap() call it);
  waitFor(p, sel) and waitUrl(p, pred): the element or the navigation itself;
  watchReload(g, url): after a mutation's write, Next's own client says "[Fast Refresh] done" on a watcher page opened
    before the write (this dev server logs nothing on a file change; found in the build, see the proof);
  the end: until nothing is left, capped at 15 s.
THE BENCHES: each pause after a tap deleted (tap settles); navigations made waitUrl; sheets and the help card waitFor;
  b177's own reload watched. Every changed line is marked "// e-275". No assertion edited, no threshold moved.
b257: the kit's self-test in a real chromium, each wait both ways, mutations M1 to M5.
b206 section 10: --affected then --resume, end to end on a fixture repo; M8.
ZOMBIES, so the next reader does not chase them: at the instant a bench exits, 2 or 3 chromium children can show as
<defunct> (state Z) while they are being collected; they hold no port and no file, and 5 s later there are none.
The measure that matters is live leftovers at exit and both counts at 5 s; the proof ledger records all three.
UNDER LOAD: every core of the seat's container pinned by a busy loop beside every run (one core to 7 Oct, runtimes 37 to 91 s; two cores after the 7 Oct rebuild, runtimes 25 to 27 s).
PROOF, every count read from the ledger file (proof/ledger.tsv in the checkpoints; 144 rows), base a32fbf4e:
  (c) the family on a quiet machine, base against cut, cell for cell (26 rows): all thirteen, b177 to b189, IDENTICAL.
      b177's render red (cell 2, Business Solutions at 360) was on base and cut alike in the one-core container; the
      founder's machine is the judge of that cell, and on the two-core container it reads 48 green, 0 red.
  The bed after the 7 Oct rebuild (4 rows): b178 and b184, base against cut, IDENTICAL.
  (a) under load, b179, b181 and b187 × 20 each (60 rows): every row rc 0, red 0 (22, 23 and 26 green); live leftovers
      0 at exit and at 5 s, zombies 0 at 5 s, no wait-timeout note.
  (b) under load, the other ten × 3 (30 rows): every row rc 0, red 0, the same green count on every run of a bench;
      leftovers and zombies as in (a); 12 to 47 s.
  e-276's walkers (24 rows, run alone, b140_v2 with nothing else alive): b40_v2, b73, d1_help_v2, b122_v2, b126_v2,
      b140_v2 and all six ce41 benches IDENTICAL base against cut, cell for cell. Their reds are base reds: b40_v2 3,
      b122_v2 1, b140_v2 52 (all cell 3.1), ce41_e2ivb its template line. b122_v2's compare sets aside next dev's own
      "Ready in N ms" print.
  b257 18/0; b206 34/0.

F-44.365, b140_v2 cell 1.7 (the chair asked for a view, not a change; nothing here changes it): 1.7 drives the real
floor_reap.sh in its "(before the floor)" scope, which by A-46.6 stops a next dev in ANY root. That is right inside a
floor, where members run one at a time. But when 1.7 runs beside other benches (e-275's load rule, a seat's container,
a founder's second terminal), it stops THEIR servers and gives them a false red. View: keep the reaper as ruled, and
let the cell prove the any-root scope only on what it planted. The reaper honours a narrowing variable that the floor
never sets (e.g. FLOOR_REAP_ONLY_PIDS, the stand-in's pid), and a second, source-read assertion pins that without it the
scope is any. So 1.7 still fails if the any-root pass is narrowed, and it can no longer touch anyone else's server.
