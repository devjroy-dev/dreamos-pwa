#!/usr/bin/env node
// scripts/tdw07_p1_discover.proof.mjs — TDW_07 P1's pwa half.
//
// The engine bench (dream-os scripts/b07_p1_bench.js) proves the feed's ORDER and
// SHAPE. This harness proves the four things that live only in this repo:
//   §1  DiscoverVendor declares the three additive fields  (F-07.3's cure)
//   §2  the IG deep-link helper: both forms, the probe, the system handoff
//   §3  the Discover ranking group exists in the admin config page (smoke ④'s thumb-path)
//   §4  THE GESTURE LAW — every handler, constant and timer in the discover canvas is
//       byte-present and unmoved; the chip's carve-out is the ONLY consumer of touches
//
// Runnable from any working directory. Mutations are listed at the foot and were run
// against production source, cmp-restored.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
// ── LABELED AMENDMENT (F-07.52, CE-ruled) · THE STRIPPER, PORTED ──────────────
// Lifted VERBATIM from scripts/tdw07_p4b_body.proof.mjs:35-38 — the estate's one
// comment-stripper, lines first then blocks then JSX blocks. Ported rather than
// re-authored so the two proofs cannot drift into two definitions of "code".
// ── F-07.99 CURED · THE PORT THAT WAS NEVER WIRED ────────────────────────────
// F-07.52 ported the stripper here VERBATIM from p4b_body "so the two proofs
// cannot drift into two definitions of code". The port was never called: a
// `grep -c stripComments` on this file returned 1, its own definition, and every
// cell below read RAW for a whole block while CE-120 named this bench exposed to
// the swallow. One home nobody lives in. The definition now comes from the shared
// module AND the reads below actually pass through it; §0's invocation cell
// proves the call-site exists, because a definition without one has already
// fooled this estate once.
// COUNT HELD: 35/35 before and after the wiring, derived by command.

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const section = (t) => console.log(`\n${t}`);

const TYPES = stripComments(read('lib/types/discover.ts'));
const IG    = stripComments(read('lib/frost/igLink.ts'));
const ADMIN = stripComments(read('app/admin/config/page.tsx'));
// ── LABELED AMENDMENT · TDW_07 P6 · F-07.43 「 F-D 」 (CE-ruled) ──────────────────────
// `PAGE` WAS THE ORPHAN DECK. The founder folded canvas/discover into sanctuary's Discover
// room and that route is now a redirect. Every §4 cell below asserted the couple's gesture
// and card-band laws against a file with ZERO inbound navigation — so they were guarding a
// surface no couple could reach, and after the fold they would be guarding a stub.
// PAGE is re-pointed at SANCTUARY: the deck the founder walks. Not one law is relaxed; the
// cells look where the deck now lives, and for the first time they look where she is.
const PAGE  = stripComments(read('app/(frost)/frost/canvas/sanctuary/page.tsx'));

// ── LABELED AMENDMENT (TDW_07 P4b · F1-b) — THE CHIP AND THE EYEBROW MOVED HOUSE. ──────
// P1's §4 cells asserted IgChip and FeaturedEyebrow's properties against the canvas file,
// which is where both components were DEFINED at the time. P4b extracted the couple-facing
// profile into components/shared/VendorProfileView.tsx so the vendor's preview mounts the
// identical renderer, and the two components moved with it (MOVED, not copied — the canvas
// imports them back, and the P4b harness pins that exactly one definition of each exists).
//
// NOT ONE PROPERTY IS RELAXED. Every cell below asserts the same thing it always did; the
// only change is that it looks where the code now lives. `SURFACE` is the two files read as
// one, because the deck's rendered surface IS both files after the extraction — the cells
// were always about what a couple sees, never about which file it was typed in.
const VIEW_ = stripComments(read('components/shared/VendorProfileView.tsx'));
const SURFACE = PAGE + '\n' + VIEW_;


