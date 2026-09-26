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
//     M5 one word changed in the lane line · TYPE_2: M6 a raw 16px back on the legacy Toast · M7 RUNG_FONT's
//     fallback no longer read from TYPE (a second copy of the scale).
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
// cut 2 compares against the tip it builds on (4aaad4d3: TYPE_1b r3, IGD-1 cut 1b, then G6-1 F-44.166); TYPE_1b's record ran against 97031c40; TYPE_2's record ran against 8a943ae1, TYPE_1's against 82ff431e.
const BASE = arg('--base', '4aaad4d378c4bd8bac5aec00ad59b3890921dd85');
const CLOCK = arg('--clock', null);
const MODES = arg('--modes', 'dark,light').split(',');
const ROOMS = arg('--rooms', 'leads,clients,events,notes,invoices,expenses,calendar').split(',');
const SHOTS = arg('--shots', '');
const MUTATE = process.argv.includes('--mutate');
const RENDER = !process.argv.includes('--no-render');

let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('GREEN ' + name); } else { fail++; console.log('RED   ' + name + ' \u2014 ' + why); } };
const read = (f, root = ROOT) => fs.readFileSync(path.join(root, f), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
// comments out: a retired name may be narrated in a comment, never used in code
// e-112 (ruled (a), cured at TYPE_2): comments go through the ONE home, never a regex of the rung's own.
const { stripComments: strip } = require('./lib/stripComments.cjs');

const FAMILY = ['BinderCard', 'BulkBar', 'DetailSheet', 'FilterRail', 'ForwardSheet', 'Masthead', 'SliceRow', 'SliceShell', 'SwipeRow', 'WishboneSheet']
  .map((m) => `components/vendor/slices/${m}.tsx`).concat(['app/vendor/(shell)/clients/body.tsx']);
// TYPE_2: the sheets the rooms open, and the legacy Toast (F4), take their rung through RUNG_FONT (F7).
const SATELLITES = ['AddSheet', 'NeedFirst', 'MissingChips', 'ConversationThread', 'ClientBookingSheet', 'NotesBody', 'Toast',
  'packages/LeadPackageCard', 'packages/BookingSheet', 'packages/PackageFields'].map((m) => `components/vendor/${m}.tsx`);
// cut 2 · the Calendar and the sheets it alone opens (F4), on the rungs through RUNG_FONT.
const CALENDAR = ['app/vendor/(shell)/calendar/screen.tsx', 'components/vendor/CalendarDaySheet.tsx', 'components/vendor/CalendarBlockSheet.tsx',
  'components/vendor/CalendarBands.tsx', 'components/vendor/CalendarCrewSheet.tsx'];
// NAMED, NOT HIDDEN: PackageFields' token object `T` still carries three faces because the Packages
// room's own edit sheet (components/vendor/packages/PackageEditSheet.tsx, cut 5 by the chair's order)
// reads `T.body`. The three definition lines are the one exception, each matched by its exact text;
// cut 5 retires them with their last reader.
const FACE_DEFS_HELD = new Set([
  "components/vendor/packages/PackageFields.tsx|display: 'var(--font-cormorant), Georgia, serif'",
  "components/vendor/packages/PackageFields.tsx|label: 'var(--font-jost), system-ui, sans-serif'",
  "components/vendor/packages/PackageFields.tsx|body: 'var(--font-dm-sans), system-ui, sans-serif'",
]);
const RUNGS = new Set(['46|cormorant|500', '24|cormorant|500', '17|dmsans|500', '14|dmsans|400', '12|dmsans|500', '11|dmsans|500']);
const SIX = ['Leads', 'Clients', 'Invoices', 'Expenses', 'Events', 'Notes'];
// TYPE_1b · his rows 4-8 in their home, pinned (1.7); the three foot lines his row 9 dropped, exactly
// as 612a5b76 carried them (SliceShell CHIP_BLINDNESS), the one listed removal below the list (3.1).
const HEAD_SHA = 'b7ebeb210b15d5e70989256f65fc788cec8256fcd0ff4ccdf17800cab1600354';
const OLD_FOOT = new Set([
  'Some entries may also exist as binders \u2014 phones connect them.',
  'Some entries may also exist as enquiries \u2014 phones connect them.',
  'Some dates may also sit in a binder \u2014 the entry has to name it.',
]);
// The registry's label bytes, read from lib/worklist/rooms.ts (the title's one source)
const REG = Object.fromEntries([...read('lib/worklist/rooms.ts').matchAll(/\{ id: '([a-z-]+)',\s*label: '([^']+)'/g)].map((m) => [m[1], m[2]]));
// The home's five functions, evaluated from their own bytes (never retyped here)
function headHome() {
  const ts = require(P('node_modules/typescript'));
  const src = read('lib/worklist/copy.ts'); const i = src.indexOf('export const LEGACY_ROOM_HEAD');
  if (i < 0) return null; // a tree before TYPE_1b has no home: 3.4 reds on it, it never throws
  const blk = src.slice(i, src.indexOf('} as const;', i) + '} as const;'.length);
  const js = ts.transpileModule(blk, { compilerOptions: { module: 1, target: 7 } }).outputText;
  const mod = { exports: {} }; new Function('module', 'exports', js)(mod, mod.exports); return mod.exports.LEGACY_ROOM_HEAD;
}
const MONEY_ROOMS = new Set(['leads', 'invoices', 'expenses']);

// ══ §1 · THE SOURCE ════════════════════════════════════════════════════════════════════════
function sourceCells(tag = '') {
  console.log('\n\u00a71 \u00b7 the source' + tag);
  const row = strip(read('components/vendor/slices/SliceRow.tsx'));
  cell('1.1 F is retired, and T names t1..t5 and nothing else (t0 is Today\u2019s)',
    /export const F\b/.test(row) ? 'SliceRow still exports F'
      : !/export const T = \{\s*t1: 'var\(--wl-t1\)',\s*t2: 'var\(--wl-t2\)',\s*t3: 'var\(--wl-t3\)',\s*t4: 'var\(--wl-t4\)',\s*t5: 'var\(--wl-t5\)',\s*\} as const;/.test(row) ? 'T is not the five rungs exactly' : null);
  const raw = [], fonts = [], tracks = [];
  for (const f of FAMILY.concat(SATELLITES, CALENDAR)) {
    const s = strip(read(f));
    for (const m of s.matchAll(/\b(fontFamily|fontSize|fontWeight|lineHeight|fontStyle)\s*:/g)) raw.push(`${f}: ${m[1]}`);
    for (const m of s.matchAll(/(\w+):\s*'var\(--font-(jost|italiana|cormorant|dm-sans)[^']*'|--font-(jost|italiana|cormorant|dm-sans)/g)) {
      if (m[1] && FACE_DEFS_HELD.has(`${f}|${m[0]}`)) continue;
      raw.push(`${f}: --font-${m[2] || m[3]}`);
    }
    for (const m of s.matchAll(/\bfont:\s*([^,\n}]+)/g)) if (!/^(T|RUNG)\.t[1-5]$/.test(m[1].trim())) fonts.push(`${f}: font: ${m[1].trim()}`);
    for (const m of s.matchAll(/letterSpacing:\s*([^,\n}]+)/g)) if (m[1].trim() !== "'0.08em'") tracks.push(`${f}: ${m[1].trim()}`);
  }
  cell('1.2 no raw size, face, weight, line-height or style in the family, the clients room, the sheets they open (TYPE_2) or the Calendar and its sheets (cut 2)', raw.length ? raw.slice(0, 6).join(' | ') + (raw.length > 6 ? ` (+${raw.length - 6})` : '') : null);
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
  // 1.7 · TYPE_1b: his five headline lines, byte for byte, in their ONE home (the founder's table, rows 4-8)
  {
    const src = read('lib/worklist/copy.ts');
    const i = src.indexOf('export const LEGACY_ROOM_HEAD'); const j = i < 0 ? -1 : src.indexOf('} as const;', i);
    const blk = i < 0 || j < 0 ? '' : src.slice(i, j + '} as const;'.length);
    cell('1.7 TYPE_1b: LEGACY_ROOM_HEAD holds his rows 4-8 byte for byte (sha pinned) in lib/worklist/copy.ts',
      !blk ? 'LEGACY_ROOM_HEAD not found' : sha(blk) !== HEAD_SHA ? 'the block moved: sha ' + sha(blk).slice(0, 12) : null);
  }
  // 1.8 · TYPE_1b: every headline reads the home, every title reads the registry; the retired lines are gone
  {
    const shell = strip(read('components/vendor/slices/SliceShell.tsx'));
    const clients = strip(read('app/vendor/(shell)/clients/body.tsx'));
    const notes = strip(read('app/vendor/(shell)/notes/body.tsx'));
    const heads = [...(shell + clients).matchAll(/<Masthead\b[^>]*>/g)].map((m) => m[0]);
    const bad = [];
    if (heads.length !== 6) bad.push(`${heads.length} Masthead mounts, not six (five rooms in the shell, Clients' own)`);
    heads.filter((h) => !/\bline=\{LEGACY_ROOM_HEAD\.(leads|clients|invoices|expenses|events)\(/.test(h)).forEach((h) => bad.push('a headline not from the home: ' + h.slice(0, 60)));
    if (/\b(LANE_LINE|CHIP_BLINDNESS|eyebrow=|sub=)/.test(shell + clients)) bad.push('a retired lane, foot, eyebrow or sub-line survives');
    if (!/const ROOM_NAME = Object\.fromEntries\(ROOMS\.map\(\(r\) => \[r\.id, r\.label\]\)\)/.test(shell) || !/<h1 data-room-title="" [^>]*>\{ROOM_NAME\[slice\]\}<\/h1>/.test(shell)) bad.push('the shell title is not the registry label');
    if (!/const NOTES_NAME = ROOMS\.find\(\(r\) => r\.id === 'notes'\)\?\.label/.test(notes) || !/<h1 data-room-title="" [^>]*>\{NOTES_NAME\}<\/h1>/.test(notes)) bad.push('the Notes title is not the registry label');
    cell('1.8 TYPE_1b: each headline reads LEGACY_ROOM_HEAD, each title the registry label; no lane, foot, eyebrow or sub-line survives', bad.length ? bad.join(' | ') : null);
  }
  // 1.6 · F7: RUNG_FONT is the scale read twice, var(--wl-tN, <the tuple>), generated from TYPE
  try {
    const ts = require(P('node_modules/typescript'));
    const js = ts.transpileModule(read('lib/worklist/theme.ts'), { compilerOptions: { module: 1, target: 7 } }).outputText;
    const mod = { exports: {} }; new Function('module', 'exports', 'require', js)(mod, mod.exports, require);
    const { RUNG_FONT, TYPE, TYPE_ROLE } = mod.exports;
    const bad = ['t1', 't2', 't3', 't4', 't5'].filter((k) => RUNG_FONT[k] !== `var(--wl-${k}, ${TYPE[k].weight} ${TYPE[k].size}px/${TYPE[k].line} ${TYPE[k].family === 'feature' ? TYPE_ROLE.feature : TYPE_ROLE.body})`);
    const t0 = Object.prototype.hasOwnProperty.call(RUNG_FONT, 't0');
    const lit = /RUNG_FONT[\s\S]{0,900}?\b(1[0-9]|2[0-9]|4[0-9])px/.test(strip(read('lib/worklist/theme.ts')).split('export const RUNG_FONT')[1] || '');
    cell('1.6 F7: each RUNG_FONT rung is var(--wl-tN, its own tuple), generated from TYPE (no second copy), and t0 is not offered',
      bad.length ? 'wrong: ' + bad.join(', ') : t0 ? 't0 is offered' : lit ? 'a size literal inside RUNG_FONT: a second copy of the scale' : null);
  } catch (e) { cell('1.6 F7: RUNG_FONT', 'could not transpile theme.ts: ' + e.message); }
  return fail;
}

// ══ §2-§4 · THE REAL ROOMS ═════════════════════════════════════════════════════════════════
// TYPE_2 adds each room's + (AddSheet; ClientBookingSheet submitted empty, so NeedFirst draws; the new-note
// sheet), the lead's BookingSheet, the note's own sheet and the legacy Toast (a note deleted).
// cut 2 · the Calendar: the month at rest, the Weddings view, the day sheet, and the block and crew sheets it opens.
const SCENES = { calendar: ['rest', 'weddings', 'day', 'block', 'crew'], leads: ['rest', 'sheet', 'add', 'booking'], clients: ['rest', 'sheet', 'add'], events: ['rest', 'sheet', 'add'], notes: ['rest', 'note', 'add', 'toast'], invoices: ['rest', 'sheet', 'schedule', 'add'], expenses: ['rest', 'sheet', 'add'] };
function probe(port, mode, room, scene, shots) {
  const env = { ...process.env }; if (CLOCK) env.B123_CLOCK = String(Date.parse(CLOCK));
  const r = spawnSync('node', [P('scripts/lib/b123_type_probe.mjs'), String(port), mode, room, scene, shots || ''], { encoding: 'utf8', timeout: 240000, env });
  const line = (r.stdout || '').trim().split('\n').pop();
  try { return JSON.parse(line); } catch (_e) { return { errors: ['no JSON from the probe: ' + (r.stderr || '').split('\n')[0]], nodes: [], controls: [] }; }
}
// e-123's cure (TYPE_1b): each dev server's output is KEPT in a log beside the run, and a server that
// does not come up prints its last lines, so the red carries its cause (stdio 'ignore' retired).
// A-45.5: the tree's .next/dev is cleared before every start (a fresh production build leaves state a
// dev server may refuse or stall on).
const DEVLOG = (root, port) => path.join(require('os').tmpdir(), `b123-dev-${path.basename(root)}-${port}.log`);
// F-44.160 (witnessed in the seat's container): Next 16 refuses a second `next dev` in one directory,
// and clearing .next/dev under a running server deletes its lock. So a start first waits (bounded)
// until no other next dev holds its root, and only then clears .next/dev (A-45.5).
function rootDevs(root) {
  const r = spawnSync('ps', ['-eo', 'pid,args'], { encoding: 'utf8' });
  return String(r.stdout || '').split('\n').map((l) => l.trim().split(/\s+/)).filter((w) => w.length > 1 && /next(\s+dev\b|-server)/.test(w.slice(1).join(' ')))
    .map((w) => Number(w[0])).filter((pid) => { if (pid === process.pid) return false; try { return fs.realpathSync(`/proc/${pid}/cwd`) === fs.realpathSync(root); } catch (_e) { return false; } });
}
async function startDev(root, port) {
  for (let t = 0; t < 60 && rootDevs(root).length; t += 1) await new Promise((res) => setTimeout(res, 1000));
  if (rootDevs(root).length) console.log(`  NOTE  another next dev still holds ${root} after 60s (pids ${rootDevs(root).join(', ')})`);
  else { try { fs.rmSync(path.join(root, '.next', 'dev'), { recursive: true, force: true }); } catch (_e) { /* nothing to clear */ } }
  const logFile = DEVLOG(root, port);
  const fd = fs.openSync(logFile, 'w');
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(port)], {
    cwd: root, detached: true, stdio: ['ignore', fd, fd],
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${port}/__api` },
  });
  fs.closeSync(fd);
  for (let i = 0; i < 180; i += 1) {
    const ok = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', `http://localhost:${port}/vendor/rooms`], { encoding: 'utf8', timeout: 60000 }).stdout;
    if (/^[23]/.test(ok)) return dev;
    await new Promise((res) => setTimeout(res, 1000));
  }
  stop(dev);
  let tail = '';
  try { tail = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean).slice(-25).join('\n'); } catch (_e) { tail = '(no log)'; }
  console.log(`\n── the dev server for ${root} on ${port} did not come up; its last lines (${logFile}):\n${tail}\n──`);
  return null;
}
// F-44.160: a stop waits for the server to be gone, so the next start in the same root is not refused
// F-44.160's second half, found in this rung (FE-2): stop() waited on npx's own pid, and the next-server
// child outlived it, still holding the root (a stale server on 3964 in the seat's container, which later
// made b122's control blocker refuse). The whole process tree goes now, and stop() waits until it has.
const treeOf = (root) => {
  const rows = String(spawnSync('ps', ['-eo', 'pid,ppid'], { encoding: 'utf8' }).stdout || '').split('\n').slice(1)
    .map((l) => l.trim().split(/\s+/).map(Number)).filter((r) => r.length === 2 && r[0]);
  const out = [root]; for (let k = 0; k < out.length; k += 1) for (const [pid, ppid] of rows) if (ppid === out[k] && !out.includes(pid)) out.push(pid);
  return out;
};
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (_e) { return false; } };
const stop = (dev) => {
  if (!dev) return;
  const tree = treeOf(dev.pid);
  try { process.kill(-dev.pid, 'SIGTERM'); } catch (_e) { /* gone */ }
  for (const pid of tree) { try { process.kill(pid, 'SIGTERM'); } catch (_e) { /* gone */ } }
  for (let t = 0; t < 20 && tree.some(alive); t += 1) spawnSync('sleep', ['1']);
  for (const pid of tree.filter(alive)) { try { process.kill(pid, 'SIGKILL'); } catch (_e) { /* gone */ } }
  for (let t = 0; t < 10 && tree.some(alive); t += 1) spawnSync('sleep', ['0.5']);
};

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

