#!/usr/bin/env node
'use strict';
// scripts/b134_ce45_fe2_ask_sheet_bench.js · TDW CE-45 · FE-2 · the Ask TDW sheet cut (ASK-1's cut 2 in the app).
//
// §1 THE SOURCE: the untrue note is gone (no askSheetNote key, nothing drawn under the sheet's head); the
//    answer renderer reduces unhandled markdown to its words before its blocks are read (plainMarkdown), and
//    wraps a long unbroken string (overflowWrap 'anywhere').
// §2 ON GLASS, every one of ASK-1's reply shapes plus the Advisor room's markdown and the glitch line, dark and
//    light, at 374px, in the real faces (A-45.9), the chat door answered AS THE DOOR ANSWERS (after a delay,
//    ONE text_delta with the whole reply, then done):
//    2.1 the answer lands whole (every required phrase on glass); 2.2 nothing is wider than the panel (element
//    geometry), and the thread never scrolls sideways; 2.3 no raw **, ```, ](, |, --- or leading # on glass;
//    2.4 the note is absent.
// §3 THE WAIT: with the door taking 20 seconds, the typing dots are on glass at EVERY sample until the answer
//    lands, and the answer lands (nothing in the sheet gives up first).
// §4 MUTATIONS, each restored by sha: M1 plainMarkdown bypassed (2.3 reddens on the Advisor's markdown);
//    M2 overflowWrap removed (2.2 reddens on a long link); M3 the note restored (2.4 reddens); M4 bold set back
//    to italic 600 (5.2 reddens on the Advisor's markdown).
// §5 THE RE-DRESS (ruled into this cut): every text in the sheet on a rung (size, face, weight), nothing italic,
//    tracking only on t5, F5's case on controls, all by element in the real faces.
// THE EXIT CODE IS THE VERDICT (0 green, 1 red).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
// the whole-tree stop's one home is scripts/lib/stop_tree.js (F-44.163, landed with the runner cure r3 at 5833b4f1).
// AMENDED BY LABEL · CE-46 FE-3: the WIP carried a local copy of the same stop for a tree where r3 had not landed;
// r3 is in the tree, so the copy is gone and this rung requires the home like every other dev-server rung.
const { stopTree } = require('./lib/stop_tree.js');
const { stripComments } = require('./lib/stripComments.cjs');

