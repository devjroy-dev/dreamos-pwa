// lib/public/vendorHost.ts
// TDW · CE-46 · WEB-1 cut 1 · THE VENDOR'S SUBDOMAIN, AS ONE PURE FUNCTION.
//
// `<handle>.thedreamwedding.in` is her address (contract.js subdomainFor() on
// dream-os builds the same string; SUBDOMAIN_FIXTURE mirrors it). This file
// decides, from a host and a path, what the edge file does: rewrite to the
// public leaf that already exists under app/v/[code], redirect to the apex for
// anything that is not a public leaf, or nothing. It reads no request object
// and no env so b145 can drive it whole in node.
//
// ── WHAT REWRITES, EXHAUSTIVELY ──────────────────────────────────────────────
//   /            → /v/<handle>            the storefront (app/v/[code]/page.tsx)
//   /date[?…]    → /v/<handle>/date       the date check (app/v/[code]/date)
//   /w/<slug>    → /v/<handle>/w/<slug>   a wedding page (app/v/[code]/w/[slug])
//   /v/…         → unchanged              an already-addressed leaf passes
// Anything else on a vendor host is a 302 to the same path on the apex: a
// signed-in surface never renders under her name, and a stranger who typed
// /vendor on her address lands on TDW's own door rather than a framework 404.
//
// ── WHAT IS NOT A VENDOR HOST ────────────────────────────────────────────────
// The apex itself; `www`; the four demo hosts middleware.ts already owns
// (demo, demodreamer, demodiscover, demobride); any label with a dot in it
// (a.b.<root> is nobody's handle); any label that is not a handle by shape.
// The handle shape is the estate's: letters, digits and hyphens, lowercased
// at the edge exactly as the card door lowercases it (F-40.276).

export const RESERVED_LABELS = Object.freeze(['www', 'demo', 'demodreamer', 'demodiscover', 'demobride']);

export type HostDecision =
  | { kind: 'rewrite'; pathname: string; handle: string }
  | { kind: 'redirect'; url: string; handle: string }
  | null;

/** The root the address hangs off, from a site base such as `https://thedreamwedding.in` or `http://localhost:4310`. */
export function rootOf(siteBase: string | undefined | null): string {
  const s = String(siteBase || 'https://thedreamwedding.in').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  return s.toLowerCase() || 'thedreamwedding.in';
}

/** The vendor label a host carries under `root`, or null when the host is not a vendor host. */
export function vendorLabel(host: string | null | undefined, root: string): string | null {
  const h = String(host || '').trim().toLowerCase();
  const r = root.toLowerCase();
  if (!h || h === r || !h.endsWith('.' + r)) return null;
  const label = h.slice(0, h.length - r.length - 1);
  if (!label || label.includes('.') || RESERVED_LABELS.includes(label)) return null;
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(label)) return null;
  return label;
}

/** What the edge does for `pathname` on `host`. `search` is carried verbatim on a rewrite and a redirect. */
export function decide(host: string | null | undefined, pathname: string, siteBase?: string | null, search = ''): HostDecision {
  const root = rootOf(siteBase);
  const handle = vendorLabel(host, root);
  if (!handle) return null;
  const p = pathname || '/';
  if (p.startsWith('/v/')) return null;
  if (p === '/') return { kind: 'rewrite', pathname: `/v/${handle}`, handle };
  if (p === '/date') return { kind: 'rewrite', pathname: `/v/${handle}/date`, handle };
  if (/^\/w\/[^/]+\/?$/.test(p)) return { kind: 'rewrite', pathname: `/v/${handle}${p.replace(/\/$/, '')}`, handle };
  // WEB-5 · the styles site on her own address: its look and collection pages rewrite like /w/<slug>, and its own
  // faces, script and beacon (root-relative in the document) pass through untouched.
  if (/^\/(looks|work|acts|events|collections|shop)\/[a-z0-9][a-z0-9-]{0,79}\/?$/.test(p)) return { kind: 'rewrite', pathname: `/v/${handle}${p.replace(/\/$/, '')}`, handle };   // + shop: CE-47 OFF-A2, an off-season shop item's page
  if (p.startsWith('/site-fonts/') || p.startsWith('/site-rt/') || p === '/site-beacon') return null;
  const scheme = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(root) ? 'http' : 'https';
  return { kind: 'redirect', url: `${scheme}://${root}${p}${search || ''}`, handle };
}

// ── HER SHORT ADDRESS, THE ONE HOME (WEB-1 cut 3; the founder, 28 September) ──
// `<handle>.thedreamwedding.in` is the address TDW shows her and gives to Google.
// A handle that is not a valid label by shape (the rule vendorLabel serves) has
// no short address: she keeps `/v/<handle>`, which always works. One function,
// so the room, the storefront row and the public page can never disagree.
export function shortAddressFor(handle: string | null | undefined, siteBase?: string | null): string | null {
  const h = String(handle || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(h) || RESERVED_LABELS.includes(h)) return null;
  const root = rootOf(siteBase);
  const scheme = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(root) ? 'http' : 'https';
  return `${scheme}://${h}.${root}`;
}

/** Her public URL: the short address when her handle has one, else `/v/<handle>` on the site base. */
export function publicUrlFor(handle: string | null | undefined, siteBase?: string | null): string {
  const s = shortAddressFor(handle, siteBase);
  if (s) return s;
  const base = String(siteBase || 'https://thedreamwedding.in').replace(/\/+$/, '');
  return `${base}/v/${String(handle || '').trim().toLowerCase()}`;
}
