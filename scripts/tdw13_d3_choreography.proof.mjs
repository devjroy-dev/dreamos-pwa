#!/usr/bin/env node
// scripts/tdw13_d3_choreography.proof.mjs
//
// TDW_13 · D-3 · ONE HOME FOR THE CHOREOGRAPHY (F-13.4 · F-13.5 · F-13.6).
//
// α1: cure BEFORE the freeze. P2 puts a FROZEN header over the open/close
// choreography, and a header over a forked shape makes the fork permanent by
// law — every later diff inside it is a failed session, including the diff that
// would have fixed it. So the three forks come out first:
//
//   F-13.4  @keyframes dpulse declared twice, byte-identical, one in the CSS
//           const and one inline in the Dream bloom
//   F-13.5  the close duration written as a bare 300 in three places — the
//           .bloom-exit CSS rule, closeRoom's teardown timer, and the popstate
//           back-trap's own copy of that timer — with nothing joining them
//   F-13.6  the frost:open-dream listener re-implementing openRoom's triad
//           inline instead of calling it
//
// THE VALUE IS FROZEN, THE HOMES ARE NOT. This is hygiene, not tuning: 300ms is
// 300ms before and after, and cell 5 fails if anyone changes it under cover of
// this cure. F-1 makes the choreography sacred; sacred means the motion the
// bride sees, not the number of places it is written down.
//
// The stripper is the estate's ONE home (scripts/lib/stripComments.mjs), not a
// local copy — it guards `/*` by its preceding character, which a hand-rolled
// one does not, and a bench asserting on source text is only as honest as the
// stripper beneath it (F-07.99: prove your own call site).

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import stripComments, { NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT    = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUBJECT = path.join(ROOT, 'app/(frost)/frost/canvas/sanctuary/page.tsx');

let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push(['ok  ', name]); }
  else { fail++; results.push(['FAIL', name + (detail ? ' — ' + detail : '')]); }
  return !!cond;
}
const sha  = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const read = () => fs.readFileSync(SUBJECT, 'utf8');
const count = (s, re) => (s.match(re) || []).length;

/* ── AMENDMENT, TDW_13 D-4: THE SUBJECT IS THE SURFACE ──────────────────────
   Written one delivery before the extraction, this bench pinned everything to
   sanctuary/page.tsx. D-4 moved six blooms out, and the frost:open-dream
   DISPATCHER went with them — it lived inside EventsRoom and now lives in
   components/frost/blooms/events.tsx. Cell 4f went red while the dispatcher was
   completely untouched.

   That is my own hand making the mistake this block exists to catch: the cell
   pinned a PATH when it meant a SURFACE. F-13.6's cure is that there is one way
   into a bloom, and that claim spans the screen, not one file. So the subject is
   the surface. The conductor is still read on its own where a cell is genuinely
   about the conductor — the choreography lives there and nowhere else.
   See components/frost/_shared/SURFACE.md. */
function surfaceSrc() {
  const parts = [fs.readFileSync(SUBJECT, 'utf8')];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) parts.push(fs.readFileSync(path.join(abs, f), 'utf8'));
  }
  return parts.join('\n');
}

const raw  = read();
const code = stripComments(raw);
const surfaceCode = stripComments(surfaceSrc());

// ═════════════════════════════════════════════════════════════════════════════
// 0 — CALL-SITE PROOF for the stripper (F-07.99). Every cell below stands on it.
// ═════════════════════════════════════════════════════════════════════════════
ok('0a. stripper: removes a line comment',
   !stripComments('const a=1; // D3_SENTINEL\n').includes('D3_SENTINEL'));
ok('0b. stripper: removes a block comment',
   !stripComments('const a=1; /* D3_SENTINEL */').includes('D3_SENTINEL'));
ok('0c. stripper: SPARES string and template contents (the founder-byte case)',
   stripComments('const a = `keep // this`;').includes('keep // this'));
ok('0d. stripper: does NOT eat a /* that is not a comment opener',
   stripComments('<input accept="image/*" />').includes('image/*'));
ok('0e. vacuity twin: the naive rule WOULD have eaten the specimen 0d survives',
   !NAIVE_RETIRED('<input accept="image/*" />/* x */').includes('image/*'));
ok('0f. the subject really is comment-heavy, so stripping is not a no-op',
   code.length < raw.length * 0.95, `${raw.length} → ${code.length}`);

