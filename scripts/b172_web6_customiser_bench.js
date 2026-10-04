// scripts/b172_web6_customiser_bench.js · TDW CE-47 · WEB-6 · THE WEBSITE CUSTOMISER · RUNG b172 (dreamos-pwa).
// Mock r1 approved in shape by CE-47 (30 September 2026) and made real with r2's changes (items 1 to 8).
// §1 reads the source: one home imported by both page files; every word in one file and clean (no long dash, no
// "couple", no her/she prose, no persona name, one KIND key); no finish id written in the room (the card's `offers` are
// the only source, W6-i); shell tokens only; 12-hour clock; destructive actions last; the "?" card's three lines; W6-c's
// cures in both copies of today's screen; the add stand-in and FE-5's RoomHeadAdd never both present.
// §2 drives the REAL room in headless Chromium against next dev in mock mode (C-43.18), classic and v2, dark and light,
// Essential, Signature, Prestige, Basic and a new vendor, every door answered by scripts/lib/b172_fixtures.mjs.
// §3 mutates production code; each mutation must turn its cell red; files restored byte for byte by sha.
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
  { name: 'c_dark_27_new', plan: 'new', h: 1640 },
  { name: 'c_dark_28_new_publish', plan: 'new', steps: [{ click: 'Publish' }] },
  { name: 'c_dark_29_new_looks', plan: 'new', h: 1300, steps: [{ click: 'Add the first look', prefix: true }] },
  { name: 'c_dark_30_today_main', plan: 'signature', opt: { today: true }, h: 1500 },
  { name: 'c_dark_31_new_nodraft', plan: 'new', opt: { nodraft: true }, h: 900 },
  { name: 'c_light_01_room', plan: 'signature', mode: 'light', h: 1640 },
  { name: 'v2_dark_01_room', plan: 'signature', layout: 'v2', h: 1720 },
  { name: 'v2_dark_11_looks', plan: 'signature', layout: 'v2', h: 1600, steps: [{ click: 'Looks', prefix: true }] },
  { name: 'v2_dark_19_help', plan: 'signature', layout: 'v2', help: true },
  { name: 'v2_light_26_basic', plan: 'basic', layout: 'v2', mode: 'light', h: 2000, wait: 5000 },
];

function devUp() {
  const log = fs.openSync(path.join(require('os').tmpdir(), 'b172-dev.log'), 'w');
  const dev = spawn('node', ['node_modules/.bin/next', 'dev', '-p', String(PORT)], { cwd: ROOT, detached: true, stdio: ['ignore', log, log],
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  let up = false;
  for (let i = 0; i < 150 && !up; i += 1) { const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '200', `http://localhost:${PORT}/vendor/your-website`], { encoding: 'utf8' }); up = /^[23]/.test(r.stdout); if (!up) spawnSync('sleep', ['2']); }
  return { dev, up };
}
function devDown(dev) { try { process.kill(-dev.pid, 'SIGKILL'); } catch (_e) { /* already gone */ } }

