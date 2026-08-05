#!/usr/bin/env node
/**
 * TDW_09 · T-1 · THE TYPE CENSUS + SCALE MAPPER
 *
 * WHY THIS FILE EXISTS, AND WHY IT IS COMMITTED BEFORE ANY CURE.
 * The split between "the engraved label, kept as voice" and "small text with no
 * argument for it" was first measured by grepping `letterSpacing` on the SAME
 * SOURCE LINE as the `fontSize`. Most style objects in this estate span several
 * lines, so that method scored almost every engraved label as merely-small and
 * reported the split INVERTED — 103/156 where the truth is ~251/8. A chair then
 * certified the number with the same same-line grep, which is the independent-
 * method law's clause 1 in its purest form: a second pair of eyes agreeing by the
 * method it should have been checking. The founder ruled on the wrong integer.
 *
 * So: no count in any paper, comment, or ruling is authoritative. THIS
 * INSTRUMENT'S OUTPUT IS. The bench asserts what this prints, never a quoted
 * number, so a chair-spoken count cannot drift into law again.
 *
 * THE METHOD, and its failure mode, stated. For every `fontSize:` occurrence the
 * scanner walks OUT to the enclosing braces and reads the whole style object.
 * That is why it can see `letterSpacing` three lines below the size, and why it
 * does not bleed into an adjacent object the way a fixed character window does.
 * Pointed at a tree with no such objects it reports zero sites and SAYS SO with a
 * named refusal — a check whose failure mode is a silent zero is not a check.
 *
 * USAGE (runnable from any working directory):
 *   node scripts/tdw09_type_census.mjs           # the census
 *   node scripts/tdw09_type_census.mjs --map     # + the per-size scale mapping
 *   node scripts/tdw09_type_census.mjs --surfaces  # + the per-surface radius
 *   TDW_PWA=/path/to/clone node .../tdw09_type_census.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
export const ROOT = process.env.TDW_PWA || path.resolve(HERE, '..');

for (const probe of ['package.json', 'lib/vendor/theme.ts']) {
  if (!fs.existsSync(path.join(ROOT, probe))) {
    console.error(`REFUSED — ${ROOT} is not a dreamos-pwa clone: ${probe} absent.`);
    process.exit(1);
  }
}

// ── the lane this instrument speaks for ───────────────────────────────────────
export const LANES = ['app/vendor', 'components/vendor'];

// ── THE BODY FLOOR and THE REGISTER FLOOR ─────────────────────────────────────
export const BODY_FLOOR = 16;      // R-T4 — the mobile body floor, blanket arm
export const REGISTER_FLOOR = 8;   // R-T2 — the engraved voice starts here

/**
 * THE SCALE. 26 declared sizes resolve to eight named rungs, so "16px floor"
 * arrives as a scale rather than as 287 hand-edits (R-T4's own words).
 * Body rungs follow a ~1.25 ladder from the floor: 16 · 20 · 25 · 31 · 39 · 49.
 * The register keeps two rungs of its own BELOW the floor, because the engraved
 * label is exempt from the body bar by ruling and would stop being that voice at
 * 16px — it is a rule-line with letters in it, not a sentence.
 */
export const RUNGS = { register: [8, 9, 10], body: [16, 20, 25, 31, 39, 49] };
//
// THE REGISTER'S RUNGS ARE THE ONES IT ALREADY USES, and that is a deliberate,
// arguable choice rather than a scale purist's one. Derived distribution:
// 6px 5 · 7px 7 · 8px 76 · 9px 175 · 10px 66 · 12px 2. Keeping 8/9/10 as three
// rungs moves exactly the 12 sites R-T2 rules (6,7 -> 8) plus the 12px pair, and
// leaves 317 bytes untouched. Collapsing to two rungs (9 and 11) would be tidier
// on paper and would move 142 sites by a pixel each for no reader's benefit —
// existing behaviour is sacred and this voice is one the founder has now approved
// twice on a real handset. THE COLLAPSE IS A COMMITTED QUESTION IN THE PLAN
// PAPER (Q-T-1), not a decision taken here.

/** Which rung a declared size resolves to, given what kind of type it is. */
export function rungFor(size, engraved) {
  if (engraved) {
    const s = Math.max(size, REGISTER_FLOOR);              // R-T2
    return RUNGS.register.reduce((a, b) => Math.abs(b - s) < Math.abs(a - s) ? b : a);
  }
  if (size < BODY_FLOOR) return BODY_FLOOR;                // R-T4, the blanket arm
  return RUNGS.body.reduce((a, b) => Math.abs(b - size) < Math.abs(a - size) ? b : a);
}

// ── walk ──────────────────────────────────────────────────────────────────────
function files() {
  const out = [];
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); }
      else if (/\.tsx?$/.test(e.name)) out.push(p);
    }
  };
  LANES.forEach(l => walk(path.join(ROOT, l)));
  return out;
}

/** Walk out from an index to the enclosing balanced { … }. */
function objectAround(src, idx) {
  let depth = 0, start = -1;
  for (let i = idx; i >= 0; i--) {
    const c = src[i];
    if (c === '}') depth++;
    else if (c === '{') { if (depth === 0) { start = i; break; } depth--; }
  }
  if (start < 0) return null;
  depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  return null;
}

/**
 * THE ENGRAVED TEST, all three legs inside ONE style object:
 * a size, letterspacing, and uppercase. Two of the three is not the voice —
 * letterspaced sentence case is a different thing and stays merely small.
 */