// ═════════════════════════════════════════════════════════════════════════════
// §0 · THE CANARY — TDW_STRIPPER_CANARY (CE-120's law; F-07.74's cure)
// ═════════════════════════════════════════════════════════════════════════════
// The retired stripper treated the `/*` inside `accept="image/*"` as a comment
// open and deleted to the next real `*/`. Every absence-cell downstream of that
// deletion was acquitting over code it could not see — proven per instance by the
// plant-inside-the-bite probe, which stayed GREEN with the forbidden specimens
// planted inside the bite and REDDENS under the cure.
//
// The anchors below are LIVE CODE at the head, waist and tail of this bench's
// principal subject file. If a future stripper eats a region it eats one of them
// and this section reddens FIRST. §0.X drives the stripper directly (the mechanism,
// not the source — a planted `image/*` in production code is correctly harmless
// now), §0.Y is its vacuity twin, and §0.Z is F-07.99's cell: a definition with no
// call-site fooled this estate for a whole block, so the call-site is asserted.
section('§0 · THE CANARY — the stripper must not swallow live code');
{
  const _c = stripComments(read('app/(frost)/frost/canvas/sanctuary/page.tsx'));
  ok('§0.1 canary survives stripping — page.tsx: const prevReceipts = receipts;', _c.includes('const prevReceipts = receipts;'));
  ok('§0.2 canary survives stripping — page.tsx: function fmtTime(t:string|null):string {', _c.includes('function fmtTime(t:string|null):string {'));
  ok('§0.3 canary survives stripping — page.tsx: const saveTags=async()=>{', _c.includes('const saveTags=async()=>{'));
  ok('§0.4 canary survives stripping — page.tsx: 0%,100% { opacity:0.5; box-shadow:0 0 6px ${', _c.includes('0%,100% { opacity:0.5; box-shadow:0 0 6px ${accent}44; }'));
  ok('§0.5 canary survives stripping — page.tsx: const touchStartX = useRef(0);', _c.includes('const touchStartX = useRef(0);'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
              return (self.match(/\bstripComments\s*\(/g) || []).length >= 2; })());
}

section('§1 · DiscoverVendor declares its contract (F-07.3 cured)');
ok('§1.1 is_demo is declared — the wire has sent it since the two-branch feed was born',
  /is_demo\?:\s*boolean/.test(TYPES));
ok('§1.2 instagram_handle is declared', /instagram_handle\?:\s*string \| null/.test(TYPES));
ok('§1.3 featured is declared', /featured\?:\s*boolean/.test(TYPES));
ok('§1.4 ALL THREE are OPTIONAL — the sanctuary feed and the demo subdomain compile untouched',
  ['is_demo', 'instagram_handle', 'featured'].filter(f => new RegExp(`${f}\\?:`).test(TYPES)).length === 3);
ok('§1.5 the pre-existing ten fields survive (count asserted, not sampled)',
  ['id', 'name', 'category', 'city', 'routing_handle', 'starting_price', 'photos', 'vibe_tags', 'about', 'enquire_link']
    .filter(f => new RegExp(`\\n\\s*${f}:`).test(TYPES)).length === 10);

section('§2 · THE IG DEEP LINK (D-3)');
ok('§2.1 the app scheme is instagram://user?username=', IG.includes('instagram://user?username='));
ok('§2.2 the https fallback is https://instagram.com/', IG.includes('https://instagram.com/'));
ok('§2.3 the probe delay is 300ms', /IG_FALLBACK_MS\s*=\s*300/.test(IG));
ok('§2.4 the app link is a SAME-TAB assignment — a new tab would orphan a blank one',
  /window\.location\.href\s*=\s*igAppUrl/.test(IG));
ok('§2.5 the fallback is suppressed when the app took the handoff (document.hidden)',
  /document\.hidden/.test(IG));
