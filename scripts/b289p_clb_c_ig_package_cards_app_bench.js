'use strict';
// scripts/b289p_clb_c_ig_package_cards_app_bench.js · CE-47 · CLB PART C APP · HER PACKAGES AS CARDS IN HER INSTAGRAM MESSAGES.
// The app half of b289 (dream-os). The room "WhatsApp and Instagram" gains the section "Package cards in Instagram", in
// both trees (classic and v2), dark until the server opens it. No live model call; no network beyond localhost.
//   §1 the door (lib/vendor/igPackageCardsDoor.ts), run for real: the six states, the cards cut to Meta's 10 and 80, https
//      pictures only, hostile bodies read as a failed read, the one switch for each state
//   §2 the source, both trees: mounted after "Instagram messages"; the two components the same bytes but their homes;
//      no text node typed; the door's address; a card holds no control; Try again is a GET; the picture has no alt text
//      and sends no referrer
//   §3 the words: the labels, the same in both homes; no couple, bride, her, his or leads; no dash; no state sentence typed
//      in the app (each is the server's, R-47.1)
//   §4 the room on glass (`next dev`, a real headless Chromium; v2 in both themes, classic in dark): every state, the taps,
//      ten cards at most, the page never wider than the phone
//   §5 mutations: M1 to M7 of production code, each in a child run that must red its cell; G1 and G2 on glass. Every
//      mutation goes through scripts/lib/mutation_guard.js (F-44.419): a killed run's leftovers are put back by sha at the
//      next start, free space is checked first, each restore runs in a finally, nothing is left pending (5.9).
// Run DETACHED with its own log. THE EXIT CODE IS THE VERDICT. B289P_NO_GLASS=1 runs §1 to §3 and M1 to M7 only.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const CHILD = !!process.env.B289P_CHILD;
const NO_GLASS = CHILD || !!process.env.B289P_NO_GLASS;
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
const MIN_FREE = 512 * 1024 * 1024;
const freeBytes = () => { const st = fs.statfsSync(ROOT); return st.bavail * st.bsize; };
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; if (!CHILD) console.log(`  PASS  ${name}`); return true; } fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 260) + ']'}`); return false; }
const sec = (t) => { if (!CHILD) console.log(`\n── ${t} ──`); };
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const F = {
  door: 'lib/vendor/igPackageCardsDoor.ts',
  compV2: 'v2/components/solutions/IgPackageCards.tsx', compC: 'components/solutions/IgPackageCards.tsx',
  sectV2: 'v2/components/solutions/MetaRoomSections.tsx', sectC: 'components/solutions/MetaRoomSections.tsx',
  wordsV2: 'v2/lib/worklist/metaRoom.ts', wordsC: 'lib/worklist/metaRoom.ts',
  routesV2: 'v2/lib/solutions/routes.ts', routesC: 'lib/solutions/routes.ts',
  roomsV2: 'v2/lib/worklist/rooms.ts', roomsC: 'lib/worklist/rooms.ts',
};
// The server's sentences (HUBC_SRV_1, src/lib/instagram/igCards.js LINES), word for word. The app must type none of them.
const LINES = {
  on: 'When someone taps "See packages" in your Instagram messages, they get these cards.',
  off: 'Your packages are not shown in your Instagram messages.',
  no_packages: 'You have no packages yet. Add a package, and it will be shown here.',
  full: 'Your Instagram account already has 4 conversation starters. Remove one in Instagram, and TDW will add "See packages".',
  failed: 'Instagram did not accept the change. Please try again.',
  not_connected: 'Connect your Instagram first, and your packages can be shown in your messages.',
};
const WORDS = { heading: 'Package cards in Instagram', preview: 'Your package cards', addPackage: 'Add a package', retry: 'Try again', notSaved: 'Your change was not saved. Please try again.' };

function loadTs(rel, src) {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const out = ts.transpileModule(src === undefined ? read(rel) : src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => require(spec), mod, mod.exports);
  return mod.exports;
}
function blockOf(src, name) { const i = src.indexOf(`export const ${name} = {`); if (i < 0) return null; const j = src.indexOf('} as const;', i); return j < 0 ? null : src.slice(i, j + 11); }

function cells() {
  sec('1  the door, run for real');
  const D = loadTs(F.door);
  const card = (o) => ({ title: 'Wedding day film', subtitle: 'From Rs 1,25,000', image_url: 'https://x.supabase.co/p.jpg', button: 'See details', ...o });
  const states = Object.keys(LINES).concat([]);
  const read1 = states.map((s) => D.asCardsDoor({ ok: true, state: s, line: LINES[s], cards: [card()] }));
  ok(read1.every((d, i) => d && d.state === states[i] && d.line === LINES[states[i]] && d.cards.length === 1 && d.cards[0].subtitle === 'From Rs 1,25,000'),
    '1.1 each of the six states is read, its sentence kept word for word', JSON.stringify(read1.map((d) => d && d.state)));
  const many = D.asCardsDoor({ ok: true, state: 'on', line: 'x', cards: Array.from({ length: 13 }, (_, i) => card({ title: `P${i}` })) });
  const long = D.asCardsDoor({ ok: true, state: 'on', line: 'x', cards: [card({ title: 'T'.repeat(120), subtitle: 'S'.repeat(90) }), card({ title: '' }), card({ title: null }), 'x', card({ subtitle: null, button: null })] });
  ok(many && many.cards.length === 10 && many.cards[9].title === 'P9' && long && long.cards.length === 2 && long.cards[0].title.length === 80 && long.cards[0].subtitle.length === 80
    && long.cards[1].subtitle === null && long.cards[1].button === null,
    '1.2 Meta’s limits: at most 10 cards in her order, title and price line cut to 80, a card with no name dropped', JSON.stringify({ n: many && many.cards.length, l: long && long.cards.length }));
  const pics = ['http://x.supabase.co/p.jpg', 'javascript:alert(1)', 'https://u:p@x.supabase.co/p.jpg', 7, 'https://' + 'x'.repeat(5000), 'not a url'];
  const pd = pics.map((u) => D.asCardsDoor({ ok: true, state: 'on', line: 'x', cards: [card({ image_url: u })] }));
  ok(D.asCardsDoor({ ok: true, state: 'on', line: 'x', cards: [card()] }).cards[0].image_url === 'https://x.supabase.co/p.jpg'
    && pd.every((d) => d && d.cards.length === 1 && d.cards[0].image_url === null),
    '1.3 a picture is drawn only from an https address; anything else is no picture, and the card still shows', JSON.stringify(pd.map((d) => d && d.cards[0] && d.cards[0].image_url)));
  const hostile = [undefined, null, 0, '', [], {}, { ok: false, state: 'on', line: 'x', cards: [] }, { ok: 'true', state: 'on', line: 'x', cards: [] },
    { ok: true, state: 'live', line: 'x', cards: [] }, { ok: true, state: 'ON', line: 'x', cards: [] }, { ok: true, line: 'x', cards: [] },
    { ok: true, state: 'on', cards: [] }, { ok: true, state: 'on', line: '', cards: [] }, { ok: true, state: 'on', line: '   ', cards: [] },
    { ok: true, state: 'on', line: 'x'.repeat(401), cards: [] }, { ok: true, state: 'on', line: 5, cards: [] }, { ok: true, state: 'on', line: 'x' },
    { ok: true, state: 'on', line: 'x', cards: {} }];
  let threw = null; const admitted = [];
  for (const h of hostile) { try { if (D.asCardsDoor(h) !== null) admitted.push(JSON.stringify(h)); } catch (e) { threw = e.message; } }
  ok(threw === null && admitted.length === 0, `1.4 ${hostile.length} hostile bodies: every one is a failed read (null, the section dark), none throws`, threw || admitted.join(' | '));
  const sw = {}; for (const s of states) sw[s] = D.switchFor(s);
  ok(same(sw, { on: 'turn_off', off: 'turn_on', no_packages: 'turn_off', full: 'turn_off', failed: 'turn_off', not_connected: null }),
    '1.5 the one switch: Turn off while her choice is on, Turn on while it is off, none before Instagram is connected', JSON.stringify(sw));

  sec('2  the source, both trees');
  for (const [t, sect, pre] of [['v2', F.sectV2, '@/v2/components'], ['classic', F.sectC, '@/components']]) {
    const s = read(sect);
    ok(/<IgMessagesSection \/>\n\s*<IgPackageCards \/>\n\s*<QuietTimeRow \/>/.test(s) && s.includes(`import { IgPackageCards } from '${pre}/solutions/IgPackageCards';`),
      `2.1 ${t}: the section is drawn after "Instagram messages" and before the quiet time, from its own tree`);
  }
  const v2 = read(F.compV2); const cl = read(F.compC);
  const homesV2 = (v2.match(/from '@\/[^']+'/g) || []); const homesC = (cl.match(/from '@\/[^']+'/g) || []);
  ok(v2.replace(/'@\/v2\/lib\//g, "'@/lib/") === cl && homesV2.filter((h) => /@\/(lib\/(solutions|worklist))/.test(h)).length === 0
    && homesC.filter((h) => h.includes('@/v2/')).length === 0,
    '2.2 the two components are the same bytes but their homes: v2 reads v2’s words, routes and rooms, classic reads classic’s', JSON.stringify({ homesV2, homesC }));
  ok([v2, cl].every((s) => !/>\s*[A-Za-z][^<{]*</.test(code(s).replace(/const PC_CSS = `[\s\S]*?`;/, ''))), '2.3 no text node typed into the section: every label is read from its copy home, every sentence from the server');
  const addr = /instagramPackageCards: \(\) => `\$\{SOLUTIONS_API_PATH\}\/instagram\/package-cards`,/;
  ok(addr.test(read(F.routesV2)) && addr.test(read(F.routesC)) && (v2.match(/API\.instagramPackageCards\(\)/g) || []).length === 3 && !/fetch\(|\/api\/v2\//.test(code(v2)),
    '2.4 the door stands at /api/v2/vendor/solutions/instagram/package-cards in both trees’ routes, and the section reads only it (GET, POST, Try again)');
  const li = (v2.match(/<li key=\{i\} className="pc-card">[\s\S]*?<\/li>/) || [''])[0];
  ok(li && !/<(a|button|Link|input)\b|onClick|href=|tabIndex/.test(li) && /<div className="pc-btn" aria-hidden="true">\{c\.button\}<\/div>/.test(li),
    '2.5 a card is a preview: it holds no control, and its "See details" is drawn, not tappable');
  ok(/onClick=\{\(\) => \{ void send\(null\); \}\}>\{IG_CARDS\.retry\}/.test(v2) && /on === null\n\s*\? await getJson<unknown>\(API\.instagramPackageCards\(\)\)/.test(v2)
    && /onClick=\{\(\) => \{ void send\(false\); \}\}>\{IG\.turnOff\}/.test(v2) && /onClick=\{\(\) => \{ void send\(true\); \}\}>\{IG\.turnOn\}/.test(v2)
    && /: await postJson<unknown>\(API\.instagramPackageCards\(\), \{ on \}\)/.test(v2),
    '2.6 Try again asks again (a GET); Turn off posts { on: false }; Turn on posts { on: true }');
  const roomLine = /\{ id: 'packages',\s+label: 'Packages',\s+band: 'work', href: '\/vendor\/packages',/;
  ok(/<Link href=\{roomHref\('packages'\)\} className="sol-btn" data-pc-add="">\{IG_CARDS\.addPackage\}<\/Link>/.test(v2) && roomLine.test(read(F.roomsV2)) && roomLine.test(read(F.roomsC)),
    '2.7 Add a package opens her packages room, through the registry (/vendor/packages)');
  ok(/<img className="pc-pic" src=\{c\.image_url\} alt="" loading="lazy" referrerPolicy="no-referrer" \/>/.test(v2) && /\{c\.image_url\n/.test(v2),
    '2.8 the picture is drawn only when the server sends one; it is decorative (alt "") and sends no referrer');

  sec('3  the words');
  const bV2 = blockOf(read(F.wordsV2), 'IG_CARDS'); const bC = blockOf(read(F.wordsC), 'IG_CARDS');
  const W = bV2 && loadTs(null, bV2.replace(' as const;', ';')).IG_CARDS;
  ok(bV2 && bV2 === bC && same(W, WORDS), '3.1 the labels and the failure line, the same bytes in both copy homes ("Package cards in Instagram", "Your package cards", "Add a package", "Try again", "Your change was not saved. Please try again.")', JSON.stringify(W));
  const strs = (s) => [...code(s).matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1]);
  const bad = [...strs(bV2 || ''), ...Object.values(W || {})].filter((x) => /\b(couples?|brides?|bridal|her|his|leads?)\b/i.test(x) || /[–—]/.test(x));
  ok(bad.length === 0, '3.2 no couple, bride, her, his or leads on her glass, and no dash', JSON.stringify(bad));
  const typed = Object.values(LINES).filter((l) => [v2, cl, read(F.wordsV2), read(F.wordsC), read(F.door)].some((s) => s.includes(l)));
  ok(typed.length === 0, '3.3 no state sentence is typed in the app: each is the server’s, shown word for word (R-47.1)', JSON.stringify(typed));
}

// ── the room on glass ────────────────────────────────────────────────────────
const PORT = 3993;
const TAPS = { turnOff: 'Turn off', turnOn: 'Turn on', retry: WORDS.retry };
function probe(layout, mode, sc) {
  const r = cp.spawnSync('node', [path.join(ROOT, 'scripts/lib/b289p_cards_probe.mjs'), String(PORT), layout, mode, sc],
    { encoding: 'utf8', timeout: 240000, env: { ...process.env, B289P_TAPS: JSON.stringify(TAPS), B289P_LINES: JSON.stringify(LINES) } });
  if (r.status === 3) return { noBrowser: true, text: r.stdout };
  try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 300)}` }; }
}
const THREE_TITLES = ['Wedding day film', 'Pre-wedding shoot', 'Album only'];
// Each scenario's verdict, used by its cell and by the glass mutations (so a mutation reddens exactly the cell it names).
const CHECK = {
  c404: (o) => o.screens[0].cards === null && o.screens[0].ig === true,
  cBad: (o) => o.screens[0].cards === null && o.screens[0].ig === true,
  cOn: (o) => {
    const [s, a] = o.screens;
    return s.state === 'on' && s.heading === WORDS.heading && s.line === LINES.on && s.rowLabel === WORDS.preview
      && same(s.cards.map((c) => c.title), THREE_TITLES) && same(s.cards.map((c) => c.sub), ['From Rs 1,25,000', null, 'From Rs 40,000'])
      && same(s.cards.map((c) => c.btn), ['See details', 'See details', null]) && s.cards[0].pic === 'https://pictures.tdw.test/cover-1.jpg' && s.cards[0].picLoaded
      && s.cards[1].pic === null && s.cards.every((c) => c.controls === 0) && same(s.buttons, ['Turn off']) && s.add === null && s.err === null
      && same(o.posts, [{ on: false }]) && !!a && a.state === 'off' && a.line === LINES.off && same(a.buttons, ['Turn on']) && a.cards.length === 3 && !s.pageWide;
  },
  cOff: (o) => { const [s, a] = o.screens; return s.state === 'off' && s.line === LINES.off && same(s.buttons, ['Turn on']) && same(o.posts, [{ on: true }]) && !!a && a.state === 'on' && same(a.buttons, ['Turn off']); },
  cNone: (o) => { const s = o.screens[0]; return s.state === 'no_packages' && s.line === LINES.no_packages && s.cards.length === 0 && s.rowLabel === null && same(s.buttons, ['Turn off']) && !!s.add && s.add.text === WORDS.addPackage && s.add.href === '/vendor/packages'; },
  cFull: (o) => { const s = o.screens[0]; return s.state === 'full' && s.line === LINES.full && same(s.buttons, ['Turn off']) && s.cards.length === 3; },
  cFailed: (o) => { const [s, a] = o.screens; return s.state === 'failed' && s.line === LINES.failed && same(s.buttons, [WORDS.retry, 'Turn off']) && o.posts.length === 0 && o.getsAfterTap >= 1 && !!a && a.state === 'on' && same(a.buttons, ['Turn off']); },
  cNotConn: (o) => { const s = o.screens[0]; return s.state === 'not_connected' && s.line === LINES.not_connected && s.buttons.length === 0 && s.add === null && s.cards.length === 0; },
  cPostFail: (o) => { const [s, a] = o.screens; return s.state === 'on' && same(o.posts, [{ on: false }]) && !!a && a.state === 'on' && a.err === WORDS.notSaved && same(a.buttons, ['Turn off']); },
  cTen: (o) => { const s = o.screens[0]; return s.cards.length === 10 && s.cards[9].title === 'Package 10' && s.rowScrolls && !s.pageWide; },
  cBadPic: (o) => { const s = o.screens[0]; return s.cards.length === 1 && s.cards[0].pic === null && s.cards[0].title === 'Wedding day film' && !o.outside.some((u) => u.includes('pictures.tdw.test')); },
};
const NAMES = {
  c404: 'the server answers 404: no section, the room as before', cBad: 'a malformed door (an unknown state): no section',
  cOn: 'on: the heading, the server’s line, three cards (name, price line, picture, "See details"), no control in a card, Turn off posts { on: false } and the room reads off',
  cOff: 'off: Turn on posts { on: true } and the room reads on', cNone: 'no packages: no cards, Add a package to /vendor/packages, Turn off',
  cFull: 'four starters of her own: the server’s line, Turn off', cFailed: 'Instagram refused: Try again asks again (no POST) and the room reads on',
  cNotConn: 'not connected: the line only, no control', cPostFail: 'a failed switch: the error line, the room unchanged',
  cTen: 'twelve sent, ten drawn; the row scrolls inside itself and the page never scrolls sideways', cBadPic: 'an http picture is not drawn and nothing is fetched from outside',
};

