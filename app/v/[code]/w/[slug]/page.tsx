// app/v/[code]/w/[slug]/page.tsx
// BLOCK 19 · G1.1 — THE PUBLIC WEDDING PAGE. `/v/<code>/w/<slug>` (R-40.15).
//
// ═══════════════════════════════════════════════════════════════════════════
// A LEAF BESIDE A LEAF, ON THE SAME GROUND
// ═══════════════════════════════════════════════════════════════════════════
// `app/v/[code]/page.tsx` is the card; this is the wedding. They share the
// cream lane deliberately — a guest who taps a credit lands on the same paper.
// What is carried across, and why each one:
//
//   · LIGHT ONLY (R-G11.1). No mode toggle, no dark twin. A stranger on mobile
//     data gets one ground, and `color-scheme:light` is declared as a CSS
//     PROPERTY as well as a meta, because F-19.42 proved the meta alone leaves
//     `getComputedStyle` reading `normal` — the exact state Chrome's auto-dark
//     inverts.
//   · THE SYSTEM STACK. No webfont in production. The mock embeds faces so its
//     capture is not a picture of DejaVu; the shipped page is under no such
//     obligation and a stranger on a train should not wait for one.
//   · ONE GOLD, SPENT ONCE, on the section rule. The house law caps it at 3×
//     per screen and this page spends 1.
//   · THE COLOPHON, ONCE, at the foot — from `lib/public/copy.ts` (R-G11.15),
//     never re-typed.
//
// ── THE MISS IS RENDERED, NEVER DELEGATED (F-19.19's law, inherited) ────────
// `notFound()` would give Next's raw framework 404 — a developer artefact shown
// to a guest who tapped a friend's WhatsApp link. The founder walked exactly
// that once. This renders one sentence on the same ground as a real page.
//
// AND THE FOUR MISSES ARE ONE BRANCH BY CONSTRUCTION, NOT BY CARE: the door
// returns its one indistinguishable 404 body for absent, unpublished,
// consent-off AND owner-withdrawn (`src/api/public/weddingPage.js`), and
// `fetchWedding` returns null on any non-ok response. There is no code path on
// which they could diverge, and no status code is visible anywhere.
//
// ── NO CLIENT COMPONENT, NO HYDRATION BUNDLE ───────────────────────────────
// This page has no state. A gallery that needed `useState` would ship a
// hydration bundle to every stranger who opens a wedding link; the strip is
// static and the photographs are anchors. Same refusal the card leaf makes.

import type { Metadata } from 'next';
import { PUBLIC_MISS, PUBLIC_COLOPHON_LEAD, PUBLIC_COLOPHON_HREF } from '@/lib/public/copy';

/* ── NO `revalidate` ON THIS ROUTE, AND THE ABSENCE IS THE RULING (R-40.33) ──
 * It carried `export const revalidate = 300` and the comment above it claimed
 * "consent is enforced at the DOOR on every revalidation". Both halves were
 * true and together they were wrong: the door does re-check consent, but only
 * once every five minutes, so a couple who turns her switch OFF stays published
 * to every visitor for up to five more minutes. A consent gate with a cache in
 * front of it is a cache, not a gate.
 *
 * ⚠ THE CARD LEAF KEEPS ITS 300 AND THAT ASYMMETRY IS DELIBERATE.
 * `app/v/[code]/page.tsx:59` is a vendor's own storefront: she controls its
 * switches and the only person a stale minute can hurt is her. This page is
 * governed by a THIRD PARTY's consent — the couple's — and the person a stale
 * minute hurts is the one who just withdrew it. Same shape, different owner,
 * different answer.
 *
 * Deleting the export is sufficient on Next 16: `fetch` is uncached by default
 * from 15 onward, so the door is called per request. Derived from
 * `package.json` (`next: 16.2.3`), not assumed — on Next 14 this same deletion
 * would have made the fetch `force-cache` and cached it FOREVER, which is the
 * opposite cure. */

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light' as const,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

type Roll = { role: string; label: string | null; name: string | null; handle: string | null };
type WeddingPayload = {
  wedding: { slug: string; title: string; venue: string | null; city: string | null; season: string | null };
  owner:   { business_name: string | null; handle: string };
  roll:    Roll[];
  photos:  { url: string; position: number }[];
};

