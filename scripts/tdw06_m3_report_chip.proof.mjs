#!/usr/bin/env node
// TDW_06 M-3 — THE PWA PAIR: replace-at-done + the Report chip (F-06.130's client half).
//
// Sited in this repo's own proof harness on f0539_demo_authority.mjs's precedent, because a
// dream-os bench cannot read this tree and a declared coverage gap was the alternative. The
// CE ruled the harness in: mirror B's demo dormancy ships as a REAL CELL, never an assumption.
//
// WHAT IT PROVES:
//   §1 SOURCE GUARDS — every reproduction below is pinned to its real site, so the proof
//      cannot pass against a tree where the cure has moved or vanished.
//   §2 THE PAYLOAD — StreamDonePayload gains `intercept` ADDITIVELY, the done branch forwards
//      it, and the three sibling SSE consumers are untouched (the census, re-derived here).
//   §3 REPLACE-AT-DONE — the shipped text expression, extracted and RUN against four states:
//      intercepted / not intercepted / clarify / empty stream. The pre-cure expression is
//      reproduced beside it and asserted to keep the costume in the intercepted state — that
//      return IS the disease, and this proof fails if it ever comes back.
//   §4 THE CHIP — its own wire (never onChipTap), the vetoed label byte-exact, one-tap
//      disable with no new words (Slot Five), and the route posting no id (FORK 6b).
//   §5 DEMO DORMANCY (mirror B) — the demo surface renders this same component through
//      useDemoChat; `intercepted` is never set there, so the chip is dormant BY CONSTRUCTION.
//
// Run: node scripts/tdw06_m3_report_chip.proof.mjs

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __R0 = (p) => readFileSync(join(__dirname, '..', p), 'utf8');

/* ── AMENDMENT, TDW_13 D-5: THE SUBJECT IS THE SURFACE ──────────────────────
   D-4 and D-5 split the eleven blooms out of sanctuary/page.tsx into
   components/frost/blooms/, with two shared helpers in components/frost/_shared/.
   The bride's Sanctuary is the same screen across fourteen files. Every cell
   here asking about SANCTUARY was asking about the screen, not the path, so a
   read of the sanctuary path returns the whole surface. Directories are READ,
   never hand-listed — a written list is exactly how a byte escapes a bench.
   See components/frost/_shared/SURFACE.md. */
const __SANCT_PATH = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const R = (p) => {
  if (p !== __SANCT_PATH) return __R0(p);
  const parts = [__R0(__SANCT_PATH)];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = join(__dirname, '..', d);
    if (existsSync(abs)) for (const f of readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) parts.push(__R0(`${d}/${f}`));
  }
  return parts.join('\n');
};

const SRC = {
  api:      R('lib/vendor/api/vendor.ts'),
  useChat:  R('hooks/vendor/useChat.ts'),
  thread:   R('components/vendor/ChatThread.tsx'),
  page:     R('app/vendor/page.tsx'),
  demoApi:  R('lib/demo/api.ts'),
  demoHook: R('hooks/demo/useDemoChat.ts'),
  demoPage: R('app/demo/vendor/[handle]/studio/page.tsx'),
  couple:   R('lib/frost-api/couple.ts'),
  sanct:    R('app/(frost)/frost/canvas/sanctuary/page.tsx'),
};

let fail = 0;
const ok  = (m) => console.log(`  \u2713 ${m}`);
const bad = (m) => { console.log(`  \u2717 ${m}`); fail++; };
const T = (m, c) => (c ? ok(m) : bad(m));

