// lib/site/faces.ts · WEB-5 · her pair's faces, inline, and the one file preloaded (CE-47 ruling B).
// Only the two families her card names are declared; each keeps next/font's size-matched fallback ("<family> Fallback",
// the same local() and overrides next/font/local writes), so the page is laid out in the fallback's box from first paint.
import { FACES } from './faces.gen';

/** swap: every face swaps in when it arrives. optional: none swaps late (no shift; a late face shows from the next page).
 *  mixed: her display face swaps (it is preloaded), every other face is optional. The chair rules on the numbers. */
export type Display = 'swap' | 'optional' | 'mixed';
const q = (s: string) => `'${s.replace(/['\\]/g, '')}'`;

/** The weight and style the cover headline is set in, per style (the prototypes' own CSS): the file to preload. */
const COVER_FACE: Record<string, [string, string]> = { couture: ['500', 'normal'], gallery: ['400', 'normal'], noir: ['400', 'normal'], heritage: ['400', 'normal'], aurora: ['300', 'normal'], riviera: ['400', 'normal'] };

export function facesFor(style: string, fonts: { display?: string | null; text?: string | null } | null | undefined, display: Display, afterCover = false) {
  const fams = [fonts?.display, fonts?.text].filter((f): f is string => !!f && !!FACES[f]);
  // The first screen declares ONE file: the display face the cover headline is set in (preloaded below). Every other
  // face is declared once the cover has loaded (measured: the text faces, requested with the first paint, took the
  // cover's bandwidth on Slow 3G). Until then text is set in its size-matched fallback.
  let preload = ''; let nowKey = '';
  if (fonts?.display && FACES[fonts.display]) {
    const [w, st] = COVER_FACE[style] || ['400', 'normal']; const files = FACES[fonts.display].files;
    const f = files.find((x) => x.weight === w && x.style === st) || files.find((x) => x.style === 'normal') || files[0];
    preload = f.file; nowKey = fonts.display + '|' + f.file;
    if (afterCover) { preload = ''; nowKey = ''; }   // every face, the display one too, waits for the cover (measured variant)
  }
  let now = ''; let later = ''; const vars: Record<string, string> = {};
  for (const fam of [...new Set(fams)]) {
    const F = FACES[fam];
    for (const f of F.files) { const rule = `@font-face{font-family:${q(fam)};font-style:${f.style};font-weight:${f.weight};font-display:${display === 'mixed' ? (fam + '|' + f.file === nowKey ? 'swap' : 'optional') : display};src:url(${f.file}) format('woff2')}`; if (fam + '|' + f.file === nowKey) now += rule; else later += rule; }
    const m = F.fallback;
    now += `@font-face{font-family:${q(fam + ' Fallback')};src:local(${q(m.fallbackFont)});ascent-override:${m.ascentOverride};descent-override:${m.descentOverride};line-gap-override:${m.lineGapOverride};size-adjust:${m.sizeAdjust}}`;
  }
  const stack = (fam: string) => `${q(fam)}, ${q(fam + ' Fallback')}, ${FACES[fam].category === 'serif' ? "Georgia, serif" : "'Helvetica Neue', Arial, sans-serif"}`;
  if (fonts?.display && FACES[fonts.display]) vars['--serif'] = stack(fonts.display);
  if (fonts?.text && FACES[fonts.text]) vars['--sans'] = stack(fonts.text);
  return { css: now, later, vars, preload };
}
