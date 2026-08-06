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
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

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
// ── F-07.74 CURED · THE ONE STRIPPER (CE-ruled F1→(b1), F2→(a)) ──────────────
// This file used to carry its own copy of the naive rule. Eleven such copies
// existed across ten proofs and every one of them swallowed live code from an
// `accept="image/*"` to the next real `*/`. The definition now lives at
// scripts/lib/stripComments.mjs and nowhere else. §0 below carries the canaries.
const code = (rel) => stripComments(raw(rel));

const MANAGER = 'app/vendor/portfolio/page.tsx';
const C = code(MANAGER);
const R = raw(MANAGER);


// ═════════════════════════════════════════════════════════════════════════════
// §0 · THE CANARY — TDW_STRIPPER_CANARY (CE-120's law; F-07.74's cure)
// ═════════════════════════════════════════════════════════════════════════════
// The retired stripper treated the `/*` inside `accept="image/*"` as a comment
// open and deleted to the next real `*/`. Every absence-cell downstream of that
// deletion was acquitting over code it could not see — proven per instance by the
// plant-inside-the-bite probe, which stayed GREEN with the forbidden specimens
// planted inside the bite and REDDENS under the cure.
//
// The anchors below are LIVE CODE at the head, waist and tail of this bench's
// principal subject file. If a future stripper eats a region it eats one of them
// and this section reddens FIRST. §0.X drives the stripper directly (the mechanism,
// not the source — a planted `image/*` in production code is correctly harmless
// now), §0.Y is its vacuity twin, and §0.Z is F-07.99's cell: a definition with no
// call-site fooled this estate for a whole block, so the call-site is asserted.
sec('§0 · THE CANARY — the stripper must not swallow live code');
{
  const _c = code('app/vendor/portfolio/page.tsx');
  ok('§0.1 canary survives stripping — page.tsx: const [loading, setLoading] = useState(true)', _c.includes('const [loading, setLoading] = useState(true);'));
  ok('§0.2 canary survives stripping — page.tsx: finally { setUploading(false); setProgress(C', _c.includes('finally { setUploading(false); setProgress(COPY.B1); }'));
  ok('§0.3 canary survives stripping — page.tsx: dead={!igPicked.includes(item.source_url) &&', _c.includes('dead={!igPicked.includes(item.source_url) && igPicked.length >= igRoom}'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
              return (self.match(/\bcode\s*\(/g) || []).length >= 2; })());
}

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
// ── LABELED AMENDMENT, P4b probe (count preserved 1→1) ──────────────────────
// THIS CELL SAID "no script-assigned navigation ANYWHERE in the file". That was
// the right law when the file had one navigation. The CE-approved ?igprobe
// ladder deliberately ships shape D — a bare location assignment — because it
// is the one form never cleanly tested (its only prior instance ran against the
// wrong host, so its failure is unattributable between host and form).
//
// THE LAW THE CELL PROTECTS IS UNCHANGED and is now stated precisely: THE
// VENDOR-FACING PATH carries no script navigation. The probe panel is excised
// before the test, so a script navigation leaking OUT of the probe and into the
// submitted surface still reddens — which is the failure worth catching.
{
  const outsideProbe = C.replace(/\{igProbe && \(([\s\S]*?)\n            \)\}/, '');
  ok('§1.4 NO script-assigned navigation on the VENDOR-FACING path',
    !/window\.location\.href\s*=/.test(outsideProbe),
    'a location assignment reached the submitted surface');
}
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
// LABELED AMENDMENT, P4b probe (counts preserved 2→2): the gate was renamed
// igNeedsConnect -> igWantsUrl when the probe gained its one lawful exception
// (the founder's account is CONNECTED, so the ladder needs a url anyway). The
// PREDICATE the cells protect is unchanged, and §1.7 of the probe bench proves
// the new gate reduces to the old one whenever the probe is off.
ok('§2.2 the mint is gated on this vendor actually wanting a url',
  /const igNeedsConnect = Boolean\(/.test(C) && /const igWantsUrl = /.test(C) && /if \(!igWantsUrl\)/.test(C));
ok('§2.3 a vendor who needs no url arms no nonce — it is dropped when not wanted',
  /if \(!igWantsUrl\) \{ setIgAuthUrl\(null\)/.test(C));
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
// LABELED AMENDMENT, P4b probe (count preserved 1→1): H19 shipped as a MARKED
// DRAFT by CE ruling (the iOS fallback, built dark, veto owed). A blanket
// no-drafts assertion would then have reddened an honestly-marked slot — the
// exact inversion of what this cell exists for. Scoped to the four it was
// written for. [COMMENT AMENDED R-1, 2026-08-06: H19's veto has since executed
// (wording B) and the line is live in the iOS-standalone context — the probe
// bench's §5 owns its cells; this cell's scope and count are unchanged.]
ok('§4.5 no `DRAFT — veto owed` marker survives on H15..H18',
  ['H15','H16','H17','H18'].every(k => !new RegExp(`${k}: .*DRAFT — veto owed`).test(R)));
ok('§4.6 all four carry the executed veto\'s date',
  ['H15','H16','H17','H18'].every(k => new RegExp(`${k}: .*// VETOED 2026-07-30`).test(R)));
ok('§4.7 H18\'s presence-mandatory constraint is stated IN-FILE',
  /PRESENCE IS MANDATORY\. WORDING IS NOT\./.test(R));
ok('§4.8 and H18 still actually renders — the filed claim stays true',
  /COPY\.H18\.replace\('\{handle\}', ig\.ig_username\)/.test(C));

console.log(`\n──────── tdw07_p4b_slice1: ${pass}/${pass + fail} ────────`);
process.exit(fail === 0 ? 0 : 1);
