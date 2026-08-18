#!/usr/bin/env node
// scripts/tdw_m_bridename_gate.proof.mjs — M-BRIDE-NAME · ZIP 2 (dreamos-pwa)
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url, never cwd).
//
// WHAT THIS PROVES, and why it is not a grep. Both cures on this screen are
// BOOLEAN EXPRESSIONS, and an expression is not proven by matching its text —
// two spellings can read alike and decide differently, which is exactly how
// `!isVendor && !pinSet && !d.name` sat here for months looking like a name
// check while never once consulting a name.
//
// So this bench EXTRACTS each expression from the shipped source and EVALUATES
// it as a real function across a truth table. The cells assert what the screen
// DECIDES, not what it says. A rewrite that preserves the decisions passes; a
// rewrite that preserves the wording and breaks the decisions fails.
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup —
// asserts the cell goes RED at the broken tree, restores the file, and asserts
// byte-identity. Every anchor is asserted to appear EXACTLY ONCE (CE-127).
//
// THE COMMENT-BLINDNESS LAW BINDS HERE TOO, and hard: both cures ship with long
// comments that QUOTE THE OLD BROKEN EXPRESSIONS in order to explain what was
// wrong with them. A raw grep for `!pinSet && !d.name` reds over a correctly
// cured tree, on the note recording its death. Extraction is done on stripped
// source for that reason.
//
// WHAT THIS BENCH DOES NOT ASSERT, named rather than silently absent:
//   · NO cell over rendered pixels, the disabled ATTRIBUTE reaching the DOM, or
//     GoldBtn's own handling of `disabled`. A container with no browser cannot
//     see them; the founder's walk is where a dead button is a dead button.
//   · NO cell over the server half. `/provision` returning `name` is dream-os's
//     and is proven there by `scripts/bOB_m_bridename_fill_bench.js`. THIS FILE
//     ASSUMES that key exists; if ZIP 1 were reverted, every cell here would
//     still pass and the screen would still be broken. That is the cross-repo
//     seam and it is declared, not hidden.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (s) => s
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

