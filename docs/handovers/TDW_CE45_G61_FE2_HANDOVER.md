# TDW · CE-45 · G6-1 · FE_2 (pwa half) · HANDOVER · dreamos-pwa

Base: `9b251ad4` (given under R-45.14 after FE-2's TYPE_1 landed; built at 82ff431e and carried byte for byte).
Server half: dream-os `a88c312` (FE2_SRV_1). Rulings: FE_2 read-first FK1 to FK6; E1 to E12 his ("ok"); his five
renamed own-number bytes ("ok"); the consent-gap fix (one existing class).

## What shipped

- **"Where enquiries go"** (spec §7c), a row in `app/vendor/(shell)/settings/page.tsx` beside the two switches, its
  words in `lib/worklist/enquiryRouting.ts` (E1 to E11 his, byte-exact; E10 and E12 imported from their approved homes).
  Through TDW writes at once. "Straight to my WhatsApp" opens a second screen and writes nothing until its confirm;
  both consent statements (§7c (a) and (b)) stand above the phone field. Rung 3 is disabled, its state stated
  ("Arrives with Own number"). The row sets its state only from the door's answer (FK5): a missing echo, or an echo of a
  different rung, is stated as a failure, never shown as a change.
- `lib/vendor/types/vendor.ts`, `hooks/vendor/useSettings.ts`: the two fields threaded as `exchange_discoverable` is;
  anything the door did not send reads 'tdw'.
- The Number room: his five renamed bytes (`lib/worklist/ownNumberFlow.ts`), and the gap between the two ways
  (`components/solutions/OwnNumberFlow.tsx`, `.sol-can`; no new style).
- One style rule, `.wl-erin` (the phone field), from existing tokens only. No new colour.

## Proof

- tsc clean. **b125 at 9b251ad4: 23 pass, 0 fail**, the Settings room driven in headless Chromium with `/me` answered at
  the network, both themes, three production mutations red and restored; cell 3.4a is red unless the row loads a
  stored own_number, so the list cannot pass on the hook's default (e-113's lesson). **b120 50/50** (five pins re-cut by
  label; e-94 cured: mutation runs write no screenshots). **b73 70/70, b77 51/51.**
- **The differential, in series on 9b251ad4:** 60 benches reading this half's files or walking the tree; the work
  stashed for the base side and restored by sha (0 mismatches). Exit codes identical. Output deltas, each attributed:
  b59's ink census and tdw09_money count one more file (enquiryRouting.ts); tdw_f3942 (red on both sides) counts one
  more retired file; tdw_f0774 (red on both sides) first counted a 32nd un-stripped reader, `scripts/lib/
  b125_enquiry_row_probe.mjs`, because its page-reading helper was named `read` (the bench's read-helper shape), though
  it reads no source. Renamed `readRow`; f0774 back to the base's 31. (b120's probe carries the same false match; not in
  this manifest, named here.)
- **b123 (FE-2's) was not run here:** it cannot finish inside this container's 300-second cap even alone (e-93's class),
  and a mutating bench must not be killed mid-run (A-45.4). Its only reads of this half's files are §1.4 and §1.5's walks
  for five names (SliceDoor, DOOR_ORDER, useLastSlice, readStoredSlice, dreamai_list_last_slice); none of the nine files
  holds any of them (checked by command). Its whole-run verdict is the founder's block 2.
- **The floor:** its own turn.

## The walk

Settings on his handset: "Where enquiries go", Through TDW selected; Straight to my WhatsApp, the second screen with both
statements, a test number, confirm; DEV440's public page's Enquire opens that number; back to Through TDW, the link
returns to TDW at once. The Number room (walk mode only) shows his words and the gap. Rung 3 disabled and stated.
