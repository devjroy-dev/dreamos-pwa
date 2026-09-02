#!/usr/bin/env node
// scripts/b50_fetch_loop_bench.js — F-39.46 · ONE MOUNT, ONE FETCH PER DOOR.
//
// ── WHY THIS IS A BROWSER AND NOT A READER ──────────────────────────────────
// THE WALK SAW ~900 REQUESTS on the invoices page, hundreds of them 304s against
// one vendor UUID. Reading `hooks/vendor/useVendorData.ts` names a MECHANISM —
// `useLoader`'s `run` is a `useCallback` over `[vendorId, key, fetcher, extract]`
// and every public hook passes INLINE ARROWS for `fetcher` and `extract`, so
// `run` re-identifies on every render and both effects below it, keyed
// `[run, kind]`, re-fire on every render. One of them issues `fetcher(vendorId)`
// BEFORE its own `tick` abort check, so a fetch leaves the tab before the run
// that supersedes it can cancel it.
//
// ⚠ BUT READING CANNOT SETTLE THE VOLUME, and the seat said so before writing a
// byte. Whether that mechanism terminates after one extra fetch or runs away
// depends on React's `Object.is` bailout: when `setData(existing.data)` is
// handed the SAME reference, does the component re-render anyway and re-fire the
// effect, and does that settle? That is a question about React's scheduler, not
// about this estate's source, and no amount of staring at the hook answers it.
// A hand-rolled scheduler would answer a question about the hand-rolled
// scheduler — which is F-39.25's disease, an instrument reporting on itself.
//
// So: a real Chromium, the real Next build, the real React, and every request
// COUNTED at the network layer where the walk counted them. The walk law holds
// here too — the rendered surface outranks any instrument reporting on it.
//
// ── WHAT IT ASSERTS ─────────────────────────────────────────────────────────
// One mount of /w/invoices issues AT MOST ONE request per door. Not "few". One.
// A door fetched twice on a single mount is the defect at small amplitude, and
// the threshold that admits two admits nine hundred on a slower network.
//
// ── HOW IT STAYS HONEST ─────────────────────────────────────────────────────
// Every request is INTERCEPTED and answered from a fixture, so this bench never
// touches Railway, never needs a key, and cannot be made green or red by the
// state of a live database. The fixture is the same shape the doors return; the
// point of measurement is the COUNT, not the payload.
//
// ── MUTATION LEDGER · WHAT THE RUNS OUTPUT  [founder's Codespace, 2026-09-03] ─
// Recorded because a bench that only ever prints GREEN is vacuous, and this one
// printed GREEN four times before it was ever shown capable of printing RED.
//
//   BASELINE, port verified free
//     /api/v2/vendor/me 1 · money/invoices/:id 1 · cabinet/:id 1 · leads/:id 1
//     4 doors · 4 requests · GREEN · exit 0
//
//   MUTATED  `useEffect(() => { run(consumeDirty(kind)); run(true); }, ...)`
//     money/invoices/:id 2 · cabinet/:id 2 · leads/:id 2 · me 1
//     4 doors · 7 requests · RED · exit 1
//
// ⚠ THE SPECIFICITY IS THE PROOF, NOT THE COUNT. `/vendor/me` does not go through
// `useLoader` and did NOT move. The three doors that do, doubled. A bench that
// merely counted traffic would have shown four doors rising.
//
// ── AND THE READING THIS LEDGER CORRECTS ────────────────────────────────────
// Before the port guard existed, this same mutation produced ZERO requests, and
// that zero was read — by me — as a runaway loop tearing the tree down before it
// could mount. It was nothing of the kind. It was a stale `next-server` from an
// earlier run, serving an older build, 500ing on chunks the rebuild had replaced.
// The mutation renders fine and fetches seven times.
//
// FOUR INSTRUMENT DEFECTS PRECEDED THE FIRST TRUSTWORTHY NUMBER HERE, every one
// found by RUNNING this file and none by reading it: a `.next` guard a failed
// build satisfied; a zero-traffic arm that named the wrong cause with confidence;
// an unchecked port; and killing `npx` while its grandchild `next-server` held the
// socket. Each produced a table, a verdict and an exit code that described the
// harness rather than the tree.
//
// ⚠ WHAT IS *NOT* ESTABLISHED, stated here so no later reader mistakes this
// bench's GREEN for F-39.46 answered: the fixtures below return EMPTY arrays. With
// no rows, the row-level effects in `SliceShell` never mount, and the walk's
// hundreds of 304s are browser revalidation this file's interception bypasses
// entirely. What is proven is narrow and real — A BARE MOUNT WITH AN EMPTY DATASET
// OPENS FOUR DOORS ONCE EACH. The walk's ~900 lived in populated data with taps
// and navigation. Widening the fixtures is the next step; a cure is not.