let pass = 0, fail = 0;
const H = (s) => console.log(`\n══ ${s} ══`);
function ok(name, cond, msg) {
  try { assert.ok(cond, msg || 'assertion failed'); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}
function okMutate(name, rel, anchor, replacement, predicate, label) {
  try { mutate(rel, anchor, replacement, predicate, label); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}
function mutate(rel, anchor, replacement, predicate, label) {
  const abs = path.join(ROOT, rel);
  const original = fs.readFileSync(abs, 'utf8');
  const hits = original.split(anchor).length - 1;
  assert.strictEqual(hits, 1, `anchor must appear EXACTLY ONCE in ${rel} (found ${hits})`);
  try {
    fs.writeFileSync(abs, original.replace(anchor, replacement), 'utf8');
    let red = false;
    try { predicate(); } catch { red = true; }
    assert.ok(red, `${label}: stayed GREEN over broken production code — it proves nothing`);
  } finally {
    fs.writeFileSync(abs, original, 'utf8');
    assert.strictEqual(fs.readFileSync(abs, 'utf8'), original, `${rel} not restored byte-identically`);
  }
}

const LANDING = 'app/(landing)/page.tsx';

// ── EXTRACTION ───────────────────────────────────────────────────────────────
// TEST SETUP, DISCLOSED (never production code). Both extractors read STRIPPED
// source and balance delimiters rather than matching to a closing character —
// `disabled={...}` contains nested braces, and a lazy `\{(.*?)\}` would cut the
// expression in half and then happily evaluate the fragment.
function gateExpr() {
  const s = code(LANDING);
  const key = 'label="Send code →"';
  const at = s.indexOf(key);
  assert.ok(at > -1, 'the Send-code button moved — this bench must move with it');
  const dAt = s.indexOf('disabled={', at);
  assert.ok(dAt > -1, 'the Send-code button has no disabled prop');
  let i = dAt + 'disabled={'.length, depth = 1;
  while (i < s.length && depth > 0) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') depth--;
    if (depth > 0) i++;
  }
  assert.strictEqual(depth, 0, 'unbalanced braces in the disabled prop');
  return s.slice(dAt + 'disabled={'.length, i).trim();
}
function routeExpr() {
  const s = code(LANDING);
  const key = 'const coupleNeedsOnboarding =';
  const at = s.indexOf(key);
  assert.ok(at > -1, 'the onboarding routing decision moved — this bench must move with it');
  const end = s.indexOf(';', at);
  return s.slice(at + key.length, end).trim();
}

// `disabled` is TRUE when the button is DEAD.
const isDisabled = (expr, { phone, joinName, role, joinCategory, maxDigits = 10 }) =>
  // eslint-disable-next-line no-new-func
  new Function('phone', 'country', 'joinName', 'role', 'joinCategory', `return (${expr});`)(
    phone, { maxDigits }, joinName, role, joinCategory);

// TRUE when the couple must be routed to the onboarding form.
const needsOnboarding = (expr, { isVendor, pinSet, name }) =>
  // eslint-disable-next-line no-new-func
  new Function('isVendor', 'pinSet', 'd', `return (${expr});`)(isVendor, pinSet, { name });

const FULL = '9888294440';   // ten digits — a valid Indian number's length
const SHORT = '98882';

// ═════════════════════════════════════════════════════════════════════════════
H('§0 · THE INSTRUMENT IS POINTED AT SOMETHING — no vacuous run');

ok('§0.1 the landing file was found and is substantial',
  code(LANDING).length > 10000, `landing source is ${code(LANDING).length} chars after stripping`);

ok('§0.2 the comment strip WORKS — both cures QUOTE the old broken expressions to explain them, '
 + 'so a raw grep would red on the explanation',
  /&& !d\.name/.test(read(LANDING)) && !/&& !d\.name/.test(code(LANDING)),
  'either the explanatory notes are gone, or the strip is not stripping — both make every cell below a lie');

ok('§0.3 both expressions extract and are non-trivial',
  gateExpr().length > 20 && routeExpr().length > 15,
  `gate="${gateExpr()}" route="${routeExpr()}"`);

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · THE GATE — the founder\'s word, BOTH ROLES (truth table over shipped bytes)');

const G = gateExpr();

ok('§1.1 BRIDE · full phone · name typed ⇒ the button LIVES',
  isDisabled(G, { phone: FULL, joinName: 'Meera', role: 'Dreamer', joinCategory: null }) === false,
  'the gate is refusing a complete bride — this would kill the funnel outright');

ok('§1.2 BRIDE · full phone · name EMPTY ⇒ the button is DEAD  [THE CURE]',
  isDisabled(G, { phone: FULL, joinName: '', role: 'Dreamer', joinCategory: null }) === true,
  'the unnamed bride can still open an account — the whole charge');

ok('§1.3 BRIDE · name is WHITESPACE ONLY ⇒ DEAD (a one-space name is not a name)',
  isDisabled(G, { phone: FULL, joinName: '   ', role: 'Dreamer', joinCategory: null }) === true,
  'the door and brideComplete now disagree about what a name is');

ok('§1.4 BRIDE · short phone · name typed ⇒ DEAD (the phone term is preserved)',
  isDisabled(G, { phone: SHORT, joinName: 'Meera', role: 'Dreamer', joinCategory: null }) === true);

ok('§1.5 MAKER · full phone · name typed · category chosen ⇒ LIVES',
  isDisabled(G, { phone: FULL, joinName: 'Ravi Studios', role: 'Maker', joinCategory: 'photographer' }) === false);

ok('§1.6 MAKER · category MISSING ⇒ DEAD (the vendor gate stands untouched beside the new one)',
  isDisabled(G, { phone: FULL, joinName: 'Ravi Studios', role: 'Maker', joinCategory: null }) === true,
  'the pre-existing category gate regressed');

ok('§1.7 MAKER · name EMPTY, category chosen ⇒ DEAD  [BOTH ROLES — the name term has NO role guard]',
  isDisabled(G, { phone: FULL, joinName: '', role: 'Maker', joinCategory: 'photographer' }) === true,
  'the name term grew a role guard; the founder ruled BOTH ROLES and a bride-only gate re-opens the hole one door over');

