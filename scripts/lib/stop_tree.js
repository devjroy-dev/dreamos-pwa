'use strict';
// scripts/lib/stop_tree.js · TDW CE-45 · FE-2 · F-44.163 (closed): the whole-tree stop, waited on.
//
// A bench that stops its `next dev` with process.kill(-pid) signals npx's process group and returns at once.
// next-server can outlive it and hold the project root, and Next 16 then refuses the NEXT bench's server
// (b87's :3989 did this to b122, F-44.160). This is the stop b122 and b123 use, shared: the whole process
// tree is found from `ps` BEFORE any signal (a child reparents once its parent dies), every pid is sent
// SIGTERM, the stop WAITS until each is gone, and any still alive after 20s is sent SIGKILL. Synchronous, so
// it is a drop-in for the one-line stop it replaces. The runner's reaper (A-45.13) remains the backstop.
const { spawnSync } = require('child_process');

function treeOf(root) {
  const rows = String(spawnSync('ps', ['-eo', 'pid,ppid'], { encoding: 'utf8' }).stdout || '').split('\n').slice(1)
    .map((l) => l.trim().split(/\s+/).map(Number)).filter((r) => r.length === 2 && r[0]);
  const out = [root];
  for (let k = 0; k < out.length; k += 1) for (const [pid, ppid] of rows) if (ppid === out[k] && !out.includes(pid)) out.push(pid);
  return out;
}
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (_e) { return false; } };

/** Stop a detached dev server's whole process tree and wait until every pid is gone. */
function stopTree(pid) {
  if (!pid) return;
  const tree = treeOf(pid);
  try { process.kill(-pid, 'SIGTERM'); } catch (_e) { /* no group */ }
  for (const p of tree) { try { process.kill(p, 'SIGTERM'); } catch (_e) { /* gone */ } }
  for (let t = 0; t < 20 && tree.some(alive); t += 1) spawnSync('sleep', ['1']);
  for (const p of tree.filter(alive)) { try { process.kill(p, 'SIGKILL'); } catch (_e) { /* gone */ } }
  for (let t = 0; t < 10 && tree.some(alive); t += 1) spawnSync('sleep', ['0.5']);
}

module.exports = { stopTree, treeOf };
