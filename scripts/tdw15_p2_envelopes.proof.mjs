#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/tdw15_p2_envelopes.proof.mjs
// TDW_15 · P2 · ZIP 2 — HER ENVELOPES, THE TRAY, THE HAIRLINE, THE MOVE.
//
//   node scripts/tdw15_p2_envelopes.proof.mjs
//
// ── WHAT THIS BENCH MAY CLAIM, AND WHAT IT MAY NOT ──────────────────────────
// Three sibling benches already watch parts of this delivery from their own
// angles: `obp_vendor_form` holds the eleven at their new home (R-34.52),
// `tdw09_frost_parity` holds the control census (R-34.53), and
// `tdw13_d4_extraction` holds the relocation canary (R-34.54). This bench
// asserts what none of them can see — the RULINGS: two emptinesses kept apart,
// the hairline's three tokens, press-never-drag, the closed copy set, and the
// picker reading the SERVER's list rather than a local map.
//
// IT CLAIMS NOTHING ABOUT THE WALL. Envelopes take unconditional absence on
// member-facing serializers, and every one of those lives in dream-os, where
// `b14_d1_visibility_bench` §6.10–6.13 already watches the three exact tokens
// 0088 minted. A pwa cell asserting a dream-os property would be a second home
// for that claim and would go green over a tree it cannot read.
//
// ── R-33.3 · THE PATTERN BOUND, AND WHY IT IS NOT THE OBVIOUS ONE ───────────
// NO CELL BELOW GREPS THE BARE WORD "envelope". This repo carries FIVE
// committed HTTP-sense readers of it (`lib/frost-api/_base.ts` calls a response
// body an envelope, and two vendor pages comment about it), so a naive pattern
// false-positives in BOTH directions: green on prose that has nothing to do
// with money, and unable to tell a budget byte from a fetch wrapper. Cells
// anchor on budget-sense tokens only — `envelope_id`, `budget_envelopes`,
// `BudgetEnvelope`, `ENVELOPE_COPY`, `categoryLabels`, the door paths.
//
// ── THE INSTRUMENT · WHY NOT THE SHARED STRIPPER ────────────────────────────
// Comment-stripping here uses the LINE-FILTER form that
// `tdw09_frost_parity.proof.mjs` uses, never `scripts/lib/stripComments.mjs`.
// The shared stripper leaks on this very file: `expenses.tsx:240`'s comment
// quotes an input tag inside backticks, and a census taken through the shared
// stripper reads 25 controls where the sealed instrument reads 24. A bench that
// reaches for the leaking stripper inherits the phantom.
//
// Mutations break PRODUCTION CODE, never bench setup; every anchor is verified
// unique in the FINAL tree before use (R-33.4); every file is sha256-restored.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const P    = (p) => path.join(ROOT, p);
const raw  = (p) => fs.readFileSync(P(p), 'utf8');
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');

// The parity bench's own decomment, deliberately: JSX comment spans first, then
// line comments. See the instrument note above.
const code = (p) => raw(p)
  .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
  .split('\n')
  .filter((l) => {
    const t = l.trim();
    return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*'));
  })
  .join('\n');

const BLOOM  = 'components/frost/blooms/expenses.tsx';
const CLIENT = 'lib/frost/journey.ts';
const COPY   = 'lib/frost/envelopeCopy.ts';
const LABELS = 'lib/frost/categoryLabels.ts';
const FORM   = 'app/vendor/onboarding/page.tsx';

