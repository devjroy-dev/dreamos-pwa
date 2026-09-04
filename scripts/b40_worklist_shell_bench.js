#!/usr/bin/env node
// scripts/b40_worklist_shell_bench.js — the Phase 1 cells.
// Exit code is the verdict; PASS-line counts are not.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
// ── THE STRIPPER IS THE ESTATE'S, NOT THIS BENCH'S  [F-39.39 · arm (ii)] ────
// WHAT STOOD HERE, AND WHAT IT COST. This line read
//
//     .replace(SLASH-STAR ... STAR-SLASH /g, '')
//
// which is `NAIVE_RETIRED` — the rule `scripts/lib/stripComments.mjs` publishes
// for VACUITY TWINS and explicitly forbids using to strip anything. It treats
// any `/*` as a comment opener, including one inside a `//` line comment. At
// `60e439b`, `app/vendor/studio/team/page.tsx:152` says `/crew/*` inside such a
// comment; that false opener paired with `{/* FAB */}`'s closer seventy-four
// lines down, and every cell reading that file read a page with no `<Header/>`,
// no loading arm, no empty arm and no member list.
//
// C58 IS THE COST. It is the pwa half of R-39.7 — a FOUNDER ruling that the
// Studio Suite is open to every tier — and it went GREEN over a restored
// `session.tier !== 'prestige'` gate placed inside that window. The same gate
// eight lines higher reddened the floor. A cell cannot be amended while it is
// vacuous over its own subject, so this repair rides ahead of C58's amendment
// rather than beside it.
//
// THE CURE IS NOT A NEW RULE. F-07.74 already ruled this class has ONE home and
// that home already cured this specimen; b40 simply never joined it. The `.cjs`
// beside the `.mjs` is a DECLARED MIRROR and the fork is the module system —
// this bench is CommonJS and its cells are synchronous. c-39.49 records that the
// chair first named b41's `lineStrip`, which is itself the second hand-rolled
// stripper; it is untouched here and leaves the debt class on its own sitting.
//
// b40 LEAVES THE UN-STRIPPED-READER DEBT BY JOINING THE HOME, not by exemption.
// F-39.41: `tdw_f0774_readers.proof.mjs` §2.2 tests the PRESENCE of stripping and
// not the IDENTITY of the stripper, so it passed this file throughout — the
// nineteen-reader list never held the reader where the class was doing damage.
// That cell grows an identity test pre-beta, in its own sitting; nothing here.
const { stripComments } = require('./lib/stripComments.cjs');
/** Comment-blindness law: strip comments before any textual assertion against source. */
const strip = stripComments;

/**
 * THE BANNED NAMES, ONE HOME (R-37.70 as amended at R-38.17).
 *
 * Read by C5 at the register and by both of C32's arms across the import graph. It was
 * declared beside C32 and C5 carried its own narrower copy of three names out of five \u2014
 * two homes for one list, and the smaller one was the one nobody re-read. A sixth name is
 * one edit here and cannot land in only some of the cells.
 */
const PERSONAS = '\\bDreamAi\\b|\\bVictor\\b|\\bDonna\\b|\\bHarvey\\b|\\bMira\\b';

/**
 * THE REAL NAMES, ONE HOME — CE-39 S2/8 · F-39.6.
 *
 * PERSONAS above bans the estate's INVENTED names. This list bans a REAL PERSON'S, and the
 * two are different kinds of list rather than one list with more entries: a persona name is
 * banned because it leaks an internal seat into the vendor's view, and a person's name is
 * banned because product chrome speaks as the product. The founder met 「Contact Swati to be
 * considered.」 on the Couture screen and asked what it was; the census found eight sites.
 *
 * NOTHING HAD EVER LOOKED, and that is the finding under the finding: C5 and both arms of
 * C32 read PERSONAS, PERSONAS held five invented names, and a human's given name was
 * outside every cell in the estate. Seeded with the one name the census found. A second
 * name is one edit here and cannot land in only some of the cells.
 */
const REAL_NAMES = ['Swati'];

// ── F-39.47 · A REFUSAL IS NOT A FAIL, AND UNTIL NOW IT HAD NO WAY TO SAY SO ──
//
// THE DEFECT. Several cells here name a PRECONDITION instead of failing when the
// precondition is absent — C81 and C84 both return a string beginning `REFUSED`
// when the dream-os sibling is not beside this tree, and both say, in the string
// itself, 「this is not a FAIL」. The reader was told. Nothing else was.
// `cell()` treated ANY non-null return as a fail, incremented `fails`, and the
// process exited 1; `scripts/run-floor.sh` classifies purely by exit code
// (`node "$b" ... || RED=...`), so a refusal reached the floor as `RED: b40` —
// indistinguishable from a real defect.
//
// ⚠ THE CURE COULD NOT LIVE AT THE RUNNER ALONE, and that was reported before a
// byte was written. The runner was not withholding a distinction it possessed —
// it had none to withhold, because the bench emitted one exit code for two
// different verdicts. A channel had to exist before anything could read it.
//
// ⚠ THIS DOES NOT PASS ON ABSENCE, which was the chair's condition. A refused
// cell is NOT green: it prints as REFUSED, it is counted, it is named in the
// verdict line, and the exit code is non-zero (3). The floor is run sibling-full
// by law, so a refusal here still means the floor was not run the way the law
// says to run it — the difference is that now it says which thing went wrong.
//
// ⚠ A REAL FAIL BESIDE A REFUSAL IS A FAIL. Exit 1 wins over exit 3, always. A
// run that refused one cell and broke another is a broken run; reporting it as
// merely under-provisioned would be the hollow green this estate refuses.
let fails = 0;
let refusals = 0;
const refusedNames = [];
function cell(name, fn) {
  try {
    const why = fn();
    if (!why) { console.log('GREEN ' + name); return; }
    // THE SIGNAL IS THE RETURNED STRING'S OWN OPENING WORD, not a second
    // argument or a wrapper — because the cells that already refuse ALREADY
    // write it, verbatim, and a channel that required them to be rewritten
    // would be a channel their authors could forget to use.
    if (/^REFUSED\b/.test(why)) {
      console.log('REFUSED ' + name + ' — ' + why.replace(/^REFUSED\s*—?\s*/, ''));
      refusals++; refusedNames.push(name.split(' ')[0]);
      return;
    }
    console.log('RED   ' + name + ' — ' + why); fails++;
  }
  // A THROW IS NEVER A REFUSAL. A cell that refuses does so deliberately, by
  // returning; a cell that throws met something it did not anticipate, and that
  // is exactly the case where guessing 「probably just a missing sibling」 is how
  // a defect gets absorbed.
  catch (e) { console.log('RED   ' + name + ' — threw: ' + e.message); fails++; }
}

cell('C1 token completeness, both modes', () => {
  const src = strip(read('lib/worklist/theme.ts'));
  const grab = (name) => {
    const m = src.match(new RegExp('export const ' + name + '[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};'));
    if (!m) throw new Error(name + ' block not found');
    return (m[1].match(/^\s*'[a-z-]+'\s*:/gm) || []).length;
  };
  const g = grab('GRAPHITE'), c = grab('CHALK');
  if (g !== 33) return 'GRAPHITE has ' + g + ' tokens, expected 33';
  if (c !== 33) return 'CHALK has ' + c + ' tokens, expected 33';
  return null;
});

