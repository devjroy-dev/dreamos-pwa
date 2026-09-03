#!/usr/bin/env node
/**
 * TDW_09 · R-S1-AMENDED · THE THEME-BLIND SURFACE CENSUS + MAPPER
 *
 * WHY THIS EXISTS (F-09.32, as amended: a HALF-FINISHED ADOPTION).
 * `lib/vendor/theme.ts` authors every role this estate needs and solves each one
 * PER THEME. Surfaces then reached past those roles for hardcoded near-white and
 * white-tint literals, which render identically on both themes — legible on
 * Espresso by luck, invisible on Editorial Paper by arithmetic. The founder's
 * walk of 2026-08-05 convicted two whole vendor pages as blank on Paper.
 *
 * PROPERTY-OVER-ROSTER (R-U29/U38, restated at R-S1-AMENDED).
 * This instrument asserts a PROPERTY of the tree, never a list of filenames, and
 * it finds that property by NORMALIZED NUMERIC PARSE — every rgba() is parsed to
 * four numbers and compared arithmetically. A spelling-roster regex
 * (`rgba(255,255,255,0.04)`) misses `rgba(255, 255, 255, 0.04)` and misses the
 * same colour written in a .css file; the chair found 16 spaced sites and 1 CSS
 * site that escaped BOTH of the greps this sitting opened with. Those 17 sites
 * are this parser's proof of need and the reason no regex ships as the census.
 *
 * INDEPENDENT-METHOD LAW, clause 1: pointed at a directory that is not a pwa
 * clone this exits 1 with a named reason. A check whose failure mode is a silent
 * zero is not a check.
 *
 * USAGE (runnable from ANY working directory — Q-SP-5):
 *   node scripts/tdw09_surface_census.mjs            # census, exit 0
 *   node scripts/tdw09_surface_census.mjs --apply    # census + rewrite in place
 *   TDW_PWA=/path/to/clone node .../tdw09_surface_census.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = process.env.TDW_PWA || path.resolve(HERE, '..');

// ── the named-reason exit. Never a silent zero. ────────────────────────────────
for (const probe of ['package.json', 'lib/vendor/theme.ts', 'app/globals.css']) {
  if (!fs.existsSync(path.join(ROOT, probe))) {
    console.error(`REFUSED — ${ROOT} is not a dreamos-pwa clone: ${probe} is absent.`);
    console.error('Set TDW_PWA to a clone root, or run from inside one.');
    process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
  }
}
{
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (pkg.name !== 'web') {
    console.error(`REFUSED — package.json name is "${pkg.name}", expected "web" (the witnessed dreamos-pwa name, CE-65).`);
    process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
  }
}

const APPLY = process.argv.includes('--apply');

// ── the lane under this instrument's care ─────────────────────────────────────
// TDW_09 O-1: `app/(landing)` JOINS this instrument's care. It was not in any lane
// before, which meant its 50 species sites were not held out — they were INVISIBLE, and
// an instrument that cannot see a lane cannot be said to have cleared it.
const LANES = ['app/vendor', 'app/demo/vendor', 'components/vendor', 'app/(landing)'];

// ── NAMED EXCLUSION, disclosed for ratify-or-reverse ──────────────────────────
// The demo LANDING is held out of the sweep on three grounds, none of them taste:
//   1. it renders under `<ThemeProvider pinned="dark">` (app/demo/vendor/[handle]/
//      layout.tsx), so Editorial Paper never reaches it and there is no legibility
//      to win — this whole species is only a defect where a light theme can arrive;
//   2. it is a founder-VETOED surface whose bytes were ratified line by line, and
//      `scripts/tdw08_p3_landing.proof.mjs` asserts its palette and its CTA
//      hierarchy byte-for-byte;
//   3. it carried 22 of the demo lane's sites, so holding it out removes most of
//      the churn and all of the bench risk in exchange for nothing a reader sees.
// Migrating it would have re-weighted two founder-ratified ghost buttons (their
// near-white edge maps to an ink rung, which is the wrong ROLE for a control edge)
// for zero benefit. Reversed by deleting this array.
// RETURN CONDITION, ruled at Q-5 (CE-194): this hold is NOT permanent. The landing
// rejoins the sweep at O-1, the landing cure, when the surface is rebuilt — the
// species cure lands there regardless, and a permanent exclusion would fossilize
// the disease behind a veto that was about bytes, not about health. Delete this
// array at O-1's charter.
// TDW_09 O-1 · R-O6 · THE HOLD'S REASONS NOW LIVE IN THE FILES THEY GOVERN.
// Q-5's return condition fired at O-1 and the sweep was refused on its own evidence: a
// blind apply maps two founder-ratified control EDGES to an ink rung (this comment's own
// prediction, above) and breaks a floor mutation's anchor. Both files below are rendered
// under a SINGLE THEME and no light theme can reach either, so the species is not a
// defect on them — that is the predicate, and it is absent for every site on both.
// Each file now carries its own decision comment naming its guard and its trigger, so
// the reasoning survives the deletion of this array rather than dying with it.
//   · app/demo/vendor/[handle]/page.tsx — guarded by `<ThemeProvider pinned="dark">`
//   · app/(landing)/page.tsx            — guarded by there being NO ThemeProvider on
//                                         this route group at all (its layout is a bare
//                                         passthrough); the surface is #0C0A09, always.
const HELD_OUT = [
  'app/demo/vendor/[handle]/page.tsx',
  'app/(landing)/page.tsx',
];
const EXTS  = new Set(['.tsx', '.ts', '.css']);

// ── NORMALIZED NUMERIC PARSE ──────────────────────────────────────────────────
// One regex to LOCATE any rgb/rgba token, then arithmetic to decide what it is.
// Whitespace, digit spelling ('.5' vs '0.50') and file type are all irrelevant.
const RGBA = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*([0-9.]+)?\s*\)/g;

const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;
/** The white tint family: white or near-white at a very low alpha — a fill that
 *  LIFTS on a dark surface and vanishes on a light one. */
