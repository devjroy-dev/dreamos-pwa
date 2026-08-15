# BRIDE_PARITY_MATRIX — what Mira can do, and what the app can do

**Derived at `dreamos-pwa 62618b9` · `dream-os 792bd37`, 2026-08-13.** Every row
below was derived by command against both trees: the capability axis from
`src/agent/brideTools.js`, the bloom axis from `components/frost/blooms/` and
`app/(frost)/frost/canvas/sanctuary/page.tsx`, the backend axis from
`src/api/couple/`. Nothing here is written from memory.

**This document is TDW_15's contract.** Its R-1 opens on the matrix; the whole
block's delta is the GAP column. Precision here buys that block its map, and a
row silently marked closed is the failure the spec itself forbids.

Companion: `docs/FROST_BLOOMS.md` (which bloom owns which door).

---

## The axis, honestly stated

`brideTools.js` declares **25 tools** — the spec's figure, confirmed. But **four
are DEPRECATED in their own descriptions**, by their own text:

| tool | its own words |
|---|---|
| `list_tasks` | *DEPRECATED — do not call. All tasks and to-do items are now stored as events. Use `list_events`.* |
| `complete_task` | *DEPRECATED — use `update_event` with `state="done"`.* |
| `update_task` | *DEPRECATED — use `update_event`.* |
| `delete_task` | *DEPRECATED — use `delete_event`.* |

**So the live axis is 21 capabilities, not 25**, and tasks are events wearing an
older name. `create_task` is NOT marked deprecated while its four siblings are —
a live writer into a retired vocabulary, and the first thing this matrix wants a
ruling on. It is listed below and flagged, not quietly folded.

---

## The matrix

**READ** = the bride can see this in a bloom. **WRITE** = she can do it in a
bloom. **—** = she cannot; only Mira can, on WhatsApp.

| # | capability | read in bloom | write in bloom | owning bloom | backend door |
|---|---|---|---|---|---|
| 1 | `note_to_self` | **—** | **—** | *none* | exists (agent-side) |
| 2 | `save_wedding_detail` | ✅ | ✅ | Settings | `PATCH /couple/me` |
| 3 | `add_event` | ✅ | ✅ | Events | `POST /events` |
| 4 | `create_task` | ✅ *(as event)* | **—** | Events | `POST /events` |
| 5 | `list_events` | ✅ | n/a | Events | `GET /events` |
| 6 | `update_event` | ✅ | ✅ | Events | `PATCH /:event` · `PATCH /:event/state` |
| 7 | `delete_event` | ✅ | ✅ | Events | `DELETE /:event` |
| 8 | `add_booking` | ✅ | ✅ | Vendors | `POST /:booking` |
| 9 | `list_bookings` | ✅ | n/a | Vendors · Expenses | `GET /bookings` |
| 10 | `update_booking` | ✅ | ✅ | Vendors | `PATCH /:booking` |
| 11 | `delete_booking` | ✅ | ✅ | Vendors | `DELETE /:booking` |
| 12 | `record_payment` | ✅ | ✅ | Vendors · Expenses | `POST /:booking` |
| 13 | `save_receipt` | ✅ | ✅ | Expenses | `POST /expenses/:couple` · `POST /receipts/:couple/image` |
| 14 | `list_receipts` | ✅ | n/a | Expenses | `GET /receipts` |
| 15 | `delete_receipt` | ✅ | ✅ | Expenses | `DELETE /:receipt` |
| 16 | `list_muse` | ✅ | n/a | Muse | `GET /saves` |
| 17 | `delete_muse_save` | ✅ | ✅ | Muse | `DELETE /:save` |
| 18 | `invite_to_circle` | ✅ | ✅ | Circle | `POST /invite` |
| 19 | `list_circle` | ✅ | n/a | Circle · People | `GET /circle` |
| 20 | `read_pages` | ✅ | ✅ | Pages | `GET`/`POST /pages` |
| 21 | `factual_search` | **—** | **—** | *none* | web, agent-only |

