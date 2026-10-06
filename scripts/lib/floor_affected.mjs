// scripts/lib/floor_affected.mjs · CE-47 ADS-2 · THE AFFECTED-ONLY CHECK (the chair's ruling, 3 Oct 2026).
// Which floor members a landing must run. PURE at its core (select), so b203 drives it on fixture trees.
//   T = the delivered paths, plus every app file that imports one of them (one level of the app's import graph).
//   A BROWSER member (puppeteer, chromium, the b126 dev server or `next dev`, in its own source or in any scripts/lib
//   file it pulls in, transitively) RUNS when its source, its FLOOR-SUBJECTS line or those lib files name a path in T:
//   the path, the path without its extension, '@/'+that, or, for an app page, its route ('/vendor/posts/ads').
//   Every other member (no browser) RUNS, and every .proof.ts wrapper RUNS. Nothing else is decided here.
// CLI: node scripts/lib/floor_affected.mjs <manifest> [<manifest> ...]   (run from the repo root)
//   prints `RUN <member> <why>` and `SKIP <member> <why>`, one per line, members as the runner lists them.
import fs from 'node:fs';
import path from 'node:path';

export const BROWSER_RE = /puppeteer|chromium|b126_dev_server|next dev/;
export const WALK_RE = /readdirSync|readdir\(|\bglob\b|\bwalk\(|walkSync|fs\.opendir/;
export const ROOT_RE = /['"`](?:\.\/)?(?:app|components|lib|v2)(?:\/|['"`])/;
const APP_DIRS = ['app', 'v2', 'lib', 'components', 'hooks'];
const CODE_EXT = ['.ts', '.tsx', '.js', '.mjs', '.jsx'];

export function manifestPaths(text) {
  return String(text).split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}
const noExt = (p) => p.replace(/\.(tsx|ts|jsx|js|mjs|cjs)$/, '');

/** The route an app page serves: app/vendor/(shell)/posts/ads/page.tsx -> /vendor/posts/ads (null if not a page). */
export function routeOf(p) {
  const m = p.match(/^(?:v2\/)?app\/(.*)\/page\.(tsx|ts|jsx|js)$/);
  if (!m) return null;
  const segs = m[1].split('/').filter((s) => s && !/^\(.*\)$/.test(s));
  return segs.length >= 2 ? '/' + segs.join('/') : null;   // a one-segment route ('/vendor') is too broad to be a name
}

/** The names under which a file can be named by a bench. */
export function namesOf(p) {
  const out = new Set([p, noExt(p), '@/' + noExt(p)]);
  const r = routeOf(p); if (r) out.add(r);
  return [...out];
}

function resolveSpec(spec, fromFile, exists) {
  let base;
  if (spec.startsWith('@/')) base = spec.slice(2);
  else if (spec.startsWith('.')) base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), spec));
  else return null;
  for (const c of [base, ...CODE_EXT.map((e) => base + e), ...CODE_EXT.map((e) => base + '/index' + e)]) if (exists(c)) return c;
  return null;
}

/** One level of importers: app files whose import specifiers resolve to a delivered path. */
export function importersOf(delivered, appFiles, read, exists) {
  const want = new Set(delivered); const out = new Map();
  for (const f of appFiles) {
    const src = read(f); if (!src) continue;
    for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*|require\(\s*)['"]([^'"]+)['"]/g)) {
      const r = resolveSpec(m[1], f, exists);
      if (r && want.has(r) && !want.has(f)) { out.set(f, r); break; }
    }
  }
  return out;   // importer -> the delivered file it imports
}

/** scripts/lib files a script pulls in, transitively. */
export function libClosure(file, read, exists) {
  const seen = new Set(); const stack = [file];
  while (stack.length) {
    const f = stack.pop(); const src = read(f) || '';
    for (const m of src.matchAll(/lib\/([A-Za-z0-9_.-]+\.(?:js|mjs|cjs|sh))/g)) {
      const l = 'scripts/lib/' + m[1];
      if (!seen.has(l) && exists(l)) { seen.add(l); stack.push(l); }
    }
  }
  return [...seen];
}

