#!/usr/bin/env node
// scripts/waDial.proof.mjs
// MICRO-WA-DIAL (CE-225) — one-tap WhatsApp from the admin People rows.
//
// ── WHY THIS SHAPE, AND IT IS NOT THE OBVIOUS ONE ───────────────────────────
// This bench is a `.proof.mjs` that COMPILES the module under test at startup,
// rather than a `.proof.ts` behind a run-*-proof.sh wrapper like the estate's
// other seven executed benches. The reason is F-07.74, and it is load-bearing:
//
//   AdminUI.tsx:492 contains  accept = 'image/*'
//
// which is the EXACT literal that taught this estate the naive comment-strip
// regex eats live code — 6,519 characters swallowed in one bite at 5535e24.
// Every source cell below reads AdminUI.tsx, so this bench MUST use the
// estate's one character-scanning stripper at scripts/lib/stripComments.mjs.
// That module is ESM; a `.proof.ts` compiled to commonjs by the wrapper
// convention cannot import it, and porting the stripper verbatim into this file
// is the cure F-07.99 already watched fail (a ported copy that was never even
// called, undetected for a whole block).
//
// So: ESM bench, real stripper imported, and the TypeScript module under test
// compiled here with the repo's own tsc — the same binary the seven wrappers
// invoke, so this adds no floor precondition that did not already exist.
//
// NOTHING UNDER TEST IS RE-IMPLEMENTED. cityMatch.proof.ts's header records
// what happens otherwise: its first cut carried its own copy of the ladder and
// went green on three of four production mutations — a proof of the copy.
// §2 below drives the REAL waDialHref, compiled from the real file.
//
// ── BOTH-WAYS LEDGER (mutations on PRODUCTION source, run 2026-08-24) ────────
//   M1  waDial.ts: drop the `startsWith('+')` guard          -> 1.4 2.6 2.7
//   M2  waDial.ts: `digits.length <= 10` -> `< 10`           -> 2.5b
//   M3  waDial.ts: return `wa.me/91${digits}` for a bare ten
//       (the repair A3 refused — a second normaliser
//        semantic in a second repo)                          -> 1.5 2.5b
//   M4  AdminUI.tsx: drop `rel` from ActionLink              -> 3.2
//   M5  AdminUI.tsx: `target="_blank"` -> `target="_self"`   -> 3.1
//   M6  makers/page.tsx: render the link unconditionally     -> 4.3 makers
//   M7  dreamers/page.tsx: inline <a> instead of ActionLink
//       (FORK C's refused arm, restored)          -> 4.1 4.2 4.4 dreamers, 5.x
//   M8  makers/page.tsx: delete the `Send welcome` chip      -> 5.4
//   M9  waDial.ts: href instead of null on empty input       -> 2.3
//
// Cells named are the ones the RUN reported. THE FIRST RUN FOUND TWO HOLES AND
// ONE BAD MUTATION, all recorded rather than quietly fixed:
//
//   · M2 and M3 both went GREEN. Every ten-digit fixture in the bench carried
//     no `+`, so the leading-`+` guard answered first and the LENGTH boundary
//     behind it was never reached — the bench would have shipped a loosened
//     boundary and the refused repair, both invisible. Cell 2.5b was written to
//     reach it. This is the whole argument for both-ways in one instance: the
//     bench was 47/47 green over two live defects.
//   · M4 went GREEN because the mutation was wrong, not the cell — the raw file
//     carries `rel="noopener noreferrer"` in ActionLink's own COMMENT above the
//     attribute, and the replace hit the comment. Re-anchored on the attribute
//     line. Cell 3.2 was then also scoped to ActionLink's block, because a
//     file-wide grep would pass on any other anchor in the design system.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import stripComments from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0, fail = 0; const fails = [];
const ok = (id, cond, why = '') => {
  if (cond === true) { pass++; console.log(`  ok   ${id}`); }
  else { fail++; fails.push(id); console.log(`  FAIL ${id}${why ? ` — ${why}` : ''}`); }
};
const H = (t) => console.log(`\n── ${t} ──`);

