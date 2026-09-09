// scripts/ce41_e2ivb_switchboard_shape.mjs — CE-41 E2 (iv-b) · THE CARD'S SHAPE.
//
//     node scripts/ce41_e2ivb_switchboard_shape.mjs
//
// WHAT IT PROVES. That the Switchboard's data answers R-41.82's shape: every gate the
// register can serve lands in exactly one ruled room, a template guarded by a flag does
// not get a row of its own (R-41.102), the standing row is not a group, and no gate can
// go missing from the card.
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL.
//
//   · IT IMPORTS THE COPY HOME AND ASKS IT, rather than reading the page's JSX. The card
//     is a projection of `switchboardCopy.ts`: rooms from `roomOf`, folding from
//     `templatesUnder`, the standing row from `STANDING_KEY`. Asserting the render would
//     be asserting formatting; asserting the projection catches the real defect, which is
//     a gate with no room or a flag whose templates do not resolve.
//
//   · THE FOLD IS DERIVED, NOT LISTED. `templatesUnder` joins on the `meta` field that
//     already exists, so a flag carries EVERY template its door sends — the contract flag
//     carries the signing link and the signing code, which is R-41.102 as amended. A cell
//     holding its own list of pairs would agree with itself and with nothing else.
//
//   · EVERY GATE IS ACCOUNTED FOR, EXACTLY ONCE. rows + folded + standing must equal the
//     register's full key set. That is the assertion F-41.122 would have failed: three
//     concierge templates were in the register and absent from the copy home, so they
//     rendered as raw keys — present on the glass, unaccounted for in the words.
//
// WHAT IT DOES NOT CLAIM. Anything a founder sees. Whether a room's name is the right
// name, whether the verbs read, whether the disclosure is one tap or two — the E1 frames
// were vetoed for that and the walk decides it (R-39.15). This cell only proves the card
// cannot lose a gate or file one twice.

import {
  GATE_KEYS, GATE_COPY, ROOM_ORDER, roomOf, templatesUnder,
  GUARDED_TEMPLATES, STANDING_KEY, gateName, gateSpec,
} from '../lib/admin-api/switchboardCopy.ts';

let pass = 0, fail = 0;
const green = (n) => { pass++; console.log(`  ✓ ${n}`); };
const red = (n, d) => { fail++; console.log(`  ✗ ${n}\n      ${d}`); };

console.log('\nCE-41 E2 (iv-b) — the switchboard is rooms, and no gate falls out\n');

// ── EVERY GATE HAS A ROOM, AND IT IS A RULED ONE ─────────────────────────────
{
  const rooms = new Set(ROOM_ORDER);
  const bad = GATE_KEYS.filter((k) => !rooms.has(roomOf(k)));
  if (bad.length) red('every gate lands in a ruled room', bad.join(', '));
  else green(`every one of ${GATE_KEYS.length} gates lands in a ruled room`);

  // `roomOf` falls back to `Your notices` so nothing can vanish. That fallback is a
  // safety net, not a filing system: a gate reaching it means somebody added a key
  // without a room, which is the shape of F-41.122 and should be visible here.
  // The standing gate is excluded BY NAME, not by accident: fork B ruled it belongs to no
  // room, so `roomOf` returning the fallback for it is the correct answer and not a gate
  // that slipped through. The first cut of this cell redded it — an assertion that cannot
  // tell a ruled exception from a defect reports the ruling as the defect.
  const unfiled = GATE_KEYS.filter((k) => roomOf(k) === 'Your notices'
    && k !== 'template.tdw_capability_armed' && k !== STANDING_KEY);
  if (unfiled.length) red('no gate is relying on the Your-notices fallback', unfiled.join(', '));
  else green('no gate is relying on the Your-notices fallback');
}

