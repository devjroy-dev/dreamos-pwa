// scripts/b172_web6_customiser_bench.js · TDW CE-47 · WEB-6 · THE WEBSITE CUSTOMISER · RUNG b172 (dreamos-pwa).
// Mock r1 approved in shape by CE-47 (30 September 2026) and made real with r2's changes (items 1 to 8).
// §1 reads the source: one home imported by both page files; every word in one file and clean (no long dash, no
// "couple", no her/she prose, no persona name, one KIND key); no finish id written in the room (the card's `offers` are
// the only source, W6-i); shell tokens only; 12-hour clock; destructive actions last; the "?" card's three lines; W6-c's
// cures in both copies of today's screen; the add stand-in and FE-5's RoomHeadAdd never both present.
// §2 drives the REAL room in headless Chromium against next dev in mock mode (C-43.18), classic and v2, dark and light,
// Essential, Signature, Prestige, Basic and a new vendor, every door answered by scripts/lib/b172_fixtures.mjs.
// §3 mutates production code; each mutation must turn its cell red; files restored byte for byte by sha.
// WEB-8 (F-44.419): every mutation goes through scripts/lib/mutation_guard.js (kept copy and marker first, restored by
// sha, a killed run's mutation put back at the next start); no mutation is planted unless the disk has room; and the
// bench refuses (exit 3) when ../dream-os is missing or older than the commit it needs (lesson 4, scripts/lib/web8_gates.js).
// The dev server is stopped BY PID (e-222), never by pattern. F-44.258: the run ends with git status against the list.
// usage: node scripts/b172_web6_customiser_bench.js [--source] [--no-mutate] [--shots DIR]      THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
let pass = 0; let fail = 0;
function ok(cond, name, info) { if (cond) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; console.log(`  FAIL  ${name}${info ? '  [' + String(info).slice(0, 300) + ']' : ''}`); } }
const sec = (t) => console.log(`\n§${t}`);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const PORT = 3994;
const args = process.argv.slice(2);
const SHOTS = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

const ROOM = 'components/website/WebsiteRoom.tsx';
const COPYF = 'lib/website/copy.ts';
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
const gates = require(path.join(ROOT, 'scripts/lib/web8_gates.js'));
guard.recoverOrRefuse(ROOT, 'b172');   // F-44.258/F-44.419: a killed run's mutation is put back by sha before anything is read
if (!args.includes('--source')) gates.siblingOrRefuse(path.join(ROOT, '..', 'dream-os'), gates.SITE_NEEDS, gates.SITE_NEEDS_WHY, 'b172');
const CLIENT = 'components/website/client.ts';
const ADD = 'components/website/headAdd.tsx';
const PAGES = ['app/vendor/(shell)/your-website/page.tsx', 'v2/app/vendor/(shell)/your-website/page.tsx'];
const SCREENS = ['app/vendor/(shell)/your-website/screen.tsx', 'v2/app/vendor/(shell)/your-website/screen.tsx'];
const HELPS = ['lib/worklist/pageHelp.ts', 'v2/lib/worklist/pageHelp.ts'];
const V2HELP = 'v2/components/worklist/PageHelp.tsx';

// string literals of a file (single, double, template), comments stripped
const literals = (src) => { const s = strip(src); const out = []; const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g; let m; while ((m = re.exec(s))) out.push(m[1] ?? m[2] ?? m[3]); return out; };
const PERSONAS = /\b(Eliza|Victor|Donna|Harvey|Maya|Louis|Jessica|Mike|Rachel)\b/;