// ═════════════════════════════════════════════════════════════════════════════
// 1 — F-13.5 · ONE HOME for the close duration
// ═════════════════════════════════════════════════════════════════════════════
const decl = code.match(/const BLOOM_CLOSE_MS\s*=\s*(\d+)\s*;/);
ok('1a. BLOOM_CLOSE_MS is declared', !!decl);
ok('1b. declared exactly once', count(code, /const BLOOM_CLOSE_MS\s*=/g) === 1,
   `${count(code, /const BLOOM_CLOSE_MS\s*=/g)} declarations`);

// the three sites, each asserted at its own site rather than by a global count
ok('2a. the CSS rule reads the constant, not a literal',
   /\.bloom-exit\{animation:bloomOut \$\{BLOOM_CLOSE_MS\}ms /.test(code),
   'the .bloom-exit rule still carries its own number');
ok('2b. closeRoom\'s teardown timer reads the constant',
   /const closeRoom = useCallback\(\(\)=>\{[\s\S]{0,220}?\},BLOOM_CLOSE_MS\);/.test(code));
ok('2c. the popstate back-trap\'s timer reads the constant',
   /setClosing\(true\);\s*setTimeout\(\(\)=>\{ setActiveRoom\(null\); setBlooming\(false\); setClosing\(false\); \},BLOOM_CLOSE_MS\);/.test(code));

// R-31.1: the bench enumerates the sites itself rather than inheriting a list.
// Every teardown timer in the file must read the constant — if a fourth close
// path is ever added with its own number, this is what catches it.
const teardowns = [...code.matchAll(/setClosing\(true\)[\s\S]{0,240}?setTimeout\([\s\S]{0,200}?\},\s*([A-Za-z_0-9]+)\s*\)/g)]
  .map(m => m[1]);
ok('2d. EVERY close-teardown timer in the file reads BLOOM_CLOSE_MS (sites enumerated, not inherited)',
   teardowns.length >= 2 && teardowns.every(t => t === 'BLOOM_CLOSE_MS'),
   `found ${teardowns.length}: ${teardowns.join(', ')}`);

// ═════════════════════════════════════════════════════════════════════════════
// 3 — F-13.4 · ONE HOME for the dpulse keyframe
// ═════════════════════════════════════════════════════════════════════════════
// 3a asserts on RAW source, deliberately. The estate's shared stripper leaks
// comments on this file (63 of them, pre-existing at ebf9097 — an apostrophe in
// JSX prose like "What I've spent." opens a phantom string it never closes), so
// a stripped-source count of this token is not trustworthy here. Raw counting is
// trustworthy only because the cure's own comment was reworded to avoid spelling
// the at-rule. Cell 3d below is the guard on that arrangement.
ok('3a. the dpulse keyframe is declared exactly once in the file',
   count(raw, /@keyframes dpulse/g) === 1,
   `${count(raw, /@keyframes dpulse/g)} declarations`);
ok('3b. its one home is the CSS const, which mounts page-wide as #sv5',
   /const CSS=`[\s\S]*?@keyframes dpulse[\s\S]*?`;/.test(code) &&
   /document\.createElement\('style'\);s\.id='sv5';s\.textContent=CSS/.test(code));
// both consumers must survive — a "one home" that was reached by deleting a
// consumer is a capability loss wearing a cure's uniform
/* AMENDMENT, TDW_13 D-5: the two dpulse consumers now live in different files —
   the Dream thinking line stayed with the conductor, the rail mark went to the
   discover bloom. The claim was never "both are in page.tsx"; it was that ONE
   HOME serves BOTH consumers, and a de-duplication that reached its number by
   deleting a consumer is a capability loss wearing a cure's uniform. Counted
   across the surface, which is where the two of them are. */
ok('3c. BOTH dpulse consumers still animate (the rail mark and the Dream thinking line)',
   count(surfaceCode, /animation:'dpulse 1\.4s infinite ease-in-out'/g) === 2,
   `${count(surfaceCode, /animation:'dpulse 1\.4s infinite ease-in-out'/g)} consumers`);
// the disease's actual shape, asserted independently of any token count: the
// duplicate lived in an inline <style>. No inline style block may carry it.
/* AMENDMENT, TDW_13 D-5: scanned across the surface. The inline <style> blocks
   that made this cell non-vacuous moved to the discover and muse blooms with
   their rooms; the conductor alone now has none, and a scan of it would have
   passed over an empty set — the exact vacuity 3e exists to refuse. */
