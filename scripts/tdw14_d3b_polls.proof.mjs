#!/usr/bin/env node
// scripts/tdw14_d3b_polls.proof.mjs
// TDW_14 · D-3b · C-4 · CLIENT HALF — THE POLL SURFACES AND THE FROZEN BYTES.
//
// The server half is dream-os/scripts/b14_d3_polls_bench.js. Each half names the
// other; a cell reaching for an absent sibling tree SKIPS WITH REASON, never
// passes (the F-07.50 precedent).
//
// ── WHAT THIS PROOF IS FOR ─────────────────────────────────────────────────
// Polls render on TWO surfaces with no shared styling vocabulary — the member's
// coplanner threads strip and the bride's circle bloom. Two renderers is the
// right answer; two COPIES OF THE COPY is not. Twelve bytes were frozen at the
// founder's veto (CE-33, 2026-08-13, 「 approve all recommendations 」), and a
// freeze enforced by reading two files and hoping is not a freeze.
//
// So the load-bearing claim here is not that the surfaces look right — a bench
// cannot see a screen — it is that THE BYTES HAVE ONE HOME, that both surfaces
// reach it, and that neither carries a literal of its own. §1 pins every byte
// character for character; §3 asserts the absence of literals; §5 mutates
// production source across a PROCESS BOUNDARY to prove neither is decorative.
//
// ── THE CACHING LAW (CE-117), STATED NOT ASSUMED ───────────────────────────
// Every read goes through fs.readFileSync at call time; this proof holds no
// module cache of the files it judges. §5's mutations bust cache by process
// boundary: each edits production source, re-runs THIS script fresh
// (`--cells-only`), asserts a non-zero exit, restores, and verifies byte
// identity by sha256.
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(SELF), '..');
const CELLS_ONLY = process.argv.includes('--cells-only');

let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// ── A MISSING FILE MUST RED AS A CELL, NEVER AS A STACK TRACE ─────────────
// The both-ways leg runs this proof against the tree BEFORE D-3b, where
// `lib/circle/pollCopy.ts` does not exist. The first cut let `readFileSync`
// throw: the process exited 1, which LOOKS like the red the leg wants, and is
// not — it is a crash before the first assertion, and it would exit 1 just the
// same if this file had a typo in it. An uncured run has to produce a RED SET
// that names what is missing, or the leg proves nothing about the cure.
const raw  = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; } };
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');
// Block comments first, then line comments — a `//` inside a block comment is
// not a line comment, and stripping lines first orphans the block's opener.
const code = (rel) => raw(rel)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

const HOME   = 'lib/circle/pollCopy.ts';
const STRIP  = 'app/coplanner/threads/page.tsx';
const BLOOM  = 'components/frost/blooms/circle.tsx';
const CLIENT = 'lib/frost/journey.ts';

// ═════════════════════════════════════════════════════════════════════════════
sec('§0 — THE SUBJECTS EXIST');
// If any of these is empty the cells below would assert against '' and red for
// the right reason but the wrong stated cause. This says the cause out loud.
for (const [n, rel] of [['§0.1 the one home', HOME], ['§0.2 the member strip', STRIP],
                        ['§0.3 the bride bloom', BLOOM], ['§0.4 the bride client', CLIENT]]) {
  ok(`${n} exists`, raw(rel).length > 0, `${rel} is absent — this tree predates D-3b`);
}

sec('§1 — THE TWELVE FROZEN BYTES, character for character');
// ═════════════════════════════════════════════════════════════════════════════
// Ten live here; ② and ⑩ are API refusals homed server-side and pinned by
// b14_d3_polls_bench §4.3/§3.4 — duplicating them client-side would give one
// byte two homes, which is the disease this module exists to prevent.

