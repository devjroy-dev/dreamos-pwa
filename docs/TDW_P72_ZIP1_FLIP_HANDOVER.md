# P7.2 · ZIP 1 — THE FLIP (arm (a)) · HANDOVER

**Base** dreamos-pwa `worklist` **659df90** (origin = HEAD at preflight, behind 0) · dream-os `main` a0f6fff. `tsc --noEmit`: **exit 0** at the cut. `b40`: **FLOOR GREEN** (88 cells). `modeBridge` 12/12. `bands.proof` 11/11. Seat: P7.2 LE (two instances; the bank note reconciled at resume, nothing outside it).

## §0 · APPLY — three blocks, each its own STOP

The chain cannot delete. Block 2 IS the flip (R-39.24: the flip day is the delete date, one commit).

```
unzip -o TDW_P72_ZIP1_FLIP.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP1_FLIP.zip
```

```
git rm -q -r 'app/vendor/discover/page.tsx' 'app/vendor/discover/preview/page.tsx' 'app/vendor/discover/profile/page.tsx' 'app/vendor/discover/submit/page.tsx' 'app/vendor/onboarding/page.tsx' 'app/vendor/pin-login/page.tsx' 'app/vendor/pin-reset/page.tsx' 'app/vendor/pin/page.tsx' 'app/w/WorklistBoot.tsx' 'app/w/advisor/page.tsx' 'app/w/billing/page.tsx' 'app/w/books/page.tsx' 'app/w/calendar/page.tsx' 'app/vendor/calendar/screen.tsx' 'app/vendor/list/[slice]/clients.tsx' 'app/w/clients/page.tsx' 'app/w/collab/[post_id]/responses/page.tsx' 'app/vendor/collab/[post_id]/responses/screen.tsx' 'app/w/collab/page.tsx' 'app/vendor/collab/screen.tsx' 'app/w/contracts/page.tsx' 'app/vendor/contracts/screen.tsx' 'app/w/couture/page.tsx' 'app/vendor/couture/screen.tsx' 'app/vendor/list/[slice]/events.tsx' 'app/w/events/page.tsx' 'app/vendor/list/[slice]/expenses.tsx' 'app/w/expenses/page.tsx' 'app/vendor/list/[slice]/invoices.tsx' 'app/w/invoices/page.tsx' 'app/w/layout.tsx' 'app/vendor/list/[slice]/leads.tsx' 'app/w/leads/page.tsx' 'app/vendor/list/[slice]/notes.tsx' 'app/w/notes/page.tsx' 'app/w/page.tsx' 'app/w/portfolio/page.tsx' 'app/vendor/portfolio/screen.tsx' 'app/w/rooms/page.tsx' 'app/w/settings/page.tsx' 'app/w/storefront/page.tsx' 'app/vendor/storefront/screen.tsx' 'app/w/support/benchmarks/page.tsx' 'app/w/support/google/page.tsx' 'app/w/support/marketing/page.tsx' 'app/w/support/page.tsx' 'app/w/support/proof/page.tsx' 'app/w/support/seo/page.tsx' 'app/w/support/website/page.tsx' 'app/w/tds/page.tsx' 'app/vendor/tds/screen.tsx' 'app/w/team/page.tsx' 'app/w/today/page.tsx' 'app/vendor/billing/page.tsx' 'app/vendor/calendar/page.tsx' 'app/vendor/collab/[post_id]/responses/page.tsx' 'app/vendor/collab/page.tsx' 'app/vendor/contracts/page.tsx' 'app/vendor/couture/page.tsx' 'app/vendor/discover/leads/page.tsx' 'app/vendor/featured/page.tsx' 'app/vendor/layout.tsx' 'app/vendor/list/[slice]/page.tsx' 'app/vendor/list/page.tsx' 'app/vendor/more/page.tsx' 'app/vendor/page.tsx' 'app/vendor/portfolio/page.tsx' 'app/vendor/settings/page.tsx' 'app/vendor/storefront/page.tsx' 'app/vendor/studio/notes/page.tsx' 'app/vendor/studio/page.tsx' 'app/vendor/studio/tasks/page.tsx' 'app/vendor/studio/team-payments/page.tsx' 'app/vendor/studio/team/page.tsx' 'app/vendor/tds/page.tsx' 'app/vendor/team-hub/page.tsx' 'app/vendor/team-hub/screen.tsx' 'components/vendor/BottomNav.tsx' 'components/vendor/Cabinet.tsx' 'components/vendor/FreshThreadControl.tsx' 'components/vendor/OnboardingOverlay.tsx' 'components/vendor/PeekNav.tsx' 'components/vendor/Splash.tsx' 'components/vendor/SuggestionChips.tsx' 'components/vendor/VictorModeChip.tsx' 'hooks/vendor/useInShell.ts' 'lib/vendor/briefing.ts'
```

