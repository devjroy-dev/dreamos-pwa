// docs/design/tools/helpshots.mjs · DESIGN-1: the "?" cards on the surfaces that are not pages (the search box and the Book
// sheet), on the v2 tree (TDW_LAYOUT_DEFAULT=v2). usage: PORT=4100 node docs/design/tools/helpshots.mjs
import { browser, open, shot, sleep } from './harness.mjs';
const b = await browser();
for (const mode of ['dark', 'light']) {
  const p = await open(b, '/vendor/today', { mode, vp: 'ios', dpr: 2, settle: 1500 });
  await p.evaluate(() => document.querySelector('[data-help-id="surface:search"]').click()); await sleep(700);
  console.log('shot', await shot(p, `shots/stage-4/help/search-card-${mode}-374.png`));
  await p.close();
  const q = await open(b, '/vendor/leads', { mode, vp: 'ios', dpr: 2, settle: 1500 });
  const box = await q.evaluate(() => { const r = [...document.querySelectorAll('[data-row-id]')].find((e) => /New/.test(e.innerText)); const bb = r.getBoundingClientRect(); return { x: bb.x + bb.width / 3, y: bb.y + bb.height / 2 }; });
  await q.mouse.click(box.x, box.y); await sleep(2500);
  await q.evaluate(() => [...document.querySelectorAll('button')].find((e) => e.innerText.trim() === 'Booking confirmed' && e.getBoundingClientRect().height > 0).click()); await sleep(1500);
  await q.evaluate(() => [...document.querySelectorAll('[data-help-id="sheet:book"]')].find((e) => e.getBoundingClientRect().height > 0).click()); await sleep(900);
  console.log('shot', await shot(q, `shots/stage-4/help/book-card-${mode}-374.png`));
  await q.close();
}
await b.close();
