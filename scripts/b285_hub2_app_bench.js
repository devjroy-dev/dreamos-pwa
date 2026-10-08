'use strict';
// scripts/b285_hub2_app_bench.js · CE-47 · HUB-2 APP · COLLAB HUB IN THE APP (rung b285). Source and pure-function cells;
// the room on glass is b190's (amended by label for HUB-2). No server, no browser, no network, no live model call.
//   §1 links: every link that leaves the app is https, a new tab, rel "noopener noreferrer" (linkProps run for real)
//   §2 no check label anywhere (CE-47, 7 Oct 2026)
//   §3 My people: "Add" drawn only when the server says can_add; a person or an organisation gets the line, never the button
//   §4 veto 54 and the quiet button: chosen chips filled with the primary (the Hub's and the call form's); actions are buttons
//   §5 the room: Work | People | Mine, opening on Work; Mine's count; the Roster tab and "+ Add someone" gone
//   §5b Rule 1: the Hub only on hub_open; closed or unreadable gets today's room (CollabRoomBefore)
//   §6 words: no bride, bridal, couple or haldi; "in any 30 days"; no link to /collab/join before HUB-3; the Hub's help card (HUB-2d)
//   §6b a door that leaves out its list draws an empty list, never a crashed room (FE-8 (E); found by b281)
//   §7 the public page: noindex, a neutral miss with no status code, links only through out(), no phone or email field
//   §9 HUB-2d (the founder's walk, 8 Oct 2026): Mine titles a call by the server's title; the chosen tab is filled; the
//      chair's People line word for word; "a, b and c" for what is not in yet; the old words gone; the plain words held
//   §8 mutations of production code (each must red its cell in a child run; restored by sha; e-277 pre-check first)
//      F-44.419 (CE-47 lesson 5, 8 Oct 2026): every mutation goes through scripts/lib/mutation_guard.js (kept copy and
//      marker written and synced BEFORE the change, so a SIGKILL or a full disk leaves the tree recoverable), a killed
//      run's leftovers are restored by sha at the next start, free space is checked before the series, and each
//      restore runs in a finally. Nothing is left pending after the series (8.9).
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const CHILD = !!process.env.B285_CHILD;
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
const MIN_FREE = 512 * 1024 * 1024;   // F-44.419: the series refuses to start below 512 MB free on the tree's disk
const freeBytes = () => { const st = fs.statfsSync(ROOT); return st.bavail * st.bsize; };
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
  ok(/\{p\.kind !== 'vendor' && !p\.in_my_people && <p className="hub-small">\{HUB\.notAddable\}<\/p>\}/.test(people) && /notAddable: 'You cannot add them yourself\. They join your people when they confirm a shoot you did together\.'/.test(read(F.hub)), '3.2 a person or an organisation gets the line that says how they join, never the button (HUB-2d: words amended by label, R-47.1)');
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
  ok(/in any 30 days\. You have \$\{n\} left\./.test(read(F.hub)) && !/left in \$\{month\}/.test(read(F.hub)), '6.2 the limit is said as it is counted: "in any 30 days", never a calendar month (HUB-2d: words amended by label)');
  ok(!APP_FILES.some((f) => /collab\/join/.test(code(read(f)))), '6.3 no link to /collab/join before HUB-3');
  // RULE 1 kept two rooms at one address. With clb.hub on for every vendor (8 Oct), the "?" card is the Hub's (HUB-2d).
  const help = read(F.help);
  // HUB-2d (the chair, 8 Oct): the Hub is on for every vendor, so the "?" card is the Hub's. Only the /vendor/collab entry changed.
  const card = (code(help).match(/\[roomHref\('collab'\)\]: entry\(ROW_DESC\.collabs, \{[\s\S]*?\}\),\n/) || [''])[0];
  ok(/To ask for crew, models or partners, tap New post\./.test(card) && /Work shows calls from other vendors who need your craft\./.test(card) && /People lists everyone on Collab Hub\./.test(card)
    && /Mine shows your calls, the calls you applied to and the requests that wait for your answer\./.test(card) && /To see who replied to one of your calls, tap the call in Mine\./.test(card)
    && !/Roster|Add someone|Opportunities|My posts/.test(card),
    '6.4 the "?" card is the Hub\u2019s: Work, People and Mine in sentences, New post named; Roster, Opportunities and My posts gone (HUB-2d: amended by label)', card.slice(0, 200));

  sec('6b  a door that leaves out its list (FE-8 (E))');
  const guarded = [[F.work, /setItems\(arr\(d\.items\)\); setRoles\(arr\(d\.roles\)\);[^\n]*setNotYet\(arr\(d\.not_yet\)\)/],
    [F.people, /setPeople\(arr\(d\.people\)\); setWaiting\(arr\(d\.waiting\)\)/],
    [F.mine, /my_calls: arr\(r\.my_calls\), applied: arr\(r\.applied\), waiting_for_your_yes: arr\(r\.waiting_for_your_yes\), worked_with: arr\(r\.worked_with\)/],
    [F.sheet, /setEveryone\(arr\(d\.people\)\)/]].filter(([f, re]) => !re.test(read(f))).map(([f]) => f);
  ok(guarded.length === 0 && /export const arr = <T,>\(x: T\[\] \| undefined \| null\): T\[\] => \(Array\.isArray\(x\) \? x : \[\]\);/.test(read(F.hub)),
    '6b.1 every list a Hub door sends is read through arr(): a missing list is an empty one, never a crashed room', guarded.join(', '));

  sec('9  HUB-2d: the founder\u2019s walk and plain words');
  const hubSrc = read(F.hub); const mineSrc = code(read(F.mine)); const scr9 = code(read(F.screen));
  ok(/<span className="hub-name">\{c\.title \|\| c\.details \|\| HUB\.mine\.untitled\}<\/span>/.test(mineSrc) && /\[c\.title \? c\.details : null, c\.line,/.test(mineSrc) && !/'A call'/.test(mineSrc),
    '9.1 Mine titles each call with the server\u2019s title ("Decor needed"), her details beside it; "A call" is gone');
  const on = (scr9.match(/\.col-seg button\.on\{([^}]*)\}/) || [])[1] || '';
  ok(/background:var\(--role-primary\)/.test(on) && /color:var\(--role-on-primary\)/.test(on) && !/box-shadow|atelier-card-bg/.test(on), '9.2 the chosen tab is filled with the primary (F-44.367, veto 54)', on);
  ok(hubSrc.includes("peopleNote: 'Everyone on Collab Hub is listed here. \u201cWorked with\u201d appears only after the other person confirms a shoot you did together.'"),
    '9.3 People: the founder\u2019s words, approved 8 October, word for word');
  ok(/This list does not yet include \$\{xs\.length > 1 \? `\$\{xs\.slice\(0, -1\)\.join\(', '\)\} or \$\{xs\[xs\.length - 1\]\}` : xs\.join\(''\)\}\./.test(hubSrc), '9.4 what the list does not yet include is one sentence, "a, b or c" (R-47.1)');
  const gone = ['Not here yet', 'Not in this list yet', 'Newest first', 'shows nowhere', 'joined as a person', 'Nobody matches these choices', 'Only shoots the other person said yes to', 'left now', 'you both get each other', 'Nothing here yet', 'No shoots here yet'].filter((w) => hubSrc.includes(w));
  const fails = ['v2/components/vendor/hub/HubWork.tsx', 'v2/components/vendor/hub/HubPeople.tsx', 'v2/components/vendor/hub/HubMine.tsx', 'v2/components/vendor/hub/ShootTogetherSheet.tsx'].filter((f) => /Could not [a-z ]+\. Try again\./.test(read(f)));
  ok(fails.length === 0 && /send: 'Your request did not go through\. Please try again\.'/.test(hubSrc), '9.7 a failed request says, in sentences, what did not happen and what to do (R-47.1)', fails.join(', '));
  ok(gone.length === 0, '9.5 the old words are gone from the Hub', gone.join(' | '));
  const sentences = (code(hubSrc).match(/'[^'\n]{12,}'|`[^`\n]{12,}`/g) || []);
  ok(!sentences.some((x) => /\u2014/.test(x)), '9.6 no em dash in any Hub sentence', sentences.filter((x) => /\u2014/.test(x)).join(' | '));

  sec('7  the public page');
  const pub2 = code(read(F.pub));
  ok(/robots: \{ index: false, follow: false \}/.test(pub2), '7.1 noindex, for every kind of owner (until HUB-3)');
  ok(/There is no Collab Hub page at this address\./.test(pub2) && !/notFound\(|404/.test(pub2), '7.2 a miss is one neutral sentence; no framework 404, no status code shown');
  ok(!/\bphone\b|\bemail\b/i.test(pub2), '7.3 the page names no phone or email field');
  ok(/\/api\/v2\/public\/hub\/\$\{encodeURIComponent\(h\)\}/.test(pub2) && /\^\[a-z0-9\._\]\{1,30\}\$/.test(pub2), '7.4 it reads the public door with a checked handle only');
}

const MUTS = [
  ['v2/lib/worklist/pageHelp.ts', "['list', 'Work shows calls from other vendors who need your craft.'],", "['list', 'Opportunities are posts from others. My posts are yours.'],", 'M12 the card back to the old room', '6.4'],
  ['v2/components/vendor/hub/HubMine.tsx', "{c.title || c.details || HUB.mine.untitled}", "{c.details || 'A call'}", 'M10 Mine titles a call by its details again', '9.1'],
  ['v2/app/vendor/(shell)/collab/screen.tsx', ".col-seg button.on{background:var(--role-primary);color:var(--role-on-primary)}", ".col-seg button.on{background:var(--atelier-card-bg);color:var(--atelier-ink);box-shadow:inset 0 -2px 0 var(--atelier-accent-text)}", 'M11 the chosen tab back to a thin underline', '9.2'],
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
  if (!CHILD) guard.recoverOrRefuse(ROOT, 'b285');   // a killed run's mutation is put back by sha before anything is read
  if (!CHILD) { const bad = leftovers(); if (bad.length) { console.log(`STOP — mutated file(s): ${bad.join('; ')}. Restore them, then run again.`); process.exit(2); } }
  try { cells(); } catch (e) { ok(false, `b285 crashed: ${e && e.stack}`); }
  if (CHILD) process.exit(fail ? 1 : 0);
  sec('8  mutations of production code (each must red its cell in a child run; restored by sha)');
  const free = freeBytes();
  if (!ok(free >= MIN_FREE, `8.0 free space before the series: ${Math.floor(free / 1048576)} MB (at least ${MIN_FREE / 1048576} MB)`)) {
    console.log(`\nb285 · ${pass} pass · ${fail} fail`); console.log('FAILED: ' + failed.join(' | ')); process.exit(1);
  }
  let live = null; const putBack = () => { if (live) { live.restore(); live = null; } };
  process.on('exit', putBack); for (const sg of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sg, () => process.exit(130));
  for (const [file, from, to, name, cell] of MUTS) {
    const p = path.join(ROOT, file); const before = sha(p); const src = fs.readFileSync(p, 'utf8');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
    let r = null; let back = false;
    try { live = guard.apply(ROOT, file, from, to, 'b285'); }
    catch (e) {   // F-44.419: a write that failed part way (a full disk) may have emptied the file: put the original back, by sha
      let put = sha(p) === before; if (!put) { try { fs.writeFileSync(p, src); put = sha(p) === before; } catch (_e) { put = false; } }
      ok(false, `${name}: ${e.message}${put ? '' : ' · THE FILE IS NOT THE ORIGINAL: put it back from git'}`); continue;
    }
    try { r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B285_CHILD: '1' }, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL' }); }
    finally { back = live.restore(); live = null; }
    const red = r.status === 1 && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(r.stdout || '');
    ok(red && back && sha(p) === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  ok(!fs.existsSync(guard.pendingDir(ROOT)), '8.9 nothing pending after the mutations');
  console.log(`\nb285 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})();
