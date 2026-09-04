#!/usr/bin/env node
// scripts/tdw09_money.proof.mjs — TDW_09 Sitting 1 · the money sweep's bench.
//
// ── THIS BENCH ASSERTS A PROPERTY, NOT A ROSTER (R-U29) ──────────────────────
// The census that produced this sweep was derived twice. The first time it matched
// FUNCTION NAMES and reported twelve homes; it missed `amountWordsAdjacent` twelve
// lines below the clean `fmtINR` in the same file, missed `fmt` in admin/revenue
// purely for being differently named, and could not see inline JSX at all. That is
// F-07.95's regex census wearing a new coat, and it was ratified twice before an
// emission-derived re-run found twenty-four emitters (executor D-14, chair No.12).
//
// So this bench does not carry a list of files to check. It RE-DERIVES the site
// list at run time and asserts that no rendered byte anywhere matches the forbidden
// emission classes:
//     · the rupee glyph
//     · the K / L / Cr short forms
//     · a money figure that can be truncated
// The fifteenth formatter someone writes next month under a new name fails this
// cell instead of hiding behind a filename.
//
// Comments are stripped before the sweep — archaeology naming a retired form is not
// the same act as rendering it (ChatThread.tsx's precedent) — and JSX is included,
// because inline JSX is exactly where the sharpest specimen hid.
//
// Runnable from any working directory.  node scripts/tdw09_money.proof.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};

const GLYPH = '\u20b9';

// ── EXEMPTIONS, EACH CARRYING ITS RULING SO THE CELL CANNOT REDDEN SILENTLY
//    AND CANNOT BE NARROWED QUIETLY. The pattern is F-07.16's, inherited whole.
//
//   F-07.27  app/(landing)/discover/VendorCard.tsx — a DEAD surface whose endpoint
//            /api/v2/discovery/feed does not exist, and whose UNITS ARE UNDERIVABLE:
//            the literal divides by 100, so price_min is denominated in thousands,
//            and with no endpoint there is no contract to derive the true unit from.
//            Converting it would be authoring money from a conjecture — refused at
//            CE, and refused again here. THE SWEEP'S FIRST DRAFT TRIED TO CONVERT IT
//            (executor D-15) and was stopped by a case mismatch, not by judgement.
//            Re-wiring that surface MUST re-open this cell.
//
//   F-07.16r lib/frost/budgetBands.ts — five filter LABELS carrying the L-form.
//            Held at a standing §0.2: the copy ruling's three labels do not map onto
//            the code's five filter values, so applying it literally would delete two
//            filter options. A copy ruling cannot execute as a behaviour change
//            without a second word. Chartered as its own rider.
//
//   TipsCarousel.tsx — one vendor-facing SENTENCE containing a figure. R-U4 sends
//            any sentence that changes around a figure to the founder current-vs-
//            proposed; it is copy, not a formatter, and it is not swept mechanically.
//
//   PeekNav CREATES — the glyph used as an ICON beside the word "Invoice", not as a
//            money render. Reported for the founder's word rather than changed on
//            the executor's read of what an icon is.
const EXEMPT = new Map([
  ['app/(landing)/discover/VendorCard.tsx', 'F-07.27'],
  ['lib/frost/budgetBands.ts',              'F-07.16r'],
]);
// ── TWO EXEMPTIONS DISCHARGED, RECORDED RATHER THAN DELETED ──────────────────
// TipsCarousel and PeekNav were exempt at the sweep's first delivery. R-U31 shipped
// the tip's figure into the register (the sentence untouched); R-U32 retired the
// glyph-as-icon rather than exempting it, on the ground that an exemption today is
// the hole tomorrow's stray formatter hides in. Both are now swept like everything
// else. The pair is named here because a shrinking exemption list read from the
// outside is indistinguishable from a bench being quietly weakened — the cell below
// asserts the count so neither growth nor silent shrinkage passes.
// P7.2 ZIP 1b: `PeekNav.tsx` was DELETED at the flip (zero readers before it). It stays named
// here because this pair is the DISCHARGED list — the two files that must never re-enter
// EXEMPT — and a deleted file re-entering would be a stray twice over.
const EXEMPT_DISCHARGED = ['components/vendor/TipsCarousel.tsx', 'components/vendor/PeekNav.tsx'];

// ── the sweep, re-derived every run ─────────────────────────────────────────
const strip = (src) => src
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')   // JSX comment blocks
  .replace(/\/\*[\s\S]*?\*\//g, ' ')       // block comments
  .replace(/\/\/[^\n]*/g, ' ');            // line comments

function sources(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) sources(rel, out);
    else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}
