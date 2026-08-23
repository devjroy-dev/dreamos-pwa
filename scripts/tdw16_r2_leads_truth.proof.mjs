#!/usr/bin/env node
// scripts/tdw16_r2_leads_truth.proof.mjs
// TDW_16 · R2-PWA — L1 (the ENQUIRED VIA TDW row) and L2 (fmtArrival's IST home).
//
// WHY A NEW BENCH RATHER THAN CELLS BOLTED ONTO A NEIGHBOUR: L1 and L2 are one
// law seen twice — "the sheet tells the truth about the right event, in the
// right timezone, through one home". tdw09_* benches are the type/theme lanes
// and tdw10_* is billing; hanging this there would aim a true cell one surface
// over, which is CE-119's named error. It joins the floor by the glob in
// scripts/run-floor.sh by existing, which is that file's whole design.
//
// ── BOTH-WAYS (mutations on PRODUCTION source, comments stripped) ────────────
//   M1  SliceRow: restore `d.toLocaleDateString('en-IN', …)`      -> 2.1
//       (ledger CORRECTED to the run: I predicted 2.1 AND 2.2 and the run said
//        2.1 alone. The mutation inserts an early return, so `istDayKey` and
//        `.exec(key)` survive as DEAD CODE and 2.2 — a source-presence cell —
//        stays green over them. 2.2's real job is the key-vs-raw swap, which M2
//        proves; the unreachable-code case belongs to 2.1 and is covered there.
//        The ledger records what the run output, never what I expected.)
//   M2  SliceRow: slice the RAW iso instead of the IST key
//       (arm 1, refused by ruling — the UTC-day wrongness)         -> 2.2
//   M3  SliceRow: inline a second IST offset constant instead of
//       importing istDayKey (a second semantic)                    -> 2.3
//   M4  leads.tsx: drop the `l.tdw === true` gate so the row
//       renders on unbadged leads with an em-dash                  -> 1.2
//   M5  leads.tsx: read `l.created_at` into the new row (the
//       F-16.22 defect, restored on the row built to cure it)      -> 1.3
//   M6  leads.tsx: reword the label                                -> 1.1 1.3 1.5
//       (ledger CORRECTED: I predicted 1.1 alone. Three cells key on the same
//        literal, so a reword cascades. That is over-coupling, not a defect —
//        the byte IS the anchor — but it is recorded so a future seat reading
//        three reds knows it is looking at ONE cause.)
//   M7  types: delete `tdw_enquired_at` from the Lead interface
//       (F-04.10's mapper half, on the type side)                  -> 1.4
//   M8  leads.tsx: put the row ABOVE `Arrived`                     -> 1.5
//   M9  SliceRow: give the new row its own date formatter          -> 2.4

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
// A cell satisfiable by a comment is not a cell. Every assertion below reads
// stripped source; the one exception is the copy pin, which reads RAW on
// purpose (see 1.1).
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

let pass = 0, fail = 0; const fails = [];
const ok = (id, cond, why = '') => {
  if (cond === true) { pass++; console.log(`  ok   ${id}`); }
  else { fail++; fails.push(id); console.log(`  FAIL ${id}${why ? ` — ${why}` : ''}`); }
};
const H = (t) => console.log(`\n── ${t} ──`);

const LEADS_RAW = R('app/vendor/list/[slice]/leads.tsx');
const LEADS = strip(LEADS_RAW);
const ROW_RAW = R('components/vendor/slices/SliceRow.tsx');
const ROW = strip(ROW_RAW);
const TYPES = strip(R('lib/vendor/types/vendor.ts'));

console.log('════════════════════════════════════════════════════════════');
console.log('TDW_16 R2 · THE LEADS TRUTH — L1 the row, L2 the timezone');
console.log('════════════════════════════════════════════════════════════');

H('§1 · L1 — the ENQUIRED VIA TDW row');

// RAW, not stripped, and deliberately: this is the founder's byte (2026-08-22),
// frozen at the character. A copy pin that tolerated a reworded comment would
// tolerate a reworded label, which is the thing it exists to refuse.
ok('1.1 the founder byte is present, character-exact',
  LEADS_RAW.includes("label:'ENQUIRED VIA TDW'"),
  'the label has drifted from the byte the founder froze on 2026-08-22');

