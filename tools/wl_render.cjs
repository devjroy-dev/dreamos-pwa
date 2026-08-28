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
// ── THE FIXTURE IS REAL NOW, OR THE ARM SAYS SO AND REDS  [F-38.8, item 1(c)] ────────
//
// It used to be SYNTHETIC always: a seeded token that was not a real one, so every
// authenticated fetch failed closed. That was stated honestly and it was still the wrong
// shape, for two reasons that only look separate.
//
//   (1) IT COULD ONLY EVER SPEAK ABOUT CHROME. Nothing behind the token was ever asserted,
//       so three cells about the vendor's own identity and her own link were passing on
//       values this file had planted in localStorage a moment earlier. A cell that asserts
//       a value the instrument itself wrote is a mirror, not a measurement.
//   (2) IT MADE THE PRODUCT LOG THE FIXTURE OUT. A synthetic token 401s; _base.ts:103-124
//       refreshes once, fails, and calls clearAndRedirect. FOUR CURES IN THIS FILE ARE
//       MACHINERY BUILT TO SURVIVE THAT LOGOUT — and a real token simply does not cause it.
//
// SO: `source tools/wl_mint_token.sh` exports WL_RENDER_TOKEN into the shell, this file
// reads it from the ENVIRONMENT, and asks the real GET /api/v2/vendor/me with it before a
// browser is launched. What comes back is the identity the cells assert against.
//
// THERE IS NO /me STUB ANYWHERE IN THIS FILE, and the prohibition is the point rather than
// a detail. A stub would let every cell go green with no server behind it, which is the
// hollow green this whole gate exists to refuse (D-38.1). With no token the arm prints
// `fixture: SYNTHETIC — every authenticated cell will FAIL` AND THEN DOES EXACTLY THAT: the
// three authenticated cells red, the chrome cells stay green, and the verdict is RED. A
// synthetic run is a usable chrome run that can never be mistaken for a complete one.
//
// The non-token seed fields are derived, never guessed: lib/vendor/session.ts — SESSION_KEY
// (:11), id must not be MOCK_VENDOR_ID (:19), access_token must not be MOCK_ACCESS_TOKEN
// (:20), _v >= SESSION_VERSION = 2 (:24).
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

// ── THE TOKEN COMES FROM THE ENVIRONMENT AND FROM NOWHERE ELSE ──────────────────────
// Not argv (a token in argv is in `ps` and in every log that echoes its command) and not a
// file in the tree (a dotfile with a bearer token in it survives the sitting and gets
// committed by someone in a hurry). tools/wl_mint_token.sh is the only issuer.
const TOKEN = process.env.WL_RENDER_TOKEN || '';

// THE STANDING TEST VENDOR (founder's ruling, 2026-07-29). One home for the number in this
// file, and the mint script refuses to authenticate as anyone else.
//
// ⚠ THE ARM CANNOT RE-DERIVE THIS FROM THE WIRE, AND SAYS SO RATHER THAN IMPLYING IT CAN.
// GET /api/v2/vendor/me carries id, name, business_name, category, city, handle, tier and
// more (dream-os src/api/vendor/me.js:68-92) — and NO phone field. So the 9888294440 in the
// fixture line below is true because wl_mint_token.sh refuses every other number, not
// because this file read it back. That provenance is printed, not assumed.
const TEST_PHONE = '9888294440';

// ── THE API HOST IS READ FROM ITS ONE HOME, NOT RETYPED ─────────────────────────────
// The browser reaches the API through lib/vendor/api/_base.ts's API_BASE. Copying that
// literal here would be a second home for the host, and the two would drift the day the
// deploy moves — the same correction C-R3 took for the room count at ZIP 14. An override
// exists for a local or preview API and is the same variable the mint script reads, so the
// token and the probe can never be pointed at two different servers.
const API_BASE = process.env.WL_RENDER_API_BASE ||
  (fs.readFileSync('lib/vendor/api/_base.ts', 'utf8').match(/'(https:\/\/[^']+)'/) || [])[1] || '';

// What the wire says the vendor IS. Filled by the probe below; every authenticated cell
// asserts against it, and an unfilled WIRE is what makes those cells red under SYNTHETIC.
let WIRE = { ok: false, id: null, name: null, handle: null, tier: null, status: 0 };

async function readWire() {
  if (!TOKEN || !API_BASE) return;
  try {
    const r = await fetch(API_BASE + '/api/v2/vendor/me', {
      headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    });
    WIRE.status = r.status;
    const j = await r.json().catch(() => null);
    if (r.ok && j && j.ok && j.vendor) {
      WIRE = { ok: true, id: j.vendor.id || null, name: j.vendor.name || null,
               handle: j.vendor.handle || null, tier: j.vendor.tier || null, status: r.status };
    }
  } catch (e) { WIRE.status = -1; }
}

// The seed is assembled AFTER the probe, so under REAL it carries the vendor's own id, name
// and tier beside the real token — which is what a pin-login actually writes into the
// session. Under SYNTHETIC it keeps the old declared-fake identity so the CHROME cells still
// have a shell to measure; only the authenticated cells lose their subject.
function seedSession() {
  return WIRE.ok
    ? { id: WIRE.id, user_id: 'wl-render-arm', name: WIRE.name,
        phone: '+91' + TEST_PHONE, tier: WIRE.tier,
        // The refresh token is the access token deliberately: it is never exercised,
        // because a real access token does not 401 and _base.ts only refreshes on a 401.
        // A second real secret in this process to cover a path that cannot be taken would
        // be a widened blast radius bought with nothing.
        access_token: TOKEN, refresh_token: TOKEN, _v: 2 }
    : { id: '11111111-2222-3333-4444-555555555555', user_id: 'wl-render-arm',
        name: 'Dev Roy', phone: '+91' + TEST_PHONE, tier: 'signature',
        access_token: 'wl-render-arm-token', refresh_token: 'wl-render-arm-token', _v: 2 };
}
let SEED = null;

/** The initials rule, asserted rather than owned. Its home is hooks/vendor/useVendorHandle.ts
 *  `initialsOf`; C-R10 has to compute the expectation to compare against what painted. */
