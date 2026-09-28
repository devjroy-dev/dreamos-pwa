// docs/review/tools/explore.mjs · walk a route by visible text, screenshot each step, list what can be tapped next.
// usage: node explore.mjs ROUTE "text1>>text2>>..." OUTPREFIX [mode] [vp]
//   a step "sel:CSS" taps the first visible match of a CSS selector; "type:CSS=value" types into a field;
//   "scroll:N" scrolls the page or the open sheet by N px; "back" goes back.
import { browser, open, shot, sleep } from './harness.mjs';
const [route, stepsArg = '', prefix = 'explore/x', mode = 'dark', vp = 'ios'] = process.argv.slice(2);
const steps = stepsArg ? stepsArg.split('>>') : [];
const b = await browser();
const p = await open(b, route, { mode, vp });
const clickables = () => p.evaluate(() => [...document.querySelectorAll('a,button,[role=button],[role=tab],[role=option],input,select,textarea,li[tabindex],div[tabindex]')].filter((e) => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && b.bottom > 0 && b.top < innerHeight * 4; }).map((e) => { const b = e.getBoundingClientRect(); return `${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''} [${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}x${Math.round(b.height)}] ${((e.innerText || e.getAttribute('aria-label') || e.placeholder || '').trim().replace(/\s+/g, ' ')).slice(0, 60)}`; }));
let i = 0;
await shot(p, `${prefix}-0.png`);
for (const s of steps) {
  i += 1;
  let ok = true;
  if (s.startsWith('sel:')) {
    ok = await p.evaluate((q) => { const el = [...document.querySelectorAll(q)].find((e) => e.getBoundingClientRect().width > 0); if (!el) return false; el.scrollIntoView({ block: 'center' }); el.click(); return true; }, s.slice(4));
  } else if (s.startsWith('type:')) {
    const [q, v] = s.slice(5).split('=');
    const h = await p.$(q); if (h) { await h.click({ clickCount: 3 }); await h.type(v, { delay: 10 }); } else ok = false;
  } else if (s.startsWith('scroll:')) {
    await p.evaluate((n) => { const sh = [...document.querySelectorAll('body *')].filter((e) => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().height > 100).sort((a, c) => (+getComputedStyle(c).zIndex || 0) - (+getComputedStyle(a).zIndex || 0) || c.getBoundingClientRect().top - a.getBoundingClientRect().top)[0]; (sh || document.scrollingElement).scrollBy(0, n); }, +s.slice(7));
  } else if (s === 'back') { await p.goBack(); }
  else if (s.startsWith('wait:')) { await sleep(+s.slice(5)); }
  else {
    ok = await p.evaluate((txt) => {
      const rx = new RegExp(txt, 'i');
      const cand = [...document.querySelectorAll('a,button,[role=button],[role=tab],[role=option],li,div,span,summary,label')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && rx.test((e.innerText || e.getAttribute('aria-label') || '').trim()); });
      // the smallest element whose text matches, then its nearest clickable ancestor
      cand.sort((a, c) => (a.innerText || '').length - (c.innerText || '').length);
      const el = cand[0]; if (!el) return false;
      const C = 'a,button,[role=button],[role=tab],[role=option],[tabindex]'; const t = el.closest(C) || el.querySelector(C) || el;
      t.scrollIntoView({ block: 'center' }); t.click(); return true;
    }, s);
  }
  await sleep(1300);
  await shot(p, `${prefix}-${i}.png`);
  console.log(`step ${i} ${s} ${ok ? 'OK' : 'NOT FOUND'} url=${p.url().replace(/^https?:\/\/[^/]+/, '')}`);
}
console.log((await clickables()).join('\n'));
await b.close();
