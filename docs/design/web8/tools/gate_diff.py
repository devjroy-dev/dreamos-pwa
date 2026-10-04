# WEB-8 gate: compare prototype and server frames, pixel for pixel. python3 diff.py <dir> <style> <width>
import sys, json, glob, os
from PIL import Image, ImageChops
import numpy as np
d, st, W = sys.argv[1:4]
P = sorted(glob.glob(f'{d}/proto_{st}_{W}_*.png')); S = sorted(glob.glob(f'{d}/server_{st}_{W}_*.png'))
pj = json.load(open(f'{d}/proto_{st}_{W}.json')); sj = json.load(open(f'{d}/server_{st}_{W}.json'))
print(f'{st} {W}: heights proto {pj["scrollHeight"]} server {sj["scrollHeight"]}; frames {len(P)} / {len(S)}')
tot = 0; tout = 0; rows = []
PAD = 4
def allowed(i, shape):
    m = np.zeros(shape, bool); names = set()
    for side in (pj, sj):
        rr = side['rules'][i] if i < len(side.get('rules', [])) else []
        hd = [r for r in rr if r['name'] == 'header']
        for r in rr:
            if r['name'] == 'header': continue
            m[max(0, r['y0'] - PAD):r['y1'] + PAD, max(0, r['x0'] - PAD):r['x1'] + PAD] = True; names.add(r['name'])
            for h in hd:   # CE-47 ruling 1: under the see-through header only the region's own rectangle is allowed, never the header band
                if r['y0'] < h['y1'] and r['y1'] > h['y0']:
                    # the header blurs what passes under it, so the region's rectangle is seen spread by the blur's reach (3 x its radius), and only inside the header
                    g = int(round(3 * h.get('blur', 0) * 2))
                    m[max(h['y0'], r['y0'] - g):min(h['y1'], r['y1'] + g), max(0, r['x0'] - g):r['x1'] + g] = True; names.add(r['name'] + ' through the header')
    return m, names
for i, (p, s) in enumerate(zip(P, S)):
    a = Image.open(p).convert('RGB'); b = Image.open(s).convert('RGB')
    if a.size != b.size: print(' frame', i, 'sizes differ', a.size, b.size); continue
    x = np.any(np.asarray(a) != np.asarray(b), axis=2); n = int(x.sum()); tot += n
    al, names = allowed(i, x.shape); outside = int((x & ~al).sum()); tout += outside
    if n: rows.append((i, n, outside, ', '.join(sorted(names))))
    box = None
    if n:
        ys, xs = np.where(x); box = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
        m = Image.fromarray((x * 255).astype('uint8')); out = Image.new('RGB', (a.width * 3, a.height))
        out.paste(a, (0, 0)); out.paste(b, (a.width, 0)); red = Image.new('RGB', a.size, (255, 0, 0)); base = Image.blend(b, Image.new('RGB', a.size, (255, 255, 255)), 0.6)
        out.paste(Image.composite(red, base, m), (a.width * 2, 0)); out.save(f'{d}/diff_{st}_{W}_{i:02d}.png')
    print(f' frame {i:02d}: {n} px differ', box or '', (f'OUTSIDE the rulings: {outside}' if n else ''))
print(f'{st} {W}: TOTAL {tot}; OUTSIDE the named rulings {tout}')
json.dump({'style': st, 'width': int(W), 'frames': len(P), 'height_proto': pj['scrollHeight'], 'height_server': sj['scrollHeight'], 'differing': tot, 'outside': tout, 'rows': rows}, open(f'{d}/result_{st}_{W}.json', 'w'))
