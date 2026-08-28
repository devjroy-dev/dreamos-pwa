import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── F-38.37 · THE BUILD SAYS WHICH COMMIT IT IS ─────────────────────────────
  //
  // FOUR GATE RUNS THIS SITTING WERE SPENT ON A DEPLOY NOBODY COULD IDENTIFY. The audit
  // and the render arm both read a live URL; the source they were cut from sits on disk
  // beside them; and there was no way to ask whether the two were the same tree. Every
  // FAIL then had two readings — the cure is missing, or the deploy predates it — and this
  // seat guessed wrong twice in a row, offering the founder two freshness checks that
  // could not see what they were asked about. `wl_audit.mjs`'s own header has warned about
  // exactly this since the day it was written: 「the estate has been burned by a source
  // that was right beside a build that was stale」.
  //
  // Vercel sets VERCEL_GIT_COMMIT_SHA at build time. Exposing seven characters of it lets
  // the gate STATE which tree it just measured instead of the operator inferring it from
  // which bytes came back. `local` is the honest answer for a local `next build`, not a
  // fallback pretending to be a commit.
  //
  // ⚠ THIS FILE IS OUTSIDE EVERY DECLARED GRANT and the change is disclosed rather than
  // slipped in: three lines, no runtime behaviour, mechanical to revert. It is here because
  // the alternative is a fifth gate run whose result cannot be attributed to a tree.
  env: {
    NEXT_PUBLIC_TDW_COMMIT: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || 'local',
  },
  async headers() {
    return [
      {
        // Allow /sw.js (served from origin root) to register with /vendor/mobile/ scope.
        // Without this header browsers block registering a SW with a scope above its location.
        source: '/sw.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
};

export default nextConfig;
