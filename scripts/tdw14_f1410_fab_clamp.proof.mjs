#!/usr/bin/env node
// scripts/tdw14_f1410_fab_clamp.proof.mjs
// F-14.10 — THE CO-PLANNER MUSE FAB HUNG OFF THE RIGHT EDGE ON EVERY REAL PHONE.
//
// Runnable from any working directory; every path resolves off this file.
//
// ── THE DEFECT, AND WHY IT SURVIVED ────────────────────────────────────────
// `app/coplanner/muse/page.tsx` positioned its add button with
// `right: calc(50vw - 240px + 20px)` — centre it against the 480px content
// column (`app/coplanner/layout.tsx` — `maxWidth: 480, margin: '0 auto'`) and
// inset it 20px from that column's right edge. Correct while the viewport is
// WIDER than the column; below 440px the expression goes NEGATIVE, and
// `position: fixed` resolves it against the VIEWPORT rather than the column, so
// the button walks off the screen:
//
//     1200px  →  +380px   fine
//      480px  →   +20px   the boundary
//      374px  →   -33px   33px of a 56px control, clipped
//      360px  →   -40px   worse
//
// Every handset the co-planner is used on is under 440px. IT LOOKED CORRECT IN
// EVERY DESKTOP BROWSER, which is exactly why it lived — and why the founder's
// own phone found it and no bench had.
//
// ── WHAT THIS PROOF MAY CLAIM, AND WHAT IT MAY NOT ────────────────────────
// A bench cannot see a screen. It CANNOT claim the button looks right; it claims
// the expression can no longer resolve negative, which is the mechanical fact the
// clipping was a consequence of. The founder's device is the witness for the
// rendering, and this cell is the guard against the arithmetic returning.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(SELF), '..');
const CELLS_ONLY = process.argv.includes('--cells-only');

let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

const raw  = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; } };
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');
const code = (rel) => raw(rel)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

const MUSE   = 'app/coplanner/muse/page.tsx';
const LAYOUT = 'app/coplanner/layout.tsx';

sec('§1 — THE CLAMP');

const muse = code(MUSE);

ok('§1.1 the FAB\'s `right` is CLAMPED — it cannot resolve negative',
   /right: 'max\(20px, calc\(50vw - 240px \+ 20px\)\)'/.test(muse),
   'the unclamped column-centring is back; below 440px the control leaves the screen');

// The clamp must not have been "fixed" by throwing the column-centring away —
// that would move the button on every wide viewport to cure a narrow one.
ok('§1.2 the COLUMN-CENTRING SURVIVES — wide viewports render byte-identically',
   /calc\(50vw - 240px \+ 20px\)/.test(muse),
   'the centring was replaced rather than bounded — every desktop rendering just moved');

ok('§1.3 the 240px half-width still matches the column it centres against',
   /maxWidth: 480/.test(code(LAYOUT)),
   'the layout column is no longer 480px, so 240 is centring against a width that does not exist');

// `bottom` was checked and found correct. Asserted so a later hand cannot
// "helpfully" change it believing this finding covered it.
ok('§1.4 `bottom` is UNTOUCHED and still clears the TabBar via the safe area',
   /bottom: 'calc\(env\(safe-area-inset-bottom, 0px\) \+ 80px\)'/.test(muse));

sec('§2 — THE CENSUS: this trick has ONE home, and a second is a second bug');

// [F-SW.2] ABSENCE, walked rather than inherited. The estate had exactly one site
// using viewport-arithmetic to fake column-relative positioning. If another
// appears it will have the same hole, and nobody will find it on a desktop.
function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel, out);
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(rel);
  }
  return out;
}
const ALL = [...walk('app'), ...walk('components')];
// A `calc(50vw …)` or `calc(50% …)` that SUBTRACTS is the shape that can go
// negative. One that only adds cannot, and is not this finding's subject.
const RISKY = ALL.filter(f => /calc\(\s*50vw\s*-/.test(code(f)) || /calc\(\s*50%\s*-/.test(code(f)));
const UNCLAMPED = RISKY.filter(f => !/max\(\s*\d+px\s*,\s*calc\(\s*50(vw|%)\s*-/.test(code(f)));

console.log(`         viewport-arithmetic sites: ${RISKY.length} — ${RISKY.join(' · ') || 'none'}`);
ok('§2.1 EVERY viewport-arithmetic site is clamped — none can resolve negative',
   UNCLAMPED.length === 0,
   `unclamped: ${UNCLAMPED.join(' · ')}`);

ok('§2.2 the site count is ONE — a second would be a second bug, not a pattern',
   RISKY.length === 1 && RISKY[0] === MUSE,
   `found: ${RISKY.join(' · ')}`);

sec('§3 — THE ARITHMETIC, evaluated rather than asserted');

// The cell that actually proves the cure. `max()` is resolved here the way a
// browser resolves it, at the widths that matter, so this is a claim about
// BEHAVIOUR and not about the presence of a string.
const rightAt = (vw) => Math.max(20, (vw / 2) - 240 + 20);
for (const [vw, expected] of [[360, 20], [374, 20], [440, 20], [480, 20], [1200, 380]]) {
  ok(`§3.${vw} at ${vw}px the FAB sits ${expected}px from the right edge`,
     rightAt(vw) === expected,
     `got ${rightAt(vw)}`);
}
ok('§3.neg the clamped expression is NEVER negative at any width down to 320px',
   Array.from({ length: 881 }, (_, i) => 320 + i).every(vw => rightAt(vw) >= 20));

// The pre-cure arithmetic, kept so the finding's evidence is re-runnable and the
// number in the header is not prose.
const rightBefore = (vw) => (vw / 2) - 240 + 20;
ok('§3.was the UNCLAMPED expression really did go off-screen at 374px',
   rightBefore(374) === -33,
   `the finding's own arithmetic does not reproduce: got ${rightBefore(374)}`);

if (CELLS_ONLY) {
  console.log(`\n  cells: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

sec('§4 — MUTATION: production source broken, across a PROCESS BOUNDARY');

const ledger = [];
function mutate(rel, from, to, label) {
  const abs = path.join(ROOT, rel);
  const before = fs.readFileSync(abs, 'utf8');
  const h = sha(before);
  if (!before.includes(from)) { fail++; console.log(`  FAIL ${label}  → MUTATION TARGET ABSENT in ${rel}`); return; }
  fs.writeFileSync(abs, before.replace(from, to));
  const r = spawnSync(process.execPath, [SELF, '--cells-only'], { encoding: 'utf8' });
  fs.writeFileSync(abs, before);
  const restored = sha(fs.readFileSync(abs, 'utf8')) === h;
  ledger.push({ rel, restored });
  ok(label, r.status !== 0, 'the cells PASSED over broken production source — decorative');
  ok(`${label} · restored byte-identical`, restored);
}

mutate(MUSE, "right: 'max(20px, calc(50vw - 240px + 20px))'", "right: 'calc(50vw - 240px + 20px)'",
       '§4.M1 the clamp is removed ⇒ §1.1/§2.1 RED (the defect, restored)');
mutate(MUSE, "right: 'max(20px, calc(50vw - 240px + 20px))'", "right: '20px'",
       '§4.M2 the centring is thrown away instead of bounded ⇒ §1.2 RED');

sec('§5 — THE RESTORE LEDGER');
ok('§5.1 every mutated file was restored BYTE-IDENTICAL, checked by sha256',
   ledger.length > 0 && ledger.every(l => l.restored));

console.log('\n' + '─'.repeat(66));
console.log(`  tdw14_f1410_fab_clamp: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('─'.repeat(66));
process.exit(fail ? 1 : 0);
