#!/usr/bin/env node
// scripts/tdw07_p2_profile.proof.mjs — TDW_07 P2's pwa half.
//
// The engine bench (dream-os scripts/b07_p2_bench.js) proves the score, the allowlist,
// the guard and the round trip. This harness proves the five things that live only here:
//   §1  THE FLOOR HAS ONE HOME — both former copies read it, the WORD "five" is gone
//   §2  F-07.9's CLIENT CURE — the hook initialises from GET /me, not from constants
//   §3  THE §C SPLIT — one editor per field: what moved, moved; what stayed, stayed
//   §4  DISCOVER PROFILE's own laws — no localStorage, ONE gold, the register, P3's slot
//   §5  THE VETOED COPY, byte-exact — seven slots, the founder's words and no others
//
// Runnable from any working directory. Mutations at the foot were run against production
// source and cmp-restored; counts in the handover.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const section = (t) => console.log(`\n${t}`);

// RE-AIMED AT THE MECHANISM (CE ruling §B). The first draft of §4.2 and §4.4 grepped the
// BARE WORDS `localStorage` and `cabinet` and convicted this delivery's own explanatory
// COMMENTS — the same defect P1's executor filed as its deviation (iv), reproduced one
// sitting later. The alternative cure (reword the comments until the grep is happy) was
// refused by name: that is a green earned by editing the evidence. Both cells now judge
// CODE ONLY, through this stripper, and the comments stay exactly as written.
const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, ' ')   // block comments, incl. JSX {/* … */} bodies
  .replace(/^\s*\/\/.*$/gm, ' ');       // whole-line // comments

const FLOOR    = read('lib/vendor/discoverFloor.ts');
const DISCOVER = read('app/vendor/discover/page.tsx');
const HOOK     = read('hooks/vendor/useSettings.ts');
const SETTINGS = read('app/vendor/settings/page.tsx');
const PROFILE  = read('app/vendor/discover/profile/page.tsx');
const HEADER   = read('components/vendor/Header.tsx');
const FORM     = read('components/vendor/AtelierForm.tsx');

// ─────────────────────────────────────────────────────────────────────────────────
section('§1 · THE FLOOR HAS ONE HOME');
{
  ok('§1.1 lib/vendor/discoverFloor.ts exists and declares the number once',
    (FLOOR.match(/DISCOVER_PHOTO_FLOOR = \d+/g) || []).length === 1);
  ok('§1.2 the constant is 6 — the raise reached this side of the wire',
    /DISCOVER_PHOTO_FLOOR = 6/.test(FLOOR));
  ok('§1.3 ★ the WORD "five" is GONE from the gate line — a number spelled in English '
    + 'cannot be raised by a constant, and it is the copy a vendor actually reads',
    !/at least five/i.test(DISCOVER), 'the spelled-out floor survives');
  ok('§1.4 ★ the branch gate no longer holds its own literal — `< 5` is dead',
    !/portfolioTotal < 5/.test(DISCOVER));
  ok('§1.5 BOTH former copies now read the same value',
    /portfolioTotal < floor/.test(DISCOVER) && /at least \{floor\} pieces/.test(DISCOVER));
  ok('§1.6 ★ the SERVER is preferred over the constant — photoFloor() takes the status '
    + 'field, so the client renders a number it was told',
    /photoFloor\(status\?\.min_portfolio_images\)/.test(DISCOVER)
    && /fromServer/.test(FLOOR));
  ok('§1.7 the fallback is comment-BOUND to the enforcing site, by path and line',
    /src\/lib\/vendor\/discover\.js:6/.test(FLOOR));
}

