'use strict';
// scripts/b285_hub2_app_bench.js · CE-47 · HUB-2 APP · COLLAB HUB IN THE APP (rung b285). Source and pure-function cells;
// the room on glass is b190's (amended by label for HUB-2). No server, no browser, no network, no live model call.
//   §1 links: every link that leaves the app is https, a new tab, rel "noopener noreferrer" (linkProps run for real)
//   §2 no check label anywhere (CE-47, 7 Oct 2026)
//   §3 My people: "Add" drawn only when the server says can_add; a person or an organisation gets the line, never the button
//   §4 veto 54 and the quiet button: chosen chips filled with the primary (the Hub's and the call form's); actions are buttons
//   §5 the room: Work | People | Mine, opening on Work; Mine's count; the Roster tab and "+ Add someone" gone
//   §5b Rule 1: the Hub only on hub_open; closed or unreadable gets today's room (CollabRoomBefore)
//   §6 words: no bride, bridal, couple or haldi; "in any 30 days"; no link to /collab/join before HUB-3; the help card
//   §6b a door that leaves out its list draws an empty list, never a crashed room (FE-8 (E); found by b281)
//   §7 the public page: noindex, a neutral miss with no status code, links only through out(), no phone or email field
//   §8 mutations of production code (each must red its cell in a child run; restored by sha; e-277 pre-check first)
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const CHILD = !!process.env.B285_CHILD;
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; if (!CHILD) console.log(`  PASS  ${name}`); return true; } fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); return false; }
const sec = (t) => { if (!CHILD) console.log(`\n── ${t} ──`); };
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');   // comments out; strings kept

const F = {
  hub: 'v2/lib/vendor/hub.ts',
  people: 'v2/components/vendor/hub/HubPeople.tsx',
  work: 'v2/components/vendor/hub/HubWork.tsx',
  mine: 'v2/components/vendor/hub/HubMine.tsx',
  sheet: 'v2/components/vendor/hub/ShootTogetherSheet.tsx',
  pub: 'app/c/[handle]/page.tsx',
  screen: 'v2/app/vendor/(shell)/collab/screen.tsx',
  room: 'v2/lib/worklist/collabRoom.ts',
  form: 'v2/components/vendor/CollabPostForm.tsx',
  help: 'v2/lib/worklist/pageHelp.ts',
};
const APP_FILES = [F.hub, F.people, F.work, F.mine, F.sheet, F.pub, F.screen, F.room];   // CollabRoomBefore is today's code, held by b190 1b

