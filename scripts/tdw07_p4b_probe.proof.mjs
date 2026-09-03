#!/usr/bin/env node
// scripts/tdw07_p4b_probe.proof.mjs
// TDW_07 P4b — THE ?igprobe=1 NAVIGATION LADDER.
//
// A NEW FILE RATHER THAN CELLS ADDED TO tdw07_p4b_slice1: that bench's 24 is a
// sealed count and the floor-method law says counts are disclosed, not quietly
// grown. This ladder is its own instrument and dies with its own answer.
//
// WHAT THIS BENCH PROTECTS, in order of how much it would cost to get wrong:
//
//   1. THE SUBMITTED SURFACE DOES NOT MOVE. App Review is open. A vendor or a
//      reviewer arriving without the query parameter must render exactly what
//      was filed. Every probe byte lives behind a guard and the cells prove it.
//   2. THE COMPARISON MEANS SOMETHING. Four shapes over ONE url, sharing ONE
//      style object, differing in NOTHING a finger can perceive except the
//      navigation form. If they differed in size or position, a difference in
//      outcome could be argued away.
//   3. THE WALK CANNOT WRITE A FALSE NEGATIVE. The state is single-use; a spent
//      nonce would make a working shape look intercepted. Probe mode re-mints
//      on every return, and the fingerprint renders so the founder can see it.
//
// WHAT IT CANNOT PROVE: which shape escapes. That is the founder's handset and
// nothing else — this file exists precisely because three deviceless paragraphs
// were inverted (see igOAuth.js's NO DEVICE IN THE LOOP header).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
// ── F-07.74 CURED · THE ONE STRIPPER (CE-ruled F1→(b1), F2→(a)) ──────────────
// This file used to carry its own copy of the naive rule. Eleven such copies
// existed across ten proofs and every one of them swallowed live code from an
// `accept="image/*"` to the next real `*/`. The definition now lives at
// scripts/lib/stripComments.mjs and nowhere else. §0 below carries the canaries.
const code = (rel) => stripComments(raw(rel));

  // ── \u00a74-3 \u00b7 F-38.43 \u00b7 THE SUBJECT MOVED; THIS CELL FOLLOWS IT ──────────────────
// Portfolio crossed into the shell, and its body split out of the route file so the
// `<Header/>` import could leave the shell's bundle (S2's lesson: a conditional does not
// remove a module from a bundle; only not importing it does). Every claim in this
// section is about the BODY, and the body is `screen.tsx` now.
//
// A CELL RENAMED TO FOLLOW ITS SUBJECT IS NOT A LOOSENED CELL. A cell left pointing at
// the old path would have reddened a correct tree and taught the next seat that this
// bench may be argued with. The constant is declared HERE, at this reading section,
// rather than once at the top: the sections below read this file for different claims,
// and a shared constant invites a third reader to assume they check the same thing.
const MANAGER = 'app/vendor/(shell)/portfolio/screen.tsx';
const C = code(MANAGER);
const R = raw(MANAGER);


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
    // The canary reads the SAME file MANAGER names \u2014 it is the stripper's
  // non-vacuity probe for this bench's own subject, so it moves with it.
  const _c = code(MANAGER);
  ok('§0.1 canary survives stripping — page.tsx: const [loading, setLoading] = useState(true)', _c.includes('const [loading, setLoading] = useState(true);'));
  ok('§0.2 canary survives stripping — page.tsx: finally { setUploading(false); setProgress(C', _c.includes('finally { setUploading(false); setProgress(COPY.B1); }'));
  ok('§0.3 canary survives stripping — page.tsx: dead={!igPicked.includes(item.source_url) &&', _c.includes('dead={!igPicked.includes(item.source_url) && igPicked.length >= igRoom}'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
              return (self.match(/\bcode\s*\(/g) || []).length >= 2; })());
}

sec('§1 · OFF BY DEFAULT — THE SUBMITTED SURFACE DOES NOT MOVE');
ok('§1.1 the probe flag is read from the query, and only from the query',
  /getElementById|localStorage/.test(C) === false
  && /new URLSearchParams\(window\.location\.search\)\.get\('igprobe'\) === '1'/.test(C));
ok('§1.2 the probe state initialises FALSE — absence is the safe state',
  /const \[igProbe, setIgProbe\] = useState\(false\)/.test(C));
