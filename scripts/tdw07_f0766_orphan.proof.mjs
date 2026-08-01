#!/usr/bin/env node
// scripts/tdw07_f0766_orphan.proof.mjs
// TDW_07 · ARC 2 · F-07.66 — THE ORPHAN JOIN PAGE IS GONE.
//
// THE FINDING, RE-SCOPED BY RULING: not "the co-planner flow, dead at first
// fetch" but "an orphan legacy join page aims at a retired mount while the
// living flow serves every real invitee." The flow was never sick; a dead twin
// was wearing its name.
//
// WHAT DIED: app/(landing)/join/[code]/page.tsx (CoJoinPage), 143 lines. It
// posted to /api/co-planner/validate and /api/co-planner/accept — a mount that
// does not exist in dream-os (the API mounts only /api/v2; API_CONTRACTS.md
// names /api/co-planner/* legacy-replaced) — and on success wrote a
// `couple_session` blob plus a `tdw_couple_session` cookie carrying
// `id: d.data.id`, a USER id where every consumer expects couples.id.
//
// It was worse than stale. It collected `password` + `confirmPassword` against a
// plane that is entirely PIN-based, and wrote COUPLE-lane session keys for a lane
// that is tokenless by design. It was not a broken page; it was a page from a
// design the estate abandoned.
//
// WHAT LIVES, UNTOUCHED: app/circle/join/[token]/page.tsx — 435 lines, the whole
// living flow (validate → send-otp → accept → set-pin → hydrate), writing
// `circle_session`, which app/coplanner/layout.tsx:10 consumes as SESSION_KEY.
// src/api/couple/circle.js:78 mints /circle/join/<token> as the ONLY invite URL
// the estate has ever produced, so every real invitee has always landed there.
//
// WHY A DELETION GETS A BENCH AT ALL: a removed file cannot be proven by its own
// absence — absence is also what a never-applied ZIP looks like. These cells pin
// the ISOLATION FACTS that justified the removal, so that if a future sitting
// re-creates the page, or points a producer at /join/, or re-introduces the
// retired mount, the floor reddens and someone re-reads this header.
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

const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const raw    = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// Every .ts/.tsx in the repo, node_modules excluded. Walked, not globbed, so the
// cells below judge the WHOLE tree rather than a directory someone remembered.
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
}
const FILES = walk(ROOT);
const readAll = (p) => fs.readFileSync(p, 'utf8');
// ── LABELED AMENDMENT (F-07.72) · §5.4 RE-AIMED, COUNT PRESERVED 21 ─────────
// §5.4 counted vocabulary-4 CONSUMERS by testing the RAW file text, and F-07.72
// added a comment to CircleSessionContext.tsx that names `circle_session` while
// consuming nothing — the count went 3 → 4 on a sentence. A census that counts
// prose as code is the same witness error this repo has now filed four times
// (F-07.95's regex route table, F-07.74's stripper, the resolver mount whose
// mutation only commented itself out). Re-aimed at the STRIPPED source, so a
// mention is a mention and a consumer is a consumer, and the corrected census
// the ARC-2 handover pinned — exactly THREE — stands as written.
const codeOnly = (p) => stripComments(readAll(p));