**Bloom-only capabilities Mira does NOT have** (the reverse gap, which the spec's
axis cannot see and TDW_15 will need): Moments photo diary + caption edit ·
Meridian concierge request and chat · Discover feed, enquiries and save-to-Muse ·
Muse image upload and add-by-URL · Circle threads and messages · circle member
removal · vendor enquiries.

---

## THE GAPS, each with its owning bloom and the door that exists or is missing

### G-1 · The Events bloom is CLOSED — she can add, edit, settle and remove a day
**Rows 3, 4, 6, 7.** `EventsRoom` calls `fetchEvents` and nothing else — derived:
two call sites, zero writers. Meanwhile `lib/frost/journey.ts` already **exports
`createEvent`, `updateEvent` and `deleteEvent`**, and the backend carries
`POST /events`, `PATCH /:event`, `DELETE /:event`.

**Everything needed exists except the UI.** The bride can be told about an event
by Mira on WhatsApp and can read it in the app, but cannot add, edit or complete
one there. **This is the single largest parity gap on the surface**, and it is a
UI-only sitting — no backend work, no client work, no migration.

*Owning bloom: Events. Doors: all present; three of four still unwired.*

> **AMENDMENT — `CE-33 · TDW_14 D-4b · 2026-08-14` · R-D4b.1**
>
> **G-1 moves from Open to PARTIALLY CLOSED.** `EventsRoom` now calls
> `updateEvent`, at one site: the delegation affordance, which writes
> `assigned_circle_member_id` and nothing else. The paragraph above stands as the
> record of what was true until this date; this is the delta, stated precisely so
> the row stays legible as a contract rather than being rewritten under TDW_15.
>
> **THE ASSIGN IS A FIFTH WRITER, NOT ONE OF THE FOUR TABLED.** Rows 3, 4, 6 and
> 7 are `add_event`, `update_event`, `complete_event` and `delete_event` — the
> capability axis's own four. Delegation is none of them: no brideTool assigns a
> journey item to a circle seat, so the assign closes no tabled row and instead
> opens a bloom capability with no tool behind it (the reverse gap, §7 of the
> bench). **Create, delete and edit remain OPEN exactly as tabled**, and the
> sentence "everything needed exists except the UI" still holds for all three.
>
> What this costs TDW_15: the Events bloom is no longer a read-only surface, so a
> sitting that wires the four writers is adding to a surface that already writes
> rather than opening one that never has. Nothing else in this matrix moves —
> no row is renumbered, no count changes, and the axis figures are untouched.
>
> Cell 4a of `scripts/tdw13_d6_parity_matrix.proof.mjs` is re-authored in the
> same delivery to assert this ruling in both halves: `updateEvent` present at
> exactly the assign site, `createEvent` and `deleteEvent` still absent. A
> companion cell pins the words **Partially closed** here, so the document and
> the bench go red together if either drifts.

> **AMENDMENT — `CE-34 · TDW_15 P1 · 2026-08-15` · R-34.8**
>
> **G-1 CLOSES.** Rows 3, 6 and 7 tick in the write column: the Events bloom now
> calls `createEvent`, `updateEvent` and `deleteEvent`, and marks a day done
> through the dedicated `PATCH /:event/state` door. The two paragraphs above
> stand as the record of what was true until this date.
>
> **THE ASSIGN SURVIVED, AND THE PROOF OF IT CHANGED SHAPE.** D-4b's cell
> asserted `updateEvent` appears in the bloom EXACTLY ONCE, because at that
> delivery one call site and one PATCH body were the same fact. They are not:
> the edit sheet writes through the same door, correctly, since a client
> function named `editEvent` calling the identical endpoint is the very
> anti-pattern D-4b refused. So the cells now read BODIES — the assign writes
> `assigned_circle_member_id` and nothing else, the edit sheet writes content
> fields and never the delegation column, and the state toggle rides a
> different door entirely so the count of two stays two by construction.
>
> **WHAT REMAINS OPEN IN THIS SECTION: NOTHING.** Row 4 (`create_task`) is
> untouched and stays G-5's — a ruling about vocabulary, not a build.
>
> Cells 4a–4a6 of `scripts/tdw13_d6_parity_matrix.proof.mjs` are re-authored in
> the same delivery, and the companion cells pinning this document's words move
> with them. Neither can drift alone.

