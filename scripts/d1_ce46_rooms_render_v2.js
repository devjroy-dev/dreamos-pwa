#!/usr/bin/env node
// scripts/d1_ce46_rooms_render_v2.js · CE-46 · FE-5 · the chair's read of the rooms (30 Sept 2026), the rendered half.
// The real new layout (next dev, mock session, TDW_LAYOUT_DEFAULT=v2, the b123 fixtures through Claude Code's harness), at
// 374 x 812 in one theme per run (argv: dark | light):
//   R1 every room draws its add at the top in the ruled words, and no floating + (.wl-fab) is on the page;
//   R2 tapping the top button opens what the + opened (a sheet or menu appears);
//   R3 no short month ("3 Oct") and no age ("ago") in the page's text;
//   R4 Today: a chosen date is written out under the field in Indian order;
//   R5 Settings' inline "+" overlaps no other control;
//   R6 the New enquiry sheet parked below Enquiries is out of the keyboard's reach while closed, and back when opened.
// --mutate (one theme): M1 SliceShell's top button removed → R1 RED on the list rooms; the file restored byte for byte.
// One stop for the server and Chromium on every exit path (stop_tree.js).
process.env.TDW_LAYOUT_DEFAULT = 'v2';
process.env.PORT = process.env.PORT || '4100';
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const MODE = process.argv.includes('light') ? 'light' : 'dark';
const MUT = process.argv.includes('--mutate');
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']')); } };
// CE-47 L4 (FE-7), BY LABEL: Notes and Wedding pages draw the founder's "+" pill (RoomHeadAdd; FE-7's stand-in until
// L2), whose words carry the sign: "+ New note", "+ New wedding page"; and L4b's Expenses and TDS ("+ New expense",
// "+ New TDS entry"). The cell's shape is unchanged.
const ROOMS = [
  ['/vendor/more', 'Add'], ['/vendor/leads', 'New enquiry'], ['/vendor/clients', 'New client'], ['/vendor/invoices', 'New invoice'],
  ['/vendor/events', 'New event'], ['/vendor/expenses', 'New expense'], ['/vendor/calendar', 'New event'], ['/vendor/notes', 'New note'],
  ['/vendor/tds', 'New TDS entry'], ['/vendor/team', 'Add to Team'], ['/vendor/wedding-pages', 'New wedding page'], ['/vendor/contracts', 'New contract'],
];
const SHORT = /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?![a-z])/;

