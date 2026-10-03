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
// ── LABELED AMENDMENT · COUNT PRESERVED (TDW_10 P1, bench-follows-the-law) ──
// §7's two cells asked "is this screen reachable from the nav?" and answered it
// by reading a nav literal out of app/admin/layout.tsx. TDW_10 P1's six-domain
// IA moved the registry to app/admin/_components/adminNav.ts — the SCREEN did
// not move, its PATH did not change, and it is more reachable than before (nav
// entry + command palette). Only the instrument's address moved.
// Re-aimed at the new home, both halves, strength preserved: §7.1 still asserts
// the registration and §M.4 still deletes it and demands the cell go red. The
// count is unchanged at 54. The old anchor is recorded here so this amendment
// can be read against what it replaced:
//   "    { label:'Prospects',     path:'/admin/prospects',               icon:'inbox' },\n"
const NAV = 'app/admin/_components/adminNav.ts';

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

// LABELED AMENDMENT (ADM-1, CE-47 redesign, 1 Oct 2026): the same eleven controls, drawn in the
// new look (adding opens as a card from "+ Add numbers", the cap as a card from "Change", the row's
// acts as a strip). Count kept at eleven; each anchor follows its control.
const CONTROLS = [
  ['the state filter',        /<Chips value=\{state\} onChange=\{setState\}/],
  ['add one prospect',        /'Add this number'/],
  ['paste a list',            /<textarea/],
  ['add the pasted list',     /'Add all'/],
  ['the cap dial',            /await saveCap\(\); setCapOpen\(false\); \}\}>Save</],
  ['send opener (confirm)',   /label: 'Send opener'[\s\S]{0,120}setConfirmSend/],
  ['the confirm tap itself',  /label: 'Tap again to send'/],
  ['cancel the send',         /label: 'Cancel'/],
  ['view the conversation',   /label: 'See chat'/],
  ['mark converted',          /label: 'Mark signed up'/],   // RE-PINNED BY LABEL (CE-47 note 1)
  ['clear the paste result',  /setPasteResult\(null\)[^>]*>Clear</],
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
  // RE-PINNED BY LABEL (CE-47 note 1): the refusal reads in plain words now; the key is the guard.
  "  already_registered:        'Already a vendor with us. This list is for people who have not joined yet.',\n",
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
// LABELED AMENDMENT (ADM-1): the armed control is "Tap again to send" on the row's strip.
ok('§5.2 only the armed control calls the route',
  /label: 'Tap again to send', primary: true, onClick: \(\) => sendOpener\(p\)/.test(C) && (C.match(/sendOpener\(p\)/g) || []).length === 1);
ok('§5.3 and the armed state says what it will do, to which number',
  /This sends a real WhatsApp template to \{p\.phone\}/.test(C));
ok('§5.4 an opted-out row cannot be armed at all',
  /label="Send opener"[\s\S]{0,160}disabled=\{p\.state === 'opted_out'\}/.test(C));

okMutate('§M.3 remove the arming step and the send becomes one stray tap',
  PAGE,
  "? { label: 'Tap again to send', primary: true, onClick: () => sendOpener(p) }",
  "? { label: 'Tap again to send', primary: true, onClick: () => {} }",
  () => assert.ok(/label: 'Tap again to send', primary: true, onClick: \(\) => sendOpener\(p\)/.test(code(PAGE))),
  '§5.2');

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · THE THREAD MARKS WHOSE TURN IS WHOSE');

ok('§6.1 outbound is named Mira, inbound is named Them',
  /outbound \? 'Mira' : 'Them'/.test(C));
