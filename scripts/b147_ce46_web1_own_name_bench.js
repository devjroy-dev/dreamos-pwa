// scripts/b147_ce46_web1_own_name_bench.js
// TDW · CE-46 · WEB-1 cut 3 · b147 — "YOUR OWN NAME" IN THE YOUR WEBSITE ROOM, AND HER SHORT ADDRESS.
//
// §1 the three forms (locked, Coming soon, live) driven WHOLE through OwnName's own formsFor
// §2 one primary per screen · §3 contrast AA, both themes, from globals.css's own tokens
// §4 every line verbatim (the founder's nine, S8, refunded) · §5 the room's copy moved, the retired line gone
// §6 her short address driven whole (publicUrlFor) and pinned at every site that prints or declares it
// §7 R-46.14 over R-40.78, named · §8 the contract twin · §9 mutations
// No dev server, no browser: a floor member. The stills of every state are the card's evidence.
'use strict';
const fs = require('fs'); const path = require('path'); const ts = require('typescript'); const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'); const P = (r) => path.join(ROOT, r); const read = (r) => fs.readFileSync(P(r), 'utf8');
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
function load(src, stubs = {}) {
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const m = { exports: {} }; const req = (id) => (id in stubs ? stubs[id] : require(id));
  new Function('module', 'exports', 'require', js)(m, m.exports, req); return m.exports;
}
const OWN_SRC = read('app/vendor/(shell)/your-website/OwnName.tsx');
const O = load(OWN_SRC, { '@/lib/vendor/api/_base': { API_BASE: '', getAuthHeader: () => ({}) } });
const ROOM = read('app/vendor/(shell)/your-website/screen.tsx');

sec('1  the three forms, driven');
const all = (f, v) => f.search === v && f.pay === v && f.wire === v;
ok(['basic', 'essential'].every((t) => all(O.formsFor({ tier: t, p2Live: true, cut2Landed: true, soonAt: null }), 'locked')), '1.1 Basic and Essential: every action LOCKED (own name is Signature and up, R-46.9)');
ok(['signature', 'prestige'].every((t) => all(O.formsFor({ tier: t, p2Live: true, cut2Landed: true, soonAt: null }), 'live')), '1.2 Signature and Prestige with every gate clear: every action LIVE');
const gate = O.formsFor({ tier: 'signature', p2Live: false, cut2Landed: true, soonAt: null });
ok(gate.search === 'soon' && gate.pay === 'soon' && gate.wire === 'soon', '1.3 signal (a) the website gate closed: Coming soon');
const c2 = O.formsFor({ tier: 'signature', p2Live: true, cut2Landed: false, soonAt: null });
ok(c2.search === 'soon' && c2.pay === 'soon', '1.4 signal (b) cut 2 not landed (no pricePaise in the answer): Coming soon');
const o5 = O.formsFor({ tier: 'signature', p2Live: true, cut2Landed: true, soonAt: 'order' });
ok(o5.pay === 'soon' && o5.search === 'live' && o5.wire === 'live', '1.5 signal (c) the order door answered 503: Pay alone reads Coming soon');
const w5 = O.formsFor({ tier: 'signature', p2Live: true, cut2Landed: true, soonAt: 'wire' });
ok(w5.wire === 'soon' && w5.pay === 'live', '1.6 signal (c) the wire door answered 503: Check now alone reads Coming soon');
ok(!all(O.formsFor({ tier: null, p2Live: true, cut2Landed: true, soonAt: null }), 'locked'), '1.7 an unknown tier is not locked (nothing withheld on a missing read)');
ok(/const F = formsFor\(\{ tier, p2Live, cut2Landed, soonAt, allUnpriced: allUnpricedOf\(results\) \}\);/.test(OWN_SRC) && /F\.pay !== 'live' \? soonBtn\('pay', true\)/.test(OWN_SRC) && /F\.wire !== 'live' \? soonBtn\('wire'\)/.test(OWN_SRC), '1.8 the component renders from formsFor (four signals now) and nothing else decides a form');
ok(/disabled aria-disabled="true"/.test(OWN_SRC) && /\.on-soon:disabled,\.on-soon\[aria-disabled="true"\]\{opacity:1;cursor:not-allowed\}/.test(OWN_SRC), '1.9 Coming soon: disabled, aria-disabled, cursor not-allowed, words at full ink (opacity 1, the chair\'s ruling)');

