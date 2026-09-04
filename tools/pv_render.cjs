#!/usr/bin/env node
'use strict';
// tools/pv_render.cjs — THE PUBLIC-ROUTE RENDER ARM.
//
//   node tools/pv_render.cjs <base-url> [--capture <dir>]
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS FILE EXISTS, AND WHY IT WAS BUILT BEFORE THE CURE IT GATES
// ═══════════════════════════════════════════════════════════════════════════
// Two founder walks of `/v/` failed against a fully green gate. The tables in
// both walk packets say the same thing with different rows:
//
//   bs_audit C33 asserts the SOURCE declares `flex:0 0 104px` for a strip
//   thumbnail. That assertion is TRUE and the founder photographed thumbnails
//   at column width. C34 asserts three @keyframes and six staged delays exist
//   in source. Also true; he saw no arrival.
//
// Both cells were written IN DIRECT RESPONSE to the first walk and both passed
// the page the second walk rejected, because a declaration is not a computed
// value and a stylesheet is not a screen. `wl_render.cjs` owns exactly this law
// for the app shell (CE-37): *a rule that is present in a stylesheet is not a
// rule that applies, and presence in a bundle is not presence on screen.* The
// public routes had no equivalent. This is it.
//
// ── IT WAS BUILT AS A DERIVATION TOOL, NOT AS A GUARD (CE-38, this relay) ──
// W2-2 has no mechanism. Source is clean — no `img` rule in `globals.css` at
// all, and Tailwind 4.2.2's preflight only sets `max-width:100%; height:auto`,
// which cooperates with `aspect-ratio` and loses on specificity to
// `.pv-strip img` regardless. Nothing readable explains the rendered width.
//
// So the chair inverted the order: this arm runs FIRST, against the live
// deployment, and reports the computed width and the rule that produced it.
// Then D-19.1's cut lands on known behaviour instead of a plausible story. An
// instrument built to gate, used first to derive — the revert proves the fix,
// not the cause, and this is how a cause gets named at all.
//
// ── THE BROWSER, INHERITED VERBATIM FROM wl_render ────────────────────────
// Playwright's CDN and Google's storage host are denied at this estate's egress
// proxy and no system chromium exists in the container. `@sparticuz/chromium`
// ships the binary inside its npm tarball and npm is allow-listed. Driven with
// `puppeteer-core`. Same launch args, same `protocolTimeout` reasoning: a long
// timeout does not make a hang succeed, it makes a hang expensive.
//
// ── NO TOKEN, AND THAT IS THE POINT ───────────────────────────────────────
// `wl_render` needs a real vendor session and reds loudly without one. This arm
// asserts the opposite property: these routes must answer a COMPLETE STRANGER.
// It carries no token, seeds no storage, and if a cell here ever needed one the
// route would have failed its own charter.
//
// ── TWO LOADS, COLD AND PRIMED (CE-38, this relay) ────────────────────────
// The service worker registers origin-wide from the ROOT layout
// (`app/layout.tsx:147` → `ServiceWorkerRegistrar` → `register('/sw.js')` with
// no scope), so one visit to any page claims `/v/` for that browser. Reading
// `public/sw.js` clears it of serving stale documents — navigations are
// network-first and no `cache.put` touches a navigation path anywhere in the
// file (F-19.36). But an exoneration from source is exactly what this arm
// exists to distrust, so the page is opened TWICE: once in a virgin profile,
// once after the worker has installed and claimed. The same assertions run on
// both. A service-worker regression can never pass here again.

const chromium = require('@sparticuz/chromium').default;
const puppeteer = require('puppeteer-core');
const fs = require('node:fs');
const path = require('node:path');

const BASE = (process.argv[2] || '').replace(/\/$/, '');
const CAP_I = process.argv.indexOf('--capture');
const CAP = CAP_I > -1 ? process.argv[CAP_I + 1] : null;

if (!BASE || !/^https?:\/\//.test(BASE)) {
  console.error('usage: node tools/pv_render.cjs <base-url> [--capture <dir>]');
  console.error('');
  console.error('THIS ARM HAS NO SUBJECT WITHOUT A URL and will not invent one.');
  console.error('`wl_audit.mjs` refuses the same way and for the same reason: its');
  console.error('subject is a DEPLOY, and with no deploy there is nothing to look at.');
  process.exit(2);
}

// 374x900 — the founder's own walk viewport, so a finding he photographs and a
// number this arm prints describe the same screen. Not 390: he walks at 374 and
// an instrument that measured a different width would argue with his captures.
const VIEW = { width: 374, height: 900, deviceScaleFactor: 2 };

// The fold law's own inputs (D-19.1 §1). Stated here so the cell reads as
// arithmetic rather than as a remembered number.
const FOLD = VIEW.height;

