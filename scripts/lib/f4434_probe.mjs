// scripts/lib/f4434_probe.mjs — CE-44 · F-44.34 and F-44.37, driven in the real room.
//
// The act the founder performed: a lead that ALREADY has a package attached, whose package
// has the middle payment OFF, opened by CHANGE package; tick "Take a middle payment", type
// 40 into Middle payment (%), leave the deposit, tap Attach package. His toast said
// "Package attached." and nothing changed but middle_pct.
//
// This prints the REQUEST BODY that leaves the glass, the response, and what the sheet was
// showing before the tick. It also re-opens the sheet after the save to answer F-44.37:
// does CHANGE package seed from the couple's own live snapshot, or from the package?
import fs from 'fs';

const PORT = process.argv[2] || '3987';
async function resolveBrowser() {
  const usable = (p) => { if (!p) return false; try { fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; } };
  if (usable(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  try { const m = await import('@sparticuz/chromium'); const c = m.default || m; const p = await c.executablePath(); if (usable(p)) return p; } catch { /* next */ }
  const pw = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  return usable(pw) ? pw : null;
}
const puppeteer = (await import('../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js')).default;

const V = '00000000-0000-0000-0000-000000000000';
const LEAD = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
const PKG = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb';

// The package as the server holds it: middle OFF, deposit 30. Exactly his case.
const pkg = {
  id: PKG, vendor_id: V, name: 'Pre wedding shoot', description: 'A day of it',
  total: 50000, line_items: [], is_default: true,
  deposit_pct: 30, middle_pct: 30, middle_enabled: false,
  delivery_basis: 'on_the_day', delivery_days: null,
  created_at: '2026-09-01T00:00:00.000Z', updated_at: '2026-09-01T00:00:00.000Z',
};
// The couple's LIVE row, so the sheet opens as CHANGE package.
const livePkg = {
  id: 'cccccccc-3333-4333-8333-cccccccccccc', lead_id: LEAD, package_id: PKG,
  // The snapshot's FULL shape (vendor.ts:320). `tells` is an array the card calls
  // .includes() on; omitting it threw and sent the room to its error screen.
  // DELIBERATELY DIFFERENT FROM THE PACKAGE: the couple already has middle ON at 45.
  // If the sheet opens showing the package's 30/off, it is seeding from the package and
  // not from her own live row, which is F-44.37.
  snapshot: { ...pkg, middle_pct: 45, middle_enabled: true, source_package_id: PKG, source_seeded_from: null, tells: [] },
  total: 50000, updated_at: '2026-09-17T18:37:37.000Z',
  schedule: [{ label: 'Deposit', pct: 30, amount: 15000 }, { label: 'On delivery', pct: 70, amount: 35000 }],
  delivery_on: null, quoted_at: '2026-09-17T18:37:37.000Z', created_at: '2026-09-17T18:37:37.000Z',
};
const lead = {
  id: LEAD, name: 'Dev Test 3i b', phone: '+919888294440',
  wedding_date: '2027-03-14', wedding_date_precision: 'day', wedding_city: 'Delhi',
  budget_total: 50000, budget_min: null, budget_max: 50000,
  state: 'quoted', source: 'direct', referrer: null, raw_message: null, notes: null,
  created_at: '2026-09-17T04:00:00.000Z', draft: { missing: [] },
};
const json = (o) => ({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });

const out = { sent: null, response: null, beforeTick: null, reopened: null };
const BIN = await resolveBrowser();
if (!BIN) { console.log(JSON.stringify({ error: 'no browser' })); process.exit(0); }
const b = await puppeteer.launch({ executablePath: BIN, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    // THE ATTACH DOOR: capture the body verbatim, then answer as the server would.
    if (route === `/api/v2/vendor/leads/${LEAD}/package` && r.method() === 'POST') {
      out.sent = r.postData() || null;
      let body = {};
      try { body = JSON.parse(out.sent || '{}'); } catch { /* keep raw */ }
      // The server merges the overlay onto the package, then computes the schedule.
      const merged = { ...pkg, source_package_id: PKG, source_seeded_from: null, tells: [], ...body };
      const on = merged.middle_enabled === true;
      const dep = Number(merged.deposit_pct);
      const mid = Number(merged.middle_pct);
      const schedule = on
        ? [{ label: 'Deposit', pct: dep }, { label: 'Middle', pct: mid }, { label: 'On delivery', pct: 100 - dep - mid }]
        : [{ label: 'Deposit', pct: dep }, { label: 'On delivery', pct: 100 - dep }];
      const row = { ...livePkg, snapshot: merged, schedule };
      out.response = { stored_deposit: merged.deposit_pct, stored_middle_pct: merged.middle_pct, stored_middle_enabled: merged.middle_enabled, payments: schedule.length };
      livePkg.snapshot = merged; livePkg.schedule = schedule;
      return r.respond(json({ ok: true, lead_package: row }));
    }
    if (route === '/api/v2/vendor/me') return r.respond(json({ ok: true, vendor: { id: V, business_name: 'Probe', category: 'photography', tier: 'signature' } }));
    if (route === `/api/v2/vendor/leads/${V}`) return r.respond(json({ ok: true, leads: [lead], total: 1 }));
    if (route === `/api/v2/vendor/cabinet/${V}`) return r.respond(json({ ok: true, clients: [], prospects: [], archived: [] }));
    if (route === '/api/v2/vendor/packages') {
      // STALE-MEMORY ARM (env STALE=1): the list answers as it did BEFORE she turned the
      // package's middle payment off in the Packages room. The cache
      // (LeadPackageCard.tsx:51) is reset only on entering and leaving the Leads slice,
      // so a list read before that edit is what the sheet still believes.
      const listed = process.env.STALE === '1' ? { ...pkg, middle_enabled: true, middle_pct: 30 } : pkg;
      return r.respond(json({ ok: true, packages: [listed], seeding: { seeded: false, reason: 'probe' } }));
    }
    if (route === `/api/v2/vendor/leads/${LEAD}/detail`) return r.respond(json({ ok: true, lead, vendor_summary: null, conversation: [], invoices: [], events: [] }));
    if (route === `/api/v2/vendor/leads/${LEAD}/package`) return r.respond(json({ ok: true, lead_package: livePkg }));
    return r.respond(json({ ok: true }));
  });

  const settle = (ms) => new Promise((r) => setTimeout(r, ms));
  const tap = (nd) => p.evaluate((n) => {
    const els = [...document.querySelectorAll('button,[role="button"],a')];
    const e = els.find((x) => x.textContent && x.textContent.toLowerCase().includes(n) && x.getBoundingClientRect().width > 0);
    if (e) { e.click(); return true; } return false;
  }, nd.toLowerCase());
  const readSheet = () => p.evaluate(() => {
    // The layer that actually HOLDS the fields. A closed `attach-sheet` layer stays in
    // the tree, so selecting it by name grabs an empty box and every read returns null.
    const box = (() => { const ls = [...document.querySelectorAll('[data-sheet-layer]')];
      return ls.find((l) => l.querySelector('#att-dep')) || ls.find((l) => l.querySelector('#att-pkg')) || null; })() || document;
    const g = (id) => { const e = box.querySelector('#' + id); return e ? e.value : null; };
    const cb = [...box.querySelectorAll('input[type="checkbox"]')].filter((c) => c.getBoundingClientRect().width > 0);
    return { deposit: g('att-dep'), middle: g('att-mid'), basis: g('att-basis'), days: g('att-days'),
             middleTicked: cb.length ? cb[0].checked : null, fee: g('att-fee') };
  });

  p.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE:', m.text().slice(0, 200)); });
  p.on('pageerror', (e) => console.error('PAGEERR:', String(e).slice(0, 200)));
  p.on('requestfailed', (r) => console.error('REQFAIL:', r.url().slice(0, 120)));
  await p.goto(`http://localhost:${PORT}/vendor/leads`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(7000);
  out.beforeRow = await p.evaluate(() => [...document.querySelectorAll('button')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 24)).slice(0, 18));
  await tap('dev test 3i b'); await settle(2600);
  await tap('all details'); await settle(1600);
  out.controls = await p.evaluate(() => [...document.querySelectorAll('button,[role="button"]')]
    .filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 26)));
  await tap('change package'); await settle(2600);

  // WHAT THE SHEET SHOWS BEFORE SHE TOUCHES ANYTHING. This is F-44.37's answer and the
  // first half of F-44.34's: the couple's live snapshot, or the package's own values?
  out.beforeTick = await readSheet();

  // Her act: tick the middle on, type 40, leave the deposit alone.
  await p.evaluate(() => {
    const box = (() => { const ls = [...document.querySelectorAll('[data-sheet-layer]')];
      return ls.find((l) => l.querySelector('#att-dep')) || ls.find((l) => l.querySelector('#att-pkg')) || null; })() || document;
    const cb = [...box.querySelectorAll('input[type="checkbox"]')].filter((c) => c.getBoundingClientRect().width > 0)[0];
    if (cb && !cb.checked) cb.click();
    const el = box.querySelector('#att-mid');
    if (el) {
      const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      set.call(el, '40'); el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await settle(700);
  out.afterTick = await readSheet();
  out.sheetButtons = await p.evaluate(() => [...document.querySelectorAll('button')]
    .filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 24)).slice(-6));
  // SCOPED: two visible "Attach package" buttons exist (the booking sheet keeps one in
  // the tree). Click the one inside the attach sheet's own layer, or nothing is proved.
  const tapped = await p.evaluate(() => {
    const box = (() => { const ls = [...document.querySelectorAll('[data-sheet-layer]')];
      return ls.find((l) => l.querySelector('#att-dep')) || ls.find((l) => l.querySelector('#att-pkg')) || null; })();
    const b = box ? [...box.querySelectorAll('button')].find((x) => /attach package/i.test(x.textContent || '')) : null;
    if (b) { b.click(); return true; }
    return false;
  });
  out.attachTapped = tapped;
  await settle(2800);

  // F-44.37: re-open and see whose numbers come back.
  await tap('change package'); await settle(2600);
  out.reopened = await readSheet();

  // (3)'s own cell: re-save WITHOUT touching a thing. Her row must come back unchanged in
  // every field. A sheet that sends everything but seeds from the package would overwrite
  // her fee and her wording here, which is why (1) and (3) are one cure and not two.
  const tapAttach = () => p.evaluate(() => {
    const ls = [...document.querySelectorAll('[data-sheet-layer]')];
    const box = ls.find((l) => l.querySelector('#att-dep'));
    const b = box ? [...box.querySelectorAll('button')].find((x) => /attach package/i.test(x.textContent || '')) : null;
    if (b) { b.click(); return true; } return false;
  });
  await tapAttach(); await settle(2600);
  out.resaved = { sent: out.sent, stored: out.response };
} catch (e) {
  out.error = String(e && e.message).split('\n')[0];
} finally { await b.close(); }
console.log(JSON.stringify(out));
