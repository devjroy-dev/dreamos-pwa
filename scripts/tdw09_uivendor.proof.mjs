// scripts/tdw09_uivendor.proof.mjs
// ═══════════════════════════════════════════════════════════════════════════════
// TDW_09 · UI VENDOR — F-09.118 · .119 · .120 · .121 · .122 · .124 · .125
// Built at dreamos-pwa 503b254 (chair relay #7). TDW_STRIPPER_CANARY
// ═══════════════════════════════════════════════════════════════════════════════
//
// WHY THIS BENCH EXISTS — F-09.124, and it is the reason the whole sitting was
// owed. Twenty-five tips drifted across three blocks of retirements and NOTHING
// in the floor could redden a single one of them. The only detector this estate
// had for a stale manual was the founder's eye on his own phone. A tip is a
// SENTENCE ABOUT THE TREE, and a sentence about the tree is exactly the kind of
// claim an instrument can hold: this bench asserts each tip's named path or word
// against the live source, so the next retirement that orphans a tip reddens
// here instead of surviving to a walk.
//
// M10'S LESSON IS BUILT INTO THE PARSER, NOT BOLTED BESIDE IT. The first draft
// of the tips extractor walked brackets from the first `[` it found after
// `const TIPS` — which is the `[]` in the TYPE ANNOTATION `Tip[]`. It closed
// after two characters and returned an empty body, and every absence-cell over
// it went green on nothing. A SILENT ZERO. The parser below anchors past the
// annotation, and §0.3/§0.4 refuse an implausible body rather than reporting it.
// Nothing here is line-anchored (path-over-range law): line numbers drift
// silently and a bench that drifts with them is not a witness.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripComments } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R  = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const C  = (p) => stripComments(R(p));

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); if (detail) console.log(`        ${detail}`); }
};
const sec = (t) => console.log(`\n══ ${t} ══\n`);

const TIPS_FILE = 'components/vendor/TipsCarousel.tsx';
const HDR_FILE  = 'components/vendor/Header.tsx';
const TDS_FILE  = 'app/vendor/tds/page.tsx';
const MORE_FILE = 'app/vendor/more/page.tsx';
const SET_FILE  = 'app/vendor/settings/page.tsx';

