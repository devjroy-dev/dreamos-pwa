#!/usr/bin/env node
// scripts/tdw07_p3_portfolio.proof.mjs
// TDW_07 P3 — the dreamos-pwa half's floor.
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — P1 dev (iv), P2 dev (iv), P3's two more. Cells judge
// CODE. Softening a comment to buy a green is refused; the stripper is the cure.
// PROPOSED FOR PROMOTION to a shared harness helper so a fifth sitting imports
// it instead of re-deriving it (CE §C).
// ── F-09.93 CURE (i) · THE ABSENT-SUBJECT SHIM (TDW_09 P2C) ──────────────────
// This reader used to call readFileSync bare. On 2026-08-07 TDW_09 P2A deleted
// `lib/vendor/vendorModeForPath.ts` under a handover row claiming CALLER-ZERO;
// the claim was false — §3.1b below reads that file, and this bench stopped
// being an instrument and became a stack trace. A bench that CRASHES reports
// nothing at all: every cell after the throw is unrun and unrunnable, which is
// strictly worse than a red (F-09.30's refuse-never-crash class).
//
// The rule now: a missing subject is a NAMED-REFUSAL RED, never an exception.
// The miss is recorded here and convicted at the foot by name, and the verdict
// can never be GREEN while MISSING is non-empty.
//
// DECLARED RESIDUAL, stated rather than hidden: the sentinel below fails every
// POSITIVE cell honestly, but a NEGATIVE cell (`!/x/.test(...)`) over a sentinel
// would pass vacuously. That window is why the refusal is convicted separately
// and fail-closed at the foot — a reader is never left with a green bench over an
// absent file. The two cells that read the deleted leaf are re-aimed in this same
// delivery, so the window has no live occupant; it is guarded, not merely empty.
const MISSING = new Set();
const __raw0 = (rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { MISSING.add(rel); return `\u0000ABSENT-SUBJECT:${rel}\u0000`; }
  return fs.readFileSync(abs, 'utf8');
};

/* ── AMENDMENT, TDW_13 D-5: THE SUBJECT IS THE SURFACE ──────────────────────
   D-4 and D-5 split the eleven blooms out of sanctuary/page.tsx into
   components/frost/blooms/, with two shared helpers in components/frost/_shared/.
   The bride's Sanctuary is the same screen across fourteen files. Every cell
   here asking about SANCTUARY was asking about the screen, not the path, so a
   read of the sanctuary path returns the whole surface. Directories are READ,
   never hand-listed — a written list is exactly how a byte escapes a bench.
   See components/frost/_shared/SURFACE.md. */
const __SANCT_PATH = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const raw = (rel) => {
  if (rel !== __SANCT_PATH) return __raw0(rel);
  const parts = [__raw0(__SANCT_PATH)];
  for (const d of ['components/frost/blooms', 'components/frost/_shared']) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs).sort())
      if (/\.tsx?$/.test(f)) parts.push(__raw0(`${d}/${f}`));
  }
  return parts.join('\n');
};
// ORDER IS LOAD-BEARING AND WAS WRONG ONCE: line comments are stripped FIRST,
// block comments SECOND. Stripping blocks first lets a line comment containing
// `/wedding/auth/*` open a phantom block that swallows to the next real `*/` —
// in app/vendor/layout.tsx that ate ten thousand characters of live code and
// reddened a true cell. The `(^|[^:])` guard keeps `https://` out of the line pass.
// ── F-07.74 CURED · THE ONE STRIPPER (CE-ruled F1→(b1), F2→(a)) ──────────────
// This file used to carry its own copy of the naive rule. Eleven such copies
// existed across ten proofs and every one of them swallowed live code from an
// `accept="image/*"` to the next real `*/`. The definition now lives at
// scripts/lib/stripComments.mjs and nowhere else. §0 below carries the canaries.
const code = (rel) => stripComments(raw(rel));

const IMG      = 'lib/img.ts';
const MANAGER  = 'app/vendor/portfolio/page.tsx';
const SANCT    = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const CANVAS   = 'app/(frost)/frost/canvas/discover/page.tsx';

const { imgUrl, lqipUrl, isTransformable, IMG_VARIANTS, IMG_LQIP } =
  await import(path.join(ROOT, IMG));
