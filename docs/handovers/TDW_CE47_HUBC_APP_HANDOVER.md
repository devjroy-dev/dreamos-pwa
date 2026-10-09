# TDW · CE-47 · CLB PART C APP · Her packages as cards in her Instagram messages · handover

Base: dreamos-pwa 0038eb41 (app train 7, with HUB-2d). Server: HUBC_SRV_1 (after server train 16) serves the door. Against a server without it, the door answers 404 and the room is exactly as before. For the app train after 8. Seat: CLB.

## What she gets
In the room "WhatsApp and Instagram" (/vendor/number), after "Instagram messages", one new section, "Package cards in Instagram", in both trees (classic and v2):
- **The server's line** for her state, word for word (R-47.1; the app types none of these sentences).
- **A preview of her cards**, as her client sees them after tapping "See packages": the picture on top, the package name, the price line ("From Rs <amount>", when her website shows prices), and "See details". At most 10, in her order. The row scrolls inside itself; the page never scrolls sideways. Nothing in a card is a control.
- **One switch**: Turn off while her choice is on; Turn on while it is off. Nothing before her Instagram is connected (the section above carries Connect Instagram).
- With no packages: **Add a package** opens her packages room. When Instagram refused the starter: **Try again** asks the server again.
- **Dark until the feature is open to her**: the server answers 404 (not yet approved by Meta and not on clb.testers), and the section is not drawn. A malformed answer is dark too.

## The rulings this carries (the chair, 8 Oct 2026)
| Ruling | Where it is held |
|---|---|
| Her choice is on unless she turns it off; live by itself on Meta's grant | Server (0221, featureGate). The app draws only what the door says, and the switch posts `{ on }` (b289p 2.6, 4.cOn, 4.cOff). |
| A held picture is never sent | Server (pictureOnPage). The app draws a picture only from an https address the server sent (b289p 1.3, 2.8, 4.cBadPic). |
| "From Rs <amount>" in Indian commas, only when her website shows prices | Server's subtitle, drawn as sent (b289p 4.cOn). |
| "See details" goes to her site | Drawn in the preview, not tappable here (b289p 2.5). |

## R-47.1: every new line
| Who reads it | Where | Old line | New line |
|---|---|---|---|
| She | A switch or Try again that did not go through | | Your change was not saved. Please try again. |
| She | Each state's line | | The server's sentence, word for word (the table is in the server handover, TDW_CE47_HUBC_SRV_HANDOVER.md). |

**Labels** (held to SIMPLE and EASY): Package cards in Instagram (the heading), Your package cards (the cards' spoken name), Add a package, Try again. Turn on and Turn off are the room's own (C6 and C13, unchanged).

## Files
- ADDED `lib/vendor/igPackageCardsDoor.ts`: the door, pure (one home for both trees, as metaRoomDoor.ts is).
- ADDED `v2/components/solutions/IgPackageCards.tsx` and `components/solutions/IgPackageCards.tsx`: the section; the same bytes but their imports.
- CHANGED `v2/components/solutions/MetaRoomSections.tsx` and `components/solutions/MetaRoomSections.tsx`: the section mounted after "Instagram messages".
- CHANGED `v2/lib/worklist/metaRoom.ts` and `lib/worklist/metaRoom.ts`: the words, in a new `IG_CARDS` (IG, SECTIONS and QUIET are untouched, so b126's pins stand).
- CHANGED `v2/lib/solutions/routes.ts` and `lib/solutions/routes.ts`: `instagramPackageCards`.
- ADDED `scripts/b289p_clb_c_ig_package_cards_app_bench.js` and `scripts/lib/b289p_cards_probe.mjs`:
  - §1 the door, §2 the source in both trees, §3 the words.
  - §4 the room on glass: v2 in both themes, classic in dark.
  - §5 M1 to M7 in child runs; G1 and G2 on glass. All through scripts/lib/mutation_guard.js.
- ADDED `scripts/floor-manifest-ce47-hubc-app.txt`, this handover, and `docs/handovers/b289p_ledger_HUBC.txt`.
- No bench is amended.

## Proof (on 0038eb41; each run its own log; floor lines under env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY)
- b289p, alone, in the main checkout on a fresh .next: 55/0.
  - §1 to §3, and §4 on glass: v2 in both themes (eleven states each) and classic in dark (four).
  - G1 and G2 each redden 4.cOn and are green again after the restore.
  - M1 to M7 each redden their named cell, restored by sha; nothing left pending (5.9).
  - The glass runs in the main checkout because next dev (Turbopack) refuses a node_modules that is a link out of the tree.
- b289p (B289P_NO_GLASS=1) ran 20 times under load (b59_v2 and ce41_e2i looping): 20 green. The ledger is docs/handovers/b289p_ledger_HUBC.txt.
- tsc --noEmit is clean. eslint is clean on every changed app file. The two MetaRoomSections files carry one eslint error each (react-hooks/set-state-in-effect in QuietTimeRow); it is on 0038eb41 too, at the same line less one, and this package does not touch it.
- Lesson 1 and the e-276 walkers.
  - Static, head against a clean 0038eb41, red by red:
    - Red on both sides, the same list: b40 v1 and b40_v2 (C50 and C102), b42 v1 and b42_v2, b82_v2, ce41_e2ivb.
    - Green on both sides: b256, fe9, b57 v1 and v2, b69, b74, b75, b76 (both), b78, b80 v1 and v2, b81 v1 and v2, b82 v1, b285, b59, b59_v2, ce41_brand_family, ce41_e2i, ce41_e2ia, d1_help_v2.
  - In the browser, one at a time, in the main checkout with this package, all green:
    - b126 v1 and b126_v2 (the room's own benches; their pins stand), b120, b151, b122 v1 and b122_v2.
    - b140 v1, b222, b223, b73, b184, b177, b281, b291, ce41_e2iia and ce41_e2iv.
- b140_v2, strictly alone and narrowed to /vendor/number: 24/1. The 1 is 3.1, as before (the real faces cannot load here).
- The main checkout was put back after each run: `git status --porcelain` empty.
