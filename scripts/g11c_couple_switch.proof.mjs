#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/g11c_couple_switch.proof.mjs
// TDW_19 · BLOCK 19 · G1.1c — THE COUPLE'S SWITCH, THE PWA HALF.
//
//   node scripts/g11c_couple_switch.proof.mjs
//
// ── THIS ROOM HAD NO BENCH AT ALL ──────────────────────────────────────────
// Derived by command in the read-first, not assumed: the only file in scripts/
// naming `settings.tsx` was `tdw13_d6_parity_matrix.proof.mjs`, and only as a
// path string inside a capability table. Not one cell asserted a control, a
// string or a token in this room. These are its first, so "the bench follows
// the law" cannot be leaned on here — there is no prior reading to inherit.
//
// ── WHAT THESE CELLS MAY CLAIM, AND WHAT THEY MAY NOT ─────────────────────
// D-38.1's doctrine binds: PRESENCE IS NOT BEHAVIOUR. A cell reading source
// text proves a shape exists; it cannot prove a rendered surface. So the
// claims here are deliberately narrow — the bytes are the founder's and are
// unchanged; the discriminators are the ones ruled; no second home for the
// answer exists. What only the founder's glass can witness is named in the
// card and claimed by nobody here.
//
// SIBLING-FULL REQUIRED. `has_wedding_page` is a contract with a door in the
// other repo, and a client asserting a key nobody serves is the exact shape of
// a green over an unreachable path. Without the sibling this bench REFUSES
// (exit 3) rather than skipping the axis it exists for.
//
// Mutations break PRODUCTION CODE, never bench setup, and every anchor is
// verified unique in the FINAL tree before it is used (R-33.4).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const P    = (p) => path.join(ROOT, p);
const raw  = (p) => fs.readFileSync(P(p), 'utf8');
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Comments stripped before EVERY source assertion (the comment-blindness law).
// Every subject here carries long comment blocks naming the very identifiers
// the cells look for — `publish_weddings`, `has_wedding_page`, the string
// constants — so a raw-text cell would convict its own prose and, worse, would
// stay green on a cure that only edited a comment.
const code = (p) => raw(p)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');

const ROOM    = 'components/frost/blooms/settings.tsx';
const COPY    = 'lib/frost/coupleSwitch.ts';
const CLIENT  = 'lib/frost/journey.ts';
const MOCK    = 'docs/mocks/couple-switch-mock.html';
const SIBLING = path.resolve(ROOT, '..', 'dream-os');

let pass = 0, fail = 0;
const failed = [];
const ok = (id, claim, cond, why = '') => {
  if (cond) { pass++; console.log(`  ok   ${id} ${claim}`); }
  else { fail++; failed.push(id); console.log(`  FAIL ${id} ${claim}${why ? `\n         ${why}` : ''}`); }
};
const sec = (h) => console.log(`\n══ ${h} ══`);

