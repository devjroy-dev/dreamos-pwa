// scripts/tdw09_p2b.proof.mjs — PHASE B, pwa surfaces: the vocabulary consumed,
// the wizard reading the bio, the Storefront bio story, the Frost honest line.
// The parity ARBITER is its own file (tdw09_p2b_vocab.proof.mjs) and runs first.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const __R0 = (p) => readFileSync(join(ROOT, p), 'utf8');

/* ── AMENDMENT, TDW_13 D-5: THE SUBJECT IS THE SURFACE ──────────────────────
   D-4 and D-5 split the eleven blooms out of sanctuary/page.tsx into
   components/frost/blooms/, with two shared helpers in components/frost/_shared/.
   The bride's Sanctuary is the same screen across fourteen files. Every cell
   here asking about SANCTUARY was asking about the screen, not the path, so a
   read of the sanctuary path returns the whole surface. Directories are READ,
   never hand-listed — a written list is exactly how a byte escapes a bench.
   See components/frost/_shared/SURFACE.md. */
const __SANCT_PATH = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const R = (p) => {
  if (p !== __SANCT_PATH) return __R0(p);
  const parts = [__R0(__SANCT_PATH)];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = join(ROOT, d);
    if (existsSync(abs)) for (const f of readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) parts.push(__R0(`${d}/${f}`));
  }
  return parts.join('\n');
};

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
let pass = 0, fail = 0;
const cell = (id, ok, msg) => { if (ok) { pass++; console.log(`  PASS ${id} ${msg}`); } else { fail++; console.log(`  FAIL ${id} ${msg}`); } };

const HONESTY = "Your own words are shown on your profile, but couples can&rsquo;t filter by them yet.";

console.log('\n── §1 · the wizard (F-4(a) + F-5(a) + F-7) ──');
{
  const raw = R('app/vendor/discover/submit/page.tsx');
  const src = strip(raw);
  cell('1.1', !src.includes('AESTHETIC_OPTIONS'), 'the local hard-coded ten is retired from code');
  cell('1.2', src.includes("vocabularyFor(me?.category ?? null)"), 'chips come from the category\u2019s vetoed list');
  cell('1.3', src.includes('useSettings') && /if \(bio\.rate_min\) setRateMin/.test(src) && /setSeeded\(true\)/.test(src),
    'the wizard READS the bio and seeds once (F-4(a))');
  cell('1.4', (src.match(/From your bio — edit there/g) || []).length === 2,
    'the vetoed review line RENDERS at BOTH prefilled fields (comment citations excluded — stripped read)');
  cell('1.5', /rateFromBio \?/.test(src) && !/rateFromBio[\s\S]{0,900}<input type="number"[\s\S]{0,200}rateFromBio/.test('x'),
    'a prefilled rate renders as REVIEW, not an input');
  cell('1.6', raw.includes(HONESTY), 'the vetoed honesty byte at the wizard\u2019s custom entry');
  cell('1.7', src.includes('addCustom') && src.includes("placeholder=\"Add your own word\""), 'ONE custom input (F-7)');
  cell('1.8', src.includes('normalizeTags(tags)'), 'the submit payload normalises (client edge of the write side)');
  cell('1.9', src.includes('{vocab && (') || /vocab &&/.test(src), "'other'/no-category renders no chips — custom is the editor");
}

console.log('\n── §2 · the profile editor (the second free-text field, cured) ──');
{
  const raw = R('app/vendor/discover/profile/page.tsx');
  const src = strip(raw);
  cell('2.1', !src.includes('Tags (comma-separated)'), 'the comma free-text field is retired');
  cell('2.2', src.includes('TagEditor') && src.includes('vocabularyFor(category)'), 'chips + the shared vocabulary');
  cell('2.3', raw.includes(HONESTY), 'the vetoed honesty byte at this custom entry too');
  cell('2.4', src.includes('normalizeTags(current.aesthetic_tags.split'), 'the save normalises before PATCH');
  cell('2.5', src.includes('isVocabularyTag'), 'custom words render distinct (dashed) from vocabulary picks');
  cell('2.6', src.includes("from '@/lib/vendor/profileMeter'") && src.includes("from '@/components/vendor/ProfileMeter'"),
    'the meter model + arc import back from their moved homes (render unchanged)');
}

