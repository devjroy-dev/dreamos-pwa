// app/works/signinFonts.ts · CE-47 · LAND-1 package 2 · the four faces of app/works/fonts.ts, for the vendor sign-in,
// sign-up and PIN screens on thedreamwedding.in (WorksBackdrop.tsx). A file of its own on purpose: next/font preloads
// every face a route's modules define, and the couples' front page shares the vendor sign-in's address. Nothing here
// is preloaded, so the couples' first view carries no extra weight; the vendor screens swap the faces in. The CSS
// variables are works.css's own, so it reads them unchanged.
//
// LAND-1 package 3: self-hosted through next/font/local from the same files as fonts.ts (app/works/fonts/, each face
// beside its OFL.txt). No build or dev server asks Google for these faces.
import localFont from 'next/font/local';

const BodoniModa = localFont({
  src: [
    { path: './fonts/bodoni-moda/bodoni-moda-latin-opsz-normal.woff2', weight: '400 900', style: 'normal' },
    { path: './fonts/bodoni-moda/bodoni-moda-latin-opsz-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  display: 'swap', preload: false, variable: '--works-display', adjustFontFallback: 'Times New Roman',
});
const Manrope = localFont({
  src: [{ path: './fonts/manrope/manrope-latin-wght-normal.woff2', weight: '200 800', style: 'normal' }],
  display: 'swap', preload: false, variable: '--works-body',
});
const JetBrainsMono = localFont({
  src: [
    { path: './fonts/jetbrains-mono/jetbrains-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap', preload: false, variable: '--works-mono', adjustFontFallback: false,
});
const InterWorks = localFont({
  src: [{ path: './fonts/inter/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap', preload: false, variable: '--works-app',
});

// The same family names as fonts.ts (next/font/local names a family after its const).
export const worksSigninFontClasses = [BodoniModa.variable, Manrope.variable, JetBrainsMono.variable, InterWorks.variable].join(' ');