const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.B50_PORT || 3947;
// The route under test. Both `/w/invoices` (where the walk counted) and
// `/w/today` (where `useTodayFeed` actually mounts) are worth asking, and the
// focus arm lives in the shell that wraps BOTH.
const ROUTE = process.env.B50_ROUTE || '/w/invoices';
// N returns to the tab. 20 is enough that an unthrottled refetch is unmistakable
// and small enough that a threshold-based cure still reads as 1.
const FOCUS_EVENTS = Number(process.env.B50_FOCUS_EVENTS || 20);

// ── THE STANDING TEST ACCOUNT ───────────────────────────────────────────────
// DEV440 / Dev Roy Photography, the account every walk in this band is authored
// against. The UUID is a fixture here and reaches no database.
const VENDOR = {
  id: '11111111-2222-4333-8444-555555dev440',
  user_id: 'b50-fixture-user',
  name: 'Dev Roy Photography',
  phone: '9888294440',
  tier: 'signature',
  access_token: 'b50-fixture-token',
  refresh_token: 'b50-fixture-refresh',
  // ⚠ `_v` IS LOAD-BEARING AND ITS ABSENCE IS SILENT. `isStaleSession` in
  // `lib/vendor/session.ts` evicts any session with `!s._v || s._v <
  // SESSION_VERSION`, and SESSION_VERSION is 2. A seed without it is deleted on
  // the first read, the route redirects to '/', and the bench measures an empty
  // page. It would REFUSE rather than pass — the zero-traffic arm below exists
  // for exactly this — but it would refuse for a reason that looks like the
  // harness is broken. Derived from the source, not assumed.
  _v: 2,
};
// The same file evicts two SENTINELS outright: id `00000000-0000-0000-0000-
// 000000000000` and access_token `mock-access-token`. The fixture above avoids
// both deliberately; do not "tidy" it toward round zeroes.

function refuse(why) {
  console.log(`REFUSED — ${why}`);
  console.log('This is NOT a pass and NOT a fail: the harness could not be stood up.');
  process.exit(3);
}

// ── THE DOORS THIS PAGE IS ENTITLED TO OPEN ─────────────────────────────────
// Keyed by the PATH SHAPE rather than the full URL, because the vendor UUID and
// any query string are noise for a count. A door not in this table is not an
// error — it is counted under its own name and reported, so a page that starts
// fetching something new is VISIBLE rather than silently tolerated.
function doorOf(url) {
  const u = new URL(url);
  return u.pathname
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/[0-9a-f-]{20,}/gi, '/:id');
}

const FIXTURES = {
  invoices: { ok: true, invoices: [] },
  leads:    { ok: true, leads: [] },
  expenses: { ok: true, expenses: [] },
};

function fixtureFor(door) {
  if (door.includes('/invoices')) return FIXTURES.invoices;
  if (door.includes('/leads'))    return FIXTURES.leads;
  if (door.includes('/expenses')) return FIXTURES.expenses;
  return { ok: true };
}

/**
 * Is `port` free RIGHT NOW? Bound and released, never assumed.
 *
 * ⚠ THIS EXISTS BECAUSE ITS ABSENCE INVALIDATED EVERY EARLIER RUN OF THIS BENCH.
 * b50 kills its server with SIGKILL and does not wait for the socket to close. If
 * a previous run's `next start` still holds the port, the new spawn fails to bind
 * — and `waitForServer` then polls that port, gets an answer from the STRANGER,
 * and measures it. That old process was started from an older build; the rebuild
 * replaced its chunk files underneath it, so the page it serves 500s on a chunk
 * and never boots. Witnessed as `ChunkLoadError: Loading chunk 2703 failed`
 * alongside a 500, in a run whose console was only visible because the previous
 * fix taught this bench to read it.
 *
 * The cost of not checking is not a crash — it is a CONFIDENT NUMBER measured
 * against the wrong build. That is the worst thing an instrument can do, and it
 * is why this refuses rather than picking another port silently.
 */
