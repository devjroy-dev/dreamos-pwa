#!/usr/bin/env node
// scripts/tdw09_p4_zip2.proof.mjs
//
// TDW_09 · PACKAGE 4 · ZIP 2 — THE CLEARANCE, THE TWO-WAY LINK, THE HIT TARGET
// F-09.145 · F-09.147 · F-09.148, plus C-1 and C-2 (the two catches the
// read-first found statically, before a byte).
// TDW_STRIPPER_CANARY
//
// THE CANARY (F-07.74 §0, and the roster's entry fee). This proof imports the
// estate's one comment stripper, so it carries the marker above and the §0.Z
// INVOCATION cell below. It joins f0774's derived roster the moment it lands.
//
// Runnable from any working directory (CE-56): the root is derived from this
// file's own location, never from process.cwd().
//
// THE SEAT'S FOUNDING LAW, F-09.146: capability-not-shape. A cell must fail when
// the THING breaks, not when its name disappears. So of the sections below:
//   §4 CUTS `clearRoomParam` out of the shipped source and RUNS it against a
//      fake location/history — the cells assert what the URL BECOMES.
//   §5 CUTS the popstate handler and RUNS it — the cell asserts which string
//      the sentinel actually carries.
//   §6 CUTS the deep-link effect and DRIVES it open→close→open — the cell
//      asserts the door opens a second time.
//   §2/§3/§7 are arithmetic over values PARSED from the shipped source; the
//      numbers are never re-typed here, so a drift in the code moves the sum.
// Only §1's one-home cells are absence-shaped, and they read through the
// stripper so a cure COMMENT cannot satisfy them.
//
// NON-VACUITY (both-ways, at the uncured tree e4d07f5):
//   §1.2/§1.3 RED — BRIDE_BAR_CLEARANCE does not exist there.
//   §2.*      RED — the shell carries no paddingBottom and the room container
//                   is `inset:0`; the arithmetic puts the panel under the bar.
//   §4.*      RED — `clearRoomParam` is absent, the cut is empty.
//   §5.*      RED — the handler pushes the mount-captured `url`.
//   §6.3      RED — the second open never fires (this is C-2, and it is the one
//                   cell that is red at the UNCURED tree *and* would have been
//                   red on a naive M1b cure that shipped the sync alone).
//   §7.*      RED — the control is `padding:0` with no pressed state.

import fs   from 'node:fs';
import path from 'node:path';
import url  from 'node:url';
import { stripComments } from './lib/stripComments.mjs';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const R    = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const C    = (p) => stripComments(R(p));

const BAR    = 'components/frost/BrideBar.tsx';
const SHELL  = 'components/frost/CanvasShell.tsx';
const LAYOUT = 'app/(frost)/layout.tsx';
const SANCT  = 'app/(frost)/frost/canvas/sanctuary/page.tsx';

let pass = 0, fail = 0;
const ok = (name, cond) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else      { fail++; console.log(`  FAIL ${name}`); }
};

const barCode   = C(BAR);
const shellCode = C(SHELL);
const sanctCode = C(SANCT);
const sanctRaw  = R(SANCT);

// ── §0.Z INVOCATION (F-07.99) ────────────────────────────────────────────────
// A definition with no call-site fooled this estate for a whole block.
console.log('\n§0.Z INVOCATION — the stripper is held AND called');
{
  const FIXTURE = "// paddingBottom:BRIDE_BAR_CLEARANCE\nconst x = 1;";
  const stripped = stripComments(FIXTURE);
  ok('§0.Z the imported stripper is invoked and removes a comment-borne specimen',
    /BRIDE_BAR_CLEARANCE/.test(FIXTURE) && !/BRIDE_BAR_CLEARANCE/.test(stripped) && /const x = 1;/.test(stripped));
}

// ── §1 · THE CLEARANCE HAS ONE HOME AND IS DERIVED, NOT TYPED ───────────────
console.log('\n§1 — one constant, one home (F-09.145)');
const heightM = barCode.match(/export const BRIDE_BAR_HEIGHT\s*=\s*(\d+)/);
ok('§1.1 the bar still exports its height as a number', !!heightM);
const BAR_H = heightM ? Number(heightM[1]) : NaN;

