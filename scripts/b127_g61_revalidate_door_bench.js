'use strict';
// scripts/b127_g61_revalidate_door_bench.js · TDW CE-45 · G6-1 · F-44.167 · rung b127.
//
// WHAT IT HOLDS: app/api/revalidate/storefront/route.ts (R-G31.7, the estate's on-demand rebuild of HER public page)
// actually rebuilds it. Until this cut it read j.vendor.routing_handle from GET /api/v2/vendor/me, whose answer
// carries the handle as `handle` (dream-os me.js :110, since 457c5b5), so it rebuilt nothing from the day it was built
// (b9872676) and every consent switch waited out revalidate = 300 (F-44.167; the seat's e-131).
// HOW: the REAL route handler is compiled from route.ts and called with a real Request-shaped object; only next/server's
// NextResponse.json and next/cache's revalidatePath are stood in for (the second is the spy), and global fetch answers
// /me with a body whose KEY is read from dream-os's me.js itself in the sibling clone, so this rung reddens if either
// side changes the handle's key again. A production mutation (the routing_handle-only read restored) must redden it.
// No clock is read. THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const P = (r) => path.join(ROOT, r);
const read = (r) => fs.readFileSync(P(r), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const ROUTE = 'app/api/revalidate/storefront/route.ts';
const ME_JS = path.join(ROOT, '..', 'dream-os', 'src', 'api', 'vendor', 'me.js');
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);

function loadRoute(src) {
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const calls = [];
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => {
    if (spec === 'next/server') return { NextResponse: { json: (body, init) => ({ body, status: (init && init.status) || 200 }) } };
    if (spec === 'next/cache') return { revalidatePath: (p) => calls.push(p) };
    return require(spec);
  }, mod, mod.exports);
  return { POST: mod.exports.POST, calls };
}
const req = (auth) => ({ headers: { get: (k) => (k.toLowerCase() === 'authorization' ? auth : null) } });
async function drive(src, { auth = 'Bearer tok', me = null, meOk = true, throws = false } = {}) {
  const { POST, calls } = loadRoute(src);
  const seen = [];
  global.fetch = async (url, init) => { seen.push({ url, init }); if (throws) throw new Error('down'); return { ok: meOk, json: async () => me }; };
  const res = await POST(req(auth));
  return { res, calls, seen };
}

(async () => {
  sec('1  the door and /me agree on the key');
  const haveSibling = fs.existsSync(ME_JS);
  ok(haveSibling, '1.0 the sibling dream-os clone is present (the floor runs with it beside this repo)', ME_JS);
  const me = haveSibling ? fs.readFileSync(ME_JS, 'utf8') : '';
  const getShape = me.slice(me.indexOf("router.get('/'"), me.indexOf("router.patch('/'"));
  const handleKey = /\n\s+handle:\s+vendor\.routing_handle/.test(getShape) ? 'handle' : null;
  ok(handleKey === 'handle' && !/\n\s+routing_handle:\s/.test(getShape), '1.1 dream-os GET /me answers the handle as `handle` and has no `routing_handle` key (me.js, read now)');
  ok(/j\?\.vendor\?\.handle\b/.test(read(ROUTE)), '1.2 the door reads j.vendor.handle, the key /me actually sends (F-44.167)');

  sec('2  the REAL route handler, driven');
  const SRC = read(ROUTE);
  const body = (h) => ({ ok: true, vendor: { [handleKey || 'handle']: h, name: 'Dev Roy' } });
  let r = await drive(SRC, { me: body('DEV440') });
  ok(r.res.status === 200 && r.res.body.ok === true && r.res.body.revalidated === true && r.calls.length === 1 && r.calls[0] === '/v/dev440',
    '2.1 her session and /me\u2019s real answer: /v/dev440 is rebuilt once, and the door answers revalidated: true', JSON.stringify({ res: r.res, calls: r.calls }));
  ok(r.seen.length === 1 && /\/api\/v2\/vendor\/me$/.test(r.seen[0].url) && r.seen[0].init.cache === 'no-store' && r.seen[0].init.headers.Authorization === 'Bearer tok',
    '2.2 the handle comes from HER session (her own Authorization, no-store), never from a body');
  r = await drive(SRC, { auth: null, me: body('DEV440') });
  ok(r.res.status === 401 && r.calls.length === 0 && r.seen.length === 0, '2.3 no session: 401, no /me call, nothing rebuilt');
  r = await drive(SRC, { meOk: false, me: body('DEV440') });
  ok(r.res.status === 401 && r.calls.length === 0, '2.4 /me refuses the token: 401, nothing rebuilt');
  r = await drive(SRC, { throws: true });
  ok(r.res.status === 401 && r.calls.length === 0, '2.5 /me unreachable: fails closed, 401, nothing rebuilt');
  r = await drive(SRC, { me: body(null) });
  ok(r.res.status === 200 && r.res.body.revalidated === false && r.calls.length === 0, '2.6 a vendor with no handle: ok, revalidated: false, nothing rebuilt');
  r = await drive(SRC, { me: { ok: true, vendor: { routing_handle: 'DEV440' } } });
  ok(r.calls.length === 1 && r.calls[0] === '/v/dev440', '2.7 the fallback: an answer carrying only routing_handle still rebuilds (the old key kept)');

  sec('3  mutation of production code (must turn its cell red; restored by sha)');
  const before = sha(SRC);
  const mutated = SRC.replace('const h = j?.vendor?.handle ?? j?.vendor?.routing_handle;', 'const h = j?.vendor?.routing_handle;');
  let applied = mutated !== SRC; let red = false;
  if (applied) {
    fs.writeFileSync(P(ROUTE), mutated);
    try { const m = await drive(read(ROUTE), { me: body('DEV440') }); red = !(m.calls.length === 1 && m.res.body.revalidated === true); }
    finally { fs.writeFileSync(P(ROUTE), SRC); }
  }
  ok(applied && red && sha(read(ROUTE)) === before, '3 M1 the routing_handle-only read restored (the pre-cure door): applies, turns 2.1 red, restored by sha', JSON.stringify({ applied, red }));

  console.log(`\nb127 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.log(`b127 CRASHED: ${(e && e.stack) || e}`); process.exit(1); });
