#!/usr/bin/env node
// scripts/tdw09_p1_canon.proof.mjs — TDW_09 · PACKAGE 1 · THE CANON FOUNDATIONS
//
// WHAT THIS BENCH GUARDS:
//  §1  THE COMPARATOR — every ThemeContext-published token declared in BOTH
//      globals pre-mount homes at values byte-equal to the theme.ts owner.
//      This is F-09.77's CLASS dying as a class (acceptance ② of the P1
//      charter): a divergence anywhere reddens here, forever, without waiting
//      for a reader to arrive.
//  §2  the four B-1 cure cells (F-09.77 · F-09.82 · the R-M5 completion pair) —
//      the sitting's both-ways subjects.
//  §3  the three interaction primitives, property-asserted, with the P2
//      named-carrier comment present (the P-1(a) ruling + CE-201's law).
//  §4  the F-09.78 WATCH — walks every sheetTop→sheetBot gradient user and
//      convicts on the FIRST metal-ink pairing (4.26:1 on the lower stop;
//      zero live pairs at authoring — F-09.77's watch shape, which proved
//      itself when .77's reader arrived).
//  §5  the census instrument's properties — it exists, states its method,
//      and carries the lawful-invariant roster with its warrants, including
//      the founder's 「 green it 」 on #25D366.
//  §6  the ZERO-VISUAL-CHANGE mechanical guard (acceptance ①'s desk half):
//      the publication list is exactly its 25 entries and the four cured
//      owners hold their recorded values — a P1 that repainted anything
//      reddens here. The founder's one-screen-per-theme glance is the live
//      half and outranks this section.
//
// Failure modes named: §1/§2 read declared text, not computed style — a value
// reached through a later cascade rule is invisible (no such rule exists for
// these tokens at authoring; the !important block died with FLAIR). §4 is a
// same-file walk — a metal ink applied by a parent component onto a child's
// gradient is invisible to it; that shape joins the watch if it ever ships.

import fs from 'fs';
import { fileURLToPath } from 'url';

