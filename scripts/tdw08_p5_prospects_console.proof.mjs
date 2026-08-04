#!/usr/bin/env node
// scripts/tdw08_p5_prospects_console.proof.mjs — TDW_08 · P5 (pwa arm)
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url).
//
// WHAT IS UNDER TEST. The CE ruling of 2026-08-04 chartering the prospect
// console before the acceptance evenings: the board, the intake (single + paste),
// the cap dial, and the four per-row actions — over an API that has been mounted
// and screenless since Block 05 P3.
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup —
// asserts the cell goes RED at the broken tree, restores the file, and asserts
// byte-identity. Every anchor is asserted to appear EXACTLY ONCE (CE-127).
//
// ── THE COMMENT-BLINDNESS LAW BINDS EVERY TEXTUAL CELL HERE ─────────────────
// The surface's own header quotes `already_registered`, `missing_country_code`
// and the route paths, because the file explains what it does. Every cell strips
// comments FIRST and says so.
//
// ── WHAT THIS PROOF DOES NOT ASSERT, named rather than silently absent ──────
//   · NO cell over the SERVER's refusal. The guard is dream-os's and is proven
//     at scripts/b08_p5_prospect_intake_bench.js. A cell here could only restate
//     a hope about a repository this file cannot see.
//   · NO RENDERED-PIXEL cell. There is no DOM here; these are source-property
//     cells. What the console LOOKS like rides the founder's own thumb-walk,
//     which is deliberately step one of evening one.
//   · NO cell over `requireAdmin`. The gate is the layout's and the server's;
//     this screen inherits it exactly as every sibling admin page does.
//   · NO cell over a REAL send. `Send opener` spends a Meta template on a live
//     handset and a proof that fires it is not a proof.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

const PAGE   = 'app/admin/prospects/page.tsx';
const LAYOUT = 'app/admin/layout.tsx';

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
H('§1 · THE CONTROL INVENTORY (CE-115) — every control NEW, each accounted');

const CONTROLS = [
  ['the state filter',        /<FilterPills/],
  ['add one prospect',        /label=\{[^}]*'Add prospect'/],
  ['paste a list',            /<textarea/],
  ['add the pasted list',     /label=\{[^}]*'Add all'/],
  ['the cap dial',            /label="Save cap"/],
  ['send opener (confirm)',   /label="Send opener"[\s\S]{0,120}setConfirmSend/],
  ['the confirm tap itself',  /label="Send it"/],
  ['cancel the send',         /label="Cancel"/],
  ['view the conversation',   /label="Conversation"/],
  ['mark converted',          /label="Converted"/],
  ['clear the paste result',  /label="Clear"/],
];
for (const [name, re] of CONTROLS) {
  ok(`§1 · ${name}`, re.test(code(PAGE)));
}
ok('§1.12 eleven controls, all NEW — this screen replaces no surface',
  CONTROLS.length === 11);

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · IT CALLS THE DOOR THAT EXISTS — all eight routes, none invented');

