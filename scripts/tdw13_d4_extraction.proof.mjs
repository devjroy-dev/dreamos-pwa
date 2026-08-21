#!/usr/bin/env node
// scripts/tdw13_d4_extraction.proof.mjs
//
// TDW_13 · D-4 · THE EXTRACTION (P2, narrow) — the bench.
//
// Six blooms left sanctuary/page.tsx for components/frost/blooms/, two shared
// helpers moved to components/frost/_shared/, and the choreography took its
// FROZEN header. Under F-1 the relocation is VERBATIM: only the import mechanism
// may differ. No token conversion, no hygiene, no feature.
//
// THE ONE THING THIS BENCH MUST NOT DO is prove the shape of the work. A cell
// that says "six files exist" is satisfied by six empty files. So every claim
// here is anchored to the PRE-EXTRACTION TREE at b1448c4, read out of git: each
// relocated line must still exist, each control must still be counted, each
// capability must still be reachable. The old tree is the witness, not my
// description of it.
//
// THE CANARY (chair's obligation): a line that exists in the pre-extraction file
// and in NO post-extraction file is a line the extraction ate. Cell 2 is that
// check across all 1,600 relocated lines, and cell 2b proves the check can fail.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => path.join(ROOT, p);
const BASE = 'b1448c4';                       // the tree D-4 was cut from

let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push(['ok  ', name]); }
  else { fail++; results.push(['FAIL', name + (detail ? ' — ' + detail : '')]); }
  return !!cond;
}
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

const CONDUCTOR = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const BLOOMS = ['expenses', 'vendors', 'settings', 'people', 'events', 'moments'];
const BLOOM_FILE = (k) => `components/frost/blooms/${k}.tsx`;
const SHARED = ['components/frost/_shared/usePress.ts',
                'components/frost/_shared/coupleAccessToken.ts'];

const readNow = (p) => fs.existsSync(R(p)) ? fs.readFileSync(R(p), 'utf8') : null;

// ── the pre-extraction witness, out of git rather than out of memory ─────────
let OLD = null, gitOk = false;
try {
  OLD = execSync(`git show ${BASE}:"${CONDUCTOR}"`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1e8 });
  gitOk = true;
} catch { /* reported below */ }
ok('0a. the pre-extraction tree is readable at ' + BASE, gitOk,
   'git show failed — every comparison below would be vacuous');
if (!gitOk) {
  console.log('\n  BENCH ABORTED — without the old tree this proves nothing.\n');
  process.exit(1);
}
ok('0b. the witness is the whole file, not a truncated read',
   OLD.split('\n').length > 4900, `${OLD.split('\n').length} lines`);

// ═════════════════════════════════════════════════════════════════════════════
// 1 — the files exist and are not stubs
// ═════════════════════════════════════════════════════════════════════════════
const bodies = {};
for (const k of BLOOMS) {
  const src = readNow(BLOOM_FILE(k));
  bodies[k] = src;
  ok(`1.${k} — the bloom file exists and carries a real component`,
     !!src && src.length > 3000 && new RegExp(`export function ${k[0].toUpperCase()}${k.slice(1)}Room\\(`).test(src),
     src ? `${src.length} bytes` : 'absent');
}
for (const s of SHARED) ok(`1.shared — ${path.basename(s)} exists`, !!readNow(s));

// ═════════════════════════════════════════════════════════════════════════════
// 2 — THE CANARY. No relocated line was eaten.
// ═════════════════════════════════════════════════════════════════════════════
const SPANS = { expenses: [254, 546], vendors: [547, 877], settings: [878, 1122],
                people: [1123, 1380], events: [2591, 2794], moments: [3542, 3810] };
const oldLines = OLD.split('\n');
const haystack = [readNow(CONDUCTOR), ...BLOOMS.map((k) => bodies[k]), ...SHARED.map(readNow)]
  .filter(Boolean).join('\n');
