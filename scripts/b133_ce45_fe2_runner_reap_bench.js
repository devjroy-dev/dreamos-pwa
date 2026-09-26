#!/usr/bin/env node
'use strict';
// scripts/b133_ce45_fe2_runner_reap_bench.js · TDW CE-45 · FE-2 · A-45.13 (F-44.160 closed at the runner).
//
// WHAT IT PINS
//  §1 THE WIRING: run-floor.sh calls scripts/lib/floor_reap.sh once before the floor and once after EVERY
//     member (the call sits directly after the member's exit code is read), and lists the leaks it names.
//  §2 THE REAPER, DRIVEN, on a real `next dev` left running in this root by a fixture "member":
//     2.1 nothing running -> it prints nothing and exits 0;
//     2.2 a leaked server -> one LEAK line naming the member and the port, and afterwards no next dev runs in
//         the root (the WHOLE tree stopped, waited on);
//     2.3 a SHELL whose command line merely contains "next dev" is never touched (its first cut stopped its
//         own calling shell this way).
//  §3 THE MUTATION: a copy of the reaper that names the leak but stops nothing must leave
//     a survivor, and 2.2's "root free afterwards" check must redden on it, so that check is not hollow.
//  AMENDED BY LABEL · CE-46 FE-3 (r3, ruled F1(a), F2(c) and A-46.2, 27 Sept 2026): the runner keeps every
//  member's output and prints the tail of every red, and the same directory is its resume ledger. Six cells were
//  sealed at r2; §4 and §5 below add nine (15 in all), driven on a FIXTURE FLOOR: a throwaway repo holding a copy of the REAL
//  runner bytes and four fixture members (green, red, error, refused), so the runner is driven end to end in
//  seconds without running this estate's 140 benches inside a bench.
//   §4 THE KEPT OUTPUT: 4.1 the floor names its log directory and keeps one log per member, each closed by its
//      trailer; 4.2 the tail of every RED, ERROR and REFUSED member is printed after the set and a green's is not;
//      4.3 the tail is bounded at 25 lines; 4.4 MUTATION: a runner whose tail prints nothing reddens 4.2.
//   §5 THE LEDGER: 5.1 --resume skips a kept GREEN and re-runs red, error and refused; 5.2 a missing log re-runs;
//      5.3 a cut-off log (no trailer) re-runs; 5.4 MUTATION: a resume that skips any kept log reddens 5.1;
//      5.5 --resume on a tree that moved is refused.
// THE EXIT CODE IS THE VERDICT (0 green, 1 red).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REAP = path.join(ROOT, 'scripts/lib/floor_reap.sh');
const RUNNER = path.join(ROOT, 'scripts/run-floor.sh');
let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('  PASS  ' + name); } else { fail++; console.log('  FAIL  ' + name + '  [' + why + ']'); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// A next dev process in THIS root: a node program, cwd the root, a next dev command line (the reaper's own rule)
const rootDevs = () => String(spawnSync('ps', ['-eo', 'pid=,comm=,args='], { encoding: 'utf8' }).stdout || '').split('\n')
  .map((l) => l.trim().match(/^(\d+)\s+(\S+)\s+(.*)$/)).filter(Boolean)
  .filter(([, pid, comm, args]) => (comm === 'node' || comm.startsWith('next-server')) && /next dev|next-server|\/\.next\/|\/next\/dist\//.test(args)
    && (() => { try { return fs.readlinkSync(`/proc/${pid}/cwd`) === ROOT; } catch (_e) { return false; } })())
  .map(([, pid]) => Number(pid));
const reap = (script, member) => spawnSync('bash', [script, member], { cwd: ROOT, encoding: 'utf8', timeout: 90000 });
async function leak(port) {
  // a fixture "member" that starts a server in this root and never stops it
  const d = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(port)], { cwd: ROOT, detached: true, stdio: 'ignore',
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true' } });
  d.unref();
  for (let i = 0; i < 150; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '5', `http://localhost:${port}/`], { encoding: 'utf8' });
    if (/^[1-5]\d\d$/.test(r.stdout) && r.stdout !== '000') return true;
    await sleep(1000);
  }
  return false;
}

