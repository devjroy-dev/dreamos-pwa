// lib/site/motion.ts · WEB-5 · each style's own motion hooks, ported from its STYLE object (after, scroll, solidAt).
// Browser-only; imported by runtime.tsx. Gallery: tools/site_port/gallery.html :154-162, line for line, with the
// element lookups guarded (a section she hides is not in the page).
type Hook = { scroll?: (y: number, o: { RM: boolean }) => void; solidAt?: () => number; after?: (o: { RM: boolean }) => (() => void) | void; fit?: () => void; fitHeader?: () => void };
const $ = (s: string) => document.querySelector(s) as HTMLElement | null;
const $$ = (s: string) => [...document.querySelectorAll(s)] as HTMLElement[];
const byId = (id: string) => document.getElementById(id);

function gallery(): Hook {
  return {
    scroll(_y, { RM }) {
      if (RM) return;
      const en = byId('enter');
      if (en) { const r = en.getBoundingClientRect(); const tot = r.height - innerHeight; const p = Math.max(0, Math.min(1, -r.top / tot));
        const big = byId('big') as HTMLElement, f = byId('bigf') as HTMLElement, fr = byId('bigh') as HTMLElement;
        if (big && f && fr) { const bw = fr.offsetWidth, bh = fr.offsetHeight; const s = Math.max(innerWidth / bw, innerHeight / bh) * 1.18;
          const w0 = Math.min(1, p / 0.12); const e = Math.max(0, Math.min(1, (p - 0.12) / 0.58)); const ee = e * e * (3 - 2 * e);   /* words leave in the first 12%, the frame grows only after */
          const cy = innerHeight / 2 - (big.offsetTop + big.offsetHeight / 2); big.style.transform = `translate3d(0,${cy * ee}px,0) scale(${1 + (s - 1) * ee})`;
          f.style.padding = 7 * (1 - ee) + '%'; f.style.borderWidth = 3 * (1 - ee) + 'px';
          const hd = byId('ehead'), ft = byId('efoot');
          if (hd && ft) { hd.style.opacity = String(1 - w0); hd.style.transform = `translate3d(0,${-40 * w0}px,0)`; ft.style.opacity = String(1 - w0); ft.style.transform = `translate3d(0,${40 * w0}px,0)`; hd.style.visibility = ft.style.visibility = w0 >= 1 ? 'hidden' : 'visible'; }
          const o = byId('over'); if (o) { const op = Math.max(0, Math.min(1, (p - 0.72) / 0.2)); o.style.opacity = String(op); o.style.pointerEvents = op > 0.5 ? 'auto' : 'none'; } } }
      const sd = byId('side');
      if (sd) { const r = sd.getBoundingClientRect(); const tot = r.height - innerHeight; const p = Math.max(0, Math.min(1, -r.top / tot)); const tr = byId('track');
        if (tr) { const max = tr.scrollWidth - innerWidth + 40; tr.style.transform = `translate3d(${-p * max}px,0,0)`; }
        const n = (byId('track')?.children.length || 4);
        byId('cbar')?.style.setProperty('--p', p.toFixed(3)); const cn = byId('cn'); if (cn) cn.textContent = String(1 + Math.min(n - 1, Math.floor(p * n * 0.999))).padStart(2, '0'); }
    },
    solidAt() { const en = byId('enter'); return en ? en.offsetHeight - 80 : 400; },
  };
}

/** Couture: tools/site_port/couture.html :576-603 (fit), :596-614 (the cover story), :616-634 (reveal with peek,
 *  scroll: header, band, roll, rail, copy), :711 (swipe). The motion level is html.m-<level> here. */
