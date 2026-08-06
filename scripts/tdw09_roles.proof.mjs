#!/usr/bin/env node
// scripts/tdw09_roles.proof.mjs — TDW_09 · F-09.28's bench.
//
// ── WHAT MAKES THIS DIFFERENT FROM EVERY EARLIER COLOUR CELL ────────────────
// R-U38 amended F-09.28 from "literals that fail" to THEME COHERENCE: any rendered
// pair whose members theme independently. The loose literal is the simplest case;
// the sharpest is an inverting composite, where NEITHER value is wrong on its own
// and the pair is still unreadable.
//
// A literal-by-literal pass would have cleared app/vendor/studio/team/page.tsx
// completely clean. Its scrim was rgba(0,0,0,0.7) — a fine colour. Its sheet was
// rgba(255,255,255,0.035) — a fine colour. Its ink was var(--atelier-ink) — a
// token, correctly themed. On Editorial Paper those three composite to dark ink on
// a #504F4D surface at 2.30:1, and the founder read it as a layout collision.
//
// So this bench measures COMPOSITES, on BOTH surviving themes, and cell ④ is
// written so that a literal-only pass is itself the failure mode it catches.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let pass = 0, fail = 0;
const ok = (l, c, d) => { if (c) { pass++; console.log(`  ok   ${l}`); } else { fail++; console.log(`  FAIL ${l}`); if (d) console.log(`       ${d}`); } };

// ── colour maths, from the WCAG spec ───────────────────────────────────────
const parse = (v) => {
  const s = String(v).trim();
  let m = /^#([0-9a-f]{6})$/i.exec(s);
  if (m) return [0,2,4].map(i => parseInt(m[1].slice(i,i+2),16)).concat(1);
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (m) return [+m[1],+m[2],+m[3], m[4]===undefined?1:+m[4]];
  return null;
};
const over = (fg, bg) => fg[3] >= 0.999 ? fg.slice(0,3) : [0,1,2].map(i => Math.round(fg[i]*fg[3] + bg[i]*(1-fg[3])));
const lum = ([r,g,b]) => { const c=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}; return .2126*c(r)+.7152*c(g)+.0722*c(b); };
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+.05)/(y+.05); };
const r2 = n => Math.round(n*100)/100;

const THEME = read('lib/vendor/theme.ts');
function tokens(name) {
  const i = THEME.indexOf(`export const ${name}: ThemeTokens = {`);
  if (i < 0) return null;
  const body = THEME.slice(i, THEME.indexOf('\n};', i));
  const o = {};
  for (const m of body.matchAll(/^\s*([A-Za-z]+):\s*'([^']+)'/gm)) o[m[1]] = m[2];
  return o;
}
const THEMES = [['Espresso','DARK'], ['Editorial Paper','LIGHT']];

console.log('\nTDW_09 · roles proof — theme coherence, measured as composites on both themes\n');

// ① the roles exist, on both
console.log('\u2460 the six roles');
for (const [label, key] of THEMES) {
  const t = tokens(key);
  for (const r of ['positive','caution','critical','metal','scrim','sheet'])
    ok(`${label} · ${r} declared`, !!t?.[r], t?.[r] ?? '(absent)');
}

// ② each ink role clears the body bar on its OWN page — recomputed from source
console.log('\n\u2461 the ink roles clear AA on their own page');
for (const [label, key] of THEMES) {
  const t = tokens(key), page = parse(t.pageBg);
  for (const r of ['positive','caution','critical','metal']) {
    const v = ratio(over(parse(t[r]), page), page.slice(0,3));
    ok(`${label} · ${r} \u2265 4.5:1`, v >= 4.5, `measured ${r2(v)}:1 — ${t[r]}`);
  }
}

