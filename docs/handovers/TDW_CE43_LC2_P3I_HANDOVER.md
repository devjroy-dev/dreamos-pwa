# repo: dreamos-pwa @ fd4a77882531e5ef59526fa4e647d0a88389451c
# TDW · CE-43 · SEAT LC-2s · PACKET 3i · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut and provenance.**
- Cut on dreamos-pwa `fd4a77882531e5ef59526fa4e647d0a88389451c` (3h), re-derived at origin by `git ls-remote` at the moment of cutting.
- dream-os stands at `51399689e55bfb607bcc4d434a0c83abd2f689cb` (LC-2r's rest docs) and is untouched.
- The seat is LC-2s, the re-seat of LC-2r, which rested at its image limit with 3 to 3h banked and walked. Status for the re-seat: dream-os `docs/handovers/TDW_CE43_LC2R_REST_HANDOVER.md` (c-43.18).

**Scope and status.**
- No new byte. No new file outside `scripts/` and this handover.
- Rung unchanged (b82, by label).
- Findings used: none. F-43.114 onward stay unspent; §4 names candidates for the chair.
- Provisional under C-43.17 until the founder's floor on the applied tree is pasted.

## §1 · The ruling built (CE-43, the rest handover's line 2; confirmed at the LC-2s first-message ruling)

| Item | What | Where |
|---|---|---|
| **F-43.113** | An open lead detail follows its refetched row, as the invoice detail does (F-43.101). When the leads list refetches (a date filed from a chip, a booking made from the sheet), the open sheet takes the fresh row with the same id. So the `Still missing` chips, the Wedding date row and the booked badge update in place. | `SliceShell.tsx`, a leads twin of the F-43.101 effect beside it (the invoices effect is byte-untouched) |
| **F-43.113, the reads** | The detail's two reads (the lead's package and its conversation) are keyed on the lead's id (`selId`), not the row object. Following a row, or the booked badge set by `onBooked`, re-reads nothing and does not reset the timing marks. | `SliceShell.tsx`, the lead detail effect |
| **F-43.112** | Three User Timing marks, cleared at every open so they always belong to the lead just opened:<br>• `tdw:lead-detail:open` when the reads start;<br>• `tdw:lead-detail:card-rows` in the frame after the package card and the rows render together (the package read for this lead is in), once per open;<br>• `tdw:lead-detail:conversation` in the frame after the conversation lands.<br>Two measures follow from the open mark (`…:open→card-rows`, `…:open→conversation`). Nothing on screen reads them; a browser without the API skips them; a failure is swallowed. | `SliceShell.tsx` (`markLeadOpen`, `markLead`, `afterPaint`, `leadMarks`, `readyLeadId`) |

**Disclosed, for the chair (the arm the seat chose).** Keying the reads on the id is the seat's arm. The other arm (the reads keyed on the row object, as at `fd4a7788`) would make every followed row re-read the package and the conversation: up to four extra GETs after a booking, because the booking refreshes both the leads and the cabinet reads, and both rebuild the rows. It would also restart the marks mid-measurement. What the id-keyed arm gives up: `onBooked`'s badge patch no longer re-reads the package and conversation. Neither changes on a booking. One word from the chair reverses it (M49 is the cell).

## §2 · Control inventory (CE-115)

- **Lead detail.** No control added, moved or removed. The chips, the Wedding date row and the booked badge now update while the sheet is open.
- **Every other surface.** Untouched.

## §3 · What is proven

- **b82, cured.** 173/173. §16 is new (four cells), and so are M48 to M53. No existing cell changed.
  - §16.1: the leads follow.
  - §16.2: the reads are keyed on the id.
  - §16.3: DRIVEN. The helper block is transpiled on its own and run over a User Timing double and a frame double:
    - the marks and the measure appear in order, and a second open clears the first;
    - the mark lands only after two frames, and a cancel stops it;
    - with no API it skips without throwing.
  - §16.4: the card-rows mark is gated on this lead's package read and made once per open; the conversation's landing is its own mark.
- **b82, both ways.** On a clean worktree at `fd4a7788` with the amended bench copied in: 163 passed and 10 failed, exactly §16.1 to §16.4 and M48 to M53.
- **Readers of `SliceShell.tsx`, base and cured identical by exit code and failing-line count** (9 benches, derived by grep over `scripts/`, quarantine excluded):
  - green on both trees: b78, b80, b81, tdw37_hygiene_false_success, tdw41_g34s2_pwa;
  - non-green identically on both trees: b40_worklist_shell, tdw09_hotfix, tdw37_leadgate_b_slot, tdw_f0774_readers.
