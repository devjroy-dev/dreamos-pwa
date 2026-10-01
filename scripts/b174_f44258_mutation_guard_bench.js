'use strict';
// scripts/b174_f44258_mutation_guard_bench.js · TDW CE-47 · F-44.258's cure · rung b174 (FE-6's allocation).
//
// WHAT IT HOLDS: scripts/lib/mutation_guard.js, the one pending-marker guard every mutating bench plants through, holds
// its self-test (S1 to S3, A1 to A4, B1 to B4; the cells are written out in the helper). This rung is the floor's way
// in: it runs the helper's --selftest and requires every named cell to PASS, then proves the cells bite by running the
// SAME self-test on temporary COPIES of the helper with one defect planted in each (M1 to M4). Each copy must fail its
// named cell. No file in the tree is ever mutated here, so this rung needs no guard of its own.
//   1.1 the self-test runs green, every cell by label
//   M1 the mutated-sha check removed (a file edited since is overwritten)      -> A3 must FAIL
//   M2 the kept-copy-without-marker sweep removed                               -> B1 must FAIL
//   M3 restore() removes the kept copy before the marker                        -> B4 must FAIL
//   M4 the mutated sha no longer recorded in the marker                         -> A1 must FAIL
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HELPER = path.join(__dirname, 'lib', 'mutation_guard.js');
const CELLS = ['S1', 'S2', 'S3', 'A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) {
  if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info ? '  [' + String(info).slice(0, 300) + ']' : ''}`); }
}
function run(file) {
  const r = spawnSync(process.execPath, [file, '--selftest'], { encoding: 'utf8', timeout: 60000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const res = {}; for (const c of CELLS) { const m = out.match(new RegExp(`^\\s+(PASS|FAIL)\\s+${c} `, 'm')); res[c] = m ? m[1] : 'ABSENT'; }
  return { rc: r.status, res, out };
}

console.log('b174 · the pending-mutation guard (F-44.258)');
const base = run(HELPER);
for (const c of CELLS) ok(base.res[c] === 'PASS', `1.1 ${c} passes in the helper's self-test`, base.res[c]);
ok(base.rc === 0, '1.2 the self-test exits 0', base.rc);

