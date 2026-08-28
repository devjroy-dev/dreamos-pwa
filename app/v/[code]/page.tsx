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
  about: string | null;
  starting_price: number | null;
  photos: Photo[];
  /** W-1's cure (c-38.37). The house link for a real vendor, her own deep link
   *  for a demo — built at the door, off `shapeVendor.js`'s ENQUIRE_BASE.
   *
   *  ⚠ THE WIRE'S `enquiry_phone` IS DELIBERATELY ABSENT FROM THIS TYPE. It is
   *  still on the card (b44 asserts it) as the demo leg's raw datum, but this
   *  page must never build a wa.me target from a phone number — that is the code
   *  path by which a personal number would one day reach an open URL. A type
   *  that declares a field nobody may read is an invitation; this one does not
   *  offer it. One contact field, one home, and `bs_audit` C32 keeps it so. */
  enquire_link: string | null;
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
  const wa = card.enquire_link;

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
          {/* The wordmark over her work, and the gradient that dissolves the
              photograph INTO the page. W-4: the old cut stopped the image at a
              hard edge against a white block, which is why it read as stacked
              boxes rather than as one composition. Both are the demo studio's,
              inverted for cream. */}
          <div className="pv-mark">
            <span className="pv-mark-name">The Dream Wedding</span>
            <span className="pv-mark-sub">India&apos;s First Wedding OS</span>
          </div>
          <div className="pv-fade" />
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

        {/* ── W-1 · EVERY VENDOR GETS THIS BUTTON NOW (c-38.37) ────────────────
            The founder walked the page and found nothing to tap. A storefront a
            couple cannot act on is a brochure, and `tdw_referral_invite` lands
            her here at her HIGHEST intent.

            The third band §2-5 was right about the question it answered — a
            vendor's personal number must not be published without her consent —
            and this seat read that as "no contact", which does not follow. The
            chair filed c-38.37 against the ruling: it answered the disclosure
            question and never asked what the page was for.

            NO NUMBER IS PUBLISHED. `enquire_link` for a real vendor is TDW's own
            WhatsApp line with her handle in the message body, built at the door
            off `shapeVendor.js`'s `ENQUIRE_BASE` — the exact link every Enquire
            tap in the Frost deck has used since TDW_07. Donna routes from there.
            A demo vendor keeps its own published contact. The asymmetry did not
            disappear; it narrowed to its honest remainder. */}
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
      {/* The gold rule — the studio's section break, brightest beside the
          diamond and dying at the margin. It is what gives the page a rhythm
          instead of a stack, and it tells a reader that what follows is a
          different movement rather than more of the same. */}
      {rest.length > 0 && (
        <div className="pv-rule"><span className="pv-rule-line" /><span className="pv-diamond">◆</span><span className="pv-rule-line" /></div>
      )}

      {rest.length > 0 && (
        <div className="pv-strip">
          {rest.map((p) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={`${p.position}-${p.url}`} src={p.url} alt={p.caption || ''} loading="lazy" />
          ))}
        </div>
      )}

      {/* THE CLOSE. W-4: the old cut's last photograph simply stopped and the
          document ended, so nothing told a couple she had reached the bottom of
          something made on purpose. The studio signs off; so does this. */}
      <footer className="pv-close">
        <span className="pv-close-mark">The Dream Wedding</span>
      </footer>

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
/* ── THE ARRIVAL (W-4) ──────────────────────────────────────────────────────
   The walk's verdict was that the page "starts abruptly, ends abruptly, has
   nothing… no transition." It was true: the old cut had no @keyframes at all.

   ⚠ THE REASONING THAT PRODUCED THAT, STATED SO IT IS NOT REPEATED. This route
   refuses a client component — a carousel needs state, state needs hydration,
   and a hydration bundle on a page serving strangers is a real cost. That
   refusal was CORRECT about the carousel and was then over-applied to
   everything that moved. CSS animation needs no JavaScript, no state and no
   hydration; a server component can arrive beautifully at zero client cost.
   The whole sitting had optimised for instant first paint and produced a page
   that arrives instantly and feels like nothing arrived.

   Ported from app/demo/vendor/[handle] rather than re-invented — same easing,
   same 10px lift, same staggered delays — so the estate's two vendor
   presentations cannot drift into two houses. "both" fill so nothing flashes
   before its delay elapses. */
@keyframes pvRise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes pvIn   { from{opacity:0} to{opacity:1} }

