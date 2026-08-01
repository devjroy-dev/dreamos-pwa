#!/usr/bin/env node
// scripts/tdw07_f0789_conversations.proof.mjs
// F-b — the false empty state on BOTH conversation screens.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ── §1.a RE-AIMED (labeled) — THE COMMENT-JUDGING CLASS, THIRD APPEARANCE ────
// The first draft asserted the retired shape `.catch(() => setLoading(false))`
// was absent from the FILE. It went red on the CURED tree — because the F-06.85
// cure comment QUOTES the old shape verbatim, which is exactly what that law
// requires it to do. A cell that reads prose convicts the documentation of the
// cure. Greens are never bought by deleting evidence (the F-07.52 ruling): the
// comment stays, the cell moved to code.
// ── F-07.74 · CONVERGED ON THE ONE MODULE ────────────────────────────────────
// This bench shipped its own copy of the cured scanner after CE-120. Three copies
// of a correct rule are still three definitions of "code"; the module is the one
// home, and it additionally preserves newlines inside stripped comments, which
// this inline copy did not.
const strip = stripComments;
let pass=0, fail=0;
const ok=(n,c)=>{ if(c){pass++;console.log(`  PASS  ${n}`);} else {fail++;console.log(`  FAIL  ${n}`);} };
const sec=t=>console.log(`\n${t}`);

const SCREENS = [
  ['vendors', 'app/admin/conversations/vendors/page.tsx'],
  ['brides',  'app/admin/conversations/brides/page.tsx'],
];


// ═════════════════════════════════════════════════════════════════════════════
// §0 · THE CANARY — TDW_STRIPPER_CANARY (CE-120's law; F-07.74's cure)
// ═════════════════════════════════════════════════════════════════════════════
// The retired stripper treated the `/*` inside `accept="image/*"` as a comment
// open and deleted to the next real `*/`. Every absence-cell downstream of that
// deletion was acquitting over code it could not see — proven per instance by the
// plant-inside-the-bite probe, which stayed GREEN with the forbidden specimens
// planted inside the bite and REDDENS under the cure.
//
// The anchors below are LIVE CODE at the head, waist and tail of this bench's
// principal subject file. If a future stripper eats a region it eats one of them
// and this section reddens FIRST. §0.X drives the stripper directly (the mechanism,
// not the source — a planted `image/*` in production code is correctly harmless
// now), §0.Y is its vacuity twin, and §0.Z is F-07.99's cell: a definition with no
// call-site fooled this estate for a whole block, so the call-site is asserted.
sec('§0 · THE CANARY — the stripper must not swallow live code');
{
  const _c = strip(read('app/admin/conversations/vendors/page.tsx'));
  ok('§0.1 canary survives stripping — page.tsx: const m = Math.floor(diff / 60000);', _c.includes('const m = Math.floor(diff / 60000);'));
  ok('§0.2 canary survives stripping — page.tsx: getVendorThreads().then(d => { setThreads(d.', _c.includes('getVendorThreads().then(d => { setThreads(d.threads); setLoading(false); })'));
  ok('§0.3 canary survives stripping — page.tsx: <div style={{ flex: 1, minWidth: 0 }}>', _c.includes('<div style={{ flex: 1, minWidth: 0 }}>'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
              return (self.match(/\bstrip\s*\(/g) || []).length >= 2; })());
}

sec('§1 · THE SWALLOWED ERROR IS DEAD ON BOTH SCREENS');
for (const [name, p] of SCREENS) {
  const s = read(p);
  ok(`§1.${name}.a the bare swallow is gone FROM THE CODE (the cure comment may quote it — F-06.85)`,
     !/\.catch\(\(\) => setLoading\(false\)\)/.test(strip(s)));
  ok(`§1.${name}.a2 CANARY: the retired shape IS still quoted in the comment, as its law demands`,
     /\.catch\(\(\) => setLoading\(false\)\)/.test(s));
  ok(`§1.${name}.b failure is RECORDED, not discarded`, /setLoadFailed\(true\)/.test(s));
  ok(`§1.${name}.c the flag resets on every load — a retry that succeeds clears it`,
     /setLoadFailed\(false\)/.test(s));
  ok(`§1.${name}.d the error arm renders BEFORE the empty arm (order decides which sentence shows)`,
     s.indexOf(': loadFailed ?') < s.indexOf(': threads.length === 0 ?'));
  ok(`§1.${name}.e the empty sentence is now gated on a SUCCESSFUL empty load`,
     /loadFailed \? \(/.test(s) && /No conversations yet/.test(s));
  ok(`§1.${name}.f the failure state offers a way out`, /onClick=\{load\}/.test(s));
}

sec('§2 · THE CLASS — the sibling was cured in the same delivery');
{
  const v = read(SCREENS[0][1]), b = read(SCREENS[1][1]);
  ok('§2.1 both screens carry the same failure constant', /LOAD_FAILED/.test(v) && /LOAD_FAILED/.test(b));
  ok('§2.2 F-06.85: both name the mechanism the cure rests on',
     /column conversations\.channel/.test(v) && /column conversations\.channel/.test(b));
  ok('§2.3 both mark the one new string VETO PENDING', /VETO PENDING/.test(v) && /VETO PENDING/.test(b));
  ok('§2.4 the messages toast is untouched — it was already honest',
     /Failed to load messages\./.test(v) && /Failed to load messages\./.test(b));
}

sec('§3 · COPY — the new bytes live in named constants, nowhere else');
for (const [name, p] of SCREENS) {
  const s = read(p);
  ok(`§3.${name}.a exactly one failure string, in a constant`,
     (s.match(/const LOAD_FAILED = /g) || []).length === 1);
  ok(`§3.${name}.b the retry label is a constant too`, /const RETRY {7}= /.test(s));
  ok(`§3.${name}.c neither string is inlined anywhere in the JSX`,
     !/>Could not load conversations\.</.test(s));
}

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════`);
process.exit(fail === 0 ? 0 : 1);
