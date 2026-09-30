// lib/worklist/layoutSwitch.ts · DESIGN-1 · THE LAYOUT SWITCH, the pwa's half (the founder, 29 Sept 2026).
//
// Which vendor layout this vendor sees is decided by the server, one home: dream-os src/lib/vendorLayout.js (the
// switchboard's flag.vendor_layout_v2 as the global default, her row's layout_v2 per vendor, CE-46 F3), carried on GET /me as
// `layout`, 'v2' or 'classic'. The pwa keeps it in one cookie; middleware.ts reads the cookie and rewrites /vendor/* to
// the v2 route tree (app/v2/vendor, whose code lives in v2/) for 'v2', and leaves every request alone otherwise. No
// cookie, an unread /me, or any other value is 'classic': today's layout, unchanged. Switching back is the setting.
export const LAYOUT_COOKIE = 'tdw_layout';
export type Layout = 'classic' | 'v2';

/** A cookie or wire value as a layout, or null when it is not one (never guessed). */
export function asLayout(v: unknown): Layout | null {
  return v === 'v2' || v === 'classic' ? v : null;
}

/** The server default a request may fall back on: TDW_LAYOUT_DEFAULT, the dev and bench seam (the _v2 benches serve the
 *  v2 tree with no cookie), honoured ONLY outside a production build. In production it is ignored whatever it holds, so
 *  no Vercel variable can put a vendor on a layout: the admin panel's switchboard is the one home (CE-46 F4 (a)). */
export function serverDefaultFor(env: { NODE_ENV?: string; TDW_LAYOUT_DEFAULT?: string }): string | undefined {
  return env.NODE_ENV === 'production' ? undefined : env.TDW_LAYOUT_DEFAULT;
}

/** The tree a request is served: the cookie's layout; without one, the server default (serverDefaultFor above, never in
 *  production), and otherwise classic. */
export function layoutForRequest(cookie: string | undefined, serverDefault: string | undefined): Layout {
  return asLayout(cookie) ?? asLayout(serverDefault) ?? 'classic';
}
