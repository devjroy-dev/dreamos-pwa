#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/tdw15_p1_events.proof.mjs
// TDW_15 · P1 — G-1's REMAINING THREE, G-3's IMAGE HALF, AND THE COPY FREEZE.
//
//   node scripts/tdw15_p1_events.proof.mjs
//
// ── WHAT THIS DELIVERY IS, AND THEREFORE WHAT THIS BENCH MAY CLAIM ─────────
// Two sibling benches already assert G-1's shape from their own angles — the
// parity matrix's (the document's side) and the delegation bench's (D-4b's
// side). This one asserts the things NEITHER of them can see:
//
//   · the founder's bytes, frozen at the character, in their one home;
//   · that the state toggle rides the NARROW door and the read follows it —
//     R-34.8's three arms, which are one ruling and were never severable;
//   · that the Done head cannot render over an empty section;
//   · that no JSX attribute on the surface carries the comment-opening
//     sequence again, which is the cure for a defect this delivery caused,
//     found, and paid for.
//
// The mutations break PRODUCTION CODE, never bench setup, and every anchor is
// verified unique in the FINAL tree before it is used (R-33.4).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const P    = (p) => path.join(ROOT, p);
const raw  = (p) => fs.readFileSync(P(p), 'utf8');
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Comments stripped before EVERY source assertion (the comment-blindness law).
// This file's subjects carry long comment blocks naming the very identifiers
// the cells look for, so a cell reading raw text would convict its own prose.
const code = (p) => raw(p)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');

const BLOOM   = 'components/frost/blooms/events.tsx';
const EXPENSE = 'components/frost/blooms/expenses.tsx';
const COPY    = 'lib/frost/eventCopy.ts';
const CLIENT  = 'lib/frost/journey.ts';
const SIBLING = path.resolve(ROOT, '..', 'dream-os');

let pass = 0, fail = 0;
const failed = [];
const ok = (id, claim, cond, why = '') => {
  if (cond) { pass++; console.log(`  ok   ${id} ${claim}`); }
  else { fail++; failed.push(id); console.log(`  FAIL ${id} ${claim}${why ? `\n         ${why}` : ''}`); }
};
const sec = (h) => console.log(`\n══ ${h} ══`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE FOUNDER\'S BYTES — frozen at the character');

// APPROVED-COPY-CARRIES-ITS-HASH. Each of these was read back to the founder
// and approved on 2026-08-15; one character's drift is a new veto, not a tidy.
const BYTES = {
  EVENT_ADD:         'Add a day',
  EVENT_ASK_TITLE:   'What is it?',
  EVENT_ASK_WHEN:    'When?',
  EVENT_ASK_NOTES:   'Anything to remember?',
  EVENT_SAVE:        'Save',
  EVENT_CANCEL:      'Cancel',
  EVENT_ADDED:       'Added.',
  EVENT_UPDATED:     'Updated.',
  EVENT_NEEDS_TITLE: 'Give it a name.',
  EVENT_SAVE_FAILED: 'Could not save. Try again.',
  EVENT_REMOVE_ASK:  'Remove this day?',
  EVENT_REMOVED:     'Removed.',
  EVENT_DONE_HEAD:   'Done',
  EVENT_EMPTY:       'Your first day starts here.',
};
const copySrc = raw(COPY);
for (const [name, byte] of Object.entries(BYTES))
  ok(`1.${name}`, `= ${JSON.stringify(byte)}`,
     copySrc.includes(`export const ${name}`) &&
     new RegExp(`export const ${name}\\s*=\\s*'${byte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "\\\\?'")}'`).test(copySrc)
       || copySrc.includes(`= '${byte}'`) || copySrc.includes(`= "${byte}"`),
     'the byte drifted, or its constant is gone');

ok('1.z', 'the founder\'s override landed — the button reads Ask Mira, not DreamAi',
   /\+ Ask Mira/.test(code(BLOOM)) && !/Ask DreamAi/.test(code(BLOOM)),
   'radius A of the 2026-08-15 veto: this button, and only this button');

// ── THE TWO DISCLOSED BYTES. Not on the vetoed sheet; named in the handover.
ok('1.disclosed', 'Edit and Remove exist as constants, so a founder change is one line',
   /export const EVENT_EDIT\s*=\s*'Edit'/.test(copySrc) &&
   /export const EVENT_REMOVE\s*=\s*'Remove'/.test(copySrc));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · TWO EXPECTED-ZEROS, asserted as absences (CE-34 struck lines 11 and 12)');

ok('2.1', '⓵ there is NO label constant for the done control',
   !/EVENT_DONE\s*=/.test(copySrc) && !/EVENT_MARK/.test(copySrc),
   'a second vocabulary for a verb the member\'s side already speaks silently');

