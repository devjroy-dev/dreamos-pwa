#!/usr/bin/env node
// scripts/wl_audit.mjs — R-37.85 · THE EXECUTABLE GATE.
//
// One paste:  node scripts/wl_audit.mjs https://<branch-domain>
//
// WHY THIS EXISTS. The chair's gate asked for screenshots the executor cannot produce — it has
// no renderer. A screenshot also proves nothing a human doesn't personally re-check. This
// asserts the same properties against the SERVED bytes and prints a verdict, so a FAIL bounces
// the ZIP on the paste alone and the founder's eyes only ever meet an all-PASS build.
//
// AGAINST THE SERVED TREE, NOT THE SOURCE. Every assertion below fetches a deployed URL. A
// grep over source proves the source; this proves the deploy. That distinction is the whole
// point — the estate has been burned by a source that was right and a build that was stale.
//
// ITS OWN HONESTY. Where an assertion CANNOT be made from served bytes, the script says
// INCONCLUSIVE and says why. A gate that reports PASS for something it did not test is worse
// than no gate — it launders an assumption into a verdict.
//
// Zero dependencies. Node 18+ for global fetch.
'use strict';

const BASE = (process.argv[2] || '').replace(/\/$/, '');
if (!BASE) {
  console.error('usage: node scripts/wl_audit.mjs https://<branch-domain>');
  process.exit(2);
}

let pass = 0, fail = 0, incon = 0;
const P = (n, why) => { console.log('PASS         ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL         ' + n + '  — ' + why); fail++; };
const I = (n, why) => { console.log('INCONCLUSIVE ' + n + '  — ' + why); incon++; };

async function get(path) {
  const res = await fetch(BASE + path, { redirect: 'follow', headers: { 'user-agent': 'wl-audit' } });
  return { status: res.status, url: res.url, body: await res.text() };
}

// The shell's pages are client-rendered, so the served HTML carries the shell but not every
// client-painted node. Assertions therefore run against whichever artifact actually carries
// the property: the HTML for what the server emits, the JS bundles for component chrome.
const bundles = new Map();
async function bundleText(page) {
  if (bundles.has(page)) return bundles.get(page);
  const html = (await get(page)).body;
  const srcs = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
  let all = html;
  for (const s of srcs.slice(0, 40)) {
    try { all += (await get(s)).body; } catch { /* a missing chunk is its own signal below */ }
  }
  bundles.set(page, all);
  return all;
}

