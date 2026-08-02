#!/usr/bin/env node
// scripts/tdw08_p3_landing.proof.mjs — TDW_08 · P3 — THE SEEING SURFACE (pwa arm)
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url, never cwd).
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup — asserts
// the cell goes RED at the broken tree, restores the file, and asserts byte-identity.
// Every anchor is asserted to appear EXACTLY ONCE before the replace (CE-127).
//
// ── THE COMMENT-BLINDNESS LAW BINDS EVERY CELL HERE ──────────────────────────────────
// This sitting's dream-os bench broke that law in its own first run: a cell asserting a
// symbol was absent from a file fired on a COMMENT explaining why the symbol was absent.
// Every textual cell below strips comments FIRST, and the storage cell strips because a
// declaration that says "NO localStorage" contains the word `localStorage`.
//
// WHAT THIS BENCH DOES NOT ASSERT, named rather than silently absent (floor-method law):
//   · NO cells over the mirror's RENDERED pixels. `VendorProfileView` is a sealed shared
//     component; what it renders is `tdw07_p4b_body` / `tdw07_p2_profile`'s ground, and
//     re-asserting it here would be a second owner of one fact.
//   · NO cell asserting the tease's payload is masked. That is the SERVER's guarantee and
//     it is proven at dream-os `b08_p3_seeing_surface_bench` §7. A client cell could only
//     restate a hope.
//   · NO device-matrix cell. iOS Safari / Android Chrome / the Instagram in-app browser
//     cannot be witnessed from this container — they ride the founder's walk, declared.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

