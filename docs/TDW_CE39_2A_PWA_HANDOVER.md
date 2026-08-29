# TDW · CE-39 STEP 2a · PWA TWIN — HANDOVER (ZIP 2 of 2)

**Base:** dreamos-pwa `c123926` (worklist), re-derived fetch-first at the cut · **sibling:** dream-os ZIP 1 (`852d385` base) lands first · **rulings:** CE-39 read-first ruling, veto, F-39.p5 ruling and the CUT ruling, chat record 2026-08-29.

## ATTRIBUTION (F-39.p5, ruled ARM (a))
Every byte in this ZIP was **authored by this seat in an earlier turn and re-verified after context loss**. The seat found its own sibling clone dirty, could not tell own-hand from other-hand, and reported it as second-hand work; the founder attested no second hand. Re-verification: every changed line re-derived to a ruling (R-39.6 · R-39.7 · veto bytes 1–2 · G-1 · G-2 · M-7's pwa half · C50 → []); nothing failed to re-derive, nothing reverted. `scripts/floor-manifest-ce39-2a.txt` is the instrument that makes this decidable next time: the list of every file this seat touched, travelling with the delivery.

## WHAT MOVED (all in `scripts/floor-manifest-ce39-2a.txt`)
- `lib/worklist/copy.ts` — `coutureGateLabel` 「Couture · Signature and Prestige」 · `coutureGateSentence` 「Couture is part of Signature and Prestige. Upgrade in Billing.」 · `coutureGateLinkWord` 「Billing」 (founder-vetoed 2026-08-29).
- `app/vendor/couture/screen.tsx` — the gate card reads the three keys; the link word is split out of the sentence and routed through `roomHref('billing')` (F-38.27's family, never a literal). The screen still reads the one boolean `couture_eligible`; the predicate is dream-os `me.js`'s (ZIP 1).
- `app/vendor/team-hub/screen.tsx` — `TeamHubScreen()` takes no `tier`; `locked` gone; the Prestige sentence DELETED. `app/vendor/team-hub/page.tsx`, `app/w/team/page.tsx` — call site follows.
- `app/vendor/studio/{team,tasks,team-payments}/page.tsx` — the `session.tier !== 'prestige'` return arm DELETED whole (sentence, its `<Header/>`, its Back button). Header still mounts in each page's live body.
- `lib/vendor/studioShared.tsx` — `Item.locked`, `Row`'s locked arm and its 「Prestige」 pill, and `isPrestige` RETIRED with their readers (G-2).
- `lib/worklist/rooms.ts` — Header mount census for the three studio pages: tasks 2→1, team-payments 2→1, team 1→0 (the gate's mount left with the gate).
- `scripts/b40_worklist_shell_bench.js` — `REAL_NAME_HELD = []` (C50 now fails if a held path reappears) · **C58** no tier gates the Studio Suite (pages, screen, shared row; `isPrestige` has no reader anywhere) · **C59** the Couture gate reads its bytes from copy.ts and routes Billing through `roomHref`.
- `docs/COPY_REGISTER_M-FINISH.md` §10 — the four bytes, the four deletions, and the closed plan-card sweep: **zero** Prestige-only Studio bytes across `copy.ts`, `app/w/billing/page.tsx`, `SubscriptionCard.tsx`, `BillingRoom.tsx`, `lib/vendor/billing/plans.ts` (comments stripped).

## PROOF
`npx tsc --noEmit` exit 0 · `b40_worklist_shell_bench` 54 GREEN / 0 RED (C50, C58, C59 green) · pwa floor SET pasted beneath the ZIP, run after the dream-os floor, never concurrently (s6).

## CONTROLS
Studio rows on `/w/team`: MOVED gated → open. Couture gate arm: KEPT, new server-side predicate. Studio-page Back buttons: REMOVED with their gate arms.

## INHERITED BY NAME
**F-39.p4** — `STUDIO_ITEMS` hrefs are `/vendor/studio/team|tasks|team-payments`; every tier now follows them out of `/w/team` into the old layout (F-38.1 two-mastheads shape) until the three studio screens get `/w/` homes. The 2c seat inherits this by name.