const ROOT = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const PORT = 3981;
let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('GREEN ' + name); } else { fail++; console.log('RED   ' + name + ' \u2014 ' + why); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SHAPES = ['plain', 'parts', 'quote', 'question', 'numbered', 'emoji', 'long', 'longstring', 'advisor', 'glitch'];
const MODES = (process.argv.find((a) => a.startsWith('--modes=')) || '--modes=dark,light').split('=')[1].split(',');
const MUTATE = process.argv.includes('--mutate');

function probe(mode, shape, delay) {
  const r = spawnSync('node', [path.join(ROOT, 'scripts/lib/b134_ask_probe.mjs'), String(PORT), mode, shape, String(delay)], { cwd: ROOT, encoding: 'utf8', timeout: 240000 });
  try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { errors: ['no json: ' + String(r.stderr).slice(0, 200)] }; }
}
function shapeCells(tag, x) {
  const m = x.measure || {};
  cell(`2.0 ${tag} the sheet opened from the dock, the message went, the real faces loaded`, x.opened && x.sheet && x.sent && x.chatPosted === 1 && x.realFaces ? null : JSON.stringify({ opened: x.opened, sheet: x.sheet, sent: x.sent, posted: x.chatPosted, faces: x.realFaces, e: x.errors }));
  cell(`2.1 ${tag} the answer lands whole on glass`, x.landed ? null : 'not every required phrase appeared');
  cell(`2.2 ${tag} nothing is wider than the panel, and the thread never scrolls sideways`, !m.panelWidth ? 'no measure' : (m.wider || []).length || m.bodyScrollX > 0 ? `wider: ${(m.wider || []).join(', ')} · sideways ${m.bodyScrollX}px` : null);
  cell(`2.3 ${tag} no raw markdown symbol on glass`, !m.panelWidth ? 'no measure' : (m.raw || []).length ? 'on glass: ' + m.raw.join(' ') : null);
  cell(`2.4 ${tag} the note "TDW replies on WhatsApp." is absent`, m.note === false ? null : 'the note is drawn');
  // §5 · THE RE-DRESS (ruled into this cut): every text in the sheet on the app's rungs, in the real faces
  // DESIGN-1 · STAGE 1 (by label): the app's rungs are the review's scale in Inter, read from lib/worklist/theme.ts TYPE
  // (size|face|weight), so the cell cannot drift from the scale; the old table (Cormorant 24, DM Sans 17/14/12/11 at
  // 400 or 500) retired with the faces. Tracking is none anywhere now (5.3), and no control is in capitals (5.4).
  const TY = (() => { try { const ts = require(path.join(ROOT, 'node_modules/typescript')); const js = ts.transpileModule(fs.readFileSync(path.join(ROOT, 'lib/worklist/theme.ts'), 'utf8'), { compilerOptions: { module: 1, target: 7 } }).outputText;
    const mod = { exports: {} }; new Function('module', 'exports', 'require', js)(mod, mod.exports, require); return mod.exports.TYPE; } catch (_e) { return {}; } })();
  const RUNGS = new Set(Object.values(TY).map((t) => `${t.size}|inter|${t.weight}`));
  const ty = m.type || [];
  const off = ty.filter((n) => !RUNGS.has(`${n.size}|${n.f}|${n.weight}`));
  cell(`5.1 ${tag} every text in the sheet sits on a rung (size, face, weight), Inter`, !ty.length ? 'no text measured' : off.length ? off.slice(0, 3).map((n) => `"${n.txt}" ${n.f} ${n.size} ${n.weight}`).join(' | ') : null);
  const ital = ty.filter((n) => n.italic);
  cell(`5.2 ${tag} nothing is italic`, ital.length ? ital.slice(0, 3).map((n) => `"${n.txt}"`).join(' | ') : null);
  const trk = ty.filter((n) => n.ls !== 'normal' && parseFloat(n.ls) !== 0);
  cell(`5.3 ${tag} no tracking (DESIGN-1)`, trk.length ? trk.slice(0, 3).map((n) => `"${n.txt}" ${n.size}px ls ${n.ls}`).join(' | ') : null);
  const caps = ty.filter((n) => n.control && n.tt === 'uppercase');
  cell(`5.4 ${tag} F5 (DESIGN-1: every rung): no control is set in capitals`, caps.length ? caps.slice(0, 3).map((n) => `"${n.txt}"`).join(' | ') : null);
}

async function startDev() {
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], { cwd: ROOT, detached: true, stdio: 'ignore',
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  for (let i = 0; i < 180; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '60', `http://localhost:${PORT}/vendor/leads`], { encoding: 'utf8' });
    if (/^[23]/.test(r.stdout)) return dev;
    await sleep(1000);
  }
  stopTree(dev.pid); return null;
}