- **Type check.** `tsc --noEmit` exits 0.
- **ESLint** on `SliceShell.tsx`: the same 7 warnings as base, and no error.
- **The timing snippet** in §5 passes `node --check`.
- **Not run in the seat's container, declared before the cut:**
  - `next build` (Google Fonts are unreachable here, F-40.134);
  - rendering, timing and both themes on a device;
  - the database.

- **The full pwa floor, run in this container** on the delivery tree (`run-floor.sh --delivery scripts/floor-manifest-lc2-p3i-pwa.txt --check`, `npm ci` done, sibling dream-os at `5139968`): `FLOOR = NAMED BASE, no delta`. 40 reds, all in the named base, and 0 refusals outside it. The declared files were unmoved.

  The founder's verify (a cold `next build` and the floor on the applied tree) is the witness of record.

## §4 · Reported, not built (candidates for the chair to number)

- **The card under the booking sheet does not learn of an attach made inside the booking sheet.**
  - `BookingSheet.tsx` keeps the attached row in its own state (`onAttached={(row) => { setAttach(null); setNeed(null); setLp(row); }}`), and the attach door refreshes no slice.
  - So the lead's package card beneath still reads "no package" until the lead is reopened.
  - F-43.113 does not reach it: attaching a package changes no lead row.
  - The ruling named the chips, the Wedding date row and the badge, so this is not built. One arm: the booking sheet hands the attached row up, and the card takes it.
- **The invoice detail's schedule re-read on a followed row.**
  - The invoices schedule effect is keyed on `[sel, slice]` (`SliceShell.tsx`, "Fetch schedule when an invoice row is selected").
  - So since F-43.101, every refetch of the invoices list while a detail is open re-reads its schedule and redraws its loading state.
  - This predates 3i and is untouched. It is named because 3i's lead arm chose the other way.

## §5 · Card 3i (the founder performs and pastes)

Start when Vercel reads Ready on this push. dream-os is unchanged.

**Q-3i-a · the fixture, read-only, run FIRST.** Paste the rows. The seat names the lead for step 1 from YOUR rows; do not take step 1 until it has.

Witness: `public.leads` (id 1, vendor_id 2, name 3, phone 4, wedding_date 6, state 13, created_at 16, deleted_at 20) and `public.lead_packages` (lead_id 3, deleted_at 13), dream-os `docs/db/PUBLIC_SCHEMA.md` at ladder 0168.

```sql
select l.id, l.name, l.phone, l.state, l.created_at
from public.leads l
where l.vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742'
  and l.deleted_at is null
  and l.wedding_date is null
  and l.state <> 'booked'
  and not exists (select 1 from public.lead_packages lp where lp.lead_id = l.id and lp.deleted_at is null)
order by l.created_at desc;
```

Expect zero or more leads with no wedding date and no package. With zero rows, the seat says so and step 1 waits on a new lead added from Leads.

1. **The chip clears in place (F-43.113).**
   - Open Leads, then the lead the seat named from Q-3i-a. Its `Still missing — tap to complete:` chips include `Wedding date`.
   - Keep the detail open. Tap `Booking confirmed`, then `Confirm booking`. The toast names what is missing, and the chips appear at the top of the booking sheet.
   - Tap `+ Wedding date`, pick a date and file it. Then tap `Cancel` on the booking sheet.
   - On the lead detail that stayed open beneath: the `Wedding date` chip is gone, and the Wedding date row shows the date. You did not close or reopen anything.
   - 📸 Screenshot the detail before and after.
2. **The badge in place (F-43.113), only if you want a booking.**
   - On a lead with a package and a wedding date, tap `Advance paid`, then `Confirm booking`.
   - The open detail reads booked at once, the booking pair goes, and it stays booked after the list refreshes.
   - Skip this step if you do not want another booked fixture.
3. **The timings (F-43.112).**
   - Open DevTools on the phone view (Fast 4G, as before) and paste this into the console once:

```js
(() => { let t0 = 0, cls = 0; addEventListener('pointerdown', (e) => { t0 = e.timeStamp; cls = 0; }, { capture: true }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift' }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name.startsWith('tdw:lead-detail:') && e.name !== 'tdw:lead-detail:open' && t0) console.log('tap to ' + e.name.slice(16) + ': ' + Math.round(e.startTime - t0) + ' ms · shift so far ' + cls.toFixed(3)); }).observe({ type: 'mark' }); console.log('armed: tap one lead row'); })();
```

   - Tap one lead row and wait. Two lines print: `tap to card-rows: … ms · shift so far …` and `tap to conversation: … ms · shift so far …`.
   - Close the detail, reload the page, paste the snippet again, and tap. Do this **three** times in all, and paste the six lines.
   - The card-rows line is the number the ruled targets read (**≤ 1274 ms**, shift **≤ 0.051**). The conversation line is recorded on its own.

Sequencing beyond this sitting is the founder's.
