// app/works/fonts.ts · CE-47 · LAND-1 · point 1: the page's four faces through next/font, self-hosted (served from this
// site at build, no request to Google from a visitor's phone). Each face is named by the CSS variable app/works/works.css
// reads; the fallback stacks live there.
//
//   Bodoni Moda   the display face. Variable, with its optical-size axis, as the chair's file asks for it
//                 (opsz 6..96): "Your" and the changing word are drawn at display size from the same file.
//   Manrope       every other line on the page. Variable weight (one file in place of four).
//   JetBrains Mono the small labels (the mark's line, the kicker, the tags). Not preloaded: it sits in small type and
//                 swaps in without moving anything.
//   Inter         inside the app screens only (the app's 400, 500 and 600), variable: one file in place of three.
import { Bodoni_Moda, Manrope, JetBrains_Mono, Inter } from 'next/font/google';

export const worksDisplay = Bodoni_Moda({
  subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], display: 'swap', variable: '--works-display',
});
export const worksBody = Manrope({ subsets: ['latin'], display: 'swap', variable: '--works-body' });
export const worksMono = JetBrains_Mono({
  subsets: ['latin'], weight: ['400', '500'], display: 'swap', preload: false, variable: '--works-mono',
});
export const worksApp = Inter({ subsets: ['latin'], display: 'swap', variable: '--works-app' });   // variable: one file for 400, 500 and 600

export const worksFontClasses = [worksDisplay.variable, worksBody.variable, worksMono.variable, worksApp.variable].join(' ');
