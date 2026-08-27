#!/usr/bin/env node
'use strict';
// tools/wl_render.cjs — THE RENDER ARM.
//
//   node tools/wl_render.cjs <base-url> [--capture <dir>]
//
// WHY THIS EXISTS, AND WHAT IT IS NOT.
// `tools/wl_audit.mjs` asserts SERVED BYTES. It is good at what a fetch can see and
// structurally blind to what a fetch cannot. Three defects escaped it in one arc, all one
// class, and the third was found by this file's first captures:
//
//   · the coin drawer painted 8px BELOW the fold (top 852 in an 844px viewport) while the
//     byte-gate reported "drawer overlays — fixed scrim present" and PASSED;
//   · the chat input shipped computed `font-style: italic` in Cormorant Garamond while the
//     byte-gate's ternary-blind regex reported "the chat sheds the costume" and PASSED;
//   · the tile grid rendered flush to both screen edges — `--wl-gutter: 12px` declared,
//     applied inset `0px` — while the byte-gate confirmed the RULE was present and PASSED.
//
// THE LAW THIS FILE OWNS (CE-37, 2026-08-27): computed facts — DOES IT PAINT, WHERE, IN WHAT
// STYLE — are structurally outside a served-bytes gate. Served-bytes assertions on that class
// print INCONCLUSIVE, never PASS. The render arm owns them. A rule that is present in a
// stylesheet is not a rule that applies, and presence in a bundle is not presence on screen.
//
// THE BROWSER. Playwright's CDN and Google's storage host are both denied at this estate's
// egress proxy, and no system chromium exists in the build container. `@sparticuz/chromium`
// ships the binary INSIDE its npm tarball, and npm is allow-listed — that is the whole reason
// for the dependency pair. Driven with `puppeteer-core`. Real Chromium, real next/font, real
// computed styles.
//
// THE FIXTURE, AND ITS HONESTY. The session below is SYNTHETIC: its token is not a real one,
// so every authenticated fetch fails closed. That is stated, never hidden — the coin renders
// its fallback glyph instead of initials for exactly this reason, and any frame this file
// captures is SYNTHETIC-SPLASH unless a fixture layer is added and declared. A frame whose
// data condition is unstated is not evidence. Every seed field is derived, never guessed:
// lib/vendor/session.ts — SESSION_KEY (:11), id must not be MOCK_VENDOR_ID (:19),
// access_token must not be MOCK_ACCESS_TOKEN (:20), _v >= SESSION_VERSION = 2 (:24).
//
// CAPTURES SHOW THE WHOLE SURFACE, AND fullPage ALONE DOES NOT ACHIEVE THAT HERE.
// Two lessons, both paid for by this instrument's own frames:
//   (1) The first set shipped VIEWPORT-cropped, and a panel row that fell below the fold read
//       as a MISSING row — this seat nearly filed a defect off its own evidence.
//   (2) `fullPage: true` fixed nothing, because the branch shell is `height:100dvh` with
//       `overflow:hidden` and an INNER scroll column (`.wl-main`). fullPage captures the
//       DOCUMENT; the document is exactly one viewport tall, and the content scrolls inside
//       an element. The second set clipped in the same place for a different reason.
// So `unclip()` below expands the inner scroller for the duration of the frame and restores
// it after. A frame that silently truncates is the pixel-domain form of a sweep that reads
// one page — and it took two tries to stop making one.

const chromium = require('@sparticuz/chromium').default;
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const BASE = (process.argv[2] || '').replace(/\/$/, '');
const capIdx = process.argv.indexOf('--capture');
const CAPTURE = capIdx > -1 ? process.argv[capIdx + 1] : null;
// ── CAPTURES ARE OPT-IN, AND AGAINST A DEPLOY THEY SHOULD USUALLY BE OFF ────────────
// The cells are the verdict; the frames are evidence for the chair. Screenshotting eight
// surfaces twice over a network round trip is most of this instrument's runtime, and every
// minute of it is the founder's. Run WITHOUT `--capture` to get the verdict in about a
// third of the time; run WITH it against a LOCAL `next start` when the chair needs frames.
// The frames are chrome-and-layout evidence either way — the fixture's token is synthetic,
// so they say nothing about any data-bearing surface and a local build shows the same
// chrome the deploy does.
if (!BASE) {
  console.error('usage: node tools/wl_render.cjs <base-url> [--capture <dir>]');
  process.exit(2);
}

const SEED = {
  id: '11111111-2222-3333-4444-555555555555', user_id: 'wl-render-arm',
  name: 'Dev Roy', phone: '+919888294440', tier: 'signature',
  access_token: 'wl-render-arm-token', refresh_token: 'wl-render-arm-token', _v: 2,
};
const VIEW = { width: 390, height: 844, deviceScaleFactor: 2 };

let pass = 0, fail = 0;
const P = (n, why) => { console.log('PASS  ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL  ' + n + '  — ' + why); fail++; };


// ── THE WAIT IS ON THE THING, AND THE FIXTURE SURVIVES ITS OWN ACTIONS ──────
//                                              [F-38.6 · F-38.7 · F-38.8]
//
// THREE DEFECTS LIVE UNDER THIS ONE HELPER AND THEY WERE FOUND IN THIS ORDER, WHICH IS
// ALSO THE ORDER OF HOW BADLY THEY MATTERED — LEAST FIRST.
//
// F-38.6 · IT WAITED ON A CLOCK. Every navigation used a fixed setTimeout — 1200ms,
// 1400ms — long enough on a local `next start` and not on the real deploy. `/w`'s session
// guard renders a bare background div while it resolves, so an unmounted page has NO
// `.wl-*` element at all, and C-R7 reported an edge verdict about a tree it had never
// looked at.
//
// F-38.8 · THE FIXTURE DESTROYED ITS OWN SESSION, AND THE ARM DID NOT NOTICE. C-R5 clicks
// `.wl-dockfield` to raise the chat. That fires `AiDock.ensureBusiness()` →
// `fetchVictorMode()` → an AUTHENTICATED request. The seeded token is synthetic, so the
// deploy answers 401; `lib/vendor/api/_base.ts:106-113` refreshes once, fails, and calls
// `clearAndRedirect()` — `clearVendorSession()` and `window.location.href = '/'`.
// FROM THAT MOMENT THE FIXTURE HAS NO SESSION. Every later `/w` navigation is bounced by
// the guard, which is why C-R6, C-R7 and C-R8 all reported NEVER MOUNTED and why light
// mode finally threw `net::ERR_ABORTED` — a hard redirect racing a goto.
//
// F-38.7 · AND THAT IS THE ONE THAT MATTERS: C-R6 PASSED ON THE DEPLOY WHILE THIS WAS
// TRUE. Its predicate is 「every painted tuple is one of the six rungs」, and on a page
// that had already bounced to `/` there were ZERO painted tuples inside `.wl`. Zero
// members satisfy a universal claim. The old clock-wait handed it an empty page and it
// printed PASS. **The green was hollow, and only the cure for F-38.6 exposed it** — the
// stricter wait turned a false green into an honest red, which is exactly the direction
// this estate's instruments are supposed to move under pressure.
//
// SO THE CURES ARE THREE AND EACH ONE IS NAMED AT ITS SITE:
//   · no clocks in the navigation path — settle() waits for the tree's own root landmark
//   · settle() RE-SEEDS ONCE and says so, because a fixture that cannot survive the
//     product's own behaviour is a fixture that measures nothing after its first action
//   · C-R6 asserts a FLOOR on how many tuples it saw, so it can never again pass by
//     looking at nothing
async function reseat(p, mode) {
  await p.evaluate((s, m) => {
    localStorage.setItem('vendor_session', JSON.stringify(s));
    localStorage.setItem('tdw_worklist_mode', m);
  }, SEED, mode);
}

