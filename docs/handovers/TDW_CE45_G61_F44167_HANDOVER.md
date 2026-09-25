# TDW · CE-45 · G6-1 · F-44.167 · THE REVALIDATE DOOR · HANDOVER · dreamos-pwa

Cures **F-44.167** (the seat's e-131), and with it **F-44.155** as walked: the founder switched back to "Your TDW agent
answers" and his public page still sent couples to his own number (FE2b_1's walk, W4, 14:43:56 to 14:44:55 IST).

## The cause

`app/api/revalidate/storefront/route.ts` (b9872676, 6 September, R-G31.7) asks GET /api/v2/vendor/me who the caller is and
read `j.vendor.routing_handle`. The door answers the handle as `handle` (dream-os me.js, since 457c5b5, 19 May). Finding no
handle, the route answered `{ ok: true, revalidated: false }` and rebuilt nothing, from the day it was built: this row, the
storefront's date-check switch (F-40.187, its own case) and the website toggle all waited out `revalidate = 300`. No rung
drove it against /me's real answer: b40 reads its source; b125 counted that the row calls it.

## What changed

- `route.ts`: `const h = j?.vendor?.handle ?? j?.vendor?.routing_handle;` with its reason. Nothing else.
- `scripts/b127_g61_revalidate_door_bench.js` (new, rung b127): the REAL handler compiled from route.ts, only
  NextResponse.json and revalidatePath stood in for; fetch answers /me with the key READ FROM dream-os me.js in the sibling
  clone, so it reddens if either side changes the key again.
- `scripts/b125` and its probe: the door is no longer stood in for. Its request goes to the real route in `next dev`; the
  route's server-side /me call reaches a tiny /me server run as its own process (the probe's spawnSync blocks the bench's
  own event loop); the door's answer is read inside the page. Both ports are proven free before and quiet after (F-44.163,
  cured for b125: its next-server could outlive it on 3992).
- **F44167_1b (e-135, A-45.10):** b125's port reads (its 2.0 and 2.0b guards and its teardown's kill-by-port) read
  `/proc/net/tcp` only; the founder's Codespace listens on `tcp6`, so 2.0 called a running /me server absent (his block 2,
  25 September) and the teardown could leave its servers running. They now read tcp AND tcp6, the port from the last
  colon. The product code is unchanged from F44167_1.

## Proof

- tsc clean (A-45.5). **b127: 11 pass, 0 fail**: her session rebuilds /v/dev440 and the door answers revalidated: true;
  her own Authorization, no-store; no session, a refused token, an unreachable /me, no handle: nothing rebuilt; the
  routing_handle fallback; M1 (the pre-cure read) reddens 2.1.
- **b125: 37 pass, 0 fail**: new 3.3d (both themes) and 3.4d, the REAL door answering revalidated: true on the confirm and
  on the withdrawal; 2.0 and 2.0b, both ports free before; nothing left listening after.
- **The differential, on f08df476** (every bench reading the door, b125 or b127, and b120 beside it): b40 identical cell by
  cell on both sides (its pre-existing C50 and C102); b120 0 and 0; b125 0 and 0 (32 cells at base, where the door was
  stood in for and could not be seen dead; 37 cured); b127 new and green. Work stashed and restored by sha (0 mismatches).
- **The floor, on f08df476:** FLOOR = NAMED BASE, no delta (40, set-equal to run-floor.sh's printed base), 139 members,
  b123 declared (A-45.4, the cap), 0 refused, undeclared dirt 0 by the runner's -uall rule, declared contents unmoved.
  IGD-1's b126 ran out of a slice's time once, left number/page.tsx mutated, was restored by checkout at once (A-45.4),
  and passed alone, 48/48 in 169 s.

## The walk

Settings, "You answer on your number", his number, confirm; then "Your TDW agent answers"; a fresh load of /v/dev440 within a
minute shows TDW's line with "TDW-DEV440". The storefront's date-check switch the same way: off, and a fresh load of his
page within a minute no longer shows the date check.
