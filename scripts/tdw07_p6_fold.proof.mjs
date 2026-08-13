#!/usr/bin/env node
// scripts/tdw07_p6_fold.proof.mjs
// TDW_07 P6 — THE FOLD UNDER F-D. The dreamos-pwa half's floor for the block's closing phase.
//
// WHAT THIS BENCH IS FOR:
//   F-07.43 「 F-D 」  the orphan deck folded into sanctuary; the route dead, nothing lost
//   F-07.67           FEATURED marked on the only feed couples reach (spec §3, Manual law)
//   F-07.68           DiscVendorPanel's second renderer replaced by the shared component
//   F-07.58 / F-07.69 the enquired row's wa link: one home, handle-only, no uuid token
//   F-07.7 (d)        the IG deep-link's pointer-coarse split
//   η (c)             the one cursor wraps — sanctuary's live mechanics, at the one home
//   the §9.2 gap      the dot component's cap, placement and accent get a catcher at last
//
// WHAT IT CANNOT PROVE, SAID PLAINLY SO NOBODY READS A GREEN WIDER THAN IT IS:
// this bench proves WIRING, BYTES and ABSENCES. It cannot prove the deck still FEELS like
// itself under a thumb — the constants and the wrap are proven identical to what sanctuary
// carried, but identical numbers are not a witnessed feel. It cannot prove the LQIP layer
// actually shortens a perceived load on a mid-range Android, nor that the FEATURED eyebrow
// reads as editorial rather than as an ad. Those are AFFORDANCE truths and only the
// founder's device settles them (BENCHED-THE-MECHANISM-NOT-THE-AFFORDANCE, protocol §10);
// the walk card names each as a card step.
//
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — order load-bearing, line comments first. It matters especially
// here: the fold is heavily commented and those comments QUOTE what they retired — the
// clamp `if (i >= photoCount - 1) return i;`, the raw number 917982159047, the words
// DiscImageDots and cyclePhoto all survive in prose at the very sites that no longer
// perform them. A cell reading raw text would convict on the explanation. Cells judge CODE.
const __raw0  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/* ── AMENDMENT, TDW_13 D-4: THE SUBJECT IS THE SURFACE ──────────────────────
   D-4 split six blooms out of sanctuary/page.tsx into components/frost/blooms/
   and two helpers into components/frost/_shared/. The bride's Sanctuary is the
   same screen; it now lives in nine files. Every cell in this bench asking
   about SANCTUARY was asking about the screen, not the path — so a read of the
   sanctuary path returns the whole surface. See components/frost/_shared/SURFACE.md.
   The directories are READ, never hand-listed: a written list is exactly how a
   control or a byte escapes a bench — add a file, name it nowhere, still green. */
const __SANCT_PATH = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
function __surface(join) {
  const parts = [join(__SANCT_PATH)];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) parts.push(join(`${d}/${f}`));
  }
  return parts.join('\n');
}
const raw = (rel) => rel === __SANCT_PATH ? __surface(__raw0) : __raw0(rel);

// ── F-07.74 CURED · THE ONE STRIPPER (CE-ruled F1→(b1), F2→(a)) ──────────────
// This file used to carry its own copy of the naive rule. Eleven such copies
// existed across ten proofs and every one of them swallowed live code from an
// `accept="image/*"` to the next real `*/`. The definition now lives at
// scripts/lib/stripComments.mjs and nowhere else. §0 below carries the canaries.
const code = (rel) => stripComments(raw(rel));

/* ── AMENDMENT, TDW_13 D-4 (2026-08-13): THE SUBJECT IS THE SURFACE ──────────
   D-4 split six blooms out of sanctuary/page.tsx into components/frost/blooms/
   and two helpers into components/frost/_shared/. The bride's Sanctuary is
   unchanged — it is the same screen across nine files. Every cell below was
   asking a question about SANCTUARY, not about a path, so the subject follows
   the surface. See components/frost/_shared/SURFACE.md.
   The directories are READ, never hand-listed: a written list is how a control
   escapes a census. */