.pv{min-height:100vh;background:#F8F7F5;color:#0C0A09;
  font:400 14px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.pv:not(.pv-card){display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;padding:32px 24px;text-align:center}
.pv-card{max-width:430px;margin:0 auto;padding:0 0 8px}

/* ── THE HERO'S HEIGHT IS DERIVED, NOT CHOSEN (W-2) ─────────────────────────
   CE-38's requirement, verbatim: the hero must leave the name and city visible
   without scrolling on a 390 column. So the number falls out of arithmetic
   rather than taste, and the arithmetic is here to be checked.

     the first text block below the hero, measured from the core's own styles:
       24px  .pv-body padding-top
       13px  eyebrow  (9px Jost, line-height ~1.4)
        8px  eyebrow margin-bottom
       31px  name     (28px Cormorant, line-height 1.1)
       ────
       76px  to the name's baseline
      +64px  breathing, so the name is not jammed against the fold edge
       ────
      140px  reserved below the hero

   → height: calc(100svh - 140px). "svh" and not "vh" because "vh" on iOS is the
   LARGE viewport and ignores the browser chrome, which is exactly the 100px
   that would push the name off the screen this rule exists to keep it on.

   The 420px cap is the second half of the requirement. On a tall phone
   100svh-140 is ~560px, which passes the arithmetic and still fills the screen
   with one photograph — which is the "too big" the walk actually reported.
   Checked at both ends: 375x667 → min(410,420)=410, name lands at 486 of ~550
   usable; 390x844 → min(560,420)=420, name at 496 of ~700. */
.pv-hero{position:relative;width:100%;height:min(calc(100svh - 140px), 420px);
  min-height:240px;overflow:hidden;background:#EFECE7;
  animation:pvIn 900ms cubic-bezier(0.22,1,0.36,1) both}
.pv-hero img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.pv-mark{position:absolute;top:calc(env(safe-area-inset-top,0px) + 20px);left:22px;z-index:2;
  display:flex;flex-direction:column;gap:5px;pointer-events:none;
  animation:pvIn 1200ms cubic-bezier(0.22,1,0.36,1) 300ms both}
.pv-mark-name{font:italic 300 15px/1 "Cormorant Garamond",Georgia,serif;
  color:rgba(248,247,245,0.9);letter-spacing:.02em;text-shadow:0 1px 6px rgba(0,0,0,.4)}
.pv-mark-sub{font:400 6px/1 inherit;letter-spacing:.38em;text-transform:uppercase;
  color:rgba(201,168,76,.9);text-shadow:0 1px 4px rgba(0,0,0,.5)}
/* The photograph dissolves into the page instead of stopping at an edge. */
.pv-fade{position:absolute;left:0;right:0;bottom:0;height:38%;pointer-events:none;
  background:linear-gradient(to top,#F8F7F5 0%,rgba(248,247,245,.55) 45%,transparent 100%)}

.pv-body{padding:8px 24px 0;animation:pvRise 700ms cubic-bezier(0.22,1,0.36,1) 220ms both}
.pv-line{font:400 14px/1.45 inherit;color:#403B36;margin:8px 0 0;max-width:34ch}
.pv:not(.pv-card) .pv-line{margin:0;max-width:34ch}
.pv-cta{margin-top:22px;display:inline-flex;align-items:center;min-height:44px;
  padding:12px 22px;border:.5px solid #C9A84C;border-radius:2px;color:#8A6F1F;
  text-decoration:none;font:500 12px/1.4 inherit;letter-spacing:.04em;
  touch-action:manipulation;animation:pvRise 700ms cubic-bezier(0.22,1,0.36,1) 420ms both}
.pv-cta:active{background:#F2EFE9}
.pv-cta:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-demo{font:400 11px/1.4 inherit;color:#8A837C;margin:18px 0 0;max-width:36ch}

/* The section break. Brightest beside the diamond, dying at the margin — the
   studio's own reversal, after its first cut faded to nothing at the centre and
   left the diamond reading as a stray dot. */
.pv-rule{display:flex;align-items:center;gap:10px;margin:30px 24px 0;
  animation:pvIn 900ms cubic-bezier(0.22,1,0.36,1) 560ms both}
.pv-rule-line{flex:1;height:1px}
.pv-rule-line:first-child{background:linear-gradient(to left,rgba(201,168,76,.5),rgba(201,168,76,0))}
.pv-rule-line:last-child{background:linear-gradient(to right,rgba(201,168,76,.5),rgba(201,168,76,0))}
.pv-diamond{font:9px/1 "Cormorant Garamond",Georgia,serif;color:rgba(201,168,76,.85)}

/* ── THE STRIP IS A GLANCE, NOT A SECOND SLIDESHOW (W-2) ────────────────────
   The old cut used flex:0 0 72% at 4/5, so each thumbnail was ~280x350 and the
   strip read as another full-height gallery under the first one. 104px wide is
   a hint that more exists, which is the job. */
.pv-strip{display:flex;gap:8px;overflow-x:auto;padding:18px 24px 0;
  scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;
  scrollbar-width:none;animation:pvRise 700ms cubic-bezier(0.22,1,0.36,1) 640ms both}
.pv-strip::-webkit-scrollbar{display:none}
.pv-strip img{flex:0 0 104px;aspect-ratio:4/5;object-fit:cover;display:block;
  background:#EFECE7;scroll-snap-align:start}

/* The close. Something made on purpose ends on purpose. */
.pv-close{margin-top:40px;padding:0 24px 32px;text-align:center;
  animation:pvIn 900ms cubic-bezier(0.22,1,0.36,1) 760ms both}
.pv-close-mark{font:italic 300 13px/1 "Cormorant Garamond",Georgia,serif;
  color:#A8A29B;letter-spacing:.02em}

/* ⚠ MOTION IS AN ENHANCEMENT, NEVER A GATE. Everything above animates from
   opacity 0, so a reader who has asked their phone to stop moving things must
   still get the whole page. Without this rule, "both" fill would hold them
   invisible forever. */
@media (prefers-reduced-motion: reduce){
  .pv-hero,.pv-mark,.pv-body,.pv-cta,.pv-rule,.pv-strip,.pv-close{animation:none}
}
    `}</style>
  );
}