// FE-5 cut A2 (by label, CE-47 L1 red 6): the founder's Codespace has none of the harness's fixed browser paths, so
// puppeteer-core was given no executable. The browser is resolved as b140's probe resolves it: CHROME_BIN, then
// @sparticuz/chromium's executablePath (the estate's browser), then the harness's own fallbacks.
async function launch(H) {
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = usable(process.env.CHROME_BIN) ? process.env.CHROME_BIN : null;
  if (!bin) { try { const mod = await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js')); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) bin = p; } catch (_e) { /* the fallbacks below */ } }
  if (!bin) return H.browser();
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  return puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
}

async function run(onlyR1) {
  const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  let server = null, b = null, bpid = null; const out = { rooms: {} };
  try {
    server = await dev.start(ROOT, +process.env.PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${process.env.PORT}/__api` });
    if (!(await server.up())) { out.error = 'the dev server did not come up'; return out; }
    b = await launch(H); bpid = b.process() && b.process().pid;
    for (const [route, words] of ROOMS) {
      const p = await H.open(b, route, { mode: MODE, layout: 'v2', dpr: 1 });
      const r = await p.evaluate((words, shortSrc) => {
        const top = document.querySelector('[data-add-top]');
        const vis = (e) => !!e && e.offsetParent !== null && e.getBoundingClientRect().height > 0;
        const main = document.querySelector('main.wl-main') || document.body;
        const text = main.innerText || '';
        const overlays = () => Array.from(document.querySelectorAll('[role=dialog], [aria-modal="true"], .wl-addsheet, [data-sheet], [data-wl-sheet]')).filter(vis).length
          + Array.from(document.querySelectorAll('body *')).filter((e) => { const cs = getComputedStyle(e); if (cs.position !== 'fixed') return false; const q = e.getBoundingClientRect(); return q.height > innerHeight * 0.4 && q.width > innerWidth * 0.8 && cs.visibility !== 'hidden' && +cs.opacity > 0.05; }).length;
        return { top: top ? { text: top.innerText.trim(), vis: vis(top), y: Math.round(top.getBoundingClientRect().top) } : null,
          fab: Array.from(document.querySelectorAll('.wl-fab')).filter(vis).length, short: (text.match(new RegExp(shortSrc, 'g')) || []).slice(0, 3), ago: /\bago\b/.test(text), before: overlays() };
      }, words, SHORT.source);
      if (!onlyR1 && r.top) {
        await p.click('[data-add-top]').catch(() => {});
        await new Promise((res) => setTimeout(res, 900));
        r.after = await p.evaluate(() => {
          const vis = (e) => !!e && e.offsetParent !== null && e.getBoundingClientRect().height > 0;
          return Array.from(document.querySelectorAll('[role=dialog], [aria-modal="true"], .wl-addsheet, [data-sheet], [data-wl-sheet]')).filter(vis).length
            + Array.from(document.querySelectorAll('body *')).filter((e) => { const cs = getComputedStyle(e); if (cs.position !== 'fixed') return false; const q = e.getBoundingClientRect(); return q.height > innerHeight * 0.4 && q.width > innerWidth * 0.8 && cs.visibility !== 'hidden' && +cs.opacity > 0.05; }).length;
        });
      }
      out.rooms[route] = r;
      await p.close();
    }
    if (!onlyR1) {
      // R4 · Today's words line: the date set as a person sets it (React reads the input event)
      let p = await H.open(b, '/vendor/today', { mode: MODE, layout: 'v2', dpr: 1 });
      await p.evaluate(() => { const i = document.getElementById('wl-home-date'); if (!i) return; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, '2026-10-03'); i.dispatchEvent(new Event('input', { bubbles: true })); });
      await new Promise((res) => setTimeout(res, 500));
      out.today = await p.evaluate(() => { const w = document.querySelector('[data-date-words]'); const t = (document.querySelector('main') || document.body).innerText; return { words: w ? w.innerText.trim() : null, short: /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?![a-z])/.test(t), ago: /\bago\b/.test(t) }; });
      await p.close();
      // R5 · Settings' inline +
      p = await H.open(b, '/vendor/settings', { mode: MODE, layout: 'v2', dpr: 1 });
      out.settings = await p.evaluate(() => {
        const vis = (e) => e.offsetParent !== null && e.getBoundingClientRect().height > 0;
        const plus = Array.from(document.querySelectorAll('button')).filter((e) => vis(e) && e.innerText.trim() === '+');
        const ctrls = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role=switch]')).filter(vis);
        const hit = (a, c) => { const x = a.getBoundingClientRect(), y = c.getBoundingClientRect(); return x.left < y.right - 1 && y.left < x.right - 1 && x.top < y.bottom - 1 && y.top < x.bottom - 1; };
        return { plus: plus.length, overlaps: plus.flatMap((pl) => ctrls.filter((c) => c !== pl && !c.contains(pl) && !pl.contains(c) && hit(pl, c)).map((c) => (c.innerText || c.getAttribute('aria-label') || c.tagName).trim().slice(0, 30))) };
      });
      await p.close();
      // R6 · the parked Book sheet on Enquiries: is anything inside it reachable by the keyboard while it is closed?
      p = await H.open(b, '/vendor/leads', { mode: MODE, layout: 'v2', dpr: 1 });
      out.parked = await p.evaluate(() => {
        const focusable = Array.from(document.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')).filter((e) => !e.disabled && e.tabIndex >= 0);
        const hidden = (e) => { for (let a = e; a; a = a.parentElement) { if (a.inert || a.hasAttribute('inert') || a.getAttribute('aria-hidden') === 'true') return true; const cs = getComputedStyle(a); if (cs.visibility === 'hidden' || cs.display === 'none') return true; } return false; };
        const below = focusable.filter((e) => { const r = e.getBoundingClientRect(); return r.top >= innerHeight && getComputedStyle(e.closest('[style*="fixed"], .wl-sheet, [role=dialog]') || e).position === 'fixed' && !hidden(e); });
        return { reachable: below.length, sample: below.slice(0, 4).map((e) => (e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24)) };
      });
      // opened, its controls come back: New enquiry, then count the sheet's own reachable controls
      await p.click('[data-add-top]').catch(() => {}); await new Promise((res) => setTimeout(res, 700));
      out.parked.opened = await p.evaluate(() => { const sh = document.querySelector('[data-add-sheet]'); if (!sh || sh.inert || sh.getAttribute('aria-hidden') === 'true') return 0;
        return Array.from(sh.querySelectorAll('button, a[href], input, select, textarea')).filter((e) => !e.disabled && e.tabIndex >= 0).length; });
      await p.close();
    }
  } catch (e) { out.error = String((e && e.message) || e); }
  finally {
    if (b) { try { await b.close(); } catch (_e) { /* gone */ } }
    if (bpid) { try { stopTree(bpid); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } try { await server.stop(); } catch (_e) { /* gone */ } }
  }
  return out;
}

// the founder's option B (L2): the add is the room head's pill, drawn "+ <words>" (the sign, then the ruled words)
const r1 = (o, route, words) => { const r = o.rooms[route]; return !!r && !!r.top && r.top.vis && r.top.text.replace(/\s+/g, ' ') === '+ ' + words && r.fab === 0; };

(async () => {
  console.log(`d1 CE-46 rooms (v2) · the rendered half · 374 x 812 · ${MODE}`);
  if (MUT) {
    const F = path.join(ROOT, 'v2/components/vendor/slices/SliceShell.tsx'); const before = fs.readFileSync(F); const h = crypto.createHash('sha256').update(before).digest('hex');
    const restore = () => fs.writeFileSync(F, before); process.once('exit', restore);
    try {
      const t = before.toString(); const m = t.replace('<RoomHeadAdd addKey={slice} label={addOnTop} onAdd={onAdd} />', '');
      if (m === t) ok(false, 'M1 the anchor is absent');
      else { fs.writeFileSync(F, m); const o = await run(true); if (o.error) ok(false, 'M1 the room came up', o.error);
        else ok(['/vendor/leads', '/vendor/invoices', '/vendor/clients'].every((rt) => !r1(o, rt, ROOMS.find((x) => x[0] === rt)[1])), 'M1 SliceShell\u2019s pill registration removed \u2192 R1 RED on Enquiries, Invoices, Clients'); }
    } finally { restore(); ok(crypto.createHash('sha256').update(fs.readFileSync(F)).digest('hex') === h, 'M0 SliceShell.tsx restored byte for byte'); }
  } else {
    const o = await run(false);
    if (o.error) ok(false, '0.1 the rooms came up', o.error);
    for (const [route, words] of ROOMS) {
      const r = o.rooms[route] || {};
      ok(r1(o, route, words), `R1 ${route}: "+ ${words}" in the room head, no floating +`, JSON.stringify({ top: r.top, fab: r.fab }));
      ok(r.after > r.before, `R2 ${route}: tapping "${words}" opens what the + opened`, JSON.stringify({ before: r.before, after: r.after }));
      ok(Array.isArray(r.short) && r.short.length === 0 && r.ago === false, `R3 ${route}: no short month and no age on the page`, JSON.stringify({ short: r.short, ago: r.ago }));
    }
    ok(!!o.today && o.today.words === 'Saturday 3 October 2026' && !o.today.short && !o.today.ago, 'R4 Today: the chosen date written out under the field ("Saturday 3 October 2026"), no short month, no age', JSON.stringify(o.today));
    ok(!!o.settings && o.settings.overlaps.length === 0, 'R5 Settings\u2019 inline + overlaps no other control', JSON.stringify(o.settings));
    ok(!!o.parked && o.parked.reachable === 0, 'R6 the closed New enquiry sheet parked below Enquiries is out of the keyboard\u2019s reach (inert, aria-hidden)', JSON.stringify(o.parked));
    ok(!!o.parked && o.parked.opened > 0, 'R6b opened, the same sheet\u2019s controls are reachable again', JSON.stringify(o.parked));
  }
  console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 CE-46 rooms render (v2, ${MODE}${MUT ? ', --mutate' : ''}) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  process.exit(fail ? 1 : 0);
})();
