'use client';
// lib/theme.ts — Atelier theme token sets
// Dark: warm espresso. Light: Editorial Paper — high-contrast archival print.

import { useTheme } from '@/hooks/vendor/useTheme';

export interface ThemeTokens {
  ink: string;
  inkSoft: string;
  inkMute: string;
  inkDim: string;
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
  ink:        '#F0E6D2',
  inkSoft:    'rgba(240,230,210,0.65)',
  inkMute:    'rgba(240,230,210,0.45)',
  inkDim:     'rgba(240,230,210,0.25)',
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
  ink:        '#1A0F08',           // letterpress deep
  inkSoft:    'rgba(26,15,8,0.80)', // strong secondary — holds on page
  inkMute:    'rgba(26,15,8,0.58)', // muted but legible — not grey
  inkDim:     'rgba(26,15,8,0.38)', // truly dim — for metadata only
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
