#!/usr/bin/env node
// scripts/tdw13_d2_beta_gate.proof.mjs
//
// TDW_13 · D-2 · THE DISCOVER BETA GATE (R-30.36) — the bench.
//
// In-process, no network, no browser. Source-text assertions over the ONE file
// the delivery touches, plus a mutation leg that defaces PRODUCTION code (never
// test setup) and proves every cell bites.
//
// COMMENT-BLINDNESS LAW: this file's subject carries ~60 lines of prose ABOUT
// the gate, including the founder's bytes quoted in a comment header. A bench
// that greps raw source would pass on the comment while the code was gone. Every
// assertion below runs against a comment-stripped copy.
//
// le3: the mutation leg writes the subject file. It checksums before, restores
// from the checksum-verified original, and re-checksums after — and a restore
// that does not land byte-identical FAILS THE RUN rather than warning.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT    = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUBJECT = path.join(ROOT, 'app/(frost)/frost/canvas/sanctuary/page.tsx');
// D-5 moved the gate itself into the discover bloom; the mutation leg defaces
// the file that now HOLDS the gate, or it defaces nothing and grades nothing.
const GATE_FILE = path.join(ROOT, 'components/frost/blooms/discover.tsx');

// The founder's bytes (Amendment One §2.13.vi, dream-os `792bd37`). Transcribed
// here ONCE so the bench has an independent witness — if production and this
// literal ever disagree, cell 1 is the alarm and neither side is "the fix".
const FOUNDER_BODY =
  'We are presently in Beta testing Phase. Someone from our team will reach out for your requirements. In the meantime, enjoy the other features the TDW app offers.';
const FOUNDER_SHA =
  '6bd0e6fcc484078512652d9ce4b46cffddaf4b139d1b0a50205597587e0e4b6b';

// ── comment stripping ────────────────────────────────────────────────────────
// Line comments and block comments only. String contents are preserved, which
// matters because the founder's bytes live in a string literal.
function stripComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let quote = null;      // ' " ` when inside a string
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (quote) {
      if (c === '\\') { out += c + (c2 ?? ''); i += 2; continue; }
      if (c === quote) quote = null;
      out += c; i++; continue;
    }
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '\'' || c === '"' || c === '`') { quote = c; out += c; i++; continue; }
    out += c; i++;
  }
  return out;
}

// ── harness ──────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push(['ok  ', name]); }
  else { fail++; results.push(['FAIL', name + (detail ? ' — ' + detail : '')]); }
  return !!cond;
}

const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const read = () => fs.readFileSync(GATE_FILE, 'utf8');

// ═════════════════════════════════════════════════════════════════════════════
// PART A — the cells, against the tree as it stands
// ═════════════════════════════════════════════════════════════════════════════

/* ── AMENDMENT, TDW_13 D-5: THE SUBJECT IS THE SURFACE ──────────────────────
   Written before the extraction, this bench pinned its subject to
   sanctuary/page.tsx. D-4 and D-5 moved the eleven blooms into
   components/frost/blooms/. The bytes this bench guards did not change — they
   changed address. Reading only the conductor would report a founder-vetoed
   byte as missing while it sat on the bride's screen untouched, which is the
   precise failure mode extraction exists to be careful about.
   Directories are READ, never hand-listed. See components/frost/_shared/SURFACE.md. */
function surfaceSrc() {
  const parts = [fs.readFileSync(SUBJECT, 'utf8')];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) parts.push(fs.readFileSync(path.join(abs, f), 'utf8'));
  }
  return parts.join('\n');
}

const raw  = surfaceSrc();
const code = stripComments(raw);

// -- rig self-test: prove the stripper actually strips, and actually spares
//    string literals. A stripper that returns its input would make every
//    comment-blindness claim below a lie told confidently.
ok('rig: stripper removes a line comment',
   !stripComments('const a=1; // BETA_GATE_SENTINEL_XYZ\n').includes('BETA_GATE_SENTINEL_XYZ'));
ok('rig: stripper removes a block comment',
   !stripComments('/* BETA_GATE_SENTINEL_XYZ */ const a=1;').includes('BETA_GATE_SENTINEL_XYZ'));
ok('rig: stripper SPARES string contents',
   stripComments('const a = "keep // this";').includes('keep // this'));
