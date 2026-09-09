// app/robots.ts
// TDW · BLOCK 19 · G3.1 s2 — SEO IS A PROPERTY OF THE PAGES (master §7), P3.
//
// One robots file for the estate. The public pages — /v/<handle>, its wedding
// pages, the date check — are crawlable; every signed-in surface and every
// capability-token surface is not. The list of disallows is derived from
// `app/` at the cut (ls app): a route group in parentheses has no URL segment,
// so `(auth)`, `(frost)`, `(landing)` are not listed — their children are.
import type { MetadataRoute } from 'next';

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: '*',
      allow: ['/', '/v/'],
      disallow: [
        '/vendor', '/admin', '/api', '/w',
        '/consent', '/sign', '/crew', '/coplanner', '/circle', '/credits',
        // F-41.156 · `/e/` JOINS ITS SIBLING. `/r/` has been here since G3.1 s2 and
        // `/e/` was never added — it was a sentence with nothing to leak, so nobody
        // noticed. From this cut it renders an enquiry summary about a real couple
        // (service, city, month, budget band) and a crawlable one is a public record
        // she never agreed to. The page's own `noindex` meta ships in the same
        // delivery; this line and that meta are both required, neither is the cure
        // alone — a meta is invisible to a crawler that was told not to come, and
        // robots.txt is advisory.
        '/demo', '/demodiscover', '/r/', '/e/',
      ],
    }],
    sitemap: `${SITE_BASE}/sitemap.xml`,
  };
}