function source() {
  sec('1 · source');
  for (const pg of PAGES) {
    const s = strip(read(pg));
    ok(/import WebsiteRoom from '@\/components\/website\/WebsiteRoom'/.test(s) && /<WebsiteRoom vendorId=\{session\.id\} Today=\{YourWebsiteScreen\}( addInline)? \/>/.test(s), `1.1 ${pg} mounts the one home with its own today's screen`);
  }
  ok(!fs.existsSync(P('v2/components/website')), '1.2 no second copy of the customiser under v2/ (W6-e)');

  const copy = read(COPYF); const lits = literals(copy);
  ok(!lits.some((l) => /[\u2014\u2013]/.test(l)), '1.3 no long dash in any word', lits.filter((l) => /[\u2014\u2013]/.test(l)).join(' | '));
  ok(!lits.some((l) => /\bcouples?\b/i.test(l)), '1.4 no "couple" in any word');
  ok(!lits.some((l) => /\b(her|she|hers)\b/i.test(l)), '1.5 no her/she prose in any word (R-45.20)', lits.filter((l) => /\b(her|she)\b/i.test(l)).join(' | '));
  ok(!lits.some((l) => PERSONAS.test(l)), '1.6 no persona name in chrome');
  const kindDefs = (strip(copy).match(/export const KIND = '([^']+)'/) || [])[1];
  const allSrc = ['components/website/WebsiteRoom.tsx', COPYF, CLIENT].map((f) => strip(read(f))).join('\n');
  ok(!!kindDefs && allSrc.split(`'${kindDefs}'`).length - 1 === 1, `1.7 the room's word for testimonials ("${kindDefs}") is spelled once, in KIND (item 9)`);

  const room = strip(read(ROOM));
  const jsxText = [...room.matchAll(/>\s*([A-Za-z][A-Za-z ,.'’]{2,})\s*<\//g)].map((m) => m[1].trim()).filter((t) => !/^(TDW)$/.test(t));
  ok(jsxText.length === 0, '1.8 the room draws no word of its own: every word from copy.ts', jsxText.slice(0, 6).join(' | '));
  const idLits = literals(read(ROOM)).concat(literals(read(CLIENT)));
  ok(!idLits.some((l) => /^(glow|glass|soft|round|pill|outline|square|solid)$/.test(l)), '1.9 no finish id written in the room: only the card\'s offers are drawn (W6-i)');
  const css = (room.match(/const CSS = `([\s\S]*?)`;/) || [])[1] || '';
  const hexOutside = css.replace(/var\([^()]*(\([^()]*\))?[^()]*\)/g, '').match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const allowed = hexOutside.filter((h) => !/^#fff$/i.test(h));   // the focal dot on a photograph is white in every theme
  ok(allowed.length === 0, '1.10 shell tokens only (a hex only as a var() fallback; white only for the focal dot)', allowed.join(' '));

  // 12-hour clock, months written out
  const tsx = require('typescript');
  const js = tsx.transpileModule(read(COPYF), { compilerOptions: { module: tsx.ModuleKind.CommonJS, target: tsx.ScriptTarget.ES2019 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, require);
  const at = (h, mi) => m.exports.clock(new Date(2026, 8, 30, h, mi));
  ok(at(19, 0) === '7:00 pm' && at(10, 0) === '10:00 am' && at(12, 0) === '12:00 pm' && at(0, 5) === '12:05 am', '1.11 clock: "7:00 pm", "10:00 am", "12:00 pm", "12:05 am"', [at(19, 0), at(10, 0), at(12, 0), at(0, 5)].join(', '));
  ok(/^February 2026$/.test(m.exports.monthYear('2026-02-01')), '1.12 months written out', m.exports.monthYear('2026-02-01'));

  // destructive last, asked first
  const raw = read(ROOM);
  const look = raw.slice(raw.indexOf('function LookEditor'), raw.indexOf('// ── kind words'));
  ok(look.lastIndexOf('WEB.save}') < look.indexOf('WEB.deleteLook}') && /setSheet\(\{ del: look\.id \}\)/.test(look), '1.13 Delete this look is after Save and opens a sheet first');
  const chg = room.slice(room.indexOf("sheet === 'changes'"), room.indexOf("sheet === 'discard'"));
  ok(chg.indexOf('WEB.publish}') < chg.indexOf('WEB.discard}') && /setSheet\('discard'\)/.test(chg), '1.14 Discard these changes is last and asks');
  const disc = room.slice(room.indexOf("sheet === 'discard'"), room.indexOf("sheet === 'publish'"));
  ok(disc.indexOf('site.discard') > -1 && disc.indexOf('wb-danger') < disc.indexOf('WEB.keep'), '1.15 the discard sheet names what is lost, then Keep them');
  ok(!/toast/i.test(room), '1.16 no toast: the result is written on the line it changed');

  for (const h of HELPS) {
    const e = (read(h).match(/\[WEBSITE_HREF\]: entry\([\s\S]*?\}\),/) || [''])[0];
    const steps = (e.match(/\['(list|add|share|send|read|edit|reply|tag|calendar|money|switch)'/g) || []).length;
    ok(steps > 0 && steps <= 3 && !/couple|\u2014/.test(e), `1.17 ${h}: the "?" card has at most three how-to lines (item 1)`, steps);
  }
  for (const f of SCREENS) {
    const lits2 = literals(read(f));
    ok(!lits2.some((l) => /\bcouples?\b/i.test(l)) && !lits2.some((l) => /\u2014|\\u2014/.test(l)) && lits2.includes('SEO: found on Google') && !lits2.some((l) => /price switch is on/.test(l)), `1.18 ${f}: W6-c's cures (no "couple", no long dash, the site's own price setting)`);
  }
  const fe5 = fs.existsSync(P(V2HELP)) && /export function RoomHeadAdd/.test(read(V2HELP));
  // WEB-8 (r2): the stand-in is gone; the room imports FE-5's RoomHeadAdd, and the classic page (no provider in its shell) asks for the inline pill.
  ok(fe5 && !fs.existsSync(P(ADD)) && /import \{ RoomHeadAdd \} from '@\/v2\/components\/worklist\/PageHelp'/.test(room) && !/headAdd/.test(room), '1.19 the stand-in is deleted and the room imports FE-5\'s RoomHeadAdd from the new layout\'s PageHelp');
  ok(/RoomHeadAdd addKey="website:new-look" label=\{WEB\.newLook\}/.test(room) && /addInline \? <button type="button" className="wb-pill" data-add-key="website:new-look"/.test(room)
    && /<WebsiteRoom [^>]*addInline \/>/.test(read(PAGES[0])) && !/addInline/.test(read(PAGES[1])), '1.20 Looks carries "+ New look": through RoomHeadAdd\'s props { addKey, label, onAdd } in the new layout, as an inline pill (addInline) in classic (item 5)');
  ok(/updateMe\(\{ rate_display: v \}\)/.test(room) && !/show_prices/.test(room + strip(read(CLIENT))), '1.21 prices are vendors.rate_display through /me, not a drafted setting (W6-k ruling)');
  const adm = strip(read('app/admin/approvals/photos/page.tsx')); const api = strip(read('lib/admin-api/index.ts'));
  ok(/\{ value: 'look', label: 'Looks' \}/.test(adm) && /getPhotoQueue\(\{ state, kind,/.test(adm) && /approvePhoto\(id, kind\)/.test(adm) && /rejectPhoto\(id, .*, kind\)/.test(adm), '1.23 the photo approval page has a Looks tab over the same queue; approve and reject carry kind');
  ok(/kind === 'look' \? \{ kind \} : \{\}/.test(api) && /kind === 'look' \? \{ reason, kind \} : \{ reason \}/.test(api) && /if \(p\.kind !== 'look'\) delete p\.kind/.test(api), '1.24 the portfolio queue is called exactly as before; only the Looks tab adds kind=look');
  ok(/maxLength=\{200\}/.test(adm), '1.25 a look photo\'s reason is capped at 200, as the door keeps it');
  ok(/previewToken\(room\.preview\)/.test(room) && !/preview_url/.test(room + strip(read(CLIENT))) && /`\$\{BASE\}\/room`/.test(strip(read(CLIENT))) && !/\/settings`\)/.test(strip(read(CLIENT)).replace(/patchJson[^;]*settings`, body\)/, '')), '1.22 the room reads GET /room, as landed');
}

// ── §2 · the real room ─────────────────────────────────────────────────────────────────────────
const JOBS = [
  { name: 'c_dark_01_room', plan: 'signature', h: 1640 },
  { name: 'c_dark_02_changes', plan: 'signature', steps: [{ click: '3 changes are not on the website yet.', prefix: true }] },
  { name: 'c_dark_03_discard', plan: 'signature', steps: [{ click: '3 changes are not on the website yet.', prefix: true }, { click: 'Discard these changes' }] },
  { name: 'c_dark_04_publish', plan: 'signature', steps: [{ click: 'Publish' }] },
  { name: 'c_dark_05_published', plan: 'signature', steps: [{ click: 'Publish' }, { sel: '.wb-sheet .wl-btn.pri', wait: 2000 }] },
  { name: 'c_dark_06_style', plan: 'signature', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'c_dark_07_swap', plan: 'signature', wait: 4000, steps: [{ click: 'Style', prefix: true }, { click: 'Choose' }] },
  { name: 'c_dark_08_stamp', plan: 'signature', h: 1900, steps: [{ click: 'Colours and type', prefix: true }] },
  { name: 'c_dark_09_stamp_adjusted', plan: 'signature', opt: { custom: true }, h: 1100, steps: [{ click: 'Colours and type', prefix: true }] },
  { name: 'c_dark_10_sections', plan: 'signature', h: 1100, steps: [{ click: 'Sections', prefix: true }] },
  { name: 'c_dark_11_looks', plan: 'signature', h: 1560, steps: [{ click: 'Looks', prefix: true }] },
  { name: 'c_dark_12_look', plan: 'signature', h: 2300, steps: [{ click: 'Looks', prefix: true }, { sel: '[data-look="l1"]', wait: 1500 }] },
  { name: 'c_dark_13_look_delete', plan: 'signature', steps: [{ click: 'Looks', prefix: true }, { sel: '[data-look="l1"]', wait: 1500 }, { click: 'Delete this look' }] },
  { name: 'c_dark_14_kind', plan: 'signature', h: 1700, steps: [{ click: 'Client reviews', prefix: true }] },
  { name: 'c_dark_15_kind_link', plan: 'signature', h: 1000, steps: [{ click: 'Client reviews', prefix: true }, { sel: '#wb-client', type: 'Ananya Kapoor' }, { click: 'Make the link', wait: 1200 }] },
  { name: 'c_dark_16_visitors', plan: 'signature', h: 1000, steps: [{ click: 'Visitors', prefix: true, wait: 1500 }] },
  { name: 'c_dark_17_prices', plan: 'signature', steps: [{ click: 'Prices on the website', prefix: true }] },
  { name: 'c_dark_18_fix', plan: 'signature', steps: [{ click: 'What to fix', prefix: true }] },
  { name: 'c_dark_19_help', plan: 'signature', help: true },
  { name: 'c_dark_20_ess_style', plan: 'essential', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'c_dark_21_ess_swap', plan: 'essential', wait: 4000, steps: [{ click: 'Style', prefix: true }, { click: 'Choose' }] },
  { name: 'c_dark_22_ess_visitors', plan: 'essential', h: 900, steps: [{ click: 'Visitors', prefix: true, wait: 1500 }] },
  { name: 'c_dark_23_pre_style', plan: 'prestige', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'c_dark_24_pre_sections', plan: 'prestige', h: 1100, steps: [{ click: 'Sections', prefix: true }] },
  { name: 'c_dark_25_pre_visitors', plan: 'prestige', h: 1000, steps: [{ click: 'Visitors', prefix: true, wait: 1500 }] },
  { name: 'c_dark_26_basic', plan: 'basic', h: 2000, wait: 5000 },
  // WEB-8 (Basic's one free style, CE-47 rulings a, b, c): the style page free and with the clock running, colours and type, sections
  { name: 'c_dark_28_basic_style', plan: 'basic', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'c_dark_29_basic_clock', plan: 'basic_locked', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'c_dark_30_basic_stamp', plan: 'basic', h: 1900, steps: [{ click: 'Colours and type', prefix: true }] },
  { name: 'c_dark_31_basic_sections', plan: 'basic', h: 1640, steps: [{ click: 'Sections', prefix: true }] },
  { name: 'c_dark_32_basic_use', plan: 'basic', wait: 6000, steps: [{ click: 'Style', prefix: true }, { sel: '[data-use-instead]', wait: 1500 }] },
  { name: 'c_light_28_basic_style', plan: 'basic', mode: 'light', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'v2_dark_28_basic_style', plan: 'basic', layout: 'v2', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'v2_light_29_basic_clock', plan: 'basic_locked', layout: 'v2', mode: 'light', h: 1560, wait: 6000, steps: [{ click: 'Style', prefix: true }] },
  { name: 'c_dark_27_new', plan: 'new', h: 1640 },
  { name: 'c_dark_28_new_publish', plan: 'new', steps: [{ click: 'Publish' }] },
  { name: 'c_dark_29_new_looks', plan: 'new', h: 1300, steps: [{ click: 'Add the first look', prefix: true }] },
  { name: 'c_dark_30_today_main', plan: 'signature', opt: { today: true }, h: 1500 },
  { name: 'c_dark_31_new_nodraft', plan: 'new', opt: { nodraft: true }, h: 900 },
  { name: 'c_light_01_room', plan: 'signature', mode: 'light', h: 1640 },
  // WEB-8 C2 (CE-47): the first-Publish bar (the founder saw "ublis"), both themes, both layouts; each also at 360 below
  { name: 'c_light_27_new', plan: 'new', mode: 'light', h: 1640 },
  { name: 'v2_dark_27_new', plan: 'new', layout: 'v2', h: 1640 },
  { name: 'v2_light_27_new', plan: 'new', layout: 'v2', mode: 'light', h: 1640 },
  { name: 'v2_dark_01_room', plan: 'signature', layout: 'v2', h: 1720 },
  { name: 'v2_dark_11_looks', plan: 'signature', layout: 'v2', h: 1600, steps: [{ click: 'Looks', prefix: true }] },
  { name: 'v2_dark_19_help', plan: 'signature', layout: 'v2', help: true },
  { name: 'v2_light_26_basic', plan: 'basic', layout: 'v2', mode: 'light', h: 2000, wait: 5000 },
];

// WEB-8 (e-275): the port must be free before the server starts and after it stops, each within a bound; if the server
// exits before it answers, the run says so with its last lines, instead of waiting out the full bound on a dead server.
function portFree(boundS) { for (let i = 0; i < boundS; i += 1) { const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '2', `http://localhost:${PORT}/`], { encoding: 'utf8' }); if (r.stdout === '000') return true; spawnSync('sleep', ['1']); } return false; }
function devUp() {
  const LOG = path.join(require('os').tmpdir(), 'b172-dev.log');
  const freeBefore = portFree(60);
  const log = fs.openSync(LOG, 'w');
  const dev = spawn('node', ['node_modules/.bin/next', 'dev', '-p', String(PORT)], { cwd: ROOT, detached: true, stdio: ['ignore', log, log],
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  let up = false; let exited = null; dev.on('exit', (c, s) => { exited = `exit ${c === null ? s : c}`; });
  for (let i = 0; i < 150 && !up; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '200', `http://localhost:${PORT}/vendor/your-website`], { encoding: 'utf8' }); up = /^[23]/.test(r.stdout);
    if (!up) { const ch = spawnSync('kill', ['-0', String(dev.pid)]); if (ch.status !== 0) { exited = exited || 'gone'; break; } spawnSync('sleep', ['2']); }
  }
  let why = '';
  if (!up) { let tail = ''; try { tail = fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).slice(-6).join(' | '); } catch (_e) { tail = 'no log'; } why = `port free before: ${freeBefore}; server: ${exited || 'still running'}; log: ${tail}`.slice(0, 600); }
  return { dev, up, why };
}
function devDown(dev) { try { process.kill(-dev.pid, 'SIGKILL'); } catch (_e) { /* already gone */ } portFree(30); }

function render() {
  sec('2 · the real room (mock mode, C-43.18)');
  const { dev, up, why } = devUp();
  try {
    ok(up, '2.0 next dev answers', why);
    if (!up) return;
    // WEB-8 (e-275 amended): --jobs <regex> runs only the frames whose names match, with the cells that read them
    const JOBRX = args.includes('--jobs') ? new RegExp(args[args.indexOf('--jobs') + 1]) : null;
    const base = JOBS.filter((j) => !JOBRX || JOBRX.test(j.name)).map((j) => ({ layout: 'classic', mode: 'dark', ...j }));
    // every frame at 374, and again at 360 (the founder: at 360 the add drops under the title, right-aligned)
    const jobs = base.concat(base.map((j) => ({ ...j, name: `${j.name}_360`, w: 360 })));
    const r = spawnSync('node', ['scripts/lib/b172_probe.mjs', String(PORT), JSON.stringify(jobs), SHOTS || ''], { cwd: ROOT, encoding: 'utf8', timeout: 1800000, maxBuffer: 64 * 1024 * 1024, env: process.env });
    let res = [];
    try { res = JSON.parse((r.stdout || '').trim().split('\n').pop()); } catch (_e) { ok(false, '2.1 the probe answered', (r.stderr || '').slice(-400)); return; }
    const by = Object.fromEntries(res.map((x) => [x.name, x]));
    if (JOBRX) {   // only the matched frames: the per-frame cells and the Basic cells
      for (const x of res) ok(x.up && x.errs.length === 0 && x.read.overflow.length === 0 && x.steps.every(([, h]) => h), `2.1 ${x.name}: mounted, 0 page errors, nothing past 374, every tap found its control`, JSON.stringify({ e: x.errs, o: x.read.overflow }));
      for (const x of res) ok(x.read.clipped.length === 0, `2.30 ${x.name}: no button clips its label`, JSON.stringify(x.read.clipped));
      basicCells(res, by); return;
    }
    for (const x of res) ok(x.up && x.errs.length === 0 && x.read.overflow.length === 0 && x.steps.every(([, h]) => h), `2.1 ${x.name}: mounted, 0 page errors, nothing past 374, every tap found its control`, JSON.stringify({ e: x.errs, o: x.read.overflow, s: x.steps.filter(([, h]) => !h) }));
    for (const n of ['c_dark_11_looks_360', 'v2_dark_11_looks_360']) { const pill = res.find((x) => x.name === n);
      ok(pill && pill.read.pill && pill.read.pill.right <= 360 && pill.read.pill.overlaps === 0, `2.29 ${n}: at 360 the "+ New look" pill overlaps nothing and stays inside the screen`, JSON.stringify(pill && pill.read.pill)); }
    // WEB-8 C2 (CE-47): no button in the room clips its label, on any frame, at 374 and 360, both themes and layouts
    for (const x of res) ok(x.read.clipped.length === 0, `2.30 ${x.name}: no button clips its label`, JSON.stringify(x.read.clipped));
    for (const n of ['c_dark_27_new', 'c_light_27_new', 'v2_dark_27_new', 'v2_light_27_new']) for (const w of ['', '_360']) { const f = by[n + w]; const pb = f && f.read.publishBtn;
      ok(pb && pb.label === 'Publish' && pb.sw <= pb.cw + 1 && pb.right <= (w ? 360 : 374), `2.31 ${n}${w}: beside "Visitors still see today's page..." the Publish button shows its whole label`, JSON.stringify(pb)); }
    for (const x of res) ok(x.read.headQs === 1, `2.2 ${x.name}: one "?" on the room head (item 8)`, x.read.headQs);
    for (const n of ['c_dark_19_help', 'v2_dark_19_help']) ok(by[n] && by[n].read.helpScroll !== null && by[n].read.helpScroll <= 1, `2.3 ${n}: the "?" card is whole at 374 by 812, nothing scrolls (item 1)`, by[n] && by[n].read.helpScroll);
    const c2 = by.c_dark_02_changes.read; ok(c2.sheet === 'Changes not on the website yet' && c2.sheetButtons[c2.sheetButtons.length - 1] === 'Discard these changes' && /Colours changed/.test(c2.text) && !/\bsettings\b/.test(c2.text), '2.4 the pending line opens the list, Discard these changes last (item 3)', JSON.stringify(c2.sheetButtons));
    const c3 = by.c_dark_03_discard.read; ok(c3.sheet === 'Discard 3 changes?' && c3.sheetButtons.join('|') === 'Discard|Keep them', '2.5 discard asks first', JSON.stringify(c3.sheetButtons));
    const c4 = by.c_dark_04_publish.read; ok(c4.sheet === 'Publish 3 changes?' && /changes for every visitor within about 10 minutes\./.test(c4.text) && !/within a minute/.test(c4.text), '2.6 Publish says what happens: within about 10 minutes, as the line after it (item 3; WEB-8 C2 r2)', c4.text.slice(0, 300));
    const c5 = by.c_dark_05_published; ok(/Published\. Visitors will see your new website within about 10 minutes\./.test(c5.read.text) && !/Published at \d/.test(c5.read.text) && c5.calls.some((c) => /^POST .*\/site\/publish$/.test(c)), '2.7 after Publish the line reads "Published. Visitors will see your new website within about 10 minutes." and the publish door was called (WEB-8 C2)', c5.calls.join(' '));
    const c7 = by.c_dark_07_swap.read; ok(c7.sheet === 'Which style should Noir replace?' && !c7.sheetButtons.includes('Aurora') && /are kept/.test(c7.text), '2.8 Choose on a full plan: which style it replaces, the one in use not offered, settings kept (item 2)', JSON.stringify(c7.sheetButtons));
    const c8 = by.c_dark_08_stamp.read.text; ok(/Glow/.test(c8) && /Glass/.test(c8) && /Aurora has no texture/.test(c8) && !/\bSoft\b|\bRound\b|Rounded/.test(c8), '2.9 only the ids GET /room offers for Aurora are drawn (Glow, Solid, Glass; one corner and one texture draw no control)');
    ok(/One colour was adjusted/.test(by.c_dark_09_stamp_adjusted.read.text) && /made darker/.test(by.c_dark_09_stamp_adjusted.read.text) && /3\.1 to 1, now 4\.6 to 1/.test(by.c_dark_09_stamp_adjusted.read.text), '2.10 an own accent the gate moved says so, with its direction and both ratios');
    const c12 = by.c_dark_12_look.read.text; ok(/Waiting for approval/.test(c12) && /Approved/.test(c12) && /Not approved: The photo is blurred/.test(c12) && /A look saves on its own/.test(c12), '2.11 each photograph shows its review, a refusal its reason; the look\'s own saving rule is written (item 4)');
    ok(by.c_dark_13_look_delete.read.sheet === 'Delete The Emerald Bride?' && by.c_dark_13_look_delete.read.sheetButtons.join('|') === 'Delete|Cancel', '2.12 Delete this look asks first (item 4)');
    for (const n of ['c_dark_11_looks', 'v2_dark_11_looks']) { const c11 = by[n] ? by[n].read : null;
      ok(c11 && c11.pill && /\+\s*New look/.test(c11.pillText || '') && c11.pills === 1, `2.13 ${n}: Looks carries one "+ New look" pill (item 5)`, JSON.stringify(c11 && { t: c11.pillText, n: c11.pills })); }
    const c16 = by.c_dark_16_visitors.read.text; ok(/152 people visited/.test(c16) && /Instagram \(92\)/.test(c16), '2.14 visitors: the sentences, then one bar per source (item 6)');
    ok(/shows on Signature/.test(by.c_dark_22_ess_visitors.read.text), '2.15 Essential: sources say their plan, never a zero');
    ok(/Visitors saved looks 23 times/.test(by.c_dark_25_pre_visitors.read.text), '2.16 Prestige: saved looks shown');
    ok(/Which style should/.test(by.c_dark_21_ess_swap.read.sheet || ''), '2.17 Essential holds two; a third asks which to replace (item 7)', by.c_dark_21_ess_swap.read.sheet);
    const pre = by.c_dark_24_pre_sections.read.text; ok(!/Always first/.test(pre) && /Switch off to remove it/.test(pre), '2.18 Prestige: full order, the credit switch live (item 7)');
    basicCells(res, by);
    ok(/Visitors still see today’s page\. The new website goes up at the first Publish\./.test(by.c_dark_27_new.read.text) && /Add the first look/.test(by.c_dark_27_new.read.text) && by.c_dark_28_new_publish.read.sheet === 'Put the new website up?' && /Pictures marked TDW are examples/.test(by.c_dark_29_new_looks.read.text), '2.20 before the first Publish: the room says visitors still see today\'s page; the example pictures; what Publish does then (item 7, cut 5)');
    ok(by.c_dark_01_room.read.previews.some((u) => /[?&]preview=tok-aurora$/.test(u || '')) && by.c_dark_06_style.read.previews.some((u) => /[?&]preview=tok-aurora&style=noir$/.test(u || '')), '2.27 the preview frame loads her site with ?preview=<token>, a style card adds &style=<id> (cut 5)', JSON.stringify(by.c_dark_06_style.read.previews.slice(0, 2)));
    ok(by.c_dark_30_today_main.read.previews.every((u) => !/preview=/.test(u || '')), '2.28 with no token the frame shows today\'s live page, never a guessed parameter');
    ok(/This package costs less than your starting price/.test(by.c_dark_18_fix.read.text) && /Engagement makeup/.test(by.c_dark_18_fix.read.text), '2.21 What to fix draws to_fix.packages_below_starting_price');
    ok(/This switch works at once/.test(by.c_dark_17_prices.read.text) && /Share approximate prices in chat/.test(by.c_dark_17_prices.read.text), '2.22 Prices works at once and says so; the chat setting named as on screen (W6-d)');
    ok(/Hi Ananya, would you write/.test(by.c_dark_15_kind_link.read.text) && /Copy/.test(by.c_dark_15_kind_link.read.text), '2.23 the kind-words message sits in its own box with Copy (R-46.17)');
    ok(/Written before client links/i.test(by.c_dark_14_kind.read.text) && /cannot be shown/.test(by.c_dark_14_kind.read.text), '2.24 words not sent through a link are listed to delete, never shown');
    const nd = by.c_dark_31_new_nodraft.read.text; ok(/Visitors still see today’s page/.test(nd) && !/\bPublish\b/.test(nd.replace(/first Publish/g, '')), '2.30 before the first Publish with no draft: the plain line, and no Publish that would be refused (cut 5)');
    const t = by.c_dark_30_today_main.read.text; ok(!/not on the website yet/.test(t) && !/\bPublish\b/.test(t) && /Colours and type/.test(t), '2.25 main as it stands (no draft fields yet): no pending line and no Publish drawn');
    for (const x of res) ok(!/\b\d{1,2}:\d{2}\b(?! ?(am|pm))/.test(x.read.text), `2.26 ${x.name}: no 24-hour time drawn`);
  } finally { devDown(dev); }
}

// WEB-8 (Basic's one free style): the Basic cells, run in the whole bench and alone under --jobs (e-275 amended)
function basicCells(res, by) {
    // WEB-8 (cut 16): Basic now has the room with one free style; the old offer screen is gone
    { const t = by.c_dark_26_basic.read.text, b = by.c_dark_26_basic.read.basic;
      ok(!/What Essential adds/.test(t) && /Aurora is in use\./.test(t) && /Your website is at [a-z0-9-]+\.thedreamwedding\.in\. Your own domain is available on Signature\./.test(t) && (t.match(/Available on Essential/g) || []).length >= 2 && b.seePlans >= 2,
        '2.19 Basic: the room with her one style; client reviews and visitor counts "Available on Essential" with See plans; the address line names Signature (WEB-8, cut 16)', JSON.stringify(b)); }
    for (const n of ['c_dark_28_basic_style', 'c_light_28_basic_style', 'v2_dark_28_basic_style']) { const f = by[n]; const t = f && f.read.text; const b = f && f.read.basic;
      ok(f && /Basic has one style at a time\. Having more than one is available on Essential\./.test(t) && /You can change your style once every 30 days\./.test(t) && b.use === 5 && b.clock.length === 0 && b.seePlans >= 1 && !/\bChoose\b/.test(t),
        `2.40 ${n}: one style at a time, with See plans; five working "Use this style instead"; the 30-day line (ruling a, c)`, JSON.stringify(b)); }
    for (const n of ['c_dark_29_basic_clock', 'v2_light_29_basic_clock']) { const f = by[n]; const t = f && f.read.text; const b = f && f.read.basic;
      ok(f && /You changed your style on 6 October\. You can change it again on 5 November\./.test(t) && b.use === 0 && b.clock.length === 5 && b.clock.every((x) => x === 'You can change your style again on 5 November.'),
        `2.41 ${n}: while her clock runs, the five cards show only the server's date and no control (ruling b)`, JSON.stringify(b)); }
    { const b = by.c_dark_30_basic_stamp.read.basic;
      ok(b.locked.filter((x) => x === 'palette: Available on Essential').length === 2 && b.locked.filter((x) => x === 'font: Available on Essential').length === 1,
        '2.42 Basic colours and type: her style\'s own in use; the other two colour sets and the other pairing say "Available on Essential", no control', JSON.stringify(b.locked)); }
    { const t = by.c_dark_31_basic_sections.read.text; const b = by.c_dark_31_basic_sections.read.basic;
      ok(/Client reviews[\s\S]{0,40}Available on Essential/.test(t) && (t.match(/Available on Signature/g) || []).length === 2 && /Available on Prestige/.test(t) && b.disabled.length === 0 && b.seePlans >= 1,
        '2.43 Basic sections: each locked section names its plan (the server\'s); the footer credit says "Available on Prestige" with See plans and no switch', JSON.stringify(b)); }
    { const u = by.c_dark_32_basic_use; ok(u && u.calls.some((c) => /^PATCH .*\/site\/settings$/.test(c)), '2.44 Basic: "Use this style instead" writes her draft through the settings door', u && u.calls.join(' ')); }
    for (const x of res.filter((r) => /basic/.test(r.name))) ok(x.read.basic.disabled.every((d) => /Coming soon/.test(d)), `2.45 ${x.name}: no locked item is a dead control (the only disabled control is the Instagram row's "Coming soon", as on every plan)`, JSON.stringify(x.read.basic.disabled));
    { let sm = null; try { sm = require(require('path').join(__dirname, '..', '..', 'dream-os', 'src', 'lib', 'site', 'siteModel.js')); } catch (_e) { sm = null; }
      ok(!!sm && sm.capabilitiesFor('basic').styles === 1 && typeof sm.styleClock === 'function', '2.46 Basic\'s flags, sections and clock in these frames are the server\'s own (../dream-os at cut 16 or later), not written out by hand'); }
}

function mutate() {
  sec('3 · mutations (each must turn its cell red)');
  const cases = [
    [COPYF, "export const KIND = 'Client reviews';", "export const KIND = 'Client reviews';\nexport const K2 = 'Client reviews';", '1.7'],
    [COPYF, "discardD: 'The website stays as it is now.'", "discardD: 'The website stays as it is now \u2014 always.'", '1.3'],
    [ROOM, '{look && <button type="button" className="wb-dlink" onClick={() => setSheet({ del: look.id })}>{WEB.deleteLook}</button>}', '', '1.13'],
    [ROOM, "{ id: 'x' }", "{ id: 'x' }", 'skip'],
  ];
  const start = { [COPYF]: sha(read(COPYF)), [ROOM]: sha(read(ROOM)) };
  gates.spaceOrRefuse(ROOT, 'b172');   // F-44.419: no mutation is planted on a disk without room
  for (const [f, a, b, cell] of cases) {
    if (cell === 'skip') continue;
    const before = read(f); if (!before.includes(a)) { ok(false, `3 mutation for ${cell} found its text`); continue; }
    let h = null; try { h = guard.apply(ROOT, f, a, b, 'b172'); } catch (e) { ok(false, `3 ${cell} the mutation was planted through the guard`, e.message); continue; }
    const saved = [pass, fail]; const logs = console.log; const lines = []; let back = false;
    try { console.log = (x) => lines.push(String(x)); try { source(); } catch (_e) { /* a thrown source read counts as red */ } }
    finally { console.log = logs; pass = saved[0]; fail = saved[1]; back = h.restore(); }
    ok(back && sha(read(f)) === sha(before) && lines.some((l) => l.includes('FAIL') && l.includes(` ${cell} `) ), `3 ${cell} goes red when its rule is broken, file restored by sha`);
  }
  ok(sha(read(COPYF)) === start[COPYF] && sha(read(ROOM)) === start[ROOM] && !fs.existsSync(P('scripts/.mutation-pending')), '3.9 after the mutations both product files are their starting bytes and nothing is pending (F-44.419)');
}

source();
if (!args.includes('--source')) render();
if (!args.includes('--no-mutate')) mutate();
sec('F-44.258 · the tree after the run');
const st = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
console.log(st || '  (clean)');
console.log(`\nb172: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
