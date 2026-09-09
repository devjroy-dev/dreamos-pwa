// scripts/ce41_brand_family.mjs — CE-41 · R-41.126 · ONE BRAND FAMILY, ONE HOME.
//
//     node scripts/ce41_brand_family.mjs
//
// WHAT IT PROVES. That every icon this estate serves comes from public/brand/, that
// each path named actually exists on disk, and that no icon or favicon survives
// anywhere else in public/ or app/ to be served by accident.
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL.
//
//   · IT FINDS THE MANIFESTS RATHER THAN LISTING THEM. The rider's spec said "the
//     manifest"; the tree had FOUR json manifests (site, admin, couple, worklist) and
//     a FIFTH generated per request at app/coplanner/manifest/route.ts, which no sweep
//     of public/ can see and which would have gone on serving the retired icons after
//     they left the tree. R-41.121: assert the meaning — every manifest, wherever it
//     is authored — not the spelling of one filename.
//
//   · IT COUNTS READERS, NOT FILES. `public/sw.js` names an icon for push
//     notifications, and a service worker is the one surface that cannot be
//     re-rendered: whatever it shipped with is what Android draws until the file
//     changes. It is a reader and it is checked.
//
//   · UNREFERENCED FAMILY MEMBERS ARE NOT STRAYS. public/brand/ holds fourteen files
//     and this rider references nine. The two whatsapp-profile-* images are for Meta
//     business profiles and belong to no web surface; favicon-64 and the light lockup
//     are held for surfaces that do not exist yet. A cell that redded on "unreferenced"
//     would red on the family itself, so the stray test is by LOCATION — an icon
//     outside public/brand/ — not by whether this rider happens to point at it.
//
// WHAT IT DOES NOT CLAIM. Anything about the pictures. Whether the seal reads at 16px,
// whether the maskable safe zone is right, and whether the light lockup is the correct
// choice on Chalk are all the founder's walk (R-39.15). This cell only proves the
// wiring is one home with no orphans.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

let pass = 0, fail = 0;
const green = (n) => { pass++; console.log(`  ✓ ${n}`); };
const red = (n, d) => { fail++; console.log(`  ✗ ${n}\n      ${d}`); };

console.log('\nCE-41 R-41.126 — one brand family, one home\n');

const BRAND = 'public/brand';
const walk = (dir) => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// ── EVERY MANIFEST, FOUND NOT LISTED ─────────────────────────────────────────
const jsonManifests = readdirSync('public').filter((f) => f.endsWith('manifest.json') || f === 'manifest.json');
if (jsonManifests.length) green(`${jsonManifests.length} json manifests found: ${jsonManifests.join(', ')}`);
else red('json manifests found', 'none — the sweep is looking in the wrong place');

const runtimeManifests = walk('app').filter((f) => /manifest\/route\.(ts|tsx|js)$/.test(f));
if (runtimeManifests.length) green(`${runtimeManifests.length} runtime manifest route(s) found: ${runtimeManifests.join(', ')}`);
else console.log('  · no runtime manifest routes on this tree');

const readers = [
  ...jsonManifests.map((f) => `public/${f}`),
  ...runtimeManifests,
  'public/sw.js',
  'app/layout.tsx',
];

