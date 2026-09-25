'use strict';
// scripts/b126_igd1_meta_room_bench.js · TDW CE-45 · IGD-1 · CUT 1 (dreamos-pwa). Rung b126.
//
// WHAT IT HOLDS. R-45.27 (the founder, 25 Sept 2026): Business Solutions' "Your own number" row becomes the room
// "WhatsApp and Instagram" (A1 (a): key 'number', href and Coming unchanged, eleven rows; A2 Get booked, last; A3 its line;
// A4 the seat's two-bubble drawing, curing F-44.164). Inside it, in ONE shell (S1): G6's screen under "Your own number",
// then "Instagram messages" (C1 to C9, C13), then the quiet time (QT1, QT2). Each new part reads its own door and renders
// NOTHING when the door is absent or malformed, so until dream-os cut 2a the room is G6's screen under its new name.
// No brand mark is drawn in this cut (the founder: the official marks ride a later cut).
//
// DRIVEN IN THE REAL ROOM (C-43.18), b120's method: `next dev` in mock mode with the doors mocked at the network, a real
// headless Chromium (CHROME_BIN, then @sparticuz/chromium), both themes. Without a browser the room cells are DECLARED RED.
// The dev server is started and stopped WHOLE by scripts/lib/b126_dev_server.js (the chair's rider from F-44.160's cure);
// its output is this rung's last-run log (A-45.6). A pwa run clears .next/dev before tsc (A-45.5; the founder's block 2).
//
// NO CLOCK IS READ by any file this cut adds (§1.8 proves it), so C-44.13's shifted clocks have nothing to shift.
// MUTATIONS of production code (§4) are restored byte for byte in a `finally`, their sha re-checked. Run DETACHED (A-45.4).
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const ts = require('typescript');
const devServer = require('./lib/b126_dev_server');

