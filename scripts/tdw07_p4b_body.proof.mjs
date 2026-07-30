#!/usr/bin/env node
// scripts/tdw07_p4b_body.proof.mjs
// TDW_07 P4b BODY — the dreamos-pwa half's floor.
//
// WHAT THIS BENCH IS FOR:
//   F1-b  the ONE couple-facing renderer, and the canvas's chrome/gestures surviving it
//   F5    the route-based preview mount
//   F4    the rate-max retirement's pwa half (submit form, Discover Profile, score mirror)
//   F-07.15  scoreDiscover's death, including its two quieter consumers
//   F-07.16  the money register, and F-07.27's ruled dormancy beside it
//
// WHAT IT CANNOT PROVE, STATED SO NOBODY READS MORE INTO A GREEN THAN IS THERE:
// this bench proves WIRING and TEXT. It cannot prove the preview looks like the card on a
// phone. Pixel parity is an AFFORDANCE truth and only the founder's device settles it
// (BENCHED-THE-MECHANISM-NOT-THE-AFFORDANCE, protocol §10) — the walk card names it as such.
// What IS proven mechanically is the thing that makes drift impossible: one component, one
// shaper, and no second implementation for a screenshot to disagree with.
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — inherited, ORDER LOAD-BEARING: line comments first, block second.
// It matters acutely in this sitting: the cure is heavily commented and several comments
// QUOTE the register they retired — the ₹ glyph and the strings "Rs 1.5L onwards" and
// "rate_max" all survive in prose at the very sites that no longer perform them. A cell
// reading raw text would convict on the explanation. Cells judge CODE.
const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => raw(rel)
  .replace(/(^|[^:])\/\/.*$/gm, '$1')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

const VIEW    = 'components/shared/VendorProfileView.tsx';
const CANVAS  = 'app/(frost)/frost/canvas/discover/page.tsx';
const PREVIEW = 'app/vendor/discover/preview/page.tsx';
const PROFILE = 'app/vendor/discover/profile/page.tsx';
const PORT    = 'app/vendor/portfolio/page.tsx';
const SUBMIT  = 'app/vendor/discover/submit/page.tsx';
const BAR     = 'components/vendor/CommandBar.tsx';
const MUSE    = 'app/(frost)/frost/canvas/muse/page.tsx';
const SANCT   = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const DEMO    = 'app/demodiscover/page.tsx';
const CARD    = 'app/(landing)/discover/VendorCard.tsx';
const API     = 'lib/vendor/api/vendor.ts';

const GLYPH = '\u20b9';

// ═══════════════════════════════════════════════════════════════════════════════
sec('§1 · THE ONE RENDERER EXISTS (F1-b)');

ok('§1.1 components/shared/VendorProfileView.tsx exists',
  fs.existsSync(path.join(ROOT, VIEW)));
ok('§1.2 it is props-driven with the spec\'s mode contract',
  /mode: 'live' \| 'preview'/.test(raw(VIEW)));
