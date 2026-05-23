// middleware.ts
// Handles demo subdomain routing: demo.thedreamwedding.in/[handle] → /demo/vendor/[handle]
// demo.thedreamwedding.in/bride → /demo/bride

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Demo subdomain routing
  if (host.startsWith('demo.')) {
    const url = request.nextUrl.clone();
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const handle = pathSegments[0] || 'bride';

    if (handle === 'bride') {
      url.pathname = '/demo/bride';
    } else {
      url.pathname = `/demo/vendor/${handle}`;
    }

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
