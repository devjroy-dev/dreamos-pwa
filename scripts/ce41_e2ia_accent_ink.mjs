// scripts/ce41_e2ia_accent_ink.mjs — CE-41 E2 (ia) · INK ON A LIGHT ACCENT GROUND.
//
//     node scripts/ce41_e2ia_accent_ink.mjs
//
// WHAT IT PROVES. That no element in app/admin paints `T.gold` as its BACKGROUND
// and its own text in an ink chosen for the oxblood — F-41.70. `T.gold` was
// #C44058, a dark accent that near-white ink sat on legibly; E2 (i) re-pointed it
// at `--atelier-accent-text`, teal #68C9B4, a LIGHT one. The value moved under 516
// sites that E2 (i) did not re-token, and the ground/ink pairing inverted at every
// one of them that used it as a fill. The cure is `T.onAccent` (`--role-ink-deep`).
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL.
//   · It reads every .tsx under app/admin FROM DISK, not the files this rider
//     changed. A site added tomorrow reds tomorrow.
//   · A "site" is ONE ELEMENT'S OWN STYLE OBJECT, not a line and not a window of
//     lines. The first cut of this cell read three lines after the match and
//     called any `color:` in them the ground's ink — which redded the Counter's
//     progress bar at AdminUI.tsx:725, whose `color:` belongs to a SIBLING span on
//     the card ground two lines below. A cell that cannot tell an element from its
//     neighbour reports defects that are not there, and a seat that trusts it
//     "fixes" legible code. The style object is bounded by its own braces.
//   · TEXT IS OFTEN IN A CHILD, NOT THE PAINTED ELEMENT. The first green run of
//     this cell passed conversations/vendors/page.tsx — THE SITE THE FOUNDER
//     WALKED — because the bubble's own style object has no `color:`; the message
//     text is one <div> deeper. A cell that green-lights the defect it was written
//     for is worse than no cell. So the subject is the painted element's whole JSX
//     SUBTREE, walked by tag depth from its opening tag to its matching close, and
//     a descendant that sets its own `background` ends the inheritance and is not
//     judged against the accent.
//   · An element whose subtree carries no `color:` at all passes: a 3px progress
//     bar and a hero dot have no ink to get wrong.
//   · Comment-stripped before matching; a line describing the defect is not it.
//
// WHAT IT DOES NOT CLAIM. Any contrast ratio. It asserts the PAIRING the estate
// ruled — dark ink on the light accent — and nothing about the arithmetic; the
// ratio is theme.ts's to hold and the founder's phone to settle (R-39.15).

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'app/admin';

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

const codeOf = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// Return the whole JSX element containing index `i` — from its opening tag to its
// matching close — by tag depth. Self-closing tags return just themselves.
function elementAt(src, i) {
  let open = src.lastIndexOf('<', i);
  while (open > 0 && !/^<[A-Za-z]/.test(src.slice(open, open + 2))) open = src.lastIndexOf('<', open - 1);
  if (open < 0) return null;
  const tag = (src.slice(open + 1).match(/^[A-Za-z][\w.]*/) || [])[0];
  if (!tag) return null;
  // find the end of the opening tag, respecting braces in props
  let k = open, depth = 0;
  for (; k < src.length; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') depth--;
    else if (src[k] === '>' && depth === 0) break;
  }
  if (src[k - 1] === '/') return src.slice(open, k + 1);
  let level = 1, cur = k + 1;
  const openRe = new RegExp(`<${tag}[\\s/>]`, 'g');
  const closeRe = new RegExp(`</${tag}>`, 'g');
  while (level > 0 && cur < src.length) {
    openRe.lastIndex = cur; closeRe.lastIndex = cur;
    const o = openRe.exec(src), c = closeRe.exec(src);
    if (!c) return src.slice(open, Math.min(src.length, open + 4000));
    if (o && o.index < c.index) { level++; cur = o.index + 1; }
    else { level--; cur = c.index + 1; }
  }
  return src.slice(open, cur);
}

// Strip any descendant that paints its own background — it is not on the accent.
function inksOnAccent(el) {
  const body = el.replace(/background(?:Color)?\s*:\s*(?!(?:[^,;}]*T\.gold))[^,;}]+[\s\S]{0,400}?(?=<\/|$)/g, ' ');
  return body.match(/\bcolor\s*:\s*[^,;}]+/g) || [];
}

// Return the style object literal containing index `i`, by brace balance.
function styleObjectAt(src, i) {
  let depth = 0, start = -1;
  for (let k = i; k >= 0 && i - k < 4000; k--) {
    if (src[k] === '}') depth++;
    else if (src[k] === '{') { if (depth === 0) { start = k; break; } depth--; }
  }
  if (start < 0) return null;
  depth = 0;
  for (let k = start; k < src.length && k - start < 4000; k++) {
    if (src[k] === '{') depth++;
    else if (src[k] === '}') { depth--; if (depth === 0) return src.slice(start, k + 1); }
  }
  return null;
}

let pass = 0, fail = 0, grounds = 0;
// (iv) WIDENED THE SUBJECT. The cell was written for `T.gold` because that is the pointer
// E2 (i) moved. The re-tokened rooms do not go through `T` at all — they write
// `var(--role-metal)` and `var(--atelier-accent-text)` directly — and (iii) shipped one of
// those with a translucent-white ink on it (photos:94, a count pill), which this cell could
// not see. A saturated ground is a saturated ground whichever name it arrives under.
const RE_GROUND = /background(?:Color)?\s*:\s*[^,;}]*(?:\bT\.gold\b|var\(--role-metal\)|var\(--atelier-accent-text\))/g;

console.log('\nCE-41 E2 (ia) — no ink chosen for the oxblood sits on the teal\n');

for (const f of walk(ROOT)) {
  const src = codeOf(readFileSync(f, 'utf8'));
  let m;
  RE_GROUND.lastIndex = 0;
  while ((m = RE_GROUND.exec(src))) {
    grounds++;
    const obj = styleObjectAt(src, m.index);
    const line = src.slice(0, m.index).split('\n').length;
    if (!obj) { fail++; console.log(`  ✗ ${f}:${line} — style object not bounded; the cell cannot judge this site`); continue; }
    const el = elementAt(src, m.index);
    const own = obj.match(/\bcolor\s*:\s*[^,;}]+/g) || [];
    const inks = own.length ? own : (el ? inksOnAccent(el) : []);
    if (inks.length === 0) { pass++; console.log(`  ✓ ${f}:${line} — accent ground, no ink in its subtree`); continue; }
    if (inks.every((c) => /T\.onAccent|var\(--role-ink-on-metal\)|var\(--role-ink-deep\)/.test(c))) { pass++; console.log(`  ✓ ${f}:${line} — accent ground, ink is T.onAccent`); }
    else { fail++; console.log(`  ✗ ${f}:${line} — accent ground with ink chosen for the oxblood\n      ${inks.join(' | ').slice(0, 120)}`); }
  }
}

// A cell that found nothing to look at is not a green. If the ground sites ever go
// to zero the sweep has stopped being about anything and should be retired by name.
if (grounds === 0) { console.log('  ✗ the cell found no T.gold ground at all — its subject is gone; retire it by name, do not leave it passing'); fail++; }
else console.log(`\n  · ${grounds} accent grounds inspected`);

console.log(`\n${'─'.repeat(60)}\nce41_e2ia_accent_ink: ${pass} passed, ${fail} failed  (total ${pass + fail})\n`);
process.exit(fail ? 1 : 0);