console.log('════════════════════════════════════════════════════════════');
console.log('MICRO-WA-DIAL · CE-225 — the People rows dial out');
console.log('════════════════════════════════════════════════════════════');

const DIAL_RAW = R('lib/admin/waDial.ts');
const DIAL = stripComments(DIAL_RAW);
const UI_RAW = R('app/admin/_components/AdminUI.tsx');
const UI = stripComments(UI_RAW);
const MAKERS_RAW = R('app/admin/makers/page.tsx');
const MAKERS = stripComments(MAKERS_RAW);
const DREAMERS_RAW = R('app/admin/dreamers/page.tsx');
const DREAMERS = stripComments(DREAMERS_RAW);

// ═══════════════════════════════════════════════════════════════════════════
H('§0 · THE INSTRUMENT — F-07.74/F-07.99, proven called, proven not over-eating');

// The invocation cell F-07.99 requires: a definition with no call-site fooled
// this estate for a block. This asserts the imported stripper actually ran.
ok('0.1 the estate stripper is INVOKED, not merely imported',
  DIAL_RAW.includes('THE PREDICATE IS THE CENSUS') && !DIAL.includes('THE PREDICATE IS THE CENSUS'),
  'the stripper did not remove a comment it was handed — it is not being called');

// The canary F-07.74 earned. `accept = 'image/*'` is three hundred lines above
// the end of AdminUI.tsx; the naive regex opens a comment there and swallows
// everything after it. If that happened, every §3 cell below would be reading
// an empty string and would fail LOUDLY rather than passing vacuously — but a
// cell is cheaper than a mystery, so the canary is explicit.
ok('0.2 live code AFTER AdminUI\'s `image/*` literal survives the strip',
  UI.includes("accept = 'image/*'") && UI.includes('export function ActionLink'),
  'the stripper ate live code past the image/* literal — F-07.74 reproduced');

// ═══════════════════════════════════════════════════════════════════════════
H('§1 · THE PREDICATE\'S HOME — one, and it repairs nothing');

ok('1.1 the predicate lives at lib/admin/waDial.ts and is exported',
  /export function waDialHref/.test(DIAL));

ok('1.2 it is the ONLY home — neither People page builds a wa.me literal',
  !/wa\.me/.test(MAKERS) && !/wa\.me/.test(DREAMERS),
  'a page is constructing its own link; two copies is FORK C refused');

ok('1.3 both People pages read that one home',
  /import \{ waDialHref \}/.test(MAKERS) && /import \{ waDialHref \}/.test(DREAMERS));

// The census CASE was `phone like '+%' AND digit_count > 10`. These two cells
// pin each half of it in the source, so a widening cannot happen silently.
ok('1.4 the leading-`+` half of the census CASE is present',
  /startsWith\('\+'\)/.test(DIAL));

// A3's whole content. A client-side repair would mint a second normaliser
// semantic in a second repo — the divergence dream-os src/lib/phone.js's own
// header exists to prevent.
// M3's tuition: the first cut of this cell looked for a QUOTED '91' and went
// green over `wa.me/91${digits}` — the repair spliced into a template literal,
// where the 91 wears no quotes at all. The cell now reads the digits wherever
// they sit. §2.5b is the behavioural half and is the one that actually bites.
ok('1.5 NO REPAIR — the predicate mints no country code',
  !/91/.test(DIAL) && !/prepend|normalis|normaliz/i.test(DIAL),
  'the predicate is repairing numbers; A3 ruled it must refuse them instead');

// ═══════════════════════════════════════════════════════════════════════════
H('§2 · THE HREF — the REAL module, executed');

// Compiled with the repo's own tsc, the same binary the seven run-*-proof.sh
// wrappers invoke. Emitted as ESM so the artifact can be imported here.
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'wadial-'));
execFileSync(path.join(ROOT, 'node_modules/.bin/tsc'), [
  path.join(ROOT, 'lib/admin/waDial.ts'),
  '--outDir', OUT, '--module', 'esnext', '--target', 'es2020',
  '--moduleResolution', 'node', '--strict', '--noEmitOnError',
], { stdio: 'pipe' });
fs.renameSync(path.join(OUT, 'waDial.js'), path.join(OUT, 'waDial.mjs'));
const { waDialHref } = await import(pathToFileURL(path.join(OUT, 'waDial.mjs')).href);

