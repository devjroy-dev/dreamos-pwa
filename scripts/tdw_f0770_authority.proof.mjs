#!/usr/bin/env node
// scripts/tdw_f0770_authority.proof.mjs
// F-07.70 · SANCTUARY ADOPTS THE ONE TOKEN AUTHORITY — and its chartered rider
// F-07.73 (the unreachable end-of-deck state).
//
// ── WHAT THIS PROVES, per the CE's acceptance ②ability ────────────────────────
//   §1  ZERO direct `access_token` reads survive in sanctuary — a count AT THE
//       BOUNDARY, never an eyeball.
//   §2  The one door (fork A′-iii) and why its fallback cannot re-admit the
//       crossover — asserted against the demo writer's OWN bytes, not prose.
//   §3  Each of the TWELVE adopted sites, named, one cell apiece.
//   §4  The couple-id authority, with its count DISCLOSED against the ruling.
//   §5  The crossed-device behaviour now matches the estate (fork B2).
//   §6  The parity byte — proven by EXTRACTION from a sibling, never by eye.
//   §7  The `:3758-3768` comment amendment, ruled a co-equal deliverable.
//   §8  F-07.73 — the virtual end slot and C′'s filter gate.
//   §9  The storage census's exemptions, each in its own guard cell.
//   §10 MUTATIONS — production source broken, fresh process per run.
//
// ── THE CACHING LAW (CE-117), STATED NOT ASSUMED ─────────────────────────────
// Every read below goes through fs.readFileSync at call time; this proof holds
// no module cache of the files it judges. §10's mutations bust cache by PROCESS
// BOUNDARY: each edits the production source, re-runs THIS script as a fresh
// node process (`--cells-only`), asserts a non-zero exit, then restores and
// verifies byte-identity. No mutation is proven inside an already-warm process.
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(SELF), '..');
const CELLS_ONLY = process.argv.includes('--cells-only');

