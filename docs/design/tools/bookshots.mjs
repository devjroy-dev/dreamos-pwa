// docs/design/tools/bookshots.mjs · DESIGN-1 stage 4: the Book sheet on the v2 tree (serve it with TDW_LAYOUT_DEFAULT=v2).
// usage: PORT=4100 [HARNESS_LP=1] node docs/design/tools/bookshots.mjs <tag>
//   no package (the picker and No package, enter an amount) · with HARNESS_LP=1 the plan sentence and Change plan · Booked
import { browser, open, shot, sleep } from './harness.mjs';
const tag = process.argv[2] || 'nopackage';
const b = await browser();
const clickText = (p, re) => p.evaluate((src) => { const rx = new RegExp(src); const el = [...document.querySelectorAll('button, [role=button], a')].find((e) => rx.test(e.innerText || '') && e.getBoundingClientRect().height > 0); if (!el) return false; el.scrollIntoView({ block: 'center' }); el.click(); return true; }, re.source);
for (const mode of ['dark', 'light']) for (const vp of ['ios', 'android']) {
  const w = vp === 'ios' ? 374 : 360;
  const p = await open(b, '/vendor/leads', { mode, vp, dpr: 2, settle: 1500 });
  // a real pointer tap on the first new enquiry (the row reads pointer events, not a synthetic click)
  const box = await p.evaluate(() => { const r = [...document.querySelectorAll('[data-row-id]')].find((e) => /New/.test(e.innerText)); if (!r) return null; r.scrollIntoView({ block: 'center' }); const bb = r.getBoundingClientRect(); return { x: bb.x + bb.width / 3, y: bb.y + bb.height / 2 }; });
  const row = !!box;
  if (box) await p.mouse.click(box.x, box.y);
  await sleep(2500);
  const opened = row && await clickText(p, /^Booking confirmed$/);
  await sleep(1500);
  if (!opened) { console.log('MISSING book sheet', mode, vp); await p.close(); continue; }
  console.log('shot', await shot(p, `shots/stage-4/book/${tag}-${mode}-${w}.png`));
  if (tag === 'nopackage') {
    // real taps and typing: a second date (Sangeet), No package, the amount; then Confirm booking
    const tapAt = async (sel) => { const bb = await p.evaluate((q) => { const i = document.querySelector(q); if (!i) return null; i.scrollIntoView({ block: 'center' }); const r = i.getBoundingClientRect(); return { x: r.x + Math.min(20, r.width / 2), y: r.y + r.height / 2 }; }, sel); if (bb) await p.mouse.click(bb.x, bb.y); return !!bb; };
    await clickText(p, /^Add a date$/); await sleep(300);
    if (await tapAt('#book-date-1')) await p.keyboard.type('12212026');
    if (await tapAt('#book-what-1')) await p.keyboard.type('Sangeet');
    await tapAt('[data-book-pkg="__none__"] input'); await sleep(300);
    if (await tapAt('#book-amount')) await p.keyboard.type('150000');
    await sleep(500);
    console.log('shot', await shot(p, `shots/stage-4/book/amount-${mode}-${w}.png`));
    await clickText(p, /^Confirm booking$/); await sleep(2000);
    console.log('shot', await shot(p, `shots/stage-4/book/booked-${mode}-${w}.png`));
  }
  await p.close();
}
await b.close();
