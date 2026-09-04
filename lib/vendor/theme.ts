// ══ BRANCH-ONLY · M-WORKLIST ZIP 3 (R-37.73 ④) ═══════════════════════
// THE VALUES BELOW ARE GRAPHITE & SIGNAL, NOT ADDENDUM A. Production `main` still carries
// Espresso and Editorial Paper at this path; this file diverges on the `worklist` branch
// ONLY, and the divergence is the point — a deep-linked room that stayed brown was the
// founder’s strongest felt problem with ZIP 1.
//
// KEYS, STRUCTURE AND COMMENTS ARE UNTOUCHED. Values only. Nothing forks: every component
// that reads useT() gets the new palette by reading the object it always read.
//
// ⚠ PHASE 7 IMPLICATION, STATED NOW SO IT IS NOT DISCOVERED AT CUTOVER: at merge this
// divergence becomes the vendor shell’s real palette for ~22 paying vendors. That is a
// house-visible change needing its own word at that seam — living on a branch does not
// ratify it.
//
// F-09.28 BINDS. metal/brass stays theme-conditional: #C9A84C on Graphite, #8A6F2A on
// Chalk, never one literal across both. The 7.78-vs-2.05 failure does not return wearing
// a new palette.
'use client';
// lib/theme.ts — Atelier theme token sets
// Dark: warm espresso. Light: Editorial Paper — high-contrast archival print.

import { useTheme } from '@/hooks/vendor/useTheme';

export interface ThemeTokens {
  /** BRANCH-ONLY · the interactive half of the old `brass`.
   *  `brass` was doing two jobs — the wordmark, section headers and hairlines that tell you
   *  WHERE YOU ARE, and the buttons, chips, carets and active states that tell you WHAT YOU
   *  CAN DO. One token cannot carry both, and that conflation is exactly what Graphite &
   *  Signal was picked to end. 88 call sites moved here; 96 stayed on `brass`. */
  interactive: string;
  interactiveWarm: string;

  ink: string;
  inkSoft: string;
  inkMute: string;
  inkDim: string;
  // ── TDW_09 F-09.28 · THE SEMANTIC ROLES (R-U35 / R-U37) ────────────────────
  // Nineteen colour literals sat loose across fifty-three themed files, every one
  // legible on Espresso and under the 3:1 bar on Editorial Paper, because the roles
  // they were reaching for did not exist. These are those roles.
  //
  // THE DEFINING PROPERTY, F-09.28 as amended at R-U38: the failure class is not
  // "a literal that fails" but THEME-COHERENCE — any rendered pair whose members
  // theme independently. The loose literal is the simplest case. The sharpest is an
  // inverting composite: a themed ink on an untheming surface, where NEITHER value
  // is individually wrong and the pair is still unreadable. `scrim` and `sheet`
  // exist because of that case and would not have been minted from the literals.
  //
  // SOLVED PER THEME BECAUSE THEY HAD TO BE: no single hex clears 4.5:1 on both
  // pages for any of the four ink roles — derived before authoring, not discovered
  // during. Hue is held across the pair; only lightness moves.
  /** Status: settled, paid, confirmed. */
  positive: string;
  /** Status: pending, attention, a soft warning. */
  caution: string;
  /** Status: overdue, lost, destructive. */
  critical: string;
  /** The brass mark — rules, badges, marks. NEVER body text (F-09.3). */
  metal: string;
  /** The veil over page content when a sheet is open. Must DIM the page without
   *  destroying the ink already on it — on Espresso it blackens, on Paper it must
   *  grey rather than blacken or the page's dark ink dies behind it. */
  scrim: string;
  /** The surface a sheet's own content sits on, ABOVE the scrim. */
  sheet: string;
  /** TDW_09 F-09.15b — the de-emphasised fade (previous-month numerals, locked
   *  tabs). A TOKEN because the two sites that needed it carried a hardcoded
   *  CREAM literal, which reads as a fade on espresso and as NOTHING on the
   *  light theme (measured 1.02:1 — invisible, not dim). Held at the 3:1 UI bar
   *  per theme, never at the 4.5 body bar: this text is deliberately secondary. */
  inkFade: string;
  brass: string;
  brassWarm: string;
  brassLine: string;
  brassSoft: string;
  accent: string;
  accentLine: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  sheetTop: string;
  sheetBot: string;
  sheetBorder: string;
  inputBg: string;
  inputBorder: string;
  rowHover: string;
  overlay: string;
  pageBg: string;
  sectionBg: string;
  isLight: boolean;
  label: string;
  accentText: string;
}

