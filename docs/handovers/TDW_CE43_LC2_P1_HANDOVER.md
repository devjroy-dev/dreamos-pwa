# repo: dreamos-pwa @ 409a130e27a762b2e8e78796b4022e2a815151b7
# TDW · CE-43 · SEAT LC-2 · PACKET 1 · HANDOVER (the dreamos-pwa packet) · 2026-09-17

Cut on dreamos-pwa `409a130e27a762b2e8e78796b4022e2a815151b7`, re-derived at origin at the moment of cutting (unmoved since charter). The dream-os packet is at origin as `2d3be4eda5ac6a15f0585b948f30c41c115173e2` (parent `713340a6`), re-derived by `git ls-remote` before this cut and checked: its changed set equals the dream-os manifest (14 files) and every file is byte-identical to the r3 packet. The dream-os half, the migrations, the regen, the veto record and the rulings are in dream-os `docs/handovers/TDW_CE43_LC2_P1_HANDOVER.md`.

## §1 · What shipped (R-42.14: the shells, whole)

| File | What |
|---|---|
| `lib/worklist/rooms.ts` | The `packages` room (label P1 `Packages`, work band, `/vendor/packages`) immediately after Leads (F18). `ROOM_COUNT_EXPECTED` 19 → 20, `GRID_TILE_COUNT_EXPECTED` 18 → 19, `TOP_BAND_EXPECTED` 9 → 10; `FROZEN_ORDER` gains `packages` after `leads`. |
| `lib/worklist/packages.ts` | NEW. The one home for the vetoed bytes packet 1 renders: P2, P3 (C-43.15 plural), P4, P5, P6, P11, A1, the first A2 control, C1 to C3. Nothing unrendered ships (wire-or-delete at birth). |
| `lib/vendor/api/vendor.ts` | `fetchPackages()` and its types, read off the dream-os handler (`src/api/vendor/packages.js`, `PACKAGE_SELECT`). |
| `app/vendor/(shell)/packages/page.tsx` | NEW. The Packages room: reads the live list (the first open seeds, dream-os `ensureSeeded`), shows each package's name, description, line items and `Fee not set`, marks the default. `Add package`, `Edit`, `Set as default` (not on the default) and `Delete` each answer `Launching soon.`. A failed read says `COPY.surfaceUnavailable`. Default export only. |
| `components/vendor/slices/SliceShell.tsx` | The package card on the lead detail (leads only): eyebrow `Package`, control `Attach package` answering `Launching soon.`. Tokens only. |
| `components/vendor/ClientBookingSheet.tsx` | NEW. The re-shaped Clients Add sheet (R-43.5): Name, Phone, Wedding date, Package (default preselected), Fee (only when the chosen package has none, F8(a)), Advance received, Received on; `Add client` answers `Launching soon.` and writes nothing. |
| `app/vendor/(shell)/clients/body.tsx` | The Clients room's Add opens `ClientBookingSheet` instead of `AddSheet slice="clients"` (F-43.46). `AddSheet` is untouched (ruled); the demo route still renders its clients schema. |
| `app/favicon.ico` | F-43.74, chair-ruled (a): the three embedded PNGs (16, 32, 64) re-encoded from RGB to RGBA with fully opaque alpha. Pixels identical; the mark is unchanged and only the container format moved (R-40.129). |
| `public/brand/favicon.ico` | F-43.75: the same RGBA bytes as `app/favicon.ico`, as the CE-41 one-family law requires (`scripts/ce41_brand_family.mjs`). |
| `scripts/b40_worklist_shell_bench.js` | C2 AMENDED BY LABEL (F-43.68): 19/18/9/9 → 20/19/10/9, and Books' index 5 → 6 (it is still beside Invoices and Expenses, the clause's ruling). |
| `scripts/b42_g11_wedding_pages_bench.js` | C1 AMENDED BY LABEL (F-43.68): the same four constants, twenty rooms, the work band 9 → 10. |
| `scripts/b80_lc2_p1_shell_bench.js` | NEW, rung b80 (chair-allocated; b79 stays held). |
| `scripts/floor-manifest-lc2-p1-pwa.txt` | The declared dirt, including the new folder's own line (F-43.71's lesson). |

## §2 · Control inventory (CE-115)

