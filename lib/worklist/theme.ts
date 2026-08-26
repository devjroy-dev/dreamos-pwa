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

// ── THE TYPE SCALE (R-37.73 \u2461) ─────────────────────────────────────────────
//
// AD-HOC PX IS RETIRED. Tile names shipped at 9px in ZIP 1 and were convicted as illegible
// chrome; the cure is not a bigger number at one call site, it is that sizes stop being
// numbers at call sites at all. Every size below is named, and the floors are asserted by
// the bench so a later edit cannot walk one back quietly.
//
// THE FLOORS, ruled: no label under 11px \u00b7 no interactive text under 12px \u00b7 body \u2265 14px.
//
// WHY 9px LOOKED FINE IN A DESKTOP RENDER AND FAILED ON GLASS: Jost at these sizes is a
// hairline, and a hairline antialiases toward its ground. The measured contrast ratio is
// honest for a flat block of colour and overstates a thin glyph every time \u2014 the same
// mechanism that made Chalk read washed until the weights were corrected. Size and weight
// are one decision, so they are set together here.
export const TYPE = {
  /** Uppercase Jost labels — headers, band captions, state marks. FLOOR 11. */
  label:       { size: 11,   weight: 500, track: '0.18em' },
  /** The nav seats and any other uppercase control label. FLOOR 12 (interactive). */
  seat:        { size: 12,   weight: 500, track: '0.16em' },
  /** Tile names. Interactive, so the 12 floor binds — 9 was the conviction. */
  tile:        { size: 12,   weight: 500, track: '0.08em' },
  /** Card titles. Interactive block headings. */
  cardTitle:   { size: 12,   weight: 500, track: '0.14em' },
  /** Body prose in cards and sheets. FLOOR 14. */
  body:        { size: 14.5, weight: 400, track: '0' },
  /** Chips — tappable, so the 12 floor binds and the target is padded to 44. */
  chip:        { size: 13,   weight: 400, track: '0' },
  /** Button labels. Interactive. */
  action:      { size: 12,   weight: 500, track: '0.16em' },
  /** The Today empty lines, set in the display face. */
  display:     { size: 19,   weight: 400, track: '0' },
  /** The first-run header. */
  displayHead: { size: 22,   weight: 400, track: '0' },
} as const;

/** The ruled floors. The bench reads these, not a copy of them. */
export const TYPE_FLOORS = { label: 11, interactive: 12, body: 14 } as const;

/** Every control the finger can reach is at least this, in CSS px. R-37.73 \u2460. */
export const TAP_MIN = 44;


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