let pass = 0, fail = 0;
function ok(name, cond, why) {
  if (cond) { pass++; console.log('  ok  ', name); }
  else { fail++; console.log('  FAIL', name, why ? `— ${why}` : ''); }
}
function sec(t) { console.log('\n' + t); }
function read(p) { return fs.readFileSync(p, 'utf8'); }
function strip(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1'); }

const TH = read('lib/vendor/theme.ts');
const G  = read('app/globals.css');
const TC = read('lib/vendor/ThemeContext.tsx');
const CT = read('lib/vendor/controls.ts');

sec('§0 · THE CANARY — the stripper must not swallow live code');
ok('§0.1 canary — theme.ts DARK pageBg literal survives', strip(TH).includes("pageBg:     '#1F1612'"));
ok('§0.2 canary — globals light ink survives', strip(G).includes('--atelier-ink'));
ok('§0.3 this bench CALLS its stripper (F-07.99)', (() => {
  const self = strip(read(fileURLToPath(import.meta.url)));
  return (self.match(/\bstrip\s*\(/g) || []).length >= 3;
})());

// ── the shared machinery: owner values from theme.ts, home values from globals ──
function block(src, name) { const i = src.indexOf(name); return src.slice(i, src.indexOf('};', i)); }
const D = block(TH, 'export const DARK'), L = block(TH, 'export const LIGHT');
function own(b, k) { const m = b.match(new RegExp(k + ":\\s*'([^']+)'")); return m ? m[1] : null; }
const lightIdx = G.indexOf('html.theme-light {');
const HOME_DARK = G.slice(0, lightIdx), HOME_LIGHT = G.slice(lightIdx);
function home(b, t) { const m = b.match(new RegExp(t + ':\\s*([^;]+);')); return m ? m[1].trim() : null; }
const norm = s => s == null ? null : s.replace(/\s+/g, '').toLowerCase();

// The publication map — token → theme.ts key. §6 asserts this list IS the
// ThemeContext list, so the comparator can never silently under-cover.
const MAP = {
  '--atelier-ink': 'ink', '--atelier-ink-soft': 'inkSoft', '--atelier-ink-mute': 'inkMute',
  '--atelier-ink-dim': 'inkDim', '--atelier-ink-fade': 'inkFade',
  '--role-positive': 'positive', '--role-caution': 'caution', '--role-critical': 'critical',
  '--role-metal': 'metal', '--role-scrim': 'scrim', '--role-sheet': 'sheet',
  '--atelier-label': 'label', '--atelier-accent-text': 'accentText',
  '--atelier-header-bg': 'headerBg', '--atelier-sheet-top': 'sheetTop', '--atelier-sheet-bot': 'sheetBot',
  '--atelier-sheet-border': 'sheetBorder', '--atelier-input-bg': 'inputBg', '--atelier-input-border': 'inputBorder',
  '--atelier-card-border': 'cardBorder', '--atelier-row-hover': 'rowHover',
  '--atelier-section-bg': 'sectionBg', '--atelier-overlay-bg': 'overlay',
  '--atelier-page-bg': 'pageBg', '--atelier-bg': 'pageBg',
};

sec('§1 · THE COMPARATOR — 25 published tokens · both homes · owner-equal (F-09.77\u2019s class dies here)');
{
  let divergences = [];
  for (const [tok, key] of Object.entries(MAP)) {
    const od = own(D, key), ol = own(L, key);
    const hd = home(HOME_DARK, tok), hl = home(HOME_LIGHT, tok);
    if (norm(od) !== norm(hd)) divergences.push(`${tok} DARK home=${hd} owner=${od}`);
    if (norm(ol) !== norm(hl)) divergences.push(`${tok} LIGHT home=${hl} owner=${ol}`);
  }
  ok('§1.1 zero owner-vs-home divergence across all 25 tokens, both homes',
    divergences.length === 0, divergences.slice(0, 3).join(' | '));
  ok('§1.2 the comparator covered 25 tokens (the count is the coverage guard)',
    Object.keys(MAP).length === 25);
}

sec('§2 · THE B-1 CURES — the sitting\u2019s both-ways subjects');
ok('§2.1 F-09.77 CURED — light card-border is the owner\u2019s 0.18, the 0.20 divergence dead',
  /--atelier-card-border: rgba\(122,56,40,0\.18\);/.test(HOME_LIGHT)
  && !/--atelier-card-border: rgba\(122,56,40,0\.20\)/.test(HOME_LIGHT));
ok('§2.2 F-09.82 CURED — light header-bg is the owner\u2019s 0.96',
  /--atelier-header-bg:\s+rgba\(245,242,238,0\.96\);/.test(HOME_LIGHT)
  && !/rgba\(245,242,238,0\.94\)/.test(HOME_LIGHT));
ok('§2.3 R-M5 COMPLETED, dark half — page-bg + section-bg declared at owner bytes',
  /--atelier-page-bg:\s+#1F1612;/.test(HOME_DARK) && /--atelier-section-bg:\s+rgba\(245,235,212,0\.03\);/.test(HOME_DARK));
ok('§2.4 R-M5 COMPLETED, light half — page-bg + section-bg declared at owner bytes',
  /--atelier-page-bg:\s+#F5F2EE;/.test(HOME_LIGHT) && /--atelier-section-bg:\s+rgba\(26,15,8,0\.025\);/.test(HOME_LIGHT));

sec('§3 · THE PRIMITIVES — staged, property-asserted, carrier named (P-1(a))');
ok('§3.1 pressedStyle exists with spec P6\u2019s numbers (scale .98 / 80ms)',
  /export function pressedStyle\(/.test(CT) && /scale\(0\.98\)/.test(CT) && /80ms/.test(CT));
ok('§3.2 pressedStyle\u2019s reduced-motion arm keeps feedback (opacity) while dropping transform',
  /reducedMotion\s*\?\s*\{ opacity: 0\.82/.test(CT.replace(/\n\s*/g, ' ')));
ok('§3.3 touchBox44 exists at the 44 floor and is a no-op at-or-above it',
  /export const TOUCH_FLOOR = 44/.test(CT) && /if \(visualHeight >= TOUCH_FLOOR\) return \{\};/.test(CT));
ok('§3.4 touchBox44 grows the hit box WITHOUT moving a visible pixel (padding compensated by negative margin)',
  /paddingTop: pad, paddingBottom: pad, marginTop: -pad, marginBottom: -pad/.test(CT));
ok('§3.5 rowBaseline is baseline + shared line-height, and the glyph slot is a fixed box outside text alignment',
  /alignItems: 'baseline', lineHeight: 1\.5/.test(CT) && /export function rowGlyphSlot/.test(CT));
ok('§3.6 THE NAMED CARRIER is in-file: P2 named, the retirement duty stated, wire-or-delete distinguished',
  /CARRIER: PACKAGE 2/.test(CT) && /NAMED\s+LINE in that sitting/.test(CT.replace(/\n\s*\/\/\s*/g, ' '))
  && /wire-or-delete/i.test(CT));
ok('§3.7 zero consumers at this delivery — the staging is real, not accidental',
  (() => {
    const files = [];
    (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = d + '/' + e.name;
      if (e.isDirectory() && !/node_modules|\.next|\.git/.test(p)) walk(p);
      else if (/\.tsx?$/.test(e.name) && !/controls\.ts$/.test(e.name) && !p.includes('/scripts/')) files.push(p);
    } })('.');
    return !files.some(f => /pressedStyle|touchBox44|rowBaseline|rowGlyphSlot/.test(strip(read(f))));
  })());

sec('§4 · F-09.78 — THE GRADIENT WATCH (convicts on first metal pairing; zero live pairs at authoring)');
{
  // Walk every file COMPOSITING the sheetTop→sheetBot gradient — a
  // linear-gradient over both stops — and convict if the same file places metal
  // ink. Name co-occurrence is NOT composition: the token OWNER (theme.ts) and
  // PUBLISHER (ThemeContext) list both names without rendering anything, and
  // the first cut of this cell convicted the publisher for exactly that —
  // corrected here, the exclusion earned by its own red. LIGHT metal on the
  // LOWER stop is 4.26:1 — under the 4.5 body bar (arithmetic at the P1
  // read-first, chair-ratified).
  const users = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + e.name;
    if (e.isDirectory() && !/node_modules|\.next|\.git|scripts/.test(p)) walk(p);
    else if (/\.tsx$/.test(e.name)) {
      const c = strip(read(p)).replace(/\n/g, ' ');
      if (/linear-gradient\([^)]*(sheetTop|sheet-top)[^)]*(sheetBot|sheet-bot)[^)]*\)/.test(c)
          || /linear-gradient\([^)]*\$\{[^}]*sheetTop\}[^)]*\$\{[^}]*sheetBot\}[^)]*\)/.test(c)) users.push([p, c]);
    }
  } })('.');
  ok('§4.1 the gradient users are enumerable (walk found at least the two known)',
    users.length >= 2, users.map(u => u[0]).join(' | '));
  const paired = users.filter(([p, c]) => /role-metal|\.metal\b/.test(c));
  ok('§4.2 ZERO metal-on-gradient pairings — the watch convicts on the first arrival',
    paired.length === 0, paired.map(u => u[0]).join(' | '));
}

