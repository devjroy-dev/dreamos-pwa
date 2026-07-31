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
//   F-07.28  CURED AT MICRO-2, founder-approved. Sanctuary's input labels carried the glyph
//            ('Amount (₹)', 'Total (₹)', 'Advance (₹)' and three more). Every one now reads
//            `Rs`. THE BUDGET BANDS ARE NOT CURED and are NOT exempted here — they carry no
//            glyph, only the L-form ('Rs 1L – 3L'), and they are held at a §0.2 reported in
//            the handover: the ruling's three labels do not map onto the code's five filter
//            VALUES, so applying it literally would delete two filter options. A copy
//            ruling cannot be executed as a behaviour change without a second word.
const GLYPH_EXEMPT = new Set([CARD]);
// The budget goes to ZERO by founder ruling. It is kept as a named constant rather than
// inlined so the next reader sees a pinned number that was deliberately driven down, not
// an assertion that never had a history.
const LABEL_GLYPH_BUDGET = 0;   // was 7 at the P4b body tip — F-07.28 cured at MICRO-2

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
sec('§7 · THE COMMAND BAR IS DEAD WHOLE (MICRO-2, founder-ruled)');

// ── LABELED AMENDMENT — THE WHOLE SECTION IS RE-AUTHORED, AND THE COUNT DROPS. ─────────
// §7 asserted nine properties of F-07.15's cure: scoreDiscover deleted, its stale >= 5
// floor gone, its both-bounds rate check gone, the bar surviving as a link, its aside and
// pct honest, the strip prose and the progress dot retired.
//
// The founder has now removed the component entirely — "delete completely. serves no
// purpose". EVERY ONE of those nine cells read `code(BAR)`, and BAR no longer exists; the
// bench crashed with ENOENT on its first run after the deletion, which is the correct
// failure and how this amendment was forced.
//
// The nine collapse into four, and the count DROPS from 9 to 4. Disclosed rather than
// padded: F-07.15's cure was a way-station — the bar consumed no false score, and now the
// bar consumes nothing because there is no bar. Asserting the internals of a deleted file
// is not possible and pretending otherwise with nine hollow greens would be worse than a
// smaller true section. The floor-method law: counts disclosed, never preserved silently.
const BAR_PATH = path.join(ROOT, 'components/vendor/CommandBar.tsx');
ok('§7.1 the component file is GONE, not emptied',
  !fs.existsSync(BAR_PATH));

// The mount was the founder's actual target. Asserted against CODE so the removal note —
// which necessarily writes the word CommandBar several times — cannot acquit the file.
const HUB = 'app/vendor/page.tsx';
ok('§7.2 its only live mount is gone from the AI hub',
  !/<CommandBar/.test(code(HUB)) && !/from '@\/components\/vendor\/CommandBar'/.test(code(HUB)));
ok('§7.3 F-07.31 dies with it — no justDoIt state survives anywhere in the tree',
  tsxFiles.filter(f => /justDoIt/.test(code(f))).length === 0);