/**
 * ONE FETCH SERVES BOTH `generateMetadata` AND THE PAGE. Next dedupes identical
 * `fetch` calls within a render pass, so the OG tags and the body are built from
 * ONE response and cannot describe two different weddings — the failure mode of
 * fetching twice, not a performance note.
 */
async function fetchWedding(code: string, slug: string): Promise<WeddingPayload | null> {
  try {
    // ⚠ NO CACHE OPTION, BY RULING (R-40.33) — and F-40.80's second half.
    // This retyped the literal `300` while the card leaf's own call reads its
    // exported `revalidate` binding (`app/v/[code]/page.tsx:189`), so the two
    // sites could drift by one edit and the "one line" reading of this cure
    // undercounted it. Both are gone: the door is called per request and
    // consent is answered fresh every time.
    const r = await fetch(
      `${API_BASE}/api/v2/public/wedding/${encodeURIComponent(code)}/${encodeURIComponent(slug)}`,
    );
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.ok ? (j as WeddingPayload) : null;
  } catch {
    return null;
  }
}

/** The meta line: venue · city · season year. Absent parts drop out rather than
 *  rendering an empty separator — a page whose event was deleted carries no
 *  season (the FK is ON DELETE SET NULL) and must not print a dangling middot. */
function metaLine(w: WeddingPayload['wedding']): string {
  return [w.venue, w.city, w.season].filter(Boolean).join(' \u00b7 ');
}

export async function generateMetadata(
  { params }: { params: Promise<{ code: string; slug: string }> },
): Promise<Metadata> {
  const { code, slug } = await params;
  const data = await fetchWedding(code, slug);
  // ⚠ A MISS GETS NO DESCRIPTIVE TAGS AND `noindex`. Leaking a wedding's title
  // into an OG card for a page that does not serve would defeat the consent gate
  // through the link preview — F-19.19's sibling, and bs_audit C28 polices the
  // same class on the card leaf.
  if (!data) return { title: PUBLIC_MISS, robots: { index: false, follow: false } };
  const title = `${data.wedding.title} \u2014 ${data.owner.business_name ?? ''}`.trim();
  return {
    title,
    description: metaLine(data.wedding) || undefined,
    openGraph: { title, description: metaLine(data.wedding) || undefined, type: 'article' },
  };
}

export default async function PublicWeddingPage(
  { params }: { params: Promise<{ code: string; slug: string }> },
) {
  const { code, slug } = await params;
  const data = await fetchWedding(code, slug);

  if (!data) {
    return (
      <main className="pw">
        <p className="pw-miss">{PUBLIC_MISS}</p>
        <WeddingStyles />
      </main>
    );
  }

  const { wedding, owner, roll, photos } = data;
  const hero = photos[0] ?? null;
  const strip = photos.slice(1, 5);

  return (
    <main className="pw">
      <header className="pw-top"><span className="pw-top-name">{owner.business_name}</span></header>

      <div className="pw-hero">
        {/* No next/image: this route serves strangers and the optimiser would put
            an origin round trip in front of the one thing they came for. The
            asset is already estate-mirrored and Cloudinary-served. */}
        {hero
          ? <img className="pw-heroimg" src={hero.url} alt="" />
          : <div className="pw-tone" />}
        <div className="pw-scrim" />
        <div className="pw-identity">
          <h1 className="pw-couple">{wedding.title}</h1>
          {metaLine(wedding) ? <p className="pw-meta">{metaLine(wedding)}</p> : null}
        </div>
      </div>

      {strip.length ? (
        <div className="pw-strip">
          {strip.map((p) => <img key={p.url} className="pw-stripimg" src={p.url} alt="" />)}
        </div>
      ) : null}

      {/* THE ONE GOLD ON THIS PAGE. */}
      <div className="pw-rule"><span className="pw-rule-line" /><span className="pw-diamond">&#9670;</span><span className="pw-rule-line" /></div>

      <section className="pw-rollwrap">
        <p className="pw-lbl">Who worked this wedding</p>
        <div className="pw-roll">
          {/* ⚠ THE ORDER IS THE DOOR'S, NOT THIS COMPONENT'S. `publicRoll` sorts
              by R-40.7's ruled role order; re-sorting here would be a second home
              for the ruling and the two would drift. Rendered as received.
              Roles with no credit are simply absent (R-G11.7) — never a row
              reading "none". */}
          {roll.map((c, i) => (
            <span className="pw-credit" key={`${c.role}-${i}`}>
              <span className="pw-crole">{c.label}</span>
              {/* A claimed, active vendor is a link to her card; everyone else is
                  a name. NO PHONE REACHES THIS COMPONENT — the door does not put
                  one on the wire (R-G11.6), so there is nothing here to leak. */}
              {c.handle
                ? <a className="pw-cname pw-link" href={`/v/${c.handle}`}>{c.name}</a>
                : <span className="pw-cname">{c.name}</span>}
            </span>
          ))}
        </div>
      </section>

      <footer className="pw-close">
        <span className="pw-close-mark">{wedding.title}</span>
        <span className="pw-colophon">
          {PUBLIC_COLOPHON_LEAD}{' '}
          <a className="pw-colophon-link" href={PUBLIC_COLOPHON_HREF} target="_blank" rel="noopener noreferrer">thedreamwedding.in</a>
        </span>
      </footer>

      <WeddingStyles />
    </main>
  );
}

