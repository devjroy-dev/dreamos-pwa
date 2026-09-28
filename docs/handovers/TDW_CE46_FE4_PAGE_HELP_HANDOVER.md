# TDW · CE-46 · FE-4 · THE "?" ON EVERY SURFACE · HANDOVER

Seat: FE-4, executor. Chair: CE-46. Repo: dreamos-pwa. Rung: b140. Findings F-44.218 to F-44.221. Errors e-211 to e-214.
Built at dc8dbdd1 (FE-3's Ask TDW sheet), carried once onto 423d67cd (WEB-1 cut 1, b145); no path overlaps.

## 1 · What the founder ruled, and what shipped

The founder's ruling of 27 September 2026: every surface of the vendor app carries a "?" and the tip carousel is retired. His two design
decisions: the "?" sits on the line of the room's name, and the card does not run edge to edge. His one change to the in-app mock: the card
sits at the CENTRE of the screen, not anchored to the bottom.

The chair's forks, ruled 27 September: A (3) the shell draws every room's t1 head with the "?" on its line, one home, one mount above
{children}; B (1) the first-visit dot in localStorage, one key per pathname, read in an effect after mount, the per-phone key ruled outside
§8's native clause as the mode's own key is (stated at the site); C (1) content-fit, max-height 60dvh, inner scroll, centred; D (1) "Ask TDW
about this" prefills the room's name in the sheet and sends nothing (F-04.9); E (3) the Rooms card carries one extra sentence about the app
(held with lines 2 to 4); F the controls in .wl-cardaction, sentence case (F5); G keyed by pathname, the replies page by its pattern.

Shipped:
- components/worklist/PageHelp.tsx (new): RoomHead (the h1 data-room-title, the shell's own title byte at t1, 16px above, the "?" as a 44px
  target on its line at the right edge, a thin circle in ink-mute with the glyph at t4, the dot in accent ink), the card (a modal dialog on
  the scrim, vertically centred, inset one gutter each side, t2 name, t3 line 1, t3 lines with 18px line icons in accent ink, t4 connects in
  ink-mute, two .wl-cardaction controls; Escape, the scrim and Got it close it, focus returns to the "?"), RoomHeadProvider and
  RoomHeadTitle (F-44.219).
- lib/worklist/pageHelp.ts (new): one entry per drawing route (33). Line 1 is READ from ROOM_DESC (lib/worklist/copy.ts) and ROW_DESC
  (lib/solutions/copy.ts), typed only for Rooms, Today, Exchange and the Collab replies page. Every address is READ from its one home
  (roomHref from the registry; the solutions rooms' HREFs from lib/solutions/routes.ts); only Rooms, Today and the replies pattern are typed.
- WorklistShell.tsx mounts <RoomHeadProvider><main><RoomHead title={title} />{children}</main></RoomHeadProvider>.
- lib/worklist/copy.ts: helpAria, helpClose, helpAsk ("Ask TDW about this"), helpGotIt ("Got it"), helpAskPrefill.
- The ten rooms' own title h1s retired at their four homes: SliceShell.tsx (and ROOM_NAME), notes/body.tsx (and NOTES_NAME), .sol-title in
  packages, dates and number and the five OwnNumberFlow states (and the rule in SolutionsPieces), the Advisor's wl-advtitle.
- The tip carousel deleted (components/vendor/TipsCarousel.tsx) with its mount and dead tipsOpen state in Header.tsx. Nothing had set
  tipsOpen true since the Tips row left the drawer: the carousel was already unreachable.

LINES 2 TO 4 ARE HELD. Every `can` is empty and every `connects` is '' until the founder's words come through the chair; the card draws
line 1 only. The proposed table sits in the read-first. His words land in lib/worklist/pageHelp.ts and nowhere else, as a docs-and-copy cut.

## 2 · Findings

- F-44.218 (class, CURED by this cut): 23 surfaces drew no t1 room name in the body (billing, books, calendar, collab, the collab replies
  page, contracts, couture, exchange, google-reviews, introductions, payment-reminders, portfolio, posts, referrals, rooms, settings,
  storefront, support, tds, team, today, wedding-pages, your-website). The shell's head now draws one on every surface.
- F-44.219 (RULED 28 Sept, BUILT AS RULED): three surfaces already carried a t1. The TWO EXCEPTIONS: on Calendar the month IS the head
  (RoomHeadTitle line={MONTHS[month]}, the t1 div between the arrows retired), on Today the status line IS the head (not-live, first-run,
  "All clear." on the resting day; null in the working and unsettled states, R-39.13, where the head is the "?" alone); the room's name stays
  the shell's t5 label on both. Why: each line was already that page's one t1 by an earlier ruling (his "2"; R-38.4), and one t1 per page
  holds. On Billing the price steps t1 to t2 beneath the "Billing" head, as TYPE_1b option B did for the money rooms.
- F-44.220 (filed, excused by exact text in b140 2.2): app/vendor/(shell)/contracts/screen.tsx:774, the empty state "No agreements yet."
  typed at 24px Cormorant, a second t1 on Contracts. Espresso-era chrome; not this cut's to re-dress.
- F-44.221 (filed, excused by exact text in b140 2.2): app/vendor/(shell)/collab/[post_id]/responses/screen.tsx:222, the page's own <h1>
  "Interested vendors" at 25px italic (off the rungs, italic against the rung law) under a back arrow the shell already provides; a second h1.

## 3 · A-46.6, which rides this cut

scripts/lib/floor_reap.sh: before the first member the floor stops ANY next dev or next-server, whatever its root, by program name and pid,
and prints one REAPED line naming each pid, its root and its command. After a member it stays this root; the LEAK line keeps its sealed shape.
Why WEB-1's server survived: the reaper proved a root only by /proc/<pid>/cwd and walked children with GNU ps --ppid, and the founder's Mac has
neither. It now reads the root by lsof where /proc is absent and walks children from ps -A. run-floor.sh carries the label at the call.
b133 15/15; b140 1.7 drives it and M7 reddens it. Kept as built: each Codespace holds one repo.

## 4 · Benches

b140 (new): §1 source (7 cells: the route set derived from the tree, line 1 read, the one drawer and the two exception mounts, the carousel
gone, the dot's effect and the §8 statement, no byte typed in PageHelp.tsx, A-46.6 driven), §2 on glass on all 33 routes (the head, the
"?", the dot both ways, the card's content per route, centred and inset, Got it and focus; scrim, Escape and the sheet prefill on the five
full-depth rooms leads, dates, billing, calendar, today, in both themes), §3 the rung law on the card, §4 M1 to M7 each restored by sha.
Its stand-in answers seven doors b123's never did, each with the shape its dream-os route returns, cited by file:line at the site.

Re-aimed by label (A-45.2): b123 1.8, 3.1, 3.2, 3.3, 3.4 and its probe (the "?" is the first aria-expanded button); b126 1.9, 3.r404 and its
probe; b77 §1 to §7 with M2, M5, M7, M16 retired by name; bs_audit C18; b40 C34, C68, C74 (Today's gates where F-44.219 put them);
b59 re-pinned 114 to 110 (the carousel's four literals, by set difference at the site); b122 5.3 and tdw_stripper_census.mjs (a file deleted
under A-45.1 is listed by ls-files but absent between blocks 1 and 3; the census's ENOENT had turned tdw_f3942_census_guard into a FALSE
GREEN). Retired whole: tdw09_uivendor.proof.mjs (read the carousel by path), its RED line dropped from run-floor.sh's named base (40 to 39).
tdw09_money's discharged list annotated, not edited; the ce40 palette manifest line kept as history.

## 5 · The differential and two law candidates

75 readers, tree against base, every row equal after the cures; where both sides are red the failing lines were compared, not only the exit
codes. LAW CANDIDATE 1 (e-213): derive readers by name AND run every readdirSync walker, since a walker reads every NEW file (it found b42 and
b59). LAW CANDIDATE 2 (e-214): run the differential and the floor in the BETWEEN-BLOCKS state (deletions gone from the tree, still in the
index), the state block 2 actually meets (it found b122 and the census's false green).

## 6 · The episode, in three lines

Found 28 Sept: five paths and two hunks in this seat's tree that this seat did not write, mtimes 27 Sept 18:46 to 18:57 UTC, plus later in
b123:178 and in b140's bench and probe. Written by a parallel branch of this same chat (an edited or regenerated message); no second person.
Disposition: discarded by hunk, F-44.219 built as ruled, every trace swept by its marks and rewritten as this seat's own; A-46.5 stands from it.

## 7 · Errors

e-211 and e-212: a pkill or pgrep -f matched this shell's own command line and ended it mid-step; nothing half-written (re-read, re-run).
Cure adopted: find processes by name (ps comm), kill by pid. e-213 and e-214: the two derivation gaps in §5.
e-215: block 1's verify ran tsc without A-45.5's rm -rf .next/dev; a generated .next/dev/types/validator.ts from an earlier next dev
in the founder's Codespace failed tsc. My test of block 1 used a fresh clone with no .next: it proved the bytes, not the machine.
e-216: block 2 omitted A-46.4 (env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY). Both corrected in the founder's lines.
e-217: on the founder's Codespace (Node v24.14.0) a plain node process reads comm=MainThread, so the reaper's program-name test skipped
b140 1.7's stand-in (and would skip a real server's `node .../next dev` parent). Reproduced here with Node 24.14.0; the reaper now admits
MainThread only when /proc/<pid>/exe is a node binary; b140 1.7 plants a Node 24 stand-in when B140_NODE24 names one, and reddens with the
MainThread arm removed. This was latent in A-45.13's after-member pass too, on any Node 24 machine.
Also: a generator in the walker list (tools/tdw09_vendor_census.mjs) rewrote the tracked census json; caught by the manifest check, restored.

## 8 · Housekeeping

Worktrees made and removed with git worktree remove: /home/claude/pwa-base (the differential's base), /home/claude/pwa-base2 (the census
guard read at 423d67cd), and b123's own ~/.b123-base-4aaad4d378c4, recreated when the first floor started b123 and left by that floor's stop;
identified by git worktree list --porcelain and removed before the fresh floor. Node servers reaped by pid throughout.

## 9 · The floor (A-46.2, gated slices; C-44.1: this file was an empty placeholder while it ran)

Floor 20260928T124500Z-423d67cd-151, under --delivery with scripts/floor-manifest-ce46-fe4-page-help.txt (37 paths, all declared), in the
between-blocks state (the two deletions gone from the tree, still in the index). No REAPED line: nothing was running before it. It died with a
turn at 13 members and was resumed once with --resume /tmp/tdw-floor-pwa on an unmoved tree (35 of 35 recorded paths matched by sha256).
Result: 39 red, EXACTLY the named base of 39 (40 before this cut; tdw09_uivendor retired whole). No new red, none cured. One LEAK named by
the runner, not this cut's: b125_g61_enquiry_row_bench left a next dev running in the root; stopped, whole tree.
b140 on the carried tree: 543 pass, 0 fail, with M1 to M7.

## 10 · What the next sitting picks up

The founder's words for lines 2 to 4 (and Rooms' app sentence), landing in lib/worklist/pageHelp.ts only, as a docs-and-copy cut.
F-44.220 and F-44.221 when TYPE_5 reaches Contracts and the Collab replies page. The chair's queued switchboard package (c-46.18).
