#!/usr/bin/env node
'use strict';
// scripts/b188_fe7_reminders_bench.js · Payment reminders · L4b (FE-7) · board 9. §1 source: the switch keeps its gate
// (inert when sending is shut) and its line (the dark note OR its state sentence); "Scheduled" only when on and open.
// §2 standing checks. §3 the switch row first, role=switch, aria-checked; its line; Due · 2 with "Scheduled"; the
// unsent ones under Asked; Sent with "Sent" and the sent note; rows open nothing (no chevron). §8 M1 "Scheduled"
// shown with the switch off (source 1.2 red); M2 the switch drawn after the lists (3.1 red).
const K = require('./lib/fe7_l4_kit.js');
const F = 'v2/app/vendor/(shell)/payment-reminders/page.tsx';
async function room(g) {
  const p = await K.open(g, '/vendor/payment-reminders', { wait: '.fr-row .fr-f' });
  const r = { words: await K.words(p, '.fr-room'),
    first: await p.evaluate(() => { const g0 = document.querySelector('.fr-room .fr-group'); return g0 ? (g0.querySelector('.fr-t') || {}).textContent : null; }),
    sw: await p.evaluate(() => { const s = document.querySelector('[role=switch]'); return s ? { checked: s.getAttribute('aria-checked'), disabled: s.disabled } : null; }),
    heads: await p.evaluate(() => [...document.querySelectorAll('.fr-h')].map((h) => h.textContent.trim())),
    pills: await p.evaluate(() => [...document.querySelectorAll('.fr-pill')].map((e) => e.textContent.trim())),
    chev: await p.evaluate(() => document.querySelectorAll('.fr-room .fr-chev').length) };
  await p.close(); return r;
}
K.runBench({
  tag: 'b188', port: Number(process.env.B188_PORT || 4188), urls: ['/vendor/payment-reminders'],
  source(ok, sec) {
    sec('1 THE SOURCE'); const c = K.code(F);
    ok(/disabled=\{!sendingOpen \|\| saving\}/.test(c) && /\{!sendingOpen \? \(approved \? PR\.darkNote : PR\.darkNotFiled\) : \(room\.auto_send \? PR\.switchOn : PR\.switchOff\)\}/.test(c), '1.1 the switch keeps its gate and its one line');
    ok(/pill=\{room\.auto_send && sendingOpen \? \{ text: PR\.scheduled/.test(c), '1.2 "Scheduled" only when the switch is on and sending is open');
  },
  async glass(g, ok, sec) {
    sec('2 THE STANDING CHECKS'); await K.standing(g, ok, 'Payment reminders', '/vendor/payment-reminders');
    sec('3 THE ROOM'); const r = await room(g);
    ok(r.first === 'Send the rest automatically' && r.sw && r.sw.checked === 'true' && !r.sw.disabled, '3.1 the switch row first, on, a real switch', JSON.stringify([r.first, r.sw]));
    ok(r.words.some((w) => /^On\. After you send the first reminder/.test(w)), '3.2 its state sentence');
    ok(r.heads.join('|') === 'Due · 2|Asked · 1|Sent · 1', '3.3 Due, the unsent under Asked, Sent', r.heads.join('|'));
    ok(r.pills.join('|') === 'Scheduled|Scheduled|Asked|Sent', '3.4 Scheduled, Asked and Sent pills', r.pills.join('|'));
    ok(r.words.includes('Sent means WhatsApp accepted it. We cannot tell you whether it was delivered or read.'), '3.5 the sent note stays');
    ok(r.chev === 0, '3.6 the rows open nothing (no chevron), as today', r.chev);
  },
  mutations: [
    { name: 'M1 "Scheduled" shown with the switch off', rel: F, from: 'pill={room.auto_send && sendingOpen ? { text: PR.scheduled', to: 'pill={true ? { text: PR.scheduled', cell: async () => /pill=\{room\.auto_send && sendingOpen \? \{ text: PR\.scheduled/.test(K.code(F)) },
    { name: 'M2 the switch row\'s label changed', rel: 'v2/lib/worklist/paymentReminders.ts', from: "switchLabel:    'Send the rest automatically',", to: "switchLabel:    'Automatic reminders',", glass: true, cell: async (g) => (await room(g)).first === 'Send the rest automatically' },
  ],
});
