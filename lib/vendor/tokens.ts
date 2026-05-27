// Design tokens — hand-mirrored from the locked vendor design system.
// SESSION_BOUNDARIES §326-331: cross-repo imports are forbidden;
// these constants are the permitted duplication for inline-style use cases
// that cannot go through Tailwind utility classes.
//
// SOURCE OF TRUTH: SESSION_BOUNDARIES_2026_05_12.md §154-181
// DO NOT MODIFY without a founder decision recorded in CONTEXT_AND_DECISIONS.

export const COLORS = {
  cream:  '#F8F7F5',
  warm:   '#F4F1EC',
  gold:   '#C9A84C',
  ink:    '#0C0A09',
  muted:  '#8C8480',
  border: '#E2DED8',
} as const;

export const FONTS = {
  display: '"Cormorant Garamond", Georgia, serif',
  body:    '"DM Sans", system-ui, sans-serif',
  label:   '"Jost", system-ui, sans-serif',
} as const;

export const FONT_WEIGHTS = {
  // Cormorant Garamond
  displayLight: 300,
  // DM Sans
  bodyLight:   300,
  bodyRegular: 400,
  // Jost
  labelThin:    200,
  labelLight:   300,
  labelRegular: 400,
} as const;

export const EASE = {
  luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

// Currency display — locked per WORKING_PROTOCOL Rule V7 and SESSION_BOUNDARIES §173
// Always "Rs", never "₹"
export const CURRENCY_PREFIX = 'Rs';