// ─────────────────────────────────────────────────────────────────────────────────
section('§2 · F-07.9\'s CLIENT CURE (the witnessed lie)');
{
  // The live specimen: the settings screen rendered its routing HANDLE populated two
  // cards below an Instagram field showing a placeholder, while the column held
  // 'Makeupbyswatiroy' and GET /me returned it. Five fields were blanked here.
  const blanked = [
    ["style_notes:      ''", 'style_notes'],
    ["travel_notes:     ''", 'travel_notes'],
    ["instagram_handle: ''", 'instagram_handle'],
    ['briefing_enabled: true,', 'briefing_enabled'],
    ["invoice_prefix:   ''", 'invoice_prefix'],
  ];
  // Count first, then names (F-06.111 guard).
  const survivors = blanked.filter(([lit]) => HOOK.includes(`        ${lit}`));
  ok('§2.1 ★ ZERO of the five hardcoded initialisers survive in the loader',
    survivors.length === 0, survivors.map(s => s[1]).join(', '));
  ok('§2.2 ★ instagram_handle reads the RESPONSE — the discriminating field, the one the '
    + 'API already carried and the hook dropped anyway',
    /instagram_handle: v\.instagram_handle \?\? ''/.test(HOOK));
  ok('§2.3 briefing_enabled reads the row — the opted-out vendor is no longer trapped '
    + 'behind a dirty-compare against the same constant that mis-rendered them',
    /briefing_enabled: v\.briefing_enabled \?\? true/.test(HOOK));
  ok('§2.4 style_notes, travel_notes and invoice_prefix read the response too',
    /style_notes:      v\.style_notes \?\? ''/.test(HOOK)
    && /travel_notes:     v\.travel_notes \?\? ''/.test(HOOK)
    && /invoice_prefix:   v\.invoice_prefix \?\? ''/.test(HOOK));
  ok('§2.5 the three P2 fields join the state so the editor can render and confirm them',
    /about:            v\.about \?\? ''/.test(HOOK)
    && /rate_display:     v\.rate_display \?\? true/.test(HOOK)
    && /discover_paused:  v\.discover_paused \?\? false/.test(HOOK));
}

// ─────────────────────────────────────────────────────────────────────────────────
section('§3 · THE §C SPLIT — ONE EDITOR PER FIELD');
{
  // Moved: rendered by Discover or scored by profileScore.
  const moved = ['business_name', 'aesthetic_tags', 'rate_min', 'rate_max', 'instagram_handle',
                 'travel_notes', 'open_to_travel', 'city'];
  const stillEditable = (src, f) => new RegExp(`update\\(\\{ ${f}:`).test(src);
  const leftovers = moved.filter((f) => stillEditable(SETTINGS, f));
  ok('§3.1 ★ NO moved field is still editable from settings — count first, then names',
    leftovers.length === 0, leftovers.join(', '));
  const arrived = moved.filter((f) => stillEditable(PROFILE, f));
  ok('§3.2 every moved field IS editable from Discover Profile — the move landed, '
    + 'it did not merely delete',
    arrived.length === moved.length, `arrived ${arrived.length}/${moved.length}`);

  // Stayed: operations and the engine.
  const stayed = ['name', 'style_notes', 'upi_id', 'gstin', 'briefing_enabled'];
  const missing = stayed.filter((f) => !stillEditable(SETTINGS, f));
  ok('§3.3 ★ the ops fields STAYED — users.name is the engine\'s greeting, style_notes is '
    + 'written by WhatsApp onboarding, and Discover neither renders nor scores any of them',
    missing.length === 0, missing.join(', '));
  const trespass = stayed.filter((f) => stillEditable(PROFILE, f));
  ok('§3.4 and none of them grew a SECOND editor on the new screen',
    trespass.length === 0, trespass.join(', '));

  ok('§3.5 ★ routing_handle keeps its own endpoint and is NOT re-editable on the new '
    + 'screen — a locked field\'s editor stays where its uniqueness check lives',
    /updateRoutingHandle/.test(SETTINGS) && !/updateRoutingHandle/.test(PROFILE));
  // MICRO 1 — the cell that would have caught the miss. The delivery shipped a screen
  // whose ONLY doors were an avatar dropdown and a forwarding card in the room the
  // fields had just left. The read-first had NAMED the discover-root door in prose and
  // no cell asserted it, so nothing failed. A stated thumb-path now has a bench.
  ok('§3.5b ★ THE DISCOVER ROOT CARRIES THE DOOR — the panel root a vendor lands on when '
    + 'they tap DISCOVER links to the profile, above the state branches so it is present '
    + 'in every discover state',
    /router\.push\('\/vendor\/discover\/profile'\)/.test(DISCOVER)
    && DISCOVER.indexOf("router.push('/vendor/discover/profile')") < DISCOVER.indexOf("state === 'not_requested'"),
    'the door is missing or sits inside a state branch');
  ok('§3.5c the door mints NO new vendor-facing copy — its label and subtitle are '
    + 'byte-identical to the entry already shipped in Header.tsx',
    /Discover Profile/.test(DISCOVER) && /How couples see you/.test(DISCOVER)
    && /How couples see you/.test(HEADER));

  ok('§3.6 the Header entry re-points — the label always said "Discover Profile"',
    /label="Discover Profile"[\s\S]{0,220}\/vendor\/discover\/profile/.test(HEADER)
    && !/label="Discover Profile"[\s\S]{0,220}\/vendor\/settings/.test(HEADER));
  ok('§3.7 the form primitives are a PURE MOVE — one home, both screens import it',
    exists('components/vendor/AtelierForm.tsx')
    && /from '@\/components\/vendor\/AtelierForm'/.test(SETTINGS)
    && /from '@\/components\/vendor\/AtelierForm'/.test(PROFILE)
    && /export function SCard/.test(FORM));
}

