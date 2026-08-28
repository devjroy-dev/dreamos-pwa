// lib/solutions/client.ts — TDW_19 P0-B · ONE FETCHER PER DOOR.
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS FILE MAKES NO SECOND AUTH HOME AND DECLARES NO SECOND SHAPE
// ═══════════════════════════════════════════════════════════════════════════
// `lib/vendor/api/vendor.ts:3` states the estate's rule in its own header:
// *screen components import from here — never raw fetch.* So every call below
// goes through `getJson` from `lib/vendor/api/_base`, which owns the origin, the
// bearer header, the refresh-on-401 hop and the error envelope. A `fetch()` in
// this file would be a second authentication path that works right up until the
// session refresh logic changes underneath it.
//
// AND NO TYPE IS DECLARED HERE. Every shape comes from `./types`, whose digest
// is mirrored against the backend's `contract.js`. A response type re-declared
// at the fetch site is a third home for a contract that already has exactly two,
// and it would be the one no digest covers.
//
// ── THE ENVELOPE ───────────────────────────────────────────────────────────
// The doors answer `{ ok: true, <key>: <payload> }` — `src/lib/response.js`'s
// `ok()`. Each fetcher unwraps its own key and returns the payload, so a surface
// never touches the envelope and a change to the envelope lands in one file.

import { getJson } from '@/lib/vendor/api/_base';
import { API } from './routes';
import type {
  SolutionsIndex,
  GoogleStatus,
  DomainStatus,
  DomainSearchResult,
  SeoReport,
  MarketingDraft,
  ProofDoc,
  BenchmarksReport,
} from './types';

type Env<K extends string, T> = { ok: boolean } & { [P in K]: T };

export async function fetchIndex(): Promise<SolutionsIndex> {
  const r = await getJson<Env<'index', SolutionsIndex>>(API.index());
  return r.index;
}

export async function fetchGoogle(): Promise<GoogleStatus> {
  const r = await getJson<Env<'google', GoogleStatus>>(API.google());
  return r.google;
}

export async function fetchDomain(): Promise<DomainStatus> {
  const r = await getJson<Env<'domain', DomainStatus>>(API.domain());
  return r.domain;
}

/**
 * ⚠ THE `live` FLAG IS PART OF THE ANSWER, NOT NOISE.
 *
 * The backend returns `{ results: [], live: false }` when the P2 gate is closed
 * — an empty list because the registrar is not wired, NOT because nothing
 * matched the search. A surface that saw only `results` would render "no
 * domains available" over a vendor's own business name, which is a false
 * statement about the world rather than an empty state. Both are returned so the
 * surface can tell the two apart.
 */
export async function searchDomains(q: string): Promise<{ results: DomainSearchResult[]; live: boolean }> {
  const r = await getJson<{ ok: boolean; results: DomainSearchResult[]; live?: boolean }>(API.domainSearch(q));
  return { results: r.results || [], live: r.live !== false };
}

export async function fetchSeo(): Promise<SeoReport> {
  const r = await getJson<Env<'seo', SeoReport>>(API.seo());
  return r.seo;
}

export async function fetchMarketing(): Promise<MarketingDraft[]> {
  const r = await getJson<Env<'drafts', MarketingDraft[]>>(API.marketing());
  return r.drafts;
}

export async function fetchProof(): Promise<ProofDoc[]> {
  const r = await getJson<Env<'docs', ProofDoc[]>>(API.proof());
  return r.docs;
}

export async function fetchBenchmarks(): Promise<BenchmarksReport> {
  const r = await getJson<Env<'benchmarks', BenchmarksReport>>(API.benchmarks());
  return r.benchmarks;
}
