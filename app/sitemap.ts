// app/sitemap.ts
// TDW · BLOCK 19 · G3.1 s2 — THE SITEMAP, P3 (master §7: pages, never a score).
//
// Lists every live storefront and every published, consented wedding page.
// The handles come from ONE public door, `GET /api/v2/public/sitemap` on
// dream-os (owed: dream-os packet 2 — the door does not exist at a4fdc92;
// until it lands this file serves the static pages only and logs once). The
// pwa holds no database credential and this file does not grow one: a sitemap
// that read Supabase from the front would be a second reader of the vendors
// table on the wrong side of the wire.
//
// `revalidate` — the sitemap is a page (R-G31.3/.7): rebuilt hourly, not per
// request, so a crawler never makes the API pay per hit.
import type { MetadataRoute } from 'next';

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';
const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  ?? 'https://dream-os-production.up.railway.app';

export const revalidate = 3600;

type Row = { handle: string; slug?: string | null; updated_at?: string | null };

async function publicPages(): Promise<Row[]> {
  try {
    const r = await fetch(`${API_BASE}/api/v2/public/sitemap`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.pages) ? j.pages : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await publicPages();
  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_BASE}/`,        changeFrequency: 'weekly',  priority: 1 },
    // R-41.94 · the public intake. Reachable is the point: `app/robots.ts` is
    // UNCHANGED and carries no `/plan` disallow, so the allow at its `:17` serves
    // it. A page a stranger is meant to find from a link and from search is listed
    // here rather than left to be discovered by whoever already had the URL.
    { url: `${SITE_BASE}/plan`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_BASE}/privacy`, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_BASE}/terms`,   changeFrequency: 'yearly',  priority: 0.2 },
  ];
  const pages: MetadataRoute.Sitemap = rows
    .filter((p) => p && typeof p.handle === 'string' && p.handle)
    .map((p) => ({
      url: p.slug ? `${SITE_BASE}/v/${p.handle}/${p.slug}` : `${SITE_BASE}/v/${p.handle}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: p.slug ? 'monthly' : 'weekly',
      priority: p.slug ? 0.6 : 0.8,
    }));
  return [...statics, ...pages];
}
