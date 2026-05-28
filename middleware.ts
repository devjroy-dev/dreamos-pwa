// middleware.ts
// Demo subdomain routing for demo.thedreamwedding.in
// ALL paths rewrite to /demo/vendor/[handle]/...
// No bride demo. No fallback. Vendor handle is always first segment.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (!host.startsWith('demo.')) return NextResponse.next();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Already rewritten — never loop
  if (path.startsWith('/demo/')) return NextResponse.next();

  // /vendor/[handle]/... → /demo/vendor/[handle]/...
  const vendorMatch = path.match(/^\/vendor\/(.+)$/);
  if (vendorMatch) {
    url.pathname = `/demo/vendor/${vendorMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  // Root or anything else — show a simple 404-style page
  url.pathname = '/demo/not-found';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
