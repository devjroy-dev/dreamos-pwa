// app/admin/_components/adminNav.ts
// THE SIX-DOMAIN IA — TDW_10 P1, A-1 (founder law) · CE rulings R-A3 / R-A4.
//
// ── WHAT THIS FILE IS ────────────────────────────────────────────────────────
// One home for the admin's information architecture. The shell renders DOMAINS
// (below); the command palette searches SECTIONS; the mapping table accounts
// for every route that exists, mounted or not. All three read this file, so the
// three can never disagree — which is the whole reason the nav const moved out
// of layout.tsx.
//
// ── ROUTE PATHS ARE BYTE-UNCHANGED, AND THAT IS THE REDIRECT ANSWER ─────────
// §0.2 REPORT, NOT A QUIET ADAPTATION. The charter says "deep links preserved
// via redirects". P1 re-homes sections into domains at the NAVIGATION layer and
// moves NO route: /admin/couture is /admin/couture before and after. Redirects
// therefore have nothing to redirect — the clause is DISCHARGED BY
// CONSTRUCTION, not skipped. The arm that WOULD need them (domain-prefixed
// URLs, e.g. /admin/marketplace/couture) is NOT BUILT and is named here so
// nobody reads its absence as an oversight: it is an unruled arm, and under the
// unruled-arm law an unruled arm is not built. If the chair wants prefixed
// URLs, that is a fork with 37 redirects attached, and it should be ruled on
// its own evidence rather than inferred from one word in a charter.
//
// ── DISPOSITIONS ─────────────────────────────────────────────────────────────
//   LIVE     mounted in a domain by this file; reachable from the shell.
//   PHANTOM  the route exists, nothing links to it. F-07.95's inheritance,
//            owned WHOLE by masterplan row 10 at its own sitting (CE-122,
//            founder-ruled). Tabled here, deliberately NOT mounted: mounting a
//            surface nobody has audited would launder eighteen unknowns into
//            the founder's nav.
//   RETIRES  chartered to die at a named sitting. Mounted (it works today) but
//            carrying its death warrant, and given no palette entry.
//   RETIRED  the page is GONE from the tree. The row survives as a TOMBSTONE so
//            a future reader who finds the path in a bookmark, a log line, or
//            F-07.95's ledger learns what happened to it and by whose word,
//            instead of finding silence and re-creating it. Never mounted, never
//            in the palette. A registry that lists only what exists cannot answer
//            "where did it go" — which is the question a phantom ledger actually
//            gets asked.
//   CORPSE   dead code awaiting a sweep.

// ── ADM-1 · THE NEW STRUCTURE (CE-47, 1 Oct 2026) ───────────────────────────
// Five places, plain names: Home, Demo profiles, Vendors, Dreamers, More. Every route path is
// kept; nothing is removed. Vendors shows two routes as one page (Joined = /admin/makers,
// Being reached = /admin/prospects); Dreamers likewise (All = /admin/dreamers, Asked for help =
// /admin/assistance). Everything else lives in More, in plain groups. The old Bridge is
// "All numbers" at /admin/numbers. The ROUTE_MAP below is unchanged apart from those two routes.
export type Disposition = 'LIVE' | 'PHANTOM' | 'RETIRES' | 'RETIRED' | 'CORPSE';

export type DomainKey = 'bridge' | 'growth' | 'marketplace' | 'people' | 'money' | 'engine' | 'content';

export interface Section {
  label: string;
  path: string;
  icon: string;
  sub?: string;
  hints?: string[];
  retiresAt?: string;
}

export type PlaceKey = 'home' | 'demo' | 'vendors' | 'dreamers' | 'more';
export interface Place { key: PlaceKey; label: string; short: string; path: string; icon: string; owns: string[] }

export const PLACES: Place[] = [
  { key: 'home',     label: 'Home',          short: 'Home',     path: '/admin',          icon: 'home',     owns: ['/admin'] },
  { key: 'demo',     label: 'Demo profiles', short: 'Demo',     path: '/admin/demo',     icon: 'demo',     owns: ['/admin/demo'] },
  { key: 'vendors',  label: 'Vendors',       short: 'Vendors',  path: '/admin/makers',   icon: 'vendors',  owns: ['/admin/makers', '/admin/prospects'] },
  { key: 'dreamers', label: 'Dreamers',      short: 'Dreamers', path: '/admin/dreamers', icon: 'dreamers', owns: ['/admin/dreamers', '/admin/assistance'] },
  { key: 'more',     label: 'More',          short: 'More',     path: '/admin/more',     icon: 'more',     owns: [] },
];

