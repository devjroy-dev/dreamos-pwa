// scripts/b206_ce47_floor_affected_bench.mjs · CE-47 · ADS-2 · THE AFFECTED-ONLY CHECK (the chair's ruling, 3 Oct 2026).
// FLOOR-SUBJECTS: scripts/lib/floor_affected.mjs scripts/run-floor.sh scripts/lib/floor_reap.sh scripts/lib/mutation_guard.js scripts/lib/base_worktrees.js
// Holds: scripts/lib/floor_affected.mjs (the selection, driven on fixture trees in memory, every rule both ways) and
// run-floor.sh's --affected wiring (its own base-cut program run on fixtures; the skip placed before any ledger line).
// No browser, no network. Mutations of the selector and the runner run in fresh children, through mutation_guard.js.
// §11 (F-44.423) the floor's two locks; §12 (F-44.421) a FLOOR-ALONE member, both on fixture repos; §13 (F-44.425) the base
// worktree cleanup on a fixture with a second clone beside it; M9 to M14 bite them.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import cp from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.join(HERE, '..');
const CHILD = !!process.env.B206_CHILD;
// F-44.419 and F-44.422: a mutation a killed run of this bench left is restored (or the bench refuses) before anything is read;
// the parent only (a child runs on purpose with the parent's mutation planted).
const { createRequire } = await import('node:module'); const guard = createRequire(import.meta.url)(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
if (!CHILD) guard.recoverOrRefuse(ROOT, 'b206');
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; if (!CHILD) console.log(`  PASS  ${name}`); } else { fail++; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 200) + ']'}`); } };
const sel = await import(pathToFileURL(path.join(ROOT, 'scripts/lib/floor_affected.mjs')).href + `?t=${Date.now()}`);

// THE FIXTURE TREE, in memory
const PAGE = 'app/vendor/(shell)/posts/ads/page.tsx';
const T = {
  [PAGE]: "import { ADS } from '@/lib/worklist/ads';\nexport default function P() {}",
  'lib/worklist/ads.ts': 'export const ADS = {};',
  'components/worklist/AdsCard.tsx': "import { thing } from '../../app/vendor/(shell)/posts/ads/page';\n",
  'components/worklist/Shelf.tsx': "import { AdsCard } from '@/components/worklist/AdsCard';\n",
  'scripts/lib/probe_ads.mjs': "import puppeteer from 'puppeteer'; export const go = () => 'app/vendor/(shell)/posts/ads/page.tsx';",
  'scripts/lib/b126_dev_server.js': '// next dev',
  'scripts/m_path.js': "require('./lib/b126_dev_server.js'); const f = 'app/vendor/(shell)/posts/ads/page.tsx';",
  'scripts/m_route.js': "const puppeteer = 1; goto('http://localhost:3000/vendor/posts/ads');",
  'scripts/m_importer.js': "const puppeteer = 1; read('components/worklist/AdsCard.tsx');",
  'scripts/m_twolevel.js': "const puppeteer = 1; read('components/worklist/Shelf.tsx');",
  'scripts/m_viaLib.js': "import { go } from './lib/probe_ads.mjs';",
  'scripts/m_none.js': "const puppeteer = 1; goto('/vendor/calendar/day');",
  'scripts/m_onesegment.js': "const puppeteer = 1; goto('/vendor');",
  'scripts/m_static.js': "read('lib/other.ts');",
  'scripts/m_walker.js': "const puppeteer = 1; fs.readdirSync('app/vendor');",
  'scripts/m_named.js': "const puppeteer = 1;",
  'scripts/run-x-proof.sh': '# wrapper',
};
const read = (p) => (p in T ? T[p] : null); const exists = (p) => p in T;
const members = ['scripts/m_path.js', 'scripts/m_route.js', 'scripts/m_importer.js', 'scripts/m_twolevel.js', 'scripts/m_viaLib.js', 'scripts/m_none.js',
  'scripts/m_onesegment.js', 'scripts/m_static.js', 'scripts/m_walker.js', 'scripts/m_named.js', 'scripts/run-x-proof.sh'];
const appFiles = Object.keys(T).filter((p) => /^(app|v2|lib|components|hooks)\//.test(p));
const out = sel.select({ members, delivered: [PAGE, 'scripts/m_named.js'], appFiles, read, exists });
const R = (m) => out.find((x) => x.member === 'scripts/' + m) || {};

if (!CHILD) console.log('\n── 6  the selection, every rule both ways ──');
ok(R('m_path.js').run && /names app\/vendor\/\(shell\)\/posts\/ads\/page/.test(R('m_path.js').why), '6.1 a browser member naming a delivered path runs, and says why', JSON.stringify(R('m_path.js')));
ok(R('m_route.js').run && /names \/vendor\/posts\/ads/.test(R('m_route.js').why), '6.2 a browser member naming only the page\'s route runs', JSON.stringify(R('m_route.js')));
ok(R('m_importer.js').run && /imports app\/vendor/.test(R('m_importer.js').why), '6.3 a member naming a file that imports the delivery (one level) runs', JSON.stringify(R('m_importer.js')));
ok(R('m_twolevel.js').run === false, '6.4 two levels up does not count (one level, as ruled)', JSON.stringify(R('m_twolevel.js')));
ok(R('m_viaLib.js').run && /scripts\/lib\/probe_ads\.mjs names/.test(R('m_viaLib.js').why), '6.5 a member naming the delivery only through a scripts/lib probe runs', JSON.stringify(R('m_viaLib.js')));
ok(R('m_none.js').run === false && /no subject/.test(R('m_none.js').why), '6.6 a browser member naming nothing of the delivery is skipped, and says why', JSON.stringify(R('m_none.js')));
ok(R('m_onesegment.js').run === false, '6.7 a one-segment route (/vendor) is too broad to count', JSON.stringify(R('m_onesegment.js')));
ok(R('m_static.js').run && /no-browser/.test(R('m_static.js').why), '6.8 a no-browser member always runs', JSON.stringify(R('m_static.js')));
ok(R('m_walker.js').run && /walks the app tree/.test(R('m_walker.js').why), '6.9 a member that walks app/ always runs (e-269)', JSON.stringify(R('m_walker.js')));
ok(R('m_named.js').run && /the delivery names the member/.test(R('m_named.js').why), '6.10 a member the delivery names runs', JSON.stringify(R('m_named.js')));
ok(R('run-x-proof.sh').run, '6.11 a .proof.ts wrapper always runs', JSON.stringify(R('run-x-proof.sh')));
ok(sel.routeOf('v2/app/vendor/(shell)/posts/ads/page.tsx') === '/vendor/posts/ads' && sel.routeOf('app/vendor/page.tsx') === null && sel.routeOf('lib/x.ts') === null,
  '6.12 routes: groups dropped, v2 the same, one segment and non-pages none');

if (!CHILD) console.log('\n── 7  run-floor.sh --affected, its own code on fixtures ──');
const rf = fs.readFileSync(path.join(ROOT, 'scripts/run-floor.sh'), 'utf8');
const awk = (rf.match(/awk '(NR==FNR[^']*)'/) || [])[1];
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'b206-'));
fs.writeFileSync(path.join(tmp, 'ran'), 'b40_worklist_shell_bench\nb51_referrals_bench\n');
fs.writeFileSync(path.join(tmp, 'base'), 'RED: b40_worklist_shell_bench\nRED: b143_skipped_bench\nERROR: b51_referrals_bench\n');
const cut = awk ? cp.spawnSync('awk', [awk, path.join(tmp, 'ran'), path.join(tmp, 'base')], { encoding: 'utf8' }).stdout : '';
fs.rmSync(tmp, { recursive: true, force: true });
ok(cut === 'RED: b40_worklist_shell_bench\nERROR: b51_referrals_bench\n', '7.1 the named base is cut to the members that ran (a skipped base red neither red nor cured)', JSON.stringify(cut));
const iSkip = rf.indexOf('outside the radius: not run, no ledger line'); const iLedger = rf.indexOf('member %s');
ok(iSkip > 0 && iLedger > iSkip, '7.2 an unselected member is skipped before it writes any ledger line');
ok(/--affected\) shift; while/.test(rf) && /tdw-affected-union\.txt/.test(rf) && /next build --webpack/.test(rf) && /not both/.test(rf),
  '7.3 --affected takes one or more manifests into one union, builds first, and refuses with --delivery');

if (!CHILD) console.log('\n── 9  scripts/train.sh on a throwaway repo (apply, refusals, commit and one push) ──');
{
  const T0 = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'b206-train-'));
  const sh = (cmd, cwd) => cp.spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
  const repo = path.join(T0, 'r'), bare = path.join(T0, 'b.git');
  sh(`git init -q -b main ${repo} && cd ${repo} && git config user.email t@l && git config user.name t && echo '{"name": "web"}' > package.json && mkdir -p scripts && cp ${path.join(ROOT, 'scripts/train.sh')} scripts/ && echo a > keep.txt && echo '*.zip' > .gitignore && git add -A && git commit -q -m base && git clone -q --bare ${repo} ${bare} && git remote add origin ${bare}`, T0);
  const mkzip = (name, files) => { const d = path.join(T0, 'z_' + name); for (const [f, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(d, 'deploy', f)), { recursive: true }); fs.writeFileSync(path.join(d, 'deploy', f), c); }
    sh(`cd ${d} && zip -qr -X ${path.join(repo, name)} deploy`, T0); return crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, name))).digest('hex'); };
  const spec = (lines) => { fs.writeFileSync(path.join(repo, 'spec.txt'), lines.join('\n') + '\n'); };
  const run = (mode) => sh(`bash scripts/train.sh ${mode} spec.txt`, repo);
  const clean = () => sh('git reset -q --hard && git clean -qfd -e spec.txt -e "*.zip"', repo);
  let a = mkzip('A.zip', { 'scripts/floor-manifest-a.txt': 'lib/a.ts\nscripts/floor-manifest-a.txt\n', 'lib/a.ts': 'a' });
  let b = mkzip('B.zip', { 'scripts/floor-manifest-b.txt': 'lib/b.ts\nkeep.txt\nscripts/floor-manifest-b.txt\n', 'lib/b.ts': 'b', 'keep.txt': 'changed' });
  spec([`A.zip|${a}|scripts/floor-manifest-a.txt|CE-47 A`, `B.zip|${b}|scripts/floor-manifest-b.txt|CE-47 B`]);
  let r = run('apply');
  ok(r.status === 0 && /TRAIN APPLIED: 2 package\(s\), 5 paths/.test(r.stdout) && /--affected scripts\/floor-manifest-a\.txt scripts\/floor-manifest-b\.txt --check/.test(r.stdout),
    '9.1 two packages apply in order: 5 paths plain and -uall, and the one --affected check over both manifests is printed', (r.stdout + r.stderr).slice(-300));
  r = run('commit');
  const log = sh(`git -C ${bare} log --format=%s -3 main`, T0).stdout.trim().split('\n');
  ok(r.status === 0 && /TRAIN PUSHED/.test(r.stdout) && log[0] === 'CE-47 B' && log[1] === 'CE-47 A' && log[2] === 'base',
    '9.2 commit: one commit per package in order, then one push', (r.stdout + r.stderr).slice(-300));
  clean(); sh('git reset -q --hard origin/main 2>/dev/null || true', repo);
  a = mkzip('A2.zip', { 'scripts/floor-manifest-a2.txt': 'lib/x.ts\nscripts/floor-manifest-a2.txt\n', 'lib/x.ts': 'x' });
  b = mkzip('B2.zip', { 'scripts/floor-manifest-b2.txt': 'lib/x.ts\nscripts/floor-manifest-b2.txt\n', 'lib/x.ts': 'y' });
  spec([`A2.zip|${a}|scripts/floor-manifest-a2.txt|CE-47 A2`, `B2.zip|${b}|scripts/floor-manifest-b2.txt|CE-47 B2`]);
  r = run('apply');
  ok(r.status === 1 && /a path in two packages: lib\/x\.ts/.test(r.stdout) && !/lib\/x\.ts/.test(sh('git status --porcelain', repo).stdout), '9.3 a path in two packages: refused, nothing applied', r.stdout.slice(-200));
  const c = mkzip('C.zip', { 'lib/c.ts': 'c' });
  spec([`C.zip|${c}|scripts/floor-manifest-c.txt|CE-47 C`]); r = run('apply');
  ok(r.status === 1 && /carries no manifest/.test(r.stdout), '9.4 a ZIP without its manifest: refused', r.stdout.slice(-200));
  spec([`A2.zip|${'0'.repeat(64)}|scripts/floor-manifest-a2.txt|CE-47 A2`]); r = run('apply');
  ok(r.status === 1 && /sha does not match/.test(r.stdout), '9.5 a ZIP whose sha does not match: refused', r.stdout.slice(-200));
  spec([`A2.zip|${a}|scripts/floor-manifest-a2.txt|CE-47 "A2"`]); r = run('apply');
  ok(r.status === 1 && /holds a quote/.test(r.stdout), '9.6 a quote in a commit message: refused (e-263)', r.stdout.slice(-200));
  fs.rmSync(T0, { recursive: true, force: true });
}

if (!CHILD) console.log('\n── 10  --affected then --resume, end to end on a fixture repo (a floor cut after its first member) ──');
{
  const FX = "set -u\nSRC=\"$B206_ROOT\"; T=$(mktemp -d \"${TMPDIR:-/tmp}/b206-fx.XXXX\"); cd $T\ngit init -q -b main r && cd r && git config user.email t@l && git config user.name t\nmkdir -p scripts/lib lib bin && cp $SRC/scripts/run-floor.sh scripts/ && cp $SRC/scripts/lib/floor_reap.sh $SRC/scripts/lib/floor_slice.sh $SRC/scripts/lib/floor_affected.mjs scripts/lib/\nln -s $SRC/node_modules node_modules; echo node_modules > .gitignore; echo \"{\\\"name\\\": \\\"web\\\"}\" > package.json; echo 'export const a = 1;' > lib/a.ts\nfor m in a_green b_named c_other; do :; done\ncat > scripts/m_a_green.js <<'X'\nrequire('fs').appendFileSync(process.env.FX_RUNS, 'm_a_green\\n'); console.log('m_a_green 1 pass 0 fail');\nX\ncat > scripts/m_b_named.js <<'X'\n// puppeteer (a browser member in name); it reads lib/a.ts\nrequire('fs').appendFileSync(process.env.FX_RUNS, 'm_b_named\\n'); setTimeout(() => console.log('m_b_named 1 pass 0 fail'), 3000);\nX\ncat > scripts/m_c_other.js <<'X'\n// puppeteer (a browser member in name); it reads nothing delivered\nrequire('fs').appendFileSync(process.env.FX_RUNS, 'm_c_other\\n'); console.log('ok');\nX\nprintf '#!/bin/sh\\necho build >> \"$FX_RUNS.build\"; echo \"fake next build\"; exit 0\\n' > bin/npx; chmod +x bin/npx\ngit add -A && git commit -q -m base\necho 'export const a = 2;' > lib/a.ts; printf '# m\\nlib/a.ts\\n' > ../m.txt\nexport FX_RUNS=$T/runs.log PATH=$T/r/bin:$PATH TMPDIR=$T/tmp; mkdir -p $TMPDIR\nsetsid bash scripts/run-floor.sh --affected ../m.txt --check > $T/run1.log 2>&1 &\nRP=$!; for i in $(seq 1 100); do grep -q \"KEPT\" $TMPDIR/tdw-floor-pwa/m_a_green.log 2>/dev/null && break; sleep 0.1; done; sleep 0.3; kill -9 -$RP 2>/dev/null; sleep 1\ngrep -q \"AFFECTED: 2 member(s) run, 1 skipped\" $T/run1.log && echo \"R1SEL yes\"; echo \"RUNS1: $(tr '\\n' ' ' < $FX_RUNS)\"; echo \"BUILDS: $(wc -l < $FX_RUNS.build)\"\nbash scripts/run-floor.sh --affected ../m.txt --check --resume $TMPDIR/tdw-floor-pwa > $T/run2.log 2>&1; echo \"RC2 $?\"\ngrep -q \"kept GREEN from floor\" $T/run2.log && echo \"R2KEPT yes\"; grep -q \"^FLOOR = NAMED BASE, no delta\" $T/run2.log && echo \"R2VERDICT yes\"; echo \"RUNS2: $(tr '\\n' ' ' < $FX_RUNS)\"; echo \"BUILDS2: $(wc -l < $FX_RUNS.build)\"; echo \"RAN: $(tr '\\n' ' ' < $TMPDIR/tdw-floor-pwa/ran.txt)\"\ncd /; rm -rf $T\n";
  const r = cp.spawnSync('bash', ['-c', FX], { env: { ...process.env, B206_ROOT: ROOT }, encoding: 'utf8', timeout: 240000 });
  const o = r.stdout || ''; const get = (k) => ((o.match(new RegExp('^' + k + ':? ?(.*)$', 'm')) || [])[1] || '').trim();
  ok(/R1SEL yes/.test(o), '10.1 run 1: next build once, then the selection printed (2 run, 1 skipped)', o.slice(-300));
  ok(get('BUILDS2') === '1', '10.2 the resume does not build again (next-build.ok kept)', 'builds ' + get('BUILDS2'));
  ok(/R2KEPT yes/.test(o) && (get('RUNS2').match(/m_a_green/g) || []).length === 1, '10.3 the member kept GREEN before the cut is not run again', get('RUNS2'));
  ok(!/m_c_other/.test(get('RUNS2')), '10.4 the skipped member never runs, in either run', get('RUNS2'));
  ok(get('RC2') === '0' && /R2VERDICT yes/.test(o) && /m_a_green/.test(get('RAN')) && /m_b_named/.test(get('RAN')), '10.5 the resumed floor ends FLOOR = NAMED BASE, no delta, with both selected members in ran.txt', get('RAN') + ' rc ' + get('RC2'));
}

// A fixture repo with run-floor.sh, the reaper and the slice reader; members are written by each section.
const fixture = (members, extra = '') => `set -u
SRC="$B206_ROOT"; T=$(mktemp -d "\${TMPDIR:-/tmp}/b206-lk.XXXX"); cd $T
git init -q -b main r && cd r && git config user.email t@l && git config user.name t
mkdir -p scripts/lib lib && cp $SRC/scripts/run-floor.sh scripts/ && cp $SRC/scripts/lib/floor_reap.sh $SRC/scripts/lib/floor_slice.sh $SRC/scripts/lib/floor_affected.mjs scripts/lib/
ln -s $SRC/node_modules node_modules; printf 'node_modules\\n/.next/\\n' > .gitignore; echo '{"name": "web"}' > package.json
${members}
git add -A && git commit -q -m base
export FX_RUNS=$T/runs.log TMPDIR=$T/tmp; mkdir -p $TMPDIR
${extra}
cd /; rm -rf $T
`;

if (!CHILD) console.log('\n── 11  F-44.423: one floor at a time (the clone’s lock and the log folder’s lock) ──');
{
  const M = `cat > scripts/m_slow.js <<'X'
