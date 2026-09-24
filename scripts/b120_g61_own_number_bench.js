'use strict';
// scripts/b120_g61_own_number_bench.js · TDW CE-45 · G6-1 · CUT ONE (FE_1, dreamos-pwa). Rung b120.
//
// WHAT IT HOLDS. The Number room grows a flow behind a door that does not exist yet (ruling F-a (a),
// FK1): an absent, shut or malformed door renders the SHELL exactly as at 320ad7e; the flow draws
// only when the door is open AND every flow byte is the founder's (the chair, 2026-09-24: "a screen
// whose byte is owed renders the shell until the byte is his"). In the flow: Meta's SDK loads on her
// tap and never on load; the pwa holds no Meta constant (the door's `launch` carries them); the moved
// way is stated twice before anything opens (§7b constraint 1, c-45.30); the code is posted the
// moment it arrives (c-45.27); the window listener trusts only https facebook.com origins.
//
// DRIVEN IN THE REAL ROOM (C-43.18): `next dev` with the door AND Meta's SDK mocked at the network,
// a real headless Chromium resolved the pwa's way (CHROME_BIN, then @sparticuz/chromium), both
// themes. Without a browser the room cells are DECLARED RED, never skipped.
//
// THE BYTES ARE THE FOUNDER'S (O1 to O11, "ok", 2026-09-24), pinned below by sha, so the tree's
// own room draws the flow on an open door and §4 needs no plant. AMENDED BY LABEL, FE_1 turn A:
// the first cut ran with every slot null and planted 'PH-<key>' bytes; §1.1, §2.7, §3.sOpen and
// §5 M1 changed meaning with the landing, each amended at its site. Mutations of production code
// (§5) are restored byte for byte in a `finally`, their sha re-checked.
//
// NO CLOCK IS READ by any file this cut adds (§1.9 proves it), so C-44.13's shifted clocks have
// nothing to shift; the bench says so rather than running three identical passes.
//
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
let pass = 0; let fail = 0; const failed = [];
function ok(cond, name, info) { if (cond) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info ? '  [' + String(info).slice(0, 240) + ']' : ''}`); } }
const sec = (t) => console.log(`\n§${t}`);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

const PAGE = 'app/vendor/(shell)/number/page.tsx';
const FLOWC = 'components/solutions/OwnNumberFlow.tsx';
const HOOK = 'hooks/vendor/useOwnNumberRoom.ts';
const DOOR = 'lib/vendor/ownNumberDoor.ts';
const SDK = 'lib/vendor/metaSignup.ts';
const BYTES = 'lib/worklist/ownNumberFlow.ts';
const ROUTES = 'lib/solutions/routes.ts';
const ADDED = [FLOWC, HOOK, DOOR, SDK, BYTES];

function loadTs(rel, src) {
  const out = ts.transpileModule(src === undefined ? read(rel) : src, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => {
    if (spec === '@/lib/vendor/ownNumberDoor') return loadTs(DOOR);
    return require(spec);
  }, mod, mod.exports);
  return mod.exports;
}

(async () => {
  sec('1  the source');
  const page = read(PAGE);
  const all = ADDED.map((f) => [f, read(f)]);
  const BYTES_SRC = read(BYTES);
  // AMENDED BY LABEL (turn A): was "eighteen slots, every one null". The founder's bytes landed.
  const VETOED = {
    // AMENDED BY LABEL · CE-45 G6-1 FE_2: five slots renamed by the founder (2026-09-24, "ok"); were
    // 9664956abe80b387, 5c80f6df791d9daf, bf56c14aa817a134, 40886584e9c87ffa, 8cb184492cd65aa6.
    consentHead: 'ef491990814fc2aa', sharedWay: '3ccfc6185949e50f', sharedGo: '72f9695c0f051d5d',
    movedWay: '02b23d7ee2c02e79', movedGo: '7ab492fb33187bc8', movedConfirm: 'd2d785d3349f20e3',
    movedConfirmGo: 'da7d92320cd0e2af', personalNumber: 'f8cb1adf6088b639', whoPays: '9558ba61218d2c9c',
    cancel: 'a0e63d7c7125d29a', connecting: 'f30c2ee0d49c456c', pending: 'bca103ca42a323f1',
    active: '1db668753387524b', suspended: 'f5f494a6cd724cb4', movedOut: '2bdb248a7d6a4c2b',
    stopped: '9a6a919ed3fe7efe', metaError: 'ee3a6c55876debe6', expired: 'd11460af28f8c376',
  };
  const FLOW = loadTs(BYTES).FLOW;
  const flowKeys = Object.keys(FLOW);
  const off = flowKeys.filter((k) => typeof FLOW[k] !== 'string' || sha(FLOW[k]).slice(0, 16) !== VETOED[k]);
  ok(flowKeys.length === 18 && Object.keys(VETOED).length === 18 && off.length === 0 && flowKeys.every((k) => k in VETOED),
    '1.1 every one of the eighteen slots holds the founder\u2019s vetoed byte, pinned by sha (O1 to O11)', off.join(','));
  ok(!/PH-/.test(BYTES_SRC) && !all.some(([, s]) => /PH-/.test(strip(s))) && !Object.values(FLOW).some((v) => /\b(Victor|Donna|Harvey|Mira)\b|\u2014|\w'\w/.test(v)),
    '1.2 no placeholder byte in the tree; no persona, em dash or straight apostrophe in any flow byte');
  ok(!all.some(([, s]) => /\b(Victor|Donna|Harvey|Mira)\b/.test(s)) && !/\b(Victor|Donna|Harvey|Mira)\b/.test(page), '1.3 no persona name in any file this cut touches (b40 C32)');
  const metaIdLike = /['"`]\d{12,20}['"`]/;
  ok(!all.some(([, s]) => metaIdLike.test(strip(s))) && !metaIdLike.test(strip(page)) && !/1425513376067685/.test(all.map((x) => x[1]).join('')),
    '1.4 the pwa holds no Meta id: no app or configuration id literal in any file (FK1)');
  ok(all.filter(([, s]) => /connect\.facebook\.net/.test(strip(s))).map(([f]) => f).join() === SDK, '1.5 the SDK address lives in metaSignup.ts alone');
  const sdkSrc = strip(read(SDK));
  ok(!/^\s*(loadSdk|launchSignup)\(/m.test(sdkSrc) && !/useEffect/.test(strip(read(FLOWC))) && !/metaSignup/.test(strip(page)) && !/metaSignup/.test(strip(read(HOOK))),
    '1.6 nothing loads the SDK on mount: no top-level call, no effect in the flow, the page and the hook never import it');
  ok(/if \(room\.mode !== 'shell'\) return <OwnNumberFlow room=\{room\} \/>;/.test(page), '1.7 the page makes one decision and hands the flow its room');
  ok(/ownNumber:\s+\(\) => `\$\{SOLUTIONS_API_PATH\}\/number`,/.test(read(ROUTES)) && /ownNumberConnect:\s+\(\) => `\$\{SOLUTIONS_API_PATH\}\/number\/connect`,/.test(read(ROUTES)),
    '1.8 the two doors stand at the ruled addresses beside their siblings (FK1)');
  ok(!all.some(([, s]) => /new Date\(|Date\.now\(/.test(strip(s))), '1.9 no file this cut adds reads a clock (C-44.13 has nothing to shift)');
  ok(!/>\s*[A-Za-z][^<{]*</.test(strip(read(FLOWC))), '1.10 no text node typed into the flow: every word is read from a copy home');

  sec('2  the pure logic');
  const D = loadTs(DOOR);
  const S = loadTs(SDK);
  const B = loadTs(BYTES);
  const L = { app_id: '1111111111111111', config_id: '2222222222222222', graph_version: 'v25.0' };
  const good = { ok: true, open: true, reason: null, reason_text: null, launch: L, number: null };
  ok(!!D.asDoor(good) && D.asDoor(good).launch.extras.shared === null, '2.1 a well-formed open door is read, extras default to null');
  const hostile = [undefined, null, 0, 1, '', 'x', [], {}, { ok: false }, { ok: 'true', open: true }, { ok: true },
    { ok: true, open: 'yes' }, { ok: true, open: true, launch: null }, { ok: true, open: true, launch: { ...L, app_id: 'abc' } },
    { ok: true, open: true, launch: { ...L, graph_version: '25' } }, { ok: true, open: false, number: { status: 'live', display_number: '+91 1', way: 'shared' } },
    { ok: true, open: false, number: { status: 'active', display_number: '<b>', way: 'shared' } }, { ok: true, open: false, reason: 7 },
    { ok: true, open: true, launch: { ...L, extras: 'x' } }, { ok: true, open: true, launch: { ...L, extras: { shared: [] } } }];
  let threw = null; let admitted = [];
  for (const h of hostile) { try { if (D.asDoor(h) !== null) admitted.push(JSON.stringify(h)); } catch (e) { threw = e.message; } }
  ok(threw === null && admitted.length === 0, '2.2 twenty hostile bodies: every one is a failed read (null), none throws', threw || admitted.join(' | '));
  const shut = D.asDoor({ ...good, open: false });
  const withNum = D.asDoor({ ...good, number: { status: 'active', display_number: '+91 98882 94440', way: 'shared', quality_rating: null } });
  ok(D.roomMode(null, true) === 'shell' && D.roomMode(D.asDoor(good), false) === 'shell' && D.roomMode(shut, true) === 'shell'
    && D.roomMode(D.asDoor(good), true) === 'flow' && D.roomMode(withNum, true) === 'status' && D.roomMode(withNum, false) === 'shell',
    '2.3 the one decision: absent, owed bytes, or shut -> shell; open -> flow; a number -> status');
  const fin = JSON.stringify({ type: 'WA_EMBEDDED_SIGNUP', event: 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING', version: 3, data: { waba_id: '524126980791429' } });
  const got = S.parseEsMessage('https://www.facebook.com', fin);
  ok(!!got && got.waba_id === '524126980791429' && got.phone_number_id === null && got.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING',
    '2.4 the shared-way message is read with its WABA and no phone number id (c-45.28)');
  const origins = ['https://evilfacebook.com', 'http://www.facebook.com', 'https://facebook.com.evil.io', 'https://www.facebook.com:8443', null, 7];
  ok(origins.every((o) => S.parseEsMessage(o, fin) === null) && !!S.parseEsMessage('https://business.facebook.com', fin) && !!S.parseEsMessage('https://facebook.com', fin),
    '2.5 only https facebook.com or its subdomains are trusted');
  let pthrew = null;
  for (const raw of [undefined, null, '', '{', '[]', '{"type":"X"}', 5, { type: 'WA_EMBEDDED_SIGNUP', data: 9 }, JSON.stringify({ type: 'WA_EMBEDDED_SIGNUP', data: { waba_id: 7 } })]) {
    try { const r = S.parseEsMessage('https://www.facebook.com', raw); if (r && r.waba_id !== null) pthrew = 'admitted ' + JSON.stringify(raw); } catch (e) { pthrew = e.message; }
  }
  ok(pthrew === null, '2.6 hostile message bodies never throw and never yield an id', pthrew);
  // AMENDED BY LABEL (turn A): was "the tree's gate says not ready". It now says ready, and one null still shuts it.
  ok(B.flowBytesReady() === true && B.flowBytesReady({ ...B.FLOW, expired: null }) === false && B.flowBytesReady({ ...B.FLOW, cancel: '' }) === false,
    '2.7 the tree\u2019s gate is open with every byte landed; one null or empty byte still keeps the shell');

  sec('3 and 4  the real room, both themes (C-43.18)');
  const PORT = 3990;
  const SHOTS = path.join(require('os').tmpdir(), 'b120_shots');
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], {
    cwd: ROOT, stdio: 'ignore', detached: true,
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` },
  });
  const up = async () => {
    for (let i = 0; i < 120; i += 1) {
      try { const r = await fetch(`http://localhost:${PORT}/`); if (r) return true; } catch (_e) { /* not yet */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
  };
  // e-94's CURE (FE_2): a mutation run passes shots = '' so the bench's shot folder only ever holds unmutated screens.
  const probe = (mode, scenario, shots = SHOTS) => {
    const r = spawnSync('node', [P('scripts/lib/b120_own_number_probe.mjs'), String(PORT), mode, scenario, shots], { encoding: 'utf8', timeout: 240000,
      env: { ...process.env, B120_TAPS: JSON.stringify({ sharedGo: FLOW.sharedGo, movedGo: FLOW.movedGo, movedConfirmGo: FLOW.movedConfirmGo }) } });
    if (r.status === 3) return { noBrowser: true, text: r.stdout };
    try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 300)}` }; }
  };
  const shellCopy = loadTs('lib/worklist/ownNumber.ts').NUMBER;
  const isShell = (s) => !!s && s.section === true && s.step === null && JSON.stringify(s.buttons) === '["Connect"]'
    && s.texts.includes('Coming') && s.texts.includes(shellCopy.lede) && shellCopy.can.every((c) => s.texts.includes(c));
  const PH = (k) => FLOW[k];   // AMENDED BY LABEL (turn A): the cells read her words, not placeholders.
  const bytesSha = sha(BYTES_SRC);
  const mutate = (rel, from, to) => { const src = read(rel); const m = src.replace(from, to); if (m === src) return null; fs.writeFileSync(P(rel), m); return src; };
  const restores = [];
  let browserOk = true;
  const guard = (o, label) => {
    if (o.noBrowser) { ok(false, `${label}: a browser is available to drive the room (C-43.18). Tried: ${o.text}`); browserOk = false; return false; }
    if (o.error) { ok(false, `${label}: the probe ran: ${o.error}`); return false; }
    if (o.errors && o.errors.length) { ok(false, `${label}: the page raised no error`, o.errors.join(' | ')); return false; }
    return true;
  };
  try {
    if (!(await up())) throw new Error('next dev did not come up');
    await new Promise((r) => setTimeout(r, 5000));
    for (const mode of ['dark', 'light']) {
      for (const sc of ['s404', 'sBad', 'sShut', 'sOpen']) {
        const o = probe(mode, sc);
        if (!guard(o, `3.${sc} ${mode}`)) { if (!browserOk) break; continue; }
        const [land, after] = o.screens;
        if (sc === 'sOpen') {
          // AMENDED BY LABEL (turn A): was "the tree's room is the shell on an open door". The bytes are his now.
          ok(!!land && land.step === 'room' && land.texts.includes('Not connected') && JSON.stringify(land.buttons) === '["Connect"]' && o.sdkRequests.length === 0,
            `3.sOpen ${mode}: an open door draws the flow's room, "Not connected", one Connect, and Meta is not loaded`, JSON.stringify(land));
          continue;
        }
        ok(isShell(land) && isShell(after) && /Launching soon\./.test(after.body) && o.sdkRequests.length === 0,
          `3.${sc} ${mode}: the room is the shell exactly, Connect says "Launching soon.", Meta never loads`,
          JSON.stringify({ land: land && land.step, buttons: land && land.buttons, sdk: o.sdkRequests.length }));
      }
      if (!browserOk) break;
    }
    if (browserOk) {
      sec('4  the flow, in the founder\u2019s own words');
      const runs = [['dark', 'sFlowShared'], ['light', 'sFlowShared'], ['dark', 'sFlowMoved'], ['dark', 'sCancel'], ['dark', 'sNoSdk'], ['dark', 'sStatus'], ['light', 'sStatus']];
      for (const [mode, sc] of runs) {
        const o = probe(mode, sc);
        if (!guard(o, `4.${sc} ${mode}`)) continue;
        const sc0 = o.screens[0]; const last = o.screens[o.screens.length - 1];
        if (sc === 'sFlowShared') {
          const consent = o.screens[1];
          ok(consent.step === 'consent' && ['consentHead', 'sharedWay', 'movedWay', 'personalNumber', 'whoPays'].every((k) => consent.texts.includes(PH(k)))
            && JSON.stringify(consent.buttons) === JSON.stringify([PH('sharedGo'), PH('movedGo'), PH('cancel')]),
            `4.shared ${mode}: the consent screen states both ways, the personal-number line and who pays, with three controls`, JSON.stringify(consent));
          ok(o.sdkRequests.length === 1 && o.sdkRequests[0].screen >= 2, `4.shared ${mode}: Meta's SDK is requested once, only after her tap`, JSON.stringify(o.sdkRequests));
          ok(!!last.fbInit && last.fbInit.appId === '1111111111111111' && last.fbInit.version === 'v25.0' && !!last.fbLogin && last.fbLogin.config_id === '2222222222222222'
            && last.fbLogin.response_type === 'code' && last.fbLogin.override_default_response_type === true && last.fbLogin.extras && last.fbLogin.extras.probe_way === 'shared',
            `4.shared ${mode}: the launch uses the DOOR's app id, configuration and the shared way's extras`, JSON.stringify({ i: last.fbInit, l: last.fbLogin }));
          ok(o.posts.length === 1 && o.posts[0].body.code === 'PROBE-CODE' && 'waba_id' in o.posts[0].body && 'phone_number_id' in o.posts[0].body && 'business_id' in o.posts[0].body && 'event' in o.posts[0].body
            && typeof last.codeAt === 'number' && o.posts[0].at - last.codeAt < 3000,
            `4.shared ${mode}: the code is posted once, with the ruled body, within three seconds of arriving (c-45.27)`, JSON.stringify({ posts: o.posts, codeAt: last.codeAt }));
          ok(last.step === 'status' && last.status === 'pending' && last.texts.includes('+91 98882 94440') && last.texts.includes(PH('pending')),
            `4.shared ${mode}: the door's answer is drawn: her number, pending, in her words`, JSON.stringify(last));
        }
        if (sc === 'sFlowMoved') {
          const [, consent, confirm] = o.screens;
          ok(consent.texts.includes(PH('movedWay')) && confirm.step === 'confirm' && confirm.texts.includes(PH('movedConfirm'))
            && JSON.stringify(confirm.buttons) === JSON.stringify([PH('movedConfirmGo'), PH('cancel')]),
            `4.moved ${mode}: the moved way is stated twice, on two screens, before anything opens (§7b constraint 1)`, JSON.stringify(confirm));
          ok(o.sdkRequests.length === 1 && o.sdkRequests[0].screen >= 3, `4.moved ${mode}: Meta is not loaded until the SECOND confirmation`, JSON.stringify(o.sdkRequests));
          ok(!!last.fbLogin && last.fbLogin.extras && last.fbLogin.extras.probe_way === 'moved', `4.moved ${mode}: the moved way's extras are the ones launched`);
          ok(last.step === 'room' && last.texts.includes(PH('expired')) && !last.texts.includes('server words'),
            `4.moved ${mode}: an expired code reads as HER expiry line, not the server's words`, JSON.stringify(last.texts));
        }
        if (sc === 'sCancel') ok(o.posts.length === 0 && last.step === 'room' && last.texts.includes(PH('stopped')),
          `4.cancel ${mode}: a stop posts nothing and says so in her words`, JSON.stringify(last.texts));
        if (sc === 'sNoSdk') ok(o.posts.length === 0 && last.step === 'room' && last.texts.includes(loadTs('lib/solutions/copy.ts').COPY.surfaceUnavailable),
          `4.nosdk ${mode}: when Meta's script is refused, nothing is posted and the room says it could not load (COPY.surfaceUnavailable)`, JSON.stringify(last.texts));
        if (sc === 'sStatus') ok(sc0.step === 'status' && sc0.status === 'active' && sc0.texts.includes('Connected') && sc0.texts.includes(PH('active')) && sc0.buttons.length === 0,
          `4.status ${mode}: a number on file shows its state and chip, and no control this cut`, JSON.stringify(sc0));
      }

      sec('5  mutations of production code');
      // AMENDED BY LABEL (turn A): M1 was "the gate always says ready" against a tree of nulls. Re-aimed:
      // ONE landed byte nulled must turn 3.sOpen red, the room falling back to the shell.
      const m1 = mutate(BYTES, /^(  expired:\s+)'[^']*',$/m, '$1null,');
      ok(m1 !== null, '5.0 M1 applies (one landed byte, expired, nulled)');
      if (m1 !== null) {
        restores.push([BYTES, m1]);
        await new Promise((r) => setTimeout(r, 6000));
        const o = probe('dark', 'sOpen', '');
        ok(!o.noBrowser && !o.error && isShell(o.screens && o.screens[0]), '5.1 M1 turns 3.sOpen red: one owed byte and the open door draws the shell', JSON.stringify(o.screens && o.screens[0] && o.screens[0].step));
        fs.writeFileSync(P(BYTES), m1);
      }
      const m4 = mutate(FLOWC, "onClick={() => setStep('confirm')}", "onClick={() => { void go('moved'); }}");
      ok(m4 !== null, '5.2 M4 applies (the moved way skips its second confirmation)');
      if (m4 !== null) {
        restores.push([FLOWC, m4]);
        await new Promise((r) => setTimeout(r, 6000));
        const o = probe('dark', 'sFlowMoved', '');
        const confirm = o.screens && o.screens[2];
        ok(!(confirm && confirm.step === 'confirm'), '5.3 M4 turns the twice-stated cell red: no confirmation screen appears', JSON.stringify(confirm));
        fs.writeFileSync(P(FLOWC), m4);
      }
    }
  } catch (e) {
    ok(false, `3.x the room run: ${String(e && e.message).split('\n')[0]}`);
  } finally {
    for (const [rel, src] of restores) fs.writeFileSync(P(rel), src);
    fs.writeFileSync(P(BYTES), BYTES_SRC);
    try { process.kill(-dev.pid); } catch (_e) { /* gone */ }
  }
  ok(sha(read(BYTES)) === bytesSha, '5.4 the flow home is restored byte for byte');

  sec('6  pure mutations');
  const doorSrc = read(DOOR);
  const DM = loadTs(DOOR, doorSrc.replace('if (door.open && door.launch) return \'flow\';', 'if (door.launch) return \'flow\';'));
  ok(DM.roomMode(D.asDoor({ ...good, open: false }), true) === 'flow', '6.1 M2 (the open check dropped) would open a SHUT door: 2.3 would go red');
  const sdkMut = read(SDK).replace("if (typeof origin !== 'string' || !META_ORIGIN.test(origin)) return null;", "if (typeof origin !== 'string' || !origin.endsWith('facebook.com')) return null;");
  const SM = loadTs(SDK, sdkMut);
  ok(sdkMut !== read(SDK) && SM.parseEsMessage('https://evilfacebook.com', fin) !== null, '6.2 M3 (a bare endsWith) admits evilfacebook.com: 2.5 would go red');

  console.log(`\nb120 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.log(`b120 CRASHED: ${(e && e.stack) || e}`); process.exit(1); });
