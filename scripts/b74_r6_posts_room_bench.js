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
  if (!/\bposts:\s*POSTS_HREF\b/.test(hub)) return 'ROOM_HREFS has no posts entry — the chip stays Coming';
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
  const theirs = [...door.matchAll(/^\s*([a-z_]+):\s*(\d{3}),/gm)].filter((m) => Number(m[2]) < 500).map((m) => m[1]).sort().join(',');
  if (mine !== theirs) return `page renders [${mine}] as the arm's words; the door's 4xx codes are [${theirs}]`;
  if (!/COPY\.surfaceUnavailable/.test(page)) return 'no generic byte for a 5xx or a network failure';
});

cell('C4 F-42.193 — no switchboard key, and no cap.reason(), reaches vendor glass from this room', () => {
  const hits = page.match(/template\.|perm\.|switchboard|cap\.reason|reason\(/gi);
  if (hits) return `found ${[...new Set(hits)].join(', ')}`;
  if (!/notOnYet:\s*'Not switched on yet\.'/.test(copyHome)) return 'the vetoed dark byte is not in the copy home';
});

cell('C5 every vendor-facing byte on the page comes from the copy home — no literal text between tags', () => {
  const jsx = page.slice(page.indexOf('return ('));
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

cell('C8 Broadcast and Sunday render their pending state ONLY at 4b-1 — neither calls a door yet', () => {
  if (/broadcast|sunday|insights/i.test(routes.replace(/POSTS_API_PATH/g, ''))) return 'a broadcast/Sunday address was declared ahead of its packet';
  if (!/PO\.notOnYet/.test(page) || !/PO\.sundayPending/.test(page)) return 'a pending state is not drawn';
});

console.log(`\nb74 · ${pass} GREEN · ${reds.length} RED${reds.length ? ' — ' + reds.join(' | ') : ''}`);
process.exit(reds.length ? 1 : 0);
