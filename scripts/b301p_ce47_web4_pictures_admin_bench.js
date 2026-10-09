'use strict';
// scripts/b301p_ce47_web4_pictures_admin_bench.js · CE-47 · WEB-4 ADMIN PACKAGE · R-47.2, A VENDOR'S PICTURES BELONG TO HER.
// The app half of b301 (dream-os cut 30). The admin's pictures, after the founder's rule of 8 October 2026: no approval;
// "Pictures to look at" lists held pictures and Dreamers' reports; the one act on a held picture is Release; the
// admin's one power is Hide from Discover and its undo; no remove button, only a removal for a legal reason that asks
// for the reason. No network: the door runs against a stand-in for lib/admin-api/_base.
//   §1 the door (lib/admin-api/pictures.ts), run for real: every address and body, hostile answers, the state of a
//      picture, Google's answer in words, the legal reason's bounds; no approve, reject or delete door anywhere
//   §2 the source: the three dead pages are gone and RETIRED in the route map; the queue page; the vendor's pictures
//      page; Home's count; no founder line typed in the app (each is the server's)
//   §3 the words: whole sentences, no em dash, the one title everywhere
//   §4 mutations: M1 to M6 of production code, each in a child run that must red its cell, through
//      scripts/lib/mutation_guard.js (a killed run's leftovers are put back by sha at the next start).
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const CHILD = !!process.env.B301P_CHILD;
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
const MIN_FREE = 256 * 1024 * 1024;
const freeBytes = () => { const st = fs.statfsSync(ROOT); return st.bavail * st.bsize; };
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; if (!CHILD) console.log(`  PASS  ${name}`); return true; } fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 260) + ']'}`); return false; }
const sec = (t) => { if (!CHILD) console.log(`\n── ${t} ──`); };
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const read = (rel) => (exists(rel) ? fs.readFileSync(path.join(ROOT, rel), 'utf8') : '');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const F = {
  door: 'lib/admin-api/pictures.ts', index: 'lib/admin-api/index.ts', nav: 'app/admin/_components/adminNav.ts',
  queue: 'app/admin/approvals/photos/page.tsx', vendor: 'app/admin/vendors/portfolio/page.tsx', home: 'app/admin/page.tsx',
  dash: 'app/admin/dashboard/page.tsx', deck: 'app/admin/approvals/discover/page.tsx',
};
const DEAD = ['app/admin/approvals/page.tsx', 'app/admin/images/page.tsx', 'app/admin/photos/page.tsx'];
// the founder's lines (8 October 2026): the vendor's and the Dreamer's. The server writes them; the admin app types none.
const FOUNDER = ['TDW is checking this picture. It is not shown yet.', 'This picture is not shown on Discover.', 'This is not wedding work.',
  "This is someone else's work.", 'This picture is offensive.', 'TDW removed one of your pictures for a legal reason'];
const ID = '11111111-2222-4333-8444-555555555555';

// the door, transpiled and run with a stand-in _base that records every call and answers what the cell plants
function loadDoor(answer) {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const out = ts.transpileModule(read(F.door), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const calls = [];
  const base = {
    adminGet: async (p) => { calls.push(['GET', p]); return answer(p); },
    adminPost: async (p, b) => { calls.push(['POST', p, b]); return { ok: true }; },
  };
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => (spec === './_base' ? base : require(spec)), mod, mod.exports);
  return { D: mod.exports, calls };
}

async function cells() {
  sec('1  the door, run for real');
  {
    let plant = { held: [{ id: 'a', kind: 'portfolio' }, { id: 'b', kind: 'look' }], reports: [{ id: 'r' }] };
    const { D, calls } = loadDoor(() => plant);
    const q = await D.getPhotoQueue();
    const hostile = [];
    for (const bad of [null, {}, { held: 'x', reports: 7 }, []]) { plant = bad; hostile.push(await D.getPhotoQueue()); }
    ok(same(calls[0], ['GET', '/api/v2/admin/photos/queue']) && q.total_held === 2 && q.total_reports === 1 && q.held[1].kind === 'look'
      && hostile.every((h) => same(h, { held: [], reports: [], total_held: 0, total_reports: 0 })),
      '1.1 the queue: GET /api/v2/admin/photos/queue, held and reports counted; a hostile answer reads as an empty queue', JSON.stringify(hostile));
    calls.length = 0;
    await D.releasePicture(ID, 'portfolio'); await D.releasePicture(ID, 'look');
    ok(same(calls, [['POST', `/api/v2/admin/photos/${ID}/release`, {}], ['POST', `/api/v2/admin/photos/${ID}/release`, { kind: 'look' }]]),
      '1.2 release: no body for a portfolio picture, kind look for a look picture', JSON.stringify(calls));
    calls.length = 0;
    await D.hideFromDiscover(ID); await D.showOnDiscover(ID);
    ok(same(calls, [['POST', `/api/v2/admin/photos/${ID}/discover-hide`, {}], ['POST', `/api/v2/admin/photos/${ID}/discover-show`, {}]]),
      '1.3 hide from Discover and its one-tap undo, each its own door', JSON.stringify(calls));
    calls.length = 0;
    await D.closeReport(ID, 'no_change'); await D.closeReport(ID, 'hidden_from_discover');
    ok(same(calls.map((c) => c[2].outcome), ['no_change', 'hidden_from_discover']) && calls.every((c) => c[1] === `/api/v2/admin/photos/reports/${ID}/handled`),
      '1.4 a report is closed with its outcome, at the reports door', JSON.stringify(calls));
    calls.length = 0;
    await D.legalRemoval(ID, '  Court order 12 of 2026.  ', 'portfolio'); await D.legalRemoval(ID, ' Takedown notice ', 'look');
    ok(same(calls, [['POST', `/api/v2/admin/photos/${ID}/legal-removal`, { reason: 'Court order 12 of 2026.' }], ['POST', `/api/v2/admin/photos/${ID}/legal-removal`, { reason: 'Takedown notice', kind: 'look' }]]),
      '1.5 a legal removal sends the reason trimmed, and kind for a look picture', JSON.stringify(calls));
  }
  {
    let plant = { photos: [{ id: 'p' }] };
    const { D, calls } = loadDoor(() => plant);
    const a = await D.getVendorPictures('v1'); plant = { photos: 'x' }; const b = await D.getVendorPictures('v1'); plant = null; const c = await D.getVendorPictures('v1');
    ok(calls[0][1] === '/api/v2/admin/vendors/v1/portfolio' && a.length === 1 && same(b, []) && same(c, []), '1.6 her pictures: the admin portfolio door; a hostile answer is an empty list');
    const S = D.pictureState;
    ok(S({ safety_state: 'held', discover_hidden_at: 'x' }) === 'held' && S({ safety_state: 'passed', discover_hidden_at: 'x' }) === 'hidden' && S({ safety_state: 'unchecked' }) === 'unchecked'
      && S({ safety_state: 'passed', discover_hidden_at: null }) === 'shown' && S({}) === 'unchecked',
      '1.7 a picture\'s state: held wins; then hidden from Discover; passed is on Discover; anything else is not checked yet');
    ok(D.STATE_LINE.held.includes('Not on her pages') && D.STATE_LINE.hidden.startsWith('On her pages') && D.STATE_LINE.unchecked.startsWith('On her pages') && D.STATE_LINE.shown === 'On her pages and on Discover.',
      '1.8 each state says where the picture shows: only a held one is off her pages');
    ok(D.scoresLine({ adult: 'LIKELY', violence: 'VERY_UNLIKELY', racy: 'VERY_LIKELY', spoof: 'NOPE' }) === 'Google: Racy very likely, Adult likely, Violence very unlikely.'
      && D.scoresLine(null) === null && D.scoresLine({}) === null && D.scoresLine('x') === null,
      '1.9 Google\'s answer in words, strongest first; an unknown or missing answer says nothing', D.scoresLine({ adult: 'LIKELY', violence: 'VERY_UNLIKELY', racy: 'VERY_LIKELY', spoof: 'NOPE' }));
    ok(D.legalReasonOk('abc') && !D.legalReasonOk('  ab  ') && D.legalReasonOk('x'.repeat(300)) && !D.legalReasonOk('x'.repeat(301)) && !D.legalReasonOk('') && D.LEGAL_MIN === 3 && D.LEGAL_MAX === 300,
      '1.10 the legal reason is 3 to 300 letters after trimming, as the server holds it');
  }
  {
    // the route map (adminNav.ts) names retired paths and their dead doors in its notes, on purpose; it calls nothing
    const all = ['lib', 'app'].flatMap((d) => walk(d)).filter((f) => f !== F.nav).map((f) => [f, code(read(f))]);
    const doors = all.filter(([, s]) => /admin\/photos\/\$\{[^}]+\}\/(approve|reject)|admin\/photos\/bulk-approve|api\/v3\/admin\/images|admin\/vendors\/\$\{[^}]+\}\/portfolio\/\$\{[^}]+\}/.test(s)).map(([f]) => f);
    ok(doors.length === 0, '1.11 no app code calls approve, reject, bulk-approve, /api/v3/admin/images, or the admin portfolio DELETE', doors.join(', '));
  }

  sec('2  the source');
  {
    const nav = read(F.nav);
    const retired = ['/admin/approvals', '/admin/photos', '/admin/images'].every((p) => new RegExp(`path: '${p.replace(/\//g, '\\/')}',\\s+domain: '[a-z]+',\\s+disposition: 'RETIRED'`).test(nav));
    const links = ['lib', 'app'].flatMap((d) => walk(d)).filter((f) => f !== F.nav).filter((f) => /(['"`])\/admin\/(images|photos)\1|push\((['"`])\/admin\/images|href="\/admin\/(images|photos)"/.test(code(read(f))));
    ok(DEAD.every((f) => !exists(f)) && retired && links.length === 0, '2.1 the three dead pages are deleted, RETIRED in the route map, and nothing links to them', links.join(', '));
    const q = code(read(F.queue));
    ok(/from '\.\.\/\.\.\/\.\.\/\.\.\/lib\/admin-api\/pictures'/.test(q) && /releasePicture\(p\.id, p\.kind\)/.test(q) && /closeReport\(r\.id, outcome\)/.test(q) && /close\(r, 'no_change'\)/.test(q) && /close\(r, 'hidden_from_discover'\)/.test(q)
      && !/legalRemoval|Delete|delete|approvePhoto|rejectPhoto|approve\b|reject\b/i.test(q.replace(/WORDS\.\w+/g, '')),
      '2.2 "Pictures to look at": release by the picture\'s own kind, close a report with hide or no change; no remove, approve or reject');
    ok(/r\.reason_line && /.test(q) && /!alreadyHidden && <ActionChip label=\{WORDS\.hide\}/.test(q) && /href=\{herPictures\(/.test(q),
      '2.3 a report shows the Dreamer\'s reason as the server words it; hide is offered only when not already hidden; Open her pictures links to her page');
    const v = code(read(F.vendor));
    ok(!/method: 'DELETE'|adminDelete|method: 'PATCH'|onDelete|ImageGrid/.test(v) && /hideFromDiscover\(open\.id\)/.test(v) && /showOnDiscover\(open\.id\)/.test(v) && /releasePicture\(open\.id, 'portfolio'\)/.test(v)
      && /<DangerLast label=\{WORDS\.legalLabel\}/.test(v) && /if \(!legalReasonOk\(reason\)\) throw new Error\(WORDS\.legalHint\); await legalRemoval\(open\.id, reason, 'portfolio'\)/.test(v)
      && /searchParams\.get\('vendor'\)/.test(v),
      '2.4 her pictures: no delete, no dead PATCH; hide, show and release; a legal removal only behind its reason and the ask-again; the deep link kept');
    ok(/st === 'held' && <SheetRow label=\{WORDS\.release\}/.test(v) && /st !== 'held' && !open\.hidden_from_discover && <SheetRow label=\{WORDS\.hide\}/.test(v) && /st !== 'held' && open\.hidden_from_discover && <SheetRow label=\{WORDS\.show\}/.test(v),
      '2.5 the card offers what the state allows: Release on a held picture; Hide or Show on Discover otherwise');
    const h = code(read(F.home));
    ok(/getPhotoQueue\(\)\.then\(d => setPhotos\(d\.total_held \+ d\.total_reports\)\)/.test(h) && /label="Pictures to look at"/.test(h) && /export \{ getPhotoQueue,/.test(code(read(F.index))),
      '2.6 Home counts held pictures and open reports, under "Pictures to look at"');
    const app = [F.queue, F.vendor, F.home, F.door, F.dash, F.deck].map(read).join('\n');
    ok(FOUNDER.every((l) => !app.includes(l)), '2.7 no founder line is typed in the admin app: each is the server\'s');
    ok(/\{r\.photos_approved\} on Discover/.test(read(F.deck)) && /router\.push\('\/admin\/approvals\/photos'\)/.test(read(F.dash)), '2.8 the Discover deck says "on Discover" for its count; the old dashboard button goes to the new page');
  }

  sec('3  the words');
  {
    const { D } = loadDoor(() => null);
    const W = D.WORDS; const vals = Object.values(W);
    ok(vals.every((w) => !/—|–/.test(w)) && ['heldNote', 'reportsNote', 'released', 'hidden', 'shownAgain', 'closed', 'removed', 'tryAgain', 'legalLost', 'legalHint', 'vendorSub', 'noPictures', 'empty'].every((k) => /^[A-Z0-9].*\.$/.test(W[k])),
      '3.1 every sentence is whole, starts with a capital, ends with a full stop; no dash anywhere');
    const nav = read(F.nav);
    ok(W.title === 'Pictures to look at' && /<PageHeader title=\{WORDS\.title\}/.test(read(F.queue)) && /label: 'Pictures to look at', path: '\/admin\/approvals\/photos'/.test(nav) && /label: 'A vendor’s pictures', path: '\/admin\/vendors\/portfolio'/.test(nav) && W.vendorTitle === 'A vendor’s pictures',
      '3.2 one title, "Pictures to look at", on the page, in the menu and on Home; "A vendor’s pictures" (typographic apostrophe, R-40.57) for her page');
    ok(!/approv|reject/i.test(vals.join(' ')), '3.3 no word of approval or rejection in the admin\'s pictures');
  }
}

function walk(dir) {
  const out = []; const abs = path.join(ROOT, dir); if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(rel)); else if (/\.(ts|tsx)$/.test(e.name)) out.push(rel);
  }
  return out;
}

const MUTS = [
  [F.door, "kind === 'look' ? { kind } : {})", '{ kind })', 'M1 release sends kind for a portfolio picture', '1.2'],
  [F.door, "  if (p.safety_state === 'held') return 'held';\n", '', 'M2 the held state forgotten', '1.7'],
  [F.queue, 'releasePicture(p.id, p.kind)', "releasePicture(p.id, 'portfolio')", 'M3 a look picture released as a portfolio one', '2.2'],
  [F.vendor, 'if (!legalReasonOk(reason)) throw new Error(WORDS.legalHint); ', '', 'M4 a legal removal with no reason', '2.4'],
  [F.door, '{ reason: reason.trim() })', '{ reason })', 'M5 the reason sent untrimmed', '1.5'],
  [F.door, 'const held = asList<HeldPicture>(d && d.held);', 'const held = ((d && d.held) || []) as HeldPicture[];', 'M6 a hostile queue read as a list', '1.1'],
];

(async () => {
  if (!CHILD) guard.recoverOrRefuse(ROOT, 'b301p');
  try { await cells(); } catch (e) { ok(false, `b301p crashed: ${e && e.stack}`); }
  if (CHILD) process.exit(fail ? 1 : 0);
  const restores = [];
  const putBack = () => { while (restores.length) { try { restores.pop().restore(); } catch (_e) { /* recover() at the next start */ } } };
  process.on('exit', putBack); for (const sg of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sg, () => process.exit(130));
  const free = freeBytes();
  if (!ok(free >= MIN_FREE, `4.0 free space before the mutations: ${Math.floor(free / 1048576)} MB (at least ${MIN_FREE / 1048576} MB)`)) {
    console.log(`\nb301p · ${pass} pass · ${fail} fail`); console.log('FAILED: ' + failed.join(' | ')); process.exit(1);
  }
  sec('4  mutations of production code (each must red its cell in a child run; restored by sha)');
  for (const [file, from, to, name, cell] of MUTS) {
    const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
    let live = null; let r = null; let back = false;
    try { live = guard.apply(ROOT, file, from, to, 'b301p'); restores.push(live); }
    catch (e) {
      let put = sha(p) === before; if (!put) { try { fs.writeFileSync(p, src); put = sha(p) === before; } catch (_e) { put = false; } }
      ok(false, `${name}: ${e.message}${put ? '' : ' · THE FILE IS NOT THE ORIGINAL: put it back from git'}`); continue;
    }
    try { r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B301P_CHILD: '1' }, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL' }); }
    finally { back = live.restore(); restores.splice(restores.indexOf(live), 1); }
    const red = r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '');
    ok(red && back && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  ok(!fs.existsSync(guard.pendingDir(ROOT)), '4.9 nothing pending after the mutations');
  console.log(`\nb301p · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})();
