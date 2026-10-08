#!/usr/bin/env node
'use strict';
// scripts/b180_fe7_wedding_pages_bench.js · TDW CE-47 · L4 (FE-7) · Wedding pages, as approved (veto rows 15 to 21).
//
// §1 THE SOURCE: the room types no word of its own for the reworked parts (WP.addPill, waitingOnClient,
//    permissionHead, clientNumber, askPermission, comingSoon, removePhotoAsk, keepIt); the Reel reads no probe on the
//    vendor's glass; the pill is RoomHeadAdd with FE-5's props.
// §2 THE LIST on glass (374, dark): "+ New wedding page"; Published · 2 and Draft · 1 as rows with Published,
//    Waiting and Not published; no floating +.
// §3 A DRAFT opens as a page: "Back to Wedding pages", "Not published", "Publish this page" on top; Photographs,
//    "Who worked this wedding" as rows (Claimed, Invited), Permission with "The client's number" and
//    "Ask for permission".
// §4 A LIVE PAGE: "This page is live."; the Reel reads "Coming soon" and is disabled; no "Video tools", no
//    "Check again"; Declined shows on its credit.
// §5 THE ASKED REMOVE (veto 21): the × asks "Remove this photograph?" with Remove and Keep it, and sends nothing;
//    Keep it closes the ask; Remove sends one request.
// §6 no "couple" anywhere in the list or either page.
// §8 MUTATIONS: M1 the × removes on one tap again (5.1 red); M2 "The client's number" back to "The couple's
//    number" (6.1 red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
const PAGE = 'v2/app/vendor/(shell)/wedding-pages/page.tsx';
const rowsOf = (p) => p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((r) => ({ t: (r.querySelector('.fr-t') || {}).textContent, pill: (r.querySelector('.fr-pill') || {}).textContent })));
async function list(g) {
  const p = await K.open(g, '/vendor/wedding-pages', { wait: '.fr-row .fr-f' });
  const r = { rows: await rowsOf(p), ws: await K.words(p), heads: await p.evaluate(() => [...document.querySelectorAll('.fr-h')].map((h) => h.textContent.trim())),
    pill: await p.evaluate(() => { const b = document.querySelector('[data-add-key="wedding-page"]'); return b ? b.textContent.trim() : null; }),
    fab: await p.evaluate(() => !!document.querySelector('.wl-fab, [data-fab]')) };
  await p.close(); return r;
}
async function wedding(g, title, ask) {
  const p = await K.open(g, '/vendor/wedding-pages', { wait: '.fr-row .fr-f' });
  await K.tap(p, title);   // e-275: tap settles
  const r = { ws: await K.words(p), rows: await rowsOf(p),
    next: await p.evaluate(() => { const b = document.querySelector('.wl-main .rp-next'); return b ? b.textContent.trim() : null; }),
    reel: await p.evaluate(() => { const b = [...document.querySelectorAll('.wl-main button')].find((x) => x.textContent.trim() === 'Coming soon'); return b ? { disabled: b.disabled } : null; }) };
  if (ask) {
    const before = p.posted.length;
    await K.tap(p, '@.wp-upx'); r.asked = await K.words(p); r.afterOne = p.posted.length;
    await K.tap(p, 'Keep it'); r.kept = await p.evaluate(() => !document.querySelector('.wp-ask'));
    await K.tap(p, '@.wp-upx'); await K.tap(p, '@.wp-ask .rp-job.warn');   // e-275: tap settles
    r.afterRemove = p.posted.length - before; r.before = before;
  }
  await p.close(); return r;
}