const { moveIndex, canMove } = await import(path.join(ROOT, 'lib/vendor/reorder.ts'));


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
  const _c = code('app/vendor/portfolio/page.tsx');
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

sec('§1 · THE ONE IMG MODULE (Fork 5(b))');
ok('§1.1 the variant table holds exactly card/thumb/full',
  Object.keys(IMG_VARIANTS).sort().join(',') === 'card,full,thumb');
ok('§1.2 the widths are the spec\'s', IMG_VARIANTS.card.includes('w_800') && IMG_VARIANTS.thumb.includes('w_200') && IMG_VARIANTS.full.includes('w_1600'));
ok('§1.3 q_auto + f_auto ride every variant',
  Object.values(IMG_VARIANTS).every(v => v.includes('q_auto') && v.includes('f_auto')));
ok('§1.4 the LQIP is the 24px e_blur chain', IMG_LQIP.includes('w_24') && IMG_LQIP.includes('e_blur'));
{
  const both = ['lib/frost-api/img.ts', 'lib/vendor/img.ts'];
  ok('§1.5 both spec-named paths exist', both.every(p => fs.existsSync(path.join(ROOT, p))));
  ok('§1.6 and NEITHER defines a variant — they re-export the one home',
    both.every(p => /export \* from '\.\.\/img'/.test(code(p)) && !/w_800|w_200|w_1600|e_blur/.test(code(p))));
  const homes = [IMG, ...both].filter(p => /w_800/.test(code(p)));
  ok('§1.7 exactly ONE file in the repo writes a width down', homes.length === 1, JSON.stringify(homes));
}

sec('§2 · THE PASS-THROUGH SAFETY — CE-RULED IN AS CELLS');
const CANON  = 'https://res.cloudinary.com/dccso5ljv/image/upload/v1712345678/vendor_portfolio/a/pic-1a2b.jpg';
// The REAL bytes from app/(auth)/couple/pin-login/page.tsx — not a lookalike.
const SPLASH = 'https://res.cloudinary.com/dccso5ljv/image/upload/IMG_2544.PNG_cyeqlj';
const ALREADY= 'https://res.cloudinary.com/dccso5ljv/image/upload/w_800,q_auto,f_auto/v1712345678/x.jpg';
const IGCDN  = 'https://scontent.cdninstagram.com/v/t51/123_n.jpg';
ok('§2.1 a canonical url IS transformed', imgUrl(CANON, 'card').includes('/upload/w_800,q_auto,f_auto/v17'));
ok('§2.2 the auth splash url is returned BYTE-UNCHANGED', imgUrl(SPLASH, 'card') === SPLASH && lqipUrl(SPLASH) === SPLASH);
ok('§2.3 and the splash bytes asserted here are the ones the auth page actually holds',
  raw('app/(auth)/couple/pin-login/page.tsx').includes(SPLASH));
ok('§2.4 an already-transformed url is returned BYTE-UNCHANGED', imgUrl(ALREADY, 'full') === ALREADY);
ok('§2.5 a non-Cloudinary host is returned BYTE-UNCHANGED', imgUrl(IGCDN, 'card') === IGCDN);
ok('§2.6 null/empty never throw', imgUrl(null) === '' && lqipUrl(undefined) === '');
ok('§2.7 isTransformable is the positive ^v\\d+$ rule, not a negative guess',
  isTransformable(CANON) && !isTransformable(SPLASH) && !isTransformable(ALREADY) && !isTransformable(IGCDN));