const home = raw(HOME);
const FROZEN = [
  ['①', "export const POLL_ASK = 'Ask the circle';"],
  ['③', "export const POLL_TAP_TO_CHOOSE = 'Tap to choose';"],
  ['④', "export const POLL_YOUR_CHOICE = 'Your choice';"],
  ['⑨', "export const POLL_EMPTY = 'No polls yet.';"],
  ['⑤', 'return `${n} of ${total} voted`;'],
  ['⑥', 'return `Closes ${time}`;'],
  ['⑦', 'return `${option} won`;'],
  ['⑧', "return `It's a tie — ${list}`;"],
  // ── D-3c · THE CREATE SHEET, ratified whole 2026-08-14 「 all stand 」 ──
  ['A', 'export const POLL_SHEET_HEAD = POLL_ASK;'],
  ['B', "export const POLL_QUESTION_LABEL = 'Your question';"],
  ['C', "export const POLL_CHOICES_LABEL = 'Choices';"],
  ['D', "export const POLL_ADD_CHOICE = 'Add a choice';"],
  ['F', "export const POLL_SUBMIT = 'Ask';"],
  ['G', "export const POLL_SUBMITTING = 'Asking…';"],
  ['H', "export const POLL_CANCEL = 'Cancel';"],
  ['I', "export const POLL_ADD_CLOSING = 'Add a closing time';"],
];
for (const [n, byte] of FROZEN) {
  ok(`§1 ${n} is frozen at the byte`, home.includes(byte),
     'the vetoed byte moved — the veto sheet is the authority, not this code');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§2 — THE FORMATTERS BEHAVE, and ⑧ extends by comma');
// ═════════════════════════════════════════════════════════════════════════════
const { pollTally, pollCloses, pollWinner, pollTie } = await import(
  path.join(ROOT, HOME).replace(/\.ts$/, '.ts')
).catch(() => ({}));

if (!pollTie) {
  // TS is not importable bare by node; assert against the source instead and
  // SAY SO rather than skipping quietly.
  ok('§2.1 ⑤ renders "{n} of {total} voted"', /\$\{n\} of \$\{total\} voted/.test(home));
  ok('§2.2 ⑥ renders "Closes {time}"',        /Closes \$\{time\}/.test(home));
  ok('§2.3 ⑦ renders "{Option} won"',         /\$\{option\} won/.test(home));
  ok('§2.4 ⑧ TAKES A LIST, not two slots — three- and four-way ties are reachable',
     /export function pollTie\(options: string\[\]\)/.test(home),
     'a two-argument signature would be right for the example and wrong for the feature');
  ok('§2.5 ⑧ joins three or more with commas and a final "and"',
     /slice\(0, -1\)\.join\(', '\)/.test(home) && /\.join\(' and '\)/.test(home));
} else {
  ok('§2.1 ⑤', pollTally(2, 3) === '2 of 3 voted');
  ok('§2.2 ⑥', pollCloses('7 pm') === 'Closes 7 pm');
  ok('§2.3 ⑦', pollWinner('Red') === 'Red won');
  ok('§2.4 ⑧ two', pollTie(['Red', 'Gold']) === "It's a tie — Red and Gold");
  ok('§2.5 ⑧ three, by comma', pollTie(['Red', 'Gold', 'Ivory']) === "It's a tie — Red, Gold and Ivory");
  ok('§2.6 ⑧ four, still by comma', pollTie(['A', 'B', 'C', 'D']) === "It's a tie — A, B, C and D");
}

// ── §2.7 EXISTS BECAUSE A RUNTIME CELL CANNOT SEE A TYPE ──────────────────
// Node 22 strips TypeScript annotations, so this file's dynamic import of a .ts
// module SUCCEEDS and the runtime branch above is the one that runs. That is the
// stronger branch — it tests behaviour, not text — but it is BLIND to the
// signature: narrowing `options: string[]` to `[string, string]` changes nothing
// at runtime and every cell above stays green over it. The mutation §8.M3 proved
// exactly that, and reported itself decorative rather than passing quietly.
//
// A type claim needs a reader that can see types. This is that reader, and it is
// not redundant with §2.4-§2.6: they prove the FUNCTION handles three and four,
// this proves the CONTRACT still permits them to be passed.
ok('§2.7 ⑧ TAKES A LIST in its signature — three- and four-way ties are reachable',
   /export function pollTie\(options: string\[\]\)/.test(home),
   'a two-slot signature would be right for the veto sheet\'s example and wrong for the feature');

// ═════════════════════════════════════════════════════════════════════════════
sec('§3 — ONE HOME: both surfaces import it, neither carries a literal');
// ═════════════════════════════════════════════════════════════════════════════
const stripSrc = code(STRIP);
const bloomSrc = code(BLOOM);

ok('§3.1 the member strip imports the one home',
   /from '\.\.\/\.\.\/\.\.\/lib\/circle\/pollCopy'/.test(stripSrc));
ok('§3.2 the bride bloom imports the one home',
   /from '@\/lib\/circle\/pollCopy'/.test(bloomSrc));

// [F-SW.2] ABSENCE. The freeze is only real if no surface can drift on its own.
const LITERALS = ['Ask the circle', 'Tap to choose', 'Your choice', 'No polls yet.',
                  ' voted', 'Closes ', ' won', "It's a tie"];
for (const [name, src] of [['strip', stripSrc], ['bloom', bloomSrc]]) {
  const found = LITERALS.filter(l => src.includes(`'${l}`) || src.includes(`"${l}`) || src.includes(`\`${l}`));
  ok(`§3.3 the ${name} carries NO poll copy literal of its own`, found.length === 0,
     `literals found: ${found.join(' · ')}`);
}

ok('§3.4 the strip does NOT import ⑨ — its empty state belongs to the bloom',
   !/POLL_EMPTY/.test(stripSrc.split('\n').filter(l => l.includes('import')).join('\n')),
   'an empty-state byte on a conversations screen advertises a feature instead of serving one');
ok('§3.5 the bloom DOES render ⑨ — the surface whose subject is polls',
   /POLL_EMPTY/.test(bloomSrc));

// ═════════════════════════════════════════════════════════════════════════════
sec('§4 — THE TWO RATIFIED EXPECTED-ZEROS (⑪ and ⑫)');
// ═════════════════════════════════════════════════════════════════════════════
// The wall goes UNADVERTISED, and her poll keeps her words. These are absence
// cells: the ruling is that nothing is there, so the proof is that nothing is.
const HIDDEN_TELLS = [/some details are hidden/i, /hidden from you/i, /you can'?t see/i,
                      /not visible to you/i, /restricted/i];
for (const [name, src] of [['strip', stripSrc], ['bloom', bloomSrc]]) {
  ok(`§4.1 ⑪ the ${name} advertises no wall`,
     !HIDDEN_TELLS.some(re => re.test(src)),
     'a line telling her something is hidden points at a wall she was not looking for');
}
// ── §4.2's RADIUS WAS WRONG AND IT CONVICTED AN INNOCENT ─────────────────
// The first cut scanned each WHOLE FILE for `placeholder=` and `e.g.`. It
// reddened on `placeholder="e.g. Mom, Priya, Anjali"` — the bloom's INVITE form,
// pre-existing, already vetoed, and nothing whatever to do with polls. An
// absence cell whose radius is wider than its claim does not prove more; it
// convicts things its ruling never covered, and a bench nobody trusts gets
// muted. ⑫ is about POLL copy: her question and her option labels are hers.
//
// So the claim is asserted where it actually lives — the payload's own fields
// render bare, with no `||` fallback supplying a word she did not write, and the
// poll block holds no input at all (D-3b ships voting and reading; the create
// affordance is not built, so there is nothing here to seed with an example).
for (const [name, src] of [['strip', stripSrc], ['bloom', bloomSrc]]) {
  ok(`§4.2 ⑫ the ${name} renders her question BARE — no fallback word`,
     /\{p\.question\}/.test(src) && !/p\.question\s*\|\|/.test(src),
     'a `||` fallback on her question would put our words in her poll');
  ok(`§4.3 ⑫ the ${name} renders option labels BARE — no fallback word`,
     /\{o\.label\}/.test(src) && !/o\.label\s*\|\|/.test(src),
     'a `||` fallback on an option label would put our words on her ballot');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§5 — R-D3.5: TWO SURFACES, NO THIRD · ONE TIMER, NO SECOND');
// ═════════════════════════════════════════════════════════════════════════════
// The census is WALKED, never inherited from the charter's list (R-31.1).
function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel, out);
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(rel);
  }
  return out;
}
const ALL = [...walk('app'), ...walk('components'), ...walk('lib')];
const SURFACES = ALL.filter(f => f !== HOME && f !== CLIENT && /pollCopy/.test(code(f)));
console.log(`         poll surfaces found: ${SURFACES.length} — ${SURFACES.join(' · ')}`);
ok('§5.1 EXACTLY TWO surfaces render polls — a third would be a scope breach',
   SURFACES.length === 2 && SURFACES.includes(STRIP) && SURFACES.includes(BLOOM),
   `found: ${SURFACES.join(' · ')}`);

