// scripts/b70_r8_pulse_glass_bench.js
// TDW_19 · G4.4 · R8-2 — THE DEMAND PULSE, glass side.
// Exit code is the verdict; GREEN-line counts are not.
//
// THE SUBJECT IS `lib/worklist/pulse.ts`, IMPORTED AND RUN — never restated.
// b58's tuition, paid once and still being paid: a cell that re-implements the
// rule it is checking tests its own copy and stays green through the defect. So
// §1 and §3.1 execute the SHIPPED fold. The screen and the register are read
// textually because they are markup and data, not functions — and §2.4 exists
// precisely to stop the screen ever becoming the third place the rule lives.

const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const { stripComments } = require('./lib/stripComments.cjs');
const strip = stripComments;

let fails = 0, refusals = 0;
const refusedNames = [];
function cell(name, fn) {
  try {
    const why = fn();
    if (!why) { console.log('GREEN ' + name); return; }
    if (/^REFUSED\b/.test(why)) {
      console.log('REFUSED ' + name + ' — ' + why.replace(/^REFUSED\s*—?\s*/, ''));
      refusals++; refusedNames.push(name.split(' ')[0]);
      return;
    }
    console.log('RED   ' + name + ' — ' + why); fails++;
  } catch (e) {
    console.log('RED   ' + name + ' — threw: ' + (e && e.message));
    fails++;
  }
}

// ── LOADING THE SUBJECT ────────────────────────────────────────────────────
// The SHIPPED file is read from disk and run. Not a copy of the rule — the rule.
//
// ⚠ THE READER IS THE REPO'S OWN COMPILER, AND THE FIRST ATTEMPT WAS NOT.
// This loader was written with a hand-rolled type-stripper: a stack of regexes
// peeling `: string`, `: number`, `: { … }` off the source. It ate the
// `{ year: 'numeric' }` inside `pulseDateLabel`'s options object — a real
// VALUE that looks exactly like a type annotation to a regex — and the bench
// died on a syntax error in its own reader. It failed loudly, which was luck:
// the same class of reader that trims one character too few passes, and then
// every cell below is grading a file that is not the shipped one. b40's C5
// carries this finding almost word for word (its quote-pairing reader could not
// see a planted persona name). A bench must not contain a second implementation
// of anything, and «TypeScript, roughly» is the most tempting one to write.
// `typescript` is a dependency of this repo; it is the only correct reader.
const ts = require('typescript');
function loadPulse() {
  const src = read('lib/worklist/pulse.ts');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  // eslint-disable-next-line no-new-func
  new Function('exports', 'module', 'require', js)(mod.exports, mod, require);
  return mod.exports;
}

const P = loadPulse();
// THE VETOED BYTES, WRITTEN OUT. The register is checked AGAINST these rather
// than the other way round — a cell that reads the register and then asserts the
// register agrees with itself proves nothing.
const VETOED = {
  label:  'Last 7 days',
  one:    '1 check on 4 December',
  many:   '3 checks on 4 December',
  plus:   '48+ checks on 4 December',
  fine:   'Each check is one look at one date, not one person.',
  struck: 'This week on your page',
};
const NOUNS = { one: 'check on', many: 'checks on' };
// 2026-09-10, the sitting's date. Fixed so the year-horizon cells cannot drift
// green or red with the calendar.
const NOW = new Date('2026-09-10T00:00:00Z');

// ═══ §1 · THE RULE, EXECUTED ══════════════════════════════════════════════

cell('§1.1 the fold pluralises on the count', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const L = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 1 }, { date: '2026-12-06', checks: 3 }], truncated: false }, NOUNS, NOW);
  if (L.length !== 2) return 'expected two lines, got ' + L.length;
  if (L[0].figure !== '1' || L[0].text !== 'check on 4 December') return 'singular: ' + JSON.stringify(L[0]);
  if (L[1].figure !== '3' || L[1].text !== 'checks on 6 December') return 'plural: ' + JSON.stringify(L[1]);
  return null;
});

cell('§1.2 the `+` rides EVERY figure or none, never per-row', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const L = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 48 }, { date: '2026-12-06', checks: 31 }], truncated: true }, NOUNS, NOW);
  if (!L.every((l) => l.figure.endsWith('+'))) return 'a row escaped the +: ' + JSON.stringify(L.map((l) => l.figure));
  const F = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 48 }], truncated: false }, NOUNS, NOW);
  if (F[0].figure !== '48') return 'a + appeared on an untruncated read: ' + F[0].figure;
  return null;
});

