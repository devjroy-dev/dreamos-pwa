#!/usr/bin/env node
// ADM-1 · THE ADMIN REDESIGN BENCH (CE-47, 1 Oct 2026).
// What it proves, against the tree it runs on:
//   §1 the structure: five places, plain names, every LIVE route reachable, nothing lost;
//   §2 one look: the new vendor app's scope, type rungs and faces;
//   §3 Home: six requests, all fired together, plus the shell's one help count it shares;
//   §4 CE-47 change 1: no destructive action on a list row; on a card it is the last item and asks;
//   §5 the delete words come from the schema cascade, and a paid plan is not deletable here;
//   §6 the "also a Dreamer / also a vendor" line, both paths EXECUTED (cells 1 to 3);
//   §7 CE-47 change 2, THE WORDS GATE: no "couple" or "bride" in any word the founder reads;
//   §8 ruling 7: full months, "7:00 pm", taps at least 44, WhatsApp through the estate's dial rule.
// Run: node scripts/adm1_admin.proof.mjs   (exit 0 = all green)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import stripComments from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = (p) => path.join(ROOT, p);
const R = (p) => fs.readFileSync(P(p), 'utf8');
const S = (p) => stripComments(R(p));
let pass = 0, fail = 0; const fails = [];
const ok = (id, cond, why = '') => {
  if (cond === true) { pass++; console.log(`  ok   ${id}`); }
  else { fail++; fails.push(id); console.log(`  FAIL ${id}${why ? ` — ${why}` : ''}`); }
};
const H = (t) => console.log(`\n── ${t} ──`);
const walk = (dir) => fs.readdirSync(P(dir), { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);

const NAV = S('app/admin/_components/adminNav.ts');
const LAYOUT = S('app/admin/layout.tsx');
const KIT = S('app/admin/_components/Kit.tsx');
const HOME = S('app/admin/page.tsx');
const MAKERS = S('app/admin/makers/page.tsx');
const DREAMERS = S('app/admin/dreamers/page.tsx');
const PROS = S('app/admin/prospects/page.tsx');
const DEMO = S('app/admin/demo/page.tsx');
const WORDS = S('app/admin/_components/peopleWords.ts');

// TDW_STRIPPER_CANARY: §0.1 proves the imported stripper is called on a file this bench reads.
H('§0 · the instrument');
ok('0.1 the estate stripper runs (a comment in adminNav is gone after the strip)',
  R('app/admin/_components/adminNav.ts').includes('ADM-1 · THE NEW STRUCTURE') && !NAV.includes('ADM-1 · THE NEW STRUCTURE'));

H('§1 · the structure');
const places = [...NAV.matchAll(/\{ key: '(\w+)',\s+label: '([^']+)',\s+short: '([^']+)',\s+path: '([^']+)'/g)].map(m => ({ key: m[1], label: m[2], path: m[4] }));
ok('1.1 five places, in order, plain names', JSON.stringify(places.map(p => p.label)) === JSON.stringify(['Home', 'Demo profiles', 'Vendors', 'Dreamers', 'More']), JSON.stringify(places));
ok('1.2 Vendors owns Joined (/admin/makers) and Being reached (/admin/prospects)', /key: 'vendors'[^\n]*owns: \['\/admin\/makers', '\/admin\/prospects'\]/.test(NAV));
ok('1.3 Dreamers owns All (/admin/dreamers) and Asked for help (/admin/assistance)', /key: 'dreamers'[^\n]*owns: \['\/admin\/dreamers', '\/admin\/assistance'\]/.test(NAV));
const live = [...NAV.matchAll(/\{ path: '([^']+)',\s+domain: '\w+',\s+disposition: '(LIVE|RETIRES)'/g)].map(m => m[1]);
const reachable = new Set([...NAV.matchAll(/path: '(\/admin[^']*)'/g)].filter(m => !/disposition/.test(NAV.slice(m.index, m.index + 120))).map(m => m[1]));
const lost = live.filter(p => !reachable.has(p));
ok('1.4 every LIVE route is one tap away (a place, a daily section or a More group): nothing lost', live.length >= 20 && lost.length === 0, `not reachable: ${lost.join(', ')}`);
ok('1.5 every route a place or section names has a page file', [...reachable].every(p => fs.existsSync(P('app' + p + '/page.tsx'))), [...reachable].filter(p => !fs.existsSync(P('app' + p + '/page.tsx'))).join(', '));
ok('1.6 the shell draws PLACES twice (bottom bar on phone, left rail from 768px)', (LAYOUT.match(/PLACES\.map\(/g) || []).length === 2 && /id="adm-bar"/.test(LAYOUT) && /id="adm-rail"/.test(LAYOUT) && /@media \(min-width: 768px\)/.test(LAYOUT));
ok('1.7 a Search button in the top bar opens the palette; Ctrl-K stays', /aria-label="Search"[^>]*>/.test(LAYOUT) && /onClick=\{\(\) => setPaletteOpen\(true\)\}/.test(LAYOUT) && /e\.metaKey \|\| e\.ctrlKey/.test(LAYOUT));
ok('1.8 All numbers (/admin/numbers) renders the old Bridge unchanged', /import Bridge from '\.\.\/_components\/Bridge'/.test(S('app/admin/numbers/page.tsx')) && /<Bridge \/>/.test(S('app/admin/numbers/page.tsx')));
ok('1.9 More renders every MORE_GROUPS section, plus Look and Sign out', /MORE_GROUPS\.map/.test(S('app/admin/more/page.tsx')) && /Sign out/.test(S('app/admin/more/page.tsx')) && /setMode\(m\)/.test(S('app/admin/more/page.tsx')));
ok('1.10 the session check and login bypass are kept', /hasAdminSession\(\)/.test(LAYOUT) && /router\.replace\('\/admin\/login'\)/.test(LAYOUT));
ok('1.11 Vendors and Dreamers pages show their two tabs as one page', /RouteTabs active="\/admin\/makers"/.test(MAKERS) && /RouteTabs active="\/admin\/prospects"/.test(PROS) && /RouteTabs active="\/admin\/dreamers"/.test(DREAMERS) && /RouteTabs active="\/admin\/assistance"/.test(S('app/admin/assistance/page.tsx')));

H('§2 · one look');
ok('2.1 the shell mounts the NEW vendor app\'s scope and type rungs', /import \{ scopeCss, typeCss, GRAPHITE \} from '@\/v2\/lib\/worklist\/theme'/.test(LAYOUT) && /scopeCss\('html\.adm'\) \+ typeCss\('html\.adm'\)/.test(LAYOUT));
ok('2.2 its faces: Inter for words, the brand serif for the TDW name', /Inter\(\{/.test(LAYOUT) && /--font-inter: \$\{inter\.style\.fontFamily\}/.test(LAYOUT) && /--font-brand/.test(LAYOUT));
ok('2.3 Graphite dark by default; light from More > Look', /ModeProvider initial="dark" lane="admin"/.test(LAYOUT));
ok('2.4 no Google Fonts @import left in the shell', !/fonts\.googleapis\.com/.test(LAYOUT));

H('§3 · Home');
const settled = (HOME.match(/Promise\.allSettled\(\[([\s\S]*?)\n    \]\);/) || ['', ''])[1];
const calls = (settled.match(/^\s+(getBridge|getVendors|getCouples|adminGet|listAssistance|getPhotoQueue)\b/gm) || []).length;
ok('3.1 six requests, all in one allSettled', calls === 6, `found ${calls}`);
ok('3.2 no other server call on Home; the help count is the shell\'s, shared', (HOME.match(/\b(getBridge|getVendors|getCouples|adminGet|listAssistance|getPhotoQueue)(<[^>]*>)?\(/g) || []).length === 6
  && /const help = useContext\(OpenHelpContext\);/.test(HOME) && /<OpenHelpContext\.Provider value=\{openAssist\}>/.test(LAYOUT));
ok('3.3 Call or message now: why and when on each row, newest first', /Claimed their demo \$\{when\(/.test(HOME) && /Replied to the opener \$\{when\(/.test(HOME) && /\.sort\(\(a, z\) => z\.at\.localeCompare\(a\.at\)\)/.test(HOME));
ok('3.4 every number names what it counts', ['Vendors on TDW', 'on a paid plan', 'Demo profiles made', 'Openers sent, all time', 'Dreamers on TDW', 'enquiries to vendors today', 'received since launch'].every(w => HOME.includes(w)));

H('§4 · CE-47 change 1: nothing destructive on a row');
const strips = [MAKERS, DREAMERS, PROS, DEMO].flatMap(s => [...s.matchAll(/<ActionStrip items=\{\[([\s\S]*?)\]\} \/>/g)].map(m => m[1]));
ok('4.1 no row strip carries Delete, Remove, Deactivate or Switch off', strips.length >= 3 && strips.every(t => !/label: '(Delete|Remove|Deactivate|Switch off)/.test(t) && !/EXIT_LABEL/.test(t)));
const sheets = [MAKERS, DREAMERS, PROS, DEMO, S('app/admin/hot-dates/page.tsx'), S('app/admin/_components/AdminUI.tsx')].flatMap(s => [...s.matchAll(/<Sheet [\s\S]*?<\/Sheet>/g)].map(m => m[0])).filter(b => b.includes('<DangerLast'));
ok('4.2 on every card the destructive item is last (no row after it)', sheets.length >= 6 && sheets.every(b => !/<SheetRow/.test(b.slice(b.lastIndexOf('<DangerLast')))), `${sheets.length} cards`);
ok('4.3 DangerLast asks again before it acts', /setAsking\(true\)/.test(KIT) && /Are you sure\?/.test(KIT) && /onClick=\{async \(\) => \{ setBusy\(true\)[\s\S]*?await onConfirm\(\)/.test(KIT));
ok('4.4 the picture tile carries Hide/Show and More, not Delete', /\{item\.active \? 'Hide' : 'Show'\}/.test(S('app/admin/_components/AdminUI.tsx')) && !/>\s*Delete\s*</.test(S('app/admin/_components/AdminUI.tsx')));
ok('4.5 hot dates: the row opens the card; no Del/Confirm? on the row', !/'Del'/.test(S('app/admin/hot-dates/page.tsx')) && /Delete this date/.test(S('app/admin/hot-dates/page.tsx')));

H('§5 · what is lost, and the paid-plan block');
// The LIVE cascade (Block C diff, 3 Oct 2026) adds contracts, payment schedules, TDS ledger and
// the four team tables to what the migrations show; the card must name them.
ok('5.1 the vendor words name the cascade, as the LIVE database runs it', ['leads', 'clients', 'invoices', 'payment schedules', 'TDS records', 'contracts sent and signed', 'team members with their tasks, messages and payments', 'portfolio', 'website', 'chats with the assistant', 'Payments TDW received stay'].every(w => WORDS.includes(w)));
ok('5.2 the Dreamer words name the cascade', ['saves and mood board', 'circle', 'budget and receipts', 'enquiries to vendors', 'Help requests they made stay'].every(w => WORDS.includes(w)));
ok('5.3 a paid plan shows "Has a paid plan" in place of Delete, on both cards', /PAID_BLOCK = 'Has a paid plan · cannot be deleted from here'/.test(WORDS) && /blockedBy=\{open\.tier !== 'basic' \? PAID_BLOCK : null\}/.test(MAKERS) && /blockedBy=\{isPaidDreamer\(open\) \? PAID_BLOCK : null\}/.test(DREAMERS));

H('§6 · the also line, EXECUTED');
const ALSO_RAW = R('app/admin/_components/alsoLine.ts');
ok('6.0 phoneKey comes from v2/lib/vendor/cabinet.ts; no phone regex of our own under app/admin', /import \{ phoneKey \} from '@\/v2\/lib\/vendor\/cabinet'/.test(ALSO_RAW)
  && walk('app/admin').filter(f => /\.(ts|tsx)$/.test(f)).every(f => !/function \w*phone\w*\(/i.test(stripComments(R(f))) || f.endsWith('Kit.tsx')));
const ts = (await import('typescript')).default;
const cab = R('v2/lib/vendor/cabinet.ts');
const pk = (cab.match(/export function phoneKey\([\s\S]*?\n\}/) || [''])[0];
const src = pk + '\n' + ALSO_RAW.replace(/^import \{ phoneKey \}[^\n]*\n/m, '');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const tmp = P('scripts/.tmp_adm1_also.mjs'); fs.writeFileSync(tmp, js);
const { alsoMatch, alsoLine } = await import(pathToFileURL(tmp).href + '?t=' + Date.now()); fs.unlinkSync(tmp);
// cell 1 · user_id path
ok('6.1 both lists carry user_id, same id: the CERTAIN line', alsoLine(alsoMatch({ user_id: 'u1', phone: '+919811012345' }, [{ user_id: 'u1', phone: '+910000000001' }]), 'Dreamer') === 'This account is also a Dreamer. Their Dreamer profile is deleted too.');
ok('6.2 both carry user_id, different id, same phone: NO line (user_id wins, no phone hedge)', alsoMatch({ user_id: 'u1', phone: '+919811012345' }, [{ user_id: 'u2', phone: '09811012345' }]) === null);
// cell 2 · phone path
ok('6.3 no user_id, "+91 98110 12345" vs "09811012345": the HEDGED line', alsoLine(alsoMatch({ phone: '+91 98110 12345' }, [{ phone: '09811012345' }]), 'vendor') === 'A vendor has the same phone number. If it is the same account, their vendor profile is deleted too.');
ok('6.4 a degenerate number ("0000000000") gives no line', alsoMatch({ phone: '0000000000' }, [{ phone: '0000000000' }]) === null);
ok('6.5 a 9-digit number gives no line', alsoMatch({ phone: '981101234' }, [{ phone: '981101234' }]) === null);
ok('6.6 one side without user_id falls back to the phone', alsoMatch({ user_id: 'u1', phone: '+919811012345' }, [{ phone: '+919811012345' }])?.how === 'phone');
// cell 3 · what the lists carry
ok('6.7 the list types carry user_id (optional, so the screen is right before and after WEB-4 cut 8)', (S('lib/admin-api/index.ts').match(/user_id\?: string \| null/g) || []).length >= 2);
ok('6.8 both cards read the other list through its existing door on open', /getCouples\(\)\.then\(d => setDreamers\(d\.couples\)\)/.test(MAKERS) && /getVendors\(\)\.then\(d => setVendors\(d\.vendors\)\)/.test(DREAMERS) && /alsoLine\(alsoMatch\(open, dreamers\), 'Dreamer'\)/.test(MAKERS) && /alsoLine\(alsoMatch\(open, vendors\), 'vendor'\)/.test(DREAMERS));

H('§7 · CE-47 change 2: THE WORDS GATE');
// The 15 dead pages (ROUTE_MAP PHANTOM with a page file; they call /api/v3, which has no server).
// Excluded by exact path, per CE-47; the final audit decides their deletion.
// AMENDED CE-47 CLB-1 (count 15 -> 14): /admin/collab became LIVE when its door was mounted (F-44.300's cure), so it
// left the PHANTOM list and joins the words gate below; the cell's claim (exclusions == PHANTOM pages with a file) holds.
const DEAD = ['discover-heroes', 'approvals', 'photos', 'featured', 'preview', 'exploring', 'images', 'vendors', 'couples', 'messages', 'health', 'data', 'control-room', 'dashboard'].map(p => `app/admin/${p}/page.tsx`);
const phantomWithFile = [...NAV.matchAll(/\{ path: '(\/admin\/[^']+)',\s+domain: '\w+',\s+disposition: 'PHANTOM'/g)].map(m => 'app' + m[1] + '/page.tsx').filter(f => fs.existsSync(P(f))).sort();
ok('7.0 the exclusion list is exactly the PHANTOM pages that have a file (14)', DEAD.length === 14 && JSON.stringify([...DEAD].sort()) === JSON.stringify(phantomWithFile), JSON.stringify(phantomWithFile));
const files = [...walk('app/admin'), ...walk('lib/admin-api')].filter(f => /\.(ts|tsx)$/.test(f) && !DEAD.includes(f)).sort();
const hits = [];
for (const f of files) {
  const s = stripComments(R(f));
  for (const m of s.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`|>([^<>{}]+)</g)) {
    let t = m.slice(1).find(g => g !== undefined);
    if (m[3] !== undefined) t = t.replace(/\$\{[^}]*\}/g, '');
    if (m[4] !== undefined && /=>|[();]/.test(t)) continue;           // code between => and <generic>, not JSX text
    if (!/couple|bride/i.test(t)) continue;
    if (m[4] === undefined && !/\s/.test(t.trim()) && !/^[A-Z]/.test(t.trim())) continue; // a key, route or door path
    hits.push(`${f}: ${t.trim().slice(0, 70)}`);
  }
}
ok(`7.1 zero "couple" and zero "bride" in the words of ${files.length} live files`, files.length > 40 && hits.length === 0, hits.slice(0, 6).join(' | '));
ok('7.2 the page is "Dreamers"; chats are "Dreamer chats"', /PageHead title="Dreamers"/.test(DREAMERS) && /title="Dreamer chats"/.test(S('app/admin/conversations/brides/page.tsx')));
ok('7.3 server words shown on screen are mapped by key (search group "couples" reads Dreamers)', /g\.key === 'couples' \? 'Dreamers'/.test(S('app/admin/_components/CommandPalette.tsx')) && /\/\^Unnamed couple\$\/\.test\(h\.label\) \? 'Unnamed Dreamer'/.test(S('app/admin/_components/CommandPalette.tsx')));

H('§8 · ruling 7');
const liveFiles = files.filter(f => f.startsWith('app/admin'));
ok('8.1 no short-month dates in live admin files', liveFiles.every(f => !/month: *'short'/.test(stripComments(R(f)))), liveFiles.filter(f => /month: *'short'/.test(stripComments(R(f)))).join(', '));
const clockSrc = (KIT.match(/export function clock\([\s\S]*?\n\}/) || [''])[0];
const jsC = ts.transpileModule('const IST = \'Asia/Kolkata\';\n' + clockSrc, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const tmpC = P('scripts/.tmp_adm1_clock.mjs'); fs.writeFileSync(tmpC, jsC);
const { clock } = await import(pathToFileURL(tmpC).href + '?t=' + Date.now()); fs.unlinkSync(tmpC);
ok('8.2 times read "7:00 pm"', clock('2026-10-01T13:30:00Z') === '7:00 pm', clock('2026-10-01T13:30:00Z'));
const NEWF = ['app/admin/_components/Kit.tsx', 'app/admin/layout.tsx', 'app/admin/page.tsx', 'app/admin/more/page.tsx', 'app/admin/makers/page.tsx', 'app/admin/dreamers/page.tsx'];
const small = NEWF.flatMap(f => [...stripComments(R(f)).matchAll(/minHeight: (\d+)/g)].filter(m => Number(m[1]) < 44).map(m => `${f}:${m[1]}`));
ok('8.3 taps at least 44 in the new building blocks and pages', /const TAP = 44;/.test(KIT) && small.length === 0, small.join(', '));
ok('8.4 WhatsApp goes through the estate\'s one dial rule; no page builds a wa.me link', /import \{ waDialHref \} from '@\/lib\/admin\/waDial'/.test(KIT) && [MAKERS, DREAMERS, PROS, DEMO, HOME].every(s => !/wa\.me/.test(s)));
ok('8.5 nothing scrolls sideways: chips wrap, the board is a list', /flexWrap: 'wrap', paddingBottom: 12/.test(KIT) && !/overflowX: 'auto'/.test(DEMO));
ok('8.6 unbuilt says "Coming soon"', /soon/.test(S('app/admin/more/page.tsx')) && /Coming soon/.test(KIT));

H('§9 · the number is always on the row (CE-47, the founder\'s walk, 3 Oct 2026)');
const ptSrc = (KIT.match(/export function phoneText\([\s\S]*?\n\}/) || [''])[0];
const jsP = ts.transpileModule(ptSrc, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const tmpP = P('scripts/.tmp_adm1_phone.mjs'); fs.writeFileSync(tmpP, jsP);
const { phoneText } = await import(pathToFileURL(tmpP).href + '?t=' + Date.now()); fs.unlinkSync(tmpP);
ok('9.1 "+919811012345" reads "+91 98110 12345"', phoneText('+919811012345') === '+91 98110 12345');
ok('9.2 a +91 number already spaced reads the same, grouped 5-5', phoneText('+91 98110 12345') === '+91 98110 12345');
ok('9.3 a number WITHOUT its "+" is SHOWN as stored, never hidden (the defect, both ways)', phoneText('919811012345') === '919811012345' && phoneText('09811012345') === '09811012345' && phoneText('9811012345') === '9811012345');
ok('9.4 only an empty phone has no text', phoneText('') === null && phoneText('   ') === null && phoneText(null) === null);
ok('9.5 every person row prints the number, or "No number" only when empty', /\{phone !== undefined && \(\s*<div[^>]*>\{phoneText\(phone\) \?\? 'No number'\}<\/div>/.test(KIT));
ok('9.6 the buttons stay for a dialable number only; their absence is silent, not "No number"', /if \(!wa \|\| !tel\) return null;/.test(KIT) && (KIT.match(/No number/g) || []).length === 1);
ok('9.7 the vendor and Dreamer cards carry the number too', /phoneText\(open\.phone\) \?\? 'No number'/.test(MAKERS) && /phoneText\(open\.phone\) \?\? 'No number'/.test(DREAMERS));
// Both ways: the cells above red on the shipped defect, re-created in memory from the live source.
const DEFECT = KIT.replace(/\{phone !== undefined && \(\s*<div[^>]*>\{phoneText\(phone\) \?\? 'No number'\}<\/div>\s*\)\}/, '')
  .replace("if (!wa || !tel) return null;", "if (!wa || !tel) return <span>No number</span>;");
ok('9.9 MUTATION: the number taken off the row and "No number" put back in the button slot ⇒ 9.5 and 9.6 RED',
  DEFECT !== KIT && !/\{phone !== undefined && \(\s*<div[^>]*>\{phoneText\(phone\) \?\? 'No number'\}<\/div>/.test(DEFECT) && !/if \(!wa \|\| !tel\) return null;/.test(DEFECT));
ok('9.8 a nameless prospect is not titled by its number twice', /name=\{p\.name \|\| 'No name yet'\}/.test(PROS) && !/name=\{p\.name \|\| p\.phone\}/.test(PROS));

H('§10 · K4: a Dreamer is paid only when a paid plan is stored (CE-47, the founder\'s walk, 3 Oct 2026)');
const ipSrc = (WORDS.match(/export function isPaidDreamer\([\s\S]*?\n\}/) || [''])[0];
const jsI = ts.transpileModule(ipSrc, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const tmpI = P('scripts/.tmp_adm1_paid.mjs'); fs.writeFileSync(tmpI, jsI);
const { isPaidDreamer } = await import(pathToFileURL(tmpI).href + '?t=' + Date.now()); fs.unlinkSync(tmpI);
ok('10.1 an undefined tier (what the couples door sends today) is NOT paid: delete is offered', isPaidDreamer({}) === false && isPaidDreamer({ tier: undefined }) === false && isPaidDreamer({ tier: null }) === false);
ok('10.2 basic and an empty tier are not paid', isPaidDreamer({ tier: 'basic' }) === false && isPaidDreamer({ tier: '' }) === false);
ok('10.3 a stored gold or platinum IS paid: delete is blocked', isPaidDreamer({ tier: 'gold' }) === true && isPaidDreamer({ tier: 'platinum' }) === true);
ok('10.4 no Plan button posts: the placeholder door is never called and "Plan changed." is gone', !/patchCoupleTier/.test(DREAMERS) && !/Plan changed/.test(DREAMERS) && /<SheetRow label="Plan" right=\{<span[^>]*>Coming soon<\/span>\} \/>/.test(DREAMERS));
ok('10.5 the Dreamer rows carry no plan tag and no plan or Paid chips', !/PLAN\[c\.tier\]/.test(DREAMERS) && !/<Chips/.test(DREAMERS) && !/'Paid'/.test(DREAMERS));
ok('10.6 vendors keep their real plans (tier buttons, Paid chip, the tier !== basic block)', /TIERS\.map\(t => \(/.test(MAKERS) && /blockedBy=\{open\.tier !== 'basic' \? PAID_BLOCK : null\}/.test(MAKERS));
const K4DEFECT = (t) => t !== 'basic';
ok('10.7 MUTATION: the shipped predicate (tier !== basic) blocks an undefined tier, the defect, while isPaidDreamer does not', K4DEFECT(undefined) === true && isPaidDreamer({}) === false);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) { console.log('FAILED: ' + fails.join(' · ')); process.exit(1); }
