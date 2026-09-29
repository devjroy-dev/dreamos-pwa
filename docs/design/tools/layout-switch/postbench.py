#!/usr/bin/env python3
# DESIGN-1 · THE LAYOUT SWITCH · the v2 copies' amendments, applied after splitbench.py (so a regeneration keeps them).
# Each patch names its anchor; an anchor that is not found exactly once stops the script (never a silent miss).
import os, sys
root = sys.argv[1]
os.chdir(root)

VIEW_JS = r"""
// DESIGN-1 · THE LAYOUT SWITCH · THE V2 VIEW OF THE TREE (by label). The v2 tree is the shared tree with v2/ laid over it:
// a module with a copy in v2/ is served from v2/, and every other module is the shared one. So a directory walk in this
// copy sees exactly that: under app/, components/, lib/ and hooks/ a file whose v2/ twin exists is left out (the walk
// meets the twin under v2/ instead), and app/v2 (the route shims) is left out; the walks below also walk the v2/ roots.
{
  const __fs = require('fs'), __path = require('path');
  const __ROOT = __path.resolve(__dirname, '..');
  const __SHARED = ['app', 'components', 'lib', 'hooks'].map((d) => __path.join(__ROOT, d));
  const __rd = __fs.readdirSync;
  __fs.readdirSync = function (dir, opts) {
    const out = __rd.call(__fs, dir, opts);
    const abs = __path.resolve(String(dir));
    if (!__SHARED.some((s) => abs === s || abs.startsWith(s + __path.sep))) return out;
    const rel = __path.relative(__ROOT, abs);
    return out.filter((e) => {
      const name = typeof e === 'string' ? e : e.name;
      const r = __path.join(rel, name);
      if (r === __path.join('app', 'v2')) return false;
      const isDir = typeof e === 'string' ? __fs.statSync(__path.join(abs, name)).isDirectory() : e.isDirectory();
      return isDir || !__fs.existsSync(__path.join(__ROOT, 'v2', r));
    });
  };
}
"""

def patch(path, pairs, view=False):
    s = open(path, encoding='utf8').read()
    for a, b in pairs:
        n = s.count(a)
        if n != 1: sys.exit(f'{path}: anchor found {n} times: {a[:80]!r}')
        s = s.replace(a, b)
    if view:
        anchor = "process.env.TDW_LAYOUT_DEFAULT = 'v2';"
        i = s.index(anchor); j = s.index('\n', i)
        s = s[:j + 1] + VIEW_JS.lstrip('\n') + s[j + 1:]
    open(path, 'w', encoding='utf8').write(s)
    print('patched', path)