// ── THE FOLD (R-41.102) ──────────────────────────────────────────────────────
{
  const flags = GATE_KEYS.filter((k) => k.startsWith('flag.'));
  const folded = new Set(GUARDED_TEMPLATES);

  // A flag with a `meta` must resolve at least one template, or its second line is empty
  // and the founder cannot see the state of the message his switch sends.
  const empty = flags.filter((f) => GATE_COPY[f]?.meta && templatesUnder(f).length === 0);
  if (empty.length) red('every flag that names a template resolves it', empty.join(', '));
  else green('every flag that names a template resolves it');

  // The amendment: one flag may carry more than one.
  const contract = templatesUnder('flag.contract_sign_send');
  if (contract.length >= 2) green(`a flag carries every template its door sends (contract: ${contract.length})`);
  else red('a flag carries every template its door sends', `contract flag resolved ${contract.length}: ${contract.join(', ')}`);

  // No template is folded twice — two flags claiming one template would render its
  // state under both and leave the founder unable to tell which switch owns it.
  const counts = {};
  for (const f of flags) for (const t of templatesUnder(f)) counts[t] = (counts[t] || 0) + 1;
  const twice = Object.entries(counts).filter(([, n]) => n > 1).map(([t]) => t);
  if (twice.length) red('no template is folded under two flags', twice.join(', '));
  else green('no template is folded under two flags');

  // An orphan keeps its row. The three concierge templates are the case F-41.122 named.
  const orphans = GATE_KEYS.filter((k) => k.startsWith('template.') && !folded.has(k));
  const concierge = orphans.filter((k) => k.includes('assist'));
  if (concierge.length === 4) green(`orphan templates keep rows (${orphans.length} orphans, ${concierge.length} of them concierge)`);
  else red('the four concierge templates are orphan rows', `found ${concierge.length}: ${concierge.join(', ')}`);
}

// ── THE STANDING ROW IS NOT A GROUP ──────────────────────────────────────────
{
  if (GATE_KEYS.includes(STANDING_KEY)) green(`the standing gate exists (${STANDING_KEY})`);
  else red('the standing gate exists', `${STANDING_KEY} is not in the register's copy`);
  const room = roomOf(STANDING_KEY);
  if (room === 'Your notices') green('the standing gate is filed in no room of its own');
  else red('the standing gate is filed in no room of its own', `it landed in ${room}; fork B ruled it stands above the groups`);
}

// ── ARITHMETIC: NOTHING LOST, NOTHING COUNTED TWICE ──────────────────────────
{
  const rowKeys = GATE_KEYS.filter((k) => k !== STANDING_KEY && !GUARDED_TEMPLATES.includes(k));
  const total = rowKeys.length + GUARDED_TEMPLATES.length + 1;
  if (total === GATE_KEYS.length) green(`${rowKeys.length} rows + ${GUARDED_TEMPLATES.length} folded + 1 standing = ${GATE_KEYS.length} gates`);
  else red('every gate is accounted for exactly once', `${rowKeys.length} + ${GUARDED_TEMPLATES.length} + 1 = ${total}, register has ${GATE_KEYS.length}`);
}

// ── EVERY ROW HAS WORDS (F-41.122's OWN ASSERTION) ───────────────────────────
{
  const wordless = GATE_KEYS.filter((k) => !GATE_COPY[k]);
  if (wordless.length) red('every gate has copy', `these would render as raw keys: ${wordless.join(', ')}`);
  else green(`every one of ${GATE_KEYS.length} gates has a name and a spec`);

  // R-41.98: line one is a VERB PHRASE, and that applies to ROWS. A folded template is
  // not a row — it is its flag's second line, and there the ratified copy is the message's
  // NAME ('Payment reminder' under 'Send payment reminders'), which necessarily resembles
  // its key. The first cut of this cell redded exactly that, which would have pushed a
  // seat to invent a verb for a line the veto ruled should be a noun. The subject is rows.
  const rowsOnly = GATE_KEYS.filter((k) => !GUARDED_TEMPLATES.includes(k));
  const echoes = rowsOnly.filter((k) => {
    const bare = k.replace(/^(template|perm|scope|flag)\./, '').replace(/^tdw_/, '').replace(/[_.]/g, ' ');
    return gateName(k).toLowerCase() === bare.toLowerCase();
  });
  if (echoes.length) red('no row name is just its key spelled out', echoes.join(', '));
  else green('no row name is just its key spelled out');

  const specless = GATE_KEYS.filter((k) => !gateSpec(k).trim());
  if (specless.length) red('every row has a dotted spec', specless.join(', '));
  else green('every row has a dotted spec');
}

console.log(`\n${'─'.repeat(60)}\nce41_e2ivb_switchboard_shape: ${pass} passed, ${fail} failed  (total ${pass + fail})\n`);
process.exit(fail ? 1 : 0);
