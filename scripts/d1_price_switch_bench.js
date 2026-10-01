#!/usr/bin/env node
// scripts/d1_price_switch_bench.js · CE-47 · FE-5 · THE PRICE SWITCH (ELZ-3 · 0183; the chair's words and place).
// Your website in BOTH layouts (next dev, mock session, the b123 fixtures through Claude Code's harness), 374 x 812, /me
// answered here with price_share_enabled:
//   P1 "Share approximate prices in chat" is drawn as a switch directly after the date switch, off when her row says off;
//   P2 a tap sends PATCH /me { price_share_enabled: true } and the switch settles on the door's echo (on);
//   P3 a refusal from the door puts the switch back (off);
//   P4 on when her row says on.
// --mutate: M1 the switch reads the date flag instead of its own → P4 RED; restored byte for byte.
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
process.env.PORT = process.env.PORT || '4162';
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const MUT = process.argv.includes('--mutate');
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']')); } };
const WORDS = 'Share approximate prices in chat';

async function run(layouts) {
  const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  let server = null, b = null, bpid = null; const out = {};
  try {
    server = await dev.start(ROOT, +process.env.PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${process.env.PORT}/__api` });
    if (!(await server.up())) { out.error = 'the dev server did not come up'; return out; }
    b = await H.browser(); bpid = b.process() && b.process().pid;
    for (const layout of layouts) {
      const r = {};
      for (const scen of ['off', 'on', 'refuse']) {
        const p = await b.newPage();
        await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true });
        await p.setCookie({ name: 'tdw_wl_mode', value: 'dark', domain: 'localhost', path: '/' }, { name: 'tdw_layout', value: layout, domain: 'localhost', path: '/' });
        const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
        const sent = [];
        await p.setRequestInterception(true);
        p.on('request', (q) => {
          const u = q.url(); if (!u.includes('/__api/')) return q.continue();
          const rt = u.split('/__api')[1].split('?')[0];
          const J = (o, st = 200) => q.respond({ status: st, contentType: 'application/json', body: JSON.stringify(o) });
          if (rt === '/api/v2/vendor/me' && q.method() === 'GET') { const base = H.answer(rt) || { ok: true, vendor: {} }; return J({ ...base, vendor: { ...(base.vendor || {}), capacity_reason: null, date_check_enabled: true, price_share_enabled: scen === 'on' } }); }   // capacity_reason null: a trade that can answer, so the date switch is drawn
          if (rt === '/api/v2/vendor/me' && q.method() === 'PATCH') { let bd = null; try { bd = JSON.parse(q.postData() || 'null'); } catch (_e) {} sent.push(bd);
            if (scen === 'refuse') return J({ ok: false, error: 'invalid' }, 400);
            return J({ ok: true, vendor: { price_share_enabled: bd && bd.price_share_enabled === true } }); }
          return J(q.method() === 'GET' ? H.answer(rt) : { ok: true });
        });
        await p.goto(`http://localhost:${process.env.PORT}/vendor/your-website`, { waitUntil: 'domcontentloaded', timeout: 240000 });
        for (let i = 0; i < 400 && !(await p.evaluate(() => !!document.querySelector('[data-price-switch]')).catch(() => false)); i++) await new Promise((res) => setTimeout(res, 300));
        await new Promise((res) => setTimeout(res, 1200));
        const read = () => p.evaluate(() => { const s = document.querySelector('[data-price-switch]'); if (!s) return null;
          // beside the date switch: the nearest switch before it is the date switch (its one fine line may sit between)
          let prev = s.previousElementSibling; let hops = 0; while (prev && prev.getAttribute('role') !== 'switch' && hops < 2) { prev = prev.previousElementSibling; hops++; }
          return { text: s.innerText.trim(), checked: s.getAttribute('aria-checked'), role: s.getAttribute('role'),
            afterDate: !!prev && prev.getAttribute('role') === 'switch' && /check a date/i.test(prev.innerText) }; });
        r[scen] = { before: await read() };
        if (scen !== 'on') { await p.click('[data-price-switch]').catch(() => {}); await new Promise((res) => setTimeout(res, 900)); r[scen].after = await read(); r[scen].sent = sent; }
        await p.close();
      }
      out[layout] = r;
    }
  } catch (e) { out.error = String((e && e.message) || e); }
  finally {
    if (b) { try { await b.close(); } catch (_e) { /* gone */ } }
    if (bpid) { try { stopTree(bpid); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } try { await server.stop(); } catch (_e) { /* gone */ } }
  }
  return out;
}
const J = (x) => JSON.stringify(x);
function cells(o, l) {
  const r = o[l] || {}; const off = r.off || {}, on = r.on || {}, rf = r.refuse || {};
  return {
    P1: [!!off.before && off.before.text === WORDS && off.before.role === 'switch' && off.before.checked === 'false' && off.before.afterDate, `${l} P1 "${WORDS}" is a switch right after the date switch (its fine line between), off when her row says off`, J(off.before)],
    P2: [J(off.sent) === J([{ price_share_enabled: true }]) && !!off.after && off.after.checked === 'true', `${l} P2 a tap sends { price_share_enabled: true } and settles on the echo (on)`, J({ sent: off.sent, after: off.after })],
    P3: [!!rf.after && rf.after.checked === 'false', `${l} P3 a refusal puts it back (off)`, J(rf.after)],
    P4: [!!on.before && on.before.checked === 'true', `${l} P4 on when her row says on`, J(on.before)],
  };
}
(async () => {
  const { stripComments } = await import(path.join(ROOT, 'scripts/lib/stripComments.mjs'));
  console.log('d1 price switch · both layouts');
  if (MUT) {
    const F = path.join(ROOT, 'v2/app/vendor/(shell)/your-website/screen.tsx'); const before = fs.readFileSync(F);
    const restore = () => fs.writeFileSync(F, before); process.once('exit', restore);
    try { const t = before.toString(); const from = 'const live = on ?? current.price_share_enabled;'; if (!stripComments(t).includes(from)) ok(false, 'M1 the anchor is absent');   // the anchor must be code (scripts/lib/stripComments.mjs)
      else { fs.writeFileSync(F, t.replace(from, 'const live = on ?? current.date_check_enabled;')); const o = await run(['v2']); if (o.error) ok(false, 'M1 crashed', o.error); else ok(!cells(o, 'v2').P4[0] || !cells(o, 'v2').P1[0], 'M1 the switch reads the date flag → P1 or P4 RED', J(o.v2 && o.v2.on)); }
    } finally { restore(); ok(crypto.createHash('sha256').update(fs.readFileSync(F)).digest('hex') === crypto.createHash('sha256').update(before).digest('hex'), 'M0 the screen restored byte for byte'); }
  } else {
    const o = await run(['v2', 'classic']);
    if (o.error) ok(false, '0.1 Your website came up', o.error);
    for (const l of ['v2', 'classic']) for (const [, [c, n, i]] of Object.entries(cells(o, l))) ok(c, n, i);
  }
  console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 price switch ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  process.exit(fail ? 1 : 0);
})();
