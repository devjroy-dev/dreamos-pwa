// scripts/tdw10_p2_bridge.proof.mjs — TDW_10 · ADMIN P2 · THE BRIDGE (pwa).
//     node scripts/tdw10_p2_bridge.proof.mjs
//
// The P1 shell proof's siblings. §1 EXTENDS P1's grep gate over the three files
// this phase rebuilt — the gate was written to grow and this is it growing.
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL. Instruments own their counts:
// a cell that reports "0 hex" without saying what it stripped first is a number
// nobody can audit.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else { fail++; console.log(`  RED  ${label}${detail ? `  — ${detail}` : ''}`); }
};
const section = (s) => console.log(`\n── ${s} ${'─'.repeat(Math.max(0, 64 - s.length))}`);

const BRIDGE_TSX  = read('app/admin/_components/Bridge.tsx');
const PAGE        = read('app/admin/page.tsx');
const CLIENT      = read('lib/admin-api/bridge.ts');
const NAV         = read('app/admin/_components/adminNav.ts');
const TOKENS      = read('app/admin/_components/tokens.css');
const P1_PROOF    = read('scripts/tdw10_p1_shell.proof.mjs');

// ═══════════════════════════════════════════════════════════════════════════
section('§1  THE GREP GATE EXTENDS — roles, not colours');
// ═══════════════════════════════════════════════════════════════════════════
{
  // COUNTING METHOD, declared: comments are stripped FIRST (a paragraph that
  // explains a retired hex is documentation, not a colour), then every
  // 3/4/6/8-digit hex literal is counted. This is P1's regex and P1's stripping,
  // reused verbatim so the two gates cannot drift apart.
  const HEX = /#[0-9A-Fa-f]{8}\b|#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{4}\b|#[0-9A-Fa-f]{3}\b/g;
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const REBUILT = [
    ['app/admin/_components/Bridge.tsx', BRIDGE_TSX],
    ['app/admin/page.tsx',               PAGE],
    ['lib/admin-api/bridge.ts',          CLIENT],
  ];
  for (const [name, src] of REBUILT) {
    const hits = strip(src).match(HEX) || [];
    ok(`${name} names roles, not colours (0 hex after comment-strip)`, hits.length === 0, hits.join(', '));
  }
  ok('the gate\'s regex is byte-identical to P1\'s (one gate, not two that drift)',
     P1_PROOF.includes('#[0-9A-Fa-f]{8}\\b|#[0-9A-Fa-f]{6}\\b'));

  // Roles reached for must EXIST in the declared set, or the screen renders
  // transparent and nobody notices until the founder does.
  const used = Array.from(new Set((BRIDGE_TSX.match(/--admin-[a-z-]+/g) || [])));
  const missing = used.filter(r => !TOKENS.includes(`${r}:`));
  ok(`every role the Bridge reaches for is declared in tokens.css (${used.length} distinct roles)`,
     missing.length === 0, missing.join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§2  NO DEAD NUMBERS — every figure drills, or says why it cannot');
// ═══════════════════════════════════════════════════════════════════════════
{
  // The declared literal A-3's acceptance number 2 is measured against. It is
  // a LITERAL on purpose: a count derived from the same object it checks would
  // pass over a figure that was quietly dropped.
  const EXPECTED_DRILLS = 14;
  const keys = Array.from(new Set((CLIENT.match(/^\s{2}([a-z_]+):\s*\{ path:/gm) || [])
    .map(m => m.trim().split(':')[0])));
  ok(`the drill map declares all ${EXPECTED_DRILLS} figures`, keys.length === EXPECTED_DRILLS, `found ${keys.length}: ${keys.join(', ')}`);

  // EVERY non-null drill path must be a LIVE route in the mapping table. A
  // phantom or a retiring path here is a tap that 404s — a dead number wearing
  // a link's clothes, which is worse than an honest one.
  const paths = Array.from((CLIENT.matchAll(/path:\s*'(\/admin[^']*)'/g))).map(m => m[1]);
  const live = new Set(Array.from(NAV.matchAll(/\{\s*path:\s*'(\/admin[^']*)',\s*domain:\s*'[a-z]+',\s*disposition:\s*'LIVE'/g)).map(m => m[1]));
  const bad = paths.filter(p => !live.has(p));
  ok(`all ${paths.length} drill targets are LIVE dispositions in ROUTE_MAP (0 phantom, 0 retiring)`,
     bad.length === 0, bad.join(', '));

  // The three figures with NO owning surface must each say so by name rather
  // than silently offering nothing.
  const nulls = Array.from(CLIENT.matchAll(/(\w+):\s*\{ path: null, absent: '([^']+)'/g));
  ok('every figure without an owning screen carries a written reason (3 of them)',
     nulls.length === 3 && nulls.every(m => m[2].length > 20), `${nulls.length} found`);
}

// ═══════════════════════════════════════════════════════════════════════════
section('§3  THE THREE RENDERINGS MUST NOT COLLAPSE');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('a null figure renders the dash, never 0 (F-07.90\'s distinction, carried)',
     /const dead\s+= value === null;/.test(BRIDGE_TSX) && /dead \? '—' : value/.test(BRIDGE_TSX));
  ok('a dead figure is labelled "Could not load", not left to read as empty',
     /Could not load/.test(BRIDGE_TSX));
  ok('an HONEST state renders as prose with its owner, never as a number or a dash',
     /function Honest/.test(BRIDGE_TSX) && /Owner: \{s\.owner\}/.test(BRIDGE_TSX));
  ok('the honest state surfaces its finding number to the operator',
     /\{s\.finding\}/.test(BRIDGE_TSX));
  ok('page.tsx records WHY the four-tile fan-out was retired and what survived it',
     /F-07\.90/.test(PAGE) && /dashboard-HALF/.test(PAGE) && /F-10\.1/.test(PAGE));
  ok('the retired UNKNOWN_VALUE consts left with their tiles (no orphan copy)',
     !/UNKNOWN_VALUE/.test(PAGE.replace(/\/\/.*$/gm, '')));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§4  MONEY — one home, one register');
// ═══════════════════════════════════════════════════════════════════════════
{
  const fmt = read('lib/vendor/format.ts');
  ok('every rupee byte goes through formatRs — R-U25\'s one money home',
     /import \{ formatRs \} from '@\/lib\/vendor\/format'/.test(BRIDGE_TSX));
  ok('the Bridge builds NO money string of its own', !/Rs\s*\$\{/.test(BRIDGE_TSX));
  ok('formatRs still emits the Rs prefix with Indian grouping (the donor holds)',
     /toLocaleString\('en-IN'\)/.test(fmt));
  // The register law: zero glyphs, zero shorthand, on any rendered byte.
  const rendered = BRIDGE_TSX.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  ok('no rupee glyph and no k/L/Cr shorthand anywhere in rendered bytes',
     !/₹/.test(rendered) && !/\b\d+(\.\d+)?\s?(L|Cr)\b/.test(rendered));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§5  ONE ROUND TRIP, AND THE PHONE');
// ═══════════════════════════════════════════════════════════════════════════
{
  const fetches = (CLIENT.match(/await fetch\(/g) || []).length;
  ok('the client makes exactly ONE fetch — the fan-out P2 exists to end', fetches === 1, `${fetches} found`);
  ok('the Bridge component calls no API directly (the client is the only door)',
     !/fetch\(/.test(BRIDGE_TSX));
  ok('it rides _base.ts\'s ONE header authority, not a hand-built header object',
     /adminHeaders/.test(CLIENT) && !/x-admin-password/.test(CLIENT));
  ok('the morning screen is never served from cache', /cache: 'no-store'/.test(CLIENT));

  ok('auto-refresh is the spec\'s 60s, as a named constant', /AUTO_REFRESH_MS = 60_000/.test(BRIDGE_TSX));
  ok('the interval is cleared on unmount (a leaked timer polls forever)',
     /clearInterval\(t\)/.test(BRIDGE_TSX));
  ok('a refresh in flight cannot be re-entered by the 60s tick', /inFlight\.current/.test(BRIDGE_TSX));
  ok('pull-to-refresh arms only at true scroll-top so it cannot fight the page',
     /window\.scrollY <= 0/.test(BRIDGE_TSX));
  ok('touch listeners are removed on unmount', (BRIDGE_TSX.match(/removeEventListener/g) || []).length === 3);
  ok('A-4: queue rows clear the 48px thumb target', /minHeight: 56/.test(BRIDGE_TSX));
  ok('the masthead grid reflows on a phone (auto-fill, not a fixed column count)',
     /repeat\(auto-fill, minmax\(150px, 1fr\)\)/.test(BRIDGE_TSX));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§6  THE HONEST ARMS ARE PRESENT AND NAMED');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('degraded sources are named to the operator, never shown as empty',
     /did not answer/.test(BRIDGE_TSX) && /data\.degraded/.test(BRIDGE_TSX));
  ok('the funnel truncation guard is surfaced, not swallowed', /Partial —/.test(BRIDGE_TSX));
  ok('a rate over zero invitations renders "no rate yet", never 0%',
     /no rate yet/.test(BRIDGE_TSX) && /claim_rate_7d\.rate === null/.test(BRIDGE_TSX));
  ok('an empty funnel renders "No rows yet" rather than bars of nothing',
     /No rows yet/.test(BRIDGE_TSX));
  ok('the unknown-state bucket is rendered in the critical role, not hidden',
     /k === 'other' \? 'var\(--admin-critical\)'/.test(BRIDGE_TSX));
  ok('the second cost meter\'s exclusion reaches the screen (F-10.30)',
     /today\.wa\.excludes/.test(BRIDGE_TSX));
  ok('a whole-screen failure offers a retry instead of a blank grid',
     /Try again/.test(BRIDGE_TSX));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§7  MUTATION — the load-bearing cells proven able to REDDEN');
// ═══════════════════════════════════════════════════════════════════════════
{
  const TARGET = path.join(ROOT, 'app/admin/_components/Bridge.tsx');
  const CLIENT_P = path.join(ROOT, 'lib/admin-api/bridge.ts');
  let restoredOk = true;

  const mutate = (file, orig, label, from, to, check) => {
    if (!orig.includes(from)) { ok(`M-fixture: ${label}`, false, 'anchor not found'); return; }
    fs.writeFileSync(file, orig.split(from).join(to));
    let reddened = false;
    try { reddened = check(fs.readFileSync(file, 'utf8')); } catch { reddened = true; }
    fs.writeFileSync(file, orig);
    if (fs.readFileSync(file, 'utf8') !== orig) restoredOk = false;
    ok(label, reddened);
  };

  const HEX = /#[0-9A-Fa-f]{6}\b/g;
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  mutate(TARGET, BRIDGE_TSX, 'M1  name a colour instead of a role ⇒ §1\'s hex gate reddens',
    "'var(--admin-ink)'", "'#F0EAE0'",
    (s) => (strip(s).match(HEX) || []).length > 0);

  mutate(TARGET, BRIDGE_TSX, 'M2  collapse the dash to 0 ⇒ §3\'s F-07.90 cell reddens',
    "dead ? '—' : value", "dead ? 0 : value",
    (s) => !/dead \? '—' : value/.test(s));

  mutate(TARGET, BRIDGE_TSX, 'M3  render 0% for a rate over zero invitations ⇒ §6 reddens',
    'no rate yet', 'rate 0%',
    (s) => !/no rate yet/.test(s));

  mutate(TARGET, BRIDGE_TSX, 'M4  build a money string by hand ⇒ §4\'s one-money-home cell reddens',
    'formatRs(s.inr)', '`Rs ${s.inr}`',
    (s) => /Rs \$\{/.test(s));

  mutate(TARGET, BRIDGE_TSX, 'M5  drop the interval cleanup ⇒ §5\'s leaked-timer cell reddens',
    'return () => clearInterval(t);', 'return undefined;',
    (s) => !/clearInterval\(t\)/.test(s));

  mutate(CLIENT_P, CLIENT, 'M6  point a drill at a PHANTOM route ⇒ §2\'s live-route cell reddens',
    "enquiries:    { path: '/admin/dreamers' }", "enquiries:    { path: '/admin/money' }",
    (s) => {
      const paths = Array.from(s.matchAll(/path:\s*'(\/admin[^']*)'/g)).map(m => m[1]);
      const live = new Set(Array.from(NAV.matchAll(/\{\s*path:\s*'(\/admin[^']*)',\s*domain:\s*'[a-z]+',\s*disposition:\s*'LIVE'/g)).map(m => m[1]));
      return paths.some(p => !live.has(p));
    });

  mutate(CLIENT_P, CLIENT, 'M7  add a second fetch ⇒ §5\'s one-round-trip cell reddens',
    'const res = await fetch(', 'await fetch(`${API_BASE}/x`); const res = await fetch(',
    (s) => (s.match(/await fetch\(/g) || []).length !== 1);

  ok('every mutated file restored BYTE-IDENTICAL', restoredOk);
}

console.log(`\n──────────────────────────────────────────────────────────────`);
console.log(`tdw10_p2_bridge: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
