#!/usr/bin/env node
// scripts/tdw_auth_crossover.proof.mjs
// THE AUTH SITTING · ARC 1 · CLIENT HALF of the ruled `tdw_auth_crossover.proof`
//
// The proof the CE named is ONE proof in TWO halves — its subject spans two
// repos and neither repo's floor can run the other's tree:
//   · THIS FILE — dreamos-pwa: fork 1(b)'s lane assertion, the client half of
//                 the F-05.30 reversal, and F-07.71's parity branch.
//   · dream-os/scripts/b07_auth_crossover_bench.js
//               — the four server acceptance edges, F-07.62's helper, F-06.85.
// Each half names the other; the cross-repo pinning precedent is F-07.50's.
//
// ── THE NAMED TEST, per acceptance ② ─────────────────────────────────────────
// THE SPECIMEN ITSELF: a vendor-authenticated context on a couple surface must
// be REFUSED-or-ISOLATED, never silently resolved. At this layer that means
// getAccessToken() must return NULL when the shared `access_token` slot is
// holding the vendor lane's token — and must not launder it into the couple
// cookie on the way past.
//
// ── THE CACHING LAW (CE-117), STATED NOT ASSUMED ─────────────────────────────
// Every read below goes through fs.readFileSync at call time; this proof holds
// no module cache of the files it judges. §6's mutations bust cache by PROCESS
// BOUNDARY: each edits the production source, re-runs THIS script as a fresh
// node process (`--cells-only`), asserts a non-zero exit, then restores and
// verifies byte-identity. No mutation is proven inside an already-warm process.
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(SELF), '..');
const CELLS_ONLY = process.argv.includes('--cells-only');

let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — inherited from tdw07_p1/p2/p3/p4b/f0760. Order is
// load-bearing: line comments first, block comments second.
//
// IT MATTERS ACUTELY HERE. This cure's comments QUOTE the diseased code they
// replaced: the literal `readCookie(VENDOR_COOKIE)` and the literal
// `tdw_vendor_token` both survive in prose at the very sites that no longer
// perform them. A cell reading raw text would acquit or convict on a comment.
// CELLS JUDGE CODE.
const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
// ── F-07.74 CURED · THE ONE STRIPPER (CE-ruled F1→(b1), F2→(a)) ──────────────
// This file used to carry its own copy of the naive rule. Eleven such copies
// existed across ten proofs and every one of them swallowed live code from an
// `accept="image/*"` to the next real `*/`. The definition now lives at
// scripts/lib/stripComments.mjs and nowhere else. §0 below carries the canaries.
const code = (rel) => stripComments(raw(rel));

const BASE_P    = 'lib/frost-api/_base.ts';
const FROST_P   = 'app/(frost)/frost/canvas/onboarding/page.tsx';
// F-07.72 — the third lane's client half.
const CTX_P     = 'app/coplanner/CircleSessionContext.tsx';
const LAYOUT_P  = 'app/coplanner/layout.tsx';
const JOURNEY_P = 'lib/frost/journey.ts';
const SIBLING_P = 'app/(auth)/couple/onboarding/page.tsx';

const B  = code(BASE_P),  Br  = raw(BASE_P);
const F  = code(FROST_P), Fr  = raw(FROST_P);
const Sr = raw(SIBLING_P);

if (!CELLS_ONLY) console.log('THE AUTH SITTING · ARC 1 — the token-lane crossover, client half');

// ═══════════════════════════════════════════════════════════════════════════

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
  const _c = code('lib/frost-api/_base.ts');
  ok('§0.1 canary survives stripping — _base.ts: return !!s && JSON.parse(s).demo === true;', _c.includes('return !!s && JSON.parse(s).demo === true;'));
  ok('§0.2 canary survives stripping — _base.ts: function vendorLaneToken(): string | null {', _c.includes('function vendorLaneToken(): string | null {'));
  ok('§0.3 canary survives stripping — _base.ts: export async function apiPatch<T>(path: stri', _c.includes('export async function apiPatch<T>(path: string, body: unknown): Promise<T> {'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
              return (self.match(/\bcode\s*\(/g) || []).length >= 2; })());
}

sec('§1 · THE LANE ASSERTION — the specimen refused at the read authority');

ok('§1.1 SPECIMEN — the bare slot is compared against the vendor lane\'s own token',
  /if \(fromStorage === vendorLaneToken\(\)\) return null;/.test(B),
  'the shared slot is still returned unexamined — a vendor login still clobbers the bride');

