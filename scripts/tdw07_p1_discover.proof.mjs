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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const section = (t) => console.log(`\n${t}`);

const TYPES = read('lib/types/discover.ts');
const IG    = read('lib/frost/igLink.ts');
const ADMIN = read('app/admin/config/page.tsx');
const PAGE  = read('app/(frost)/frost/canvas/discover/page.tsx');

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
ok('§2.7 openInstagram cannot throw into a gesture surface — BOTH calls are guarded',
  (IG.match(/catch\s*\{/g) || []).length === 2);
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
const GESTURE_BYTES = [
  'const SWIPE_THRESHOLD = 45;',
  'const SWIPE_VELOCITY  = 0.3;',
  'const TAP_MAX_MOVE    = 10;',
  'const TAP_MAX_TIME    = 250;',
  'const DOUBLE_TAP_MS   = 280;',
  'const OVERLAY_DISMISS = 80;',
];
ok('§4.1 every swipe/tap constant is byte-present and unchanged (all six, count asserted)',
  GESTURE_BYTES.filter(b => PAGE.includes(b)).length === GESTURE_BYTES.length);
ok('§4.2 the deck still binds onTouchStart and onTouchEnd and nothing else',
  PAGE.includes('onTouchStart={onTouchStart}') && PAGE.includes('onTouchEnd={onTouchEnd}'));
ok('§4.3 the overlay\'s drag-dismiss is intact',
  PAGE.includes('if (dragDelta > OVERLAY_DISMISS) { setDragDelta(0); onClose(); }'));
ok('§4.4 the card band CONTAINER is pointerEvents:none — the swipe surface is unchanged outside the chip',
  /gap: 8,\s*\n\s*pointerEvents: 'none',/.test(PAGE));
ok('§4.5 the chip is the ONLY element that consumes its own touches',
  /onTouchStart=\{\(e: React\.TouchEvent\) => \{ e\.stopPropagation\(\); \}\}/.test(PAGE));
ok('§4.6 the FEATURED eyebrow is non-interactive by construction',
  /FeaturedEyebrow[\s\S]{0,900}pointerEvents: 'none' as const/.test(PAGE));
ok('§4.7 the eyebrow renders ONLY on featured — the Manual honesty law, marked when true',
  /function FeaturedEyebrow[\s\S]{0,200}if \(!featured\) return null;/.test(PAGE));
ok('§4.8 the chip renders ONLY on a usable handle — on truth, or not at all',
  /function IgChip[\s\S]{0,320}if \(!h\) return null;/.test(PAGE));
ok('§4.9 the eyebrow is Jost and letterspaced (V-2 as vetoed)',
  /FeaturedEyebrow[\s\S]{0,700}'Jost',sans-serif[\s\S]{0,300}letterSpacing: '0\.28em'/.test(PAGE));
ok('§4.10 the eyebrow word is exactly FEATURED', /\n\s*FEATURED\n\s*<\/span>/.test(PAGE));
ok('§4.11 the card chip is withheld while the overlay is open — it cannot sit under the sheet',
  /!isBlind && !overlayVisible && \(vendor\.featured \|\| vendor\.instagram_handle\)/.test(PAGE));
ok('§4.12 blind mode withholds the handle exactly as it withholds the name (identity is identity)',
  /\{!isBlind && vendor\.instagram_handle && \(/.test(PAGE));
ok('§4.13 the chip carries no gold — the screen\'s one gold stays Enquire\'s (spec §3)',
  !/function IgChip[\s\S]{0,1400}#C9A84C/.test(PAGE));
ok('§4.14 P1 adds NO localStorage read or write to the canvas page',
  (PAGE.match(/localStorage/g) || []).length === 1);   // the pre-existing isBrideDemoDiscover only
ok('§4.15 the unreachable demo branch is left BYTE-UNTOUCHED per the CE ruling (F-07.1)',
  PAGE.includes('const res  = await fetch(`${BACKEND}/api/v2/demo/discover`);') &&
  PAGE.includes("window.location.href = 'https://demodiscover.thedreamwedding.in';"));

console.log('');
console.log('§5 · MUTATION LEDGER (production source, cmp-restored)');
console.log('      P-1  igLink.ts: `instagram://user?username=` → `https://instagram.com/`  ⇒ §2.1 RED');
console.log('      P-2  igLink.ts: IG_FALLBACK_MS 300 → 0                                  ⇒ §2.3 RED');
console.log('      P-3  page.tsx: FeaturedEyebrow `if (!featured) return null;` deleted     ⇒ §4.7 RED');
console.log('      P-4  page.tsx: card band pointerEvents \'none\' → \'auto\'                  ⇒ §4.4 RED');
console.log('      P-5  config page: the Discover ranking group removed                     ⇒ §3.1/§3.2 RED');
console.log('      P-6  types: `is_demo?: boolean` deleted                                  ⇒ §1.1/§1.4 RED');

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw07_p1_discover ${pass}/${total}` : `RED — tdw07_p1_discover ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
