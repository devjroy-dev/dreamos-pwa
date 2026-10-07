#!/usr/bin/env node
'use strict';
// scripts/b182_fe7_referrals_notes_bench.js · TDW CE-47 · L4 (FE-7) · Referrals & partners and Notes, as approved
// (veto rows 45 to 53; C2: NotesBody changes once and draws the same in both places).
//
// §1 THE SOURCE: Referrals reads RF for its new words; ShootsBlock survives a reply without its list; NotesBody
//    reads NOTES for its new words, carries the pill by FE-5's name and props, and dates with full months.
// §2 REFERRALS on glass (374, dark): the room's line; Sent 5 and Received 3 as a fact table; Your peers · 3 as rows
//    ("Photographer · 3 sent · 1 received"); the Shoots block draws (the room does not fall to its error screen);
//    More → "Influencer exchange" opens that room; no "couple".
// §3 NOTES: "+ New note", 36 high, data-tap44; rows with the note in at most two lines and "28 September 2026";
//    a note opens with Delete LAST and ASKED ("Delete this note?", Delete, Keep it), nothing sent on the first tap,
//    one request on the second; the new-note box reads "Write your note".
// §8 MUTATIONS: M1 Delete acts on one tap again (3.3 red); M2 the date back to a short month (3.2 red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
const REF = 'v2/app/vendor/(shell)/referrals/page.tsx';
const NB = 'v2/components/vendor/NotesBody.tsx';
const rowsOf = (p) => p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((r) => ({ t: (r.querySelector('.fr-t') || {}).textContent, f: (r.querySelector('.fr-f') || {}).textContent })));
async function referrals(g, follow) {
  const p = await K.open(g, '/vendor/referrals', { wait: '.fr-row .fr-f' });
  const r = { rows: await rowsOf(p), ws: await K.words(p), heads: await p.evaluate(() => [...document.querySelectorAll('.fr-h')].map((h) => h.textContent.trim())),
    facts: await p.evaluate(() => [...document.querySelectorAll('.wl-main .rp-facts .rp-row, .wl-main .rp-fact')].map((e) => e.textContent.replace(/\s+/g, ' ').trim())),
    broken: await p.evaluate(() => /couldn.t load/.test(document.body.innerText)) };
  if (follow) { await K.tap(p, 'Influencer exchange'); { const from = p.url(); await K.waitUrl(p, (u) => u !== from); } r.went = p.url(); }   // e-275: the navigation itself
  await p.close(); return r;
}
async function notes(g) {
  const p = await K.open(g, '/vendor/notes', { wait: '.fr-row .fr-f' });
  const r = { rows: await rowsOf(p),
    clamp: await p.evaluate(() => [...document.querySelectorAll('.fr-row .fr-t')].map((el) => { const lh = parseFloat(getComputedStyle(el).lineHeight) || 20; return Math.round(el.getBoundingClientRect().height / lh); })),
    pill: await p.evaluate(() => { const b = document.querySelector('[data-add-key="note"]'); if (!b) return null; return { text: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), tap44: b.hasAttribute('data-tap44') }; }) };
  await K.tap(p, 'Aanya wants');   // e-275: tap settles
  const before = p.posted.length;
  r.lastBtn = await p.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter((b) => b.offsetParent && /Send to chat|Delete/.test(b.textContent)); return bs.map((b) => b.textContent.trim()).join('|'); });
  await K.tap(p, 'Delete'); r.asked = await K.words(p, 'body'); r.afterOne = p.posted.length - before;
  await K.tap(p, '@.rp-job.warn'); r.afterTwo = p.posted.length - before;   // e-275: tap settles
  await p.close();
  const q = await K.open(g, '/vendor/notes', { wait: '.fr-row .fr-f' });
  await K.tap(q, '@[data-add-key="note"]');   // e-275: tap settles
  r.placeholder = await q.evaluate(() => { const t = document.querySelector('textarea'); return t ? t.getAttribute('placeholder') : null; });
  await q.close(); return r;
}