ok('rig: the subject really does carry the bytes inside a comment too',
   (raw.match(new RegExp(FOUNDER_BODY.slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length >= 1);

// -- 1. the founder's bytes, exact, in live code
const bodyMatch = code.match(/const BETA_GATE_BODY\s*=\s*'([^']*)'/);
ok('1a. BETA_GATE_BODY is declared in live code (not only in prose)', !!bodyMatch);
ok('1b. its bytes equal the founder-authored span, character for character',
   !!bodyMatch && bodyMatch[1] === FOUNDER_BODY,
   bodyMatch ? `got ${bodyMatch[1].length} bytes` : 'no declaration');
ok('1c. its sha256 equals the hash the delivery carries',
   !!bodyMatch && sha(bodyMatch[1]) === FOUNDER_SHA,
   bodyMatch ? sha(bodyMatch[1]) : '—');
ok('1d. the committed hash appears in the file, so the byte carries it (APPROVED-COPY-CARRIES-ITS-HASH)',
   raw.includes(FOUNDER_SHA));

// -- 2. one home for the byte
const bodyLiteralCount = (code.match(/We are presently in Beta testing Phase/g) || []).length;
ok('2. the byte has exactly ONE home in live code (no second copy to drift)',
   bodyLiteralCount === 1, `found ${bodyLiteralCount}`);

// -- 3. the gate renders the constant, never a re-typed string
const gateBody = code.match(/function BetaGate[\s\S]*?\n}/);
ok('3a. BetaGate exists', !!gateBody);
ok('3b. BetaGate renders {BETA_GATE_BODY}, not a literal',
   !!gateBody && /\{BETA_GATE_BODY\}/.test(gateBody[0]));
ok('3c. BetaGate re-types no part of the founder body',
   !!gateBody && !gateBody[0].includes('Beta testing Phase'));

// -- 4. the mount is GATED, not overlaid — no ungated Discover content
const mount = code.match(/activeRoom===['"]discover['"]&&\([\s\S]{0,400}?\n\s*\)\}/);
ok('4a. the Discover mount site is found', !!mount);
ok('4b. the mount is conditioned on the ack',
   !!mount && /betaGateAcked/.test(mount[0]));
ok('4c. DiscoverRoom is on the ACKED arm and BetaGate on the other',
   !!mount && /betaGateAcked[\s\S]*\?[\s\S]*<DiscoverRoom[\s\S]*:[\s\S]*<BetaGate/.test(mount[0]));
// the strict reading: DiscoverRoom must not be mountable anywhere unconditionally
const discoverMounts = (code.match(/<DiscoverRoom/g) || []).length;
ok('4d. DiscoverRoom has exactly one mount site in the file',
   discoverMounts === 1, `found ${discoverMounts}`);

// -- 5. THE NO-FLASH CELL. The re-arm must clear on LEAVE (!== 'discover').
//    An enter-side reset (=== 'discover') paints one ungated frame.
const rearm = code.match(/useEffect\(\(\)=>\{[^}]*setBetaGateAcked\(false\)[^}]*\},\s*\[[^\]]*\]\)/);
ok('5a. a re-arm effect exists', !!rearm);
ok('5b. it clears on LEAVE, not on enter',
   !!rearm && /activeRoom!==['"]discover['"]/.test(rearm[0]),
   rearm ? rearm[0].slice(0, 90) : '—');
ok('5c. it hangs off activeRoom and nothing else (one fact, one site)',
   !!rearm && /\[\s*activeRoom\s*\]/.test(rearm[0]));
const rearmSites = (code.match(/setBetaGateAcked\(false\)/g) || []).length;
ok('5d. exactly ONE re-arm site — not a hand-synchronized set like F-13.5\'s',
   rearmSites === 1, `found ${rearmSites}`);

// -- 6. no dismissal memory. The ruling forbids it without a founder word.
const gateRegion = code.slice(
  Math.max(0, code.indexOf('const BETA_GATE_BODY')),
  code.indexOf('interface DiscoverRoomProps')
);
ok('6a. the gate touches no storage API',
   !/localStorage|sessionStorage|indexedDB|document\.cookie/.test(gateRegion));
ok('6b. the ack state is session-only (declared with useState, no seed read)',
   /const \[betaGateAcked, setBetaGateAcked\] = useState\(false\)/.test(code));

// -- 7. copy law: the gate mints no bride-facing byte beyond the founder's
// NOTE, and the reason this cell reads {1,} and asserts non-emptiness: it was
// first written {2,}, which cannot match a single-glyph node, so the extracted
// set was EMPTY and `[].every(...)` returned true — the cell passed on the clean
// tree AND on a tree where the glyph had been replaced with invented copy. M6
// is what found it. An absence cell whose search finds nothing proves nothing.
const jsxText = [...gateRegion.matchAll(/>([^<>{}]{1,})</g)].map(m => m[1].trim()).filter(Boolean);
ok('7a-i. the text-node search is non-vacuous (it finds the gate\'s own node)',
   jsxText.length > 0, 'extracted nothing — the cell below would be meaningless');
ok('7a-ii. every text node the gate renders is the ✕ glyph — no invented byte',
   jsxText.length > 0 && jsxText.every(t => t === '✕'),
   jsxText.filter(t => t !== '✕').join(' | ') || '—');
ok('7b. no persona name in the gate (Victor · Donna · Harvey · Mira · Eliza)',
   !/\b(Victor|Donna|Harvey|Mira|Eliza)\b/.test(gateRegion));

// ═════════════════════════════════════════════════════════════════════════════
// PART B — NON-VACUITY BY PRODUCTION MUTATION
// Every mutation defaces the delivered production code. Each must turn a
// named cell red; a mutation that changes nothing means that cell proves nothing.
// ═════════════════════════════════════════════════════════════════════════════
const gateRaw = fs.readFileSync(GATE_FILE, 'utf8');
const PRE_SHA = sha(gateRaw);
const CONDUCTOR_PRE = sha(fs.readFileSync(SUBJECT, 'utf8'));
const MUTATIONS = [
  ['M1 · the founder byte is edited',
   s => s.replace("'We are presently in Beta testing Phase.", "'We are in beta."),
   c => { const m = c.match(/const BETA_GATE_BODY\s*=\s*'([^']*)'/); return !!m && m[1] === FOUNDER_BODY; },
   'cell 1b (byte identity)'],

  ['M2 · the re-arm flips to the enter side (the one-frame flash)',
   s => s.replace("if(activeRoom!=='discover') setBetaGateAcked(false)", "if(activeRoom==='discover') setBetaGateAcked(false)"),
   c => { const m = c.match(/useEffect\(\(\)=>\{[^}]*setBetaGateAcked\(false\)[^}]*\},\s*\[[^\]]*\]\)/); return !!m && /activeRoom!==['"]discover['"]/.test(m[0]); },
   'cell 5b (no-flash)', SUBJECT],

  ['M3 · the mount stops asking for the ack',
   s => s.replace(
     "{activeRoom==='discover'&&(betaGateAcked\n              ? <DiscoverRoom dark={dark} accent={accent} signal={signal}/>\n              : <BetaGate onAck={()=>setBetaGateAcked(true)}/>\n            )}",
     "{activeRoom==='discover'&&(\n              <DiscoverRoom dark={dark} accent={accent} signal={signal}/>\n            )}"),
   c => { const m = c.match(/activeRoom===['"]discover['"]&&\([\s\S]{0,400}?\n\s*\)\}/); return !!m && /betaGateAcked/.test(m[0]); },
   'cell 4b (the mount is gated)', SUBJECT],

  ['M4 · a dismissal memory is smuggled in',
   s => s.replace('function BetaGate({ onAck }: { onAck: () => void }) {',
                  'function BetaGate({ onAck }: { onAck: () => void }) {\n  if (localStorage.getItem("beta_gate_seen")) onAck();'),
   c => { const r = c.slice(Math.max(0, c.indexOf('const BETA_GATE_BODY')), c.indexOf('interface DiscoverRoomProps')); return !/localStorage|sessionStorage|indexedDB|document\.cookie/.test(r); },
   'cell 6a (no storage API)'],

  ['M5 · the gate re-types the byte instead of reading the one home',
   s => s.replace('{BETA_GATE_BODY}', '{"We are presently in Beta testing Phase."}'),
   c => { const g = c.match(/function BetaGate[\s\S]*?\n}/); return !!g && /\{BETA_GATE_BODY\}/.test(g[0]) && !g[0].includes('Beta testing Phase'); },
   'cells 3b/3c (one home)'],

  // M6 mutates a REGION-SCOPED span. Written first as a bare `>✕</button>`
  // replace, it silently defaced the ExpensesRoom close button instead — that
  // glyph has ten homes in this file and String.replace takes the first. The
  // mutation "worked", the cell stayed green, and the leg reported DEAD until
  // the target was pinned to the gate's own aria-labelled button.
  //
  // IT WENT STALE ONCE ALREADY: the cure sitting moved the glyph from fontSize
  // 20 to 19 (20 is not a rung — see tdw09_frost_parity §6.12) and this literal
  // still said 20, so the mutation stopped landing and the leg reported DEAD a
  // second time. A mutation string that embeds the subject's own styling is a
  // hostage to it. Kept pinned rather than loosened, because a loose matcher is
  // how M6 hit the wrong button in the first place.
  ['M6 · an un-vetoed dismiss byte is invented',
   s => s.replace('aria-label="Close" style={{background:\'none\',border:\'none\',cursor:\'pointer\',color:inkMute,fontSize:19,padding:0,lineHeight:1}}>✕</button>',
                  'aria-label="Close" style={{background:\'none\',border:\'none\',cursor:\'pointer\',color:inkMute,fontSize:19,padding:0,lineHeight:1}}>Got it</button>'),
   c => { const r = c.slice(Math.max(0, c.indexOf('const BETA_GATE_BODY')), c.indexOf('interface DiscoverRoomProps')); const t = [...r.matchAll(/>([^<>{}]{1,})</g)].map(m => m[1].trim()).filter(Boolean); return t.length > 0 && t.every(x => x === '✕'); },
   'cell 7a-ii (copy law)'],
];

let mutBit = 0, mutDead = 0;
const mutLines = [];
// D-5 split the gate's two halves across two files: the BYTES and the component
// live in the discover bloom, the MOUNT DECISION and the re-arm stayed with the
// conductor (it is the conductor that decides whether the feed mounts at all).
// So a mutation names the file it defaces. Written with one target, M2 and M3
// silently changed nothing and the leg correctly reported them DEAD — the leg
// catching my own carelessness twice in this block now.
for (const [name, mutate, predicate, cellName, target] of MUTATIONS) {
  const FILE = target || GATE_FILE;
  const base = fs.readFileSync(FILE, 'utf8');
  const mutated = mutate(base);
  if (mutated === base) {
    mutDead++;
    mutLines.push(['DEAD', `${name} — the mutation changed NOTHING; ${cellName} is unproven`]);
    continue;
  }
  fs.writeFileSync(FILE, mutated, 'utf8');
  let held;
  try { held = predicate(stripComments(read())); }
  finally { fs.writeFileSync(FILE, base, 'utf8'); }
  if (held) { mutDead++; mutLines.push(['DEAD', `${name} — ${cellName} STILL PASSED on the defaced tree`]); }
  else { mutBit++; mutLines.push(['bite', `${name} → ${cellName} went red`]); }
}

// le3 restore proof — checksum, not a shrug
const POST_SHA = sha(read());
const CONDUCTOR_SHA_OK = sha(fs.readFileSync(SUBJECT, 'utf8')) === CONDUCTOR_PRE;
const restored = POST_SHA === PRE_SHA && CONDUCTOR_SHA_OK;

// ── report ───────────────────────────────────────────────────────────────────
console.log('');
for (const [tag, line] of results) console.log(`  ${tag} ${line}`);
console.log('');
console.log('  ── mutation leg (production code, never test setup) ──');
for (const [tag, line] of mutLines) console.log(`  ${tag} ${line}`);
console.log('');
console.log(`  le3 restore: gate ${PRE_SHA.slice(0, 12)}→${POST_SHA.slice(0, 12)} · conductor ${CONDUCTOR_SHA_OK ? 'held' : 'DIVERGED'} · ${restored ? 'IDENTICAL' : 'DIVERGED'}`);
console.log('');

const total = results.length;
const green = fail === 0 && mutDead === 0 && restored;
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw13_d2_beta_gate: ${pass} passed, ${fail} failed`);
console.log(`  total ${total} · run ${total} · skipped 0 · in-process, no network, no browser`);
console.log(`  mutations ${MUTATIONS.length} · biting ${mutBit} · dead ${mutDead}`);
console.log(`VERDICT: ${green ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(green ? 0 : 1);
