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
// ── LABELED AMENDMENT · F-07.115 · SEVEN CALLERS BECOME SIX ─────────────────
// `app/coplanner/dreamai/page.tsx` is DELETED in this delivery, so it leaves the
// census with the surface it belonged to. `§2.1` is a per-file loop, so the
// bench's total moves 102 → 101 by that removal alone; the cells added at §14
// below are separate and additive, and the two movements are stated apart
// deliberately so neither hides inside the other's arithmetic.
//
// This is NOT ARC-2's class of census movement. That one was a number changing
// because the estate learned something it had got wrong. This one is a number
// changing because a file the estate deliberately deleted stopped existing —
// declared before the delivery rather than discovered in the diff.
const COPLANNER_CALLERS = [
  'app/coplanner/layout.tsx',
  'app/coplanner/page.tsx',
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

ok('§2.2 THE CENSUS IS CLOSED — no seventh co-planner file fetches the lane unlisted',
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

// ── §6.1 / §6.2 RE-AIMED AT ZIP 2, COUNT PRESERVED ─────────────────────────
// These asserted the 401 branch lived INSIDE layout.tsx and cleared the token
// there. FORK B moved that body to `circleRefused()` in the context file — one
// home, reachable from every screen — so the cells follow the behaviour to its
// new address rather than pinning an address that is no longer where the
// behaviour is. CE-119's class, the one `b07_f0784_panel` paid for at ZIP 1.
// WHAT THEY CLAIM IS UNCHANGED: the branch exists, it clears the credential,
// and ONLY a 401 fires it.
ok('§6.1 the 401 branch exists and is WIRED — now at the lane\'s ONE refusal home',
  /if \(circleRefused\(r\)\)/.test(LAY) &&
  /res\.status !== 401/.test(CTX) && /clearCircleToken\(\);/.test(CTX));

ok('§6.2 A REFUSAL AND A BLIP ARE NOT THE SAME EVENT — only 401 signs her out',
  /if \(!res \|\| res\.status !== 401\) return false;/.test(CTX) &&
  LAY.indexOf('if (circleRefused(r))') < LAY.indexOf('const d = await r.json();'),
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
// §8 · F-07.107 / F-07.109 / F-07.110 — THE BUBBLE LEARNS WHO IS SPEAKING
//
// Here rather than in a new file because these cells guard the SAME surfaces
// §2 and §3 guard: the co-planner thread screen and the two bride call sites.
// One home.
//
// The client half is necessarily source-derived — there is no DOM in this
// container and no server to answer — so §7's process-boundary mutations are
// what make these non-vacuous, and four are added below for exactly that.
// ═══════════════════════════════════════════════════════════════════════════
const THREAD_P = 'app/coplanner/threads/[threadId]/page.tsx';
const THREAD   = code(THREAD_P);

sec('§8 · F-07.107/109/110 — the author on the wire, and the label on the bubble');

ok('§8.1 F-07.110: ROLE_LABEL is DELETED, map and reader both',
  !THREAD.includes('ROLE_LABEL') && !THREAD.includes('msgRoleLabel'),
  'the dead value-space map survived');

ok('§8.2 F-07.110: no role value can reach the label — the suffix expression is gone',
  !/actor_role\s*\|\|\s*m\.sender_role/.test(THREAD) && !THREAD.includes('` · $'),
  'a role is still being concatenated onto a name');

ok('§8.3 C1: 「 You 」 ships byte-exact, and it is the only new user-facing byte',
  /\{mine \? 'You' : m\.sender_name\}/.test(THREAD),
  'the vetoed byte drifted or the own-branch is missing');

ok('§8.4 the label renders for OWN or NAMED, and for nothing else',
  /\{\(mine \|\| m\.sender_name\) && \(/.test(THREAD),
  'the three-case label condition is not the shipped one');

ok('§8.5 F1: an UNNAMED bubble falls back to NO LABEL, never to the role',
  !/sender_role\s*\|\|\s*'/.test(THREAD) && !/m\.sender_role\}/.test(THREAD),
  'a role is rendering where an author is absent');

ok('§8.6 F-07.109: the own-message compare is UNCHANGED and now true as written',
  THREAD.includes('const mine = m.sender_user_id === session.user_id;'),
  'the comparison was rewritten instead of the field being made real');

ok('§8.7 F-07.107: the co-planner no longer POSTs a sender_name',
  !/sender_name:\s*myName/.test(THREAD) && !/sender_name:/.test(THREAD),
  'the client still supplies an identity string');

ok('§8.8 …and its now-unused import is gone with it (no dead binding left behind)',
  !THREAD.includes('memberName'),
  'memberName is imported and unread — the F-07.99 shape in miniature');

ok('§8.9 F-07.107: sanctuary stops sending the literal Bride, and KEEPS sender_role',
  !/sender_name:'Bride'/.test(code(SANCT_P)) && /sender_role:'bride'/.test(code(SANCT_P)),
  'the bride payload is wrong in one direction or the other');

ok('§8.10 sanctuary :2625 and its optimistic push are UNTOUCHED (inventoried KEPT)',
  code(SANCT_P).includes("m.sender_role==='bride' ? 'You' : (m.sender_name||'Circle')") &&
  code(SANCT_P).includes("sender_role:'bride',sender_name:'You'"),
  'a KEPT control moved without a ruling');

ok('§8.11 F-07.107: journey.ts stops posting the role-string `couple` as a name',
  !/sender_name:\s*'couple'/.test(code(JOURNEY_P)),
  'a role is still being posted into a name field');

ok('§8.12 the dead CircleMessage type carries sender_user_id and is declared dead',
  /sender_user_id: string \| null;/.test(code(JOURNEY_P)) &&
  raw(JOURNEY_P).includes('ZERO consumers'),
  'the corrected type is missing, or its deadness is undeclared');

ok('§8.13 CROSS-REPO: the server half names 0105 and both columns',
  (() => {
    const sib = path.resolve(ROOT, '..', 'dream-os', 'db', 'migrations', '0105_circle_message_author.sql');
    if (!fs.existsSync(sib)) {
      console.log('       SKIPPED-WITH-REASON: the dream-os tree is not a sibling of this repo in this ' +
                  'container. 0105 is founder-run and witnessed at 20 columns; this cell exists so nobody ' +
                  'mistakes its absence for its passing.');
      return true;
    }
    const s = fs.readFileSync(sib, 'utf8');
    return s.includes('add column if not exists sender_name text;') &&
           s.includes('add column if not exists sender_user_id uuid;');
  })(),
  'the migration this screen depends on is not the shipped one');

// ═══════════════════════════════════════════════════════════════════════════
// §9 · F-07.72 ZIP 2 — THE CLIENT HALF OF ENFORCEMENT
//
// The server half of this ZIP makes eleven doors refuse. That is a SERVER
// change, and the temptation is to ship it alone. These cells exist because the
// CE ruled otherwise on two hazards this delivery CREATES:
//
//   FORK B — until ZIP 2 no circle door returned 401, so a credential could not
//   go stale under an open app. It can now, and `layout.tsx`'s hydration refresh
//   — the lane's only 401 reader — runs ONCE at mount. Without a one-home
//   refusal every screen would go silently empty with no path back to the PIN
//   screen short of a manual reload.
//
//   FORK A(c) — THE BRIDE. She is not a `circle_members` row; the shared doors
//   admit her through the resolver's couple arm, and only while her JWT
//   resolves. Stale, wiped or signed-out all worked before this delivery and are
//   401 now — and her refusal is THE INVISIBLE KIND: her poll's `d?.ok` guard
//   means a refusal never calls `setChatMsgs`, so the last messages she loaded
//   sit on screen refreshing every ten seconds, looking live.
// ═══════════════════════════════════════════════════════════════════════════
sec('§9 · ZIP 2 — Fork B\'s one home and Fork A(c)\'s landing');

const SANCT  = code(SANCT_P), SANCTr = raw(SANCT_P);

ok('§9.1 FORK B — the refusal has ONE HOME, beside the credential\'s',
  /export function circleRefused\(/.test(CTX) &&
  /export const CIRCLE_REFUSAL_EVENT/.test(CTX));

ok('§9.2 it clears BOTH carriers and the cached session — not just the one the reader remembered',
  /circleRefused[\s\S]{0,600}?clearCircleToken\(\)/.test(CTX) &&
  /circleRefused[\s\S]{0,600}?removeItem\('circle_session'\)/.test(CTX),
  'a sign-out that leaves either half behind is a member who cannot sign back in');

ok('§9.3 ONLY 401 — a 403 is deliberately NOT a sign-out',
  /if \(!res \|\| res\.status !== 401\) return false;/.test(CTX) &&
  /403/.test(CTXr),
  'a revoked membership would loop her through a PIN screen that cannot restore it');

// §9.4 — DERIVED, NEVER LISTED. Every co-planner file that CARRIES the header
// must also READ a refusal; a twelfth call site added without one reddens here
// rather than shipping as a screen that goes quietly blank. The census of record
// is COPLANNER_CALLERS above, itself the read-first's eleven sites.
ok('§9.4 EVERY co-planner caller reads the refusal — derived by predicate, not a hand list',
  (() => {
    const missing = COPLANNER_CALLERS.filter((f) => {
      const c = code(f);
      return /circleAuthHeaders\(/.test(c) && !/circleRefused\(/.test(c);
    });
    if (missing.length) console.log('       carries the header, ignores the refusal: ' + missing.join(', '));
    return missing.length === 0;
  })());

ok('§9.5 THE JOIN PAGE IS THE NAMED EXCEPTION, with its reason in the file',
  !/circleRefused\(/.test(code(JOIN_P)) &&
  /sr\.status === 401 \? \{ success: false \}/.test(code(JOIN_P)) &&
  /mint and the guard disagree/.test(raw(JOIN_P)),
  'clearing a credential minted ninety seconds ago would strand a brand-new member');

ok('§9.6 the listener is a SEPARATE effect from the once-at-mount hydration',
  /addEventListener\(CIRCLE_REFUSAL_EVENT/.test(LAY) &&
  /removeEventListener\(CIRCLE_REFUSAL_EVENT/.test(LAY) &&
  LAY.indexOf('addEventListener(CIRCLE_REFUSAL_EVENT') > LAY.indexOf('hydrate();'),
  'a refusal can arrive at any moment after mount — that is the whole fork');

ok('§9.7 the co-planner\'s landing is B2, ALREADY VETOED and unmoved',
  LAYr.includes("'Your sign-in expired. Enter your PIN again.'"),
  'the founder-frozen byte drifted');

// ── FORK A(c) — THE BRIDE'S LANDING. The byte below is the founder's, executed
// in chat 2026-08-02 and frozen. Asserted against the SOURCE TEXT, where an
// escape or a paraphrase would show (CE-117's law).
const BRIDE_LANDING = 'Sign in again to see and send Circle messages.';

ok('§9.8 FORK A(c) — the bride\'s landing exists and carries the founder\'s byte VERBATIM',
  SANCTr.includes(BRIDE_LANDING));

ok('§9.9 the landing REPLACES the composer rather than sitting above it',
  /\{chatLocked \? \([\s\S]{0,900}?\) : \([\s\S]{0,400}?<CircleCompose/.test(SANCT),
  'a box she can type into but cannot send is the vanishing-message failure with extra steps');

ok('§9.10 ONLY 401 locks her chat — a blip keeps the last known messages, as this poll always has',
  /if\(res\.status===401\)\{ if\(alive\) setChatLocked\(true\); return; \}/.test(SANCT) &&
  /catch \{ \/\* keep last known \*\/ \}/.test(SANCTr));

ok('§9.11 the poll UNLOCKS when the credential comes back — the lock is a state, not a tombstone',
  /if\(alive\) setChatLocked\(false\);/.test(SANCT));

ok('§9.12 her SEND is no longer discarded — the response is read and a 401 is caught',
  /const res = await fetch\(`\$\{API\}\/api\/v2\/frost\/circle\/messages`/.test(SANCT) &&
  /if\(res\.status===401\)\{ setText\(msg\); onRefused\(\); setSending\(false\); return; \}/.test(SANCT),
  'a discarded 401 is her message vanishing with no error anywhere — F-07.117\'s shape');

ok('§9.13 her TEXT IS RESTORED on a refused send — nothing she typed is lost behind a sign-out',
  /setText\(msg\);/.test(SANCT));

// ── CONTROL INVENTORY, ASSERTED (CE-115's law, armed by Fork A(c)) ─────────
// The composer is REPLACED on refusal, so every control it carries is
// unreachable in that state BY DESIGN and accounted in the handover. What must
// not happen is a control disappearing in the NORMAL state, which is what these
// two cells watch.
ok('§9.14 CONTROL INVENTORY — the composer keeps every control it had, in the unlocked state',
  /<input value=\{text\}/.test(SANCT) &&
  /onSent\(msg\)/.test(SANCT) &&
  /setSending\(true\)/.test(SANCT));

ok('§9.15 CONTROL INVENTORY — sanctuary\'s 「 You 」 control is untouched by this ZIP',
  /sender_role==='bride' \? 'You'/.test(SANCT),
  'F-07.107\'s KEPT control was collateral of the landing');

// ═══════════════════════════════════════════════════════════════════════════
// §14 · F-07.115 — THE MIRA RETIREMENT, AND WHAT REPLACED IT
// Additive to the 102 → 101 census movement declared at COPLANNER_CALLERS; the
// two are stated apart so neither hides in the other's arithmetic.
// ═══════════════════════════════════════════════════════════════════════════
sec('§14 · F-07.115 — the surface is gone, the capability is not');

const TAB_P  = 'app/coplanner/TabBar.tsx';
const HOME_P = 'app/coplanner/page.tsx';
const WANUM_P = 'lib/waNumbers.ts';
const TAB = code(TAB_P), HOME = code(HOME_P), HOMEr = raw(HOME_P), WANUM = code(WANUM_P);

ok('§14.1 THE PAGE IS DELETED — not blanked, not gated, gone from the tree',
  !fs.existsSync(path.join(ROOT, 'app/coplanner/dreamai/page.tsx')) &&
  !fs.existsSync(path.join(ROOT, 'app/coplanner/dreamai')),
  'the Dream AI page survives its own retirement');

ok('§14.2 THE TAB IS GONE, and so is the gate machinery that hid it',
  !/coplanner\/dreamai/.test(TAB) && !/DREAM AI/.test(TAB) &&
  !/gated/.test(TAB) && !/dreamai_access_granted/.test(TAB),
  'the tab or its one-member gate enum is still standing');

ok('§14.3 THE TAB BAR CARRIES EXACTLY FOUR TABS — the rendered-control change, asserted',
  (TAB.match(/\{ href: '\/coplanner/g) || []).length === 4 &&
  /'\/coplanner'/.test(TAB) && /'\/coplanner\/muse'/.test(TAB) &&
  /'\/coplanner\/threads'/.test(TAB) && /'\/coplanner\/settings'/.test(TAB),
  'the surviving tab set is not the four the control inventory ruled');

ok('§14.4 THE TAB BAR NO LONGER READS THE SESSION — the gate was its only reason to',
  !/useCircleSession/.test(TAB),
  'the session is still imported into a component with nothing left to gate');

ok('§14.5 THE FLAG IS DEAD IN THIS REPO — all three sites, by absence',
  !/dreamai_access_granted/.test(code(CTX_P)) &&
  !/dreamai_access_granted/.test(TAB) &&
  !/dreamai_access_granted/.test(HOME),
  'a reader of the keyless flag survived F-07.115\'s cure');

ok('§14.6 NO CLIENT CALLS THE RETIRED DOORS — anywhere in the tree',
  (() => {
    const hits = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
        const rel = path.join(d, e.name);
        if (e.isDirectory()) { if (e.name === 'node_modules' || e.name === '.next') continue; walk(rel); continue; }
        if (!/\.tsx?$/.test(e.name)) continue;
        if (/circle-member-history|circle-member-chat/.test(code(rel))) hits.push(rel);
      }
    };
    for (const d of ['app', 'components', 'lib', 'hooks']) {
      if (fs.existsSync(path.join(ROOT, d))) walk(d);
    }
    return hits.length === 0;
  })(),
  'a caller of the retired /dreamai doors is still live in this repo');

// ── THE TIP — and the cell the kickoff asked for by name: a config change must
// REDDEN rather than ship a wrong number to a member.
ok('§14.7 THE TIP IS ON THE HOME SCREEN, persistent, one home',
  /MIRA/.test(HOME) && /Mira is \{brideName\(session\)\}/.test(HOMEr),
  'the tip that replaces the surface is not on the co-planner home');

ok('§14.8 THE TIP\'S NUMBER IS DERIVED, NEVER TYPED — no digits in the copy',
  /waNumberFor\('bride'\)/.test(HOME) &&
  !/\b917011788380\b/.test(HOME) &&
  !/\b70117\s?88380\b/.test(HOME),
  'the tip hardcodes a number instead of deriving it — a config change would ship a lie');

ok('§14.9 THE DERIVED SOURCE STILL AGREES WITH THE ESTATE\'S CANONICAL PAIR',
  /BRIDE_WA_NUMBER\s*=\s*'917011788380'/.test(WANUM) &&
  /NEXT_PUBLIC_TDW_WA_NUMBER_BRIDE/.test(WANUM),
  'the bride lane constant moved without this tip being re-read');

ok('§14.10 THE RENDERED DIGITS EQUAL THE DERIVED NUMBER — the formatter cannot drift',
  (() => {
    // Re-implement displayWaNumber's contract independently and check the source
    // agrees: 12 digits starting 91 ⇒ '+91 XXXXX XXXXX'; anything else ⇒ '+digits'.
    const m = HOME.match(/return `\+91 \$\{d\.slice\(2, 7\)\} \$\{d\.slice\(7\)\}`;/);
    return !!m && /d\.length === 12 && d\.startsWith\('91'\)/.test(HOME) &&
           /return `\+\$\{d\}`;/.test(HOME);
  })(),
  'the display formatter no longer derives its digits from the resolved number');

ok('§14.11 THE FOUNDER\'S FOUR TIP BYTES, frozen 「 all, mira 」 — a paraphrase reddens',
  /}}>MIRA<\/p>/.test(HOMEr) &&
  /Mira is \{brideName\(session\)\}&rsquo;s PA\./.test(HOMEr) &&
  /Message her on WhatsApp at \{displayWaNumber\(waNumberFor\('bride'\)\)\} &mdash; she/.test(HOMEr) &&
  /knows the wedding and can answer anything about it\./.test(HOMEr) &&
  />Open WhatsApp<\/a>/.test(HOMEr),
  'a founder-vetoed tip byte was reworded');

// PERSISTENCE IS PROVEN BY WHAT IS ABSENT, and the absent thing is named: no
// dismiss state, no hide flag, and no conditional standing between the render
// and the eyebrow. A member who could dismiss this has no path back to the only
// address Mira answers on, so "unconditional" is the load-bearing property here
// and not a styling preference.
ok('§14.12 THE TIP IS NOT DISMISSIBLE AND NOT GATED — she cannot lose the only address',
  !/dismiss|Dismiss|hideTip|tipHidden/.test(HOME) &&
  !/&&\s*\(?\s*<section[^>]*>\s*<p[^>]*>MIRA/.test(HOMEr.replace(/\s+/g, ' ')) &&
  /}}>MIRA<\/p>/.test(HOMEr),
  'the tip acquired a dismiss or a gate; a member who hid it has no path back');

// ── F-07.121 — the twin of F-07.110, one directory over.
sec('§15 · F-07.121 — the role map that missed the only role most members have');

const SET = code(SETTINGS_P);

ok('§15.1 THE MAP IS KEYED ON THE DATABASE\'S OWN VALUE-SPACE, all three, lowercase',
  /partner:\s*'Partner · Fiancé'/.test(SET) &&
  /family:\s*'Family'/.test(SET) &&
  /inner_circle:\s*'Inner Circle'/.test(SET),
  'the settings role map does not carry the three lawful roles');

ok('§15.2 THE DEAD KEYS ARE GONE — the wrong case and the value that never existed',
  !/Partner:\s*'Partner'/.test(SET) && !/circle:\s*'Circle'/.test(SET),
  'a key that can never match survived the cure — F-07.110\'s exact class');

ok('§15.3 THE FALLBACK NO LONGER ASSERTS A ROLE IT DOES NOT KNOW',
  /ROLE_LABEL\[session\.role\] \|\| session\.role/.test(SET) &&
  !/\|\| 'Circle'/.test(SET),
  'a fourth role would still print a confident wrong label');

ok('§15.4 THE TYPE CARRIES THE SAME SPACE — one drift, not two',
  /export type CircleRole = 'partner' \| 'family' \| 'inner_circle';/.test(code(CTX_P)),
  'the type still declares a value-space the database cannot produce');

ok('§15.5 THE LABELS ARE THE BRIDE\'S OWN SHIPPED BYTES — no unvetoed string reached a screen',
  /partner:'Partner · Fiancé'/.test(SANCT) &&
  /family:'Family'/.test(SANCT) &&
  /inner_circle:'Inner Circle'/.test(SANCT),
  'the bride\'s live map no longer matches the words the member now reads — the pair has drifted');

ok('§15.6 THE CENSUS IS CLOSED — exactly TWO role maps in this repo, and they agree',
  (() => {
    const hits = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
        const rel = path.join(d, e.name);
        if (e.isDirectory()) { if (e.name === 'node_modules' || e.name === '.next') continue; walk(rel); continue; }
        if (!/\.tsx?$/.test(e.name)) continue;
        const c = code(rel);
        if (/inner_circle\s*:\s*'Inner Circle'/.test(c)) hits.push(rel);
      }
    };
    for (const d of ['app', 'components', 'lib', 'hooks']) {
      if (fs.existsSync(path.join(ROOT, d))) walk(d);
    }
    return hits.length === 2 &&
           hits.includes('app/coplanner/settings/page.tsx') &&
           hits.includes('app/(frost)/frost/canvas/sanctuary/page.tsx');
  })(),
  'a third role map appeared, or one of the two known maps moved — a class with three instances is a shared home, not a twin');

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
      '  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };',
      '  return { ...(extra || {}), Authorization: `Bearer ${t}` };',
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
    [LAYOUT_P, '        if (circleRefused(r)) {', '        if (false) {',
      'M-8 the refusal branch unwired                           ⇒ §6.1 RED'],
    [JOURNEY_P, '    headers: circleBrideHeaders(),\n  });\n  const r: any = await res.json();\n  return r?.data ?? [];\n}\n\n// Messages for a specific thread',
      '  });\n  const r: any = await res.json();\n  return r?.data ?? [];\n}\n\n// Messages for a specific thread',
      'M-9 a bride call site sends nothing again                ⇒ §3.2 RED'],
    [JOIN_P, '      if (d.data.token) setCircleToken(d.data.token);', '',
      'M-10 the join mint point drops the token                 ⇒ §6.4 RED'],
    ['app/coplanner/threads/[threadId]/page.tsx',
      "{mine ? 'You' : m.sender_name}", "{m.sender_name}",
      'M-11 the own-bubble loses 「 You 」 (C1)                    ⇒ §8.3 RED'],
    ['app/coplanner/threads/[threadId]/page.tsx',
      'const mine = m.sender_user_id === session.user_id;',
      'const mine = false;',
      'M-12 the own-message compare unwired                     ⇒ §8.6 RED'],
    ['app/coplanner/threads/[threadId]/page.tsx',
      '{(mine || m.sender_name) && (', '{(mine || m.sender_role) && (',
      'M-13 the role creeps back into the label condition       ⇒ §8.5 RED'],
    [SANCT_P, "body:JSON.stringify({userId:coupleId,body:msg,sender_role:'bride'})",
      "body:JSON.stringify({userId:coupleId,body:msg,sender_name:'Bride',sender_role:'bride'})",
      'M-14 sanctuary posts the client-minted name again        ⇒ §8.9 RED'],

    // ── ZIP 2's mutations. Anchors are SITE-QUALIFIED where a line repeats —
    // CE-127's fault (String.replace takes the first occurrence) has now been
    // paid for twice in the server half of this same finding.
    [CTX_P, '  if (!res || res.status !== 401) return false;',
      '  if (!res) return false;',
      'M-15 any failed request signs her out (a blip = a refusal) ⇒ §9.3 RED'],
    [CTX_P, "  try { localStorage.removeItem('circle_session'); } catch { /* private mode */ }", '',
      'M-16 the refusal leaves the cached session behind         ⇒ §9.2 RED'],
    [LAYOUT_P, '    window.addEventListener(CIRCLE_REFUSAL_EVENT, onRefused);', '',
      'M-17 the listener is gone — screens refuse, nothing reacts ⇒ §9.6 RED'],
    [SANCT_P, '            Sign in again to see and send Circle messages.',
      '            Something went wrong.',
      'M-18 the founder\'s vetoed landing byte paraphrased        ⇒ §9.8 RED'],
    [SANCT_P, 'if(res.status===401){ setText(msg); onRefused(); setSending(false); return; }', '',
      'M-19 her send is discarded again — the message vanishes    ⇒ §9.12 RED'],
    [SANCT_P, 'if(res.status===401){ if(alive) setChatLocked(true); return; }', '',
      'M-20 the poll stops locking — stale messages look live     ⇒ §9.10 RED'],

    // ── F-07.115 / F-07.121, this delivery's own. Every one breaks PRODUCTION
    // SOURCE, never test setup, and every one is cmp-restored by the runner.
    [TAB_P, "  { href: '/coplanner/settings', label: 'SETTINGS', matches: p => p.startsWith('/coplanner/settings') },",
      "  { href: '/coplanner/settings', label: 'SETTINGS', matches: p => p.startsWith('/coplanner/settings') },\n  { href: '/coplanner/dreamai',  label: 'DREAM AI', matches: p => p.startsWith('/coplanner/dreamai') },",
      'M-21 the retired tab is put back on the bar               ⇒ §14.2/§14.3 RED'],
    [CTX_P, '  can_see_budget: boolean;',
      '  dreamai_access_granted: boolean;\n  can_see_budget: boolean;',
      'M-22 the keyless flag returns to the permissions type      ⇒ §14.5 RED'],
    [HOME_P, "          Message her on WhatsApp at {displayWaNumber(waNumberFor('bride'))} &mdash; she",
      '          Message her on WhatsApp at +91 70117 88380 &mdash; she',
      'M-23 the tip hardcodes the number instead of deriving it   ⇒ §14.8 RED'],
    [HOME_P, '        }}>Mira is {brideName(session)}&rsquo;s PA.</p>',
      '        }}>Mira is the wedding assistant.</p>',
      'M-24 a founder-vetoed tip byte is paraphrased              ⇒ §14.11 RED'],
    [HOME_P, "    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;",
      "    return '+91 70117 88380';",
      'M-25 the formatter stops deriving and returns a literal    ⇒ §14.10 RED'],
    [SETTINGS_P, "  family:       'Family',", '',
      'M-26 `family` leaves the map again — F-07.121 restored     ⇒ §15.1 RED'],
    [SETTINGS_P, '  const roleLbl = ROLE_LABEL[session.role] || session.role;',
      "  const roleLbl = ROLE_LABEL[session.role] || 'Circle';",
      'M-27 the fallback asserts a role it does not know          ⇒ §15.3 RED'],
    [CTX_P, "export type CircleRole = 'partner' | 'family' | 'inner_circle';",
      "export type CircleRole = 'Partner' | 'inner_circle' | 'circle';",
      'M-28 the type reverts to the impossible value-space        ⇒ §15.4 RED'],
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
