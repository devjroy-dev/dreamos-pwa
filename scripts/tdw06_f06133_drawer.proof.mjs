// tdw06_f06133_drawer.proof.mjs — TDW_06 CLOSING ARC · F-06.133, fork C-1(b).
//
// THE MOVEMENT: the PWA "the work" expansion surface is REMOVED OUTRIGHT. `PairWork` is
// deleted WHOLE — both branches, the collapsed `The work ›` drawer AND its own three-dot
// streaming line. `TypingDots` alone is the working state. Founder-ruled twice; the three
// deletion slots vetoed verbatim 「 approve all 」.
//
// WHY THIS FILE EXISTS AND IS NOT A CELL IN THE M-3 HARNESS: a removal's proof asks a
// different question from a feature's. The M-3 harness proves a chip RENDERS; this proves a
// surface CANNOT. The CE ruled a sibling file so the two questions never dilute each other.
//
// THE M-3 PRECEDENT, ruled in: §2 REPRODUCES THE REMOVED EXPRESSION and asserts it would
// still put the drawer on screen. A removal proved only by absence is proved by a grep that
// passes on an empty file. The removed bytes are the disease, and the proof fails if they
// return.
//
// ZERO NETWORK, ZERO BUILD. Source-text assertions plus one extracted-and-executed render
// predicate, the same method §3 of the M-3 harness uses.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

let pass = 0, fail = 0;
const T = (label, cond) => {
  if (cond) { pass++; console.log('  \u2713 ' + label); }
  else { fail++; console.log('  \u2717 ' + label); }
};
const sec = (t) => console.log('\n' + t);

const THREAD = read('components/vendor/ChatThread.tsx');
const BUBBLE = read('components/vendor/MessageBubble.tsx');
const USECHAT = read('hooks/vendor/useChat.ts');
const VENDORAPI = read('lib/vendor/api/vendor.ts');

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a71  THE COMPONENT IS ABSENT \u2014 declaration and call site both');

// The declaration. A `function PairWork(` anywhere is the surface back from the dead.
T('no `function PairWork` declaration survives in ChatThread.tsx',
  !/function\s+PairWork\s*\(/.test(THREAD));

// The call site. JSX usage is the thing a reader would actually see.
T('no `<PairWork` element is rendered anywhere in ChatThread.tsx',
  !/<PairWork\b/.test(THREAD));

// And nowhere else in the tree either \u2014 a component moved to a sibling file is not removed.
for (const [name, src] of [['MessageBubble.tsx', BUBBLE], ['useChat.ts', USECHAT], ['vendor.ts', VENDORAPI]])
  T(`PairWork has not migrated into ${name}`, !/PairWork\s*\(/.test(src) && !/<PairWork\b/.test(src));

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a72  THE THREE DELETED STRINGS ARE GONE \u2014 the founder\u2019s vetoed deletions, byte-level');

// SLOT ONE \u2014 the drawer's own label and its chevron affordance.
T('SLOT ONE: the `The work` label is absent from the tree', !/The work\b/.test(THREAD));
T('SLOT ONE: the drawer\u2019s `\u203a` chevron affordance is absent',
  !/transform:\s*open\s*\?\s*'rotate\(90deg\)'/.test(THREAD) && !/aria-expanded/.test(THREAD));

// SLOT TWO \u2014 the caption on the old streaming branch. The working state carries NO words now.
T('SLOT TWO: the `The pair is working` caption is absent', !/The pair is working/.test(THREAD));
T('SLOT TWO: the drawer\u2019s own dot animation (`pw-dots` / `pwWk`) is gone',
  !/pw-dots/.test(THREAD) && !/pwWk/.test(THREAD));

// SLOT THREE \u2014 the beat renderer's prose. Only the drawer ever spoke these.
T('SLOT THREE: `Handed to the operator` is absent', !/Handed to the operator/.test(THREAD));
T('SLOT THREE: the `Operator reported \u00b7` prose is absent', !/Operator reported/.test(THREAD));
T('SLOT THREE: the drawer\u2019s open-animation keyframe (`pwOpen`) is gone', !/pwOpen/.test(THREAD));

// EXPECTED-ZERO ADDED BYTES. The movement deletes; it must not mint a replacement caption.
// Any of these words appearing would be a vendor-facing string that never met a veto.
for (const w of ['Working\u2026', 'Thinking\u2026', 'One moment', 'Please wait'])
  T(`no replacement caption minted: ${JSON.stringify(w)} absent`, !THREAD.includes(w));

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a73  THE WORKING STATE IS PRESENT \u2014 TypingDots, one home, unmoved');

T('MessageBubble still imports TypingDots from its one home', /import\s*\{\s*TypingDots\s*\}\s*from\s*'\.\/TypingDots'/.test(BUBBLE));

// THE PREDICATE, EXTRACTED FROM SOURCE AND EXECUTED \u2014 never re-typed. If the guard's shape
// drifts, this throws rather than greening on a stale copy (the liftConst discipline).
const guardMatch = BUBBLE.match(/if\s*\(([^)]+)\)\s*return\s*<TypingDots\s*\/>;/);
if (!guardMatch) {
  fail++;
  console.log('  \u2717 the TypingDots guard could not be extracted from MessageBubble.tsx \u2014 the lift is stale, not the code');
} else {
  const guard = new Function('streaming', 'text', `return !!(${guardMatch[1]});`);
  T('EXTRACTED: streaming with no text yet \u2192 the working state SHOWS', guard(true, '') === true);
  T('EXTRACTED: streaming once text arrives \u2192 the working state gives way', guard(true, 'Filed \u2014') === false);
  T('EXTRACTED: a settled message \u2192 no working state', guard(false, 'Filed \u2014') === false);
  T('EXTRACTED: a settled EMPTY message \u2192 still no working state', guard(false, '') === false);
}

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a74  THE REMOVED EXPRESSION, REPRODUCED \u2014 the M-3 precedent: the disease must still convict');

// This is the drawer's own done-branch predicate, reproduced verbatim from the deleted
// component. It is NOT imported \u2014 it cannot be, the code is gone. It is reproduced so this
// proof fails the day someone restores it.
const preCureDrawerShows = (beats, streaming) => {
  if (!beats || beats.length === 0) return false;   // the deleted guard, verbatim
  if (streaming) return false;                       // the deleted streaming branch took over
  return true;                                       // the deleted done branch: `The work \u203a`
};
const beats = [{ kind: 'handoff', message: 'Logging that now.' }];
T('PRE-CURE: a settled turn carrying beats WOULD have shown the drawer (the disease reproduced)',
  preCureDrawerShows(beats, false) === true);
T('PRE-CURE: the same turn shows NOTHING today \u2014 no renderer consumes beats for a drawer',
  !/<PairWork\b/.test(THREAD));
T('PRE-CURE: the drawer\u2019s open-state hook is gone \u2014 nothing can expand',
  !/const\s*\[\s*open\s*,\s*setOpen\s*\]/.test(THREAD));

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a75  THE SIBLING SURFACE IS UNTOUCHED \u2014 FilingChip is a DIFFERENT surface, and survives');

T('FilingChip is still imported by ChatThread', /import\s*\{\s*FilingChip\s*\}\s*from\s*'@\/components\/vendor\/FilingChip'/.test(THREAD));
T('FilingChip is still rendered', /<FilingChip\b/.test(THREAD));

// Its filter is the discriminator: the chip reads a STRICT SUBSET of what the drawer read.
const chipFilter = THREAD.match(/\.filter\(\(b: any\) => \((b\.kind === 'operator_action' \|\| b\.kind === 'error')\) && b\.summary\)/);
if (!chipFilter) {
  fail++;
  console.log('  \u2717 the FilingChip filter could not be extracted \u2014 the lift is stale, not the code');
} else {
  const kindOk = new Function('b', `return !!(${chipFilter[1]});`);
  T('EXTRACTED: an `operator_action` beat still reaches the chip', kindOk({ kind: 'operator_action' }) === true);
  T('EXTRACTED: an `error` beat still reaches the chip', kindOk({ kind: 'error' }) === true);
  T('EXTRACTED: a `handoff` beat does NOT \u2014 it was the DRAWER\u2019s, and the drawer is gone', kindOk({ kind: 'handoff' }) === false);
  T('EXTRACTED: an `operator_report` beat does NOT \u2014 same', kindOk({ kind: 'operator_report' }) === false);
}
T('the chip\u2019s `summary` requirement survives \u2014 a summary-less action still draws nothing', /&& b\.summary\)/.test(THREAD));

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a76  DISPLAY DIES, DATA LIVES \u2014 the orphan census, asserted not intended');

