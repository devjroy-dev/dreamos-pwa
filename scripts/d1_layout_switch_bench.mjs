#!/usr/bin/env node
// scripts/d1_layout_switch_bench.mjs · DESIGN-1 · THE LAYOUT SWITCH (the founder, 29 Sept 2026).
//
// THE CLAIM: each vendor sees only her own setting's layout. The server decides it (dream-os src/lib/vendorLayout.js,
// proven by dream-os scripts/b0185_layout_switch_bench.js) and sends it on GET /me as `layout`; the pwa carries it in one
// cookie (components/worklist/LayoutSwitch.tsx) and middleware.ts serves the tree it names (lib/worklist/layoutSwitch.ts).
// This bench drives the three real files, transpiled, against a /me per vendor on one device:
//   A (layout v2) signs in on today's layout; B (layout classic) signs in after her on the same phone; C's /me is an
//   older server with no field. Every request is then put through the real middleware with the cookie the switch left.
// Mutations prove the cells can go red. Static; no server, no network.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const SRC = { lib: read('lib/worklist/layoutSwitch.ts'), sw: read('components/worklist/LayoutSwitch.tsx'), mw: read('middleware.ts') };

function load(src, stubs, file) {
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  const req = (id) => { if (id in stubs) return stubs[id]; throw new Error(file + ' requires ' + id + ', not stubbed'); };
  new Function('exports', 'require', 'module', 'process', out)(mod.exports, req, mod, process);
  return mod.exports;
}

function world(srcs) {
  const lib = load(srcs.lib, {}, 'layoutSwitch.ts');
  // the device: one cookie jar and one tab's sessionStorage, shared by whoever signs in on it
  const device = { jar: {}, session: {}, reloads: 0, me: null };
  const g = globalThis;
  g.document = {};
  Object.defineProperty(g.document, 'cookie', {
    configurable: true,
    get: () => Object.entries(device.jar).map(([k, v]) => k + '=' + v).join('; '),
    set: (s) => { const [kv] = s.split(';'); const i = kv.indexOf('='); device.jar[kv.slice(0, i).trim()] = kv.slice(i + 1).trim(); },
  });
  g.sessionStorage = { getItem: (k) => (k in device.session ? device.session[k] : null), setItem: (k, v) => { device.session[k] = String(v); }, removeItem: (k) => { delete device.session[k]; } };
  g.window = { location: { reload: () => { device.reloads += 1; } } };
  const pending = [];
  const react = { useEffect: (fn) => { fn(); } };
  const api = { getJson: (p) => { if (p !== '/api/v2/vendor/me') throw new Error('asked ' + p); const r = Promise.resolve(device.me); pending.push(r); return r; } };
  const sw = load(srcs.sw, { react, '@/lib/vendor/api/_base': api, '@/lib/worklist/layoutSwitch': lib }, 'LayoutSwitch.tsx');
  const next = require(path.join(ROOT, 'node_modules/next/server.js'));
  const mw = load(srcs.mw, { 'next/server': next, '@/lib/public/vendorHost': hostStub(), '@/lib/worklist/layoutSwitch': lib }, 'middleware.ts');
  async function mount(tree, me) { device.me = me; sw.LayoutSwitch({ tree }); await Promise.all(pending.splice(0)); await new Promise((r) => setTimeout(r, 0)); }
  function serve(p) {
    const headers = new Headers({ host: 'localhost:3000' });
    const c = document.cookie; if (c) headers.set('cookie', c);
    const res = mw.middleware(new next.NextRequest('http://localhost:3000' + p, { headers }));
    const rw = res.headers.get('x-middleware-rewrite'); const loc = res.headers.get('location');
    if (rw) return 'rewrite ' + new URL(rw).pathname;
    if (loc) return 'redirect ' + new URL(loc).pathname;
    return 'next';
  }
  return { lib, device, mount, serve, signOut: () => { device.session = {}; } };
}
// the host decision is its own bench's (b-series vendorHost); a localhost request is never a vendor host
function hostStub() { return { decide: () => null }; }

let pass = 0, fail = 0; const failed = [];
const cell = async (name, fn) => {
  let r; try { r = await fn(); } catch (e) { r = 'threw ' + e.message; }
  if (r === true || r === null) { pass += 1; console.log('  ok   ' + name); } else { fail += 1; failed.push(name); console.log('  FAIL ' + name + '  → ' + r); }
};

async function scenario(srcs) {
  const saved = process.env.TDW_LAYOUT_DEFAULT; delete process.env.TDW_LAYOUT_DEFAULT;
  const w = world(srcs); const out = {};
  try {
    out.fresh = w.serve('/vendor/today');                                   // no cookie, no default
    await w.mount('classic', { ok: true, vendor: { id: 'A', layout: 'v2' } }); // A signs in on today's layout
    out.aCookie = w.device.jar.tdw_layout; out.aReloads = w.device.reloads;
    out.aServe = w.serve('/vendor/today'); out.aClients = w.serve('/vendor/clients');
    await w.mount('v2', { ok: true, vendor: { id: 'A', layout: 'v2' } });     // after the reload, the v2 tree
    out.aSettled = w.device.reloads;
    w.signOut();
    await w.mount('v2', { ok: true, vendor: { id: 'B', layout: 'classic' } }); // B on the same phone, cookie still A's
    out.bCookie = w.device.jar.tdw_layout; out.bReloads = w.device.reloads - out.aSettled;
    out.bServe = w.serve('/vendor/today');
    await w.mount('classic', { ok: true, vendor: { id: 'B', layout: 'classic' } });
    out.bSettled = w.device.reloads - out.aSettled;
    const before = { jar: JSON.stringify(w.device.jar), reloads: w.device.reloads };
    await w.mount('classic', { ok: true, vendor: { id: 'C' } });              // an /me without the field
    out.cUnchanged = JSON.stringify(w.device.jar) === before.jar && w.device.reloads === before.reloads;
    // a middleware that did not serve the other tree: one reload per tab, never a loop
    w.device.jar.tdw_layout = 'v2'; w.signOut(); const r0 = w.device.reloads;
    await w.mount('classic', { ok: true, vendor: { id: 'A', layout: 'v2' } });
    await w.mount('classic', { ok: true, vendor: { id: 'A', layout: 'v2' } });
    out.loop = w.device.reloads - r0;
    out.direct = w.serve('/v2/vendor/today');
    out.admin = w.serve('/admin');
    w.device.jar.tdw_layout = 'nonsense'; out.junk = w.serve('/vendor/today');
    delete w.device.jar.tdw_layout; process.env.TDW_LAYOUT_DEFAULT = 'v2'; out.seam = w.serve('/vendor/today');
  } finally { if (saved === undefined) delete process.env.TDW_LAYOUT_DEFAULT; else process.env.TDW_LAYOUT_DEFAULT = saved; }
  return out;
}

