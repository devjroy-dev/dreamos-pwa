// app/v/[code]/page.tsx — TDW_19 P2-A §3-2 · THE EARLY STOREFRONT.
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS IS THE ESTATE'S FIRST PUBLIC PER-VENDOR ADDRESS
// ═══════════════════════════════════════════════════════════════════════════
// F-19.14: before P0-B, no per-vendor URL existed anywhere — Discover is a
// shuffled feed with no route param, and `middleware.ts` rewrites only on demo
// hosts. Meanwhile `tdw_referral_invite` is APPROVED AT META with base
// `https://thedreamwedding.in/v/`, so every couple who tapped Share from a
// friend's WhatsApp landed on a framework 404.
//
// P0-B gave the URL a body: a name, a city and one honest sentence, because
// there was nothing else on the wire. **P2-A replaces the body, not the URL** —
// exactly as that seat's header promised — now that the door carries `about`,
// `starting_price` and the vendor's approved photographs.
//
// ── ONE COUPLE-FACING CARD IN THE ESTATE (third band §2-4) ─────────────────
// The prose block below is NOT written here. It is `VendorProfileContent`, the
// same component the Frost deck and the vendor's own preview render, mounted on
// `PROFILE_PALETTE.onCream` instead of `onGlass`. Two profile designs that drift
// is the disease that ruling exists to prevent, and the seam is the palette:
// only the ink moves, because only the ground moved. The type scale, the fonts,
// the margins and the letter-spacing are the deck's, unchanged.
//
// `scripts/tdw19_p2a_profile_core.proof.mjs` §2.2 holds the deck byte-identical
// through the extraction, and §4.4 renders the same fields on both grounds to
// prove the seam is a seam rather than a switch nobody reads.
//
// ── ITS t1 IS ITS OWN, AND NOW IT IS AN ACTUAL h1 ─────────────────────────
// `theme.ts:47` allows one t1 per surface and `WorklistShell` owns it inside the
// app. This route is OUTSIDE the shell — no session, no nav, no medallion — so
// the business name is its own t1. The core renders the name as `h2` by default
// because inside the app the shell owns the title; this page passes
// `nameAs="h1"`, the one prop the component lacked, added at its home per §2-4.
// A page whose entire purpose is to be forwarded into WhatsApp needs a subject.
//
// ── STATIC-FRIENDLY, AND `force-dynamic` IS RETIRED ───────────────────────
// P0-B set `dynamic = 'force-dynamic'` when the body was one sentence and there
// was nothing to cache. There is now. A couple arriving from a WhatsApp forward
// is on a phone on mobile data and has no reason to wait for an origin round
// trip; `revalidate` lets the page be served from the edge and refreshed behind
// her. Five minutes is short enough that a vendor who pauses herself, or an
// admin who approves a photo, sees it within one cup of tea — and
// `discover_paused` is enforced at the DOOR on every revalidation, never cached
// as a decision.
//
// THE SAME `fetch` SERVES BOTH `generateMetadata` AND THE PAGE. Next dedupes
// identical `fetch` calls within one render pass, so the OG tags and the body
// are built from ONE response and cannot describe two different vendors — which
// is the failure mode of fetching twice, not a performance note.

import VendorProfileContent, { PROFILE_PALETTE } from '@/components/shared/VendorProfileContent';

/** Five minutes. See the header. */
export const revalidate = 300;

/**
 * ⚠ THE COPY IS INLINE HERE, AND THE REASON MATTERS.
 * `lib/solutions/copy.ts` is the home for these strings and
 * `docs/COPY_REGISTER_TDW19.md` carries them for the founder's pass. They are
 * repeated as literals in this file because it is a server component on the
 * public edge: importing the copy module would pull `types.ts` and its graph
 * onto a route serving strangers. **If the two ever disagree, `copy.ts` wins** —
 * it is the home, this is a transcription, and the register is where the
 * founder's veto lands.
 *
 * `line` is the P0-B byte, retained for the demo leg and for a vendor with no
 * `about` on file. On a card that now carries her own prose it would be a second
 * voice under the first, so it renders only where there is nothing better.
 */
