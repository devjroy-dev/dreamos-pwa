#!/usr/bin/env node
// scripts/tdw07_f0772_circle.proof.mjs
// F-07.72 · THE CIRCLE-LANE AUTH SITTING · ZIP 1 · CLIENT HALF
//
// The server half is dream-os/scripts/b07_f0772_circle_auth_bench.js. Each half
// names the other; the cross-repo pinning precedent is F-07.50's, and a cell
// that reaches for an absent sibling tree SKIPS WITH REASON, never passes.
//
// ── WHAT THIS DELIVERY IS, AND THEREFORE WHAT THIS PROOF MAY CLAIM ──────────
// MINT AND TEACH. The lane issues a session and the clients carry it; NOTHING is
// enforced. Every cell is written to that boundary — where a cell would look
// stronger asserting a refusal, it asserts the absence of one, because a proof
// that showed enforcement this ZIP would be showing something that is not here.
//
// ── THE CACHING LAW (CE-117), STATED NOT ASSUMED ────────────────────────────
// Every read goes through fs.readFileSync at call time; this proof holds no
// module cache of the files it judges. §7's mutations bust cache by PROCESS
// BOUNDARY: each edits the production source, re-runs THIS script fresh
// (`--cells-only`), asserts a non-zero exit, restores, and verifies byte
// identity. No mutation is proven inside an already-warm process.
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

const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => stripComments(raw(rel));

const CTX_P      = 'app/coplanner/CircleSessionContext.tsx';
const LAYOUT_P   = 'app/coplanner/layout.tsx';
const JOIN_P     = 'app/circle/join/[token]/page.tsx';
const SETTINGS_P = 'app/coplanner/settings/page.tsx';
const JOURNEY_P  = 'lib/frost/journey.ts';
const SANCT_P    = 'app/(frost)/frost/canvas/sanctuary/page.tsx';

// EVERY co-planner call site, enumerated rather than sampled. The read-first's
// census is the census of record; a tenth site appearing here without a header
// must REDDEN §2.2 rather than ride in unnoticed.
const COPLANNER_CALLERS = [
  'app/coplanner/layout.tsx',
  'app/coplanner/page.tsx',
  'app/coplanner/dreamai/page.tsx',
  'app/coplanner/muse/page.tsx',
  'app/coplanner/muse/AddMuseSheet.tsx',
  'app/coplanner/threads/page.tsx',
  'app/coplanner/threads/[threadId]/page.tsx',
];

const CTX = code(CTX_P), CTXr = raw(CTX_P);
const LAY = code(LAYOUT_P), LAYr = raw(LAYOUT_P);