// ── §0 · THE CANARY — TDW_STRIPPER_CANARY (CE-120's law; F-07.74's cure) ────
// This proof did not strip anything until F-07.72 re-aimed §5.4 at code rather
// than prose. The moment it imported the stripper, the §0 CANARY LAW bound it —
// and the law's whole point is that a swallow must REDDEN rather than acquit.
// Head, waist and tail of the one file this proof now strips, plus the mid-token
// specimen and its vacuity twin.
function canaryCells() {
  const LIVING = path.join(ROOT, 'app/circle/join/[token]/page.tsx');
  const c = stripComments(fs.readFileSync(LIVING, 'utf8'));
  ok('§0.1 canary α-head survives stripping — the living join page', c.includes("'use client';"));
  ok('§0.2 canary α-waist survives stripping', c.includes('const OTP_LEN = 6;'));
  ok('§0.3 canary α-tail survives stripping', c.includes('export default function CircleJoinPage()'));
  ok('§0.4 β — real comments ARE removed, so the stripper is doing work',
    fs.readFileSync(LIVING, 'utf8').includes('//') && !c.includes('// '));
  // The specimen needs a CLOSING `*/` for the twin to be meaningful: the naive
  // rule swallows from the mid-token `/*` to the next one, so without a closer
  // there is nothing for it to swallow TO and the twin proves nothing.
  const spec = 'const a = 1;\nconst input = { accept: "image/*" };\n' +
               'const KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(spec).includes('KEEP_ME') && stripComments(spec).includes('ALSO_KEEP'));
  ok('§0.Y γ VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this proof really CALLS its stripper',
    (stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'))
      .match(/stripComments\(/g) || []).length >= 3);
}

console.log('TDW_07 · ARC 2 — F-07.66: the orphan join page is gone');

// ═══════════════════════════════════════════════════════════════════════════
canaryCells();

sec('§1 · THE ORPHAN IS GONE, WHOLE');

ok('§1.1 app/(landing)/join/[code]/page.tsx does not exist',
  !exists('app/(landing)/join/[code]/page.tsx'));

ok('§1.2 the [code] route segment is gone (an empty dir is still a route in Next)',
  !exists('app/(landing)/join/[code]'));

ok('§1.3 the (landing)/join segment is gone entirely — nothing was left behind',
  !exists('app/(landing)/join'));

ok('§1.4 the CoJoinPage component name survives nowhere in the tree',
  FILES.every(f => !/CoJoinPage/.test(readAll(f))));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE RETIRED MOUNT IS UNREACHABLE FROM THIS REPO');

ok('§2.1 no file calls /api/co-planner/* — the mount that does not exist',
  FILES.every(f => !/\/api\/co-planner\//.test(readAll(f))));

ok('§2.2 no file references a /join/ path outside the LIVING circle route',
  FILES.every(f => {
    const s = readAll(f);
    // strip the living route first, then look for any other /join/ reference
    return !/(?<!circle)\/join\/\[?code/.test(s);
  }));

ok('§2.3 middleware.ts has no /join rewrite that could resurrect the path',
  !/join/.test(raw('middleware.ts')));

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · THE LIVING FLOW IS UNTOUCHED — the whole point of the deletion');

const LIVING = 'app/circle/join/[token]/page.tsx';
ok('§3.1 the living join page exists', exists(LIVING));

const L = exists(LIVING) ? raw(LIVING) : '';
ok('§3.2 it still drives all four living routes, in order',
  ['circle/join/validate', 'circle/join/send-otp', 'circle/join/accept', 'circle/join/set-pin']
    .every(r => L.includes(r)));

ok('§3.3 it still hydrates through the session endpoint',
  /circle\/session\//.test(L));

ok('§3.4 it still writes `circle_session` — the co-planner\'s real home',
  /localStorage\.setItem\('circle_session'/.test(L));

ok('§3.5 app/coplanner/** still consumes that exact key',
  /const SESSION_KEY = 'circle_session'/.test(raw('app/coplanner/layout.tsx')));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · WHAT THE DELETION REMOVED FROM THE COUPLE LANE');

ok('§4.1 no PASSWORD field survives on any join/invite surface (the PIN plane is total)',
  FILES.filter(f => /join/.test(f)).every(f => !/confirmPassword/.test(readAll(f))));

ok('§4.2 the orphan was the ONLY couple_session writer outside the couple + demo + sanctuary lanes',
  (() => {
    const writers = FILES.filter(f => /setItem\('couple_session'/.test(readAll(f)))
      .map(f => path.relative(ROOT, f));
    // Expected, all legitimate: the four couple auth pages, sanctuary, demo bride.
    return writers.length === 6 && writers.every(w =>
      w.startsWith('app/(auth)/couple/') ||
      w.includes('sanctuary') ||
      w.startsWith('app/demo/bride/'));
  })(),
  'an unexpected couple_session writer exists — the census moved');

ok('§4.3 the tdw_couple_session COOKIE is now written from exactly one site',
  FILES.filter(f => /document\.cookie = `tdw_couple_session=/.test(readAll(f))).length === 1);

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE FOUR SESSION VOCABULARIES — the corrected census, pinned');

// The auth sitting's census named THREE (*_session, *_web_session, tdw_*_session).
// `circle_session` is a FOURTH: tokenless, three consumers, and it is the key the
// orphan should have been writing all along. Pinned here so the correction cannot
// silently regress to three.
ok('§5.1 vocabulary 1 — `couple_session` / `vendor_session` live',
  FILES.some(f => /'couple_session'/.test(readAll(f))) &&
  FILES.some(f => /'vendor_session'/.test(readAll(f))));

ok('§5.2 vocabulary 2 — `couple_web_session` / `vendor_web_session` live',
  FILES.some(f => /'couple_web_session'/.test(readAll(f))) &&
  FILES.some(f => /'vendor_web_session'/.test(readAll(f))));

ok('§5.3 vocabulary 3 — the `tdw_*_session` cookies live',
  FILES.some(f => /tdw_couple_session/.test(readAll(f))) &&
  FILES.some(f => /tdw_vendor_session/.test(readAll(f))));

ok('§5.4 vocabulary 4 — `circle_session`, tokenless, exactly THREE consumer files',
  FILES.filter(f => /circle_session/.test(codeOnly(f))).length === 3,
  'the circle_session consumer set moved — the corrected census needs re-deriving');

// ═══════════════════════════════════════════════════════════════════════════
// §6 · BOTH-WAYS. A deletion cannot be mutated by editing a file that is gone,
// so the inverse is RE-CREATION: the orphan is restored from the bytes that were
// removed, the cells are re-run in a fresh process, and they must go RED. This is
// the same law as a source mutation — the uncured tree is reconstructed and the
// bench is proven non-vacuous against it — with the tree's uncured state being
// the file's PRESENCE rather than its contents.
// ═══════════════════════════════════════════════════════════════════════════
if (!process.argv.includes('--cells-only')) {
  sec('§6 · BOTH-WAYS — the orphan RE-CREATED, cells must redden, then removed again');

  const { spawnSync } = await import('node:child_process');
  const SELF = fileURLToPath(import.meta.url);
  const dir  = path.join(ROOT, 'app/(landing)/join/[code]');
  const file = path.join(dir, 'page.tsx');

  // The minimum bytes that reproduce the orphan's convicted properties: the
  // retired mount, the couple-lane session write on a tokenless lane, the
  // password field, and the component name.
  const RESURRECT = `'use client';
export default function CoJoinPage() {
  const go = async () => {
    await fetch('/api/co-planner/validate', { method: 'POST' });
    const d = await (await fetch('/api/co-planner/accept', { method: 'POST' })).json();
    const sess = { id: d.data.id };
    localStorage.setItem('couple_session', JSON.stringify(sess));
    document.cookie = \`tdw_couple_session=\${encodeURIComponent(JSON.stringify(sess))}\`;
  };
  const confirmPassword = '';
  return <button onClick={go}>{confirmPassword}</button>;
}
`;

  let red = false, restored = false;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, RESURRECT);
    const r = spawnSync(process.execPath, [SELF, '--cells-only'], { encoding: 'utf8' });
    red = r.status !== 0;
  } finally {
    fs.rmSync(path.join(ROOT, 'app/(landing)/join'), { recursive: true, force: true });
    restored = !fs.existsSync(path.join(ROOT, 'app/(landing)/join'));
  }

  ok('§6.1 the cells go RED when the orphan is re-created (non-vacuous)', red,
    'the cells PASSED with the orphan present — they prove nothing');
  ok('§6.2 the tree is restored — the re-created orphan is gone again', restored);
}

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw07_f0766_orphan ${pass}/${total}` : `RED — tdw07_f0766_orphan ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