/** Which place a path belongs to. Anything not owned by the first four is More. */
export function placeFor(pathname: string): PlaceKey {
  for (const p of PLACES) {
    if (p.key === 'more') continue;
    if (p.owns.some(o => (o === '/admin' ? pathname === '/admin' : pathname === o || pathname.startsWith(o + '/')))) return p.key;
  }
  return 'more';
}

/** The four pages Dev uses every day, as the palette names them. */
export const DAILY: Section[] = [
  { label: 'Home',                    path: '/admin',            icon: 'home',     hints: ['today', 'bridge', 'dashboard'] },
  { label: 'Demo profiles',           path: '/admin/demo',       icon: 'demo',     hints: ['factory', 'invites', 'claim'] },
  { label: 'Vendors, joined',         path: '/admin/makers',     icon: 'vendors',  hints: ['makers', 'tier', 'plan'] },
  { label: 'Vendors, being reached',  path: '/admin/prospects',  icon: 'vendors',  hints: ['prospects', 'openers', 'outreach'] },
  { label: 'Dreamers',                path: '/admin/dreamers',   icon: 'dreamers', hints: ['people', 'app users'] },
  { label: 'Asked for help',          path: '/admin/assistance', icon: 'help',     hints: ['assistance', 'concierge', 'requests', 'forward'] },
];

export interface MoreGroup { title: string; sections: Section[] }
export const MORE_GROUPS: MoreGroup[] = [
  { title: 'Approvals', sections: [
    { label: 'Discover requests', path: '/admin/approvals/discover', icon: 'star',  sub: 'Vendors asking to be shown on Discover', hints: ['deck', 'eligible', 'review'] },
    { label: 'Photos to check',   path: '/admin/approvals/photos',   icon: 'photo', sub: 'Portfolio photos waiting for a yes or no', hints: ['portfolio', 'queue', 'looks'] },
    { label: 'Collab calls',      path: '/admin/collab',             icon: 'star',  sub: 'Calls waiting to go on TDW\'s Instagram and Threads, and prospects', hints: ['collab', 'instagram', 'threads', 'prospects', 'share'] },
  ] },
  { title: 'Chats', sections: [
    { label: 'Vendor chats',  path: '/admin/conversations/vendors', icon: 'chat', sub: 'Vendors talking to the assistant', hints: ['conversations', 'threads'] },
    { label: 'Dreamer chats', path: '/admin/conversations/brides',  icon: 'chat', sub: 'Dreamers talking to the assistant', hints: ['conversations', 'threads'] },
  ] },
  { title: 'Discover and showcase', sections: [
    { label: 'Couture',                    path: '/admin/couture',           icon: 'star',  sub: 'Invite-only vendors', hints: ['appointments'] },
    { label: 'Auspicious dates',           path: '/admin/hot-dates',         icon: 'cal',   sub: 'Muhurat dates shown in the app', hints: ['hot dates', 'availability'] },
    { label: 'Upload photos for a vendor', path: '/admin/vendors/portfolio', icon: 'image', hints: ['portfolio', 'gallery'] },
  ] },
  { title: 'Pictures in the Dreamers\' app', sections: [
    { label: 'Front page slideshow',  path: '/admin/content/landing',     icon: 'image', hints: ['landing', 'front door'] },
    { label: 'Just exploring gallery', path: '/admin/content/exploring',  icon: 'image', hints: ['exploring', 'browse'] },
    { label: 'Vendors of the week',   path: '/admin/content/spotlight',   icon: 'image', hints: ['spotlight', 'editorial'] },
    { label: 'Starter mood board',    path: '/admin/content/muse-pool',   icon: 'image', sub: 'Muse pool', hints: ['muse', 'inspiration'] },
    { label: 'Taste quiz pictures',   path: '/admin/content/surprise-me', icon: 'image', sub: 'Surprise me', hints: ['surprise', 'random'] },
    { label: 'Discover top pictures', path: '/admin/content/heroes',      icon: 'image', sub: 'Being replaced by Vendors of the week', retiresAt: 'SPOTLIGHT-CONSOLIDATION' },
  ] },
  { title: 'Settings', sections: [
    { label: 'Switches',          path: '/admin/switchboard', icon: 'sliders', sub: 'Turn features on or off, AI models, vendor layout', hints: ['switchboard', 'gates', 'flags', 'templates', 'meta'] },
    { label: 'AI message limits', path: '/admin/config',      icon: 'gear',    sub: 'Daily and monthly limits per plan', hints: ['caps', 'model', 'spend'] },
    { label: 'All numbers',       path: '/admin/numbers',     icon: 'chart',   sub: 'Money, AI spend, outreach and demo progress', hints: ['bridge', 'stats', 'revenue'] },
  ] },
];

