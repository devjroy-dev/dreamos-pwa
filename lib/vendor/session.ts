// lib/session.ts
// Vendor session persistence — localStorage primary, cookie fallback for iOS Safari.
// Session shape matches dream-os auth contract (JWT-based).
// Mock bypass: when NEXT_PUBLIC_USE_MOCKS=true, getVendorSession() returns
// a hardcoded mock session so login is skipped entirely.

import type { VendorSession } from './types/vendor';

export type { VendorSession };

const SESSION_KEY    = 'vendor_session';
const JUST_DO_IT_KEY = 'dreamai_just_do_it_vendor';
const HOT_DATES_KEY  = 'dreamai_hot_dates_visible';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

// The test vendor UUID hardcoded in MOCK_SESSION.
// Any stored session with this ID on a real domain is stale/contaminated.
const MOCK_VENDOR_ID    = '2eb5d3fb-31eb-4b26-859a-cf10ae477d53';
const MOCK_ACCESS_TOKEN = 'mock-access-token';

// Session version stamp — bump this to force-evict all stored sessions
// across all vendor browsers when we make breaking session shape changes.
const SESSION_VERSION = 2;

// Returns true when running on the real production domain.
// Mock sessions must never be returned on production.
function isProductionDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'thedreamwedding.in' || h === 'www.thedreamwedding.in';
}

// Returns true if the stored session looks contaminated:
//   - contains the mock vendor UUID
//   - contains the mock access token
//   - is missing a version stamp (written before hardening)
function isStaleSession(s: VendorSession & { _v?: number }): boolean {
  if (s.id === MOCK_VENDOR_ID)             return true;
  if (s.access_token === MOCK_ACCESS_TOKEN) return true;
  if (!s._v || s._v < SESSION_VERSION)     return true;
  return false;
}

const MOCK_SESSION: VendorSession = {
  id:            MOCK_VENDOR_ID,
  user_id:       'mock-user-id',
  name:          'Dev',
  phone:         '+918757788550',
  tier:          'signature',
  access_token:  MOCK_ACCESS_TOKEN,
  refresh_token: 'mock-refresh-token',
};

