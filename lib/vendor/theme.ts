'use client';
// lib/theme.ts — Atelier theme token sets
// Dark: warm espresso. Light: Editorial Paper — high-contrast archival print.

import { useTheme } from '@/hooks/vendor/useTheme';

export interface ThemeTokens {
  ink: string;
  inkSoft: string;
  inkMute: string;
  inkDim: string;
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

// ---- Flair: the dreamai navy/bone/ember room (third theme) ----
export const FLAIR: ThemeTokens = {
  ink:        '#e9e4d9',
  inkSoft:    'rgba(233,228,217,0.60)',
  inkMute:    'rgba(233,228,217,0.34)',
  inkDim:     'rgba(233,228,217,0.18)',
  // TDW_09: present so ThemeTokens stays satisfiable while this set lives. FLAIR
  // retires whole in this block's second ZIP (R-U16/R-U19); its rungs are NOT
  // raised here — raising a theme that is leaving would be bytes spent on a corpse.
  inkFade:    'rgba(233,228,217,0.38)',
  brass:      '#c99a63',
  brassWarm:  '#d8a86f',
  brassLine:  'rgba(233,228,217,0.09)',
  brassSoft:  'rgba(201,154,99,0.55)',
  accent:     '#c99a63',
  accentLine: 'rgba(201,154,99,0.40)',
  cardBg:     'rgba(20,28,46,0.55)',
  cardBorder: 'rgba(233,228,217,0.16)',
  headerBg:   'rgba(9,13,23,0.82)',
  sheetTop:   '#0b1120',
  sheetBot:   '#090d17',
  sheetBorder:'rgba(233,228,217,0.16)',
  inputBg:    'rgba(233,228,217,0.04)',
  inputBorder:'rgba(233,228,217,0.16)',
  rowHover:   'rgba(233,228,217,0.03)',
  overlay:    'rgba(0,0,0,0.6)',
  pageBg:     '#090d17',
  sectionBg:  'rgba(233,228,217,0.03)',
  isLight:    false,
  label:      '#d8a86f',
  accentText: '#c99a63',
};

export function useThemeTokens(): ThemeTokens {
  const [theme] = useTheme();
  return theme === 'light' ? LIGHT : theme === 'flair' ? FLAIR : DARK;
}
