# TDW · CE-46 · ADS-1 · CUT 1 (dreamos-pwa) · HANDOVER · 28 September 2026

## WHAT SHIPS
The Ads page and the Posts room's Ads card (R-46.10 to R-46.14). Base `22e471cf` (cut1c: carried from `dc8dbdd1` after WEB-1 cut 1 and FE-4 landed).
- `app/vendor/(shell)/posts/ads/page.tsx`: the connect (a pre-minted link; the iPhone line in iOS standalone, F-44.235);
  the three gaps, each tap opening Meta's own screen, the re-read by itself on return; the draft's first screen (the
  one-sentence why, the post WHOLE at its own aspect and narrower when space is short, "Sponsored" on its own line, four
  rows with Change, Run 44 px above the Ask bar at 374); All settings, one question at a time with the answer marked and
  Meta's own lists; the confirm sheet echoing every setting; Your ads and each ad's sheet. Shut or not configured
  (R-46.14): the page opens with its words and the action reads "Coming soon", disabled; no ads request leaves but the
  state read.
- `components/worklist/AdsCard.tsx`: always renders; one sentence for the state; "Open Ads".
- `lib/worklist/ads.ts`: the ONE home of every word (approved lines, the q block, the number shapes, "Coming soon").
- `lib/worklist/adsWire.ts`: wire shapes and pure formatters; META_SCREENS (checked on the walk).
- `lib/solutions/routes.ts`: ADS_API_PATH and the doors. `app/vendor/(shell)/posts/page.tsx`: the card mounted between
  Cards and Broadcast.

## CUT1C (carried onto 22e471cf, 28 September 2026)
- FE-4's notes: `ADS_HREF` in `lib/solutions/routes.ts` (the page and the card read POSTS_HREF and ADS_HREF; no address typed
  twice); the shell draws the room name (`title={ADS.card.label}`, no h1 of its own); the "?" entry in `lib/worklist/pageHelp.ts`
  keyed by ADS_HREF, line 1 READ from ROW_DESC.posts (b140 1.2: typed line 1s stay four), the three accepted lines as its
  "can" lines (ADS_HELP, their one home). FE-4's words cut lands after this one and may reshape the entry to its final
  "what it does, how to do it, where it connects" form.
- The first screen, ruled (a): the post WHOLE on the left at a fixed 120 px width (its own aspect; a 2:3 post is 180 tall),
  the one sentence beside it, then the four rows and Run. The fit loop is gone. b143 2.1 pins Run 44 px clear of the Ask bar
  AND the post at least 120 px wide; M2 and M3 re-aimed (the post too wide; the picture squeezed to a fixed height).
- Two straight apostrophes this carry first added inside the page's CSS template literal (comments there are shipped bytes
  to b40 C102) were reworded; b40's red set is identical to 22e471cf's own (C50, C102 at +13).

## CUT1D (the floor of cut1c read cell by cell, 28 September 2026)
- The cut1c floor read "FLOOR = NAMED BASE, no delta", but the floor counts benches, and two base-red benches carried a NEW
  failing cell each: b42 "no address in API is without a caller, orphaned: adsDisconnect" (173/174 at the tip, 172/174 with
  the cut) and tdw_f0774_readers §2.3c (65 readers stripping outside the home at the tip, 66 with the cut: b143's own regex).
- Cured: the page draws the approved "Disconnect ad account" (ADS.disconnect) calling API.adsDisconnect, and returns to the
  connect; b143 3.7 pins it. b143 strips ads.ts through scripts/lib/stripComments.cjs. b42 back to 173/174; §2.3c back to 65.
- Twenty base-red benches that read the tree broadly were diffed cell by cell, cut against bare tip: identical after the cure.

## PROVEN
- b143 60/0 in the real app (next dev, doors stubbed at the network, 374 x 812, Graphite and Chalk): every state
  including shut; the fold; the aspect within 1 percent; the frame no wider than the picture; "Sponsored" on its own line;
  the echo sent unchanged; the card's two lines; every rendered word from ads.ts. Five production mutations red,
  restored by sha. The dev server stopped, port free.
- tsc (project) exit 0; eslint on every touched file exit 0; b134 183/183.
- b40's two reds (C50, C102) are the tip's, identical with this cut stashed; b123 and b133 to be run uncapped at the floor.

## THE PHOTOGRAPH
b143's post is `scripts/fixtures/b143_portrait.jpeg`: Pexels photo 2058070 by the contributor "sadman", downloaded by the
founder on pexels.com with Pexels' own Download button (the file arrived named pexels-sadman-2058070.jpg), resized to
1080 x 1620 at its own aspect. Its sidecar `b143_portrait.jpeg.source.txt` records the page, the licence, the original's
size and sha256, the resize, and how it was matched: by the file's own Pexels name, not by a visual search. The three
pictures first sent were saved from Google Images results (the founder's words); their owners are unknown and none of them
is in the tree. `B143_PHOTO` still overrides the default. `B143_PART=states|mutations` splits one run in two for a short
shell; the floor runs it whole. A run killed mid-mutation restores the file (SIGTERM, SIGINT, SIGHUP, exit).

## OPEN, NAMED
- The shell's Ask bar placeholder carries a dash (FE-4's).
- FE-4's pageHelp entry for /vendor/posts/ads: the three "?" lines, through the chair.
