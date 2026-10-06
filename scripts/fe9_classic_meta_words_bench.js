'use strict';
// scripts/fe9_classic_meta_words_bench.js · CE-47 · FE-9 · THE CLASSIC "WhatsApp and Instagram" ROOM IN PLAIN WORDS.
// The chair (4 Oct 2026): the classic copy home lib/worklist/metaRoom.ts still said "couple", "her" and "leads" on vendor
// glass; its lines are v2's words byte for byte now. Source only, no browser, no network.
//   1.1 IG.lede, IG.consent, IG.on and QUIET.line in the classic home equal v2's same keys, byte for byte.
//   1.2 no string in the classic home says couple(s), bride(s), her, his or leads (code comments are not glass).
//   1.3 the same over the room's readers: components/solutions/MetaRoomSections.tsx and the classic number room page.
//   1.4 CONTROL: the scanner reds on the old consent line, so 1.2 and 1.3 cannot pass by seeing nothing.
// c2 (the chair, 4 Oct 2026: the founder's rules cover both leftovers):
//   2.1 no string in the classic copy home or the classic solutions copy (lib/solutions/copy.ts) carries an em dash
//       (U+2014, written or escaped), nor the classic portfolio's H2; C4 and H2 are one line once decoded. The
//       portfolio screen's OTHER strings are outside this ruling and not scanned here.
//   2.2 no string in lib/solutions/copy.ts says couple(s), bride(s), her, his or leads; its three empty lines and the
//       Introductions row line are v2's words, byte for byte.
//   2.3 CONTROL: the em-dash scanner finds the old C4 line.
// RED MUTATION (run by the seat, restored by sha): put the old IG.consent line back in lib/worklist/metaRoom.ts -> 1.1, 1.2.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 300) + ']'}`); } }

const CLASSIC = 'lib/worklist/metaRoom.ts';
const V2 = 'v2/lib/worklist/metaRoom.ts';
const READERS = ['components/solutions/MetaRoomSections.tsx', 'app/vendor/(shell)/number/page.tsx'];
const WORDS = /\b(couples?|brides?|her|his|leads?)\b/i;

// Comments out, then every quoted string and every JSX text run between > and <.
const noComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/.*$/gm, '$1');
function strings(src) {
  const s = noComments(src); const out = [];
  for (const m of s.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) out.push(m[1] ?? m[2] ?? m[3]);
  for (const m of s.matchAll(/>([^<>{}]*[A-Za-z][^<>{}]*)</g)) out.push(m[1]);
  return out;
}
const keyOf = (src, key) => { const m = new RegExp(`^\\s*${key}:\\s*'((?:[^'\\\\]|\\\\.)*)',`, 'm').exec(src); return m ? m[1] : null; };
const hits = (list) => list.filter((x) => WORDS.test(x));

console.log('\n§1 the classic room in v2\u2019s words');
const c = read(CLASSIC); const v = read(V2);
const off = ['lede', 'consent', 'on', 'line'].filter((k) => keyOf(c, k) === null || keyOf(c, k) !== keyOf(v, k));
ok(off.length === 0, '1.1 lede, consent, on and the quiet line are v2\u2019s words, byte for byte', off.join(' '));
const h1 = hits(strings(c));
ok(h1.length === 0, '1.2 no string in the classic copy home says couple, bride, her, his or leads', JSON.stringify(h1));
const h2 = READERS.flatMap((p) => hits(strings(read(p))).map((x) => `${p}: ${x}`));
ok(h2.length === 0, '1.3 nor does any string in the room\u2019s readers (MetaRoomSections, the number room)', JSON.stringify(h2));
const OLD = "  consent: 'When a couple messages your Instagram, we reply in your studio\\u2019s name within minutes: we answer her question, take her details, and add her to your leads.',";
ok(hits(strings(OLD)).length === 1, '1.4 control: the scanner finds the old consent line');

console.log('\n§2 c2: no em dash, and the solutions copy in plain words');
const SOL = 'lib/solutions/copy.ts'; const SOL2 = 'v2/lib/solutions/copy.ts'; const PORT = 'app/vendor/(shell)/portfolio/screen.tsx';
const DASH = /\u2014|\\u2014/;
const dash = [CLASSIC, SOL].flatMap((p) => strings(read(p)).filter((x) => DASH.test(x)).map((x) => `${p}: ${x.slice(0, 80)}`));
// Each literal decoded as the compiler would (escapes resolved), so a written dash and an escaped one compare equal.
const dec = (raw, q) => Function(`return ${q}${raw}${q};`)();
const portH2 = (/H2:\s*"((?:[^"\\]|\\.)*)"/.exec(read(PORT)) || [])[1];
const c4 = keyOf(c, 'professional');
const same = portH2 !== undefined && c4 !== null && dec(portH2, '"') === dec(c4, "'");
ok(dash.length === 0 && same && !DASH.test(portH2), '2.1 no em dash in any string of the classic copy home or the solutions copy, nor in the portfolio\u2019s H2; C4 and H2 are one line', JSON.stringify({ dash, same }));
const s1 = read(SOL); const s2 = read(SOL2);
const solHits = hits(strings(s1));
const solOff = ['googleEmpty', 'seoEmpty', 'proofEmpty', 'introductions'].filter((k) => keyOf(s1, k) === null || keyOf(s1, k) !== keyOf(s2, k));
ok(solHits.length === 0 && solOff.length === 0, '2.2 the solutions copy says no couple, bride, her, his or leads; its three empty lines and the Introductions line are v2\u2019s', JSON.stringify({ solHits, solOff }));
ok(strings("  professional: 'Instagram only allows this for professional accounts \\u2014 business or creator.',").some((x) => DASH.test(x)), '2.3 control: the em-dash scanner finds the old C4 line');

console.log(`\nfe9_classic_meta_words: ${pass} pass, ${fail} fail`);
if (fail) { console.log('FAILED: ' + failed.join(' · ')); process.exit(1); }
