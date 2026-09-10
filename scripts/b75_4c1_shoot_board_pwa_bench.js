#!/usr/bin/env node
'use strict';
// scripts/b75_4c1_shoot_board_pwa_bench.js — CE-42 4c-1 · R7 G5.2 THE SHOOT BOARD (pwa half).
// Seat R7. Base dreamos-pwa 59b23451f7e32fc99c14e3b7240ee04db1d6aa02 (re-pinned from 85f6f3c1 after SHELL).
//
// NUMBERED b75, DERIVED ACROSS BOTH REPOS (b69's rule): pwa tails at b74 (R6 4b-1),
// dream-os at b73. (The dream-os half of this packet shipped as b4c1 — a name, not a
// ladder number; recorded as the seat's own slip, c- in the handover.)
//
// Cells read SHIPPED SOURCE, comments stripped; C4–C6 EXECUTE the shipped TS through
// the repo's own `typescript` (transpileModule), so a date or a label is asserted as
// output, never as a regex over its implementation. Cells marked ⇄ read the sibling
// dream-os tree and REFUSE (exit 3) if it is absent.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SIB = path.resolve(ROOT, '../dream-os');
if (!fs.existsSync(path.join(SIB, 'src/lib/vendor/collabKinds.js'))) {
  console.log('REFUSED — ../dream-os/src/lib/vendor/collabKinds.js not present; the ⇄ cells cannot see the doors.');
  process.exit(3);
}

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readSib = (p) => fs.readFileSync(path.join(SIB, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');

// ── a tiny loader for the repo's own TS (pure libs only) ─────────────────────
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const cache = new Map();
function loadTs(abs) {
  if (cache.has(abs)) return cache.get(abs).exports;
  const out = ts.transpileModule(fs.readFileSync(abs, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} }; cache.set(abs, mod);
  const req = (spec) => {
    let p = spec.startsWith('@/') ? path.join(ROOT, spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(abs), spec) : null;
    if (!p) return require(spec);
    for (const ext of ['', '.ts', '.tsx', '.js', '.mjs']) if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) { p = p + ext; break; }
    return /\.(ts|tsx)$/.test(p) ? loadTs(p) : require(p);
  };
  vm.runInThisContext(`(function(exports,require,module){${out}\n})`)(mod.exports, req, mod);
  return mod.exports;
}

let pass = 0; const reds = [];
function cell(name, fn) {
  let why; try { why = fn(); } catch (e) { why = 'threw: ' + e.message; }
  if (why) { reds.push(name); console.log(`  RED    ${name} — ${why}`); } else { pass++; console.log(`  GREEN  ${name}`); }
}

const form    = strip(read('components/vendor/CollabPostForm.tsx'));
const formRaw = read('components/vendor/CollabPostForm.tsx');
const block   = strip(read('components/vendor/ShootsBlock.tsx'));
const screen  = strip(read('app/vendor/(shell)/collab/screen.tsx'));
const room    = strip(read('app/vendor/(shell)/referrals/page.tsx'));
const routes  = read('lib/solutions/routes.ts');

// MUTATION → RED: in dream-os collab.js rename the route '/requirement-types'.
cell('C1 ⇄ the door the composer reads exists at the address routes.ts names', () => {
  if (!/COLLAB_API_PATH = '\/api\/v2\/vendor\/collab'/.test(routes)) return 'COLLAB_API_PATH moved';
  if (!/collabRequirementTypes:\s*\(\) => `\$\{COLLAB_API_PATH\}\/requirement-types`/.test(routes)) return 'routes.ts spells the door differently';
  if (!/router\.get\('\/requirement-types'/.test(readSib('src/api/vendor/collab.js'))) return 'dream-os serves no /requirement-types';
  if (!/router\.use\('\/collab',/.test(readSib('src/api/vendor/core.js'))) return 'dream-os mounts collab elsewhere';
});

// MUTATION → RED: restore `const REQUIREMENT_TYPES = ['photography','videography', …]` in collab/screen.tsx.
cell('C2 no requirement list is typed on either surface (F-42.184) — the demo page is F-42.189, fenced', () => {
  for (const [n, src] of [['collab/screen.tsx', screen], ['CollabPostForm.tsx', form], ['ShootsBlock.tsx', block]]) {
    if (/REQUIREMENT_TYPES|'videography'|'music_dj'|'attire'|'catering'/.test(src)) return `${n} still types a requirement list`;
  }
  if (!/API\.collabRequirementTypes\(\)/.test(form)) return 'the composer does not read the door';
  if (!/API\.collabRequirementTypes\(\)/.test(screen) || !/labelFor\(t\)/.test(screen)) return 'the roster sheet chips do not read the door + labels';
});

// MUTATION → RED: in CollabPostForm, offer `EVENT_TYPES` whole for kind=collab.
cell('C3 one form, two kinds: shoot offers ONLY the pair, collab offers the rest (rulings 2(a) + 3(ii))', () => {
  if (!/kind === 'shoot' \? shootTypes : EVENT_TYPES\.filter\(t => !shootTypes\.includes\(t\)\)/.test(form)) return 'the event-type split is not the door-driven filter';
  if (!/set\('event_type', t\)\}/.test(form)) return 'the shoot type is deselectable (ruling (ii))';
  if (!/<CollabPostForm\s+kind="collab"/.test(screen)) return 'the Collab room does not open the one form as collab';
  if (!/<CollabPostForm kind="shoot"/.test(block)) return 'the shoot board does not open the one form as shoot';
  if (/function PostCollabForm/.test(screen)) return 'the retired local composer survives';
});

const CF = loadTs(path.join(ROOT, 'lib/vendor/collabFormat.ts'));
// MUTATION → RED: in collabFormat.fmtDate, month: 'short'.
cell('C4 dates are the full month with the year (R-42.13) — never Sept', () => {
  const got = [CF.fmtDate('2026-10-18'), CF.fmtDate('2026-09-04'), CF.fmtDate('2026-11-02T00:00:00Z')];
  const want = ['18 October 2026', '4 September 2026', '2 November 2026'];
  if (got.join('|') !== want.join('|')) return `got ${got.join(' | ')}`;
});

// MUTATION → RED: in collabFormat, EVENT_TYPE_LABEL.pre_wedding = 'Pre Wedding'.
cell('C5 event-type labels are the vetoed sentence case; other tokens keep their derivation', () => {
  const want = { wedding: 'Wedding', pre_wedding: 'Pre-wedding', engagement: 'Engagement', editorial: 'Editorial', brand_shoot: 'Brand shoot', portrait: 'Portrait', other: 'Other' };
  for (const [k, v] of Object.entries(want)) if (CF.fmtType(k) !== v) return `${k} → ${CF.fmtType(k)}, vetoed ${v}`;
  if (CF.fmtType('venue_catering') !== 'Venue Catering' || CF.fmtType('photography') !== 'Photography') return 'a requirement token lost its old derivation';
  if (CF.postedBy('designer', new Date().toISOString()) !== 'Posted by a designer \u00B7 Just now') return `poster line → ${CF.postedBy('designer', new Date().toISOString())}`;
});

const SH = loadTs(path.join(ROOT, 'lib/worklist/shoots.ts'));
// MUTATION → RED: SHOOTS.none = 'No shoots yet.'
cell('C6 the seven vetoed strings, byte for byte', () => {
  const want = { sectionTitle: 'Shoots', postAction: 'Post a shoot', openToYou: 'Open to you', yourShoots: 'Your shoots', none: 'No shoots open to you yet.', shootType: 'Shoot type' };
  for (const [k, v] of Object.entries(want)) if (SH.SHOOTS[k] !== v) return `${k} = "${SH.SHOOTS[k]}"`;
  if (SH.castLine(1, 3) !== '1 of 3 cast') return `castLine → ${SH.castLine(1, 3)}`;
});

// MUTATION → RED: put `color:#68C9B4` into ShootsBlock's CSS.
cell('C7 R-42.6: zero colour literals in every new file; no brass left on the Collab screen (F-42.186)', () => {
  const lit = /#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(/;
  for (const f of ['components/vendor/CollabPostForm.tsx', 'components/vendor/ShootsBlock.tsx', 'lib/vendor/collabFormat.ts', 'lib/worklist/shoots.ts']) {
    const hit = strip(read(f)).split('\n').find((l) => lit.test(l));
    if (hit) return `${f}: ${hit.trim().slice(0, 60)}`;
  }
  if (/rgba\(201,\s*168,\s*76/.test(screen)) return 'brass rgba(201,168,76,…) survives on collab/screen.tsx';
});

// MUTATION → RED: delete the first-look line from CollabPostForm.
cell('C8 the kept bytes are kept, the retired eyebrow is gone (departure 3, REMOVED-BY-RULING)', () => {
  const kept = ["'Post a requirement'", '>What you need<', '>Add another<', 'Your roster sees this first. Open to everyone in 12 hours.',
    '{i + 1} of {items.length}', '>Date needed<', '>Select city<', '>Also open to vendors who travel<', '>Budget offered (optional)<',
    'placeholder="Rs"', "p.replace('_', ' ')", '>Event type (optional)<', "Details (optional {'\\u00B7'} {200 - form.details.length} left)",
    "'Describe what you\\u2019re looking for\\u2026'", "'Posting\\u2026' : 'Post'", "'\\u00D7'",
    "'Please fill in what you need, the date, and the city.'", "'This date has passed. Collab posts need a future date.'",
    "'Add a city to your profile before posting.'", "'Something went wrong. Try again.'"];
  const miss = kept.filter((k) => !formRaw.includes(k));
  if (miss.length) return `missing: ${miss.join(' | ')}`;
  if (/New Requirement/.test(form) || /New Requirement/.test(screen)) return 'the eyebrow survives';
});

// MUTATION → RED: ShootsBlock reads API.collabFeed() with no kind.
cell('C9 ⇄ the shoot board reads the Collab doors through ?kind=shoot, and the server accepts it', () => {
  if (!/API\.collabFeed\('shoot'\)/.test(block) || !/API\.collabMyPosts\('shoot'\)/.test(block)) return 'a read without the kind';
  if (!/`\$\{COLLAB_API_PATH\}\/feed\?kind=\$\{kind\}`/.test(routes) || !/`\$\{COLLAB_API_PATH\}\/my-posts\?kind=\$\{kind\}`/.test(routes)) return 'routes.ts does not put the kind on the wire';
  if (!/KINDS = Object\.freeze\(\['collab', 'shoot'\]\)/.test(readSib('src/lib/vendor/collabKinds.js'))) return "dream-os does not accept 'shoot'";
  if (!/router\.push\(\('\/vendor\/collab\/'\) \+ s\.id \+ '\/responses'\)/.test(block)) return 'a row does not open the post\'s own interior';
});

// MUTATION → RED: add an onClick button to referrals/page.tsx.
cell('C10 Referrals & partners mounts the block; the forwards keep their zero controls', () => {
  if (!/<ShootsBlock \/>/.test(room)) return 'the block is not mounted';
  const own = room.replace(/<style>[\s\S]*<\/style>/, '');
  if (/<button|onClick=/.test(own)) return 'the room grew a control of its own';
});

// MUTATION → RED: in CollabPostForm, drop the `kind === 'shoot' &&` guard on the note input.
cell('C11 F-42.205: the per-role note renders ONLY for kind=shoot, with the vetoed placeholder', () => {
  if (!/\{kind === 'shoot' && \(\s*<input className="wl-fi cp-note"/.test(form)) return 'the note input is not gated to kind=shoot';
  if (!formRaw.includes("const NOTE_PLACEHOLDER = 'Who you need \\u2014 e.g. Model, 22\\u201330';")) return 'the vetoed placeholder bytes are not the constant';
  if (!/placeholder=\{NOTE_PLACEHOLDER\}/.test(form)) return 'the input does not read the constant';
  if ((form.match(/cp-note"/g) || []).length !== 1) return 'a second note input exists';
});

console.log(`\nb75 · ${pass} GREEN · ${reds.length} RED${reds.length ? ' — ' + reds.join(' | ') : ''}`);
process.exit(reds.length ? 1 : 0);
