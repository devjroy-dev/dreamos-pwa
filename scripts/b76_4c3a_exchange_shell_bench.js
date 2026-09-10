#!/usr/bin/env node
'use strict';
// scripts/b76_4c3a_exchange_shell_bench.js — CE-42 4c-3a · R7 G5.3 THE INFLUENCER EXCHANGE SHELL (pwa).
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

// MUTATION → RED: in page.tsx, replace `EXCHANGE_INFLUENCERS` with a getJson(...) read.
cell('C2 the fixture rows are consts no door reads — the shell has no network', () => {
  if (/getJson|postJson|fetch\(/.test(page)) return 'the shell calls a door';
  if (!/EXCHANGE_INFLUENCERS/.test(page) || !/EXCHANGE_REQUESTS/.test(page)) return 'the shell does not read the fixture consts';
  if (MK.EXCHANGE_INFLUENCERS.length !== 3 || MK.EXCHANGE_REQUESTS.length !== 4) return 'fixture counts moved';
  if (!MK.EXCHANGE_INFLUENCERS.every(i => /\.tdw$/.test(i.handle))) return 'a fixture handle lacks the .tdw suffix (a live handle risk)';
  if (!MK.EXCHANGE_INFLUENCERS.every(i => i.craft === 'content_creator')) return 'an influencer is not a content_creator (ruling (ii))';
});

// MUTATION → RED: in page.tsx, change one `onClick={soon}` to `onClick={() => {}}`.
cell('C3 every act toasts COPY.launchingSoon — imported, never typed; Withdraw on sent only', () => {
  if (/Launching soon/.test(page)) return 'the byte is typed on the screen';
  if (!/COPY\.launchingSoon/.test(page)) return 'launchingSoon is not imported';
  const acts = (page.match(/onClick=\{soon\}/g) || []).length + (page.match(/onSend=\{\(\) => \{ setOffering\(false\); soon\(\); \}\}/g) || []).length;
  if (acts < 3) return `only ${acts} acts toast`;
  if (!/r\.state === 'sent'\s*\? <button[^>]*onClick=\{soon\}>\{EXCHANGE\.withdraw\}/.test(page)) return 'Withdraw is not gated to sent';
  if (!/r\.state === 'accepted'\s*\? <button[^>]*onClick=\{soon\}>\{EXCHANGE\.complete\}/.test(page)) return 'Mark completed is not gated to accepted';
});

// MUTATION → RED: add `<input type="number" placeholder="Rs" />` to OfferSheet.
cell('C4 NO money on the exchange — no Rs, no formatRs, no budget/price/fee field (master §7)', () => {
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
cell('C7 R-42.6: zero colour literals; dates through fmtDate (R-42.13); title is the row label', () => {
  const lit = /#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(/;
  for (const f of ['app/vendor/(shell)/exchange/page.tsx', 'lib/worklist/exchange.ts', 'lib/mocks/exchange.ts']) {
    const hit = strip(read(f)).split('\n').find((l) => lit.test(l)); if (hit) return `${f}: ${hit.trim().slice(0, 60)}`;
  }
  if (!/fmtDate\(r\.dates\.from\)/.test(page) || /toLocaleDateString/.test(page)) return 'dates do not go through the one home';
  if (!/<WorklistShell title=\{EXCHANGE\.rowLabel\}>/.test(page)) return 'the title is not the row label';
});

console.log(`\nb76 · ${pass} GREEN · ${reds.length} RED${reds.length ? ' — ' + reds.join(' | ') : ''}`);
process.exit(reds.length ? 1 : 0);