// A missing file must make cells go RED, never make the bench throw: a crash is
// not a verdict, and at the pre-extraction tree every bloom file is absent.
const safe = (s) => s || '';

function relocatedLines() {
  const out = [];
  for (const [, [a, b]] of Object.entries(SPANS)) out.push(...oldLines.slice(a - 1, b));
  return out.filter((l) => l.trim().length > 3);   // blank/brace lines are not evidence
}
const moved = relocatedLines();

/* ── AMENDED, LABELLED — TDW_15 · P1 (CE-34, 2026-08-15) ────────────────────
   THIS CELL IS A RELOCATION CANARY AND IT HAS NOW MET ITS FIRST LAWFUL EDIT.

   D-4's claim was that an extraction moved bytes WITHOUT CHANGING THEM, and
   this cell has guarded that by demanding every relocated line still exist
   somewhere. That was exactly right for a relocation commit, and D-4b honoured
   it literally: a `position:'relative'` was REVERTED rather than argued with,
   because the line's byte-identity was another delivery's proof.

   TDW_15 P1 is not a relocation. It is the feature the relocation was clearing
   the ground for, and it edits seven relocated lines BY RULING. An unamended
   canary would simply go red and stay red, which retires it — a permanently
   red cell grades nothing, and the mutation that proves it live (M1, a
   relocated line quietly dropped) reports DEAD while it is.

   SO THE CANARY KEEPS ITS TEETH BY NAMING ITS EXCEPTIONS RATHER THAN BY
   LOWERING ITS BAR. Each line below is listed VERBATIM with the ruling that
   moved it. An eighth eaten line — one nobody ruled — still reddens this cell,
   which is the whole property worth preserving. A cell that asserts "nothing
   changed except these seven things" is a real assertion; one that asserts
   "roughly nothing changed" is not.

   Every entry is verified PRESENT in the pre-extraction corpus before it is
   honoured, so a stale allowlist entry cannot silently widen the exemption
   after the line it names has gone. */
