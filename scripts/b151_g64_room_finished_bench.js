// scripts/b151_g64_room_finished_bench.js · TDW CE-46 · G6-4 · THE ROOM FINISHED · RUNG b151 (dreamos-pwa half).
// The mock approved 28 September 2026, made real: the number in a box (t2, no new rung), its state and way lines, "Remove this
// number" in the room's accent; the sheet (F-b's words, Cancel then Remove, critical and outlined, never filled); removing; refused
// (R9); removed with the S6 line (F-c) in the flow AND in the shell; the quiet control as a radiogroup (F-g's line); N4 struck (Q-a).
// §1 reads the source; §2 drives the REAL room in headless Chromium against next dev in mock mode (C-43.18), both themes, 374 wide,
// every read answered by the stand-in (scripts/lib/b151_own_number_room_probe.mjs); §3 mutates production code, each mutation must
// turn its cell red, and the file is restored byte for byte by sha. The dev server is stopped BY PID (e-222), never by pattern.
// usage: node scripts/b151_g64_room_finished_bench.js [--source] [--no-mutate]      THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
let pass = 0; let fail = 0;
function ok(cond, name, info) { if (cond) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; console.log(`  FAIL  ${name}${info ? '  [' + String(info).slice(0, 300) + ']' : ''}`); } }
const sec = (t) => console.log(`\n§${t}`);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 3995;

const PAGE = 'app/vendor/(shell)/number/page.tsx';
const FLOWC = 'components/solutions/OwnNumberFlow.tsx';
const SHEET = 'components/solutions/RemoveNumberSheet.tsx';
const META = 'components/solutions/MetaRoomSections.tsx';
const DOOR = 'lib/vendor/ownNumberDoor.ts';
const BYTES = 'lib/worklist/ownNumberFlow.ts';
const METAB = 'lib/worklist/metaRoom.ts';
const NCOPY = 'lib/worklist/ownNumber.ts';
const ROUTES = 'lib/solutions/routes.ts';

function loadTs(rel) {
  const out = ts.transpileModule(read(rel), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => require(spec), mod, mod.exports);
  return mod.exports;
}
const NUM = '+91 87577 88550';
const hex2rgb = (h) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(h).trim()); return m ? `rgb(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)})` : String(h).trim(); };

