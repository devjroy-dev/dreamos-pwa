// docs/review/tools/mocks.mjs · screenshots of the prototype page (docs/review/proto/page.tsx) inside the real shell.
// Copies the page into app/vendor/(shell)/review-proto/ for the run and removes it after, so no production path is
// left changed. Writes docs/review/mocks/.
import fs from 'fs';
import path from 'path';
import { browser, open, shot, sleep, ROOT } from './harness.mjs';
const DEST = path.join(ROOT, 'app/vendor/(shell)/review-proto');
const had = fs.existsSync(DEST);
fs.mkdirSync(DEST, { recursive: true });
fs.copyFileSync(path.join(ROOT, 'docs/review/proto/page.tsx'), path.join(DEST, 'page.tsx'));
const only = process.argv[2] || 'all';
const b = await browser();
const snap = async (screen, { palette = 'ledger', type = 'inter', mode = 'dark', vp = 'ios', rel, scale = 0 }) => {
  const p = await open(b, `/vendor/review-proto?screen=${screen}&palette=${palette}&type=${type}`, { mode, vp, wait: '.p-screen' });
  if (scale) { await p.addStyleTag({ content: `html{font-size:${scale}%}` }); await sleep(400); }
  await shot(p, rel); await p.close(); console.log(rel);
};
try {
  if (only === 'all' || only === 'palettes') for (const palette of ['ledger', 'slate', 'indigo']) for (const mode of ['dark', 'light']) for (const screen of ['today', 'leads', 'client'])
    await snap(screen, { palette, mode, rel: `mocks/palettes/${palette}-${mode}-${screen}.png` });
  if (only === 'all' || only === 'after') for (const mode of ['dark', 'light']) for (const screen of ['today', 'week', 'event', 'date', 'calendar', 'leads', 'lead', 'book', 'client', 'clients', 'money', 'invoice'])
    await snap(screen, { mode, rel: `mocks/after/${mode}-${screen}.png` });
  if (only === 'all' || only === 'android') for (const screen of ['today', 'lead', 'client']) await snap(screen, { vp: 'android', rel: `mocks/after/android-dark-${screen}.png` });
  if (only === 'all' || only === 'type') for (const [type, tag] of [['today', 'current-dm-sans'], ['inter', 'a-inter'], ['plex', 'b-plex-serif-name']]) {
    await snap('lead', { type, mode: 'light', rel: `mocks/type/${tag}-lead.png` });
    await snap('lead', { type, mode: 'light', scale: 130, rel: `mocks/type/${tag}-lead-large-text.png` });
  }
} finally {
  await b.close();
  if (!had) fs.rmSync(DEST, { recursive: true, force: true });
}