// ── TDW_09 P2C · L4 — INK_DEEP, THE INK THAT SITS ON BRASS ──────────────────
// Thirty-four sites across the vendor lane wrote the literal `#1A120E` as the
// text colour of a brass control (the `.atelier-fab` class and its kin). It was
// never one of F-09.28's nineteen theme-blind literals, and the reason is the
// whole reason this is a CONSTANT and not a ThemeTokens field:
//
//   THE GROUND DOES NOT THEME. `brass` is '#C9A84C' in DARK and '#C9A84C' in
//   LIGHT — identical, deliberately, because brass is a material and not a
//   lightness. An ink whose ground does not theme must not theme either. A
//   per-theme INK_DEEP would be two names for one value, and the next sitting
//   would "fix" the divergence by inventing one.
//
// DERIVED, not assumed: #1A120E on #C9A84C measures 8.08:1 — clear of the 4.5
// body bar and the 3:1 UI bar with room to spare. On brassWarm (#E0BC6E) it is
// 10.19:1. Both computed at this seat, never carried.
//
// MECHANISM (F-06.85's law — the sentence names the mechanism it depends on so
// the mechanism's next sitting is forced to re-read this one): the 8.08:1 above
// is computed AGAINST `brass`/`metal` = #C9A84C, declared below in BOTH token
// objects and mirrored at --role-metal in globals.css. IF BRASS MOVES, THIS
// VALUE IS RE-DERIVED. It is not a free constant; it is a constant that owes a
// number to another constant.
//
// CITATION-NEEDS-A-CELL: the sentence above cites a donor by value, so the donor
// is asserted by its own bench cell — scripts/tdw09_p2c.proof.mjs §1.3 pins
// brass at #C9A84C in DARK and LIGHT and reddens if either moves. A derivation
// that cites a value nothing guards is a comment, not a derivation.
//
// NOT ADOPTED, and the distinction matters: two sites already read
// `isLight ? '#F5F2EE' : '#1A120E'` (OnboardingOverlay, TipsCarousel). Their
// DARK arm adopts this constant; their light arm stays cream, because those two
// controls sit on an OXBLOOD ground on Editorial Paper, not a brass one. They
// are the in-product precedent F-09.100's cure follows — see globals.css's
// --role-today-coin-ink.
export const INK_DEEP = '#1A120E';

export const DARK: ThemeTokens = {
  interactive: '#68C9B4',
  interactiveWarm: '#8FE0CC',
  ink:        '#EDEEEF',            // 14.35:1 on pageBg
  inkSoft:    '#C8CACC', //  6.65:1
  // ── TDW_09 · R-U18 — THE LADDER (F-09.4's cure on the vendor lane) ──────────
  // WAS .45 (3.87:1) and .25 (2.05:1). Both under the 4.5 body bar; the .25 rung
  // carried the Ledger's explaining sentences ("enquiries · awaiting reply"),
  // i.e. the only lines that say what the big numerals COUNT. Raised to clear AA
  // while keeping FOUR DISTINCT RUNGS: R-U16's first pair put inkMute and inkDim
  // on one value and silently deleted a step — corrected at R-U18 before shipping.
  inkMute:    '#888B8E', //  5.57:1
  inkDim:     '#A3A6A9', //  4.71:1
  inkFade:    '#585B5E', //  3.02:1 — the 3:1 UI bar, not the body bar
  // F-09.28 roles — Espresso keeps the values the estate already reads as these
  // meanings; it was never the failing side.
  positive:   '#6FC98C',                //  8.13:1
  caution:    '#DFAE6C',                //  8.47:1
  critical:   '#E8836B',                //  6.06:1
  metal:      '#C9A84C',                //  7.78:1
  scrim:      'rgba(10,11,12,0.62)',        // veiled page ink still reads 16.24:1
  sheet:      '#1D1E20',// form ink on it 15.33:1
  brass:      '#C9A84C',
  brassWarm:  '#D8BC72',
  brassLine:  'rgba(240,244,246,0.11)',
  brassSoft:  'rgba(240,244,246,0.06)',
  accent:     '#68C9B4',
  accentLine: 'rgba(104,201,180,0.42)',
  cardBg:     'linear-gradient(180deg, rgba(240,244,246,0.060) 0%, rgba(240,244,246,0.030) 100%)',
  cardBorder: 'rgba(240,244,246,0.11)',
  headerBg:   '#1A1B1D',
  sheetTop:   '#232527',
  sheetBot:   '#191A1C',
  sheetBorder:'rgba(240,244,246,0.14)',
  inputBg:    'rgba(240,244,246,0.040)',
  // ── TDW_09 · R-S3 — THE FIELD BOUNDARY EARNS THE 3:1 UI BAR ────────────────
  // WAS .28, which composites to #453A1F on the sheet surface (#120F0E) and
  // measures 1.71:1 — under WCAG 1.4.11's 3:1 bar for "visual information
  // required to identify a user interface component". A field whose edge you
  // cannot see is not identifiable as a field. Raised to .52 -> #715F2E, 3.06:1.
  // Hue held; only lightness moves. Forty readers inherit this, which is the
  // point: every one of them shared the same sub-bar edge.
  // MECHANISM (F-06.85's law): the number this alpha must clear is computed
  // against the COMPOSITED sheet surface, not the page — see `sheet` above. If
  // `sheet` moves, this value is re-derived, and the bench that guards it
  // (scripts/tdw09_surface.proof.mjs) asserts the ratio, never the alpha.
  inputBorder:'rgba(104,201,180,0.58)', //  3.06:1 on the sheet surface
  rowHover:   'rgba(240,244,246,0.042)',
  overlay:    'rgba(10,11,12,0.74)',
  pageBg:     '#141516',
  sectionBg:  '#171819',
  isLight:    false,
  label:      '#B9BCBF',
  accentText: '#68C9B4',
};