const RULED_EDITS = [
  // R-34.8 — the room reads 'all', because a done day must settle rather than
  // vanish from the only list this bloom renders.
  "    fetchEvents('upcoming')",
  // R-34.8 — the highlight and the list follow the `upcoming` group now that
  // `events` also carries settled days.
  "  const soonestIdx=events.findIndex(ev=>{",
  "        {!loading&&events.length>0&&(",
  "            {events.map((ev,i)=>{",
  "            {events.length>0 ? `${events.length} beautiful moment${events.length!==1?'s':''} ahead.` : 'Your days will appear here.'}",
  // Founder veto, 2026-08-15, radius A — 「 change it to ask Mira 」.
  '          + Ask DreamAi',
  // Founder veto line 1 — the byte became FALSE the moment this room grew its
  // own Add: it told her to leave the room to do a thing the room now does.
  '              Tell Dream Ai about an event<br/>and it will appear here.',
  // ── EIGHTH ENTRY, ADDED BY RULING — TDW_15 · P2 (R-34.54, CE-35, 2026-08-18)
  // R-35.4 made the envelope room the FOURTH `ExpenseSlice`, so this union type
  // gains `'env'`. The line is verified PRESENT in the pre-extraction corpus
  // before it is honoured (2a0 above does that mechanically, every run): it sits
  // at `b1448c4` inside the expenses span [254,546], relative line 5.
  //
  // SEVEN -> EIGHT, AND A NINTH STILL REDS. That is the whole property: this
  // canary asserts "nothing changed except these eight things", which is a real
  // claim, where "roughly nothing changed" would not be. The allowlist grows by
  // RULING and one entry at a time, never by widening a pattern.
  "type ExpenseSlice = 'my'|'vendor'|'receipts';",
  // ── NINTH ENTRY, ADDED BY RULING — TDW_15 · P3.3 (R-35.25, CE-35, 2026-08-20)
  // P3.3 puts the moments viewer on the 07 image discipline's `full` variant
  // (w_1600) instead of the raw original, because the viewer is a phone screen
  // and a camera JPEG can be several megabytes. The `src` IS the cure, so the
  // line cannot survive it.
  //
  // VERIFIED PRESENT IN THE PRE-EXTRACTION CORPUS BEFORE BEING HONOURED, and the
  // derivation is shown in the delivery rather than asserted: at `b1448c4` the
  // conductor carries this line at absolute 3674, inside the moments span
  // [3542, 3810] this file's own map declares — relative line 133. Cell 2a0
  // re-checks that mechanically on every run, so a stale exemption cannot widen
  // the bar after the line it names has gone.
  '        <img src={fullImg} alt="" style={{maxWidth:\'96vw\',maxHeight:\'92vh\',objectFit:\'contain\',borderRadius:4}}/>',
  // ── TENTH ENTRY, ADDED BY RULING — TDW_15 · P3.3 (R-35.25, CE-35, 2026-08-20)
  // The grid tile gains an LQIP wash beneath a `card` variant (w_800), replacing
  // a full-size original served into a small tile behind nothing but
  // `loading="lazy"`. Same reason the ninth entry cannot survive: the `src` is
  // the subject.
  //
  // VERIFIED PRESENT AT `b1448c4`: absolute 3741, inside the same moments span
  // [3542, 3810] — relative line 200.
  //
  // TEN, AND AN ELEVENTH STILL REDS. R-35.25 granted these ONE AT A TIME, each
  // labelled with its ruling, exactly as R-34.54 granted the eighth. The
  // allowlist has never grown by a pattern and must not start: "nothing changed
  // except these ten things" is a real claim; "roughly nothing changed" is not.
  '                <img src={m.image_url} alt={m.caption||\'\'} style={{width:\'100%\',height:\'100%\',objectFit:\'cover\',display:\'block\'}} loading="lazy"/>',
];
const STALE_EXEMPTIONS = RULED_EDITS.filter((l) => !moved.includes(l));
ok('2a0. every ruled exemption names a line that was actually relocated',
   STALE_EXEMPTIONS.length === 0,
   `${STALE_EXEMPTIONS.length} stale: ${STALE_EXEMPTIONS.map((l) => l.trim().slice(0, 40)).join(' | ')}`);

const eaten = moved.filter((l) => !haystack.includes(l) && !RULED_EDITS.includes(l));
ok('2a. every relocated line still exists, except the ten edited by ruling',
   eaten.length === 0,
   `${eaten.length} eaten, first: ${(eaten[0] || '').trim().slice(0, 70)}`);
ok('2a2. control: the exemption is NARROW — all ten ruled lines really are gone',
   RULED_EDITS.every((l) => !haystack.includes(l)),
   'a ruled exemption is covering a line that never moved, which widens the ' +
   'cell for nothing and would hide the next real eat');
ok('2b. control: the canary is checking a real corpus',
   moved.length > 1200, `${moved.length} substantive lines checked`);
ok('2c. control: the canary CAN fail (a line that never existed is not found)',
   !haystack.includes('__D4_CANARY_LINE_THAT_NEVER_EXISTED__'));

// the reverse direction: the conductor must have SHED those lines, not kept a copy
const conductorNow = safe(readNow(CONDUCTOR));
const stillInConductor = Object.entries(SPANS).map(([k, [a, b]]) => {
  const sig = oldLines.slice(a - 1, b).filter((l) => l.trim().length > 20)[3] || '';
  return [k, sig && conductorNow.includes(sig)];
}).filter(([, v]) => v).map(([k]) => k);
ok('2d. the conductor SHED the six — no room was copied instead of moved',
   stillInConductor.length === 0, `still present: ${stillInConductor.join(', ')}`);

