// lib/solutions/types.ts — TDW_19 · THE WIRE CONTRACT, ONE HOME (R-19.3).
//
// ═══════════════════════════════════════════════════════════════════════════
// WHAT THIS FILE IS, AND WHAT IT COSTS TO CHANGE
// ═══════════════════════════════════════════════════════════════════════════
// Every door in spec §4–§7 answers in one of the shapes below. P1 through P6
// build to these. Changing a field name later is a LABELLED AMENDMENT, not an
// edit — because six phases and a backend mirror read from here.
//
// THE MIRROR IS `dream-os/src/api/vendor/solutions/contract.js`. Two repos
// cannot import from each other, so the mirror is kept honest by a DIGEST:
// `CONTRACT_DIGEST` below is the sha256 of this file's declarations, and the
// same 64 characters are carried as a literal in `contract.js`. Each side
// recomputes its own half and compares to the literal, so a field added on one
// side alone REDDENS THAT SIDE. Making it green again forces the literal to
// change, and two differing literals are a one-line diff in the ZIP.
//
// ⚠ WHAT THE DIGEST DOES NOT COVER, stated because a gate that overclaims is
// worse than none (D-38.1). The digest is over FIELD NAMES ONLY. A field
// RENAMED is caught. A field RETYPED — `number` to `string`, a union member
// added — is NOT, because the TypeScript type text below and the JSDoc type
// text in the mirror will never match byte for byte and pretending otherwise
// would make the comparison fail on correct trees. The specific class this
// leaves open is the money unit, so that class gets its own cell instead:
// `bs_audit.mjs` asserts every money field name ends in `Paise`.
//
// ── THE PARSE CONTRACT, so the instrument can be sound ──────────────────────
// `tools/bs_audit.mjs` reads this file as TEXT (TypeScript types are erased at
// runtime; there is nothing to import). It can only do that soundly if the
// declarations are regular. Therefore, BINDING ON THIS FILE:
//   · every shape is `export type Name = {` … `};`, opening brace on the first
//     line and the closing `};` in column 1;
//   · one field per line, `name: type;` — no inline nested object literals.
//     A nested shape gets its own named type (SeoChecklist, SeoTopQuery).
// If the parse cannot satisfy itself, the instrument aborts GATE-UNSOUND and
// prints no verdicts at all. It never reports a smaller set as if it were the
// whole one.
//
// ── MONEY (R-19.3) ─────────────────────────────────────────────────────────
// Every money field is an INTEGER OF PAISE and its name ends in `Paise`. It is
// rendered ONLY at the edge, ONLY through `formatRs` in `lib/vendor/format.ts`
// — the estate's one money home — as `formatRs(paise / 100)`. This file adds no
// second formatter and no component builds a money string by hand.
//
// F-19.15 (CE-38 relay #1): `public.invoices.amount_total` is a RUPEES integer
// (docs/db/PUBLIC_SCHEMA.md:626) and this rail is paise. P2's pass-through line
// converts at the invoices room's OWN write door, never on write from here.
//
// ── STATUS VOCABULARY ──────────────────────────────────────────────────────
// The `status` unions below are the CHIP vocabulary of spec §9, not the column
// vocabulary of the candidate DDL in spec §4/§5 (`pending|active|revoked|error`).
// No DDL is chartered and no table is read this sitting, so the wire owes its
// words to the founder's approved chip set and nothing else. When the DDL lands,
// the door maps column → chip; the wire does not move.

/** The six rows of spec §0, in delivery order. The slug is the URL segment. */
export type SolutionsRow = {
  slug: 'google' | 'website' | 'seo' | 'marketing' | 'proof' | 'benchmarks';
  phase: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
  live: boolean;
  state: 'not_connected' | 'connected' | 'needs_attention' | 'searching' | 'live' | 'expired' | 'coming';
};

/**
 * The room index. `GET /api/v2/vendor/solutions`.
 *
 * `live` per row comes from `env.js`'s `gates()` — which key is set, nothing
 * else. A row whose gate is closed reports `state: 'coming'` and the surface
 * renders the `coming` chip. Turning a row on is setting a key (R-19.5).
 */
export type SolutionsIndex = {
  rows: readonly SolutionsRow[];
};

/**
 * `GET /api/v2/vendor/solutions/google` (spec §4).
 *
 * `gbpQuotaApproved` is DELIBERATELY SEPARATE from `live`. Spec §8 gates the
 * OAuth flow on the credential keys and gates the SYNC CALLS on
 * `GBP_QUOTA_APPROVED`; collapsing the two into one boolean would erase a
 * distinction the spec drew on purpose, and would tell a vendor the row is dead
 * when in fact she can connect and only the sync is withheld.
 */
