// lib/worklist/theme.ts — GRAPHITE & SIGNAL, the branch shell's own token layer.
//
// R-37.65: the branch defines its own theme AT THE TOKEN LAYER. Addendum A governs the old
// shell and is byte-untouched; nothing here writes to app/globals.css and nothing here
// forks a component. Shared components that read var(--atelier-*) inherit these values
// wherever they render inside the shell scope.
//
// THE 35 TOKENS ARE COMPLETE IN BOTH MODES (33 until DESIGN-1 added primary and on-primary). A hole is not a mode: tokenCount() below is
// asserted by the shell's own cell, so a token dropped in a later edit reddens rather than
// silently falling back to the old shell's value.
//
// MEASURED, NOT ASSERTED. Every ratio quoted was computed by WCAG 2.1 relative luminance
// after compositing translucent layers over the ground they actually sit on — the card at
// its weaker gradient stop, the field edge against the sheet. That is the method theme.ts
// uses on itself (its own annotations at :150 and :204 measure 3.06 and 3.03 the same way).
//
// [DESIGN-1: superseded. Teal Ledger's cards are solid fills; the paragraph is kept as history.]
// THE CARD IS A COMPOSITE, NOT A FILL. cardBg is a two-stop gradient of translucent layers,
// exactly as the estate builds it. An opaque card would have looked identical in a swatch
// and would have quietly retired the room atmospheres (\u00a78.13), which are only visible
// THROUGH a card.
//
// [DESIGN-1: the values below are the old ones; Teal Ledger's are #5CC4AE/#0B6655 and #CDB068/#735A1C.]
// TWO THEME-CONDITIONAL VALUES, corrected per ground rather than carried across it:
//   --atelier-accent-text  #68C9B4 (dark) \u2192 #0D6A5A (light)
//   --role-metal           #C9A84C (dark) \u2192 #8A6F2A (light)
// F-09.28 recorded why: one brass literal measured 7.78:1 on Espresso and 2.05:1 on Paper.
//
// ONE OBLIGATION SHIPS UNDER BAR, RECORDED NOT HIDDEN \u2014 arm (iii), ruled.
//   the inactive Slice Door chip: 4.02:1 dark, 3.01:1 light, against a 4.5 bar.
//   SliceShell.tsx:104 hard-codes opacity 0.45 and D-2 forbids a branch fork, so no ink
//   value clears it \u2014 pure black at 0.45 over the light card composites to #888888 and
//   ceilings at 3.33:1. Bound by label to the Phase 2 SliceDoor sitting.
'use strict';

export type WorklistMode = 'dark' | 'light';

