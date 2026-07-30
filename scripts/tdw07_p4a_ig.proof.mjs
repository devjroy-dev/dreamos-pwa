#!/usr/bin/env node
// scripts/tdw07_p4a_ig.proof.mjs
// TDW_07 P4a — the dreamos-pwa half's floor: the un-darkened IG block, the
// picker's cap-at-the-tap, the return-from-Instagram handler, and the copy
// ledger's honesty about which strings actually carry a founder's veto.
// Runnable from any working directory; every path resolves off this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

const raw = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
// The P3 stripper, carried WITH ITS ORDER RULE: line comments FIRST, block
// comments SECOND. Stripping blocks first lets a line comment open a phantom
// block that swallows live code. The `(^|[^:])` guard keeps `https://` out.
const code = (rel) => raw(rel)
  .split('\n').map(l => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const MANAGER = 'app/vendor/portfolio/page.tsx';
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
const JSX = M.slice(code(MANAGER).indexOf('export default function PortfolioPage'));

// ═══════════════════════════════════════════════════════════════════════════
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
ok('§4.3 a tile past the room is DEAD — it never accepts the tap and then '
   + 'quietly drops the photo', /const dead = !on && igPicked\.length >= room;/.test(M));
ok('§4.4 selection preserves the vendor\'s PICK ORDER (append, not a set) — the '
   + 'server takes what fits in that order', /\[\.\.\.prev, item\.source_url\]/.test(M));
ok('§4.5 the import button is inert with nothing picked', /igPicked\.length === 0 \|\| igBusy !== null/.test(M));
ok('§4.6 PARTIAL SUCCESS is reported honestly — H9 names how many failed rather '
   + 'than flattening to a success', /failed > 0/.test(M) && /COPY\.H9/.test(M));
ok('§4.7 the grid reloads after an import so the vendor sees what landed',
   /await load\(\);/.test(M));

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE COPY LEDGER\'S HONESTY — no draft wears a veto stamp');

{
  const copyBlock = COPY_BLOCK;
  // The five slots whose bytes survive in the repo and genuinely carry the
  // founder's 2026-07-29 veto. These must be present and unaltered.
  for (const slot of ['H1', 'H2', 'H3', 'H4', 'H12']) {
    ok(`§5.1.${slot} ${slot} — the founder-vetoed byte survives`, new RegExp(`\\b${slot}:`).test(copyBlock));
  }
  // THE POINT OF THIS SECTION. The CE addendum stated H5–H11 carry an executed
  // veto and only the code was missing. Derived at the repo, the BYTES of H5,
  // H6, H7, H9 and H11 exist nowhere in either repository. Shipping executor
  // drafts under a founder's stamp would be the costume class applied to the
  // copy ledger — a string claiming an authority it does not have.
  for (const slot of ['H5', 'H6', 'H7', 'H9', 'H11', 'H13', 'H14']) {
    const line = copyBlock.split('\n').find(l => new RegExp(`^\\s*${slot}:`).test(l)) || '';
    ok(`§5.2.${slot} ${slot} is marked DRAFT — veto owed, never claimed`,
       /DRAFT — veto owed/.test(line), line.trim().slice(0, 70));
  }
  for (const slot of ['H8', 'H10']) {
    const line = copyBlock.split('\n').find(l => new RegExp(`^\\s*${slot}:`).test(l)) || '';
    ok(`§5.3.${slot} ${slot} is marked RECONSTRUCTED with its surviving source`,
       /RECONSTRUCTED/.test(line), line.trim().slice(0, 70));
  }
  ok('§5.4 the ledger states WHY the addendum\'s claim could not be honoured, so '
     + 'the next reader finds a derivation instead of a contradiction',
     /exist nowhere in either repository/.test(copyBlock));
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
console.log('    V-6  manager   a DRAFT slot restamped as vetoed               ⇒ §5.2 RED');
console.log('    V-7  manager   the client builds its own authorize URL        ⇒ §3.2 RED');
console.log('    V-8  manager   partial failure flattened to a success         ⇒ §4.6 RED');
console.log('─'.repeat(72));
console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ` — tdw07_p4a_ig ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
