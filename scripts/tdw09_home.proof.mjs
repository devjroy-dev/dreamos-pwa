#!/usr/bin/env node
// scripts/tdw09_home.proof.mjs — TDW_09 O-2 · THE HOME'S ACCEPTANCE BENCH
//
// Runnable from ANY working directory (Q-SP-5): pass a repo root, or let it walk
// up from this file. Usage:  node scripts/tdw09_home.proof.mjs [repoRoot]
//
// ── WHAT THIS BENCH IS, AND WHAT IT CANNOT SEE ────────────────────────────────
// These are SOURCE-PROPERTY cells, not runtime behaviour. The home is a 'use
// client' TSX module whose zone logic (`buildWaitingLines`, `isFirstRun`) is
// module-private, so no node process can call it without exporting internals
// this sitting has no ruling to export. The method is declared rather than
// implied, per the independent-method law, and so is its blind spot:
//
//   THIS BENCH PROVES the zone functions exist, are wired, collapse on an empty
//   branch, carry the founder's exact copy bytes, and read the engine plane.
//   IT DOES NOT PROVE the rendered pixels. The founder's walk against the
//   acceptance picture (mock frame 2) is the evidence for that, and it outranks
//   this file. A green here with a red walk means the walk is right.
//
// ── TWO CELL CLASSES, LABELLED — the header's first draft was wrong ──────────
// That draft said every cell must be RED at the uncured tree. Running it proved
// otherwise and the rule is corrected here rather than quietly relaxed:
//
//   [cure]  asserts something THIS SITTING built. MUST be RED at dreamos-pwa
//           e935a2b and GREEN here. A cure cell green at both tips is vacuous
//           and must be fixed, not kept.
//   [guard] asserts an invariant that was ALREADY true and must SURVIVE the
//           rewrite — one ChatThread mount, no rupee glyph, W-1 shut. These are
//           green at both tips BY DESIGN. A regression guard is not a vacuous
//           cell; conflating the two would have forced me to delete exactly the
//           cells that catch a rewrite breaking something it never touched.
//
// Run both arms:  node scripts/tdw09_home.proof.mjs /path/to/pristine-e935a2b
// The verdict prints the split so a reader can check the cure arm went red.
//
// ── COMMENT-STRIPPED VIEW ────────────────────────────────────────────────────
// Cells asserting that a PATTERN IS ABSENT run against a comment-stripped copy
// of the file. Found the hard way: the first run went red on "no all-clear card"
// and "never the capped display list" because this build's own comments SAY
// those phrases while forbidding them. A cell that cannot tell code from the
// prose describing code is not a check. Cells asserting a comment EXISTS (§11)
// deliberately use the raw text.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function findRoot(start) {
  let d = start;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(d, 'package.json'))) return d;
    const up = dirname(d);
    if (up === d) break;
    d = up;
  }
  throw new Error('could not locate a repo root (no package.json found walking up)');
}

const ROOT = process.argv[2]
  ? resolve(process.argv[2])
  : findRoot(dirname(fileURLToPath(import.meta.url)));

// HEAD GUARD — the same one the apply block uses. A bench pointed at the wrong
// repo returns confident nonsense; this makes that failure loud.
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
if (pkg.name !== 'web') {
  console.error(`WRONG REPO — package.json name is "${pkg.name}", expected "web". STOP.`);
  process.exit(2);
}

// Strips BOTH comment forms this codebase uses: `/* … */` blocks (including the
// JSX `{/* … */}` wrapper) and whole lines that are pure `//`. Both passes were
// earned by a red: the first run tripped on a `//` comment, and the second on a
// JSX comment saying the very phrase it forbids. It never removes a line that
// has code on it, so no string literal is mangled.
const codeOf = (s) => (s
  ? s.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '')
     .split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')
  : s);

const read = (rel) => {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
};

const HOME    = read('app/vendor/page.tsx');
const INPUT   = read('components/vendor/InputBar.tsx');
const HOOKS   = read('hooks/vendor/useVendorData.ts');
const CHAT    = read('hooks/vendor/useChat.ts');
const ONBOARD = read('components/vendor/OnboardingOverlay.tsx');
const DEMO    = read('app/demo/vendor/[handle]/studio/page.tsx');
const HOME_CODE = codeOf(HOME);
const CHAT_CODE = codeOf(CHAT);