function portFree(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const s = net.createServer();
    s.once('error', () => resolve(false));
    s.once('listening', () => s.close(() => resolve(true)));
    s.listen(port, '127.0.0.1');
  });
}

function waitForServer(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    (function poll() {
      const req = http.get({ host: '127.0.0.1', port, path: '/' }, (res) => {
        res.resume(); resolve(true);
      });
      req.on('error', () => {
        if (Date.now() > deadline) return reject(new Error('server did not come up'));
        setTimeout(poll, 400);
      });
    })();
  });
}

(async () => {
  // ⚠ `BUILD_ID`, NOT `.next`. A FAILED build still leaves `.next` on disk, so a
  // directory-existence guard passes and the bench then refuses three steps later
  // with 「server did not come up」 — a true refusal pointing at the wrong cause.
  // Found by running this harness rather than by reading it. `BUILD_ID` is
  // written only when the build completes.
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    refuse('.next/BUILD_ID is absent — there is no COMPLETED production build here. '
         + 'Run `npm run build` first. (A `.next` directory alone proves nothing: a '
         + 'failed build leaves one behind.) A dev-server measurement is not a '
         + 'substitute — StrictMode double-invokes effects on purpose, so this bench '
         + 'would read 2 on a cured tree.');
  }
  for (const m of ['puppeteer-core', '@sparticuz/chromium']) {
    if (!fs.existsSync(path.join(ROOT, 'node_modules', m))) {
      refuse(`devDependency ${m} is not installed — run \`npm ci\` [F-39.48]`);
    }
  }

  const chromium  = require('@sparticuz/chromium').default;
  const puppeteer = require('puppeteer-core');

  if (!(await portFree(PORT))) {
    refuse(`port ${PORT} is already in use, so this bench cannot know whether it `
         + `would be measuring ITS OWN server or a leftover one from an earlier run. `
         + `A stale server serves an older build and 500s on chunks the rebuild `
         + `replaced — a zero that looks like a finding. Free it, or re-run with a `
         + `different port:  B50_PORT=4123 node scripts/b50_fetch_loop_bench.js`);
  }

  // ⚠ `detached` SO THE WHOLE GROUP CAN BE KILLED. `npx` is the child; it spawns
  // `next`, which becomes `next-server`, and THAT is what holds the port.
  // `server.kill()` signals npx only — the grandchild is orphaned and keeps
  // listening, so the NEXT run finds the port occupied and refuses. Witnessed as
  // an orphan at `pid=8801` after a run that appeared to exit cleanly.
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: ROOT, stdio: 'ignore', detached: true,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  let browser;
  const pageErrors = [];

  // THE GROUP IS SIGNALLED (negative pid), AND THE PORT IS WATCHED RATHER THAN
  // ASSUMED. A fixed sleep is a guess about someone else's shutdown; polling the
  // socket is the fact. Only after it frees — or after the patience runs out — does
  // this process exit, so one run can never poison the next.
  const reap = async () => {
    for (const sig of ['SIGTERM', 'SIGKILL']) {
      try { process.kill(-server.pid, sig); } catch {}
      for (let i = 0; i < 20; i++) {
        if (await portFree(PORT)) return true;
        await new Promise((r) => setTimeout(r, 250));
      }
    }
    return await portFree(PORT);
  };
  const done = async (code) => {
    const freed = await reap();
    if (!freed) {
      console.log(`\n⚠ PORT ${PORT} DID NOT COME FREE. A server survived this run and the`);
      console.log(`  next one will refuse. Clear it with:  pkill -f next-server`);
    }
    process.exit(code);
  };

  try {
    await waitForServer(PORT, 90000);
  } catch (e) {
    try { process.kill(-server.pid, 'SIGKILL'); } catch {}
    refuse(`next start did not answer on :${PORT} — ${e.message}`);
  }

  const counts = new Map();
  const focusDelta = new Map();
  try {
    browser = await puppeteer.launch({
      args: chromium.args, executablePath: await chromium.executablePath(), headless: true,
    });
    const page = await browser.newPage();

    // ── ⚠ WHY THE PAGE'S OWN FAILURES ARE CAPTURED  [found by running it] ────
    // The first mutation planted against this bench (`Date.now()` in the effect's
    // deps) produced ZERO requests, not extra ones: the runaway effect tripped
    // React's update-depth guard and tore the tree down before the invoices
    // subtree mounted. b50 reported 「most likely the seeded session was rejected」
    // — a confident guess at the WRONG cause, which is the defect class this
    // sitting has now filed three times.
    //
    // A page that DIED and a page that REDIRECTED both issue no API traffic. Only
    // the console tells them apart, so the console is read.
    page.on('pageerror', (e) => pageErrors.push(String(e && e.message || e).split('\n')[0]));
    page.on('console', (m) => {
      if (m.type() === 'error') pageErrors.push(m.text().split('\n')[0]);
    });

    // Seed the session BEFORE the app boots. `useVendorSession` reads
    // localStorage in a mount effect; without this the page redirects to '/'
    // and the harness would measure an empty route and call it one fetch.
    await page.evaluateOnNewDocument((v) => {
      localStorage.setItem('vendor_session', JSON.stringify(v));
    }, VENDOR);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      // Only API traffic is counted. Chunks, fonts and images are the framework's
      // business; counting them would drown the signal this bench exists for.
      if (/\/api\/v\d+\//.test(url)) {
        // ── ⚠ CORS IS NOT OPTIONAL HERE, AND ITS ABSENCE IS SILENT ───────────
        // `API_BASE` in `lib/vendor/api/_base.ts` defaults to the Railway host,
        // so every one of these is CROSS-ORIGIN from 127.0.0.1. The browser
        // enforces CORS on an intercepted response exactly as on a real one: with
        // no `Access-Control-Allow-Origin`, every read REJECTS. The page would
        // then be measured in its error path — retries and error states — and the
        // number reported would be a count of failures, not of the loop. A bench
        // measuring the wrong thing while printing a confident table is worse
        // than one that refuses.
        //
        // And because `getJson` attaches `Authorization: Bearer ...`, these are
        // NOT simple requests — the browser sends an OPTIONS preflight first.
        // That preflight is answered below and is NOT counted: it is the
        // browser's traffic, not the app's, and counting it would double every
        // door and manufacture a loop that is not there.
        const cors = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
        };
        if (req.method() === 'OPTIONS') {
          return req.respond({ status: 204, headers: cors });
        }
        const d = doorOf(url);
        counts.set(d, (counts.get(d) || 0) + 1);
        return req.respond({
          status: 200,
          contentType: 'application/json',
          headers: cors,
          body: JSON.stringify(fixtureFor(d)),
        });
      }
      req.continue();
    });

    await page.goto(`http://127.0.0.1:${PORT}${ROUTE}`, {
      waitUntil: 'networkidle0', timeout: 60000,
    });
    // A settled loop still ticks. `networkidle0` returns at the first quiet
    // moment; a runaway effect can resume after it, so the page is held open and
    // measured again rather than trusted at its first silence.
    await new Promise((r) => setTimeout(r, 4000));

    // ── THE FOCUS SCENARIO  [F-39.26's focus arm] ────────────────────────────
    // THE MOUNT IS CLOSED: one mount, one fetch per door, measured. This asks the
    // question the mount could not — does COMING BACK to the tab refetch?
    //
    // `components/worklist/WorklistShell.tsx` (symbol: the focus effect) listens
    // on BOTH `window.focus` and `document.visibilitychange` and calls
    // `refreshToday()` on each, with NO throttle and no timestamp. If that path
    // refetches, N returns cost N readings, and a vendor answering WhatsApp all
    // afternoon is the walk's ~900.
    //
    // ⚠ DERIVED PREDICTION, WRITTEN BEFORE THE RUN SO IT CAN BE WRONG:
    // `refreshToday()` only nulls a module-scope promise (`lib/worklist/feed.ts`,
    // symbol: `refreshToday`), and the sole reader `useTodayFeed` fetches in a
    // MOUNT-ONLY effect (`[]`). Dropping a memo nobody re-reads should issue no
    // request at all. If that holds, the focus arm is not the driver and the ~900
    // is a preserved-log artefact. If it does NOT hold, the arm fires unthrottled
    // and the counts below will climb by roughly N.
    //
    // BOTH EVENTS, because a real tab-return fires both — counting only one would
    // halve a real finding.
    const before = new Map(counts);
    for (let i = 0; i < FOCUS_EVENTS; i++) {
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('focus'));
      });
      await new Promise((r) => setTimeout(r, 60));
    }
    await new Promise((r) => setTimeout(r, 3000));
    for (const [d, n] of counts) focusDelta.set(d, n - (before.get(d) || 0));
  } catch (e) {
    try { if (browser) await browser.close(); } catch {}
    try { process.kill(-server.pid, 'SIGKILL'); } catch {}
    console.log(`BENCH ERROR — ${e.message}`);
    process.exit(2); // an unexpected throw is an ERROR, never a refusal [F-39.55]
  }
  try { await browser.close(); } catch {}

  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\n  route ${ROUTE} · ${FOCUS_EVENTS} focus/visibility returns`);
  console.log('\n  door                                            mount  +focus');
  console.log('  ' + '─'.repeat(64));
  for (const [door, n] of rows) {
    const f = focusDelta.get(door) || 0;
    console.log(`  ${door.padEnd(44)} ${String(n - f).padStart(6)}  ${String(f).padStart(6)}`);
  }
  if (!rows.length) console.log('  (no API traffic observed)');

  const over = rows.filter(([d, n]) => (n - (focusDelta.get(d) || 0)) > 1);
  const leaks = [...focusDelta.entries()].filter(([, f]) => f > 0);
  const total = rows.reduce((a, [, n]) => a + n, 0);
  console.log(`\n  ${rows.length} door(s) · ${total} request(s) total`);

  if (!rows.length) {
    // TWO CAUSES, TOLD APART BY THE CONSOLE RATHER THAN BY A GUESS.
    if (pageErrors.length) {
      const depth = pageErrors.some((e) => /Maximum update depth|Too many re-renders/i.test(e));
      console.log('\nRED — the page issued NO API traffic because it THREW [F-39.46]:');
      for (const e of [...new Set(pageErrors)].slice(0, 6)) console.log(`   · ${e}`);
      if (depth) {
        console.log('\n   「Maximum update depth」 IS THE LOOP, at an amplitude that kills the');
        console.log('   tree instead of flooding the network. Zero requests here is the most');
        console.log('   severe reading of this bench, not the mildest.');
      }
      return done(1);
    }
    console.log('\nREFUSED — the page issued no API traffic and threw nothing. The seeded');
    console.log('session was most likely rejected and the route redirected. A zero read');
    console.log('as a pass is the hollow green this estate refuses.');
    return done(3);
  }
  if (over.length) {
    console.log('\nRED — a door was fetched more than once on a single MOUNT [F-39.46]:');
    for (const [d, n] of over) console.log(`   · ${d} — ${n - (focusDelta.get(d) || 0)}×`);
    return done(1);
  }
  if (leaks.length) {
    // A CLEAN MOUNT WITH A LEAKING FOCUS ARM IS STILL A RED, and it is the shape
    // that matches the walk: nobody remounts 900 times, but a vendor answering
    // WhatsApp returns to the tab all afternoon.
    console.log(`\nRED — the focus arm refetched across ${FOCUS_EVENTS} returns [F-39.26 focus arm]:`);
    for (const [d, f] of leaks) console.log(`   · ${d} — ${f} extra request(s)`);
    console.log('\n   `WorklistShell` (symbol: the focus effect) listens on window.focus AND');
    console.log('   document.visibilitychange and calls refreshToday() on each, with no');
    console.log('   threshold. N returns cost N readings.');
    return done(1);
  }
  console.log('\nGREEN — one mount, one fetch per door, and focus adds none');
  return done(0);
  // MUTATION: restore the unstable identity at the cure site (see the handover)
  // and re-run — the door counts climb and this reds. Both-ways in the ledger.
})();
