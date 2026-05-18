// dreamos-pwa --- shared API base URL
//
// All fetch calls across the app import `API_BASE` from this file.
// Reads from NEXT_PUBLIC_API_BASE env var (set in Vercel dashboard).
// Falls back to dream-os Railway service if env var is unset.
//
// To override locally, create .env.local in the repo root with:
//   NEXT_PUBLIC_API_BASE=http://localhost:8080
//
// Must be prefixed NEXT_PUBLIC_ so Next.js exposes it to the browser.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE
  || 'https://dream-os-production.up.railway.app';