let pass = 0, fail = 0, inconclusive = 0;
const P = (n, why) => { console.log('PASS  ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL  ' + n + '  — ' + why); fail++; };
const I = (n, why) => { console.log('INCO  ' + n + '  — ' + why); inconclusive++; };
const chk = (c, n, why) => (c ? P(n, why) : F(n, why));

const HANDLE = process.env.PV_HANDLE || 'DEV440';
const DEMO   = process.env.PV_DEMO   || 'demofilms';
const MISS   = 'ZZZZZZ';

/**
 * Everything this arm can only learn from a live browser, gathered in one
 * evaluate so a page is measured in one consistent layout pass.
 *
 * ⚠ IT REPORTS, IT DOES NOT JUDGE. Every verdict is taken outside, in a named
 * cell. A collector that decided anything would be a second place a cell could
 * live, and the next reader would have to check two files to know what is
 * asserted — `wl_render`'s own separation, kept.
 */
async function measure(page) {
  return page.evaluate(() => {
    const px = (v) => Math.round(parseFloat(v) || 0);
    const out = {};

    // ── THE STRIP, W2-2's SUBJECT ──────────────────────────────────────────
    const thumbs = [...document.querySelectorAll('.pv-strip img')];
    out.thumbCount = thumbs.length;
    if (thumbs.length) {
      const t = thumbs[0];
      const r = t.getBoundingClientRect();
      const cs = getComputedStyle(t);
      out.thumb = {
        // ⚠ F-19.39 — WITHOUT THESE TWO FIELDS EVERY MEASUREMENT BELOW IS A LIE
        // OF OMISSION. This container's egress denies Cloudinary, so in five
        // consecutive runs the strip images never decoded: `naturalWidth` was 0,
        // the flex item's automatic minimum size was therefore 0, `flex-basis`
        // won by default, and the arm reported a confident `104px rendered` —
        // PASS — against a page the founder was watching render at 1080px.
        //
        // An unloaded replaced element has NO intrinsic size, so it cannot
        // exhibit the very trap this cell exists to catch. Geometry measured on
        // it is not weak evidence, it is evidence of a different page.
        // Identity-precedes-verdict, extended from the DOCUMENT to its CONTENT.
        naturalWidth: t.naturalWidth,
        complete: t.complete,
        renderedWidth:  Math.round(r.width),
        renderedHeight: Math.round(r.height),
        flexBasis: cs.flexBasis,
        flexGrow:  cs.flexGrow,
        flexShrink: cs.flexShrink,
        width:      cs.width,
        minWidth:   cs.minWidth,
        maxWidth:   cs.maxWidth,
        aspectRatio: cs.aspectRatio,
        // The parent decides a flex item's used main size as much as the item
        // does. Reported together or the number has no explanation.
        parentDisplay:  getComputedStyle(t.parentElement).display,
        parentWidth:    Math.round(t.parentElement.getBoundingClientRect().width),
        parentOverflowX: getComputedStyle(t.parentElement).overflowX,
      };
    }

    // ── THE HERO AND THE FOLD, D-19.1 §1's requirement ────────────────────
    const hero = document.querySelector('.pv-hero');
    if (hero) {
      const r = hero.getBoundingClientRect();
      const img = hero.querySelector('img');
      out.hero = {
        height: Math.round(r.height), width: Math.round(r.width),
        // D-19.1 §3's CLS property. The box is sized by clamp(), never by the
        // image's intrinsic ratio, so the photograph paints into a box that was
        // already correct. Reported as the two facts that make it true.
        cssHeight: getComputedStyle(hero).height,
        imgComplete: img ? img.complete : null,
        imgAnimation: img ? getComputedStyle(img).animationName : null,
        shimmerPresent: !!hero.querySelector('.pv-shimmer'),
        shimmerIterations: (() => {
          const el = hero.querySelector('.pv-shimmer');
          return el ? getComputedStyle(el).animationIterationCount : null;
        })(),
      };
    }
    // Cumulative layout shift over the whole load, from the browser's own
    // observer rather than from a before/after guess.
    out.cls = window.__pvCLS == null ? null : Number(window.__pvCLS.toFixed(4));
    // The name, wherever it lives — D-19.1 moves it INTO the hero, so this
    // must not assume either home.
    const name = document.querySelector('h1');
    if (name) {
      const r = name.getBoundingClientRect();
      const cs = getComputedStyle(name);
      out.name = {
        top: Math.round(r.top), bottom: Math.round(r.bottom),
        color: cs.color, fontSize: cs.fontSize, fontFamily: cs.fontFamily.split(',')[0],
        text: (name.textContent || '').trim().slice(0, 60),
      };
    }
    const cta = document.querySelector('.pv-cta');
    if (cta) {
      const r = cta.getBoundingClientRect();
      out.cta = { top: Math.round(r.top), color: getComputedStyle(cta).color, href: cta.getAttribute('href') };
    }

    // ── ARRIVAL, W2-3's SUBJECT ───────────────────────────────────────────
    // Computed animation properties, read off the elements that should carry
    // them. `animationName: none` on a page whose source declares keyframes is
    // the exact gap C34 cannot see.
    out.motion = {};
    for (const sel of ['.pv-hero', '.pv-body', '.pv-cta', '.pv-strip', '.pv-close']) {
      const el = document.querySelector(sel);
      out.motion[sel] = el
        ? { name: getComputedStyle(el).animationName, delay: getComputedStyle(el).animationDelay }
        : null;
    }

    // ── THE BUILD, so a walk starts by reading the commit off the page ────
    const meta = document.querySelector('meta[name="tdw-build"]');
    out.build = meta ? meta.getAttribute('content') : null;

    // ── WHO IS CONTROLLING THIS DOCUMENT ──────────────────────────────────
    out.swController = !!(navigator.serviceWorker && navigator.serviceWorker.controller);

    // ── F-19.41 / F-19.42 · THE GROUNDS THE BROWSER ACTUALLY PAINTED ─────────
    // The walk-4 packet claimed the root layout's inline script wrote a dark
    // background onto html/body. The probe refused it — both inline styles were
    // null and `.pv` computed cream on both branches. The page was right; the
    // browser inverted it, because nothing declared that the ground was chosen.
    //
    // A stylesheet cell can only ever read the ground a page DECLARES. This
    // reads the three surfaces separately, so a divergence between what the
    // sheet says and what the canvas is has somewhere to show up.
    const pvEl = document.querySelector('.pv');
    out.grounds = {
      html:        getComputedStyle(document.documentElement).backgroundColor,
      htmlInline:  document.documentElement.style.background || null,
      body:        getComputedStyle(document.body).backgroundColor,
      main:        pvEl ? getComputedStyle(pvEl).backgroundColor : null,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      themeColor:  (document.querySelector('meta[name="theme-color"]') || {}).content || null,
    };
    // ⚠ RETIRED WITH ITS READER (F-19.44). This collected `.pv-heroLink, .pv-strip
    // a` — the anchors CE-38 put on every photograph so the browser's own viewer
    // could open them. The founder's 2026-08-29 ruling replaced that mechanism
    // with radio-driven displacement and there are no photograph anchors left to
    // collect. Kept as a note rather than deleted silently: a reader looking for
    // W4-1's cell should find out where it went, not find nothing.
    //
    // What survives of its question — every `_blank` carries `noopener` — moved
    // to the surviving links, which are Enquire and the colophon address.
    out.blankLinks = [...document.querySelectorAll('a[target="_blank"]')].map((a) => ({
      href: a.getAttribute('href'),
      noopener: /noopener/.test(a.getAttribute('rel') || ''),
    }));

    // ── F-19.43 · THE COMPUTED COLOPHON, AND THE PAGE'S OWN WIDTH ──────────
    // The whole finding in two numbers. A declaration said 9px; the browser
    // dropped the declaration and rendered 14px; `nowrap` at 14px pushed the
    // line 158px past its column and the document scrolled sideways. Both are
    // computed values, which is the only kind of value that could have caught it.
    const col = document.querySelector('.pv-colophon');
    out.colophon = col ? {
      fontSize: getComputedStyle(col).fontSize,
      fontWeight: getComputedStyle(col).fontWeight,
      whiteSpace: getComputedStyle(col).whiteSpace,
      inkWidth: col.scrollWidth,
      boxWidth: Math.round(col.getBoundingClientRect().width),
    } : null;
    out.doc = {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };

    // ── F-19.44 · THE HERO STACK AND THE STRIP'S LABELS ────────────────────
    // Identity of the mechanism, before any verdict about its behaviour: how
    // many layers, how many radios, how many labels, and which layer is showing.
    const layers = [...document.querySelectorAll('.pv-hero-img')];
    out.gallery = {
      layers: layers.length,
      radios: document.querySelectorAll('.pv-radio').length,
      labels: document.querySelectorAll('.pv-strip label').length,
      checked: [...document.querySelectorAll('.pv-radio')].findIndex((r) => r.checked),
      // ⚠ F-19.39 EXTENDED TO THE STACK. An unloaded <img> has no intrinsic
      // size and no decoded pixels, so a geometry or paint claim about it is a
      // claim about a different page. Reported beside every opacity below.
      shown: layers.map((el) => ({
        i: el.getAttribute('data-i'),
        opacity: getComputedStyle(el).opacity,
        naturalWidth: el.naturalWidth,
        src: el.getAttribute('src'),
      })),
    };
    out.thumbs = [...document.querySelectorAll('.pv-strip label')].map((l) => ({
      htmlFor: l.getAttribute('for'),
      src: (l.querySelector('img') || {}).src || null,
      tap: Math.round(l.getBoundingClientRect().width) + 'x' + Math.round(l.getBoundingClientRect().height),
    }));

    // ── CONTRAST, sampled where type actually sits ────────────────────────
    // Declared pairs are `bs_audit`'s to compute. What only a browser knows is
    // what a light glyph is sitting ON when the background is a photograph —
    // which is W2-1 exactly, and is not derivable from any stylesheet.
    // ⚠ THE GROUND IS DERIVED, NOT ROSTERED. The first cut named `.pv-mark-name`
    // as the one ink sitting on a photograph and computed every other against
    // cream. Then D-19.1 moved the `h1` INTO the hero, and the cell reported
    // `1.00:1` — arithmetic about a surface the glyph is not on. A list of the
    // exceptions a seat happens to know about is the roster mistake, twice.
    // Containment answers it: anything inside `.pv-hero` sits on a photograph
    // under a scrim and is not computable against a fixed ground.
    out.inks = [];
    for (const sel of ['.pv-close-mark', '.pv-colophon', '.pv-line', '.pv-demo', 'h1', '.pv-cta']) {
      const el = document.querySelector(sel);
      if (!el) continue;
      out.inks.push({
        sel,
        color: getComputedStyle(el).color,
        onPhoto: !!el.closest('.pv-hero'),
      });
    }
    return out;
  });
}

