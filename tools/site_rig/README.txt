tools/site_rig · WEB-5 · the styles site's glass rig (not floor members; run by hand or by the integrator).
Every number and frame in WEB-5's note came from this rig, on production builds (next build + next start), because
next dev does not hydrate in a seat's container.
  stub_door.cjs         node tools/site_rig/stub_door.cjs <port> scripts/fixtures/site <fontsource dir>
                        serves the fixture cards (fixture_cards.cjs), the look door, the site-kind door, the beacon
                        doors, and the fixture photographs behind Cloudinary-shaped urls (R-46.16: fixtures only)
  fixture_cards.cjs     cards in dream-os a0bfe02's shape, palettes and pairs read from dream-os's registry
                        (TDW_DREAM_OS=<path to dream-os>, default ../dream-os beside this repo)
  google_font_mock.cjs  NEXT_FONT_GOOGLE_MOCKED_RESPONSES for a build in a container without Google (estate faces)
  perf.mjs              on the photograph itself, fail-closed: first paint, cover, every face, layout shifts
  shots.mjs             viewport frames at scroll points (TDW_SHOTS=<dir>)
  wf.mjs                a throttled waterfall;  font_probe.mjs  the face each text node draws in
  stop.sh               stops the rig's node and chromium processes only
Build:  NEXT_PUBLIC_SITE_BASE=http://localhost:4412 NEXT_PUBLIC_API_BASE=http://127.0.0.1:4811 TDW_SITE_MOCK_IMG=127.0.0.1:4811 next build --webpack
Serve:  same env, next start -p 4412; the stub on 4811.