sec('1b  the fourth signal: an unpriced name is never Taken, never live');
ok(O.rowFormFor({ available: true, pricePaise: 81200 }) === 'get' && O.rowFormFor({ available: true, pricePaise: null }) === 'soon' && O.rowFormFor({ available: false, pricePaise: null }) === 'taken' && O.rowFormFor({ available: false, pricePaise: 81200 }) === 'taken', '1b.1 priced and available: Get; available without a price: Coming soon; taken: Taken');
ok(O.allUnpricedOf([{ available: true, pricePaise: null }, { available: false, pricePaise: null }]) === true && O.allUnpricedOf([{ available: true, pricePaise: null }, { available: true, pricePaise: 58500 }]) === false && O.allUnpricedOf([{ available: false, pricePaise: null }]) === false && O.allUnpricedOf(null) === false, '1b.2 all available names unpriced is the signal; one priced name, or none available, is not');
const au = O.formsFor({ tier: 'signature', p2Live: true, cut2Landed: true, soonAt: null, allUnpriced: true });
ok(au.search === 'soon' && au.pay === 'soon', '1b.3 all unpriced: the search row itself reads Coming soon (with its line)');
ok(O.formsFor({ tier: 'signature', p2Live: true, cut2Landed: true, soonAt: null, allUnpriced: false }).search === 'live', '1b.4 prices arriving make the same search live, no new cut');
ok(/rowFormFor\(r\) === 'soon' \? soonBtn\('get'\)/.test(OWN_SRC) && /allUnpriced: allUnpricedOf\(results\)/.test(OWN_SRC), '1b.5 the component renders the row and the search from these two functions');

sec('2  one primary per screen (screen.tsx :29)');
ok(O.REGISTER.pay === 'primary' && ['search', 'payOpen', 'wire', 'liveCopy'].every((k) => O.REGISTER[k] === 'second'), '2.1 on the address screen every own-name action is secondary; Pay is the sheet\'s one primary');
ok((OWN_SRC.match(/wl-btn pri/g) || []).length === 2, '2.2 OwnName names the primary exactly twice: Pay, and Pay\'s own Coming soon form (never both at once)', (OWN_SRC.match(/wl-btn pri/g) || []).length);
ok(/className="yw-scrim"/.test(OWN_SRC) && /className="yw-sheet" role="dialog" aria-label=\{OWN\.sheetHead\}/.test(OWN_SRC), '2.3 the registrant form is the room\'s own sheet (scrim, dialog), a screen of its own');

