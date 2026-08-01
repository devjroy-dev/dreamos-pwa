// lib/admin-api/_base.ts
// THE ONE AUTHORITY for every admin API call (CE ruling F-5, the F-07.70 pattern).
//
// ── WHAT THIS FILE REPLACES ──────────────────────────────────────────────────
// F-07.84: app/admin/login/page.tsx compared the typed password against
// NEXT_PUBLIC_ADMIN_PASSWORD in the BROWSER and wrote localStorage
// admin_session='true'. Next inlines NEXT_PUBLIC_* into the public bundle, so
// the live admin credential was served to every visitor of the site; and a
// boolean in localStorage opened the whole panel to anyone with devtools.
//
// F-07.85: the retired password was hardcoded at NINETEEN sites and the
// `x-admin-password` header was assembled by hand in TWENTY-SIX files. Since
// the rotation, every one of them 403'd — the founder's outage.
//
// ── THE CARRIER, RULED (CE F-1(b)) ───────────────────────────────────────────
// BEARER, not a cross-site cookie. The kickoff's premise — "the estate already
// runs credentialed cross-origin" — was falsified by command at read-first:
// ZERO `credentials:'include'` clients exist in this repo, the server's
// Access-Control-Allow-Credentials answers a question nobody asks, and Panel
// A's cookie is minted Path=/admin;SameSite=Strict and can never leave its own
// origin. The estate's PROVEN cross-origin carrier is the bearer token
// (lib/frost-api/_base.ts:242). Betting the daily panel on an unprecedented
// third-party cookie under Safari ITP was refused.
//
// ── §8 NATIVE-IMPLICATIONS: EXEMPT BY CLASS, in ink ──────────────────────────
// The protocol's §8 clause forbids localStorage in new code paths because it
// would block the Expo port. That clause protects the PRODUCT lanes. app/admin/**
// is an OPERATOR surface that never ships native. The localStorage bearer here
// is EXEMPT-BY-CLASS, ruled explicitly by the chair so nobody relitigates it.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

const TOKEN_KEY   = 'admin_session_token';
const EXPIRY_KEY  = 'admin_session_expires';

// ── Session storage ─────────────────────────────────────────────────────────
// Reads are LAZY on purpose. Every header object in this panel used to be a
// module-level const evaluated at import time; a token read at import time is a
// token read before the operator has signed in. `adminHeaders()` is a function
// so the token is read at the moment of the call, never earlier.

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const exp = Number(localStorage.getItem(EXPIRY_KEY) || '0');
    // A token past its own stated expiry is not sent. The server would refuse
    // it anyway (the expiry is inside the signed payload); refusing here means
    // the panel bounces to login instead of showing a wall of failed screens.
    if (!exp || exp <= Date.now()) { clearAdminSession(); return null; }
    return token;
  } catch { return null; }
}

export function setAdminSession(token: string, expiresAt: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, String(expiresAt));
  } catch { /* private mode — the session simply won't persist */ }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    // The retired boolean is removed on every clear so a browser that still
    // carries it from before this cure cannot keep wearing it. F-07.84.
    localStorage.removeItem('admin_session');
  } catch { /* ignore */ }
}

export function hasAdminSession(): boolean {
  return getAdminToken() !== null;
}

// ── The login door (F-2 ruled (a)) ──────────────────────────────────────────
// The password is POSTed and never stored. What comes back carries no
// credential inside it — the server mints HMAC session material over a nonce.
export async function adminLogin(password: string): Promise<{ ok: true } | { ok: false; status: number }> {
  const res = await fetch(`${API_BASE}/api/v2/admin/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ password }),
  });
  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  if (!data?.ok || !data?.token) return { ok: false, status: res.status };
  setAdminSession(data.token, Number(data.expires_at) || Date.now());
  return { ok: true };
}

// ── The one header authority ────────────────────────────────────────────────
// THE `x-admin-password` HEADER IS GONE. It is not sent here, it is not sent
// anywhere in app/admin/**, and it is no longer in the backend's CORS
// allowlist. Twenty-six files assembled it by hand; they all ride this now.
export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: adminHeaders() });
  if (!res.ok) throw new Error(`Admin ${init.method || 'GET'} ${path} failed: ${res.status}`);
  return res.json();
}

export async function adminGet<T = unknown>(path: string): Promise<T> {
  return req<T>(path);
}

export async function adminPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  return req<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
}

export async function adminPatch<T = unknown>(path: string, body?: unknown): Promise<T> {
  return req<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined });
}

export async function adminDelete<T = unknown>(path: string): Promise<T> {
  return req<T>(path, { method: 'DELETE' });
}

// Two-phase Cloudinary upload helper. Unchanged in substance; the Cloudinary
// leg carries no admin credential and never did.
export async function adminUploadFile(
  uploadUrlPath: string,
  file: File,
): Promise<{ image_url: string; cloudinary_public_id: string }> {
  const { upload_url, params } = await adminPost<{ upload_url: string; params: Record<string, unknown> }>(
    uploadUrlPath, { filename: file.name }
  );
  const fd = new FormData();
  Object.entries(params).forEach(([k, v]) => fd.append(k, String(v)));
  fd.append('file', file);
  const up = await fetch(upload_url, { method: 'POST', body: fd });
  if (!up.ok) throw new Error('Cloudinary upload failed');
  const data = await up.json();
  return { image_url: data.secure_url, cloudinary_public_id: data.public_id };
}