cell('§1.3 a truncated ONE pluralises — `1+ check` is false', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const L = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 1 }], truncated: true }, NOUNS, NOW);
  // The figure means «at least one», so the noun follows the ceiling, not the floor.
  if (L[0].figure !== '1+' || L[0].text !== 'checks on 4 December') return JSON.stringify(L[0]);
  return null;
});

cell('§1.4 the year drops inside eleven months and returns beyond', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const near = P.pulseDateLabel('2026-12-04', NOW);
  const far  = P.pulseDateLabel('2028-12-04', NOW);
  const past = P.pulseDateLabel('2026-08-22', NOW);   // R-40.118 — behind us, still demand
  if (near !== '4 December')      return 'near: ' + near;
  if (far  !== '4 December 2028') return 'far: ' + far;
  if (past !== '22 August')       return 'past: ' + past;
  return null;
});

cell('§1.5 UTC — the label cannot slip a day west of Greenwich', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  // ⚠ THIS IS THE ONE THE FOUNDER'S OWN DEVICE COULD NEVER HAVE CAUGHT. India is
  // east of Greenwich, so a local-time parse renders correctly there and renders
  // 3 December for every reader west of it. The leaf paid for this once already
  // (app/v/[code]/date/page.tsx:123). Driven by moving the process, not by
  // reading the word `timeZone`.
  const tz = process.env.TZ;
  try {
    process.env.TZ = 'America/Los_Angeles';
    const fresh = loadPulse();
    if (fresh.refused) return 'REFUSED — ' + fresh.refused;
    const got = fresh.pulseDateLabel('2026-12-04', NOW);
    if (got !== '4 December') return 'in America/Los_Angeles the label reads ' + got;
  } finally {
    if (tz === undefined) delete process.env.TZ; else process.env.TZ = tz;
  }
  return null;
});

cell('§1.6 zero, null and a malformed row all yield NO lines', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const cases = [
    ['empty week', { dates: [], truncated: false }],
    ['null pulse (failed read or not yet answered)', null],
    ['undefined', undefined],
    ['a zero-count row', { dates: [{ date: '2026-12-04', checks: 0 }], truncated: false }],
    ['a row with no date', { dates: [{ checks: 3 }], truncated: false }],
  ];
  for (const [what, input] of cases) {
    const L = P.pulseLines(input, NOUNS, NOW);
    if (L.length !== 0) return what + ' produced ' + L.length + ' line(s)';
  }
  return null;
});

cell('§1.7 the card shows three rows and the WIRE is not capped to three', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const many = Array.from({ length: 9 }, (_, i) => ({ date: `2026-12-0${i + 1}`, checks: 9 - i }));
  const L = P.pulseLines({ dates: many, truncated: false }, NOUNS, NOW);
  if (L.length !== 3) return 'card depth is ' + L.length + ', expected ' + P.PULSE_CARD_ROWS;
  if (P.PULSE_CARD_ROWS !== 3) return 'PULSE_CARD_ROWS is ' + P.PULSE_CARD_ROWS;
  // The depth must be the CARD's, taken at render — never the door's. The
  // briefing rider (γ, ruled) reads the same response and may want another depth.
  const client = strip(read('lib/vendor/api/vendor.ts'));
  if (/availability\/pulse[^\n]*(slice|limit|top)/i.test(client)) return 'the client is trimming the wire';
  return null;
});

// ═══ §2 · THE SCREEN ══════════════════════════════════════════════════════

const SCREEN = 'app/vendor/(shell)/storefront/screen.tsx';

cell('§2.1 zero renders NO CARD — no label, no shell, no 0', () => {
  const s = strip(read(SCREEN));
  if (!/pulseRows\.length\s*>\s*0\s*&&/.test(s)) return 'the card is not gated on having lines';
  // The gate must wrap the LABEL too. A SectionLabel surviving an empty pulse is
  // the room announcing an absence she can already see.
  const gate = s.indexOf('pulseRows.length');
  const label = s.indexOf('COPY.storefrontPulseLabel');
  const fine  = s.indexOf('COPY.storefrontPulseFine');
  if (label === -1 || fine === -1) return 'the label or the fine line does not render';
  if (!(gate < label && gate < fine)) return 'the label or fine line renders outside the gate';
  return null;
});