```
git add -A && git commit -m "P7.2 ZIP 1: the flip — the shell serves /vendor/*, the old tree deleted in the same commit; FORK 4 (paid/owed cured at the shell), FORK 6 (istDay), b40/wl_audit/wl_render amended [R-39.24 · F-2b2.3 · F-38.3 · F-39.79]" && git push origin worklist
```

Then at the founder's tree, before the walk: `bash tools/preflight.sh` · `node_modules/.bin/tsc --noEmit -p .` · `node scripts/b40_worklist_shell_bench.js`.

## §1 · WHAT MOVED
- `app/w/*` → `app/vendor/(shell)/*` by `git mv` (route group; URLs are `/vendor/…`). Nine old pages replaced in place; bodies co-located (`<room>/screen.tsx`, `<room>/body.tsx`). `/vendor` → `/vendor/rooms`.
- Survivors in `app/vendor/(legacy)/`: pin ×3, onboarding, discover hub/submit/preview/profile (FORK 1 arm (a); F-39.77). Its layout: ThemeProvider + SW registrar **only** — no AskProvider (zero `useAsk()` callers there, derived), no Splash, no BottomNav, no lane-key write path (**F-38.3 CLOSED for this lane**).
- DELETED (block 2): old chat page (`WeddingChatPage`), old layout, `list/`, `studio/`, `team-hub/`, `more/`, `featured/`, `discover/leads/`; `BottomNav`, `Splash`, `PeekNav`, `SuggestionChips`, `VictorModeChip`, `FreshThreadControl`, `OnboardingOverlay`, `Cabinet`; `useInShell` (11 readers, 15 old-chrome arms collapsed, `tsc`-forced); `lib/vendor/briefing.ts` (0 readers).
- 44 quoted `/w/` literals → `/vendor/` (36 code + 8 in comments, same files). `public/worklist-manifest.json` `start_url` → `/vendor/rooms` — a served byte the code census missed; C31 now reads `public/` too.
- `rooms.ts`: six INTERIM/FALLBACK censuses (369 lines, zero code readers) → `LEGACY_VENDOR_LINKS` (hub, preview, profile, onboarding). `RoomsGrid` `data-interim` retired (would have marked all nineteen).
- **FORK 4** (ratified): `paid`/`owed` dropped from the two arrays and `CabinetResponse`; the third reader (`SliceShell` invoices masthead via `deriveMoney`) cured at one home — `useInvoicesData` returns rows + the typed GET's `summary` on one cache row; the masthead reads `summary.total_outstanding` (OUTSTANDING_STATES, server-side); open count = rows with `payAmount > 0`; copy byte-identical. `moneyBinders`/`deriveMoney`/`MoneyDerivation` retired; `pendingOf` stays. **F-2b2.3's premise corrected:** the readers were the shell's, not the old pages'.
- **FORK 6**: `lib/vendor/istDay.ts` (two functions mirrored from `istClock.js`); cured `SliceShell` (two sites), `AddSheet:231`, `invoices/body.tsx:18` (found in the build), `tds/screen.tsx:94`, `derive.ts:121–123`. Vendor-lane UTC-day census: **zero**. `derive.ts` imports `./istDay` relatively — the bands proof compiles under the `@/` alias but runs without it.
- Bench side: b40's 36 path literals; **C12 C17 C24 C26 C28 C30 C31 C35 C44 C58 C67 C82 amended, labeled** (C24/C31/C82 inverted; C26 re-keyed to the Header's (legacy)-only census; C31 renamed, walk widened to index/Rooms/Today, **both-ways**: a planted `/w/` literal reds, a door onto the deleted tree reds, the manifest byte reds C17 + C31; restored green). `wl_audit.mjs` R-38.1 arm inverted onto `LEGACY_VENDOR_LINKS`; `wl_render.cjs` C-R9b + two fallback frames retired as the file itself said; `bs_audit`, `b50`, nine subject benches, `f04_94`, the mode-bridge proof (§3 re-keyed from href-prefix to "no shell surface reads the lane key") re-keyed. **F-39.79 cured**: C31's `blankComments` is a one-line consumer of `scripts/lib/stripComments.cjs`.

