#!/usr/bin/env node
// scripts/tdw41_c3_switchboard_copy.proof.mjs — CE-41 · SEAT C · C3: THE SWITCHBOARD'S WORDS (F-41.52, F-41.53).
//
//   node scripts/tdw41_c3_switchboard_copy.proof.mjs            the cells
//   node scripts/tdw41_c3_switchboard_copy.proof.mjs --mutate   each mutation must RED its named cell
//
// Textual cells read comment-stripped source (R-40.105). The behavioural cells
// transpile the one home with `typescript` and drive it — a sentence is a
// sentence only if the function hands it back.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOT = process.env.C3_ROOT ? path.resolve(process.env.C3_ROOT) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1 ');
const HOME = 'lib/admin-api/switchboardCopy.ts';
const PAGE = 'app/admin/switchboard/page.tsx';
const PAL  = 'app/admin/_components/CommandPalette.tsx';

let pass = 0, fail = 0; const fails = [];
const ok = (name, cond, why) => { if (cond) { pass++; console.log(`  ok   ${name}`); } else { fail++; fails.push(name); console.log(`  FAIL ${name}${why ? ' — ' + why : ''}`); } };

function loadHome(src) {
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', js)(m, m.exports); return m.exports;
}

function run(root) {
  const R = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
  const c = loadHome(R(HOME));
  const page = strip(R(PAGE)), pal = strip(R(PAL)), home = strip(R(HOME));
  console.log('\n§1 · one home');
  ok('the words live in lib/admin-api/switchboardCopy.ts and nowhere else: the page has no NAMES map', !/const NAMES\s*[:=]/.test(page));
  ok('the page reads gateSentence from the one home', /gateSentence/.test(page) && /switchboardCopy/.test(page));
  ok('the palette reads GATE_KEYS / gateMatches / gatePath from the one home', /GATE_KEYS/.test(pal) && /gateMatches/.test(pal) && /gatePath/.test(pal));
  console.log('\n§2 · every gate is one sentence naming recipient, line, effect');
  ok('32 keys, the 0149 seed set', c.GATE_KEYS.length === 32, `got ${c.GATE_KEYS.length}`);
  ok('every sentence carries the dash that separates the act from recipient/line/effect', c.GATE_KEYS.every(k => /—/.test(c.gateSentence(k))));
  ok('every send gate names a line', c.GATE_KEYS.filter(k => /^(flag\.(?!wedding_reel)|template\.)/.test(k)).every(k => /(vendor line|couple line|marketing line)/.test(c.gateSentence(k))));
  ok('every send gate names its Meta category', c.GATE_KEYS.filter(k => /^(flag\.(?!wedding_reel)|template\.)/.test(k)).every(k => /(Utility|Marketing|Authentication)/.test(c.gateSentence(k))));
  ok('no register grammar leaks into a sentence (no underscore, no dotted key)', c.GATE_KEYS.every(k => !/[_]|\b(flag|perm|scope|template)\./.test(c.gateSentence(k))));
  ok('no persona name on the glass', c.GATE_KEYS.every(k => !/victor|harvey|donna|eliza/i.test(c.gateSentence(k))));
  console.log('\n§3 · the two outside rows are unmistakable (F-41.52)');
  const a = c.gateSentence('template.tdw_assist_lead_outside'), b = c.gateSentence('template.tdw_assist_found_outside');
  ok('lead_outside speaks to the OUTSIDE vendor on the marketing line (assistance.js:78, R-41.13, c-41.22)', /to the outside vendor/.test(a) && /marketing line/.test(a) && /Marketing/.test(a));
  ok('found_outside speaks to the COUPLE on the couple line', /to the couple/.test(b) && /couple line/.test(b) && /Utility/.test(b));
  ok('the two sentences share no recipient and are not the same string', a !== b && !/to the couple/.test(a) && !/outside vendor,/.test(b));
  ok('found_vendor and found_outside differ by the vendor\'s origin, in words', /vendor from The Dream Wedding/.test(c.gateSentence('template.tdw_assist_found_vendor')) && /outside The Dream Wedding/.test(b));
  ok('each "records only until" names who wakes it', c.GATE_KEYS.filter(k => /records only until/.test(c.gateSentence(k))).every(k => /until (A10|seat [A-Z]|R9) wakes/.test(c.gateSentence(k))));
  ok('the lane words are the three ruled ones, never possessive, never a number, never a persona', c.GATE_KEYS.every(k => !/couple's line|TDW's own number|Mira|own number/.test(c.gateSentence(k))));
  ok('the platform is written in full on the glass', c.GATE_KEYS.every(k => !/(^|[^e] )Dream Wedding/.test(c.gateSentence(k))));
  console.log('\n§4 · the palette matches any word, the key, the Meta name — and jumps to the row (F-41.53)');
  ok('a word of the sentence matches', c.gateMatches('flag.payment_reminder_send', 'client') && c.gateMatches('flag.contract_sign_send', 'sign'));
  ok('a word prefix matches', c.gateMatches('flag.referral_alert_send', 'refer'));
  ok('the register key matches', c.gateMatches('flag.review_ask_send', 'review_ask_send') && c.gateMatches('perm.ads_read', 'perm.ads'));
  ok('the Meta template name matches on a flag that guards it', c.gateMatches('flag.review_ask_send', 'tdw_review_request'));
  ok('the Meta template name matches on the template row', c.gateMatches('template.tdw_assist_found_vendor', 'tdw_assist_found_vendor'));
  ok('an unrelated word does not match', !c.gateMatches('flag.wedding_reel', 'instagram') && !c.gateMatches('scope.google.siteverification', 'reminder'));
  ok('the jump path anchors on the key', c.gatePath('flag.wedding_reel') === '/admin/switchboard#flag.wedding_reel');
  ok('the palette builds gate rows into the ONE rows array (not a second list)', /gateRows/.test(pal) && /\[\.\.\.recentRows, \.\.\.staticRows, \.\.\.gateRows, \.\.\.serverRows\]/.test(pal));
  ok('the page lands on the hash: data-gate anchor + hashchange listener + scrollIntoView', /data-gate=\{row\.key\}/.test(page) && /addEventListener\('hashchange'/.test(page) && /scrollIntoView/.test(page));
  ok('the landing lights the row and lets it go', /setLit\(key\)/.test(page) && /setLit\(k => \(k === key \? null : k\)\)/.test(page));
  console.log('\n§5 · the census still holds');
  ok('the card prints the register key beneath the sentence (the log\'s word, kept)', /\{row\.key\}/.test(page));
}

function mutate() {
  const MUT = [
    ['M1 the outside pair collapse to one sentence', HOME, "'Tell the couple we found her a vendor from outside The Dream Wedding — to the couple, couple line, Utility; records only until seat D wakes the send.'", "'Send the outsider her join alert — to the outside vendor, marketing line, Marketing; records only until A10 wakes the send.'", 'the two sentences share no recipient'],
    ['M2 the meta name stops matching', HOME, "if (c?.meta && c.meta.toLowerCase().includes(n)) return true;", "", 'Meta template name matches on a flag'],
    ['M3 the key stops matching', HOME, "if (key.toLowerCase().includes(n)) return true;", "", 'the register key matches'],
    ['M4 a sentence loses its line', HOME, "'Send the client her payment reminder — to the client, couple line, Utility.'", "'Send the client her payment reminder — to the client, Utility.'", 'every send gate names a line'],
    ['M8 a possessive lane word returns', HOME, "'Ask the couple for a Google review — to the couple, couple line, Marketing.'", "'Ask the couple for a Google review — to the couple, couple\\'s line, Marketing.'", 'never possessive'],
    ['M5 the page grows a second words home', PAGE, "function nameFor(key: string) { return gateSentence(key); }", "const NAMES: Record<string,string> = {}; function nameFor(key: string) { return NAMES[key] || gateSentence(key); }", 'no NAMES map'],
    ['M6 the palette drops the gate rows', PAL, "[...recentRows, ...staticRows, ...gateRows, ...serverRows]", "[...recentRows, ...staticRows, ...serverRows]", 'ONE rows array'],
    ['M7 the landing forgets to listen', PAGE, "window.addEventListener('hashchange', land);", "", 'lands on the hash'],
  ];
  let bad = 0;
  for (const [id, file, from, to, cellFrag] of MUT) {
    const scratch = fs.mkdtempSync('/tmp/c3m-');
    for (const rel of [HOME, PAGE, PAL]) { fs.mkdirSync(path.join(scratch, path.dirname(rel)), { recursive: true }); fs.copyFileSync(path.join(ROOT, rel), path.join(scratch, rel)); }
    const p = path.join(scratch, file); const s = fs.readFileSync(p, 'utf8');
    const n = s.split(from).length - 1;
    if (n !== 1) { console.log(`  ??     ${id} — target matched ${n} times`); bad++; continue; }
    fs.writeFileSync(p, s.replace(from, to));
    const out = []; const log = console.log; console.log = (l) => out.push(String(l));
    try { run(scratch); } catch (e) { out.push('CRASH ' + e.message); }
    console.log = log;
    const red = out.filter(l => l.startsWith('  FAIL') && l.includes(cellFrag));
    if (red.length) console.log(`  RED-OK ${id} → ${red[0].trim().slice(0, 90)}`); else { console.log(`  HOLLOW ${id}`); bad++; }
    fs.rmSync(scratch, { recursive: true, force: true });
  }
  console.log(`\n${MUT.length - bad}/${MUT.length} mutations RED as named`);
  return bad;
}

if (process.argv.includes('--mutate')) {
  process.exit(mutate() ? 1 : 0);
} else {
  run(ROOT);
  console.log(`\n  tdw41_c3_switchboard_copy  ${pass}/${pass + fail}`);
  if (fail) console.log('  FAILED: ' + fails.join(' · '));
  process.exit(fail ? 1 : 0);
}