ok('§2.6 the fallback opens _blank with noopener — system handoff, never in-app-jacked (spec §3)',
  IG.includes("'_blank'") && IG.includes('noopener'));
// ── LABELED AMENDMENT · TDW_07 P6 · F-07.7 cure (d) ────────────────────────────────
// The cure added a THIRD call site: on a fine pointer the web profile opens synchronously
// inside the tap's own activation window, so no popup heuristic fires. The law is
// untouched — every openInstagram call is inside a try — and the count follows the code.
ok('§2.7 openInstagram cannot throw into a gesture surface — ALL THREE calls are guarded',
  (IG.match(/catch\s*\{/g) || []).length === 3);
ok('§2.8 the URL builders are PURE — no window/document above openInstagram (native clause §6)',
  IG.slice(0, IG.indexOf('export function openInstagram')).indexOf('window.') === -1);
// The word appears once, in the native-clause comment asserting the file does not use
// it; the cell must convict a CALL, not a promise. Grepping the bare word would green
// on a comment that lies — the F-06.111 shape in a different costume.
ok('§2.9 the helper makes no localStorage CALL — the native clause holds mechanically',
  !/localStorage\s*\./.test(IG) && !/localStorage\.(get|set|remove)Item/.test(IG));

section('§3 · THE ADMIN RANKING GROUP (smoke ④\'s thumb-path)');
ok('§3.1 the group exists', ADMIN.includes("label: 'Discover ranking'"));
ok('§3.2 all three seeded keys are listed',
  ['discover.rank.w_spotlight', 'discover.rank.w_freshness', 'discover.rank.w_completeness']
    .filter(k => ADMIN.includes(`'${k}'`)).length === 3);
ok('§3.3 the keys carry EXPLICIT labels — keyLabel would parse them into a meaningless tier/period',
  /labels\?:/.test(ADMIN) && /group\.labels\?\.\[key\] \?\? keyLabel\(key\)/.test(ADMIN));
ok('§3.4 the input accepts fractions — a weight is not a whole number', /step:\s*'0\.05'/.test(ADMIN));
ok('§3.5 the four pre-existing token-cap groups are untouched (count asserted)',
  ['Vendor WhatsApp', 'Vendor PWA', 'Couple WhatsApp', 'Couple PWA']
    .filter(l => ADMIN.includes(`label: '${l}'`)).length === 4);
ok('§3.6 the group carries the note that a weight takes effect on the next fetch',
  /next fetch/.test(ADMIN));

section('§4 · THE GESTURE LAW — spec §3, byte-identical mechanics');
// ── LABELED AMENDMENT (TDW_07 P4b-FINAL) — THE CONSTANTS CHANGED ADDRESS, NOT VALUE. ──
// This asserted the six gesture constants were byte-present IN THE CANVAS. P4b-FINAL
// extracted the photo carousel to lib/frost/photoPager.ts so the vendor's preview runs the
// couple's mechanics rather than a second copy of them, and the constants went with it.
//
// THE CHAIR RESTATED THE GESTURE-STABILITY LAW FOR EXACTLY THIS: an extraction cannot leave
// bytes where they were, so the law's object is the COUPLE'S MECHANICS, not the byte
// position. This cell is proof part (a) and it is STRONGER than what it replaces — it pins
// each value at the new home AND pins that the canvas no longer declares its own, which the
// old form could not do. A second copy left behind at the old address would have satisfied
// the old cell perfectly while letting the two mounts drift.
const PAGER_SRC = read('lib/frost/photoPager.ts');
// ── LABELED AMENDMENT · TDW_07 P6 · Fork 3(b) (CE-ruled) ─────────────────────────────
// THREE OF THE SIX VALUES MOVED, AND THE CELL FOLLOWS THE LAW RATHER THAN THE NUMBER.
// P4b pinned these at the CANVAS deck's values. P6's read-first derived that the canvas
// deck has zero inbound navigation — so the "deck" whose mechanics this cell protected is
// a surface no couple reaches, while the surface they DO reach (sanctuary's Discover room)
// ran 42/240/270 and had never joined this home. Fork 3(b) ruled the constants re-pinned
// to SANCTUARY's values: one home, and the couple's witnessed feel unchanged.
//
// COUNT PRESERVED (37). The assertion is not weakened — it is re-aimed at the ruled
// values, and it carries the PRE-FOLD literals below as a second arm so a silent drift
// BACK to 45/250/280 reddens this cell rather than passing it.
const GESTURE_BYTES = [
  'export const SWIPE_THRESHOLD = 42;',
  'export const SWIPE_VELOCITY  = 0.3;',
  'export const TAP_MAX_MOVE    = 10;',
  'export const TAP_MAX_TIME    = 240;',
  'export const DOUBLE_TAP_MS   = 270;',
  'export const OVERLAY_DISMISS = 80;',
];
// The retired values. Present at the shared home again = a regression to the unreachable
// deck's feel, and this cell is the thing that says so.
const RETIRED_GESTURE_BYTES = [
  'export const SWIPE_THRESHOLD = 45;',
  'export const TAP_MAX_TIME    = 250;',
  'export const DOUBLE_TAP_MS   = 280;',
];
ok('§4.1 every swipe/tap constant is byte-present at the SHARED home at its RULED value, and no retired value has grown back (all six)',
  GESTURE_BYTES.filter(b => PAGER_SRC.includes(b)).length === GESTURE_BYTES.length &&
  RETIRED_GESTURE_BYTES.every(b => !PAGER_SRC.includes(b)));
ok('§4.1b the canvas declares NONE of them — one home, so the two mounts cannot drift',
  !/^const SWIPE_THRESHOLD/m.test(PAGE) && !/^const TAP_MAX_MOVE/m.test(PAGE) &&
  !/^const OVERLAY_DISMISS/m.test(PAGE));
ok('§4.1c and it imports them back, so the deck still runs on the same numbers',
  /from '@\/lib\/frost\/photoPager'/.test(PAGE));

// MECHANISM, NOT RESEMBLANCE: sanctuary binds its handlers inline rather than by named
// reference, so the assertion names the bytes IT executes. The law is unchanged — the deck
// owns its touch lifecycle and nothing else consumes the surface.
ok('§4.2 the deck still binds onTouchStart and onTouchEnd and nothing else',
  PAGE.includes('onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}'));
// The panel's drag-dismiss, at sanctuary's own expression AND joined to the one home —
// the P6 re-aim caught this as an inline `80` and the cure joined it. A bare literal here
// again is the drift this cell now exists to redden.
ok('§4.3 the panel\'s drag-dismiss is intact and runs on the SHARED threshold',
  /if\(delta>OVERLAY_DISMISS\)\{setDelta\(0\);onClose\(\);\}/.test(PAGE));
ok('§4.4 the card band CONTAINER is pointerEvents:none — the swipe surface is unchanged outside the chip',
  /gap:8,\s*\n\s*pointerEvents:'none',/.test(PAGE));
ok('§4.5 the chip is the ONLY element that consumes its own touches',
  /onTouchStart=\{\(e: React\.TouchEvent\) => \{ e\.stopPropagation\(\); \}\}/.test(SURFACE));
ok('§4.6 the FEATURED eyebrow is non-interactive by construction',
  /FeaturedEyebrow[\s\S]{0,900}pointerEvents: 'none' as const/.test(SURFACE));
ok('§4.7 the eyebrow renders ONLY on featured — the Manual honesty law, marked when true',
  /function FeaturedEyebrow[\s\S]{0,200}if \(!featured\) return null;/.test(SURFACE));
ok('§4.8 the chip renders ONLY on a usable handle — on truth, or not at all',
  /function IgChip[\s\S]{0,320}if \(!h\) return null;/.test(SURFACE));
ok('§4.9 the eyebrow is Jost and letterspaced (V-2 as vetoed)',
  /FeaturedEyebrow[\s\S]{0,700}'Jost',sans-serif[\s\S]{0,300}letterSpacing: '0\.28em'/.test(SURFACE));
ok('§4.10 the eyebrow word is exactly FEATURED', /\n\s*FEATURED\n\s*<\/span>/.test(SURFACE));
ok('§4.11 the card chip is withheld while the panel is open — it cannot sit under the sheet',
  /!isBlind&&!panelOpen&&vendor&&\(vendor\.featured\|\|vendor\.instagram_handle\)/.test(PAGE));
ok('§4.12 blind mode withholds the handle exactly as it withholds the name (identity is identity)',
  /\{!isBlind && vendor\.instagram_handle && \(/.test(SURFACE));
ok('§4.13 the chip carries no gold — the screen\'s one gold stays Enquire\'s (spec §3)',
  !/function IgChip[\s\S]{0,1400}#C9A84C/.test(SURFACE));
// LABELED AMENDMENT (F-07.52, CE-ruled): the cell counted RAW occurrences and
// went red when 5de3324's founder-ruled diagnosis COMMENT used the word
// "localStorage" in prose (page.tsx:864, inside a {/* */} block). The comment is
// evidence and STAYS — a green bought by deleting it is the cure this estate
// refuses by name (P2 precedent). The COUNT is what was wrong: it judged prose.
// Cells judge CODE. Same question, same number, now asked of code only.
// ── TWO CELLS RETIRED · TDW_07 P6 (CE-ruled: disclose 37 → 35, never pad) ───────────
// §4.14 asserted P1 added no localStorage to the canvas page, and §4.15 asserted the
// canvas's unreachable demo branch was left byte-untouched per F-07.1. Both had the same
// subject: `canvas/discover/page.tsx`, now a redirect.
//
// THEY DO NOT RE-AIM, AND SAYING SO IS THE POINT.
//
//   §4.15 is CLOSED BY THE FOLD. F-07.1 protected an unreachable demo branch from being
//   "fixed" by someone who could not see it was dead. The fold DELETED that branch, so the
//   finding is closed not because it was cured but because the ground it stood on no
//   longer exists — a distinct closure class, and this retirement is its witness.
//
//   §4.14 cannot be re-aimed HONESTLY. Sanctuary reads localStorage at :43-:45 — bytes
//   that predate this sitting and sit outside its fence. Pointing this cell at sanctuary
//   would redden on code P6 never wrote; weakening it to pass would be worse. It retires,
//   and the remainder is FILED to F-07.70's charter (the room's storage discipline) BY
//   NAME, so the gap travels with an owner instead of evaporating into a green count.
//
// THE COUNT FALLS 37 → 35 AND IS DISCLOSED IN THE FLOOR LINE. A count held level by
// inventing two cells would be the floor-method law's hazard wearing a green.


console.log('');
console.log('§5 · MUTATION LEDGER (production source, cmp-restored)');
console.log('      P-1  igLink.ts: `instagram://user?username=` → `https://instagram.com/`  ⇒ §2.1 RED');
console.log('      P-2  igLink.ts: IG_FALLBACK_MS 300 → 0                                  ⇒ §2.3 RED');
console.log('      P-3  VendorProfileView.tsx: FeaturedEyebrow `if (!featured) return null;` deleted ⇒ §4.7 RED');
console.log('      P-4  page.tsx: card band pointerEvents \'none\' → \'auto\'                  ⇒ §4.4 RED');
console.log('      P-5  config page: the Discover ranking group removed                     ⇒ §3.1/§3.2 RED');
console.log('      P-6  types: `is_demo?: boolean` deleted                                  ⇒ §1.1/§1.4 RED');

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw07_p1_discover ${pass}/${total}` : `RED — tdw07_p1_discover ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