ok('§1.3 the entire probe panel is gated on it', /\{igProbe && \(/.test(C));
// ── LABELED RE-AIM, TDW_09 VENDOR REHAUL R-1 (count preserved 3→3) ─────────
// §1.4–§1.6 asserted the P4b dark state: `IOS_FALLBACK_ARMED = false`, its
// render gate, and its one-switch property. That state RETIRED at R-1 on the
// founder's kickoff verbatim (「 in connect to instagram-for iphone we need to
// write to long press the connect to instagram and open in new tab. pwa and
// ios policy doesnt allow ig app to give permission 」) — exactly the word the
// constant was built dark to wait for. Per the CE-199 amendment precedent the
// cells FOLLOW THE SUBJECT: the gate is now runtime detection, and the
// properties re-aim onto it. DETECTION METHOD, stated in-cell as ruled F-1(a):
// `navigator.standalone === true` — the iOS-Safari-only standalone signal.
ok('§1.4 [RE-AIMED R-1] the iOS instruction gates on isIosStandalone(), which reads navigator.standalone === true and nothing else',
  /function isIosStandalone\(\): boolean \{/.test(C)
  && /\.standalone === true;/.test(C)
  && !/userAgent/.test(C.match(/function isIosStandalone[\s\S]*?\n\}/)?.[0] || 'userAgent'));
ok('§1.5 [RE-AIMED R-1] the render site is gated on that detection AND the anchor (the anchor-only rider, chair-ratified law)',
  /\{isIosStandalone\(\) && igAuthUrl && \(/.test(C));
ok('§1.6 [RE-AIMED R-1] one gate, no second switch — the retired constant is GONE from code and the detection has exactly its definition + one call site',
  (C.match(/IOS_FALLBACK_ARMED/g) || []).length === 0
  && (C.match(/isIosStandalone/g) || []).length === 2);
{
  // THE LOAD-BEARING EQUIVALENCE. With the probe off, the mint gate must reduce
  // to exactly the pre-probe predicate — otherwise the probe changed behaviour
  // for vendors who never asked for it.
  const m = C.match(/const igWantsUrl = ([^;]+);/);
  ok('§1.7 with the probe off, the mint gate reduces to igNeedsConnect',
    !!m && /igNeedsConnect \|\| Boolean\(igProbe && /.test(m[1]),
    m ? m[1] : 'gate not found');
}

sec('§2 · THE CONNECT CONTROL IS BYTE-UNTOUCHED (the filed surface)');
ok('§2.1 the vendor-facing anchor still renders H4 over the pre-minted url',
  /<a href=\{igAuthUrl\}\n\s+style=\{\{[\s\S]*?\}\}>\{COPY\.H4\}<\/a>/.test(C));
ok('§2.2 the retry button still renders H4',
  /onClick=\{igConnectRetry\}[\s\S]*?\}\}>\{COPY\.H4\}<\/button>/.test(C));
ok('§2.3 H18 still renders — the App Review claim stays true',
  /COPY\.H18\.replace\('\{handle\}', ig\.ig_username\)/.test(C));
ok('§2.4 the connect control carries NO target attribute — shape A is the control',
  (() => {
    const m = C.match(/<a href=\{igAuthUrl\}\n\s+style=/);
    return !!m;
  })());

sec('§3 · FOUR SHAPES, ONE URL, ONE STYLE');
const probePanel = (C.match(/\{igProbe && \(([\s\S]*?)\n            \)\}/) || [])[1] || '';
ok('§3.0 the probe panel was located for the cells below', probePanel.length > 200,
  `panel length ${probePanel.length}`);
ok('§3.1 shape A — a plain anchor',
  /<a href=\{igAuthUrl\} style=\{PROBE_BTN\}>A — plain link<\/a>/.test(probePanel));
ok('§3.2 shape B — an anchor into a new tab, opener severed',
  /<a href=\{igAuthUrl\} target="_blank" rel="noopener noreferrer" style=\{PROBE_BTN\}>B/.test(probePanel));
ok('§3.3 shape C — window.open from inside the tap',
  /window\.open\(igAuthUrl, '_blank', 'noopener'\)/.test(probePanel));
ok('§3.4 shape D — a bare location assignment, no await before it',
  /window\.location\.href = igAuthUrl;/.test(probePanel));
{
  // NO SHAPE MAY CARRY ITS OWN URL. If one of them built or mutated the
  // destination, the four would no longer be a controlled comparison — the
  // thing this whole delivery is spending the founder's evening to obtain.
  const urlRefs = (probePanel.match(/igAuthUrl/g) || []).length;
  ok('§3.5 every shape navigates to the SAME pre-minted url, none builds its own',
    urlRefs >= 5 && !/AUTHORIZE_URL|instagram\.com/.test(probePanel),
    `igAuthUrl refs=${urlRefs}`);
}
{
  const styled = (probePanel.match(/style=\{PROBE_BTN\}/g) || []).length;
  ok('§3.6 all four shapes share ONE style object — identical to a finger',
    styled === 4, `PROBE_BTN uses among the four: ${styled}`);
}
ok('§3.7 PROBE_BTN is defined once, outside the component',
  /^const PROBE_BTN: React\.CSSProperties = \{/m.test(C));

sec('§4 · THE WALK CANNOT WRITE A FALSE NEGATIVE');
ok('§4.1 probe mode re-mints UNCONDITIONALLY on every return',
  /if \(igProbe && igWantsUrl\) \{ void mintIgAuthUrl\(\); return; \}/.test(C));
ok('§4.2 the un-probed path keeps its threshold behaviour, unchanged',
  /if \(igWantsUrl && igAuthMintedAt !== null && Date\.now\(\) - igAuthMintedAt > MINT_REFRESH_MS\)/.test(C));
ok('§4.3 a state fingerprint renders so the change is SEEN, not trusted',
  /igAuthUrl\.slice\(-8\)/.test(probePanel));
ok('§4.4 the probe mints even for an already-connected vendor (the founder is)',
  /Boolean\(igProbe && ig && ig\.ig_import_enabled\)/.test(C));
ok('§4.5 a manual refresh control exists for a state that looks wrong',
  /void mintIgAuthUrl\(\); \}\}>Refresh the link<\/button>/.test(probePanel));

sec('§5 · H19 — VETOED AND LIVE IN ITS ONE CONTEXT (re-aimed R-1; was: drafted, dark, veto owed)');
// ── LABELED RE-AIM + GROWTH, TDW_09 VENDOR REHAUL R-1 (3→5, labelled) ──────
// §5.1/§5.3 asserted the draft marker and the dark render. The founder's veto
// executed at R-1 relay #2 (「 ok 」 on wording B, 2026-08-06), so the cells
// re-aim onto the executed state, and the R-1 acceptance cells ① (present in
// the iOS-standalone context, absent elsewhere) and ② (anchor-only) land here
// beside the surface they govern. §5.2's doctrine cell is UNCHANGED — the
// gesture-before-explanation property survived the rewording byte-for-property.
ok('§5.1 [RE-AIMED R-1] H19 carries the executed veto, not the draft marker',
  /H19: '[^']+', \/\/ VETOED 2026-08-06 \(wording B, relay #2\)/.test(R)
  && !/H19: .*DRAFT — veto owed/.test(R));
ok('§5.2 it names the working gesture BEFORE the explanation (H3 ordering doctrine) — and the gesture is PRESENT, not merely not-last (the -1 vacuity, self-caught at this sitting\'s both-ways run)',
  (() => {
    const m = R.match(/H19: '([^']+)'/);
    if (!m) return false;
    const g = m[1].indexOf('Press and hold');
    const e = m[1].indexOf('caught by the Instagram app');
    return g >= 0 && e >= 0 && g < e;
  })());
ok('§5.3 [RE-AIMED R-1 · acceptance ①] the render is context-gated, not dark and not universal — the ONLY H19 render site sits behind the isIosStandalone() conjunction',
  (() => {
    const sites = C.match(/COPY\.H19/g) || [];
    if (sites.length !== 1) return false;
    return /\{isIosStandalone\(\) && igAuthUrl && \([\s\S]{0,600}?COPY\.H19/.test(C);
  })());
ok('§5.4 [NEW R-1 · acceptance ①] absent elsewhere BY CONSTRUCTION — the detection returns false wherever navigator.standalone is not true (SSR guard included), so a desktop, Android, or in-Safari reader never sees the line',
  /if \(typeof navigator === 'undefined'\) return false;/.test(C)
  && /\.standalone === true;/.test(C));
ok('§5.5 [NEW R-1 · acceptance ②] the anchor-only rider is real — the instruction can never render beside the degraded mint-retry <button>, because igAuthUrl null is exactly the button branch',
  /\{igAuthUrl \? \(/.test(C) && /\{isIosStandalone\(\) && igAuthUrl && \(/.test(C));

console.log(`\n──────── tdw07_p4b_probe: ${pass}/${pass + fail} ────────`);
process.exit(fail === 0 ? 0 : 1);
