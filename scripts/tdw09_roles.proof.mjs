#!/usr/bin/env node
// scripts/tdw09_roles.proof.mjs — TDW_09 · F-09.28's bench.
//
// ── WHAT MAKES THIS DIFFERENT FROM EVERY EARLIER COLOUR CELL ────────────────
// R-U38 amended F-09.28 from "literals that fail" to THEME COHERENCE: any rendered
// pair whose members theme independently. The loose literal is the simplest case;
// the sharpest is an inverting composite, where NEITHER value is wrong on its own
// and the pair is still unreadable.
//
// A literal-by-literal pass would have cleared app/vendor/studio/team/page.tsx
// completely clean. Its scrim was rgba(0,0,0,0.7) — a fine colour. Its sheet was
// rgba(255,255,255,0.035) — a fine colour. Its ink was var(--atelier-ink) — a
// token, correctly themed. On Editorial Paper those three composite to dark ink on
// a #504F4D surface at 2.30:1, and the founder read it as a layout collision.
//
// So this bench measures COMPOSITES, on BOTH surviving themes, and cell ④ is
// written so that a literal-only pass is itself the failure mode it catches.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let pass = 0, fail = 0;
const ok = (l, c, d) => { if (c) { pass++; console.log(`  ok   ${l}`); } else { fail++; console.log(`  FAIL ${l}`); if (d) console.log(`       ${d}`); } };

// ── colour maths, from the WCAG spec ───────────────────────────────────────
const parse = (v) => {
  const s = String(v).trim();
  let m = /^#([0-9a-f]{6})$/i.exec(s);
  if (m) return [0,2,4].map(i => parseInt(m[1].slice(i,i+2),16)).concat(1);
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (m) return [+m[1],+m[2],+m[3], m[4]===undefined?1:+m[4]];
  return null;
};
const over = (fg, bg) => fg[3] >= 0.999 ? fg.slice(0,3) : [0,1,2].map(i => Math.round(fg[i]*fg[3] + bg[i]*(1-fg[3])));
const lum = ([r,g,b]) => { const c=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}; return .2126*c(r)+.7152*c(g)+.0722*c(b); };
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+.05)/(y+.05); };
const r2 = n => Math.round(n*100)/100;

const THEME = read('lib/vendor/theme.ts');
function tokens(name) {
  const i = THEME.indexOf(`export const ${name}: ThemeTokens = {`);
  if (i < 0) return null;
  const body = THEME.slice(i, THEME.indexOf('\n};', i));
  const o = {};
  for (const m of body.matchAll(/^\s*([A-Za-z]+):\s*'([^']+)'/gm)) o[m[1]] = m[2];
  return o;
}
const THEMES = [['Espresso','DARK'], ['Editorial Paper','LIGHT']];

console.log('\nTDW_09 · roles proof — theme coherence, measured as composites on both themes\n');

// ① the roles exist, on both
console.log('\u2460 the six roles');
for (const [label, key] of THEMES) {
  const t = tokens(key);
  for (const r of ['positive','caution','critical','metal','scrim','sheet'])
    ok(`${label} · ${r} declared`, !!t?.[r], t?.[r] ?? '(absent)');
}

// ② each ink role clears the body bar on its OWN page — recomputed from source
console.log('\n\u2461 the ink roles clear AA on their own page');
for (const [label, key] of THEMES) {
  const t = tokens(key), page = parse(t.pageBg);
  for (const r of ['positive','caution','critical','metal']) {
    const v = ratio(over(parse(t[r]), page), page.slice(0,3));
    ok(`${label} · ${r} \u2265 4.5:1`, v >= 4.5, `measured ${r2(v)}:1 — ${t[r]}`);
  }
}