// ── THE TYPE SCALE · R-38.4, AMENDED AT CE-38 RELAY #1 ──────────────────────
// [DESIGN-1: this scale is superseded by the one below it; the essay is kept as the record.]
//
// SIX TUPLES, NAMED, AND NO OTHERS. The founder's "the fonts are all over the place" was
// not a taste note, it was a count: at 366a7b5 the shell and the rooms it fronted spent
// four families across fourteen sizes. A sweep cures that for one sitting. A SCALE cures
// it by construction, which is why the rungs below are emitted as the CSS `font`
// SHORTHAND rather than as three separate variables: a call site physically cannot set a
// size without also taking that rung's family and weight. There is no way to author a
// seventh tuple by accident — only by writing a literal, which the render arm reddens.
//
//   t0  46/.95   Cormorant 500   the Today masthead numeral. ONE ELEMENT PER APP.
//   t1  24/1.2   Cormorant 500   page title, at most one per surface
//   t2  17/1.3   DM Sans   500   section heading, the wordmark
//   t3  14/1.45  DM Sans   400   body, row primary, input text
//   t4  12/1.4   DM Sans   500   row secondary, buttons, nav seats
//   t5  11/1.3   DM Sans   500   captions, metadata, section eyebrows
//
// JOST AND ITALIANA RETIRE FROM THE SHELL. Both were real families doing real jobs — Jost
// every micro-label, Italiana the masthead numeral — and the retirement is a ruling, not a
// tidy: R-38.4 names the six and the arm asserts the set is a subset of them. `--wl-label`
// and `--wl-display` are DELETED rather than aliased. An alias would have let every one of
// the fourteen call sites keep its old name and quietly acquire a new value, which is the
// shape of a change nobody can review. They are gone, and the compiler finds the callers.
//
// THE WORDMARK IS t2, DM SANS. CE-38's own "Cormorant at the wordmark" line was struck at
// relay #1: Cormorant-at-17 would have been a seventh tuple, and the whole warrant of a
// closed set is that it is closed. Cormorant survives at t0 and t1 only — the numeral and
// the page title. Italic never appears in functional chrome, at any rung.
//
// LETTER-SPACED UPPERCASE, TWO PLACES ONLY: the nav seats (t4) and section eyebrows (t5),
// both at .08em. The old .16em–.42em engraved register is retired with Jost; it was the
// other half of why chrome read as costume. Tracking is NOT part of the asserted tuple —
// the arm asserts family, size and weight — so this reading is stated here rather than
// enforced, and the handover names it as the reading taken.
// ── DESIGN-1 · STAGE 1 · THE TYPE, AS docs/review/REPORT.md §5 SETS IT (founder-sanctioned) ─────
// The six Cormorant/DM Sans rungs above are superseded by the review's scale, one family (Inter),
// in rem so the text follows the phone's own text size. The closed-set property stands: a call
// site still names a rung, never a size, and the rung is still the `font` shorthand. One rung is
// added, `tb`, because the review sets buttons apart (15/600) and a button borrowing t4 is the
// same borrowing the colour tokens just gave up (primary, below). Sizes at the default 16px root:
//
//   t0  28/32   600   the one big figure (money owed)
//   t1  22/28   600   page title, record title
//   t2  17/23   600   section title, sheet title
//   t3  16/1.45 400   body, input
//   tn  16/1.45 500   a row's name, line 1 of the one row (the report's "Body, row title: 400 and 500")
//   t4  14/20   400   the second line in a row
//   tb  15/20   600   buttons
//   t5  13/18   500   small text, labels, pills: the floor, nothing a vendor reads is smaller
//
// Sentence case, no letter-spacing, no italic; figures are tabular (the shell's stylesheet).
export const TYPE = {
  t0: { size: 28, line: 32 / 28, weight: 600, family: 'body' },
  t1: { size: 22, line: 28 / 22, weight: 600, family: 'body' },
  t2: { size: 17, line: 23 / 17, weight: 600, family: 'body' },
  t3: { size: 16, line: 1.45,    weight: 400, family: 'body' },
  tn: { size: 16, line: 1.45,    weight: 500, family: 'body' },
  t4: { size: 14, line: 20 / 14, weight: 400, family: 'body' },
  tb: { size: 15, line: 20 / 15, weight: 600, family: 'body' },
  t5: { size: 13, line: 18 / 13, weight: 500, family: 'body' },
} as const;

export type Rung = keyof typeof TYPE;

/** The rungs, in one array, so the bench and the arm read the set rather than a copy. */
export const RUNGS: readonly Rung[] = ['t0', 't1', 't2', 't3', 'tn', 't4', 'tb', 't5'] as const;

/** DESIGN-1: the review's floors. Nothing read under 13; controls at 15; body at 16. */
export const TYPE_FLOORS = { label: 13, interactive: 15, body: 16 } as const;

/** Every control the finger can reach is at least this, in CSS px. R-37.73 \u2460. */
export const TAP_MIN = 44;

/**
 * DESIGN-1 · THE ONE SPACING SCALE AND THE ONE BUTTON (REPORT.md §3, "One pattern").
 * Every gap and margin is one of SPACE; page edges and card insides are 16. A button is 48 high
 * with 12px corners; a list row is at least 64 (name, one line of facts, one thing on the right).
 */
export const SPACE = [4, 8, 12, 16, 24, 32] as const;
export const BUTTON = { height: 48, radius: 12 } as const;