// THE ACCEPTANCE CELL, founder-worded: a messy number becomes exact digits.
ok('2.1 the messy fixture dials exactly — +91 98882-94440',
  waDialHref('+91 98882-94440') === 'https://wa.me/919888294440',
  `got ${JSON.stringify(waDialHref('+91 98882-94440'))}`);

ok('2.2 the stored canon dials the same digits',
  waDialHref('+919888294440') === 'https://wa.me/919888294440');

ok('2.3 an empty number renders NOTHING',
  waDialHref('') === null && waDialHref(null) === null && waDialHref(undefined) === null);

ok('2.4 the href carries no `+`, no spaces, no punctuation',
  /^https:\/\/wa\.me\/[0-9]+$/.test(waDialHref('+91 (98882) 944-40')));

// F-10.50's shape, named verbatim at dream-os src/api/admin/vendors.js:19.
// Zero of these survive in production per the 2026-08-24 census, and the cell
// stands anyway: the mint that made them is cured, the rows it made are not
// backfilled, and a restore of any old row must not light this button.
ok('2.5 a bare national number renders NOTHING, never a wrong-country link',
  waDialHref('9431101193') === null,
  'wa.me/9431101193 would open, look correct, and reach a stranger');

// M2 AND M3'S TUITION, and the most useful cell in this file. 2.5 above carries
// no `+`, so the leading-`+` guard answers it first and the LENGTH boundary
// behind that guard was never reached: loosening `<= 10` to `< 10`, and
// splicing in the very repair A3 refused, both went GREEN over the first cut of
// this bench. A ten-digit number that DOES wear a `+` is the only input that
// reaches the boundary, so it is the only input that proves it.
ok('2.5b a `+`-prefixed bare ten renders NOTHING — the boundary itself',
  waDialHref('+9431101193') === null,
  'either the length boundary slipped to `< 10`, or a repair is minting a country code');

// The retirement tombstone: 30 chars, 20 digits, leading 'R'. Ruled INTENTIONAL
// DATA at CE-225 — a retired account should have no WhatsApp button, so absence
// is the true rendering here and not merely caution.
ok('2.6 the retirement sentinel renders NOTHING',
  waDialHref('RET2026081500000000000000000004') === null);

ok('2.7 digits with a country code but no `+` render NOTHING',
  waDialHref('919888294440') === null,
  'absent beats a guess about whether a leading 91 is a country code');

// ═══════════════════════════════════════════════════════════════════════════
H('§3 · THE ANCHOR — it leaves the app, and it leaves it safely');

ok('3.1 ActionLink is an anchor opening a new context',
  /export function ActionLink/.test(UI) && /target="_blank"/.test(UI));

// SCOPED TO ActionLink's OWN BLOCK, deliberately. A file-wide grep for the
// attribute passes on any other anchor in this design system and would report
// ActionLink safe while it shipped bare.
ok('3.2 rel="noopener noreferrer" rides ActionLink itself',
  /export function ActionLink[\s\S]{0,1200}rel="noopener noreferrer"/.test(UI));

// The rows these sit in expand on their own onClick. A tap that reached the
// parent would collapse the drawer as the founder leaves for WhatsApp.
ok('3.3 the anchor stops the row\'s expand-toggle from firing',
  /export function ActionLink[\s\S]{0,900}stopPropagation/.test(UI));

// Zero layout shift: the anchor must present the same box as the chips beside
// it. Anchors do not centre their own text, hence the three extra properties.
ok('3.4 it presents ActionChip\'s box — 44px tap target, same radius, centred',
  /export function ActionLink[\s\S]{0,1200}minHeight: 44/.test(UI)
  && /export function ActionLink[\s\S]{0,1200}borderRadius: 9/.test(UI)
  && /export function ActionLink[\s\S]{0,1200}justifyContent: 'center'/.test(UI));

// ═══════════════════════════════════════════════════════════════════════════
H('§4 · THE SEATING — both lanes, absent never dead');

