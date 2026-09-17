# repo: dreamos-pwa @ e7029aa7a80bed60c25784273739957255a74267
# TDW · CE-43 · SEAT LC-2 · PACKET 2 · HANDOVER (the dreamos-pwa packet) · 2026-09-17

Cut on dreamos-pwa `e7029aa7a80bed60c25784273739957255a74267` (packet 1, r3), re-derived at origin at the moment of cutting. The dream-os half is at origin as `5156958ed891f403747287c285ec5269c3335db5` (parent `2d3be4e`), checked: its changed set equals the dream-os P2 manifest (7 files) and every file is byte-identical to the final ZIP. Rulings and the server's contract are in dream-os `docs/handovers/TDW_CE43_LC2_P2_HANDOVER.md`.

## §1 · What shipped

| File | What |
|---|---|
| `app/vendor/(shell)/packages/page.tsx` | The Packages room, live and redesigned (C-43.16): folded cards, the fee leading, the fee affordance wired to the edit sheet, the payment bar from the server's `split`, the summary line, quiet actions with P7, the default rule, the dashed Add tile. Tokens only. |
| `components/vendor/packages/PackageFields.tsx` | NEW. The sheet chrome and the name, description and items editor both sheets share (P8). |
| `components/vendor/packages/PackageEditSheet.tsx` | NEW. Create and edit (P6 to P10, P12), fee focus, the gates, the refusal mapping. |
| `components/vendor/packages/LeadPackageCard.tsx` | NEW. The package on a lead (A1 to A9) and the attach sheet (A3, A4, F23's edits with P8's bytes). |
| `components/vendor/slices/SliceShell.tsx` | Packet 1's inline shell card is replaced by `<LeadPackageCard>` on the leads detail. |
| `lib/vendor/api/vendor.ts` | The four package writes, the lead-package read and attach, their types. |
| `lib/worklist/packages.ts` | Packet 2's vetoed bytes, F26's `scheduleLabel`, R-42.13's `packageDate`, A5's `scheduleRow`, F21's `splitNumerals`, A9's four lines, and the eight PENDING failure bytes. |
| `scripts/b80_lc2_p1_shell_bench.js` | AMENDED BY LABEL: §2.5, §2.6, §2.8 and §5 now hold packet 2's live facts; M6 and M9 re-aimed. |
| `scripts/b81_lc2_p2_room_bench.js` | NEW, rung b81. |
| `scripts/floor-manifest-lc2-p2-pwa.txt` | The declared dirt, with the new folder's own line. |

## §2 · C-43.16, as built

1. **Everything starts folded.** The open state starts empty; nothing opens on arrival (b81 §3.1, M5).
2. **The fee affordance.** "Fee not set" is a `<button>` in the accent with a dashed underline that opens the edit sheet with Fee focused (b81 §3.2, §4.1, M6, M10). A set fee is a plain figure in the display face, not a button, with no underline (§3.3).
3. **Tokens, not hex.** Every colour in the room, both sheets, the card and the copy home is a `var(--atelier-*)` token (b81 §6.1, M14; b80 §5.5). Chalk is the default theme and Graphite applies under `[data-theme="dark"]` (`app/globals.css:18`, `:132`); the same tokens resolve in both. **The two-theme screenshots are the founder's, on the walk (§6 below).**
4. **The chevron** is `ChevronDown` from `lucide-react`, an existing dependency (`package.json:13`, `^1.8.0`; imported in e.g. `app/(frost)/frost/canvas/surprise/page.tsx:13`). No new dependency (b81 §7.1). **The payment bar** draws the server's `split` with the accent token, the accent at 0.45 and the ink at 0.22; two parts when the middle payment is off. **The numerals** are shares until every part is priced, then whole rupees (b81 §1.8, §3.4, §3.5, M3, M7). No date in the room (§3.6).
- The summary line is the first three detail values joined, the vendor's own data (§3.7). Detail labels render as the vendor wrote them. Delete sits right in the muted ink behind P7 (§3.8, M8).

