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

## r2 · THE F-44.365 FOLLOW-UP (CE-47, 7-8 Oct 2026) · app train 5, AFTER FE-9's package 1 · base 4572df0 + FE-9's b183 cfe94b37

THE RULE, for every bench on the kit from now on: after K.open, any second selector read in the page either waits on
that selector or guards a null; and a K.words result (null when its root is missing, or when the page moved under the
read) is guarded before it is used as an array. A bare read is a defect.

WHAT (b) DID NOT PROVE. The kit package ran the other ten benches 3 times each under load. Three runs cannot show a
crash that comes 2 in 20: FE-9 found one in b183 (cell 0.2). Read from the source, the same shape was in b183 four times
(19 '.ob2', 20 '.ob-h', 26 '.ob-f'[0], and K.words('.ob-in') used bare: FE-9's sixth amendment cures all four, laid
under this package, the APPLY stops if b183 is not cfe94b37), in b179:40 (the Aanya row indexed bare after a wait on
'.fr-row .fr-f'), and as K.words results used bare on 24 lines in b180, b181, b182, b185, b186, b187, b188.
THE CURES HERE:
  b179:40 waits on Aanya's row itself (waitForFunction, 8 s, { ms, timedOut }); a row missing after the wait is a named
    red in 2.6 ("no Aanya Mehra row to open: waited N ms, timed out" / "seen, then gone before the tap"), never a throw.
  The 24: Array.isArray(x) && before the first use, one guard per line, marked "// CE-47 ADS-2: K.words may answer
    null; guarded, a red not a throw". b185:48's info argument has its own guard. b187 builds r.text from the words, and
    three cells test it with NEGATIVE regexes (!/x/.test(null) passes), so r.text is null when the words are, and 3.3,
    3.4 and M1 read typeof r.text === 'string' first. A text scanner cannot see a derived value like that one.
b257 §5 reads the thirteen as text for four bare forms: 1 querySelector(…) chained into . [ or a call's argument;
  2 a const from querySelector used before a guard; 3 a querySelectorAll result indexed with no length guard and no
  guard on that element; 4 a K.words result used as an array with no guard before it in the same argument (FE-9's
  "|| [gone line]" fallback counts). Held both ways: the bare lines as found red by form (5.4, 5.11), the guarded reads
  stay green (5.5, 5.12), a line planted in a copy reds on its line (5.6 to 5.8, 5.13), the edges (5.9, 5.10).

F-44.418 (the kit): standing()'s four measuring cells (facts in two lines, full months, no "couple", 44 high) passed
with nothing to measure when no room drew. They now read drew && …, and say "nothing drew to measure". A room that drew
reads exactly as before. b257 §6 holds it in a real chromium against a local page server; M7 undoes it.

F-44.365 (the reaper): floor_reap.sh honours FLOOR_REAP_ONLY_PIDS, which admits only the listed pids (and their trees)
in either pass; unset, nothing changes. Cell 1.7 of b140 and of b140_v2 sets it to what it planted (the stand-ins and
the shell), so beside other benches it stops nobody else's server (witnessed: a bystander next dev in another folder
was stopped by 1.7 before, and lived after). 1.10 reads that the narrowing is a no-op unless set, gates both candidate
searches, and that no file the floor runs names it; held both ways inline and by M10.

F-44.370 (seen in this package's proof, cause NOT found): a fresh next dev in the seat's container sometimes answers
EVERY /vendor/* page 404 for its lifetime, with no compile (the middleware rewrites to /v2/vendor/…, then 404). A fresh
.next did not prevent it. The sign: one run where no room draws (with F-44.418, every measuring cell says so). The
handling: strike the run, keep its red row with its note, rerun.

F-44.419 (lesson 5) in b257: the kit mutations go through scripts/lib/mutation_guard.js (original kept and synced, then
the marker, then the mutation); the parent recovers or refuses at start; 9.0 checks free space (256 MB) before the first
write; 9.K kills a child mid-mutation with SIGKILL and recovers the kit by sha. NOT here, named for the chair: the kit's
own mutate() (used by the thirteen on product files) writes its mutation outside its try and checks no free space.

PROOF, every count read from the ledger files (proof/ledger_t3.tsv on 239fffb, proof/ledger_t4.tsv on 4572df0); base
is the tip, cut is the tip + cfe94b37 + this package; b183 is not run (cfe94b37's glass needs FE-9's app):
  on 4572df0 (58 rows): base against cut, quiet, b177 b178 b179 b180 b181 b182 b184 b185 b186 b187 b188 b189 b133
    b174 b206: IDENTICAL cell for cell; b257 18/0 -> 36/0. b257 under load: 20 of 20 at 36/0. Alone, whole: b140
    599 -> 601 and b140_v2 730/52 -> 732/52 (base reds, all 3.1), each IDENTICAL but for 1.10 and M10; b122_v2
    IDENTICAL (56/1, its base red 3.5).
  on 239fffb (260 rows), the same bytes but b257's §9: under load, 20 of 20 each: b179 22/0, b180 26/0, b181 23/0,
    b182 22/0, b185 28/0, b186 30/0, b187 26/0, b188 27/0 (run 17 F-44.370, struck, its row kept; run 21 green),
    b257 34/0, b140 and b140_v2 --source 10/0. The quiet and alone comparisons as on 4572df0 (b187's first cut run
    F-44.370, struck, rerun IDENTICAL). Live leftovers at 5 s: 0 on every row but one (s3 b179 4: one next or chromium
    process in the container, while the bench's own 9.2 found nothing it started still running).
