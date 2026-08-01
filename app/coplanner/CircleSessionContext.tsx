'use client';
import { createContext, useContext } from 'react';

export { API_BASE as API } from '../../lib/api';
export const GOLD     = '#C9A84C';
export const INK      = '#0C0A09';
export const CREAM    = '#F8F7F5';
export const MUTED    = 'rgba(248,247,245,0.5)';
export const HAIRLINE = 'rgba(248,247,245,0.12)';
export const EASE     = 'cubic-bezier(0.22,1,0.36,1)';

export const FROST_PANEL: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
  border: `0.5px solid ${HAIRLINE}`,
  borderRadius: 16,
};

export const FONT_DISPLAY = "'Cormorant Garamond', serif";
export const FONT_BODY    = "'DM Sans', sans-serif";
export const FONT_EYEBROW = "'Jost', sans-serif";

export type CircleRole = 'Partner' | 'inner_circle' | 'circle';

export interface CirclePermissions {
  dreamai_access_granted: boolean;
  can_see_budget: boolean;
  can_see_guests: boolean;
  can_see_vendors: boolean;
  can_contribute_muse: boolean;
}

// Backend response shape — GET /api/v2/circle/session/:userId
// (src/api/circle/session.js, MINIMISED at F-07.72 to the fields this client
// actually reads, derived by command over this whole tree):
//   { user_id, name, couple_id, role, permissions, bride: { name } }
//
// The door previously also sent `phone`, `pin_set`, `co_planner_id`,
// `bride.wedding_date` and `bride.partner_name` — every one of them read by
// nothing here. `wedding_date` looks like a counter-example and is not: the
// co-planner home takes it from GET /couple/profile/:brideId (page.tsx:78),
// a different fetch. The optional fields below are retained ONLY so sessions
// cached before that change still satisfy this type.
//
// Historically this type declared flat fields (bride_name, primary_user_id,
// invitee_name) that the backend never sent. That caused every consumer page
// to render "undefined" wherever the bride's name appeared, and crashed the
// threads/[threadId] page on render. This type now matches the wire shape.
// Always read the bride's name via brideName() and the bride's id via brideId()
// so future shape changes only need to be handled in one place.
export interface CircleSession {
  user_id: string;
  name?: string | null;
  phone?: string | null;
  pin_set?: boolean;
  // F-07.72 — the server stopped sending this: it was declared here and read by
  // NO screen. Optional so cached sessions minted before this delivery still
  // type-check while nothing new depends on it.
  co_planner_id?: string;
  couple_id: string;
  role: CircleRole;
  dreamer_type?: string;
  permissions: CirclePermissions;
  bride?: {
    name?: string | null;
    wedding_date?: string | null;
    partner_name?: string | null;
  } | null;
  // Forward-compat: tolerate legacy/extra fields without TS friction.
  [extra: string]: unknown;
}

// ── F-07.72 · THE LANE'S CREDENTIAL, AND WHERE IT LIVES ─────────────────────
// The co-planner lane was TOKENLESS by design until this delivery: `verify-pin`
// returned a bare `userId` string and every door believed whatever identifier
// the client supplied. The server now mints a signed, subject-bearing session
// (user_id + couple_id inside the signature) at verify-pin and at join/accept.
// These helpers are the client's one home for holding and sending it.
//
// COOKIE BEFORE localStorage, WITH THE localStorage MIRROR — the house law's
// settled iOS-Safari auth pattern (§4, "Never regress to localStorage-only"),
// and the reason this is not a bare `localStorage.setItem`. The circle lane's
// existing `circle_session` blob IS localStorage-only; it predates the law's
// application here and is a SESSION SNAPSHOT, not a credential. A credential is
// held to the higher standard, so this one is written to both and read from the
// cookie first.
//
// THE TOKEN IS DELIBERATELY NOT INSIDE THE SESSION BLOB. `layout.tsx` overwrites
// that blob wholesale on every background hydration refresh; a credential kept
// inside it would be destroyed by a routine refresh whose response never carried
// one. Separate key, separate lifetime.
//
// 90 DAYS, founder-ruled 2026-08-02, and re-minted on every verify-pin and every
// join/accept — so an active member's window rolls forward. The expiry here is
// the COOKIE's, not the token's: the server's signature carries its own and is
// the only one that decides anything.
export const CIRCLE_TOKEN_KEY    = 'circle_token';
export const CIRCLE_TOKEN_COOKIE = 'tdw_circle_token';
const CIRCLE_TOKEN_MAX_AGE       = 90 * 24 * 60 * 60; // seconds

export function setCircleToken(token: string | null): void {
  if (typeof window === 'undefined' || !token) return;
  try {
    document.cookie =
      `${CIRCLE_TOKEN_COOKIE}=${encodeURIComponent(token)}; Max-Age=${CIRCLE_TOKEN_MAX_AGE}; ` +
      `Path=/; SameSite=Lax; Secure`;
  } catch { /* cookie blocked — the mirror below still serves this device */ }
  try { localStorage.setItem(CIRCLE_TOKEN_KEY, token); } catch { /* private mode */ }
}

export function getCircleToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const hit = document.cookie.split('; ').find(r => r.startsWith(`${CIRCLE_TOKEN_COOKIE}=`));
    if (hit) {
      const v = decodeURIComponent(hit.split('=').slice(1).join('='));
      if (v) return v;
    }
  } catch { /* fall through to the mirror */ }
  try { return localStorage.getItem(CIRCLE_TOKEN_KEY) || null; } catch { return null; }
}

export function clearCircleToken(): void {
  if (typeof window === 'undefined') return;
  try { document.cookie = `${CIRCLE_TOKEN_COOKIE}=; Max-Age=0; Path=/`; } catch {}
  try { localStorage.removeItem(CIRCLE_TOKEN_KEY); } catch {}
}

// The one shape every co-planner fetch sends. Returns the extra headers alone
// when no token is held, because this delivery ENFORCES NOTHING: a credential-
// less request must still be served exactly as it was before, and a client that
// sent `Authorization: Bearer null` would be inventing a credential from nothing.
export function circleAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const t = getCircleToken();
  return t ? { ...(extra || {}), Authorization: `Bearer ${t}` } : { ...(extra || {}) };
}

export const CircleSessionContext = createContext<CircleSession | null>(null);

export function useCircleSession(): CircleSession {
  const s = useContext(CircleSessionContext);
  if (!s) {
    throw new Error('useCircleSession must be used inside <CircleSessionContext.Provider>');
  }
  return s;
}

// Resolve the bride's user id. Backend sends couple_id; older cached sessions
// may carry primary_user_id; honour both.
export function brideId(s: CircleSession): string {
  return (s.couple_id as string) || (s.primary_user_id as string) || '';
}

// Resolve the bride's display name. Backend sends bride.name (nested); older
// cached sessions may carry bride_name (flat); honour both, then fall back.
export function brideName(s: CircleSession): string {
  return s.bride?.name || (s.bride_name as string) || 'the bride';
}

// Resolve the Circle member's own display name. Backend sends `name`; older
// cached sessions may carry invitee_name; honour both, then fall back.
export function memberName(s: CircleSession): string {
  return (s.name as string) || (s.invitee_name as string) || 'Friend';
}