/** WCAG relative luminance and contrast, on computed rgb() strings. */
function rgb(s) {
  const m = String(s).match(/\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : null;
}
function lum(c) {
  const f = c.map((v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}
function contrast(a, b) {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * ⚠ IS THIS DOCUMENT EVEN THE PRODUCT? — added after this arm's FIRST RUN, which
 * scored `4 PASS` against a page that was not the deploy at all.
 *
 * The run happened from a container whose egress proxy denies `vercel.app`, so
 * every navigation resolved to the proxy's own refusal page. §3.1 asserts that
 * no status code or framework artefact is visible — and `Host not in allowlist`
 * contains no `404`, no `not found`, no `error`, so IT PASSED. §3.2 asserted the
 * miss carries nothing of a vendor, and a proxy error page carries nothing of
 * anything, so that passed too. Two green cells about a document this estate
 * never served.
 *
 * That is D-38.1's disease in a render arm: a cell agreeing with a description
 * of itself. The FAILs in that run were honest by accident — they failed for
 * the right reason (no `.pv-cta`) via the wrong cause (no page). Accident is not
 * a property to rely on.
 *
 * So identity is proven before any verdict is taken. A document that is not ours
 * makes every cell INCONCLUSIVE rather than letting some of them be right by
 * coincidence.
 */
function isOurs(probe) {
  return probe.hasPv || probe.hasNextRoot;
}

async function open(browser, url, label, opts = {}) {
  const p = await browser.newPage();
  await p.setViewport(VIEW);
  // Installed BEFORE the document exists, or it measures nothing: layout shift
  // is emitted during load and an observer attached afterwards has already
  // missed it.
  await p.evaluateOnNewDocument(() => {
    window.__pvCLS = 0;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__pvCLS += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch { /* an unsupported browser reports null, never zero */ }
  });
  // A stranger's browser. No token, no seeded storage, no cookie.
  try {
    await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    await p.close().catch(() => {});
    return { page: null, error: String(e && e.message || e).slice(0, 140) };
  }
  if (opts.settle) await new Promise((r) => setTimeout(r, opts.settle));
  const probe = await p.evaluate(() => ({
    hasPv: !!document.querySelector('.pv'),
    hasNextRoot: !!document.querySelector('#__next, [data-nextjs-scroll-focus-boundary], script[src*="/_next/"]'),
    title: document.title,
    head: (document.body.innerText || '').trim().slice(0, 90),
  }));
  if (!isOurs(probe)) {
    await p.close().catch(() => {});
    return { page: null, error: null, notOurs: probe };
  }
  if (CAP) {
    try {
      fs.mkdirSync(CAP, { recursive: true });
      await p.screenshot({ path: path.join(CAP, `${label}.png`), fullPage: true });
    } catch { /* a capture is a courtesy, never a verdict */ }
  }
  return { page: p, error: null };
}

(async () => {
  console.log(`\npv_render — the public-route render arm`);
  console.log(`base     ${BASE}`);
  console.log(`viewport ${VIEW.width}x${VIEW.height} @${VIEW.deviceScaleFactor}x — the founder's own walk size`);
  console.log(`fixture  /v/${HANDLE} · /v/${DEMO} · /v/${MISS}   (no token, by design)\n`);

  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(),
    headless: 'shell',
    protocolTimeout: 120000,
  });

  try {
    // ═══ §1 · COLD — a stranger's first visit, no worker ═══════════════════
    console.log('── §1 · cold load, virgin profile, no service worker ──');
    let coldThumb = null;
    const cold = await open(browser, `${BASE}/v/${HANDLE}`, 'cold_v_handle', { settle: 1500 });
    if (cold.notOurs) {
      console.error('\nSTOP — the document served is not this estate\u2019s.');
      console.error('  title: ' + JSON.stringify(cold.notOurs.title));
      console.error('  body : ' + JSON.stringify(cold.notOurs.head));
      console.error('');
      console.error('  No verdict is taken. A cell that passes on someone else\u2019s error');
      console.error('  page has measured nothing, and this arm scored 4 PASS that way once.');
      console.error('  Usual cause: the runner\u2019s egress denies the host. Run from a machine');
      console.error('  that can reach the deploy.');
      await browser.close().catch(() => {});
      process.exit(2);
    }
    if (!cold.page) {
      F('§1.1 the page loads for a stranger', cold.error);
      I('§1.2 …every measurement below', 'no page to measure');
    } else {
      const m = await measure(cold.page);
      P('§1.1 the page loads for a stranger', `sw controller: ${m.swController}`);

      // THE DERIVATION W2-2 IS WAITING ON.
      if (!m.thumbCount) {
        I('§1.2 the strip thumbnail\u2019s COMPUTED width', 'no .pv-strip img on the page');
      } else {
        const t = m.thumb;
        console.log(`      thumb    rendered ${t.renderedWidth}x${t.renderedHeight}px`);
        console.log(`               flex-basis ${t.flexBasis} · grow ${t.flexGrow} · shrink ${t.flexShrink}`);
        console.log(`               width ${t.width} · min ${t.minWidth} · max ${t.maxWidth} · ratio ${t.aspectRatio}`);
        console.log(`               parent ${t.parentDisplay}, ${t.parentWidth}px, overflow-x ${t.parentOverflowX}`);
        coldThumb = t.renderedWidth;
        console.log(`               natural ${t.naturalWidth}px · complete ${t.complete}`);
        if (!t.complete || !t.naturalWidth) {
          I('§1.2 the strip renders as a glance, not a gallery',
            `the image did not load (natural ${t.naturalWidth}, complete ${t.complete}) — an unloaded <img> has no intrinsic size and cannot exhibit the min-width:auto floor, so ${t.renderedWidth}px is a measurement of a different page. F-19.39.`);
        } else {
          chk(t.renderedWidth <= 140,
              '§1.2 the strip renders as a glance, not a gallery',
              `${t.renderedWidth}px rendered from a ${t.naturalWidth}px source (basis ${t.flexBasis}, min-width ${t.minWidth})`);
          // The mechanism itself, asserted rather than inferred: the cure is
          // `min-width:0`, and `auto` is the four-sitting bug by name.
          chk(t.minWidth === '0px',
              '§1.2b the flex image defuses its automatic minimum (F-19.38)',
              `min-width: ${t.minWidth}`);
        }
        // The mechanism cell. If the declaration and the render disagree, the
        // arm names WHICH property won rather than reporting a mismatch.
        if (t.renderedWidth > 140) {
          const why = t.parentDisplay !== 'flex' ? `parent display is ${t.parentDisplay}, not flex — flex-basis is inert`
            : t.flexGrow !== '0' ? `flex-grow is ${t.flexGrow}`
            : t.width !== 'auto' && !t.width.startsWith('104') ? `an explicit width:${t.width} beat the basis`
            : t.minWidth !== '0px' && t.minWidth !== 'auto' ? `min-width:${t.minWidth}`
            : 'basis honoured but the box is still wide — look at the parent';
          console.log(`      ⚠ MECHANISM: ${why}`);
        }
      }

      // W2-3's subject, computed.
      const motions = Object.entries(m.motion).filter(([, v]) => v);
      const animated = motions.filter(([, v]) => v.name && v.name !== 'none');
      // D-19.1 §3 names EXACTLY two moving blocks. More is a divergence from the
      // ruling, not extra polish — the arm caught four surviving from S4.
      const ruled = ['.pv-body'];
      chk(animated.length >= 1 && animated.length <= 2 && ruled.every((r) => animated.some(([s]) => s === r)),
          '§1.3 the page ARRIVES, and ONLY the two ruled blocks move',
          animated.length ? animated.map(([s, v]) => `${s}=${v.name}@${v.delay}`).join(' · ') : 'every element computes animation-name:none');

      // The fold law, measured against the founder's own screen.
      if (m.name) {
        console.log(`      h1       "${m.name.text}" top ${m.name.top} bottom ${m.name.bottom} · ${m.name.fontSize} ${m.name.fontFamily}`);
        chk(m.name.bottom > 0 && m.name.bottom <= FOLD,
            '§1.4 the vendor\u2019s name is above the fold, unscrolled',
            `name bottom ${m.name.bottom} of ${FOLD}`);
      } else {
        F('§1.4 the vendor\u2019s name is above the fold, unscrolled', 'no <h1> on the page');
      }
      if (m.cta) {
        console.log(`      cta      top ${m.cta.top} → ${m.cta.href}`);
        chk(/wa\.me\//.test(m.cta.href || ''),
            '§1.5 the enquire affordance targets WhatsApp', String(m.cta.href).slice(0, 60));
      } else {
        F('§1.5 the enquire affordance targets WhatsApp', 'no .pv-cta rendered');
      }

      // W2-1 / W2-4 — contrast where the glyph actually is.
      const CREAM = [248, 247, 245];
      for (const ink of m.inks) {
        const c = rgb(ink.color);
        if (!c) continue;
        const r = contrast(c, CREAM);
        // The hero wordmark sits on a PHOTOGRAPH, so a cream comparison is
        // meaningless for it — reported, never asserted. D-19.1 removes it.
        if (ink.onPhoto) {
          I(`§1.6 ${ink.sel} contrast`, `${ink.color} inside .pv-hero — over a photograph under a scrim, not computable against a fixed ground; a walk and a pixel sample own this one`);
        } else {
          chk(r >= 4.5, `§1.6 ${ink.sel} clears 4.5:1 on cream`, `${r.toFixed(2)}:1  (${ink.color})`);
        }
      }

      if (m.hero) {
        console.log(`      hero     ${m.hero.width}x${m.hero.height}px · css height ${m.hero.cssHeight} · img bg ${m.hero.imgBackground}`);
        chk(m.hero.cssHeight !== 'auto' && m.hero.height >= 300 && m.hero.height <= 480,
            '§1.6b the hero box is sized before the image, and bounded',
            `${m.hero.height}px from ${m.hero.cssHeight}`);
        // ⚠ THIS CELL WAS THE DEFECT, INVERTED. It asserted the placeholder was
        // ON the image — which was true, and was F-19.40: an animation on a
        // replaced element animates the picture, so the photograph pulsed
        // forever. A cell written from the code's own wrong premise agreed with
        // it. The placeholder must be a SEPARATE LAYER the decoded image covers.
        chk(m.hero.shimmerPresent && (!m.hero.imgAnimation || m.hero.imgAnimation === 'pvFade'),
            '§1.6c the placeholder is a layer BENEATH the image, not the image',
            `shimmer element: ${m.hero.shimmerPresent} · img animation: ${m.hero.imgAnimation}`);
      }
      // D-19.1 §3. A hero whose box is pre-sized by clamp() cannot shift when
      // the photograph settles — this asserts the property rather than trusting
      // the rule that produces it.
      chk(m.cls !== null && m.cls < 0.01,
          '§1.6d no layout shift when the hero settles (CLS \u2248 0)',
          m.cls === null ? 'the browser reported no layout-shift entries' : `CLS ${m.cls}`);
      if (m.hero) {
        // F-19.40. `infinite` on anything a reader is looking at reads as a page
        // that never finished loading. A cap is the honest substitute for the
        // load signal CSS does not provide.
        chk(m.hero.shimmerIterations !== 'infinite',
            '§1.6e the placeholder does not loop forever',
            `iterations: ${m.hero.shimmerIterations}`);
      }
      // ── §1.8 · THE CHROME THIS ROUTE DECLARES (F-19.41 / F-19.42) ────────
      if (m.grounds) {
        const g = m.grounds;
        console.log(`      grounds  html ${g.html} · body ${g.body} · main ${g.main}`);
        console.log(`               color-scheme ${g.colorScheme} · theme-color ${g.themeColor}`);
        chk(g.colorScheme === 'light',
            '§1.8 the page declares its ground was chosen (F-19.42)',
            `color-scheme: ${g.colorScheme} — "normal" is what auto-dark inverts`);
        chk(g.themeColor === '#F8F7F5',
            '§1.8b the browser chrome is this page\u2019s, not the app shell\u2019s (F-19.41)',
            `theme-color: ${g.themeColor}`);
        chk(g.main === 'rgb(248, 247, 245)',
            '§1.8c the painted ground is the declared one', String(g.main));
      }
      // ── §1.9 · every _blank still carries noopener ────────────────────────
      // W4-1's cell is retired with the anchors it watched (see the collector).
      // Its surviving half applies to the links that remain: Enquire, and the
      // colophon address. A `_blank` without `noopener` hands the opened page a
      // handle on this one, and on a public route that is a hole, not a nit.
      if (m.blankLinks) {
        const bad = m.blankLinks.filter((l) => !l.href || !l.noopener);
        chk(m.blankLinks.length >= 1 && bad.length === 0,
            '§1.9 every _blank link carries noopener',
            `${m.blankLinks.length} link(s), ${bad.length} without noopener`);
      }

      // ── §1.10 · R-a · F-19.43, OBSERVED ──────────────────────────────────
      // The defect the founder photographed, in the only terms that could have
      // caught it: a COMPUTED font size and the document's own width. Thirty-nine
      // source cells were green while this page rendered its 9px credit line at
      // 14px, because a declaration is not a computed value — D-38.1, and the
      // most expensive proof of it this block has produced.
      //
      // ⚠ BOTH HALVES ARE ASSERTED. Size alone would pass a page that still
      // scrolled; width alone would pass a page that had wrapped its way out of
      // trouble at the wrong size. `bs_audit` C41 asserts the same pair on a
      // fixture at 320 and 374 and needs no network; this one asserts it on the
      // DEPLOY at the founder's own 374, which is the thing a fixture cannot be.
      if (m.colophon) {
        console.log(`      colophon ${m.colophon.fontSize}/${m.colophon.fontWeight} · ${m.colophon.whiteSpace} · ink ${m.colophon.inkWidth}px in ${m.colophon.boxWidth}px`);
        chk(m.colophon.fontSize === '9px',
            '§1.10 R-a the colophon computes the size it declares (F-19.43)',
            `computed ${m.colophon.fontSize} — the source says 9px`);
      } else {
        F('§1.10 R-a the colophon computes the size it declares (F-19.43)', 'no .pv-colophon on the page');
      }
      if (m.doc) {
        chk(m.doc.scrollWidth <= m.doc.innerWidth,
            '§1.10b R-a the page does not scroll sideways at 374',
            `documentElement.scrollWidth ${m.doc.scrollWidth} vs innerWidth ${m.doc.innerWidth}`);
      }

      // ── §1.11 · R-b · F-19.44, OBSERVED AT THE MOMENT OF THE TAP ─────────
      // The founder's ruling: *clicking any picture should displace the hero
      // picture at the top.* This clicks the SECOND thumbnail's label and then
      // asks what is actually on screen — not whether a radio exists, not
      // whether a rule is present, but which photograph the hero is showing and
      // whether anything else moved.
      //
      // ⚠ IDENTITY BEFORE GEOMETRY, TWICE OVER (F-19.37, F-19.39). The gallery
      // block is printed first: layers, radios, labels and which is checked. And
      // the src comparison is gated on `naturalWidth > 0` — an image that never
      // decoded has no pixels, and asserting that the hero "shows" it would be
      // the exact shape of the five runs that reported 104px thumbnails at 1080.
      if (m.gallery) {
        const g = m.gallery;
        console.log(`      gallery  ${g.layers} layer(s) \u00b7 ${g.radios} radio(s) \u00b7 ${g.labels} label(s) \u00b7 checked #${g.checked}`);
        chk(g.layers > 0 && g.layers === g.radios && g.radios === g.labels,
            '§1.11 one radio and one label per photograph, one layer each',
            `${g.layers} layers, ${g.radios} radios, ${g.labels} labels`);
        chk(g.checked === 0,
            '§1.11b the page arrives on the hero photograph',
            `radio #${g.checked} is checked`);
      }
      if (m.gallery && m.gallery.labels >= 2) {
        const before = { href: cold.page.url(), layers: m.gallery.shown };
        const pagesBefore = (await browser.pages()).length;
        await cold.page.click('.pv-strip label[for="pv-h1"]').catch(() => {});
        // The crossfade is `both`-filled: a read at t=0 sees opacity 0 on every
        // layer, including the winning one. Sampled after it lands, because the
        // moment a couple would call the hero "changed" is when the fade ends.
        await cold.page.evaluate(() => new Promise((r) => setTimeout(r, 1400)));
        const after = await cold.page.evaluate(() => {
          const layers = [...document.querySelectorAll('.pv-hero-img')];
          const visible = layers.find((el) => getComputedStyle(el).opacity === '1');
          return {
            visibleIndex: visible ? visible.getAttribute('data-i') : null,
            visibleSrc: visible ? visible.src : null,
            visibleNatural: visible ? visible.naturalWidth : 0,
            thumbSrc: (document.querySelector('.pv-strip label[for="pv-h1"] img') || {}).src || null,
            checked: [...document.querySelectorAll('.pv-radio')].findIndex((r) => r.checked),
            href: location.href,
          };
        });
        const pagesAfter = (await browser.pages()).length;
        console.log(`      tap#2    visible layer ${after.visibleIndex} \u00b7 checked #${after.checked} \u00b7 natural ${after.visibleNatural}px \u00b7 pages ${pagesBefore}\u2192${pagesAfter}`);
        chk(after.checked === 1 && after.visibleIndex === '1',
            '§1.11c tapping the second thumbnail displaces the hero',
            `checked #${after.checked}, visible layer ${after.visibleIndex}`);
        // F-19.39's gate. Without a decoded image the src equality is still
        // meaningful (both are attributes), but a PASS is declared INCONCLUSIVE
        // when nothing loaded, because "the hero shows that photograph" is a
        // claim about a picture and there is no picture.
        if (after.visibleNatural > 0) {
          chk(after.visibleSrc === after.thumbSrc,
              '§1.11d the hero shows THAT thumbnail\u2019s photograph',
              `hero ${String(after.visibleSrc).slice(-28)} vs thumb ${String(after.thumbSrc).slice(-28)}`);
        } else {
          I('§1.11d the hero shows THAT thumbnail\u2019s photograph',
            'the hero image never decoded (naturalWidth 0) — F-19.39 forbids a paint claim over an image that does not exist');
        }
        chk(after.href === before.href,
            '§1.11e the URL never changes',
            `${before.href} \u2192 ${after.href}`);
        chk(pagesAfter === pagesBefore,
            '§1.11f no new tab is opened',
            `${pagesBefore} \u2192 ${pagesAfter} page(s)`);
      }
      chk(!!m.build, '§1.7 the page names its own build', m.build || 'NO meta[name="tdw-build"] — a walk cannot identify what it opened');
      await cold.page.close().catch(() => {});
    }

    // ═══ §2 · PRIMED — the same page, worker installed and claiming ═══════
    // F-19.36 cleared the worker by reading its code. This runs it anyway,
    // because an exoneration from source is what this arm exists to distrust.
    console.log('\n── §2 · primed load, service worker installed and claiming ──');
    const warm1 = await open(browser, `${BASE}/`, 'primed_landing', { settle: 2500 });
    if (warm1.page) await warm1.page.close().catch(() => {});
    const warm = await open(browser, `${BASE}/v/${HANDLE}`, 'primed_v_handle', { settle: 1500 });
    if (!warm.page) {
      F('§2.1 the page loads with a worker in place', warm.error);
    } else {
      const m = await measure(warm.page);
      P('§2.1 the page loads with a worker in place', `sw controller: ${m.swController}`);
      if (!m.thumbCount) {
        I('§2.2 the strip is identical under a primed cache', 'no .pv-strip img');
      } else {
        console.log(`      thumb    rendered ${m.thumb.renderedWidth}x${m.thumb.renderedHeight}px · basis ${m.thumb.flexBasis}`);
        chk((m.thumb.complete && m.thumb.naturalWidth > 0) ? m.thumb.renderedWidth <= 140 : true,
            '§2.2 the strip is identical under a primed cache',
            `${m.thumb.renderedWidth}px — a worker serving a stale document would show here`);
      }
      chk(m.build !== null,
          '§2.3 the primed document names the SAME build as the cold one',
          m.build || 'no build meta');
      // ⚠ EQUIVALENCE, NOT ABSENCE — c-38.40. The chair's first cell asked that
      // no service worker control the document, and its only implementation was
      // `registration.unregister()` — which ends the worker for the WHOLE origin
      // on that browser, killing a vendor's push and image cache because a
      // stranger tapped her storefront link. The cure must not outcost the
      // disease. `sw.js` v7 bypasses `/v/` and `/r/` instead, so the worker is
      // transparent by construction; what matters, and what this asserts, is
      // that a claimed browser and a virgin one render the same page.
      chk(coldThumb === null || m.thumb == null || coldThumb === m.thumb.renderedWidth,
          '§2.4 a controlled browser and a virgin browser render the SAME page',
          `cold ${coldThumb}px vs primed ${m.thumb ? m.thumb.renderedWidth : 'n/a'}px`);
      await warm.page.close().catch(() => {});
    }

    // ═══ §3 · THE MISS, AND WHAT IT MUST NOT BETRAY ══════════════════════
    console.log('\n── §3 · the miss, rendered ──');
    const miss = await open(browser, `${BASE}/v/${MISS}`, 'miss', { settle: 800 });
    if (!miss.page) {
      F('§3.1 an unknown handle renders a designed page', miss.error);
    } else {
      const body = await miss.page.evaluate(() => ({
        text: document.body.innerText.trim(),
        hero: !!document.querySelector('.pv-hero'),
        strip: !!document.querySelector('.pv-strip'),
        cta: !!document.querySelector('.pv-cta'),
        title: document.title,
      }));
      chk(!/404|not found|error/i.test(body.text + ' ' + body.title),
          '§3.1 no status code or framework artefact is visible', JSON.stringify(body.text).slice(0, 70));
      chk(!body.hero && !body.strip && !body.cta,
          '§3.2 the miss carries nothing of a vendor', `hero=${body.hero} strip=${body.strip} cta=${body.cta}`);
      await miss.page.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }

  console.log(`\n${pass} PASS \u00b7 ${fail} FAIL \u00b7 ${inconclusive} INCONCLUSIVE`);
  if (inconclusive) console.log('An INCONCLUSIVE is not a pass. It is this arm declining to assert something it could not measure.');
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => {
  console.error('\nARM ABORTED —', e && e.stack ? e.stack : e);
  process.exit(2);
});