// The cells of ONE scene, cured (c) against base (b). Lifted out of the render loop (cut 2) so a render
// MUTATION can run exactly the cells of the scene it plants in, whatever they are (M5, M10, M11), and
// name the cell that reddens; before, the mutation harness could only ever run 3.1 on Leads.
function sceneCells(room, scene, mode, c, b, f5 = new Map()) {
    const tag = `[${room} ${scene} ${mode}]`;
    if (c.browser === null || b.browser === null) { cell(`2.0 ${tag} a browser launches`, 'no Chromium: CHROME_BIN unset and @sparticuz/chromium absent'); return; }
    // the scene is only measured if BOTH trees reached it: the second tap (the clients card's Edit,
    // the paid invoice's Add) is asserted, not assumed, or a scene that never opened reads as green
    const second = (x) => (room === 'clients' && scene === 'sheet') ? x.tapped2 === 'edit' : scene === 'schedule' ? x.tapped2 === 'add'
      : scene === 'booking' ? x.tapped2 === 'booking' : scene === 'toast' ? x.tapped2 === 'delete' : (room === 'clients' && scene === 'add') ? x.tapped2 === 'submit'
      : (room === 'calendar' && scene === 'block') ? x.tapped2 === 'block' : (room === 'calendar' && scene === 'crew') ? x.tapped2 === 'crew' : true;
    const drove = c.loaded && b.loaded && (scene === 'rest' || (c.tapped && b.tapped && second(c) && second(b))) && !(c.errors || []).length && !(b.errors || []).length;
    cell(`2.0 ${tag} both trees drew the populated room and the scene`, drove ? null : `cured ${JSON.stringify({ l: c.loaded, t: c.tapped, t2: c.tapped2, e: c.errors })} base ${JSON.stringify({ l: b.loaded, t: b.tapped, t2: b.tapped2, e: b.errors })}`);
    if (!drove) return;
    typeCells(tag, c); // TYPE_2: notes' body is on the rungs now, so notes carries the type cells too
    if (scene === 'rest') {
      const g = c.nodes.filter((n) => n.scope === 0 && !n.scroller && !n.later && (n.left < 16 || n.right > 374 - 16));
      cell(`2.5 ${tag} the 16px gutter on both sides, and no overflow at 374px`,
        c.docOverflow !== 0 || c.mainOverflow !== 0 ? `overflow doc ${c.docOverflow} main ${c.mainOverflow}` : g.length ? g.slice(0, 3).map((n) => `\u201c${n.txt.slice(0, 20)}\u201d ${n.left}-${n.right}`).join(' | ') : null);
    }
    cell(`2.6 ${tag} the strip is absent`, (c.stripLabels || []).length ? 'labels: ' + c.stripLabels.join(', ') : null);
    // against 82ff431e the base still has the strip (the six labels are the one allowed removal); against a
    // tip after TYPE_1 it has none, and the words must then match with nothing removed at all
    const EXPECT = BASE.startsWith('82ff431e') ? SIX : [];
    if (scene === 'rest') cell(`3.0 ${tag} the base drew exactly the strip labels the comparison removes (${EXPECT.length ? 'six' : 'none'})`, JSON.stringify(b.stripLabels || []) === JSON.stringify(EXPECT) ? null : 'base strip: ' + JSON.stringify(b.stripLabels));
    // TYPE_1b: the room's HEAD (every node above the search glyph; for Notes, its title) is where his
    // words changed, and 3.4 reads it against his bytes. Below it the words must be the base's, node for
    // node, with the one listed removal: the three foot lines of his row 9.
    const cut = (x, isBase) => {
      const all = x.nodes.filter((n) => !n.strip);
      // Notes has no search glyph: its head is its title, and only where the title is there to take
      // (a tree before TYPE_1b has none, and its first note is a word of the list, not a head)
      // (cut 2: a base AFTER TYPE_1b carries the title too, so it is taken off either tree wherever it stands)
      if (room === 'notes') { const t = all[0] && all[0].txt === REG.notes ? 1 : 0; return { head: all.slice(0, t), body: all.slice(t) }; }
      const k = all.findIndex((n) => n.txt === '\u2315');
      return { head: k < 0 ? [] : all.slice(0, k), body: (k < 0 ? all : all.slice(k)).filter((n) => !OLD_FOOT.has(n.txt)) };
    };
    const C = cut(c, false), Bs = cut(b, true);
    const words = (x) => (x === c ? C.body : Bs.body).map((n) => n.txt);
    const wa = words(b), wc = words(c);
    let firstDiff = -1; for (let i = 0; i < Math.max(wa.length, wc.length); i += 1) if (wa[i] !== wc[i]) { firstDiff = i; break; }
    cell(`3.1 ${tag} the words are the base\u2019s, node for node`, firstDiff < 0 ? null : `at ${firstDiff}: base \u201c${wa[firstDiff]}\u201d cured \u201c${wc[firstDiff]}\u201d (${wa.length}/${wc.length})`);
    if (room === 'calendar' && scene === 'rest') {
      // 6.1 · cut 2, his "2" (26 Sept 2026): the month's name is the surface's ONE t1; every grid numeral
      // is t2 (DM Sans 17) in its unchanged circle; every upcoming-date numeral is t2 (C3). Read from the
      // grid's and the list's own markers, never from a guess about which digits are which.
      const own = c.nodes.filter((n) => !n.strip);
      const t1 = own.filter((n) => n.size === 24 && n.f === 'cormorant' && !n.fab); // the shell's + is its own control, in every room
      const gridNums = own.filter((n) => n.grid && /^\d{1,2}$/.test(n.txt));
      const nextNums = own.filter((n) => n.next && /^\d{1,2}$/.test(n.txt));
      const bad = [];
      if (t1.length !== 1 || !/^(January|February|March|April|May|June|July|August|September|October|November|December)$/.test(t1[0].txt)) bad.push('the t1 nodes are ' + JSON.stringify(t1.map((n) => n.txt)));
      if (gridNums.length < 28) bad.push(`only ${gridNums.length} grid numerals drawn`);
      const offGrid = gridNums.filter((n) => n.size !== 17 || n.f !== 'dmsans'); if (offGrid.length) bad.push(`${offGrid.length} grid numerals not at t2 (e.g. ${offGrid[0].f} ${offGrid[0].size})`);
      if (!nextNums.length) bad.push('no upcoming-date numeral drawn'); else if (nextNums.some((n) => n.size !== 17 || n.f !== 'dmsans')) bad.push('an upcoming-date numeral is not at t2');
      cell(`6.1 ${tag} cut 2 (his "2"): the month is the one t1, the grid numerals and the upcoming dates at t2`, bad.length ? bad.join(' | ') : null);
    }
    if (room === 'leads' && scene === 'rest') {
      // 6.3 · F-44.177 (folded into cut 2): a lead row's tags (TDW, Wedding, Referral) are whole on glass, in the
      // REAL faces (a fallback face hides this overflow; A-45.9): each tag's text inside its own box, and the box
      // inside every ancestor that clips. The tag stays the t5 rung in capitals.
      const tags = c.tags || []; const bad = [];
      if (!c.realFaces) bad.push('measured on fallback faces (set B123_FONT_DIR, or let next/font load the real ones): a fallback face cannot show this overflow');
      if (tags.length < 2) bad.push(`only ${tags.length} tags drawn`);
      for (const t of tags) {
        if (t.size !== 11 || t.tt !== 'uppercase') bad.push(`${t.txt} is ${t.size}px ${t.tt}, not the t5 rung in capitals`);
        if (t.text.top < t.box.top - 0.5 || t.text.bottom > t.box.bottom + 0.5) bad.push(`${t.txt}: its text (${t.text.top.toFixed(1)}-${t.text.bottom.toFixed(1)}) spills its box (${t.box.top.toFixed(1)}-${t.box.bottom.toFixed(1)})`);
        for (const k of t.clips) if (t.box.top < k.top - 0.5 || t.box.bottom > k.bottom + 0.5) { bad.push(`${t.txt}: its box (${t.box.top.toFixed(1)}-${t.box.bottom.toFixed(1)}) is cut by a clipping ancestor (${k.top.toFixed(1)}-${k.bottom.toFixed(1)})`); break; }
      }
      cell(`6.3 ${tag} F-44.177: every lead-row tag is whole in the real faces (its text in its box, its box unclipped)`, bad.length ? bad.slice(0, 3).join(' | ') : null);
    }
    if (room === 'calendar' && scene === 'day') {
      // 6.2 · F5 on the day sheet's ACTION pills: an action is a button at t4 in sentence case, whatever its
      // shape. (2.4 lets any t5 control keep capitals, for chips; these were actions sitting at t5 in capitals
      // in cut 2's first cut, which the capture showed and 2.4 could not see.)
      const acts = c.controls.filter((k) => k.tag === 'button' && /^(Move|Crew|Edit|Cancel|Mark paid)$/.test(k.name));
      const bad = acts.filter((k) => k.tt !== 'none' || k.size !== 12);
      cell(`6.2 ${tag} cut 2 (F5): the day sheet's action pills are buttons at t4 in sentence case`,
        acts.length < 5 ? `only ${acts.length} action pills drawn` : bad.length ? bad.map((k) => `${k.name} ${k.tt} ${k.size}`).slice(0, 4).join(' | ') : null);
    }
    if (scene === 'rest' && room !== 'calendar') {
      const H = C.head.map((n) => n.txt);
      const bad = [];
      if (H[0] !== REG[room]) bad.push(`the title reads \u201c${H[0]}\u201d, the registry says \u201c${REG[room]}\u201d`);
      if (room !== 'notes') {
        let at = 1;
        if (MONEY_ROOMS.has(room)) { if (!/^Rs [0-9,]+$|^\u2014$/.test(H[1] || '')) bad.push('no money figure under the title'); at = 2; }
        else if (H.some((t) => /^\d+$/.test(t))) bad.push('a count room draws a separate count figure');
        // the count his line carries is the base's own live count, read from the base's head
        const BH = Bs.head.map((n) => n.txt);
        let n = 0;
        // the base's own count: from its old head (a figure or a sub-line), or, at a base after TYPE_1b, from
        // his own line there ("Booked · 2 clients", "This week · 1 ahead"; a zero form carries no digit)
        const HOMELINE = /^(Enquiries|Booked|Outstanding|This month|This week) \u00b7 /;
        const bl = BH.find((t) => HOMELINE.test(t));
        if (bl) { const m = /(\d+)/.exec(bl); n = m ? Number(m[1]) : 0; }
        else if (room === 'clients' || room === 'events') n = Number(BH.find((t) => /^\d+$/.test(t)) || 0);
        else { const m = BH.map((t) => /(\d+) (open|filed)/.exec(t)).find(Boolean); n = m ? Number(m[1]) : 0; }
        const home = headHome();
        const want = home ? home[room](n) : null;
        if (!home) bad.push('no LEGACY_ROOM_HEAD home in this tree');
        if (home && H[at] !== want) bad.push(`the line reads \u201c${H[at]}\u201d, his byte for ${n} is \u201c${want}\u201d`);
        const rest = H.slice(at + 1).join(' ');
        if (rest && rest !== 'recent \u2304' && rest !== 'amount \u2304' && rest !== 'date \u2304') bad.push('something else in the head: ' + rest);
      }
      cell(`3.4 ${tag} TYPE_1b: the head is his: the registry title, ${MONEY_ROOMS.has(room) ? 'the figure at t2 and ' : ''}his one line with the room's own count`, bad.length ? bad.join(' | ') : null);
      // 3.5, RE-CUT (e-candidate, the seat's own): the first form read the title TEXT's top (16-22px), and
      // the text's top moves with the face's ascent: 16 in the stand-in's fallback serif, 15 on the
      // founder's machine with the real Cormorant. The ruling is the SPACE above the title, which is the
      // title element's own geometry: its box starts at the room's top, it sets 16px above its line, and
      // it is the room's first text. The face-dependent check (t1: Cormorant 24) stays on the text node.
      const t = C.head[0]; const tb = c.titleBox;
      cell(`3.5 ${tag} TYPE_1b: the room opens 16px above its first line, and that line is its title at t1`,
        !t || !tb ? 'no title' : t.size !== 24 || t.f !== 'cormorant' ? `the title is ${t.f} ${t.size}`
          : Math.abs(tb.elTop) > 0.5 ? `the title's box starts ${tb.elTop}px below the room's top, not at it`
          : tb.padTop !== 16 ? `the title sets ${tb.padTop}px above its line, not 16` : !tb.first ? 'the title is not the room\u2019s first text' : null);
    }
    const ctl = (x) => x.controls.filter((k) => !k.strip).map((k) => `${k.tag}|${k.role}|${k.name}|${k.href}`);
    const ca = ctl(b), cc = ctl(c);
    let cd = -1; for (let i = 0; i < Math.max(ca.length, cc.length); i += 1) if (ca[i] !== cc[i]) { cd = i; break; }
    cell(`3.2 ${tag} the controls are the base\u2019s by name, role and href`, cd < 0 ? null : `at ${cd}: base ${ca[cd]} cured ${cc[cd]}`);
    const kc = c.controls.filter((x) => !x.strip), kb = b.controls.filter((x) => !x.strip);
    kc.forEach((k, i) => { if (kb[i] && kb[i].name === k.name && kb[i].tt === 'uppercase' && k.tt === 'none') f5.set(`${room}: ${k.name}`, true); });
    if (room === 'invoices' && scene === 'rest') {
      const fg = c.figure;
      // AMENDED BY LABEL · TYPE_1b (the founder's "b"): the room's name is the surface's one t1, so the
      // money figure stands at t2; the question, the widest figure whole inside the column, is unchanged.
      cell(`4.1 ${tag} F6 (as amended by TYPE_1b): the longest figure renders whole at t2 inside the column`,
        !fg ? 'no money figure drawn' : fg.text !== 'Rs 9,99,99,99,999' ? 'the figure reads ' + fg.text
          : fg.size !== 17 || fg.f !== 'dmsans' ? `the figure is ${fg.f} ${fg.size}` : fg.sw > fg.cw || fg.right > 374 - 16 ? `clipped: ${fg.sw}>${fg.cw} or right ${fg.right}` : null);
    }
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
      const c = probe(pc, mode, room, scene, SHOTS && path.join(SHOTS, 'cured'));
      const b = probe(pb, mode, room, scene, SHOTS && path.join(SHOTS, 'base'));
      sceneCells(room, scene, mode, c, b, f5);
    }
    console.log('\nF5 · the controls whose case moved to sentence case (the words unchanged):');
    for (const k of f5.keys()) console.log('   ' + k);
    // F5 landed with TYPE_1 and TYPE_2. Against a base before them it must move controls; against a base
    // after them (TYPE_1b's own, 612a5b76) every control is already in sentence case, and it must move none.
    const PRE_F5 = ['82ff431e', '9b251ad4', '8a943ae1'].some((b) => BASE.startsWith(b));
    // cut 2 brings F5 to the Calendar: its buttons MUST move case; every other room is already whole.
    const moved = [...f5.keys()]; const calMoved = moved.filter((k) => k.startsWith('calendar:')); const otherMoved = moved.filter((k) => !k.startsWith('calendar:'));
    if (PRE_F5) cell('3.3 F5 moved at least one control, and every one it moved kept its words (3.2)', f5.size ? null : 'no control changed case: F5 did not land');
    else cell('3.3 F5: the Calendar\u2019s buttons move to sentence case (cut 2), and no other room\u2019s control moves', otherMoved.length ? 'moved outside the Calendar: ' + otherMoved.slice(0, 4).join(', ') : ROOMS.includes('calendar') && !calMoved.length ? 'no Calendar control moved case: F5 did not land there' : null);
  } finally { stop(devC); stop(devB); }
}

