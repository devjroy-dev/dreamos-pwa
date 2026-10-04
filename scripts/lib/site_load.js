// scripts/lib/site_load.js · WEB-5 · loads the styles site's TypeScript (lib/site/**) in plain node for its benches:
// each file transpiled (typescript, as b147 does), relative and '@/' imports resolved to the repo, network refused.
'use strict';
const fs = require('fs'); const path = require('path'); const ts = require('typescript');
const ROOT = path.join(__dirname, '..', '..');
function makeLoader(stubs = {}) {
  const cache = new Map();
  function resolve(from, id) {
    if (id in stubs) return { stub: stubs[id] };
    let p = null;
    if (id.startsWith('@/')) p = path.join(ROOT, id.slice(2));
    else if (id.startsWith('.')) p = path.resolve(path.dirname(from), id);
    if (!p) return { node: id };
    for (const c of [p, p + '.ts', p + '.tsx', path.join(p, 'index.ts')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return { file: c };
    throw new Error('site_load: cannot resolve ' + id + ' from ' + from);
  }
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const m = { exports: {} }; cache.set(file, m);
    const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
    const req = (id) => { const r = resolve(file, id); return r.stub !== undefined ? r.stub : r.file ? load(r.file) : require(r.node); };
    new Function('module', 'exports', 'require', 'process', 'Buffer', js)(m, m.exports, req, process, Buffer);
    return m.exports;
  }
  return (rel) => load(path.join(ROOT, rel));
}
module.exports = { makeLoader, ROOT };
