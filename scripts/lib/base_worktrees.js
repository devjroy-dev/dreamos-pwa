'use strict';
// scripts/lib/base_worktrees.js · CE-47 · F-44.425 (8 Oct 2026; built by ADS-2) · A BENCH KEEPS ONE BASE WORKTREE, NOT ONE PER BASE.
// Lives in scripts/lib/ so the floor's flat glob never collects it as a member (e-44.20).
//
// THE DEFECT. b123 (and b123_v2) add a git worktree beside the repo, `.b123-base-<sha12>`, for whichever --base they run
// at, give it node_modules (870 MB where hard links cannot cross), and never remove an old one: six sat beside the
// founder's repo. THE CURE. On start, before adding its own, the bench calls prune(ROOT, prefix, keep): every worktree of
// THIS repo whose folder name starts with the prefix, other than `keep`, is removed with `git worktree remove --force`.
// Two things are never touched: a worktree of ANOTHER clone (it is not in this repo's `git worktree list`, so two
// clones side by side keep each other's), and a worktree some process is still running in (its cwd inside it; read by
// /proc where there is one, by lsof on the Mac), which is named and left for the next start. `git worktree prune`
// then drops the registrations whose folders are already gone.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function listed(root) {   // this repo's worktrees: [{ dir }]
  const r = spawnSync('git', ['worktree', 'list', '--porcelain'], { cwd: root, encoding: 'utf8' });
  return String(r.stdout || '').split('\n').filter((l) => l.startsWith('worktree ')).map((l) => ({ dir: l.slice(9).trim() }));
}
function inUse(dir) {   // pids whose working directory is inside dir
  const real = (() => { try { return fs.realpathSync(dir); } catch (_e) { return dir; } })();
  const pids = [];
  if (fs.existsSync('/proc')) {
    for (const p of fs.readdirSync('/proc')) {
      if (!/^\d+$/.test(p) || Number(p) === process.pid) continue;
      let cwd = ''; try { cwd = fs.readlinkSync(`/proc/${p}/cwd`); } catch (_e) { continue; }
      if (cwd === real || cwd.startsWith(real + path.sep)) pids.push(Number(p));
    }
  } else {
    const r = spawnSync('lsof', ['-a', '-d', 'cwd', '-Fpn', '+D', real], { encoding: 'utf8' });
    for (const l of String(r.stdout || '').split('\n')) if (/^p\d+$/.test(l)) pids.push(Number(l.slice(1)));
  }
  return pids;
}
/** Remove every worktree of this repo named <prefix>* except `keep`. Returns { removed, inUse, failed }. */
function prune(root, prefix, keep) {
  const out = { removed: [], inUse: [], failed: [] };
  const keepReal = keep ? path.resolve(keep) : null;
  for (const { dir } of listed(root)) {
    if (!path.basename(dir).startsWith(prefix) || path.resolve(dir) === keepReal) continue;
    const pids = inUse(dir);
    if (pids.length) { out.inUse.push(`${dir} (pids ${pids.join(', ')})`); continue; }
    const r = spawnSync('git', ['worktree', 'remove', '--force', dir], { cwd: root, encoding: 'utf8' });
    if (r.status === 0 && !fs.existsSync(dir)) out.removed.push(dir); else out.failed.push(`${dir}: ${(r.stderr || '').trim().split('\n')[0]}`);
  }
  spawnSync('git', ['worktree', 'prune'], { cwd: root });
  return out;
}
module.exports = { prune, listed, inUse };
