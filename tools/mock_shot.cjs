#!/usr/bin/env node
'use strict';
// tools/mock_shot.cjs — THE MOCK SHOT ARM.  D-1, granted at CE-39 (R-2).
//
//   node tools/mock_shot.cjs docs/mocks/today-working-mock.html
//   node tools/mock_shot.cjs docs/mocks                       (every mock in the folder)
//
// ── WHY THIS IS NOT wl_render.cjs ───────────────────────────────────────────
// The render arm audits a RUNNING DEPLOY. It takes a base URL as argv[2], mints a real
// vendor token before a browser launches, and asserts computed facts against served
// bytes. Three of those properties make it structurally unable to shoot a static mock:
//
//   · it has no file:// path — a mock has no server and never will;
//   · its VIEW is 390x844, one width, hard-coded, because that is the deploy's audit
//     width and D-1 captures at 374 primary with 390 as the second frame (R-3);
//   · with no token it prints SYNTHETIC and REDS by design, which is correct for a
//     deploy audit and meaningless for a drawing.
//
// Widening wl_render to also mean "screenshot an arbitrary file at an arbitrary width"
// would have given the estate's one instrument for computed facts a second job, and the
// second job is always the one that erodes the first. Two files, one job each.
//
// ── THE BROWSER, AND WHY IT IS THE SAME PAIR ────────────────────────────────
// Playwright's CDN and Google's storage host are both denied at this estate's egress and
// no system chromium exists in the build container. @sparticuz/chromium ships the binary
// INSIDE its npm tarball and npm is allow-listed. That dependency pair is already in this
// repo for wl_render; this file reuses it rather than adding a third way to get a browser.
//
// ── THE FACES ARE IN THE FILE, NOT ON THE NETWORK ───────────────────────────
// Each mock embeds Cormorant Garamond 500 and DM Sans 400/500 as data URIs. That is not a
// convenience: this container reaches no font host, so a linked face would silently
// composite in DejaVu and every capture would be a picture of a font nobody ships. It
// also means the founder can open the HTML on his phone with no signal and see the truth.
// The one thing a PNG from this arm still cannot prove is the DEVICE's own rasteriser.
//
// ── WHAT IT SHOOTS ──────────────────────────────────────────────────────────
// Every frame in the file, at 374, in both modes. The frames each mock names as PRIMARY
// are shot again at 390 (R-3). Solo mode is driven by the hash the mock's own script
// reads: #solo=<frame>&mode=<dark|light>. deviceScaleFactor 2, as the render arm uses, so
// a capture opened at 100% on a desktop is the same physical size as the phone's glass.
//
// ── THE PAPER OPT-IN · F-39.57's CURE, RULED BY THE CHAIR ───────────────────
// S2 draws an A4 DOCUMENT, and the three sentences above are all wrong for paper: 374 is
// a phone, 844 is a phone, and a sheet of paper has no dark mode. The arm therefore reads
// THREE MORE ATTRIBUTES OFF THE FRAME, in `data-frame`'s own spirit — the mock declares
// its own geometry, exactly as it already declares its own frame ids, so no list of
// per-file exceptions lives beside the arm to go stale:
//
//   data-shot-width="794"  data-shot-height="1123"  data-shot-modes="paper"
//
// EVERY DEFAULT IS THE OLD BEHAVIOUR VERBATIM. A frame that declares none of the three is
// shot at [374, 390 if primary] x 844 in dark and light, which is what the eighteen— the
// TWENTY-SIX (see below) existing frames do. `data-shot-width` OVERRIDES THE PRIMARY RULE
// as well as the width: paper has one size, and shooting A4 twice at two widths would be
// two pictures of the same sheet. The mode string is still handed to the hash, so a mock
// that names a mode its script does not know simply renders its default — the arm does not
// validate a vocabulary it does not own.
//
// The filename shape `stem__id__mode__w.png` DOES NOT MOVE, so every existing capture
// keeps its name and its bytes. That is asserted, not asserted-ish: see
// `scripts/tdw_f3957_shot_arm.proof.mjs`, which shoots the four legacy mocks before and
// after this change and compares 78 shas.
//
// COUNT, DISCLOSED NOT PADDED: the chair's ruling said "the existing eighteen frames".
// The tree at fdb230b holds TWENTY-SIX frames across five discovered `-mock.html` files
// (books 2 · studio-rooms 7 · studio-sheets 7 · today-working 10 · today-stature 0), which
// shoot 78 captures — the exact number of PNGs committed beside them. The cell asserts 26
// and 78, because those are the numbers the tree has.
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;

