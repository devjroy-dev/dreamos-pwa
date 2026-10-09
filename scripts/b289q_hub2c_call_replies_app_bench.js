'use strict';
// scripts/b289q_hub2c_call_replies_app_bench.js · CE-47 · HUB-2c APP · ON HER CALL'S REPLIES PAGE, THE PEOPLE FROM OUTSIDE TDW.
// The replies page (/vendor/collab/<call>/responses, both trees) draws the door's `outside` (HUB-2b) under her TDW
// replies. The chair's rulings (9 Oct 2026): Instagram and Threads rows carry no mark; a partner's row, its mark and its
// tap card are PTN's PartnerInterestRow.tsx (the slot, drawing nothing until it lands); app only. The founder's words.
//   §1 the door (lib/vendor/callOutside.ts), run for real: the two shapes, the dropped rows, no phone or email ever, the
//      note word for word, a server before HUB-2b
//   §2 the source, both trees: the page reads the door once and draws the section after her TDW replies; the two
//      components the same bytes; no text node typed; the slot draws nothing; no mark on Instagram or Threads rows
//   §3 the words: the founder's, in one home; the old words gone from the page
//   §4 the page on glass (`next dev`, a real headless Chromium; v2 in both themes, classic in dark)
//   §5 mutations: M1 to M6 of production code in child runs; G1 and G2 on glass. Every mutation goes through
//      scripts/lib/mutation_guard.js (F-44.419); free space checked first; nothing left pending (5.9).
// Run DETACHED with its own log. THE EXIT CODE IS THE VERDICT. B289Q_NO_GLASS=1 runs §1 to §3 and M1 to M6 only.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const CHILD = !!process.env.B289Q_CHILD;
const NO_GLASS = CHILD || !!process.env.B289Q_NO_GLASS;
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
  door: 'lib/vendor/callOutside.ts',
  compV2: 'v2/components/vendor/CallOutsideReplies.tsx', compC: 'components/vendor/CallOutsideReplies.tsx',
  pageV2: 'v2/app/vendor/(shell)/collab/[post_id]/responses/screen.tsx', pageC: 'app/vendor/(shell)/collab/[post_id]/responses/screen.tsx',
};
const WORDS = {
  heading: 'Interested', none: 'No one has answered this call yet.', outside: 'From outside TDW',
  replyThere: { instagram: 'They answered your call on Instagram. Reply to them there.', threads: 'They answered your call on Threads. Reply to them there.' },
  chip: { instagram: 'From Instagram', threads: 'From Threads' },
};
const NOTE = 'People who answered from outside TDW could not be shown just now. Try again in a minute.';
const MARKS = /\b(Verified|Unverified|Not yet checked by TDW|Checked by TDW)\b/;

function loadTs(rel, src) {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const out = ts.transpileModule(src === undefined ? read(rel) : src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => require(spec), mod, mod.exports);
  return mod.exports;
}

