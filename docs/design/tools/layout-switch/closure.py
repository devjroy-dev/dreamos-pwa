#!/usr/bin/env python3
# The v2 set: every source module stages 1-3 changed, plus every module that imports one of them (transitively),
# within app/ components/ lib/ hooks/. Prints counts; writes the lists for the restructure.
import os, re, subprocess, sys, json
root = sys.argv[1]; base = sys.argv[2]; out = sys.argv[3]
os.chdir(root)
changed = subprocess.run(['git', 'diff', '--name-only', base + '..HEAD'], capture_output=True, text=True).stdout.split()
SRC_ROOTS = ('app/', 'components/', 'lib/', 'hooks/')
EXT = ('.ts', '.tsx', '.js', '.jsx', '.mjs')
def is_src(p): return p.startswith(SRC_ROOTS) and p.endswith(EXT)
files = []
for r in SRC_ROOTS:
    for d, _, fs in os.walk(r):
        for f in fs:
            p = os.path.join(d, f)
            if p.endswith(EXT): files.append(p)
fileset = set(files)
IMP = re.compile(r"""(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]""")
def resolve(frm, spec):
    if spec.startswith('@/'): cand = spec[2:]
    elif spec.startswith('.'): cand = os.path.normpath(os.path.join(os.path.dirname(frm), spec))
    else: return None
    for c in [cand] + [cand + e for e in EXT] + [os.path.join(cand, 'index' + e) for e in EXT]:
        if c in fileset: return c
    return None
deps = {}
for f in files:
    try: s = open(f, encoding='utf8').read()
    except Exception: continue
    ds = set()
    for m in IMP.finditer(s):
        spec = next(g for g in m.groups() if g)
        r = resolve(f, spec)
        if r: ds.add(r)
    deps[f] = ds
rev = {}
for f, ds in deps.items():
    for d in ds: rev.setdefault(d, set()).add(f)
changed_src = [p for p in changed if is_src(p) and os.path.exists(p)]
deleted_src = [p for p in changed if is_src(p) and not os.path.exists(p)]
closure = set(changed_src)
stack = list(changed_src)
while stack:
    x = stack.pop()
    for y in rev.get(x, ()):
        if y not in closure: closure.add(y); stack.append(y)
# every vendor route file is in the v2 tree whether or not it imports a changed module (the rewrite sends all of /vendor there)
vendor_routes = [f for f in files if f.startswith('app/vendor/')]
non_vendor_in_closure = sorted(f for f in closure if not f.startswith(('app/vendor/', 'components/', 'lib/', 'hooks/')))
json.dump({'changed_src': sorted(changed_src), 'deleted_src': sorted(deleted_src), 'closure': sorted(closure), 'vendor_routes': sorted(vendor_routes)}, open(out, 'w'), indent=1)
by = {}
for f in closure: by[f.split('/')[0]] = by.get(f.split('/')[0], 0) + 1
print('changed source files:', len(changed_src), '· deleted:', len(deleted_src))
print('closure (changed + their importers):', len(closure), by)
print('vendor route-tree files:', len(vendor_routes))
print('closure files outside app/vendor that are app routes:', [f for f in closure if f.startswith('app/') and not f.startswith('app/vendor/')][:40])

# the v2 set proper: reachable (forward) from the vendor route tree AND in the backward closure of a changed file
fwd = set(vendor_routes); st = list(vendor_routes)
while st:
    x = st.pop()
    for y in deps.get(x, ()):
        if y not in fwd: fwd.add(y); st.append(y)
v2set = sorted((fwd & closure) | set(vendor_routes))
d = json.load(open(out)); d['v2set'] = v2set; d['changed_outside_vendor_reach'] = sorted(set(changed_src) - fwd)
json.dump(d, open(out, 'w'), indent=1)
by = {}
for f in v2set: by[f.split('/')[0]] = by.get(f.split('/')[0], 0) + 1
print('v2 set (vendor-reachable, touched by a change, plus every vendor route file):', len(v2set), by)
print('changed files the vendor tree does not reach:', d['changed_outside_vendor_reach'])
