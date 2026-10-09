# TDW · CE-47 · HUB-2c APP · Her call's replies: the people from outside TDW · handover

Base: dreamos-pwa 96fa4e06 (app train 8). App only: the server door is HUB-2b's, already on dream-os main. Rides app train 9. Seat: CLB.

## What she gets
On her call's replies page (/vendor/collab/<call>/responses), in both trees:
- **The heading reads "Interested"**, because the page now lists people who are not vendors.
- **Her TDW replies show first**, exactly as before: Connect, the connected line, Settle.
- **Under them, "From outside TDW"**, with the people who answered her call on Instagram or Threads. Each row shows:
  - the name;
  - a chip, "From Instagram" or "From Threads";
  - the day they answered;
  - one line saying where to answer them, for example "They answered your call on Instagram. Reply to them there."

  The server sends no handle or number for these people, so the line tells her where to go. A row carries no mark and no button.
- **A partner's suggestion is kept in a slot and not drawn yet.** PTN's PartnerInterestRow.tsx will draw it, with the partner mark and its tap card (the chair, 9 Oct 2026). It arrives in PTN's A2-1 app part 2, and wiring it in is a re-cut of one function.
- **When her rows or the partners cannot be read**, the server's sentence shows word for word under her TDW replies.
- **"No one has answered this call yet."** shows only when there is no TDW reply, no row from outside and no such sentence.
- A row whose name holds a phone number or an email is never drawn, whatever the server sends.
- Against a server without HUB-2b, the page is as before, with the new heading and empty line.

## The rulings this carries (the chair, 9 Oct 2026)
| Ruling | Where it is held |
|---|---|
| Instagram and Threads rows carry no mark | b289q 2.6, 4.rMix, M6 |
| The partner mark's tap card is PTN's row; words in one home | The slot (b289q 2.5, 4.rMix, M3) |
| App only; collab.js :461 is WEB-4 cut 30's | No server file in this package |

## R-47.1: every line (the founder's words, 9 Oct 2026)
| Where | Old line | New line |
|---|---|---|
| The page's heading (a label) | Interested vendors | Interested |
| Nobody has answered | No responses yet. | No one has answered this call yet. |
| Above the rows from outside (a label) | | From outside TDW |
| An Instagram row | | They answered your call on Instagram. Reply to them there. |
| A Threads row | | They answered your call on Threads. Reply to them there. |
| The row's chip (labels) | | From Instagram / From Threads |
| Her rows or the partners could not be read | | The server's sentence, word for word (HUB-2b) |

The day on a row is a label ("8 Oct"), in India's time. "Loading…" stays as it was.

## Files
- ADDED `lib/vendor/callOutside.ts`: the door's `outside` half and the words, pure (one home for both trees).
- ADDED `v2/components/vendor/CallOutsideReplies.tsx` and `components/vendor/CallOutsideReplies.tsx`: the section, the same bytes in both trees, with the partner slot.
- CHANGED `v2/app/vendor/(shell)/collab/[post_id]/responses/screen.tsx` and `app/vendor/(shell)/collab/[post_id]/responses/screen.tsx`:
  - the door's `outside` is kept;
  - the section is drawn after her TDW replies;
  - the heading and the empty line are the founder's words.
- CHANGED `scripts/b140_ce46_fe4_page_help_bench.js` and `scripts/b140_ce46_fe4_page_help_bench_v2.js`: **amended by label, one string each.** 2.2 excuses the page's own h1 by its exact text (F-44.221), which is now "Interested" (was "Interested vendors"). No cell moves.
- ADDED `scripts/b289q_hub2c_call_replies_app_bench.js` and `scripts/lib/b289q_replies_probe.mjs`:
  - §1 the door, §2 the source in both trees, §3 the words.
  - §4 the page on glass: v2 in both themes (six states), classic in dark (three).
  - §5 M1 to M6 in child runs; G1 and G2 on glass. All through scripts/lib/mutation_guard.js.
- ADDED `scripts/floor-manifest-ce47-hub2c-app.txt`, this handover, and `docs/handovers/b289q_ledger_HUB2C.txt`.

## Proof (on 96fa4e06; each run its own log; floor lines under env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY)
- b289q, alone, in the main checkout on a fresh .next: 42/0.
  - §1 to §3, and §4 on glass: v2 in both themes (six states each) and classic in dark (three).
  - G1 and G2 each redden their cell and are green again after the restore.
  - M1 to M6 each redden their named cell, restored by sha; nothing left pending (5.9).
- b289q (B289Q_NO_GLASS=1) ran 20 times under load (b59_v2 and ce41_e2i looping): 20 green. The ledger is docs/handovers/b289q_ledger_HUB2C.txt.
- tsc --noEmit is clean. eslint has no error on any changed or added app file. Both replies screens keep their two warnings from 96fa4e06 (an unused `fmt`, and `<img>`), the same as before.
- Lesson 1 and the e-276 walkers:
  - Only b140 (both) names a touched path. It is amended by label, one string each (see Files).
  - Static, head against a clean 96fa4e06, red by red:
    - Red on both sides, the same list: b40 v1 and b40_v2 (C50 and C102), ce41_e2ivb.
    - Green on both sides: b59, b59_v2, b75, ce41_brand_family, ce41_e2i, ce41_e2ia, d1_help_v2, b285, b289p (no glass).
  - In the browser, one at a time, in the main checkout with this package, all green:
    - b140 v1, b190, b222, b184, b177, b73, b281, b122_v2, b126_v2, ce41_e2iia and ce41_e2iv.
    - b291: green alone (65/0) with this package and on a clean 96fa4e06. One earlier run in the long series timed out on /partner/p/modelconnect.in, a page this package does not touch, waiting 120 s for its first compile. That run is struck.
- b140_v2, strictly alone and narrowed to /vendor/collab/p1/responses: 24/1. The 1 is 3.1, the known one (the real faces cannot load here). 2.2, with its amended string, is green.
- The main checkout was put back after each run: `git status --porcelain` empty.
