// lib/vendor/demo.ts
// Demo-mode detection. Vendors arrive at /vendor?demo=<DEMO_UUID>&handle=...
// from /demo/[handle]. Demo sessions have no real JWT, so any authed API call
// 401s — _base.ts must skip its redirect, and hooks must short-circuit to
// mock data instead of hitting the network.
//
// Detection is intentionally synchronous and side-effect-free: URL param first
// (works on iOS Safari Private Browsing where localStorage is blocked), then
// the demo-session localStorage flag as a fallback for subsequent navigations
// inside the SPA where the URL param has been cleaned.

export const DEMO_UUID     = 'bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb';
export const DEMO_SESS_KEY = 'tdw_vendor_demo_session';

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === DEMO_UUID) return true;
  } catch { /* malformed URL — fall through */ }

  try {
    const raw = window.localStorage.getItem(DEMO_SESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.demo) return true;
    }
  } catch { /* iOS Private Browsing or quota — fall through */ }

  try {
    const real = window.localStorage.getItem('vendor_session')
              || window.localStorage.getItem('vendor_web_session');
    if (real) {
      const parsed = JSON.parse(real);
      if (parsed?.demo || parsed?.id === DEMO_UUID) return true;
    }
  } catch { /* ignore */ }

  return false;
}
