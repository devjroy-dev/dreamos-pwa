#!/usr/bin/env node
// scripts/tdw_stripper_census.mjs
// ═════════════════════════════════════════════════════════════════════════════
// THE F-07.74 CLASS CENSUS INSTRUMENT — CE-ruled IN as the committed audit tool
// (F1 ruling: the scanner is the STANDING stripper; this is the oracle that
// re-adjudicates the class on demand). Q-SP-5 binds: a census nobody can re-run
// quietly stops being a census.
//
// WHAT IT DOES. It parses every source file with the TypeScript compiler — a real
// lexer, JSX-aware — and asks the only question that matters: which `/*` and `*/`
// occurrences are NOT comments? Those are the trap sites. It then measures, per
// file and per bite, what the RETIRED naive regex would delete and how much of
// that is live code.
//
// WHY A SECOND MECHANISM. The audit's own first instrument was a hand-rolled
// scanner, and it reported 39 false bites and "the shipped scanner swallows
// sanctuary". Both were artefacts of the instrument, not facts about the tree.
// The estate has now convicted four separate witnesses of not seeing what they
// were built to see. A census is only worth its ink if a DIFFERENT mechanism
// derived it than the one it is auditing — so the standing stripper is a
// character scanner and its auditor is a compiler.
//
// RUN:  node scripts/tdw_stripper_census.mjs            (needs devDependencies)
//       node scripts/tdw_stripper_census.mjs --write    (refresh the .out.txt)
//
// TYPESCRIPT IS A devDependency of this repo ("typescript": "^5"). If node_modules
// is absent this instrument SKIPS LOUDLY and names why. It gates nothing: the
// standing floor runs without it.
// ═════════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');
const out = [];
const say = (s = '') => { out.push(s); console.log(s); };

let ts;
try {
  ts = (await import('typescript')).default;
} catch {
  console.log('SKIP — tdw_stripper_census: `typescript` is not installed in this container.');
  console.log('       It is a devDependency of this repo; run `npm ci` first. This tool');
  console.log('       gates nothing — the standing floor does not depend on it. NAMED SKIP.');
  process.exit(0);
}

const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

function commentRanges(src, rel) {
  const jsx = /\.(tsx|jsx)$/.test(rel);
  const js = /\.(js|mjs|cjs)$/.test(rel);
  const sf = ts.createSourceFile(rel, src, { languageVersion: ts.ScriptTarget.ESNext }, true,
    jsx ? ts.ScriptKind.TSX : js ? ts.ScriptKind.JS : ts.ScriptKind.TS);
  const ranges = [], seen = new Set();
  const push = (r) => { const k = r.pos + ':' + r.end; if (!seen.has(k)) { seen.add(k); ranges.push([r.pos, r.end]); } };
  const visit = (n) => {
    (ts.getLeadingCommentRanges(src, n.getFullStart()) || []).forEach(push);
    (ts.getTrailingCommentRanges(src, n.getEnd()) || []).forEach(push);
    for (const c of n.getChildren(sf)) visit(c);
  };
  visit(sf);
  // {/* … */} — a JSX expression container holding only a comment has no child
  // node to hang trivia on, so it is collected separately. Missing this was the
  // first instrument's second error.
  const visit2 = (n) => {
    if (ts.isJsxExpression(n) && !n.expression) {
      const t = src.slice(n.getStart(), n.getEnd());
      const s = t.indexOf('/*'), e = t.lastIndexOf('*/');
      if (s >= 0 && e > s) push({ pos: n.getStart() + s, end: n.getStart() + e + 2 });
    }
    ts.forEachChild(n, visit2);
  };
  visit2(sf);
  return ranges.sort((a, b) => a[0] - b[0]);
}

const lineOf = (s, p) => s.slice(0, p).split('\n').length;

const files = execSync(`cd ${ROOT} && git ls-files`, { encoding: 'utf8' })
  .trim().split('\n').filter(f => CODE_EXT.test(f) && !f.startsWith('scripts/'));

say('═══ F-07.74 CLASS CENSUS — TypeScript-lexer adjudicated ═══');
say(`repo tip: ${execSync(`cd ${ROOT} && git rev-parse HEAD`, { encoding: 'utf8' }).trim()}`);
say(`files scanned: ${files.length}`);
say('');

