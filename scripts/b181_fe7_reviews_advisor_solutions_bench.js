#!/usr/bin/env node
'use strict';
// scripts/b181_fe7_reviews_advisor_solutions_bench.js · TDW CE-47 · L4 (FE-7) · Google reviews, Advisor and Business
// Solutions, as approved (veto rows 23 to 28, 38 to 44; A2; C1).
//
// §1 THE SOURCE: Google reviews reads GR for its reworked words and has a full-month table; the two A2 row lines
//    live in their home (v2/lib/solutions/copy.ts ROW_DESC), not in the page; Business Solutions no longer draws
//    the "Coming" chip (PREVIEW_KEYS kept, unread by the hub, C1); Advisor draws no chip and keeps no dead style.
// §2 GOOGLE REVIEWS on glass (374, dark): the room's line; Asked · 2 with "Asked 3 September 2026"; the seal as a
//    row with "On your page"; "Claim and sync your listing", "From 27 October 2026", "Coming soon"; nothing asked
//    yet reads the client line; no "couple" in either state.
// §3 ADVISOR: no chip under the title; the line is there.
// §4 BUSINESS SOLUTIONS: Work together first; every row has its icon and a chevron, and no "Coming" and no "Open"
//    chip; the A2 lines; "Help" over "Something broken?" / "Message us on WhatsApp"; a row opens its room.
// §8 MUTATIONS: M1 the Introductions row line back to "Couples introduced, in both directions" (4.3 red); M2
//    "couple" planted in nothing-asked-yet (2.5 red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
const GRP = 'v2/app/vendor/(shell)/google-reviews/page.tsx';
const SUP = 'v2/app/vendor/(shell)/support/page.tsx';
const ADV = 'v2/app/vendor/(shell)/advisor/page.tsx';
const rowsOf = (p) => p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((r) => ({ t: (r.querySelector('.fr-t') || {}).textContent, f: (r.querySelector('.fr-f') || {}).textContent, pill: (r.querySelector('.fr-pill') || {}).textContent || null, icon: !!r.querySelector('.fr-icon svg'), chev: !!r.querySelector('.fr-chev') })));
const heads = (p) => p.evaluate(() => [...document.querySelectorAll('.fr-h')].map((h) => h.textContent.trim()));
async function reviews(g, scen) { const p = await K.open(g, '/vendor/google-reviews', { wait: scen && scen.grEmpty ? '.fr-empty' : '.fr-row .fr-f', scen }); const r = { rows: await rowsOf(p), heads: await heads(p), ws: await K.words(p) }; await p.close(); return r; }
async function hub(g, follow) {
  const p = await K.open(g, '/vendor/support', { wait: '.fr-row .fr-f' });
  const r = { rows: await rowsOf(p), heads: await heads(p), ws: await K.words(p) };
  if (follow) { await K.tap(p, 'Wedding pages'); await new Promise((q) => setTimeout(q, 1500)); r.went = p.url(); }
  await p.close(); return r;
}

