#!/usr/bin/env node
// scripts/tdw09_palette.proof.mjs — TDW_09 Sitting 1 · Phase 2 item 1's bench.
//
// Proves the vendor palette cure ruled at R-U16 / R-U18 / R-U19:
//   ①  the four-rung ladder — ink > inkSoft > inkMute > inkDim, all DISTINCT,
//      and the bottom two rungs clear WCAG AA 4.5:1 on their own pageBg
//   ②  the fade token exists per theme and clears the 3:1 UI bar
//   ③  the two hardcoded-cream sites are GONE and read the token instead
//   ④  no cream literal survives anywhere in the vendor component tree
//
// WHY THE RATIOS ARE COMPUTED HERE AND NOT ASSERTED AS CONSTANTS: a bench that
// hardcodes "5.57" proves that somebody typed 5.57. This one re-derives every
// ratio from the token file's own bytes through the WCAG formula, so a token
// edited to a value that no longer passes turns the cell RED on its own.
// The estate has already convicted three witnesses of not seeing what they were
// built to see (F-08.42 / F-07.95 / F-08.46); a constant-comparison cell would
// have been the fourth.
//
// Runnable from any working directory.  node scripts/tdw09_palette.proof.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};

// ── WCAG 2.1 relative luminance + contrast, from the spec ──────────────────
const parse = (v) => {
  const s = String(v).trim();
  let m = /^#([0-9a-f]{6})$/i.exec(s);
  if (m) return [parseInt(m[1].slice(0,2),16), parseInt(m[1].slice(2,4),16), parseInt(m[1].slice(4,6),16), 1];
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  return null;
};
const over = (fg, bg) => fg[3] >= 0.999
  ? [fg[0], fg[1], fg[2]]
  : [0,1,2].map(i => Math.round(fg[i]*fg[3] + bg[i]*(1-fg[3])));
const lum = ([r,g,b]) => {
  const c = (v) => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
  return 0.2126*c(r) + 0.7152*c(g) + 0.0722*c(b);
};
const ratio = (fg, bg) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x,y) => y-x);
  return (a + 0.05) / (b + 0.05);
};
const r2 = (n) => Math.round(n * 100) / 100;

// ── read the token sets straight out of the source ─────────────────────────
const THEME_SRC = read('lib/vendor/theme.ts');
function tokenSet(name) {
  const i = THEME_SRC.indexOf(`export const ${name}: ThemeTokens = {`);
  if (i < 0) return null;
  const body = THEME_SRC.slice(i, THEME_SRC.indexOf('\n};', i));
  const out = {};
  for (const m of body.matchAll(/^\s*([A-Za-z]+):\s*'([^']+)'/gm)) out[m[1]] = m[2];
  return out;
}

console.log('\nTDW_09 · palette proof — the ladder, the fade, the cream literals\n');

// ① the four-rung ladder, both surviving themes
console.log('① the ladder — four distinct rungs, bottom two clear AA 4.5:1');
for (const name of ['DARK', 'LIGHT']) {
  const t = tokenSet(name);
  if (!t) { ok(`${name} token set present`, false); continue; }
  const page = parse(t.pageBg);
  const rungs = ['ink', 'inkSoft', 'inkMute', 'inkDim'];
  const vals = rungs.map(k => t[k]);
  const rs   = vals.map(v => { const c = parse(v); return c ? ratio(over(c, page), page) : null; });

  ok(`${name} · four rungs are four DISTINCT values`,
     new Set(vals).size === 4,
     `values: ${vals.join(' | ')}`);
  ok(`${name} · the ladder descends monotonically`,
     rs.every((v, i) => i === 0 || (v !== null && v < rs[i-1])),
     rungs.map((k,i) => `${k}=${r2(rs[i])}`).join('  '));
  for (const k of ['inkMute', 'inkDim']) {
    const c = parse(t[k]);
    const v = c ? ratio(over(c, page), page) : 0;
    ok(`${name} · ${k} clears AA body 4.5:1`, v >= 4.5, `measured ${r2(v)}:1 — ${t[k]}`);
  }
}

