#!/usr/bin/env node
'use strict';
// scripts/b60_toast_contrast.js
//   R-40.129 ② · EVERY TOAST VARIANT IS LEGIBLE, IN BOTH MODES, IN BOTH TOASTS.
//
//   node scripts/b60_toast_contrast.js
//
// Exit code is the verdict. Zero dependencies.
//
// ══════════════════════════════════════════════════════════════════════════
// WHY A SECOND TOAST CELL EXISTS
// ══════════════════════════════════════════════════════════════════════════
// b58 guards `components/vendor/Toast.tsx`, the legacy toast, because F-40.263
// was its defect. This cell guards THE RULE, across both toasts: the shell's own
// `components/worklist/WlToast.tsx` carried the founder's original specimen —
// `rgba(74,22,22,0.96)`, which composited to #511F1F on Chalk — and it was a
// colour leak rather than a legibility defect (11.69:1), so it rode this packet
// instead of the micro. Two files now obey one rule and one cell asserts it.
//
// ══════════════════════════════════════════════════════════════════════════
// WHAT IT ASSERTS, AND WHY IT ASSERTS SHAPE BEFORE VALUE
// ══════════════════════════════════════════════════════════════════════════
// F-04.75 was cured twice and rotted twice, both times for the same reason: the
// cure was a VALUE pinned against a token the pin did not own. So §1 asserts the
// shape — ground and ink both read the surface, in every kind — and only then
// does §2 measure. Shape first means a token move re-measures rather than
// silently inverting; value second means a shape that is right on paper still
// has to clear 4.5:1 on the ground it actually sits on.
//
// MEASURED, NOT TRANSCRIBED. Both mode tables are parsed out of
// lib/worklist/theme.ts on every run. This cell holds no hex of its own.
//
// ══════════════════════════════════════════════════════════════════════════
// WHAT IT DOES NOT GUARD — SAID PLAINLY
// ══════════════════════════════════════════════════════════════════════════
// · Source, not a deploy. `tools/wl_audit.mjs` is the served-bytes gate.
// · It measures OPAQUE grounds. `--atelier-sheet-bg` is a flat hex in both modes
//   of theme.ts; if either mode stops being a flat hex the cell REFUSES to guess
//   a composite and reddens instead of quietly compositing against nothing.
// · It says nothing about the toast's TIMING, vocabulary or mount. `useToast` is
//   the single home for all three and is not this cell's subject.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const TOASTS = ['components/vendor/Toast.tsx', 'components/worklist/WlToast.tsx'];
const THEME = 'lib/worklist/theme.ts';

let pass = 0, fail = 0;
const ok  = (n, d) => { pass++; console.log(`  \u2713 ${n}${d ? '  \u2014 ' + d : ''}`); };
const bad = (n, d) => { fail++; console.log(`  \u2717 ${n}${d ? '  \u2014 ' + d : ''}`); };

function codeOf(src) {
  let out = '', i = 0, st = 'code';
  while (i < src.length) {
    if (st === 'code') {
      if (src.startsWith('/*', i)) { st = 'block'; i += 2; continue; }
      if (src.startsWith('//', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
      out += src[i++];
    } else {
      if (src.startsWith('*/', i)) { st = 'code'; i += 2; continue; }
      if (src[i] === '\n') out += '\n';
      i++;
    }
  }
  return out;
}
const read = (r) => fs.readFileSync(path.join(ROOT, r), 'utf8');

const lum = (h) => {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(f.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const la = lum(a), lb = lum(b);
  return Math.round(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)) * 100) / 100;
};

function parseMode(src, name) {
  const m = src.match(new RegExp(`export const ${name}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`));
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*'([a-z-]+)'\s*:\s*'([^']*)'/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

console.log('\n\u2550\u2550 b60 \u00b7 R-40.129 \u2461 \u2014 TOAST CONTRAST, BOTH TOASTS, BOTH MODES \u2550\u2550\u2550\u2550\u2550\n');

const themeSrc = read(THEME);
const MODES = { Graphite: parseMode(themeSrc, 'GRAPHITE'), Chalk: parseMode(themeSrc, 'CHALK') };
const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

// ═══ §1 · THE SHAPE ════════════════════════════════════════════════════════
// The two files are written differently — one in inline React styles, one in a
// CSS template — so the probes match on the DECLARATION, not on a spelling.
// `codeOf` first, so a paragraph describing the rule cannot satisfy it.
console.log('\u00a71  the shape \u2014 ground and ink both read the surface, in every kind');
const codes = {};
for (const f of TOASTS) {
  const code = codeOf(read(f));
  codes[f] = code;
  const lits = code.match(LITERAL) || [];
  lits.length === 0
    ? ok(`${f} holds no colour of its own`, 'nothing here can go stale against a token')
    : bad(`${f} holds no colour of its own`, `${lits.length} literal(s): ${lits.slice(0, 4).join(' ')}`);

  const readsSheet = /--atelier-sheet-bg/.test(code);
  const readsInk = /--atelier-ink\b/.test(code);
  readsSheet ? ok(`${f} ground is --atelier-sheet-bg`) : bad(`${f} ground is --atelier-sheet-bg`, 'the ground is fixed or branched');
  readsInk ? ok(`${f} ink is --atelier-ink`) : bad(`${f} ink is --atelier-ink`, 'the ink is pinned \u2014 F-04.75 can return');

  // The kind may move the dot, the edge and the one role line. It may NOT move
  // the ground or the ink; if `isErr`/`.err` reaches either, the rule is broken.
  const errTouchesGround = /(background|backgroundColor)[^;\n]*\b(isErr|err)\b/.test(code)
    || /\.err\s*\{[^}]*background\s*:/.test(code);
  errTouchesGround
    ? bad(`${f} the kind does not choose the ground`, 'an error arm paints its own ground again')
    : ok(`${f} the kind does not choose the ground`, 'only the dot, the edge and the role line');
}

