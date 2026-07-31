# TDW_07 P5 — F-A: BOTH SURFACES + THE ARRIVAL GRAMMAR · EXECUTOR HANDOVER
**Base:** `dreamos-pwa @ 1488d6f` · **Executor:** Opus-LE · **Date:** 2026-07-31

---

## 1 · WHAT SHIPPED

| # | File | What |
|---|---|---|
| 1 | `app/(frost)/frost/canvas/discover/page.tsx` | §D's hoist — sheet + toast moved OUT of `GlassOverlay`'s transformed drawer to the page root; `onEnquire` threaded. **The arrival-grammar cure.** |
| 2 | `app/(frost)/frost/canvas/sanctuary/page.tsx` | The sheet on the LIVE surface, mounted as a sibling of `DiscVendorPanel`; `handleEnquire` becomes the opener, its old posting path retired. |
| 3 | `components/frost/EnquirySheet.tsx` | Gesture isolation at one home. |

## 2 · PROOF

```
npx next build:  'use client' errors 0 · Ecmascript errors 0 · type errors 0
                 4 remaining = Google Fonts fetch (container network allowlist)
```

**A fully green build is not claimed** — the font fetch cannot succeed here. Same
four-font failure as the pre-existing baseline. The founder's Vercel run is the witness.

## 3 · §D's CURE, AND WHY IT WAS TWO BUGS

`GlassOverlay`'s root carries `transform: translateY(...)`. A CSS transform on an
ancestor creates a **containing block for `position: fixed` descendants** — so the
sheet's `inset: 0` resolved against a ~300px drawer, not the viewport. Black screen,
second-click, mispositioned card.

Separately, that same drawer owns `onTouchStart/Move/End` for drag-to-dismiss, so a
touch on a **field** was read as a deck swipe. That was the vanishing card.

Hoisting cures the first. The second is cured **in the sheet itself**, not per-mount:
both host surfaces sit inside gesture-owning containers (sanctuary's `DiscoverRoom`
root also has touch handlers *and* `touchAction:'none'`), so isolating at one home
means a third surface inherits the fix rather than rediscovering the bug.

## 4 · THE ARRIVAL GRAMMAR — DIAGNOSIS BEFORE CURE

**It was never the blind toggle.** `isBlindMode` defaults `false` (`:913`), the only
persistence is `?blind=1` (`:918`), and the file's sole `localStorage` read is
`tdw_demo_discover` (`:38`) — no blind sibling. Blind was OFF in the founder's walk.

The divergence is what each surface renders **while the card is closed**:

| surface | closed-state render |
|---|---|
| sanctuary `:1706` | `vendor.name` · `category` · `city` — identity visible |
| canvas `:863,:878` | `IgChip` · featured badge · a tap hint — **nothing identifying** |

Blind-by-omission, not blind-by-toggle — which is exactly why it felt like blind mode
with blind mode off. The cure is additive: the canvas's closed frame gains
name · category·city · starting price (D-1, server-governed, null renders as absence).
Container is `pointerEvents:'none'`, so the swipe surface is byte-unchanged. Sanctuary
needed nothing — it already had the correct grammar.

## 5 · A BENCH THE CHAIR ASKED FOR AND I DID NOT WRITE — NAMED, NOT SKIPPED

The ruling specified *"an arrival-state cell per surface asserting info-visible at t=0
and blind reachable only through the toggle."*

**There is no bench harness in `dreamos-pwa`.** Every bench in this estate lives in
`dream-os/scripts/`, and a cross-repo structural grep would assert against a checkout
this repo's CI never has. Per the floor-method law I name the gap rather than
silently preserve a count: **the arrival-state assertion ships as a WALK CARD step,
not a cell.** If the chair wants it benched, the honest route is a PWA bench harness —
its own micro, not a smuggled cross-repo grep.

## 6 · DISCLOSURES

1. **Two mounts now exist** and are named in-file as temporary, bounded by F-07.43.
2. **Sanctuary's `handleEnquire` no longer posts.** The posting contract lives in the
   sheet alone; keeping a second path on the same screen is the shape §3 forbids.
3. **`formatRs` imported from `lib/vendor/format`** — the estate's one money donor,
   never a local formatter (F-07.16's law).
4. **Touch isolation cannot be witnessed from this container** (PROVABLE-EQUIVALENT,
   CE-115). Only the founder's device proves a field tap no longer dismisses the card.

## 7 · STILL OPEN

F-07.44's cookie check — the SQL branch is **exonerated** (`auth_user_id` linked,
`users_id` matches), leaving line 14's vendor-token fallback as the only remaining
explanation. Unconvicted until the founder reports which cookies are present, so the
middleware cure is NOT built.
