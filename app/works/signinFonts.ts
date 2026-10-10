// app/works/signinFonts.ts · CE-47 · LAND-1 package 2 · the four faces of app/works/fonts.ts, for the vendor sign-in,
// sign-up and PIN screens on thedreamwedding.in (WorksBackdrop.tsx). A file of its own on purpose: next/font preloads
// every face a route's modules define, and the couples' front page shares the vendor sign-in's address. Nothing here
// is preloaded, so the couples' first view carries no extra weight; the vendor screens swap the faces in. The CSS
// variables are works.css's own, so it reads them unchanged.
import { Bodoni_Moda, Manrope, JetBrains_Mono, Inter } from 'next/font/google';

const display = Bodoni_Moda({
  subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], display: 'swap', preload: false, variable: '--works-display',
});
const body = Manrope({ subsets: ['latin'], display: 'swap', preload: false, variable: '--works-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', preload: false, variable: '--works-mono' });
const app = Inter({ subsets: ['latin'], display: 'swap', preload: false, variable: '--works-app' });

export const worksSigninFontClasses = [display.variable, body.variable, mono.variable, app.variable].join(' ');