const FILES = [...sources('app'), ...sources('components'), ...sources('lib')];

console.log('\nTDW_09 · money proof — the register as a property, not a roster\n');
console.log(`  (site list re-derived this run: ${FILES.length} source files)\n`);

// ① the glyph
console.log('\u2460 the rupee glyph');
const glyphHits = [];
for (const f of FILES) {
  if (EXEMPT.has(f)) continue;
  const n = (strip(read(f)).match(new RegExp(GLYPH, 'g')) || []).length;
  if (n) glyphHits.push(`${f} (${n})`);
}
ok('no rendered byte carries the rupee glyph', glyphHits.length === 0, glyphHits.join(', '));

// ② the short forms
console.log('\n\u2461 the K / L / Cr short forms');
const SHORT = /(?:Rs\s*)?\$\{[^}]*\}\s*(?:Cr|L|K|k)\b|['"`]\s*Rs\s*[\d.,]+\s*(?:Cr|L|K|k)\b|\.toFixed\([^)]*\)\}\s*(?:Cr|L|K|k)\b/;
const shortHits = [];
for (const f of FILES) {
  if (EXEMPT.has(f)) continue;
  const m = strip(read(f)).match(new RegExp(SHORT.source, 'g'));
  if (m) shortHits.push(`${f}: ${m[0].slice(0, 40)}`);
}
ok('no rendered byte carries a K/L/Cr short form', shortHits.length === 0, shortHits.join(' | '));

// ③ the exemptions are NAMED, and their bytes are UNCHANGED.
//    Count-pinned rather than presence-tested: a presence test over a repeated
//    token cannot notice a partial deletion (F-07.27's own bench learned this).
console.log('\n\u2462 the exemptions — named, and honest');
for (const [f, key] of EXEMPT) {
  ok(`${key} · the exempt file still exists`, fs.existsSync(path.join(ROOT, f)), f);
}
const CARD = 'app/(landing)/discover/VendorCard.tsx';
ok('F-07.27 · the dormancy note still names its dead endpoint',
   /api\/v2\/discovery\/feed/.test(read(CARD)),
   're-wiring that surface must re-open the register question');
ok('F-07.27 · its bytes are UNCHANGED — dormancy is not a half-cure',
   /card\.price_min >= 100 \? /.test(read(CARD)));
ok('every exemption is named in this bench with its ruling key',
   [...EXEMPT.values()].every(v => v && v.length > 3));
// Pinned in BOTH directions. A grown list hides a new violation; a shrunk one
// hides a weakened bench. Either way the reader is owed a ruling, so either way
// this cell reddens and someone has to write one.
ok('the exemption count is exactly two, and the two discharged are swept',
   EXEMPT.size === 2 && EXEMPT_DISCHARGED.every(f => !EXEMPT.has(f)),
   `EXEMPT.size=${EXEMPT.size}`);

// ④ the one home actually is one home
console.log('\n\u2463 the one home');
const FORMAT = read('lib/vendor/format.ts');
ok('formatRs builds the register from the locked prefix',
   /CURRENCY_PREFIX\} \$\{Number\(n\)\.toLocaleString\('en-IN'\)\}/.test(FORMAT));
ok('fitMoneySize is exported for fixed-width cells', /export function fitMoneySize/.test(FORMAT));
ok('moneyNeedsReflow is exported so a cell can branch instead of clipping',
   /export function moneyNeedsReflow/.test(FORMAT));

// ⑤ the no-truncation clause, at the cell that forced it
console.log('\n\u2464 no truncated money (R-U24)');
// P7.2 ZIP 1b (CE-39, 2026-09-04) RE-KEYED, not retired. R-U24's no-truncation clause was
// written at the old Hub's Ledger money div; `app/vendor/page.tsx` was DELETED at the flip
// (R-39.24). The clause has a LIVE HOME: `components/vendor/slices/Masthead.tsx` is the money
// headline every room now renders (the invoices room's Outstanding among them, P7.2 FORK 4).
// The three cells below ask the SAME three questions of it, and one of them got sharper:
//   - no truncation on the money figure  (was: the Ledger div carries no textOverflow)
//   - the figure sizes itself to hold the WHOLE number (was: fitMoneySize at the Owed cell;
//     the Masthead answers with a declared step-down at seven figures, which is the same
//     ruling with a different mechanism, so the cell reads the mechanism that exists)
//   - the compact 'L' formatter is dead  (was: dead at the Hub; now asserted ESTATE-WIDE,
//     derived at 039d005: zero readers of `compact(n / 100000` in app/, components/, lib/)
// `fitMoneySize` itself now has ZERO component readers and lives on in `lib/vendor/format.ts`
// as the sanctioned answer; that is filed, not cured, in the ZIP 1b handover.
const MAST = read('components/vendor/slices/Masthead.tsx');
{
  const moneyDiv = /fontSize: isMoney[\s\S]{0,400}?\}\}>/.exec(MAST);
  ok('the money headline no longer carries textOverflow: ellipsis',
     !!moneyDiv && !/textOverflow/.test(strip(moneyDiv[0])),
     moneyDiv ? 'ellipsis still present on the money headline' : 'money headline not found  anchor moved');
}
ok('the money figure sizes itself to hold the WHOLE figure',
   /fontSize: isMoney && value >= 1_000_000 \? \d+ : \d+/.test(MAST));
