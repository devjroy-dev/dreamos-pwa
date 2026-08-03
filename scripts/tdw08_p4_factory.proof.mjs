#!/usr/bin/env node
// scripts/tdw08_p4_factory.proof.mjs — TDW_08 · P4 — THE DEMO FACTORY (pwa arm)
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url, never cwd).
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup —
// asserts the cell goes RED at the broken tree, restores the file, and asserts
// byte-identity. Every anchor is asserted to appear EXACTLY ONCE (CE-127).
//
// ── THE COMMENT-BLINDNESS LAW BINDS EVERY TEXTUAL CELL HERE ─────────────────
// It has now been broken twice in two sittings, once by P3's dream-os bench and
// once by THIS sitting's, in its own first run. The surface below carries long
// comment blocks that quote every string these cells assert absent — "min 3",
// "Rs 50K – Rs 2L", "< 10" — because the file explains what it removed. Every
// textual cell strips comments FIRST and says so.
//
// ── WHAT THIS BENCH DOES NOT ASSERT, named rather than silently absent ───────
// (floor-method law.)
//   · NO cells over the ROUTES. The gate, the bulk pre-scan, the shared-handset
//     refusal and the batch bound are dream-os's, proven at
//     scripts/b08_p4_factory_bench.js. A client cell could only restate a hope.
//   · NO RENDERED-PIXEL cells. There is no DOM here. These are source-property
//     cells; what the board LOOKS like on the founder's screen rides his walk.
//   · NO cell over the funnel's ARITHMETIC against real rows. The counting rule
//     (stamps, never current state) is asserted as a property; its output over
//     production data is the smoke card's, from founder-pasted rows.
//   · NO cell over the NO-SWEEP discipline. That F-08.38's twin cite in
//     src/lib/vendor/profileScore.js was left alone is a dream-os fact and this
//     bench cannot see that repository. A cell here could only assert a file's
//     absence from a tree it was never in, which passes everywhere and proves
//     nothing — it was written, caught on read-back, and cut rather than kept
//     for the count.
//   · NO device-matrix cell. iOS Safari / Android Chrome / the Instagram in-app
//     browser cannot be witnessed from this container.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

const PAGE  = 'app/admin/demo/page.tsx';
const FLOOR = 'lib/vendor/discoverFloor.ts';