function cells() {
  sec('1  the door, run for real');
  const D = loadTs(F.door);
  const IG = { id: 'i1', source: 'instagram', name: 'Riya Kapoor', platform_word: 'Instagram', how: 'comment', when: '2026-10-08T12:30:00Z', body: 'secret', external_user_id: '17841400000' };
  const TH = { id: 't1', source: 'threads', name: 'Kabir Styles', platform_word: 'Threads', how: 'reply', when: '2026-10-07T09:00:00Z' };
  const PT = { id: 'p1', source: 'partner', name: 'Meera S', role: 'model', role_word: 'model', link: 'https://agency.example/meera',
    partner: { name: 'Star Faces Agency', kind_words: 'Talent agency', cities: ['Delhi'], instagram_url: 'https://www.instagram.com/starfaces/', website_url: 'http://agency.example/' },
    fee_line: 'x', check_words: 'Unverified' };
  const o = D.asOutside({ ok: true, responses: [], outside: [IG, TH, PT] });
  ok(o.rows.length === 3 && same(o.rows[0], { id: 'i1', source: 'instagram', name: 'Riya Kapoor', when: '2026-10-08T12:30:00Z' }) && o.rows[1].source === 'threads'
    && o.rows[2].source === 'partner' && o.rows[2].partner.name === 'Star Faces Agency' && o.rows[2].partner.website_url === null && o.rows[2].check_words === 'Unverified' && o.note === null,
    '1.1 the two shapes are read in the server’s order; an Instagram row keeps only its id, where, name and when (no body, no outside id); a partner link not on https is none', JSON.stringify(o.rows));
  const bad = D.asOutside({ ok: true, outside: [{ ...IG, name: 'call me 98765 43210' }, { ...IG, name: 'riya@example.com' }, { ...IG, source: 'whatsapp' }, { ...IG, name: '' }, { ...IG, id: '' }, 'junk', null, [], { ...TH, name: 'Kept Person' }, { ...PT, partner: null }, { ...PT, name: '+91 98765 43210' }] });
  ok(bad.rows.length === 1 && bad.rows[0].name === 'Kept Person', '1.2 a name holding a phone number or an email, an unknown source, a missing name or id, or a partner row without its partner: dropped, never drawn', JSON.stringify(bad.rows));
  ok(D.asOutside({ ok: true, responses: [], outside: [], outside_note: NOTE }).note === NOTE && D.asOutside({ ok: true, outside: [], outside_note: '  ' }).note === null,
    '1.3 the server’s note is kept word for word; a blank one is none');
  let threw = null; let leaked = [];
  for (const body of [undefined, null, 0, '', [], {}, { ok: false, outside: [IG] }, { ok: true }, { ok: true, outside: {} }, { ok: true, outside: 'x' }, { ok: true, responses: [] }]) {
    try { const r = D.asOutside(body); if (r.rows.length || r.note) leaked.push(JSON.stringify(body)); } catch (e) { threw = e.message; }
  }
  ok(threw === null && leaked.length === 0, '1.4 a server before HUB-2b, a failed answer or any malformed body is an empty list and no note, never a throw', threw || leaked.join(' | '));
  ok(D.shortDate('2026-10-08T20:30:00Z') === '9 Oct' && D.shortDate(null) === null && D.shortDate('nope') === null,
    '1.5 the day is India’s ("9 Oct" for 8 Oct 20:30 UTC), or none', D.shortDate('2026-10-08T20:30:00Z'));

  sec('2  the source, both trees');
  const v2 = read(F.compV2); const cl = read(F.compC);
  ok(v2 === cl && !/@\/v2\//.test(cl), '2.1 the two components are the same bytes, and they read only the one shared home (lib/vendor/callOutside.ts)');
  for (const [t, pg, pre] of [['v2', F.pageV2, '@/v2/components'], ['classic', F.pageC, '@/components']]) {
    const s = read(pg);
    ok(s.includes(`import { CallOutsideReplies, drawnRows } from '${pre}/vendor/CallOutsideReplies';`) && /setResponses\(data\.responses\); setOutside\(asOutside\(data\)\);/.test(s)
      && /\)\)\}\n\s*<CallOutsideReplies outside=\{outside\} \/>\n\s*<\/>\)\}/.test(s) && (s.match(/\/responses`/g) || []).length === 1,
      `2.2 ${t}: the page reads the door once, keeps its \`outside\`, and draws the section after her TDW replies, from its own tree`);
    ok(/responses\.length === 0 && drawnRows\(outside\)\.length === 0 && !outside\.note \?/.test(s),
      `2.3 ${t}: "No one has answered" only when there is no TDW reply, no row from outside and no note`);
  }
  ok(!/[^=]>\s*[A-Za-z][^<{]*</.test(code(v2).replace(/const CO_CSS = `[\s\S]*?`;/, '')), '2.4 no text node typed into the section: every word is the shared home’s or the server’s');
  ok(/function PartnerSlot\(\{ row \}: \{ row: PartnerRow \}\) \{ void row; return null; \}/.test(v2) && /export function drawnRows\(o: Outside\): SocialRow\[\] \{ return o\.rows\.filter\(isSocial\); \}/.test(v2),
    '2.5 THE SLOT: a partner’s row is kept and drawn by nothing until PTN’s PartnerInterestRow.tsx lands (the chair, 9 Oct 2026)');
  const rowBlock = (v2.match(/<div key=\{r\.id\} className="co-row"[\s\S]*?\n {10}<\/div>/) || [''])[0];
  ok(rowBlock && !/check_words|mark|<(a|button|Link)\b|onClick|href=/.test(rowBlock) && !MARKS.test(code(v2)),
    '2.6 an Instagram or Threads row carries no mark and no control (the chair, 9 Oct 2026: the chip says where they came from)');

  sec('3  the words');
  const W = loadTs(F.door).REPLIES_WORDS;
  ok(same(W, WORDS), '3.1 the founder’s words, word for word, in one home: "Interested", "No one has answered this call yet.", "From outside TDW", the two "Reply to them there." lines and the two chips', JSON.stringify(W));
  ok([F.pageV2, F.pageC].every((p) => !/Interested vendors|No responses yet\./.test(code(read(p)))), '3.2 the old words are gone from both pages ("Interested vendors", "No responses yet.")');
  const strs = Object.values(W).flatMap((v) => (typeof v === 'string' ? [v] : Object.values(v)));
  ok(strs.every((x) => !/[–—]/.test(x) && !/\b(couples?|brides?|her|his|leads?)\b/i.test(x)), '3.3 no dash, and no couple, bride, her, his or leads');
}

