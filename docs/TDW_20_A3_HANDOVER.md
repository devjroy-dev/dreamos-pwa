# TDW_20 · CONCIERGE s1 · PACKET A3 — HANDOVER (dreamos-pwa)

**Cut by** LE-A under CE-41 **at** dreamos-pwa `08a31d7e314a5ac467cd244774fc6312e39191cd`, sibling dream-os `1feb1cc0b836d639b5d30fb14eeb62dbfd9d45f9` (A2, banked), preflight CLEAR. **Rulings executed:** R-41.1/.2/.5, R-41.17, R-41.19, R-41.24–.28, R-41.33 (the A1 veto, every string by number), §6.1–.7; F-41.1 cured, F-41.2 closed. `tsc --noEmit` clean. **Status:** proven in the seat; `next build` and the walk are the founder's (R-40.66, §7).

## 1 · What shipped (25 files; `scripts/floor-manifest-ce41-a3.txt`)

| file | what |
|---|---|
| `app/(frost)/frost/canvas/assistance/page.tsx` | **the sheet** (S1) and after-Send (S2, #30/#31 struck): date · city · area · the eleven canonical rows with a `Rs` each (mehendi under `other`, R-41.27) · the look · Send. Strings #6–#33 as vetoed; `formatRs` for money; `waNumberFor('bride')` for the WA link; nothing writes to `couples` (R-41.25). Every type size on a rung (tdw09 6.12). |
| `lib/frost-api/assistance.ts` | the couple's client: `submitAssistanceRequest` → `POST /api/v2/couple/assistance`; `ASSIST_ROWS` (the eleven, veto order). |
| `components/frost/AssistPopup.tsx` · `lib/frost/assistPopup.ts` | **the popup** (P1, #1–#5 as ruled) as a bottom sheet over the sanctuary (R-41.28); the §6.1 rule as a pure function — once per login, dismissable, never after her first request, never after her second dismissal — benched on every branch. |
| `app/(frost)/frost/canvas/sanctuary/page.tsx` | three lines: the `discover` label → `Discover · Storefront`; the popup import; its one mount. |
| `components/frost/blooms/discover.tsx:130` · `app/components/couple/MuseRow.tsx:69` | the other two bytes (R-41.17). |
| `components/frost/blooms/meridian.tsx` | **folded** (R-41.19/.24): `MeridianConciergeBtn` and its empty POST are gone; `MeridianConciergeCard` navigates to the sheet with #36/#37/#38 (the founder's phrase kept); compact form keeps its one word and navigates; chat surface byte-untouched. |
| `components/frost/blooms/settings.tsx` | the row #34/#35 → the sheet. |
| `app/(landing)/page.tsx` | **F-41.1**: on mount at `/`, `entryRedirectFor(getVendorSession(), getCoupleSession())` → `router.replace` (`/vendor/rooms` or `/frost`); nothing else moved. **F-41.2**: the stale "dream-os byte never built" comment deleted. |
| `lib/frost/entryRedirect.ts` | the pure rule (vendor wins if both; null otherwise). |
| `app/admin/assistance/page.tsx` · `lib/admin-api/assistance.ts` · `adminNav.ts` | **the queue** (A1): counts · pills · rows · detail with the brief · per item `Forwarded N of <fanout_default>` · forward to a TDW vendor (server-ordered search by trade + city, `Sent` once forwarded) · forward to someone not on TDW (handle · number · name) with the dark reason shown verbatim · typed intake · close. Registered under People, `ROUTE_MAP` LIVE. |
| `docs/mocks/TDW_20_CONCIERGE/TDW_20_VETO_SHEET.md` | annotated with the rulings; `TEMPLATE_BODIES.txt` marked superseded by seat B's filed bodies. |
| `scripts/b20_a3_assistance_pwa.proof.mjs` | 60 cells; GREEN cured, RED 9/48 at `08a31d7`. |
| seven sealed proofs | carried, labelled — §3. |

## 2 · Laws, measured
- **Copy law:** every couple-facing byte is the veto sheet's number; no persona name in any new chrome (bench §8). **Wallet law:** `formatRs` only; no glyph. **R-40.19** apostrophes typographic.
- **Radius (R-40.64):** the bench walks `app/(frost)` + `components/frost` + `MuseRow` and finds no rendered bare `Discover` left; admin strings untouched.
- **Control inventory (CE-115):** Meridian's POST tap REMOVED-BY-RULING → the card (navigates); chat input/send/history/Clear KEPT; Settings' date/budget/publish/WA/sign-out KEPT + one row; landing sign-in/role/doors KEPT + one effect.
- **Type ladder:** the seat's first cut used 44/15/13/12; tdw09 6.12 reddened and was NOT amended — the bytes moved onto rungs (46/16/11).

## 3 · The seven carries (chair's c-41.6 class — a sealed bench's subject moved by ruling)
| proof | cell | carry |
|---|---|---|
| `tdw07_p1_discover` · `tdw07_p6_fold` | §0.4 canary | re-anchored to `const go = () => router.push(ASSIST_SHEET_PATH);` (the concPulse keyframe left with the button) |
| `tdw09_frost_parity` | 2.2 | `EXPECTED[discover]` = `Discover · Storefront` (ruled) |
| `tdw10_p1_shell` | disk 34→35 · rows 37→38 · LIVE 18→19 | one new LIVE admin route |
| `tdw13_d1_dead_tree` | 3 | eight survivors — the sheet |
| `tdw13_d6_parity_matrix` | 7 | the concierge affordance at its new mechanism (`router.push(ASSIST_SHEET_PATH)`) |
| `tdw15_p3_pulse` | §1 byte-pin | admits exactly the three ruled sanctuary lines, restored-equals-approved |

**The floor:** before 27 non-green at the clean tip (4 above the runner's stored base, all pre-existing: `b40_worklist_shell`, `b42_g11_wedding_pages`, `tdw09_hotfix`, `tdw37_leadgate_b_slot`); after, `--delivery` with the manifest, **27 — identical set**; +1 GREEN (`b20_a3`). `tdw_f0774_vacuity_probe` refuses any undeclared-dirty tree by design; under `--delivery` it runs.

## 4 · Named, not folded (the chair rules)
1. The admin queue uses the cockpit's `T` (navy/oxblood — every `/admin` page's one palette), not the mock's Graphite; a second palette in admin would be a second home.
2. The popup's three flags (`assist_popup_shown_for`, `assist_popup_dismissals`, `assist_requested`) are presentation state in `localStorage`, cleared with the couple's session; §8's "no localStorage in new code paths" is read as business logic. No read door exists yet for "has she requested" — seat D can replace the flag with the server's answer.
3. `getVendorSession()` can be a pre-PIN session; the F-41.1 redirect then lands on the pin gate — the existing guard, unchanged.
4. **The interval:** until Vercel deploys this tip, the live Meridian button POSTs `{}` into the 308 and shows its error state (`no_items`). Expected and named (A2 handover §4).

## 5 · The founder's steps
1. Apply · verify · push (the packet note). **`next build` is yours at apply (R-40.66).**
2. Vercel deploys the pushed tip; a push is not a deploy (R-40.87).
3. **The walk (kickoff §7), after the A2 steps are done — 0148 applied, fixtures confirmed (A2 handover §5.4), Railway at `1feb1cc`):**
   1. Sign in as the test couple `9625759924`; open `/frost`. **Witness:** the popup appears once (#1–#5). Tap `Not now`; reload — it does not return this login.
   2. Sign out and in again. **Witness:** it appears again (second dismissal allowed). Tap `Find my vendors`. **Witness:** the sheet, date and city pre-filled from her profile.
   3. Tick Makeup `Rs 40,000` and Photography `Rs 2,50,000`, type the look, Send. **Witness:** `Sent. We're on it.` and the echo card; on ADMIN_PHONE one WhatsApp line. Reload `/frost`: no popup, ever again.
   4. Open Meridian. **Witness:** the card `Want a personal concierge?` / `Ask a Personal Concierge →` opens the sheet; the old heartbeat button is gone. Open Settings: `Wedding assistant` row opens the sheet. The rail's first row reads `Discover · Storefront`; the bloom's title matches; the Muse empty state matches.
   5. Open `/admin/assistance`. **Witness:** the request in Open with two items. Forward Makeup → `MAKEUPBYSWATIROY` (search `swati`). **Witness:** toast `Lead created for MAKEUPBYSWATIROY · source tdw_assist`; the item reads `Forwarded 1 of 3`; the request moves to Forwarded. In her Leads room (sign in as `8595356978`): a lead from The Dream Wedding, `tdw_assist`, with the brief.
   6. Forward Photography → someone not on TDW: handle `@dev440`, number `9888294440`, name `Dev` (R-41.45: stands in because the arm is dark). **Witness:** toast `Recorded, not sent — template.tdw_assist_lead_outside is off in the capabilities register (stub; seat C ships the register)`; the row reads `dark`; Railway log line `[assistance:forward] … status=dark — NOT SENT`; nothing arrives on 9888294440. Then discard the prospect row it made (`POST /api/v2/admin/prospects/<id>/discard`, or the Prospects page's Discard).
   7. Sign in as vendor DEV440 `9888294440`; type the domain. **Witness:** `/vendor/rooms`, not the marketing page. Sign in as the couple; type the domain. **Witness:** `/frost`.
   8. Paste back the A2 handover §5.5 SELECTs.

The walk outranks every bench; a disagreement is a finding against the instrument.

Sequencing beyond this sitting is the founder's.
