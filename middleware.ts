// middleware.ts
// Demo subdomain routing for demo.thedreamwedding.in
// demo.thedreamwedding.in/vendor/makeupbyswatiroy → /demo/vendor/makeupbyswatiroy
// demo.thedreamwedding.in/bride → /demo/bride
// demo.thedreamwedding.in → /demo/bride

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (!host.startsWith('demo.')) return NextResponse.next();

  const url = request.nextUrl.clone();

  // Already routed correctly — prevent rewrite loop
  if (url.pathname.startsWith('/demo/')) return NextResponse.next();

  const path = url.pathname; // e.g. /vendor/makeupbyswatiroy or /bride or /

  if (path === '/' || path === '/bride') {
    url.pathname = '/demo/bride';
    return NextResponse.rewrite(url);
  }

  // /vendor/[handle] → /demo/vendor/[handle]
  const vendorMatch = path.match(/^\/vendor\/(.+)$/);
  if (vendorMatch) {
    url.pathname = `/demo/vendor/${vendorMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  // Bare handle: /makeupbyswatiroy → /demo/vendor/makeupbyswatiroy
  const bare = path.replace(/^\//, '');
  if (bare && bare !== 'vendor') {
    url.pathname = `/demo/vendor/${bare}`;
    return NextResponse.rewrite(url);
  }

  // Fallback
  url.pathname = '/demo/bride';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
