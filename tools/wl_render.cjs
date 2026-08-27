#!/usr/bin/env node
'use strict';
// tools/wl_render.cjs — THE RENDER ARM.
//
//   node tools/wl_render.cjs <base-url> [--capture <dir>]
//
// WHY THIS EXISTS, AND WHAT IT IS NOT.
// `tools/wl_audit.mjs` asserts SERVED BYTES. It is good at what a fetch can see and
// structurally blind to what a fetch cannot. Three defects escaped it in one arc, all one
// class, and the third was found by this file's first captures:
//
//   · the coin drawer painted 8px BELOW the fold (top 852 in an 844px viewport) while the
//     byte-gate reported "drawer overlays — fixed scrim present" and PASSED;
//   · the chat input shipped computed `font-style: italic` in Cormorant Garamond while the
//     byte-gate's ternary-blind regex reported "the chat sheds the costume" and PASSED;
//   · the tile grid rendered flush to both screen edges — `--wl-gutter: 12px` declared,
//     applied inset `0px` — while the byte-gate confirmed the RULE was present and PASSED.
//
// THE LAW THIS FILE OWNS (CE-37, 2026-08-27): computed facts — DOES IT PAINT, WHERE, IN WHAT
// STYLE — are structurally outside a served-bytes gate. Served-bytes assertions on that class
// print INCONCLUSIVE, never PASS. The render arm owns them. A rule that is present in a
// stylesheet is not a rule that applies, and presence in a bundle is not presence on screen.
//
// THE BROWSER. Playwright's CDN and Google's storage host are both denied at this estate's
// egress proxy, and no system chromium exists in the build container. `@sparticuz/chromium`
// ships the binary INSIDE its npm tarball, and npm is allow-listed — that is the whole reason
// for the dependency pair. Driven with `puppeteer-core`. Real Chromium, real next/font, real
// computed styles.
//
// THE FIXTURE, AND ITS HONESTY. The session below is SYNTHETIC: its token is not a real one,
// so every authenticated fetch fails closed. That is stated, never hidden — the coin renders
// its fallback glyph instead of initials for exactly this reason, and any frame this file
// captures is SYNTHETIC-SPLASH unless a fixture layer is added and declared. A frame whose
// data condition is unstated is not evidence. Every seed field is derived, never guessed:
// lib/vendor/session.ts — SESSION_KEY (:11), id must not be MOCK_VENDOR_ID (:19),
// access_token must not be MOCK_ACCESS_TOKEN (:20), _v >= SESSION_VERSION = 2 (:24).
//
// CAPTURES SHOW THE WHOLE SURFACE, AND fullPage ALONE DOES NOT ACHIEVE THAT HERE.
// Two lessons, both paid for by this instrument's own frames:
//   (1) The first set shipped VIEWPORT-cropped, and a panel row that fell below the fold read
//       as a MISSING row — this seat nearly filed a defect off its own evidence.
//   (2) `fullPage: true` fixed nothing, because the branch shell is `height:100dvh` with
//       `overflow:hidden` and an INNER scroll column (`.wl-main`). fullPage captures the
//       DOCUMENT; the document is exactly one viewport tall, and the content scrolls inside
//       an element. The second set clipped in the same place for a different reason.
// So `unclip()` below expands the inner scroller for the duration of the frame and restores
// it after. A frame that silently truncates is the pixel-domain form of a sweep that reads
// one page — and it took two tries to stop making one.

const chromium = require('@sparticuz/chromium').default;
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const BASE = (process.argv[2] || '').replace(/\/$/, '');
const capIdx = process.argv.indexOf('--capture');
const CAPTURE = capIdx > -1 ? process.argv[capIdx + 1] : null;
if (!BASE) {
  console.error('usage: node tools/wl_render.cjs <base-url> [--capture <dir>]');
  process.exit(2);
}

const SEED = {
  id: '11111111-2222-3333-4444-555555555555', user_id: 'wl-render-arm',
  name: 'Dev Roy', phone: '+919888294440', tier: 'signature',
  access_token: 'wl-render-arm-token', refresh_token: 'wl-render-arm-token', _v: 2,
};
const VIEW = { width: 390, height: 844, deviceScaleFactor: 2 };

