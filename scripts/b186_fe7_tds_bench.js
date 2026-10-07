#!/usr/bin/env node
'use strict';
// scripts/b186_fe7_tds_bench.js · TDS · L4b (FE-7) · FE-6's approved frame (board 9, SPEC.md). §1 source: the pill by
// FE-5's props; its handlers unchanged (fetchTdsEntries, createTdsEntry, deleteTdsEntry, exportTdsCsv); no crash on a
// reply without totals. §2 standing checks at 374 and 360. §3 the room: "+ New TDS entry"; "TDS · FY yyyy-yy"; the year
// switch of three; Gross / TDS deducted / Net received; Entries rows with the amount at the right; an entry as a page
// with Delete last and asked; Export CSV at the foot; the add sheet writes its Deduction date in words; an empty year
// draws (no crash). §8 M1 "TDS deducted" back to "TDS" (3.3 red); M2 the sheet's date words removed (3.6 red).
const K = require('./lib/fe7_l4_kit.js');
const F = 'v2/app/vendor/(shell)/tds/screen.tsx';
const fyNow = () => { const d = new Date(Date.now() + 330 * 60000); const m = d.getUTCMonth() + 1; const y = d.getUTCFullYear(); const s = m >= 4 ? y : y - 1; return `FY ${s}-${String(s + 1).slice(2)}`; };
async function room(g, scen) {
  const p = await K.open(g, '/vendor/tds', { wait: scen && scen.tdsEmpty ? '.fr-empty' : '.fr-row .fr-f', scen });
  const r = { found: p.found };
  r.pill = await p.evaluate(() => { const b = document.querySelector('[data-add-key="tds"]'); return b ? { t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), tap: b.hasAttribute('data-tap44') } : null; });
  r.words = await K.words(p, '.fr-room');
  r.seg = await p.evaluate(() => [...document.querySelectorAll('.tds-segb')].map((b) => b.textContent.trim()));
  r.rows = await p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((e) => ({ t: (e.querySelector('.fr-t') || {}).textContent, f: (e.querySelector('.fr-f') || {}).textContent, v: (e.querySelector('.fr-v') || {}).textContent })));
  r.lastBtn = await p.evaluate(() => { const bs = [...document.querySelectorAll('.fr-room button')]; return bs.length ? bs[bs.length - 1].textContent.trim() : null; });
  r.crash = await p.evaluate(() => /couldn.t load|Runtime TypeError/.test(document.body.innerText));
  if (!scen) {
    await K.tap(p, '@[data-add-key="tds"]');   // e-275: tap settles
    r.dateWords = await p.evaluate(() => [...document.querySelectorAll('[data-date-words]')].map((e) => e.textContent.trim()));
    await p.close();
    const q = await K.open(g, '/vendor/tds', { wait: '.fr-row .fr-f' });
    await K.tap(q, 'Hotel Leela'); r.page = await K.words(q, '.fr-room');
    const before = q.posted.length; await K.tap(q, '@.fr-quiet'); r.asked = await K.words(q, '.fr-room'); r.afterOne = q.posted.length - before;
    await q.close();
  } else await p.close();
  return r;
}
K.runBench({
  tag: 'b186', port: Number(process.env.B186_PORT || 4186), urls: ['/vendor/tds'],
  source(ok, sec) {
    sec('1 THE SOURCE'); const c = K.code(F);
    ok(/<RoomHeadAdd addKey="tds" label=\{TDSW\.addPill\} onAdd=\{/.test(c) && /addPill: '\+ New TDS entry'/.test(c), '1.1 the pill by FE-5\'s props, "+ New TDS entry"');
    ok(['fetchTdsEntries', 'createTdsEntry', 'deleteTdsEntry', 'exportTdsCsv'].every((f) => new RegExp(`\\b${f}\\(`).test(c)), '1.2 its handlers unchanged: entries, create, delete, export');
    ok(/Rs\(summary\.total_gross\)/.test(c) && /Number\(n \?\? 0\)/.test(c) && !/summary\.by_section\.map/.test(c), '1.3 totals read with a fallback, so a reply without them does not crash');
  },
  async glass(g, ok, sec) {
    sec('2 THE STANDING CHECKS'); await K.standing(g, ok, 'TDS', '/vendor/tds');
    sec('3 THE ROOM'); const r = await room(g);
    ok(r.pill && r.pill.t === '+ New TDS entry' && r.pill.h === 36 && r.pill.tap, '3.1 "+ New TDS entry", 36 high, data-tap44', JSON.stringify(r.pill));
    ok(r.words.includes(`TDS · ${fyNow()}`) && r.seg.length === 3 && r.seg[0] === fyNow(), '3.2 "TDS · FY yyyy-yy" and the switch of three years', `${r.seg.join('|')}`);
    ok(['Gross', 'TDS deducted', 'Net received', 'Rs 1,50,000', 'Rs 15,000', 'Rs 1,35,000'].every((w) => r.words.includes(w)), '3.3 Gross, TDS deducted, Net received');
    ok(r.rows[0] && r.rows[0].t === 'Hotel Leela, Gurugram' && r.rows[0].f === 'Section 194J · 14 September 2026' && r.rows[0].v === 'Rs 10,000', '3.4 Entries rows: payer, section and full date, the amount at the right', JSON.stringify(r.rows[0]));
    ok(r.lastBtn === 'Export CSV', '3.5 Export CSV at the foot', r.lastBtn);
    ok(Array.isArray(r.dateWords) && r.dateWords.length === 1 && /^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(r.dateWords[0]), '3.6 the add sheet writes its Deduction date in words', (r.dateWords || []).join('|'));
    ok(r.page.includes('TDS deducted') && r.asked.includes('Delete this entry?') && r.asked.includes('Keep it') && r.afterOne === 0, '3.7 an entry opens as a page; Delete is last and asks first; nothing sent on the first tap', r.afterOne);
    const E = await room(g, { tdsEmpty: true });
    ok(E.found && !E.crash && E.words.some((w) => /^No TDS entries for FY/.test(w)), '3.8 an empty year draws, and says so');
  },
  mutations: [
    { name: 'M1 "TDS deducted" back to "TDS"', rel: F, from: "deducted: 'TDS deducted',", to: "deducted: 'TDS',", glass: true, cell: async (g) => (await room(g)).words.includes('TDS deducted') },
    { name: 'M2 the sheet\'s date in words removed', rel: F, from: '{dedDate ? <p data-date-words="" className="tds-dw">{dayInWords(dedDate)}</p> : null}', to: '{null}', glass: true,
      cell: async (g) => { const r = await room(g); return Array.isArray(r.dateWords) && r.dateWords.length === 1; } },
  ],
});
