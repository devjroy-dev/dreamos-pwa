#!/usr/bin/env node
// scripts/tdw07_p4a_ig.proof.mjs
// TDW_07 P4a — the dreamos-pwa half's floor: the un-darkened IG block, the
// picker's cap-at-the-tap, the return-from-Instagram handler, and the copy
// ledger's honesty about which strings actually carry a founder's veto.
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

const raw = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
// The P3 stripper, carried WITH ITS ORDER RULE: line comments FIRST, block
// comments SECOND. Stripping blocks first lets a line comment open a phantom
// block that swallows live code. The `(^|[^:])` guard keeps `https://` out.
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
const CLIENT  = 'lib/vendor/api/vendor.ts';
const M = code(MANAGER);
const C = code(CLIENT);
const Mraw = raw(MANAGER);

// The COPY ledger, sliced from its OWN opening brace to its OWN close.
// FIRST TAKE WAS WRONG: `indexOf('} as const;')` found the token object `A`,
// which closes hundreds of characters EARLIER, so every §5 cell read an empty
// slice and failed for a reason that had nothing to do with the copy.
const COPY_START = Mraw.indexOf('const COPY');
const COPY_BLOCK = Mraw.slice(COPY_START, Mraw.indexOf('} as const;', COPY_START));
// The rendered region — everything AFTER the ledger. Ordering cells must read
// this, never the whole file: the ledger mentions slot ids too, and a position
// comparison over both regions compares a definition against a usage.
// \u00a74-3 \u00b7 THE ANCHOR FOLLOWS THE SUBJECT, AND IT REFUSES BY NAME WHEN IT MISSES.
//
// This read `indexOf('export default function PortfolioPage')`. That component is the
// fallback ROUTE now and lives in `page.tsx`; the body it anchors is `PortfolioScreen` in
// `screen.tsx`. **AND THE MISS DID NOT ANNOUNCE ITSELF.** `indexOf` returned -1, `.slice(-1)`
// returned the file's last character, the IG block slice came back empty, and \u00a71.5 and \u00a71.6
// reported `-1 vs -1` \u2014 a FAIL about the TREE for a fault in the READER, on a tree where
// both bytes are exactly where the ruling wants them.
//
// THAT IS F-38.44 EXACTLY, IN A SECOND FILE. There the cure was `corpus(path)` refusing by
// name before any assertion could be scoped to a page it never fetched; here it is the same
// shape one level down \u2014 a slice whose anchor is absent must STOP, not silently return a
// one-character corpus for eleven cells to reason about. A reader that defaults on a miss
// converts its own breakage into a finding about the code it is reading.
const ANCHOR = 'export function PortfolioScreen';
const _anchorAt = code(MANAGER).indexOf(ANCHOR);
if (_anchorAt < 0) {
  console.error(`GATE-UNSOUND \u2014 anchor ${JSON.stringify(ANCHOR)} not found in ${MANAGER}. `
    + 'Every position cell below scopes to a slice taken from it, so they would assert '
    + 'against an empty corpus and report the tree as broken. Refusing instead.');
  process.exit(3);
}
const JSX = M.slice(_anchorAt);

// ═══════════════════════════════════════════════════════════════════════════

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

sec('§1 · THE BLOCK UN-DARKENS — but only on the server\'s word');

