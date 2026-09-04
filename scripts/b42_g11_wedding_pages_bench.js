#!/usr/bin/env node
'use strict';
// scripts/b42_g11_wedding_pages_bench.js
// BLOCK 19 · G1.1 — THE PWA HALF'S BENCH.
//
// ⚠ NUMBERED b42, NOT b41. The charter said b41; `scripts/b41_theme_bleed_fixture.js`
// already holds that number, derived by `ls` rather than taken on the charter's word.
//
// Every cell asserts a SURFACE or a BEHAVIOUR. None asserts a line number and none
// asserts where a constant lives.
//
// THE MUTATION PASS (--mutate) edits PRODUCTION CODE, re-runs the cells in a child
// process, and requires RED. A mutation that leaves the bench green is a cell that
// was never testing what its name claims.

const fs   = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P    = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const has  = (rel) => fs.existsSync(P(rel));
/** Comments stripped before any prohibition is tested — a cell that cannot tell a
 *  rule from its violation is worse than no cell (b53's e-4, same class). */
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const ROOMS   = 'lib/worklist/rooms.ts';
const GRIDF   = 'components/worklist/RoomsGrid.tsx';
const HUB     = 'app/vendor/(shell)/support/page.tsx';
const SOLCOPY = 'lib/solutions/copy.ts';
const ROUTES  = 'lib/solutions/routes.ts';
const PIECES  = 'components/solutions/SolutionsPieces.tsx';
const ROOM    = 'app/vendor/(shell)/wedding-pages/page.tsx';
const WPCOPY  = 'lib/worklist/weddingPages.ts';
const LEAF    = 'app/v/[code]/w/[slug]/page.tsx';
const CLAIM   = 'app/credits/[token]/page.tsx';
const PUBCOPY = 'lib/public/copy.ts';
const MOCK    = 'docs/mocks/wedding-pages-mock.html';

for (const rel of [ROOMS, GRIDF, HUB, SOLCOPY, ROUTES, PIECES, ROOM, WPCOPY, LEAF, CLAIM, PUBCOPY, MOCK]) {
  if (!has(rel)) { console.log('REFUSED \u2014 ' + rel + ' is absent'); process.exit(3); }
}

let pass = 0, fail = 0;
const ok = (n, c, d) => {
  if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (d ? '  \u2192 ' + d : '')); }
};
const sec = (t) => console.log('\n' + t);