- **Packages room (NEW surface):** ADDED `Add package`, and per package `Edit`, `Set as default`, `Delete`, each ACKNOWLEDGE (`Launching soon.`) in packet 1. Shell chrome unchanged.
- **Leads detail:** every control from AUDIT-1 §12 KEPT. ADDED the package card with `Attach package` (ACKNOWLEDGE in packet 1). The swipe-right `Booked` is unchanged in this packet; F15(a) moves it to the booking sheet in packet 3.
- **Clients room:** every binder-card control KEPT. The FAB Add MOVED from `AddSheet slice="clients"` to `ClientBookingSheet`. Inside the sheet: Name and Phone KEPT; Email and Notes REMOVED BY RULING (R-43.5, C2); `Ask TDW →`, `All details ↓` and the draft-first chips REMOVED BY RULING (a promotion files no half client); Wedding date, Package, Fee, Advance received, Received on ADDED; `Add client` KEPT, its act MOVED from `POST /vendor/clients` to the promotion (packet 3; `Launching soon.` now); backdrop close KEPT.
- **Invoices:** untouched in packet 1.

## §3 · Copy

Every rendered byte is from the founder's veto of 2026-09-17 (recorded whole in the dream-os handover §2), with C-43.15 applied: package names in sentence case (dream-os parser), and P3 reading `What you offer · 1 package` for one. Two estate bytes are carried, not coined: `Launching soon.` (`lib/solutions/copy.ts`, R-42.12 AMENDED) and `This could not be loaded just now.` (`COPY.surfaceUnavailable`); the sheet's empty package option reads `Select…`, `AddSheet`'s existing byte.

## §4 · What is proven