// ══ §5 · MUTATIONS ═════════════════════════════════════════════════════════════════════════
async function mutations() {
  console.log('\n\u00a75 \u00b7 mutations of production code, each restored');
  const M = [
    { id: 'M1', file: 'components/vendor/slices/SliceRow.tsx', from: /(\{row\.badge && \(\s*<span style=\{\{\s*font: T\.t5,)/, to: '$1 fontSize: 9,', cells: /^1\.2/ },
    // M2 (re-anchored at TYPE_1b: the figure moved from T.t1 to T.t2): Italiana restored on the money figure
    { id: 'M2', file: 'components/vendor/slices/Masthead.tsx', from: /(font: T\.t2,)/, to: "$1 fontFamily: 'var(--font-italiana), serif',", cells: /^1\.2/ },
    { id: 'M3', file: 'app/vendor/(shell)/notes/body.tsx', from: /(<NotesBody \/>)/, to: '<SliceDoor active="notes" />$1', cells: /^1\.4/ },
    { id: 'M4', file: 'components/vendor/slices/DetailSheet.tsx', from: /(font: T\.t5,\s*letterSpacing: )'0\.08em'/, to: "$1'0.32em'", cells: /^1\.3/ },
    // TYPE_2: a raw size back on the legacy Toast's message; RUNG_FONT stripped of its fallback (F7)
    { id: 'M6', file: 'components/vendor/Toast.tsx', from: /(font: RUNG\.t3,)/, to: '$1 fontSize: 16,', cells: /^1\.2/ },
    { id: 'M7', file: 'lib/worklist/theme.ts', from: /`var\(--wl-\$\{k\}, \$\{TYPE\[k\]\.weight\}/, to: '`var(--wl-${k}, 500', cells: /^1\.6/ },
    // M5 (re-aimed at TYPE_1b, the lane line it planted in being retired): one word of the list changes,
    // the TDW mark on a lead's row; the words below the head must redden
    { id: 'M5', file: 'components/vendor/slices/SliceRow.tsx', from: />TDW<\/span>/, to: '>TDX</span>', cells: /^3\.[12]/, render: { room: 'leads', scene: 'rest' } }, // WIDENED (ruled): the mark is inside the row's button, so its accessible name (3.2) moves with the word (3.1)
    // cut 2 · his "2" and F5 on the day sheet, each reddening its own render cell and only it:
    // M10 the grid numerals back at t3 (6.1); M11 the day sheet's action pills back at t5 in capitals (6.2)
    // F-44.177: today's tag restored (inside the name's clipping line, inline): 6.3 must redden
    { id: 'M12', file: 'components/vendor/slices/SliceRow.tsx', cells: /^6\.3/, render: { room: 'leads', scene: 'rest' },
      apply: (src) => src.replace("<div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>", "<div style={{ font: T.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>")
        .split("display: 'inline-flex',\n                alignItems: 'center',\n                flexShrink: 0,").join("verticalAlign: 'middle',") },
    { id: 'M10', file: 'app/vendor/(shell)/calendar/screen.tsx', cells: /^6\.1/, render: { room: 'calendar', scene: 'rest' },
      apply: (src) => { const i = src.indexOf('data-cal-grid'); const j = src.indexOf('font: RUNG.t2', i); return i < 0 || j < 0 ? src : src.slice(0, j) + 'font: RUNG.t3' + src.slice(j + 'font: RUNG.t2'.length); } },
    { id: 'M11', file: 'components/vendor/CalendarDaySheet.tsx', cells: /^6\.2/, render: { room: 'calendar', scene: 'day' },
      apply: (src) => { const i = src.indexOf('function pillBtn'); return i < 0 ? src : src.slice(0, i) + src.slice(i).replace('font: RUNG.t4,', "font: RUNG.t5, letterSpacing: '0.08em', textTransform: 'uppercase',"); } },
    // TYPE_1b: one of his bytes changed in the home; the title typed instead of read from the registry
    { id: 'M8', file: 'lib/worklist/copy.ts', from: /'Enquiries \\u00b7 none open'/, to: "'Enquiries \\u00b7 none at all'", cells: /^1\.7/ },
    { id: 'M9', file: 'components/vendor/slices/SliceShell.tsx', from: /\{ROOM_NAME\[slice\]\}<\/h1>/, to: '{"Leads"}</h1>', cells: /^1\.8/ },
  ];
  for (const m of M) {
    const abs = P(m.file); const orig = fs.readFileSync(abs, 'utf8'); const h = sha(orig);
    const planted = m.apply ? m.apply(orig) : orig.replace(m.from, m.to);
    if (planted === orig) { cell(`5.${m.id} the anchor exists`, 'anchor not found in ' + m.file); continue; }
    try {
      fs.writeFileSync(abs, planted);
      const before = fail, beforePass = pass; const lines = [];
      const keep = console.log; console.log = (s) => lines.push(String(s));
      try {
        if (m.render) {
          // the planted tree and the base, the SAME scene, and that scene's own cells, whichever they are
          const { room, scene } = m.render;
          const dev = await startDev(ROOT, 3999);
          try { const c = probe(3999, 'dark', room, scene); const bt = baseTree(); const devB = bt.dir ? await startDev(bt.dir, 3998) : null;
            try { const b = devB ? probe(3998, 'dark', room, scene) : { nodes: [], controls: [] }; sceneCells(room, scene, 'dark', c, b);
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