const isWhiteTint = (r, g, b, a) => near(r, 255) && near(g, 255) && near(b, 255) && a > 0 && a <= 0.10;
/** The near-white ink family: the house cream #F8F7F5 at any alpha, used as INK.
 *  Legible on espresso, 1.03:1 on paper. */
const isNearWhiteInk = (r, g, b) => near(r, 248) && near(g, 247) && near(b, 245);

// ── THE MAPPING, stated so it can be argued with ──────────────────────────────
// Ink rungs are matched to the NEAREST AUTHORED ALPHA in lib/vendor/theme.ts's
// DARK set, because both the literal and the rung are near-white on espresso and
// alpha is therefore the honest distance. Midpoints:
//   ink 1.00 | .825 | inkSoft .65 | .615 | inkMute .58 | .55 | inkDim .52 | .445 | inkFade .37
const inkRung = (a) =>
  a >= 0.825 ? '--atelier-ink'
: a >= 0.615 ? '--atelier-ink-soft'
: a >= 0.550 ? '--atelier-ink-mute'
: a >= 0.445 ? '--atelier-ink-dim'
:              '--atelier-ink-fade';

/** Decide a site's fate from the PROPERTY it sits on and the numbers it holds.
 *  Returns a token name, or null to leave the site alone (with a reason). */
function classify(prop, r, g, b, a, line) {
  const p = prop || '';

  // Decorative sheens carry no legibility. `inset 0 1px 0 rgba(255,255,255,.06)`
  // is a highlight on a sheet lip; on paper it is white-on-white and harmless.
  // Migrating it would move espresso's sheet for no reader's benefit. LEFT.
  if (/boxShadow/.test(p) || /box-shadow/.test(line)) return { token: null, why: 'decorative sheen — no legibility bearing' };

  // Already theme-aware inline (`isLight ? x : y`). Not the disease. LEFT.
  if (/isLight\s*\?/.test(line)) return { token: null, why: 'already theme-aware at the site' };

  if (isNearWhiteInk(r, g, b)) {
    // The file's own key names the role where it has one — that beats the ladder.
    if (/^muted$/.test(p)) return { token: '--atelier-ink-mute', why: 'key names the role (R-S2)' };
    if (/^low$/.test(p))   return { token: '--atelier-ink-fade', why: 'key names the role' };
    return { token: inkRung(a), why: `nearest authored rung to alpha ${a}` };
  }

  if (isWhiteTint(r, g, b, a)) {
    if (/^card$/.test(p))                       return { token: '--role-sheet',           why: 'the sheet surface role (F-09.28)' };
    if (/border|outline/i.test(p))              return { token: '--atelier-input-border', why: 'a component boundary — the 3:1 role (R-S3)' };
    if (/^(background|backgroundColor)$/.test(p)) {
      // An input fill is its own role; every other faint panel is a section.
      return /padding:\s*'11px 14px'/.test(line)
        ? { token: '--atelier-input-bg',  why: 'the field fill role (R-S2)' }
        : { token: '--atelier-section-bg', why: 'a faint inset panel' };
    }
    return { token: null, why: `unclassified white tint on \`${p}\`` };
  }
  return { token: null, why: 'not in the species' };
}

