#!/usr/bin/env node
'use strict';
// scripts/b76_4c3a_exchange_shell_bench.js — CE-42 4c-3a · R7 G5.3 THE INFLUENCER EXCHANGE SHELL (pwa).
// EXTENDED at 4c-3b-1p (seat R7, base a9b5e0cd): C2 and C7 AMENDED BY LABEL, C8-C14 new.
// AMENDED AGAIN at 4c-3b-1p-r, the flip rider (base d644a3c6): C2, C3 and C8 by label —
// EXCHANGE_PREVIEW is FALSE now, so "nothing may be called" and "every act toasts" are the
// wrong assertions and their replacements are stated at each cell. C15 new (F-42.208).
//   C2 said "the shell has no network" and asserted no `fetch(`/`getJson` appears at all.
//   4c-3b-1p wires the client, so that byte is now false BY CHARTER rather than by drift —
//   the chair's split ruled the fetches in, behind one flag. The cell keeps its number and
//   asserts the thing that now matters: EVERY call site sits behind an EXCHANGE_PREVIEW
//   guard, so nothing reaches the wire while the flag is true.
//   C7 asserted `fmtDate(r.dates.from)` — the fixture's field name. The glass now reads the
//   DOOR's shape (`date_from`) with the fixtures mapped into it, so the cell follows the
//   field and keeps asserting the one home.
// Seat R7. Base dreamos-pwa 948176dcc440cd074ece8f02fa39fbbb364693ce.
// NUMBERED b76 across both repos (b69's rule): pwa tails at b75, dream-os at b73.
//
// Cells read SHIPPED SOURCE, comments stripped; C4/C5 EXECUTE the shipped TS through
// the repo's own `typescript`. No sibling needed — the shell has no door.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');

const ts = require(path.join(ROOT, 'node_modules/typescript'));
const cache = new Map();
function loadTs(abs) {
  if (cache.has(abs)) return cache.get(abs).exports;
  const out = ts.transpileModule(fs.readFileSync(abs, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} }; cache.set(abs, mod);
  const req = (spec) => {
    let p = spec.startsWith('@/') ? path.join(ROOT, spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(abs), spec) : null;
    if (!p) return require(spec);
    for (const ext of ['', '.ts', '.tsx']) if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) { p = p + ext; break; }
    return /\.(ts|tsx)$/.test(p) ? loadTs(p) : require(p);
  };
  vm.runInThisContext(`(function(exports,require,module){${out}\n})`)(mod.exports, req, mod);
  return mod.exports;
}

let pass = 0; const reds = [];
function cell(name, fn) {
  let why; try { why = fn(); } catch (e) { why = 'threw: ' + e.message; }
  if (why) { reds.push(name); console.log(`  RED    ${name} — ${why}`); } else { pass++; console.log(`  GREEN  ${name}`); }
}

const page   = strip(read('app/vendor/(shell)/exchange/page.tsx'));
const room   = strip(read('app/vendor/(shell)/referrals/page.tsx'));
const routes = read('lib/solutions/routes.ts');
const mocksRaw = read('lib/mocks/exchange.ts');
const EX = loadTs(path.join(ROOT, 'lib/worklist/exchange.ts'));
const MK = loadTs(path.join(ROOT, 'lib/mocks/exchange.ts'));

// MUTATION → RED: EXCHANGE.banner = 'Coming soon.'
cell('C1 the vetoed strings, byte for byte (incl. the one changed byte: "their audience")', () => {
  const want = { rowLabel: 'Influencer exchange', banner: 'Requests open once Instagram approves our access. You can look around.',
    headList: 'Influencers', headMine: 'Your requests', badgeOn: 'Verified via Instagram', badgeOff: 'Pending', emptyList: 'No influencers on The Dream Wedding yet.', emptyMine: 'No requests yet.',
    sendReq: 'Send request', offer: 'What you offer', ask: 'What you ask for', withdraw: 'Withdraw', complete: 'Mark completed' };
  for (const [k, v] of Object.entries(want)) if (EX.EXCHANGE[k] !== v) return `${k} = "${EX.EXCHANGE[k]}"`;
  if (EX.fitLine(62, 'Delhi NCR') !== '62% of their audience is in Delhi NCR') return `fitLine → ${EX.fitLine(62, 'Delhi NCR')}`;
  if (EX.requestLine('Make up Artist', 1, 'Post') !== 'Make up Artist for 1 post' || EX.requestLine('Designer', 3, 'Story') !== 'Designer for 3 storys'.replace('storys', 'storys')) return 'plural rule';
  if (EX.requestLine('Designer', 2, 'Reel') !== 'Designer for 2 reels') return `plural → ${EX.requestLine('Designer', 2, 'Reel')}`;
});

