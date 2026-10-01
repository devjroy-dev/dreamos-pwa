#!/usr/bin/env node
// scripts/d1_overlap_bench_v2.js · CE-47 · FE-5 · THE FOUNDER'S COMPLAINT (30 Sept 2026): "it should not overlap with
// other buttons or texts". On glass, every route of the landing's room table (docs/design/tools/roomtable.mjs), in the
// new layout, at 360 x 800 and 374 x 812, dark and light, at rest and scrolled to the end:
//   O1 no position:fixed or sticky control's box covers any button, link, chip or text that sits in the page's visible
//      area (the page's own sticky bands count as the edge of that area, the way a header does);
//   O2 at the end of the page the last row sits wholly above the Ask bar and the tabs;
//   O3 (the founder, the same day) no drawn time reads as a 24-hour clock: no "19:00" without am or pm after it.
// Slices and a ledger, so every run fits in a turn: --from=N --to=M (room-table rows), --widths, --modes; each state's
// verdict is written to the ledger (B_LEDGER, default /tmp/d1_overlap_ledger.json) and --report reads the whole
// ledger, reds any row not yet run, and gives the verdict. One stop for the server and Chromium on every exit path.
process.env.TDW_LAYOUT_DEFAULT = 'v2';
process.env.PORT = process.env.PORT || '4100';
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const LEDGER = process.env.B_LEDGER || '/tmp/d1_overlap_ledger.json';
// the room table is CODE: its routes are read with the estate's one comment stripper (scripts/lib/stripComments.mjs,
// F-07.74), loaded before anything reads it (see the start of the run below)
let ROUTES = [];
function readRoutes(stripComments) {
  ROUTES = (stripComments(fs.readFileSync(path.join(ROOT, 'docs/design/tools/roomtable.mjs'), 'utf8')).match(/\['[a-z0-9-]+', '[^']+', '\/[^']*'\]/g) || [])
  .map((x) => x.match(/'(\/[^']*)'\]$/)[1]);
}
const WIDTHS = arg('widths', '360,374').split(',').map(Number);
const MODES = arg('modes', 'dark,light').split(',');
const VP = { 360: 'android', 374: 'ios' };
const readLedger = () => { try { return JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (_e) { return {}; } };

function report() {
  const L = readLedger(); let pass = 0, fail = 0; const failed = [];
  for (const r of ROUTES) for (const w of WIDTHS) for (const m of MODES) for (const cell of ['O1', 'O2', 'O3']) {
    const k = `${r} ${w} ${m}`; const v = L[k];
    const ok = !!v && !v.error && v[cell] && v[cell].ok;
    if (ok) pass++; else { fail++; failed.push(`${cell} [${k}] ${v ? (v.error || JSON.stringify(v[cell] && v[cell].why).slice(0, 200)) : 'not run'}`); }
  }
  console.log(`d1 overlap (v2) · ${ROUTES.length} routes x ${WIDTHS.length} widths x ${MODES.length} themes · ledger ${LEDGER}`);
  for (const f of failed.slice(0, 60)) console.log('  FAIL  ' + f);
  console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 overlap (v2) ${pass}/${pass + fail}`);
  process.exit(fail ? 1 : 0);
}

// In the page: the fixed or sticky CONTROLS, and every button, link, chip and text leaf in the visible area
function measure() {
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let a = e; a; a = a.parentElement) { if (a.inert || a.getAttribute('aria-hidden') === 'true') return false; const cs = getComputedStyle(a); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.05) return false; } return true; };
  const main = document.querySelector('main.wl-main') || document.querySelector('main');
  const mr = main ? main.getBoundingClientRect() : { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
  // the page's own sticky bands (a filter rail stuck at the top of the page) are the edge of the visible area
  let top = Math.max(0, mr.top), bottom = Math.min(innerHeight, mr.bottom);
  const floaters = [];
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e); if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    if (!vis(e)) continue;
    const r = e.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= innerHeight) continue;
    if (main && (e.contains(main))) continue;                                 // the frame the page lives in
    if (cs.position === 'sticky' && main && main.contains(e)) { if (r.top <= top + 2 && r.bottom > top) top = Math.max(top, r.bottom); continue; }
    const isCtl = e.matches('button, a, [role=button], input, select, textarea') || !!e.querySelector('button, a, [role=button], input, select, textarea');
    if (!isCtl) continue;
    floaters.push({ el: e, r, name: (e.getAttribute('aria-label') || e.innerText || e.className || e.tagName).toString().trim().slice(0, 40) });
  }
  const content = [];
  if (main) {
    // the page's content, not a sheet parked off screen: anything inside a fixed layer (a closed sheet slid below the
    // screen) is not a row of the page
    const inLayer = (e) => { for (let a = e.parentElement; a && a !== main; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') return true; return false; };
    for (const e of main.querySelectorAll('button, a, [role=button], input, select, textarea, [class*=chip], [class*=pill], [data-chip]')) if (vis(e) && !inLayer(e)) content.push({ el: e, r: e.getBoundingClientRect(), name: (e.getAttribute('aria-label') || e.innerText || e.tagName).toString().trim().slice(0, 40) });
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = n.textContent.trim(); if (!t || !n.parentElement || !vis(n.parentElement) || inLayer(n.parentElement)) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) if (r.width >= 1 && r.height >= 1) content.push({ el: n.parentElement, r, name: t.slice(0, 40) }); }
  }
  const inside = (r) => r.top >= top - 0.5 && r.bottom <= bottom + 0.5;         // wholly in the visible area
  const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const over = [];
  for (const c of content) { if (!inside(c.r)) continue; for (const f of floaters) { if (f.el.contains(c.el) || c.el.contains(f.el)) continue; if (hit(c.r, f.r)) { over.push(`"${f.name}" over "${c.name}"`); break; } } if (over.length > 5) break; }
  // O2: at the end, the last row is wholly above the Ask bar and the tabs
  let last = null; for (const c of content) if (!last || c.r.bottom > last.r.bottom) last = c;
  const dockTop = Math.min(innerHeight, ...Array.from(document.querySelectorAll('body *')).filter((e) => { const cs = getComputedStyle(e); return cs.position === 'fixed' && vis(e) && e.getBoundingClientRect().top > innerHeight / 2 && !(main && e.contains(main)); }).map((e) => e.getBoundingClientRect().top));
  // O3: every text in the page and its chrome, none a 24-hour clock without am or pm after it
  const text = document.body.innerText || '';
  const clocks = (text.match(/\b([01]?\d|2[0-3]):[0-5]\d\b(?!\s?(am|pm)\b)/g) || []);   // lower case only: "7:00 pm", never "7:00 Pm" or "19:00"
  return { over, lastBottom: last ? Math.round(last.r.bottom) : null, lastName: last ? last.name : null, dockTop: Math.round(dockTop), clocks: clocks.slice(0, 4), path: location.pathname };
}

(async () => {
  readRoutes((await import(path.join(ROOT, 'scripts/lib/stripComments.mjs'))).stripComments);
  if (process.argv.includes('--report')) return report();
  const from = +arg('from', 0), to = +arg('to', ROUTES.length);
  const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  let server = null, b = null, bpid = null;
  // a whole run (the floor's: no --from or --to) starts a fresh ledger and ends with the verdict; a slice resumes the ledger
  const whole = !process.argv.some((x) => x.startsWith('--from=') || x.startsWith('--to='));
  const L = whole ? {} : readLedger();
  try {
    server = await dev.start(ROOT, +process.env.PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${process.env.PORT}/__api` });
    if (!(await server.up())) throw new Error('the dev server did not come up');
    b = await H.browser(); bpid = b.process() && b.process().pid;
    for (const route of ROUTES.slice(from, to)) for (const w of WIDTHS) for (const mode of MODES) {
      const k = `${route} ${w} ${mode}`;
      try {
        // pages outside the shell (onboarding, the carried discover pages, the PIN pages) draw no .wl-main: waiting for
        // it cost a full time-out per state; they are read once their body is up
        const outside = /^\/vendor\/(onboarding|discover|pin)/.test(route);
        const p = await H.open(b, route, { mode, layout: 'v2', vp: VP[w], dpr: 1, settle: 1200, wait: outside ? 'body' : '.wl-main' });
        const rest = await p.evaluate(measure);
        await p.evaluate(() => { const m = document.querySelector('main.wl-main') || document.scrollingElement; m.scrollTop = m.scrollHeight; window.scrollTo(0, document.body.scrollHeight); });
        await new Promise((r) => setTimeout(r, 500));
        const end = await p.evaluate(measure);
        await p.close();
        L[k] = {
          O1: { ok: rest.over.length === 0 && end.over.length === 0, why: { rest: rest.over, end: end.over } },
          // O2 is about the Ask bar and the tabs, so it is read where they are drawn (the shell's pages); a page outside the
          // shell has neither, and its own length is its own (the PIN pages carry main's hydration log, read on the walk)
          O2: { ok: outside || end.lastBottom === null || end.lastBottom <= end.dockTop + 0.5, why: { last: end.lastName, lastBottom: end.lastBottom, dockTop: end.dockTop, outside } },
          O3: { ok: rest.clocks.length === 0 && end.clocks.length === 0, why: { rest: rest.clocks, end: end.clocks } },
          at: rest.path,
        };
      } catch (e) { L[k] = { error: String((e && e.message) || e).slice(0, 160) }; }
      fs.writeFileSync(LEDGER, JSON.stringify(L));
      const v = L[k]; console.log(`${v.error ? 'ERR ' : (v.O1.ok && v.O2.ok && v.O3.ok ? 'ok  ' : 'RED ')} ${k}${v.error ? ' ' + v.error : ''}${!v.error && !v.O1.ok ? ' O1 ' + JSON.stringify(v.O1.why).slice(0, 180) : ''}${!v.error && !v.O2.ok ? ' O2 ' + JSON.stringify(v.O2.why) : ''}${!v.error && !v.O3.ok ? ' O3 ' + JSON.stringify(v.O3.why) : ''}`);
    }
  } catch (e) { console.log('ERR ' + String((e && e.message) || e)); }
  finally {
    if (b) { try { await b.close(); } catch (_e) { /* gone */ } }
    if (bpid) { try { stopTree(bpid); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } try { await server.stop(); } catch (_e) { /* gone */ } }
  }
  if (whole) report();
})();
