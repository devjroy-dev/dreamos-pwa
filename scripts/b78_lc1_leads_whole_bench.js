// ══════════════════════════════════════════════════════════════════════════
// b78_lc1_leads_whole_bench — CE-43 · LC-1 · F-43.4, ruled F4(d) · the dreamos-pwa half
// (rung b78 allocated by the chair, CE-43 ruling on the LC-1 build relay; b79 is held for R6)
// ══════════════════════════════════════════════════════════════════════════
// DRIVES the REAL lib/vendor/api/vendor.ts (transpiled in memory) with its `./_base`
// getJson replaced by a double of the dream-os list route's contract: default 20,
// limit clamped to 100, `offset` honoured, `total` returned. The fixture is 26
// leads, DEV440's live count on 2026-09-16 (founder SELECT Q-LC1-B: live 26).
// MUTATIONS are of the production file's source, in memory.
// BOTH WAYS: at base 89f18af7 `fetchLeadsWhole` does not exist and the hook reads
// fetchLeads, so §1 and §2 go RED.
// Run it: node scripts/b78_lc1_leads_whole_bench.js
// DISCLOSED (chair-accepted): §1.6 is RED at base by construction, not by behaviour: the
// cells short-circuit when fetchLeadsWhole is absent, so the old-URL cell cannot run there.
// ══════════════════════════════════════════════════════════════════════════
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
let ts;
try { ts = require('typescript'); } catch (e) { console.log('REFUSED — node_modules absent; run npm ci'); process.exit(3); }

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const sec = (t) => console.log('\n' + t);

const VENDOR = 'v-dev440';
function route(rows) {
  const calls = [];
  const getJson = async (p) => {
    calls.push(p);
    const u = new URL('http://x' + p);
    if (!u.pathname.endsWith('/api/v2/vendor/leads/' + VENDOR)) return { ok: false, error: 'wrong path' };
    const limit = Math.max(1, Math.min(100, parseInt(u.searchParams.get('limit'), 10) || 20));
    const offset = Math.max(0, parseInt(u.searchParams.get('offset'), 10) || 0);
    return { ok: true, leads: rows.slice(offset, offset + limit), total: rows.length };
  };
  return { getJson, calls };
}
const leads = (n) => Array.from({ length: n }, (_, i) => ({ id: 'L' + i, name: 'Lead ' + i, created_at: '2026-09-' + String(16 - (i % 15)).padStart(2, '0') }));

function loadVendorApi(src, getJson) {
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const stubBase = { getJson, postJson: async () => ({}), patchJson: async () => ({}), deleteJson: async () => ({}), API_BASE: '', getAuthHeader: () => ({}), handleResponse: async () => ({}) };
  const stubs = {
    './_base': stubBase,
    '@/lib/solutions/routes': { API: new Proxy({}, { get: () => '' }) },
    '@/lib/vendor/session': { getVendorSession: () => null, setVendorSession: () => {}, clearVendorSession: () => {} },
    '@/lib/worklist/feed': { refreshToday: () => {} },
  };
  const mod = { exports: {} };
  const req = (spec) => { if (spec in stubs) return stubs[spec]; return require(spec); };
  new Function('require', 'module', 'exports', out)(req, mod, mod.exports);
  return mod.exports;
}

