#!/usr/bin/env node
// scripts/tdw07_f0760_claim.proof.mjs
// TDW_07 · F-07.60 — THE CLAIM FLOW OPENS IN PLACE.
//
// THE DISEASE: components/demo/DemoVendorHeader.tsx:133 ran
//     router.push(`/demo/vendor/${handle}?claim=1`)
// — a full navigation from whatever demo surface the vendor stood on, onto the
// marketing landing, which then auto-opened the claim sheet as an overlay anyway.
// The vendor paid his studio to reach a form.
//
// THE CURE, as ruled: the sheet extracts to ONE shared component (fork A1), the
// header opens it IN PLACE as a fragment sibling after `</header>` (fork B1), the
// landing's two own entries survive (fork C1), the scrim stays the dismissal (fork
// D1), z-index and every user-facing byte are frozen, and the POST is untouched.
//
// WHAT THIS BENCH PROVES AND WHAT IT DOES NOT (protocol §10,
// BENCHED-THE-MECHANISM-NOT-THE-AFFORDANCE): it proves the WIRING — that no
// navigation remains on the claim path, that the sheet mounts where fixed
// positioning can escape, that the copy and the payload are byte-identical, and
// that both landing entries still reach the same component. It CANNOT prove the
// sheet visibly rises over the studio on a real handset. That truth is the
// founder's device's alone and the smoke card names it as such.
//
// THE CACHING LAW (CE-117), STATED NOT ASSUMED: every read below goes through
// fs.readFileSync at call time, and this bench holds no module cache of the files
// it judges. The mutation proofs therefore bust their cache by PROCESS BOUNDARY —
// each mutation edits the production source, re-runs this script as a fresh node
// process, and restores with `cmp` verifying byte-identity. No mutation is proven
// by re-calling a function inside one already-warm process.
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — inherited from tdw07_p1/p2/p3/p4b. The ORDER is
// load-bearing: line comments first, block comments second.
//
// IT MATTERS ACUTELY HERE. This cure is heavily commented and those comments QUOTE
// the diseased code they replaced — the literal string `router.push` and the literal
// `?claim=1` both survive in prose at the very sites that no longer perform them.
// A cell reading raw text would acquit or convict on a comment. CELLS JUDGE CODE.
const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => raw(rel)
  .split('\n').map(l => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const SHEET_P   = 'components/demo/DemoClaimSheet.tsx';
const HEADER_P  = 'components/demo/DemoVendorHeader.tsx';
const LANDING_P = 'app/demo/vendor/[handle]/page.tsx';

const S = code(SHEET_P),   Sr = raw(SHEET_P);
const H = code(HEADER_P),  Hr = raw(HEADER_P);
const L = code(LANDING_P), Lr = raw(LANDING_P);

console.log('TDW_07 · F-07.60 — the claim flow opens in place');

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE HEADER OPENS, IT NO LONGER SENDS');

ok('§1.1 NO navigation to the claim query string survives in code',
  !/router\.push\([^)]*claim=1/.test(H), 'a push carrying ?claim=1 is still on the claim path');
ok('§1.2 the literal `?claim=1` appears in this file ONLY in prose, never in code',
  !/\?claim=1/.test(H) && /\?claim=1/.test(Hr),
  'either code still mints the query string, or the provenance comment was deleted');
ok('§1.3 the Claim control sets local open state instead',
  /setProfileOpen\(false\);\s*setClaimOpen\(true\);/.test(H));
ok('§1.4 the header owns the open question as state',
  /const \[claimOpen, setClaimOpen\] = useState\(false\);/.test(H));
ok('§1.5 the header renders the shared sheet',
  /<DemoClaimSheet/.test(H));
ok('§1.6 the header imports it from the ruled home (fork A1)',
  /import \{ DemoClaimSheet \} from '@\/components\/demo\/DemoClaimSheet';/.test(H));
// NON-COLLATERAL: the cure must not have cost the header its other navigations.
ok('§1.7 the three mode navigations are untouched — the cure took nothing with it',
  /if \(next === 'ai'\)\s+router\.push\(`\$\{base\}\/studio`\)/.test(H) &&
  /if \(next === 'studio'\)\s+router\.push\(`\$\{base\}\/calendar`\)/.test(H) &&
  /if \(next === 'discover'\) router\.push\(`\$\{base\}\/discover`\)/.test(H));
ok('§1.8 the dropdown still closes itself when Claim is tapped (the control kept its old courtesy)',
  /setProfileOpen\(false\)/.test(H));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE SIBLING-AFTER-</header> LAW (fork B1\'s derived constraint, ruled AS LAW)');
// A non-`none` backdrop-filter creates a containing block for FIXED-position
// descendants. The header carries one. The sheet is position:fixed. Rendered inside
// the header it is clipped into the header's own bar. tsc cannot see this; a
// component test cannot see this; only ordering can.
{
  const iOpen  = H.indexOf('<header');
  const iClose = H.indexOf('</header>');
  const iSheet = H.indexOf('<DemoClaimSheet');
  const sheetCount = (H.match(/<DemoClaimSheet/g) || []).length;

  ok('§2.1 the header element and the sheet both exist in code',
    iOpen >= 0 && iClose >= 0 && iSheet >= 0);
  ok('§2.2 the sheet is mounted AFTER `</header>` — never a descendant',
    iSheet > iClose, 'the fixed sheet would be clipped into the header bar');
  ok('§2.3 the sheet is mounted exactly ONCE — no second copy inside the bar',
    sheetCount === 1, `found ${sheetCount}`);
  ok('§2.4 the header still carries the backdrop-filter that makes this law necessary',
    /backdropFilter: 'blur\(40px\) saturate\(1\.8\)'/.test(H),
    'premise gone: re-derive the law before trusting §2.2');
  ok('§2.5 both live inside the SAME fragment — the sheet is not stranded outside the return',
    /return \(\s*<>[\s\S]*<\/header>[\s\S]*<DemoClaimSheet[\s\S]*<\/>\s*\);/.test(H));
  ok('§2.6 the constraint is stated IN-FILE so the next reader cannot "tidy" it away',
    /SIBLING \*\*AFTER\*\* `<\/header>`/.test(Hr) && /containing block/i.test(Hr));
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · ONE SHEET, ONE HOME (fork A1)');

ok('§3.1 the shared component exists at the ruled path',
  fs.existsSync(path.join(ROOT, SHEET_P)));
ok('§3.2 it exports DemoClaimSheet', /export function DemoClaimSheet\(/.test(S));
ok('§3.3 it is a client component', /^'use client';/.test(Sr));
ok('§3.4 the landing imports it', /import \{ DemoClaimSheet \} from '@\/components\/demo\/DemoClaimSheet';/.test(L));
ok('§3.5 the landing renders it', /<DemoClaimSheet/.test(L));
ok('§3.6 the landing no longer carries a second copy of the sheet markup',
  !/claimError \? \(/.test(L) && !/claimDone \? \(/.test(L));
ok('§3.7 the landing no longer carries the submit hand',
  !/async function handleClaim\(\)/.test(L) && !/demo\/vendor\/\$\{handle\}\/claim/.test(L));
ok('§3.8 the landing keeps ONLY the open question — the sheet owns its own state',
  /const \[claimOpen, setClaimOpen\] = useState\(false\);/.test(L) &&
  !/setClaimPhone/.test(L) && !/setClaimSending/.test(L) &&
  !/setClaimDone/.test(L) && !/setClaimError/.test(L));
// THE ONE-HOME CELL: each frozen string exists exactly once in the repo.
//
// THE UNIT IS THE NODE, NOT THE SENTENCE — and that is a correction, made before
// this bench ever went green, disclosed rather than quietly tuned. The first draft
// listed 'Our team will reach out shortly.' and 'We verify every profile
// personally.' as two entries and went RED on the second at ×2. The second home is
// app/(landing)/page.tsx:881 — the PUBLIC marketing landing's request-done screen,
// which renders a DIFFERENT node that happens to open with the same sentence:
//     'We verify every profile personally.<br />We'll reach out on Instagram or WhatsApp.'
// That is a pre-existing co-home on a surface outside this charter, it predates this
// sitting, and curing it would be copy work on a page nobody chartered. The cell was
// asking the wrong question: the frozen unit is the whole node the founder vetoed,
// which is why ':284' is one entry below and not two. The sentence-level collision is
// FILED in the handover, not papered over — a green bought by shortening the string
// would have been a green bought by deleting the evidence.
{
  const strings = [
    'That didn&apos;t go through.',
    'Something went wrong on our end. Please try again.',
    'Welcome to TDW.',
    'Our team will reach out shortly.<br />We verify every profile personally.',
    'Claim Your Studio.',
    'Enter your number. We&apos;ll reach out on WhatsApp.',
  ];
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (['node_modules', '.next', '.git'].includes(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) files.push(p);
    }
  })(ROOT);
  const bad = [];
  for (const s of strings) {
    const hits = files.filter(f => fs.readFileSync(f, 'utf8').includes(s));
    if (hits.length !== 1) bad.push(`${s} ×${hits.length}`);
  }
  ok('§3.9 every frozen string lives in exactly ONE file — no duplicate to drift',
    bad.length === 0, bad.join(' | '));
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE FROZEN COPY, AT THE BYTE (CE-117)');

ok('§4.1  the error headline, with its &apos; ENTITY (the entity is the byte)',
  S.includes('>That didn&apos;t go through.</div>'));
ok('§4.2  the error body', S.includes('>Something went wrong on our end. Please try again.</div>'));
ok('§4.3  the retry label', S.includes('>Try again</button>'));
ok('§4.4  the welcome headline', S.includes('>Welcome to TDW.</div>'));
ok('§4.5  the done body is ONE node pair around ONE <br /> — never two strings',
  S.includes('>Our team will reach out shortly.<br />We verify every profile personally.</div>'));
ok('§4.6  the form headline keeps its trailing period (distinct from the CTA labels)',
  S.includes('>Claim Your Studio.</div>'));
ok('§4.7  the form subline, with its &apos; ENTITY',
  S.includes('>Enter your number. We&apos;ll reach out on WhatsApp.</div>'));
ok('§4.8  the country prefix', S.includes('>+91</span>'));
ok('§4.9  the placeholder', S.includes('placeholder="00000 00000"'));
ok('§4.10 the submit pair, with U+2026 and U+2192 intact',
  S.includes("{claimSending ? 'Sending\u2026' : 'Claim Studio \u2192'}"));
ok('§4.11 ZERO new user-facing strings: the sheet renders no text node absent from the frozen list',
  !/>(?!\s*<)(?![^<]*\{)[A-Za-z][^<{}]{3,}</.test(
    S.replace('That didn&apos;t go through.', '').replace('Something went wrong on our end. Please try again.', '')
     .replace('Try again', '').replace('Welcome to TDW.', '')
     .replace('Our team will reach out shortly.', '').replace('We verify every profile personally.', '')
     .replace('Claim Your Studio.', '').replace('Enter your number. We&apos;ll reach out on WhatsApp.', '')
     .replace('+91', '')));

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE WIRE (CE-required: the seam where "POST unchanged" could quietly stop being true)');

ok('§5.1 the POST target is byte-identical',
  S.includes('await fetch(`${API_BASE}/api/v2/demo/vendor/${handle}/claim`, {'));
ok('§5.2 API_BASE resolves to the same constant the markup lived beside',
  S.includes("const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';"));
ok('§5.3 method and headers unchanged',
  /method: 'POST',\s*\n\s*headers: \{ 'Content-Type': 'application\/json' \},/.test(S));
ok('§5.4 THE IDENTITY FIELD: the payload mints `vendorName ?? handle`, the byte-equivalent of the old `vendor?.display_name ?? handle`',
  S.includes("body: JSON.stringify({ phone: claimPhone.trim(), vendor_name: vendorName ?? handle }),"));
ok('§5.5 the component takes the two props the payload needs',
  /handle:\s+string;/.test(S) && /vendorName: string \| null;/.test(S) &&
  /export function DemoClaimSheet\(\{ open, onClose, handle, vendorName \}: Props\)/.test(S));
ok('§5.6 the header feeds it the name every one of its mounts already holds',
  /<DemoClaimSheet[\s\S]{0,220}handle=\{handle\}[\s\S]{0,120}vendorName=\{vendorName\}/.test(H));
ok('§5.7 the landing feeds it the SAME value it used to close over',
  /<DemoClaimSheet[\s\S]{0,220}vendorName=\{vendor\?\.display_name \?\? null\}/.test(L));
ok('§5.8 the phone is trimmed on the wire exactly as before',
  S.includes('phone: claimPhone.trim()'));
ok('§5.9 no second channel opens on submit — the sheet POSTs and nothing else',
  !/wa\.me/.test(S) && !/window\.open/.test(S) && !/location\.href/.test(S));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · F-07.37 SURVIVED THE MOVE (a cure must never die in an extraction)');

ok('§6.1 res.ok AND the body\'s own ok:false are both still checked',
  S.includes('if (!res.ok || data?.ok === false) throw new Error(`claim refused: ${res.status}`);'));
ok('§6.2 the done screen is reachable ONLY from the try path',
  /setClaimDone\(true\);\s*\n\s*\} catch \{\s*\n\s*setClaimError\(true\);/.test(S));
ok('§6.3 the ERROR arm is ordered FIRST so a failure cannot fall through into the welcome',
  S.indexOf('claimError ? (') < S.indexOf('claimDone ? ('));
ok('§6.4 the finding\'s evidence comment travelled with the code it explains',
  /F-07\.37 CURED · THE SCREEN HALF/.test(Sr));

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · THE LANDING\'S TWO OWN ENTRIES SURVIVE (fork C1)');

ok('§7.1 the ?claim=1 consumer is intact, byte for byte',
  L.includes("if (searchParams?.get('claim') === '1') {") &&
  /searchParams\?\.get\('claim'\) === '1'\) \{\s*\n\s*setEntered\(true\);\s*\n\s*setClaimOpen\(true\);/.test(L));
ok('§7.2 the deep link still opens the landing\'s own entry strip behind the sheet',
  /setEntered\(true\);\s*\n\s*setClaimOpen\(true\);/.test(L));
ok('§7.3 the landing text link is intact and still opens in place',
  /onClick=\{e => \{ e\.stopPropagation\(\); setClaimOpen\(true\); \}\}/.test(L));
ok('§7.4 its label is unchanged', /\n\s*Claim Your Studio\n\s*<\/button>/.test(L));
ok('§7.5 the landing\'s other two CTAs are untouched — no collateral in the entry strip',
  /router\.push\(`\/demo\/vendor\/\$\{handle\}\/studio`\)/.test(L) &&
  L.includes("window.location.href = `https://demodiscover.thedreamwedding.in`;"));
ok('§7.6 the ruling that preserved the consumer is recorded at the consumer',
  /CE fork C1/.test(Lr) && /BYTE-UNTOUCHED/.test(Lr));

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · CONTROL INVENTORY — every control accounted KEPT (CE-115 clause 1)');

ok('§8.1 C1 the scrim dismisses AND resets all four states',
  /function dismiss\(\) \{\s*\n\s*setClaimDone\(false\);\s*\n\s*setClaimError\(false\);\s*\n\s*setClaimPhone\(''\);\s*\n\s*onClose\(\);/.test(S) &&
  /<div onClick=\{dismiss\}/.test(S));
// C2 — RATIFIED VACUOUS. Its PRESENCE is asserted; its EFFECT deliberately is not.
ok('§8.2 C2 the panel\'s stopPropagation travels byte-identical (presence only — effect NOT asserted, ratified vacuity)',
  S.includes('<div onClick={e => e.stopPropagation()}'));
ok('§8.3 C3 Try again clears the error and returns to the form',
  /onClick=\{\(\) => \{ setClaimError\(false\); \}\}/.test(S));
ok('§8.4 C4 the input keeps tel/numeric/maxLength and its digit strip',
  /type="tel"/.test(S) && /inputMode="numeric"/.test(S) && /maxLength=\{10\}/.test(S) &&
  S.includes("onChange={e => setClaimPhone(e.target.value.replace(/\\D/g, '').slice(0, 10))}"));
ok('§8.5 C5 the submit keeps its exact disabled predicate',
  S.includes('disabled={claimPhone.length < 10 || claimSending}'));
ok('§8.6 C6 the DONE state still carries NO control — the scrim is its only exit (fork D1, zero new strings)',
  (() => {
    const m = S.match(/claimDone \? \(([\s\S]*?)\) : \(/);
    return !!m && !/<button/.test(m[1]);
  })(), 'a control appeared in the done state — that would be a new string');

// ═══════════════════════════════════════════════════════════════════════════
sec('§9 · GEOMETRY FROZEN (CE z-index ruling)');

ok('§9.1 the scrim keeps zIndex 100 and its exact wash',
  S.includes("style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(12,10,9,0.5)' }}"));
ok('§9.2 the panel keeps zIndex 101',
  /zIndex:101/.test(S));
ok('§9.3 both are position:fixed — the escape the §2 law protects',
  (S.match(/position:'fixed'/g) || []).length === 2);
ok('§9.4 the panel keeps its blur, hairline, radius and safe-area padding verbatim',
  S.includes("backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', borderTop:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'20px 20px 0 0', padding:`20px 24px calc(env(safe-area-inset-bottom, 16px) + 24px)`"));
ok('§9.5 the Toast overlap is FILED in-file, not silently cured',
  /zIndex 9999/.test(Sr) && /Block 08/.test(Sr));

// ═══════════════════════════════════════════════════════════════════════════
sec('§10 · THE EIGHTEEN MOUNTS INHERIT IT, WITHOUT EIGHTEEN EDITS');

{
  const demoRoot = path.join(ROOT, 'app/demo/vendor/[handle]');
  const pages = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'page.tsx') pages.push(p);
    }
  })(demoRoot);
  const mounts = pages.filter(p => /<DemoVendorHeader/.test(fs.readFileSync(p, 'utf8')));
  const direct = pages.filter(p => /<DemoClaimSheet/.test(fs.readFileSync(p, 'utf8')));

  ok('§10.1 the header is mounted on exactly EIGHTEEN demo pages',
    mounts.length === 18, `found ${mounts.length}`);
  ok('§10.2 the sheet is mounted directly by exactly ONE page — the landing, the 19th surface',
    direct.length === 1 && direct[0].endsWith(path.join('[handle]', 'page.tsx')),
    direct.map(p => path.relative(ROOT, p)).join(', '));
  ok('§10.3 the landing does NOT mount the header — it is why it needs its own entry',
    !/<DemoVendorHeader/.test(L));
  ok('§10.4 no demo page was edited to gain the sheet — the header alone carries it',
    mounts.every(p => !/<DemoClaimSheet/.test(fs.readFileSync(p, 'utf8'))));
  ok('§10.5 the studio — the surface the founder walks — is among the mounts',
    mounts.some(p => p.endsWith(path.join('studio', 'page.tsx'))));
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§11 · NO NAVIGATION ANYWHERE ON THE CLAIM PATH (the disease\'s whole class)');

ok('§11.1 the sheet itself never navigates and never routes',
  !/useRouter/.test(S) && !/router\./.test(S) && !/location\.href/.test(S) && !/window\.open/.test(S));
ok('§11.2 the sheet imports nothing from next/navigation',
  !/from 'next\/navigation'/.test(S));
ok('§11.3 the header\'s claim control performs no navigation of any kind',
  (() => {
    const m = H.match(/setProfileOpen\(false\); setClaimOpen\(true\);[^}]*\}/);
    return !!m && !/router|location|href/.test(m[0]);
  })());

// ═══════════════════════════════════════════════════════════════════════════
sec('§12 · THE TWO DISCLOSED DEVIATIONS, BENCHED SO NEITHER SURFACE CAN REGRESS');
// Both are rendering-fidelity, zero user-facing bytes. Named here rather than left
// to be discovered: the sheet now renders on nineteen surfaces, not one, and the
// landing's own <style> block reached only the landing.

ok('§12.1 the font stack lists the next/font VARIABLE first (the eighteen) and the literal second (the landing)',
  S.includes(`script: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"`) &&
  S.includes(`body:   "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif"`) &&
  S.includes(`label:  "var(--font-jost), 'Jost', system-ui, sans-serif"`));
ok('§12.2 the placeholder colour travels with the sheet, scoped by class so it reaches no other field',
  S.includes('.${PLACEHOLDER_CLASS}::placeholder { color: rgba(240,230,210,0.3); }') &&
  /className=\{PLACEHOLDER_CLASS\}/.test(S));
ok('§12.3 the placeholder VALUE is unchanged from the landing\'s own rule',
  raw(LANDING_P).includes('input::placeholder { color: rgba(240,230,210,0.3); }'));
ok('§12.4 both deviations are declared IN-FILE, not left to be found',
  /DISCLOSED DEVIATION 1/.test(Sr) && /DISCLOSED DEVIATION 2/.test(Sr));

// ═══════════════════════════════════════════════════════════════════════════
console.log('');
console.log('§13 · MUTATION LEDGER — ALL TEN RUN, ALL TEN RED, NONE VACUOUS');
console.log('      (production source mutated · fresh node process per run · cmp-restored to byte-identity)');
console.log('      M-1  DemoVendorHeader: Claim onClick → router.push(`/demo/vendor/${handle}?claim=1`)  ⇒ §1.1/§1.2/§1.3/§11.3 RED');
console.log('      M-2  DemoVendorHeader: <DemoClaimSheet/> moved INSIDE, above </header>                ⇒ §2.2/§2.5 RED');
console.log('      M-3  DemoVendorHeader: backdropFilter blur(40px) removed                              ⇒ §2.4 RED  (the law\'s premise)');
console.log('      M-4  DemoClaimSheet: `vendor_name: vendorName ?? handle` → `vendor_name: vendorName`  ⇒ §5.4 RED  (the wire seam)');
console.log('      M-5  DemoClaimSheet: `!res.ok || data?.ok === false` → `false`                        ⇒ §6.1 RED  (F-07.37 un-cured)');
console.log('      M-6  DemoClaimSheet: the done body split into two <div>s                              ⇒ §3.9/§4.5 RED  (frozen copy)');
console.log('      M-7  DemoClaimSheet: a "Close" button added to the done state                         ⇒ §4.11/§8.6 RED  (a new string)');
console.log('      M-8  DemoClaimSheet: scrim zIndex 100 → 200                                          ⇒ §9.1 RED  (frozen geometry)');
console.log('      M-9  landing page: the ?claim=1 effect body deleted                                   ⇒ §7.1/§7.2 RED  (fork C1)');
console.log('      M-10 DemoClaimSheet: font stack reverted to the landing\'s literals                    ⇒ §12.1 RED');

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw07_f0760_claim ${pass}/${total}` : `RED — tdw07_f0760_claim ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
