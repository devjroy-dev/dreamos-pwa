#!/usr/bin/env node
'use strict';
// scripts/b123_ce45_fe2_type_bench.js · TDW CE-45 · FE-2 · TYPE_1 · THE LEGACY FAMILY ON THE APP'S TYPE.
// Rung b123 (the estate's one line of rung numbers across both repos: b121 SRV_1, b122 HOME_1/2).
//
// WHAT IT PINS, EACH AGAINST THE RULING IT CAME FROM
//  §1 THE SOURCE (F1, F2): the family's old type is gone, not aliased: no `F`, no raw size, face,
//     weight, line-height or style in the ten slice modules or the clients room, every `font:` a
//     rung through the one `T`, tracking only .08em; the Slice Door is gone from source, its six
//     mounts with it, and the key it alone wrote (dreamai_list_last_slice) has no writer and no reader.
//  §2 THE REAL ROOMS (C-43.18), POPULATED (e-108): leads, clients, events, notes, invoices and
//     expenses, at rest and with the first row's own sheet open (invoices also the add-milestones
//     sheet), both themes, in headless Chromium against `next dev` in mock mode, every read answered
//     with wire-shaped rows (scripts/lib/b123_fixtures.mjs, C-44.3). Per scene: every text node on a
//     rung (size, face AND weight), faces only Cormorant and DM Sans, no italic, tracking only .08em,
//     buttons at t4 in sentence case (F5), the 16px gutter and no overflow at 374px, the strip absent.
//  §3 THE WORDS AND THE CONTROLS (F3): the SAME scene rendered at the base (a worktree at --base,
//     82ff431e by default) and compared node for node: the ordered text nodes by textContent,
//     whitespace-normalised, and the ordered controls by tag, role, name and href. The ONE allowed
//     removal is the strip's six labels, which must be exactly Leads, Clients, Invoices, Expenses,
//     Events, Notes at the base. textContent is the DOM's text, so F5's case change is not a word
//     change; §3 also prints every control whose computed case moved, the F5 list, by name.
//  §4 F6: the longest money figure the wire can carry in a room (Rs 9,99,99,99,999, the invoices
//     summary) renders whole at t1 inside the column: no clipping, right edge inside the gutter.
//  §5 MUTATIONS OF PRODUCTION CODE (--mutate), run detached and polled (A-45.4), each restored byte
//     for byte in a `finally` with its sha re-checked; each must redden its own cells:
//     M1 a raw 9px restored on the row's state pill · M2 Italiana restored on the masthead figure ·
//     M3 the Slice Door restored with its mount · M4 .32em tracking restored on a sheet label ·
//     M5 one word changed in the lane line.
//
// WHAT IT DOES NOT MEASURE, NAMED: the subtrees of the modules the chair placed in TYPE_2 (the lead's
// package card and booking controls, the missing chips, the conversation thread, NeedFirst) are
// marked `later` and left out of §2's type cells, never out of §3's words; the notes room's body is
// NotesBody (TYPE_2), so notes carries only §2's strip, gutter and overflow cells and §3.
//
// SHIFTED CLOCKS (C-44.13): `--clock <ISO>` shifts both browsers' clocks. No cell names "today":
// the rows' dates are the fixtures' and the rooms derive their own. The delivery's record runs it
// at now, the next IST day, across a year's end and on a leap day.
//
// usage: node scripts/b123_ce45_fe2_type_bench.js [--base <sha>] [--clock <ISO>] [--modes dark,light]
//                                                  [--rooms a,b] [--shots DIR] [--mutate] [--no-render]
// THE EXIT CODE IS THE VERDICT. Without a browser the render cells are DECLARED RED, never skipped.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', '82ff431ec3c5b1f50994b01be36e27fc5cf736cf');
const CLOCK = arg('--clock', null);
const MODES = arg('--modes', 'dark,light').split(',');
const ROOMS = arg('--rooms', 'leads,clients,events,notes,invoices,expenses').split(',');
const SHOTS = arg('--shots', '');
const MUTATE = process.argv.includes('--mutate');
const RENDER = !process.argv.includes('--no-render');

