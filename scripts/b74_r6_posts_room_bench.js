#!/usr/bin/env node
'use strict';
// scripts/b74_r6_posts_room_bench.js — CE-42 4b-1 · R6 · THE "POSTS & ADS" ROOM (pwa half).
// Seat R6. Base dreamos-pwa a96e2e23a73081070a9d2155e247a847938713f0.
//
// NUMBERED b74, DERIVED ACROSS BOTH REPOS (b69's rule): the pwa ladder tails at
// b72_r4210_plan_entry_bench.js, and dream-os takes b73 for this packet's other
// half (scripts/b73_post_cards_bench.js — the arm and its door). First free: 74.
//
// Every cell reads SHIPPED SOURCE, comments stripped. Cells marked ⇄ read the
// sibling dream-os tree and REFUSE (exit 3) if it is absent — a cross-repo cell
// that cannot see the other side is not a pass.
//
// ═══ WHAT THIS BENCH CANNOT PROVE ════════════════════════════════════════════
// The walk: that Cloudinary renders the card, that Download saves it on her
// phone, that Share opens the sheet. Those are the founder's card. The URL, the
// caption and the refusals are proven in b73 against production source.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIB = path.resolve(ROOT, '../dream-os');
// C12 transpiles the REAL format.ts with the repo's own typescript. Without node_modules the
// bench cannot READ its subject — a refusal (F-39.47), never a red that looks like a defect.
if (!fs.existsSync(path.join(ROOT, 'node_modules/typescript'))) {
  console.log('REFUSED — node_modules/typescript is absent (run npm ci); C12 cannot transpile lib/vendor/format.ts.');
  process.exit(3);
}
if (!fs.existsSync(path.join(SIB, 'src/api/vendor/posts.js'))) {
  console.log('REFUSED — ../dream-os/src/api/vendor/posts.js not present; the ⇄ cells cannot see the door.');
  process.exit(3);
}

const read = (p) => fs.readFileSync(p, 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
let pass = 0; const reds = [];
function cell(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = e.message; }
  if (why) { reds.push(name); console.log(`RED   ${name} — ${why}`); } else { pass++; console.log(`GREEN ${name}`); }
}

const routes = strip(read(path.join(ROOT, 'lib/solutions/routes.ts')));
const hub = strip(read(path.join(ROOT, 'app/vendor/(shell)/support/page.tsx')));
const pagePath = path.join(ROOT, 'app/vendor/(shell)/posts/page.tsx');
const page = fs.existsSync(pagePath) ? strip(read(pagePath)) : '';
const copyHome = strip(read(path.join(ROOT, 'lib/worklist/posts.ts')));
const door = strip(read(path.join(SIB, 'src/api/vendor/posts.js')));
const core = strip(read(path.join(SIB, 'src/api/vendor/core.js')));
const arm = strip(read(path.join(SIB, 'src/lib/vendor/postCards.js')));

cell('C1 the `posts` hub row opens: ROOM_HREFS carries it, the address is declared, and the page exists at that address', () => {
  const m = routes.match(/export const POSTS_HREF\s*=\s*'([^']+)'/);
  if (!m) return 'POSTS_HREF not declared';
  if (m[1] !== '/vendor/posts') return `POSTS_HREF is ${m[1]}`;
  // CE-45 FE-1 · LABELLED AMENDMENT: ROOM_HREFS and PREVIEW_KEYS MOVED to lib/solutions/routes.ts byte for byte (the read-first ruling)
  if (!/\bposts:\s*POSTS_HREF\b/.test(strip(read(path.join(ROOT, 'lib/solutions/routes.ts'))))) return 'ROOM_HREFS has no posts entry — the chip stays Coming';
  if (!page) return 'app/vendor/(shell)/posts/page.tsx absent — the href would 404';
});

cell('C2 ⇄ the screen calls the door dream-os mounts: /api/v2/vendor + /posts + /cards', () => {
  const p = routes.match(/export const POSTS_API_PATH\s*=\s*'([^']+)'/);
  if (!p || p[1] !== '/api/v2/vendor/posts') return `POSTS_API_PATH is ${p && p[1]}`;
  if (!/postCards:\s*\(\)\s*=>\s*`\$\{POSTS_API_PATH\}\/cards`/.test(routes)) return 'API.postCards is not POSTS_API_PATH/cards';
  if (!/router\.use\('\/posts',\s*require\('\.\/posts'\)\)/.test(core)) return 'dream-os core.js does not mount /posts';
  if (!/router\.get\('\/cards'/.test(door)) return 'dream-os posts.js has no GET /cards';
  if (!/API\.postCards\(\)/.test(page)) return 'the page does not call API.postCards()';
});