// MUTATION → RED: delete any one `if (EXCHANGE_PREVIEW) return;` guard, or flip the flag.
cell('C2 (AMENDED 4c-3b-1p) one flag, one branch: every door call sits behind EXCHANGE_PREVIEW', () => {
  // AMENDED at the rider: the cell used to demand the flag be TRUE, because the doors did
  // not exist. They do (dream-os 50781af). What it must pin now is that the flip did not
  // take the branches with it — the fixture path is the way back — and that every call is
  // still inside one.
  if (EX.EXCHANGE_PREVIEW !== false) return 'the flag is still true — the doors landed and the acts are owed';
  const lines = page.split('\n');
  const CALLS = ['fetchExchangeHome(', 'fetchCreators(', 'fetchMyRequests(', 'fetchInbox(',
                 'sendRequest(', 'withdrawRequest(', 'completeRequest(', 'acceptRequest(', 'declineRequest('];
  let seen = 0;
  for (let i = 0; i < lines.length; i++) {
    const hits = CALLS.filter((c) => lines[i].includes(c)).length;   // a ternary holds TWO verbs on one line
    if (!hits) continue;
    if (/^import|from '@\/lib\/vendor\/api\/exchange'/.test(lines[i])) continue;
    seen += hits;
    // The guard is the nearest EXCHANGE_PREVIEW above, within the same function body.
    // ⚠ THE GUARD FORM, NOT THE WORD. The first cut of this cell scanned for
    // /EXCHANGE_PREVIEW/ and passed on the `useState(EXCHANGE_PREVIEW ? ... )` seed
    // four lines above the call — a HOLLOW GREEN that survived deleting the real
    // guard. It must be an `if (EXCHANGE_PREVIEW)` statement.
    let guarded = false;
    for (let j = i; j >= 0 && j > i - 20; j--) if (/if \(EXCHANGE_PREVIEW\)/.test(lines[j])) { guarded = true; break; }
    if (!guarded) return `unguarded call at line ${i + 1}: ${lines[i].trim().slice(0, 60)}`;
  }
  if (seen < 9) return `only ${seen} call sites found — the client is not fully wired`;
  if (MK.EXCHANGE_INFLUENCERS.length !== 3 || MK.EXCHANGE_REQUESTS.length !== 4 || MK.EXCHANGE_INBOX.length !== 3) return 'fixture counts moved';
});

cell('C3 (AMENDED at the rider) the acts are LIVE, and the toast branch survives intact as the way back', () => {
  // 4c-3a asserted `onClick={soon}`; 4c-3b-1p asserted three preview toast branches.
  // Both were right for a flag that was true. With it false the acts call the doors, and
  // what this cell must pin is that the branches were not deleted in the flip — a rider
  // that removed them would make the revert a re-cut instead of one line.
  if (!/import \{ COPY \} from '@\/lib\/solutions\/copy'/.test(page)) return 'the byte is not imported';
  if (/launching soon/i.test(page.replace(/COPY\.launchingSoon/g, ''))) return 'the byte is typed, not imported';
  const acts = (page.match(/if \(EXCHANGE_PREVIEW\) \{ show\(COPY\.launchingSoon\); return; \}/g) || []).length;
  if (acts !== 3) return `${acts} preview branches survive — expected 3 (inbox accept/decline, withdraw/complete, send)`;
  // ...and each act now has a real door behind that branch.
  for (const call of ['acceptRequest(id)', 'declineRequest(id)', 'withdrawRequest(id)', 'completeRequest(id)', 'sendRequest(creatorId, body)']) {
    if (!page.includes(call)) return `no live call for ${call}`;
  }
  if (!/r\.state === 'sent'     \? <button/.test(page)) return 'Withdraw is not on sent only';
  if (!/r\.state === 'accepted' \? <button/.test(page)) return 'Mark completed is not on accepted only';
});