function WeddingStyles() {
  return (
    <style>{`
:root{color-scheme:light}
.pw{min-height:100vh;background:#F8F7F5;color:#0C0A09;
    font:400 14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;max-width:520px;margin:0 auto;overflow-x:hidden}
.pw *{box-sizing:border-box;margin:0;padding:0}
.pw-miss{font-size:14px;line-height:1.45;color:#403B36;padding:28px 20px;max-width:34ch}
.pw-top{height:40px;display:flex;align-items:center;padding:0 20px;border-bottom:.5px solid rgba(12,10,9,.10)}
.pw-top-name{font-weight:300;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(12,10,9,.72)}
.pw-hero{position:relative;height:300px;overflow:hidden}
.pw-heroimg{width:100%;height:100%;object-fit:cover;display:block}
.pw-tone{position:absolute;inset:0;background:linear-gradient(155deg,#CFC5BA 0%,#B8ABA0 42%,#8F8378 100%)}
.pw-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,10,9,0) 38%,rgba(12,10,9,.62) 100%)}
.pw-identity{position:absolute;left:20px;right:20px;bottom:18px}
.pw-couple{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;font-size:34px;line-height:1.05;color:#F8F7F5}
.pw-meta{font-weight:300;font-size:9px;letter-spacing:.20em;text-transform:uppercase;color:rgba(248,247,245,.82);margin-top:8px}
.pw-strip{display:flex;gap:6px;padding:6px 20px 0}
.pw-stripimg{flex:1;min-width:0;height:56px;object-fit:cover;border-radius:2px;display:block}
.pw-rule{display:flex;align-items:center;gap:10px;padding:22px 20px 18px}
.pw-rule-line{flex:1;height:.5px;background:linear-gradient(90deg,rgba(201,168,76,0) 0%,rgba(201,168,76,.8) 50%,rgba(201,168,76,0) 100%)}
.pw-diamond{color:#C9A84C;font-size:9px;line-height:1}
.pw-rollwrap{padding:0 20px}
.pw-lbl{font-weight:300;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(12,10,9,.55);padding-bottom:14px}
.pw-credit{display:block;padding:11px 0;border-top:.5px solid rgba(12,10,9,.10)}
.pw-credit:first-child{border-top:none}
.pw-crole{font-weight:300;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(12,10,9,.50);display:block}
.pw-cname{font-size:15px;color:#0C0A09;display:block;margin-top:3px}
.pw-link{border-bottom:.5px solid rgba(12,10,9,.30);display:inline-block;padding-bottom:1px;text-decoration:none;color:#0C0A09}
.pw-close{padding:30px 20px 26px;text-align:center;border-top:.5px solid rgba(12,10,9,.10);margin-top:22px}
.pw-close-mark{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;font-size:19px;color:#0C0A09;display:block}
.pw-colophon{font-size:9px;line-height:1.4;color:rgba(12,10,9,.50);display:block;margin-top:9px}
.pw-colophon-link{color:rgba(12,10,9,.50);text-decoration:underline;text-underline-offset:2px}
    `}</style>
  );
}