/** linkProps, taken from hub.ts and run (TypeScript's own transpiler; the function has no imports). */
function loadLinkProps() {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const src = read(F.hub);
  const m = src.match(/export function linkProps[\s\S]*?\n}\n/);
  if (!m) return null;
  const js = ts.transpileModule(m[0].replace(/^export /, ''), { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
  return new Function(`${js}; return linkProps;`)();
}

function cells() {
  sec('1  links leave as https, in a new tab, with no opener and no referrer');
  const lp = loadLinkProps();
  const good = lp && lp('https://www.instagram.com/amanframes/');
  ok(good && good.href === 'https://www.instagram.com/amanframes/' && good.target === '_blank' && good.rel === 'noopener noreferrer', '1.1 linkProps gives href, _blank and "noopener noreferrer" for https', JSON.stringify(good));
  ok(lp && [lp('http://x.in'), lp('javascript:alert(1)'), lp(''), lp(null), lp('https://a b')].every((x) => x === null), '1.2 anything not https is not a link (http, javascript:, empty, spaces)');
  const raw = APP_FILES.filter((f) => /<a\s(?![^>]*\{\.\.\.)/.test(code(read(f))));
  ok(raw.length === 0, '1.3 every <a> in the Hub files is spread from linkProps or out(), never a raw href', raw.join(', '));
  const pub = read(F.pub);
  ok(/target: '_blank' as const, rel: 'noopener noreferrer'/.test(pub) && /\^https:\\\/\\\/\[\^\\s\]\+\$/.test(pub), '1.4 the public page’s out() is https only, new tab, noopener noreferrer');

  sec('2  no check label anywhere');
  // the words themselves, any read of a card's label or checked flag, and no such field on the card's type
  const lab = APP_FILES.filter((f) => /Checked by TDW|Not yet checked|\b(Verified|Unverified)\b|\b(p|c|w|n|card|page|a)\.(label|checked)\b/.test(code(read(f))));
  const cardType = (read(F.hub).match(/export interface HubCard \{[\s\S]*?\n\}/) || [''])[0];
  ok(lab.length === 0 && cardType && !/\b(label|checked)\??:/.test(cardType), '2.1 no check mark in the Hub (neither "Verified" nor "Unverified", the founder\u2019s words, nor the retired old words), no card label or checked flag read, none on the card\u2019s type', lab.join(', '));

  sec('3  My people');
  const people = code(read(F.people));
  ok(/\{p\.can_add && \(\s*<button[^>]*data-hub-add=""/.test(people), '3.1 "Add to my people" is drawn only under the server’s can_add');
  ok(/\{p\.kind !== 'vendor' && !p\.in_my_people && <p className="hub-small">\{HUB\.notAddable\}<\/p>\}/.test(people) && /notAddable: 'Joins your people only after a shoot you did together, and only when they say yes\.'/.test(read(F.hub)), '3.2 a person or an organisation gets the line that says how they join, never the button');
  ok(/\{mine && p\.can_take_off && \(\s*<button type="button" className="hub-btn q"/.test(people), '3.3 "Take off my people" only where the server allows it, as the quiet button');
  ok(/mine && waiting\.map/.test(people) && /HUB\.myPeopleChipCount\(people\.length\)/.test(people), '3.4 waiting requests are drawn apart; the chip counts the list only');

  sec('4  veto 54 and the quiet button');
  const css = read(F.people);
  ok(/\.hub-chip\.on\{background:var\(--role-primary\);border-color:var\(--role-primary\);color:var\(--role-on-primary\)\}/.test(css), '4.1 the Hub’s chosen chip is filled with the primary (.ob-chip.on)');
  ok(/\.cp-chip\.on\{background:var\(--role-primary\);border-color:var\(--role-primary\);color:var\(--role-on-primary\)\}/.test(read(F.form)), '4.2 the call form’s chosen chip is filled too (F-44.367)');
  ok(/\.hub-btn\.q\{border:1px solid var\(--atelier-ink-mute\);color:var\(--atelier-ink-mute\)\}/.test(css) && /className="hub-btn q" onClick=\{\(\) => setPicked\(\(xs\) => xs\.filter\(\(x\) => x\.id !== p\.id\)\)\}>\{HUB\.shoot\.remove\}/.test(read(F.sheet)), '4.3 "Remove" and "Take off" are the quiet button (actionButton mute), not underlined links');
  ok(!/text-decoration:underline/.test(css.match(/\.hub-btn[^{]*\{[^}]*\}/g).join('')), '4.4 no button rule underlines');

  sec('5  the room: Work | People | Mine');
  const scr = code(read(F.screen));
  const m = scr.match(/TAB_ORDER:\s*readonly Tab\[\]\s*=\s*\[([^\]]*)\]/);
  ok(m && (m[1].match(/'([a-z_]+)'/g) || []).join(',') === "'work','people','mine'" && /TAB_DEFAULT:\s*Tab\s*=\s*TAB_ORDER\[0\]/.test(scr) && /useState<Tab>\(TAB_DEFAULT\)/.test(scr), '5.1 Work | People | Mine, opening on Work (the chair’s ruling)');
  ok(/: COL\.mineWaiting\(waiting\)\);/.test(scr) && /mineWaiting: \(n: number\) => \(n > 0 \? `Mine (\u00b7|\\u00b7) \$\{n\}` : 'Mine'\)/.test(read(F.room)), '5.2 Mine carries the waiting count, and no count when nothing waits');
  const hubPart = scr.slice(scr.indexOf('function HubRoom'));
  ok(scr.includes('function HubRoom') && !/Roster|Add someone|fetchRoster|addRosterEntry|AddToRosterSheet|COL\.addSomeone|COL\.roster/.test(hubPart), '5.3 the Hub\u2019s room has no Roster tab and no "+ Add someone" (today\u2019s room keeps them for closed vendors)');
  ok(/<RoomHeadAdd addKey="collab" label=\{COL\.newPost\} onAdd=\{\(\) => setShowForm\(true\)\} \/>/.test(scr), '5.4 "+ New post" is the one pill, on every tab');

  sec('5b  RULE 1: the Hub only when the server says hub_open (the chair\u2019s ruling (a))');
  ok(/const open = !!d && d\.ok === true && d\.hub_open === true;/.test(scr) && /setGate\(open \? 'open' : 'closed'\);/.test(scr) && /\.catch\(\(\) => \{ if \(live\) setGate\('closed'\); \}\);/.test(scr),
    '5b.1 the Hub opens only on hub_open === true; anything else, and an unreadable answer, is closed');
  ok(/if \(gate === 'closed'\) return <div data-collab-gate="closed"[^>]*><CollabRoomBefore vendorId=\{props\.vendorId\} tier=\{props\.tier\} \/><\/div>;/.test(scr) && /import \{ CollabScreen as CollabRoomBefore \} from '@\/v2\/components\/vendor\/hub\/CollabRoomBefore';/.test(scr),
    '5b.2 a closed vendor gets today\u2019s room, CollabRoomBefore, with the route\u2019s own props');
  const before = read('v2/components/vendor/hub/CollabRoomBefore.tsx');
  const bo = (code(before).match(/TAB_ORDER:\s*readonly Tab\[\]\s*=\s*\[([^\]]*)\]/) || [])[1] || '';
  ok(/^export function CollabScreen\(\{ vendorId, tier \}/m.test(before) && (bo.match(/'([a-z_]+)'/g) || []).join(',') === "'my_posts','opportunities','roster'", '5b.3 today\u2019s room keeps its own order and its own export (the byte-for-byte proof is block 1\u2019s cmp against the base)');

  sec('6  words');
  const words = APP_FILES.map((f) => [f, code(read(f))]).filter(([, s]) => /\b(bride|bridal|couple|haldi)\b/i.test(s)).map(([f]) => f);
  ok(words.length === 0, '6.1 no bride, bridal, couple or haldi in any Hub file (samples included)', words.join(', '));
  ok(/in any 30 days\. \$\{n\} left now\./.test(read(F.hub)) && !/left in \$\{month\}/.test(read(F.hub)), '6.2 the limit is said as it is counted: "in any 30 days", never a calendar month');
  ok(!APP_FILES.some((f) => /collab\/join/.test(code(read(f)))), '6.3 no link to /collab/join before HUB-3');
  // RULE 1: two rooms share one address and one "?" card, and most vendors see today's room, so the card stays today's
  // (pageHelp.ts is not in this package); it still names New post, which both rooms draw.
  const help = read(F.help);
  ok(/To ask for crew, models or partners: tap New post\./.test(help) && /open Roster, tap Add someone/.test(help), '6.4 the "?" card is today\u2019s, unchanged, and names New post (drawn in both rooms)');

  sec('6b  a door that leaves out its list (FE-8 (E))');
  const guarded = [[F.work, /setItems\(arr\(d\.items\)\); setRoles\(arr\(d\.roles\)\);[^\n]*setNotYet\(arr\(d\.not_yet\)\)/],
    [F.people, /setPeople\(arr\(d\.people\)\); setWaiting\(arr\(d\.waiting\)\)/],
    [F.mine, /my_calls: arr\(r\.my_calls\), applied: arr\(r\.applied\), waiting_for_your_yes: arr\(r\.waiting_for_your_yes\), worked_with: arr\(r\.worked_with\)/],
    [F.sheet, /setEveryone\(arr\(d\.people\)\)/]].filter(([f, re]) => !re.test(read(f))).map(([f]) => f);
  ok(guarded.length === 0 && /export const arr = <T,>\(x: T\[\] \| undefined \| null\): T\[\] => \(Array\.isArray\(x\) \? x : \[\]\);/.test(read(F.hub)),
    '6b.1 every list a Hub door sends is read through arr(): a missing list is an empty one, never a crashed room', guarded.join(', '));

  sec('7  the public page');
  const pub2 = code(read(F.pub));
  ok(/robots: \{ index: false, follow: false \}/.test(pub2), '7.1 noindex, for every kind of owner (until HUB-3)');
  ok(/There is no Collab Hub page at this address\./.test(pub2) && !/notFound\(|404/.test(pub2), '7.2 a miss is one neutral sentence; no framework 404, no status code shown');
  ok(!/\bphone\b|\bemail\b/i.test(pub2), '7.3 the page names no phone or email field');
  ok(/\/api\/v2\/public\/hub\/\$\{encodeURIComponent\(h\)\}/.test(pub2) && /\^\[a-z0-9\._\]\{1,30\}\$/.test(pub2), '7.4 it reads the public door with a checked handle only');
}

const MUTS = [
  ['v2/lib/vendor/hub.ts', "  if (!/^https:\\/\\/[^\\s]+$/i.test(u)) return null;", "  if (!/^https?:\\/\\/[^\\s]+$/i.test(u)) return null;", 'M1 http links let through', '1.2'],
  ['v2/components/vendor/hub/HubPeople.tsx', "              {p.can_add && (", "              {(p.can_add || p.kind !== 'vendor') && (", 'M2 "Add" on a person', '3.1'],
  ['v2/components/vendor/hub/HubPeople.tsx', ".hub-chip.on{background:var(--role-primary);", ".hub-chip.on{background:transparent;", 'M3 the chosen chip outlined only', '4.1'],
  ['v2/app/vendor/(shell)/collab/screen.tsx', "const TAB_ORDER: readonly Tab[] = ['work', 'people', 'mine'] as const;", "const TAB_ORDER: readonly Tab[] = ['mine', 'work', 'people'] as const;", 'M4 the room opens on Mine', '5.1'],
  ['app/c/[handle]/page.tsx', "    robots: { index: false, follow: false },", "    robots: { index: true, follow: true },", 'M5 the public page indexed', '7.1'],
  ['v2/app/vendor/(shell)/collab/screen.tsx', "const open = !!d && d.ok === true && d.hub_open === true;", "const open = !!d && d.ok === true;", 'M8 the Hub without hub_open', '5b.1'],
  ['v2/app/vendor/(shell)/collab/screen.tsx', "<CollabRoomBefore vendorId={props.vendorId} tier={props.tier} />", "<HubRoom myCity={null} />", 'M9 a closed vendor shown the Hub', '5b.2'],
  ['v2/components/vendor/hub/HubWork.tsx', "      setItems(arr(d.items));", "      setItems(d.items);", 'M7 Work trusts the door to send its list', '6b.1'],
  ['v2/components/vendor/hub/HubWork.tsx', "                  {page && <a {...page}>{c.from}</a>}", "                  {page && <a href={c.page_url || ''}>{c.from}</a>}", 'M6 a raw href', '1.3'],
];
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function leftovers() {   // e-277: no mutation already present before the first cell
  const bad = [];
  for (const [file, from, to, name] of MUTS) { const s = read(file); if (s.split(from).length !== 2 || (to && s.includes(to))) bad.push(`${file} (${name})`); }
  return bad;
}
(async () => {
  if (!CHILD) { const bad = leftovers(); if (bad.length) { console.log(`STOP — mutated file(s): ${bad.join('; ')}. Restore them, then run again.`); process.exit(2); } }
  try { cells(); } catch (e) { ok(false, `b285 crashed: ${e && e.stack}`); }
  if (CHILD) process.exit(fail ? 1 : 0);
  sec('8  mutations of production code (each must red its cell in a child run; restored by sha)');
  const saved = new Map(); const restore = () => { for (const [p, b] of saved) fs.writeFileSync(p, b); };
  process.on('exit', restore); for (const sg of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sg, () => process.exit(130));
  for (const [file, from, to, name, cell] of MUTS) {
    const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
    saved.set(p, src); fs.writeFileSync(p, src.replace(from, to));
    const r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B285_CHILD: '1' }, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL' });
    fs.writeFileSync(p, src); saved.delete(p);
    const red = r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '');
    ok(red && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  console.log(`\nb285 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})();