ok('1.2 the row is LINKAGE-GATED — it does not render on an unbadged lead',
  /l\.tdw === true \?/.test(LEADS) && /\.\.\.\(l\.tdw === true \?/.test(LEADS),
  'an ungated row would put an em-dash under ARRIVED on every WhatsApp-only lead');

ok('1.3 it reads the SPINE\'s clock, never the lead\'s birthday',
  /label:'ENQUIRED VIA TDW',value:fmtArrival\(l\.tdw_enquired_at\)/.test(LEADS)
  && !/label:'ENQUIRED VIA TDW',value:fmtArrival\(l\.created_at\)/.test(LEADS),
  'F-16.22 restored on the very row built to cure it');

// F-04.10 was born on this handler's dream-os twin: the SELECT carried a field
// the mapper dropped, and the read-row could only render an em-dash. Its law
// binds both ends. The type is this side's mapper half — a wire the interface
// cannot see is no wire at all.
ok('1.4 the wire type admits the field (F-04.10, the type half)',
  /tdw_enquired_at\?:\s*string \| null;/.test(TYPES),
  'the field ships from dream-os and the pwa cannot see it');

// ORDER IS THE POINT, not decoration. 5 Aug is when this LEAD was born; 21 Aug
// is when the ENQUIRY came. Read in that order the two lines are a story; read
// in the other they are a contradiction.
{
  const arrived = LEADS.indexOf("label:'Arrived'");
  const tdwRow  = LEADS.indexOf("label:'ENQUIRED VIA TDW'");
  ok('1.5 it sits directly UNDER Arrived, as ruled',
    arrived > -1 && tdwRow > arrived && !/label:'Wedding date'[\s\S]{0,80}label:'ENQUIRED VIA TDW'/.test(LEADS),
    `Arrived@${arrived} vs row@${tdwRow}`);
}

// F-04.7's fence: this is a read-row. The delivery may render on it and may not
// grow an editor on it.
ok('1.6 the sheet stays display-only — F-04.7\'s fence held',
  /F-04\.7 read-row \(display-only, CE fence\)/.test(LEADS_RAW)
  && !/onChange|contentEditable|<input/.test(LEADS),
  'an editor grew on the read-row');

H('§2 · L2 — fmtArrival on the estate\'s one IST home');

ok('2.1 no locale API is called — the siblings\' convention, in substance',
  !/toLocaleDateString|toLocaleString/.test(ROW),
  'a locale call\'s output depends on the runtime\'s ICU data, server vs client');

ok('2.2 the date is taken from the IST calendar-day key, not the raw instant',
  /const key = istDayKey\(d\)/.test(ROW) && /\.exec\(key\)/.test(ROW),
  'slicing the raw ISO renders the UTC day — arm 1, refused by ruling');

// R-35.23's cure for F-15.17 is the one IST semantic in this estate. A second
// offset constant here would be a second semantic, which is the disease that
// finding names.
ok('2.3 it reaches the ONE home rather than minting a second semantic',
  /import \{ istDayKey \} from '@\/lib\/frost\/tokens'/.test(ROW)
  && !/5\.5 \* 60 \* 60 \* 1000/.test(ROW),
  'a second IST offset was inlined here — R-35.23 exists to prevent exactly that');

// ONE formatter for both dates. `tdw_enquired_at` must not be born with a third
// date path, or the two lines of the story can drift apart by a day.
{
  const calls = (LEADS.match(/fmtArrival\(/g) || []).length;
  const others = /fmtDate\(l\.tdw_enquired_at|toLocale/.test(LEADS);
  ok('2.4 both dates on the sheet read through the SAME formatter',
    calls >= 3 && !others, `fmtArrival calls: ${calls}`);
}

console.log(`\n${'═'.repeat(60)}`);
console.log(`tdw16_r2_leads_truth: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
if (fail) console.log(`failed cells: ${fails.join(' · ')}`);
console.log(fail === 0 ? 'GREEN' : 'RED');
console.log('═'.repeat(60));
process.exit(fail === 0 ? 0 : 1);