export type GoogleStatus = {
  status: 'not_connected' | 'connected' | 'needs_attention';
  accountName: string | null;
  locationName: string | null;
  reviewUrl: string | null;
  reviewRequestsSent: number;
  lastSyncedAt: string | null;
  lastError: string | null;
  gbpQuotaApproved: boolean;
};

/**
 * `GET /api/v2/vendor/solutions/domain` (spec §5).
 *
 * `subdomain` is the ruled shape of CE-38 relay #1 item 4:
 * `handle ? lower(handle) + '.' + STOREFRONT_ROOT : null`. `routing_handle` is
 * NULLABLE with no default (docs/db/PUBLIC_SCHEMA.md:1130) and is minted
 * UPPERCASE (src/agent/onboarding.js:174-192, src/agent/engine.js:1270), so a
 * vendor mid-onboarding has no address and one who has finished has an address
 * nobody would ever type in caps. Both cases are handled by `subdomainFor`.
 */
export type DomainStatus = {
  status: 'none' | 'searching' | 'registering' | 'wiring' | 'live' | 'expired' | 'error';
  subdomain: string | null;
  domain: string | null;
  liveUrl: string | null;
  registeredAt: string | null;
  expiresAt: string | null;
  renewalPricePaise: number | null;
  autoRenew: boolean;
  forwardEmail: string | null;
  lastError: string | null;
};

/** One row of `GET …/domain/search?q=` (spec §5: `name · Rs 799 / year · Get`, ≤5). */
export type DomainSearchResult = {
  domain: string;
  available: boolean;
  pricePaise: number | null;
};

/** What is actually live on the storefront (spec §6). Booleans, never a score. */
export type SeoChecklist = {
  structuredData: boolean;
  sitemap: boolean;
  canonical: boolean;
  ownDomain: boolean;
  searchConsole: boolean;
};

/** One of the five query rows (spec §6). */
export type SeoTopQuery = {
  query: string;
  impressions: number;
  clicks: number;
};

/**
 * `GET /api/v2/vendor/solutions/seo` (spec §6).
 *
 * NO SCORE FIELD, and its absence is the point — spec §6 refuses "SEO score out
 * of 100" by name. There is nowhere on this shape to put one.
 */
export type SeoReport = {
  impressionsThisMonth: number;
  impressionsLastMonth: number;
  clicksThisMonth: number;
  clicksLastMonth: number;
  topQueries: readonly SeoTopQuery[];
  checklist: SeoChecklist;
};

/** One authored artifact from spec §7's P4 tools. TDW never publishes it. */
export type MarketingDraft = {
  id: string | null;
  kind: 'post' | 'referral' | 'ad_brief';
  status: 'none' | 'ready' | 'sent';
  headline: string | null;
  body: string | null;
  imageUrls: readonly string[];
  createdAt: string | null;
  sentAt: string | null;
};

/** One of the three PDFs of spec §7's P5. `stale` means a Couture change outran it. */
export type ProofDoc = {
  kind: 'rate_card' | 'one_pager' | 'qa';
  status: 'none' | 'ready' | 'stale';
  url: string | null;
  generatedAt: string | null;
};

/**
 * One metric of spec §7's P6. `mine` and `median` are NULLABLE together with
 * the cohort floor: below five vendors the median is not computed and not sent,
 * so there is no number on the wire for a surface to leak by accident.
 */
export type Benchmark = {
  metric: 'first_reply_minutes' | 'reply_rate' | 'enquiries_per_month' | 'conversion_rate';
  mine: number | null;
  median: number | null;
  direction: 'above' | 'below' | 'same' | 'unknown';
};

/**
 * `GET /api/v2/vendor/solutions/benchmarks` (spec §7).
 *
 * `cohort` lives HERE and not on `Benchmark`, because the cohort is a property
 * of the (city, category) pair and not of a metric. R-19.4's empty shape is
 * `{cohort: 0}` and the surface renders the below-cohort sentence off it.
 * NEVER another vendor's number: only `mine` and a median are ever on the wire.
 */
export type BenchmarksReport = {
  city: string | null;
  category: string | null;
  cohort: number;
  metrics: readonly Benchmark[];
};

// ═══════════════════════════════════════════════════════════════════════════
// THE SUBDOMAIN TRANSFORM — one home here, mirrored in contract.js
// ═══════════════════════════════════════════════════════════════════════════
//
// ⚠ REPORTED, NOT ADAPTED (§0.2). CE-38 relay #1 item 4 ruled this transform
// has one home in `lib/solutions/` and is mirrored in `contract.js`, with a
// parity cell over both. Built exactly as ruled. The observation the chair may
// want, offered once and not acted on: the DOOR already returns `subdomain` on
// `DomainStatus`, so a surface that only renders what it was handed would need
// no client-side copy at all, and the mirror exists to be kept in sync rather
// than because two callers need it. The pwa copy does earn its place at
// `/v/[code]` and wherever the address is shown before the door answers. If the
// chair wants the mirror collapsed to the backend alone, that is one word and
// this block plus its parity fixture come out together.

