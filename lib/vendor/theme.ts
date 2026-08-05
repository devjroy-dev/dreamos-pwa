'use client';
// lib/theme.ts — Atelier theme token sets
// Dark: warm espresso. Light: Editorial Paper — high-contrast archival print.

import { useTheme } from '@/hooks/vendor/useTheme';

export interface ThemeTokens {
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

export const DARK: ThemeTokens = {
  ink:        '#F0E6D2',            // 14.35:1 on pageBg
  inkSoft:    'rgba(240,230,210,0.65)', //  6.65:1
  // ── TDW_09 · R-U18 — THE LADDER (F-09.4's cure on the vendor lane) ──────────
  // WAS .45 (3.87:1) and .25 (2.05:1). Both under the 4.5 body bar; the .25 rung
  // carried the Ledger's explaining sentences ("enquiries · awaiting reply"),
  // i.e. the only lines that say what the big numerals COUNT. Raised to clear AA
  // while keeping FOUR DISTINCT RUNGS: R-U16's first pair put inkMute and inkDim
  // on one value and silently deleted a step — corrected at R-U18 before shipping.
  inkMute:    'rgba(240,230,210,0.58)', //  5.57:1
  inkDim:     'rgba(240,230,210,0.52)', //  4.71:1
  inkFade:    'rgba(240,230,210,0.37)', //  3.02:1 — the 3:1 UI bar, not the body bar
  // F-09.28 roles — Espresso keeps the values the estate already reads as these
  // meanings; it was never the failing side.
  positive:   '#7FBE85',                //  8.13:1
  caution:    '#E0A870',                //  8.47:1
  critical:   '#E07B5C',                //  6.06:1
  metal:      '#C9A84C',                //  7.78:1
  scrim:      'rgba(0,0,0,0.7)',        // veiled page ink still reads 16.24:1
  sheet:      'rgba(255,255,255,0.035)',// form ink on it 15.33:1
  brass:      '#C9A84C',
  brassWarm:  '#E0BC6E',
  brassLine:  'rgba(201,168,76,0.18)',
  brassSoft:  'rgba(201,168,76,0.28)',
  accent:     '#E07B5C',
  accentLine: 'rgba(224,123,92,0.4)',
  cardBg:     'linear-gradient(180deg, rgba(245,235,212,0.06) 0%, rgba(245,235,212,0.03) 100%)',
  cardBorder: 'rgba(201,168,76,0.3)',
  headerBg:   'rgba(31,22,18,0.78)',
  sheetTop:   'rgba(31,22,18,0.97)',
  sheetBot:   'rgba(22,16,12,0.99)',
  sheetBorder:'rgba(201,168,76,0.32)',
  inputBg:    'rgba(245,235,212,0.04)',
  inputBorder:'rgba(201,168,76,0.28)',
  rowHover:   'rgba(245,235,212,0.03)',
  overlay:    'rgba(0,0,0,0.6)',
  pageBg:     '#1F1612',
  sectionBg:  'rgba(245,235,212,0.03)',
  isLight:    false,
  label:      '#E0BC6E',
  accentText: '#C9A84C',
};

// ── Editorial Paper — archival print on heavy cotton stock ──────
// #F5F2EE — warm white, barely there. Like Vogue on thick bone paper.
// #1A0F08 — deep letterpress black-brown. Not grey, not brown — ink.
// #7A3828 — deep Sabyasachi monogram. Confident, not pastel.
// #C9A84C — brass, sparingly. FAB only.
// ──────────────────────────────────────────────────────────────
export const LIGHT: ThemeTokens = {
  ink:        '#1A0F08',           // letterpress deep — 16.87:1 on pageBg
  inkSoft:    'rgba(26,15,8,0.80)', // strong secondary — 9.60:1
  // TDW_09 · R-U18 — the same ladder on the paper theme. WAS .58 (4.48:1, just
  // under the bar) and .38 (2.43:1). Four rungs, every one clear of AA.
  inkMute:    'rgba(26,15,8,0.70)', //  6.72:1
  inkDim:     'rgba(26,15,8,0.62)', //  5.12:1
  inkFade:    'rgba(26,15,8,0.46)', //  3.06:1 — the 3:1 UI bar
  // F-09.28 roles — the failing side, solved. Same hue as its Espresso twin,
  // darkened until it clears the body bar on paper.
  positive:   '#3E7A44',                //  4.62:1  (was #7FBE85 -> 1.96:1)
  caution:    '#9B5E22',                //  4.68:1  (was #E0A870 -> 1.88:1)
  critical:   '#BA4723',                //  4.69:1  (was #E07B5C -> 2.63:1)
  metal:      '#826A27',                //  4.66:1  (was #C9A84C -> 2.05:1)
  // The veil LIGHTENS here rather than blackening. A black scrim on a cream page
  // is what made studio/team's Edit Member sheet unreadable: the page's own dark
  // ink fell to 2.09:1 behind it while the sheet's ink fell to 2.30:1 on it.
  scrim:      'rgba(26,15,8,0.35)',     // veiled page ink still reads 7.53:1
  sheet:      '#FFFFFF',                // form ink on it 18.82:1
  brass:      '#C9A84C',
  brassWarm:  '#9B6E1A',           // darker brass — legible on white
  brassLine:  'rgba(122,56,40,0.22)',
  brassSoft:  'rgba(122,56,40,0.30)',
  accent:     '#7A3828',           // deep oxblood — confident, not pastel
  accentLine: 'rgba(122,56,40,0.40)',
  cardBg:     'rgba(255,255,255,0.90)',
  cardBorder: 'rgba(122,56,40,0.18)',
  headerBg:   'rgba(245,242,238,0.96)',
  sheetTop:   '#F5F2EE',
  sheetBot:   '#EDE8DF',
  sheetBorder:'rgba(122,56,40,0.25)',
  inputBg:    'rgba(26,15,8,0.04)',
  inputBorder:'rgba(122,56,40,0.28)',
  rowHover:   'rgba(26,15,8,0.03)',
  overlay:    'rgba(26,15,8,0.55)',
  pageBg:     '#F5F2EE',
  sectionBg:  'rgba(26,15,8,0.025)',
  isLight:    true,
  label:      '#7A3828',
  accentText: '#7A3828',
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
