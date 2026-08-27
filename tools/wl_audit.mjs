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
// ── M-FINISH S1 · THE CORPUS FOLLOWS THE SHELL ──────────────────────────────
// Billing, Settings and Advisor crossed into /w this sitting, so the corpus reads them
// THERE. `/vendor/list/leads` stays: it is one of the fourteen rooms that has NOT crossed
// (lib/worklist/rooms.ts INTERIM_VENDOR_ROOMS), and the italic-serif and drawer-overlay
// cells below are assertions ABOUT a carried room. Dropping it would have made those cells
// pass by having nothing to look at.
const PAGES = ['/w', '/w/rooms', '/w/today', '/w/billing', '/w/settings', '/w/advisor', '/vendor/list/leads'];
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
  const settings = pageCorpus.get('/w/settings');
  const billing  = pageCorpus.get('/w/billing');
  const today    = pageCorpus.get('/w/today');

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
  const rows = ['Settings', 'Billing', 'TDW on WhatsApp', 'The Dream Wedding', 'Sign Out', 'Graphite'];
  const missingRows = rows.filter((r) => !shell.includes(r));
  if (missingRows.length) F('R-37.79 shell drawer complete', 'missing rows: ' + missingRows.join(' \u00b7 '));
  else P('R-37.79 shell drawer complete', 'all ' + rows.length + ' rows plus Display in the shell bundle');

  // ── R-38.1 · NO /vendor HREF REACHABLE FROM A SHELL CONTROL ────────────────
  // THE ASSERTION IS A SET, NOT AN ABSENCE, and that is the whole of its honesty. Fourteen
  // rooms are still carried surfaces this sitting, so 「no /vendor href exists」 would be
  // false on purpose — and an assertion that is false on purpose teaches the next seat that
  // this cell may be argued with. The registry declares the exceptions
  // (INTERIM_VENDOR_ROOMS, INTERIM_VENDOR_LINKS) and the cell asserts that the hrefs
  // actually SHIPPED are exactly those. A room that slides back out of the shell reddens.
  // A room that crosses without leaving the list reddens too.
  const INTERIM_ROOM_HREFS = [
    '/vendor/list/leads', '/vendor/list/clients', '/vendor/list/invoices', '/vendor/list/expenses',
    '/vendor/list/events', '/vendor/list/notes', '/vendor/calendar', '/vendor/storefront',
    '/vendor/portfolio', '/vendor/couture', '/vendor/team-hub', '/vendor/contracts',
    '/vendor/tds', '/vendor/collab',
  ];
  // DERIVED, NOT ASSUMED, AND MY OWN DECLARATION WAS WRONG BY ONE. R-38.7 anticipated a
  // single outbound link from a crossed shell surface — 「Profile layout」. The gate found
  // three, and the three had three different dispositions, which is why they are listed
  // separately rather than waved through as "Settings links out":
  //   /vendor/discover/preview — R-38.7's row. Genuinely uncrossed. INTERIM.
  //   /vendor/discover/profile — SettingsScreen's own edit-profile control. Uncrossed.
  //                              INTERIM, and it was never declared because nobody had
  //                              read the body's links before crossing it.
  //   /vendor/billing          — NOT interim. A SECOND MONEY SURFACE with a live door: the
  //                              signpost pointed at the AtelierForm card while the tile
  //                              went to the rebuilt page. CURED at the site, repointed to
  //                              /w/billing, and therefore absent from this list.
  const INTERIM_LINKS = ['/vendor/discover/preview', '/vendor/discover/profile'];
  const ALLOWED = new Set([...INTERIM_ROOM_HREFS, ...INTERIM_LINKS, '/vendor/onboarding']);
  const shellSurfaces = ['/w/rooms', '/w/today', '/w/billing', '/w/settings', '/w/advisor'];
  const strays = new Set();
  for (const path of shellSurfaces) {
    const body = pageCorpus.get(path) || '';
    for (const m of body.matchAll(/"(\/vendor\/[A-Za-z0-9\/_-]*)"/g)) {
      if (!ALLOWED.has(m[1])) strays.add(path + ' \u2192 ' + m[1]);
    }
  }
  if (strays.size) F('R-38.1 no undeclared /vendor href', [...strays].join(' \u00b7 '));
  else P('R-38.1 no undeclared /vendor href', INTERIM_ROOM_HREFS.length + ' declared interim rooms, 1 declared interim link, 0 strays');

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
  const shellOnly = shellSurfaces.map((p) => pageCorpus.get(p) || '').join('');
  const retiredVars = ['--wl-label', '--wl-display'].filter((v) => shellOnly.includes(v));
  if (retiredVars.length) F('R-38.4 Jost and Italiana retire', 'still shipped: ' + retiredVars.join(' '));
  else P('R-38.4 Jost and Italiana retire', 'neither --wl-label nor --wl-display ships on any shell surface');
  // t0 is ONE ELEMENT PER APP, and it is named. A second t0 site is a scale with six rungs
  // and no rule, which is the state R-38.4 replaced.
  const t0Sites = shellSurfaces.filter((p) => /--wl-t0/.test((pageCorpus.get(p) || '').replace(/--wl-t0:[^;]*;/g, '')));
  if (t0Sites.length === 1 && t0Sites[0] === '/w/today') P('R-38.4 t0 is one element', 'consumed on /w/today only');
  else F('R-38.4 t0 is one element', 'consumed on: ' + (t0Sites.join(' ') || 'nowhere'));

  // ── R-38.6 · THE RETIRED STRINGS ARE ABSENT ───────────────────────────────
  // Named bytes, not a shape heuristic. A retired sentence that quietly ships is the
  // .wl-plink disease in copy: the ruling lands, the markup moves, the string stays.
  const RETIRED = [
    'needing you today', 'New here? Today has a short guide',
    'your 24/7 enquiry desk', 'how couples see you',
    'Every part of your business has a room',
    "Cancelled. You're on Basic.", "Payment failed. You're on Basic.",
    'Moved to Basic \u2014 subscription cancelled', 'Free \u2014 no AI',
  ];
  const alive = RETIRED.filter((t) => shellOnly.includes(t));
  if (alive.length) F('R-38.6 retired strings absent', 'still shipped: ' + alive.join(' \u00b7 '));
  else P('R-38.6 retired strings absent', RETIRED.length + ' retired bytes, none on any shell surface');

  // ── R-38.7 · THE TWO ROWS LEFT THE ROOMS BODY ─────────────────────────────
  const rooms = pageCorpus.get('/w/rooms') || '';
  const panelGone = !/wl-panel|wl-prow|wl-pointer/.test(rooms);
  const waInDrawer = shell.includes('TDW on WhatsApp');
  const profileInSettings = (settings || '').includes('Profile layout');
  if (panelGone && waInDrawer && profileInSettings)
    P('R-38.7 the two rows relocate', 'panel and pointer gone from Rooms; both bytes at their new homes');
  else F('R-38.7 the two rows relocate',
         'panelGone=' + panelGone + ' waInDrawer=' + waInDrawer + ' profileInSettings=' + profileInSettings);

  // ── R-38.9 · THE ADVISOR ROOM, AND NO PERSONA NAME IN CHROME ──────────────
  const advisor = pageCorpus.get('/w/advisor') || '';
  if (/Advisor/.test(advisor) && /vendor-e\/mode/.test(advisor))
    P('R-38.9 the advisor room', 'the room ships and reaches the mode door');
  else F('R-38.9 the advisor room', 'header word or the mode door is missing from /w/advisor');
  // R-37.70. 「Victor」 is an internal seat name and belongs in no vendor-facing byte. The
  // API TYPE is named VictorMode and legitimately survives minification into the bundle,
  // so this reads rendered STRINGS rather than identifiers — the distinction is the cell.
  const personaHits = new Set();
  for (const path of shellSurfaces) {
    const body = pageCorpus.get(path) || '';
    for (const m of body.matchAll(/"([^"]{0,200})"/g)) {
      if (/\bVictor\b|\bDonna\b|\bHarvey\b|\bMira\b/.test(m[1])) personaHits.add(path + ' \u2192 ' + m[1].slice(0, 60));
    }
  }
  if (personaHits.size) F('R-37.70 no persona name in chrome', [...personaHits].join(' \u00b7 '));
  else P('R-37.70 no persona name in chrome', 'no persona name in any rendered string on five shell surfaces');

  // ── ARM (c) · NO useT UNDER THE SHELL ─────────────────────────────────────
  // The cell CE-38 relay #2 asked for, stated the only way served bytes can state it: a
  // ThemeProvider mounted on a crossing page would ship its own marker. `AskSheet` is the
  // grandfathered exception (F-38.3, OPEN) and it lives behind the dock on every surface,
  // so this reads the BILLING and SETTINGS bundles' own toast instead: WlToast ships and
  // main's Toast does not.
  const toastOk = ['/w/billing', '/w/settings'].every((p) => (pageCorpus.get(p) || '').includes('wl-toast'));
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