// ═════════════════════════════════════════════════════════════════════════════
// 3 — ONE HOME each. A relocation that duplicates is worse than one that fails.
// ═════════════════════════════════════════════════════════════════════════════
for (const k of BLOOMS) {
  const fn = `function ${k[0].toUpperCase()}${k.slice(1)}Room(`;
  const n = [conductorNow, ...BLOOMS.map((x) => safe(bodies[x]))].filter((s) => s.includes(fn)).length;
  ok(`3.${k} — declared in exactly one file`, n === 1, `${n} files declare it`);
}
for (const [name, home] of [['usePress', SHARED[0]], ['coupleAccessToken', SHARED[1]]]) {
  const decl = [conductorNow, ...BLOOMS.map((x) => safe(bodies[x])), ...SHARED.map((f) => safe(readNow(f)))]
    .filter((s) => s && new RegExp(`^(export )?function ${name}\\(`, 'm').test(s)).length;
  ok(`3.shared — ${name} is declared once, in ${path.basename(home)}`, decl === 1, `${decl} declarations`);
}

// ═════════════════════════════════════════════════════════════════════════════
// 4 — the conductor still MOUNTS every room it used to mount
// ═════════════════════════════════════════════════════════════════════════════
for (const k of BLOOMS) {
  const C = `${k[0].toUpperCase()}${k.slice(1)}Room`;
  // `<${C} ` fails on a multi-line mount: EventsRoom's seven props wrap, so the
  // character after the name is a newline, not a space. Matching on the literal
  // was a cell that would have reported a healthy mount as missing — and worse,
  // would have passed for every room whose props happened to fit on one line.
  ok(`4.${k} — the conductor imports it and still mounts <${C}/>`,
     conductorNow.includes(`from '@/components/frost/blooms/${k}'`) &&
     new RegExp(`<${C}\\s`).test(conductorNow));
}
// the props each mount passes must be unchanged from the old tree
for (const k of BLOOMS) {
  const C = `${k[0].toUpperCase()}${k.slice(1)}Room`;
  const grab = (s) => (s.match(new RegExp(`<${C}\\b[^/]*/>`)) || [''])[0].replace(/\s+/g, ' ');
  ok(`4.props.${k} — the mount's props are byte-unchanged`,
     grab(conductorNow) === grab(OLD), `now: ${grab(conductorNow)} | was: ${grab(OLD)}`);
}

// ═════════════════════════════════════════════════════════════════════════════
// 5 — THE FROZEN HEADER (F-1)
// ═════════════════════════════════════════════════════════════════════════════
ok('5a. the choreography carries its FROZEN header', /CHOREOGRAPHY — FROZEN \(F-1\)/.test(conductorNow));
ok('5b. the fence is closed — a freeze with no end fences the whole file',
   /FREEZE ENDS \(F-1\)/.test(conductorNow));
const fenceStart = conductorNow.indexOf('CHOREOGRAPHY — FROZEN (F-1)');
const fenceEnd = conductorNow.indexOf('FREEZE ENDS (F-1)');
ok('5c. the fence is ordered and non-empty', fenceStart > 0 && fenceEnd > fenceStart);
const fenced = conductorNow.slice(fenceStart, fenceEnd);
for (const [what, re] of [
  ['openRoom', /const openRoom = useCallback/], ['closeRoom', /const closeRoom = useCallback/],
  ['the popstate back-trap', /popstate/], ['both teardown timers', /BLOOM_CLOSE_MS/],
]) ok(`5d. the fence actually contains ${what}`, re.test(fenced));
// and the motion itself is still byte-identical to the pre-extraction tree
for (const [what, re] of [
  ['closeRoom\'s body', /const closeRoom = useCallback\(\(\)=>\{[\s\S]{0,220}?\},BLOOM_CLOSE_MS\);/],
  ['openRoom\'s triad', /setActiveRoom\(key\);\s*setBlooming\(true\);\s*setClosing\(false\);/],
]) {
  const a = (OLD.match(re) || [''])[0], b = (conductorNow.match(re) || [''])[0];
  ok(`5e. ${what} survives the extraction byte-identical`, !!a && a === b);
}