async function glass(restores) {
  sec('4  the room on glass (next dev; v2 in both themes, classic in dark)');
  const devServer = require('./lib/b126_dev_server');
  const server = await devServer.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  let browserOk = true;
  const run = (layout, mode, sc) => {
    const o = probe(layout, mode, sc);
    if (o.noBrowser) { browserOk = false; return { o, why: `no browser: ${o.text}` }; }
    if (o.error) return { o, why: `the probe ran: ${o.error}` };
    if (o.errors && o.errors.length) return { o, why: `the page raised: ${o.errors.join(' | ')}` };
    return { o, why: null };
  };
  try {
    if (!(await server.up())) throw new Error('next dev did not come up');
    // The first compile of the room is the slow one: warm it by condition (the probe answers) before any cell reads it.
    for (let i = 0; i < 3; i += 1) { const w = run('v2', 'dark', 'c404'); if (!w.why || !browserOk) break; }
    const plan = [];
    for (const sc of Object.keys(CHECK)) for (const m of ['dark', 'light']) plan.push(['v2', m, sc]);
    for (const sc of ['c404', 'cOn', 'cNone', 'cFailed']) plan.push(['classic', 'dark', sc]);
    for (const [layout, mode, sc] of plan) {
      const { o, why } = run(layout, mode, sc);
      if (!browserOk) { ok(false, `4.${sc} a browser is available to drive the room (C-43.18)`, why); break; }
      let good = false; try { good = !why && CHECK[sc](o); } catch (_e) { good = false; }
      ok(good, `4.${sc} ${layout} ${mode}: ${NAMES[sc]}`, why || JSON.stringify(o.screens).slice(0, 400));
    }
    if (browserOk) {
      sec('5b  mutations on glass (v2, dark; each reread up to 3 times while next dev recompiles, then restored by sha)');
      const GM = [
        [F.compV2, 'onClick={() => { void send(false); }}>{IG.turnOff}', 'onClick={() => { void send(true); }}>{IG.turnOff}', 'G1 Turn off that posts { on: true }', 'cOn'],
        [F.sectV2, '      <IgPackageCards />\n', '', 'G2 the section not mounted', 'cOn'],
      ];
      for (const [file, from, to, name, sc] of GM) {
        const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
        if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
        let live = null; let red = false; let back = false; let after = null;
        try {
          live = guard.apply(ROOT, file, from, to, 'b289p'); restores.push(live);
          for (let i = 0; i < 3 && !red; i += 1) { const { o, why } = run('v2', 'dark', sc); let g = false; try { g = !why && CHECK[sc](o); } catch (_e) { g = false; } red = !g; after = why || JSON.stringify(o.posts); }
        } finally { if (live) { back = live.restore(); restores.splice(restores.indexOf(live), 1); } }
        let green = false;
        for (let i = 0; i < 3 && !green; i += 1) { const { o, why } = run('v2', 'dark', sc); try { green = !why && CHECK[sc](o); } catch (_e) { green = false; } }
        ok(red && back && sha(p) === before && green, `${name}: reddens 4.${sc}, restored by sha, and 4.${sc} is green again`, after);
      }
    }
  } catch (e) {
    ok(false, `the room ran: ${e.message}`);
  } finally {
    const stop = await server.stop();
    ok(stop.portFree, `4.9 the dev server is stopped whole: port ${PORT} is free; log ${server.log}`);
  }
}