ok('§6.2 the name comes from the persona\'s own vocabulary, not "bot" or "system"',
  !/'system'\s*:\s*'/.test(C) && /'Mira'/.test(C));
// RE-PINNED BY LABEL (CE-47 note 1): "chat" is the plain word.
ok('§6.3 an empty thread is an invitation, not a blank',
  /The chat starts when they reply to the opener/.test(C));
ok('§6.4 message bodies render whitespace as sent — a WhatsApp message is shaped',
  /whiteSpace: 'pre-wrap'/.test(C));

// ═════════════════════════════════════════════════════════════════════════════
H('§7 · THE SCREEN IS REACHABLE');

// LABELED AMENDMENT (ADM-1): registered as "Vendors, being reached", a daily page under Vendors.
ok('§7.1 it is registered in the admin nav, under Growth',
  /label:\s*'Vendors, being reached',\s*path:\s*'\/admin\/prospects'/.test(code(NAV)));

okMutate('§M.4 a screen nobody can navigate to is a screen nobody uses',
  NAV,
  "  { label: 'Vendors, being reached',  path: '/admin/prospects',  icon: 'vendors',  hints: ['prospects', 'openers', 'outreach'] },\n",
  '',
  () => assert.ok(/path:\s*'\/admin\/prospects'/.test(code(NAV).slice(0, code(NAV).indexOf('ROUTE_MAP')))),
  '§7.1');

// ═════════════════════════════════════════════════════════════════════════════
H('§8 · THE PASTE PARSER — one per line, either order');

ok('§8.1 blank lines are dropped rather than sent as empty rows',
  /\.map\(l => l\.trim\(\)\)\.filter\(Boolean\)/.test(C));
// ── LABELED AMENDMENT · COUNT PRESERVED (F-08.83 limb 2) ───────────────────
// The parser was a two-field guess. It is now POSITIONAL across five columns,
// with the two-field swap kept as a forgiving fallback for what a person
// actually types. The cell asserts both halves rather than the old expression.
ok('§8.2 two fields still swap by digit count — `Kanupriya, 91…` is what a person types',
  /p\.length === 2 && digits\(p\[1\]\) > digits\(p\[0\]\)/.test(C));
ok('§8.2b beyond two fields the order IS the order — a screen guessing across five columns invents data',
  /ig_handle: p\[2\] \|\| null/.test(C) && /city:\s*p\[4\] \|\| null/.test(C));
ok('§8.3 per-row results are rendered, because on this door a refusal IS the row that mattered',
  /setPasteResult\(lines\)/.test(C)
  && /\(r\.refused\s*\|\|\s*\[\]\)/.test(C));

// ═════════════════════════════════════════════════════════════════════════════
H('§9 · F-08.83 LIMB 2 — THE FORM ASKS FOR WHAT THE SOUL WAS BUILT AROUND');

ok('§9.1 the three fields the API has taken since Block 05 are finally rendered',
  /label="Instagram \(optional\)"/.test(C)
  && /label="Trade \(optional\)"/.test(C)
  && /label="City \(optional\)"/.test(C));
ok('§9.2 and they reach the wire — the form is not decoration',
  /ig_handle: igHandle \|\| null/.test(C)
  && /category: category \|\| null/.test(C)
  && /city: city \|\| null/.test(C));
ok('§9.3 they clear on a successful add, so the next row starts empty',
  /setIgHandle\(''\); setCategory\(''\); setCity\(''\)/.test(C));
ok('§9.4 the paste placeholder teaches the five-column order',
  /phone, name, instagram, trade, city/.test(C));

ok('§9.5 THE BOARD SHOWS THE GAP — a bare row says so in words',
  /Mira has nothing of theirs to work with/.test(C));
ok('§9.6 and shows what it has when it has it, never a placeholder dash',
  /\[p\.ig_handle, p\.category, p\.city\]\.filter\(Boolean\)\.join/.test(C));

okMutate('§M.5 a form that collects the fields but does not send them is decoration',
  PAGE,
  'ig_handle: igHandle || null,',
  '',
  () => assert.ok(/ig_handle: igHandle \|\| null/.test(code(PAGE))),
  '§9.2');

okMutate('§M.6 a bare row that LOOKS full hides the thing the founder needs to see',
  PAGE,
  'No Instagram, trade or city yet. Mira has nothing of theirs to work with.',   // RE-PINNED BY LABEL (CE-47 note 1)
  '',
  () => assert.ok(/Mira has nothing of theirs to work with/.test(code(PAGE))),
  '§9.5');

console.log(`\n${'═'.repeat(60)}`);
console.log(`tdw08_p5_prospects_console: ${pass} passed, ${fail} failed`);
console.log(`${'═'.repeat(60)}`);
process.exit(fail ? 1 : 0);
