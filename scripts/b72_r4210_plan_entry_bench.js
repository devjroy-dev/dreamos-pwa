#!/usr/bin/env node
'use strict';
// scripts/b72_r4210_plan_entry_bench.js
// CE-42 · R-42.10 — THE /plan ENTRY LINK ON THE LANDING (pwa).
//
// ⚠ RENUMBERED b70 -> b72 AT RELEASE, AND THE COLLISION IS THE REASON. Seat E3
// derived rung 70 by `ls` across both repos and it was free AT THAT MOMENT; two
// R8 packets took 70 and 71 while this one sat held. The rung is a property of
// the tree at the cut, not of the packet, so a held packet's number is a claim
// with a shelf life — re-derived here by `ls` at f538d984, where 70 and 71 are
// b70_r8_pulse_glass and b71_r8_meta_placeholder and the first free rung is 72.
// Nothing else about this bench changed with the number.
//
// ⚠ IT WAS HELD, AND THE CONDITION HAS ARRIVED. `/plan` landed at f538d984 and
// was walked green, so the link this bench guards points at a live route. Every
// cell here also passed while `/plan` still 404'd, and DELIBERATELY SO: no cell
// asserts the route's absence, because such a cell would have reddened the day
// s2 landed — a bench that breaks when the thing it waits for arrives is a bench
// pointed backwards.
//
// ⚠ AND NO ANGLE-BRACKETED ELEMENT NAME APPEARS IN THIS FILE'S PROSE. `b20_a4`'s
// census reads raw text and does not strip comments; this bench reads the same
// file and inherits the same hazard.

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P    = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const LAND  = 'app/(landing)/page.tsx';
const PROOF = 'scripts/tdw09_landing.proof.mjs';

let pass = 0, fail = 0;
const ok = (n, c, d) => {
  if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (d ? '  \u2192 ' + d : '')); }
};
const sec = (t) => console.log('\n' + t);