B40 = 'scripts/b40_worklist_shell_bench_v2.js'
patch(B40, [
    # C17: the manifest is shared (main's, start_url /vendor/rooms); in the v2 tree /vendor/rooms resolves to Today.
    ("  if (man.start_url !== '/vendor/today') return 'manifest start_url is ' + man.start_url + ', expected /vendor/today';\n",
     "  // DESIGN-1 · THE LAYOUT SWITCH (by label): the manifest is SHARED by both layouts and stays main's (/vendor/rooms), so\n"
     "  // the classic tree is untouched; in the v2 tree that address is a redirect to Today, asserted here, so an installed\n"
     "  // app still opens on Today.\n"
     "  if (man.start_url !== '/vendor/today') {\n"
     "    if (man.start_url !== '/vendor/rooms') return 'manifest start_url is ' + man.start_url + ', expected /vendor/rooms (shared) resolving to /vendor/today';\n"
     "    if (!/(?:redirect|replace)\\('\\/vendor\\/today'\\)/.test(strip(read('v2/app/vendor/(shell)/rooms/page.tsx')))) return 'the manifest start /vendor/rooms does not resolve to Today in the v2 tree';\n"
     "  }\n"),
    ("  if (!/if \\(hasVendorSession\\) return '\\/vendor\\/today';/.test(door)) return 'the front door does not send a vendor to Today';",
     "  // DESIGN-1 · THE LAYOUT SWITCH (by label): the front door is shared too (main's, to /vendor/rooms), which is Today in v2.\n"
     "  if (!/if \\(hasVendorSession\\) return '\\/vendor\\/(today|rooms)';/.test(door)) return 'the front door does not send a vendor to Today';"),
    # the walks see the v2 roots too (the view above leaves the classic twins out)
    ("  walk('app'); walk('components');\n  return seen;", "  walk('app'); walk('components'); walk('v2/app'); walk('v2/components');\n  return seen;"),
    ("  walk('app'); walk('components');\n  if (declarers.length", "  walk('app'); walk('components'); walk('v2/app'); walk('v2/components');\n  if (declarers.length"),
    ("  walk('lib');\n  if (hits.length)", "  walk('lib'); walk('v2/lib');\n  if (hits.length)"),
    ("  walk('app'); walk('components'); walk('lib');\n  const undeclared", "  walk('app'); walk('components'); walk('lib'); walk('v2/app'); walk('v2/components'); walk('v2/lib');\n  const undeclared"),
    ("  walk('app'); walk('components');\n  if (!consumers.length)", "  walk('app'); walk('components'); walk('v2/app'); walk('v2/components');\n  if (!consumers.length)"),
    ("  const anyReader = ['app', 'components', 'lib'].some(", "  const anyReader = ['app', 'components', 'lib', 'v2/app', 'v2/components', 'v2/lib'].some("),
    # C31: More is a shell address in the v2 tree (the coin), like the seats
    ("  for (const seat of ['/vendor/rooms', '/vendor/today', '/vendor']) declared.add(seat);",
     "  for (const seat of ['/vendor/rooms', '/vendor/today', '/vendor']) declared.add(seat);\n"
     "  // DESIGN-1 · STAGE 3 (by label): More, behind the profile coin, is a shell address that is not a registry room (MORE_HREF).\n"
     "  if (/export const MORE_HREF = '\\/vendor\\/more'/.test(strip(read('v2/lib/worklist/tabs.ts')))) declared.add('/vendor/more');"),
    # C35: the directory moved to More (stage 3), and the Add control with it
    ("  const mounted = ['v2/app/vendor/(shell)/rooms/page.tsx'];",
     "  // DESIGN-1 · STAGE 3 (by label): the directory is More now (/vendor/more); /vendor/rooms only redirects to Today.\n"
     "  const mounted = ['v2/app/vendor/(shell)/more/page.tsx'];"),
], view=True)

B42 = 'scripts/b42_g11_wedding_pages_bench_v2.js'
patch(B42, [
    ("  for (const d of ['app', 'lib', 'components']) walk(P(d));",
     "  for (const d of ['app', 'lib', 'components', 'v2/app', 'v2/lib', 'v2/components']) walk(P(d));"),
], view=True)

B59 = 'scripts/b59_seven_ink_census_v2.js'
patch(B59, [
    ("  'v2/app/vendor/(shell)', 'components/vendor', 'components/worklist', 'lib/worklist',",
     "  'v2/app/vendor/(shell)', 'components/vendor', 'components/worklist', 'lib/worklist',\n"
     "  // DESIGN-1 · THE LAYOUT SWITCH (by label): the same scope in the v2 view (the classic twins are left out above)\n"
     "  'v2/components/vendor', 'v2/components/worklist', 'v2/lib/worklist',"),
], view=True)

B80 = 'scripts/b80_lc2_p1_shell_bench_v2.js'
s = open(B80, encoding='utf8').read()
s = s.replace("baseFile(F.addsheet)", "baseFile(F.addsheet.replace(/^v2\\//, ''))")
open(B80, 'w', encoding='utf8').write(s)
patch(B80, [
    ("      './_base': { getJson,", "      // DESIGN-1 · THE LAYOUT SWITCH: the v2 copy reaches the shared _base by its @/ path\n      '@/lib/vendor/api/_base': { getJson, postJson: async () => ({}), patchJson: async () => ({}), deleteJson: async () => ({}), API_BASE: '', getAuthHeader: () => ({}), handleResponse: async () => ({}) },\n      './_base': { getJson,"),
    ("addSheetUntouched: addsheetBase !== null && lookFree(addsheet) === lookFree(designWords(addsheetBase)),",
     "// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy imports its v2 twins by @/v2/, the base by @/ (the same modules)\n"
     "    addSheetUntouched: addsheetBase !== null && lookFree(addsheet).split('@/v2/').join('@/') === lookFree(designWords(addsheetBase)),"),
])

