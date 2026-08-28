// app/v/[code]/page.tsx — TDW_19 P0-B step 4 · THE PUBLIC VENDOR PAGE (R-19.7).
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS IS THE ESTATE'S FIRST PUBLIC PER-VENDOR ADDRESS
// ═══════════════════════════════════════════════════════════════════════════
// F-19.14: before this file, no per-vendor URL existed anywhere — Discover is a
// shuffled feed with no route param, and `middleware.ts` rewrites only on demo
// hosts. Meanwhile `tdw_referral_invite` is APPROVED AT META with base
// `https://thedreamwedding.in/v/`, so every couple who tapped Share from a
// friend's WhatsApp landed on a framework 404.
//
// ── A 200 PAGE, NOT A 302 (CE-38 relay #1) ────────────────────────────────
// R-19.7's first draft made this a redirect to the storefront. There is no
// storefront. **A redirect to a route that does not exist is a worse byte than a
// page that says what is true**, so this is the address from today, and P2
// replaces the BODY, not the URL.
//
// ── c-38.16 · route.ts → page.tsx ─────────────────────────────────────────
// The kickoff specified `app/v/[code]/route.ts`, correct while this was a 302.
// The ruling made it a rendered page, so it is a `page.tsx`. The chair filed the
// correction against himself.
//
// ── ITS t1 IS ITS OWN ─────────────────────────────────────────────────────
// `theme.ts:47` allows one t1 per surface, and `WorklistShell` owns it inside
// the app. This route is OUTSIDE the shell — no session, no nav, no medallion —
// so its business-name heading is its own t1 and does not contend. `bs_audit`
// C18 scopes to `app/w/support` for exactly this reason. The chair gates this
// surface's frames separately as the estate's first public byte.
//
// ── SERVER-RENDERED, AND DELIBERATELY ─────────────────────────────────────
// A couple arriving from WhatsApp gets one paint with the content in it. A
// client component would ship a spinner to a stranger who has no reason to wait,
// and would put the fetch on their connection instead of ours.

export const dynamic = 'force-dynamic';

/**
 * ⚠ THE COPY IS INLINE HERE, AND THE REASON MATTERS.
 * `lib/solutions/copy.ts` is the home for these strings and the register carries
 * them for the founder's pass. They are repeated as literals in this file
 * because it is a server component on the public edge: importing the copy module
 * would pull `types.ts` and its graph onto a route serving strangers. **If the
 * two ever disagree, `copy.ts` wins** — it is the home, this is a transcription,
 * and the register is where the founder's veto lands.
 */
const COPY = {
  line:     'Takes enquiries through The Dream Wedding.',
  enquire:  'Enquire on WhatsApp',
  unknown:  'This page is no longer available.',
  demoNote: 'This is a demonstration page, built from work published publicly.',
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

type Card = {
  business_name: string | null;
  category: string | null;
  city: string | null;
  handle: string;
  is_demo: boolean;
  enquiry_phone: string | null;
};

async function fetchCard(code: string): Promise<Card | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v2/public/vendor-card/${encodeURIComponent(code)}`, {
      cache: 'no-store',
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
  // (`vendorCard.js:139`, asserted byte-identical by b44 §4.4), and `fetchCard`
  // returns null on any non-ok response. So one branch serves all three, and
  // there is no code path on which they could diverge.
  //
  // It renders on the SAME GROUND as a real card — same background, same type,
  // same frame — carrying one sentence. **No status code is visible anywhere**,
  // because "404" tells a couple nothing and tells a curious stranger that the
  // handle space is worth probing.
  if (!card) {
    return (
      <main className="pv">
        <p className="pv-line">{COPY.unknown}</p>
        <PublicStyles />
      </main>
    );
  }

  const sub = [card.city, card.category].filter(Boolean).join(' · ');
  const wa = card.enquiry_phone
    ? `https://wa.me/${card.enquiry_phone.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <main className="pv">
      <h1 className="pv-name">{card.business_name || COPY.unknown}</h1>
      {sub ? <p className="pv-sub">{sub}</p> : null}
      <p className="pv-line">{COPY.line}</p>

      {/* ⚠ THE BUTTON IS DEMO-ONLY, AND THAT ASYMMETRY IS RULED, NOT ACCIDENTAL.
          CE-38 relay #3 blocker 2: `public.vendors` has no phone column and no
          "number is public" flag — a vendor's number lives on `public.users.phone`,
          and publishing it because a button needed a target would put a personal
          WhatsApp number on an open URL on the strength of a choice she was never
          asked to make. `demo_vendors.whatsapp_phone` is a business's own public
          Instagram contact and the page states it is a demo. A real vendor gets
          this button when a `public_contact_phone` is chartered with her explicit
          consent — priced into P2, not invented here. */}
      {wa ? (
        <a className="pv-cta" href={wa} target="_blank" rel="noopener noreferrer">
          {COPY.enquire}
        </a>
      ) : null}

      {card.is_demo ? <p className="pv-demo">{COPY.demoNote}</p> : null}

      {/* Graphite & Signal, transcribed rather than imported — see the copy note.
          Cormorant is the display face at t1; DM Sans carries everything else.
          No webfont is loaded: a stranger on a phone gets the system stack
          instantly rather than a flash of nothing while two files download. */}
      <PublicStyles />
    </main>
  );
}

/**
 * ONE STYLESHEET FOR BOTH BRANCHES. The neutral page must sit on the SAME
 * ground as a real card (F-19.19) — a second copy of these rules is a second
 * ground that drifts the first time one is edited.
 */
function PublicStyles() {
  return (
    <style>{`
.pv{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;padding:32px 24px;background:#F8F7F5;color:#0C0A09;text-align:center;
  font:400 14px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.pv-name{font:500 24px/1.2 "Cormorant Garamond",Cormorant,Georgia,serif;margin:0;max-width:22ch}
.pv-sub{font:500 12px/1.4 inherit;letter-spacing:.06em;text-transform:uppercase;
  color:#6B6560;margin:0}
.pv-line{font:400 14px/1.45 inherit;color:#403B36;margin:8px 0 0;max-width:34ch}
.pv-cta{margin-top:20px;display:inline-flex;align-items:center;min-height:44px;
  padding:12px 20px;border:.5px solid #C9A84C;border-radius:2px;color:#8A6F1F;
  text-decoration:none;font:500 12px/1.4 inherit;letter-spacing:.04em;
  touch-action:manipulation}
.pv-cta:active{background:#F2EFE9}
.pv-cta:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-demo{font:400 11px/1.4 inherit;color:#8A837C;margin:18px 0 0;max-width:36ch}
    `}</style>
  );
}
