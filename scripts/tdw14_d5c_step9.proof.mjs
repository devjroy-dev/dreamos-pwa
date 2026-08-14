#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/tdw14_d5c_step9.proof.mjs
// TDW_14 · D-5c — STEP 9's CURE: the home-screen name that no browser was
// reading, and the error step that had no ground.
//
//   node scripts/tdw14_d5c_step9.proof.mjs
//
// ── WHAT D-5c IS ───────────────────────────────────────────────────────────
// Two cures, one ZIP, both pwa-side.
//
//   F-14.20 / F-14.21 — ONE cause, two faces. `app/layout.tsx` renders the
//   manifest link and `apple-mobile-web-app-title` as static children of the
//   root <head>. Both tags are FIRST-IN-TREE-WINS: the manifest spec takes the
//   first `rel="manifest"` in tree order, WebKit takes the first meta of a given
//   name. A client layout's hoisted tags land after them and are never read. So
//   D-5's member key was correct, served, and dead on arrival — iOS and Android
//   both showed the house name. §3 and §4 bench the displacement that cures it.
//
//   F-14.22 — the error step had no ground at all. §1 and §2.
//
// ── R-33.9 · LEGIBILITY IS PART OF THE BYTE ────────────────────────────────
// A cell that asserted a string would have gone green on the uncured tree: the
// words were always there, they were merely unreadable. §2 therefore ASSERTS
// PRESENCE, GROUND, AND A COMPUTED RATIO. This is also why the cure is a panel
// and not a stronger scrim, adopted into R-33.9's body at CE-33 §6: contrast
// against an unknown cover photograph is not benchable — a cell could only
// assert an alpha and call it legibility. Against a fixed opaque ground it is
// arithmetic, and the arithmetic is done here rather than trusted.
//
// ── WHAT THIS BENCH CANNOT DO ──────────────────────────────────────────────
// It reads source. It cannot mount a head, cannot run an effect, and cannot see
// a home screen. The hoisting derivation is read from source and spec; the
// SETTLING PROOF is step 9 on two handsets and nothing here replaces it. §4's
// restore is benched at the source level — the cleanup exists and returns each
// captured value — which is the strongest claim a file-reading cell may make
// about a lifecycle, and it is stated as that rather than as a witnessed unmount.
//
// ── R-33.3 · AN ABSENCE CELL'S RADIUS EQUALS ITS CLAIM ─────────────────────
// Every cell below is comment-stripped and bounded to the one file it names,
// except §5, which asserts INK and must therefore read raw.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw  = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Line comments stripped BEFORE block comments, per the estate's law.
const code = (p) => raw(p)
  .split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
  .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const JOIN    = 'app/circle/join/[token]/page.tsx';
const LAYOUT  = 'app/coplanner/layout.tsx';
const CONTEXT = 'app/coplanner/CircleSessionContext.tsx';

