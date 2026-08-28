// app/r/[code]/route.ts — TDW_19 P0-B step 4 · THE REVIEW REDIRECT (R-19.7).
//
// ═══════════════════════════════════════════════════════════════════════════
// F-19.17 · THIS ROUTE CANNOT REDIRECT ANYONE TODAY, AND THAT IS THE HONEST STATE
// ═══════════════════════════════════════════════════════════════════════════
// R-19.7 rules this a 302 to the vendor's Google review URL, with a
// page-and-a-sentence when unset. **It is unset for every vendor**, because
// there is nowhere for a review URL to live: `grep -niE
// "review_url|review_link|google_review"` across `docs/db/PUBLIC_SCHEMA.md`
// returns NOTHING. `GoogleStatus.reviewUrl` exists on the wire contract
// (`lib/solutions/types.ts`) but its storage arrives with P1's
// `vendor_integrations`.
//
// So this ships as the sentence, for everyone, until P1. CE-38 relay #3 ruled it
// so, and the P0-A ledger already carries the consequence: `tdw_vendor_review_request`
// is APPROVED AT META with base `https://thedreamwedding.in/r/`, and until this
// file existed it resolved to a framework 404.
//
// **A sentence beats a 404 and nothing more is built.** Writing a lookup against
// a table that does not exist would be writing against a guess.
//
// ── WHY A route.ts AND NOT A page.tsx ─────────────────────────────────────
// Its final form is a 302 — a redirect, not a screen. Building it as a page now
// and converting it later would move the URL's implementation out from under a
// route Meta has already approved. So it stays a route handler and renders the
// sentence as a minimal HTML body; when P1 lands, the `TODO` block below becomes
// a `Response.redirect` and the HTML becomes the fallback it was always meant to
// be.

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// The sentence has ONE home. It is duplicated here as a literal rather than
// imported from `lib/solutions/copy.ts` for one reason, stated so it is not
// mistaken for carelessness: this is a route handler on the public edge with no
// React runtime, and pulling the copy module in would drag `types.ts` and its
// imports onto a route whose entire job is to emit sixteen words. The register
// carries this string as `reviewUnsetLine` and the founder's one pass covers it
// there; if the two ever disagree, the register wins.
const UNSET_LINE = 'This review link is not set up yet.';

function page(line: string): Response {
  // Deliberately plain. This is not inside the shell — no session, no rungs, no
  // fonts to load. A stranger who tapped a WhatsApp button deserves a fast,
  // legible sentence, not a design system.
  //
  // ⚠ IT DECLARES ITS OWN CHROME — F-19.41 / F-19.42, and this route's version
  // of the leak is an ABSENCE rather than an inheritance. It writes a whole
  // document, so `app/layout.tsx` never touches it and the app's near-black
  // `theme-color` never reaches here. What also never reached here was any
  // declaration at all: with `color-scheme` unset, Chrome's auto-dark inverts an
  // undeclared light page, and this ground is `#F8F7F5` by choice. Both metas
  // say so now. Same two lines as `/v/`, for the opposite reason.
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F8F7F5">
<meta name="color-scheme" content="light">
<title>The Dream Wedding</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:#F8F7F5;color:#0C0A09;font:400 16px/1.5 system-ui,-apple-system,sans-serif;padding:24px}
html{color-scheme:light}
p{margin:0;max-width:34ch;text-align:center}</style></head>
<body><p>${line}</p></body></html>`;
  return new Response(html, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!code) return page(UNSET_LINE);

  // ── WITHHELD UNTIL P1, WITH THE UNCOMMENT STEP STATED ─────────────────────
  // Conditional-withheld rule. When P1's `vendor_integrations` lands and the
  // Google door stores a review URL:
  //
  //   1. Add `GET /api/v2/public/review-url/:code` to
  //      `src/api/public/vendorCard.js` — same file, same allowlist discipline,
  //      returning `{ ok, url }` or the same indistinguishable 404 as the card
  //      door (an enumeration oracle here would be the same defect §4 of b44
  //      exists to prevent).
  //   2. Replace this comment block with the fetch, and on a hit:
  //        return Response.redirect(url, 302);
  //   3. Keep `page(UNSET_LINE)` as the miss path — it stays correct forever.
  //   4. Extend b44 with both arms: URL present → 302 and Location header;
  //      URL absent → the sentence.
  //
  // Until then there is exactly one outcome, and it is true.
  return page(UNSET_LINE);
}