const MUTS = [
  [F.door, "if (u.protocol !== 'https:' || u.username || u.password) return null;", "if (u.username || u.password) return null;", 'M1 an http picture admitted', '1.3'],
  [F.door, '.filter((c): c is PackageCard => c !== null).slice(0, MAX_CARDS);', '.filter((c): c is PackageCard => c !== null);', 'M2 more than 10 cards', '1.2'],
  [F.door, "if (typeof body.state !== 'string' || !STATES.includes(body.state)) return null;", "if (typeof body.state !== 'string') return null;", 'M3 an unknown state read', '1.4'],
  [F.door, "if (state === 'not_connected') return null;", '', 'M4 a switch before Instagram is connected', '1.5'],
  [F.sectC, '      <IgPackageCards />\n', '', 'M5 classic without the section', '2.1'],
  [F.compC, '<div className="pc-btn" aria-hidden="true">{c.button}</div>', '<button type="button" className="pc-btn">{c.button}</button>', 'M6 a card with a control (classic)', '2.2'],
  [F.wordsV2, "  retry: 'Try again',", "  retry: 'Retry now',", 'M7 a label changed in one home only', '3.1'],
];
function leftovers() {   // e-277: no mutation already present before the first cell
  const bad = [];
  for (const [file, from, to, name] of MUTS) { const s = read(file); if (s.split(from).length !== 2 || (to && s.includes(to))) bad.push(`${file} (${name})`); }
  return bad;
}