// ─────────────────────────────────────────────────────────────────────────────────
section('§4 · DISCOVER PROFILE\'s OWN LAWS');
{
  ok('§4.1 the route is /vendor/discover/profile — DISCOVER mode, founder-ruled',
    exists('app/vendor/discover/profile/page.tsx'));
  ok('§4.2 NO localStorage anywhere on the new screen — asserted over CODE, so the cell '
    + 'cannot be satisfied by rewording a comment (protocol §4, native clause)',
    !/localStorage|sessionStorage/.test(stripComments(PROFILE)));
  ok('§4.3 ★ ONE GOLD — the meter arc is the only #C9A84C stroke/fill the screen mints; '
    + 'every other brass is a shared token',
    (PROFILE.match(/#C9A84C/g) || []).length === 1, `${(PROFILE.match(/#C9A84C/g) || []).length} sightings`);
  ok('§4.4 ★ the money register holds — formatRs is the donor; the ₹ glyph and the off-'
    + 'register cabinet short form are absent from the CODE (the comment naming cabinet.ts '
    + 'as the WRONG donor is evidence, and must not have to be deleted to pass)',
    /formatRs/.test(stripComments(PROFILE))
    && !/₹/.test(stripComments(PROFILE))
    && !/cabinet/.test(stripComments(PROFILE)));
  ok('§4.5 ★ PORTFOLIO IS P3\'s SLOT — the screen LINKS to the existing manager and does '
    + 'not grow a second photo surface',
    /router\.push\('\/vendor\/portfolio'\)/.test(PROFILE)
    && !/upload-url|registerImage|setHeroImage/.test(PROFILE));
  ok('§4.6 no second profile RENDERER is pre-empted — P4 owns VendorProfileView and this '
    + 'screen never imports or re-implements a couple-facing card',
    !/VendorProfileView/.test(PROFILE));
  ok('§4.7 the display mirror of the score names its authority in-file, so a weight change '
    + 'has a pointer to follow',
    /src\/lib\/vendor\/profileScore\.js/.test(PROFILE));
  ok('§4.8 the hint list is capped at three and tie-breaks by SECTION_ORDER, matching the '
    + 'server\'s ruled rule',
    /slice\(0, limit\)/.test(PROFILE) && /SECTION_ORDER\.indexOf\(a\.term\)/.test(PROFILE));
}

// ─────────────────────────────────────────────────────────────────────────────────
section('§5 · THE VETOED COPY, BYTE-EXACT (founder 2026-07-29, 「 go 」)');
{
  const slot = (n, bytes, src) => ok(`§5.${n} slot ${n} verbatim`, src.includes(bytes), bytes);
  slot(1, 'Hidden from Discover. Your approval stays. Enquiries already in flight still reach you.', PROFILE);
  slot(2, 'Upload at least {floor} pieces to request access. You have {portfolioTotal}.', DISCOVER);
  slot(3, '{floor} photos required for Discover — you have {total} uploaded, {approved} approved. Couples see the approved ones.', PROFILE);
  // LABELED AMENDMENT (micro 2, founder-vetoed 2026-07-30). COUNT PRESERVED. The four
  // fixed hints are unchanged; the two counted ones gained singular forms and the photos
  // one gained its pending branch, and the rate one gained its half-set branch. This cell
  // correctly reddened on the old bytes — it is re-aimed at the NEW vetoed bytes, never
  // loosened to accept both. The dropped enquiry-recency hint stays nowhere.
  ok('§5.4 slot 4 — the hint strings verbatim at their new forms, and the DROPPED '
    + 'enquiry-recency hint is nowhere (its reason is in-file so nobody re-adds it)',
    ['Write your About', 'Choose a hero image', 'Add your Instagram handle',
     'State your travel policy', 'Set your starting rate',
     'Add the top of your rate range', 'awaiting review',
     "'more photo', 'more photos'", "'more tag', 'more aesthetic tags'"]
      .filter((t) => !PROFILE.includes(t)).length === 0
    && !/last enquiry sat/.test(PROFILE));

  ok('§5.5 slot 5 — the section labels verbatim',
    ['Portfolio', 'About', 'Aesthetic tags', 'Travel policy', 'Starting rate', 'Instagram', 'Pause profile']
      .filter((t) => !PROFILE.includes(`title="${t}"`)).length === 0);
  slot(6, 'This is the name couples see and the name on your invoices.', PROFILE);
  slot(7, 'Moved to your Discover Profile.', SETTINGS);
}

// ─────────────────────────────────────────────────────────────────────────────────
section('§7 · THE HINTS AT REAL NUMBERS (micro 2 — the founder\'s walk found all three)');
{
  // These three defects were found by the founder walking his own account, not by any
  // cell here. Each was a sentence that read correctly in the abstract and wrongly at a
  // real value. The cells assert the SENTENCE, because the sentence is the product.
  ok('§7.1 ★ THE SINGULAR — "Add 1 more photo", never "1 more photos". The vetoed template '
    + 'was never walked to n = 1, and it reads broken exactly when a vendor is nearly done',
    /n === 1 \? one : many/.test(PROFILE)
    && /'more photo', 'more photos'/.test(PROFILE)
    && /'more tag', 'more aesthetic tags'/.test(PROFILE));
  ok('§7.2 ★ PENDING REACHES THE COPY — the gate line was cured to carry both counts and '
    + 'this hint was not, so one screen could read "7 uploaded" above "add 1 more photo". '
    + 'The SCORE still ignores pending rows; only the sentence learns they exist',
    /awaiting review/.test(PROFILE)
    && /pending: o\.pending/.test(PROFILE)
    && /setPending\(res\.portfolio_summary\?\.pending/.test(PROFILE));
  ok('§7.3 the pending branch is ORDERED — fully covered says "awaiting review" alone, '
    + 'partially covered says both halves, none says the plain add',
    /if \(pending >= short\) return/.test(PROFILE)
    && /if \(pending > 0\) return/.test(PROFILE));
  ok('§7.4 ★ THE HALF-SET RATE — a min without a max asks for the TOP, not for the rate. '
    + 'The term stays unmet (requestDiscover needs both bounds); only the copy learns which '
    + 'half is missing, so a saved number never reads as a lost save',
    /partial \? 'Add the top of your rate range' : 'Set your starting rate'/.test(PROFILE)
    && /partial: o\.rateMin !== '' && o\.rateMax === ''/.test(PROFILE));
  ok('§7.5 the score is UNTOUCHED by all three — no weight, term or gap moved; `pending` '
    + 'and `partial` are facts the copy reads, never terms the meter counts',
    !/W\.pending|W\.partial/.test(PROFILE)
    && /photos: 0\.270/.test(PROFILE) && /rate: 0\.135/.test(PROFILE));
}

// ─────────────────────────────────────────────────────────────────────────────────
section('§6 · THE MUTATION LEDGER (production source, cmp-restored)');
console.log('      W-1  discoverFloor.ts  DISCOVER_PHOTO_FLOOR 6 → 5              ⇒ §1.2 RED');
console.log('      W-2  discover/page     `{floor}` reverted to the word "five"    ⇒ §1.3/§1.5 RED');
console.log('      W-3  useSettings.ts    instagram_handle back to \'\'              ⇒ §2.1/§2.2 RED');
console.log('      W-4  Header.tsx        the entry re-pointed at /vendor/settings ⇒ §3.6 RED');
console.log('      W-5  profile/page      a second #C9A84C added                   ⇒ §4.3 RED');
console.log('      W-6  profile/page      formatRs swapped for a ₹ template        ⇒ §4.4 RED');
console.log('      W-7  profile/page      the plural() helper reverted to `${n} photos` ⇒ §7.1 RED');
console.log('      W-8  profile/page      pending dropped from the photos hint       ⇒ §7.2 RED');
console.log('      W-9  profile/page      the rate hint loses its partial branch      ⇒ §7.4 RED');

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — tdw07_p2_profile ${pass}/${total}` : `RED — tdw07_p2_profile ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
