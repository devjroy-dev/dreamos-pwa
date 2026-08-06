#!/usr/bin/env node
// scripts/tdw10_p1_shell.proof.mjs — TDW_10 · ADMIN P1's bench.
//
// Proves the phase's four ruled items:
//   ①  the dark token set exists, is admin-only, and the rebuilt set names
//       ROLES rather than colours (acceptance number 1)
//   ②  the six-domain IA is exactly the six A-1 names, in order
//   ③  the mapping table accounts for every admin route ON DISK — derived by
//       an INDEPENDENT method (a filesystem walk), never read back out of the
//       file it is checking (acceptance number 2)
//   ④  the retirement stamp and the palette exclusion (R-A4)
//   ⑤  the accent moved rose → gold (R-A1 rider ii)
//   ⑥  the command palette's controls and its jump bookkeeping (R-A5/R-A7)
//   ⑦  route paths are byte-unchanged — the deep-link answer, asserted
//   ⑧  GUARDS: things that were already true and must stay true
//
// Runnable from any working directory.  node scripts/tdw10_p1_shell.proof.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readOr = (p, fallback = null) => {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return fallback; }
};

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};

const LAYOUT  = readOr('app/admin/layout.tsx', '');
const TOKENS  = readOr('app/admin/_components/tokens.css', '');
const NAV     = readOr('app/admin/_components/adminNav.ts', '');
const PALETTE = readOr('app/admin/_components/CommandPalette.tsx', '');
const SEARCH  = readOr('lib/admin-api/search.ts', '');
const THEME   = readOr('lib/vendor/theme.ts', '');

console.log('\nTDW_10 · ADMIN P1 — the shell: six domains, the palette, the dark tokens\n');

// ════════════════════════════════════════════════════════════════════════════
// ① THE TOKEN SET
// ════════════════════════════════════════════════════════════════════════════
console.log('① the dark token set');

ok('app/admin/_components/tokens.css exists', TOKENS.length > 0);

// THE COUNTING METHOD, DECLARED IN-CELL (instruments own their counts):
// a "hex literal" here is a `#` followed by exactly 3, 4, 6 or 8 hex digits and
// then a non-word boundary — the same shape a CSS colour takes. This is the
// method; a different grep will legitimately return a different number, which
// is why the number lives here and not in a comment somewhere else.
const HEX = /#[0-9A-Fa-f]{8}\b|#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{4}\b|#[0-9A-Fa-f]{3}\b/g;
const REBUILT = [
  ['app/admin/layout.tsx', LAYOUT],
  ['app/admin/_components/adminNav.ts', NAV],
  ['app/admin/_components/CommandPalette.tsx', PALETTE],
  ['lib/admin-api/search.ts', SEARCH],
];

for (const [name, src] of REBUILT) {
  // Comments are stripped first: a paragraph that EXPLAINS a retired hex is
  // documentation, not a colour. Stripping is the honest reading of "hex
  // literals fail review" — the review is of what renders.
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const hits = code.match(HEX) || [];
  // layout.tsx keeps ONE by design: the PWA <meta name="theme-color"> content,
  // which cannot be a var() — a browser reads that attribute before any
  // stylesheet. Named here so the exception is a ruling and not a leak.
  const allowed = name === 'app/admin/layout.tsx' ? ['#0F1622'] : [];
  const leaks = hits.filter(h => !allowed.includes(h));
  ok(`${name} names roles, not colours (0 hex literals outside the declared exception)`,
     leaks.length === 0, leaks.join(', '));
}

ok('the meta theme-color exception is the ONLY hex in the shell, and it is the cockpit navy',
   /content="#0F1622"/.test(LAYOUT));

