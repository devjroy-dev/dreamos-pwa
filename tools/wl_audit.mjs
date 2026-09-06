#!/usr/bin/env node
// tools/wl_audit.mjs — R-37.85 · THE EXECUTABLE GATE.
//
// One paste:  node tools/wl_audit.mjs https://<branch-domain>
//
// WHY IT LIVES IN tools/ AND NOT scripts/ (ZIP 13, CE ruling F-5(a)).
// `scripts/run-floor.sh` globs `scripts/*.mjs` and runs every hit BARE, with the
// exit code as the verdict. This file's usage guard exits 2 with no URL, so from
// the day it landed in scripts/ it was a permanent floor red — and ZIP 11's and
// ZIP 12's "twenty-three cells, exit 0" could not have been true at a pristine
// tip. It is an INSTRUMENT, not a bench. The rejected alternative is quoted into
// the ruling that moved it: making it exit 0 bare would be *an instrument that
// passes when it did nothing, which is the shape this gate exists to refuse.*
//
// AGAINST THE SERVED TREE, NOT THE SOURCE. Every assertion fetches a deployed
// URL. A grep over source proves the source; this proves the deploy. That
// distinction is the whole point — the estate has been burned by a source that
// was right beside a build that was stale.
//
// ITS OWN HONESTY. Where an assertion CANNOT be made from served bytes, the
// script says INCONCLUSIVE and says why. A gate that reports PASS for something
// it did not test is worse than no gate — it launders an assumption into a
// verdict.
//
// Zero dependencies. Node 18+ for global fetch.
'use strict';

const BASE = (process.argv[2] || '').replace(/\/$/, '');
if (!BASE) {
  console.error('usage: node tools/wl_audit.mjs https://<branch-domain> [--any-commit]');
  process.exit(2);
}
// ── F-38.37 · THE GATE NAMES THE TREE IT MEASURED ──────────────────────────
// Without this the run is unattributable: every FAIL reads either as 「the cure is missing」
// or as 「the deploy predates the cure」, and this seat spent four gate runs and two blind
// freshness checks failing to tell those apart. The build stamps its commit
// (next.config.ts, components/worklist/WorklistShell.tsx); this compares it to the tree on
// disk and REFUSES on a mismatch rather than printing verdicts about somebody else's build.
//
// `--any-commit` exists because measuring an OLD deploy on purpose is legitimate — but it
// has to be asked for, out loud, so a mismatch can never be absorbed as a passing detail.
const ANY_COMMIT = process.argv.includes('--any-commit');

// ── M-FINISH S2 · THE REGISTRY IS READ, NOT RETYPED ────────────────────────
// The interim list below used to be fourteen literals copied out of lib/worklist/rooms.ts.
// Two homes for one set, and the second home is the one that stops agreeing: the moment
// six rooms crossed, this file would have gone on asserting that their /vendor hrefs were
// legitimate and the cell would have PASSED on a shell linking backwards. That is not a
// hypothetical — it is what this edit was about to be, until the list was derived instead.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// F-38.60 / F-07.99: imported AND invoked at the read below. A stripper that is ported and
// never called fooled this estate for a whole block; the invocation is the point.
import { stripComments } from '../scripts/lib/stripComments.mjs';
const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
// ── F-38.60 · THE REGISTRY IS PARSED AS CODE, SO ITS PROSE MUST GO FIRST ────
//
// `registryDeclaredSet` matched quoted strings with a PAIR matcher, `'([^']+)'`, against
// the raw block — comments included. At §4-4 the `INTERIM_VENDOR_LINKS` block reached
// **21 apostrophes**, an ODD count, because the entries' own quotes sit among prose that
// says 「R-38.7's row」, 「Storefront's Discover row's class」, 「TEAM'S THREE」. One unmatched
// apostrophe offsets every pairing after it, so real entries fall INSIDE phantom strings
// and out of the set.
//
// ⚠ AND THE ASYMMETRY IS THE WHOLE DIAGNOSTIC, BECAUSE IT SHOWS THE EARLIER ENTRIES WERE
// NEVER SAFE EITHER. `/vendor/discover/preview`, `/vendor/discover/profile` and
// `/vendor/discover` parsed correctly for one reason only: the comment apostrophes ABOVE
// each of them happened to arrive in EVEN numbers (running counts 4, 8, 12). §4-4's comment
// contributed THREE — 「TEAM'S」, 「Storefront's」, 「row's」 — the count went odd at 15, and
// Team's three entries were swallowed. **The set that passed was passing by luck, and the
// luck ran out on the first entry added after an odd comment.**
//
// THIS IS F-38.46's DEFECT IN ITS THIRD HOME. `b40` C5 read `copy.ts` — 151 apostrophes —
// with the same pairing and could not fail; the pairing was abandoned there rather than
// repaired. The lesson reached that cell and not this file. And `b40` C24 reads THIS SAME
// REGISTRY with the same shape of matcher and has always been immune — because it calls
// `strip()` first. **One reader stripped and one did not, and only the unstripped one was
// ever going to break.**
//
// THE ESTATE ALREADY OWNS THE CURE AND THIS FILE WAS NOT CALLING IT.
// `scripts/lib/stripComments.mjs` is F-07.74's one home, a character scan with
// string-literal tracking, and F-07.99 is the finding about a stripper that was ported and
// never invoked. Imported and invoked ONCE, at the read, so every derivation below sees
// code and no derivation has to remember to strip.
const REGISTRY = stripComments(readFileSync(join(REPO, 'lib/worklist/rooms.ts'), 'utf8'));
/**
 * EVERY DECLARED SET, READ FROM ITS DECLARATION AND NOT FROM ITS NAME.
 *
 * ── F-38.57 · THE EXTRACTOR READ A COMMENT AND HANDED BACK THE WRONG ARRAY ──
 * `INTERIM_HUB_PRIMERS[^=]*=\s*\[…\]` finds the FIRST occurrence of the symbol. At §4-3 the
 * first occurrence stopped being the declaration: C-2's ruling text above
 * `INTERIM_VENDOR_LINKS` cites `INTERIM_HUB_PRIMERS` by name to explain why the two sets are
 * separate, there is no `=` between that mention and the LINKS declaration below it, and so
 * `[^=]*` walked straight across the prose and captured **the links array**.
 *
 * The primers were therefore absent from `ALLOWED`, and the seven declared doors — six
 * `/vendor?draft=` and calendar's `/vendor?aiPrimer=` — reported as strays. **A FAIL ABOUT
 * THE TREE FOR A FAULT IN THE READER**, and the tree was correct: both entries are declared
 * in the registry with their source lines, exactly where the third band ratified them.
 *
 * ⚠ THE COMMENT THAT BROKE IT WAS RIGHT TO EXIST. Naming the other set is how a reader
 * learns why there are two; the defect is a parser keyed on a bare symbol against a file
 * that discusses its own symbols in prose. **A census keyed on a symbol counts homonyms**
 * (CE-38's own banked law, and F-38.53 restated it one sitting ago). Anchored on
 * `export const NAME` now, which is the DECLARATION and cannot be written in passing.
 *
 * AND IT REFUSES RATHER THAN RETURNING `[]`. An empty set here does not read as "broken" —
 * it reads as "nothing is allowed", so every declared exception becomes a stray and the gate
 * reports a catastrophe about a correct tree. That is F-38.44's shape, third sighting on
 * this arc: a reader that defaults on a miss converts its own breakage into a verdict.
 */
