'use client';
// app/works/useWorksBar.ts · CE-47 · LAND-1 package 2 · the browser bar, without app/layout.tsx.
//
// While a vendor sign-in, sign-up or PIN screen is open, the screen sets the browser bar's colour itself: the theme-color
// tag takes works.css's own ground (--bg on the .tdww element: #E7EAE6 light, #0E1112 dark, by the phone's setting as
// tdw.works follows it), and follows the setting if it changes while the screen is open. When the screen closes,
// every theme-color tag gets back exactly what it held before (app/layout.tsx's tag and its landing script are not
// touched; they are only borrowed for as long as the screen is open).
//
// It also marks <html> with `works-signin` for the same span, so the two pieces a page draws outside the glass panel
// (its message strip and its country list) take the same look (app/works/glass.css).
import { useLayoutEffect, type RefObject } from 'react';

export const WORKS_BAR = { light: '#E7EAE6', dark: '#0E1112' } as const;

export function useWorksBar(root: RefObject<HTMLElement | null>, fontClasses = ''): void {
  useLayoutEffect(() => {
    const html = document.documentElement;
    // The faces' variables ride on <html> too, for the two pieces drawn outside the panel (glass.css).
    const faces = fontClasses.split(' ').filter((c) => c && !html.classList.contains(c));
    html.classList.add('works-signin', ...faces);
    let metas = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
    let made: HTMLMetaElement | null = null;
    if (!metas.length) { made = document.createElement('meta'); made.name = 'theme-color'; document.head.appendChild(made); metas = [made]; }
    const before = metas.map((m) => [m, m.getAttribute('content'), m.getAttribute('media')] as const);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const paint = () => {
      const t = html.getAttribute('data-theme');
      const dark = t === 'dark' || (t !== 'light' && mq.matches);
      const read = root.current ? getComputedStyle(root.current).getPropertyValue('--bg').trim() : '';
      const colour = read || (dark ? WORKS_BAR.dark : WORKS_BAR.light);
      // One colour for whichever tag the browser reads: a tag scoped to a scheme would otherwise win over it.
      for (const m of metas) { m.setAttribute('content', colour); m.removeAttribute('media'); }
    };
    paint();
    mq.addEventListener('change', paint);
    const watch = new MutationObserver(paint);
    watch.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', paint);
      watch.disconnect();
      html.classList.remove('works-signin', ...faces);
      for (const [m, content, media] of before) {
        if (m === made) { m.remove(); continue; }
        if (content === null) m.removeAttribute('content'); else m.setAttribute('content', content);
        if (media === null) m.removeAttribute('media'); else m.setAttribute('media', media);
      }
    };
  }, [root, fontClasses]);
}