ok('§1.2 the witness is the VENDOR blob, which is the lane that reliably records its token',
  /localStorage\.getItem\('vendor_session'\)/.test(B) &&
  /localStorage\.getItem\('vendor_web_session'\)/.test(B) &&
  /parsed\.access_token/.test(B));

ok('§1.3 the assertion runs BEFORE the cookie sync — the laundering path is closed',
  B.indexOf('vendorLaneToken()') < B.indexOf('writeCookie(COUPLE_COOKIE, fromStorage)'),
  'the vendor token is still written into the couple cookie before it is judged');

ok('§1.4 the helper fails CLOSED — an unreadable/absent vendor blob returns null, never a throw',
  /catch \{\s*return null;\s*\}/.test(B.slice(B.indexOf('function vendorLaneToken'))));

ok('§1.5 the assertion is confined to THIS FILE, as ruled (fork 1(b) scope)',
  (B.match(/vendorLaneToken/g) || []).length >= 2);

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · F-05.30 REVERSED — the client cross-lane cookie fallback is gone');

ok('§2.1 the ITP fallback reads the COUPLE cookie only',
  /const fromCookie = readCookie\(COUPLE_COOKIE\);/.test(B),
  'the vendor cookie is still a fallback for couple surfaces');

ok('§2.2 NO code path in the read authority reads the vendor cookie',
  !/readCookie\(VENDOR_COOKIE\)/.test(B),
  'a cross-lane cookie read survives in code');

ok('§2.3 the private-mode catch arm was narrowed too (it had its own copy of the crossing)',
  !/return readCookie\(COUPLE_COOKIE\) \|\| readCookie\(VENDOR_COOKIE\);/.test(B));

ok('§2.4 the reversal is NAMED in prose, not silently applied',
  /F-05\.30 REVERSED BY RULING/.test(Br),
  'a standing ruling was reversed without ink at the site');

ok('§2.5 the literal `VENDOR_COOKIE` survives in PROSE only — the provenance is intact',
  /VENDOR_COOKIE/.test(Br) && !/readCookie\(VENDOR_COOKIE\)/.test(B));

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · F-07.71 — the parity branch, on the founder\'s verbatim 「 b 」');

ok('§3.1 the raw-error toast is preceded by a status branch',
  F.indexOf('res.status === 401 || res.status === 403') > -1 &&
  F.indexOf('res.status === 401 || res.status === 403') < F.indexOf('showToast(d.error'),
  'the server\'s raw string still reaches the bride first');

ok('§3.2 the branch renders the SIBLING\'S SHIPPED BYTE — moved, never authored',
  /showToast\('Session expired\. Please sign in again\.'\)/.test(F));

ok('§3.3 BYTE-IDENTITY with the sibling site, proven by extraction not by eye',
  (() => {
    const re = /showToast\('([^']*Session expired[^']*)'\)/;
    const mine = F.match(re), theirs = Sr.match(re);
    return !!mine && !!theirs && mine[1] === theirs[1];
  })(),
  'the parity string diverged from the site it was lifted from');

