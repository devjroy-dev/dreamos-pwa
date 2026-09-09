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
// so, and the P0-A ledger already carries the consequence: `tdw_review_request`
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

// ── R-38.22 · THIS ROUTE NAMES ITS OWN BUILD ────────────────────────────────
// Same shape and same reason as `app/v/[code]/page.tsx:177`, whose comment states
// the standing rule: a finding on a page whose build cannot be named is filed as
// unattributable, not chased. F-42.1 cost a round trip on exactly that question —
// "still the review sentence" had two readings (the branch is wrong, or the branch
// is not deployed) and nothing on the page could tell them apart. It can now:
// view-source and read the commit. `unknown` locally, which is honest.
// `||` and not `??` — R-41.106. An env var is `string | undefined` and never null,
// so the two differ on exactly one value: the empty string, which `??` would pass
// through and render as `content=""`. An unnamed build that LOOKS named is the
// defect this tag exists to kill. (`app/v/[code]/page.tsx:177` spells it `??` and
// carries the same hole; out of this packet's radius, named so it is not lost.)
const BUILD = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
  || process.env.VERCEL_GIT_COMMIT_SHA
  || 'unknown';

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
<meta name="tdw-build" content="${BUILD}">
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

// ── R-41.119 · ONE PATH, TWO FAMILIES, DISAMBIGUATED BY AN EXPLICIT PREFIX ──
// `tdw_assist_lead_outside_v2`'s URL button is fixed at this base until Meta's next
// edit window, so the enquiry family has to share `/r/` with the review family for
// now. It is disambiguated by a PREFIX THE SENDER WRITES (`enq-`), never by shape:
// a guess at "what a review code looks like" would route on a coincidence, and the
// day a review code happened to match, a vendor would land on someone's enquiry.
//
// THE BEND TO R-40.15 IS RECORDED WITH ITS RETIREMENT. At the next edit window the
// button base moves to `/e/` and THIS BRANCH GOES WITH IT — the branch is temporary
// by construction and the comment is the reminder.
//
// Every other code falls through untouched: the review family's behaviour is not
// changed by a single byte, only preceded.
const ENQUIRY_PREFIX = 'enq-';

// ── F-42.1 · A BEND TO WHAT META ACTUALLY STORED, RETIRED WITH THE BRANCH ────
// WITNESSED, not inferred. The founder long-pressed the outsider's `Visit website`
// button and copied the link, 2026-09-10:
//
//     https://thedreamwedding.in/r/%7B%7B1%7D%7Denq-12bc406c-...
//
// Meta's stored base ends in a LITERAL `{{1}}` and our suffix parameter is appended
// to it rather than substituted into it. So the code arrives as `{{1}}enq-<token>`,
// `startsWith('enq-')` is false, and every outsider landed on the review family's
// sentence. Three other readings were alive and all three are dead by command:
// `/v/DEV440` carries `tdw-build cc109bd7` (Vercel is on the tip), `/r/enq-<uuid>`
// typed by hand reaches `/e/` (the branch is deployed), and the walk after D4
// reproduced it with the eight-hex suffix (not a stale message).
//
// ⚠ STRIP, DO NOT DECODE — c-42.5. Next decodes dynamic segment params before the
// handler sees them, so `%7B%7B1%7D%7D` ARRIVES as `{{1}}`; this route's own code
// proves the author knew it — see the `encodeURIComponent` on the redirect below,
// which would double-encode if the param arrived raw. A `decodeURIComponent`
// here would be a SECOND decode and would throw `URIError` on any review code
// holding a bare `%` — a 500 where there is a sentence today, and §8 ranks that
// regression worse than the missing feature. Both spellings are matched anyway so
// no assumption about the runtime's decoding is load-bearing.
//
// THIS DIES WITH THE BRANCH. When the button base moves to `/e/` at the next Meta
// edit window, the `enq-` branch retires (R-41.119) and this strip retires with it.
const META_PLACEHOLDER = /^(\{\{1\}\}|%7B%7B1%7D%7D)/i;

export async function GET(_req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!code) return page(UNSET_LINE);

  // The review family reads the stripped code too: a review code has never begun
  // with the placeholder, so this is a no-op for every one of them, and if Meta
  // ever stores the same base for `tdw_review_request` it is already cured.
  const stripped = code.replace(META_PLACEHOLDER, '');
  if (!stripped) return page(UNSET_LINE);

  if (stripped.startsWith(ENQUIRY_PREFIX)) {
    const id = stripped.slice(ENQUIRY_PREFIX.length);
    // A bare prefix with nothing after it is not an enquiry; it falls to the review
    // family's own answer rather than redirecting to a page that cannot exist.
    if (id) return Response.redirect(new URL(`/e/${encodeURIComponent(id)}`, _req.url), 302);
  }

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