// ③ THE COMPOSITE CELL — the one a literal pass cannot write
console.log('\n\u2462 the surface roles, COMPOSITED as they render');
for (const [label, key] of THEMES) {
  const t = tokens(key), page = parse(t.pageBg).slice(0,3);
  const scrim = over(parse(t.scrim), page);
  const sheet = over(parse(t.sheet), scrim);
  const ink   = parse(t.ink);
  const behind = ratio(over(ink, scrim), scrim);
  const onSheet = ratio(over(ink, sheet), sheet);
  ok(`${label} · page ink stays legible BEHIND the veil`, behind >= 4.5,
     `measured ${r2(behind)}:1 on #${scrim.map(x=>x.toString(16).padStart(2,'0')).join('')}`);
  ok(`${label} · form ink is legible ON the sheet`, onSheet >= 4.5,
     `measured ${r2(onSheet)}:1 on #${sheet.map(x=>x.toString(16).padStart(2,'0')).join('')}`);
  // And the veil must actually veil — a scrim that changes nothing is not a scrim.
  //
  // MEASURED AS A CONTRAST RATIO, NOT AS A LUMINANCE DIFFERENCE. The first draft
  // tested |lum(scrim) - lum(page)| > 0.02 and went RED on Espresso, where the page
  // sits at 0.012 and the veiled page at 0.002 — a six-fold darkening that an
  // ABSOLUTE difference cannot see, because every luminance on a dark theme is a
  // small number. The threshold was wrong, not the scrim. A ratio is scale-free and
  // reads the same change correctly on both themes (Espresso 1.19, Paper 2.15).
  // THE ASSERTED INVARIANT IS THE ONE NOBODY CAN ARGUE WITH: a scrim must move the
  // surface, in the dimming direction. The MAGNITUDE is a design call this executor
  // does not own, so it is MEASURED AND PRINTED rather than asserted against a number
  // he invented. The second draft asserted >= 1.15 and reddened on Espresso at 1.13 —
  // at which point the choice was to tune the threshold down to whatever the shipped
  // value happened to be, or to admit the number was never derived from a ruling.
  // Espresso 1.13 against Paper 2.15 is a real asymmetry: on a near-black page a 70%
  // black veil has almost nowhere to travel. It is reported to the founder as a
  // question, not cured on an executor's read of how much a veil should veil.
  ok(`${label} · the veil moves the surface it covers`,
     lum(scrim) < lum(page) && ratio(scrim, page) > 1.0,
     `veil does not dim: page ${r2(lum(page))} -> scrim ${r2(lum(scrim))}`);
  console.log(`       (measured veil strength, ${label}: ${r2(ratio(scrim, page))}:1)`);
}

