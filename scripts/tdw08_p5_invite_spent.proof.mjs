#!/usr/bin/env node
// scripts/tdw08_p5_invite_spent.proof.mjs — TDW_08 · P5 · Phase 1 (pwa arm)
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url, never cwd).
//
// WHAT IS UNDER TEST. The CE ruling of 2026-08-04, §4: the board's `canSend`
// gains the SPENT term, both consumers inherit it from the one home, and the
// server ships `invite_sent_at` raw so this surface holds no opinion it could
// contradict (F-08.45's one-authority shape).
//
// WHY THIS IS ITS OWN FILE AND NOT AN AMENDMENT TO tdw08_p4_factory. That bench
// is SEALED at 45 and this cure did not need to move it: the term was sited
// ABOVE the `active` clause precisely so §M.8's anchor and the §5.4/§7.1/§M.10
// windows survive byte-identical (derived by command, recorded in the source's
// own comment). New cells go in a new home rather than growing a sealed count
// for a change that did not require it.
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup —
// asserts the cell goes RED at the broken tree, restores the file, and asserts
// byte-identity. Every anchor is asserted to appear EXACTLY ONCE (CE-127).
//
// ── THE COMMENT-BLINDNESS LAW BINDS EVERY TEXTUAL CELL HERE ─────────────────
// The surface's own comment block quotes `invite_sent_at`, `invite_already_sent`
// and the predicate itself, because the file explains what it does. Every cell
// strips comments FIRST and says so.
//
// ── WHAT THIS PROOF DOES NOT ASSERT, named rather than silently absent ──────
//   · NO cell over the ROUTE's refusal. The enforcement is dream-os's and is
//     proven at scripts/b08_p5_invite_bench.js §2. A cell here could only
//     restate a hope about a repository this file cannot see.
//   · NO RENDERED-PIXEL cell. There is no DOM here; these are source-property
//     cells. What the board LOOKS like on a stamped row rides the founder's walk.
//   · NO cell over a VISIBLE TELL for a spent row. FORK D(ii) says "the board
//     carries the tell" and NO rendering was ruled — a badge is a user-facing
//     byte and Phase 1 is expected-zero. It is on the veto list as a PROPOSAL,
//     unbuilt, and a cell asserting an unbuilt thing absent would be theatre.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

const PAGE = 'app/admin/demo/page.tsx';

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
  fs.writeFileSync(abs, original.replace(anchor, replacement));
  let red = false;
  try { predicate(); } catch { red = true; }
  fs.writeFileSync(abs, original);
  assert.strictEqual(fs.readFileSync(abs, 'utf8'), original, `${rel} not restored byte-identical`);
  assert.ok(red, `${label} passed over broken production source — the cell is VACUOUS`);
}
function okMutate(name, rel, anchor, replacement, predicate, label) {
  try { mutate(rel, anchor, replacement, predicate, label); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · THE SPENT TERM LIVES IN THE ONE PREDICATE');

ok('§1.1 canSend carries the spent term',
  /const canSend = \(v: DemoVendor\) =>[\s\S]{0,240}!v\.invite_sent_at/.test(code(PAGE)));

ok('§1.2 the BULK list inherits it from the one home, never a second expression',
  /rows\.filter\(canSend\)/.test(code(PAGE))
  && (code(PAGE).match(/invite_sent_at/g) || []).length === 2);

ok('§1.3 the PER-CARD button inherits it through the same predicate',
  /\{canSend\(v\) && \(/.test(code(PAGE)));

ok('§1.4 no hand-written spent expression exists anywhere else on this surface',
  !/v\.invite_sent_at\s*(===|!==|==|!=)/.test(code(PAGE))
  && !/invited_at[\s\S]{0,40}invite_sent_at/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · THE FACT IS THE SERVER\'S — THIS SURFACE DERIVES NOTHING');

ok('§2.1 invite_sent_at is typed as a raw nullable stamp, never a boolean',
  /invite_sent_at\?: string \| null;/.test(code(PAGE)));

ok('§2.2 the surface never MINTS a stamp — it only reads one',
  !/invite_sent_at\s*[:=]\s*(new Date|Date\.now|iso|`)/.test(code(PAGE)));

ok('§2.3 and never CLEARS one — recovery was ruled founder-SQL (FORK D(ii))',
  !/invite_sent_at\s*[:=]\s*null/.test(code(PAGE)));

ok('§2.4 the state subset is still the SERVER\'s (the term joined, it did not replace)',
  /inviteStates\.includes\(v\.state\)/.test(code(PAGE))
  && !/state === 'built' \|\| state === 'legacy'/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§3 · THE SEALED NEIGHBOURS ARE UNDISTURBED');

// This is the cell that makes the siting decision auditable rather than a claim
// in a comment. It asserts the two properties the sealed bench depends on —
// §M.8's anchor and §7.1's window — from THIS file, so a future hand that
// re-orders the predicate for tidiness learns the cost here and not from a red
// bench in the other proof.
ok('§3.1 §M.8\'s sealed anchor survives byte-identical (the last clause + semicolon)',
  read(PAGE).split('                  && v.active !== false;').length - 1 === 1);

ok('§3.2 and §7.1\'s 240-char window still reaches the active clause',
  /const canSend = \(v: DemoVendor\) =>[\s\S]{0,240}v\.active !== false/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§M · BOTH WAYS, BY MUTATING PRODUCTION SOURCE');

okMutate('§M.1 §1.1 reds if the spent term leaves the predicate', PAGE,
  '                  && !v.invite_sent_at\n',
  '',
  () => assert.ok(/const canSend = \(v: DemoVendor\) =>[\s\S]{0,240}!v\.invite_sent_at/.test(code(PAGE))),
  '§1.1');

okMutate('§M.2 §1.2 reds if the batch grows a SECOND spent expression', PAGE,
  '                const invitableRows = rows.filter(canSend);',
  '                const invitableRows = rows.filter((v: DemoVendor) => canSend(v) && !v.invite_sent_at);',
  () => assert.ok(/rows\.filter\(canSend\)/.test(code(PAGE))
    && (code(PAGE).match(/invite_sent_at/g) || []).length === 2),
  '§1.2');

okMutate('§M.3 §1.3 reds if the card button stops going through the predicate', PAGE,
  '{canSend(v) && (',
  '{!v.invite_sent_at && (',
  () => assert.ok(/\{canSend\(v\) && \(/.test(code(PAGE))), '§1.3');

okMutate('§M.4 §2.3 reds if this surface starts clearing the marker', PAGE,
  '                  && !v.invite_sent_at\n',
  '                  && !v.invite_sent_at\n                  && (v.invite_sent_at = null) === null\n',
  () => assert.ok(!/invite_sent_at\s*[:=]\s*null/.test(code(PAGE))), '§2.3');

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — tdw08_p5_invite_spent ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
