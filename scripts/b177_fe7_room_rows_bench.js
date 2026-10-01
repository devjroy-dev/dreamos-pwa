#!/usr/bin/env node
'use strict';
// scripts/b177_fe7_room_rows_bench.js · TDW CE-47 · L4 (FE-7) · RoomRows, the ONE shared row piece, and the
// two-line cap MEASURED on glass (the sprint's rule 5: "list rows at most two fact lines MEASURED at 360 and 374").
//
// §1 THE SOURCE: v2/components/worklist/RoomRows.tsx exports Body, Head, Group, Row, Pill and FR_CSS; FR_CSS names no
//    colour of its own (no hex, rgb or hsl: tokens only); the facts clamp at two lines; no second row component sits
//    beside it (no Fe7Rows, no scratch piece); every L4 room with rows imports it.
// §2 ON GLASS, next dev in mock mode, the real faces, dark: every L4 room that draws rows, at 360 and at 374. For
//    every row: its facts draw at most two lines AND nothing is clipped (a clamp hiding a third line is a red, not a
//    pass); every room draws at least one row (an empty page proves nothing).
// §3 MUTATIONS, each planted in production source and restored by sha: M1 the clamp raised to three (1.3); M2 a
//    fact long enough to need a third line at 360, planted in Referrals' exchange row (2.x, on glass).
// §4 NOTHING LEFT: the server's group and chromium's tree are gone and the port is free.
// THE EXIT CODE IS THE VERDICT (0 green, 1 red). --widths=360,374  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
const T = K.tally('b177');
const { ok, sec } = T;
const PORT = Number(process.env.B177_PORT || 4177);
const WIDTHS = ((process.argv.find((a) => a.startsWith('--widths=')) || '--widths=360,374').split('=')[1]).split(',').map(Number);
const ROWS = 'v2/components/worklist/RoomRows.tsx';

// Every L4 room that draws rows, with the state that fills them.
const ROOMS = [
  { name: 'Open dates & rates', url: '/vendor/dates' },
  { name: 'Introductions', url: '/vendor/introductions' },
  { name: 'Influencer exchange (sender)', url: '/vendor/exchange', scen: { xc: 'sender' } },
  { name: 'Influencer exchange (influencer)', url: '/vendor/exchange', scen: { xc: 'creator' } },
  { name: 'Wedding pages', url: '/vendor/wedding-pages' },
  { name: 'Google reviews', url: '/vendor/google-reviews' },
  { name: 'Business Solutions', url: '/vendor/support' },
  { name: 'Referrals & partners', url: '/vendor/referrals' },
  { name: 'Notes', url: '/vendor/notes' },
];
const ROOM_FILES = ['dates', 'introductions', 'exchange', 'wedding-pages', 'google-reviews', 'support', 'referrals'].map((r) => `v2/app/vendor/(shell)/${r}/page.tsx`).concat(['v2/components/vendor/NotesBody.tsx']);

function source(ok = T.ok, sec = T.sec) {
  sec('1 THE SOURCE');
  const raw = K.read(ROWS); const c = K.code(ROWS);
  ok(['Body', 'Head', 'Group', 'Row', 'Pill'].every((n) => new RegExp(`export function ${n}\\b`).test(c)) && /export const FR_CSS\b/.test(c), '1.1 RoomRows exports Body, Head, Group, Row, Pill and FR_CSS');
  const css = (raw.match(/export const FR_CSS = `([\s\S]*?)`;/) || [])[1] || '';
  ok(css.length > 200 && !/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(css), '1.2 FR_CSS names no colour of its own (tokens only)', css.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/)?.[0]);
  ok(/\.fr-f\{[^}]*-webkit-line-clamp:2[^}]*\}/.test(css), '1.3 a row\'s facts clamp at two lines');
  const fs = require('fs'); const path = require('path');
  ok(!fs.existsSync(path.join(K.ROOT, 'v2/components/worklist/Fe7Rows.tsx')), '1.4 no second row component (no Fe7Rows)');
  const miss = ROOM_FILES.filter((f) => !/@\/v2\/components\/worklist\/RoomRows'/.test(K.read(f)));
  ok(miss.length === 0, '1.5 every L4 room with rows imports RoomRows', miss.join(', '));
  return /\.fr-f\{[^}]*-webkit-line-clamp:2[^}]*\}/.test(css);
}

async function capOn(g, room, width) {
  const p = await K.open(g, room.url, { width, scen: room.scen, wait: '.fr-row .fr-f', settle: 1200 });
  const m = p.found ? await K.measureFacts(p) : null;
  await p.close();
  return m;
}
async function glass(g, only) {
  sec(`2 ON GLASS · the two-line cap, measured (${WIDTHS.join(' and ')})`);
  let allGreen = true;
  for (const room of ROOMS.filter((r) => !only || r.name === only)) {
    for (const w of WIDTHS) {
      const m = await capOn(g, room, w);
      const bad = (m || []).filter((x) => x.lines > 2 || x.clipped);
      const g1 = ok(Array.isArray(m) && m.length > 0, `2 ${room.name} at ${w}: the room drew its rows`, m === null ? 'the room did not draw' : `${m.length} rows`);
      const g2 = ok(Array.isArray(m) && bad.length === 0, `2 ${room.name} at ${w}: every row's facts in at most two lines, nothing clipped`, bad.map((b) => `${b.lines} lines${b.clipped ? ' clipped' : ''}: ${b.text}`).join(' | '));
      allGreen = allGreen && g1 && g2;
    }
  }
  return allGreen;
}

async function main() {
  const back = K.recovered();
  ok(true, `0.0 no interrupted mutation left in the tree${back ? ` (restored ${back} from the journal)` : ''}`);
  const srcGreen = source();
  const g = await K.startGlass(PORT);
  if (!g) { ok(false, '0.1 the dev server came up'); return end(); }
  await K.warm(g, ROOMS.map((r) => r.url));
  await glass(g);
  if (!process.argv.includes('--no-mutate')) {
    sec('3 MUTATIONS');
    await K.mutate(ok, 'M1 the clamp raised to three', ROWS, '-webkit-line-clamp:2', '-webkit-line-clamp:3', async () => source((c) => !!c, () => {}));
    const long = "exchangeLine: 'Influencers, and the requests you send them, with their cities, their ages, their audiences and every date you asked for',";
    const quiet = { ok: (c) => c, sec: () => {} };
    await K.mutate(ok, 'M2 a fact that needs a third line, in Referrals', 'v2/lib/worklist/referrals.ts', "exchangeLine: 'Influencers, and the requests you send them',", long, async () => {
      await new Promise((r) => setTimeout(r, 2500));   // the dev server's reload
      const m = await capOn(g, ROOMS.find((r) => r.name === 'Referrals & partners'), 360);
      void quiet; return Array.isArray(m) && m.every((x) => x.lines <= 2 && !x.clipped);
    });
  }
  void srcGreen;
  return end();
}
async function end() {
  sec('4 NOTHING LEFT');
  const portFree = await K.stopGlass();
  await new Promise((r) => setTimeout(r, 800));
  const left = K.leftovers();
  ok(portFree, `4.1 port ${PORT} is free`);
  ok(left.length === 0, '4.2 nothing this run started is still running', left.join(' | '));
  process.exit(T.verdict());
}
main().catch((e) => { ok(false, '0.2 the run did not crash', e && e.stack ? e.stack.split('\n').slice(0, 3).join(' / ') : e); end(); });
