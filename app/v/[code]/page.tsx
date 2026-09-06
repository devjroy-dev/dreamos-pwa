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

import VendorProfileContent, { PROFILE_PALETTE, HERO_PALETTE } from '@/components/shared/VendorProfileContent';
import { heroSelectRules } from '@/lib/public/heroSelectRules.mjs';
// R-G11.15 · the two bytes this leaf shares with the wedding page now live in
// one home. Nothing is re-voiced; these read exactly as they read before.
import { PUBLIC_MISS, PUBLIC_COLOPHON, PUBLIC_COLOPHON_LEAD, PUBLIC_ENQUIRE_LABEL } from '@/lib/public/copy';

/** Five minutes. See the header. */
export const revalidate = 300;

/**
 * ── THIS ROUTE DECLARES ITS OWN CHROME — F-19.41 and F-19.42 ───────────────
 *
 * **F-19.41 · `themeColor`.** `app/layout.tsx:76` sets a STATIC
 * `<meta name="theme-color" content="#1E0A0E">` — the app's near-black — and
 * the inline script below it overrides that per lane, with branches for vendor,
 * frost and landing. `/v/` and `/r/` match none, so a public storefront was
 * inheriting the app's chrome: on a phone, a near-black status bar above a cream
 * page. A couple arriving from a WhatsApp forward got the shell's colour on a
 * page that is not the shell.
 *
 * This is F-19.36's class, correctly located. That finding was the root layout
 * registering an origin-wide service worker and claiming these routes; this is
 * the same file handing them browser chrome. **One file, two leaks, one shape:
 * the root layout does not know that some of its children are not the app.**
 * `bs_audit` C38 now refuses any app-lane metadata on a public route, so the
 * third instance announces itself instead of shipping.
 *
 * **F-19.42 · `colorScheme`.** The founder photographed the miss page rendering
 * on a dark ground. The seat named the root layout's background script as the
 * cause and the probe refused it — `document.documentElement.style.background`
 * was `null` on both branches, and `.pv` computed cream on both. The page was
 * correct.
 *
 * What was missing was a DECLARATION. With `color-scheme` unset and `html`/`body`
 * transparent, nothing tells the browser this ground was chosen, and Chrome's
 * auto-dark heuristics invert an undeclared light document. Device emulation
 * does not apply them, which is why the seat's captures and the founder's
 * disagreed about the same URL on the same deployment.
 *
 * **The defect was never a wrong value; it was an absent one** — which is
 * precisely what a value-checking cell cannot see, and why C38 asserts the
 * declaration exists rather than checking what it says.
 */
export const viewport = {
  themeColor: '#F8F7F5',
  colorScheme: 'light' as const,
};

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
  // ⚠ HOISTED TO `lib/public/copy.ts` (G1.3). The wedding roll's door carries
  // the same byte, and two identical literals are identical only until someone
  // edits one. Read, never re-typed — the colophon's precedent, R-G11.15.
  enquire:  PUBLIC_ENQUIRE_LABEL,
  /** R-G11.15: hoisted to `lib/public/copy.ts`; both public leaves read it. */
  unknown:  PUBLIC_MISS,
  demoNote: 'This is a demonstration page, built from work published publicly.',
  /** D-19.1 §2, founder-amended. TDW appears on this page EXACTLY ONCE, as a
   *  credit line at the foot — no logo, no gold, no rule of its own. The page
   *  opens on her name and closes on it; this sits under the close, smaller.
   *  PROPOSED, on the register, awaiting the founder's pass. */
  colophon: PUBLIC_COLOPHON,
  /** The same byte, split at the address so it can be a link. The register
   *  carries the whole line; if the two ever disagree, the register wins. */
  colophonLead: PUBLIC_COLOPHON_LEAD,
};

/**
 * G2 · THE SEAL'S MARK. Founder-ratified as proposed, R-40.42 row 15.
 *
 * A CONSTANT AND NOT A `COPY` MEMBER, for the same reason the block above gives
 * for being literals at all: this is a server component on the public edge and
 * the copy module would drag `types.ts` and its graph onto a route serving
 * strangers. `lib/worklist/googleReviews.ts` carries `sealMark` as the vendor
 * side's home; **if the two ever disagree, the veto sheet wins.**
 *
 * The facts line beside it is BUILT INLINE here rather than imported from
 * `sealFacts` for that same edge reason — and the two are asserted identical by
 * a cell rather than by this sentence.
 */
const SEAL_MARK = 'TDW-verified';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

