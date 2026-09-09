# CE-41 · SEAT D · F-41.106 (dreamos-pwa) — the room needs its provider

**Cut at** dreamos-pwa `852b6d58238eb33631ab0a1a33925cf01800a6b1`.

## What it was

`ChatThread`, `MessageBubble` and `InputBar` all call `useT()`, and `ThemeContext`'s default is **`DARK`** (`ThemeContext.tsx:6`). `AskSheet` wraps them in `<ThemeProvider pinned={mode}>` at `:84`. **R-41.139 composed the same three and did not**, so on the advisor page they fell through to that default.

**Invisible on Graphite, loud in Chalk.** The default *is* dark, so the thread looked nearly right and only the bar's border and send button gave it away — which is exactly what the founder spotted. In Chalk every bubble would have been dark-on-light.

**Same class as F-41.105:** composing pieces without carrying what the thing around them supplied. There a palette, here a provider.

## The fix

One `<ThemeProvider pinned={mode}>` around **the whole room**. Wrapping only the bar would have cured the one symptom Graphite happened to show and left the bubbles defaulting for Chalk to reveal — a cell now asserts every `useT` consumer the page mounts sits inside the provider and none outside.

`mode` comes from **`useMode()`**, the same layout provider `WorklistShell` reads at `:64`. **F-38.41: read, never held** — a local `useState` resets on every navigation and loses Chalk, which is the defect F-38.41 exists to record. A cell asserts there is no local mode state.

## Floor

`b20_a3` **GREEN 144/144** cured, **RED 141/144** uncured, `tsc` clean. Build fails on 16 font fetches and zero type errors — F-40.134, the founder's gate.

## The walk, both arms

**Graphite:** the bar's field takes the teal border and the send button fills, matching every other bar in the estate.

**Chalk — the one that matters.** Switch the mode and open `/vendor/advisor`. Bubbles, thread and bar must all be light. **If any of them stays dark, the provider is not reaching that component** and the cell missed a consumer.

**Range F-41.107 unspent** (F-41.106 spent here).
