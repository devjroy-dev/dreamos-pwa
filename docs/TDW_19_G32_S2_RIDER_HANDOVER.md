# TDW_19 · G3.2 s2 · THE RIDER — THE PROFILE SHEET AS A FORM

**Seat:** CE-40 · G3.2 s2 · LE · 2026-09-07.
**Bases, both from a fresh clone:** `dreamos-pwa 1d04dd2d` · `dream-os 09b7f2e`.
**Rulings:** R-40.114, R-40.116, R-40.117 as amended by **R-G32.21**.
**Findings cured:** F-40.235, F-40.236, F-40.237.

`b56` **236/236** (was 205) · `b57` **153/153** (was 126) · `tsc` clean · pwa floor **27 REDs, set identical to base**.

---

## 1 · WHY THE RIDER EXISTS

The sheet shipped at `1d04dd2` with all twenty-eight rows blank and every value a free-text
string. Three things were wrong and only one of them was visible:

- **F-40.235** — the ratified frame drew **25 worked examples** and exactly **three** blanks
  (marked `wl-fldv blank`, to *demonstrate* the blank state). The seat read the labels and
  discarded the value column, then applied the blank state to all twenty-eight.
- **F-40.237** — and the value column could not have been shipped as it stood either. It was
  drawn as **rendered output**: `rs()` supplies `Rs `, `pct()` supplies `%`, and clauses 4.6,
  4.7, 6.5, 7.2 and 7.5 supply the literal ` days` and ` months` themselves. Sixteen rows would
  have printed **doubled** on a signed agreement — `Rs Rs 4,000`, `7 days days`,
  `1.5% a month%`. Derived from the renderer before any value reached a contract.
- **F-40.236** — the header promised *「Leave anything blank and it prints as a blank」*, which
  was true of v3's `__________` and false of v4, where BLANK is retired to a tagged template
  that cannot render a missing field. R-40.104's class: a byte that outlived its mechanism.

---

## 2 · THE THING THAT ALMOST SHIPPED — R-G32.21

R-40.117 as first ruled said: for on-the-day trades, omit the `Delivered within` row. **It could
not be cut as written**, and the reason was two clauses deep.

`f` returns `null` when any interpolated value is absent (`contractPdf.js:157`), so an unset
`delivery_days` **omits clause 7.2 whole**. Clauses 4.7 and 11 both end *「…is added to the period
stated in clause 7.2」* and print intact, because their own values are present. A makeup
agreement would therefore have carried **two clauses pointing at a clause not in the document** —
the precise failure register `:196` names as the reason `delivery_days` was made REQUIRED at v4.

And the vendor-facing half: `delivery_days` is one of the six on `requiredRows`, so a row the
sheet never asks is a row that never fills. **Send would never have appeared for any makeup
vendor** — including the one the walk runs on.

The amendment gives 7.2 **two arms**, and the on-the-day arm carries **no interpolation at all**,
which is the property that makes 4.7 and 11 safe: it cannot be omitted by an absent value.

> Delivery is on the day of the last function. Time lost to a suspension under clause 4.7, or to
> an event stated in clause 11, moves that day accordingly.

**This sentence is a new instrument byte** and is recorded here for the register's v4 amendment
line, per the chair's note.

---

## 3 · WHAT LANDED

### dream-os (5 files)

**`contractAnnex.js`** gains `TRADE_DEFAULTS` (14 trades), `TRADE_BASE`, `PROFILE_PLACEHOLDERS`,
`tradeDefaultsFor`, `omittedFor`, `DELIVERY_FAMILY`. It sits beside the annex map because both
answer *「what does this vendor's trade usually do」* off the same `vendors.category`.

Every numeric seed is **bare** — `4000`, `7`, `1.5`, `45`. The unit is carried on the label.
The four `Needed` rows are seeded in **no** trade.

**`contractPdf.js`** — clause 7.2's two arms; the renderer takes `deliveryBasis` as a parameter
and never resolves one (it still imports `contractAnnex` for `annexTitle`, which is ruling F4's
own cure).

**`contractSource.js`** — resolves the basis at the one call site, and **`category` joins
`PDF_VENDOR_COLUMNS`** (`PUBLIC_SCHEMA.md:1204`). It was absent, and the absence would have been
**silent**: `tradeDefaultsFor` takes `null` as legal input and answers `days`, so every
on-the-day vendor would simply have printed the days arm. Caught by naming the column against
the schema, not by a bench.

**`api/vendor/contracts.js`** — the `annex-map` door serves `seeded`, `delivery_basis`,
`defaults`, `omitted` and `placeholders` alongside the map. One door, one round trip, one place
the category is read.

### dreamos-pwa (3 files)

The sheet opens **pre-filled**, seeds layered **under** her stored answers (`{ ...seeds,
...stored }` — her row wins every collision). Every row carries `Yours` · `Default` · `Needed`.
`savedKeys` is **held, not diffed**: a vendor whose answer happens to equal the default would
otherwise read `Default`, and she chose it.

Units on labels (17 rows). Placeholders from the door, `{name}` substituted from the session.
`gst_treatment` and `deposit_refundable` are **controls, not text fields** — clause 4.2 reads
*「The fee is {gst_treatment} of…」* and only `inclusive`/`exclusive` complete it, so a typo would
drop the tax block off a signed agreement in silence. The GSTIN is not asked; it is DERIVED from
`vendors.gstin` (register `:134`) and the note points at Settings.

`requiredRows` takes the basis: **six rows for a days trade, five for an on-the-day trade.**

---

## 4 · WHAT THIS SEAT GOT WRONG

**A cell that could not fail.** The chair asked for *「each trade's seed has no row that trade
omits」*. The first cut asserted exactly that — and `omittedFor` **derives from the seed**, so the
intersection is empty by construction. Driven with makeup seeding `link_live_days`, the bench
stayed at 233/233. **A mutation that changes behaviour and moves no cell is hollow green**, and
this one was a tautology written in the shape of a law. Replaced with two falsifiable statements
against an independent source (the basis): no on-the-day trade seeds a clause-7 row, and every
days trade seeds `delivery_days`. Both redden on mutation.

**A cell that punished correct code.** `the renderer takes it as a parameter, never looks it up`
asserted the renderer imports nothing from `contractAnnex.js` — and it has since ruling F4, for
`annexTitle`. That import *is* the one-home cure. Split into three cells asserting the precise
property: it takes the basis, it never calls `tradeDefaultsFor`, and it still reads annex titles
from their one home.

Both were caught by **driving the mutation and reading the number**, not by review.

---

## 5 · OWED

- **The register's v4 amendment line** for 7.2's on-the-day arm (chair's, recorded above).
- **The trade→basis assignment is a judgement, not a derivation.** Nothing in the estate records
  whether a trade hands over on the day. Seven were assigned `on_the_day` by what the trade
  does; all fourteen are the chair's to correct by row.
- **The seed *values*** — exclusions, category words, overtime rates per trade — are this seat's,
  drawn from the ratified frame's examples converted to storable form. Every one is a number or
  a phrase a vendor will live under.
- **`required_missing` still does not exist.** `requiredRows` remains the room's derivation and a
  second home for a rule the door does not carry. When the refusal ships it must read the basis
  too, or the surface and the door will disagree for on-the-day trades.
- **T3's two omission lists** still need a page map from `POST /preview`.