let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('GREEN ' + name); } else { fail++; console.log('RED   ' + name + ' \u2014 ' + why); } };
const read = (f, root = ROOT) => fs.readFileSync(path.join(root, f), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
// comments out: a retired name may be narrated in a comment, never used in code
const strip = (s) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');

const FAMILY = ['BinderCard', 'BulkBar', 'DetailSheet', 'FilterRail', 'ForwardSheet', 'Masthead', 'SliceRow', 'SliceShell', 'SwipeRow', 'WishboneSheet']
  .map((m) => `components/vendor/slices/${m}.tsx`).concat(['app/vendor/(shell)/clients/body.tsx']);
const RUNGS = new Set(['46|cormorant|500', '24|cormorant|500', '17|dmsans|500', '14|dmsans|400', '12|dmsans|500', '11|dmsans|500']);
const SIX = ['Leads', 'Clients', 'Invoices', 'Expenses', 'Events', 'Notes'];

// ══ §1 · THE SOURCE ════════════════════════════════════════════════════════════════════════
function sourceCells(tag = '') {
  console.log('\n\u00a71 \u00b7 the source' + tag);
  const row = strip(read('components/vendor/slices/SliceRow.tsx'));
  cell('1.1 F is retired, and T names t1..t5 and nothing else (t0 is Today\u2019s)',
    /export const F\b/.test(row) ? 'SliceRow still exports F'
      : !/export const T = \{\s*t1: 'var\(--wl-t1\)',\s*t2: 'var\(--wl-t2\)',\s*t3: 'var\(--wl-t3\)',\s*t4: 'var\(--wl-t4\)',\s*t5: 'var\(--wl-t5\)',\s*\} as const;/.test(row) ? 'T is not the five rungs exactly' : null);
  const raw = [], fonts = [], tracks = [];
  for (const f of FAMILY) {
    const s = strip(read(f));
    for (const m of s.matchAll(/\b(fontFamily|fontSize|fontWeight|lineHeight|fontStyle)\s*:/g)) raw.push(`${f}: ${m[1]}`);
    for (const m of s.matchAll(/--font-(jost|italiana|cormorant|dm-sans)/g)) raw.push(`${f}: --font-${m[1]}`);
    for (const m of s.matchAll(/\bfont:\s*([^,\n}]+)/g)) if (!/^T\.t[1-5]$/.test(m[1].trim())) fonts.push(`${f}: font: ${m[1].trim()}`);
    for (const m of s.matchAll(/letterSpacing:\s*([^,\n}]+)/g)) if (m[1].trim() !== "'0.08em'") tracks.push(`${f}: ${m[1].trim()}`);
  }
  cell('1.2 no raw size, face, weight, line-height or style in the family or the clients room', raw.length ? raw.slice(0, 6).join(' | ') + (raw.length > 6 ? ` (+${raw.length - 6})` : '') : null);
  cell('1.3 every font is a rung through T, and tracking is only .08em (theme.ts: eyebrows)',
    fonts.length || tracks.length ? fonts.concat(tracks).slice(0, 6).join(' | ') : null);
  const door = [];
  const walk = (d) => { for (const e of fs.readdirSync(P(d), { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(e.name)) continue;
    const rel = path.join(d, e.name);
    if (e.isDirectory()) { walk(rel); continue; }
    if (!/\.(tsx?|jsx?)$/.test(e.name)) continue;
    const s = strip(read(rel));
    if (/\bSliceDoor\b|\bDOOR_ORDER\b/.test(s)) door.push(rel);
  } };
  walk('app'); walk('components');
  cell('1.4 the Slice Door is gone from source: no definition, no mount, no import, anywhere in app/ or components/', door.length ? door.join(', ') : null);
  const writers = [], readers = [];
  const walk2 = (d) => { for (const e of fs.readdirSync(P(d), { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(e.name)) continue;
    const rel = path.join(d, e.name);
    if (e.isDirectory()) { walk2(rel); continue; }
    if (!/\.(tsx?|jsx?)$/.test(e.name) || rel === path.join('hooks', 'vendor', 'useLastSlice.ts')) continue;
    const s = strip(read(rel));
    if (/\buseLastSlice\s*\(/.test(s)) writers.push(rel);
    if (/\breadStoredSlice\b|dreamai_list_last_slice/.test(s)) readers.push(rel);
  } };
  walk2('app'); walk2('components'); walk2('lib'); walk2('hooks');
  cell('1.5 the key the strip alone wrote has no writer and no reader left (nothing that ran is lost)',
    writers.length || readers.length ? `writers: ${writers.join(', ') || 'none'} · readers: ${readers.join(', ') || 'none'}` : null);
  return fail;
}

// ══ §2-§4 · THE REAL ROOMS ═════════════════════════════════════════════════════════════════
const SCENES = { leads: ['rest', 'sheet'], clients: ['rest', 'sheet'], events: ['rest', 'sheet'], notes: ['rest'], invoices: ['rest', 'sheet', 'schedule'], expenses: ['rest', 'sheet'] };
function probe(port, mode, room, scene, shots) {
  const env = { ...process.env }; if (CLOCK) env.B123_CLOCK = String(Date.parse(CLOCK));
  const r = spawnSync('node', [P('scripts/lib/b123_type_probe.mjs'), String(port), mode, room, scene, shots || ''], { encoding: 'utf8', timeout: 240000, env });
  const line = (r.stdout || '').trim().split('\n').pop();
  try { return JSON.parse(line); } catch (_e) { return { errors: ['no JSON from the probe: ' + (r.stderr || '').split('\n')[0]], nodes: [], controls: [] }; }
}
async function startDev(root, port) {
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(port)], {
    cwd: root, detached: true, stdio: 'ignore',
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${port}/__api` },
  });
  for (let i = 0; i < 180; i += 1) {
    const ok = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', `http://localhost:${port}/vendor/rooms`], { encoding: 'utf8', timeout: 60000 }).stdout;
    if (/^[23]/.test(ok)) return dev;
    await new Promise((res) => setTimeout(res, 1000));
  }
  try { process.kill(-dev.pid); } catch (_e) { /* already gone */ }
  return null;
}
const stop = (dev) => { if (dev) { try { process.kill(-dev.pid, 'SIGTERM'); } catch (_e) { /* gone */ } } };

function baseTree() {
  // A worktree at the named base, beside the repo (Turbopack refuses a node_modules symlinked from
  // outside its root, so the base gets a hard-linked copy, or a full one where links cannot cross).
  const dir = path.resolve(ROOT, '..', `.b123-base-${BASE.slice(0, 12)}`);
  if (!fs.existsSync(path.join(dir, 'package.json'))) {
    const r = spawnSync('git', ['worktree', 'add', '--detach', dir, BASE], { cwd: ROOT, encoding: 'utf8' });
    if (r.status !== 0) return { dir: null, why: 'git worktree add refused: ' + (r.stderr || '').trim().split('\n')[0] };
  }
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  if (head !== BASE && !head.startsWith(BASE)) return { dir: null, why: `the base worktree is at ${head}, not ${BASE}` };
  if (!fs.existsSync(path.join(dir, 'node_modules'))) {
    let r = spawnSync('cp', ['-al', P('node_modules'), path.join(dir, 'node_modules')]);
    if (r.status !== 0) r = spawnSync('cp', ['-r', P('node_modules'), path.join(dir, 'node_modules')]);
    if (r.status !== 0) return { dir: null, why: 'node_modules could not be given to the base worktree' };
  }
  return { dir, why: null };
}

function typeCells(tag, sc) {
  const own = sc.nodes.filter((n) => !n.later && !n.strip);
  const off = own.filter((n) => !RUNGS.has(`${n.size}|${n.f}|${n.wt}`));
  cell(`2.1 ${tag} every text node sits on a rung (size, face, weight)`, off.length ? off.slice(0, 4).map((n) => `\u201c${n.txt.slice(0, 24)}\u201d ${n.f} ${n.size}/${n.wt}`).join(' | ') + ` (${off.length})` : null);
  const faces = [...new Set(own.map((n) => n.f))].filter((f) => f !== 'cormorant' && f !== 'dmsans');
  cell(`2.2 ${tag} only Cormorant and DM Sans, and nothing italic`, faces.length ? 'faces: ' + faces.join(', ') : own.some((n) => n.fs === 'italic') ? 'an italic node' : null);
  const tr = own.filter((n) => n.ls !== 'normal' && Math.abs(parseFloat(n.ls) - 0.08 * n.size) > 0.02);
  cell(`2.3 ${tag} tracking is none or .08em`, tr.length ? tr.slice(0, 4).map((n) => `\u201c${n.txt.slice(0, 20)}\u201d ${n.ls}`).join(' | ') : null);
  const upBtn = sc.controls.filter((c) => !c.later && !c.strip && c.tag === 'button' && c.tt === 'uppercase' && c.size !== 11);
  cell(`2.4 ${tag} F5: no button above t5 is set in capitals`, upBtn.length ? upBtn.map((c) => c.name.slice(0, 24)).join(' | ') : null);
}

async function renderCells() {
  console.log('\n\u00a72\u2013\u00a74 \u00b7 the real rooms, populated' + (CLOCK ? ` · clock ${CLOCK}` : ''));
  const bt = baseTree();
  if (!bt.dir) { cell('2.0 the base tree is present to compare against', bt.why); return; }
  const [pc, pb] = [3960 + Math.floor(Math.random() * 20), 3940 + Math.floor(Math.random() * 20)];
  const devC = await startDev(ROOT, pc), devB = await startDev(bt.dir, pb);
  try {
    if (!devC || !devB) { cell('2.0 both trees serve', `${devC ? '' : 'the cured tree did not come up '}${devB ? '' : 'the base tree did not come up'}`); return; }
    const f5 = new Map();
    for (const mode of MODES) for (const room of ROOMS) for (const scene of SCENES[room]) {
      const tag = `[${room} ${scene} ${mode}]`;
      const c = probe(pc, mode, room, scene, SHOTS && path.join(SHOTS, 'cured'));
      const b = probe(pb, mode, room, scene, SHOTS && path.join(SHOTS, 'base'));
      if (c.browser === null || b.browser === null) { cell(`2.0 ${tag} a browser launches`, 'no Chromium: CHROME_BIN unset and @sparticuz/chromium absent'); continue; }
      // the scene is only measured if BOTH trees reached it: the second tap (the clients card's Edit,
      // the paid invoice's Add) is asserted, not assumed, or a scene that never opened reads as green
      const second = (x) => (room === 'clients' && scene === 'sheet') ? x.tapped2 === 'edit' : scene === 'schedule' ? x.tapped2 === 'add' : true;
      const drove = c.loaded && b.loaded && (scene === 'rest' || (c.tapped && b.tapped && second(c) && second(b))) && !(c.errors || []).length && !(b.errors || []).length;
      cell(`2.0 ${tag} both trees drew the populated room and the scene`, drove ? null : `cured ${JSON.stringify({ l: c.loaded, t: c.tapped, t2: c.tapped2, e: c.errors })} base ${JSON.stringify({ l: b.loaded, t: b.tapped, t2: b.tapped2, e: b.errors })}`);
      if (!drove) continue;
      if (room !== 'notes') typeCells(tag, c);
      if (scene === 'rest') {
        const g = c.nodes.filter((n) => n.scope === 0 && !n.scroller && !n.later && (n.left < 16 || n.right > 374 - 16));
        cell(`2.5 ${tag} the 16px gutter on both sides, and no overflow at 374px`,
          c.docOverflow !== 0 || c.mainOverflow !== 0 ? `overflow doc ${c.docOverflow} main ${c.mainOverflow}` : g.length ? g.slice(0, 3).map((n) => `\u201c${n.txt.slice(0, 20)}\u201d ${n.left}-${n.right}`).join(' | ') : null);
      }
      cell(`2.6 ${tag} the strip is absent`, (c.stripLabels || []).length ? 'labels: ' + c.stripLabels.join(', ') : null);
      if (scene === 'rest') cell(`3.0 ${tag} the base drew exactly the six labels the removal takes`, JSON.stringify(b.stripLabels) === JSON.stringify(SIX) ? null : 'base strip: ' + JSON.stringify(b.stripLabels));
      const words = (x) => x.nodes.filter((n) => !n.strip).map((n) => n.txt);
      const wa = words(b), wc = words(c);
      let firstDiff = -1; for (let i = 0; i < Math.max(wa.length, wc.length); i += 1) if (wa[i] !== wc[i]) { firstDiff = i; break; }
      cell(`3.1 ${tag} the words are the base\u2019s, node for node`, firstDiff < 0 ? null : `at ${firstDiff}: base \u201c${wa[firstDiff]}\u201d cured \u201c${wc[firstDiff]}\u201d (${wa.length}/${wc.length})`);
      const ctl = (x) => x.controls.filter((k) => !k.strip).map((k) => `${k.tag}|${k.role}|${k.name}|${k.href}`);
      const ca = ctl(b), cc = ctl(c);
      let cd = -1; for (let i = 0; i < Math.max(ca.length, cc.length); i += 1) if (ca[i] !== cc[i]) { cd = i; break; }
      cell(`3.2 ${tag} the controls are the base\u2019s by name, role and href`, cd < 0 ? null : `at ${cd}: base ${ca[cd]} cured ${cc[cd]}`);
      const kc = c.controls.filter((x) => !x.strip), kb = b.controls.filter((x) => !x.strip);
      kc.forEach((k, i) => { if (kb[i] && kb[i].name === k.name && kb[i].tt === 'uppercase' && k.tt === 'none') f5.set(`${room}: ${k.name}`, true); });
      if (room === 'invoices' && scene === 'rest') {
        const fg = c.figure;
        cell(`4.1 ${tag} F6: the longest figure renders whole at t1 inside the column`,
          !fg ? 'no money figure drawn' : fg.text !== 'Rs 9,99,99,99,999' ? 'the figure reads ' + fg.text
            : fg.size !== 24 || fg.f !== 'cormorant' ? `the figure is ${fg.f} ${fg.size}` : fg.sw > fg.cw || fg.right > 374 - 16 ? `clipped: ${fg.sw}>${fg.cw} or right ${fg.right}` : null);
      }
    }
    console.log('\nF5 · the controls whose case moved to sentence case (the words unchanged):');
    for (const k of f5.keys()) console.log('   ' + k);
    cell('3.3 F5 moved at least one control, and every one it moved kept its words (3.2)', f5.size ? null : 'no control changed case: F5 did not land');
  } finally { stop(devC); stop(devB); }
}

// ══ §5 · MUTATIONS ═════════════════════════════════════════════════════════════════════════
async function mutations() {
  console.log('\n\u00a75 \u00b7 mutations of production code, each restored');
  const M = [
    { id: 'M1', file: 'components/vendor/slices/SliceRow.tsx', from: /(\{row\.badge && \(\s*<span style=\{\{\s*font: T\.t5,)/, to: '$1 fontSize: 9,', cells: /^1\.2/ },
    { id: 'M2', file: 'components/vendor/slices/Masthead.tsx', from: /(font: T\.t1,)/, to: "$1 fontFamily: 'var(--font-italiana), serif',", cells: /^1\.2/ },
    { id: 'M3', file: 'app/vendor/(shell)/notes/body.tsx', from: /(<NotesBody \/>)/, to: '<SliceDoor active="notes" />$1', cells: /^1\.4/ },
    { id: 'M4', file: 'components/vendor/slices/DetailSheet.tsx', from: /(font: T\.t5,\s*letterSpacing: )'0\.08em'/, to: "$1'0.32em'", cells: /^1\.3/ },
    { id: 'M5', file: 'components/vendor/slices/SliceShell.tsx', from: /(const LANE_LINE[^=]*=\s*\{[^}]*?leads:\s*')([A-Za-z]+)/, to: '$1Planted', cells: /^3\.1/, render: true },
  ];
  for (const m of M) {
    const abs = P(m.file); const orig = fs.readFileSync(abs, 'utf8'); const h = sha(orig);
    if (!m.from.test(orig)) { cell(`5.${m.id} the anchor exists`, 'anchor not found in ' + m.file); continue; }
    try {
      fs.writeFileSync(abs, orig.replace(m.from, m.to));
      const before = fail, beforePass = pass; const lines = [];
      const keep = console.log; console.log = (s) => lines.push(String(s));
      try {
        if (m.render) {
          const dev = await startDev(ROOT, 3999);
          try { const c = probe(3999, 'dark', 'leads', 'rest'); const bt = baseTree(); const devB = bt.dir ? await startDev(bt.dir, 3998) : null;
            try { const b = devB ? probe(3998, 'dark', 'leads', 'rest') : { nodes: [] };
              const wa = b.nodes.filter((n) => !n.strip).map((n) => n.txt), wc = c.nodes.filter((n) => !n.strip).map((n) => n.txt);
              cell('3.1 [leads rest dark] the words are the base\u2019s, node for node', JSON.stringify(wa) === JSON.stringify(wc) ? null : 'a word moved');
            } finally { stop(devB); } } finally { stop(dev); }
        } else { sourceCells(' (mutated)'); }
      } finally { console.log = keep; }
      const reds = lines.filter((l) => l.startsWith('RED')).map((l) => l.slice(6));
      fail = before; pass = beforePass; // the mutated run's own cells are the evidence, not the verdict
      const own = reds.filter((l) => m.cells.test(l));
      cell(`5.${m.id} reddens its own cell and only that`, own.length && own.length === reds.length ? null : `reds: ${reds.map((l) => l.split(' ')[0]).join(', ') || 'none'}`);
    } finally {
      fs.writeFileSync(abs, orig);
      if (sha(fs.readFileSync(abs, 'utf8')) !== h) { cell(`5.${m.id} restored byte for byte`, 'THE FILE DID NOT RESTORE: run git checkout ' + m.file); }
    }
  }
}

(async () => {
  console.log(`b123 \u00b7 CE-45 FE-2 TYPE_1 \u00b7 root ${ROOT} \u00b7 base ${BASE.slice(0, 12)}`);
  sourceCells();
  if (RENDER) await renderCells();
  if (MUTATE) await mutations();
  console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} \u2014 b123 type (pwa) ${pass}/${pass + fail}`);
  process.exit(fail === 0 ? 0 : 1);
})();