const COPY = {
  line:     'Takes enquiries through The Dream Wedding.',
  enquire:  'Enquire on WhatsApp',
  unknown:  'This page is no longer available.',
  demoNote: 'This is a demonstration page, built from work published publicly.',
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

type Photo = {
  url: string;
  caption: string | null;
  hero: boolean;
  position: number;
};

/**
 * The wire, nine keys — `src/api/public/vendorCard.js`'s `CARD_KEYS`, whose
 * bench diffs the list (`b44` §2.2). `starting_price` is RUPEES, never paise
 * (c-38.32): the money register formats it directly and 60000 must read
 * `Rs 60,000`.
 */
type Card = {
  business_name: string | null;
  category: string | null;
  city: string | null;
  handle: string;
  is_demo: boolean;
  enquiry_phone: string | null;
  about: string | null;
  starting_price: number | null;
  photos: Photo[];
};

async function fetchCard(code: string): Promise<Card | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v2/public/vendor-card/${encodeURIComponent(code)}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body && body.ok && body.card ? (body.card as Card) : null;
  } catch {
    // A network failure and an unknown handle produce the SAME outcome on
    // purpose. The door already refuses to distinguish absent from paused
    // (b44 §4.4); a page that leaked the difference would undo that at the edge.
    return null;
  }
}

/** The approved set arrives hero-first in `position` order; this names that. */
function heroOf(card: Card): Photo | null {
  const photos = Array.isArray(card.photos) ? card.photos : [];
  return photos.find((p) => p.hero) ?? photos[0] ?? null;
}

/**
 * ── THE LINK PREVIEW IS HALF THE PRODUCT (kickoff §3-4) ────────────────────
 * This page exists because a couple forwards it into a WhatsApp thread. What
 * her friends see there is the OG card, not the page — so an absent `og:image`
 * is not a missing nicety, it is the product failing at the only moment it was
 * built for.
 *
 * A MISS GETS NEUTRAL METADATA AND NO IMAGE. Absent, paused and inactive reach
 * this by the same path they reach the body (the door's one indistinguishable
 * 404), and a title that named a business would answer "does this handle exist?"
 * in a link preview — the enumeration oracle, leaking through metadata instead
 * of through a status code.
 */
export async function generateMetadata(
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const card = await fetchCard(code);

  if (!card) {
    return { title: 'The Dream Wedding', description: COPY.unknown, robots: { index: false } };
  }

  const name = card.business_name || 'The Dream Wedding';
  const place = [card.category, card.city].filter(Boolean).join(' · ');
  const title = place ? `${name} · ${place}` : name;
  // Her own words when she has written any; the standing line otherwise. Never
  // a fabricated summary, and never the money — a price in a link preview is a
  // number out of its register and out of her control.
  const description = (card.about || COPY.line).replace(/\s+/g, ' ').trim().slice(0, 200);
  const hero = heroOf(card);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_BASE}/v/${card.handle}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_BASE}/v/${card.handle}`,
      siteName: 'The Dream Wedding',
      images: hero ? [{ url: hero.url, alt: hero.caption || name }] : [],
    },
    twitter: {
      card: hero ? 'summary_large_image' : 'summary',
      title,
      description,
      images: hero ? [hero.url] : [],
    },
  };
}

export default async function PublicVendorPage(
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const card = await fetchCard(code);

  // ── F-19.19 · THE NEUTRAL PAGE IS RENDERED, NOT DELEGATED ────────────────
  // This was `notFound()`, and with no `app/not-found.tsx` anywhere in the tree
  // that meant Next's raw framework 404 — a developer artefact shown to a couple
  // who tapped a friend's WhatsApp link. The founder walked it and saw exactly
  // that.
  //
  // ABSENT AND PAUSED REACH HERE BY THE SAME PATH, derived not assumed: the door
  // returns its one indistinguishable 404 body for absent, paused AND inactive
  // (`vendorCard.js`, asserted byte-identical by b44 §4.4), and `fetchCard`
  // returns null on any non-ok response. So one branch serves all three, and
  // there is no code path on which they could diverge.
  //
  // IT RENDERS ON THE SAME GROUND AS A REAL CARD — same background, same type,
  // same stylesheet — carrying one sentence. **No status code is visible
  // anywhere**, because "404" tells a couple nothing and tells a curious
  // stranger that the handle space is worth probing. P2-A enriches the card and
  // leaves this branch byte-untouched: the richer the page gets, the more ways a
  // miss could betray itself, and it still betrays none.
  if (!card) {
    return (
      <main className="pv">
        <p className="pv-line">{COPY.unknown}</p>
        <PublicStyles />
      </main>
    );
  }

  const hero = heroOf(card);
  const rest = (card.photos || []).filter((p) => p !== hero);
  const wa = card.enquiry_phone
    ? `https://wa.me/${card.enquiry_phone.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <main className="pv pv-card">
      {/* THE HERO IS HER OWN WORK, AND IT IS THE FIRST THING. A couple arriving
          from a forward is deciding in about a second whether this is for her,
          and no sentence does that job. `loading="eager"` because this image IS
          the page's first paint, not something below it. */}
      {hero && (
        <div className="pv-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.url} alt={hero.caption || card.business_name || ''} loading="eager" />
        </div>
      )}

      <div className="pv-body">
        {/* ── THE ONE COUPLE-FACING CARD, ON CREAM ────────────────────────────
            `onCream` rather than `onGlass`, and `nameAs="h1"` because this page
            is outside the shell. Nothing else differs from what the deck renders.
            `vibeTags` is `[]` and `isBlind` is absent: blind mode is a Frost deck
            feature and a public address has no toggle to hide the identity it
            exists to publish. */}
        <VendorProfileContent
          palette={PROFILE_PALETTE.onCream}
          nameAs="h1"
          fields={{
            name:          card.business_name,
            category:      card.category,
            city:          card.city,
            about:         card.about,
            startingPrice: card.starting_price,
            vibeTags:      [],
          }}
        />

        {/* The standing line renders ONLY where she has written nothing of her
            own. Under her own prose it would be a second voice saying less. */}
        {!card.about && <p className="pv-line">{COPY.line}</p>}

        {/* ⚠ THE BUTTON IS DEMO-ONLY, AND THAT ASYMMETRY IS RULED, NOT ACCIDENTAL.
            Third band §2-5: `public.vendors` has no phone column and no "number
            is public" flag — a vendor's number lives on `public.users.phone`, and
            publishing it because a button needed a target would put a personal
            WhatsApp number on an open URL on the strength of a choice she was
            never asked to make. `demo_vendors.whatsapp_phone` is a business's own
            public Instagram contact and this page states it is a demo. A real
            vendor gets this button when a `public_contact_phone` is chartered
            with her explicit consent — priced into P2 proper, not invented here.
            The door already enforces it: `enquiry_phone` is null for every real
            vendor (b44 §2.5), so this is the shape of a ruling, not its guard. */}
        {wa && (
          <a className="pv-cta" href={wa} target="_blank" rel="noopener noreferrer">
            {COPY.enquire}
          </a>
        )}

        {card.is_demo && <p className="pv-demo">{COPY.demoNote}</p>}
      </div>

      {/* THE REST OF THE APPROVED SET, in `position` order, hero excluded.
          A strip and not a carousel: a carousel needs state, state needs a client
          component, and a client component drags a hydration bundle onto a route
          whose whole virtue is arriving instantly for a stranger. Scrolling is a
          gesture every phone already knows. */}
      {rest.length > 0 && (
        <div className="pv-strip">
          {rest.map((p) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={`${p.position}-${p.url}`} src={p.url} alt={p.caption || ''} loading="lazy" />
          ))}
        </div>
      )}

      <PublicStyles />
    </main>
  );
}