// ② the fade token — present, and at the 3:1 UI bar
console.log('\n② the fade token — F-09.15b');
for (const name of ['DARK', 'LIGHT']) {
  const t = tokenSet(name);
  const page = parse(t.pageBg);
  const c = parse(t.inkFade || '');
  ok(`${name} · inkFade declared`, !!c, t.inkFade ?? '(absent)');
  if (!c) continue;
  const v = ratio(over(c, page), page);
  ok(`${name} · inkFade clears the 3:1 UI bar`, v >= 3.0, `measured ${r2(v)}:1`);
  // and it must stay BELOW inkDim — a fade that outranks the dim rung is not a fade
  const dim = parse(t.inkDim);
  ok(`${name} · inkFade recedes behind inkDim`,
     v < ratio(over(dim, page), page),
     `fade ${r2(v)} vs dim ${r2(ratio(over(dim, page), page))}`);
}

// ③ the two cure sites read the token
console.log('\n③ the two hardcoded-cream sites');
const NAV = read('components/vendor/BottomNav.tsx');
const CAL = read('app/vendor/calendar/page.tsx');
const CTX = read('lib/vendor/ThemeContext.tsx');
ok('BottomNav · locked tab reads var(--atelier-ink-fade)',
   /item\.locked \? 'var\(--atelier-ink-fade\)'/.test(NAV));
// TDW_09 T-1 — LABELLED AMENDMENT, COUNT PRESERVED (1 cell, still 1).
// This cell asserted the fade token by pinning the FONT SIZE next to it, so it
// red the moment T-1 inserted a leading between the two properties. The colour
// never moved. A palette cell has no business pinning type geometry: it made the
// bench a hostage of an unrelated pass, and it would have gone green over a
// wrong colour at the right size. Re-aimed to the property it exists to guard —
// the previous-month cell reads the fade ROLE — with the size left to T-1's own
// instrument, which owns it.
ok('calendar · previous-month cells read var(--atelier-ink-fade)',
   /color: 'var\(--atelier-ink-fade\)'/.test(CAL));
ok('ThemeContext · the var is actually published',
   /setProperty\('--atelier-ink-fade',\s*t\.inkFade\)/.test(CTX),
   'a token nothing publishes is a token nothing can read');

// ④ the literal is gone from the vendor component tree — the independent method.
//    ③ proves the two sites we KNOW about. ④ proves there is no third we do not,
//    which is a different failure mode: ③ can pass while a copy of the literal
//    survives in a file nobody listed.
console.log('\n④ no cream literal survives (independent method)');
const CREAM = /rgba\(\s*240\s*,\s*230\s*,\s*210\s*,\s*0?\.18\s*\)/;
const walk = (dir, hits = []) => {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel, hits);
    else if (/\.(tsx?|css)$/.test(e.name) && CREAM.test(read(rel))) hits.push(rel);
  }
  return hits;
};
const survivors = [...walk('components/vendor'), ...walk('app/vendor')];
ok('the 0.18 cream literal is absent from the vendor tree',
   survivors.length === 0,
   survivors.length ? `still present in: ${survivors.join(', ')}` : '');

console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — ${pass} passed, ${fail} failed\n`);

// ── BOTH-WAYS MUTATIONS, run against production source and cmp-restored ─────
// Each was applied alone, the bench run, the file restored:
//   M1  theme.ts DARK.inkMute  → 'rgba(240,230,210,0.45)'  (the pre-cure value)
//         → RED: "DARK · inkMute clears AA body 4.5:1" (measured 3.87)
//   M2  theme.ts LIGHT.inkDim  → 'rgba(26,15,8,0.38)'      (the pre-cure value)
//         → RED: "LIGHT · inkDim clears AA body 4.5:1" (measured 2.43)
//   M3  theme.ts DARK.inkDim   → 'rgba(240,230,210,0.58)'  (equal to inkMute)
//         → RED: "DARK · four rungs are four DISTINCT values" — the exact defect
//            R-U16's first pair would have shipped, caught by its own cell
//   M4  theme.ts LIGHT.inkFade deleted
//         → RED: "LIGHT · inkFade declared"
//   M5  BottomNav locked branch reverted to the cream literal
//         → RED: ③'s NavTab cell AND ④'s survivor sweep — two cells, two methods
//   M6  ThemeContext's setProperty line deleted
//         → RED: "the var is actually published" — the token would otherwise
//            resolve to nothing at both call sites while ①/② stayed GREEN
process.exit(fail === 0 ? 0 : 1);