const ROOT = path.join(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const h16 = (s) => sha(String(s)).slice(0, 16);
let pass = 0; let fail = 0; const failed = [];
function ok(cond, name, info) { if (cond) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info ? '  [' + String(info).slice(0, 260) + ']' : ''}`); } }
const sec = (t) => console.log(`\n§${t}`);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

const PAGE = 'app/vendor/(shell)/number/page.tsx';
const FLOWC = 'components/solutions/OwnNumberFlow.tsx';
const SECT = 'components/solutions/MetaRoomSections.tsx';
const DOOR = 'lib/vendor/metaRoomDoor.ts';
const COPYM = 'lib/worklist/metaRoom.ts';
const SOLC = 'lib/solutions/copy.ts';
const ICONS = 'lib/worklist/icons.ts';
const ROUTES = 'lib/solutions/routes.ts';
const PORTF = 'app/vendor/(shell)/portfolio/screen.tsx';
const ADDED = [SECT, DOOR, COPYM];

function loadTs(rel, src) {
  const out = ts.transpileModule(src === undefined ? read(rel) : src, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.React } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => require(spec), mod, mod.exports);
  return mod.exports;
}

// THE FOUNDER'S BYTES (his table, 25 Sept 2026, "ok"), pinned by the first 16 hex of sha256.
const VETOED = {
  'SECTIONS.number': 'a625fc8d7c9d0554', 'SECTIONS.instagram': '47b83aeaab4df5cd',
  'IG.lede': '94a11debf3564f16', 'IG.connect': '59641f41ef18e824', 'IG.professional': '551602b858cce1f7',
  'IG.consent': '60f754a4cd5c1967', 'IG.turnOn': '5a1f096a0d8d7674', 'IG.notNow': 'a0e63d7c7125d29a',
  'IG.on': '6f265681872973a4', 'IG.paused': '8d99ae133c50edd5', 'IG.waiting': '7f17bd6b067cc030', 'IG.turnOff': '06f0e210b27d4d62',
  'QUIET.line': 'db24a8f488684f78', 'QUIET.labels': '89222666feeac835',
};
const ROW_LABEL = 'WhatsApp and Instagram';
const ROW_LINE = 'Enquiries on WhatsApp and Instagram, answered in the studio\u2019s name';
const ICON_SHA = '1b6519c8f964bef9129cd637b8cdb605f0b3913d294656d5bef8f58e885fd73b';

(async () => {
  sec('1  the source');
  const M = loadTs(COPYM);
  const got = {};
  for (const [k, v] of Object.entries(M.SECTIONS)) got[`SECTIONS.${k}`] = h16(v);
  for (const [k, v] of Object.entries(M.IG)) got[`IG.${k}`] = h16(v);
  got['QUIET.line'] = h16(M.QUIET.line);
  got['QUIET.labels'] = h16(M.QUIET.options.map((o) => `${o.minutes}:${o.label}`).join('|'));
  const off = Object.keys(VETOED).filter((k) => got[k] !== VETOED[k]);
  const extra = Object.keys(got).filter((k) => !(k in VETOED));
  ok(off.length === 0 && extra.length === 0 && M.QUIET.defaultMinutes === 120,
    '1.1 every room byte is the founder\u2019s (A5, C1 to C9, C13, QT1, QT2), pinned by sha; the default is 2 hours', `off ${off} extra ${extra}`);
  const portf = read(PORTF);
  const h2 = (portf.match(/  H2: "(.*)",\n/) || [])[1]; const h4 = (portf.match(/  H4: '(.*)',\n/) || [])[1];
  ok(h2 === M.IG.professional && h4 === M.IG.connect, '1.2 C4 and C3 are hash-carried from the portfolio\u2019s H2 and H4, byte for byte', `${h16(h2)} ${h16(h4)}`);
  const touched = [PAGE, FLOWC, ...ADDED];
  ok(!touched.some((f) => /\b(Victor|Donna|Harvey|Mira|Eliza)\b/.test(read(f))), '1.3 no persona name in any file this cut adds or touches (b40 C32; the copy law)');
  ok(!touched.some((f) => /<img\b|\.png|\.svg['"]|instagram\.com\/static|whatsapp\.(com|net)/i.test(strip(read(f)))),
    '1.4 no brand mark: no image, no mark file, no brand CDN in any file this cut adds or touches (the founder: marks later)');
  ok(!/>\s*[A-Za-z][^<{]*</.test(strip(read(SECT))), '1.5 no text node typed into the sections: every word is read from its copy home');
  const S = loadTs(SOLC);
  const labels = S.ROOM_ROWS.map((r) => r.label);
  const group = (S.HUB_GROUPS.find((g) => g.name === 'Get booked') || { keys: [] }).keys;
  ok(S.roomLabel('number') === ROW_LABEL && S.ROW_DESC.number === ROW_LINE && labels.length === 11 && !labels.includes('Your own number')
    && group[group.length - 1] === 'number',
    '1.6 A1, A2, A3: the row is "WhatsApp and Instagram", last in Get booked, with its line; eleven rows; the old name gone from the hub');
  const IC = loadTs(ICONS);
  ok(sha(String(IC.ROOM_ICONS.number)) === ICON_SHA && !/M9\.5 9\.5c\.5 2 2 3\.5 4 4/.test(read(ICONS)),
    '1.7 A4 and F-44.164: the two-bubble drawing is the row\u2019s icon, and the handset drawing is nowhere in the icon set');
  ok(!ADDED.some((f) => /new Date\(|Date\.now\(/.test(strip(read(f)))), '1.8 no file this cut adds reads a clock (C-44.13 has nothing to shift)');
  const flow = read(FLOWC);
  const h1s = (flow.match(/<h1 className="sol-title">\{roomLabel\('number'\)\}<\/h1>\n\s*\{head\}/g) || []).length;
  const afters = (flow.match(/\{after\}\n\s*<SolutionsStyles \/>/g) || []).length;
  ok(h1s === 5 && afters === 2 && /sectionHead\?: string; after\?: ReactNode/.test(flow),
    '1.9 S1: OwnNumberFlow draws the section heading under the title in all five places and the `after` slot in both shells', `${h1s} ${afters}`);
  const page = read(PAGE);
  ok(/return <OwnNumberFlow room=\{room\} sectionHead=\{SECTIONS\.number\} after=\{<MetaRoomSections \/>\} \/>;/.test(page)
    && /<h2 className="sol-heading">\{SECTIONS\.number\}<\/h2>/.test(page) && /<MetaRoomSections \/>\n\s*<WlToast/.test(page),
    '1.10 the page composes one room: G6\u2019s screen under its heading, then the Instagram section and the quiet time, in one shell');
  const R = read(ROUTES);
  ok(/instagram:\s+\(\) => `\$\{SOLUTIONS_API_PATH\}\/instagram`,/.test(R) && /instagramSwitch:\s+\(\) => `\$\{SOLUTIONS_API_PATH\}\/instagram\/switch`,/.test(R)
    && /quiet:\s+\(\) => `\$\{SOLUTIONS_API_PATH\}\/quiet`,/.test(R), '1.11 the room\u2019s three doors stand at the declared addresses beside their siblings');

  sec('2  the pure logic');
  const D = loadTs(DOOR);
  const AUTH = 'https://www.instagram.com/oauth/authorize?client_id=1';
  for (const st of ['not_connected', 'off', 'on', 'paused', 'waiting']) {
    const d = D.asIgDoor({ ok: true, state: st, authorize_url: null });
    ok(!!d && d.state === st && d.authorize_url === null, `2.1 ${st}: a well-formed door is read`);
  }
  ok(D.asIgDoor({ ok: true, state: 'paused', authorize_url: AUTH }).authorize_url.startsWith('https://www.instagram.com/'), '2.2 an https instagram.com address is kept');
  const hostile = [undefined, null, 0, '', 'x', [], {}, { ok: false, state: 'on' }, { ok: 'true', state: 'on' }, { ok: true },
    { ok: true, state: 'ON' }, { ok: true, state: 'live' }, { ok: true, state: 7 }, { ok: true, state: 'on', authorize_url: 'http://www.instagram.com/x' },
    { ok: true, state: 'on', authorize_url: 'https://evil.example/x' }, { ok: true, state: 'on', authorize_url: 'https://www.instagram.com.evil.io/x' },
    { ok: true, state: 'on', authorize_url: 'https://u:p@www.instagram.com/x' }, { ok: true, state: 'on', authorize_url: 'https://www.instagram.com:8443/x' },
    { ok: true, state: 'on', authorize_url: 'javascript:alert(1)' }, { ok: true, state: 'on', authorize_url: 5 }, { ok: true, state: 'on', authorize_url: 'x'.repeat(5000) }];
  let threw = null; const admitted = [];
  for (const h of hostile) { try { if (D.asIgDoor(h) !== null) admitted.push(JSON.stringify(h).slice(0, 80)); } catch (e) { threw = e.message; } }
  ok(threw === null && admitted.length === 0, `2.3 ${hostile.length} hostile bodies: every one is a failed read (null), none throws`, threw || admitted.join(' | '));
  const qBad = [null, {}, { ok: true }, { ok: true, minutes: 90 }, { ok: true, minutes: '120' }, { ok: false, minutes: 120 }, { ok: true, minutes: 0 }, { ok: true, minutes: -60 }];
  ok([60, 120, 240, 480].every((m) => D.asQuietDoor({ ok: true, minutes: m }).minutes === m) && qBad.every((q) => D.asQuietDoor(q) === null),
    '2.4 the quiet door reads the four ruled lengths and nothing else');
  const t = (d) => JSON.stringify(D.afterTurnOn(d));
  ok(t({ state: 'not_connected', authorize_url: AUTH }) === JSON.stringify({ go: AUTH }) && t({ state: 'paused', authorize_url: AUTH }) === JSON.stringify({ go: AUTH })
    && t({ state: 'on', authorize_url: null }).includes('draw') && t({ state: 'waiting', authorize_url: null }).includes('draw')
    && t({ state: 'not_connected', authorize_url: null }) === '{"fail":true}' && t({ state: 'off', authorize_url: null }) === '{"fail":true}' && t(null) === '{"fail":true}',
    '2.5 Turn on: to Instagram when it must authorise, draws on or waiting, and fails loudly otherwise');

  sec('3  the real room, both themes (C-43.18)');
  const PORT = 3991;
  const SHOTS = path.join(require('os').tmpdir(), 'b126_shots');
  const TAPS = { connect: M.IG.connect, notNow: M.IG.notNow, turnOn: M.IG.turnOn, turnOff: M.IG.turnOff, paused: M.IG.paused };
  const probe = (mode, sc, shots = SHOTS) => {
    const r = spawnSync('node', [P('scripts/lib/b126_meta_room_probe.mjs'), String(PORT), mode, sc, shots],
      { encoding: 'utf8', timeout: 240000, env: { ...process.env, B126_TAPS: JSON.stringify(TAPS) } });
    if (r.status === 3) return { noBrowser: true, text: r.stdout };
    try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 300)}` }; }
  };
  let browserOk = true;
  const guard = (o, label) => {
    if (o.noBrowser) { ok(false, `${label}: a browser is available to drive the room (C-43.18). Tried: ${o.text}`); browserOk = false; return false; }
    if (o.error) { ok(false, `${label}: the probe ran: ${o.error}`); return false; }
    if (o.errors && o.errors.length) { ok(false, `${label}: the page raised no error`, o.errors.join(' | ')); return false; }
    return true;
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const restores = [];
  const server = await devServer.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  try {
    if (!(await server.up())) throw new Error('next dev did not come up');
    await new Promise((r) => setTimeout(r, 5000));
    for (const mode of ['dark', 'light']) {
      let o = probe(mode, 'r404');
      if (guard(o, `3.r404 ${mode}`)) {
        const s = o.screens[0];
        ok(s.title === ROW_LABEL && s.g6 && s.g6[0] === 'Coming' && s.g6[2] === M.SECTIONS.number && s.ig === null && s.quiet === null,
          `3.r404 ${mode}: both doors absent, the room is G6\u2019s shell under "WhatsApp and Instagram" and "Your own number", nothing else drawn`, JSON.stringify({ t: s.title, g6: s.g6 && s.g6.slice(0, 3), ig: s.ig, q: s.quiet }));
      }
      if (!browserOk) break;
      o = probe(mode, 'rNot');
      if (guard(o, `3.rNot ${mode}`)) {
        const s = o.screens[0];
        ok(same(s.ig, [M.SECTIONS.instagram, M.IG.lede, M.IG.professional]) && same(s.igButtons, [M.IG.connect])
          && s.quietValue === '120' && same(s.quietOptions, M.QUIET.options.map((x) => x.label)) && s.quiet.startsWith(M.QUIET.line),
          `3.rNot ${mode}: C1, C2, C4 and one Connect Instagram; the quiet time reads QT1 with 2 hours chosen of four`, JSON.stringify({ ig: s.ig, b: s.igButtons, q: s.quietValue }));
      }
      o = probe(mode, 'rConsent');
      if (guard(o, `3.rConsent ${mode}`)) {
        const [, c, back] = o.screens;
        ok(c && c.igState === 'consent' && same(c.ig, [M.SECTIONS.instagram, M.IG.consent]) && same(c.igButtons, [M.IG.turnOn, M.IG.notNow])
          && back && back.igState === 'not_connected' && o.posts.length === 0,
          `3.rConsent ${mode}: the consent states C5 with Turn on and Not now; Not now returns and sends nothing`, JSON.stringify({ c: c && c.ig, posts: o.posts }));
      }
      o = probe(mode, 'rGo');
      if (guard(o, `3.rGo ${mode}`)) {
        ok(o.posts.length === 1 && same(o.posts[0].body, { on: true }) && o.navigations.length === 1 && o.navigations[0].startsWith('https://www.instagram.com/oauth/authorize'),
          `3.rGo ${mode}: Turn on posts {on:true} once, then goes to the server\u2019s Instagram authorize address`, JSON.stringify({ p: o.posts, n: o.navigations }));
      }
      o = probe(mode, 'rOn');
      if (guard(o, `3.rOn ${mode}`)) {
        const [s, after] = o.screens;
        ok(same(s.ig, [M.SECTIONS.instagram, M.IG.on]) && same(s.igButtons, [M.IG.turnOff]) && o.posts.length === 1 && same(o.posts[0].body, { on: false })
          && after && after.igState === 'off' && same(after.igButtons, [M.IG.turnOn]),
          `3.rOn ${mode}: C7 with Turn off; Turn off posts {on:false} and the room reads off`, JSON.stringify({ s: s.ig, p: o.posts, a: after && after.igButtons }));
      }
      o = probe(mode, 'rPaused');
      if (guard(o, `3.rPaused ${mode}`)) {
        const s = o.screens[0];
        ok(same(s.igButtons, [M.IG.paused]) && o.navigations.length === 1 && o.navigations[0].startsWith('https://www.instagram.com/'),
          `3.rPaused ${mode}: C8 is itself the tap (R-43.16) and it goes to Instagram`, JSON.stringify({ b: s.igButtons, n: o.navigations }));
      }
      o = probe(mode, 'rWaiting');
      if (guard(o, `3.rWaiting ${mode}`)) {
        const s = o.screens[0];
        ok(same(s.ig, [M.SECTIONS.instagram, M.IG.waiting]) && same(s.igButtons, [M.IG.turnOff]), `3.rWaiting ${mode}: C9 with Turn off`, JSON.stringify(s.ig));
      }
      o = probe(mode, 'rQuiet');
      if (guard(o, `3.rQuiet ${mode}`)) {
        const after = o.screens[1];
        ok(o.posts.length === 1 && same(o.posts[0].body, { minutes: 240 }) && after && after.quietValue === '240',
          `3.rQuiet ${mode}: choosing 4 hours posts {minutes:240} and the row holds it`, JSON.stringify(o.posts));
      }
      for (const bad of ['rBadUrl', 'rBadState']) {
        o = probe(mode, bad);
        if (guard(o, `3.${bad} ${mode}`)) ok(o.screens[0].ig === null && o.navigations.length === 0, `3.${bad} ${mode}: a malformed Instagram door draws nothing`);
      }
      o = probe(mode, 'rHub');
      if (guard(o, `3.rHub ${mode}`)) {
        const body = o.screens[0].body || '';
        ok(body.includes(ROW_LABEL) && body.includes(ROW_LINE) && !body.includes('Your own number'),
          `3.rHub ${mode}: the hub shows "WhatsApp and Instagram" with its line, and no "Your own number" row`);
      }
    }
    if (browserOk) {
      sec('4  mutations of production code');
      const mutate = (rel, from, to) => { const src = read(rel); const m = src.replace(from, to); if (m === src) return null; fs.writeFileSync(P(rel), m); restores.push([rel, src]); return src; };
      const m1 = mutate(SECT, 'onClick={() => setConsent(false)}>{IG.notNow}', 'onClick={() => { void flip(true); }}>{IG.notNow}');
      if (m1 !== null) {
        await new Promise((r) => setTimeout(r, 7000));
        const o = probe('dark', 'rConsent', '');
        ok(!!o.posts && o.posts.length > 0, 'M1 Not now that sends the switch reddens 3.rConsent (its cell reads the posts)', JSON.stringify(o.posts));
        fs.writeFileSync(P(SECT), m1);
      } else ok(false, 'M1 anchor present');
      const m2 = mutate(PAGE, '      <MetaRoomSections />\n      <WlToast', '      <WlToast');
      if (m2 !== null) {
        await new Promise((r) => setTimeout(r, 7000));
        const o = probe('dark', 'rNot', '');
        ok(!!o.screens && o.screens[0] && o.screens[0].ig === null, 'M2 a shell without the room\u2019s sections reddens 3.rNot (the Instagram section is gone)', JSON.stringify(o.screens && o.screens[0] && o.screens[0].ig));
        fs.writeFileSync(P(PAGE), m2);
      } else ok(false, 'M2 anchor present');
    }
  } catch (e) {
    ok(false, `the room ran: ${e.message}`);
  } finally {
    for (const [rel, src] of restores) fs.writeFileSync(P(rel), src);
    const stop = await server.stop();
    ok(stop.portFree, `the dev server is stopped whole: port ${PORT} is free (the chair\u2019s rider, F-44.160); log ${server.log}`);
    ok(restores.every(([rel, src]) => sha(read(rel)) === sha(src)), 'every mutated file is restored byte for byte (sha re-checked)');
  }

  sec('5  pure mutations');
  const doorSrc = read(DOOR);
  const DM = loadTs(DOOR, doorSrc.replace("if (u.protocol !== 'https:') return null;", ''));
  ok(DM.asIgDoor({ ok: true, state: 'on', authorize_url: 'http://www.instagram.com/x' }) !== null, 'M3 the https check removed admits an http address (2.3 would redden)');
  const DM2 = loadTs(DOOR, doorSrc.replace("if (typeof body.state !== 'string' || !STATES.includes(body.state)) return null;", ''));
  ok(DM2.asIgDoor({ ok: true, state: 'live' }) !== null, 'M4 the state check removed admits an unknown state (2.3 would redden)');

  console.log(`\nb126: ${pass} passed, ${fail} failed${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  process.exit(fail ? 1 : 0);
})();