K.runBench({
  tag: 'b180', port: Number(process.env.B180_PORT || 4180), urls: ['/vendor/wedding-pages'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const c = K.code(PAGE);
    ok(['addPill', 'waitingOnClient', 'permissionHead', 'clientNumber', 'askPermission', 'comingSoon', 'removePhotoAsk', 'keepIt'].every((k) => new RegExp(`WP\\.${k}\\b`).test(c)), '1.1 the reworked words read WP');
    ok(!/>Permission<|>Ask for permission<|>Coming soon<|Waiting on the client|The client.s number</.test(c), '1.2 none of them typed in the page');
    ok(!/WP\.reelProbeOn|WP\.reelProbeOff|WP\.reelCheck/.test(c), '1.3 the Reel reads no probe line and no Check again on the vendor\'s glass');
    ok(/<RoomHeadAdd addKey="wedding-page" label=\{WP\.addPill\} onAdd=\{/.test(c), '1.4 the pill is RoomHeadAdd with FE-5\'s props');
  },
  async glass(g, ok, sec) {
    sec('2 THE LIST');
    const L = await list(g);
    ok(L.pill === '+ New wedding page' && !L.fab, '2.1 "+ New wedding page", and no floating +', `${L.pill} fab=${L.fab}`);
    ok(L.heads.join('|') === 'Published · 2|Draft · 1', '2.2 Published · 2 and Draft · 1', L.heads.join('|'));
    ok(L.rows.map((r) => r.pill).join('|') === 'Published|Waiting|Not published', '2.3 each row states Published, Waiting or Not published', L.rows.map((r) => r.pill).join('|'));
    sec('3 A DRAFT');
    const D = await wedding(g, 'Riya and Dev', true);
    ok(Array.isArray(D.ws) && (D.ws.includes('‹ Back to Wedding pages') || D.ws.includes('Back to Wedding pages')), '3.1 "Back to Wedding pages"');   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(Array.isArray(D.ws) && D.ws.includes('Not published') && D.next === 'Publish this page', '3.2 "Not published", and "Publish this page" on top', D.next);   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(Array.isArray(D.ws) && D.ws.includes('Photographs') && D.ws.includes('Who worked this wedding') && D.rows.map((r) => r.pill).join('|') === 'Claimed|Claimed', '3.3 Photographs, and the credits as rows with their states', D.rows.map((r) => r.pill).join('|'));   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(Array.isArray(D.ws) && ['Permission', 'The client’s number', 'Ask for permission'].every((w) => D.ws.includes(w)), '3.4 Permission, "The client\'s number", "Ask for permission"');   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    sec('4 A LIVE PAGE');
    const V = await wedding(g, 'Meera and Kunal', false);
    ok(Array.isArray(V.ws) && V.ws.includes('This page is live.') && V.next === null, '4.1 "This page is live.", and no Publish', V.next);   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(V.reel && V.reel.disabled, '4.2 the Reel reads "Coming soon" and is disabled (R-46.14)', JSON.stringify(V.reel));
    ok(Array.isArray(V.ws) && !V.ws.some((w) => /Video tools|Check again/.test(w)), '4.3 no probe line and no Check again');   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(V.rows.some((r) => r.pill === 'Declined'), '4.4 a declined credit says so');
    sec('5 THE ASKED REMOVE');
    ok(Array.isArray(D.asked) && D.asked.includes('Remove this photograph?') && D.asked.includes('Keep it') && D.afterOne === D.before, '5.1 the × asks first and sends nothing', `${D.before} -> ${D.afterOne}`);   // CE-47 ADS-2: K.words may answer null; guarded, a red not a throw
    ok(D.kept, '5.2 Keep it closes the ask');
    ok(D.afterRemove === 1, '5.3 Remove sends one request', D.afterRemove);
    sec('6 THE WORDS');
    ok(K.noCouple(L.ws) && K.noCouple(D.ws) && K.noCouple(V.ws), '6.1 no "couple" in the list or either page');
  },
  mutations: [
    { name: 'M1 the × removes on one tap again', rel: PAGE, from: 'onClick={() => setAskPhoto(p.id)}>&times;</button>', to: 'onClick={() => void removePhoto(p.id)}>&times;</button>', glass: true,
      cell: async (g) => { const D = await wedding(g, 'Riya and Dev', true); return Array.isArray(D.asked) && D.asked.includes('Remove this photograph?') && D.afterOne === D.before; } },
    { name: 'M2 "The client\'s number" back to "The couple\'s number"', rel: 'lib/worklist/weddingPages.ts', from: "  clientNumber: 'The client\\u2019s number',", to: "  clientNumber: 'The couple\\u2019s number',", glass: true,
      cell: async (g) => { const D = await wedding(g, 'Riya and Dev', false); return K.noCouple(D.ws); } },
  ],
});