cell('C4 (EXTENDED 4c-3b-1p) NO money on the exchange — no Rs, no formatRs, no budget/price/fee field (master §7)', () => {
  for (const [n, src] of [['page.tsx', page], ['exchange.ts', strip(read('lib/worklist/exchange.ts'))], ['mocks', strip(mocksRaw)]]) {
    if (/\bRs\b|formatRs|budget|price|fee|payment|₹/i.test(src)) return `${n} carries a money word`;
  }
});

// MUTATION → RED: in page.tsx sort by `b.followers - a.followers`.
cell('C5 S2(b): the sort is audience-city match then engagement; followers never enter the comparator', () => {
  const sortLine = (page.match(/\.sort\(\([^)]*\) => ([^\n]*)\)/) || [])[1] || '';
  if (!sortLine) return 'no sort found';
  if (/followers/.test(sortLine)) return 'followers in the comparator';
  if (!/pct\(b\) - pct\(a\)/.test(sortLine) || !/engagement_pct/.test(sortLine)) return `comparator is: ${sortLine.slice(0, 80)}`;
});

// MUTATION → RED: in referrals/page.tsx, replace `preview` with nothing on the RoomRow.
cell('C6 the row: RoomRow with the hub\'s Coming chip, EXCHANGE_HREF, under Shoots; the forwards keep zero controls', () => {
  if (!/<RoomRow href=\{EXCHANGE_HREF\} label=\{EXCHANGE\.rowLabel\} preview \/>/.test(room)) return 'the row is not the hub RoomRow with preview';
  if (room.indexOf('<ShootsBlock />') > room.indexOf('<RoomRow href={EXCHANGE_HREF}')) return 'the row sits above Shoots';
  if (!/export const EXCHANGE_HREF = '\/vendor\/exchange'/.test(routes)) return 'EXCHANGE_HREF undeclared';
  if (!fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/exchange/page.tsx'))) return 'no screen at the address';
  const own = room.replace(/<style>[\s\S]*<\/style>/, '');
  if (/<button|onClick=/.test(own)) return 'the room grew a control';
});

// MUTATION → RED: put `color:#68C9B4` into XC_CSS.
cell('C7 (AMENDED 4c-3b-1p) R-42.6: zero colour literals; dates through fmtDate (R-42.13); title is the row label', () => {
  const lit = /#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(/;
  for (const f of ['app/vendor/(shell)/exchange/page.tsx', 'lib/worklist/exchange.ts', 'lib/mocks/exchange.ts']) {
    const hit = strip(read(f)).split('\n').find((l) => lit.test(l)); if (hit) return `${f}: ${hit.trim().slice(0, 60)}`;
  }
  if (!/fmtDate\(r\.date_from\)/.test(page) || /toLocaleDateString/.test(page)) return 'dates do not go through the one home';
  if (!/<WorklistShell title=\{EXCHANGE\.rowLabel\}>/.test(page)) return 'the title is not the row label';
});


// ═══ 4c-3b-1p · C8-C14 ══════════════════════════════════════════════════════
const rawEx   = read('lib/worklist/exchange.ts');
const client  = strip(read('lib/vendor/api/exchange.ts'));
const setPage = strip(read('app/vendor/(shell)/settings/page.tsx'));

// MUTATION → RED: change 'Requests to you' to 'Your inbox'.
cell('C8 (AMENDED at the rider) all six bytes vetoed — the sixth carries its veto date, not a warning', () => {
  const want = { headInbox: 'Requests to you', accept: 'Accept', decline: 'Decline',
                 optInLabel: 'Open to requests from vendors',
                 optInLine: 'Vendors on The Dream Wedding can see your audience and send you a request.' };
  for (const [k, v] of Object.entries(want)) if (EX.EXCHANGE[k] !== v) return `${k} = "${EX.EXCHANGE[k]}"`;
  // AMENDED at the rider: №6 was VETOED 2026-09-10, so the AWAITING-VETO warning is gone
  // and with it the assertion that guarded it. The byte itself is now pinned like the
  // other five, and the source must carry its veto date rather than a warning.
  if (EX.EXCHANGE.states.withdrawn !== 'Withdrawn') return 'the withdrawn label moved';
  if (/AWAITING VETO/.test(rawEx)) return 'the warning outlived the veto';
  // ⚠ THE SIXTH BYTE'S OWN LINES, not "a veto mark somewhere in the file". The first cut
  // of this amendment used an alternation whose second arm matched bytes 1-5's marks, so
  // stripping the sixth's record left it GREEN. The record sits directly above `states:`.
  const exLines = rawEx.split('\n');
  const at = exLines.findIndex((l) => /^\s*states:/.test(l));
  if (at < 1) return 'the states line moved';
  if (!/VETOED/.test(exLines.slice(Math.max(0, at - 4), at).join('\n'))) return 'the sixth byte lost its veto record';
  if (Object.keys(EX.EXCHANGE.states).length !== 5) return 'the five states are not all drawn';
});

// MUTATION → RED: move the `params.get` read outside the EXCHANGE_PREVIEW branch.
cell('C9 the preview role param is INERT when the flag is false', () => {
  const lines = page.split('\n');
  const at = lines.findIndex((l) => l.includes('params.get(PREVIEW_ROLE_PARAM)'));
  if (at < 0) return 'the preview param is not read at all';
  let guarded = false;
  for (let j = at; j >= 0 && j > at - 8; j--) if (/if \(EXCHANGE_PREVIEW\)/.test(lines[j])) { guarded = true; break; }
  if (!guarded) return 'the param is read outside the preview branch — it would override the door';
  if (!/fetchExchangeHome\(\)/.test(page)) return 'the live role is not read from the door';
});

// MUTATION → RED: render <ExchangeScreen /> for a creator too.
cell('C10 the door decides the role; a creator never sees the browse list', () => {
  if (!/role === 'creator' \? <InboxScreen \/> : <ExchangeScreen \/>/.test(page)) return 'the role gate is not the one branch';
  if (!/if \(!role\)\s+return <div style=\{\{ flex: 1 \}\} aria-busy="true" \/>;/.test(page)) return 'the room draws before the role is known';
  const inbox = page.slice(page.indexOf('function InboxScreen()'), page.indexOf('function inboxFromFixture'));
  if (/EXCHANGE\.headList|EXCHANGE\.filterCity|OfferSheet/.test(inbox)) return 'the creator seat carries the sender\'s controls';
  if (!/EXCHANGE\.headInbox/.test(inbox)) return 'the creator seat is not the inbox';
});

// MUTATION → RED: draw Accept on an accepted row.
cell('C11 Accept/Decline on `sent` only; the verb is posted, the state comes back', () => {
  const inbox = page.slice(page.indexOf('function InboxScreen()'), page.indexOf('function inboxFromFixture'));
  if (!/r\.state === 'sent' \? \(/.test(inbox)) return 'the acts are not gated on sent';
  if (/state: 'accepted'|state: 'declined'/.test(inbox)) return 'the room names a state on the wire';
  if (!/setRows\(prev => \(prev \?\? \[\]\)\.map\(x => \(x\.id === next\.id \? next : x\)\)\)/.test(inbox)) return 'the row does not settle on the door\'s echo';
  // The client posts VERBS, never a state.
  // Every transition posts an EMPTY body to a verb path. A `state` reaching postJson
  // is the failure this cell exists for; `state:` inside an interface is not.
  const posts = client.split('\n').filter((l) => /postJson\(/.test(l));
  if (posts.some((l) => /state/.test(l))) return 'a posted body names a state';
  if (posts.filter((l) => /\/(accept|decline|withdraw|complete)'/.test(l)).length !== 4) return 'the four verbs do not post empty bodies';
  for (const verb of ['/accept', '/decline', '/withdraw', '/complete']) if (!client.includes(verb)) return `the ${verb} verb has no call`;
});

// MUTATION → RED: drop the category test from the opt-in row.
cell('C12 the opt-in: content_creator only, fails CLOSED, written by the tap alone', () => {
  if (!/current\.category !== 'content_creator'/.test(setPage)) return 'the row is drawn for every category';
  if (!/updateMe\(\{ exchange_discoverable: next \}\)/.test(setPage)) return 'the opt-in is not written through the one door';
  if (/update\(\{ exchange_discoverable|isDirty/.test(setPage.slice(setPage.indexOf('function ExchangeOptInSwitch')))) return 'the consent flag rides the form hook';
  const hook = strip(read('hooks/vendor/useSettings.ts'));
  if (!/exchange_discoverable: v\.exchange_discoverable === true/.test(hook)) return 'the reader does not fail closed';
  if (!/category: '', exchange_discoverable: false/.test(hook)) return 'the hook default is not closed';
});

// MUTATION → RED: make InboxScreen read r.from_name instead of r.counterpart_name.
cell('C13 one row shape on the glass — the fixtures are mapped INTO the door shape', () => {
  if (!/function inboxFromFixture\(\): RequestRow\[\]/.test(page)) return 'the inbox fixture is not mapped';
  if (!/function mineFromFixture\(\): RequestRow\[\]/.test(page)) return 'the requests fixture is not mapped';
  if (!/function creatorsFromFixture\(\): CreatorView\[\]/.test(page)) return 'the creators fixture is not mapped';
  // THE MAPPERS ARE WHERE FIXTURE FIELDS BELONG — they are the seam. The sweep is
  // the RENDERING half only, with the three mapper bodies cut out of it.
  let glass = page.slice(page.indexOf('function ExchangeRoom'));
  for (const fn of ['function inboxFromFixture', 'function mineFromFixture', 'function creatorsFromFixture']) {
    const a = glass.indexOf(fn); if (a < 0) continue;
    const b = glass.indexOf('\n}', a); glass = glass.slice(0, a) + glass.slice(b);
  }
  if (/r\.from_name|r\.dates\.|i\.followers/.test(glass)) return 'the glass reads a fixture-only field';
  const c = (page.match(/counterpart_name/g) || []).length;
  if (c < 4) return `the door's row field appears ${c} times — the glass has two shapes`;
});

// MUTATION → RED: add `follower_count` to the sort comparator.
cell('C14 S2(b) holds through the flip: the count is a fact, never a key; no identity on the wire', () => {
  const sortLine = page.split('\n').find((l) => l.includes('.sort((a, b)'));
  if (!sortLine) return 'no comparator';
  if (/follower/.test(sortLine)) return `the count entered the sort: ${sortLine.trim().slice(0, 70)}`;
  if (!/engagement_pct/.test(sortLine)) return 'engagement left the comparator';
  // The client's reach shape has NO column for a follower identity, and neither does 0166.
  if (/follower_name|follower_handle|followers\s*:\s*\{/.test(client)) return 'the client shape carries a follower identity';
  if (!/aggregates/.test(read('lib/vendor/api/exchange.ts'))) return 'the client lost its no-identity declaration';
});

// MUTATION → RED: put the tiles back on the card.
cell('C15 (F-42.208) the reach card carries NO post tiles — audience, engagement, verified only', () => {
  const card = page.slice(page.indexOf('{open ? ('), page.indexOf('<p className="xc-banner">'));
  if (/EXCHANGE\.posts|xc-posts|xc-post\b/.test(card)) return 'the card still draws post tiles';
  if (/\.posts/.test(page.slice(page.indexOf('function ExchangeRoom')))) return 'a post field survives on the glass';
  // The two rungs went with them (R-38.4: a rung with nothing on it grows something).
  if (/\.xc-posts\{|\.xc-post\{/.test(page)) return 'the tile rungs outlived the tiles';
  // The BYTE stays — vetoed, and 4c-3b-2 lands it beside the demographics reader.
  if (EX.EXCHANGE.posts !== 'Recent posts') return 'the vetoed byte was deleted rather than parked';
  if (!/F-42\.208/.test(rawEx)) return 'the byte is parked with no finding named';
  // What the card DOES show.
  for (const k of ['audience', 'byCity', 'byAge', 'byGender', 'engagement']) if (!card.includes('EXCHANGE.' + k)) return `the card lost ${k}`;
});

console.log(`\nb76 · ${pass} GREEN · ${reds.length} RED${reds.length ? ' — ' + reds.join(' | ') : ''}`);
process.exit(reds.length ? 1 : 0);