// ── the page on glass ─────────────────────────────────────────────────────────
const PORT = 3994;
function probe(layout, mode, sc) {
  const r = cp.spawnSync('node', [path.join(ROOT, 'scripts/lib/b289q_replies_probe.mjs'), String(PORT), layout, mode, sc], { encoding: 'utf8', timeout: 240000 });
  if (r.status === 3) return { noBrowser: true, text: r.stdout };
  try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 300)}` }; }
}
const CHECK = {
  r0: (o) => { const s = o.screen; return s.h1s.includes(WORDS.heading) && s.text.includes(WORDS.none) && !s.section && s.tdwCards === 0; },
  rOld: (o) => { const s = o.screen; return s.h1s.includes(WORDS.heading) && s.tdwCards === 1 && !s.section && !s.text.includes(WORDS.none); },
  rMix: (o) => {
    const s = o.screen;
    return s.tdwCards === 1 && s.section && s.label === WORDS.outside
      && same(s.rows.map((r) => [r.source, r.name, r.chip, r.line]), [['instagram', 'Riya Kapoor', WORDS.chip.instagram, WORDS.replyThere.instagram], ['threads', 'Kabir Styles', WORDS.chip.threads, WORDS.replyThere.threads]])
      && s.rows[0].day === '8 Oct' && s.rows.every((r) => r.controls === 0) && !s.text.includes('Star Faces Agency') && !s.text.includes('Meera S')
      && !MARKS.test(s.text) && !s.text.includes(WORDS.none) && s.note === null && !s.pageWide && s.text.indexOf('Aman Frames') < s.text.indexOf(WORDS.outside);
  },
  rOnly: (o) => { const s = o.screen; return s.tdwCards === 0 && !s.text.includes(WORDS.none) && s.rows.length === 1 && s.rows[0].line === WORDS.replyThere.instagram; },
  rNote: (o) => { const s = o.screen; return s.tdwCards === 1 && s.section && s.label === null && s.rows.length === 0 && s.note === NOTE; },
  rBad: (o) => { const s = o.screen; return s.rows.length === 1 && s.rows[0].name === 'Kept Person' && !/98765|example\.com/.test(s.text); },
};
const NAMES = {
  r0: 'nobody answered: "Interested" and "No one has answered this call yet.", no section',
  rOld: 'a server before HUB-2b: her TDW reply drawn as before, no section, no error',
  rMix: 'a TDW reply, then "From outside TDW" with the Instagram and Threads rows (chip, day, where to reply; no mark, no control); the partner row kept in the slot, not drawn',
  rOnly: 'only a row from outside: the section, and not "No one has answered"',
  rNote: 'the server’s note word for word under her TDW reply, no section label',
  rBad: 'rows holding a phone number or an email, or of an unknown source: not drawn',
};

async function glass(restores) {
  sec('4  the page on glass (next dev; v2 in both themes, classic in dark)');
  const devServer = require('./lib/b126_dev_server');
  const server = await devServer.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  let browserOk = true;
  const run = (layout, mode, sc) => {
    const o = probe(layout, mode, sc);
    if (o.noBrowser) { browserOk = false; return { o, why: `no browser: ${o.text}` }; }
    if (o.error) return { o, why: `the probe ran: ${o.error}` };
    if (o.errors && o.errors.length) return { o, why: `the page raised: ${o.errors.join(' | ')}` };
    if (!o.screen) return { o, why: 'no screen read' };
    return { o, why: null };
  };
  const verdict = (layout, mode, sc) => { const { o, why } = run(layout, mode, sc); let g = false; try { g = !why && CHECK[sc](o); } catch (_e) { g = false; } return { g, o, why }; };
  try {
    if (!(await server.up())) throw new Error('next dev did not come up');
    for (let i = 0; i < 3; i += 1) { const w = run('v2', 'dark', 'r0'); if (!w.why || !browserOk) break; }   // the first compile, by condition
    const plan = [];
    for (const sc of Object.keys(CHECK)) for (const m of ['dark', 'light']) plan.push(['v2', m, sc]);
    for (const sc of ['r0', 'rMix', 'rNote']) plan.push(['classic', 'dark', sc]);
    for (const [layout, mode, sc] of plan) {
      const { g, o, why } = verdict(layout, mode, sc);
      if (!browserOk) { ok(false, `4.${sc} a browser is available to drive the page (C-43.18)`, why); break; }
      ok(g, `4.${sc} ${layout} ${mode}: ${NAMES[sc]}`, why || JSON.stringify(o.screen && { ...o.screen, text: (o.screen.text || '').slice(0, 200) }));
    }
    if (browserOk) {
      sec('5b  mutations on glass (v2, dark; each reread up to 3 times while next dev recompiles, then restored by sha)');
      const GM = [
        [F.pageV2, '        <CallOutsideReplies outside={outside} />\n', '', 'G1 the section not drawn', 'rMix'],
        [F.pageV2, 'responses.length === 0 && drawnRows(outside).length === 0 && !outside.note ?', 'responses.length === 0 ?', 'G2 "No one has answered" over a row from outside', 'rOnly'],
      ];
      for (const [file, from, to, name, sc] of GM) {
        const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
        if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
        let live = null; let red = false; let back = false;
        try {
          live = guard.apply(ROOT, file, from, to, 'b289q'); restores.push(live);
          for (let i = 0; i < 3 && !red; i += 1) red = !verdict('v2', 'dark', sc).g;
        } finally { if (live) { back = live.restore(); restores.splice(restores.indexOf(live), 1); } }
        let green = false;
        for (let i = 0; i < 3 && !green; i += 1) green = verdict('v2', 'dark', sc).g;
        ok(red && back && sha(p) === before && green, `${name}: reddens 4.${sc}, restored by sha, and 4.${sc} is green again`);
      }
    }
  } catch (e) {
    ok(false, `the page ran: ${e.message}`);
  } finally {
    const stop = await server.stop();
    ok(stop.portFree, `4.9 the dev server is stopped whole: port ${PORT} is free; log ${server.log}`);
  }
}

const MUTS = [
  [F.door, "  if (/[^\\s@]+@[^\\s@]+\\.[^\\s@]+/.test(v)) return null;\n", '', 'M1 an email in a name drawn', '1.2'],
  [F.door, "const row = r.source === 'partner' ? asPartner(r) : asSocial(r);", "const row = r.source === 'partner' ? asPartner(r) : (r as unknown as OutsideRow);", 'M2 a row of any shape kept', '1.1'],
  [F.compC, 'function PartnerSlot({ row }: { row: PartnerRow }) { void row; return null; }', 'function PartnerSlot({ row }: { row: PartnerRow }) { return <p>{row.partner.name}</p>; }', 'M3 classic draws a partner before PTN’s row', '2.1'],
  [F.pageC, 'responses.length === 0 && drawnRows(outside).length === 0 && !outside.note ?', 'responses.length === 0 ?', 'M4 classic says "No one has answered" over rows from outside', '2.3'],
  [F.door, "  heading: 'Interested',", "  heading: 'Interested vendors',", 'M5 the old heading back', '3.1'],
  [F.compV2, '<span className="co-chip">{REPLIES_WORDS.chip[r.source]}</span>', '<span className="co-chip">{REPLIES_WORDS.chip[r.source]}</span><span>Unverified</span>', 'M6 a mark on an Instagram row', '2.1'],
];
function leftovers() {
  const bad = [];
  for (const [file, from, to, name] of MUTS) { const s = read(file); if (s.split(from).length !== 2 || (to && s.includes(to))) bad.push(`${file} (${name})`); }
  return bad;
}

(async () => {
  if (!CHILD) guard.recoverOrRefuse(ROOT, 'b289q');
  if (!CHILD) { const bad = leftovers(); if (bad.length) { console.log(`STOP: mutated file(s): ${bad.join('; ')}. Restore them, then run again.`); process.exit(2); } }
  try { cells(); } catch (e) { ok(false, `b289q crashed: ${e && e.stack}`); }
  if (CHILD) process.exit(fail ? 1 : 0);
  const restores = [];
  const putBack = () => { while (restores.length) { try { restores.pop().restore(); } catch (_e) { /* recover() at the next start */ } } };
  process.on('exit', putBack); for (const sg of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sg, () => process.exit(130));
  const free = freeBytes();
  if (!ok(free >= MIN_FREE, `5.0 free space before the mutations: ${Math.floor(free / 1048576)} MB (at least ${MIN_FREE / 1048576} MB)`)) {
    console.log(`\nb289q · ${pass} pass · ${fail} fail`); console.log('FAILED: ' + failed.join(' | ')); process.exit(1);
  }
  if (!NO_GLASS) await glass(restores);
  sec('5  mutations of production code (each must red its cell in a child run; restored by sha)');
  for (const [file, from, to, name, cell] of MUTS) {
    const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
    let live = null; let r = null; let back = false;
    try { live = guard.apply(ROOT, file, from, to, 'b289q'); restores.push(live); }
    catch (e) {
      let put = sha(p) === before; if (!put) { try { fs.writeFileSync(p, src); put = sha(p) === before; } catch (_e) { put = false; } }
      ok(false, `${name}: ${e.message}${put ? '' : ' · THE FILE IS NOT THE ORIGINAL: put it back from git'}`); continue;
    }
    try { r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B289Q_CHILD: '1' }, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL' }); }
    finally { back = live.restore(); restores.splice(restores.indexOf(live), 1); }
    const red = r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '');
    ok(red && back && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  ok(!fs.existsSync(guard.pendingDir(ROOT)), '5.9 nothing pending after the mutations');
  console.log(`\nb289q · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})();