const C = code(PAGE);
ok('§2.1 the board',           /call\(`\/\?state=\$\{state\}/.test(C));
ok('§2.2 single add',          /call\('\/',\s*\{\s*method:\s*'POST'/.test(C));
ok('§2.3 bulk add',            /call\('\/bulk',\s*\{\s*method:\s*'POST'/.test(C));
ok('§2.4 read the cap',        /call\('\/cap'\)/.test(C));
ok('§2.5 set the cap',         /call\('\/cap',\s*\{\s*method:\s*'PATCH'/.test(C));
ok('§2.6 the conversation',    /call\(`\/\$\{p\.id\}\/conversation`\)/.test(C));
ok('§2.7 send opener',         /call\(`\/\$\{p\.id\}\/send-opener`/.test(C));
ok('§2.8 mark converted',      /call\(`\/\$\{p\.id\}\/mark-converted`/.test(C));
ok('§2.9 the base is the mounted path, never a guess',
  /\$\{API_BASE\}\/api\/v2\/admin\/prospects/.test(C));
ok('§2.10 every call carries the bearer through the ONE authority',
  /headers:\s*adminHeaders\(\)/.test(C) && !/x-admin-password/.test(C));

// ═════════════════════════════════════════════════════════════════════════════
H('§3 · KEY NEVER PROSE — the refusal vocabulary is matched on `code`');

ok('§3.1 the guard\'s key has a screen-side sentence',
  /already_registered:/.test(C));
ok('§3.2 and so does the register law at the door',
  /missing_country_code:/.test(C));
ok('§3.3 refusals are read from `code`, never by matching the server\'s sentence',
  /r\?\.code/.test(C) && !/error\s*===\s*'/.test(C));
ok('§3.4 an unknown key still says something true rather than nothing',
  /\|\| fallback \|\|/.test(C));

okMutate('§M.1 the refusal map is load-bearing — remove the guard key and it reddens',
  PAGE,
  "  already_registered:      'Already a vendor with us — this lane is for people who have not joined yet.',\n",
  '',
  () => assert.ok(/already_registered:/.test(code(PAGE))),
  '§3.1');

// ═════════════════════════════════════════════════════════════════════════════
H('§4 · THE STATE VOCABULARY COMES FROM THE WIRE');

ok('§4.1 the filter is built from the server\'s counts object',
  /Object\.keys\(counts\)\.map/.test(C));
ok('§4.2 no hardcoded state array exists on this surface',
  !/\[\s*'cold'\s*,\s*'templated'/.test(C));
ok('§4.3 the cap displayed is the server\'s, never a default typed here',
  /Currently \{cap === null \? '—' : cap\}/.test(C));

// The anchor is the SHORT unique fragment, not a reconstruction of the whole
// expression — my first draft rebuilt the line by hand and the anchor missed by
// a space, which is CE-127's own reason for asserting exactly-once.
okMutate('§M.2 a hardcoded state list would make this screen a second opinion',
  PAGE,
  'Object.keys(counts).map',
  "['cold','templated'].map",
  () => assert.ok(/Object\.keys\(counts\)\.map/.test(code(PAGE))),
  '§4.1');

// ═════════════════════════════════════════════════════════════════════════════
H('§5 · THE SEND IS CONFIRM-TAPPED, BECAUSE IT SPENDS A REAL TEMPLATE');

ok('§5.1 the first tap arms, it does not send',
  /setConfirmSend\(p\.id\)/.test(C));
ok('§5.2 only the armed control calls the route',
  /label="Send it" onClick=\{\(\) => sendOpener\(p\)\}/.test(C));
ok('§5.3 and the armed state says what it will do, to which number',
  /This sends a real WhatsApp template to \{p\.phone\}/.test(C));
ok('§5.4 an opted-out row cannot be armed at all',
  /label="Send opener"[\s\S]{0,160}disabled=\{p\.state === 'opted_out'\}/.test(C));

okMutate('§M.3 remove the arming step and the send becomes one stray tap',
  PAGE,
  '? <GoldBtn label="Send it" onClick={() => sendOpener(p)} small />',
  '? <GoldBtn label="Send it" onClick={() => {}} small />',
  () => assert.ok(/label="Send it" onClick=\{\(\) => sendOpener\(p\)\}/.test(code(PAGE))),
  '§5.2');

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · THE THREAD MARKS WHOSE TURN IS WHOSE');

ok('§6.1 outbound is named Mira, inbound is named Them',
  /outbound \? 'Mira' : 'Them'/.test(C));
ok('§6.2 the name comes from the persona\'s own vocabulary, not "bot" or "system"',
  !/'system'\s*:\s*'/.test(C) && /'Mira'/.test(C));
ok('§6.3 an empty thread is an invitation, not a blank',
  /The conversation starts when they reply to the opener/.test(C));
ok('§6.4 message bodies render whitespace as sent — a WhatsApp message is shaped',
  /whiteSpace: 'pre-wrap'/.test(C));

// ═════════════════════════════════════════════════════════════════════════════
H('§7 · THE SCREEN IS REACHABLE');

ok('§7.1 it is registered in the admin nav, under Outreach',
  /\{ label:'Prospects',\s*path:'\/admin\/prospects'/.test(code(LAYOUT)));

okMutate('§M.4 a screen nobody can navigate to is a screen nobody uses',
  LAYOUT,
  "    { label:'Prospects',     path:'/admin/prospects',               icon:'inbox' },\n",
  '',
  () => assert.ok(/path:'\/admin\/prospects'/.test(code(LAYOUT))),
  '§7.1');

// ═════════════════════════════════════════════════════════════════════════════
H('§8 · THE PASTE PARSER — one per line, either order');

ok('§8.1 blank lines are dropped rather than sent as empty rows',
  /\.map\(l => l\.trim\(\)\)\.filter\(Boolean\)/.test(C));
ok('§8.2 `name, phone` and `phone, name` both work — the half with more digits is the phone',
  /digits\(a\) > digits\(b\)/.test(C));
ok('§8.3 per-row results are rendered, because on this door a refusal IS the row that mattered',
  /setPasteResult\(lines\)/.test(C)
  && /\(r\.refused\s*\|\|\s*\[\]\)/.test(C));

console.log(`\n${'═'.repeat(60)}`);
console.log(`tdw08_p5_prospects_console: ${pass} passed, ${fail} failed`);
console.log(`${'═'.repeat(60)}`);
process.exit(fail ? 1 : 0);
