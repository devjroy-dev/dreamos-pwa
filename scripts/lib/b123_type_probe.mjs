// scripts/lib/b123_type_probe.mjs · TDW CE-45 · FE-2 · TYPE_1 · the rung's browser arm.
// Drives the REAL rooms in headless Chromium against `next dev` in mock mode (C-43.18), by b120's
// and b122's method: puppeteer-core, CHROME_BIN or @sparticuz/chromium, a 374px touch viewport,
// the theme by the shell's own cookie. Every read is answered from b123_fixtures.mjs, populated
// (e-108: an empty room is not a measure). Lives in scripts/lib/ so the floor's glob skips it.
//
// usage: node scripts/lib/b123_type_probe.mjs PORT MODE ROOM SCENE [SHOTDIR]
//   ROOM:  leads | clients | events | notes | invoices | expenses
//   SCENE: rest | sheet (the first row's own sheet: the detail sheet, or for clients the card
//          opened and then its edit sheet) | schedule (invoices: the add-milestones sheet's frame)
// B123_CLOCK (ms since epoch) shifts the page's clock (C-44.13).
// Prints ONE line of JSON. A missing key reads as RED in the bench, never as green.
import fs from 'fs';
import path from 'path';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import { answer } from './b123_fixtures.mjs';

const [PORT = '3993', MODE_ARG, ROOM = 'leads', SCENE = 'rest', SHOTDIR = ''] = process.argv.slice(2);
const MODE = MODE_ARG === 'light' ? 'light' : 'dark';
const CLOCK = process.env.B123_CLOCK ? Number(process.env.B123_CLOCK) : null;

function usable(p) { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } }
async function resolveBin() {
  if (usable(process.env.CHROME_BIN)) return { bin: process.env.CHROME_BIN, how: 'CHROME_BIN' };
  try {
    const mod = await import('@sparticuz/chromium'); const c = mod.default || mod;
    const p = await c.executablePath(); if (usable(p)) return { bin: p, how: '@sparticuz/chromium' };
  } catch (_e) { /* fall through to the declared refusal */ }
  return { bin: null, how: null };
}
const { bin, how } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null })); process.exit(3); }