const inlineStyles = [...surfaceSrc().matchAll(/<style>\{`([\s\S]*?)`\}<\/style>/g)].map(m => m[1]);
ok('3d. no inline <style> block carries the dpulse keyframe',
   inlineStyles.every(s => !s.includes('dpulse')),
   `${inlineStyles.filter(s => s.includes('dpulse')).length} inline blocks carry it`);
ok('3e. control: the inline-style scan is non-vacuous (this file has inline blocks)',
   inlineStyles.length > 0, `${inlineStyles.length} inline <style> blocks found`);

// ═════════════════════════════════════════════════════════════════════════════
// 4 — F-13.6 · ONE WAY into a bloom
// ═════════════════════════════════════════════════════════════════════════════
const openTriads = count(code, /setActiveRoom\((?:'[a-z]+'|key)\);\s*setBlooming\(true\);\s*setClosing\(false\);/g);
ok('4a. the open triad is written exactly once — inside openRoom',
   openTriads === 1, `${openTriads} copies of the triad`);
ok('4b. openRoom is that one home',
   /const openRoom = useCallback\(\(key:RoomKey\)=>\{\s*setActiveRoom\(key\);\s*setBlooming\(true\);\s*setClosing\(false\);\s*\},\[\]\);/.test(code));
ok('4c. the frost:open-dream listener CALLS openRoom instead of re-implementing it',
   /const onOpenDream = \(e: Event\) => \{[\s\S]{0,260}?openRoom\('dream'\);/.test(code));
ok('4d. that listener still binds and unbinds the event',
   /addEventListener\('frost:open-dream', onOpenDream\)/.test(code) &&
   /removeEventListener\('frost:open-dream', onOpenDream\)/.test(code));
ok('4e. it still prefills the prompt — the cure moved the open, not the feature',
   /if\(prompt && typeof prompt === 'string'\) \{\s*setInput\(prompt\);/.test(code));
// 4f reads the SURFACE: the dispatcher moved to the events bloom in D-4 and the
// claim was never about which file holds it — only that the seam still has both
// ends. The listener half is asserted against the conductor at 4c/4d above.
ok('4f. the dispatcher that fires it is untouched, wherever it now lives',
   /dispatchEvent\(new CustomEvent\('frost:open-dream'/.test(surfaceCode));
ok('4g. the seam has exactly one dispatcher — the move did not leave a copy behind',
   (surfaceCode.match(/dispatchEvent\(new CustomEvent\('frost:open-dream'/g) || []).length === 1,
   `${(surfaceCode.match(/dispatchEvent\(new CustomEvent\('frost:open-dream'/g) || []).length} dispatchers`);

// ═════════════════════════════════════════════════════════════════════════════
// 5 — THE MOTION DID NOT MOVE. Hygiene, not tuning.
// ═════════════════════════════════════════════════════════════════════════════
ok('5a. BLOOM_CLOSE_MS is 300 — the value this file has always used',
   !!decl && decl[1] === '300', decl ? decl[1] : '—');
ok('5b. the exit easing and keyframe are byte-unchanged',
   /\.bloom-exit\{animation:bloomOut \$\{BLOOM_CLOSE_MS\}ms cubic-bezier\(0\.4,0,1,1\) forwards;\}/.test(code));
ok('5c. the ENTER side is untouched — 380ms, one site, no constant invented for it',
   /\.bloom-enter\{animation:bloomIn 380ms cubic-bezier\(0\.22,1,0\.36,1\) forwards;\}/.test(code) &&
   count(code, /380/g) === 1);
ok('5d. the dpulse keyframe body is byte-unchanged',
   code.includes('@keyframes dpulse{0%,80%,100%{opacity:.35}40%{opacity:1}}'));

// ═════════════════════════════════════════════════════════════════════════════
// 6 — NON-VACUITY BY PRODUCTION MUTATION
// ═════════════════════════════════════════════════════════════════════════════
const PRE_SHA = sha(raw);
const MUTATIONS = [
  ['M1 · the CSS rule forks back to its own literal',
   s => s.replace('.bloom-exit{animation:bloomOut ${BLOOM_CLOSE_MS}ms', '.bloom-exit{animation:bloomOut 300ms'),
   c => /\.bloom-exit\{animation:bloomOut \$\{BLOOM_CLOSE_MS\}ms /.test(c),
   'cell 2a'],

  ['M2 · closeRoom\'s timer forks back to a bare 300',
   s => s.replace('    },BLOOM_CLOSE_MS);\n  },[]);', '    },300);\n  },[]);'),
   c => { const t = [...c.matchAll(/setClosing\(true\)[\s\S]{0,240}?setTimeout\([\s\S]{0,200}?\},\s*([A-Za-z_0-9]+)\s*\)/g)].map(m => m[1]); return t.length >= 2 && t.every(x => x === 'BLOOM_CLOSE_MS'); },
   'cells 2b/2d'],

  ['M3 · the inline dpulse duplicate comes back',
   s => s.replace('}}>✦ thinking</span>', '}}>✦ thinking</span>\n<style>{`@keyframes dpulse{0%,80%,100%{opacity:.35}40%{opacity:1}}`}</style>'),
   c => (raw2().match(/@keyframes dpulse/g) || []).length === 1 &&
        [...raw2().matchAll(/<style>\{`([\s\S]*?)`\}<\/style>/g)].map(m => m[1]).every(x => !x.includes('dpulse')),
   'cells 3a/3d'],

  ['M4 · the listener re-implements the open triad again',
   s => s.replace("      openRoom('dream');", "      setActiveRoom('dream');\n      setBlooming(true);\n      setClosing(false);"),
   c => (c.match(/setActiveRoom\((?:'[a-z]+'|key)\);\s*setBlooming\(true\);\s*setClosing\(false\);/g) || []).length === 1,
   'cells 4a/4c'],

  ['M5 · the cure quietly retunes the motion',
   s => s.replace('const BLOOM_CLOSE_MS = 300;', 'const BLOOM_CLOSE_MS = 250;'),
   c => { const d = c.match(/const BLOOM_CLOSE_MS\s*=\s*(\d+)\s*;/); return !!d && d[1] === '300'; },
   'cell 5a (the value is frozen)'],

  ['M6 · a dpulse consumer is dropped to reach "one home" cheaply',
   s => s.replace("animation:'dpulse 1.4s infinite ease-in-out'}}>✦ thinking", "}}>✦ thinking"),
   c => (c.match(/animation:'dpulse 1\.4s infinite ease-in-out'/g) || []).length === 2,
   'cell 3c'],
];

let mutBit = 0, mutDead = 0;
const mutLines = [];
// Cells 3a/3d assert on RAW source (the stripper leaks on this file), so the
// mutation leg needs the mutated raw as well as the mutated stripped source.
const raw2 = () => fs.readFileSync(SUBJECT, 'utf8');
for (const [name, mutate, predicate, cellName] of MUTATIONS) {
  const mutated = mutate(raw);
  if (mutated === raw) {
    mutDead++;
    mutLines.push(['DEAD', `${name} — the mutation changed NOTHING; ${cellName} is unproven`]);
    continue;
  }
  fs.writeFileSync(SUBJECT, mutated, 'utf8');
  let held;
  try { held = predicate(stripComments(read())); }
  finally { fs.writeFileSync(SUBJECT, raw, 'utf8'); }
  if (held) { mutDead++; mutLines.push(['DEAD', `${name} — ${cellName} STILL PASSED on the defaced tree`]); }
  else { mutBit++; mutLines.push(['bite', `${name} → ${cellName} went red`]); }
}

const POST_SHA = sha(read());
const restored = POST_SHA === PRE_SHA;

console.log('');
for (const [tag, line] of results) console.log(`  ${tag} ${line}`);
console.log('');
console.log('  ── mutation leg (production code, never test setup) ──');
for (const [tag, line] of mutLines) console.log(`  ${tag} ${line}`);
console.log('');
console.log(`  le3 restore: pre ${PRE_SHA.slice(0, 12)} · post ${POST_SHA.slice(0, 12)} · ${restored ? 'IDENTICAL' : 'DIVERGED'}`);
console.log('');

const total = results.length;
const green = fail === 0 && mutDead === 0 && restored;
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw13_d3_choreography: ${pass} passed, ${fail} failed`);
console.log(`  total ${total} · run ${total} · skipped 0 · in-process, no network, no browser`);
console.log(`  mutations ${MUTATIONS.length} · biting ${mutBit} · dead ${mutDead}`);
console.log(`VERDICT: ${green ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(green ? 0 : 1);
