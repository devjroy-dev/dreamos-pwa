# TDW · CE-47 · LAND-1 · the tdw.works front page · handover

Base: dreamos-pwa 96fa4e06. One commit, not pushed. The chair builds the train.

The chair's design file (tdw-works.html, 9 October 2026) is built into the app unchanged in look and behaviour, with
the nine changes the chair ordered. The chair reviews it against the file before the founder sees it.


## Addition, 9 October 2026: tdw.works's own tab icon (ruled by the founder; files from the chair)

- public/works/: the chair's five files from TDW_CE47_tdw_works_icon_A (4b0d0f96), byte for byte:
  icon.svg 5a66fc5d, favicon-16.png ea98ac85, favicon-32.png 79c3216a, apple-icon-180.png 8073393c, favicon.ico da5ed966.
- app/works/page.tsx: metadata.icons names those four, so the works page's tab icon and apple touch icon are tdw.works's.
- app/layout.tsx: the root's five D icon links move from hand-written <link> tags into metadata.icons. They keep the
  same paths, sizes and types. Only metadata can be replaced by a page, which is what lets the works page carry its own;
  every other page keeps the D.
- next.config.ts: a beforeFiles rewrite serves /favicon.ico from /works/favicon.ico on the tdw.works host (and www). It
  lives there because the middleware matcher skips favicon.ico; beforeFiles, so it wins over app/favicon.ico (the D),
  which every other host keeps.
- lib/public/worksHost.ts: /works/<name>.(svg|png|ico) passes on tdw.works; nothing else under /works/ does.
- ce41_brand_family amended by label: public/works/ is tdw.works's family, named file by file, and
  app/works/page.tsx is its one reader (20/0).