// ═════════════════════════════════════════════════════════════════════════════
// 6 — NO FEATURE, NO HYGIENE, NO TOKEN WORK rode the relocation
// ═════════════════════════════════════════════════════════════════════════════
const allNew = [conductorNow, ...BLOOMS.map((k) => safe(bodies[k])), ...SHARED.map((f) => safe(readNow(f)))].join('\n');
// every hex literal present now must have been present before — token conversion is P3's
const hexNow = [...allNew.matchAll(/#[0-9A-Fa-f]{6}\b/g)].map((m) => m[0]);
const hexOld = new Set([...OLD.matchAll(/#[0-9A-Fa-f]{6}\b/g)].map((m) => m[0]));
ok('6a. no colour literal was invented or converted — P3 owns tokens',
   hexNow.every((h) => hexOld.has(h)),
   [...new Set(hexNow.filter((h) => !hexOld.has(h)))].join(' '));
ok('6b. control: there ARE hex literals here, so 6a is not vacuous', hexNow.length > 20,
   `${hexNow.length} literals`);
// no bloom performs its own data access beyond what it already did
for (const k of BLOOMS) {
  const oldSpan = oldLines.slice(SPANS[k][0] - 1, SPANS[k][1]).join('\n');
  const fetchNow = (safe(bodies[k]).match(/\bfetch\(/g) || []).length;
  const fetchOld = (oldSpan.match(/\bfetch\(/g) || []).length;
  ok(`6c.${k} — no new raw fetch appeared during the move`, fetchNow === fetchOld,
     `now ${fetchNow}, was ${fetchOld}`);
}

// ═════════════════════════════════════════════════════════════════════════════
// 7 — NON-VACUITY BY PRODUCTION MUTATION
// ═════════════════════════════════════════════════════════════════════════════
const PRE = Object.fromEntries([CONDUCTOR, ...BLOOMS.map(BLOOM_FILE)].map((p) => [p, readNow(p)]).filter(([, s]) => s !== null));
const MUTATIONS = [
  ['M1 · a relocated line is quietly dropped from a bloom',
   () => {
     // Guarded: at a pre-extraction tree this file does not exist, and a bench
     // that throws has not proven RED — it has proven nothing. An inapplicable
     // mutation returns null and the leg records it as DEAD, which is the honest
     // report: on that tree the cell cannot be graded.
     const p = BLOOM_FILE('events');
     if (!PRE[p]) return null;
     const lines = PRE[p].split('\n');
     const i = lines.findIndex((l) => l.includes('const [events,'));
     if (i < 0) return null;
     lines.splice(i, 1); fs.writeFileSync(R(p), lines.join('\n'));
     return p;
   },
   // THE PROBE MIRRORS THE CELL, and it had to be amended with it: this line
   // re-derived 2a's ORIGINAL predicate, so after TDW_15 P1's seven ruled edits
   // it read false at the cured tree and the harness reported M1 DEAD —
   // "already red, the mutation grades nothing". A probe that does not track
   // its cell retires the mutation silently, which is the one failure a
   // mutation leg exists to prevent.
   () => relocatedLines().filter((l) => !([readNow(CONDUCTOR), ...BLOOMS.map((k) => readNow(BLOOM_FILE(k))), ...SHARED.map(readNow)].filter(Boolean).join('\n')).includes(l) && !RULED_EDITS.includes(l)).length === 0,
   'cell 2a (the canary)'],

  ['M2 · the conductor keeps a copy instead of moving',
   () => { const p = CONDUCTOR; if (!PRE[p]) return null; fs.writeFileSync(R(p), PRE[p] + '\nfunction EventsRoom(){return null;}\n'); return p; },
   () => { const fn = 'function EventsRoom('; return [readNow(CONDUCTOR), ...BLOOMS.map((k) => readNow(BLOOM_FILE(k)))].filter(Boolean).filter((s) => s.includes(fn)).length === 1; },
   'cell 3.events (one home)'],

  ['M3 · a mount loses a prop',
   () => { const p = CONDUCTOR; if (!PRE[p]) return null; fs.writeFileSync(R(p), PRE[p].replace('<PeopleRoom dark={dark} accent={accent} signal={signal}/>', '<PeopleRoom dark={dark} accent={accent}/>')); return p; },
   () => { const g = (s) => (safe(s).match(/<PeopleRoom\b[^/]*\/>/) || [''])[0].replace(/\s+/g, ' '); return g(readNow(CONDUCTOR)) === g(OLD); },
   'cell 4.props.people'],

  ['M4 · the freeze fence loses its closing marker',
   () => { const p = CONDUCTOR; if (!PRE[p]) return null; fs.writeFileSync(R(p), PRE[p].replace('FREEZE ENDS (F-1)', 'freeze ends')); return p; },
   () => /FREEZE ENDS \(F-1\)/.test(safe(readNow(CONDUCTOR))),
   'cell 5b'],

  ['M5 · the choreography is edited inside the fence',
   () => { const p = CONDUCTOR; if (!PRE[p]) return null; fs.writeFileSync(R(p), PRE[p].replace('},BLOOM_CLOSE_MS);\n  },[]);', '},250);\n  },[]);')); return p; },
   () => { const re = /const closeRoom = useCallback\(\(\)=>\{[\s\S]{0,220}?\},BLOOM_CLOSE_MS\);/; const a = (OLD.match(re) || [''])[0], b = (safe(readNow(CONDUCTOR)).match(re) || [''])[0]; return !!a && a === b; },
   'cell 5e (byte-identical motion)'],

  ['M6 · a colour literal is converted during the move',
   () => { const p = BLOOM_FILE('settings'); if (!PRE[p]) return null; fs.writeFileSync(R(p), PRE[p].replace(/#[0-9A-Fa-f]{6}\b/, '#ABCDEF')); return p; },
   () => { const all = [readNow(CONDUCTOR), ...BLOOMS.map((k) => readNow(BLOOM_FILE(k)))].map(safe).join('\n'); return [...all.matchAll(/#[0-9A-Fa-f]{6}\b/g)].map((m) => m[0]).every((h) => hexOld.has(h)); },
   'cell 6a (no token work)'],
];

let bit = 0, dead = 0;
const mutLines = [];
for (const [name, mutate, predicate, cell] of MUTATIONS) {
  const held0 = predicate();
  if (!held0) { dead++; mutLines.push(['DEAD', `${name} — ${cell} was ALREADY RED; the mutation grades nothing`]); continue; }
  const touched = mutate();
  if (!touched) { dead++; mutLines.push(['DEAD', `${name} — the mutation could not be applied`]); continue; }
  let held;
  try { held = predicate(); }
  finally { for (const [p, s] of Object.entries(PRE)) fs.writeFileSync(R(p), s); }
  if (held) { dead++; mutLines.push(['DEAD', `${name} — ${cell} STILL PASSED on the defaced tree`]); }
  else { bit++; mutLines.push(['bite', `${name} → ${cell} went red`]); }
}

// le3 restore proof over every path this harness wrote
const restored = Object.entries(PRE).every(([p, s]) => sha(safe(readNow(p))) === sha(safe(s)));

console.log('');
for (const [t, l] of results) console.log(`  ${t} ${l}`);
console.log('');
console.log('  ── mutation leg (production code, never test setup) ──');
for (const [t, l] of mutLines) console.log(`  ${t} ${l}`);
console.log('');
console.log(`  le3 restore: ${Object.keys(PRE).length} paths written and restored · ${restored ? 'ALL IDENTICAL' : 'DIVERGED'}`);
console.log('');
const total = results.length;
const green = fail === 0 && dead === 0 && restored;
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw13_d4_extraction: ${pass} passed, ${fail} failed`);
console.log(`  total ${total} · run ${total} · skipped 0 · in-process, no network, no browser`);
console.log(`  mutations ${MUTATIONS.length} · biting ${bit} · dead ${dead}`);
console.log(`VERDICT: ${green ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(green ? 0 : 1);