async function settle(p, path, landmark, mode) {
  // THE ROOT LANDMARK IS PER-TREE. The first cure waited for `.wl-main` on EVERY path,
  // including the two carried /vendor rooms that are captured ON PURPOSE as the seam the
  // founder is being asked to judge. Those surfaces have no `.wl-main` and never will, so
  // the arm skipped them and shipped 20 frames where 24 were ruled. Waiting for the wrong
  // landmark and waiting for no landmark fail the same way.
  const root = path.startsWith('/w') ? '.wl-main' : 'header';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector(root, { timeout: 15000 });
      if (landmark) await p.waitForSelector(landmark, { timeout: 15000 });
      return true;
    } catch {
      if (attempt === 0) {
        // A RE-SEED IS ITSELF EVIDENCE and is never silent: it means something cleared the
        // session, and the only thing that does is a 401 on a real authenticated call.
        // THE MESSAGE USED TO SAY 「the session had been cleared」, which is a CAUSE this
        // line has not derived — the first attempt can fail for a slow selector, an
        // aborted navigation, or a redirect, and only one of those is a cleared session.
        // An instrument that names a cause it did not establish is doing the thing this
        // estate files findings about. It reports WHAT IT DID.
        console.log('  first attempt at ' + path + ' did not settle; re-seeded and retried');
        try { await reseat(p, mode); } catch { /* the page may be mid-redirect */ }
      }
    }
  }
  return false;
}

async function seat(browser, mode) {
  const p = await browser.newPage();
  await p.setViewport(VIEW);
  // ── F-38.10 · THE FIXTURE IS SEEDED BEFORE EVERY DOCUMENT, NOT REPAIRED AFTER ──
  //
  // F-38.8 established that the product logs this fixture out: any authenticated call
  // 401s on a synthetic token, and `_base.ts:106-113` answers with `clearVendorSession()`
  // and a hard redirect. The first cure RE-SEEDED AFTER THE FACT and retried, which is
  // reactive by construction — it repairs the session only once the damage has already
  // cost a navigation, and on the deploy one surface still lost the race and reported
  // NEVER MOUNTED on a tree that was fine.
  //
  // `evaluateOnNewDocument` runs BEFORE any page script on EVERY document. So no matter
  // how many times the product clears the session, the next navigation already has one.
  // The fixture stops being something that survives the product and becomes something the
  // product cannot remove. That is also most of the speed: no retries, no 20s waits.
  await p.evaluateOnNewDocument((s, m) => {
    try {
      localStorage.setItem('vendor_session', JSON.stringify(s));
      localStorage.setItem('tdw_worklist_mode', m);
      // F-38.21: the handle cache. The fixture's token is synthetic, so /me will 401 and
      // the wire read cannot supply a handle — seeding the cache is the only way to
      // exercise the seeded path at all, and exercising it is the whole point of C-R12.
      localStorage.setItem('tdw_vendor_handle', 'DEVROY');
    } catch { /* private mode */ }
  }, SEED, mode);
  // THE SECOND SEEDING AND THE DOUBLE NAVIGATION BOTH RETIRE. `evaluateOnNewDocument`
  // above already writes the session before any page script on every document, so the old
  // dance — load once to get an origin, write localStorage, load again — is doing nothing
  // that has not already been done. Two fewer round trips per mode.
  //
  // ⚠ AND IT NO LONGER THROWS. This function was the LAST unguarded step in the file and
  // it is the first thing each mode runs: a failed `.wl-coin` wait here threw out of the
  // whole arm, which is how a run that had printed nine green dark cells still exited 3.
  // Same class as F-38.9 and F-38.11, found in the same file three edits later. It returns
  // null now, and the caller reports that mode's cells rather than losing them.
  if (!await settle(p, '/w/rooms', '.wl-coin', mode)) { await p.close(); return null; }
  return p;
}