**`b80_lc2_p1_shell_bench`: 48/48 on the cured tree**, run from `/tmp`. It drives the copy home and `fetchPackages` through the real TypeScript transpiled in memory (b78's technique, a `getJson` double), and reads the page, the card and the sheet from comment-stripped source. §7b reads `app/favicon.ico` from its bytes: the ICO directory and each embedded PNG's IHDR (three images; 16, 32, 64; each 8-bit RGBA) and §7b.4 holds `public/brand/favicon.ico` to the same bytes. §8 is eleven mutations of production source, each turning its named cell RED; M10 restores the 32 px image to RGB in a copy of the bytes.

**Both ways.** On a clean base worktree at `409a130e` with the bench copied in: 5 passed, 43 failed. The greens are §6.8 (`AddSheet` equals itself), §7b.4 (at base the two icon copies are also equal, a true fact the cure keeps), §7b.1 and §7b.2 (the base icon already holds three images at 16, 32 and 64: true facts, unchanged by the cure) and M10 (the base icon is already RGB, so the mutated cell reads red there by construction). §7b.3 is RED at base: that is F-43.74 itself. The four absence cells ("writes nothing", "no colour literal") are gated on the file or block existing; the first draft passed them vacuously at base, and that was fixed before cut.

**`tsc --noEmit` on the whole tree: exit 0.**

**b40 and b42.** Both are in the pwa floor base. Before the labelled amendments the cured tree added one red to b40 (C2) and three to b42 (the counts, twenty rooms, the band count). After them, each bench's red set is identical to its base red set, by name.

**Readers of the touched files.** Eighteen pwa benches read `rooms.ts`, `SliceShell`, `clients/body`, `api/vendor.ts`, `AddSheet`, `solutions/copy` or the new files; none changed its exit code between base and cured in this container.

**Not run in the seat container, declared (the chair's standing order from the r3 ruling):**
- the full pwa floor (`scripts/run-floor.sh`), which outlives the container's 300 s limit: the founder's verify floor is its witness;
- `next build`, which cannot fetch Google Fonts here (F-40.134, R-40.66): the founder's gate at apply.

## §4b · F-43.74 · `next build` refused `app/favicon.ico` (the r1 gate, cured in r2)

**What happened.** The founder's r1 verify ran tsc and b80 green, then `next build` failed: `./app/favicon.ico · Processing image failed · Format error decoding Ico: The PNG is not in RGBA format!`. He stopped before the git line.

**Pre-existing at `409a130e`, proven.** A fresh clone of the base with a real `node_modules` (no packet applied, no `.next`) fails `next build` with the same error. In the seat container the Google Fonts 403s (F-40.134) print beside it; the icon error is independent of them.

**The root.** `app/favicon.ico` was replaced on 2026-09-09 (`d274a07d`, then `96b3ac77`) with three PNG images in RGB (colour type 2). Next has been pinned at 16.2.3 since the repo's first commit (`package.json`), and its Turbopack refuses an RGB PNG inside an ICO. **Hypothesis, not fact:** builds since 2026-09-09 passed (LC-1's founder `next build`, Vercel production at `409a130e`) because each reused a build cache that had processed an earlier icon. Only Vercel's build log (a "Restored build cache" line on those deploys) would confirm it; the seat has not seen one. Filed to Block 09 as the root: a brand asset landed on 2026-09-09 in a format the pinned Next refuses, and no gate ran cold since.

**The cure (chair-ruled (a)).** The same three images re-encoded as RGBA with alpha 255 everywhere.
- Proven at the cut **by Pillow 12.1.1, an independent method from the bench (R-40.93)**: against `git show 409a130e:app/favicon.ico`, each of 16, 32 and 64 decodes to identical RGBA pixels, and every alpha value is 255. The bench (§7b) reads only the container (directory and IHDR bytes), never pixels, so the two methods fail differently.
- sha256: base `957ec3e2097b04bef8fbdd3336e68db1b9ec2666100c80176382cafa96a73563`, r2 `1a7f4d8d1ffe069a0e7799831231e9440437b8f5e1c4ee77b0ab27df92504453`.
- With the r2 icon on the clean base clone (`.next` removed), `next build` no longer reports the icon; the only errors left are the seat container's Google Fonts 403s. The founder's verify is the first full `next build` on it.
- **R-40.129:** the mark is unchanged; only the container format moved. No new ink.
- `next build` leaves no tracked dirt (`/.next/` and `next-env.d.ts` are ignored), so the founder's r1 tree held only r1's paths.

## §4b-ii · F-43.75 · the r2 floor delta: the one-family law (the seat's own defect)

The r2 verify ran b80 46/46 and a cold `next build` that **compiled successfully (110 pages, `/vendor/packages` among them)**, which is F-43.74's cure witnessed on the founder's machine. The floor then printed one delta: `ce41_brand_family` RED on `app/favicon.ico is the family's .ico · the two differ — that is a second brand, not a convention`. CE-41 (R-41.126, `7b76858c` 2026-09-09) holds `app/favicon.ico` and `public/brand/favicon.ico` to the same bytes; r2 moved the first and not the second. The seat did not grep for readers of the file it changed; the bench is not a reader of any other touched path, and the seat's container cannot run the pwa floor. r3 writes the same RGBA bytes to `public/brand/favicon.ico` (it held the same RGB bytes as the old app icon; `public/` is served as-is, so it never broke a build). `ce41_brand_family`: base 19/19, r2 18/19, r3 19/19. b80 gains §7b.4 (the two copies are equal) and M11. Chair-ruled YES (F-43.75); the family law stands and the bench is not amended.

**The r3 rehearsal, from the founder's exact state.** A fresh clone of `409a130e` with a real `node_modules`, r2 applied (13 dirty paths, as his tree), then the restore blocks as handed (seven tracked files restored, six new paths removed), `git status --porcelain` empty, `base_guard` SAFE, r3 applied: `tsc --noEmit` exit 0; b80 48/48; `ce41_brand_family` 19/19; `run-floor.sh --delivery` read 14 dirty paths, all declared (the full floor is the founder's); the git line parses under `bash -n`.

## §4c · The re-cut record (R-40.82, R-40.65)

r1 `TDW_CE43_LC2_P1_dreamos-pwa_409a130e.zip` (retracted, F-43.74); r2 `…_r2.zip` (retracted, F-43.75); r3 `…_r3.zip`, this packet. Origin `main` is `409a130e27a762b2e8e78796b4022e2a815151b7` at the moment of cutting r2, unmoved since charter, so no manifest path can collide with a newer origin version. `app/favicon.ico` (new at r2) was last changed at origin by `96b3ac77`, and `public/brand/favicon.ico` (new at r3) by `7b76858c`, both 2026-09-09. r2 against r1: `app/favicon.ico` (new), `scripts/b80_lc2_p1_shell_bench.js` (§7b and M10), `scripts/floor-manifest-lc2-p1-pwa.txt` (gains the icon) and this handover differ; the other nine files are byte-identical. At each re-cut the founder's tree held the previous packet applied and uncommitted, and its whole dirt was that one retracted deliverable, so no hunk needed separating (R-40.65): the modified tracked files were restored and the new untracked paths removed by name, ending on an empty `git status --porcelain` before the guard. r3 against r2: `public/brand/favicon.ico` (new), `scripts/b80_lc2_p1_shell_bench.js` (§7b.4, M11), the manifest and this handover differ; the other ten files are byte-identical.

