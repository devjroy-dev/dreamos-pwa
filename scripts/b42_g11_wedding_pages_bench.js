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
// ── G1.2's own subjects ─────────────────────────────────────────────────────
const CONSENT = 'app/consent/[token]/page.tsx';
const CREW    = 'app/crew/[token]/page.tsx';
const TOKEN   = 'lib/public/token.ts';
const PUBCOPY = 'lib/public/copy.ts';
const MOCK    = 'docs/mocks/wedding-pages-mock.html';
const MOCK2   = 'docs/mocks/wedding-guests-mock.html';

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
  // ── AMENDED BY LABEL — G2. THE TERNARY BECAME A MAP, AND THE CELL DID NOT ──
  // ── LOOSEN. It read the exact ternary `r.key === 'wedding_pages' ? … : undefined`
  // and reddened the moment a SECOND room lawfully opened — the same census-pinned-
  // to-a-shape disease as b05_arc_m1's ack count, one repo over.
  //
  // THE PROPERTY IT EXISTS FOR IS THAT AN href COMES FROM A DECLARED ADDRESS AND
  // NEVER FROM A LITERAL, and that is asserted harder here than before: every
  // value in the map must be a `*_HREF` identifier, so a hub that hardcoded
  // `'/vendor/anything'` still reddens. What retires is the ARITY, not the rule.
  //
  // `wedding_pages` is still named explicitly, so this bench still owns its own
  // room's row: G2 opening a second door cannot silently close G1.1's.
  const hrefMap = hub.match(/const ROOM_HREFS[^=]*=\s*\{([\s\S]*?)\}/);
  ok('the hub addresses rooms through a declared map, not a ternary', !!hrefMap,
    hrefMap ? 'ROOM_HREFS found' : 'no ROOM_HREFS declaration in the hub');
  if (hrefMap) {
    const entries = hrefMap[1].split(',').map((l) => l.trim()).filter(Boolean);
    ok('wedding_pages still receives its declared address',
      entries.some((e) => /^wedding_pages:\s*WEDDING_PAGES_HREF$/.test(e)));
    ok('every open room addresses a *_HREF constant, never a literal',
      entries.every((e) => /^[a-z_]+:\s*[A-Z_]+_HREF$/.test(e)),
      entries.join(' | '));
  }
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
  // ── AMENDED, LABELLED — G1.2: THE ROOM NOW DRAWS FROM TWO RATIFIED MOCKS ──
  // `wedding-pages-mock.html` is G1.1's and remains the authority for every byte
  // it drew. G1.2's surfaces — the upload strip, the failure lines, the picker's
  // truncation tell — were ratified from `wedding-guests-mock.html` @ 6eea5bf
  // (founder, 2026-09-05: "veto all approved as proposed"). A cell reading only
  // the first mock would BOUNCE every byte of the second, which is a stale pin
  // rather than a strict one. Both are read; a string in NEITHER is still a
  // BOUNCE and this cell still reds on it.
  const mock = read(MOCK) + '\n' + read(MOCK2);
  const wp = read(WPCOPY);
  const strings = [...wp.matchAll(/^\s{2}[a-zA-Z]+:\s+'([^']+)',/gm)].map((x) => x[1]);
  // ⚠ THE DECODER MUST KNOW EVERY ESCAPE THE COPY HOME USES, or a correctly
  // ratified byte reads as a BOUNCE. It handled \u2019 and \u00e9 and not
  // \u2014, so the first string carrying an em dash failed this cell while
  // being perfectly correct. Found by that exact failure.
  const decode = (s) => s.replace(/\\u2019/g, '\u2019')
                         .replace(/\\u00e9/g, '\u00e9')
                         .replace(/\\u2014/g, '\u2014');
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
  const RULED_PAST_THE_MOCK = [
    'Open', 'Your website & SEO',
    // ── G1.2's FOUR, EACH WITH ITS PROVENANCE ────────────────────────────────
    // Every one is RATIFIED; none is mock-DRAWN, which is a different thing and
    // the reason this list exists rather than the cell being loosened.
    //
    // `Remove` is an ACCESSIBLE NAME, not product copy — it is what a screen
    // reader says for the `\u00d7` glyph, the same class as the sheet's own
    // `Close`, which this bench has never asked the mock to draw either. A mock
    // is a picture; a picture cannot draw a label only a screen reader hears.
    'Remove',
    // R-G12.8's byte, ratified by the CHAIR under the founder's standing
    // delegation (R-40.42), not transcribed from a frame. F-40.78's surface was
    // missing, so no frame was ever drawn for it — the flag had ridden the door
    // since TDW_04 B6-S1 with nothing rendering it.
    'Showing your latest 200 events. Older ones aren\u2019t listed here yet.',
    // F-40.77's two. `wedding-guests-mock.html` drew the CREATE sheet's failure
    // line (F-40.56, string 28) on G4-create-noevent and did not draw these two,
    // because the credits sheet's swallows were found by reading the code AFTER
    // the mock was cut. The founder vetoed all three together as strings 28-30.
    'That didn\u2019t add. Try again.',
    'That didn\u2019t publish. Try again.',
    // ── THE CONSENT ASK'S FIVE — CARVED OUT AND *NOT YET VETOED* ─────────────
    // ⚠ THESE ARE THE ONLY STRINGS IN THIS ROOM THE FOUNDER HAS NOT SEEN.
    // `wedding-guests-mock.html` drew the CONSENT LEAF (G3-consent, G3-terminal)
    // and never drew the vendor-side ask that mints its token — because the door
    // was built with NO CALLER (F-40.103) and no frame was cut for a surface
    // nobody had noticed was missing. They ship so the founder's card can be
    // performed at all, and they are RAISED for his veto in the handover rather
    // than smuggled through this carve-out. A carve-out that hides an unvetoed
    // byte is exactly the stale pin this list exists not to become.
    'The couple\u2019s number',
    'Ask the couple',
    'Sent. The link is below if you need it again.',
    'Not sent yet \u2014 send this link to the couple yourself.',
    'That didn\u2019t send. Try again.',
  ];
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
  // ── SEALED CELL AMENDED, LABELLED — G1.2 (R-G12.9 / F-40.40) ──────────────
  // WAS: the literal `DEAD_LINK = 'This link isn\u2019t active.'` in THIS file.
  // F-40.40 closed: the byte had three occurrences across two files and no home,
  // and G1.2's /consent/ leaf would have made a fourth. It now lives once, in
  // `lib/public/token.ts`, and this leaf READS it. The property the cell exists
  // to hold is unchanged — the byte carries U+2019, not an ascii quote — so the
  // assertion moves to where the byte is and gains a second half proving this
  // leaf no longer respells it. C15 asserts the same for crew and consent.
  // Ratify or revert; it lands with the code that moved it.
  ok('the dead-link byte carries U+2019 at its ONE home, and this leaf reads it',
    /export const TOKEN_DEAD_LINK = 'This link isn\\u2019t active\.'/.test(read(TOKEN))
    && /DEAD_LINK = TOKEN_DEAD_LINK/.test(raw));
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

