#!/usr/bin/env node
'use strict';
// scripts/b185_fe7_expenses_bench.js · TDW CE-47 · L4b (FE-7) · Expenses to FE-6's approved frame (board 9, SPEC.md).
// §1 THE SOURCE: its own screen (no SliceScreen), the room's own data, form and door (useExpensesData, AddSheet
//    slice 'expenses', deleteExpense); the pill by FE-5's props; no category filter (SPEC item 10).
// §2 THE STANDING CHECKS at 374 and 360 (the kit's standing()): rows, the two-line cap, full months, no "couple",
//    44 px controls, one "?" whose card fits and whose named controls are drawn.
// §3 THE ROOM: "+ New expense" 36 high with data-tap44; the headline and "2 filed in September 2026"; the month
//    picker; rows with the amount at the right; the pill opens the Add expense sheet with the date in words under its
//    Date; an expense opens as a page, Delete LAST and ASKED, nothing sent on the first tap, one request on the second.
// §8 MUTATIONS: M1 Delete acts on one tap (3.5 red); M2 the pill's words back to "New expense" (3.1 red).
const K = require('./lib/fe7_l4_kit.js');
const F = 'v2/app/vendor/(shell)/expenses/body.tsx';
const ist = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 7);
async function room(g) {
  const p = await K.open(g, '/vendor/expenses', { wait: '.fr-row .fr-f' });
  const r = {};
  r.pill = await p.evaluate(() => { const b = document.querySelector('[data-add-key="expense"]'); return b ? { t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), tap: b.hasAttribute('data-tap44') } : null; });
  r.head = await p.evaluate(() => (document.querySelector('.fr-h') || {}).textContent || '');
  r.words = await K.words(p);
  r.rows = await p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((e) => ({ t: (e.querySelector('.fr-t') || {}).textContent, f: (e.querySelector('.fr-f') || {}).textContent, v: (e.querySelector('.fr-v') || {}).textContent })));
  await K.tap(p, '@[data-add-key="expense"]'); await new Promise((q) => setTimeout(q, 800));
  await K.tap(p, 'All details'); await new Promise((q) => setTimeout(q, 500));   // AddSheet keeps its Date under "All details"
  r.dateWords = await p.evaluate(() => [...document.querySelectorAll('[data-date-words]')].map((e) => e.textContent.trim()));
  await p.close();
  const q = await K.open(g, '/vendor/expenses', { wait: '.fr-row .fr-f' });
  await K.tap(q, 'Drone rental');
  r.page = await K.words(q, '.fr-room');
  r.last = await q.evaluate(() => { const bs = [...document.querySelectorAll('.fr-room button')].filter((b) => b.offsetParent); return bs.map((b) => b.textContent.trim()).slice(-2).join('|'); });
  const before = q.posted.length;
  await K.tap(q, '@.fr-quiet'); r.asked = await K.words(q, '.fr-room'); r.afterOne = q.posted.length - before;
  await K.tap(q, '@.ex-ask .rp-job.warn'); await new Promise((z) => setTimeout(z, 800)); r.afterTwo = q.posted.length - before;
  await q.close(); return r;
}
K.runBench({
  tag: 'b185', port: Number(process.env.B185_PORT || 4185), urls: ['/vendor/expenses'],
  source(ok, sec) {
    sec('1 THE SOURCE'); const c = K.code(F);
    ok(!/SliceScreen/.test(c) && /useExpensesData\(vendorId\)/.test(c) && /<AddSheet[^>]*slice="expenses"/.test(c) && /deleteExpense\(/.test(c), '1.1 its own screen, on the room\'s own data, form and delete door');
    ok(/<RoomHeadAdd addKey="expense" label=\{EXW\.addPill\} onAdd=\{/.test(c) && /addPill: '\+ New expense'/.test(c), '1.2 the pill by FE-5\'s props, "+ New expense"');
    ok(!/category ===|filterCategory|categoryFilter/.test(c), '1.3 no category filter (SPEC item 10)');
  },
  async glass(g, ok, sec) {
    sec('2 THE STANDING CHECKS'); await K.standing(g, ok, 'Expenses', '/vendor/expenses');
    sec('3 THE ROOM'); const r = await room(g);
    const monthHead = ist() === '2026-09' ? 'This month · Rs 46,500' : 'September 2026 · Rs 46,500';
    ok(r.pill && r.pill.t === '+ New expense' && r.pill.h === 36 && r.pill.tap, '3.1 "+ New expense", 36 high, data-tap44', JSON.stringify(r.pill));
    ok(r.head === monthHead && r.words.includes('2 filed in September 2026'), '3.2 the headline and "2 filed in September 2026"', `${r.head} / ${r.words.find((w) => /filed/.test(w))}`);
    ok(r.rows.length === 2 && r.rows[0].t === 'Drone rental' && r.rows[0].f === 'Equipment · 12 September 2026' && r.rows[0].v === 'Rs 18,000', '3.3 rows: what for, category and full date, the amount at the right', JSON.stringify(r.rows[0]));
    ok(r.dateWords.length >= 1 && r.dateWords.every((w) => /^([A-Z][a-z]+ )?\d{1,2} [A-Z][a-z]+ \d{4}$/.test(w)), '3.4 the Add expense sheet writes its Date in words', r.dateWords.join('|'));
    ok(r.page.includes('Edit') && /Delete$/.test(r.last) && r.asked.includes('Delete this expense?') && r.asked.includes('Keep it') && r.afterOne === 0, '3.5 an expense opens as a page; Delete is last and asks first; nothing sent on the first tap', `${r.last} / ${r.afterOne}`);
    ok(r.afterTwo === 1, '3.6 the second tap sends one request', r.afterTwo);
  },
  mutations: [
    { name: 'M1 Delete acts on one tap', rel: F, from: "<button type=\"button\" className=\"fr-quiet\" onClick={() => setAsking(true)}>{EXW.delete}</button>", to: "<button type=\"button\" className=\"fr-quiet\" onClick={() => void remove(open)}>{EXW.delete}</button>", glass: true,
      cell: async (g) => { const r = await room(g); return r.asked.includes('Delete this expense?') && r.afterOne === 0; } },
    // AMENDED BY LABEL (CE-47, FE-8): FE-5's head pill draws the sign itself, so dropping the "+" from the words no longer
    // changes the glass; the mutation now changes the words ("+ New cost") and 3.1 goes red as before.
    { name: 'M2 the pill\'s words changed to "New cost"', rel: F, from: "addPill: '+ New expense',", to: "addPill: '+ New cost',", glass: true,
      cell: async (g) => { const r = await room(g); return r.pill && r.pill.t === '+ New expense'; } },
  ],
});
