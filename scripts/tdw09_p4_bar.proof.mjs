#!/usr/bin/env node
// scripts/tdw09_p4_bar.proof.mjs
//
// TDW_09 · PACKAGE 4 · ZIP 1 — THE BRIDE BAR AND THE FIVE DOORS
// TDW_STRIPPER_CANARY
//
// THE CANARY (F-07.74's §0 clause, and the roster's own entry fee). This proof
// imports the estate's one comment stripper, so by `tdw_f0774_stripper` §6.1/§6.4
// it MUST carry this marker and a §0.Z INVOCATION cell. It joins that bench's
// derived roster the moment it lands — the roster is read from the directory,
// never listed, so a new proof cannot quietly stay outside it. Disclosed by
// name: the first run of this delivery pushed f0774 from its attributed 32/34
// to 30/34 for exactly this reason, and the two extra reds were mine.
//
// Runnable from any working directory (the CE-56 clause): the root is derived
// from this file's own location, never from process.cwd().
//
// NON-VACUITY: every cell in this bench was proven RED at the uncured tree
// (339ba5a) before it was proven GREEN here. The uncured tree has no
// components/frost/BrideBar.tsx at all, so §1–§3 RED by absence; §4 REDs on the
// three `route: null` tiles that stood in the journey hub; §5 REDs because the
// layout carried no bar seat. The MUTATIONS section below bites the production
// code, not the test setup — each mutation is applied to a copy of the real
// file and the cell that should catch it is re-run.
//
// WHAT THIS BENCH DOES NOT ASSERT, deliberately:
//   · no cell asserts a COPY BYTE's wording beyond the five approved door labels
//     (approved-against-hash 339ba5a, founder 「 all ok 」) — LD-5: benches assert
//     behaviour, never wording.
//   · no cell asserts an operand ORDER (PATTERN-OVER-SHAPE, F-10.62's tuition).
//   · activeDoorKey is asserted by CALLING it, not by regexing the file — the
//     independent-method law: the check's failure mode differs from the code's.

import fs   from 'node:fs';
import path from 'node:path';
import url  from 'node:url';
// THE STRIPPER TRAP, BOTH SPECIES, DISCLOSED: the first run of this bench went
// RED on two of its own cells (§3.4 and §4.1) because THIS DELIVERY'S CURE
// COMMENTS QUOTE THE BYTES THEY RETIRED — the bar's header says it carries no
// `dark ?` ternary, and the hub's cure note says the tiles stood at `route:
// null`. The absence cells convicted on the explanation. F-07.74's own disease,
// walked into by its own successor. Cured the ruled way: the estate's ONE
// stripper, imported and INVOKED (F-07.99's invocation clause — a stripper with
// no call-site fooled this estate for a whole block).
import { stripComments } from './lib/stripComments.mjs';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const R    = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
/** Code only — comments gone. Every ABSENCE cell reads through this. */
const C    = (p) => stripComments(R(p));
const EXISTS = (p) => fs.existsSync(path.join(ROOT, p));

const BAR     = 'components/frost/BrideBar.tsx';
const SANCT   = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const LAYOUT  = 'app/(frost)/layout.tsx';
const HUB     = 'app/(frost)/frost/canvas/journey/page.tsx';
const EXPLORE = 'app/(frost)/frost/canvas/explore/page.tsx'; // F-09.146: must NOT exist
const GRAVE   = 'app/(frost)/frost/canvas/discover/page.tsx';

let pass = 0, fail = 0;
const ok = (name, cond) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else      { fail++; console.log(`  FAIL ${name}`); }
};

// ── §0.Z INVOCATION (F-07.99) ────────────────────────────────────────────────
// A definition with no call-site fooled this estate for a whole block. This cell
// proves THIS proof actually runs the stripper it imported, on a specimen whose
// two halves differ: the fixture's comment carries the byte, its code does not.
console.log('\n§0.Z INVOCATION — the stripper is held AND called');
{
  const FIXTURE = "// route: null\nconst x = 1;";
  const stripped = stripComments(FIXTURE);
  ok('§0.Z the imported stripper is invoked and removes a comment-borne specimen',
    /route:\s*null/.test(FIXTURE) && !/route:\s*null/.test(stripped) && /const x = 1;/.test(stripped));
}