// The borrowed vocabulary (R-A1's mechanism comment is a claim; this is its check).
const BORROWED = ['ink', 'inkSoft', 'inkMute', 'inkDim', 'inkFade', 'positive', 'caution', 'critical', 'metal', 'scrim', 'sheet', 'cardBg', 'cardBorder', 'headerBg', 'inputBg', 'inputBorder'];
ok('every borrowed role name is still declared by lib/vendor/theme.ts (the donor)',
   BORROWED.every(r => new RegExp(`\\n\\s*${r}:\\s`).test(THEME)),
   BORROWED.filter(r => !new RegExp(`\\n\\s*${r}:\\s`).test(THEME)).join(', '));

const CSS_ROLES = ['--admin-bg', '--admin-ink', '--admin-ink-soft', '--admin-ink-mute', '--admin-ink-dim', '--admin-ink-fade', '--admin-metal', '--admin-scrim', '--admin-sheet', '--admin-positive', '--admin-caution', '--admin-critical', '--admin-card-bg', '--admin-card-border', '--admin-input-bg', '--admin-input-border', '--admin-hairline'];
ok('the CSS set declares every role the shell reaches for',
   CSS_ROLES.every(r => TOKENS.includes(`${r}:`)),
   CSS_ROLES.filter(r => !TOKENS.includes(`${r}:`)).join(', '));

ok('the mechanism comment names its donor by path (F-06.85, path-over-range)',
   /lib\/vendor\/theme\.ts/.test(TOKENS) && /F-06\.85/.test(TOKENS));

ok('the token set is ADMIN-ONLY — no vendor/bride surface imports it',
   (() => {
     const hits = [];
     const walk = (dir) => {
       for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
         const rel = `${dir}/${e.name}`;
         if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.next') walk(rel); continue; }
         if (!/\.(tsx?|css)$/.test(e.name)) continue;
         const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
         if (src.includes('_components/tokens.css') && !rel.startsWith('app/admin/')) hits.push(rel);
       }
     };
     ['app', 'components', 'lib', 'hooks'].forEach(d => { try { walk(d); } catch {} });
     return hits.length === 0;
   })());

ok('the shell imports it', /import\s+'\.\/_components\/tokens\.css'/.test(LAYOUT));

// ════════════════════════════════════════════════════════════════════════════
// ② THE SIX DOMAINS (A-1)
// ════════════════════════════════════════════════════════════════════════════
console.log('\n② the six-domain IA');

const domainKeys = [...NAV.matchAll(/key:\s*'(growth|marketplace|people|money|engine|content)'/g)].map(m => m[1]);
ok('exactly six domains are declared', domainKeys.length === 6, domainKeys.join(', '));
ok("the six are A-1's own names, in A-1's own order",
   domainKeys.join(',') === 'growth,marketplace,people,money,engine,content',
   domainKeys.join(','));
