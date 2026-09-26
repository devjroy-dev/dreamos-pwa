# TDW · CE-45 · G6-1 · F-44.166 (and F-44.172's byte) · HANDOVER · dreamos-pwa

## F-44.166 · Settings scrolled only in its lower half

The founder, 25 September 13:42 IST, at 374 px on /vendor/settings: "Settings panel only scrollable bottom half. ui nightmare".

**Measured (real Chromium, the shell, 374 x 900):** exactly one element scrolled, the region at
`components/vendor/SettingsScreen.tsx` :219 (`overflow: hidden visible`, computed `overflow-y: auto`): 89 px tall over
1,359 px of settings, its top at 691 px. The document did not scroll; the shell's page scroller, `main.wl-main`, never did.
**Why:** CSS computes a `visible` axis as `auto` when the other axis is not `visible`, so :219's `overflowX: 'hidden'` made it
a scroller in the shell; its parent (:207, `flex: 1; min-height: 0`, a flex child of `main.wl-main`) took only the height the
rows above it left.
**The cure (shell mode only; the standalone chrome mode unchanged):** :207 takes its natural height (`flex: '0 0 auto'`, no
`min-height: 0`); :219's `overflowX` is `'clip'`. Each half alone already cures (b129's mutation restores both to redden); a
browser without `clip` drops it and falls back to `visible`, which also leaves one scroller.

## F-44.172 · the connected line (his final words, 25 September)

`lib/worklist/ownNumberFlow.ts` `active`: "Enquiries to this number are now answered here, by your personal TDW agent."
("in your voice" gone; R-45.30). Its truth half is held by **R-45.32**: `flag.own_number` stays off for every vendor but DEV440
until 2b makes answering real; the S4 card reads `active` against 2b's state when the flag is first armed for anyone else.

## Records carried (docs only)

- **"Where enquiries go" CLOSED as walked** (FE_2, FE_2b, F44167_1b): 25 September 22:35 to 22:40 IST on production, W1 his
  number on /v/dev440, W2 back to "Your TDW agent answers" and a new incognito load showing TDW's line at once (F-44.155 and
  F-44.167 cured), W3 the storefront's date check off and on, each at once (F-40.187's lie cured with them).
- **0172 walked green** (dream-os 08025d4, F-44.168): 25 September 23:29 to 23:54 IST, the grants applied and reported (service_role
  all seven on both tables), Railway's log clean of "wabas", /solutions/number answering 304 where it answered 500. (0172's own
  handover lives in dream-os; this record rides here, and in this seat's next dream-os delivery.)

## Proof

- tsc clean after `rm -rf .next/dev`, before any dev server (A-45.5).
- **b129 (new): 9 pass, 0 fail.** The source pins; the real shell in both themes: exactly one scroller on /vendor/settings and
  it is `main.wl-main`, Sign out reached by scrolling it; /vendor/storefront as a control; M1 (the pre-cure state) reddens it.
  Ports read from tcp and tcp6 (A-45.10); nothing left listening after.
- **b120: 50 pass, 0 fail**, its `active` pin re-cut by label (a736be2aa9e03afb, his words beside it).
- The differential and the floor: on the base given at the cut.