// ═══ §2 · THE VALUE ════════════════════════════════════════════════════════
console.log('\n\u00a72  measured on the ground each value actually sits on');
const BAR_TEXT = 4.5, BAR_UI = 3.0;
for (const [mode, t] of Object.entries(MODES)) {
  if (!t) { bad(`${mode} table parsed`, 'lib/worklist/theme.ts shape moved \u2014 every number below is void'); continue; }
  const sheet = t['sheet-bg'];
  if (!/^#[0-9a-fA-F]{6}$/.test(sheet)) {
    bad(`${mode} ground is a flat hex`, `sheet-bg is '${sheet}' \u2014 this cell refuses to guess a composite`);
    continue;
  }
  for (const [label, val, bar] of [
    ['message  --atelier-ink',         t['ink'],         BAR_TEXT],
    ['action   --atelier-accent-text', t['accent-text'], BAR_TEXT],
    ['dot ok   --role-metal',          t['metal'],       BAR_UI],
    ['dot err  --role-critical',       t['critical'],    BAR_UI],
    ['edge err --role-critical',       t['critical'],    BAR_UI],
    ['dot warn --role-caution',        t['caution'],     BAR_UI],
  ]) {
    const r = ratio(val, sheet);
    r >= bar ? ok(`${mode} ${label}`, `${val} on ${sheet} = ${r}:1 (bar ${bar})`)
             : bad(`${mode} ${label}`, `${val} on ${sheet} = ${r}:1 \u2014 UNDER ${bar}`);
  }
}

// ═══ §3 · MUTATION PROOF, BOTH WAYS ════════════════════════════════════════
// Each mutation restores one byte of the pre-cure files. The specimen the founder
// walked is here by its own value: rgba(74,22,22,0.96) on the Chalk page
// composited to #511F1F, and the near-black ink on it measured 1.41:1.
console.log('\n\u00a73  mutation proof \u2014 pinning either the ink or the ground must RED');
const MUT = [
  ['WlToast: the founder\u2019s specimen ground restored',
   'components/worklist/WlToast.tsx',
   '.wl-toast.err{border-color:var(--role-critical)}',
   '.wl-toast.err{background:rgba(74,22,22,0.96);border-color:var(--role-critical)}',
   (c) => (c.match(LITERAL) || []).length > 0 && /\.err\s*\{[^}]*background\s*:/.test(c)],
  ['WlToast: the #F1EFEC ink pin restored',
   'components/worklist/WlToast.tsx',
   '.wl-toast.err .wl-toastmsg{color:var(--atelier-ink)}',
   '.wl-toast.err .wl-toastmsg{color:#F1EFEC}',
   (c) => (c.match(LITERAL) || []).length > 0],
  ['Toast: the pre-cure dark-red ground restored',
   'components/vendor/Toast.tsx',
   "backgroundColor: 'var(--atelier-sheet-bg)'",
   "backgroundColor: isErr ? 'rgba(90,20,20,0.96)' : 'var(--atelier-sheet-top)'",
   (c) => (c.match(LITERAL) || []).length > 0 && !/backgroundColor:\s*'var\(--atelier-sheet-bg\)'/.test(c)],
];
for (const [name, file, from, to, reds] of MUT) {
  const c = codes[file];
  if (!c.includes(from)) { bad(`mutation: ${name}`, 'anchor absent \u2014 cannot mutate, so cannot prove'); continue; }
  reds(c.replace(from, to))
    ? ok(`mutation: ${name}`, 'REDs at the uncured byte \u2014 the probe is load-bearing')
    : bad(`mutation: ${name}`, 'stayed GREEN on the defect \u2014 THE PROBE IS DECORATIVE');
}
// The specimen, measured, so the number that started this arc stays on the record.
const over = (fg, a, bg) => {
  const f = [1, 3, 5].map((i) => parseInt(fg.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(bg.slice(i, i + 2), 16));
  return '#' + f.map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, '0')).join('').toUpperCase();
};
if (MODES.Chalk) {
  const spec = over('#4A1616', 0.96, MODES.Chalk['page-bg']);
  const was = ratio(spec, MODES.Chalk['ink']);
  was < BAR_TEXT
    ? ok('the specimen is still a defect when restored', `${spec} with --atelier-ink = ${was}:1, under ${BAR_TEXT}`)
    : bad('the specimen is still a defect when restored', `${was}:1 \u2014 the arithmetic moved; re-derive before trusting this cell`);
}

console.log(`\n\u2500\u2500 ${fail === 0 ? 'GREEN' : 'RED'} \u2014 b60 toast contrast  ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
