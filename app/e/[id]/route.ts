// app/e/[id]/route.ts — R-41.119 · THE ENQUIRY FAMILY'S OWN ADDRESS.
// CE-41 seat D, D2 pwa. CE-42 seat D2, D5a: F-41.156 — it now READS the enquiry.
//
// ── WHAT CHANGED, AND WHAT THE OLD HEADER SAID ───────────────────────────────
// This route shipped as a sentence and declared why: "There is NO public read for
// an assistance item anywhere in dream-os — derived by command at 417c9f8." That
// was true then and is false now. `GET /api/v2/public/enquiry/:token` landed in
// D3c2b (dream-os `src/api/public/enquiry.js`, mounted at `src/api/router.js:35`
// under `/api/v2`), and owed item 1 of the old header is discharged here. Owed
// item 2 — the vendor-join CTA and the lead materialising by last-ten on join —
// is NOT in this packet and stays owed.
//
// ── WHAT THE DOOR RETURNS, AND WHAT IT REFUSES ───────────────────────────────
//   { ok, found:false }                                    — miss, closed, malformed
//   { ok, found:true, enquiry:{ category, city, month, budget_band } }
//
// NO PHONE, NO NAME, NO DAY, NO FIGURE, NO IDS. That refusal is the door's and is
// documented at its own head; this page adds nothing to what the door hands over
// and asks for nothing else. Roadmap §7's standing refusal — the couple's number
// never leaves with an outsider — is kept by not being able to reach it.
//
// ── THE TOKEN ROUND-TRIP, BOTH WAYS ──────────────────────────────────────────
// `/r/[code]` STRIPS `enq-` before it redirects here (`code.slice(4)`), so today
// this route is handed bare eight hex and has to put the prefix back for the door,
// whose regex is strict: `^enq-([0-9a-f]{8})$`. At the next Meta edit window the
// button base moves to `/e/` and the prefix will arrive ATTACHED. So the id is
// normalised: an optional leading `enq-` is stripped and exactly one is re-added.
// The route is correct before and after that window, which is the point.
//
// ── ⚠ EVERY VALUE IS ESCAPED, INCLUDING THE THREE THAT LOOK SAFE ─────────────
// This document is built by template literal, and until this cut it interpolated
// nothing but constants. `city` is the bride's own free text: the writer at
// dream-os `src/lib/couple/assistance.js:232` does `String(p.city).trim()
// .slice(0,120)` and NOTHING else, the door returns `row.city || null` raw, and
// signup is open to any number (F-05.9). Unescaped, that is stored XSS on an
// unauthenticated public page reached from a WhatsApp button. `category` is
// whitelist-bound and `month`/`budget_band` are generated server-side — they are
// escaped anyway, because the safety of those three is a property of code in
// another repo and the next field added here will not come with a warning.
//
// ── §13 · PUBLIC PAGES ARE LIGHT-ONLY ────────────────────────────────────────
// This page shipped on `#0C0A09` — a dark public page, against the protocol's §13
// amendment (CE-40, F-40.22/.41). It is now `#F8F7F5` with `#0C0A09` ink, the same
// ground `/r/` and `/v/` stand on, and it declares `theme-color` and `color-scheme`
// in the document rather than relying on `app/layout.tsx`: this route writes a
// WHOLE document, so the root layout never touches it (F-19.41/.42's shape). With
// `color-scheme` unset, Chrome's auto-dark inverts an undeclared light page.
//
// ── NOINDEX, AND ITS SECOND HOME ─────────────────────────────────────────────
// An enquiry summary about a real couple must not be crawlable. `/r/` declares it
// and `/e/` never did. Both halves ship: the meta below AND `/e/` joining the
// disallow list in `app/robots.ts`. Neither alone is the cure — a meta is invisible
// to a crawler that was told not to come, and robots.txt is advisory.
//
// ── COPY ─────────────────────────────────────────────────────────────────────
// Under R-41.98: plain, short, direct. The four labels `Service · City · Month ·
// Budget` are the chair's veto of 2026-09-10; the miss keeps both of its bytes.
//
// THE HIT'S TWO LINES ARE THE FOUNDER'S OWN, ruled the same night after he read the
// page as its actual reader. What this page shows is a SUMMARY — service, city,
// month, band — and by roadmap §7 it must never show her phone, her name, the exact
// date or the figure. So "your enquiry DETAILS are with us" is the true sentence:
// the rest exists, and it is with us. The line beneath says where, and it is a LINK,
// because a sentence a stranger has to retype into a browser is a dead end wearing a
// CTA's clothes. This is the vendor-join door this file's header has owed since D2.
//
// "SIGN IN" AND NOT "JOIN", and the choice was examined rather than inherited: the
// recipient of `tdw_assist_lead_outside_v2` is by definition not on TDW, and my own
// read-first argued she has no key for that door. The front door offers Join and
// Sign in side by side (F-41.1's rider), so the link lands her where both are. The
// founder's word stands and the shape is what makes it true.

import { NextRequest } from 'next/server';

// The door is a network read, so nothing here may be cached at the edge.
export const dynamic = 'force-dynamic';

const TITLE = 'The Dream Wedding';

// `||` and not `??` — R-41.106. `process.env.X` is `string | undefined`, so the two
// differ on exactly one value, the empty string, and `??` would let it through.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';
const BUILD = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
  || process.env.VERCEL_GIT_COMMIT_SHA
  || 'unknown';

