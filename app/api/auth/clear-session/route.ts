// app/api/auth/clear-session/route.ts
// GET /api/auth/clear-session
//
// Server-side session wipe. Clears all vendor session cookies then serves
// an HTML page that clears localStorage and redirects to /.
//
// Works on iOS Safari where console access is impossible.
// Share the link: thedreamwedding.in/api/auth/clear-session

import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAMES = [
  'tdw_vendor_session',
  'tdw_vendor_token',
  'tdw_is_demo',
];

export async function GET(_req: NextRequest) {
  // Serve an HTML page that:
  // 1. Clears localStorage
  // 2. Then redirects to login
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signing out...</title>
  <style>
    body { background: #0C0A09; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    p { font-family: system-ui, sans-serif; font-size: 13px; color: rgba(248,247,245,0.4); letter-spacing: 0.1em; }
  </style>
</head>
<body>
  <p>Signing out...</p>
  <script>
    try { localStorage.clear(); } catch(e) {}
    try { sessionStorage.clear(); } catch(e) {}
    // Clear cookies from JS side too
    const cookies = ['tdw_vendor_session','tdw_vendor_token','tdw_is_demo',
                     'vendor_session','access_token','refresh_token'];
    cookies.forEach(name => {
      document.cookie = name + '=; max-age=0; path=/; SameSite=Lax; Secure';
      document.cookie = name + '=; max-age=0; path=/; SameSite=None; Secure';
    });
    setTimeout(() => { window.location.replace('/'); }, 300);
  </script>
</body>
</html>`;

  const res = new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });

  // Expire all session cookies server-side
  const pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
  for (const name of COOKIE_NAMES) {
    res.headers.append('Set-Cookie', `${name}=; Max-Age=0; Path=/; Expires=${pastDate}; SameSite=Lax; Secure`);
    res.headers.append('Set-Cookie', `${name}=; Max-Age=0; Path=/; Expires=${pastDate}; SameSite=None; Secure`);
  }

  return res;
}