for (const [lane, SRC] of [['makers', MAKERS], ['dreamers', DREAMERS]]) {
  ok(`4.1 ${lane} — the affordance is seated`,
    /<ActionLink/.test(SRC));

  ok(`4.2 ${lane} — through the primitive, never a raw anchor`,
    !/<a\s/.test(SRC),
    'an inline <a> is FORK C\'s refused arm — rel drifts when it has two homes');

  // The absent-never-dead law. The link renders only inside a truthiness gate
  // on the href, and carries no `disabled` state to fall back to.
  ok(`4.3 ${lane} — null href renders NOTHING, not a dead button`,
    /href && \(/.test(SRC) && !/<ActionLink[^>]*disabled/.test(SRC),
    'an ungated ActionLink would render an href of "null" on a silent row');

  ok(`4.4 ${lane} — the founder byte is 'WhatsApp'`,
    /label="WhatsApp"/.test(SRC));

  ok(`4.5 ${lane} — it reads the row's own phone, not a constant`,
    /waDialHref\((v|c)\.phone\)/.test(SRC),
    'a hardcoded number here is F-05.24 reproduced on the admin plane');
}

// Persona names never appear in product chrome — the copy law, and this chip is
// chrome the founder sees every day.
ok('4.6 no persona name rides the new chrome',
  !/(Victor|Donna|Harvey|Mira|Eliza)/.test(MAKERS) && !/(Victor|Donna|Harvey|Mira|Eliza)/.test(DREAMERS));

// ═══════════════════════════════════════════════════════════════════════════
H('§5 · CONTROL INVENTORY — this adds one and removes none (CE-115)');

// A bench cannot catch what nobody told it to look for. Every control the
// read-first inventoried on both row components is named here BY ITS OWN BYTES,
// so a future edit that quietly drops one reds this bench instead of shipping.
const MAKER_CONTROLS = [
  ['row header tap-to-expand', /onClick=\{\(\) => toggleOpen\(v\.id\)\}/],
  ['tier buttons', /TIERS\.map\(t => \(/],
  ['Hide\\/Add to Discover', /label=\{v\.discover_eligible \? 'Hide from Discover' : 'Add to Discover'\}/],
  ['Send welcome', /label="Send welcome"/],
  ['Send welcome tap-to-confirm', /label=\{welcomeBusy === v\.id \? 'Sending…' : 'Tap again to send on WhatsApp'\}/],
  ['Delete', /label="Delete"/],
  ['Delete tap-to-confirm', /label="Tap again to delete permanently"/],
  ['search field', /<FieldInput label="Search"/],
  ['tier filter pills', /\['all', \.\.\.TIERS\]\.map/],
  ['\\+ New mint door', /label="\+ New"/],
];
let mi = 0;
for (const [name, re] of MAKER_CONTROLS) ok(`5.${++mi} makers KEPT — ${name}`, re.test(MAKERS));

const DREAMER_CONTROLS = [
  ['row header tap-to-expand', /onClick=\{\(\) => toggleOpen\(c\.id\)\}/],
  ['tier buttons', /TIERS\.map\(t => \(/],
  ['Delete', /label="Delete"/],
  ['Delete tap-to-confirm', /label="Tap again to delete permanently"/],
  ['search field', /<FieldInput label="Search"/],
  ['\\+ New mint door', /label="\+ New"/],
];
let di = 0;
for (const [name, re] of DREAMER_CONTROLS) ok(`5.${mi + ++di} dreamers KEPT — ${name}`, re.test(DREAMERS));

// The other half of "adds one": exactly one, not two.
ok('5.x exactly one ActionLink per row component',
  (MAKERS.match(/<ActionLink/g) || []).length === 1
  && (DREAMERS.match(/<ActionLink/g) || []).length === 1);

// ── control: the cells above CAN fail ──────────────────────────────────────
ok('5.y control — a control that never existed is not found',
  !/label="Archive"/.test(MAKERS));

fs.rmSync(OUT, { recursive: true, force: true });

console.log('\n════════════════════════════════════════════════════════════');
console.log(fail === 0
  ? `GREEN — waDial ${pass}/${pass}`
  : `RED — waDial ${pass} passed, ${fail} failed: ${fails.join(', ')}`);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
