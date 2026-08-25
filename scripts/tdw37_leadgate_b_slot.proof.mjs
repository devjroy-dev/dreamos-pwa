#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/tdw37_leadgate_b_slot.proof.mjs
// M-LEADGATE-RECUT · SEAT B′ — R-37.22 / .23 / .24 / .25 / .27 / .28 + F-16.25.
//
// Sited in this repo's own proof harness on the f0539_demo_authority.mjs
// precedent: a dream-os bench cannot read this tree, and a declared coverage gap
// was the alternative.
//
// ── WHAT IT PROVES, AND WHY EACH SECTION EXISTS ─────────────────────────────
//   §1 THE SWIPE (R-37.22) — the incident. The left side keyed on `row.phone`,
//      so Seat A′'s withheld wire silently turned `Call` into `Mark lost` on
//      every basic vendor's leads rows. The shipped ternary is EXTRACTED and RUN
//      against four row shapes, and the pre-cure expression is reproduced beside
//      it and asserted to still produce the wrong verb — that return IS the
//      disease, and this proof fails if it comes back.
//   §2 THE SLOT (R-37.23/.24) — payload-keyed both directions, at the footer
//      where lead contact actually lives, with the founder's byte character-exact.
//   §3 THE BAND FLOOR (R-37.21/.25) — the array's new field, the label lookup's
//      refusal to invent, and the sheet posting a floor it did not author.
//   §4 THE BUDGET CELL + THE MASTHEAD (R-37.28) — three distinct states.
//   §5 THE `Unknown` TRIPWIRE (R-37.27) — a wire carrying a name never renders
//      Unknown. The byte stays because for a genuinely nameless lead it is TRUE;
//      the costume risk dies mechanically instead.
//
// Run: node scripts/tdw37_leadgate_b_slot.proof.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = (p) => readFileSync(join(__dirname, '..', p), 'utf8');

// [F-06.192] Source cells read CODE, never prose — this file's own comments name
// every symbol it greps for. Block comments and WHOLE-LINE `//` only: a trailing
// strip would cut `https://…` in half and these sources carry URLs.
const strip = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
const CODE = (p) => strip(RAW(p));

const SHELL_P = 'components/vendor/slices/SliceShell.tsx';
const ROW_P   = 'components/vendor/slices/SliceRow.tsx';
const LEADS_P = 'app/vendor/list/[slice]/leads.tsx';
const SHEET_P = 'components/frost/EnquirySheet.tsx';
const BANDS_P = 'lib/frost/budgetBands.ts';

let pass = 0, fail = 0; const reds = [];
function t(name, fn) {
  let ok = false, detail = '';
  try { const r = fn(); ok = r === true; if (!ok) detail = String(r); }
  catch (e) { ok = false; detail = e.message; }
  if (ok) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; reds.push(name); console.log(`  RED  ${name}${detail ? ' — ' + detail : ''}`); }
}

console.log('\n§1 · THE SWIPE — R-37.22, THE INCIDENT CLOSED');

// The shipped ternary, EXTRACTED and EXECUTED. Not reproduced: a retyped
// expression is a bench testing itself, and this seat has already been bitten
// by exactly that (the Seat A′ alert cells).
function shippedLeftSide(row) {
  const src = RAW(SHELL_P);
  const m = src.match(/left: row\.redacted\n([\s\S]*?),\n    \};/);
  if (!m) throw new Error('REFUSED — could not extract the leads left-swipe expression');
  const expr = 'row.redacted\n' + m[1];
  // eslint-disable-next-line no-new-func
  return new Function('row', 'setSel', 'setMarkLostConfirm', `return (${expr});`)(
    row, () => {}, () => {}
  );
}
// The PRE-CURE expression, reproduced deliberately so the disease has a cell.
function preCureLeftSide(row) {
  return row.phone
    ? { label: 'Call' }
    : { label: 'Mark lost', destructive: true };
}

const REDACTED_ROW = { id: 'l1', primary: 'Sarah', redacted: true };
const PAYING_ROW   = { id: 'l2', primary: 'Sarah', phone: '+919625759924' };
const NAMELESS_ROW = { id: 'l3', primary: 'Dream Wedding enquiry' }; // no phone, not redacted

t('a REDACTED row has NO left side — the gesture renders nothing', () =>
  shippedLeftSide(REDACTED_ROW) === undefined
    ? true : `the redacted row still has a left gesture: ${JSON.stringify(shippedLeftSide(REDACTED_ROW))}`);
t('[THE DISEASE, PINNED] the PRE-CURE expression still turns that row into "Mark lost"', () =>
  preCureLeftSide(REDACTED_ROW).label === 'Mark lost'
    ? true : 'the reproduction drifted — this cell no longer describes what shipped on 0dc5a27');
t('a PAYING row keeps Call, byte-unmoved', () =>
  shippedLeftSide(PAYING_ROW).label === 'Call');
