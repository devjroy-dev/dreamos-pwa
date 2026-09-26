'use strict';
// scripts/b129_g61_settings_scroll_bench.js · TDW CE-45 · G6-1 · F-44.166 · rung b129.
//
// WHAT IT HOLDS: in the shell, /vendor/settings scrolls as ONE page. Before this cut exactly one element scrolled there: the
// region at components/vendor/SettingsScreen.tsx :219 ("overflow: hidden visible", which the browser computes as overflow-y
// auto), 89 px tall over 1,359 px at 374 x 900, inside a `flex: 1; min-height: 0` parent (:207) squeezed by the rows above it;
// the shell's own page scroller, main.wl-main, never scrolled. The cure (shell mode only; chrome mode unchanged): :207 takes its
// natural height; :219's overflowX is 'clip' (no scroll container) instead of 'hidden'.
// HOW: the REAL shell in headless Chromium against `next dev` (374 x 900, both themes, /me answered at the network): the only
// scroller on /vendor/settings is main.wl-main and Sign out is reached by scrolling it; /vendor/storefront is a control. A
// production mutation (restoring 'hidden') must redden it. Ports read from tcp AND tcp6 (A-45.10); no server outlives it.
// No clock is read. THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const P = (r) => path.join(ROOT, r);
const read = (r) => fs.readFileSync(P(r), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
// A reader whose subject is code strips comments before it matches, THROUGH THE ONE HOME (f0774 2.2 and 2.3c), so no
// comment can satisfy a cell; b40's own import of the home's CommonJS twin.
const { stripComments } = require('./lib/stripComments.cjs');
const strip = stripComments;
const SS = 'components/vendor/SettingsScreen.tsx';
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
const PORT = 3994;
const tcpLines = () => ['/proc/net/tcp', '/proc/net/tcp6'].flatMap((f) => { try { return fs.readFileSync(f, 'utf8').split('\n').slice(1); } catch (_e) { return []; } });
const listenInodes = (ports) => { const s = new Set(); for (const l of tcpLines()) { const c = l.trim().split(/\s+/); if (c[3] === '0A' && ports.includes(parseInt((c[1] || ':0').split(':').pop(), 16))) s.add(c[9]); } return s; };
const listening = (port) => listenInodes([port]).size > 0;
function killPort(port) {
  const ino = listenInodes([port]);
  for (const pid of fs.readdirSync('/proc').filter((d) => /^\d+$/.test(d))) {
    try { for (const fd of fs.readdirSync(`/proc/${pid}/fd`)) { const m = /socket:\[(\d+)\]/.exec(fs.readlinkSync(`/proc/${pid}/fd/${fd}`)); if (m && ino.has(m[1])) { process.kill(Number(pid), 'SIGKILL'); break; } } } catch (_e) { /* not ours */ }
  }
}

(async () => {
  sec('1  the cure, in the source (shell mode only)');
  const src = read(SS);
  const code = strip(src);
  ok(/style=\{chrome \? \{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 \} : \{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' \}\}/.test(code),
    '1.1 :207 in the shell takes its natural height (flex 0 0 auto, no min-height 0); chrome mode keeps flex 1 / min-height 0');
  ok(/overflowY: chrome \? 'auto' : 'visible', overflowX: chrome \? 'hidden' : 'clip'/.test(code), '1.2 :219 in the shell clips sideways without becoming a scroller; chrome mode keeps hidden');

  sec('2  the real shell, both themes (C-43.18)');
  const probe = (mode, route) => {
    const r = spawnSync('node', [P('scripts/lib/b129_scroll_probe.mjs'), String(PORT), mode, route], { encoding: 'utf8', timeout: 200000 });
    if (r.status === 3) return { noBrowser: true };
    try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 200)}` }; }
  };
  const onlyMain = (o) => o && !o.error && !o.noBrowser && (o.errors || []).length === 0 && o.scrollers.length === 1 && o.scrollers[0].tag === 'MAIN' && /wl-main/.test(o.scrollers[0].cls);
  ok(!listening(PORT), `2.0 the dev port ${PORT} is free before this bench starts its server (tcp and tcp6)`);
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], { cwd: ROOT, stdio: 'ignore', detached: true,
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  const restores = [];
  try {
    for (let i = 0; i < 120; i += 1) { try { if (await fetch(`http://localhost:${PORT}/`)) break; } catch (_e) { /* not yet */ } await new Promise((r) => setTimeout(r, 1000)); }
    await new Promise((r) => setTimeout(r, 4000));
    for (const mode of ['dark', 'light']) {
      const o = probe(mode, '/vendor/settings');
      ok(onlyMain(o), `2.1 ${mode}: /vendor/settings has exactly ONE scroller, and it is the shell's page (main.wl-main)`, JSON.stringify(o));
      ok(o.hasSignOut && o.signOutVisible && o.main && o.main.sh > o.main.h, `2.2 ${mode}: scrolling the page reaches Sign out (the whole of Settings is on one scroll)`, JSON.stringify({ main: o.main, so: o.signOutVisible }));
    }
    { const o = probe('dark', '/vendor/storefront');
      ok(o && !o.error && !o.noBrowser && o.scrollers.every((s) => s.tag === 'MAIN' && /wl-main/.test(s.cls)), '2.3 control: /vendor/storefront scrolls only in main.wl-main, as every shell room should', JSON.stringify(o && o.scrollers)); }

    sec('3  mutation of production code (must turn its cell red; restored by sha)');
    const before = sha(src);
    // M1 restores the PRE-CURE state, BOTH halves: each half alone already cures (with :207 at its natural height :219 has
    // nothing to scroll; with :219 clipped its overflow spills into main.wl-main), so only both together bring the bug back.
    const mut = src.replace("overflowX: chrome ? 'hidden' : 'clip'", "overflowX: 'hidden'")
      .replace("style={chrome ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } : { flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}", "style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}");
    let applied = mut !== src; let red = false;
    if (applied) { fs.writeFileSync(P(SS), mut); restores.push(src); await new Promise((r) => setTimeout(r, 7000));
      try { const o = probe('dark', '/vendor/settings'); red = !onlyMain(o); } finally { fs.writeFileSync(P(SS), src); } }
    ok(applied && red && sha(read(SS)) === before, "3 M1 the pre-cure state restored (both halves): applies, reddens 2.1, restored by sha", JSON.stringify({ applied, red }));
  } catch (e) { ok(false, `2.x the room run: ${String(e && e.message).split('\n')[0]}`); }
  finally {
    for (const s of restores) fs.writeFileSync(P(SS), s);
    try { process.kill(-dev.pid, 'SIGKILL'); } catch (_e) { /* gone */ }
    killPort(PORT);
    for (let i = 0; i < 20 && listening(PORT); i += 1) await new Promise((r) => setTimeout(r, 250));
  }
  console.log(`\nb129 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.log(`b129 CRASHED: ${(e && e.stack) || e}`); process.exit(1); });
