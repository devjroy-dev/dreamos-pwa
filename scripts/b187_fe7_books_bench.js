#!/usr/bin/env node
'use strict';
// scripts/b187_fe7_books_bench.js · Books · L4b (FE-7) · FE-6's approved frame (board 9). §1 source: its own render of
// fetchBooks; BooksBody untouched (byte-identical to main at the build); no Export CSV. §2 standing checks.
// §3 Total received and Outstanding; Money movements as rows "Received · <date>" / "Paid out · <date>", the amount at
// the right; no plus or minus sign anywhere (R-45.30); no Export CSV on glass. §8 M1 a minus sign back on a paid-out
// amount (3.3 red); M2 "Paid out" back to "Debit" (3.2 red).
const K = require('./lib/fe7_l4_kit.js');
const F = 'v2/app/vendor/(shell)/books/page.tsx';
async function room(g) {
  const p = await K.open(g, '/vendor/books', { wait: '.fr-row .fr-f' });
  const r = { words: await K.words(p, '.fr-room'), rows: await p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((e) => ({ t: (e.querySelector('.fr-t') || {}).textContent, f: (e.querySelector('.fr-f') || {}).textContent, v: (e.querySelector('.fr-v') || {}).textContent }))) };
  r.text = Array.isArray(r.words) ? r.words.join(' ') : null; await p.close(); return r;   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
}
K.runBench({
  tag: 'b187', port: Number(process.env.B187_PORT || 4187), urls: ['/vendor/books'],
  source(ok, sec) {
    sec('1 THE SOURCE'); const c = K.code(F);
    ok(/fetchBooks\(vendorId\)/.test(c) && /function BooksRoom/.test(c) && !/<BooksBody/.test(c), '1.1 its own render of the same door');
    ok(/export function BooksBody\(\{ vendorId \}/.test(K.code('v2/components/worklist/BooksBody.tsx')), '1.2 BooksBody still exported whole for any other caller (this room no longer draws it)');
    ok(!/Export CSV|exportBooks/.test(c), '1.3 no Export CSV (the room has none)');
  },
  async glass(g, ok, sec) {
    sec('2 THE STANDING CHECKS'); await K.standing(g, ok, 'Books', '/vendor/books');
    sec('3 THE ROOM'); const r = await room(g);
    ok(Array.isArray(r.words) && ['Total received', 'Rs 4,10,000', 'Outstanding', 'Rs 3,40,000', 'Money movements'].every((w) => r.words.includes(w)), '3.1 Total received, Outstanding, Money movements');   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    const out = r.rows.find((x) => x.t === 'Drone rental'); const inn = r.rows.find((x) => x.t === 'Aanya Kapoor');
    ok(out && out.f === 'Paid out · 12 September 2026' && out.v === 'Rs 18,000' && inn && inn.f === 'Received · 5 September 2026' && inn.v === 'Rs 1,00,000', '3.2 rows say Received or Paid out in words, with the full date and the amount at the right', `${JSON.stringify(out)} ${JSON.stringify(inn)}`);
    ok(typeof r.text === 'string' && !/[+\u2212]\s?Rs|-\s?Rs|Rs\s?-/.test(r.text), '3.3 no plus or minus sign on any amount (R-45.30)');   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(typeof r.text === 'string' && !/Export CSV/.test(r.text), '3.4 no Export CSV on glass');   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
  },
  mutations: [
    { name: 'M1 a minus sign back on a paid-out amount', rel: F, from: "value={Rs(isIn ? m.credit : m.debit)}", to: "value={(isIn ? '' : '\\u2212') + Rs(isIn ? m.credit : m.debit)}", glass: true, cell: async (g) => { const t = (await room(g)).text; return typeof t === 'string' && !/[+\u2212]\s?Rs|-\s?Rs/.test(t); } },   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    { name: 'M2 "Paid out" back to "Debit"', rel: F, from: "out: 'Paid out',", to: "out: 'Debit',", glass: true, cell: async (g) => (await room(g)).rows.some((x) => /^Paid out · /.test(x.f || '')) },
  ],
});