const initialsOf = (n) => (n || '').trim().split(/\s+/).filter(Boolean)
  .slice(0, 2).map((w) => w[0].toUpperCase()).join('');

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
//   · C-R6 asserts a FLOOR on how many tuples it saw, so it can never again pass by
//     looking at nothing
//
// ── THE RE-SEED RETIRES · A RECOVERY WAS THE WRONG SHAPE  [item 1(a)] ──────────────
//
// settle() used to retry once, re-seeding the session in between, and it printed a line
// saying so. That line was scrupulous about not naming a cause it had not derived — and it
// was still an instrument REPAIRING ITS SUBJECT MID-MEASUREMENT and then reporting green.
//
// THE ONLY THING THAT CLEARS THIS SESSION IS THE PRODUCT DECIDING TO. `_base.ts:103-124`
// calls clearAndRedirect when an authenticated call 401s and the refresh fails. So a
// surface that needed a re-seed to settle is a surface the vendor was ALSO thrown out of;
// the retry did not fix that, it hid it, and it hid it behind a PASS. Four cures in this
// file were built to survive that logout, which is three more than the problem deserved:
// with a real token it does not happen at all, and when it does happen it is the finding.
//
// SO THE RE-SEED IS REFUSED AND THE CELL REDS. settle() takes the names of the cells that
// depend on it and records the failure against each of them, because the alternative —
// returning false and trusting every call site to remember — is how a surface that never
// mounted becomes a cell that was never printed.
async function settle(p, path, landmark, cells) {
  // THE ROOT LANDMARK IS PER-TREE. The first cure waited for `.wl-main` on EVERY path,
  // including the two carried /vendor rooms that are captured ON PURPOSE as the seam the
  // founder is being asked to judge. Those surfaces have no `.wl-main` and never will, so
  // the arm skipped them and shipped 20 frames where 24 were ruled. Waiting for the wrong
  // landmark and waiting for no landmark fail the same way.
  const root = path.startsWith('/w') ? '.wl-main' : 'header';
  try {
    await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    await p.waitForSelector(root, { timeout: 15000 });
    if (landmark) await p.waitForSelector(landmark, { timeout: 15000 });
    return true;
  } catch {
    // `cells` is omitted by the capture loop and by seat(), which report their own way and
    // must not manufacture cell verdicts out of a missing picture.
    for (const c of (cells || [])) F(c, 'surface did not settle; re-seed refused');
    if (!cells || !cells.length) console.log('  did not settle: ' + path + ' (re-seed refused)');
    return false;
  }
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
      // ⚠ `tdw_vendor_handle` IS NO LONGER SEEDED, AND ITS DELETION IS THE POINT.
      // This file used to write DEVROY into the handle cache because the synthetic token
      // could not make the wire answer — and C-R12, whose whole subject is that cache,
      // then asserted a value THIS FILE HAD JUST WRITTEN. That is a mirror, not a
      // measurement. With a real token the wire fills the cache the way it does on a
      // vendor's second load, and C-R12 warms it by NAVIGATING rather than by planting it.
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
  if (!await settle(p, '/w/rooms', '.wl-coin')) { await p.close(); return null; }
  return p;
}