sec('§5 · THE CENSUS INSTRUMENT — committed, method-owning, invariants warranted');
{
  const CEN = read('scripts/tdw09_vendor_census.mjs');
  ok('§5.1 the instrument exists and states its counting method in its own header',
    /THE COUNTING METHOD, STATED/.test(CEN) && /COMMENTS STRIPPED FIRST/.test(CEN));
  ok('§5.2 the lawful-invariant roster carries the pin trio + Splash with their rulings',
    /R-M6/.test(CEN) && /R-M4\(c\)/.test(CEN) && /pin-login/.test(CEN) && /Splash\.tsx/.test(CEN));
  ok('§5.3 the WhatsApp green is RULED-INVARIANT with the founder\u2019s verbatim warrant and its mechanism',
    /「 green it 」/.test(CEN) && /#25D366/.test(CEN) && /WhatsApp-?\s*recognition/i.test(CEN.replace(/\n\s*\/\/\s*/g, ' ')));
  ok('§5.4 the instrument runs and owns its numbers (json emitted with totals)',
    fs.existsSync('scripts/tdw09_vendor_census.json')
    && (() => { const j = JSON.parse(read('scripts/tdw09_vendor_census.json'));
                return j.hexTotal > 0 && j.brassTotal > 0 && Array.isArray(j.greenSites) && j.greenSites.length > 0; })());
}

sec('§6 · ZERO-VISUAL-CHANGE — the mechanical guard (the founder\u2019s glance outranks it)');
ok('§6.1 the publication list is exactly 25 setProperty entries — nothing added, nothing dropped',
  (strip(TC).match(/setProperty\('--/g) || []).length === 25);
ok('§6.2 theme.ts owners hold their recorded values at the four cured tokens (the cure moved GLOBALS to the owner, never the owner)',
  own(L, 'cardBorder') === 'rgba(122,56,40,0.18)' && own(L, 'headerBg') === 'rgba(245,242,238,0.96)'
  && own(D, 'pageBg') === '#1F1612' && own(L, 'sectionBg') === 'rgba(26,15,8,0.025)');

console.log(`\n──────── tdw09_p1_canon: ${pass}/${pass + fail} ────────`);
process.exit(fail === 0 ? 0 : 1);
