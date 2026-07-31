# TDW_07 P5 — THE GLITCH, THE DELAY, AND A FALSE GREEN · EXECUTOR HANDOVER
**Base:** `dreamos-pwa @ 5de3324` · **Executor:** Opus-LE · **Date:** 2026-07-31

Two files: `components/frost/EnquirySheet.tsx` · `app/(frost)/frost/canvas/sanctuary/page.tsx`.

---

## 1 · THE TWO DEFECTS THE WALK FOUND

**The delay was my own design flaw.** The sheet's entire body was gated behind
`loading`, and `loading` waited on `fetchCoupleMe` — one of the six endpoints
returning 403 under F-07.44. The wait was a full round-trip that could never
succeed. The comment in that function said *"prefill is a courtesy; its absence
never blocks the enquiry"* while the code three lines below made it a
precondition. Gate removed: fields render at once, and populate if the profile arrives.

**The glitch was two animations disagreeing.** `handleEnquire` called
`setPanelOpen(false)`, starting the panel's 340ms slide-out, while the sheet
mounted instantly with no transition. Cured on both sides — the panel now STAYS
OPEN (the sheet's scrim at z-120 already covers it at z-60) and the sheet rises on
the estate's own curve. Leaving the panel is also truer: dismissing the sheet
returns her where she was.

## 2 · A FALSE GREEN, AND THE GATE LESSON — THE PART THAT MATTERS

**I reported "next build: 0 code errors" on a build that never type-checked.**

In the executor's container `next build` aborts at the Google Fonts fetch BEFORE
reaching `Running TypeScript`. The founder's own log shows the true sequence:
`✓ Compiled successfully` → `Running TypeScript ...Failed to type check` →
`EnquirySheet.tsx:133 Type error: Cannot find name 'setLoading'`. My grep for type
errors was searching output that was never produced.

**Compounded with the earlier finding, the shape is now clear:**

| gate | catches | misses |
|---|---|---|
| `tsc --noEmit` | type errors (`setLoading`) | `'use client'` placement, RSC boundaries |
| `next build` (this container) | directive + RSC errors | type errors — aborts at fonts first |

**NEITHER IS SUFFICIENT ALONE.** Four builds died to the first gap; this one died
to the second. The proposal to the chair stands and sharpens: §6's frontend gate is
**both** commands, and the delivered verify line runs both so D-10's STOP guards
the union rather than either half.

## 3 · THE PROXIMATE CAUSE, OWNED

One patch used `.replace()` **without an assert**, silently matched nothing (the
anchor missed a leading `}` that closes the `try`), and left `setLoading(false)` in
a `finally` whose state declaration was gone. Every replacement in this delivery is
asserted — and the assert fired on the first re-cut, which is the whole point of it.

## 4 · PROOF

```
tsc --noEmit  : 0 errors        ← the gate that sees this class
next build    : 0 'use client' · 0 Ecmascript
                4 remaining = Google Fonts fetch (container network allowlist)
```

Fully green is NOT claimed. The founder's Vercel run is the witness.

## 5 · UNCHANGED, STILL OPEN

F-07.44's cookie check — SQL branch exonerated (`auth_user_id` linked, `users_id`
matches), leaving line 14's vendor-token fallback the only remaining explanation,
unconvicted. The middleware cure is not built.
