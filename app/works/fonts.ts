// app/works/fonts.ts · CE-47 · LAND-1 · point 1: the page's four faces, self-hosted.
//
// LAND-1 package 3 (the chair's addendum, 10 Oct 2026): next/font/local, from the woff2 files in app/works/fonts/, each
// face beside its SIL Open Font License (OFL.txt). Nothing here asks Google for anything at build or in dev: Vercel's
// build of train 12 failed on a font fetch from Google that came back empty, and that cannot happen to these faces now.
// The files are Google's own faces as @fontsource 5.3.0 ships them (the latin subset), with the same axes, weights,
// styles, CSS variable names and preload choices next/font/google gave them.
//
//   Bodoni Moda    the display face: variable weight 400..900 with its optical-size axis (opsz 6..96), normal and italic.
//   Manrope        every other line on the page: variable weight 200..800.
//   JetBrains Mono the small labels: 400 and 500. Not preloaded: small type that swaps in without moving anything.
//   Inter          inside the app screens only: variable weight 100..900.
import localFont from 'next/font/local';

export const BodoniModa = localFont({
  src: [
    { path: './fonts/bodoni-moda/bodoni-moda-latin-opsz-normal.woff2', weight: '400 900', style: 'normal' },
    { path: './fonts/bodoni-moda/bodoni-moda-latin-opsz-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  display: 'swap', variable: '--works-display', adjustFontFallback: 'Times New Roman',
});
export const Manrope = localFont({
  src: [{ path: './fonts/manrope/manrope-latin-wght-normal.woff2', weight: '200 800', style: 'normal' }],
  display: 'swap', variable: '--works-body',
});
export const JetBrainsMono = localFont({
  src: [
    { path: './fonts/jetbrains-mono/jetbrains-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap', preload: false, variable: '--works-mono', adjustFontFallback: false,
});
export const InterWorks = localFont({
  src: [{ path: './fonts/inter/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap', variable: '--works-app',
});

// next/font/local names each family after its const: BodoniModa, Manrope, JetBrainsMono, InterWorks (InterWorks, not
// Inter, so it never shares a family name with the Google Inter other routes load).
export const worksFontClasses = [BodoniModa.variable, Manrope.variable, JetBrainsMono.variable, InterWorks.variable].join(' ');
