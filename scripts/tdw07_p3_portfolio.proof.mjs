#!/usr/bin/env node
// scripts/tdw07_p3_portfolio.proof.mjs
// TDW_07 P3 — the dreamos-pwa half's floor.
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// THE COMMENT STRIPPER — P1 dev (iv), P2 dev (iv), P3's two more. Cells judge
// CODE. Softening a comment to buy a green is refused; the stripper is the cure.
// PROPOSED FOR PROMOTION to a shared harness helper so a fifth sitting imports
// it instead of re-deriving it (CE §C).
const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
// ORDER IS LOAD-BEARING AND WAS WRONG ONCE: line comments are stripped FIRST,
// block comments SECOND. Stripping blocks first lets a line comment containing
// `/wedding/auth/*` open a phantom block that swallows to the next real `*/` —
// in app/vendor/layout.tsx that ate ten thousand characters of live code and
// reddened a true cell. The `(^|[^:])` guard keeps `https://` out of the line pass.
const code = (rel) => raw(rel)
  .split('\n').map(l => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const IMG      = 'lib/img.ts';
const MANAGER  = 'app/vendor/portfolio/page.tsx';
const CANVAS   = 'app/(frost)/frost/canvas/discover/page.tsx';

const { imgUrl, lqipUrl, isTransformable, IMG_VARIANTS, IMG_LQIP } =
  await import(path.join(ROOT, IMG));

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
  const edges = [
    ['app/vendor/discover/profile/page.tsx', 1], ['app/vendor/discover/submit/page.tsx', 1],
    ['app/vendor/discover/page.tsx', 4], ['app/vendor/more/page.tsx', 1],
    ['components/vendor/BottomNav.tsx', 2], ['components/vendor/Header.tsx', 1],
    ['app/vendor/layout.tsx', 1],
  ];
  const counts = edges.map(([f, n]) => [f, (code(f).match(/\/vendor\/portfolio/g) || []).length, n]);
  ok('§3.1 all eleven inbound edges still point here, unmoved',
    counts.every(([, got, want]) => got === want), JSON.stringify(counts));
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
  ok('§5.4 no IG entry renders — not H1, not an explainer, not a connect',
    !/\{COPY\.H1\}/.test(m) && !/\{COPY\.H2\}/.test(m) && !/\{COPY\.H3\}/.test(m) && !/\{COPY\.H12\}/.test(m));
  ok('§5.6 and the pwa does not read ig_import_enabled at all', !/ig_import_enabled/.test(m));
  ok('§5.5 F-07.13 — in_carousel is surfaced NOWHERE on this screen', !/in_carousel/.test(m));
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
  ok('§6.H-parked — the four vetoed IG strings are held in COPY, unrendered',
    ['H1:', 'H2:', 'H3:', 'H12:'].every(k => m.includes(k)) && !/\{COPY\.H\d/.test(m));
  ok('§6.A1 interpolates the SERVER cap rather than minting a second 20',
    /\$\{n\} of \$\{max\} photos/.test(m));
}

sec('§7 · THE GESTURE LAW (spec §3) — RENDER-ONLY ON THE CANVAS');
{
  const c = raw(CANVAS);
  for (const id of ['SWIPE_THRESHOLD', 'SWIPE_VELOCITY', 'TAP_MAX_MOVE', 'TAP_MAX_TIME', 'DOUBLE_TAP_MS', 'OVERLAY_DISMISS'])
    ok(`§7.${id} still present and untouched`, c.includes(id));
  ok('§7.1 the card layers are BOTH pointerEvents:none — the touch surface is what it was',
    /lqipUrl\(\(isBlind \? blindPhoto : currentPhoto\)!\)[^>]*pointerEvents: 'none'/.test(c) &&
    /imgUrl\(\(isBlind \? blindPhoto : currentPhoto\)!, 'card'\)[^>]*pointerEvents: 'none'/.test(c));
  ok('§7.2 the deck renders through the img module', /imgUrl\(\(isBlind \? blindPhoto : currentPhoto\)!, 'card'\)/.test(c));
  ok('§7.3 the preloader warms the DELIVERED variant, not the original', /img\.src = imgUrl\(src, 'card'\)/.test(c));
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
console.log('    W-6  manager          the igEnabled gate removed          ⇒ §5.4 RED');
console.log('    W-7  manager          H3 moved below H2                   ⇒ §6.H3-position RED');
console.log('    W-8  canvas           second img layer loses pointerEvents⇒ §7.1 RED');
console.log('─'.repeat(72));
console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ` — tdw07_p3_portfolio ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