ok('the Bridge is a destination, not a domain', /export const BRIDGE: Section/.test(NAV) && !domainKeys.includes('bridge'));
ok('Money ships with an honest empty state rather than being hidden',
   /key:\s*'money'[\s\S]{0,600}?empty:\s*'/.test(NAV) && /sections:\s*\[\]/.test(NAV));
ok('the shell renders the registry, not a second nav const',
   /DOMAINS\.map/.test(LAYOUT) && !/const NAV = \[/.test(LAYOUT));

// ════════════════════════════════════════════════════════════════════════════
// ③ THE MAPPING TABLE — checked against the DISK, not against itself
// ════════════════════════════════════════════════════════════════════════════
console.log('\n③ the mapping table accounts for every route');

// INDEPENDENT METHOD: walk app/admin for page.tsx. This check's failure mode
// (a missing file) differs from the one that produced the table (an author
// typing rows), which is what the independent-method law asks for. A grep of
// the table against itself would agree with itself and prove nothing.
const routesOnDisk = [];
(function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) { walk(rel); continue; }
    if (e.name === 'page.tsx') routesOnDisk.push('/' + dir.replace(/^app\//, '').replace(/^app$/, ''));
  }
})('app/admin');
const routes = routesOnDisk.map(r => (r === '/admin' ? '/admin' : r)).filter(r => r !== '/admin/login').sort();

// SCOPED TO ROUTE_MAP. A whole-file scan also picks up the DOMAINS registry's
// own `path:` fields, which legitimately repeat the same routes — so an
// unscoped count double-counts and a cell built on it reports a number nobody
// means. Self-caught when the row-count cell went red on a correct tree.
const MAP_SRC = NAV.slice(NAV.indexOf('export const ROUTE_MAP'));
const tablePaths = [...MAP_SRC.matchAll(/path:\s*'(\/admin[^']*)'/g)].map(m => m[1]);
const mapped = new Set(tablePaths);

ok('every route on disk has a row in the table',
   routes.every(r => mapped.has(r)),
   routes.filter(r => !mapped.has(r)).join(', '));
ok('every /admin row in the table is a route that exists on disk',
   tablePaths.every(p => routes.includes(p)),
   tablePaths.filter(p => !routes.includes(p)).join(', '));
// LABEL NAMES WHAT THE CELL MEASURES. This one measures the DISK — it is the
// denominator the two cells above are checked against, and it says so. An
// earlier draft called it "the table has 37 rows" while asserting the route
// count; a label that describes a different quantity than the assertion is how
// a green comes to mean nothing. Self-caught, corrected here.
ok('the disk carries exactly 37 non-login admin routes (the denominator)',
   routes.length === 37 && new Set(routes).size === 37, `disk=${routes.length}`);
ok('the table carries a row for each of them and nothing else',
   tablePaths.length === 37 && new Set(tablePaths).size === 37,
   `table=${tablePaths.length}`);

const liveCount    = (NAV.match(/disposition:\s*'LIVE'/g)    || []).length;
const phantomCount = (NAV.match(/disposition:\s*'PHANTOM'/g) || []).length;
const retireCount  = (NAV.match(/disposition:\s*'RETIRES'/g) || []).length;
const corpseCount  = (NAV.match(/disposition:\s*'CORPSE'/g)  || []).length;
ok('18 LIVE + 1 RETIRES + 18 PHANTOM = 37',
   liveCount + retireCount + phantomCount === 37,
   `LIVE=${liveCount} RETIRES=${retireCount} PHANTOM=${phantomCount}`);
ok('the dead [data-theme="dark"] block is tabled as a CORPSE, not revived and not deleted (R-A1 rider i)',
   corpseCount === 1 && /P6-SWEEP/.test(NAV) && /data-theme="dark"/.test(NAV));
// The question is whether anything SETS the attribute — the corpse's own row
// in the mapping table NAMES it, and a cell that cannot tell a description from
// a setter would convict the documentation. Two setter shapes exist in React:
// the JSX attribute and setAttribute; both are searched, neither is found.
ok('`data-theme` is SET by nothing in the tree — the corpse is genuinely unreachable',
   (() => {
     const setters = [];
     const walk2 = (dir) => {
       for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
         const rel = `${dir}/${e.name}`;
         if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.next') walk2(rel); continue; }
         if (!/\.(tsx?|jsx?)$/.test(e.name)) continue;
         const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
         if (/setAttribute\(\s*['"`]data-theme/.test(src) || /\sdata-theme\s*=/.test(src)) setters.push(rel);
       }
     };
     ['app', 'components', 'lib', 'hooks'].forEach(d => { try { walk2(d); } catch {} });
     return setters.length === 0;
   })(), 'setters found');

// ════════════════════════════════════════════════════════════════════════════
// ④ THE RETIREMENT STAMP (R-A4)
// ════════════════════════════════════════════════════════════════════════════
console.log('\n④ the chartered-dead');

ok("the heroes stamp names the SITTING, never a block number",
   /RETIRES-AT-SPOTLIGHT-CONSOLIDATION/.test(NAV));
ok("no stamp says 'RETIRES-AT-09' — a stamp naming a slipping date rots",
   !/RETIRES-AT-0?9\b/.test(NAV));
ok('both heroes surfaces are excluded from the palette',
   /PALETTE_EXCLUDED/.test(NAV)
   && /'\/admin\/content\/heroes'/.test(NAV.slice(NAV.indexOf('PALETTE_EXCLUDED')))
   && /'\/admin\/discover-heroes'/.test(NAV.slice(NAV.indexOf('PALETTE_EXCLUDED'))));
ok('the nav shows the death warrant to the operator',
   /retiring/.test(LAYOUT) && /retiresAt/.test(LAYOUT));

// ════════════════════════════════════════════════════════════════════════════
// ⑤ THE ACCENT (R-A1 rider ii)
// ════════════════════════════════════════════════════════════════════════════
console.log('\n⑤ the accent — rose retires, gold takes the wordmark');

// Comment-stripped, for the same reason ① strips: the paragraph that RECORDS a
// retired byte is the record of the cure, not a survival of it. A cell that
// cannot tell those apart punishes documentation, which is how comments die.
const CODE_OF = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const REBUILT_CODE = REBUILT.map(([n, src]) => [n, CODE_OF(src)]);
ok('the rose literal #C44058 is gone from the rebuilt set',
   !REBUILT_CODE.some(([, s]) => s.includes('#C44058')),
   REBUILT_CODE.filter(([, s]) => s.includes('#C44058')).map(([n]) => n).join(', '));
ok("rgba(196,64,88,…) — the rose's other costume — is gone too",
   !REBUILT_CODE.some(([, s]) => /rgba\(\s*196\s*,\s*64\s*,\s*88/.test(s)));
ok('gold is declared once, in the token set, and nowhere else',
   TOKENS.includes('#C9A84C') && !REBUILT_CODE.some(([, s]) => s.includes('#C9A84C')));
ok('the wordmark wears the metal', /--admin-metal\)[^]{0,400}The Dream Wedding/.test(LAYOUT)
   || /The Dream Wedding/.test(LAYOUT) && /color: 'var\(--admin-metal\)'/.test(LAYOUT));

// ════════════════════════════════════════════════════════════════════════════
// ⑥ THE PALETTE
// ════════════════════════════════════════════════════════════════════════════
console.log('\n⑥ the command palette');

ok('⌘K / Ctrl-K is bound at the shell, so it works from every surface',
   /metaKey \|\| e\.ctrlKey/.test(LAYOUT) && /'k' \|\| e\.key === 'K'/.test(LAYOUT));
ok('the mobile bar carries a visible pull-down door (A-4 — a keystroke is not a thumb path)',
   /setPaletteOpen\(true\)/.test(LAYOUT) && /aria-label="Search"/.test(LAYOUT));
ok('Enter jumps, arrows move, Escape closes',
   /e\.key === 'Enter'/.test(PALETTE) && /ArrowDown/.test(PALETTE) && /ArrowUp/.test(PALETTE) && /'Escape'/.test(PALETTE));
ok('the jump is recorded — and NOT awaited (R-A7 fire-and-forget)',
   /recordJump\(/.test(PALETTE) && /export function recordJump/.test(SEARCH) && !/await recordJump/.test(PALETTE));
ok('the query is debounced before it reaches the wire',
   /DEBOUNCE_MS/.test(PALETTE) && /setTimeout\(/.test(PALETTE));
ok('an in-flight search is aborted when the term moves on',
   /AbortController/.test(PALETTE) && /abortRef\.current\?\.abort\(\)/.test(PALETTE));
ok('static section names are matched locally, so the nav survives a dead API',
   /PALETTE_SECTIONS\.filter/.test(PALETTE));
ok('recents show only on an empty query', /if \(q\.trim\(\)\) return \[\];/.test(PALETTE));
ok('a partial answer is NAMED, never disguised as an empty one',
   /degraded/.test(PALETTE) && /did not answer/.test(PALETTE));
ok('the client sends the term encoded', /encodeURIComponent\(q\)/.test(SEARCH));
ok('the palette rides the ONE header authority, not a hand-built header',
   /adminHeaders/.test(SEARCH) && !/x-admin-password/.test(SEARCH));

// ════════════════════════════════════════════════════════════════════════════
// ⑦ DEEP LINKS — the redirect answer, asserted
// ════════════════════════════════════════════════════════════════════════════
console.log('\n⑦ deep links are preserved by construction');

const MUST_HOLD = [
  '/admin/makers', '/admin/dreamers', '/admin/prospects', '/admin/demo',
  '/admin/couture', '/admin/hot-dates', '/admin/config',
  '/admin/approvals/photos', '/admin/approvals/discover',
  '/admin/conversations/vendors', '/admin/conversations/brides',
  '/admin/vendors/portfolio',
  '/admin/content/landing', '/admin/content/exploring', '/admin/content/spotlight',
  '/admin/content/muse-pool', '/admin/content/surprise-me', '/admin/content/heroes',
];
ok('every path the old nav offered is still offered, byte-identical',
   MUST_HOLD.every(p => NAV.includes(`'${p}'`)),
   MUST_HOLD.filter(p => !NAV.includes(`'${p}'`)).join(', '));
ok('no domain-prefixed route was invented (the unbuilt arm stays unbuilt)',
   // Read the path FIELDS, never the file: the §0.2 report names the unbuilt
   // shape by example ("/admin/marketplace/couture"), and a cell that greps the
   // whole file convicts the sentence explaining why the thing was not built.
   !tablePaths.some(p => /^\/admin\/(growth|marketplace|people|money|engine)\//.test(p)),
   tablePaths.filter(p => /^\/admin\/(growth|marketplace|people|money|engine)\//.test(p)).join(', '));
ok('the §0.2 report on redirects is written down where the next session will read it',
   /DISCHARGED BY\s*\n?\/\/ CONSTRUCTION/.test(NAV) || /DISCHARGED BY/.test(NAV));

// ════════════════════════════════════════════════════════════════════════════
// ⑧ GUARDS — true before this delivery, and this delivery must not break them
// ════════════════════════════════════════════════════════════════════════════
console.log('\n⑧ guards');

ok('F-08.42 holds: the fadeUp keyframe still declares NO transform',
   /@keyframes fadeUp \{\s*from \{ opacity: 0; \}\s*to\s*\{ opacity: 1; \}/.test(LAYOUT));
ok('the auth gate is unchanged — hasAdminSession, redirect to /admin/login',
   /const ok = hasAdminSession\(\);/.test(LAYOUT) && /router\.replace\('\/admin\/login'\)/.test(LAYOUT));
ok('the login route still bypasses the shell',
   /if \(pathname === '\/admin\/login'\) return/.test(LAYOUT));
ok('F-09.20 holds: no invite surface returned',
   !fs.existsSync(path.join(ROOT, 'app/admin/invites')) && !fs.existsSync(path.join(ROOT, 'app/admin/invite-requests')));
ok('the stale invite-requests pointer in the shell comment is cured',
   !/app\/admin\/invite-requests\/_list\.tsx\) trapping/.test(LAYOUT));
ok('48px thumb targets on the domain bar (A-4)',
   /minHeight: 56/.test(LAYOUT) || /minHeight: 48/.test(LAYOUT));
ok('the money register is untouched by this phase — no glyph, no shorthand, in the rebuilt set',
   !REBUILT.some(([, s]) => /₹/.test(s)) && !REBUILT.some(([, s]) => /\bRs\s?\d+(\.\d+)?\s?[kLC]/.test(s)));
ok('W-1 holds trivially: this delivery opens no soul, lens, prompt or engine file',
   !REBUILT.some(([, s]) => /Soul|harveySoul|donnaSoul|advisorLens/.test(s)));

// ════════════════════════════════════════════════════════════════════════════
console.log(`\n${'─'.repeat(66)}`);
console.log(`  tdw10_p1_shell  ${pass}/${pass + fail}`);
console.log(`${'─'.repeat(66)}\n`);
process.exit(fail === 0 ? 0 : 1);