// Any icon-ish path a reader names. A path that is not under /brand/ is the defect.
const RE_ICON_PATH = /['"`](\/[A-Za-z0-9._/-]*(?:icon|favicon|lockup|apple-touch)[A-Za-z0-9._/-]*\.(?:png|ico|svg))['"`]/gi;

for (const f of readers) {
  if (!existsSync(f)) { red(`${f} — present`, 'a named reader is missing; the sweep and the tree disagree'); continue; }
  const src = readFileSync(f, 'utf8');
  const paths = [...src.matchAll(RE_ICON_PATH)].map((m) => m[1]);
  if (!paths.length) { green(`${f} — names no icon`); continue; }
  const strays = paths.filter((p) => !p.startsWith('/brand/'));
  if (strays.length) { red(`${f} — every icon it names is under /brand/`, `outside: ${[...new Set(strays)].join(', ')}`); continue; }
  const missing = paths.filter((p) => !existsSync(join('public', p)));
  if (missing.length) red(`${f} — every icon it names exists on disk`, `missing: ${[...new Set(missing)].join(', ')}`);
  else green(`${f} — ${new Set(paths).size} icon path(s), all under /brand/ and all on disk`);
}

// ── NO ICON SURVIVES OUTSIDE THE FAMILY ──────────────────────────────────────
// app/favicon.ico is Next's own convention and is served from the app dir, so it is
// allowed BY NAME and asserted byte-identical to the family's .ico below rather than
// being treated as a second home.
const ALLOWED_OUTSIDE = new Set(['app/favicon.ico']);
const stray = [...walk('public'), ...walk('app')]
  .filter((f) => /(icon|favicon|lockup|apple-touch)[^/]*\.(png|ico)$/i.test(f))
  .filter((f) => !f.startsWith(BRAND + '/') && !ALLOWED_OUTSIDE.has(f));
if (stray.length) red('no icon file outside public/brand/', stray.join('\n      '));
else green('no icon file outside public/brand/ (app/favicon.ico allowed by name)');

if (existsSync('app/favicon.ico') && existsSync(`${BRAND}/favicon.ico`)) {
  const a = readFileSync('app/favicon.ico'), b = readFileSync(`${BRAND}/favicon.ico`);
  if (a.equals(b)) green('app/favicon.ico is the family\'s .ico, byte for byte');
  else red('app/favicon.ico is the family\'s .ico', 'the two differ — that is a second brand, not a convention');
} else {
  red('app/favicon.ico and the family\'s .ico both exist', 'one of them is missing');
}

// ── R-41.134 · NO MASTHEAD DRAWS THE MARK AT ALL ────────────────────────────
// THIS ASSERTION INVERTED, AND IT IS WRITTEN DOWN RATHER THAN QUIETLY SWAPPED.
// It began (R-41.129) as `every masthead draws the monogram` — four cells naming the
// three ruled surfaces. R-41.134 ruled the mark off the mastheads entirely: the lockup
// failed at header width (F-A, 8.52:1, caps at 7px), the monogram failed at 16px in a
// browser tab (F-C, three italic serif letters over five pixels each), and the founder
// took both back to type. The seal keeps the icons, the favicon, the WhatsApp profiles
// and the PDF cover — every surface where it is drawn at a size that holds it.
//
// So the rule now is the opposite one, and it is still a RULE and not a list (R-41.121):
// NO file under app/ or components/ references a lockup or a monogram. A fourth masthead
// written tomorrow that reaches for the mark reds tomorrow, with nobody editing this cell.
//
// WHAT STAYS LAWFUL: the <link rel="icon"> and <link rel="apple-touch-icon"> tags in
// app/layout.tsx. Those are icons, not mastheads, and they are asserted above — this
// sweep matches only the two mark filenames, so it cannot red on them.
{
  const surfaces = [...walk('app'), ...walk('components')].filter((f) => /\.(tsx|ts|jsx|js|css)$/.test(f));
  const offenders = [];
  for (const f of surfaces) {
    const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    if (/lockup-for-(dark|light)-ground|monogram-gold(-deep)?\.png/.test(src)) offenders.push(f);
  }
  if (offenders.length) red('no screen surface draws the lockup or the monogram (R-41.134)', offenders.join('\n      '));
  else green('no screen surface draws the lockup or the monogram (R-41.134)');
}

// THE THREE REVERTED MASTHEADS ARE TYPE. Asserted by what they DO hold rather than by
// what they no longer do: a sweep that only checked for absence would pass a masthead
// somebody deleted outright.
{
  const MASTHEADS = [
    ['app/(landing)/page.tsx', 'The Dream Wedding'],
    ['app/admin/layout.tsx', 'The Dream Wedding'],
    ['components/worklist/WorklistShell.tsx', 'The Dream Wedding'],
  ];
  for (const [f, words] of MASTHEADS) {
    if (!existsSync(f)) { red(`${f} — present`, 'a ruled masthead is missing'); continue; }
    const src = readFileSync(f, 'utf8');
    // Whitespace-tolerant: the cockpit's masthead sits on its own line inside its div,
    // so `>The Dream Wedding<` never matches. The first cut of this assertion redded a
    // masthead that is correct — a cell that reads JSX by exact adjacency is asserting
    // formatting, not the rule.
    const asText = new RegExp('>\\s*' + words.replace(/ /g, '\\s+') + '\\s*<');
    if (asText.test(src)) green(`${f} — the house name is type`);
    else red(`${f} — the house name is type`, `no plain "${words}" text node found`);
  }
}

// ── THE MASKABLE PURPOSE IS DECLARED, AND ONCE ───────────────────────────────
// A maskable icon served as `any` gets letterboxed on Android; an `any` icon served as
// maskable gets its edges cropped. The purpose is the whole point of the third file.
for (const f of jsonManifests) {
  const d = JSON.parse(readFileSync(`public/${f}`, 'utf8'));
  const icons = d.icons || [];
  const maskable = icons.filter((i) => String(i.purpose || '').split(/\s+/).includes('maskable'));
  if (maskable.length === 1 && maskable[0].src.includes('maskable')) green(`${f} — one maskable icon, and it is the maskable file`);
  else red(`${f} — one maskable icon, and it is the maskable file`, `got: ${JSON.stringify(maskable.map((i) => i.src))}`);
}

console.log(`\n${'─'.repeat(60)}\nce41_brand_family: ${pass} passed, ${fail} failed  (total ${pass + fail})\n`);
process.exit(fail ? 1 : 0);
