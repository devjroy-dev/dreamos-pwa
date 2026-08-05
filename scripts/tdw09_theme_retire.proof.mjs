#!/usr/bin/env node
// scripts/tdw09_theme_retire.proof.mjs — TDW_09 Sitting 1 · ZIP B's bench.
//
// Proves the Navy (FLAIR) retirement ruled at R-U16 / R-U19:
//   ①  the token set is DELETED, and exactly two survive
//   ②  the Theme type admits exactly two values
//   ③  the migration exists at EVERY stored-value read, including the
//      pre-hydration script that runs before React
//   ④  the four theme-flair CSS blocks are gone
//   ⑤  the `html.theme-light *` !important block is gone, and NO !important
//      re-declaration of an atelier token survives anywhere — the cell that
//      makes ZIP A's ladder actually reach the light theme
//   ⑥  the theme picker offers two rows
//   ⑦  nothing ADDS the retired class anywhere (independent of ④'s CSS sweep)
//
// Runnable from any working directory.  node scripts/tdw09_theme_retire.proof.mjs

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

const THEME = read('lib/vendor/theme.ts');
const CTX   = read('lib/vendor/ThemeContext.tsx');
const HOOK  = read('hooks/vendor/useTheme.ts');
const ROOTL = read('app/layout.tsx');
const HDR   = read('components/vendor/Header.tsx');
const CSS   = read('app/globals.css');

console.log('\nTDW_09 · theme-retirement proof — Navy retires, the ladder reaches the light theme\n');

// ① the set is gone; exactly two survive
console.log('① the token set');
ok('FLAIR is not exported from theme.ts',
   !/export const FLAIR\b/.test(THEME));
ok('exactly two ThemeTokens sets remain',
   (THEME.match(/export const [A-Z]+: ThemeTokens = \{/g) || []).length === 2,
   (THEME.match(/export const ([A-Z]+): ThemeTokens/g) || []).join(', '));
ok('useThemeTokens no longer branches on the retired name',
   !/FLAIR/.test(THEME.slice(THEME.indexOf('export function useThemeTokens'))));

// ② the type
console.log('\n② the type');
ok("Theme = 'dark' | 'light', nothing more",
   /export type Theme = 'dark' \| 'light';/.test(HOOK));
ok('ThemeProvider\'s pinned prop admits two values',
   /pinned\?: 'dark' \| 'light' \}/.test(CTX));

// ③ the migration — at every read, and FIRST at the pre-hydration script
console.log('\n③ the migration — no vendor lands in an undesigned state');
const rewrites = (src) => /setItem\(\s*(KEY|'dreamai_theme')\s*,\s*'dark'\s*\)/.test(src);
ok('useTheme rewrites a stored retired value', rewrites(HOOK));
ok('ThemeContext rewrites a stored retired value', rewrites(CTX));
ok('the pre-hydration script rewrites it too', rewrites(ROOTL),
   'without this the page paints navy for one frame on every launch');
ok('the pre-hydration script migrates BEFORE it reads the class branch',
   ROOTL.indexOf("vt='dark'") < ROOTL.indexOf("if(vt==='light')"),
   'order matters: migrate, then branch');
ok('the retired background constant is gone from the script',
   !/VENDOR_FLAIR/.test(ROOTL));

// ④ the CSS blocks
console.log('\n④ the CSS');
ok('no html.theme-flair rule survives',
   !/html\.theme-flair/.test(CSS),
   (CSS.match(/html\.theme-flair[^{,]*/g) || []).join(' | '));

// ⑤ THE PAYOFF CELL — no !important re-declaration of an atelier token anywhere.
//    ZIP A raised the light ladder in lib/vendor/theme.ts; a descendant-scoped
//    !important re-declaration of the same custom property beats the value
//    ThemeContext publishes on <html>, so the raise never reached any var()
//    consumer on that theme. This cell is written as a SWEEP, not as a check for
//    one deleted selector, because the disease is the pattern and not the line.
console.log('\n⑤ nothing overrides the tokens with !important');
const overrides = [...CSS.matchAll(/(--atelier-[a-z-]+)\s*:[^;]*!important/g)].map(m => m[1]);
ok('no atelier custom property is re-declared !important',
   overrides.length === 0,
   overrides.length ? `still overridden: ${[...new Set(overrides)].join(', ')}` : '');
ok('the html.theme-light * token block is gone',
   !/html\.theme-light \*\s*\{\s*--atelier/.test(CSS));

// ⑥ the picker
console.log('\n⑥ the theme picker');
const rows = (HDR.match(/setThemeMode\('(dark|light|flair)'\)/g) || []);
ok('the picker offers exactly two themes', rows.length === 2, rows.join(', '));
ok('no row sets the retired theme', !/setThemeMode\('flair'\)/.test(HDR));

// ⑦ independent method — nothing ADDS the class. ④ sweeps the stylesheet;
//    this sweeps the code, a different failure mode: ④ can pass while a
//    component still writes the class onto <html> at runtime.
console.log('\n⑦ nothing adds the retired class (independent method)');
const walk = (dir, hits = []) => {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel, hits);
    else if (/\.tsx?$/.test(e.name)) {
      const src = read(rel);
      if (/classList\.add\(\s*'theme-flair'|classList\.toggle\(\s*'theme-flair'/.test(src)) hits.push(rel);
    }
  }
  return hits;
};
const adders = [...walk('app'), ...walk('components'), ...walk('lib'), ...walk('hooks')];
ok('no code path adds or toggles theme-flair on', adders.length === 0,
   adders.join(', '));

console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — ${pass} passed, ${fail} failed\n`);

// ── BOTH-WAYS MUTATIONS, applied alone against production source, cmp-restored ──
//   M1  theme.ts: FLAIR set restored
//         → RED ①×2 ("FLAIR is not exported", "exactly two sets remain")
//   M2  useTheme.ts: Theme type widened back to three
//         → RED ② ("Theme = 'dark' | 'light'")
//   M3  app/layout.tsx: the migration line deleted from the pre-hydration script
//         → RED ③ ("the pre-hydration script rewrites it too") — the one-frame
//            navy flash on every launch, caught by its own cell
//   M4  app/layout.tsx: migration moved BELOW the light branch
//         → RED ③ ("migrates BEFORE it reads the class branch")
//   M5  globals.css: the html.theme-flair token block restored
//         → RED ④
//   M6  globals.css: ONE `--atelier-ink-mute: … !important` line restored inside
//       a theme-light descendant rule
//         → RED ⑤ — the exact mechanism that made ZIP A inert on the light theme
//   M7  Header.tsx: the Flair DItem restored
//         → RED ⑥×2
//   M8  useTheme.ts: classList.remove → classList.toggle('theme-flair', …)
//         → RED ⑦ while ④ stayed GREEN — the two methods separating, as designed
process.exit(fail === 0 ? 0 : 1);
