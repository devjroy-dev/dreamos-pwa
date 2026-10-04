# WEB-8 · the founder's pixel gate · prototype against server · ACCEPTED by CE-47 (2 October 2026), re-run with the tightened header allowance

Each of the six styles, at 360 and 374 wide, one frame for every screen-height from the top of the page to the bottom,
reduced motion, every face loaded, 2 device pixels to the pixel. Prototype: the approved renditions (WEB-7's mock pages,
photographs and faces built in). Server: a production build (next build, next start) of this tree behind the rig's stub door,
fixture cards from tools/site_rig/fixture_cards.cjs.

How the two sides were made comparable:
- The prototype's own "Prototype" label chip is hidden; it is not part of the site.
- Each photograph slot on the server page is given the very file the prototype holds in that slot. The live server picks a
  smaller file for a small screen; that is a difference of file, not of drawing.
- Both sides redraw their layers at each scroll point before the frame is taken, so a frosted layer's sub-pixel placement
  never depends on how the page was scrolled there. The prototype shot against itself gives zero.
- Faces: TDW_SITE_FONT_DISPLAY=swap on the server, so every face is drawn before the frame.

The named regions (CE-47's rulings of 2 October 2026):
- "Client reviews": the founder's ruling.
- Couture's video poster crop: a named exception.
- Riviera's postmark: her profile city; the prototype shows a sample place for each look, and no field carries one.
- Gallery's wall label names the look the cover slide points at: accepted; the fixture's Gallery cover points at the look
  the prototype names, so this region does not differ.
- Under the see-through header only the region's own rectangle is allowed, spread by the reach of the header's own blur
  (3 times its radius) and only inside the header; never the whole header band.

| Style | Width | Frames | Page height, prototype / server | Differing pixels | Outside the named regions | Regions that differ |
|---|---|---|---|---|---|---|
| Couture | 360 | 8 | 5950 / 5950 | 36275 | 0 | label; poster; poster through the header |
| Couture | 374 | 8 | 5967 / 5967 | 37980 | 0 | label; poster; poster through the header |
| Gallery | 360 | 11 | 8329 / 8329 | 1841 | 0 | label |
| Gallery | 374 | 12 | 8436 / 8436 | 3789 | 0 | label; label through the header |
| Noir | 360 | 12 | 9092 / 9092 | 1784 | 0 | label |
| Noir | 374 | 13 | 9260 / 9260 | 1784 | 0 | label |
| Heritage | 360 | 9 | 6140 / 6140 | 2325 | 0 | label |
| Heritage | 374 | 9 | 6234 / 6234 | 2325 | 0 | label |
| Aurora | 360 | 8 | 5548 / 5548 | 1661 | 0 | label |
| Aurora | 374 | 8 | 5631 / 5631 | 1661 | 0 | label |
| Riviera | 360 | 9 | 6443 / 6443 | 2464 | 0 | label; postmark |
| Riviera | 374 | 9 | 6459 / 6459 | 5032 | 0 | label; label through the header; postmark |

Every differing frame, with what the difference is:

| Style | Width | Frame | Differing pixels | Outside the named regions | What it is |
|---|---|---|---|---|---|
| Couture | 360 | 04 | 24792 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling); Couture's video poster crop: a NAMED EXCEPTION (CE-47 ruling 1; real posters vary by vendor, no focal point is carried) |
| Couture | 360 | 05 | 11483 | 0 | Couture's video poster crop: a NAMED EXCEPTION (CE-47 ruling 1; real posters vary by vendor, no focal point is carried); the same poster under the see-through header, spread by the header's own blur |
| Couture | 374 | 04 | 19287 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling); Couture's video poster crop: a NAMED EXCEPTION (CE-47 ruling 1; real posters vary by vendor, no focal point is carried) |
| Couture | 374 | 05 | 18693 | 0 | Couture's video poster crop: a NAMED EXCEPTION (CE-47 ruling 1; real posters vary by vendor, no focal point is carried); the same poster under the see-through header, spread by the header's own blur |
| Gallery | 360 | 07 | 1841 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Gallery | 374 | 08 | 3789 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling); the same label under the see-through header, spread by the header's own blur |
| Noir | 360 | 08 | 1784 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Noir | 374 | 08 | 1784 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Heritage | 360 | 04 | 2325 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Heritage | 374 | 04 | 2325 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Aurora | 360 | 03 | 1661 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Aurora | 374 | 03 | 1661 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Riviera | 360 | 01 | 602 | 0 | Riviera's postmark: her profile city is stamped (CE-47 ruling 1); the prototype shows a sample place for each look, which no field carries |
| Riviera | 360 | 05 | 1862 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling) |
| Riviera | 374 | 01 | 597 | 0 | Riviera's postmark: her profile city is stamped (CE-47 ruling 1); the prototype shows a sample place for each look, which no field carries |
| Riviera | 374 | 05 | 4435 | 0 | "Client reviews" in place of "Kind words" (the founder's ruling); the same label under the see-through header, spread by the header's own blur |

Files here: for each style and width, `<style>_<width>_every_frame_prototype_above_server_below.jpg` (every pair, small), and
for each frame that differs `<style>_<width>_frame<NN>_prototype_server_difference.jpg` (prototype, server, differing
pixels in red, full size). The tools that made this are in docs/design/web8/tools/.