export const PALETTE_EXCLUDED: string[] = ['/admin/content/heroes', '/admin/discover-heroes'];

export const ALL_SECTIONS: Section[] = [...DAILY, { label: 'More', path: '/admin/more', icon: 'more', hints: ['everything else', 'settings'] }, ...MORE_GROUPS.flatMap(g => g.sections)];

export const PALETTE_SECTIONS: Section[] = ALL_SECTIONS.filter(s => !PALETTE_EXCLUDED.includes(s.path));

export interface MappedRoute {
  path: string;
  domain: DomainKey | null;
  disposition: Disposition;
  note?: string;
}

export const ROUTE_MAP: MappedRoute[] = [
  // ── LIVE ───────────────────────────────────────────────────────────────────
  { path: '/admin',                          domain: 'bridge',      disposition: 'LIVE' },
  { path: '/admin/numbers',                  domain: 'bridge',      disposition: 'LIVE' }, // ADM-1: the old Bridge, "All numbers"
  { path: '/admin/more',                     domain: 'bridge',      disposition: 'LIVE' }, // ADM-1: More
  { path: '/admin/prospects',                domain: 'growth',      disposition: 'LIVE' },
  { path: '/admin/collab',                   domain: 'growth',      disposition: 'LIVE' }, // CE-47 CLB-1: F-44.300 cured; src/api/admin/collab.js serves it
  { path: '/admin/demo',                     domain: 'growth',      disposition: 'LIVE' },
  { path: '/admin/approvals/discover',       domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/approvals/photos',         domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/vendors/portfolio',        domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/couture',                  domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/hot-dates',                domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/makers',                   domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/dreamers',                 domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/assistance',               domain: 'people',      disposition: 'LIVE' }, // Block 20 s1
  { path: '/admin/conversations/vendors',    domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/conversations/brides',     domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/config',                   domain: 'engine',      disposition: 'LIVE' },
  { path: '/admin/switchboard',              domain: 'engine',      disposition: 'LIVE' }, // CE-41 seat C, C2 (R-41.8)
  { path: '/admin/content/landing',          domain: 'content',     disposition: 'LIVE' },
  { path: '/admin/content/exploring',        domain: 'content',     disposition: 'LIVE' },
  { path: '/admin/content/spotlight',        domain: 'content',     disposition: 'LIVE' },
  { path: '/admin/content/muse-pool',        domain: 'content',     disposition: 'LIVE' },
  { path: '/admin/content/surprise-me',      domain: 'content',     disposition: 'LIVE' },

  // ── RETIRES ────────────────────────────────────────────────────────────────
  { path: '/admin/content/heroes',           domain: 'content',     disposition: 'RETIRES',
    note: 'RETIRES-AT-SPOTLIGHT-CONSOLIDATION (CE-123). A 5-line ContentPage shim over /api/v2/admin/discover-heroes. Mounted because it works today; excluded from the palette; no token work spent on it.' },

  // ── PHANTOM — F-07.95, masterplan row 10, its own sitting ─────────────────
  { path: '/admin/discover-heroes',          domain: 'content',     disposition: 'PHANTOM',
    note: '494 ln. The heroes pair\'s second half. Dies with its twin at the spotlight consolidation; excluded from the palette.' },
  { path: '/admin/approvals',                domain: 'marketplace', disposition: 'PHANTOM', note: 'Index route above the two live approval surfaces.' },
  { path: '/admin/photos',                   domain: 'marketplace', disposition: 'PHANTOM', note: 'Older sibling of /admin/approvals/photos — which of the pair is authoritative is F-07.95\'s question, not P1\'s.' },
  { path: '/admin/featured',                 domain: 'marketplace', disposition: 'PHANTOM', note: 'FEATURED is the paid pipeline (CE-123). Backend exists at src/api/admin/featured.js.' },
  { path: '/admin/preview',                  domain: 'marketplace', disposition: 'PHANTOM', note: 'F-07.95 names preview a zero-sibling backend.' },
  { path: '/admin/exploring',                domain: 'content',     disposition: 'PHANTOM', note: 'Older sibling of /admin/content/exploring.' },
  { path: '/admin/images',                   domain: 'content',     disposition: 'PHANTOM' },
  { path: '/admin/vendors',                  domain: 'people',      disposition: 'PHANTOM', note: 'Older sibling of /admin/makers.' },
  { path: '/admin/couples',                  domain: 'people',      disposition: 'PHANTOM', note: 'Older sibling of /admin/dreamers.' },
  { path: '/admin/messages',                 domain: 'people',      disposition: 'PHANTOM', note: 'F-07.95: zero-sibling backend.' },
  // ── TOMBSTONES · F-10.76, RETIRED at the tier & money sitting (2026-08-07) ──
  // Founder ruling, verbatim: 「 retire. 」 · Fork F ruled RETIRE ALONGSIDE.
  //
  // All three fetched endpoints with ZERO server-side homes and rendered `|| 0`,
  // so the screens named Money and Revenue displayed Rs 0 two taps from the
  // Bridge's true revenue. They were not stale; they were CONTRADICTORY, which is
  // worse — and they contradicted a number the founder had just watched arrive.
  //
  // The deeper reading, recorded here because it outlives these three rows:
  // /api/v3 HAS NO SERVER AT ALL. src/index.js mounts /api/v2 and nothing else,
  // while this repo carries 22 /api/v3 call sites across 10 pages — every one a
  // guaranteed 404. That is F-10.84, FILED and HOMED TO F-07.95's sitting, not
  // cured here: these three died because the founder ruled on them by name, and a
  // sitting that widened its own ruling to the other seven would be legislating.
  //
  // CONTROL INVENTORY, taken BEFORE the delete (CE-115's law): Money carried one
  // interactive control, an Export CSV button over `|| 0` fields —
  // REMOVED-BY-RULING, it exported a table of zeroes. Revenue and Subscriptions
  // carried NONE; that expected-zero is stated rather than assumed.
  //
  // The real Money domain is the Bridge's revenue block (P2 + the A4 rider) and
  // the vendor's own subscription surface. TDW_10_ADMIN_FINAL §P5 rebuilds this
  // domain properly on `billing_events`, which now exists and has rows.
  { path: '/admin/money',                    domain: 'money',       disposition: 'RETIRED', note: 'RETIRED 2026-08-07 (F-10.76, founder 「 retire. 」). Fetched /api/v3/admin/money/overview — no server home; rendered Rs 0 beside the Bridge\'s true revenue. One Export-CSV control REMOVED-BY-RULING. P5 rebuilds on billing_events.' },
  { path: '/admin/revenue',                  domain: 'money',       disposition: 'RETIRED', note: 'RETIRED 2026-08-07 (F-10.76, founder 「 retire. 」). Fetched /api/v2/admin/revenue — no server home. Zero interactive controls. P5 rebuilds on billing_events.' },
  { path: '/admin/subscriptions',            domain: 'money',       disposition: 'RETIRED', note: 'RETIRED 2026-08-07 (F-10.76, Fork F ruled retire-alongside). Fetched /api/v3/admin/makers — the whole v3 namespace is unmounted (F-10.84). Zero interactive controls. Vendor subscription truth now lives on the vendor\'s own surface.' },
  { path: '/admin/health',                   domain: 'engine',      disposition: 'PHANTOM', note: 'F-07.95: zero-sibling backend. P4\'s health board rebuilds it.' },
  { path: '/admin/data',                     domain: 'engine',      disposition: 'PHANTOM', note: 'F-07.95: zero-sibling backend.' },
  { path: '/admin/control-room',             domain: 'engine',      disposition: 'PHANTOM', note: 'Name collides with the shell\'s own wordmark eyebrow; provenance unread.' },
  { path: '/admin/dashboard',                domain: 'bridge',      disposition: 'PHANTOM', note: 'F-07.95 names a dashboard-HALF. The Bridge (P2) is its successor; do not link both.' },

  // ── CORPSE — R-A1 rider (i): not revived, not deleted now ─────────────────
  { path: 'app/globals.css [data-theme="dark"] (:123)', domain: null, disposition: 'CORPSE',
    note: 'The ancestral admin palette — the "Enterprise Design System" block. `data-theme` is set by NOTHING in the tree (grep, zero hits), so the block is unreachable. Disposition P6-SWEEP: not revived (R-A1 chose a third set), not deleted this phase (deleting a stylesheet block is a blast radius nobody has measured).' },
];

/** LIVE + RETIRES: everything the shell actually mounts. */
export const MOUNTED_PATHS: string[] = ROUTE_MAP
  .filter(r => r.disposition === 'LIVE' || r.disposition === 'RETIRES')
  .map(r => r.path);

export function domainOf(path: string): DomainKey | null {
  const hit = ROUTE_MAP.find(r => r.path === path);
  return hit ? hit.domain : null;
}
