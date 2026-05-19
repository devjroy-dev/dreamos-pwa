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
// CONTRACT: every function in lib/frost-api/vendor.ts uses these helpers. No screen
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
// USE_MOCKS defaults to TRUE unless explicitly set to 'false'.
// Rationale: until the screens are smoke-tested end-to-end against Railway,
// mocks are the safer default. Once you flip a deploy env var, it stays
// flipped.
export const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

// Same fallback as legacy lib/api.ts — kept identical so a single env var
// affects both new (frost) and old (legacy admin) surfaces during transition.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE
  || 'https://dream-os-production.up.railway.app';

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

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
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

// ─── Tiny mock delay helper ─────────────────────────────────────────────────
// When USE_MOCKS is on, screens still want a brief loading flash so spinners,
// skeletons, and transitions exercise. 180-280ms ranges feel real without
// being annoying.
export function mockDelay<T>(value: T, ms = 220): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}