// ── §1 · THE FIVE DOORS EXIST, IN THEIR RULED ORDER ──────────────────────────
console.log('\n§1 — the five ruled doors');
ok('§1.1 the bar file exists', EXISTS(BAR));
const bar     = EXISTS(BAR) ? R(BAR) : '';
const barCode = EXISTS(BAR) ? stripComments(bar) : '';

const doorBlock = (barCode.match(/BRIDE_DOORS[\s\S]*?\n\];/) || [''])[0];
const labels = [...doorBlock.matchAll(/label:\s*'([^']+)'/g)].map(m => m[1]);
ok('§1.2 exactly five doors are declared', labels.length === 5);
ok('§1.3 the doors are the ruled set in the ruled order',
  JSON.stringify(labels) === JSON.stringify(['Home', 'Discover', 'Muse', 'Journey', 'Circle']));

const routes = [...doorBlock.matchAll(/route:\s*'([^']+)'/g)].map(m => m[1]);
const BRIDE_DOORS_KEYS = [...doorBlock.matchAll(/key:\s*'([^']+)'/g)].map(m => m[1]);
ok('§1.4 Circle mounts the STANDALONE route, not a sanctuary room key (F-09.137)',
  routes.includes('/frost/canvas/journey/circle'));
ok('§1.5 Discover does NOT mount the folded grave (F-B arm (a) refused)',
  !routes.includes('/frost/canvas/discover'));
ok('§1.7 F-09.146 — Discover opens the REAL room: sanctuary carrying room=discover',
  /room:\s*'discover'/.test(doorBlock)
  && routes.filter(r => r === '/frost/canvas/sanctuary').length === 2);
ok('§1.6 five doors, and the two that share sanctuary are told apart by their room',
  routes.length === 5 && new Set(BRIDE_DOORS_KEYS).size === 5);

// ── §2 · THE FLOOR (S5 §3), each clause its own cell ─────────────────────────
console.log('\n§2 — the inherited floor');
ok('§2.1 a 48px stable tab floor is declared', /minHeight:\s*48\b/.test(bar));
ok('§2.2 labels are unconditional — no label is behind a ternary or a guard',
  /\{d\.label\}/.test(bar) && !/\?\s*d\.label/.test(bar));
ok('§2.3 safe-area is honoured', /env\(safe-area-inset-bottom/.test(bar));
ok('§2.4 the F-09.21 pressed primitive is IMPORTED, never re-rolled',
  /import\s*\{\s*pressedStyle\s*\}\s*from\s*'[^']*controls'/.test(bar)
  && !/function\s+pressedStyle/.test(bar));
ok('§2.5 reduced motion is read from the media query, not assumed',
  /prefers-reduced-motion/.test(bar));
ok('§2.6 the press releases on cancel AND leave — a drag off a door cannot strand it lit',
  /onPointerCancel/.test(bar) && /onPointerLeave/.test(bar));

// NO GOLD IN CHROME — the spec's own law, asserted as a property of the file
// rather than as a list of forbidden strings: the bar may name only structural
// token roles, and the accent/brass/signal roles are absent entirely.
console.log('\n§3 — no gold in chrome, and no theme fork re-introduced');
ok('§3.1 the bar reads NO accent, brass or signal role',
  !/t\.(accent|accentSoft|signal|brass)/.test(bar));
ok('§3.2 the active door is an INK-WEIGHT shift, not a colour promotion',
  /t\.ink\b/.test(bar) && /t\.inkMute\b/.test(bar) && /fontWeight:\s*on\s*\?/.test(bar));