ok('§3.4 ZERO new user-facing strings — the copy inventory\'s expected-zero holds',
  (() => {
    const before = new Set((code(SIBLING_P).match(/showToast\('([^']*)'\)/g) || []));
    const mineToasts = (F.match(/showToast\('([^']*)'\)/g) || []);
    // every toast literal in the cured file must already exist somewhere shipped
    const shipped = new Set([...before,
      "showToast('Something went wrong. Try again.')",
      "showToast('Could not connect. Try again.')"]);
    return mineToasts.every(s => shipped.has(s) || /d\.error/.test(s));
  })());

ok('§3.5 the NON-auth remainder is FILED in-file, not papered over',
  /THE REMAINDER IS FILED, NOT PAPERED/.test(Fr) && /F-07\.71/.test(Fr),
  'the open half of the finding is undisclosed at its own site');

ok('§3.6 the fallthrough still exists — the cure narrowed the path, it did not delete error handling',
  /showToast\(d\.error \|\| 'Something went wrong\. Try again\.'\)/.test(F));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · WHAT DID NOT MOVE (regressions are worse than missing features, §8)');

ok('§4.1 the couple cookie is still written on a successful read — ITP survival intact for the BRIDE',
  /writeCookie\(COUPLE_COOKIE, fromStorage\)/.test(B));

ok('§4.2 the cookie-restore-to-localStorage path survives',
  /localStorage\.setItem\('access_token', fromCookie\)/.test(B));

ok('§4.3 getCoupleSession and its tdw_couple_session fallback are UNTOUCHED',
  /readCookie\('tdw_couple_session'\)/.test(B) && /localStorage\.getItem\('couple_session'\)/.test(B));

ok('§4.4 isBrideDemoMode — the F-05.39 one authority — is untouched',
  /export function isBrideDemoMode\(\): boolean/.test(B) &&
  /localStorage\.getItem\('tdw_bride_demo_session'\)/.test(B));

ok('§4.5 the frost onboarding\'s own !token guard is untouched (it fires FIRST on a crossed device)',
  /if \(!token \|\| !coupleId\)/.test(F));

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · SCOPE — the parallel-sitting fences held');

ok('§5.1 sanctuary/page.tsx is NOT in this delivery (P6 owns it; the residue is F-07.70)',
  !fs.existsSync(path.join(ROOT, '__arc1_touched_sanctuary__')) &&
  /F-07\.70/.test(Br),
  'the split is undisclosed at the site that creates it');

ok('§5.2 the ruled scope is stated at the cure, so the next reader inherits it',
  /SCOPE, RULED: this assertion lives in THIS FILE ONLY/.test(Br));


// ═══════════════════════════════════════════════════════════════════════════
sec('§6.5 · THE TRIANGLE (F-07.72) — a THIRD lane joined, and it must not cross');
// F-07.65 proved the couple and vendor lanes refuse each other's credentials.
// F-07.72 gave the CIRCLE lane a credential of its own, and a two-lane proof
// cannot catch a three-lane crossing: these very cells would have gone on
// passing while the new lane crossed both of them. Extended by CE ruling §3(4);
// the count movement is DISCLOSED, never smoothed.
{
  const CTX    = code(CTX_P);
  const LAYOUT = code(LAYOUT_P);
  const JOUR   = code(JOURNEY_P);

  ok('§6.5.1 the circle credential has its OWN keys — it does not ride any couple or vendor slot',
    /CIRCLE_TOKEN_KEY\s*=\s*'circle_token'/.test(CTX) &&
    /CIRCLE_TOKEN_COOKIE\s*=\s*'tdw_circle_token'/.test(CTX),
    'the circle token shares a storage slot with another lane — the F-05.39 contamination shape');

  ok('§6.5.2 the circle reader NEVER reaches for a couple or vendor slot',
    !/couple_session|couple_web_session|tdw_couple_token|vendor_session|vendor_web_session|tdw_vendor_token/
      .test(CTX.slice(CTX.indexOf('function getCircleToken'))),
    'the circle read authority falls back across lanes — F-05.30\'s reversed disease, third instance');

  ok('§6.5.3 the co-planner sends the CIRCLE token and never getAccessToken()',
    !/getAccessToken/.test(CTX) && !/getAccessToken/.test(LAYOUT),
    'the co-planner reaches for the couple/vendor read authority');

  ok('§6.5.4 the BRIDE sends her OWN authority to the shared doors, not a second implementation',
    /function circleBrideHeaders/.test(JOUR) && /const t = getToken\(\);/.test(JOUR),
    'journey.ts minted a fourth token read instead of borrowing F-07.70\'s one authority');

  ok('§6.5.5 COOKIE BEFORE localStorage — the house law, on the new credential too',
    JOUR !== null &&
    CTX.indexOf('document.cookie.split') < CTX.indexOf("localStorage.getItem(CIRCLE_TOKEN_KEY)"),
    'the circle credential is localStorage-first — §4 forbids it');

  ok('§6.5.6 NO CREDENTIAL IS INVENTED — a tokenless client sends no Authorization header',
    /const t = getCircleToken\(\);\s*return t \? \{ \.\.\.\(extra \|\| \{\}\), Authorization: `Bearer \$\{t\}` \} : \{ \.\.\.\(extra \|\| \{\}\) \};/
      .test(CTX),
    'circleAuthHeaders sends a header with no token behind it — `Bearer null` is a credential invented from nothing');

  ok('§6.5.7 SIGN-OUT TAKES THE CREDENTIAL WITH IT',
    /clearCircleToken\(\);/.test(code('app/coplanner/settings/page.tsx')),
    'a sign-out that leaves a 90-day token on the device is a sign-out in name only');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · THE SIBLING HALF');

ok('§6.1 the server half is named, and its absence is DISCLOSED never silently passed',
  (() => {
    const sib = path.resolve(ROOT, '..', 'dream-os', 'scripts', 'b07_auth_crossover_bench.js');
    if (!fs.existsSync(sib)) {
      console.log('       SKIPPED-WITH-REASON: the dream-os tree is not a sibling of this repo in this ' +
                  'container. The server half runs in its own repo\'s floor; this cell exists so nobody ' +
                  'mistakes its absence for its passing.');
      return true;
    }
    return fs.readFileSync(sib, 'utf8').includes('tdw_auth_crossover.proof.mjs');
  })());

// ═══════════════════════════════════════════════════════════════════════════
// §7 · MUTATION — real, in-run, across a PROCESS BOUNDARY.
// Skipped when this process IS a mutation run, or recursion never terminates.
// ═══════════════════════════════════════════════════════════════════════════
if (!CELLS_ONLY) {
  sec('§7 · MUTATION — production source broken, fresh process per run, cmp-restored');

  const MUTATIONS = [
    [BASE_P,  'if (fromStorage === vendorLaneToken()) return null;',
              '',
              'M-1 the lane assertion deleted                       ⇒ §1.1/§1.3 RED'],
    [BASE_P,  'const fromCookie = readCookie(COUPLE_COOKIE);',
              'const fromCookie = readCookie(COUPLE_COOKIE) || readCookie(VENDOR_COOKIE);',
              'M-2 the cross-lane cookie fallback restored          ⇒ §2.1/§2.2 RED'],
    [BASE_P,  '    return readCookie(COUPLE_COOKIE);',
              '    return readCookie(COUPLE_COOKIE) || readCookie(VENDOR_COOKIE);',
              'M-3 the private-mode arm\'s crossing restored         ⇒ §2.3 RED'],
    [BASE_P,  'if (fromStorage === vendorLaneToken()) return null;\n      // Sync to cookie',
              '// Sync to cookie',
              'M-4 assertion removed from before the cookie sync    ⇒ §1.3 RED'],
    [FROST_P, "      if (res.status === 401 || res.status === 403) {\n        showToast('Session expired. Please sign in again.');\n        setSubmitting(false);\n        return;\n      }\n",
              '',
              'M-5 the F-07.71 parity branch deleted                ⇒ §3.1/§3.2/§3.3 RED'],
    [FROST_P, "showToast('Session expired. Please sign in again.');\n        setSubmitting(false);\n        return;",
              "showToast('Session expired.');\n        setSubmitting(false);\n        return;",
              'M-6 the parity byte drifted to sanctuary\'s bare twin ⇒ §3.3 RED'],
    // ── F-07.72 · the triangle's own inverses ────────────────────────────
    [CTX_P,   "  try { return localStorage.getItem(CIRCLE_TOKEN_KEY) || null; } catch { return null; }",
              "  try { return localStorage.getItem(CIRCLE_TOKEN_KEY) || localStorage.getItem('couple_session') || null; } catch { return null; }",
              'M-7 the circle reader crosses into the couple slot     ⇒ §6.5.2 RED'],
    [CTX_P,   "  const t = getCircleToken();\n  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };",
              "  const t = getCircleToken();\n  return { ...(extra || {}), Authorization: `Bearer ${t}` };",
              'M-8 a header invented with no token behind it          ⇒ §6.5.6 RED'],
    [JOURNEY_P, '  const t = getToken();\n  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };',
              "  const t = localStorage.getItem('couple_session');\n  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };",
              'M-9 the bride\'s header mints a FOURTH token read      ⇒ §6.5.4 RED'],
  ];

  let mutPass = 0;
  for (const [rel, from, to, label] of MUTATIONS) {
    const abs = path.join(ROOT, rel);
    const original = fs.readFileSync(abs, 'utf8');
    if (!original.includes(from)) {
      fail++; console.log(`  FAIL ${label}  → mutation anchor absent (uncured tree?)`);
      continue;
    }
    fs.writeFileSync(abs, original.replace(from, to));
    const r = spawnSync(process.execPath, [SELF, '--cells-only'], { encoding: 'utf8' });
    fs.writeFileSync(abs, original);
    const restored = fs.readFileSync(abs, 'utf8') === original;
    if (r.status !== 0 && restored) { pass++; mutPass++; console.log('  ok   ' + label); }
    else {
      fail++;
      console.log(`  FAIL ${label}  → ` +
        (r.status === 0 ? 'the cells PASSED over broken production code — vacuous' : 'not restored byte-identical'));
    }
  }
  console.log(`       ${mutPass}/${MUTATIONS.length} mutations RED across process boundaries, all restored byte-identical`);
}

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw_auth_crossover ${pass}/${total}` : `RED — tdw_auth_crossover ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
