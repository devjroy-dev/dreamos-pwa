# scripts/fixtures/site/make_fixtures.py
# WEB-5 (CE-46, Q8): sized derivatives of the founder's sixteen free-to-use Pexels
# photographs, for the site renderer's mock mode and benches ONLY. R-46.16: none of
# these ever reaches a live public page; the mock loader refuses them in a production
# build and the no-example cell proves it. Provenance: SOURCE.txt beside this file.
# The originals are not in the repo (40.8 MB). Run bare, this prints what it would
# write and exits 0 (A-46.1). With --src <dir holding the sixteen jpgs> it rewrites
# the derivatives beside this file and fixtures.json.
# Keys and focal points are the prototypes' own (WEB-3 build.py POS), matched to the
# files against the live Couture page's IMG table by a 16x16 signature (16 of 16, 1:1).
import sys, os, json, io, base64
KEYS = {
 'arch':'pexels-alex-ivanov-773258579-29231349.jpg','kundan':'pexels-ankunijjar-31772511.jpg',
 'mandap-sea':'pexels-aumgraphy-39797459.jpg','pink-stair':'pexels-bertellifotografia-17023070.jpg',
 'green-necklace':'pexels-bharatkuiper-36519701.jpg','pavilion':'pexels-gursher-gill-63702010-13661802.jpg',
 'veil-hands':'pexels-gursher-gill-63702010-38727797.jpg','lake-mandap':'pexels-i-slam-abruev-2157269750-38628096.jpg',
 'sikh-couple':'pexels-ids-fotowale-1416063-17000471.jpg','kaleere':'pexels-khaas-photographer-3700378-37476811.jpg',
 'mehendi':'pexels-qaarif-12426868.jpg','tikka':'pexels-rani-sahu-9157351.jpg',
 'staircase':'pexels-smit-mehta-2163184988-38758729.jpg','sherwani':'pexels-th3warhawk-10597443.jpg',
 'poolside':'pexels-thevisionaryvows-33485973.jpg','pastel-saree':'pexels-thrissurkaranphotography-20563589.jpg'}
POS = {'green-necklace':'50% 26%','pastel-saree':'50% 28%','veil-hands':'50% 38%','tikka':'38% 35%','kaleere':'50% 45%',
 'kundan':'50% 50%','mehendi':'50% 50%','arch':'50% 62%','staircase':'45% 50%','sherwani':'50% 40%','pavilion':'58% 55%',
 'sikh-couple':'32% 45%','pink-stair':'62% 50%','lake-mandap':'50% 55%','poolside':'50% 55%','mandap-sea':'50% 45%'}
# The six styles' covers (build.py HERO) also get 1600, AVIF only, to keep the set near 4 MB;
# every photograph gets 480 and 960 in AVIF and WebP.
HERO = {'couture':'green-necklace','noir':'tikka','heritage':'arch','aurora':'pink-stair','gallery':'staircase','riviera':'lake-mandap'}
WIDTHS = [480, 960]; BIG = [1600]
HERE = os.path.dirname(os.path.abspath(__file__))
def plan():
    for k in KEYS:
        for w in WIDTHS + (BIG if k in HERO.values() else []):
            for ext in (('avif',) if w in BIG else ('avif', 'webp')): yield k, w, ext
if '--src' not in sys.argv:
    print(f'make_fixtures: bare run, nothing written. With --src DIR it writes {sum(1 for _ in plan())} files and fixtures.json into {HERE}.')
    sys.exit(0)
from PIL import Image
src = sys.argv[sys.argv.index('--src') + 1]
meta = {}
for k, f in KEYS.items():
    im = Image.open(os.path.join(src, f)).convert('RGB')
    lq = im.copy(); lq.thumbnail((24, 24)); b = io.BytesIO(); lq.save(b, 'WEBP', quality=40)
    meta[k] = {'w': im.width, 'h': im.height, 'pos': POS[k], 'widths': [], 'formats': {},
               'lq': 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()}
for k, w, ext in plan():
    im = Image.open(os.path.join(src, KEYS[k])).convert('RGB')
    r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    out = os.path.join(HERE, f'{k}-{w}.{ext}')
    r.save(out, 'AVIF', quality=50, speed=6) if ext == 'avif' else r.save(out, 'WEBP', quality=72, method=6)
    if w not in meta[k]['widths']: meta[k]['widths'].append(w)
    meta[k]['formats'].setdefault(str(w), []).append(ext)
json.dump(meta, open(os.path.join(HERE, 'fixtures.json'), 'w'), indent=1, sort_keys=True)
print('make_fixtures: wrote', sum(1 for _ in plan()), 'files and fixtures.json')