function ls(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

// ── Cookie helpers — iOS Safari ITP fallback ─────────────────────────────────
// iOS Safari wipes localStorage via ITP after 7 days of no direct interaction,
// and localStorage.setItem throws QuotaExceededError in Private Browsing.
// We mirror both the token and the full session to JS-readable cookies so
// getVendorSession() can reconstruct the session from cookies alone, covering
// both Private Browsing and ITP-eviction scenarios.

const COOKIE_TOKEN_KEY   = 'tdw_vendor_token';
const COOKIE_SESSION_KEY = 'tdw_vendor_session';
const COOKIE_MAX_AGE     = 7 * 24 * 60 * 60; // 7 days in seconds

function setCookieToken(token: string): void {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${COOKIE_TOKEN_KEY}=${encodeURIComponent(token)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

function getCookieToken(): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.split('; ').find(r => r.startsWith(`${COOKIE_TOKEN_KEY}=`));
    if (!match) return null;
    return decodeURIComponent(match.split('=')[1]);
  } catch { return null; }
}

function clearCookieToken(): void {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${COOKIE_TOKEN_KEY}=; max-age=0; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

// Full session cookie — set by /api/auth/set-session (demo GET redirect) or
// by setVendorSession() below. Allows getVendorSession() to reconstruct the
// session without localStorage — the token-only cookie can't do this alone.
function setCookieSession(session: VendorSession): void {
  if (typeof document === 'undefined') return;
  try {
    const val = encodeURIComponent(JSON.stringify(session));
    document.cookie = `${COOKIE_SESSION_KEY}=${val}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

function getCookieSession(): VendorSession | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.split('; ').find(r => r.startsWith(`${COOKIE_SESSION_KEY}=`));
    if (!match) return null;
    const val = decodeURIComponent(match.split('=').slice(1).join('='));
    const parsed = JSON.parse(val) as VendorSession;
    if (parsed && typeof parsed.id === 'string' && parsed.access_token) return parsed;
  } catch { /* ignore */ }
  return null;
}

function clearCookieSession(): void {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${COOKIE_SESSION_KEY}=; max-age=0; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

export function getVendorSession(): VendorSession | null {
  // Only return mock session in non-production environments
  if (USE_MOCKS && !isProductionDomain()) return MOCK_SESSION;
  const store = ls();

  // Try localStorage first
  try {
    const raw = store?.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as VendorSession & { _v?: number };
      if (parsed && typeof parsed.id === 'string' && parsed.access_token) {
        // Evict stale or contaminated sessions immediately
        if (isStaleSession(parsed)) {
          console.warn('[session] stale/mock session detected — evicting localStorage only');
          try { store?.removeItem(SESSION_KEY); store?.removeItem(SESSION_KEY + '_meta'); } catch {}
          // Don't wipe cookies — server-set cookie may be valid (SSO handoff)
          // Fall through to cookie check below
        } else {
          // Refresh both cookies on every read — keeps them alive past ITP 7-day window
          setCookieToken(parsed.access_token);
          setCookieSession(parsed);
          return parsed;
        }
      }
    }
  } catch { /* fall through to cookie */ }

  // Full session cookie fallback — covers Private Browsing (localStorage blocked)
  // and ITP eviction (localStorage cleared). Set by /api/auth/set-session GET
  // redirect or by setVendorSession() below.
  const cookieSession = getCookieSession();
  if (cookieSession) return cookieSession;

  // Token-only + meta fallback — legacy path, kept for backwards compatibility
  try {
    const cookieToken = getCookieToken();
    if (cookieToken) {
      const minimal = store?.getItem(SESSION_KEY + '_meta');
      if (minimal) {
        const meta = JSON.parse(minimal) as Omit<VendorSession, 'access_token' | 'refresh_token'>;
        return { ...meta, access_token: cookieToken, refresh_token: cookieToken };
      }
    }
  } catch { /* ignore */ }

  return null;
}

export function setVendorSession(session: VendorSession): void {
  // Clear any leftover demo flag before writing the new session. The demo
  // entry flow re-sets the flag explicitly afterwards if needed.
  // Stamp version so getVendorSession can detect pre-hardening sessions
  const stamped = { ...session, _v: SESSION_VERSION };
  // localStorage.setItem throws QuotaExceededError in iOS Safari Private Browsing.
  // Wrap separately so the cookie writes below always execute regardless.
  try {
    const store = ls();
    if (store) {
      store.setItem(SESSION_KEY, JSON.stringify(stamped));
      const { access_token, refresh_token, ...meta } = session;
      store.setItem(SESSION_KEY + '_meta', JSON.stringify(meta));
    }
  } catch { /* Private Browsing — localStorage blocked, fall through to cookies */ }
  // First-party document.cookie writes work even in Private Browsing
  setCookieToken(session.access_token);
  setCookieSession(stamped as unknown as VendorSession);
}

export function clearVendorSession(): void {
  try {
    const store = ls();
    if (store) {
      store.removeItem(SESSION_KEY);
      store.removeItem(SESSION_KEY + '_meta');
    }
  } catch { /* ignore */ }
  clearCookieToken();
  clearCookieSession();
}

// ── Just Do It toggle ──────────────────────────────────────────────────────
export function getJustDoIt(): boolean {
  const store = ls();
  if (!store) return true;
  const val = store.getItem(JUST_DO_IT_KEY);
  return val === null ? true : val === 'true';
}

export function setJustDoIt(value: boolean): void {
  const store = ls();
  if (!store) return;
  store.setItem(JUST_DO_IT_KEY, String(value));
}

// ── Hot dates toggle ───────────────────────────────────────────────────────
// Default ON — vendors see muhurat markers by default.
export function getHotDatesVisible(): boolean {
  const store = ls();
  if (!store) return true;
  const val = store.getItem(HOT_DATES_KEY);
  return val === null ? true : val === 'true';
}

export function setHotDatesVisible(value: boolean): void {
  const store = ls();
  if (!store) return;
  store.setItem(HOT_DATES_KEY, String(value));
}
