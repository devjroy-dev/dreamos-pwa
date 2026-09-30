// docs/design/tools/recordprobe5b.mjs · DESIGN-1 stage 5b: the invoice's and the event's pages DRIVEN on the v2 tree
// (TDW_LAYOUT_DEFAULT=v2), in the design harness (its mock doors; writes succeed quietly). Each line is one act and
// what the page did. usage: PORT=4100 node docs/design/tools/recordprobe5b.mjs
import { browser, open, sleep } from './harness.mjs';
const b = await browser();
const out = [];
const say = (name, ok, extra = '') => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? '  (' + extra + ')' : ''}`); };
const tap = (p, text, scope = 'button, a') => p.evaluate((t, s) => {
  const e = [...document.querySelectorAll(s)].find((x) => x.innerText.trim() === t && x.offsetParent !== null);
  if (!e) return false; e.scrollIntoView({ block: 'center' }); e.click(); return true;
}, text, scope);
const status = (p) => p.evaluate(() => (document.querySelector('[data-record-status]') || {}).innerText || '');
const toast = (p) => p.evaluate(() => document.body.innerText.includes('Undo'));
const detailOpen = (p) => p.evaluate(() => { const d = document.querySelector('[data-lc2="detail-sheet"]'); return !!d && !/translateY\(100%\)/.test(d.style.transform); });
const path = (p) => p.evaluate(() => location.pathname + location.search);

// 1 · the invoice's page: a schedule sheet over the page, never the record sheet under it
{
  const p = await open(b, '/vendor/invoices/inv-0003', { settle: 2500 });
  say('1.1 the invoice page draws its schedule', await p.evaluate(() => !!document.querySelector('[data-record-schedule]')));
  say('1.2 Remind opens its confirm sheet', await tap(p, 'Remind') && (await sleep(700), await p.evaluate(() => /Send/.test(document.body.innerText) && !!document.querySelector('[style*="position: fixed"]'))));
  say('1.3 the record sheet stays shut under it', !(await detailOpen(p)));
  await p.close();
}
// 2 · Cancel invoice: asks, then the page stays, reading Cancelled, with Undo; Undo brings it back
{
  const p = await open(b, '/vendor/invoices/inv-0003', { settle: 2500 });
  const before = await status(p);
  await tap(p, 'Cancel invoice'); await sleep(300);
  const asked = await tap(p, 'Cancel invoice: sure?'); await sleep(800);
  const after = await status(p), at = await path(p), und = await toast(p);
  say('2.1 Cancel asks first, then the page stays and reads Cancelled, with Undo', asked && /^Cancelled/.test(after) && at === '/vendor/invoices/inv-0003' && und, `${before} → ${after} at ${at}`);
  await tap(p, 'Undo'); await sleep(800);
  say('2.2 Undo brings it back', (await status(p)) === before, await status(p));
  await p.close();
}
// 3 · Mark paid is the list's own act
{
  const p = await open(b, '/vendor/invoices/inv-0003', { settle: 2500 });
  await tap(p, 'Mark paid'); await sleep(800);
  say('3.1 Mark paid marks it paid on the page, with Undo', /^Paid/.test(await status(p)) && await toast(p), await status(p));
  await p.close();
}
// 4 · the event: Mark done; Edit opens the one edit sheet
{
  const p = await open(b, '/vendor/events/ev-0102', { settle: 2500 });
  await tap(p, 'Mark done'); await sleep(800);
  say('4.1 Mark done marks it done on the page, with Undo', /^Done/.test(await status(p)) && await toast(p), await status(p));
  await p.close();
  const q = await open(b, '/vendor/events/ev-0102', { settle: 2500 });
  await tap(q, 'Edit'); await sleep(900);
  say('4.2 Edit opens the event’s edit sheet over the page (and not the record sheet)', await q.evaluate(() => /Save|Update/.test(document.body.innerText)) && !(await detailOpen(q)));
  await q.close();
}
// 5 · the ways in
for (const [from, want] of [['/vendor/invoices?invoice=inv-0003', '/vendor/invoices/inv-0003'], ['/vendor/events?event=ev-0102', '/vendor/events/ev-0102'], ['/vendor/clients?client=client-meera', '/vendor/clients/bind-0003']]) {
  const p = await open(b, from, { settle: 3500 });
  await sleep(1500);
  const at = await path(p);
  say(`5 ${from} opens ${want}`, at === want, at);
  await p.close();
}
{
  const p = await open(b, '/vendor/clients?client=client-nobody', { settle: 3500 });
  await sleep(1500);
  say('5.4 an id the roster lacks stays on the Clients list', (await path(p)).startsWith('/vendor/clients?'), await path(p));
  await p.close();
}
// 6 · the two 5a fixes
{
  const p = await open(b, '/vendor/clients/bind-0003', { settle: 3000 });
  const href = await p.evaluate(() => (document.querySelector('[data-record-next]') || {}).getAttribute?.('href'));
  say('6.1 the client’s Open the invoice goes to that invoice’s page', href === '/vendor/invoices/inv-0003', href);
  await tap(p, 'Hide'); await sleep(300); await tap(p, 'Hide: sure?'); await sleep(900);
  say('6.2 Hide keeps the page, reading Hidden, with its Undo', (await status(p)) === 'Hidden' && await toast(p) && (await path(p)) === '/vendor/clients/bind-0003', `${await status(p)} at ${await path(p)}`);
  await p.close();
}
console.log(out.join('\n'));
console.log(out.some((x) => x.startsWith('FAIL')) ? 'RED' : 'GREEN', `${out.filter((x) => x.startsWith('ok')).length}/${out.length}`);
await b.close();