let pass = 0, fail = 0;
const ok = (label, cond, why) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  RED  ${label}${why ? ' — ' + why : ''}`); }
};
const sec = (t) => console.log(`\n${t}`);

const J = code(JOIN);
const L = code(LAYOUT);

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE PANEL EXISTS, AND THE ERROR STEP SITS ON IT');

ok('§1.1 ERROR_PANEL is declared once, as a typed style object',
  (J.match(/const ERROR_PANEL: React\.CSSProperties = \{/g) || []).length === 1,
  'the panel has no declaration, or has two');

ok('§1.2 the error step\u2019s two lines are wrapped by it',
  /<div style=\{ERROR_PANEL\}>[\s\S]*Hmm\.[\s\S]*\{errorMsg\}[\s\S]*<\/div>/.test(J),
  'the panel is declared but nothing is seated on it');

ok('§1.3 the panel is inside the error branch and nowhere else',
  (J.match(/style=\{ERROR_PANEL\}/g) || []).length === 1 &&
  /\{step === 'error' && \([\s\S]*?style=\{ERROR_PANEL\}/.test(J),
  'the panel escaped its branch');

ok('§1.4 the panel carries an edge and a radius, not a bare fill',
  /const ERROR_PANEL: React\.CSSProperties = \{[\s\S]*?border:[\s\S]*?borderRadius:[\s\S]*?\};/.test(J));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · R-33.9 \u2014 THE GROUND IS OPAQUE AND THE CONTRAST IS ARITHMETIC');

// Tokens are RESOLVED FROM THEIR HOME, never typed here. A ratio computed
// against a remembered hex would be a number this bench invented.
const C = raw(CONTEXT);
const tokenOf = (name) => {
  const m = C.match(new RegExp(`export const ${name}\\s*=\\s*'(#[0-9A-Fa-f]{6})'`));
  return m ? m[1] : null;
};
const INK_HEX   = tokenOf('INK');
const CREAM_HEX = tokenOf('CREAM');

ok('§2.1 INK and CREAM resolve from the circle vocabulary, not from memory',
  !!INK_HEX && !!CREAM_HEX,
  `INK=${INK_HEX} CREAM=${CREAM_HEX}`);

// The ground must be the TOKEN and must be OPAQUE. An rgba() ground would put a
// photograph back underneath the text and make everything below un-computable.
const panelBlock = (J.match(/const ERROR_PANEL: React\.CSSProperties = \{[\s\S]*?\};/) || [''])[0];
ok('§2.2 the ground is the INK token, applied opaque',
  /background: INK,/.test(panelBlock) && !/background:\s*'rgba/.test(panelBlock),
  'the ground is transparent, tinted, or a literal — the ratio below is then a fiction');

ok('§2.3 the panel mints no new raw hex \u2014 f0772\u2019s radius is unchanged',
  !/#[0-9A-Fa-f]{6}/.test(panelBlock));

// ── the arithmetic ─────────────────────────────────────────────────────────
const rgb = (hex) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const over = (fg, bg, a) => fg.map((c, i) => a * c + (1 - a) * bg[i]);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const INK_RGB   = rgb(INK_HEX);
const CREAM_RGB = rgb(CREAM_HEX);

// The body line's alpha is READ OFF THE SOURCE, so a future restyle cannot
// quietly darken the text under a green cell.
const bodyAlpha = (() => {
  const m = J.match(/\{errorMsg\}/) ? J.match(/color: 'rgba\(248,247,245,([0-9.]+)\)'[^}]*\}\}>\s*\{errorMsg\}/) : null;
  return m ? parseFloat(m[1]) : null;
})();

ok('§2.4 the body line\u2019s alpha is readable from source', bodyAlpha !== null,
  'the error body\u2019s colour changed shape; the ratio below cannot be computed');

const headingRatio = ratio(CREAM_RGB, INK_RGB);
const bodyRatio    = bodyAlpha === null ? 0 : ratio(over(CREAM_RGB, INK_RGB, bodyAlpha), INK_RGB);

console.log(`       heading  CREAM ${CREAM_HEX} on INK ${INK_HEX}          = ${headingRatio.toFixed(2)}:1`);
console.log(`       body     CREAM @ ${bodyAlpha} composited on INK  = ${bodyRatio.toFixed(2)}:1`);

ok('§2.5 the heading clears WCAG AA for body text (4.5:1)', headingRatio >= 4.5,
  `${headingRatio.toFixed(2)}:1`);
ok('§2.6 the error sentence itself clears WCAG AA (4.5:1)', bodyRatio >= 4.5,
  `${bodyRatio.toFixed(2)}:1 \u2014 the member cannot read why her invite failed`);

// EXPECTED-ZERO, named so the record shows it was seen: the strip's own ground
// is untouched. SCRIM belongs to the branch the error step replaces.
ok('§2.7 E2 SCRIM stays the bottom strip\u2019s ground, unmoved',
  /const SCRIM\s+= 'rgba\(12,10,9,0\.38\)';/.test(J) &&
  !new RegExp('background: SCRIM').test(panelBlock));

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · THE DISPLACEMENT \u2014 the root\u2019s two tags, by attribute, never by position');

ok('§3.1 the manifest link is targeted by its rel attribute',
  /querySelector\('link\[rel="manifest"\]'\)/.test(L),
  'the browser reads the first rel=manifest in tree order; anything else is a different element');

ok('§3.2 the apple title is targeted by its name attribute',
  /querySelector\('meta\[name="apple-mobile-web-app-title"\]'\)/.test(L));

ok('§3.3 no positional selector reaches for either tag',
  !/querySelectorAll\(\s*'(link|meta)/.test(L) &&
  !/getElementsByTagName\(\s*'(link|meta)/.test(L),
  'a head index is not a contract; a font preconnect landing first would break it');

ok('§3.4 an absent tag no-ops rather than throwing',
  /if \(!link && !meta\) return;/.test(L) &&
  (L.match(/if \(link\)/g) || []).length >= 2 &&
  (L.match(/if \(meta\)/g) || []).length >= 1,
  'a future tree without one of these tags would cost a member her install');

// THE ONE SITE. Rule 25 and the possessive live in the handler. If this layout
// ever builds the name itself there are two sites, and the second one is the one
// that puts "the's Circle" on a home screen.
ok('§3.5 the title is read back off the served manifest, not built here',
  /m\.short_name/.test(L) && /typeof m\.short_name === 'string'/.test(L));

ok('§3.6 this layout constructs no possessive and slices no first name',
  !/'s Circle/.test(L) && !/'s Wedding Circle/.test(L) &&
  !/\.split\(\/\\s\+\/\)/.test(L),
  'the sentinel is a sentence, not a name \u2014 slicing it is the failure rule 25 exists to prevent');

ok('§3.7 a failed or malformed manifest leaves the house wording standing',
  /r\.ok \? r\.json\(\) : null/.test(L) && /\.catch\(\(\) => \{\}\)/.test(L));

ok('§3.8 the effect re-runs when her name arrives, and only then',
  /\}, \[manifestHref\]\);/.test(L),
  'a mount-only effect fires while `session` is still null and never corrects');

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE RESTORE \u2014 no other lane inherits her name');

ok('§4.1 the effect returns a cleanup at all',
  /return \(\) => \{[\s\S]*?live = false;/.test(L),
  'her name would follow a member out of the coplanner and onto every other lane');

ok('§4.2 the link is restored to the value CAPTURED, not to any current value',
  /link\.setAttribute\('href', linkWas\)/.test(L) &&
  /const linkWas = link \? link\.getAttribute\('href'\) : null;/.test(L));

ok('§4.3 the meta is restored to the value CAPTURED',
  /meta\.setAttribute\('content', metaWas\)/.test(L) &&
  /const metaWas = meta \? meta\.getAttribute\('content'\) : null;/.test(L));

ok('§4.4 an originally-absent attribute is removed, not written back as "null"',
  /if \(linkWas === null\) link\.removeAttribute\('href'\);/.test(L) &&
  /if \(metaWas === null\) meta\.removeAttribute\('content'\);/.test(L));

ok('§4.5 the in-flight fetch is closed by the cleanup',
  /let live = true;/.test(L) &&
  /if \(live && m &&/.test(L) &&
  /live = false;/.test(L),
  'a slow manifest could write her name onto a head this layout has already released');

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE INK \u2014 the pre-hydration window is written down, not discovered');

const Lraw = raw(LAYOUT);
ok('§5.1 the file states that the house wording stands until hydration',
  /pre-hydration|Until React hydrates/i.test(Lraw) && /house wording/i.test(Lraw));
ok('§5.2 the file states why step 9 does not care',
  /Add to Home Screen/i.test(Lraw) && /hydrated/i.test(Lraw));
ok('§5.3 the file names the handset walk as the settling proof, not this bench',
  /handset walk/i.test(Lraw));
ok('§5.4 the refused alternative is on the record in the file that refused it',
  /server component/i.test(Lraw) && /five-lane|Root-yields/i.test(Lraw));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · D-5 IS NOT DISTURBED \u2014 the cells this delivery must not redden');

ok('§6.1 f0772 \u00a76.5\u2019s pinned import line survives verbatim',
  J.includes("import { setCircleToken, circleAuthHeaders } from '../../../coplanner/CircleSessionContext';"));

ok('§6.2 the token import is unextended \u2014 the panel added no name to it',
  /import \{ GOLD, INK, CREAM, MUTED, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW \}/.test(J));

const RENDERED_HEX = (J.match(/#[0-9A-Fa-f]{6}/g) || []);
ok('§6.3 still exactly one raw hex renders in the radius \u2014 the labelled ground',
  RENDERED_HEX.length === 1 && RENDERED_HEX[0] === '#1A1715',
  `renders ${RENDERED_HEX.length}: ${RENDERED_HEX.join(', ')}`);

ok('§6.4 D-5\u2019s declarative member key is untouched',
  (L.match(/<link rel="manifest" href=\{manifestHref\} \/>/g) || []).length === 1);

ok('§6.5 the restored sign-in byte from F-14.19 is still in place',
  /setError\(vd\.error \|\| 'Could not sign you in\. Try again\.'\)/.test(L),
  'the F-14.19 repair has been overwritten a second time');

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · BOTH WAYS \u2014 every claim above reddens on an uncured tree');

const MUTATIONS = [
  [JOIN,
   'background: INK,',
   "background: 'rgba(12,10,9,0.38)',",
   '\u00a77.1 the panel ground goes translucent \u2014 the photograph returns under the text',
   () => { const j = code(JOIN); const b = (j.match(/const ERROR_PANEL: React\.CSSProperties = \{[\s\S]*?\};/) || [''])[0];
           return /background: INK,/.test(b) && !/background:\s*'rgba/.test(b); }],

  [JOIN,
   '<div style={ERROR_PANEL}>',
   '<div>',
   '\u00a77.2 the panel is declared but nothing is seated on it',
   () => /<div style=\{ERROR_PANEL\}>[\s\S]*Hmm\.[\s\S]*\{errorMsg\}[\s\S]*<\/div>/.test(code(JOIN))],

  [LAYOUT,
   "querySelector('meta[name=\"apple-mobile-web-app-title\"]')",
   "querySelectorAll('meta')[3]",
   '\u00a77.3 the title is reached by head position instead of by attribute',
   () => /querySelector\('meta\[name="apple-mobile-web-app-title"\]'\)/.test(code(LAYOUT)) &&
         !/querySelectorAll\(\s*'(link|meta)/.test(code(LAYOUT))],

  [LAYOUT,
   "else link.setAttribute('href', linkWas);",
   "else link.setAttribute('href', manifestHref);",
   '\u00a77.4 the cleanup restores her name instead of the house manifest',
   () => /link\.setAttribute\('href', linkWas\)/.test(code(LAYOUT))],

  [LAYOUT,
   'meta.setAttribute(\'content\', m.short_name);',
   'meta.setAttribute(\'content\', `${brideName(session)}\'s Circle`);',
   '\u00a77.5 the layout builds the possessive itself \u2014 rule 25 gains a second site',
   () => { const l = code(LAYOUT); return /m\.short_name/.test(l) && !/'s Circle/.test(l); }],
];