/**
 * R-38.5 \u00b7 THE GRID, as amended for F-38.4.
 *
 * FOUR-PX BASE, EIGHT-PX RHYTHM (R-37.82 \u2462 stands). One gutter, raised 12 \u2192 16.
 *
 * TILE HEIGHT IS FIXED AT 64 AND IS NOT AN ASPECT. R-38.5 first ruled 1:1, and 1:1 at
 * three-up on a 390px viewport makes a 114px tile: eighteen rooms then measure ~946px of
 * grid against ~651px of work area, so Settings, Business Solutions, Collab and Advisor
 * sit permanently below the fold. R-37.61's whole warrant is that a room reachable only
 * through the coin is a hidden room — an aspect ratio that hides four of them defeats the
 * ruling it was decorating. 64 clears the 44 tap floor with air and lets the two-line
 * label fit at t5. Ruled at CE-38 relay #2; the arm re-derives the sum at capture.
 */
// ── CE-39 S2/6 HOTFIX · THE FAB'S SEAT JOINS THE GRID  [F-39.4] ─────────────
// The founder's walk found the add control sitting in three different places: 136 on
// Rooms, 120 in the five list rooms, 80 on Notes — and the Notes one painted ON the ask
// dock. Three homes for one piece of arithmetic, which is how the number on Notes stayed
// tree-blind through the sitting that cured exactly this class on SliceShell (F-38.59).
//
// FOUNDER RULING 2026-08-29: 「the FAB sits right on Rooms and nowhere else」 — Rooms is
// the reference, so its measured seat is the one that survives. The values are NOT
// re-derived here: 136 was MEASURED on the deploy at 390x844 in both modes (the dock's
// top edge sits 120px above the viewport bottom, plus one 16px step) and the paragraph
// recording that measurement stays at the rule in WorklistShell.tsx. What changes is that
// the number now has ONE home and every FAB reads it.
export const GRID = { base: 4, step: 8, gutter: 16, tile: 64, row: 64,
                      fab: { size: 56, bottom: 136 } } as const;

// ── THE TWO FAMILIES, ONE JOB EACH [DESIGN-1: now one family, Inter, and the brand face] ──────────────────────────────────────────
// Four families existed and each was doing several jobs; that — not size — is why the
// shell and the rooms read as two font worlds. Two remain, and neither can drift, because
// no call site names a family at all: it names a rung.
export const TYPE_ROLE = {
  /** DESIGN-1: Inter. The key survives for its readers (admin's AdminUI); it no longer names a serif. */
  feature: 'var(--font-inter), system-ui, sans-serif',
  /** Inter \u2014 every byte of app text, at every rung. */
  body:    'var(--font-inter), system-ui, sans-serif',
  /** Cormorant Garamond, for the TDW name in the header and nowhere else (REPORT.md §5, option B's one keep). */
  brand:   'var(--font-brand), Georgia, serif',
} as const;