const ROOT = path.resolve(__dirname, '..');
const arg = process.argv[2] || 'docs/mocks';
const target = path.resolve(ROOT, arg);

function mocksIn(p) {
  if (fs.statSync(p).isFile()) return [p];
  return fs.readdirSync(p).filter((f) => f.endsWith('-mock.html')).map((f) => path.join(p, f));
}

// The frame ids and the primary set are READ OUT OF THE FILE, never passed in. A list of
// frame names maintained beside the mock is a second home for the mock's own structure and
// would go stale the first time a frame is added.
function framesOf(html) {
  const ids = [];
  const re = /data-frame="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) ids.push(m[1]);
  return ids;
}
// The paper opt-in, read off the SAME element that carries `data-frame`. The window is
// the 400 characters following the id rather than a DOM parse, because this arm has never
// had a parser and adding one to read three attributes would be a dependency bought for a
// regex's job. Attributes may appear in any order and any of the three may be absent.
function shotOf(html, id) {
  const at = html.indexOf('data-frame="' + id + '"');
  if (at < 0) return {};
  const win = html.slice(at, at + 400);
  const pick = (name) => {
    const m = new RegExp('data-shot-' + name + '="([^"]+)"').exec(win);
    return m ? m[1] : null;
  };
  const w = pick('width');
  const h = pick('height');
  const modes = pick('modes');
  return {
    width:  w ? Number(w) : null,
    height: h ? Number(h) : null,
    modes:  modes ? modes.split(/[ ,]+/).filter(Boolean) : null,
  };
}
// PRIMARY = the first frame of each shape, derived from the id's own shape prefix
// (A1-, A2-, B1-, ...). The mocks name their shapes in the id for exactly this reason.
function primaryOf(ids) {
  const seen = new Set();
  return ids.filter((id) => {
    const shape = id.split('-')[0];
    if (seen.has(shape)) return false;
    seen.add(shape);
    return true;
  });
}

(async () => {
  const files = mocksIn(target);
  if (files.length === 0) { console.log('NO MOCKS FOUND at ' + target); process.exit(1); }

  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  });
  let shot = 0;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const ids = framesOf(html);
    const primary = new Set(primaryOf(ids));
    const dir = path.dirname(file);
    const stem = path.basename(file, '.html');
    console.log('--- ' + path.relative(ROOT, file) + ' \u2014 ' + ids.length + ' frames ---');
    for (const id of ids) {
      const geom = shotOf(html, id);
      // A DECLARED WIDTH IS THE WHOLE ANSWER — it overrides the primary rule too, because
      // a sheet of paper does not have a second width to be shot at.
      const widths = geom.width ? [geom.width] : (primary.has(id) ? [374, 390] : [374]);
      const height = geom.height || 844;
      const modes  = geom.modes  || ['dark', 'light'];
      for (const w of widths) {
        for (const mode of modes) {
          const page = await browser.newPage();
          await page.setViewport({ width: w, height, deviceScaleFactor: 2 });
          await page.goto('file://' + file + '#solo=' + id + '&mode=' + mode, { waitUntil: 'load' });
          // The embedded faces are font-display:block, so a capture taken before they
          // decode paints nothing where the type goes. Waited for explicitly rather than
          // slept on: a sleep that is long enough today is a flake tomorrow.
          await page.evaluate(() => document.fonts.ready);
          const out = path.join(dir, stem + '__' + id + '__' + mode + '__' + w + '.png');
          await page.screenshot({ path: out });
          await page.close();
          shot++;
          console.log('  ' + path.basename(out));
        }
      }
    }
  }
  await browser.close();
  console.log('SHOT ' + shot + ' frames.');
})().catch((e) => { console.error('SHOT FAILED: ' + e.message); process.exit(1); });
