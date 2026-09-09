// scripts/ce41_e2i_cockpit_ink_census.mjs — CE-41 E2 (i) · THE SHELL GROUP'S INK CENSUS.
//
//     node scripts/ce41_e2i_cockpit_ink_census.mjs
//
// WHAT IT PROVES. That no file in the cockpit's shell group holds a colour VALUE:
// no #RGB, no #RRGGBB, no rgb()/rgba(), no hsl()/hsla(), and no read of a retired
// --admin-* role. Every paint is a var() from lib/worklist/theme.ts, the one home
// (R-41.72/.73). It also proves the one allowed literal is equal to the token it
// stands in for, and that the deleted file is deleted.
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL.
//   · It reads the group's files FROM DISK BY NAME, not the files this rider
//     happened to change (kickoff §6: a cell only sees what it looks at). If a
//     later seat adds a literal to Bridge.tsx without touching layout.tsx, this
//     still reds.
//   · It reads COMMENT-STRIPPED source. The comment-blindness law: a cell
//     asserting a value is absent must not be fooled by prose about the value —
//     and must not red on the history these files are required to carry. Block
//     comments and line comments go before any match is counted. String contents
//     are NOT stripped, because a literal in a style string is exactly the defect.
//   · The <meta name="theme-color"> attribute is the ONE allowance (⊘-1, ruled).
//     A browser reads that attribute before any stylesheet, so it cannot be a
//     var(); the cure was to derive it. The cell asserts the site reads
//     GRAPHITE['page-bg'] AND that no hex string sits in the attribute — an
//     allowance that only checked "is it derived" would pass a second hex added
//     beside it.
//
// WHAT IT DOES NOT CLAIM. Nothing about what the pixels look like. The walk
// outranks the frame and the frame outranks this cell (R-39.15): a green here with
// an unreadable ink on the founder's phone is a finding against this cell, not a
// pass. It also says nothing about groups (ii)–(v), which still hold their literals
// by design and get their own cells as they are cut.

import { readFileSync, existsSync } from 'node:fs';
import { GRAPHITE } from '../lib/worklist/theme.ts';

// ── THE GROUP, BY NAME ───────────────────────────────────────────────────────
// These six are the shell: the layout that mounts the tokens, the one control
// home, and the four files that read --admin-* roles. The deleted file is asserted
// separately because "absent" is not something you can grep inside.
const GROUP = [
  'app/admin/layout.tsx',
  'app/admin/_components/AdminUI.tsx',
  'app/admin/_components/Bridge.tsx',
  'app/admin/_components/MintSheet.tsx',
  'app/admin/_components/CommandPalette.tsx',
  'app/admin/approvals/discover/page.tsx',
];
const DELETED = 'app/admin/_components/tokens.css';

const RE_LITERAL = /#[0-9A-Fa-f]{3}\b(?![0-9A-Fa-f])|#[0-9A-Fa-f]{6}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
const RE_ADMIN_VAR = /--admin-[a-z-]*/g;

function codeOf(src) {
  // Block comments first, then whole-line // comments. Trailing // comments are
  // left alone on purpose: stripping them needs a string-aware parser, and the
  // failure mode of not stripping them is a FALSE RED — the safe direction.
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

let pass = 0, fail = 0;
const red = (name, detail) => { fail++; console.log(`  ✗ ${name}\n      ${detail}`); };
const green = (name) => { pass++; console.log(`  ✓ ${name}`); };

console.log('\nCE-41 E2 (i) — the shell group holds no colour value\n');

for (const f of GROUP) {
  if (!existsSync(f)) { red(`${f} — present`, 'file missing; the group moved without the cell moving'); continue; }
  const code = codeOf(readFileSync(f, 'utf8'));

  const lits = code.match(RE_LITERAL) || [];
  if (lits.length) red(`${f} — no colour literal`, `${lits.length} found: ${[...new Set(lits)].slice(0, 6).join(', ')}`);
  else green(`${f} — no colour literal`);

  const admins = code.match(RE_ADMIN_VAR) || [];
  if (admins.length) red(`${f} — no --admin-* read`, `${admins.length} found: ${[...new Set(admins)].slice(0, 6).join(', ')}`);
  else green(`${f} — no --admin-* read`);
}

// ── THE DELETED FILE ─────────────────────────────────────────────────────────
if (existsSync(DELETED)) red(`${DELETED} — deleted`, 'still on disk; R-41.73 deletes it, and an alias file is F-40.143\'s class');
else green(`${DELETED} — deleted`);

// ── THE ONE ALLOWANCE ────────────────────────────────────────────────────────
const layout = readFileSync('app/admin/layout.tsx', 'utf8');
const metaLine = (codeOf(layout).match(/<meta\s+name="theme-color"[^>]*>/) || [])[0] || '';
if (!metaLine) {
  red('theme-color — present', 'no <meta name="theme-color"> in the layout');
} else if (/#[0-9A-Fa-f]{3,6}/.test(metaLine)) {
  red('theme-color — derived, not written', `a hex sits in the attribute: ${metaLine.trim()}`);
} else if (!/GRAPHITE\['page-bg'\]/.test(metaLine)) {
  red('theme-color — derived from GRAPHITE[\'page-bg\']', `reads: ${metaLine.trim()}`);
} else {
  green('theme-color — derived from GRAPHITE[\'page-bg\'], no hex in the attribute');
}

// The token it stands in for must exist and be a colour; a derived attribute
// pointing at an undefined key would render `undefined` and go unnoticed.
if (typeof GRAPHITE['page-bg'] === 'string' && /^#[0-9A-Fa-f]{6}$/.test(GRAPHITE['page-bg'])) {
  green(`GRAPHITE['page-bg'] is a colour (${GRAPHITE['page-bg']})`);
} else {
  red("GRAPHITE['page-bg'] is a colour", `got: ${String(GRAPHITE['page-bg'])}`);
}

// ── THE MOUNT ────────────────────────────────────────────────────────────────
// A group with no literals and no tokens mounted is a black page, not a pass.
const lcode = codeOf(layout);
if (/scopeCss\('html\.adm'\)/.test(lcode) && /typeCss\('html\.adm'\)/.test(lcode)) green('layout mounts scopeCss + typeCss on html.adm');
else red('layout mounts scopeCss + typeCss on html.adm', 'the tokens are not emitted; every var() would fall back to nothing');

if (/classList\.add\('adm'\)/.test(lcode) && /setAttribute\('data-wl-mode', 'dark'\)/.test(lcode)) green('layout wears .adm and pins the dark arm (R-41.74)');
else red('layout wears .adm and pins the dark arm', 'scopeCss emits html.adm[data-wl-mode="dark"]; both halves are required');

if (/classList\.remove\('adm'\)/.test(lcode)) green('the scope is removed on unmount');
else red('the scope is removed on unmount', 'a class left on <html> follows the founder out of the cockpit');

console.log(`\n${'─'.repeat(60)}\nce41_e2i_cockpit_ink_census: ${pass} passed, ${fail} failed  (total ${pass + fail})\n`);
process.exit(fail ? 1 : 0);
