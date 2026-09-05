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
import { PUBLIC_MISS, PUBLIC_COLOPHON_LEAD, PUBLIC_COLOPHON_HREF,
         PUBLIC_GALLERY_LABEL, PUBLIC_DOWNLOAD } from '@/lib/public/copy';

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

/**
 * THE ARCHIVE, RESOLVED SERVER-SIDE — R-G12.17.
 *
 * The download door 303s here with an OPAQUE token. This function trades it for
 * the signed archive URL on the server, so that URL reaches the guest only as an
 * href she follows once: never the address bar, never a history entry, never a
 * screenshot. A Cloudinary archive URL carries its own signature, and one shared
 * screenshot would hand out a couple's whole wedding.
 *
 * The door re-answers consent on every resolve, so a couple who withdraws between
 * the form post and the tap gets a miss here — the token proves WHICH WEDDING,
 * never that the wedding still serves.
 */
async function resolveArchive(code: string, slug: string, token: string): Promise<string | null> {
  try {
    const r = await fetch(
      `${API_BASE}/api/v2/public/wedding-download/${encodeURIComponent(code)}/${encodeURIComponent(slug)}`
      + `/archive/${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    );
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.ok && typeof j.url === 'string' ? j.url : null;
  } catch {
    return null;
  }
}

export default async function PublicWeddingPage(
  { params, searchParams }: {
    params: Promise<{ code: string; slug: string }>;
    searchParams: Promise<{ sent?: string; dl?: string }>;
  },
) {
  const { code, slug } = await params;
  const q = await searchParams;
  const data = await fetchWedding(code, slug);

  if (!data) {
    return (
      <main className="pw">
        <p className="pw-miss">{PUBLIC_MISS}</p>
        <WeddingStyles />
      </main>
    );
  }

  // ── THE ANSWER RENDER — R-G12.17 / R-40.47 ────────────────────────────────
  // A SECOND RENDER OF THE SAME LEAF, on a state param. Not a new address: the
  // guest stays where she was and the page she already trusts answers her.
  //
  // ⚠ STILL NO CLIENT BUNDLE. The archive is resolved on the server and the tap
  // is a plain anchor — this page's refusal at :35-38 survives the whole of G1.2.
  if (q.sent === '1' || q.sent === '0') {
    const url = q.sent === '1' && q.dl ? await resolveArchive(code, slug, q.dl) : null;
    return (
      <main className="pw">
        <header className="pw-top"><span className="pw-top-name">{data.owner.business_name}</span></header>
        <div className="pw-done">
          {url ? (
            <>
              <p className="pw-doneh">{PUBLIC_DOWNLOAD.readyHead}</p>
              {/* `download` asks the browser to save rather than navigate, and
                  `rel=noopener` because this leaves for another origin. */}
              {/* ⚠ `download` IS DECORATIVE HERE AND THE COMMENT THAT CLAIMED
                  OTHERWISE IS CORRECTED. The attribute is IGNORED on a
                  cross-origin URL by every browser — what actually saves the
                  file is Cloudinary's own `Content-Disposition: attachment`,
                  which `mode=download` sets. It is kept because it costs nothing
                  and is correct if the asset ever becomes same-origin; the claim
                  that it "asks the browser to save" was simply wrong. */}
              <a className="pw-donecta" href={url} download rel="noopener noreferrer">
                {PUBLIC_DOWNLOAD.readyCta}
              </a>
              {/* R-40.50 · the expectation, set before the tap. The page cannot
                  acknowledge the tap afterwards (F-40.108), so it says where the
                  file goes instead. */}
              <p className="pw-donefine">{PUBLIC_DOWNLOAD.readyFine}</p>
            </>
          ) : (
            // ONE SENTENCE FOR EVERY FAILURE. A missing secret, a withdrawn
            // consent and an expired token all read the same — a page that told
            // them apart would tell a prober apart too.
            <p className="pw-doneh">{PUBLIC_DOWNLOAD.readyFailed}</p>
          )}
        </div>
        <WeddingStyles />
      </main>
    );
  }

  const { wedding, owner, roll, photos } = data;
  const hero = photos[0] ?? null;
  // EVERY photograph after the hero. The four-item strip was G1.1's, when this
  // page had no gallery to be; G1.2 is the gallery, so the slice goes.
  const gallery = photos.slice(1);

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

      {/* ── THE GUEST GALLERY ────────────────────────────────────────────────
          Every photograph after the hero, not a four-item strip. A guest who
          scrolls the whole wedding has already been given the proof; the ask
          comes AFTER it, which is this block's entire thesis ("the wedding is
          the ad"). Still no client component: these are anchors and images.

          ⚠ THE ANCHORS OPEN THE ASSET IN THE BROWSER'S OWN VIEWER, which is what
          the card leaf's own ruling calls the zero-byte lightbox — pinch, rotate,
          save and share on every device for nothing. The card leaf traded it for
          a CSS radio gallery because it had a HERO to swap; this page's gallery
          is a grid with no selected state, so there is nothing to swap and the
          browser's viewer is strictly better than a cascade trick here. */}
      {gallery.length ? (
        <div className="pw-gwrap">
          <p className="pw-lbl">{PUBLIC_GALLERY_LABEL}</p>
          <div className="pw-grid">
            {gallery.map((p) => (
              <a key={p.url} className="pw-gcell" href={p.url} target="_blank" rel="noopener noreferrer">
                <img className="pw-gimg" src={p.url} alt="" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── THE DOWNLOAD ─────────────────────────────────────────────────────
          A SHEET WITHOUT A SCRIPT: `<details>` / `<summary>` — R-G12.16.
          The `<summary>` IS the download door; the form is its content, closed
          until she taps. That keeps the frame the founder ratified (a door, then
          a sheet) while honouring R-G12.10's refusal of a client bundle: the
          open/close is the browser's own, not ours, and THE GUEST'S NUMBER NEVER
          TOUCHES JAVASCRIPT.

          My first cut shipped the form inline and declared the deviation. The
          chair's amendment is better and it costs nothing: `<details>` needs only
          `list-style:none` plus the `-webkit-details-marker` reset to lose its
          triangle, which is the documented way to restyle a summary and not a
          hack — no `appearance`, no absolute positioning, no height juggling. It
          renders at 374 as drawn.

          ⚠ THREE INPUTS, ONE QUESTION — R-G12.15. Master §7 refuses a form of
          QUESTIONS. Her number and her month are fields she fills to get her
          photographs; the one thing asked OF her is the checkbox, and it is
          unticked — silence never means yes, and neither does a pre-ticked box.

          ⚠ THE MONTH IS OPTIONAL AND SAYS SO. A guest who leaves it blank
          downloads all the same and lands with `wedding_date` NULL. "A lead with
          a date" is what this sheet makes possible, never what it forces. */}
      {photos.length ? (
        <details className="pw-dlwrap">
          <summary className="pw-dlbtn">{PUBLIC_DOWNLOAD.door}</summary>
          <form className="pw-dl" method="POST"
                action={`${API_BASE}/api/v2/public/wedding-download/${encodeURIComponent(code)}/${encodeURIComponent(slug)}`}>
            <p className="pw-dlh">{PUBLIC_DOWNLOAD.head(photos.length)}</p>
            <p className="pw-dlsub">{PUBLIC_DOWNLOAD.sub}</p>

            <label className="pw-fl" htmlFor="pw-phone">{PUBLIC_DOWNLOAD.phoneLabel}</label>
            <input className="pw-fi" id="pw-phone" name="phone" type="tel"
                   inputMode="tel" autoComplete="tel" required placeholder="+91" />

            <label className="pw-fl" htmlFor="pw-month">{PUBLIC_DOWNLOAD.monthLabel}</label>
            {/* `type="month"` gives a native picker on a phone and degrades to a
                text box everywhere else; the door parses `YYYY-MM` either way and
                refuses anything that is not. */}
            <input className="pw-fi" id="pw-month" name="wedding_month" type="month"
                   placeholder={PUBLIC_DOWNLOAD.monthPlaceholder} />

            <label className="pw-ask">
              <input className="pw-box" type="checkbox" name="may_contact" value="true" />
              <span className="pw-askl">{PUBLIC_DOWNLOAD.mayContact(owner.business_name)}</span>
            </label>

            <button className="pw-shcta" type="submit">{PUBLIC_DOWNLOAD.cta}</button>
            <p className="pw-shfine">{PUBLIC_DOWNLOAD.fine}</p>
          </form>
        </details>
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
/* ── THE GALLERY ────────────────────────────────────────────────────────────
   .pw-strip / .pw-stripimg RETIRED WITH THEIR READER (G1.2): the four-item
   strip was G1.1's stand-in for a gallery this page did not yet have. A rule
   whose only reader is deleted is a commented corpse if it stays. */
.pw-gwrap{padding:14px 20px 0}
.pw-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:10px}
.pw-gcell{display:block;aspect-ratio:1;border-radius:2px;overflow:hidden;position:relative}
.pw-gimg{width:100%;height:100%;object-fit:cover;display:block}

/* ── THE DOWNLOAD: A SHEET WITHOUT A SCRIPT (R-G12.16) ──────────────────────
   The details/summary pair gives the ratified frame — a door, then a sheet —
   with the open/close owned by the browser. The two lines that lose the
   disclosure triangle are the documented reset, not a hack: list-style:none
   covers every modern engine and the -webkit-details-marker pseudo covers older
   Safari, which is exactly the phone this page is opened on.

   NO BACKTICKS IN THIS BLOCK: it lives inside a template literal, and a pair of
   them closed it silently on an earlier cut — tsc caught it as forty JSX errors
   nowhere near the cause. */
.pw-dlwrap{margin:22px 20px 0}
.pw-dlbtn{list-style:none;display:block;width:100%;min-height:48px;padding:15px 0;background:#0C0A09;color:#F8F7F5;
          border-radius:2px;text-align:center;font-weight:300;font-size:11px;letter-spacing:.20em;
          text-transform:uppercase;cursor:pointer}
.pw-dlbtn::-webkit-details-marker{display:none}
.pw-dl{margin-top:10px;padding:20px;background:#FFFDFB;border:.5px solid rgba(12,10,9,.13);border-radius:4px}
.pw-dlh{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;font-size:24px;line-height:1.14;color:#0C0A09}
.pw-dlsub{font-size:13px;line-height:1.55;color:rgba(12,10,9,.66);margin-top:8px}
.pw-fl{display:block;font-weight:300;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(12,10,9,.55);margin-top:18px}
.pw-fi{width:100%;min-height:44px;border:.5px solid rgba(12,10,9,.26);border-radius:2px;background:#F8F7F5;
       margin-top:7px;padding:0 12px;font-size:16px;color:#0C0A09;font-family:inherit}
/* 16px on the inputs deliberately: iOS Safari zooms the viewport on focus for
   anything smaller, and a stranger on a phone should not have the page jump. */
.pw-ask{display:flex;gap:11px;align-items:flex-start;margin-top:20px;padding-top:16px;
        border-top:.5px solid rgba(12,10,9,.12);cursor:pointer}
.pw-box{flex-shrink:0;width:19px;height:19px;margin-top:1px;accent-color:#0C0A09}
/* THE INK, NOT THE GOLD. My first cut accented this box gold and b42 reddened:
   this page spends its one gold on the section rule and nowhere else, which is
   the leaf's own ruling and stricter than the house 3x cap. The ink also matches
   the submit button the box sits above. */
.pw-askl{font-size:14px;line-height:1.5;color:#0C0A09}
.pw-shcta{margin-top:22px;width:100%;min-height:48px;padding:14px 0;background:#0C0A09;color:#F8F7F5;border:none;
          border-radius:2px;font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;
          font-family:inherit;cursor:pointer}
.pw-shfine{font-size:11px;line-height:1.5;color:rgba(12,10,9,.50);margin-top:12px;text-align:center}
/* ── THE ANSWER RENDER (R-40.47) ────────────────────────────────────────────
   Centred on the same cream ground as the page she came from, because it IS
   that page. NO BACKTICKS IN THIS BLOCK (e-7/e-8). */
.pw-done{flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 26px}
.pw-doneh{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;
          font-size:26px;line-height:1.16;color:#0C0A09}
.pw-donecta{margin-top:26px;display:block;width:100%;padding:15px 0;background:#0C0A09;color:#F8F7F5;
            border-radius:2px;text-align:center;font-weight:300;font-size:11px;letter-spacing:.20em;
            text-transform:uppercase;text-decoration:none}
/* ── R-G12.19 · THE PRESS STATE ─────────────────────────────────────────────
   THE FOUNDER'S WORDS: "on phone dont even feel like im clicking." A tap target
   with no pressed state gives a phone nothing between touch and result, and this
   leaf has no script to fill the gap. CSS can, for free.
   The webkit tap-highlight is set to transparent because iOS paints its own grey
   flash over the top otherwise, which would fight this and read as a bug.
   (No backticks around that property name: this block is inside a template
   literal and a pair of them closes it silently. Third time this sitting, and
   twice inside the warning about it — which is why C18 is a CELL and not a
   comment. The cell catches what the comment plainly does not.)
   NO BACKTICKS IN THIS BLOCK — it lives inside a template literal (e-7/e-8). */
.pw-donecta{-webkit-tap-highlight-color:transparent}
.pw-donecta:active{background:#2A2523;transform:scale(.985)}
.pw-donefine{margin-top:12px;font-size:11px;line-height:1.5;color:rgba(12,10,9,.50);text-align:center}
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
