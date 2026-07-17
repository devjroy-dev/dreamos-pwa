// lib/supabase.ts
// Browser Supabase client (anon key) for Phone-OTP login — Path 1.
// The session it mints (signInWithOtp/verifyOtp) IS the auth token the rest of the
// app sends as Bearer; dream-os requireAuth verifies it via getUser(). The provision
// endpoint then links/creates the vendor|couple row. Env set in Vercel:
//   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// ── TDW_04 B6 rider — Q-S2-5's LAZY-CLIENT HARDENING (chartered; individually
// named ratify-or-revert) ────────────────────────────────────────────────────
// WHY: the ZIP-F Vercel build died prerendering `/` on `supabaseUrl is
// required` — createClient THREW AT MODULE SCOPE while a build-time pass
// evaluated this file, over a value that only matters at runtime. The incident
// closed as a single-build env-injection flake (not reproduced; the env rows
// were exonerated on the record), but the CLASS is real regardless of that
// verdict: a build-time throw on a runtime-only dependency is a landmine.
// CURE: the client is created on FIRST USE, not at import. Every call site is
// a tap-time handler (signInWithOtp / verifyOtp / refreshSession) — nothing
// touches the client at module scope — so a lazy proxy preserves every import
// site with a ZERO-line diff to callers and identical runtime behaviour: the
// same createClient, the same options, the same singleton, merely deferred to
// the first property read. A missing env now fails at the tap that needs it
// (in the browser, where NEXT_PUBLIC_* is inlined) instead of killing a build.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

// The lazy face: typed as the client, constructs it on first touch. Methods
// read straight off the real client (bound), sub-objects (`.auth`) ARE the
// real client's own — no wrapper survives past the first property access.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getClient() as unknown as Record<PropertyKey, unknown>;
    const v = c[prop];
    return typeof v === 'function' ? (v as (...a: unknown[]) => unknown).bind(c) : v;
  },
});
