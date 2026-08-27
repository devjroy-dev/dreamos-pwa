// lib/worklist/theme.ts — GRAPHITE & SIGNAL, the branch shell's own token layer.
//
// R-37.65: the branch defines its own theme AT THE TOKEN LAYER. Addendum A governs the old
// shell and is byte-untouched; nothing here writes to app/globals.css and nothing here
// forks a component. Shared components that read var(--atelier-*) inherit these values
// wherever they render inside the shell scope.
//
// THE 33 TOKENS ARE COMPLETE IN BOTH MODES. A hole is not a mode: tokenCount() below is
// asserted by the shell's own cell, so a token dropped in a later edit reddens rather than
// silently falling back to the old shell's value.
//
// MEASURED, NOT ASSERTED. Every ratio quoted was computed by WCAG 2.1 relative luminance
// after compositing translucent layers over the ground they actually sit on — the card at
// its weaker gradient stop, the field edge against the sheet. That is the method theme.ts
// uses on itself (its own annotations at :150 and :204 measure 3.06 and 3.03 the same way).
//
// THE CARD IS A COMPOSITE, NOT A FILL. cardBg is a two-stop gradient of translucent layers,
// exactly as the estate builds it. An opaque card would have looked identical in a swatch
// and would have quietly retired the room atmospheres (\u00a78.13), which are only visible
// THROUGH a card.
//
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
export const TYPE = {
  t0: { size: 46, line: 0.95, weight: 500, family: 'feature' },
  t1: { size: 24, line: 1.2,  weight: 500, family: 'feature' },
  t2: { size: 17, line: 1.3,  weight: 500, family: 'body'    },
  t3: { size: 14, line: 1.45, weight: 400, family: 'body'    },
  t4: { size: 12, line: 1.4,  weight: 500, family: 'body'    },
  t5: { size: 11, line: 1.3,  weight: 500, family: 'body'    },
} as const;

export type Rung = keyof typeof TYPE;

/** The rungs, in one array, so the bench and the arm read the set rather than a copy. */
export const RUNGS: readonly Rung[] = ['t0', 't1', 't2', 't3', 't4', 't5'] as const;

/** The ruled floors, unchanged and still true of the six: min 11, interactive 12, body 14. */
export const TYPE_FLOORS = { label: 11, interactive: 12, body: 14 } as const;

/** Every control the finger can reach is at least this, in CSS px. R-37.73 \u2460. */
export const TAP_MIN = 44;

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
export const GRID = { base: 4, step: 8, gutter: 16, tile: 64, row: 52 } as const;

// ── THE TWO FAMILIES, ONE JOB EACH ──────────────────────────────────────────
// Four families existed and each was doing several jobs; that — not size — is why the
// shell and the rooms read as two font worlds. Two remain, and neither can drift, because
// no call site names a family at all: it names a rung.
export const TYPE_ROLE = {
  /** Cormorant \u2014 t0 and t1 only. The numeral and the page title. Never prose. */
  feature: 'var(--font-cormorant), Georgia, serif',
  /** DM Sans \u2014 every other byte in the shell, at t2 through t5. */
  body:    'var(--font-dm-sans), system-ui, sans-serif',
} as const;

/**
 * Emit the scope's type layer.
 *
 * ONE VARIABLE PER RUNG, AS THE `font` SHORTHAND. `font: var(--wl-t3)` sets family, size,
 * line-height and weight in one indivisible act. The shorthand RESETS font-variant-numeric,
 * so any rule wanting tabular figures must declare `font-variant-numeric` AFTER its `font`
 * line \u2014 stated here because the ordering is silent when it is wrong.
 */