let pass = 0, fail = 0;
const H = (s) => console.log(`\n══ ${s} ══`);
function ok(name, cond, msg) {
  try { assert.ok(cond, msg || 'assertion failed'); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

function mutate(rel, anchor, replacement, predicate, label) {
  const abs = path.join(ROOT, rel);
  const original = fs.readFileSync(abs, 'utf8');
  const hits = original.split(anchor).length - 1;
  assert.strictEqual(hits, 1,
    `anchor must appear EXACTLY ONCE in ${rel} (found ${hits}) — a bare anchor is a coin flip`);
  try {
    fs.writeFileSync(abs, original.replace(anchor, replacement), 'utf8');
    let red = false;
    try { predicate(); } catch { red = true; }
    assert.ok(red, `${label}: the cell stayed GREEN over broken production code — it proves nothing`);
  } finally {
    fs.writeFileSync(abs, original, 'utf8');
    assert.strictEqual(fs.readFileSync(abs, 'utf8'), original, `${rel} was NOT restored byte-identically`);
  }
}
function okMutate(name, rel, anchor, replacement, predicate, label) {
  try { mutate(rel, anchor, replacement, predicate, label); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · THE FLOOR — ONE HOME ON THIS SIDE OF THE WIRE');

ok('§1.1 the surface imports photoFloor rather than holding a number',
  /import\s*\{\s*photoFloor\s*\}\s*from\s*'@\/lib\/vendor\/discoverFloor'/.test(code(PAGE)));
ok('§1.2 and resolves it from the SERVER\'s value',
  /photoFloor\(srvFloor\)/.test(code(PAGE))
  && /min_portfolio_images/.test(code(PAGE)));
ok('§1.3 the create gate reads the floor, never a literal',
  /photos\.length\s*<\s*floor/.test(code(PAGE)));
ok('§1.4 NO photo-count literal survives anywhere in the executable text',
  !/photos\.length\s*[<>]=?\s*\d/.test(code(PAGE)));
ok('§1.5 the `< 10` upload hide is DELETED, not raised',
  !/photos\.length\s*<\s*10/.test(code(PAGE))
  && !/length\s*<\s*20/.test(code(PAGE)));
ok('§1.6 C3 renders the floor as a value, not as a digit',
  /min \{floor\}/.test(code(PAGE)) && !/min 6/.test(code(PAGE)) && !/min 3/.test(code(PAGE)));
ok('§1.7 C1/C2 is the founder-frozen string with the floor interpolated',
  /Need at least \$\{floor\} portfolio images\. You have \$\{photos\.length\}\./.test(code(PAGE)));
ok('§1.8 THE CEILING IS NEVER READ HERE — a number this file cannot see it cannot contradict',
  !/max_portfolio_images/.test(code(PAGE)));

okMutate('§M.1 §1.3 reds if the gate re-acquires a literal', PAGE,
  'if (photos.length < floor) {', 'if (photos.length < 3) {',
  () => assert.ok(/photos\.length\s*<\s*floor/.test(code(PAGE))), '§1.3');

okMutate('§M.2 §1.2 reds if the surface stops asking the server', PAGE,
  "        if (typeof vRes.min_portfolio_images === 'number') setSrvFloor(vRes.min_portfolio_images);",
  '        setSrvFloor(6);',
  () => assert.ok(/min_portfolio_images/.test(code(PAGE))), '§1.2');

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · THE BOARD — COLUMNS FROM THE WIRE, NEVER FROM THE COMPONENT');

ok('§2.1 the column list is READ from the response', /setStates\(vRes\.states\)/.test(code(PAGE)));
ok('§2.2 and the component enumerates NO state names of its own',
  !/'legacy'\s*,\s*'built'/.test(code(PAGE)) && !/\['built',\s*'invited',\s*'opened',\s*'engaged',\s*'claimed',\s*'expired'/.test(code(PAGE)));
ok('§2.3 a row whose state the server does not know is still shown, never dropped',
  /if \(!groups\.has\(s\)\) groups\.set\(s, \[\]\)/.test(code(PAGE)));
ok('§2.4 the funnel counts from STAMPS, not from the current state',
  /FUNNEL_STAMP/.test(code(PAGE)) && /!!v\[key\]/.test(code(PAGE)));
ok('§2.5 the funnel covers the spec\'s five and does NOT silently swallow legacy',
  /const FUNNEL = \['built', 'invited', 'opened', 'engaged', 'claimed'\]/.test(code(PAGE)));

okMutate('§M.3 §2.1 reds if the board ever holds its own column list', PAGE,
  '        if (Array.isArray(vRes.states)) setStates(vRes.states);',
  "        setStates(['built', 'invited']);",
  () => assert.ok(/setStates\(vRes\.states\)/.test(code(PAGE))), '§2.1');

okMutate('§M.4 §2.4 reds if the funnel starts reading the current state', PAGE,
  '        ? vendors.filter(v => !!v[key]).length',
  '        ? vendors.filter(v => v.state === stage).length',
  () => assert.ok(/!!v\[key\]/.test(code(PAGE))), '§2.4');

// ═════════════════════════════════════════════════════════════════════════════
H('§3 · C5 — THE MONEY REGISTER ON THE OPERATOR\'S OWN SCREEN');

ok('§3.1 the frozen byte is on the rate field',
  /placeholder="Rs 50,000 – Rs 2,00,000"/.test(code(PAGE)));
ok('§3.2 no k/L/Cr form survives in the executable text',
  !/Rs ?\d+ ?[KLkl]\b/.test(code(PAGE)) && !/\d ?Cr\b/.test(code(PAGE)));
ok('§3.3 and the rupee glyph never enters this surface',
  !/₹/.test(code(PAGE)));

okMutate('§M.5 §3.1 reds if the register slips back', PAGE,
  'placeholder="Rs 50,000 – Rs 2,00,000"', 'placeholder="Rs 50K – Rs 2L"',
  () => assert.ok(/placeholder="Rs 50,000 – Rs 2,00,000"/.test(code(PAGE))), '§3.1');

// ═════════════════════════════════════════════════════════════════════════════
H('§4 · F-08.36 — THE RULED INVITE PATH FINALLY HAS A DOOR');

ok('§4.1 a control calls the invite route',
  /\/api\/v2\/admin\/demo\/vendors\/\$\{v\.id\}\/invite/.test(code(PAGE)));
ok('§4.2 and it is reachable from the card, not only from a batch',
  /label=\{busy === v\.id \? 'Sending…' : 'Send invite'\}/.test(code(PAGE)));
ok('§4.3 the batch door exists and calls the bounded route',
  /\/api\/v2\/admin\/demo\/invite-batch/.test(code(PAGE)));
ok('§4.4 the invite is confirmed before a real template is spent',
  /window\.confirm\(`Send the demo invite/.test(code(PAGE)));
ok('§4.5 the route\'s OWN error is shown, never flattened to "Failed."',
  /showToast\(`\$\{d\.error\}\$\{d\.detail \? ` — \$\{d\.detail\}` : ''\}`, true\)/.test(code(PAGE)));

okMutate('§M.6 §4.5 reds if a refusal is flattened into a generic failure', PAGE,
  "        showToast(`${d.error}${d.detail ? ` — ${d.detail}` : ''}`, true);",
  "        showToast('Failed.', true);",
  () => assert.ok(/showToast\(`\$\{d\.error\}/.test(code(PAGE))), '§4.5');

// ═════════════════════════════════════════════════════════════════════════════
H('§5 · FORK D(c) — THE CAUSE IS ON THE CARD, NOT AT THE BUTTON');

ok('§5.1 the shared-handset badge renders', /shared handset/.test(code(PAGE)));
ok('§5.2 the linkage badge names the row that holds it',
  /linked to @\{v\.linkage_held_by\}/.test(code(PAGE)));
ok('§5.3 the two facts are NOT merged — a shared handset is not always a refusal',
  /v\.shared_handset &&/.test(code(PAGE)) && /v\.linkage_held_by &&/.test(code(PAGE)));
ok('§5.4 a row whose linkage is held elsewhere is excluded from the batch',
  /!v\.linkage_held_by\)\.map\(v => v\.id\)/.test(code(PAGE)));

okMutate('§M.7 §5.4 reds if the batch stops excluding held rows', PAGE,
  'const invitable = rows.filter(v => !!v.whatsapp_phone && !v.linkage_held_by).map(v => v.id);',
  'const invitable = rows.filter(v => !!v.whatsapp_phone).map(v => v.id);',
  () => assert.ok(/!v\.linkage_held_by\)\.map/.test(code(PAGE))), '§5.4');

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · F-08.38 — CORRECTED ON CONTACT, CONFINED NOT ERASED');

// The stale cite survives exactly once, inside the attribution that names it.
// Asserting ABSENCE here would fire on the correction itself — the same trap
// this sitting's dream-os bench walked into on its first run.
{
  const lines = read(FLOOR).split('\n');
  const stale = lines.filter(l => l.includes('discover.js:6'));
  ok('§6.1 no live `discover.js:6` cite survives', stale.length <= 1);
  ok('§6.2 and the one occurrence is the F-08.38 correction quoting what it fixed',
    stale.every(l => /F-08\.38|`src\/lib\/vendor\/discover\.js:6`/.test(l)));
  ok('§6.3 both cites are now PATH PLUS SYMBOL',
    /MIN_PORTFOLIO_IMAGES in src\/lib\/vendor\/discover\.js/.test(read(FLOOR))
    && /src\/lib\/vendor\/discover\.js's MIN_PORTFOLIO_IMAGES/.test(read(FLOOR)));
  ok('§6.4 the fallback constant itself is UNTOUCHED — a cite fix is not a value change',
    /export const DISCOVER_PHOTO_FLOOR = 6;/.test(read(FLOOR)));
}

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — tdw08_p4_factory ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