let pass = 0, fail = 0;
const failed = [];
const ok = (id, claim, cond, why = '') => {
  if (cond) { pass++; console.log(`  ok   ${id} ${claim}`); }
  else { fail++; failed.push(id); console.log(`  FAIL ${id} ${claim}${why ? `\n         ${why}` : ''}`); }
};
const sec = (h) => console.log(`\n══ ${h} ══`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE COPY SET IS CLOSED — nine founder bytes, one home');

// APPROVED-COPY-CARRIES-ITS-HASH. All nine were read back to the founder and
// approved on 2026-08-18. One character's drift is a NEW veto, not a tidy.
const BYTES = {
  tab:               'Envelopes',
  sheetTitle:        'New envelope',
  namePlaceholder:   'Or name your own',
  amountLabel:       'Amount set aside',
  file:              'File',
  emptyEnvelopes:    "Envelopes hold what you've set aside. Make your first.",
  emptyTray:         "Everything's filed.",
  photoUntyped:      'Photo filed. Amount not typed yet.',
  deleteConsequence: 'Its receipts go back to the tray.',
};
const copySrc = raw(COPY);
for (const [k, v] of Object.entries(BYTES)) {
  ok(`1.${k}`, `「 ${v} 」 at the byte`,
     copySrc.includes(`'${v}'`) || copySrc.includes(`"${v}"`),
     'the founder-vetoed byte drifted or left its home');
}

// 1.z — THE SET IS CLOSED, and this is the cell that makes that a claim rather
// than an intention. P1's owned defect was authoring `Edit` and `Remove` in the
// build and owing them afterwards. A tenth key here is a string that reached
// the surface without a veto.
const copyKeys = [...copySrc.matchAll(/^\s{2}([a-zA-Z]+):\s/gm)].map((m) => m[1]);
ok('1.z', 'the copy home declares EXACTLY the nine vetoed keys — a tenth is an unvetoed string',
   copyKeys.length === 9 && Object.keys(BYTES).every((k) => copyKeys.includes(k)),
   `${copyKeys.length} keys: ${copyKeys.join(', ')}`);

// 1.y — control: the bloom RENDERS them from that home rather than re-typing
// them. Nine bytes in a file nobody imports is decoration.
ok('1.y', 'the bloom reaches the copy home rather than repeating its bytes',
   /import \{ ENVELOPE_COPY \} from '@\/lib\/frost\/envelopeCopy'/.test(code(BLOOM)) &&
   Object.keys(BYTES).every((k) => code(BLOOM).includes(`ENVELOPE_COPY.${k}`)),
   'a vetoed byte is not rendered through its home');

// 1.x — NO SEED NAMES (R-34.30, R-34.31). The room opens empty. A seeded row
// would be the estate writing her budget for her.
const SIGNED = ['Event Planner', 'Photography & Videography', 'Make up Artist',
  'Venue & Catering', 'Performer (Anchor, DJ, Choreography)', 'Content Creator'];
ok('1.x', 'NO seed envelope names — not one signed label is a literal in the bloom',
   SIGNED.every((s) => !code(BLOOM).includes(s)),
   'a category label is hard-typed into the room; the eleven are the PICKER, not data');

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE MOVE — one home, two readers, zero labels authored (R-34.33)');

ok('2.1', 'the eleven and their fallback are DECLARED at lib/frost/categoryLabels.ts',
   /export const CAT_LABEL: Record<string, string> = \{/.test(raw(LABELS)) &&
   /export const labelFor/.test(raw(LABELS)));
ok('2.2', 'the vendor form is WIRED to that home, not carrying a copy',
   /import \{[^}]*\blabelFor\b[^}]*\} from '@\/lib\/frost\/categoryLabels'/.test(code(FORM)) &&
   !/const CAT_LABEL: Record<string, string> = \{/.test(code(FORM)));
ok('2.3', 'the bride bloom is wired to the SAME home — one map, two readers',
   /import \{[^}]*\blabelFor\b[^}]*\} from '@\/lib\/frost\/categoryLabels'/.test(code(BLOOM)));
