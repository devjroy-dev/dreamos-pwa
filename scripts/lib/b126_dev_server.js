'use strict';
// scripts/lib/b126_dev_server.js · CE-45 · IGD-1 · CUT 1 · rung b126's dev server, started and STOPPED WHOLE.
// Lives in scripts/lib/ so run-floor.sh's flat glob never collects it as a bench (e-44.20).
//
// THE WHOLE-TREE STOP (the chair's rider, from FE-2's F-44.160 cure and F-44.163's class: a dev server that outlives its
// rung). FE-2's bytes had not landed at d78461c7, so this is the same rule written from the chair's description, not a copy:
//   1. `next dev` is spawned DETACHED, so it leads its own process group;
//   2. stop() signals the WHOLE GROUP (-pid) with SIGTERM, waits, then SIGKILL to the group;
//   3. stop() then PROVES the port is free (a refused connection) and says so; a live port after the stop is reported to
//      the bench, which fails the run rather than leaving a server behind.
// A-45.6: the server's own output goes to this rung's last-run log (os.tmpdir()/b126_last_run.log), overwritten each run.
const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

const LOG = path.join(os.tmpdir(), 'b126_last_run.log');

function portOpen(port) {
  return new Promise((resolve) => {
    const s = net.connect({ port, host: '127.0.0.1' });
    s.once('connect', () => { s.destroy(); resolve(true); });
    s.once('error', () => resolve(false));
    s.setTimeout(1500, () => { s.destroy(); resolve(false); });
  });
}

async function start(root, port, env) {
  const fd = fs.openSync(LOG, 'w');
  fs.writeSync(fd, `b126 dev server, port ${port}, started ${new Date().toISOString()}\n`);
  const dev = spawn(path.join(root, 'node_modules', '.bin', 'next'), ['dev', '-p', String(port)], {
    cwd: root, detached: true, stdio: ['ignore', fd, fd], env: { ...process.env, ...env },
  });
  let stopped = false;
  const stop = async () => {
    if (stopped) return { stopped: true, portFree: !(await portOpen(port)) };
    stopped = true;
    try { process.kill(-dev.pid, 'SIGTERM'); } catch (_e) { /* already gone */ }
    for (let i = 0; i < 10 && await portOpen(port); i += 1) await new Promise((r) => setTimeout(r, 500));
    try { process.kill(-dev.pid, 'SIGKILL'); } catch (_e) { /* gone */ }
    await new Promise((r) => setTimeout(r, 500));
    const portFree = !(await portOpen(port));
    try { fs.writeSync(fd, `stopped ${new Date().toISOString()} port free: ${portFree}\n`); fs.closeSync(fd); } catch (_e) { /* closed */ }
    return { stopped: true, portFree };
  };
  const up = async () => {
    for (let i = 0; i < 150; i += 1) {
      try { const r = await fetch(`http://localhost:${port}/`); if (r) return true; } catch (_e) { /* not yet */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
  };
  const kill = () => { try { process.kill(-dev.pid, 'SIGKILL'); } catch (_e) { /* gone */ } };
  process.once('exit', kill);
  process.once('SIGINT', () => { kill(); process.exit(130); });
  process.once('SIGTERM', () => { kill(); process.exit(143); });
  return { dev, up, stop, log: LOG };
}

module.exports = { start, portOpen, LOG };
