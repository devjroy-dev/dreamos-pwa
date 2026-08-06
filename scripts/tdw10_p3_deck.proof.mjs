#!/usr/bin/env node
// scripts/tdw10_p3_deck.proof.mjs — TDW_10 · ADMIN P3's bench (dreamos-pwa).
//
// Proves the phase's ruled items on this side of the wire:
//   §1  the deck's control inventory — every control accounted KEPT or MOVED
//   §2  F-10.45's client half — the type matches the wire, and nothing calls
//       `.replace()` on a field the server does not send
//   §3  Fork 5 — two labelled counts, and the floor read from the server
//   §4  the reason chips reach the transport (deny carries a reason at last)
//   §5  the mint sheet: both outcome variants, the dark gate, no invented handle
//   §6  F-10.46 — the token cure, and the citation derivation that found it
//   §7  the espresso gate extends: zero hex, zero rose, no stranded roles
//   §8  MUTATION — every cure cell proven able to redden
//
// Runnable from any working directory.  node scripts/tdw10_p3_deck.proof.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// ── F-07.74's LAW · ONE STRIPPER HOME, AND A TDW_STRIPPER_CANARY TO PROVE IT ──
// The first draft of this bench declared its own three-line `strip()`. That is
// how the estate got three definitions of "code" in the first place, and
// `tdw_f0774_stripper.proof §6.3` exists to catch exactly that regrowth — it was
// already red at this tip for a pre-existing offender, and adding a fourth copy
// while the cell was down would have been rot hiding behind rot.
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readOr = (p, fallback = '') => {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return fallback; }
};
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const section = (s) => console.log(`\n── ${s} ${'─'.repeat(Math.max(0, 64 - s.length))}`);

// Comments are not code. Three cells in the dream-os P3 bench convicted their own
// tombstone comments on first run; the shared stripper rides here so a paragraph
// quoting the retired implementation cannot fail the cell that retired it. JSX
// comment wrappers `{/* … */}` leave empty braces after stripping, which render
// as nothing and match nothing — harmless, and not worth a second rule.
const strip = stripComments;

const P_DECK  = 'app/admin/approvals/discover/page.tsx';
const P_MINT  = 'app/admin/_components/MintSheet.tsx';
const P_API   = 'lib/admin-api/index.ts';
const P_MAPI  = 'lib/admin-api/mint.ts';
const P_TOK   = 'app/admin/_components/tokens.css';
const P_MAK   = 'app/admin/makers/page.tsx';
const P_DRE   = 'app/admin/dreamers/page.tsx';

const DECK = readOr(P_DECK), MINT = readOr(P_MINT), API = readOr(P_API);
const MAPI = readOr(P_MAPI), TOK = readOr(P_TOK);
const DECKC = strip(DECK), MINTC = strip(MINT), APIC = strip(API), MAPIC = strip(MAPI);

// ═══════════════════════════════════════════════════════════════════════════
section('§0  TDW_STRIPPER_CANARY — this bench proves the tool it depends on');
// ═══════════════════════════════════════════════════════════════════════════
{
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
     stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
     !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper',
     (readOr('scripts/tdw10_p3_deck.proof.mjs').match(/\bstrip\s*\(/g) || []).length >= 1);
}