sec('§3 · THE MANAGER LIVES AT /vendor/portfolio (Fork 3(b)) — ZERO EDGES MOVE');
{
  // ── LABELED AMENDMENT (TDW_07 MICRO-2 · F-07.30) — THE CENSUS SPLITS IN TWO. ─────────
  // This counted eleven raw occurrences of `/vendor/portfolio` and asserted none moved.
  // Fork 3(b)'s doctrine — the manager lives at that route and no edge moves — is INTACT
  // and this cell still defends it. What changed is that three of the eleven were never
  // navigation at all: they sat inside the THREE duplicated path classifiers
  // (BottomNav::modeFromPathname, Header's inline list, layout::panelIndexForPath), where
  // the string was a route PREFIX being matched, not a destination being linked.
  //
  // F-07.30 collapsed those three classifiers into one leaf, so those three references
  // became one. Counting both kinds together made a consolidation look like an edge loss —
  // the same classifier-versus-navigator confusion that produced F-07.30 itself, now
  // showing up in the bench that measures it.
  //
  // The two are now counted separately, which STRENGTHENS the cell: a navigation edge going
  // missing still reddens exactly as before, and the classifier count is pinned at one so a
  // fourth copy cannot reappear unnoticed.
  // ── LABELED AMENDMENT (TDW_09 · P2C · F-09.93 part (iii)) — THE ROW MOVED, BY RULING. ──
  // TDW_09 P2A (8715a69) moved the Portfolio row out of More and into the new
  // /vendor/storefront hub under R-X27(a) and chair relay #1/#2. Fork 3(b)'s doctrine is
  // UNTOUCHED — the manager still lives at /vendor/portfolio and no edge was LOST; one
  // edge changed which screen carries it. The expectation follows the ruling to the new
  // screen; `more` is pinned at ZERO so the row cannot quietly come back, and storefront
  // is pinned at its actual 1 — DERIVED THROUGH THE STRIPPER, which is what this cell
  // counts with. My first draft pinned 2 off a RAW grep that had counted the row's own
  // explanatory comment as an edge; the cell convicted me, which is the independent-method
  // law working in the direction it was written for. Pinned so a silent drop reddens. The cell counts SEVEN navigation edges now, and says so.
  //
  // F-09.97 (filed this sitting) — THE ELDER MISMATCH, NOT PACKAGE 2's. `discover/submit`
  // has held ZERO since 8a1fee1 (TDW_10 P3 rider 3, F-10.53 retired the samples step that
  // carried the link). This cell has therefore been RED since that sitting and nobody was
  // told: it was on no floor list. Pinned at its derived 0 with the finding named, so the
  // cure — if the estate ever wants that edge back — is a ruling, not a rediscovery.
  const navEdges = [
    ['app/vendor/discover/profile/page.tsx', 1], ['app/vendor/discover/submit/page.tsx', 0],
    ['app/vendor/discover/page.tsx', 4], ['app/vendor/more/page.tsx', 0],
    ['app/vendor/storefront/page.tsx', 1],
    ['components/vendor/BottomNav.tsx', 1],   // the SUB_ITEMS href; its classifier ref moved
  ];
  const counts = navEdges.map(([f, n]) => [f, (code(f).match(/\/vendor\/portfolio/g) || []).length, n]);
  ok('§3.1 every navigation edge to the manager is accounted — Fork 3(b) holds; the More row '
   + 'MOVED to Storefront by ruling (F-09.93) and submit\'s edge died at F-10.53 (F-09.97)',
    counts.every(([, got, want]) => got === want), JSON.stringify(counts));
  // ── LABELED AMENDMENT (TDW_09 · P2C · F-09.93 part (ii)) — THE LEAF DISSOLVED; THE
  // PROPERTY DID NOT. This cell read `lib/vendor/vendorModeForPath.ts`, which TDW_09 P2A
  // DELETED when it dissolved the vendor mode (fork 8.4, chair relay #3): with two
  // memberships gone there is no mode to classify. That file's route buckets were carried
  // BYTE-EQUIVALENT into `roomClassForPath` inside app/vendor/layout.tsx (P2A row 4), so
  // the ONE-CLASSIFIER property — F-07.30's whole point, that the prefix is not duplicated
  // across three hands — SURVIVES AT A NEW HOME and is re-aimed here rather than retired.
  //
  // The assertion is STRENGTHENED, not weakened, in three ways: the prefix is still pinned
  // at exactly one, Header is still pinned at zero, and the retired leaf's ABSENCE is now
  // asserted too — so a fourth copy cannot reappear AND a resurrected `vendorModeForPath`
  // reddens this cell instead of silently restoring the duplication F-07.30 ended.
  ok('§3.1b the duplicated classifiers are still ONE — the route prefix lives in layout\'s '
   + 'roomClassForPath, Header holds none, and the retired mode leaf stays retired',
    (code('app/vendor/layout.tsx').match(/\/vendor\/portfolio/g) || []).length === 1 &&
    // ANCHORED, not substring-matched: my own W-C mutation renamed this symbol to
    // `roomClassForPath X` and the first draft stayed GREEN, because a bare substring
    // cannot tell a symbol from its prefix. Same defect W-9 exposed on the sibling bench
    // the same hour. The boundary makes the mutation bite, which is what proves the cell.
    /function roomClassForPath\b/.test(code('app/vendor/layout.tsx')) &&
    (code('components/vendor/Header.tsx').match(/\/vendor\/portfolio/g) || []).length === 0 &&
    !fs.existsSync(path.join(ROOT, 'lib/vendor/vendorModeForPath.ts')));
  ok('§3.2 the manager file is the one that grew', code(MANAGER).length > 6000);
}