// ── C1 · THE REGISTRY CARRIES THE RULING, NOT A COUNT ───────────────────────
sec('C1 \u00b7 the registry (R-40.20/.22)');
{
  const src = strip(read(ROOMS));
  const num = (n) => { const m = src.match(new RegExp(n + '\\s*=\\s*(\\d+)')); return m ? Number(m[1]) : null; };
  ok('19 / 9 / 10', num('ROOM_COUNT_EXPECTED') === 19 && num('TOP_BAND_EXPECTED') === 9 && num('BOTTOM_BAND_EXPECTED') === 10,
    [num('ROOM_COUNT_EXPECTED'), num('TOP_BAND_EXPECTED'), num('BOTTOM_BAND_EXPECTED')].join('/'));
  const ids = (src.match(/\{\s*id:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  ok('nineteen rooms', ids.length === 19, String(ids.length));
  ok('Business Solutions is index 0 of the work band (R-40.20)', ids[0] === 'support', ids[0]);
  const fb = src.match(/FROZEN_ORDER[^=]*=\s*\[([\s\S]*?)\]/);
  const frozen = fb ? (fb[1].match(/'([a-z]+)'/g) || []).map((s) => s.slice(1, -1)) : [];
  ok('FROZEN_ORDER equals the registry order', frozen.join(',') === ids.join(','));
  ok('the bands count to the declared constants',
    (src.match(/band: 'work'/g) || []).length === 9 && (src.match(/band: 'business'/g) || []).length === 10);
  // The wide set is read from its DECLARATION and compared to the actual flags.
  // "Two tiles are wide" would pass on the wrong two.
  const wm = src.match(/WIDE_TILES_EXPECTED[^=]*=\s*\[([\s\S]*?)\]/);
  const declared = wm ? (wm[1].match(/'([a-z]+)'/g) || []).map((s) => s.slice(1, -1)) : [];
  const actual = (src.match(/\{\s*id:\s*'([a-z]+)'[^}]*wide:\s*true/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  ok('WIDE_TILES_EXPECTED is [support, storefront]', declared.join(',') === 'support,storefront', declared.join(','));
  ok('the flags match the declaration', actual.join(',') === declared.join(','), actual.join(','));
}

// ── C2 · THE GRID EARNS ITS CLEARANCE FROM `GRID`, NOT FROM A TILE COUNT ────
sec('C2 \u00b7 the FAB clearance (R-G11.11 / F-40.27)');
{
  const src = read(GRIDF);
  const m = src.match(/\.wl-bands\{[^}]*\}/);
  ok('.wl-bands declares a rule', Boolean(m), 'not found');
  if (m) {
    ok('its bottom padding is computed from the FAB seat AND a tile height',
      /padding-bottom:calc\(var\(--wl-fab-bottom\)\s*\+\s*var\(--wl-tile\)\)/.test(m[0]), m[0]);
    // The whole point is that neither number is retyped: GRID is the one home
    // (F-39.4 cured three homes for the FAB's seat once already).
    ok('neither 136 nor 64 is retyped into the rule', !/\b136\b|\b64\b/.test(m[0]), m[0]);
    ok('longhand padding only (F-16.39\'s standing cure)', !/[^-]padding:/.test(m[0]), m[0]);
  }
  ok('the wide class spans the whole row', /\.wl-tilewide\{grid-column:1\/-1\}/.test(src));
  ok('the tile renders wide from the REGISTRY, never from an index',
    /room\.wide \? 'wl-tile wl-tilewide' : 'wl-tile'/.test(src));
}

// ── C3 · THE NINE REPLACE THE SIX, AND THE SIX ARE GONE ─────────────────────
sec('C3 \u00b7 the hub (R-40.23)');
{
  const copy = read(SOLCOPY);
  // R-40.26 lands in ROOM_ROWS; the chip lands in CHIPS. Both are read here so
  // the two ruled departures have one register between them.
  ok('the Open chip is declared (Arm C, founder-vetoed 2026-09-05)', /open:\s*'Open'/.test(copy));
  const rm = copy.match(/ROOM_ROWS = \[([\s\S]*?)\] as const;/);
  const labels = rm ? [...rm[1].matchAll(/label: '([^']+)'/g)].map((x) => x[1]) : [];
  ok('nine rows', labels.length === 9, String(labels.length));
  ok('the nine are R-40.1\'s, in order',
    // AMENDED, LABELLED — R-40.26 (founder, 2026-09-05): R3 alone becomes
    // `Your website & SEO`; the other eight stand. Both homes move in one edit,
    // exactly as C2 does for the registry's three numbers — a list retyped here
    // and a list in the copy home are two places to spell one ruling.
    labels.join('|') === "Wedding pages|Google reviews|Your website & SEO|Contracts & deposits|Payment reminders|Posts & ads|Referrals & partners|Open dates & rates|Your own number",
    labels.join('|'));
  ok('ROWS is gone', !/export const ROWS\b/.test(copy));
  ok('ROW_EYEBROWS is gone', !/export const ROW_EYEBROWS\b/.test(copy));
  ok('the nine carry no eyebrow field', !rm || !/eyebrow/i.test(rm[1]));
  const routes = strip(read(ROUTES));
  ok('SURFACE_SLUGS is gone', !/SURFACE_SLUGS/.test(routes));
  ok('surfaceHref is gone', !/surfaceHref/.test(routes));
  for (const s of ['google', 'website', 'seo', 'marketing', 'proof', 'benchmarks']) {
    ok('the ' + s + ' route is deleted, not disabled', !has('app/vendor/(shell)/support/' + s + '/page.tsx'));
  }
  ok('lib/solutions/client.ts retired with its readers', !has('lib/solutions/client.ts'));
  ok('lib/solutions/types.ts is UNTOUCHED (F-38.49\'s home)', has('lib/solutions/types.ts'));
  const hub = strip(read(HUB));
  ok('the hub no longer fetches', !/fetchIndex/.test(hub));
  ok('the eyebrow is KEPT', /COPY\.indexEyebrow/.test(hub));
  ok('the WhatsApp door is KEPT, class byte-for-byte', /wl-supportaction/.test(hub) && /supportWaNumber\(\)/.test(hub));
  ok('the footer line is KEPT', /COPY\.footerLine/.test(hub));
}

// ── C4 · A ROW WITH NO DESTINATION IS A ROW, NOT A DISABLED LINK ────────────
// s-G11.2's ruling: a refusal drawn as a control that looks tappable is worse
// than no control. Eight of the nine are not built.
sec('C4 \u00b7 the eight are not links');
{
  const pieces = read(PIECES);
  ok('SurfaceRow is retired', !/export function SurfaceRow/.test(pieces));
  ok('RoomRow renders a div when there is no href',
    /href\s*\?\s*<Link[\s\S]*?:\s*<div className="sol-row">/.test(pieces), 'no href/div branch');
  // COMMENTS STRIPPED FIRST. The first cut read this file raw and hit RoomRow's
  // own comment EXPLAINING why aria-disabled is refused — the prohibition
  // reported as the breach. Third sighting of that class in this arc.
  ok('no aria-disabled anywhere in the row', !/aria-disabled/.test(strip(pieces)));
  // ── AMENDED, LABELLED — ARM C (founder, 2026-09-05) ──────────────────────
  // This cell read: the chip is drawn ONLY for a row with no destination. That
  // was the mock's shape and the founder's walk REVERSED it — bare, the one
  // working row read as a heading beside eight `Coming` rows. Every row now
  // carries a chip and the two differ by WORD AND INK.
  //
  // The assertion is not weakened, it is re-aimed: it now pins that the chip
  // TRACKS the destination, so a row that goes nowhere can never wear `Open`.
  // That is the property worth guarding; "exactly one chip exists" never was.
  ok('every row carries a chip, and its word tracks the destination',
    /<StateChip state=\{href \? 'open' : 'coming'\} \/>/.test(pieces));
  ok('a row with no destination can never wear Open',
    !/state="open"/.test(pieces) && !/state=\{'open'\}/.test(pieces));
  // ── F-40.42 · THE DIVIDER SURVIVES A MIXED-TAG ROW LIST ──────────────────
  // The eight rows are div elements and the live row is an anchor, so a rule
  // keyed on last-of-type silently drops the border under the ONE row that has
  // a destination. The founder walked it; no cell could see it because the CSS
  // was present and valid. This asserts the question the rule means to ask.
  ok('the last-row rule is keyed on position, not on tag name',
    /\.sol-row:last-child\{border-bottom:none\}/.test(read(PIECES)));
  ok('no last-of-type rule survives on the row', !/\.sol-row:last-of-type/.test(read(PIECES)));

  // ── THE REQUIRED MARK IS THE ESTATE'S OWN, ON THE DOOR'S OWN FIELDS ───────
  const room = read(ROOM);
  ok('the required mark uses the shell token, never a hex literal (F-38.22)',
    /\.wp-req\{color:var\(--role-metal\)\}/.test(room));
  ok('exactly the three door-required fields are marked',
    (room.match(/<Req \/>/g) || []).length === 3,
    String((room.match(/<Req \/>/g) || []).length));

  const hub = strip(read(HUB));
  ok('only wedding_pages receives an href',
    /r\.key === 'wedding_pages' \? WEDDING_PAGES_HREF : undefined/.test(hub));
}

// ── C5 · THE ADDRESS HOME (R-G11.12) ────────────────────────────────────────
sec('C5 \u00b7 the room\'s address has one home');
{
  const routes = read(ROUTES);
  ok('WEDDING_PAGES_HREF is declared', /export const WEDDING_PAGES_HREF = '\/vendor\/wedding-pages'/.test(routes));
  // A bare literal anywhere else is the two-homes disease and C31's stray.
  const strays = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(ts|tsx)$/.test(e.name)) continue;
      const rel = path.relative(ROOT, p);
      if (rel === ROUTES) continue;
      if (/['"`]\/vendor\/wedding-pages/.test(strip(fs.readFileSync(p, 'utf8')))) strays.push(rel);
    }
  };
  for (const d of ['app', 'lib', 'components']) walk(P(d));
  ok('no second spelling of the address anywhere', strays.length === 0, strays.join(', '));
}

// ── C6 · THE ROLE MIRROR CANNOT DRIFT ───────────────────────────────────────
// "A mirror a bench pins is one home with two readers." The AUTHORITY is
// dream-os's 0131 CHECK; this lane cannot import a Node module, so the ten are
// transcribed and pinned here key-for-key AND label-for-label.
sec('C6 \u00b7 ROLE_OPTIONS against the dream-os home');
{
  const sibling = path.resolve(ROOT, '..', 'dream-os');
  const mig = path.join(sibling, 'db/migrations/0131_wedding_pages.sql');
  const lib = path.join(sibling, 'src/lib/vendor/weddings.js');
  if (!fs.existsSync(mig) || !fs.existsSync(lib)) {
    // A missing sibling is a CLONE LAYOUT fact, not a defect in this tree.
    console.log('  REFUSED \u2014 dream-os sibling absent; the mirror cannot be checked here');
    console.log('             (clone the sibling and re-run before reading this as a delta)');
  } else {
    const migTxt = fs.readFileSync(mig, 'utf8');
    const m = migTxt.match(/wedding_credits_role_check CHECK \(role = ANY \(ARRAY\[([\s\S]*?)\]\)\)/);
    const fromSql = m ? [...m[1].matchAll(/'([a-z_]+)'::text/g)].map((x) => x[1]) : [];
    const libTxt = fs.readFileSync(lib, 'utf8');
    const fromLib = [...libTxt.matchAll(/\{ key: '([a-z_]+)',\s*label: '([^']+)'\s*\}/g)].map((x) => [x[1], x[2]]);
    const mine = [...read(WPCOPY).matchAll(/\{ key: '([a-z_]+)',\s*label: '([^']+)'\s*\}/g)]
      .map((x) => [x[1], x[2].replace(/\\u00e9/g, '\u00e9')]);
    ok('the migration declares ten roles', fromSql.length === 10, String(fromSql.length));
    ok('the pwa mirror has ten', mine.length === 10, String(mine.length));
    ok('keys match the migration CHECK, in order',
      mine.map((x) => x[0]).join(',') === fromSql.join(','), mine.map((x) => x[0]).join(','));
    ok('keys AND labels match the dream-os home',
      JSON.stringify(mine) === JSON.stringify(fromLib),
      JSON.stringify(mine) + ' vs ' + JSON.stringify(fromLib));
  }
}

// ── C7 · EVERY ROOM BYTE IS IN THE RATIFIED MOCK ────────────────────────────
// A string not in that file is a BOUNCE. The mock is the authority; this file's
// own word is not.
sec('C7 \u00b7 the copy is pinned against the mock');
{
  const mock = read(MOCK);
  const wp = read(WPCOPY);
  const strings = [...wp.matchAll(/^\s{2}[a-zA-Z]+:\s+'([^']+)',/gm)].map((x) => x[1]);
  const decode = (s) => s.replace(/\\u2019/g, '\u2019').replace(/\\u00e9/g, '\u00e9');
  const mockPlain = mock.replace(/&amp;/g, '&').replace(/&middot;/g, '\u00b7')
                        .replace(/&rsquo;/g, '\u2019').replace(/&eacute;/g, '\u00e9')
                        .replace(/&times;/g, '\u00d7');
  // ── THE TWO RULED DEPARTURES, NAMED — NOT A LOOSENED PIN ──────────────────
  // The mock is the authority for every byte EXCEPT two the founder ruled past
  // it on his walk of 2026-09-05. They are listed BY VALUE so the exception is
  // exactly two strings wide and cannot quietly become a general amnesty:
  //   · `Open`              — Arm C. `W5-hub` drew the live row BARE; on glass,
  //                           beside eight `Coming` rows, the one working row
  //                           read as a heading. R-39.15: the walk outranks the
  //                           frame. (It lives in CHIPS, not in this file, and
  //                           is listed here so the register is in one place.)
  //   · `Your website & SEO` — R-40.26, amending R-40.1 for R3 alone.
  // NO RE-SHOOT IS OWED on either (his ruling). Anything else absent from the
  // mock is still a BOUNCE, and this cell still reds on it.
  const RULED_PAST_THE_MOCK = ['Open', 'Your website & SEO'];
  const missing = strings.map(decode)
    .filter((s) => !RULED_PAST_THE_MOCK.includes(s))
    .filter((s) => !mockPlain.includes(s));
  ok('every room string appears verbatim in the ratified mock, bar the two ruled past it',
    missing.length === 0, missing.join(' | '));
  // The exception is PINNED BOTH WAYS: if a ruled departure is ever reverted to
  // the mock's own byte, this reds — so the list cannot rot into a stale carve-out
  // that excuses strings nobody ruled.
  // ⚠ AS A WHOLE TEXT NODE, NOT AS A SUBSTRING. The first cut asked
  // `mockPlain.includes('Open')` and reddened — because `Open` sits inside the
  // mock's own row label `Open dates & rates`. A containment test cannot tell a
  // string from a fragment of a different string, and the question this cell
  // actually asks is "does the mock RENDER this byte" — which is a text node.
  const stale = RULED_PAST_THE_MOCK.filter((s) => mockPlain.includes('>' + s + '<'));
  ok('the ruled departures really do depart (the carve-out is not stale)',
    stale.length === 0, stale.join(' | '));
  ok('the waiting line carries a TYPOGRAPHIC apostrophe (R-40.19)',
    /waitingOnCouple:\s+'Waiting on the couple\\u2019s permission\.'/.test(wp));
  ok('zero straight apostrophes in a product string',
    !strings.some((s) => /\w'\w/.test(s)), strings.filter((s) => /\w'\w/.test(s)).join(' | '));
}

// ── C8 · THE HOIST IS A HOIST, NOT A COPY (R-G11.15) ────────────────────────
sec('C8 \u00b7 the public copy has one home');
{
  const pub = read(PUBCOPY);
  ok('PUBLIC_MISS is declared', /PUBLIC_MISS = 'This page is no longer available\.'/.test(pub));
  ok('PUBLIC_COLOPHON is declared', /PUBLIC_COLOPHON = 'Created and managed by The Dream Wedding/.test(pub));
  for (const leaf of ['app/v/[code]/page.tsx', LEAF]) {
    const s = strip(read(leaf));
    ok(leaf + ' imports the home', /@\/lib\/public\/copy/.test(s));
    ok(leaf + ' holds no second copy of the miss sentence',
      !/'This page is no longer available\.'/.test(s));
  }
  // The bytes must equal what the tree carried BEFORE the hoist. Derived from
  // git, not from this bench's memory of them.
  try {
    const old = execSync('git show ae30180:"app/v/[code]/page.tsx"', { cwd: ROOT, encoding: 'utf8' });
    const oldMiss = (old.match(/unknown:\s*'([^']+)'/) || [])[1];
    const newMiss = (pub.match(/PUBLIC_MISS = '([^']+)'/) || [])[1];
    ok('the hoisted miss byte is unchanged since ae30180', oldMiss === newMiss, oldMiss + ' vs ' + newMiss);
  } catch {
    console.log('  REFUSED \u2014 git history unavailable; the ae30180 byte comparison did not run');
  }
}

// ── C9 · THE PUBLIC LEAF ────────────────────────────────────────────────────
sec('C9 \u00b7 the wedding page');
{
  const s = strip(read(LEAF));
  ok('the miss is RENDERED, never delegated to notFound()', !/notFound\(\)/.test(s));
  ok('a miss carries noindex (the consent gate is not defeated via the link preview)',
    /robots:\s*\{\s*index:\s*false/.test(s));
  ok('a miss ships no descriptive OG tags',
    !/openGraph[\s\S]{0,200}PUBLIC_MISS/.test(s));
  ok('light only \u2014 color-scheme reaches the CASCADE, not only the meta (F-19.42)',
    /:root\{color-scheme:light\}/.test(read(LEAF)));
  ok('one gold on the page', (read(LEAF).match(/#C9A84C/g) || []).length === 1,
    String((read(LEAF).match(/#C9A84C/g) || []).length));
  ok('no client directive \u2014 a stranger gets no hydration bundle', !/^"use client"/m.test(read(LEAF)));
  ok('the roll is rendered in the order received, never re-sorted here',
    !/roll[\s\S]{0,80}\.sort\(/.test(s));
}

// ── C10 · THE CLAIM PAGE'S CONSTITUTION ─────────────────────────────────────
sec('C10 \u00b7 the claim page (the crew posture)');
{
  const raw = read(CLAIM);
  const s = strip(raw);
  ok('no browser storage anywhere', !/localStorage|sessionStorage/.test(s));
  ok('the dead-link byte carries U+2019, matching what crew RENDERS',
    /DEAD_LINK = 'This link isn\\u2019t active\.'/.test(raw));
  ok('only a 404 is a dead link (a 500 is our failure, not her token)',
    /r\.status === 404/.test(s) && !/!r\.ok[\s\S]{0,40}setDead/.test(s));
  ok('the terminal state REPLACES the controls rather than greying them',
    /settled \?/.test(s));

  // ── R-40.29 · THE TAP IS ACKNOWLEDGED, AND A FAILURE SAYS SO (F-40.53) ────
  // The founder walked a 503 that left the button live and rendered nothing; he
  // learned it had failed by querying the database. Silence is not honesty.
  ok('the HTTP status is the verdict, not the body shape',
    /if \(!r\.ok\) \{ setFailed\(true\)/.test(s),
    'a 503 carries no JSON — a check keyed only on j.ok reads it as silence');
  ok('a dropped connection is reported, not swallowed', /catch \{[\s\S]{0,200}setFailed\(true\)/.test(s));
  // BOTH controls, counted. The first cut tested for ONE occurrence and the
  // mutation that stripped it from the claim button left the decline button's
  // copy standing — so the cell passed while the primary action went silent.
  // A cell that a partial mutation survives is testing presence, not the rule.
  ok('BOTH controls acknowledge the tap before the request (b)',
    (s.match(/aria-busy=\{busy\}/g) || []).length === 2,
    String((s.match(/aria-busy=\{busy\}/g) || []).length) + ' of 2');
  ok('both controls are also disabled in flight',
    (s.match(/disabled=\{busy\}/g) || []).length === 2);
  ok('the failure line renders only when the request failed (a)',
    /\{failed \? <p className="cl-failed"[\s\S]{0,80}CLAIM_FAILED\}<\/p> : null\}/.test(s));
  ok('the failure line is cleared on retry, never argued with by a stale sentence',
    /setBusy\(true\);\s*\n\s*setFailed\(false\);/.test(s));
  const pub = read(PUBCOPY);
  ok('CLAIM_FAILED lives in the public copy home, not at the call site',
    /CLAIM_FAILED = 'That didn\\u2019t go through\. Try again in a moment\.'/.test(pub));
  ok('and its apostrophe is TYPOGRAPHIC (R-40.19)', !/didn't go through/.test(pub));
}

// ── C11 · EVERY PUBLIC LANE IS KNOWN TO THE BOOT SCRIPT (F-40.52) ───────────
// The root layout paints a background per lane. A lane it does not name falls
// through to the app's near-black above a cream page — F-19.41's defect, and
// `/credits/` was its third instance despite C38's header promising to refuse
// one. This asserts the lanes THIS SITTING created are named.
sec('C11 \u00b7 the public lanes the boot script knows');
{
  const root = strip(read('app/layout.tsx'));
  for (const lane of ['/v/', '/r/', '/credits/']) {
    ok('the boot script names ' + lane, root.includes(`indexOf('${lane}')===0`));
  }
  ok('and something actually branches on the predicate (presence is not behaviour)',
    /else\s+if\s*\(\s*isPublicStorefront\s*\)\s*\{\s*bg\s*=/.test(root));
}

if (process.argv.includes('--cells-only')) process.exit(fail === 0 ? 0 : 1);

// ══════════════════════════════════════════════════════════════════════════════
if (process.argv.includes('--mutate')) {
  sec('MUTATIONS \u2014 each must turn the cells RED');
  const MUT = [
    [GRIDF, 'the grid loses its clearance \u2014 Advisor returns under the FAB',
      'padding-bottom:calc(var(--wl-fab-bottom) + var(--wl-tile))', 'padding-bottom:24px'],
    [GRIDF, 'the wide shape is derived from an index instead of the registry',
      "room.wide ? 'wl-tile wl-tilewide' : 'wl-tile'", "'wl-tile'"],
    [ROOMS, 'a third tile is flagged wide without joining the declaration',
      "{ id: 'leads',     label: 'Leads',     band: 'work', href: '/vendor/leads',     pinnable: true  },",
      "{ id: 'leads',     label: 'Leads',     band: 'work', href: '/vendor/leads',     pinnable: true, wide: true },"],
    [ROOMS, 'Business Solutions leaves index 0',
      "{ id: 'support',   label: 'Business Solutions', band: 'work', href: '/vendor/support', pinnable: false, wide: true },\n  { id: 'leads',",
      "{ id: 'leads',"],
    [PIECES, 'an unbuilt row becomes a link to nowhere',
      "  return href\n    ? <Link href={href} className=\"sol-row\">{body}</Link>\n    : <div className=\"sol-row\">{body}</div>;",
      "  return <Link href={href ?? '#'} className=\"sol-row\">{body}</Link>;"],
    [WPCOPY, 'a role label drifts from the dream-os home',
      "{ key: 'decor',     label: 'D\\u00e9cor' },", "{ key: 'decor',     label: 'Decor' },"],
    [SOLCOPY, 'R-40.26 is reverted \u2014 row three loses & SEO',
      "{ key: 'website',       label: 'Your website & SEO' },", "{ key: 'website',       label: 'Your website' },"],
    [PIECES, 'the divider rule goes back to last-of-type (F-40.42)',
      '.sol-row:last-child{border-bottom:none}', '.sol-row:last-of-type{border-bottom:none}'],
    [PIECES, 'the live row loses its chip \u2014 the walk finding returns',
      "<StateChip state={href ? 'open' : 'coming'} />", "{href ? null : <StateChip state=\"coming\" />}"],
    [WPCOPY, 'a room byte is re-voiced away from the mock',
      "emptyHead:         'No wedding pages yet.',", "emptyHead:         'Nothing here yet.',"],
    [WPCOPY, 'the waiting line loses its typographic apostrophe (R-40.19)',
      "waitingOnCouple:   'Waiting on the couple\\u2019s permission.',",
      "waitingOnCouple:   'Waiting on the couple\\'s permission.',"],
    [LEAF, 'the miss starts leaking through the link preview',
      'return { title: PUBLIC_MISS, robots: { index: false, follow: false } };',
      'return { title: PUBLIC_MISS };'],
    [CLAIM, 'the pending state is dropped \u2014 the tap goes unacknowledged',
      'aria-busy={busy}\n                    onClick={() => settle(\'claim\')}',
      'onClick={() => settle(\'claim\')}'],
    [CLAIM, 'a failure is swallowed again (F-40.53 returns)',
      'if (!r.ok) { setFailed(true); setBusy(false); return; }', ''],
    ['app/layout.tsx', 'a public lane leaves the boot script (F-40.52)',
      "||path.indexOf('/credits/')===0", ''],
    [CLAIM, 'the claim page starts remembering the token',
      "  const [busy, setBusy] = useState(false);",
      "  const [busy, setBusy] = useState(false);\n  if (typeof window !== 'undefined') localStorage.setItem('t', token);"],
    [ROUTES, 'the address home is deleted \u2014 the second spelling returns',
      "export const WEDDING_PAGES_HREF = '/vendor/wedding-pages';",
      "export const WEDDING_PAGES_HREF_RETIRED = '/vendor/wedding-pages';"],
  ];
  for (const [rel, name, from, to] of MUT) {
    const abs = P(rel);
    const before = fs.readFileSync(abs);
    const txt = before.toString('utf8');
    if (!txt.includes(from)) { ok(name, false, 'mutation site absent \u2014 the code moved'); continue; }
    fs.writeFileSync(abs, txt.replace(from, to));
    const r = spawnSync(process.execPath, [__filename, '--cells-only'], { encoding: 'utf8' });
    fs.writeFileSync(abs, before);
    ok(name + ' \u2192 RED', r.status !== 0, 'exit ' + r.status);
    ok(name + ' \u2192 restored byte-for-byte', Buffer.compare(before, fs.readFileSync(abs)) === 0);
  }
}

console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' \u2014 b42 g11 wedding pages (pwa) ' +
  pass + '/' + (pass + fail));
process.exit(fail === 0 ? 0 : 1);
