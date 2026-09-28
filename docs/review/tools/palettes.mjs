// docs/review/tools/palettes.mjs · the three proposed palettes, as drop-in values for the shell's 33 tokens
// (lib/worklist/theme.ts) plus two new ones (primary, on-primary), and every text and control pair measured by
// WCAG 2.1 relative luminance. Exits 1 if any pair misses its bar. Writes docs/review/palettes/palettes.json,
// palettes/CONTRAST.md and docs/review/html/tokens.js (the HTML mock-ups read the same values).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// core values per mode; the 35 tokens are derived from these by one function, so the three palettes share a shape
const P = {
  ledger: { name: 'Teal Ledger', line: 'TDW teal, deepened, on warm stone greys. The closest to today, calmer.',
    dark: { bg: '#111416', page: '#15181A', header: '#1A1E20', section: '#171B1D', card: '#1D2124', sheet: '#202528', line: '#343B3E',
      ink: '#ECEFEF', soft: '#C9CFD0', dim: '#A5ADAF', mute: '#909A9C', accent: '#5CC4AE', primary: '#4DBBA4', onPrimary: '#0A1A16',
      positive: '#6CC98A', caution: '#E0B26E', critical: '#EE8A73', metal: '#CDB068', onMetal: '#15181A' },
    light: { bg: '#E6E9E5', page: '#EDEFEB', header: '#F4F5F2', section: '#E6E9E5', card: '#F7F8F5', sheet: '#F7F8F5', line: '#CDD3CE',
      ink: '#151A1B', soft: '#2B3234', dim: '#434B4E', mute: '#56606A', accent: '#0B6655', primary: '#0B6B5A', onPrimary: '#FFFFFF',
      positive: '#256B3C', caution: '#7A4F12', critical: '#A53420', metal: '#735A1C', onMetal: '#FFFFFF' } },
  slate: { name: 'Slate and Teal', line: 'Cool blue greys with a brighter teal. Reads most like a business tool.',
    dark: { bg: '#0E141B', page: '#121820', header: '#17202A', section: '#151D26', card: '#1B2530', sheet: '#1F2A36', line: '#33414F',
      ink: '#E8EEF3', soft: '#C4CED8', dim: '#9DAAB7', mute: '#8896A5', accent: '#4FC7C0', primary: '#3DBDB5', onPrimary: '#06201E',
      positive: '#6DCB94', caution: '#E5B866', critical: '#F08A7A', metal: '#D6B86A', onMetal: '#121820' },
    light: { bg: '#E5EAEE', page: '#ECF0F3', header: '#F4F6F8', section: '#E5EAEE', card: '#F8FAFB', sheet: '#F8FAFB', line: '#CAD3DB',
      ink: '#121A22', soft: '#283440', dim: '#3E4B58', mute: '#536170', accent: '#0A6763', primary: '#0B6B67', onPrimary: '#FFFFFF',
      positive: '#22703F', caution: '#7D5012', critical: '#AA3423', metal: '#735A1A', onMetal: '#FFFFFF' } },
  indigo: { name: 'Indigo and Marigold', line: 'Indigo for actions, marigold for the brand. No teal; the most formal.',
    dark: { bg: '#101118', page: '#14151C', header: '#1A1C25', section: '#171821', card: '#1E2029', sheet: '#22242E', line: '#363948',
      ink: '#ECEDF3', soft: '#C9CBD8', dim: '#A3A6B8', mute: '#8D91A5', accent: '#9CB1FF', primary: '#8BA2F7', onPrimary: '#0E1330',
      positive: '#6CCB8F', caution: '#E6B566', critical: '#F0877A', metal: '#E0B75A', onMetal: '#14151C' },
    light: { bg: '#E9E7E2', page: '#F0EEEA', header: '#F6F5F1', section: '#E9E7E2', card: '#FAF9F6', sheet: '#FAF9F6', line: '#D3D0C8',
      ink: '#17181F', soft: '#2C2E3A', dim: '#434656', mute: '#595C6D', accent: '#3949AB', primary: '#3B4CC0', onPrimary: '#FFFFFF',
      positive: '#256B3C', caution: '#7A4E10', critical: '#A83523', metal: '#7A5810', onMetal: '#FFFFFF' } },
};

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };

function tokens(c, mode) {
  return {
    'bg': c.bg, 'page-bg': c.page, 'header-bg': c.header, 'section-bg': c.section, 'sheet-bg': c.sheet,
    'overlay-bg': mode === 'dark' ? '#08090B' : '#17191A',
    'card-bg': c.card, 'card-border': c.line, 'card-shadow': mode === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(23,25,26,0.07)',
    'row-hover': mode === 'dark' ? rgba(c.ink, 0.12) : rgba(c.ink, 0.08), 'grain': 'transparent',
    'input-bg': c.card, 'input-border': c.mute, 'sheet-top': c.sheet, 'sheet-bot': c.sheet, 'sheet-border': c.line,
    'overlay': mode === 'dark' ? 'rgba(8,9,11,0.72)' : 'rgba(23,25,26,0.40)',
    'ink': c.ink, 'ink-soft': c.soft, 'ink-dim': c.dim, 'ink-mute': c.mute, 'ink-fade': c.mute, 'label': c.dim, 'accent-text': c.accent,
    'metal': c.metal, 'ink-on-metal': c.onMetal, 'ink-deep': mode === 'dark' ? c.bg : c.ink,
    'positive': c.positive, 'caution': c.caution, 'critical': c.critical,
    'scrim': mode === 'dark' ? 'rgba(8,9,11,0.62)' : 'rgba(23,25,26,0.36)', 'sheet': c.sheet, 'today-coin-ink': c.onMetal,
    'primary': c.primary, 'on-primary': c.onPrimary,
  };
}

// the pairs: [what, foreground key, background key, bar]
const GROUNDS = ['bg', 'page', 'header', 'card', 'sheet'];
const TEXT = [['ink', 'Main text'], ['soft', 'Second text'], ['dim', 'Labels'], ['mute', 'Hints and dates'], ['accent', 'Links and tabs'],
  ['positive', 'Paid, confirmed'], ['caution', 'Due soon'], ['critical', 'Overdue, delete'], ['metal', 'Brand gold']];
const rows = []; let fails = 0;
for (const [key, pal] of Object.entries(P)) for (const mode of ['dark', 'light']) {
  const c = pal[mode];
  const add = (what, fg, bg, bar) => { const r = ratio(c[fg] || fg, c[bg] || bg); const ok = r >= bar; if (!ok) fails += 1; rows.push({ palette: key, mode, what, fg: c[fg] || fg, bg: c[bg] || bg, ratio: +r.toFixed(2), bar, ok }); };
  for (const [fg, what] of TEXT) for (const g of GROUNDS) add(`${what} on ${g}`, fg, g, 4.5);
  add('Button text on the primary button', 'onPrimary', 'primary', 4.5);
  add('Primary button against the page', 'primary', 'page', 3);
  add('Primary button against a card', 'primary', 'card', 3);
  add('Primary button against a sheet', 'primary', 'sheet', 3);
  add('Text on the gold coin', 'onMetal', 'metal', 4.5);
  add('Field and outline edge on a sheet', 'mute', 'sheet', 3);
  add('Field and outline edge on the page', 'mute', 'page', 3);
  add('Delete outline on a sheet', 'critical', 'sheet', 3);
}
const json = Object.fromEntries(Object.entries(P).map(([k, p]) => [k, { name: p.name, line: p.line, dark: tokens(p.dark, 'dark'), light: tokens(p.light, 'light'), core: { dark: p.dark, light: p.light },
  softness: { light_page_luminance: +lum(p.light.page).toFixed(3), light_card_luminance: +lum(p.light.card).toFixed(3), white: 1 } }]));
fs.mkdirSync(path.join(OUT, 'palettes'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'palettes/palettes.json'), JSON.stringify({ palettes: json, pairs: rows }, null, 1));
fs.writeFileSync(path.join(OUT, 'html/tokens.js'), '// generated by docs/review/tools/palettes.mjs; the same values as palettes/palettes.json\nwindow.TDW_PALETTES = ' + JSON.stringify(json) + ';\n');
let md = '# Contrast of every text and control pair\n\nGenerated by `docs/review/tools/palettes.mjs` (WCAG 2.1 relative luminance). Bar: 4.5 to 1 for text, 3 to 1 for controls and outlines. Grounds: bg (behind everything), page, header, card, sheet.\n\n';
for (const [key, pal] of Object.entries(P)) for (const mode of ['dark', 'light']) {
  md += `## ${pal.name}, ${mode}\n\n| Pair | Foreground | Background | Ratio | Bar | Pass |\n|---|---|---|---|---|---|\n`;
  for (const r of rows.filter((x) => x.palette === key && x.mode === mode)) md += `| ${r.what} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio.toFixed(2)} | ${r.bar} | ${r.ok ? 'yes' : '**NO**'} |\n`;
  md += '\n';
}
fs.writeFileSync(path.join(OUT, 'palettes/CONTRAST.md'), md);
// the lowest pair per palette and mode, for the report
for (const [key] of Object.entries(P)) for (const mode of ['dark', 'light']) { const r = rows.filter((x) => x.palette === key && x.mode === mode); const t = r.filter((x) => x.bar === 4.5).sort((a, b) => a.ratio - b.ratio)[0]; const c = r.filter((x) => x.bar === 3).sort((a, b) => a.ratio - b.ratio)[0]; console.log(key, mode, 'lowest text', t.ratio, t.what, '| lowest control', c.ratio, c.what); }
console.log(rows.length, 'pairs,', fails, 'failing');
for (const r of rows.filter((x) => !x.ok)) console.log('FAIL', r.palette, r.mode, r.what, r.ratio);
process.exit(fails ? 1 : 0);
