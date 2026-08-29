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
      const widths = primary.has(id) ? [374, 390] : [374];
      for (const w of widths) {
        for (const mode of ['dark', 'light']) {
          const page = await browser.newPage();
          await page.setViewport({ width: w, height: 844, deviceScaleFactor: 2 });
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