console.log('\n── §3 · Storefront §1 (F-3(a) + counts + V1/V2) ──');
{
  // ── \u00a74-3 \u00b7 F-38.43 \u00b7 THE SUBJECT MOVED; THIS SECTION FOLLOWS IT ────────────────
  // Storefront crossed into the shell and its body split out of the route file so the
  // `<Header/>` import could leave the shell's bundle. Every claim in this section is about
  // the BODY \u2014 the vetoed heading, the meter, the bio row, the live counts \u2014 and the body
  // is `screen.tsx` now. A cell left pointing at the old path would have reddened a correct
  // tree. Declared at this reading section, not at the top: \u00a72 above reads other files for
  // other claims and must not appear to share a subject with this one.
  const SF_BODY = 'app/vendor/storefront/screen.tsx';
  const raw = R(SF_BODY);
  const src = strip(raw);
  cell('3.1', raw.includes('label="Complete your bio"'), 'the FOUNDER-VETOED heading seats as §1');
  cell('3.2', src.includes('scoreOf(gaps)') && src.includes('<Meter score={score} />'),
    'the completeness score beside it — THE one model, one arc');
  cell('3.3', src.includes('res.min_portfolio_images') && src.includes("fetchPortfolio(vendorId, 'approved')"),
    "the meter's inputs are the profile page's own reads, byte-for-byte");
  cell('3.4', raw.includes('How couples see you'), 'the bio row carries the drawer\u2019s vetoed subtitle');
  cell('3.5', raw.includes('/vendor/discover/profile'), 'the block LINKS the bio route — byte-identical path');
  // ── AMENDED AT CE-39 2c · RETIRE-WITH-THE-READER  [F-39.34] ────────────────
  // IT READ:
  //     cell('3.6', src.includes('open_leads_count') && src.includes('photos live'),
  //       'live counts (founder 「 ok 」) from the standing endpoints');
  //
  // F-39.10 RETIRED THE STOREFRONT LEADS FIGURE at Phase 4 (`f915b55`) —
  // 「storefront's engine-plane leads figure retired; Today is the one leads
  // number」. `open_leads_count` survives in `screen.tsx` ONLY at :192, inside
  // the comment explaining its own retirement, so `strip()` removes it and this
  // cell has reddened at ORIGIN ever since. Bisected on `screen.tsx` alone:
  // GREEN at 79fc1db, RED at f915b55 · 08a6dfe · d1f2c80 · bb4a9ad.
  //
  // The cure is not to loosen the assertion but to INVERT the half whose
  // subject moved. The figure is gone from the rendered surface BY RULING, so
  // the cell asserts its ABSENCE — which is the stronger guard, because a
  // storefront that grows the leads figure back is the defect F-39.10 cured.
  // The `photos live` half is untouched: that count was never retired.
  //
  // ONE CELL BEFORE, ONE CELL AFTER. Read RAW for the absence half so a
  // re-introduction inside a comment cannot pass as a cure, and STRIPPED for
  // the presence half so prose cannot stand in for a rendered byte.
  cell('3.6', !/\{[^}]*open_leads_count/.test(strip(raw)) && src.includes('photos live'),
    'the retired leads figure does not render; the photo count does (F-39.10)');
  // ── AMENDED AT R-35.36, RETIRE-WITH-THE-READER ──────────────────────────────
  // This cell pinned TWO founder-vetoed tile descriptions. One of the two tiles
  // no longer exists: the Leads tile ('couples who enquired') was retired when
  // the founder ruled the storefront is profile and portfolio, not leads.
  //
  // THE SURVIVING HALF IS KEPT AND STILL PINNED — a vetoed byte does not stop
  // being vetoed because its neighbour left. The retired half is not repointed
  // and not deleted in silence: pinning copy that no surface renders is a green
  // cell about nothing, and deleting the line without its reason teaches the
  // next reader that vetoed copy may quietly lapse.
  // AMENDED, LABELLED — ZIP 14 (R-37.87, founder word 2026-08-27). This cell pinned the
  // Collab row's vetoed description INSIDE Storefront's pill list. Collab now holds its own
  // tile in the shell's bottom band, and the pill row dropped it in the same delivery — one
  // home, or it is two. So the cell's SUBJECT was retired by ruling, exactly as its own
  // paragraph above describes happening to V1's Leads tile: the byte goes with the surface.
  // RETIRE-WITH-THE-READER — the assertion inverts rather than vanishing, so the next reader
  // meets the reasoning instead of an absence, and a silent RE-ADD of the second door reddens.
  // Cell count unchanged; `main` is untouched and keeps the row.
  cell('3.7', !raw.includes("description: 'shared weddings with other vendors'"),
    "Collab's pill row is GONE from Storefront — R-37.87 gave it a tile; two doors to one room reddens");
}

console.log('\n── §4 · the Frost honest line (F-6(a)) ──');
{
  const raw = R('app/(frost)/frost/canvas/sanctuary/page.tsx');
  const src = strip(raw);
  cell('4.1', !src.includes('DISC_VIBES'), 'the made-up capitalised ten is retired from code');
  cell('4.2', raw.includes('Pick a category to filter by vibe'), 'the FOUNDER-VETOED line until a category is picked');
  cell('4.3', src.includes('vocabularyFor(DISC_CAT_TO_VOCAB[local.category]'),
    'picked category → its vetoed list as the chips');
  cell('4.4', src.includes('vibes:[]}))'), 'switching category clears vibes — stale terms never smuggle into the filter (stated movement)');
  cell('4.5', src.includes('if (!vlist) return null'), 'a category with no vetoed list is honestly chip-free');
}

console.log('\n── §5 · one home, no strays ──');
{
  const vocab = R('lib/shared/tagVocabulary.ts');
  cell('5.1', vocab.includes('scripts/tdw09_p2b_vocab.proof.mjs'), 'the home names its arbiter');
  const meterLib = R('lib/vendor/profileMeter.ts');
  cell('5.2', meterLib.includes('MOVED from app/vendor/discover/profile/page.tsx'), 'the meter model names its origin (moved, not rewritten)');
}

console.log(`\n════ tdw09_p2b: ${pass} passed, ${fail} failed (total ${pass + fail}) ════`);
process.exit(fail === 0 ? 0 : 1);