let pass = 0, fail = 0;
const P = (n, why) => { console.log('PASS  ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL  ' + n + '  — ' + why); fail++; };

async function seat(browser, mode) {
  const p = await browser.newPage();
  await p.setViewport(VIEW);
  await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
  await p.evaluate((s, m) => {
    localStorage.setItem('vendor_session', JSON.stringify(s));
    localStorage.setItem('tdw_worklist_mode', m);
  }, SEED, mode);
  await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.wl-coin', { timeout: 20000 });
  return p;
}

(async () => {
  console.log('wl_render · ' + BASE + '\n');
  console.log('fixture: SYNTHETIC-SPLASH — the seeded token is not real, so every');
  console.log('authenticated fetch fails closed. Chrome is real; data is not.\n');

  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  });

  for (const mode of ['dark', 'light']) {
    const p = await seat(browser, mode);
    const tag = '[' + mode + '] ';

    // ── C-R1 · THE DRAWER PAINTS INSIDE THE VIEWPORT ────────────────────────
    // The defect: `.wl-drawer` was a SIBLING of the header it anchors to, so its
    // `top:calc(100% + 8px)` resolved against the viewport, not the header.
    await p.click('.wl-coin');
    await new Promise((r) => setTimeout(r, 350));
    const d = await p.evaluate(() => {
      const el = document.querySelector('.wl-drawer');
      if (!el) return { found: false };
      const r = el.getBoundingClientRect();
      return { found: true, top: Math.round(r.top), bottom: Math.round(r.bottom),
               w: Math.round(r.width), h: Math.round(r.height), vh: window.innerHeight,
               visible: r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0 };
    });
    if (d.found && d.visible) P(tag + 'C-R1 drawer paints inside the viewport', 'top ' + d.top + ' of ' + d.vh);
    else F(tag + 'C-R1 drawer paints inside the viewport', JSON.stringify(d));

    // ── C-R2 · THE GUTTER APPLIES  [R-37.82 ①] ──────────────────────────────
    // Not "is the rule in the stylesheet" — that is the byte-gate's question and it
    // answered yes for twelve ZIPs while the grid ran flush to both edges.
    await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.wl-tile', { timeout: 20000 });
    const g = await p.evaluate(() => {
      const tiles = [...document.querySelectorAll('.wl-tile')];
      const first = tiles[0].getBoundingClientRect();
      const last = tiles.slice(0, 3).pop().getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(document.querySelector('.wl'))
        .getPropertyValue('--wl-gutter')) || 0;
      return { gutter, left: Math.round(first.left), right: Math.round(last.right),
               innerW: window.innerWidth, tiles: tiles.length };
    });
    const insetOk = g.gutter > 0 && g.left >= g.gutter - 1 && g.right <= g.innerW - g.gutter + 1;
    if (insetOk) P(tag + 'C-R2 the gutter APPLIES', 'inset ' + g.left + 'px both sides, --wl-gutter ' + g.gutter);
    else F(tag + 'C-R2 the gutter APPLIES', 'declared ' + g.gutter + 'px; rendered left ' + g.left + ', right ' + g.right + ' of ' + g.innerW);

    // ── C-R3 · THE ROOM COUNT ON SCREEN  [R-37.87] ──────────────────────────
    if (g.tiles === 17) P(tag + 'C-R3 seventeen tiles render', '17 tiles on screen');
    else F(tag + 'C-R3 seventeen tiles render', 'rendered ' + g.tiles);

    // ── C-R4 · THE CHAT SHEDS THE COSTUME  [computed, not matched] ──────────
    // NB `sans-serif` CONTAINS `serif`; the first cut of this cell reddened a cured
    // tree on that alone. The sans- form is stripped before the serif test.
    await p.click('.wl-dockfield').catch(() => p.click('.wl-dock'));
    await new Promise((r) => setTimeout(r, 700));
    const c = await p.evaluate(() => {
      const ta = document.querySelector('.wl-askpanel textarea') || document.querySelector('textarea');
      if (!ta) return { found: false };
      const cs = getComputedStyle(ta);
      return { found: true, fontStyle: cs.fontStyle, fontFamily: cs.fontFamily };
    });
    const fam = (c.fontFamily || '').replace(/sans-serif/gi, '');
    if (c.found && c.fontStyle !== 'italic' && !/cormorant|georgia|\bserif\b/i.test(fam))
      P(tag + 'C-R4 chat input in branch tokens', c.fontStyle + ' / ' + c.fontFamily.split(',')[0]);
    else F(tag + 'C-R4 chat input in branch tokens', JSON.stringify(c));

    // ── C-R5 · THE CHAT IS A WORK SURFACE  [R-37.89] ────────────────────────
    // `max-height` is a CAP, not a height: it only bites when content is tall, and a
    // fresh thread is empty. The sheet opened at ~35% of the viewport for that reason.
    const h = await p.evaluate(() => {
      const el = document.querySelector('.wl-askpanel');
      if (!el) return { found: false };
      const r = el.getBoundingClientRect();
      return { found: true, h: Math.round(r.height), vh: window.innerHeight,
               ratio: +(r.height / window.innerHeight).toFixed(3) };
    });
    if (h.found && h.ratio >= 0.8) P(tag + 'C-R5 chat opens at work-surface height', h.ratio + ' of viewport');
    else F(tag + 'C-R5 chat opens at work-surface height', JSON.stringify(h));

    // ── CAPTURES · fullPage, always, with the data condition in the name ────
    if (CAPTURE) {
      fs.mkdirSync(CAPTURE, { recursive: true });
      // Expand the inner scroll column so the frame carries the WHOLE surface, then restore.
      const unclip = () => p.evaluate(() => {
        const wl = document.querySelector('.wl'), main = document.querySelector('.wl-main');
        if (!wl || !main) return;
        wl.dataset.wlPrevH = wl.style.height; wl.dataset.wlPrevO = wl.style.overflow;
        wl.style.height = 'auto'; wl.style.overflow = 'visible';
        main.style.overflowY = 'visible'; main.style.flex = 'none';
      });
      const reclip = () => p.evaluate(() => {
        const wl = document.querySelector('.wl'), main = document.querySelector('.wl-main');
        if (!wl || !main) return;
        wl.style.height = wl.dataset.wlPrevH || '100dvh'; wl.style.overflow = wl.dataset.wlPrevO || 'hidden';
        main.style.overflowY = ''; main.style.flex = '';
      });
      const shot = async (n) => {
        await unclip(); await new Promise((r) => setTimeout(r, 250));
        await p.screenshot({ path: `${CAPTURE}/${mode}__${n}__SYNTHETIC-SPLASH.png`, fullPage: true });
        await reclip();
      };
      for (const [name, path] of [['w-rooms', '/w/rooms'], ['w-today', '/w/today'],
        ['w-support', '/w/support'], ['room-leads', '/vendor/list/leads'],
        ['room-settings', '/vendor/settings'], ['room-collab', '/vendor/collab']]) {
        await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
        await new Promise((r) => setTimeout(r, 1400));
        await shot(name);
      }
      await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('.wl-coin', { timeout: 20000 });
      await p.click('.wl-coin'); await new Promise((r) => setTimeout(r, 400));
      await shot('tapped-drawer');
      await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('.wl-dockfield', { timeout: 20000 });
      await p.click('.wl-dockfield'); await new Promise((r) => setTimeout(r, 800));
      await shot('tapped-chat');
    }
    await p.close();
  }

  await browser.close();
  console.log('\n' + pass + ' PASS · ' + fail + ' FAIL');
  if (CAPTURE) console.log('captures: ' + fs.readdirSync(CAPTURE).length + ' fullPage frames in ' + CAPTURE);
  console.log(fail === 0 ? 'RENDER ARM GREEN.' : 'RENDER ARM RED — the ZIP bounces.');
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('render arm threw: ' + e.message); process.exit(3); });
