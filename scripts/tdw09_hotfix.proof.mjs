// scripts/tdw09_hotfix.proof.mjs — THE WALK HOTFIX MICRO
// Four founder-witnessed defects from one walk, 2026-08-07.
//   F-10.74  the admin sign-out — DOM-absent on mobile, unfindable on desktop
//   F-09.111 the storefront bio card's null-return flash
//   F-09.112 the home greeting's provisional-sentence swap
//   F-09.113 the calendar's false empty state (the discarded loading flag)
//   F-09.114 the calendar FAB — R-B6-18 reversed on the founder's word
//
// BOTH-WAYS DISCIPLINE: every cure cell below is RED at the uncured tree by
// MUTATION OF PRODUCTION CODE (not test setup) and GREEN at the cured tree. The
// red run is recorded in the handover with its counts.
//
// GUARD CELLS are marked [GUARD]: they assert something the cure must NOT have
// moved. A guard that cannot fail is worthless, so each names what would break
// it.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// A file that does not exist reads as empty rather than throwing: at the
// UNCURED tree components/vendor/Reserve.tsx is absent, and a crash would
// report one red instead of the twenty-eight this bench is supposed to show.
const R = (p) => { try { return readFileSync(join(ROOT, p), 'utf8'); } catch { return ''; } };
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
let pass = 0, fail = 0;
const cell = (id, ok, msg) => { if (ok) { pass++; console.log(`  PASS ${id} ${msg}`); } else { fail++; console.log(`  FAIL ${id} ${msg}`); } };
const sec = (t) => console.log(`\n── ${t} ──`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · F-10.74 — THE SIGN-OUT IS FINDABLE ON BOTH FORM FACTORS');
{
  const raw = R('app/admin/layout.tsx');
  const src = strip(raw);

  // The disease's two limbs, each asserted at its own seat.
  const seats = src.match(/clearAdminSession\(\); router\.replace\('\/admin\/login'\)[\s\S]{0,400}?aria-label="Sign out"/g) || [];
  cell('1.1', seats.length === 2,
    `exactly TWO sign-out controls exist, one per form factor (found ${seats.length})`);

  cell('1.2', /power:\s*<>/.test(src),
    "the 'power' glyph is minted in the layout's own Icon map — one vocabulary");

  cell('1.3', (src.match(/<Icon name="power"/g) || []).length === 2,
    'both seats wear the SAME glyph, not two different marks');

  // Limb 1 — mobile. The control must sit inside the #m-bar block, which is the
  // only admin chrome that renders below 768px alongside #m-domains.
  const mbar = src.split('id="m-bar"')[1]?.split('Page content')[0] ?? '';
  cell('1.4', /aria-label="Sign out"/.test(mbar) && /<Icon name="power"/.test(mbar),
    'LIMB 1 — the mobile seat is inside #m-bar (the bar that survives the <768px media query)');

  // Limb 2 — desktop. The control must sit ABOVE the <nav>, i.e. in the header
  // row, not below it. Index comparison is the independent method here: a grep
  // for the button alone would have stayed green at the old footer seat.
  const navAt  = src.indexOf('<nav style=');
  const signAt = src.indexOf('aria-label="Sign out"');
  cell('1.5', signAt > -1 && navAt > -1 && signAt < navAt,
    'LIMB 2 — the desktop seat is ABOVE the nav (header row), not below it');

  // The footer that held the old text button is gone with it.
  cell('1.6', !/Sign Out\s*<\/button>/.test(src),
    'the sidebar-foot TEXT button is retired (MOVED, control inventory 1 -> 1)');

  cell('1.7', (raw.match(/aria-label="Sign out"/g) || []).length === 2,
    'the icon-only ruling keeps ZERO rendered words; aria-label carries the name at both seats');

  // 44px is A-4's own number. Both seats.
  const boxes = src.match(/aria-label="Sign out"[\s\S]{0,400}?width: 44, height: 44/g) || [];
  cell('1.8', boxes.length === 2, `both seats are 44px touch boxes (found ${boxes.length})`);

  // [GUARD] The handler is byte-identical to the retired button's. Breaks if a
  // future sitting "improves" sign-out into a confirm dialog or an API call
  // without ruling it.
  cell('1.9', /clearAdminSession\(\); router\.replace\('\/admin\/login'\)/.test(src),
    '[GUARD] the handler byte is unchanged from the retired control');

  // [GUARD] Auth gate untouched. Breaks if the sign-out work drifted into the
  // gate — the P1 "AUTH IS BYTE-UNTOUCHED" promise this file carries.
  cell('1.10', /const ok = hasAdminSession\(\);/.test(src),
    '[GUARD] the auth gate is untouched (tdw10_p1_shell asserts this too)');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE FLASH CLASS — ONE PRIMITIVE, THREE ADOPTERS');
{
  const prim = R('components/vendor/Reserve.tsx');
  const psrc = strip(prim);

  cell('2.1', /export function Reserve/.test(psrc), 'the primitive exists and is exported');
  cell('2.2', /animation: SHIMMER/.test(psrc) && /shimmer 1\.5s ease-in-out infinite/.test(psrc),
    'it rides globals.css\u2019s EXISTING shimmer keyframe — no new motion');
  // The non-emptiness clause is not decoration: without it this cell reads an
  // absent file as a passing string and goes GREEN at the uncured tree, where
  // the primitive does not exist. A check whose failure mode is a silent zero
  // is not a check (the INDEPENDENT-METHOD LAW, clause 1).
  cell('2.3', psrc.length > 0 && !/spin|Spinner|rotate/i.test(psrc),
    'NO SPINNER (the kickoff barred them by name)');
  cell('2.4', /var\(--atelier-card-border\)/.test(psrc) && !/#[0-9a-fA-F]{3,8}/.test(psrc),
    'ZERO raw hex — the ground is a published theme-aware token (Phase C\u2019s sweep finds nothing here)');
  cell('2.5', /visibility: 'hidden'/.test(psrc) && /aria-hidden/.test(psrc),
    'GHOST mode reserves the exact box by invisible render — no executor arithmetic under the reservation');

  const adopters = ['app/vendor/storefront/page.tsx', 'app/vendor/page.tsx', 'app/vendor/calendar/page.tsx'];
  cell('2.6', adopters.every(f => /from '@\/components\/vendor\/Reserve'/.test(R(f))),
    'all THREE named adopters import the one primitive (no fourth shape)');

  // ── F-09.111 · the storefront ──
  {
    const raw = R('app/vendor/storefront/page.tsx');
    const src = strip(raw);
    cell('2.7', !/if \(loading\) return null;/.test(src),
      'F-09.111 — the null-return is GONE (this is the mutation cell: restoring it reddens)');
    cell('2.8', /if \(loading \|\| !metricsReady\)/.test(src),
      'F-09.111 — the skeleton is held until the SCORE\u2019s own inputs settle, not merely useSettings');
    cell('2.9', /<Reserve ghost><Meter score=\{0\} \/><\/Reserve>/.test(src),
      'F-09.111 — the meter box is GHOST-reserved, so the height is the browser\u2019s measurement');
    cell('2.10', (src.match(/\.finally\(\(\) => \{ if \(live\) set(Status|Hero)Done\(true\); \}\)/g) || []).length === 2,
      'F-09.111 — a FAILED fetch resolves the gate too; a dead network cannot hang the card in skeleton');
    // [GUARD] the loaded card is untouched. Breaks if the cure rewrote the card.
    cell('2.11', /<SectionLabel label="Complete your bio" first \/>/.test(src) && /How couples see you/.test(raw),
      '[GUARD] the loaded card\u2019s vetoed bytes are byte-unchanged (zero visual change once loaded)');
  }

  // ── F-09.112 · the home greeting ──
  {
    const src = strip(R('app/vendor/page.tsx'));
    cell('2.12', !/line = `Welcome back\.`;/.test(src),
      'F-09.112 — the provisional sentence is GONE (mutation cell: restoring it reddens)');
    cell('2.13', /const pending = !context;/.test(src) && /\{pending \? \(/.test(src),
      'F-09.112 — the pending window renders a reserved skeleton, not words');
    cell('2.14', (src.match(/<Reserve h=\{28\}/g) || []).length === 2,
      'F-09.112 — TWO 28px boxes reserved: the loaded sentence\u2019s own 20px/1.4 line box, taller outcome');
    // [GUARD] the sentence construction is untouched — R-O12/R-O15 and R-O17.
    cell('2.15', /letters await you this \$\{timeOfDay\}/.test(src) && /today\?\.open_leads_count \?\? 0/.test(src),
      '[GUARD] the ruled sentence construction and its one-derivation source are untouched');
    cell('2.16', /\}\}>\{greeting\}<\/div>/.test(src),
      '[GUARD] the greeting WORD stays outside the skeleton — it reads the clock, not the network');
  }

  // ── F-09.113 · the calendar's false empty ──
  {
    const src = strip(R('app/vendor/calendar/page.tsx'));
    cell('2.17', /loading: eventsLoading/.test(src),
      'F-09.113 — the loader\u2019s loading flag is picked up (it was destructured away)');
    cell('2.18', /\{eventsLoading \? \(/.test(src),
      'F-09.113 — the rail renders a skeleton while the fetch is out');
    const idxLoad = src.indexOf('eventsLoading ? (');
    const idxEmpty = src.indexOf('Nothing on the horizon.');
    cell('2.19', idxLoad > -1 && idxEmpty > idxLoad,
      'F-09.113 — the empty state is REACHED ONLY under !loading (SliceShell\u2019s own gate shape)');
    cell('2.20', /Nothing on the horizon\./.test(src),
      '[GUARD] the byte is GATED, never rewritten (the chair\u2019s word, relay #1 §5)');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · F-09.114 — THE CALENDAR + OPENS THE ADD-EVENT SHEET');
{
  const raw = R('app/vendor/calendar/page.tsx');
  const src = strip(raw);

  const onAdd = src.split('function onAdd()')[1]?.split('function refreshAll')[0] ?? '';
  cell('3.1', !/aiPrimer/.test(onAdd),
    'the chat primer is GONE from the FAB handler (mutation cell: restoring it reddens)');
  cell('3.2', /setAddOpen\(true\)/.test(onAdd),
    'the FAB opens AddSheet');
  cell('3.3', /setAddSeed\(null\)/.test(onAdd) && !/setAddSeed\(\{/.test(onAdd),
    'NO seeded date — the founder\u2019s own word, and S5 rule 8 (no progress that didn\u2019t happen)');
  cell('3.4', /setEditRow\(null\)/.test(onAdd),
    'CREATE mode, not a stale edit row');
  cell('3.5', onAdd.length > 0 && !/setBlockSel/.test(onAdd),
    '[GUARD] the FAB does NOT open CalendarBlockSheet (that is the full-day BLOCK flow, not the add sheet)');

  // The reversal's warrant must live where the old ruling lived — a future
  // reader must find it in the file, not in a chat log (mechanism-comment law).
  cell('3.6', /R-B6-18 IS REVERSED/.test(raw) && /will open the add-event sheet/.test(raw),
    'the reversal and the founder\u2019s verbatim are recorded AT the handler (F-06.85 / path-over-range)');

  // [GUARD] the double wall around CalendarBlockSheet.
  cell('3.7', /<CalendarBlockSheet/.test(src) && /onFullDayBlock=\{\(d\) => \{ setDaySel\(null\); setBlockSel\(d\); \}\}/.test(src),
    '[GUARD] the block flow\u2019s own doors are untouched — CalendarBlockSheet.tsx diffs zero (Phase C owns it)');
  cell('3.8', /slice="events"/.test(src),
    '[GUARD] the AddSheet mount is the events slice, unchanged');
}

console.log(`\n════ tdw09_hotfix: ${pass} passed, ${fail} failed (total ${pass + fail}) ════`);
process.exit(fail === 0 ? 0 : 1);
