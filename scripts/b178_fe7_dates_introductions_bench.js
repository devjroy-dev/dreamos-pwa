#!/usr/bin/env node
'use strict';
// scripts/b178_fe7_dates_introductions_bench.js · TDW CE-47 · L4 (FE-7) · Open dates & rates and Introductions, as
// approved (veto rows 1 to 7) and as the sprint's standing rules say.
//
// §1 THE SOURCE: no word typed in either page (their rows and sheet read DATES and IN); the pill is FE-5's name and
//    props (RoomHeadAdd, { addKey, label, onAdd }); dates go through dayInWords (full months).
// §2 OPEN DATES & RATES on glass (374, dark): one group of three rows; "Date checks on your page" opens Storefront;
//    the other two read "Coming soon" (R-46.14) and nothing else in the room is a control; the old "Coming", "What
//    this will do" and "Suggest rates" are gone; no "couple".
// §3 INTRODUCTIONS on glass: the pill reads "+ New introduction", draws 36 high and carries data-tap44; Sent lists
//    three rows with full months ("8 September 2026") and their states; the pill opens the sheet "New introduction"
//    with the three fields; Review the message shows what they will receive and "Send to Anita Verma", and the
//    staged request carried the three fields; nothing was sent before Send; no "couple".
// §8 MUTATIONS: M1 "Coming soon" shortened to "Coming" in its home (2.3 red); M2 the row date read raw, not in
//    words (3.2 red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
const DATES_PAGE = 'v2/app/vendor/(shell)/dates/page.tsx';
const INTRO_PAGE = 'v2/app/vendor/(shell)/introductions/page.tsx';