cell('C3 ⇄ the page renders body.error for EXACTLY the arm-written refusals, the generic byte for anything else', () => {
  const s = page.match(/ARM_REFUSALS = new Set\(\[([^\]]*)\]\)/);
  if (!s) return 'ARM_REFUSALS not found';
  const mine = s[1].match(/'([a-z_]+)'/g).map((x) => x.slice(1, -1)).sort().join(',');
  // 4b-2: the door file now holds TWO status maps; the CARDS refusals are STATUS_FOR's, read from its own block.
  const block = (door.match(/const STATUS_FOR = Object\.freeze\(\{([\s\S]*?)\}\)/) || [])[1] || '';
  const theirs = [...block.matchAll(/([a-z_]+):\s*(\d{3})/g)].filter((m) => Number(m[2]) < 500).map((m) => m[1]).sort().join(',');
  if (mine !== theirs) return `page renders [${mine}] as the arm's words; the door's 4xx codes are [${theirs}]`;
  if (!/COPY\.surfaceUnavailable/.test(page)) return 'no generic byte for a 5xx or a network failure';
});

cell('C4 F-42.193 — no switchboard key, and no cap.reason(), reaches vendor glass from this room', () => {
  const hits = page.match(/template\.|perm\.|switchboard|cap\.reason|reason\(/gi);
  if (hits) return `found ${[...new Set(hits)].join(', ')}`;
  if (!/notOnYet:\s*'Not switched on yet\.'/.test(copyHome)) return 'the vetoed dark byte is not in the copy home';
});

cell('C5 every vendor-facing byte on the page comes from the copy home — no literal text between tags', () => {
  // AMENDED BY LABEL (R-41.121, CE-42 4b-3b seat R6): the scan runs over
  // everything after the page's first `return (`, which now includes SIBLING
  // COMPONENT CODE — and the arrow token `=>` is not a JSX tag close, so
  // `=> setBusy(false)); }` read as literal text between tags. The cell's
  // MEANING is unchanged (no vendor-facing byte typed into JSX); the arrows are
  // blanked before the match so the cell measures markup and not JavaScript.
  const jsx = page.slice(page.indexOf('return (')).replace(/=>/g, '==');
  const literal = jsx.replace(/<style>[\s\S]*?<\/style>/, '').match(/>\s*[A-Za-z][^<{]*</g);
  if (literal) return `literal text in JSX: ${literal.slice(0, 3).join(' | ')}`;
  if (/'Posts & ads'|"Posts & ads"/.test(page)) return 'the title is typed on the page instead of read from ROOM_ROWS';
  if (!/ROOM_ROWS\.find\(\(r\) => r\.key === 'posts'\)/.test(page)) return 'the title is not read from ROOM_ROWS by key';
});

cell('C6 the copy home carries the vetoed bytes verbatim (4b sheet + frame veto)', () => {
  const want = {
    sectionCards: 'Cards', sectionBroadcast: 'Broadcast', sectionSunday: 'Sunday',
    ledeCards: 'Cards made from your last wedding page.',
    ledeBroadcast: 'Send one message to your past couples.',
    ledeSunday: 'Every Sunday: your week on Instagram.',
    caption: 'Caption', download: 'Download', share: 'Share', copyCaption: 'Copy caption',
    notOnYet: 'Not switched on yet.',
    sundayPending: 'This opens once Instagram approves our access.',
  };
  for (const [k, v] of Object.entries(want)) {
    const m = copyHome.match(new RegExp(`\\b${k}:\\s*'([^']*)'`));
    if (!m) return `${k} missing`;
    if (m[1] !== v) return `${k} is "${m[1]}", vetoed "${v}"`;
  }
});

cell('C7 ⇄ the three kinds render in the arm\'s own order (KIND_ORDER)', () => {
  const mine = [...copyHome.matchAll(/\{ key: '([a-z]+)',\s*label: '([A-Za-z]+)' \}/g)].map((m) => m[1]).join(',');
  const theirs = (arm.match(/KIND_ORDER = Object\.freeze\(\[([^\]]*)\]\)/) || [])[1];
  const t = theirs ? theirs.match(/'([a-z]+)'/g).map((x) => x.slice(1, -1)).join(',') : '';
  if (mine !== 'post,status,story' || mine !== t) return `pwa [${mine}] vs arm [${t}]`;
});

cell('C8 4b-3b: Broadcast calls its door and Sunday calls its own; the pending byte still has a home (AMENDED BY LABEL, R-41.121 — the cell said "4b-3 is its packet" and this is that packet)', () => {
  if (!/API\.postBroadcast\(\)/.test(page)) return 'the Broadcast section does not call API.postBroadcast()';
  // The clause below read "a Sunday/insights address was declared ahead of 4b-3".
  // 4b-3b declares it BY RULING; what the cell was guarding — a room wired before
  // its packet — is now spelled as: the address exists AND the page reads it.
  if (!/postSunday:/.test(routes)) return 'the Sunday address is not declared';
  if (!/API\.postSunday\(\)/.test(page)) return 'the page does not call the Sunday door';
  // 4b-3a moved the Sunday section to components/worklist/SundaySection.tsx (a page may export only the page).
  const sunday = fs.existsSync(path.join(ROOT, 'components/worklist/SundaySection.tsx')) ? strip(read(path.join(ROOT, 'components/worklist/SundaySection.tsx'))) : '';
  if (!/PO\.sundayPending/.test(page + sunday)) return 'the Sunday pending state is not drawn';
});

cell('C9 4b-2 · every broadcast refusal is a CODE mapped to a vetoed byte — dark reads "Not switched on yet.", never the door\'s text', () => {
  const fn = (page.match(/function refusalLine[\s\S]*?\n  \}/) || [''])[0];
  if (!/code === 'dark'\) return PO\.notOnYet/.test(fn)) return 'dark is not mapped to PO.notOnYet';
  if (/return error;/.test(fn) && !/code === 'no_address' && error\) return error;/.test(fn)) return 'a door string other than no_address reaches the glass';
  if (!/COPY\.surfaceUnavailable/.test(fn)) return 'no generic byte for an unmapped code';
});

