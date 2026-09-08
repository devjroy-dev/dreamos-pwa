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
  ok('the page reads gateName + gateSpec from the one home', /gateName/.test(page) && /gateSpec/.test(page) && /switchboardCopy/.test(page));
  ok('the palette reads GATE_KEYS / gateMatches / gatePath from the one home', /GATE_KEYS/.test(pal) && /gateMatches/.test(pal) && /gatePath/.test(pal));
  console.log('\n§2 · every gate is TWO LINES: a short name and a dotted spec (F-41.57)');
  ok('32 keys, the 0149 seed set', c.GATE_KEYS.length === 32, `got ${c.GATE_KEYS.length}`);
  ok('every gate has a name and a spec, and they are different strings', c.GATE_KEYS.every(k => c.gateName(k) && c.gateSpec(k) && c.gateName(k) !== c.gateSpec(k)));
  ok('the name is short enough for one line on a 374 row (<= 52 chars)', c.GATE_KEYS.every(k => c.gateName(k).length <= 52), c.GATE_KEYS.filter(k => c.gateName(k).length > 52).join(', '));
  ok('the spec is dotted, in the estate\'s idiom — never a clause chain', c.GATE_KEYS.every(k => c.gateSpec(k).includes(' · ') && !/;/.test(c.gateSpec(k))));
  ok('no gate reads as prose: the name carries no semicolon and no dash-clause', c.GATE_KEYS.every(k => !/;/.test(c.gateName(k))));
  ok('gateSentence still joins both, for the palette and one-line surfaces', c.gateSentence('flag.review_ask_send') === 'Google review ask — to the couple · couple line · Marketing');
  ok('every send gate names a line', c.GATE_KEYS.filter(k => /^(flag\.(?!wedding_reel)|template\.)/.test(k)).every(k => /(vendor line|couple line|marketing line)/.test(c.gateSpec(k))));
  ok('every send gate names its Meta category', c.GATE_KEYS.filter(k => /^(flag\.(?!wedding_reel)|template\.)/.test(k)).every(k => /(Utility|Marketing|Authentication)/.test(c.gateSpec(k))));
  ok('no register grammar leaks into a sentence (no underscore, no dotted key)', c.GATE_KEYS.every(k => !/[_]|\b(flag|perm|scope|template)\./.test(c.gateSentence(k))));
  ok('no persona name on the glass', c.GATE_KEYS.every(k => !/victor|harvey|donna|eliza/i.test(c.gateSentence(k))));
  console.log('\n§3 · the two outside rows are unmistakable (F-41.52)');
  const a = c.gateSentence('template.tdw_assist_lead_outside'), b = c.gateSentence('template.tdw_assist_found_outside');
  ok('lead_outside speaks to the OUTSIDE vendor on the marketing line (assistance.js:78, R-41.13, c-41.22)', /to the outside vendor/.test(a) && /marketing line/.test(a) && /Marketing/.test(a));
  ok('found_outside speaks to the COUPLE on the couple line', /to the couple/.test(b) && /couple line/.test(b) && /Utility/.test(b));
  ok('their NAMES alone tell them apart on the row', c.gateName('template.tdw_assist_lead_outside') !== c.gateName('template.tdw_assist_found_outside') && /Outsider/.test(c.gateName('template.tdw_assist_lead_outside')) && /outside The Dream Wedding/.test(c.gateName('template.tdw_assist_found_outside')));
  ok('the two sentences share no recipient and are not the same string', a !== b && !/to the couple/.test(a) && !/outside vendor,/.test(b));
  ok('found_vendor and found_outside differ by the vendor\'s origin, in words', /vendor from The Dream Wedding/.test(c.gateSentence('template.tdw_assist_found_vendor')) && /outside The Dream Wedding/.test(b));
  ok('each dark gate names who wakes it', c.GATE_KEYS.filter(k => /dark until|not sent before/.test(c.gateSpec(k))).every(k => /(A10|seat [A-Z]|R9)/.test(c.gateSpec(k))));
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
  // ── F-41.56 · THE CELL THIS PROOF DID NOT HAVE ─────────────────────────────
  // The old cell asserted the LISTENER exists. It never asserted that a jump
  // from the Switchboard itself REACHES it — and it does not, because
  // `router.push` is `history.pushState` and pushState fires no `hashchange`.
  // R-40.94's class, in my own proof. These two drive the real function.
  ok('the jump does not push when the target is the page we are on: it moves the hash', /window\.location\.pathname === pathname/.test(pal) && /window\.location\.hash = hash/.test(pal));
  ok('a same-path jump to the hash we already carry still fires hashchange', /dispatchEvent\(new HashChangeEvent\('hashchange'\)\)/.test(pal));
  {
    // Drive `jump`'s branch as the browser would: extract it, stub the world,
    // and assert the event reaches a listener — the thing the founder walked.
    const body = pal.slice(pal.indexOf('const jump = useCallback'), pal.indexOf('}, [onClose, router]);'));
    const src = 'export function jump(row, window, router, recordJump, onClose) {' + body.slice(body.indexOf('{') + 1) + '}';
    let fired = 0, pushed = 0, hash = '';
    const win = { location: { pathname: '/admin/switchboard', get hash() { return hash; }, set hash(v) { const n = v.startsWith('#') ? v : '#' + v; if (n !== hash) { hash = n; fired++; } } },
                  dispatchEvent: () => { fired++; }, HashChangeEvent: class {} };
    let ranSame = false, ranOther = false;
    try {
      const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
        .replace(/typeof window !== 'undefined'/g, 'true').replace(/new HashChangeEvent\('hashchange'\)/g, '{}');
      const m = { exports: {} }; new Function('module', 'exports', js)(m, m.exports);
      m.exports.jump({ label: 'x', path: '/admin/switchboard#template.tdw_assist_lead_outside' }, win, { push: () => { pushed++; } }, () => {}, () => {});
      ranSame = fired === 1 && pushed === 0;
      m.exports.jump({ label: 'x', path: '/admin/config' }, win, { push: () => { pushed++; } }, () => {}, () => {});
      ranOther = pushed === 1;
    } catch (e) { fails.push('jump drive: ' + e.message); }
    ok('driven: a same-path hash jump fires the event and does NOT push', ranSame);
    ok('driven: a different-path jump still goes through the router', ranOther);
  }
  ok('the landing lights the row and lets it go', /setLit\(key\)/.test(page) && /setLit\(k => \(k === key \? null : k\)\)/.test(page));
  console.log('\n§5 · the census still holds');
  ok('the page prints both lines: the bold name and the dotted spec', /nameFor\(row\.key\)/.test(page) && /\{gateSpec\(row\.key\)\}/.test(page));
  ok('the card prints the register key beneath (the log\'s word, kept)', /\{row\.key\}/.test(page));
}

