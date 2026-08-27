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

cell('C2 sixteen rooms in frozen order, 7 + 9', () => {
  const src = strip(read('lib/worklist/rooms.ts'));
  const ids = (src.match(/\{\s*id:\s*'([a-z]+)'/g) || []).map((s) => s.match(/'([a-z]+)'/)[1]);
  if (ids.length !== 16) return 'registry has ' + ids.length + ' rooms, expected 16';
  const fb = src.match(/FROZEN_ORDER[^=]*=\s*\[([\s\S]*?)\]/);
  if (!fb) return 'FROZEN_ORDER not found';
  const frozen = (fb[1].match(/'([a-z]+)'/g) || []).map((s) => s.slice(1, -1));
  if (frozen.join(',') !== ids.join(',')) return 'order drift: registry [' + ids.join(',') + '] vs frozen [' + frozen.join(',') + ']';
  const work = (src.match(/band:\s*'work'/g) || []).length;
  const biz  = (src.match(/band:\s*'business'/g) || []).length;
  if (work !== 7) return 'top band has ' + work + ', expected 7';
  if (biz !== 9) return 'bottom band has ' + biz + ', expected 9';
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
  const missing = files.filter((f) => !/:active\{/.test(read(f)));
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
cell('C9 card 1 reads the wire, not a local name', () => {
  const fr = strip(read('components/worklist/FirstRun.tsx'));
  if (/vendor\?\.routing_handle/.test(fr)) return 'reads vendor.routing_handle — the wire field is `handle` (dream-os me.js:76)';
  if (!/vendor\?\.handle/.test(fr)) return 'does not read vendor.handle at all';
  return null;
});

// ── C10 · TAP-TARGET FLOOR. Every interactive control >= 44 CSS px (R-37.73 (1)).
//    The rule reads min-height/min-width off the shipped CSS. A control with neither is
//    a target that survives by accident, and this cell calls that a miss.
cell('C10 every tap target >= 44px', () => {
  const TAP_MIN = 44;
  const files = {
    'components/worklist/WorklistShell.tsx': ['wl-coin', 'wl-seat', 'wl-coinitem'],
    'components/worklist/RoomsGrid.tsx':     ['wl-tile'],
    'components/worklist/AiDock.tsx':        ['wl-dock'],
    'components/worklist/FirstRun.tsx':      ['wl-cardaction', 'wl-chip'],
    'app/w/support/page.tsx':                ['wl-supportaction'],
  };
  const under = [];
  for (const [f, classes] of Object.entries(files)) {
    const css = read(f);
    for (const c of classes) {
      const m = css.match(new RegExp('\\.' + c + '\\{([^}]*)\\}'));
      if (!m) { under.push(c + ' (rule not found)'); continue; }
      const h = m[1].match(/min-height:(\d+)px/);
      if (!h) { under.push(c + ' (no min-height — a target that survives by accident)'); continue; }
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
    ['components/worklist/WorklistShell.tsx', 'wl-sub', 11],
    ['components/worklist/AiDock.tsx', 'wl-docktext', 12], ['components/worklist/AiDock.tsx', 'wl-dockglyph', 11],
    ['components/worklist/FirstRun.tsx', 'wl-cardtitle', 12], ['components/worklist/FirstRun.tsx', 'wl-cardbody', 14],
    ['components/worklist/FirstRun.tsx', 'wl-chip', 12], ['components/worklist/FirstRun.tsx', 'wl-cardaction', 12],
  ];
  const bad = [];
  for (const [f, c, floor] of rules) {
    const m = read(f).match(new RegExp('\\.' + c + '\\{([^}]*)\\}'));
    if (!m) { bad.push(c + ' (rule not found)'); continue; }
    const sz = m[1].match(/font-size:([\d.]+)px/);
    if (!sz) { bad.push(c + ' (no font-size)'); continue; }
    if (Number(sz[1]) < floor) bad.push(c + ' at ' + sz[1] + 'px, floor ' + floor);
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

  if (!/todayPromise:/.test(copy)) return 'the forward promise has no home in copy.ts';
  if (!/COPY\.todayPromise/.test(fr)) return 'the forward promise is never rendered';

  const titles = ['cardDeskTitle', 'cardLinkTitle', 'cardAskTitle', 'cardRoomsTitle', 'cardMoreTitle'];
  const missing = titles.filter((t) => !new RegExp('COPY\\.' + t).test(fr));
  if (missing.length) return 'cards defined but never rendered: ' + missing.join(', ');

  // Retired keys must be gone, not orphaned — an unrendered vetoed byte is a byte that
  // drifts unnoticed until someone renders it again.
  if (/cardAiTitle|cardAiBody|cardAiAction/.test(copy)) return 'ZIP 1 card keys survive in copy.ts';

  const chips = copy.match(/cardAskChips[^\]]*\]/);
  if (!chips) return 'chip list not found';
  const n = (chips[0].match(/'/g) || []).length / 2;
  if (n !== 5) return 'chip count is ' + n + ', expected 5 (one per capability)';

  // The ceiling. Sentence-enders outside the ellipsis/decimal cases.
  const bodies = ['cardDeskBody', 'cardLinkBody', 'cardAskBody', 'cardRoomsBody', 'cardMoreBody'];
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

console.log(fails === 0 ? '\nFLOOR GREEN' : '\nFLOOR RED — ' + fails + ' cell(s)');
process.exit(fails === 0 ? 0 : 1);