const clearM = barCode.match(/export const BRIDE_BAR_CLEARANCE\s*=\s*(.+)/);
ok('§1.2 the bar exports ONE clearance expression', !!clearM);
const CLEAR_EXPR = clearM ? clearM[1] : '';
ok('§1.3 the clearance is DERIVED from the height and carries the device inset — no re-typed number',
  /\$\{BRIDE_BAR_HEIGHT\}/.test(CLEAR_EXPR)
  && /env\(safe-area-inset-bottom/.test(CLEAR_EXPR)
  && !/\b\d\d\b/.test(CLEAR_EXPR.replace(/0px/g, '')));

// Every consumer reads the export. A second hand-rolled calc anywhere in the
// four files is the disease this constant exists to prevent.
const consumers = [[SHELL, shellCode], [LAYOUT, C(LAYOUT)], [SANCT, sanctCode]];
ok('§1.4 every clearance consumer reads the export, and none re-rolls the calc',
  consumers.every(([, code]) =>
    !new RegExp(`calc\\(\\s*${BAR_H}px\\s*\\+\\s*env\\(safe-area-inset-bottom`).test(code)));
ok('§1.5 all three consumers are wired to the one home',
  consumers.every(([, code]) => /BRIDE_BAR_CLEARANCE/.test(code)));

// ── §2 · THE TWO CLEARANCES, AS GEOMETRY ────────────────────────────────────
// Not "the property appears" — the panel's floor is COMPUTED from the shipped
// values and compared to the bar's ceiling, at two device insets.
console.log('\n§2 — the panel clears the bar, by arithmetic (F-09.145)');

const rootStyle = (sanctCode.match(/<div style=\{\{position:'fixed',inset:0,background:bg,[^]*?\}\}>/) || [''])[0];
ok('§2.1 the sanctuary shell claims the clearance on ITSELF (the founder-witnessed patient)',
  /paddingBottom:\s*BRIDE_BAR_CLEARANCE/.test(rootStyle));
ok('§2.2 the shell stays FULL-BLEED — padding, not a shorter box, so the bar\'s glass has this surface to blur',
  /position:'fixed',inset:0/.test(rootStyle));

const bloomStyle = (sanctCode.match(/className=\{closing \? 'bloom-exit' : 'bloom-enter'\}[^]*?zIndex:100/) || [''])[0];
ok('§2.3 the room container carries its OWN clearance — an absolute child resolves against the PADDING box, so the shell\'s padding cannot reach it',
  /bottom:\s*BRIDE_BAR_CLEARANCE/.test(bloomStyle) && !/inset:0/.test(bloomStyle));
ok('§2.4 the derived patient is cured too — CanvasShell claims the same clearance',
  /paddingBottom:\s*BRIDE_BAR_CLEARANCE/.test(shellCode));

// The arithmetic. viewport floor = 0, everything measured up from it.
//
// B-1, SELF-CAUGHT AND DISCLOSED: the first draft of this section fed the
// geometry a CONSTANT clearance and was therefore GREEN at the uncured tree —
// a vacuous cell, which this estate rates worse than a declared gap. The room
// container's bottom edge is now RESOLVED OUT OF THE SHIPPED STYLE, so the sum
// moves when the code moves. `inset:0` resolves to the viewport floor; the
// clearance token resolves to the bar's ceiling; anything else is NaN and reds.
const CLEAR_PX = (safeInset) => BAR_H + safeInset;  // what the shipped expression evaluates to
const roomFloorFromSource = (style, safeInset) => {
  if (/bottom:\s*BRIDE_BAR_CLEARANCE/.test(style)) return CLEAR_PX(safeInset);
  if (/inset:0/.test(style))                        return 0;
  const lit = style.match(/bottom:(\d+)/);
  return lit ? Number(lit[1]) : NaN;
};
const geometry = (safeInset, roomBottomPx) => {
  const barCeiling = BAR_H + safeInset;             // the bar's top edge
  const panelFloor = roomBottomPx;                  // panel is bottom:0 inside the deck
  return { barCeiling, panelFloor, clears: panelFloor >= barCeiling };
};

for (const inset of [0, 34]) {
  const shipped = geometry(inset, roomFloorFromSource(bloomStyle, inset));
  ok(`§2.5 at safe-area ${inset}px the SHIPPED room container puts the vendor panel's last row at or above the bar's ceiling (${shipped.panelFloor} >= ${shipped.barCeiling})`,
    shipped.clears);
  const uncured = geometry(inset, roomFloorFromSource("position:'absolute',inset:0,zIndex:100", inset));
  ok(`§2.6 at safe-area ${inset}px the inset:0 form is convicted by the same arithmetic (${uncured.panelFloor} < ${uncured.barCeiling})`,
    !uncured.clears);
}

// ── §3 · WHY CLEARANCE AND NOT A HIGHER z (D-3, ratified) ───────────────────
console.log('\n§3 — the paint order, resolved');
const barZ   = Number((barCode.match(/position: 'fixed'[^]*?zIndex:\s*(\d+)/) || [, NaN])[1]);
const bloomZ = Number((bloomStyle.match(/zIndex:(\d+)/) || [, NaN])[1]);
ok('§3.1 both z-indices are read from the shipped source', Number.isFinite(barZ) && Number.isFinite(bloomZ));

// A `position:fixed` element creates a stacking context, so a descendant's
// z-index is scoped INSIDE it and never competes with the layout's siblings.
const paintsOnTop = (shellIsFixed) => {
  const bloomEffective = shellIsFixed ? 0 : bloomZ; // scoped -> the shell's own auto(0)
  return bloomEffective > barZ ? 'bloom' : 'bar';
};
ok('§3.2 the shell is position:fixed — it OPENS a stacking context', /position:'fixed'/.test(rootStyle));
ok(`§3.3 therefore the bar (z ${barZ}) paints over the room (z ${bloomZ}) however high the room climbs — raising z is not a cure, clearance is`,
  paintsOnTop(true) === 'bar' && bloomZ > barZ);
ok('§3.4 and if the shell were NOT fixed the resolver flips — the cell is sensitive to the mechanism, not the numbers',
  paintsOnTop(false) === 'bloom');

// ── §4 · F-09.147 · THE LINK READS BOTH WAYS, EXECUTED ──────────────────────
console.log('\n§4 — the URL sync, run against the shipped body');
const clearBody = (sanctCode.match(/const clearRoomParam = useCallback\(\(\)=>\{([^]*?)\},\[\]\);/) || [, ''])[1];
ok('§4.1 clearRoomParam\'s body is present and cuttable', clearBody.trim().length > 0);

const runClear = (href, state = { tdw: 's', n: 2 }) => {
  const rec = { replaced: null, stateSeen: undefined, calls: 0 };
  const win = {
    location: { href },
    history: {
      state,
      replaceState(st, _t, u) { rec.calls++; rec.stateSeen = st; rec.replaced = u; win.location.href = new URL(u, href).href; },
    },
  };
  new Function('window', 'URL', clearBody)(win, URL);
  return { rec, href: win.location.href };
};

const BASE = 'https://app.tdw/frost/canvas/sanctuary';
ok('§4.2 CLOSE CLEANS THE URL — ?room=discover is gone and the path survives',
  runClear(`${BASE}?room=discover`).rec.replaced === '/frost/canvas/sanctuary');
ok('§4.3 a room param never travels alone — other query the lane carries is PRESERVED',
  runClear(`${BASE}?ref=wa&room=discover&utm=x`).rec.replaced === '/frost/canvas/sanctuary?ref=wa&utm=x');
// The non-empty limb is not decoration: without it an ABSENT clearRoomParam
// satisfies this cell by doing nothing, which is the shape of the disease.
ok('§4.4 NO ROOM, NO WRITE — with nothing to clear the history is not touched at all',
  clearBody.trim().length > 0
  && runClear(`${BASE}`).rec.calls === 0 && runClear(`${BASE}?ref=wa`).rec.calls === 0);
ok('§4.5 the trap\'s sentinel marker SURVIVES the rewrite — history.state is carried through unchanged',
  (() => { const st = { tdw: 's', n: 7 }; const r = runClear(`${BASE}?room=discover`, st); return r.rec.stateSeen === st; })());
ok('§4.6 REPLACE, NOT PUSH — closing a room leaves no history step behind',
  /replaceState/.test(clearBody) && !/pushState/.test(clearBody));
ok('§4.7 REFRESH IS HONEST — the cleaned URL is what a reload would read',
  !new URL(runClear(`${BASE}?room=discover`).href).searchParams.has('room'));

// The bar's lamp reads the same truth. The rule is re-implemented here from the
// DECLARED doors (independent-method law: a wrong answer, not a wrong rule).
const doorBlock = (barCode.match(/BRIDE_DOORS[^]*?\n\];/) || [''])[0];
const doors = [...doorBlock.matchAll(/\{\s*key:\s*'([^']+)',\s*label:[^]*?route:\s*'([^']+)'(?:,\s*\n?\s*room:\s*'([^']+)')?/g)]
  .map(m => ({ key: m[1], route: m[2], room: m[3] }));
const lamp = (pathname, room) => {
  let best = null;
  for (const d of doors) {
    if (pathname !== d.route && !pathname.startsWith(d.route + '/')) continue;
    if (d.room ? room !== d.room : !!room && doors.some(x => x.room === room)) continue;
    if (!best || d.route.length > best.route.length || (d.room && !best.room)) best = d;
  }
  return best ? best.key : null;
};
ok('§4.8 the five doors parsed out of the shipped bar', doors.length === 5);
ok('§4.9 THE LAMP IS HONEST — room present lights Discover, room cleared lights Home',
  lamp('/frost/canvas/sanctuary', 'discover') === 'discover'
  && lamp('/frost/canvas/sanctuary', null) === 'home');

// ── §5 · C-1 · THE SENTINEL MUST NOT RE-WRITE A STALE URL ───────────────────
console.log('\n§5 — C-1: the trap reads the URL live');
const popBody = (sanctCode.match(/const onPop = \(e: PopStateEvent\) => \{([^]*?)\n    \};/) || [, ''])[1];
ok('§5.1 the popstate handler\'s body is present and cuttable', popBody.trim().length > 0);

const STALE = '/frost/canvas/sanctuary?room=discover';
const LIVE  = '/frost/canvas/sanctuary';
const runPop = (body, roomOpen) => {
  const order = [];
  const win = {
    location: { pathname: '/frost/canvas/sanctuary', search: roomOpen ? '?room=discover' : '' },
    history: { pushState(_s, _t, u) { order.push(['push', u]); } },
  };
  new Function('window', 'url', 'activeRoomRef', 'clearRoomParam', 'setClosing', 'setActiveRoom', 'setBlooming', 'setTimeout', 'Date', body)(
    win, STALE, { current: roomOpen ? 'discover' : null },
    () => { order.push(['clear']); win.location.search = ''; },
    () => {}, () => {}, () => {}, () => {}, Date,
  );
  return order;
};
// B-2, SELF-CAUGHT AND DISCLOSED: §5.3 indexed `seq[1]` unguarded and THREW at
// the uncured tree, where the handler pushes first and never clears. A bench
// that crashes has not answered its question, it has refused it (the floor
// bench's own words at its §5.7 guard). Every read below is now total.
const pushedUrl = (seq) => { const p = seq.find(x => x[0] === 'push'); return p ? p[1] : null; };
{
  const seq = runPop(popBody, true);
  ok('§5.2 the param is cleared BEFORE the sentinel is pushed — order is the whole cure',
    seq.length >= 2 && seq[0][0] === 'clear' && seq[1][0] === 'push');
  ok('§5.3 THE SENTINEL CARRIES THE LIVE URL, not the mount-time capture',
    pushedUrl(seq) === LIVE && pushedUrl(seq) !== STALE);
  ok('§5.4 back on an open room still CLOSES it', seq.some(x => x[0] === 'clear'));
}
ok('§5.5 back with NO room open still traps — the canvas is never left by the gesture',
  (() => { const seq = runPop(popBody, false); return seq.length === 1 && seq[0][0] === 'push'; })());
{
  // The uncured shape, reproduced: push the closed-over `url` instead of a live read.
  const stale = popBody.replace(/window\.location\.pathname \+ window\.location\.search/, 'url');
  const seq = runPop(stale, true);
  ok('§5.6 BOTH WAYS — the mount-captured form resurrects ?room=discover, and §5.3 catches it',
    stale !== popBody && pushedUrl(seq) === STALE);
}

// ── §6 · C-2 · THE CURE MUST NOT REGRESS THE FINDING IT DESCENDS FROM ───────
console.log('\n§6 — C-2: the Discover door opens a SECOND time');
const linkBody = (sanctCode.match(/const param = roomParam;[^]*?openRoom\(param as RoomKey\);/) || [''])[0];
ok('§6.1 the deep-link effect body is present and cuttable', linkBody.length > 0);

const driveLink = (body, sequence) => {
  const opens = [];
  const ref = { current: null };
  const fn = new Function('roomParam', 'deepLinkRef', 'BASE_SLICES', 'openRoom', body.replace(' as RoomKey', ''));
  for (const p of sequence) fn(p, ref, [{ key: 'discover' }, { key: 'muse' }], (k) => opens.push(k));
  return opens;
};
ok('§6.2 one arrival, one open — the once-guard still holds',
  JSON.stringify(driveLink(linkBody, ['discover', 'discover'])) === JSON.stringify(['discover']));
ok('§6.3 OPEN → CLOSE → OPEN: the door opens AGAIN after the param is cleared',
  JSON.stringify(driveLink(linkBody, ['discover', null, 'discover'])) === JSON.stringify(['discover', 'discover']));
{
  // The naive M1b cure, reproduced: ship the sync, leave the guard unreset.
  const naive = linkBody.replace(/if\(!param\)\{ deepLinkRef\.current = null; return; \}/, 'if(!param) return;');
  // `naive !== linkBody` is the non-vacuity limb: if the reset does not exist in
  // the shipped body there is nothing to remove, and a cell that "catches" a
  // mutation it never applied has caught nothing.
  ok('§6.4 BOTH WAYS — the unreset guard opens Discover exactly ONCE per page load, and §6.3 catches it',
    naive !== linkBody
    && JSON.stringify(driveLink(naive, ['discover', null, 'discover'])) === JSON.stringify(['discover']));
}
ok('§6.5 closeRoom resets the guard at the source too, so the door survives a Next that stops syncing replaceState',
  /const closeRoom = useCallback\(\(\)=>\{[^]*?deepLinkRef\.current = null;/.test(sanctCode));
ok('§6.6 the choreography is still entered through its FRONT DOOR — openRoom, never the setter behind it',
  /openRoom\(/.test(linkBody) && !/setActiveRoom\(/.test(linkBody));

// ── §7 · F-09.148 · THE CHROME CAN BE HIT, AND SAYS SO ──────────────────────
console.log('\n§7 — the back chrome\'s target and its acknowledgment');
const backBtn = (sanctCode.match(/<button onClick=\{closeRoom\}[^]*?\}\}>/) || [''])[0];
ok('§7.1 the ‹ SANCTUARY control is present and cuttable', backBtn.length > 0);

const px = (prop) => { const m = backBtn.match(new RegExp(`${prop}:(-?\\d+)`)); return m ? Number(m[1]) : NaN; };
const MIN_H = px('minHeight'), MT = px('marginTop'), MB = px('marginBottom');
ok(`§7.2 THE TARGET IS ${MIN_H}px — at or above the 44px floor a thumb can actually land on`, MIN_H >= 44);
ok(`§7.3 LAYOUT-NEUTRAL: box ${MIN_H} + margins (${MT}, ${MB}) = ${MIN_H + MT + MB}px of margin box — the room chrome does not move`,
  MIN_H + MT + MB === 14);
ok('§7.4 the target grows horizontally too, and the glyph stays at the bar\'s gutter',
  /padding:'0 (\d+)px'/.test(backBtn) && /marginLeft:-(\d+)/.test(backBtn)
  && backBtn.match(/padding:'0 (\d+)px'/)[1] === backBtn.match(/marginLeft:-(\d+)/)[1]);

// The pressed state is the instrument. Its real failure mode is a key mismatch:
// press() writes one key, pressed() reads another, and the control lights never.
const writeKey = (backBtn.match(/\{\.\.\.press\('([^']+)'\)\}/) || [, 'A'])[1];
const readKey  = (backBtn.match(/\.\.\.pressed\('([^']+)'\)/)  || [, 'B'])[1];
ok('§7.5 A RECEIVED TAP IS VISIBLE — the pressed primitive is wired on both arms', writeKey !== 'A' && readKey !== 'B');
ok(`§7.6 and it is wired to the SAME key ('${writeKey}') — a mismatch would light nothing and look identical to the bug`,
  writeKey === readKey);
ok('§7.7 the primitive is the canon one, imported and never re-rolled here',
  /import \{ pressedStyle \} from '@\/lib\/vendor\/controls'/.test(sanctCode));
ok('§7.8 the tap is not fighting the platform — manipulation, and no ghost highlight',
  /touchAction:'manipulation'/.test(backBtn) && /WebkitTapHighlightColor:'transparent'/.test(backBtn));
ok('§7.9 the control still calls closeRoom and nothing else — the cure is the target, not the logic',
  /<button onClick=\{closeRoom\}/.test(backBtn));

// ── §8 · MUTATIONS — production code bitten, never test setup ───────────────
console.log('\n§8 — mutations (production code bitten)');
const mutate = (src, from, to) => src.replace(from, to);

const n1 = mutate(sanctCode, /paddingBottom:BRIDE_BAR_CLEARANCE\}\}>/, '}}>');
ok('§8.1 N1 dropping the shell\'s clearance is CAUGHT by §2.1',
  !/paddingBottom:\s*BRIDE_BAR_CLEARANCE/.test((n1.match(/<div style=\{\{position:'fixed',inset:0,background:bg,[^]*?\}\}>/) || [''])[0]));

const n2 = mutate(bloomStyle, /top:0,left:0,right:0,bottom:BRIDE_BAR_CLEARANCE/, 'inset:0');
ok('§8.2 N2 putting the room container back to inset:0 is CAUGHT by §2.3',
  !(/bottom:\s*BRIDE_BAR_CLEARANCE/.test(n2) && !/inset:0/.test(n2)));

const n3 = mutate(CLEAR_EXPR, /\$\{BRIDE_BAR_HEIGHT\}/, '62');
ok('§8.3 N3 re-typing the height inside the clearance is CAUGHT by §1.3', !/\$\{BRIDE_BAR_HEIGHT\}/.test(n3));

const n4 = clearBody.replace(/u\.searchParams\.delete\('room'\);/, '');
ok('§8.4 N4 a clear that clears nothing is CAUGHT by §4.2',
  (() => { const rec = { replaced: null };
    const win = { location: { href: `${BASE}?room=discover` },
      history: { state: {}, replaceState(_s, _t, u) { rec.replaced = u; win.location.href = new URL(u, BASE).href; } } };
    new Function('window', 'URL', n4)(win, URL);
    return rec.replaced !== '/frost/canvas/sanctuary'; })());

const n5 = clearBody.replace(/window\.history\.replaceState\(window\.history\.state/, 'window.history.replaceState({}');
ok('§8.5 N5 dropping the sentinel marker on the rewrite is CAUGHT by §4.5',
  (() => { const st = { tdw: 's', n: 7 }; let seen;
    const win = { location: { href: `${BASE}?room=discover` },
      history: { state: st, replaceState(s2, _t, u) { seen = s2; win.location.href = new URL(u, BASE).href; } } };
    new Function('window', 'URL', n5)(win, URL);
    return seen !== st; })());

const n6 = popBody.replace(/if\(activeRoomRef\.current !== null\)\{\s*clearRoomParam\(\);/, 'if(activeRoomRef.current !== null){');
ok('§8.6 N6 a back press that closes the room but leaves the param is CAUGHT by §5.2',
  (() => { const seq = runPop(n6, true); return !(seq[0] && seq[0][0] === 'clear'); })());

const n7 = backBtn.replace(/minHeight:44/, 'minHeight:14');
ok('§8.7 N7 shrinking the target back under the thumb is CAUGHT by §7.2',
  Number((n7.match(/minHeight:(\d+)/) || [, NaN])[1]) < 44);

const n8 = backBtn.replace(/\.\.\.pressed\('room:back'\)/, "...pressed('room:bak')");
ok('§8.8 N8 a pressed key typo — the control receives the tap and still shows nothing — is CAUGHT by §7.6',
  (n8.match(/\{\.\.\.press\('([^']+)'\)\}/) || [, 'A'])[1] !== (n8.match(/\.\.\.pressed\('([^']+)'\)/) || [, 'B'])[1]);

const n9 = backBtn.replace(/marginTop:-15,marginBottom:-15/, 'marginTop:0,marginBottom:0');
ok('§8.9 N9 growing the target by growing the whole top bar is CAUGHT by §7.3',
  (() => { const g = (p) => Number((n9.match(new RegExp(`${p}:(-?\\d+)`)) || [, NaN])[1]);
    return g('minHeight') + g('marginTop') + g('marginBottom') !== 14; })());

console.log(`\ntdw09_p4_zip2  ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