async function cells(src) {
  const c = {};
  let api;
  try { api = loadVendorApi(src, route(leads(26)).getJson); } catch (e) { return c; }
  if (typeof api.fetchLeadsWhole !== 'function') return c;
  {
    const r = route(leads(26));
    const a = loadVendorApi(src, r.getJson);
    const res = await a.fetchLeadsWhole(VENDOR);
    c.C1 = res.ok === true && res.leads.length === 26 && res.total === 26 && new Set(res.leads.map(l => l.id)).size === 26;
    c.C1b = r.calls.length >= 1 && /[?&]limit=100(&|$)/.test(r.calls[0]) && /[?&]offset=0(&|$)/.test(r.calls[0]);
  }
  {
    const r = route(leads(250));
    const a = loadVendorApi(src, r.getJson);
    const res = await a.fetchLeadsWhole(VENDOR);
    c.C2 = res.leads.length === 250 && r.calls.length === 3;
  }
  {
    // a lead filed between pages shifts newest-first order by one: no duplicate row survives
    const rows = leads(150); let n = 0;
    const getJson = async (p) => {
      n++;
      const u = new URL('http://x' + p);
      const limit = Math.min(100, parseInt(u.searchParams.get('limit'), 10) || 20);
      const offset = parseInt(u.searchParams.get('offset'), 10) || 0;
      const view = n === 1 ? rows : [{ id: 'NEW', name: 'New' }, ...rows];
      return { ok: true, leads: view.slice(offset, offset + limit), total: view.length };
    };
    const a = loadVendorApi(src, getJson);
    const res = await a.fetchLeadsWhole(VENDOR);
    c.C3 = res.leads.length === new Set(res.leads.map(l => l.id)).size && res.leads.length >= 150;
  }
  {
    let n = 0;
    const getJson = async (p) => { n++; return n === 1 ? { ok: true, leads: leads(100), total: 130 } : { ok: false, error: 'Lookup failed.' }; };
    const a = loadVendorApi(src, getJson);
    const res = await a.fetchLeadsWhole(VENDOR);
    c.C4 = res.ok === false && res.error === 'Lookup failed.';
  }
  {
    const r = route(leads(26));
    const a = loadVendorApi(src, r.getJson);
    await a.fetchLeads(VENDOR);
    c.C5 = r.calls[0] === '/api/v2/vendor/leads/' + VENDOR + '?state=all';
  }
  return c;
}

(async () => {
  const VT = 'lib/vendor/api/vendor.ts';
  const src = read(VT);
  sec('§1 · the whole list over the real client (26 = DEV440 live)');
  const c = await cells(src);
  ok(c.C1, '§1.1 26 leads come back whole, no duplicate');
  ok(c.C1b, '§1.2 the first page asks for the server ceiling: limit=100, offset=0');
  ok(c.C2, '§1.3 250 leads arrive in three pages');
  ok(c.C3, '§1.4 a lead filed between pages leaves no duplicate row');
  ok(c.C4, '§1.5 a failed later page returns the failure, never a short list');
  ok(c.C5, '§1.6 fetchLeads with no page sends the old URL byte-for-byte (other callers untouched)');

  sec('§2 · the hook reads the whole list (comment-stripped)');
  {
    const hook = read('hooks/vendor/useVendorData.ts').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
    const body = (hook.match(/export function useLeadsData[\s\S]*?\n}\n/) || [''])[0];
    ok(/fetchLeadsWhole\(id\)/.test(body), '§2.1 useLeadsData fetches through fetchLeadsWhole');
    ok(!/fetchLeads\(/.test(body), '§2.2 useLeadsData no longer calls the one-page fetchLeads');
    const readers = ['app/vendor/(shell)/leads/body.tsx', 'app/vendor/(shell)/invoices/body.tsx', 'app/vendor/(shell)/clients/body.tsx']
      .filter(f => /useLeadsData\(vendorId\)|useData=\{useLeadsData\}/.test(read(f)));
    ok(readers.length === 3, `§2.3 the three readers ride the one hook (found ${readers.length})`);
    ok(!/Load more/i.test(read('components/vendor/slices/SliceShell.tsx')), '§2.4 no paging control added (F4(d): zero copy)');
  }

  sec('§3 · mutations of production code');
  const muts = [
    ['M1 page loop removed', 'offset < total; n++)', '0 > 1; n++)', 'C2'],
    ['M2 dedupe removed', 'if (!seen.has(r.id)) { seen.add(r.id); leads.push(r); }', 'leads.push(r);', 'C3'],
    ['M3 failed page swallowed', "if (!next || !next.ok || !Array.isArray(next.leads)) return next;", "if (!next || !next.ok || !Array.isArray(next.leads)) break;", 'C4'],
    ['M4 page size 20', 'export const LEADS_PAGE_SIZE = 100;', 'export const LEADS_PAGE_SIZE = 20;', 'C1b'],
  ];
  for (const [name, from, to, cell] of muts) {
    if (!src.includes(from)) { ok(false, `§3 ${name}: anchor not found`); continue; }
    const m = await cells(src.replace(from, to));
    ok(m[cell] === false, `§3 ${name} → ${cell} RED`);
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('BENCH ERROR', e); process.exit(2); });