(async () => {
  console.log('wl_render · ' + BASE + '\n');

  // ── THE FIRST LINE IS A DERIVED CLAIM, NOT A LABEL  [item 1(c)] ──────────────────
  // The probe runs before a browser exists, so the run declares what it is before it can
  // have spent a minute of the founder's time pretending to be something else.
  await readWire();
  SEED = seedSession();

  // ── F-38.37 · THE ARM NAMES THE TREE IT MEASURED TOO ─────────────────────
  // Same reasoning as wl_audit's: a run whose build cannot be identified produces cells
  // that are unattributable, and three of this arm's runs this sitting were spent on that.
  // It REPORTS rather than refuses — the arm's first navigation is where a wrong build
  // shows up anyway, and a browser launch is cheap enough that being told beats being
  // stopped. The audit refuses because it is the gate; this informs because it is evidence.
  try {
    const { execSync } = require('child_process');
    const local = execSync('git rev-parse --short=7 HEAD', { encoding: 'utf8' }).trim();
    const html = await (await fetch(BASE + '/w/today')).text();
    const refs = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\\ )]+?\.js/g)].map((m) => m[0]))];
    let stamp = null;
    for (const r of refs.slice(0, 40)) {
      const body = await (await fetch(BASE + r)).text();
      const m = body.match(/data-tdw-commit["'\]:=\s]{1,4}["']([0-9a-f]{7}|local)["']/);
      if (m) { stamp = m[1]; break; }
    }
    if (!stamp) console.log('deploy: UNSTAMPED — this build predates F-38.37; cells cannot be attributed to a commit\n');
    else if (stamp === local) console.log('deploy: ' + stamp + ' = this tree\n');
    else console.log('deploy: ' + stamp + ' \u2260 this tree ' + local + ' — EVERY CELL BELOW IS ABOUT THE DEPLOYED BUILD\n');
  } catch (e) {
    console.log('deploy: could not be identified (' + String(e.message).split('\n')[0] + ')\n');
  }
  if (WIRE.ok) {
    console.log('fixture: REAL (' + TEST_PHONE + ')');
    // The provenance, immediately underneath, because the line above names a number this
    // file did not read. GET /me carries no phone (dream-os src/api/vendor/me.js:68-92):
    // the number is true because tools/wl_mint_token.sh refuses to mint for any other.
    console.log('  phone asserted by tools/wl_mint_token.sh, which refuses every other');
    console.log('  number; /me carries no phone field. Wire read: ' + JSON.stringify(
      { name: WIRE.name, handle: WIRE.handle, tier: WIRE.tier }) + '\n');
  } else {
    console.log('fixture: SYNTHETIC — every authenticated cell will FAIL');
    console.log('  ' + (TOKEN
      ? 'WL_RENDER_TOKEN is set but GET /me answered ' + WIRE.status
      : 'WL_RENDER_TOKEN is not set. Run: source tools/wl_mint_token.sh'));
    console.log('  chrome cells still measure a real shell; the verdict will be RED.\n');
  }

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
      F(tag + 'the shell never seated', 'no .wl-coin at /w/rooms and the re-seed is refused — every cell for this mode was skipped, not passed');
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
    //
    // ── ⚠ F-38.36 · THIS WAS THE LAST UNGUARDED NAVIGATION IN THE FILE ───────
    // A bare goto and a bare waitForSelector, outside settle() and outside any try. On the
    // founder's run the tiles did not arrive and it threw `Waiting for selector .wl-tile
    // failed` OUT OF THE WHOLE ARM: C-R1 had printed, and thirty-nine cells after it were
    // never evaluated. One PASS and a stack trace, from a gate whose entire job is to
    // report on forty things.
    //
    // THAT IS F-38.11's CLASS, THE FOURTH SIGHTING, AND I CURED THE INSTANCE THREE TIMES
    // BEFORE CURING THE CLASS — F-38.6 guarded the measurement navigations, F-38.9 guarded
    // shot(), F-38.11 wrapped the whole capture block, and this line sat outside all three
    // because it predated them and nothing swept for siblings. The rule is structural now:
    // EVERY navigation in this file goes through settle(), which names the cells that die
    // with it and reds them instead of throwing.
    //
    // THE INVARIANT, STATED SO IT CAN BE CHECKED RATHER THAN TRUSTED: every `p.goto(` in
    // this file is either INSIDE settle() or inside a try whose catch reports its own cell.
    // Four sites, verified by grep at the cut — settle at :225, C-R12's held-wire walk,
    // C-R10's first paint, C-R16's in-app walk. A fifth added outside both is a regression
    // and there is now nothing subtle about spotting it.
    const CR23 = [tag + 'C-R2 the gutter APPLIES', tag + "C-R3 the registry's room count is what paints"];
    if (!await settle(p, '/w/rooms', '.wl-tile', CR23)) { await p.close(); continue; }
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
    //
    // ⚠ THE SIX CROSSED LIST ROOMS ARE EXCLUDED BY NAME TOO, ON THE SAME REASONING AND
    // WITH THE SAME REFUSAL TO GO QUIET ABOUT IT. They crossed STRUCTURALLY at S2 §4-1 and
    // their CHROME conforms; their BODIES do not, and R-38.12 is why they were not made to.
    // Two facts about those bodies are filed rather than swept:
    //   F-38.22 — thirty colour literals across seven files in the slice tree, which bypass
    //             the variable layer and paint Espresso brass inside a Graphite scope.
    //   F-38.23 — the older type register the slice tree was built in.
    // Capturing these six and letting this cell pass over them would make R-38.4's "by
    // construction, not by sweep" claim false on six surfaces at once. The exclusion is
    // three lines of code and a paragraph of handover, so it cannot be forgotten — and the
    // frames are still taken, so the founder SEES the gap he is being asked to price.
    // ⚠ AND CALENDAR JOINS THE NAMED EXCLUSIONS AT §4-2, ON THE SAME REASONING AS THE SIX
    // AND WITH THE SAME REFUSAL TO GO QUIET ABOUT IT. It crossed STRUCTURALLY; its chrome
    // conforms and its BODY does not — `app/vendor/calendar/screen.tsx` carries the slice
    // tree's older type register and its own colour literals (F-38.22's family). Capturing
    // it and letting this cell pass over it would make R-38.4's 「by construction, not by
    // sweep」 claim false on a seventh surface. The frame is still taken, so the founder
    // SEES the gap he is being asked to price.
    const SCALE_SURFACES = ['/w/rooms', '/w/today', '/w/billing', '/w/advisor'];
    const RUNGS = [
      { n: 't0', px: 46, w: 500, fam: 'Cormorant' }, { n: 't1', px: 24, w: 500, fam: 'Cormorant' },
      { n: 't2', px: 17, w: 500, fam: 'DM Sans' },   { n: 't3', px: 14, w: 400, fam: 'DM Sans' },
      { n: 't4', px: 12, w: 500, fam: 'DM Sans' },   { n: 't5', px: 11, w: 500, fam: 'DM Sans' },
    ];
    const strays = [];
    let tuplesSeen = 0;
    for (const path of SCALE_SURFACES) {
      if (!await settle(p, path, null)) { strays.push(path + ' NEVER MOUNTED'); continue; }
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
    //
    // THE UNMOUNTED CASE IS ITS OWN VERDICT AND SAYS SO — it is not an edge failure and
    // must never be reported as one. It used to be written out by hand here; settle() owns
    // it now, so the two cells are named ONCE, at the step that can lose them, and a third
    // surface added to this measurement cannot forget to report itself.
    const CR7 = [tag + 'C-R7a the text edge is one x', tag + 'C-R7a first-run interiors are one x', tag + 'C-R7b the container edge agrees'];
    const billingUp = await settle(p, '/w/billing', '.wl-billcard', CR7);
    const eB = !billingUp ? null : await p.evaluate(() => {
      const l = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().left * 10) / 10 : null; };
      return { house: l('.wl-house'), card: l('.wl-billcard'), dock: l('.wl-dockfield'),
               nav: l('.wl-nav'), main: l('.wl-main') };
    });
    const roomsUp = billingUp && await settle(p, '/w/rooms', '.wl-tile', CR7);
    const eR = !roomsUp ? null : await p.evaluate(() => {
      const t = document.querySelector('.wl-tile');
      return { tile: t ? Math.round(t.getBoundingClientRect().left * 10) / 10 : null };
    });
    // ── H-1(b) · F-38.40b · THE FIRST-RUN INTERIORS JOIN THE ANCHOR SET ───────
    // C-R7a measured four anchors and every one of them was a CONTAINER edge — the
    // wordmark, a tile's border, the dock field's border, the plan card's border. So the
    // founder could look at Today, see text that did not line up, and the cell could
    // honestly report one x: it had never looked at any of the text he was reading.
    //
    // Three anchors are added, and they are the three he actually reads. The eyebrow is at
    // the HOUSE edge — it is a band label, kin to `YOUR WORK` on Rooms, and the chair has
    // ruled it stays there. The card titles and bodies are at the CARD INTERIOR edge, one
    // gutter plus one border plus one padding in. Two edges, deliberately, and the cell
    // asserts each set is internally one x rather than pretending they are one number.
    //
    // THE DEFECT THIS WAS BUILT OVER: `.wl-card-lead` swapped a .5px border for 2px
    // without compensating the padding, so card 1's interior painted 1.5px right of cards
    // 2 and 3. Three titles, three x values. Nothing measured it because nothing looked.
    const todayUp = billingUp && roomsUp && await settle(p, '/w/today', '.wl-fr', CR7);
    const eT = !todayUp ? null : await p.evaluate(() => {
      const l = (e) => (e ? Math.round(e.getBoundingClientRect().left * 10) / 10 : null);
      const q = (s) => [...document.querySelectorAll(s)].map(l);
      return { eyebrow: l(document.querySelector('.wl-frhead')),
               titles: q('.wl-fr .wl-cardtitle'), bodies: q('.wl-fr .wl-cardbody') };
    });
    if (todayUp) {
      const interiors = [...eT.titles, ...eT.bodies].filter((v) => v !== null);
      const iSpread = interiors.length ? Math.max(...interiors) - Math.min(...interiors) : null;
      if (eT.titles.length < 3)
        F(tag + 'C-R7a first-run interiors are one x', 'saw ' + eT.titles.length + ' card titles on Today, expected 3 — this cell must not pass on a surface it could not see');
      else if (iSpread !== null && iSpread <= 0.5)
        P(tag + 'C-R7a first-run interiors are one x', interiors.length + ' titles/bodies all at ' + interiors[0] + ', spread ' + iSpread);
      else
        F(tag + 'C-R7a first-run interiors are one x', JSON.stringify({ titles: eT.titles, bodies: eT.bodies, spread: iSpread }));
    }
    if (billingUp && roomsUp) {
      const xs = [eB.house, eR.tile, eB.dock, eB.card];
      if (todayUp && eT.eyebrow !== null) xs.push(eT.eyebrow);
      const spread = Math.max(...xs) - Math.min(...xs);
      if (xs.every((v) => v !== null) && spread <= 0.5)
        P(tag + 'C-R7a the text edge is one x', 'house/tile/dock/plan-card/eyebrow all at ' + eB.house + ', spread ' + spread);
      else F(tag + 'C-R7a the text edge is one x', JSON.stringify({ house: eB.house, tile: eR.tile, dock: eB.dock, card: eB.card, eyebrow: todayUp ? eT.eyebrow : 'not measured', spread }));
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
    if (!await settle(p, '/w/rooms', '.wl-tile', [tag + 'C-R8 eighteen rooms at rest'])) {
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
    if (await settle(p, '/w/rooms', '.wl-coin', [tag + 'C-R11 the press survives the gesture'])) {
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
    if (await settle(p, '/w/rooms', '.wl-coin', [tag + 'C-R13 sign out confirms'])) {
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
    }

    // ── C-R12 / C-R14 · THE FIRST-RUN SET PAINTS ONCE  [relay #3 item 3] ────
    //
    // THESE TWO CELLS WERE RIGHT AND THE SURFACE WAS WRONG. C-R12 asked whether the link
    // card was in the first layout and C-R14 asked whether it was last; on the deploy DARK
    // saw two cards and LIGHT saw three, on one tree, in one run. The seeded handle cache
    // is gone, so the handle now arrives WITH /me and the feed's first paint raced it.
    //
    // RE-TIMING WAS THE OLD ANSWER TWICE OVER — the card was ordered last so its arrival
    // would append, then the cache was added so the second load would beat it — and a
    // re-timing can always still lose. The ruling retires the race: nothing in the set
    // paints until the shell's one /me resolves, then all of it paints at once.
    //
    // ⚠ SO THE CELLS ASSERT THE PRE-SETTLE STATE, AND THAT STATE IS UNOBSERVABLE WITHOUT
    // HOLDING THE WIRE. The window between first paint and /me is milliseconds on a warm
    // deploy; a cell that navigated and looked would pass on the broken tree most of the
    // time, which is the hollow green this gate exists to refuse. The arm DELAYS the real
    // /me response rather than answering it — the request goes to the real server, the real
    // answer comes back, and only its arrival is held. That is the opposite of a stub: a
    // stub removes the server, this one keeps it and widens the moment the defect lives in.
    const CR12 = tag + 'C-R12 no first-run card paints before the wire settles';
    const CR14 = tag + 'C-R14 on settle, the whole set paints at once in ruled order';
    if (!WIRE.ok) {
      F(CR12, 'SYNTHETIC fixture — /me never settles with an answer; source tools/wl_mint_token.sh');
      F(CR14, 'SYNTHETIC fixture — no wire answer, so there is no settled set to read');
    } else {
      // The expected titles come from the register, never retyped. A cell holding its own
      // copy of a vetoed byte reddens a correct tree the day the byte is re-vetoed, which
      // teaches the next seat to loosen it.
      const copySrc = fs.readFileSync('lib/worklist/copy.ts', 'utf8');
      // ⚠ THIS LINE WAS OVER-ESCAPED AND THE CELL RED ON A CORRECT TREE. Written through a
      // heredoc, the escapes doubled: the JS source read `'^\\\\s*'`, so the RegExp got a
      // literal backslash followed by `s` and matched nothing. Every title came back empty
      // and the cell reported 「a card title byte is missing from the register」 — a true
      // statement about its own regex, phrased as a finding about copy.ts.
      // Re-derived by running the expression against the file rather than by reading it.
      const byte = (k) => (copySrc.match(new RegExp('^\\s*' + k + ":\\s*'((?:[^'\\\\]|\\\\.)*)'", 'm')) || [])[1] || '';
      const WANT = [byte('cardDeskTitle'), byte('cardAskTitle'), byte('cardLinkTitle')];
      let held = null, settledSeq = null, laterSeq = null, err = null;
      try {
        await p.setRequestInterception(true);
        const hold = async (req) => {
          try {
            if (req.url().includes('/api/v2/vendor/me')) {
              await new Promise((r) => setTimeout(r, 2500));
              await req.continue();
            } else await req.continue();
          } catch { /* the request may already be handled on teardown */ }
        };
        p.on('request', hold);
        await p.goto(BASE + '/w/today', { waitUntil: 'domcontentloaded' });
        // The masthead does not wait on the wire, so it is the landmark that proves the
        // surface is up while the feed is still legitimately empty.
        await p.waitForSelector('.wl-masthead', { timeout: 15000 });
        held = await p.evaluate(() => ({
          cards: document.querySelectorAll('.wl-fr .wl-card').length,
          fr: !!document.querySelector('.wl-fr'),
        }));
        // Now let it land, and read the set.
        await p.waitForSelector('.wl-fr .wl-card', { timeout: 15000 });
        settledSeq = await p.evaluate(() => [...document.querySelectorAll('.wl-fr .wl-card')]
          .map((c) => (c.querySelector('.wl-cardtitle') || {}).textContent?.trim() || ''));
        // AND NOTHING ARRIVES AFTER. The insertion this whole arc has been chasing happens
        // late by definition, so the cell has to still be looking when it would.
        await p.waitForNetworkIdle({ idleTime: 900, timeout: 12000 }).catch(() => {});
        laterSeq = await p.evaluate(() => [...document.querySelectorAll('.wl-fr .wl-card')]
          .map((c) => (c.querySelector('.wl-cardtitle') || {}).textContent?.trim() || ''));
        p.off('request', hold);
        await p.setRequestInterception(false);
      } catch (e) {
        err = String(e.message).split('\n')[0];
        try { await p.setRequestInterception(false); } catch { /* page may be gone */ }
      }

      if (err) { F(CR12, 'the held-wire walk threw: ' + err); F(CR14, 'the held-wire walk threw: ' + err); }
      else {
        if (!held) F(CR12, 'the surface never mounted while the wire was held');
        else if (held.cards === 0) P(CR12, 'the masthead is up and the feed is empty while /me is in flight' + (held.fr ? ' (region present, no cards)' : ''));
        else F(CR12, held.cards + ' first-run cards painted BEFORE /me settled — the set is racing the wire again (R-37.68-B)');

        if (!settledSeq || !settledSeq.length) F(CR14, 'no first-run set after the wire settled');
        else if (WANT.some((w) => w === '')) F(CR14, 'a card title byte is missing from the register, so this cell has no expectation to compare against');
        else {
          // The link card is last OR absent — absent is legitimate for a vendor with no
          // handle (R-37.68 (4)) and must not be read as a reorder.
          const expected = WIRE.handle ? WANT : WANT.slice(0, 2);
          const same = settledSeq.length === expected.length && settledSeq.every((t, i) => t === expected[i]);
          const grew = laterSeq && laterSeq.length !== settledSeq.length;
          if (same && !grew) P(CR14, settledSeq.join(' \u00b7 ') + ' \u2014 whole at first paint, nothing inserted after');
          else if (grew) F(CR14, 'the set grew from ' + settledSeq.length + ' to ' + laterSeq.length + ' cards after settling — a card is still inserting itself (F-38.21)');
          else F(CR14, 'order is ' + settledSeq.join(' \u00b7 ') + ', ruled ' + expected.join(' \u00b7 '));
        }
      }
    }

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
    // ── AUTHENTICATED · THE EXPECTATION IS THE SERVER'S NAME  [item 1(c)] ────
    // It used to assert the literal 'DR', against a session this file had seeded with the
    // literal 'Dev Roy'. Both halves were the instrument's own invention, so the cell could
    // not tell a working seed from a lucky one. The expectation is now initialsOf(WIRE.name)
    // — the name GET /me returns — and the seed carries that same name because that is what
    // a real pin-login writes into the session. A coin showing the glyph at first paint
    // still means the seed did not happen and the vendor is watching a placeholder identity
    // turn into her own; a coin showing the WRONG initials now reds too, which the old cell
    // could not do.
    const CR10 = tag + 'C-R10 the medallion never shows a placeholder identity';
    const want = initialsOf(WIRE.name);
    if (!WIRE.ok || !want) {
      F(CR10, WIRE.ok
        ? 'the wire returned no name, so there is no identity to assert'
        : 'SYNTHETIC fixture — no wire identity to assert against; source tools/wl_mint_token.sh');
    } else {
      // The goto is guarded too, and it was not: a navigation that rejects outside the try
      // below throws past this cell exactly as C-R2's did. Same sweep, same sitting.
      let firstPaint = null;
      try {
        await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
        await p.waitForSelector('.wl-coin', { timeout: 15000 });
        firstPaint = await p.evaluate(() => (document.querySelector('.wl-coin')?.textContent || '').trim());
      } catch { /* reported below */ }
      if (firstPaint === null) F(CR10, 'no coin at first paint');
      else if (firstPaint === want) P(CR10, 'first paint reads ' + firstPaint + ', the wire name\'s own initials');
      else F(CR10, 'first paint reads ' + JSON.stringify(firstPaint) + ', the wire name gives ' + want + ' — the coin is waiting on the wire for a name already in localStorage');
    }

    // ── C-R15 · THE SESSION SURVIVES THE WIRE  [F-38.8, NEW at item 1] ──────
    //
    // THIS IS THE THING FOUR CURES IN THIS FILE WERE BUILT TO HIDE, PROMOTED TO A CELL.
    // F-38.8 established that an authenticated call on a bad token 401s, that _base.ts's
    // refresh then fails, and that clearAndRedirect wipes the session and sends the browser
    // to '/'. Every one of those cures — the re-seed, the per-document seeding, the
    // load-bearing cell order — is machinery for continuing to measure a shell the product
    // had already thrown the fixture out of. None of them ASSERTED that it had not.
    //
    // It observes at the moment the defect is visible (D-38.1): it waits for the response to
    // the shell's own GET /me rather than for a clock, then asks two questions the redirect
    // answers. Under SYNTHETIC this reds, and that red is the honest report of a fixture
    // that has been logged out — which is what the arm spent an arc pretending had not
    // happened.
    const CR15 = tag + 'C-R15 the session survives the wire';
    {
      // ── A LISTENER, NOT A SINGLE-SHOT WAITER  [ZIP 2 cure] ────────────────
      // The first cut used `waitForResponse`, which resolves on the FIRST match after the
      // call and can be consumed or stranded by whatever is already in flight. C-R10 leaves
      // a /me from /w/rooms unfinished, and the navigation below aborts it — so the cell
      // reported 「the shell never asked GET /me」 in light mode and passed in dark, on the
      // same tree, in the same run. A cell whose verdict depends on which mode ran first is
      // not a cell, and the founder's run is what said so.
      //
      // It listens for the whole navigation and reads the LAST /me it saw, then waits for
      // the network to go quiet before asking its questions — the same shape C-R16 uses,
      // which came back identical in both modes.
      // ── IT NAVIGATES THROUGH settle(), AND THE THIRD CUT IS WHY  [ZIP 3] ──
      //
      // This was the ONE navigation in the file that did not use the helper the rest of it
      // trusts: a bare goto with its error swallowed, followed by a wait on `.wl-main`.
      // `.wl-main` IS ALREADY ON SCREEN from the previous cell's surface. So if the goto
      // was aborted by C-R10's in-flight requests, the selector resolved against the OLD
      // document, no new /me was ever issued, and the cell reported 「never asked」 while
      // standing on /w/rooms — describing the shell as silent when it had simply not been
      // asked to load anything.
      //
      // ZIP 2's cure removed a race and exposed this one underneath it: the first cut's
      // `waitForResponse` had been catching the LEFTOVER /me from /w/rooms and reporting
      // that page's status, which is why dark 「passed」 and light did not on one tree in one
      // run. Two bugs stacked, and each had to be removed before the next was visible.
      //
      // settle() proves a new document mounted or reds the cell. And the observed path now
      // rides EVERY failure message, so a cell that saw nothing says where it was standing
      // rather than leaving the next reader to guess.
      let meStatus = null;
      const seenMe = [];
      const catchMe = (r) => {
        if (r.url().includes('/api/v2/vendor/me')) { meStatus = r.status(); seenMe.push(r.status()); }
      };
      p.on('response', catchMe);
      const up = await settle(p, '/w/today', '.wl-masthead', [CR15]);
      if (up) await p.waitForNetworkIdle({ idleTime: 700, timeout: 15000 }).catch(() => {});
      p.off('response', catchMe);
      const after = !up ? null : await p.evaluate(() => ({
        session: !!localStorage.getItem('vendor_session'),
        path: location.pathname,
      })).catch(() => null);
      if (up && !after) F(CR15, 'the page was gone before it could be read — a hard redirect is the only thing that does that');
      else if (up && meStatus === null)
        F(CR15, 'no GET /me was observed while ' + after.path + ' mounted, so this cell saw nothing and must not report a pass');
      else if (up && meStatus === 200 && after.session && after.path.startsWith('/w'))
        P(CR15, 'GET /me answered 200 (' + seenMe.length + ' seen); the session is intact and the shell is still mounted at ' + after.path);
      else if (up)
        F(CR15, 'GET /me answered ' + JSON.stringify(seenMe) + '; session=' + after.session + ' path=' + after.path +
                ' — the product signed the fixture out mid-measurement (F-38.8)');
    }

    // ── C-R17 · THE MASTHEAD DOES NOT CLAIM A READING IT DID NOT TAKE  [F-38.31] ──
    //
    // wl_audit can prove the SENTENCE is absent from the served bytes. It cannot prove the
    // NUMERAL is not on screen, because the t0 rule legitimately ships on this surface —
    // that is the rung's home, and it stays its home when Phase 4 turns the numeral on. So
    // the painted claim is this file's, exactly as the tuple set is.
    //
    // BOTH DIRECTIONS, because either alone passes on a defect: the not-reading line is
    // there AND the true-empty line is not AND nothing is painting at t0. A surface that
    // printed the honest sentence with a `0` still standing beside it would satisfy a cell
    // that only looked at words, and the `0` is the same claim in digits.
    const CR17 = tag + 'C-R17 the masthead claims no reading it did not take';
    if (await settle(p, '/w/today', '.wl-masthead', [CR17])) {
      const m = await p.evaluate(() => {
        const txt = (document.querySelector('.wl-masthead') || {}).textContent || '';
        const num = document.querySelector('.wl-mnum');
        // Anything painting at the t0 size, wherever it lives — the cell is about the
        // stature on screen, not about one class name.
        const t0 = [...document.querySelectorAll('.wl *')].filter((el) => {
          if (!el.textContent || !el.textContent.trim()) return false;
          if ([...el.children].some((c) => c.textContent && c.textContent.trim())) return false;
          return Math.abs(parseFloat(getComputedStyle(el).fontSize) - 46) < 0.6;
        }).length;
        return { txt: txt.trim(), numeral: !!num, t0 };
      });
      const notLive = /isn't reading your work yet/.test(m.txt);
      const trueEmpty = /Nothing needs you yet/.test(m.txt);
      if (notLive && !trueEmpty && !m.numeral && m.t0 === 0)
        P(CR17, 'the not-reading line stands alone; no numeral and nothing painting at t0');
      else F(CR17, JSON.stringify({ notLive, trueEmpty, numeral: m.numeral, t0: m.t0 }) +
                   ' — the masthead is asserting a reading nothing took (F-38.31)');
    }

    // ── C-R18 · THE ADD CONTROL SITS WHERE IT WAS RULED  [R-38.18, item 4] ──
    //
    // THE OFFSET IS ARITHMETIC IN A STYLESHEET AND ARITHMETIC IS NOT EVIDENCE. The FAB's
    // bottom is a calc over two chrome heights it does not own; if the dock gains a row or
    // the nav's safe-area resolves differently the rule stays true and the control lands on
    // top of the dock. This measures the painted gap, which is the only version of the
    // ruling a vendor experiences.
    //
    // It also asserts the control is NOT on Today — R-38.18's scope, on glass rather than
    // in an import graph. A mount is easy to add in a hurry and hard to notice.
    const CR18 = tag + 'C-R18 the Add control clears the dock and lives only on Rooms';
    if (await settle(p, '/w/rooms', '.wl-fab', [CR18])) {
      const geo = await p.evaluate(() => {
        const fab = document.querySelector('.wl-fab');
        const dock = document.querySelector('.wl-dock');
        if (!fab || !dock) return null;
        const f = fab.getBoundingClientRect(), d = dock.getBoundingClientRect();
        const cs = getComputedStyle(fab);
        return {
          w: Math.round(f.width), h: Math.round(f.height),
          gap: Math.round(d.top - f.bottom),
          rightInset: Math.round(window.innerWidth - f.right),
          gutter: Math.round(parseFloat(getComputedStyle(document.querySelector('.wl'))
            .getPropertyValue('--wl-gutter')) || 0),
          bg: cs.backgroundColor,
          accent: getComputedStyle(document.querySelector('.wl')).getPropertyValue('--atelier-accent-text').trim(),
          label: (fab.textContent || '').trim(),
        };
      });
      if (!geo) F(CR18, 'no FAB or no dock on Rooms');
      else {
        const sized = geo.w === 56 && geo.h === 56;
        // 16px above the dock, and never overlapping it. A negative gap is the control
        // sitting on the thing it was ruled to sit above.
        const seated = geo.gap >= 15 && geo.gap <= 17 && geo.rightInset === geo.gutter;
        const plus = geo.label === '+';
        if (sized && seated && plus) {
          const onToday = await settle(p, '/w/today', '.wl-masthead')
            ? await p.evaluate(() => !!document.querySelector('.wl-fab')) : null;
          if (onToday === true) F(CR18, 'the Add control also paints on Today — R-38.18 scopes it to Rooms');
          else if (onToday === null) F(CR18, 'Today never mounted, so the scope half of this cell was not measured');
          else P(CR18, '56px, ' + geo.gap + 'px above the dock, ' + geo.rightInset + 'px in on the accent ' + geo.bg + '; absent on Today');
        } else {
          F(CR18, JSON.stringify(geo) + ' — expected 56x56, a 16px gap over the dock, right inset at the gutter, and a plus');
        }
      }
    }

    // ── C-R16 · ONE GET /me PER SESSION  [F-38.26, item 2] ──────────────────
    //
    // THE CELL IS A NETWORK OBSERVATION AND IT COULD NOT HAVE BEEN ANYTHING ELSE. Three
    // call sites want the vendor's identity; a source-reading bench can count the sites but
    // not the REQUESTS, and the requests are what the vendor waits for. WorklistShell
    // remounts on every route change, so the number the founder pays is a function of how
    // he walks, not of how many `getJson` lines exist. Only the wire knows.
    //
    // IT LISTENS BEFORE IT NAVIGATES (D-38.1). A listener attached after the shell has
    // mounted misses the first read — the one the layout makes — and would report two where
    // the vendor paid three. Observation starts before the moment the defect is visible.
    //
    // THE WALK IS IN-APP, AND THAT IS LOAD-BEARING. The memo lives in module scope, so a
    // p.goto between rooms would reset it and the cell would green on a broken tree by
    // measuring three separate sessions. Rooms -> Leads -> Rooms is walked the way the
    // vendor walks it: a tile, then the nav seat, both anchors, both client navigation.
    const CR16 = tag + 'C-R16 one GET /me per session across Rooms -> Leads -> Rooms';
    if (!WIRE.ok) {
      F(CR16, 'SYNTHETIC fixture — /me 401s and the walk is broken by the sign-out it causes; source tools/wl_mint_token.sh');
    } else {
      let meSeen = 0;
      const countMe = (r) => { if (r.url().includes('/api/v2/vendor/me')) meSeen++; };
      p.on('response', countMe);
      let walked = false;
      try {
        await p.goto(BASE + '/w/rooms', { waitUntil: 'domcontentloaded' });
        await p.waitForSelector('.wl-tile[data-room="leads"]', { timeout: 15000 });
        await p.click('.wl-tile[data-room="leads"]');
        // The leads room, not merely a route change: the shell's masthead label is what
        // says the new tree actually mounted.
        await p.waitForFunction(() => location.pathname === '/w/leads', { timeout: 15000 });
        await p.waitForSelector('.wl-coin', { timeout: 15000 });
        await p.click('.wl-nav .wl-seat');
        await p.waitForFunction(() => location.pathname === '/w/rooms', { timeout: 15000 });
        await p.waitForSelector('.wl-tile', { timeout: 15000 });
        // A LATE READ IS STILL A READ. Counting the instant the last click settles would
        // miss a fetch that has been issued and not answered, which is precisely the shape
        // this cure removes. Quiet, then count.
        await p.waitForNetworkIdle({ idleTime: 700, timeout: 10000 }).catch(() => {});
        walked = true;
      } catch (e) {
        F(CR16, 'the walk did not complete: ' + String(e.message).split('\n')[0]);
      }
      p.off('response', countMe);
      if (walked) {
        if (meSeen === 1) P(CR16, 'one wire read for three surfaces');
        else if (meSeen === 0) F(CR16, 'no GET /me was observed at all — this cell saw nothing and must not report a pass');
        else F(CR16, meSeen + ' GET /me across one walk — the identity read has more than one site (F-38.26)');
      }
    }

    // ── C-R9 · THE COIN IS TAPPABLE WHERE LEADS NOW LIVES  [F-38.13, item 1(b)] ─
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
    // ── IT MOVES TO /w/leads, AND THE MOVE IS THE POINT ─────────────────────
    // It ran on /vendor/list/leads because that is where the founder met the defect. Leads
    // CROSSED at S2 §4-1: the room the vendor actually opens from the tile is /w/leads now,
    // and it is the shell's own coin and the shell's own drawer there. A cell that went on
    // hit-testing only the fallback would have kept saying yes about a surface the vendor
    // had stopped visiting — the same shape as the AddSheet literal that would have gone on
    // passing after calendar crossed. The subject follows the room.
    const LEADS_ROOM = '/w/leads';
    const CR9 = tag + 'C-R9 the coin is tappable in the crossed leads room';
    if (await settle(p, LEADS_ROOM, '.wl-coin', [CR9])) {
      const rest = await p.evaluate(() => {
        const coin = document.querySelector('.wl-coin');
        if (!coin) return { found: false };
        const r = coin.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return {
          found: true,
          scrimAtRest: !!document.querySelector('.wl-drawerscrim'),
          // The hit-test. `coin.contains(hit)` covers any glyph node inside the button.
          coinReceivesTap: !!hit && (hit === coin || coin.contains(hit)),
          covering: hit ? (hit.getAttribute('aria-label') || hit.className || hit.tagName.toLowerCase()) : null,
        };
      });
      if (!rest.found) F(CR9, 'no shell coin on ' + LEADS_ROOM);
      else if (rest.scrimAtRest) F(CR9, 'F-38.13: the scrim is in the document AT REST');
      else if (!rest.coinReceivesTap) F(CR9, 'the coin does not receive its own tap — covered by: ' + rest.covering);
      else {
        await p.click('.wl-coin');
        await new Promise((r) => setTimeout(r, 450));
        const open = await p.evaluate(() => ({
          scrimOpen: !!document.querySelector('.wl-drawerscrim'),
          // The drawer answered: its own rows are reachable, which is what a flipped
          // coinOpen actually buys the vendor.
          rowsReachable: [...document.querySelectorAll('.tdw-drawer button, .tdw-drawer a')]
            .some((el) => /Sign out/i.test(el.textContent || '')),
        }));
        if (open.scrimOpen && open.rowsReachable)
          P(CR9, 'no scrim at rest, coin wins its own hit-test, drawer opens with its scrim');
        else F(CR9, 'the tap landed but the drawer did not open: ' + JSON.stringify(open));
      }
    }

    // ── C-R9b · AND THE FALLBACK IS STILL COVERED, UNTIL PHASE 7 ────────────
    //
    // /vendor/list/leads did not stop existing when leads crossed; it is the surviving
    // fallback, it still mounts Header and its medallion, and F-38.13 lived in exactly that
    // chrome. Dropping the assertion with the move would have retired a cell by relocating
    // it — coverage lost in a step that looked like coverage kept, which is the shape S2's
    // ZIP bounce convicted twice (the SliceDoor re-point, the tier gate).
    //
    // ⚠ THIS CELL RETIRES AT PHASE 7, WITH app/vendor/layout.tsx AND ITS Header, and not
    // before. That is written here rather than in a handover because the seat that deletes
    // the layout will be reading this file to find out what depended on it, and a
    // retirement date that lives only in prose is a retirement nobody performs.
    const CARRIED = '/vendor/list/leads';
    const CR9B = tag + 'C-R9b the coin is tappable in the carried fallback (retires at Phase 7)';
    if (await settle(p, CARRIED, 'header', [CR9B])) {
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
          coinReceivesTap: !!hit && (hit === coin || coin.contains(hit)),
          covering: hit ? (hit.getAttribute('aria-label') || hit.tagName.toLowerCase()) : null,
        };
      });
      if (!rest.found) F(CR9B, 'no profile coin on ' + CARRIED);
      else if (rest.scrimAtRest) F(CR9B, 'F-38.13: the scrim is in the document AT REST');
      else if (!rest.coinReceivesTap) F(CR9B, 'the coin does not receive its own tap — covered by: ' + rest.covering);
      else {
        await p.click('[data-tour="profile-coin"]');
        await new Promise((r) => setTimeout(r, 450));
        const open = await p.evaluate(() => ({
          scrimOpen: !!document.querySelector('button[aria-label="Close menu"]'),
          rowsReachable: [...document.querySelectorAll('button, a')]
            .some((el) => /Sign Out|Sign out/.test(el.textContent || '')),
        }));
        if (open.scrimOpen && open.rowsReachable)
          P(CR9B, 'no scrim at rest, coin wins its own hit-test, drawer opens with its scrim');
        else F(CR9B, 'the tap landed but the drawer did not open: ' + JSON.stringify(open));
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
    if (!await settle(p, '/w/rooms', '.wl-dockfield',
                      [tag + 'C-R4 chat input in branch tokens',
                       tag + 'C-R5 chat opens at work-surface height'])) {
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
      // M-FINISH S2 §4-1. The six crossed rooms are captured AT REST, and `/vendor/list/leads`
      // is kept beside `/w/leads` on purpose: they are the same body in two shells now, so
      // the pair is the evidence of what the crossing actually did. The remaining /vendor
      // frame is a room that has NOT crossed, kept so the founder judges the seam rather
      // than only the cured half.
      // ── THE SET IS DERIVED FROM THE REGISTRY  [§4-2] ────────────────────
      // It was thirteen hand-typed pairs, correct until a room crossed. Calendar crossed
      // and would have been the one surface the founder never saw a frame of — the newest
      // one, which is the only one worth looking at. Every later crossing joins these
      // frames in the edit that changes its href.
      const shellFrames = [...new Set([...
        (fs.readFileSync('lib/worklist/rooms.ts', 'utf8').matchAll(/id:\s*'([a-z]+)'[^}]*href:\s*'\/w\/([a-z]+)'/g))]
        .map((m) => ['w-' + m[2], '/w/' + m[2]]).map((p) => p.join('\u0000')))]
        .map((k) => k.split('\u0000'));
      for (const [name, path] of [['w-rooms', '/w/rooms'], ['w-today', '/w/today'],
        ...shellFrames,
        // The seam the founder is being asked to judge: a crossed room beside its own
        // fallback, and a room that has NOT crossed. Both kept on purpose.
        ['fallback-leads', '/vendor/list/leads'], ['room-collab', '/vendor/collab']]) {
        // A FRAME OF A HALF-MOUNTED PAGE IS EVIDENCE OF NOTHING and would be handed to the
        // founder looking like a broken surface. The capture waits on the shell too, and a
        // surface that never mounts is named in the log rather than photographed.
        if (!await settle(p, path, null)) { console.log('  capture skipped, never mounted: ' + path); continue; }
        await shot(name);
      }
      if (await settle(p, '/w/rooms', '.wl-coin')) {
        await p.click('.wl-coin'); await new Promise((r) => setTimeout(r, 400));
        await shot('tapped-drawer-on-rooms');
      }
      // §5 asks for the drawer open on BILLING as well as on Rooms: the drawer anchors to
      // the header, and a header on a surface with different content beneath it is where a
      // stacking or clipping fault would show. F-16.37 was exactly that fault.
      if (await settle(p, '/w/billing', '.wl-coin')) {
        await p.click('.wl-coin'); await new Promise((r) => setTimeout(r, 400));
        await shot('tapped-drawer-on-billing');
      }
      // The tapped tile: the :active state R-38.2 requires within 16ms of touch.
      if (await settle(p, '/w/rooms', '.wl-tile')) {
        await p.evaluate(() => {
          const t = document.querySelector('.wl-tile');
          if (t) t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        });
        await new Promise((r) => setTimeout(r, 120));
        await shot('tapped-tile');
      }
      if (await settle(p, '/w/rooms', '.wl-dockfield')) {
        await p.click('.wl-dockfield'); await new Promise((r) => setTimeout(r, 800));
        await shot('tapped-chat');
      }
      // F-38.13's evidence: a CARRIED room at rest and with its drawer open. The founder
      // found this defect on exactly these surfaces and the frame set had none of them
      // open — every drawer frame was a shell surface, where no Header renders and the
      // defect could not appear.
      if (await settle(p, CARRIED, 'header')) {
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
    // ── THE RULED COUNT IS DERIVED, AND THE LITERAL IT REPLACES WAS ALREADY STALE ──
    // It read 「28 frames were ruled」 — a number from a capture set two sittings old, still
    // printing itself as the ruling while the set had grown past it. It could only ever
    // under-report, so it never fired and nobody noticed, which is exactly how a floor
    // stops being one. Rooms and Today, every /w room the registry declares, the two
    // /vendor seam frames, and six tapped states — twice, once per mode.
    const RULED = (2 + [...new Set([...(fs.readFileSync('lib/worklist/rooms.ts', 'utf8')
      .matchAll(/id:\s*'([a-z]+)'[^}]*href:\s*'\/w\/([a-z]+)'/g))].map((m) => m[2]))].length + 2 + 6) * 2;
    if (n < RULED) console.log('  \u26a0 EVIDENCE INCOMPLETE — ' + RULED + ' frames were ruled, ' + n + ' were written. The cells above stand; the walk card does not go to the founder on a short set.');
  }
  console.log(fail === 0 ? 'RENDER ARM GREEN.' : 'RENDER ARM RED — the ZIP bounces.');
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('render arm threw: ' + e.message); process.exit(3); });
