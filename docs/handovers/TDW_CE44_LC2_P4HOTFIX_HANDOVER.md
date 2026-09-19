# TDW · CE-44 · LC-2 · PACKET 4 PWA HALF · HOTFIX · F-44.34 and F-44.37

**Base** `dreamos-pwa 93d96b0a7baa602d969d2afa1b54106647cc6445`
**Sibling** `dream-os 509f55a08b94cf9247bf7daf87c8e93b5cafde79` (untouched; no server byte in this cut)
**Rung** pwa b83 · 55 ok, 0 failed, 10 mutations bit
**Neighbours** b80 48/0 · b81 65/0 (1 cell amended) · b82 204/0 (1 cell + 1 mutation amended) · tsc exit 0
**Floor** `FLOOR = NAMED BASE, no delta (refusals, not in base: 0)`, 40 red, the forty it was

The founder walked packet 4 on 18 September. Four steps green, step one RED. This is that red.

---

## 1 · F-44.34 · THE SHEET SAID "ATTACHED" AND SAVED NOTHING

On Dev Test 3i b, unbooked, package "Pre wedding shoot" whose own middle payment is OFF at
deposit 30, he opened Change package, ticked **Take a middle payment**, typed **40** into
Middle payment (%), left the deposit, and tapped Attach package. Toast: "Package attached."
The card afterwards: two payments, 30% Rs 15,000 and Rs 35,000. His history query on that
lead's `lead_packages` rows showed the live row at deposit 30, middle **40**, middle_on
**false**, 2 payments. So `middle_pct` reached the server and `middle_enabled` did not.

**Driven in the real room with the network logged, both arms.**

With a **fresh** list the sheet opens unticked and sends
`{package_id, middle_pct: 40, middle_enabled: true}`. Stored 40, true, three payments.

With the list **one edit stale** the sheet opens with the box **already ticked** and sends
`{package_id, middle_pct: 40}` with no `middle_enabled` at all. Stored 40, false, two
payments. That is his row to the digit.

**The cause.** `submit` sent each field only when it DIFFERED from `chosen`, the package as
the sheet remembered it. Her tick equalled the sheet's belief, the difference was nil, and
nothing was sent for that key. The server merged a 40 onto a package whose middle is off
and did exactly what it was told. A diff against a remembered copy is only as true as the
memory.

**Why the memory was stale.** `packagesCache` (`LeadPackageCard.tsx:52`) is a module-level
once-cache; `loadPackagesOnce` returns it without revalidating; the only reset is
`SliceShell.tsx:488`–`:493`, an effect keyed on `slice`. Nothing in the Packages room
clears it and the sheet's open effect did not re-read. **The exact navigation that leaves
it stale on the founder's device is NOT proven** and is recorded here as unproven; the
mechanism is.

**The same hazard sat on four more.** `total`, `name`, `description` and `line_items` were
diffed identically at `:281`–`:285`. The five payment keys were not special; they are the
ones he happened to catch.

### The cure, as ruled

1. **What she sees is what is sent.** `submit` sends `package_id` and all nine fields as
   they stand, unconditionally. No comparison against `chosen`. The comment claiming an
   untouched attach sends the old body is withdrawn: it bought nothing and cost this.
2. **Re-read on open.** The sheet calls `fetchPackages()` fresh each time it opens and does
   not take the cache's word. A failed read shows the failure byte it already holds and
   seeds **nothing** from memory, because a remembered list is what caused this.
3. **Seed from her** (§2 below), which is not optional beside (1): a sheet that sends
   everything but seeds from the package would overwrite a couple's own fee and wording
   with the package's on every re-save.

## 2 · F-44.37 · THE SHEET HID WHAT SHE SAVED

Driven: a couple whose live row held middle **45 and ON** against a package of **30 and
OFF** opened showing **30 and OFF**. After saving 40 and ON, re-opening showed **30 and
OFF** again. So the sheet both hid her saved values and re-armed the diff against the
package, meaning a second save could silently drop her earlier change.

Now, when the selected package IS the one her live row was cut from, **every** field seeds
from her row: fee from `current.total`; name, description, line items and the five from
`current.snapshot`; the handover date from `current.delivery_on`. On a first attach, or the
moment she picks a different package, the fields seed from that package.

**The selector is a choice of source, and a source is always a saved thing.** Switching to
another package re-seeds from it; switching back to her own re-seeds from her live row,
never from a half-typed state. A half-typed state is not a source.

## 3 · BookingSheet.tsx, READ AND NOT TOUCHED

It was read, as ruled, either way. It never calls `loadPackagesOnce`, never reads
`packagesCache`, and never calls `fetchPackages`; it mounts `AttachSheet`, which now
re-reads on open. It shares no part of the cache hazard, so it is not in this cut.

## 4 · WHAT THE ROOM PROVES, AND WHERE MY OWN CONTAINER DIFFERS

Cells driven in the real room: the stale arm sends all nine and stores 40, true, three
payments; a couple whose live row differs from the package in fee and in the five re-opens
showing hers in every field; re-saved untouched, her row is unchanged in every field, which
is (3)'s own proof; the selector re-seeds from a saved source; a failed list read seeds
nothing. Mutations M6, M8, M9, M10 each turn their named cell red.

**Named, because it is the class of error this packet has already cost twice.** This seat's
container had the packet-4 set committed as a local mirror of `93d96b0a`, so
`LeadPackageCard.tsx` and `b83_lc2_p4pwa_bench.js` were verified by content but were not
exercised through the declared-dirt path here. On the founder's tree all eight paths are
dirty and declared, and Block 3's floor run is what proves that, not this one.

## 5 · FROM THE WALK, RECORDED

- **R-44.10 IS ROOM-WITNESSED.** The chair asked the founder whether, on a lead with a
  phone, Forward to a peer opens its sheet with the keyboard down until he taps the search
  box. Founder, verbatim, 2026-09-19: **"yes to yoour last answer"**, read as yes to both
  halves. So R-44.10 is source-proven by §4.1 and M2 **and** room-proven by his walk. The
  bench's §4.2 room cell stays struck; the witness the strike named is the one that spoke.
- **F-44.33 CLOSES** as a test-room artefact: the forward sheet mounts in production. What
  remains is a note for whoever next drives that sheet under mocked doors, that the mock is
  missing something the live room has. Not a product defect, no sitting.
- **F-43.122 and R-44.11 green on his walk**: walk45 stored `wedding_date` 2026-09-25 with
  precision `day`; after **File it** the next detail appeared with the keyboard down, his
  words, "yes. with keyboard down."
- **F-44.35 filed**, founder verbatim: "phone number isnt visible in leads details." The
  lead detail has never carried a phone row; the number lives only behind the WhatsApp and
  Call controls (`SliceShell.tsx:1583`–`:1596`). To LC-3's opening: a Phone row with
  FIELD_META's own label, shown only when the record carries a number.
- **F-44.36 filed** to Block 09: on a committed tree `run-floor.sh` prints
  `0 dirty path(s), all declared` then an empty `declared:` list, which reads like an
  answer and is not one. It should say "no dirt to declare". Not this seat's to edit.