/**
 * The storefront root. Spec §8 sets `STOREFRONT_ROOT_DOMAIN` on Railway AND
 * Vercel; this constant is the literal R-19.4 ruled and the default both sides
 * fall back to. The backend overrides from env; the client cannot read Railway
 * env and does not try.
 */
export const STOREFRONT_ROOT = 'thedreamwedding.in';

/**
 * `routing_handle` → the vendor's web address, or null.
 *
 * Lowercased because `DEV550.thedreamwedding.in` is not an address any human
 * types. Null in, null out, because a vendor mid-onboarding has no handle and
 * `null.thedreamwedding.in` is the byte that ships if nobody rules — the
 * surface renders `COPY.subdomainPending` instead.
 *
 * THE FIXTURE BELOW IS THE PARITY CONTRACT. `contract.js` carries the same
 * table with the same expected values; each side asserts its own implementation
 * against these literals, so neither repo has to read the other and a change to
 * either implementation reddens that side alone.
 */
export function subdomainFor(handle: string | null | undefined, root: string = STOREFRONT_ROOT): string | null {
  if (typeof handle !== 'string') return null;
  const trimmed = handle.trim();
  if (!trimmed) return null;
  return trimmed.toLowerCase() + '.' + root;
}

/**
 * `routing_handle` → the vendor's PATH address on the shared domain, or null.
 *
 * ── F-38.49 · ONE HOME FOR THE VENDOR'S ADDRESS ────────────────────────────
 *
 * The estate had TWO independent statements of a vendor's web address, in two
 * rooms, in two shapes, each carrying its own copy of the domain literal:
 *
 *   Business Solutions → Website   `dev440.thedreamwedding.in`   subdomainFor(), here
 *   Today → Your link              `thedreamwedding.in/v/DEV440` a literal in
 *                                                                lib/worklist/copy.ts
 *
 * The founder walked both and both 404'd. The 404s are their own findings; the
 * DUPLICATION is this one, and it is the older disease: two homes for one decision,
 * and the second home is the one that stops agreeing. A domain change would have had
 * to be made twice, and a reader asking 「what is a vendor's address」 got two answers
 * with nothing saying which.
 *
 * ONE ROOT, TWO FORMS, ONE HOME. Both builders sit beside each other and both derive
 * from `STOREFRONT_ROOT`. Neither carries a domain literal of its own. Which form the
 * product ships is a chair ruling and not a constant's business; this file's job is
 * that the answer is stated once.
 *
 * The case is preserved rather than lowercased, and the asymmetry with `subdomainFor`
 * is deliberate: a DNS label is case-insensitive and `DEV550.thedreamwedding.in` is not
 * an address anyone types, but a URL path is case-SENSITIVE and `/v/DEV440` is the byte
 * the route actually matches. Lowercasing here would build an address that resolves in
 * one form and 404s in the other.
 */
export const PATH_ADDRESS_SEGMENT = 'v';

export function pathAddressFor(handle: string | null | undefined, root: string = STOREFRONT_ROOT): string | null {
  if (typeof handle !== 'string') return null;
  const trimmed = handle.trim();
  if (!trimmed) return null;
  return root + '/' + PATH_ADDRESS_SEGMENT + '/' + trimmed;
}

/** [input, expected] against the default root. Mirrored verbatim in contract.js. */
export const SUBDOMAIN_FIXTURE: readonly (readonly [string | null, string | null])[] = [
  ['DEV550', 'dev550.thedreamwedding.in'],
  ['dev550', 'dev550.thedreamwedding.in'],
  ['AB-CD', 'ab-cd.thedreamwedding.in'],
  ['  PADDED  ', 'padded.thedreamwedding.in'],
  ['', null],
  [null, null],
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// THE DIGEST
// ═══════════════════════════════════════════════════════════════════════════
// Derived, never typed from memory:
//   node tools/bs_audit.mjs --print-digest
// Paste the result here AND into `CONTRACT_DIGEST` in
// `dream-os/src/api/vendor/solutions/contract.js`. The two must be identical
// strings; that identity is the whole mechanism.
export const CONTRACT_DIGEST = 'e31a1a2414ee3cb6e95a83c2fbb536cf80a20df4f4f614098e7e6b663b55f650';