async function datesRoom(g) {
  const p = await K.open(g, '/vendor/dates', { wait: '.fr-row' });
  const rows = await p.evaluate(() => [...document.querySelectorAll('.fr-group .fr-row')].map((r) => ({ t: (r.querySelector('.fr-t') || {}).textContent, pill: (r.querySelector('.fr-pill') || {}).textContent || null, tap: r.tagName === 'BUTTON' })));
  const ws = await K.words(p);
  await K.tap(p, 'Date checks on your page');
  await new Promise((r) => setTimeout(r, 1500));
  const went = p.url();
  await p.close();
  return { rows, ws, went };
}
async function introRoom(g) {
  const p = await K.open(g, '/vendor/introductions', { wait: '.fr-row .fr-f' });
  const pill = await p.evaluate(() => { const b = document.querySelector('[data-add-key="introduction"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { text: b.textContent.trim(), h: Math.round(r.height), tap44: b.hasAttribute('data-tap44') }; });
  const rows = await p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((r) => ({ t: (r.querySelector('.fr-t') || {}).textContent, f: (r.querySelector('.fr-f') || {}).textContent, pill: (r.querySelector('.fr-pill') || {}).textContent })));
  const ws = await K.words(p);
  await K.tap(p, '@[data-add-key="introduction"]');
  const sheetWords = await K.words(p, 'body');
  const fields = await p.evaluate(() => ['#itr-phone', '#itr-name', '#itr-where'].every((s) => !!document.querySelector(s)));
  if (fields) { await p.type('#itr-phone', '+91 98111 04417'); await p.type('#itr-name', 'Anita Verma'); await p.type('#itr-where', 'the Verma wedding'); }
  const sentBefore = p.posted.length;
  await K.tap(p, 'Review the message'); await new Promise((r) => setTimeout(r, 1200));
  const preview = await K.words(p, 'body');
  const staged = p.posted.find((x) => x.route === '/api/v2/vendor/introductions');
  await p.close();
  return { pill, rows, ws, sheetWords, fields, sentBefore, preview, staged };
}

K.runBench({
  tag: 'b178', port: Number(process.env.B178_PORT || 4178), urls: ['/vendor/dates', '/vendor/introductions', '/vendor/storefront'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const d = K.code(DATES_PAGE); const i = K.code(INTRO_PAGE);
    ok(!/<Row title="|facts="[A-Z]|text: '[A-Z]/.test(d), '1.1 Open dates & rates types no word of its own (its rows read DATES_ROWS)');
    ok(/DATES_ROWS\.rowChecks/.test(d) && /DATES_ROWS\.rowOffer/.test(d) && /DATES_ROWS\.rowRates/.test(d) && /DATES_ROWS\.comingSoon/.test(d), '1.2 the three rows and Coming soon read their home');
    ok(!/>New introduction</.test(i) && /IN\.newIntro/.test(i) && /IN\.addPill/.test(i) && /IN\.metAt\(/.test(i), '1.3 Introductions types no word of its own (IN.newIntro, IN.addPill, IN.metAt)');
    ok(/<RoomHeadAdd addKey="introduction" label=\{IN\.addPill\} onAdd=\{/.test(i), '1.4 the pill is RoomHeadAdd with FE-5\'s props { addKey, label, onAdd }');
    ok(/dayInWords\(r\.sent_at \|\| r\.created_at\)/.test(i) && !/'January'/.test(i), '1.5 row dates go through dayInWords (no month table of its own)');
  },
  async glass(g, ok, sec) {
    sec('2 OPEN DATES & RATES');
    const D = await datesRoom(g);
    ok(D.rows.length === 3, '2.1 one group of three rows', D.rows.length);
    ok(D.rows[0] && D.rows[0].t === 'Date checks on your page' && D.rows[0].tap && !D.rows[0].pill, '2.2 "Date checks on your page" is the one control, with no pill', JSON.stringify(D.rows[0]));
    ok(D.rows.slice(1).map((r) => r.pill).join('|') === 'Coming soon|Coming soon' && D.rows.slice(1).every((r) => !r.tap), '2.3 the other two read "Coming soon" and are not controls (R-46.14)', JSON.stringify(D.rows.slice(1)));
    ok(Array.isArray(D.ws) && !D.ws.some((w) => /^Coming$|What this will do|Suggest rates/.test(w)), '2.4 the old kicker, "What this will do" and "Suggest rates" are gone');
    ok(/\/vendor\/storefront/.test(D.went), '2.5 "Date checks on your page" opens Storefront', D.went);
    ok(K.noCouple(D.ws), '2.6 no "couple" in the room');
    sec('3 INTRODUCTIONS');
    const I = await introRoom(g);
    ok(I.pill && I.pill.text === '+ New introduction' && I.pill.h === 36 && I.pill.tap44, '3.1 the pill: "+ New introduction", 36 high, data-tap44', JSON.stringify(I.pill));
    ok(I.rows.length === 3 && I.rows[0].f === 'Met at the Verma wedding · 8 September 2026', '3.2 Sent: three rows, "Met at ..." and the date with its full month', JSON.stringify(I.rows[0]));
    ok(I.rows.map((r) => r.pill).join('|') === 'Delivered|Sent|Not delivered', '3.3 each row states Delivered, Sent or Not delivered', I.rows.map((r) => r.pill).join('|'));
    ok(Array.isArray(I.sheetWords) && I.sheetWords.includes('New introduction') && I.fields, '3.4 the pill opens the sheet "New introduction" with the three fields');
    ok(I.sentBefore === 0, '3.5 nothing was sent before Review the message', I.sentBefore);
    ok(I.staged && I.staged.body && /9811104417|98111 04417/.test(JSON.stringify(I.staged.body)) && /Anita Verma/.test(JSON.stringify(I.staged.body)) && /Verma wedding/.test(JSON.stringify(I.staged.body)), '3.6 the staged request carried the number, the name and where you met', JSON.stringify(I.staged && I.staged.body));
    ok(Array.isArray(I.preview) && I.preview.includes('Send to Anita Verma') && I.preview.some((w) => /^Hi Anita Verma/.test(w)), '3.7 the preview shows what they will receive, and "Send to Anita Verma"');
    ok(K.noCouple(I.ws) && K.noCouple(I.preview), '3.8 no "couple" in the room or the sheet');
  },
  mutations: [
    { name: 'M1 "Coming soon" shortened to "Coming" in its home', rel: 'lib/worklist/openDates.ts', from: "  comingSoon: 'Coming soon',                         // R-46.14", to: "  comingSoon: 'Coming',", glass: true,
      cell: async (g) => { const D = await datesRoom(g); return D.rows.slice(1).map((r) => r.pill).join('|') === 'Coming soon|Coming soon'; } },
    { name: 'M2 the row date read raw, not in words', rel: INTRO_PAGE, from: 'dayInWords(r.sent_at || r.created_at)', to: "String(r.sent_at || r.created_at || '').slice(0, 10)", glass: true,
      cell: async (g) => { const I = await introRoom(g); return I.rows[0] && I.rows[0].f === 'Met at the Verma wedding · 8 September 2026'; } },
  ],
});