const boundary = (txt, name) => {
  // a route must stand as a whole path: not followed by another path character
  if (name.startsWith('/') && !name.includes('.')) return new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_/-])').test(txt);
  return txt.includes(name);
};

/** THE SELECTION. members: runner-ordered paths; delivered: paths; fs-like read/exists; appFiles: app file list. */
export function select({ members, delivered, appFiles, read, exists }) {
  const importers = importersOf(delivered, appFiles, read, exists);
  const T = new Map(); for (const d of delivered) T.set(d, 'delivered');
  for (const [imp, d] of importers) if (!T.has(imp)) T.set(imp, `imports ${d}`);
  const names = []; for (const [p, how] of T) for (const n of namesOf(p)) names.push([n, p, how]);
  const out = [];
  for (const m of members) {
    if (m.endsWith('.sh')) { out.push({ member: m, run: true, why: 'wrapper (always run)' }); continue; }
    const libs = libClosure(m, read, exists);
    const texts = [[m, read(m) || ''], ...libs.map((l) => [l, read(l) || ''])];
    const browser = texts.some(([, t]) => BROWSER_RE.test(t));
    if (!browser) { out.push({ member: m, run: true, why: 'no-browser (always run)' }); continue; }
    // e-269 (the chair, 3 Oct 2026): a member that WALKS app/, components/, lib/ or v2/ for a pattern names no path,
    // yet every delivery is in its radius by construction. Always run, like the no-browser set.
    if (texts.some(([, t]) => WALK_RE.test(t) && ROOT_RE.test(t))) { out.push({ member: m, run: true, why: 'walks the app tree (always run, e-269)' }); continue; }
    if (delivered.includes(m)) { out.push({ member: m, run: true, why: 'the delivery names the member' }); continue; }
    let hit = null;
    for (const [where, t] of texts) { for (const [n, p, how] of names) if (boundary(t, n)) { hit = `${where} names ${n} (${p}: ${how})`; break; } if (hit) break; }
    out.push(hit ? { member: m, run: true, why: hit } : { member: m, run: false, why: 'browser member, no subject of the delivery' });
  }
  return out;
}

function listMembers(root) {
  const s = fs.readdirSync(path.join(root, 'scripts'));
  const all = s.filter((f) => /\.(proof\.mjs|mjs|js)$/.test(f)).map((f) => 'scripts/' + f).sort();
  const wr = s.filter((f) => /^run-.*-proof\.sh$/.test(f)).map((f) => 'scripts/' + f).sort();
  return [...new Set(all), ...wr];
}
function walk(root, dir, out) {
  let ents = []; try { ents = fs.readdirSync(path.join(root, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = dir + '/' + e.name;
    if (e.isDirectory()) walk(root, p, out); else if (CODE_EXT.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}
export function selectRepo(root, delivered) {
  const read = (p) => { try { return fs.readFileSync(path.join(root, p), 'utf8'); } catch { return null; } };
  const exists = (p) => { try { return fs.statSync(path.join(root, p)).isFile(); } catch { return false; } };
  const appFiles = APP_DIRS.flatMap((d) => walk(root, d, []));
  return select({ members: listMembers(root), delivered, appFiles, read, exists });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ms = process.argv.slice(2);
  if (!ms.length) { console.error('usage: node scripts/lib/floor_affected.mjs <manifest> [<manifest> ...]'); process.exit(2); }
  const delivered = [...new Set(ms.flatMap((m) => manifestPaths(fs.readFileSync(m, 'utf8'))))];
  for (const r of selectRepo(process.cwd(), delivered)) console.log(`${r.run ? 'RUN ' : 'SKIP'} ${r.member} ${r.why}`);
}
