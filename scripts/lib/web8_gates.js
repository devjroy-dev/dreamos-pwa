'use strict';
// scripts/lib/web8_gates.js · WEB-8 · two gates WEB-8's mutating benches (b172, b210, b270) pass before they run.
// Lives in scripts/lib/ so run-floor.sh's flat glob never collects it as a bench.
//
// siblingOrRefuse (CE-47 lesson 4): a bench that reads ../dream-os names the commit it needs and REFUSES, exit 3, when
//   the sibling is missing, is not a git checkout, does not hold that commit, or is older than it. It prints the
//   sibling's own commit when it runs, so every log says which server the bench read.
// spaceOrRefuse (CE-47 lesson 5, F-44.419): before any mutation is planted, the disk the tree sits on must have room
//   for the kept copy, the marker, the mutated file and the run's own writes; otherwise the bench REFUSES, exit 3 (the
//   floor's "refused": cannot run here), and plants nothing. A full disk can empty a file mid-write; this gate keeps a series from starting on one.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// The last dream-os commit to change src/lib/site/ (the files these benches read): WEB-4 cut 17, 6 October 2026.
const SITE_NEEDS = '6fddb0d';
const SITE_NEEDS_WHY = 'WEB-4 cut 17, the last change to src/lib/site/';

function siblingDir(root, envName = 'TDW_DREAM_OS') {
  return process.env[envName] ? path.resolve(process.env[envName]) : path.join(root, '..', 'dream-os');
}

function siblingOrRefuse(dir, need, why, bench) {
  const git = (...a) => spawnSync('git', ['-C', dir, ...a], { encoding: 'utf8' });
  const refuse = (what) => {
    console.log(`  ${bench}: REFUSING TO RUN. ${what}`);
    console.log(`  This bench reads ${dir} and needs dream-os ${need} (${why}) or later. Bring it to dream-os main and run again.`);
    process.exit(3);
  };
  if (!fs.existsSync(dir)) refuse(`There is no ${dir}.`);
  const head = git('rev-parse', '--short=12', 'HEAD');
  if (head.status !== 0) refuse(`${dir} is not a git checkout.`);
  const at = head.stdout.trim();
  if (git('cat-file', '-e', `${need}^{commit}`).status !== 0) refuse(`${dir} is at ${at} and does not hold ${need} (older, or not fetched).`);
  if (git('merge-base', '--is-ancestor', need, 'HEAD').status !== 0) refuse(`${dir} is at ${at}, which is older than ${need}.`);
  console.log(`  ${bench}: ../dream-os is at ${at} (needs ${need} or later: ${why})`);
  return at;
}

function spaceOrRefuse(root, bench, minMB = 512) {
  let freeMB = null;
  try { const s = fs.statfsSync(root); freeMB = Math.floor((s.bavail * s.bsize) / (1024 * 1024)); } catch (_e) { freeMB = null; }
  if (freeMB === null || freeMB < minMB) {
    console.log(`  ${bench}: REFUSING TO PLANT ANY MUTATION. Free space on the disk under ${root} is ${freeMB === null ? 'unreadable' : freeMB + ' MB'}; this bench needs ${minMB} MB (F-44.419). Nothing was changed.`);
    process.exit(3);
  }
  return freeMB;
}

module.exports = { SITE_NEEDS, SITE_NEEDS_WHY, siblingDir, siblingOrRefuse, spaceOrRefuse };
