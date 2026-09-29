# TDW · CE-46 · WEB-1 · CUT 3 HANDOVER · "Your own name", her short address, the contract twin

Cut at dreamos-pwa 545251ee (r2; carried from 85c66ef5 and 423d67cd with no overlap by path against FE-4 b140 and ADS-1 cut1d), 29 September 2026 IST. Sibling dream-os at 9d3d772: cut 2 (0178, the domain doors, 7504315) and cut 4 (0179, the site's card fields, 9d3d772) have landed; the P2 gate reads open.

## What shipped
1. `app/vendor/(shell)/your-website/OwnName.tsx` (new): the "Your own name" section of the address screen. States S1 idle, S2 results, the registrant sheet, S4 paying, S5 registering, S6 setting up, S7 live, S8 error (and refund_due), refunded. Every action has three forms decided by one pure function, `formsFor`: LOCKED below Signature (one line, the tap to /vendor/billing, R-43.16), COMING SOON (in place, disabled, aria-disabled, words at full ink; R-46.14) when the website gate is closed, cut 2 has not landed (no `pricePaise` in GET /domain's answer), or a write door answered 503; LIVE otherwise. When the gates open the same buttons go live with no new cut. The price shown is the door's `pricePaise`; the pwa computes none.
2. `app/vendor/(shell)/your-website/screen.tsx`: mounts OwnName; the four own-name lines moved to OwnName (domSearchSoon retired as ruled); /me read for `tier`, `name`, `address` (re-derived at 423d67cd: /me carries no email or phone, so those boxes start empty); the room's primary in sentence case ("Copy"), this room only (`.yw-pri`); the header note: R-46.14 supersedes R-40.78 for the own-name actions only; her address is her short address.
3. `lib/public/vendorHost.ts`: `shortAddressFor(handle, siteBase)` and `publicUrlFor(handle, siteBase)`, the one home of her address: `https://<handle lowercased>.thedreamwedding.in`, or `/v/<handle>` for a handle outside the label shape. (The founder's check of 28 September: no handle in production falls outside it.)
4. `app/vendor/(shell)/storefront/screen.tsx`: the "Your public page" row links and prints her short address.
5. `app/v/[code]/page.tsx`: canonical, og url and the structured-data url are her short address.
6. `lib/solutions/types.ts`: DomainStatus mirrors cut 2 (status paying, refund_due, refunded; pricePaise, paymentUrl); CONTRACT_DIGEST is 2ad7b3f8…, the same literal cut 2 carries; until cut 2 lands the pre-cut-2 answer is the room's Coming soon signal.
7. `scripts/b147_ce46_web1_own_name_bench.js` (42 cells), and b145 amended by label (4.2, 4.3, 5.2).

## r2 (29 September): two cells inside a base bench, caught after the founder's floor
The founder's floor on aa4afb0e read FLOOR = NAMED BASE (the floor's unit is the bench, and b40 was already base-red), but at cell level cut 3 had added two reds inside b40: C115 (the room's primary register written "wl-btn pri yw-pri", so the exact count of "wl-btn pri" was 0, not the one home) and C102 (two straight apostrophes inside CSS-string comments, which C102 reads as prose). r2: Primary keeps className exactly "wl-btn pri" and carries the room's sentence case and light-mode words on data-yw-pri; the two apostrophes are typographic. b40's red text is now byte-identical to the clean tip's (untracked files stashed too), and b42, b59, b70, b71, tdw09_hotfix, tdw09_p2b and ce41_brand_family read the same red text with and without the cut.

## The fourth Coming soon signal (the chair, 28 September)
With cut 2 landed and the keys set, the search is live. `rowFormFor` decides each result: an available name with a price offers "Get"; an available name WITHOUT a price offers "Coming soon" (never "Taken", which would be false); a taken name reads "Taken". `allUnpricedOf` makes the search row itself read Coming soon, with its line, when every available name comes back unpriced (the registrar's price list not yet read). Prices arriving make the same buttons live with no new cut. b147 §1b and mutation 9.5 pin it.

## OWED BEFORE THE FIRST VENDOR ON SIGNATURE (the founder, 28 September; after the front end lands)
1. The ResellerClub wallet top-up (USD 10).
2. The reseller price-list read (one Railway Console line; if the shape differs from yearOneRupees(), a small dream-os cut reads it).
3. The founder's walk of a real search, after both.

## F-44.222 (minted by the chair for the shell; cured here for this room)
The shell's primary in light mode (lib/worklist/theme.ts CHALK) sets its words in ink-deep #17191A on accent-text #0D6A5A: 2.71 to 1, under WCAG AA (4.5). Dark (GRAPHITE) is #0F1011 on #68C9B4, 9.62 to 1. In this room `.wl[data-wl-mode="light"] .yw-pri` takes ink-on-metal #FFFFFF: 6.51 to 1, witnessed in the render as rgb(255,255,255) on rgb(13,106,90). Every other primary in light mode is still 2.71 to 1; the shell-wide cure is FE-4's, after its current package.

## Held, one line each when answered
- The sitemap keeps /v/ addresses. When the founder confirms the thedreamwedding.in Search Console property is a DOMAIN property (which covers every subdomain), app/sitemap.ts :51 moves to her short address (`publicUrlFor`), and b147 6.9 moves with it.
- The QR image (dream-os storefront.js, and a check of vendorCard.js's published url) rides cut 2's re-cut on the dream-os tip.
- For the backend queue: the WhatsApp handle picker should refuse any character outside letters, digits and hyphen, so every future handle has a short address.

## Proven
b147 48/48; b145 32/32; `tsc --noEmit` 0 (.next/dev removed first); tools/bs_audit.mjs 34 PASS 2 FAIL, the same two as at 423d67cd (C24, C36), nothing new; the digest computed from this file equals the literal. The 26 screens (13 states × Graphite dark and light, 374 wide, reached by real clicks in the real app in mock mode) are the card's evidence.

## The founder's walk (after the push; nothing to pay)
1. In the TDW app, DEV440, Storefront: "Your public page" reads dev440.thedreamwedding.in and opens.
2. Rooms › Business Solutions › Your website & SEO › the address row: the address reads dev440.thedreamwedding.in; Copy, Share and Open use it; "Copy" is in sentence case.
3. Below it, "Your own name": the search button reads "Coming soon" (cut 2 has not landed), with the line under it.
4. On the phone, open dev440.thedreamwedding.in and view the page source: the canonical line names https://dev440.thedreamwedding.in.