let proven = 0;
for (const [file, from, to, label, stillGreen] of MUTATIONS) {
  const original = raw(file);
  const originalSha = sha(original);
  const occurrences = original.split(from).length - 1;
  if (occurrences !== 1) {
    fail++;
    console.log(`  RED  ${label} — target not unique on the final tree `
      + `(${occurrences}); R-33.4 refuses an ambiguous mutation`);
    continue;
  }
  try {
    fs.writeFileSync(path.join(ROOT, file), original.replace(from, to), 'utf8');
    if (stillGreen()) {
      fail++;
      console.log(`  RED  ${label} — the cell stayed GREEN over the mutation; it is vacuous`);
    } else {
      proven++; pass++;
      console.log(`  ok   ${label} — reddens on the uncured tree`);
    }
  } finally {
    fs.writeFileSync(path.join(ROOT, file), original, 'utf8');
    if (sha(raw(file)) !== originalSha) {
      console.log(`  RED  §7 RESTORE FAILED on ${file} — do not commit`);
      process.exit(1);
    }
  }
}
ok('§7.6 all five mutations proven non-vacuous', proven === 5, `${proven} of 5`);

// ═══════════════════════════════════════════════════════════════════════════
console.log(`\n${pass}/${pass + fail} cells green`);
process.exit(fail === 0 ? 0 : 1);
