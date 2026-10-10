# TDW · CE-47 · LAND-1 · package 2: the vendor sign-in in tdw.works's look · handover

Base: d733f8a plus package 1 (aee2af8, train 10). One commit on top of aee2af8, not pushed.
Not touched: app/layout.tsx, middleware.ts, next.config.ts, app/vendor/(legacy)/layout.tsx.

## What changes

1. One home for the wall (app/works, lib/works)
   - lib/works/wall.ts: the wall's markup (lookImg, worksLooks, wallHtml, freshWall), taken out of app/works/page.tsx.
   - app/works/WorksWall.tsx: the wall's element.
   - tdw.works (app/works/page.tsx) and the sign-in screens both draw from them, from the same scenes. A slide added
     to lib/works/scenes.ts shows on both.
   - tdw.works's look and behaviour are unchanged (b303 §2, all cells as in package 1).
2. app/works/WorksBackdrop.tsx: the wall behind, and one frosted-glass panel in front (app/works/glass.css).
   - The panel is centred on a laptop and is a sheet from the bottom on a phone.
   - It is headed by the mark: TDW, with tdw.works under it and no tagline.
   - The glass is 92% of the ground with a 24 px blur. Every line reads at 4.5:1 or better, even over the wall's
     opposite extreme.
   - Text is full size: the heading 30 px in Bodoni Moda, the lines 16 px in Manrope, nothing under 14 px.
   - The faces come from app/works/signinFonts.ts: tdw.works's four, none preloaded.
3. The browser bar (app/works/useWorksBar.ts)
   - While a vendor sign-in, sign-up or PIN screen is open, it sets every theme-color tag to works.css's ground:
     #E7EAE6 light, #0E1112 dark, by the phone's setting.
   - It follows a change while the screen is open.
   - It puts back exactly what was there when the screen closes.
4. The couples' page, app/(landing)/page.tsx
   - For the vendor (Maker) on join_phone, join_otp, signin_phone, signin_otp and your_name, the panel's screens
     stand on WorksBackdrop. The carousel, vignette and scrim are not drawn under them.
   - WorksBackdrop is loaded with next/dynamic only when a vendor screen opens, so the couples' front page downloads
     none of it.
   - The screens were moved whole into one const (panelScreens), so the Dreamer's glass and the vendor's glass draw
     the same code.
   - The vendor look comes from class names (wg-*) that do nothing outside the vendor look. Their inline styles stay
     byte for byte, so the Dreamer sees what she saw.
   - The phone row is styled by its shape, so its bytes (pinned by tdw09_landing §M.10) did not move.
   - Back on the vendor phone and name screens, by the chair's ruling:
     - she came from the sign-up chooser → the chooser;
     - otherwise (tdw.works's Sign in or Start free, the vendor. address, a shared link) → tdw.works.
     - Never the Dreamer entry. The code screen's Back to the phone step is unchanged.
   - Small additions on the way: aria-pressed on the craft chips, and aria-label "Back" on ←.
5. The PIN screens, classic and v2: app/vendor/(legacy)/{pin-login,pin,pin-reset} and v2/app/vendor/(legacy)/{same}
   - All six stand on WorksBackdrop. "The Dream Wedding" and "MAKER PORTAL" are gone; the panel's mark is TDW with
     tdw.works under it.
   - The photograph carousel and its /api/v2/landing-slides fetch are gone.
   - Steps, fetches, session reads and writes, words and doors are unchanged. Small addition: aria-labels on the digit
     boxes.
   - By the chair's ruling, the two checks that sent her to "/" now send her to /?role=vendor-signin (VENDOR_SIGNIN),
     in both trees:
     - pin-login with no session, and after five wrong PINs;
     - pin with no session.
     The checks themselves are unchanged.
   - The v2 copies differ from the classic three only in pin-reset's API import, as before.

## Benches

Run on base aee2af8 first, then on this commit, in this container.

- b303: §1 node, 49/0. Full run with a production build: 218 pass, 0 fail, 1 skip (the photograph weights; Cloudinary is unreachable here). With --perf: 220/0/1, first full view of tdw.works 652 ms on 4G and 1,676 ms on slow 4G.
  - New: §1.4, with the sources for one home, the Back rule and the PIN checks.
  - New: §5, in a browser, on the production build:
    - 5.1: the sign-in and sign-up at 360, 390 and 1440, light and dark (the wall, the glass, full-size text,
      contrast, faces, mark, browser bar);
    - 5.2: the steps and checks, and the code screen;
    - 5.3: Back to tdw.works, Back to the chooser, and the browser bar given back;
    - 5.4: the Dreamer untouched;
    - 5.5: the PIN screens, classic and v2 (tdw_layout=v2, with the v2 route's own files served), Forgot PIN?, and
      both checks landing on the vendor sign-in.
- Amended by label: b72_r4210_plan_entry, 29/29.
  - Its "no third door" cell counted setScreen('chooser') as exactly 1. Back to the chooser is a second one.
  - The cell now counts 2, pins the second to vendorBack by name, and still requires exactly one chooser door
    (Sign up).
- Green and unchanged: b291 65/0, tdw09_money 18/0, b20_a4_otpsignup 76/76, fe9_f44271_signup_name 101/0 (it drives /vendor/pin-reset in a browser), b20_a3 204/204, b20_a5 121/121,
  f04_94_cure2 green, ce41_brand_family 20/0, tdw09_surface_census, b59 v1 and v2.
- Red at base and unchanged, cell for cell:
  - tdw09_landing 99/100 (§2.3);
  - f04_96_three_rail (3, the landing's name and category guards);
  - tdw09_roles, tdw09_p1_canon, tdw07_p3_portfolio, tdw10_p1_shell, tdw09_p2c, tdw_m_bridename_gate.
- The v2-tree source benches: 38 run. Green, except b40, b42 and b80, which are red at base with the same cells (b40's C102 now lists 4 fewer sites: the escape line moved from app/works/page.tsx to lib/works/wall.ts), and d1_overlap, which outran the 180 s cap here and leaves the PIN routes out by design.
- tsc --noEmit: exit 0. next build (inside b303): exit 0.

## For the chair

| # | What | Recommendation |
|---|------|----------------|
| 1 | The glass is 92% solid, so every line reads at 4.5:1 over the worst part of the wall. At 86% the teal links fell to 4.4:1 in light mode. | Keep. |
| 2 | The country list (a rare tap; India is the default) takes the works colours, but stays a sheet from the bottom. On a laptop it is centred at 460 px. | Keep. |
| 3 | After five wrong PINs the session is removed from storage but not from the tdw_vendor_session cookie. This was true before this package. So on the vendor sign-in the front door's session read (lib/vendor/session.ts reads the cookie too) can send her on to /vendor/rooms, as it did from "/". | File for the auth seat; not changed here (checks byte for byte). |
