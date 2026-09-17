# repo: dreamos-pwa @ 45f6d906a41a6e76fa32091a9857b9bde3322d3f
# TDW · CE-43 · SEAT LC-2s · PACKET 3i · HANDOVER (dreamos-pwa only) · 2026-09-17

**Cut and provenance.**
- The code was cut on dreamos-pwa `fd4a77882531e5ef59526fa4e647d0a88389451c` (3h), re-derived at origin by `git ls-remote` at the moment of cutting.
- This file was re-cut (docs only) on `45f6d906a41a6e76fa32091a9857b9bde3322d3f`, the 3i commit, re-derived at origin at the moment of re-cutting.
- dream-os stands at `51399689e55bfb607bcc4d434a0c83abd2f689cb` (LC-2r's rest docs) and is untouched.
- The seat is LC-2s, the re-seat of LC-2r, which rested at its image limit with 3 to 3h banked and walked. Status for the re-seat: dream-os `docs/handovers/TDW_CE43_LC2R_REST_HANDOVER.md` (c-43.18).

**Scope and status.**
- No new byte. No new file outside `scripts/` and this handover.
- Rung unchanged (b82, by label).
- Findings: F-43.114 and F-43.115, both chair-filed at the card's close (§6). F-43.116 onward stay unspent; §4 names candidates for the chair.
- **Status: CARD 3i CLOSED** (chair's ruling, CE-43, 2026-09-17). The code landed at dreamos-pwa `45f6d906` (F-43.114). This file was re-cut, docs only, on that tip under R-43.17 (§5, §6).

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

## §5 · Card 3i, as walked (R-43.17 governs the fixtures)

**R-43.17 (founder's rule, chair-recorded, CE-43):**

> "the only two accounts we can use for test is 9888294440 or 8595356978."

Every walk fixture is a lead carrying one of those two numbers. Phoneless leads, and every other phone on DEV440, are excluded from any card, including simply opening them. This card first named Q-3i-a, a query over every undated lead with no package; that query is withdrawn and replaced by Q-3i-b.

**Q-3i-b · the fixture, read-only, run FIRST.**

Witness: `public.leads` (id 1, vendor_id 2, name 3, phone 4, wedding_date 6, state 13, created_at 16, deleted_at 20) and `public.lead_packages` (lead_id 3, deleted_at 13), dream-os `docs/db/PUBLIC_SCHEMA.md` at ladder 0168.

```sql
select l.id, l.name, l.phone, l.state, l.wedding_date, l.created_at,
  exists (select 1 from public.lead_packages lp where lp.lead_id = l.id and lp.deleted_at is null) as has_package
from public.leads l
where l.vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742'
  and l.deleted_at is null
  and l.phone in ('+919888294440', '+918595356978', '9888294440', '8595356978')
order by l.created_at desc;
```

- **A row that is not booked, has no wedding date and has no package** is the step 1 fixture.
- **No such row:** step 1 opens by adding one on Leads → + with a test number and every other field empty. The Add door needs only a name (dream-os `src/api/vendor/leads.js`), and the pwa form normalises the phone to `+91…`.
- The founder's paste returned zero rows. He added `Swati Test` (`7934e4b8…`, `+918595356978`), then `Dev Test 3i` (`2dfef288…`, `+919888294440`), then `Dev Test 3i b`.

**Q-3i-c · after step 1, read-only.** Same witness, plus `wedding_date_precision` (24).

```sql
select l.id, l.name, l.phone, l.state, l.wedding_date, l.wedding_date_precision, l.created_at
from public.leads l
where l.vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742'
  and l.deleted_at is null
  and l.phone in ('+919888294440', '+918595356978', '9888294440', '8595356978')
order by l.created_at desc;
```

**The steps**

Start only when Vercel reads Ready on the 3i commit and, with a lead open, this console line lists the marks:

```js
performance.getEntriesByType('mark').filter((e) => e.name.startsWith('tdw:lead-detail:')).map((e) => e.name)
```

1. **The chip clears in place (F-43.113).**
   - Open the test lead and keep the detail open.
   - Tap `Booking confirmed`, then `Confirm booking`. Nothing is sent; the toast names what is missing, and the chips sit at the top of the booking sheet.
   - Tap `+ Wedding date` **on the booking sheet**, not the chip on the detail above it. The one-cell date sheet opens; file a date, and it closes itself.
   - Without closing anything, the detail beneath shows the date, with `+ Wedding Date` gone from its chips.
2. **The timings (F-43.112).**
   - Paste this into the console on each reload, then tap one test lead once and touch nothing until both lines print. Three runs.
   - Target for the card-rows line: tap-to-stable ≤ 1274 ms and shift ≤ 0.051 on each run. The conversation line is recorded on its own.

```js
(() => { let t0 = 0, cls = 0; addEventListener('pointerdown', (e) => { t0 = e.timeStamp; cls = 0; }, { capture: true }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift' }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name.startsWith('tdw:lead-detail:') && e.name !== 'tdw:lead-detail:open' && t0) console.log('tap to ' + e.name.slice(16) + ': ' + Math.round(e.startTime - t0) + ' ms · shift so far ' + cls.toFixed(3)); }).observe({ type: 'mark' }); console.log('armed: tap one lead row'); })();
```

## §6 · The walk record and the close (CE-43, 2026-09-17)

**The first attempts, disclosed (the seat's error).**
- The card was first walked before any 3i push existed. The seat had said to start "on this push" while withholding the git line, so production still served `fd4a7788`.
- Swati Test's date was filed through the detail's own chip (TDW_04's wishbone). The evidence: its sheet read "3 details missing", and the row stored `wedding_date_precision` NULL.
- Dev Test 3i's date was filed through the booking sheet's fix (precision `day`). Its detail did not update in place, because 3i was not yet live.
- The console check printed `[]` on the old build, and the three marks once `45f6d906` was Ready.

**The close, on `45f6d906` (Vercel production Ready).**
- **Step 1, green in place.** On `Dev Test 3i b`, a date filed from the booking sheet's chip made the open detail read `24 Apr 2027`, with `+ Wedding Date` gone from its chips. It updated while the booking sheet was still open, and the sheet was left with only `+ Package`.
- **Step 2.** Three runs, read from the founder's console. Shift was 0.000 on every run.

  | Run | Tap to card-rows | Tap to conversation |
  |---|---|---|
  | 1 | 1059 ms | 1275 ms |
  | 2 | 931 ms | 1314 ms |
  | 3 | 1317 ms | 1084 ms |

  Run 3's 43 ms miss is accepted as the reading (chair): the network was throttled, and on that run the package read was slower than the conversation read.
- **Fixture disclosure.** The timing runs were taken with Anjali open, a lead outside R-43.17. Opening writes nothing; the rule now excludes it from any card.

**Filed by the chair.**
- **F-43.114**, disclosed, no revert. The 3i push landed at `45f6d906` on the founder's own word, ahead of the chair's final call. The tree is byte-identical to the cut, which the seat checked by `git show origin/main:<path> | cmp` on all five files, and the floor was green. The fact is recorded, not undone.
- **F-43.115 → Block 09.** The latency of the `/leads/:id/package` read on the detail open, to be measured with the Network panel beside the marks. No cure in LC-2.

**Relayed to the chair verbatim, not ruled here:**

> "after tapping file it, it gets filed and no place to click cancel. had to click outside the card area to dismiss the date got logged."

This is the TDW_04 wishbone sheet. It has no close control, it moves on to the next missing cell after a filing, and on a lead its outside tap also closes the detail. The two date-completion paths also store precision differently: the wishbone leaves it NULL, the booking fix stores `day`.

**Held.** Dev Test 23 (`5998610d…`) has no wedding date in Q-3i-a's rows. If the founder filed and saved on it at card 3f and no date landed, it is numbered and becomes the first item on packet 4's pre-cut note; otherwise it is dropped.

Sequencing beyond this sitting is the founder's.
