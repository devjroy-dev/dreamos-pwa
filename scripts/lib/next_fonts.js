'use strict';
// scripts/lib/next_fonts.js · WEB-8 · CE-47 ruling (A), 8 October 2026 · a font stand-in for any bench that starts next dev.
// Lives in scripts/lib/ so run-floor.sh's flat glob never collects it as a bench.
//
// THE DEFECT IT CURES: next dev asks Google for every face the app's layouts name (next/font/google), on every compile.
// Where Google does not answer, a bench's server asks again and again and the run never finishes (the chair's machine,
// 8 October: 1,400 requests). Where Google does answer, the faces depend on Google.
//
// WHAT IT DOES:
//   1. The faces: the @fontsource packages that tools/site_rig/google_font_mock.cjs names are fetched once with
//      `npm pack` into a cache OUTSIDE the tree (<os temp>/tdw-next-fonts). @fontsource's latin files are Google's faces.
//      No npm registry, or a package that will not unpack, is a REFUSAL: exit 3 (the floor's "cannot run here").
//   2. The server: a small HTTP server for those files on a free local port, started as its own process and stopped by
//      its pid (never by pattern).
//   3. The answers: a self-contained module (no require; next dev cannot load one that requires another file) with the
//      rig's Google CSS for every URL the app asks for, each face pointing at that server. It is handed to next dev, and
//      to nothing else, as NEXT_FONT_GOOGLE_MOCKED_RESPONSES.
//
// USE:   const fonts = require('./lib/next_fonts').start(ROOT, 'b172');      // before next dev
//        spawn(..., { env: { ...process.env, ...fonts.env } });
//        fonts.stop();                                                       // after next dev is stopped
// start(root, bench, { google: true }) skips the stand-in (env {}), for the one-off comparison against Google's own files.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const CACHE = path.join(os.tmpdir(), 'tdw-next-fonts');

function refuse(bench, why) {
  console.log(`  ${bench}: REFUSING TO RUN. The font stand-in could not be prepared: ${why}`);
  console.log('  It needs the npm registry once, to fetch the @fontsource packages into the temp folder. Nothing was changed.');
  process.exit(3);
}

// The rig's answers, read as data: every URL next asks for, and the @fontsource packages its faces come from.
function rigAnswers(root) {
  const file = path.join(root, 'tools', 'site_rig', 'google_font_mock.cjs');
  delete require.cache[require.resolve(file)];
  const answers = require(file);
  const pkgs = new Set();
  for (const css of Object.values(answers)) for (const m of css.matchAll(/@fontsource(-variable)?\/([a-z0-9-]+)\/files\//g)) pkgs.add((m[1] ? 'variable-' : '') + m[2]);   // CE-47 LAND-1: the variable scope too
  return { answers, pkgs: [...pkgs].sort() };
}

// 1. The faces, once, into the cache outside the tree.
function ensureFaces(pkgs, bench) {
  fs.mkdirSync(CACHE, { recursive: true });
  for (const pkg of pkgs) {
    const dir = path.join(CACHE, pkg);
    if (fs.existsSync(path.join(dir, '.complete'))) continue;
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const spec = pkg.startsWith('variable-') ? `@fontsource-variable/${pkg.slice(9)}@5` : `@fontsource/${pkg}@5`;   // CE-47 LAND-1
    const r = spawnSync('npm', ['pack', spec, '--silent'], { cwd: dir, encoding: 'utf8', timeout: 180000 });
    const tgz = r.status === 0 ? fs.readdirSync(dir).find((f) => f.endsWith('.tgz')) : null;
    if (!tgz) refuse(bench, `npm pack @fontsource/${pkg}@5 failed (${(r.stderr || r.error || 'no file').toString().trim().slice(0, 160)})`);
    const t = spawnSync('tar', ['xzf', tgz, 'package/files'], { cwd: dir, encoding: 'utf8' });
    if (t.status !== 0 || !fs.existsSync(path.join(dir, 'package', 'files'))) refuse(bench, `@fontsource/${pkg} did not unpack`);
    fs.writeFileSync(path.join(dir, '.complete'), new Date().toISOString());
  }
}

function freePort() {
  const r = spawnSync(process.execPath, ['-e', "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close();});"], { encoding: 'utf8' });
  return Number((r.stdout || '').trim()) || 4898;
}

function start(root, bench, opts = {}) {
  if (opts.google) {
    console.log(`  ${bench}: fonts from Google itself (B172_FONTS=google); no stand-in`);
    return { env: {}, stop() {}, port: null };
  }
  const { answers, pkgs } = rigAnswers(root);
  ensureFaces(pkgs, bench);
  // 2. The server, its own process, stopped by pid.
  const port = freePort();
  const serve = `const h=require('http'),fs=require('fs'),p=require('path');const C=${JSON.stringify(CACHE)};
h.createServer((q,s)=>{const [,pkg,f]=decodeURIComponent(q.url.split('?')[0]).split('/');const file=p.join(C,pkg||'','package','files',p.basename(f||''));
if(pkg&&f&&/^[a-z0-9-]+$/.test(pkg)&&fs.existsSync(file)){s.writeHead(200,{'content-type':'font/woff2','access-control-allow-origin':'*'});return fs.createReadStream(file).pipe(s);}
s.writeHead(404);s.end();}).listen(${port},'127.0.0.1');`;
  const srv = spawn(process.execPath, ['-e', serve], { detached: true, stdio: 'ignore' });
  let up = false;
  for (let i = 0; i < 50 && !up; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '2', `http://127.0.0.1:${port}/x/y`], { encoding: 'utf8' });
    up = r.stdout === '404'; if (!up) spawnSync('sleep', ['0.2']);
  }
  const stop = () => { try { process.kill(srv.pid, 'SIGKILL'); } catch (_e) { /* already gone */ } };
  if (!up) { stop(); refuse(bench, `the font server on 127.0.0.1:${port} did not answer`); }
  // 3. The answers, self-contained, every face pointing at the server.
  const out = {};
  for (const [url, css] of Object.entries(answers)) out[url] = css.replace(/url\([^)]*\/@fontsource(-variable)?\/([a-z0-9-]+)\/files\/([^)]+)\)/g, (_m, v, pkg, f) => `url(http://127.0.0.1:${port}/${v ? 'variable-' : ''}${pkg}/${f})`);   // CE-47 LAND-1: both scopes
  const file = path.join(CACHE, `answers-${process.pid}.cjs`);
  fs.writeFileSync(file, `// written by scripts/lib/next_fonts.js for one run; faces at http://127.0.0.1:${port}\nmodule.exports = ${JSON.stringify(out, null, 1)};\n`);
  console.log(`  ${bench}: font stand-in on 127.0.0.1:${port} (pid ${srv.pid}), ${Object.keys(out).length} Google requests answered from @fontsource (${pkgs.join(', ')})`);
  return { env: { NEXT_FONT_GOOGLE_MOCKED_RESPONSES: file }, port, pid: srv.pid, stop() { stop(); try { fs.unlinkSync(file); } catch (_e) { /* gone */ } } };
}

module.exports = { start, CACHE };