cell('§2.2 the pulse is a READOUT — no tap target, no href', () => {
  const s = strip(read(SCREEN));
  const i = s.indexOf('pulseRows.length');
  const j = s.indexOf('COPY.storefrontPulseFine');
  if (i === -1 || j === -1) return 'the card block could not be located';
  const block = s.slice(i, j);
  if (/onClick|href=|<Link|role=['"]button/.test(block)) return 'the pulse card carries an interaction';
  return null;
});

cell('§2.3 a FAILED read is held apart from an empty week (F-42.53 class)', () => {
  const s = strip(read(SCREEN));
  // Both draw nothing today. The states are kept distinct in the component so
  // the day a tell is vetoed the cure is one render line — and so this room
  // does not repeat, in miniature, the very defect F-42.53 is open against it
  // for: drawing a state on a failed read with no way to tell.
  if (!/setPulseFailed\(true\)/.test(s)) return 'a failed pulse read is not recorded';
  if (!/pulseFailed/.test(s)) return 'there is no failure state at all';
  if (/setPulse\(\s*\{[^}]*dates:\s*\[\]/.test(s)) return 'a failed read is being collapsed into an empty week';
  return null;
});

cell('§2.4 the screen DECIDES nothing — the rule has one home', () => {
  const s = strip(read(SCREEN));
  if (!/pulseLines\(/.test(s)) return 'the screen does not call the shipped fold';
  const i = s.indexOf('pulseRows.length');
  const j = s.indexOf('COPY.storefrontPulseFine');
  const block = i === -1 ? '' : s.slice(i, j);
  if (/\+\s*['"]\+['"]|truncated/.test(block)) return 'the screen is deciding the + itself';
  if (/toLocaleDateString/.test(s)) return 'the screen is formatting a date itself';
  if (/checks\s*===\s*1|\bchecks?\b\s*\?/.test(block)) return 'the screen is deciding the plural itself';
  return null;
});

cell('§2.5 the read is gated on capacity_reason and runs once', () => {
  const s = strip(read(SCREEN));
  if (!/capacity_reason !== null\) return;/.test(s)) return 'the pulse is read for trades that have no date checks (F-40.172)';
  const m = s.match(/\}, \[current\.capacity_reason\]\);/);
  if (!m) return 'the pulse effect does not key on capacity_reason alone';
  // Keying on the switch would refetch on every toggle and tie a readout to a
  // control it does not depend on: flipping OFF deletes no rows, ON creates none.
  if (/\}, \[[^\]]*\b(live|on|busy)\b[^\]]*\]\);[\s\S]{0,40}fetchDatePulse/.test(s)) return 'the pulse refetches when the switch moves';
  return null;
});

// ═══ §3 · THE REGISTER ════════════════════════════════════════════════════

cell('§3.1 the composed line is byte-identical to the VETOED byte', () => {
  if (P.refused) return 'REFUSED — ' + P.refused;
  const reg = read('lib/worklist/copy.ts');
  const grab = (k) => { const m = reg.match(new RegExp(k + ":\\s*'((?:[^'\\\\]|\\\\.)*)'")); return m && m[1]; };
  const one = grab('storefrontPulseOne'), many = grab('storefrontPulseMany');
  if (!one || !many) return 'the two nouns are not in the register';
  // ⚠ COMPOSED, NOT COMPARED PIECEWISE. The founder vetoed whole SENTENCES; the
  // register holds fragments so the figure can carry the display face. This is
  // the cell that keeps those two facts from drifting: a reworded fragment that
  // still looks reasonable on its own reddens here against the vetoed sentence.
  const L = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 1 }], truncated: false }, { one, many }, NOW);
  const M = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 3 }], truncated: false }, { one, many }, NOW);
  const T = P.pulseLines({ dates: [{ date: '2026-12-04', checks: 48 }], truncated: true }, { one, many }, NOW);
  const got = [
    `${L[0].figure} ${L[0].text}`,
    `${M[0].figure} ${M[0].text}`,
    `${T[0].figure} ${T[0].text}`,
  ];
  const want = [VETOED.one, VETOED.many, VETOED.plus];
  for (let i = 0; i < 3; i++) if (got[i] !== want[i]) return `composed 「${got[i]}」, vetoed 「${want[i]}」`;
  return null;
});

cell('§3.2 the label and the fine line are the vetoed bytes', () => {
  const reg = read('lib/worklist/copy.ts');
  if (!reg.includes(`storefrontPulseLabel: '${VETOED.label}'`)) return 'the label is not the vetoed byte';
  if (!reg.includes(`storefrontPulseFine: '${VETOED.fine}'`)) return 'the fine line is not the vetoed byte';
  return null;
});