async function startDev() {
  fs.rmSync(P('.next'), { recursive: true, force: true }); // A-45.5
  const log = fs.openSync(path.join(process.env.TMPDIR || '/tmp', 'b151-dev.log'), 'w');
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], { cwd: ROOT, detached: true, stdio: ['ignore', log, log],
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  for (let i = 0; i < 240; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '120', `http://localhost:${PORT}/vendor/number`], { encoding: 'utf8' });
    if (/^[23]/.test(r.stdout)) return dev;
    await sleep(1000);
  }
  stopDev(dev); return null;
}
function stopDev(dev) {
  const stop = P('scripts/lib/stop_tree.js');
  if (fs.existsSync(stop)) { require(stop).stopTree(dev.pid); return; }
  try { process.kill(-dev.pid, 'SIGTERM'); } catch (_e) { /* the group is gone */ }
}
function probe(mode, list) {
  const r = spawnSync(process.execPath, [P('scripts/lib/b151_own_number_room_probe.mjs'), String(PORT), mode, list], { cwd: ROOT, encoding: 'utf8', timeout: 600000 });
  if (r.status === 3) return { noBrowser: true };
  try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(-300)}` }; }
}

(async () => {
  console.log('b151 · the room finished (G6-4)');
  sec('1  the source');
  const FLOW = loadTs(BYTES).FLOW; const QUIET = loadTs(METAB).QUIET; const NUMBER = loadTs(NCOPY).NUMBER;
  ok(FLOW.active === 'Connected. TDW answers for you on this number.' && FLOW.wayShared === 'Works on your phone and in TDW app.' && FLOW.wayMoved === 'Works only in TDW app.'
    && FLOW.remove === 'Remove this number' && FLOW.removeGo === 'Remove' && FLOW.removeCancel === 'Cancel'
    && FLOW.removing === 'Removing your number.' && FLOW.removeRefused === 'This number could not be removed just now. Nothing has changed. Please try again.',
  '1.1 the ruled bytes (F-e, F-f, the button, F-b\u2019s buttons, R8, R9) in the flow\u2019s one home');
  ok(FLOW.removeShared === 'TDW will stop answering on {number}. Your WhatsApp Business app keeps working. To finish, open WhatsApp Business: Settings, Account, Business Platform, Disconnect.'
    && FLOW.removeMoved === 'TDW will stop answering on {number} and it will stop working through TDW. To use it in the WhatsApp app again, set it up there with this number.'
    && FLOW.finishInApp === 'Finish removing {number} in WhatsApp Business: Settings, Account, Business Platform, Disconnect.', '1.2 F-b\u2019s two sheet lines and F-c\u2019s finish line, her number as data ({number})');
  const all = [FLOW, QUIET.line, NUMBER].map((x) => JSON.stringify(x)).join(' ');
  ok(!/\b(her|his|Her|His)\b/.test(all) && !/\u2014|\u2013/.test(all) && !/\b(Victor|Donna|Harvey|Mira|Eliza|Sarah)\b/.test(all), '1.3 no her or his, no dash, no persona name in any byte of the room (R-45.30)');
  // AMENDED BY LABEL · CE-47 FE-9 (4 Oct 2026, the chair's ruling): QT1 is v2's words, "someone" in place of "a couple".
  ok(QUIET.line === 'After you reply to someone yourself, TDW stays quiet in that chat for', '1.4 the quiet line is F-g\u2019s, in v2\u2019s words');
  ok(NUMBER.can.length === 2 && !NUMBER.can.some((c) => /missed call/i.test(c)), '1.5 N4 struck: no missed-call line in the can-do list (Q-a)');
  const D = loadTs(DOOR);
  const good = { ok: true, open: false, reason: null, reason_text: null, launch: null, number: null };
  ok(D.asDoor(good) && D.asDoor(good).removed === null, '1.6 a door from before this cut (no removed) still reads, removed null');
  ok(D.asDoor({ ...good, removed: { display_number: NUM, way: 'shared', finish_in_app: true } }).removed.finish_in_app === true
    && D.asDoor({ ...good, removed: { display_number: NUM, way: 'sideways', finish_in_app: true } }) === null
    && D.asDoor({ ...good, removed: { display_number: NUM, way: 'moved', finish_in_app: 'yes' } }) === null, '1.7 removed is validated: a malformed one makes the whole door unreadable (dark)');
  ok(/ownNumberRemove:\s*\(\) => `\$\{SOLUTIONS_API_PATH\}\/number\/remove`/.test(read(ROUTES)), '1.8 the remove door\u2019s address has one home in routes.ts');
  const sheet = strip(read(SHEET)); const flowc = strip(read(FLOWC)); const metac = strip(read(META));
  ok(/createPortal/.test(sheet) && /\.rm-btn\.danger\{border-color:var\(--role-critical\);color:var\(--role-critical\)\}/.test(sheet) && !/\.rm-btn\.danger\{[^}]*background:var/.test(sheet), '1.9 the sheet portals, and Remove is critical and outlined, never filled');
  ok(!/<select/.test(metac) && /role="radiogroup"/.test(metac) && /role="radio"/.test(metac), '1.10 the quiet control is a radiogroup; no browser select');
  ok(/<FinishInAppLine door=\{room\.door\} \/>/.test(strip(read(PAGE))) && /<FinishInAppLine door=\{door\} \/>/.test(flowc), '1.11 the S6 line is drawn by the shell (door shut) and by the flow, from one component');
  const texts = [flowc, sheet, metac, strip(read(PAGE))].join('\n');
  ok(!/>\s*[A-Z][a-z]+ [a-z]+[^<{]*</.test(texts.replace(/<style>[\s\S]*?<\/style>/g, '')), '1.12 no vendor-facing text node typed in the room\u2019s components (every word read from its home)');
  if (process.argv.includes('--source')) { console.log(`\nb151: ${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0); }

  sec('2  the real room, both themes, 374 wide (C-43.18)');
  const dev = await startDev();
  if (!dev) { ok(false, '2.0 next dev comes up'); console.log(`\nb151: ${pass} pass, ${fail} fail`); process.exit(1); }
  const ALL = 'shared,moved,sheetShared,sheetMoved,removing,refused,removed,shut';
  const check = (mode, o) => {
    const t = `[${mode}]`;
    if (o.noBrowser) { ok(false, `${t} a browser is available`); return; }
    if (o.error || !o.results) { ok(false, `${t} the probe ran`, o.error); return; }
    const R = o.results; const errs = Object.entries(R).filter(([, v]) => !v.loaded || v.pageErrors.length).map(([k, v]) => `${k}: ${v.loaded ? v.pageErrors.join(' | ') : 'not loaded'}`);
    ok(errs.length === 0, `2.0 ${t} every scenario mounts the room with no page error`, errs.join(' ; '));
    const s = R.shared && R.shared.at; const m = R.moved && R.moved.at;
    ok(s && s.own === 'status' && s.kicker === 'Connected' && JSON.stringify(s.box) === JSON.stringify([NUM, FLOW.active, FLOW.wayShared]), `2.1 ${t} shared: the box holds the number, the state line and the way line`, JSON.stringify(s && s.box));
    ok(m && JSON.stringify(m.box) === JSON.stringify([NUM, FLOW.active, FLOW.wayMoved]), `2.2 ${t} moved: its way line`, JSON.stringify(m && m.box));
    ok(s && s.numType && s.numType.size === 17 && s.numType.weight === 500 && s.numType.family === 'DM Sans', `2.3 ${t} the number sits at t2 (17 / 500 / DM Sans), no new rung`, JSON.stringify(s && s.numType));
    ok(s && JSON.stringify(s.buttons) === JSON.stringify([FLOW.remove]) && JSON.stringify(m.buttons) === JSON.stringify([FLOW.remove]), `2.4 ${t} one control under the box: Remove this number`, JSON.stringify(s && s.buttons));
    ok(Object.values(R).every((v) => v.at && !/missed call/i.test(v.at.bodyText)), `2.5 ${t} no missed-call line anywhere in the room (Q-a)`);
    const q = s && s.quiet; const qa = R.shared.afterQuiet && R.shared.afterQuiet.quiet;
    ok(q && q.group && !q.select && q.labelledBy === QUIET.line && q.radios.length === 4 && q.radios.map((r) => r.label).join('|') === QUIET.options.map((x) => x.label).join('|')
      && q.radios.filter((r) => r.checked === 'true').map((r) => r.label).join() === '2 hours' && q.radios.every((r) => r.h >= 44), `2.6 ${t} the quiet control: a labelled radiogroup of four 44px cells, 2 hours chosen, no select`, JSON.stringify(q));
    ok(R.shared.quietPosts.length === 1 && JSON.parse(R.shared.quietPosts[0]).minutes === 240 && qa && qa.radios.filter((r) => r.checked === 'true').map((r) => r.label).join() === '4 hours',
      `2.7 ${t} a tap on 4 hours posts 240 once and moves the choice; a tap on the chosen cell posts nothing`, JSON.stringify(R.shared.quietPosts));
    for (const [k, way, lineKey] of [['sheetShared', 'shared', 'removeShared'], ['sheetMoved', 'moved', 'removeMoved']]) {
      const x = R[k]; const sh = x && x.sheetOpen && x.sheetOpen.sheet;
      ok(sh && sh.state === 'asking' && sh.way === way && sh.role === 'dialog' && sh.modal === 'true' && sh.inShell && sh.number === NUM && sh.line === FLOW[lineKey].split('{number}').join(NUM),
        `2.8 ${t} ${way}: the sheet opens in the shell\u2019s scope with F-b\u2019s words and her number`, JSON.stringify(sh));
      ok(sh && JSON.stringify(sh.buttons) === JSON.stringify([FLOW.removeCancel, FLOW.removeGo]) && sh.dangerBorder === hex2rgb(sh.critical) && sh.dangerColor === hex2rgb(sh.critical) && /rgba\(0, 0, 0, 0\)|transparent/.test(sh.dangerBg),
        `2.9 ${t} ${way}: Cancel first, Remove second in the critical role, outlined and never filled`, JSON.stringify(sh && { b: sh.buttons, c: sh.critical, bo: sh.dangerBorder, bg: sh.dangerBg }));
      ok(x && x.afterEscape && x.afterEscape.sheet === null && x.posts.length === 0 && x.afterEscape.own === 'status', `2.10 ${t} ${way}: Escape closes the sheet; nothing was posted`);
    }
    const rg = R.removing; ok(rg && rg.after && rg.after.sheet && rg.after.sheet.state === 'removing' && rg.after.sheet.buttons.length === 0 && rg.posts.length === 1 && rg.after.sheet.line === FLOW.removing,
      `2.11 ${t} removing: the state stated (R8), no control, one post`, JSON.stringify(rg && rg.after && rg.after.sheet));
    const rf = R.refused; ok(rf && rf.after && rf.after.sheet === null && rf.after.refused === FLOW.removeRefused && JSON.stringify(rf.after.box) === JSON.stringify([NUM, FLOW.active, FLOW.wayShared]) && JSON.stringify(rf.after.buttons) === JSON.stringify([FLOW.remove]),
      `2.12 ${t} refused: the box unchanged, R9 under it, the control still there (F-a (a))`, JSON.stringify(rf && rf.after && { r: rf.after.refused, b: rf.after.box }));
    const rm = R.removed; const fin = FLOW.finishInApp.split('{number}').join(NUM);
    ok(rm && rm.after && rm.after.own === 'room' && rm.after.kicker === 'Not connected' && rm.after.finish === fin && JSON.stringify(rm.after.buttons) === JSON.stringify(['Connect']) && rm.posts.length === 1 && rm.posts[0] === '{}',
      `2.13 ${t} removed: back to the unconnected room with the S6 line (F-c) and Connect; one post, an empty body`, JSON.stringify(rm && rm.after && { own: rm.after.own, k: rm.after.kicker, f: rm.after.finish, b: rm.after.buttons, p: rm.posts }));
    const sh2 = R.shut && R.shut.at; ok(sh2 && sh2.own === 'shell' && sh2.finish === fin && JSON.stringify(sh2.buttons) === JSON.stringify(['Connect']), `2.14 ${t} the door shut: the shell draws the same S6 line`, JSON.stringify(sh2 && { own: sh2.own, f: sh2.finish, b: sh2.buttons }));
  };
  const MUTATE = !process.argv.includes('--no-mutate');
  try {
    for (const mode of ['dark', 'light']) check(mode, probe(mode, ALL));
    if (MUTATE) {
      sec('3  mutations of production code (each must turn its cell red; restored byte for byte)');
      const muts = [
        ['M1 the sheet fills Remove', SHEET, '.tdw-rmnum .rm-btn.danger{border-color:var(--role-critical);color:var(--role-critical)}', '.tdw-rmnum .rm-btn.danger{border-color:var(--role-critical);color:#fff;background:var(--role-critical)}',
          'sheetShared', (R) => { const sh = R.sheetShared.sheetOpen.sheet; return sh.dangerColor === hex2rgb(sh.critical) && /rgba\(0, 0, 0, 0\)|transparent/.test(sh.dangerBg); }],
        ['M2 the room removes on the first tap (no sheet)', FLOWC, "onClick={() => { setRefused(false); setSheet('asking'); }}", 'onClick={() => { setRefused(false); void removeNow(); }}',
          'sheetShared', (R) => R.sheetShared.posts.length === 0 && !!R.sheetShared.sheetOpen.sheet],
        ['M3 the S6 line dropped from the shell', PAGE, '        <FinishInAppLine door={room.door} />\n', '',
          'shut', (R) => R.shut.at.finish === FLOW.finishInApp.split('{number}').join(NUM)],
        ['M4 the quiet control posts on the chosen cell too', META, 'onClick={() => { if (!on) void pick(o.minutes); }}', 'onClick={() => { void pick(o.minutes); }}',
          'shared', (R) => R.shared.quietPosts.length === 1],
        ['M5 a refusal empties the box', FLOWC, 'setRefused(true); setSheet(null);\n    } catch', "setRefused(true); setSheet(null); room.setDoor({ ...door, number: null });\n    } catch",
          'refused', (R) => R.refused.after.refused === FLOW.removeRefused && !!R.refused.after.box],
      ];
      for (const [id, rel, from, to, sc, green] of muts) {
        const src = read(rel); const h = sha(src);
        if (!src.includes(from)) { ok(false, `3 ${id}: the anchor exists`, rel); continue; }
        let red = false;
        try { fs.writeFileSync(P(rel), src.replace(from, to)); await sleep(8000); const o = probe('dark', sc); red = !(o.results && o.results[sc] && o.results[sc].loaded && green(o.results)); }
        catch (_e) { red = true; } finally { fs.writeFileSync(P(rel), src); }
        ok(red && sha(read(rel)) === h, `3 ${id}: turns its cell red, restored by sha`);
        await sleep(8000);
      }
    }
  } finally { stopDev(dev); }
  console.log(`\nb151: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('b151 crashed:', e && e.stack); process.exit(2); });
