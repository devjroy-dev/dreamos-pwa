# TDW_16 · R2-PWA — HANDOVER (rides the ZIP)
**repo:** dreamos-pwa @ `a534329` · **seat:** LE · **authored:** 2026-08-24
Ruled by the chair's R2 addendum: arm 2 (L2) · arm 1 + **R-36.9** (L3) · mirror cured (L3-demo)
· no mirror (L1-demo) · exemption granted (badge) · L1's third file approved · L5's three lines approved.

---

## 1 · WHAT SHIPPED, BY LIMB

**L1 — the `ENQUIRED VIA TDW` row.** Three files: the wire type gains
`tdw_enquired_at?: string | null` (F-04.10's mapper half on this side — a field the interface
cannot see is no wire at all), and the row is spread into the sheet's `detail` array **only when
`l.tdw` is true**, directly under `Arrived`. Unbadged leads grow no row rather than an em-dash.

**L2 — `fmtArrival` onto the estate's one IST home.** It now reads through `istDayKey`
(`lib/frost/tokens.ts`), R-35.23's cure for F-15.17. **It was wrong twice and only one was
filed:** the locale call is the class NOTE 35 names, but the *timezone* half is what actually
moved a rendered date, and it was not in any finding. Sarah's enquiry is 23:42 IST on 21 Aug —
same day — so **the walk that sealed M-LEADS-TRUTH could not have caught it**. Every enquiry
after 18:30 UTC rendered one day late to an Indian vendor. Arm 1 was refused because slicing the
raw ISO would render the UTC day: consistency bought with a new bug.

**FIRST CROSSING, STATED:** no vendor surface had imported from `lib/frost/tokens` before. It is
a leaf module with zero imports and no server-only marker, so the named export tree-shakes.

**L3 — R-36.9, the measured bound.** `maxHeight` moves from `calc(100dvh - 88px)` to a value
measured from the coin's `getBoundingClientRect().bottom` on open, re-measured on resize.
`window.innerHeight` is `dvh`'s imperative equivalent, so **R-M1's dvh-over-vh clause stands**;
only the subtrahend moved, from a hand-sum to a measurement. The state's initial value keeps the
`dvh` expression so first paint is bounded, not unbounded.

**ZERO HORIZONTAL DELTA, and it is binding.** R-M1 withdrew `right: -16` / `minWidth: 292` with
the condition that the next walk be a clean test of the horizontal-clipping suspect. **That test
is still pending and survives this sitting uncontaminated.** The `position: fixed` arm was
refused for exactly this reason.

**L3-demo — the mirror cured.** `DemoVendorHeader` never received R-M1 *at all* — no
`maxHeight`, no `overflowY`, no momentum. Unbounded on every device since it was written. Same
measured arm; `overflow: 'hidden'` retired into the `overflowX`/`overflowY` pair exactly as the
product's card did. **It reuses the existing coin ref — no second ref grows.**

**CONTROL INVENTORY (CE-115):** theme toggle **KEPT** · help **KEPT** · settings **KEPT** ·
Sign Out **KEPT**. Zero moved, zero removed, zero reordered, on both menus.

