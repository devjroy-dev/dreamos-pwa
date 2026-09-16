# repo: dreamos-pwa @ 89f18af742b59662fa32085f203e471a05058082
# TDW · CE-43 · SEAT LC-1 · HANDOVER (the dreamos-pwa packet) · 2026-09-16

Cut on dreamos-pwa `89f18af742b59662fa32085f203e471a05058082`. The dream-os packet is at origin as `d4d3f92f93c5d2e7429318e017fdbd80fb4954bb`, re-derived with `git ls-remote` before this cut (R-38.16). The dream-os half and the full walk card are in dream-os `docs/handovers/TDW_CE43_LC1_HANDOVER.md`.

## §1 · What shipped (F-43.4, ruled F4(d))

`lib/vendor/api/vendor.ts` gains `fetchLeadsWhole(vendorId, state)`. It reads the leads list route in pages of 100 (the server's clamp, dream-os `src/api/vendor/leads.js`, GET `/:vendorId`) until it reaches `total`, and de-duplicates rows by id because a lead filed between two pages shifts the newest-first order by one. A failed page returns that failure whole, never a short list.

`fetchLeads` gains an optional page argument; with none it sends the same URL as before.

`hooks/vendor/useLeadsData` now reads through `fetchLeadsWhole`. Its three readers (Leads, and the Invoices and Clients cross-chips) all see the whole list. Leads' search, filters and sort therefore run over every live lead.

No control was added and no string changed. Every Leads control from AUDIT-1 §12 is KEPT.

**Disclosure 2 (ratified).** The pager lives in the API client and the hook calls it, because the native law keeps API clients framework-agnostic.

## §2 · What is proven

**`b78_lc1_leads_whole_bench`: 14/14 on the cured tree.**
- It drives the real `vendor.ts`, transpiled in memory, over a double of the route's contract, with 26 leads (DEV440's live count, founder SELECT Q-LC1-B).
- Four mutations of production source turn their named cells RED.

**At base `89f18af7`: 2 pass, 12 fail.** Accepted as disclosed: §1.6 (the old URL is unchanged) is red at base by construction, because the cells short-circuit when `fetchLeadsWhole` is absent. It is not red by behaviour.

**`tsc --noEmit`:** exit 0 on the cured tree.

**`b40_worklist_shell_bench`** reads the leads route path. Its reds are C50 and C102 on both the cured tree and the base, the same cells (F-42.94's standing reds), so there is no change from this packet.

**`next build`** is the founder's gate at apply (R-40.66) and rides the verify line.

## §3 · The walk (card e)

This step starts only when the Vercel deployment for dreamos-pwa shows the commit you pushed.

On the deployed pwa, signed in as DEV440 (9888294440), open Leads and scroll to the end. All 26 live leads should be reachable.

Evidence:
- a screenshot of the last row;
- the founder SELECT count (Q-LC1-B, already pasted: live 26).

Only your handset can witness that scrolling to the last row is comfortable by thumb. There is no paging control to reach.

## §4 · What LC-2 picks up

Nothing from this packet. The list stays a whole read until a volume ruling says otherwise.

Sequencing beyond this sitting is the founder's.
