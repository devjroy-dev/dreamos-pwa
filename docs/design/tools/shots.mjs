// docs/design/tools/shots.mjs · the stage's before-and-after screenshots: Today, Enquiries, Calendar, a client and
// Money, at 374x812 and 360x800, in both themes. Run it against a server on main for "before" and on the stage's
// branch for "after".
//
// usage: PORT=4200 node docs/design/tools/shots.mjs <before|after> <stage-n> [--large]
// writes docs/design/shots/<stage-n>/<before|after>/<screen>-<mode>-<374|360>.png
import { browser, open, shot, sleep } from './harness.mjs';

const [which = 'after', stage = 'stage-1'] = process.argv.slice(2);
const LARGE = process.argv.includes('--large');

// Each screen: the routes to try in order (the first that draws a room wins, so the same script serves a stage
// that moved a room), then an optional step that opens the record.
const SCREENS = [
  { name: 'today', routes: ['/vendor/today'] },
  { name: 'enquiries', routes: ['/vendor/enquiries', '/vendor/leads'] },
  { name: 'calendar', routes: ['/vendor/calendar'] },
  { name: 'client', routes: ['/vendor/clients'], open: 'Meera' },
  { name: 'money', routes: ['/vendor/money', '/vendor/invoices'] },
];

async function openRecord(p, text) {
  return p.evaluate((txt) => {
    const rx = new RegExp(txt, 'i');
    const cand = [...document.querySelectorAll('.wl-main a, .wl-main button, .wl-main [role=button], .wl-main li, .wl-main div')]
      .filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && rx.test(e.innerText || ''); })
      .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
    const el = cand[0] && (cand[0].closest('a,button,[role=button]') || cand[0]);
    if (!el) return false;
    el.scrollIntoView({ block: 'center' }); el.click(); return true;
  }, text);
}

const b = await browser();
for (const mode of ['dark', 'light']) for (const vp of ['ios', 'android']) for (const s of SCREENS) {
  let p = null;
  for (const r of s.routes) {
    const q = await open(b, r, { mode, vp, dpr: 2, settle: 1200 });
    const ok = await q.evaluate(() => !!document.querySelector('.wl-main') && !/404|could not be found/i.test(document.title + (document.querySelector('.wl-main')?.innerText || '').slice(0, 80)));
    if (ok) { p = q; break; }
    await q.close();
  }
  if (!p) { console.log('MISSING', s.name, mode, vp); continue; }
  if (LARGE) { await p.addStyleTag({ content: 'html{font-size:130%!important}' }); await sleep(400); }
  if (s.open) { await openRecord(p, s.open); await sleep(1400); }
  const w = vp === 'ios' ? 374 : 360;
  const rel = await shot(p, `shots/${stage}/${which}/${s.name}-${mode}-${w}${LARGE ? '-large' : ''}.png`);
  console.log('shot', rel);
  await p.close();
}
await b.close();
