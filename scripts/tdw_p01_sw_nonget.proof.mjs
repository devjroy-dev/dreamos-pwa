// scripts/tdw_p01_sw_nonget.proof.mjs
//
// ── TDW P0-1 · R-36.7 — THE SERVICE WORKER NEVER INTERCEPTS A NON-GET ────────
//
// THE INCIDENT THIS BENCH GUARDS (founder-witnessed 2026-08-23): iOS/iPad
// vendors could not upload portfolio photos. The direct Cloudinary POST matched
// the image branch of sw.js by HOSTNAME, and that branch is a GET machine —
// `cache.put()` rejects on POST — so the upload died inside `respondWith` and
// the vendor read B3. macOS sailed through the same session.
//
// WHAT IS DRIVEN: the REAL `public/sw.js`, loaded byte-for-byte into a vm
// sandbox that stands in for the worker global scope. A bench that
// re-implemented the classifier would prove its own copy and nothing else
// (occupancy.js's ratified precedent). The captured 'fetch' handler is then
// fired with synthetic events and the verdict is read off which doors opened:
// `respondWith` fired = intercepted; silent return = the browser handles it
// natively, which is the cure.
//
// CELLS (each named, each independently red-able):
//   1. POST to cloudinary        → respondWith NEVER fires (the cure itself)
//   2. GET image on cloudinary   → respondWith fires AND cache.put receives it
//                                  (the image-cache leg the cure must not cost)
//   3. GET navigate              → respondWith fires (network-first page leg alive)
//   4. the image cache opens under a name that is NOT 'tdw-images-v5'
//                                  (behavioural read of the version bump: an
//                                  activated v6 worker must not adopt v5's cache)
//
// BOTH-WAYS, recorded at delivery: at the uncured tip (ce86164's sw.js) cell 1
// reds — the POST falls into the image branch and respondWith fires. At the
// cured tree all four green. Mutation on PRODUCTION code (guard flipped to
// `=== 'GET'`) reds cells 2 and 3 — the bench is not vacuous.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'public/sw.js'), 'utf8');

let passed = 0, failed = 0;
const cell = (name, ok) => {
  if (ok) { passed++; console.log(`  PASS  ${name}`); }
  else    { failed++; console.log(`  FAIL  ${name}`); }
};

// ── The worker-global stand-in ───────────────────────────────────────────────
function loadWorker() {
  const listeners = {};
  const openedCaches = [];
  const puts = [];
  const fakeCache = {
    match: () => Promise.resolve(undefined),
    put: (req, res) => { puts.push({ url: req.url, method: req.method }); return Promise.resolve(); },
  };
  const sandbox = {
    self: {
      addEventListener: (type, fn) => { listeners[type] = fn; },
      skipWaiting: () => {},
      clients: { claim: () => {} },
      location: { origin: 'https://thedreamwedding.in' },
    },
    caches: {
      open: (name) => { openedCaches.push(name); return Promise.resolve(fakeCache); },
      match: () => Promise.resolve(undefined),
      keys: () => Promise.resolve([]),
      delete: () => Promise.resolve(true),
    },
    fetch: () => Promise.resolve({
      ok: true, status: 200,
      clone() { return this; },
    }),
    URL, Response,
    clients: { matchAll: () => Promise.resolve([]), openWindow: () => Promise.resolve() },
    console,
  };
  sandbox.self.registration = { showNotification: () => Promise.resolve() };
  vm.createContext(sandbox);
  new vm.Script(src, { filename: 'public/sw.js' }).runInContext(sandbox);
  return { listeners, openedCaches, puts };
}

// One synthetic FetchEvent; the verdict is whether respondWith fired.
function fire(handler, { url, method = 'GET', mode = 'no-cors' }) {
  let responded = false;
  const event = {
    request: { url, method, mode },
    respondWith: (p) => { responded = true; Promise.resolve(p).catch(() => {}); },
  };
  handler(event);
  return responded;
}

const w = loadWorker();
if (typeof w.listeners.fetch !== 'function') {
  console.log('  FAIL  sw.js registered no fetch listener — harness cannot proceed');
  process.exit(1);
}

// Cell 1 — the cure: a Cloudinary POST is NEVER intercepted.
const postIntercepted = fire(w.listeners.fetch, {
  url: 'https://api.cloudinary.com/v1_1/tdw/image/upload', method: 'POST',
});
cell('1. POST to cloudinary passes through untouched (respondWith never fires)', postIntercepted === false);

// Cell 2 — the leg the cure must not cost: a GET image is still cache-first.
const before = w.puts.length;
const getIntercepted = fire(w.listeners.fetch, {
  url: 'https://res.cloudinary.com/tdw/image/upload/v1/portfolio/a.jpg', method: 'GET',
});
await new Promise((r) => setTimeout(r, 20)); // let the cache.open/match/fetch/put chain settle
cell('2. GET image on cloudinary is intercepted AND lands in cache.put', getIntercepted === true && w.puts.length === before + 1);

// Cell 3 — pages stay network-first through the worker.
const navIntercepted = fire(w.listeners.fetch, {
  url: 'https://thedreamwedding.in/vendor/portfolio', method: 'GET', mode: 'navigate',
});
cell('3. GET navigate is still intercepted (network-first page leg alive)', navIntercepted === true);

// Cell 4 — the version bump, read behaviourally: the image leg above opened a
// cache, and that cache must not be v5's.
cell("4. image cache name moved off 'tdw-images-v5' (installed v5 workers replace, caches purge)",
  w.openedCaches.length > 0 && w.openedCaches.every((n) => n !== 'tdw-images-v5'));

console.log(`\n════════  tdw_p01_sw_nonget: ${passed} passed, ${failed} failed  (total ${passed + failed})  ════════`);
process.exit(failed === 0 ? 0 : 1);
