// lib/site/rt/runtime.ts · WEB-5 · the one engine's browser half, WITHOUT React (CE-47 ruling B).
// It never builds the page (the server did); it only attaches what the approved engine attaches
// (tools/site_port/engine.js): the header going solid, reveals, fitting, hearts, the reading-law quotes, the questions,
// the menu, the cover's upgrade, and the style's own hooks (./motion.ts). Transpiled with motion.ts into one script by
// tools/site_port/build_runtime.cjs and served once, cached for a year, after the first screen.
import { MOTION } from './motion';

type Hook = { scroll?: (y: number, o: { RM: boolean }) => void; solidAt?: () => number; after?: (o: { RM: boolean }) => (() => void) | void; fit?: () => void; fitHeader?: () => void };

export function start(style: string): () => void {
    const $ = (s: string) => document.querySelector(s) as HTMLElement | null;
    const $$ = (s: string) => [...document.querySelectorAll(s)] as HTMLElement[];
    const H = document.documentElement;
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hook: Hook = (MOTION[style] || (() => ({})))();
    const off: Array<() => void> = [];
    const on = (t: EventTarget, e: string, f: EventListener, o?: AddEventListenerOptions) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f)); };

    // THE COVER'S UPGRADE (Q3): the 480 first for everyone; once it is on screen, the srcset, unless Save-Data.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const hero = $('img[fetchpriority=high]') as HTMLImageElement | null;
    const release = () => {
      if (hero && hero.dataset.upgrade && !(conn && conn.saveData)) { hero.sizes = hero.dataset.sizes || '100vw'; hero.srcset = hero.dataset.upgrade; }
      $$('img[data-src]').forEach((i) => { const im = i as HTMLImageElement; if (im.dataset.srcset) { im.srcset = im.dataset.srcset; im.removeAttribute('data-srcset'); } im.src = im.dataset.src || ''; im.removeAttribute('data-src'); });
    };
    if (!hero || hero.complete) release(); else { hero.addEventListener('load', release, { once: true }); hero.addEventListener('error', release, { once: true }); }

    // fitting (engine.js fitHeader, fitAll): nothing leaves its box; a long name falls back to the monogram.
    const fitHeader = () => { const hd = $('#hd'); const wm = hd?.querySelector('.wmt') as HTMLElement | null; if (!hd || !wm) return;
      hd.classList.remove('use-mono'); H.classList.remove('use-mono'); wm.style.fontSize = ''; wm.style.width = 'max-content'; wm.style.flex = 'none';
      const cs = getComputedStyle(hd); const lw = (hd.querySelector('.l') as HTMLElement).getBoundingClientRect().width, rw = (hd.querySelector('.r') as HTMLElement).getBoundingClientRect().width;
      const room = hd.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2 * Math.max(lw, rw) - 24; let f = parseFloat(getComputedStyle(wm).fontSize); const min = 11;
      while (wm.getBoundingClientRect().width > room && f > min) { f -= 0.5; wm.style.fontSize = f + 'px'; }
      if (wm.getBoundingClientRect().width > room) { hd.classList.add('use-mono'); H.classList.add('use-mono'); } };
    const fitAll = () => { (hook.fitHeader || fitHeader)(); hook.fit?.();
      $$('[data-fill]').forEach((el) => { const p = el.parentElement as HTMLElement; const box = p.clientWidth - parseFloat(getComputedStyle(p).paddingLeft) - parseFloat(getComputedStyle(p).paddingRight);
        el.style.transition = 'none'; el.style.display = 'inline-block'; el.style.whiteSpace = 'nowrap'; let f = 12; el.style.fontSize = f + 'px'; let g = 0;
        while (el.getBoundingClientRect().width < box - 4 && f < (+(el.dataset.fill || 260)) && g++ < 600) { f += 1; el.style.fontSize = f + 'px'; }
        while (el.getBoundingClientRect().width > box && f > 14) { f -= 1; el.style.fontSize = f + 'px'; } el.style.display = 'block'; void el.offsetWidth; el.style.transition = ''; });
      $$('.fitlines').forEach((h) => { h.style.fontSize = ''; let f = parseFloat(getComputedStyle(h).fontSize); const bx = h.getBoundingClientRect().width; let g = 0;
        while ([...h.querySelectorAll('.ln>span')].some((p) => p.getBoundingClientRect().width > bx + 1) && f > 22 && g++ < 80) { f -= 1; h.style.fontSize = f + 'px'; } });
      const w = $('#qwrap'); if (w) { let h = 0; $$('.q').forEach((q) => (h = Math.max(h, q.offsetHeight))); w.style.height = h + 'px'; } };

    // reveals (engine.js observe)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    $$('.rv').forEach((el) => (RM ? el.classList.add('in') : io.observe(el)));

    // hearts: a count for this visit only (no cookie, no storage); each save or unsave told to WEB-4's heart door.
    const liked = new Set<string>();
    $$('[data-like]').forEach((b) => on(b, 'click', (e) => { e.preventDefault(); e.stopPropagation(); const i = b.dataset.like as string; const now = !liked.has(i); now ? liked.add(i) : liked.delete(i);
      $$(`[data-like="${i}"]`).forEach((x) => { x.classList.toggle('on', now); x.classList.remove('pop'); void x.offsetWidth; if (now) x.classList.add('pop'); });
      const sl = b.dataset.slug; if (sl && H.dataset.code) { try { navigator.sendBeacon?.('/site-beacon', new Blob([JSON.stringify({ kind: 'heart', code: H.dataset.code, look_slug: sl, on: now })], { type: 'text/plain' })); } catch { /* never breaks the page */ } }
      $$('[data-hc]').forEach((x) => (x.textContent = String(liked.size))); $$('[data-hh]').forEach((h) => { h.classList.toggle('has', liked.size > 0); h.classList.remove('bump'); void h.offsetWidth; h.classList.add('bump'); }); }));
    $$('[data-hh]').forEach((h) => on(h, 'click', () => { const l = document.getElementById('looks'); if (l) l.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }));

    // quotes: fully readable before any change; only while on screen; stops for good on Next or Previous.
    let rot = 0, qT: ReturnType<typeof setTimeout> | undefined, qSeen = false, qHeld = false;
    const qs = () => $$('.q');
    const qDwell = () => { const n = qs()[rot]?.querySelectorAll('.w').length ?? 20; return 1200 + n * 32 + Math.max(6000, n * 380); };
    const qArm = () => { clearTimeout(qT); if (RM || !qSeen || qHeld || qs().length < 2) return; qT = setTimeout(() => nextQ(1, true), qDwell()); };
    const nextQ = (d: number, auto?: boolean) => { const q = qs(); if (!q.length) return; rot = (rot + d + q.length) % q.length; q.forEach((x, i) => x.classList.toggle('on', i === rot));
      const c = $('#qCt'); if (c) c.textContent = rot + 1 + ' / ' + q.length; if (!auto) qHeld = true; qArm(); };
    const qp = $('#qPrev'), qn = $('#qNext'); if (qp) on(qp, 'click', () => nextQ(-1)); if (qn) on(qn, 'click', () => nextQ(1));
    const rv = $('#reviews'); let qio: IntersectionObserver | undefined;
    if (rv) { qio = new IntersectionObserver((es) => es.forEach((e) => { qSeen = e.isIntersecting && e.intersectionRatio > 0.5; qSeen ? qArm() : clearTimeout(qT); }), { threshold: [0, 0.5, 1] }); qio.observe(rv); }

    // a look page's photographs (engine.js :130): the counter and the dots follow the strip.
    const strip = $('#strip'); if (strip) on(strip, 'scroll', () => { const j = Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth)); const n = strip.children.length; const ct = $('#gCtr'); if (ct) ct.textContent = `${j + 1} / ${n}`; $$('#gDots i').forEach((d, x) => d.classList.toggle('on', x === j)); }, { passive: true });
    const lp = $('#lp'); const lt = $('#lpTop'); if (lp && lt) on(lp, 'scroll', () => lt.classList.toggle('solid', lp.scrollTop > innerWidth * 1.05), { passive: true });

    // questions, menu
    $$('.fq button').forEach((b) => on(b, 'click', () => b.parentElement?.classList.toggle('open')));
    const closeMenu = () => { $('#drawer')?.classList.remove('on'); H.classList.remove('menu-open'); $('#scrim')?.classList.remove('on'); };
    $$('[data-menu]').forEach((b) => on(b, 'click', () => { $('#drawer')?.classList.add('on'); $('#scrim')?.classList.add('on'); H.classList.add('menu-open'); }));
    const dx = $('#drawerX'); if (dx) on(dx, 'click', closeMenu); const sc = $('#scrim'); if (sc) on(sc, 'click', closeMenu);
    $$('#dnav a').forEach((a) => on(a, 'click', closeMenu));

    // the scroll loop (engine.js onScroll): the header goes solid, then the style's own hook. F-44.343: a shop item page
    // (data-page="shop") has its header solid from the start, at every scroll, in every style.
    let tick = false;
    const onScroll = () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; const y = scrollY; const hd = $('#hd');
      if (hd) hd.classList.toggle('solid', H.dataset.page === 'shop' || y > (hook.solidAt ? hook.solidAt() : innerHeight * 0.8)); hook.scroll?.(y, { RM }); }); };
    on(window, 'scroll', onScroll, { passive: true }); on(window, 'resize', () => { fitAll(); onScroll(); });
    fitAll(); const undoAfter = hook.after?.({ RM }); onScroll(); requestAnimationFrame(() => requestAnimationFrame(fitAll)); const t350 = setTimeout(fitAll, 350);
    if (document.fonts?.ready) document.fonts.ready.then(fitAll);
    H.classList.add('ready');
    return () => { off.forEach((f) => f()); if (typeof undoAfter === 'function') undoAfter(); io.disconnect(); qio?.disconnect(); clearTimeout(qT); clearTimeout(t350); };
}

// The site's beacons (WEB-4 cut 4): one visit per page, `ref` on the first page of a visit only, by sendBeacon.
export function beacon(code: string, page: string, look?: string) {
  try {
    const first = !sessionStorageSafe('tdw_site_v');
    const u = new URL(location.href); const body: Record<string, string> = { kind: 'visit', code, page };
    if (look) body.look_slug = look;
    if (first) { const r = document.referrer; if (r) body.ref = r.slice(0, 300); const s = u.searchParams.get('utm_source'); if (s) body.utm_source = s.slice(0, 60); }
    navigator.sendBeacon?.('/site-beacon', new Blob([JSON.stringify(body)], { type: 'text/plain' }));   // same origin: no preflight
  } catch { /* a beacon never breaks the page */ }
}
// "First page of a visit" without cookies or storage (charter: nothing stored): a same-site referrer means a later page.
function sessionStorageSafe(_k: string): boolean { try { return !!document.referrer && new URL(document.referrer).host === location.host; } catch { return false; } }