ok('§1.8 the gate is a THREE-term disjunction, not two',
  (G.match(/\|\|/g) || []).length === 2, `expected two || operators, expression is: ${G}`);

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · THE ROUTING — arm 3b [R-35.12] (truth table over shipped bytes)');

const R = routeExpr();

ok('§2.1 VENDOR ⇒ never routed to couple onboarding',
  needsOnboarding(R, { isVendor: true, pinSet: false, name: null }) === false);

ok('§2.2 COUPLE · pinless · NAMED ⇒ routed  [NO REGRESSION — this is today\'s behaviour, preserved]',
  needsOnboarding(R, { isVendor: false, pinSet: false, name: 'Meera' }) === true,
  'a named pinless bride stopped reaching the form — that is the 3a regression, refused by ruling');

ok('§2.3 COUPLE · pinless · nameless ⇒ routed',
  needsOnboarding(R, { isVendor: false, pinSet: false, name: null }) === true);

ok('§2.4 COUPLE · PINNED · NAMELESS ⇒ routed  [THE F-OB.14 CURE — she finally meets the form]',
  needsOnboarding(R, { isVendor: false, pinSet: true, name: null }) === true,
  'the returning nameless bride still short-circuits past the form at !pinSet — the exact case F-OB.14 was minted for');

ok('§2.5 COUPLE · pinned · named ⇒ NOT routed (a complete returning bride is not detoured)',
  needsOnboarding(R, { isVendor: false, pinSet: true, name: 'Meera' }) === false,
  'every returning bride is being sent to onboarding — that is a detour on a live funnel');

ok('§2.6 the shipped shape is a DISJUNCTION, and the old conjunction is gone',
  /\|\|/.test(R) && !/&&\s*!d\.name/.test(R), `routing expression is: ${R}`);

// ═════════════════════════════════════════════════════════════════════════════
H('§M · MUTATION — production source broken, the matching cell must go RED');

okMutate('§M.1 §1.2 reds if the name term is removed from the gate',
  LANDING, "disabled={phone.length < country.maxDigits || !joinName.trim() || (role === 'Maker' && !joinCategory)}",
  "disabled={phone.length < country.maxDigits || (role === 'Maker' && !joinCategory)}",
  () => assert.ok(isDisabled(gateExpr(), { phone: FULL, joinName: '', role: 'Dreamer', joinCategory: null }) === true),
  '§1.2');

okMutate('§M.2 §1.7 reds if the name term grows a role guard (bride-only)',
  LANDING, '|| !joinName.trim() ||',
  "|| (role === 'Dreamer' && !joinName.trim()) ||",
  () => assert.ok(isDisabled(gateExpr(), { phone: FULL, joinName: '', role: 'Maker', joinCategory: 'photographer' }) === true),
  '§1.7');

okMutate('§M.3 §1.3 reds if `.trim()` is dropped — a one-space name would pass the door',
  LANDING, 'maxDigits || !joinName.trim()', 'maxDigits || !joinName',
  () => assert.ok(isDisabled(gateExpr(), { phone: FULL, joinName: '   ', role: 'Dreamer', joinCategory: null }) === true),
  '§1.3');

okMutate('§M.4 §2.4 reds if the routing reverts to the old conjunction',
  LANDING, 'const coupleNeedsOnboarding = !isVendor && (!pinSet || !d.name);',
  'const coupleNeedsOnboarding = !isVendor && !pinSet && !d.name;',
  () => assert.ok(needsOnboarding(routeExpr(), { isVendor: false, pinSet: true, name: null }) === true),
  '§2.4');

okMutate('§M.5 §2.2 reds if the disjunction is narrowed to `&&` inside the parens — the 3a regression',
  LANDING, '(!pinSet || !d.name)', '(!pinSet && !d.name)',
  () => assert.ok(needsOnboarding(routeExpr(), { isVendor: false, pinSet: false, name: 'Meera' }) === true),
  '§2.2');

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — tdw_m_bridename_gate ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
