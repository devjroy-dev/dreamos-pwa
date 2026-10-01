#!/usr/bin/env node
'use strict';
// docs/design/tools/fe7_l4_shots.js · TDW CE-47 · L4 (FE-7) · the render shots the sprint asks for: every L4 room from the
// built tree, at 374 and 360, dark, its top and its end, into docs/design/fe7/. Same kit, fixtures and discipline as
// the benches, and kept outside scripts/ so the floor's glob never runs it (one server, one browser, both stopped on every exit path; the leftovers read at the end).
const fs = require('fs'); const path = require('path');
const K = require('../../../scripts/lib/fe7_l4_kit.js');
const OUT = path.join(K.ROOT, 'docs/design/fe7');
const ROOMS = [
  ['open-dates-and-rates', '/vendor/dates', '.fr-row'],
  ['introductions', '/vendor/introductions', '.fr-row .fr-f'],
  ['influencer-exchange', '/vendor/exchange', '.fr-row .fr-f'],
  ['wedding-pages', '/vendor/wedding-pages', '.fr-row .fr-f'],
  ['google-reviews', '/vendor/google-reviews', '.fr-row .fr-f'],
  ['advisor', '/vendor/advisor', '.wl-advbody'],
  ['business-solutions', '/vendor/support', '.fr-row .fr-f'],
  ['referrals', '/vendor/referrals', '.fr-row .fr-f'],
  ['notes', '/vendor/notes', '.fr-row .fr-f'],
  ['onboarding', '/vendor/onboarding', '.ob-in', { ob: true }],
  ['expenses', '/vendor/expenses', '.fr-row .fr-f'],
  ['tds', '/vendor/tds', '.fr-row .fr-f'],
  ['books', '/vendor/books', '.fr-row .fr-f'],
  ['payment-reminders', '/vendor/payment-reminders', '.fr-row .fr-f'],
  ['settings', '/vendor/settings', '.fr-row .fr-f'],
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let shot = 0; let bad = 0;
  const g = await K.startGlass(Number(process.env.SHOTS_PORT || 4190));
  if (!g) { console.log('FAIL the dev server came up'); process.exit(1); }
  await K.warm(g, ROOMS.filter((r) => !(process.env.SHOTS_ONLY || '') || (process.env.SHOTS_ONLY || '').split(',').includes(r[0])).map((r) => r[1]));
  const only = (process.env.SHOTS_ONLY || '').split(',').filter(Boolean);   // SHOTS_ONLY=onboarding re-shoots just that room
  for (const [name, url, wait, scen] of ROOMS.filter((r) => !only.length || only.includes(r[0]))) {
    for (const w of [374, 360]) {
      for (const at of ['top', 'end']) {
        const p = await K.open(g, url, { width: w, height: 812, wait, scen, settle: 1400 });
        if (!p.found) { bad += 1; console.log(`FAIL ${name} ${w} ${at}: did not draw`); await p.close(); continue; }
        if (at === 'end') { await p.evaluate(() => { const m = document.querySelector('.wl-main'); if (m) m.scrollTop = m.scrollHeight; window.scrollTo(0, document.body.scrollHeight); }); await new Promise((r) => setTimeout(r, 500)); }
        const file = path.join(OUT, `${name}-${w}-${at}.png`);
        await p.screenshot({ path: file }); shot += 1; await p.close();
      }
    }
  }
  const portFree = await K.stopGlass(); await new Promise((r) => setTimeout(r, 800));
  const left = K.leftovers();
  console.log(`shots: ${shot} written, ${bad} failed; port free ${portFree}; leftovers ${left.length}`);
  process.exit(bad || !portFree || left.length ? 1 : 0);
})().catch((e) => { console.log('FAIL', e && e.message); process.exit(1); });
