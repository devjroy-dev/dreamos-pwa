// middleware.ts
// Demo subdomain routing for demo.thedreamwedding.in
//
// URL patterns:
//   demo.thedreamwedding.in/vendor/[handle]           → /demo/vendor/[handle]
//   demo.thedreamwedding.in/vendor/[handle]/studio    → /demo/vendor/[handle]/studio
//   demo.thedreamwedding.in/vendor/[handle]/list/...  → /demo/vendor/[handle]/list/...
//   demo.thedreamwedding.in/vendor/[handle]/...       → /demo/vendor/[handle]/...
//   demo.thedreamwedding.in/bride                     → /demo/bride
//   demo.thedreamwedding.in/                          → /demo/bride

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (!host.startsWith('demo.')) return NextResponse.next();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Already correctly rewritten — never loop
  if (path.startsWith('/demo/')) return NextResponse.next();

  // Root or /bride → bride demo
  if (path === '/' || path === '/bride') {
    url.pathname = '/demo/bride';
    return NextResponse.rewrite(url);
  }

  // /vendor/[handle] and all sub-paths → /demo/vendor/[handle]/...
  const vendorMatch = path.match(/^\/vendor\/(.+)$/);
  if (vendorMatch) {
    url.pathname = `/demo/vendor/${vendorMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  // Bare handle (legacy): /makeupbyswatiroy → /demo/vendor/makeupbyswatiroy
  const bare = path.replace(/^\//, '');
  if (bare && bare !== 'vendor') {
    url.pathname = `/demo/vendor/${bare}`;
    return NextResponse.rewrite(url);
  }

  url.pathname = '/demo/bride';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