- b303 2.9:
  - on tdw.works the icons point to /works/*, and /favicon.ico serves da5ed966;
  - the five files are served byte for byte;
  - on thedreamwedding.in the five /brand/ links are unchanged, and /favicon.ico is still the D (1a7f4d8d).
  - Result: 75 pass, 0 fail, 1 skip (photo weights, Cloudinary unreachable here).

## Re-cut, 9 October 2026 (the chair's rulings, CE-47 to LAND-1, "taken for app train 9")

- (1) app/layout.tsx: `preload: false` on Italiana, Cormorant, DM Sans and Jost.
- (2) next.config.ts: /_next/static/:path* gets `public, max-age=31536000, immutable`, listed after the no-store rule so
  it wins on those paths.
- (3) The train lands only after tdw.works answers on Vercel. The founder's domain walk is in the seat's chat.
- (4) The line under TDW reads "tdw.works · The Delegated Workspace™" (top bar and About). The chair's file keeps it on
  one line, and on a 360 phone that pushed Sign in off the screen, so on phones it wraps onto two lines (works.css).
  The words are unchanged.
- (5) Words:
  - "Wedding makeup" in place of "Bridal makeup" (Packages, and twice in Eliza);
  - "at any hour" in place of "while you work or sleep";
  - "9:41 am" on every status bar;
  - Discover's two tiles carry the same two photographs;
  - Insurance: "and a note when a policy needs renewing" (scene line and About). The scene's tag follows as
    "Needs renewing".
- (6) The restored "Paused" stays.
- (7) The rung is b303 (file, labels, manifest); b298 is PTN's.

## What lands

New files
- app/works/page.tsx: the page, drawn on the server. The wall, the first scene, the word and its line are in the HTML,
  so the first full view needs no script. Each visit gets its own random order (connection()). An inline script sets the
  big screen's scale before any bundle loads.
- app/works/WorksMotion.tsx: the file's script, ported line for line. It takes over from the scene the server drew.
- app/works/works.css: the file's CSS, scoped under .tdww so nothing reaches the rest of the app. Two additions: 4 wall
  columns on a phone (point 5), and the wall and trades line stop while About is open (point 9).
- app/works/fonts.ts: Bodoni Moda (variable, with its optical-size axis), Manrope (variable), JetBrains Mono 400/500
  (not preloaded) and Inter (variable, app screens only), all through next/font and served by the site (point 1).
- lib/works/scenes.ts: the 18 scenes word for word, the order rule (draw), the doors, and the two photographs.
- lib/public/worksHost.ts: the host rule as one pure function (point 3).
  - tdw.works/ shows the page. tdw.works/works goes to tdw.works/.
  - www.tdw.works goes to tdw.works, path and query kept.
  - Any other path on tdw.works goes to the same path on thedreamwedding.in, where the app and its sign-in live.
  - /brand, /robots.txt and /sitemap.xml pass. Every other host is untouched.
- scripts/b303_land1_works_bench.js: rung b303.

Changed files
- middleware.ts: asks worksDecide first; every other host goes on as before.
- next.config.ts: images.remotePatterns allows TDW's Cloudinary folder only; qualities [60, 75] (Next 16 requires the
  list). No other page uses next/image today.
- app/(landing)/page.tsx (the couples' page):
  - one line: ?role=vendor-signin opens the vendor sign-in (tdw.works's Sign in door);
  - point 8: the entry's "I'm a wedding vendor" goes to tdw.works;
  - point 8: the line "An agency, brand or planner? Partner with The Dream Wedding" is removed;
  - the chooser's vendor door (the sign-up path) is unchanged.
- app/layout.tsx: the theme-colour script gets a tdw.works lane. Without it the root path painted the couples'
  near-black behind a light page. The ground is #E7EAE6 in light and #0E1112 in dark.
- tools/site_rig/google_font_mock.cjs, scripts/lib/next_fonts.js: the bench's font stand-in answers for the four new
  faces, including the @fontsource-variable files. Old entries are unchanged.

Benches amended by label (point 8 and the new import), each with the reason in place
- b20_a4, b72: the census is back to 34 and anchors to 3, because the partner link left.
- b291 §7.1: the partner door now lives on tdw.works and is off the couples' page.
- tdw09 §M.2: the anchor follows the entry door's new handler.
- fe9: a vendor's sign-in door is now /?role=vendor-signin (a fresh page load); the sign-up door is unchanged.
- d1_layout_switch: stubs the new worksHost import with the real module.

## Proofs (this container, on the tree)

- tsc --noEmit on the whole project: exit 0. `next build` on the font stand-in: exit 0; /works is server-rendered.
- b303, on a production build with tdw.works mapped to it: 63 pass, 1 fail, 1 skip.
  - Every door is on screen and nothing scrolls at 360x640, 390x844 and 1440x900, in light and in dark.
  - The ground follows the mode. A phone shows 4 wall columns and a laptop 6.
  - The 18 scenes: two full bags of 18, no repeat within a bag, never the same scene twice in a row.
  - The three doors' targets, everywhere they appear.
  - A tap pauses; a hidden tab stops the clock.
  - About, Esc and Close work, and the wall stops while About is open.
  - Reduce motion stops the wall, the trades line, the meter and the transitions.
  - The four faces are served by the site.
  - Her tiles carry next/image addresses for TDW's folder at quality 60.
  - The fail is slow 4G (ruling 1). The skip is the photograph weights: this container cannot reach Cloudinary.
- b303 --mutate: draw() made to forget the bag. 1.2 and 2.2 go red (60 pass, 2 fail). The file is restored by sha.
- Timing, 360x640, production build, median of 3:
  - 4G (9 Mbps, 170 ms): 1.69 s.
  - Slow 4G (Lighthouse mobile: 1.6 Mbps, 150 ms, CPU x4): 3.11 s.
- The 33 source benches that read the changed files, on base and tree side by side:
  - Same exit on every file after d1's amendment (23/23 on both).
  - Reds already red on base, unchanged: b05, b40 (both), b42 (both), b80, f04_96, tdw09 (§2.3), tdw09_p2c,
    tdw09_theme_retire, tdw_f0770, tdw_m_bridename.
  - b231 and b82 exit 3 on both: they cannot run here.
- fe9 (browser, amended): 101 pass, 0 fail. b291 (browser, amended): 65 pass, 0 fail.
- The other 22 browser benches that start next dev with the font stand-in are the floor's. The stand-in change only adds
  entries; its old answers are byte-identical.

## For the chair's ruling

| # | What | Where it comes up | Recommendation |
|---|------|-------------------|----------------|
| 1 | Slow 4G misses 2.5 s (3.11 s). 15 of the page's 21 preloaded font files are the root layout's Italiana, Cormorant, DM Sans and Jost. This page never draws them, but app/layout.tsx preloads them on every page. Measured with `preload: false` on those four faces: slow 4G 1.71 s, 4G 1.23 s. | app/layout.tsx, every page in the app | `preload: false` on the root's four faces, as one line each. Their pages draw them a moment later (display: swap). This needs the founder's yes because it touches every page. |
| 2 | /_next/static files (content-addressed) carry the app's global no-store header, so a preloaded face downloads twice. Measured with a year's cache on /_next/static: 4G 1.13 s; slow 4G unchanged. | next.config.ts headers, every page | One rule after the no-store rule: /_next/static/:path* gets `public, max-age=31536000, immutable`. The names carry their hash, so a new build never reads an old file. |
| 3 | The entry's vendor door sends vendors to tdw.works. Until tdw.works is on the Vercel project and its DNS points there, a vendor signing in from thedreamwedding.in reaches a dead address. | Point 8, the couples' page | Land the train only after tdw.works answers. The domain and DNS steps come from the seat when the chair calls the walk. |
| 4 | The mark reads "TDW" with "The Delegated Workspace" (point 4). The file had "tdw.works · The Delegated Workspace™". The About footer keeps the file's "© 2026 tdw.works · The Delegated Workspace™". | Top bar and About | Confirm, or say whether ™ goes beside the mark too. |
| 5 | Lines in the file that sit against standing rules, built as given: "Bridal makeup" (Packages, twice in Eliza); "while you work or sleep" (About; R-45.30 struck "while you work"); "9:41" with no am or pm in the status bars (the 12-hour rule); Discover's two tinted tiles where photographs would be (the no-stand-in rule); "a reminder before every renewal" (Insurance: the room shows a "renew soon" state, and whether dream-os sends a reminder message is not checked here). | lib/works/scenes.ts and page.tsx | The chair's words. Each is one edit in one place. |
| 6 | One behaviour beyond the file. A page paused before About showed no "Paused" label after it (the file hid it and never restored it). It shows it again now. | WorksMotion.tsx | Keep. |
| 7 | The photographs are the couples' page's first two fixed slides (FALLBACK_SLIDES). The live page may show slides set in the admin. Their weight (150 KB at most) is measured by b303 on a machine that reaches Cloudinary. | Her website's two look tiles | Run b303 on the founder's machine. |

## Open, named

- The root layout's Frost stylesheet (Fraunces, Italianno and JetBrains Mono from Google, render-blocking) loads on
  this page as on every page. It was not measured here because this container cannot reach Google.
- Quotes and Rebooking are not among the 18 scenes. They are still "Coming soon" at 96fa4e06 and join when OFF lands them.
- The first scene appears without its rise, because it is drawn by the server. Every later scene moves as the file has it.