export function typeCss(scopeSelector: string): string {
  const fam = (k: Rung) => (TYPE[k].family === 'feature' ? TYPE_ROLE.feature : TYPE_ROLE.body);
  const rung = (k: Rung) => `--wl-${k}:${TYPE[k].weight} ${TYPE[k].size}px/${TYPE[k].line} ${fam(k)};`;
  return (
    `${scopeSelector}{` +
    RUNGS.map(rung).join('') +
    `--wl-gutter:${GRID.gutter}px;--wl-step:${GRID.step}px;` +
    `--wl-tile:${GRID.tile}px;--wl-row:${GRID.row}px;}`
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
  | 'scrim' | 'sheet' | 'today-coin-ink';

const ROLE_KEYS: TokenKey[] = [
  'metal', 'ink-on-metal', 'ink-deep', 'positive', 'caution', 'critical',
  'scrim', 'sheet', 'today-coin-ink',
];

export function prefixFor(k: TokenKey): string {
  return (ROLE_KEYS.includes(k) ? '--role-' : '--atelier-') + k;
}

export const GRAPHITE: Record<TokenKey, string> = {
  'bg':            '#0F1011',
  'page-bg':       '#141516',
  'header-bg':     '#1A1B1D',
  'section-bg':    '#171819',
  'sheet-bg':      '#1D1E20',
  'overlay-bg':    '#0A0B0C',
  'card-bg':       'linear-gradient(180deg, rgba(240,244,246,0.060) 0%, rgba(240,244,246,0.030) 100%)',
  'card-border':   'rgba(240,244,246,0.11)',
  'card-shadow':   'rgba(0,0,0,0.50)',
  'row-hover':     'rgba(240,244,246,0.042)',
  'grain':         'rgba(255,255,255,0.012)',
  'input-bg':      'rgba(240,244,246,0.040)',
  'input-border':  'rgba(104,201,180,0.58)',   // 3.72:1 on the sheet
  'sheet-top':     '#232527',
  'sheet-bot':     '#191A1C',
  'sheet-border':  'rgba(240,244,246,0.14)',
  'overlay':       'rgba(10,11,12,0.74)',
  'ink':           '#EDEEEF',                  // 15.74:1 on the page
  'ink-soft':      '#C8CACC',                  // 10.38:1 on the card
  'ink-dim':       '#A3A6A9',                  //  6.98:1
  'ink-mute':      '#888B8E',                  //  4.98:1
  'ink-fade':      '#585B5E',                  //  recorded, no bar
  'label':         '#B9BCBF',                  //  9.03:1 on the header
  'accent-text':   '#68C9B4',                  //  8.62:1 on the card
  'metal':         '#C9A84C',                  //  7.47:1 \u2014 the metal only; R-37.43's gold move
  'ink-on-metal':  '#141516',                  //  8.00:1 on the metal
  'ink-deep':      '#0F1011',
  'positive':      '#6FC98C',                  //  8.46:1
  'caution':       '#DFAE6C',                  //  8.46:1
  'critical':      '#E8836B',                  //  6.41:1
  'scrim':         'rgba(10,11,12,0.62)',
  'sheet':         '#1D1E20',
  'today-coin-ink':'#141516',                  //  8.00:1 on the metal
};

export const CHALK: Record<TokenKey, string> = {
  'bg':            '#EDEEEF',
  'page-bg':       '#F3F4F4',
  'header-bg':     '#FFFFFF',
  'section-bg':    '#E7E9EA',
  'sheet-bg':      '#FFFFFF',
  'overlay-bg':    '#17191A',
  'card-bg':       'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,249,249,0.72) 100%)',
  'card-border':   'rgba(23,25,26,0.13)',
  'card-shadow':   'rgba(23,25,26,0.09)',
  'row-hover':     'rgba(23,25,26,0.038)',
  'grain':         'rgba(23,25,26,0.012)',
  'input-bg':      'rgba(23,25,26,0.035)',
  'input-border':  'rgba(13,106,90,0.68)',     // 3.25:1 on the sheet \u2014 0.62 measured 2.88 and was raised
  'sheet-top':     '#F8F9F9',
  'sheet-bot':     '#EDEFEF',
  'sheet-border':  'rgba(23,25,26,0.16)',
  'overlay':       'rgba(23,25,26,0.44)',
  'ink':           '#0E1112',                  // 17.82:1 on the card
  'ink-soft':      '#272B2D',                  // 13.43:1
  'ink-dim':       '#3D4245',                  //  9.56:1
  'ink-mute':      '#52585B',                  //  6.79:1
  'ink-fade':      '#767C80',                  //  3.98:1 \u2014 recorded, no bar
  'label':         '#3A3F42',                  // 10.02:1 on the header
  'accent-text':   '#0D6A5A',
  'metal':         '#8A6F2A',
  'ink-on-metal':  '#FFFFFF',
  'ink-deep':      '#17191A',
  'positive':      '#2C7343',
  'caution':       '#8A5A18',
  'critical':      '#AE3A22',
  'scrim':         'rgba(23,25,26,0.38)',
  'sheet':         '#FFFFFF',
  'today-coin-ink':'#FFFFFF',
};

export const TOKEN_COUNT_EXPECTED = 33;

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