// ── walk ──────────────────────────────────────────────────────────────────────
function* files(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') yield* files(f); }
    else if (EXTS.has(path.extname(e.name))) yield f;
  }
}

const seen = { species: 0, mapped: 0, left: 0, spaced: 0, css: 0, held: 0 };
const perFile = new Map();
const leftReasons = new Map();

for (const lane of LANES) {
  for (const file of files(path.join(ROOT, lane))) {
    const rel = path.relative(ROOT, file);
    if (HELD_OUT.includes(rel)) { seen.held++; continue; }
    const src = fs.readFileSync(file, 'utf8');
    const lines = src.split('\n');
    let out = src, touched = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      RGBA.lastIndex = 0;
      let m;
      while ((m = RGBA.exec(line))) {
        const [lit, R, G, B, A] = m;
        const r = +R, g = +G, b = +B, a = A === undefined ? 1 : +A;
        if (!isWhiteTint(r, g, b, a) && !isNearWhiteInk(r, g, b)) continue;
        seen.species++;
        if (/\s/.test(lit)) seen.spaced++;            // the roster regexes missed these
        if (path.extname(file) === '.css') seen.css++; // and these
        // The property is the LAST `word:` before the literal. Taking the last
        // rather than the first is what makes a ternary-guarded site resolve:
        // `outline: on ? '…' : 'rgba(255,255,255,0.08)'` carries a bare `:` in the
        // middle, and an anchored no-colon match silently returns '' for exactly
        // the sites that matter most — the calendar slot chips.
        const props = [...line.slice(0, m.index).matchAll(/([A-Za-z-]+)\s*:/g)];
        const prop = props.length ? props[props.length - 1][1] : '';
        const { token, why } = classify(prop, r, g, b, a, line);
        if (token) {
          seen.mapped++; touched++;
          // Substitute the LITERAL ITSELF, never a quoted form. A colour can sit
          // alone (`backgroundColor: 'rgba(…)'`) or nested inside a longer string
          // (`outline: '0.5px solid rgba(…)'`); quote-matching cures the first and
          // silently skips the second while still counting it as mapped. That is a
          // check whose failure mode is a silent success, which is worse than none —
          // caught by running --apply twice and finding the census non-idempotent.
          out = out.replace(lit, `var(${token})`);
        } else {
          seen.left++;
          leftReasons.set(why, (leftReasons.get(why) || 0) + 1);
        }
      }
    }
    if (touched) {
      perFile.set(path.relative(ROOT, file), touched);
      if (APPLY) fs.writeFileSync(file, out);
    }
  }
}

console.log('── TDW_09 THEME-BLIND SURFACE CENSUS ' + (APPLY ? '(APPLIED)' : '(READ-ONLY)') + ' ──');
console.log(`root            ${ROOT}`);
console.log(`species sites   ${seen.species}`);
console.log(`  mapped        ${seen.mapped}   across ${perFile.size} files`);
console.log(`  left          ${seen.left}`);
for (const [why, n] of [...leftReasons].sort((a, b) => b[1] - a[1])) console.log(`      ${String(n).padStart(3)}  ${why}`);
console.log(`files held out    ${seen.held}   (see HELD_OUT — pinned-dark, founder-vetoed)`);
console.log(`spaced-variant sites the roster regexes could not see : ${seen.spaced}`);
console.log(`.css sites the roster regexes could not see           : ${seen.css}`);
for (const [f, n] of [...perFile].sort()) console.log(`   ${String(n).padStart(3)}  ${f}`);