function mutate() {
  const MUT = [
    ['M1 the outside pair collapse to one name', HOME, "name: 'Found her a vendor from outside The Dream Wedding'", "name: 'Outsider join alert'", 'NAMES alone tell them apart'],
    ['M2 the meta name stops matching', HOME, "if (c?.meta && c.meta.toLowerCase().includes(n)) return true;", "", 'Meta template name matches on a flag'],
    ['M3 the key stops matching', HOME, "if (key.toLowerCase().includes(n)) return true;", "", 'the register key matches'],
    ['M4 a spec loses its line', HOME, "name: 'Payment reminder', spec: 'to the client · couple line · Utility'", "name: 'Payment reminder', spec: 'to the client · Utility'", 'every send gate names a line'],
    ['M8 a possessive lane word returns', HOME, "name: 'Google review ask', spec: 'to the couple · couple line · Marketing'", "name: 'Google review ask', spec: 'to the couple · couple\\'s line · Marketing'", 'never possessive'],
    ['M9 the prose returns: the spec becomes a clause chain', HOME, "spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_referral_alert' },\n  'flag.wedding_credit_send'", "spec: 'to the peer vendor, vendor line; Utility', meta: 'tdw_referral_alert' },\n  'flag.wedding_credit_send'", 'dotted, in the estate'],
    ['M10 the same-path branch is dropped (F-41.56 returns)', PAL, "if (hash && typeof window !== 'undefined' && window.location.pathname === pathname) {", "if (false) {", 'driven: a same-path hash jump'],
    ['M11 the same-hash re-jump stops firing', PAL, "if (window.location.hash === `#${hash}`) window.dispatchEvent(new HashChangeEvent('hashchange'));\n      else window.location.hash = hash;", "window.location.hash = hash;", 'still fires hashchange'],
    ['M12 the card drops the second line', PAGE, "{gateSpec(row.key)}", "{''}", 'the page prints both lines'],
    ['M5 the page grows a second words home', PAGE, "function nameFor(key: string) { return gateName(key); }", "const NAMES: Record<string,string> = {}; function nameFor(key: string) { return NAMES[key] || gateName(key); }", 'no NAMES map'],
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