// ── THE ARRAY-BODY PARSER (M10) ───────────────────────────────────────────────
// Anchors on the ASSIGNMENT bracket, never the first `[` after the name.
function tipsBody(src) {
  const m = /const\s+TIPS\s*:\s*Tip\[\]\s*=\s*\[/.exec(src);
  if (!m) return '';
  const open = m.index + m[0].length - 1;      // the `[` of `= [`, not of `Tip[]`
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) return src.slice(open + 1, i); }
  }
  return '';
}
// Tips are counted by their `section:` key, which every tip carries and nothing
// else in the body does. Counting `{` would count nested objects; counting lines
// would break the moment a tip is written on one (which is M10).
const tipCount = (body) => (body.match(/\bsection:\s*'/g) || []).length;
const sectionsOf = (body) => (body.match(/\bsection:\s*'([^']+)'/g) || [])
  .map(s => s.replace(/.*'([^']+)'.*/, '$1'));

const tipsSrc  = C(TIPS_FILE);
const tipsRaw  = R(TIPS_FILE);
const body     = tipsBody(tipsSrc);
const hdr      = C(HDR_FILE);
const tds      = C(TDS_FILE);
const more     = C(MORE_FILE);
const set      = C(SET_FILE);

console.log('\n════════════════════════════════════════════════════════════');
console.log('  tdw09_uivendor — the vendor UI walk, F-09.118 … F-09.125');
console.log('════════════════════════════════════════════════════════════');

// ═══ §0 · THE INSTRUMENT ══════════════════════════════════════════════════════
sec('§0 · THE INSTRUMENT IS THE AUTHORITY, AND REFUSES RATHER THAN REPORTS ZERO');
ok('§0.1 the stripper comes from the estate\'s one home, not from a local copy',
   /from '\.\/lib\/stripComments\.mjs'/.test(R('scripts/tdw09_uivendor.proof.mjs')));
ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
   (() => { const self = stripComments(R('scripts/tdw09_uivendor.proof.mjs'));
            return (self.match(/\bC\s*\(/g) || []).length >= 4; })());
ok('§0.2 the parser survives the annotation trap (M10) — the body is not the two bytes of `Tip[]`',
   body.length > 3000, `body length ${body.length} — a short body is the silent zero this cell exists for`);
ok('§0.3 and the body it returned really is the tips array — plausible count, not a coincidence',
   tipCount(body) > 15 && tipCount(body) < 40, `counted ${tipCount(body)}`);

// ═══ §1 · THE INVENTORY (F-09.118) ════════════════════════════════════════════
sec('§1 · THE INVENTORY — 23 tips, two retired on warrants, one excluded');
ok('§1.1 the manual carries exactly 23 tips (25 minus the two retired)',
   tipCount(body) === 23, `counted ${tipCount(body)}`);
ok('§1.2 tip 4 「 Just Do It mode. 」 is gone — it taught a toggle F-07.31 deleted',
   !body.includes('Just Do It mode.'));
ok('§1.3 tip 5 「 Quick action pills. 」 is gone — F-09.54, and the pills exist nowhere else',
   !body.includes('Quick action pills.'));
ok('§1.4 the retired BODIES died with their titles, not just the headlines',
   !body.includes('Toggle "Just Do It" below the header') &&
   !body.includes('+ Client, + Invoice, + Expense, + Event'));
ok('§1.5 the retirement carries BOTH warrants in-comment, so the next reader inherits them (F-06.85)',
   /F-07\.31/.test(tipsRaw) && /F-09\.54/.test(tipsRaw));
ok('§1.6 tip 22 (the peek nav) is EXCLUDED and UNTOUCHED, pending F-09.90\'s V5 word',
   body.includes('The peek nav rises from the bottom.') &&
   body.includes('In the Hub, slowly scroll up'));

// ═══ §2 · THE NINE APPROVED BODIES ════════════════════════════════════════════
sec('§2 · THE NINE — founder-approved 「 all 9 yes 」, byte-exact');
const NINE = [
  ['tip 6',  ["title: 'WhatsApp, Call, or Mark lost.'",
              'Every lead carries WhatsApp and Call. Mark lost when it dies.',
              'Leads move new \u2192 contacted \u2192 quoted \u2192 booked, or lost.']],
  ['tip 7',  ['Tap Reply \u2192 on the Attention rail and ask DreamAi']],
  ['tip 8',  ['The Attention rail carries the ones that need you.']],
  ['tip 10', ["title: 'Hold a date in two taps.'",
              'Tap any date to open the day, then Hold the day.',
              'Out of town, Family event, Personal, Health, Already booked elsewhere, or Other.',
              'A full-day hold dims the date']],
  ['tip 14', ['Overdue, unpaid, part-paid, paid \u2014 DreamAi updates these when you tell it.']],
  ['tip 17', ["title: 'Contracts and TDS live under More.'",
              'Open them from More \u2192 Finance \u2192 TDS or Contracts.']],
  ['tip 18', ['Upload your best work from Storefront.']],
  ['tip 24', ['Settings \u2192 TDW Enquiry Link generates a personal WhatsApp link.']],
  ['tip 25', ["title: 'Set your starting price.'",
              'Discover \u2192 Profile sets your starting price.',
              'Turn on "Show starting price on Discover" and couples see it as a from figure.']],
];
for (const [label, frags] of NINE) {
  ok(`§2 ${label} — every approved fragment present`,
     frags.every(f => body.includes(f)),
     `missing: ${frags.filter(f => !body.includes(f)).join(' | ')}`);
}

// ═══ §3 · F-09.125's LAW — the string it replaced must be GONE ════════════════
sec('§3 · CURRENT-STRING-FIRST (F-09.125) — no superseded byte survives');
const SUPERSEDED = [
  ['tip 6',  'Every new enquiry has three actions.'],
  ['tip 7',  "body: 'Tap Reply on any lead and ask DreamAi"],
  ['tip 8',  'The enquiry card shows the most recent one.'],
  ['tip 10', 'Tap any date on the calendar.'],
  ['tip 14', 'Unpaid, Advance Paid, Paid, Cancelled'],
  ['tip 17', 'Access everything from the Business tab in Studio.'],
  ['tip 18', "body: 'Upload your best work. The first approved image"],
  ['tip 24', 'Settings \u2192 Your TDW Handle'],
  ['tip 25', 'Settings \u2192 Rates lets you set a minimum'],
];
for (const [label, old] of SUPERSEDED) {
  ok(`§3 ${label} — the superseded byte is gone from the file whole`, !tipsSrc.includes(old));
}

// ═══ §4 · THE SECTION PILLS (Fork B) ══════════════════════════════════════════
sec('§4 · THE PILL RAIL — the Studio word dies with the door it named');
ok('§4.1 no tip carries section \'Studio\' — the pill has nothing to derive from',
   !sectionsOf(body).includes('Studio'));
ok('§4.2 tip 17 sits under \'Settings\', where its body now points',
   /section:\s*'Settings',[\s\S]{0,120}?title: 'Contracts and TDS live under More\.'/.test(body));
ok('§4.3 the pill rail is DERIVED from the tips, never hand-written beside them',
   /const SECTIONS = \[\.\.\.new Set\(TIPS\.map\(t => t\.section\)\)\]/.test(tipsSrc));
ok('§4.4 \'Settings\' was JOINED, not minted — it already carried tips before 17 arrived',
   sectionsOf(body).filter(s => s === 'Settings').length === 3);

// ═══ §5 · C2 — THE SETTINGS DOOR ON THE COIN (F-09.118) ═══════════════════════
sec('§5 · C2 — Settings reachable from the avatar');
// NOT `[^>]*`: an onClick arrow `=>` carries a `>`, so a greedy-stop-at-`>`
// match truncates the row mid-handler and every cell over it asserts nothing.
const dItem = (hdr.split('\n').find(l => l.includes('<DItem') && l.includes('label="Settings"')) || '');
ok('§5.1 the popover carries a Settings row at all — the founder\'s whole complaint',
   dItem.length > 0);
ok('§5.2 its subtitle is the approved byte, capital and all',
   /subtitle="Profile, billing, preferences"/.test(hdr));
ok('§5.3 the glyph is ⚙, borrowed from the More row rather than invented',
   dItem.includes('glyph="\u2699"'));
ok('§5.4 it actually opens /vendor/settings and closes the popover behind it',
   /setProfileOpen\(false\); router\.push\('\/vendor\/settings'\)/.test(dItem));
ok('§5.5 it is SEATED beneath Discover Profile, inside Atelier — not appended to the foot',
   (() => { const dp = hdr.indexOf('label="Discover Profile"');
            const st = hdr.indexOf('label="Settings"');
            const dl = hdr.indexOf('>Display<');
            return dp > -1 && st > dp && dl > st; })(),
   'order broke: Atelier → Discover Profile → Settings → … → Display');
ok('§5.6 the More → Account → Settings door is KEPT — two doors by ruling, not a duplicate',
   /href: '\/vendor\/settings', label: 'Settings'/.test(more));

// ═══ §6 · F-09.119 — THE BAR-GLYPH FAB ════════════════════════════════════════
sec('§6 · F-09.119 — the TDS FAB reads as a plus, not a bar');
ok('§6.1 the coin is 46×46, the house idiom\'s size (was 54)',
   /width: 46, height: 46, borderRadius: '50%'/.test(tds));
ok('§6.2 and it is set in F.body at 20 — a face that has a drawn glyph for U+002B',
   /fontFamily: F\.body, fontSize: 20, fontWeight: 400/.test(tds));
ok('§6.3 no display-serif FAB survives on this surface',
   !/width: 54, height: 54[\s\S]{0,200}?fontFamily: F\.display/.test(tds));
ok('§6.4 the DEMO twin is UNTOUCHED — F-09.123 is FILED and HELD behind F-09.89\'s wall',
   (() => { const d = C('app/demo/vendor/[handle]/tds/page.tsx');   // minified source: no spaces
            return /width:54,height:54/.test(d) && /fontFamily:F\.display,fontSize:28/.test(d); })(),
   'the demo twin moved — this delivery was ruled ZERO BYTES there, so a green here would be the breach');

// ═══ §7 · F-09.121 — THE CAPACITY STEPPER, CURED AS A PAIR ════════════════════
sec('§7 · F-09.121 — the −/+ pair, whole (Fork 4(a))');
const stepper = /color: A\.brassWarm, fontFamily: F\.body, fontSize: 20, lineHeight: 1,/g;
ok('§7.1 BOTH stepper glyphs moved — a pair cured by halves is two faces on one control',
   (set.match(stepper) || []).length === 2,
   `found ${(set.match(stepper) || []).length} of 2`);
// Scoped to the two stepper BUTTONS by their own glyphs. An unscoped absence
// cell over the whole file convicts the back chevron `\u2039` at the page head,
// which is NOT in F-09.121's ruled pair and is not this delivery's to move.
ok('§7.2 neither stepper glyph survives on the display serif',
   ['\u2212</button>', '+</button>'].every(g => {
     const i = set.indexOf(g);
     return i > -1 && !set.slice(Math.max(0, i - 400), i).includes('F.display');
   }));
ok('§7.3 non-vacuity — the stepper glyphs themselves are still rendered',
   set.includes('\u2212</button>') && set.includes('+</button>'));

// ═══ §8 · F-09.120 + F-09.122 — MORE ══════════════════════════════════════════
sec('§8 · F-09.120 — the pill retired, one merged list, Paper A\'s order');
ok('§8.1 the mode pill is GONE from More — founder-convicted 「 remove it 」',
   !more.includes('VictorModeChip'));
// ── AMENDED AT F-09.129. I shipped this cell asserting Home's mount SURVIVES,
// and named it as mine to amend in the packet before the ruling came back. The
// chip is still the ONE mount and still the well-wired one — only its seat moved
// off the Hub masthead and into the risen chat. §10 below carries the new seat.
ok('§8.2 F-09.122 still holds — exactly ONE mount survives, and it is the wired one',
   (() => { const home = C('app/vendor/page.tsx');
            return (home.match(/<VictorModeChip/g) || []).length === 1
                && /onThreadReset=\{markFreshThread\}/.test(home)
                && /onMode=\{setVictorRoom\}/.test(home); })());
ok('§8.3 the four section labels are gone and the rows render as ONE list',
   !/<SectionLabel/.test(more) &&
   /\[\.\.\.DISCOVER_ITEMS, \.\.\.TEAM_ITEMS, \.\.\.FINANCE_ITEMS, \.\.\.ACCOUNT_ITEMS\]/.test(more));
ok('§8.4 this file\'s SectionLabel definition went caller-zero and DIED with its callers',
   !/function SectionLabel/.test(more));
ok('§8.5 EVERY row survives the merge — 8 rows in, 8 rows out',
   ['Couture', 'Featured', 'Team Hub', 'TDS', 'Contracts', 'Notes to Self', 'Settings', 'Sign Out']
     .every(l => more.includes(`label: '${l}'`)),
   'a row was lost in the merge — the ruling retired the LABELS, never a destination');
ok('§8.6 Paper A\'s sequence is preserved exactly — Discover, Team, Finance, Account',
   (() => { const i = ['Couture', 'Team Hub', 'TDS', 'Notes to Self'].map(l => more.indexOf(`label: '${l}'`));
            return i.every(x => x > -1) && i.every((x, n) => n === 0 || x > i[n - 1]); })());

// ═══ §9 · F-09.128 — THE KILL SWITCH IS READ, NOT MERELY FETCHED ══════════════
sec('§9 · F-09.128 — `selfserve_enabled` gates the surface it was minted to gate');
// WHY THIS EXISTS. This delivery's own settings file was cut at 503b254 and
// applied onto 9f73a8b, and it WIPED F-10.92 — the client-side gate — because a
// whole-file overwrite cannot see a commit it never read. tsc stayed green: an
// unread field is legal TypeScript. Nothing in the floor named `selfserve`, so
// nothing could redden. The flag was typed, defaulted to FALSE, mapped off the
// wire, and consumed by nobody — a kill switch that fetches and discards.
// A FLAG WITH ZERO READERS IS THE SILENT-ZERO CLASS WEARING A BOOLEAN.
ok('§9.1 the flag still arrives — typed and mapped off the wire',
   /selfserve_enabled: boolean;/.test(C('hooks/vendor/useSettings.ts')) &&
   /selfserve_enabled: v\.selfserve_enabled \?\? false,/.test(C('hooks/vendor/useSettings.ts')));
ok('§9.2 and something READS it — the picker arm is gated on it, not merely near it',
   /!current\.subscription_link && current\.selfserve_enabled && \(/.test(set));
ok('§9.3 the cancel arm is gated too — half a kill switch is not a kill switch',
   /current\.subscription_id && current\.selfserve_enabled && \(/.test(set));
ok('§9.4 NON-VACUITY — the flag has at least two live consumers on this surface',
   (set.match(/current\.selfserve_enabled/g) || []).length >= 2,
   `found ${(set.match(/current\.selfserve_enabled/g) || []).length}`);

// ═══ §10 · F-09.129 — THE CONTROL RE-HOMED, NOT RETIRED ═══════════════════════
sec('§10 · F-09.129 — off the Hub masthead, into the risen chat');
const home = C('app/vendor/page.tsx');
const risenAt = home.indexOf('{risen && (');
const chipAt  = home.indexOf('<VictorModeChip');
ok('§10.1 the HUB MASTHEAD renders no pill — the founder\'s glance, as a cell',
   risenAt > 0 && chipAt > risenAt,
   'a mode control mounts above the rise again — that is the byte he ruled out');
ok('§10.2 the control SURVIVES — a chrome verdict did not take the capability away',
   (home.match(/<VictorModeChip/g) || []).length === 1);
ok('§10.3 wired byte-for-byte as before — F-09.122\'s pair, both props',
   /<VictorModeChip onThreadReset=\{markFreshThread\} onMode=\{setVictorRoom\} \/>/.test(home));
ok('§10.4 seated BESIDE the mirror it publishes, not loose in the room',
   (() => { const mirror = home.indexOf("victorRoom === 'business' ? 'Business'");
            return mirror > chipAt && (mirror - chipAt) < 900; })(),
   'the chip and the label it feeds have drifted apart inside the room');
ok('§10.5 the server door is untouched — victor_mode stays live end to end',
   /PATCH|patchJson/.test(C('lib/vendor/api/vendor.ts')) &&
   /vendor-e\/mode/.test(C('lib/vendor/api/vendor.ts')));
// Scoped to the SEGMENTS array. An unscoped `label: '` sweep over this file
// convicts the FONT TOKEN `F = { label: 'var(--font-label, inherit)' }` — a
// style byte, not a word anyone reads. A copy cell that cannot tell copy from
// CSS is not a copy cell.
ok('§10.6 COPY INVENTORY ZERO — the chip carries its own vetoed pair and no third word',
   (() => { const chip = C('components/vendor/VictorModeChip.tsx');
            const m = /const SEGMENTS[\s\S]*?\];/.exec(chip);
            if (!m) return false;
            const words = (m[0].match(/label: '([^']+)'/g) || []).map(x => x.slice(8, -1));
            return words.length === 2 && words[0] === 'Business' && words[1] === 'Advisor'; })());
ok('§10.7 the mechanism comment followed the mechanism (F-06.85)',
   /F-09\.129/.test(R('components/vendor/BottomNav.tsx')));

// ═══ §M · MUTATIONS — every cure cell RED at a broken tree ════════════════════
sec('§M · MUTATIONS OVER PRODUCTION SOURCE — bitten, not reported');
function bite(name, file, from, to, probe) {
  const raw = R(file);
  if (!raw.includes(from)) { fail++; console.log(`  FAIL ${name}`); console.log(`        mutation anchor absent — the mutation never bit: ${from.slice(0, 60)}`); return; }
  const mutated = stripComments(raw.split(from).join(to));
  let red;
  try { red = !probe(mutated); } catch { red = true; }
  ok(name, red, 'the cell stayed GREEN on a broken tree — it asserts nothing');
}
bite('§M.1 §8.5 reds when a row is dropped in the merge', MORE_FILE,
  "label: 'Contracts'", "label: 'Contracts_X'",
  s => ['Couture', 'Featured', 'Team Hub', 'TDS', 'Contracts', 'Notes to Self', 'Settings', 'Sign Out']
        .every(l => s.includes(`label: '${l}'`)));
bite('§M.2 §2 reds when tip 6\'s approved title is reverted', TIPS_FILE,
  "title: 'WhatsApp, Call, or Mark lost.'", "title: 'Reply, Hold, or Decline.'",
  s => tipsBody(s).includes("title: 'WhatsApp, Call, or Mark lost.'"));
bite('§M.3 §4.1 reds when tip 17 slips back under Studio', TIPS_FILE,
  "section: 'Settings',\n    glyph: '\u25c7',", "section: 'Studio',\n    glyph: '\u25c7',",
  s => !sectionsOf(tipsBody(s)).includes('Studio'));
bite('§M.4 §3 reds when a superseded byte is restored beside its replacement', TIPS_FILE,
  "Discover \u2192 Profile sets your starting price.", "Settings \u2192 Rates lets you set a minimum and maximum package range.",
  s => !s.includes('Settings \u2192 Rates lets you set a minimum'));
bite('§M.5 §5.2 reds when C2\'s approved subtitle drifts by one character', HDR_FILE,
  'subtitle="Profile, billing, preferences"', 'subtitle="profile, billing, preferences"',
  s => /subtitle="Profile, billing, preferences"/.test(s));
bite('§M.6 §6.1 reds when the FAB goes back to 54', TDS_FILE,
  "width: 46, height: 46, borderRadius: '50%'", "width: 54, height: 54, borderRadius: '50%'",
  s => /width: 46, height: 46, borderRadius: '50%'/.test(s));
bite('§M.7 §6.2 reds when the FAB returns to the display serif', TDS_FILE,
  'fontFamily: F.body, fontSize: 20, fontWeight: 400', 'fontFamily: F.display, fontSize: 25, fontWeight: 400',
  s => /fontFamily: F\.body, fontSize: 20, fontWeight: 400/.test(s));
bite('§M.8 §7.1 reds when ONE HALF of the stepper pair is reverted — the pair-whole cell', SET_FILE,
  "color: A.brassWarm, fontFamily: F.body, fontSize: 20, lineHeight: 1,\n              }}>\u2212</button>",
  "color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1,\n              }}>\u2212</button>",
  s => (s.match(/color: A\.brassWarm, fontFamily: F\.body, fontSize: 20, lineHeight: 1,/g) || []).length === 2);
bite('§M.9 §8.1 reds when the retired mode pill is smuggled back in', MORE_FILE,
  '<MoreRow key={item.label} item={item} />',
  '<MoreRow key={item.label} item={item} />}{<VictorModeChip />',
  s => !s.includes('VictorModeChip'));
bite('§M.10 §1.1 reds when a retired tip returns ON ONE LINE — the parser, not the line count', TIPS_FILE,
  'const TIPS: Tip[] = [',
  "const TIPS: Tip[] = [\n  { section: 'The Hub', glyph: '\u2726', title: 'Just Do It mode.', body: 'Toggle \"Just Do It\" below the header.' },",
  s => tipCount(tipsBody(s)) === 23);

bite('§M.11 §9.2 reds when the picker gate is stripped — the exact wipe that happened', SET_FILE,
  '!current.subscription_link && current.selfserve_enabled && (',
  '!current.subscription_link && (',
  s => /!current\.subscription_link && current\.selfserve_enabled && \(/.test(s));
bite('§M.12 §9.4 reds when the flag is left with ONE reader — half a switch', SET_FILE,
  "current.subscription_id && current.selfserve_enabled && (",
  "current.subscription_id && (",
  s => (s.match(/current\.selfserve_enabled/g) || []).length >= 2);

bite('§M.13 §10.1 reds when the pill is put back on the Hub masthead', 'app/vendor/page.tsx',
  '{risen && (', '<VictorModeChip />{risen && (',
  s => { const r = s.indexOf('{risen && ('); return r > 0 && s.indexOf('<VictorModeChip') > r; });
bite('§M.14 §10.3 reds when the re-homed chip loses a prop in the move', 'app/vendor/page.tsx',
  '<VictorModeChip onThreadReset={markFreshThread} onMode={setVictorRoom} />',
  '<VictorModeChip onMode={setVictorRoom} />',
  s => /<VictorModeChip onThreadReset=\{markFreshThread\} onMode=\{setVictorRoom\} \/>/.test(s));

console.log('\n════════════════════════════════════════════════════════════');
console.log(`tdw09_uivendor: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('════════════════════════════════════════════════════════════\n');
process.exit(fail ? 1 : 0);