const src = fs.readFileSync(HELPER, 'utf8');
const MUTS = [
  ['M1', 'A3', "    if (disk !== m.mutSha) { out.refused.push(`${m.rel}: the file was edited since the mutation (${three})`); continue; }\n", ''],
  ['M2', 'B1', "    if (!names.includes(name.replace(/\\.orig$/, '.json'))) { fs.unlinkSync(path.join(dir, name)); out.orphans.push(name); }", '    void name;'],
  ['M3', 'B4', "      if (back) { try { fs.unlinkSync(markerFile); } catch (_e) { /* gone */ } try { fs.unlinkSync(keptFile); } catch (_e) { /* gone */ }",
    "      if (back) { try { fs.unlinkSync(keptFile); } catch (_e) { /* gone */ } try { fs.unlinkSync(markerFile); } catch (_e) { /* gone */ }"],
  ['M4', 'A1', 'JSON.stringify({ rel, sha: h, mutSha: mh, owner,', 'JSON.stringify({ rel, sha: h, owner,'],
];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'b174-'));
try {
  for (const [id, cell, from, to] of MUTS) {
    if (!src.includes(from)) { ok(false, `${id} its anchor exists in the helper`, from.slice(0, 80)); continue; }
    const copy = path.join(tmp, `${id}_mutation_guard.js`);
    fs.writeFileSync(copy, src.replace(from, to));
    const r = run(copy);
    ok(r.res[cell] === 'FAIL', `${id} → ${cell} FAILS on the planted defect`, `${cell} ${r.res[cell]}`);
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
ok(!fs.existsSync(path.join(__dirname, '.mutation-pending')), '1.3 nothing pending in the tree after the rung');

// §F · THE FLOOR'S MUTATION SLICE RUNS ONLY WHEN TOUCHED (CE-47's ruling, 30 Sept 2026; FE-6 L3 r2). The decision is
// scripts/lib/floor_slice.sh's; the benches declare FLOOR-SUBJECTS / FLOOR-STATES / FLOOR-WHOLE; run-floor.sh obeys.
console.log('\n§F the floor runs a bench\u2019s mutations only when the delivery touches it');
const ROOT = path.join(__dirname, '..');
const SLICE = path.join(__dirname, 'lib', 'floor_slice.sh');
const decide = (bench, manifestLines) => {
  let m = '';
  if (manifestLines) { m = path.join(tmpF, 'manifest.txt'); fs.writeFileSync(m, ['# a delivery', ...manifestLines].join('\n') + '\n'); }
  return spawnSync('bash', [SLICE, bench, m], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
};
const tmpF = fs.mkdtempSync(path.join(os.tmpdir(), 'b174F-'));
try {
  const V2 = 'scripts/b143_ads1_ads_page_bench_v2.js', CL = 'scripts/b143_ads1_ads_page_bench.js', H2 = 'scripts/b140_ce46_fe4_page_help_bench_v2.js';
  let d = decide(V2, ['v2/app/vendor/(shell)/posts/ads/page.tsx']);
  ok(d.startsWith('whole'), 'F1 a delivery that names v2/app/vendor/(shell)/posts/ads/page.tsx runs b143_v2\u2019s mutations', d);
  d = decide(V2, ['v2/app/vendor/(shell)/couture/screen.tsx', 'v2/lib/worklist/couture.ts']);
  const d2 = decide(H2, ['v2/app/vendor/(shell)/couture/screen.tsx']);
  ok(d.startsWith('states') && d2.startsWith('states'), 'F2 a delivery of an unrelated room runs the states slice only (b143_v2, b140_v2)', `${d} | ${d2}`);
  d = decide(V2, null);
  ok(d.startsWith('whole'), 'F3 no --delivery: whole (the rule only shortens a floor that names what it delivers)', d);
  ok(decide(CL, [CL]).startsWith('whole') && decide('scripts/b74_r6_posts_room_bench.js', ['x']) === 'plain', 'F4 the bench itself named: whole; a bench with no declaration: exactly as before', decide(CL, [CL]));
  // F5 · every file a bench mutates is among its declared subjects (so a change to it re-proves the mutations)
  // what each bench MUTATES: b143's MUTS rows open with the file ([rel, from, to, name]); b140's rows name it as file:
  const mutated = (src) => {
    const b143 = src.slice(src.indexOf('const MUTS = PART'), src.indexOf('const TALLY_MUTS'));
    const fromB143 = src.includes('const MUTS = PART') ? [...b143.matchAll(/\[\s*'((?:app|v2|lib|components)\/[^']+)'/g)].map((m) => m[1]) : [];
    const fromB140 = [...src.matchAll(/\{ id: 'M\d+', file: '([^']+)'/g)].map((m) => m[1]);
    return new Set([...fromB143, ...fromB140]);
  };
  const declared = (src) => new Set(((src.match(/^\/\/ FLOOR-SUBJECTS: (.*)$/m) || [])[1] || '').split(/\s+/).filter(Boolean));
  const covers = (src) => { const d = declared(src); return [...mutated(src)].filter((f) => !d.has(f)); };
  const missing = [V2, CL, H2, 'scripts/b140_ce46_fe4_page_help_bench.js'].map((b) => [b, covers(fs.readFileSync(path.join(ROOT, b), 'utf8'))]).filter(([, m]) => m.length);
  ok(missing.length === 0, 'F5 each bench\u2019s FLOOR-SUBJECTS names every file it mutates', JSON.stringify(missing));
  // F5 both ways: a subject planted out of a COPY of b143_v2's declaration must be caught
  const planted = fs.readFileSync(path.join(ROOT, V2), 'utf8').replace(' v2/components/worklist/AdsCard.tsx', '');
  ok(covers(planted).includes('v2/components/worklist/AdsCard.tsx'), 'F5M a subject planted out of the declaration reddens F5');
  // F6 · run-floor.sh obeys the decision and passes the member's own recipe
  const rf = fs.readFileSync(path.join(ROOT, 'scripts/run-floor.sh'), 'utf8');
  ok(/SLICE=\$\(bash scripts\/lib\/floor_slice\.sh "\$b" "\$\{MANIFEST:-\}"\)/.test(rf) && /env \$SLICE_ENV node "\$b" \$SLICE_ARGS >>"\$LOG" 2>&1/.test(rf) && /echo "\$\{n\}: states only/.test(rf),
    'F6 run-floor.sh asks floor_slice.sh per member, prints which it did and why, and runs the recipe');
} finally { fs.rmSync(tmpF, { recursive: true, force: true }); }
console.log(`\nb174 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
process.exit(fail ? 1 : 0);