let pass = 0, fail = 0, cures = 0, guards = 0;
const reds = [];
function cell(section, name, ok, kind = 'cure', why) {
  if (kind === 'cure') cures++; else guards++;
  if (ok) { pass++; return; }
  fail++; reds.push(`[${kind}] ${section} · ${name}${why ? ` — ${why}` : ''}`);
}
const has  = (s, needle) => !!s && s.includes(needle);
const none = (s, needle) => !!s && !s.includes(needle);
const count = (s, needle) => (s ? s.split(needle).length - 1 : -1);

// ── §1 · THE ZONES ARE PRESENT AND WIRED ─────────────────────────────────────
cell('1', 'WaitingZone defined',        has(HOME, 'function WaitingZone('));
cell('1', 'WaitingZone rendered',       has(HOME, '<WaitingZone'));
cell('1', 'WeekStrip defined',          has(HOME, 'function WeekStrip('));
cell('1', 'WeekStrip rendered',         has(HOME, '<WeekStrip'));
cell('1', 'FirstRunExemplars defined',  has(HOME, 'function FirstRunExemplars('));
cell('1', 'FirstRunExemplars rendered', has(HOME, '<FirstRunExemplars'));
cell('1', 'ceiling of three',           has(HOME, 'all.slice(0, 3)'));

// ── §2 · ZERO-COLLAPSE, BOTH DIRECTIONS ──────────────────────────────────────
// Direction A — the empty branch collapses to NOTHING at the byte.
cell('2A', 'WaitingZone collapses on empty',
  /function WaitingZone[\s\S]{0,1400}?all\.length === 0\) return null;/.test(HOME || ''));
cell('2A', 'WeekStrip collapses on empty',
  /function WeekStrip[\s\S]{0,600}?week\.length === 0\) return null;/.test(HOME || ''));
// Direction B — the non-empty branch renders lines, and NO "all clear" card
// exists anywhere to reach. The zero-collapse law forbids the cheerful card as
// firmly as it requires the collapse; a bench that only checked the collapse
// would green on a build that shipped one.
cell('2B', 'non-empty branch renders lines', has(HOME, 'shown.map('));
cell('2B', 'no all-clear card',  none(HOME_CODE, 'All clear') && none(HOME_CODE, 'all clear'), 'guard');
cell('2B', 'no nothing-waiting card', none(HOME_CODE, 'Nothing waiting') && none(HOME_CODE, "You're all caught up"), 'guard');

// ── §3 · THE EXEMPLAR SEED / RETIRE PAIR ─────────────────────────────────────
cell('3', 'retirement predicate is a named function', has(HOME, 'function isFirstRun('));
cell('3', 'predicate gates the render',   has(HOME, 'firstRun'));
cell('3', 'unknown is not empty',
  /function isFirstRun[\s\S]{0,400}?if \(!today\) return false;/.test(HOME || ''));
cell('3', 'retires on a lead',      /open_leads_count \?\? 0\) === 0/.test(HOME || ''));
cell('3', 'retires on money',       /money\.outstanding \?\? 0\) === 0/.test(HOME || ''));
cell('3', 'retires on a week',      /this_week\?\.length \?\? 0\) === 0/.test(HOME || ''));
cell('3', 'exemplars seed the input', has(HOME, 'onAct={act}'));
cell('3', 'seed reaches InputBar',    has(HOME, 'initialValue={seed || draft || undefined}'));

// ── §4 · THE LEDGER'S REGISTER (money law) ───────────────────────────────────
cell('4', 'owed cell formats through the canon', has(HOME, 'fmtRs(owed)'), 'guard');
cell('4', 'waiting money formats through the canon', has(HOME, 'fmtRs(inv.amount_owed)'));
cell('4', 'no rupee glyph',  none(HOME, '\u20B9'), 'guard');
cell('4', 'no L shorthand',  !/\bRs ?\d+(\.\d+)?L\b/.test(HOME || ''), 'guard');
cell('4', 'no k shorthand',  !/\bRs ?\d+(\.\d+)?[kK]\b/.test(HOME || ''), 'guard');
cell('4', 'no Cr shorthand', !/\bRs ?\d+(\.\d+)?Cr\b/.test(HOME || ''), 'guard');

