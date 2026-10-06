// scripts/b206_ce47_floor_affected_bench.mjs · CE-47 · ADS-2 · THE AFFECTED-ONLY CHECK (the chair's ruling, 3 Oct 2026).
// FLOOR-SUBJECTS: scripts/lib/floor_affected.mjs scripts/run-floor.sh
// Holds: scripts/lib/floor_affected.mjs (the selection, driven on fixture trees in memory, every rule both ways) and
// run-floor.sh's --affected wiring (its own base-cut program run on fixtures; the skip placed before any ledger line).
// No browser, no network. Mutations of the selector and the runner run in fresh children, restored by sha.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import cp from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.join(HERE, '..');
const CHILD = !!process.env.B206_CHILD;
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

const MUTS = [
  ['scripts/lib/floor_affected.mjs', '  const r = routeOf(p); if (r) out.add(r);\n', '', 'M1 the route rule lost', '6.2'],
  ['scripts/lib/floor_affected.mjs', "for (const [imp, d] of importers) if (!T.has(imp)) T.set(imp, `imports ${d}`);", '', 'M2 the importer rule lost', '6.3'],
  ['scripts/lib/floor_affected.mjs', "if (!seen.has(l) && exists(l)) { seen.add(l); stack.push(l); }", '', 'M3 the scripts/lib closure lost', '6.5'],
  ['scripts/lib/floor_affected.mjs', "if (texts.some(([, t]) => WALK_RE.test(t) && ROOT_RE.test(t)))", 'if (false)', 'M4 the walk rule lost (e-269)', '6.9'],
  ['scripts/lib/floor_affected.mjs', "if (!browser) { out.push({ member: m, run: true, why: 'no-browser (always run)' }); continue; }", '', 'M5 no-browser members selected like browser ones', '6.8'],
  ['scripts/run-floor.sh', 'if (m in ran) print', 'print', 'M6 the base not cut', '7.1'],
  ['scripts/train.sh', 'dup=$(sort "$W/m$i" | comm -12 - <(sort "$W/all")); [ -z "$dup" ] || stop "a path in two packages: $(echo $dup)"', 'true', 'M7 a path in two packages let through', '9.3'],
];
if (CHILD) { console.log(`b206 child · ${pass} pass · ${fail} fail`); process.exit(fail ? 1 : 0); }
console.log('\n── 8  mutations (each in a fresh child, restored by sha) ──');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for (const [file, from, to, name, cell] of MUTS) {
  const p = path.join(ROOT, file); const src = fs.readFileSync(p, 'utf8'); const before = sha(p);
  if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
  fs.writeFileSync(p, src.replace(from, to));
  let r; try { r = cp.spawnSync(process.execPath, [fileURLToPath(import.meta.url)], { env: { ...process.env, B206_CHILD: '1' }, encoding: 'utf8' }); } finally { fs.writeFileSync(p, src); }
  ok(r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '') && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
}
console.log(`\nb206 · ${pass} pass · ${fail} fail`);
process.exit(fail ? 1 : 0);