require('fs').appendFileSync(process.env.FX_RUNS, 'm_slow\\n'); setTimeout(() => console.log('m_slow 1 pass 0 fail'), 4000);
X`;
  const X = `setsid bash scripts/run-floor.sh --check > $T/f1.log 2>&1 & P1=$!
for i in $(seq 1 100); do [ -f "$TMPDIR/tdw-floor-pwa/floor.id" ] && break; sleep 0.1; done
ls $TMPDIR/tdw-floor-pwa > $T/before2.txt 2>/dev/null; cp $TMPDIR/tdw-floor-pwa/floor.id $T/id_before2 2>/dev/null
bash scripts/run-floor.sh --check > $T/f2.log 2>&1; echo "RC2 $?"; echo "F2: $(head -c 300 $T/f2.log | tr '\\n' ' ')"
ls $TMPDIR/tdw-floor-pwa > $T/after2.txt 2>/dev/null; GONE=$(comm -23 <(sort $T/before2.txt) <(sort $T/after2.txt) | tr '\\n' ' ')
[ -s $T/before2.txt ] && [ -z "$GONE" ] && echo "NOTHING REMOVED yes"; echo "GONE: $GONE"; [ -s $T/id_before2 ] && cmp -s $T/id_before2 $TMPDIR/tdw-floor-pwa/floor.id && echo "ID SAME yes"
git clone -q . ../r2 && (cd ../r2 && bash scripts/run-floor.sh --check > $T/f3.log 2>&1; echo "RC3 $?"); echo "F3: $(head -c 300 $T/f3.log | tr '\\n' ' ')"
kill -9 -$P1 2>/dev/null; sleep 1
bash scripts/run-floor.sh --check > $T/f4.log 2>&1; echo "RC4 $?"; grep -c "A stale floor lock (pid [0-9]*, no longer running) was moved aside" $T/f4.log | sed 's/^/STALE /'; grep -q "^FLOOR" $T/f4.log && echo "F4 RAN yes"
[ -d "$(git rev-parse --git-dir)/tdw-floor.lock" ] && echo "LOCK LEFT yes" || echo "LOCK LEFT no"; echo "RUNS: $(tr '\\n' ' ' < $FX_RUNS)"`;
  const r = cp.spawnSync('bash', ['-c', fixture(M, X)], { env: { ...process.env, B206_ROOT: ROOT }, encoding: 'utf8', timeout: 240000 });
  const o = r.stdout || ''; const get = (k) => ((o.match(new RegExp('^' + k + ':? ?(.*)$', 'm')) || [])[1] || '').trim();
  // (AMENDED BY LABEL, CE-47 ADS-2, the chair's ruling of 8 Oct 2026: under load the running floor wrote a new log between
  //  the two listings and an equality check went red, sB run 4. "Removes nothing" is now what it says: every name listed
  //  before the second start is still there after it, and floor.id is byte for byte unchanged. The cell names the part.)
  { const parts = [['rc 3', get('RC2') === '3'],
      ['the sentence', /^REFUSED — a floor is already running in this tree \(pid \d+, started .+\)\. Nothing was run, nothing removed\./.test(get('F2'))],
      ['nothing removed', /NOTHING REMOVED yes/.test(o)], ['floor.id unchanged', /ID SAME yes/.test(o)]];
    const bad = parts.filter(([, v]) => !v).map(([k]) => k);
    ok(!bad.length, '11.1 a second start in the same clone refuses with rc 3, names the running floor, and removes nothing',
      bad.length ? `failed: ${bad.join(', ')} · ${get('RC2')} ${get('F2').slice(0, 120)} · gone: ${get('GONE') || 'none'}` : `${get('RC2')} ${get('F2').slice(0, 160)}`); }
  ok(get('RC3') === '3' && /^REFUSED — a floor is already running in the log folder .*tdw-floor-pwa \(pid \d+/.test(get('F3')),
    '11.2 a start in ANOTHER clone with the same TMPDIR refuses on the log folder’s lock', `${get('RC3')} ${get('F3').slice(0, 160)}`);
  ok(get('RC4') !== '3' && get('STALE') === '2' && /F4 RAN yes/.test(o) && /LOCK LEFT no/.test(o),
    '11.3 after the running floor is killed (kill -9), the next start moves both stale locks aside, runs, and releases its locks', `rc ${get('RC4')} stale ${get('STALE')} ${get('RUNS')}`);
}

if (!CHILD) console.log('\n── 12  F-44.421: a FLOOR-ALONE member runs last and by itself ──');
{
  const M = `cat > scripts/m_0_alone.js <<'X'
