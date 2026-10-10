'use client';
// app/works/WorksBackdrop.tsx · CE-47 · LAND-1 package 2 · tdw.works's look for the vendor sign-in, sign-up and PIN
// screens on thedreamwedding.in (the founder's ruling, 10 Oct 2026).
//
// ONE HOME, NOT A COPY. The wall is tdw.works's own: the same element (WorksWall), the same markup and columns
// (lib/works/wall.ts), the same scenes (lib/works/scenes.ts), the same drift, fonts and colours (works.css, the faces
// by signinFonts.ts). A scene added for tdw.works shows here with no second edit.
//
// WHAT IT DRAWS. The wall behind; in front, one frosted-glass panel (glass.css), centred on a laptop and a sheet from
// the bottom on a phone, headed by the mark, TDW with tdw.works under it. The page's own screen goes inside the panel
// as `children`; its steps, doors and checks are the page's and do not pass through here.
//
// THE WALL IS DRAWN AFTER THE FIRST PAINT, in the browser (each visit its own random order, as tdw.works), so the
// panel never waits on it. The browser bar takes the wall's ground while this is open, and gets its own colour back
// when it closes (useWorksBar.ts).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { freshWall } from '@/lib/works/wall';
import { worksSigninFontClasses } from './signinFonts';
import { useWorksBar } from './useWorksBar';
import WorksWall from './WorksWall';
import './works.css';
import './glass.css';

export default function WorksBackdrop({ children, label = 'Sign in' }: { children: ReactNode; label?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [wall, setWall] = useState('');
  useWorksBar(root, worksSigninFontClasses);
  useEffect(() => { setWall(freshWall()); }, []);
  return (
    <div ref={root} className={'tdww tdww-signin ' + worksSigninFontClasses} data-works-signin="">
      <WorksWall html={wall} />
      <div className="wg-wrap">
        <section className="wg-panel" aria-label={label}>
          <div className="wg-mark"><b>TDW</b><span>tdw.works</span></div>
          {children}
        </section>
      </div>
    </div>
  );
}
