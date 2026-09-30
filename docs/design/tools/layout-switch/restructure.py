#!/usr/bin/env python3
# DESIGN-1 · THE LAYOUT SWITCH · the restructure. Run in the stage-3 tree at its HEAD commit.
#   1. every file of the v2 set (the vendor route tree + every module it reaches that a stage changed or that imports one)
#      is copied, as it stands at HEAD, to v2/<path>, its imports pointed at the v2 copies where one exists and at the
#      shared originals otherwise;
#   2. every route file under app/vendor gets a shim at app/v2/vendor/<same> re-exporting the v2 copy;
#   3. every source file the stages changed is restored to main (added files leave their original place: they live in v2/).
import json, os, re, subprocess, sys
root, closure_json = sys.argv[1], sys.argv[2]
os.chdir(root)
C = json.load(open(closure_json))
v2set = set(C['v2set'])
EXT = ('.ts', '.tsx', '.js', '.jsx', '.mjs')
ROUTE_FILES = ('page.tsx', 'layout.tsx', 'route.ts', 'loading.tsx', 'error.tsx', 'not-found.tsx', 'template.tsx', 'default.tsx')

allfiles = set()
for r in ('app/', 'components/', 'lib/', 'hooks/'):
    for d, _, fs in os.walk(r):
        for f in fs:
            p = os.path.join(d, f)
            if p.endswith(EXT): allfiles.add(p)

def resolve(frm, spec):
    if spec.startswith('@/'): cand = spec[2:]
    elif spec.startswith('.'): cand = os.path.normpath(os.path.join(os.path.dirname(frm), spec))
    else: return None
    for c in [cand] + [cand + e for e in EXT] + [os.path.join(cand, 'index' + e) for e in EXT]:
        if c in allfiles: return c
    return None

def strip_ext(p):
    for e in EXT:
        if p.endswith(e): p = p[:-len(e)]; break
    if p.endswith('/index'): p = p[:-len('/index')]
    return p

SPEC = re.compile(r"""((?:from\s*|import\s*\(\s*|require\(\s*|import\s+))(['"])([^'"\n]+)\2""")
def rewrite(frm, text):
    def sub(m):
        lead, q, spec = m.group(1), m.group(2), m.group(3)
        tgt = resolve(frm, spec)
        if not tgt: return m.group(0)
        if tgt in v2set:
            if spec.startswith('@/'): return f"{lead}{q}@/v2/{spec[2:]}{q}"
            return m.group(0)                      # relative, and the target moved with it
        if spec.startswith('.'): return f"{lead}{q}@/{strip_ext(tgt)}{q}"   # relative to a shared original
        return m.group(0)
    return SPEC.sub(sub, text)

made = 0
for f in sorted(v2set):
    src = open(f, encoding='utf8').read()
    dst = os.path.join('v2', f)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf8').write(rewrite(f, src))
    made += 1

shims = 0
for f in sorted(v2set):
    if f.startswith('app/vendor/') and os.path.basename(f) in ROUTE_FILES:
        rel = f[len('app/vendor/'):]
        dst = os.path.join('app/v2/vendor', rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        open(dst, 'w', encoding='utf8').write(
            "// DESIGN-1 · THE LAYOUT SWITCH: the v2 route tree. middleware.ts rewrites /vendor/* here for a vendor whose\n"
            "// layout is v2; the page itself lives in v2/ (outside app/, components/ and lib/), a copy of the redesign.\n"
            f"export {{ default }} from '@/v2/{strip_ext(f)}';\n")
        shims += 1

changed = subprocess.run(['git', 'diff', '--name-only', 'main..HEAD'], capture_output=True, text=True).stdout.split()
restored, removed = [], []
for p in changed:
    if p.startswith(('docs/', 'scripts/')) or p.startswith('v2/'): continue
    inmain = subprocess.run(['git', 'cat-file', '-e', f'main:{p}'], capture_output=True).returncode == 0
    if inmain:
        subprocess.run(['git', 'checkout', 'main', '--', p], check=True); restored.append(p)
    elif os.path.exists(p):
        os.remove(p); removed.append(p)
print(f'v2 copies: {made} · route shims: {shims} · restored to main: {len(restored)} · removed from the shared tree (they live in v2/): {len(removed)}')
print('removed:', removed)