> **AMENDMENT — `CE-34 · TDW_15 P1 · 2026-08-15` · R-34.7 (G-3, image half)**
>
> **G-3 CLOSES.** `POST /couple/receipts/:coupleId/image` was built in this
> block's first delivery, and the Expenses bloom now carries the control that
> reaches it. Before it, NO http path could write `couple_receipts.image_url` —
> the typed POST omits the column, `couple/expenses.js` nulls it explicitly, and
> the only writer in the estate was `brideEngine`'s `save_receipt`, reachable
> only by forwarding a photo to Mira on WhatsApp.
>
> **NO OCR, BY RULING.** She files the photo and types the amount, exactly as
> `save_receipt` does — that executor writes `couple_id` and `image_url` and no
> more. Nothing in this estate turns a receipt photo into typed fields on any
> plane, and wiring the inbound-media router here would have invented a
> capability rather than closed a gap.

### G-2 · `note_to_self` has no surface at all
**Row 1.** Zero blooms reference a notes door — derived by census, not assumed.
Mira records durable facts about the bride and her wedding; the bride cannot read
them, correct them, or know they exist. That is a memory she cannot audit.

*Owning bloom: none exists. Candidate: Settings or Pages. Needs a ruling before
a door is built.*

### G-3 · `save_receipt` is partial
**Row 13.** Expenses `POST /couple/expenses/:couple` with `vendor_name`, `amount`
and `receipt_date` — a typed expense. The tool files a receipt **image**, from a
WhatsApp forward, through OCR. The bride can type an expense; she cannot file a
receipt photo from the app.

*Owning bloom: Expenses. Door exists for the typed half only.*

### G-4 · `factual_search` is WhatsApp-only by nature
**Row 21.** Not a gap to close — recorded so no later block reads a blank cell as
missing work.

### G-5 · `create_task` writes into a deprecated vocabulary
**Row 4.** Its four siblings are marked DEPRECATED and it is not. It creates
what is now an event. Either it is deprecated with them, or its description is
corrected to say it creates an event — **a chair ruling, not a build.**

---

## What this means for TDW_15

15-P1's delta is **not** the whole matrix. The audit's edge already noted that
several P1 rows are closed by shipped sanctuary doors — payment, bookings CRUD,
receipts, enquiries, circle invite. This matrix says which:

- **Closed, needs no 15 work:** rows 2, 8–12, 14, 15, 17–20 — eleven capabilities.
- **Closed by TDW_15 P1 (`CE-34 · 2026-08-15`):** G-1's event writers — create,
  edit and delete are wired, and a day settles through the dedicated state
  door rather than vanishing. The `CE-33 · TDW_14 D-4b · 2026-08-14` amendment
  above records the intermediate state in which the bloom wrote once, at the
  delegation assign; that assign survives untouched and its boundedness is now
  asserted per PATCH BODY rather than per call count.
- **Open, needs a ruling first:** G-2 (`note_to_self` — where does it surface?),
  G-5 (`create_task`'s vocabulary).
- **Closed by TDW_15 P1 (`CE-34 · 2026-08-15`):** G-3's image half — the door is `POST /receipts/:coupleId/image`, the control is in the Expenses bloom, and no OCR rides it by ruling.
- **Not a gap:** G-4.

**And the reverse axis matters as much.** Seven bloom capabilities have no tool.
A bride who does everything in the app has a Mira who cannot see her Moments, her
Meridian requests, or her Circle threads. TDW_15 inherits that asymmetry whether
or not it charters it, and it is stated here so the next seat cannot say it was
not told.

---

## Method, so this can be re-derived rather than trusted

- capability axis — `name:` fields of `src/agent/brideTools.js` @ `792bd37`, 25
  found, 4 self-deprecated
- read/write axis — client-function and raw-`fetch` census per bloom file
- backend axis — `router.<verb>` census across `src/api/couple/`
- **no row was marked closed on the strength of a function existing** — a client
  export with no bloom caller is an unwired door, and G-1 is entirely made of
  those