K.runBench({
  tag: 'b181', port: Number(process.env.B181_PORT || 4181), urls: ['/vendor/google-reviews', '/vendor/advisor', '/vendor/support', '/vendor/wedding-pages'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const gr = K.code(GRP); const sp = K.code(SUP); const ad = K.read(ADV);
    ok(['lede', 'askedEmpty', 'listingRow', 'listingFromDate', 'comingSoon'].every((k) => new RegExp(`GR\\.${k}\\b`).test(gr)) && /'September'/.test(gr), '1.1 Google reviews reads GR for its reworked words, and dates carry full months');
    const home = K.code('v2/lib/solutions/copy.ts');
    ok(/introductions:\s*'Pages sent once to people met in person'/.test(home) && /dates:\s*'Date checks, and offers to fill open dates'/.test(home) && !/FE7_DESC|Pages sent once/.test(sp), '1.2 the A2 row lines live in ROW_DESC, not in the page');
    ok(!/CHIPS\.coming|RoomRow\b/.test(sp) && /import \{ ROOM_HREFS, PREVIEW_KEYS \}/.test(sp), '1.3 the hub draws no "Coming" chip (PREVIEW_KEYS kept and unread, C1)');
    ok(!/wl-advchip/.test(ad), '1.4 Advisor draws no chip and keeps no dead style');
  },
  async glass(g, ok, sec) {
    sec('2 GOOGLE REVIEWS');
    const R = await reviews(g);
    ok(R.ws.includes('Google review requests sent after each published wedding page, and your seal.'), '2.1 the room\'s line');
    ok(R.heads[0] === 'Asked · 2' && R.rows[0] && R.rows[0].f === 'Asked 3 September 2026', '2.2 Asked · 2, "Asked 3 September 2026"', `${R.heads[0]} / ${R.rows[0] && R.rows[0].f}`);
    const seal = R.rows.find((r) => r.t === 'TDW-verified'); const lst = R.rows.find((r) => r.t === 'Claim and sync your listing');
    ok(seal && seal.pill === 'On your page', '2.3 the seal as a row, "On your page"', JSON.stringify(seal));
    ok(lst && lst.f === 'From 27 October 2026' && lst.pill === 'Coming soon', '2.4 "Claim and sync your listing", "From 27 October 2026", "Coming soon"', JSON.stringify(lst));
    const E = await reviews(g, { grEmpty: true });
    ok(E.ws.includes('When you publish a wedding page, we ask the client for a Google review. Once, and never again.') && K.noCouple(E.ws) && K.noCouple(R.ws), '2.5 nothing asked yet reads the client line; no "couple" in either state');
    sec('3 ADVISOR');
    const p = await K.open(g, '/vendor/advisor', { wait: '.wl-advbody' });
    const adv = { chip: await p.evaluate(() => !!document.querySelector('.wl-advchip')), ws: await K.words(p) }; await p.close();
    ok(!adv.chip && adv.ws.includes('Ask about pricing, positioning or a decision you are weighing.'), '3.1 no chip; the line is there');
    sec('4 BUSINESS SOLUTIONS');
    const H = await hub(g, true);
    ok(H.heads[0] === 'Work together' && H.heads.includes('Help'), '4.1 Work together first; Help last', H.heads.join('|'));
    const rooms = H.rows.filter((r) => r.t !== 'Something broken?');
    ok(rooms.length >= 10 && rooms.every((r) => r.icon && r.chev && !r.pill), '4.2 every row has its icon and a chevron, and no chip', rooms.filter((r) => !(r.icon && r.chev && !r.pill)).map((r) => r.t).join(', '));
    const intro = H.rows.find((r) => r.t === 'Introductions'); const dts = H.rows.find((r) => r.t === 'Open dates & rates');
    ok(intro && intro.f === 'Pages sent once to people met in person' && dts && dts.f === 'Date checks, and offers to fill open dates', '4.3 the A2 lines', `${intro && intro.f} / ${dts && dts.f}`);
    const help = H.rows.find((r) => r.t === 'Something broken?');
    ok(help && help.f === 'Message us on WhatsApp' && help.chev, '4.4 "Something broken?" / "Message us on WhatsApp"');
    ok(/\/vendor\/wedding-pages/.test(H.went || ''), '4.5 a row opens its room', H.went);
    ok(K.noCouple(H.ws), '4.6 no "couple"');
  },
  mutations: [
    { name: 'M1 the Introductions line back to "Couples introduced, in both directions"', rel: 'v2/lib/solutions/copy.ts', from: "introductions: 'Pages sent once to people met in person',", to: "introductions: 'Couples introduced, in both directions',", glass: true,
      cell: async (g) => { const H = await hub(g, false); const i = H.rows.find((r) => r.t === 'Introductions'); return i && i.f === 'Pages sent once to people met in person'; } },
    { name: 'M2 "couple" planted in nothing-asked-yet', rel: 'v2/lib/worklist/googleReviews.ts', from: 'we ask the client for a Google review', to: 'we ask the couple for a Google review', glass: true,
      cell: async (g) => { const E = await reviews(g, { grEmpty: true }); return K.noCouple(E.ws); } },
  ],
});
