#!/usr/bin/env python3
# DESIGN-1 · THE LAYOUT SWITCH · the benches split. Every bench the stages amended keeps main's original at its own path
# (it now proves the classic tree, which is main's) and gains a _v2 copy that proves the v2 tree: its source reads point at
# v2/ for every file of the v2 set, its probes are the _v2 probes, and its dev servers serve the v2 tree
# (TDW_LAYOUT_DEFAULT=v2, the bench seam middleware.ts reads when no cookie is set).
import json, os, re, subprocess, sys
root, closure_json = sys.argv[1], sys.argv[2]
os.chdir(root)
v2set = set(json.load(open(closure_json))['v2set'])
v2set |= {'app/vendor/(shell)/more/page.tsx'}
SRC_REV = sys.argv[3] if len(sys.argv) > 3 else 'HEAD'
changed = [l.split('\t') for l in subprocess.run(['git', 'diff', '--name-status', 'main..' + SRC_REV, '--', 'scripts'], capture_output=True, text=True).stdout.splitlines()]
SKIP_V2 = {'scripts/b20_a3_assistance_pwa.proof.mjs'}   # the front door is main's again: main's bench stands alone

def v2name(p):
    d, f = os.path.split(p)
    m = re.match(r'^(.*?)(\.proof\.(?:mjs|ts|js)|\.mjs|\.js|\.ts)$', f)
    return os.path.join(d, m.group(1) + '_v2' + m.group(2))

probes = {p: v2name(p) for st, p in changed if p.startswith('scripts/lib/')}
paths = sorted(v2set, key=len, reverse=True)
def convert(text):
    # probes first, by file name
    for a, b in probes.items():
        text = text.replace(os.path.basename(a), os.path.basename(b))
    # every file of the v2 set, as it is spelled in the bench, gains the v2/ root (never twice)
    for pth in paths:
        text = re.sub(r"(?<![\w/.-])" + re.escape(pth), 'v2/' + pth, text)
    # the vendor route tree as a directory ('app/vendor/(shell)', 'app/vendor/(legacy)/...') is the v2 one
    text = re.sub(r"(['\"`(])app/vendor/", r"\1v2/app/vendor/", text)
    for pth in paths:
        noext = re.sub(r'\.(tsx?|jsx?|mjs)$', '', pth)
        text = text.replace('@/' + noext, '@/v2/' + noext)
        esc = noext.replace('/', '\\/')
        text = text.replace('@\\/' + esc, '@\\/v2\\/' + esc)
        # relative specifiers from scripts/ and scripts/lib/ ('../lib/x', '../../lib/x') reach the v2 copy too
        for up in ('../', '../../'):
            for q in ("'", '"'):
                text = text.replace(q + up + noext + q, q + up + 'v2/' + noext + q)
    text = text.replace('v2/v2/', 'v2/').replace('v2\\/v2\\/', 'v2\\/')
    return text

HEADER_JS = "process.env.TDW_LAYOUT_DEFAULT = 'v2';   // DESIGN-1 · THE LAYOUT SWITCH: this copy proves the v2 tree (middleware.ts serves it with no cookie)\n"
made = []
for st, p in changed:
    if p in SKIP_V2: continue
    src = subprocess.run(['git', 'show', SRC_REV + ':' + p], capture_output=True, text=True, check=True).stdout
    out = convert(src)
    note = ("// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy of " + os.path.basename(p) + ". The original at its own path proves the classic\n"
            "// tree (main's, unchanged); this one proves the redesign in v2/, with its stage 1-3 amendments by label.\n")
    lines = out.split('\n')
    i = 0
    if lines and lines[0].startswith('#!'): i = 1
    while i < len(lines) and (lines[i].strip() in ("'use strict';", '"use strict";')): i += 1
    if not p.startswith('scripts/lib/'):
        lines.insert(i, note + HEADER_JS.rstrip('\n'))
    else:
        lines.insert(i, note.rstrip('\n'))
    dst = v2name(p)
    open(dst, 'w', encoding='utf8').write('\n'.join(lines))
    if os.path.exists(p): os.chmod(dst, os.stat(p).st_mode)
    made.append(dst)
    if st == 'A' and os.path.exists(p): os.remove(p)
print('v2 copies:', len(made)); print('\n'.join(made))
