# ZIP 5 — R-37.74, THE BRASS SPLIT (arm iii)

**Applied over `d4d95f3`. Floor: sixteen cells, exit 0. `npx tsc --noEmit`: exit 0.**

---

## §1 · WHAT THE SPLIT IS

`brass` was one token doing two jobs: **where you are** (the DREAMAI wordmark, section headers,
hairlines, state marks) and **what you can do** (buttons, chips, carets, active states). That
conflation is precisely what Graphite & Signal was chosen to end, so the token is split rather
than remapped:

- `interactive` / `interactiveWarm` — new. `#68C9B4` on Graphite, `#0D6A5A` on Chalk.
- `brass` / `brassWarm` — unchanged. Still gold. Still the metal.

**88 call sites moved. 96 stayed gold.**

## §2 · HOW EACH SITE WAS CLASSIFIED

A brace-aware scan of JSX opening tags: a `brass` reference sitting inside a `<button>`, `<a>`,
`<Link>`, or any tag carrying `onClick` is interactive. That found **70**.

**Then the 114 it called chrome were read, one line at a time, rather than trusted.** The scan
has a systematic blind spot — it only sees inside an opening tag — and the audit found three
classes of miss, all of them interactive:

| miss | example | why the scan missed it |
|---|---|---|
| hoisted to a `const` | `BottomNav.tsx:130` — the active nav item's colour | assignment sits outside any tag |
| nested inside a tappable parent | `VictorModeChip.tsx:76` — the active chip's label | the `<span>` has no `onClick`; its parent does |
| caret and accent colours | thirteen `caretColor` sites, `collab:825`'s checkbox | the caret lives on the input, not on a button |

**18 audited overrides applied**, bringing the total to 88. Carets matter more than they look:
the caret is the most interactive pixel on any screen a vendor types into.

## §3 · WHAT STAYED GOLD, AND WHY THAT IS THE RULE WORKING

State marks — `NEW`, `UPCOMING`, `sent`, `approved` — stay gold. They tell you where a thing
**is**, not what you can **do** to it. Same for section headers, the wordmark, hairlines, and
empty-state prose. `SliceRow`'s `stateColor()`, `contracts:28`, `portfolio:848` and `featured:79`
are all state functions and all stayed.

## §4 · A STRUCTURE THAT NEARLY SWALLOWED THE SPLIT

The pages do **not** read `ThemeTokens` for `A` — each file declares its **own local `A` map**
onto CSS variables. So `A.brass` was already var-driven, and the split needed the two new keys
added to **fourteen** local maps.

`SliceRow.tsx` has **two**: a module-level `export const A` and a second `const A` shadowing it
inside the component. Extending only the first left the shadowed one orphaned — a token split
going quietly wrong in exactly the place such splits go wrong. Caught, extended, both maps carry
the keys.

## §5 · CELLS

**C16** asserts no `caretColor` still reads a gold token, and that both modes declare the new
token. **Proved RED**: reverting one caret in `SliceShell.tsx` → *caretColor still gold*.

**AN ARM WAS CUT RATHER THAN SHIPPED.** C16's first draft also tried to catch a token map that
offers `brass` without `interactive`. **It did not redden on its mutation** — I orphaned
`SliceRow`'s shadowed map with an assertion that the edit applied, and the cell stayed GREEN. It
was vacuous, so it is gone.

That defect is caught by the **type floor**, and this is not a guess: when the shadowed map
lacked the key, `npx tsc --noEmit` produced **two TS2339 errors** — re-proved on the mutation
above. A cell that duplicates a stronger guard badly is worse than no cell, and shipping the arm
would have claimed a guard that was not there.

## §6 · STILL OPEN

**Touch in the carried rooms.** C10's 44px floor holds across the worklist shell only. Extending
it into `/vendor/**` — filter chips, slice-door chips, row actions, sheet controls — is a sweep
across shared single homes with consumers on `main`, and it wants a scope and a D-2 argument per
component before a byte. Unruled.

**The 503.** Still awaiting one console line from the founder's handset (see §13).

**Phase 7.** The branch's colour divergence — `lib/vendor/theme.ts`, the `globals.css` override
layer, the control literals, and now the brass split — becomes the vendor shell's real palette
at cutover, for ~22 paying vendors. It needs its own word at that seam. Branch residence does
not ratify it.