const registryDeclaredSet = (name) => {
  const m = REGISTRY.match(new RegExp('export const ' + name + '[^=]*=\\s*\\[([\\s\\S]*?)\\] as const;'));
  if (!m) {
    console.error('GATE-UNSOUND — `export const ' + name + '` not found in lib/worklist/rooms.ts. '
      + 'Every /vendor exception this gate allows is read from it, so an empty set would report '
      + 'every declared door as a stray. Refusing instead.');
    process.exit(3);
  }
  return (m[1].match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1)).filter((s) => s.startsWith('/vendor'));
};
/** Every /vendor href the registry itself still ships, in its own words. */
const registryVendorHrefs = () =>
  (REGISTRY.match(/href:\s*'(\/vendor\/[^']+)'/g) || []).map((x) => x.match(/'([^']+)'/)[1]);
/** The declared outbound exceptions. R-38.11's amended standing binds the two CROSSING
 *  ledgers; this set grows by named entry at a crossing and shrinks only at Phase 7 (C-2,
 *  §4-3), so reading it is the only way the cell tracks it rather than restating a snapshot. */
// P7.2 (CE-39, 2026-09-04): the INTERIM_* censuses retired with the old tree; the one
// declared set left is LEGACY_VENDOR_LINKS — the doors out of the shell into app/vendor/(legacy).
const registryVendorLinks = () => registryDeclaredSet('LEGACY_VENDOR_LINKS');
/** The declared hub primers — F-38.47's seven doors, product cure chartered to their own
 *  design sitting (AskSheet grows a `draft` parameter), not to any crossing batch. */
/**
 * EVERY /w SURFACE THE REGISTRY DECLARES \u2014 DERIVED, BECAUSE A CROSSING MUST NOT NEED
 * THIS FILE TO BE REMEMBERED.
 *
 * The two lists below used to be hand-typed. They were correct for exactly as long as the
 * shell served eleven rooms, and calendar crossed at \u00a74-2 \u2014 at which point every cell
 * scoped by them would have gone on asserting eleven surfaces while the vendor walked
 * twelve, and the twelfth would have been the one nobody looked at. That is the SAME
 * disease this file cured in its own interim list at S2 \u00a75, one list further down.
 *
 * Each of the seven remaining crossings widens this gate in the same edit that changes a
 * href. Nothing to remember, and nothing to forget.
 */
const registryShellRooms = () =>
  [...REGISTRY.matchAll(/id:\s*'([a-z]+)'[^}]*href:\s*'\/vendor\/([a-z]+)'/g)].map((m) => '/vendor/' + m[2]);

/** The Slice Door's fallback prefix \u2014 declared in the registry, read here, never retyped. */

let pass = 0, fail = 0, incon = 0;
const P = (n, why) => { console.log('PASS         ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL         ' + n + '  — ' + why); fail++; };
const I = (n, why) => { console.log('INCONCLUSIVE ' + n + '  — ' + why); incon++; };

async function get(path) {
  const res = await fetch(BASE + path, { redirect: 'follow', headers: { 'user-agent': 'wl-audit' } });
  return { status: res.status, url: res.url, body: await res.text() };
}

// ── F-38.56 · THE GATE MANUFACTURED ITS OWN GATE-UNSOUND ────────────────────
//
// Witnessed on the founder's terminal: ~325 chunk fetches from one IP with no spacing,
// Vercel 403s the repeats, and the run reports the corpus incomplete. A single-fetch
// control returned 200 on the very same chunk seconds later. **The tree was fine and the
// instrument's appetite was the finding.**
//
// AN INSTRUMENT MUST NOT CONVERT ITS OWN APPETITE INTO A VERDICT ABOUT THE TREE. That is
// this arc's recurring shape — F-38.44's `-1` slice, the extractor that read a comment,
// the corpus that defaulted to `''` — arriving this time through the network rather than
// through a regex. The three cures below are ordered by what they cost:
//
//   (1) CACHE, and it is the cheapest half by a wide margin. Chunk URLs are content-hashed
//       and SHARED: the layout chunk is ONE url referenced by all nineteen pages, so the
//       old loop fetched identical bytes nineteen times. Deduplicating across pages —
//       not merely within one — is most of the volume gone for nothing but a Map.
//   (2) PACING. What is left is spaced, so a burst never looks like a scrape.
//   (3) RETRY WITH BACKOFF on 403/429 only. A 404 is a fact about the deploy and is not
//       retried; a 403 from a CDN is a fact about US.
//
// AND THE REPORT DISTINGUISHES THEM, which is the half that makes the run readable: a
// chunk REFUSED after N retries and a chunk ABSENT are different findings with different
// owners, and collapsing them into 「unreachable」 is what sent the founder looking at his
// deploy for a defect that was in this file.
const chunkCache = new Map();
const SPACING_MS = 75;
const RETRIES = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** A chunk, fetched at most once per run however many pages reference it. */
async function getChunk(url) {
  if (chunkCache.has(url)) return chunkCache.get(url);
  let out = null;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await sleep(400 * Math.pow(2, attempt - 1));
    else await sleep(SPACING_MS);
    try {
      const r = await get(url);
      // 403/429 are the CDN declining US. Anything else — including 404 — is an answer
      // about the deploy, and retrying it would only turn one honest fact into four.
      if (r.status === 403 || r.status === 429) { out = { kind: 'refused', status: r.status, attempts: attempt + 1 }; continue; }
      out = r.status === 200 ? { kind: 'ok', body: r.body } : { kind: 'absent', status: r.status };
      break;
    } catch (e) {
      out = { kind: 'error', message: e.message };
    }
  }
  chunkCache.set(url, out);
  return out;
}

