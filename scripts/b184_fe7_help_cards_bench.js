#!/usr/bin/env node
'use strict';
// scripts/b184_fe7_help_cards_bench.js · TDW CE-47 · L4 (FE-7) · the "?" card of every L4 room in the shell (nine;
// Onboarding has none, C3), as the standing rules say: one "?" per page on the room head; at most three how-to
// lines; nothing clipped or scrolling inside the card at 360 and 374; the controls it names are on the screen; no
// "couple".
//
// §2 ON GLASS, dark, at 360 and 374, for each room: exactly one "?" on the room head (the search row's own "?" is
//    FE-5's to retire and is not counted here); the card opens; at most three how-to lines; the card's content fits
//    (scrollHeight within clientHeight); every control the card names is drawn on the room's screen; no "couple".
// §8 MUTATIONS: M1 a fourth how-to line added to Wedding pages' card (2.x red); M2 "couple" planted in Referrals'
//    card (2.x red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate  --widths=360,374
const K = require('./lib/fe7_l4_kit.js');
const HELP = 'v2/lib/worklist/pageHelp.ts';
const WIDTHS = ((process.argv.find((a) => a.startsWith('--widths=')) || '--widths=360,374').split('=')[1]).split(',').map(Number);
// Each room, and the controls its card names that must be drawn on its screen.
const ROOMS = [
  { name: 'Open dates & rates', url: '/vendor/dates', names: ['Date checks on your page', 'Offer your open dates', 'Suggested rates'] },
  { name: 'Introductions', url: '/vendor/introductions', names: ['New introduction'] },
  { name: 'Influencer exchange', url: '/vendor/exchange', names: ['Aanya Mehra', 'Your requests'] },
  { name: 'Wedding pages', url: '/vendor/wedding-pages', names: ['New wedding page', 'Meera and Kunal'] },
  { name: 'Google reviews', url: '/vendor/google-reviews', names: ['Asked', 'Claim and sync your listing'] },
  { name: 'Advisor', url: '/vendor/advisor', names: ['Ask anything'] },
  { name: 'Business Solutions', url: '/vendor/support', names: ['Something broken?'] },
  { name: 'Referrals & partners', url: '/vendor/referrals', names: ['Post a shoot', 'Your peers'] },
  { name: 'Notes', url: '/vendor/notes', names: ['New note', 'Search your notes'] },
];
async function card(g, room, width) {
  const p = await K.open(g, room.url, { width, wait: '.wl-roomhead .wl-helpq', settle: 1400 });
  const r = {};
  r.q = await p.evaluate(() => document.querySelectorAll('.wl-roomhead .wl-helpq').length);
  r.screen = await p.evaluate(() => { const out = []; for (const e of document.querySelectorAll('.wl-main button, .wl-main a, .wl-main .fr-t, .wl-main .fr-h, .wl-main h2, .wl-main input, .wl-main textarea, .wl input, .wl textarea')) { if (e.offsetParent === null && getComputedStyle(e).position !== 'fixed') continue; out.push((e.textContent || '').trim(), e.getAttribute('placeholder') || '', e.getAttribute('aria-label') || ''); } return out.filter(Boolean); });
  await K.tap(p, '@.wl-roomhead .wl-helpq'); await K.waitFor(p, '.wl-helpcard', 5000);   // e-275: the card itself
  r.card = await p.evaluate(() => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; return { lines: c.querySelectorAll('.wl-helpdo li').length, fits: c.scrollHeight <= c.clientHeight + 1, text: c.innerText }; });
  await p.close(); return r;
}
const green = (r, room) => r.q === 1 && r.card && r.card.lines <= 3 && r.card.fits && room.names.every((n) => r.screen.some((s) => s.includes(n))) && !/\bcouples?\b/i.test(r.card.text);

K.runBench({
  tag: 'b184', port: Number(process.env.B184_PORT || 4184), urls: ROOMS.map((r) => r.url),
  source(ok, sec) {
    sec('1 THE SOURCE');
    const c = K.code(HELP);
    const mine = ['DATES_HREF', 'INTRODUCTIONS_HREF', 'EXCHANGE_HREF', 'WEDDING_PAGES_HREF', 'GOOGLE_REVIEWS_HREF', 'SOLUTIONS_INDEX_HREF', 'REFERRALS_HREF', "roomHref('advisor')", "roomHref('notes')"]
      .map((k) => { const i = c.indexOf(`[${k}]: entry(`); return i < 0 ? `MISSING ${k}` : c.slice(i, c.indexOf('}),', i) + 3); });
    const notesWhat = (K.code('v2/lib/worklist/copy.ts').match(/^\s+notes:\s+'([^']*)'/m) || [])[1] || '';
    ok(!mine.some((e) => e.startsWith('MISSING')) && !mine.concat(notesWhat).some((e) => /\bcouples?\b/i.test(e)), '1.1 no "couple" in any of my rooms\' cards (Notes\' opening line included)', mine.filter((e) => /\bcouples?\b|MISSING/i.test(e)).map((e) => e.slice(0, 60)).join(' | ') || notesWhat);
  },
  async glass(g, ok, sec) {
    for (const w of WIDTHS) {
      sec(`2 THE CARDS AT ${w}`);
      for (const room of ROOMS) {
        const r = await card(g, room, w);
        ok(r.q === 1, `2 ${room.name} at ${w}: one "?" on the room head`, r.q);
        ok(r.card && r.card.lines <= 3 && r.card.fits, `2 ${room.name} at ${w}: the card, at most three how-to lines, nothing clipped`, r.card ? `${r.card.lines} lines, fits=${r.card.fits}` : 'no card');
        const missing = room.names.filter((n) => !r.screen.some((s) => s.includes(n)));
        ok(missing.length === 0, `2 ${room.name} at ${w}: the controls the card names are on the screen`, missing.join(', '));
        ok(r.card && !/\bcouples?\b/i.test(r.card.text), `2 ${room.name} at ${w}: no "couple" in the card`);
      }
    }
  },
  mutations: [
    { name: 'M1 a fourth how-to line in Wedding pages\' card', rel: HELP, from: "The page goes live when they agree.']),", to: "The page goes live when they agree.'],\n             ['share', 'On a live page: tap Make the cards.']),", glass: true,
      cell: async (g) => green(await card(g, ROOMS[3], 374), ROOMS[3]) },
    { name: 'M2 "couple" planted in Referrals\' card (its line, ROW_DESC.referrals)', rel: 'v2/lib/solutions/copy.ts', from: "  referrals:     'Enquiries passed to peers, and received from them',", to: "  referrals:     'Couples and enquiries passed to peers, and received from them',", glass: true,
      cell: async (g) => green(await card(g, ROOMS[7], 374), ROOMS[7]) },
  ],
});