console.log('\n\u00a71  SOURCE GUARDS (the cure is where this proof thinks it is)');
T('GUARD StreamDonePayload is the vendor lane\u2019s own type', /export type StreamDonePayload = \{/.test(SRC.api));
T('GUARD the SSE done branch calls onDone with a payload', /event\.type === 'done'\)\s*\{\s*onDone\(\{/.test(SRC.api));
T('GUARD useChat\u2019s done handler still rewrites text wholesale', /text:\s*result\.intercept\?\.replaced/.test(SRC.useChat));
T('GUARD ChatThread renders per-message blocks keyed on m', /m\.suggestions\?\.suggestions/.test(SRC.thread));

console.log('\n\u00a72  THE PAYLOAD \u2014 additive, forwarded, and the siblings untouched');
T('`intercept` is on StreamDonePayload and is OPTIONAL (additive, breaks no caller)',
  /intercept\?: \{ replaced: boolean; text: string \};/.test(SRC.api));
T('the done branch FORWARDS it beside the five fields it already carried',
  /intercept:\s*event\.intercept/.test(SRC.api)
  && ['tool_calls', 'refresh', 'contact', 'clarify', 'meta'].every((f) => new RegExp(`${f}:\\s*event\\.${f}`).test(SRC.api)));
// THE SIBLING CENSUS, re-derived here rather than carried from a ruling's sentence
T('sibling 1 \u2014 lib/demo/api.ts declares its OWN independent StreamDonePayload, no intercept',
  /export interface StreamDonePayload \{/.test(SRC.demoApi) && !/intercept/.test(SRC.demoApi));
T('sibling 2 \u2014 lib/frost-api/couple.ts takes NO payload on done',
  /evt\.type === 'done'\) onDone\(\);/.test(SRC.couple));
T('sibling 3 \u2014 the sanctuary page reads no done payload',
  /ev\.type==='done'\|\|ev\.type==='error'/.test(SRC.sanct));

console.log('\n\u00a73  REPLACE-AT-DONE \u2014 the SHIPPED expression, extracted and run');
// Extract the real ternary from the shipped source so this cell cannot test a copy.
const m = SRC.useChat.match(/text:\s*(result\.intercept\?\.replaced[\s\S]*?),\n\s*intercepted:/);
if (!m) { bad('the shipped text expression could not be extracted \u2014 re-derive'); }
else {
  ok('the shipped text expression was extracted from source, not re-typed');
  const shipped = new Function('result', 'accumulated', `return (${m[1]});`);
  const preCure = (result, accumulated) => accumulated || (result.clarify ? result.clarify.question : 'Got it.');
  const COSTUME = 'Done. 18 December 2026 is unblocked.';
  const LINE = 'There was a small glitch, please try again or use the app screens for this action';
  const intercepted = { intercept: { replaced: true, text: LINE } };
  T('(i) INTERCEPTED \u2014 the streamed costume is replaced by the vetoed line',
    shipped(intercepted, COSTUME) === LINE);
  T('(i) THE TEETH \u2014 the PRE-CURE expression keeps the costume on screen (the disease itself)',
    preCure(intercepted, COSTUME) === COSTUME);
  T('(ii) NOT INTERCEPTED \u2014 the accumulated stream is byte-unchanged',
    shipped({}, 'Filed \u2014 Bhavna Walkprobe.') === 'Filed \u2014 Bhavna Walkprobe.');
  T('(iii) CLARIFY \u2014 the existing fallback survives untouched',
    shipped({ clarify: { question: 'Which date?' } }, '') === 'Which date?');
  T('(iv) EMPTY, NO CLARIFY \u2014 the existing default survives untouched',
    shipped({}, '') === 'Got it.');
  T('(v) `replaced:false` does NOT replace \u2014 the flag decides, not the field\u2019s presence',
    shipped({ intercept: { replaced: false, text: LINE } }, COSTUME) === COSTUME);
  T('the flag is set only when the guard actually replaced',
    /intercepted:\s*result\.intercept\?\.replaced === true/.test(SRC.useChat));
}

console.log('\n\u00a74  THE CHIP \u2014 its own wire, the vetoed label, one tap');
T('the chip has its OWN prop \u2014 it is NOT wired through onChipTap',
  /onReportGlitch\?: \(\) => Promise<void> \| void;/.test(SRC.thread)
  && /await onReportGlitch\?\.\(\)/.test(SRC.thread));
T('THE TEETH \u2014 onChipTap is `send`, so routing the chip through it would post the label as a vendor message',
  /onChipTap=\{send\}/.test(SRC.page));
T('the chip is wired to the route at the page, on its own prop',
  /onReportGlitch=\{async \(\) => \{ await reportGlitch\(\); \}\}/.test(SRC.page));
T('SLOT FOUR \u2014 the founder-vetoed label, byte-exact', />REPORT THIS GLITCH<\/button>/.test(SRC.thread));
T('the chip renders ONLY on an intercepted reply', /\{m\.intercepted && \(/.test(SRC.thread));
T('SLOT FIVE \u2014 one tap dims and disables, and NO new words are minted',
  /disabled=\{!!reported\[m\.id\]\}/.test(SRC.thread)
  && /opacity: reported\[m\.id\] \? 0\.4 : 1/.test(SRC.thread)
  && !/FLAGGED|Flagged/.test(SRC.thread));
T('a second tap cannot file a second finding against the same turn',
  /if \(reported\[m\.id\]\) return;/.test(SRC.thread));
T('the chip never throws at the vendor', /catch \{ \/\* the chip never throws at the vendor \*\/ \}/.test(SRC.thread));
T('FORK 6b \u2014 the route client posts NOTHING but the session (no run id on the wire)',
  /postJson<GlitchReportResponse>\('\/api\/v2\/vendor\/chat\/glitch-report', \{\}\)/.test(SRC.api));

console.log('\n\u00a75  MIRROR B \u2014 DEMO DORMANCY, asserted and never assumed');
T('the demo studio renders THIS SAME component', /<ChatThread/.test(SRC.demoPage));
T('the demo hook returns the same ChatMessage type (its own header says so)',
  /ChatMessage type as real useChat/.test(SRC.demoHook));
T('the demo hook NEVER sets `intercepted` \u2014 the chip is dormant there BY CONSTRUCTION',
  !/intercepted/.test(SRC.demoHook));
T('the demo page does not pass onReportGlitch \u2014 nothing to call even if the flag appeared',
  !/onReportGlitch/.test(SRC.demoPage));
T('`intercepted` is OPTIONAL on ChatMessage, which is what makes the dormancy structural',
  /intercepted\?: boolean;/.test(SRC.useChat));

console.log('');
if (fail === 0) { console.log('TDW_06 M-3 REPORT CHIP: ALL GREEN'); process.exit(0); }
console.log(`TDW_06 M-3 REPORT CHIP: ${fail} FAILURE(S)`); process.exit(1);