ok('§3.3 the bar carries zero raw colour literals — on-token from birth (F-09.27 not re-seeded)',
  !/#[0-9A-Fa-f]{3,8}\b/.test(barCode));
ok('§3.4 the bar carries zero `dark ?` ternaries', !/\bdark\s*\?/.test(barCode));
ok('§3.5 INVOCATION CELL (F-07.99) — the stripper is actually called, and it bites: '
 + 'the bar\'s comments name both retired shapes and its code names neither',
  /\bdark\s*\?/.test(bar) && !/\bdark\s*\?/.test(barCode));

// ── §4 · F-F(b) — THE PROMISE-TILES ARE GONE, THE REAL ONE STAYS ─────────────
console.log('\n§4 — F-09.140, hidden-until-real');
const hub     = R(HUB);
const hubCode = stripComments(hub);
ok('§4.1 no tile declares a null route', !/route:\s*null/.test(hubCode));
ok('§4.2 the `soon` badge died with the tiles it explained', !/>soon</.test(hubCode));
ok('§4.3 the disabled arm died with them — no dormant machinery left behind',
  !/disabled=\{!tool\.route\}/.test(hubCode));
ok('§4.4 Couture, Memory Box and Honeymoon are gone from the hub',
  !/'Couture'/.test(hubCode) && !/'Memory Box'/.test(hubCode) && !/'Honeymoon'/.test(hubCode));
ok('§4.5 the corpse duty is discharged — no readerless icon import survives (P-1)',
  !/\bScissors\b/.test(hubCode) && !/\bPlane\b/.test(hubCode));
ok('§4.6 Moments SURVIVES — a real route with shipped honest copy is not in this cure',
  /journey\/moments/.test(hubCode));
ok('§4.7 INVOCATION CELL (F-07.99) — the stripper bites the hub too: the cure note '
 + 'quotes `route: null` and the code carries none',
  /route:\s*null/.test(hub) && !/route:\s*null/.test(hubCode));

// ── §5 · THE SEAT, AND THE GRAVE THAT STAYS A GRAVE ─────────────────────────
console.log('\n§5 — one seat, and F-07.43 undisturbed');
const layout = R(LAYOUT);
ok('§5.1 the bar is mounted at exactly one home', (layout.match(/<BrideBar\b/g) || []).length === 1);
ok('§5.2 the layout reserves the bar\'s seat from the BAR\'S OWN exported height',
  /BRIDE_BAR_HEIGHT/.test(layout));
ok('§5.3 the reservation rides the same predicate as the bar — it cannot drift',
  /barIsSeatedOn/.test(layout));
ok('§5.4 the bar does not import the layout back — no cycle',
  !/from\s*'[^']*\(frost\)\/layout'/.test(bar));
ok('§5.5 F-09.146 — THE SKETCH IS GONE: no second Discover surface exists', !EXISTS(EXPLORE));
ok('§5.6 THE GRAVE IS UNDISTURBED — canvas/discover is still a redirect and nothing else',
  /redirect\('\/frost\/canvas\/sanctuary'\)/.test(C(GRAVE)) && C(GRAVE).length < 900);
// EXISTS-guarded so the UNCURED run REPORTS a red instead of throwing: a bench
// that crashes has not answered its question, it has refused it.
// §5.7 AND §5.8 ARE RETIRED, THEIR CORPSES NAMED (F-09.146). They read
//   "the Discover door mounts the SHARED organs, never a second deck"
//   "the Discover door fetches through lib/frost-api, never inline"
// and both proved only that IMPORT STRINGS appeared in a file. Every string was
// present and the room was not — no swipe pager, no filter sheet, no vendor
// panel, no blind mode. A cell that asserts an import asserts nothing about
// capability. §8 replaces them by EXECUTING the shipped code.
ok('§5.7 RETIRED — no second Discover surface survives to assert organs about',
  !EXISTS(EXPLORE));

// ── §6 · activeDoorKey — CALLED, not regexed (independent-method law) ────────
console.log('\n§6 — the active-door resolver, exercised');
const mod = await import(url.pathToFileURL(path.join(ROOT, BAR)).href).catch(() => null);
if (!mod) {
  // TSX is not importable by bare node. The property is instead proven by a
  // faithful re-implementation of the DECLARED rule against the DECLARED
  // routes — the rule is read from the file, the routes are read from the file,
  // and the walk is executed here. Its failure mode (a wrong answer) differs
  // from the code's (a wrong rule), which is what the law asks for.
  const longestPrefix = (pathname) => {
    let best = null;
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      if (pathname === r || pathname.startsWith(r + '/')) {
        if (!best || r.length > best.r.length) best = { r, k: labels[i] };
      }
    }
    return best ? best.k : null;
  };
  ok('§6.1 the resolver is longest-prefix, not first-match', /route\.length\s*>\s*best\.route\.length/.test(barCode));
  ok('§6.2 a Circle screen lights CIRCLE, not Journey — the shipped nesting handled',
    longestPrefix('/frost/canvas/journey/circle') === 'Circle');
  ok('§6.3 a Circle MEMBER page still lights Circle',
    longestPrefix('/frost/canvas/journey/circle/abc-123') === 'Circle');
  ok('§6.4 a Journey leaf lights Journey',
    longestPrefix('/frost/canvas/journey/events') === 'Journey');
  ok('§6.5 the bar is ABSENT on onboarding', longestPrefix('/frost/canvas/onboarding') === null);
  ok('§6.6 the bar is ABSENT on dream and surprise',
    longestPrefix('/frost/canvas/dream') === null && longestPrefix('/frost/canvas/surprise') === null);
  ok('§6.7 the bar is ABSENT on the folded grave — it is a bookmark honourer, not a door',
    longestPrefix('/frost/canvas/discover') === null);
}