## §2 · THE BASE — 23 RED + 1 ERROR + 1 REFUSED → **31 RED + 1 ERROR + 3 REFUSED**, every line named
21 of the 23 stand by name. Moved or added:

| line | was | now | reason |
|---|---|---|---|
| `b41_theme_bleed_fixture` | ERROR | **green** | the F-39.67 throw's subject (the carried tree) is gone |
| `tdw09_surface` | RED | REFUSED | subject deleted: the Edit Member sheet — per-cell retirement **OWED (1b)** |
| `tdw09_type` | RED | ERROR | three reads of the deleted studio page struck; floor channel vs bare run disagree — **NOT DERIVED (1b)** |
| `tdw_f0774_vacuity_probe` | — | REFUSED | reason **NOT DERIVED (1b)** |
| `obp_vendor_form` `tdw06_m3_report_chip` `tdw09_home` `tdw09_hotfix` `tdw09_money` `tdw09_p2r1` `tdw09_walkrider` `tdw10_tier` | — | RED | **OWED — ZIP 1b**: old-chat-page (and PeekNav / Cabinet / VictorModeChip / OnboardingOverlay / discover-leads) cells to be struck, assertions quoted; surviving reads already re-keyed. `tdw10_tier` also F-39.80 (four stale reads that predate this seat) |
| `tdw09_p2b` | — | RED | 5.2 only — **OWED**: the provenance comment re-keyed after the move |
| `tdw_f3942_census_guard` | — | RED | **OWED**: capture refresh (four unbalanced-`/*` files left the tree; the bench says non-gating) |

## §3 · CORRECTIONS OWNED
c-P72.1 the kickoff's `components/vendor/slices/Cabinet.tsx` does not exist; `components/vendor/Cabinet.tsx` was the file. c-P72.2 the two root ZIPs were already absent at 659df90. c-P72.3 FORK 1's reachability walk missed Storefront's Discover row (`storefront/screen.tsx:120`); the hub was shell-linked all along — declared. c-P72.4 a RoomsGrid comment of mine wrote `/vendor/*` and blinded C31's stripper to the tile line (found by the mutation; purged in three files, one pre-existing at `AccountDrawer.tsx:10`). c-P72.5 the read-first's "33 old-chrome arms" counted comments; the code figure is 15. c-P72.6 a `git stash`/`pop` unstaged the deletions mid-build and let `tdw_stripper_census` read ghosts through `git ls-files` — cured by staging; the founder's chain carries block 2 for the same reason.

## §4 · FOUNDER CARD — ZIP 1 arms only (②③⑤⑧⑨; ①④⑥⑦ wait for ZIP 2)
② `/vendor/today` renders the shell (identity = this commit); `/w/today` 404s ③ Rooms: 19 tiles, every one at `/vendor/…` ⑤ `/vendor/list/invoices`, `/vendor/team-hub`, `/vendor/studio/team` → 404, never old chrome; `/vendor/discover/preview`, `/vendor/discover/profile`, Storefront → Discover, Settings → preview all render ⑧ the invoices room's Outstanding figure renders from the typed summary; Books; a PDF ⑨ light mode holds across ②③⑤⑧. The Beta badge and the Report door are ZIP 2's — absent here by design.

## §5 · NOT IN THIS ZIP
Arm C (L-1, badge, Report door, the ten-cell landing ledger) · Arm D (the four keys, F-39.72) · FORK 3 port · Arm E (dream-os companion: `cabinet.js` slices on "readers cured at the shell", `pwaPaths.leadsList` → `/vendor/leads`, b48 §1 inverted) · ZIP 1b's ledger (§2). `wl_audit`/`wl_render` amended but not run here (need a live host).
