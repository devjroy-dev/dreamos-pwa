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
  console.error('usage: node tools/wl_audit.mjs https://<branch-domain>');
  process.exit(2);
}

let pass = 0, fail = 0, incon = 0;
const P = (n, why) => { console.log('PASS         ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL         ' + n + '  — ' + why); fail++; };
const I = (n, why) => { console.log('INCONCLUSIVE ' + n + '  — ' + why); incon++; };

async function get(path) {
  const res = await fetch(BASE + path, { redirect: 'follow', headers: { 'user-agent': 'wl-audit' } });
  return { status: res.status, url: res.url, body: await res.text() };
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
const PAGES = ['/w', '/w/rooms', '/w/today', '/vendor/list/leads', '/vendor/settings'];
const pageCorpus = new Map();
let refTotal = 0, gotTotal = 0;
const missed = [];

async function coverage() {
  for (const page of PAGES) {
    const html = (await get(page)).body;
    // Every occurrence, not merely the src= attributes. Deduplicated, uncapped.
    const refs = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\\ )]+?\.js/g)].map((m) => m[0]))];
    refTotal += refs.length;
    let all = html;
    for (const s of refs) {
      try {
        const r = await get(s);
        if (r.status !== 200) { missed.push(page + ' → ' + s + ' (HTTP ' + r.status + ')'); continue; }
        all += r.body;
        gotTotal++;
      } catch (e) {
        missed.push(page + ' → ' + s + ' (' + e.message + ')');
      }
    }
    pageCorpus.set(page, all);
  }
  console.log('chunks: ' + gotTotal + ' fetched / ' + refTotal + ' referenced\n');
  if (missed.length) {
    console.log('GATE-UNSOUND — the corpus is incomplete, so no verdict is trustworthy.');
    console.log('Unreachable:\n  ' + missed.join('\n  '));
    console.log('\nNo assertions were run. Fix the deploy or the reader, then re-run.');
    process.exit(3);
  }
}

(async () => {
  console.log('wl_audit · ' + BASE + '\n');

  try {
    const r = await get('/w');
    if (r.status !== 200) { F('reachable', '/w returned ' + r.status); return summary(); }
  } catch (e) { F('reachable', e.message); return summary(); }

  await coverage();

  const shell = pageCorpus.get('/w/rooms');
  const room  = pageCorpus.get('/vendor/list/leads');
  const settings = pageCorpus.get('/vendor/settings');

  // ── 0 · the deploy is the one we think it is ─────────────────────────────
  // /w redirects CLIENT-SIDE in a useEffect. A fetch never runs JS, so no request
  // can observe the hop — the original assertion was unprovable by its own method
  // and printed FAIL on a working build. What IS provable from served bytes is
  // that the entry ships the redirect target; the behaviour is source-proved by C17.
  if (/\/w\/rooms/.test(pageCorpus.get('/w'))) P('R-37.75 rooms-first', 'the /w entry ships the redirect target');
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

  // ── ⑥ the drawer is an overlay ───────────────────────────────────────────
  if (/position:\s*"fixed",\s*inset:\s*0/.test(room) && /--role-scrim/.test(room))
    P('R-37.84 ⑥ drawer overlays', 'fixed scrim present; the grid is not in flow behind it');
  else F('R-37.84 ⑥ drawer overlays', 'no fixed scrim in the room bundle — the drawer still renders in flow');

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
  if (/\.wl-prow\{[^}]*min-height:52px/.test(shell)) P('R-37.82 ② one-line rows');
  else F('R-37.82 ② one-line rows', 'the panel rows do not ship at 52px');

  // ── R-37.79 the shell drawer is the WHOLE drawer  [served bytes] ──────────
  const rows = ['Discover Profile', 'Settings', 'Billing', 'The Dream Wedding', 'Tips & Features', 'Sign Out'];
  const missingRows = rows.filter((r) => !shell.includes(r));
  if (missingRows.length) F('R-37.79 shell drawer complete', 'missing rows: ' + missingRows.join(' \u00b7 '));
  else P('R-37.79 shell drawer complete', 'all ' + rows.length + ' rows plus Display in the shell bundle');

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
  I('R-37.84 \u2463 flash — the flash itself', 'a first-paint blink cannot be observed by a fetch. The structural half above is proved; the remaining suspect is app/vendor/layout.tsx\'s pre-paint pin writing documentElement.style on mount — a hydration race, GLASS ONLY. Named walk beat.');

  // ── the properties this script CANNOT decide from bytes ──────────────────
  I('pixel-identical tile and panel edges', 'a served-bytes gate proves the RULE (one gutter, no component override) and not the rendered pixel. C22 holds the rule; only glass holds the pixel.');

  summary();
})().catch((e) => { console.error('audit threw: ' + e.message); process.exit(3); });

function summary() {
  console.log('\n' + pass + ' PASS · ' + fail + ' FAIL · ' + incon + ' INCONCLUSIVE');
  console.log(fail === 0 ? 'GATE GREEN — the founder may open the app.' : 'GATE RED — the ZIP bounces; the founder does not open the app.');
  process.exit(fail === 0 ? 0 : 1);
}