/**
 * ONE STYLESHEET FOR BOTH BRANCHES. The neutral page must sit on the SAME
 * ground as a real card (F-19.19) — a second copy of these rules is a second
 * ground that drifts the first time one is edited.
 *
 * Graphite & Signal, transcribed rather than imported — see the copy note.
 * No webfont is loaded: a stranger on a phone gets the system stack instantly
 * rather than a flash of nothing while two files download. The core's own type
 * comes through its inline styles, which is what keeps it one card with the
 * deck; these rules are the page's ground and layout only.
 *
 * Mobile-first at 390. The column caps at 430 so a desktop reader gets the
 * phone's composition rather than a stretched one — this page is read on a
 * phone, in a thread, and designing for the other case would cost the case it
 * was built for.
 */
function PublicStyles() {
  return (
    <style>{`
.pv{min-height:100vh;background:#F8F7F5;color:#0C0A09;
  font:400 14px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.pv:not(.pv-card){display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;padding:32px 24px;text-align:center}
.pv-card{max-width:430px;margin:0 auto;padding:0 0 48px}
.pv-hero{width:100%;aspect-ratio:4/5;overflow:hidden;background:#EFECE7}
.pv-hero img{width:100%;height:100%;object-fit:cover;display:block}
.pv-body{padding:24px 24px 0}
.pv-line{font:400 14px/1.45 inherit;color:#403B36;margin:8px 0 0;max-width:34ch}
.pv:not(.pv-card) .pv-line{margin:0;max-width:34ch}
.pv-cta{margin-top:20px;display:inline-flex;align-items:center;min-height:44px;
  padding:12px 20px;border:.5px solid #C9A84C;border-radius:2px;color:#8A6F1F;
  text-decoration:none;font:500 12px/1.4 inherit;letter-spacing:.04em;
  touch-action:manipulation}
.pv-cta:active{background:#F2EFE9}
.pv-cta:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-demo{font:400 11px/1.4 inherit;color:#8A837C;margin:18px 0 0;max-width:36ch}
.pv-strip{display:flex;gap:8px;overflow-x:auto;padding:28px 24px 0;
  scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.pv-strip img{flex:0 0 72%;aspect-ratio:4/5;object-fit:cover;display:block;
  background:#EFECE7;scroll-snap-align:start}
    `}</style>
  );
}
