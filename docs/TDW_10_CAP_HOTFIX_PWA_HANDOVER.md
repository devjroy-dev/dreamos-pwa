# TDW_10 · F-10.100 HOTFIX (pwa) — THE DUPLICATE UPGRADE, FOUNDER-CAUGHT LIVE

**Built at:** dreamos-pwa `00489e5` · **Radius:** one predicate + one bench section.
**Origin of the finding:** the founder's own walk. He set a Signature daily cap to 1,
spent it, and saw `1/1Upgrade` stacked above a second `Upgrade` — inside ninety seconds.

---

## 1 · THE DEFECT, AND IT IS MINE

`TierMeter.tsx:17` returns null only when `turns_cap` is FALSY. At a spent **nonzero**
cap the widget renders and shows its own Upgrade anchor at `nearing || capped`. My
page-level seat rendered on `state === 'capped'`. **Both conditions true, both anchors
drawn.** Two identical Upgrade links, live.

**Cure:** `!meta.turns_cap` on the page-level seat — the EXACT COMPLEMENT of TierMeter's
guard, so the two seats now **partition** the capped states instead of overlapping. The
widget owns every cap it can draw a bar for; this seat owns the one cap it cannot. Named
per F-06.85 at the seat: if TierMeter's guard moves, this line moves with it.

The fix stays in `page.tsx` rather than in TierMeter because the (β) ruling seated this
control OUTSIDE that widget's guard on purpose — so a future tidy of the widget can never
hide the sale again. Moving it inside would undo the ruling to fix its side effect.

---

## 2 · WHY NO CELL CAUGHT IT — THE CLASS SENTENCE

My control inventory claimed **MOVED, NET ZERO**. That was true at a **zero** cap, where
TierMeter returns null — and a zero cap was the only state the acceptance walk reached
and the only state the bench asserted. The one state where both seats render is the one
nobody looked at.

**AN INVENTORY THAT COUNTS CONTROLS IN A SINGLE STATE IS A CLAIM ABOUT THAT STATE, NOT
ABOUT THE CONTROL.** Offered for the record, in CONTROL-INVENTORY LAW's family.

`tdw10_tier §9` is the inventory the first one should have been: it evaluates BOTH shipped
predicates across FOUR meter states and **counts the anchors** — 1 at a zero cap, 1 at a
spent nonzero cap, 1 at nearing, 0 at ok — plus §9.4 (no capped state strands her) and
§9.5 (the two never both fire).

---

## 3 · TWO BENCH DEFECTS THE BOTH-WAYS RUN AND A MUTATION TAUGHT ME

**D-1 · THE CELLS PROVED MY MODEL, NOT THE CODE.** The first draft of §9 held its own
retyped copies of both guards — and stayed **GREEN against the live duplicated tree**. A
check whose failure mode is 「 my copy still agrees with itself 」 is not a check. Both
predicates are now LIFTED FROM SHIPPED SOURCE and executed (`new Function` over the matched
expression), including TierMeter's `nearing`/`capped` locals, bound from the same two lines
the component derives them from.

**D-2 · A MUTATION CRASHED INSTEAD OF REDDENING.** Rewriting TierMeter's anchor condition
made the lift regex miss and the bench THREW — producing no FAIL line, so the mutation read
as **NON-BITING when it had destroyed the instrument**. That is F-09.93's disease, and it
found me. Cured with CE-206's refuse-never-crash shim: a failed lift now returns a
false-and-recorded predicate, and **§9.2b asserts every lift succeeded**, so an unliftable
source reddens loudly rather than exiting the process.

Also disclosed: one regex miss that was my own stray paren rather than a source change, and
a second aborted `git checkout` that had me editing a stale tree for a minute — reset and
re-applied on the correct tip, disclosed rather than quietly re-run. Third occurrence this
session; the lesson is that a `git checkout` in a dirty tree is a no-op with a warning, and
a warning scrolls.

---

## 4 · THE PROOF

- `tdw10_tier` **107/107** cured · **3 cells RED at the live duplicated tree `00489e5`**,
  and §9.3 reproduces the founder's screen exactly: `→ 2 rendered`.
- **Five mutations, all biting** (after the shim): the gate dropped so the duplicate
  returns · the gate inverted so a zero-cap vendor is stranded · TierMeter's guard moved
  so the seats stop partitioning · the meter anchor firing at `ok` · TierMeter's `capped`
  local inverted.
- `tsc --noEmit` **0** on a cleared `.next`.
- **FLOOR unmoved:** uivendor 76 · billing_tab 22 · p1_discover 44 · home 67 · p2c 52 ·
  console 55 · shell 57 · retint 76 · type 16 · landing 103 · panel 34. Attributed reds
  unmoved: deck 191/193 · f0774 32/34.

---

## 5 · FILED, NOT CURED — NOT MY FILE

**THE BILLING CARD CONTRADICTS ITSELF.** On the founder's screen: PLAN **Signature** ·
PRICE **Rs 1,999 / month** · STATUS **「 Cancelled. You're on Basic. 」**

`components/vendor/SubscriptionCard.tsx:57` maps `billing_status: 'cancelled'` to that
sentence **with no reference to `tier` at all** (`:140`). The string is truthful in its
DESIGNED case — a cancel flip drops tier to basic, so both move together — and false
whenever tier and billing_status are set independently, which is exactly what an admin
tier change does.

It is not cosmetic: **the engine agrees with the Plan row, not the Status row.** Her cap
resolved off `vendor_ai_daily_signature`, which is why the spent sentence fired at all.
The screen is the only thing claiming Basic. `SubscriptionCard.tsx` is the Billing
session's file; untouched here, chartered nowhere, handed to the chair.