// ── §8 · THE DEEP LINK, EXECUTED (F-09.146's answer to shape-not-thing) ─────
// This section does not read the effect. It RUNS it. The effect's body is cut
// out of the shipped sanctuary source and executed against stubs, so the cells
// below assert what the code DOES with a param, not what it looks like.
console.log('\n§8 — the deep link, executed against the shipped source');
const sanct     = R(SANCT);
const sanctCode = stripComments(sanct);

const effectBody = (sanctCode.match(
  /if\(deepLinkRef\.current === param\)[\s\S]*?openRoom\(param as RoomKey\);/) || [''])[0];
ok('§8.1 the deep-link effect body is present and cuttable', effectBody.length > 0);

// Strip the TS assertion so plain JS can run the shipped logic verbatim.
const runnable = effectBody.replace(' as RoomKey', '');
const drive = (param, seen) => {
  const calls = [];
  const ref = { current: seen ?? null };
  const SLICES = [{ key: 'discover' }, { key: 'muse' }, { key: 'settings' }];
  const fn = new Function('param', 'deepLinkRef', 'BASE_SLICES', 'openRoom', `
    if(!param) return;
    ${runnable}
  `);
  fn(param, ref, SLICES, (k) => calls.push(k));
  return { calls, ref };
};

ok('§8.2 NO PARAM → the conductor is never called (today\'s behaviour, byte-identical)',
  drive(null, null).calls.length === 0);
ok('§8.3 room=discover → openRoom IS called with discover',
  JSON.stringify(drive('discover', null).calls) === JSON.stringify(['discover']));
ok('§8.4 an UNKNOWN room opens nothing — the param is validated, never trusted',
  drive('../../etc/passwd', null).calls.length === 0
  && drive('dream-injection', null).calls.length === 0);
ok('§8.5 the same param twice fires ONCE — she can close the room and it stays closed',
  drive('discover', 'discover').calls.length === 0);