// ═══════════════════════════════════════════════════════════════════════════
section('§1  THE CONTROL INVENTORY — CE-115 clause 1, asserted not promised');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('the deck exists', DECK.length > 0);
  // MOVED — the two verbs the old chips carried must still be reachable.
  ok('Approve is reachable as a control', /label="Approve"/.test(DECKC));
  ok('Reject is reachable as a control', /label="Reject"/.test(DECKC));
  // KEPT — the two the old page carried on non-pending rows.
  ok('Revoke survives on the settled list', /label="Revoke"/.test(DECKC) && /revokeDiscover/.test(DECKC));
  ok('re-approving a denied vendor survives', /settled\.map/.test(DECKC) && /approve\(r\)/.test(DECKC));
  ok('the Toast survives', /<Toast/.test(DECKC));
  // The gesture is an ENHANCEMENT — the provable-equivalent doctrine.
  ok('the swipe exists', /onTouchEnd/.test(DECKC) && /dx > 90/.test(DECKC));
  ok('…and every swipe verb ALSO has a button a cell can drive',
     /DeckBtn/.test(DECKC) && /label="Approve"/.test(DECKC) && /label="Reject"/.test(DECKC));
  ok('desktop A/R keys are wired', /'a' \|\| e\.key === 'A'/.test(DECKC) && /'r' \|\| e\.key === 'R'/.test(DECKC));
  ok('the keys refuse to fire while a text field has focus (a typed reason is not a verdict)',
     /INPUT', 'TEXTAREA'/.test(DECKC));
  ok('bulk-approve checkbox mode exists', /type="checkbox"/.test(DECKC) && /bulkApprove/.test(DECKC));
  ok('a partial bulk batch reports BOTH numbers, never just the successes',
     /refused\.length/.test(DECKC) && /Approved \$\{done\}\. Refused/.test(DECKC));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§2  F-10.45 — THE TYPE MATCHES THE WIRE');
// ═══════════════════════════════════════════════════════════════════════════
{
  // The five fields the old type declared and the server never sent.
  ok('`portfolio_count` — the phantom field — is gone from the type', !/portfolio_count/.test(APIC));
  for (const f of ['vendor_name', 'vendor_category', 'vendor_city', 'photos_total', 'photos_approved',
                   'photo_floor', 'meets_floor', 'pitch', 'decision_reason']) {
    ok(`DiscoverRequest declares \`${f}\` — and the server sends it`,
       new RegExp(`\\b${f}\\b`).test(APIC), f);
  }
  ok('the type still declares `discover_request_state` (the server echoes it through the push)',
     /discover_request_state/.test(APIC));
  ok('the type declares `state` too', /\n\s*state: string;/.test(APIC));

  // THE THROW. The old page ran `st.replace('_',' ')` on a field that did not
  // exist. The cure is not "the field exists now" — it is that the screen never
  // calls a string method on a value it did not prove present.
  ok('the deck resolves state through a helper that falls back, never a bare read',
     /const stateOf = \(r: DiscoverRequest\) => r\.state \|\| r\.discover_request_state/.test(DECKC));
  ok('no bare `.replace(` on a request field anywhere in the deck',
     !/r\.(state|discover_request_state)\.replace\(/.test(DECKC));
  ok('the one label helper takes a string parameter, so it cannot receive undefined',
     /const label = \(s: string\)/.test(DECKC));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§3  FORK 5 — TWO LABELLED COUNTS, FLOOR FROM THE SERVER');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('the deck renders photos_total', /card\.photos_total/.test(DECKC));
  ok('the deck renders photos_approved', /card\.photos_approved/.test(DECKC));
  // A number with no label is a number that will be read as the other one.
  ok('the total is labelled for what it measures (the floor)', /photos · floor/.test(DECKC));
  ok('the approved count is labelled for what IT measures (what couples see)',
     /visible to couples/.test(DECKC));
  ok('the floor number comes from the server row, never a client constant',
     /card\.photo_floor/.test(DECKC) && !/DISCOVER_PHOTO_FLOOR/.test(DECKC) && !/= 6\b/.test(DECKC));
  ok('the approve control is disabled below the floor (decoration over the server rule)',
     /disabled=\{busy \|\| !card\.meets_floor\}/.test(DECKC));
  ok('…and the server\'s own refusal is surfaced verbatim, not re-composed',
     /e instanceof Error \? e\.message : 'Could not approve\.'/.test(DECKC));
  ok('bulk mode cannot check a below-floor row', /disabled=\{!r\.meets_floor\}/.test(DECKC));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§4  THE REASON REACHES THE TRANSPORT');
// ═══════════════════════════════════════════════════════════════════════════
{
  // THE OLD CALL POSTED `{}` — so `reason` was always null and "rejection
  // teaches" had no carrier from the only screen that could have sent one.
  ok('denyDiscover accepts a reason', /denyDiscover\s*=\s*\(vendorId: string, reason\?: string\)/.test(APIC));
  ok('…and puts it in the body when present', /reason \? \{ reason \} : \{\}/.test(APIC));
  ok('the deck passes the chosen chip through', /denyDiscover\(r\.vendor_id, reason\)/.test(DECKC));

  const chips = (DECK.match(/^\s*'([^']+)',$/gm) || []).join('');
  for (const c of ['Photos too similar', 'Watermarks', 'Category mismatch', 'Quality']) {
    ok(`the vetoed chip "${c}" is present byte-exact`, chips.includes(c), c);
  }
  ok('a custom reason is possible (four reasons teach the founder to pick the nearest wrong one)',
     /CUSTOM_CHIP/.test(DECKC) && /custom\.trim\(\)/.test(DECKC));
  ok('an empty custom reason cannot be sent', /disabled=\{busy \|\| !custom\.trim\(\)\}/.test(DECKC));

  // F-10.44's split, rendered: a pitch is never shown as a decision.
  ok('the deck renders `pitch` on the open card', /card\.pitch/.test(DECKC));
  ok('the deck renders `decision_reason` ONLY on the settled list',
     /r\.decision_reason/.test(DECKC) && !/card\.decision_reason/.test(DECKC));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§5  THE MINT SHEET');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('the mint sheet exists', MINT.length > 0);
  ok('it is mounted on Makers as a vendor mint', /kind="vendor"/.test(strip(readOr(P_MAK))));
  ok('it is mounted on Dreamers as a couple mint', /kind="couple"/.test(strip(readOr(P_DRE))));
  ok('both doors are labelled "+ New" per the spec', 
     /label="\+ New"/.test(readOr(P_MAK)) && /label="\+ New"/.test(readOr(P_DRE)));

  // The spec's fields, both species.
  for (const f of ['Phone', 'Business name', 'Category', 'City']) {
    ok(`the vendor sheet asks for ${f}`, MINT.includes(`label="${f}"`), f);
  }
  for (const f of ['Names', 'Wedding date']) {
    ok(`the couple sheet asks for ${f}`, MINT.includes(`label="${f}"`), f);
  }
  // The founder's own words, on the field that decides the walk.
  ok('the phone hint carries the vetoed byte', /A phone with no existing TDW account\./.test(MINT));

  // F-10.47 — two outcomes, two cards.
  ok('the created variant exists', /Vendor created/.test(MINT) && /Couple created/.test(MINT));
  ok('the existing variant exists', /Already on TDW/.test(MINT));
  ok('the existing variant states that nothing was overwritten',
     /This number already had an account\. Nothing was overwritten\./.test(MINT));
  ok('the card branches on `outcome`, not on the legacy boolean',
     /result\.outcome === 'created'/.test(MINTC) && !/result\.created/.test(MINTC));

  // The honest handle line, and no handle invented client-side.
  ok('the handle line is the vetoed byte',
     /Handle is minted when they finish onboarding on WhatsApp\./.test(MINT));
  ok('the sheet never composes a handle of its own',
     !/routing_handle\s*=/.test(MINTC) && !/VENDOR\$\{/.test(MINTC));

  // The dark gate.
  ok('Send welcome exists', /label=\{welcomeBusy \? 'Sending…' : 'Send welcome'\}/.test(MINTC));
  ok('the dark-gate line is the vetoed byte',
     /Welcome template is not approved by Meta yet\./.test(MINT));
  ok('the sheet asks the SERVER whether the template is approved',
     /getWelcomeStatus/.test(MINTC) && /welcome\.approved/.test(MINTC));
  ok('the sheet never claims "sent" unless the server said sent',
     /r\.sent \? 'Welcome message sent\.'/.test(MINTC));
  ok('the button is not hidden by the gate — the refusal is the proof it works',
     !/welcome\.approved &&[\s\S]{0,80}<GhostBtn/.test(MINTC));

  // The declared gap, in the file rather than only in the handover.
  ok('partner_name\'s absence is declared at the site', /partner_name/.test(MINT));

  // The typed client reads the handler, not a guess.
  ok('the mint client names its derivation source', /src\/api\/admin\/vendors\.js/.test(MAPI));
  ok('MintOutcome is the union the server actually returns',
     /'created' \| 'existing'/.test(MAPIC));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§6  F-10.46 — THE TOKEN CURE, AND THE DERIVATION THAT FOUND IT');
// ═══════════════════════════════════════════════════════════════════════════
{
  // THE THREE SITES. Two were live values; one was the mapping comment. All three
  // carried the same wrong byte, and F-10.34's cure reached none of them.
  const live = strip(TOK);
  ok('no live declaration carries #160F0C any more', !/#160F0C/.test(live), 
     (live.match(/[^\n]*160F0C[^\n]*/g) || []).join(' | '));
  ok('--admin-nav-top is the corrected byte', /--admin-nav-top:\s*#16100C;/.test(live));
  ok('the --admin-nav-bg gradient stop is corrected too',
     /--admin-nav-bg:\s*linear-gradient\(180deg, #16100C 0%/.test(live));
  ok('the mapping comment\'s arrow is corrected (the third instance)',
     /DARK\.sheetBot\s+rgba\(22,16,12,\.99\)\s+-> #16100C/.test(TOK));
  ok('F-10.46\'s paragraph names WHY the earlier cure missed them',
     /hand-made/i.test(TOK) && /derived from every token/i.test(TOK));

  // THE INSTRUMENT. The pair set must now be derived, not listed.
  const RETINT = readOr('scripts/tdw10_p2_retint.proof.mjs');
  ok('the retint bench derives its pairs from the file\'s own citations',
     /DERIVED\.push\(\[role, d\[1\]\]\)/.test(RETINT));
  ok('…reading the RAW tokens, not the comment-stripped copy',
     /TOKENS\.matchAll/.test(RETINT) && !/DECLS\.matchAll\(\/--admin/.test(RETINT));
  ok('…matching SAME-LINE trailing comments only (a citation, not the next block\'s prose)',
     /--admin-\(\[a-z-\]\+\):\[ \\t\]\*/.test(RETINT));
  ok('…with a floor cell, so a regex that stops matching reddens instead of pairing nothing',
     /floor 12/.test(RETINT));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§7  THE ESPRESSO GATE EXTENDS TO EVERY P3 SURFACE');
// ═══════════════════════════════════════════════════════════════════════════
{
  const P3_SURFACES = [[P_DECK, DECK], [P_MINT, MINT], [P_MAPI, MAPI]];
  for (const [name, src] of P3_SURFACES) {
    const body = strip(src);
    ok(`${name} carries ZERO hex literals`, !/#[0-9A-Fa-f]{3,8}\b/.test(body),
       (body.match(/#[0-9A-Fa-f]{3,8}\b/g) || []).join(', '));
    ok(`${name} carries no rose`, !/C44058|196,\s*64,\s*88/.test(body));
    ok(`${name} names no rgba() ground of its own`, !/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+/.test(body));
  }
  // ── THE GATE WALKS THE IMPORTS NOW (F-10.51) ────────────────────────────────
  // The hex-zero cells above read only the file they were pointed at, and passed
  // while the mint sheet's primary button rendered ROSE — because `GoldBtn` lives
  // in AdminUI.tsx, whose `T.gold` is the #C44058 CE-199 retired from the rebuilt
  // set. The founder saw it on his handset before any cell did. CE-115 clause 2,
  // one layer up: a capability (here, a colour) living above a component is
  // invisible to cells that only inspect the component.
  // So: no P3 surface may import a component that paints the retired accent. The
  // list is DERIVED from each file's own import statements, never hand-listed —
  // F-10.46's lesson, applied on its first opportunity.
  const ROSE = /#C44058|196,\s*64,\s*88/;
  const ROSE_PAINTERS = ['GoldBtn'];
  for (const [name, src] of P3_SURFACES) {
    const imported = [...strip(src).matchAll(/import\s*\{([^}]+)\}\s*from/g)]
      .flatMap(m => m[1].split(',').map(x => x.trim().split(' ')[0]));
    const offenders = ROSE_PAINTERS.filter(c => imported.includes(c));
    ok(`${name} imports no component that paints the retired rose accent`,
       offenders.length === 0, offenders.join(', '));
  }
  // NON-VACUITY: the named painter must really still paint rose, or this cell is
  // guarding a ghost and would go green the day AdminUI is swept.
  ok('the ROSE_PAINTERS list is live — GoldBtn really does still carry #C44058',
     ROSE.test(readOr('app/admin/_components/AdminUI.tsx').split('export function GoldBtn')[1] || '') ||
     ROSE.test((readOr('app/admin/_components/AdminUI.tsx').match(/gold:\s*'[^']+'/) || [''])[0]));

  // ── A-4 · THE PRIMARY ACTION CLEARS THE DOMAIN BAR ──────────────────────────
  // The founder could not see the Create button on his own handset. BottomSheet
  // reserves `safe-area + 28px`; the fixed domain bar is taller than that.
  ok('the mint sheet reserves room for the fixed domain bar beneath it',
     /paddingBottom: 'calc\(env\(safe-area-inset-bottom, 0px\) \+ 72px\)'/.test(MINT));
  ok('…on BOTH panes — the form AND the success card, since the card has controls too',
     (MINT.match(/safe-area-inset-bottom, 0px\) \+ 72px/g) || []).length === 2);
  ok('the reserve exceeds BottomSheet\'s own 28px, which is why the button was hidden',
     /\+ 28px/.test(readOr('app/admin/_components/AdminUI.tsx')));

  // Every role the new surfaces consume must be declared, or it renders as nothing.
  const consumed = new Set();
  for (const [, src] of P3_SURFACES)
    for (const m of src.matchAll(/--admin-[a-z-]+/g)) consumed.add(m[0]);
  const declared = new Set(TOK.match(/--admin-[a-z-]+(?=:)/g) || []);
  const stranded = [...consumed].filter(r => !declared.has(r));
  ok(`every one of the ${consumed.size} roles the P3 surfaces consume is declared (0 stranded)`,
     stranded.length === 0, stranded.join(', '));
  ok('the P3 surfaces consume a real number of roles — the cell is not vacuous',
     consumed.size >= 8, `${consumed.size}`);
  // Money register law: no figure with a rupee glyph or shorthand reaches these.
  ok('no rupee glyph or k/L/Cr shorthand on any P3 surface',
     !P3_SURFACES.some(([, s]) => /₹|\bRs\s*\d+(k|L|Cr)\b/.test(strip(s))));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§8  MUTATION — every cure cell proven able to REDDEN');
// ═══════════════════════════════════════════════════════════════════════════
{
  const originals = new Map();
  const mutate = (p, from, to) => {
    const src = readOr(p);
    if (!originals.has(p)) originals.set(p, src);
    if (!src.includes(from)) return false;
    write(p, src.replace(from, to));
    return true;
  };
  const restore = () => { for (const [p, s] of originals) write(p, s); };

  // M1 — put the phantom field back; §2's cell must redden.
  {
    const a = mutate(P_API, '  photos_total: number;', '  portfolio_count: number;');
    ok('M1 restoring `portfolio_count` ⇒ the phantom-field cell reddens',
       a && /portfolio_count/.test(strip(readOr(P_API))));
    restore();
  }
  // M2 — drop the reason argument; §4's cell reddens.
  {
    const a = mutate(P_API,
      'denyDiscover     = (vendorId: string, reason?: string) => adminPost(`/api/v2/admin/discover/deny/${vendorId}`, reason ? { reason } : {});',
      'denyDiscover     = (vendorId: string) => adminPost(`/api/v2/admin/discover/deny/${vendorId}`, {});');
    ok('M2 dropping the reason argument ⇒ the chips stop reaching the transport',
       a && !/reason \? \{ reason \} : \{\}/.test(strip(readOr(P_API))));
    restore();
  }
  // M3 — collapse the two labels; §3's cell reddens.
  {
    const a = mutate(P_DECK, 'label="visible to couples"', 'label="photos"');
    ok('M3 collapsing the two count labels ⇒ the labelled-for-what-it-measures cell reddens',
       a && !/visible to couples/.test(strip(readOr(P_DECK))));
    restore();
  }
  // M4 — a client-side floor constant; §3's cell reddens.
  {
    const a = mutate(P_DECK, 'const REASON_CHIPS = [', 'const DISCOVER_PHOTO_FLOOR = 6;\nconst REASON_CHIPS = [');
    ok('M4 minting a client-side floor ⇒ the server-carries-the-floor cell reddens',
       a && /DISCOVER_PHOTO_FLOOR/.test(strip(readOr(P_DECK))));
    restore();
  }
  // M5 — a hex literal on a P3 surface; §7's gate reddens.
  {
    const a = mutate(P_DECK, "color: 'var(--admin-metal)', textDecoration: 'none',",
                             "color: '#C9A84C', textDecoration: 'none',");
    ok('M5 one hex literal on the deck ⇒ the espresso gate reddens',
       a && /#[0-9A-Fa-f]{3,8}\b/.test(strip(readOr(P_DECK))));
    restore();
  }
  // M6 — the wrong hex back at nav-top; §6's token cell reddens.
  {
    const a = mutate(P_TOK, '--admin-nav-top:       #16100C;', '--admin-nav-top:       #160F0C;');
    ok('M6 restoring the F-10.34 byte at nav-top ⇒ the token cell reddens',
       a && /#160F0C/.test(strip(readOr(P_TOK))));
    restore();
  }
  // M7 — the mint claims created unconditionally; §5's cell reddens.
  {
    const a = mutate(P_MINT, "{result.outcome === 'created'\n                ? (result.kind === 'vendor'",
                             "{true\n                ? (result.kind === 'vendor'");
    ok('M7 hard-coding the card variant ⇒ the branches-on-outcome cell reddens',
       a && /\{true/.test(readOr(P_MINT)));
    restore();
  }
  // M9 — put GoldBtn back on the mint sheet; the import-walking gate must redden.
  {
    const a = mutate(P_MINT, "import { BottomSheet, FieldInput, FieldSelect, GhostBtn } from './AdminUI';",
                             "import { BottomSheet, FieldInput, FieldSelect, GoldBtn, GhostBtn } from './AdminUI';");
    const imported = [...stripComments(readOr(P_MINT)).matchAll(/import\s*\{([^}]+)\}\s*from/g)]
      .flatMap(m => m[1].split(',').map(x => x.trim().split(' ')[0]));
    ok('M9 re-importing GoldBtn ⇒ the rose-through-an-import cell reddens',
       a && imported.includes('GoldBtn'));
    restore();
  }
  // M10 — drop the domain-bar reserve; the A-4 cell reddens.
  {
    const a = mutate(P_MINT, ", paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)'", '');
    ok('M10 removing the bar reserve ⇒ the primary action sits under the nav again',
       a && (readOr(P_MINT).match(/safe-area-inset-bottom, 0px\) \+ 72px/g) || []).length < 2);
    restore();
  }
  // M8 — a bare .replace on the state field; §2's throw cell reddens.
  {
    const a = mutate(P_DECK, '{idx + 1} of {pending.length} · {label(stateOf(card))}',
                             '{idx + 1} of {pending.length} · {card.discover_request_state.replace(\'_\', \' \')}');
    ok('M8 a bare .replace on a request field ⇒ the no-bare-replace cell reddens',
       a && /discover_request_state\.replace\(/.test(strip(readOr(P_DECK))));
    restore();
  }

  let allRestored = true; const detail = [];
  for (const [p, s] of originals) if (readOr(p) !== s) { allRestored = false; detail.push(p); }
  ok('every mutated file restored BYTE-IDENTICAL', allRestored, detail.join(', '));
}

console.log(`\n────────────────────────────────────────────────────────────`);
console.log(`tdw10_p3_deck: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
