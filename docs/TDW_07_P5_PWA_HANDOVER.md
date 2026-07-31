# TDW_07 P5 — PWA MOVEMENT A · EXECUTOR HANDOVER
**Base:** `dreamos-pwa @ 09f8244` · **Executor:** Opus-LE · **Date:** 2026-07-31
**Rides:** ZIP 2. Applies AFTER `TDW_07_P5_BACKEND.zip` (`dream-os @ e27c8d3`).

---

## 1 · WHAT SHIPPED

| # | File | What |
|---|---|---|
| 1 | `lib/frost/budgetBands.ts` | **NEW.** F-07.34's one home — five founder-vetoed full-register labels, values byte-identical, plus `bandLabelFor` / `bandForAmount` for the sheet's prefill. |
| 2 | `app/(frost)/frost/canvas/discover/page.tsx` | Band list re-pointed to the one home. |
| 3 | `app/demodiscover/page.tsx` | Band list re-pointed. |
| 4 | `app/(frost)/frost/canvas/sanctuary/page.tsx` | Band list re-pointed **+ F-07.39 cured** — `res.ok` checked, `API_BASE` + `getCoupleSession()` replacing the hardcoded base and the raw storage read, V6's honest toasts. |
| 5 | `app/demo/vendor/[handle]/page.tsx` | **F-07.37's screen half** — the claim landing stops showing success on failure, with a rendered failure branch and a retry. |

**W-1 clean.** No soul/prompt/lens/engine byte. `components/shared/VendorProfileView.tsx` is **deliberately absent** — unchanged this movement, so it ships no byte (clobber law).

## 2 · PROOF

```
tsc --noEmit, changed files:  ZERO errors
tsc --noEmit, whole tree:     baseline (09f8244) 0  ·  cured 0   → zero NEW errors
register sweep:               ZERO `Rs …L` forms remain in app/
```

The gate earned its keep: the first run failed on `Property 'coupleId' does not exist on type 'CoupleSession'` and `Property 'bride_name' does not exist`. The old handler compiled only because `JSON.parse` returns `any`. `getCoupleSession` already normalises the legacy `coupleId` key onto `id` (`_base.ts:135`) and the interface's field is `name` — so the two-key fallback was both invalid and redundant. Fixed at the cause.

## 3 · THE DERIVATION THE CHAIR REQUIRED

**What the new path uses instead of the hardcoded base and the raw storage read:**

- `API_BASE` — `lib/frost-api/_base.ts:34`, the one base authority, following `NEXT_PUBLIC_API_BASE`.
- `getCoupleSession()` — `_base.ts:127`, the one session authority: localStorage **with a `tdw_couple_session` cookie fallback**, which is protocol §4's settled iOS Safari pattern ("cookie-before-localStorage with session mirrors").

Stated precisely, because the honest claim is narrower than "no localStorage": this estate's session layer already owns that storage. What §8's clause forbids is a **new direct read**, and the cure removes one. The consequence is not cosmetic — the raw read at the old `:1580` had **no cookie fallback**, so on exactly the devices the fallback exists to rescue, the handler was posting as a logged-out bride and losing her `couple_enquiries` row. That is a second, unnamed defect the F-07.39 cure closes.

## 4 · DISCLOSURES

1. **`BUDGET_OPTIONS` / `DISC_BUDGETS` survive as local aliases** of `BUDGET_BANDS` rather than being renamed at every use site. The cure is one list and one register; renaming ~6 references would enlarge the diff without changing a fact.
2. **`bandLabelFor` / `bandForAmount` have no caller yet.** They exist for the sheet (ZIP 3) and are exported now so the bands file is written once. Named here rather than discovered as dead code.
3. **The demo landing's failure line is NEW COPY** — `That didn't go through.` / `Your claim wasn't saved. Please try again.` / `Try again`. This is V7, which the chair held pending exactly this derivation: **the landing had no failure affordance at all** — the success screen was unconditional. So a string was needed. **Founder veto owed on these three.**

## 5 · WHAT REMAINS — ZIP 3, THE LAST MOVEMENT

The enquiry sheet (Frost, prefilled from her profile via `bandForAmount`, the vetoed labels, the expectation line) · **F1(a)'s wiring** at `VendorProfileView:220` — the deck's Enquire posting to `/enquire` and then handing off, which is what finally kills the six misrouted demo `wa.me` links · the Journey's `Sent`.

Then the walk card, fixture-derived, spec acceptance §5 as its spine.