// ── C12 · F-40.68 / R-G11c.11 · THE PICKER SPANS THE BACK CATALOGUE ─────────
// A wedding page is finished work. Before this cure the create sheet's events
// read passed no window and inherited the door's default — `from = today`
// (src/api/vendor/events.js:210-212, applied by `.gte` at :258-263) — so it
// could only ever offer FUTURE events, which is the feature's premise inverted.
//
// FOUND ON THE FOUNDER'S GLASS, NOT BY READING (R-39.15). The dropdown held ONE
// option out of DEV440's seven live events: the only future-dated one, which was
// also the only leadless one. Two seats had read the POST create door and this
// file's own client code and neither had opened the GET the picker calls.
sec('C12 \u00b7 the create picker\u2019s window (F-40.68 / R-G11c.11)');
{
  const room = strip(read(ROOM));
  // BALANCED, NOT `[^)]*`. The first cut used `fetchEvents\([^)]*\)`, which
  // stops at the first `)` — and that `)` belongs to `istPlusDaysISO(400)`, so
  // the extracted call was truncated mid-argument and the forward-bound cell
  // convicted a correct call. A cell that mis-reads its own subject is the same
  // defect as one that reads the wrong subject.
  const call = (() => {
    const at = room.indexOf('fetchEvents(');
    if (at === -1) return '';
    let depth = 0;
    for (let i = room.indexOf('(', at); i < room.length; i++) {
      if (room[i] === '(') depth++;
      else if (room[i] === ')' && --depth === 0) return room.slice(at, i + 1);
    }
    return '';
  })();
  ok('the create picker was FOUND (C12 is not vacuous)', call.length > 0, 'no fetchEvents call');
  // THE CELL IS THE `from`, NOT THE ARGUMENT COUNT. A four-argument call whose
  // third argument were `istTodayISO()` would satisfy any arity check and leave
  // the defect exactly where it was.
  ok('the picker passes an explicit PAST floor \u2014 the back catalogue is reachable',
    /fetchEvents\([^)]*,\s*WP_PICKER_FROM\s*,/.test(call), call);
  ok('and the floor really is in the past (not today, not computed forward)',
    /const WP_PICKER_FROM\s*=\s*'(\d{4})-\d{2}-\d{2}'/.test(room) &&
    Number(room.match(/const WP_PICKER_FROM\s*=\s*'(\d{4})/)[1]) <= 2000,
    'the floor is not a pre-2001 literal');
  // `to` must be sent too: the helper ships the window only when BOTH bounds are
  // present (lib/vendor/api/vendor.ts), so a `from` alone is silently dropped.
  ok('a forward bound rides with it \u2014 a lone `from` is dropped by the helper',
    /fetchEvents\([^)]*WP_PICKER_FROM\s*,\s*istPlusDaysISO\(\s*400\s*\)\s*\)/.test(call), call);
  // No second answer to "what is today" is authored here.
  ok('no UTC-day arithmetic is authored at this site \u2014 the IST home is imported',
    /from '@\/lib\/vendor\/istDay'/.test(read(ROOM)) &&
    !/new Date\(\)\.toISOString\(\)/.test(room));
}

// ── C13 · R-40.33 · A CONSENT GATE MAY NOT SIT BEHIND A CACHE ───────────────
// The leaf carried `export const revalidate = 300` AND a retyped `{ next:
// { revalidate: 300 } }` at the call site, under a comment claiming consent was
// "enforced at the DOOR on every revalidation". Both halves were true and
// together they were wrong: the door re-checked consent once every five minutes,
// so a couple who turned her switch OFF stayed published to every visitor for up
// to five more minutes.
//
// ⚠ THE ASSERTION IS ON THE STRIPPED SOURCE, AND THAT IS THE POINT. The cure
// leaves three occurrences of the word in COMMENTS explaining why it is gone;
// a cell that cannot tell a rule from its violation would convict the
// explanation (b53's e-4, same class, quoted in this file's own header).
//
// ⚠ AND THE CARD LEAF IS ASSERTED TO KEEP ITS 300. The asymmetry is a ruling,
// not an oversight: `app/v/[code]/page.tsx` is a vendor's own storefront and a
// stale minute can only hurt her, while this page is governed by a THIRD PARTY's
// consent and a stale minute hurts the person who just withdrew it. Without this
// second half a zealous sweep would "finish the job" on the card leaf and nothing
// would object.
sec('C13 \u00b7 consent is not cached (R-40.33 / F-40.80)');
{
  const leaf = strip(read(LEAF));
  ok('the wedding leaf carries NO revalidate in live code',
    !/revalidate/.test(leaf), leaf.match(/.{0,60}revalidate.{0,60}/)?.[0] || '');
  // Named separately so a partial revert is legible: deleting one site and not
  // the other is the exact half-cure F-40.80 recorded.
  ok('no route-level export survives',
    !/export\s+const\s+revalidate/.test(leaf));
  ok('no cache option survives at the door fetch',
    !/next\s*:\s*\{[^}]*revalidate/.test(leaf));
  // NON-VACUITY: this cell must be reading a file that actually calls the door.
  ok('C13 is not vacuous \u2014 the leaf still fetches the wedding door',
    /\/api\/v2\/public\/wedding\//.test(leaf));
  // THE ASYMMETRY, PINNED THE OTHER WAY.
  ok('the CARD leaf keeps its revalidate \u2014 the asymmetry is ruled, not drift',
    /revalidate/.test(strip(read('app/v/[code]/page.tsx'))));
}

// ── C14 · THE QUARANTINE IS A MECHANISM, NOT A COMMENT (R-40.34) ────────────
// R-G11c.11's seat declared b50 out of its gate inside a floor manifest and
// recorded in that same file that the declaration was INERT — `run-floor.sh:121`
// strips `#`, so a manifest is a file list and the runner has no exclusion hook.
// The directory is the arm that closes it: `run-floor.sh:186` globs
// `scripts/*.js` FLAT, so one directory down is outside the floor by
// construction rather than by anyone remembering.
sec('C14 \u00b7 b50 is quarantined by mechanism (R-40.34 / F-40.70 / F-40.71)');
{
  ok('b50 no longer sits in the floor\u2019s glob path',
    !has('scripts/b50_fetch_loop_bench.js'));
  ok('b50 exists, quarantined \u2014 not deleted',
    has('scripts/quarantine/b50_fetch_loop_bench.js'));
  // The mechanism itself is asserted, because if the runner ever learns to
  // recurse this whole quarantine silently stops working.
  ok('the floor glob is still FLAT \u2014 the mechanism holds',
    /ls scripts\/\*\.proof\.mjs scripts\/\*\.mjs scripts\/\*\.js/.test(read('scripts/run-floor.sh')));
  ok('the README names both findings and the release conditions',
    /F-40\.70/.test(read('scripts/quarantine/README.md'))
    && /F-40\.71/.test(read('scripts/quarantine/README.md')));
  // F-40.72's own subject: a manifest naming a path that no longer exists is a
  // guard pointing at nothing, and F-14.16's declared-dirt check would pass it.
  ok('the ce39-smalls manifest names the path that EXISTS',
    /^scripts\/quarantine\/b50_fetch_loop_bench\.js$/m
      .test(read('scripts/floor-manifest-ce39-smalls.txt')));
}

// ── C15 · F-40.40 · THE DEAD-LINK BYTE HAS ONE HOME ────────────────────────
// It had THREE occurrences across TWO files and no home: two inline JSX
// literals on the crew leaf and a private `const` on the credits leaf, whose own
// comment filed the duplication rather than fixing it because the crew page
// belonged to another arc. G1.2's `/consent/` would have made a fourth.
sec('C15 \u00b7 the capability-token constitution (R-G12.9 / F-40.40)');
{
  const tok = read(TOKEN), crew = read(CREW), claim = read(CLAIM), cons = read(CONSENT);
  ok('the byte is declared in exactly ONE place',
    /export const TOKEN_DEAD_LINK/.test(tok));
  // ⚠ STRIPPED. Each leaf's comments NAME the byte to explain the hoist; a cell
  // that cannot tell a rule from its violation would convict the explanation
  // (b53's e-4, and my own e-5 one arc later).
  for (const [n, src] of [['crew', crew], ['credits', claim], ['consent', cons]]) {
    ok(`the ${n} leaf reads the byte, never respells it`,
      !/This link isn(&rsquo;|\u2019)t active\./.test(strip(src)));
  }
  ok('the apostrophe is typographic, not ascii (R-40.19)',
    /isn\\u2019t active/.test(tok) && !/isn't active/.test(strip(tok)));
  // F-40.53 MADE A TYPE: `dead` is 404 and nothing else; everything else is us.
  ok('dead is 404 ALONE \u2014 an outage never reads as an expired token',
    /if \(r\.status === 404\) return \{ kind: 'dead' \}/.test(tok)
    && /kind: 'offline'/.test(tok) && /kind: 'failed'/.test(tok));
  ok('the status is checked BEFORE the body is parsed (F-40.53)',
    tok.indexOf("r.status === 404") < tok.indexOf('r.json()'));
}

// ── C16 · THE PUBLIC LEAF STAYS A SERVER COMPONENT ─────────────────────────
// `app/v/[code]/w/[slug]/page.tsx:35-38` refuses a client bundle IN TERMS. G1.2
// adds a gallery and a form to that page and the refusal must survive both —
// which is the whole reason the sheet is `<details>` and not React state.
sec('C16 \u00b7 the guest gallery ships no JavaScript (R-G12.10/.16)');
{
  const leaf = strip(read(LEAF));
  ok('the leaf is NOT a client component', !/["']use client["']/.test(leaf));
  ok('no React state, no handlers anywhere in live code',
    !/useState|onClick|onChange|onSubmit/.test(leaf));
  ok('the download is a real form POST to the door',
    /<form[\s\S]{0,200}method="POST"/.test(leaf)
    && /wedding-download\//.test(leaf));
  // R-G12.16: the ratified frame kept, the browser owning the open.
  ok('the sheet is a details/summary pair \u2014 a sheet without a script',
    /<details/.test(leaf) && /<summary/.test(leaf));
  ok('the summary loses its marker by the documented reset, not a hack',
    /list-style:none/.test(read(LEAF)) && /-webkit-details-marker\{display:none\}/.test(read(LEAF)));
  // THE ONE QUESTION, UNTICKED. A pre-ticked box is consent nobody gave.
  ok('the contact checkbox ships UNCHECKED (master \u00a72.4)',
    /name="may_contact"/.test(leaf) && !/name="may_contact"[^>]*\bdefaultChecked/.test(leaf)
    && !/name="may_contact"[^>]*\bchecked/.test(leaf));
  ok('the month field is optional \u2014 no required attribute on it',
    !/name="wedding_month"[^>]*\brequired/.test(leaf));
  // STRIPPED: the retirement is EXPLAINED in a CSS comment that names both
  // retired classes, and an unstripped cell convicts its own explanation —
  // e-5's class, caught again by my own cell.
  ok('the four-item strip is RETIRED WITH ITS READER, not commented out',
    !/pw-stripimg/.test(strip(read(LEAF))));
}

// ── C17 · THE ROOM'S G1.2 SURFACES ─────────────────────────────────────────
sec('C17 \u00b7 the upload control, the no-event create, the failure lines');
{
  const room = strip(read(ROOM));
  ok('the room mounts an upload control at last (F-40.57)',
    /API\.weddingUploadUrl/.test(room) && /API\.weddingPhotos/.test(room));
  ok('cell one is marked as the hero the public leaf will use',
    /i === 0 \?[\s\S]{0,80}WP\.photoHero/.test(room));
  ok('remove goes through the ruled door', /API\.weddingPhoto\(/.test(room));
  // R-G12.12 was NARROWED: no order door shipped, so no caller may name one.
  ok('no reorder caller \u2014 the door was never built (F-40.83)',
    !/photos\/order/.test(room) && !/weddingOrder/.test(room));
  // SEQUENTIAL, not a fan-out: a phone on venue wifi drops half of a parallel
  // burst and reports success, and a counter cannot exist under one at all.
  ok('the upload is sequential so the counter can be honest',
    /for \(let i = 0; i < files\.length/.test(room) && !/Promise\.all\(files/.test(room));
  // F-40.56 and F-40.77 — three swallows, all cured.
  for (const [n, k] of [['create', 'saveFailed'], ['add', 'addFailed'], ['publish', 'publishFailed']]) {
    ok(`the ${n} failure is SHOWN, not swallowed`, new RegExp(`WP\\.${k}`).test(room));
  }
  ok('no empty catch survives in this room',
    !/catch \{\s*\}/.test(room) && !/catch \{ \/\*/.test(read(ROOM)));
  // ── THE NO-EVENT CREATE'S THREE CELLS ARE WITHHELD WITH THE ARM — F-40.99 ──
  // They were written, they passed, and they are held because the SURFACE is
  // held: `public.weddings` has thirteen columns and none is a date, so a
  // hand-typed one has nowhere to live and R-G12.6 cannot execute as worded.
  // A green cell over a withheld surface is worse than no cell — it would read
  // as proof the arm shipped. What IS asserted is the withholding itself, so
  // the arm cannot creep back in unbenched.
  ok('the no-event arm is withheld, not half-shipped (F-40.99)',
    !/__none/.test(room) && !/WP\.eventNone/.test(room) && !/WP\.fieldDate/.test(room));
  ok('and its two vetoed bytes are withheld from the copy home too',
    !/eventNone:/.test(read(WPCOPY)) && !/fieldDate:/.test(read(WPCOPY)));
  // R-G12.8 / F-40.78: the flag existed, the surface didn't.
  ok('the truncation tell finally has a surface',
    /r\.truncated === true/.test(room) && /WP\.pickerTruncated/.test(room));
  // ── F-40.101 · A FileList IS LIVE, NOT A COPY ─────────────────────────────
  // The call site resets the input so the same file can be picked twice, and that
  // reset runs the moment `upload` first awaits — emptying the list the loop is
  // walking. Four picked, ONE saved, three gone with no error. The snapshot must
  // be taken before any await, and this cell is what keeps it there.
  ok('the picked files are SNAPSHOT before any await (F-40.101)',
    /Array\.from\(picked\)/.test(room)
    && !/for \(let i = 0; i < files\.length[\s\S]{0,400}FileList/.test(room));
  // ── F-40.103 · the consent ask has a surface at last ──────────────────────
  ok('the consent door has a caller', /API\.weddingConsent/.test(room));
  // It is offered ONLY where it is lawful: a page whose couple is on TDW is
  // governed by her switch, and a second door onto one decision is the disease.
  ok('and it is ABSENT, not disabled, when the couple is on TDW',
    /w\.couple_id \? null :/.test(room));
  // The link shows whether or not the send went — it is the artefact she pastes.
  ok('the link is shown even when the send is dark',
    /consentUrl \?/.test(room) && /WP\.consentDarkLine/.test(room));
}

// ── C19 · EVERY API ADDRESS HAS A CALLER — F-40.103, ratified mechanism ────
// I shipped TWO doors with no callers in one delivery — `POST /:id/consent` and
// the answer render — in the SAME sitting where I flagged the chair that a
// reorder door with no caller was the F-40.28 shape and had it narrowed out. I
// applied the rule to the door I was told to build and to neither of the two I
// chose. The founder found it by trying to perform step 5 of my own card.
//
// A COMMENT CANNOT ENFORCE THIS AND A CELL CAN. Every member of `API` must be
// named by something that is not its own definition. An address nobody calls is
// either dead weight or, worse, a promise a card will make on its behalf.
sec('C19 \u00b7 every API address has a caller (F-40.103)');
{
  const routes = read(ROUTES);
  const members = [...routes.matchAll(/^  ([a-zA-Z]+):\s*\(/gm)].map((m) => m[1]);
  ok('C19 is not vacuous \u2014 the address home was parsed', members.length >= 6,
    `found ${members.length}`);
  // The callers are the whole app, not a list someone wrote down — the same
  // reasoning b16 §2.2 uses when it walks the source tree instead of a census.
  const callers = ['app', 'lib', 'components', 'hooks']
    .map((d) => { try { return execSync(`grep -rho "API\\.[a-zA-Z]*" ${d} 2>/dev/null || true`,
      { cwd: ROOT, encoding: 'utf8' }); } catch { return ''; } })
    .join('\n');
  const orphans = members.filter((m) => !new RegExp(`API\\.${m}\\b`).test(callers));
  ok('no address in API is without a caller', orphans.length === 0,
    orphans.length ? `orphaned: ${orphans.join(', ')}` : '');
}

// ── C18 · NO BACKTICK INSIDE A STYLE TEMPLATE LITERAL ──────────────────────
// e-7 AND e-8: I closed a `<style>{`…`}</style>` literal twice in one sitting by
// writing a code reference in backticks inside its CSS comments. tsc reports it
// as dozens of JSX errors nowhere near the cause, which is why it survived a
// first fix. The chair recorded it as the third instance of the week across two
// seats. A comment cannot enforce this; a cell can.
sec('C18 \u00b7 no backtick inside a style literal (e-7/e-8)');
{
  for (const rel of [LEAF, CLAIM, CONSENT, ROOM]) {
    const parts = read(rel).split('<style>{`');
    let found = 0;
    for (let i = 1; i < parts.length; i += 1) {
      const body = parts[i].split('`}</style>')[0];
      found += (body.match(/`/g) || []).length;
    }
    ok(`${rel} carries no backtick inside a style literal`, found === 0, `${found} found`);
  }
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
    [ROOM, 'the picker drops its past floor \u2014 the back catalogue vanishes again (F-40.68)',
      "const r = await fetchEvents(vendorId, 'all', WP_PICKER_FROM, istPlusDaysISO(400));",
      "const r = await fetchEvents(vendorId, 'all');"],

    [ROOM, 'the floor is quietly moved to today \u2014 the arity survives, the cure does not',
      "const WP_PICKER_FROM = '2000-01-01';",
      "const WP_PICKER_FROM = istPlusDaysISO(0);"],

    // ── G1.2's SIX ────────────────────────────────────────────────────────────
    // F-40.40: the byte's one home is the whole point; a leaf respelling it is
    // the fourth occurrence returning.
    [CLAIM, 'the credits leaf respells the dead-link byte \u2014 F-40.40 reopens',
      "const DEAD_LINK = TOKEN_DEAD_LINK;",
      "const DEAD_LINK = 'This link isn\\u2019t active.';"],
    // F-40.53 made a type: a 500 must never read as an expired token.
    [TOKEN, 'an outage starts reading as a dead token \u2014 she chases a vendor over our 500',
      "    if (r.status === 404) return { kind: 'dead' };\n    if (!r.ok) return { kind: 'offline' };",
      "    if (!r.ok) return { kind: 'dead' };"],
    // R-G12.10/.16: the public lane's whole refusal.
    [LEAF, 'the public leaf grows a client bundle \u2014 every stranger pays for hydration',
      "import type { Metadata } from 'next';",
      "\"use client\";\nimport type { Metadata } from 'next';"],
    // master §2.4: silence never means yes, and neither does a pre-ticked box.
    [LEAF, 'the contact box ships PRE-TICKED \u2014 consent nobody gave',
      'type="checkbox" name="may_contact" value="true"',
      'type="checkbox" name="may_contact" value="true" defaultChecked'],
    // F-40.77: the swallow returning is the defect, not the message changing.
    [ROOM, 'the credit failure is swallowed again \u2014 F-40.77 reopens',
      "      setErr(e instanceof Error && e.message ? e.message : WP.addFailed);",
      "      setErr(null);"],
    // R-G12.12 was narrowed BECAUSE a door with no caller is the F-40.28 shape.
    [ROOM, 'a reorder caller appears for a door that was never built (F-40.83)',
      "  async function removePhoto(photoId: string) {",
      "  async function reorder() { await postJson(WEDDINGS_API_PATH + '/x/photos/order', {}); }\n  async function removePhoto(photoId: string) {"],

    // ── F-40.101 · the live FileList, the founder's own walk ──────────────────
    [ROOM, 'the picked files stop being snapshot \u2014 four chosen, one saved, three gone silently',
      "    const files = picked ? Array.from(picked) : [];",
      "    const files = picked as unknown as File[];"],
    // ── F-40.103 · the mechanism, proven able to red ──────────────────────────
    [ROOM, 'the consent ask loses its caller \u2014 a door with no button again',
      "        API.weddingConsent(wedding.id), { phone: consentPhone.trim() },",
      "        '/api/v2/vendor/studio/weddings/x/consent', { phone: consentPhone.trim() },"],
    [ROOM, 'the consent ask is offered on a page whose couple is on TDW \u2014 two doors, one decision',
      "      {w.couple_id ? null : (",
      "      {false ? null : ("],

    [ROUTES, 'the address home is deleted \u2014 the second spelling returns',
      "export const WEDDING_PAGES_HREF = '/vendor/wedding-pages';",
      "export const WEDDING_PAGES_HREF_RETIRED = '/vendor/wedding-pages';"],

    // ── R-40.33 · EACH SITE RESTORED ON ITS OWN ───────────────────────────────
    // TWO mutations and not one, because F-40.80's whole subject is that this
    // cure has two sites and the "one line" reading undercounted it. A single
    // mutation restoring both would leave a half-revert invisible — which is the
    // exact failure the finding records.
    [LEAF, 'the route-level revalidate comes back \u2014 consent caches for 5 minutes',
      "export const viewport = {",
      "export const revalidate = 300;\n\nexport const viewport = {"],

    [LEAF, 'the door fetch caches again \u2014 the retyped 300 returns (F-40.80)',
      "${encodeURIComponent(slug)}`,\n    );",
      "${encodeURIComponent(slug)}`,\n      { next: { revalidate: 300 } },\n    );"],

    // ── R-40.34 · THE QUARANTINE'S MECHANISM, NOT ITS CONTENTS ────────────────
    // If the runner ever learns to recurse, every bench in `scripts/quarantine/`
    // silently rejoins the floor and nothing in the tree objects. This is what
    // makes C14's mechanism cell non-vacuous.
    ['scripts/run-floor.sh', 'the floor glob learns to recurse \u2014 the quarantine dissolves in silence',
      "ALL=$(ls scripts/*.proof.mjs scripts/*.mjs scripts/*.js 2>/dev/null | sort -u)",
      "ALL=$(find scripts -name '*.proof.mjs' -o -name '*.mjs' -o -name '*.js' | sort -u)"],
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