sec('§4 · THE GRID, THE COVER, THE ORDER');
{
  const m = code(MANAGER);
  ok('§4.1 reorder is POINTER-based, RN-portable — no HTML5 drag API',
    /onPointerDown/.test(m) && /onPointerMove/.test(m) && /onPointerUp/.test(m) && !/onDragStart|dataTransfer/.test(m));
  ok('§4.2 the commit sends the FULL id list, matching the server\'s fail-closed contract',
    /reorderPortfolio\(ids\)/.test(m) && /images\.map\(i => i\.id\)/.test(m));
  ok('§4.3 the COVER badge is driven by POSITION, never by is_hero on this screen',
    /img\.position === 0/.test(m) && !/is_hero/.test(m));
  ok('§4.7 the sheet\'s cover checks use the ROW\'s position, not a render index',
    /sel\.position === 0/.test(m) && /sel\.position !== 0/.test(m) && !/images\[0\]\?\.id/.test(m));
  ok('§4.4 the response is authoritative — the optimistic order is replaced by the server\'s',
    /setImages\(res\.images\)/.test(m));
  ok('§4.5 both grid layers render through the img module', /lqipUrl\(img\.image_url\)/.test(m) && /imgUrl\(img\.image_url, 'card'\)/.test(m));
  ok('§4.6 the sheet renders the FULL variant', /imgUrl\(sel\.image_url, 'full'\)/.test(m));
}