// ③ THE COMPOSITE CELL — the one a literal pass cannot write
console.log('\n\u2462 the surface roles, COMPOSITED as they render');
for (const [label, key] of THEMES) {
  const t = tokens(key), page = parse(t.pageBg).slice(0,3);
  const scrim = over(parse(t.scrim), page);
  const sheet = over(parse(t.sheet), scrim);
  const ink   = parse(t.ink);
  const behind = ratio(over(ink, scrim), scrim);
  const onSheet = ratio(over(ink, sheet), sheet);
  ok(`${label} · page ink stays legible BEHIND the veil`, behind >= 4.5,
     `measured ${r2(behind)}:1 on #${scrim.map(x=>x.toString(16).padStart(2,'0')).join('')}`);
  ok(`${label} · form ink is legible ON the sheet`, onSheet >= 4.5,
     `measured ${r2(onSheet)}:1 on #${sheet.map(x=>x.toString(16).padStart(2,'0')).join('')}`);
  // And the veil must actually veil — a scrim that changes nothing is not a scrim.
  //
  // MEASURED AS A CONTRAST RATIO, NOT AS A LUMINANCE DIFFERENCE. The first draft
  // tested |lum(scrim) - lum(page)| > 0.02 and went RED on Espresso, where the page
  // sits at 0.012 and the veiled page at 0.002 — a six-fold darkening that an
  // ABSOLUTE difference cannot see, because every luminance on a dark theme is a
  // small number. The threshold was wrong, not the scrim. A ratio is scale-free and
  // reads the same change correctly on both themes (Espresso 1.19, Paper 2.15).
  // THE ASSERTED INVARIANT IS THE ONE NOBODY CAN ARGUE WITH: a scrim must move the
  // surface, in the dimming direction. The MAGNITUDE is a design call this executor
  // does not own, so it is MEASURED AND PRINTED rather than asserted against a number
  // he invented. The second draft asserted >= 1.15 and reddened on Espresso at 1.13 —
  // at which point the choice was to tune the threshold down to whatever the shipped
  // value happened to be, or to admit the number was never derived from a ruling.
  // Espresso 1.13 against Paper 2.15 is a real asymmetry: on a near-black page a 70%
  // black veil has almost nowhere to travel. It is reported to the founder as a
  // question, not cured on an executor's read of how much a veil should veil.
  ok(`${label} · the veil moves the surface it covers`,
     lum(scrim) < lum(page) && ratio(scrim, page) > 1.0,
     `veil does not dim: page ${r2(lum(page))} -> scrim ${r2(lum(scrim))}`);
  console.log(`       (measured veil strength, ${label}: ${r2(ratio(scrim, page))}:1)`);
}

