# TDW · CE-47 · WEB-7 · the enquiry panel and the client's page · handover

Base: dreamos-pwa main 70110706. Five new files, no file changed. Not landed by this seat (CE-47: one integrator).

## What lands
- public/site/enquire-panel.js and .css. The panel is plain script and CSS, with no framework. It reads the page's
  card from <script type="application/json" id="tdw-site-card">.
  - Doors, by exact name:
    - POST /api/v2/public/site-enquiry/:code, which returns a chat_token
    - POST /api/v2/public/site-chat/:code, with { chat_token, text }
    - GET /api/v2/public/availability/:code/:date
    The first two are WEB-4's cut 6; the contract is in WEB-7's block of 30 Sept.
  - Free means ok, blocked false, sold false and any_held false. Every other answer says "will confirm".
  - The hand-off is built on the card's enquire_link, with the words appended to its text.
  - Every country is offered from countries-list 3.4.1 (252 countries in 258 rows, inlined: the Dominican Republic, Kosovo and Puerto Rico carry more than one dial code). Phone numbers are sent as E.164.
  - z-index 85.
- lib/site/enquirePanelBoot.ts: the contract with WEB-5's server-drawn page.
  - panelCardJson(card) goes into #tdw-site-card.
  - PANEL_BOOT goes at the end of <body>. It waits for load, then two frames, then an idle moment, and only then
    adds the panel's files.
  - Entry points: data-enquire opens the panel; data-look-request="<title>" on a look's WhatsApp link;
    data-look-title on a look page.
- app/kind-words/[token]/route.ts: the client's page as one server-drawn document. No React, no login, no cookie,
  no storage, cache-control no-store, noindex, no referrer.
  - It calls GET/POST /api/v2/public/testimonial/:token.
  - It draws the server's 400, 429 and 503 lines as sent.
  - A used, expired or unknown link shows its one line.
- scripts/b170_web7_enquire_panel_bench.js: rung b170.
  - §1 source. §2 glass: headless Chromium, a host page with a slow cover, and the doors answered by the bench.
  - §3 mutation: --mutate.

## Proofs (this container, on the tree)
- b170 --mutate: 31 pass, 0 fail. Then two more runs at 30/0.
  First paint about 50 ms, load about 440 ms, the panel's first request about 460 ms.
  M1 (the panel loaded at once) reddens 2.1, and the file is restored by sha.
- tsc --noEmit on the whole project: exit 0.
- Benches in scripts/ that can read these files: every file that walks directories or names public/, lib/site,
  kind-words or middleware. That is 82 files, run on main and on the tree side by side. 81 gave the same exit.
  b133 differed only because a sibling run's next dev was still alive; run alone on the tree it is 15/0.
  Benches that neither walk nor name these paths read identical bytes on both trees.
- The six styles, driven on the approved renditions with the mock panel (the same CSS as deploy):
  - Couture, Heritage, Aurora, Gallery, Riviera: 36/36 each (reduced motion).
  - Noir with motion on: 36/36.
  - z-70 controls: Noir 12 red of 12 (grain), Riviera 12 red of 12 (leak).
  Logs are in mock/results.

## Open, named
- WEB-5's page must embed the card and PANEL_BOOT. b170 proves the loading on a host page, not on WEB-5's page,
  which is not on main.
- `next build` was not run here. Route types for app/kind-words/[token] are proved by tsc only.
- The opening frames (start, middle, end) caught the panel already open: the capture lagged the 0.7 s slide.
- The kind-words frames are from the mock page, which matches the route's CSS and script. b170 §2.6 drives the
  route's own document.
- The privacy paragraph awaits the founder's wording. Nothing is built on /privacy.