(async () => {
  if (!CHILD) guard.recoverOrRefuse(ROOT, 'b289p');
  if (!CHILD) { const bad = leftovers(); if (bad.length) { console.log(`STOP: mutated file(s): ${bad.join('; ')}. Restore them, then run again.`); process.exit(2); } }
  try { cells(); } catch (e) { ok(false, `b289p crashed: ${e && e.stack}`); }
  if (CHILD) process.exit(fail ? 1 : 0);
  const restores = [];
  const putBack = () => { while (restores.length) { try { restores.pop().restore(); } catch (_e) { /* recover() at the next start */ } } };
  process.on('exit', putBack); for (const sg of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sg, () => process.exit(130));
  const free = freeBytes();
  if (!ok(free >= MIN_FREE, `5.0 free space before the mutations: ${Math.floor(free / 1048576)} MB (at least ${MIN_FREE / 1048576} MB)`)) {
    console.log(`\nb289p · ${pass} pass · ${fail} fail`); console.log('FAILED: ' + failed.join(' | ')); process.exit(1);
  }
  if (!NO_GLASS) await glass(restores);
  sec('5  mutations of production code (each must red its cell in a child run; restored by sha)');
  for (const [file, from, to, name, cell] of MUTS) {
    const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
    let live = null; let r = null; let back = false;
    try { live = guard.apply(ROOT, file, from, to, 'b289p'); restores.push(live); }
    catch (e) {
      let put = sha(p) === before; if (!put) { try { fs.writeFileSync(p, src); put = sha(p) === before; } catch (_e) { put = false; } }
      ok(false, `${name}: ${e.message}${put ? '' : ' · THE FILE IS NOT THE ORIGINAL: put it back from git'}`); continue;
    }
    try { r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B289P_CHILD: '1' }, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL' }); }
    finally { back = live.restore(); restores.splice(restores.indexOf(live), 1); }
    const red = r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '');
    ok(red && back && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  ok(!fs.existsSync(guard.pendingDir(ROOT)), '5.9 nothing pending after the mutations');
  console.log(`\nb289p · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})();
