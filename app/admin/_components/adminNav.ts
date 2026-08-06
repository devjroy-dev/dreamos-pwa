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
//   CORPSE   dead code awaiting a sweep.

export type Disposition = 'LIVE' | 'PHANTOM' | 'RETIRES' | 'CORPSE';

export type DomainKey = 'bridge' | 'growth' | 'marketplace' | 'people' | 'money' | 'engine' | 'content';

export interface Section {
  label: string;
  path: string;
  icon: string;
  /** Extra words the palette matches on but the nav does not show. */
  hints?: string[];
  /** Present only on RETIRES entries: the sitting that ends this surface. */
  retiresAt?: string;
}

export interface Domain {
  key: DomainKey;
  label: string;
  icon: string;
  /** Rendered when a domain has no live sections yet. Honest, never blank. */
  empty?: string;
  sections: Section[];
}

// ═════════════════════════════════════════════════════════════════════════════
// THE SIX DOMAINS (A-1: Growth · Marketplace · People · Money · Engine ·
// Content), plus the Bridge, which is a destination and not a domain.
// ═════════════════════════════════════════════════════════════════════════════

export const BRIDGE: Section = { label: 'The Bridge', path: '/admin', icon: 'bridge', hints: ['home', 'dashboard', 'today'] };

export const DOMAINS: Domain[] = [
  {
    key: 'growth', label: 'Growth', icon: 'growth',
    sections: [
      { label: 'Prospects',     path: '/admin/prospects',              icon: 'inbox', hints: ['lane', 'outreach', 'closer', 'marketing'] },
      { label: 'Demo Profiles', path: '/admin/demo',                   icon: 'demo',  hints: ['factory', 'invites', 'claim'] },
    ],
  },
  {
    key: 'marketplace', label: 'Marketplace', icon: 'marketplace',
    sections: [
      { label: 'Discover Approvals', path: '/admin/approvals/discover', icon: 'discover',  hints: ['deck', 'eligible', 'review'] },
      { label: 'Photo Approvals',    path: '/admin/approvals/photos',   icon: 'photos',    hints: ['portfolio', 'queue'] },
      { label: 'Portfolios',         path: '/admin/vendors/portfolio',  icon: 'portfolio', hints: ['gallery', 'images'] },
      { label: 'Couture',            path: '/admin/couture',            icon: 'couture',   hints: ['appointments'] },
      { label: 'Hot Dates',          path: '/admin/hot-dates',          icon: 'calendar',  hints: ['availability'] },
    ],
  },
  {
    key: 'people', label: 'People', icon: 'people',
    sections: [
      { label: 'Makers',        path: '/admin/makers',                 icon: 'makers',    hints: ['vendors', 'tier', 'suppliers'] },
      { label: 'Dreamers',      path: '/admin/dreamers',               icon: 'dreamers',  hints: ['couples', 'brides'] },
      { label: 'Vendor Chats',  path: '/admin/conversations/vendors',  icon: 'chat',      hints: ['conversations', 'threads', 'transcripts'] },
      { label: 'Bride Chats',   path: '/admin/conversations/brides',   icon: 'chatHeart', hints: ['conversations', 'threads', 'transcripts'] },
    ],
  },
  {
    key: 'money', label: 'Money', icon: 'money',
    // HONEST EMPTY STATE, NOT A HIDDEN DOMAIN. A-1 rules six domains and six is
    // what ships. Money's surfaces (revenue, subscriptions, unit economics) are
    // P5's build and every candidate route today is a PHANTOM — see the table.
    // F-10.1 is the deeper reason: `billing_events`, the table P5 rolls up from,
    // does not exist anywhere but spec prose.
    empty: 'The Money domain arrives at P5. Its surfaces are unbuilt, not hidden.',
    sections: [],
  },
  {
    key: 'engine', label: 'Engine', icon: 'engine',
    sections: [
      { label: 'AI Caps', path: '/admin/config', icon: 'config', hints: ['model', 'matrix', 'provider', 'spend', 'admin_config'] },
    ],
  },
  {
    key: 'content', label: 'Content', icon: 'content',
    sections: [
      { label: 'Landing',     path: '/admin/content/landing',     icon: 'landing',   hints: ['front door', 'hero copy'] },
      { label: 'Exploring',   path: '/admin/content/exploring',   icon: 'exploring', hints: ['categories', 'browse'] },
      { label: 'Spotlight',   path: '/admin/content/spotlight',   icon: 'spotlight', hints: ['top of feed', 'editorial'] },
      { label: 'Muse Pool',   path: '/admin/content/muse-pool',   icon: 'muse',      hints: ['inspiration'] },
      { label: 'Surprise Me', path: '/admin/content/surprise-me', icon: 'surprise',  hints: ['random'] },
      // R-A4: stamped with the SITTING's name, never a block number. The
      // founder's sequencing (admin → bride → leftovers) has moved the
      // spotlight consolidation past its old "09" address, and a stamp naming a
      // slipping date rots into a lie. No palette entry for either heroes
      // surface — see PALETTE_EXCLUDED below.
      { label: 'Heroes', path: '/admin/content/heroes', icon: 'heroes', retiresAt: 'SPOTLIGHT-CONSOLIDATION' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Surfaces that are REACHABLE but must not be OFFERED. The palette proposes
// destinations; proposing one that is chartered to die teaches the founder a
// habit the estate intends to break.
// ─────────────────────────────────────────────────────────────────────────────
export const PALETTE_EXCLUDED: string[] = ['/admin/content/heroes', '/admin/discover-heroes'];

/** Every section the shell mounts, flattened, Bridge first. Nav and palette
 *  read this same array so they cannot drift apart. */
export const ALL_SECTIONS: Section[] = [BRIDGE, ...DOMAINS.flatMap(d => d.sections)];

/** The palette's static destinations: mounted, minus the chartered-dead. */
export const PALETTE_SECTIONS: Section[] = ALL_SECTIONS.filter(s => !PALETTE_EXCLUDED.includes(s.path));

// ═════════════════════════════════════════════════════════════════════════════
// THE MAPPING TABLE — R-A3. Every non-login admin route at pwa f9b0600,
// derived by `find app/admin -name page.tsx`, 38 routes, /admin/login excluded
// as the auth door. 37 rows below; 19 LIVE (18 sections + the Bridge), 18
// PHANTOM. The count is asserted by the bench, not by this comment.
// ═════════════════════════════════════════════════════════════════════════════

export interface MappedRoute {
  path: string;
  domain: DomainKey | null;
  disposition: Disposition;
  note?: string;
}

export const ROUTE_MAP: MappedRoute[] = [
  // ── LIVE ───────────────────────────────────────────────────────────────────
  { path: '/admin',                          domain: 'bridge',      disposition: 'LIVE' },
  { path: '/admin/prospects',                domain: 'growth',      disposition: 'LIVE' },
  { path: '/admin/demo',                     domain: 'growth',      disposition: 'LIVE' },
  { path: '/admin/approvals/discover',       domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/approvals/photos',         domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/vendors/portfolio',        domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/couture',                  domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/hot-dates',                domain: 'marketplace', disposition: 'LIVE' },
  { path: '/admin/makers',                   domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/dreamers',                 domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/conversations/vendors',    domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/conversations/brides',     domain: 'people',      disposition: 'LIVE' },
  { path: '/admin/config',                   domain: 'engine',      disposition: 'LIVE' },
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
  { path: '/admin/collab',                   domain: 'people',      disposition: 'PHANTOM', note: 'F-07.95: zero-sibling backend. 04.5\'s Collab Hub has no admin twin.' },
  { path: '/admin/money',                    domain: 'money',       disposition: 'PHANTOM', note: 'F-07.95: zero-sibling backend. P5 rebuilds; blocked on F-10.1 (billing_events does not exist).' },
  { path: '/admin/revenue',                  domain: 'money',       disposition: 'PHANTOM', note: 'F-07.95: zero-sibling backend. Same blocker.' },
  { path: '/admin/subscriptions',            domain: 'money',       disposition: 'PHANTOM', note: 'F-07.95 names an unreadable predicate AND client-minted amounts here. Do not mount before P5 reads it.' },
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
