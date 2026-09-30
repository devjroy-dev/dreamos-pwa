// docs/design/tools/searchshots.mjs · DESIGN-1 stage 3: the universal search and the Get found card, on the v2 tree
// (serve it with TDW_LAYOUT_DEFAULT=v2, the bench seam). usage: PORT=4100 node docs/design/tools/searchshots.mjs
import { browser, open, shot, sleep } from './harness.mjs';
const b = await browser();
for (const mode of ['dark', 'light']) for (const vp of ['ios', 'android']) {
  const w = vp === 'ios' ? 374 : 360;
  for (const [name, q] of [['search-records', 'meera'], ['search-tool', 'ads'], ['search-ask', 'how do I raise an invoice?']]) {
    const p = await open(b, '/vendor/clients', { mode, vp, dpr: 2, settle: 1200 });
    await p.focus('.wl-sinput'); await p.keyboard.type(q); await sleep(1500);
    console.log('shot', await shot(p, `shots/stage-3/search/${name}-${mode}-${w}.png`));
    await p.close();
  }
  const h = await open(b, '/vendor/today', { mode, vp, dpr: 2, settle: 1500 });
  await h.evaluate(() => { const m = document.querySelector('.wl-main'); m.scrollTop = m.scrollHeight; }); await sleep(800);
  console.log('shot', await shot(h, `shots/stage-3/search/home-get-found-${mode}-${w}.png`));
  await h.close();
}
await b.close();
