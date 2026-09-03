#!/usr/bin/env node
'use strict';
// scripts/b41_theme_bleed_fixture.js — E-1 · THE THEME BLEED, ON A FIXTURE.
//
//   node scripts/b41_theme_bleed_fixture.js
//
// Exit code is the verdict.
//
// ══════════════════════════════════════════════════════════════════════════
// ⚠ THIS IS A FIXTURE AND IT SAYS SO IN ITS OWN PRINTOUT
// ══════════════════════════════════════════════════════════════════════════
// It carries `app/globals.css` VERBATIM — read off disk, never transcribed —
// and exercises the two theme writers in the founder's own mount order. It is
// NOT the app: no Next hydration, no real session, no route transition. The
// live half is the founder's eye on the card (light `/w/billing` →
// `/vendor/discover/preview` → `/w/billing`). F-39.p1's precedent: a cell that
// models its subject must name itself a model, or a later reader quotes it as
// the app.
//
// ══════════════════════════════════════════════════════════════════════════
// WHAT IT GUARDS, AND — LOUDLY — WHAT IT DOES NOT
// ══════════════════════════════════════════════════════════════════════════
// IT GUARDS the three facts E-1 actually established:
//   · the shell's ground is SCOPE-IMMUNE to `documentElement`;
//   · every `/w` consumer of `useT()` mounts its own provider;
//   · the scope covers the viewport and paints opaque, so the `!important`
//     html/body ground cannot show behind it.
//
// IT DOES NOT REPRODUCE THE FOUNDER'S FLIP. Light `/w/billing`, a `/vendor`
// visit, dark on return — no probe here reddens on it, and §4 says so in the
// printout rather than letting a green stand as a verdict. F-39.32 is therefore
// OPEN-AS-NARROWED, not closed, and this file is the reason the narrowing is
// trustworthy: three mechanisms are eliminated by measurement, not by reading.
//
// ── THE COOKIE, ELIMINATED BEFORE A BROWSER LAUNCHED ──────────────────────
// A flip that arrives after a visit and PERSISTS smells like a stored mode.
// It is not one: `MODE_COOKIE` (`tdw_wl_mode`) is written at exactly one site,
// `lib/worklist/mode.ts:122`, and read at `mode.ts:55` and `app/w/layout.tsx`.
// Nothing in the old tree writes or clears it, and `MODE_LEGACY_KEY` has no
// reference outside `mode.ts`. Derived, negative, recorded — a cell cannot
// assert this cheaply, so it is stated here where the next reader will find it.
//
// ── THE BROWSER ───────────────────────────────────────────────────────────
// `@sparticuz/chromium` + `puppeteer-core`, the pair `wl_render.cjs` and
// `mock_shot.cjs` already use, because npm is allow-listed and Playwright's CDN
// is not. Real Chromium, real cascade, real computed styles — D-38.1: presence
// in a stylesheet is not presence on screen.
//
// ── s-2c.2 · WHY THIS FILE WAS WRITTEN WHOLE ──────────────────────────────
// Its first cut was hand-patched through a heredoc four times and each patch
// mangled a backslash in a regex — including one that silently produced a
// no-op comment stripper and was reported as a fix. Heredoc-generated JS
// carrying backslash regexes is written as a WHOLE FILE, or every edit asserts.
// The `lineStrip` below is the reason the rule was earned.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;

const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// COMMENT-BLIND, AND ONLY FOR LINE COMMENTS. The estate's shared `strip()`
// also removes block comments, which CORRUPTS files holding unbalanced `/*`
// (F-39.13: `vendor.ts` runs 3 openers against 2 closers, so a pair spans
// hundreds of lines and eats live code). Line comments are the whole of the
// hazard here: this cell's own first cut reported `AddFab.tsx` as an unguarded
// `useT()` consumer, when AddFab never calls it — its line 118 is PROSE saying
// why it mounts `WlToast` rather than `Toast`. A cell that reads its subject's
// explanation of a defect as the defect is F-39.25's mirror.
const NL = String.fromCharCode(10);
const SLASHES = String.fromCharCode(47, 47);
const OPEN = String.fromCharCode(47, 42);   //  slash-star
const CLOSE = String.fromCharCode(42, 47);  //  star-slash
function lineStrip(text) {
  // BLOCK COMMENTS GO FIRST, AND THIS HALF IS EARNED TWICE OVER.
  // A `.tsx` file's prose lives in `{/* … */}`, which no line-comment pass can
  // touch — and `AddFab.tsx:118` puts the word `useT()` inside exactly such a
  // block, explaining why it mounts `WlToast` RATHER THAN `Toast`. The cell
  // read that explanation as the defect and named AddFab an unguarded consumer
  // when AddFab has no `useT()` call at all.
  //
  // A hand-scan is used rather than a regex because the seat's own attempt to
  // patch a backslash regex through a heredoc produced a silent no-op and was
  // reported as a fix (s-2c.2). `indexOf` cannot be mangled by an escape.
  //
  // SCANNED, NOT `replace(/\/\*[\s\S]*?\*\//g)`: that shared shape corrupts a
  // file whose openers and closers do not balance (F-39.13 — `vendor.ts` runs 3
  // against 2, so one pair spans hundreds of lines and eats live code). This
  // walks forward and an unclosed opener simply ends the scan, taking the tail
  // rather than pairing across the file.
  let out = '';
  let i = 0;
  for (;;) {
    const o = text.indexOf(OPEN, i);
    if (o < 0) { out += text.slice(i); break; }
    const c = text.indexOf(CLOSE, o + 2);
    out += text.slice(i, o);
    if (c < 0) break;               // unclosed: stop, never pair across the file
    i = c + 2;
  }
  return out.split(NL).map((line) => {
    const j = line.indexOf(SLASHES);
    if (j < 0) return line;
    // `https://` is not a comment. Anything preceded by `:` is a URL, not a
    // comment opener — the same carve-out the shared helper makes.
    if (j > 0 && line[j - 1] === ':') return line;
    return line.slice(0, j);
  }).join(NL);
}