ok('2.2', '⓵ the toggle renders no text — it is a ring that fills',
   (() => {
     const c = code(BLOOM).replace(/\s+/g, ' ');
     const m = c.match(/<button[^>]*onClick=\{\(e\)=>\{e\.stopPropagation\(\);toggleDone\(ev\);\}\}[^>]*\/>/);
     return !!m;   // self-closing ⇒ no child text at all
   })(),
   'the done control has children — line 11 was struck');

ok('2.3', '⓶ the Done head is gated on a NON-EMPTY section',
   /done\.length>0&&\(/.test(code(BLOOM).replace(/\s+/g, '')) ||
   /\{!loading&&done\.length>0&&\(/.test(code(BLOOM).replace(/\s+/g, '')),
   'the head renders over nothing — and Fixture 1 stands at done = 0, so it ' +
   'would have shipped a heading over an empty section on day one');

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · R-34.8 — THREE ARMS, ONE RULING, NONE SEVERABLE');

ok('3.1', 'the room reads ALL, not upcoming — a done day settles, never vanishes',
   /fetchEvents\('all'\)/.test(code(BLOOM)) && !/fetchEvents\('upcoming'\)/.test(code(BLOOM)),
   'the toggle would read as a delete: the server filters on state and this ' +
   'is the only list the room renders');

ok('3.2', 'the two groups are derived from one read',
   /const upcoming = events\.filter\(e=>e\.state==='upcoming'\)/.test(code(BLOOM)) &&
   /const done     = events\.filter\(e=>e\.state==='done'\)/.test(code(BLOOM)));

ok('3.3', 'the toggle rides setEventState — NOT the full PATCH',
   /setEventState\(ev\.id, next\)/.test(code(BLOOM)));

ok('3.4', 'the client\'s state door is the DEDICATED one',
   /\/api\/v2\/couple\/events\/\$\{eventId\}\/state/.test(code(CLIENT)) &&
   /method: 'PATCH'/.test(code(CLIENT)));

ok('3.5', 'cancelled is NOT offered — the affordance is done ⇄ upcoming only',
   /state\s*===\s*'done'\s*\?\s*'upcoming'\s*:\s*'done'/.test(code(BLOOM)) &&
   !/'cancelled'/.test(code(BLOOM)),
   'R-34.8 narrowed the write; the server accepts a third value and the ' +
   'surface must not offer what the ruling withheld');

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE TWO PATCH BODIES ARE DISJOINT');

const flat = code(BLOOM).replace(/\s+/g, ' ');
ok('4.1', 'the assign writes the delegation column ALONE',
   /updateEvent\(ev\.id, \{ assigned_circle_member_id: memberId \}\)/.test(flat),
   'the D-4b assign site is gone or has grown a second field');

ok('4.2', 'the edit sheet NEVER writes the delegation column',
   (() => {
     const without = flat.replace(/updateEvent\(ev\.id, \{ assigned_circle_member_id: memberId \}\)/, '');
     const other = without.match(/updateEvent\([^;]*/);
     return !!other && !/assigned_circle_member_id/.test(other[0]);
   })(),
   'the edit sheet is a second writer of the assign\'s column, and the ' +
   'boundedness the matrix bench asserts is then maintained by care');

ok('4.3', 'the create body sends no state — the server owns it',
   (() => {
     const m = flat.match(/createEvent\(\{[^}]*\}/);
     return !!m && !/state:/.test(m[0]);
   })());

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE KIND LIST IS CLOSED, AND PINNED TO THE SERVER\'S OWN (F-15.5)');

const kinds = [...copySrc.matchAll(/\{ value: '([a-z]+)'/g)].map((m) => m[1]).sort();
ok('5.1', 'the sheet offers exactly twelve kinds', kinds.length === 12, kinds.join(','));

// SIBLING-FULL. The server's allowlist is the authority; a client list that
// drifts past it loses her choice SILENTLY, because the create door rewrites an
// unrecognised kind to 'other' with no error anywhere (F-15.5).
const eventsApi = path.join(SIBLING, 'src/api/couple/events.js');
if (!fs.existsSync(eventsApi)) {
  console.log('\n  BENCH ABORTED — dream-os must be a sibling; the kind list is pinned to');
  console.log('  the server\'s own allowlist and cannot be checked against memory.\n');
  process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
}
const serverKinds = [...fs.readFileSync(eventsApi, 'utf8')
  .match(/const ALLOWED_KINDS = new Set\(\[([\s\S]*?)\]\)/)[1]
  .matchAll(/'([a-z]+)'/g)].map((m) => m[1]).sort();
ok('5.2', 'every offered kind is one the server knows — no silent rewrite to other',
   kinds.every((k) => serverKinds.includes(k)),
   `client-only: ${kinds.filter((k) => !serverKinds.includes(k)).join(', ')}`);
ok('5.3', 'and the list is COMPLETE — no server kind is unreachable from the sheet',
   serverKinds.every((k) => kinds.includes(k)),
   `unreachable: ${serverKinds.filter((k) => !kinds.includes(k)).join(', ')}`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · THE WILDCARD GUARD — a defect this delivery caused and paid for');

// An accept value of image-slash-wildcard opens a block comment as far as every
// source-scanning instrument in this estate is concerned, and it silently ate
// two live controls out of the receipt list. The class is now guarded rather
// than remembered. Written WITHOUT the sequence appearing in this file.
const OPENER = '/' + '*';
const surfaceFiles = () => {
  const out = ['app/(frost)/frost/canvas/sanctuary/page.tsx'];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = P(d);
    if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) out.push(`${d}/${f}`);
  }
  return out;
};
const carriesOpener = (f) => [...raw(f).matchAll(/(?:accept|content|type)\s*=\s*"([^"]*)"/g)]
  .some((m) => m[1].includes(OPENER));

// RADIUS BOUNDED TO THIS DELIVERY'S FILES (R-33.2). The first draft scanned the
// whole surface and convicted `moments.tsx` and `muse.tsx`, which have carried
// the same wildcard since long before this sitting. A cell that reddens on code
// the delivery never touched is not a proof, it is a hostage.
ok('6.1', 'no attribute in THIS delivery\'s files carries the comment-opening sequence',
   ![BLOOM, EXPENSE].some(carriesOpener));

/* ── 6.1b · THE PRE-EXISTING PAIR, TURNED FROM A LATENT HAZARD INTO A GUARDED
   ONE, AND THIS IS THE CELL WORTH READING.

   `moments.tsx:279` and `muse.tsx:294` both declare an accept value of
   image-slash-wildcard. They are harmless TODAY, and only by luck: the naive
   comment stripper looks for the NEXT comment-close, and neither file has one
   after that line — so the match never completes and nothing is swallowed.

   The luck is one block comment deep. The moment anyone adds a commented note
   below either input, the file's tail vanishes from every source-scanning
   instrument in this estate, silently, and a sealed census moves by a number
   nobody can explain. That is precisely what happened in this delivery: the
   photo control was written with the wildcard, a comment followed it, and
   `expenses.tsx` measured 23 -> 22 on a delivery that only ADDED.

   So rather than convict two files this sitting has no charter over, this cell
   asserts the LUCK STILL HOLDS. Add a block comment after either input and this
   reddens — before the census does, and with the reason already written down.
   Filed for the chair; the stripper itself is the real cure and is not a UI
   sitting's to take. */
const LATENT = ['components/frost/blooms/moments.tsx', 'components/frost/blooms/muse.tsx'];
const exploded = LATENT.filter((f) => {
  if (!fs.existsSync(P(f))) return false;
  const src = raw(f);
  const at = src.indexOf('accept="image' + OPENER.slice(1) + '"');
  if (at === -1) return false;               // cured upstream — nothing to guard
  return src.indexOf(OPENER.slice(1) + '/', at) !== -1;   // a close now follows: it EATS
});
ok('6.1b', 'the two pre-existing wildcards still swallow nothing — the luck holds',
   exploded.length === 0,
   `${exploded.join(', ')} now has a comment-close after its wildcard: every ` +
   `census reading these files is silently short and this is why`);

ok('6.2', 'control: the photo control really does declare an accept list',
   /accept="image\/jpeg/.test(raw(EXPENSE)),
   'nothing declares accept any more, so 6.1 guards an empty set');

ok('6.3', 'every counted control in the receipt list survived the cure',
   /setFullImg\(r\.image_url\)/.test(code(EXPENSE)) &&
   /setConfirmId\(r\.id\)/.test(code(EXPENSE)),
   'the thumbnail tap or the delete control is gone — the two the wildcard ate');

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · G-3 — THE PHOTO REACHES THE DOOR ZIP 1 BUILT');

ok('7.1', 'the client posts to the image door',
   /\/api\/v2\/couple\/receipts\/\$\{id\}\/image/.test(code(CLIENT)));
/* READ RAW, LINE-ANCHORED, AND THE REASON IS A THIRD INSTANCE OF THE SAME
   DEFECT. `lib/frost/journey.ts:4` is a LINE comment reading
   "verified against actual dream-os src/api/couple/<star> handlers" — and those
   two characters open a block comment that the naive stripper closes eighty-
   three lines later. Every comment-stripped read of this file is missing lines
   4 through 87, which is where the import block lives. The cell was green over
   text that had been eaten, and would have stayed green with the import gone.
   `^import` at a line start cannot be inside a line comment, so raw is the
   SAFER read here, not the lazier one. Filed for the chair. */
ok('7.2', 'it reuses the ONE base64 reader rather than forking it',
   /^import \{ fileToBase64 \} from '\.\.\/frost-api\/muse'/m.test(raw(CLIENT)));
ok('7.2b', 'control: the stripper really is eating this file\'s import region',
   !/import \{ fileToBase64 \}/.test(code(CLIENT)),
   'the strip no longer swallows journey.ts lines 4-87 — retire this note and ' +
   'return 7.2 to the stripped read');
ok('7.3', 'the bloom patches from the SERVER\'s row, never a local guess',
   /const made=await uploadReceiptImage\(file\);[\s\S]{0,120}setReceipts\(prev=>\[made,\.\.\.prev\]\)/
     .test(code(EXPENSE).replace(/\s+/g, ' ').replace(/ /g, ' ')) ||
   /setReceipts\(prev=>\[made,\.\.\.prev\]\)/.test(code(EXPENSE)));

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · MUTATIONS — production code broken, sha256-restored');

const PROBES = {
  '1.z':  () => /\+ Ask Mira/.test(code(BLOOM)) && !/Ask DreamAi/.test(code(BLOOM)),
  '2.3':  () => /\{!loading&&done\.length>0&&\(/.test(code(BLOOM).replace(/\s+/g, '')),
  '3.1':  () => /fetchEvents\('all'\)/.test(code(BLOOM)) && !/fetchEvents\('upcoming'\)/.test(code(BLOOM)),
  '3.3':  () => /setEventState\(ev\.id, next\)/.test(code(BLOOM)),
  '4.2':  () => {
    const f = code(BLOOM).replace(/\s+/g, ' ');
    const without = f.replace(/updateEvent\(ev\.id, \{ assigned_circle_member_id: memberId \}\)/, '');
    const other = without.match(/updateEvent\([^;]*/);
    return !!other && !/assigned_circle_member_id/.test(other[0]);
  },
  '5.3':  () => {
    const k = [...raw(COPY).matchAll(/\{ value: '([a-z]+)'/g)].map((m) => m[1]);
    return serverKinds.every((x) => k.includes(x));
  },
  '6.1':  () => surfaceFiles().filter((f) => [...raw(f).matchAll(/(?:accept|content|type)\s*=\s*"([^"]*)"/g)]
                  .some((m) => m[1].includes(OPENER))).length === 0,
};

const MUTATIONS = [
  { id: 'M1', file: BLOOM, reds: ['3.1'],
    from: `    fetchEvents('all')`,
    to:   `    fetchEvents('upcoming')`,
    why:  'the read reverts — a done day vanishes and the toggle reads as a delete' },

  { id: 'M2', file: BLOOM, reds: ['3.3'],
    from: `      const r = await setEventState(ev.id, next);`,
    to:   `      const r = await updateEvent(ev.id, { state: next } as any);`,
    why:  'the toggle takes the full PATCH — a third updateEvent site' },

  { id: 'M3', file: BLOOM, reds: ['4.2'],
    from: `          title: fTitle.trim(), event_date: fDate, kind: fKind,\n          event_time: fTime || null,`,
    to:   `          title: fTitle.trim(), event_date: fDate, kind: fKind,\n          assigned_circle_member_id: null,\n          event_time: fTime || null,`,
    why:  'the edit sheet becomes a second writer of the delegation column' },

  { id: 'M4', file: BLOOM, reds: ['2.3'],
    from: `        {!loading&&done.length>0&&(`,
    to:   `        {!loading&&(`,
    why:  'the Done head renders over an empty section — line 12\'s strike undone' },

  { id: 'M5', file: BLOOM, reds: ['1.z'],
    from: `            + Ask Mira`,
    to:   `            + Ask DreamAi`,
    why:  'the founder\'s override reverted' },

  { id: 'M6', file: COPY, reds: ['5.3'],
    from: `  { value: 'recce',    label: 'Venue visit' },\n`,
    to:   ``,
    why:  'a server kind becomes unreachable from the sheet' },

  { id: 'M7', file: EXPENSE, reds: ['6.1'],
    from: `accept="image/jpeg,image/png,image/heic,image/heif,image/webp"`,
    to:   `accept="image` + '/' + `*"`,
    why:  'the wildcard returns and the stripper eats live controls again' },
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
console.log(`tdw15_p1_events: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('────────────────────────────────────────────────────────────');
if (failed.length) console.log('  failed: ' + failed.join(', '));
process.exit(fail === 0 ? 0 : 1);
