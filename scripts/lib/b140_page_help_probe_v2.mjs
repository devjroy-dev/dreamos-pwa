// DESIGN-1 · STAGE 5a (by label): a record page's seen key is its card's pattern (one card for every enquiry, every client).
// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy of b140_page_help_probe.mjs. The original at its own path proves the classic
// tree (main's, unchanged); this one proves the redesign in v2/, with its stage 1-3 amendments by label.
// scripts/lib/b140_page_help_probe_v2.mjs · TDW CE-46 · FE-4 · the "?" on every surface · b140's browser arm.
// b123's method (puppeteer-core, a 390px touch viewport, the theme by the shell's cookie, every read answered
// from the stand-in, the service worker bypassed, the real faces registered after the room settles, A-45.9).
//
// usage: node scripts/lib/b140_page_help_probe_v2.mjs PORT MODE ROUTE [full|quick] [seen|unseen]
// Prints ONE line of JSON. A missing key reads as RED in the bench, never as green.
//   quick: the head, the "?", the card's content on open, close by Got it.
//   full:  quick, plus close by scrim, close by Escape, focus back on the "?", the dot before and after,
//          and "Ask TDW about this" landing in the sheet with the room's name in the input.
//   seen:  the route's seen key is pre-set in localStorage (the dot must be absent); unseen: cleared (present).
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import { answer, VID } from './b123_fixtures.mjs';

const [PORT = '3993', MODE_ARG, ROUTE = '/vendor/leads', DEPTH = 'quick', SEEN = 'unseen'] = process.argv.slice(2);
const MODE = MODE_ARG === 'light' ? 'light' : 'dark';

function usable(p) { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } }
async function resolveBin() {
  if (usable(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  try { const mod = await import('@sparticuz/chromium'); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) return p; } catch (_e) { /* declared below */ }
  return null;
}
const bin = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null })); process.exit(3); }