## §5 · Drift and reports

- **The tenth tile.** The top band's grid is ten tiles on a three-wide grid, so one tile sits alone on its row, the state R-37.87 and R-40.99 had removed. Accepted under F18; the founder judges it on the walk.
- **`AddSheet`'s clients schema** now has no caller in the shell (the demo route still uses it). Left as ruled.
- **The swipe-right `Booked`** still writes the lead's state alone until packet 3 (F15(a), F-43.63).

## §6 · The walk (card P1; the founder performs and pastes; the seat reads)

**A push is not a deploy (R-40.87).** Start only when both hold:
- Vercel's dreamos-pwa production deployment shows the commit you push for this packet.
- Railway's vendor service shows a deployment newer than your dream-os push of `2d3be4e`, Active. Railway shows an id, not a commit; step 3 is the witness, because only `2d3be4e` serves the packages read. If step 3 shows `This could not be loaded just now.`, the dream-os deploy has not landed; stop and paste.

On the deployed PWA, signed in as DEV440 (9888294440):

1. **Rooms.** Open Rooms. In Your work, `Packages` sits right after `Leads`. The band now has one tile alone on its last row. Evidence: a screenshot. Only your handset can judge whether the tenth tile is acceptable.
2. **Open Packages.** Expect: `YOUR PACKAGES` above the title `Packages`; `WHAT YOU OFFER · 3 PACKAGES`; three packages in this order: `Photographs`, `Photographs and film` with a `DEFAULT` chip, `Photographs, film and album`; each with its description, its line items and `Fee not set`. Evidence: a screenshot of the whole list (scroll).
3. **The seed happened once.** Railway, the vendor service: one line `[packages:seed] vendor=23165e38-6510-4639-ab6a-9f35bab93742 seeded 3 (photography)` at your first open. Leave and reopen Packages: no second line. Evidence: the Railway line(s).
4. **The rows.** Run Q-LC2-P1 below. Expect three rows, `photography:1` to `photography:3`, names as in step 2, `is_default` true only on `Photographs and film`, `total` null, `deposit_pct` 30, `middle_pct` 30, `middle_enabled` true, `delivery_basis` `days`, `delivery_days` 45, `deleted_at` null.
5. **The acts.** Tap `Edit`, `Set as default` (it is absent on `Photographs and film`), `Delete` and `Add package`. Each shows `Launching soon.` and nothing changes. Evidence: one screenshot of the toast.
6. **The lead card.** Open Leads, tap any lead. Near the bottom of the detail: `PACKAGE` and `ATTACH PACKAGE`. Tap it: `Launching soon.` Evidence: a screenshot.
7. **The Clients sheet.** Open Clients, tap +. Expect `New client` with Name, Phone, Wedding date, Package (`Photographs and film` already chosen), Fee (shown, because that package has no fee yet), Advance received, Received on. Choose another package: Fee stays (none of the three has a fee). Tap `Add client`: `Launching soon.`, the sheet stays, nothing is written. Evidence: a screenshot of the sheet.

Truths only your handset holds: the Graphite and Chalk palette on the room, the card and the sheet (R-42.6); thumb reach to the last package and to `Add client`; the tenth tile.

**Q-LC2-P1 · read-only.** Witness: `public.vendor_packages`, dream-os `docs/db/PUBLIC_SCHEMA.md` at ladder 0168 (`## public.vendor_packages · 16 columns`).

```sql
select seeded_from, name, is_default, total, deposit_pct, middle_pct, middle_enabled, delivery_basis, delivery_days, deleted_at
from public.vendor_packages
where vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742'
order by seeded_from;
```

## §7 · What packet 2 picks up

- **Standing, from the chair's F-43.75 ruling (the third pwa cut for one packet):** the pwa pre-cut note names every bench the seat's container cannot run and asks the founder for a floor on the applied tree BEFORE the ZIP is declared final, so a red reaches the seat as a report and not the founder as a STOP.

- The Packages writes behind these controls; the attach behind `Attach package`; the schedule on the lead.
- The remaining vetoed bytes (P7 to P10, P12, A3 to A9).
- Rungs b82 (dream-os) and b81 (pwa).
- Its pre-cut note names the benches the seat cannot run.

Sequencing beyond this sitting is the founder's.