cell('§3.3 the STRUCK label is nowhere in the tree', () => {
  // A was struck at the veto because the window is ROLLING, not a calendar week.
  // A struck byte that survives anywhere is a byte that can be reinstated by a
  // one-line edit nobody reviews.
  //
  // ⚠ COMMENTS ARE STRIPPED FIRST, INCLUDING THE MOCK'S, AND THAT IS THE
  // ESTATE'S OWN COMMENT-BLINDNESS LAW RATHER THAN A CONVENIENCE. This cell's
  // first run went RED on `docs/mocks/…` — where the struck byte appears in the
  // copy sheet, beside its hash, on the line RECORDING that it was struck. A
  // textual cell cannot tell a citation from a value, so a cell that does not
  // strip punishes the file for explaining itself and teaches the next author to
  // stop writing the explanation. Same class caught the surround census at e-3,
  // one cut earlier, in this same sitting.
  const stripHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, '');
  const where = [];
  for (const f of ['lib/worklist/copy.ts', SCREEN, 'lib/worklist/pulse.ts', 'docs/mocks/storefront-pulse-mock.html']) {
    const src = f.endsWith('.html') ? stripHtml(read(f)) : strip(read(f));
    if (src.includes(VETOED.struck)) where.push(f);
  }
  if (where.length) return 'the struck byte 「' + VETOED.struck + '」 survives in: ' + where.join(', ');
  return null;
});

cell('§3.4 the pulse carries no money and no persona', () => {
  const files = ['lib/worklist/pulse.ts', SCREEN];
  for (const f of files) {
    const s = strip(read(f));
    const i = f === SCREEN ? s.indexOf('pulseRows.length') : 0;
    const block = i === -1 ? '' : s.slice(i, f === SCREEN ? s.indexOf('COPY.storefrontPulseFine') : undefined);
    // R-41.114 binds the RATE NUDGE, which is not this sitting — so the correct
    // state is no figure here at all, not a correctly formatted one.
    if (/\u20B9|\bRs\b|\bLakh\b|\bCr\b/i.test(block)) return 'a money byte appears in ' + f;
    if (/\bVictor\b|\bDonna\b|\bHarvey\b|\bDreamAi\b|\bMira\b/.test(block)) return 'a persona name appears in ' + f;
  }
  const reg = strip(read('lib/worklist/copy.ts'));
  const pulseBytes = (reg.match(/storefrontPulse\w+:\s*'((?:[^'\\]|\\.)*)'/g) || []).join(' ');
  if (/\u20B9|\bRs\b/.test(pulseBytes)) return 'a money byte is in the pulse register entries';
  return null;
});

// ═══ §4 · THE WIRE ════════════════════════════════════════════════════════

cell('§4.1 the client asks the JWT door and invents no id', () => {
  const c = strip(read('lib/vendor/api/vendor.ts'));
  if (!/'\/api\/v2\/vendor\/availability\/pulse'/.test(c)) return 'the pulse address is not the ruled one';
  const m = c.match(/fetchDatePulse\([^)]*\)/);
  if (!m || m[0] !== 'fetchDatePulse()') return 'fetchDatePulse takes an argument — the vendor must come from the JWT';
  return null;
});

cell('§4.2 the wire type has ONE home', () => {
  const c = strip(read('lib/vendor/api/vendor.ts'));
  const s = strip(read(SCREEN));
  if (!/import type \{ DatePulse \} from '@\/lib\/worklist\/pulse'/.test(c)) return 'the client restates the wire shape instead of importing it';
  if (/type DatePulse\s*=/.test(c)) return 'a second DatePulse is declared in the client';
  if (/type DatePulse\s*=/.test(s)) return 'a second DatePulse is declared in the screen';
  return null;
});

if (fails > 0) {
  console.log('\nFLOOR RED — ' + fails + ' cell(s)'
    + (refusals ? ' · ' + refusals + ' also REFUSED: ' + refusedNames.join(', ') : ''));
  process.exit(1);
}
if (refusals > 0) {
  console.log('\nFLOOR REFUSED — ' + refusals + ' cell(s) could not be read: '
    + refusedNames.join(', ') + '\nThis is NOT a pass and NOT a fail.');
  process.exit(3);
}
console.log('\nFLOOR GREEN');
process.exit(0);
