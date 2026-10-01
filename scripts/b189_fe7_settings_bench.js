#!/usr/bin/env node
'use strict';
// scripts/b189_fe7_settings_bench.js · Settings · L4b (FE-7) · board 6. §1 source: SettingsScreen's optional `only`
// through SCard's context (default: every section, so every other caller is unchanged); the enquiry link in a CopyBox
// (R-46.17); the new layout's routing lines say "clients" (classic's copy untouched). §2 standing checks. §3 the five
// groups in order; each row its current value; Profile layout the legacy link; the switch in its row; tapping a row
// opens ONLY that section (Business shows its fields and not Payments'; Payments the reverse); Where enquiries go opens
// its routing with "Clients message ..."; no "couple". §8 M1 SCard ignores `only` (3.4 red); M2 a routing line says
// "Couples" again (3.5 red).
const K = require('./lib/fe7_l4_kit.js');
const F = 'v2/app/vendor/(shell)/settings/page.tsx';
async function sheet(g, rowTitle) {
  const p = await K.open(g, '/vendor/settings', { wait: '.fr-row .fr-f' });
  await K.tap(p, rowTitle); await new Promise((q) => setTimeout(q, 1200));
  const t = await p.evaluate(() => { const s = document.querySelector('.wl-sheet, [role=dialog]'); return s ? s.innerText : ''; });
  await p.close(); return t;
}
K.runBench({
  tag: 'b189', port: Number(process.env.B189_PORT || 4189), urls: ['/vendor/settings'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const af = K.code('v2/components/vendor/AtelierForm.tsx'); const ss = K.code('v2/components/vendor/SettingsScreen.tsx');
    ok(/SCardOnly = React\.createContext<string \| null>\(null\)/.test(af) && /if \(only && only !== title\) return null;/.test(af) && /only = null/.test(ss) && /<SCardOnly\.Provider value=\{only\}>/.test(ss), '1.1 one section by SCard\'s context; default every section');
    ok(/<CopyBox text=\{waLink\}/.test(ss), '1.2 the enquiry link sits in a CopyBox (R-46.17)');
    const v2 = K.code('v2/lib/worklist/enquiryRouting.ts'); const cl = K.code('lib/worklist/enquiryRouting.ts');
    ok(!/\bcouples?\b/i.test(v2) && /Couples message/.test(cl), '1.3 the new layout\'s routing lines say clients; classic\'s copy untouched');
  },
  async glass(g, ok, sec) {
    sec('2 THE STANDING CHECKS'); await K.standing(g, ok, 'Settings', '/vendor/settings');
    sec('3 THE ROOM');
    const p = await K.open(g, '/vendor/settings', { wait: '.fr-row .fr-f' });
    const heads = await p.evaluate(() => [...document.querySelectorAll('.fr-h')].map((h) => h.textContent.trim()));
    const rows = await p.evaluate(() => [...document.querySelectorAll('.fr-row')].map((e) => ({ t: (e.querySelector('.fr-t') || {}).textContent, f: (e.querySelector('.fr-f') || {}).textContent, href: e.getAttribute('href') })));
    const sw = await p.evaluate(() => !!document.querySelector('.set-sw .wl-sw'));
    await p.close();
    ok(heads.join('|') === 'Your business|Enquiries|Money|Your work|Account', '3.1 the five groups, in order', heads.join('|'));
    const b = rows.find((x) => x.t === 'Business'); const pl = rows.find((x) => x.t === 'Profile layout'); const wq = rows.find((x) => x.t === 'Where enquiries go');
    ok(b && b.f === 'Probe Studio' && wq && wq.f === 'Your TDW agent answers', '3.2 each row shows its current value', `${b && b.f} / ${wq && wq.f}`);
    ok(pl && pl.href === '/vendor/discover/preview' && sw, '3.3 Profile layout the legacy link; the switch in its row');
    const bs = await sheet(g, 'Business'); const ps = await sheet(g, 'Payments');
    ok(/Your name/.test(bs) && !/UPI ID/.test(bs) && /UPI ID/.test(ps) && !/Your name/.test(ps), '3.4 a row opens only its own section');
    const es = await sheet(g, 'Where enquiries go');
    ok(/Clients message TDW/.test(es) && !/\bcouples?\b/i.test(es), '3.5 Where enquiries go opens its routing, and says clients', es.slice(0, 120));
  },
  mutations: [
    { name: 'M1 SCard ignores `only`', rel: 'v2/components/vendor/AtelierForm.tsx', from: 'if (only && only !== title) return null;', to: 'void only;', glass: true,
      cell: async (g) => { const bs = await sheet(g, 'Business'); return /Your name/.test(bs) && !/UPI ID/.test(bs); } },
    { name: 'M2 a routing line says "Couples" again', rel: 'v2/lib/worklist/enquiryRouting.ts', from: "'Clients message TDW\u2019s number.", to: "'Couples message TDW\u2019s number.", glass: true,
      cell: async (g) => { const es = await sheet(g, 'Where enquiries go'); return /Clients message TDW/.test(es) && !/\bcouples?\b/i.test(es); } },
  ],
});