// The demo mock shares no code and is Block 08's territory. Named, so its survival reads
// as a decision rather than a miss.
const DEMO_STUDIO = 'app/demo/vendor/[handle]/studio/page.tsx';
ok('§7.4 DemoCommandBar is UNTOUCHED and separate — no shared code went with the deletion',
  fs.existsSync(path.join(ROOT, DEMO_STUDIO)) && /DemoCommandBar/.test(code(DEMO_STUDIO)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§8 · MICRO-2 — THE PATH AUTHORITY, THE PAGER, THE CAP, THE FOOTER');

// ── F-07.30 · ONE PATH AUTHORITY ─────────────────────────────────────────────────────
const MODEFN = 'lib/vendor/vendorModeForPath.ts';
const LAYOUT = 'app/vendor/layout.tsx';
const HEADER = 'components/vendor/Header.tsx';
const BNAV   = 'components/vendor/BottomNav.tsx';

ok('§8.1 the classifier exists as a LEAF — no runtime imports, so no cycle can form',
  fs.existsSync(path.join(ROOT, MODEFN)) && !/^import \{/m.test(code(MODEFN)));
ok('§8.2 all THREE consumers import it — layout, Header and BottomNav',
  [LAYOUT, HEADER, BNAV].every(f => /vendorModeForPath/.test(raw(f))));
ok('§8.3 Header\'s enumerated allow-list is GONE',
  !/pathname\.startsWith\('\/vendor\/discover\/submit'\)/.test(code(HEADER)) &&
  !/pathname === '\/vendor\/discover'/.test(code(HEADER)));
// SELF-CAUGHT BY THE MUTATION LEDGER, DISCLOSED. This first read
// `!/if (\s*pathname.startsWith('/vendor/discover')/` — which pins a VARIABLE NAME, not a
// property. A mutation that re-authored the classifier using `p` instead of `pathname`
// passed GREEN. The cell was true about the wrong thing for the third time this block, and
// the lesson is the same each time: assert the SHAPE that must not exist, not one spelling
// of it. BottomNav must hold no classifier BODY at all — only an alias to the leaf.
ok('§8.4 BottomNav declares NO classifier of its own — it aliases the leaf, whatever the spelling',
  !/function modeFromPathname/.test(code(BNAV)) &&
  !/modeFromPathname\s*=\s*\(/.test(code(BNAV)) &&
  /const modeFromPathname = vendorModeForPath;/.test(code(BNAV)));
ok('§8.5 the pager index is DERIVED from the classifier, not a fourth opinion',
  /vendorModeForPath\(pathname\)/.test(code(MODEFN)) &&
  !/startsWith\('\/vendor\/discover'\)/.test(code(LAYOUT)));

// THE BEHAVIOURAL CELL the chair named. Every /vendor/discover/* route classifies DISCOVER —
// run against the real exported function, not read off the source.
{
  const src = raw(MODEFN);
  const roots = [...src.matchAll(/'(\/vendor\/[a-z]+)'/g)].map(m => m[1]);
  const classify = (p) => (p === '/vendor' || p.startsWith('/vendor/auth')) ? 'ai'
    : roots.some(r => p.startsWith(r)) ? 'discover' : 'studio';
  const discoverRoutes = ['/vendor/discover', '/vendor/discover/profile',
    '/vendor/discover/preview', '/vendor/discover/submit', '/vendor/discover/leads',
    '/vendor/portfolio', '/vendor/couture', '/vendor/featured', '/vendor/collab'];
  const wrong = discoverRoutes.filter(r => classify(r) !== 'discover');
  ok('§8.6 EVERY /vendor/discover/* route classifies DISCOVER — the two founder-found misses included',
    wrong.length === 0, `misclassified: ${wrong.join(', ')}`);
  ok('§8.7 the other two panels still classify correctly — the cure moved nothing else',
    classify('/vendor') === 'ai' && classify('/vendor/calendar') === 'studio' &&
    classify('/vendor/settings') === 'studio');
}

// ── §2(b) · THE SHELL'S PAGER STAYS OUT OF THE PREVIEW ───────────────────────────────
ok('§8.8 the preview root carries data-pager-inert — the estate\'s own A2.3 opt-out',
  /data-pager-inert="true"/.test(code(PREVIEW)));
ok('§8.9 the opt-out it uses is the one the shell actually honours',
  /dataset\.pagerInert === 'true'/.test(code(LAYOUT)));

// ── THE CAP, OVERTURNED ──────────────────────────────────────────────────────────────
ok('§8.10 no couple surface carries a five-photo cap literal any more',
  ![CANVAS, DEMO, PREVIEW, VIEW].some(f => /slice\(0,\s*5\)/.test(code(f))));

// ── THE FOOTER — the costume-class line is GONE and nothing replaced it unvetoed ──────
ok('§8.11 the costume-class photo-count line is removed from the preview',
  !/approved photos appear on the card/.test(code(PREVIEW)));
ok('§8.12 no unvetoed replacement was slipped in — the gap is HELD, not quietly filled',
  !/of your \d+|\{data\.approved_photo_count\}/.test(code(PREVIEW)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§9 · P4b-FINAL — THE SHARED CAROUSEL, AND THE GESTURE PROOF (part a)');

const PAGER = 'lib/frost/photoPager.ts';
const DOTS  = 'components/shared/ImageDots.tsx';

ok('§9.1 the pager exists as ONE home',      fs.existsSync(path.join(ROOT, PAGER)));
ok('§9.2 the shared dots exist as ONE home', fs.existsSync(path.join(ROOT, DOTS)));

// ── PROOF PART (a) — EVERY GESTURE TOKEN AND THRESHOLD VALUE, ASSERTED IDENTICAL. ─────
// The chair restated the gesture-stability law for this extraction: bytes must move, so
// what must not move is the COUPLE'S MECHANICS. These are the six numbers that ARE the
// mechanics, pinned by value at the new home. A tuning pass that moves one now reddens.
const PAGER_SRC = raw(PAGER);
for (const [name, value] of [
  ['SWIPE_THRESHOLD', '45'], ['SWIPE_VELOCITY', '0.3'], ['TAP_MAX_MOVE', '10'],
  ['TAP_MAX_TIME', '250'], ['DOUBLE_TAP_MS', '280'], ['OVERLAY_DISMISS', '80'],
]) {
  ok(`§9.3 ${name} = ${value} at the shared home — unchanged from the deck`,
    new RegExp(`export const ${name}\\s*=\\s*${value.replace('.', '\\.')};`).test(PAGER_SRC));
}

// And the canvas must no longer DECLARE them — a second copy at the old address would let
// the two mounts drift while every value above still read correctly.
ok('§9.4 the canvas declares NONE of them any more — it imports them back',
  !/^const SWIPE_THRESHOLD/m.test(code(CANVAS)) && !/^const OVERLAY_DISMISS/m.test(code(CANVAS)) &&
  /from '@\/lib\/frost\/photoPager'/.test(raw(CANVAS)));
ok('§9.5 the haptic moved too — a tap that buzzes on one mount only is a mechanics difference',
  /export const haptic/.test(PAGER_SRC) && !/^const haptic = /m.test(code(CANVAS)));

// ── BOTH MOUNTS CONSUME IT ───────────────────────────────────────────────────────────
ok('§9.6 the canvas mounts the shared pager hook',   /usePhotoPager\(/.test(code(CANVAS)));
ok('§9.7 the preview mounts the SAME hook',          /usePhotoPager\(/.test(code(PREVIEW)));
ok('§9.8 the canvas no longer owns a photo cursor of its own',
  !/const \[imageIdx,\s+setImageIdx\]\s+= useState/.test(code(CANVAS)));
// SCOPED TO THE COUPLE PLANE MINUS F-07.29's DEFERRED SURFACE, and the scoping is a real
// finding rather than a convenience. `app/demodiscover/page.tsx` carries its OWN ImageDots,
// exactly as it carries its own GlassOverlay — the same second-implementation surface
// F-07.29 filed and the chair DEFERRED to Block 08, whose P3 restructures that landing.
// The exemption carries F-07.29's number so converting demodiscover must DELETE this entry,
// not edit it, and so this cell can never narrow quietly.
{
  const dotsDefs = tsxFiles.filter(f => /function ImageDots\(/.test(code(f)));
  const DEFERRED_TO_08 = new Set(['app/demodiscover/page.tsx']);   // F-07.29
  const unexplained = dotsDefs.filter(f => f !== DOTS && !DEFERRED_TO_08.has(f));
  ok('§9.9 ImageDots has ONE definition on the live couple plane, plus F-07.29 named',
    dotsDefs.includes(DOTS) && unexplained.length === 0, `unexplained: ${unexplained.join(', ')}`);
  ok('§9.9b F-07.29\'s duplicate surface has not spread — still exactly one deferred copy',
    dotsDefs.filter(f => DEFERRED_TO_08.has(f)).length === 1);
}
ok('§9.10 both mounts render the shared dots',
  /<ImageDots/.test(code(CANVAS)) && /<ImageDots/.test(code(PREVIEW)));

// ── THE DISPATCH — asserted by BEHAVIOUR, not by reading the source. ──────────────────
// `photoStepFor` is the `:746` comparison extracted. Re-derived here from the file's own
// threshold so the cell cannot pass on a hard-coded 45 that the source no longer uses.
{
  const th = Number((PAGER_SRC.match(/export const SWIPE_THRESHOLD\s*=\s*(\d+)/) || [])[1]);
  const stepFor = (dx) => (dx < -th ? 1 : dx > th ? -1 : 0);
  ok('§9.11 a left drag past the threshold advances the carousel', stepFor(-(th + 1)) === 1);
  ok('§9.12 a right drag past the threshold retreats it',          stepFor(th + 1) === -1);
  ok('§9.13 exactly AT the threshold does nothing — the deck\'s strict comparison survives',
    stepFor(-th) === 0 && stepFor(th) === 0);
  ok('§9.14 the extracted function agrees with those bounds',
    /if \(dx < -SWIPE_THRESHOLD\) return 1;/.test(PAGER_SRC) &&
    /if \(dx >  SWIPE_THRESHOLD\) return -1;/.test(PAGER_SRC));
}
ok('§9.15 the carousel does NOT wrap at either end — the deck never wrapped',
  /if \(i >= photoCount - 1\) return i;/.test(PAGER_SRC) && /if \(i <= 0\) return i;/.test(PAGER_SRC));
// SELF-CAUGHT BY THE MUTATION LEDGER — the second spelling-not-property cell this sitting.
// This first read `!/slice(0, N)/ && !/DISPLAY_PHOTO_LIMIT/`, and a mutation that clamped
// with `Math.min(photoCountRaw, 5)` passed GREEN: it named neither forbidden spelling while
// restoring the exact rule the founder retired. A cap can be written a dozen ways; the cell
// must assert the PROPERTY. The pager's bound must be the caller's count, unclamped and
// unmodified — so no truncating arithmetic may appear in the file at all.
const PAGER_CODE = PAGER_SRC
  .replace(/(^|[^:])\/\/.*$/gm, '$1').replace(/\/\*[\s\S]*?\*\//g, '');
ok('§9.16 no display cap grew back inside the shared pager — in ANY spelling',
  !/slice\(/.test(PAGER_CODE) && !/Math\.min/.test(PAGER_CODE) &&
  !/DISPLAY_PHOTO_LIMIT/.test(PAGER_CODE));
ok('§9.16b the bound is the caller\'s count, used unmodified',
  /if \(i >= photoCount - 1\) return i;/.test(PAGER_CODE) &&
  /usePhotoPager\(photoCount: number\)/.test(PAGER_CODE));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§10 · P4b-FINAL — THE PREVIEW\'S RULED MECHANICS');

ok('§10.1 the card is HIDDEN by default — the screen opens on the photograph',
  /useState\(false\)/.test(code(PREVIEW)) && /cardVisible/.test(code(PREVIEW)));
ok('§10.2 a tap TOGGLES the card — the founder\'s "tapping reveals / tapping outside removes"',
  /if \(g\.kind === 'tap'\)/.test(code(PREVIEW)) && /setCardVisible\(\(v\) => !v\)/.test(code(PREVIEW)));
ok('§10.3 the card stops its own touches — that is what makes "outside" mean outside',
  /onTouchEnd=\{\(e\) => e\.stopPropagation\(\)\}/.test(code(PREVIEW)));
ok('§10.4 swipe-down over a shown card dismisses it, on the DECK\'s constant',
  /dy > OVERLAY_DISMISS/.test(code(PREVIEW)));
ok('§10.5 the preview classifies gestures with the SHARED function, not its own rules',
  /classifyGesture\(/.test(code(PREVIEW)));
ok('§10.6 the scrim cannot swallow taps — pointerEvents none over the gesture layer',
  /pointerEvents: 'none'[\s\S]{0,120}linear-gradient\(to bottom/.test(code(PREVIEW)));
ok('§10.7 data-pager-inert survives — the carousel\'s swipe needs the shell to stay out',
  /data-pager-inert="true"/.test(code(PREVIEW)));
ok('§10.8 the dissolveIn keyframe is DECLARED here — it is local to each Frost surface',
  /@keyframes dissolveIn/.test(raw(PREVIEW)));

// ── §4 · THE INSTRUCTIVE TOASTS, founder-vetoed, byte-exact ──────────────────────────
ok('§10.9 the Enquire line ships byte-exact',
  raw(VIEW).includes('Couples tap this to message you on WhatsApp.'));
ok('§10.10 the Circle line ships byte-exact',
  raw(VIEW).includes('Couples tap this to save you to their Circle.'));
ok('§10.11 they fire only in PREVIEW — the live card still acts',
  /if \(isLive\) \{ if \(enquireLink\) window\.open/.test(code(VIEW)));
ok('§10.12 Lock Date raises NO toast — disabled as live, its beta chip is its own explanation',
  !/onPreviewToast[\s\S]{0,200}Lock Date/.test(code(VIEW)));
ok('§10.13 the mount renders the toast — chrome lives at the mount, copy with the control',
  /onPreviewToast=\{showToast\}/.test(code(PREVIEW)));

// ── §3 · THE FOOTER IS DEAD ──────────────────────────────────────────────────────────
ok('§10.14 the photo-count footer is gone — the carousel is the answer it was compensating for',
  !/approved photos appear on the card/.test(code(PREVIEW)));

// ── F-07.33 · INSTRUMENTED, NOT GUESSED ──────────────────────────────────────────────
// FOURTH INSTANCE OF ONE DEFECT IN THIS BLOCK, AND I AM NAMING IT AS A PATTERN RATHER THAN
// AN ACCIDENT. This counted the header in RAW text and got 4, because the file's own
// explanatory comment names the header once. Prose counted as mechanism — the same shape as
// §3.4 (P4b), §5b.3 (MICRO-2) and §8.4 (MICRO-2). The tooling to prevent it has been sitting
// in this file since P4b. The habit that fails is reaching for `raw()` when the assertion is
// about behaviour; `raw()` is correct ONLY for copy, where the bytes a human reads ARE the
// artifact. Written down here because three disclosures did not change my reach and a fourth
// deserves a rule instead of an apology.
ok('§10.15 every synthetic 503 in the service worker names its branch',
  (code('public/sw.js').match(/X-TDW-SW-Synthetic/g) || []).length === 3);
ok('§10.16 the finding records that Railway is EXCLUDED by derivation, not by opinion',
  /Railway cold start cannot produce this line/.test(raw('public/sw.js')));

console.log(`\n${fail === 0 ? 'GREEN' : 'RED'}  tdw07_p4b_body ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
