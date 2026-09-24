# TDW · CE-45 · FE-2 · TYPE_1 · HANDOVER

The six legacy list rooms on the app's own type, and the in-room tab strip removed.
Base `82ff431e` (HOME_2). dreamos-pwa only. Rung **b123**.

## What the founder asked, and what was ruled

After HOME_2 went live the founder saw some rooms with bigger fonts and a different layout, and asked for an audit. FE-1's audit found twelve rooms on the old type. He took the chair's recommendation: every room goes onto the app's own type, rungs and gutters with no word or function changed, and the old in-room tab strip is removed because the shelves and Home replace it.

The chair's rulings on this cut, 24 September 2026:
- **F1**: re-dress the legacy family in place.
- **F2**: remove the strip whole, its mounts and its orphaned key with it.
- **F3**: the word proof by textContent, with the strip's six labels as the one allowed removal.
- **F4**: the room includes the sheets it opens. The shared sheets are in TYPE_2.
- **F5**: case follows the rung.
- **F6**: the masthead figure goes to t1.
- **F7**: the fallback tuple (TYPE_2's concern; nothing in this cut renders outside `.wl`).
- **F8**: the ask sheet's modules go to cut 5.
- The 1a/1b split.

## What changed, one paragraph each

**The family's type.** The ten modules in `components/vendor/slices/` and `app/vendor/(shell)/clients/body.tsx` no longer name a face, size, weight, line-height, style or tracking of their own.
- `F` (Italiana, Jost, DM Sans twice) is retired, not aliased. `T` in `SliceRow.tsx` names t1 to t5 of `lib/worklist/theme.ts` and nothing else.
- Every site takes `font: T.tN` as its first property. The `font` shorthand means a site cannot set a size beside its rung.
- The mapping, with its per-site exceptions:
  - Jost labels go to t5 and keep their capitals at .08em.
  - Buttons go to t4 in sentence case (F5); the filter chips stay t5 in capitals.
  - DM Sans body goes to t3; row second lines and sub-lines go to t4.
  - Names inside lists go to t2; a sheet's one title goes to t1.
  - The masthead figure goes to t1 (F6), because t0 stays Today's.
- 137 sites in all. One inline weight 500 was dropped on a name inside the remove-schedule confirm, and one `fontStyle: 'normal'` on a name inside the delete confirm (it restated the default). The family set no italic; the three italic sites are in TYPE_2's modules.
- **No other style property changed.** A multiset of every non-type property, base against cured, per file, loses only `F`'s constants and the strip's own properties, and gains nothing.

**The strip.**
- Removed: `SliceDoor`, `DOOR_ORDER`, its mount in `SliceShell`, and Notes' own mount and import in `app/vendor/(shell)/notes/body.tsx`.
- It was the only writer of the stored key `dreamai_list_last_slice`, and nothing reads that key, so nothing that runs is lost. `useLastSlice` stays because its types are imported by other modules.
- Every room the strip pointed at is a shelf row (b122 §2).

**The benches that pinned the old dress, by label.**
- `b40` C28 is **RETIRED** under A-45.2 through a `RETIRED_CELLS` table at the harness, with its reason. Its body is never run, and an exit check requires each row to match exactly one reached cell. b40 reads its base two reds (C50, C102) and no more.
- `tdw09_money` (two cells) is re-pinned to the figure at `T.t1` with no size set anywhere in Masthead.
- `tdw09_walkrider` §3.1 and §3.2 are re-pinned to `T.t4` on the sub-line.
- Each re-pinned proof is red at the base on exactly its amended cells and green cured.

## The rung, b123

`scripts/b123_ce45_fe2_type_bench.js`, with `scripts/lib/b123_type_probe.mjs` and `scripts/lib/b123_fixtures.mjs`.

- **§1 SOURCE**: F retired and T exactly t1..t5; no raw type key in the family; every font a T rung and tracking only .08em; the strip absent from `app/` and `components/`; the orphaned key with no writer and no reader.
- **§2 to §4 RENDER**:
  - The six real rooms at rest and with the first row's own sheet open. Clients opens a card, then its edit sheet; invoices also opens the add-milestones sheet.
  - Both themes, at 374px, in headless Chromium against `next dev` in mock mode, for the cured tree AND a base worktree.
  - Every read is answered with wire-shaped rows (C-44.3): money as numbers, per dream-os `invoices.js` :45/:126 and `money.js` :298/:459, and the `integer` columns of `docs/db/PUBLIC_SCHEMA.md`.
  - Cells: rung (size, face and weight); faces and italic; tracking; F5; gutter and overflow; the strip absent; words and controls node for node against the base; F6's widest figure (Rs 9,99,99,99,999) whole at t1.
  - The TYPE_2 subtrees are marked and left out of the type cells, never out of the word compare.
- **§5 MUTATIONS**, each reddening exactly its own cell and restored byte for byte:
  - M1: a raw 9px on the state pill.
  - M2: Italiana on the figure.
  - M3: the strip's mount back in Notes.
  - M4: .32em tracking on a sheet label.
  - M5: one word of the lane line changed.

**The record of runs:**
- Cured, with mutations: **221/221 GREEN**.
- At the base (dark): **49/111 RED**. The reds are §1 whole, 2.1 to 2.4 and 2.6 in every measured scene, 3.3 and 4.1. The words and controls are equal base to base, as they must be.
- Shifted clocks (C-44.13), cured, leads, events and invoices: **69/69 GREEN** at each of 2026-09-24T12:00Z, 2026-09-24T19:00Z (the next IST day), 2026-12-31T19:00Z (across the year's end) and 2028-02-29T06:00Z.

**F5, the 23 controls now in sentence case** (words unchanged): recent ⌄, Forward to a peer, Mark lost, Edit Here, Delete, Ask in chat, Edit, Hide, Save, Mark paid, ↓ Download PDF, ↗ Send on WhatsApp, Remove schedule, Remind, Paid, and the same verbs room by room.

## Defects found on the way, owned

**e-108** (minted by the chair): FE-1's audit and FE-2's read-first measured every data room empty. The b123 stand-in is its cure.

**Two probe defects, cured before any verdict:**
- Page-level interception never saw the reads until the service worker was bypassed (b122's own method).
- A closed sheet is a fixed layer translated below the fold. The first cut asked "off glass" of the NODE, so an open sheet's rows below its own scroll fold were dropped. The base's larger type pushed more rows below the fold, so it read 66 words against the cured tree's 70.
  Settled by capturing the invoices sheet on both trees at 1, 4 and 12 seconds: both draw the schedule's milestone rows, word for word, differing only in F5's case. The question is now asked of the LAYER, and the invoices sheet reads 70 and 70, and 22 and 22 controls.
- A manual probe of the cured invoices room once drew no `.wl-main` on a freshly started dev server. It left no stack in the server's log and did not recur across the later runs.

## The differential so far, and what the floor still owes

Cured against the base worktree, outputs diffed:
- **Green both sides**: tdw09_type_census, b78, b80, b81, b82, b83, tdw16_r2_leads_truth, tdw37_hygiene_false_success, tdw41_g34s2_pwa.
- **Pre-existing reds, identical output both sides** but for repo paths:
  - b40 C50 and C102.
  - tdw37_leadgate_b_slot (its extractor predates F-40.178's `leadTitle`).
  - tdw07_p4b_body, tdw09_p2_doors and tdw09_roles (files the tree no longer has).
  - tdw09_hotfix 2.7.
  - tdw09_type.proof: minted **F-44.150** as a RECORD, asserting TDW_09's retired 16px body floor. It is red at base and cured. Its census moved from 667 to 533 sites and from 57 to 53 under 16px. It is retired under A-45.2 in this sitting's last cut.
- The whole floor, `run-floor.sh --delivery scripts/floor-manifest-ce45-fe2-type1.txt --check`, is the next turn's (e-67), with the differential over every script that names a cut-1a module.

`next build` could not be run in the executor's container: its four Google font fetches (Cormorant Garamond, DM Sans, Italiana, Jost) are refused there, and nothing else failed. The founder's block 2 is the build's witness. `tsc --noEmit` is clean.

## Named, not cured here

- The family keeps F-38.22's colour literals: `A.brassLine` and the rgba(201,168,76,…) hairlines and washes. Colour is outside this sitting.
- The demo tree and the legacy discover pages are untouched by this cut (F7 concerns TYPE_2's shared modules).

## What TYPE_2 picks up

The sheets the rooms open: AddSheet, NeedFirst, MissingChips, ConversationThread, ClientBookingSheet, NotesBody, Toast, LeadPackageCard, BookingSheet, PackageFields. It also extends b123's cells to them, dropping their `later` marks, and walks AddFab's +, calendar's add sheet and Packages' edit sheet (F4).