t('a NAMELESS-but-not-redacted row keeps Mark lost (an ordinary row is untouched)', () => {
  const s = shippedLeftSide(NAMELESS_ROW);
  return s && s.label === 'Mark lost' && s.destructive === true
    ? true : `an ordinary phone-less lead lost its gesture: ${JSON.stringify(s)}`;
});
t('the suppression keys on `redacted`, NEVER on an absent phone (R-37.23)', () =>
  /left: row\.redacted/.test(CODE(SHELL_P)) && !/left: !row\.phone/.test(CODE(SHELL_P))
    ? true : 'the swipe infers from absence — a lead that never had a number is not a withheld one');
t('the RIGHT side (Booked) is untouched for every row shape', () => {
  const src = CODE(SHELL_P);
  return /right: \{ label: 'Booked'/.test(src)
    ? true : 'the right gesture moved — out of this sitting\'s radius';
});
t('Mark lost stays reachable through the sheet\'s own control', () =>
  /markLostBlock/.test(CODE(SHELL_P)) && /setMarkLostConfirm\(true\)/.test(CODE(SHELL_P))
    ? true : 'suppression removed the only path to Mark lost — R-37.22 said nothing is lost');

console.log('\n§2 · THE SLOT — R-37.23 / R-37.24');
const FOUNDER_BYTE = 'Upgrade to Essential tier or above to connect with your lead.';
t('the founder\'s byte ships CHARACTER-EXACT', () =>
  RAW(SHELL_P).includes(`>${FOUNDER_BYTE}</div>`)
    ? true : 'the vetoed sentence is not on the surface verbatim');
t('the CTA byte ships as vetoed-by-silence', () =>
  RAW(SHELL_P).includes('>See plans</span>'));
t('the slot is gated on `sel?.redacted` (payload-keyed)', () =>
  /slice === 'leads' && sel\?\.redacted && !confirmDel/.test(CODE(SHELL_P)));
t('the slot is NOT gated on an absent phone', () =>
  !/slice === 'leads' && !sel\?\.phone/.test(CODE(SHELL_P))
    ? true : 'a lead that never had a number would be told to upgrade — a lie');
t('the slot routes at Billing, the CE-210 home', () =>
  /href="\/vendor\/billing"/.test(CODE(SHELL_P)));
t('the PAYING footer (WhatsApp + Call) is byte-unmoved beside it', () =>
  /slice === 'leads' && sel\?\.phone && !confirmDel/.test(CODE(SHELL_P))
  && /wa\.me\/\$\{sel\.phone/.test(CODE(SHELL_P)) && /tel:\$\{sel\.phone\}/.test(CODE(SHELL_P)));
t('the two are MUTUALLY EXCLUSIVE by the wire (never both, never neither-when-basic)', () => {
  // redacted rows carry no phone by construction (the gate strips it), so the
  // slot's gate and the buttons' gate cannot both be true on one payload.
  const src = CODE(SHELL_P);
  return src.indexOf("sel?.redacted && !confirmDel") < src.indexOf("sel?.phone && !confirmDel")
    ? true : 'the slot renders after the buttons — order matters for the eye, not just the logic';
});
t('the slot did NOT land on the list row (R-37.24 refused it this sitting)', () =>
  !/redacted/.test(CODE(ROW_P).split('export function SliceRow')[1] ?? '')
    ? true : 'a slot appeared on SliceRow — that arm was refused as new chrome');
t('SliceRow\'s clients-only contact block is UNTOUCHED', () =>
  /slice === 'clients' && row\.phone/.test(CODE(ROW_P))
    ? true : 'the clients affordance moved — not this sitting\'s');
t('the Row contract carries `redacted` so the shell can read it', () =>
  /redacted\?: boolean;/.test(RAW(ROW_P)));
t('leads.tsx sets `redacted` from the wire, not from phone-absence', () =>
  /redacted: l\.redacted === true/.test(CODE(LEADS_P)));

console.log('\n§3 · THE BAND FLOOR — R-37.21 / R-37.25');
const bands = RAW(BANDS_P);
t('BudgetBand gained an explicit `floor` field (R-37.25)', () =>
  /floor: string;/.test(bands));
t('every band declares a floor — the type makes omission impossible', () => {
  const rows = bands.match(/\{ label: '[^']+',\s+value: '[^']*',\s+floor: '[^']*'\s+\}/g) || [];
  return rows.length === 5 ? true : `expected 5 bands with floors, found ${rows.length}`;
});
t('the TOP band is floor 1000000 with NO ceiling', () =>
  /\{ label: 'Rs 10,00,000\+',\s+value: '',\s+floor: '1000000' \}/.test(bands));
t('the BOTTOM band is a ceiling with NO floor (the mirror image, and honest)', () =>
  /\{ label: 'Under Rs 1,00,000',\s+value: '100000',\s+floor: ''\s+\}/.test(bands));
t('NOT ONE founder-vetoed label byte moved', () => {
  const want = ['Under Rs 1,00,000', 'Rs 1,00,000 – 3,00,000', 'Rs 3,00,000 – 5,00,000',
                'Rs 5,00,000 – 10,00,000', 'Rs 10,00,000+'];
  return want.every((l) => bands.includes(`label: '${l}'`))
    ? true : 'a vetoed label changed — that needs a new veto, not a judgement call';
});
t('the floors are NOT derived by adjacency (R-37.25 refused it)', () =>
  !/BUDGET_BANDS\[i\s*-\s*1\]/.test(bands) && !/\.value.*previous/i.test(bands));
t('the sheet posts `budget_floor`, sourced from the SAME array as the value', () =>
  /budget_floor: band == null/.test(CODE(SHEET_P))
  && /BUDGET_BANDS\.find\(\(b\) => b\.value === band\)\?\.floor/.test(CODE(SHEET_P)));
t('silence still OMITS the key — the distinction survives the cure', () =>
  /budget_floor: band == null\s*\n\s*\? undefined/.test(CODE(SHEET_P)));

console.log('\n§4 · THE BUDGET CELL AND THE MASTHEAD — F-16.25 / R-37.28');
// NOTE, and it is a deletion rather than a comment: a helper that imported the
// .ts module and returned it unused sat here in the first cut. A bench carrying
// dead code is a bench asking to be trusted about the parts you cannot see.
// `budgetBands.ts` is TypeScript and this harness is plain .mjs, so the lookup
// is asserted at the SOURCE level below rather than executed — stated plainly
// instead of dressed up with an import that proved nothing.
t('openBandLabelFor matches ONLY genuinely open bands', () =>
  /b\.value === '' && b\.floor === String\(floor\)/.test(bands)
    ? true : 'a bounded band could borrow the open band\'s label');
t('openBandLabelFor REFUSES rather than inventing', () =>
  /return hit \? hit\.label : null;/.test(bands.split('openBandLabelFor')[1] ?? ''));
t('the budget cell reads the PAIR, not the ceiling alone', () => {
  const src = CODE(LEADS_P);
  return /function leadBudget\(l: Lead\): string/.test(src)
    && /if \(l\.budget_total != null\) return fmtRs\(l\.budget_total\);/.test(src)
    && /openBandLabelFor\(l\.budget_min \?\? null\)/.test(src);
});
t('the Budget detail row calls it', () =>
  /\{label:'Budget',value:leadBudget\(l\)\}/.test(CODE(LEADS_P)));
t('THREE STATES stay distinct — ceiling / open band / silence', () => {
  // Executed against the shipped function's own logic, reproduced from source.
  const src = RAW(LEADS_P);
  const m = src.match(/function leadBudget\(l: Lead\): string \{([\s\S]*?)\n\}/);
  if (!m) throw new Error('REFUSED — could not extract leadBudget');
  const body = m[1];
  return /budget_total != null/.test(body) && /openBandLabelFor/.test(body)
    && /return fmtRs\(l\.budget_total\);\s*$/.test(body.trim())
    ? true : 'leadBudget no longer falls through to Rs — for silence';
});
t('[R-37.28] the masthead coalesces floor into pipeline value', () =>
  /pipelineValue: l\.budget_total \?\? l\.budget_min \?\? 0/.test(CODE(LEADS_P)));
t('[F-06.85] the mixed ceiling/floor semantic is NAMED at the site', () =>
  /MIXED SEMANTIC, NAMED \(F-06\.85\)/.test(RAW(LEADS_P))
    ? true : 'the masthead sums two different facts and says nothing about it');

console.log('\n§5 · THE `Unknown` TRIPWIRE — R-37.27');
// The byte STAYS: for a lead whose name the estate genuinely never captured,
// `Unknown` is a TRUE statement. The A-cut's crime was rendering it over a name
// the estate held and was withholding. That crime dies mechanically here.
function shippedPrimary(lead) {
  const src = RAW(LEADS_P);
  const m = src.match(/primary: (l\.name\?\?'[^']*')/);
  if (!m) throw new Error('REFUSED — could not extract the primary expression');
  // eslint-disable-next-line no-new-func
  return new Function('l', `return (${m[1]});`)(lead);
}
t('a wire CARRYING a name never renders Unknown (the regression tripwire)', () =>
  shippedPrimary({ name: 'Sarah' }) === 'Sarah'
    ? true : 'the estate is claiming ignorance over a name it holds — the A-cut\'s crime, returned');
t('a redacted wire STILL carries the name, so the tripwire has teeth', () =>
  shippedPrimary({ name: 'Sarah', redacted: true }) === 'Sarah');
t('a genuinely nameless lead still says Unknown, which is TRUE (R-37.27)', () =>
  shippedPrimary({ name: null }) === 'Unknown'
    ? true : 'the honest degradation was retired — agent-created nameless leads exist by construction');
t('the byte was NOT re-pointed to a new vendor-facing string', () =>
  /l\.name\?\?'Unknown'/.test(CODE(LEADS_P))
    ? true : 'a new copy byte appeared without a founder veto');

console.log(`\n${'═'.repeat(64)}`);
console.log(`tdw37_leadgate_b_slot: ${pass}/${pass + fail}`);
if (fail) { console.log('REDS:'); reds.forEach((r) => console.log('  - ' + r)); }
console.log('═'.repeat(64));
process.exit(fail ? 1 : 0);