/** A rung's size in rem at the 16px root, so the rung follows the phone's text size. */
const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`;
const lh = (n: number) => +n.toFixed(4);

/**
 * CE-45 · FE-2 · TYPE_2 · F7 (ruled 24 Sept 2026) · A RUNG THAT HOLDS OUTSIDE THE SHELL.
 *
 * `var(--wl-tN)` has a value only inside a scope that emitted typeCss (the shell's `.wl`, admin,
 * three worklist sheets). A handful of shared modules the shell's rooms open are ALSO mounted where
 * no scope exists: the legacy discover pages and the demo tree. There a bare var() resolves to
 * nothing and the text falls back to whatever face it inherits. Each rung here therefore carries
 * ITS OWN TUPLE as the var() fallback: inside the shell the variable wins and nothing changes;
 * outside it the SAME tuple applies. The tuple is generated from TYPE and TYPE_ROLE above, so it
 * is not a second copy of the scale and cannot drift from it: it is the scale, read twice.
 * t0 is Today's numeral alone and is not offered.
 */
export const RUNG_FONT = Object.fromEntries(
  (['t1', 't2', 't3', 'tn', 't4', 'tb', 't5'] as const).map((k) => [k,
    `var(--wl-${k}, ${TYPE[k].weight} ${rem(TYPE[k].size)}/${lh(TYPE[k].line)} ${TYPE_ROLE.body})`]),
) as Record<'t1' | 't2' | 't3' | 'tn' | 't4' | 'tb' | 't5', string>;

/**
 * Emit the scope's type layer.
 *
 * ONE VARIABLE PER RUNG, AS THE `font` SHORTHAND. `font: var(--wl-t3)` sets family, size,
 * line-height and weight in one indivisible act. The shorthand RESETS font-variant-numeric,
 * so any rule wanting tabular figures must declare `font-variant-numeric` AFTER its `font`
 * line \u2014 stated here because the ordering is silent when it is wrong.
 */
export function typeCss(scopeSelector: string): string {
  const rung = (k: Rung) => `--wl-${k}:${TYPE[k].weight} ${rem(TYPE[k].size)}/${lh(TYPE[k].line)} ${TYPE_ROLE.body};`;
  return (
    `${scopeSelector}{` +
    RUNGS.map(rung).join('') +
    `--wl-gutter:${GRID.gutter}px;--wl-step:${GRID.step}px;` +
    `--wl-tile:${GRID.tile}px;--wl-row:${GRID.row}px;` +
    `--wl-btn-h:${BUTTON.height}px;--wl-btn-r:${BUTTON.radius}px;` +
    // DESIGN-1: every face the estate's modules name resolves to Inter inside the scope, so a
    // legacy module's own stack (Jost, Italiana, the serif) cannot bring its face back into the
    // shell. The TDW name alone reads --font-brand, which is not overridden.
    `--font-dm-sans:var(--font-inter);--font-cormorant:var(--font-inter);` +
    `--font-italiana:var(--font-inter);--font-jost:var(--font-inter);` +
    // The FAB's seat travels with the grid, so the one rule that draws a FAB reads the
    // constant rather than restating it. `right` is the gutter and is NOT a fourth
    // variable — a FAB that sat at its own x would be the edge defect (R-38.5) wearing a
    // circle, and the gutter already has one home two lines up.
    `--wl-fab:${GRID.fab.size}px;--wl-fab-bottom:${GRID.fab.bottom}px;}`
  );
}


/** Every token the shell defines. Keys are written WITHOUT their prefix; prefixFor() adds it. */
export type TokenKey =
  | 'bg' | 'page-bg' | 'header-bg' | 'section-bg' | 'sheet-bg' | 'overlay-bg'
  | 'card-bg' | 'card-border' | 'card-shadow' | 'row-hover' | 'grain'
  | 'input-bg' | 'input-border' | 'sheet-top' | 'sheet-bot' | 'sheet-border' | 'overlay'
  | 'ink' | 'ink-soft' | 'ink-dim' | 'ink-mute' | 'ink-fade'
  | 'label' | 'accent-text'
  | 'metal' | 'ink-on-metal' | 'ink-deep' | 'positive' | 'caution' | 'critical'
  | 'scrim' | 'sheet' | 'today-coin-ink'
  | 'primary' | 'on-primary';

const ROLE_KEYS: TokenKey[] = [
  'metal', 'ink-on-metal', 'ink-deep', 'positive', 'caution', 'critical',
  'scrim', 'sheet', 'today-coin-ink', 'primary', 'on-primary',
];

export function prefixFor(k: TokenKey): string {
  return (ROLE_KEYS.includes(k) ? '--role-' : '--atelier-') + k;
}

// ── DESIGN-1 · STAGE 1 · TEAL LEDGER (docs/review/palettes/palettes.json, "ledger") ──────────
// The founder's pick of the review's three. Every value below is the palette's, verbatim; the
// pairs are measured in docs/review/palettes/CONTRAST.md (text 4.5:1, controls 3:1, all pass;
// the weakest text pair 5.37 dark, 5.23 light). Cards are solid now, not translucent gradients,
// and ink-fade equals ink-mute, so a word drawn in the faded ink still clears 4.5 (finding P6).
// Two tokens join, primary and on-primary: a filled button never again borrows the link colour
// (accent-text) and the deepest ink (ink-deep), the pairing that measured 2.71:1 in Chalk (P3).
export const GRAPHITE: Record<TokenKey, string> = {
  'bg':          '#111416',
  'page-bg':     '#15181A',
  'header-bg':   '#1A1E20',
  'section-bg':  '#171B1D',
  'sheet-bg':    '#202528',
  'overlay-bg':  '#08090B',
  'card-bg':     '#1D2124',
  'card-border': '#343B3E',
  'card-shadow': 'rgba(0,0,0,0.45)',
  'row-hover':   'rgba(236,239,239,0.12)',
  'grain':       'transparent',
  'input-bg':    '#1D2124',
  'input-border': '#909A9C',
  'sheet-top':   '#202528',
  'sheet-bot':   '#202528',
  'sheet-border': '#343B3E',
  'overlay':     'rgba(8,9,11,0.72)',
  'ink':         '#ECEFEF',
  'ink-soft':    '#C9CFD0',
  'ink-dim':     '#A5ADAF',
  'ink-mute':    '#909A9C',
  'ink-fade':    '#909A9C',
  'label':       '#A5ADAF',
  'accent-text': '#5CC4AE',
  'metal':       '#CDB068',
  'ink-on-metal': '#15181A',
  'ink-deep':    '#111416',
  'positive':    '#6CC98A',
  'caution':     '#E0B26E',
  'critical':    '#EE8A73',
  'scrim':       'rgba(8,9,11,0.62)',
  'sheet':       '#202528',
  'today-coin-ink': '#15181A',
  'primary':     '#4DBBA4',
  'on-primary':  '#0A1A16',
};

export const CHALK: Record<TokenKey, string> = {
  'bg':          '#E6E9E5',
  'page-bg':     '#EDEFEB',
  'header-bg':   '#F4F5F2',
  'section-bg':  '#E6E9E5',
  'sheet-bg':    '#F7F8F5',
  'overlay-bg':  '#17191A',
  'card-bg':     '#F7F8F5',
  'card-border': '#CDD3CE',
  'card-shadow': 'rgba(23,25,26,0.07)',
  'row-hover':   'rgba(21,26,27,0.08)',
  'grain':       'transparent',
  'input-bg':    '#F7F8F5',
  'input-border': '#56606A',
  'sheet-top':   '#F7F8F5',
  'sheet-bot':   '#F7F8F5',
  'sheet-border': '#CDD3CE',
  'overlay':     'rgba(23,25,26,0.40)',
  'ink':         '#151A1B',
  'ink-soft':    '#2B3234',
  'ink-dim':     '#434B4E',
  'ink-mute':    '#56606A',
  'ink-fade':    '#56606A',
  'label':       '#434B4E',
  'accent-text': '#0B6655',
  'metal':       '#735A1C',
  'ink-on-metal': '#FFFFFF',
  'ink-deep':    '#151A1B',
  'positive':    '#256B3C',
  'caution':     '#7A4F12',
  'critical':    '#A53420',
  'scrim':       'rgba(23,25,26,0.36)',
  'sheet':       '#F7F8F5',
  'today-coin-ink': '#FFFFFF',
  'primary':     '#0B6B5A',
  'on-primary':  '#FFFFFF',
};

export const TOKEN_COUNT_EXPECTED = 35;   // DESIGN-1: 33 + primary, on-primary

/** Cell input: a mode with a hole is a mode that silently inherits the old shell. */
export function tokenCount(mode: Record<TokenKey, string>): number {
  return Object.keys(mode).length;
}

/** Emit the scope's CSS. One home for the token \u2192 CSS translation. */
export function scopeCss(scopeSelector: string): string {
  const emit = (m: Record<TokenKey, string>) =>
    (Object.keys(m) as TokenKey[]).map((k) => `${prefixFor(k)}:${m[k]};`).join('');
  return (
    `${scopeSelector}[data-wl-mode="dark"]{${emit(GRAPHITE)}}` +
    `${scopeSelector}[data-wl-mode="light"]{${emit(CHALK)}}`
  );
}
