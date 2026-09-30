// docs/design/tools/roomtable.mjs · DESIGN-1 landing: every vendor page of the new layout, for LANDING-HANDOVER.md's room
// table. One server with no default layout; each room is opened twice at 374 (Graphite), classic (no layout cookie
// beyond 'classic') and new ('v2', the switch's own cookie), and the tool records for each: where each landed, whether
// the two are pixel-identical (UNCHANGED), and the controls and headings in the page's main column on each side (the
// same set: RESTYLED; a changed set: REWORKED, then read by eye). The new layout's shot is kept at
// docs/design/shots/rooms/<slug>.png; the classic one goes to CLASSIC_DIR (outside the repo) for the comparison only.
// usage: PORT=4100 FROM=0 TO=12 CLASSIC_DIR=/tmp/x node docs/design/tools/roomtable.mjs   (appends to OUT_JSON)
import fs from 'fs';
import path from 'path';
import { browser, open, sleep, OUT } from './harness.mjs';

export const ROOMS = [
  // the five tabs and what each holds
  ['today', 'Today (Home)', '/vendor/today'], ['events', 'Events', '/vendor/events'], ['event-page', 'An event (page)', '/vendor/events/ev-0102'],
  ['leads', 'Enquiries', '/vendor/leads'], ['enquiry-page', 'An enquiry (page)', '/vendor/leads/lead-0001'], ['referrals', 'Referrals', '/vendor/referrals'],
  ['calendar', 'Calendar', '/vendor/calendar'],
  ['clients', 'Clients', '/vendor/clients'], ['client-page', 'A client (page)', '/vendor/clients/bind-0003'], ['contracts', 'Contracts', '/vendor/contracts'], ['notes', 'Notes', '/vendor/notes'],
  ['invoices', 'Invoices', '/vendor/invoices'], ['invoice-page', 'An invoice (page)', '/vendor/invoices/inv-0003'], ['payment-reminders', 'Payment reminders', '/vendor/payment-reminders'],
  ['expenses', 'Expenses', '/vendor/expenses'], ['tds', 'TDS', '/vendor/tds'], ['books', 'Books', '/vendor/books'],
  // More and its rows
  ['more', 'More', '/vendor/more'], ['rooms', 'Rooms (old address)', '/vendor/rooms'],
  ['storefront', 'Storefront', '/vendor/storefront'], ['portfolio', 'Portfolio', '/vendor/portfolio'], ['packages', 'Packages', '/vendor/packages'],
  ['your-website', 'Your website', '/vendor/your-website'], ['wedding-pages', 'Wedding pages', '/vendor/wedding-pages'], ['google-reviews', 'Google reviews', '/vendor/google-reviews'],
  ['posts', 'Posts & ads', '/vendor/posts'], ['ads', 'Ads', '/vendor/posts/ads'], ['number', 'Your own number', '/vendor/number'],
  ['couture', 'Couture', '/vendor/couture'], ['team', 'Team', '/vendor/team'], ['collab', 'Collab', '/vendor/collab'], ['collab-responses', 'Collab responses', '/vendor/collab/p1/responses'],
  ['exchange', 'Influencer exchange', '/vendor/exchange'], ['introductions', 'Introductions', '/vendor/introductions'], ['dates', 'Open dates & rates', '/vendor/dates'],
  ['advisor', 'Advisor', '/vendor/advisor'], ['support', 'Business Solutions', '/vendor/support'], ['billing', 'Billing', '/vendor/billing'], ['settings', 'Settings', '/vendor/settings'],
  // outside the shell
  ['onboarding', 'Onboarding', '/vendor/onboarding'], ['discover', 'Discover', '/vendor/discover'], ['discover-profile', 'Discover profile', '/vendor/discover/profile'],
  ['discover-preview', 'Discover preview', '/vendor/discover/preview'], ['discover-submit', 'Discover submit', '/vendor/discover/submit'],
  ['pin', 'PIN', '/vendor/pin'], ['pin-login', 'PIN login', '/vendor/pin-login'], ['pin-reset', 'PIN reset', '/vendor/pin-reset'],
];

async function census(p) {
  return p.evaluate(() => {
    const root = document.querySelector('main.wl-main') || document.querySelector('main') || document.body;
    const skip = (e) => e.closest('.wl-search, [data-search], header, nav, .wl-dock, .wl-ask, .wl-tabs');
    const norm = (t) => (t || '').replace(/\s+/g, ' ').replace(/[·•]\s*\d+$/, '').replace(/[↓↑→›⌄‹]/g, '').trim().toLowerCase();
    const out = new Set();
    for (const e of root.querySelectorAll('button, a, h1, h2, h3, [role=tab], input, select, textarea')) {
      if (skip(e) || e.offsetParent === null) continue;
      const t = norm((e.innerText || '').trim() || e.getAttribute('placeholder') || e.getAttribute('aria-label'));
      if (t && t.length <= 60) out.add(e.tagName.toLowerCase().replace(/^h[1-3]$/, 'h') + ':' + t);
    }
    return [...out].sort();
  });
}

const FROM = +(process.env.FROM || 0), TO = +(process.env.TO || ROOMS.length);
const CLASSIC = process.env.CLASSIC_DIR;
const OUTJ = process.env.OUT_JSON;
fs.mkdirSync(path.join(OUT, 'shots/rooms'), { recursive: true });
const b = await browser();
const rows = fs.existsSync(OUTJ) ? JSON.parse(fs.readFileSync(OUTJ, 'utf8')) : {};
for (const [slug, label, route] of ROOMS.slice(FROM, TO)) {
  const side = {};
  for (const layout of ['classic', 'v2']) {
    const p = await open(b, route, { layout, wait: 'main, body', settle: 2500 });
    await sleep(800);
    const png = await p.screenshot({ type: 'png' });
    const at = await p.evaluate(() => location.pathname);
    side[layout] = { at, controls: await census(p), png };
    if (layout === 'v2') fs.writeFileSync(path.join(OUT, `shots/rooms/${slug}.png`), png);
    else fs.writeFileSync(path.join(CLASSIC, `${slug}.png`), png);
    await p.close();
  }
  const a = new Set(side.classic.controls), c = new Set(side.v2.controls);
  const inter = [...a].filter((x) => c.has(x)).length, uni = new Set([...a, ...c]).size;
  rows[slug] = { label, route, classicAt: side.classic.at, v2At: side.v2.at, identical: Buffer.compare(side.classic.png, side.v2.png) === 0,
    jaccard: uni ? +(inter / uni).toFixed(2) : 1, onlyClassic: [...a].filter((x) => !c.has(x)), onlyV2: [...c].filter((x) => !a.has(x)) };
  console.log(slug, rows[slug].v2At, rows[slug].identical ? 'IDENTICAL' : 'j=' + rows[slug].jaccard);
  fs.writeFileSync(OUTJ, JSON.stringify(rows, null, 1));
}
await b.close();