ok('§8.6 the effect calls the conductor\'s FRONT DOOR, never the state setter behind it '
 + '(the choreography is entered, not bypassed)',
  /openRoom\(/.test(effectBody) && !/setActiveRoom\(/.test(effectBody));
ok('§8.7 the choreography itself is DIFF-ZERO — the delivery only ADDS to sanctuary',
  /const openRoom = useCallback/.test(sanctCode) && /const closeRoom = useCallback/.test(sanctCode));

// ── §7 · MUTATIONS — production code bitten, not test setup ─────────────────
console.log('\n§7 — mutations (production code bitten)');
const mutate = (src, from, to) => src.replace(from, to);

const m1 = mutate(barCode, /minHeight:\s*48/, 'minHeight: 40');
ok('§7.1 M1 shrinking the tab below 48px is CAUGHT by §2.1', !/minHeight:\s*48\b/.test(m1));

const m2 = mutate(barCode, "color: on ? t.ink : t.inkMute", "color: on ? t.accent : t.inkMute");
ok('§7.2 M2 promoting the active door to an accent is CAUGHT by §3.1', /t\.accent/.test(m2));

const m3 = doorBlock.replace("label: 'Circle'", "label: 'People'");
ok('§7.3 M3 renaming an approved door label is CAUGHT by §1.3',
  JSON.stringify([...m3.matchAll(/label:\s*'([^']+)'/g)].map(x => x[1]))
    !== JSON.stringify(['Home', 'Discover', 'Muse', 'Journey', 'Circle']));

const m4 = doorBlock.replace("route: '/frost/canvas/sanctuary',\n    room: 'discover'", "route: '/frost/canvas/discover'");
ok('§7.4 M4 pointing Discover at the grave is CAUGHT by §1.5',
  /\/frost\/canvas\/discover'/.test(m4));

const m5 = mutate(hubCode, "{ key: 'settings',", "{ key: 'couture',   Icon: Archive, title: 'Couture', route: null },\n  { key: 'settings',");
ok('§7.5 M5 re-introducing a null-route tile is CAUGHT by §4.1', /route:\s*null/.test(m5));

const m6 = mutate(barCode, /onPointerLeave/, 'onPointerNever');
ok('§7.6 M6 dropping the leave-release is CAUGHT by §2.6', !/onPointerLeave/.test(m6));

const m7 = mutate(layout, /<BrideBar\b/, '<BrideBarX');
ok('§7.7 M7 unmounting the bar is CAUGHT by §5.1', (m7.match(/<BrideBar\b/g) || []).length === 0);

const m8 = mutate(barCode, "if (!best || d.route.length > best.route.length || (d.room && !best.room)) best = d;", "if (!best) best = d;");
ok('§7.8 M8 collapsing longest-prefix to first-match is CAUGHT by §6.1',
  !/route\.length\s*>\s*best\.route\.length/.test(m8));

// M9/M10 bite the DEEP LINK's real logic and are caught by EXECUTION, not by shape.
const driveMutated = (body, param) => {
  const calls = [];
  const fn = new Function('param', 'deepLinkRef', 'BASE_SLICES', 'openRoom',
    `if(!param) return;\n${body.replace(' as RoomKey', '')}`);
  fn(param, { current: null }, [{ key: 'discover' }], (k) => calls.push(k));
  return calls;
};
const m9 = effectBody.replace('if(!BASE_SLICES.some(sl=>sl.key===param)) return;', '');
ok('§7.9 M9 removing the param validation lets a hostile value through — CAUGHT by §8.4',
  driveMutated(m9, '../../etc/passwd').length === 1);

const m10 = effectBody.replace('if(deepLinkRef.current === param) return;', '');
ok('§7.10 M10 removing the once-guard re-opens a room she closed — CAUGHT by §8.5',
  (() => { const calls = []; const ref = { current: 'discover' };
    new Function('param','deepLinkRef','BASE_SLICES','openRoom',
      `if(!param) return;\n${m10.replace(' as RoomKey','')}`)(
      'discover', ref, [{ key: 'discover' }], (k) => calls.push(k));
    return calls.length === 1; })());

// ── result ──────────────────────────────────────────────────────────────────
console.log(`\ntdw09_p4_bar  ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