// ── THE COVERAGE PREAMBLE  [F-16.36 · CE ruling F-1(a)] ─────────────────────
//
// THE DEFECT THIS REPLACES, both halves, because the second was the dangerous one:
//
//   (1) FETCH. The old reader took only `src="/_next/static/….js"` attributes,
//       capped the list at forty, and swallowed a failed chunk in a bare
//       `catch {}`. A corpus assembled that way cannot distinguish "the class is
//       absent" from "the chunk carrying it never arrived" — and it printed
//       false GREENS with exactly the confidence it printed false reds.
//
//   (2) SCOPE. It read ONE page per assertion. `.wl-card*` is declared in the
//       shared shell chunk and consumed by FirstRun on /w/today, so a sweep over
//       the /w/rooms corpus alone reported five live classes as dead. Legitimate
//       cross-page declaration read as rot.
//
// THE KICKOFF SAID "walk the Next build manifest." IT CANNOT BE DONE, and that
// correction is derived, not asserted: Next 16's App Router emits no
// `app-build-manifest.json`, and `build-manifest.json` is not served over HTTP.
// There is no manifest at a fetchable URL to walk. What IS provable from served
// bytes is every `/_next/static/*.js` string the HTML carries, in any position —
// script src, preload link, or flight payload. That is the enumeration below.
//
// AN INSTRUMENT THAT CANNOT PROVE IT LOOKED EVERYWHERE DOES NOT GET TO SAY
// "ABSENT," IN EITHER DIRECTION. A miss aborts the whole run as GATE-UNSOUND and
// prints no verdicts at all — not one PASS, not one FAIL. A partial verdict set
// is the thing this preamble exists to prevent.
// ── M-FINISH S1 · THE CORPUS FOLLOWS THE SHELL ──────────────────────────────
// Billing, Settings and Advisor crossed into /w this sitting, so the corpus reads them
// THERE. `/vendor/list/leads` stays: it is one of the fourteen rooms that has NOT crossed
// (lib/worklist/rooms.ts INTERIM_VENDOR_ROOMS), and the italic-serif and drawer-overlay
// cells below are assertions ABOUT a carried room. Dropping it would have made those cells
// pass by having nothing to look at.
// M-FINISH S2 §4-1: the six crossed rooms join the corpus. `/vendor/list/leads` STAYS —
// it is the surviving fallback and the R-37.79 one-drawer cell reads it as the carried
// tree's specimen. A crossed room and its fallback are two different surfaces now and both
// are fetched, because the interesting failure is them disagreeing.
// ── THE THREE SURFACES THAT ARE NOT ROOMS, NAMED; EVERYTHING THAT IS, DERIVED ──
//
// `/w` is the entry redirect, `/w/today` is a nav seat, and **`/w/rooms` is the directory
// itself** \u2014 none of them is a registry entry, because none of them is a room.
//
// ⚠ `/w/rooms` WAS MISSING FROM THE FIRST CUT OF THIS LINE AND IT COST A WHOLE GATE RUN.
// Half the cells in this file read the Rooms corpus; with the page unfetched they were
// handed `undefined`, six of them reported the shell bundle as absent, and the run threw on
// `.includes`. The seat that wrote it printed 「PAGES = 14 surfaces」, checked the COUNT, and
// did not read the membership sitting in the same output. **A count is not a set** \u2014 which
// is the sentence R-38.19 exists to enforce about floors, applied here to a list of pages.
//
// ⚠ AND THE FIRST GUARD WRITTEN FOR THIS WAS VACUOUS \u2014 CAUGHT BY MUTATING IT.
// It read the three names into a constant and then checked that each one was in `PAGES`.
// `PAGES` is BUILT by spreading that same constant, so the check was true by construction:
// dropping a name removed it from both sides at once and the guard said nothing. **A cell
// that cannot fail on the broken tree is not a cell** (D-38.1), and one guarding the reader
// is no exception. It is deleted rather than shipped.
//
// THE REAL GUARD IS `corpus()` BELOW, and it is non-vacuous by construction rather than by
// intention: a cell that reads a page nobody fetched cannot get an empty string out of it,
// only a named refusal. That is the assertion this defect actually needed \u2014 not "is the
// list I wrote the list I wrote", but "did every cell read bytes this run actually has".
const PAGES = [...new Set(['/vendor', '/vendor/rooms', '/vendor/today', ...registryShellRooms()])];  // P7.2: the carried /vendor/list/leads is deleted
const pageCorpus = new Map();
/**
 * READ A PAGE'S CORPUS, OR REFUSE BY NAME.
 *
 * Cells reached into the Map directly. Some wrote `|| ''` and some did not, so a page
 * missing from PAGES produced two different failures from one cause: cells that defaulted
 * to the empty string reported the shell bundle as ABSENT \u2014 a FAIL about the tree, for a
 * fault in the reader \u2014 and the first cell that did not defaulted to a TypeError that
 * ended the run.
 *
 * **A gate that reports on a page it never fetched is worse than one that stops.** This
 * stops, and it names the page.
 */
const corpus = (path) => {
  if (!pageCorpus.has(path)) {
    console.error('\nGATE-UNSOUND \u2014 no corpus for ' + path + '. It is not in PAGES, so every');
    console.error('assertion scoped to it would be reporting on bytes this run never fetched.');
    process.exit(3);
  }
  return pageCorpus.get(path);
};
let refTotal = 0, gotTotal = 0;
const missed = [];
const refused = [];

async function coverage() {
  for (const page of PAGES) {
    const html = (await get(page)).body;
    // Every occurrence, not merely the src= attributes. Deduplicated, uncapped.
    const refs = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\\ )]+?\.js/g)].map((m) => m[0]))];
    refTotal += refs.length;
    let all = html;
    for (const s of refs) {
      const r = await getChunk(s);
      if (r.kind === 'ok') { all += r.body; gotTotal++; continue; }
      if (r.kind === 'refused') refused.push(page + ' → ' + s + ' (HTTP ' + r.status + ' after ' + r.attempts + ' attempts)');
      else if (r.kind === 'error') missed.push(page + ' → ' + s + ' (' + r.message + ')');
      else missed.push(page + ' → ' + s + ' (HTTP ' + r.status + ')');
    }
    pageCorpus.set(page, all);
  }
  console.log('chunks: ' + gotTotal + ' fetched / ' + refTotal + ' referenced / '
    + chunkCache.size + ' unique urls (' + (refTotal - chunkCache.size) + ' served from cache)\n');
  if (refused.length) {
    // THE CDN DECLINED US, AND THAT IS NOT A CLAIM ABOUT THE TREE. Named separately so the
    // operator reaches for the pacing constants in this file rather than for the deploy.
    console.log('GATE-UNSOUND — refused by the CDN after retries, which is this instrument\'s');
    console.log('appetite and not a defect in the deploy (F-38.56). Raise SPACING_MS or re-run.');
    console.log('Refused:\n  ' + refused.join('\n  '));
  }
  if (missed.length) {
    console.log('GATE-UNSOUND — the corpus is incomplete, so no verdict is trustworthy.');
    console.log('Unreachable:\n  ' + missed.join('\n  '));
    console.log('\nNo assertions were run. Fix the deploy or the reader, then re-run.');
    process.exit(3);
  }
  // A REFUSED CORPUS STOPS THE RUN TOO. Naming the cause separately is so the operator
  // knows where to look; it is not a licence to assert against bytes this run never had.
  if (refused.length) {
    console.log('\nNo assertions were run — the corpus was short by ' + refused.length + ' chunk(s).');
    process.exit(3);
  }

  // ── F-38.37 · WHICH TREE DID THIS JUST MEASURE? ──────────────────────────
  // The stamp is inlined into a chunk by next.config.ts's `env` and referenced by
  // WorklistShell, so it rides the same corpus every cell reads. Placed here — after
  // coverage, before a single assertion — for the same reason the base guard runs before
  // `cp`: a verdict about the wrong build is not a weaker verdict, it is a verdict about
  // something else.
  const whole = [...pageCorpus.values()].join('');
  const stamp = (whole.match(/data-tdw-commit["'\]:=\s]{1,4}["']([0-9a-f]{7}|local)["']/) || [])[1] || null;
  let local = null;
  try {
    local = (await import('node:child_process')).execSync('git rev-parse --short=7 HEAD', { encoding: 'utf8' }).trim();
  } catch { /* not a git checkout — reported below rather than assumed away */ }

  if (!stamp) {
    console.log('DEPLOY: UNSTAMPED — this build predates F-38.37 and cannot say which commit it is.');
    console.log('  Every FAIL below has two readings: the cure is missing, or the deploy predates it.');
    // ⚠ F-39.16 · THE ADVICE CHANGED WITH THE MECHANISM. It used to name
    // next.config.ts's NEXT_PUBLIC_TDW_COMMIT — the very constant that made the stamp go
    // stale twice, because an `env` entry is inlined at build into modules the cache
    // restores unchanged. The id is read per request in app/w/layout.tsx now, so a missing
    // stamp means the /w layout did not render or lost its dynamic opt-out.
    console.log('  The stamp is rendered per request by app/vendor/(shell)/layout.tsx (F-39.16). A missing one means\\n  the /w layout did not render, or its cookies() dynamic opt-out was removed.\\n');
  } else if (local && stamp !== local && !ANY_COMMIT) {
    console.log('REFUSED — the deploy is commit ' + stamp + '; this tree is ' + local + '.');
    console.log('  No assertions were run. A gate that reports on a build the operator did not');
    console.log('  intend launders a stale deploy into a verdict about the current source —');
    console.log('  which is the exact confusion that cost four gate runs at S2/2.');
    console.log('  Wait for the deploy, or pass --any-commit to measure this one on purpose.');
    process.exit(4);
  } else {
    console.log('DEPLOY: ' + stamp + (local ? (stamp === local ? ' = this tree' : ' \u2260 this tree ' + local + ' (--any-commit)') : '') + '\n');
  }
}