const out = { browser: how, mode: MODE, room: ROOM, scene: SCENE, clock: CLOCK, errors: [] };
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  if (CLOCK !== null) {
    await p.evaluateOnNewDocument((t0) => {
      const Real = Date; const start = Real.now(); const now = () => t0 + (Real.now() - start);
      // eslint-disable-next-line no-global-assign
      Date = class extends Real { constructor(...a) { if (a.length === 0) super(now()); else super(...a); } static now() { return now(); } };
    }, CLOCK);
  }
  // The pwa registers a service worker, and a worker's fetches never reach page-level interception;
  // b122's probe bypasses it the same way, so every read is answered from the fixtures.
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    (out.routes = out.routes || []).push(r.method() + ' ' + route);
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(answer(route)) });
  });
  const settle = (ms) => new Promise((res) => setTimeout(res, ms));
  const waitFor = async (pred, ms = 90000) => { for (let i = 0; i < ms / 400; i += 1) { if (await p.evaluate(pred)) return true; await settle(400); } return false; };
  const shot = async (label) => { if (!SHOTDIR) return; fs.mkdirSync(SHOTDIR, { recursive: true }); await p.screenshot({ path: path.join(SHOTDIR, `b123__${ROOM}__${label}__${MODE}.png`) }); };

  await p.goto(`http://localhost:${PORT}/vendor/${ROOM}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
  const FIRST = { leads: 'Aanya Kapoor', clients: 'Aanya Kapoor', events: 'Aanya Kapoor Sangeet', invoices: 'Aanya Kapoor', expenses: 'Drone rental', notes: null, calendar: 'Recce at Udaipur' }[ROOM];
  out.loaded = await waitFor(FIRST ? new Function(`return !!document.querySelector('.wl-main') && document.querySelector('.wl-main').textContent.includes(${JSON.stringify(FIRST)})`)
                                   : () => !!document.querySelector('.wl-main') && document.querySelector('.wl-main').textContent.trim().length > 0);
  await settle(1500); // the masthead figure counts up over 300ms; both trees wait the same
  // F-44.177 · THE REAL FACES (A-45.9), registered AFTER the room has settled (a dev server reloads the page
  // once after its first load, which would wipe faces registered earlier). On his machine next/font serves the real DM Sans and Cormorant; a
  // container cannot fetch them and renders fallbacks, which hide exactly the overflow F-44.177 is. With
  // B123_FONT_DIR set (the @fontsource woff2 files, fetched from the npm registry, never committed), the probe
  // registers them under next/font's OWN family names, so the page renders in the real faces here too.
  out.realFaces = false;
  try {
    const names = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); const first = (v) => v.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { dm: first(cs.getPropertyValue('--font-dm-sans')), co: first(cs.getPropertyValue('--font-cormorant')) }; });
    // (ruled, 26 Sept): with no B123_FONT_DIR, the probe obtains the real faces itself: `npm pack` of the two
    // @fontsource packages into a cache under the temp dir (the npm registry is reachable in the containers and
    // in his Codespace), once, then registered as below. If next/font already serves the real faces (his machine)
    // they are simply used. If neither source loads, 6.3 still REFUSES: it never passes on fallback faces.
    let dir = process.env.B123_FONT_DIR;
    if (!dir) {
      const { execSync } = await import('child_process');
      const cache = path.join((await import('os')).tmpdir(), 'b123-fonts');
      const want = ['dm-sans-latin-400-normal.woff2', 'dm-sans-latin-500-normal.woff2', 'cormorant-garamond-latin-500-normal.woff2'];
      if (!want.every((f) => fs.existsSync(path.join(cache, f)))) {
        try {
          fs.mkdirSync(cache, { recursive: true });
          execSync('npm pack @fontsource/dm-sans@5 @fontsource/cormorant-garamond@5 --silent', { cwd: cache, stdio: 'ignore', timeout: 120000 });
          for (const tgz of fs.readdirSync(cache).filter((f) => f.endsWith('.tgz'))) execSync(`tar xzf ${tgz} package/files`, { cwd: cache, stdio: 'ignore' }) && null;
          for (const f of want) { const src = path.join(cache, 'package', 'files', f); if (fs.existsSync(src)) fs.copyFileSync(src, path.join(cache, f)); }
        } catch (e) { out.errors.push('faces: npm pack failed: ' + String(e && e.message).split('\n')[0]); }
      }
      if (want.every((f) => fs.existsSync(path.join(cache, f)))) dir = cache;
      out.faceSource = dir ? 'npm-pack cache' : 'none';
    } else out.faceSource = 'B123_FONT_DIR';
    if (dir && names.dm && names.co) {
      const face = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(dir, file)).toString('base64')}) format('woff2');}`;
      await p.addStyleTag({ content: [face(names.dm, 'dm-sans-latin-400-normal.woff2', 400), face(names.dm, 'dm-sans-latin-500-normal.woff2', 500), face(names.co, 'cormorant-garamond-latin-500-normal.woff2', 500)].join('\n') });
    }
    // a face declared by a style tag loads only when asked or used: ask for each weight explicitly, then settle
    await p.evaluate(async (n) => { try { await Promise.all([document.fonts.load(`400 14px "${n.dm}"`), document.fonts.load(`500 11px "${n.dm}"`), document.fonts.load(`500 24px "${n.co}"`)]); } catch (_e) { /* reported below */ } await document.fonts.ready; }, names);
    await new Promise((r) => setTimeout(r, 400));
    out.realFaces = await p.evaluate((dm) => document.fonts.check(`500 11px "${dm}"`) && [...document.fonts].some((f) => f.family.replace(/["']/g, '') === dm && f.status === 'loaded'), names.dm);
    out.faceNames = names;
  } catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }
  await shot('rest');

  if (SCENE === 'sheet') {
    if (ROOM === 'clients') {
      out.tapped = await p.evaluate(() => { const bt = document.querySelector('.wl-main button[aria-expanded]'); if (!bt) return null; bt.click(); return 'card'; });
      await settle(900);
      out.tapped2 = await p.evaluate(() => { const bt = [...document.querySelectorAll('.wl-main button')].find((x) => /^edit$/i.test(x.textContent.trim())); if (!bt) return null; bt.click(); return 'edit'; });
      await waitFor(() => !!document.querySelector('[data-lc2="binder-edit-sheet"]'), 15000);
    } else {
      out.tapped = await p.evaluate(() => { const bt = document.querySelector('.wl-main [data-row-id] button'); if (!bt) return null; bt.click(); return bt.closest('[data-row-id]').getAttribute('data-row-id'); });
      await waitFor(() => !!document.querySelector('[data-lc2="detail-sheet"]') && !!document.querySelector('[data-lc2="detail-sheet"]').textContent.trim(), 15000);
    }
    await settle(1200);
    await shot('sheet');
  } else if (ROOM === 'calendar' && SCENE !== 'rest') {
    // cut 2 · the Calendar's surfaces. The day sheet opens from a grid day; the block and crew sheets open
    // from the day sheet's own controls. Each tap is asserted (tapped / tapped2), never assumed.
    const tapText = (sel, re) => p.evaluate((sel, src) => { const r = new RegExp(src, 'i'); const bt = [...document.querySelectorAll(sel)].find((x) => r.test(x.textContent.trim())); if (!bt) return null; bt.click(); return bt.textContent.trim(); }, sel, re.source);
    if (SCENE === 'weddings') {
      out.tapped = await tapText('[aria-label="Calendar view"] button', /^weddings$/);
      await waitFor(() => /Aanya Kapoor Wedding/.test(document.querySelector('.wl-main').textContent), 15000);
    } else {
      out.tapped = await tapText('.wl-main button', /^15$/);
      await waitFor(() => /Dev Uthani Ekadashi|Nothing scheduled|Recce at Udaipur/.test(document.body.textContent) && [...document.querySelectorAll('.wl-main button')].some((b) => /^block day$/i.test(b.textContent.trim())), 15000);
      if (SCENE === 'block') { out.tapped2 = (await tapText('.wl-main button', /^block day$/)) ? 'block' : null; await settle(1200); }
      if (SCENE === 'crew') {
        // the day's events land after the sheet opens: wait for the Crew control itself before the tap
        await waitFor(() => [...document.querySelectorAll('button')].some((b) => /^crew$/i.test(b.textContent.trim())), 15000);
        out.tapped2 = (await tapText('button', /^crew$/)) ? 'crew' : null; await waitFor(() => /Rhea Sharma/.test(document.querySelector('.wl-main').textContent), 15000); }
    }
    await settle(1200);
    await shot(SCENE);
  } else if (SCENE === 'add') {
    // TYPE_2: the room's + opens its add sheet (AddSheet; clients: ClientBookingSheet, submitted empty so
    // NeedFirst draws; notes: the new-note sheet)
    out.tapped = await p.evaluate(() => { const f = document.querySelector('.wl-fab'); if (!f) return null; f.click(); return f.getAttribute('aria-label'); });
    await settle(1200);
    if (ROOM === 'clients') {
      out.tapped2 = await p.evaluate(() => { const s = document.querySelector('[data-lc2="client-booking-sheet"]'); const bt = s && [...s.querySelectorAll('button')].pop(); if (!bt) return null; bt.click(); return 'submit'; });
      await waitFor(() => !!document.querySelector('[data-lc2="need-first"]'), 8000);
    }
    await settle(800);
    await shot('add');
  } else if (SCENE === 'booking' && ROOM === 'leads') {
    // TYPE_2: the lead's sheet, then its "Booking confirmed": BookingSheet over PackageFields' Sheet
    out.tapped = await p.evaluate(() => { const bt = document.querySelector('.wl-main [data-row-id="lead-0001"] button'); if (!bt) return null; bt.click(); return 'lead-0001'; });
    await waitFor(() => !!document.querySelector('[data-lc2="lead-booking-controls"]'), 15000);
    out.tapped2 = await p.evaluate(() => { const bt = [...document.querySelectorAll('[data-lc2="lead-booking-controls"] button')].find((x) => /^booking confirmed$/i.test(x.textContent.trim())); if (!bt) return null; bt.click(); return 'booking'; });
    await waitFor(() => { const b = document.querySelector('[data-lc2="booking-sheet"]'); return !!b && b.getBoundingClientRect().top < window.innerHeight - 4; }, 8000);
    await settle(1000);
    await shot('booking');
  } else if (SCENE === 'note' && ROOM === 'notes') {
    out.tapped = await p.evaluate(() => { const n = [...document.querySelectorAll('.wl-main .atelier-card')][0]; if (!n) return null; n.click(); return 'note-0001'; });
    await waitFor(() => !!document.querySelector('[data-wl-notesheet]'), 8000);
    await settle(600);
    await shot('note');
  } else if (SCENE === 'toast' && ROOM === 'notes') {
    // TYPE_2: the legacy Toast, raised by the one act here that needs no body back: deleting a note
    out.tapped = await p.evaluate(() => { const n = [...document.querySelectorAll('.wl-main .atelier-card')][0]; if (!n) return null; n.click(); return 'note-0001'; });
    await waitFor(() => !!document.querySelector('[data-wl-notesheet]'), 8000);
    out.tapped2 = await p.evaluate(() => { const bt = [...document.querySelectorAll('[data-wl-notesheet] button')].find((x) => /^delete$/i.test(x.textContent.trim())); if (!bt) return null; bt.click(); return 'delete'; });
    await waitFor(() => /Deleted/.test(document.querySelector('.wl-main').textContent), 8000);
    await settle(300);
    await shot('toast');
  } else if (SCENE === 'schedule' && ROOM === 'invoices') {
    // the paid invoice (no schedule) offers "Add": it opens the add-milestones sheet (SliceShell)
    out.tapped = await p.evaluate(() => { const r = document.querySelector('.wl-main [data-row-id="inv-0002"] button'); if (!r) return null; r.click(); return 'inv-0002'; });
    await settle(1500);
    out.tapped2 = await p.evaluate(() => {
      const bt = [...document.querySelectorAll('[data-lc2="detail-sheet"] button')].find((x) => /^add$/i.test(x.textContent.trim()));
      if (!bt) return null; bt.click(); return 'add';
    });
    await settle(1200);
    await shot('schedule');
  }

  // Measure a settled page: every read the scene fired has landed (a schedule arriving 200ms later on
  // one tree than the other is not a word change). Stable = the page's text unchanged for 1.5s.
  { let last = '', same = 0;
    for (let i = 0; i < 40 && same < 3; i += 1) { const now = await p.evaluate(() => document.body.innerText); same = now === last ? same + 1 : 0; last = now; await settle(500); } }
  out.url = p.url();
  Object.assign(out, await p.evaluate(() => {
    if (!document.querySelector('.wl-main')) return { nodes: [], controls: [], crashed: true };
    const W = 374;
    // 1b's modules, measured at TYPE_2 and not here (the chair's split): their subtrees are marked, not skipped.
    // TYPE_1 marked TYPE_2's subtrees `later`. TYPE_2 re-dresses them, so nothing is later now; the
    // selector stays as the one place a future cut would name a subtree it has not reached.
    const LATER = '[data-b123-later]';
    const fam = (f) => { f = f.toLowerCase(); if (f.includes('cormorant')) return 'cormorant'; if (f.includes('dm_sans') || f.includes('dm sans')) return 'dmsans'; if (f.includes('jost')) return 'jost'; if (f.includes('italiana')) return 'italiana'; return f.split(',')[0].trim(); };
    const scopes = [document.querySelector('.wl-main')];
    for (const sel of ['[data-lc2="detail-sheet"]', '[data-lc2="binder-edit-sheet"]', '[data-lc2="wishbone-sheet"]', '[data-lc2="booking-sheet"]', '[data-lc2="attach-sheet"]', '[data-lc2="client-booking-sheet"]']) {
      const el = document.querySelector(sel);
      if (el && el.getBoundingClientRect().top < window.innerHeight - 4) scopes.push(el);
    }
    // the add-milestones sheet and the other fixed overlays SliceShell draws with no marker: any fixed layer inside .wl, outside .wl-main
    for (const el of document.querySelectorAll('.wl > div, .wl div[style*="position: fixed"]')) {
      if (scopes.includes(el) || scopes.some((s) => s && (s.contains(el) || el.contains(s)))) continue;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' && el.textContent.trim() && el.getBoundingClientRect().height > 40 && el.getBoundingClientRect().top < window.innerHeight - 4 && !el.closest('.wl-hdr, nav, .wl-dock, .wl-tabs, [class*="wl-dock"], [class*="wl-nav"]')) {
        if ([...el.querySelectorAll('input,button')].length) scopes.push(el);
      }
    }
    const main = scopes[0];
    // TYPE_1b 3.5 (re-cut, e-candidate: the first form measured the TEXT's top, which moves with the face's
    // own ascent: 16 in the stand-in's fallback serif, 15 with the real Cormorant on the founder's machine).
    // The room's opening space is the TITLE ELEMENT's own geometry, which no face can move: where its box
    // begins against the room's top, and the padding it sets above its line.
    const titleEl = main ? main.querySelector('[data-room-title]') : null;
    const titleBox = titleEl ? { elTop: Math.round((titleEl.getBoundingClientRect().top - main.getBoundingClientRect().top) * 10) / 10,
      padTop: parseFloat(getComputedStyle(titleEl).paddingTop), first: (() => { const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT); while (w.nextNode()) { if (w.currentNode.textContent.trim()) return titleEl.contains(w.currentNode); } return false; })() } : null;
    // A CLOSED sheet is a fixed layer translated below the fold: it is in the DOM, not on glass. The
    // question is asked of the LAYER, never of the node: an open sheet's rows that sit below its own
    // scroll fold are on the sheet and are counted. (The first cut asked it of the node, so a tree whose
    // larger type pushed more rows below the fold counted fewer words: the base's 66 against 70.)
    function offGlass(el) {
      for (let a = el; a; a = a.parentElement) {
        if (getComputedStyle(a).position === 'fixed') { const lr = a.getBoundingClientRect(); return lr.top >= window.innerHeight - 1 || lr.bottom <= 0; }
      }
      return false;
    }
    const strip = (() => { const cur = main && main.querySelector('button[aria-current="page"]'); return cur ? cur.parentElement : null; })();
    const nodes = [];
    // TYPE_1b: each node's TEXT top (its own line box, not its element's padding box) against .wl-main's
    // top, so the rung can measure the room's opening space
    const mainTop = main ? main.getBoundingClientRect().top : 0;
    scopes.filter(Boolean).forEach((root, si) => {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const t = w.currentNode; const txt = t.textContent.replace(/\s+/g, ' ').trim(); if (!txt) continue;
        const el = t.parentElement; const r = el.getBoundingClientRect(); if (r.width === 0 && r.height === 0) continue;
        if (offGlass(el)) continue;
        const cs = getComputedStyle(el);
        let scroller = false; for (let a = el; a && a !== root; a = a.parentElement) { const ox = getComputedStyle(a).overflowX; if (ox === 'auto' || ox === 'scroll') { scroller = true; break; } }
        nodes.push({ txt, scope: si, grid: !!el.closest('[data-cal-grid]'), next: !!el.closest('[data-cal-next]'), fab: !!el.closest('.wl-fab'), size: Math.round(parseFloat(cs.fontSize) * 100) / 100, f: fam(cs.fontFamily), wt: Number(cs.fontWeight),
          ls: cs.letterSpacing, tt: cs.textTransform, fs: cs.fontStyle, later: !!el.closest(LATER), strip: !!(strip && strip.contains(el)),
          scroller, left: Math.round(r.left), right: Math.round(r.right), top: (() => { const rg = document.createRange(); rg.selectNodeContents(t); return Math.round((rg.getBoundingClientRect().top - mainTop) * 10) / 10; })() });
      }
    });
    const controls = [];
    scopes.filter(Boolean).forEach((root) => {
      for (const c of root.querySelectorAll('button, a[href], input, textarea, [role="button"]')) {
        const r = c.getBoundingClientRect(); if (r.width === 0 && r.height === 0) continue;
        if (offGlass(c)) continue;
        const cs = getComputedStyle(c);
        controls.push({ tag: c.tagName.toLowerCase(), role: c.getAttribute('role') || '', name: (c.getAttribute('aria-label') || c.textContent || c.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim(),
          href: c.getAttribute('href') || '', tt: cs.textTransform, size: Math.round(parseFloat(cs.fontSize) * 100) / 100, later: !!c.closest(LATER), strip: !!(strip && strip.contains(c)) });
      }
    });
    // F-44.177 · every row tag: its own box, its text's box (a Range: the real glyph line), and every ancestor
    // that clips (overflow not visible), so the rung can ask that nothing of the tag is cut
    const tags = [...main.querySelectorAll('[data-row-tag]')].filter((t) => t.getBoundingClientRect().height > 0).map((t) => {
      const b = t.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(t); const tb = rg.getBoundingClientRect();
      const clips = []; for (let a = t.parentElement; a && a !== main; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const r = a.getBoundingClientRect(); clips.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right }); } }
      return { txt: t.textContent.trim(), box: { top: b.top, bottom: b.bottom, left: b.left, right: b.right }, text: { top: tb.top, bottom: tb.bottom }, clips, size: parseFloat(getComputedStyle(t).fontSize), tt: getComputedStyle(t).textTransform };
    });
    const fig = [...main.querySelectorAll('div')].find((d) => /^Rs [0-9,]+$/.test(d.textContent.trim()) && d.children.length === 0);
    return {
      scopes: scopes.filter(Boolean).length,
      nodes, controls, titleBox, tags,
      docOverflow: document.documentElement.scrollWidth - W,
      mainOverflow: main ? main.scrollWidth - main.clientWidth : null,
      stripLabels: strip ? [...strip.querySelectorAll('button')].map((x) => x.textContent.trim()) : [],
      figure: fig ? { text: fig.textContent.trim(), size: parseFloat(getComputedStyle(fig).fontSize), f: fam(getComputedStyle(fig).fontFamily), sw: fig.scrollWidth, cw: fig.clientWidth, right: Math.round(fig.getBoundingClientRect().right) } : null,
      storedSlice: (() => { try { return localStorage.getItem('dreamai_list_last_slice'); } catch (_e) { return 'unreadable'; } })(),
    };
  }));
} catch (e) { out.errors.push('probe: ' + String(e && e.message).split('\n')[0]); }
await b.close();
console.log(JSON.stringify(out));
