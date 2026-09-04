// scripts/lib/aliasHook.cjs
//
// TDW_19 P2-A §3-2 · THE `@/` ALIAS, AT RUNTIME.
//
// `tsconfig.json`'s `paths` is a TYPE-RESOLUTION map and nothing else. `tsc`
// type-checks `import … from '@/lib/frost/igLink'` correctly and then EMITS
// `require('@/lib/frost/igLink')` verbatim, because rewriting module specifiers
// is a bundler's job and `tsc` is not one. Every compiled component that
// reaches for the repo's alias therefore dies MODULE_NOT_FOUND the moment it is
// run by bare node.
//
// Derived from the failure, not assumed: the compile was clean, the render was
// not, and the missing module was the alias itself.
//
// `scripts/run-mode-bridge-proof.sh` never hit this because `lib/worklist/mode.ts`
// imports nothing through `@/`. That precedent works and this hook does not
// contradict it — it extends the same harness to a subject whose imports are
// deeper. Named here so the next seat compiling a COMPONENT rather than a pure
// module finds the decision instead of the error.
//
// ONE MAPPING. `@/x` → `<alias root>/x`, exactly what `tsconfig.json` declares.
// Nothing else is intercepted: any specifier that does not start with `@/` is
// handed straight back to node's own resolver, so this cannot quietly redirect
// a real package.
//
// ⚠ THE ROOT IS THE COMPILED TREE, NOT THE SOURCE TREE, and the difference is
// the second failure this hook was written through. Mapping `@/lib/frost/igLink`
// at the repo root finds `lib/frost/igLink.ts` — TypeScript, which bare node
// cannot load. The graph that must resolve is the EMITTED one, so the caller
// passes its outDir in `P2A_ALIAS_ROOT`. That directory sits inside the repo,
// so `lucide-react` and `react-dom/server` still resolve by node's ordinary
// upward walk into `node_modules` — which is exactly why the outDir is not a
// temp directory.
//
// Falling back to the repo root when the variable is unset keeps this usable
// from a plain `node -r` on source-adjacent JS, and makes the default the
// harmless one.

const Module = require('node:module');
const path   = require('node:path');

const ROOT = process.env.P2A_ALIAS_ROOT
  ? path.resolve(process.env.P2A_ALIAS_ROOT)
  : path.resolve(__dirname, '..', '..');
const original = Module._resolveFilename;

Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    return original.call(this, path.join(ROOT, request.slice(2)), ...rest);
  }
  return original.call(this, request, ...rest);
};