// ── C1 · THE BYTE, VETOED 2026-09-10 ────────────────────────────────────────
sec('C1 \u00b7 the vetoed byte');
{
  const src = read(LAND);
  ok('the sentence is on file verbatim', src.includes('Not ready to sign up?'));
  ok('the verb is on file verbatim', src.includes('Tell us what you need'));
  // U+2192, and it is written as its entity because this file spells its
  // typography that way (`I&apos;m` on both doors).
  ok('the arrow is U+2192', /Tell us what you need &#8594;<\/a>/.test(src));
  // ⚠ THIS CELL DOES NOT POLICE APOSTROPHES, AND ITS FIRST CUT DID. It read
  // `!/Not ready to sign up[^<]*'/` and went RED on correct code, because the
  // straight quotes it found were the JSX separator `{' '}` — the same idiom the
  // Sign-up line one paragraph above has always used. Prose bytes and syntax are
  // two different things, and `b40` C102 already owns the prose rule across this
  // whole tree. What is worth asserting here is PARITY of the idiom.
  ok('the separator is the Sign-up line\u2019s own idiom',
    /New here\?\{' '\}/.test(src) && /Not ready to sign up\?\{' '\}/.test(src));
}

// ── C2 · §8.1's DEATH ROSTER IS WHOLE, AND THE BYTE CLEARS IT ───────────────
// The first veto was `Planning a wedding`, which is entry 11 of the roster that
// records what TDW_09 killed. It was RE-VETOED rather than struck, so this cell
// reads the roster from its own home and re-runs it against the new line — the
// check that caught it, kept, pointed at the replacement.
sec('C2 \u00b7 the roster is intact and the new line clears all of it');
{
  const proof = read(PROOF);
  const m = proof.match(/const ROSTER\s*=\s*\[([\s\S]*?)\];/);
  const roster = m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
  ok('the roster is declared and is not empty', roster.length > 0, String(roster.length));
  ok('`Planning a wedding` is STILL ON IT \u2014 re-vetoed, not struck',
    roster.includes('Planning a wedding'));
  const code = strip(read(LAND));
  const survives = (s) => new RegExp(
    `(^|[^A-Za-z])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`).test(code);
  const survivors = roster.filter(survives);
  ok('no roster byte survives on this surface', survivors.length === 0, survivors.join(' | '));
}

// ── C3 · PARITY BY CONSTRUCTION, NOT BY COMPARISON ──────────────────────────
// THE CHAIR'S CELL. The rule is that the two lines differ only in their words,
// and the strongest form of that is not two style blocks compared by a bench —
// it is ONE object named twice. A comparison can pass on a Tuesday and drift on
// a Wednesday; a shared identifier cannot drift at all.
sec('C3 \u00b7 the two lines share one style object');
{
  const src = strip(read(LAND));
  ok('ENTRY_LINE is declared once', (src.match(/const ENTRY_LINE:/g) || []).length === 1);
  ok('ENTRY_LINE_VERB is declared once', (src.match(/const ENTRY_LINE_VERB:/g) || []).length === 1);
  ok('the sentence style is named exactly twice \u2014 Sign up and /plan',
    (src.match(/style=\{ENTRY_LINE\}/g) || []).length === 2,
    String((src.match(/style=\{ENTRY_LINE\}/g) || []).length));
  ok('the verb style is named exactly twice',
    (src.match(/style=\{ENTRY_LINE_VERB\}/g) || []).length === 2,
    String((src.match(/style=\{ENTRY_LINE_VERB\}/g) || []).length));
  // The values, at their one home. margin-top 16 is founder-ruled and is the
  // Sign-up line's own — this is the number that was almost 14.
  ok('margin-top is 16, the Sign-up line\u2019s own', /margin: '16px 0 0'/.test(src));
  ok('the sentence ink and type are unchanged',
    /fontWeight: 300, fontSize: 13/.test(src) && /rgba\(248,247,245,0\.5\)/.test(src));
  ok('the verb ink and weight are unchanged',
    /fontWeight: 400, fontSize: 13/.test(src) && /color: '#C9A84C'/.test(src));
  // ⚠ AND NEITHER LINE CARRIES A LOCAL OVERRIDE. A shared object plus a spread
  // that re-styles one of them is the drift this cell exists to forbid, wearing
  // the shape of compliance.
  ok('neither line spreads the shared object to override it',
    !/\{\s*\.\.\.ENTRY_LINE/.test(src));
}

// ── C4 · SEAT A, AND IT IS A LINK ───────────────────────────────────────────
sec('C4 \u00b7 placement and shape');
{
  const src = strip(read(LAND));
  const iVendor = src.indexOf('I&apos;m a wedding vendor');
  const iSignup = src.indexOf('>Sign up<');
  const iPlan   = src.indexOf('Not ready to sign up?');
  const iLegal  = src.indexOf('thedreamwedding.in/privacy');
  ok('the door comes first', iVendor > -1 && iSignup > iVendor);
  ok('the new line sits BELOW Sign up (seat A)', iPlan > iSignup, iSignup + ' vs ' + iPlan);
  ok('and ABOVE the legal row', iPlan < iLegal, iPlan + ' vs ' + iLegal);
  ok('it addresses /plan', /href="\/plan"/.test(src));
  ok('it is a real href, not a router push',
    !/onClick=\{\(\) => router\.push\('\/plan'\)\}/.test(src));
  // A link, not a third door — the whole reason method A never had to open.
  ok('no third door was minted', (src.match(/setScreen\('chooser'\)/g) || []).length === 1);
}

// ── C5 · THE CENSUS MOVED ON ANCHORS ALONE ──────────────────────────────────
sec('C5 \u00b7 30 -> 31, and method A untouched');
{
  const raw = read(LAND);
  const count = (re) => (raw.match(re) || []).length;
  const opens = count(/<button/g), closes = count(/<\/button>/g);
  const inputs = count(/<input/g), anchors = count(/<a /g);
  const backs = count(/<BackBtn/g), golds = count(/<GoldBtn/g);
  ok('the button pair is 17/17, unmoved', opens === 17 && closes === 17, `${opens}/${closes}`);
  ok('anchors moved 2 -> 3', anchors === 3, String(anchors));
  ok('the census totals 31', opens + inputs + anchors + backs + golds === 31,
    `button ${opens} \u00b7 input ${inputs} \u00b7 a ${anchors} \u00b7 BackBtn ${backs} \u00b7 GoldBtn ${golds}`);
  // b20_a4 is the census's own home and it was amended by label in this packet.
  const a4 = read('scripts/b20_a4_otpsignup_pwa.proof.mjs');
  ok('b20_a4 was amended by label, not loosened', /=== 31/.test(a4) && !/>= 30/.test(a4));
  ok('and it pins the delta to anchors alone', /anchors === 3 && opens === 17/.test(a4));
}

if (process.argv.includes('--mutate')) {
  sec('MUTATIONS \u2014 each must turn the cells RED');
  const MUT = [
    [LAND, 'the new line grows its own style block \u2014 parity by copy, not by construction',
      '<p style={ENTRY_LINE}>\n                  Not ready to sign up?',
      "<p style={{ fontFamily: \"'DM Sans', sans-serif\", fontWeight: 300, fontSize: 13, color: 'rgba(248,247,245,0.5)', textAlign: 'center', margin: '16px 0 0', lineHeight: 1.5 }}>\n                  Not ready to sign up?"],

    [LAND, 'the shared object is spread and overridden \u2014 compliance in shape only',
      '<a href="/plan" style={ENTRY_LINE_VERB}>',
      '<a href="/plan" style={{ ...ENTRY_LINE_VERB, fontWeight: 300 }}>'],

    [LAND, 'the ruled margin becomes 14 again',
      "margin: '16px 0 0', lineHeight: 1.5,\n};",
      "margin: '14px 0 0', lineHeight: 1.5,\n};"],

    [LAND, 'the line moves to seat B, above Sign up',
      '                <p style={ENTRY_LINE}>\n                  New here?',
      '                <p style={ENTRY_LINE}>\n                  Not ready to sign up?{\' \'}\n                  <a href="/plan" style={ENTRY_LINE_VERB}>Tell us what you need &#8594;</a>\n                </p>\n                <p style={ENTRY_LINE}>\n                  New here?'],

    [LAND, 'the killed byte comes back \u2014 roster entry 11 returns',
      'Not ready to sign up?{\' \'}',
      'Planning a wedding?{\' \'}'],

    [LAND, 'the link becomes a third door',
      '<a href="/plan" style={ENTRY_LINE_VERB}>Tell us what you need &#8594;</a>',
      '<button onClick={() => setScreen(\'chooser\')} style={ENTRY_LINE_VERB}>Tell us what you need &#8594;</button>'],

    [LAND, 'the arrow is dropped',
      'Tell us what you need &#8594;</a>',
      'Tell us what you need</a>'],

    ['scripts/b20_a4_otpsignup_pwa.proof.mjs', 'the census is LOOSENED instead of named',
      'opens + inputs + anchors + backs + golds === 31',
      'opens + inputs + anchors + backs + golds >= 30'],
  ];
  for (const [rel, name, from, to] of MUT) {
    const abs = P(rel);
    const before = fs.readFileSync(abs);
    const txt = before.toString('utf8');
    if (!txt.includes(from)) { ok(name, false, 'mutation site absent \u2014 the code moved'); continue; }
    fs.writeFileSync(abs, txt.replace(from, to));
    const r = spawnSync(process.execPath, [__filename, '--cells-only'], { encoding: 'utf8' });
    fs.writeFileSync(abs, before);
    ok(name + ' \u2192 RED', r.status !== 0, 'exit ' + r.status);
    ok(name + ' \u2192 restored byte-for-byte', Buffer.compare(before, fs.readFileSync(abs)) === 0);
  }
}

console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' \u2014 b72 r4210 plan entry (pwa) ' +
  pass + '/' + (pass + fail));
process.exit(fail === 0 ? 0 : 1);
