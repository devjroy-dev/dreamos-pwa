#!/usr/bin/env node
// scripts/tdw09_walkrider.proof.mjs — TDW_09 · THE WALK RIDER (F-09.85/.86/.87)
// Three founder-walked specimens, one small ZIP. Cells per cure, both-ways run
// per file at delivery. THE PER-SITE LAW GUARDED IN §4: the same literal is
// correct on one ground and diseased on another — a sweep that cannot tell
// them apart is the disease wearing the cure's clothes.

import fs from 'fs';
let pass = 0, fail = 0;
function ok(n, c, w) { if (c) { pass++; console.log('  ok  ', n); } else { fail++; console.log('  FAIL', n, w ? `— ${w}` : ''); } }
function sec(t) { console.log('\n' + t); }
function read(p) { return fs.readFileSync(p, 'utf8'); }
function strip(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1'); }

const DISC = read('app/vendor/discover/page.tsx');
const LEADS = read('app/vendor/discover/leads/page.tsx');
const MAST = read('components/vendor/slices/Masthead.tsx');
const ROW = read('components/vendor/slices/SliceRow.tsx');

sec('§1 · F-09.85 — the Discover photo gate joins the-landing-is-the-law');
ok('§1.1 the headline ink is PINNED cream, the themed token gone from the overlay',
  /color: '#F0E6D2', lineHeight: 1\.08/.test(DISC)
  && !/color: 'var\(--atelier-ink\)', lineHeight: 1\.08/.test(DISC));
ok('§1.2 the eyebrow is PINNED to the dark-rendered gold (label use over the scrim, not body — F-09.3 untouched)',
  /color: '#C9A84C', marginBottom: 14,/.test(DISC));
ok('§1.3 the R-M6 mechanism comment names WHY (a photo-gate\u2019s ink pins with its scrim)',
  /F-09\.85/.test(DISC) && /pins with its scrim/i.test(DISC.replace(/\n\s*/g, ' ')));
ok('§1.4 the tagline\u2019s original pinned cream is UNMOVED — it was the pattern, not a patient',
  /rgba\(240,230,210,0\.78\)/.test(DISC));

sec('§2 · THE VETOED COPY — founder word (a), verbatim, the old line dead');
ok('§2.1 「 Appear before couples planning their wedding. 」 renders (the <br/> split preserved)',
  /Appear before couples<br \/>planning their wedding\./.test(DISC));
ok('§2.2 「 qualified brides 」 is dead in CODE (its epitaph may live in comments)',
  !/qualified brides/.test(strip(DISC)));

sec('§3 · F-09.86 — the Masthead sub-line takes the body voice');
ok('§3.1 the sub-line wears F.body at 16', /fontFamily: F\.body, fontWeight: 300, fontSize: 16/.test(MAST));
ok('§3.2 F.body resolves on the shared const (a font key that does not exist is a silent CSS no-op)',
  /body:\s+'var\(--font-dm-sans\)/.test(ROW));
ok('§3.3 the two DRIFTED CITATIONS are dead — the header\u2019s 「 a Jost 10 sub-line NAMING 」 claim and the prop doc\u2019s 「 Jost 10 line naming 」 (the F-09.86 epitaph lawfully narrates the old value; a cell that reads epitaphs convicts the graveyard — first cut of this cell did exactly that, corrected here)',
  !/a Jost 10 sub-line NAMING/.test(MAST) && !/Jost 10 line naming/.test(MAST));

sec('§4 · F-09.87 — the leads page\u2019s gold inks themed; the \u25c6 plug wears the page');
{
  // METHOD, stated: an INK is a `color:` declaration; a hairline/wash is a
  // border/background. The ruling cured inks per-site and left F-09.84's
  // hairline class queued — so §4.2 asserts the hairlines REMAIN (an
  // over-deletion is a silent widening of a ruling and reddens here).
  const goldInk = (strip(LEADS).match(/color:\s*'rgba\(201,168,76,[0-9.]+\)'/g) || []);
  ok('§4.1 gold-alpha-as-INK count on the page is ZERO (method: color: declarations only)',
    goldInk.length === 0, goldInk.join(' | '));
  const goldLines = (strip(LEADS).match(/rgba\(201,168,76,[0-9.]+\)/g) || []);
  ok('§4.2 the hairline/wash family REMAINS (F-09.84\u2019s queued class, not this rider\u2019s) — at least 8 non-ink sites stand',
    goldLines.length >= 8, `found ${goldLines.length}`);
  ok('§4.3 the three cured eyebrows wear the themed label role', (LEADS.match(/color: A\.brassWarm, margin/g) || []).length === 3);
  ok('§4.4 the \u25c6 plug wears the themed page ground, the pinned espresso dead',
    /var\(--atelier-page-bg\) 0%, var\(--atelier-page-bg\) 60%/.test(LEADS)
    && !/#1F1612 0%, #1F1612 60%/.test(LEADS));
}

sec('§5 · THE DISCLOSED EXTENSION — the insight line, ratify-or-revert');
ok('§5.1 the insight line wears the themed soft ink; the extension is labelled in-file with its revert',
  /color: A\.inkSoft, lineHeight: 1\.5,/.test(LEADS) && /DISCLOSED EXTENSION \(ratify-or-revert\)/.test(LEADS));
ok('§5.2 THE PER-SITE GUARD — the leads page carries ZERO pinned-cream inks while the Discover hero keeps its ONE (same literal, two grounds, opposite verdicts — the P-2 law walked)',
  !/rgba\(240,230,210/.test(strip(LEADS)) && (strip(DISC).match(/rgba\(240,230,210,0\.78\)/g) || []).length === 1);


sec('\u00a76 \u00b7 THE SECOND SHOOT \u2014 the Discover page\u2019s own species members (LABELED GROWTH 15\u219220, founder-walked + copy-worded 2026-08-07)');
ok('\u00a76.1 the portfolio-ledger labels wear the themed label role, the 0.72 gold-alpha ink dead',
  /color: A\.brassWarm, marginTop: 12,/.test(DISC) && !/color: 'rgba\(201,168,76,0\.72\)'/.test(DISC));
ok('\u00a76.2 BOTH state-card italics wear the themed soft ink \u2014 zero pinned-cream 0.8 inks survive on the themed page',
  (DISC.match(/color: A\.inkSoft, lineHeight: 1\.5,/g) || []).length >= 2
  && !/rgba\(240,230,210,0\.8\)'/.test(DISC));
ok('\u00a76.3 the per-site law holds through the growth \u2014 the hero\u2019s scrim-grounded pinned cream (0.78) still stands, exactly one',
  (strip(DISC).match(/rgba\(240,230,210,0\.78\)/g) || []).length === 1);
ok('\u00a76.4 the founder\u2019s byte verbatim \u2014 \u300c As couples will see it, curated. \u300d, the brides line dead in code',
  /As couples will see it, curated\./.test(DISC) && !/As brides will see it/.test(strip(DISC)));
ok('\u00a76.5 the Swati string at the review card is SIGHTED-NOT-TOUCHED (F-09.9\u2019s queued family) \u2014 this cell reddens if a later hand deletes it outside that finding\u2019s own sitting',
  /reviewed by Swati/.test(DISC));

console.log(`\n──────── tdw09_walkrider: ${pass}/${pass + fail} ────────`);
process.exit(fail === 0 ? 0 : 1);
