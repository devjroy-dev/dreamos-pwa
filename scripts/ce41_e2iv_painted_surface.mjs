// scripts/ce41_e2iv_painted_surface.mjs — CE-41 E2 (iv) · WHAT THE PAGE ACTUALLY PAINTS.
//
//     node scripts/ce41_e2iv_painted_surface.mjs
//
// ── WHY, IN ONE PARAGRAPH ────────────────────────────────────────────────────
// c-41.63. `ce41_e2iia_cockpit_arms` asserts that `--atelier-page-bg` RESOLVES
// differently in the two arms, and it was green while the founder's screen was
// Graphite in both. It was right and it was not enough: a custom property is an
// input, and between the input and the pixel sit `!important` rules, inline styles
// and any stylesheet that paints a surface with a literal instead of the token. The
// walk outranked the instrument (R-39.15) and the instrument had to grow.
//
// F-41.119 turned out to be a stale bundle rather than a defect, so this cell is
// not curing anything today — it exists so the NEXT seam cannot hide behind a green
// token. That is the only honest reason to add a cell nobody's finding is waiting on,
// and it is written down rather than dressed up as a cure.
//
// ── WHAT IT ASSERTS ─────────────────────────────────────────────────────────
// It builds the cockpit's real cascade — app/globals.css plus the emitted scope —
// mounts a small stand-in for the shell's painted panes (the ones app/admin/layout.tsx
// draws: the page ground, the header bar, the domain bar, a card), and reads back
// `getComputedStyle(el).backgroundColor` in each arm. Two requirements:
//
//   1. Every pane's PAINTED colour differs between the arms. Not the token it reads —
//      the colour that lands.
//   2. In each arm the page ground and the ink are on opposite sides of the luminance
//      line. A light ground with light ink is the F-41.70 family at page scale, and
//      it is the one failure that makes a cockpit unusable rather than ugly.
//
// ── WHAT IT DOES NOT CLAIM ──────────────────────────────────────────────────
// It reproduces the layout's panes; it does not render the app. A component that
// paints itself with a literal at runtime is invisible here — that is what the ink
// census reads the source for, and the two cells are complementary rather than
// overlapping. And no cell replaces the walk: the founder's phone is the measurement.

import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { scopeCss } from '../lib/worklist/theme.ts';

const globals = readFileSync('app/globals.css', 'utf8');
const layout = readFileSync('app/admin/layout.tsx', 'utf8');

// Replayed from the layout, never assumed — the same rule as the arms cell. If the
// layout stops toggling the class, these assertions must go red rather than quietly
// keep testing a mechanism the product no longer has.
const TOGGLES_LIGHT = /classList\.toggle\('theme-light', mode === 'light'\)/.test(layout);

let pass = 0, fail = 0;
const green = (n) => { pass++; console.log(`  ✓ ${n}`); };
const red = (n, d) => { fail++; console.log(`  ✗ ${n}\n      ${d}`); };

console.log('\nCE-41 E2 (iv) — the painted surfaces, not the tokens they read\n');

if (TOGGLES_LIGHT) green('the layout toggles the estate light layer (replayed here)');
else red('the layout toggles the estate light layer', 'F-41.117: without it the light arm cannot win against :root');

const PANES = [
  ['page', 'background: var(--atelier-page-bg)'],
  ['header', 'background: var(--atelier-header-bg)'],
  ['card', 'background: var(--atelier-card-bg)'],
  ['sheet', 'background: var(--atelier-sheet-bg)'],
];

const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setContent(
  '<!doctype html><html><head><style>' + globals + '</style><style>' + scopeCss('html.adm') + '</style></head><body>' +
  PANES.map(([id, css]) => `<div id="pane-${id}" style="${css}">x</div>`).join('') +
  '<div id="pane-ink" style="color: var(--atelier-ink)">x</div>' +
  '</body></html>',
  { waitUntil: 'load' },
);

async function read(mode) {
  await page.evaluate((m, toggles) => {
    const el = document.documentElement;
    el.classList.add('adm');
    el.setAttribute('data-wl-mode', m);
    el.classList.toggle('theme-light', toggles && m === 'light');
  }, mode, TOGGLES_LIGHT);
  return page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('[id^="pane-"]')) {
      const cs = getComputedStyle(el);
      // A TOKEN MAY BE A GRADIENT, AND A GRADIENT IS NOT A backgroundColor. `card-bg` is
      // a two-stop linear-gradient in both arms, so backgroundColor reads transparent and
      // the first cut of this cell redded a pane that paints correctly. Read the image when
      // the colour is transparent — the pixel is the pixel whichever property carries it.
      const paint = cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage !== 'none'
        ? cs.backgroundImage
        : cs.backgroundColor;
      out[el.id.slice(5)] = el.id === 'pane-ink' ? cs.color : paint;
    }
    out.body = getComputedStyle(document.body).backgroundColor;
    return out;
  });
}

const dark = await read('dark');
const light = await read('light');
await browser.close();

for (const [id] of PANES) {
  if (dark[id] && light[id] && dark[id] !== light[id]) green(`${id} paints differently in the two arms (${dark[id]} / ${light[id]})`);
  else red(`${id} paints differently in the two arms`, `dark="${dark[id]}" light="${light[id]}" — the PIXEL did not move, whatever the token says`);
}

// Ground against ink, per arm. rgb()/rgba() only — these are computed values.
const lum = (c) => {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || ''); if (!m) return null;
  const [r, g, b] = m.slice(1, 4).map((v) => {
    const x = Number(v) / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
for (const [name, arm] of [['Graphite', dark], ['Chalk', light]]) {
  const g = lum(arm.page), i = lum(arm.ink);
  if (g === null || i === null) { red(`${name}: ground and ink are both colours`, `page="${arm.page}" ink="${arm.ink}"`); continue; }
  if ((g < 0.35 && i > 0.35) || (g > 0.35 && i < 0.35)) green(`${name}: the ink is opposed to the ground (${arm.page} / ${arm.ink})`);
  else red(`${name}: the ink is opposed to the ground`, `both on the same side — a page nobody can read (${arm.page} / ${arm.ink})`);
}

console.log(`\n${'─'.repeat(60)}\nce41_e2iv_painted_surface: ${pass} passed, ${fail} failed  (total ${pass + fail})\n`);
process.exit(fail ? 1 : 0);
