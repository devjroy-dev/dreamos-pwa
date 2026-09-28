# TDW · CE-46 · WEB-1 · CUT 1 HANDOVER · the vendor's subdomain, F-44.146, F-44.239

Cut at dreamos-pwa dc8dbdd1 (base), 28 September 2026 IST. Sibling dream-os 0ac1a01 untouched by this cut.

## What shipped
1. `lib/public/vendorHost.ts` (new): one pure function, `decide(host, pathname, siteBase, search)`, that names what the edge does for `<handle>.thedreamwedding.in`: `/` → `/v/<handle>`, `/date` → `/v/<handle>/date`, `/w/<slug>` → `/v/<handle>/w/<slug>`, an already-addressed `/v/…` passes, anything else is a 302 to the same path on the apex. The apex, `www`, the four demo hosts (demo, demodreamer, demodiscover, demobride), two-label hosts and any label outside the handle shape are not vendor hosts. The label is lowercased as the card door lowercases it (F-40.276). dream-os's `subdomainFor()` (contract.js) builds the same address; the two sides pin the same literals.
2. `middleware.ts`: reads `decide` after the four demo rules, which are unchanged; the matcher is unchanged. F-44.238: the file keeps the deprecated `middleware` convention on purpose; the rename to `proxy.ts` is its own later cut.
3. `app/sitemap.ts` (F-44.146): a wedding is listed at `/v/<handle>/w/<slug>`, the route on disk; the address that never existed is gone.
4. `app/vendor/(shell)/storefront/screen.tsx` (F-44.239): the public-page link and its visible address read `SITE_BASE` (one spelling with the Your website room and the sitemap) instead of a literal.
5. `scripts/b145_ce46_web1_subdomain_bench.js`: 32 cells; §1 drives the function whole in node through the tree's typescript; §2 to §4 pin the three files; §5 reverts each cure in memory and shows the cell that would redden. No dev server, no browser: a floor member.

## Proven
- b145: 32 passed, 0 failed at the cut.
- `tsc --noEmit -p tsconfig.json`: exit 0 at the cut (`.next/dev` removed first, A-45.5).
- Live, on a dev server with `NEXT_PUBLIC_SITE_BASE=http://localhost:4310`: `Host: dev440.localhost:4310` `/vendor/login` → 302 to `http://localhost:4310/vendor/login`; `/w/riya-and-kabir` → 200, the wedding leaf's own miss page (no API reachable from the seat); the apex `/` → 200 untouched; `demo.localhost:4310/vendor/nobody` → 200 through the demo rule as before.

## What the founder does (Vercel and DNS), numbered, before any vendor's address resolves
1. In Vercel, the pwa project, Settings › Domains: add `*.thedreamwedding.in` (the wildcard). Vercel will ask for its nameservers on `thedreamwedding.in`, or the `_acme-challenge` NS delegation if the nameservers stay where they are (Vercel's page "Adding & Configuring a Custom Domain", last updated 2026-09-16, the wildcard steps).
2. At the registrar or DNS host of `thedreamwedding.in` (his; the provider named when he does this): either move the nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com` after copying every existing record (MX, the demo hosts' records, any TXT), or add the two `NS _acme-challenge` records plus `CNAME * cname.vercel-dns-0.com.`.
3. Wait for the domain to show Valid Configuration with a certificate in Settings › Domains.
4. Set `NEXT_PUBLIC_SITE_BASE=https://thedreamwedding.in` on the Vercel project if it is not already set (the code's fallback is the same value).
Cost: none. Vercel adds domains at no charge; the wildcard certificate is Vercel's.

## The founder's walk
Open `https://dev440.thedreamwedding.in/` on the phone: DEV440's storefront. `https://dev440.thedreamwedding.in/date?d=<a date>`: the date check. `https://dev440.thedreamwedding.in/vendor`: lands on `https://thedreamwedding.in/vendor`. `https://thedreamwedding.in/sitemap.xml`: every wedding line reads `/v/<handle>/w/<slug>`. In the app, Storefront › Your public page: the address reads `thedreamwedding.in/v/dev440` and opens.

## Drift from the spec
None on this cut. The subdomain is the first step of shape (3) as ruled 27 September; the own domain is cut 2 (dream-os).

## Open
- F-44.238 (rename to proxy.ts): its own cut, ruled by the chair.
- The measured overflow cell (the site's type at 360 and 374, the founder's three longest names in its fixture) lands with the site's first cut, where the pages it measures exist.
- Cut 2: 0177 `vendor_domains`, ResellerClub behind the Razorpay-paid order, the Vercel add-domain call.