const CELLS = {
  L1: ['L1 no cookie and no default: today’s layout, untouched', (o) => o.fresh === 'next' || o.fresh],
  L2: ['L2 A (v2) signing in on today’s layout: the cookie says v2 and the tab reloads once', (o) => (o.aCookie === 'v2' && o.aReloads === 1) || JSON.stringify([o.aCookie, o.aReloads])],
  L3: ['L3 A is then served the v2 tree at the same addresses', (o) => (o.aServe === 'rewrite /v2/vendor/today' && o.aClients === 'rewrite /v2/vendor/clients') || o.aServe + ' / ' + o.aClients],
  L4: ['L4 on the v2 tree A settles (no second reload)', (o) => o.aSettled === 1 || String(o.aSettled)],
  L5: ['L5 B (classic) on the same phone after A: the cookie becomes classic and the tab reloads', (o) => (o.bCookie === 'classic' && o.bReloads === 1) || JSON.stringify([o.bCookie, o.bReloads])],
  L6: ['L6 B is served today’s layout, never A’s', (o) => o.bServe === 'next' || o.bServe],
  L7: ['L7 on today’s layout B settles (no second reload)', (o) => o.bSettled === 1 || String(o.bSettled)],
  L8: ['L8 an /me without the field changes nothing (an older server)', (o) => o.cUnchanged === true || 'changed'],
  L9: ['L9 a tree that does not flip reloads once per tab, never a loop', (o) => o.loop === 1 || String(o.loop)],
  L10: ['L10 the v2 tree has no address of its own: /v2/... goes back to the address it mirrors', (o) => o.direct === 'redirect /vendor/today' || o.direct],
  L11: ['L11 the cookie reaches /vendor only (admin untouched)', (o) => o.admin === 'next' || o.admin],
  L12: ['L12 a cookie that is not a layout is today’s layout', (o) => o.junk === 'next' || o.junk],
  L13: ['L13 the bench seam TDW_LAYOUT_DEFAULT=v2 serves v2 when no cookie is set (the _v2 benches)', (o) => o.seam === 'rewrite /v2/vendor/today' || o.seam],
};

console.log('d1 layout switch · each vendor sees only her own setting’s layout');
const real = await scenario(SRC);
for (const [, [name, f]] of Object.entries(CELLS)) await cell(name, () => f(real));

// the shell's root mounts it, once per tree, naming the tree it serves
await cell('L14 the classic shell mounts the switch naming classic; the v2 shell naming v2', () => {
  const c = read('app/vendor/(shell)/layout.tsx'), v = read('v2/app/vendor/(shell)/layout.tsx');
  return ((c.match(/<LayoutSwitch tree="classic" \/>/g) || []).length === 1 && (v.match(/<LayoutSwitch tree="v2" \/>/g) || []).length === 1) || 'not mounted once each';
});

console.log('\nmutations (each must turn its cell red)');
const MUT = [
  ['M1 the request ignores the cookie', { lib: SRC.lib.replace('return asLayout(cookie) ?? asLayout(serverDefault)', 'return asLayout(serverDefault)') }, 'L3'],
  ['M2 the switch never overwrites a cookie already set', { sw: SRC.sw.replace('if (have !== want) document.cookie', 'if (!have) document.cookie') }, 'L5'],
  ['M3 the rewrite serves v2 to everyone', { mw: SRC.mw.replace("process.env.TDW_LAYOUT_DEFAULT) === 'v2'", "process.env.TDW_LAYOUT_DEFAULT) !== 'nobody'") }, 'L6'],
  ['M4 the reload guard removed', { sw: SRC.sw.replace('if (sessionStorage.getItem(RELOADED) === want) return; ', '') }, 'L9'],
  ['M5 an unknown value read as v2', { lib: SRC.lib.replace("return v === 'v2' || v === 'classic' ? v : null;", "return v === 'classic' ? v : v == null ? null : 'v2';") }, 'L12'],
];
for (const [name, patchSrc, target] of MUT) {
  const srcs = { ...SRC, ...patchSrc };
  const changed = Object.keys(patchSrc).every((k) => patchSrc[k] !== SRC[k]);
  await cell(name + ' → ' + target + ' RED', async () => {
    if (!changed) return 'the mutation did not apply';
    const o = await scenario(srcs);
    return CELLS[target][1](o) !== true || 'still green';
  });
}
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 layout switch ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
process.exit(fail ? 1 : 0);