let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — inherited from tdw07_p1/p2/p3/p4b/f0760/auth_crossover.
// Order is load-bearing: line comments first, block comments second.
//
// IT MATTERS ACUTELY HERE, and p1 §4.14's retirement is the standing precedent.
// This cure's comments QUOTE the diseased code they replaced: the literal
// `localStorage.getItem('access_token')`, the literal `bare || s?.token`, and the
// whole false healing sentence all survive in PROSE at the very sites that no
// longer perform them. A cell reading raw text would convict the cure of the
// disease it removed. CELLS JUDGE CODE. A green bought by deleting the evidence
// is the cure this estate refuses by name.
//
// ── ONE AMENDMENT TO THE INHERITED STRIPPER, EARNED IN THIS SITTING ──────────
// The inherited block-comment pass is `/\/\*[\s\S]*?\*\//g`. Run against THIS
// file it EATS PRODUCTION CODE: sanctuary carries `accept="image/*"` on the
// moments file input, the line-comment pass leaves it standing, and the `/*`
// inside that string literal then opens a false block comment that swallows
// everything up to the next real `*/` — six hundred characters of live code,
// including the concierge site, vanished from judgement.
//
// THAT IS THE VACUOUS-GREEN CLASS EXACTLY. Every cell in §1 and §9 asks whether
// something is ABSENT. A stripper that deletes a region answers "absent" for
// every direct read hiding inside it. The bug was caught only because §3.10
// asserts a PRESENCE in the swallowed range and went red; had this sitting
// shipped presence-cells alone, the boundary count would have read zero over
// code it never saw.
//
// THE AMENDMENT: a `/*` opens a comment only where a comment can legally begin —
// at line start or after one of the delimiters below. Inside `image/*` the
// preceding character is `e`, so it opens nothing. §0 below is the CANARY that
// keeps this honest: anchors from the head, waist and tail of the file must all
// survive stripping, so any future swallow REDDENS instead of acquitting.
const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => raw(rel)
  .split('\n').map(l => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n')
  .replace(/(^|[\s({\[;,=:>+&|?])\/\*[\s\S]*?\*\//g, '$1');

const SANCT_P  = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const BASE_P   = 'lib/frost-api/_base.ts';
const TOKENS_P = 'lib/frost/tokens.ts';
const DEMO_P   = 'app/demo/bride/page.tsx';
const SIB_P    = 'app/(auth)/couple/onboarding/page.tsx';
const LAYOUT_P = 'app/layout.tsx';

const S  = code(SANCT_P), Sr = raw(SANCT_P);
const B  = code(BASE_P);
const T  = code(TOKENS_P);
const D  = code(DEMO_P);
const Sib = raw(SIB_P);
const L  = code(LAYOUT_P);

const count = (s, re) => (s.match(re) || []).length;

if (!CELLS_ONLY) console.log('F-07.70 — sanctuary adopts the one token authority (+ F-07.73 rider)');

// ═══════════════════════════════════════════════════════════════════════════
sec('§0 · THE CANARY — the stripper must not have eaten production code');

// Head, waist and tail. If a future edit re-opens a false block comment, one of
// these disappears and this cell reddens BEFORE any absence-cell can acquit over
// code it never read.
const CANARY = [
  ['head  — the one door',        'function coupleAccessToken()'],
  ['waist — the discover clamp',  'if(vIdx>=vendors.length-(hasMore?1:0))return;'],
  ['waist — the moments input',   'accept="image/*"'],
  ['waist — the concierge fetch', '/api/v2/couple/concierge/request'],
  ['tail  — the bounce toast',    '{bounceToast&&<div'],
];
for (const [label, anchor] of CANARY)
  ok(`§0 canary ${label} survived stripping`, S.includes(anchor),
     'the comment stripper swallowed live code — every absence-cell downstream is vacuous');

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE BOUNDARY — a count, not an eyeball');

ok('§1.1 SPECIMEN — ZERO direct localStorage access_token reads survive in sanctuary CODE',
  count(S, /localStorage\.getItem\('access_token'\)/g) === 0,
  `${count(S, /localStorage\.getItem\('access_token'\)/g)} direct read(s) still bypass the authority`);

ok('§1.2 the cell judges CODE — the phrase still stands in PROSE and was NOT deleted to buy this green',
  count(Sr, /localStorage\.getItem\('access_token'\)/g) > 0,
  'the evidence was removed instead of the disease (p1 §4.14 precedent)');

// THE ARITHMETIC IS SPELLED OUT because a bare total is a number nobody can
// check. SEVEN sites go through the one door — the six the ruling named plus the
// disclosed seventh (meridian). FIVE call the authority directly: they never had
// a demo fallback to keep. The guard is a sixth direct caller and predates this
// cure. The helper itself calls the authority once, and is declared once.
ok('§1.3 SEVEN sites go through the one door (the six ruled + the disclosed seventh)',
  count(S, /\bcoupleAccessToken\(\)/g) - count(S, /function coupleAccessToken\(\)/g) === 7,
  `found ${count(S, /\bcoupleAccessToken\(\)/g) - count(S, /function coupleAccessToken\(\)/g)} call sites, expected 7`);

ok('§1.4 SEVEN direct authority calls — 5 cured sites + the guard + the helper\'s own',
  count(S, /\bgetAccessToken\(\)/g) === 7,
  `found ${count(S, /\bgetAccessToken\(\)/g)}, expected 7`);

ok('§1.5 twelve cured sites, and the room still reads a token at every one of them',
  (count(S, /\bcoupleAccessToken\(\)/g) - count(S, /function coupleAccessToken\(\)/g)) +
  (count(S, /\bgetAccessToken\(\)/g) - 2) === 12,
  'the disease was deleted rather than cured — some site stopped reading a token at all');

ok('§1.6 the one door is declared exactly ONCE',
  count(S, /function coupleAccessToken\(\)/g) === 1);

ok('§1.7 the authority is imported from the file that carries the lane assertion',
  /import \{ getAccessToken \} from '.*lib\/frost-api\/_base'/.test(S) &&
  /if \(fromStorage === vendorLaneToken\(\)\) return null;/.test(B),
  'the assertion is not where this cure believes it is');

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE ONE DOOR (fork A′-iii) — and why its fallback is lane-safe');

const HELPER = S.slice(S.indexOf('function coupleAccessToken'), S.indexOf('function daysSince'));

ok('§2.1 the authority is asked FIRST and its answer wins when it has one',
  /const authoritative = getAccessToken\(\);\s*if \(authoritative\) return authoritative;/.test(HELPER),
  'the fallback can pre-empt the authority — the assertion becomes advisory');

ok('§2.2 the fallback reads the COUPLE blob and nothing else',
  /localStorage\.getItem\('couple_session'\)/.test(HELPER) &&
  /localStorage\.getItem\('couple_web_session'\)/.test(HELPER));

ok('§2.3 THE CROSSOVER CANNOT RE-ENTER — the helper never touches a vendor key',
  !/vendor_session|vendor_web_session|vendor_token/.test(HELPER),
  'the fallback reads a vendor record — the disease has a second door');

ok('§2.4 the fallback keys are the demo blob\'s own two spellings',
  /s\?\.token \|\| s\?\.access_token/.test(HELPER));

ok('§2.5 the helper fails CLOSED — unreadable or absent storage returns null, never a throw',
  /catch \{ return null; \}/.test(HELPER));

// F-06.85: the mechanism the comment names must actually be true of the writer.
ok('§2.6 F-06.85 — the named mechanism is REAL: demo/bride writes its token INSIDE the couple blob',
  /access_token:\s*'demo_bride_token'/.test(D) &&
  /localStorage\.setItem\('couple_session',/.test(D));

ok('§2.7 F-06.85 — and demo/bride writes NO bare access_token, which is why the fallback exists at all',
  count(D, /localStorage\.setItem\('access_token'/g) === 0,
  'the demo lane now writes the bare key — this fallback is dead and should be REMOVED, not left to rot');

ok('§2.8 the mechanism is named IN-COMMENT at the helper, per F-06.85\'s standing law',
  /demo\/bride\/page\.tsx:42/.test(Sr) &&
  /THE FALLBACK CANNOT RE-ADMIT THE CROSSOVER/.test(Sr));

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · THE TWELVE ADOPTED SITES — one cell apiece, each named');

const SITES = [
  ['§3.1  expenses POST',        /const token    = getAccessToken\(\);\s*\n\s*const coupleId = getCoupleIdForFrost\(\);/],
  ['§3.2  taste-profile effect', /const token=getAccessToken\(\);\s*\n\s*if\(token\)\{ fetch\('https:\/\/[^']*\/couple\/taste\/profile'/],
  ['§3.3  saveTags',             /try\{ const token=getAccessToken\(\); if\(token\)\{ await fetch\('https:\/\/[^']*\/couple\/taste'/],
  ['§3.4  circle message poll',  /const token = coupleAccessToken\(\);\s*\n\s*if\(!coupleId\) return;/],
  ['§3.5  pages load',           /const token = coupleAccessToken\(\);\s*\n\s*if\(!coupleId\|\|!token\) return;/],
  ['§3.6  pages create',         /if\(!raw\) return;\s*\n\s*const token = coupleAccessToken\(\);\s*\n\s*if\(!token\) return;/],
  ['§3.7  saveCaption PATCH',    /const token = coupleAccessToken\(\);\s*\n\s*const res = await fetch\(`\$\{API\}\/api\/v2\/couple\/muse\/caption/],
  ['§3.8  moments load',         /const token = coupleAccessToken\(\);\s*\n\s*if\(!coupleId\|\|!token\)\{setLoading\(false\);return;\}/],
  ['§3.9  moments upload',       /const token = coupleAccessToken\(\);\s*\n\s*if\(!token\)\{showToast\('Session expired\. Please sign in again\.'\)/],
  ['§3.10 concierge request',    /const token = getAccessToken\(\);\s*\n\s*const res = await fetch\(`\$\{API\}\/api\/v2\/couple\/concierge\/request`/],
  ['§3.11 meridian chat',        /const token = coupleAccessToken\(\);\s*\n\s*const ctrl = new AbortController\(\);/],
  ['§3.12 live hints',           /const hintsToken = getAccessToken\(\);\s*\n\s*const coupleId = getCoupleIdForFrost\(\);/],
];
for (const [label, re] of SITES) ok(label + ' routes through an authority', re.test(S), 'this site still reaches storage directly');

ok('§3.13 the guard\'s own read was already adopted and stays adopted',
  /const token = getAccessToken\(\);\s*\n\s*const session = localStorage/.test(S));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE COUPLE-ID AUTHORITY — adopted where the sites did its dance');

ok('§4.1 getCoupleIdForFrost is imported',
  /import \{ EASE, FROST_COPY, daysUntil, getCoupleIdForFrost \}/.test(S));

ok('§4.2 ZERO hand-rolled `coupleId||id` dances survive in code',
  count(S, /\?\.coupleId\s*\|\|\s*\w*\??\.?id/g) === 0,
  `${count(S, /\?\.coupleId\s*\|\|\s*\w*\??\.?id/g)} site(s) still derive the id by hand`);

// DISCLOSED, NEVER SMOOTHED. The read-first said ELEVEN and the CE ratified that
// number. Derived by command at build time it is SIX — five `s?.coupleId||s?.id`
// dances plus the expenses site's narrower `.id`-only variant. The executor's
// miscount is filed in the handover rather than papered by a cell written to the
// wrong number. This cell asserts the DERIVED six.
ok('§4.3 SIX adoption sites — the read-first\'s "eleven" corrected and disclosed, not smoothed',
  count(S, /getCoupleIdForFrost\(\)/g) === 6,
  `expected 6, found ${count(S, /getCoupleIdForFrost\(\)/g)}`);

ok('§4.4 the adoption GAINED something — the authority carries a cookie fallback the raw reads had not',
  /export function getCoupleIdForFrost/.test(T) &&
  /tdw_couple_session=/.test(T));

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · FORK B2 — the crossed device meets an honest sign-in, not a half-alive room');

ok('§5.1 SPECIMEN — the guard refuses on the TOKEN, so a refused token cannot walk in on a surviving blob',
  /if\(!token && !isDemo\)\{/.test(S),
  'the crossover still loads the room and fails every fetch inside it');

ok('§5.2 the old token-AND-session guard is gone',
  !/if\(!token && !session\)\{ window\.location\.replace/.test(S));

ok('§5.3 the demo exemption is the blob\'s own word about itself, not an inference about her',
  /const isDemo = \(\(\) => \{ try \{ const s = JSON\.parse\(session\|\|'\{\}'\); return !!s\?\.demo; \}/.test(S));

ok('§5.4 THE DEMO LANE IS WHY — getAccessToken() cannot succeed for a demo bride (writer-proven, §2.7)',
  count(D, /localStorage\.setItem\('access_token'/g) === 0);

ok('§5.5 the bounce still happens — she lands where she can sign in',
  /window\.location\.replace\('\/'\); \}, 1600\);/.test(S));

ok('§5.6 the vetoed sentence is SHOWN on the way out, not swallowed',
  /setBounceToast\('Session expired\. Please sign in again\.'\);/.test(S));

ok('§5.7 the sentence has somewhere to land — the shell renders its own toast',
  /\{bounceToast&&<div style=\{\{position:'fixed'/.test(S));

ok('§5.8 isDemo is derived ONCE — the same question is not asked twice off two reads of one blob',
  count(S, /const isDemo = /g) === 1);

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · THE PARITY BYTE — identity by extraction, never by eye');

const SIB_BYTE = (Sib.match(/showToast\('(Session expired\.[^']*)'\)/) || [])[1];

ok('§6.1 the sibling byte is extractable — the comparison has a real left-hand side',
  typeof SIB_BYTE === 'string' && SIB_BYTE.length > 0);

ok('§6.2 the moments-upload site speaks the sibling\'s byte, byte-identical',
  !!SIB_BYTE && S.includes(`showToast('${SIB_BYTE}')`),
  'a drift on either site must redden this cell');

ok('§6.3 the guard speaks the same byte',
  !!SIB_BYTE && S.includes(`setBounceToast('${SIB_BYTE}')`));

ok('§6.4 ZERO bare twins survive in sanctuary',
  count(S, /'Session expired\.'/g) === 0,
  'the truncated sentence is still spoken somewhere on this surface');

ok('§6.5 ZERO new copy — the byte was MOVED, and the estate\'s four sibling sites are untouched',
  count(Sib, /Session expired\. Please sign in again\./g) === 2);

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · THE COMMENT AMENDMENT — ruled a co-equal deliverable, so it is celled like one');

ok('§7.1 the healing sentence is no longer ASSERTED — it is quoted as what stood there',
  /THE HEALING SENTENCE THAT STOPPED BEING TRUE/.test(Sr) &&
  /WHAT STOOD HERE, and it was true when it was written/.test(Sr),
  'the false reasoning still reads as current guidance');

ok('§7.2 the new mechanism (a): the assertion returns null BEFORE any restore',
  /asserts the lane BEFORE any cookie work/.test(Sr));

ok('§7.3 the new mechanism (b): the twelve reads no longer exist to heal',
  /THE TWELVE READS NO LONGER EXIST TO HEAL/.test(Sr));

ok('§7.4 the new mechanism (c): this guard is now the front door\'s truth',
  /THIS GUARD IS NOW THE FRONT DOOR'S TRUTH/.test(Sr));

ok('§7.5 the new mechanism (d): the demo lane is named as the reason it is not `if(!token)`',
  /THE DEMO LANE IS SACRED AND IS WHY THIS IS NOT/.test(Sr));

ok('§7.6 F-06.85 is cited BY NAME so the next sitting inherits the law, not just the fix',
  /F-06\.85/.test(Sr));

ok('§7.7 the amendment cites the assertion\'s real site, and that site is real',
  /_base\.ts:214/.test(Sr) &&
  raw(BASE_P).split('\n')[213].includes('vendorLaneToken()'),
  'the cited line does not carry the assertion — a citation authored from memory');

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · F-07.73 — the end-of-deck state becomes reachable, and only honestly');

ok('§8.1 SPECIMEN — the advance clamp now depends on the SERVER\'s word',
  /if\(vIdx>=vendors\.length-\(hasMore\?1:0\)\)return;/.test(S),
  'the deck still clamps at the last card and the approved sentence has no path');

ok('§8.2 the old unconditional clamp is gone',
  !/if\(vIdx>=vendors\.length-1\)return;/.test(S));

ok('§8.3 hasMore is in the callback\'s dependency array — the clamp cannot go stale',
  /\},\[vIdx,vendors\.length,hasMore\]\);/.test(S));

ok('§8.4 THE END STATE CANNOT RENDER OVER AN UNEXHAUSTED FEED — the prefetch owns hasMore',
  /if\(!hasMore\|\|!vendors\.length\|\|vIdx<vendors\.length-3\) return;/.test(S) &&
  /else setHasMore\(false\);/.test(S));

ok('§8.5 swipe-down returns her to the last card — goPrevV is untouched and unguarded against the slot',
  /const goPrevV=React\.useCallback\(\(\)=>\{\s*\n\s*if\(vIdx<=0\)return;/.test(S));

ok('§8.6 blind mode is a separate axis and the branch still excludes it',
  /if\(!vendor&&!isBlind\) return \(/.test(S) &&
  /setBlindIdx\(i=>Math\.min\(i\+1,blindItems\.length-1\)\)/.test(S));

ok('§8.7 C′ — the filters arm now requires the result to be ACTUALLY empty',
  /\{hasActiveFilters && vendors\.length === 0 \? \(/.test(S),
  'a walked filtered deck still ends on "Nothing matches those filters yet."');

ok('§8.8 ZERO new copy — the founder\'s approved pair renders through the existing branch, unchanged',
  /That&rsquo;s everyone, for now\./.test(S) && /Check back soon/.test(S));

ok('§8.9 the preload effect short-circuits at the virtual slot',
  /if\(!vendor\) return;/.test(S));

// ═══════════════════════════════════════════════════════════════════════════
sec('§9 · THE STORAGE CENSUS — every remaining byte exempt WITH REASON, or filed');

const KEYS = [...Sr.matchAll(/localStorage\.(?:get|set|remove)Item\('([^']+)'/g)].map(m => m[1]);
const KEYSET = [...new Set(KEYS)].sort();
const EXPECTED = ['@frost.home_mode_manual', 'access_token', 'couple_session', 'couple_web_session'].sort();

ok('§9.1 the census is CLOSED — no storage key enters this file without passing this cell',
  JSON.stringify(KEYSET) === JSON.stringify(EXPECTED),
  `keys now: ${JSON.stringify(KEYSET)}`);

ok('§9.2 `access_token` survives ONLY inside the sign-out sweep, which is a CLEAR not a read',
  count(S, /localStorage\.getItem\('access_token'\)/g) === 0 &&
  /\['access_token','refresh_token','couple_session','couple_web_session',/.test(S));

ok('§9.3 EXEMPT-WITH-REASON — @frost.home_mode_manual is an ESTATE key, read cross-file by the root layout',
  /localStorage\.getItem\('@frost\.home_mode_manual'\)/.test(L),
  'its only reader is gone — the exemption\'s ground has moved and it must be re-ruled');

ok('§9.4 FILED, not cured — the sign-out sweep still clears two keys with zero readers estate-wide',
  count(S, /couple_last_path/g) === 1 && count(S, /couple_app_mode/g) === 1);

ok('§9.5 DECLARED, not cured — the three module-level blob helpers still read storage directly',
  count(S, /function get(Wedding|Engagement)Date\(\)/g) === 2 &&
  /function getBrideName\(\)/.test(S),
  'they moved without a ruling — p1 §4.14\'s remainder is this file\'s, and it travels DECLARED');

ok('§9.6 EXEMPT — the F-05.38 heal is a WRITE and stays load-bearing',
  /localStorage\.setItem\('couple_web_session', after\);/.test(S) &&
  /document\.cookie = `tdw_couple_session=/.test(S));

// ═══════════════════════════════════════════════════════════════════════════
// §10 · MUTATION — real, in-run, across a PROCESS BOUNDARY.
// Skipped when this process IS a mutation run, or recursion never terminates.
// ═══════════════════════════════════════════════════════════════════════════
if (!CELLS_ONLY) {
  sec('§10 · MUTATION — production source broken, fresh process per run, cmp-restored');

  const DIRECT = "localStorage.getItem('access_token')";
  const MUTATIONS = [
    [SANCT_P, 'const token    = getAccessToken();',
              `const token    = ${DIRECT};`,
              'M-01 expenses restored to a direct read              ⇒ §1.1/§3.1 RED'],
    [SANCT_P, 'const token=getAccessToken();\n    if(token){ fetch(',
              `const token=${DIRECT};\n    if(token){ fetch(`,
              'M-02 taste-profile restored to a direct read         ⇒ §1.1/§3.2 RED'],
    [SANCT_P, 'try{ const token=getAccessToken(); if(token){ await fetch(',
              `try{ const token=${DIRECT}; if(token){ await fetch(`,
              'M-03 saveTags restored to a direct read              ⇒ §1.1/§3.3 RED'],
    [SANCT_P, 'const token = coupleAccessToken();\n        if(!coupleId) return;',
              `const token = ${DIRECT};\n        if(!coupleId) return;`,
              'M-04 circle poll restored to a direct read           ⇒ §1.1/§3.4 RED'],
    [SANCT_P, 'const token = coupleAccessToken();\n        if(!coupleId||!token) return;',
              `const token = ${DIRECT};\n        if(!coupleId||!token) return;`,
              'M-05 pages load restored to a direct read            ⇒ §1.1/§3.5 RED'],
    [SANCT_P, 'const token = coupleAccessToken();\n      if(!token) return;',
              `const token = ${DIRECT};\n      if(!token) return;`,
              'M-06 pages create restored to a direct read          ⇒ §1.1/§3.6 RED'],
    [SANCT_P, 'const token = coupleAccessToken();\n      const res = await fetch(`${API}/api/v2/couple/muse/caption',
              `const token = ${DIRECT};\n      const res = await fetch(\`\${API}/api/v2/couple/muse/caption`,
              'M-07 saveCaption restored to a direct read           ⇒ §1.1/§3.7 RED'],
    [SANCT_P, 'const token = coupleAccessToken();\n        if(!coupleId||!token){setLoading(false);return;}',
              `const token = ${DIRECT};\n        if(!coupleId||!token){setLoading(false);return;}`,
              'M-08 moments load restored to a direct read          ⇒ §1.1/§3.8 RED'],
    [SANCT_P, "const token = coupleAccessToken();\n    // F-07.70 · THE PARITY BYTE",
              `const token = ${DIRECT};\n    // F-07.70 · THE PARITY BYTE`,
              'M-09 moments upload restored to a direct read        ⇒ §1.1/§3.9 RED'],
    [SANCT_P, 'const token = getAccessToken();\n      const res = await fetch(`${API}/api/v2/couple/concierge',
              `const token = ${DIRECT};\n      const res = await fetch(\`\${API}/api/v2/couple/concierge`,
              'M-10 concierge restored to a direct read             ⇒ §1.1/§3.10 RED'],
    [SANCT_P, 'const token = coupleAccessToken();\n\n    const ctrl = new AbortController();',
              `const token = ${DIRECT};\n\n    const ctrl = new AbortController();`,
              'M-11 meridian restored to a direct read              ⇒ §1.1/§3.11 RED'],
    [SANCT_P, 'const hintsToken = getAccessToken();',
              `const hintsToken = ${DIRECT};`,
              'M-12 live hints restored to a direct read            ⇒ §1.1/§3.12 RED'],
    [SANCT_P, 'const authoritative = getAccessToken();\n  if (authoritative) return authoritative;',
              '',
              'M-13 the one door stops asking the authority         ⇒ §2.1 RED'],
    [SANCT_P, "const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');\n    if (!raw) return null;",
              "const raw = localStorage.getItem('vendor_session') || localStorage.getItem('couple_web_session');\n    if (!raw) return null;",
              'M-14 the fallback poisoned with a VENDOR key         ⇒ §2.2/§2.3 RED'],
    [SANCT_P, 'if(!token && !isDemo){',
              'if(!token && !session){',
              'M-15 the guard reverted — the half-alive room returns ⇒ §5.1 RED'],
    [SANCT_P, "setBounceToast('Session expired. Please sign in again.');",
              "setBounceToast('Session expired.');",
              'M-16 the guard byte drifted to the bare twin         ⇒ §6.3/§6.4 RED'],
    [SANCT_P, "if(!token){showToast('Session expired. Please sign in again.');setUploading(false);return;}",
              "if(!token){showToast('Session expired.');setUploading(false);return;}",
              'M-17 the upload byte drifted back to the bare twin   ⇒ §6.2/§6.4 RED'],
    [SANCT_P, 'if(vIdx>=vendors.length-(hasMore?1:0))return;',
              'if(vIdx>=vendors.length-1)return;',
              'M-18 the end slot removed — the state is unreachable ⇒ §8.1/§8.2 RED'],
    [SANCT_P, 'if(vIdx>=vendors.length-(hasMore?1:0))return;',
              'if(vIdx>=vendors.length)return;',
              'M-19 hasMore UN-GUARDED — the end state renders over an unexhausted feed ⇒ §8.1 RED'],
    [SANCT_P, '{hasActiveFilters && vendors.length === 0 ? (',
              '{hasActiveFilters ? (',
              'M-20 C′ un-gated — the false sentence at a walked deck\'s end ⇒ §8.7 RED'],
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

  console.log('');
  console.log('§11 · DISCLOSED IN THE COUNT, NEVER SMOOTHED');
  console.log('      · the ruling named SIX fallback sites; a SEVENTH (meridian, `bare || raw.access_token`)');
  console.log('        was found at build and adopted rather than excused. Filed in the handover.');
  console.log('      · the read-first said ELEVEN couple-id sites; derived by command there are SIX.');
  console.log('        §4.3 asserts the derived number; the miscount is the executor\'s and is filed.');
  console.log('      · fork B2\'s bounce is DELAYED 1600ms. A hard navigation destroys a toast painted in');
  console.log('        the same tick, so the ruled byte would never have been readable. Executor\'s call,');
  console.log('        disclosed for ratification — the ruling said show it, and this is what showing costs.');
}

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw_f0770_authority ${pass}/${total}` : `RED — tdw_f0770_authority ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