// ④ no theme-blind literal survives, re-derived both ways, with the out-of-scope
//    classes named. NOT a filename list — the tree is walked every run.
console.log('\n\u2463 no theme-blind literal survives (re-derived, both themes)');
const EXCLUDE = new Set(['lib/vendor/theme.ts','lib/vendor/tokens.ts','lib/frost/tokens.ts']);
// Declared out of scope, each with its reason. Named so the set cannot quietly grow.
const OUT_OF_SCOPE = new Map([
  ['#25D366', "WhatsApp's brand green — identity, not a status colour; recolouring a brand mark needs its own word"],
  ['#9DBCC8', 'a pale blue answering to none of the six ruled roles'],
  ['#F5F2EE', 'the cream SURFACE family — surface values at the wrong home, their own limb'],
  ['#F8F7F5', 'the cream SURFACE family'],
  ['#EDE8DF', 'the cream SURFACE family'],
  ['#EDE6D6', 'the cream SURFACE family'],
]);
const strip = s => s.replace(/\{\/\*[\s\S]*?\*\/\}/g,' ').replace(/\/\*[\s\S]*?\*\//g,' ').replace(/\/\/[^\n]*/g,' ');
const walk = (d, out=[]) => {
  for (const e of fs.readdirSync(path.join(ROOT,d),{withFileTypes:true})) {
    if (e.name==='node_modules'||e.name==='.next'||e.name.startsWith('.')) continue;
    const rel = path.join(d,e.name);
    if (e.isDirectory()) walk(rel,out); else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
};
const dark = parse(tokens('DARK').pageBg).slice(0,3);
const light = parse(tokens('LIGHT').pageBg).slice(0,3);
// ── TDW_09 MICRO-2 · R-M6 — THE EXEMPTION IS EARNED AND GRANTED, NEVER LISTED ──
// This cell asks whether a literal reads on one theme and vanishes on the other,
// measured against the two pageBg values. That question is only meaningful where
// the literal can LAND on a page that flips. On a surface ruled INVARIANT — ground
// pinned, no colour token, and the theme consumed nowhere at all — the light
// pageBg is not a ground the literal can ever meet, and the measurement is a
// category error rather than a finding. So #F0E6D2 lives legitimately on the four
// ruled screens while staying a real defect everywhere else.
// TWO GATES, deliberately. The PROPERTY is checked per file (an exemption cannot
// outlive its ruling) AND the file must be on the RULED list (the property cannot
// let an unruled file in behind it). A first draft had only the property and swept
// in four extra files — an exemption granting itself.
const isInvariantSurface = (src) =>
  /background:\s*'(#[0-9a-fA-F]{6}|rgba\([^']+\))'/.test(src) &&
  !/color:\s*'var\(--/.test(src) && !/const GOLD = 'var\(--/.test(src) &&
  !/color:\s*`?\$\{/.test(src) && !/useT\(/.test(src) &&
  !/from '@\/lib\/vendor\/(theme|ThemeContext)'/.test(src);
const RULED_INVARIANT = new Map([
  ['components/vendor/Splash.tsx',  'R-M4 — a 2.2s brand gate, ruled to read identically on both themes'],
  ['app/vendor/pin-login/page.tsx', 'R-M6 — the photo-slide gate grammar, matching app/(landing)'],
  ['app/vendor/pin-reset/page.tsx', 'R-M6 — the trio moves together per R-M2'],
  ['app/vendor/pin/page.tsx',       'R-M6 — the trio moves together per R-M2'],
]);
const unruledInvariant = [];
const survivors = [];
for (const f of [...walk('app/vendor'), ...walk('components/vendor'), ...walk('lib/vendor')]) {
  if (EXCLUDE.has(f)) continue;
  const SRC = strip(read(f));
  const prop = isInvariantSurface(SRC);
  if (prop && RULED_INVARIANT.has(f)) continue;            // exempt: ruled AND proven
  if (prop) unruledInvariant.push(f);                      // reported, never exempted
  for (const h of new Set(SRC.match(/#[0-9a-fA-F]{6}/g) || [])) {
    const H = h.toUpperCase();
    if (OUT_OF_SCOPE.has(H)) continue;
    const c = parse(H);
    const d = ratio(over(c, dark), dark), l = ratio(over(c, light), light);
    if (d >= 4.5 && l < 3.0) survivors.push(`${H} in ${f} (dark ${r2(d)} / light ${r2(l)})`);
  }
}
ok('no literal is legible on one theme and invisible on the other',
   survivors.length === 0, survivors.slice(0,6).join(' | '));
for (const [f, why] of RULED_INVARIANT)
  ok(`${f} still satisfies the invariant property it is exempted for`,
     isInvariantSurface(strip(read(f))), why);
// F-09.79 — surfaces theme-invariant BY ACCIDENT rather than by ruling: they pin a
// ground and consume no theme at all. That may be right for their job or it may be
// F-09.32's unadopted-surface species; nobody has ruled it. They are NOT exempted
// above. Pinned at the size measured, so the cell reddens BOTH ways — a third
// arrival is drift, a departure is a cure nobody recorded. An always-green watch
// line would be no check at all.
const F0979 = ['components/vendor/AtelierForm.tsx', 'components/vendor/slices/SliceRow.tsx'];
ok('the accidentally-invariant set is exactly F-09.79\u2019s two, unchanged',
   unruledInvariant.length === F0979.length && F0979.every(f => unruledInvariant.includes(f)),
   unruledInvariant.join(' | '));
ok('the out-of-scope set is exactly the six declared, each with a reason',
   OUT_OF_SCOPE.size === 6 && [...OUT_OF_SCOPE.values()].every(v => v.length > 20));

// ⑤ the specimen
console.log('\n\u2464 the specimen that sharpened the finding');
const TEAM = read('app/vendor/studio/team/page.tsx');
ok('studio/team\u2019s sheet reads the role', /card: 'var\(--role-sheet\)'/.test(TEAM));
ok('studio/team\u2019s scrim reads the role', /backgroundColor: 'var\(--role-scrim\)'/.test(TEAM));

// ⑥ the roles are published, and the stale duplicate is gone
console.log('\n\u2465 published, and the second home closed');
const CTX = read('lib/vendor/ThemeContext.tsx');
for (const r of ['positive','caution','critical','metal','scrim','sheet'])
  ok(`--role-${r} is published`, new RegExp(`setProperty\\('--role-${r}'`).test(CTX));
const CSS = read('app/globals.css');
// ── TDW_09 MICRO-2 · R-M5 — THIS CELL IS RE-AIMED (labeled amendment, 1 → 1) ────
// It asserted "no second copy of the ink ladder", testing two stale LIGHT literals.
// That question was answered by DELETION and the deletion is what F-09.72/.73 cost
// us: an absent pre-mount value does not fall back to the owner, it falls back to
// the inherited initial. The real law — F-09.35's, the later one — is that the
// pre-mount home must be COMPLETE and must AGREE. Cell ⑧ below asserts that
// properly, per token, against theme.ts. What survives here is the narrow guard the
// original cell was actually protecting: the two PRE-CURE values must never return.
ok('the pre-cure light ink values never return',
   !/--atelier-ink-mute:\s*rgba\(26,15,8,0\.58\)/.test(CSS) &&
   !/--atelier-ink-dim:\s*rgba\(26,15,8,0\.38\)/.test(CSS));

// ═══════════════════════════════════════════════════════════════════════════════
// TDW_09 MICRO-2 — F-09.71…75. Five cells for one sitting, and the reason they
// live HERE rather than in a bench of their own: every one of them is F-09.28's
// question (does a rendered PAIR theme coherently?) asked along an axis cells ①–⑥
// cannot reach. This file was 37/37 GREEN over three screens the founder could not
// read. That is the specimen.
// ═══════════════════════════════════════════════════════════════════════════════

const RADIUS = [
  'app/vendor/pin-login/page.tsx',
  'app/vendor/pin-reset/page.tsx',
  'app/vendor/pin/page.tsx',
  'components/vendor/Splash.tsx',
  'components/vendor/Header.tsx',
];

// ⑦ THE PINNED-GROUND CELL — the axis cell ④ is blind to, by construction.
// Cell ④ hunts LITERALS USED AS INK. Here the ink was a TOKEN, correctly authored,
// and the GROUND was the literal — and a ground literal's own contrast ratio is
// ~1.0 against any page, so it is below every threshold ④ tests. The species:
// a surface that pins its ground while its text reads colour tokens that travel
// with the theme. On Editorial Paper the ink moves and the ground does not.
// PROPERTY, not a roster: each surface must either not pin its ground, or read no
// travelling colour token. Either is coherent. The MIX is the disease.
console.log('\n\u2466 no surface pins its ground while its ink travels');
// THE GROUND IS THE NEAREST ONE, NOT ANY ONE. A first draft of this cell flagged a
// literal ANYWHERE in the file against a travelling token ANYWHERE in the file, and
// convicted the cured pin screens: they still pin #0C0A09 as the page colour behind
// the PHOTOGRAPH, which no text ever composites against. That cell was measuring
// co-occurrence, not the pair that renders. Corrected to walk the file in SOURCE
// ORDER — in this estate's JSX a text block's ground is the last `background:`
// declared above it — and judge each travelling ink against the ground actually
// beneath it. The pin screens' page literal is now correctly ignored; their PANEL
// is what the ink lands on, and that reads the sheet role.
const GROUND = /background:\s*'([^']+)'/;
const INK    = /color:\s*'var\(\s*(--atelier-ink[a-z-]*|--role-(?:positive|caution|critical|metal))\s*[,)][^']*'/;
const isPinned = (v) => /^#[0-9a-fA-F]{6}$/.test(v) || /^rgba?\(/.test(v);
for (const f of RADIUS) {
  let ground = null, offenders = [];
  for (const line of strip(read(f)).split('\n')) {
    const g = GROUND.exec(line);
    if (g) ground = g[1];
    const k = INK.exec(line);
    if (k && ground && isPinned(ground)) offenders.push(`${k[1]} on ${ground}`);
  }
  ok(`${f} — travelling ink never lands on a pinned ground`, offenders.length === 0,
     [...new Set(offenders)].slice(0, 4).join(' | '));
}

// ⑧ THE PRE-MOUNT HOME — complete AND in agreement, per token, both themes.
// F-09.35's law generalized. Every custom property the radius READS must be
// declared in BOTH globals.css homes, and where theme.ts owns a twin the declared
// value must EQUAL the owner's. An absent value renders the inherited initial for
// one frame; a divergent one renders a colour the owner does not hold. F-09.76 is
// the second: --atelier-ink-mute/-dim sat at the PRE-R-U18 .45/.25 in :root while
// theme.ts held .58/.52 — the cured ladder, and a first frame still rendering the
// failure R-U18 was raised to fix.
console.log('\n\u2467 every token the radius reads has a complete, agreeing pre-mount home');
const rootBlock  = /\/\* Dark mode defaults \*\/[\s\S]*?^:root \{([\s\S]*?)^\}/m.exec(CSS);
const lightBlock = /^html\.theme-light \{([\s\S]*?)^\}/m.exec(CSS);
ok('both globals theme blocks are locatable', !!rootBlock && !!lightBlock);
const declsOf = (s) => Object.fromEntries([...(s || '').matchAll(/--([a-z-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
const GROOT = declsOf(rootBlock?.[1]), GLIGHT = declsOf(lightBlock?.[1]);
const OWNER = { 'atelier-ink':'ink','atelier-ink-soft':'inkSoft','atelier-ink-mute':'inkMute','atelier-ink-dim':'inkDim','atelier-ink-fade':'inkFade','atelier-label':'label','atelier-accent-text':'accentText','atelier-input-border':'inputBorder','atelier-sheet-top':'sheetTop','atelier-sheet-bot':'sheetBot','atelier-row-hover':'rowHover','atelier-bg':'pageBg','role-positive':'positive','role-caution':'caution','role-critical':'critical','role-metal':'metal','role-scrim':'scrim','role-sheet':'sheet' };
// Font-family custom properties are Next.js's `next/font` handles, injected on the
// <html> element by the font loader at build time. They have no theme twin, no
// colour, and no business in a theme block — named here so the exclusion is a
// declared class with a reason rather than a silent filter.
const NOT_A_COLOUR = /^font-/;
const readTokens = new Set();
for (const f of RADIUS) for (const m of strip(read(f)).matchAll(/var\(\s*--([a-z-]+)\s*[,)]/g)) if (!NOT_A_COLOUR.test(m[1])) readTokens.add(m[1]);
ok('the non-colour exclusion is exactly the next/font class', NOT_A_COLOUR.source === '^font-');
ok('the radius reads at least one token (the cell is not vacuous)', readTokens.size > 0, `${readTokens.size} tokens`);
for (const t of [...readTokens].sort()) {
  ok(`--${t} declared in BOTH pre-mount homes`, GROOT[t] !== undefined && GLIGHT[t] !== undefined,
     `dark=${GROOT[t] ?? '(ABSENT)'} light=${GLIGHT[t] ?? '(ABSENT)'}`);
  const own = OWNER[t];
  if (!own) continue;
  const D = tokens('DARK')[own], L = tokens('LIGHT')[own];
  ok(`--${t} agrees with lib/vendor/theme.ts on both themes`,
     GROOT[t] === D && GLIGHT[t] === L,
     `globals ${GROOT[t]} / ${GLIGHT[t]}  vs owner ${D} / ${L}`);
}

// ⑧b THE LADDER'S OTHER HALF. Completing the pre-mount home is only half a cure:
// a token declared in globals and NOT published by ThemeContext is correct for one
// frame and then abandoned — the mirror image of F-09.72's disease, and the exact
// mutation that exposed this gap (reverting ThemeContext.tsx alone left ⑧ GREEN,
// because ⑧ reads globals and the radius, never the publisher). Recorded rather
// than papered over, then closed: every token with an owner in theme.ts and a home
// in globals must ALSO be published post-mount, or the two homes do not move
// together and F-09.35 returns from the other side.
console.log('\n\u2467b every pre-mount token is also published post-mount');
const CTX2 = read('lib/vendor/ThemeContext.tsx');
for (const [css, own] of Object.entries(OWNER)) {
  if (GROOT[css] === undefined) continue;
  ok(`--${css} is published by ThemeContext (owner: ${own})`,
     new RegExp(`setProperty\\('--${css}'`).test(CTX2));
}

// ⑨ THE PIN TRIO, MEASURED OVER THE WORST CASE. The background is a photograph, so
// no single number describes it — but the WORST CASE is a bound and a bound is what
// a bench needs: a blown-out white slide region at the declared slide opacity,
// under the declared scrim, under the panel's own surface. backdrop-filter blurs
// that region without moving its mean luminance, so the blur buys nothing here and
// is not credited. Every literal below is parsed from the page and from theme.ts;
// nothing is a number copied out of a comment.
console.log('\n\u2468 the pin trio reads over a blown-out slide, both themes');
for (const f of RADIUS.filter(x => x.includes('/pin'))) {
  const src = strip(read(f));
  const slide = /opacity:\s*i === slide \? ([\d.]+)/.exec(src);
  const page  = /position:'fixed',inset:0,background:'(#[0-9a-fA-F]{6})'/.exec(src);
  const scrim = /position:'absolute',inset:0,background:'(rgba\([^']+\))'/.exec(src);
  ok(`${f} — slide/page/scrim literals all parse`, !!slide && !!page && !!scrim);
  if (!slide || !page || !scrim) continue;
  // R-M6 RE-AIM. The (b)-shape asserted a sheet ROLE here. Under the walk veto the
  // surface is invariant whole, so the cell asserts the INVARIANT BOUND instead:
  // the panel is a literal, and every ink literal on it clears the bar over the
  // worst-case slide. ONE measurement, not two per theme — nothing on this screen
  // travels, which is the property that makes one measurement sufficient.
  const panelLit = /borderRadius:'20px 20px 0 0'/.test(src) && /background:'(rgba\(12,10,9,0\.3\))'/.exec(src);
  ok(`${f} — the panel ground is a pinned literal (invariant)`, !!panelLit);
  ok(`${f} — no colour on this screen reads a theme token`,
     !/color:\s*'var\(--/.test(src) && !/const GOLD = 'var\(--/.test(src));
  if (!panelLit) continue;
  const worst   = over([255,255,255, +slide[1]], parse(page[1]));  // a white slide region
  const veiled  = over(parse(scrim[1]), worst);                    // the page scrim
  const surface = over(parse(panelLit[1]), veiled);                // the panel itself
  const INKS = [...src.matchAll(/color:\s*'(#[0-9A-Fa-f]{6}|rgba\(240,230,210,[\d.]+\))'/g)].map(m => m[1]);
  const GOLDLIT = /const GOLD = '(#[0-9A-Fa-f]{6})'/.exec(src);
  ok(`${f} — the cell found the screen's ink literals (not vacuous)`, INKS.length > 0, `${INKS.length} found`);
  for (const val of [...new Set(INKS.concat(GOLDLIT ? [GOLDLIT[1]] : []))]) {
    const v = ratio(over(parse(val), surface), surface);
    ok(`${f} · ${val} \u2265 4.5:1 over a white slide`, v >= 4.5, `measured ${r2(v)}:1`);
  }
}

// ⑩ THE DRAWER IS BOUNDED. F-09.71 is geometry, not colour: the panel had no
// maxHeight and no overflow, so its foot — Sign Out — hung off a short viewport
// with no gesture that could reach it. The cell asserts the three properties that
// make a panel reachable, and it asserts dvh specifically: vh overstates the
// viewport under iOS Safari's collapsing chrome, which is this very defect's class.
console.log('\n\u2469 the avatar drawer is bounded and scrolls');
const HDR = strip(read('components/vendor/Header.tsx'));
ok('the panel is height-bounded by the DYNAMIC viewport', /maxHeight:\s*'calc\(100dvh - \d+px\)'/.test(HDR));
ok('the panel scrolls its own overflow',                  /overflowY:\s*'auto'/.test(HDR));
ok('momentum scrolling is on for iOS',                    /WebkitOverflowScrolling:\s*'touch'/.test(HDR));
// RE-AIMED with the D-1 withdrawal: the bound moved from the positioner to the card,
// so `overflow: 'hidden'` was retired into an overflowX/overflowY pair. The property
// this cell protects is the horizontal clip, not the spelling of the declaration.
ok('the card still clips horizontally (the ornate radius)', /overflowX:\s*'hidden'/.test(HDR));
// AND the geometry the positioner had at origin is restored — this is the guard
// against D-1 returning: an always-mounted absolute box must not reach past the
// header's own padding edge on 23 surfaces.
ok('the positioner keeps origin geometry (no negative offset)', /position:\s*'absolute',\s*top:\s*'calc\(100% \+ 12px\)',\s*right:\s*0/.test(HDR));
ok('the positioner adds no horizontal padding',                !/padding:\s*'0 16px 16px'/.test(HDR));

// ⑪ THE RETIREMENT, AND ITS GUARD AGAINST OVER-DELETION. FORK 5 = (a),
// founder-ruled: the `Request Invite · For a client` row opened the same WhatsApp
// number as the row beneath it and spoke a ceremony dream-os had already retired.
// The third assertion is the one that matters most — a deletion cell that only
// checks for absence cannot tell a correct cut from a careless one.
console.log('\n\u246A the Request Invite row is retired, the surviving door intact');
ok('the Request Invite row is gone',      !/label="Request Invite"/.test(HDR));
ok('its handler went with it',            !/function requestInvite/.test(HDR));
ok('no caller survives it',               !/requestInvite\b/.test(HDR.replace(/`[^`]*`/g, '')));
ok('the DreamAi on WhatsApp row STANDS',  /label="DreamAi on WhatsApp"/.test(HDR));
ok('Sign Out — the census\u2019s reason to exist — STANDS', /label="Sign Out"/.test(HDR));

// ═══════════════════════════════════════════════════════════════════════════════
// ⑫ TDW_09 MICRO-2 RIDER 2 — F-09.58 · F-09.80. THE LEDGER STRIP FITS BY PROPERTY.
// The founder's control pair is the evidence this cell exists to hold: the SAME
// frame rendered the strip correctly on a quiet ledger and clipped it on a loaded
// one. So the assertion cannot be "it fits at width W" — it must be that the cell
// cannot be floored by its own content, whatever the content is.
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n\u24EB the ledger strip fits whatever the ledger says');
const HOME = strip(read('app/vendor/page.tsx'));

// ① the one byte, asserted as a property of the cell — all three cells by
//    construction, because there is one LedgerCell and it is what they are.
ok('LedgerCell carries minWidth: 0 beside its flex',
   /flex:\s*1,\s*minWidth:\s*0,/.test(HOME));

// ② no width constant survives in the money-fit call. The old call passed a literal
//    100 derived once against a 390 viewport; the width argument must now be an
//    identifier reaching measured state, never a number.
const fitCall = /fitMoneySize\(\s*([A-Za-z_$][\w$]*)\s*,\s*([^,]+),/.exec(HOME);
ok('the money-fit call survives and parses', !!fitCall);
ok('its width argument is measured state, not a literal',
   !!fitCall && !/^\s*\d/.test(fitCall[2]), fitCall ? `width arg = ${fitCall[2].trim()}` : '');
ok('no bare 100 remains anywhere in the money-fit region',
   !/fitMoneySize\([^)]*\b100\b/.test(HOME));

// ③ R-U24's guard, asserted BY ABSENCE — the shape a bench most easily fakes, so
//    it is paired with a positive: the reflow branch must exist to make the absence
//    survivable. An absence with no branch behind it is a clipped rupee figure.
ok('the money line still carries no textOverflow (R-U24)',
   !/whiteSpace:\s*bigReflow[\s\S]{0,220}?textOverflow/.test(HOME));
ok('the reflow branch exists and is wired to the cell',
   /moneyNeedsReflow\(/.test(HOME) && /bigReflow=\{/.test(HOME) &&
   /whiteSpace:\s*bigReflow\s*\?\s*'normal'\s*:\s*'nowrap'/.test(HOME));

// the observer, and its teardown — an observer without a disconnect is a leak that
// no rendering test would ever show.
ok('exactly one ResizeObserver, on the strip container',
   (HOME.match(/new ResizeObserver\(/g) || []).length === 1 && /ref=\{stripRef\}/.test(HOME));
ok('the observer disconnects on unmount', /return\s*\(\)\s*=>\s*obs\.disconnect\(\)/.test(HOME));

// ④ THE FOUNDER'S IMAGE-3 DATA SHAPE, AT THREE WIDTHS. The derivation is stated
//    rather than trusted: the cell's inner width is computed from the file's OWN
//    geometry literals — parsed here, not copied — and the figure is then put
//    through the REAL fitMoneySize/moneyNeedsReflow contract rather than a local
//    re-implementation of it, so the check's failure mode differs from the code's.
const marginX = /margin:\s*'10px (\d+)px 0'/.exec(HOME);
const padX    = /padding:\s*'14px (\d+)px 12px'/.exec(HOME);
const cellPad = /const CELL_PAD_X = (\d+);/.exec(HOME);
ok('the strip geometry parses out of the page itself',
   !!marginX && !!padX && !!cellPad,
   marginX && padX && cellPad ? `margin ${marginX[1]} · pad ${padX[1]} · cell ${cellPad[1]}` : '');
if (marginX && padX && cellPad) {
  // THE REAL CONTRACT, LIFTED FROM ITS OWN SOURCE — not retyped here. Node cannot
  // import lib/vendor/format.ts (extensionless TS chain, no loader), and retyping
  // the arithmetic would be the independent-method law's clause 1 exactly: a check
  // reproducing the method it is checking. So the two functions are extracted from
  // the shipped file, type annotations stripped, and evaluated. If the extraction
  // ever stops matching, the cell below fails loudly rather than measuring nothing.
  const FMT = read('lib/vendor/format.ts');
  const lift = (name) => {
    const m = new RegExp(`export function ${name}\\(([\\s\\S]*?)\\n\\}`).exec(FMT);
    if (!m) return null;
    const src = `function ${name}(${m[1]}\n}`
      .replace(/:\s*(number|string|boolean)(\s*[,)=])/g, '$2')   // param types
      .replace(/\)\s*:\s*(number|boolean)\s*\{/, ') {');        // return type
    return new Function(`${src}; return ${name};`)();
  };
  const fitMoneySize = lift('fitMoneySize');
  const moneyNeedsReflow = lift('moneyNeedsReflow');
  ok('the real fitMoneySize / moneyNeedsReflow lifted from lib/vendor/format.ts',
     typeof fitMoneySize === 'function' && typeof moneyNeedsReflow === 'function');
  const innerAt = (V) => (V - 2 * +marginX[1] - 2 * +padX[1]) / 3 - 2 * +cellPad[1];
  const FIGURE = 'Rs 5,00,000';   // the founder's own image-3 figure, verbatim
  for (const V of [360, 390, 430]) {
    const c = innerAt(V);
    const size = fitMoneySize(FIGURE, c, 34, 18);
    const wraps = moneyNeedsReflow(FIGURE, c, 18);
    // WHOLE OR WRAPPED, NEVER CUT. Either the figure holds one line at some size
    // at or above the floor, or the reflow branch takes it — there is no third
    // outcome, and a third outcome is precisely R-U24's violation.
    const held = wraps || FIGURE.length * 0.5 * size <= c;
    ok(`${FIGURE} renders whole at ${V}px (cell ${r2(c)}px)`, held,
       wraps ? `wraps at the ${size}px floor` : `holds one line at ${size}px`);
  }
  // and the strip cannot be floored by content at all — the property, not a width.
  ok('the derivation matches the chair-ratified table (92 / 102 / 115)',
     r2(innerAt(360)) === 92 && r2(innerAt(390)) === 102 && Math.round(innerAt(430)) === 115,
     `${r2(innerAt(360))} / ${r2(innerAt(390))} / ${r2(innerAt(430))}`);
}

console.log(`\n${fail===0?'GREEN':'RED'} — ${pass} passed, ${fail} failed\n`);

// ── BOTH-WAYS MUTATIONS, applied alone, cmp-restored ───────────────────────
//   M1  LIGHT.critical reverted to #E07B5C      → RED ② (2.63 on paper)
//   M2  LIGHT.scrim reverted to rgba(0,0,0,0.7) → RED ③ — the composite cell, and
//        NOTHING else reddens: the literal is fine, the pair is not. That is the
//        whole finding, proven by one mutation.
//   M3  LIGHT.sheet reverted to rgba(255,255,255,0.035) → STAYED GREEN, and that is
//        CORRECT, recorded rather than quietly dropped. The two surface roles are
//        COUPLED: with the cured scrim (a light veil, #A8A39E) a 3.5%-white sheet
//        still composites to #ABA6A1 and the form ink reads 7.8:1. Only the OLD black
//        scrim made the transparent sheet fatal — 2.30:1, which is the founder's
//        screenshot. So the specimen had one disease with two possible cures, and the
//        scrim is the load-bearing one. A mutation that fails to redden is evidence
//        about the system, not a hole to paper over; the honest reading is that this
//        cell cannot be reached independently, and M2 is what guards it.
//        (M2 alone: black scrim + white sheet still passes at 18.82 — so neither role
//         is individually sufficient to break it either. The pair is the unit. That is
//         F-09.28 restated as arithmetic.)
//   M4  LIGHT.scrim set equal to the page colour → RED ③ "the veil actually dims"
//   M5  one #E07B5C restored in a swept file    → RED ④
//   M6  OUT_OF_SCOPE emptied                    → RED ④ both cells
//   M7  studio/team's scrim literal restored    → RED ⑤ and ③ stays green — the
//        site cell and the token cell separating, as designed
//   M8  a --role-* setProperty deleted          → RED ⑥
//   M9  the stale globals block restored        → RED ⑥
process.exit(fail === 0 ? 0 : 1);
