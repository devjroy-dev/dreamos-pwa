// docs/design/tools/recordshots.mjs · DESIGN-1 stage 5a: the enquiry and the client as pages, on the v2 tree
// (TDW_LAYOUT_DEFAULT=v2). Opens each from its list with a real tap, shoots the page, taps Back and measures that the
// list stands where it stood. usage: PORT=4100 node docs/design/tools/recordshots.mjs
import { browser, open, shot, sleep } from './harness.mjs';
const b = await browser();
const tapRow = async (p, sel, re) => {
  const box = await p.evaluate((s, r) => { const e = [...document.querySelectorAll(s)].find((x) => new RegExp(r).test(x.innerText)); if (!e) return null; e.scrollIntoView({ block: 'center' }); const bb = e.getBoundingClientRect(); return { x: bb.x + bb.width / 3, y: bb.y + Math.min(30, bb.height / 2), y0: document.querySelector('main.wl-main').scrollTop }; }, sel, re);
  if (box) await p.mouse.click(box.x, box.y);
  return box ? box.y0 : null;
};
const report = [];
for (const [list, sel, re, tag] of [['/vendor/leads', '[data-row-id]', 'Aanya', 'enquiry'], ['/vendor/clients', '[data-client-open]', 'Meera', 'client']]) {
  for (const mode of ['dark', 'light']) for (const vp of ['ios', 'android']) {
    const w = vp === 'ios' ? 374 : 360;
    const p = await open(b, list, { mode, vp, dpr: 2, settle: 1500 });
    await p.evaluate(() => { const m = document.querySelector('main.wl-main'); m.scrollTop = Math.min(160, m.scrollHeight - m.clientHeight); });
    await sleep(300);
    const before = await p.evaluate(() => document.querySelector('main.wl-main').scrollTop);
    const tapAt = await tapRow(p, sel, re);   // where the list stands at the tap (the row is scrolled into view first)
    const ok = tapAt != null; const before2 = tapAt;
    await sleep(2500);
    const at = await p.evaluate(() => location.pathname);
    console.log('shot', await shot(p, `shots/stage-5a/${tag}-${mode}-${w}.png`));
    console.log('shot', await shot(p, `shots/stage-5a/${tag}-full-${mode}-${w}.png`, { fullPage: false }));
    await p.evaluate(() => { const m = document.querySelector('main.wl-main'); m.scrollTop = m.scrollHeight; });
    await sleep(400);
    console.log('shot', await shot(p, `shots/stage-5a/${tag}-end-${mode}-${w}.png`));
    const back = await p.evaluate(() => { const a = document.querySelector('[data-record-back]'); if (!a) return false; a.click(); return true; });
    await sleep(2500);
    const after = await p.evaluate(() => ({ path: location.pathname, y: document.querySelector('main.wl-main') ? document.querySelector('main.wl-main').scrollTop : -1 }));
    report.push({ tag, mode, vp, opened: ok && at !== list, page: at, back, backTo: after.path, scrollBefore: before2, scrollAfter: after.y });
    await p.close();
  }
}
console.log(JSON.stringify(report, null, 1));
await b.close();
