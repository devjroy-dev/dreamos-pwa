#!/usr/bin/env node
'use strict';
// scripts/b179_fe7_exchange_bench.js · TDW CE-47 · L4 (FE-7) · Influencer exchange, both seats, as approved (veto
// rows 8 to 14) and with the chair's ruling: the date in words under every native date field.
//
// §1 THE SOURCE: the room types no word of its own (EXCHANGE.badgeShort, inCity, untilDate, askCount, requestHead,
//    withdrawAsk, declineAsk, keepIt); dates go through dayInWords; both date fields carry data-date-words.
// §2 THE SENDER on glass (374, dark): Influencers · 3 as rows, the pill "Verified" or "Pending", facts
//    "24,600 followers · 62% in Delhi NCR"; Your requests · 3 with "2 reels · until 18 November 2026" and the plural
//    "3 stories"; an influencer opens as a page (status, Send request on top, By city / By age / By gender tables);
//    Send request opens the offer sheet, and each date field shows the chosen date in words beneath it; a request
//    opens as a page with Withdraw LAST, and Withdraw ASKS ("Withdraw your request to Aanya Mehra?", Withdraw,
//    Keep it) and nothing is sent until the second tap.
// §3 THE INFLUENCER on glass: Requests to you · 2; a request opens with Accept on top and Decline last and asked.
// §8 MUTATIONS: M1 the list pill's word back to "Verified via Instagram" (2.1 red); M2 the From field's words
//    removed (2.5 red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
const PAGE = 'v2/app/vendor/(shell)/exchange/page.tsx';
const rowsOf = (p) => p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((r) => ({ t: (r.querySelector('.fr-t') || {}).textContent, f: (r.querySelector('.fr-f') || {}).textContent, pill: (r.querySelector('.fr-pill') || {}).textContent })));
async function setDate(p, idx, v) {
  await p.evaluate((i, val) => {
    const el = document.querySelectorAll('input[type=date]')[i]; if (!el) return;
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
  }, idx, v);
  await K.settle(p);   // e-275: quiet, not 300 ms
}
async function sender(g) {
  const p = await K.open(g, '/vendor/exchange', { wait: '.fr-row .fr-f', scen: { xc: 'sender' } });
  const list = await rowsOf(p); const ws = await K.words(p);
  await K.tap(p, 'Aanya Mehra');
  const inf = await K.words(p);
  await K.tap(p, 'Send request');
  const dateFields = await p.evaluate(() => document.querySelectorAll('input[type=date]').length);
  await setDate(p, 0, '2026-10-18'); await setDate(p, 1, '2026-11-18');
  const dateWords = await p.evaluate(() => [...document.querySelectorAll('[data-date-words]')].map((e) => e.textContent.trim()));
  await p.close();
  const q = await K.open(g, '/vendor/exchange', { wait: '.fr-row .fr-f', scen: { xc: 'sender' } });
  await q.evaluate(() => { const rs = [...document.querySelectorAll('button.fr-row')].filter((r) => r.textContent.startsWith('Aanya Mehra')); rs[rs.length - 1].click(); });
  await K.settle(q);   // e-275: quiet, not 800 ms
  const req = await K.words(q);
  const lastIsWithdraw = await q.evaluate(() => { const bs = [...document.querySelectorAll('.wl-main button')].filter((b) => b.offsetParent); return bs.length ? bs[bs.length - 1].textContent.trim() : null; });
  const before = q.posted.length;
  await K.tap(q, 'Withdraw');
  const asked = await K.words(q); const afterOne = q.posted.length;
  await q.close();
  return { list, ws, inf, dateFields, dateWords, req, lastIsWithdraw, asked, before, afterOne };
}
async function influencer(g) {
  const p = await K.open(g, '/vendor/exchange', { wait: '.fr-row .fr-f', scen: { xc: 'creator' } });
  const ws = await K.words(p);
  const heads = await p.evaluate(() => [...document.querySelectorAll('.fr-h')].map((h) => h.textContent.trim()));
  await K.tap(p, 'Studio Lumen');
  const page = await K.words(p);
  const firstBtn = await p.evaluate(() => { const b = document.querySelector('.wl-main .rp-next'); return b ? b.textContent.trim() : null; });
  const before = p.posted.length;
  await K.tap(p, 'Decline');
  const asked = await K.words(p); const afterOne = p.posted.length;
  await p.close();
  return { ws, heads, page, firstBtn, asked, before, afterOne };
}

