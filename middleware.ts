// middleware.ts
// Subdomain routing for TDW demo subdomains.
//
// demo.thedreamwedding.in/vendor/[handle]  → /demo/vendor/[handle]/...
// demodreamer.thedreamwedding.in           → /frost/...
// demodiscover.thedreamwedding.in          → /demodiscover/...

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// CE-46 · WEB-1 cut 1 · the vendor's subdomain (`<handle>.thedreamwedding.in`)
// decided by one pure function so b145 can drive every case in node. The demo
// hosts below keep their rules; `vendorLabel` refuses their labels by name.
// F-44.238: this file keeps the deprecated `middleware` convention on purpose;
// the rename to `proxy.ts` is its own later cut, ruled by the chair.
import { decide } from '@/lib/public/vendorHost';
import { LAYOUT_COOKIE, layoutForRequest, serverDefaultFor } from '@/lib/worklist/layoutSwitch';

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

export function middleware(request: NextRequest): NextResponse | Promise<NextResponse> {
  const host = request.headers.get('host') || '';
  const url  = request.nextUrl.clone();
  const path = url.pathname;

  // ── demodreamer.thedreamwedding.in → Frost ──────────────────────────────
  if (host.startsWith('demodreamer.')) {
    if (path.startsWith('/frost/')) return NextResponse.next();
    url.pathname = path === '/' ? '/frost' : `/frost${path}`;
    return NextResponse.rewrite(url);
  }

  // ── demodiscover.thedreamwedding.in → Demo discover ─────────────────────
  if (host.startsWith('demodiscover.')) {
    if (path.startsWith('/demodiscover')) return NextResponse.next();
    url.pathname = '/demodiscover';
    return NextResponse.rewrite(url);
  }

  // ── demobride.thedreamwedding.in → Bride demo ──────────────────────────────
  if (host.startsWith('demobride.')) {
    if (path.startsWith('/demo/bride')) return NextResponse.next();
    url.pathname = '/demo/bride';
    return NextResponse.rewrite(url);
  }

  // ── demo.thedreamwedding.in → Vendor demo ───────────────────────────────
  if (host.startsWith('demo.')) {
    if (path.startsWith('/demo/')) return NextResponse.next();

    const vendorMatch = path.match(/^\/vendor\/(.+)$/);
    if (vendorMatch) {
      url.pathname = `/demo/vendor/${vendorMatch[1]}`;
      return NextResponse.rewrite(url);
    }

    url.pathname = '/demo/not-found';
    return NextResponse.rewrite(url);
  }

  // ── <handle>.thedreamwedding.in → her public leaves ─────────────────────
  // `/`, `/date` and `/w/<slug>` rewrite onto app/v/[code]; an already-addressed
  // `/v/…` passes; anything else on her address goes to the same path on the
  // apex (302), so no signed-in surface ever renders under her name.
  const d = decide(host, path, SITE_BASE, url.search);
  // The styles switch, on the path a vendor's home resolves to (her own address rewritten, or /v/<code> itself).
  // ?_tdw=classic keeps a request on the classic page (the route's answer in the five-minute edge after a plan change).
  // WEB-5 · the styles site's switch (CE-47 ruling B). Only a vendor-site path (/v/<code>, a look, a collection, or her
  // own address rewritten to one) waits for the answer; every other request stays synchronous, exactly as before. The
  // switch's module is loaded only on that branch.
  const target = d && d.kind === 'rewrite' ? d.pathname : path;
  if (/^\/v\/[^/]+(\/(looks|work|acts|events|collections)\/[^/]+)?\/?$/.test(target) && url.searchParams.get('_tdw') !== 'classic') {
    return (async () => {
      const { siteKind, sitePath } = await import('@/lib/site/kind');
      const sp = sitePath(target);
      // Her preview (?preview=<token>) goes to the site's route whatever the kind door says (an unpublished draft is
      // still 'classic' there); the route asks the card door with her token and sends a classic answer back.
      const pv = url.searchParams.has('preview');
      if (sp && (pv || (await siteKind(sp.code, false)) === 'styles')) {
        const [pn, q] = sp.to.split('?'); url.pathname = pn; if (q) for (const [k, v] of new URLSearchParams(q)) url.searchParams.set(k, v);
        return NextResponse.rewrite(url);
      }
      if (d && d.kind === 'rewrite') { url.pathname = d.pathname; return NextResponse.rewrite(url); }
      return NextResponse.next();
    })();
  }
  if (d && d.kind === 'rewrite') { url.pathname = d.pathname; return NextResponse.rewrite(url); }
  if (d && d.kind === 'redirect') return NextResponse.redirect(d.url, 302);

  // ── DESIGN-1 · THE LAYOUT SWITCH (lib/worklist/layoutSwitch.ts) ───────────────────────────────────────────────────
  // A vendor whose layout is v2 is served the v2 route tree at the same address; everyone else, untouched. The v2 tree
  // has no address of its own: a direct /v2/... goes back to the address it mirrors.
  if (path === '/v2' || path.startsWith('/v2/')) { url.pathname = path.slice(3) || '/'; return NextResponse.redirect(url, 302); }
  if (path === '/vendor' || path.startsWith('/vendor/')) {
    if (layoutForRequest(request.cookies.get(LAYOUT_COOKIE)?.value, serverDefaultFor({ NODE_ENV: process.env.NODE_ENV, TDW_LAYOUT_DEFAULT: process.env.TDW_LAYOUT_DEFAULT })) === 'v2') {
      url.pathname = '/v2' + path;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