const out = { mode: MODE, route: ROUTE, depth: DEPTH, seen: SEEN, errors: [] };
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', async (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    if (route === `/api/v2/vendor/chat/history/${VID}`) return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, messages: [] }) });
    // THE DOORS b123's STAND-IN NEVER ANSWERED. Its default `{ ok: true }` crashes seven rooms that read a list or
    // a figure off the answer (e-108's class: a room measured before it mounts). Each is answered below with the
    // shape ITS DOOR RETURNS FOR A VENDOR WITH NOTHING, read in dream-os by command (§6, no guessing), empty:
    //   tds list      src/api/vendor/tds.js:66      okRes({ entries, total })
    //   tds summary   src/lib/vendor/tds.js:22-30    { ok, financial_year, total_gross, total_tds, total_net, entry_count, by_section }
    //   portfolio     src/api/vendor/portfolio.js:48 okRes({ images, total })
    //   discover      src/lib/vendor/discover.js:280 { ok, min_portfolio_images, max_portfolio_images, ig_import_enabled, discover_request_state }
    //   ig status     src/api/vendor/ig.js:71        okRes({ ig_import_enabled: false, connected: false }) when IG import is off
    //   referrals     src/api/vendor/referrals.js:37 okRes({ sent_count, received_count, peers })
    //   exchange      src/api/vendor/exchange.js:78  okRes({ role: 'sender' | 'creator', opted_in }) (roleOf, src/lib/vendor/exchange.js:75)
    //   creators/requests/inbox  exchange.js:97,120,127  okRes({ creators }) / okRes({ requests })
    //   collab feed   src/api/vendor/collab.js:292   okRes({ feed, count });  my-posts :346 okRes({ posts });  replies :406 okRes({ responses })
    //   requirement-types collab.js:157            okRes({ requirement_types, shoot_event_types })
    //   contracts     src/api/vendor/contracts.js:158 okRes({ contracts, total })
    // okRes is src/lib/response.js:2, `{ ok: true, ...payload }`. This rung measures the HEAD; an empty room draws
    // its head as a full one does, and the rooms' bodies are other rungs' subjects.
    const DOORS = [
      [/^\/api\/v2\/vendor\/tds\/[^/]+\/summary$/, { ok: true, financial_year: '2026-27', total_gross: 0, total_tds: 0, total_net: 0, entry_count: 0, by_section: [] }],
      [/^\/api\/v2\/vendor\/tds\/[^/]+$/, { ok: true, entries: [], total: 0 }],
      [/^\/api\/v2\/vendor\/portfolio\/[^/]+$/, { ok: true, images: [], total: 0 }],
      [/^\/api\/v2\/vendor\/discover\/status$/, { ok: true, min_portfolio_images: 6, max_portfolio_images: 40, ig_import_enabled: false, discover_request_state: 'none' }],
      [/^\/api\/v2\/vendor\/ig\/status$/, { ok: true, ig_import_enabled: false, connected: false }],
      [/^\/api\/v2\/vendor\/referrals$/, { ok: true, sent_count: 0, received_count: 0, peers: [] }],
      [/^\/api\/v2\/vendor\/exchange$/, { ok: true, role: 'sender', opted_in: null }],
      [/^\/api\/v2\/vendor\/exchange\/creators$/, { ok: true, creators: [] }],
      [/^\/api\/v2\/vendor\/exchange\/(requests|inbox)$/, { ok: true, requests: [] }],
      [/^\/api\/v2\/vendor\/collab\/feed$/, { ok: true, feed: [], count: 0 }],
      [/^\/api\/v2\/vendor\/collab\/my-posts$/, { ok: true, posts: [] }],
      [/^\/api\/v2\/vendor\/collab\/[^/]+\/responses$/, { ok: true, responses: [] }],
      [/^\/api\/v2\/vendor\/collab\/requirement-types$/, { ok: true, requirement_types: [], shoot_event_types: [] }],
      [/^\/api\/v2\/vendor\/contracts$/, { ok: true, contracts: [], total: 0 }],
    ];
    const door = DOORS.find(([re]) => re.test(route));
    const EMPTY = { ok: true, items: [], posts: [], contracts: [], rows: [], sent: [], received: [], responses: [], list: [] };
    const base = answer(route);
    const body = door ? door[1] : (base && Object.keys(base).length === 1 && base.ok === true ? EMPTY : base);
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  const settle = (ms) => new Promise((res) => setTimeout(res, ms));
  const waitFor = async (pred, ms = 120000) => { for (let i = 0; i < ms / 300; i += 1) { if (await p.evaluate(pred)) return true; await settle(300); } return false; };

  // the seen key is set or cleared BEFORE the room mounts, so the dot's effect reads the state under test
  await p.evaluateOnNewDocument((route, seen) => {
    const key = 'tdw_help_seen:' + (/^\/vendor\/collab\/[^/]+\/responses\/?$/.test(route) ? '/vendor/collab/[post_id]/responses' : /^\/vendor\/leads\/[^/]+\/?$/.test(route) ? '/vendor/leads/[id]' : /^\/vendor\/clients\/[^/]+\/?$/.test(route) ? '/vendor/clients/[id]' : route);
    try { if (seen === 'seen') localStorage.setItem(key, '1'); else localStorage.removeItem(key); } catch (_e) { /* read below */ }
  }, ROUTE, SEEN);

  await p.goto(`http://localhost:${PORT}${ROUTE}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  out.loaded = await waitFor(() => !!document.querySelector('.wl-main') && !!document.querySelector('.wl-roomhead'), 150000);
  await settle(1200);
  // THE REAL FACES (A-45.9): b123's own method
  try {
    const names = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); const first = (v) => v.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { dm: first(cs.getPropertyValue('--font-dm-sans')), co: first(cs.getPropertyValue('--font-cormorant')) }; });
    let dir = process.env.B123_FONT_DIR;
    const want = ['dm-sans-latin-400-normal.woff2', 'dm-sans-latin-500-normal.woff2', 'cormorant-garamond-latin-500-normal.woff2'];
    if (!dir) {
      const cache = path.join(os.tmpdir(), 'b123-fonts');
      if (!want.every((f) => fs.existsSync(path.join(cache, f)))) {
        try { fs.mkdirSync(cache, { recursive: true }); execSync('npm pack @fontsource/dm-sans@5 @fontsource/cormorant-garamond@5 --silent', { cwd: cache, stdio: 'ignore', timeout: 120000 });
          for (const t of fs.readdirSync(cache).filter((f) => f.endsWith('.tgz'))) execSync(`tar xzf ${t} package/files`, { cwd: cache, stdio: 'ignore' });
          for (const f of want) { const s = path.join(cache, 'package', 'files', f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(cache, f)); }
        } catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }
      }
      if (want.every((f) => fs.existsSync(path.join(cache, f)))) dir = cache;
    }
    if (dir && names.dm && names.co) {
      const face = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(dir, file)).toString('base64')}) format('woff2');}`;
      await p.addStyleTag({ content: [face(names.dm, want[0], 400), face(names.dm, want[1], 500), face(names.co, want[2], 500)].join('\n') });
    }
    await p.evaluate(async () => { await document.fonts.ready; });
    out.realFaces = await p.evaluate((dm) => document.fonts.check(`500 11px "${dm}"`) && [...document.fonts].some((f) => f.family.replace(/["']/g, '') === dm && f.status === 'loaded'), names.dm);
    // DESIGN-1 · STAGE 1 (by label): the app's face is Inter, served by next/font; a tree on Inter measures its real
    // faces when Inter itself is loaded (the npm-pack path above stays for a tree still on DM Sans).
    const inter = await p.evaluate(async () => { try { await document.fonts.load('500 13px Inter'); } catch (_e) { /* reported below */ } await document.fonts.ready;
      return /inter/i.test(getComputedStyle(document.querySelector('.wl') || document.body).fontFamily) && [...document.fonts].some((f) => /inter/i.test(f.family) && f.status === 'loaded'); });
    if (inter) out.realFaces = true;
  } catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }

  const typeOf = (el) => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10), family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), italic: cs.fontStyle === 'italic', ls: cs.letterSpacing, tt: cs.textTransform }; };
  void typeOf;

  // ── AT REST: the head, the "?", the dot, no card ──────────────────────────────────────────────────────
  out.rest = await p.evaluate(() => {
    const main = document.querySelector('.wl-main'); const head = document.querySelector('.wl-roomhead');
    const h1 = document.querySelector('.wl-roomhead h1[data-room-title]'); const q = document.querySelector('.wl-roomhead .wl-helpq');
    const ring = q && q.querySelector('.wl-helpqring');
    const T = (el) => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10), family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), italic: cs.fontStyle === 'italic', ls: cs.letterSpacing, tt: cs.textTransform }; };
    const r = (el) => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, cy: b.top + b.height / 2 }; };
    const h1s = main ? main.querySelectorAll('h1').length : -1;
    // the t1 census of the page: every element whose own text sits at 24px, on glass, the shell's FAB excluded (its
    // plus glyph is t1 by rule and not a title), a closed sheet's title excluded (off glass, below the fold)
    const t1s = main ? [...main.querySelectorAll('*')].filter((e) => { if (e.closest('.wl-fab')) return false; const b = e.getBoundingClientRect(); if (!b.width || b.top >= innerHeight || b.bottom <= 0) return false; const cs = getComputedStyle(e); return parseFloat(cs.fontSize) === 24 && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); }).map((e) => e.tagName + (e.className ? '.' + String(e.className).split(' ')[0] : '') + ':' + e.textContent.trim().slice(0, 24)) : null;
    const dot = q ? getComputedStyle(q, '::after') : null;
    const dotDrawn = dot ? (dot.content !== 'none' && parseFloat(dot.width) > 0) : false;
    return {
      headFirstInMain: !!(main && head && main.firstElementChild === head),
      title: h1 ? h1.textContent : null, titleType: h1 ? T(h1) : null, titleBox: h1 ? r(h1) : null, titlePadTop: h1 ? parseFloat(getComputedStyle(h1).paddingTop) : null,
      shellLabel: (document.querySelector('.wl-lbl') || {}).textContent || null,
      q: q ? { box: r(q), aria: q.getAttribute('aria-label'), first: q.dataset.first, ring: ring ? T(ring) : null, ringBorder: ring ? getComputedStyle(ring).borderTopWidth : null, dotDrawn, dotColor: dot ? dot.backgroundColor : null } : null,
      mainRight: main ? main.getBoundingClientRect().right : null, gutter: main ? parseFloat(getComputedStyle(main.firstElementChild).paddingLeft) : null,
      card: !!document.querySelector('.wl-help'), h1s, t1s, vw: innerWidth, vh: innerHeight,
      dock: (() => { const d = document.querySelector('.wl-dockfield'); return d ? r(d) : null; })(),
    };
  });

  const measureCard = () => p.evaluate(() => {
    const c = document.querySelector('.wl-helpcard'); const s = document.querySelector('.wl-helpscrim'); const dlg = document.querySelector('.wl-help');
    if (!c) return null;
    const T = (el) => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10), family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), italic: cs.fontStyle === 'italic', ls: cs.letterSpacing, tt: cs.textTransform, control: el.tagName === 'BUTTON', txt: el.textContent.trim().slice(0, 40) }; };
    const b = c.getBoundingClientRect(); const cs = getComputedStyle(c);
    const texts = [...c.querySelectorAll('h2,p,li,span,button')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map(T);
    const icons = [...c.querySelectorAll('.wl-helpicon')].map((e) => ({ w: e.getBoundingClientRect().width, stroke: getComputedStyle(e).stroke }));
    const btns = [...c.querySelectorAll('.wl-helpacts button')].map((e) => ({ txt: e.textContent.trim(), h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }));
    return { box: { x: b.left, y: b.top, w: b.width, h: b.height, r: b.right, bottom: b.bottom }, maxH: cs.maxHeight, overflowY: cs.overflowY, radius: cs.borderTopLeftRadius, bg: cs.backgroundColor,
      scrim: s ? getComputedStyle(s).backgroundColor : null, role: dlg && dlg.getAttribute('role'), modal: dlg && dlg.getAttribute('aria-modal'),
      name: (c.querySelector('.wl-helpname') || {}).textContent || null, what: (c.querySelector('.wl-helpwhat') || {}).textContent || null,
      lines: [...c.querySelectorAll('.wl-helpdo li')].map((e) => e.textContent.trim()), connects: (c.querySelector('.wl-helplink') || {}).textContent || null,
      texts, icons, btns, vh: innerHeight, vw: innerWidth };
  });

  // ── OPEN by tap ──────────────────────────────────────────────────────────────────────────────────────
  out.tapped = await p.evaluate(() => { const q = document.querySelector('.wl-roomhead .wl-helpq'); if (!q) return false; q.click(); return true; });
  await settle(350);
  out.open = await measureCard();
  out.firstAfterOpen = await p.evaluate(() => (document.querySelector('.wl-roomhead .wl-helpq') || {}).dataset?.first ?? null);
  out.storedAfterOpen = await p.evaluate((route) => { const key = 'tdw_help_seen:' + (/^\/vendor\/collab\/[^/]+\/responses\/?$/.test(route) ? '/vendor/collab/[post_id]/responses' : /^\/vendor\/leads\/[^/]+\/?$/.test(route) ? '/vendor/leads/[id]' : /^\/vendor\/clients\/[^/]+\/?$/.test(route) ? '/vendor/clients/[id]' : route); try { return localStorage.getItem(key); } catch (_e) { return 'unreadable'; } }, ROUTE);

  // ── CLOSE by Got it ──────────────────────────────────────────────────────────────────────────────────
  await p.evaluate(() => { const bt = [...document.querySelectorAll('.wl-helpacts button')].find((e) => /got it/i.test(e.textContent)); if (bt) bt.click(); });
  await settle(300);
  out.afterGotIt = await p.evaluate(() => ({ card: !!document.querySelector('.wl-help'), focusOnQ: document.activeElement === document.querySelector('.wl-roomhead .wl-helpq') }));

  if (DEPTH === 'full') {
    // close by the scrim
    await p.evaluate(() => document.querySelector('.wl-roomhead .wl-helpq').click()); await settle(300);
    out.reopened1 = await p.evaluate(() => !!document.querySelector('.wl-help'));
    await p.evaluate(() => document.querySelector('.wl-helpscrim').click()); await settle(300);
    out.afterScrim = await p.evaluate(() => ({ card: !!document.querySelector('.wl-help'), focusOnQ: document.activeElement === document.querySelector('.wl-roomhead .wl-helpq') }));
    // close by Escape
    await p.evaluate(() => document.querySelector('.wl-roomhead .wl-helpq').click()); await settle(300);
    out.reopened2 = await p.evaluate(() => !!document.querySelector('.wl-help'));
    await p.keyboard.press('Escape'); await settle(300);
    out.afterEscape = await p.evaluate(() => ({ card: !!document.querySelector('.wl-help'), focusOnQ: document.activeElement === document.querySelector('.wl-roomhead .wl-helpq') }));
    // Ask TDW about this: the sheet opens with the room's name in the input, nothing sent
    await p.evaluate(() => document.querySelector('.wl-roomhead .wl-helpq').click()); await settle(300);
    await p.evaluate(() => { const bt = [...document.querySelectorAll('.wl-helpacts button')].find((e) => /ask tdw/i.test(e.textContent)); if (bt) bt.click(); });
    out.sheet = await waitFor(() => !!document.querySelector('.wl-askpanel textarea'), 20000);
    await settle(500);
    out.ask = await p.evaluate(() => { const ta = document.querySelector('.wl-askpanel textarea'); const bodies = document.querySelectorAll('.wl-askbody [data-role="user"], .wl-askbody .user-bubble'); return { input: ta ? ta.value : null, card: !!document.querySelector('.wl-help'), userBubbles: bodies.length }; });
  }
  await p.close();
} catch (e) { out.errors.push('probe: ' + String(e && e.message).split('\n')[0]); }
finally { await b.close(); }
console.log(JSON.stringify(out));
