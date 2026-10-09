// lib/public/worksHost.ts · CE-47 · LAND-1 · point 3: tdw.works is served by host, decided by one pure function so the
// bench drives every case in node (the shape of lib/public/vendorHost.ts's decide()).
//
//   tdw.works/            → rewrite to /works (the front page; the address bar keeps tdw.works)
//   tdw.works/works       → redirect to tdw.works/ (one address for the page)
//   tdw.works/brand/...   → passes (the icons the root layout links)
//   tdw.works/works/<icon>.(svg|png|ico) → passes (tdw.works's own icons, public/works; /favicon.ico is next.config.ts's)
//   tdw.works/robots.txt, /sitemap.xml → pass
//   tdw.works/<anything>  → 302 to the same path on thedreamwedding.in, where the app and its sign-in live
//   www.tdw.works/<path>  → 301 to tdw.works/<path>
//   any other host        → null (untouched; /works stays reachable on the app's own address for previews)
// `/_next/*` and `/api` never reach the middleware (its matcher), so the page's own files load on tdw.works.

export const WORKS_HOST = 'tdw.works';
const APP_BASE = 'https://thedreamwedding.in';

export type WorksDecision =
  | null
  | { kind: 'rewrite'; pathname: string }
  | { kind: 'pass' }
  | { kind: 'redirect'; url: string; status: 301 | 302 };

export function worksDecide(host: string | null | undefined, pathname: string, search = ''): WorksDecision {
  const h = String(host || '').trim().toLowerCase().replace(/:\d+$/, '');
  const p = pathname || '/';
  if (h === 'www.' + WORKS_HOST) return { kind: 'redirect', url: `https://${WORKS_HOST}${p}${search || ''}`, status: 301 };
  if (h !== WORKS_HOST) return null;
  if (p === '/') return { kind: 'rewrite', pathname: '/works' };
  if (p === '/works' || p === '/works/') return { kind: 'redirect', url: `https://${WORKS_HOST}/${search || ''}`, status: 302 };
  if (p.startsWith('/brand/') || p === '/robots.txt' || p === '/sitemap.xml') return { kind: 'pass' };
  if (/^\/works\/[a-z0-9-]+\.(svg|png|ico)$/.test(p)) return { kind: 'pass' };   // tdw.works's own icons (public/works)
  return { kind: 'redirect', url: `${APP_BASE}${p}${search || ''}`, status: 302 };
}