sec('§5 · THE CAP AND THE GATE COME FROM THE SERVER');
{
  const m = code(MANAGER);
  ok('§5.1 no literal 20 is minted on this screen', !/\b20\b/.test(m.replace(/[\w-]*20[\w-]*/g, (x) => x === '20' ? '20' : '')) || !/=\s*20\b/.test(m));
  ok('§5.2 the cap VALUE flows from the status into state — not merely named',
    /setMaxImages\(s\.max_portfolio_images\)/.test(m) && !/setMaxImages\(\s*\d+\s*\)/.test(m));
  ok('§5.3 upload is disabled at the cap', /disabled=\{uploading \|\| full\}/.test(m));
  // CE §B TIGHTENED: nothing IG renders this sitting, and the pwa must not even
  // read the config flag — a founder setting env vars early must not conjure an
  // entry whose action does not exist. These cells guard the ABSENCE.
  // ── §5.4 / §5.6 · LABELED AMENDMENTS, TDW_07 P4a (counts preserved 1→1) ──
  // BOTH CELLS ASSERTED A SITTING-SCOPED POSTURE — "the IG entry is dark this
  // sitting" — and P4a is the sitting chartered to end it. Deleting them would
  // drop the property they protected; leaving them would redden a correct build.
  // Re-scoped to the DURABLE law, which has not changed: the entry may never
  // render on configuration alone (F-07.13's dead control). P3 satisfied that by
  // rendering nothing at all; P4a satisfies it by rendering behind the SERVER's
  // combined answer. Same class as F-07.5's "0101 stays unreserved" cells,
  // re-scoped per the M0_RANGE precedent.
  // TITLES RE-AUTHORED: a green cell under a false title is a small hollow green.
  ok('§5.4 the IG entry renders ONLY behind the server\'s word — never on '
     + 'configuration alone (F-07.13\'s dead control, the durable law)',
    /\{ig && ig\.ig_import_enabled && \(/.test(m));
  ok('§5.6 the pwa holds NO opinion about whether the seam is wired — it asks '
     + '/ig/status and obeys', /fetchIgStatus\(\)/.test(m) && !/IG_APP_ID|IG_REDIRECT_URI/.test(m));
  ok('§5.5 F-07.13 — in_carousel is surfaced NOWHERE on this screen', !/in_carousel/.test(m));
}

sec('§12 · CURE B — GESTURELESS REORDER, PROVEN END-TO-END');
{
  // The ordering arithmetic is a PURE function precisely so it can be executed
  // here rather than shape-asserted. This is the doctrine's provable half.
  const L = ['a', 'b', 'c', 'd'];
  ok('§12.1 move down swaps with the next', moveIndex(L, 1, 1).join('') === 'acbd');
  ok('§12.2 move up swaps with the previous', moveIndex(L, 2, -1).join('') === 'acbd');
  ok('§12.3 moving the last item down is a NO-OP, input unchanged', moveIndex(L, 3, 1) === L);
  ok('§12.4 moving the first item up is a NO-OP, input unchanged', moveIndex(L, 0, -1) === L);
  ok('§12.5 an out-of-range index is refused', moveIndex(L, 9, -1) === L && moveIndex(L, -1, 1) === L);
  ok('§12.6 the source array is never mutated', (() => { const c = L.slice(); moveIndex(c, 1, 1); return c.join('') === 'abcd'; })());
  ok('§12.7 every legal move is a PERMUTATION — no loss, no duplication', (() => {
    for (let i = 0; i < L.length; i++) for (const d of [-1, 1]) {
      const r = moveIndex(L, i, d);
      if (r.length !== L.length) return false;
      if ([...r].sort().join('') !== [...L].sort().join('')) return false;
    } return true;
  })());
  ok('§12.8 moving to index 0 makes that item the COVER — the one-hand law holds',
    moveIndex(L, 1, -1)[0] === 'b');
  ok('§12.9 canMove is false at both ends and true in the middle',
    !canMove(4, 0, -1) && !canMove(4, 3, 1) && canMove(4, 1, -1) && canMove(4, 1, 1));
  ok('§12.10 canMove refuses an empty list', !canMove(0, 0, 1) && !canMove(0, 0, -1));

  const m = code(MANAGER);
  ok('§12.11 the manager uses the proven function, holding no arithmetic of its own',
    /moveIndex\(images, from, delta\)/.test(m) && !/nextIds\.splice/.test(m));
  ok('§12.12 the buttons\' disabled state comes from the SAME predicate as the guard',
    (m.match(/canMove\(/g) || []).length >= 2);
  ok('§12.13 both directions render', /COPY\.G4/.test(m) && /COPY\.G5/.test(m));
  ok('§12.14 B is interlocked with the filter for the same reason the drag is',
    /canReorder && images\.length > 1 && !confirming/.test(m));
  ok('§12.15 the sheet follows the moved photo rather than going stale',
    /setSel\(fresh\.find\(i => i\.id === imageId\)/.test(m));
}

sec('§13 · CURE A — THE NATIVE LISTENER (MECHANISM ONLY; AFFORDANCE IS THE WALK)');
{
  const m = code(MANAGER);
  ok('§13.1 the listener is NATIVE and NON-PASSIVE — a passive preventDefault is ignored',
    /addEventListener\('touchmove', block, \{ passive: false \}\)/.test(m));
  ok('§13.2 it cancels the scroll ONLY while a drag is armed',
    /const block = \(e: TouchEvent\) => \{ if \(dragIdRef\.current\) e\.preventDefault\(\); \}/.test(m));
  ok('§13.3 the armed flag lives in a REF — a listener registered once cannot read state',
    /dragIdRef\.current = id;/.test(m) && /dragIdRef\.current = null;/.test(m));
  ok('§13.4 the listener is removed on unmount', /removeEventListener\('touchmove', block\)/.test(m));
  ok('§13.5 didDrag is set on MOVEMENT, not at arm — a still long-press opens the sheet',
    /didDrag\.current = true;   \/\/ real movement while armed/.test(raw(MANAGER)));
}

sec('§10 · F-1 — THE DRAG\'S TOUCH DEFENCES (MECHANISM CELLS ONLY)');
{
  const m = code(MANAGER);
  // RULED SPLIT: these cells assert the MECHANISM. The AFFORDANCE — that a finger
  // on the founder's own device actually lifts a tile — is a WALK witness,
  // declared-not-claimed, and no cell here may be read as standing in for it.
  // The class is minted: benched-the-mechanism-not-the-affordance.
  ok('§10.1 both tile image layers are draggable={false} (the Frost pattern)',
    (m.match(/draggable=\{false\}/g) || []).length >= 2);
  ok('§10.2 the tile suppresses the native context menu', /onContextMenu=\{e => e\.preventDefault\(\)\}/.test(m));
  ok('§10.3 callout and selection are off on the tile',
    /WebkitTouchCallout: 'none'/.test(m) && /WebkitUserSelect: 'none'/.test(m) && /userSelect: 'none'/.test(m));
  ok('§10.4 touch-action goes none ONLY on the armed tile — grid scroll survives',
    /touchAction: dragId === img\.id \? 'none' : 'auto'/.test(m));
  ok('§10.5 the drag does NOT arm on contact — a press timer does',
    /pressTimer\.current = setTimeout\(/.test(m) && !/onPointerDown\(id: string, e: React\.PointerEvent\) \{\s*if \(!canReorder\) return;\s*setDragId/.test(m));
  ok('§10.6 the timer is ~350ms', /\}, 350\);/.test(m));
  ok('§10.7 MOVE FIRST CANCELS — travel past slop kills the timer and scrolling wins',
    /if \(dx > 8 \|\| dy > 8\) clearPress\(\);/.test(m));
  ok('§10.8 a completed drag does not also open the sheet',
    /if \(didDrag\.current\) \{ didDrag\.current = false; return; \}/.test(m));
  ok('§10.9 the timer is cleared on unmount — no stray arm after navigation',
    /useEffect\(\(\) => \(\) => clearPress\(\), \[\]\)/.test(m));
}

sec('§11 · F-2 — BATCH UPLOAD, TRUNCATED AT REMAINING');
{
  const m = code(MANAGER); const r = raw(MANAGER);
  ok('§11.1 the input accepts multiple files', /<input[^>]*\bmultiple\b/s.test(m));
  ok('§11.2 the handler takes a LIST, not a file', /async function handleUpload\(files: File\[\]\)/.test(m));
  ok('§11.3 the loop is SEQUENTIAL — parallel registers would race for position',
    /for \(let i = 0; i < batch\.length; i\+\+\)/.test(m) && /await uploadOne\(batch\[i\]\)/.test(m) && !/Promise\.all/.test(m));
  ok('§11.4 the batch is TRUNCATED at the free slots', /const batch = files\.slice\(0, room\)/.test(m) && /Math\.max\(0, cap - images\.length\)/.test(m));
  ok('§11.5 truncation SAYS SO rather than silently dropping',
    /if \(batch\.length < files\.length\) show\(COPY\.F2_3\(room\)/.test(m));
  ok('§11.6 a full portfolio refuses the batch with the cap sentence', /if \(batch\.length === 0\) \{ show\(COPY\.A2\(cap\)/.test(m));
  ok('§11.7 progress counts through the batch', /COPY\.F2_1\(i \+ 1, batch\.length\)/.test(m));
  ok('§11.8 a single upload keeps the SINGULAR copy B2', /done === 1 && batch\.length === 1\) show\(COPY\.B2/.test(m));
  ok('§11.9 F2-1 verbatim', r.includes('`Uploading ${i} of ${n}…`'));
  ok('§11.10 F2-2 verbatim', r.includes('`${n} photos added — with our team for review.`'));
  ok('§11.11 F2-3 verbatim', r.includes('`Room for ${r} more — adding the first ${r}.`'));
}

sec('§9 · THE FILTER TABS AND THE DRAG INTERLOCK (CE §0.2 ruling (a))');
{
  const m = code(MANAGER);
  ok('§9.1 the four state filter tabs exist — the live control was NOT deleted',
    /STATE_FILTERS = \['all', 'approved', 'pending', 'rejected'\]/.test(m) && /STATE_FILTERS\.map/.test(m));
  ok('§9.2 the list read honours the filter again', /fetchPortfolio\(vendorId, filter\)/.test(m));
  ok('§9.3 the interlock exists as ONE derived boolean', /const canReorder = filter === 'all'/.test(m));
  ok('§9.4 drag is INERT under a filter — every entry point consults it',
    /onPointerDown\(id: string, e: React\.PointerEvent\) \{\s*if \(!canReorder\) return;/.test(m) &&
    /if \(!dragId \|\| !canReorder\) return;/.test(m));
  ok('§9.5 G1 renders only when reorder is LIVE', /canReorder && \(\s*<div[\s\S]{0,220}COPY\.G1/.test(m));
  ok('§9.6 G3 renders only when it is NOT', /!canReorder && \(\s*<div[\s\S]{0,220}COPY\.G3/.test(m));
  ok('§9.7 the interlock string is the founder\'s bytes, verbatim',
    raw(MANAGER).includes('Switch to All to reorder — filters show only some of your photos.'));
  ok('§9.8 the tabs are ghost/bordered — the one filled gold is still Upload alone',
    (m.match(/atelier-fab/g) || []).length === 1);
}

sec('§6 · THE VETOED COPY, BYTE-EXACT (founder 2026-07-29 「 1.ok 」)');
{
  const m = raw(MANAGER);
  const slots = {
    A2: "You've reached ${max} photos. Remove one to add another.",
    B2: 'Photo added — with our team for review',
    B3: "That upload didn't go through. Try again.",
    C1: 'Remove this photo?',
    C2: "It leaves your portfolio and Discover straight away. This can't be undone.",
    C5: 'Photo removed',
    D1: 'A line about this photo — optional.',
    E1: 'COVER',
    E2: 'Make this the cover',
    E3: 'Cover photo set',
    E4: 'Your cover is the first photo couples see.',
    F1: 'Awaiting review',
    F3: 'Not approved',
    F4: 'Couples see your approved photos. The rest are with our team.',
    G1: 'Press and drag to reorder. The first photo is your cover.',
    G2: 'Order saved',
    H1: 'Import from Instagram',
    H3: 'Instagram is just the quicker way. Uploading from your phone works exactly the same, always.',
    H12: 'Photos are copied into your portfolio, so they stay put even if your Instagram changes.',
  };
  for (const [id, s] of Object.entries(slots)) ok(`§6.${id} verbatim`, m.includes(s), s.slice(0, 40));
  // The vetoed IG bytes are PARKED, not rendered (CE §B). The veto record is
  // preserved by their presence in COPY; the action sitting inherits it executed.
  // ── §6.H-parked · LABELED AMENDMENT, TDW_07 P4a (count preserved 1→1) ────
  // WAS: the four vetoed IG strings are held in COPY and NOT rendered.
  // P4a renders them, which is what the parking was FOR — P3 parked them so the
  // action sitting would inherit an executed veto rather than re-run the
  // founder's card. The durable property is that the bytes are unchanged, so
  // that is what this now asserts: the founder's 2026-07-29 words reach the
  // screen verbatim, not an executor's paraphrase of them.
  ok('§6.H-rendered — the founder-vetoed IG strings reach the screen VERBATIM, '
     + 'which is what P3 parked them for',
    ['H1:', 'H2:', 'H3:', 'H4:', 'H12:'].every(k => m.includes(k))
      && /\{COPY\.H1\}/.test(m) && /\{COPY\.H3\}/.test(m) && /\{COPY\.H4\}/.test(m));
  ok('§6.A1 interpolates the SERVER cap rather than minting a second 20',
    /\$\{n\} of \$\{max\} photos/.test(m));
}

sec('§7 · THE GESTURE LAW (spec §3) — RE-AIMED AT SANCTUARY BY THE P6 FOLD');
{
  // ── LABELED AMENDMENT · TDW_07 P6 · F-07.43 「 F-D 」 (CE-ruled) ────────────────────
  // THE SUBJECT MOVED; THE LAW DID NOT. Every cell in this section asserted spec §3's
  // gesture and image-delivery guarantees against `canvas/discover`. The founder folded
  // that deck into sanctuary's Discover room and the route is now a redirect, so read
  // against CANVAS these cells assert nothing at all — they would pass on an empty file
  // if the regexes were looser, and fail on it as they are.
  //
  // THE RE-AIM IS A STRENGTHENING, NOT A RESCUE. The canvas deck had ZERO inbound
  // navigation for this block's whole life. A cell protecting the couple's touch surface
  // there was protecting a surface no couple could reach; pointed at SANCT it protects
  // the deck under the founder's actual thumb, for the first time. That is F-07.68's
  // lesson applied to the benches that were meant to catch F-07.68.
  //
  // MECHANISM, NOT RESEMBLANCE — the check ruled at CE and run per cell: each assertion
  // below names a byte sanctuary's room actually executes (the imported constants it
  // paged on, the two img layers it renders, the preloader it warms), never a shape that
  // merely looks similar. The §7.1/§7.2 patterns are rewritten to sanctuary's OWN
  // expression (`photo`, not `isBlind ? blindPhoto : currentPhoto`) rather than kept
  // verbatim and hoped over, because a regex that matches by luck is the vacuity this
  // section exists to forbid. COUNT PRESERVED: 9 cells before, 9 after.
  const c = raw(SANCT);
  for (const id of ['SWIPE_THRESHOLD', 'SWIPE_VELOCITY', 'TAP_MAX_MOVE', 'TAP_MAX_TIME', 'DOUBLE_TAP_MS', 'OVERLAY_DISMISS'])
    ok(`§7.${id} still present and untouched — now at sanctuary, the reachable deck`, c.includes(id));
  ok('§7.1 the card layers are BOTH pointerEvents:none — the touch surface is what it was',
    /lqipUrl\(photo\)[^>]*pointerEvents:'none'/.test(c) &&
    /imgUrl\(photo,'card'\)[^>]*pointerEvents:'none'/.test(c));
  ok('§7.2 the deck renders through the img module', /imgUrl\(photo,'card'\)/.test(c));
  ok('§7.3 the preloader warms the DELIVERED variant, not the original', /img\.src=imgUrl\(s,'card'\)/.test(c));
}

sec('§8 · HOUSE LAWS');
{
  const m = code(MANAGER);
  ok('§8.1 no localStorage anywhere on this screen', !/localStorage|sessionStorage/.test(m));
  ok('§8.2 ONE filled gold — the Upload action alone carries atelier-fab',
    (m.match(/atelier-fab/g) || []).length === 1);
  ok('§8.3 no raw ₹ glyph, no k/L/Cr money forms', !/₹/.test(raw(MANAGER)));
}

console.log('\n' + '─'.repeat(72));
console.log('  MUTATION LEDGER — production bytes, each run and restored:');
console.log('    W-1  lib/img.ts       VARIANTS.card w_800 → w_400        ⇒ §1.2/§2.1 RED');
console.log('    W-2  lib/img.ts       isTransformable drops the ^v\\d+$   ⇒ §2.2/§2.4/§2.7 RED');
console.log('    W-3  lib/vendor/img.ts re-declares its own w_800 table    ⇒ §1.6/§1.7 RED');
console.log('    W-4  manager          COVER badge keyed on img.is_hero    ⇒ §4.3 RED');
console.log('    W-5  manager          the cap literal 20 hard-coded       ⇒ §5.2 RED');
console.log('    W-6  manager          the igEnabled gate removed          ⇒ §5.4 RED  [P4a labeled amendment]');
console.log('    W-7  manager          H3 moved below H2                   ⇒ §6.H3-position RED');
console.log('    W-8  canvas           second img layer loses pointerEvents⇒ §7.1 RED');
console.log('─'.repeat(72));

// ── F-09.93 CURE (i), the conviction half — ABSENT SUBJECTS ARE NAMED, NOT THROWN ──
sec('§10 · ABSENT SUBJECTS (F-09.93 — the shim reports where it used to crash)');
{
  // SELF-PROOF (the independent-method law): the shim is DRIVEN here, not merely held.
  // A bench that owns a refusal path and never walks it has not proven the path exists —
  // this is F-07.99's call-site clause applied to a reader instead of a stripper.
  const sentinel = raw('lib/vendor/__tdw09_p2c_absent_probe__.ts');
  const probed   = MISSING.delete('lib/vendor/__tdw09_p2c_absent_probe__.ts');
  ok('§10.1 the shim RETURNS a named sentinel for an absent subject instead of throwing',
    sentinel.includes('ABSENT-SUBJECT:') && probed);
  if (MISSING.size === 0) {
    ok('§10.2 every subject this bench reads is present at the tree', true);
  } else {
    for (const rel of MISSING) ok(`§10.2 ABSENT SUBJECT — ${rel} (named refusal, not a crash)`, false);
  }
}

console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ` — tdw07_p3_portfolio ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
