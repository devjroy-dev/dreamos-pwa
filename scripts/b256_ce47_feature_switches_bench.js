'use strict';
// scripts/b256_ce47_feature_switches_bench.js · CE-47 · ADS-2 · A VENDOR'S META FEATURE SWITCHES (app half).
// FLOOR-SUBJECTS: lib/worklist/features.ts v2/lib/worklist/features.ts components/solutions/FeatureSwitch.tsx v2/components/solutions/FeatureSwitch.tsx components/solutions/MetaRoomSections.tsx v2/components/solutions/MetaRoomSections.tsx app/vendor/(shell)/posts/ads/page.tsx v2/app/vendor/(shell)/posts/ads/page.tsx lib/admin-api/switchboardCopy.ts
// No browser. 1: features.ts (both trees) transpiled by the repo's own TypeScript and run: the ruled words, lineFor,
// shown. 2: the rooms mount their switches (static), the door's PUT, the dimmed locked row, the switchboard words.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..'); const CHILD = !!process.env.B256_CHILD;
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; if (!CHILD) console.log(`  PASS  ${name}`); } else { fail++; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 200) + ']'}`); } };
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const ts = require(path.join(ROOT, 'node_modules/typescript'));
function load(p) {
  const src = rd(p).replace(/^import .*_base';$/m, "const API_BASE = ''; const getAuthHeader = () => ({}); const getJson = async () => ({}); const handleResponse = async () => ({});");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, require); return m.exports;
}
const WAIT = "Waiting for Meta's approval. It starts by itself when approved.";
for (const tree of ['', 'v2/']) {
  const F = load(tree + 'lib/worklist/features.ts'); const t = tree || 'app/';
  if (!CHILD) console.log(`\n── 1  ${t} the words, the line, the switches shown ──`);
  ok(F.FEATURE_WORDS.on === 'On' && F.FEATURE_WORDS.off === 'Off' && F.FEATURE_WORDS.waiting === WAIT && F.FEATURE_WORDS.live === 'Live' && F.FEATURE_WORDS.heading === 'Meta features',
    `1.1 ${t} the ruled words, verbatim`);
  ok(F.lineFor({ live: true }) === 'Live' && F.lineFor({ live: false }) === WAIT, `1.2 ${t} "Live" once Meta has approved, else the waiting line`);
  const all = [{ key: 'perm.instagram_business_manage_messages' }, { key: 'flag.ads' }, { key: 'flag.ig_photo_import' }, { key: 'perm.instagram_business_manage_insights' }];
  ok(JSON.stringify(F.shown(all).map((f) => f.key)) === '["perm.instagram_business_manage_messages","flag.ads"]' && F.shown(all, 'flag.ads').length === 1,
    `1.3 ${t} the switches shown: messages and ads; the photo import and insights none (Q5, Q4)`);
  if (!CHILD) console.log(`\n── 2  ${t} the rooms, the door, the dimmed row ──`);
  const mrs = rd(tree + 'components/solutions/MetaRoomSections.tsx');
  ok(/<section data-meta-features><h2 className="sol-heading">\{FEATURE_WORDS\.heading\}<\/h2><FeatureSwitch \/><\/section>/.test(mrs), `2.1 ${t} the WhatsApp and Instagram room carries the list, titled "Meta features"`);
  const ads = rd(tree + 'app/vendor/(shell)/posts/ads/page.tsx');
  ok(/<FeatureSwitch only="flag\.ads" \/>\n\s*\{body\}/.test(ads), `2.2 ${t} the ads room carries the ads switch at its top`);
  const lib = rd(tree + 'lib/worklist/features.ts');
  ok(/method: 'PUT'/.test(lib) && /`\$\{API_BASE\}\$\{FEATURES_API_PATH\}`/.test(lib) && /JSON\.stringify\(\{ key, choice \}\)/.test(lib) && /'\/api\/v2\/vendor\/features'/.test(lib),
    `2.3 ${t} her choice goes to PUT /api/v2/vendor/features as { key, choice }`);
  ok(/\.ads-opt\[aria-disabled="true"\]\{opacity:\.55\}/.test(ads), `2.4 ${t} the locked chooser row is dimmed`);
  const sw = rd(tree + 'components/solutions/FeatureSwitch.tsx');
  ok(/aria-pressed=\{f\.choice === c\}/.test(sw) && /lineFor\(f\)/.test(sw) && /setList\(before\)/.test(sw), `2.5 ${t} the switch shows her choice pressed, the line under it, and reverts a failed save`);
}
const sb = rd('lib/admin-api/switchboardCopy.ts');
ok(/It needs all six ads permissions listed below\./.test(sb) && !/needs all seven/.test(sb) && /the Meta app App-LIVE\. It needs the Instagram basic permission\.'/.test(sb),   // AMENDED BY LABEL (R-47.1, CE-47 ADS-2): the spec lines are sentences now
   '3.1 the switchboard: ads needs six; the photo import needs Instagram basic');

const MUTS = [
  ['lib/worklist/features.ts', "return f.live ? FEATURE_WORDS.live : FEATURE_WORDS.waiting;", "return FEATURE_WORDS.live;", 'M1 the waiting line never shown', '1.2 app/'],
  ['v2/lib/worklist/features.ts', "export const SWITCHABLE = Object.freeze(['perm.instagram_business_manage_messages', 'flag.ads']);", "export const SWITCHABLE = Object.freeze(['perm.instagram_business_manage_messages', 'flag.ads', 'flag.ig_photo_import']);", 'M2 the photo import given a switch', '1.3 v2/'],
  ['app/vendor/(shell)/posts/ads/page.tsx', '        <FeatureSwitch only="flag.ads" />\n', '', 'M3 the ads switch removed', '2.2 app/'],
  ['v2/app/vendor/(shell)/posts/ads/page.tsx', '.ads-opt[aria-disabled="true"]{opacity:.55}\n', '', 'M4 the locked row not dimmed', '2.4 v2/'],
];
if (CHILD) { console.log(`b256 child · ${pass} pass · ${fail} fail`); process.exit(fail ? 1 : 0); }
console.log('\n── 9  mutations (each in a fresh child, restored by sha) ──');
for (const [file, from, to, name, cell] of MUTS) {
  const P = path.join(ROOT, file); const src = fs.readFileSync(P, 'utf8'); const before = crypto.createHash('sha256').update(src).digest('hex');
  if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`); continue; }
  fs.writeFileSync(P, src.replace(from, to));
  let r; try { r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B256_CHILD: '1' }, encoding: 'utf8' }); } finally { fs.writeFileSync(P, src); }
  const after = crypto.createHash('sha256').update(fs.readFileSync(P)).digest('hex');
  ok(r.status === 1 && (r.stdout || '').includes(`FAIL  ${cell}`) && after === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
}
console.log(`\nb256 · ${pass} pass · ${fail} fail`);
if (failed.length) console.log('FAILED: ' + failed.join(' | '));
process.exit(fail ? 1 : 0);