(async () => {
  console.log('b134 · the Ask TDW sheet on ASK-1\u2019s reply shapes');
  // §1 · the source
  const sheet = read('components/worklist/AskSheet.tsx'); const copy = read('lib/worklist/copy.ts'); const bubble = read('components/vendor/MessageBubble.tsx');
  // F-44.202 (CE-46 FE-3): the strip goes through the one home, never a local rule (tdw_f0774_readers §2.3c)
  const code = (s) => stripComments(s);
  cell('1.1 the note is gone: no askSheetNote key in the copy home, nothing drawn under the sheet\u2019s head', /askSheetNote\s*:/.test(code(copy)) || /askSheetNote|wl-asknote/.test(code(sheet)) ? 'the key or its drawing survives' : null);
  cell('1.2 the renderer reduces unhandled markdown before its blocks are read, and wraps long strings', /const blocks = plainMarkdown\(text\)\.split/.test(bubble) && /function plainMarkdown\(/.test(bubble) && /overflowWrap: 'anywhere'/.test(bubble) ? null : 'plainMarkdown or overflowWrap is not in place');

  fs.rmSync(path.join(ROOT, '.next', 'dev'), { recursive: true, force: true }); // A-45.5
  const dev = await startDev();
  if (!dev) { cell('2.0 the dev server answers', 'next dev did not come up'); return done(); }
  try {
    for (const mode of MODES) for (const shape of SHAPES) shapeCells(`[${shape} ${mode}]`, probe(mode, shape, 1200));
    // §3 · the 20-second wait
    const w = probe('dark', 'plain', 20000);
    const before = (w.samples || []).filter((s) => !s.answer);
    cell('3.1 [a 20-second answer] the typing dots are on glass at every sample until it lands, and it lands whole',
      !w.landed ? 'it never landed' : w.landedAt < 19500 ? `landed at ${w.landedAt}ms, before the door answered` : before.length < 15 ? `only ${before.length} samples in the wait` : before.some((s) => !s.dots) ? 'the dots were missing at ' + before.filter((s) => !s.dots).map((s) => s.ms + 'ms').join(', ') : null);

    // §4 · the mutations, each planted, rendered by the running server's own reload, measured, restored by sha
    if (MUTATE) {
      const muts = [
        { id: 'M1', file: 'components/vendor/MessageBubble.tsx', from: 'const blocks = plainMarkdown(text).split', to: "const blocks = (text || '').split", shape: 'advisor', cell: '2.3' },
        { id: 'M2', file: 'components/vendor/MessageBubble.tsx', from: "    overflowWrap: 'anywhere' as const,", to: '', shape: 'longstring', cell: '2.2' },
        { id: 'M4', file: 'components/vendor/MessageBubble.tsx', from: "style={{ fontWeight: 500 }}>{italicNodes(m[1]", to: "style={{ fontStyle: 'italic', fontWeight: 600 }}>{italicNodes(m[1]", shape: 'advisor', cell: '5.2' },
        { id: 'M3', file: 'components/worklist/AskSheet.tsx', from: '<div className="wl-askbody" ref={scrollRef}>', to: '<p className="wl-asknote">TDW replies on WhatsApp.</p>\n          <div className="wl-askbody" ref={scrollRef}>', shape: 'plain', cell: '2.4' },
      ];
      for (const m of muts) {
        const abs = path.join(ROOT, m.file); const orig = fs.readFileSync(abs, 'utf8'); const h = sha(orig);
        if (!orig.includes(m.from)) { cell(`4.${m.id} the anchor exists`, 'anchor not found in ' + m.file); continue; }
        let x;
        try { fs.writeFileSync(abs, orig.replace(m.from, m.to)); await sleep(6000); x = probe('dark', m.shape, 1200); }
        finally { fs.writeFileSync(abs, orig); }
        const restored = sha(fs.readFileSync(abs, 'utf8')) === h;
        const mm = x.measure || {};
        const red = m.cell === '2.3' ? (mm.raw || []).length > 0 : m.cell === '2.2' ? ((mm.wider || []).length > 0 || mm.bodyScrollX > 0)
          : m.cell === '5.2' ? (mm.type || []).some((n) => n.italic) : mm.note === true;
        // (the reply must have reached the sheet and been measured; "landed" is not required, because M1 removes
        // the very rendering the Advisor shape's landed-phrases are written in: its table rows stay raw)
        cell(`4.${m.id} reddens ${m.cell} on the ${m.shape} shape, and the file is restored by sha`, !restored ? 'NOT RESTORED' : x.chatPosted !== 1 || !mm.panelWidth ? 'the planted tree did not answer or was not measured' : red ? null : `${m.cell} stayed green under the mutation`);
      }
      await sleep(6000);
    }
  } finally { stopTree(dev.pid); }
  return done();
})();

function done() { console.log(`\n${fail ? 'RED' : 'GREEN'} \u2014 b134 ask sheet (pwa) ${pass}/${pass + fail}`); process.exit(fail ? 1 : 0); }
