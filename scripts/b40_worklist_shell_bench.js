#!/usr/bin/env node
// scripts/b40_worklist_shell_bench.js — the Phase 1 cells.
// Exit code is the verdict; PASS-line counts are not.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
/** Comment-blindness law: strip comments before any textual assertion against source. */
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

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

let fails = 0;
function cell(name, fn) {
  try { const why = fn(); if (why) { console.log('RED   ' + name + ' — ' + why); fails++; }
        else console.log('GREEN ' + name); }
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
cell('C2 eighteen rooms in frozen order, 7 + 11 (seats flipped, R-37.75; R-37.87; R-38.9)', () => {
  const src = strip(read('lib/worklist/rooms.ts'));
  const num = (name) => { const m = src.match(new RegExp(name + '\\s*=\\s*(\\d+)')); return m ? Number(m[1]) : null; };
  const EXP_ALL = num('ROOM_COUNT_EXPECTED'), EXP_TOP = num('TOP_BAND_EXPECTED'), EXP_BOT = num('BOTTOM_BAND_EXPECTED');
  if (EXP_ALL !== 18 || EXP_TOP !== 7 || EXP_BOT !== 11)
    return 'the registry\'s own constants drifted from the ruling: ' + EXP_ALL + '/' + EXP_TOP + '/' + EXP_BOT + ', expected 18/7/11';
  const ids = (src.match(/\{\s*id:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  if (ids.length !== EXP_ALL) return 'registry has ' + ids.length + ' rooms, expected ' + EXP_ALL;
  const fb = src.match(/FROZEN_ORDER[^=]*=\s*\[([\s\S]*?)\]/);
  if (!fb) return 'FROZEN_ORDER not found';
  const frozen = (fb[1].match(/'([a-z]+)'/g) || []).map((s) => s.slice(1, -1));
  if (frozen.join(',') !== ids.join(',')) return 'order drift: registry [' + ids.join(',') + '] vs frozen [' + frozen.join(',') + ']';
  const work = (src.match(/band:\s*'work'/g) || []).length;
  const biz  = (src.match(/band:\s*'business'/g) || []).length;
  if (work !== EXP_TOP) return 'top band has ' + work + ', expected ' + EXP_TOP;
  if (biz !== EXP_BOT) return 'bottom band has ' + biz + ', expected ' + EXP_BOT;
  return null;
});

cell('C3 no inline wa number in the shell', () => {
  const files = ['components/worklist/FirstRun.tsx','components/worklist/AiDock.tsx',
    'components/worklist/WorklistShell.tsx','components/worklist/RoomsGrid.tsx',
    'app/w/page.tsx','app/w/rooms/page.tsx','app/w/support/page.tsx',
    'app/w/layout.tsx','lib/worklist/copy.ts'];
  const bad = files.filter((f) => /\b9\d{11}\b/.test(strip(read(f))));
  if (bad.length) return 'number literal in ' + bad.join(', ') + ' — must resolve through lib/waNumbers.ts';
  if (!strip(read('app/w/support/page.tsx')).includes('supportWaNumber()')) return 'support page does not call supportWaNumber()';
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
                 'components/worklist/AiDock.tsx','components/worklist/FirstRun.tsx','app/w/support/page.tsx'];
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
  for (const f of ['components/worklist/FirstRun.tsx', 'app/w/rooms/page.tsx']) {
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
    'app/w/support/page.tsx':                ['wl-supportaction'],
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
  const lay = read('app/vendor/layout.tsx');
  if (/#F5F2EE|#1A0F08|122,56,40/.test(lay)) return 'LIGHT_VARS still pins Editorial Paper inline — inline beats every stylesheet';
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
  // AMENDED, LABELLED — relay #3 item 2. `todayNothingYet` is WITHHELD, not exported: a
  // retired byte that ships is the retirement failing in the one way that matters, and the
  // audit caught it in the served bytes. The assertion INVERTS rather than vanishing.
  if (!/todayNotLive:/.test(copy)) return 'Today has no not-reading status byte in copy.ts';
  if (/^\s*todayNothingYet:/m.test(copy))
    return 'the true-empty byte is a live export again — it must stay withheld until the feed answers';
  if (!/COPY\.todayNotLive/.test(strip(read('app/w/today/page.tsx'))))
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
  if (man.start_url !== '/w/rooms') return 'manifest start_url is ' + man.start_url + ', expected /w/rooms';

  const idx = strip(read('app/w/page.tsx'));
  if (!/replace\('\/w\/rooms'\)/.test(idx)) return 'the bare /w shell does not resolve to Rooms';

  const shell = strip(read('components/worklist/WorklistShell.tsx'));
  const seats = [...shell.matchAll(/COPY\.(navRooms|navToday)/g)].map((m) => m[1]);
  if (seats.join(',') !== 'navRooms,navToday') return 'seat order is ' + seats.join(',') + ', expected Rooms then Today';

  const nav = strip(read('components/vendor/BottomNav.tsx'));
  const doors = [...nav.matchAll(/label:\s*'(\w+)'/g)].map((m) => m[1]);
  if (doors.join(',') !== 'Rooms,Today') return 'the carried nav still reads ' + doors.join(',') + ' — one app, one nav';

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
  if (/\/w\/today/.test(grid)) return 'the grid links to Today again — the seat is that door';
  if (!/href="\/w\/today"/.test(shell)) return 'the Today seat is not an anchor in the shell';
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
  const set = strip(read('app/w/settings/page.tsx'));
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
    'app/w/today/page.tsx': [],
    'app/w/support/page.tsx': [],
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
  for (const f of ['components/worklist/RoomsGrid.tsx', 'components/worklist/FirstRun.tsx', 'app/w/today/page.tsx']) {
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
  for (const m of reg.matchAll(/id:\s*'([a-z]+)'[^}]*href:\s*'(\/w\/[a-z]+)'/g)) {
    if (fs.existsSync(path.join(ROOT, 'app/w/' + m[1] + '/page.tsx'))) ids.push(m[1]);
  }
  return ids;
}

/** A room whose BODY came from the /vendor tree — the ones §4-1 and §4-2 move. */
function crossedRooms() {
  return shellRooms().filter((id) =>
    /from '@\/app\/vendor\//.test(strip(read('app/w/' + id + '/page.tsx'))));
}

cell('C24 the six list rooms crossed in the registry, as a set', () => {
  const src = strip(read('lib/worklist/rooms.ts'));
  const FAMILY = ['leads', 'clients', 'invoices', 'expenses', 'events', 'notes'];
  for (const id of FAMILY) {
    const m = src.match(new RegExp("\\{\\s*id:\\s*'" + id + "'[^}]*href:\\s*'([^']+)'"));
    if (!m) return 'room ' + id + ' vanished from the registry';
    if (m[1] !== '/w/' + id) return id + ' still points at ' + m[1] + ' — the tile did not cross';
  }
  // THE SET, NOT A COUNT. A room that crosses without leaving the interim list is a registry
  // saying two different things about the same room.
  const ib = src.match(/INTERIM_VENDOR_ROOMS[^=]*=\s*\[([\s\S]*?)\] as const;/);
  if (!ib) return 'INTERIM_VENDOR_ROOMS not found';
  const interim = (ib[1].match(/'([a-z]+)'/g) || []).map((x) => x.slice(1, -1));
  for (const id of FAMILY) {
    if (interim.includes(id)) return id + ' crossed but is still declared an interim /vendor room';
  }
  const stillVendor = (src.match(/href:\s*'\/vendor\/[^']*'/g) || []).length;
  if (stillVendor !== interim.length)
    return 'the registry carries ' + stillVendor + ' /vendor hrefs but declares ' + interim.length + ' interim rooms';
  return null;
});

cell('C25 each crossed room mounts the shell and no second masthead', () => {
  const bad = [];
  for (const id of crossedRooms()) {
    const f = 'app/w/' + id + '/page.tsx';
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
  const declared = new Map();
  for (const m of parse('INTERIM_VENDOR_MOUNTS').matchAll(/\['([^']+)',\s*(\d+)\]/g)) declared.set(m[1], Number(m[2]));
  const actual = mountCensus('Header');
  const problems = [];
  for (const [f, n] of actual) {
    if (!declared.has(f)) problems.push('UNDECLARED mount in ' + f + ' (' + n + ')');
    else if (declared.get(f) !== n) problems.push(f + ' has ' + n + ' mounts, census says ' + declared.get(f));
  }
  // A REMOVAL REDDENS UNTIL THE CENSUS SHRINKS. That direction is what keeps the list honest
  // as rooms cross: crossing a room without deleting its line here leaves a census nobody
  // re-derived, which is the F-04.67 class.
  for (const f of declared.keys()) if (!actual.has(f)) problems.push(f + ' is declared but mounts nothing — shrink the census');
  const nav = mountCensus('BottomNav');
  const navDeclared = (parse('INTERIM_BOTTOMNAV_MOUNTS').match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1));
  for (const [f] of nav) if (!navDeclared.includes(f)) problems.push('UNDECLARED BottomNav mount in ' + f);
  for (const f of navDeclared) if (!nav.has(f)) problems.push(f + ' declared for BottomNav but mounts none');
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
  walk('app/w'); walk('components/worklist');
  return offenders.length ? offenders.join(' | ') : null;
});

cell('C28 the Slice Door goes where it is mounted, and its inactive chip is legible', () => {
  const src = strip(read('components/vendor/slices/SliceShell.tsx'));
  const door = src.slice(src.indexOf('export function SliceDoor'), src.indexOf('export function SliceShell'));
  if (!door) return 'SliceDoor not found';
  // BEHAVIOUR: the destination is a function of the tree, not a constant. A door that always
  // pushes /vendor is a /vendor href reachable from a shell control, which the standing
  // ruling forbids; a door that always pushes /w breaks the surviving fallback.
  if (!/inShell \? `\/w\/\$\{s\}` : `\/vendor\/list\/\$\{s\}`/.test(door))
    return 'the door does not choose its destination from the tree it is mounted in';
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
  if (!/ToastView = useInShell\(\) \? WlToast : Toast/.test(shell)) bad.push('SliceScreen does not pair its toast to the tree');
  const cl = strip(read('app/vendor/list/[slice]/clients.tsx'));
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
function blankComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\/|\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, (m, p) => p + ' '.repeat(Math.max(0, m.length - p.length)));
}

cell('C31 no undeclared /vendor literal is reachable from any crossed room', () => {
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
  const lm = reg.match(/export const INTERIM_VENDOR_LINKS[^=]*=\s*\[([\s\S]*?)\] as const;/);
  if (lm) for (const x of lm[1].match(/'(\/vendor\/[^']+)'/g) || []) declared.add(x.slice(1, -1));
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
  const fbm = reg.match(/export const FALLBACK_TREE_BASES[^=]*=\s*\[([\s\S]*?)\] as const;/);
  const fallbacks = fbm ? (fbm[1].match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1)) : [];
  const pm = reg.match(/INTERIM_HUB_PRIMERS[^=]*=\s*\[([\s\S]*?)\] as const;/);
  const primers = pm ? (pm[1].match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1)) : [];

  const strays = new Map();
  // EVERY shell room, crossed or native: a /vendor literal reachable from Billing is as
  // wrong as one reachable from Leads, and the S2 bounce found its worst specimen in a tier
  // gate nobody thought of as a door. Verified at this cut: zero strays across all eleven.
  for (const room of shellRooms()) {
    const entry = path.join(ROOT, 'app/w/' + room + '/page.tsx');
    if (!fs.existsSync(entry)) return 'app/w/' + room + '/page.tsx does not exist';
    const hits = [];
    walk(entry, new Set(), hits);
    for (const h of hits) {
      if (declared.has(h.href)) continue;
      // EXACT, not prefix. '/vendor/list/' is the Door's tree-aware fallback and passes;
      // '/vendor/list/leads' is a full carried href and does not, because a whole address
      // in the bytes means a room slid back out of the shell.
      if (fallbacks.includes(h.href)) continue;
      // The declared hub primers (F-38.41). EXACT, not prefix, for the same reason as the
      // fallback base: `/vendor?draft=` passes, `/vendor?draft=x/y` does not.
      if (primers.includes(h.href)) continue;
      // A bare `/vendor` with no query is a TYPE or a predicate, never a destination —
      // `tell_victor: { path: '/vendor' }` in the wire contract, `href.startsWith('/vendor')`
      // in RoomsGrid. Derived by reading all three sites, not assumed from the shape.
      if (h.href === '/vendor') continue;
      const key = h.at + ' ' + h.href;
      if (!strays.has(key)) strays.set(key, h.href + ' <- ' + h.at + ' (reachable from /w/' + room + ')');
    }
  }
  const problems = [...strays.values()];
  // AN EMPTY SET IS THE MISSING DECLARATION, and it is collected as one more problem rather
  // than returned on, for the reason written above: a cell that reddens on its own
  // scaffolding never walks the graph it exists to walk.
  if (!fallbacks.length) problems.push('FALLBACK_TREE_BASES is not declared or is empty — the tree-aware fallback bases have no home in the registry');
  // ── AMENDED, LABELLED — CE-39 S2/6 · THE CELL IS INVERTED BY LABEL ────────
  // It read: an EMPTY set is the missing declaration, and pushed a problem. That was right
  // while four doors were live and undeclared. R-39.3 cured them — the doors are tree-blind
  // through lib/worklist/askContext.tsx and push nothing — so the empty set is now the
  // CURED state and a NON-EMPTY one is the regression: a primer back in this registry is a
  // shell door that pushes out of the shell again. The declaration itself must survive, or
  // this cell has nothing to read; `[] as const` is what it asserts.
  if (!/export const INTERIM_HUB_PRIMERS/.test(reg))
    problems.push('INTERIM_HUB_PRIMERS is not declared at all — the inverted cell has nothing to read (CE-39 S2/6)');
  else if (primers.length)
    problems.push('INTERIM_HUB_PRIMERS is non-empty (' + primers.join(' · ') + ') — R-39.3 emptied it; a primer back in the registry is a shell door pushing out of the shell again (F-38.47)');
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
  const wDir = path.join(ROOT, 'app/w');
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
  const today = strip(read('app/w/today/page.tsx'));
  if (!/from '@\/lib\/worklist\/feed'/.test(today)) return 'Today does not read the feed module';
  const feed = strip(read('lib/worklist/feed.ts'));
  if (!/responded:\s*false/.test(feed)) return 'the feed module does not report that nothing has read anything';
  if (/openItems:\s*0\b/.test(feed)) return 'the feed module coerces an unread count to 0 — the lie in digits';
  // THE NUMERAL IS BEHIND THE GATE. A default would satisfy every cell about the sentence.
  if (/\?\?\s*0/.test(today)) return 'the numeral falls back to 0 — an unmeasured zero is the claim F-38.31 convicted';
  if (!/feed\.responded[\s\S]{0,120}wl-mnum/.test(today)) return 'the numeral is not gated on feed.responded';
  // AMENDED, LABELLED — relay #3 item 2. The two-armed status is withheld with its byte.
  // What the cell asserts is that the surface prints the HONEST line and no other: a status
  // that claims a reading is the whole of F-38.31, and it can arrive either as the wrong
  // sentence or as a numeral, so both are refused.
  if (!/COPY\.todayNotLive/.test(today)) return 'the surface does not print the not-reading status';
  if (/COPY\.todayNothingYet/.test(today))
    return 'the true-empty arm is live again while its byte is withheld';
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
  const interim = strip(read('lib/worklist/rooms.ts')).match(/INTERIM_VENDOR_ROOMS[^=]*=\s*\[([\s\S]*?)\]/);
  if (!interim) return 'INTERIM_VENDOR_ROOMS is not declared';
  if (/'calendar'/.test(interim[1]))
    return 'calendar crossed but is still declared an interim /vendor room';
  if (!fs.existsSync(path.join(ROOT, 'app/w/calendar/page.tsx')))
    return 'the calendar leg resolves to a /w/ route that does not exist — never-404';
  if (!/'\/w\/notes\?add=1'/.test(fab)) return 'the note leg does not open the notes composer';
  const slices = (fab.match(/slice:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  if (slices.join(',') !== 'leads,clients,invoices,expenses,events')
    return 'the AddSheet legs are ' + slices.join(' ') + ', expected the five list slices in row order';
  // NO SECOND FORM. Every create hands off to the surface that already owns it.
  if (/CreateLeadRequest|createInvoice|createExpense/.test(fab)) return 'the Add sheet builds its own create call — a second home for create';
  // SCOPE IS A MOUNT, not a pathname test inside the component.
  if (/usePathname/.test(fab)) return 'the control decides for itself where it exists — a second copy of R-38.18';
  const mounted = ['app/w/rooms/page.tsx'];
  const others = ['app/w/today/page.tsx', 'components/worklist/WorklistShell.tsx'];
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
  // AND NOTHING CONSUMES IT IN SOURCE EITHER, which is the withholding asserted at its
  // other end: a consumer re-added here would paint a numeral over an unread feed.
  const today = strip(read('app/w/today/page.tsx'));
  if (/var\(--wl-t0\)/.test(today))
    return 'the withheld numeral has a consumer again in app/w/today/page.tsx (F-38.31)';
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
    if (!rel.startsWith('components/worklist/') && !rel.startsWith('app/w/')) bodies.add(rel);
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
  walkRoutes('app/w');
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
  walkRoutes('app/w');
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

const REAL_NAME_HELD = [
  // Retired by the dream-os seat that moves Couture to tier Signature/Prestige (me.js:146).
  'app/vendor/couture/screen.tsx',
  // Retired by the dream-os seat that takes requirePrestige off the six studio routers;
  // the sentence is DELETED there, not re-cut, because Team Hub opens to every tier.
  'app/vendor/team-hub/screen.tsx',
  'app/vendor/studio/team/page.tsx',
  'app/vendor/studio/tasks/page.tsx',
  'app/vendor/studio/team-payments/page.tsx',
];
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
  const src = strip(read('app/vendor/collab/screen.tsx'));
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
  const main  = strip(read('app/vendor/layout.tsx'));
  if (!/<AskProvider/.test(shell)) bad.push('the shell mounts no AskProvider — every door under /w would throw at render');
  if (!/<AskProvider/.test(main))  bad.push('app/vendor/layout.tsx mounts no AskProvider — every door on the carried tree would throw at render');
  // The /vendor tree's implementation is TODAY'S PUSH, kept byte-identical. If it stops
  // pushing, the hub's own 「Send to Chat」 has silently died and nothing else would say so.
  if (!/\/vendor\?draft=/.test(main)) bad.push('the /vendor tree provider no longer makes the hub push — a live control on the old hub regressed');
  // AND THE SHELL'S IMPLEMENTATION MUST NOT BE A PUSH. One provider making the other's
  // choice is the defect wearing the cure's name.
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

console.log(fails === 0 ? '\nFLOOR GREEN' : '\nFLOOR RED — ' + fails + ' cell(s)');
process.exit(fails === 0 ? 0 : 1);