B122 = 'scripts/b122_ce45_home_shelves_bench_v2.js'
patch(B122, [
    ("spawnSync('git', ['ls-files', 'app', 'components', 'lib'], { cwd: ROOT, encoding: 'utf8' }).stdout.split('\\n').filter((f) => ",
     "spawnSync('git', ['ls-files', 'app', 'components', 'lib', 'v2/app', 'v2/components', 'v2/lib'], { cwd: ROOT, encoding: 'utf8' }).stdout.split('\\n')\n"
     "      // DESIGN-1 · THE LAYOUT SWITCH (by label): the v2 view of the tree: a shared file with a v2/ twin, and the app/v2 shims, are not in it\n"
     "      .filter((f) => !f.startsWith('app/v2/') && !(!f.startsWith('v2/') && fs.existsSync(P('v2/' + f))))\n"
     "      .filter((f) => "),
])

# the design's own Home bench carries the d1_ prefix (it exists only for the v2 tree)
if os.path.exists('scripts/b146_design1_home_bench_v2.js'):
    os.replace('scripts/b146_design1_home_bench_v2.js', 'scripts/d1_home_bench_v2.js')
    print('renamed b146_design1_home_bench_v2.js -> d1_home_bench_v2.js')

# the v2 copy of a .proof.ts needs its own wrapper, or the floor refuses to start (a .proof.ts no wrapper reaches)
W = 'scripts/run-roster-mint-proof.sh'
if os.path.exists('scripts/rosterMint_v2.proof.ts'):
    w = open(W, encoding='utf8').read()
    w = w.replace('# TDW_04.5 P4 — compile', '# DESIGN-1 · THE LAYOUT SWITCH: the v2 copy of run-roster-mint-proof.sh, for rosterMint_v2.proof.ts.\n# TDW_04.5 P4 — compile')
    w = w.replace('scripts/rosterMint.proof.ts', 'scripts/rosterMint_v2.proof.ts').replace('scripts/rosterMint.proof.js', 'scripts/rosterMint_v2.proof.js')
    open('scripts/run-roster-mint-v2-proof.sh', 'w', encoding='utf8').write(w)
    os.chmod('scripts/run-roster-mint-v2-proof.sh', os.stat(W).st_mode)
    print('wrapper scripts/run-roster-mint-v2-proof.sh')

# b122's More scenes: in the v2 tree More has its own address; /vendor/rooms only redirects to Today
PR = 'scripts/lib/b122_home_shelves_probe_v2.mjs'
s = open(PR, encoding='utf8').read()
n = s.count("await p.goto(`http://localhost:${PORT}/vendor/rooms`")
if n != 2: sys.exit(f'{PR}: expected two /vendor/rooms scenes, found {n}')
s = s.replace("await p.goto(`http://localhost:${PORT}/vendor/rooms`", "await p.goto(`http://localhost:${PORT}/vendor/more`")
s = s.replace("// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy", "// DESIGN-1 · THE LAYOUT SWITCH (by label): the More scenes open /vendor/more, More's address in the v2 tree.\n// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy", 1)
open(PR, 'w', encoding='utf8').write(s); print('patched', PR)
patch('scripts/b122_ce45_home_shelves_bench_v2.js', [
    ("c.coin.href === '/vendor/rooms' && c.coin.current === 'page')", "c.coin.href === '/vendor/more' && c.coin.current === 'page')   /* DESIGN-1 · THE LAYOUT SWITCH (by label): More's v2 address */"),
])
