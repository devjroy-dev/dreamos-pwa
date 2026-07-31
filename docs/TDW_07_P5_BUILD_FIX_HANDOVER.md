# TDW_07 P5 — THE BUILD FIX · EXECUTOR HANDOVER
**Base:** `dreamos-pwa @ 0d3db0f` · **Executor:** Opus-LE · **Date:** 2026-07-31

---

## 1 · WHAT HAPPENED

**Four consecutive production deployments failed.** `9b4c751` · `9271d6b` ·
`2351af4` · `0d3db0f` — every PWA push of this sitting. Production has been
serving `09f8244` throughout: the tip from before P5 touched this repo. **Nothing
I shipped to the PWA today has ever been live.**

**Cause: one mistake, three files.** The patch scripts that added imports
prepended them to the TOP of files beginning with `'use client';`, displacing the
directive to line 2 or 3. Next.js requires it first. All 15 build errors cascade
from that single placement fault in:

- `app/(frost)/frost/canvas/discover/page.tsx` (directive at line 3)
- `app/(frost)/frost/canvas/sanctuary/page.tsx` (directive at line 3)
- `app/demodiscover/page.tsx` (directive at line 2)

## 2 · THE FIX

The directive moves to line 1 in all three. Nothing else changes — no logic, no
copy, no imports removed. Diff is three line-moves.

## 3 · PROOF, AND ITS LIMIT — STATED

```
'use client' errors:             0
Ecmascript errors:               0
Server Component import errors:  0
remaining:                       Google Fonts fetch ×4
```

`npx next build` run against the fixed tree. The error class that broke four
builds is **eliminated**. The build still exits 1 in the executor's container
because `fonts.googleapis.com` is outside its network allowlist — an environment
limit, not a code fault; the same fonts built green on Vercel for every pre-P5
deployment. **A fully green build is NOT claimed here.** The founder's Vercel run
is the witness.

## 4 · THE PROCESS FINDING — THIS IS THE PART THAT MATTERS

**`tsc --noEmit` IS NOT A BUILD GATE, AND THE PROTOCOL TREATS IT AS ONE.**

Protocol §6 specifies, for frontend work: *"apply to the cloned repo →
`npx --no-install tsc --noEmit` filtered to changed files — zero new errors."*

That gate returned **0 errors on all four broken commits.** It returned 0 on the
whole tree. I reported "tsc zero errors, whole tree" four times, in four
handovers, and each time it was true and each time it meant less than the sentence
implied — because `tsc` type-checks TypeScript and has no opinion about the
`'use client'` directive, which is a Turbopack/Next constraint enforced only at
build.

A gate that passes while the artifact cannot build is not a gate. The verify line
in every one of those four apply blocks was `npx --no-install tsc --noEmit`, so
the founder's own D-10 STOP could not fire either: the verify was green, the git
line ran, and a broken build reached origin four times.

**Proposed, for the chair:** §6's frontend gate becomes `npx next build` (or
`next build --no-lint` for speed), with `tsc --noEmit` retained as a fast
pre-check, never as the final word. The delivered verify line changes with it, so
the STOP guards the thing that actually breaks.

## 5 · WHAT REMAINS AFTER THIS LANDS

Nothing of P5's PWA work has been witnessed live. Once the build is green, the
walk restarts from step 1 — and the sheet still needs mounting on the SECOND
surface (`DiscVendorPanel` in sanctuary), which is a separate open §0.2.
