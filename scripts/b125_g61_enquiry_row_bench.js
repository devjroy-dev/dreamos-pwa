'use strict';
// scripts/b125_g61_enquiry_row_bench.js · TDW CE-45 · G6-1 · FE_2 (pwa half) · rung b125.
//
// WHAT IT HOLDS (§7c; FE_2 read-first FK3, FK5; E1 to E12 his, "ok" 2026-09-24):
//  · the words: E1 to E11 byte-exact to his table (sha), E10 and E12 imported from their approved homes, not retyped;
//  · the row in the REAL Settings room (headless Chromium, `next dev`, /me answered at the network, both themes):
//    three options, TDW checked by default, rung 3 disabled with its state stated (F-19.20); choosing "Straight to my
//    WhatsApp" writes NOTHING until the second screen's confirm (FK3), where both consent statements stand above it;
//    a phone that is not a phone is caught before any write; the confirm writes {own_number, phone}; back to TDW is
//    one tap, one write; cancel writes nothing; the disabled rung does nothing;
//  · FK5: the row settles ONLY on the door's answer: a silent refusal and an older door that drops the field both
//    leave the row where it was, and say so in the approved failed line.
// Mutations of production code are restored byte for byte (sha re-checked). A-45.4: files a run may mutate are
// copied aside before it and checked after it by the caller (the card's block and the seat's own runs).
// No clock is read. THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const P = (r) => path.join(ROOT, r);
const read = (r) => fs.readFileSync(P(r), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

const WORDS = 'lib/worklist/enquiryRouting.ts';
const PAGE = 'app/vendor/(shell)/settings/page.tsx';
function loadTs(rel, src) {
  const out = ts.transpileModule(src === undefined ? read(rel) : src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => {
    if (spec === '@/lib/worklist/ownNumberFlow') return loadTs('lib/worklist/ownNumberFlow.ts');
    if (spec === '@/lib/solutions/copy') return loadTs('lib/solutions/copy.ts');
    return require(spec);
  }, mod, mod.exports);
  return mod.exports;
}

(async () => {
  sec('1  the words');
  const W = loadTs(WORDS);
  // AMENDED BY LABEL · FE_2b (his "yes", 2026-09-24): tdw, tdwLine, own, ownLine, waba, wabaLine and phoneInvalid
  // re-cut; were "Through TDW", "TDW answers for you in your voice, and every enquiry lands in your leads.",
  // "Straight to my WhatsApp", "Couples message the number you type here.", "My own number in TDW app",
  // "Arrives with Own number", "Enter a WhatsApp number with its country code.". tdwLine carries U+2019 (R-40.57).
  const VETOED = { label: 'Where enquiries go', line: 'Choose where couples land when they tap Enquire on WhatsApp on your page.',
    tdw: 'Your TDW agent answers', tdwLine: 'Couples message TDW\u2019s number. Your agent replies for you and files every enquiry as a lead.',
    own: 'You answer on your number', ownLine: 'Couples message your WhatsApp. You reply yourself; nothing comes to TDW.',
    waba: 'Your TDW agent answers on your number',
    wabaLine: 'Couples message your WhatsApp. Your agent replies for you there. Available once your own number is connected.',
    consentPublic: 'This number will be shown on your public page, where anyone can see it.',
    consentBypass: 'Enquiries sent there skip TDW: no replies from TDW, and they will not appear in your leads.',
    phoneLabel: 'Your WhatsApp number', confirm: 'Yes, send enquiries to this number', phoneInvalid: 'Enter a WhatsApp number.' };
  const PIN = Object.fromEntries(Object.entries(VETOED).map(([k, v]) => [k, sha(v).slice(0, 16)]));
  const off = Object.keys(VETOED).filter((k) => typeof W.ENQ[k] !== 'string' || sha(W.ENQ[k]).slice(0, 16) !== PIN[k]);
  ok(off.length === 0 && Object.keys(W.ENQ).length === 13, '1.1 E1 to E11 (thirteen strings) byte-exact to his table', off.join(','));
  ok(W.ENQ_CANCEL === 'Not now' && /ENQ_CANCEL: string = String\(FLOW\.cancel\)/.test(read(WORDS))
    && W.ENQ_FAILED === loadTs('lib/solutions/copy.ts').COPY.surfaceUnavailable && /ENQ_FAILED: string = COPY\.surfaceUnavailable/.test(read(WORDS)),
    '1.2 E10 and E12 are IMPORTED from their approved homes, never retyped');
  ok(!Object.values(W.ENQ).some((v) => /\b(Victor|Donna|Harvey|Mira)\b|\u2014|\w'\w/.test(v)), '1.3 no persona name, em dash or straight apostrophe in any byte');
  const good = ['+91 87577 88550', '9888294440', '+1 (415) 555-0123', '918757788550123'];
  const bad = ['12345', '123456789', '9123456789012345', 'abc9888294440', '', '   '];
  ok(good.every(W.phoneLooksRight) && !bad.some(W.phoneLooksRight), '1.4 the row\u2019s phone check is the door\u2019s rule (10 to 15 digits, optional +)');
  const pg = strip(read(PAGE));
  ok(/<EnquiryRoutingRow \/>/.test(pg) && /<ExchangeOptInSwitch \/>\s*<EnquiryRoutingRow \/>/.test(pg), '1.5 the row is mounted once, beside the two switches, in settings/page.tsx');
  // (?<!=) : a `>` that belongs to `=>` (a TypeScript arrow) is not a JSX tag's close.
  ok(!/(?<!=)>\s*[A-Za-z][^<{]*</.test(pg.slice(pg.indexOf('function EnquiryRoutingRow'), pg.indexOf('function ExchangeOptInSwitch'))), '1.6 no text node typed into the row: every word from its home');

  sec('2 and 3  the real Settings room, both themes (C-43.18)');
  const PORT = 3992;
  const SHOTS = path.join(require('os').tmpdir(), 'b125_shots');
  // F-44.167 (b127's companion): the route's SERVER-SIDE /me call needs a real answer, which the browser's interception
  // cannot give. A tiny server answers it with dream-os me.js's key (`handle`); the browser's own /__api calls are still
  // intercepted by the probe before they leave (their URLs carry /__api/, as before).
  const ME_PORT = 3982;
  // It runs as its OWN process: the probe is driven through spawnSync, which blocks this process's event loop, so a
  // server living here could never answer the route while a probe runs (the door would hang; found at F-44.167).
  // Both socket tables: a server listening on IPv6 (Node's default where the host has it, as the founder's Codespace
  // does) appears only in /proc/net/tcp6. Reading tcp alone called a running server absent (his 2.0, 25 September).
  const tcpLines = () => ['/proc/net/tcp', '/proc/net/tcp6'].flatMap((f) => { try { return fs.readFileSync(f, 'utf8').split('\n').slice(1); } catch (_e) { return []; } });
  const listenInodes = (ports) => { const s2 = new Set(); for (const l of tcpLines()) { const f = l.trim().split(/\s+/); if (f[3] === '0A' && ports.includes(parseInt((f[1] || ':0').split(':').pop(), 16))) s2.add(f[9]); } return s2; };
  const listening = (port) => listenInodes([port]).size > 0;
  const meFree = !listening(ME_PORT);
  const meServer = spawn('node', ['-e', `require('http').createServer((q, s) => { if (q.url.startsWith('/__api/api/v2/vendor/me')) { s.writeHead(200, { 'content-type': 'application/json' }); s.end(JSON.stringify({ ok: true, vendor: { handle: 'DEV440', name: 'Dev Roy' } })); return; } s.writeHead(404); s.end(); }).listen(${ME_PORT});`], { stdio: 'ignore', detached: true });
  let meUp = false;
  for (let i = 0; i < 40 && meFree; i += 1) { await new Promise((r) => setTimeout(r, 250)); if (listening(ME_PORT)) { meUp = true; break; } }
  ok(meUp, `2.0 the bench's /me server takes port ${ME_PORT} (nothing else answers there)`);
  ok(!listening(PORT), `2.0b the dev port ${PORT} is free before this bench starts its own server (no leftover server walked)`);
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], { cwd: ROOT, stdio: 'ignore', detached: true,
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${ME_PORT}/__api` } });
  const up = async () => { for (let i = 0; i < 120; i += 1) { try { if (await fetch(`http://localhost:${PORT}/`)) return true; } catch (_e) { /* not yet */ } await new Promise((r) => setTimeout(r, 1000)); } return false; };
  const probe = (mode, sc, shots = SHOTS) => {
    const r = spawnSync('node', [P('scripts/lib/b125_enquiry_row_probe.mjs'), String(PORT), mode, sc, shots], { encoding: 'utf8', timeout: 200000,
      env: { ...process.env, B125_TYPE: JSON.stringify({ confirm: W.ENQ.confirm, cancel: W.ENQ_CANCEL }) } });
    if (r.status === 3) return { noBrowser: true };
    try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 200)}` }; }
  };
  const good1 = (o, label) => { if (o.noBrowser) { ok(false, `${label}: a browser drives the room (C-43.18)`); return false; } if (o.error || (o.errors && o.errors.length)) { ok(false, `${label}: the probe ran clean`, o.error || o.errors.join('|')); return false; } return true; };
  const optOf = (s, k) => (s.options || []).find((x) => x.key === k) || {};
  const restores = [];
  try {
    if (!(await up())) throw new Error('next dev did not come up');
    await new Promise((r) => setTimeout(r, 4000));
    for (const mode of ['dark', 'light']) {
      const o = probe(mode, 'sList');
      if (good1(o, `2.list ${mode}`)) {
        const s = o.screens[0];
        // AMENDED BY LABEL · FE_2b: E1 is now the section heading (SCard), read from the row's text, not an option label.
        ok(s.row === 'list' && s.all.includes(W.ENQ.label) && [W.ENQ.line, W.ENQ.tdw, W.ENQ.tdwLine, W.ENQ.own, W.ENQ.ownLine, W.ENQ.waba, W.ENQ.wabaLine].every((t) => s.texts.includes(t))
          && optOf(s, 'tdw').checked === 'true' && optOf(s, 'own_number').checked === 'false' && optOf(s, 'own_waba').disabled === 'true',
          `2.1 ${mode}: the row reads his words; Through TDW is checked; rung 3 is disabled with its state stated`, JSON.stringify(s));
        ok(!s.labelInOption && s.all.indexOf(W.ENQ.label) < s.all.indexOf(W.ENQ.tdw) && /<SCard register="rungs" title=\{ENQ\.label\}>/.test(read(PAGE)),
          `2.2 ${mode}: his ask, E1 HEADS the three options as the settings section header (SCard, the Business heading\u2019s own component), never one of them`);
      }
    }
    { const o = probe('dark', 'sList');
      if (good1(o, '2.3')) { const w = optOf(o.screens[0], 'own_waba');
        ok(w.hasSwitch && w.switchDisabled && !w.switchOn && w.disabled === 'true' && w.text.includes(W.ENQ.wabaLine),
          '2.3 F-19.20 (the chair\u2019s note): rung 3 HAS its switch, off and disabled, beside its stated state; never absent', JSON.stringify(w)); } }
    for (const mode of ['dark', 'light']) {
      const o = probe(mode, 'sOwn');
      if (!good1(o, `3.own ${mode}`)) continue;
      const [, consent, invalid, after] = o.screens;
      ok(o.patchesBeforeConfirm === 0 && consent.row === 'consent' && consent.input && [W.ENQ.consentPublic, W.ENQ.consentBypass, W.ENQ.phoneLabel, W.ENQ.confirm, W.ENQ_CANCEL].every((t) => consent.texts.includes(t)),
        `3.1 ${mode}: choosing her own WhatsApp writes nothing; the second screen states (a) and (b) above the field and the confirm (FK3)`, JSON.stringify(consent));
      ok(o.patchesAfterInvalid === 0 && invalid.texts.includes(W.ENQ.phoneInvalid), `3.2 ${mode}: a phone that is not a phone is caught before any write, in her words`);
      ok(o.patches.length === 1 && o.patches[0].enquiry_routing === 'own_number' && o.patches[0].enquiry_phone === '+91 87577 88550' && after.row === 'list'
        && optOf(after, 'own_number').checked === 'true' && after.texts.includes('+91 87577 88550'),
        `3.3 ${mode}: the confirm writes {own_number, phone} once; the row settles on the door\u2019s echo, her number shown`, JSON.stringify({ p: o.patches, a: after }));
      ok(o.revalidates === 1, `3.3r ${mode}: F-44.155, her public page is rebuilt once, right after the echoed write (R-G31.7)`, String(o.revalidates));
      ok((o.doorAnswers || []).length === 1 && o.doorAnswers[0].revalidated === true, `3.3d ${mode}: F-44.167, the REAL door answers revalidated: true (it rebuilt her page)`, JSON.stringify(o.doorAnswers));
    }
    { const o = probe('dark', 'sBack');
      // NOT HOLLOW: sBack's /me says own_number, so this cell is red unless the row's own load succeeded.
      if (good1(o, '3.back')) ok(optOf(o.screens[0], 'own_number').checked === 'true' && o.screens[0].texts.includes('+91 98882 94440'),
        '3.4a the row LOADS her stored rung from /me (own_number and her number shown): the list is not a default', JSON.stringify(o.screens[0].options));
      if (good1(o, '3.back')) ok(o.patches.length === 1 && JSON.stringify(o.patches[0]) === '{"enquiry_routing":"tdw"}' && optOf(o.screens[1], 'tdw').checked === 'true',
        '3.4 back to TDW: one tap, one write, no confirm (§7c: immediate)', JSON.stringify(o.patches));
      if (good1(o, '3.back')) ok(o.revalidates === 1, '3.4r F-44.155: withdrawing her number rebuilds her public page at once (no five-minute exposure)', String(o.revalidates));
      if (good1(o, '3.back')) ok((o.doorAnswers || []).length === 1 && o.doorAnswers[0].revalidated === true, '3.4d F-44.167: withdrawing her number, the REAL door answers revalidated: true', JSON.stringify(o.doorAnswers)); }
    { const o = probe('dark', 'sCancel');
      if (good1(o, '3.cancel')) ok(o.patches.length === 0 && !o.revalidates && o.screens[2].row === 'list' && optOf(o.screens[2], 'tdw').checked === 'true', '3.5 cancel writes nothing, rebuilds nothing, and returns to the list'); }
    { const o = probe('dark', 'sWaba');
      if (good1(o, '3.waba')) ok(o.patches.length === 0 && o.screens[1].row === 'list', '3.6 the disabled rung does nothing: no write, no second screen'); }
    { const o = probe('dark', 'sSilent');
      if (good1(o, '3.silent')) ok(o.patches.length === 1 && o.screens[2].texts.includes(W.ENQ_FAILED) && o.screens[2].row === 'consent',
        '3.7 FK5: a door that answers ok but keeps TDW leaves the row unchanged and says so (E12)', JSON.stringify(o.screens[2])); }
    { const o = probe('dark', 'sUnlisted');
      if (good1(o, '3.unlisted')) ok(o.screens[2].texts.includes(W.ENQ_FAILED) && o.screens[2].row === 'consent',
        '3.8 FK5: an older door that drops the field (a 200 with nothing moved) is a refusal, never a change', JSON.stringify(o.screens[2]));
      if (good1(o, '3.unlisted')) ok(!o.revalidates, '3.8r no echo, no rebuild: the page is rebuilt only after a write the door echoed'); }

    sec('4  mutations of production code (each must turn its cell red; restored by sha)');
    const mutate = async (rel, from, to, holds) => {
      const src = read(rel); const before = sha(src); const m = src.replace(from, to);
      if (m === src) return { applied: false };
      fs.writeFileSync(P(rel), m); restores.push([rel, src]);
      await new Promise((r) => setTimeout(r, 6000));
      let red; try { red = !(await holds()); } catch (_e) { red = true; } finally { fs.writeFileSync(P(rel), src); }
      return { applied: true, red, restored: sha(read(rel)) === before };
    };
    const res = [];
    res.push(['M1 the row trusts the requested rung, not the echo', await mutate(PAGE,
      "      if (r.vendor.enquiry_routing !== body.enquiry_routing) { setErr(ENQ_FAILED); return false; }\n      return true;",
      "      setRouting(body.enquiry_routing);\n      return true;",
      async () => { const o = probe('dark', 'sSilent', ''); return o.screens && o.screens[2] && o.screens[2].texts.includes(W.ENQ_FAILED); })]);
    res.push(['M2 the list writes own_number directly (no second screen)', await mutate(PAGE,
      "() => { setDraft(livePhone || ''); setErr(null); setStep('consent'); }",
      "() => { void write({ enquiry_routing: 'own_number', enquiry_phone: '+91 87577 88550' }); }",
      async () => { const o = probe('dark', 'sOwn', ''); return o.patchesBeforeConfirm === 0; })]);
    res.push(['M3 the phone check always passes', await mutate(WORDS, '  return d.length >= 10 && d.length <= 15;', '  return true;',
      // 19 digits passes the pattern's length and fails ONLY the digit count, the line M3 replaces.
      async () => !loadTs(WORDS).phoneLooksRight('1234567890123456789'))]);
    res.push(['M5 rung 3 drawn without its switch', await mutate(PAGE,
      '        <span className="wl-sw" aria-hidden data-disabled-switch="true" style={{ opacity: 0.6 }}><span /></span>\n', '',
      async () => { const o = probe('dark', 'sList', ''); const w = optOf(o.screens[0], 'own_waba'); return w.hasSwitch && w.switchDisabled; })]);
    res.push(['M4 the revalidate call dropped', await mutate(PAGE,
      "      try { await fetch('/api/revalidate/storefront', { method: 'POST', headers: getAuthHeader() }); } catch { /* the page refreshes within its window anyway */ }\n", '',
      async () => { const o = probe('dark', 'sBack', ''); return o.revalidates === 1; })]);
    for (const [name, x] of res) ok(x.applied && x.red && x.restored, `4 ${name}: applies, turns its cell red, restored by sha`, JSON.stringify(x));
  } catch (e) {
    ok(false, `2.x the room run: ${String(e && e.message).split('\n')[0]}`);
  } finally {
    for (const [rel, src] of restores) fs.writeFileSync(P(rel), src);
    try { process.kill(-dev.pid); } catch (_e) { /* gone */ }
    try { process.kill(-meServer.pid, 'SIGKILL'); } catch (_e) { try { meServer.kill('SIGKILL'); } catch (_e2) { /* gone */ } }
    // No server may outlive this bench: whatever still listens on its ports is found from /proc and killed (a leftover
    // next-server on the dev port would otherwise serve the NEXT run stale code).
    try {
      const inodes = listenInodes([PORT, ME_PORT]);   // both tables (tcp and tcp6)
      for (const pid of fs.readdirSync('/proc').filter((d) => /^\d+$/.test(d))) {
        try { for (const fd of fs.readdirSync(`/proc/${pid}/fd`)) { const m = /socket:\[(\d+)\]/.exec(fs.readlinkSync(`/proc/${pid}/fd/${fd}`)); if (m && inodes.has(m[1])) { process.kill(Number(pid), 'SIGKILL'); break; } } } catch (_e) { /* not ours */ }
      }
    } catch (_e) { /* no /proc: nothing more to do */ }
    // and it waits until both ports are quiet (a killed server takes a moment to let go), so none outlives this bench.
    for (let i = 0; i < 20 && (listening(PORT) || listening(ME_PORT)); i += 1) await new Promise((r) => setTimeout(r, 250));
  }
  console.log(`\nb125 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.log(`b125 CRASHED: ${(e && e.stack) || e}`); process.exit(1); });
