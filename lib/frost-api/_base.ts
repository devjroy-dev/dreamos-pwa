// lib/frost-api/_base.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared API client foundation for Frost vendor PWA.
//
// Single source of truth for:
//   - USE_MOCKS toggle (NEXT_PUBLIC_USE_MOCKS env var)
//   - API_BASE URL (reuses the same NEXT_PUBLIC_API_BASE env that the legacy
//     dreamos-pwa lib/api.ts uses — so flipping affects both layers)
//   - JWT extraction from localStorage (login already writes 'access_token')
//   - Response handling and error normalisation
//   - Session helpers (read vendorId from same keys login writes)
//
// CONTRACT: every function in the lib/frost-api modules uses these helpers. No screen
// or component imports from this file directly. If you find yourself reaching
// for fetch() outside lib/api/, stop — add a typed function in vendor.ts.
//
// FLIPPING TO REAL BACKEND:
//   .env.local at dreamos-pwa root:
//     NEXT_PUBLIC_USE_MOCKS=false
//     NEXT_PUBLIC_API_BASE=https://dream-os-production.up.railway.app
//   Restart `npm run dev`. Zero code changes.
// ─────────────────────────────────────────────────────────────────────────────

import { ApiClientError, ApiError } from '../types/common';

// ─── Config ─────────────────────────────────────────────────────────────────
// USE_MOCKS defaults to FALSE — real backend is the default.
// Set NEXT_PUBLIC_USE_MOCKS=true in .env.local to use mock data during dev.
export const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

// Same fallback as legacy lib/api.ts — kept identical so a single env var
// affects both new (frost) and old (legacy admin) surfaces during transition.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE
  || 'https://dream-os-production.up.railway.app';

// ─── Demo mode authority (F-05.39, CE ruling R2) ────────────────────────────
// THE ONE HOME. Before this cure the identical six-line body lived as three
// byte-identical private copies (app/(frost)/layout.tsx — dead, zero callers;
// lib/frost-api/muse.ts; lib/frost-api/couple.ts) while lib/frost/journey.ts
// — the CIRCLE-INVITE machinery and the sanctuary's data layer — consulted
// NONE of them. That split is F-05.39's disease: on any device that has ever
// held a real couple login, the real access_token survives under the demo
// blob, so couple.ts/muse.ts served mocks while journey.ts wrote REAL rows to
// the REAL couple. One authority, imported everywhere, is the cure.
//
// The blob is written by app/demo/bride/page.tsx on "Start Exploring". NOTE
// (F-05.65, filed): nothing in this repo ever REMOVES it — demo mode is
// permanent on a device until site storage is cleared by hand. Whether a
// demo-exit control ships is a product decision on a bride surface and is
// deliberately not this cure's.
export function isBrideDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const s = localStorage.getItem('tdw_bride_demo_session');
    return !!s && JSON.parse(s).demo === true;
  } catch { return false; }
}

// ─── Session helpers ────────────────────────────────────────────────────────
// Login (app/vendor/pin-login/page.tsx) writes BOTH 'vendor_web_session' AND
// 'vendor_session' (mirror) to localStorage on successful PIN verify, plus
// 'access_token' as the raw JWT. We read all three the same way the legacy
// TopBar does — checking 'vendor_session' first, falling back to
// 'vendor_web_session'. This matches the convention so the new layout works
// even if the session was written by either path.

export interface VendorSession {
  vendorId?: string;
  id?: string;
  userId?: string;
  vendorName?: string;
  name?: string;
  category?: string;
  tier?: string;
  phone?: string;
  pin_set?: boolean;
}