let bites = 0, span = 0, live = 0, opens = 0, closes = 0;
const NAIVE_RE = /\/\*[\s\S]*?\*\//g;

for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (!src.includes('/*') && !src.includes('*/')) continue;
  let cs;
  try { cs = commentRanges(src, f); } catch (e) { say(`  PARSE-SKIP ${f} — ${e.message}`); continue; }
  const inC = (p) => cs.some(([a, b]) => p >= a && p < b);
  const cmtIn = (a, b) => cs.reduce((n, [ca, cb]) => {
    const lo = Math.max(a, ca), hi = Math.min(b, cb); return hi > lo ? n + (hi - lo) : n;
  }, 0);

  const fo = [], fc = [];
  for (let i = 0; i + 1 < src.length; i++) {
    if (src[i] === '/' && src[i + 1] === '*' && !inC(i)) fo.push(i);
    if (src[i] === '*' && src[i + 1] === '/' && !inC(i) && !inC(i - 1)) fc.push(i);
  }
  const fb = [];
  NAIVE_RE.lastIndex = 0;
  let m;
  while ((m = NAIVE_RE.exec(src)) !== null) {
    if (!inC(m.index)) fb.push([m.index, m.index + m[0].length]);
  }
  if (!fo.length && !fc.length) continue;

  opens += fo.length; closes += fc.length;
  say(`${f}`);
  fo.forEach(i => say(`   FALSE OPEN  :${lineOf(src, i)}   …${src.slice(Math.max(0, i - 30), i + 6).replace(/\n/g, '\\n')}`));
  fc.forEach(i => say(`   FALSE CLOSE :${lineOf(src, i)}   …${src.slice(Math.max(0, i - 30), i + 6).replace(/\n/g, '\\n')}`));
  fb.forEach(([a, b], k) => {
    const l = b - a - cmtIn(a, b);
    bites++; span += b - a; live += l;
    say(`   BITE ${k + 1}: chars ${a}-${b}  lines ${lineOf(src, a)}-${lineOf(src, b)}  span ${b - a}  LIVE ${l}`);
  });
  say('');
}

say('─── TOTALS ───');
say(`false opens: ${opens} · false closes: ${closes}`);
say(`false bites the RETIRED rule would take: ${bites} · span ${span} · LIVE CODE ${live}`);
say('');
say('─── THE STANDING STRIPPER, JUDGED AGAINST THE SAME TREE ───');
{
  let bad = 0;
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!src.includes('/*')) continue;
    let cs; try { cs = commentRanges(src, f); } catch { continue; }
    const trueCode = (() => { let o = '', prev = 0; for (const [a, b] of cs) { o += src.slice(prev, a); prev = b; } return o + src.slice(prev); })();
    const mine = stripComments(src);
    // compare on non-whitespace only: the two differ in how they blank a region
    const N = (s) => s.replace(/\s+/g, '');
    if (N(mine) !== N(trueCode)) { bad++; say(`   DIVERGES from the lexer: ${f}`); }
  }
  say(bad === 0
    ? '   scripts/lib/stripComments.mjs agrees with the compiler on EVERY file scanned.'
    : `   ${bad} file(s) where the standing scanner and the compiler disagree — investigate before trusting any absence-cell over them.`);
}
say('');
say('─── THE RETIRED RULE, FOR CONTRAST ───');
{
  let bad = 0;
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!src.includes('/*')) continue;
    let cs; try { cs = commentRanges(src, f); } catch { continue; }
    const trueCode = (() => { let o = '', prev = 0; for (const [a, b] of cs) { o += src.slice(prev, a); prev = b; } return o + src.slice(prev); })();
    const N = (s) => s.replace(/\s+/g, '');
    if (N(NAIVE_RETIRED(src)) !== N(trueCode)) bad++;
  }
  say(`   the retired naive rule disagrees with the compiler on ${bad} file(s).`);
}

if (WRITE) {
  const dest = path.join(ROOT, 'scripts/tdw_stripper_census.out.txt');
  fs.writeFileSync(dest, out.join('\n') + '\n');
  console.log(`\nwritten: scripts/tdw_stripper_census.out.txt`);
}