/**
 * ── THE PAGE NAMES ITS OWN BUILD — W2-6's permanent cure ───────────────────
 * Two walks in two sittings were run against deployment-hash URLs nobody had
 * confirmed carried the commit under test. The first burned four exchanges on a
 * `/v/` route that did not exist in the build being opened; the second produced
 * two findings (W2-2, W2-3) that closed as unattributable because the build
 * could not be identified after the fact.
 *
 * A walk now begins by reading the commit off the page itself. Vercel injects
 * `VERCEL_GIT_COMMIT_SHA` at build time; `unknown` locally, which is honest — a
 * dev server is not a deploy and should not claim to be one.
 *
 * **A finding on a page whose build cannot be named is filed as unattributable,
 * not chased.** That is the standing rule this tag exists to make cheap.
 */
const BUILD = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
  ?? process.env.VERCEL_GIT_COMMIT_SHA
  ?? 'unknown';

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
  /** ── G2 · R-G2.9 — THE SEAL, AN OBJECT OR NULL, NEVER A PARTIAL ─────────
   *  Under three delivered weddings there is no seal at all, and the ABSENCE IS
   *  THE ANSWER: a couple must not be able to tell an unverified studio from one
   *  whose seal has not been computed yet, so the band does not render rather
   *  than rendering greyed. The door has already applied that rule
   *  (`sealIsVisible`, one home beside the computation); this page does not
   *  re-decide it and does not know what three means.
   *
   *  `delivery_days` MAY BE NULL — an all-back-catalogue studio has no wedding
   *  day to measure from, and null means NOT MEASURABLE, never zero. Zero would
   *  read as same-day delivery.
   *
   *  NO `rating` FIELD (R-G2.2): no source for one exists until GBP, and a null
   *  rating on the wire is an invitation to render an empty star row. */
  seal: { weddings: number; delivery_days: number | null } | null;
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
    // The miss names the build too — a walk of the miss must be attributable on
    // the same terms as a walk of the card. It carries nothing else: no name, no
    // image, not indexed.
    return { title: 'The Dream Wedding', description: COPY.unknown, other: { 'tdw-build': BUILD }, robots: { index: false } };
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
    other: { 'tdw-build': BUILD },
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
  // ── ONE ORDERED SET, AND `rest` RETIRES WITH ITS READER — F-19.p2, arm (a) ──
  // This was `rest = photos.filter(p => p !== hero)`: the strip showed every
  // photograph EXCEPT the hero, which was correct while a thumbnail was a link
  // to its own file and the hero was already open in front of you.
  //
  // Under F-19.44 a thumbnail SELECTS the hero, and that made the exclusion a
  // trap: tap thumbnail 2 and the first photograph has no control anywhere on
  // the page that brings it back. CE-39 ruled arm (a) — the strip renders ALL
  // of them, the hero's own thumbnail among them, checked by default.
  //
  // ONE array feeds three things — the radios, the hero stack and the strip —
  // so `i` means the same photograph in all three and the generated CSS can
  // address it. Two arrays would be two orderings the first time one is edited.
  const gallery = hero
    ? [hero, ...(card.photos || []).filter((p) => p !== hero)]
    : [];
  const wa = card.enquire_link;

  return (
    <main className="pv pv-card">
      {/* ── THE PAGE HAS A TOP — W3-5, chair-ruled ──────────────────────────
          "theres no top of the page in the pwa. starts abruptly with a picture."
          Reported twice about the same edge: walk #1's "starts abruptly, ends
          abruptly" was answered at the FOOT and the head was left as it was,
          because D-19.1 struck the TDW wordmark from the hero and this seat read
          that as "nothing stands above the image."

          Too literal. The ruling was that TDW does not caption HER photograph —
          not that her page opens with no threshold. So a 40px cream band carries
          HER studio name and the document begins on a made edge.

          Her name is here at 11px and again at t1 over the hero, and the
          repetition is deliberate: this is a masthead, that is the page's
          subject. A reader scrolled past the hero still knows whose page it is. */}
      <header className="pv-top">
        <span className="pv-top-name">{card.business_name}</span>
      </header>

      {/* THE HERO IS HER OWN WORK, AND IT IS THE FIRST THING. A couple arriving
          from a forward is deciding in about a second whether this is for her,
          and no sentence does that job. `loading="eager"` because this image IS
          the page's first paint, not something below it. */}
      {/* ── THE HERO CARRIES THE VENDOR, NOT TDW — D-19.1 §1 ────────────────────
          S4 put the TDW wordmark over her photograph and the founder could not
          read it. The seat's diagnosis was that the scrim had not been ported
          with the element; the chair's ruling went further and struck the
          premise: **no scrim recipe makes white type reliably legible over an
          arbitrary photograph**, and more to the point, *this is her page and
          TDW does not caption her photograph.*

          What rises out of the scrim is HER identity, rendered by the SAME
          component that renders the card below — `parts="identity"` on
          `HERO_PALETTE`. Not a second heading hand-written over the image: that
          would be the second profile design arriving by the back door. */}
      {/* ── F-19.44 · A PHOTOGRAPH DISPLACES THE HERO, AND NO JAVASCRIPT RUNS ────
          The founder's ruling, 2026-08-29, verbatim: *"clicking any picture
          should displace the hero picture at the top."*

          THIS SUPERSEDES CE-38's SHAPE (1), AND THE SHAPE IT SUPERSEDES IS WORTH
          KEEPING ON THE RECORD, because it was not wrong for bad reasons. Each
          photograph used to be an anchor to its own Cloudinary file, and the
          BROWSER's own viewer did the zooming — pinch, rotate, save, share, on
          every device, for zero bytes. CE-38 chose it over a CSS `:target`
          lightbox because back-button weirdness on a stranger's phone is a worse
          product than an honest link. **That capability is deleted here**, named
          so the loss is on the record and not discovered on a later walk: the
          browser viewer goes, and §7d P2-B's swipe viewer is its successor,
          `lib/frost/photoPager.ts` still named as the reuse.

          WHAT REPLACES IT NEEDS NO CLIENT COMPONENT, which is why the ruled
          refusal survives intact. One hidden radio per photograph, the hero
          stacking all of them, and `#pv-h<i>:checked ~ .pv-hero
          .pv-hero-img[data-i="<i>"]` doing the selection in the cascade. A
          `<label>` in the strip is what a thumb actually lands on. No state, no
          hydration, no `onClick`, and the URL never changes — which is the whole
          objection to `:target`, answered rather than argued with.

          ⚠ THE RADIOS ARE SIBLINGS OF `.pv-hero` AND `.pv-strip`, DELIBERATELY.
          `~` reaches only LATER siblings, so they must sit here — before the
          hero, inside `main.pv-card`, above everything they address. Moving them
          inside `.pv-hero` for tidiness would break the strip's ring and moving
          them below would break both. Derived at 70dd458: `main.pv-card`'s
          children are flat (`header.pv-top`, `.pv-hero`, `.pv-body`, `.pv-rule`,
          `.pv-strip`, `footer.pv-close`), and `VendorProfileContent` mounts
          INSIDE `.pv-hero` and `.pv-body`, never between these and their targets.

          ⚠ VISUALLY HIDDEN, NOT `display:none`. A `display:none` radio is not
          keyboard-reachable and this would become a gallery only a mouse could
          use. `.pv-radio` is the clip-rect pattern: one pixel, off-screen, still
          focusable — and it is the INPUT that takes focus while the LABEL paints
          the ring (`heroSelectRules.mjs`, `:focus-visible` arm). */}
      {gallery.map((p, i) => (
        <input
          key={`pv-h${i}`}
          type="radio"
          name="pv-hero"
          id={`pv-h${i}`}
          className="pv-radio"
          defaultChecked={i === 0}
          aria-label={p.caption || `Show photograph ${i + 1}`}
        />
      ))}

      {hero && (
        <div className="pv-hero">
          <div className="pv-shimmer" />
          {/* ── THE STACK ────────────────────────────────────────────────────
              Every photograph is here, absolutely positioned in the same box,
              all at `opacity:0` until a radio picks one. The box was already
              sized by `clamp()` before any image existed (see the rule), so
              stacking N images changes nothing about CLS.

              ⚠ NO NEW BYTES. These are the SAME URLs the strip renders, so a
              browser fetches each photograph once and paints it twice. Only the
              first is `eager` — it is the page's first paint; the rest are
              `lazy` and arrive while the couple is reading.

              ⚠ `aria-hidden` AND `alt=""` ARE THE HONEST CHOICE HERE, not an
              oversight. All N images are in the DOM at once and a screen reader
              would otherwise announce the whole set as the hero. The same N
              photographs ARE announced, once each and by name, on the radios in
              the strip — which is also where they can be selected. The hero is a
              viewport onto the chosen one, and it is inert: no link, no label,
              nothing to tap. */}
          {gallery.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`pv-hero-img-${i}`}
              className="pv-hero-img"
              data-i={i}
              src={p.url}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="pv-scrim" />
          <div className="pv-identity">
            <VendorProfileContent
              palette={HERO_PALETTE}
              parts="identity"
              nameAs="h1"
              fields={{
                name:          card.business_name,
                category:      card.category,
                city:          card.city,
                about:         null,
                startingPrice: null,
                vibeTags:      [],
              }}
            />
          </div>
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
          parts="body"
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
        {/* ── THE SEAL — G2, R-G2.9 · PLACEMENT RULED (R-G2.11) ──────────────
            ABOVE Enquire, on its own hairline, as the last fact she reads before
            she acts. The founder ruled the placement and the weight on his walk
            of 2026-09-05, against `G2-seal-light`.

            IT CARRIES NO GOLD. The gold on this page is spent once, on the
            section break below the fold; a second gold here would make the seal
            the loudest thing on her page, which is the opposite of what a quiet
            mark is for.

            NO Rs AND NO RUPEE GLYPH EVER REACHES IT — it carries counts and days.
            Numerals are lining and tabular so `12` reads as twelve (F-10.32's
            lineage).

            ⚠ `card.seal &&` IS THE WHOLE VISIBILITY LOGIC ON THIS SIDE. There is
            deliberately no `>= 3` anywhere in this file: the rule lives once, in
            `sealIsVisible` beside the computation, and a page that re-decided it
            would be the second home that ships a seal at two. */}
        {card.seal && (
          <div className="pv-seal">
            <span className="pv-sealmark">{SEAL_MARK}</span>
            <span className="pv-sealfacts">
              {card.seal.delivery_days == null
                ? `${card.seal.weddings} weddings`
                : `${card.seal.weddings} weddings \u00b7 delivers in ${card.seal.delivery_days} days`}
            </span>
          </div>
        )}

        {wa && (
          <a className="pv-cta" href={wa} target="_blank" rel="noopener noreferrer">
            {COPY.enquire}
          </a>
        )}

        {card.is_demo && <p className="pv-demo">{COPY.demoNote}</p>}
      </div>

      {/* THE WHOLE APPROVED SET, in `position` order, HERO INCLUDED — F-19.p2.
          It used to be hero-excluded, which was right while a thumbnail opened a
          file and wrong the moment a thumbnail started selecting the hero: the
          first photograph would have had no way back. CE-39 ruled arm (a).

          A strip and not a carousel: a carousel needs state, state needs a client
          component, and a client component drags a hydration bundle onto a route
          whose whole virtue is arriving instantly for a stranger. Scrolling is a
          gesture every phone already knows. */}
      {/* The gold rule — the studio's section break, brightest beside the
          diamond and dying at the margin. It is what gives the page a rhythm
          instead of a stack, and it tells a reader that what follows is a
          different movement rather than more of the same.

          ⚠ THE THRESHOLD IS TWO, NOT ONE. With a single approved photograph the
          strip would be one thumbnail of the picture already filling the hero —
          a control with nothing to switch to, under a section break announcing
          a movement that does not exist. */}
      {gallery.length > 1 && (
        <div className="pv-rule"><span className="pv-rule-line" /><span className="pv-diamond">◆</span><span className="pv-rule-line" /></div>
      )}

      {gallery.length > 1 && (
        <div className="pv-strip">
          {/* ⚠ A `<label>`, NOT AN `<a>` — and the accessible name is NOT here.
              The name lives on the radio this label points at (see the radio
              block above), because the radio is the control: it is what receives
              focus, what a screen reader announces, and what reports selected.
              A second name on the label would be the same photograph announced
              twice. `alt=""` for the same reason — the thumbnail is the label's
              visible face, not an independent image.

              `htmlFor` is what makes the whole thumbnail a tap target without
              nesting the input, and it is why the radios can live where `~`
              needs them rather than where a thumb needs them. */}
          {gallery.map((p, i) => (
            <label key={`pv-h${i}-label`} htmlFor={`pv-h${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            </label>
          ))}
        </div>
      )}

      {/* ── THE CLOSE IS HERS, THE COLOPHON IS OURS — D-19.1 §2, amended ───────
          S4 closed on `The Dream Wedding` in an ink that computed 2.36:1 — a
          brand block, illegibly. Both halves were wrong. The founder struck the
          brand block: the page opens on her name and closes on it, and TDW
          appears exactly once, as a credit line, at a ratio that computes clear.
          No logo, no gold, no second rule. `bs_audit` C35 holds both inks. */}
      <footer className="pv-close">
        <span className="pv-close-mark">{card.business_name}</span>
        {/* W4-2, second report on the size. S5-c moved it 9px tracked-caps → 11px
            sentence case on the reading that TRACKING was what made it look big.
            Half right at best: it stayed too large and began wrapping to two
            lines, which reads as a paragraph rather than a credit. Back to 9px,
            one line, no tracking — and the studio name above reverts 17px → 15px
            in the same pass, because the gap that widening opened is part of what
            read heavy. The address is a link now, and C35 holds its contrast like
            every other ink here. */}
        <span className="pv-colophon">
          {COPY.colophonLead}{' '}
          <a className="pv-colophon-link" href="https://thedreamwedding.in" target="_blank" rel="noopener noreferrer">thedreamwedding.in</a>
        </span>
      </footer>

      {/* The count is what the generated index rules are built from. It travels
          as a parameter and not as a module-level constant because it is a
          property of THIS card, and the miss branch below renders the same
          stylesheet with no photographs at all. */}
      <PublicStyles heroCount={gallery.length} />
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
function PublicStyles({ heroCount = 0 }: { heroCount?: number }) {
  return (
    <style>{`
/* ⚠ color-scheme IS A CSS PROPERTY, AND THE META ALONE DID NOT SETTLE IT.
   F-19.42's first cut declared it through the route’s viewport export. The arm
   then read "getComputedStyle(document.documentElement).colorScheme" and got
   "normal" — because that reads the CSS property, not a meta tag, and "normal"
   is exactly the state Chrome’s auto-dark inverts. The declaration has to reach
   the cascade, so it is here as well. Two homes for one intent, and the reason
   is stated so the next reader does not delete the one that does the work. */
:root{color-scheme:light}
/* ── THE ARRIVAL (W-4) ──────────────────────────────────────────────────────
   The first walk’s verdict was that the page "starts abruptly, ends abruptly,
   has nothing... no transition." True: that cut had no @keyframes at all.

   The reasoning that produced it, kept so it is not repeated: this route refuses
   a client component, because state needs hydration and a hydration bundle on a
   page serving strangers is a real cost. That was CORRECT about a carousel and
   then over-applied to everything that moved. CSS animation needs no JavaScript,
   no state and no hydration.

   Ported from app/demo/vendor/[handle] rather than re-invented -- same easing,
   same 10px lift, same staggered delays -- so the estate’s two vendor
   presentations cannot drift into two houses. "both" fill so nothing flashes
   before its delay elapses. */
@keyframes pvRise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
/* ⚠ RETUNED AGAINST THE PWA LANDING -- the founder’s own stated reference, which
   cross-fades its photograph over 3s ("app/(landing)/page.tsx:681"). S5-b’s
   400ms/150ms was the chair’s restraint read as speed, and the founder reported
   "no animation for the page loading" against a page that WAS animating: an
   arrival too brief to notice is not restraint, it is absence. The cadence is
   the landing’s, compressed -- the photograph settles over 1.2s, her name rises
   behind it, the card follows. */
@keyframes pvFade { from{opacity:0} to{opacity:1} }

/* ⚠ TWO ELEMENTS MOVE, AND NOTHING ELSE — D-19.1 §3, verbatim: "the hero name
   and eyebrow fade-and-rise 400ms ease-out, 80ms stagger; card content follows
   at 150ms... Nothing else animates."
   S4 staged FIVE blocks and the arm caught four of them surviving into this cut.
   The restraint is the ruling: an arrival is a moment, and a page where every
   block takes its turn is a page that keeps the reader waiting for itself. */
/* D-19.1 section 3. A slow breath, not a strobe.
   ⚠ CAPPED AT THREE ITERATIONS -- F-19.40, and the founder walked the defect it
   cures: "the top image keeps glowing dark and light... in a loop." S5-b put
   this animation ON THE <img>, so it pulsed the PHOTOGRAPH’s own opacity, and
   "infinite" meant it never stopped. The seat reasoned correctly that the
   img’s BACKGROUND gets painted over by the decoded image and then applied the
   rule to the wrong layer.
   Now it lives on a element BENEATH the image, which the opaque photo covers on
   decode, and it runs three times rather than forever: CSS has no observer of
   image load, so a cap is the honest substitute for a stop. ~4.8s of breathing
   is longer than any first paint this page will have and shorter than a loop. */
@keyframes pvHold { 0%{opacity:1} 50%{opacity:.45} 100%{opacity:1} }

.pv{min-height:100vh;background:#F8F7F5;color:#0C0A09;
  font:400 14px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.pv:not(.pv-card){display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;padding:32px 24px;text-align:center}
.pv-card{max-width:430px;margin:0 auto;padding:0 0 8px}
/* W3-5. A made edge, 40px, before the photograph. */
.pv-top{height:40px;display:flex;align-items:center;justify-content:center;
  padding:0 24px;background:#F8F7F5;border-bottom:.5px solid rgba(12,10,9,.07)}
.pv-top-name{font:300 11px/1 "Cormorant Garamond",Georgia,serif;color:#403B36;
  letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ── THE HERO -- D-19.1 section 1 ───────────────────────────────────────────
   clamp(320px, 56vh, 460px), the chair’s ruled measure: her name and the top
   edge of Enquire share the first fold at 374x900. Checked at both ends --
   375x667 gives 373px and the name lands at ~600 of 667; 390x844 gives 460px
   capped and the name at ~690 of 844. The name is INSIDE the hero now, so the
   fold requirement is met by construction rather than by arithmetic below it.

   ⚠ THE BOX IS SIZED BEFORE THE IMAGE EXISTS, and that is the CLS cure. Height
   comes from clamp() and never from the image’s intrinsic ratio, so the
   photograph paints into a box that was already the right size -- zero layout
   shift on settle, by construction, which is a property the page can actually
   keep rather than a number it hopes for. */
.pv-hero{position:relative;width:100%;height:clamp(320px, 56vh, 460px);
  overflow:hidden;background:#EDEAE4}
/* ⚠ THE PLACEHOLDER IS THE IMG’S OWN BACKGROUND, AND THE LIMIT IS STATED.
   D-19.1 section 3 asked, where honestly implementable without client JS, that
   the arrival trigger on image settle rather than a timer. IT IS NOT: there is
   no CSS-only observer of image decode -- no selector, no media query, no
   :has() form sees it. So the amendment’s own fallback ships: the shimmer is
   the image element’s background, which the decoded photograph simply paints
   over with no JavaScript and no shift, and the name’s arrival stays
   time-staged. Said here rather than discovered later. */
.pv-shimmer{position:absolute;inset:0;background:#EDEAE4;z-index:0;
  animation:pvHold 1600ms ease-in-out 3}
/* ⚠ THE IMAGE CARRIES NO ANIMATION AND NO BACKGROUND. Both were the bug: an
   animation on a replaced element animates the PICTURE. It sits above the
   shimmer and covers it on decode, which is the only "on load" signal CSS
   actually has -- opacity, not a listener. */
/* ⚠ THE RADIO IS HIDDEN FROM THE EYE, NOT FROM THE KEYBOARD — F-19.44.
   The clip-rect pattern, not "display:none" and not "visibility:hidden": both of
   those remove the element from the focus order, and the gallery would become a
   thing only a pointing device could operate. One pixel, clipped to nothing,
   still focusable — and it is this element that takes focus while its label in
   the strip paints the ring. */
.pv-radio{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;
  clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap}
/* ⚠ THE HERO IS A STACK NOW, AND IT IS INERT. Every approved photograph sits in
   the same pre-sized box at opacity 0; the generated index rules below reveal
   exactly one. No anchor, no label, nothing to tap — the selection lives in the
   strip, where a thumb is already going.

   "pointer-events:none" is belt to that braces: it guarantees the hero cannot
   become a control by accident if a later seat adds a wrapper. */
.pv-hero-img{position:absolute;inset:0;z-index:1;width:100%;height:100%;
  object-fit:cover;object-position:center top;display:block;
  opacity:0;pointer-events:none}
/* The scrim. One gradient, bottom only -- the studio’s :333 shape, tuned to the
   ruled stop. It exists so HER NAME is legible, which is a different job from
   the one S4's scrim was doing (making TDW’s wordmark legible over her work),
   and the difference is why that element is gone. */
.pv-scrim{position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;
  background:linear-gradient(180deg, transparent 45%, rgba(12,10,9,.72) 100%)}
.pv-identity{position:absolute;left:0;right:0;bottom:18px;padding:0 24px;z-index:2;
  animation:pvRise 900ms cubic-bezier(0.22,1,0.36,1) 500ms both}

.pv-body{padding:22px 24px 0;animation:pvRise 900ms cubic-bezier(0.22,1,0.36,1) 750ms both}
/* ⚠ LONGHANDS, AND inherit IS WHY — F-19.43, THE THREE-SITTING BUG.
   These four rules were written font:400 14px/1.45 inherit, meaning "keep the
   inherited family and set the rest". **The font shorthand does not work that
   way.** A CSS-wide keyword (inherit, initial, unset) is only legal as the
   ENTIRE value of a shorthand; inside one it is a parse error and the browser
   drops the WHOLE declaration — family, size, weight and line-height together.
   Every one of these elements was silently inheriting 14px/400 from .pv while
   the source said otherwise, and three sittings tuned a number the browser had
   already thrown away.

   THE WITNESS THAT SETTLES IT IS THE CTA, NOT THE SIZE. .pv-cta declared
   weight 500 and computed 400. A dropped size can be argued about; a dropped
   weight cannot be anything but a discarded declaration.

   The family was never at risk: nothing here re-declares it, so omitting it from
   the longhands inherits it exactly as intended. bs_audit C40 now refuses any
   font: shorthand carrying a CSS-wide keyword on either public route, so the
   class announces itself instead of shipping a fourth time. */
.pv-line{font-weight:400;font-size:14px;line-height:1.45;color:#403B36;margin:8px 0 0;max-width:34ch}
.pv:not(.pv-card) .pv-line{margin:0;max-width:34ch}
/* D-19.1 section 2: the gold moves off 4.48:1. #7A621C computes 6.03:1 on cream
   -- proven by the cell, not chosen by eye, which is the whole lesson of W2-4. */
/* ── G2 · THE SEAL (R-G2.9, placement and weight ruled R-G2.11) ────────────
   Its own hairline, the page’s own ink, no gold. The facts line sits at 13px —
   one step under her about paragraph — which the founder ruled AS DRAWN, after
   this seat named the risk that it could read as another sentence rather than a
   mark.
   ⚠ NO BACKTICKS ANYWHERE IN THIS BLOCK. It is a template literal, so a backtick
   in a CSS comment closes the string, and tsc then reports a cascade of brace
   errors none of which mention a backtick. This seat hit that twice in one
   delivery — here and in the Google reviews room — which is what makes it worth
   a line rather than a silent fix. */
.pv-seal{margin-top:22px;padding-top:14px;border-top:.5px solid rgba(12,10,9,.14)}
.pv-sealmark{font:300 9px/1 "Jost",system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;
  color:rgba(12,10,9,.72);display:block}
.pv-sealfacts{font-weight:400;font-size:13px;line-height:1.5;color:#403B36;display:block;margin-top:6px;
  font-variant-numeric:lining-nums tabular-nums}
.pv-cta{margin-top:22px;display:inline-flex;align-items:center;min-height:44px;
  padding:12px 22px;border:.5px solid #C9A84C;border-radius:2px;color:#7A621C;
  text-decoration:none;font-weight:500;font-size:12px;line-height:1.4;letter-spacing:.04em;
  touch-action:manipulation}
.pv-cta:active{background:#F2EFE9}
.pv-cta:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-demo{font-weight:400;font-size:11px;line-height:1.4;color:#6B6560;margin:18px 0 0;max-width:36ch}

/* The section break. Brightest beside the diamond, dying at the margin -- the
   studio’s own reversal, after its first cut faded to nothing at the centre and
   left the diamond reading as a stray dot. */
.pv-rule{display:flex;align-items:center;gap:10px;margin:30px 24px 0}
.pv-rule-line{flex:1;height:1px}
.pv-rule-line:first-child{background:linear-gradient(to left,rgba(201,168,76,.5),rgba(201,168,76,0))}
.pv-rule-line:last-child{background:linear-gradient(to right,rgba(201,168,76,.5),rgba(201,168,76,0))}
.pv-diamond{font:9px/1 "Cormorant Garamond",Georgia,serif;color:rgba(201,168,76,.85)}

/* ── THE STRIP IS A GLANCE -- F-19.38, and this is the four-sitting bug ─────
   The founder reported full-width thumbnails on four consecutive walks. Source
   declared "flex:0 0 104px"; globals.css touches no img; Tailwind’s preflight
   only sets max-width/height:auto; the service worker was cleared by reading it;
   and pv_render measured 104x130 rendered. Every derivation exonerated the page.
   His console settled it in one line:

     rendered 1080x1350 · basis 104px · width 1080px · minW auto

   **"min-width: auto" on a flex item resolves to its AUTOMATIC MINIMUM SIZE,
   which for a replaced element is its INTRINSIC width.** The photograph is
   1080px wide, so the item’s floor was 1080px; "flex-basis" was honoured and
   simply outranked, and "flex-shrink:0" meant nothing pulled it back.

   AND THE REASON FIVE SITTINGS MISSED IT: this container’s egress denies
   Cloudinary, so in every arm run "naturalWidth" was 0, the automatic minimum
   was 0, and the basis won by default. The instrument measured a page whose
   images did not exist and reported PASS -- F-19.39, cured in pv_render by
   asserting "naturalWidth > 0" before trusting any geometry.

   Proven in isolation, no framework involved: with a real 1080px image and
   "min-width:auto" the item rendered 326px; with "min-width:0" it rendered 104.
   "width" is belt to the basis’s braces. */
.pv-strip{display:flex;gap:8px;overflow-x:auto;padding:18px 24px 0;
  scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;
  scrollbar-width:none}
.pv-strip::-webkit-scrollbar{display:none}
/* ⚠ THE LABEL IS NOW THE FLEX ITEM, so F-19.38's cure moves ONTO IT — F-19.p3.
   This comment has moved twice with the element that carries it, and that is the
   point of it. It was on the img; W4-1 wrapped the img in an anchor and the
   anchor became the flex child, so the cure moved there; F-19.44 replaces the
   anchor with a label and the cure moves again. **The rule belongs to whatever
   is the direct child of .pv-strip, never to a tag name** — which is why
   bs_audit C37 now derives that child from the markup instead of asserting
   against img, and would have caught this migration going wrong.

   Both carry the width: the label because it is what flexes, the image because
   it must fill the label and must not re-inherit an intrinsic floor if a later
   seat unwraps it. Getting this wrong reintroduces the four-sitting bug — a
   1080px photograph flooring a 104px basis — and this container cannot see it,
   because egress denies Cloudinary and naturalWidth is 0 here (F-19.39).

   cursor:pointer is not decoration. The tap target stopped being a link, so
   nothing else tells a desktop reader that the thumbnail is a control. */
.pv-strip label{flex:0 0 104px;min-width:0;width:104px;display:block;
  line-height:0;cursor:pointer}
.pv-strip img{width:104px;min-width:0;aspect-ratio:4/5;
  object-fit:cover;display:block;background:#EDEAE4;scroll-snap-align:start}

/* The close is HERS; the colophon is the one place TDW appears. */
.pv-close{margin-top:40px;padding:0 24px 32px;text-align:center;
  display:flex;flex-direction:column;gap:8px}
.pv-close-mark{font:300 15px/1.2 "Cormorant Garamond",Georgia,serif;color:#403B36;letter-spacing:.01em}
/* W3-4: "should be smaller -- not a semi hero sizze -- and should have
   thedreamwedding.in adress with it." One line, 11px, sentence case rather than
   tracked-out caps, which is what made 9px read larger than it measured. */
/* ⚠ white-space:nowrap IS STRUCK — F-19.p1, CE-39 ruling 1, and it is the half
   of this defect that actually shifted the page. At the dropped 14px the line’s
   ink measured 484px inside a 326px column and the whole document scrolled
   sideways by 134px. Longhanding the size to 9px is most of the cure, but not
   all of it: measured in a real browser at 9px, the line is 326px in a 326px box
   at 374 wide — exactly flush, no slack — and at 320 wide it is 311px of ink in
   a 272px box and the page STILL scrolls sideways. A credit line that must not
   wrap is a credit line one longer word away from moving the page again.
   It wraps. */
.pv-colophon{font-weight:400;font-size:9px;line-height:1.4;letter-spacing:0;color:#6B6560}
.pv-colophon-link{color:#6B6560;text-decoration:underline;text-underline-offset:2px}

/* ⚠ MOTION IS AN ENHANCEMENT, NEVER A GATE. Everything above animates from
   opacity 0 with "both" fill. Without this rule a reader who has asked their
   phone to stop moving things would be held at opacity 0 forever -- a blank
   page, served to the people least able to diagnose it. The shimmer stops too:
   a pulse that never resolves is the same defect wearing a slower coat. */
@media (prefers-reduced-motion: reduce){
  .pv-identity,.pv-body,.pv-shimmer{animation:none}
  /* The shimmer must not merely stop animating -- held at opacity 1 it would
     sit as a flat panel over nothing. It goes. */
  .pv-shimmer{display:none}
}
/* ── F-19.44 · THE INDEX RULES, GENERATED ──────────────────────────────────
   One set per photograph, and the set is unbounded because the door’s portfolio
   query carries no limit. They are built by lib/public/heroSelectRules.mjs
   rather than written here, so that tools/bs_audit.mjs can import the SAME
   function and assert against the SAME bytes -- a generated string interpolated
   into this literal would be invisible to every source-reading cell in that file,
   which is the hollow-green shape this block has already paid for twice.

   ⚠ THEY COME AFTER the reduced-motion block above, on purpose. Their own
   reduced-motion escape is generated with them, at the same id-carrying
   specificity, because a media query adds no specificity and a static
   .pv-hero-img{animation:none} up there would simply lose. See the module.
*/
${heroSelectRules(heroCount)}
    `}</style>
  );
}