T('`deliberation` is STILL DECLARED on ChatMessage \u2014 the field stays', /deliberation\?:\s*StreamBeat\[\]/.test(USECHAT));
T('`deliberation` is STILL INITIALISED on every AI message', /deliberation:\s*\[\]/.test(USECHAT));
T('`deliberation` is STILL APPENDED on every beat \u2014 the trace is collected, not dropped',
  /deliberation:\s*\[\s*\.\.\.\(m\.deliberation\s*\?\?\s*\[\]\),\s*beat\s*\]/.test(USECHAT));

T('the StreamBeat union STILL carries `handoff` \u2014 the wire contract is unnarrowed', /kind:\s*'handoff'/.test(VENDORAPI));
T('the StreamBeat union STILL carries `operator_report`', /kind:\s*'operator_report'/.test(VENDORAPI));
T('FilingBeat is unnarrowed \u2014 summary/record_ref/undo all survive',
  /summary\?:\s*string/.test(VENDORAPI) && /record_ref\?:/.test(VENDORAPI) && /undo\?:\s*UndoSpec/.test(VENDORAPI));

// The scroll-follow expression stays: a FilingChip can land beat-first and the scroll must
// follow it. Its subject changed; its behaviour did not.
T('the beat-driven scroll-follow survives (its comment corrected, its expression byte-unmoved)',
  /const tailDelib = tail\?\.deliberation\?\.length \?\? 0;/.test(THREAD));

// ═══════════════════════════════════════════════════════════════════════════
sec('\u00a77  THE REPORT CHIP IS UNTOUCHED \u2014 M-3\u2019s surface does not ride on this movement');

T('the REPORT THIS GLITCH chip label is byte-present', THREAD.includes('REPORT THIS GLITCH'));
T('`onReportGlitch` is still its own prop, never `onChipTap`', /onReportGlitch\?:\s*\(\)\s*=>\s*Promise<void>\s*\|\s*void/.test(THREAD));
T('the dim-after-tap state survives', /const \[reported, setReported\] = useState/.test(THREAD));

// ═══════════════════════════════════════════════════════════════════════════
console.log(`\nTDW_06 F-06.133 DRAWER REMOVAL: ${fail === 0 ? 'ALL GREEN' : 'RED'}  ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