function couture(): Hook {
  const H = document.documentElement; const motion = H.classList.contains('m-calm') ? 'calm' : H.classList.contains('m-cinema') ? 'cinema' : 'lively';
  let cur = 0; let timer: ReturnType<typeof setTimeout> | undefined; const timers: ReturnType<typeof setTimeout>[] = [];
  const lines = (t: string) => { const w = t.split(' '); const h = Math.ceil(w.length / 2); const L = w.length > 3 ? [w.slice(0, h).join(' '), w.slice(h).join(' ')] : [t];
    return L.map((l, i) => { const o = document.createElement('span'); o.className = 'ln'; const n = document.createElement('span'); n.style.transitionDelay = (0.08 + i * 0.09).toFixed(2) + 's'; n.textContent = l; o.appendChild(n); return o; }); };
  const fit = () => {
    const big = $('#bigwm'); if (big && big.parentElement) { big.style.fontSize = ''; const box = big.parentElement.clientWidth - 2 * parseFloat(getComputedStyle(big.parentElement).paddingLeft);
      let b = parseFloat(getComputedStyle(big).fontSize); const ls = big.style.letterSpacing; big.style.transition = 'none'; big.style.letterSpacing = '.01em'; big.style.display = 'inline-block';
      let g = 0; while (big.getBoundingClientRect().width < box - 4 && b < 400 && g++ < 400) { b += 1; big.style.fontSize = b + 'px'; }
      while (big.getBoundingClientRect().width > box && b > 18) { b -= 1; big.style.fontSize = b + 'px'; } big.style.letterSpacing = ls; big.style.display = ''; void big.offsetWidth; big.style.transition = '';
      if (big.scrollWidth > box) big.style.whiteSpace = 'normal'; }
    $$('.h1').forEach((h) => { h.style.fontSize = ''; let f = parseFloat(getComputedStyle(h).fontSize); const bx = (h.parentElement as HTMLElement).clientWidth; const probe = [...h.querySelectorAll('.ln>span')] as HTMLElement[]; let g = 0;
      while (probe.some((p) => p.scrollWidth > bx) && f > 26 && g++ < 60) { f -= 1; h.style.fontSize = f + 'px'; } });
  };
  const fitHeader = () => { const hd = $('#hd'), wm = $('#wmFull'); if (!hd || !wm || !wm.parentElement) return; hd.classList.remove('use-mono'); wm.parentElement.style.fontSize = '';
    const room = () => { const l = (hd.querySelector('.l') as HTMLElement).getBoundingClientRect(), r = (hd.querySelector('.r') as HTMLElement).getBoundingClientRect(); return innerWidth - 2 * Math.max(l.width, r.width) - 2 * parseFloat(getComputedStyle(hd).paddingLeft) - 20; };
    let fs = parseFloat(getComputedStyle(wm.parentElement).fontSize);
    while (wm.getBoundingClientRect().width > room() && fs > 12) { fs -= 0.5; wm.parentElement.style.fontSize = fs + 'px'; }
    if (wm.getBoundingClientRect().width > room()) { hd.classList.add('use-mono'); wm.parentElement.style.fontSize = ''; } };
  const catBar = () => { const a = $('#cats a.on'), bar = $('#catBar'); if (!a || !bar) return; bar.style.left = a.offsetLeft + 'px'; bar.style.width = a.offsetWidth + 'px'; };
  const setCover = (i: number, first: boolean, RM: boolean) => {
    const slides = $$('.slide'), segs = $$('#segs button'), copy = $('#copy'), n = slides.length; if (!n || !copy) return;
    i = (i + n) % n; const prev = cur; cur = i; const dwell = motion === 'calm' ? 8 : motion === 'cinema' ? 7.5 : 6.5;
    segs.forEach((s, j) => { s.classList.remove('run'); s.classList.toggle('done', j < i); void s.offsetWidth; });
    if (!RM && segs[i]) { segs[i].style.setProperty('--dwell', dwell + 's'); segs[i].classList.add('run'); }
    const sl = slides[i];
    const swapText = () => { const k = $('#kick'), h1 = $('#h1'), ct = $('#ctaT'); if (k) k.textContent = sl.dataset.kick || ''; if (h1 && sl.dataset.h) h1.replaceChildren(...lines(sl.dataset.h)); if (ct && sl.dataset.cta) ct.textContent = sl.dataset.cta; fit(); requestAnimationFrame(() => requestAnimationFrame(() => copy.classList.add('in'))); };
    if (first || RM) { slides.forEach((s, j) => { s.className = 'slide' + (j === i ? ' on' : ''); }); if (!RM) slides[i].classList.add('drift'); if (!first) swapText(); }
    else if (prev !== i) {
      copy.classList.remove('in'); copy.querySelectorAll('.ln>span,.kick>span,.btn').forEach((e) => ((e as HTMLElement).style.animation = 'none'));   // the first-paint keyframes give way to the prototype's transitions
      slides.forEach((s, j) => { s.classList.remove('enter', 'leave', 'drift'); if (j !== i && j !== prev) s.classList.remove('on'); });
      slides[prev].classList.add('leave');
      if (motion === 'calm') { sl.style.clipPath = 'inset(0)'; sl.style.opacity = '0'; sl.classList.add('on'); sl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, easing: 'ease', fill: 'forwards' }); }
      else { sl.style.clipPath = ''; sl.style.opacity = ''; sl.classList.add('enter'); }
      timers.push(setTimeout(swapText, 420 * (motion === 'cinema' ? 1.4 : 1)));
      timers.push(setTimeout(() => { slides[prev].classList.remove('on', 'leave'); sl.classList.remove('enter'); sl.classList.add('on', 'drift'); }, 1300 * (motion === 'cinema' ? 1.45 : 1)));
    }
    clearTimeout(timer); if (!RM && n > 1) timer = setTimeout(() => setCover(cur + 1, false, RM), dwell * 1000);
  };
  const railScroll = () => { const r = $('#rail'); const th = $('#thumb'); if (!r) return; const max = r.scrollWidth - r.clientWidth, p = max ? r.scrollLeft / max : 0; if (th) th.style.transform = `translateX(${p * 300}%)`;
    const cards = [...r.children] as HTMLElement[]; let best = 0, bd = 1e9; cards.forEach((c, i) => { const d = Math.abs(c.getBoundingClientRect().left - r.getBoundingClientRect().left); if (d < bd) { bd = d; best = i; } });
    const rn = $('#railN'), rt = $('#railT'); if (rn) rn.textContent = String(best + 1).padStart(2, '0'); if (rt) rt.textContent = String(cards.length).padStart(2, '0'); };
  return {
    fit, fitHeader,
    after({ RM }) {
      setCover(0, true, RM); catBar();
      const segs = $$('#segs button'); const onSeg = segs.map((b, i) => { const f = () => setCover(i, false, RM); b.addEventListener('click', f); return () => b.removeEventListener('click', f); });
      const cats = $$('#cats a'); const onCat = cats.map((a) => { const f = () => { cats.forEach((x) => x.classList.remove('on')); a.classList.add('on'); catBar(); }; a.addEventListener('click', f); return () => a.removeEventListener('click', f); });
      const rail = $('#rail'); rail?.addEventListener('scroll', railScroll, { passive: true });
      // cards reveal with a later peek at their second photograph (couture.html :620)
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
        if (motion !== 'calm' && !RM) timers.push(setTimeout(() => { e.target.classList.add('peek'); timers.push(setTimeout(() => e.target.classList.remove('peek'), 1600)); }, 1500 + Math.random() * 900)); }), { rootMargin: '0px 0px -10% 0px' });
      $$('.card').forEach((el) => (RM ? el.classList.add('in') : io.observe(el)));
      const cv = $('#cover'); let sx: number | null = null;
      const ts = (e: TouchEvent) => { sx = e.touches[0].clientX; }; const te = (e: TouchEvent) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) setCover(cur + (dx < 0 ? 1 : -1), false, RM); sx = null; };
      cv?.addEventListener('touchstart', ts, { passive: true }); cv?.addEventListener('touchend', te);
      addEventListener('resize', catBar);
      // WEB-8 (MERGED): her typeface can arrive after the first measure; measure the line under the category again when it does
      if (document.fonts) { document.fonts.ready.then(catBar); document.fonts.addEventListener?.('loadingdone', catBar); }
      return () => { clearTimeout(timer); timers.forEach(clearTimeout); onSeg.forEach((f) => f()); onCat.forEach((f) => f()); rail?.removeEventListener('scroll', railScroll); io.disconnect(); cv?.removeEventListener('touchstart', ts); cv?.removeEventListener('touchend', te); removeEventListener('resize', catBar); };
    },
    scroll(y, { RM }) {
      if (RM || motion === 'calm') return; const k = motion === 'cinema' ? 1.4 : 1;
      const band = $('#band'), bi = $('#bandImg'); if (band && bi) { const b = band.getBoundingClientRect(); if (b.bottom > 0 && b.top < innerHeight) { const p = (b.top + b.height) / (innerHeight + b.height); bi.style.transform = `translate3d(0,${(p - 0.5) * -18 * k}%,0) scale(${1 + 0.04 * k})`; } }
      const roll = $('#roll'); if (roll && H.dataset.roll !== 'off') { const r = roll.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) roll.style.transform = `translate3d(${-(innerHeight - r.top) * 0.55 * k}px,0,0)`; }
      const cv = $('#cover'), cp = $('#copy'); if (cv && cp) { const ch = cv.offsetHeight; if (y < ch) { cp.style.transform = `translate3d(0,${y * 0.25}px,0)`; cp.style.opacity = String(1 - y / (ch * 0.8)); } }
    },
    solidAt() { const cv = $('#cover'); return cv ? cv.offsetHeight - 90 : 400; },
  };
}