// R-37.75: the freeze law now protects the flipped seat order too — C17 owns the seats,
// C2 owns the tiles.
//
// AMENDED BY LABEL — ZIP 14 (R-37.87, founder word 2026-08-27). SIXTEEN becomes SEVENTEEN
// and the bottom band nine becomes ten: Collab does not sit inside Storefront and takes its
// own tile. THE COUNT HISTORY, every step worded or derived: 11 -> 15 -> 16 -> 17.
// The cell is amended by LABEL, never by loosening — it still asserts an exact count and an
// exact order, because the freeze is the anti-feature. The expected numbers now read from
// lib/worklist/rooms.ts's own exported constants rather than from literals retyped here, so
// the next amendment happens in ONE home and this cell cannot drift away from the registry
// it guards. Position is the founder's to reorder in one word; this cell asserts wherever
// he puts it, and reddens on any reorder he did not word.
// AMENDED, LABELLED — M-FINISH S1 (R-38.9). SEVENTEEN BECOMES EIGHTEEN by founder word:
// the Advisor room joins the business band. Count history, every step worded or derived:
// 11 -> 15 -> 16 -> 17 -> 18. The cell does NOT loosen — it still asserts an exact count
// and an exact order, and it still reads BOTH from the registry's own exported constants
// rather than from literals retyped here, so the numbers cannot drift from the registry
// they guard. Only the ruled expectation moved, and it moved with a name on it.
// AMENDED, LABELLED — ROAD STEP 2b (R-38.10, founder veto 2026-08-29). EIGHTEEN BECOMES
// NINETEEN and the TOP band seven becomes eight: Books lands in the work band at INDEX 4,
// beside Invoices and Expenses, by founder word. Count history, every step worded or
// derived: 11 -> 15 -> 16 -> 17 -> 18 -> 19.
//
// THE LITERALS BELOW ARE THE REASON THIS CELL NEEDED EDITING AT ALL, and it is worth
// naming because the charter did not name it. The comment above says the expected numbers
// "now read from lib/worklist/rooms.ts's own exported constants rather than from literals
// retyped here" — and they DO, for the ids and the bands. But the three-number guard on
// the first line reads LITERALS, deliberately: it is what stops the registry from drifting
// away from the RULING by editing its own constants. So a ruled amendment has to move both
// homes in one edit, and moving only rooms.ts would have reddened this cell on a correct
// registry. Derived by reading the cell, not by running it and reacting.
cell('C2 nineteen rooms in frozen order, 8 + 11 (R-37.75; R-37.87; R-38.9; R-38.10)', () => {
  const src = strip(read('lib/worklist/rooms.ts'));
  const num = (name) => { const m = src.match(new RegExp(name + '\\s*=\\s*(\\d+)')); return m ? Number(m[1]) : null; };
  const EXP_ALL = num('ROOM_COUNT_EXPECTED'), EXP_TOP = num('TOP_BAND_EXPECTED'), EXP_BOT = num('BOTTOM_BAND_EXPECTED');
  if (EXP_ALL !== 19 || EXP_TOP !== 8 || EXP_BOT !== 11)
    return 'the registry\'s own constants drifted from the ruling: ' + EXP_ALL + '/' + EXP_TOP + '/' + EXP_BOT + ', expected 19/8/11';
  const ids = (src.match(/\{\s*id:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  if (ids.length !== EXP_ALL) return 'registry has ' + ids.length + ' rooms, expected ' + EXP_ALL;
  const fb = src.match(/FROZEN_ORDER[^=]*=\s*\[([\s\S]*?)\]/);
  if (!fb) return 'FROZEN_ORDER not found';
  const frozen = (fb[1].match(/'([a-z]+)'/g) || []).map((s) => s.slice(1, -1));
  if (frozen.join(',') !== ids.join(',')) return 'order drift: registry [' + ids.join(',') + '] vs frozen [' + frozen.join(',') + ']';
  // R-38.10's PLACEMENT, asserted separately from the order. FROZEN_ORDER and the registry
  // agreeing proves they match each other; it does not prove they match the FOUNDER'S WORD,
  // which was index 4, beside Invoices and Expenses. Two files can drift together.
  if (ids[4] !== 'books') return 'Books is at index ' + ids.indexOf('books') + ', ruled index 4 (beside Invoices/Expenses)';
  const work = (src.match(/band:\s*'work'/g) || []).length;
  const biz  = (src.match(/band:\s*'business'/g) || []).length;
  if (work !== EXP_TOP) return 'top band has ' + work + ', expected ' + EXP_TOP;
  if (biz !== EXP_BOT) return 'bottom band has ' + biz + ', expected ' + EXP_BOT;
  return null;
});

cell('C3 no inline wa number in the shell', () => {
  const files = ['components/worklist/FirstRun.tsx','components/worklist/AiDock.tsx',
    'components/worklist/WorklistShell.tsx','components/worklist/RoomsGrid.tsx',
    'app/vendor/(shell)/page.tsx','app/vendor/(shell)/rooms/page.tsx','app/vendor/(shell)/support/page.tsx',
    'app/vendor/(shell)/layout.tsx','lib/worklist/copy.ts'];
  const bad = files.filter((f) => /\b9\d{11}\b/.test(strip(read(f))));
  if (bad.length) return 'number literal in ' + bad.join(', ') + ' — must resolve through lib/waNumbers.ts';
  if (!strip(read('app/vendor/(shell)/support/page.tsx')).includes('supportWaNumber()')) return 'support page does not call supportWaNumber()';
  return null;
});

cell('C4 self-reference register (R-37.72)', () => {
  const strings = strip(read('lib/worklist/copy.ts')).match(/'(?:[^'\\]|\\.)*'/g) || [];
  const offend = strings.filter((s) => /\b(this app|the app|our app)\b/i.test(s));
  if (offend.length) return 'reduction found: ' + offend.join(' | ');
  return null;
});

// ── AMENDED, LABELLED — \u00a74-2. THE NAME ASSERTED A RETIRED RULE ─────────────
//    It was called 「DreamAi, never a seat-name, in chrome」 \u2014 R-37.70's ORIGINAL shape,
//    which permitted the product name in prose and forbade only the seat names. R-38.17
//    retired that exemption: DreamAi is banned outright, in prose and in labels. So the
//    cell's NAME stated a rule the estate had struck, in green output, on every run.
//
//    ITS BODY WAS NARROWER THAN ITS NAME TOO \u2014 three names of five, and `copy.ts` alone.
//    C32 walks the whole import graph for all five. This is the REGISTER's own guard: the
//    one file every vetoed byte must pass through, checked at its source, so a banned name
//    cannot be added to the register and then noticed later somewhere downstream.
//    RETIRE-WITH-THE-READER: the claim survives its wording, and reads the same one home
//    for the persona list that C32 does.
//
//    ⚠ AND ITS READER WAS GUESSWORK, WHICH ONLY A MUTATION SHOWED. The old body extracted
//    quoted strings with a single-quote pair matcher and searched the JOIN. `copy.ts`
//    carries 151 apostrophes after stripping — an ODD count, because prose inside vetoed
//    bytes uses them (「the vendor's own」, 「isn't reading」). One stray apostrophe offsets
//    every pairing after it, so real strings fall inside phantom ones and out of the set.
//    Planting `DreamAi` in the register did NOT red this cell; C32, reading the same file
//    with a different reader, caught it. **Two readers for one claim, and the fragile one
//    was the cell standing closest to the register.**
//
//    THE PAIRING IS ABANDONED, NOT REPAIRED. This file IS the copy register: every string
//    in it is vendor-facing by construction and every comment is stripped before the read.
//    So the honest question is not 「is this name inside a quoted literal」 but 「is this name
//    in the register at all」 — which needs no pairing, cannot be offset, and is strictly
//    stronger. Proven by mutation on two names the old body could not see.
cell('C5 no persona name in the copy register, all five (R-37.70 as amended at R-38.17)', () => {
  const register = strip(read('lib/worklist/copy.ts'));
  const hit = new RegExp(PERSONAS).exec(register);
  if (hit) return 'a persona name appears in the copy register: ' + hit[0];
  return null;
});

cell('C6 no third container (R-37.64)', () => {
  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  const seats = (shell.match(/className=\{'wl-seat'/g) || []).length;
  if (seats !== 2) return seats + ' nav seats rendered, expected exactly 2';
  if (/<input/.test(shell)) return 'an input renders in the shell chrome — search-as-navigation is banned';
  return null;
});

// ── C7 · the chrome is PINNED. The first cut let the dock and both nav seats scroll off
//    the bottom of a long Today. Mutation that reddens it: height 100dvh -> minHeight.
cell('C7 chrome pinned, body scrolls', () => {
  const shell = read('components/worklist/WorklistShell.tsx');
  if (!/height:\s*'100dvh'/.test(shell)) return 'shell root is not a fixed 100dvh column';
  if (!/overflow:\s*'hidden'/.test(shell)) return 'shell root does not clip — the chrome will scroll away';
  if (!/\.wl-main\{[^}]*overflow-y:auto/.test(shell)) return 'the body does not scroll independently';
  if (!/\.wl-nav\{[^}]*flex-shrink:0/.test(shell)) return 'the nav can be squeezed out of the column';
  return null;
});

// ── C8 · every tap target answers the finger. A control with no pressed state and a
//    300ms zoom delay reads as dead, and a dead control gets tapped again.
cell('C8 touch answers', () => {
  const files = ['components/worklist/WorklistShell.tsx','components/worklist/RoomsGrid.tsx',
                 'components/worklist/AiDock.tsx','components/worklist/FirstRun.tsx','app/vendor/(shell)/support/page.tsx'];
  // FirstRun's own pressed states moved with the shared chrome; the shell answers for them.
  const missing = files.filter((f) => !/:active\{/.test(read(f) + read('components/worklist/WorklistShell.tsx')));
  if (missing.length) return 'no pressed state in ' + missing.join(', ');
  // Anchored to the .wl root rule specifically. An earlier cut of this cell matched
  // touch-action anywhere in the file and stayed GREEN with the root rule deleted —
  // vacuous, caught by its own mutation run and tightened here.
  if (!/\.wl\{[^}]*touch-action:manipulation/.test(read('components/worklist/WorklistShell.tsx')))
    return 'the .wl root carries no touch-action:manipulation — every tap waits on the double-tap-zoom gesture';
  return null;
});

// ── C9 · the wire shape of the handle, asserted against dream-os's own mapping.
//    /api/v2/vendor/me returns `handle`; reading `routing_handle` hides card 1 forever.
// AMENDED BY LABEL (ZIP 7): the read moved out of FirstRun into a shared hook, because Rooms'
// link card needs the same fact and two reads would be two chances to read the wrong field.
// The assertion got stronger, not looser: the hook must be the ONLY home.
cell('C9 the handle is read once, from the wire, in one home', () => {
  const hook = strip(read('hooks/vendor/useVendorHandle.ts'));
  if (/vendor\?\.routing_handle/.test(hook)) return 'reads vendor.routing_handle — the wire field is `handle` (dream-os me.js:76)';
  if (!/vendor\?\.handle/.test(hook)) return 'the hook does not read vendor.handle';
  for (const f of ['components/worklist/FirstRun.tsx', 'app/vendor/(shell)/rooms/page.tsx']) {
    const src = strip(read(f));
    if (/\/api\/v2\/vendor\/me/.test(src)) return f + ' fetches /me itself — a second home for one fact';
  }
  return null;
});

// ── C10 · TAP-TARGET FLOOR. Every interactive control >= 44 CSS px (R-37.73 (1)).
//    The rule reads min-height/min-width off the shipped CSS. A control with neither is
//    a target that survives by accident, and this cell calls that a miss.
cell('C10 every tap target >= 44px', () => {
  const TAP_MIN = 44;
  const files = {
    // AMENDED, LABELLED — ZIP 13 (CE ruling F-4). `wl-coinitem` leaves this list
    // because the RULE was deleted, not because it stopped mattering: it styled
    // the two-row coin drawer ZIP 12 replaced when it completed R-37.79, and it
    // had zero consumers at deletion. RETIRE-WITH-THE-READER — the name goes with
    // its subject and the reason stands where the name stood. The cell itself is
    // untouched and the cell COUNT is unchanged; only this one guarded class is
    // withdrawn. `wl-coin` stays: the medallion is very much alive.
    'components/worklist/WorklistShell.tsx': ['wl-coin', 'wl-seat'],
    'components/worklist/RoomsGrid.tsx':     ['wl-tile'],
    'components/worklist/AiDock.tsx':        ['wl-dockfield'],  // Arm A: the costume is back and honest; .wl-dock is the padding wrapper
    'components/worklist/FirstRun.tsx':      ['wl-chip'],
    'components/worklist/WorklistShell.tsx#shared': ['wl-cardaction'],  // rehomed: shared chrome lives in the shell
    'app/vendor/(shell)/support/page.tsx':                ['wl-supportaction'],
  };
  const under = [];
  for (const [f, classes] of Object.entries(files)) {
    const css = read(f.split('#')[0]);
    for (const c of classes) {
      const m = css.match(new RegExp('\\.' + c + '\\{([^}]*)\\}'));
      if (!m) { under.push(c + ' (rule not found)'); continue; }
      // AMENDED, LABELLED — M-FINISH S1 (F-38.4). `.wl-tile` states `height`, not
      // `min-height`, because the tile is now a FIXED 64px: R-38.5's 1:1 aspect put four
      // of eighteen rooms below the fold and was replaced by a fixed height at CE-38
      // relay #2. The floor is unchanged and still 44 — this reads either declaration, so
      // a control with NEITHER still fails as 'a target that survives by accident'. The
      // token form is read too, because the grid's values now have one home in theme.ts
      // and the stylesheet reads var(--wl-tile) rather than restating 64.
      let h = m[1].match(/min-height:(\d+)px/) || m[1].match(/height:(\d+)px/);
      if (!h && /height:var\(--wl-(tile|row)\)/.test(m[1])) {
        const g = read('lib/worklist/theme.ts').match(/GRID\s*=\s*\{[^}]*?(tile|row):\s*(\d+)/g) || [];
        const t = read('lib/worklist/theme.ts').match(/tile:\s*(\d+)/);
        h = t ? [null, t[1]] : null;
      }
      if (!h) { under.push(c + ' (no stated height — a target that survives by accident)'); continue; }
      if (Number(h[1]) < TAP_MIN) under.push(c + ' at ' + h[1] + 'px');
    }
  }
  if (under.length) return 'under the 44px floor: ' + under.join(', ');
  return null;
});

// ── C11 · TYPE FLOORS (R-37.73 (2)). No label under 11px, no interactive text under 12px.
//    9px on the tile names was the conviction; this makes it unrepeatable.
cell('C11 type floors hold', () => {
  const rules = [
    ['components/worklist/RoomsGrid.tsx', 'wl-tname', 12], ['components/worklist/RoomsGrid.tsx', 'wl-bandlabel', 11],
    ['components/worklist/WorklistShell.tsx', 'wl-seat', 12], ['components/worklist/WorklistShell.tsx', 'wl-lbl', 11],
    // AMENDED, LABELLED — ZIP 13 (CE ruling F-4), same deletion as C10's.
    // `wl-sub` was the coin drawer's right-hand micro-label; the rule is gone and
    // the guarded name goes with it. Cell untouched, cell count unchanged.
    ['components/worklist/AiDock.tsx', 'wl-dockph', 12],  // Arm A: the placeholder is the dock's only type
    ['components/worklist/WorklistShell.tsx', 'wl-cardtitle', 12], ['components/worklist/WorklistShell.tsx', 'wl-cardbody', 14],
    ['components/worklist/FirstRun.tsx', 'wl-chip', 12], ['components/worklist/WorklistShell.tsx', 'wl-cardaction', 12],
  ];
  // AMENDED, LABELLED — M-FINISH S1 (R-38.4). AD-HOC px IS GONE FROM THE SHELL: every rule
  // now reads `font:var(--wl-tN)`, the CSS `font` SHORTHAND, so a call site cannot set a
  // size without also taking that rung's family and weight. So this cell stops looking for
  // a `font-size` literal — which would now report 'no font-size' for every correct rule,
  // exactly as it did on the first run — and RESOLVES THE RUNG through theme.ts's own TYPE
  // object instead. The floors are untouched and the cell count is unchanged. It is
  // STRICTER than before, not looser: a rule that names no rung at all fails, where a
  // literal would merely have had to clear a number.
  const TYPE_SRC = read('lib/worklist/theme.ts');
  const rungSize = (t) => {
    const m = TYPE_SRC.match(new RegExp(t + ':\\s*\\{\\s*size:\\s*([\\d.]+)'));
    return m ? Number(m[1]) : null;
  };
  const bad = [];
  for (const [f, c, floor] of rules) {
    const m = read(f).match(new RegExp('\\.' + c + '\\{([^}]*)\\}'));
    if (!m) { bad.push(c + ' (rule not found)'); continue; }
    let size = null;
    const rung = m[1].match(/font:var\(--wl-(t\d)\)/);
    if (rung) size = rungSize(rung[1]);
    else { const sz = m[1].match(/font-size:([\d.]+)px/); if (sz) size = Number(sz[1]); }
    if (size === null) { bad.push(c + ' (names no type rung and sets no size)'); continue; }
    if (size < floor) bad.push(c + ' at ' + size + 'px, floor ' + floor);
  }
  if (bad.length) return 'under the type floor: ' + bad.join(', ');
  return null;
});

// ── C12 · THE ROOMS ARM (R-37.73 (4)). The branch's /vendor tree must carry Graphite at
//    ALL THREE colour homes, or the rooms come out half-converted — which reads worse than
//    uniform brown. useT() consumers, var() consumers, and the inline pre-paint pin.
cell('C12 the branch vendor tree carries Graphite at all three homes', () => {
  // Comment-blindness law, and then some: the old palette is legitimately QUOTED in this
  // file's prose while it explains why each role exists. Assert against the token blocks.
  const th = read('lib/vendor/theme.ts');
  for (const name of ['DARK', 'LIGHT']) {
    const b = th.match(new RegExp('export const ' + name + ': ThemeTokens = \\{([\\s\\S]*?)\\n\\};'));
    if (!b) return name + ' block not found';
    const vals = (b[1].match(/:\s*'([^']*)'/g) || []).join(' ');
    if (/#1A0F08|#F5F2EE|#7A3828|#1F1612|#241A15|122,56,40|245,235,212/.test(vals))
      return name + ' still carries an Espresso/Paper value — useT() consumers stay brown';
  }
  if (!/#68C9B4/.test(th)) return 'lib/vendor/theme.ts has no signal colour — the palette did not land';
  const css = read('app/globals.css');
  if (!/M-WORKLIST ZIP 3/.test(css)) return 'globals.css carries no override layer — every var() consumer stays brown';
  if (!/--atelier-page-bg: #141516 !important/.test(css)) return 'the override layer does not set the dark page ground';
  // P7.2 AMENDMENT (labeled): the third home, app/vendor/layout.tsx's inline LIGHT_VARS,
  // is DELETED with the old tree (F-38.3 closed for this lane). The cell keeps its two
  // surviving homes and asserts the third is gone, so a resurrected inline pin reds here.
  if (fs.existsSync(path.join(ROOT, 'app/vendor/layout.tsx'))) return 'app/vendor/layout.tsx is back: the inline LIGHT_VARS home was retired at P7.2';
  return null;
});

// ── C13 · THE FIRST-RUN SET (R-37.68-B). Five cards, the promise above them, five chips,
//    and the three-sentence ceiling on every body. "Cards, never documentation" is a rule
//    that only survives if something counts the sentences.
cell('C13 first-run set: shape, order, and R-38.17\'s one-sentence fourteen-word ceiling', () => {
  const copy = strip(read('lib/worklist/copy.ts'));
  const fr   = strip(read('components/worklist/FirstRun.tsx'));

  // AMENDED, LABELLED — M-FINISH S1 (R-38.6). `todayPromise` RETIRES: it was a two-clause
  // paragraph standing where a page title goes, and it is recut to `todayTitle` at t1.
  // RETIRE-WITH-THE-READER, and the assertion INVERTS rather than vanishing — a silent
  // re-add of the paragraph reddens — while the clause that mattered (Today must open on a
  // line with stature, R-37.76 ⑧) is preserved against its successor.
  if (/todayPromise:/.test(copy)) return 'the retired paragraph todayPromise is back in copy.ts';
  // AMENDED, LABELLED — M-FINISH S2/2 (R-38.17 as amended at c-38.14). `todayTitle` RETIRES
  // in its turn: a page title over a masthead that already names the day is two lines where
  // the surface needed one, and neither said what state Today was in. RETIRE-WITH-THE-READER
  // — the assertion INVERTS rather than vanishing, and the clause that mattered (Today opens
  // on a line with stature, R-37.76 (8)) is preserved against its successor, the STATUS.
  if (/todayTitle:/.test(copy)) return 'the retired page title todayTitle is back in copy.ts';
  // AMENDED TWICE, BOTH TIMES LABELLED. Relay #3 item 2 withheld `todayNothingYet` and this
  // cell asserted its ABSENCE from the register. PHASE 4 DISCHARGES THAT WITHHOLDING — the
  // feed answers, so the byte is a live export and the assertion INVERTS A SECOND TIME
  // rather than being deleted. Retire-with-the-reader: a bench moves with the code it
  // tests, and an assertion that simply vanishes leaves nothing watching the byte at all.
  if (!/todayNotLive:/.test(copy)) return 'Today has no not-reading status byte in copy.ts';
  if (!/^\s*todayNothingYet:\s*'Nothing needs you yet\.'/m.test(copy))
    return 'the true-empty byte is withheld while the feed answers — it has a state to render now';
  if (!/COPY\.todayNotLive/.test(strip(read('app/vendor/(shell)/today/page.tsx'))))
    return 'the not-reading status is never rendered on Today';

  // AMENDED, LABELLED — M-FINISH S1 (R-38.6). FIVE CARDS BECOME THREE. `cardRoomsTitle`
  // and `cardMoreTitle` leave this list because their SUBJECTS were retired by ruling: the
  // Rooms card captioned a directory it sat on top of, and the Business Solutions card was
  // a second door to a room that has had a tile since R-37.66. Their keys must be GONE, not
  // orphaned — asserted three lines below with the ZIP 1 keys, same clause, same reason.
  // AMENDED, LABELLED — CE-38 SEAL ②. R-37.68-B's order is amended to desk · ask · link,
  // and the cell now asserts the ORDER and not merely the membership. It could not have
  // caught F-38.21 before: three cards all rendered, in any sequence, satisfied it.
  // The conditional card is last so its arrival APPENDS instead of inserting — the same
  // property the cell has to guard, because a later seat tidying the JSX back into the old
  // sequence would reintroduce the displacement with nothing to stop it.
  const titles = ['cardDeskTitle', 'cardAskTitle', 'cardLinkTitle'];
  const missing = titles.filter((t) => !new RegExp('COPY\\.' + t).test(fr));
  if (missing.length) return 'cards defined but never rendered: ' + missing.join(', ');
  const order = titles.map((t) => fr.indexOf('COPY.' + t));
  if (order[0] > order[1] || order[1] > order[2])
    return 'card order is not desk \u00b7 ask \u00b7 link — the conditional card must be last (F-38.21)';
  // AMENDED, LABELLED — relay #3 item 3. THE SET PAINTS ATOMICALLY, and the source half of
  // that claim is asserted here: the feed must not render at all until the wire has
  // settled. Ordering alone was the answer twice (last-by-ruling, then the handle cache)
  // and a re-timing can always still lose the race — on the deploy, dark painted two cards
  // and light painted three, on one tree in one run. C-R12/C-R14 hold the wire and measure
  // the paint; this stops the guard being deleted as a stray early return.
  if (!/\{\s*handle\s*,\s*settled\s*\}\s*=\s*useVendorHandle\(\)/.test(fr))
    return 'FirstRun does not read the settled flag — the set cannot know when to paint';
  if (!/if\s*\(!settled\)\s*return null;/.test(fr))
    return 'the first-run set renders before the wire settles — the race is re-timed, not retired';

  // Retired keys must be gone, not orphaned — an unrendered vetoed byte is a byte that
  // drifts unnoticed until someone renders it again.
  if (/cardAiTitle|cardAiBody|cardAiAction/.test(copy)) return 'ZIP 1 card keys survive in copy.ts';
  // AMENDED, LABELLED — S2/2. R-38.17's four retirements join the list: an unrendered
  // vetoed byte drifts unnoticed until someone renders it again, and `todayEmptyAction` in
  // particular would come back as a second door to Rooms with the nav seat already on
  // screen.
  const retiredKeys = ['cardRoomsTitle', 'cardRoomsBody', 'cardRoomsAction', 'cardMoreTitle', 'cardMoreBody',
                       'roomsPointer', 'roomsAskSub', 'roomsProfileSub', 'todayMastheadCaption',
                       'todayTitle', 'todayEmpty', 'todayEmptyAction'];
  const orphans = retiredKeys.filter((k) => new RegExp(k + ':').test(copy));
  if (orphans.length) return 'retired keys survive in copy.ts: ' + orphans.join(', ');

  // ⚠ THE MATCHER IS ANCHORED ON THE COLON, and it was not. `cardAskChips` is a PREFIX of
  // `cardAskChipsEyebrow`, so the moment R-38.17 added the eyebrow key beside the list the
  // old expression matched from the eyebrow to the first bracket and counted its byte as a
  // sixth chip. The cell reddened a correct tree — the same class as the audit matcher that
  // read double-quoted attributes only, and the same cure: match what you mean.
  const chips = copy.match(/cardAskChips:\s*\[[^\]]*\]/);
  if (!chips) return 'chip list not found';
  const n = (chips[0].match(/'/g) || []).length / 2;
  if (n !== 5) return 'chip count is ' + n + ', expected 5 (one per capability)';

  // The ceiling. Sentence-enders outside the ellipsis/decimal cases.
  // AMENDED with the card set above, and TIGHTENED: R-38.6 cuts the ceiling from three
  // sentences to ONE. The cell that counted to three would pass a two-sentence body, which
  // is exactly the drift the recut exists to prevent.
  // ── F-38.29 · THE COMMENT SAID ONE AND THE CODE COUNTED TO THREE ──────────
  // The S1 amendment above stated in words that R-38.6 cuts the ceiling from three
  // sentences to ONE, and the assertion beneath it went on reading `count > 3`. A cell
  // whose comment reads like the ruling and whose code does not perform it is worse than
  // no cell: it is a paragraph nobody re-derived, agreeing with itself. Filed and cured
  // here at the same site, with R-38.17's own clause folded in — each card body is at most
  // ONE sentence of at most FOURTEEN words.
  //
  // TWO CARDS NOW HAVE NO BODY AT ALL and their keys must be GONE, not empty: `cardAskBody`
  // and `cardLinkBody` retire with R-38.17. An empty vetoed byte is a byte a later reader
  // fills in.
  if (/cardAskBody:|cardLinkBody:/.test(copy))
    return 'R-38.17 gives cards 2 and 3 no body; the retired body keys survive in copy.ts';
  const bodies = ['cardDeskBody'];
  const over = [];
  for (const b of bodies) {
    const m = copy.match(new RegExp(b + ":\\s*'((?:[^'\\\\]|\\\\.)*)'"));
    if (!m) { over.push(b + ' (not found)'); continue; }
    const sentences = (m[1].match(/[.?!](\s|$)/g) || []).length;
    const words = m[1].trim().split(/\s+/).filter(Boolean).length;
    if (sentences > 1) over.push(b + ' has ' + sentences + ' sentences, ceiling 1');
    if (words > 14) over.push(b + ' has ' + words + ' words, ceiling 14');
  }
  if (over.length) return 'over R-38.17\'s card-body ceiling: ' + over.join(', ');
  return null;
});

// ── C14 · MONEY REGISTER on the chips. send_to_couple's own description offers
//    「quote Ananya 4 lakh」 as its example; lakh/k/Cr shorthand and the rupee glyph are
//    forbidden on a vendor-facing surface, so the chip may not copy the tool verbatim.
cell('C14 money register holds on vendor-facing bytes', () => {
  const copy = strip(read('lib/worklist/copy.ts'));
  const strings = (copy.match(/'(?:[^'\\]|\\.)*'/g) || []).join(' ');
  if (/\u20b9/.test(strings)) return 'the rupee glyph appears in a vendor-facing byte';
  if (/\b\d+\s?(lakh|lakhs|cr|crore|k)\b/i.test(strings)) return 'money shorthand appears in a vendor-facing byte';
  return null;
});

// ── C15 · THE UNCONVERTED LITERALS. The variable layer cannot reach a hard-coded hex, and
//    the estate's loudest controls are hard-coded. A gold FAB on a graphite ground is the
//    conflation R-37.43 was picked to end, wearing the new palette.
cell('C15 no Espresso/Paper literal survives in a component rule', () => {
  const css = read('app/globals.css');
  const after = css.split('THE UNCONVERTED LITERALS')[1];
  if (!after) return 'the unconverted-literal block is absent — the FAB stays gold';
  for (const rule of ['.atelier-fab', '.atelier-today-coin']) {
    const idx = after.indexOf(rule);
    if (idx < 0) return rule + ' is not converted';
  }
  // the specific literals the founder walked into
  if (!/#6FD0BA/.test(after)) return 'the dark FAB does not carry the signal';
  if (!/#0D6A5A/.test(after)) return 'the light FAB does not carry the signal';
  if (/#D4B86A|#9B4E38|#7A3828/.test(after)) return 'an Espresso/Paper literal survives in the conversion block';
  return null;
});

// ── C16 · THE BRASS SPLIT (R-37.74 arm iii). One token was doing two jobs: telling you where
//    you are, and telling you what you can do. The split only holds if the interactive half
//    never falls back to gold — so every token map that HAS `brass` must also carry
//    `interactive`, and the caret colours (the most interactive pixels on any screen) must
//    have moved. A shadowed local map is where a split like this goes quietly wrong.
cell('C16 the brass split holds across every token map', () => {
  const fs2 = require('fs'), path2 = require('path');
  const walk = (d, out = []) => {
    for (const e of fs2.readdirSync(path2.join(ROOT, d), { withFileTypes: true })) {
      const rel = d + '/' + e.name;
      if (e.isDirectory()) walk(rel, out);
      else if (e.name.endsWith('.tsx')) out.push(rel);
    }
    return out;
  };
  const files = walk('components/vendor').concat(walk('app/vendor'));
  const carets = [];
  for (const f of files) {
    const src = read(f);
    // NOTE: an earlier draft of this cell also tried to catch a token map that offers
    // `brass` without `interactive`. It did not redden on its mutation — vacuous — and the
    // arm was cut rather than shipped. That defect is caught by the TYPE FLOOR: when
    // SliceRow's shadowed map lacked the key, `npx tsc --noEmit` produced two TS2339 errors.
    // A cell that duplicates a stronger guard badly is worse than no cell.
    for (const m of src.matchAll(/caretColor:\s*([AT])\.(\w+)/g)) {
      if (/^brass/.test(m[2])) carets.push(f + ' caretColor still gold');
    }
  }
  if (carets.length) return carets.join(', ');
  const th = read('lib/vendor/theme.ts');
  if (!/interactive:\s*'#68C9B4'/.test(th)) return 'DARK has no interactive token';
  if (!/interactive:\s*'#0D6A5A'/.test(th)) return 'LIGHT has no interactive token';
  return null;
});

// ── C17 · ROOMS-FIRST, ASSERTED ON ALL FOUR SURFACES AT ONCE (R-37.75). The manifest, the
//    bare-shell redirect, the seat order and the carried nav are four statements of one
//    decision. Any cell that checked only one would go green while the app argued with itself.
cell('C17 rooms-first agrees on every surface', () => {
  const man = JSON.parse(read('public/worklist-manifest.json'));
  if (man.start_url !== '/vendor/rooms') return 'manifest start_url is ' + man.start_url + ', expected /vendor/rooms';

  const idx = strip(read('app/vendor/(shell)/page.tsx'));
  if (!/replace\('\/vendor\/rooms'\)/.test(idx)) return 'the bare /w shell does not resolve to Rooms';

  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  const seats = [...shell.matchAll(/COPY\.(navRooms|navToday)/g)].map((m) => m[1]);
  if (seats.join(',') !== 'navRooms,navToday') return 'seat order is ' + seats.join(',') + ', expected Rooms then Today';

  // P7.2 AMENDMENT (labeled): the carried nav (components/vendor/BottomNav.tsx) is RETIRED
  // with the old tree. "One app, one nav" is now asserted as its absence.
  if (fs.existsSync(path.join(ROOT, 'components/vendor/BottomNav.tsx'))) return 'BottomNav is back: the old tree had one nav and it was retired at P7.2';

  // AMENDED, LABELLED — M-FINISH S1 (R-38.6/R-38.7). THE POINTER RETIRES WITH ITS SUBJECT.
  // It existed because Rooms-first meant a new vendor might never tap the second seat and
  // meet the manual; R-38.7 rules that Rooms shows the tile grid AND NOTHING ELSE, and a
  // directory does not advertise a manual. The assertion INVERTS — a silent re-add of the
  // vetoed card reddens — and the clause it replaces keeps doing the same job the old one
  // did after ZIP 7 tightened it: assert the MOUNT, never the mere presence of the byte.
  const grid = strip(read('components/worklist/RoomsGrid.tsx'));
  if (/roomsPointer|wl-pointer/.test(grid)) return 'the retired Rooms pointer is mounted again';
  // The mount half of the same amendment. ZIP 7 added this clause because checking that
  // COPY.roomsPointer merely APPEARED in the file went green with <Pointer /> deleted from
  // the render — the component still referenced the byte while rendering nothing. That
  // lesson is why the inverted assertion above reads the mount too, and why this line
  // inverts rather than disappearing: a byte with no mount and a mount with no ruling are
  // the same defect seen from two sides.
  if (/<Pointer\s*\/>/.test(grid)) return 'the retired Rooms pointer is mounted again';
  // The DESTINATION half. It asserted that the grid reaches /w/today, which was the
  // pointer's route. With the pointer retired the grid must not link to Today at all — the
  // nav seat is that door, and a second door to Today from inside Rooms is the two-homes
  // shape R-38.7 removed from this surface. The assertion moves to where the guarantee now
  // lives: Today is still one tap away, from the seat, on every shell surface.
  if (/\/vendor\/today/.test(grid)) return 'the grid links to Today again — the seat is that door';
  if (!/href="\/vendor\/today"/.test(shell)) return 'the Today seat is not an anchor in the shell';
  return null;
});

// ── C18 · R-37.80 · THE CHIP PROMISE, AND THE RAW-VAR CLASS. ZIP 5's split read A.brass and
//    was structurally blind to controls that reach for a raw CSS variable instead. The mock
//    drew the filter chips in Signal; this makes that picture true rather than aspirational.
cell('C18 raw-var controls carry the signal', () => {
  const rail = read('components/vendor/slices/FilterRail.tsx');
  if (/--role-metal|--atelier-brass/.test(rail)) return 'the selected filter chip still reads the metal';
  if (!/--atelier-accent-text/.test(rail)) return 'the filter rail carries no signal at all';
  const converted = {
    'components/vendor/slices/BulkBar.tsx': 'the bulk-action label',
    'components/vendor/AtelierForm.tsx': 'a toggle\u2019s filled state',
    'components/vendor/InputBar.tsx': 'the send button',
    'components/vendor/FilingChip.tsx': 'the filing chip',
  };
  const bad = Object.entries(converted)
    .filter(([f]) => !/--atelier-accent-text/.test(read(f)))
    .map(([, why]) => why);
  if (bad.length) return 'still metal: ' + bad.join(', ');
  return null;
});

// ── C19 · ONE THEME VOCABULARY, ONE FONT WORLD (R-37.76 (3)+(7), R-37.79's two branch fixes).
cell('C19 one vocabulary across shell and rooms', () => {
  const hdr = read('components/vendor/Header.tsx');
  if (/Espresso|Parchment/.test(hdr)) return 'the rooms\u2019 drawer still names a retired theme';
  // AMENDED, LABELLED — founder's second walk. Cell count unchanged; the assertion is
  // STRENGTHENED, not re-aimed. It read `Header.tsx` for the literals 「Graphite」 and
  // 「Chalk」 because that file HARDCODED its own drawer. It no longer has one: the second
  // drawer was replaced by `components/worklist/AccountDrawer.tsx`, which both trees mount,
  // and the mode names come from `COPY.themeDarkName`/`themeLightName` — their one home.
  //
  // ONE VOCABULARY IS NOW STRUCTURAL RATHER THAN CHECKED. The old cell could only ever
  // catch a divergence AFTER someone typed a second word; this catches the reappearance of
  // a second DRAWER, which is what made divergence possible. It reddens if Header stops
  // mounting the shared drawer, or if the copy home loses either mode name.
  if (!/AccountDrawer/.test(hdr)) return 'Header does not mount the shared drawer — a second drawer can diverge again';
  const copy = read('lib/worklist/copy.ts');
  if (!/themeDarkName:\s*'Graphite'/.test(copy) || !/themeLightName:\s*'Chalk'/.test(copy))
    return 'the mode names are not at their one home in copy.ts';
  const th = read('lib/worklist/theme.ts');
  if (!/TYPE_ROLE/.test(th) || !/typeCss/.test(th)) return 'the type roles are not tokened';
  const shell = read('components/worklist/WorklistShell.tsx');
  if (!/typeCss\(SCOPE\)/.test(shell)) return 'the shell does not emit the type scope';
  if (/'Jost',\s*sans-serif|'DM Sans',\s*sans-serif|'Cormorant Garamond',\s*serif/.test(shell))
    return 'the shell still hard-codes a font family instead of reading its role';
  return null;
});

// ── C20 · R-37.81(a) · the profile affordance opens the COUPLE VIEW, not the editor. Two
//    surfaces exist and they are one word apart; opening the wrong one is a label outrunning
//    its destination, which this arc has convicted twice already.
// AMENDED, LABELLED — M-FINISH S1 (R-38.7). THE ROW MOVED, THE ASSERTION DID NOT WEAKEN.
// The founder vetoed the horizontal-strip treatment on Rooms, so 「Profile layout」 leaves
// the grid and becomes a row inside Settings. R-37.81(a)'s substance is untouched and is
// the whole reason this cell exists: the affordance opens the COUPLE VIEW (/preview), not
// the EDITOR (/profile), because a vendor tapping 「how couples see you」 and landing in a
// form has been told a small lie by her own chrome. The cell now reads the new home, and
// it still reddens on the editor URL. It ALSO asserts the row is gone from the grid, so
// the vetoed strip cannot come back wearing this cell's approval.
cell('C20 the profile row opens the couple view', () => {
  const grid = strip(read('components/worklist/RoomsGrid.tsx'));
  if (/roomsProfileTitle/.test(grid)) return 'the vetoed profile row is back in the Rooms grid';
  const set = strip(read('app/vendor/(shell)/settings/page.tsx'));
  if (!/roomsProfileTitle/.test(set)) return 'no profile row in Settings — the byte lost its home in the move';
  if (/discover\/profile/.test(set)) return 'the row opens the EDITOR (/discover/profile); the couple view is /discover/preview';
  if (!/discover\/preview/.test(set)) return 'the row does not open /vendor/discover/preview';
  return null;
});

// ── C21 · NO CLASS WITHOUT A HOME ON ITS OWN SURFACE. The founder walked into a Rooms link
//    card rendered in browser defaults: it used .wl-card and .wl-cardtitle, which only
//    FirstRun defined, and FirstRun mounts on Today. A class used by two components and owned
//    by one is a single-home violation wearing CSS — it renders styled on one screen and
//    naked on the other, which is precisely how it was found.
cell('C21 every wl- class a component uses is defined somewhere the shell mounts', () => {
  const shell = read('components/worklist/WorklistShell.tsx');
  const defined = new Set();
  const collect = (src) => { for (const m of src.matchAll(/\.(wl-[a-z-]+)\s*[,{:]/g)) defined.add(m[1]); };
  collect(shell); collect(read('components/worklist/AiDock.tsx'));
  const surfaces = {
    'components/worklist/RoomsGrid.tsx': [],
    'components/worklist/FirstRun.tsx': [],
    'app/vendor/(shell)/today/page.tsx': [],
    'app/vendor/(shell)/support/page.tsx': [],
  };
  const orphans = [];
  for (const f of Object.keys(surfaces)) {
    const src = read(f);
    const own = new Set(defined);
    for (const m of src.matchAll(/\.(wl-[a-z-]+)\s*[,{:]/g)) own.add(m[1]);
    for (const m of src.matchAll(/className=[{"']*['"]([^'"]*)['"]/g)) {
      for (const c of m[1].split(/\s+/).filter((x) => x.startsWith('wl-'))) {
        if (!own.has(c)) orphans.push(f + ' uses .' + c + ' but nothing it mounts defines it');
      }
    }
  }
  if (orphans.length) return orphans.join(' | ');
  return null;
});

// ── C22 · R-37.82 (1) THE GUTTER LAW. The founder's misalignment existed because the rows
//    chose their own inset. The cure is not care, it is construction: the column owns one
//    gutter and no component under it may set a horizontal margin, width or padding-x.
cell('C22 no component takes back the gutter', () => {
  const shell = read('components/worklist/WorklistShell.tsx');
  if (!/--wl-gutter/.test(shell)) return 'the column declares no gutter token';
  if (!/\.wl-main > \*\{[^}]*padding-left:var\(--wl-gutter\)/.test(shell)) return 'the column does not apply its own gutter';
  const offenders = [];
  for (const f of ['components/worklist/RoomsGrid.tsx', 'components/worklist/FirstRun.tsx', 'app/vendor/(shell)/today/page.tsx']) {
    const css = read(f);
    for (const m of css.matchAll(/\.(wl-[a-z-]+)\{([^}]*)\}/g)) {
      const [, cls, decl] = m;
      // A NONZERO horizontal component only. `margin: 0 0 8px` is vertical rhythm and legal;
      // an earlier draft of this cell flagged it and would have taught the reader to ignore
      // the cell, which is worse than not having it.
      const mh = decl.match(/margin:\s*[\d.]+px\s+([\d.]+)px/);
      if (mh && Number(mh[1]) !== 0) offenders.push(cls + ' sets a horizontal margin');
      if (/margin-(left|right):/.test(decl)) offenders.push(cls + ' sets a side margin');
      if (/\bwidth:\s*calc\(100% -/.test(decl)) offenders.push(cls + ' sets its own width against the gutter');
      // ── F-38.58 · PADDING IS THE OTHER MECHANISM, AND THE CELL NAMED THE CLASS ──
      // This cell is called 「no component takes back the gutter」 and it read MARGIN only.
      // `.wl-fr{padding:0 0 24px}` took the gutter back through the shorthand's horizontal
      // component — same specificity as `.wl-main > *`, later in source order, so it won —
      // and the first-run region painted at x=0 for the whole arc while this cell stood
      // green beside it. **A cell scoped to one mechanism of its subject cannot see the
      // others**, and that is D-38.1's corollary for the third time on this arc.
      //
      // A ZERO horizontal padding is the whole finding, and flagging it is safe in both
      // directions: on a direct child of `.wl-main` it CANCELS the gutter, and anywhere
      // else it is a no-op that should have been written `padding-bottom`. Either way the
      // shorthand is wrong at the site. A NONZERO horizontal padding is a component's own
      // interior (`.wl-card{padding:16px}`) and is legal — flagging it would have taught
      // the reader to ignore this cell, which the margin half already learned once.
      const ph = decl.match(/padding:\s*([\d.]+)(?:px)?\s+([\d.]+)(?:px)?(?:\s+[\d.]+(?:px)?)*/);
      if (ph && Number(ph[2]) === 0)
        offenders.push(cls + ' zeroes the horizontal padding in shorthand — write padding-bottom, or it takes back the gutter');
      if (/padding-(left|right):\s*0/.test(decl)) offenders.push(cls + ' zeroes a side padding');
    }
  }
  if (offenders.length) return offenders.join(', ');
  return null;
});

// ── C23 · R-37.84 (7): THE COSTUME MUST TELL THE TRUTH. A field-shaped dock is only honest if
//    the tap opens somewhere you type. If the dock ever wears the field again while jumping to
//    WhatsApp, this reddens \u2014 the pairing is asserted, not remembered.
cell('C23 the dock\'s shape and its destination agree', () => {
  const dock = strip(read('components/worklist/AiDock.tsx'));
  const field = /wl-dockfield/.test(dock);
  const teleports = /wa\.me|waNumberFor/.test(dock);
  if (field && teleports) return 'the dock wears the field costume AND jumps to WhatsApp \u2014 a shape that lies';
  if (field && !/AskSheet/.test(dock)) return 'the dock wears the field costume but opens nothing you can type into';
  if (!field && /AskSheet/.test(dock)) return 'the dock opens the chat but hides it behind a row \u2014 the costume undersells the truth';
  const sheet = strip(read('components/worklist/AskSheet.tsx'));
  for (const need of ['ChatThread', 'InputBar', 'useChat', 'ThemeProvider']) {
    if (!new RegExp(need).test(sheet)) return 'the sheet does not carry ' + need;
  }
  if (/function ChatThread|function InputBar/.test(sheet)) return 'the sheet FORKED a carried component (D-2)';
  return null;
});

// ══════════════════════════════════════════════════════════════════════════════
// M-FINISH S2 · §4-1 · THE LIST FAMILY CROSSED. SEVEN CELLS.
//
// D-38.1 (S2 kickoff §1; banked at next band) governs every one of them: "A cell asserts
// behaviour, never presence; and it observes at the moment the defect is visible, not the
// moment the instrument is comfortable." Read concretely here that means C25 does not ask
// whether the word `WorklistShell` appears in a route file — it asks whether the route
// mounts the shell AND does not import the old masthead, which is the pair that was
// actually wrong. And C26 does not ask whether SliceShell "still has a Header import"; it
// counts every mount in the tree against a declared census, because the mount this family
// hid was in `notes.tsx`, a file nobody would have thought to look in.
// ══════════════════════════════════════════════════════════════════════════════

// A comment-blind reader of the whole tree. The base census S1 published was 28; re-derived
// through `strip()` it is 27, because a `<Header …/>` written inside a comment ABOUT
// `<Header …/>` was counted as a mount. F-38.24. The instrument that prevents exactly this
// is at the top of this file and was simply never pointed at the census.
function mountCensus(tag) {
  const seen = new Map();
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
      const rel = dir + '/' + e.name;
      if (e.isDirectory()) walk(rel);
      else if (e.name.endsWith('.tsx')) {
        const n = (strip(read(rel)).match(new RegExp('<' + tag + '[\\s/>]', 'g')) || []).length;
        if (n) seen.set(rel, n);
      }
    }
  };
  walk('app'); walk('components');
  return seen;
}

// ── THE CROSSED SET IS DERIVED, NEVER RETYPED  [§4-2] ───────────────────────
//    Four cells below held their own hand-typed list of the six list rooms. That is two
//    homes for one set, and the second home is the one that stops agreeing: calendar
//    crossed at §4-2 and not one of those four cells would have noticed — they would have
//    gone on asserting six rooms while the shell served seven, which is the audit's own
//    interim-list disease (S2 §5) reproduced in the bench written to guard against it.
//
//    A CROSSED ROOM IS A REGISTRY FACT: an entry whose href is a /w/ route with a page on
//    disk. Each of the seven remaining crossings widens these cells in the same edit that
//    changes a href, with nothing to remember. Verified non-vacuous: with calendar crossed
//    this returns seven, and the count is asserted below rather than assumed.
//
//    ⚠ AND THE FIRST CUT CONFLATED TWO CATEGORIES, WHICH THE RUN CAUGHT IMMEDIATELY.
//    Not every /w room is a CROSSED room. Billing, Settings, Business Solutions and Advisor
//    are SHELL-NATIVE — built for /w, with no body in the /vendor tree and no Slice Door
//    behind them — so `RoomBody` and the door-label clauses are meaningless for them and
//    reddened a correct tree on five counts. The distinguishing property is not the href;
//    it is whether the room's page imports a body out of `app/vendor`.
function shellRooms() {
  const reg = strip(read('lib/worklist/rooms.ts'));
  const ids = [];
  for (const m of reg.matchAll(/id:\s*'([a-z]+)'[^}]*href:\s*'(\/vendor\/[a-z]+)'/g)) {
    if (fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/' + m[1] + '/page.tsx'))) ids.push(m[1]);
  }
  return ids;
}

/** A room whose BODY came from the /vendor tree — the ones §4-1 and §4-2 move. */
function crossedRooms() {
  return shellRooms().filter((id) =>
    /from '@\/app\/vendor\//.test(strip(read('app/vendor/(shell)/' + id + '/page.tsx'))));
}

cell('C24 the six list rooms crossed in the registry, as a set', () => {
  const src = strip(read('lib/worklist/rooms.ts'));
  const FAMILY = ['leads', 'clients', 'invoices', 'expenses', 'events', 'notes'];
  for (const id of FAMILY) {
    const m = src.match(new RegExp("\\{\\s*id:\\s*'" + id + "'[^}]*href:\\s*'([^']+)'"));
    if (!m) return 'room ' + id + ' vanished from the registry';
    if (m[1] !== '/vendor/' + id) return id + ' still points at ' + m[1] + ' — the tile did not cross';
  }
  // THE SET, NOT A COUNT. A room that crosses without leaving the interim list is a registry
  // saying two different things about the same room.
  // P7.2 AMENDMENT (labeled, INVERTED): the INTERIM_VENDOR_ROOMS half retired with the old
  // tree. The set the cell asserts is now the whole registry: every href is /vendor/<id>,
  // the declaration is gone, and a /vendor/list/ address anywhere in the registry reds.
  if (/INTERIM_VENDOR_ROOMS/.test(src)) return 'INTERIM_VENDOR_ROOMS is declared again: the interim census was retired at P7.2';
  if (/\/vendor\/list\//.test(src)) return 'the registry names the deleted /vendor/list/ tree';
  const all = [...src.matchAll(/\{\s*id:\s*'([a-z]+)'[^}]*href:\s*'([^']+)'/g)];
  for (const m of all) if (m[2] !== '/vendor/' + m[1]) return m[1] + ' points at ' + m[2] + ', expected /vendor/' + m[1];
  return null;
});

cell('C25 each crossed room mounts the shell and no second masthead', () => {
  const bad = [];
  for (const id of crossedRooms()) {
    const f = 'app/vendor/(shell)/' + id + '/page.tsx';
    if (!fs.existsSync(path.join(ROOT, f))) { bad.push(f + ' does not exist'); continue; }
    const src = strip(read(f));
    if (!/<WorklistShell/.test(src)) bad.push(id + ' does not mount WorklistShell');
    if (/<Header[\s/>]/.test(src)) bad.push(id + ' mounts the old masthead inside the shell');
    if (/components\/vendor\/Header/.test(src)) bad.push(id + ' IMPORTS Header — a conditional does not empty a chunk');
    if (!/<RoomBody/.test(src)) bad.push(id + ' does not sit in RoomBody — it will double the gutter');
    if (!new RegExp('COPY\\.' + id + 'Title').test(src)) bad.push(id + ' does not take its header word from the copy register');
  }
  return bad.length ? bad.join(' | ') : null;
});

cell('C26 the old chrome mounts equal their declared census, exactly', () => {
  const src = strip(read('lib/worklist/rooms.ts'));
  const parse = (name) => {
    const m = src.match(new RegExp(name + '[^=]*=\\s*\\[([\\s\\S]*?)\\n\\] as const;'));
    if (!m) throw new Error(name + ' not found');
    return m[1];
  };
  // P7.2 AMENDMENT (labeled, RETIRED-WITH-THE-READER): INTERIM_VENDOR_MOUNTS and
  // INTERIM_BOTTOMNAV_MOUNTS retired with the old tree. The census that survives is the
  // Header's: it mounts ONLY in app/vendor/(legacy) (FORK 1 arm (a): hub and submit) and
  // nowhere the shell reaches; BottomNav mounts nowhere because the file is gone.
  void parse;
  const actual = mountCensus('Header');
  const problems = [];
  for (const [f, n] of actual) {
    if (!f.startsWith('app/vendor/(legacy)/')) problems.push('Header mounted outside (legacy): ' + f + ' (' + n + ')');
  }
  if (actual.size === 0) problems.push('Header mounts nowhere: the (legacy) hub/submit pages lost their chrome, or the census reader broke');
  if (fs.existsSync(path.join(ROOT, 'components/vendor/BottomNav.tsx'))) problems.push('BottomNav.tsx is back: retired at P7.2');
  return problems.length ? problems.join(' | ') : null;
});

cell('C27 the shell tree imports neither piece of the old chrome', () => {
  const offenders = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = dir + '/' + e.name;
      if (e.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(e.name)) {
        const src = strip(read(rel));
        if (/components\/vendor\/Header/.test(src)) offenders.push(rel + ' imports Header');
        if (/components\/vendor\/BottomNav/.test(src)) offenders.push(rel + ' imports BottomNav');
        // F-38.3's standing clause, carried onto the new routes rather than restated.
        if (/\buseT\s*\(/.test(src)) offenders.push(rel + ' reads useT — the shell reads CSS variables only');
      }
    }
  };
  walk('app/vendor/(shell)'); walk('components/worklist');
  return offenders.length ? offenders.join(' | ') : null;
});

cell('C28 the Slice Door goes where it is mounted, and its inactive chip is legible', () => {
  const src = strip(read('components/vendor/slices/SliceShell.tsx'));
  const door = src.slice(src.indexOf('export function SliceDoor'), src.indexOf('export function SliceShell'));
  if (!door) return 'SliceDoor not found';
  // BEHAVIOUR: the destination is a function of the tree, not a constant. A door that always
  // pushes /vendor is a /vendor href reachable from a shell control, which the standing
  // ruling forbids; a door that always pushes /w breaks the surviving fallback.
  // P7.2 AMENDMENT (labeled): one tree, one destination. The old assertion read the
  // inShell ternary; the ternary collapsed with useInShell. The door goes to the room.
  if (!/router\.push\(`\/vendor\/\$\{s\}`\)/.test(door)) return 'the door does not go to the room at /vendor/<slice>';
  if (/\/vendor\/list\//.test(door)) return 'the door still knows the deleted /vendor/list/ tree';
  // theme.ts:28-31 shipped the contrast obligation UNDER BAR and named this very line as the
  // cause. The cure is the removal of the opacity, so the cell asserts its absence at the
  // chip and the presence of two measured tokens in its place.
  if (/opacity:\s*isActive/.test(door)) return 'the inactive chip is still dimmed by a hard-coded opacity (theme.ts:28-31)';
  if (!/isActive \? 'var\(--atelier-ink\)' : 'var\(--atelier-ink-mute\)'/.test(door))
    return 'the chip does not carry the two measured ink tokens';
  return null;
});

cell('C29 the crossed body contributes no horizontal inset of its own (R-37.82 (1))', () => {
  const problems = [];
  // The column components only. Sheets and overlays are not children of the scroll column
  // and their own padding is theirs — flagging them would teach the reader to ignore this
  // cell, which is worse than not having it.
  const COLUMN = [
    'components/vendor/slices/SliceShell.tsx', 'components/vendor/slices/SliceRow.tsx',
    'components/vendor/slices/SwipeRow.tsx', 'components/vendor/slices/Masthead.tsx',
    'components/vendor/slices/FilterRail.tsx', 'components/vendor/slices/BinderCard.tsx',
  ];
  for (const f of COLUMN) {
    const src = strip(read(f));
    for (const m of src.matchAll(/padding[^:]*:\s*'([^']*22px[^']*)'/g)) {
      if (!/--slice-inset/.test(m[1])) problems.push(f + ' sets a bare 22px inset: ' + m[1]);
    }
  }
  // ONE DECLARER. If a second surface starts declaring the variable, the room's inset has two
  // homes again and the next disagreement between them is silent.
  const declarers = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = dir + '/' + e.name;
      if (e.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(e.name) && /--slice-inset'\s*as|--slice-inset\s*:/.test(strip(read(rel)))) declarers.push(rel);
    }
  };
  walk('app'); walk('components');
  if (declarers.length !== 1 || declarers[0] !== 'components/worklist/RoomBody.tsx')
    problems.push('the inset variable is declared at ' + (declarers.join(', ') || 'nowhere') + ', expected exactly components/worklist/RoomBody.tsx');
  return problems.length ? problems.join(' | ') : null;
});

cell('C30 the header words cannot drift from the door labels, and the toast follows the tree', () => {
  const copy = strip(read('lib/worklist/copy.ts'));
  const rowsrc = strip(read('components/vendor/slices/SliceRow.tsx'));
  const lm = rowsrc.match(/LABELS[^=]*=\s*\{([^}]*)\}/);
  if (!lm) return 'LABELS not found in SliceRow.tsx';
  const labels = {};
  for (const m of lm[1].matchAll(/([a-z]+):\s*'([^']+)'/g)) labels[m[1]] = m[2];
  const bad = [];
  // NOT the derived set: `LABELS` is keyed by DoorSlice and the Slice Door has exactly six
  // members. Calendar has no door label and never will, so widening this loop would assert
  // a correspondence that does not exist — which is what the first cut did, reporting
  // 「door label undefined」 against five rooms that never had one.
  for (const id of ['leads', 'clients', 'invoices', 'expenses', 'events', 'notes']) {
    const c = copy.match(new RegExp(id + "Title:\\s*'([^']+)'"));
    if (!c) { bad.push(id + 'Title has no home in the copy register'); continue; }
    if (c[1] !== labels[id]) bad.push(id + ': header word ' + JSON.stringify(c[1]) + ' but door label ' + JSON.stringify(labels[id]));
  }
  // The toast pairing rides in this cell rather than taking one of its own: it is the same
  // fact — a component reading a context the shell does not provide and painting the wrong
  // world without erroring.
  const shell = strip(read('components/vendor/slices/SliceShell.tsx'));
  if (/<Toast\s/.test(shell)) bad.push('SliceShell mounts Toast directly — inside /w it falls to createContext(DARK)');
  // BEHAVIOUR, NOT SHAPE. This read `ToastView = useInShell() ? WlToast : Toast` as one
  // literal until F-39.11 gave SliceScreen a second reader of the same fact and the
  // derivation was named (`screenInShell`) rather than called twice. The cell reddened on a
  // refactor that changed nothing it cares about — a line-shape assertion, the F-15.12
  // family. What must hold is that SliceScreen derives the tree ONCE and picks its toast
  // from that derivation, however the binding is spelled.
  // P7.2 AMENDMENT (labeled): the toast followed the tree; there is one tree. The pairing
  // ternary collapsed with useInShell; the cell now asserts the shell toast, outright.
  if (!/const ToastView = WlToast;/.test(shell)) bad.push('SliceScreen does not mount the shell toast (WlToast)');
  if (/useInShell/.test(shell)) bad.push('SliceShell still reads useInShell: the hook was retired at P7.2');
  const cl = strip(read('app/vendor/(shell)/clients/body.tsx'));
  if (/<Toast\s/.test(cl)) bad.push('the clients module mounts Toast directly');
  return bad.length ? bad.join(' | ') : null;
});


// ── C31 · NO UNDECLARED /vendor LITERAL REACHABLE FROM A CROSSED ROOM ────────
//
// THE SOURCE-SIDE TWIN OF THE AUDIT'S R-38.1 CELL, AND IT EXISTS BECAUSE THE AUDIT CAUGHT
// SOMETHING THIS BENCH COULD NOT. The S2 ZIP bounced on nine reachable pairs from four
// source sites — a tier-gate CTA and three cross-plane whispers, all hardcoded
// `/vendor/…` strings written years before the shell. R-38.11's SliceDoor re-point walked
// straight past every one of them, because none is a door, and nothing on this bench asked
// the question at all. The audit asks it of SERVED BYTES, which means it can only ask it
// after a deploy — so the founder found it, in a ZIP, which is three steps too late.
//
// R-38.11 AMENDED BY LABEL (CE-38 relay, S2 ZIP bounce): a crossing covers every file in a
// crossed room's IMPORT GRAPH, not only the files the room mounts. `notes.tsx` imports
// `SliceDoor` from `SliceShell.tsx`, so the tier gate three hundred lines away is in the
// notes chunk — one literal, six failing pairs. Reachable is reachable.
//
// SO THIS CELL WALKS THE GRAPH. Not the file, not the directory: the graph, transitively,
// from each of the six room entry points, exactly as a bundler does.
//
// ⚠ COMMENT-BLINDNESS HERE IS LOAD-BEARING AND IT IS NOT `strip()`. The first probe used a
// per-line strip and reported THIS SITTING'S OWN CURE NOTES as live literals, because a
// multi-line {/* */} comment is invisible to a reader that only ever sees one line. The
// blanker below preserves line counts so the address it reports is the address you open.
// F-39.79 (P7.2): a naive local stripper in the file B-1 exempted as the shared mirror's
// consumer. It now IS a consumer: the shared home keeps line count (blanks to newlines), so
// the `at:` line numbers below are unchanged.
function blankComments(src) { return stripComments(src); }

cell('C31 no /w literal and no door onto the deleted tree is reachable from any shell page (P7.2, inverted)', () => {
  const resolveSpec = (spec, from) => {
    let base = null;
    if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
    else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
    else return null;
    for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts', '']) {
      const p = base + ext;
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
    return null;
  };
  const walk = (entry, seen, hits) => {
    if (seen.has(entry)) return;
    seen.add(entry);
    const src = blankComments(fs.readFileSync(entry, 'utf8'));
    src.split('\n').forEach((line, i) => {
      // ── F-38.41 · THE MATCHER REQUIRED A TRAILING SLASH AND FOUR DOORS WALKED THROUGH ──
      // `/vendor?draft=` and `/vendor?aiPrimer=` are the OLD HUB ROOT with a query string and
      // no path segment. This expression matched `\/vendor\/` and could not see them, so
      // three shell surfaces have pushed the vendor out of the shell since §4-2 while this
      // cell reported zero strays. Second sighting of this exact family: S2's bounce found a
      // matcher that read double-quoted attributes only. **Match what you mean.**
      for (const m of line.matchAll(/['"`](\/vendor(?:\/[A-Za-z0-9\/_-]*|[?#][A-Za-z0-9_=-]*)?)/g)) {
        hits.push({ at: path.relative(ROOT, entry) + ':' + (i + 1), href: m[1] });
      }
      for (const m of line.matchAll(/['"`](\/w(?:\/[A-Za-z0-9\/_?=&#-]*)?)['"`]/g)) {
        hits.push({ at: path.relative(ROOT, entry) + ':' + (i + 1), href: m[1] });
      }
    });
    for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const r = resolveSpec(m[1], entry);
      if (r && !r.includes('node_modules')) walk(r, seen, hits);
    }
  };

  // THE DECLARED SETS ARE READ FROM THE REGISTRY, NEVER RETYPED HERE. Two homes for one set
  // is how the audit's own list went stale, and this cell would inherit the same disease by
  // copying it. A room that crosses shrinks the registry, and this cell tightens with it in
  // the same edit.
  const reg = strip(read('lib/worklist/rooms.ts'));
  const declared = new Set((reg.match(/href:\s*'(\/vendor\/[^']+)'/g) || []).map((x) => x.match(/'([^']+)'/)[1]));
  // F-38.60: anchored on the DECLARATION, matching wl_audit's cure. This cell has always
  // been safe because it strips first — that is why b40 was GREEN on the tree wl_audit
  // called red — but "safe because of what the other line does" is not a property to leave
  // two readers relying on. The anchor makes it safe on its own terms.
  // P7.2 AMENDMENT (labeled, INVERTED WITH THE FLIP). Every shell href is a /vendor href
  // now, so "no undeclared /vendor literal" changes shape: a crossed room may reach a shell
  // room, the entry redirect, onboarding, or a door declared in LEGACY_VENDOR_LINKS
  // (app/vendor/(legacy), FORK 1 arm (a)) and NOTHING the delete removed. The charter's
  // ZERO-/w/ cell rides in the same walk: any `/w` literal reachable from a room is a stray
  // by construction. The INTERIM_*/FALLBACK reads retired with their constants.
  const lm = reg.match(/export const LEGACY_VENDOR_LINKS[^=]*=\s*\[([\s\S]*?)\] as const;/);
  if (!lm) return 'LEGACY_VENDOR_LINKS is not declared: the doors out of the shell have no home in the registry';
  for (const x of lm[1].match(/'(\/vendor\/[^']+)'/g) || []) declared.add(x.slice(1, -1));
  // The two nav seats and the index redirect are shell addresses that are not registry
  // rooms; a template prefix (`/vendor/${s}`, `/vendor/collab/` + id) is a shell address
  // when a declared href starts with it.
  for (const seat of ['/vendor/rooms', '/vendor/today', '/vendor']) declared.add(seat);
  const isPrefixOfDeclared = (h) => h.endsWith('/') && (declared.has(h.slice(0, -1)) || [...declared].some((d) => d.startsWith(h) && d !== h));
  if (/INTERIM_|FALLBACK_TREE_BASES/.test(reg)) return 'an INTERIM_*/FALLBACK census is declared again: retired at P7.2';
  // ⚠ AN EARLY RETURN HERE WOULD HAVE MADE THIS CELL VACUOUS IN THE ONE DIRECTION THAT
  // MATTERS. The first cut returned on a missing FALLBACK_SLICE_BASE, so at the bounced
  // tree it reddened on the ABSENT CONSTANT and never walked the graph — it reported the
  // cure's own scaffolding as the finding and said nothing about the nine live literals it
  // exists to catch. Both-ways proof caught it: RED for the wrong reason is not RED on the
  // cure assertion. The missing declaration is now collected as one more stray and the walk
  // runs regardless, so the cell reddens on the DEFECT and mentions the scaffolding.
  // ── AMENDED BY LABEL — §4-4 BATCH ③. THE SCALAR BECAME A SET, AND THE CELL DID NOT ──
  // ── LOOSEN. `FALLBACK_SLICE_BASE` held one string because at S2 §9 there was one
  // tree-aware fallback base. Collab's interior is the second instance of the same class, and
  // a second scalar with a second name is how the class walks away from its cure — twice
  // filed on this arc already. The match is still EXACT, member by member: a BASE passes and
  // a whole carried href does not, which is the property that catches a room sliding back out
  // of the shell. What changed is the arity, not the strictness.

  const strays = new Map();
  // EVERY shell room, crossed or native: a /vendor literal reachable from Billing is as
  // wrong as one reachable from Leads, and the S2 bounce found its worst specimen in a tier
  // gate nobody thought of as a door. Verified at this cut: zero strays across all eleven.
  // The walk starts from every shell page: the nineteen registry rooms AND the three that
  // are not rooms (the index, Rooms, Today) — the P7.2 mutation on RoomsGrid proved the
  // registry-only walk blind to the grid.
  for (const room of [...shellRooms(), '', 'rooms', 'today']) {
    const entry = path.join(ROOT, 'app/vendor/(shell)/' + (room ? room + '/' : '') + 'page.tsx');
    if (!fs.existsSync(entry)) return 'app/vendor/(shell)/' + room + '/page.tsx does not exist';
    const hits = [];
    walk(entry, new Set(), hits);
    for (const h of hits) {
      if (declared.has(h.href)) continue;
      if (isPrefixOfDeclared(h.href)) continue;
      // EXACT, not prefix. '/vendor/list/' is the Door's tree-aware fallback and passes;
      // '/vendor/list/leads' is a full carried href and does not, because a whole address
      // in the bytes means a room slid back out of the shell.
      // The declared hub primers (F-38.41). EXACT, not prefix, for the same reason as the
      // fallback base: `/vendor?draft=` passes, `/vendor?draft=x/y` does not.
      // A bare `/vendor` with no query is a TYPE or a predicate, never a destination —
      // `tell_victor: { path: '/vendor' }` in the wire contract, `href.startsWith('/vendor')`
      // in RoomsGrid. Derived by reading all three sites, not assumed from the shape.
      if (h.href === '/vendor') continue;
      const key = h.at + ' ' + h.href;
      if (!strays.has(key)) strays.set(key, h.href + ' <- ' + h.at + ' (reachable from /vendor/' + room + ')');
    }
  }
  const problems = [...strays.values()];
  // P7.2: the census that excluded public/ was the finding (worklist-manifest.json carried
  // start_url /w/rooms past every code grep). Served assets are shell bytes too.
  for (const rel of fs.readdirSync(path.join(ROOT, 'public')).filter((n) => /\.(json|js|webmanifest)$/.test(n))) {
    const txt = fs.readFileSync(path.join(ROOT, 'public', rel), 'utf8');
    for (const m of txt.matchAll(/["'](\/w(?:\/[^"']*)?)["']/g)) problems.push(m[1] + ' <- public/' + rel);
  }
  // AN EMPTY SET IS THE MISSING DECLARATION, and it is collected as one more problem rather
  // than returned on, for the reason written above: a cell that reddens on its own
  // scaffolding never walks the graph it exists to walk.
  // ── AMENDED, LABELLED — CE-39 S2/6 · THE CELL IS INVERTED BY LABEL ────────
  // It read: an EMPTY set is the missing declaration, and pushed a problem. That was right
  // while four doors were live and undeclared. R-39.3 cured them — the doors are tree-blind
  // through lib/worklist/askContext.tsx and push nothing — so the empty set is now the
  // CURED state and a NON-EMPTY one is the regression: a primer back in this registry is a
  // shell door that pushes out of the shell again. The declaration itself must survive, or
  // this cell has nothing to read; `[] as const` is what it asserts.
  return problems.length ? problems.join(' | ') : null;
});

// ── C32 · NO PERSONA NAME IN ANY SHELL BYTE, AND 「DreamAi」 IS ONE NOW  [R-38.17] ──
//    The audit asks this of SERVED bytes on five surfaces. This asks it of the SOURCE, over
//    every file the shell owns, because the audit can only see what a fetch renders and a
//    string behind a condition nobody triggered is still a byte waiting to reach a vendor.
//    R-37.70's prose exemption for 「DreamAi」 retires with R-37.78's grammar: a ban with a
//    register-shaped exception is a ban that loses one sentence at a time.
// ── AMENDED, LABELLED — relay #3 item 1 · IT WALKS THE GRAPH NOW ────────────
//    The first cut read a HAND-LISTED SET of ten shell-owned files, and every byte the
//    chair's bounce found lived outside it: `Talk to DreamAi →` in AddSheet, the speaker
//    label in ConversationThread, the assistant label in MessageBubble, a dead placeholder
//    in the bride tree's token file that SliceRow drags into all six crossed rooms. A set
//    drafted before the crossing widened what the rooms bundle — the identical disease the
//    audit's own interim list had, and the identical cure: derive, never retype.
//    R-38.11 as amended: reachable is reachable. Proven by mutation — restoring the
//    MessageBubble byte reddens this cell alone.
cell('C32 no persona name reachable from any shell surface, DreamAi included (R-37.70 as amended)', () => {
  const resolveSpec = (spec, from) => {
    let base = null;
    if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
    else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
    else return null;
    for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts', '']) {
      const q = base + ext;
      if (fs.existsSync(q) && fs.statSync(q).isFile()) return q;
    }
    return null;
  };
  const hits = [];
  const seen = new Set();
  const walk = (entry) => {
    if (seen.has(entry)) return;
    seen.add(entry);
    let raw; try { raw = fs.readFileSync(entry, 'utf8'); } catch { return; }
    // COMMENT-BLIND, and it has to be: this cell's own file, copy.ts's tombstone and three
    // cure notes all EXPLAIN the ban by naming the word. A sweep that could not tell an
    // explanation from a shipped byte would either red a cured tree or teach seats to stop
    // writing down why.
    const src = strip(raw);
    // ⚠ FOUR SHAPES, AND THE FIRST CUT READ THREE. A persona name reaches a vendor as a
    // quoted string OR as bare JSX text, and the bare form is where `Talk to DreamAi →`
    // lived: across a line break, with an arrow glyph, inside a button. A character class
    // of letters and spaces walked straight past it — this instrument committing the exact
    // defect the S2 ZIP bounce convicted in wl_audit's double-quote-only matcher, in the
    // cell written to clean up after that bounce.
    //
    // AND THE SECOND CUT STILL MISSED IT, for a reason worth writing down: a JSX text node
    // is bounded by an angle bracket OR A BRACE. strip() collapses a JSX comment to an
    // empty pair of braces, so a cure note sitting above the very byte under test cut the
    // text run in half and the span never reached the name. Both boundary characters are
    // accepted now. Proven on all four shapes by mutation, each reddening this cell alone.
    // ⚠ FOURTH CUT, AND THE THIRD ONE COVERED ONE NAME OUT OF FIVE. The bare-JSX-text arm
    // hardcoded `DreamAi` INSIDE THE PATTERN, so the persona test below it only ever saw
    // runs containing that one word — and 「Ask Victor about this date →」, bare JSX text in
    // a sheet calendar dragged into the shell today, was invisible. The served-bytes gate
    // caught what this source sweep could not, which is the wrong way round for a cell whose
    // whole warrant is seeing behind conditions a fetch never triggers.
    //
    // THE HABIT, NAMED: each previous cut widened the SHAPE for the byte in front of me and
    // never for the CLASS the cell claims. The persona list has one home now and both arms
    // read it, so a sixth name is one edit and cannot land in only half the matcher.
    for (const m of src.matchAll(new RegExp(
      "'((?:[^'\\\\]|\\\\.)*)'" + '|"((?:[^"\\\\]|\\\\.)*)"' +
      '|[>}]([^<>{}]{0,300}?(?:' + PERSONAS + ')[^<>{}]{0,300}?)[<{]', 'g'))) {
      const lit = m[1] ?? m[2] ?? m[3] ?? '';
      if (new RegExp(PERSONAS).test(lit))
        hits.push(path.relative(ROOT, entry) + ' -> ' + lit.trim().slice(0, 50));
    }
    for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const r = resolveSpec(m[1], entry);
      if (r && !r.includes('node_modules')) walk(r);
    }
  };
  // EVERY SHELL SURFACE, derived from the routes on disk rather than listed — a room that
  // crosses joins this sweep in the same edit that creates its page.
  const wDir = path.join(ROOT, 'app/vendor/(shell)');
  const entries = fs.readdirSync(wDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(wDir, d.name, 'page.tsx'))
    .filter((f) => fs.existsSync(f));
  if (entries.length < 12) return 'only ' + entries.length + ' shell routes found under app/w — this sweep saw almost nothing and must not report a pass';
  for (const e of entries) walk(e);
  if (hits.length) return 'persona name reachable from the shell (' + entries.length + ' routes, ' + seen.size + ' files): ' + hits.join(' | ');
  // AND THE GRAMMAR THAT PERMITTED IT IS RECORDED AS RETIRED, not silently deleted.
  const copy = strip(read('lib/worklist/copy.ts'));
  if (!/R-37\.78/.test(read('lib/worklist/copy.ts'))) return 'R-37.78 retires without a tombstone in copy.ts';
  if (/askSheetNote:/.test(copy) === false) return 'the sheet no longer says where the reply lands';
  return null;
});

// ── C33 · THREE KEYS, ONE BYTE — THEY CANNOT DRIFT WHILE THEY ALL EXIST  [F-38.23's class] ──
//    `dockAria`, `dockRowTitle` and `cardAskTitle` are three separately-vetoed bytes that
//    currently spell the same words. The honest consolidation is a sitting of its own
//    because each has its own ruling behind it; until then the duplication is asserted
//    rather than explained, exactly as C30 does for the six header words.
cell('C33 the ask affordance spells one byte in three homes', () => {
  const copy = strip(read('lib/worklist/copy.ts'));
  const val = (k) => { const m = copy.match(new RegExp(k + ":\\s*'((?:[^'\\\\]|\\\\.)*)'")); return m ? m[1] : null; };
  const keys = ['dockAria', 'dockRowTitle', 'cardAskTitle'];
  const vals = keys.map(val);
  if (vals.some((v) => v === null)) return 'missing: ' + keys.filter((k, i) => vals[i] === null).join(', ');
  if (new Set(vals).size !== 1) return 'they have drifted: ' + keys.map((k, i) => k + '=' + vals[i]).join(' | ');
  // AND THE SHEET READS THE REGISTER RATHER THAN INLINING IT. The head was a literal in
  // AskSheet.tsx, which is the copy law broken by the file the copy law exists for.
  const ask = strip(read('components/worklist/AskSheet.tsx'));
  if (/>Ask TDW</.test(ask)) return 'AskSheet still inlines the vendor-facing title';
  if (!/COPY\.dockAria/.test(ask)) return 'AskSheet does not read the title from the register';
  return null;
});

// ── C34 · THE MASTHEAD REPORTS THE INSTRUMENT  [R-38.17 as amended at c-38.14] ──
//    F-38.31: 「Nothing needs you yet.」 asserts an absence nothing has checked, and a `0`
//    beside it is the identical claim in digits. Both are gated on the feed having
//    ANSWERED, and the gate has one home. The cell asserts the gate rather than the words,
//    because a surface that prints the right sentence for the wrong reason will print the
//    wrong one the moment the reason changes.
cell('C34 the numeral and the true-empty line are gated on a reading (F-38.31)', () => {
  const today = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/from '@\/lib\/worklist\/feed'/.test(today)) return 'Today does not read the feed module';
  const feed = strip(read('lib/worklist/feed.ts'));
  if (!/responded:\s*false/.test(feed)) return 'the feed module does not report that nothing has read anything';
  if (/openItems:\s*0\b/.test(feed)) return 'the feed module coerces an unread count to 0 — the lie in digits';
  // THE NUMERAL IS BEHIND THE GATE. A default would satisfy every cell about the sentence.
  if (/\?\?\s*0/.test(today)) return 'the numeral falls back to 0 — an unmeasured zero is the claim F-38.31 convicted';
  // ⚠ S4/3 · THE GATE NARROWED AND THE ASSERTION FOLLOWS IT. The numeral used to render
  // on any reading, including the resting day's measured 0. D-1/c5 draws no numeral on
  // A1-rest — a 0 beside 「All clear.」 says the same thing twice — so the gate is now the
  // WORKING state. F-38.31 is not weakened by that: `working` is DEFINED from
  // `feed.responded`, which this cell asserts rather than assuming, so there is still no
  // path on which a numeral paints without a reading behind it.
  if (!/const working\s*=\s*feed\.responded/.test(today)) return 'the working state is not derived from a reading — the numeral could paint unmeasured';
  if (!/\{working && feed\.openItems !== null && \(/.test(today)) return 'the numeral is not gated on the working state';
  // AMENDED TWICE, BOTH LABELLED. Relay #3 item 2 withheld the true-empty arm with its
  // byte, and this cell refused its presence. PHASE 4 DISCHARGES THAT: the feed answers, so
  // BOTH bytes are live and what the cell must hold is that each is gated on the state it
  // describes. The refusal that does NOT change is the one that matters — a status byte
  // must never stand over cards, because a heading claiming emptiness above eleven rows is
  // F-38.31 with the sign flipped.
  if (!/COPY\.todayNotLive/.test(today)) return 'the surface does not print the not-reading status';
  if (!/COPY\.todayNothingYet/.test(today)) return 'the true-empty byte has no consumer while the feed answers';
  if (!/!feed\.responded && <h1[^\n]*todayNotLive/.test(today))
    return 'the not-reading line is not gated on the absence of a reading';
  // ⚠ S4/3 · THE BYTE MOVED STATES (D-1/c5) AND THE ASSERTION MOVES WITH IT.
  // 「Nothing needs you yet.」 is the FIRST-RUN status line now, not the resting one. The
  // F-38.31 guard stands in its new place and is the thing this arm holds: `has_any ===
  // false` is an ANSWER — the feed ran and reported that nothing has ever existed — not an
  // absence. The refusal that does NOT change is that no status byte may stand over cards.
  if (!/\{firstRun && <h1[^\n]*todayNothingYet/.test(today))
    return 'the true-empty line is not gated on first-run';
  if (/\{working && <h1/.test(today))
    return 'a status byte stands over the cards (R-39.13)';
  return null;
});

// ── C35 · THE ADD CONTROL  [R-38.18] ────────────────────────────────────────
//    Order, legs and scope. The ORDER is the anti-feature (R-37.22's reasoning: a control
//    that moves under the thumb cannot be learned), and the LEGS are the claim that this is
//    an entrance rather than a second home for create.
cell('C35 the Add control: frozen order, seven real legs, Rooms only', () => {
  const fab = strip(read('components/worklist/AddFab.tsx'));
  const order = (fab.match(/\{\s*id:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  const want = ['calendar', 'lead', 'client', 'invoice', 'expense', 'event', 'note'];
  if (order.join(',') !== want.join(',')) return 'row order is ' + order.join(' ') + ', ruled ' + want.join(' ');
  // AMENDED, LABELLED — §4-2. THE THIRD CASE CLOSED, AND THE ASSERTION INVERTS.
  // R-38.18 named three kinds of leg: a /w/ route, an AddSheet leg, or a DECLARED interim
  // href — and calendar was the third kind. It crossed at §4-2, so the interim clause is
  // now FALSE and asserting it would red a correct tree. RETIRE-WITH-THE-READER: the cell
  // asserts the successor rather than dropping the claim, so a calendar that slid back out
  // of the shell reddens here too.
  //
  // WHAT DID NOT CHANGE IS THE POINT: the call site still asks `roomHref`. It was never
  // touched by the crossing — the registry answered differently and the leg followed. That
  // is the address book's whole warrant and it is asserted, not admired.
  if (!/roomHref\('calendar'\)/.test(fab)) return 'the calendar leg spells an address instead of asking the registry';
  // P7.2 AMENDMENT (labeled): the interim-room read retired with INTERIM_VENDOR_ROOMS; the
  // leg is proven by the page existing in the shell tree (the next line), nothing else.
  if (!fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/calendar/page.tsx')))
    return 'the calendar leg resolves to a /w/ route that does not exist — never-404';
  if (!/'\/vendor\/notes\?add=1'/.test(fab)) return 'the note leg does not open the notes composer';
  const slices = (fab.match(/slice:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  if (slices.join(',') !== 'leads,clients,invoices,expenses,events')
    return 'the AddSheet legs are ' + slices.join(' ') + ', expected the five list slices in row order';
  // NO SECOND FORM. Every create hands off to the surface that already owns it.
  if (/CreateLeadRequest|createInvoice|createExpense/.test(fab)) return 'the Add sheet builds its own create call — a second home for create';
  // SCOPE IS A MOUNT, not a pathname test inside the component.
  if (/usePathname/.test(fab)) return 'the control decides for itself where it exists — a second copy of R-38.18';
  const mounted = ['app/vendor/(shell)/rooms/page.tsx'];
  const others = ['app/vendor/(shell)/today/page.tsx', 'components/worklist/WorklistShell.tsx'];
  for (const f of mounted) if (!/<AddFab/.test(strip(read(f)))) return 'the Add control is not mounted on Rooms';
  for (const f of others) if (/<AddFab/.test(strip(read(f)))) return 'the Add control is mounted outside Rooms: ' + f;
  // c-38.11: the accent TOKEN, never a literal. The ZIP 4 gold-FAB finding was this
  // control painting a hard-coded brass that bypassed the variable layer.
  //
  // ── AMENDED, LABELLED — CE-39 S2/6 · RETIRE-WITH-THE-READER  [F-39.4] ────────
  // The colour clause read `AddFab.tsx` because the seat rule lived there. F-39.4 moved the
  // rule to WorklistShell's SHELL_CSS — three rooms draw a FAB now, and shared chrome lives
  // in the shell — so this cell went red WITH the cure, on a file that had simply stopped
  // being where the rule is. THAT IS F-38.27'S FAMILY AND ITS SECOND SIGHTING TODAY: an
  // assertion naming a LOCATION rather than a property. **Benches move with the code they
  // test.** The subject is unchanged and is what is asserted: the one FAB rule paints from
  // the accent token and no literal. It is read where the rule now is.
  const fabRule = strip(read('components/worklist/WorklistShell.tsx')).match(/\.wl-fab\{([^}]*)\}/);
  if (!fabRule) return 'the wl-fab rule is not in the shell — the seat has no home to assert against';
  if (/#[0-9a-fA-F]{6}|rgba?\(/.test(fabRule[1].replace(/rgba\(0,0,0,\.\d+\)/g, '')))
    return 'the Add control hard-codes a colour — c-38.11 puts it on var(--atelier-accent-text)';
  if (!/background:var\(--atelier-accent-text\)/.test(fabRule[1])) return 'the FAB is not on the accent token';
  // AND THE FILE THAT LOST THE RULE MUST NOT GROW A SECOND ONE.
  if (/\.wl-fab\{/.test(fab)) return 'AddFab has taken the seat rule back — two homes for one control';
  return null;
});

// ── C36 · THE NOTE LEG HAS A DESTINATION THAT ANSWERS  [item 5] ─────────────
//    A leg to `/w/notes?add=1` is a never-404 promise about a parameter, not just a route.
//    The route exists; the parameter has to be READ, and by the surface that already owns
//    the composer rather than by a second one.
cell('C36 ?add=1 opens the composer the notes body already owns', () => {
  const body = strip(read('components/vendor/NotesBody.tsx'));
  if (!/get\('add'\)/.test(body)) return 'NotesBody never reads the add parameter';
  if (!/setAddOpen\(true\)/.test(body)) return 'the parameter does not open the existing composer';
  // ONE READ, ON MOUNT. A dependency array would re-open the sheet behind a vendor who had
  // just dismissed it.
  const m = body.match(/get\('add'\)[\s\S]{0,220}?\}, \[([^\]]*)\]\);/);
  if (!m) return 'the add-parameter effect has no visible dependency array';
  if (m[1].trim() !== '') return 'the add-parameter effect re-runs on ' + m[1] + ' — it must fire once, on mount';
  return null;
});

// ── C37 · THE WITHHELD RUNG SURVIVES ITS WITHHELD CONSUMER  [F-38.31 / c-38.14] ──
//    The audit cannot hold this claim and the reason is the whole of the division:
//    `typeCss` builds each rung as a template literal, which compiles to concatenation, so
//    the string `--wl-t0:` never exists in a served byte. The declaration is a SOURCE fact.
//    The consumer's absence is a served-bytes fact (wl_audit). Whether it paints is a
//    computed fact (C-R17). One claim each, and none of them borrowed.
//
//    WHY IT MATTERS RATHER THAN BEING TIDY: with the numeral withheld, nothing anywhere
//    reads t0. A rung with no reader is exactly the thing a later sweep deletes as dead —
//    and Phase 4 would then re-invent the Today numeral at whatever size looked right,
//    against R-37.88's ratified mock. The rung has to outlive its own consumer.
cell('C37 the t0 rung survives while its consumer is withheld', () => {
  const theme = strip(read('lib/worklist/theme.ts'));
  const m = theme.match(/t0:\s*\{([^}]*)\}/);
  if (!m) return 'the t0 rung is gone from lib/worklist/theme.ts — Phase 4 will re-invent the numeral at a new size';
  const size = (m[1].match(/size:\s*(\d+)/) || [])[1];
  const weight = (m[1].match(/weight:\s*(\d+)/) || [])[1];
  if (size !== '46' || weight !== '500')
    return 'the t0 rung drifted to ' + size + '/' + weight + ' while nothing consumed it — R-37.88 ratified 46/500';
  if (!/'t0'/.test(theme)) return 't0 is not in the RUNGS list, so typeCss never emits it';
  // ── PHASE 4 · THE CONSUMER CAME BACK, AND THE ASSERTION INVERTS WITH IT ────
  // While the numeral was withheld this arm asserted that NOTHING consumed the rung. The
  // feed answers now, so the honest claim is the one R-38.4 always made: t0 is ONE element
  // per app, and that element is Today's numeral. A rung declared with no consumer is a
  // variable somebody re-invents at a new value; a rung with two is the five-rung scale's
  // exception quietly becoming a rule.
  const today = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/var\(--wl-t0\)/.test(today)) return 'the masthead numeral does not consume t0 — the rung has no home';
  if (!/wl-mnum\{font:var\(--wl-t0\)/.test(today)) return 'something other than the numeral consumes t0 on Today';
  return null;
});

// ── C38 · THE WITHHELD ADDRESS MUST NOT BE A LIVE EXPORT  [F-38.55 / c-38.28 / F-38.49] ──
//    THIS CELL EXISTS BECAUSE ITS RULE DID NOT HAVE ONE, AND THE RULE LOST.
//
//    S3 deleted `cardLinkAddressBase` at e3db79e for two reasons, both written down twice
//    and both correct: it was a SECOND home for the vendor's domain literal beside
//    `pathAddressFor()`/`subdomainFor()` in lib/solutions/types.ts (F-38.49), and its
//    withholding had been discharged on a misread trigger — the seat proved `app/v` exists
//    in a BRANCH when the condition was PRODUCTION serving a 200, and the founder opened
//    thedreamwedding.in/v/DEV440 and got a 404 off his own first-run card (c-38.28).
//
//    A whole-file copy from a delivery based one commit earlier put it back. The apply had
//    skipped `tools/base_guard.sh`, which is the control written for exactly that, and it
//    was the ONLY control: this bench ran GREEN and the floor came back at the named base
//    on the reverted tree, because both were right — nothing anywhere asserted the absence.
//    A guard is one command a human can forget. THIS IS THE SECOND CONTROL, and it fails
//    whoever reintroduces the key, however they do it.
//
//    THE S2 LAW IT ENFORCES, RESTATED AT ITS SITE: **a withheld byte must not be a live
//    export.** 「Nothing needs you yet.」 sat on a retired list and shipped anyway, because a
//    live export ships and a list stops nobody. The scope below is `lib/` entire rather than
//    copy.ts alone for the same reason — the finding is not "this key is in this file", it
//    is "this address has one home", and a key re-added one directory over is the identical
//    defect with a new address.
//
//    D-38.1: this asserts BEHAVIOUR (the export does not exist) and not presence, and it
//    could fail on the broken tree — it was verified failing on the reverted tree before
//    the restore, naming the file and the line.
cell('C38 the withheld vendor address is not a live export anywhere in lib/ (F-38.55)', () => {
  // ── THE SHAPES ARE A TABLE, NEVER INLINE  [F-38.45's law, and it caught this cell] ──
  //    The first cut of this matcher read `cardLinkAddressBase\s*:` — the OBJECT-LITERAL
  //    KEY, which is the shape the byte had in copy.ts when I wrote it. Its NAME claimed
  //    "a live export anywhere in lib/", and a plant of
  //    `export const cardLinkAddressBase = '…'` in lib/solutions/types.ts passed it green.
  //    A cell scoped to one of several shapes of its subject cannot see the others, and
  //    this one was written to BE the second control after a rule with no cell lost.
  //    Caught by mutating live source, not by reading it back.
  const KEY = 'cardLinkAddressBase';
  const SHAPES = [
    { what: 'object-literal key',    re: new RegExp('^.*\\b' + KEY + '\\s*:', 'm') },
    { what: 'binding declaration',   re: new RegExp('^.*\\b(?:const|let|var)\\s+' + KEY + '\\b', 'm') },
    { what: 'named re-export',       re: new RegExp('^.*export\\s*\\{[^}]*\\b' + KEY + '\\b', 'm') },
    { what: 'function or class decl', re: new RegExp('^.*\\b(?:function|class)\\s+' + KEY + '\\b', 'm') },
  ];
  const hits = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const r = rel + '/' + e.name;
      if (e.isDirectory()) { walk(r); continue; }
      if (!/\.(ts|tsx)$/.test(e.name)) continue;
      const src = strip(read(r));
      for (const s of SHAPES) {
        const m = src.match(s.re);
        if (m) hits.push(r + ' (' + s.what + ') — ' + m[0].trim().slice(0, 60));
      }
    }
  };
  walk('lib');
  if (hits.length)
    return 'the withheld address is a live export again: ' + hits.join(' · ')
      + ' — it has ONE home (pathAddressFor in lib/solutions/types.ts) and the row in '
      + 'FirstRun.tsx stays withheld until `curl -sS -o /dev/null -w "%{http_code}" '
      + 'https://thedreamwedding.in/v/DEV440` returns 200';
  return null;
});

// ── C39 · A FIXED CONTROL IN A CROSSED BODY READS THE TREE  [F-38.59] ─────────────
//    HOMED HERE ON PURPOSE, BESIDE C24/C25/C26. This file is where the crossing checklist
//    lives — the registry set, the shell mount, the census — so batch ③ and every crossing
//    after it inherits this cell for free rather than someone remembering to write it. A
//    cell filed next to the thing it guards is the only kind that gets run by accident.
//
//    THE RULE EXISTED AND HAD NO CELL, WHICH IS WHY IT LOST TWICE. `SliceShell` derived the
//    pair when the list family crossed and wrote the arithmetic at its own site: 82 clears
//    the OLD shell's BottomNav; the worklist shell's chrome is the dock (8+44+8) plus the
//    nav seat (52) = 112.5, and 120 is that plus one step of the 8-scale. Calendar crossed
//    at §4-2 keeping a bare 82 and its Add button sat ON the ask field; Contracts and TDS
//    would have made it three. Nothing caught it — the render arm measures text edges,
//    container edges and tuples, and no cell measured a control's clearance.
//
//    ⚠ AND IT IS A HIT-TEST, WHICH IS WHY IT RATES A CELL RATHER THAN A NOTE. R-38.22 ruled
//    the sheets fine because they are FULL-cover with live catchers. A FAB at 82 is
//    PARTIALLY behind the dock: the top of a 46px button clears, the bottom does not, and
//    the thumb lands on the ask field. Partial coverage is the shape that stops a batch.
//
//    Fourth instance of the class-walks-away shape on this arc, and the first that was a
//    hit-test: a cure applied where somebody happened to be looking, and the class left to
//    find its own way to the next site.
// ── AMENDED, LABELLED — CE-39 S2/6 · THIS CELL STOPPED AT THE FIRST FILE  [F-39.4] ──
//    IT WAS WRITTEN FOR EXACTLY THE DEFECT THE FOUNDER FOUND AND IT COULD NOT SEE IT.
//    `components/vendor/NotesBody.tsx` drew a fixed FAB at `bottom: calc(80px + …)` with no
//    tree awareness, so inside the shell it painted ON the ask dock — F-38.59, live, through
//    the sitting that cured F-38.59. This cell walked `app/w/*/page.tsx`, collected only the
//    bodies imported DIRECTLY from `app/vendor/…`, and read those files alone. Notes imports
//    `app/vendor/list/[slice]/notes`, which imports `NotesBody` from `components/` — one hop
//    further out, and invisible.
//
//    C31 ALREADY KNEW BETTER. It walks the import graph transitively, "exactly as a bundler
//    does", because the S2 bounce taught it that reachable is reachable. That lesson was
//    learned in one cell and never carried to its neighbour, which is the same
//    class-walks-away shape this cell's own comment complains about four lines down.
//    **A cell that stops at the first file is presence, not behaviour** (F-19.37's kin: the
//    identity of what you measured precedes any verdict about it).
//
//    SO THE WALK IS THE GRAPH NOW, and a fourth FAB in a fifth file is caught by existing.
cell('C39 a fixed control anywhere in a crossed room\'s graph clears the shell chrome (F-38.59, F-39.4)', () => {
  const resolveSpec = (spec, from) => {
    let base = null;
    if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
    else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
    else return null;
    for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts', '']) {
      const p = base + ext;
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
    return null;
  };
  const bodies = new Set();
  const collect = (abs, seen) => {
    if (seen.has(abs)) return;
    seen.add(abs);
    const rel = path.relative(ROOT, abs);
    // The shell's OWN components are not "crossed bodies" — they are the chrome this cell
    // measures clearance AGAINST, and they carry the ruled seat rather than a bare offset.
    if (!rel.startsWith('components/worklist/') && !rel.startsWith('app/vendor/(shell)/')) bodies.add(rel);
    for (const m of strip(fs.readFileSync(abs, 'utf8')).matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const r = resolveSpec(m[1], abs);
      if (r && !r.includes('node_modules')) collect(r, seen);
    }
  };
  const walkRoutes = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const r = rel + '/' + e.name;
      if (e.isDirectory()) { walkRoutes(r); continue; }
      if (e.name !== 'page.tsx') continue;
      collect(path.join(ROOT, r), new Set());
    }
  };
  walkRoutes('app/vendor/(shell)');
  if (!bodies.size) return 'no crossed bodies found from app/w — this cell would pass vacuously';
  const offenders = [];
  for (const b of [...bodies].sort()) {
    const src = strip(read(b));
    // Only FIXED controls anchored to the BOTTOM. A fixed full-cover scrim (`inset:0`) is
    // R-38.22's ruled sheet behaviour and is not this cell's subject; a sheet PANEL at
    // `bottom:0` spans the full width and is covered by its own scrim, so it is not a
    // partial-coverage hit-test either. What this catches is a control with a bottom
    // OFFSET — a FAB — which is the only shape that can sit half-behind the chrome.
    // ── AMENDED, LABELLED — CE-39 S2/6. THE CURE'S SHAPE CHANGED AND THE SKIP FOLLOWED IT.
    // The old skip read `inShell ?` INSIDE the bottom expression, because at F-38.59 the
    // cure was a ternary in the value. F-39.4's cure is one rung up: the shell arm renders
    // components/worklist/Fab.tsx and names no number at all, while the /vendor arm keeps
    // its own literal and dies with that tree at Phase 7. So the lawful literal is no
    // longer near a ternary — it is on a DECLARED element.
    //
    // ⚠ AND IT IS DECLARED RATHER THAN INFERRED, WHICH IS THE WHOLE POINT. The first cut
    // of this amendment looked backwards N characters for the word inShell and passed or
    // failed on how far away it happened to sit — a cell whose verdict depends on
    // whitespace. `data-tree="vendor"` is the element SAYING which tree it belongs to,
    // the same shape as every INTERIM_ set in the registry: declared, not allowed, and
    // countable. A control that wants the exemption has to claim it in the markup.
    for (const m of src.matchAll(/position:\s*'fixed'[^}]*?bottom:\s*([^,}]+)/g)) {
      const expr = m[1];
      if (!/calc\(/.test(expr)) continue;          // bottom:0 and friends: not an offset
      // ── THE inShell SKIP IS RETIRED — CE-39 S2/8 RULING ────────────────────────
      // It read: `if (/inShell\s*\?/.test(expr)) continue;  // reads the tree — the cure`.
      // True at F-38.59, when a tree-aware ternary in the bottom VALUE was the cure. F-39.4
      // moved the cure one rung up — the shell arm renders components/worklist/Fab.tsx and
      // names no number — so the ternary stopped being a cure and became the shape a fourth
      // seat hides in. app/vendor/calendar/screen.tsx carried a textbook one and this cell
      // exempted it by name for two sittings; the founder found it on a walk.
      //
      // **F-38.59's CURE SHAPE IS F-39.4's DEFECT SHAPE.** A cell that keeps honouring a
      // retired cure is not a lenient cell, it is a blind one — and it goes on printing
      // green while the thing it guards walks away. The only lawful exemption now is the
      // marker below: the /vendor arm SAYING which tree it belongs to.
      // The declaration sits on the opening tag, so look back to it and no further.
      const tagStart = src.lastIndexOf('<button', m.index);
      if (tagStart !== -1 && /data-tree="vendor"/.test(src.slice(tagStart, m.index))) continue;
      offenders.push(b + ' — ' + expr.trim().slice(0, 72));
    }
  }
  if (offenders.length)
    return 'a fixed control carries a bare bottom offset in a body reachable from /w, so it '
      + 'sits behind the dock and the nav inside the shell: ' + offenders.join(' · ')
      + ' \u2014 the ruled shape since F-39.4 is: the shell arm renders '
      + 'components/worklist/Fab.tsx and names NO number (the seat reads GRID.fab), while '
      + 'a /vendor arm keeps its own literal and declares itself with data-tree="vendor". '
      + 'Founder ruling 2026-08-29: the FAB sits right on Rooms and nowhere else.';
  return null;
});

// ── C49 · ONE FAB, ONE SEAT, EVERY ROOM  [F-39.4, founder ruling 2026-08-29] ────
//    ⚠ RE-DERIVED FROM A CLEAN READ AT CE-39 S2/8, AND THE REASON IS THE WORST KIND.
//    The first cut of this cell CORRECTLY reported app/vendor/calendar/screen.tsx. The seat
//    that wrote it called the hit a false positive, asserted without deriving that the two
//    facts sat "hundreds of lines apart in unrelated rules", and narrowed the cell until it
//    went quiet — with a green bench on the other side of the decision. The hit was true:
//    calendar carried a fourth seat, the founder found it on a walk, and retiring C39's
//    skip then found a fifth and a sixth.
//
//    **A cell narrowed until it stops reporting is not a cell, and the narrowing is worse
//    than the defect it hid** — the instrument had done its job and a human overruled it
//    without evidence. Ruled UNSOUND at 08ecf78 and rewritten here from the surfaces rather
//    than patched from the old text. Its non-vacuity proof is the calendar hit itself.
//
//    WHAT IT ASSERTS, and each clause earns its place:
//      (1) the seat is declared ONCE, in GRID.fab, and emitted — a constant nothing emits
//          is a rule reading an undefined variable, which falls through to the user agent
//          (C-R6's own finding on the dock glyph)
//      (2) the one rule reads those variables rather than restating them
//      (3) NO shell-reachable file draws a FAB of its own. Absence across the graph, which
//          is the only shape that catches a seventh seat in a seventh file.
cell('C49 one FAB seat, read from GRID, and no room draws its own (F-39.4)', () => {
  const theme = strip(read('lib/worklist/theme.ts'));
  const g = theme.match(/fab:\s*\{\s*size:\s*(\d+),\s*bottom:\s*(\d+)\s*\}/);
  if (!g) return 'GRID has no fab seat — the one home for the size and the offset is missing';
  if (!/--wl-fab:\$\{GRID\.fab\.size\}px/.test(theme) || !/--wl-fab-bottom:\$\{GRID\.fab\.bottom\}px/.test(theme))
    return 'the fab seat is declared but never emitted — the rule would read an undefined variable';
  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  const rule = shell.match(/\.wl-fab\{([^}]*)\}/);
  if (!rule) return 'the wl-fab rule is not in the shell — a room using the class would paint an unstyled button';
  if (!/width:var\(--wl-fab\)/.test(rule[1]) || !/height:var\(--wl-fab\)/.test(rule[1]))
    return 'the wl-fab rule states its own size instead of reading GRID.fab';
  if (!/bottom:calc\(var\(--wl-fab-bottom\)/.test(rule[1]))
    return 'the wl-fab rule states its own bottom offset instead of reading GRID.fab';
  if (!/right:var\(--wl-gutter\)/.test(rule[1]))
    return 'the FAB sits at its own x rather than the gutter — the edge defect (R-38.5) wearing a circle';

  // THE GRAPH, walked as C31 walks it. Never a typed list: six seats existed when four
  // were believed to, and a hand-written corpus is how the seventh would hide.
  const resolveSpec = (spec, from) => {
    let base = null;
    if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
    else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
    else return null;
    for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts', '']) {
      const p = base + ext;
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
    return null;
  };
  const reach = new Set();
  const collect = (abs) => {
    if (reach.has(abs)) return;
    reach.add(abs);
    for (const m of strip(fs.readFileSync(abs, 'utf8')).matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const r = resolveSpec(m[1], abs);
      if (r && !r.includes('node_modules')) collect(r);
    }
  };
  const walkRoutes = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const r = rel + '/' + e.name;
      if (e.isDirectory()) { walkRoutes(r); continue; }
      if (e.name === 'page.tsx') collect(path.join(ROOT, r));
    }
  };
  walkRoutes('app/vendor/(shell)');
  if (reach.size < 10) return 'only ' + reach.size + ' files reachable from app/w — this cell would pass over a graph it never walked';

  const offenders = [];
  for (const abs of [...reach].sort()) {
    const rel = path.relative(ROOT, abs);
    if (rel === 'components/worklist/WorklistShell.tsx') continue;   // the seat's one home
    const src = strip(fs.readFileSync(abs, 'utf8'));
    // A FIXED control with a BOTTOM OFFSET is a FAB by shape. The ruled shell arm names no
    // number at all, so ANY literal or ternary here is a second seat — including one that
    // happens to hold the ruled value today, because a copy that agrees is still a copy.
    for (const m of src.matchAll(/position:\s*'fixed',?\s*bottom:\s*([^,}]+)/g)) {
      if (!/calc\(/.test(m[1])) continue;
      const tagStart = src.lastIndexOf('<button', m.index);
      // The /vendor arm is lawful ONLY where the element declares its tree. Read to the
      // opening tag and no further: a window measured in characters is a verdict that
      // depends on whitespace, which is how the first cut convicted a lawful arm.
      if (tagStart !== -1 && /data-tree="vendor"/.test(src.slice(tagStart, m.index))) continue;
      offenders.push(rel + ' draws its own FAB seat: ' + m[1].trim().slice(0, 56));
    }
  }
  return offenders.length
    ? offenders.join(' | ') + ' — GRID.fab is the one home, reached through components/worklist/Fab.tsx'
    : null;
});

// ── C50 · NO REAL PERSON IS NAMED IN A VENDOR-FACING BYTE  [F-39.6] ────────────
//    Ruled at CE-39 S2/8. Three sentences were re-cut to the founder's bytes and moved to
//    lib/worklist/copy.ts. The other five sites are ENTITLEMENT changes — Couture moves to
//    Signature/Prestige, Team Hub opens to every tier — and their bytes may not move before
//    their gates do, because a byte must not say what the gate does not do.
//
//    ⚠ SO THIS CELL SHIPS RED-BY-DECLARATION ON SIX PATHS AND THAT IS CORRECT.
//    The alternative was a cell scoped to the sites already cured, which would print green
//    over five live instances of the defect it is named after — the hollow green this whole
//    floor exists to refuse. The exception list carries each path WITH THE SEAT THAT MUST
//    RETIRE IT, so the gap is a declared debt with an owner rather than silence. **It
//    shrinks to [] when the dream-os seat lands, and this cell fails if it does not.**
//
//    ADMIN SURFACES ARE EXCLUDED BY PATH, not by judgement: app/admin/* is the operator's
//    own console, the founder and Swati are its users, and naming a colleague there is the
//    correct register rather than a leak.
// ── A THIRD CLASS THE RULING DID NOT ANTICIPATE, DECLARED RATHER THAN SILENCED ──
//    Retiring nothing and narrowing nothing: these three files carry 「Swati Roy」 as a
//    VENDOR'S BUSINESS NAME inside BRIDE-LANE MOCK FIXTURES — a sample booking, a sample
//    receipt, a sample vendor card — not as a directive in product chrome. That is a
//    different question from 「Contact Swati to be considered.」, and it is the founder's and
//    the chair's to answer, not this seat's.
//
//    ⚠ THE TEMPTING MOVE WAS TO EXCLUDE lib/mocks AND lib/frost BY PATH and print green.
//    THIS SITTING ALREADY CONVICTED THAT EXACT MOVE (see C49's header): a seat narrowed a
//    cell until a true hit went quiet, and the defect it hid was live for two sittings. So
//    the hits are LISTED, with what they actually are, and the ruling is asked for rather
//    than assumed. If the chair rules fixtures out of subject, this list is deleted in one
//    edit; if he rules them in, the names change and the list empties the same way.
const REAL_NAME_FIXTURES = [
  'lib/frost/journey.ts',   // sample events, receipts and bookings on the bride lane
  'lib/frost-api/muse.ts',  // a sample vendor card
  'lib/mocks/bride.ts',     // sample bookings and a sample assistant reply
];

// ── THE HELD LIST IS EMPTY, AND EMPTY BY EVIDENCE (CE-39 step 2a, 2026-08-29) ──────
//    The dream-os pre-cutover seat moved the gates — Couture to tier Signature/Prestige
//    (me.js `couture_eligible`), `requirePrestige` off the six studio routers — and the
//    five bytes moved with them in the same pair of ZIPs: one re-cut to the founder's byte
//    in lib/worklist/copy.ts, four DELETED. The cell's own stale-check enforces the empty
//    list: a held path that no longer carries the name is a debt that paid itself, and it
//    may not stay listed.
const REAL_NAME_HELD = [];
cell('C50 no real person is named in a vendor-facing byte (F-39.6)', () => {
  const re = new RegExp('\\b(' + REAL_NAMES.join('|') + ')\\b');
  const hits = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const r = rel + '/' + e.name;
      if (e.isDirectory()) { if (!/^app\/admin/.test(r)) walk(r); continue; }
      if (!/\.tsx?$/.test(e.name)) continue;
      // Comments are stripped FIRST: these files explain the retirement at length, and a
      // cell that reads its own tombstones is F-38.60's family.
      if (re.test(strip(read(r)))) hits.push(r);
    }
  };
  walk('app'); walk('components'); walk('lib');
  const undeclared = hits.filter((h) => !REAL_NAME_HELD.includes(h) && !REAL_NAME_FIXTURES.includes(h));
  if (undeclared.length)
    return 'a real name reaches a vendor-facing byte at ' + undeclared.join(' \u00b7 ')
      + ' \u2014 product chrome speaks as the product; the byte belongs in lib/worklist/copy.ts (F-39.6)';
  // AND THE DECLARED GAP MUST BE REAL. A held path that no longer carries the name is a
  // debt that quietly paid itself, and leaving it listed would let a future instance hide
  // behind an exemption nobody re-read.
  const stale = [...REAL_NAME_HELD, ...REAL_NAME_FIXTURES].filter((h) => !hits.includes(h));
  if (stale.length)
    return 'the held list names ' + stale.join(' \u00b7 ') + ', which no longer carries a real '
      + 'name \u2014 the dream-os seat has landed, so the exception must shrink (F-39.6)';
  return null;
});

// ── C51 · A DOOR THAT HANDS OVER THE CONVERSATION CLOSES ITSELF  [F-39.7] ──────
//    THE FOUNDER TAPPED 「Ask in chat instead」 AND NOTHING APPEARED TO HAPPEN. It had:
//    WishboneSheet's scrim is z-index 60 and its panel 61, the ask sheet is 40, so the chat
//    opened prefilled and correct twenty layers underneath the panel he was looking at. It
//    took three taps to see a door that had worked on the first.
//
//    THE CAUSE WAS THE CURE. Every one of these doors used to be
//    `router.push('/vendor?draft=…')`, and NAVIGATING AWAY TORE THE SOURCE SHEET DOWN — so
//    no one ever wrote a dismissal, because the push was the dismissal. F-38.47 replaced the
//    push with a door that correctly keeps the shell mounted, and removed a teardown two
//    surfaces had been relying on since they were written. **A side effect nobody named is
//    a dependency nobody can see.** F-38.20's family, with the loud authority deleted.
//
//    ⚠ AND THE CELL ASSERTS THE DISMISSAL, NOT THE STACKING, DELIBERATELY. Raising the ask
//    sheet above every room sheet would have made the founder's symptom vanish while leaving
//    both surfaces mounted underneath — the vendor closes the chat and lands back on a stale
//    sheet about the thing she just finished discussing. Notes is the proof that stacking
//    hides this: at z20 under z40 that door LOOKED correct on the walk and carried the
//    identical defect. A cure that removes the symptom and leaves the mechanism is the
//    hollow-green shape this floor exists to refuse.
//
//    WHAT IT ASSERTS: every openAsk call site that lives in a component rendering a fixed
//    overlay of its own must dismiss that overlay in the SAME handler. Derived from the
//    graph, never a typed list — four doors were believed to exist when the FAB taught this
//    sitting that a hand-written corpus is how the fifth hides.
cell('C51 a primer door dismisses its own sheet when it hands over to the chat (F-39.7)', () => {
  const resolveSpec = (spec, from) => {
    let base = null;
    if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
    else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
    else return null;
    for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts', '']) {
      const p = base + ext;
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
    return null;
  };
  const reach = new Set();
  const collect = (abs) => {
    if (reach.has(abs)) return;
    reach.add(abs);
    for (const m of strip(fs.readFileSync(abs, 'utf8')).matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const r = resolveSpec(m[1], abs);
      if (r && !r.includes('node_modules')) collect(r);
    }
  };
  const walkRoutes = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const r = rel + '/' + e.name;
      if (e.isDirectory()) { walkRoutes(r); continue; }
      if (e.name === 'page.tsx') collect(path.join(ROOT, r));
    }
  };
  walkRoutes('app/vendor/(shell)');
  const doors = [...reach].map((a) => path.relative(ROOT, a))
    .filter((rel) => /openAsk\s*\(/.test(strip(read(rel))))
    .sort();
  // NON-VACUITY: the doors are the subject. Zero doors means the walk found nothing and
  // this cell must not report a pass over an empty set.
  if (doors.length < 3) return 'only ' + doors.length + ' openAsk call sites reachable from app/w — this cell would pass over a corpus it never walked';
  const offenders = [];
  for (const rel of doors) {
    const src = strip(read(rel));
    // Does this component render a fixed overlay of its own? If not, there is nothing to
    // dismiss and the door is lawful as it stands (BinderCard's swipe fires from a row).
    if (!/position:\s*'fixed'[^}]*?(inset:\s*0|left:\s*0)/.test(src)) continue;
    // Then every openAsk handler in it must also close that overlay. The closers are the
    // component's own — read from the file rather than assumed, so a fifth door with a
    // differently-named dismissal joins by naming it here in one edit.
    const CLOSERS = /onDone\s*\(\)|onClose\s*\(\)|set[A-Z]\w*\(\s*(null|false)\s*\)/;
    for (const m of src.matchAll(/openAsk\s*\(/g)) {
      // The handler is the statement list around the call: read from the nearest arrow or
      // function opening to the call, plus the rest of that block.
      const from = Math.max(0, src.lastIndexOf('{', m.index) - 240);
      const window = src.slice(from, m.index + 160);
      if (!CLOSERS.test(window))
        offenders.push(rel + ' opens the chat without dismissing its own sheet');
    }
  }
  return offenders.length
    ? [...new Set(offenders)].join(' | ') + ' \u2014 the ask sheet then opens UNDER it (the founder\'s '
      + 'three taps, F-39.7); CalendarDaySheet is the model: close, then openAsk'
    : null;
});

// ── C40 · COLLAB'S TAB ORDER AND ITS LANDING TAB  [F-38.62] ─────────────────────
//    The founder ruled My Posts first, Opportunities second, and the room OPENING on My
//    Posts. Nothing asserted the tab order before this cut, so the reorder would have landed
//    unguarded — and the whole reason for the ruling is that My Posts is where he lands.
//
//    ⚠ THE LANDING TAB IS ASSERTED AS A DERIVATION, NOT AS A LITERAL. The screen reads
//    `TAB_DEFAULT = TAB_ORDER[0]`, so a future reorder cannot leave the first pill and the
//    landing tab disagreeing. A cell that checked for the string 'my_posts' would have passed
//    on a screen that hardcoded it beside a reordered array — asserting the LINK is what
//    makes a reorder safe, and asserting the ORDER is what makes it the founder's.
cell('C40 collab opens on the first pill, and the pills are in the ruled order (F-38.62)', () => {
  const src = strip(read('app/vendor/(shell)/collab/screen.tsx'));
  const m = src.match(/TAB_ORDER:\s*readonly Tab\[\]\s*=\s*\[([^\]]*)\]/);
  if (!m) return 'TAB_ORDER is not declared — the render order has no home';
  const order = (m[1].match(/'([a-z_]+)'/g) || []).map((x) => x.slice(1, -1));
  const RULED = ['my_posts', 'opportunities', 'roster'];
  if (order.join(',') !== RULED.join(','))
    return 'the pills read ' + order.join(' · ') + ', the founder ruled ' + RULED.join(' · ');
  if (!/TAB_DEFAULT:\s*Tab\s*=\s*TAB_ORDER\[0\]/.test(src))
    return 'the landing tab is not derived from the order — a reorder could leave them disagreeing';
  if (!/useState<Tab>\(TAB_DEFAULT\)/.test(src))
    return 'the screen does not open on TAB_DEFAULT';
  // THE ORDER MUST REACH THE SCREEN. A constant nothing renders is a ruling nobody sees.
  if (!/TAB_ORDER\.map\(/.test(src)) return 'the render does not walk TAB_ORDER — the constant is decorative';
  return null;
});

// ── C41 · THE COLLAB PILL IS IN THE EVENT'S ACTION ROW, AND ONLY THERE [F-38.61] ─
//    The leg was live since F10(b) and buried inside the CREW sheet: a door about hiring
//    somebody else's team, filed under a sheet about your own. F-09.129's shape. The founder
//    ruled the pill the ONE HOME and the crew sheet's button retired in the same cut, so this
//    cell asserts BOTH halves — a re-added second door reddens here.
cell('C41 the collab leg has one home, the day sheet\'s action row (F-38.61)', () => {
  const day = strip(read('components/vendor/CalendarDaySheet.tsx'));
  const crew = strip(read('components/vendor/CalendarCrewSheet.tsx'));
  if (!/function postToCollab/.test(day)) return 'the day sheet does not own the collab leg';
  if (/postToCollab/.test(crew)) return 'the crew sheet still carries a collab leg — two homes for one action';
  // ── THE ROW ORDER, READ OFF THE RENDER — AND THE FIRST CUT OF THIS MATCHER WAS WRONG.
  // It looked for the literal `>Collab<` and reddened a CORRECT tree: the pill renders
  // `{POST_TO_COLLAB}`, because copy has one home and the home is the constant. The cell was
  // asserting how the byte is SPELLED AT THE RENDER rather than what the row SAYS — D-38.1's
  // shape in a matcher. So the constant is RESOLVED first and the row is read through it,
  // which is also what keeps this cell honest if the founder vetoes the word later: the
  // ruling is about the POSITION, and the byte is his to change without reddening a bench.
  const lbl = day.match(/POST_TO_COLLAB\s*=\s*'([^']+)'/);
  if (!lbl) return 'POST_TO_COLLAB has no declaration in the day sheet — the pill\'s byte has no home';
  const resolved = day.replace(/\{POST_TO_COLLAB\}/g, lbl[1]);
  const pills = (resolved.match(new RegExp('>(Move|Crew|' + lbl[1] + '|Edit|Cancel)<', 'g')) || [])
    .map((x) => x.slice(1, -1)).map((x) => (x === lbl[1] ? 'Collab' : x));
  const RULED = ['Move', 'Crew', 'Collab', 'Edit', 'Cancel'];
  if (pills.join(',') !== RULED.join(','))
    return 'the action row reads ' + pills.join(' · ') + ', the founder ruled ' + RULED.join(' · ');
  // ── THE REFUSALS LAND IN THE ONE SURFACE, AND THIS CELL FOLLOWED THE CURE RATHER THAN
  // ── OUTLIVING IT. It read `setVerdict(PAST_DATE)` until the chair ruled the kinds explicit;
  // the writer is `preflightRefusal` now and the old spelling would have reddened a tree that
  // had just been made MORE honest. RETIRE-WITH-THE-READER, one sitting after the ruling that
  // named the doctrine — and the successor assertion is stronger, because it pins the refusals
  // to the PREFLIGHT kind rather than merely to the surface.
  if (!/preflightRefusal\(PAST_DATE\)/.test(day) || !/preflightRefusal\(NO_CITY\)/.test(day))
    return 'the collab refusals do not render as preflight lines in the one verdict surface';
  // And the address book still answers, wherever the leg lives.
  if (!/roomHref\('collab'\)/.test(day)) return 'the leg spells an address instead of asking the registry';
  return null;
});

// ── C42 · THE VERDICT SURFACE'S CONTRACT IS STRUCTURAL, NOT A PROMISE  [F-38.61] ──
//    Chair-ruled at the F-38.61 relay: the amended header must NAME BOTH KINDS AND LABEL EACH
//    AT ITS RENDER SITE so a third cannot slip in unlabelled. Making the kind explicit found
//    a third IMMEDIATELY — five `catch` arms printing 'Network error.' under a header that
//    called every line the wire's own sentence (F-38.p7). This cell is what keeps the fourth
//    from arriving the same way.
//
//    IT ASSERTS THE MECHANISM, NOT THE COUNT. A cell that checked for 「three kinds」 would go
//    stale the day a fourth is ruled in; what must never happen is a WRITER WITH NO KIND. So
//    it asserts that no bare setter survives and that every declared kind has a writer —
//    D-38.1's own distinction between a snapshot and the behaviour underneath it.
cell('C42 no verdict line reaches the day sheet without declaring its kind (F-38.61)', () => {
  const src = strip(read('components/vendor/CalendarDaySheet.tsx'));
  const m = src.match(/useState<\{\s*kind:\s*([^;]+);\s*line:\s*string\s*\}/);
  if (!m) return 'the verdict state does not carry a kind — a line can be written without saying what it is';
  const kinds = (m[1].match(/'([a-z]+)'/g) || []).map((x) => x.slice(1, -1));
  if (kinds.length < 2) return 'the verdict union declares ' + kinds.length + ' kind(s); the contract names at least wire and preflight';
  // Every declared kind must have a named writer. A kind in the union with no writer is a
  // contract clause nothing can satisfy; a writer with no kind is what this cell exists for.
  const WRITERS = { wire: 'wireVerdict', preflight: 'preflightRefusal', transport: 'transportFailure' };
  for (const k of kinds) {
    const w = WRITERS[k];
    if (!w) return 'the union declares an unmapped kind: ' + k + ' — add its writer and name it here';
    if (!new RegExp('const ' + w + ' = ').test(src)) return 'kind ' + k + ' has no named writer';
  }
  // THE BARE SETTER MUST NOT SURVIVE. `setVerdictState` is the raw React setter; only the
  // three named writers and the clear may call it.
  const bare = (src.match(/setVerdictState\(/g) || []).length;
  if (bare !== kinds.length + 1)
    return 'setVerdictState is called ' + bare + ' times; expected one per kind plus the clear — a bare writer has grown back';
  // And the label reaches the render, or the kind is bookkeeping nobody can read.
  if (!/data-verdict-kind=\{verdict\.kind\}/.test(src))
    return 'the kind is not labelled at the render site — it cannot be read off the surface';
  return null;
});

// ── C43 · THE EVENT CARD'S ACTIONS DO NOT COMPETE WITH ITS TITLE  [F-38.p9] ──────
//    C41 asserts the row's ORDER and stayed GREEN through the broken layout, which is the
//    gap this cell closes: order is not fit. At 374px the five pills derive to 295px in a
//    322px card, and the title — carrying `flex: 1, minWidth: 0` against pills at
//    `flexShrink: 0` — collapsed to seventeen pixels and ran underneath them.
//
//    IT ASSERTS THE STRUCTURE, NOT A WIDTH. A pixel cell would need a char-advance constant
//    this bench cannot measure, and it would red the day a label is vetoed longer even if the
//    row still fit. What makes overflow IMPOSSIBLE regardless of label length is that the
//    actions own a full-width row of their own — so that is the property asserted, and the
//    arithmetic lives at the site where it was derived.
cell('C43 the event card\'s action row does not share a row with its title (F-38.p9)', () => {
  const src = strip(read('components/vendor/CalendarDaySheet.tsx'));
  // ⚠ THE FIRST CUT OF THIS SLICE ANCHORED ON THE COMMENT 「The Move picker」 AND REFUSED.
  // `strip()` had already deleted it, so the cell reddened on its own scaffolding rather than
  // on the tree — F-38.57's family, self-caught on the first run. Anchored on CODE now: the
  // picker's own guard expression, which `strip()` cannot touch. A reader that strips must
  // anchor on what survives stripping.
  const card = src.match(/\{g\.rows\.map\(\(ev\) =>[\s\S]*?moveId === ev\.id &&/);
  if (!card) return 'the event card body could not be located — this cell would pass vacuously';
  const body = card[0];
  // The pills must not be a shrink-proof island beside a flexible title: that pairing is
  // exactly what squeezed the title to nothing.
  if (/flexShrink:\s*0/.test(body))
    return 'a flexShrink:0 island survives in the event card — the title will be squeezed by the controls again';
  if (/flex:\s*1,\s*minWidth:\s*0/.test(body))
    return 'the title still claims flex:1 against the controls — it can collapse to nothing';
  // And the actions must actually be their own row rather than inline.
  if (!/display:\s*'flex',\s*gap:\s*6,\s*marginTop:\s*10/.test(body))
    return 'the action row is not a full-width row of its own';
  return null;
});

// ── C44 · THE ASK DOOR IS A CONTEXT, AND BOTH TREES ANSWER IT  [F-38.47, R-39.3] ──
//    THE FOUR DOORS ARE DUAL-TREE, which is the whole reason this is an interface and not a
//    re-point. `BinderCard` is mounted by `app/vendor/page.tsx` — the OLD HUB — where the
//    push primes the risen chat ON THE SAME PAGE; deleting it there would regress a live
//    control. So the doors call `openAsk` and know nothing about trees, and each tree
//    mounts a provider. A tree that stops mounting one does not fail loudly at build time
//    — `useAsk()` throws at RENDER, on the vendor's screen, which is exactly why the
//    mounting is asserted here rather than trusted.
cell('C44 the four hub primer doors are tree-blind, and both trees mount a provider (R-39.3)', () => {
  const DOORS = ['components/vendor/slices/WishboneSheet.tsx', 'components/vendor/slices/BinderCard.tsx',
                 'components/vendor/NotesBody.tsx', 'components/vendor/CalendarDaySheet.tsx'];
  const bad = [];
  for (const d of DOORS) {
    const src = strip(read(d));
    if (!/useAsk\(\)/.test(src)) bad.push(d + ' does not ask the context');
    // The DEFECT, stated as itself: a push to the old hub root with a query.
    if (/router\.push\(\s*[`'"]\/vendor\?/.test(src)) bad.push(d + ' still pushes /vendor?<query> — the shell unmounts');
  }
  if (bad.length !== 0 && DOORS.length !== 4) bad.push('the door set is no longer four — this cell was written against four');
  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  // P7.2 AMENDMENT (labeled): "both trees mount a provider" had two trees; the carried
  // tree and its /vendor?draft= hub push are DELETED. One tree, one provider, in the shell.
  // app/vendor/(legacy)/layout.tsx mounts NONE by derivation (zero useAsk callers there).
  if (!/<AskProvider/.test(shell)) bad.push('the shell mounts no AskProvider: every door under /vendor would throw at render');
  if (fs.existsSync(path.join(ROOT, 'app/vendor/layout.tsx'))) bad.push('app/vendor/layout.tsx is back: the carried tree was retired at P7.2');
  const legacy = strip(read('app/vendor/(legacy)/layout.tsx'));
  if (/<AskProvider/.test(legacy)) bad.push('(legacy) mounts an AskProvider: it has no useAsk caller and no ask door (P7.2 derivation)');
  if (/\/vendor\?/.test(shell)) bad.push('the shell provider carries a /vendor? address — arm (a) opens the sheet in place, it does not navigate');
  return bad.length ? bad.join(' | ') : null;
});

// ── C45 · THE DOCK DOES NOT OWN THE SHEET  [F-38.47] ────────────────────────────
//    `AiDock` held `useState(false)` and was therefore the ONLY door to the ask sheet. The
//    primers need the same sheet from inside a room body, so the state moved to the shell.
//    A local `open` restored here would compile, render, and give the dock a SECOND sheet
//    the primers cannot reach — two surfaces, one name, no error. That is the ruling's
//    named mutation and this cell is what reddens on it.
cell('C45 the dock consumes the ask context and owns no open state (R-39.3)', () => {
  const src = strip(read('components/worklist/AiDock.tsx'));
  if (!/useAsk\(\)/.test(src)) return 'AiDock does not read the ask context — the primers and the dock would open different sheets';
  if (/useState\s*(<[^>]*>)?\s*\(\s*false\s*\)/.test(src))
    return 'AiDock has taken back a local open state — a second sheet the four primer doors cannot reach';
  const sheet = strip(read('components/worklist/AskSheet.tsx'));
  if (!/prefill/.test(sheet)) return 'AskSheet takes no prefill — the primers have nothing to carry';
  // PREFILL-NOT-FIRE. The stem reaches the composer, never the wire.
  if (/send\(\s*prefill/.test(sheet)) return 'AskSheet SENDS the prefill — the door would spend the vendor\'s message on a stem (F-04.9)';
  return null;
});

// ── C46 · ONE SIGN-OUT VERB, ONE SHEET, EVERY DOOR  [CE-39 §3, F-38.p14] ────────
//    TWO DOORS END A SESSION and they had drifted: the shell's dropped the remembered /me
//    (F-38.26) and Settings' did not. The cure is not 「add the missing line」 — that leaves
//    two homes and waits for the next divergence. There is ONE verb, it is reachable only
//    through the sheet, and both doors open the sheet.
//
//    ⚠ THE ASSERTION IS ABSENCE-SHAPED AT THE DOORS AND PRESENCE-SHAPED AT THE HOME, which
//    is the only pairing that catches a bypass: a door that calls `clearVendorSession()`
//    itself would satisfy 「a sheet exists somewhere」 while signing the vendor out on one
//    tap. Comments are stripped first — the files DESCRIBE the retired calls at length.
cell('C46 every sign-out door opens the one sheet, and only the sheet holds the verb (CE-39 §3)', () => {
  const HOME = 'components/worklist/SignOutSheet.tsx';
  const home = strip(read(HOME));
  for (const call of ['forgetVendorMe()', 'clearVendorSession()', "replace('/')"])
    if (!home.includes(call)) return 'the one sign-out verb is missing ' + call + ' at ' + HOME + ' — F-38.p14 was the two doors disagreeing about exactly this';
  const DOORS = ['components/worklist/AccountDrawer.tsx', 'components/vendor/SettingsScreen.tsx', 'components/vendor/Header.tsx',
                 'components/worklist/WorklistShell.tsx'];
  const bad = [];
  for (const d of DOORS) {
    const src = strip(read(d));
    if (/clearVendorSession\s*\(/.test(src)) bad.push(d + ' calls clearVendorSession itself — a door that bypasses the sheet');
  }
  // AND THE TWO DOORS THE FOUNDER TAPS MUST ACTUALLY MOUNT IT.
  for (const d of ['components/worklist/AccountDrawer.tsx', 'components/vendor/SettingsScreen.tsx'])
    if (!/useSignOut\(\)/.test(strip(read(d)))) bad.push(d + ' does not open the confirm sheet');
  return bad.length ? bad.join(' | ') : null;
});

// ── C47 · THE RECUT IS A VARIANT AND NOT A SWEEP  [bank §2, D-2] ────────────────
//    AtelierForm has five importers across BOTH trees. Recutting its bytes in place would
//    have swept every one of them, two of which D-2 protects outright. So the primitives
//    take a register that DEFAULTS to the engraved bytes and exactly one consumer opts in.
//    A second consumer passing 'rungs' is not a small thing: `--wl-t*` exists only inside
//    the shell scope, so a main-side caller inheriting rungs paints in the user agent's
//    fallback font — C-R6's own finding on the dock glyph, reproduced on a money surface.
cell('C47 the six-rung register is opt-in, and exactly one consumer opts in (CE-39 S2/6)', () => {
  const form = strip(read('components/vendor/AtelierForm.tsx'));
  if (!/register\s*=\s*'engraved'/.test(form))
    return 'the register prop does not default to the engraved bytes — every other consumer would be swept';
  // Derived, never typed: who imports the primitives.
  const consumers = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const r = dir + '/' + e.name;
      if (e.isDirectory()) { walk(r); continue; }
      if (!/\.tsx?$/.test(e.name)) continue;
      const src = strip(read(r));
      if (/from\s+'@\/components\/vendor\/AtelierForm'/.test(src)) consumers.push(r);
    }
  };
  walk('app'); walk('components');
  if (!consumers.length) return 'no AtelierForm consumers found — this cell would pass vacuously';
  const optedIn = consumers.filter((c) => /'rungs'/.test(strip(read(c))));
  if (optedIn.length !== 1)
    return 'the rungs variant has ' + optedIn.length + ' consumers (' + (optedIn.join(' · ') || 'none') + ') — exactly one was ruled, and the variable it reads exists only inside the shell scope';
  if (optedIn[0] !== 'components/vendor/SettingsScreen.tsx')
    return 'the rungs consumer is ' + optedIn[0] + ', ruled to be components/vendor/SettingsScreen.tsx';
  // AND THE OPT-IN MUST BE DERIVED FROM THE TREE, not a hardcoded literal that would paint
  // rungs on the /vendor tree where the variables do not exist.
  if (!/chrome\s*\?\s*'engraved'\s*:\s*'rungs'/.test(strip(read(optedIn[0]))))
    return 'SettingsScreen does not derive its register from `chrome` — a literal would carry the shell rungs onto the /vendor tree, where --wl-t* is undefined';
  return null;
});

// ── C48 · THE SIGNPOSTS HAVE WORDS  [F-38.p10, F-39.4] ─────────────────────────
//    Two <button>s on this surface rendered EMPTY — no text, no aria-label — because
//    R-37.84 (4) emptied them 「branch-only」 and a component has no branch, it has callers.
//    A card titled Subscription over a 4px void is chrome pretending to be structure.
//    The ruling's named mutation: empty one → red.
cell('C48 the Settings signposts render words and go somewhere (F-38.p10, F-39.4)', () => {
  const src = strip(read('components/vendor/SettingsScreen.tsx'));
  const bad = [];
  for (const key of ['COPY.settingsManageSubscription', 'COPY.settingsEditProfile'])
    if (!src.includes(key)) bad.push(key + ' is not rendered — the signpost is an empty button again');
  const copy = strip(read('lib/worklist/copy.ts'));
  for (const key of ['settingsManageSubscription', 'settingsEditProfile'])
    if (!new RegExp(key + ":\\s*'[^']+'").test(copy)) bad.push(key + ' has no byte in the copy register');
  // THE ADDRESS IS DERIVED, NOT SPELLED. F-38.27: a literal is a spelling a cure can move
  // out from under, and this signpost has already been re-pointed once.
  if (!/roomHref\('billing'\)/.test(src))
    bad.push('the subscription signpost does not resolve its address through roomHref — a literal drifts the moment Billing moves again (F-38.27)');
  return bad.length ? bad.join(' | ') : null;
});

// ── C58 · NO TIER GATES THE STUDIO SUITE  [R-39.7 · 2026-08-29] ───────────────────
//    Founder: 「Team hub open it for everyone」 · 「no exclusive」. The pwa half of the seat
//    that took `requirePrestige` off the six dream-os studio routers. Three things must be
//    true at once, and the cell asks all three because any one alone is a hollow green:
//    (1) no studio route or the Team Hub screen compares `tier` to a value — comments
//    stripped, because these files explain the retirement at length; (2) `isPrestige` has
//    no home and no reader — a dead export is how a gate comes back; (3) every STUDIO_ITEMS
//    row renders as a door (`locked` has no reader in `Row`).
//    RED MUTATION (shown in the handover): restore `if (session.tier !== 'prestige')` in
//    any one of the three studio pages → red.
cell('C58 no tier gates the Studio Suite — pages, screen, and the shared row (R-39.7)', () => {
  const bad = [];
  // ── AMENDED AGAIN AT CE-39 2c-STUDIO · AND THE CELL WAS VACUOUS UNTIL NOW ──
  // ⚠ READ THIS BEFORE TRUSTING ANY EARLIER GREEN FROM THIS CELL. THE ASSERTION
  // IS UNCHANGED AND IS QUOTED HERE BEFORE THE LIST GROWS:
  //
  //   「C58 no tier gates the Studio Suite — pages, screen, and the shared row
  //    (R-39.7)」
  //
  // F-39.39: for the whole of 2b-2 this cell could not see seventy-four lines of
  // `app/vendor/studio/team/page.tsx`. b40's own stripper read `/crew/*` inside
  // a `//` comment at that file's line 152 as a block-comment opener, paired it
  // with `{/* FAB */}`'s closer at 226, and deleted everything between. Proven
  // both ways by production mutation at the 2c-Studio cut: a restored
  // `session.tier !== 'prestige'` gate at :196 — INSIDE the window — left this
  // cell GREEN and the floor GREEN; the same gate at :65 reddened it. So the pwa
  // half of a FOUNDER RULING was guarded by a cell with a blind spot exactly
  // where the deleted gate used to live.
  //
  // A VACUOUS CELL IS NOT AMENDED, IT IS REPAIRED FIRST. The stripper was
  // rehomed onto `scripts/lib/stripComments.cjs` — the estate's F-07.74 home,
  // reached through a declared CJS mirror — ahead of this edit and in the same
  // ZIP. THE LIST BELOW GROWS ONLY AFTER `strip` CAN READ ITS SITES.
  //
  // THE LIST GROWS BY ONE, from six sites to seven: the sheets. 2c-Studio moved
  // every studio VERB into `components/worklist/StudioSheets.tsx`, so a gate
  // restored around the add/edit surfaces — the most natural place to put one
  // back — would sit outside every site this cell reads. The three
  // `app/vendor/studio/*` pages STAY: they keep their bodies until Phase 7
  // sweeps the /vendor tree, `/vendor/more` and `/vendor/studio` still route
  // into team-hub, and dropping a live fallback from this list on the sitting
  // that stopped looking at it is precisely the mistake the 2b-2 amendment
  // refused to make about `team-hub/screen.tsx`.
  //
  // COUNT PRESERVED 1:1 IS NOT CLAIMED — the movement is stated rather than a
  // number made to hold (R-38.11 as amended). RETIRE-WITH-THE-READER does not
  // fire: nothing left.
  //
  // ── AMENDED AT CE-39 2b-2 · THE SITE LIST MOVES WITH THE BODY ─────────────
  // `app/w/team/page.tsx` stopped mounting `TeamHubScreen` at arm D (a) and now
  // mounts `components/worklist/TeamTabs.tsx`. The ROUTE stays on this list —
  // it is still a Studio surface and could still grow a gate — and the new BODY
  // joins it, because a gate restored in the body would otherwise sit outside
  // every site this cell reads.
  //
  // ⚠ `app/vendor/team-hub/screen.tsx` STAYS, and that is the amendment's whole
  // point. `TeamHubScreen` keeps BOTH readers: the /vendor fallback still mounts
  // it and is byte-untouched until 2c-Studio. Dropping it here because the shell
  // stopped reading it would leave the fallback's gate unwatched on the exact
  // sitting that stopped looking at it.
  //
  // COUNT PRESERVED 1:1 IS NOT CLAIMED — the list GROWS by one, from five sites
  // to six, and the movement is stated rather than a number made to hold
  // (R-38.11 as amended). RETIRE-WITH-THE-READER does not fire: nothing left.
  const sites = [
    // P7.2 AMENDMENT (labeled): the four old-tree sites (team-hub screen, studio/team,
    // studio/tasks, studio/team-payments) are DELETED with the tree; the Studio Suite is
    // the shell's Team room, its tabs and its sheets: the three sites below.
    'app/vendor/(shell)/team/page.tsx',
    'components/worklist/TeamTabs.tsx',
    'components/worklist/StudioSheets.tsx',
  ];
  for (const f of sites) {
    const src = strip(read(f));
    if (/tier\s*[!=]==?\s*['"]/.test(src)) bad.push(f + ' compares tier to a literal');
    if (/isPrestige|locked:/.test(src)) bad.push(f + ' still asks a Prestige gate');
    if (/\bSwati\b/.test(src)) bad.push(f + ' names a person (F-39.6)');
  }
  const shared = strip(read('lib/vendor/studioShared.tsx'));
  if (/isPrestige/.test(shared)) bad.push('studioShared.tsx still exports isPrestige — a gate with no reader is a gate waiting for one');
  if (/isLocked|locked\??:/.test(shared)) bad.push('studioShared.tsx Row still carries a locked arm');
  const anyReader = ['app', 'components', 'lib'].some((d) => {
    let hit = false;
    const walk = (rel) => {
      for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
        const r = rel + '/' + e.name;
        if (e.isDirectory()) { walk(r); continue; }
        if (/\.tsx?$/.test(e.name) && /isPrestige/.test(strip(read(r)))) hit = true;
      }
    };
    walk(d); return hit;
  });
  if (anyReader) bad.push('isPrestige still has a reader somewhere under app/, components/ or lib/');
  return bad.length ? bad.join(' | ') : null;
});

// ── C59 · THE COUTURE GATE SPEAKS THE VETOED BYTE AND OPENS THE BILLING DOOR  [R-39.6] ──
//    The predicate moved server-side (dream-os me.js: invite flag OR tier in
//    {signature, prestige}); this screen still reads ONE boolean, `couture_eligible`, so the
//    cell asserts the byte and the door, not the tier — the tier is dream-os's cell. Both
//    bytes are founder-vetoed 2026-08-29 and live in lib/worklist/copy.ts; the sentence
//    carries its own link word and the screen routes that word through roomHref('billing').
//    RED MUTATION: spell the sentence inline in screen.tsx, or point the link at a literal.
cell('C59 the Couture gate reads its two bytes from copy.ts and routes Billing through roomHref (R-39.6)', () => {
  const bad = [];
  const copy = strip(read('lib/worklist/copy.ts'));
  const want = {
    coutureGateLabel:    'Couture · Signature and Prestige',
    coutureGateSentence: 'Couture is part of Signature and Prestige. Upgrade in Billing.',
    coutureGateLinkWord: 'Billing',
  };
  for (const [k, v] of Object.entries(want)) {
    const m = copy.match(new RegExp(k + ":\\s*'([^']*)'"));
    if (!m) bad.push(k + ' has no byte in the copy register');
    else if (m[1] !== v) bad.push(k + ' reads 「' + m[1] + '」, vetoed byte is 「' + v + '」');
  }
  if (!want.coutureGateSentence.includes(want.coutureGateLinkWord))
    bad.push('the link word is not inside the sentence it must be split from');
  const src = strip(read('app/vendor/(shell)/couture/screen.tsx'));
  for (const k of Object.keys(want)) if (!new RegExp('COPY\\.' + k + '\\b').test(src)) bad.push('screen.tsx does not read COPY.' + k);
  if (!/roomHref\('billing'\)/.test(src)) bad.push('the Billing door does not resolve through roomHref (F-38.27)');
  if (/Invite Only|reserved for invited/.test(src)) bad.push('the retired invite-only bytes are still on the screen');
  if (/\bSwati\b/.test(src)) bad.push('screen.tsx names a person (F-39.6)');
  if (/couture_eligible/.test(src) === false) bad.push('the screen no longer reads the one boolean it was ruled to read');
  return bad.length ? bad.join(' | ') : null;
});


// ══ PHASE 4 · TODAY READS THE FEED ═══════════════════════════════════════════
// Six cells. Every one of them asserts a SURFACE OR A BEHAVIOUR and none asserts a line
// number or where a constant lives (the F-15.12 family). The RED MUTATION named on each is
// a mutation of PRODUCTION CODE, never of a fixture: a cell that only reddens when you
// break its own setup has proved nothing about the build.

// C60 — the numeral is the sum of FIVE counts, and the sum has one home.
//    §3 property 2: no total ships on the wire; the client sums, so the sum is authored
//    here and this is the cell that watches it. `sumCounts` is factored out of the
//    component precisely so this mutation is available: dropping one term is a
//    one-character edit that yields a plausible smaller number no render cell would catch.
//    RED MUTATION: delete `+ (counts.team_tasks ?? 0)` from sumCounts in lib/worklist/feed.ts.
cell('C60 the masthead numeral is the sum of all five counts, computed in one home', () => {
  const bad = [];
  const feed = strip(read('lib/worklist/feed.ts'));
  const KINDS = ['lead_unanswered', 'invoice_due', 'events_today', 'contract_unsigned', 'team_tasks'];
  const m = feed.match(/export function sumCounts\([\s\S]*?\n\}/);
  if (!m) { bad.push('sumCounts has no home in lib/worklist/feed.ts'); return bad.join(' | '); }
  for (const k of KINDS) if (!m[0].includes(k)) bad.push('sumCounts does not read counts.' + k);
  // ONE HOME: nothing else in the shell may reduce over `counts`, or the numeral and the
  // tiles could be built by two recipes for one figure.
  for (const f of ['app/vendor/(shell)/today/page.tsx', 'components/worklist/RoomsGrid.tsx', 'components/worklist/TodayCards.tsx']) {
    const src = strip(read(f));
    if (/counts\s*\)?\s*\.\s*reduce|Object\.values\([^)]*counts/.test(src)) bad.push(f + ' sums counts itself — second home for the numeral');
  }
  const page = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/const working\s*=\s*feed\.responded/.test(page)) bad.push('the working state is not derived from a reading (F-38.31)');
  if (!/\{working && feed\.openItems !== null/.test(page)) bad.push('the numeral is not gated on the working state');
  return bad.length ? bad.join(' | ') : null;
});

// C61 — the feed renders in the wire's key order and never re-sorts.
//    §3 properties 4 and 5. JSON preserves insertion order and that order IS D-4's rank,
//    so the render walks the body's own keys. A client-side sort would look tidy and would
//    silently override a ranking the backend owns.
//    RED MUTATION: add `.sort()` after `Object.keys(na)` in components/worklist/TodayCards.tsx.
cell('C61 the feed renders in the wire\'s key order and re-sorts nothing', () => {
  const bad = [];
  const src = strip(read('components/worklist/TodayCards.tsx'));
  if (!/Object\.keys\(na\)/.test(src)) bad.push('the render does not read the body\'s own key order');
  if (/\.sort\(/.test(src)) bad.push('the feed sorts — key order IS D-4\'s ranking (property 4)');
  if (/\.reverse\(/.test(src)) bad.push('the feed reverses — ties break oldest-first as delivered (property 5)');
  // ATTENTION_KINDS is a SET for the type system, not the sequence. If the render iterated
  // it, a wire re-rank would be overridden by a constant in the client.
  if (/ATTENTION_KINDS/.test(src)) bad.push('the render iterates the constant instead of the body');
  return bad.length ? bad.join(' | ') : null;
});

// C62 — a tile figure is counts[k], never a list length.
//    R-37.63 ①, and §3 property 3 is why it matters: when the cap fires, counts[k] is a
//    FLOOR and the array is exactly 20. A tile authored from `rows.length` is right until
//    it silently is not — a badge that is secretly a floor, the false-done class.
//    RED MUTATION: in RoomsGrid.tsx, build the figure from
//                  `feed.today.needs_attention[kind].length` instead of `counts[kind]`.
cell('C62 a tile figure is the wire\'s count, not a list length, and it is never called a badge', () => {
  const bad = [];
  const src = strip(read('components/worklist/RoomsGrid.tsx'));
  if (!/counts\[kind\]/.test(src)) bad.push('the tile figure does not read counts[kind]');
  if (/needs_attention\[[^\]]*\]\s*(\?\?\s*\[\])?\s*\.length/.test(src)) bad.push('the tile figure is authored from a list length (property 1/3)');
  if (!/useTodayFeed/.test(src)) bad.push('Rooms does not read the Today feed — R-37.63 (1) wants the SAME response');
  // ONE WORD, ONE MEANING. SliceShell owns `badge` for a row-level state chip and the six
  // list rooms import it; the tile figure must not answer to the same name.
  if (/\bbadge\b/i.test(src)) bad.push('the tile figure is called a badge — SliceShell owns that word');
  const rooms = strip(read('lib/worklist/rooms.ts'));
  if (/\bbadge\b/i.test(rooms)) bad.push('rooms.ts spells badge — the registry\'s word is count');
  return bad.length ? bad.join(' | ') : null;
});

// C63 — the manual is gated on has_any FALSE; the resting state is gated on an empty
//    reading; neither is gated on the other's condition.
//    §3 property 6 in its own words: has_any answers "has this vendor ever had anything",
//    not "is today busy". NEVER SHOW THE MANUAL ON A QUIET DAY. The inversion is the
//    mutation because it is the failure that looks correct in a screenshot of a new account.
//    RED MUTATION: change `today.has_any === false` to `=== true` in app/w/today/page.tsx.
cell('C63 FirstRun rides has_any false and the resting state rides an empty reading', () => {
  const bad = [];
  const src = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/const firstRun = [^\n]*has_any === false/.test(src)) bad.push('FirstRun is not gated on has_any === false (property 6)');
  if (!/const resting\s*=\s*[^\n]*has_any === true[^\n]*openItems === 0/.test(src)) bad.push('the resting state is not gated on a reading that came back empty');
  if (!/const working\s*=\s*[^\n]*openItems !== null[^\n]*openItems > 0/.test(src)) bad.push('the working state is not gated on a reading with work in it');
  if (!/\{firstRun && <FirstRun \/>\}/.test(src)) bad.push('FirstRun is not behind its gate — it renders unconditionally');
  const rest = strip(read('components/worklist/TodayCards.tsx'));
  // property 8: exactly three keys, and no fourth bucket and no sentence explaining the absence.
  for (const k of ['invoice_paid', 'contract_signed', 'team_task_done'])
    if (!rest.includes(k)) bad.push('the resting summary omits done_today.' + k);
  if (/lead[s]?_done|events_done|event_done/.test(rest)) bad.push('the resting summary invents a fourth bucket (property 8)');
  if (!/todayRestingScope/.test(rest)) bad.push('the resting state does not carry its one coverage line');
  return bad.length ? bad.join(' | ') : null;
});

// C64 — the truncation tell rides the wire's flag, and no count can render bare when cut.
//    §3 property 3: truncated[k] is the tell that the cap fired; the surface must say so or
//    not imply otherwise. The suffix REPLACES nothing and ADDS to the figure, so there is no
//    state in which a capped count reads as a plain 20.
//    RED MUTATION: drop the `{cut ? COPY.todayTruncatedSuffix : ''}` from TodayCards.tsx.
cell('C64 a capped count never renders bare — the truncation tell rides truncated[k]', () => {
  const bad = [];
  const copy = strip(read('lib/worklist/copy.ts'));
  const m = copy.match(/todayTruncatedSuffix:\s*'([^']*)'/);
  if (!m) bad.push('the truncation tell has no byte in the copy register');
  else if (m[1] !== '+') bad.push('the truncation tell reads 、' + m[1] + '、, vetoed byte is 、+、');
  for (const f of ['components/worklist/TodayCards.tsx', 'components/worklist/RoomsGrid.tsx']) {
    const src = strip(read(f));
    if (!/truncated\[/.test(src) && !/truncated\b/.test(src)) bad.push(f + ' does not read truncated');
    if (!/todayTruncatedSuffix/.test(src)) bad.push(f + ' renders a figure with no truncation tell available to it');
  }
  return bad.length ? bad.join(' | ') : null;
});

// C65 — open_leads_count is absent from every Today and Rooms path, and the five dated
//    uncomments fired together.
//    R-P3.5.6 (1) as extended by F-39.10: Storefront is a room, so the engine figure leaves
//    the display. The engine READER is untouched and retires at the 8.9 seam.
//    RED MUTATION: re-comment `todayNothingYet` in copy.ts, or restore the leadsWaiting
//                  span in app/vendor/storefront/screen.tsx.
cell('C65 open_leads_count reaches no shell path, and the dated uncomments all fired', () => {
  const bad = [];
  // (a) the symbol is gone from every render path the shell can reach.
  const PATHS = [
    'app/vendor/(shell)/today/page.tsx', 'components/worklist/TodayCards.tsx', 'components/worklist/RoomsGrid.tsx',
    'lib/worklist/feed.ts', 'lib/worklist/rooms.ts', 'app/vendor/(shell)/storefront/screen.tsx',
  ];
  for (const f of PATHS) if (/open_leads_count/.test(strip(read(f)))) bad.push(f + ' still displays or compares open_leads_count (R-P3.5.6 (1))');
  // (b) the old door and its remaining reader are RULED UNTOUCHED — their absence would be
  //     a different defect, so this cell asserts they are STILL THERE.
  // ⚠ RAW READ, NOT `strip`, AND F-39.13 IS WHY. `lib/vendor/api/vendor.ts` carries four
  // `/*` openers against three closers (a `/binders/*` path inside a line comment), so
  // `strip`'s non-greedy block regex swallows from that point to end of file and
  // `fetchToday` disappears from the stripped text. A stripper that eats live code makes
  // every ABSENCE assertion over that file vacuously green — the dangerous half — and this
  // presence assertion falsely red. The finding is filed; this cell does not work around it
  // silently, it reads the bytes and says so.
  if (!/fetchToday/.test(read('lib/vendor/api/vendor.ts'))) bad.push('the old fetchToday door was removed — F-39.9 ruled it untouched');
  if (!/fetchToday/.test(read('hooks/vendor/useVendorData.ts'))) bad.push('useVendorData no longer reads the old door — ruled untouched');
  // (c) all five dated uncomments fired in this one commit; a partial firing is the defect.
  const copy = strip(read('lib/worklist/copy.ts'));
  if (!/todayNothingYet:\s*'Nothing needs you yet\.'/.test(copy)) bad.push('COPY.todayNothingYet is still withheld');
  const page = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/\.wl-mnum\{font:var\(--wl-t0\)/.test(page)) bad.push('the wl-mnum rules were not restored to the style block');
  if (!/font-variant-numeric/.test(page)) bad.push('the numeral is not tabular — the font shorthand reset it');
  if (!/todayNothingYet/.test(page)) bad.push('the true-empty byte has no consumer');
  const audit = strip(read('tools/wl_audit.mjs'));
  if (/'Nothing needs you yet\.',/.test(audit)) bad.push('the byte is live in copy.ts and still on the audit RETIRED set');
  if (!/t0Sites\.length === 1 && t0Sites\[0\] === '\/vendor\/today'/.test(audit)) bad.push('the R-38.4 t0 predicate was not flipped back');
  const feed = strip(read('lib/worklist/feed.ts'));
  if (/responded: false, openItems: null \}[\s;]*$/m.test(feed) && !/fetchWorklistToday/.test(feed)) bad.push('lib/worklist/feed.ts still returns the no-reading constant');
  if (!/fetchWorklistToday/.test(feed)) bad.push('the feed does not call the worklist door');
  // (d) the sixth site — markerless, and named so it cannot be missed twice.
  const render = strip(read('tools/wl_render.cjs'));
  if (!/paints exactly the reading the feed returned/.test(render)) bad.push('C-R17 was not rewritten — it still asserts the withheld-numeral inverse');
  return bad.length ? bad.join(' | ') : null;
});



// ══ S4/2 · THE WALK'S CURES ═══════════════════════════════════════════════════

// C66 — every figure site declares lining figures, and none inherits them from a family.
//    F-39.15. The masthead numeral resolves to Cormorant Garamond, which ships OLDSTYLE
//    figures by default: its oldstyle one is a bare stem, so eleven leads painted as two
//    capital I's on the founder's screen. `tabular-nums` alone fixes column drift and says
//    nothing about figure style.
//    ⚠ THIS IS A SOURCE CELL AND IT CANNOT SEE A PAINTED GLYPH. It asserts that every rule
//    which renders a figure STATES its figure style — so the correctness does not depend on
//    which family a rung currently resolves to, and a re-point of t4 or t5 cannot
//    reintroduce oldstyle figures silently. Whether the glyphs are lining ON GLASS belongs
//    to the render arm (C-R18), and that split is this file's own law.
//    RED MUTATION: drop `lining-nums` from .wl-mnum in app/w/today/page.tsx.
cell('C66 every figure site declares lining figures, not only the rung that broke (F-39.15)', () => {
  const bad = [];
  const SITES = [
    ['app/vendor/(shell)/today/page.tsx', 'wl-mnum'],
    ['components/worklist/RoomsGrid.tsx', 'wl-tcount'],
    ['components/worklist/TodayCards.tsx', 'wl-tseccount'],
    // RENAMED AT S4/3 to the ratified frames' own class names: the figure became a
    // two-part cell inside the card's grid (value + caption) rather than a single block
    // stapled under it, so one class became two and both carry figures.
    ['components/worklist/TodayCards.tsx', 'wl-tcfigval'],
    ['components/worklist/TodayCards.tsx', 'wl-tcdetail'],
    ['components/worklist/TodayCards.tsx', 'wl-tmorecount'],
    ['components/worklist/TodayCards.tsx', 'wl-tfoldbtn'],
    ['components/worklist/TodayCards.tsx', 'wl-trestpart'],
    ['app/vendor/(shell)/today/page.tsx', 'wl-mkind'],
    ['components/worklist/TodayCards.tsx', 'wl-trestn'],
  ];
  for (const [f, cls] of SITES) {
    const css = read(f);
  // ⚠ EVERY RULE FOR THE SELECTOR, NOT THE FIRST ONE. This estate declares figure style
  // in a SECOND rule for the same class, deliberately: the font shorthand RESETS
  // font-variant-numeric, so the setting has to come AFTER it. A matcher that stopped at
  // the first block found the shorthand, saw no figure style, and reddened a cured tree
  // five times over — asserting where a declaration LIVES rather than whether it APPLIES,
  // which is the F-15.12 family, and R-38.5's ordering rule is what makes it non-obvious.
    const blocks = [...css.matchAll(new RegExp('\\.' + cls + '\\{([^}]*)\\}', 'g'))].map((b) => b[1]);
    if (!blocks.length) { bad.push(cls + ' has no rule at all'); continue; }
    const fvn = blocks.map((b) => (b.match(/font-variant-numeric:([^;}]*)/) || [])[1]).filter(Boolean).join(' ');
    if (!fvn) { bad.push(cls + ' declares no figure style at all'); continue; }
    const m = [null, fvn];
    if (!m) { bad.push(cls + ' declares no figure style at all'); continue; }
    if (!/lining-nums/.test(m[1])) bad.push(cls + ' is tabular but not lining — oldstyle figures survive on a serif rung');
    if (!/tabular-nums/.test(m[1])) bad.push(cls + ' lost tabular figures (R-38.5)');
  }
  return bad.length ? bad.join(' | ') : null;
});

// C67 — the card tap opens the record; a URL never enters select-mode.
//    F-39.17, re-ruled at c-39.25 after the founder's walk: 「essentially its a double tap
//    to reach whats alredy there」. The refusal that SURVIVES is the other one — `selected`
//    is the long-press bulk set, and a link arriving with a row ticked is a gesture's state
//    entered without the gesture. Both were refused together; only one was wrong.
//    RED MUTATION: replace `setSel(row)` with a focus() call in SliceShell.tsx.
cell('C67 ?lead opens the record inside the shell, and never enters select-mode (F-39.17)', () => {
  const bad = [];
  const src = strip(read('components/vendor/slices/SliceShell.tsx'));
  // P7.2 AMENDMENT (labeled): the arm's dependency list lost `screenInShell` with the hook.
  const arm = src.match(/const want = new URLSearchParams[\s\S]{0,700}?\n  \}, \[slice, rows\]/);
  if (!arm) { bad.push('the ?lead arm is gone from SliceShell'); return bad.join(' | '); }
  if (!/setSel\(row\)/.test(arm[0])) bad.push('the ?lead arm does not open the record — the founder called that a double tap');
  if (/setSelected/.test(arm[0])) bad.push('the ?lead arm touches the bulk-select set — a URL must never tick a row');
  if (/screenInShell|useInShell/.test(arm[0])) bad.push('the ?lead arm still reads the retired shell gate');
  if (!/scrollIntoView/.test(arm[0])) bad.push('the row is not scrolled to — closing the sheet would land at the top of the list');
  return bad.length ? bad.join(' | ') : null;
});

// C68 — done_today renders in BOTH states, from one summary, with a status byte over
//    exactly one of them.
//    F-39.18 (3). The wire carried done_today in both states and the surface read it in
//    one, so a vendor with eleven leads saw only what she owed. The head is the resting
//    arm's alone: "All clear." above the cards that disprove it is F-38.31 with the sign
//    flipped, which is the same objection R-39.13 settled for the masthead.
//    RED MUTATION: render TodayResting instead of TodayDone in the working arm.
cell('C68 done_today renders in both states, and only the resting arm carries a status byte (F-39.18)', () => {
  const bad = [];
  const cards = strip(read('components/worklist/TodayCards.tsx'));
  if (!/function DoneSummary/.test(cards)) bad.push('the summary has no single home — two states cannot read one shape');
  const resting = (cards.match(/export function TodayResting[\s\S]*?\n\}/) || [''])[0];
  const done    = (cards.match(/export function TodayDone[\s\S]*?\n\}/) || [''])[0];
  if (!resting) bad.push('TodayResting is gone');
  if (!done) bad.push('TodayDone is gone — the working state shows nothing finished');
  if (!/todayRestingHead/.test(resting)) bad.push('the resting state lost its status byte');
  if (/todayRestingHead/.test(done)) bad.push('the working state carries a status byte over its cards (R-39.13)');
  for (const f of [resting, done]) if (f && !/DoneSummary/.test(f)) bad.push('a state builds its own summary instead of reading the one home');
  const page = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/\{working && today && <TodayDone/.test(page)) bad.push('the working state does not render done_today');
  if (!/\{resting && today && <TodayResting/.test(page)) bad.push('the resting state does not render its summary');
  // ZERO NEW BYTES: the three row labels are the registry's, not the executor's (s-39.6).
  if (/'Invoices paid'|'Contracts signed'|'Tasks done'/.test(cards)) bad.push('the summary spells its own row labels — three unvetoed vendor-facing bytes (s-39.6)');
  return bad.length ? bad.join(' | ') : null;
});



// ══ S4/3 · TODAY MATCHES THE MOCK ═════════════════════════════════════════════
// Subject: docs/mocks/today-working-mock.html @ d1f2c80, frames A1-*. The A2-* frames in
// the same file are the UNPICKED shape — D1_VETO_SHEET says a charter must name the FRAMES
// and not only the file, "otherwise a cell reading the file finds two answers." These
// cells read the SOURCE against the ratified bytes; whether the frame is MATCHED on glass
// is the render arm's (C-R18/C-R19) and is declared REFUSED-egress at the LE seat.

// C69 — the kind line reads counts from the wire and nouns from the one map.
//    F-39.24's cure and D-1/c3. The nouns are FIVE NEW BYTES and not a formatting of
//    ROOMS: four rooms singularise cleanly but the fifth is labelled `Team` while the
//    ruled line reads `1 task`, which is the KIND's noun. Spelling any of them at the
//    render site would put a sixth home in the tree for a byte the register owns.
//    RED MUTATION: replace COPY.kindNouns[kind] with a literal in TodayCards.tsx.
cell('C69 the kind line takes counts from the wire and nouns from the one map (D-1/c3)', () => {
  const bad = [];
  const copy = strip(read('lib/worklist/copy.ts'));
  const map = (copy.match(/kindNouns:\s*\{[\s\S]*?\}/) || [''])[0];
  if (!map) { bad.push('kindNouns has no home in copy.ts'); return bad.join(' | '); }
  const WANT = { lead_unanswered: "'lead', 'leads'", invoice_due: "'invoice', 'invoices'",
                 events_today: "'event', 'events'", contract_unsigned: "'contract', 'contracts'",
                 team_tasks: "'task', 'tasks'" };
  for (const [k, v] of Object.entries(WANT)) {
    if (!new RegExp(k + ':\\s*\\[' + v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\]').test(map))
      bad.push('kindNouns.' + k + ' is not the vetoed pair [' + v + ']');
  }
  const src = strip(read('components/worklist/TodayCards.tsx'));
  // ⚠ SCOPED TO THE KIND LINE, NOT THE FILE, AND THE FIRST CUT WAS NOT. Sweeping the whole
  // module for a quoted noun reddened on `label('invoices')` and `label('contracts')` in
  // the ledger — which are ROOM IDS handed to the registry, the opposite of a spelled byte.
  // A cell that cannot tell a lookup key from a rendered word is asserting the presence of
  // a substring rather than the property, and it would have gone on reddening a correct
  // tree. The property belongs to one function, so the assertion reads one function.
  const line = (src.match(/export function TodayKindLine[\s\S]*?\n\}/) || [''])[0];
  if (!line) { bad.push('TodayKindLine has no home'); return bad.join(' | '); }
  if (!/COPY\.kindNouns\[kind\]/.test(line)) bad.push('the kind line does not read the map');
  for (const n of ['lead', 'invoice', 'event', 'contract', 'task'])
    if (new RegExp("'" + n + "s?'").test(line)) bad.push('a kind noun is spelled at the render site: ' + n);
  if (!/counts\[kind\]/.test(line)) bad.push('the kind line does not read counts from the wire');
  return bad.length ? bad.join(' | ') : null;
});

// C70 — every kind-line segment anchors to a section that exists.
//    D-1 measured 5 of 5 anchors resolving. The id is built by one function read by both
//    the line and the section, so an anchor cannot point at a heading that was renamed.
//    RED MUTATION: spell the href as '#leads' at the kind line.
cell('C70 each kind-line segment anchors to its own eyebrow, by one spelling (F-39.24)', () => {
  const bad = [];
  const src = strip(read('components/worklist/TodayCards.tsx'));
  if (!/export function sectionId/.test(src)) bad.push('the anchor id has no single home');
  if (!/href=\{'#' \+ sectionId\(kind\)\}/.test(src)) bad.push('the kind line does not build its href from sectionId');
  if (!/id=\{sectionId\(kind\)\}/.test(src)) bad.push('the section does not carry the id the line points at');
  if (/href="#sec-/.test(src)) bad.push('an anchor is spelled inline — two homes for one address');
  return bad.length ? bad.join(' | ') : null;
});

// C71 — the fold shows the OLDEST three, keeps the rest in the DOM, and never sorts.
//    §3 property 5: ties break oldest-first AS DELIVERED, so "the oldest three" is a slice
//    of the wire's order and never a sort. The hidden rows stay in the DOM so opening the
//    fold cannot re-rank anything — the alternative, slicing on open, would put the
//    ordering decision inside a click handler.
//    RED MUTATION: render rows.slice(-3) in place, or sort by created_at.
cell('C71 the fold keeps three in place from the wire order and hides the rest in the DOM (R-39.14)', () => {
  const bad = [];
  const src = strip(read('components/worklist/TodayCards.tsx'));
  if (!/const IN_PLACE = 3/.test(src)) bad.push('the in-place count is not 3, or has no home');
  if (!/i < IN_PLACE \? card :/.test(src)) bad.push('the first rows in place are not the first rows of the wire order');
  if (/\.slice\(-/.test(src)) bad.push('the fold takes rows from the END — the newest, not the oldest (property 5)');
  if (/\.sort\(|\.reverse\(/.test(src)) bad.push('the feed sorts or reverses — key and row order are the wire\'s (properties 4 and 5)');
  if (!/wl-tfolded/.test(src)) bad.push('the hidden rows are not in the DOM — opening the fold would re-rank');
  return bad.length ? bad.join(' | ') : null;
});

// C72 — a capped kind never promises a total, and always offers the room.
//    c-39.28 amending F-a. `counts[k]` is a FLOOR once `truncated[k]` fires (§3 property
//    3), so "Show all 25" would be a badge that is secretly a floor wearing an affordance.
//    The label interpolates the SAME text the count renders, tell included, which is why
//    two controls may stand together: "Show all 20+" reveals the twenty the wire holds and
//    "See all in Leads" goes where the twenty-first lives. One promise each.
//    RED MUTATION: build the fold label from counts[kind] directly, or drop the room door.
cell('C72 a capped kind shows the tell inside its promise and a door to the room (c-39.28)', () => {
  const bad = [];
  const src = strip(read('components/worklist/TodayCards.tsx'));
  if (!/function countText/.test(src)) bad.push('the figure-with-tell has no single home');
  if (!/todayTruncatedSuffix/.test((src.match(/function countText[\s\S]*?\n\}/) || [''])[0]))
    bad.push('countText does not carry the truncation tell');
  const fold = (src.match(/todayFoldMore[\s\S]{0,120}/) || [''])[0];
  if (!/countText\(today, kind\)/.test(fold)) bad.push('the fold label is built from a bare count, not the tell-carrying text');
  if (!/todaySeeAllIn/.test(src)) bad.push('a capped kind offers no door to the room that holds the rest');
  if (!/\{cut && \(/.test(src)) bad.push('the room door is not gated on truncated[k]');
  const copy = strip(read('lib/worklist/copy.ts'));
  for (const k of ['todayFoldMore', 'todayFoldLess', 'todaySeeAllIn', 'todayOwedCaption', 'todayDueToday', 'todayDoneHead'])
    if (!new RegExp(k + ":\\s*'").test(copy)) bad.push(k + ' is not in the copy register');
  return bad.length ? bad.join(' | ') : null;
});

// C73 — "Due today" is answered by the WIRE's date, never the device's.
//    F-b, ruled. The response carries `today` — the IST calendar date the feed was cut
//    for — precisely so the client does not compute one. A `new Date()` comparison on a
//    phone in another timezone labels a due invoice overdue, or the reverse, and the
//    vendor cannot tell which clock she is reading. F-P3.8's class (istTodayISO had five
//    homes) arriving on the pwa side.
//    RED MUTATION: compare due_date to new Date().toISOString() in dueLine.
cell('C73 the due line reads the wire\'s date and constructs none of its own (F-b)', () => {
  const bad = [];
  const src = strip(read('components/worklist/TodayCards.tsx'));
  const fn = (src.match(/function dueLine[\s\S]*?\n\}/) || [''])[0];
  if (!fn) { bad.push('dueLine has no home'); return bad.join(' | '); }
  if (/new Date\(\)|Date\.now\(\)/.test(fn)) bad.push('the due line builds a date from the device clock (F-P3.8 class)');
  if (!/wireToday/.test(fn)) bad.push('the due line does not compare against the wire\'s today');
  if (!/today\.today/.test(src)) bad.push('the wire\'s own date is never read');
  // The whole card path: the only Date construction permitted is formatting a wire value.
  const card = (src.match(/function Card\([\s\S]*?\n\}/) || [''])[0];
  if (/new Date\(\)/.test(card)) bad.push('the card path constructs a device date');
  return bad.length ? bad.join(' | ') : null;
});

// C74 — the ledger shows the particular, and only the resting arm carries a status byte.
//    F-d amending F-39.18(3)'s seal by name; s-39.6 discharged, because a particular
//    removes the need for the three registry labels that stood in for a vetoed set.
//    invoice_number, client_name, amount_total and the task title were all on the wire
//    from Phase 3 and read by nobody — this is a client change only.
//    RED MUTATION: render TodayResting in the working arm, or drop the particular.
cell('C74 the done ledger carries its particular; the status byte is the resting arm\'s alone (F-d)', () => {
  const bad = [];
  const src = strip(read('components/worklist/TodayCards.tsx'));
  const sum = (src.match(/function DoneSummary[\s\S]*?\n\}/) || [''])[0];
  if (!sum) { bad.push('DoneSummary has no single home'); return bad.join(' | '); }
  for (const f of ['client_name', 'invoice_number', 'amount_total'])
    if (!sum.includes(f)) bad.push('the ledger omits the invoice particular: ' + f);
  if (!/wl-trestpart/.test(sum)) bad.push('the ledger renders no particular line');
  if (!/formatRs/.test(sum)) bad.push('the ledger builds a money string outside the one money home (D-7)');
  const resting = (src.match(/export function TodayResting[\s\S]*?\n\}/) || [''])[0];
  const done    = (src.match(/export function TodayDone[\s\S]*?\n\}/) || [''])[0];
  if (!/todayRestingHead/.test(resting)) bad.push('the resting state lost its status byte');
  if (/todayRestingHead/.test(done)) bad.push('the working ledger carries a status byte over its cards (R-39.13)');
  if (!/todayDoneHead/.test(done)) bad.push('the working ledger has no eyebrow');
  if (/'Invoices paid'|'Contracts signed'|'Tasks done'/.test(src)) bad.push('the ledger spells its own row labels (s-39.6)');
  const page = strip(read('app/vendor/(shell)/today/page.tsx'));
  if (!/\{working && today && <TodayDone/.test(page)) bad.push('the working state renders no ledger');
  if (!/\{resting && today && <TodayResting/.test(page)) bad.push('the resting state renders no ledger');
  // D-1/c5: the resting masthead carries no numeral. A 0 beside "All clear." twice-tells.
  if (/\{resting && feed\.openItems/.test(page)) bad.push('the resting state paints a numeral beside All clear. (D-1/c5)');
  return bad.length ? bad.join(' | ') : null;
});

// C75 — the build id is computed per request, outside any cacheable chunk.
//    F-39.16, wrong twice in the same direction. The stamp read an inlined NEXT_PUBLIC_*
//    constant from a CLIENT component unchanged since 08ecf78, so Next's build cache
//    restored the module with the previous build's commit inside it.
//    ⚠ THIS CELL ASSERTS THE DYNAMIC PROPERTY, NOT A FILE NAME. A future seat removing the
//    cookies() call would make the /w subtree static again, the element would still be in
//    the right place, and the stamp would silently go stale once more. Location is not the
//    property; being computed per request is. The two-build claim itself belongs to the
//    render arm and is declared there.
//    RED MUTATION: restore NEXT_PUBLIC_TDW_COMMIT to next.config.ts, or delete cookies().
cell('C75 the build id is read per request in the server layer, not inlined at build (F-39.16)', () => {
  const bad = [];
  const cfg = strip(read('next.config.ts'));
  if (/NEXT_PUBLIC_TDW_COMMIT/.test(cfg)) bad.push('the inlined constant is back in next.config.ts — a compile-time value cannot know its deployment');
  const layout = strip(read('app/vendor/(shell)/layout.tsx'));
  if (/'use client'|"use client"/.test(layout)) bad.push('the identity layer is a client component — it cannot read a request-time env');
  if (!/cookies\(\)/.test(layout)) bad.push('the /w subtree is no longer dynamic, so the id can be baked at build again');
  if (!/process\.env\.VERCEL_GIT_COMMIT_SHA/.test(layout)) bad.push('the id is not read from the deployment\'s own env');
  if (!/data-tdw-commit=\{commit\}/.test(layout)) bad.push('the stamp does not render the request-time value');
  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  if (/data-tdw-commit=/.test(shell)) bad.push('a second stamp survives in the client shell — two ids, one of them stale');
  for (const f of ['tools/wl_audit.mjs', 'tools/wl_render.cjs'])
    if (!/data-tdw-commit/.test(read(f))) bad.push(f + ' no longer reads the stamp it reports');
  return bad.length ? bad.join(' | ') : null;
});

// ── lineStrip · FOR `lib/vendor/api/vendor.ts` ONLY, AND BOTH HALVES ARE EARNED ──
// The shared `strip()` removes BLOCK comments, and `vendor.ts` holds 3 `/*`
// openers against 2 `*/` closers — so it pairs an opener with a closer hundreds
// of lines away and SWALLOWS LIVE CODE. That is F-39.13, filed when three
// absence cells went vacuously green on this exact file; C65 reads raw for it.
//
// But RAW is not the answer either: the first cut of C77 read raw and reddened
// on its own COMMENT, which describes the `payment_status` arithmetic the
// crossing removed. A cell that reads its subject's prose as evidence is the
// mirror F-39.25 names.
//
// So: strip LINE comments and leave block comments alone. The corruption comes
// from the block-comment pass; the false positive comes from line comments.
// Neither the shared helper nor raw text can be right here, and saying which
// half of the problem each solves is the only way this stays fixed.
const lineStrip = (t) => t.split('\n').map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');

// ── C-MONEY · THE CROSSING  [ROAD STEP 2c · F-39.3] ──────────────────────────────
//    Four facts, asked separately because any one alone is a hollow green. The rooms
//    changed PLANE this sitting; a cell that only checked the new address would pass
//    over a file that still holds the old one beside it.
cell('C76 no engine money reader or writer is reachable from the rooms (F-39.3)', () => {
  // THE MONEY SURFACES AND EVERYTHING THEY IMPORT. `fetchCabinet` / `fetchLedger` /
  // `binderBase` SURVIVE — the Clients room and Cabinet.tsx:297 still read the binder
  // plane, and retiring the door with the room would take Clients down with it. What
  // must be gone is a MONEY caller of them.
  const bad = [];
  // ⚠ RAW, NOT STRIPPED — F-39.13, AND C65 ALREADY CARRIES THIS REASONING.
  // `vendor.ts` holds unbalanced `/*` sequences, so the shared `strip()` pairs
  // an opener with a closer hundreds of lines later and SWALLOWS LIVE CODE.
  // The first cut of this cell stripped and reported 「fetchInvoices is gone
  // from vendor.ts」 — the function was there; the instrument had eaten it.
  // That is the exact shape F-39.13 filed, walked into again one arc later.
  const src = lineStrip(read('lib/vendor/api/vendor.ts'));
  const moneyFns = ['fetchInvoices', 'fetchExpenses', 'createInvoice', 'updateInvoice',
                    'recordPayment', 'fetchInvoicePdf', 'cancelInvoice',
                    'createExpense', 'updateExpense', 'deleteExpense'];
  for (const fn of moneyFns) {
    const i2 = src.indexOf(`function ${fn}(`);
    if (i2 < 0) { bad.push(`${fn} is gone from vendor.ts`); continue; }
    const end = src.indexOf('\nexport ', i2 + 10);
    const body = src.slice(i2, end < 0 ? src.length : end);
    if (/fetchCabinet\(|fetchLedger\(|binderBase\(/.test(body)) {
      bad.push(`${fn} still reaches the engine binder plane`);
    }
    if (!/moneyBase\(/.test(body)) bad.push(`${fn} does not address the typed money door`);
  }
  // The two adapters retired with their readers (§8.9).
  if (/function binderToInvoice\(|function binderToExpense\(/.test(src)) {
    bad.push('binderToInvoice/binderToExpense survive their last reader');
  }
  // The eleventh site: expenses.tsx built its URL inline and no export sweep could see it.
  for (const f of ['app/vendor/(shell)/expenses/body.tsx', 'app/vendor/(shell)/invoices/body.tsx']) {
    if (/api\/v2\/vendor\/binders\//.test(strip(read(f)))) bad.push(f + ' still addresses the binder plane');
  }
  return bad.length ? bad.join(' | ') : null;
  // RED MUTATION: re-point `fetchExpenses` at `fetchLedger` → red.
});

cell('C77 no state is derived client-side in the money block (F-2c.p6)', () => {
  // Three writers each computed `payment_status` from amounts before posting —
  // three state machines for one column, none of them the home's. The home's
  // positive-list transition is the one place a state is decided (b47 2.2), and
  // `payment_type: 'balance'` no longer closes an invoice regardless of arithmetic.
  const src = lineStrip(read('lib/vendor/api/vendor.ts')); // see lineStrip above
  const bad = [];
  for (const fn of ['createInvoice', 'updateInvoice', 'recordPayment']) {
    const i2 = src.indexOf(`function ${fn}(`);
    if (i2 < 0) continue;
    const end = src.indexOf('\nexport ', i2 + 10);
    const body = src.slice(i2, end < 0 ? src.length : end);
    if (/payment_status|=\s*['"](paid|advance_paid|unpaid)['"]/.test(body)) {
      bad.push(`${fn} derives an invoice state client-side`);
    }
  }
  return bad.length ? bad.join(' | ') : null;
  // RED MUTATION: restore `const status = pending <= 0 ? 'paid' : ...` in createInvoice → red.
});

cell('C78 Books mounts zero verbs — the id space no longer enforces it', () => {
  // AT 2b THIS HELD BY CONSTRUCTION. The movement ids are composites and the rooms
  // keyed their controls on engine binder ids, so a control here had nothing to key
  // on. The rooms are typed now and the money door mounts eleven routes. The ids are
  // unchanged; THIS CELL is the only thing keeping the room read-only.
  const src = strip(read('components/worklist/BooksBody.tsx'));
  const verbs = src.match(/<button|<a\s|onClick=|<form|<input|onTrigger|useSwipe/g) || [];
  // b40's contract is NULL for pass, a STRING for fail. The first cut returned
  // `true`, which the runner read as a failure message reading 「true」.
  return verbs.length === 0 ? null
    : `BooksBody mounts ${verbs.length} control(s): ${verbs.join(' ')}`;
  // RED MUTATION: add an onClick to a movement row → red.
});

cell('C79 the register renders D-1 B13\u2019s particular and sums nothing (F-39.21)', () => {
  const src = strip(read('components/worklist/BooksBody.tsx'));
  const bad = [];
  // The particular reaches the glass, per side.
  for (const k of ['client_name', 'invoice_number', 'milestone_label', 'category', 'description']) {
    if (!new RegExp(`p\\.${k}`).test(src)) bad.push(`the particular drops ${k}`);
  }
  if (!/amount_paid.*amount_total|of \$\{formatRs/.test(src)) bad.push('「Rs X of Rs Y」 is not rendered');
  // invoices.description is STRUCK at the door (F-39.23) and must not be reached for here.
  if (/invoice[_.]description/.test(src)) bad.push('BooksBody reaches for invoices.description — F-39.23');
  // THE SURFACE SUMS NOTHING. Opening/closing are read off the chain's own cells.
  if (/\.reduce\(/.test(src)) bad.push('BooksBody sums — opening/closing are READ, never derived (F-04.13)');
  // The ruled heads, from copy.ts and never spelled here.
  const copy = strip(read('lib/worklist/copy.ts'));
  for (const [k, v] of [['booksReceived', 'Total received'], ['booksColCredit', 'Received'],
                        ['booksColDebit', 'Paid out'], ['booksOpening', 'Opening'],
                        ['booksClosing', 'Closing']]) {
    if (!new RegExp(`${k}:\\s*'${v}'`).test(copy)) bad.push(`copy.ts ${k} is not '${v}' (D-1)`);
    if (!new RegExp(`COPY\\.${k}`).test(src)) bad.push(`BooksBody does not read COPY.${k}`);
  }
  return bad.length ? bad.join(' | ') : null;
  // RED MUTATION: drop `p.category` from particularOf → red.
});


// ══ CE-39 · ROAD STEP 2b · 2b-2 ══════════════════════════════════════════════
// Four cells. C80 and C82 are the arm's own; C81 crosses the repo boundary and
// says so; C83 is F-39.26's OWED BOTH-WAYS CELL, which 2b-1 shipped the wiring
// for and deferred the proof of — 「the wiring ships now; the seal does not」.

// ── C83 · THE TODAY DOOR HAS CALLERS, AND THE ABSENCE IS PROVEN BOTH WAYS ────
//    F-39.26: `refreshToday()` existed, was exported, and its doc read IN THE
//    PRESENT TENSE 「the verbs call this after a write commits」 — with ZERO
//    callers in either repo. `pending` is module-scope, so a fresh mount of
//    `useTodayFeed` awaited the same settled promise and the vendor read the
//    state she had just changed.
//
//    THE CELL COUNTS CALLERS AT BOTH DOORS, because the two arms catch
//    different diseases and either alone passes over the other:
//      · NAVIGATION + FOCUS in WorklistShell. Focus is the half navigation
//        cannot see — a vendor who answers WhatsApp and comes back has
//        navigated nowhere and her reading is as stale as if she had.
//      · THE MONEY WRITES in vendor.ts, after commit. That covers a write and a
//        read on ONE route, which navigation cannot see either.
//
//    ⚠ IT ASSERTS A FLOOR, NEVER AN EXACT COUNT. 「Assert the artifact, never a
//    predicted count」: a seventh money write arriving next sitting must not red
//    a cell about staleness. The floor is what the arc PROVED it needs, and the
//    named sites are what a reader checks against.
//    RED MUTATION (production code, not setup): delete
//    `useEffect(() => { refreshToday(); }, [pathname]);` from WorklistShell, or
//    drop the `refreshToday()` line from any single money write in vendor.ts.
cell('C83 the Today memo is dropped on navigation, on focus, and after every money write (F-39.26)', () => {
  const bad = [];
  const feed = strip(read('lib/worklist/feed.ts'));
  // ── F-39.56 · AMENDED · RETIRE-WITH-THE-READER ────────────────────────────
  // This assertion was the ONE-LINE BODY, verbatim:
  //   `export function refreshToday(): void { pending = null; }`
  // It was right for what it guarded — that the door drops the MEMO and does not
  // merely exist — and it went red the moment F-39.56 gave the function a body.
  // A cell keyed to a whole function's text cannot survive that function gaining a
  // reason, so it is re-keyed to the PROPERTY it was always about: `refreshToday`
  // sets `pending` to null. The staleness gate and the notify loop are new
  // behaviour with their own cells below; they are not this one's business.
  if (!/export function refreshToday\(/.test(feed) || !/pending = null;/.test(feed))
    bad.push('refreshToday no longer drops the module-scope memo — the door is the cure, not the export');

  // ── F-39.56 · THE INVALIDATION MUST REACH A MOUNTED SURFACE ───────────────
  // C83 proved the door was WIRED. It could not prove anyone was LISTENING, and
  // nobody was: `useTodayFeed` read the memo in an effect with an empty dependency
  // array, so twenty tab-returns to /w/today produced ZERO fetches — measured on
  // real Chromium at smalls A. Dropping a memo under a hook that will never look
  // again is a door opening onto a surface that stopped listening.
  if (!/subscribeToday\(/.test(feed))
    bad.push('feed.ts has no subscription door — refreshToday cannot reach a mounted useTodayFeed (F-39.56)');
  if (!/const off = subscribeToday\(read\)/.test(feed))
    bad.push('useTodayFeed does not subscribe — it still reads once per mount and never again (F-39.56)');
  if (!/listeners\.add|listeners\.delete/.test(feed))
    bad.push('the listener set is not maintained — a subscription that never unsubscribes leaks a surface');
  // NO RE-PRIME: the listener must go back through readToday(), not hold its own
  // copy of the reading. Two derivations of one reading is the disease the memo cures.
  if (/setFeed\(\s*\{/.test(feed))
    bad.push('useTodayFeed builds a reading of its own — one home, and it is readToday()');

  // ── F-39.56 · THE 30s GATE, AND WHO MAY NOT HAVE IT ───────────────────────
  // The threshold is for FOCUS alone. A money verb passing `ifOlderThan` would be
  // a write silently declining to invalidate the reading it just falsified, which
  // is worse than the defect this whole door exists to cure.
  if (!/ifOlderThan/.test(feed))
    bad.push('refreshToday has no staleness gate — every alt-tab would now bill a request (F-39.56)');
  if (!/readAt > 0 && Date\.now\(\) - readAt < opts\.ifOlderThan/.test(feed))
    bad.push('the staleness comparison is not keyed to when the reading SETTLED');

  // ── THE DOC, WHICH WAS THE DEFECT ────────────────────────────────────────
  // The sentence that shipped for a whole arc was a PROMISE wearing a
  // DESCRIPTION. A doc claiming callers is asserted against the callers.
  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  const nav = /useEffect\(\(\)\s*=>\s*\{\s*refreshToday\(\);\s*\}\s*,\s*\[pathname\]\)/.test(shell);
  if (!nav) bad.push('WorklistShell does not drop the memo on navigation');
  // F-39.56 · the focus arm now PASSES the gate, so the old `refreshToday()`
  // literal no longer appears on it. Keyed to the call with its 30s option.
  const focus = /addEventListener\(\s*['"]focus['"]/.test(shell) && /document\.hidden/.test(shell)
    && /refreshToday\(\s*\{\s*ifOlderThan:\s*30_000\s*\}\s*\)/.test(shell);
  if (!focus) bad.push('WorklistShell does not drop the memo on return-to-focus — the half navigation cannot see');

  const api = strip(read('lib/vendor/api/vendor.ts'));
  const writes = (api.match(/refreshToday\(\)/g) || []).length;
  // F-39.56 · the money verbs must call the UNGATED door. `refreshToday()` with no
  // argument is unconditional by design, so a verb that grew an option would be
  // declining to invalidate a reading its own write just made false.
  if (/refreshToday\(\s*\{/.test(api))
    bad.push('a money verb passes a staleness option — a write may never decline to invalidate (F-39.56)');
  if (writes < 7) bad.push('only ' + writes + ' money writes drop the memo; seven were wired at 2b-1 '
    + '(create/update invoice, record payment, cancel, create/update/delete expense)');

  // NO VERB-SPECIFIC HACK. One door in, one door out: a verb patching the cached
  // body would be a SECOND derivation of one reading, which is the disease the
  // memo was built to cure.
  if (/pending\s*=\s*(?!null)/.test(api))
    bad.push('vendor.ts writes the memo directly instead of dropping it through the one door');
  return bad.length ? bad.join(' | ') : null;
});

// ── C80 · THE TEAM ROW CARRIES NO STATE WORD  [F-2b2.1, founder arm (a)] ────
//    The charter's contract read `name · role · active → Active/Inactive`,
//    derived from the COLUMN: `team_members.active` is `boolean NOT NULL`,
//    two-valued, no CHECK enumerating a third state. The column is two-valued.
//    THE DOOR IS NOT — `src/api/vendor/studio/team.js:48` filters
//    `.eq('active', true)` unconditionally, reads no `req.query`, and accepts no
//    parameter that would widen it. Every row this body can receive has
//    `active === true`, so a two-valued render is a distinction the estate
//    cannot make, rendering one value forever.
//
//    c-39.39 is the chair's: arm (i) was ruled at the column, not at the door.
//    It is c-2c.2 one layer up — that swept the TABLE and not the CALLER; this
//    swept the COLUMN and not the DOOR.
//
//    ⚠ IT ASSERTS THE ABSENCE OF THE WORD, NOT THE ABSENCE OF THE FIELD, and
//    the difference is the cell's whole value. A later seat re-deriving
//    `active` for a filter, a sort or a count is doing something this ruling
//    never forbade; a seat PRINTING a state word on the row is undoing it.
//    RED MUTATION: add `{m.active ? 'Active' : 'Inactive'}` to the Team row in
//    components/worklist/TeamTabs.tsx → red.
cell('C80 the Team tab renders no membership state word (F-2b2.1)', () => {
  const src = strip(read('components/worklist/TeamTabs.tsx'));
  const bad = [];
  for (const w of ['Active', 'Inactive', 'Invited']) {
    if (new RegExp("['\"]" + w + "['\"]").test(src)) bad.push('TeamTabs spells the state word 「' + w + '」');
  }
  const copy = strip(read('lib/worklist/copy.ts'));
  for (const w of ['Active', 'Inactive', 'Invited']) {
    if (new RegExp("team[A-Za-z]*:\\s*'" + w + "'").test(copy))
      bad.push('the register mints a team state byte 「' + w + '」');
  }
  // The door's own filter is the REASON, so the reason is asserted too: if a
  // later sitting widens the door, this cell should be RE-RULED rather than
  // silently continuing to forbid a word that has become honest.
  //
  // ⚠ IT REFUSES RATHER THAN THROWS WHEN THE SIBLING IS ABSENT  [F-39.47].
  // This read was unguarded, so on a tree without `../dream-os` it raised ENOENT,
  // `cell()`'s catch turned it into 「RED — threw」, and the floor recorded a
  // defect in the TEAM TAB because a repo was not cloned. C81 and C84 already
  // named this precondition; C80 crossed the same boundary and said nothing,
  // which is why the chair's ruling reads 「C81, C84, and any sibling-absent
  // cell」 rather than naming two.
  //
  // The FIRST HALF of this cell — the pwa-only word census above — is not
  // conditional on the sibling and has already run. Refusing here reports that
  // the REASON could not be checked, not that the assertion could not be made.
  const doorRel = '../dream-os/src/api/vendor/studio/team.js';
  if (!fs.existsSync(path.join(ROOT, doorRel))) {
    return 'REFUSED — the dream-os sibling is absent, so the team door\'s '
         + '.eq(\'active\', true) filter — this cell\'s stated REASON — cannot be read. '
         + 'Clone it beside this repo and re-run; this is not a FAIL.';
  }
  const door = strip(read(doorRel));
  if (!/\.eq\('active',\s*true\)/.test(door))
    bad.push("the team door no longer filters .eq('active', true) — F-2b2.1's premise moved; re-rule C80 rather than loosen it");
  return bad.length ? bad.join(' | ') : null;
});

// ── C82 · THE THREE TABS WRITE, IN THE SHELL, AND THE + IS STILL THE SHELL'S SEAT
//    RETIRED-WITH-THE-READER at CE-39 road step 2c-Studio. THE ASSERTION THAT
//    STOOD HERE, QUOTED BEFORE IT IS REPLACED:
//
//      「C82 the Team tabs read only, and the + rides the one FAB seat (F-39.30)」
//
//    and its own header said why it would not last:
//
//      「the body mounts no write door: no POST/PATCH/DELETE client and no form.
//       A verb appearing here is 2c-Studio's work arriving early and unruled.」
//
//    2c-Studio is neither early nor unruled. So the cell is not loosened, not
//    amended and not deleted: it is INVERTED. Every clause that asserted the
//    read now asserts the write, and the clause that guarded the FAB seat is
//    carried across UNCHANGED, because that one never depended on the room being
//    read-only. A cell that had to be re-ruled the day its declaration closed is
//    a cell that did its job; one that quietly went green would have been the
//    F-39.30 declaration rotting where nobody looked.
//
//    ⚠ IT ASSERTS TEN VERBS, NOT NINE  [c-39.46]. The 2b-2 verb table listed the
//    SHEET verbs and missed the ROW action, so `cancelPayment` — live at
//    `src/api/vendor/studio/payments.js:368` the whole time, with no typed door
//    and its only caller building a bare `fetch` — was about to retire with the
//    /vendor tree at the flip. THE COUNT IS ASSERTED AS A NAMED SET, never as a
//    number: a cell that says 「ten」 goes green when a verb is swapped for
//    another, which is the arithmetic-over-artifact failure this floor forbids.
//
//    FIVE THINGS, each catching a different way the crossing rots:
//      (1) all ten verbs are IMPORTED FROM THE TYPED DOOR. Not merely present —
//          `lib/vendor/api/vendor.ts`. A room that re-grew the raw `fetch` +
//          `localStorage` shape the tenth verb arrived with would satisfy a
//          weaker cell and would have crossed nothing.
//      (2) NO `/vendor/studio` HREF SURVIVES IN THE SHELL, and the sweep is the
//          whole room — TeamTabs AND the sheets it mounts, because a destination
//          moved one file sideways is not a destination removed.
//      (3) THE ENDPOINTS DID NOT MOVE. The room reaches no `/api/` path of its
//          own. This is the plane-crossing tripwire: 2c-Studio was ruled a UI
//          crossing, and a route spelled in this room would be a second address
//          space nobody chartered.
//      (4) the body still mounts `Fab` and draws no seat of its own (C49 walks
//          the graph for the geometry; this asserts the IMPORT, so a seat added
//          without geometry — a plain button in a corner — is caught here).
//      (5) INTERIM_VENDOR_LINKS DID NOT SHRINK. Founder-ruled at this sitting:
//          `/vendor/more:84` and `/vendor/studio/page.tsx:28` still route into
//          `/vendor/team-hub`, whose STUDIO_ITEMS points at all three studio
//          pages. They keep their bodies until Phase 7 sweeps the tree at once.
//          A crossing that deleted its own fallback would be an outage.
//    RED MUTATION: re-point any one verb's import at '/vendor/studio/team' or
//    delete it from the room → red on that verb's name.
cell('C82 the Team tabs mount all ten verbs through the typed door, in the shell (F-39.30 CLOSED)', () => {
  const src   = strip(read('components/worklist/TeamTabs.tsx'));
  const sheet = strip(read('components/worklist/StudioSheets.tsx'));
  const room  = src + '\n' + sheet;
  const rooms = strip(read('lib/worklist/rooms.ts'));
  const bad = [];

  // (1) THE TEN, BY NAME, EACH FROM THE TYPED DOOR.
  const DOOR = /import\s*\{([\s\S]*?)\}\s*from\s*'@\/lib\/vendor\/api\/vendor'/;
  const imported = (src.match(DOOR) || [, ''])[1];
  for (const verb of ['addTeamMember', 'updateTeamMember', 'deleteTeamMember', 'rotateTeamMemberToken',
                      'createTask', 'updateTask', 'deleteTask',
                      'logPayment', 'markPaymentPaid', 'cancelPayment']) {
    if (!new RegExp('\\b' + verb + '\\b').test(imported))
      bad.push('the room does not import ' + verb + ' from the typed door');
    if (!new RegExp('\\b' + verb + '\\s*\\(').test(src))
      bad.push('the room imports ' + verb + ' but never calls it');
  }

  // (2) NO EXIT SURVIVES ANYWHERE IN THE ROOM.
  for (const m of room.matchAll(/'(\/vendor\/[^']*)'/g))
    bad.push('the room still points at ' + m[1] + ' — the shell may not exit into a tree that retires at the flip');

  // (3) A UI CROSSING, NOT A PLANE CROSSING.
  for (const m of room.matchAll(/'(\/api\/[^']*)'/g))
    bad.push('the room spells the endpoint ' + m[1] + ' — the door owns paths, not the surface');

  // (4) THE SEAT IS STILL THE SHELL'S. Carried across unchanged.
  if (!/from '@\/components\/worklist\/Fab'/.test(src))
    bad.push('the tabs do not mount the shell FAB — C49 owns the seat');

  // (5) THE FALLBACK TREE KEEPS ITS ADDRESSES UNTIL PHASE 7.
  // P7.2 AMENDMENT (labeled, INVERTED): the three /vendor/studio pages are DELETED with
  // the old tree, and the reason the registry declared them (team-hub routed into them) is
  // gone with team-hub. A studio address anywhere in the registry now reds.
  for (const href of ['/vendor/studio/team', '/vendor/studio/tasks', '/vendor/studio/team-payments']) {
    if (rooms.includes("'" + href + "'")) bad.push(href + ' is declared in the registry: the studio pages were deleted at P7.2');
  }
  return bad.length ? bad.join(' | ') : null;
});

// ── C85 · THE SHEETS OPEN INSIDE THE ROOM  [2c-Studio, the crossing's point] ─
//    The reason the verbs crossed at all is that the vendor stops LEAVING to use
//    them. That property is not 「a sheet exists」; it is that the sheet's
//    positioning context is the ROOM. `.wl-tm` carries `position:relative` and
//    the sheet carries `position:absolute`, so the masthead and the three tabs
//    stay lit behind the scrim. Delete the one word `relative` and the sheet
//    resolves against the viewport instead — it would still look right on most
//    screens and the room would silently stop being visible behind it, which is
//    exactly the class of loss that survives a screenshot.
//
//    ⚠ IT ALSO ASSERTS THE ROOM MOUNTS ITS OWN TOAST. Every one of the ten
//    verbs reports through `show` and nothing else (honest controls, CE-209); a
//    room that wrote without a toast on screen would make a failed write look
//    exactly like a successful one.
//    RED MUTATION: drop `position:relative` from `.wl-tm` → red.
cell('C85 the studio sheets open inside the room, and the room reports its writes', () => {
  const src   = strip(read('components/worklist/TeamTabs.tsx'));
  const sheet = strip(read('components/worklist/StudioSheets.tsx'));
  const bad = [];
  if (!/\.wl-tm\{[^}]*position:relative/.test(src))
    bad.push('.wl-tm lost position:relative — the sheet would resolve against the viewport and the room behind it would go dark');
  if (!/\.wl-sheet\{[^}]*position:absolute/.test(sheet))
    bad.push('.wl-sheet is no longer absolute inside the room');
  if (!/from '@\/components\/worklist\/WlToast'/.test(src))
    bad.push('the room mounts no toast — a failed write would look exactly like a successful one (CE-209)');
  if (!/from '@\/hooks\/vendor\/useToast'/.test(src))
    bad.push('the room has no toast state to report into');
  return bad.length ? bad.join(' | ') : null;
});

// ── C89 · EVERY SHEET HAS A WAY OUT THAT IS NOT A VERB  [F-2c.w1] ───────────
//    THE DEFECT IT EXISTS FOR, found by the founder on glass and by no
//    instrument: `MemberSheet`'s foot was `Remove | Save` with no Cancel. The
//    four short sheets each had one, so the absence read as normal — and the
//    member sheet is the only FULL-HEIGHT one, whose top edge reaches the
//    masthead, leaving no scrim to tap. A vendor who opened a crew member to
//    read his assignments could leave only by WRITING or by DESTROYING.
//
//    ⚠ THE MOCK CARRIED THE DEFECT AND RATIFIED IT. Frame E1 drew REMOVE + SAVE
//    and its caption claimed the scrim behind stayed reachable — a sentence true
//    of the short sheets and written over the tall one. Mock-first proves what a
//    surface LOOKS like; an exit is something you go looking for. c-2c.s5.
//
//    ⚠ IT ASSERTS THE EXIT IS ON `Sheet`, NOT ON A CALLER. Arm (b), founder-
//    ruled: one head control, inherited by all five, so the next tall sheet
//    cannot rediscover this. And it asserts the dismiss is NOT in the foot row
//    beside `Remove` — an escape hatch a thumb's width from a destructive verb
//    is how a crew member gets deleted at 1am.
//
//    THE NAME IS ASSERTED TOO. The glyph is aria-hidden and the control's name
//    is the vetoed byte, because a control announced as 「multiplication sign」
//    is a control a screen reader cannot describe.
//    RED MUTATION: delete the wl-shx button from Sheet, or move it inside the
//    foot's wl-brow → red.
cell('C89 every studio sheet carries a head dismiss, and it is not beside Remove (F-2c.w1)', () => {
  const src = strip(read('components/worklist/StudioSheets.tsx'));
  const bad = [];
  // The exit lives on the shared shape. `Sheet` is declared once; the dismiss
  // must be inside IT, so counting call sites would not prove inheritance.
  // THE SLICE RUNS TO THE NEXT DECLARATION, NOT TO THE NEXT `\n}`. This is the
  // SECOND time in one sitting a lazy `[\s\S]*?\n}` ended at a props object's
  // closing brace instead of the function's — C86's signature read did the same
  // and was caught the same way. A cell that reads only a signature's opening
  // lines can go green on the very body it exists to inspect, and the reflex to
  // 「loosen the assertion」 when it reddens is exactly how that lands.
  const at   = src.indexOf('function Sheet({');
  const next = src.indexOf('\nfunction ', at + 10);
  const shape = at < 0 ? '' : src.slice(at, next < 0 ? undefined : next);
  if (!/className="wl-shx"/.test(shape))
    bad.push('Sheet has no head dismiss — a sheet whose only exits are its own verbs is F-2c.w1 returning');
  if (!/aria-label=\{COPY\.studioCancel\}[^>]*onClick=\{onClose\}|onClick=\{onClose\}[^>]*aria-label=\{COPY\.studioCancel\}/.test(shape))
    bad.push('the head dismiss is unnamed or does not close — the glyph is aria-hidden, so the label is the only name it has');
  if (!/\.wl-shx\{[^}]*width:44px[^}]*height:44px/.test(src))
    bad.push('the dismiss is under the 44px tap floor');
  // And it is NOT in the foot beside the destructive verb.
  const feet = src.match(/<div className="wl-brow">[\s\S]*?<\/div>/g) || [];
  for (const f of feet) if (/wl-shx/.test(f)) bad.push('the dismiss sits in a foot row beside Remove — arm (a), which was refused');
  // All five sheets go through the shape. A caller drawing its own panel would
  // escape the inheritance this cell exists to prove.
  const panels = (src.match(/className="wl-sheet"/g) || []).length;
  if (panels !== 1) bad.push('there are ' + panels + ' sheet panels — the shape is no longer shared, so the exit is not inherited');
  return bad.length ? bad.join(' | ') : null;
});

cell('C95 the (legacy) pages follow the shell\'s mode  one reader, no writer of the lane key (F-P72.A)', () => {
  // F-P72.A (P7.2 walk, 2026-09-04): Storefront -> profile rendered Graphite under Chalk.
  // The (legacy) group is reached only from the shell, so it must READ the shell's mode
  // (readModeClient, cookie-backed) and set the one signal ThemeProvider already observes,
  // html.theme-light. It must NOT write the old lane's key (modeBridge owns that assertion).
  const lay = strip(read('app/vendor/(legacy)/layout.tsx'));
  const bad = [];
  if (!/readModeClient\(\)/.test(lay)) bad.push('(legacy) layout does not read the shell\'s mode');
  if (!/classList\.toggle\('theme-light', readModeClient\(\) === 'light'\)/.test(lay)) bad.push('(legacy) layout does not set html.theme-light from the shell\'s mode');
  if (!/<ThemeProvider>/.test(lay)) bad.push('(legacy) layout does not mount the provider the eight pages read');
  if (/localStorage\.setItem/.test(lay)) bad.push('(legacy) layout writes storage: the lane key has no writer by ruling');
  // The walk's second reading: Header mounts after the page's data and its useTheme() re-read
  // the lane key, undoing the layout's class. Both late readers now let the shell's cookie
  // outrank the key. A writer of the cookie or the key in either file is a stray.
  for (const [file, label] of [['hooks/vendor/useTheme.ts', 'useTheme'], ['lib/vendor/ThemeContext.tsx', 'ThemeProvider']]) {
    const src = strip(read(file));
    if (!/readShellModeCookie\(\) \?\? /.test(src)) bad.push(label + ' does not let the shell\'s cookie outrank the lane key on mount');
    if (/document\.cookie\s*=/.test(src)) bad.push(label + ' writes the shell\'s cookie: writeMode is the one writer');
  }
  const mode = strip(read('lib/worklist/mode.ts'));
  if (!/export function readShellModeCookie\(\): WlMode \| null/.test(mode)) bad.push('mode.ts has no cookie-only reader that can say absent');
  return bad.length ? bad.join(' | ') : null;
});

// ── C91 · THE ROLE PICKER CANNOT DELETE A ROLE  [F-2c.w4] ──────────────────
//    THE DEFECT, WITNESSED ON A REAL ROW ON THE FOUNDER'S WALK, and the loss was
//    actual rather than predicted: Rahul's role read `Decor`; the sheet's picker
//    did not offer `Decor`, so the `<select>` fell through to the empty option
//    and showed 「No role」; Save was pressed and `Decor` became `second_shooter`.
//    A picker that silently drops a value it does not recognise deletes data on
//    the next Save, quietly, under a success toast.
//
//    `public.team_members.role` is `text` with NO CHECK and the door passes it
//    through untouched, so nothing below the surface ever agreed on a
//    vocabulary — and two grew. THE RULE IS NOW ONE SENTENCE: what is stored is
//    what is shown. The option's value IS its label.
//
//    THREE THINGS, and the third is the one that would have saved Rahul:
//      (1) NO MACHINE TOKEN IS OFFERED. An option whose value carries an
//          underscore is the retired vocabulary coming back.
//      (2) NEITHER READER SPELLS THE VOCABULARY. The row and the sheet both go
//          through `lib/vendor/roleWords.ts`; a local list is how the estate got
//          two in the first place.
//      (3) THE MEMBER'S OWN VALUE IS CARRIED. `roleOptionsFor` appends an
//          unrecognised value as its own option. Without this the other two are
//          cosmetic — the row would read correctly and the sheet would still eat
//          the role on Save.
//    RED MUTATION: point the sheet at `ROLE_OPTIONS` instead of
//    `roleOptionsFor(draft.role)` → red on (3).
cell('C91 the role picker shows words, not tokens, and cannot drop a value it does not know (F-2c.w4)', () => {
  const home  = strip(read('lib/vendor/roleWords.ts'));
  const sheet = strip(read('components/worklist/StudioSheets.tsx'));
  const tabs  = strip(read('components/worklist/TeamTabs.tsx'));
  const bad = [];
  // (1) every OFFERED value is a word. The legacy map is read-only and is
  //     asserted separately, so its tokens do not trip this.
  const offered = (home.match(/export const ROLE_OPTIONS[\s\S]*?\] as const;/) || [''])[0];
  for (const m of offered.matchAll(/\{ v: '([^']*)'/g))
    if (/_/.test(m[1])) bad.push('ROLE_OPTIONS offers the machine token ' + m[1] + ' — the retired vocabulary is back');
  for (const m of offered.matchAll(/\{ v: '([^']*)',\s*l: '([^']*)' \}/g))
    if (m[1] && m[1] !== m[2]) bad.push('the option ' + m[1] + ' stores something other than what it shows');
  // (2) one home, both readers.
  for (const [f, src, sym] of [['StudioSheets', sheet, 'roleOptionsFor'], ['TeamTabs', tabs, 'roleLabel']]) {
    if (!new RegExp(sym + "[\\s\\S]*?from '@/lib/vendor/roleWords'").test(src))
      bad.push(f + ' does not read ' + sym + ' from the role home');
    if (/second_shooter|makeup_artist/.test(src))
      bad.push(f + ' spells a machine token — the vocabulary belongs to roleWords.ts alone');
  }
  // (3) THE ONE THAT MATTERS. An unrecognised value must be carried.
  if (!/roleOptionsFor\(draft\.role\)/.test(sheet))
    bad.push("the picker is not built per member — a role it does not offer would be dropped on Save, which is exactly how `Decor` was lost");
  if (!/return \[\.\.\.ROLE_OPTIONS, \{ v: current, l: current \}\];/.test(home))
    bad.push('roleOptionsFor no longer appends the member\'s own value');
  if (!/LEGACY_TOKENS\[raw\] \?\? raw/.test(home))
    bad.push('roleLabel no longer passes an unknown value through — free text would be blanked on the row');
  return bad.length ? bad.join(' | ') : null;
});

// ── C92 · A TIMESTAMP'S DAY IS THE VENDOR'S DAY  [F-2c.w5] ─────────────────
//    WITNESSED ON THE WALK at 03:25 IST: a task completed seconds earlier landed
//    under the heading `Done today` reading 「Completed 1 Sep 2026」. Section and
//    label disagreed by a day, on one row, at one instant — and both were right
//    about different clocks. `formatLongDate` REGEX-SLICES the leading
//    `YYYY-MM-DD`, which for a `timestamptz` is the UTC date; `isToday` builds a
//    `Date` and compares `getDate()`, which is local.
//
//    ⚠ IT ASSERTS THE SPLIT, NOT A BLANKET CONVERSION. `due_date` is a plain
//    `date` column carrying no zone, and localising it would drag a wedding
//    across midnight for anyone west of UTC. So the cell asserts that the
//    TIMESTAMP is converted and the DATE is not — a cure that localised both
//    would be a second defect wearing the first one's cure.
//    RED MUTATION: drop localDateIso from the completed row, or wrap due_date
//    in it → red, one arm each.
cell('C92 the done row takes its day in the vendor\'s zone, and the due row does not (F-2c.w5)', () => {
  const src = strip(read('components/worklist/TeamTabs.tsx'));
  const fmt = strip(read('lib/vendor/format.ts'));
  const bad = [];
  if (!/export function localDateIso/.test(fmt))
    bad.push('lib/vendor/format.ts has no localDateIso — the timestamp/date split has no home');
  if (!/formatLongDate\(localDateIso\(t\.completed_at\)\)/.test(src))
    bad.push('completed_at is formatted from its raw UTC slice — the Done today row would read yesterday west of the date line');
  if (/localDateIso\(t\.due_date\)/.test(src))
    bad.push('due_date is being localised — it is a plain date column and this would move a wedding across midnight');
  if (!/formatLongDate\(t\.due_date\)/.test(src))
    bad.push('the due row no longer formats due_date directly');
  return bad.length ? bad.join(' | ') : null;
});

// ── C93 · THE SETTLE SHEET NAMES WHO IS PAID, NOT THE FORM  [F-2c.w6] ──────
//    The summary read `payment.description || COPY.studioSheetLogPayment`, so a
//    payment logged without a description confirmed itself as 「Log payment ·
//    Rs 5,000」 — the sheet's own TITLE standing in for the thing being settled.
//    Witnessed on the walk. A fallback that names the FORM instead of the
//    SUBJECT tells the vendor nothing about what his money is about to do, and
//    it does it on the one screen where he is committing it.
//    RED MUTATION: restore the title as the fallback → red.
cell('C93 the mark-paid summary names the person, never the sheet (F-2c.w6)', () => {
  const sheet = strip(read('components/worklist/StudioSheets.tsx'));
  const tabs  = strip(read('components/worklist/TeamTabs.tsx'));
  const bad = [];
  if (/payment\.description \|\| COPY\.studioSheetLogPayment/.test(sheet))
    bad.push("the summary falls back to the sheet's own title — a form naming itself where a person belongs");
  if (!/\[who, payment\.description\]\.filter\(Boolean\)/.test(sheet))
    bad.push('the summary no longer leads with who is being paid');
  if (!/onSettle\(raw, p\.member_name \?\? COPY\.teamUnassigned\)/.test(tabs))
    bad.push('the row does not pass the member name to the sheet — the sheet cannot fetch one and must be told');
  return bad.length ? bad.join(' | ') : null;
});

// ── C94 · THE PDF LINK IS NORMALISED AT THE DOOR  [F-2c.w7] ────────────────
//    THE DEFECT, AND IT MADE A WORKING FEATURE LOOK BROKEN FOR THE WHOLE ARC:
//    `src/api/vendor/money.js` · the pdf arm's `okRes` generates the PDF, uploads it, signs it and
//    stamps `pdf_url` on the invoice — then answers `{ url, invoice_number }`.
//    The client read `res.pdf_url`, got `undefined`, skipped the ok-true branch,
//    found no `error` either, and reported a failure on every tap. The founder's
//    Network tab settled it: 200, 0.5 kB — a JSON envelope, not a failure and
//    not a PDF.
//
//    ⚠ AMENDED IN THE SITTING ITS OWN PREVIOUS TEXT NAMED  [smalls S1].
//    WHAT IT SAID: 「`pdf_url` is a FALLBACK with a stated condition — it retires
//    in the same commit that ships the dream-os rename, never before... So this
//    cell asserts BOTH names are read; when the server is renamed, this cell is
//    amended in that sitting.」 The rename shipped in this pair. This is that
//    amendment, and it INVERTS every arm rather than deleting them: the cell used
//    to guard that the coalesce was PRESENT, and now guards that it is GONE.
//
//    THAT INVERSION IS THE POINT AND NOT A WEAKENING. A retired fallback that
//    nothing asserts the absence of comes back — a later reader sees `pdf_url`
//    arriving and adds a `?? url` for safety, and the two spellings are alive
//    again with no cell to notice. The negative arm is the only thing that makes
//    a retirement stick.
//
//    ⚠ AND IT STILL ASSERTS THE OK-WITH-NO-LINK ARM, which is F-2c.w7's mechanism
//    rather than its symptom: a surface that cannot tell a missing FIELD from a
//    failed GENERATION will always report the wrong one. That arm was never about
//    the field's name and does not move.
//    RED MUTATION: restore `.url ?? (r as InvoicePdfResponse).pdf_url` and the
//    optional `pdf_url?:` on the type → red, one arm each.
cell('C94 the PDF door reads ONE name and the fallback is retired (F-2c.w7)', () => {
  const door = strip(read('lib/vendor/api/vendor.ts'));
  const ty   = strip(read('lib/vendor/types/vendor.ts'));
  const bad = [];
  const at   = door.indexOf('export function fetchInvoicePdf');
  const next = door.indexOf('export function', at + 10);
  const sig  = at < 0 ? '' : door.slice(at, next < 0 ? undefined : next);
  if (!/const link = \(r as InvoicePdfResponse\)\.pdf_url;/.test(sig))
    bad.push('the door does not read `pdf_url` off the wire as its one name');
  if (/\?\?\s*\(r as InvoicePdfResponse\)\.url/.test(sig) || /\.url \?\?/.test(sig))
    bad.push('the retired `url` fallback is back at the door — two spellings for one link');
  if (!/if \(!link\) return \{ ok: false \}/.test(sig))
    bad.push('an ok-true with no link passes through as success — the caller would open an undefined href');
  if (!/pdf_url:\s+string;/.test(ty))
    bad.push('InvoicePdfResponse does not declare `pdf_url` as the required wire name');
  if (/\burl:\s+string;/.test(ty))
    bad.push("the retired `url` is back on InvoicePdfResponse — the type would license a second reader");
  if (/pdf_url\?:/.test(ty))
    bad.push('`pdf_url` is optional again — the door\'s own field may not be optional on the type that describes it');
  // THE CITED PATH. c-2c.s7: three durable comments named a route the caller
  // never calls. A wrong path in a comment outlives the seat that wrote it.
  //
  // ── F-39.50 · AND THIS CELL WAS GUARDING THE WRONG HALF OF THE CITE ───────
  // It asserted the literal `src/api/vendor/money.js:584` — the LINE NUMBER. So it
  // guarded a fact that dream-os could invalidate without touching this repo, and
  // S2 duly did: adding a schedule argument to that door moved every line below it,
  // and 584 now lands on the `router.get` header, one line of coincidence away from
  // still looking right. A cell keyed to a line number cannot tell a correct cite
  // from a stale one; it only knows whether the digits match.
  // F-38.27's family, and the cure is the same: assert the PATH and the SYMBOL,
  // which survive any edit above them. THE THIRD SITE JOINS THE LOOP —
  // `lib/vendor/types/vendor.ts` carried the same cite and no cell watched it.
  for (const f of ['lib/worklist/copy.ts', 'components/vendor/slices/SliceShell.tsx',
                   'lib/vendor/types/vendor.ts']) {
    const t = read(f);
    if (!t.includes('src/api/vendor/money.js'))
      bad.push(f + ' does not name the real PDF door — c-2c.s7');
    else if (!/money\.js`?\s*(·|\u00b7)[^\n]*okRes/.test(t))
      bad.push(f + ' cites the PDF door without naming its symbol — F-39.50');
    if (/money\.js:\d+/.test(t))
      bad.push(f + ' is back to a line-number cite — F-39.50');
  }
  return bad.length ? bad.join(' | ') : null;
});

// ── C90 · A HALF-LOADED PAYMENTS TAB IS A FAILED ONE  [F-2c.w2] ─────────────
//    The tab makes TWO reads: `/by-wedding` for the eye (it alone carries the
//    event date and the member's name) and the flat GET for the verbs (the raw
//    row is what `markPaymentPaid` and `cancelPayment` take). The first cut
//    settled READY whenever by-wedding succeeded, even with the raw read failed
//    — so the list would render and every row would silently lose `Mark paid`
//    and `Cancel payment`, with no word anywhere saying why. A vendor looking at
//    money he cannot act on, on a surface with no complaint on it.
//    RED MUTATION: settle('payments', true) unconditionally → red.
cell('C90 the payments tab fails when either of its two reads fails (F-2c.w2)', () => {
  const src = strip(read('components/worklist/TeamTabs.tsx'));
  const bad = [];
  if (!/if \(!\('payments' in raw\) \|\| !raw\.ok\) \{ settle\('payments', false\); return; \}/.test(src))
    bad.push('the raw-row read can fail without failing the tab — the rows would render with no verbs and no explanation');
  if (!/rawOf\(p\.id\)/.test(src))
    bad.push('the row no longer resolves its raw row — the verbs would fire at an id the surface cannot vouch for');
  return bad.length ? bad.join(' | ') : null;
});

// ── C86 · MARK-PAID'S TWO ARMS REACH THE GLASS  [ruling 3, F-39.26's class] ──
//    The route has answered with `expense_logged` since the hygiene sitting and
//    said so in its own words — 「FAILURE IS DECLARED, NOT SWALLOWED... The
//    caller is told」. The typed door then declared `{ ok, payment }`, and
//    TypeScript does not merely omit an undeclared field: it makes READING one
//    an error. So the truth reached the wire and died at the type, and the
//    surface said 「Marked as paid」 whether Books gained the row or not.
//
//    ⚠ THREE STATES, AND THE CELL ASSERTS THE THIRD. `undefined` is not `false`.
//    This pwa deploys separately from dream-os and can meet a backend older than
//    the hygiene sitting; a MISSING field is not a FAILED expense. A cell that
//    only checked for two arms would pass a room that reddened every settlement
//    against an older server.
//    RED MUTATION: change `logged === false` to `!logged` in confirmPaid → red.
cell('C86 mark-paid reports the expense leg, and undefined is not false', () => {
  const door = strip(read('lib/vendor/api/vendor.ts'));
  const src  = strip(read('components/worklist/TeamTabs.tsx'));
  const copy = strip(read('lib/worklist/copy.ts'));
  const bad = [];
  // THE SLICE RUNS TO THE NEXT DECLARATION, NOT TO THE NEXT `\n}`. The body's
  // own object literal closes on a `\n}` two lines in, so a lazy match ends
  // BEFORE the return type — and a cell that reads a signature without its
  // return type would have gone green on the very erasure it exists to catch.
  const at  = door.indexOf('export function markPaymentPaid');
  const nxt = door.indexOf('export function', at + 10);
  const sig = at < 0 ? '' : door.slice(at, nxt < 0 ? undefined : nxt);
  if (!/expense_logged\?:\s*boolean/.test(sig)) bad.push('the typed door still erases expense_logged');
  if (!/expense_error\?:/.test(sig)) bad.push('the typed door drops expense_error — the WHY the route sends with the false');
  if (!/logged === false/.test(src))
    bad.push('the surface does not distinguish false from undefined — an older backend would read as a failed expense on every settlement');
  for (const [k, v] of [['studioToastPaidLogged', 'Marked as paid.'],
                        ['studioToastPaidNoExpense', "Marked as paid — the expense wasn't logged."]]) {
    if (!copy.includes(v)) bad.push('copy.ts no longer carries the ruled byte 「' + v + '」');
    if (!new RegExp('COPY\\.' + k).test(src)) bad.push('the surface does not read COPY.' + k);
  }
  return bad.length ? bad.join(' | ') : null;
});

// ── C87 · MONEY'S PRIMARY VERB IS NOT GESTURE-ONLY  [F-2c.p9, founder's walk] ─
//    An invoice could only be settled by SWIPING it. A gesture has no affordance:
//    nothing on the row says it is there, and no screen reader reaches it. The
//    BUTTON IS ADDED AND THE SWIPE STAYS, and the cell's real subject is that
//    both call ONE handler — `markPaidFor` returns `swipeSidesFor(row).right`, so
//    a later edit cannot give the button its own write path that drifts from the
//    gesture's.
//
//    ⚠ THE GATE IS ASSERTED TOO. Card ⑥ as ruled: the button renders only where
//    `payAmount > 0`. `Already settled.` survives as the SWIPE's answer, because
//    a gesture landing on a settled row must say something while a button that
//    would say it need not exist.
//    RED MUTATION: drop the `payAmount` gate, or point the button at
//    `recordPayment` directly → red.
cell('C87 the invoice row carries a visible Mark paid, on one handler with the swipe (F-2c.p9)', () => {
  const src = strip(read('components/vendor/slices/SliceShell.tsx'));
  const bad = [];
  if (!/const markPaidFor = \(row: Row\) => swipeSidesFor\(row\)\.right/.test(src))
    bad.push('the button no longer shares the swipe handler — two write paths to one settlement');
  if (!/slice === 'invoices' && !selectMode && \(row\.payAmount \?\? 0\) > 0/.test(src))
    bad.push('the button is not gated to outstanding rows (card ⑥) or leaks into select mode beside the bulk bar');
  if (!/showToast\('Already settled\.'/.test(src))
    bad.push("the swipe lost 「Already settled.」 — the gesture still lands on settled rows and must answer");
  if (!/COPY\.studioMarkPaid/.test(src))
    bad.push('the row spells its own Mark paid byte instead of reading the register');
  return bad.length ? bad.join(' | ') : null;
});

// ── C88 · THE TWO PDF SENTENCES HAVE ONE HOME, AND ONE OF THEM STOPPED LYING ─
//    F-2c.p10 as re-derived: `GET /:invoiceId/pdf` is SYNCHRONOUS — it generates
//
// ⚠ c-2c.s7 — THE ROUTE CITED HERE WAS WRONG, AND THE LESSON OUTLIVES IT.
// This paragraph named `src/api/vendor/invoices.js:398`. THE CALLER NEVER
// CALLS IT. `fetchInvoicePdf` composes `${moneyBase(v)}/invoices/${v}/${id}/pdf`
// — the MONEY plane — so the door is `src/api/vendor/money.js` · the pdf arm's
// `okRes`. (F-39.50: this bench carried a verbatim copy of copy.ts's paragraph and
// so carried its line number too. A cell that forbids a spelling while printing it
// is arguing with itself.) The
// conclusions above happened to hold of the real door too, which is luck and
// not method: the actual defect (F-2c.w7, the door answering `url` where the
// client read `pdf_url`) sat one field-name away and stayed invisible because
// the reading was against the wrong file.
// THE LAW: trace the URL the caller composes, never the route that looks right.
//    and returns a URL or it errors. `pdf_pending` exists only on `POST /` and no
//    reader in this repo consumes it. So 「PDF not ready yet — try again in a
//    moment」 was the `??` fallback for an ok-false with no error, describing
//    WAITING when what happened was FAILING, and inventing a state the door
//    cannot report. The founder's walk hit this door and the retry succeeded.
//
//    ⚠ THE SECOND SENTENCE MOVED AND DID NOT CHANGE, and the cell asserts BOTH
//    halves of that. 「PDF not ready yet — record the advance first」 names a real
//    precondition; a precondition is not the same defect as an invented state,
//    and a later seat reading this diff must not take the pair as one scrub.
//    RED MUTATION: spell either sentence inline at its call site again → red.
cell('C88 the PDF sentences live in the register, and neither is spelled at a call site', () => {
  const src  = strip(read('components/vendor/slices/SliceShell.tsx'));
  const copy = strip(read('lib/worklist/copy.ts'));
  const bad = [];
  if (!copy.includes("Couldn't prepare the PDF just now. Try again in a moment."))
    bad.push('the register lost the ruled fallback byte');
  if (!copy.includes('PDF not ready yet — record the advance first.'))
    bad.push('the register lost the unchanged precondition byte');
  if (/'PDF not ready yet — try again in a moment\.'/.test(src))
    bad.push('the retired sentence is spelled inline again — it invents a state the door cannot report');
  if (src.includes("'PDF not ready yet"))
    bad.push('a PDF sentence is spelled at its call site — one home, four readers');
  for (const k of ['studioPdfFailed', 'studioPdfNoAdvance'])
    if (!new RegExp('COPY\\.' + k).test(src)) bad.push('SliceShell does not read COPY.' + k);
  return bad.length ? bad.join(' | ') : null;
});

// ── C81 · base_guard.sh IS BYTE-IDENTICAL ACROSS THE PAIR  [R-38.20] ────────
//    The file's own paragraph says the two copies are byte-identical because a
//    guard that differs between the repos it guards has two behaviours and one
//    name. At bd60ac2/4918275 that paragraph was FALSE, and it was false BY
//    ITSELF: the dream-os copy carried the claim and the pwa copy did not, so
//    the sentence asserting the equality was the only thing breaking it.
//
//    ⚠ IT NEEDS THE SIBLING, AND IT REFUSES RATHER THAN FAILS WITHOUT IT.
//    R-38.20b: a missing sibling has faked findings in both directions in this
//    estate. A cell that reds on an absent tree teaches the reader that reds are
//    negotiable; a cell that says REFUSED names the precondition instead. The
//    floor is run sibling-full, so a REFUSED here is a floor that was not run
//    the way the law says to run it.
cell('C81 tools/base_guard.sh is byte-identical in both repos (R-38.20)', () => {
  const here = path.join(ROOT, 'tools/base_guard.sh');
  const there = path.join(ROOT, '../dream-os/tools/base_guard.sh');
  if (!fs.existsSync(there))
    return 'REFUSED — the dream-os sibling is absent, so equality cannot be read. '
         + 'Clone it beside this repo and re-run (R-38.20b); this is not a FAIL.';
  const a = fs.readFileSync(here);
  const b = fs.readFileSync(there);
  if (a.equals(b)) return null;
  return 'base_guard.sh differs across the pair — ' + a.length + ' bytes here, ' + b.length
       + ' there. A guard with two behaviours and one name is the thing this file forbids in its own header.';
});



// ── C84 · THE EXPENSE CATEGORY MIRROR, HELD TO THE dream-os HOME ────────────────
//    CE-39 writer-hygiene, ruling 1. THE DEFECT IT EXISTS FOR (F-2c.p1): four lists
//    for one vocabulary across two repos, and no cell anywhere had ever compared them.
//    `common.ts` called itself the single source of truth while offering `supplies` —
//    a token neither the server nor the database has ever accepted — in the vendor's
//    own picker, and while refusing `commission`, which the database always took.
//
//    ⚠ REFUSED, NEVER PASSED, WHEN THE SIBLING IS ABSENT. This is the base_guard
//    equality cell's shape and the reason for it: a cross-repo cell that silently
//    skips when it cannot see the other tree is a cell that goes green in exactly
//    the situation it was written to catch. Absence is reported as a RED with a
//    REFUSED reason — the run is told it could not check, not told it passed.
//
//    THE COMPARISON IS THREE-WAY and each leg is a different failure:
//      home == mirror   — the two repos agree
//      mirror == picker — the type and the runtime array agree (a TS union does not
//                         survive to runtime, so both exist and both can drift)
//      home == CHECK    — asserted in dream-os `b48` §1.2, NOT duplicated here. This
//                         cell trusts the sibling's own floor for that leg and says so.
//    RED MUTATION: add a token to either list, or re-order one of them.
cell('C84 the expense category mirror equals the dream-os home, in order', () => {
  const sibling = path.resolve(ROOT, '..', 'dream-os', 'src/lib/vendor/expenses.js');
  if (!fs.existsSync(sibling)) {
    return 'REFUSED — the dream-os sibling is not beside this tree at ../dream-os, so the '
         + 'mirror cannot be compared to its home. Clone both and re-run; this cell does '
         + 'not pass on absence.';
  }
  const homeSrc = fs.readFileSync(sibling, 'utf8');
  const m = homeSrc.match(/const ALLOWED_CATEGORIES = \[([\s\S]*?)\];/);
  if (!m) return 'REFUSED — ALLOWED_CATEGORIES could not be read out of the dream-os home';
  const home = (m[1].match(/'([a-z_]+)'/g) || []).map((t) => t.replace(/'/g, ''));
  if (home.length < 2) return 'REFUSED — the home parsed to ' + home.length + ' token(s)';

  const common = strip(read('lib/vendor/types/common.ts'));
  const arr = common.match(/EXPENSE_CATEGORIES: readonly ExpenseCategory\[\] = \[([\s\S]*?)\]/);
  if (!arr) return 'the runtime mirror EXPENSE_CATEGORIES is gone from common.ts';
  const mirror = (arr[1].match(/'([a-z_]+)'/g) || []).map((t) => t.replace(/'/g, ''));

  const uni = common.match(/export type ExpenseCategory =([\s\S]*?);/);
  if (!uni) return 'the ExpenseCategory union is gone from common.ts';
  const union = (uni[1].match(/'([a-z_]+)'/g) || []).map((t) => t.replace(/'/g, ''));

  const bad = [];
  if (mirror.join('|') !== home.join('|')) {
    bad.push('mirror != home\n        home:   ' + home.join(', ') + '\n        mirror: ' + mirror.join(', '));
  }
  if (union.join('|') !== mirror.join('|')) {
    bad.push('the union and the runtime array disagree\n        union:  ' + union.join(', ')
           + '\n        array:  ' + mirror.join(', '));
  }
  //    ⚠ THIS LEG'S FIRST CUT ASSERTED `/EXPENSE_CATEGORIES/.test(sheet)` AND WENT
  //    GREEN WHEN THE PICKER STOPPED USING IT — the surviving `import` line alone
  //    satisfied the match. Caught by mutation, not by reading (F-39.25: the
  //    instrument's report is evidence about the instrument first). The question is
  //    whether the options are DERIVED from the mirror, so the match is anchored on
  //    the derivation itself, which is the only shape that can carry the tokens.
  const sheet = strip(read('components/vendor/AddSheet.tsx'));
  if (!/CATEGORY_OPTIONS[^\n]*=\s*EXPENSE_CATEGORIES\.map\(/.test(sheet)) {
    bad.push('the picker options are not derived from the mirror');
  }
  if (!/options:\s*CATEGORY_OPTIONS/.test(sheet)) bad.push('the category field does not use the derived options');
  if (/'supplies'/.test(sheet)) bad.push('the picker still offers `supplies`, which nothing accepts');
  //    A SECOND FALSE LEG, ALSO CAUGHT BY MUTATION AND RECORDED RATHER THAN QUIETLY
  //    DROPPED. It read `label: '` inside a window after CATEGORY_OPTIONS to catch a
  //    hand-written label — and matched `label: 'Category'`, the FIELD's own display
  //    name, on the clean tree. A cell that reds on cured code and on the defect
  //    alike distinguishes nothing. Replaced with the positive assertion: the label
  //    must be COMPUTED from the token.
  if (!/label:\s*value\.charAt\(0\)\.toUpperCase\(\) \+ value\.slice\(1\)/.test(sheet)) {
    bad.push('category labels are not title-cased from the tokens — a hand-written label is a fifth home');
  }
  return bad.length ? bad.join(' | ') : null;
});

// ── THE VERDICT · THREE STATES, AND THE EXIT CODE CARRIES ALL THREE  [F-39.47] ─
// 0 = GREEN · 1 = RED (any fail, refusals or not) · 3 = REFUSED (no fails, at
// least one precondition unmet). The runner reads the CODE, never this text —
// two report formats live in this estate and only the code is shared.
//
// THE NAMES RIDE THE LINE deliberately. `run-floor.sh --check` compares SETS, so
// a refusal that ought to have been a run must be visible by name in the
// output; a bare count would let a cell quietly start refusing forever and read
// as steady state.
if (fails > 0) {
  console.log('\nFLOOR RED — ' + fails + ' cell(s)'
    + (refusals ? ' · ' + refusals + ' also REFUSED: ' + refusedNames.join(', ') : ''));
  process.exit(1);
}
if (refusals > 0) {
  console.log('\nFLOOR REFUSED — ' + refusals + ' cell(s) could not be read: '
    + refusedNames.join(', ') + '\nThis is NOT a pass and NOT a fail. A precondition '
    + 'is absent — the floor is run sibling-full by law.');
  process.exit(3);
}
console.log('\nFLOOR GREEN');
process.exit(0);