(async () => {
  console.log('wl_audit · ' + BASE + '\n');

  try {
    const r = await get('/vendor');
    if (r.status !== 200) { F('reachable', '/w returned ' + r.status); return summary(); }
  } catch (e) { F('reachable', e.message); return summary(); }

  await coverage();

  const shell = corpus('/vendor/rooms');
  // P7.2: the carried specimen (/vendor/list/leads) is deleted with the tree. The R-37.84
  // cells below compared the shell against that carried room; they now compare Rooms against
  // the Leads room — the SAME body, in the shell — so each assertion (one medallion, no italic
  // serif, drawer overlays) still has two surfaces to disagree between. Labeled amendment.
  const room  = corpus('/vendor/leads');
  const settings = corpus('/vendor/settings');
  const billing  = corpus('/vendor/billing');
  const today    = corpus('/vendor/today');

  // ── 0 · the deploy is the one we think it is ─────────────────────────────
  // /w redirects CLIENT-SIDE in a useEffect. A fetch never runs JS, so no request
  // can observe the hop — the original assertion was unprovable by its own method
  // and printed FAIL on a working build. What IS provable from served bytes is
  // that the entry ships the redirect target; the behaviour is source-proved by C17.
  if (/\/vendor\/rooms/.test(corpus('/vendor'))) P('R-37.75 rooms-first', 'the /w entry ships the redirect target');
  else F('R-37.75 rooms-first', 'the /w entry carries no /w/rooms redirect at all');

  // ── ① one medallion ──────────────────────────────────────────────────────
  const coinRing = /1px solid var\(--role-metal\)/;
  const shellCoin = /\.wl-coin\{[^}]*border:1px solid var\(--role-metal\)/.test(shell) || coinRing.test(shell);
  const roomCoin  = coinRing.test(room) && /width:\s*44,\s*height:\s*44/.test(room);
  if (shellCoin && roomCoin) P('R-37.84 ① one medallion', 'both headers carry the metal ring at 44px');
  else F('R-37.84 ① one medallion', 'shell=' + shellCoin + ' room=' + roomCoin);

  // ── ② the header carries the house ───────────────────────────────────────
  if (/The Dream Wedding/.test(shell) && /wl-house/.test(shell)) P('R-37.84 ② the wordmark');
  else F('R-37.84 ② the wordmark', 'no wl-house wordmark in the shell bundle');

  // ── ③ no italic serif in room prose ──────────────────────────────────────
  // NO EXCEPTION LIST, BY RULING. When this fired at ZIP 12's tip it was RIGHT:
  // TipsCarousel:353 paired `fontStyle:'italic'` with an F.display that resolves
  // to Cormorant. ZIP 12's residual table had exempted "F.display + italic" on
  // reasoning derived from OnboardingOverlay and AddSheet — files whose F.display
  // is ITALIANA. The exemption never transferred to a Cormorant file it had not
  // enumerated. The cure was one line at the site, not a clause here.
  const italicScript = /fontStyle:\s*"italic"[^}]{0,80}font-cormorant|font-cormorant[^}]{0,80}fontStyle:\s*"italic"/;
  if (italicScript.test(room)) F('R-37.84 ③ italic serif dies', 'the script family and italic still ship together');
  else P('R-37.84 ③ italic serif dies', 'no script+italic pairing in the Leads bundle');

  // ── ④ the vestiges ───────────────────────────────────────────────────────
  const v = ['Moved to your Discover Profile', 'Moved to Billing'].filter((t) => settings.includes(t));
  if (v.length) F('R-37.84 ④ vestiges die', 'still shipped: ' + v.join(' · '));
  else P('R-37.84 ④ vestiges die');

  // ── ⑤ the link goes home ─────────────────────────────────────────────────
  // This once matched a CLASS NAME, which survives in dead CSS after the markup
  // is gone — and it did, which is how the leftover was found. Assert the markup.
  const inRooms = /wl-plink/.test(shell) && /code[^>]*wl-plink|className:\s*"wl-plink"/.test(shell);
  if (inRooms) F('R-37.84 ⑤ the link goes home', 'the wa.me row still ships in the Rooms bundle');
  else P('R-37.84 ⑤ the link goes home', 'absent from Rooms');
  if (/TDW ENQUIRY LINK/i.test(settings)) P('R-37.84 ⑤ settings section present');
  else I('R-37.84 ⑤ settings row', 'the section label was not found in the served bundle — check by eye');

  // ── ⑥ the drawer is an overlay, AND ONLY WHEN IT IS OPEN ─────────────────
  //
  // AMENDED, LABELLED — CE-38 relay #3 ITEM 1. Cell count unchanged; the predicate gains
  // one clause and the name gains the condition it was always missing.
  //
  // THIS CELL WAS GREEN THROUGHOUT F-38.13, AND THAT IS THE FINDING'S SECOND HALF. It
  // asserted the scrim EXISTS. It never asserted the scrim exists ONLY WHEN THE DRAWER IS
  // OPEN — and an unconditionally mounted scrim satisfies the old predicate perfectly while
  // sitting at zIndex 199 over a coin with no z-index, killing the avatar on fourteen
  // carried rooms. Same disease as F-38.7: PRESENCE STOOD IN FOR BEHAVIOUR, and the cell
  // whose subject was the defect reported a pass on it.
  //
  // ⚠ A CORRECTION TO THE RULING, REPORTED RATHER THAN SILENTLY SPLIT. Relay #3 asks this
  // cell for three assertions: scrim absent at rest, present with the drawer open, and a
  // SYNTHETIC TAP on the coin flipping `profileOpen`. **None of the three is reachable from
  // served bytes.** A fetch runs no JavaScript, dispatches no tap, and has no notion of
  // 「at rest」. By this file's own ratified law (ZIP 14 ①) assertions of that class print
  // INCONCLUSIVE here and never PASS. All three live in the render arm as C-R9, with their
  // own both-ways proof and a capture of a carried room at rest and open.
  //
  // WHAT IS PROVABLE HERE IS THE MECHANISM: the served bundle carries the scrim BEHIND A
  // GUARD rather than as an unconditional element. That is precisely the byte that changed,
  // so this cell reddens at the uncured tree and greens at the cured one, while the arm
  // proves the behaviour the byte was supposed to produce.
  //
  // THE PREDICATE IS ANCHORED ON THE SCRIM'S OWN aria-label, NOT ON `--role-scrim`. The
  // first cut searched for the token and matched `ThemeContext`'s `applyCSSVars`, which
  // calls `setProperty("--role-scrim", …)` several hundred bytes earlier in the same
  // corpus — a site that has no `&&` near it and never will. The cell reddened a CURED
  // tree on that alone. `aria-label:"Close menu"` occurs once and belongs to the element
  // under test; the guard is the `&&` immediately before its `jsx("button"` call.
  const scrimIdx  = room.indexOf('Close menu');
  const scrimSite = scrimIdx > -1 ? room.slice(Math.max(0, scrimIdx - 120), scrimIdx + 200) : '';
  const hasScrim  = /zIndex:\s*199/.test(scrimSite) && /--role-scrim/.test(scrimSite);
  const guarded   = /&&\s*\(0,[\w$.]+\)\("button"/.test(scrimSite);
  if (hasScrim && guarded)
    P('R-37.84 ⑥ drawer overlays, and only when open', 'the scrim ships behind a condition, not as an unconditional mount');
  else if (!hasScrim)
    F('R-37.84 ⑥ drawer overlays, and only when open', 'no fixed scrim in the room bundle — the drawer still renders in flow');
  else
    F('R-37.84 ⑥ drawer overlays, and only when open', 'the scrim is mounted UNCONDITIONALLY — F-38.13: a full-viewport fixed button at zIndex 199 over a coin with no z-index');

  // ── ⑦ / R-37.85 ③ the risen chat, in branch tokens ───────────────────────
  if (/wl-asksheet/.test(shell) && /wl-askpanel/.test(shell)) P('R-37.84 ⑦ the chat mounts');
  else F('R-37.84 ⑦ the chat mounts', 'AskSheet is not in the shell bundle — the dock has nothing to rise');
  if (/wl-dockfield/.test(shell) && !/wa\.me/.test(shell.match(/wl-dockfield[\s\S]{0,600}/)?.[0] || ''))
    P('R-37.85 ③ the dock does not teleport');
  else F('R-37.85 ③ the dock does not teleport', 'the field costume ships beside a wa.me jump');

  // ── R-37.82 the gutter and one-line-row laws ─────────────────────────────
  if (/--wl-gutter/.test(shell) && /\.wl-main > \*\{padding-left:var\(--wl-gutter\)/.test(shell))
    P('R-37.82 ① the gutter law');
  else F('R-37.82 ① the gutter law', 'the column does not own its gutter in the served CSS');
  // ── LABELLED AMENDMENT · M-FINISH S1 · SUBJECT RETIRED, ASSERTION INVERTED ──
  // This cell pinned `.wl-prow` at 52px — the Rooms panel's rows. R-38.7 removes the panel
  // from Rooms entirely and both its bytes moved to their own homes. RETIRE-WITH-THE-
  // READER: the assertion INVERTS rather than vanishing, so a silent re-add of the vetoed
  // horizontal strip reddens. The 52px row height it guarded did not go anywhere — it is
  // now `--wl-row`, emitted from lib/worklist/theme GRID and worn by the drawer rows, the
  // settings row and the plan rows, which the second clause reads. Cell count unchanged.
  //
  // ⚠ THIS AMENDMENT WAS CLAIMED ONCE BEFORE IT EXISTED. The edit that was supposed to
  // write it did not match this line and silently changed nothing, and I reported the
  // amendment as done in the same breath. The audit went on printing the OLD cell's
  // failure message — 「the panel rows do not ship at 52px」 — which is the only reason it
  // was caught: the message named a subject that had been retired, so the text of the red
  // did not match the text of the cell I believed I had written. A verdict whose wording
  // does not match its cell is a verdict about a different tree.
  if (/wl-prow/.test(shell)) F('R-37.82 ② one-line rows', 'the vetoed Rooms panel row ships again');
  else if (/--wl-row:52px/.test(shell)) P('R-37.82 ② one-line rows', 'the panel is gone; the 52px row lives in the grid token');
  else F('R-37.82 ② one-line rows', 'the 52px row token does not ship');

  // ── R-37.79 the shell drawer is the WHOLE drawer  [served bytes] ──────────
  // ── LABELLED AMENDMENT · M-FINISH S1 · ROW SET RECUT, COUNT PRESERVED AT SIX ──
  // 'Discover Profile' LEFT: R-38.7 makes it a row inside Settings, under the founder's
  // byte 「Profile layout」. 'Tips & Features' LEFT: it pointed at /vendor/more, and
  // R-38.1's cell forbids a /vendor href on any shell control; /vendor/more is slated for
  // retirement (P1 handover §7) and the shell's own first-run cards are its manual.
  // 'TDW on WhatsApp' JOINED: R-38.7 gives the founder's byte its one home here.
  // The assertion does not loosen — it still names every row and reddens on any absence.
  // ── LABELLED AMENDMENT · CE-38 relay #3 ITEM 3 · ROW SET RECUT, COUNT PRESERVED AT SIX ──
  // `The Dream Wedding` LEAVES: it opened the marketing site, and product chrome does not
  // need a door to its own homepage. `Reach us` JOINS as the section heading that is
  // actually true of the WhatsApp row — the founder's 「why do i have a dream wedding
  // there?」 was a grouping question and the answer was that three of four rows sat under a
  // heading true of two. `Sign Out` becomes `Sign out`: R-38.6 puts buttons in sentence
  // case, and the engraved Title Case went with the register that carried it.
  // The assertion does not loosen — it still names every row and reddens on any absence.
  const rows = ['Settings', 'Billing', 'Reach us', 'TDW on WhatsApp', 'Sign out', 'Graphite'];
  // ── AMENDED · founder's second walk — ONE DRAWER, ASSERTED ON BOTH TREES ────
  // The cell read the SHELL bundle only, and passed for the whole time a second hardcoded
  // drawer stood behind the same medallion on fourteen carried rooms with different rows,
  // different destinations and three retired-or-banned bytes. A cell scoped to one of two
  // implementations cannot see a divergence between them — which is the same shape as
  // F-38.13's ⑥ (a cell whose subject was the defect, reporting a pass) and the fourth
  // instance this sitting of presence standing in for behaviour.
  //
  // It now asserts the SAME row set on the shell AND on a carried room, and asserts the
  // retired rows are absent from BOTH. A drawer that diverges reddens on whichever side
  // diverged, and the message names which.
  // THE RETIRED-ROW CHECK READS ROW MARKUP, NOT THE WHOLE CORPUS, and the first cut did
  // not. It matched 「DreamAi on WhatsApp」 anywhere in the carried bundle and reddened a
  // cured tree on TipsCarousel's PROSE — body copy that describes the row rather than being
  // it. That is the same over-reach as the withdrawn thedreamwedding.in entry: a retired
  // ROW is a row. Anchored on the drawer's own label span.
  //
  // ⚠ AND THE PROSE IT MATCHED IS NOW A REAL, SMALLER FINDING, FILED NOT CURED:
  // TipsCarousel:25 still tells the vendor to 「Tap "DreamAi on WhatsApp" in your profile」
  // — a control that no longer exists in either drawer. Copy outliving its subject is the
  // wl-plink disease in prose. It is founder-vetoed copy on a carried surface and belongs
  // to the sitting that crosses TipsCarousel, not to this cell.
  const rowLabel = (body, text) => new RegExp('wl-dlabel[^}]{0,80}' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(body)
    || new RegExp('label:"' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"').test(body);
  const RETIRED_ROWS = ['DreamAi on WhatsApp', 'Tips & Features', 'Discover Profile'];
  const missShell   = rows.filter((r) => !shell.includes(r));
  const missCarried = rows.filter((r) => !room.includes(r));
  const aliveShell   = RETIRED_ROWS.filter((r) => rowLabel(shell, r));
  const aliveCarried = RETIRED_ROWS.filter((r) => rowLabel(room, r));
  if (missShell.length)   F('R-37.79 one drawer, both trees', 'shell is missing rows: ' + missShell.join(' \u00b7 '));
  else if (missCarried.length) F('R-37.79 one drawer, both trees', 'the carried room is missing rows: ' + missCarried.join(' \u00b7 ') + ' \u2014 two drawers behind one medallion');
  else if (aliveShell.length)   F('R-37.79 one drawer, both trees', 'retired rows still on the shell: ' + aliveShell.join(' \u00b7 '));
  else if (aliveCarried.length) F('R-37.79 one drawer, both trees', 'retired rows still on the carried room: ' + aliveCarried.join(' \u00b7 '));
  else P('R-37.79 one drawer, both trees', 'the same ' + rows.length + ' rows on Rooms and on the Leads room (P7.2: both shell); ' + RETIRED_ROWS.length + ' retired rows absent from both');

  // ── R-38.1 · NO /vendor HREF REACHABLE FROM A SHELL CONTROL ────────────────
  // THE ASSERTION IS A SET, NOT AN ABSENCE, and that is the whole of its honesty. Fourteen
  // rooms are still carried surfaces this sitting, so 「no /vendor href exists」 would be
  // false on purpose — and an assertion that is false on purpose teaches the next seat that
  // this cell may be argued with. The registry declares the exceptions
  // (INTERIM_VENDOR_ROOMS, INTERIM_VENDOR_LINKS) and the cell asserts that the hrefs
  // actually SHIPPED are exactly those. A room that slides back out of the shell reddens.
  // A room that crosses without leaving the list reddens too.
  // DERIVED FROM THE REGISTRY AT RUN TIME (M-FINISH S2). It was fourteen literals here and
  // eight now; nobody edits this line to make that true. See the note at the top of the file.
  // P7.2 — R-38.1 INVERTED WITH THE FLIP. Every shell href is a /vendor href now, so
  // "no undeclared /vendor href" would forbid the registry itself. The question that
  // survives: a shell control may reach a shell room, the entry redirect, or one of the
  // declared LEGACY doors — and NOTHING that the delete removed. A stray is a door onto a
  // 404 the old tree used to answer.
  const SHELL_ROOM_HREFS = registryVendorHrefs();
  const LEGACY_LINKS = registryVendorLinks();
  const ALLOWED = new Set([...SHELL_ROOM_HREFS, ...LEGACY_LINKS, '/vendor', '/vendor/onboarding']);
  const shellSurfaces = [...new Set(['/vendor/rooms', '/vendor/today', ...registryShellRooms()])];
  const strays = new Set();
  for (const path of shellSurfaces) {
    const body = corpus(path) || '';
    for (const m of body.matchAll(/['"`](\/vendor(?:\/[A-Za-z0-9\/_-]*)?)(?:[?#][^'"`]*)?['"`]/g)) {
      if (ALLOWED.has(m[1])) continue;
      strays.add(path + ' \u2192 ' + m[1]);
    }
  }
  if (strays.size) F('R-38.1 no door onto the deleted tree', [...strays].join(' \u00b7 '));
  else P('R-38.1 no door onto the deleted tree', SHELL_ROOM_HREFS.length + ' shell rooms, ' + LEGACY_LINKS.length + ' declared legacy doors, no stray');

  // ── R-38.2 · TILES AND SEATS ARE ANCHORS ──────────────────────────────────
  // A <button> tells Next nothing, so its chunk and its RSC payload are both fetched ON
  // TAP. This asserts the SHAPE that makes prefetch possible; the tap latency itself is
  // glass, and the render arm owns it.
  //
  // ⚠ THE FIRST CUT OF THE TILE HALF WAS VACUOUS AND THE BOTH-WAYS RUN IS WHAT SAID SO.
  // It read `!/onClick:…router…push…room\.href/`, which is SOURCE syntax: the minifier
  // renames `room` to a single letter, so the pattern could never match a built bundle and
  // the clause was `true` by construction. At 366a7b5 — where every tile IS a button
  // calling router.push — it printed `tile=true`. A cell that cannot fail on the tree it
  // was written to convict is not a cell, and it took RUNNING it at the uncured tip to see
  // that; reading it back, it looked right.
  //
  // The cure asserts the SHAPE that survives minification: an anchor carries an `href` in
  // the same props object as its className, and a button carries the literal element name
  // "button" immediately before one. Both halves now read a window around the class.
  const near = (cls, needle) => {
    for (const m of shell.matchAll(new RegExp('className:"[^"]*' + cls + '[^"]*"', 'g'))) {
      const w = shell.slice(Math.max(0, m.index - 220), m.index + 220);
      if (w.includes(needle)) return true;
    }
    return false;
  };
  const tileIsAnchor = near('wl-tile', 'href:') && !near('wl-tile', '"button"');
  const seatIsAnchor = near('wl-seat', 'href:') && !near('wl-seat', '"button"');
  if (tileIsAnchor && seatIsAnchor) P('R-38.2 tiles and seats are anchors', 'href in both props objects, no button element behind either');
  else F('R-38.2 tiles and seats are anchors', 'tile=' + tileIsAnchor + ' seat=' + seatIsAnchor);

  // ── R-38.4 · THE RETIRED FAMILIES ARE GONE FROM THE SHELL ─────────────────
  // The TUPLE SET is a computed fact — what actually paints, in what family, at what
  // weight — and by this file's own law (ZIP 14 ①) computed facts are structurally outside
  // a served-bytes gate. THE RENDER ARM OWNS THE TUPLE CELL. What IS provable here is that
  // the two retired VARIABLES no longer ship, which is the mechanism the tuple set rests
  // on: with --wl-label and --wl-display deleted rather than aliased, a call site cannot
  // reach Jost or Italiana at all without writing a literal.
  const shellOnly = shellSurfaces.map((p) => corpus(p) || '').join('');
  const retiredVars = ['--wl-label', '--wl-display'].filter((v) => shellOnly.includes(v));
  if (retiredVars.length) F('R-38.4 Jost and Italiana retire', 'still shipped: ' + retiredVars.join(' '));
  else P('R-38.4 Jost and Italiana retire', 'neither --wl-label nor --wl-display ships on any shell surface');
  // t0 is ONE ELEMENT PER APP, and it is named. A second t0 site is a scale with six rungs
  // and no rule, which is the state R-38.4 replaced.
  // ⚠ THIS CELL ASSERTS WHERE THE RUNG LIVES, NOT THAT IT PAINTS, and after S2/2 the two
  // are different facts. R-38.17 as amended at c-38.14 gates the numeral on the feed having
  // answered, and no feed exists — so the t0 RULE ships on /w/today (correctly: it is that
  // surface's styling and no other's) while no element consumes it on screen. The render
  // arm's C-R17 owns the painted claim. Saying so here is the whole of D-38.1: presence in
  // a stylesheet is not presence on screen, and a cell that quietly meant both would be
  // making one of them up.
  //
  // ── AMENDED, LABELLED — S2/2 relay #3 · THE ASSERTION INVERTS, IT DOES NOT LOOSEN ──
  //
  // THE CELL'S PROSE WAS AMENDED AND ITS PREDICATE WAS NOT, AND THAT IS THE WHOLE ENTRY.
  // Withholding the masthead trio (relay #3 item 2) removed the ONLY consumer of the t0
  // rung, and this seat rewrote the pass-message to say so while leaving
  // `t0Sites.length === 1` standing above it. The gate reddened a correct tree and named
  // the reason itself: 「consumed on: nowhere」.
  //
  // THAT IS F-38.29's EXACT SHAPE — a comment that reads like the ruling over code that
  // does not perform it — filed by this seat, in this sitting, against C13. Third instance
  // from this seat after C13's sentence ceiling and C13's prefix matcher. The habit being
  // corrected is writing the explanation and not re-reading the line beneath it.
  //
  // RETIRE-WITH-THE-READER. The assertion INVERTS rather than vanishing, so the withholding
  // cannot be quietly undone and the rung cannot quietly acquire a second consumer:
  //   · while the numeral is withheld, NO shell surface consumes t0
  //   · and the rung is still DECLARED, because Phase 4 restores its consumer and a
  //     variable deleted in the meantime is a variable somebody re-invents at a new value
  //
  // ✔ FLIPPED BACK AT PHASE 4, in the same commit that restored the wl-mnum rules to
  //   app/w/today/page.tsx and uncommented COPY.todayNothingYet. The numeral has a
  //   consumer again, and the assertion is the one it was written to make: EXACTLY ONE
  //   shell surface consumes t0, and it is Today.
  // ⚠ AND THE DECLARATION HALF WAS ASKED OF A CORPUS THAT CANNOT CONTAIN IT.
  // `typeCss` builds every rung as `--wl-${k}:…` (lib/worklist/theme.ts), which compiles to
  // string CONCATENATION — so the literal `--wl-t0:` has never appeared in a served byte in
  // this instrument's whole life, and the `.replace(/--wl-t0:[^;]*;/g, '')` above it was a
  // no-op the entire time. A cell that demanded it red a correct tree and said so in words
  // that sounded like a finding about the theme.
  //
  // SO THE SPLIT IS BY WHAT IS OBSERVABLE, WHICH IS THIS GATE'S OWN LAW. A CONSUMER is a
  // literal in a stylesheet and this file can see it. A DECLARATION composed at runtime is
  // a source fact and belongs to `b40` (C37). Whether the rung PAINTS is a computed fact
  // and belongs to the render arm (C-R17). Three instruments, three claims, none of them
  // pretending to hold another's.
  const t0Sites = shellSurfaces.filter((p) => /--wl-t0/.test(corpus(p) || ''));
  if (t0Sites.length === 1 && t0Sites[0] === '/vendor/today')
    P('R-38.4 t0 is one element', 'the masthead numeral is the rung\'s one consumer, and it is Today\'s');
  else
    F('R-38.4 t0 is one element', 't0 consumers: ' + (t0Sites.join(' ') || 'none') + ' — the rung is one element per app and that element is /w/today\'s numeral');

  // ── R-P3.5.6 ① · `open_leads_count` REACHES NO SHELL SURFACE ───────────────
  //
  // THE SYMBOL, NOT THE NUMBER. R-P3.5.6 ① bans `open_leads_count` from being summed,
  // compared or displayed against Today's masthead in any surface — and F-39.10 ruled that
  // Storefront, being a room, is such a surface. The engine predicate is NOT repaired; it
  // retires at the §8.9 seam. What this cell holds is the DISPLAY half: no shell surface
  // may carry the symbol at all, so a later reader cannot reintroduce the second leads
  // figure by wiring the old door back into a room.
  //
  // ⚠ IT ASSERTS OVER SERVED BYTES, WHICH IS THIS FILE'S OWN LAW. The old reader still
  // exists in the tree (`lib/vendor/api/vendor.ts`, `hooks/vendor/useVendorData.ts`) and is
  // ruled untouched; what must be true is that nothing REACHABLE FROM THE SHELL ships it.
  const olcSites = shellSurfaces.filter((p) => /open_leads_count/.test(corpus(p) || ''));
  if (olcSites.length === 0)
    P('R-P3.5.6 open_leads_count reaches no shell surface', 'the symbol is absent from every /w bundle; Today is the one leads figure');
  else
    F('R-P3.5.6 open_leads_count reaches no shell surface', 'the engine figure is reachable again from: ' + olcSites.join(' ') + ' — two leads numbers from two planes (\u00a78.9)');

  // ── R-38.6 · THE RETIRED STRINGS ARE ABSENT ───────────────────────────────
  // Named bytes, not a shape heuristic. A retired sentence that quietly ships is the
  // .wl-plink disease in copy: the ruling lands, the markup moves, the string stays.
  const RETIRED = [
    'needing you today', 'New here? Today has a short guide',
    'your 24/7 enquiry desk', 'how couples see you',
    'Every part of your business has a room',
    "Cancelled. You’re on Basic.", "Payment failed. You’re on Basic.",
    'Moved to Basic \u2014 subscription cancelled', 'Free \u2014 no AI',
    // ── R-38.17's SET, ADDED AT S2/2 ──────────────────────────────────────
    // Four Today bytes and two card bodies. `Your morning brief.` and
    // `When your work starts flowing` are the page title and empty state the masthead
    // status replaced; `See your rooms` was an action duplicating a nav seat that is on
    // screen at all times; the two card bodies were a simile and an explanation standing
    // over a chip list and an address that explain themselves.
    'Your morning brief.', 'When your work starts flowing', 'See your rooms',
    'Text DreamAi the way you would text a colleague',
    'One link that routes every enquiry straight to you',
    'Your 24/7 enquiry desk', 'Message DreamAi', 'Run it all from WhatsApp',
    // ✔ `Nothing needs you yet.` CAME OFF THIS LIST AT PHASE 4, in the same commit that
    //   uncommented the key in lib/worklist/copy.ts and wired lib/worklist/feed.ts to a
    //   real read. It was never wrong copy — it was TRUE copy shipped one phase early
    //   (F-38.31, c-38.14), and this entry held it back until an instrument had actually
    //   read the vendor's work. It has. The byte is now live on exactly one state and the
    //   claim it makes is one the feed took.
    //
    //   ⚠ NOT DELETED SILENTLY — MOVED TO A LIVE ASSERTION. A retirement that simply ends
    //   leaves nothing watching the thing it was watching, so the guard did not vanish, it
    //   CHANGED SUBJECT: C-R17 in tools/wl_render.cjs now asserts the byte appears on the
    //   resting state and on NO other, which is the property this list was standing in for
    //   while there was no feed to ask.
    // ⚠ `thedreamwedding.in` WAS ADDED HERE AND WITHDRAWN IN THE SAME SITTING, and the
    // withdrawal is the entry worth keeping. The reasoning was 「the retired row's
    // destination must not ship either」, which sounds right and convicts the wrong thing:
    // the domain is the ESTATE'S OWN, and it ships on every surface from
    // `public/admin-manifest.json`'s `start_url` and `scope`. The cell reddened a correct
    // tree, and it would have gone on reddening for as long as the app is called what it
    // is called.
    //
    // A RETIRED ROW IS A ROW, NOT A URL. The row set two cells above asserts exactly six
    // drawer rows by name and reddens the moment a seventh appears — which is the honest
    // guard for a retirement whose subject is a control. Convicting a string that has
    // legitimate homes elsewhere is the comment-blindness disease pointed at a domain.
  ];
  const alive = RETIRED.filter((t) => shellOnly.includes(t));
  if (alive.length) F('R-38.6 retired strings absent', 'still shipped: ' + alive.join(' \u00b7 '));
  else P('R-38.6 retired strings absent', RETIRED.length + ' retired bytes, none on any shell surface');

  // ── R-38.7 · THE TWO ROWS LEFT THE ROOMS BODY ─────────────────────────────
  const rooms = corpus('/vendor/rooms') || '';
  const panelGone = !/wl-panel|wl-prow|wl-pointer/.test(rooms);
  const waInDrawer = shell.includes('TDW on WhatsApp');
  const profileInSettings = (settings || '').includes('Profile layout');
  if (panelGone && waInDrawer && profileInSettings)
    P('R-38.7 the two rows relocate', 'panel and pointer gone from Rooms; both bytes at their new homes');
  else F('R-38.7 the two rows relocate',
         'panelGone=' + panelGone + ' waInDrawer=' + waInDrawer + ' profileInSettings=' + profileInSettings);

  // ── R-38.9 · THE ADVISOR ROOM, AND NO PERSONA NAME IN CHROME ──────────────
  const advisor = corpus('/vendor/advisor') || '';
  if (/Advisor/.test(advisor) && /vendor-e\/mode/.test(advisor))
    P('R-38.9 the advisor room', 'the room ships and reaches the mode door');
  else F('R-38.9 the advisor room', 'header word or the mode door is missing from /w/advisor');
  // R-37.70. 「Victor」 is an internal seat name and belongs in no vendor-facing byte. The
  // API TYPE is named VictorMode and legitimately survives minification into the bundle,
  // so this reads rendered STRINGS rather than identifiers — the distinction is the cell.
  const personaHits = new Set();
  for (const path of shellSurfaces) {
    const body = corpus(path) || '';
    for (const m of body.matchAll(/"([^"]{0,200})"/g)) {
      // AMENDED, LABELLED — R-38.17. 「DreamAi」 JOINS THE SET. R-37.70 used to permit it in
      // prose about who answers and forbid it only in labels; that exemption retires with
      // R-37.78's grammar, because a ban with a register-shaped exception is a ban that
      // loses one sentence at a time — and two card bodies had already taken it.
      if (/\bDreamAi\b|\bVictor\b|\bDonna\b|\bHarvey\b|\bMira\b/.test(m[1])) personaHits.add(path + ' \u2192 ' + m[1].slice(0, 60));
    }
  }
  if (personaHits.size) F('R-37.70 no persona name in chrome', [...personaHits].join(' \u00b7 '));
  // The count is DERIVED, and the literal it replaces had been wrong since \u00a74-1: it said
  // 「five shell surfaces」 while this loop walked eleven, then thirteen. A green line
  // reporting a scope that stopped being true is the F-38.29 family printing itself as
  // evidence on every run \u2014 nobody re-reads a PASS.
  else P('R-37.70 no persona name in chrome', 'no persona name in any rendered string on ' + shellSurfaces.length + ' shell surfaces');

  // ── ARM (c) · NO useT UNDER THE SHELL ─────────────────────────────────────
  // The cell CE-38 relay #2 asked for, stated the only way served bytes can state it: a
  // ThemeProvider mounted on a crossing page would ship its own marker. `AskSheet` is the
  // grandfathered exception (F-38.3, OPEN) and it lives behind the dock on every surface,
  // so this reads the BILLING and SETTINGS bundles' own toast instead: WlToast ships and
  // main's Toast does not.
  const toastOk = ['/vendor/billing', '/vendor/settings'].every((p) => (corpus(p) || '').includes('wl-toast'));
  if (toastOk) P('arm (c) the shell toast', 'wl-toast ships on both crossing surfaces');
  else F('arm (c) the shell toast', 'a crossing surface does not carry wl-toast');

  // ── R-38.8 · BILLING IS A MONEY PAGE ──────────────────────────────────────
  const moneyBad = /\u20b9/.test(billing || '') || /\b\d+\s?(k|L|Cr)\b/.test(billing || '');
  const chipsShip = /wl-chipstatus/.test(billing || '');
  const readRowsGone = !/SReadRow|wl-readrow/.test(billing || '');
  if (!moneyBad && chipsShip && readRowsGone)
    P('R-38.8 billing is a money page', 'chips ship, no AtelierForm read-rows, money register clean');
  else F('R-38.8 billing is a money page',
         'glyphOrShorthand=' + moneyBad + ' chips=' + chipsShip + ' readRowsGone=' + readRowsGone);

  // ── no italic serif inside the chat mount  [served bytes] ─────────────────
  if (/wl-askpanel/.test(shell) && /fontStyle:\s*"italic"/.test(shell.match(/wl-askpanel[\s\S]{0,4000}/)?.[0] || ''))
    F('R-37.84 \u2462 the chat sheds the costume', 'italic ships inside the chat mount');
  else P('R-37.84 \u2462 the chat sheds the costume');

  // ── NO .wl-* RULE WITHOUT A CONSUMER  [served bytes] ──────────────────────
  //
  // TWO defects were cured here, and the second is the one that matters, because
  // curing only the first would have LOOKED like a cure:
  //
  //   (a) THE CORPUS. Declaration and consumption legitimately live apart —
  //       `.wl-card*` is declared in the shell chunk and consumed by FirstRun on
  //       /w/today. Every page's chunks now form ONE corpus.
  //
  //   (b) THE MATCH. `used` was /"(wl-[a-z-]+)"/ — a class had to occupy a whole
  //       quoted string to count as consumed. The built bundle carries
  //       `className:"wl-card wl-card-lead"`, so `wl-card-lead` was invisible to
  //       the reader EVEN UNDER PERFECT COVERAGE. A seat that widened the corpus,
  //       saw one name survive, and excepted it by ruling would have buried a live
  //       regex bug under a citation. Each quoted string is tokenized on
  //       whitespace instead.
  //
  // NON-VACUITY IS BUILT IN, not asserted elsewhere. At ZIP 13's tip this sweep
  // must PASS the five card classes and RED the five leftovers — same corpus,
  // same run. ZIP 13 deletes the five leftovers, so a GREEN here means both
  // halves worked: the reader stopped lying about the live ones, and still saw
  // the dead ones well enough to get them killed.
  const whole = [...pageCorpus.values()].join('');
  const declared = new Set([...whole.matchAll(/\.(wl-[a-z-]+)\{/g)].map((m) => m[1]));
  const used = new Set();
  for (const m of whole.matchAll(/"([^"]{0,300}?)"/g)) {
    if (!m[1].includes('wl-')) continue;
    for (const tok of m[1].split(/\s+/)) if (/^wl-[a-z-]+$/.test(tok)) used.add(tok);
  }
  const dead = [...declared].filter((c) => !used.has(c) && !/^wl(-main|-dsec)?$/.test(c));
  if (dead.length) F('dead-rule sweep', 'declared with no consumer: ' + dead.join(', '));
  else P('dead-rule sweep', declared.size + ' rules across ' + PAGES.length + ' pages, every one consumed');

  // ── THE ESPRESSO FLASH  [PART served bytes, PART glass only] ──────────────
  const cssHref = shell.match(/\/_next\/static\/css\/[\w.-]+\.css/)?.[0];
  if (!cssHref) {
    I('R-37.84 \u2463 flash — structural half', 'no stylesheet URL found in the shell bundle to read');
  } else {
    const css = (await get(cssHref)).body;
    const lits = ['#1F1612', '#1A0F08', '#241A15', '#7A3828'].filter((l) => css.includes(l));
    if (lits.length) F('R-37.84 \u2463 flash — structural half', 'Espresso literals still parse: ' + lits.join(' '));
    else P('R-37.84 \u2463 flash — structural half', 'no Espresso literal in the served CSS; first parsed value is Graphite');
  }
  I('R-37.84 \u2463 flash — the flash itself', 'a first-paint blink cannot be observed by a fetch. The structural half above is proved; the remaining suspect is app/vendor/layout.tsx\'s pre-paint pin writing documentElement.style on mount — a hydration race, GLASS ONLY. Named walk beat. \u26a0 F-38.3, FILED OPEN AT CE-38 RELAY #2: components/worklist/AskSheet.tsx:32 mounts <ThemeProvider pinned>, and a pinned provider WRITES html.theme-light (ThemeContext.tsx:117) and documentElement.style.background (:85-87). That is a SECOND writer of the convicted class, living inside /w. Grandfathered this sitting; cure priced for sitting 2.');

  // ── the properties this script CANNOT decide from bytes ──────────────────
  I('pixel-identical tile and panel edges', 'a served-bytes gate proves the RULE (one gutter, no component override) and not the rendered pixel. C22 holds the rule; only glass holds the pixel.');

  summary();
})().catch((e) => { console.error('audit threw: ' + e.message); process.exit(3); });

function summary() {
  console.log('\n' + pass + ' PASS · ' + fail + ' FAIL · ' + incon + ' INCONCLUSIVE');
  console.log(fail === 0 ? 'GATE GREEN — the founder may open the app.' : 'GATE RED — the ZIP bounces; the founder does not open the app.');
  process.exit(fail === 0 ? 0 : 1);
}
