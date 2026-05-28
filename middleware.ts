// middleware.ts
// Subdomain routing for TDW demo subdomains.
//
// demo.thedreamwedding.in/vendor/[handle]  → /demo/vendor/[handle]/...  (vendor demo)
// demodreamer.thedreamwedding.in           → /frost/...                 (bride Frost demo)
// demodiscover.thedreamwedding.in          → /demodiscover/...          (discover demo — demo vendors only)

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

  // ── demodiscover.thedreamwedding.in → Discover demo (demo vendors only) ─
  if (host.startsWith('demodiscover.')) {
    if (path.startsWith('/demodiscover/') || path === '/demodiscover') return NextResponse.next();
    url.pathname = path === '/' ? '/demodiscover' : `/demodiscover${path}`;
    return NextResponse.rewrite(url);
  }

  // ── demo.thedreamwedding.in → Vendor demo ───────────────────────────────
  if (host.startsWith('demo.')) {
    if (path.startsWith('/demo/')) return NextResponse.next();

    // /vendor/[handle]/... → /demo/vendor/[handle]/...
    const vendorMatch = path.match(/^\/vendor\/(.+)$/);
    if (vendorMatch) {
      url.pathname = `/demo/vendor/${vendorMatch[1]}`;
      return NextResponse.rewrite(url);
    }

    // Root or unmatched
    url.pathname = '/demo/not-found';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
