// lib/site/kind.ts · WEB-5 · the proxy's switch: which vendors are drawn by the styles site (CE-47 ruling B).
// The proxy reads ONLY WEB-4's small door (GET /api/v2/public/site-kind/:code -> { ok, v: 'classic' | 'styles' }),
// remembered per instance for 60 seconds (a vendor who changes plan is served correctly within a minute, well inside
// the five the chair set). Her preview never asks it (middleware.ts sends a preview straight to the site's route).
// Any failure is 'classic': today's page, as today.
const API = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const TTL = 60_000; const MAX = 5000;
const memo = new Map<string, { v: 'classic' | 'styles'; at: number }>();

export async function siteKind(code: string, fresh: boolean): Promise<'classic' | 'styles'> {
  const k = code.toLowerCase(); const now = Date.now(); const m = memo.get(k);
  if (!fresh && m && now - m.at < TTL) return m.v;
  let v: 'classic' | 'styles' = 'classic';
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 1500);   // never hold a page longer than this
    const r = await fetch(`${API}/api/v2/public/site-kind/${encodeURIComponent(k)}`, { signal: ctl.signal, cache: 'no-store' }); clearTimeout(t);
    if (r.ok) { const j = await r.json(); if (j && j.ok && j.v === 'styles') v = 'styles'; }
  } catch { v = m ? m.v : 'classic'; }
  if (memo.size > MAX) memo.clear();
  memo.set(k, { v, at: now }); return v;
}
/** The vendor paths the switch applies to: her home, a look (under any of the four trade words; the page answers 308
 *  to her own word), and a collection. The date leaf and the wedding page stay classic. */
export function sitePath(path: string): { code: string; to: string } | null {
  let r = /^\/v\/([^/]+)\/?$/.exec(path); if (r) return { code: decodeURIComponent(r[1]), to: `/site/${r[1]}` };
  r = /^\/v\/([^/]+)\/(looks|work|acts|events)\/([a-z0-9][a-z0-9-]{0,79})\/?$/.exec(path); if (r) return { code: decodeURIComponent(r[1]), to: `/site/${r[1]}/${r[2]}/${r[3]}` };
  // CE-47 OFF-A2: an off-season shop item's page (/shop/<slug>), on the styles site only.
  r = /^\/v\/([^/]+)\/shop\/([a-z0-9][a-z0-9-]{0,59})\/?$/.exec(path); if (r) return { code: decodeURIComponent(r[1]), to: `/site/${r[1]}/shop/${r[2]}` };
  r = /^\/v\/([^/]+)\/collections\/([a-z0-9][a-z0-9-]{0,79})\/?$/.exec(path); if (r) return { code: decodeURIComponent(r[1]), to: `/site/${r[1]}/collections/${r[2]}` };
  return null;
}