sec('3  contrast, WCAG AA, both modes, from the shell\'s own token home (lib/worklist/theme.ts)');
const th = read('lib/worklist/theme.ts');
function block(name) { const i = th.indexOf('const ' + name); return th.slice(i, th.indexOf('};', i)); }
function tok(bl, key) { const m = bl.match(new RegExp("'" + key + "':\\s*'(#[0-9A-Fa-f]{6})'")); return m ? m[1] : null; }
const G = block('GRAPHITE'), K = block('CHALK');
function lum(h) { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function cr(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
const dFill = tok(G, 'accent-text'), dInk = tok(G, 'ink-deep'), lFill = tok(K, 'accent-text'), lDeep = tok(K, 'ink-deep'), lOn = tok(K, 'ink-on-metal');
ok(/\$\{scopeSelector\}\[data-wl-mode="light"\]\{\$\{emit\(CHALK\)\}\}/.test(th), '3.0 CHALK is what the shell emits under .wl[data-wl-mode="light"], so the selector below is the real one');
ok(dFill && dInk && cr(dFill, dInk) >= 4.5, `3.1 dark: the primary's words on its fill, ${dInk} on ${dFill} = ${dFill && dInk ? cr(dFill, dInk).toFixed(2) : '?'}:1 ≥ 4.5`);
ok(lFill && lDeep && cr(lFill, lDeep) < 4.5, `3.2 light, the shell's own pair ${lDeep} on ${lFill} = ${lFill && lDeep ? cr(lFill, lDeep).toFixed(2) : '?'}:1 is UNDER AA (the finding this room cures for itself)`);
ok(lFill && lOn && cr(lFill, lOn) >= 4.5 && /\.wl\[data-wl-mode="light"\] \.yw-pri,\.wl\[data-wl-mode="light"\] \[data-yw-pri\]\{color:var\(--role-ink-on-metal\)\}/.test(ROOM), `3.3 light, in this room: ${lOn} on ${lFill} = ${lFill && lOn ? cr(lFill, lOn).toFixed(2) : '?'}:1 ≥ 4.5, room-scoped through .yw-pri`);
ok(/className=\{\(pri \? 'wl-btn pri yw-pri ' : 'yw-second '\) \+ 'on-soon'\}/.test(OWN_SRC), '3.4 the Coming soon primary wears .yw-pri too, so its words clear AA in both modes (witnessed in the render: rgb(255,255,255) on rgb(13,106,90))');

sec('4  every line verbatim');
const L = O.OWN; const d = 'aarohisen.in';
const want = [
  [L.locked, 'Your own name is on Signature.'], [L.soon, 'Coming soon'], [L.soonLine, 'Coming soon. Your address above works today and always will.'],
  [L.taken, 'Taken'], [L.get, 'Get'], [L.perYear, 'a year'], [L.sheetHead, 'Registered in your name'], [L.pay, 'Pay'],
  [L.payLine, 'You pay first. We register it as soon as the payment clears.'], [L.paying, 'Waiting for your payment.'], [L.openPay, 'Open the payment page'],
  [L.payingLine, 'Paid already? This updates by itself.'], [L.registering(d), 'Registering aarohisen.in in your name.'], [L.settingUp, 'Setting up. Ten to forty minutes.'],
  [L.checkNow, 'Check now'], [L.live(d), 'Live at aarohisen.in'], [L.liveLine, 'Your page lives here now. Your old address still works.'],
  [L.error(d), 'We could not register aarohisen.in yet. Your payment is safe. We will try again, and if it is not done within a day, you get a full refund.'],
  [L.refunded(d), 'aarohisen.in could not be registered. Your payment was refunded in full to the card you paid with.'],
  [L.head, 'Your own name'], [L.sub, 'Get yourname.in and your page lives there. Registered in your name, not ours.'],
];
const bad = want.filter(([a, b]) => a !== b);
ok(bad.length === 0, `4.1 all ${want.length} lines byte-exact (the founder's nine, S8 and refunded as approved)`, JSON.stringify(bad[0]));
ok(O.rupees(81200) === 'Rs 812' && O.rupees(18500000) === 'Rs 1,85,000', '4.2 the price is the door\'s paise, printed in the Indian register; the pwa computes no price');
ok(!Object.values(L).some((v) => typeof v === 'string' && /\u2014/.test(v)), '4.3 no line carries an em dash');
ok(O.BILLING_HREF === '/vendor/billing' && /href: '\/vendor\/billing'/.test(read('lib/worklist/rooms.ts')), '4.4 the locked line taps to Billing, the route rooms.ts declares (R-43.16)');

sec('5  the room\'s copy moved; the retired line gone');
ok(!/domHead:|domSub:|domSoon:|domSearchSoon:/.test(ROOM), '5.1 the four own-name lines left the room\'s copy object for OwnName\'s');
ok(!/The search lands with the registrar\./.test(ROOM + OWN_SRC), '5.2 domSearchSoon ("The search lands with the registrar.") is retired');
ok(/<OwnName p2Live=\{p2Live\} tier=\{tier\} prefill=\{prefill\} \/>/.test(ROOM), '5.3 the address screen mounts OwnName with the gate, her tier and the prefill');
ok(/setTier\(typeof me\.vendor\.tier === 'string' \? me\.vendor\.tier : null\)/.test(ROOM) && /setPrefill\(\{ name: me\.vendor\.name \?\? undefined, address1: me\.vendor\.address \?\? undefined \}\)/.test(ROOM), '5.4 tier, name and address read from /me\'s real keys (re-derived: /me carries no email or phone, so those start empty)');
ok(/<button type="button" className="wl-btn pri" data-yw-pri="1" onClick=\{onClick\}>\{label\}<\/button>/.test(ROOM) && /^\.yw-pri,\[data-yw-pri\]\{text-transform:none;letter-spacing:0\}$/m.test(ROOM) && (ROOM.match(/className="wl-btn pri"/g) || []).length === 1, '5.5 the room\'s primary reads in sentence case ("Copy"), this room only (F5); the register still written exactly once (b40 C115)');

sec('6  her short address');
const H = load(read('lib/public/vendorHost.ts'));
ok(H.publicUrlFor('DEV440', 'https://thedreamwedding.in') === 'https://dev440.thedreamwedding.in', '6.1 DEV440 → https://dev440.thedreamwedding.in (lowercased)');
ok(H.shortAddressFor('shivi_900', 'https://thedreamwedding.in') === null && H.publicUrlFor('shivi_900', 'https://thedreamwedding.in') === 'https://thedreamwedding.in/v/shivi_900', '6.2 a handle outside the label shape has no short address and keeps /v/<handle>');
ok(H.shortAddressFor('demo', 'https://thedreamwedding.in') === null && H.shortAddressFor('www', null) === null, '6.3 a reserved label (demo, www) is never a vendor address');
ok(H.publicUrlFor('dev440', 'http://localhost:4310') === 'http://dev440.localhost:4310', '6.4 a local base keeps http and its port');
ok(H.vendorLabel(new URL(H.publicUrlFor('DEV440', 'https://thedreamwedding.in')).host, 'thedreamwedding.in') === 'dev440', '6.5 the address it prints is one the edge rule serves (the round trip)');
const sf = read('app/vendor/(shell)/storefront/screen.tsx'); const pg = read('app/v/[code]/page.tsx'); const sm = read('app/sitemap.ts');
ok(/const pageUrl = handle \? publicUrlFor\(handle, SITE_BASE\) : '';/.test(ROOM) && /const address = pageUrl\.replace\(/.test(ROOM), '6.6 the Your website room prints, copies, shares and opens her short address');
ok(/href=\{publicUrlFor\(handle, SITE_BASE\)\}/.test(sf), '6.7 the storefront row links her short address');
ok((pg.match(/publicUrlFor\(card\.handle, SITE_BASE\)/g) || []).length === 3 && !pg.includes('`${SITE_BASE}/v/${card.handle}`'), '6.8 the public page tells Google her short address: canonical, og url and the structured-data url');
ok(sm.includes('`${SITE_BASE}/v/${p.handle}/w/${p.slug}`') && sm.includes('`${SITE_BASE}/v/${p.handle}`'), '6.9 the sitemap keeps /v/ addresses until the Search Console property is known to be a DOMAIN property (the chair\'s rule; one line when it is)');

sec('7  R-46.14 over R-40.78, named');
ok(/R-46\.14 \(the founder, 28 September\) SUPERSEDES R-40\.78 for the own-name actions ONLY/.test(ROOM), '7.1 the room\'s header names the supersession and its scope');

sec('8  the contract twin');
const lit = (read('lib/solutions/types.ts').match(/export const CONTRACT_DIGEST = '([0-9a-f]{64})';/) || [])[1];
let computed = ''; try { computed = execFileSync('node', ['tools/bs_audit.mjs', '--print-digest'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').pop(); } catch (e) { computed = 'ERR ' + e.message; }
ok(lit === '2ad7b3f87f6116e9c39334583cf22af5f97a67e3a05f61b4c48ce0d9131699bc' && computed === lit, '8.1 the literal is dream-os cut 2\'s digest and this file\'s declarations compute to it', `${lit} vs ${computed}`);
ok(/'paying'/.test(read('lib/solutions/types.ts')) && /pricePaise: number \| null;/.test(read('lib/solutions/types.ts')) && /paymentUrl: string \| null;/.test(read('lib/solutions/types.ts')), '8.2 DomainStatus mirrors cut 2: paying, refund_due, refunded; pricePaise and paymentUrl');

sec('9  mutations, each in memory');
const mO = load(OWN_SRC.replace("if (i.tier !== null && !UP_TIERS.includes(i.tier)) return { search: 'locked', pay: 'locked', wire: 'locked' };", ''), { '@/lib/vendor/api/_base': { API_BASE: '', getAuthHeader: () => ({}) } });
ok(mO.formsFor({ tier: 'essential', p2Live: true, cut2Landed: true, soonAt: null }).search === 'live', '9.1 the tier guard removed: Essential goes live, 1.1 reddens');
const mO2 = load(OWN_SRC.replace("pay: can && i.soonAt !== 'order' ? 'live' : 'soon',", "pay: 'live',"), { '@/lib/vendor/api/_base': { API_BASE: '', getAuthHeader: () => ({}) } });
ok(mO2.formsFor({ tier: 'signature', p2Live: true, cut2Landed: true, soonAt: 'order' }).pay === 'live', '9.2 the 503 signal ignored: Pay stays live on a closed door, 1.5 reddens');
ok(!/opacity:1;cursor/.test(OWN_SRC.replace('opacity:1;cursor', 'opacity:.55;cursor')), '9.3 the faded Coming soon restored: 1.9 reddens');
const mH = load(read('lib/public/vendorHost.ts').replace("if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(h) || RESERVED_LABELS.includes(h)) return null;", ''));
ok(mH.shortAddressFor('shivi_900', 'https://thedreamwedding.in') !== null, '9.4 the shape guard removed: a dead short address is printed, 6.2 reddens');

const mO3 = load(OWN_SRC.replace("return typeof r.pricePaise === 'number' && r.pricePaise > 0 ? 'get' : 'soon';", "return 'taken';"), { '@/lib/vendor/api/_base': { API_BASE: '', getAuthHeader: () => ({}) } });
ok(mO3.rowFormFor({ available: true, pricePaise: null }) === 'taken', '9.5 the unpriced row sent back to Taken (the false line the fourth signal cures): 1b.1 reddens');
console.log(`\nb147 ${pass} passed, ${fail} failed${fail ? ': ' + failed.join(' | ') : ''}`);
process.exit(fail ? 1 : 0);