export function census() {
  const engraved = [], body = [], unresolved = [];
  const sizes = new Map();
  for (const f of files()) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/fontSize:\s*(\d{1,2})\b/g)) {
      const size = +m[1];
      const line = src.slice(0, m.index).split('\n').length;
      const at = { file: path.relative(ROOT, f), line, size };
      sizes.set(size, (sizes.get(size) || 0) + 1);
      const obj = objectAround(src, m.index);
      if (!obj) { unresolved.push(at); continue; }
      const isEngraved = /letterSpacing/.test(obj) && /textTransform:\s*'uppercase'/.test(obj);
      (isEngraved ? engraved : body).push(at);
    }
  }
  return { engraved, body, unresolved, sizes };
}

// ── APPLY (R-T7) ──────────────────────────────────────────────────────────────
// The instrument that derives the mapping also applies it. A separate applier
// would be a second implementation of the same rule, free to drift from the one
// the bench asserts — which is how a census and a cure stop agreeing.
//
// LINE-HEIGHT (Q-T-4, ruled): a body site with a size and no leading gets the
// token default. Engraved sites are left alone — a letterspaced uppercase rule
// -line is not a paragraph and 1.5 would break the register's own geometry.
export const LEADING = 1.5;

function applyTo(rel) {
  const abs = path.join(ROOT, rel);
  let src = fs.readFileSync(abs, 'utf8');
  let sized = 0, led = 0;
  // Right-to-left so earlier indices stay valid as the string changes length.
  const hits = [...src.matchAll(/fontSize:\s*(\d{1,2})\b/g)].reverse();
  for (const m of hits) {
    const size = +m[1];
    const obj = objectAround(src, m.index);
    if (!obj) continue;
    const engraved = /letterSpacing/.test(obj) && /textTransform:\s*'uppercase'/.test(obj);
    const target = rungFor(size, engraved);
    const start = m.index, end = start + m[0].length;
    let replacement = `fontSize: ${target}`;
    if (!engraved && !/lineHeight/.test(obj)) { replacement += `, lineHeight: ${LEADING}`; led++; }
    if (target !== size || replacement !== m[0]) {
      src = src.slice(0, start) + replacement + src.slice(end);
      if (target !== size) sized++;
    }
  }
  fs.writeFileSync(abs, src);
  return { sized, led };
}

const applyIdx = process.argv.indexOf('--apply');
if (applyIdx !== -1) {
  const targets = process.argv.slice(applyIdx + 1).filter(a => !a.startsWith('--'));
  if (!targets.length) { console.error('REFUSED — --apply needs at least one file path, relative to the repo root.'); process.exit(1); }
  console.log('── APPLYING THE SCALE ──');
  for (const t of targets) {
    if (!fs.existsSync(path.join(ROOT, t))) { console.error(`REFUSED — ${t} does not exist at ${ROOT}.`); process.exit(1); }
    const r = applyTo(t);
    console.log(`  ${t}: ${r.sized} sizes moved, ${r.led} leading added`);
  }
}

// ── report ────────────────────────────────────────────────────────────────────
const c = census();
const total = c.engraved.length + c.body.length + c.unresolved.length;
if (total === 0) {
  console.error(`REFUSED — zero fontSize sites found under ${LANES.join(', ')}. That is not a`);
  console.error('measurement, it is a broken read set. Check TDW_PWA and the lane list.');
  process.exit(1);
}
const under = c.body.filter(b => b.size < BODY_FLOOR);
const subRegister = c.engraved.filter(e => e.size < REGISTER_FLOOR);

console.log('── TDW_09 T-1 · TYPE CENSUS ──');
console.log(`root                       ${ROOT}`);
console.log(`lanes                      ${LANES.join('  ')}`);
console.log(`fontSize sites             ${total}`);
console.log(`  ENGRAVED (exempt, R-T1)  ${c.engraved.length}   across ${new Set(c.engraved.map(e => e.file)).size} files`);
console.log(`    of which under ${REGISTER_FLOOR}px      ${subRegister.length}   -> rise to ${REGISTER_FLOOR}px within the register (R-T2)`);
console.log(`  BODY / other             ${c.body.length}`);
console.log(`    of which under ${BODY_FLOOR}px     ${under.length}   -> rise to the floor (R-T4, the blanket arm)`);
console.log(`  unresolved objects       ${c.unresolved.length}`);
console.log(`distinct declared sizes    ${c.sizes.size}   -> ${RUNGS.register.length + RUNGS.body.length} named rungs`);

if (process.argv.includes('--map')) {
  console.log('\n── THE SCALE MAPPING, per declared size ──');
  console.log('  size   sites   engraved->   body->');
  [...c.sizes].sort((a, b) => a[0] - b[0]).forEach(([s, n]) => {
    console.log(`  ${String(s).padStart(4)}px ${String(n).padStart(6)}   ${String(rungFor(s, true)).padStart(9)}   ${String(rungFor(s, false)).padStart(6)}`);
  });
}

if (process.argv.includes('--surfaces')) {
  const by = new Map();
  under.forEach(b => by.set(b.file, (by.get(b.file) || 0) + 1));
  console.log(`\n── THE RAISE RADIUS: ${under.length} sub-floor body sites across ${by.size} surfaces ──`);
  [...by].sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(`  ${String(n).padStart(3)}  ${f}`));
}
