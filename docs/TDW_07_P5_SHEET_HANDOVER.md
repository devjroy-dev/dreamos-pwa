# TDW_07 P5 — THE ENQUIRY SHEET · EXECUTOR HANDOVER
**Base:** `dreamos-pwa @ 9271d6b` · **Executor:** Opus-LE · **Date:** 2026-07-31
**Pairs with:** backend movement C (`TDW_07_P5_BACKEND_C.zip`) — the door that accepts the four fields.

---

## 1 · WHAT SHIPPED

| # | File | What |
|---|---|---|
| 1 | `components/frost/EnquirySheet.tsx` | **NEW.** Prefilled, species-aware, vetoed copy, `res.ok` checked, posts then hands off. |
| 2 | `components/shared/VendorProfileView.tsx` | F1(a) — the Enquire verb raised through a new `onEnquire` prop. |
| 3 | `app/(frost)/frost/canvas/discover/page.tsx` | The sheet mounted with the deck's chrome; V6's three toasts. |

**tsc:** zero errors in changed files, **zero whole-tree**. W-1 clean.

## 2 · F1(a) FOLLOWS THE ESTATE'S OWN PRECEDENT

The verb is raised through `onEnquire` for exactly the reason `onCircleTap` already
exists: the UI it opens is positioned against the DECK's glass sheet, not against
the shared renderer's content. Button here, sheet there, prop as the seam. The
shared renderer stays a renderer, so §3's "a second implementation anywhere is a
failed session" holds structurally.

**`onEnquire` is optional and the old behaviour is the fallback.** Mounts that have
not adopted the sheet (Muse) keep the direct wa.me handoff rather than losing their
Enquire to a half-migration.

**The six misrouted demo links die here.** A demo card's `enquire_link` is
`wa.me/<TDW's own vendor number>?text=TDW-<demo ig_handle>` — a token matching no
real `routing_handle`. Every demo Enquire has been walking couples into our own
inbox with an unresolvable code. The sheet posts to `/enquire` first, which
resolves the species from the database and fires the free-lead hook.

## 3 · CONTROL + VERB INVENTORY (CE-115 / CE-116 cl.2)

| control | account |
|---|---|
| `Enquire` button | **KEPT**, verb changed: direct-open → sheet-first → open |
| `Lock Date` (disabled) | KEPT, untouched |
| Circle tap | KEPT, untouched |
| IG chip | KEPT, untouched |
| deck drag / dismiss / pager | KEPT, byte-untouched (§3 gesture law) |
| — | nothing REMOVED |

## 4 · THE READ-ONLY ASYMMETRY, AS BUILT

`functions` and `budget` are editable on a REAL card and **display-only on a DEMO
card**, because `demo_leads` has no column for either. The sheet also does not POST
them on a demo card, so there is no path where an edit is accepted and dropped.

## 5 · DISCLOSURES

1. **`functions` has no prefill source.** `CoupleMe` carries `wedding_date`,
   `wedding_city`, `budget_total` (lib/types/bride.ts:24-32) and no functions field,
   so that row starts EMPTY and editable. Inventing a default would be a claim about
   her wedding she never made. Widening `/couple/me` is a bride-blocks call, not this
   sitting's.
2. **The handoff runs even when the post fails.** She tapped Enquire to reach a
   vendor; the wa.me window is the path that has always worked. Refusing it because
   our pipeline stumbled would punish her for our defect. The toast still tells the
   truth about the pipeline.
3. **`splitFunctions` mirrors the door's `normalizeFunctions`** — blanks dropped,
   empty result `undefined` not `[]`. Two implementations of one contract, on
   opposite sides of a wire; the door's is authoritative and benched (§6.7).
4. **The sheet is not benched.** Its logic is presentational and its one testable
   contract — the field parsing — is benched server-side. A cell asserting a React
   tree here would prove wiring, not usability (PROVABLE-EQUIVALENT, CE-115). The
   walk card carries what only the founder's device can witness.

## 6 · REMAINING FOR THE SEAL

The Journey's `Sent`. `CoupleEnquiry` (lib/frost/journey.ts:329) has no state field —
confirming §D's ruling that the row's existence IS the state — so the surface work is
a label over `fetchEnquiries()`, not a state machine. Then the walk card.
