// lib/worklist/layoutSwitch.ts · DESIGN-1 · THE LAYOUT SWITCH, the pwa's half (the founder, 29 Sept 2026).
//
// Which vendor layout this vendor sees is decided by the server, one home: dream-os src/lib/vendorLayout.js (the
// switchboard's flag.vendor_layout_v2 as the global default, LAYOUT_V2_VENDOR_IDS per vendor), carried on GET /me as
// `layout`, 'v2' or 'classic'. The pwa keeps it in one cookie; middleware.ts reads the cookie and rewrites /vendor/* to
// the v2 route tree (app/v2/vendor, whose code lives in v2/) for 'v2', and leaves every request alone otherwise. No
// cookie, an unread /me, or any other value is 'classic': today's layout, unchanged. Switching back is the setting.
export const LAYOUT_COOKIE = 'tdw_layout';
export type Layout = 'classic' | 'v2';

/** A cookie or wire value as a layout, or null when it is not one (never guessed). */
export function asLayout(v: unknown): Layout | null {
  return v === 'v2' || v === 'classic' ? v : null;
}

/** The tree a request is served: the cookie's layout; without one, the server default (TDW_LAYOUT_DEFAULT, a dev and
 *  bench seam, unset in production), and otherwise classic. */
export function layoutForRequest(cookie: string | undefined, serverDefault: string | undefined): Layout {
  return asLayout(cookie) ?? asLayout(serverDefault) ?? 'classic';
}
