#!/usr/bin/env node
'use strict';
// scripts/b58_f40263_toast_surface_bench.js
//   F-40.263 · THE REFUSAL SENTENCE IS LEGIBLE, AND CANNOT BE PINNED AGAIN.
//
//   node scripts/b58_f40263_toast_surface_bench.js
//
// Exit code is the verdict. Zero dependencies.
//
// ══════════════════════════════════════════════════════════════════════════
// WHAT IT GUARDS
// ══════════════════════════════════════════════════════════════════════════
// F-04.75 was cured once, in 2026, by PINNING a cream literal against a token
// whose value the pin did not own. app/globals.css:1347 later forced
// `--atelier-ink: #0E1112 !important` under html.theme-light and the cure
// silently inverted: near-black ink on the toast's own dark-red ground,
// measured 1.53:1 against a 4.5 floor, in five shell rooms.
//
// So this bench does NOT assert that a particular hex is present. Asserting the
// cure's OUTPUT is what let the last cure rot — the literal was still there, and
// still wrong. It asserts the cure's SHAPE: the toast reads the surface, in every
// kind, and holds no colour of its own to go stale. A shape cannot drift when a
// token moves, because it has no opinion about the token's value.
//
// EVERY NUMBER IS DERIVED, NONE TRANSCRIBED. The token values below are parsed
// out of lib/worklist/theme.ts on each run. If GRAPHITE.ink moves tomorrow, §4
// re-measures against the new value and reddens if the new value fails — which
// is precisely the event that broke F-04.75 and which nothing was watching.
//
// ══════════════════════════════════════════════════════════════════════════
// WHAT IT DOES NOT GUARD — SAID PLAINLY
// ══════════════════════════════════════════════════════════════════════════
// · It reads SOURCE, not a deploy. tools/wl_audit.mjs is the served-bytes gate;
//   this is a source bench and a green here is not a green on the glass. The
//   four captures (invoice schedule toast · leads Mark lost · contracts Cancel ·
//   Storefront switch, both modes) are owed on a seat with the shot arm.
// · It measures OPAQUE grounds. `--atelier-sheet-bg` is a flat hex in both modes
//   of lib/worklist/theme.ts, so no compositing is needed; §4 refuses to guess
//   and reddens if either mode's value stops being a flat hex.
// · It says nothing about components/worklist/WlToast.tsx. That file's error
//   ground (#4A1616) is a colour leak, not a legibility defect (11.69:1 Chalk),
//   and it rides the palette packet under R-40.129 ②. Naming the gap here so a
//   later reader does not read this green as covering both toasts.
// · F-40.262 — the two mode systems — is NOT cured by this bench. It is dodged:
//   Toast.tsx now reads one system instead of straddling both. Unification is
//   Block 09's shell pass.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const TOAST = 'components/vendor/Toast.tsx';
const THEME = 'lib/worklist/theme.ts';

let pass = 0, fail = 0;
const ok  = (n, d) => { pass++; console.log(`  \u2713 ${n}${d ? '  \u2014 ' + d : ''}`); };
const bad = (n, d) => { fail++; console.log(`  \u2717 ${n}${d ? '  \u2014 ' + d : ''}`); };

// ── codeOf: comments stripped before any textual assertion ─────────────────
// Mandatory in this estate. Every claim below is about bytes the browser runs;
// a probe that matches a paragraph explaining the cure would go green on a file
// that had been reverted to the defect with the explanation left behind.
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

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// ── WCAG 2.1 relative luminance ────────────────────────────────────────────
const hex2rgb = (h) => {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};
const lum = (h) => {
  const c = hex2rgb(h).map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const la = lum(a), lb = lum(b);
  return Math.round(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)) * 100) / 100;
};

// ── the token table, PARSED off disk ───────────────────────────────────────
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

console.log('\n\u2550\u2550 b58 \u00b7 F-40.263 \u2014 THE TOAST READS THE SURFACE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n');

const themeSrc = read(THEME);
const MODES = { Graphite: parseMode(themeSrc, 'GRAPHITE'), Chalk: parseMode(themeSrc, 'CHALK') };

// ═══ §0 · THE TOKEN TABLE PARSED, NOT ASSUMED ══════════════════════════════
console.log('\u00a70  the token table is readable off disk');
for (const [mode, t] of Object.entries(MODES)) {
  if (t && t['sheet-bg'] && t['ink'] && t['accent-text'] && t['metal'] && t['critical']) {
    ok(`${mode} parsed`, `sheet-bg ${t['sheet-bg']} \u00b7 ink ${t['ink']}`);
  } else {
    bad(`${mode} parsed`, 'lib/worklist/theme.ts shape moved \u2014 every number below is void');
  }
}

// ═══ THE PROBES, as functions so \u00a75 can re-run them on a mutated source ═════
const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

function probeSurface(code) {
  return {
    // The ground is the sheet, unconditionally. No ternary, no mode branch.
    ground: /backgroundColor:\s*'var\(--atelier-sheet-bg\)'/.test(code),
    // The message ink is the surface's own, unconditionally.
    ink: /color:\s*'var\(--atelier-ink\)'/.test(code),
    // No colour of its own, anywhere in the bytes that run.
    literals: (code.match(LITERAL) || []),
    // Not straddling the two mode systems (F-40.262, R-40.129 \u2465).
    jsTheme: /\buseT\b|\bT\.[a-zA-Z]/.test(code) || /ThemeContext/.test(code),
  };
}

const toastSrc = read(TOAST);
const code = codeOf(toastSrc);
const P = probeSurface(code);