for (const f of [ROOM, COPY, CLIENT, MOCK]) {
  if (!fs.existsSync(P(f))) {
    console.log(`\n  BENCH REFUSED — ${f} is absent.\n`);
    process.exit(3);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · R-40.30 — the five bytes, frozen at the character');

// APPROVED-COPY-CARRIES-ITS-HASH. These sha256 are of the strings the founder
// vetoed on 2026-09-05. One character's drift — a comma, a capital, "may" for
// "can" — is a NEW VETO and not a tidy, and this section is what makes that
// true mechanically rather than by good intentions.
const BYTES = {
  SWITCH_LABEL:        'b7d99620ab51c35cbb15b543d96db59c8ba68292e62245e5b18ee2cc3eec21e5',
  SWITCH_VALUE_OFF:    '394acb86efdb85274d27b08ba0321b2b057c79773576985e66a07529ce5f2ea4',
  SWITCH_VALUE_ON:     '2956872787422ace2df42d21f5726b80b75336dc6f7b4362816f87c4281682d2',
  SWITCH_SUB_HAS_PAGE: '07661a36d58496475dd3bb6938db2278012bcee6d03c6bbc664cbb4c6a61c9e9',
  SWITCH_SUB_NO_PAGE:  '3fc015868a46d2c719cb6e886dd11a10d6c31b459851accf35d838a631e2cbfd',
};

// Values are read out of the module by NAME, off the single-quoted literal that
// follows the export — never by position, because a reordered file would then
// silently check the wrong string against the wrong hash.
const copySrc = raw(COPY);
const literalOf = (name) => {
  const m = copySrc.match(
    new RegExp(`export const ${name}\\s*(?::[^=]*)?=\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  return m ? m[1] : null;
};

const values = {};
for (const [name, want] of Object.entries(BYTES)) {
  const v = literalOf(name);
  values[name] = v;
  ok(`1.${name}`, `${name} is the vetoed byte`, v !== null && sha(v) === want,
    v === null ? 'constant not found in the copy home' : `sha256 ${sha(v)}`);
}

// The founder's own edit, named because it is the one word in this set that a
// well-meaning hand would "correct" to the more formal register.
ok('1.can', 'string 3 says CAN, not "may" — the founder\'s own edit survives',
  values.SWITCH_VALUE_ON === 'On. Your vendors can publish your wedding page.');

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE SET IS CLOSED — five, and there is no sixth');

const exportedConsts = [...copySrc.matchAll(/^export const ([A-Z_]+)/gm)].map((m) => m[1]);
ok('2.1', 'the copy home exports exactly the five, and nothing else',
  exportedConsts.length === 5 && Object.keys(BYTES).every((k) => exportedConsts.includes(k)),
  exportedConsts.join(','));

// THE ABSENT HEADER IS ASSERTED, NOT MERELY OBSERVED. The mock's header rules
// that no section label sits above the switch "because a header would be a byte
// nobody vetoed", and the estate's own `fr-sect-lbl` grammar is exactly how one
// would arrive. The room has ONE such label — DreamAi — and it must stay one.
const roomCode = code(ROOM);
const sectionLabels = [...roomCode.matchAll(/letterSpacing:'\.22em'[^}]*}}>\{?([A-Za-z][A-Za-z ]*)/g)];
ok('2.2', 'no section header was authored above the switch (the ruled expected-zero)',
  (roomCode.match(/>DreamAi</g) || []).length === 1 &&
  !/Publish(ing)?\s*<\/div>/.test(roomCode) &&
  !/>Your wedding page</.test(roomCode) &&
  !/>Publishing</.test(roomCode));

// THE BLOCK IS EXTRACTED BY TAG BALANCE, NOT BY A FORWARD SEARCH.
// FIRST CUT, ON THE RECORD RATHER THAN QUIETLY FIXED: this sliced from
// `togglePublish}` to the next `DreamAi`, which swallowed the edit sheet sitting
// between them — so §5's three "never greyed" cells convicted the SAVE BUTTON's
// `disabled` and `opacity` and the sheet's hex literals, and read RED against a
// switch that carries none of them. A cell that convicts the wrong element is
// not a stricter cell, it is a broken one. Balanced properly, it stops at the
// row's own closing tag.
const balancedDivAt = (src, needle) => {
  const at = src.indexOf(needle);
  if (at === -1) return null;
  const open = src.lastIndexOf('<div', at);
  if (open === -1) return null;
  const tok = /<div\b|\/>|<\/div>/g;
  tok.lastIndex = open;
  let depth = 0, m;
  while ((m = tok.exec(src)) !== null) {
    if (m[0] === '<div') depth++; else depth--;
    if (depth === 0) return src.slice(open, m.index + m[0].length);
  }
  return null;
};
const switchBlockOf = (src) => balancedDivAt(src, 'onClick={togglePublish}');
const switchBlock = switchBlockOf(roomCode);
ok('2.3a', 'the switch block was FOUND and BOUNDED (the §2/§5 cells are not vacuous)',
  switchBlock !== null && switchBlock.length > 400 && switchBlock.length < 2600 &&
  switchBlock.includes('SWITCH_LABEL') && !switchBlock.includes('Save budget'),
  switchBlock === null ? 'togglePublish row not located'
    : `${switchBlock.length} chars · leaked into the edit sheet = ${switchBlock.includes('Save budget')}`);

// A SIXTH STRING WOULD BE A RAISED FORK. Every word this row renders arrives
// through one of the five identifiers; no bare sentence was authored into it.
// Style objects are brace-matched away first — a naive `\{[^{}]*\}` cannot see
// past the nested braces in `style={{...}}` and leaks attribute text into what
// it thinks are rendered words.
const stripExpressions = (s) => {
  let out = '', depth = 0;
  for (const ch of s) {
    if (ch === '{') { depth++; continue; }
    if (ch === '}') { depth = Math.max(0, depth - 1); continue; }
    if (depth === 0) out += ch;
  }
  return out;
};
const renderedText = switchBlock === null ? null
  : stripExpressions(switchBlock).replace(/<[^>]*>/g, '').trim();
ok('2.3', 'the switch row renders no string literal of its own — five identifiers only',
  renderedText !== null && !/[A-Za-z]/.test(renderedText),
  renderedText === null ? 'block not found' : `bare text found: ${JSON.stringify(renderedText.slice(0, 80))}`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · ONE HOME FOR HER ANSWER — the room holds no second copy');

// R-G11c.8's mechanical half. A `useState` seeded from the profile is the
// classic second home: it renders correctly on the first paint and then drifts
// the moment the server disagrees. There is no such state, and its absence is
// the cell.
ok('3.1', 'the room declares NO local state for her answer',
  !/useState[^;]*publish/i.test(roomCode) && !/setPublish/i.test(roomCode));

ok('3.2', 'the track is drawn from profile.publish_weddings, the door\'s byte',
  /profile\.publish_weddings\?/.test(roomCode.replace(/\s+/g, '')));

// NO OPTIMISTIC PAINT. The handler must not write the answer anywhere before
// the round trip; the only thing it may do is send and re-read.
ok('3.3', 'the toggle sends the NEGATION of the row and stores nothing locally',
  /saveProfile\(\{publish_weddings:!profile\.publish_weddings\}\)/.test(roomCode.replace(/\s+/g, '')));

ok('3.4', 'the toggle RE-READS through fetchProfile — the room\'s existing pattern',
  /togglePublish[\s\S]{0,900}?fetchProfile\(\)/.test(roomCode));

// The client is not a writer. `couple_set_publish` is, through the door.
ok('3.5', 'the room never writes couple_consent, and knows nothing of the column',
  !/couple_consent/.test(roomCode));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE SUB-LINE IS KEYED TO THE PAGE, NEVER TO THE SWITCH');

// The single easiest mistake available here, and the one the frames rule out:
// C1(off)/C2(on) both draw string 4, C3(off)/C4(on) both draw string 5.
const flat = roomCode.replace(/\s+/g, '');
ok('4.1', 'the sub-line switches on has_wedding_page',
  /profile\.has_wedding_page\?SWITCH_SUB_HAS_PAGE:SWITCH_SUB_NO_PAGE/.test(flat));
ok('4.2', 'and NOT on publish_weddings — the two discriminators are not confused',
  !/publish_weddings\?SWITCH_SUB/.test(flat) && !/SWITCH_SUB_[A-Z_]+:SWITCH_SUB_[A-Z_]+\}[\s\S]{0,40}publish_weddings/.test(flat));

// The mock is the subject and the frames are the ruling. Both pairings are read
// out of the ratified file rather than remembered, so a re-drawn mock that
// changed the pairing would red this rather than pass unnoticed.
const mockSrc = raw(MOCK);
const frameOf = (name) => {
  const i = mockSrc.indexOf(`data-frame="${name}"`);
  if (i === -1) return null;
  const j = mockSrc.indexOf('class="cap"', i);
  return j === -1 ? null : mockSrc.slice(i, j);
};
const FRAMES = { 'C1-off': 4, 'C2-on': 4, 'C3-nopage': 5, 'C4-onnopage': 5 };
for (const [frame, wantSub] of Object.entries(FRAMES)) {
  const f = frameOf(frame);
  const has = f && f.includes(values.SWITCH_SUB_HAS_PAGE);
  const no  = f && f.includes(values.SWITCH_SUB_NO_PAGE);
  ok(`4.${frame}`, `the ratified frame ${frame} draws string ${wantSub}`,
    f !== null && (wantSub === 4 ? (has && !no) : (no && !has)),
    f === null ? 'frame absent from the mock' : `hasPage=${has} noPage=${no}`);
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · ALWAYS OPERABLE — R-G11c.8, never greyed');

// The arc has refused a greyed control three times. `disabled`, a dimmed
// opacity, or `pointerEvents:'none'` on this row are each the same refusal
// wearing a different attribute, so all three are convicted at the block.
ok('5.1', 'the switch row carries no disabled attribute',
  switchBlock !== null && !/disabled/.test(switchBlock));
ok('5.2', 'the switch row is never dimmed by opacity',
  switchBlock !== null && !/opacity/.test(switchBlock));
ok('5.3', 'and its taps are never turned off',
  switchBlock !== null && !/pointerEvents/.test(switchBlock));

// Wine Night is pinned by ruling, and the room's colours must come from the
// room's own token pair rather than a hard-coded hex the pin cannot reach.
ok('5.4', 'the knob\'s on-ink is a mode pair, not a literal at the render site',
  /const knobOn\s*=\s*dark\s*\?/.test(raw(ROOM)) &&
  switchBlock !== null && !/#[0-9A-Fa-f]{6}/.test(switchBlock));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · THE CLIENT TYPE — one home each, and neither key is optional');

const clientCode = code(CLIENT);
ok('6.1', 'CoupleProfile carries publish_weddings as a REQUIRED boolean',
  /publish_weddings:\s*boolean;/.test(clientCode));
ok('6.2', 'CoupleProfile carries has_wedding_page as a REQUIRED boolean',
  /has_wedding_page:\s*boolean;/.test(clientCode));
ok('6.3', 'neither key is optional — an optional boolean invites a client-side default',
  !/publish_weddings\?:\s*boolean;/.test(clientCode.replace(/patch:[\s\S]*$/, '')) &&
  !/has_wedding_page\?:/.test(clientCode));
ok('6.4', 'the fixture answers NO and has NO page — no fictional consent ships',
  /publish_weddings:\s*false,/.test(clientCode) && /has_wedding_page:\s*false,/.test(clientCode));
ok('6.5', 'saveProfile\'s patch takes publish_weddings as boolean and nothing wider',
  /publish_weddings\?:\s*boolean;/.test(clientCode));
// FIRST CUT ON THE RECORD: this read 400 characters forward from the interface's
// NAME, which with comments stripped runs clean past the closing brace and into
// `saveProfile`'s patch type — where `publish_weddings` legitimately lives. It
// convicted the very key the ruling put there. Bounded to the interface BODY.
const saveResultBody = (clientCode.match(/interface SaveProfileResult \{([\s\S]*?)\n\}/) || [])[1];
ok('6.6', 'SaveProfileResult was NOT extended — the room re-reads, it does not read an echo',
  typeof saveResultBody === 'string' && !/publish_weddings/.test(saveResultBody),
  typeof saveResultBody === 'string' ? 'the echo was added' : 'interface body not located');

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · THE CONTRACT WITH THE DOOR (sibling-full)');

// ── PRESENCE IS NOT FRESHNESS, AND THE FIRST CUT OF THIS SECTION FORGOT IT ──
// It guarded on `existsSync` alone and nothing else — "sibling present" as the
// entire precondition, which R-38.20b bans in prose and which is no better
// encoded in a bench. On the founder's own verify all four cells went RED
// against a delivery that was correct: his pwa container carries a `dream-os`
// clone from BEFORE this arc, so the door it read had never heard of any of
// this. F-38.34 exactly — a sibling from another month, and nothing could tell.
//
// The tell was in the failure itself and it is derivable: 7.3's subject
// (`publish_weddings: couple.publish_weddings === true`) landed at `edb3362`,
// the BUILD sitting's commit, one before the lift. A tree where 7.3 reds is a
// tree older than the whole G1.1c dream-os half — not a tree where this
// delivery is wrong.
//
// SO THE STALENESS IS CLASSIFIED, NOT ABSORBED. A sibling that does not carry
// the contract is a REFUSAL (exit 3, never a FAIL, never in a base — F-39.47 /
// c-39.57) and it names the tip it read, so the founder is told which clone
// lied rather than which cell failed. A sibling that DOES carry the contract
// and still lacks the key is a real regression and still FAILS loudly: the
// ancestor test is what keeps this a classifier and not an excuse.
const CONTRACT_TIP = '286cdb4'; // dream-os · R-G11c.10 · the commit that serves the key
const gitIn = (...args) => {
  try {
    return execFileSync('git', ['-C', SIBLING, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return null; }
};
const doorPath   = path.join(SIBLING, 'src/api/couple/me.js');
const siblingHead = gitIn('rev-parse', '--short', 'HEAD');
// `merge-base --is-ancestor` and not an equality test: the contract survives
// every commit built on top of it, and pinning to one hash would turn the next
// unrelated dream-os push into a refusal here.
const carriesContract = gitIn('merge-base', '--is-ancestor', CONTRACT_TIP, 'HEAD') !== null;

if (!fs.existsSync(doorPath) || !carriesContract) {
  console.log('\n  BENCH REFUSED — the sibling cannot answer for the door.');
  console.log(`    expected : a dream-os clone at ${SIBLING} carrying ${CONTRACT_TIP} or later`);
  console.log(`    found    : ${fs.existsSync(doorPath)
    ? `HEAD ${siblingHead || '(not a git repo)'} — ${CONTRACT_TIP} is not an ancestor`
    : 'no src/api/couple/me.js at that path'}`);
  console.log('    `has_wedding_page` is a contract with a door in that repo, and a');
  console.log('    client asserting a key nobody serves is a green over an unreachable');
  console.log('    path. A STALE sibling is a finding about the clone, not this tree.');
  console.log('    Fix the clone, then re-run:');
  console.log('      git -C ../dream-os fetch origin && git -C ../dream-os pull --ff-only origin main');
  console.log('    or, if it is absent:');
  console.log('      git clone https://github.com/devjroy-dev/dream-os.git ../dream-os\n');
  process.exit(3);
}
const door = fs.readFileSync(doorPath, 'utf8');
ok('7.0', `the sibling is fresh enough to answer — HEAD ${siblingHead}, ${CONTRACT_TIP} is an ancestor`, true);
ok('7.1', 'the door actually serves has_wedding_page',
  /has_wedding_page:/.test(door));
ok('7.2', 'and derives it from the probed rows, not from a literal',
  /has_wedding_page:\s*Array\.isArray\(wRows\)\s*&&\s*wRows\.length\s*>\s*0/.test(door));
ok('7.3', 'the door still serves the switch\'s default off her row',
  /publish_weddings:\s*couple\.publish_weddings === true/.test(door));
ok('7.4', 'every key the room reads is a key the door sends',
  ['publish_weddings', 'has_wedding_page'].every((k) => door.includes(`${k}:`)));

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · MUTATIONS — production code broken, sha256-restored');

const PROBES = {
  '3.1': () => !/useState[^;]*publish/i.test(code(ROOM)) && !/setPublish/i.test(code(ROOM)),
  '3.2': () => /profile\.publish_weddings\?/.test(code(ROOM).replace(/\s+/g, '')),
  '3.3': () => /saveProfile\(\{publish_weddings:!profile\.publish_weddings\}\)/
                 .test(code(ROOM).replace(/\s+/g, '')),
  '4.1': () => /profile\.has_wedding_page\?SWITCH_SUB_HAS_PAGE:SWITCH_SUB_NO_PAGE/
                 .test(code(ROOM).replace(/\s+/g, '')),
  '4.2': () => !/publish_weddings\?SWITCH_SUB/.test(code(ROOM).replace(/\s+/g, '')),
  '5.2': () => {
    const b = switchBlockOf(code(ROOM));
    return b !== null && !/opacity/.test(b);
  },
  '6.5': () => /publish_weddings\?:\s*boolean;/.test(code(CLIENT)),
  '1.SWITCH_VALUE_ON': () => {
    const m = raw(COPY).match(/export const SWITCH_VALUE_ON\s*(?::[^=]*)?=\s*\n?\s*'((?:[^'\\]|\\.)*)'/);
    return !!m && sha(m[1]) === BYTES.SWITCH_VALUE_ON;
  },
};

const MUTATIONS = [
  // THE FOUR THE RULING NAMED.
  //
  // M1 AND M2 WERE FIRST AIMED AT CELLS THEY DO NOT BREAK, and the mutation pass
  // said so — `3.2 stayed GREEN`, `3.3 stayed GREEN`. A second home for her
  // answer does not change how the track is DRAWN, and widening the patch type
  // does not change the room's CALL SITE. The mutations were right and the
  // `reds` lists were wrong; naming the cell a mutation truly breaks is the
  // whole difference between a mutation pass and a formality.
  { id: 'M1', file: ROOM, reds: ['3.1'],
    from: `  const [savingSwitch, setSavingSwitch] = React.useState(false);`,
    to:   `  const [savingSwitch, setSavingSwitch] = React.useState(false);\n  const [publishLocal, setPublishLocal] = React.useState(false);`,
    why:  'a second home for her answer appears — the default can drift from the row' },

  { id: 'M2', file: CLIENT, reds: ['6.5'],
    from: `  publish_weddings?: boolean;`,
    to:   `  publish_weddings?: boolean | string;`,
    why:  'the patch type widens — a non-boolean can leave this client for the door' },

  { id: 'M3', file: ROOM, reds: ['4.1'],
    from: `            {profile.has_wedding_page?SWITCH_SUB_HAS_PAGE:SWITCH_SUB_NO_PAGE}`,
    to:   `            {SWITCH_SUB_HAS_PAGE}`,
    why:  'the switch hides the no-page state — a couple with no page is told one disappears' },

  { id: 'M4', file: ROOM, reds: ['4.1', '4.2'],
    from: `                {profile.has_wedding_page?SWITCH_SUB_HAS_PAGE:SWITCH_SUB_NO_PAGE}`,
    to:   `                {profile.publish_weddings?SWITCH_SUB_HAS_PAGE:SWITCH_SUB_NO_PAGE}`,
    why:  'the sub-line keys to the SWITCH instead of the page (the ruled confusion)' },

  // TWO THE SEAT ADDED, because a set of four that never tested the copy freeze
  // or the greying refusal would leave this bench's two loudest claims unproven.
  { id: 'M5', file: COPY, reds: ['1.SWITCH_VALUE_ON'],
    from: `export const SWITCH_VALUE_ON = 'On. Your vendors can publish your wedding page.';`,
    to:   `export const SWITCH_VALUE_ON = 'On. Your vendors may publish your wedding page.';`,
    why:  'the founder\'s own edit is reverted — "may" for "can", one word, no new veto' },

  { id: 'M6', file: ROOM, reds: ['5.2'],
    from: `            display:'flex',alignItems:'flex-start',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>`,
    to:   `            display:'flex',alignItems:'flex-start',cursor:'pointer',WebkitTapHighlightColor:'transparent',opacity:.5}}>`,
    why:  'the greyed control returns in its third costume (R-G11c.8 refused it three times)' },
];

let bit = 0, dud = 0;
for (const m of MUTATIONS) {
  const before = raw(m.file);
  const before_sha = sha(before);
  const hits = before.split(m.from).length - 1;
  if (hits !== 1) { dud++; console.log(`  FAIL ${m.id} anchor not unique in the FINAL tree (${hits} hits) — R-33.4`); continue; }
  fs.writeFileSync(P(m.file), before.replace(m.from, m.to));
  const stayed = [];
  try {
    for (const id of m.reds) {
      let threw = false;
      try { if (PROBES[id]()) stayed.push(id); } catch { threw = true; }
      if (threw) stayed.push(`${id}(threw)`);
    }
  } finally {
    fs.writeFileSync(P(m.file), before);
    if (sha(raw(m.file)) !== before_sha) {
      console.log(`  FAIL ${m.id} RESTORE FAILED — ${m.file} left mutated. STOP.`);
      process.exit(1);
    }
  }
  if (stayed.length === 0) { bit++; console.log(`  ok   ${m.id} — ${m.why} ⇒ ${m.reds.join(' ')} RED`); }
  else { dud++; console.log(`  FAIL ${m.id} — decorative: ${stayed.join(', ')} stayed GREEN`); }
}
console.log(`\n  mutations: ${bit} bit, ${dud} did not`);
fail += dud;

console.log('\n────────────────────────────────────────────────────────────');
console.log(`g11c_couple_switch: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('────────────────────────────────────────────────────────────');
if (failed.length) console.log('  failed: ' + failed.join(', '));
process.exit(fail === 0 ? 0 : 1);