**L5 — the offer byte and its reasoning.** The founder's 2026-08-24 string ships verbatim. The
`:87` comment's plan-level claim is corrected to the method-scoped offer
(`offer_TMeh1p2GXaMtqt`, UPI-only, CE-224's dashboard witness) — **and the reasoning built on it
goes with it**, because the old paragraph read the tree's silence as *confirming* a plan-level
price when an absent `offer_id` is equally consistent with a dashboard offer nobody looked for.
That inference is how F-10.121 stayed invisible; a corrected sentence over uncorrected reasoning
is how the next one hides.

**Badge exemption — taken through the census's own door, and the bench is UNCHANGED.**
`textTransform: 'uppercase'` was absent only because the literal `TDW` was already caps: the
label was always engraved, it just never said so. Adding it satisfies
`tdw09_type_census`'s existing three-leg test. **`tdw09_type.proof.mjs` is not in this ZIP** —
it is byte-identical to origin, so an eleventh un-cited site below the floor still reds, which
is the condition of the grant. **This is an interpretation and is flagged as one in §5.**

---

## 2 · THE FLOOR — measured, both ways, on this seat's own clone

`npm ci` **succeeded**. **F-14.26 does NOT apply at this seat** — my read-first declared it on a
prior container's state instead of trying it, and the chair's "attempt it first" instruction
caught a claim made without testing. The chair's clone was not needed as a substitute.

| | reds | composition |
|---|---|---|
| **uncured** `a534329`, clean tree | **13** | base 6 + delta 7 |
| **cured**, clean tree | **7** | base 6 + `tdw13_d4_extraction` |

**Six delta reds dead**, by name: `tdw09_p2_doors` · `tdw07_f0760_claim` ·
`tdw08_p3_landing` · `tdw09_p2b` · `tdw09_walkrider` · `tdw09_type`.

**Two more that MY OWN BUILD reddened, caught by the floor and cured in this ZIP:**
`tdw09_roles` (pinned the literal `calc(100dvh - 88px)`) and `tdw10_billing_tab` §8.1 (pinned the
old offer string).

### 2a · THREE MEASUREMENT FINDINGS, disclosed rather than absorbed

**(i) The floor needs the sibling repo, and the instrument does not say so.** A first run gave
**16** reds; three of them — `tdw09_p2b_vocab`, `tdw13_d6_parity_matrix`, `tdw15_p1_events` —
were cross-repo cells **REFUSING** because `dream-os` was not beside the clone. With the sibling
present they are green. `run-floor.sh` guards elaborately against hand-written enumerations but
has **no guard for a refusal counted as a red** — the same disease its own header names four
times. Proposed, not taken: the runner should detect the sibling's absence and STOP, exactly as
it STOPs for an orphaned wrapper.

**(ii) `tdw_f0774_vacuity_probe` reds on any un-committed tree.** It requires a clean tree by
design. A floor run *after* apply and *before* commit therefore always shows it. The 13/7 figures
above were both taken on committed trees. **The founder's run should be taken after the commit,
or that one red declared.** This is not a defect in the probe; it is the probe being right about
a tree it was handed.

**(iii) `tdw13_d4_extraction` IS NOT THIS ARC'S RED.** Tested at `8ebbe9e` — *before*
M-LEADS-TRUTH — it was **already failing**. Its §2a pins ten relocated lines led by the pre-0123
`VENDOR_CATEGORIES` array, which 0123 / R-35.26 deliberately killed: a TDW_13 bench outliving a
TDW_15 ruling, RETIRE-WITH-THE-READER from another block. **Not touched, because curing it means
editing another block's bench on a ruling I would be citing second-hand.**

**R-36.1 therefore lands at base + 1, and the +1 is named, dated and outside this charge.**
One word opens it.

---

## 3 · BENCH MOVEMENTS, counts disclosed

| bench | movement |
|---|---|
| `tdw09_p2_doors` | §7.2.3 **RETIRED** — the storefront's Leads tile is gone by ruling. Repointing it to `/vendor/list/leads` would assert *the storefront links Leads*, now false. `b07_p5` §12.5 pins its absence from the dream-os side. |
| `tdw07_f0760_claim` | §10.1 eighteen → **seventeen** demo pages |
| `tdw08_p3_landing` | `/discover/leads` **joins `KNOWN_ORPHANS` with its ground** — orphaned *by ruling*, and still reachable from a real WhatsApp link in a real chat, which is why R-35.36 chose delete-plus-redirect |
| `tdw09_p2b` | §3.7 — retired half dropped, **surviving half still pinned** (a vetoed byte does not lapse because its neighbour left) |
| `tdw09_walkrider` | §4.2/§4.3/§4.4/§5.1 **RETIRED**, replaced by **§4.5**, a stub-guard: the rebuild those cells assumed would never happen now cannot happen silently. §4.1's law holds by construction; §5.2 survives because its law is a *contrast* between two pages. |
| `tdw09_roles` | the dvh-literal cell **re-founded on the measured bound** — same property, new mechanism |
| `tdw10_billing_tab` | §8.1 re-founded on the 2026-08-24 byte |
| `tdw09_type` | **unchanged, and not in this ZIP** |
| `tdw16_r2_leads_truth` | **NEW**, 10 cells, L1 + L2 |
| `tdw09_vendor_census.json` | regenerated through its **committed pipe**, never hand-edited; proven idempotent (re-running the pipe reproduces the shipped bytes) |

**`tdw16_r2_leads_truth` both-ways: control green, then nine arms.** Two ledger predictions were
**wrong and are corrected in-file to what the run output**: M1 reddened 2.1 alone (the mutation's
early `return` leaves `istDayKey` as dead code, and 2.2 is a source-presence cell that stays
green over it — the unreachable case belongs to 2.1 and is covered there); M6 reddened 1.1, 1.3
*and* 1.5, because three cells key on the same literal. That is over-coupling, not a defect — the
byte is the anchor — but it is recorded so a future seat reading three reds knows it is one cause.

---

## 4 · COPY — exactly two bytes, both pre-vetoed, no third

| byte | source |
|---|---|
| `ENQUIRED VIA TDW` | founder, 2026-08-22 |
| `First month free. Full price from the second month. Offer applies to UPI payments only.` | founder, 2026-08-24 |

L2, L3, L3-demo and L4 are **zero-copy**. No persona name appears in any shipped byte.

---

## 5 · WHAT THE NEXT SEAT SHOULD KNOW

1. **The badge exemption is an interpretation.** The ruling said *"the re-founded `tdw09_type`
   cell admits the site as engraved-with-citation"*, which suggests a bench change; it also said
   *"never by widening the floor silently"* and *"an eleventh un-cited site must still red"*,
   which argue against one. **I took the conservative reading: the bench is untouched and the
   site passes the census's existing test on its merits, with the ruling cited at the site.** If
   the chair meant a citation mechanism inside the census, that is a small follow-on.
2. **`tdw13_d4_extraction`** — inherited, outside charge, one word opens it.
3. **`run-floor.sh` has no sibling-repo guard** — finding (i) above, proposed not taken.
4. **The three-month-array duplication** in `SliceRow.tsx` (`fmtArrival` now has its own
   `MONTHS_SHORT`; `fmtDate` and `fmtLeadDate` each hold inline copies) is **filed, visible and
   untouched** — a tidy with no ruling, and their bytes were not in R2's charge.
5. **The fixture SELECT and the walk card are deliberately not in this ZIP.** Fixture-state law:
   the card is authored FROM the founder's pasted rows, not ahead of them. Both follow the
   moment this lands.