K.runBench({
  tag: 'b179', port: Number(process.env.B179_PORT || 4179), urls: ['/vendor/exchange'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const c = K.code(PAGE);
    ok(!/'Verified'|>Keep it<|>The request<|`(Withdraw|Decline) (your|this) request/.test(c), '1.1 the room types no word of its own');
    ok(['badgeShort', 'inCity', 'untilDate', 'askCount', 'requestHead', 'withdrawAsk', 'declineAsk', 'keepIt'].every((k) => new RegExp(`EXCHANGE\\.${k}\\b`).test(c)), '1.2 its words read EXCHANGE (badgeShort, inCity, untilDate, askCount, requestHead, withdrawAsk, declineAsk, keepIt)');
    ok(/dayInWords/.test(c) && !/'January'/.test(c), '1.3 dates go through dayInWords (no month table of its own)');
    ok((c.match(/type="date"[^\n]*data-date-words/g) || []).length === 2, '1.4 both native date fields carry the date in words');
  },
  async glass(g, ok, sec) {
    sec('2 THE SENDER');
    const S = await sender(g);
    const inf = S.list.slice(0, 3); const mine = S.list.slice(3);
    ok(inf.length === 3 && inf.map((r) => r.pill).join('|') === 'Verified|Pending|Verified', '2.1 Influencers: three rows, the pill "Verified" or "Pending"', inf.map((r) => r.pill).join('|'));
    ok(inf[0] && inf[0].f === '24,600 followers · 62% in Delhi NCR', '2.2 the facts: followers and the audience in the chosen city', inf[0] && inf[0].f);
    ok(mine.length === 3 && mine[0].f === '2 reels · until 18 November 2026' && mine[2].f === '3 stories · until 20 September 2026', '2.3 Your requests: what was asked, "until" and a full date; "stories" in the plural', mine.map((r) => r.f).join(' | '));
    ok(Array.isArray(S.inf) && S.inf.includes('Send request') && ['By city', 'By age', 'By gender'].every((h) => S.inf.includes(h)) && S.inf.includes('Verified via Instagram · 4.1% engagement'), '2.4 an influencer opens as a page: status, Send request, the three tables');
    ok(S.dateFields === 2 && S.dateWords.join('|') === '18 October 2026|18 November 2026', '2.5 each date field shows the chosen date in words beneath it', `${S.dateFields} fields: ${S.dateWords.join('|')}`);
    ok(Array.isArray(S.req) && S.req.includes('The request') && S.req.includes('Back to Influencer exchange') && S.lastIsWithdraw === 'Withdraw', '2.6 a request opens as a page, with Withdraw last', S.lastIsWithdraw);
    ok(Array.isArray(S.asked) && S.asked.includes('Withdraw your request to Aanya Mehra?') && S.asked.includes('Keep it') && S.afterOne === S.before, '2.7 Withdraw asks first, and nothing is sent on the first tap', `${S.before} -> ${S.afterOne}`);
    ok(K.noCouple(S.ws) && K.noCouple(S.inf) && K.noCouple(S.req), '2.8 no "couple"');
    sec('3 THE INFLUENCER');
    const I = await influencer(g);
    ok(Array.isArray(I.heads) && I.heads.includes('Requests to you · 2'), '3.1 Requests to you · 2', I.heads && I.heads.join('|'));
    ok(I.firstBtn === 'Accept', '3.2 a request to them opens with Accept on top', I.firstBtn);
    ok(Array.isArray(I.asked) && I.asked.includes('Decline this request from Studio Lumen?') && I.afterOne === I.before, '3.3 Decline is last and asks first; nothing sent on the first tap', `${I.before} -> ${I.afterOne}`);
  },
  mutations: [
    { name: 'M1 the list pill back to "Verified via Instagram"', rel: 'lib/worklist/exchange.ts', from: "  badgeShort: 'Verified',", to: "  badgeShort: 'Verified via Instagram',", glass: true,
      cell: async (g) => { const S = await sender(g); return S.list.slice(0, 3).map((r) => r.pill).join('|') === 'Verified|Pending|Verified'; } },
    { name: 'M2 the From field\'s date in words removed', rel: PAGE, from: '{from ? <span className="wl-dw" data-date-words="">{dayInWords(from)}</span> : null}', to: '{null}', glass: true,
      cell: async (g) => { const S = await sender(g); return S.dateWords.join('|') === '18 October 2026|18 November 2026'; } },
  ],
});