// ── Cookie helpers — iOS Safari ITP fallback ─────────────────────────────────
// Safari wipes localStorage after 7 days. We mirror tokens to cookies which
// survive ITP. Not httpOnly so frontend JS can read for Authorization header.
const COUPLE_COOKIE  = 'tdw_couple_token';
// F-07.65: `VENDOR_COOKIE = 'tdw_vendor_token'` stood here and had exactly two
// readers, both inside getAccessToken, both cross-lane. The reversal removed the
// readers, so the binding is removed with them rather than left as a dead const
// for a future reader to wonder about. The NAME survives in the prose at the two
// sites so the provenance of what was removed is still legible.
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=None; Secure`;
  } catch { /* ignore */ }
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.split('; ').find(r => r.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  } catch { return null; }
}

export function getVendorSession(): VendorSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem('vendor_session') ||
      localStorage.getItem('vendor_web_session');
    return raw ? (JSON.parse(raw) as VendorSession) : null;
  } catch {
    return null;
  }
}

export function getVendorId(): string | null {
  const s = getVendorSession();
  return s?.vendorId || s?.id || null;
}

export interface CoupleSession {
  id?: string;       // couple_id
  userId?: string;
  name?: string;
  pin_set?: boolean;
}

export function getCoupleSession(): CoupleSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem('couple_session') ||
      localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw) as CoupleSession & { coupleId?: string };
      if (s.coupleId && !s.id) s.id = s.coupleId;
      return s;
    }
  } catch { /* fall through to cookie */ }
  // Cookie fallback — covers iOS Safari where localStorage.setItem threw during
  // sign-in (session lives only in the tdw_couple_session cookie set by landing).
  try {
    const cookieRaw = readCookie('tdw_couple_session');
    if (cookieRaw) {
      const parsed = JSON.parse(cookieRaw) as CoupleSession;
      if (parsed && (parsed as { id?: string }).id) return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

// ── F-07.65 CURED · THE LANE ASSERTION (fork 1(b), CE-ruled) ─────────────────
// `access_token` is ONE localStorage slot written by SEVEN writers across BOTH
// lanes — the lane-agnostic OTP front door at app/(landing)/page.tsx:492 plus
// five lane pages plus this file's own cookie-restore. A vendor sign-in
// therefore CLOBBERS a bride's token in place, and every couple surface below
// this function then presents an effectively-vendor identity as if it were hers.
//
// THE TEST, AND WHY IT IS EVIDENCE RATHER THAN A HEURISTIC. The vendor lane
// records its own token INSIDE its session blob, at all three of its writers —
// (landing):505, vendor/pin-login:105, vendor/pin-reset:193 — and
// lib/vendor/session.ts treats that field as the lane's authority. So the blob
// is a WITNESS of what the vendor lane most recently wrote. If the bare slot is
// byte-identical to it, the slot is holding the vendor's token. That is not an
// inference about who the user is; it is a comparison against the other lane's
// own record.
//
// THE INVERSE TEST WAS CONSIDERED AND REJECTED, by command. Comparing the slot
// against the COUPLE blob's token would look symmetrical and would be wrong:
// couple/pin-login, couple/pin and couple/pin-reset write the fresh token ONLY
// to the bare key and never into their blob (they spread `existing`, whose token
// is the stale landing-OTP one). A couple-side comparison would therefore refuse
// every bride who signed in with her PIN — a cure that logs out its own subject.
//
// WHAT THIS COSTS, STATED AS A PROPERTY AND NOT DISCOVERED LATER: a human who
// holds BOTH roles on one users row and who has signed into the vendor lane but
// never into the couple lane on this device is refused here and sees the
// existing, already-vetoed "Session expired. Please sign in again." One couple
// sign-in fixes it permanently. The CE ruled this trade explicitly when it
// reversed F-05.30: a silent wrong-self is worse than an honest sign-in.
//
// SCOPE, RULED: this assertion lives in THIS FILE ONLY. sanctuary/page.tsx makes
// twelve direct localStorage reads that bypass this authority entirely and keeps
// the disease — that is F-07.70, chartered as its own one-file micro, and it is
// a stated split rather than an oversight.
function vendorLaneToken(): string | null {
  try {
    const raw =
      localStorage.getItem('vendor_session') ||
      localStorage.getItem('vendor_web_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { access_token?: string };
    return parsed && typeof parsed.access_token === 'string' && parsed.access_token
      ? parsed.access_token
      : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromStorage = localStorage.getItem('access_token');
    if (fromStorage) {
      // THE ASSERTION RUNS BEFORE THE COOKIE WRITE, deliberately. The old order
      // laundered a vendor JWT into the couple cookie on every read (the sync at
      // the line below), so the crossover survived even a localStorage wipe.
      // Refusing first means the couple cookie can only ever hold a token this
      // function was willing to return.
      if (fromStorage === vendorLaneToken()) return null;
      // Sync to cookie on every read — refreshes TTL, keeps cookie alive
      writeCookie(COUPLE_COOKIE, fromStorage);
      return fromStorage;
    }
    // localStorage cleared by iOS ITP — try the COUPLE cookie only.
    // F-05.30 REVERSED BY RULING: this read was `readCookie(COUPLE_COOKIE) ||
    // readCookie(VENDOR_COOKIE)` — the vendor arm was ratified as
    // defensible-by-design when the alternative was a logged-out bride; the P2
    // prefill specimen proved it mis-serves IDENTITY instead. Its server-side
    // twins died in the same motion at requireCoupleAuth:14 and requireAuth:18.
    const fromCookie = readCookie(COUPLE_COOKIE);
    if (fromCookie) {
      // Restore to localStorage for this session
      try { localStorage.setItem('access_token', fromCookie); } catch { /* ignore */ }
    }
    return fromCookie;
  } catch {
    // localStorage fully blocked (private mode) — couple cookie only.
    // The lane assertion cannot run here (it needs localStorage), so this arm is
    // narrowed instead: with no way to check, it declines to guess.
    return readCookie(COUPLE_COOKIE);
  }
}

// ─── Auth header ────────────────────────────────────────────────────────────
function getAuthHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Response handler ───────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ApiClientError(
      `Server returned non-JSON response (${res.status}).`,
      res.status,
    );
  }

  if (!res.ok) {
    const err = data as Partial<ApiError>;
    throw new ApiClientError(
      err?.error || `Request failed with status ${res.status}.`,
      res.status,
      typeof (err as { reason?: string })?.reason === 'string'
        ? (err as { reason?: string }).reason
        : undefined,
    );
  }

  // Backend signals errors with HTTP 2xx + { ok: false } occasionally
  // (only for 401-style auth issues currently). Honour the contract.
  const envelope = data as { ok?: boolean; error?: string };
  if (envelope?.ok === false) {
    throw new ApiClientError(
      envelope.error || 'Request failed.',
      res.status,
    );
  }

  return data as T;
}

// ─── Core request helpers ───────────────────────────────────────────────────
export async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | undefined | null>,
): Promise<T> {
  const qs = query
    ? Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const url = `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse<T>(res);
}

// ─── Tiny mock delay helper ─────────────────────────────────────────────────
// When USE_MOCKS is on, screens still want a brief loading flash so spinners,
// skeletons, and transitions exercise. 180-280ms ranges feel real without
// being annoying.
export function mockDelay<T>(value: T, ms = 220): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}