ok('§1.1 the IG block renders behind BOTH conditions: a status object AND the '
   + 'server\'s ig_import_enabled', /\{ig && ig\.ig_import_enabled && \(/.test(M));
ok('§1.2 `ig` starts null, so the block renders on NOTHING until the server '
   + 'answers — an entry that appears and self-corrects reads as a bug',
   /useState<IgStatus \| null>\(null\)/.test(M));
ok('§1.3 the gate is /ig/status, not the discover status — one door answers both '
   + 'questions (seam wired AND this vendor connected)', /fetchIgStatus\(\)/.test(M));
ok('§1.4 a failed status read leaves the block ABSENT rather than rendering a '
   + 'guess — absence is the safe state', /catch\(\(\) => \{ \/\* absence/.test(Mraw));

// H3's POSITION IS INSTRUCTION, not layout — TDW_06's doctrine, and the
// addendum's "never a wall" law. If H3 ever falls below the connect button the
// vendor is sold to before they are told the truth.
{
  // ── SCOPED TO THE IG BLOCK'S RENDER, and it took three takes. ────────────
  // Take one read the whole file (definition vs usage). Take two read the whole
  // JSX (and caught `show(COPY.H3)` in the ?ig=cancelled handler — a HANDLER
  // usage, not a rendered one). A position cell must be sliced to the region
  // whose positions it is asserting about; anything wider is measuring the
  // wrong thing while sounding right. Same class as §8.5 and §11.10 in the
  // backend harness this sitting — the third and last instance.
  const bStart = JSX.indexOf('{ig && ig.ig_import_enabled && (');
  const bEnd   = JSX.indexOf('{igPicker && (');
  const BLOCK  = bStart >= 0 && bEnd > bStart ? JSX.slice(bStart, bEnd) : '';
  const h3 = BLOCK.indexOf('COPY.H3');
  const h4 = BLOCK.indexOf('COPY.H4');
  const h1first = BLOCK.indexOf('COPY.H1');
  ok('§1.5 H3 (manual is just as good) renders ABOVE the connect action — '
     + 'position in a paragraph is instruction', h3 > 0 && h4 > h3, `${h3} vs ${h4}`);
  ok('§1.6 …and below the section heading, so the block reads heading → truth → '
     + 'action', h1first > 0 && h1first < h3);
}

ok('§1.7 an EXPIRED connection renders H11 rather than a generic failure — a '
   + '60-day expiry is a real state, not an error', /connection_state === 'expired'/.test(M));
ok('§1.8 the import control is disabled at the cap — the refusal is at the tap',
   /disabled=\{igBusy !== null \|\| full\}/.test(M));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE RETURN FROM INSTAGRAM — every outcome gets a word');

ok('§2.1 the ?ig= query is read on mount', /q\.get\('ig'\)/.test(M));
ok('§2.2 `connected` says so AND re-reads the status', /outcome === 'connected'/.test(M));
ok('§2.3 CANCELLED gets its own branch — a vendor who taps Cancel on Instagram\'s '
   + 'consent screen made a CHOICE, and silence would read as a crash',
   /outcome === 'cancelled'/.test(M));
ok('§2.4 the query is stripped afterwards so a refresh cannot replay a stale toast',
   /history\.replaceState/.test(M));

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · THE AUTHORIZE HANDSHAKE — the state is never minted here');

ok('§3.1 the authorize URL comes from the SERVER', /fetchIgAuthorizeUrl/.test(M));
ok('§3.2 the client builds NO Instagram URL of its own — a browser-minted state '
   + 'is a state an attacker can mint',
   !/instagram\.com\/oauth/.test(M) && !/client_id/.test(M));
ok('§3.3 …and neither does the api client', !/instagram\.com\/oauth/.test(C));
ok('§3.4 no scope string lives in the pwa — least-privilege has ONE home, the '
   + 'server\'s IG_SCOPE', !/instagram_business_basic/.test(M) && !/instagram_business_basic/.test(C));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE PICKER — the cap governs the TAP, not just the import');

ok('§4.1 the picker renders behind its own flag', /\{igPicker && \(/.test(M));
ok('§4.2 the free-slot room is derived from the SERVER cap and the live count',
   /cap - images\.length/.test(M));
// §4.3 / §4.4 — RE-AIMED after the perf cure moved both expressions. The
// PROPERTIES are unchanged; their addresses are not. The dead calc now rides the
// grid's map (one place, not twenty-five), and the append rides the stable
// igToggle callback. Counts preserved 1→1 each.
ok('§4.3 a tile past the room is DEAD — it never accepts the tap and then '
   + 'quietly drops the photo',
   /dead=\{!igPicked\.includes\(item\.source_url\) && igPicked\.length >= igRoom\}/.test(M));
ok('§4.4 selection preserves the vendor\'s PICK ORDER (append, not a set) — the '
   + 'server takes what fits in that order', /\[\.\.\.prev, url\]/.test(M));

// ── §4.8–§4.11 · THE PERF CURE, benched as source properties ─────────────
// The founder reported taps "not registering". They were registering; the frame
// was late. Twenty-five full-resolution CDN images re-rendered on every tap.
ok('§4.8 the tile is MEMOISED — one tap re-renders one tile, not the grid',
   /const IgTile = memo\(/.test(M));
ok('§4.9 the toggle is a STABLE useCallback with a functional updater — without '
   + 'it every tile\'s props churn and memo buys nothing',
   /const igToggle = useCallback\(\(url: string\) => \{/.test(M)
     && /setIgPicked\(prev =>/.test(M));
ok('§4.10 off-screen tiles stay off the main thread', /loading="lazy"/.test(M) && /decoding="async"/.test(M));
ok('§4.11 the free-slot count is derived ONCE per render, not per tile',
   /const igRoom = Math\.max\(0, cap - images\.length\);/.test(M));

// ── §4.12–§4.14 · MEDIA TYPE IS RENDERED, not merely consumed ────────────
// media_type was in the payload from the first build and was used to pick a
// still for videos — but never SHOWN. A reel and a photo looked identical, so a
// vendor could not make a good choice about their own storefront.
ok('§4.12 VIDEO items carry a visible badge', /const isVideo = item\.media_type === 'VIDEO';/.test(M));
ok('§4.13 CAROUSEL_ALBUM items do too', /const isAlbum = item\.media_type === 'CAROUSEL_ALBUM';/.test(M));
ok('§4.14 the reel caveat is said BEFORE the tap, not after the import — a reel '
   + 'arrives as its cover frame, and learning that afterwards is a surprise',
   /igItems\.some\(i => i\.media_type === 'VIDEO'\)/.test(M) && /COPY\.H17/.test(M));
ok('§4.5 the import button is inert with nothing picked', /igPicked\.length === 0 \|\| igBusy !== null/.test(M));
ok('§4.6 PARTIAL SUCCESS is reported honestly — H9 names how many failed rather '
   + 'than flattening to a success', /failed > 0/.test(M) && /COPY\.H9/.test(M));
ok('§4.7 the grid reloads after an import so the vendor sees what landed',
   /await load\(\);/.test(M));

// ── §4.15–§4.18 · THE SHEET'S LAYOUT, benched because both faults were REAL ──
// The founder walked it with a real vendor's real account — roughly a hundred
// items — and found two things no bench had asked about: the import action sat
// below the entire grid, and the selected state was a 2px border invisible on a
// busy photograph. Both are properties of the surface, so both get cells.
ok('§4.15 the sheet is a flex COLUMN — header, scroller, pinned action',
   /display: 'flex', flexDirection: 'column'/.test(M));
// ── §4.16 / §4.17 · BOTH TAKES WERE MY HARNESS'S FAULT, NOT THE CODE'S. ────
// §4.16 counted `overflowY` FILE-WIDE and caught two pre-existing sheets that
// have nothing to do with the picker. §4.17 grepped for COMMENT TEXT inside the
// STRIPPED source — where comments, by construction, no longer exist. It could
// never have passed. Fourth scoping error of this sitting, and the lesson has
// not changed: slice to the region you are asserting about, and assert on CODE.
{
  const pStart = M.indexOf('{igPicker && (');
  const pEnd   = M.indexOf('{sel && (', pStart);
  const PICKER = pStart >= 0 && pEnd > pStart ? M.slice(pStart, pEnd) : '';
  ok('§4.16 exactly ONE region inside the PICKER scrolls; the sheet itself does not',
     (PICKER.match(/overflowY: 'auto'/g) || []).length === 1, `${PICKER.length} chars`);
  // Asserted on code: the scroller's own closing precedes the pinned footer's
  // padding, which is the structural fact the comment merely describes.
  const scroller = PICKER.indexOf("flex: 1, overflowY: 'auto'");
  const footer   = PICKER.indexOf("borderTop: '0.5px solid rgba(201,168,76,0.18)'");
  const button   = PICKER.indexOf('onClick={igImport}');
  ok('§4.17 the import action lives OUTSIDE the scroller — a control the vendor '
     + 'must hunt for is a control that does not exist',
     scroller > 0 && footer > scroller && button > footer, `${scroller}/${footer}/${button}`);
}
ok('§4.18 the selected state carries THREE redundant signals — scrim, frame and '
   + 'tick — because any one alone can vanish on a busy photograph',
   /rgba\(12,10,9,0.42\)/.test(M) && /3px solid var\(--atelier-accent-text\)/.test(M)
     && /✓/.test(M));

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE COPY LEDGER\'S HONESTY — no draft wears a veto stamp');

{
  const copyBlock = COPY_BLOCK;
  // The five slots whose bytes survive in the repo and genuinely carry the
  // founder's 2026-07-29 veto. These must be present and unaltered.
  for (const slot of ['H1', 'H2', 'H3', 'H4', 'H12']) {
    ok(`§5.1.${slot} ${slot} — the founder-vetoed byte survives`, new RegExp(`\\b${slot}:`).test(copyBlock));
  }
  // ── §5.2 / §5.3 · LABELED AMENDMENT, 2026-07-30 (counts preserved 7→7, 2→2) ──
  // THESE CELLS ASSERTED A SITTING-SCOPED POSTURE: "these slots are marked
  // DRAFT / RECONSTRUCTED, veto owed." The founder then ran the card against the
  // rendered strings and returned 「 all ok 」, which is the outcome the marking
  // existed to produce. Leaving the cells would redden a correct ledger.
  //
  // THE DURABLE LAW HAS NOT MOVED and is what they now assert: EVERY vendor-
  // facing string carries a DATED veto, and no string wears a stamp it did not
  // earn. The marking changed from "owed" to "granted"; the requirement that the
  // ledger be honest about which is which did not. Third instance this sitting
  // of a cell re-scoped rather than deleted (b07_p3 §8.3, tdw07_p3 §5.4/§5.6).
  for (const slot of ['H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H13', 'H14']) {
    const line = copyBlock.split('\n').find(l => new RegExp(`^\\s*${slot}:`).test(l)) || '';
    ok(`§5.2.${slot} ${slot} carries a DATED veto, not a bare claim`,
       /VETOED 2026-07-30/.test(line), line.trim().slice(0, 70));
  }
  // ── LABELED AMENDMENT, 2026-07-30 P4b (counts preserved 3→3) ──────────────
  // THESE THREE CELLS ASSERTED "marked DRAFT, veto owed" — a SITTING-SCOPED
  // POSTURE that the founder's 「 ok 」 at P4b's read-first discharged. The
  // marking changed from owed to granted, which is the outcome the marking
  // existed to produce; leaving the cells would redden a correct ledger.
  //
  // THE DURABLE LAW IS UNMOVED and is what they now assert: every vendor-facing
  // string carries a DATED veto and none wears a stamp it did not earn. Exactly
  // the amendment §5.2's own header above made for H5..H14 one sitting earlier —
  // the same law, the same shape, one card later.
  //
  // DISCLOSED: this bench went RED AT ORIGIN between slice 1's push and this
  // amendment, because slice 1's floor ran the dream-os benches and the new pwa
  // bench but NOT the pwa's existing P-series. See the P4b probe handover, §3.
  for (const slot of ['H15', 'H16', 'H17']) {
    const line = copyBlock.split('\n').find(l => new RegExp(`^\\s*${slot}:`).test(l)) || '';
    ok(`§5.2.${slot} ${slot} carries a DATED veto, not a bare claim`,
       /VETOED 2026-07-30/.test(line), line.trim().slice(0, 70));
  }
  // THE TWO CARDS STAY DISTINCT. H1/H2/H3/H4/H12 were vetoed 2026-07-29 「 1.ok 」;
  // the nine above on 2026-07-30 「 all ok 」, AFTER shipping as executor drafts.
  // Collapsing them would erase the fact that these bytes were a proposal before
  // they were the founder's word — exactly the provenance a later sitting needs.
  ok('§5.3 the two copy cards are recorded as SEPARATE events with distinct dates',
     /2026-07-29/.test(copyBlock) && /2026-07-30/.test(copyBlock));
  ok('§5.4 the ledger still records WHY these slots needed a second card — the '
     + 'addendum\'s claim, and the derivation that contradicted it',
     /existed nowhere in either repository/.test(copyBlock));
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · F-07.24 — THE CLAIM THE SUBMISSION MADE, MADE TRUE');

// The App Review submission filed 2026-07-30 states, twice, that the connected
// Instagram username is shown in the "Import from Instagram" section. IT WAS NOT.
// The executor wrote that from Meta's screencast requirement without checking the
// surface, and the founder submitted it in good faith. These cells are the
// correction, and they exist so the claim cannot silently become false again.
ok('§7.1 the connected handle renders in the Import section',
   /COPY\.H18\.replace\('\{handle\}', ig\.ig_username\)/.test(M));
ok('§7.2 …only when the server actually has one — a failed profile read omits the '
   + 'line rather than printing an empty @', /\{ig\.ig_username && \(/.test(M));
ok('§7.3 the handle comes from the SERVER, never from anything the client guesses',
   /ig_username\?: string \| null;/.test(C));
{
  const copyBlock = COPY_BLOCK;
  const line = copyBlock.split('\n').find(l => /^\s*H18:/.test(l)) || '';
  // LABELED AMENDMENT, 2026-07-30 P4b (count preserved 1→1) — same ground as
  // §5.2's above. H18's veto landed with the other three.
  //
  // AND THE CELL GAINS THE STRONGER HALF, which is the one that actually
  // protects the filing: the App Review submission claims this line is visible,
  // so its PRESENCE is mandatory even though its wording is not. A future
  // sitting deleting the line is the failure this cell now catches; a future
  // sitting rewording it is lawful and must not redden.
  ok('§7.4 H18 carries a DATED veto', /VETOED 2026-07-30/.test(line), line.trim().slice(0, 60));
  ok('§7.4b H18\'s presence-mandatory constraint is stated in-file',
     /PRESENCE IS MANDATORY\. WORDING IS NOT\./.test(COPY_BLOCK));
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · HOUSE LAWS');

ok('§6.1 no localStorage anywhere in the manager', !/localStorage/.test(M));
ok('§6.2 no sessionStorage either', !/sessionStorage/.test(M));
ok('§6.3 ONE filled gold on the surface: the picker\'s import action is filled '
   + 'only when a selection exists; every IG control else is bordered or ghost',
   (M.match(/background: 'var\(--atelier-accent-text\)'/g) || []).length <= 1);
ok('§6.4 picker images carry draggable={false} — the P3 lesson (a long-press on '
   + 'an undefended img opens Chrome\'s native menu)', /draggable=\{false\}/.test(M));
ok('§6.5 no token, secret or app id appears in the pwa',
   !/IG_APP_SECRET|access_token|IG_APP_ID/.test(M) && !/IG_APP_SECRET|IG_APP_ID/.test(C));

console.log('\n' + '─'.repeat(72));
console.log('  MUTATION LEDGER — every line a PRODUCTION byte, each cmp-restored.');
console.log('    V-1  manager   the ig_import_enabled half of the gate dropped ⇒ §1.1 RED');
console.log('    V-2  manager   H3 moved BELOW the connect button              ⇒ §1.5 RED');
console.log('    V-3  manager   the cancelled branch deleted                   ⇒ §2.3 RED');
console.log('    V-4  manager   the picker stops honouring free slots          ⇒ §4.3 RED');
console.log('    V-5  manager   picked urls collected into a Set (order lost)  ⇒ §4.4 RED');
console.log('    V-6  manager   a vetoed slot loses its DATE                    ⇒ §5.2 RED');
console.log('    V-7  manager   the client builds its own authorize URL        ⇒ §3.2 RED');
console.log('    V-8  manager   partial failure flattened to a success         ⇒ §4.6 RED');
console.log('    V-16 manager   the handle line rendered unconditionally       ⇒ §7.2 RED');
console.log('    V-13 manager   the action moved back inside the scroller      ⇒ §4.17 RED');
console.log('    V-14 manager   the selection scrim removed                    ⇒ §4.18 RED');
console.log('─'.repeat(72));
console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ` — tdw07_p4a_ig ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