// ═══ §1 · THE SURFACE IS THE GROUND AND THE INK ════════════════════════════
console.log('\n\u00a71  the toast reads the surface in every kind');
P.ground ? ok('ground is var(--atelier-sheet-bg)', 'no kind branch, no mode branch')
         : bad('ground is var(--atelier-sheet-bg)', 'a kind or a literal is choosing the ground');
P.ink ? ok('message ink is var(--atelier-ink)', 'the F-04.75 pin is retired')
      : bad('message ink is var(--atelier-ink)', 'the ink is pinned or branched \u2014 F-04.75 can return');

// ═══ §2 · THE FILE HOLDS NO COLOUR OF ITS OWN ══════════════════════════════
console.log('\n\u00a72  no colour literal survives in the bytes that run');
P.literals.length === 0
  ? ok('zero colour literals', 'comment-stripped; nothing here can go stale against a token')
  : bad('zero colour literals', `${P.literals.length} found: ${P.literals.slice(0, 6).join(' ')}`);

// ═══ §3 · ONE MODE SYSTEM (R-40.129 ⑥) ═════════════════════════════════════
console.log('\n\u00a73  one mode system \u2014 CSS variables only');
P.jsTheme ? bad('no JS theme read', 'useT()/T.* or ThemeContext is back \u2014 F-40.262 has a foothold again')
          : ok('no JS theme read', 'useT()/T.*/ThemeContext all absent');

// ═══ §4 · THE KIND MOVES ONE LINE, AND ONLY TWO THINGS READ IT ═════════════
console.log('\n\u00a74  the kind moves one line (R-40.129 \u2461, the reading taken)');
const roleDecl = (code.match(/const roleInk\s*=/g) || []).length;
const roleUses = (code.match(/\broleInk\b/g) || []).length - roleDecl;
roleDecl === 1
  ? ok('roleInk has one home', 'the kind\u2192role mapping cannot diverge')
  : bad('roleInk has one home', `${roleDecl} declarations found`);
roleUses === 2
  ? ok('exactly two readers', 'the dot and the edge, and nothing else')
  : bad('exactly two readers', `${roleUses} readers \u2014 a third surface has started painting by kind`);

// ═══ §5 · MEASURED, AGAINST THE PARSED TABLE ═══════════════════════════════
console.log('\n\u00a75  every variant clears its bar, both modes (values parsed, not transcribed)');
const BAR_TEXT = 4.5, BAR_UI = 3.0;
for (const [mode, t] of Object.entries(MODES)) {
  if (!t) continue;
  const sheet = t['sheet-bg'];
  if (!/^#[0-9a-fA-F]{6}$/.test(sheet)) {
    bad(`${mode} ground is a flat hex`, `sheet-bg is '${sheet}' \u2014 this bench refuses to guess a composite`);
    continue;
  }
  const rows = [
    ['message  --atelier-ink',         t['ink'],          BAR_TEXT],
    ['action   --atelier-accent-text', t['accent-text'],  BAR_TEXT],
    ['dot ok   --role-metal',          t['metal'],        BAR_UI],
    ['dot err  --role-critical',       t['critical'],     BAR_UI],
    ['edge err --role-critical',       t['critical'],     BAR_UI],
  ];
  for (const [label, val, bar] of rows) {
    const r = ratio(val, sheet);
    r >= bar ? ok(`${mode} ${label}`, `${val} on ${sheet} = ${r}:1 (bar ${bar})`)
             : bad(`${mode} ${label}`, `${val} on ${sheet} = ${r}:1 \u2014 UNDER ${bar}`);
  }
}

// ═══ §6 · THE MUTATION PROOF, BOTH WAYS ════════════════════════════════════
// A bench that has only ever been green has proved nothing. Each mutation below
// restores one byte of the PRE-CURE file and asserts the matching probe reddens.
// If a mutation goes green, the probe is decorative and this bench says so.
console.log('\n\u00a76  mutation proof \u2014 each cure byte, reverted, must RED');
const MUT = [
  ['ground \u2192 the pre-cure dark-red literal',
   "backgroundColor: 'var(--atelier-sheet-bg)'",
   "backgroundColor: isErr ? 'rgba(90,20,20,0.96)' : 'rgba(20,20,18,0.95)'",
   (p) => !p.ground && p.literals.length > 0],
  ['ink \u2192 the pre-cure pinned cream',
   "color: 'var(--atelier-ink)',",
   "color: '#F1EFEC',",
   (p) => !p.ink && p.literals.length > 0],
  ['the JS theme read, restored',
   'export function Toast(',
   "import { useT } from '@/lib/vendor/ThemeContext';\nexport function Toast(",
   (p) => p.jsTheme],
];
for (const [name, from, to, reds] of MUT) {
  if (!code.includes(from)) { bad(`mutation: ${name}`, `anchor absent \u2014 cannot mutate, so cannot prove`); continue; }
  const mutated = code.replace(from, to);
  if (mutated === code) { bad(`mutation: ${name}`, 'replacement was a no-op'); continue; }
  reds(probeSurface(mutated))
    ? ok(`mutation: ${name}`, 'REDs at the uncured byte \u2014 the probe is load-bearing')
    : bad(`mutation: ${name}`, 'stayed GREEN on the defect \u2014 THE PROBE IS DECORATIVE');
}

// ═══ VERDICT ═══════════════════════════════════════════════════════════════
console.log(`\n\u2500\u2500 ${fail === 0 ? 'GREEN' : 'RED'} \u2014 b58 F-40.263  ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