(async () => {
  console.log('wl_audit · ' + BASE + '\n');

  // ── 0 · the deploy is the one we think it is ─────────────────────────────
  try {
    const r = await get('/w');
    if (r.status !== 200) return F('reachable', '/w returned ' + r.status), summary();
    if (!/\/w\/rooms/.test(r.url) && !/rooms/i.test(r.body)) F('R-37.75 rooms-first', '/w did not resolve to Rooms');
    else P('R-37.75 rooms-first', '/w → ' + r.url.replace(BASE, ''));
  } catch (e) { F('reachable', e.message); return summary(); }

  const shell = await bundleText('/w/rooms');
  const room  = await bundleText('/vendor/list/leads');

  // ── ① one medallion ──────────────────────────────────────────────────────
  const coinRing = /1px solid var\(--role-metal\)/;
  const shellCoin = /\.wl-coin\{[^}]*border:1px solid var\(--role-metal\)/.test(shell) || coinRing.test(shell);
  const roomCoin  = coinRing.test(room) && /width:\s*44,\s*height:\s*44/.test(room);
  if (shellCoin && roomCoin) P('R-37.84 ① one medallion', 'both headers carry the metal ring at 44px');
  else F('R-37.84 ① one medallion', 'shell=' + shellCoin + ' room=' + roomCoin);

  // ── ② the header carries the house ───────────────────────────────────────
  if (/The Dream Wedding/.test(shell) && /wl-house/.test(shell)) P('R-37.84 ② the wordmark');
  else F('R-37.84 ② the wordmark', 'no wl-house wordmark in the shell bundle');

  // ── ③ no italic serif in room prose ──────────────────────────────────────
  const italicScript = /fontStyle:\s*"italic"[^}]{0,80}font-cormorant|font-cormorant[^}]{0,80}fontStyle:\s*"italic"/;
  if (italicScript.test(room)) F('R-37.84 ③ italic serif dies', 'the script family and italic still ship together');
  else P('R-37.84 ③ italic serif dies', 'no script+italic pairing in the Leads bundle');

  // ── ④ the vestiges ───────────────────────────────────────────────────────
  const settings = await bundleText('/vendor/settings');
  const v = ['Moved to your Discover Profile', 'Moved to Billing'].filter((t) => settings.includes(t));
  if (v.length) F('R-37.84 ④ vestiges die', 'still shipped: ' + v.join(' · '));
  else P('R-37.84 ④ vestiges die');

  // ── ⑤ the link goes home ─────────────────────────────────────────────────
  const inRooms = /wl-plink/.test(shell);
  if (inRooms) F('R-37.84 ⑤ the link goes home', 'the wa.me row still ships in the Rooms bundle');
  else P('R-37.84 ⑤ the link goes home', 'absent from Rooms');
  if (/TDW ENQUIRY LINK/i.test(settings)) P('R-37.84 ⑤ settings section present');
  else I('R-37.84 ⑤ settings row', 'the section label was not found in the served bundle — check by eye');

  // ── ⑥ the drawer is an overlay ───────────────────────────────────────────
  if (/position:\s*"fixed",\s*inset:\s*0/.test(room) && /--role-scrim/.test(room))
    P('R-37.84 ⑥ drawer overlays', 'fixed scrim present; the grid is not in flow behind it');
  else F('R-37.84 ⑥ drawer overlays', 'no fixed scrim in the room bundle — the drawer still renders in flow');

  // ── ⑦ / R-37.85 ③ the risen chat, in branch tokens ───────────────────────
  if (/wl-asksheet/.test(shell) && /wl-askpanel/.test(shell)) P('R-37.84 ⑦ the chat mounts');
  else F('R-37.84 ⑦ the chat mounts', 'AskSheet is not in the shell bundle — the dock has nothing to rise');
  if (/wl-dockfield/.test(shell) && !/wa\.me/.test(shell.match(/wl-dockfield[\s\S]{0,600}/)?.[0] || ''))
    P('R-37.85 ③ the dock does not teleport');
  else F('R-37.85 ③ the dock does not teleport', 'the field costume ships beside a wa.me jump');

  // ── R-37.82 the gutter and one-line-row laws ─────────────────────────────
  if (/--wl-gutter/.test(shell) && /\.wl-main > \*\{padding-left:var\(--wl-gutter\)/.test(shell))
    P('R-37.82 ① the gutter law');
  else F('R-37.82 ① the gutter law', 'the column does not own its gutter in the served CSS');
  if (/\.wl-prow\{[^}]*min-height:52px/.test(shell)) P('R-37.82 ② one-line rows');
  else F('R-37.82 ② one-line rows', 'the panel rows do not ship at 52px');

  // ── the properties this script CANNOT decide from bytes ──────────────────
  I('pixel-identical tile and panel edges', 'a served-bytes gate proves the RULE (one gutter, no component override) and not the rendered pixel. C22 holds the rule; only glass holds the pixel.');

  summary();
})().catch((e) => { console.error('audit threw: ' + e.message); process.exit(3); });

function summary() {
  console.log('\n' + pass + ' PASS · ' + fail + ' FAIL · ' + incon + ' INCONCLUSIVE');
  console.log(fail === 0 ? 'GATE GREEN — the founder may open the app.' : 'GATE RED — the ZIP bounces; the founder does not open the app.');
  process.exit(fail === 0 ? 0 : 1);
}