// 2.4 — control: a third declaration anywhere in the tree is the defect the
// move exists to prevent, and it must red HERE rather than at review.
const declHomes = ['lib/frost/categoryLabels.ts', BLOOM, FORM, CLIENT]
  .filter((f) => /const CAT_LABEL: Record<string, string> = \{/.test(raw(f)));
ok('2.4', 'control: EXACTLY ONE file declares the label map',
   declHomes.length === 1 && declHomes[0] === 'lib/frost/categoryLabels.ts',
   `declared in: ${declHomes.join(', ') || 'nowhere'}`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · THE PICKER IS THE SERVER\'S LIST (R-34.34)');

ok('3.1', 'the picker iterates the RESPONSE — allowed.map, never Object.keys(CAT_LABEL)',
   /allowed\.map\(/.test(code(BLOOM)) &&
   !/Object\.keys\(CAT_LABEL\)/.test(code(BLOOM)));
ok('3.2', 'the client fetches the canonical eleven from the couple door',
   /'\/api\/v2\/couple\/envelopes\/categories'/.test(code(CLIENT)) &&
   /export async function fetchEnvelopeCategories/.test(code(CLIENT)));
// 3.3 — the fallback is what makes a server-added twelfth token RENDER rather
// than vanish. Without it the picker silently shortens on a taxonomy change.
ok('3.3', 'an unlabelled server token still renders — the picker maps through labelFor',
   /\{labelFor\(token\)\}/.test(code(BLOOM)));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · TWO EMPTINESSES, NEVER CONFLATED (R-34.22)');

// 4.1 — S3 is a claim about the AMOUNT. A version keyed on `envelope_id` would
// tell her a filed receipt is unfiled, which is the conflation by name.
ok('4.1', 'the untyped line keys on amount === null, never on envelope_id',
   /\{r\.amount===null&&<div[^>]*>\{ENVELOPE_COPY\.photoUntyped\}/.test(code(BLOOM).replace(/\s+/g, ' ')),
   'the untyped signal reads the wrong column');
// 4.2 — the tray is a DOOR. A client-side filter over the paginated receipt
// read silently truncates, and a tray that is short is worse than no tray.
ok('4.2', 'the tray comes from its own door, not a filter over the receipt list',
   /'\/api\/v2\/couple\/envelopes\/\$\{id\}\/unfiled'/.test(code(CLIENT).replace(/`/g, "'")) &&
   !/receipts\.filter\([^)]*envelope_id/.test(code(BLOOM)),
   'the tray is being computed client-side');
// 4.3 — control: the two axes really do cross on this surface, so 4.1/4.2 guard
// a live hazard rather than an empty set.
ok('4.3', 'control: the surface partitions the SAME table on both axes',
   /receipts\.filter\(r=>!r\.image_url\)/.test(code(BLOOM)) &&
   /unfiled\.map\(/.test(code(BLOOM)),
   'the double-appearance hazard is absent, so the cells above guard nothing');

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE HAIRLINE — three tokens, no fourth, and wordless (R-34.29/.30)');

const hair = code(BLOOM).replace(/\s+/g, ' ');
ok('5.1', 'the fill is inkSoft below the threshold and ac above it',
   /background:past\?ac:inkSoft/.test(hair));
ok('5.2', 'the rail stays `line`',
   /<div style=\{\{height:2,borderRadius:2,background:line/.test(hair));
ok('5.3', 'the threshold is 90% and it is a named constant, not a scattered literal',
   /const HAIR_THRESHOLD = 0\.9;/.test(code(BLOOM)) &&
   /ratio>=HAIR_THRESHOLD/.test(hair));
// 5.4 — NO NEW TOKEN. The ruling's own clause: the hairline reuses the room's
// declared colours and mints nothing. A fresh hex would hand the signal a hue
// no other control on the surface answers to.
//
// THE BASE SET IS DERIVED BY COMMAND, NOT HAND-KEPT. A first draft of this cell
// listed the room's hexes from a read of its token block and reported six
// "unknown" colours that had been in the gradients since D-4 — a cell convicting
// pre-existing code because its author wrote the allowlist from a window
// instead of from the tree (R-33.2, and the independent-method law's clause 1:
// the check must not reproduce the method under test). It now asks git.
const BASE_TIP = 'c6e631d';
const hexesIn = (src) => new Set([...src.matchAll(/#[0-9A-Fa-f]{6}/g)].map((m) => m[0].toUpperCase()));
let baseHexes = null;
try {
  baseHexes = hexesIn(execSync(`git show ${BASE_TIP}:"${BLOOM}"`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1e8 }));
} catch { /* reported by the cell below */ }
ok('5.4a', `the pre-delivery tree is readable at ${BASE_TIP}`, baseHexes !== null,
   'git show failed — 5.4 would be vacuous, so it is not claimed');
const minted = baseHexes ? [...hexesIn(code(BLOOM))].filter((h) => !baseHexes.has(h)) : ['<underived>'];
ok('5.4', 'NO NEW TOKEN — this delivery minted zero colour literals in the room',
   baseHexes !== null && minted.length === 0,
   `minted: ${minted.join(', ')}`);
// 5.5 — WORDLESS. `spent` is a floor, not a total (a filed receipt can be
// untyped and contribute zero), so a percentage beside it would claim a
// precision the number does not have.
ok('5.5', 'the 90% signal renders NO words — no percent glyph, no label near the fill',
   !/%<\/|>\d+%|toFixed\(/.test(code(BLOOM)) && !/HAIR_THRESHOLD[^;]*ENVELOPE_COPY/.test(hair),
   'a label or percentage was authored onto the wordless signal');
// 5.6 — a zero ceiling has no ratio to draw.
ok('5.6', 'a zero ceiling renders the rail and no fill',
   /\{ceiling>0&&<div style=\{\{height:'100%'/.test(hair));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · PRESS, NEVER DRAG (R-34.28 / R-35.5)');

// HTML5 DnD does not fire on touch and the bride plane is a phone. Drag is
// deferred and chartered separately; this cell keeps it deferred.
ok('6.1', 'NO drag handler entered the room',
   !/onDragStart|onDragOver|onDrop\b|draggable/.test(code(BLOOM)));
// 6.2 — the file control lives inside a row whose own tap opens the delete
// confirm. Sharing that event would arm a delete on a file gesture.
ok('6.2', 'the file control STOPS the row tap rather than sharing it',
   /onClick=\{\(e\)=>\{e\.stopPropagation\(\);setFiling\(r\);\}\}/.test(code(BLOOM).replace(/\s+/g, '')),
   'the file press propagates into the row handler');
// 6.3 — the row tap ships BYTE-UNTOUCHED (R-35.5), accounted KEPT.
ok('6.3', 'the `my` row\'s tap keeps its byte and its meaning',
   code(BLOOM).includes(`<div key={r.id} onClick={()=>setConfirmId(r.id)}`),
   'the relocated row handler was edited — accounted KEPT, so this is a drift');
// 6.4 — NO UNFILE CONTROL this delivery (declared gap, not a hidden one).
ok('6.4', 'no control sends the door\'s legal null body — unfiling is a declared gap',
   !/fileReceipt\([^)]*,\s*null\s*\)/.test(code(BLOOM)),
   'an unfile control shipped without a ruling');

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · THE CLIENT — doors read from the handler, census honest (R-35.6/.7/.8)');

// READ ON THE RAW TEXT, DELIBERATELY. The section headers this cell navigates by
// are LINE COMMENTS, and `code()` strips them — a first draft asked the stripped
// text where the ENVELOPES header was, got -1, and reported the write path
// misplaced when it was exactly where the ruling put it. A cell that deletes the
// landmark it navigates by measures nothing.
const clientRaw = raw(CLIENT);
const iReceipts = clientRaw.indexOf('API FUNCTIONS — RECEIPTS');
const iFile     = clientRaw.indexOf('export async function fileReceipt');
const iEnv      = clientRaw.indexOf('API FUNCTIONS — ENVELOPES');
ok('7.1', 'the tag PATCH client sits in the RECEIPTS section, one home for the row\'s write path',
   iReceipts > 0 && iEnv > 0 && iFile > iReceipts && iFile < iEnv,
   `receipts@${iReceipts} fileReceipt@${iFile} envelopes@${iEnv}`);
ok('7.1a', 'control: the ENVELOPES section exists and points at that home by PATH and SYMBOL, never a line range',
   iEnv > 0 && /lib\/frost\/journey\.ts` \u00b7 `fileReceipt`/.test(clientRaw.replace(/`/g, '`')),
   'the cross-pointer is missing or cites a line range (THE PATH-OVER-RANGE LAW)');
ok('7.2', 'the five envelope calls exist and name their doors',
   ['fetchEnvelopeCategories', 'fetchEnvelopes', 'fetchUnfiledReceipts',
    'createEnvelope', 'deleteEnvelope'].every((f) => code(CLIENT).includes(`export async function ${f}`)));
// 7.3 — E2's census. It said `table` and listed the interface; it now says
// `interface` and lists what this client actually receives. A census naming
// columns the client never sees would be the false-comment class F-15.11 cured.
const census = (raw(CLIENT).match(/^\/\/ couple_receipts .*$/m) || [''])[0];
ok('7.3', 'the census reads `interface`, carries envelope_id, and claims no column this client never receives',
   /couple_receipts interface:/.test(census) &&
   census.includes('envelope_id') &&
   !census.includes('couple_id') && !census.includes('label'),
   `census: ${census}`);
ok('7.4', 'the row type carries envelope_id as nullable — NULL is unfiled, a state and not a gap',
   /envelope_id: string \| null;/.test(code(CLIENT)));

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · THE STRIPPER TRAP STAYS SHUT (P1 §4\'s three instances)');

const OPENER = '/' + '*';
const counted = [BLOOM, CLIENT, COPY, LABELS];
const carriers = counted.filter((f) =>
  [...raw(f).matchAll(/(?:accept|content|type)\s*=\s*"([^"]*)"/g)].some((m) => m[1].includes(OPENER)));
ok('8.1', 'no attribute in this delivery\'s counted files carries the comment-opening sequence',
   carriers.length === 0, carriers.join(', '));
// 8.2 — control: the guard is over a real corpus, not an empty one.
ok('8.2', 'control: those files really do declare accept attributes',
   counted.some((f) => /accept="image\/jpeg/.test(raw(f))),
   'nothing declares accept any more, so 8.1 guards an empty set');
// 8.3 — no string or comment in a counted file may form the opener either.
const formers = counted.filter((f) => {
  const s = raw(f);
  const idx = [...s.matchAll(/\/\*/g)].map((m) => m.index);
  return idx.some((i) => {
    const line = s.slice(s.lastIndexOf('\n', i) + 1, s.indexOf('\n', i));
    return /['"`]/.test(line.slice(0, i - s.lastIndexOf('\n', i) - 1)) && !line.trim().startsWith('//');
  });
});
ok('8.3', 'no string literal in a counted file forms the opener',
   formers.length === 0, formers.join(', '));

// ═══════════════════════════════════════════════════════════════════════════
sec('§9 · MUTATIONS — production code broken, sha256-restored');

const PROBES = {
  '1.x':  () => SIGNED.every((s) => !code(BLOOM).includes(s)),
  '2.4':  () => ['lib/frost/categoryLabels.ts', BLOOM, FORM, CLIENT]
                  .filter((f) => /const CAT_LABEL: Record<string, string> = \{/.test(raw(f))).length === 1,
  '3.1':  () => /allowed\.map\(/.test(code(BLOOM)) && !/Object\.keys\(CAT_LABEL\)/.test(code(BLOOM)),
  '4.1':  () => /\{r\.amount===null&&<div[^>]*>\{ENVELOPE_COPY\.photoUntyped\}/.test(code(BLOOM).replace(/\s+/g, ' ')),
  '5.1':  () => /background:past\?ac:inkSoft/.test(code(BLOOM).replace(/\s+/g, '')),
  '5.4':  () => baseHexes !== null
                  && [...hexesIn(code(BLOOM))].filter((h) => !baseHexes.has(h)).length === 0,
  '6.1':  () => !/onDragStart|onDragOver|onDrop\b|draggable/.test(code(BLOOM)),
  '6.2':  () => /onClick=\{\(e\)=>\{e\.stopPropagation\(\);setFiling\(r\);\}\}/.test(code(BLOOM).replace(/\s+/g, '')),
  '6.4':  () => !/fileReceipt\([^)]*,\s*null\s*\)/.test(code(BLOOM)),
  '7.3':  () => {
    const c = (raw(CLIENT).match(/^\/\/ couple_receipts .*$/m) || [''])[0];
    return /couple_receipts interface:/.test(c) && c.includes('envelope_id')
        && !c.includes('couple_id') && !c.includes('label');
  },
};

const MUTATIONS = [
  { id: 'M1', file: BLOOM, reds: ['3.1'],
    from: `            {allowed.map(token=>(`,
    to:   `            {Object.keys(CAT_LABEL).map(token=>(`,
    why:  'the picker iterates the local map — a token dream-os adds vanishes silently' },

  { id: 'M2', file: BLOOM, reds: ['4.1'],
    from: `                {r.amount===null&&<div`,
    to:   `                {r.envelope_id===null&&<div`,
    why:  'the two emptinesses collapse — a FILED receipt is told it is unfiled' },

  { id: 'M3', file: BLOOM, reds: ['5.1'],
    from: `          background:past?ac:inkSoft,borderRadius:2}}/>}`,
    to:   `          background:past?ac:ink,borderRadius:2}}/>}`,
    why:  'the below-threshold fill becomes ink — R-34.29\'s rejected crossing' },

  { id: 'M4', file: BLOOM, reds: ['5.4'],
    from: `  const HAIR_THRESHOLD = 0.9;`,
    to:   `  const HAIR_THRESHOLD = 0.9;\n  const HAIR_WARN = '#D97757';`,
    why:  'a fourth token is minted for the signal — the no-new-token clause' },

  { id: 'M5', file: BLOOM, reds: ['6.2'],
    from: `      <button onClick={(e)=>{e.stopPropagation();setFiling(r);}}`,
    to:   `      <button onClick={()=>setFiling(r)}`,
    why:  'the file press propagates — filing a receipt also arms its delete' },

  { id: 'M6', file: BLOOM, reds: ['6.1'],
    from: `            <div key={r.id} onClick={()=>setConfirmId(r.id)}`,
    to:   `            <div key={r.id} draggable onClick={()=>setConfirmId(r.id)}`,
    why:  'drag returns to a touch surface where it cannot fire (R-34.28)' },

  { id: 'M7', file: BLOOM, reds: ['1.x'],
    from: `            {allowed.map(token=>(`,
    to:   `            {['Venue & Catering'].map(token=>(`,
    why:  'a signed label is hard-typed into the room — the eleven become data' },

  { id: 'M8', file: CLIENT, reds: ['7.3'],
    from: `// couple_receipts interface: id, booking_id, amount, vendor_name, description, receipt_date, image_url, tags, created_at, envelope_id`,
    to:   `// couple_receipts table: id, booking_id, amount, vendor_name, description, receipt_date, image_url, tags, created_at, envelope_id, couple_id, label`,
    why:  'the census claims columns this client never receives — F-15.11\'s class' },

  { id: 'M9', file: FORM, reds: ['2.4'],
    from: `import { labelFor } from '@/lib/frost/categoryLabels';`,
    to:   `import { labelFor } from '@/lib/frost/categoryLabels';\nconst CAT_LABEL: Record<string, string> = { other: 'Something else' };`,
    why:  'a second home for the label map — the MOVE becomes a fork' },

  { id: 'M10', file: BLOOM, reds: ['6.4'],
    from: `            <button key={env.id} onClick={()=>handleFile(filing.id,env.id)} disabled={saving}`,
    to:   `            <button key={env.id} onClick={()=>fileReceipt(filing.id, null)} disabled={saving}`,
    why:  'an unfile path ships unruled, behind a control that says it files' },
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
console.log(`tdw15_p2_envelopes: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('────────────────────────────────────────────────────────────');
if (failed.length) console.log('  failed: ' + failed.join(', '));
process.exit(fail ? 1 : 0);