// ── §5 · ONE ROOM, ONE TRUTH ─────────────────────────────────────────────────
cell('5', 'exactly one ChatThread mount', count(HOME, '<ChatThread') === 1, 'guard',
  `found ${count(HOME, '<ChatThread')}`);
cell('5', 'exactly one InputBar mount',   count(HOME, '<InputBar') === 1, 'guard',
  `found ${count(HOME, '<InputBar')}`);
cell('5', 'the rise exists',              has(HOME, 'const [risen, setRisen]'));
cell('5', 'the rise is dismissible',      has(HOME, 'setRisen(false)'));
cell('5', 'the raise touches no chat wire', has(HOME, 'onFocusCapture'));

// ── §6 · THE PLUMBING LIMB (R-O12 / R-O15 / F-09.49) ─────────────────────────
cell('6', 'both readers on the engine count',
  count(HOME_CODE, 'today?.open_leads_count ?? 0') === 2, 'cure',
  `found ${count(HOME_CODE, 'today?.open_leads_count ?? 0')}, expected 2`);
cell('6', 'the capped legacy read is gone', none(HOME_CODE, 'context?.new_leads?.length'));
cell('6', 'never the capped display list',  none(HOME_CODE, 'new_leads.length'), 'guard');
cell('6', 'useTodayData exists',            has(HOOKS, 'export function useTodayData'));
// SCOPED TO useTodayData'S OWN BODY. The first draft asked whether the MODULE
// contained `'leads',` — which useLeadsData has carried since long before this
// sitting, so the cell greened at e935a2b too: a cure cell proving nothing,
// caught by running the red arm and counting, not by reading it back.
const TODAY_HOOK = (HOOKS || '').split('export function useTodayData')[1] || '';
cell('6', 'it rides the leads slice',       /useLoader<TodayResponse>\([\s\S]{0,200}?'leads',/.test(TODAY_HOOK));
cell('6', 'with its own cache row',         /'today',/.test(TODAY_HOOK));
cell('6', 'it subscribes to that slice',    /subscribeToSlice\('leads'/.test(TODAY_HOOK));
cell('6', 'trigger two is at the caller',   has(HOME, 'todayRefreshRef.current()'));

// ── §7 · THE DEAD ARE DEAD (R-O14-AMENDED / F-09.52 / F-09.54) ───────────────
cell('7', 'EnquiryCard has no definition', none(HOME_CODE, 'function EnquiryCard('));
cell('7', 'EnquiryCard has no mount',      none(HOME_CODE, '<EnquiryCard'), 'guard');
cell('7', 'QUICK_ACTIONS is gone',         none(HOME_CODE, 'const QUICK_ACTIONS'));
cell('7', 'the demo twin-comment is re-pointed', has(DEMO, 'THREE, NOT FOUR'));

// ── §8 · THE FOUNDER'S COPY BYTES, EXACTLY ───────────────────────────────────
// LD-5 keeps benches off wording in general; these are the exception the chair
// named — every string here is founder-worded and a drift is a veto breach.
cell('8', 'Reply → (R-O19)',        has(HOME, "verb: 'Reply \u2192'"));
cell('8', 'Remind → (R-O21)',       has(HOME, "verb: 'Remind \u2192'"));
cell('8', 'Confirm → (R-O19)',      has(HOME, "verb: 'Confirm \u2192'"));
cell('8', 'overflow line (R-O19)',  has(HOME, '\u2026and ${extra} more \u2192'));
cell('8', 'Example, never Hint',    has(HOME, '>Example<') && none(HOME_CODE, '>Hint<'));
cell('8', 'exemplar one (R-O19)',   has(HOME, 'Hold 14 Dec for the Kapoor mehndi'));
cell('8', 'exemplar two (R-O19)',   has(HOME, "What's owed this month?"));
cell('8', 'placeholder (R-O19)',    has(INPUT, 'Ask anything\u2026') && none(INPUT, 'Ask DreamAi\u2026'));
cell('8', 'welcome headline (R-O20)',
  has(ONBOARD, "headline: 'Ask anything.'") && none(ONBOARD, "'Ask DreamAi\\nanything.'"));

// ── §9 · R-O17 — THE SPELLING CEILING ────────────────────────────────────────
cell('9', 'ceiling moved to twenty', has(HOME, 'n <= 20 ? words[n]'));
cell('9', 'twelve spells',           has(HOME, "'Twelve'"));
cell('9', 'the old ceiling is gone', none(HOME_CODE, 'n <= 10 ? words[n]'));

// ── §10 · W-1 HELD ───────────────────────────────────────────────────────────
// The chat's wire is untouchable this sitting. F-09.55's true cure —
// invalidateSlice at useChat — is a W-1 opening and must NOT appear here.
cell('10', 'no slice call entered the chat wire', none(CHAT_CODE, 'invalidateSlice'), 'guard');
cell('10', 'useChat still refreshes its own context', has(CHAT, 'refreshContext()'), 'guard');

// ── §11 · F-09.53's CONDITIONAL IS DECLARED, NOT ASSUMED ─────────────────────
// The week strip's correctness depends on a dream-os clause this repo cannot
// carry. A build that shipped the strip WITHOUT saying so would look green and
// be wrong; this cell asserts the declaration exists in the file itself.
cell('11', 'the strip declares its conditional', has(HOME, 'DECLARED CONDITIONAL'));
cell('11', 'it names the covenant site',        has(HOME, 'day.js:59'));

// ── §12 · LAYOUT STRUCTURE — added AFTER the founder's walk rejected a build
// this bench had passed 59/59. The blind spot was declared in the header, but a
// declared blind spot that costs a walk still has to be narrowed. These cells do
// not prove pixels either; they assert the STRUCTURAL INVARIANTS whose absence
// produced every symptom he saw — a column with no grower, and a room sized to
// a collapsed parent.
cell('12', 'the risen room is not an overlay',
  none(HOME_CODE, "position: 'absolute', inset: 0"), 'guard');
cell('12', 'no z-index war at the foot', none(HOME_CODE, 'zIndex: 41'), 'guard');
cell('12', 'the column has a grower at rest',
  /\{!risen && <div style=\{\{ flex: 1, minHeight: 0 \}\} \/>\}/.test(HOME_CODE || ''));
cell('12', 'the risen room grows to fill',
  /\{risen && \([\s\S]{0,200}?flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,/.test(HOME_CODE || ''));
// The rise must not swallow the chrome: Header and the mode pill are mounted
// ABOVE the risen branch, so Studio / AI / Discover stay reachable from the chat.
{
  const code = HOME_CODE || '';
  const risenAt = code.indexOf('{risen && (');
  cell('12', 'nav survives the rise',
    risenAt > 0 && code.indexOf('<Header') > 0 && code.indexOf('<Header') < risenAt);
  // ── AMENDED AT F-09.129 (Fork A(a)+B(b1)), COUNT PRESERVED 2 → 2 ──────────
  // WHAT THIS CELL USED TO ASSERT: the chip mounts BEFORE `{risen && (` — i.e.
  // above the rise, so it survived being swallowed by it. The INTENT was always
  // "the mode control is reachable from inside the chat"; standing above the
  // rise was merely how that was achieved when the chip lived on the Hub.
  // The founder has now ruled the chip OFF the Hub masthead entirely, and the
  // intent is served better, not worse: the control is no longer near the chat,
  // it is IN it. So the cell INVERTS rather than dies — an unguarded absence
  // here would let a future edit put the pill back on the Hub silently.
  cell('12', 'the mode control is IN the risen room, not above it (F-09.129)',
    risenAt > 0 && code.indexOf('<VictorModeChip') > risenAt);
}

// ── §13 · ONE SENTENCE, ONE REGISTER ─────────────────────────────────────────
// The greeting spelled its letters and printed its invoices as a digit —
// "Nine letters await you this morning, and 5 invoices remain." Pre-existing,
// surfaced by R-O17's ceiling, caught on the walk.
cell('13', 'both halves of the greeting spell',
  none(HOME_CODE, '${owedCount} invoices remain'));
cell('13', 'the invoice half runs through spell()',
  has(HOME_CODE, 'spell(owedCount)'));

// ── VERDICT ──────────────────────────────────────────────────────────────────
const total = pass + fail;
console.log(`\nTDW_09 O-2 · home bench @ ${ROOT}`);
console.log(`${pass}/${total} cells green  (${cures} cure · ${guards} guard)`);
if (fail) {
  console.log(`\nRED (${fail}):`);
  for (const r of reds) console.log(`  · ${r}`);
  process.exit(1);
}
console.log('ALL GREEN\n');