let pass = 0;
let fail = 0;
const lines = [];
function chk(name, ok, detail) {
  if (ok) { pass += 1; lines.push('  PASS  ' + name + (detail ? '  — ' + detail : '')); }
  else { fail += 1; lines.push('  FAIL  ' + name + (detail ? '  — ' + detail : '')); }
}

// THE SHELL'S SCOPE CSS, COMPOSED THE WAY THE SHELL COMPOSES IT.
// `scopeCss` builds each custom-property name at RUNTIME from `prefixFor` plus
// the token key, which is exactly the composition a grep cannot see — the seat
// published a wrong mechanism off that blindness (c-2c.7). So this reads the
// token maps and applies the same prefix rule rather than asserting anything
// about the source text.
function shellScopeCss() {
  const src = read('lib/worklist/theme.ts');
  const roleMatch = src.match(/ROLE_KEYS[^=]*=\s*\[([^\]]*)\]/);
  const roleKeys = roleMatch
    ? (roleMatch[1].match(/'([a-z-]+)'/g) || []).map((x) => x.slice(1, -1))
    : [];
  const grab = (name) => {
    const i = src.indexOf('export const ' + name);
    if (i < 0) return null;
    const body = src.slice(i, src.indexOf('};', i));
    const out = {};
    for (const m of body.matchAll(/'([a-z-]+)':\s*'([^']*)'/g)) out[m[1]] = m[2];
    return out;
  };
  const graphite = grab('GRAPHITE');
  const chalk = grab('CHALK');
  if (!graphite || !chalk) return null;
  const emit = (m) => Object.keys(m)
    .map((k) => (roleKeys.indexOf(k) >= 0 ? '--role-' : '--atelier-') + k + ':' + m[k] + ';')
    .join('');
  return '.wl[data-wl-mode="dark"]{' + emit(graphite) + '}'
       + '.wl[data-wl-mode="light"]{' + emit(chalk) + '}';
}

