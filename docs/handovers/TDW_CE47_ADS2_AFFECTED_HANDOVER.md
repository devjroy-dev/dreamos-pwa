# TDW · CE-47 · ADS-2 · THE AFFECTED-ONLY CHECK, THE TRAIN, THE DAILY FLOOR · dreamos-pwa scripts only

The founder: a 2.5-hour floor per landing is too slow. Ruled (CE-47, 3 Oct 2026): packages ready together land as ONE
train on one check, pushed as separate commits; each landing runs an AFFECTED check; the whole floor runs once a day.

scripts/lib/floor_affected.mjs: the selection. T = the delivered paths plus every app file that imports one (one
level). A browser member (puppeteer, chromium, the b126 dev server or next dev, in its source or any scripts/lib file it
pulls in) RUNS when it names a path in T: the path, without extension, '@/'+that, or an app page's route. Every
no-browser member, every member that WALKS app/, components/, lib/ or v2/ (e-269), and every .proof.ts wrapper RUNS.
Each RUN and SKIP carries its why.
scripts/run-floor.sh --affected <manifest> [<manifest> ...]: 30 lines added, nothing else changed, so a normal floor
runs as before. The union of the manifests is the delivery (dirt, F-19.16, slices unchanged); next build --webpack first
(STOP on failure; kept across --resume); the selection printed whole; an unselected member is passed over before any
ledger line; the named base is CUT to the members that ran; the same two verdict lines.
scripts/train.sh: apply <spec> (every ZIP's sha; refuses a package without its manifest, a path in two packages, a
quote in a commit message; unpacks in order; git add -N for added files; the dirty set must equal the union of the
manifests, plain and -uall; prints the one --affected check) and commit <spec> (one commit per package, each staging
exactly its own manifest's paths, then ONE push). The train's own ZIPs and spec are not counted as dirt (*.zip is
ignored in this repo).
THE PROOF THAT IT NEVER SKIPS WHAT IT MUST, seven cases: L1/DESIGN-1 cut A (8 floor reds, all selected); FE-7 L4 (both
real faults selected); FE-8 combined (9, all selected); ADS-2 app (b174 selected; b179, b83 skipped, green alone); FE-8
S1 (b87 skipped, green alone); ADM-1 cut 2 (tdw14_f1410_fab_clamp selected); the train of 3 Oct (b172 by e-269,
fe9_f44271, both b122, all selected).
PROOF: b206 28/0 (the selection both ways, the runner's own base-cut code, train.sh on a throwaway repo, M1 to M7).
The end-to-end run of --affected in the seat's container passed its build gate and selection (180 run, 33 skipped,
each with its why) and kept its ledger; its members were not run to the end there (fonts unreachable to next dev in the
container). The first real train on the founder's Codespace is the end-to-end proof.