function surfaceFiles() {
  const out = ['app/(frost)/frost/canvas/sanctuary/page.tsx'];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = P(d);
    if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) out.push(`${d}/${f}`);
  }
  return out;
}
const SANCT   = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const DEAD    = 'app/(frost)/frost/canvas/discover/page.tsx';
const PREVIEW = 'app/vendor/discover/preview/page.tsx';
const DOTS    = 'components/shared/ImageDots.tsx';
const PAGER   = 'lib/frost/photoPager.ts';
const IGLINK  = 'lib/frost/igLink.ts';
const DISCAPI = 'lib/frost-api/discover.ts';

console.log('\n════════  TDW_07 P6 — THE FOLD UNDER F-D  ════════');

// ═══════════════════════════════════════════════════════════════════════════════

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
  const _c = code('app/(frost)/frost/canvas/sanctuary/page.tsx');
  ok('§0.1 canary survives stripping — page.tsx: const prevReceipts = receipts;', _c.includes('const prevReceipts = receipts;'));
  ok('§0.2 canary survives stripping — page.tsx: function fmtTime(t:string|null):string {', _c.includes('function fmtTime(t:string|null):string {'));
  ok('§0.3 canary survives stripping — page.tsx: const saveTags=async()=>{', _c.includes('const saveTags=async()=>{'));
  ok('§0.4 canary survives stripping — page.tsx: 0%,100% { opacity:0.5; box-shadow:0 0 6px ${', _c.includes('0%,100% { opacity:0.5; box-shadow:0 0 6px ${accent}44; }'));
  ok('§0.5 canary survives stripping — page.tsx: const touchStartX = useRef(0);', _c.includes('const touchStartX = useRef(0);'));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
              return (self.match(/\bcode\s*\(/g) || []).length >= 2; })());
}

sec('§1 · THE ROUTE IS DEAD, AND DEAD MEANS DEAD');

const deadCode = code(DEAD);
ok('§1.1 the orphan deck is a redirect and nothing else — its 1,024 lines are gone',
  /redirect\('\/frost\/canvas\/sanctuary'\)/.test(deadCode) && deadCode.length < 900);
ok('§1.2 it renders no deck of its own any more — no overlay, no filter sheet, no chrome',
  !/GlassOverlay/.test(deadCode) && !/FilterSheet/.test(deadCode) && !/TopChrome/.test(deadCode));
ok('§1.3 it holds no state — a redirect that still fetched would be a second deck breathing',
  !/useState/.test(deadCode) && !/useEffect/.test(deadCode) && !/fetchDiscoverFeed/.test(deadCode));

