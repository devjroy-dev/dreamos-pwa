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

// ── RETIRED AT R-35.36 (M-LEADS-TRUTH), RETIRE-WITH-THE-READER ───────────────
// The four cells below pinned THEME TOKENS INSIDE
// app/vendor/discover/leads/page.tsx — the storefront Leads dashboard. That page
// no longer has a body: R-35.36 retired it to a REDIRECT STUB, because its
// `leads.source === 'discover'` filter could never see enquiries that
// createLead's phone-dedupe returned untouched, so it rendered "No TDW leads
// yet." over a real enquiry the vendor had just been alerted about (F-16.21).
//
// THEIR SUBJECT WAS DELETED BY RULING, so they are retired WITH it. They are not
// repointed (Business Leads is a different surface with its own coverage, and
// aiming a cell one surface over is CE-119's named error), and they are not
// deleted in silence (a vanished cell teaches the next reader nothing, and
// §4.2 in particular existed to catch an OVER-DELETION — the exact failure mode
// a silent removal would hide).
//
// WHAT SURVIVES: §4.1's law — gold-alpha-as-INK must be zero — is now
// structurally guaranteed on this page, since a stub has no colour declarations
// at all. §4.5 below asserts the page is still a stub, so the guarantee cannot
// lapse by someone rebuilding the dashboard here.
  ok('§4.5 the retired page is still a STUB, so §4.1 zero-gold-ink holds by construction',
    /router\.replace/.test(LEADS) && !/rgba\(201,168,76,/.test(strip(LEADS)),
    'the Leads dashboard has regrown a body here; the retired cells assumed it never would');
}

sec('§5 · THE DISCLOSED EXTENSION — the insight line, ratify-or-revert');
// §5.1 RETIRED WITH §4.2–§4.4, same ruling, same reason: the insight line it
// pinned lived on the retired dashboard. The ratify-or-revert extension it
// tracked was ratified and then removed WITH ITS WHOLE PAGE, which is the
// strongest possible form of "reverted" and needs no cell to watch it.
ok('§5.2 THE PER-SITE GUARD — the leads page carries ZERO pinned-cream inks while the Discover hero keeps its ONE (same literal, two grounds, opposite verdicts — the P-2 law walked)',
  !/rgba\(240,230,210/.test(strip(LEADS)) && (strip(DISC).match(/rgba\(240,230,210,0\.78\)/g) || []).length === 1);
// §5.2 SURVIVES DELIBERATELY: its law is a CONTRAST between two pages — the same
// literal, two grounds, opposite verdicts. The stub trivially satisfies its half,
// and the Discover hero's half is the half that was ever at risk.


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
// \u00a76.5 \u2014 AMENDED, LABELLED. CE-39 S2/8, F-39.6. THE TRIPWIRE FIRED AND IT WAS RIGHT.
// It read: the Swati string at the review card is SIGHTED-NOT-TOUCHED (F-09.9's queued
// family), and it reddened if a later hand deleted it OUTSIDE THAT FINDING'S OWN SITTING.
// This is that sitting's superseding ruling rather than a later hand: the founder met
// \u300cContact Swati to be considered.\u300d on the Couture screen, a census found eight sites, and
// CE-39 ruled F-39.6 with three bytes vetoed verbatim. The condition the cell guarded has
// been MET, not violated \u2014 and it caught the edit on the way past, which is the whole
// reason a sighted-not-touched pin is worth writing down.
//
// THE PIN DOES NOT SIMPLY GO. What it protected was that the sentence not vanish without a
// ruling, so the cell now asserts the RULED END STATE: the person's name is gone from this
// page AND the sentence still exists, in the founder's bytes, read from the one home. A
// deletion with nothing in its place would still red here, which is what the pin was for.
ok('\u00a76.5 the review card speaks as the product \u2014 the real name gone, the founder\u2019s byte in its place from the one home (F-39.6, supersedes the F-09.9 pin)',
  !/reviewed by Swati/.test(strip(DISC))
  && /COPY\.discoverApplicationPending/.test(DISC)
  && /discoverApplicationPending:\s*'Your application is with TDW\./.test(
       read('lib/worklist/copy.ts')));

console.log(`\n──────── tdw09_walkrider: ${pass}/${pass + fail} ────────`);
process.exit(fail === 0 ? 0 : 1);
