import { browser, open, shot } from './harness.mjs';
const b = await browser();
for (const r of ['/vendor/pin-login', '/vendor/onboarding', '/vendor/discover', '/vendor/discover/profile']) {
  for (const mode of ['dark', 'light']) {
    const p = await open(b, r, { mode, wait: 'body', settle: 5000 });
    await shot(p, `screenshots/rooms/legacy-${r.replace('/vendor/', '').replace('/', '-')}-${mode}-ios.png`); await p.close(); console.log(r, mode);
  }
}
await b.close();