function render() {
  sec('2 · the real room (mock mode, C-43.18)');
  const { dev, up } = devUp();
  try {
    ok(up, '2.0 next dev answers');
    if (!up) return;
    const base = JOBS.map((j) => ({ layout: 'classic', mode: 'dark', ...j }));
    // every frame at 374, and again at 360 (the founder: at 360 the add drops under the title, right-aligned)
    const jobs = base.concat(base.map((j) => ({ ...j, name: `${j.name}_360`, w: 360 })));
    const r = spawnSync('node', ['scripts/lib/b172_probe.mjs', String(PORT), JSON.stringify(jobs), SHOTS || ''], { cwd: ROOT, encoding: 'utf8', timeout: 1800000, maxBuffer: 64 * 1024 * 1024, env: process.env });
    let res = [];
    try { res = JSON.parse((r.stdout || '').trim().split('\n').pop()); } catch (_e) { ok(false, '2.1 the probe answered', (r.stderr || '').slice(-400)); return; }
    const by = Object.fromEntries(res.map((x) => [x.name, x]));
    for (const x of res) ok(x.up && x.errs.length === 0 && x.read.overflow.length === 0 && x.steps.every(([, h]) => h), `2.1 ${x.name}: mounted, 0 page errors, nothing past 374, every tap found its control`, JSON.stringify({ e: x.errs, o: x.read.overflow, s: x.steps.filter(([, h]) => !h) }));
    for (const n of ['c_dark_11_looks_360', 'v2_dark_11_looks_360']) { const pill = res.find((x) => x.name === n);
      ok(pill && pill.read.pill && pill.read.pill.right <= 360 && pill.read.pill.overlaps === 0, `2.29 ${n}: at 360 the "+ New look" pill overlaps nothing and stays inside the screen`, JSON.stringify(pill && pill.read.pill)); }
    for (const x of res) ok(x.read.headQs === 1, `2.2 ${x.name}: one "?" on the room head (item 8)`, x.read.headQs);
    for (const n of ['c_dark_19_help', 'v2_dark_19_help']) ok(by[n] && by[n].read.helpScroll !== null && by[n].read.helpScroll <= 1, `2.3 ${n}: the "?" card is whole at 374 by 812, nothing scrolls (item 1)`, by[n] && by[n].read.helpScroll);
    const c2 = by.c_dark_02_changes.read; ok(c2.sheet === 'Changes not on the website yet' && c2.sheetButtons[c2.sheetButtons.length - 1] === 'Discard these changes' && /Colours changed/.test(c2.text) && !/\bsettings\b/.test(c2.text), '2.4 the pending line opens the list, Discard these changes last (item 3)', JSON.stringify(c2.sheetButtons));
    const c3 = by.c_dark_03_discard.read; ok(c3.sheet === 'Discard 3 changes?' && c3.sheetButtons.join('|') === 'Discard|Keep them', '2.5 discard asks first', JSON.stringify(c3.sheetButtons));
    const c4 = by.c_dark_04_publish.read; ok(c4.sheet === 'Publish 3 changes?' && /changes for every visitor within a minute/.test(c4.text), '2.6 Publish says what happens (item 3)');
    const c5 = by.c_dark_05_published; ok(/Published at \d{1,2}:\d{2} (am|pm)\. The website is up to date\./.test(c5.read.text) && c5.calls.some((c) => /^POST .*\/site\/publish$/.test(c)), '2.7 after Publish the line reads "Published at 7:00 pm..." and the publish door was called', c5.calls.join(' '));
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
    ok(/What Essential adds/.test(by.c_dark_26_basic.read.text) && /See plans/.test(by.c_dark_26_basic.read.text), '2.19 Basic: today\'s one-page site and the plain offer (item 7)');
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

function mutate() {
  sec('3 · mutations (each must turn its cell red)');
  const cases = [
    [COPYF, "export const KIND = 'Client reviews';", "export const KIND = 'Client reviews';\nexport const K2 = 'Client reviews';", '1.7'],
    [COPYF, "discardD: 'The website stays as it is now.'", "discardD: 'The website stays as it is now \u2014 always.'", '1.3'],
    [ROOM, '{look && <button type="button" className="wb-dlink" onClick={() => setSheet({ del: look.id })}>{WEB.deleteLook}</button>}', '', '1.13'],
    [ROOM, "{ id: 'x' }", "{ id: 'x' }", 'skip'],
  ];
  for (const [f, a, b, cell] of cases) {
    if (cell === 'skip') continue;
    const before = read(f); if (!before.includes(a)) { ok(false, `3 mutation for ${cell} found its text`); continue; }
    fs.writeFileSync(P(f), before.replace(a, b));
    const saved = [pass, fail]; const logs = console.log; const lines = []; console.log = (x) => lines.push(String(x));
    try { source(); } catch (_e) { /* a thrown source read counts as red */ }
    console.log = logs; pass = saved[0]; fail = saved[1];
    fs.writeFileSync(P(f), before);
    ok(sha(read(f)) === sha(before) && lines.some((l) => l.includes('FAIL') && l.includes(` ${cell} `) ), `3 ${cell} goes red when its rule is broken, file restored by sha`);
  }
}

source();
if (!args.includes('--source')) render();
if (!args.includes('--no-mutate')) mutate();
sec('F-44.258 · the tree after the run');
const st = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
console.log(st || '  (clean)');
console.log(`\nb172: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