ok('§5.2 NO SECOND TIMER — the poll read rides the existing 10s interval',
   /const tick = async \(\) => \{ await loadMessages\(\); await loadPolls\(\); \};/.test(bloomSrc),
   'the bloom polls on its own schedule — two intervals drift and double the request rate');
ok('§5.3 the bloom holds exactly ONE setInterval',
   (bloomSrc.match(/setInterval\(/g) || []).length === 1,
   'a second interval appeared on a screen that already had one');

// ═════════════════════════════════════════════════════════════════════════════
sec('§6 — THE CLIENT COUNTS NOTHING: the server owns the tally');
// ═════════════════════════════════════════════════════════════════════════════
const clientSrc = code(CLIENT);
ok('§6.1 the bride client reads polls, votes, and creates — three doors, no fourth',
   /fetchCirclePolls/.test(clientSrc) && /castCirclePollVote/.test(clientSrc) && /createCirclePoll/.test(clientSrc));
ok('§6.2 CREATE sends LABELS ONLY — option ids are minted server-side',
   !/option.*\bid\b.*JSON\.stringify/.test(clientSrc) && /JSON\.stringify\(\{ question, options/.test(clientSrc),
   'a client that sent option ids would invent identity the server refuses to trust');
ok('§6.3 a cast vote RE-READS rather than patching a count locally',
   /await loadPolls\(\)/.test(bloomSrc) && /await loadPolls\(\)/.test(stripSrc),
   'a screen that moved a number it was not told about is confidently wrong the moment two people vote at once');
ok('§6.4 neither surface recomputes a tally from the vote rows',
   !/reduce\([^)]*votes/.test(stripSrc) && !/reduce\([^)]*votes/.test(bloomSrc),
   'a client-side tally is a second source of truth for a number the rows already carry');
// THE RENDER SITE, not mere presence. The first cut asserted the field APPEARS
// in each file — and it appears in the interface declaration too, so replacing
// the rendered `p.eligible_count` with `p.total_votes` left the cell green while
// the surface rendered "3 of 3 voted" for one vote out of three people. §8.M6
// caught it. A cell that greps a field name proves the field was declared, never
// that it reached a screen.
ok('§6.5 the denominator REACHES THE TALLY on both surfaces, from the payload',
   /pollTally\(p\.total_votes, p\.eligible_count\)/.test(stripSrc)
   && /pollTally\(p\.total_votes,p\.eligible_count\)/.test(bloomSrc),
   'the tally renders a denominator that is not the circle — a surface counting for itself would be a second implementation of one number');

// ═════════════════════════════════════════════════════════════════════════════
sec('§7 — THE SIBLING HALF, named (F-07.50 cross-repo precedent)');
// ═════════════════════════════════════════════════════════════════════════════
const SIB = path.join(ROOT, '..', 'dream-os', 'scripts', 'b14_d3_polls_bench.js');
if (!fs.existsSync(SIB)) {
  console.log('         SKIPPED-WITH-REASON: the dream-os tree is not a sibling of this repo in');
  console.log('         this container. The server half runs in its own repo\'s floor; this cell');
  console.log('         exists so nobody mistakes its absence for its passing.');
  ok('§7.1 the server half is named and its absence is DISCLOSED, never silently passed', true);
} else {
  const sib = fs.readFileSync(SIB, 'utf8');
  ok('§7.1 ② and ⑩ are frozen at their SERVER home, not duplicated here',
     sib.includes("'A poll needs between 2 and 4 options.'") && sib.includes("'This poll has closed.'"),
     'the two server-side bytes lost their frozen-copy cells');
  // COMMENTS STRIPPED FIRST. `pollCopy.ts`'s header QUOTES both server-side
  // bytes to explain where they live and why they are not here — an absence cell
  // reading the raw file would convict the paragraph that documents the absence.
  const homeCode = code(HOME);
  ok('§7.2 this file carries neither of them in CODE — one byte, one home',
     !homeCode.includes('A poll needs between') && !homeCode.includes('This poll has closed'));
}

// ═════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
sec('§9 — D-3c: THE CREATE SHEET IS BRIDE-ONLY, AND ITS ABSENCES ARE RULED');
// ═══════════════════════════════════════════════════════════════════════════

// The founder's word: a member votes in the circle, she does not convene it.
// This is the cell that keeps the affordance off her surface.
ok('§9.1 the co-planner strip imports NO create byte — a member cannot convene',
   !/POLL_SHEET_HEAD|POLL_QUESTION_LABEL|POLL_CHOICES_LABEL|POLL_ADD_CHOICE|POLL_SUBMIT|POLL_CANCEL|POLL_ADD_CLOSING/.test(stripSrc),
   'the create sheet reached the member surface — bride-only was a founder ruling');
ok('§9.2 …and it calls no create door either',
   !/createCirclePoll/.test(stripSrc));

ok('§9.3 the bride bloom DOES carry the sheet and its door',
   /POLL_SHEET_HEAD/.test(bloomSrc) && /createCirclePoll/.test(bloomSrc));

// ① was vetoed as "the affordance that opens a poll". D-3b rendered it as a
// dead eyebrow; D-3c makes it the button, which is why the sheet cost no line
// for an opening control.
ok('§9.4 ① IS THE AFFORDANCE — a button, not an eyebrow',
   /<button onClick=\{\(\)=>setAskOpen\(true\)\}[\s\S]{0,400}\{POLL_ASK\}<\/button>/.test(bloomSrc),
   '① is not tappable — the byte was approved as an affordance');

// The gate that would have hidden the only remedy at the moment it is needed.
ok('§9.5 the affordance is NOT gated on polls existing',
   !/\{!loading && polls\.length>0 && \(/.test(bloomSrc),
   'with zero polls she would see the empty state and no way to fix it');

// [F-SW.2] THE RATIFIED EXPECTED-ZEROS. Each absence is the ruling; a later hand
// adding the reassuring sentence the founder declined reds here.
ok('§9.6 E · no byte explains the four-choice ceiling — the control simply greys',
   !/(4|four) (choices|options)/i.test(bloomSrc.replace(/MAX_CHOICES/g,'')) ,
   'a sentence appeared explaining a wall she has just hit');
ok('§9.7 SUBMIT IS GATED, never refused with a client byte',
   /const askReady = /.test(bloomSrc) && /disabled=\{!askReady\|\|asking\}/.test(bloomSrc),
   'the form refuses with words where it should simply not be pressable');
// ── THE SHEET'S OWN TEXT, BOUNDED AT BOTH ENDS ───────────────────────────
// §9.8/§9.9's first cut scanned the WHOLE bloom and convicted the invite
// panel's helper line and the composer's placeholder — both pre-existing, both
// separately vetoed, neither anything to do with polls. An absence cell whose
// radius exceeds its claim does not prove more; it convicts things its ruling
// never covered. This is the THIRD time this sitting, and the lesson is the
// same each time: bound the slice, or assert where the claim lives.
// THE BOUND MUST SURVIVE COMMENT-STRIPPING. The first cut closed the slice on
// `Activity feed` — which lives inside a JSX comment and is therefore GONE from
// the stripped source, so `indexOf` returned -1 and the slice came back empty.
// §9.8a caught it on the first run: a bounded absence cell that silently reads
// nothing passes vacuously, and an empty string contains no placeholder either.
// The bound is now a real element that survives the strip.
const SHEET = (() => {
  const a = bloomSrc.indexOf('askOpen && (');
  const b = bloomSrc.indexOf('no-scroll', a);
  return a >= 0 && b > a ? bloomSrc.slice(a, b) : '';
})();
ok('§9.8a the sheet slice was actually found — this bench read what it judges',
   SHEET.length > 400, `slice length ${SHEET.length}`);
ok('§9.8 NO HELPER TEXT — the sheet explains nothing that has no hidden consequence',
   !/Add a number to send|will be sent|everyone will/i.test(SHEET));

// ⑫ again, at the sheet: labels above, never placeholders inside.
ok('§9.9 ⑫ · the sheet uses LABELS, and no poll field carries a placeholder',
   !/placeholder=/.test(SHEET),
   'a placeholder puts example words in her question until she overwrites them');

ok('§9.10 CREATE sends LABELS ONLY — ids stay server-minted',
   /createCirclePoll\(\s*askQ\.trim\(\),/.test(bloomSrc) && /\.filter\(Boolean\)/.test(bloomSrc));
ok('§9.11 a created poll RE-READS rather than being pushed onto local state',
   /if\(created\)\{ resetAsk\(\); await loadPolls\(\); \}/.test(bloomSrc),
   'the screen appends its own row — a second source of truth the moment two people ask');

// ═══════════════════════════════════════════════════════════════════════════
sec('§10 — F-14.8 DEFUSED · F-14.9 RENDERED · ⑨ DRESSED');
// ═══════════════════════════════════════════════════════════════════════════

// F-14.8 — the locale format could differ between the server that renders the
// HTML and the browser that hydrates it. Landmine-class, never live, cleared.
ok('§10.1 [F-14.8] no poll date is formatted in the RUNTIME\'s locale',
   !/toLocaleString\(undefined/.test(bloomSrc) && !/toLocaleString\(undefined/.test(stripSrc),
   'the runtime locale is back — React\'s hydration cause #3, verbatim');
ok('§10.2 [F-14.8] every poll date is formatted DETERMINISTICALLY, zone named',
   (bloomSrc.match(/toLocale(String|DateString)\('en-GB'[^)]*timeZone:'Asia\/Kolkata'/g) || []).length >= 2
   && /toLocaleDateString\('en-GB'[\s\S]{0,120}timeZone: 'Asia\/Kolkata'/.test(stripSrc),
   'a date is computed differently on the server than in the browser');

// F-14.9 — served by D-3a, rendered by nobody until now. The founder's ratified
// sheet line (b) described a screen; this is that screen.
ok('§10.3 [F-14.9] BOTH surfaces render the linked event',
   /p\.linked_event/.test(bloomSrc) && /p\.linked_event/.test(stripSrc),
   'the payload field still reaches no screen — line (b) describes a screen that does not exist');
ok('§10.4 [F-14.9] the event renders its OWN name and date, label-free (⑫-class)',
   /\{p\.linked_event\.title\} · /.test(bloomSrc) && /\{p\.linked_event\.title\} · /.test(stripSrc),
   'a connective word of ours appeared — that is new copy and owes the sheet');
// The gate is the SERVER's: a flagless member's payload omits vendor_id, so the
// withholding is payload-level truth and not a CSS opinion (the 08 blur standard).
ok('§10.5 [F-14.9] NEITHER surface renders a vendor — the gate stays server-side',
   !/linked_event\.vendor_id/.test(bloomSrc) && !/linked_event\.vendor_id/.test(stripSrc),
   'a surface reads the vendor field — the withholding must be payload-level, never CSS');
// ⑪'s first cut matched `overflow:'hidden'` — CSS, not a sentence. The ruling
// is that no WORDS tell her something is missing, so the cell reads the phrases
// a person would actually be shown.
ok('§10.6 ⑪ still holds — no surface announces that anything is withheld',
   ![/some details/i, /is hidden from/i, /not visible to you/i, /you can'?t see/i, /restricted/i]
     .some(re => re.test(bloomSrc) || re.test(stripSrc)));

// ⑨ — the byte is frozen; its DRESS was the defect.
// THE CLAIM IS ABOUT WEIGHT, SO THE CELL MUST READ THE SIZE. An earlier cut
// matched the font FAMILY only, and §8.M14 — which shrinks the size and
// recolours while leaving the typeface in place — sailed straight through it.
// A cell that checks the typeface has not checked the presence.
//
// ── THE TARGET MOVED AT D-3d, AND THE TOKEN FILE IS WHY ───────────────────
// D-3c dressed ⑨ at Italianno 46 = `FT.greeting`, which the language declares
// "ONE per screen" and the masthead already spends. That made the empty state a
// SECOND hero on a page whose subject is the circle, not polls. It now sits at
// `FT.body` — "ALL body prose, THE FLOOR" — the same treatment the activity
// feed's own empty SENTENCE uses. (Its Italianno line above is that surface's
// HEAD, because the feed is that surface's subject. ⑨ is not.)
//
// The cell asserts a FLOOR and a CEILING, because this byte has now been wrong
// in both directions in one sitting: too small to be seen, then too large to
// belong. `FT.body` is named rather than the number, so the rung moving moves
// this cell with it.
ok('§10.7 ⑨ speaks at body weight — neither a timestamp nor a second hero',
   /Fraunces[^}]*fontSize:FT\.body[^}]*pgInkSoft[\s\S]{0,120}\{POLL_EMPTY\}/.test(bloomSrc),
   '⑨ is dressed as a footnote or as a hero; it is a sentence');
ok('§10.7b ⑨ does NOT borrow a one-per-screen rung',
   !/fontSize:(46|52|FT\.greeting|FT\.head)[\s\S]{0,120}\{POLL_EMPTY\}/.test(bloomSrc),
   'the empty state took the masthead\'s rung — the language allows it once and it is spent');

// ① is an ACTION and the token file names the rung for actions. It shipped on
// the sub-floor rung with no chrome, which is the treatment for captions.
ok('§10.9 ① reads as a CTA — the action rung, and pressable chrome',
   /border:`\$\{FS\.hair\} solid \$\{pgAccent\}`[\s\S]{0,200}fontSize:FT\.engraved[\s\S]{0,200}\{POLL_ASK\}<\/button>/.test(bloomSrc),
   '① is bare text again — nothing about it says it can be pressed');
// The first cut counted every mention and read 2 — the import and the render.
// The claim is about how many LINES she is shown, so count render sites only.
ok('§10.8 ⑨ is still ONE line — a second would be a new byte',
   (bloomSrc.match(/\{POLL_EMPTY\}/g) || []).length === 1,
   'a second empty-state line appeared; the sibling\'s explanatory line is a NEW byte');

if (CELLS_ONLY) {
  console.log(`\n  cells: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

sec('§8 — MUTATION: production source broken, across a PROCESS BOUNDARY');
// ═════════════════════════════════════════════════════════════════════════════
const ledger = [];
function mutate(rel, from, to, label) {
  const abs = path.join(ROOT, rel);
  const before = fs.readFileSync(abs, 'utf8');
  const h = sha(before);
  if (!before.includes(from)) {
    fail++; console.log(`  FAIL ${label}  → MUTATION TARGET ABSENT in ${rel}: ${from}`);
    return;
  }
  fs.writeFileSync(abs, before.replace(from, to));
  const r = spawnSync(process.execPath, [SELF, '--cells-only'], { encoding: 'utf8' });
  fs.writeFileSync(abs, before);
  const restored = sha(fs.readFileSync(abs, 'utf8')) === h;
  ledger.push({ rel, restored });
  ok(label, r.status !== 0, 'the cells PASSED over broken production source — decorative');
  ok(`${label} · restored byte-identical`, restored);
}

mutate(HOME, "export const POLL_ASK = 'Ask the circle';", "export const POLL_ASK = 'Start a poll';",
       '§8.M1 [FROZEN ①] move the vetoed byte ⇒ §1 RED');
mutate(HOME, "return `It's a tie — ${list}`;", "return `Tied: ${list}`;",
       '§8.M2 [FROZEN ⑧] move the vetoed tie byte ⇒ §1 RED');
mutate(HOME, 'export function pollTie(options: string[])', 'export function pollTie(options: [string, string])',
       '§8.M3 narrow ⑧ to two options ⇒ §2.7 RED (a type needs a reader that sees types)');
mutate(STRIP, 'POLL_TAP_TO_CHOOSE', "'Tap to choose'",
       '§8.M4 the strip grows its own literal ⇒ §3.3 RED (the freeze forks)');
mutate(BLOOM, 'const tick = async () => { await loadMessages(); await loadPolls(); };',
              'const tick = async () => { await loadMessages(); };\n    setInterval(loadPolls, 10000);',
       '§8.M5 a second timer appears ⇒ §5.2/§5.3 RED (R-D3.5)');
mutate(STRIP, 'p.eligible_count', 'p.total_votes',
       '§8.M6 the denominator becomes the numerator ⇒ §6.5 anchor RED');

// ── D-3c's mutations ──────────────────────────────────────────────────────
mutate(HOME, "export const POLL_SUBMIT = 'Ask';", "export const POLL_SUBMIT = 'Create poll';",
       '§8.M7 [FROZEN F] move the vetoed submit byte ⇒ §1 RED');
mutate(HOME, "export const POLL_SHEET_HEAD = POLL_ASK;", "export const POLL_SHEET_HEAD = 'New poll';",
       '§8.M8 [FROZEN A] the head stops reusing ① ⇒ §1 RED (a second name for one act)');
mutate(BLOOM, "toLocaleString('en-GB',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit',timeZone:'Asia/Kolkata'})",
              "toLocaleString(undefined,{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})",
       '§8.M9 [F-14.8] the runtime locale returns to the bloom ⇒ §10.1/§10.2 RED');
mutate(STRIP, "d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })",
              "d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })",
       '§8.M10 [F-14.8] …and to the strip — the half-cure this bench already caught once ⇒ §10.1 RED');
mutate(BLOOM, '{p.linked_event.title} · ', '{p.linked_event.title} for ',
       '§8.M11 [F-14.9] a connective word of ours enters the event line ⇒ §10.4 RED (that is new copy)');
mutate(STRIP, "import { POLL_ASK, POLL_TAP_TO_CHOOSE, POLL_YOUR_CHOICE,",
              "import { POLL_SUBMIT, POLL_ASK, POLL_TAP_TO_CHOOSE, POLL_YOUR_CHOICE,",
       '§8.M12 a create byte reaches the MEMBER surface ⇒ §9.1 RED (bride-only was a ruling)');
mutate(BLOOM, 'disabled={!askReady||asking}', 'disabled={asking}',
       '§8.M13 submit stops being gated ⇒ §9.7 RED (the form would have to refuse with words)');
mutate(BLOOM, "fontSize:FT.body,color:pgInkSoft,lineHeight:1.6,textAlign:'center' as any,fontFeatureSettings:'\"opsz\" 9'}}>{POLL_EMPTY}",
              "fontSize:9,color:pgInkMute,lineHeight:1.6,textAlign:'center' as any}}>{POLL_EMPTY}",
       '§8.M14 [⑨] the empty state is dressed as a footnote again ⇒ §10.7 RED');
mutate(BLOOM, "fontSize:FT.body,color:pgInkSoft,lineHeight:1.6,textAlign:'center' as any,fontFeatureSettings:'\"opsz\" 9'}}>{POLL_EMPTY}",
              "fontSize:46,color:pgAccent,lineHeight:1.6,textAlign:'center' as any}}>{POLL_EMPTY}",
       '§8.M15 [⑨] …or as a second hero on the masthead\'s rung ⇒ §10.7b RED');
mutate(BLOOM, "border:`${FS.hair} solid ${pgAccent}`,\n                    borderRadius:FI.chrome,padding:'8px 14px',cursor:'pointer',",
              "border:'none',padding:0,cursor:'pointer',",
       '§8.M16 [①] the CTA loses its chrome ⇒ §10.9 RED (bare text again)');

sec('§9 — THE RESTORE LEDGER');
ok('§9.1 every mutated file was restored BYTE-IDENTICAL, checked by sha256',
   ledger.length > 0 && ledger.every(l => l.restored),
   `failed: ${ledger.filter(l => !l.restored).map(l => l.rel).join(', ')}`);
console.log(`         ${ledger.length} mutations, ${new Set(ledger.map(l => l.rel)).size} files`);

console.log('\n' + '─'.repeat(66));
console.log(`  tdw14_d3b_polls: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('─'.repeat(66));
process.exit(fail ? 1 : 0);