ok('§1.3 it fetches NOTHING — spec P4.1, "no data fetching inside"',
  !/fetch\(|useEffect/.test(code(VIEW)));
ok('§1.4 isBlind travels with it, so the preview cannot lie in blind mode',
  /isBlind/.test(code(VIEW)));
ok('§1.5 the Circle TAP is raised to the mount — button content, toast chrome',
  /onCircleTap/.test(code(VIEW)));
ok('§1.6 the toast itself did NOT travel — it stays canvas-side',
  !/circleToast/.test(code(VIEW)) && /circleToast/.test(code(CANVAS)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§2 · TWO MOUNTS, ONE COMPONENT — no second implementation anywhere');

// ELEMENT-BOUNDARY MATCH, AND THE FIRST DRAFT DID NOT HAVE IT — DISCLOSED.
// These read /<VendorProfileView/ and a mutation renaming the element to
// `<VendorProfileViewX` passed GREEN: the regex matched the prefix of the wrong element.
// The cell asserted a substring, not a mount. Found by the mutation ledger, which is what
// the ledger is for. `[\s/>]` forces the match to end at an element boundary.
ok('§2.1 the canvas MOUNTS the shared component',
  /<VendorProfileView[\s/>]/.test(code(CANVAS)) && /components\/shared\/VendorProfileView'/.test(raw(CANVAS)));
ok('§2.2 the preview MOUNTS the same component',
  /<VendorProfileView[\s/>]/.test(code(PREVIEW)) && /components\/shared\/VendorProfileView'/.test(raw(PREVIEW)));
ok('§2.3 the canvas passes mode="live"',    /mode="live"/.test(code(CANVAS)));
ok('§2.4 the preview passes mode="preview"', /mode="preview"/.test(code(PREVIEW)));

// THE LOAD-BEARING ABSENCE. A second copy of the profile markup anywhere is a failed
// session by the spec's own words. Asserted as an absence across the whole app tree, not
// at the two files we happen to remember.
const tsxFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx$/.test(e.name)) tsxFiles.push(path.relative(ROOT, p));
  }
})(ROOT);

// The Lock Date control is the couple-facing profile's fingerprint. Any COUPLE-PLANE file
// rendering it that is not the shared component is a second profile implementation.
//
// SCOPED TO THE COUPLE PLANE, AND THE FIRST DRAFT WAS NOT — DISCLOSED. Written against the
// whole tree, this cell convicted app/admin/control-room and app/admin/money, which use the
// words "Lock Date" for the DEPOSIT PRODUCT (Lock Date Revenue, Lock Date minimum, TDW cut
// of Lock Date). Same string, different meaning, different plane. A cell that convicts on a
// word rather than on the thing the word names is the "true about the wrong thing" class
// the P4a seat filed six times; caught here on this cell's first run.
const COUPLE_PLANE = tsxFiles.filter(f =>
  f.startsWith('app/(frost)/') || f.startsWith('app/demodiscover') ||
  f.startsWith('app/(landing)/discover') || f === VIEW);
const lockDateRenderers = COUPLE_PLANE.filter(f => /<Lock size=/.test(code(f)));

// ── F-07.29, FILED NOT FIXED, AND NAMED HERE SO IT CANNOT BE FORGOTTEN ────────────────
// app/demodiscover/page.tsx carries its OWN GlassOverlay — a full second implementation of
// the couple-facing profile (Enquire, Lock Date, Circle, the starting price), on the demo
// subdomain. The spec's §3 guardrail says a second implementation anywhere is a failed
// session, and this one predates P4b: it was not created this sitting and the P4b charter
// scoped demodiscover as a MONEY site only (:211), which is the only part of it this
// sitting was ruled to touch.
//
// It is NOT converted here, and the refusal is deliberate rather than lazy. The demo variant
// differs behaviourally — its Lock Date is TAPPABLE and toasts "coming soon" where the real
// one is disabled, and its Circle toasts "Sign in to add to your Circle" — so folding it in
// means growing the shared component a demo mode, which is a design decision nobody ruled.
// Doing that silently, at the end of a long sitting, on a surface outside the charter, is
// how scope becomes damage.
//
// THE EXEMPTION CARRIES ITS NUMBER so this cell never reddens silently and never narrows
// quietly. Converting demodiscover must delete this entry, not edit it.
const SECOND_PROFILE_FILED = new Set(['app/demodiscover/page.tsx']);   // F-07.29
const unexplained = lockDateRenderers.filter(f => f !== VIEW && !SECOND_PROFILE_FILED.has(f));
ok('§2.5 the couple plane has ONE profile renderer, plus F-07.29 filed and named',
  lockDateRenderers.includes(VIEW) && unexplained.length === 0,
  `unexplained: ${unexplained.join(', ')}`);
ok('§2.5b F-07.29\'s duplicate is still exactly ONE file — the second profile has not spread',
  lockDateRenderers.filter(f => SECOND_PROFILE_FILED.has(f)).length === 1);
ok('§2.6 the canvas no longer carries the profile markup it used to own',
  !/Lock Date/.test(code(CANVAS)));

// IgChip / FeaturedEyebrow moved rather than being copied.
const igChipDefs = tsxFiles.filter(f => /function IgChip\(/.test(code(f)));
ok('§2.7 IgChip has exactly ONE definition in the estate',
  igChipDefs.length === 1 && igChipDefs[0] === VIEW, `found: ${igChipDefs.join(', ')}`);
const eyebrowDefs = tsxFiles.filter(f => /function FeaturedEyebrow\(/.test(code(f)));
ok('§2.8 FeaturedEyebrow has exactly ONE definition in the estate',
  eyebrowDefs.length === 1 && eyebrowDefs[0] === VIEW, `found: ${eyebrowDefs.join(', ')}`);

// ═══════════════════════════════════════════════════════════════════════════════
sec('§3 · THE CANVAS\'S CHROME AND GESTURES SURVIVED (spec §3 guardrail)');

const C = code(CANVAS);
for (const [n, tok] of [
  ['§3.1 onTouchStart wired',      'onTouchStart={onTouchStart}'],
  ['§3.2 onTouchMove wired',       'onTouchMove={onTouchMove}'],
  ['§3.3 onTouchEnd wired',        'onTouchEnd={onTouchEnd}'],
  ['§3.4 the drag origin ref',     'dragStartY'],
  ['§3.5 the dismiss threshold',   'OVERLAY_DISMISS'],
  ['§3.6 the drag transform',      'translateY(${dragDelta}px)'],
  ['§3.7 the glass sheet token',   'GLASS.sheet'],
]) ok(n, C.includes(tok));
ok('§3.8 the overlay still owns its own dismiss — the component did not take onClose',
  /onClose/.test(C) && !/onClose/.test(code(VIEW)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§4 · THE PREVIEW MOUNT (F5)');

ok('§4.1 the route exists at /vendor/discover/preview',
  fs.existsSync(path.join(ROOT, PREVIEW)));
ok('§4.2 it is ROUTE-based, not a modal — dismiss is the phone\'s own back',
  /router\.back\(\)/.test(code(PREVIEW)));
ok('§4.3 it calls the server\'s preview endpoint and assembles no card itself',
  /fetchDiscoverPreview/.test(code(PREVIEW)));
ok('§4.4 the client hits the ruled path',
  /'\/api\/v2\/vendor\/discover\/preview'/.test(raw(API)));
ok('§4.5 it passes enquireLink={null} — a vendor does not enquire with himself',
  /enquireLink=\{null\}/.test(code(PREVIEW)));
ok('§4.6 the paused line renders on the SERVER\'s fact, never a client guess',
  /data\.discover_paused &&/.test(code(PREVIEW)));
ok('§4.7 the approval line renders only while not live',
  /!data\.is_live/.test(code(PREVIEW)));

// ── COPY, BYTE-EXACT. Five founder-vetoed strings; a veto is on the BYTES. ──
ok('§4.8 copy ② PREVIEW ribbon',
  />\s*PREVIEW\s*</.test(raw(PREVIEW)));
ok('§4.9 copy ③ the approval line, byte-exact',
  raw(PREVIEW).includes('This is your profile as couples will see it — approval unlocks it on Discover.'));
ok('§4.10 copy ⑤ the pause line, byte-exact',
  raw(PREVIEW).includes('Paused — hidden from Discover right now.'));
ok('§4.11 copy ① on the Discover Profile, byte-exact',
  raw(PROFILE).includes('See your profile as couples do'));
ok('§4.12 copy ① on the portfolio surface too — the spec names BOTH',
  raw(PORT).includes('See your profile as couples do'));
ok('§4.13 copy ④ "Starting at" renders where a starting price renders',
  /Starting at \{formatRs\(/.test(code(VIEW)));
ok('§4.14 neither preview button gates on approval — F5\'s pre-approval reach',
  !/discover_eligible[^\n]*See your profile/.test(raw(PROFILE)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§5 · THE MONEY REGISTER (F-07.16)');

// The couple-facing surfaces, named. Admin (the sanctioned dark cockpit) and the vendor's
// own calendar/cabinet are OUT of this cell's scope by ruling, not by omission.
const COUPLE = [VIEW, CANVAS, MUSE, SANCT, DEMO, PREVIEW];

for (const f of COUPLE) {
  ok(`§5.1 no L/K/Cr money short form in code — ${path.basename(path.dirname(f))}/${path.basename(f)}`,
    !/`Rs \$\{[^`]*\}(L|K|Cr) onwards`/.test(code(f)) &&
    !/\$\{[^}]*\/ ?100000[^}]*\}L/.test(code(f)));
}
ok('§5.2 sanctuary\'s fmtRs now DELEGATES to the one donor rather than minting a register',
  /const fmtRs = \(n:number\) => formatRs\(n\);/.test(code(SANCT)));
ok('§5.3 both of sanctuary\'s duplicate formatters were cured, not just the first',
  (code(SANCT).match(/=> formatRs\(n\)/g) || []).length === 2);
ok('§5.4 muse renders through the donor',   /formatRs\(save\.vendor_starting_price\)/.test(code(MUSE)));
ok('§5.5 demodiscover renders through the donor', /formatRs\(vendor\.starting_price\)/.test(code(DEMO)));
ok('§5.6 the shared renderer renders through the donor', /formatRs\(vendor\.starting_price\)/.test(code(VIEW)));
ok('§5.7 the donor is the LOCKED register — Rs, grouped en-IN, no glyph',
  /CURRENCY_PREFIX/.test(raw('lib/vendor/format.ts')) &&
  /toLocaleString\('en-IN'\)/.test(raw('lib/vendor/format.ts')) &&
  raw('lib/vendor/tokens.ts').includes("CURRENCY_PREFIX = 'Rs'"));

// ── THE GLYPH CELL, WITH ITS EXEMPTIONS NAMED IN THE OPEN ──────────────────────────────
// Two exemptions, each carrying its finding number so the cell can never redden silently
// and can never be narrowed quietly:
//
//   F-07.27  app/(landing)/discover/VendorCard.tsx — a DEAD surface (its endpoint
//            /api/v2/discovery/feed does not exist) whose units are underivable. Ruled
//            dormant-by-comment; converting it would have been authoring money from a
//            conjecture. Re-wiring that surface MUST re-open this cell.
//
//   F-07.28  sanctuary's seven `Amount (₹)`-class INPUT LABELS, and the BUDGET_OPTIONS
//            filter bands. These annotate a unit or name a bracket; they do not render a
//            vendor's figure. They are off-register and they are NOT cured here, because
//            changing them is couple-facing copy and copy needs the founder's veto.
//            Filed, not fixed. This cell asserts they have not GROWN.
const GLYPH_EXEMPT = new Set([CARD]);
const LABEL_GLYPH_BUDGET = 7;   // sanctuary's input-label glyphs at the P4b body tip

for (const f of COUPLE) {
  if (GLYPH_EXEMPT.has(f)) continue;
  const n = (code(f).match(new RegExp(GLYPH, 'g')) || []).length;
  const allowed = f === SANCT ? LABEL_GLYPH_BUDGET : 0;
  ok(`§5.8 no unexplained glyph in code — ${path.basename(path.dirname(f))}/${path.basename(f)}`,
    n === allowed, `found ${n}, allowed ${allowed}`);
}
// COUNT-PINNED, AND THE FIRST DRAFT WAS NOT — DISCLOSED. This read `/F-07.27/.test(...)`,
// and a mutation blanking the FIRST of the file's two mentions passed GREEN because the
// second still satisfied the regex. A presence test over a repeated token cannot notice a
// partial deletion. Both mentions are load-bearing — one opens the dormancy note, one binds
// the bench's exemption to it — so the count is pinned rather than the presence.
ok('§5.9 F-07.27\'s exemption is NAMED at BOTH its sites, not silently carried by this bench',
  (raw(CARD).match(/F-07\.27/g) || []).length === 2 && /DORMANT BY COMMENT, RULED/.test(raw(CARD)));
ok('§5.10 the dead endpoint is named in the dormancy note, so re-wiring re-opens the question',
  /api\/v2\/discovery\/feed/.test(raw(CARD)));
ok('§5.11 F-07.27\'s bytes are UNCHANGED — dormancy is not a half-cure',
  /card\.price_min >= 100 \? /.test(code(CARD)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§6 · THE RETIREMENT\'S PWA HALF (F4, WIDENED)');

ok('§6.1 the submit form no longer holds rateMax state', !/rateMax/.test(code(SUBMIT)));
ok('§6.2 the submit form no longer renders a Max field', !/Max \(Rs\)/.test(code(SUBMIT)));
ok('§6.3 the submit form no longer sends rate_max',      !/rate_max/.test(code(SUBMIT)));
ok('§6.4 its step gate is min-only, mirroring the server exactly',
  /\(step === 1 && !rateMin\)/.test(code(SUBMIT)));
ok('§6.5 the request contract dropped rate_max — no client demanding a discarded field',
  !/rate_min: number; rate_max: number;/.test(code(API)));
ok('§6.6 the Discover Profile\'s Max field is gone — it would have been a DEAD CONTROL',
  !/Max \(Rs\)/.test(code(PROFILE)));
ok('§6.7 the Discover Profile no longer saves or dirties on rate_max',
  !/rate_max/.test(code(PROFILE)));
ok('§6.8 its score mirror follows the server\'s min-only predicate',
  /rate:   \{ met: o\.rateMin !== '', gap: o\.rateMin !== '' \? 0 : 1, partial: false \}/.test(code(PROFILE)));
ok('§6.9 the "top of your rate range" hint retired with the bound',
  !/Add the top of your rate range/.test(raw(PROFILE)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§7 · scoreDiscover IS DEAD (F-07.15) — including its quieter consumers');

ok('§7.1 the function is gone',                       !/function scoreDiscover/.test(code(BAR)));
ok('§7.2 nothing calls it',                           !/scoreDiscover\(/.test(code(BAR)));
ok('§7.3 the stale >= 5 portfolio floor died with it',
  !/portfolio_summary\?\.approved \?\? 0\) >= 5/.test(code(BAR)));
ok('§7.4 the both-bounds rate check died with it',    !/v\.rate_min && v\.rate_max/.test(code(BAR)));
ok('§7.5 the bar still EXISTS — a control is not deleted because its data was wrong',
  /title="Discover Profile"/.test(code(BAR)));
ok('§7.6 it still routes the vendor to the surface',
  /router\.push\('\/vendor\/discover'\)/.test(code(BAR)));
ok('§7.7 it asserts NO percentage it has no authority for',
  /aside="open"/.test(code(BAR)) && /pct=\{0\}/.test(code(BAR)));
ok('§7.8 the collapsed strip\'s "Discover NN%" retired with the score',
  !/Discover \$\{discover\.pct\}%/.test(code(BAR)));
ok('§7.9 the progress dot that read the dead number retired too',
  !/pct: discover\.pct/.test(code(BAR)));

console.log(`\n${fail === 0 ? 'GREEN' : 'RED'}  tdw07_p4b_body ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