// FLOOR-ALONE: yes
const fs = require('fs'); fs.appendFileSync(process.env.FX_RUNS, 'm_0_alone tmp=' + process.env.TMPDIR + ' next=' + fs.existsSync('.next') + '\\n'); console.log('m_0_alone 1 pass 0 fail');
X
cat > scripts/m_1_first.js <<'X'
const fs = require('fs'); fs.mkdirSync('.next/dev', { recursive: true }); fs.writeFileSync('.next/dev/left-by-m_1', 'x'); fs.writeFileSync(process.env.FX_GO, 'go'); fs.appendFileSync(process.env.FX_RUNS, 'm_1_first\\n'); setTimeout(() => console.log('ok'), 800);
X`;
  // The stand-in is a server an EARLIER member leaves running in another root. Its pid must be known before the floor (the
  // narrowing is read at start), and the floor's own pre-floor pass must not see it: so it starts as a shell waiting
  // for m_1_first's signal and then execs, under the SAME pid, a node whose command line reads "next dev".
  const X = `mkdir -p $T/elsewhere; export FX_GO=$T/elsewhere/go
SP=$(cd $T/elsewhere && { bash -c 'while [ ! -f go ]; do sleep 0.1; done; exec node -e "setInterval(() => {}, 1e9)" next dev -p 3997' >/dev/null 2>&1 & echo $!; })
sleep 0.5; export FLOOR_REAP_ONLY_PIDS="$SP"
bash scripts/run-floor.sh --check > $T/f.log 2>&1; echo "RC $?"
echo "RUNS: $(tr '\\n' '|' < $FX_RUNS)"; grep -c "^ALONE: m_0_alone runs last and by itself (F-44.421)\\.$" $TMPDIR/tdw-floor-pwa/m_0_alone.log | sed 's/^/ALONELINE /'
grep -q "^REAPED (alone: m_0_alone) (F-44.421): a next dev was running (pids $SP;" $TMPDIR/tdw-floor-pwa/m_0_alone.log && echo "REAPED yes"
kill -0 $SP 2>/dev/null && echo "STANDIN alive" || echo "STANDIN gone"; kill -9 $SP 2>/dev/null
[ -f "$(git rev-parse --git-dir)/next-aside/dev/left-by-m_1" ] && echo "ASIDE yes"; [ -z "$(git status --porcelain)" ] && echo "CLEAN yes"`;
  const r = cp.spawnSync('bash', ['-c', fixture(M, X)], { env: { ...process.env, B206_ROOT: ROOT }, encoding: 'utf8', timeout: 240000 });
  const o = r.stdout || ''; const get = (k) => ((o.match(new RegExp('^' + k + ':? ?(.*)$', 'm')) || [])[1] || '').trim();
  const runs = get('RUNS').split('|').filter(Boolean);
  ok(runs.length === 2 && runs[0] === 'm_1_first' && /^m_0_alone /.test(runs[1]) && get('ALONELINE') === '1', '12.1 the FLOOR-ALONE member runs after every other member (its name sorts first), and its log says so', get('RUNS'));
  ok(/REAPED yes/.test(o) && /STANDIN gone/.test(o), '12.2 before it, a next dev in ANOTHER root is stopped by pid and named (the pass is any-root; narrowed here to the planted stand-in)', o.split('\n').filter((l) => /REAPED|STANDIN/.test(l)).join(' / '));
  ok(/next=false/.test(runs[1] || '') && /ASIDE yes/.test(o) && /CLEAN yes/.test(o), '12.3 .next is moved aside into the clone’s .git (kept, never a dirty path), so the member starts without it', `${runs[1]} ${/ASIDE yes/.test(o)} ${/CLEAN yes/.test(o)}`);
  ok(/tmp=\S*\/tdw-alone-m_0_alone\.\w+/.test(runs[1] || ''), '12.4 the member runs with a TMPDIR of its own', runs[1]);
}

if (!CHILD) console.log('\n── 13  F-44.425: a bench keeps one base worktree, removes its own old ones, never another clone’s or one in use ──');
{
  const SH = `set -u
