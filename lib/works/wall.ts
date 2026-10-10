// lib/works/wall.ts · CE-47 · LAND-1 package 2 · THE WALL, ONE HOME.
//
// The tilted, drifting wall of the vendor's own app screens, as tdw.works draws it. Two pages read it:
//   · tdw.works (app/works/page.tsx), drawn on the server per request;
//   · the vendor sign-in, sign-up and PIN screens on thedreamwedding.in (app/works/WorksBackdrop.tsx), drawn in the
//     browser after the first paint.
// Both draw from the same scenes (buildScenes) through the same columns (columnHtml), so a scene added to
// lib/works/scenes.ts shows on both without a second edit.
import { getImageProps } from 'next/image';
import { buildScenes, columnHtml, shuffled, LOOK_PHOTOS, type Scene } from './scenes';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** One look tile's photograph, as markup: next/image's own props (optimised, sized, lazy), written into the scene string. */
export function lookImg(src: string): string {
  const { props } = getImageProps({ src, alt: '', width: 640, height: 800, quality: 60, sizes: '(max-width: 860px) 140px, 240px' });
  return '<img alt="" src="' + esc(String(props.src)) + '" srcset="' + esc(String(props.srcSet || '')) + '" sizes="' + esc(String(props.sizes || ''))
    + '" width="640" height="800" loading="lazy" decoding="async" onerror="this.remove()">';
}

/** The two storefront photographs, as the scenes take them. */
export function worksLooks(): [string, string] {
  return [lookImg(LOOK_PHOTOS[0]), lookImg(LOOK_PHOTOS[1])];
}

/** The wall: six columns, each its own random order of every scene (a phone shows four, works.css). */
export function wallHtml(scenes: Scene[], cols = 6, rnd: () => number = Math.random): string {
  const n = scenes.length;
  return Array.from({ length: cols }, (_, c) => columnHtml(scenes, shuffled(Array.from({ length: n }, (_, i) => i), rnd), c)).join('');
}

/** The whole wall for a page that has no scenes of its own yet (the sign-in screens). */
export function freshWall(): string {
  return wallHtml(buildScenes(worksLooks()));
}