(async () => {
  console.log('wl_render · ' + BASE + '\n');
  console.log('fixture: SYNTHETIC-SPLASH — the seeded token is not real, so every');
  console.log('authenticated fetch fails closed. Chrome is real; data is not.\n');

  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(),
    headless: 'shell',
    // F-38.9. The default protocol timeout is tuned for a local server; against the real
    // deploy an unclipped fullPage screenshot exceeded it and threw. Raised — but only to
    // 120s, and the first cut's 300s was a mistake worth recording: a long timeout does
    // not make a hang succeed, it makes a hang EXPENSIVE. Five minutes per stuck frame
    // turned a two-minute run into something the founder had to ask about. A guarded step
    // should fail fast and be reported, not sit there being patient on his time.
    protocolTimeout: 120000,
  });

  for (const mode of ['dark', 'light']) {
    const p = await seat(browser, mode);
    const tag = '[' + mode + '] ';
    if (!p) {
      // A MODE THAT NEVER SEATED IS A REPORTED MODE, NOT A LOST ONE. Nine silent cells is
      // the failure this file has now committed four times; the last hole is closed here.
      F(tag + 'the shell never seated', 'no .wl-coin at /w/rooms after a re-seed — every cell for this mode was skipped, not passed');
      continue;
    }

    // ── C-R1 · THE DRAWER PAINTS INSIDE THE VIEWPORT ────────────────────────
    // The defect: `.wl-drawer` was a SIBLING of the header it anchors to, so its
    // `top:calc(100% + 8px)` resolved against the viewport, not the header.
    await p.click('.wl-coin');
    await new Promise((r) => setTimeout(r, 350));
    const d = await p.evaluate(() => {
      const el = document.querySelector('.wl-drawer');
      if (!el) return { found: false };
      const r = el.getBoundingClientRect();
      return { found: true, top: Math.round(r.top), bottom: Math.round(r.bottom),
               w: Math.round(r.width), h: Math.round(r.height), vh: window.innerHeight,
               visible: r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0 };
    });
    if (d.found && d.visible) P(tag + 'C-R1 drawer paints inside the viewport', 'top ' + d.top + ' of ' + d.vh);
    else F(tag + 'C-R1 drawer paints inside the viewport', JSON.stringify(d));

    // ── C-R2 · THE GUTTER APPLIES  [R-37.82 ①] ──────────────────────────────
    // Not "is the rule in the stylesheet" — that is the byte-gate's question and it
    // answered yes for twelve ZIPs while the grid ran flush to both edges.
    await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.wl-tile', { timeout: 20000 });
    const g = await p.evaluate(() => {
      const tiles = [...document.querySelectorAll('.wl-tile')];
      const first = tiles[0].getBoundingClientRect();
      const last = tiles.slice(0, 3).pop().getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(document.querySelector('.wl'))
        .getPropertyValue('--wl-gutter')) || 0;
      return { gutter, left: Math.round(first.left), right: Math.round(last.right),
               innerW: window.innerWidth, tiles: tiles.length };
    });
    const insetOk = g.gutter > 0 && g.left >= g.gutter - 1 && g.right <= g.innerW - g.gutter + 1;
    if (insetOk) P(tag + 'C-R2 the gutter APPLIES', 'inset ' + g.left + 'px both sides, --wl-gutter ' + g.gutter);
    else F(tag + 'C-R2 the gutter APPLIES', 'declared ' + g.gutter + 'px; rendered left ' + g.left + ', right ' + g.right + ' of ' + g.innerW);

    // ── C-R3 · THE ROOM COUNT ON SCREEN  [R-37.87, amended R-38.9] ──────────
    // AMENDED, LABELLED — M-FINISH S1. Seventeen becomes EIGHTEEN by founder word: the
    // Advisor room joins the business band. Count history, every step worded or derived:
    // 11 -> 15 -> 16 -> 17 -> 18.
    //
    // AND THE NUMBER STOPS BEING A LITERAL HERE. It is read from the registry's own
    // exported constant, the same correction b40's C2 took at ZIP 14: a count retyped into
    // an instrument is a second home for the count, and the two drift without either one
    // erroring. What this cell uniquely proves is that the registry's number and the
    // number of tiles the BROWSER painted agree — b40 can only compare the registry to
    // itself.
    const EXPECTED = Number((fs.readFileSync('lib/worklist/rooms.ts', 'utf8')
      .match(/ROOM_COUNT_EXPECTED\s*=\s*(\d+)/) || [])[1]);
    if (g.tiles === EXPECTED) P(tag + 'C-R3 the registry\'s room count is what paints', EXPECTED + ' tiles on screen');
    else F(tag + 'C-R3 the registry\'s room count is what paints', 'registry says ' + EXPECTED + ', rendered ' + g.tiles);

    // ── C-R6 · THE TUPLE SET IS THE SCALE  [R-38.4] ─────────────────────────
    //
    // THE CELL R-38.4 EXISTS FOR, AND IT LIVES HERE BY THIS FILE'S OWN LAW: what family a
    // byte PAINTS IN is a computed fact, and computed facts are structurally outside a
    // served-bytes gate. wl_audit proves the two retired VARIABLES are gone, which is the
    // mechanism; only the browser can say what the mechanism produced.
    //
    // SIX TUPLES, NOT FIVE. t0 (46/.95 Cormorant 500) is the named display exception ruled
    // at CE-38 relay #1 — the Today masthead numeral, R-37.88's own 「stature」. A bare
    // "⊆ five" cell would have reddened the ratified design it was written to protect.
    //
    // ⚠ SETTINGS IS EXCLUDED BY NAME AND NOT BY SILENCE. Its body is AtelierForm — Jost at
    // 9px, .42em tracking — and it crossed STRUCTURALLY this sitting without crossing
    // typographically. Capturing it and letting the cell pass over it would make R-38.4's
    // "by construction, not by sweep" claim false on the first surface that tested it. The
    // exclusion is one line of code and one line of handover, so it cannot be forgotten.
    const SCALE_SURFACES = ['/w/rooms', '/w/today', '/w/billing', '/w/advisor'];
    const RUNGS = [
      { n: 't0', px: 46, w: 500, fam: 'Cormorant' }, { n: 't1', px: 24, w: 500, fam: 'Cormorant' },
      { n: 't2', px: 17, w: 500, fam: 'DM Sans' },   { n: 't3', px: 14, w: 400, fam: 'DM Sans' },
      { n: 't4', px: 12, w: 500, fam: 'DM Sans' },   { n: 't5', px: 11, w: 500, fam: 'DM Sans' },
    ];
    const strays = [];
    let tuplesSeen = 0;
    for (const path of SCALE_SURFACES) {
      if (!await settle(p, path, null, mode)) { strays.push(path + ' NEVER MOUNTED'); continue; }
      const tuples = await p.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('.wl *')) {
          if (!el.textContent || !el.textContent.trim()) continue;
          // Text-bearing LEAVES only. A container inherits its child's computed font and
          // would report a tuple nothing actually paints in.
          if ([...el.children].some((c) => c.textContent && c.textContent.trim())) continue;
          const c = getComputedStyle(el);
          out.push({ size: Math.round(parseFloat(c.fontSize) * 10) / 10,
                     weight: c.fontWeight, family: c.fontFamily,
                     tag: el.tagName.toLowerCase(), cls: el.className || '' });
        }
        return out;
      });
      tuplesSeen += tuples.length;
      for (const t of tuples) {
        const hit = RUNGS.find((r) => Math.abs(t.size - r.px) < 0.6 &&
                                      String(t.weight) === String(r.w) &&
                                      t.family.includes(r.fam));
        if (!hit) strays.push(path + ' ' + (t.cls || t.tag) + ' ' + t.size + 'px/' + t.weight + ' ' + t.family.split(',')[0]);
      }
    }
    // ── THE NON-VACUITY FLOOR · F-38.7 ──────────────────────────────────────
    // 「Every painted tuple is one of the six rungs」 is TRUE OF AN EMPTY PAGE. This cell
    // printed PASS against the real deploy while the fixture had been logged out and the
    // shell was not on screen at all. A universal claim over zero members is not evidence,
    // and a cell that cannot tell 「all correct」 from 「nothing to look at」 is the hollow
    // green this whole gate exists to refuse. Four shell surfaces cannot paint fewer than
    // forty text-bearing leaves between them; the floor is deliberately far below the
    // observed count so it convicts absence, never density.
    const TUPLE_FLOOR = 40;
    if (strays.length) F(tag + 'C-R6 the tuple set is the scale', strays.slice(0, 6).join(' \u00b7 ') + (strays.length > 6 ? ' (+' + (strays.length - 6) + ')' : ''));
    else if (tuplesSeen < TUPLE_FLOOR) F(tag + 'C-R6 the tuple set is the scale', 'only ' + tuplesSeen + ' painted tuples seen across four surfaces, floor ' + TUPLE_FLOOR + ' — this cell saw nothing and must not report a pass');
    else P(tag + 'C-R6 the tuple set is the scale', tuplesSeen + ' painted tuples on four surfaces, every one of the six rungs');

    // ── C-R7 · THE EDGE, BOTH DEFINITIONS  [R-38.5, CE-38 relay #2] ─────────
    // (a) THE TEXT EDGE: the wordmark, the first tile's border, the dock field's border and
    //     Billing's plan card resolve to ONE x. This is the founder's misalignment stated
    //     as a number — the header sat at 22px while everything else sat at 12.
    // (b) THE CONTAINER EDGE: .wl-nav's content box equals .wl-main's. The seats' TEXT is
    //     centred, so "left edge of nav" has no text referent and (a) cannot reach it.
    //     Two cells because there are two questions, not because one was hard to write.
    const billingUp = await settle(p, '/w/billing', '.wl-billcard', mode);
    const eB = !billingUp ? null : await p.evaluate(() => {
      const l = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().left * 10) / 10 : null; };
      return { house: l('.wl-house'), card: l('.wl-billcard'), dock: l('.wl-dockfield'),
               nav: l('.wl-nav'), main: l('.wl-main') };
    });
    const roomsUp = await settle(p, '/w/rooms', '.wl-tile', mode);
    const eR = !roomsUp ? null : await p.evaluate(() => {
      const t = document.querySelector('.wl-tile');
      return { tile: t ? Math.round(t.getBoundingClientRect().left * 10) / 10 : null };
    });
    // THE UNMOUNTED CASE IS ITS OWN VERDICT AND SAYS SO. It is not an edge failure and
    // must never be reported as one: the difference between 「these four are misaligned」
    // and 「I never saw them」 is the difference between a finding and a guess.
    if (!billingUp || !roomsUp) {
      F(tag + 'C-R7a the text edge is one x', 'SURFACE NEVER MOUNTED — billing=' + billingUp + ' rooms=' + roomsUp + '; no measurement was taken');
      F(tag + 'C-R7b the container edge agrees', 'SURFACE NEVER MOUNTED — no measurement was taken');
    } else {
      const xs = [eB.house, eR.tile, eB.dock, eB.card];
      const spread = Math.max(...xs) - Math.min(...xs);
      if (xs.every((v) => v !== null) && spread <= 0.5)
        P(tag + 'C-R7a the text edge is one x', 'house/tile/dock/plan-card all at ' + eB.house + ', spread ' + spread);
      else F(tag + 'C-R7a the text edge is one x', JSON.stringify({ house: eB.house, tile: eR.tile, dock: eB.dock, card: eB.card, spread }));
      if (eB.nav !== null && Math.abs(eB.nav - eB.main) <= 0.5)
        P(tag + 'C-R7b the container edge agrees', 'nav ' + eB.nav + ' = main ' + eB.main);
      else F(tag + 'C-R7b the container edge agrees', JSON.stringify(eB));
    }

    // ── C-R8 · EIGHTEEN ROOMS AT REST  [F-38.4, CE-38 relay #2] ─────────────
    // THE STOP CONDITION, AS A CELL RATHER THAN AS AN ARITHMETIC CLAIM. R-38.5 first ruled
    // 1:1 tiles; at three-up on 390px that is 114px square, and eighteen rooms then need
    // ~946px against ~651px of work area — Settings, Business Solutions, Collab and Advisor
    // permanently below the fold, which defeats R-37.61's own warrant. 64px fixed was ruled
    // instead, and the chair ordered it re-derived on glass with a STOP if it did not clear
    // with 8px to spare. It clears; this keeps it clearing.
    // ⚠ THIS BLOCK USED TO DEREFERENCE `.wl-main` WITHOUT A GUARD, so a surface that had
    // not mounted produced `Cannot read properties of null (reading 'scrollHeight')` and
    // the arm THREW. It never reached light mode and it wrote none of the 24 captures. A
    // bench that crashes instead of reporting is worse than one that reds: the red names
    // the cell, the crash costs every cell after it.
    if (!await settle(p, '/w/rooms', '.wl-tile', mode)) {
      F(tag + 'C-R8 eighteen rooms at rest', 'SURFACE NEVER MOUNTED — no measurement was taken');
      await p.close();
      continue;
    }
    const fit = await p.evaluate(() => {
      const main = document.querySelector('.wl-main');
      if (!main) return { tiles: null, overflow: null, tileH: null, slack: null };
      const tiles = [...document.querySelectorAll('.wl-tile')];
      const last = tiles.length ? tiles[tiles.length - 1].getBoundingClientRect() : null;
      return { tiles: tiles.length, overflow: main.scrollHeight - main.clientHeight,
               tileH: last ? Math.round(last.height) : null,
               slack: last ? Math.round(main.getBoundingClientRect().bottom - last.bottom) : null };
    });
    if (fit.tiles === 18 && fit.overflow === 0 && fit.slack >= 8)
      P(tag + 'C-R8 eighteen rooms at rest', fit.tiles + ' tiles at ' + fit.tileH + 'px, overflow ' + fit.overflow + ', slack ' + fit.slack + 'px');
    else F(tag + 'C-R8 eighteen rooms at rest', JSON.stringify(fit));

    // ── C-R11 · THE PRESS SURVIVES THE GESTURE  [F-38.20] ───────────────────
    //
    // Founder: 「it just vanishes into the action that its for. it feels like woosh its
    // gone.」 F-38.14 measured the press FILL to 1.511:1 and it changed nothing, because
    // the fill was the smaller half: the row's handler closed the drawer in the same frame
    // the press began, so the acknowledgement had no frame to exist in.
    //
    // SO THIS CELL ASSERTS TIME, NOT COLOUR — and it is deliberately written to fail on the
    // tree that measured green. It releases the pointer immediately, then looks 60ms LATER,
    // when the active pseudo-class is long over. A row still lit at that moment is a row
    // holding its own state; a row that is not was only ever lit while the finger was down.
    if (await settle(p, '/w/rooms', '.wl-coin', mode)) {
      await p.click('.wl-coin');
      await new Promise((r) => setTimeout(r, 350));
      const beat = await p.evaluate(async () => {
        const rows = [...document.querySelectorAll('.tdw-drawer .wl-drow')];
        const target = rows.find((r) => /Graphite|Chalk/.test(r.textContent || '')) || rows[0];
        if (!target) return { found: false };
        // A real press and release, then a look after the gesture is over.
        target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 60));
        const el = document.querySelector('.tdw-drawer .wl-drow.held');
        const drawer = document.querySelector('.tdw-drawer');
        return {
          found: true,
          heldAfterRelease: !!el,
          drawerStillUp: !!drawer,
          leaving: !!drawer && drawer.className.includes('is-leaving'),
        };
      });
      if (!beat.found) F(tag + 'C-R11 the press survives the gesture', 'no drawer rows to press');
      else if (beat.heldAfterRelease && beat.drawerStillUp && beat.leaving)
        P(tag + 'C-R11 the press survives the gesture', 'row still lit 60ms after release, menu leaving rather than vanished');
      else
        F(tag + 'C-R11 the press survives the gesture', JSON.stringify(beat) + ' — the acknowledgement did not outlive the tap');
    } else {
      F(tag + 'C-R11 the press survives the gesture', 'SURFACE NEVER MOUNTED — no measurement was taken');
    }

    // ── C-R13 · SIGN OUT CONFIRMS, AND THE CONFIRM REPLACES  [CE-38 SEAL ①] ─
    //
    // F-38.16: the founder tapped a non-interactive label and the tap fell through to a
    // 52px row that ended his session. Clearance was widened and the asymmetry stayed —
    // this was the estate's one destructive control acting on a single tap.
    //
    // THE CELL ASSERTS BOTH HALVES, because either alone would pass on a defect:
    //   (1) one tap does NOT sign out — the session survives and the drawer stays up
    //   (2) the confirm REPLACES the row rather than appearing beneath it, so the
    //       destructive button is never where the thumb was already travelling. That is
    //       F-38.16's mechanism, not its symptom, and a confirm added below the row would
    //       satisfy a naive test while reproducing the defect exactly.
    if (await settle(p, '/w/rooms', '.wl-coin', mode)) {
      await p.click('.wl-coin');
      await new Promise((r) => setTimeout(r, 350));
      const conf = await p.evaluate(async () => {
        const rows = [...document.querySelectorAll('.tdw-drawer .wl-drow')];
        const out = rows.find((r) => /Sign out/i.test(r.textContent || ''));
        if (!out) return { found: false };
        const beforeY = out.getBoundingClientRect().top;
        out.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 250));
        const btns = [...document.querySelectorAll('.tdw-drawer .wl-dbtn')];
        const stillRow = [...document.querySelectorAll('.tdw-drawer .wl-drow')]
          .some((r) => /Sign out/i.test(r.textContent || ''));
        const danger = btns.find((b) => /Sign out/i.test(b.textContent || ''));
        return {
          found: true,
          drawerStillUp: !!document.querySelector('.tdw-drawer'),
          sessionAlive: !!localStorage.getItem('vendor_session'),
          confirmShown: btns.length === 2,
          rowReplaced: !stillRow,
          // The destructive button must not land under where the finger already was.
          movedAway: !!danger && Math.abs(danger.getBoundingClientRect().top - beforeY) > 4,
        };
      });
      if (!conf.found) F(tag + 'C-R13 sign out confirms', 'no sign-out row in the drawer');
      else if (conf.drawerStillUp && conf.sessionAlive && conf.confirmShown && conf.rowReplaced && conf.movedAway)
        P(tag + 'C-R13 sign out confirms', 'one tap opens two buttons in place; the session survives and the row is replaced, not stacked under');
      else F(tag + 'C-R13 sign out confirms', JSON.stringify(conf));
    } else {
      F(tag + 'C-R13 sign out confirms', 'SURFACE NEVER MOUNTED — no measurement was taken');
    }

    // ── C-R14 · THE CONDITIONAL CARD IS LAST  [CE-38 SEAL ②] ────────────────
    // R-37.68-B amended by label: desk · ask · link. b40 asserts the order in SOURCE; this
    // asserts it in the DOM, which is the only place a reorder actually reaches the vendor.
    if (await settle(p, '/w/today', '.wl-fr', mode)) {
      const seq = await p.evaluate(() => [...document.querySelectorAll('.wl-fr .wl-card')]
        .map((c) => (c.querySelector('.wl-cardtitle')?.textContent || '').trim()));
      const lastIsLink = seq.length > 0 && /TDW link/i.test(seq[seq.length - 1]);
      if (lastIsLink) P(tag + 'C-R14 the conditional card is last', seq.join(' \u00b7 '));
      else F(tag + 'C-R14 the conditional card is last', 'order is ' + seq.join(' \u00b7 ') + ' — the conditional card inserts instead of appending (F-38.21)');
    } else {
      F(tag + 'C-R14 the conditional card is last', 'SURFACE NEVER MOUNTED — no measurement was taken');
    }

    // ── C-R12 · THE LINK CARD DOES NOT ARRIVE LATE  [F-38.21] ───────────────
    //
    // Founder: 「it takes a few seconds to load and then displaces whatever is there.」 The
    // card is conditional on a handle that only the wire knew, so it appeared mid-feed and
    // pushed the cards below it down.
    //
    // LIKE C-R10, THIS READS THE FIRST PAINT and waits for nothing else — the defect is
    // only visible before the fetch lands, so a cell that settles first would pass on a
    // broken tree. With the handle cached, the card must be in the feed's FIRST layout,
    // not inserted into it afterwards.
    await p.goto(BASE + '/w/today', { waitUntil: 'domcontentloaded' });
    let linkAtFirstPaint = null;
    try {
      await p.waitForSelector('.wl-fr', { timeout: 15000 });
      linkAtFirstPaint = await p.evaluate(() => {
        const cards = [...document.querySelectorAll('.wl-fr .wl-card')];
        return { cards: cards.length, hasLink: cards.some((c) => /Your TDW link/.test(c.textContent || '')) };
      });
    } catch { /* reported below */ }
    if (!linkAtFirstPaint) F(tag + 'C-R12 the link card does not arrive late', 'no first-run feed at first paint');
    else if (linkAtFirstPaint.hasLink) P(tag + 'C-R12 the link card does not arrive late', 'seeded from the handle cache; ' + linkAtFirstPaint.cards + ' cards in the first layout');
    else F(tag + 'C-R12 the link card does not arrive late', 'the link card is absent at first paint with a cached handle — it will insert itself later and displace the feed');

    // ── C-R10 · THE MEDALLION NEVER SHOWS A PLACEHOLDER IDENTITY  [F-38.19] ─
    //
    // Founder's walk: the coin painted its fallback glyph and then swapped to DR once
    // /api/v2/vendor/me returned. The name was in localStorage the whole time.
    //
    // THE ASSERTION IS ABOUT THE FIRST PAINT, so it cannot be made after settle() has
    // already waited for the shell — by then the fetch may well have landed and a broken
    // tree would pass. It navigates and reads the coin as early as the element exists,
    // WITHOUT waiting for anything else, which is the only moment the defect is visible.
    //
    // The fixture's session carries `name: 'Dev Roy'`, so a seeded coin reads DR. A coin
    // showing the glyph at first paint means the seed did not happen and the vendor is
    // watching a placeholder identity turn into his own.
    await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
    let firstPaint = null;
    try {
      await p.waitForSelector('.wl-coin', { timeout: 15000 });
      firstPaint = await p.evaluate(() => (document.querySelector('.wl-coin')?.textContent || '').trim());
    } catch { /* reported below */ }
    if (firstPaint === null) F(tag + 'C-R10 the medallion never shows a placeholder identity', 'no coin at first paint');
    else if (firstPaint === 'DR') P(tag + 'C-R10 the medallion never shows a placeholder identity', 'seeded from the session: ' + firstPaint);
    else F(tag + 'C-R10 the medallion never shows a placeholder identity', 'first paint reads ' + JSON.stringify(firstPaint) + ' — the coin is waiting on the wire for a name already in localStorage');

    // ── C-R9 · THE COIN IS TAPPABLE IN A CARRIED ROOM  [F-38.13] ────────────
    //
    // THE CELL THE AUDIT CANNOT WRITE, and the chair asked for it in three clauses. A
    // served-bytes gate runs no JavaScript and dispatches no tap; it proved the MECHANISM
    // (the scrim ships behind a guard) and this proves the BEHAVIOUR that mechanism exists
    // to produce. The distinction is the whole reason this file exists.
    //
    //   (1) AT REST the scrim is not in the document at all — not merely transparent, not
    //       merely pointer-events:none. Absent. The old defect was an element that WAS
    //       there, and every style-based test would have passed on it.
    //   (2) A REAL TAP ON THE COIN OPENS THE DRAWER. `elementFromPoint` at the coin's own
    //       centre must return the coin or a descendant — this is a HIT-TEST, not a query.
    //       It is the only assertion in this estate that would have caught F-38.13, because
    //       the coin was always present, always styled correctly, and always covered.
    //   (3) WITH THE DRAWER OPEN the scrim is present, so R-37.84 ⑥'s original substance
    //       survives intact: the drawer still overlays rather than displacing the page.
    //
    // IT RUNS ON A CARRIED ROOM (`/vendor/list/leads`) because that is where the defect
    // lived. `/w/*` renders no Header and would have exonerated the tree by not containing
    // the thing under test.
    const CARRIED = '/vendor/list/leads';
    if (!await settle(p, CARRIED, 'header', mode)) {
      F(tag + 'C-R9 the coin is tappable in a carried room', 'SURFACE NEVER MOUNTED — no measurement was taken');
    } else {
      // ⚠ WAIT OUT `Splash` BEFORE HIT-TESTING, AND THE FIRST CUT DID NOT. `Splash` is a
      // fixed z-10000 cold-open hero (`components/vendor/Splash.tsx:47`) that unmounts on a
      // timer — MIN_MS 2200 + 600 + 450, once per session via `sessionStorage`. The cell
      // hit-tested at ~1500ms, found the coin under a fixed z-10000 div, and reported the
      // coin uncovered-by-nothing as covered. THAT WOULD HAVE BEEN A FALSE CONVICTION OF A
      // CURED TREE — and it is the exact mirror of F-38.7, which passed on an empty page:
      // an instrument reporting on a moment rather than on a state.
      //
      // IT WAITS FOR THE TRANSIENT AND NEVER ASSUMES IT. If the cover is still there after
      // the bound, the hit-test below runs anyway and names what it found, so a PERMANENT
      // z-10000 cover is still convicted rather than waited out forever.
      await p.waitForFunction(() => ![...document.querySelectorAll('div')].some((e) => {
        const c = getComputedStyle(e);
        return c.position === 'fixed' && Number(c.zIndex) >= 10000;
      }), { timeout: 9000 }).catch(() => {});
      const rest = await p.evaluate(() => {
        const coin = document.querySelector('[data-tour="profile-coin"]');
        if (!coin) return { found: false };
        const r = coin.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return {
          found: true,
          scrimAtRest: !!document.querySelector('button[aria-label="Close menu"]'),
          // The hit-test. `coin.contains(hit)` covers the glyph span inside the button.
          coinReceivesTap: !!hit && (hit === coin || coin.contains(hit)),
          covering: hit ? (hit.getAttribute('aria-label') || hit.tagName.toLowerCase()) : null,
        };
      });
      if (!rest.found) {
        F(tag + 'C-R9 the coin is tappable in a carried room', 'no profile coin on ' + CARRIED);
      } else if (rest.scrimAtRest) {
        F(tag + 'C-R9 the coin is tappable in a carried room', 'F-38.13: the scrim is in the document AT REST');
      } else if (!rest.coinReceivesTap) {
        F(tag + 'C-R9 the coin is tappable in a carried room', 'the coin does not receive its own tap — covered by: ' + rest.covering);
      } else {
        await p.click('[data-tour="profile-coin"]');
        await new Promise((r) => setTimeout(r, 450));
        const open = await p.evaluate(() => ({
          scrimOpen: !!document.querySelector('button[aria-label="Close menu"]'),
          // The drawer answered: its own rows are reachable, which is what a flipped
          // `profileOpen` actually buys the vendor.
          rowsReachable: [...document.querySelectorAll('button, a')]
            .some((el) => /Sign Out|Sign out/.test(el.textContent || '')),
        }));
        if (open.scrimOpen && open.rowsReachable)
          P(tag + 'C-R9 the coin is tappable in a carried room', 'no scrim at rest, coin wins its own hit-test, drawer opens with its scrim');
        else
          F(tag + 'C-R9 the coin is tappable in a carried room', 'the tap landed but the drawer did not open: ' + JSON.stringify(open));
      }
    }

    // ── C-R4 / C-R5 RUN LAST, AND THE ORDER IS LOAD-BEARING  [F-38.8] ───────
    // These two open the chat, and opening the chat fires an AUTHENTICATED call
    // (`AiDock.ensureBusiness()` -> `fetchVictorMode()`). On a synthetic token the deploy
    // answers 401 and `_base.ts:106-113` responds with `clearVendorSession()` and
    // `window.location.href = '/'`. Per-document seeding makes the NEXT page have a
    // session again, but it cannot stop the redirect from hijacking the navigation that is
    // already in flight — which is why C-R6 kept reporting `/w/rooms NEVER MOUNTED` on the
    // deploy while C-R3, C-R7 and C-R8 all passed on the same route seconds later.
    //
    // THE CURE IS SEQUENCE, NOT MORE MACHINERY. The one action that logs the fixture out
    // now happens after every cell that needs it logged in. Two retry ladders and a
    // per-document seed were me adding mechanism to survive an ordering problem.
    // ── C-R4 · THE CHAT SHEDS THE COSTUME  [computed, not matched] ──────────
    // NB `sans-serif` CONTAINS `serif`; the first cut of this cell reddened a cured
    // tree on that alone. The sans- form is stripped before the serif test.
    // C-R9 leaves the page on a CARRIED room, which has no dock. These cells used the page
    // as they found it, so the arm threw `No element found for selector: .wl-dock` the
    // moment a cell was inserted above them. A cell that depends on the previous cell's
    // leftover page is a cell with an invisible argument; it settles its own surface now.
    if (!await settle(p, '/w/rooms', '.wl-dockfield', mode)) {
      F(tag + 'C-R4 chat input in branch tokens', 'SURFACE NEVER MOUNTED — no measurement was taken');
      F(tag + 'C-R5 chat opens at work-surface height', 'SURFACE NEVER MOUNTED — no measurement was taken');
      await p.close();
      continue;
    }
    await p.click('.wl-dockfield').catch(() => p.click('.wl-dock'));
    await new Promise((r) => setTimeout(r, 700));
    const c = await p.evaluate(() => {
      const ta = document.querySelector('.wl-askpanel textarea') || document.querySelector('textarea');
      if (!ta) return { found: false };
      const cs = getComputedStyle(ta);
      return { found: true, fontStyle: cs.fontStyle, fontFamily: cs.fontFamily };
    });
    const fam = (c.fontFamily || '').replace(/sans-serif/gi, '');
    if (c.found && c.fontStyle !== 'italic' && !/cormorant|georgia|\bserif\b/i.test(fam))
      P(tag + 'C-R4 chat input in branch tokens', c.fontStyle + ' / ' + c.fontFamily.split(',')[0]);
    else F(tag + 'C-R4 chat input in branch tokens', JSON.stringify(c));

    // ── C-R5 · THE CHAT IS A WORK SURFACE  [R-37.89] ────────────────────────
    // `max-height` is a CAP, not a height: it only bites when content is tall, and a
    // fresh thread is empty. The sheet opened at ~35% of the viewport for that reason.
    const h = await p.evaluate(() => {
      const el = document.querySelector('.wl-askpanel');
      if (!el) return { found: false };
      const r = el.getBoundingClientRect();
      return { found: true, h: Math.round(r.height), vh: window.innerHeight,
               ratio: +(r.height / window.innerHeight).toFixed(3) };
    });
    if (h.found && h.ratio >= 0.8) P(tag + 'C-R5 chat opens at work-surface height', h.ratio + ' of viewport');
    else F(tag + 'C-R5 chat opens at work-surface height', JSON.stringify(h));

    // ── CAPTURES · with the data condition in the name ──────────────────────
    if (CAPTURE) {
      try {
      fs.mkdirSync(CAPTURE, { recursive: true });
      // Expand the inner scroll column so the frame carries the WHOLE surface, then restore.
      const unclip = () => p.evaluate(() => {
        const wl = document.querySelector('.wl'), main = document.querySelector('.wl-main');
        if (!wl || !main) return;
        wl.dataset.wlPrevH = wl.style.height; wl.dataset.wlPrevO = wl.style.overflow;
        wl.style.height = 'auto'; wl.style.overflow = 'visible';
        main.style.overflowY = 'visible'; main.style.flex = 'none';
      });
      const reclip = () => p.evaluate(() => {
        const wl = document.querySelector('.wl'), main = document.querySelector('.wl-main');
        if (!wl || !main) return;
        wl.style.height = wl.dataset.wlPrevH || '100dvh'; wl.style.overflow = wl.dataset.wlPrevO || 'hidden';
        main.style.overflowY = ''; main.style.flex = '';
      });
      // ── F-38.9 · A CAPTURE MAY NEVER COST A CELL ────────────────────────────
      //
      // THE VERDICT IS THE CELLS. THE CAPTURES ARE EVIDENCE. Those are different things
      // and they must fail differently: a missing frame is a gap in what the founder can
      // look at, and it is worth exactly one line of log. It is not worth NINE CELLS.
      //
      // On the deploy, `Page.captureScreenshot` timed out on the first unclipped frame and
      // the throw propagated out of the whole run. Every dark cell had already passed —
      // including C-R8, which is F-38.4's STOP condition — and light mode never executed.
      // The cells were green and the arm reported nothing.
      //
      // ⚠ AND THIS IS THE SECOND TIME A THROW HAS COST LIGHT MODE. F-38.6 guarded the
      // MEASUREMENT path against exactly this and I stopped there: I cured the instance
      // and not the class. Every step that can throw is now either guarded or is a cell.
      //
      // `reclip()` runs in a `finally`, because a frame that fails mid-unclip would
      // otherwise leave the page expanded and hand the NEXT cell a shell with no fixed
      // viewport — a capture fault silently becoming a measurement fault.
      // ── F-38.12 · `fullPage` WAS THE HANG, NOT THE TIMEOUT ────────────────
      // Three frames per mode timed out on the deploy at 45s each even after the cap came
      // down. Raising or lowering a timeout was never going to fix it: Chrome's fullPage
      // path re-lays-out the document and composites it in one protocol call, and on a
      // shell full of `position:fixed` chrome (the scrim, the drawer, the dock, the nav)
      // over a network round trip it does not reliably return. THE FIX IS TO STOP ASKING
      // FOR IT. The page is already unclipped, so its document height is known — set the
      // viewport to that height and take an ORDINARY screenshot, which is one composite of
      // what is on screen and has no re-layout in it. Viewport restored after, always.
      const shot = async (n) => {
        try {
          await unclip();
          await new Promise((r) => setTimeout(r, 250));
          const h = await p.evaluate(() => Math.min(
            Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), 4000));
          await p.setViewport({ ...VIEW, height: h });
          await new Promise((r) => setTimeout(r, 200));
          await p.screenshot({ path: `${CAPTURE}/${mode}__${n}__SYNTHETIC-SPLASH.png`, timeout: 20000 });
        } catch (e) {
          console.log('  capture failed, cells unaffected: ' + mode + '__' + n + ' — ' + e.message.split('\n')[0]);
        } finally {
          try { await p.setViewport(VIEW); } catch { /* page may be gone */ }
          try { await reclip(); } catch { /* the page may be gone; the next settle() re-navigates */ }
        }
      };
      // §5's capture set. Billing, Settings and Advisor are SHELL routes now; the two
      // /vendor frames that remain are carried rooms that have not crossed, kept so the
      // founder can see the seam he is being asked to judge rather than only the cured half.
      for (const [name, path] of [['w-rooms', '/w/rooms'], ['w-today', '/w/today'],
        ['w-billing', '/w/billing'], ['w-settings', '/w/settings'],
        ['w-advisor', '/w/advisor'], ['w-support', '/w/support'],
        ['room-leads', '/vendor/list/leads'], ['room-collab', '/vendor/collab']]) {
        // A FRAME OF A HALF-MOUNTED PAGE IS EVIDENCE OF NOTHING and would be handed to the
        // founder looking like a broken surface. The capture waits on the shell too, and a
        // surface that never mounts is named in the log rather than photographed.
        if (!await settle(p, path, null, mode)) { console.log('  capture skipped, never mounted: ' + path); continue; }
        await shot(name);
      }
      if (await settle(p, '/w/rooms', '.wl-coin', mode)) {
        await p.click('.wl-coin'); await new Promise((r) => setTimeout(r, 400));
        await shot('tapped-drawer-on-rooms');
      }
      // §5 asks for the drawer open on BILLING as well as on Rooms: the drawer anchors to
      // the header, and a header on a surface with different content beneath it is where a
      // stacking or clipping fault would show. F-16.37 was exactly that fault.
      if (await settle(p, '/w/billing', '.wl-coin', mode)) {
        await p.click('.wl-coin'); await new Promise((r) => setTimeout(r, 400));
        await shot('tapped-drawer-on-billing');
      }
      // The tapped tile: the :active state R-38.2 requires within 16ms of touch.
      if (await settle(p, '/w/rooms', '.wl-tile', mode)) {
        await p.evaluate(() => {
          const t = document.querySelector('.wl-tile');
          if (t) t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        });
        await new Promise((r) => setTimeout(r, 120));
        await shot('tapped-tile');
      }
      if (await settle(p, '/w/rooms', '.wl-dockfield', mode)) {
        await p.click('.wl-dockfield'); await new Promise((r) => setTimeout(r, 800));
        await shot('tapped-chat');
      }
      // F-38.13's evidence: a CARRIED room at rest and with its drawer open. The founder
      // found this defect on exactly these surfaces and the frame set had none of them
      // open — every drawer frame was a shell surface, where no Header renders and the
      // defect could not appear.
      if (await settle(p, CARRIED, 'header', mode)) {
        await shot('carried-leads-at-rest');
        await p.click('[data-tour="profile-coin"]');
        await new Promise((r) => setTimeout(r, 450));
        await shot('carried-leads-drawer-open');
      }
      } catch (e) {
        // ── F-38.11 · THE EVIDENCE PATH IS ONE GUARDED REGION, AND THAT IS THE RULE ──
        //
        // FOUR TIMES a throw inside the capture block has cost every cell after it, and
        // three of those times I guarded the STEP that threw and moved on:
        //   F-38.6  guarded the measurement navigations
        //   F-38.9  guarded `shot()` itself
        //   and then `.wl-coin` threw here, outside both, and light mode died again.
        //
        // Patching the site that threw is not a cure when the CLASS is 「anything in the
        // evidence path can reach the verdict path」. The rule is structural now and it is
        // one line of syntax: THE WHOLE CAPTURE BLOCK IS INSIDE ONE try. Nothing that
        // happens while gathering pictures can ever again change what the cells reported,
        // or stop the other mode from running.
        //
        // I cured the instance three times before curing the class. That is the estate's
        // own most-named failure and it took the founder asking why a run was slow to make
        // me stop patching and look at the shape.
        console.log('  capture block aborted, cells unaffected: ' + e.message.split('\n')[0]);
      }
    }
    await p.close();
  }

  await browser.close();
  console.log('\n' + pass + ' PASS · ' + fail + ' FAIL');
  // A GREEN VERDICT BESIDE AN EMPTY CAPTURE DIRECTORY MUST NOT READ AS A COMPLETE RUN.
  // The cells are the verdict and a lost frame does not red them (F-38.9) — but the chair
  // gates these frames before the founder sees anything, so a short set is a gap in the
  // evidence and has to announce itself rather than sit quietly under the word GREEN.
  if (CAPTURE) {
    const n = fs.readdirSync(CAPTURE).length;
    console.log('captures: ' + n + ' frames in ' + CAPTURE);
    if (n < 28) console.log('  \u26a0 EVIDENCE INCOMPLETE — 28 frames were ruled, ' + n + ' were written. The cells above stand; the walk card does not go to the founder on a short set.');
  }
  console.log(fail === 0 ? 'RENDER ARM GREEN.' : 'RENDER ARM RED — the ZIP bounces.');
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('render arm threw: ' + e.message); process.exit(3); });
