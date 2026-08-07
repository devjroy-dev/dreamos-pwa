# TDW_10 · F-10.91 CURE — THE PICKER FILTERED AN ENTITLEMENT (dreamos-pwa)

**Base:** `0be7370` · **tsc:** `--noEmit` → **0 errors**
**One file, one expression:** `app/vendor/settings/page.tsx`

---

## THE DEFECT, AS WITNESSED

Two live rows, found by the founder's own SELECT:

| id | phone | tier | billing_status | subscription id |
|---|---|---|---|---|
| `5e54b2e7-79cd-4863-8ea6-9515de55dc61` | `+918757788550` | prestige | none | NULL |
| `a8c52506-d363-4a36-9cec-09b50cc32c4c` | `+918595356978` | prestige | none | NULL |

Both read **Plan: Prestige · Price: Rs 2,999 / month · Status: Not set up yet.**
Both were offered **only Essential and Signature.** Prestige was filtered out as
"her current plan" — when `billing_status='none'` and a NULL subscription id
prove no money ever landed. **They were locked out of buying the tier they were
already using.**

Every comped, hand-minted or migrated vendor sat in that state.

---

## THE KEY WAS THE BUG, NOT THE FILTER

```js
// before
.filter(t => t !== currentTier)
```

`vendors.tier` is an **entitlement** — what she *may use*. It is **not** a record
of what she is subscribed to, and this estate has no such column by design: the
subscription's tier lives at Razorpay; what the database keeps is the id and the
status. Reading an entitlement as if it were a purchase is the whole defect.

The instinct to add a `subscribed_tier` column is the wrong cure — it would be a
second home for a fact Razorpay already owns, F-04.36's family, and it would go
stale the first time a webhook was missed.

---

## THE CURE — NO COLUMN, NO WIRE FIELD, NO SCHEMA

```js
.filter(t => !(isUpgrade && t === currentTier))
```

`isUpgrade` already carried the truth and was sitting one line away:
`billing_status === 'active'` means a **live mandate exists**.

- **Active vendor** → her paid tier drops out. Re-buying the plan you are
  currently paying for is not an offer.
- **Everyone else** → nothing filtered, all three offered, including the one her
  entitlement happens to name.

---

## PROVEN

`§D.5` (dream-os bench) asserts entitlement and purchase are independent on the
exact witnessed shape. `§D.6` is its mutation: it asserts the **broken** filter
excludes Prestige from that row — red at the uncured tree — and that the cured
filter includes it. Non-vacuous both ways.

`tdw10_selfserve` moves **26 → 28**. Sealed benches unmoved: billing **52**,
tier **80**.

---

## SCOPE

Downgrade semantics are **not** ruled and this cure does not invent them. A
vendor on an active Prestige mandate who taps Essential still takes the
`upgrade` path — cancel-then-mint — which is behaviourally correct (her old
mandate must die before a new one opens) even though the word is wrong. Naming
that path for a move in either direction is a copy question for a later sitting,
not a defect in this one.
