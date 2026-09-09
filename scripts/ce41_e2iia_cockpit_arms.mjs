// scripts/ce41_e2iia_cockpit_arms.mjs — CE-41 E2 (iia) · THE TWO ARMS, AS THE PAGE RESOLVES THEM.
//
//     node scripts/ce41_e2iia_cockpit_arms.mjs
//
// ── WHY THIS CELL EXISTS, AND WHY THE LAST TWO COULD NOT HAVE CAUGHT IT ──────
//
// F-41.117. `ce41_e2i_cockpit_ink_census` asserted that the layout SETS
// `data-wl-mode` from the cockpit's own mode. It did. The switch wrote, the cookie
// held, the attribute landed — and the page stayed Graphite in both arms, because
// app/globals.css:1293 declares every --atelier-* at `:root` with `!important` and
// specificity does not outrank `!important`. The dark arm agreed with the override,
// so every cell was green and the walk read clean.
//
// AN ASSERTION ABOUT AN INPUT CANNOT SEE AN OVERRIDE ON THE OUTPUT. The only thing
// that could was the one the founder made with his eyes: does the page CHANGE. So
// this cell asserts the RESOLVED value — `getComputedStyle(document.documentElement)
// .getPropertyValue('--atelier-page-bg')` — with the real stylesheet loaded, in a
// real browser, in each arm, and requires the two to DIFFER. It does not care which
// mechanism wins; it cares that flipping the mode changes what the page paints.
//
// c-41.59, and it generalises: the light arm was shot in the MOCK, whose inline token
// block resolves without globals.css ever loading. A frame proves its own stylesheet;
// the page proves the page.
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL.
//   · It builds nothing and starts no server. It loads app/globals.css and the
//     emitted scope CSS into a blank document, sets the class and attribute exactly
//     as app/admin/layout.tsx sets them, and reads back what the cascade resolves.
//     That is the same cascade the browser runs; what it cannot see is anything a
//     component adds at runtime, which is stated rather than implied.
//   · Four tokens, not one: page-bg, ink, card-bg and accent-text. A cure that moved
//     the ground and left the ink is the defect wearing a pass.
//   · It also asserts the ink that sits ON the accent flips (F-41.116): dark on
//     Graphite's light teal, light on Chalk's dark green. That pair is the one this
//     estate has now got wrong twice, in opposite directions.

import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { scopeCss, GRAPHITE, CHALK } from '../lib/worklist/theme.ts';

const globals = readFileSync('app/globals.css', 'utf8');
const layout = readFileSync('app/admin/layout.tsx', 'utf8');

let pass = 0, fail = 0;
const green = (n) => { pass++; console.log(`  ✓ ${n}`); };
const red = (n, d) => { fail++; console.log(`  ✗ ${n}\n      ${d}`); };

console.log('\nCE-41 E2 (iia) — the cockpit resolves two different palettes\n');

// The layout must toggle BOTH halves; the cell reads the file for the mechanism it
// is about to reproduce, so a rider that changes the mechanism without changing this
// cell reds here rather than passing on a stale reproduction.
if (/classList\.toggle\('theme-light', mode === 'light'\)/.test(layout)) green('layout toggles the estate light layer with the mode');
else red('layout toggles the estate light layer with the mode', 'F-41.117: the attribute alone loses to :root !important');
if (/classList\.remove\('theme-light'\)/.test(layout)) green('the light layer is removed on unmount');
else red('the light layer is removed on unmount', 'the whole estate is keyed on theme-light; leaving it follows the founder out');

const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
// The stylesheets go in with the document rather than through addStyleTag: globals.css
// carries @import-less but data-URI-heavy rules that the CDP style-tag path rejects, and
// a cell that cannot load the stylesheet it is judging is worse than no cell.
await page.setContent(
  '<!doctype html><html><head><style>' + globals + '</style><style>' + scopeCss('html.adm') + '</style></head><body></body></html>',
  { waitUntil: 'load' },
);

// ── THE HARNESS REPLAYS THE LAYOUT; IT DOES NOT PERFORM THE CURE ─────────────
// The first cut of this cell toggled `theme-light` itself, unconditionally. Every
// palette assertion below then passed AT THE UNCURED TREE — the harness was applying
// the fix and then congratulating the code for it. That is the vacuity the both-ways
// rule exists to catch, and it got as far as a green run before the mutation test.
// What the harness does now is derived from app/admin/layout.tsx: it toggles the class
// only if the layout does, so removing that line from the production file turns these
// cells red, which is the only reason they are worth running.
const LAYOUT_TOGGLES_LIGHT = /classList\.toggle\('theme-light', mode === 'light'\)/.test(layout);

async function read(mode) {
  await page.evaluate((m, togglesLight) => {
    const el = document.documentElement;
    el.classList.add('adm');
    el.setAttribute('data-wl-mode', m);
    el.classList.toggle('theme-light', togglesLight && m === 'light');
  }, mode, LAYOUT_TOGGLES_LIGHT);
  return page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const g = (k) => cs.getPropertyValue(k).trim();
    return {
      pageBg: g('--atelier-page-bg'), ink: g('--atelier-ink'),
      cardBg: g('--atelier-card-bg'), accent: g('--atelier-accent-text'),
      onAccent: g('--role-ink-on-metal'),
    };
  });
}

const dark = await read('dark');
const light = await read('light');
await browser.close();

for (const k of ['pageBg', 'ink', 'cardBg', 'accent']) {
  if (dark[k] && light[k] && dark[k] !== light[k]) green(`--atelier-${k} differs between the arms (${dark[k]} / ${light[k]})`);
  else red(`--atelier-${k} differs between the arms`, `dark="${dark[k]}" light="${light[k]}" — the arm the page resolves did not change`);
}

// F-41.116 — the ink on the accent, both ways. Graphite: light accent, dark ink.
// Chalk: dark accent, light ink. Compared as luminance rather than by value, because
// the tokens may be re-tinted and the RELATION is what is ruled.
const lum = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim()); if (!m) return null;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
for (const [name, arm] of [['Graphite', dark], ['Chalk', light]]) {
  const a = lum(arm.accent), i = lum(arm.onAccent);
  if (a === null || i === null) { red(`${name}: the ink on the accent is a colour`, `accent="${arm.accent}" ink="${arm.onAccent}"`); continue; }
  const opposed = (a > 0.35 && i < 0.35) || (a < 0.35 && i > 0.35);
  if (opposed) green(`${name}: the ink on the accent is opposed to it (${arm.accent} / ${arm.onAccent})`);
  else red(`${name}: the ink on the accent is opposed to it`, `both are on the same side of the line — F-41.70's shape (${arm.accent} / ${arm.onAccent})`);
}

// The home's own two maps must not have converged; if they had, everything above
// could pass while the estate had one palette wearing two names.
if (GRAPHITE['page-bg'] !== CHALK['page-bg']) green('the two maps in lib/worklist/theme.ts are still two');
else red('the two maps in lib/worklist/theme.ts are still two', 'GRAPHITE and CHALK agree on page-bg');

console.log(`\n${'─'.repeat(60)}\nce41_e2iia_cockpit_arms: ${pass} passed, ${fail} failed  (total ${pass + fail})\n`);
process.exit(fail ? 1 : 0);
