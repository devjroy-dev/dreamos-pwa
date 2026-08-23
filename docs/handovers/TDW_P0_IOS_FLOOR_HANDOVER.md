# TDW · P0-1 — THE iOS/iPad DEAD-APP CURE: THE BROWSER FLOOR DECLARED, THE BUILD MADE TO HONOUR IT
Authored at dreamos-pwa `53370eb` by CE-36, executing under a named emergency deviation (chair-built, incident-ruled; the seat law's one lift this tenure, owned at c-36.3 and banked at CE-224). Delivery: ONE file, `package.json`, two keys.

## THE DISEASE (P0-1, the seat's audit CONFIRMED at this chair's own clone)
The Next 16 upgrade silently raised the whole app's minimum browser to Safari 16.4: Turbopack production chunks carry post-ES2021 syntax that older WebKit cannot PARSE. The page paints (HTML/CSS arrive) but every interactive surface is dead — the portfolio upload toast is only the loudest corpse. Reproduced in-container at the untouched tip: **5 of 126 emitted chunks fail an ES2020 parse with `Unexpected token`, and two of the five are `0h~lqnkna01or.js` + `0d3shmwh5_nmn.js` — the exact chunk names from the founder's own network log.** Evidence rows re-verified at tip: `next 16.2.3` · no browserslist anywhere in the tree · `no-store` catch-all (so no stale-cache alternative explanation).

## THE CURE (R-36.3 Fork A+B · R-36.6 floor)
`package.json`, two keys, nothing else:
1. `"browserslist": ["safari >= 14", "ios_saf >= 14", "chrome >= 90", "edge >= 90", "firefox >= 90"]` — the declared floor (Fork A). Ruled Safari 14 at R-36.6.
2. `"build": "next build --webpack"` — the production build moves to webpack, which honours browserslist (Fork B). The `--webpack` flag verified against the installed 16.2.3 binary's own `--help`. Vercel runs `npm run build` (no `buildCommand` override in `vercel.json`), so the flag carries to production unaided. `next dev` stays Turbopack — dev speed untouched.

## EFFECTIVE FLOOR — R-36.6 AMENDED IN-BAND, STATED NOT HIDDEN
Two webpack chunks (`main-*`, one framework chunk) retain `??=` — **ES2021** — because they are Next's own precompiled runtime, which no browserslist re-transpiles from `node_modules`. `??=` ships in **Safari 14.1 / iOS 14.5**. So: **declared floor 14, effective floor 14.1/14.5.** The gap is the iOS 14.0–14.4 sliver (a five-month 2020 window, effectively zero devices today). Every device in the incident — the founder's Mac, Safari-15 iPads, the permanently-capped iPad Air 2 / mini 4 fleet (15.x forever), every iPhone since 2015 — sits at or above 14.5 and is rescued. Chasing true 14.0 would mean custom webpack transpilation of Next's runtime on a live estate: refused as risk-disproportionate; re-openable by founder word.

## THE PROOF, BOTH WAYS AT THE ES2021 PLANE (the effective floor's own plane)
Instrument: acorn parse of every emitted chunk at `ecmaVersion: 2021`.
- **Uncured tree (Turbopack): 3 of 126 chunks RED** — `0h~lqnkna01or.js` among them (the founder's named chunk). The instrument sees the disease.
- **Cured tree (webpack + floor): 0 of 152 chunks RED.**
- Full pwa floor `--check` run before and after: **red set byte-identical** — this delivery moves nothing on the bench floor. (The standing 8-bench F-16.24 delta predates this delivery, stands untouched, and is R2's to clear.)

## SANDBOX DEVIATIONS, DECLARED (nothing here ships)
The build container's egress blocks `fonts.googleapis.com`; in-container builds used Next's own test seam (`NEXT_FONT_GOOGLE_MOCKED_RESPONSES`, derived from the installed loader source) with local()-sourced faces. The mock lives in `/tmp` of a disposable container, appears nowhere in this ZIP, and the Vercel build — which has network — never reads that env var.

## THE WALK (founder, after Vercel deploys)
1. The founder's own Mac (the fully-dead surface): the landing page carousel moves, buttons respond.
2. Any complaining vendor's iPhone/iPad, or any device on Safari 15–16.3: log in, Portfolio, upload a photo — it lands.
3. If any device still fails post-deploy, paste its Settings→General→About Safari/OS version: below 14.5 is the declared gap; at or above is a REOPEN.

## QUEUE TOUCHED
P0-1 → CURE AT ORIGIN pending founder push + walk. F-16.24 unmoved (R2's). CE-224 owes this band.