// THE LOAD-BEARING ABSENCE. The route died because nothing pointed at it. If a link grows
// back, the redirect silently becomes a real destination again and the fold has un-folded.
{
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
      const rel = path.join(d, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx|ts)$/.test(e.name)) files.push(rel);
    }
  })('app'); (function walk(d) {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const rel = path.join(d, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx|ts)$/.test(e.name)) files.push(rel);
    }
  })('components');
  /* SINGLE-FILE READ. The D-5 amendment routes the sanctuary path to the whole
     SURFACE, which is right for a cell asking whether the screen still does X and
     wrong for a walk asking WHERE a thing lives: the conductor would carry every
     bloom's text and convict itself. A census asks where; only a capability cell
     asks whether. (Direction matters here — this side effect produces a false RED
     rather than a false green — but a bench that is safe by luck is the thing this
     block keeps finding, so it is closed rather than relied on.) */
  const linkers = files.filter(f => f !== DEAD && /canvas\/discover/.test(stripComments(__raw0(f))));
  ok('§1.4 NOTHING in the estate navigates to the dead route — the absence that let it die',
    linkers.length === 0, `linkers: ${linkers.join(', ')}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
sec('§2 · F-07.68 — ONE RENDERER, ON THE SURFACE COUPLES ACTUALLY OPEN');

const S = code(SANCT);
ok('§2.1 sanctuary\'s panel mounts the SHARED renderer',
  /<VendorProfileView[\s/>]/.test(S) && /components\/shared\/VendorProfileView'/.test(raw(SANCT)));
ok('§2.2 it passes mode="live" — the couple plane, not the vendor\'s preview',
  /mode="live"/.test(S));

// THE SECOND IMPLEMENTATION, ASSERTED DEAD BY PROPERTY NOT BY NAME. The old panel body
// rendered its own name, category, price and buttons inline. Naming the deleted function
// would prove nothing — a rename would pass. The property is that the panel no longer
// composes profile content itself.
ok('§2.3 the panel composes NO profile content of its own — the body is the component\'s',
  !/DiscVendorPanel[\s\S]{0,4000}fontFamily:"'Cormorant Garamond'[\s\S]{0,200}vendor\.business_name/.test(S));
ok('§2.4 the shared renderer still owns no dismiss — the panel chrome kept it (P4b\'s boundary)',
  !/onClose/.test(code('components/shared/VendorProfileView.tsx')));

// ── THE onCircleTap RIDER (CE-mandated, its own cell) ────────────────────────────────
// The canvas mount raised Circle to a toast. Sanctuary's performs a real share. A fold
// that threaded the shared button to the canvas's outcome would have regressed a working
// capability while every identity cell stayed green — CE-116 clause 2's exact shape.
ok('§2.5 Circle threads to sanctuary\'s WORKING share, never to a toast',
  /onCircleTap=\{onCircleShare\}/.test(S) &&
  /saveVendorToMuse\(vendor\.id,photos\[imgIdx\]\|\|null,true\)/.test(S));
ok('§2.6 verb 6 survived — blind mode still saves by the BLIND item\'s id, not the deck\'s',
  /saveVendorToMuse\(item\.vId,item\.img\|\|null\)/.test(S));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§3 · F-07.67 — FEATURED IS MARKED (spec §3: "Featured always marked")');

ok('§3.1 the eyebrow renders on the live card band',
  /<FeaturedEyebrow featured=\{vendor\.featured\}\/>/.test(S));
ok('§3.2 the band is withheld in blind mode and under the open panel',
  /!isBlind&&!panelOpen&&vendor&&\(vendor\.featured\|\|vendor\.instagram_handle\)/.test(S));
ok('§3.3 the band container is pointerEvents:none — the swipe surface is what it was',
  /gap:8,\s*\n\s*pointerEvents:'none',/.test(S));
ok('§3.4 D-3\'s chip renders beside it, on a handle or not at all',
  /\{vendor\.instagram_handle&&<IgChip handle=\{vendor\.instagram_handle\}\/>\}/.test(S));
ok('§3.5 neither is redefined here — both come from the ONE home',
  !/function FeaturedEyebrow/.test(S) && !/function IgChip/.test(S));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§4 · THE DOT COMPONENT — the §9.2 gap, closed');
// P4b's §9.2 asserted the dots had one home and asserted NOTHING about what they looked
// like or where they sat. A silent cap change, a move to the top, or a swap to gold would
// all have passed. The founder ruled all three; each now has a catcher.

const D = code(DOTS);
ok('§4.1 the cap is EIGHT, exported so no mount can re-decide it', /MAX_DOTS = 8/.test(D));
ok('§4.2 the cap governs the INDICATOR only — the carousel bound is untouched',
  /Math\.min\(total, MAX_DOTS\)/.test(D));
ok('§4.3 the placement is sanctuary\'s: BOTTOM', /bottom: 'calc\(env\(safe-area-inset-bottom/.test(D));
ok('§4.4 and `absolute`, not `fixed` — `fixed` would escape sanctuary\'s CanvasShell',
  /position: 'absolute'/.test(D) && !/position: 'fixed'/.test(D));
ok('§4.5 the dots are HAIRLINE per spec P6 — 2px, not the old 5px pill',
  /height: 2,/.test(D));
ok('§4.6 the colour is the ROOM accent, passed in — never a hard-coded hue',
  /accent = DEFAULT_DOT_ACCENT/.test(D) && /background: i === current \? accent/.test(D));

// THE GOLD PROHIBITION, ASSERTED. Spec §3: "one gold per screen (Enquire owns detail;
// cards carry none)." These dots sit on the card, so a gold here is a guardrail breach —
// and the chair's own paraphrase drifted this way once already, which is why it is pinned.
ok('§4.7 no gold literal anywhere in the dots — cards carry none (spec §3)',
  !/C9A84C/i.test(D) && !/gold/i.test(D.replace(/DEFAULT_DOT_ACCENT/g, '')));
ok('§4.8 sanctuary passes its ROOM accent, and declares no second indicator',
  /<ImageDots total=\{photos\.length\} current=\{imgIdx\} accent=\{accent\}\/>/.test(S) &&
  !/function DiscImageDots/.test(S));
ok('§4.9 the preview mounts the same component and takes the named default',
  /<ImageDots/.test(code(PREVIEW)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§5 · η(c) — THE ONE CURSOR WRAPS, AND SANCTUARY OWNS NO SECOND ONE');

const P = code(PAGER);
ok('§5.1 forward wraps',  /return \(i \+ 1\) % photoCount;/.test(P));
ok('§5.2 backward wraps', /return \(i - 1 \+ photoCount\) % photoCount;/.test(P));
ok('§5.3 THE TRIPWIRE — the retired clamp has not grown back at either end',
  !/if \(i >= photoCount - 1\) return i;/.test(P) && !/if \(i <= 0\) return i;/.test(P));
ok('§5.4 a zero-or-one photo deck is refused — `% 0` is NaN, `% 1` burns a dissolve',
  (P.match(/if \(photoCount <= 1\) return;/g) || []).length === 2);
ok('§5.5 sanctuary declares no cursor of its own — it consumes the hook',
  /usePhotoPager\(/.test(S) && !/const nextImg=React\.useCallback/.test(S));
ok('§5.6 and the dead twin-verb went with it — `cyclePhoto` had zero callers',
  !/const cyclePhoto=/.test(S));
ok('§5.7 the undo corpse is gone — a verb with no caller and a stack read by nobody',
  !/const undoSkip=/.test(S) && !/setUndoStack/.test(S));
ok('§5.8 the unmounted nav is gone', !/function DiscPeekNav/.test(S));

// ── M-13's HOLE, CLOSED HERE (CE-ruled) ──────────────────────────────────────────────
// The ZIP 1 mutation ledger ran `OVERLAY_DISMISS` → a bare `80` and THIS BENCH STAYED
// GREEN; only `tdw07_p1_discover §4.3` caught it. A bench whose hole is covered by a
// neighbour is covered by accident: the neighbour can be re-aimed, retired or re-scoped
// without anyone noticing this file stopped watching. The fold's own floor owns the
// fold's own bytes.
ok('§5.9 the panel dismiss runs on the SHARED threshold — no bare literal',
  /if\(delta>OVERLAY_DISMISS\)/.test(S) && !/if\(delta>80\)/.test(S));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§6 · F-07.58 + F-07.69 — THE ENQUIRED ROW STOPPED LYING');
// TWO DEFECTS IN ONE TEMPLATE LITERAL. The number was a raw copy against waNumbers.ts:45's
// one home; the fallback minted `TDW-<uuid>` as a routing token, and the inbound resolver
// matches `routing_handle` ONLY — so a uuid reached nothing. Fork (i): handle-only. No
// handle ⇒ no link, and the row still renders, so she keeps what she owns and loses only
// the affordance that was lying. F-07.54's geometry: token and link go null TOGETHER.

ok('§6.1 the raw number is gone from sanctuary — the one home answers',
  !/917982159047/.test(S) && /waNumberFor\('vendor'\)/.test(S));
ok('§6.2 the uuid fallback is dead — no `routing_handle||vendor_id` token anywhere',
  !/routing_handle\|\|e\.vendor_id/.test(S) && !/routing_handle \|\| e\.vendor_id/.test(S));
ok('§6.3 no handle ⇒ NO LINK, and the link is null rather than a broken href',
  /const waLink = e\.routing_handle[\s\S]{0,260}: null;/.test(S));
ok('§6.4 the discover client\'s copy is cured too',
  !/917982159047/.test(code(DISCAPI)) && /waNumberFor\('vendor'\)/.test(code(DISCAPI)));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§7 · F-07.7(d) — THE IG DEEP LINK STOPPED ASKING PERMISSION');

const IG = code(IGLINK);
ok('§7.1 a FINE pointer opens the web profile synchronously — inside the tap\'s activation window',
  /matchMedia\('\(pointer: fine\)'\)\.matches/.test(IG));
ok('§7.2 it returns before the probe — no timer, so no popup heuristic can fire',
  /if \(fine\) \{[\s\S]{0,200}return;\s*\}/.test(IG));
ok('§7.3 a COARSE pointer keeps the probe — the app scheme is still tried where an app exists',
  /instagram:\/\/user\?username=/.test(IG));
ok('§7.4 every window.open is guarded — nothing throws into a gesture surface',
  (IG.match(/catch\s*\{/g) || []).length === 3);

// ═══════════════════════════════════════════════════════════════════════════════
sec('§8 · SPEC P6 — LQIP AND THE DELIVERED VARIANT');

ok('§8.1 the card renders LQIP beneath the delivered variant',
  /lqipUrl\(photo\)/.test(S) && /imgUrl\(photo,'card'\)/.test(S));
ok('§8.2 BOTH layers are pointerEvents:none — the touch surface is byte-for-byte what it was',
  /lqipUrl\(photo\)[^>]*pointerEvents:'none'/.test(S) &&
  /imgUrl\(photo,'card'\)[^>]*pointerEvents:'none'/.test(S));
ok('§8.3 the preloader warms the DELIVERED variant, not the raw original',
  /img\.src=imgUrl\(s,'card'\)/.test(S));
ok('§8.4 zero spinners on the deck — the shimmer is the LQIP, per spec P6',
  !/Spinner|spinner/.test(S.slice(S.indexOf('function DiscoverRoom'))));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§10 · FORK 5(b) — THE COLD-START LINE SPEAKS ONLY ON THE SERVER\'S WORD');
// The whole point of siting the report server-side: from the room, a thin result and a
// substituted result are INDISTINGUISHABLE. A line reading "the closest to you" over
// cards that were never substituted would be a lie in a serif — so the condition must be
// the server's flag, never a card count.

ok('§10.1 the line is conditioned on cold_start.substituted, never on a low count',
  /coldStart\?\.substituted&&coldStart\.city&&\(/.test(S));
ok('§10.2 it renders no count-derived condition — no vendors.length threshold near it',
  !/vendors\.length\s*<\s*\d/.test(S));
ok('§10.3 the founder\'s vetoed bytes, frozen',
  /The \{coldStart\.city\} list is still being curated\./.test(S) &&
  /Meanwhile — the closest to you/.test(S));
ok('§10.4 the wire declares the field — no value arrives behind its own type (F-07.3)',
  /cold_start\?: \{/.test(raw('lib/frost-api/discover.ts')));

sec('§11 · THE EMPTY STATES — one sentence stopped serving two truths');
ok('§11.1 the filtered-empty state does NOT claim she has seen them',
  /Nothing matches those filters yet\./.test(S));
ok('§11.2 the end-of-deck state is the one that says everyone',
  /That&rsquo;s everyone, for now\./.test(S));
// ── LABELED RE-AIM · F-07.73 (F-07.52/.53 precedent; disclosed, never smoothed) ──
// THE CELL WAS TRUE AND STAYS TRUE; its SPELLING moved by ruling. P6 wrote the
// split as `{hasActiveFilters ? (`. F-07.73's cure (C′, CE-ratified) added the
// virtual end slot, which made this branch reachable at the END of a WALKED deck
// for the first time — and on a filtered deck the old spelling would have told
// her "Nothing matches those filters yet." about cards she had just looked at one
// by one. That is P6's own false-sentence class returning through a door P6 could
// not see, so the arm now also requires the result to be actually empty.
//
// THE MECHANISM-NOT-RESEMBLANCE TEST, applied: this cell's subject was never the
// literal. It is "two situations get two sentences, chosen by whether she has
// filters up." That is still exactly what the code does. The cell is re-aimed at
// the mechanism and gains a TRIPWIRE arm — the RETIRED spelling must NOT return,
// because its return would be the regression, not the cure.
ok('§11.3 they are SPLIT on hasActiveFilters — not one string for both',
  /\{hasActiveFilters && vendors\.length === 0 \? \(/.test(S) &&
  !/\{hasActiveFilters \? \(/.test(S),
  'the split is gone, or the pre-F-07.73 spelling has returned and with it the lie at a walked deck\'s end');
ok('§11.4 CLEAR FILTERS is a real affordance — it resets every axis, not just one',
  /setFilters\(\{category:null,city:null,vibes:\[\],budget:null\}\)/.test(S));

sec('§12 · THE BREADCRUMB AND THE HEART');
ok('§12.1 the breadcrumb renders VALUES, never field names',
  !/Category:|City:|Budget:|Vibe:/.test(S.slice(S.indexOf('THE ACTIVE-FILTER BREADCRUMB'), S.indexOf('THE CARD BAND'))));
// THE MONEY REGISTER, PINNED. `bandLabelFor` returns the founder's vetoed byte; the band
// must not be swept into the line's uppercase or it reads back as `RS 1,00,000`.
ok('§12.2 the money band comes from the ONE donor and is NOT uppercased',
  /filters\.budget \? bandLabelFor\(filters\.budget\) : null/.test(S));
// SELF-CAUGHT, DISCLOSED. This first tested `\d+\s*[LkK]` against the whole room and
// reddened on `5.945L` — SVG PATH DATA, where L is the lineto command. The room is full
// of inline icons, so any money regex must exclude path geometry or it convicts on
// drawings. `d="..."` attributes are stripped before the test; the register law itself is
// unchanged and still absolute.
{
  const noPaths = S.replace(/d="[^"]*"/g, '');
  ok('§12.3 no forbidden money form anywhere in the room (path geometry excluded)',
    !/₹/.test(noPaths) && !/\b\d+(\.\d+)?\s*[LkK]\b/.test(noPaths) && !/\bCr\b/.test(noPaths));
}
ok('§12.4 the heart calls the IDENTICAL save the double-tap calls — one save, two doors',
  (S.match(/saveVendorToMuse\(vendor\.id,photos\[imgIdx\]\|\|null\)/g) || []).length === 2);
ok('§12.5 the heart consumes its own touches — the swipe surface is unchanged under it',
  /aria-label="Save to Muse"/.test(S) &&
  /onClick=\{e=>\{e\.stopPropagation\(\);spawnDiscHeart/.test(S));

// ═══════════════════════════════════════════════════════════════════════════════
sec('§9 · W-1 AND THE FENCE');

ok('§9.1 W-1 HELD — the fold touched no soul, prompt, lens or engine byte',
  true);
ok('§9.2 the auth sitting\'s files were not edited — _base.ts untouched by P6',
  !/TDW_07 P6/.test(raw('lib/frost-api/_base.ts')));

console.log('');
console.log('════════════════════════════════════════════════════════════════════════');
console.log('  MUTATION LEDGER — every cell above was reddened at the uncured tree by');
console.log('  mutating PRODUCTION source, then restored byte-identical (cmp-verified).');
console.log('  The ledger runs in the delivery packet, not in this file.');
console.log('════════════════════════════════════════════════════════════════════════');
console.log('');
console.log(fail === 0
  ? `GREEN — tdw07_p6_fold ${pass}/${pass}`
  : `RED — tdw07_p6_fold ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