cell('C10 4b-2 · the fee is formatRs over the door\'s whole paise, with the figure never split (no-break space)', () => {
  if (!/formatRs\(pv\.fee_paise \/ 100\)\.replace\(' ', '\\u00a0'\)/.test(page)) return 'the fee is not formatRs(fee_paise / 100) with a no-break space';
  if (/86\.31|\b18\b\s*%|1\.18/.test(page)) return 'a rate literal is on the page';
});

cell('C11 4b-2 · the broadcast copy carries the vetoed bytes verbatim', () => {
  const fns = {
    couplesCount: /couplesCount = \(n: number\) => `\$\{n\} couples`/,
    feeLine: /feeLine = \(rs: string\) => `Meta charges up to \$\{rs\} for this send\.`/,
    sendTo: /sendTo = \(n: number\) => `Send to \$\{n\}`/,
    confirmLine: /confirmLine = \(n: number, rs: string\) => `Send to \$\{n\} couples\? Meta charges up to \$\{rs\}\.`/,
    sentLine: /sentLine = \(n: number, m: number\) => `Sent to \$\{n\}\. \$\{m\} not delivered\.`/,
    referralNextLine: /referralNextLine = \(iso: string\) => `Your referral message goes once a year\. Next: \$\{fullDate\(iso\)\}\.`/,
  };
  for (const [k, re] of Object.entries(fns)) if (!re.test(copyHome)) return `${k} is not the vetoed byte`;
  if (!/referralLabel:\s*'Referral message'/.test(copyHome) || !/noCouples:\s*'No past couples with a number yet\.'/.test(copyHome)) return 'a label/empty byte drifted';
  if (!/month: 'long'/.test(copyHome)) return 'the next date is not a full month (F-42.112)';
});

cell('C12 F-42.170 · formatRs\'s paise arm, driven through the REAL lib/vendor/format.ts (transpiled, not copied)', () => {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const load = (rel, deps) => {
    const src = read(path.join(ROOT, rel));
    const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
    const mod = { exports: {} };
    new Function('require', 'module', 'exports', js)((id) => { if (deps[id]) return deps[id]; throw new Error('unexpected import ' + id); }, mod, mod.exports);
    return mod.exports;
  };
  const tokens = load('lib/vendor/tokens.ts', {});
  const { formatRs } = load('lib/vendor/format.ts', { './tokens': tokens });
  const want = [[6.12, 'Rs 6.12'], [6.1, 'Rs 6.10'], [1.02, 'Rs 1.02'], [125000, 'Rs 1,25,000'], ['125000', 'Rs 1,25,000'], [1234.5, 'Rs 1,234.50'], [0, 'Rs 0']];
  for (const [v, w] of want) { const got = formatRs(v); if (got !== w) return `formatRs(${JSON.stringify(v)}) = "${got}", ruled "${w}"`; }
});

console.log(`\nb74 · ${pass} GREEN · ${reds.length} RED${reds.length ? ' — ' + reds.join(' | ') : ''}`);
process.exit(reds.length ? 1 : 0);
