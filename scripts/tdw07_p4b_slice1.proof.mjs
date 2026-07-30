#!/usr/bin/env node
// scripts/tdw07_p4b_slice1.proof.mjs
// TDW_07 P4b SLICE 1 — the dreamos-pwa half's floor.
//
// WHAT THIS BENCH IS FOR: F-07.22's cure (b) — the connect control becomes a
// real <a href> over a destination minted BEFORE render — and the founder-found
// stuck-muted button, cured at BOTH its sites.
//
// WHAT IT CANNOT PROVE, STATED SO NOBODY READS MORE INTO A GREEN THAN IS THERE:
// this bench proves the WIRING, never that iOS behaves. Whether the navigation
// form was the disease is decidable only on the founder's handset, and the
// smoke card names that as the one truth only his device can witness
// (BENCHED-THE-MECHANISM-NOT-THE-AFFORDANCE, protocol §10).
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — inherited from tdw07_p1/p2/p3 (CE §C proposed its
// promotion; until that lands it is re-derived, and the ORDER below is
// load-bearing: line comments first, block comments second).
//
// IT MATTERS PARTICULARLY HERE. This sitting's cure is heavily commented, and
// several of those comments QUOTE the diseased code they replaced — the string
// `window.location.href` survives in prose at the very site that no longer
// performs it. A cell reading raw text would acquit or convict on the comment.
// Cells judge CODE.
const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => raw(rel)
  .split('\n').map(l => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const MANAGER = 'app/vendor/portfolio/page.tsx';
const C = code(MANAGER);
const R = raw(MANAGER);

sec('§1 · THE NAVIGATION IS A LINK (F-07.22, cure (b))');
ok('§1.1 the connect control renders an anchor over the pre-minted url',
  /<a\s+href=\{igAuthUrl\}/.test(C));
ok('§1.2 the anchor carries NO onClick — nothing runs between finger and nav',
  (() => {
    const m = C.match(/<a\s+href=\{igAuthUrl\}[\s\S]*?>/);
    return !!m && !/onClick/.test(m[0]);
  })());
ok('§1.3 the old awaiting handler `igConnect` is GONE by name',
  !/function\s+igConnect\s*\(/.test(C) && !/onClick=\{igConnect\}/.test(C));
ok('§1.4 NO script-assigned navigation survives anywhere in the file',
  !/window\.location\.href\s*=/.test(C),
  'a location assignment remains in CODE (comments are stripped before this cell)');
ok('§1.5 the retry control is a BUTTON, and buttons here never navigate',
  /onClick=\{igConnectRetry\}/.test(C)
  && (() => {
    const body = C.match(/async function igConnectRetry\(\)[\s\S]*?\n  \}/);
    return !!body && !/location/.test(body[0]);
  })());
ok('§1.6 the unminted state is a real control, not a hrefless <a> (F-07.13 class)',
  /igAuthUrl \? \(/.test(C) && /<button type="button"[^>]*onClick=\{igConnectRetry\}/.test(C));

sec('§2 · THE DESTINATION EXISTS BEFORE THE TAP');
ok('§2.1 mintIgAuthUrl is a stable useCallback', /const mintIgAuthUrl = useCallback\(/.test(C));
ok('§2.2 the mint is gated on this vendor actually needing to connect',
  /const igNeedsConnect = Boolean\(/.test(C) && /if \(!igNeedsConnect\)/.test(C));
ok('§2.3 a connected vendor arms no nonce — the url is dropped when not needed',
  /if \(!igNeedsConnect\) \{ setIgAuthUrl\(null\)/.test(C));
{
  // DERIVED, NOT ASSERTED: the refresh threshold is read out of the file and
  // compared against the server's own TTL. A cell that hard-coded 8 minutes
  // would pass over a constant someone had quietly raised past the TTL — the
  // tautology class this block has now been bitten by more than once.
  const m = C.match(/const MINT_REFRESH_MS = ([^;]+);/);
  const refresh = m ? Function(`"use strict";return (${m[1]})`)() : NaN;
  const SERVER_TTL_MS = 10 * 60 * 1000; // src/lib/vendor/igOAuth.js STATE_TTL_MS
  ok('§2.4 the re-mint threshold is UNDER the server state TTL, with headroom',
    Number.isFinite(refresh) && refresh > 0 && refresh < SERVER_TTL_MS,
    `refresh=${refresh} ttl=${SERVER_TTL_MS}`);
}

sec('§3 · THE STUCK-MUTED BUTTON — BOTH SITES (founder-found)');
ok('§3.1 a pageshow listener re-arms the restored page', /addEventListener\('pageshow'/.test(C));
ok('§3.2 a visibilitychange listener does the same for the tab', /addEventListener\('visibilitychange'/.test(C));
ok('§3.3 both listeners are removed on cleanup — no accumulating handlers',
  /removeEventListener\('pageshow'/.test(C) && /removeEventListener\('visibilitychange'/.test(C));
{
  // THE SCOPE IS THE CURE'S SAFETY. A blanket setIgBusy(null) on visibility
  // would re-arm the IMPORT button mid-import — trading a stuck control for a
  // double write. Both reset sites must use the 'connect'-scoped updater.
  const scoped = (C.match(/setIgBusy\(b => \(b === 'connect' \? null : b\)\)/g) || []).length;
  ok('§3.4 the reset is scoped to \'connect\' at BOTH sites, never blanket',
    scoped === 2, `scoped resets found: ${scoped}`);
}
ok('§3.5 the ?ig= return effect carries the explicit reset',
  (() => {
    const eff = C.match(/const outcome = q\.get\('ig'\);[\s\S]*?replaceState/);
    return !!eff && /setIgBusy\(b => \(b === 'connect' \? null : b\)\)/.test(eff[0]);
  })());
ok('§3.6 the restored page re-mints when its state has aged past the threshold',
  /Date\.now\(\) - igAuthMintedAt > MINT_REFRESH_MS/.test(C));

sec('§4 · THE COPY — H15..H18 VETOED 2026-07-30 「 ok 」');
ok('§4.1 H15 byte-exact',  /H15: 'Reel',/.test(R));
ok('§4.2 H16 byte-exact',  /H16: 'Album',/.test(R));
ok('§4.3 H17 byte-exact',  /H17: 'Reels come in as their cover photo\.',/.test(R));
ok('§4.4 H18 byte-exact',  /H18: 'Connected as @\{handle\}',/.test(R));
ok('§4.5 no `DRAFT — veto owed` marker survives in the file',
  !/DRAFT — veto owed/.test(R));
ok('§4.6 all four carry the executed veto\'s date',
  ['H15','H16','H17','H18'].every(k => new RegExp(`${k}: .*// VETOED 2026-07-30`).test(R)));
ok('§4.7 H18\'s presence-mandatory constraint is stated IN-FILE',
  /PRESENCE IS MANDATORY\. WORDING IS NOT\./.test(R));
ok('§4.8 and H18 still actually renders — the filed claim stays true',
  /COPY\.H18\.replace\('\{handle\}', ig\.ig_username\)/.test(C));

console.log(`\n──────── tdw07_p4b_slice1: ${pass}/${pass + fail} ────────`);
process.exit(fail === 0 ? 0 : 1);
