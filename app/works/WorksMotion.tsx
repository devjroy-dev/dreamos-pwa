'use client';
// app/works/WorksMotion.tsx · CE-47 · LAND-1 · the chair's script, ported line for line, taking over from the scene the
// server drew. It draws nothing itself: it moves the page app/works/page.tsx rendered.
//
//   · one scene every 3000 ms; random, no repeat until all 18 have shown, never the same scene twice in a row (draw());
//   · a tap, Enter or Space on the screen pauses and plays; a hidden tab stops the clock;
//   · "reduce motion": an instant swap, no meter (the wall and the trades line stop in works.css);
//   · About opens as an overlay on the same page: the screens pause and the wall stops while it is open (point 9),
//     Esc and Close return to the page, and the screens play again only if they were playing before.
import { useEffect } from 'react';
import { buildScenes, sheetHtml, draw, shuffled } from '@/lib/works/scenes';

const STEP = 3000;

export default function WorksMotion({ looks, first }: { looks: [string, string]; first: number }) {
  useEffect(() => {
    const S = buildScenes(looks);
    const $ = (id: string) => document.getElementById(id) as HTMLElement;
    const root = document.querySelector('.tdww') as HTMLElement;
    const slot = $('slot'), focus = $('focus'), word = $('word'), cap = $('cap'), meter = $('meter'), pausedEl = $('paused');
    const about = $('about'), openB = $('aboutOpen'), closeB = $('aboutClose');
    if (!root || !slot || !focus || !word || !cap || !meter) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const bag: number[] = [];
    let cur: number | null = first, timer: ReturnType<typeof setTimeout> | undefined, paused = false, wasPaused = false;
    const later: ReturnType<typeof setTimeout>[] = [];

    // The scene the server drew is the first draw of this visit's first bag: the rest of that bag follows it.
    bag.push(...shuffled(Array.from({ length: S.length }, (_, i) => i)).filter((i) => i !== first));

    const fit = () => {
      const k = Math.min(focus.clientWidth / 440, focus.clientHeight / 560, 1.25);
      slot.style.setProperty('--k', Math.max(k, 0.5).toFixed(3));
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(focus); else window.addEventListener('resize', fit);

    const startMeter = () => { meter.classList.remove('run'); void meter.offsetWidth; if (!paused && !reduce.matches) meter.classList.add('run'); };
    const show = (i: number) => {
      const s = S[i]; cur = i; focus.dataset.scene = s.k;   // the scene on the glass, read by b303
      const old = slot.querySelector('.sheet:not(.leave)');
      const el = document.createElement('div'); el.className = 'sheet' + (reduce.matches ? '' : ' enter');
      el.innerHTML = sheetHtml(s);
      slot.appendChild(el);
      if (old) { if (reduce.matches) old.remove(); else { old.classList.add('leave'); later.push(setTimeout(() => old.remove(), 800)); } }
      if (!reduce.matches) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('enter')));
      if (reduce.matches) word.textContent = s.w;
      else { word.classList.add('go'); later.push(setTimeout(() => { word.textContent = s.w; word.classList.remove('go'); }, 260)); }
      cap.textContent = s.cap; startMeter();
    };
    const schedule = () => { clearTimeout(timer); if (!paused && !document.hidden) timer = setTimeout(() => { show(draw(bag, S.length, cur)); schedule(); }, STEP); };
    const setPaused = (p: boolean) => {
      paused = p; pausedEl.hidden = !p; focus.setAttribute('aria-label', p ? 'Play the screens' : 'Pause the screens'); startMeter(); schedule();
    };
    const onClick = () => setPaused(!paused);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPaused(!paused); } };
    const onVis = () => { if (document.hidden) clearTimeout(timer); else { startMeter(); schedule(); } };
    focus.addEventListener('click', onClick);
    focus.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);

    // About
    const openAbout = () => {
      about.hidden = false; about.scrollTop = 0; root.classList.add('about-open');
      wasPaused = paused; if (!paused) setPaused(true); pausedEl.hidden = true; closeB.focus();
    };
    // One line beyond the chair's file: a page paused before About shows its "Paused" again after it (the file left it hidden).
    const closeAbout = () => { about.hidden = true; root.classList.remove('about-open'); if (!wasPaused) setPaused(false); else pausedEl.hidden = false; openB.focus(); };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && !about.hidden) closeAbout(); };
    openB.addEventListener('click', openAbout); closeB.addEventListener('click', closeAbout);
    document.addEventListener('keydown', onEsc);

    fit(); startMeter(); schedule();
    root.setAttribute('data-ready', '');
    return () => {
      clearTimeout(timer); later.forEach(clearTimeout);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', fit);
      focus.removeEventListener('click', onClick); focus.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis); document.removeEventListener('keydown', onEsc);
      openB.removeEventListener('click', openAbout); closeB.removeEventListener('click', closeAbout);
      root.removeAttribute('data-ready');
    };
  }, [looks, first]);
  return null;
}