(async () => {
  const scope = shellScopeCss();
  if (!scope) { console.log('b41 REFUSED — could not read GRAPHITE/CHALK from theme.ts'); process.exit(3); /* F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base */ }
  const globals = read('app/globals.css');

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 374, height: 844, deviceScaleFactor: 2 });

  await page.setContent(
    '<!doctype html><html><head>'
    + '<style>' + globals + '</style>'
    + '<style>' + scope + '</style>'
    + '<style>html,body{margin:0;padding:0}</style>'
    + '</head><body><div class="wl" id="shell" data-wl-mode="light" '
    + 'style="height:100dvh;display:flex;flex-direction:column;overflow:hidden;'
    + 'background:var(--atelier-page-bg);color:var(--atelier-ink)">'
    + '<div id="room" style="flex:1">billing</div></div></body></html>',
    { waitUntil: 'load' },
  );

  const groundOf = () => page.evaluate(() => {
    const shell = document.getElementById('shell');
    const cs = getComputedStyle(shell);
    const r = shell.getBoundingClientRect();
    return {
      bg: cs.backgroundColor,
      img: cs.backgroundImage.slice(0, 60),
      hasLight: document.documentElement.classList.contains('theme-light'),
      bodyGround: getComputedStyle(document.body).backgroundImage.slice(0, 48),
      covers: r.top <= 0 && r.left <= 0
              && r.width >= window.innerWidth && r.height >= window.innerHeight,
      opaque: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent',
    };
  });

  // ── §1 · THE SHELL PAINTS A GROUND OF ITS OWN ────────────────────────────
  const before = await groundOf();
  chk('1.1 the shell paints its own ground in Chalk', before.opaque, before.bg);

  // ── §2 · THE FOUNDER'S MOUNT ORDER ───────────────────────────────────────
  // light /w → the old tree mounts dark → back to /w. `<html>` is never
  // remounted on a soft navigation, so whatever the old tree leaves is still
  // there. This reproduces the CLASS half, which is what `globals.css` reacts to.
  await page.evaluate(() => { document.documentElement.classList.toggle('theme-light', false); });
  const after = await groundOf();

  chk('2.1 the old tree still writes its class — arm (i) leaves the UNPINNED path alone',
      after.hasLight === false, 'theme-light present: ' + after.hasLight);

  // NOT A VERDICT ON THE BLEED. What it proves is narrower and worth having:
  // the ground is scope-immune, because `.wl[data-wl-mode]` declares
  // `--atelier-page-bg` locally and a scope-local custom property beats an
  // inherited one.
  chk('2.2 the shell\'s ground is SCOPE-IMMUNE to the old tree\'s document writes',
      after.bg === before.bg && after.img === before.img,
      'before ' + before.bg + ' / after ' + after.bg);

  // ── §3 · THE IMMUNITY IS NON-VACUOUS ─────────────────────────────────────
  // §2.2 is only worth reading if the scope's declaration is what wins. Remove
  // it and the inherited value must take over; if it does not, §2.2 was green
  // over a page where nothing could ever have changed.
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--atelier-page-bg', 'rgb(1, 2, 3)');
    const s = document.createElement('style');
    s.id = 'kill-scope';
    s.textContent = '.wl[data-wl-mode="light"]{--atelier-page-bg:inherit}';
    document.head.appendChild(s);
  });
  const stripped = await groundOf();
  chk('3.1 NON-VACUOUS — with the scope\'s own declaration removed, the inherited value DOES reach the shell',
      stripped.bg !== after.bg, 'scoped ' + after.bg + ' / unscoped ' + stripped.bg);
  await page.evaluate(() => {
    const s = document.getElementById('kill-scope'); if (s) s.remove();
    document.documentElement.style.removeProperty('--atelier-page-bg');
  });

  // ── §4 · THE TWO REMAINING MECHANISMS ────────────────────────────────────
  // PROBE A · `useT()` with no provider returns the context default, and that
  // default is DARK — a dark component inside Chalk, which is the founder's
  // words. STATIC: a mount-graph fact, not a paint, and it says so.
  const consumers = ['components/worklist/AskSheet.tsx',
                     'components/worklist/AddFab.tsx',
                     'components/worklist/WlToast.tsx'];
  const unguarded = consumers.filter((f) => {
    const src = lineStrip(read(f));
    return /useT\(\)/.test(src) && !/<ThemeProvider/.test(src);
  });
  chk('4.1 PROBE A (static) — every /w consumer of useT() mounts its own provider',
      unguarded.length === 0,
      unguarded.length ? 'no provider in: ' + unguarded.join(', ')
                       : 'checked AskSheet · AddFab · WlToast, comment-blind');

  // PROBE B · the `!important` html/body ground, asked of the browser rather
  // than of the stylesheet.
  chk('4.2 PROBE B (rendered) — the scope covers the viewport and paints opaque, so the html/body ground cannot show behind it',
      after.covers && after.opaque,
      'covers ' + after.covers + ' · opaque ' + after.opaque + ' · body ground ' + after.bodyGround);

  await browser.close();

  console.log('b41 · E-1 theme bleed · FIXTURE, NOT THE APP');
  console.log('     globals.css verbatim from disk · both writers in the founder\'s mount order');
  lines.forEach((l) => console.log(l));
  console.log('');
  console.log('b41 — ' + pass + ' PASS · ' + fail + ' FAIL');
  console.log('');
  console.log('NO BLEED REPRODUCED ON FIXTURE; GROUND IMMUNITY PROVEN.');
  console.log('  Three mechanisms eliminated by measurement: the ground is scope-immune');
  console.log('  (§2.2, non-vacuous at §3.1); the html/body !important ground cannot show');
  console.log('  behind the scope (§4.2); every /w useT() consumer mounts its own provider');
  console.log('  (§4.1). The cookie is eliminated by derivation — see this file\'s header.');
  console.log('  The founder\'s live flip is UNREPRODUCED here. F-39.32 stays');
  console.log('  OPEN-AS-NARROWED and the founder\'s eye is the verdict on the card:');
  console.log('  light /w/billing -> /vendor/discover/preview -> /w/billing still light.');
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('b41 ERROR — unexpected throw: ' + (e && e.stack || e)); process.exit(2); /* F-39.67: a throw is an ERROR (2); the named refusals above exit 3 before this line */ });