const level = () => { const H = document.documentElement; return H.classList.contains('calm') ? 'calm' : H.classList.contains('cinema') ? 'cinema' : 'lively'; };
const esc = (t: string) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);

/** Noir: tools/site_port/noir.html :129-138 (the cover story in spotlight, the room, the stack's lift). */
function noir(): Hook {
  let t: ReturnType<typeof setTimeout> | undefined; const timers: ReturnType<typeof setTimeout>[] = []; let raf = 0;
  return {
    after({ RM }) {
      const slides = $$('.slide'), dots = $$('#dots3 button'), cov = $('#cover'); if (!cov || !slides.length) return;
      let cur = 0; const desk = matchMedia('(min-width:1024px)').matches; const spots = [['50%', '34%'], ['46%', '44%'], ['52%', '38%']];
      const title = (h: string) => { let j = 0; return h.split(' ').map((wd) => `<span class="wd">${[...wd].map((ch) => `<span class="c" style="--i:${j++}">${esc(ch)}</span>`).join('')}</span>`).join(' '); };
      const show = (i: number) => { const s = slides[i]; const ck = $('#ck'), cb = $('#cb'), tt = $('#ttl'); if (ck) ck.textContent = s.dataset.kick || ''; if (cb) cb.textContent = s.dataset.cta || ''; if (tt) tt.innerHTML = title(s.dataset.h || '');
        cov.querySelectorAll('.cc .caps,.ttl .c,.rule,.cc .bg').forEach((e) => ((e as HTMLElement).style.animation = 'none')); cov.classList.remove('go'); void cov.offsetWidth; requestAnimationFrame(() => cov.classList.add('go')); };
      slides.forEach((s, j) => { const im = s.querySelector('img') as HTMLElement | null; if (im) { im.style.setProperty('--x', spots[j % 3][0]); im.style.setProperty('--y', spots[j % 3][1]); } });
      const go = (i: number) => { clearTimeout(t); const n = slides.length; i = (i + n) % n; const prev = cur; cur = i;
        if (desk || RM) { slides.forEach((s, j) => { s.classList.add('on'); timers.push(setTimeout(() => s.classList.add('lit'), 60 + j * 600)); }); return; }
        const enter = () => { slides.forEach((s, j) => { s.classList.toggle('on', j === i); s.classList.remove('out', 'lit'); }); requestAnimationFrame(() => requestAnimationFrame(() => slides[i].classList.add('lit'))); show(i);
          dots.forEach((d, j) => { d.classList.remove('run'); d.classList.toggle('done', j < i); void d.offsetWidth; }); const dw = level() === 'calm' ? 9 : 8; if (dots[i]) { dots[i].style.setProperty('--dw', dw + 's'); dots[i].classList.add('run'); } if (n > 1) t = setTimeout(() => go(cur + 1), dw * 1000); };
        if (prev !== i) { slides[prev].classList.add('out'); cov.classList.remove('go'); timers.push(setTimeout(enter, 1250)); } else { const dw = level() === 'calm' ? 9 : 8; dots.forEach((d, j) => d.classList.toggle('done', j < i)); if (dots[i]) { dots[i].style.setProperty('--dw', dw + 's'); dots[i].classList.add('run'); } if (n > 1) t = setTimeout(() => go(cur + 1), dw * 1000); } };
      dots.forEach((d, i) => d.addEventListener('click', () => go(i))); go(0);
      let sx: number | null = null; cov.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true }); cov.addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
      const room = $('#room'); if (room) { let idle = true, ph = 0; const set = (x: number, y: number) => { room.style.setProperty('--mx', x + '%'); room.style.setProperty('--my', y + '%'); };
        let it: ReturnType<typeof setTimeout> | undefined; const mv = (e: PointerEvent | TouchEvent) => { const r = room.getBoundingClientRect(); const p = 'touches' in e ? e.touches[0] : e; set(+((p.clientX - r.left) / r.width * 100).toFixed(1), +((p.clientY - r.top) / r.height * 100).toFixed(1)); idle = false; clearTimeout(it); it = setTimeout(() => (idle = true), 2500); };
        room.addEventListener('pointermove', mv as EventListener); room.addEventListener('touchmove', mv as EventListener, { passive: true });
        if (!RM) { const drift = () => { if (idle) { ph += 0.006 * (level() === 'cinema' ? 0.7 : 1); set(50 + Math.sin(ph) * 28, 45 + Math.sin(ph * 1.7) * 20); } raf = requestAnimationFrame(drift); }; drift(); } else set(50, 45); }
      return () => { clearTimeout(t); timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
    },
    scroll(_y, { RM }) { const vh = innerHeight; $$('.card').forEach((c) => { const r = c.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return; const mid = (r.top + r.height / 2 - vh / 2) / (vh * 0.75); const e = RM ? 1 : Math.max(0, 1 - Math.abs(mid) ** 1.6); c.style.setProperty('--e', e.toFixed(3)); }); },
    solidAt() { return innerHeight * 0.7; },
  };
}
/** Heritage: tools/site_port/heritage.html :137-143 (the cover through the lattice, the lattices opening, the craft band). */
function heritage(): Hook {
  let t: ReturnType<typeof setTimeout> | undefined; const timers: ReturnType<typeof setTimeout>[] = []; let io: IntersectionObserver | undefined;
  return {
    after({ RM }) {
      const cov = $('#cover'), sls = $$('#sls .sl'), pips = $$('#pips button'), jm = $('#jmain'); let cur = 0;
      const lines = (tx: string) => { const w = tx.split(' '); if (w.length < 4) return `<span class="ln"><span>${esc(tx)}</span></span>`; const h = Math.ceil(w.length / 2); return [w.slice(0, h).join(' '), w.slice(h).join(' ')].map((l, i) => `<span class="ln"><span style="transition-delay:${(0.08 + i * 0.1).toFixed(2)}s">${esc(l)}</span></span>`).join(''); };
      const text = (i: number) => { const s = sls[i]; const ck = $('#ck'), cb = $('#cb'), ct = $('#ct'); if (ck) ck.textContent = s.dataset.kick || ''; if (cb) cb.textContent = s.dataset.cta || ''; if (ct) { ct.innerHTML = lines(s.dataset.h || ''); ct.classList.remove('in'); void ct.offsetWidth; requestAnimationFrame(() => ct.classList.add('in')); } };
      const go = (i: number) => { clearTimeout(t); const n = sls.length; if (!n || !jm) return; i = (i + n) % n;
        jm.style.animation = 'none'; jm.classList.remove('open'); jm.classList.add('shut');
        timers.push(setTimeout(() => { sls.forEach((s, j) => s.classList.toggle('on', j === i)); text(i); jm.classList.remove('shut'); requestAnimationFrame(() => requestAnimationFrame(() => jm.classList.add('open'))); }, 950));
        cur = i; pips.forEach((p, j) => p.classList.toggle('on', j === i)); if (!RM && n > 1) t = setTimeout(() => go(cur + 1), (level() === 'calm' ? 9 : 7.5) * 1000); };
      pips.forEach((p, i) => p.addEventListener('click', () => go(i)));
      if (!RM && sls.length > 1) t = setTimeout(() => go(1), (level() === 'calm' ? 9 : 7.5) * 1000);
      void cov;
      io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; const j = (e.target.querySelector(':scope > .jaali') || e.target.querySelector('.jaali')) as HTMLElement | null; if (j) timers.push(setTimeout(() => j.classList.add('open'), 150)); e.target.querySelectorAll('.orn').forEach((o) => o.classList.add('in')); io?.unobserve(e.target); }), { rootMargin: '0px 0px -15% 0px' });
      $$('.card .ph,#craft,#storyPh,.sh').forEach((el) => { if (RM) { const j = el.querySelector('.jaali'); if (j) j.classList.add('open'); } else io?.observe(el); });
      return () => { clearTimeout(t); timers.forEach(clearTimeout); io?.disconnect(); };
    },
    scroll(_y, { RM }) { if (RM || level() === 'calm') return; const c = $('#craft'), im = $('#craftImg'); if (!c || !im) return; const r = c.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) { const p = (r.top + r.height) / (innerHeight + r.height); im.style.transform = `translate3d(0,${(p - 0.5) * -14 * (level() === 'cinema' ? 1.4 : 1)}%,0)`; } },
    solidAt() { return 40; },
  };
}
/** Aurora: tools/site_port/aurora.html :125-131 (the floating photographs, the pinned band). */
function aurora(): Hook {
  let px = 0, py = 0, raf = 0; let t: ReturnType<typeof setTimeout> | undefined;
  return {
    after({ RM }) {
      if (RM) return;
      addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; }, { passive: true });
      const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: unknown } }).DeviceOrientationEvent;
      const needsAsk = !!DOE && typeof DOE.requestPermission === 'function';   /* iPhones ask the visitor; we never ask, so no tilt there */
      if (!needsAsk) addEventListener('deviceorientation', (e) => { if (e.gamma == null || e.beta == null) return; px = Math.max(-0.5, Math.min(0.5, e.gamma / 60)); py = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60)); }, { passive: true });
      addEventListener('touchmove', (e) => { const tt = e.touches[0]; px = (tt.clientX / innerWidth - 0.5) * 0.6; py = (tt.clientY / innerHeight - 0.5) * 0.6; }, { passive: true });
      const loop = () => { const k = level() === 'calm' ? 0 : level() === 'cinema' ? 1.5 : 1; const x = px * k, y = py * k; const sy = scrollY;
        $$('.fl').forEach((f, i) => { const d = [1, 1.8, 2.6][i] || 1; f.style.animation = 'none'; f.style.opacity = '1'; f.style.transform = `translate3d(${x * d * 14}px,${y * d * 10 - sy * (0.05 * d)}px,0) rotateX(${-y * 4}deg) rotateY(${x * 6}deg)`; }); raf = requestAnimationFrame(loop); };
      t = setTimeout(loop, 1700);
      return () => { clearTimeout(t); cancelAnimationFrame(raf); };
    },
    scroll(_y, { RM }) { const pin = $('#pin'); if (!pin || RM) return; const r = pin.getBoundingClientRect(); const tot = r.height - innerHeight; const p = Math.max(0, Math.min(1, -r.top / tot));
      const spans = $$('#psay span'); const n = spans.length; if (!n) return; const step = Math.min(n - 1, Math.floor(p * n * 0.999));
      spans.forEach((s, i) => s.classList.toggle('lit', i <= step)); $$('#pimgs .ph').forEach((ph, i) => ph.classList.toggle('on', i === step));
      $$('#pstep i b').forEach((b, i) => b.style.setProperty('--p', Math.max(0, Math.min(1, p * n - i)).toFixed(3))); },
    solidAt() { return 1e9; },
  };
}
/** Riviera: tools/site_port/riviera.html :132-142 (the postcard deck: flick, drag, caption). */
function riviera(): Hook {
  const ROT = [-4, 3, -2, 5, -5, 2, -3, 4]; const timers: ReturnType<typeof setTimeout>[] = []; let io: IntersectionObserver | undefined;
  const top = () => { const cs = $$('.pc:not(.fly)'); return cs[cs.length - 1]; };
  const cap = () => { const tp = top(); if (!tp) return; const n = $('#dnm'), p = $('#dpr'), o = $('#dopen') as HTMLAnchorElement | null; if (n) n.textContent = tp.dataset.name || ''; if (p) p.textContent = tp.dataset.price || ''; if (o && tp.dataset.href) o.href = tp.dataset.href; };
  const flick = (dir: number) => { const tp = top(); if (!tp) return; tp.style.setProperty('--fx', (dir < 0 ? -150 : 150) + '%'); tp.style.setProperty('--fr', (dir < 0 ? -26 : 26) + 'deg'); tp.classList.add('fly');
    timers.push(setTimeout(() => { const deck = $('#deck'); if (!deck) return; tp.classList.remove('fly'); tp.style.transition = 'none'; tp.style.zIndex = '0'; deck.prepend(tp); [...deck.children].forEach((c, i) => ((c as HTMLElement).style.zIndex = String(i))); void tp.offsetWidth; tp.style.transition = ''; }, 650));
    timers.push(setTimeout(cap, 120)); };
  return {
    after({ RM }) {
      cap(); const nx = $('#dnext'); if (nx) nx.addEventListener('click', () => flick(1));
      const deck = $('#deck'); if (!deck) return; let sx: number | null = null, sy = 0; let drag: HTMLElement | null = null;
      deck.addEventListener('pointerdown', (e) => { drag = top() || null; if (!drag) return; sx = e.clientX; sy = e.clientY; drag.style.transition = 'none'; deck.setPointerCapture(e.pointerId); });
      deck.addEventListener('pointermove', (e) => { if (!drag || sx == null) return; const dx = e.clientX - sx; drag.style.setProperty('--tx', dx + 'px'); drag.style.setProperty('--ty', (e.clientY - sy) * 0.3 + 'px'); drag.style.setProperty('--rot', dx / 14 + 'deg'); });
      deck.addEventListener('pointerup', (e) => { if (!drag || sx == null) return; const dx = e.clientX - sx; drag.style.transition = ''; const d = drag; drag = null; sx = null; d.style.removeProperty('--tx'); d.style.removeProperty('--ty');
        const k = +(d.dataset.k || 0); if (Math.abs(dx) > 70) { flick(dx < 0 ? -1 : 1); timers.push(setTimeout(() => d.style.setProperty('--rot', ROT[k % 8] + 'deg'), 700)); } else d.style.setProperty('--rot', ROT[k % 8] + 'deg'); });
      if (!RM && level() !== 'calm') { let shown = false; io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !shown) { shown = true; timers.push(setTimeout(() => flick(1), 900)); } }), { threshold: 0.6 }); io.observe(deck); }
      return () => { timers.forEach(clearTimeout); io?.disconnect(); };
    },
    solidAt() { return innerHeight * 0.75; },
  };
}
export const MOTION: Record<string, () => Hook> = { gallery, couture, noir, heritage, aurora, riviera };