(async () => {
  console.log('b133 · A-45.13 · the floor stops and names any next dev a member leaves in the root');
  // §1 · the wiring
  const run = fs.readFileSync(RUNNER, 'utf8');
  const before = /LEAK_LINE=\$\(bash scripts\/lib\/floor_reap\.sh "\(before the floor\)"\)/.test(run);
  const after = /rc=\$\?\n\s*LEAK_LINE=\$\(bash scripts\/lib\/floor_reap\.sh "\$n"\)/.test(run);
  const listed = /A-45\.13 · members that left a next dev running in the root/.test(run);
  cell('1.1 run-floor.sh reaps before the floor, after EVERY member (right after its exit is read), and lists the leaks',
    before && after && listed ? null : `before ${before} · after ${after} · listed ${listed}`);

  if (rootDevs().length) { cell('2.0 no next dev runs in the root before this bench', 'already running: ' + rootDevs().join(', ')); return done(); }
  // 2.1 · nothing to reap
  const r0 = reap(REAP, 'b133-quiet');
  cell('2.1 with nothing running, the reaper prints nothing and exits 0', r0.status === 0 && !r0.stdout.trim() ? null : `exit ${r0.status} · printed "${r0.stdout.trim()}"`);
  // 2.3 · a shell that only MENTIONS next dev, in the root, is left alone
  const bystander = spawn('bash', ['-c', 'sleep 60 # next dev -p 3985 (a shell that only mentions it)'], { cwd: ROOT, detached: true, stdio: 'ignore' });
  bystander.unref();
  await sleep(500);
  // 2.2 · a real leak
  const up = await leak(3985);
  if (!up) { cell('2.2 a leaked next dev is named and stopped, whole tree', 'the fixture server never answered'); try { process.kill(-bystander.pid); } catch (_e) { /* gone */ } return done(); }
  const r1 = reap(REAP, 'b133-fixture');
  await sleep(1000);
  const left = rootDevs();
  cell('2.2 a leaked next dev: ONE LEAK line naming the member and the port; afterwards no next dev in the root',
    r1.status !== 0 ? `exit ${r1.status}` : !/^LEAK: b133-fixture left a next dev running in the root \(pids [\d ]+; ports [^)]*3985[^)]*\); stopped, whole tree$/m.test(r1.stdout) ? `printed "${r1.stdout.trim()}"`
      : r1.stdout.trim().split('\n').length !== 1 ? 'more than one line' : left.length ? 'still alive: ' + left.join(', ') : null);
  let bystanderAlive = false; try { process.kill(bystander.pid, 0); bystanderAlive = true; } catch (_e) { /* gone */ }
  cell('2.3 a shell whose command line merely contains "next dev" is never touched', bystanderAlive ? null : 'the reaper stopped a shell');
  try { process.kill(-bystander.pid, 'SIGKILL'); } catch (_e) { /* gone */ }

  // §3 · the mutation: a reaper that stops only each candidate's own pid, never its tree
  const mut = path.join(os.tmpdir(), `b133-reap-mutant-${process.pid}.sh`);
  const src = fs.readFileSync(REAP, 'utf8');
  // THE MUTATION (re-aimed, e-153): a reaper that NAMES the leak but STOPS NOTHING. The first form hard-killed only
  // the first candidate, which is npx where npx reports itself as `node` (the seat's sandbox) but the next dev
  // itself where npx titles itself `npm exec` (his Codespace), and there next-server exits with its parent, so
  // nothing survived and 3.1 could not bite. A reaper whose kills are removed leaves the server running on ANY
  // machine, so 2.2's "root free afterwards" check must redden on it: deterministic everywhere.
  const planted = src.replace(/kill -TERM \$tree 2>\/dev\/null \|\| true/, 'true').replace(/kill -KILL \$alive 2>\/dev\/null \|\| true/, 'true').replace(/for _ in \$\(seq 1 20\)/, 'for _ in $(seq 1 1)');
  if (planted === src) { cell('3.1 the mutation applies', 'anchor not found in floor_reap.sh'); return done(); }
  fs.writeFileSync(mut, planted);
  const up2 = await leak(3984);
  const r2 = up2 ? reap(mut, 'b133-mutant') : { stdout: '' };
  await sleep(1500);
  const survivors = rootDevs();
  cell('3.1 MUTATION (a reaper that names the leak but stops nothing): a survivor holds the root, so 2.2\u2019s "root free" check reddens on it',
    !up2 ? 'the fixture server never answered' : survivors.length ? null : 'nothing survived: 2.2\u2019s check could be hollow');
  // clean up after the mutant with the real reaper, and prove the root is free again
  const r3 = reap(REAP, 'b133-cleanup');
  await sleep(1000);
  cell('3.2 the real reaper then frees the root, naming the leak', rootDevs().length === 0 && /^LEAK: b133-cleanup/m.test(r3.stdout) ? null : `left ${rootDevs().join(', ')} · printed "${r3.stdout.trim()}"`);
  try { fs.unlinkSync(mut); } catch (_e) { /* gone */ }

  // §4 and §5 · the kept output and the ledger, on a fixture floor (CE-46 FE-3)
  const runnerSrc = fs.readFileSync(RUNNER, 'utf8');
  const F = fs.mkdtempSync(path.join(os.tmpdir(), 'b133-floor-'));
  const COUNTS = path.join(F, '_counts');                       // outside the fixture repo: never dirt
  const TMP = path.join(F, '_tmp');                              // the fixture floor's own log home
  const REPO = path.join(F, 'repo');
  fs.mkdirSync(COUNTS); fs.mkdirSync(TMP);
  for (const d of ['scripts/lib', 'node_modules/puppeteer-core', 'node_modules/@sparticuz/chromium']) fs.mkdirSync(path.join(REPO, d), { recursive: true });
  fs.writeFileSync(path.join(REPO, 'package.json'), '{ "name": "b133-fixture" }\n');
  fs.writeFileSync(path.join(REPO, '.gitignore'), 'node_modules/\n');
  fs.copyFileSync(REAP, path.join(REPO, 'scripts/lib/floor_reap.sh'));
  const member = (name, body) => fs.writeFileSync(path.join(REPO, `scripts/${name}.js`), `'use strict';\nrequire('fs').appendFileSync(process.env.B133_COUNTS + '/${name}', 'run\\n');\n${body}\n`);
  member('f_green', "console.log('GREEN_MARKER_LINE green member output'); process.exit(0);");
  member('f_red', "for (let i = 1; i < 60; i += 1) console.log('line ' + String(i).padStart(2, '0')); console.log('CELL_MARKER_RED the cell that failed'); process.exit(1);");
  member('f_error', "console.error('ERROR_MARKER_LINE thrown'); process.exit(2);");
  member('f_refused', "console.log('REFUSED_MARKER_LINE no subject'); process.exit(3);");
  const git = (...a) => spawnSync('git', a, { cwd: REPO, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'b133', GIT_AUTHOR_EMAIL: 'b133@fixture', GIT_COMMITTER_NAME: 'b133', GIT_COMMITTER_EMAIL: 'b133@fixture' } });
  git('init', '-q'); git('add', '-A'); git('commit', '-q', '-m', 'fixture');
  // The runner itself stays UNTRACKED in the fixture (written by floor() below, so the mutants in 4.4 and 5.4 are
  // written the same way): the fixture's dirty SET is then `?? scripts/run-floor.sh` under real and mutant bytes
  // alike, so the ledger's tree check (5.5's subject) does not refuse the mutant resume in 5.4 and that cell tests
  // the skip rule, never the refusal. The runner's own NOTE about the dirt is expected in every fixture floor.
  const floor = (src, ...args) => {
    fs.writeFileSync(path.join(REPO, 'scripts/run-floor.sh'), src);
    return spawnSync('bash', ['scripts/run-floor.sh', ...args], { cwd: REPO, encoding: 'utf8', timeout: 120000,
      env: { ...process.env, TMPDIR: TMP, B133_COUNTS: COUNTS } });
  };
  const count = (n) => { try { return fs.readFileSync(path.join(COUNTS, n), 'utf8').split('run\n').length - 1; } catch (_e) { return 0; } };
  const LOGS = path.join(TMP, 'tdw-floor-pwa');
  const lastLine = (n) => { try { const t = fs.readFileSync(path.join(LOGS, n + '.log'), 'utf8').trimEnd().split('\n'); return t[t.length - 1]; } catch (_e) { return '(missing)'; } };

  const f1 = floor(runnerSrc);
  const dirLine = (f1.stdout.match(/^FLOOR LOGS: (\S+)/m) || [])[1];
  const id = fs.existsSync(path.join(LOGS, 'floor.id')) ? fs.readFileSync(path.join(LOGS, 'floor.id'), 'utf8').split('\n')[0] : '';
  const logs = fs.existsSync(LOGS) ? fs.readdirSync(LOGS).filter((x) => x.endsWith('.log')).sort() : [];
  const trailers = { f_green: `KEPT GREEN floor=${id}`, f_red: `KEPT RED rc=1 floor=${id}`, f_error: `KEPT ERROR rc=2 floor=${id}`, f_refused: `KEPT REFUSED rc=3 floor=${id}` };
  const badTrailer = Object.keys(trailers).filter((n) => lastLine(n) !== trailers[n]);
  cell('4.1 the floor names its log directory, keeps one log per member, and closes each with its verdict trailer for this floor',
    dirLine === LOGS && id && logs.join() === 'f_error.log,f_green.log,f_red.log,f_refused.log' && badTrailer.length === 0 ? null
      : `dir ${dirLine} · id "${id}" · logs ${logs.join()} · bad trailers ${badTrailer.map((n) => n + '=' + lastLine(n)).join(' ')}`);
  // each tail ends on the member's own trailer, the cell line just above it
  const tailsOk = /^---- RED: f_red ----\n(?:.*\n)*?  \| CELL_MARKER_RED the cell that failed\n  \| KEPT RED rc=1 floor=/m.test(f1.stdout)
    && /^---- ERROR: f_error ----\n  \| floor .*\n  \| ERROR_MARKER_LINE thrown\n  \| KEPT ERROR rc=2 floor=/m.test(f1.stdout)
    && /^---- REFUSED: f_refused ----\n  \| floor .*\n  \| REFUSED_MARKER_LINE no subject\n  \| KEPT REFUSED rc=3 floor=/m.test(f1.stdout);
  cell('4.2 after the set, the last lines of every RED, ERROR and REFUSED member are printed under its name, and a green\u2019s are not',
    tailsOk && !/GREEN_MARKER_LINE/.test(f1.stdout) ? null : `stdout:\n${f1.stdout.slice(-1500)}`);
  // 25 lines = lines 37..59 of the red member (23), its cell line, its trailer; line 36 is on disk and not on screen
  cell('4.3 the tail is bounded at 25 lines (line 37 of the red member is shown, line 36 is not; the full log is on disk)',
    /^  \| line 37$/m.test(f1.stdout) && !/^  \| line 36$/m.test(f1.stdout) && /^line 36$/m.test(fs.readFileSync(path.join(LOGS, 'f_red.log'), 'utf8')) ? null : 'bound not held');
  // §5 · the ledger
  const c0 = { g: count('f_green'), r: count('f_red'), e: count('f_error'), x: count('f_refused') };
  const r5 = floor(runnerSrc, '--resume', LOGS);
  const c1 = { g: count('f_green'), r: count('f_red'), e: count('f_error'), x: count('f_refused') };
  cell('5.1 --resume DIR: the member kept GREEN is not run again; the red, the error and the refused run again; the skip is announced',
    r5.status === 0 && c1.g === c0.g && c1.r === c0.r + 1 && c1.e === c0.e + 1 && c1.x === c0.x + 1 && /^A-46\.2 · --resume: 1 member\(s\) kept GREEN from floor /m.test(r5.stdout) ? null
      : `exit ${r5.status} · before ${JSON.stringify(c0)} · after ${JSON.stringify(c1)} · ${r5.stdout.slice(0, 400)}`);
  fs.unlinkSync(path.join(LOGS, 'f_green.log'));
  floor(runnerSrc, '--resume', LOGS);
  const c2 = count('f_green');
  cell('5.2 a member whose log is missing runs again on --resume', c2 === c1.g + 1 ? null : `green ran ${c2 - c1.g} time(s)`);
  const gl = path.join(LOGS, 'f_green.log');
  fs.writeFileSync(gl, fs.readFileSync(gl, 'utf8').replace(/KEPT GREEN floor=.*\n?$/, ''));
  floor(runnerSrc, '--resume', LOGS);
  const c3 = count('f_green');
  cell('5.3 a member whose log has no trailer (cut off mid-run) runs again on --resume', c3 === c2 + 1 ? null : `green ran ${c3 - c2} time(s)`);
  const lax = runnerSrc.replace(/\[ "\$\(tail -n 1 "\$LOG"\)" = "KEPT GREEN floor=\$\{FLOOR_ID\}" \]/, 'true');
  if (lax === runnerSrc) cell('5.4 the resume mutation applies', 'anchor (the KEPT GREEN test) not found');
  else { const before = count('f_red'); const m54 = floor(lax, '--resume', LOGS);
    cell('5.4 MUTATION (a resume that skips any kept log, red included): the red member is not run again, so 5.1 reddens on it',
      /STOP/.test(m54.stdout) ? 'the mutant resume was refused, not tested: ' + m54.stdout.slice(0, 200) : count('f_red') === before ? null : 'the red still re-ran: 5.1 could be hollow'); }
  const fid = path.join(LOGS, 'floor.id');
  const idLines = fs.readFileSync(fid, 'utf8').split('\n');
  fs.writeFileSync(fid, `${idLines[0]}\nhead=0000000000000000000000000000000000000000 dirt=moved\n`);
  const before5 = count('f_green') + count('f_red');
  const r55 = floor(runnerSrc, '--resume', LOGS);
  cell('5.5 --resume on a tree that moved since the floor began is refused, exit 1, nothing run',
    r55.status === 1 && /^STOP — --resume refused: the tree moved since floor /m.test(r55.stdout) && count('f_green') + count('f_red') === before5 ? null : `exit ${r55.status} · ${r55.stdout.slice(0, 300)}`);
  // 4.4 runs last: its mutant floor re-mints the ledger, which §5 needed intact
  const tailless = runnerSrc.replace(/^TAIL_LINES=25$/m, 'TAIL_LINES=0');
  if (tailless === runnerSrc) cell('4.4 the tail mutation applies', 'anchor TAIL_LINES=25 not found');
  else { const m = floor(tailless); cell('4.4 MUTATION (a runner whose tail prints nothing): the red member\u2019s cell is absent from the floor\u2019s output, so 4.2 reddens on it',
    !/CELL_MARKER_RED/.test(m.stdout) && /^RED: f_red$/m.test(m.stdout) ? null : 'the marker still printed: 4.2 could be hollow'); }

  fs.rmSync(F, { recursive: true, force: true });
  return done();
})();

function done() {
  console.log(`\nb133: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}