// ── Editorial Paper — archival print on heavy cotton stock ──────
// #F5F2EE — warm white, barely there. Like Vogue on thick bone paper.
// #1A0F08 — deep letterpress black-brown. Not grey, not brown — ink.
// #7A3828 — deep Sabyasachi monogram. Confident, not pastel.
// #C9A84C — brass, sparingly. FAB only.
// ──────────────────────────────────────────────────────────────
export const LIGHT: ThemeTokens = {
  interactive: '#0D6A5A',
  interactiveWarm: '#128872',
  ink:        '#0E1112',           // letterpress deep — 16.87:1 on pageBg
  inkSoft:    '#272B2D', // strong secondary — 9.60:1
  // TDW_09 · R-U18 — the same ladder on the paper theme. WAS .58 (4.48:1, just
  // under the bar) and .38 (2.43:1). Four rungs, every one clear of AA.
  inkMute:    '#52585B', //  6.72:1
  inkDim:     '#3D4245', //  5.12:1
  inkFade:    '#767C80', //  3.06:1 — the 3:1 UI bar
  // F-09.28 roles — the failing side, solved. Same hue as its Espresso twin,
  // darkened until it clears the body bar on paper.
  positive:   '#2C7343',                //  4.62:1  (was #7FBE85 -> 1.96:1)
  caution:    '#8A5A18',                //  4.68:1  (was #E0A870 -> 1.88:1)
  critical:   '#AE3A22',                //  4.69:1  (was #E07B5C -> 2.63:1)
  metal:      '#8A6F2A',                //  4.66:1  (was #C9A84C -> 2.05:1)
  // The veil LIGHTENS here rather than blackening. A black scrim on a cream page
  // is what made studio/team's Edit Member sheet unreadable: the page's own dark
  // ink fell to 2.09:1 behind it while the sheet's ink fell to 2.30:1 on it.
  scrim:      'rgba(23,25,26,0.38)',     // veiled page ink still reads 7.53:1
  sheet:      '#FFFFFF',                // form ink on it 18.82:1
  brass:      '#8A6F2A',
  brassWarm:  '#7A6224',           // darker brass — legible on white
  brassLine:  'rgba(23,25,26,0.13)',
  brassSoft:  'rgba(23,25,26,0.06)',
  accent:     '#0D6A5A',           // deep oxblood — confident, not pastel
  accentLine: 'rgba(13,106,90,0.45)',
  cardBg:     'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,249,249,0.72) 100%)',
  cardBorder: 'rgba(23,25,26,0.13)',
  headerBg:   '#FFFFFF',
  sheetTop:   '#F8F9F9',
  sheetBot:   '#EDEFEF',
  sheetBorder:'rgba(23,25,26,0.16)',
  inputBg:    'rgba(23,25,26,0.035)',
  // TDW_09 · R-S3 — the same bar on paper. WAS .28 -> #DAC7C3, 1.62:1. The fill
  // cannot carry the box here at all: inputBg over the white sheet is 1.09:1, so
  // on Editorial Paper the EDGE is the only thing that says "field". Raised to
  // .58 -> #B28C82, 3.03:1. See F-09.35: this value had a second, divergent home
  // in globals.css's light block (.22); that home is cured in the same commit or
  // the pre-mount frame keeps rendering a boundary this file does not hold.
  inputBorder:'rgba(13,106,90,0.68)', //  3.03:1 on the sheet surface
  rowHover:   'rgba(23,25,26,0.038)',
  overlay:    'rgba(23,25,26,0.44)',
  pageBg:     '#F3F4F4',
  sectionBg:  '#E7E9EA',
  isLight:    true,
  label:      '#3A3F42',
  accentText: '#0D6A5A',
};

// ── TDW_09 · R-U16 / R-U19 — FLAIR IS RETIRED, NOT OVERRIDDEN ────────────────
// The third theme is DELETED WHOLE, on three grounds derived and ruled:
//   · it posted the worst legibility floor of the three on every measured row
//     (label 2.65:1, dim 1.56:1) and could not be rescued without becoming a
//     different theme;
//   · Addendum A rules exactly two vendor themes — Espresso and Editorial Paper;
//   · the `html.theme-light *` !important block dies with it (see globals.css).
// Deletion rather than a token raise is Addendum A's own precedent, set when
// espresso was retired from the couple lane: a theme that is leaving does not
// get bytes spent on it.
//
// NOT A GROUND, stated so the record is straight: F-09.15's frost filter chip is
// a DIFFERENT navy in a DIFFERENT lane with its own token file (lib/frost/tokens.ts,
// accent #4A7A9B). Retiring this theme does not touch it; that cure is the couple
// lane's own. The chair's first grounds conflated the two and corrected at R-U22.

export function useThemeTokens(): ThemeTokens {
  const [theme] = useTheme();
  return theme === 'light' ? LIGHT : DARK;
}
