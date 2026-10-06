# repo: dreamos-pwa · base 0bebae2fd327 · TDW · CE-47 · INS · THE HUB CUT (app train 2, second) · HANDOVER r3

Cut at dreamos-pwa `0bebae2fd327` (app train 1), 6 October 2026. Rung **b222** (INS range b220-b229). No server change.

## r3 (the chair, 6 October): the Insurance line becomes the ruled "Kinds of cover, quotes from insurers, and saved
policies" (55 characters; R-45.20 holds). copy.ts, b122_v2 H_ROW and b222's copy move together, by label; every other
path byte-equal to r2.

## r2 (the chair, 6 October: app train 2's floor found three reds, all the hub cut's)
1. b126_igd1_meta_room_bench_v2 1.6 pinned eleven rows: AMENDED BY LABEL to twenty (exact). b126_v2 joins the package.
2. b140_v2 1.8 (every surface says what it connects to): the nine Coming cards had no connects line. Cured in
   pageHelp.ts, one home: COMING_CONNECTS = "Nothing connects here yet. It will when this room opens." b222 1.11 pins it.
3. b177 2 at 360: the Insurance line clipped. Shortened (r2); r3 carries the ruled words above. b122_v2 H_ROW and b222's copy re-pinned by label.
Changed from r1: v2/lib/solutions/copy.ts, v2/lib/worklist/pageHelp.ts, scripts/b222_ce47_hub_cut_bench.js,
scripts/b122_ce45_home_shelves_bench_v2.js, scripts/b126_igd1_meta_room_bench_v2.js (new to the package), this handover,
the manifest. Every other path byte-equal to r1. 30 paths.

## What it does
Nine Business Solutions rows ruled through the chair for three seats (OFF's Rebooking and follow-ups, Quotes, Off-season
shop; PRO's Brand collaborations, Supplies, Trend room, Business papers; INS's Payment links, Insurance), and the ONE new
group the chair allowed, "Run the business". Option A (the chair, 6 October): each row is in PREVIEW_KEYS and opens its own
shell screen at the address its room will land at: the room's name, its ruled line, and one statement row "Launching soon."
under the Coming chip, with no control. P3 holds by the founder's word (6 October, "let the tags stay as they are"): no chip
on any hub row. A seat landing its room replaces its page at the same address and removes its own key from PREVIEW_KEYS in
one edit; nothing else moves.

## Paths (29)
Modified (7): v2/lib/solutions/copy.ts (ROOM_ROWS, ROW_DESC, HUB_GROUPS) · v2/lib/solutions/routes.ts (nine *_HREF,
ROOM_HREFS, PREVIEW_KEYS) · v2/lib/worklist/icons.ts (one neutral drawing for the nine: Lucide square-dashed from the
estate's lucide-react v1.8.0, sha256 ff44388c…) · v2/lib/worklist/pageHelp.ts (nine "?" cards, accepted) ·
scripts/b122_ce45_home_shelves_bench_v2.js, scripts/b42_g11_wedding_pages_bench_v2.js, scripts/b40_worklist_shell_bench_v2.js
(each AMENDED BY LABEL at its site).
Added (22): v2/components/solutions/ComingRoom.tsx · v2/app/vendor/(shell)/{rebooking,quotes,payment-links,off-season-shop,
brands,supplies,trends,papers,insurance}/page.tsx · app/v2/vendor/(shell)/<same nine>/page.tsx (the doors) ·
scripts/b222_ce47_hub_cut_bench.js · this handover · scripts/floor-manifest-ce47-ins-hub-cut-pwa.txt.
The legacy layout (app/vendor, lib/) is untouched.

## Proofs (seat container)
tsc --noEmit clean. next build (webpack, Google Fonts mocked by a seat-only local() seam outside the tree): compiled, the
nine /v2/vendor/<slug> routes listed, exit 0. b222 74/0: 13 source cells, 6 production mutations each red on its cell, 54
glass cells (nine screens, Graphite and Chalk: name, ruled line, one statement under Coming, no control), dev server stopped
with its port free. Tree against a clean base (stash): b122_v2 green both; b69, b73, b184, d1_help_v2, d1_ce46_rooms_v2,
legacy b122 green both; b42_v2 the same 2 standing reds both (172/174); legacy b42 the same 1 standing red both (177/178);
b40_v2 the same 2 standing reds both (C50, C102), C31 green after its label amendment. Of the 41 benches that read the
touched files, 18 were run on base in the seat's container; the train's floor runs them all (the chair, 6 October).