// ── THE VETOED BYTES, ONE HOME EACH ─────────────────────────────────────────
const HOME = 'https://thedreamwedding.in';

const S = {
  hitTitle:  'Your enquiry details are with us',
  // Rendered as `Sign in to <a>thedreamwedding.in</a>` — the domain is the link text
  // and the whole line is one vetoed byte, split here only so the anchor can wrap the
  // half that is an address. `subLink` is escaped like everything else.
  hitSubLead: 'Sign in to ',
  hitSubLink: 'thedreamwedding.in',
  missTitle: 'Your enquiry is with us',
  missSub:   'Reply on the WhatsApp message and we will send you the full details.',
  noIdTitle: 'Enquiry not found',
  noIdSub:   'Reply on WhatsApp and we will send it again.',
  service:   'Service',
  city:      'City',
  month:     'Month',
  budget:    'Budget',
};

// Minimal, total, and applied at EVERY interpolation site without exception. The
// five are the whole set a text node or a double-quoted attribute can be broken
// out of; there is no partial version of this function worth having.
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Row = { label: string; value: string };

function page(line: string, sub: string, rows: Row[] = [], subHref?: string, subLink?: string): Response {
  // A null value omits its whole ROW (chair's ruling) — never a dash, never an
  // empty cell. `category` is NOT NULL on `assistance_request_items`, so a found
  // enquiry always draws at least one row and the block is never an empty frame.
  const table = rows.length === 0 ? '' :
    `<dl>${rows.map(r => `<dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd>`).join('')}</dl>`;

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="robots" content="noindex">` +
    `<meta name="theme-color" content="#F8F7F5">` +
    `<meta name="color-scheme" content="light">` +
    `<meta name="tdw-build" content="${esc(BUILD)}">` +
    `<title>${TITLE}</title>` +
    `<style>` +
    `html{color-scheme:light}` +
    `body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;` +
    `background:#F8F7F5;color:#0C0A09;font:400 16px/1.6 system-ui,-apple-system,sans-serif;padding:32px}` +
    `main{max-width:420px;width:100%;text-align:center}` +
    `h1{font:400 24px/1.3 Georgia,serif;font-style:italic;margin:0 0 14px;color:#0C0A09}` +
    `p{margin:0;color:rgba(12,10,9,0.62);font-size:15px}` +
    // The one gold on this page, and it is the action — `.pv-cta`'s ink from
    // app/v/[code]/page.tsx:970, so a link here and a button on the storefront are
    // the same colour of "do this next". Underlined: it is prose, not a control.
    `a{color:#7A621C;text-decoration:underline;text-underline-offset:2px}` +
    `dl{margin:22px 0 18px;padding:0;text-align:left;border-top:1px solid rgba(12,10,9,0.10)}` +
    `dt{margin:0;padding:12px 0 0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;` +
    `color:rgba(12,10,9,0.50)}` +
    `dd{margin:0;padding:2px 0 12px;font-size:16px;color:#0C0A09;` +
    `border-bottom:1px solid rgba(12,10,9,0.10)}` +
    `</style></head><body><main><h1>${esc(line)}</h1>${table}<p>${esc(sub)}${
      subHref && subLink ? `<a href="${esc(subHref)}">${esc(subLink)}</a>` : ''
    }</p></main></body></html>`,
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );
}

interface Enquiry {
  category?: string | null;
  city?: string | null;
  month?: string | null;
  budget_band?: string | null;
}

// ONE ANSWER FOR EVERY MISS, and the network is a miss too. A door that is down,
// a non-200, a body that will not parse and a token that names nothing all return
// `null` here, so this page tells a prober exactly as little as the door does. The
// shape of the failure is in the server log, never on the glass.
async function fetchEnquiry(token: string): Promise<Enquiry | null> {
  try {
    const r = await fetch(`${API_BASE}/api/v2/public/enquiry/${encodeURIComponent(token)}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.found === true && j.enquiry ? (j.enquiry as Enquiry) : null;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  // No id is not an enquiry. Same answer either way — the page never confirms or
  // denies that a given id exists, because guessing would leak which ids are real.
  if (!id) return page(S.noIdTitle, S.noIdSub);

  // Both ways, per the round-trip note in the header. The prefix is not re-derived
  // from `/r/`'s constant: this route owns its own address and must read the form
  // that arrives at it, whichever window we are in.
  const token = `enq-${id.replace(/^enq-/i, '')}`;

  const enquiry = await fetchEnquiry(token);
  if (!enquiry) return page(S.missTitle, S.missSub);

  const rows: Row[] = [];
  if (enquiry.category)    rows.push({ label: S.service, value: String(enquiry.category) });
  if (enquiry.city)        rows.push({ label: S.city,    value: String(enquiry.city) });
  if (enquiry.month)       rows.push({ label: S.month,   value: String(enquiry.month) });
  if (enquiry.budget_band) rows.push({ label: S.budget,  value: String(enquiry.budget_band) });

  // A `found:true` with every field null cannot happen (category is NOT NULL) but
  // is not asserted here: if it ever did, the miss sentence is the honest answer
  // and an empty framed box is not.
  if (rows.length === 0) return page(S.missTitle, S.missSub);

  return page(S.hitTitle, S.hitSubLead, rows, HOME, S.hitSubLink);
}
