'use strict';
// scripts/fe9_first_build_poll_bench.js · CE-47 · FE-9 · THE TWO-MINUTE START, PACKAGE 1 · followBuild's bound, on a fake clock.
// The 3-minute limit cannot be walked twenty times for real, so the module itself (v2/lib/vendor/api/firstBuild.ts) is
// compiled and run with its request helper and its timer replaced: each beat advances a fake clock by exactly the poll
// interval, so the bound is proven by count, not by waiting. No browser, no network, no real time.
//   1.1 a build that never ends: followBuild settles 'too_long' after exactly POLL_LIMIT_MS / POLL_MS beats, then stops
//   1.2 a build that ends on the 4th read: 'ended' after 4 reads, nothing read after
//   1.3 a failed read is retried on the next beat (still bounded), and a later good read is heard
//   1.4 stop(): no read after it, and it settles 'stopped'
//   1.5 the interval and the limit are the contract's: 2 seconds, 3 minutes
// RED MUTATION (run by the seat, restored by sha): in followBuild drop `if (now() - started >= POLL_LIMIT_MS) ...` -> 1.1
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ts = require(path.join(ROOT, 'node_modules/typescript'));
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 300) + ']'}`); } }

function load(answer) {
  const src = fs.readFileSync(path.join(ROOT, 'v2/lib/vendor/api/firstBuild.ts'), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
  const clock = { t: 0 }; const reads = [];
  const base = { getJson: async (p) => { reads.push(p); return answer(reads.length, p); }, postJson: async () => ({ ok: true }), patchJson: async () => ({ ok: true }) };
  const timers = [];
  const ctx = { module: { exports: {} }, exports: {}, console, Promise, localStorage: undefined,
    require: (m) => { if (m === '@/lib/vendor/api/_base') return base; throw new Error('unexpected import ' + m); },
    // THE BEAT CAP (e-275): past limit/interval + 5 beats nothing more is scheduled, so a followBuild with no limit still
    // lets this bench finish and fail 1.1 by name instead of running forever.
    setTimeout: (fn, ms) => { timers.push(ms); clock.t += ms; if (timers.length <= CAP) Promise.resolve().then(fn); return timers.length; }, clearTimeout: () => {} };
  ctx.exports = ctx.module.exports; vm.createContext(ctx); vm.runInContext(js, ctx);
  return { M: ctx.module.exports, clock, reads, timers };
}
const CAP = 180000 / 2000 + 5;
const running = { ok: true, state: 'running', steps: [], site_ready: false };
const doneB = { ok: true, state: 'done', steps: [], site_ready: true };

(async () => {
  console.log('\n§1 followBuild, bounded and waiting on the build itself');
  { const L = load(() => running); const heard = [];
    const f = L.M.followBuild('b1', (b) => heard.push(b.state), () => L.clock.t);
    const how = await Promise.race([f.done, new Promise((r) => setTimeout(() => r('no verdict: ran past the cap'), 2000))]); const beats = L.M.POLL_LIMIT_MS / L.M.POLL_MS;
    ok(how === 'too_long' && L.reads.length === beats + 1 && L.timers.every((ms) => ms === L.M.POLL_MS), '1.1 never ends: settles too_long after the limit, one read per beat, then stops', JSON.stringify({ how, reads: L.reads.length, beats })); }
  { const L = load((n) => (n >= 4 ? doneB : running)); const heard = [];
    const how = await L.M.followBuild('b1', (b) => heard.push(b.state), () => L.clock.t).done;
    ok(how === 'ended' && L.reads.length === 4 && heard[heard.length - 1] === 'done', '1.2 ends on the 4th read: settles ended, nothing read after', JSON.stringify({ how, reads: L.reads.length, heard })); }
  { const L = load((n) => (n === 2 ? { ok: false } : n >= 3 ? doneB : running)); const heard = [];
    const how = await L.M.followBuild('b1', (b) => heard.push(b.state), () => L.clock.t).done;
    ok(how === 'ended' && L.reads.length === 3 && JSON.stringify(heard) === '["running","done"]', '1.3 a failed read is retried on the next beat; the later answer is heard', JSON.stringify({ how, reads: L.reads.length, heard })); }
  { const L = load(() => running);
    const f = L.M.followBuild('b1', () => {}, () => L.clock.t); f.stop(); const how = await f.done; const n = L.reads.length;
    await new Promise((r) => setImmediate(r));
    ok(how === 'stopped' && L.reads.length === n && n <= 1, '1.4 stop(): settles stopped, nothing read after', JSON.stringify({ how, reads: L.reads.length })); }
  { const L = load(() => running); ok(L.M.POLL_MS === 2000 && L.M.POLL_LIMIT_MS === 180000, '1.5 every 2 seconds, for 3 minutes (the contract)'); }
  console.log(`\nfe9_first_build_poll: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('crashed: ' + (e && e.stack || e)); process.exit(1); });