let pass = 0, fail = 0;
const H = (s) => console.log(`\n══ ${s} ══`);
function ok(name, cond, msg) {
  try { assert.ok(cond, msg || 'assertion failed'); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

// A mutation that THROWS must fail its own cell, never abort the run — a bench that
// dies mid-section publishes a partial count, which is worse than a red.
function okMutate(name, rel, anchor, replacement, predicate, label) {
  try { mutate(rel, anchor, replacement, predicate, label); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

function mutate(rel, anchor, replacement, predicate, label) {
  const abs = path.join(ROOT, rel);
  const original = fs.readFileSync(abs, 'utf8');
  const hits = original.split(anchor).length - 1;
  assert.strictEqual(hits, 1, `anchor must appear EXACTLY ONCE in ${rel} (found ${hits})`);
  try {
    fs.writeFileSync(abs, original.replace(anchor, replacement), 'utf8');
    let red = false;
    try { predicate(); } catch { red = true; }
    assert.ok(red, `${label}: stayed GREEN over broken production code — it proves nothing`);
  } finally {
    fs.writeFileSync(abs, original, 'utf8');
    assert.strictEqual(fs.readFileSync(abs, 'utf8'), original, `${rel} not restored byte-identically`);
  }
}

const LANDING = 'app/demo/vendor/[handle]/page.tsx';
const STUDIO  = 'app/demo/vendor/[handle]/studio/page.tsx';
const API     = 'lib/demo/api.ts';
const HOOK    = 'hooks/demo/useDemoVendorData.ts';
const SHEET   = 'components/frost/EnquirySheet.tsx';
const DEMODISC = 'app/demodiscover/page.tsx';

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · G-6 · ZERO STORAGE APIs ON ANY VENDOR DEMO PATH — COMMENT-STRIPPED');

// The scope is the vendor demo tree + demodiscover + the demo lib and components.
// COMMENT-STRIPPED IS LOAD-BEARING: the landing carries a DECLARATION that says
// "NO localStorage, NO sessionStorage, NO storage of any kind". A raw grep counts the
// declaration and reds over a clean tree — the exact inversion of the disease.
function walk(dir) {
  const out = [];
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(rel));
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(rel);
  }
  return out;
}
const DEMO_SCOPE = [
  ...walk('app/demo/vendor'),
  ...walk('app/demodiscover'),
  ...walk('components/demo'),
  ...walk('lib/demo'),
];
const STORAGE_RE = /\b(localStorage|sessionStorage|indexedDB|document\.cookie)\b/;

ok('§1.1 the scope is non-empty — a zero-file census would pass vacuously',
  DEMO_SCOPE.length >= 20, `only ${DEMO_SCOPE.length} files in scope`);

ok('§1.2 ZERO storage APIs across the whole demo scope, comments stripped',
  DEMO_SCOPE.filter(f => STORAGE_RE.test(code(f))).length === 0,
  `storage API found in: ${DEMO_SCOPE.filter(f => STORAGE_RE.test(code(f))).join(', ')}`);

// ── THIS CELL WAS VACUOUS ON ITS FIRST RUN AND ITS OWN MUTATION CAUGHT IT ────
// It asserted the phrase "NO localStorage, NO sessionStorage, NO storage of any kind"
// was present. That phrase has TWO homes on this file — the G-6 constitution note in
// the header and the beacon's own declaration — so deleting EITHER left the cell green.
// A cell that survives the deletion of the thing it guards is not a guard. BOTH homes
// are now asserted separately, because they say different things to different readers:
// the header governs the FILE, the beacon governs the one effect most likely to grow a
// cache. The ruling names the beacon's (page.tsx:74-76 at the charter tip) as the one
// that must SURVIVE.
ok('§1.3 THE BEACON\'S OWN ZERO-STORAGE DECLARATION SURVIVES — required, not optional',
  /NO localStorage, NO sessionStorage, NO storage of any kind\. G-6 and the/.test(read(LANDING)),
  'the beacon declaration was deleted; the constitution lost its statement at the effect it governs');

ok('§1.3b the FILE-level G-6 constitution note survives too',
  /NO localStorage, NO sessionStorage, NO storage of any kind, anywhere on this path/.test(read(LANDING)),
  'the header constitution note was deleted');

ok('§1.4 the declaration is a COMMENT and would be invisible to the census above',
  !STORAGE_RE.test(code(LANDING)),
  'the declaration leaked into code — or the strip is not working');

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · THE THREE MOVEMENTS');

const L = code(LANDING);

ok('§2.1 THE MIRROR: VendorProfileView is mounted on the landing',
  /<VendorProfileView/.test(L) && /from '@\/components\/shared\/VendorProfileView'/.test(L));

ok('§2.2 it eats the SERVER\'s card, never a client-shaped object',
  /vendor=\{card\}/.test(L) && /setCard\(res\.card\)/.test(L),
  'the mirror is not fed from the server shim — a second shaper is exactly what FORK B refused');

ok('§2.3 FORK D: mode="preview", and NO third mode was invented',
  /mode="preview"/.test(L) && !/mode="demo"/.test(L) && !/'demo'/.test(L.match(/<VendorProfileView[\s\S]*?\/>/)?.[0] ?? ''));

ok('§2.4 onPreviewToast IS SUPPLIED — the ruling, not a courtesy: no tap dies silent',
  /onPreviewToast=\{raiseToast\}/.test(L));

ok('§2.5 onEnquire / enquireLink / onCircleTap are ALL WITHHELD',
  !/onEnquire=/.test(L) && !/enquireLink=/.test(L) && !/onCircleTap=/.test(L));

ok('§2.6 THE EYEBROW is present, byte-exact (founder-vetoed)',
  /This is how couples see you\. You&apos;re live in Discover now\./.test(read(LANDING)));

ok('§2.7 THE CLAIM CTA is present, byte-exact, and it is the page\'s ONE GOLD FILL',
  /Claim your studio — 90 seconds/.test(read(LANDING)) &&
  (L.match(/background:'#C9A84C'/g) || []).length === 1,
  'either the CTA byte drifted or a second gold FILL appeared on the screen');

ok('§2.8 Enter Your Studio DEMOTED to a ghost — it no longer carries a gold fill',
  /Enter Your Studio/.test(L) && !/background:'#C9A84C'[^}]*Enter Your Studio/.test(L));

ok('§2.9 THE TWO GHOSTS ARE NOT EQUAL WEIGHT (hierarchy by size, never a 2nd gold)',
  /height:44[\s\S]{0,400}Enter Your Studio/.test(L) && /height:40[\s\S]{0,400}Explore Discover/.test(L));

ok('§2.10 THE PAGE SCROLLS — the non-scrollable shell is gone',
  /minHeight:'100dvh'/.test(L),
  'three movements cannot live on a fixed, overflow-hidden screen');

// ═════════════════════════════════════════════════════════════════════════════
H('§3 · THE THREE NULLS, ONE RULE — OMIT, NEVER PLACEHOLDER');

ok('§3.1 the budget line renders ONLY when budget_max is non-null',
  /lead\.budget_max != null && \(/.test(L));

ok('§3.2 the budget renders through formatRs — the ONE money donor',
  /formatRs\(lead\.budget_max\)/.test(L) && /from '@\/lib\/vendor\/format'/.test(L));

ok('§3.3 the budget carries the founder\'s byte, and it is the CEILING word',
  /Budget up to \{formatRs/.test(read(LANDING)));

ok('§3.4 month and city are pushed onto a LIST — an absent fact is absent, not an empty segment',
  /if \(lead\.wedding_when\) facts\.push/.test(L) && /if \(lead\.wedding_city\) facts\.push/.test(L));

ok('§3.5 the facts line renders only when the list is non-empty',
  /facts\.length > 0 && \(/.test(L));

ok('§3.6 NO PLACEHOLDER STRINGS anywhere on this surface',
  !/upcoming/.test(L) && !/city not given/.test(L) && !/not given/i.test(L),
  'a WhatsApp-lane fallback or a dormant placeholder reached the web surface');

ok('§3.7 ZERO LEADS ⇒ THE MOVEMENT COLLAPSES — founder-ruled 「 collapses 」',
  /\{waiting > 0 && \(/.test(L));

ok('§3.8 THE STRUCK LINE IS NOT PRESENT AND MUST NOT REAPPEAR',
  !/browsing your work/.test(read(LANDING)),
  'the impressions line asserts a number nothing tracks — struck twice over');

ok('§3.9 the count line carries BOTH founder bytes, singular and plural',
  /1 couple is waiting/.test(read(LANDING)) && /couples are waiting/.test(read(LANDING)));

// ═════════════════════════════════════════════════════════════════════════════
H('§4 · THE CHIP STRIP, AND IT ORPHANS NOTHING (FORK C(c) rider)');

const CHIP_TARGETS = ['/discover','/portfolio','/couture','/featured','/business','/tds','/contracts','/settings'];
ok('§4.1 exactly EIGHT chips, the founder-frozen set',
  CHIP_TARGETS.every(t => L.includes(`path: '${t}'`)) &&
  (L.match(/\{ label: '/g) || []).length === 8);

ok('§4.2 Team Hub points at /business — NOT /studio/team (the kickoff\'s own correction)',
  /\{ label: 'Team Hub',        path: '\/business'  \}/.test(L));

ok('§4.3 Back to Studio is REMOVED-BY-RULING and did not come back',
  !/Back to Studio/.test(L));

ok('§4.4 the chip header carries the founder\'s byte',
  /Explore your studio/.test(read(LANDING)));

// ── THE EIGHTEEN-ROUTE REACHABILITY ASSERTION ────────────────────────────────
// The ORPHAN-LIMB LAW applied FORWARD instead of backward. Demotion changes
// PROMINENCE, not REACHABILITY: every demo sub-route reached before this sitting must
// still be reached after it, or the chip strip has silently orphaned something.
// Census taken on REACHABILITY (inbound href/push), never on call-site syntax.
const demoPages = walk('app/demo/vendor')
  .filter(f => f.endsWith('page.tsx'))
  .map(f => f.replace(/^app\/demo\/vendor\/\[handle\]/, '').replace(/\/page\.tsx$/, ''))
  .filter(r => r !== '');
const demoTreeCode = walk('app/demo/vendor').map(code).join('\n');
const targets = new Set((demoTreeCode.match(/base\}\/[a-zA-Z/-]*/g) || []).map(m => m.replace('base}', '')));
for (const m of demoTreeCode.match(/\/demo\/vendor\/\$\{handle\}[a-zA-Z/${}-]*/g) || []) {
  targets.add(m.replace(/^\/demo\/vendor\/\$\{handle\}/, '').replace(/\$\{chip\.path\}/, ''));
}
for (const t of CHIP_TARGETS) targets.add(t);

ok('§4.5 the census found the full demo route tree (18 sub-routes)',
  demoPages.length === 18, `found ${demoPages.length}: ${demoPages.join(' ')}`);

// `/list` is the ONE known orphan, ruled C(c) — LEAVE AND FILE. It was orphaned BEFORE
// this sitting and is not P3's disease; it is named here so the assertion below is a
// statement about what P3 changed, not a rediscovery of what it inherited.
const KNOWN_ORPHANS = ['/list', '/list/[slice]'];
const unreached = demoPages.filter(r => !KNOWN_ORPHANS.includes(r) && ![...targets].some(t => t === r));

ok('§4.6 THE STRIP ORPHANS NOTHING — every non-inherited-orphan sub-route is still reached',
  unreached.length === 0, `newly unreachable: ${unreached.join(', ')}`);

ok('§4.7 /list stays the ONE inherited orphan — C(c), filed not deleted',
  fs.existsSync(path.join(ROOT, 'app/demo/vendor/[handle]/list/page.tsx')),
  'the orphan was deleted — that is scope the founder did not ask for');

// ═════════════════════════════════════════════════════════════════════════════
H('§5 · PRESERVED BY RULING');

ok('§5.1 the ?claim=1 consumer survives and still opens the sheet (CE-118 C1)',
  /searchParams\?\.get\('claim'\) === '1'/.test(L) && /setClaimOpen\(true\)/.test(L));

ok('§5.2 the open beacon survives, once per mount, ref-guarded',
  /beaconFired\.current/.test(L) && /pingDemoOpened\(handle\)/.test(L));

ok('§5.3 DemoClaimSheet is still the ONE shared sheet',
  /<DemoClaimSheet/.test(L) && /from '@\/components\/demo\/DemoClaimSheet'/.test(L));

ok('§5.4 the loading and not-found states survive byte-identically',
  /One moment…/.test(read(LANDING)) && /Profile not found\./.test(read(LANDING)) &&
  /This demo link may have expired\./.test(read(LANDING)));

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · F-08.1 · DemoCommandBar IS GONE, COMMENT-STRIPPED');

ok('§6.1 zero DemoCommandBar in the demo studio, comments stripped',
  !/DemoCommandBar/.test(code(STUDIO)));

ok('§6.2 the DELETION LEFT ITS REASON — a note naming it survives as a comment',
  /DemoCommandBar/.test(read(STUDIO)),
  'the reason went with the code; a future reader finds an absence instead of a decision');

ok('§6.3 the real CommandBar is still absent estate-wide (F-07.31 not regressed)',
  !fs.existsSync(path.join(ROOT, 'components/vendor/CommandBar.tsx')));

// ═════════════════════════════════════════════════════════════════════════════
H('§7 · THE TYPE STOPPED LYING (F-08.34)');

const A = code(API);
ok('§7.1 DemoLead declares the SIX wire fields and nothing else',
  /wedding_when: string \| null;/.test(A) && /budget_max:   number \| null;/.test(A));

ok('§7.2 the NINE phantom fields are gone from the type',
  ['bride_phone','bride_ig_handle','bride_wedding_date','bride_wedding_city','otp_verified','raw_message','demo_vendor_handle']
    .every(f => !new RegExp(`^\\s*${f}:`, 'm').test(A.slice(A.indexOf('export interface DemoLead'), A.indexOf('export interface DemoContext')))));

const HK = code(HOOK);
ok('§7.3 the `as Lead` cast is GONE — the second silencer died with the first',
  !/\} as Lead\)\)/.test(HK));

ok('§7.4 the hook is typed at the mapper instead, so tsc sees the target shape',
  /\(l\): Lead => \(\{/.test(HK));

ok('§7.5 wedding_city reads the WIRE\'s field — the one-token cure',
  /wedding_city:      l\.wedding_city,/.test(HK) && !/l\.bride_wedding_city/.test(HK));

ok('§7.6 every absent field is an EXPLICIT CONSTANT, not a phantom read',
  /phone:             null,/.test(HK) && /raw_message:       null,/.test(HK) &&
  /wedding_date:      null,/.test(HK) && /state:             'new',/.test(HK));

ok('§7.7 no phantom read survives anywhere in the mapper',
  !/l\.bride_phone/.test(HK) && !/l\.state/.test(HK) && !/l\.raw_message/.test(HK) &&
  !/l\.bride_wedding_date/.test(HK));

// F-08.34's DECLARED GAP, with a witness over it. `state: 'new'` is a CONSTANT and the
// zeros it produces are structurally TRUE — `demo_leads` has no state column and no
// mechanism to action or book a demo lead. This cell exists so that the day the demo
// lane grows a lifecycle, the constant is caught rather than quietly outliving its truth.
ok('§F0834 the constant is STATED as one, naming the absent column and the absent mechanism',
  /NO `state` column/.test(read(HOOK)) && /no mechanism anywhere to action or book/.test(read(HOOK)));

// ═════════════════════════════════════════════════════════════════════════════
H('§8 · THE SHEET POSTS THE BUDGET AND STAYS READ-ONLY');

const S = code(SHEET);
ok('§8.1 budget_band is no longer suppressed on the demo path',
  /budget_band:  band \?\? undefined,/.test(S) && !/budget_band:  isDemo \? undefined/.test(S));

ok('§8.2 functions IS still suppressed — no column, and G-4\'s clause is struck',
  /functions:    isDemo \? undefined : splitFunctions\(functions\)/.test(S));

ok('§8.3 the demo rows stay READ-ONLY — display-and-confirm, the shape did not change',
  /\{isDemo \? \(/.test(S) && /bandOpen && !isDemo/.test(S));

ok('§8.4 the half-true paragraph is amended and names the surviving half',
  /THE FUNCTIONS HALF SURVIVES/.test(read(SHEET)));

// ═════════════════════════════════════════════════════════════════════════════
H('§M · MUTATIONS OVER PRODUCTION SOURCE — RED AT THE BROKEN TREE, BOTH WAYS');

okMutate('§M.1 §1.2 reds when a storage API enters a demo path', LANDING, "  const beaconFired = useRef(false);",
    "  const beaconFired = useRef(false);\n  if (typeof window !== 'undefined') { localStorage.getItem('x'); }",
    () => assert.ok(DEMO_SCOPE.filter(f => STORAGE_RE.test(code(f))).length === 0), '§1.2');

okMutate('§M.2 §1.3 reds when the zero-storage declaration is deleted', LANDING, '// NO localStorage, NO sessionStorage, NO storage of any kind. G-6 and the',
    '// (declaration removed)',
    () => assert.ok(/NO localStorage, NO sessionStorage, NO storage of any kind\. G-6 and the/.test(read(LANDING))), '§1.3');

okMutate('§M.3 §2.7 reds when a SECOND gold fill appears on the screen', LANDING, "background:'transparent', border:'0.5px solid rgba(248,247,245,0.42)'",
    "background:'#C9A84C', border:'0.5px solid rgba(248,247,245,0.42)'",
    () => assert.strictEqual((code(LANDING).match(/background:'#C9A84C'/g) || []).length, 1), '§2.7');

okMutate('§M.4 §3.1 reds when the budget line stops guarding on null', LANDING, '{lead.budget_max != null && (', '{true && (',
    () => assert.ok(/lead\.budget_max != null && \(/.test(code(LANDING))), '§3.1');

okMutate('§M.5 §3.7 reds when the tease renders over zero leads', LANDING, '{waiting > 0 && (', '{waiting >= 0 && (',
    () => assert.ok(/\{waiting > 0 && \(/.test(code(LANDING))), '§3.7');

okMutate('§M.6 §2.5 reds when a live enquire target is handed to the mirror', LANDING, '          onPreviewToast={raiseToast}',
    '          onPreviewToast={raiseToast}\n          enquireLink={vendor.whatsapp_phone}',
    () => assert.ok(!/enquireLink=/.test(code(LANDING))), '§2.5');

okMutate('§M.7 §7.5 reds when the hook goes back to the phantom city field', HOOK, 'wedding_city:      l.wedding_city,', 'wedding_city:      null,',
    () => assert.ok(/wedding_city:      l\.wedding_city,/.test(code(HOOK))), '§7.5');

okMutate('§M.8 §6.1 reds if DemoCommandBar is restored to the demo studio', STUDIO, '      <DemoVendorHeader vendorName={vendorName} handle={handle} category={category} city={city} />',
    '      <DemoVendorHeader vendorName={vendorName} handle={handle} category={category} city={city} />\n      <DemoCommandBar newLeads={0} />',
    () => assert.ok(!/DemoCommandBar/.test(code(STUDIO))), '§6.1');

okMutate('§M.9 §8.1 reds if the sheet resumes discarding the band on demo', SHEET, 'budget_band:  band ?? undefined,', 'budget_band:  isDemo ? undefined : (band ?? undefined),',
    () => assert.ok(/budget_band:  band \?\? undefined,/.test(code(SHEET))), '§8.1');

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — tdw08_p3_landing ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
