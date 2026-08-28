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

cell('C5 DreamAi, never a seat-name, in chrome (R-37.70)', () => {
  const strings = (strip(read('lib/worklist/copy.ts')).match(/'(?:[^'\\]|\\.)*'/g) || []).join(' ');
  if (/\bVictor\b|\bHarvey\b|\bDonna\b/.test(strings)) return 'a persona seat-name appears in a vendor-facing byte';
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
cell('C13 first-run set: shape and the three-sentence ceiling', () => {
  const copy = strip(read('lib/worklist/copy.ts'));
  const fr   = strip(read('components/worklist/FirstRun.tsx'));

  // AMENDED, LABELLED — M-FINISH S1 (R-38.6). `todayPromise` RETIRES: it was a two-clause
  // paragraph standing where a page title goes, and it is recut to `todayTitle` at t1.
  // RETIRE-WITH-THE-READER, and the assertion INVERTS rather than vanishing — a silent
  // re-add of the paragraph reddens — while the clause that mattered (Today must open on a
  // line with stature, R-37.76 ⑧) is preserved against its successor.
  if (/todayPromise:/.test(copy)) return 'the retired paragraph todayPromise is back in copy.ts';
  if (!/todayTitle:/.test(copy)) return 'Today has no page title byte in copy.ts';
  if (!/COPY\.todayTitle/.test(strip(read('app/w/today/page.tsx')))) return 'the page title is never rendered on Today';

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

  // Retired keys must be gone, not orphaned — an unrendered vetoed byte is a byte that
  // drifts unnoticed until someone renders it again.
  if (/cardAiTitle|cardAiBody|cardAiAction/.test(copy)) return 'ZIP 1 card keys survive in copy.ts';
  const retiredKeys = ['cardRoomsTitle', 'cardRoomsBody', 'cardRoomsAction', 'cardMoreTitle', 'cardMoreBody',
                       'roomsPointer', 'roomsAskSub', 'roomsProfileSub', 'todayMastheadCaption'];
  const orphans = retiredKeys.filter((k) => new RegExp(k + ':').test(copy));
  if (orphans.length) return 'retired keys survive in copy.ts: ' + orphans.join(', ');

  const chips = copy.match(/cardAskChips[^\]]*\]/);
  if (!chips) return 'chip list not found';
  const n = (chips[0].match(/'/g) || []).length / 2;
  if (n !== 5) return 'chip count is ' + n + ', expected 5 (one per capability)';

  // The ceiling. Sentence-enders outside the ellipsis/decimal cases.
  // AMENDED with the card set above, and TIGHTENED: R-38.6 cuts the ceiling from three
  // sentences to ONE. The cell that counted to three would pass a two-sentence body, which
  // is exactly the drift the recut exists to prevent.
  const bodies = ['cardDeskBody', 'cardLinkBody', 'cardAskBody'];
  const over = [];
  for (const b of bodies) {
    const m = copy.match(new RegExp(b + ":\\s*'((?:[^'\\\\]|\\\\.)*)'"));
    if (!m) { over.push(b + ' (not found)'); continue; }
    const count = (m[1].match(/[.?!](\s|$)/g) || []).length;
    if (count > 3) over.push(b + ' has ' + count + ' sentences');
  }
  if (over.length) return 'over the three-sentence ceiling: ' + over.join(', ');
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
  for (const id of ['leads', 'clients', 'invoices', 'expenses', 'events', 'notes']) {
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

console.log(fails === 0 ? '\nFLOOR GREEN' : '\nFLOOR RED — ' + fails + ' cell(s)');
process.exit(fails === 0 ? 0 : 1);
