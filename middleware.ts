// middleware.ts
// Subdomain routing for TDW demo subdomains.
//
// demo.thedreamwedding.in/vendor/[handle]  → /demo/vendor/[handle]/...
// demodreamer.thedreamwedding.in           → /frost/...
// demodiscover.thedreamwedding.in          → /demodiscover/...

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