## §3 · The eight failure bytes (PENDING the chair's veto, C-43.16 delegation)

The vetoed set carries no failure or gate lines for these surfaces. Proposed, in the estate's existing patterns (`Could not save the milestone.`, `Give the member a name to save them.`):

| Key | Proposed | Where |
|---|---|---|
| saveFailed | Could not save the package. | edit sheet, network or 500 |
| deleteFailed | Could not delete the package. | room |
| defaultFailed | Could not set the default. | room |
| defaultRace | Another change landed first. Try again. | room, the door's 409 `default_race` |
| attachFailed | Could not attach the package. | attach sheet, network or 500 |
| nameGate | Give the package a name to save it. | both sheets, a blank name |
| remainderGate | Leave part of the fee for the remainder. | edit sheet, shares at or over 100 |
| fieldGate | Check the highlighted field. | both sheets, any other field refusal |

Carried estate bytes, not new: `Select…` (the attach sheet's empty option, as `ClientBookingSheet`), `COPY.surfaceUnavailable`.

## §4 · What is proven

**`b81_lc2_p2_room_bench`: 56/56 on the cured tree**, run from `/tmp`: the copy home and the API client driven through the real TypeScript; the room, the sheets and the card read from comment-stripped source; fourteen mutations of production source, each turning its named cell RED.

**Both ways.** On a fresh clone of `e7029aa7` with the bench copied in: 2 passed, 54 failed. The greens are §3.6 (packet 1's room already showed no date) and §7.1 (lucide already ships the chevron): true facts at base.

**`b80_lc2_p1_shell_bench`: 48/48** after the labelled amendments. Before them, packet 2 moved exactly nine cells, all packet 1 shell facts that packet 2 retires; none was a new defect.

**`tsc --noEmit` on the whole tree: exit 0.**

**Readers of the touched files, base and cured identical by exit code and failing-line count:** b40, b42, b57, b69, b70, b73, b74, b75, b78, `ce41_brand_family`, and the proofs b20_a3, tdw06_f06133, tdw06_m3, tdw07_p4a, tdw07_p4b, tdw09_hotfix, tdw09_uivendor, tdw10_tier, tdw19_p2a, tdw37_hygiene, tdw37_leadgate_b_slot, tdw41_g34s2, tdw_f0774_readers.

**Not run in the seat's container, declared before the cut:** the full pwa floor (the 300 s limit); `next build` (Google Fonts are unreachable here, F-40.134); rendering on a device and the two-theme screenshots (no browser); the database. **The founder's provisional apply is their witness, before this ZIP is called final.**

## §5 · Control inventory (CE-115)

- **Packages room:** as the page's header states. Packet 1's controls KEPT and now acting; ADDED the fold toggle, the fee affordance, and the confirm's Cancel and Delete; REMOVED BY RULING the boxed buttons and the always-open card.
- **Lead detail:** the package card's `Attach package` KEPT and now acting; ADDED `Change package` once attached. Every other lead control untouched. The swipe-right `Booked` is still packet 3's (F15(a)).
- **Clients sheet:** untouched (packet 3 wires it).

## §6 · The walk (card P2; the founder performs and pastes)

Start when Vercel's dreamos-pwa production deployment reads Ready on the commit you push for this packet, and Railway's vendor service is Active on a deployment newer than `5156958`. **Fixture read first (Q-LC2-P2f · read-only).** Step 6 needs Sarah's wedding date at day precision (F24). Witness: `public.leads` id, name, wedding_date, wedding_date_precision, deleted_at (`docs/db/PUBLIC_SCHEMA.md` at ladder 0168, dream-os).

```sql
select id, name, wedding_date, wedding_date_precision, deleted_at
from public.leads
where id = '88dbb52b-c275-420c-bb12-1c84403bf139';
```

Expect `Sarah`, `2026-12-22`, precision `day` or empty, not deleted. If the precision reads `month` or `year`, step 6 will show `Add the wedding date first.`, which is correct behaviour; paste it and the seat names another lead.

On the phone, signed in as DEV440 (9888294440):

1. **The room, Chalk.** Open Packages. Three packages, all folded: `Photographs`, `Photographs and film` (accent rule, `DEFAULT` under its name), `Photographs, film and album`. Each shows a summary line, "Fee not set" underlined at top right, and a bar with `30 · 30 · 40`. **Screenshot.**
2. **The fee affordance.** Tap "Fee not set" on `Photographs and film`. The sheet opens with the Fee field focused. Type `80000`, tap Save: `Package saved.` The card now shows `Rs 80,000` (no underline) and the bar reads `Rs 24,000 · Rs 24,000 · Rs 32,000`.
3. **Fold and edit.** Tap `Photographs` to open it: description and items appear. Tap Edit, rename it `Photographs, one day`, change the Team detail, Save. Tap the card again to fold it.
4. **Default and delete.** Open `Photographs, one day`, tap Set as default: `Default set.`, and the rule and chip move to it. Open `Photographs, film and album`, tap Delete: P7's line appears; tap Cancel, then Delete, then Delete: `Package deleted.`, and it is gone. (It will not return; seeds are once, ever.)
5. **Add.** Tap the dashed Add package tile, name it `Pre-wedding shoot`, fee `50000`, Save. It appears last.
6. **Attach.** Open Leads → Sarah (22 December 2026). The card reads `PACKAGE` and `Attach package`. Tap it: `Attach a package`, with `Photographs, one day` preselected (the default after step 4). Choose `Photographs and film`; Fee for this couple shows `80000`. Tap Attach package. The card shows `Photographs and film`, `Rs 80,000`, and three lines:
   - `Deposit, 30% of the fee, on booking · Rs 24,000 · {today, full month}`
   - `30% one month before the first function (optional) · Rs 24,000 · 22 November 2026`
   - `The remainder, on delivery, before the work is handed over · Rs 32,000 · 5 February 2027`
   - then `Delivery · 5 February 2027` and `Counted from the wedding date.`
   **Screenshot.** The button now reads `Change package`.
7. **A refusal.** Open a lead with no wedding date (e.g. a `Dream Wedding enquiry` with an empty date), Attach package, attach: the sheet says `Add the wedding date first.` **Screenshot.**
8. **The rows.** Run Q-LC2-P2a and Q-LC2-P2b below.
9. **Graphite.** Switch the app to the dark theme and open Packages and Sarah's card again. **Screenshot of each.**

Truths only the handset holds: both palettes on the room, the sheets and the card (R-42.6); the fold and the fee tap under a thumb; the bar's legibility at phone width.

**Q-LC2-P2a · read-only** (witness: `public.vendor_packages`, `docs/db/PUBLIC_SCHEMA.md` at ladder 0168 in dream-os):

```sql
select seeded_from, name, is_default, total, deleted_at is not null as deleted
from public.vendor_packages
where vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742'
order by created_at, seeded_from;
```

Expect four rows: `photography:1` renamed `Photographs, one day`, the only default; `photography:2` with total 80000, not default; `photography:3` deleted, not default; `Pre-wedding shoot` with total 50000, no seed key, not default.

**Q-LC2-P2b · read-only** (witness: `public.lead_packages`, same doc):

```sql
select lp.total, lp.snapshot->>'name' as name, lp.schedule, lp.delivery_on, lp.deleted_at
from public.lead_packages lp
where lp.vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742'
order by lp.created_at;
```

Expect one live row for Sarah: total 80000, name `Photographs and film`, schedule amounts 24000, 24000, 32000 with the three dates above, delivery_on `2027-02-05`.

## §7 · What packet 3 picks up

The promotion act and the booking sheet (A2's `Booking confirmed` and `Advance paid`, A10 to A13); the swipe-right `Booked` moved to the booking sheet (F15(a)); the Clients sheet wired to promotion; the invoice minted from the attached package; rungs b83 (dream-os) and b82 (pwa); the pre-cut note naming the benches the seat cannot run, and a provisional apply before either ZIP is final.

Sequencing beyond this sitting is the founder's.