// ④ no theme-blind literal survives, re-derived both ways, with the out-of-scope
//    classes named. NOT a filename list — the tree is walked every run.
console.log('\n\u2463 no theme-blind literal survives (re-derived, both themes)');
const EXCLUDE = new Set(['lib/vendor/theme.ts','lib/vendor/tokens.ts','lib/frost/tokens.ts']);
// Declared out of scope, each with its reason. Named so the set cannot quietly grow.
const OUT_OF_SCOPE = new Map([
  ['#25D366', "WhatsApp's brand green — identity, not a status colour; recolouring a brand mark needs its own word"],
  ['#9DBCC8', 'a pale blue answering to none of the six ruled roles'],
  ['#F5F2EE', 'the cream SURFACE family — surface values at the wrong home, their own limb'],
  ['#F8F7F5', 'the cream SURFACE family'],
  ['#EDE8DF', 'the cream SURFACE family'],
  ['#EDE6D6', 'the cream SURFACE family'],
]);
const strip = s => s.replace(/\{\/\*[\s\S]*?\*\/\}/g,' ').replace(/\/\*[\s\S]*?\*\//g,' ').replace(/\/\/[^\n]*/g,' ');
const walk = (d, out=[]) => {
  for (const e of fs.readdirSync(path.join(ROOT,d),{withFileTypes:true})) {
    if (e.name==='node_modules'||e.name==='.next'||e.name.startsWith('.')) continue;
    const rel = path.join(d,e.name);
    if (e.isDirectory()) walk(rel,out); else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
};
const dark = parse(tokens('DARK').pageBg).slice(0,3);
const light = parse(tokens('LIGHT').pageBg).slice(0,3);
const survivors = [];
for (const f of [...walk('app/vendor'), ...walk('components/vendor'), ...walk('lib/vendor')]) {
  if (EXCLUDE.has(f)) continue;
  for (const h of new Set(strip(read(f)).match(/#[0-9a-fA-F]{6}/g) || [])) {
    const H = h.toUpperCase();
    if (OUT_OF_SCOPE.has(H)) continue;
    const c = parse(H);
    const d = ratio(over(c, dark), dark), l = ratio(over(c, light), light);
    if (d >= 4.5 && l < 3.0) survivors.push(`${H} in ${f} (dark ${r2(d)} / light ${r2(l)})`);
  }
}
ok('no literal is legible on one theme and invisible on the other',
   survivors.length === 0, survivors.slice(0,6).join(' | '));
ok('the out-of-scope set is exactly the six declared, each with a reason',
   OUT_OF_SCOPE.size === 6 && [...OUT_OF_SCOPE.values()].every(v => v.length > 20));

// ⑤ the specimen
console.log('\n\u2464 the specimen that sharpened the finding');
const TEAM = read('app/vendor/studio/team/page.tsx');
ok('studio/team\u2019s sheet reads the role', /card: 'var\(--role-sheet\)'/.test(TEAM));
ok('studio/team\u2019s scrim reads the role', /backgroundColor: 'var\(--role-scrim\)'/.test(TEAM));

// ⑥ the roles are published, and the stale duplicate is gone
console.log('\n\u2465 published, and the second home closed');
const CTX = read('lib/vendor/ThemeContext.tsx');
for (const r of ['positive','caution','critical','metal','scrim','sheet'])
  ok(`--role-${r} is published`, new RegExp(`setProperty\\('--role-${r}'`).test(CTX));
const CSS = read('app/globals.css');
ok('globals.css no longer holds a second copy of the ink ladder',
   !/--atelier-ink-mute:\s*rgba\(26,15,8,0\.58\)/.test(CSS) &&
   !/--atelier-ink-dim:\s*rgba\(26,15,8,0\.38\)/.test(CSS));

console.log(`\n${fail===0?'GREEN':'RED'} — ${pass} passed, ${fail} failed\n`);

// ── BOTH-WAYS MUTATIONS, applied alone, cmp-restored ───────────────────────
//   M1  LIGHT.critical reverted to #E07B5C      → RED ② (2.63 on paper)
//   M2  LIGHT.scrim reverted to rgba(0,0,0,0.7) → RED ③ — the composite cell, and
//        NOTHING else reddens: the literal is fine, the pair is not. That is the
//        whole finding, proven by one mutation.
//   M3  LIGHT.sheet reverted to rgba(255,255,255,0.035) → STAYED GREEN, and that is
//        CORRECT, recorded rather than quietly dropped. The two surface roles are
//        COUPLED: with the cured scrim (a light veil, #A8A39E) a 3.5%-white sheet
//        still composites to #ABA6A1 and the form ink reads 7.8:1. Only the OLD black
//        scrim made the transparent sheet fatal — 2.30:1, which is the founder's
//        screenshot. So the specimen had one disease with two possible cures, and the
//        scrim is the load-bearing one. A mutation that fails to redden is evidence
//        about the system, not a hole to paper over; the honest reading is that this
//        cell cannot be reached independently, and M2 is what guards it.
//        (M2 alone: black scrim + white sheet still passes at 18.82 — so neither role
//         is individually sufficient to break it either. The pair is the unit. That is
//         F-09.28 restated as arithmetic.)
//   M4  LIGHT.scrim set equal to the page colour → RED ③ "the veil actually dims"
//   M5  one #E07B5C restored in a swept file    → RED ④
//   M6  OUT_OF_SCOPE emptied                    → RED ④ both cells
//   M7  studio/team's scrim literal restored    → RED ⑤ and ③ stays green — the
//        site cell and the token cell separating, as designed
//   M8  a --role-* setProperty deleted          → RED ⑥
//   M9  the stale globals block restored        → RED ⑥
process.exit(fail === 0 ? 0 : 1);
