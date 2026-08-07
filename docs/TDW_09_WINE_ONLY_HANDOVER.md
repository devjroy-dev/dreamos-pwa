# TDW_09 · WINE-ONLY — the single-theme ruling, executed by the chair's own hand
**2026-08-07 · base: the REVERTED tree (byte-identical to `339ba5a`) · founder ruling verbatim: 「 do away with the light skin and only have dark mode. single theme for the time being 」**

## The cure, four seats + one labelled amendment
1. `lib/frost/tokens.ts` — **getFrostMode() pinned `'E1A'`** (the mode's ONE reader; layout.tsx:45 seeds context from it, so every consumer follows). Stored key ignored, never migrated.
2. **setFrostMode() no-op** — a value nothing reads is not written.
3. **getV2Tokens() returns V2_WINE_NIGHT unconditionally** — the belt beneath the braces. **museLookFromHomeMode() → 'E1'.** Sky & Ivory's token set RETIRED-NOT-DELETED for the day a second theme returns by ruling.
4. `sanctuary/page.tsx` — **the daytime auto-clock EXCISED** (alive, it would have set state 'E3' by day and flipped `dark=false` against pinned WINE tokens — a mixed-theme render; mechanism named in-comment per F-06.85) and **the Appearance swatch control REMOVED WHOLE** (a switch wired to a pinned reader is a lying control — honest-controls law), its `setHomeMode` prop retired at interface + component + call site.
5. `scripts/tdw09_p2c.proof.mjs` — **LABELLED AMENDMENT, one label two seats:** the `['mode','mode:${mode}']` roster row retired with its subject (7→6 maps) and §4.6's anti-vacuity floor 7→6. **Both-ways witnessed live: the unamended bench FAILED against the cured tree (§4.6, actual 1 expected 0) before the amendment greened it.**

## Proof at the cut
tsc **0** · `tdw09_p2c` **52/52** (53→52: one cell retired with its subject) · home ALL GREEN · roles 131 · landing 103 · retint 76 · doors 86 · p4b_body 133 · tier 98 · pin proven structurally (reader E1A · gate WINE · muse E1 · writer inert). Rendered-byte delta: **zero new strings** (removals only). Control inventory: Appearance swatches REMOVED-BY-FOUNDER-RULING; nothing else moves.

## What returns a second theme
Un-pin `getFrostMode`/`getV2Tokens`/`museLookFromHomeMode`, restore the writer, restore the swatch block and the clock — each seat's comment names this door. Warm Porcelain's approved values (CE-207's record) remain on the books for that day.