P=$(mktemp -d "\${TMPDIR:-/tmp}/b206-wt.XXXX"); cd $P
git init -q -b main r && cd r && git config user.email t@l && git config user.name t && echo a > a && git add a && git commit -qm a
for n in aaa bbb ccc; do git worktree add -q --detach ../.b123-base-$n HEAD; done
git init -q -b main ../other && (cd ../other && git config user.email t@l && git config user.name t && echo z > z && git add z && git commit -qm z && git worktree add -q --detach ../.b123-base-zzz HEAD)
(cd ../.b123-base-bbb && sleep 30) & BUSY=$!; sleep 0.5
node -e "const r = require(process.argv[1]).prune(process.cwd(), '.b123-base-', require('path').resolve('../.b123-base-ccc')); console.log('PRUNE ' + JSON.stringify(r))" "$B206_ROOT/scripts/lib/base_worktrees.js"
for n in aaa bbb ccc zzz; do [ -d ../.b123-base-$n ] && echo "LEFT $n"; done
kill $BUSY 2>/dev/null; wait $BUSY 2>/dev/null; cd /; rm -rf $P
`;
  const r = cp.spawnSync('bash', ['-c', SH], { env: { ...process.env, B206_ROOT: ROOT }, encoding: 'utf8', timeout: 120000 });
  const o = r.stdout || ''; const left = (o.match(/^LEFT (\w+)$/gm) || []).map((l) => l.slice(5)).join(',');
  let pr = {}; try { pr = JSON.parse((o.match(/^PRUNE (.*)$/m) || [])[1] || '{}'); } catch (_e) { pr = {}; }
  ok(left === 'bbb,ccc,zzz' && (pr.removed || []).length === 1 && /\.b123-base-aaa$/.test(pr.removed[0]) && (pr.inUse || []).length === 1 && /\.b123-base-bbb \(pids \d+/.test(pr.inUse[0]),
    '13.1 its own old worktree is removed; the one it needs, one in use (named), and another clone’s are kept', `left ${left} · ${JSON.stringify(pr).slice(0, 200)}`);
}

const MUTS = [
  ['scripts/lib/floor_affected.mjs', '  const r = routeOf(p); if (r) out.add(r);\n', '', 'M1 the route rule lost', '6.2'],
  ['scripts/lib/floor_affected.mjs', "for (const [imp, d] of importers) if (!T.has(imp)) T.set(imp, `imports ${d}`);", '', 'M2 the importer rule lost', '6.3'],
  ['scripts/lib/floor_affected.mjs', "if (!seen.has(l) && exists(l)) { seen.add(l); stack.push(l); }", '', 'M3 the scripts/lib closure lost', '6.5'],
  ['scripts/lib/floor_affected.mjs', "if (texts.some(([, t]) => WALK_RE.test(t) && ROOT_RE.test(t)))", 'if (false)', 'M4 the walk rule lost (e-269)', '6.9'],
  ['scripts/lib/floor_affected.mjs', "if (!browser) { out.push({ member: m, run: true, why: 'no-browser (always run)' }); continue; }", '', 'M5 no-browser members selected like browser ones', '6.8'],
  ['scripts/run-floor.sh', 'if (m in ran) print', 'print', 'M6 the base not cut', '7.1'],
  ['scripts/train.sh', 'dup=$(sort "$W/m$i" | comm -12 - <(sort "$W/all")); [ -z "$dup" ] || stop "a path in two packages: $(echo $dup)"', 'true', 'M7 a path in two packages let through', '9.3'],
  ['scripts/run-floor.sh', '  if [ ! -f "$LOG_DIR/next-build.ok" ]; then', '  if true; then', 'M8 the resume builds again', '10.2'],
  ['scripts/run-floor.sh', 'floor_lock "$(git rev-parse --git-dir 2>/dev/null || echo .git)/tdw-floor.lock" "this tree"', 'true', 'M9 the clone\'s lock not taken (F-44.423)', '11.1'],
  ['scripts/run-floor.sh', '    if floor_owner_alive "$op" "$os"; then', '    if false; then', 'M10 a live owner not honoured (F-44.423)', '11.1'],
  ['scripts/run-floor.sh', "ALONE=$(grep -lx '// FLOOR-ALONE: yes' $NEEDS_CLEAN $REST 2>/dev/null | sort -u)", 'ALONE=""', 'M11 FLOOR-ALONE not read (F-44.421)', '12.1'],
  ['scripts/run-floor.sh', '  if [ -d .next ]; then rm -rf "$aside"; mv .next "$aside"', '  if false; then rm -rf "$aside"; mv .next "$aside"', 'M12 .next not moved aside (F-44.421)', '12.3'],
  ['scripts/lib/base_worktrees.js', '    if (pids.length) { out.inUse.push(', '    if (false) { out.inUse.push(', 'M13 a worktree in use removed (F-44.425)', '13.1'],
  ['scripts/lib/base_worktrees.js', "    if (!path.basename(dir).startsWith(prefix) || path.resolve(dir) === keepReal) continue;", "    if (!path.basename(dir).startsWith(prefix)) continue;", 'M14 the needed worktree removed too (F-44.425)', '13.1'],
];
if (CHILD) { console.log(`b206 child · ${pass} pass · ${fail} fail`); process.exit(fail ? 1 : 0); }
console.log('\n── 8  mutations (each in a fresh child, restored by sha) ──');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// F-44.419 (lesson 5): each mutation goes through scripts/lib/mutation_guard.js (the original kept and synced, then the
// marker, then the mutation), free space is checked first, and a killed run's mutation is restored at this bench's start.
const free = (() => { try { const f = fs.statfsSync(ROOT); return f.bavail * f.bsize; } catch (_e) { return null; } })();
ok(free === null || free >= 256 * 1024 * 1024, '8.0 free space before the first mutation (256 MB at least)', free === null ? 'statfs unavailable' : `${Math.round(free / 1048576)} MB`);
if (free !== null && free < 256 * 1024 * 1024) { console.log(`\nb206 · ${pass} pass · ${fail} fail`); process.exit(1); }
for (const [file, from, to, name, cell] of MUTS) {
  const p = path.join(ROOT, file); const src = fs.readFileSync(p, 'utf8'); const before = sha(p);
  if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
  let r; let planted = null;
  try { planted = guard.apply(ROOT, file, from, to, 'b206'); r = cp.spawnSync(process.execPath, [fileURLToPath(import.meta.url)], { env: { ...process.env, B206_CHILD: '1' }, encoding: 'utf8' }); }
  finally { if (planted) planted.restore(); else if (sha(p) !== before) fs.writeFileSync(p, src); }
  r = r || { status: null, stdout: '' };
  ok(r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '') && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
}
console.log(`\nb206 · ${pass} pass · ${fail} fail`);
process.exit(fail ? 1 : 0);