K.runBench({
  tag: 'b182', port: Number(process.env.B182_PORT || 4182), urls: ['/vendor/referrals', '/vendor/notes', '/vendor/exchange'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const rf = K.code(REF); const nb = K.code(NB); const sh = K.code('v2/components/vendor/ShootsBlock.tsx');
    ok(/RF\.lede/.test(rf) && /RF\.sectionMore/.test(rf) && /RF\.exchangeLine/.test(rf) && !/'Influencers, and the requests/.test(rf), '1.1 Referrals reads RF for its new words');
    ok(/setOpen\(f\.feed \?\? \[\]\)/.test(sh) && /setMine\(m\.posts \?\? \[\]\)/.test(sh), '1.2 ShootsBlock survives a reply without its list');
    ok(/NOTES\.addPill/.test(nb) && /NOTES\.deleteAsk/.test(nb) && /NOTES\.keepIt/.test(nb) && /placeholder=\{NOTES\.placeholder\}/.test(nb), '1.3 NotesBody reads NOTES for its new words');
    ok(/<RoomHeadAdd addKey="note" label=\{NOTES\.addPill\} onAdd=\{/.test(nb) && /month: 'long'/.test(nb), '1.4 the pill by FE-5\'s props; full months');
  },
  async glass(g, ok, sec) {
    sec('2 REFERRALS');
    const R = await referrals(g, true);
    ok(!R.broken, '2.1 the room draws (not its error screen)');
    ok(R.ws.includes('Enquiries passed to peers, and received from them.'), '2.2 the room\'s line');
    ok(R.ws.includes('Sent') && R.ws.includes('5') && R.ws.includes('Received') && R.ws.includes('3'), '2.3 Sent 5 and Received 3');
    ok(R.heads.includes('Your peers · 3') && R.rows.some((r) => r.t === 'Studio Lumen' && r.f === 'Photographer · 3 sent · 1 received'), '2.4 Your peers · 3, "Photographer · 3 sent · 1 received"');
    ok(R.heads.includes('More') && R.rows.some((r) => r.t === 'Influencer exchange' && r.f === 'Influencers, and the requests you send them') && /\/vendor\/exchange/.test(R.went || ''), '2.5 More → Influencer exchange opens that room', R.went);
    ok(K.noCouple(R.ws), '2.6 no "couple"');
    sec('3 NOTES');
    const N = await notes(g);
    ok(N.pill && N.pill.text === '+ New note' && N.pill.h === 36 && N.pill.tap44, '3.1 "+ New note", 36 high, data-tap44', JSON.stringify(N.pill));
    ok(N.rows.length === 3 && N.rows[0].f === '28 September 2026' && N.clamp.every((n) => n <= 2), '3.2 three rows, the note in at most two lines, "28 September 2026"', `${N.rows[0] && N.rows[0].f} lines=${N.clamp.join(',')}`);
    ok(N.lastBtn === 'Send to chat|Delete' && Array.isArray(N.asked) && N.asked.includes('Delete this note?') && N.asked.includes('Keep it') && N.afterOne === 0, '3.3 Delete is last and asks first; nothing sent on the first tap', `${N.lastBtn} / ${N.afterOne}`);
    ok(N.afterTwo === 1, '3.4 the second tap sends one request', N.afterTwo);
    ok(N.placeholder === 'Write your note', '3.5 the new-note box reads "Write your note"', N.placeholder);
  },
  mutations: [
    { name: 'M1 Delete acts on one tap again', rel: NB, from: 'onClick={() => setAsking(true)} disabled={saving}>Delete</button>', to: 'onClick={() => void doDelete(selected)} disabled={saving}>Delete</button>', glass: true,
      cell: async (g) => { const N = await notes(g); return Array.isArray(N.asked) && N.asked.includes('Delete this note?') && N.afterOne === 0; } },
    { name: 'M2 the date back to a short month', rel: NB, from: "{ day: 'numeric', month: 'long', year: 'numeric' }", to: "{ day: 'numeric', month: 'short' }", glass: true,
      cell: async (g) => { const N = await notes(g); return N.rows[0] && N.rows[0].f === '28 September 2026'; } },
  ],
});
