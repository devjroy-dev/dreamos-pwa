// app/e/[id]/route.ts — R-41.119 · THE ENQUIRY FAMILY'S OWN ADDRESS.
// CE-41 seat D, D2 pwa. Cut at dreamos-pwa 1d57dd9478265c9efe0d7988283ac8d14e4b0e60.
//
// ── WHAT THIS IS, AND WHAT IT DELIBERATELY IS NOT ────────────────────────────
// `tdw_assist_lead_outside_v2` tells an outsider "The full enquiry is on the page
// below" and its button lands here (via `/r/enq-<id>`, until the next Meta edit
// window moves the base to `/e/`). This page is the honest answer to that tap.
//
// IT DOES NOT SHOW THE ENQUIRY, AND THAT IS DECLARED, NOT HIDDEN. There is NO
// public read for an assistance item anywhere in dream-os — derived by command at
// 417c9f8: nothing under `src/api/` serves one, and `src/api/couple/assistance.js`
// sits behind `requireCoupleAuth`. Building that door is a dream-os packet this
// seat was not chartered for, and inventing a client-side fetch against a route
// that does not exist would have shipped a page that 404s on its own data while
// looking finished.
//
// So this follows THE PRECEDENT ALREADY IN THIS REPO, at `app/r/[code]/route.ts`:
// *a sentence beats a 404 and nothing more is built.* The vendor gets a page that
// knows what she came for and tells her exactly what to do next — which is reply
// on WhatsApp, the same thread the message arrived on, where the founder is.
//
// ── WHAT IS OWED, NAMED SO IT CANNOT BE FORGOTTEN ───────────────────────────
//   1. `GET /api/v2/public/enquiry/:id` in dream-os — the request summary ONLY:
//      category · city · month · budget band. NO PHONE. Roadmap §7's standing
//      refusal is that the couple's number never leaves with an outsider, and a
//      public page is the last place it could be allowed to.
//   2. This route becomes a page that reads it, with the vendor-join CTA, and the
//      lead materialises by last-ten on join (R-41.29's design).
// Until then this text is the whole surface, and it is true.
//
// ── COPY ─────────────────────────────────────────────────────────────────────
// Under R-41.98: plain, short, direct. A refusal is one sentence with the reason
// and the next step. Nothing here promises a page that does not exist yet.
// This is vendor-facing, so every byte is the chair's veto (R-41.98).

import { NextRequest } from 'next/server';

const TITLE = 'The Dream Wedding';

function page(line: string, sub: string): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>${TITLE}</title>` +
    `<style>` +
    `body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;` +
    `background:#0C0A09;color:#F8F7F5;font:300 16px/1.6 system-ui,-apple-system,sans-serif;padding:32px}` +
    `main{max-width:420px;text-align:center}` +
    `h1{font:300 24px/1.3 Georgia,serif;font-style:italic;margin:0 0 14px;color:#F8F7F5}` +
    `p{margin:0;color:rgba(248,247,245,0.62);font-size:15px}` +
    `</style></head><body><main><h1>${line}</h1><p>${sub}</p></main></body></html>`,
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  // No id is not an enquiry. Same answer either way — the page never confirms or
  // denies that a given id exists, because it cannot read them and guessing would
  // leak which ids are real.
  if (!id) {
    return page('Enquiry not found', 'Reply on WhatsApp and we will send it again.');
  }

  return page(
    'Your enquiry is with us',
    'Reply on the WhatsApp message and we will send you the full details.',
  );
}