ok('the compact formatter is dead estate-wide',
   !/compact\(n \/ 100000, 'L'\)/.test(MAST));


console.log('\n\u2465 the home behaves (executed, not inspected)');
{
  // The home is TypeScript, so it cannot be imported here. Its source is extracted
  // and its type annotations stripped — and the strip is PROVEN before the result
  // is trusted, because a silently-failed strip would make this whole section
  // vacuous, which is worse than declaring it absent.
  const raw = /export function fitMoneySize\([\s\S]*?\n\}/.exec(FORMAT);
  let fit = null, why = '';
  if (!raw) { why = 'fitMoneySize source not found — anchor moved'; }
  else {
    const js = raw[0]
      .replace(/export function/, 'function')
      .replace(/\/\*\*[\s\S]*?\*\//g, '')          // the param jsdoc
      .replace(/(\w+)\s*:\s*[A-Za-z<>\[\]|\s]+?(\s*[,)=])/g, '$1$2')  // param + return types
      .replace(/\)\s*:\s*number\s*\{/, ') {');
    try { fit = new Function(`${js}; return fitMoneySize;`)(); }
    catch (e) { why = `strip failed: ${e.message}`; }
  }
  ok('the home\'s fit function is executable from source', typeof fit === 'function', why);
  if (typeof fit === 'function') {
    const lakh = fit('Rs 1,25,000', 100, 34, 18);
    ok('a lakh figure fits the 100px Ledger cell without clipping',
       'Rs 1,25,000'.length * 0.5 * lakh <= 100 && lakh >= 18, `chose ${lakh}px`);
    ok('a crore figure clamps to the floor rather than overflowing',
       fit('Rs 1,20,00,000', 100, 34, 18) === 18);
    // Not `=== 34`: "Rs 900" is six characters, and 6 x 0.5 x 34 = 102px against a
    // 100px cell, so the conservative estimate correctly steps ONE notch. The first
    // draft asserted 34 and was wrong about the instrument, not the other way round.
    ok('a small figure stays at or near the full size',
       fit('Rs 900', 100, 34, 18) >= 32, `chose ${fit('Rs 900', 100, 34, 18)}px`);
  }
}

console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — ${pass} passed, ${fail} failed\n`);

// ── BOTH-WAYS MUTATIONS, applied alone against production source, cmp-restored ──
//   M1  cabinet.ts: amountWordsAdjacent reverted to its glyph+shorthand dialect
//         → RED ① AND ② — the sharpest specimen, caught by both cells
//   M2  admin/revenue: `fmt` reverted to the glyph
//         → RED ① — the emitter the NAME-derived census could not see
//   M3  discover/leads: fmtBudget reverted to the L/K branches
//         → RED ② — a vendor-facing list row
//   M4  app/vendor/page.tsx: textOverflow ellipsis restored on the Ledger cell
//         → RED ⑤ — the clause R-U24 minted from this very cell
//   M5  app/vendor/page.tsx: bigSize back to the fixed 34
//         → RED ⑤ (the fit cell) while ① and ② stayed GREEN — shape and truncation
//            separating, as designed
//   M6  format.ts: fitMoneySize's loop returns maxPx unconditionally
//         → RED ⑥ — the behaviour cell fires where the shape cell cannot
//   M7  VendorCard: its price literals converted to formatRs
//         → RED ③ ("its bytes are UNCHANGED") — the bench refuses the cure the
//            executor's first draft attempted (D-15)
//   M8  the EXEMPT map emptied
//         → RED ① and ② — a narrowed exemption cannot hide; the cell reddens
process.exit(fail === 0 ? 0 : 1);