// ═══════════════════════════════════════════════════════════════════════════
// §0 · THE CANARY — TDW_STRIPPER_CANARY (CE-120's law; F-07.74's cure)
sec('§0 · THE CANARY — the stripper must not swallow live code (F-07.74 / CE-120)');
{
  ok('§0.1 canary survives stripping — CircleSessionContext head',
    CTX.includes("export const CIRCLE_TOKEN_KEY    = 'circle_token';"));
  ok('§0.2 canary survives stripping — CircleSessionContext waist',
    CTX.includes('export function getCircleToken(): string | null {'));
  ok('§0.3 canary survives stripping — CircleSessionContext tail',
    CTX.includes('export function memberName(s: CircleSession): string {'));
  ok('§0.4 canary survives stripping — layout head/tail',
    CTX.length > 0 && LAY.includes("const SESSION_KEY = 'circle_session';") &&
    LAY.includes('function CoplannerSignIn({ expired, onSuccess }'));
  ok('§0.5 REAL COMMENTS ARE ACTUALLY REMOVED — the stripper is doing work',
    CTXr.includes('COOKIE BEFORE localStorage') && !CTX.includes('COOKIE BEFORE localStorage'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this proof really CALLS its stripper',
    (() => { const self = stripComments(fs.readFileSync(SELF, 'utf8'));
             return (self.match(/\bcode\s*\(/g) || []).length >= 3; })());
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE CREDENTIAL — one home, and the house law observed on it');

ok('§1.1 the lane has a credential at all — the tokenless era is over on the client',
  /export function setCircleToken/.test(CTX) && /export function getCircleToken/.test(CTX));

ok('§1.2 COOKIE BEFORE localStorage, WITH THE MIRROR — §4\'s settled iOS-Safari pattern',
  CTX.indexOf('document.cookie.split') < CTX.indexOf('localStorage.getItem(CIRCLE_TOKEN_KEY)'),
  'the credential is read localStorage-first — the house law forbids it');

ok('§1.3 the WRITE hits both carriers, so a blocked cookie does not lose the session',
  /document\.cookie\s*=\s*$/m.test(CTX) || /document\.cookie =/.test(CTX),
  'the cookie write is gone');
ok('§1.3b …and the localStorage mirror is written too',
  /localStorage\.setItem\(CIRCLE_TOKEN_KEY, token\)/.test(CTX));

ok('§1.4 EVERY storage call is guarded — private mode cannot throw the sign-in away',
  (CTX.match(/try \{/g) || []).length >= 5,
  'an unguarded storage call will throw in private browsing');

ok('§1.5 THE TOKEN IS NOT INSIDE THE SESSION BLOB',
  !/circle_session[\s\S]{0,200}?token/.test(CTX.slice(CTX.indexOf('setCircleToken'))),
  'a credential kept in the blob is destroyed by the next hydration refresh, which ' +
  'overwrites that blob wholesale from a response that carries no token');

ok('§1.6 NO CREDENTIAL IS INVENTED — no token means no Authorization header',
  /return t \? \{ \.\.\.\(extra \|\| \{\}\), Authorization: `Bearer \$\{t\}` \} : \{ \.\.\.\(extra \|\| \{\}\) \};/
    .test(CTX),
  '`Bearer null` is a credential invented from nothing');

ok('§1.7 SIGN-OUT TAKES IT — the credential does not outlive the session on the device',
  /clearCircleToken\(\);/.test(code(SETTINGS_P)));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE CARRY — every co-planner call site, enumerated not sampled');

// TWO CALLS ARE EXEMPT, AND THEY ARE NAMED — never excluded by a cleverer regex.
// Both were found by this cell going RED on its own first run, which is the cell
// working: an exemption nobody had to argue for is an exemption nobody checked.
//   · verify-pin      — THE MINT. It is the request that OBTAINS the credential;
//                       a mint that required one could never issue the first.
//   · couple/profile  — THE NINTH DOOR (F-07.106). It belongs to the COUPLE lane,
//                       is mounted bare at dream-os router.js:66, and a circle
//                       member holds no couple credential to send it. Sending the
//                       circle token there would be a lane crossing, which is the
//                       thing §6.5 of the crossover proof exists to forbid. Its
//                       unguardedness is F-07.106's, filed, not this ZIP's.
// If either ever stops being exempt, THIS LIST is where the argument re-opens.
const EXEMPT_CALLS = [
  { rel: 'app/coplanner/layout.tsx', needle: 'api/v2/auth/verify-pin', why: 'THE MINT' },
  { rel: 'app/coplanner/page.tsx',   needle: 'api/v2/couple/profile', why: 'the couple lane\'s own door, F-07.106' },
];

for (const rel of COPLANNER_CALLERS) {
  const c = code(rel);
  const calls  = (c.match(/`\$\{API\}\/api\/v2\//g) || []).length;
  const heads  = (c.match(/circleAuthHeaders\(/g) || []).length;
  const exempt = EXEMPT_CALLS.filter(e => e.rel === rel && c.includes(e.needle));
  const need   = calls - exempt.length;
  const tag    = exempt.length ? ` (${exempt.length} exempt: ${exempt.map(e => e.why).join(', ')})` : '';
  ok(`§2.1 ${rel.replace('app/coplanner/', '')} — ${calls} lane call(s), ${heads} carrying${tag}`,
    heads >= need,
    'a co-planner call site fetches the lane without carrying the credential');
}

ok('§2.1x EVERY EXEMPTION IS STILL REAL — a named exemption whose call vanished must redden',
  EXEMPT_CALLS.every(e => code(e.rel).includes(e.needle)),
  'an exemption is being carried for a call that no longer exists — stale ink protecting nothing');

ok('§2.2 THE CENSUS IS CLOSED — no eighth co-planner file fetches the lane unlisted',
  (() => {
    const found = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
        const rel = path.join(d, e.name);
        if (e.isDirectory()) { walk(rel); continue; }
        if (!/\.tsx?$/.test(e.name)) continue;
        if (/`\$\{API\}\/api\/v2\//.test(code(rel))) found.push(rel);
      }
    };
    walk('app/coplanner');
    const missing = found.filter(f => !COPLANNER_CALLERS.includes(f));
    if (missing.length) console.log('       UNLISTED: ' + missing.join(', '));
    return missing.length === 0;
  })(),
  'a co-planner file fetches the lane and is not in this proof\'s census');

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · THE BRIDE — the dual-lane doors, and the four sites that sent nothing');
// The charter named ONE bride call site (sanctuary:2585, whose Bearer the server
// had always ignored). The read-first found FIVE, and four of them sent no
// credential at all. Under the enforcement delivery those four would have
// refused the bride her own circle chat. Ratified into this ZIP; these cells are
// the census of record.
{
  const JOUR = code(JOURNEY_P);
  const SAN  = code(SANCT_P);

  ok('§3.1 journey.ts borrows F-07.70\'s ONE AUTHORITY — no fourth token read is minted',
    /function circleBrideHeaders/.test(JOUR) && /const t = getToken\(\);/.test(JOUR),
    'a new token read appeared where an authority already existed');

  ok('§3.2 all THREE journey.ts circle calls carry it',
    (JOUR.match(/circleBrideHeaders\(/g) || []).length >= 4,
    'a bride call site still reaches a shared door credential-less');

  ok('§3.3 sanctuary\'s POST carries the bride\'s token (its GET sibling always did)',
    /const circleToken = coupleAccessToken\(\);/.test(SAN) &&
    /Authorization:`Bearer \$\{circleToken\}`/.test(SAN));

  ok('§3.4 sanctuary\'s GET at the thread poll is UNTOUCHED — zero bytes, as ruled',
    /const token = coupleAccessToken\(\);[\s\S]{0,400}?frost\/circle\/messages\/\$\{coupleId\}/.test(SAN),
    'the one call site that already carried a Bearer was edited anyway');

  ok('§3.5 THE BRIDE SITES ARE FIVE — a sixth appearing unlisted must redden here',
    (() => {
      const hits = [];
      const scan = (rel) => {
        const c = code(rel);
        const n = (c.match(/api\/v2\/frost\/circle\//g) || []).length;
        if (n) hits.push(`${rel}:${n}`);
      };
      scan(JOURNEY_P); scan(SANCT_P);
      return hits.join('|') === `${JOURNEY_P}:3|${SANCT_P}:2`;
    })(),
    'the bride-side census moved — re-derive it before this delivery ships');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · F-07.104 — the returning member\'s sign-in, which had never worked');

ok('§4.1 THE pin-status CALL IS GONE from the executable half',
  !/api\/v2\/auth\/pin-status/.test(LAY),
  'the four-fault pre-check is still in the flow');

ok('§4.2 …and the diagnosis survives in the comment, so nobody re-adds it',
  /pin-status/.test(LAYr) && /POST/.test(LAYr) && /E\.164/.test(LAYr),
  'the cure shipped without its reason — the next reader will restore the defect');

ok('§4.3 the sign-in goes through verify-pin, POST, with the bare-10 phone toE164 accepts',
  /fetch\(`\$\{API\}\/api\/v2\/auth\/verify-pin`, \{\s*method: 'POST'/.test(LAY) &&
  /phone: phone\.replace\(\/\\D\/g, ''\)\.slice\(-10\)/.test(LAY));

ok('§4.4 the credential is held BEFORE the session fetch — that fetch carries it',
  // BOTH MUST EXIST BEFORE THEIR ORDER MEANS ANYTHING. The first cut compared
  // two indexOf results directly, and a DELETED call returns -1, which is less
  // than every real index — so the cell passed over its own mutation. Caught by
  // §7 M-4 exactly as designed, and kept in ink: an ordering assertion that does
  // not first assert presence is an assertion about nothing.
  LAY.includes('setCircleToken(vd.token)') &&
  LAY.includes('circle/session/${vd.userId}') &&
  LAY.indexOf('setCircleToken(vd.token)') < LAY.indexOf('circle/session/${vd.userId}'),
  'the first request of the lane\'s new life goes out credential-less');

ok('§4.5 the SERVER\'s sentence is surfaced verbatim, never paraphrased',
  /setError\(vd\.error \|\| 'Could not sign you in\. Try again\.'\);/.test(LAY),
  'the founder\'s vetoed bytes are replaced by a client-side paraphrase');

ok('§4.6 CONTROL INVENTORY — the `userId` state removed by ruling is actually gone',
  !/const \[userId, setUserId\]/.test(LAY),
  'the state whose only writer was the deleted fetch is still declared');

ok('§4.7 CONTROL INVENTORY — the AUTO-SUBMIT VERB survived the rewrite (CLAUSE 2)',
  /if \(next\.every\(d => d\)\) submitPin\(next\.join\(''\)\);/.test(LAY),
  'the capability one layer above the inputs was lost in the rewrite — the exact ' +
  'class CLAUSE 2 exists to catch');

for (const [label, needle] of [
  ['the phone input',        'placeholder="00000 00000"'],
  ['the +91 label',          '+91'],
  ['Continue →',             'Continue →'],
  ['Enter-to-submit',        "if (e.key === 'Enter') submitPhone();"],
  ['the four PIN inputs',    'maxLength={1}'],
  ['Auto-submits caption',   'Auto-submits when complete.'],
  ['the error slot',         "color: '#E07262'"],
]) {
  ok(`§4.8 CONTROL INVENTORY — KEPT: ${label}`, LAY.includes(needle),
    'a control accounted KEPT in the ruled inventory is missing from the rewrite');
}

ok('§4.9 the CONTROL INVENTORY ITSELF is committed beside the code it describes',
  /CONTROL INVENTORY \(CE-115/.test(LAYr),
  'the inventory lived in a chat message and died with it');

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE FOUNDER\'S BYTES, frozen 2026-08-02 — a paraphrase must redden');

ok('§5.1 B2 — the session-expired line is byte-exact',
  LAY.includes("'Your sign-in expired. Enter your PIN again.'"));

ok('§5.2 B3/B4 — the two retired client sentences are GONE, replaced by the server\'s',
  !LAY.includes("We don't recognise this number. Use your original invite link to join first.") &&
  !LAY.includes('No PIN set on this account yet. Use your invite link.'),
  'a deleted-by-ruling string is still in the tree');

ok('§5.3 the expired line is shown INSTEAD of the step caption, not beside it',
  /expired && step !== 'verifying'/.test(LAY),
  'two competing sentences render at once');

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · ENFORCE NOTHING — and the join page\'s second mint');

ok('§6.1 the 401 branch exists and is WIRED, so the enforcement ZIP is a server change alone',
  /if \(r\.status === 401\)/.test(LAY) && /clearCircleToken\(\);/.test(LAY));

ok('§6.2 A REFUSAL AND A BLIP ARE NOT THE SAME EVENT — only 401 signs her out',
  LAY.indexOf('if (r.status === 401)') < LAY.indexOf('const d = await r.json();') &&
  /catch \{\s*\}/.test(LAY.slice(LAY.indexOf('Network blip')) || 'x') === false,
  'a 500 or a timeout would sign the member out');

ok('§6.3 the cached session still survives a non-401 failure — the old behaviour is preserved',
  /Network blip/.test(LAYr));

ok('§6.4 THE JOIN PAGE HOLDS THE TOKEN — a new member leaves the flow with a session',
  /if \(d\.data\.token\) setCircleToken\(d\.data\.token\);/.test(code(JOIN_P)));

ok('§6.5 …and it imports the authority rather than re-implementing the storage rules',
  /import \{ setCircleToken, circleAuthHeaders \} from '\.\.\/\.\.\/\.\.\/coplanner\/CircleSessionContext';/
    .test(code(JOIN_P)),
  'a second copy of the credential\'s storage rules — F-07.70\'s geometry, rebuilt');

ok('§6.6 the join page\'s session fetch carries the token it just took',
  /circle\/session\/\$\{userId\}`, \{[\s\S]{0,60}?circleAuthHeaders\(\)/.test(code(JOIN_P)));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6.9 · THE SIBLING HALF');

ok('§6.9.1 the server half is named, and its absence is DISCLOSED never silently passed',
  (() => {
    const sib = path.resolve(ROOT, '..', 'dream-os', 'scripts', 'b07_f0772_circle_auth_bench.js');
    if (!fs.existsSync(sib)) {
      console.log('       SKIPPED-WITH-REASON: the dream-os tree is not a sibling of this repo in this ' +
                  'container. The server half runs in its own repo\'s floor; this cell exists so nobody ' +
                  'mistakes its absence for its passing.');
      return true;
    }
    return fs.readFileSync(sib, 'utf8').includes('tdw07_f0772_circle.proof.mjs');
  })());

// ═══════════════════════════════════════════════════════════════════════════
// §7 · MUTATION — real, in-run, across a PROCESS BOUNDARY.
// Skipped when this process IS a mutation run, or recursion never terminates.
// ═══════════════════════════════════════════════════════════════════════════
if (!CELLS_ONLY) {
  sec('§7 · MUTATION — production source broken, fresh process per run, cmp-restored');

  const MUTATIONS = [
    [CTX_P,
      "  try { return localStorage.getItem(CIRCLE_TOKEN_KEY) || null; } catch { return null; }",
      "  try { return localStorage.getItem(CIRCLE_TOKEN_KEY) || null; } catch { return null; } // moved",
      'M-1 (control) a no-op edit must NOT redden the cells      ⇒ all GREEN, so skipped'],
    [CTX_P,
      '  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };\n}\n\nexport const CircleSessionContext',
      '  return { ...(extra || {}), Authorization: `Bearer ${t}` };\n}\n\nexport const CircleSessionContext',
      'M-2 a header invented with no token behind it            ⇒ §1.6 RED'],
    [SETTINGS_P, '      clearCircleToken();', '',
      'M-3 sign-out leaves a 90-day credential on the device    ⇒ §1.7 RED'],
    [LAYOUT_P, '      if (vd.token) setCircleToken(vd.token);', '',
      'M-4 the credential is never held after verify-pin        ⇒ §4.4 RED'],
    [LAYOUT_P, "        setError(vd.error || 'Could not sign you in. Try again.');",
      "        setError('Something went wrong.');",
      'M-5 the founder\'s server bytes paraphrased on screen     ⇒ §4.5 RED'],
    [LAYOUT_P, "            ? 'Your sign-in expired. Enter your PIN again.'",
      "            ? 'Session expired.'",
      'M-6 the vetoed B2 byte drifted                           ⇒ §5.1 RED'],
    [LAYOUT_P, "    if (next.every(d => d)) submitPin(next.join(''));", '',
      'M-7 the AUTO-SUBMIT VERB lost in the rewrite (CLAUSE 2)  ⇒ §4.7 RED'],
    [LAYOUT_P, '        if (r.status === 401) {', '        if (false) {',
      'M-8 the refusal branch unwired                           ⇒ §6.1 RED'],
    [JOURNEY_P, '    headers: circleBrideHeaders(),\n  });\n  const r: any = await res.json();\n  return r?.data ?? [];\n}\n\n// Messages for a specific thread',
      '  });\n  const r: any = await res.json();\n  return r?.data ?? [];\n}\n\n// Messages for a specific thread',
      'M-9 a bride call site sends nothing again                ⇒ §3.2 RED'],
    [JOIN_P, '      if (d.data.token) setCircleToken(d.data.token);', '',
      'M-10 the join mint point drops the token                 ⇒ §6.4 RED'],
  ];

  let mutPass = 0, mutRun = 0;
  for (const [rel, from, to, label] of MUTATIONS) {
    if (/\(control\)/.test(label)) {
      // The control is NOT run as a redness check — it is named here so a reader
      // knows the list was thought about in both directions, and skipped with
      // its reason rather than quietly dropped (the floor-method law).
      console.log('  --   ' + label);
      continue;
    }
    mutRun++;
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
  console.log(`       ${mutPass}/${mutRun} mutations RED across process boundaries, all restored byte-identical`);
}

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw07_f0772_circle ${pass}/${total}` : `RED — tdw07_f0772_circle ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
