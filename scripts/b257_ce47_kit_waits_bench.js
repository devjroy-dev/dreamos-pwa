'use strict';
// scripts/b257_ce47_kit_waits_bench.js · CE-47 · ADS-2 · e-275: THE FE-7 KIT WAITS ON THE THING ITSELF, BOUNDED.
// FLOOR-SUBJECTS: scripts/lib/fe7_l4_kit.js scripts/lib/mutation_guard.js scripts/b177_fe7_room_rows_bench.js scripts/b178_fe7_dates_introductions_bench.js scripts/b179_fe7_exchange_bench.js scripts/b180_fe7_wedding_pages_bench.js scripts/b181_fe7_reviews_advisor_solutions_bench.js scripts/b182_fe7_referrals_notes_bench.js scripts/b183_fe7_onboarding_bench.js scripts/b184_fe7_help_cards_bench.js scripts/b185_fe7_expenses_bench.js scripts/b186_fe7_tds_bench.js scripts/b187_fe7_books_bench.js scripts/b188_fe7_reminders_bench.js scripts/b189_fe7_settings_bench.js
// Holds the kit's waits in a real chromium, each both ways: settle (quiet, restless, late), waitFor, waitUrl on data:
// pages; reloaded and logQuiet on a temp log. Mutations (each wait turned back into a blind return) red in children.
// §7 (F-44.419, F-44.422): the kit's mutate() plants through the guard (7.1), survives a kill (7.2), refuses below the
// free-space floor (7.3); the old shared journal is retired (7.4). §9 (F-44.419): the kit mutations go through mutation_guard.js, free space checked first; 9.K kills a run mid-mutation
// and recovers the kit by sha. §6 F-44.418: standing()'s four measuring cells red when no room drew, green when it did; M7 undoes the guard.
// §5 (CE-47 ADS-2, F-44.365 follow-up): after K.open, any second selector read in the page waits on that selector or
// guards a null, and a K.words result is guarded before it is used as an array; a bare read is a defect. The thirteen
// FE-7 benches are read as text for four bare forms, held both ways: the bare lines as found red by form, the guarded
// reads stay green, a line planted in a copy reds on its line.
const fs = require('fs'); const path = require('path'); const os = require('os'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..'); const CHILD = !!process.env.B257_CHILD;
// F-44.419: a mutation left by a killed run is restored by sha (or the bench refuses) BEFORE the kit is loaded; the
// parent only (a child runs on purpose with the parent's mutation planted).
if (!process.env.B257_CHILD) require(path.join(__dirname, '..', 'scripts/lib/mutation_guard.js')).recoverOrRefuse(path.join(__dirname, '..'), 'b257');
const K = require(path.join(ROOT, 'scripts/lib/fe7_l4_kit.js'));
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; if (!CHILD) console.log(`  PASS  ${name}`); } else { fail++; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 200) + ']'}`); } };
const page = (body) => 'data:text/html,' + encodeURIComponent(`<!doctype html><html><body>${body}</body></html>`);
// ── 5 (CE-47 ADS-2, F-44.365 follow-up) · NO BARE READ AFTER K.open ─────────────────────────────────────────────────
// The rule (handover): after K.open, any second selector read in the page either waits on that selector or guards a
// null; a bare read is a defect (b183:19, 20, 26 and b179:40, FE-9's find). Read as TEXT, inside every
// `.evaluate( … )` of a bench, three forms are bare:
//   form 1  X.querySelector(…) chained straight into . or [ , or passed as a call's argument;
//           X.querySelectorAll(…)[…] chained straight into . or [ ;
//   form 2  const v = X.querySelector(…) (or X.querySelectorAll(…)[…]) whose FIRST later use is not a guard
//           (!v, if (v, v ?, v &&, v ||, v ===, v !==, v ?.);
//   form 3  const v = [...]X.querySelectorAll(…)… indexed v[…] with no guard before it: a length guard
//           (v.length ?, v.length &&, if (v.length, !v.length, v.length > / >= / === / !==) or a guard on that
//           same element (if (!v[i]), !v[i], v[i] ?, v[i] &&: CE-47's widening, 7 Oct 2026, for FE-9's cure).
// And outside the page, on the bench's own side:
//   form 4  a K.words(…) result (null when its root is missing or the page moved under the read) used as an array
//           (.includes .some .every .join .find .filter .indexOf .map .slice .forEach .length) with no guard before it
//           in the same argument: Array.isArray(x), x &&, x ?. A property every one of whose K.words assignments
//           falls back to an array ((await K.words(…)) || […], FE-9's cure) is not null and needs none.
// A text read, not a parser: it can be fooled by a use it does not model, which is why its cells hold it both ways.
function closeParen(s, i) {   // s[i] is '(' (or '['); the index of its match, skipping quoted strings and templates
  const open = s[i], shut = open === '[' ? ']' : ')'; let d = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === "'" || c === '"' || c === '`') { const q = c; j++; while (j < s.length && s[j] !== q) { if (s[j] === '\\') j++; j++; } continue; }
    if (c === open) d++; else if (c === shut) { d--; if (d === 0) return j; }
  }
  return -1;
}
const reEsc = (v) => v.replace(/[$]/g, '\\$');
const KEYWORD_CALL = /(?:^|[^\w$])(?:if|while|for|switch|return|typeof)\s*\($/;
function bareReads(src) {
  const out = []; let bodies = 0; const re = /\.evaluate\(/g; let m;
  const lineAt = (off) => src.slice(0, off).split('\n').length;
  while ((m = re.exec(src))) {
    const a = m.index + m[0].length - 1; const z = closeParen(src, a);
    if (z < 0) { out.push({ line: lineAt(a), form: 0, text: 'an evaluate( that never closes' }); continue; }
    bodies++; const body = src.slice(a, z + 1);
    const hit = (off, form, text) => out.push({ line: lineAt(a + off), form, text: text.replace(/\s+/g, ' ').slice(0, 90) });
    const nextCh = (i) => { const x = body.slice(i).match(/^\s*(\S)/); return x ? x[1] : ''; };
    let k;
    // form 1
    const q1 = /([A-Za-z_$][\w$]*)\.querySelector(All)?\(/g;
    while ((k = q1.exec(body))) {
      const o = k.index + k[0].length - 1; let c = closeParen(body, o); if (c < 0) continue;
      if (k[2]) { if (nextCh(c + 1) !== '[') continue; const ix = body.indexOf('[', c + 1); c = closeParen(body, ix); if (c < 0) continue; }
      const nx = nextCh(c + 1); const pre = body.slice(0, k.index).replace(/\s+$/, '');
      if (nx === '.' || nx === '[') hit(k.index, 1, `${body.slice(k.index, c + 1)}${nx}`);
      else if (!k[2] && /[\w$\])]\($/.test(pre) && !KEYWORD_CALL.test(pre)) hit(k.index, 1, `${body.slice(k.index, c + 1)} as a call's argument`);
      else if (!k[2] && /[\w$\])]\([^()]*,$/.test(pre)) hit(k.index, 1, `${body.slice(k.index, c + 1)} as a call's argument`);
    }
    // form 2
    const d2 = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*[A-Za-z_$][\w$]*\.querySelector(All)?\(/g;
    while ((k = d2.exec(body))) {
      const v = k[1]; let c = closeParen(body, k.index + k[0].length - 1); if (c < 0) continue;
      if (k[2]) { if (nextCh(c + 1) !== '[') continue; c = closeParen(body, body.indexOf('[', c + 1)); if (c < 0) continue; }
      const rest = body.slice(c + 1); const u = new RegExp(`(^|[^\\w$.])${reEsc(v)}(?![\\w$])`).exec(rest); if (!u) continue;
      const at = u.index + u[1].length; const b4 = rest.slice(0, at).replace(/\s+$/, ''); const af = rest.slice(at + v.length);
      const guarded = /(?:!|if\s*\(\s*!?)$/.test(b4) || /^\s*(?:\?|&&|\|\||===|!==|==|!=)/.test(af);
      if (!guarded) hit(c + 1 + at, 2, `${v} = ${body.slice(k.index + k[0].indexOf('=') + 1, c + 1).trim()} then used bare: …${rest.slice(Math.max(0, at - 18), at + v.length + 14)}…`);
    }
    // form 3
    const d3 = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\[\s*\.\.\.\s*)?[A-Za-z_$][\w$]*\.querySelectorAll\(/g;
    while ((k = d3.exec(body))) {
      const v = k[1]; const from = k.index + k[0].length; const rest = body.slice(from);
      const ix = new RegExp(`(^|[^\\w$.])${reEsc(v)}\\s*\\[`, 'g'); let u;
      const guard = new RegExp(`(?:if\\s*\\(\\s*!?\\s*${reEsc(v)}\\.length|!\\s*${reEsc(v)}\\.length|${reEsc(v)}\\.length\\s*(?:\\?|&&|>=?|===?|!==?|<))`);
      const held = new Set();   // element expressions already guarded (if (!v[0]) …)
      while ((u = ix.exec(rest))) {
        const at = u.index + u[1].length; const ob = rest.indexOf('[', at); const cb = closeParen(rest, ob); if (cb < 0) break;
        const el = rest.slice(at, cb + 1).replace(/\s+/g, ''); const b4 = rest.slice(0, at).replace(/\s+$/, '');
        if (/(?:!|if\s*\(\s*!?)$/.test(b4) || /^\s*(?:\?(?!\.)|&&)/.test(rest.slice(cb + 1))) { held.add(el); continue; }
        if (!guard.test(rest.slice(0, at)) && !held.has(el)) { hit(from + at, 3, `${v}[…] with no guard: ${rest.slice(at, at + 44)}…`); break; }
      }
    }
  }
  return { bodies, hits: out };
}

// form 4 (the bench's own side): a K.words result used as an array with no guard before it in the same argument.
const ARRAY_USE = /^\.(?:includes|some|every|join|find|filter|indexOf|map|slice|forEach|length)\b/;
function argLevels(line) {   // for each index: the stack of enclosing levels, each { start, comma } (comma: an argument boundary began it)
  const st = [{ start: 0, comma: true }]; const at = new Array(line.length); const tpl = [];
  const snap = () => st.map((x) => ({ ...x }));
  for (let i = 0; i < line.length; i++) {
    const c = line[i]; at[i] = snap();
    if (c === "'" || c === '"') { const q = c; let j = i + 1; while (j < line.length && line[j] !== q) { if (line[j] === '\\') j++; j++; } const sn = snap(); for (let k = i; k <= j && k < line.length; k++) at[k] = sn; i = j; continue; }
    if (c === '`' || (c === '}' && tpl.length && tpl[tpl.length - 1] === st.length)) {
      if (c === '}') { tpl.pop(); st.pop(); }
      let j = i + 1; while (j < line.length && line[j] !== '`' && !(line[j] === '$' && line[j + 1] === '{')) { if (line[j] === '\\') j++; j++; }
      const sn = snap(); for (let k = i; k <= j && k < line.length; k++) at[k] = sn;
      if (line[j] === '$') { st.push({ start: j + 2, comma: false }); tpl.push(st.length); i = j + 1; } else i = j;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') st.push({ start: i + 1, comma: false });
    else if (c === ')' || c === ']' || c === '}') { if (st.length > 1) st.pop(); }
    else if (c === ',' || c === ';') st[st.length - 1] = { start: i + 1, comma: true };
  }
  return at;
}
function bareWords(src, extra = []) {
  const props = new Map();   // name -> true when EVERY K.words assignment to it falls back to an array
  const note = (name, safe) => props.set(name, props.has(name) ? props.get(name) && safe : safe);
  const asg = /(?:(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=|\.([A-Za-z_$][\w$]*)\s*=|([A-Za-z_$][\w$]*)\s*:)\s*(\(\s*)?await\s+K\.words\(/g; let m;
  while ((m = asg.exec(src))) {
    const name = m[1] || m[2] || m[3]; let safe = false;
    if (m[4]) { const o = src.lastIndexOf('(', m.index + m[0].length - 1); const c = closeParen(src, o); const c2 = c < 0 ? -1 : src.indexOf(')', c + 1);
      safe = c2 > 0 && /^\s*\|\|\s*\[/.test(src.slice(c2 + 1)); }
    note(name, safe);
  }
  for (const n of extra) note(n, false);
  const out = []; const lines = src.split('\n');
  lines.forEach((line, li) => {
    const re = /([\w$\]\)])\.([A-Za-z_$][\w$]*)(?=\.)/g; let u; let starts = null;
    while ((u = re.exec(line))) {
      const name = u[2]; if (!props.has(name) || props.get(name)) continue;
      const end = u.index + u[0].length; if (!ARRAY_USE.test(line.slice(end))) continue;
      // the receiver expression: back over identifiers, dots and one balanced (…) group
      let b = u.index + 1; let j = b - 1;
      if (line[j] === ')') { let d = 0; for (; j >= 0; j--) { if (line[j] === ')') d++; else if (line[j] === '(') { d--; if (d === 0) break; } } b = j; }
      else { while (j >= 0 && /[\w$.]/.test(line[j])) j--; b = j + 1; }
      const recv = line.slice(b, end).replace(/\s+/g, '');
      starts = starts || argLevels(line);
      const e = recv.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const g = new RegExp(`Array\\.isArray\\(${e}\\)(?:&&|\\?(?!\\.))|(?:^|[^\\w$.])${e}(?:&&|\\?(?!\\.))`);
      // climb the enclosing levels, inner to outer, until one an argument boundary began: a guard anywhere on that path
      // runs before the use (a callback inside the guarded chain); a guard in an EARLIER argument does not
      let ok = false; const lv = starts[b] || [{ start: 0, comma: true }];
      for (let k = lv.length - 1; k >= 0; k--) { if (g.test(line.slice(lv[k].start, b).replace(/\s+/g, ''))) { ok = true; break; } if (lv[k].comma) break; }
      if (ok) continue;
      out.push({ line: li + 1, form: 4, text: `${recv}${line.slice(end, end + 12)}… with no guard` });
    }
  });
  return out;
}
// Verbatim, as the kit package (r1, train 3) carries them: the four bare lines, FE-9's find and mine.
const BARE_AS_FOUND = [
  ['b183:19', String.raw`need: await p.evaluate(() => { const els = [...document.querySelectorAll('.ob-need')]; const probe = document.createElement('span'); probe.style.color = 'var(--role-caution)'; document.querySelector('.ob2').appendChild(probe); const want = getComputedStyle(probe).color; probe.remove(); return { n: els.length, allCaution: els.length > 0 && els.every((e) => getComputedStyle(e).color === want) }; }),`],
  ['b183:20', String.raw`title: await p.evaluate(() => { const h = document.querySelector('.ob-h'); const cs = getComputedStyle(h); return { style: cs.fontStyle, family: cs.fontFamily }; }),`],
  ['b183:26', String.raw`await p.evaluate(() => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; const f = document.querySelectorAll('.ob-f'); set.call(f[0], 'Kavya Rao'); f[0].dispatchEvent(new Event('input', { bubbles: true })); });`],
  ['b179:40', String.raw`await q.evaluate(() => { const rs = [...document.querySelectorAll('button.fr-row')].filter((r) => r.textContent.startsWith('Aanya Mehra')); rs[rs.length - 1].click(); });`],
];
// Verbatim: the guarded second reads the ADS-2 list named (CE-47, 7 Oct 2026).
const GUARDED_AS_READ = [
  ['b178:34', String.raw`const pill = await p.evaluate(() => { const b = document.querySelector('[data-add-key="introduction"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { text: b.textContent.trim(), h: Math.round(r.height), tap44: b.hasAttribute('data-tap44') }; });`],
  ['b179:43', String.raw`const lastIsWithdraw = await q.evaluate(() => { const bs = [...document.querySelectorAll('.wl-main button')].filter((b) => b.offsetParent); return bs.length ? bs[bs.length - 1].textContent.trim() : null; });`],
  ['b179:56', String.raw`const firstBtn = await p.evaluate(() => { const b = document.querySelector('.wl-main .rp-next'); return b ? b.textContent.trim() : null; });`],
  ['b180:27', String.raw`pill: await p.evaluate(() => { const b = document.querySelector('[data-add-key="wedding-page"]'); return b ? b.textContent.trim() : null; }),`],
  ['b180:35', String.raw`next: await p.evaluate(() => { const b = document.querySelector('.wl-main .rp-next'); return b ? b.textContent.trim() : null; }),`],
  ['b182:32', String.raw`pill: await p.evaluate(() => { const b = document.querySelector('[data-add-key="note"]'); if (!b) return null; return { text: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), tap44: b.hasAttribute('data-tap44') }; }) };`],
  ['b182:41', String.raw`r.placeholder = await q.evaluate(() => { const t = document.querySelector('textarea'); return t ? t.getAttribute('placeholder') : null; });`],
  ['b183:21', String.raw`go: await p.evaluate(() => { const b = document.querySelector('.ob-go'); return b ? b.textContent.trim() : null; }) };`],
  ['b184:35', String.raw`r.card = await p.evaluate(() => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; return { lines: c.querySelectorAll('.wl-helpdo li').length, fits: c.scrollHeight <= c.clientHeight + 1, text: c.innerText }; });`],
  ['b185:18', String.raw`r.pill = await p.evaluate(() => { const b = document.querySelector('[data-add-key="expense"]'); return b ? { t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), tap: b.hasAttribute('data-tap44') } : null; });`],
  ['b185:19', String.raw`r.head = await p.evaluate(() => (document.querySelector('.fr-h') || {}).textContent || '');`],
  ['b186:15', String.raw`r.pill = await p.evaluate(() => { const b = document.querySelector('[data-add-key="tds"]'); return b ? { t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), tap: b.hasAttribute('data-tap44') } : null; });`],
  ['b186:19', String.raw`r.lastBtn = await p.evaluate(() => { const bs = [...document.querySelectorAll('.fr-room button')]; return bs.length ? bs[bs.length - 1].textContent.trim() : null; });`],
  ['b188:13', String.raw`first: await p.evaluate(() => { const g0 = document.querySelector('.fr-room .fr-group'); return g0 ? (g0.querySelector('.fr-t') || {}).textContent : null; }),`],
  ['b188:14', String.raw`sw: await p.evaluate(() => { const s = document.querySelector('[role=switch]'); return s ? { checked: s.getAttribute('aria-checked'), disabled: s.disabled } : null; }),`],
  ['b189:15', String.raw`const t = await p.evaluate(() => { const s = document.querySelector('.wl-sheet, [role=dialog]'); return s ? s.innerText : ''; });`],
];
// Verbatim, as train 3 carries them: the 24 K.words uses with no guard (ADS-2's list, CE-47 7 Oct 2026).
const WORDS_BARE_AS_FOUND = [
  ['b180:65', `ok(D.ws.includes('‹ Back to Wedding pages') || D.ws.includes('Back to Wedding pages'), '3.1 "Back to Wedding pages"');`],
  ['b180:66', `ok(D.ws.includes('Not published') && D.next === 'Publish this page', '3.2 "Not published", and "Publish this page" on top', D.next);`],
  ['b180:67', `ok(D.ws.includes('Photographs') && D.ws.includes('Who worked this wedding') && D.rows.map((r) => r.pill).join('|') === 'Claimed|Claimed', '3.3 Photographs, and the credits as rows with their states', D.rows.map((r) => r.pill).join('|'));`],
  ['b180:68', `ok(['Permission', 'The client’s number', 'Ask for permission'].every((w) => D.ws.includes(w)), '3.4 Permission, "The client\\'s number", "Ask for permission"');`],
  ['b180:71', `ok(V.ws.includes('This page is live.') && V.next === null, '4.1 "This page is live.", and no Publish', V.next);`],
  ['b180:73', `ok(!V.ws.some((w) => /Video tools|Check again/.test(w)), '4.3 no probe line and no Check again');`],
  ['b180:76', `ok(D.asked.includes('Remove this photograph?') && D.asked.includes('Keep it') && D.afterOne === D.before, '5.1 the × asks first and sends nothing', \`\${D.before} -> \${D.afterOne}\`);`],
  ['b181:46', `ok(R.ws.includes('Google review requests sent after each published wedding page, and your seal.'), '2.1 the room\\'s line');`],
  ['b181:52', `ok(E.ws.includes('When you publish a wedding page, we ask the client for a Google review. Once, and never again.') && K.noCouple(E.ws) && K.noCouple(R.ws), '2.5 nothing asked yet reads the client line; no "couple" in either state');`],
  ['b181:56', `ok(!adv.chip && adv.ws.includes('Ask about pricing, positioning or a decision you are weighing.'), '3.1 no chip; the line is there');`],
  ['b182:59', `ok(R.ws.includes('Enquiries passed to peers, and received from them.'), '2.2 the room\\'s line');`],
  ['b182:60', `ok(R.ws.includes('Sent') && R.ws.includes('5') && R.ws.includes('Received') && R.ws.includes('3'), '2.3 Sent 5 and Received 3');`],
  ['b185:48', `ok(r.head === monthHead && r.words.includes('2 filed in September 2026'), '3.2 the headline and "2 filed in September 2026"', \`\${r.head} / \${r.words.find((w) => /filed/.test(w))}\`);`],
  ['b185:51', `ok(r.page.includes('Edit') && /Delete$/.test(r.last) && r.asked.includes('Delete this expense?') && r.asked.includes('Keep it') && r.afterOne === 0, '3.5 an expense opens as a page; Delete is last and asks first; nothing sent on the first tap', \`\${r.last} / \${r.afterOne}\`);`],
  ['b185:56', `cell: async (g) => { const r = await room(g); return r.asked.includes('Delete this expense?') && r.afterOne === 0; } },`],
  ['b186:44', `ok(r.words.includes(\`TDS · \${fyNow()}\`) && r.seg.length === 3 && r.seg[0] === fyNow(), '3.2 "TDS · FY yyyy-yy" and the switch of three years', \`\${r.seg.join('|')}\`);`],
  ['b186:45', `ok(['Gross', 'TDS deducted', 'Net received', 'Rs 1,50,000', 'Rs 15,000', 'Rs 1,35,000'].every((w) => r.words.includes(w)), '3.3 Gross, TDS deducted, Net received');`],
  ['b186:49', `ok(r.page.includes('TDS deducted') && r.asked.includes('Delete this entry?') && r.asked.includes('Keep it') && r.afterOne === 0, '3.7 an entry opens as a page; Delete is last and asks first; nothing sent on the first tap', r.afterOne);`],
  ['b186:51', `ok(E.found && !E.crash && E.words.some((w) => /^No TDS entries for FY/.test(w)), '3.8 an empty year draws, and says so');`],
  ['b186:54', `{ name: 'M1 "TDS deducted" back to "TDS"', rel: F, from: "deducted: 'TDS deducted',", to: "deducted: 'TDS',", glass: true, cell: async (g) => (await room(g)).words.includes('TDS deducted') },`],
  ['b187:13', `r.text = r.words.join(' '); await p.close(); return r;`],
  ['b187:26', `ok(['Total received', 'Rs 4,10,000', 'Outstanding', 'Rs 3,40,000', 'Money movements'].every((w) => r.words.includes(w)), '3.1 Total received, Outstanding, Money movements');`],
  ['b188:31', `ok(r.words.some((w) => /^On\\. After you send the first reminder/.test(w)), '3.2 its state sentence');`],
  ['b188:34', `ok(r.words.includes('Sent means WhatsApp accepted it. We cannot tell you whether it was delivered or read.'), '3.5 the sent note stays');`],
];
// Verbatim: K.words uses already guarded on train 3.
const WORDS_GUARDED_AS_READ = [
  ['b178:66', `ok(Array.isArray(D.ws) && !D.ws.some((w) => /^Coming$|What this will do|Suggest rates/.test(w)), '2.4 the old kicker, "What this will do" and "Suggest rates" are gone');`],
  ['b178:74', `ok(Array.isArray(I.sheetWords) && I.sheetWords.includes('New introduction') && I.fields, '3.4 the pill opens the sheet "New introduction" with the three fields');`],
  ['b178:77', `ok(Array.isArray(I.preview) && I.preview.includes('Send to Anita Verma') && I.preview.some((w) => /^Hi Anita Verma/.test(w)), '3.7 the preview shows what they will receive, and "Send to Anita Verma"');`],
  ['b180:84', `cell: async (g) => { const D = await wedding(g, 'Riya and Dev', true); return Array.isArray(D.asked) && D.asked.includes('Remove this photograph?') && D.afterOne === D.before; } },`],
  ['b182:68', `ok(N.lastBtn === 'Send to chat|Delete' && Array.isArray(N.asked) && N.asked.includes('Delete this note?') && N.asked.includes('Keep it') && N.afterOne === 0, '3.3 Delete is last and asks first; nothing sent on the first tap', \`\${N.lastBtn} / \${N.afterOne}\`);`],
  ['b182:74', `cell: async (g) => { const N = await notes(g); return Array.isArray(N.asked) && N.asked.includes('Delete this note?') && N.afterOne === 0; } },`],
  ['b179:81', `ok(Array.isArray(S.inf) && S.inf.includes('Send request') && ['By city', 'By age', 'By gender'].every((h) => S.inf.includes(h)) && S.inf.includes('Verified via Instagram · 4.1% engagement'), '2.4 an influencer opens as a page: status, Send request, the three tables');`],
  ['b179:83', `ok(Array.isArray(S.req) && S.req.includes('The request') && S.req.includes('Back to Influencer exchange') && S.lastIsWithdraw === 'Withdraw', '2.6 a request opens as a page, with Withdraw last', S.lastIsWithdraw);`],
  ['b179:84', `ok(Array.isArray(S.asked) && S.asked.includes('Withdraw your request to Aanya Mehra?') && S.asked.includes('Keep it') && S.afterOne === S.before, '2.7 Withdraw asks first, and nothing is sent on the first tap', \`\${S.before} -> \${S.afterOne}\`);`],
  ['b179:90', `ok(Array.isArray(I.asked) && I.asked.includes('Decline this request from Studio Lumen?') && I.afterOne === I.before, '3.3 Decline is last and asks first; nothing sent on the first tap', \`\${I.before} -> \${I.afterOne}\`);`],
];
(async () => {
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_BIN || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const fresh = async () => { const p = await browser.newPage(); await K.instrument(p); return p; };
  try {
    if (!CHILD) console.log('\n── 1  settle ──');
    let p = await fresh(); await p.goto(page('<p>still</p>')); let r = await K.settle(p, { max: 3000 });
    ok(!r.timedOut && r.ms < 3000, '1.1 a quiet page settles', JSON.stringify(r)); await p.close();
    p = await fresh(); await p.goto(page('<p id=x></p><script>setInterval(()=>{x.textContent=Date.now()},100)</script>')); r = await K.settle(p, { max: 1500 });
    ok(r.timedOut && r.ms >= 1500, '1.2 a page that never goes quiet: settle stops at its cap and says so', JSON.stringify(r)); await p.close();
    p = await fresh(); await p.goto(page('<p id=x></p><script>const t=setInterval(()=>{x.textContent=Date.now()},80);setTimeout(()=>clearInterval(t),700)</script>')); r = await K.settle(p, { max: 5000 });
    ok(!r.timedOut && r.ms >= 600, '1.3 a page busy for 700 ms: settle waits it out, not a fixed pause', JSON.stringify(r)); await p.close();
    if (!CHILD) console.log('\n── 2  waitFor, waitUrl ──');
    p = await fresh(); await p.goto(page('<script>setTimeout(()=>{const d=document.createElement("div");d.className="card";document.body.append(d)},400)</script>'));
    r = await K.waitFor(p, '.card', 5000); ok(!r.timedOut && r.ms >= 300, '2.1 waitFor finds the element when it comes', JSON.stringify(r));
    r = await K.waitFor(p, '.never', 800); ok(r.timedOut && r.ms >= 800, '2.2 waitFor on an element that never comes: timed out at its cap', JSON.stringify(r)); await p.close();
    p = await fresh(); await p.goto('about:blank'); await p.evaluate(() => setTimeout(() => history.pushState({}, '', '#went'), 300));
    r = await K.waitUrl(p, (u) => u.endsWith('#went'), 5000); ok(!r.timedOut, '2.3 waitUrl sees the navigation when it happens', JSON.stringify(r));
    r = await K.waitUrl(p, (u) => u.includes('nowhere'), 800); ok(r.timedOut, '2.4 waitUrl on a URL that never comes: timed out at its cap', JSON.stringify(r)); await p.close();
    if (!CHILD) console.log('\n── 3  reloaded, logQuiet (the dev server log) ──');
    const LOG = path.join(fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'b257-')), 'dev.log');
    fs.writeFileSync(LOG, ' ✓ Compiled in 41ms\n');
    let mark = K.logMark(LOG); setTimeout(() => fs.appendFileSync(LOG, ' ✓ Compiled in 20ms\n'), 300);
    r = await K.reloaded(mark, LOG, 5000); ok(!r.timedOut && r.ms >= 200, '3.1 reloaded sees the Compiled line written after the mark', JSON.stringify(r));
    mark = K.logMark(LOG); r = await K.reloaded(mark, LOG, 800); ok(r.timedOut, '3.2 a Compiled line from BEFORE the mark is not this reload', JSON.stringify(r));
    let n = 0; const iv = setInterval(() => { fs.appendFileSync(LOG, `line ${n++}\n`); if (n >= 6) clearInterval(iv); }, 100);
    r = await K.logQuiet(LOG, { quiet: 500, max: 5000 }); ok(!r.timedOut && r.ms >= 500, '3.3 logQuiet waits for the log to stop moving', JSON.stringify(r));
    if (!CHILD) console.log('\n── 6  F-44.418: the standing cells measure only a room that drew ──');
    { // a local page server: /none draws a room with no rows, /rows draws one row with its facts
      const http = require('http');
      const body = (rows) => `<!doctype html><html><body><main class="wl-main"><div class="wl-roomhead"></div>${rows ? '<div class="fr-room"><div class="fr-row"><div class="fr-t">Hotel Leela</div><div class="fr-f">Paid on 8 September 2026</div></div></div>' : '<div class="fr-room"></div>'}</main></body></html>`;
      const srv = http.createServer((q, a) => { a.writeHead(200, { 'content-type': 'text/html' }); a.end(body(q.url.startsWith('/rows'))); });
      await new Promise((res) => srv.listen(0, '127.0.0.1', res));
      const g = { browser, port: srv.address().port };
      const run = async (url) => { const got = []; await K.standing(g, (c, name, info) => got.push({ c: !!c, name: name.replace(/^T at \d+: /, ''), info }), 'T', url, { wait: '.wl-main' }); return got; };
      try {
        const MEASURE = /two lines|full months|no "couple"|44 high/;
        const none = await run('/none'); const rows = await run('/rows');
        const nm = none.filter((x) => MEASURE.test(x.name)); const rm = rows.filter((x) => MEASURE.test(x.name));
        ok(none.filter((x) => /the room draws/.test(x.name)).every((x) => !x.c) && nm.length === 8 && nm.every((x) => !x.c && x.info === 'nothing drew to measure'),
          '6.1 a room that drew no rows: "the room draws its rows" and the four measuring cells red at both widths, each "nothing drew to measure"', JSON.stringify(nm.filter((x) => x.c).map((x) => x.name)));
        ok(rows.filter((x) => /the room draws/.test(x.name)).every((x) => x.c) && rm.length === 8 && rm.every((x) => x.c),
          '6.2 a room that drew its rows: the same four cells green, as before', JSON.stringify(rm.filter((x) => !x.c).map((x) => `${x.name} ${x.info}`)));
      } finally { await new Promise((res) => srv.close(res)); }
    }
  } finally { await browser.close().catch(() => {}); }
  if (!CHILD) console.log('\n── 4  e-277: anchors clean before the first cell ──');
  { const files = { 'a.ts': "const x = 'one';\n", 'b.ts': "const y = 'two-planted';\n" }; const rd = (rel) => files[rel];
    const clean = K.anchorsClean([{ name: 'M1', rel: 'a.ts', from: "'one'", to: "'one-planted'" }], rd);
    const planted = K.anchorsClean([{ name: 'M2', rel: 'b.ts', from: "'two'", to: "'two-planted'" }], rd);
    ok(clean.length === 0, '4.1 a clean anchor passes', JSON.stringify(clean));
    ok(planted.length === 2 && planted.some((x) => /already planted/.test(x)) && planted.every((x) => x.startsWith('b.ts')), '4.2 a mutation left applied is named, with its file', JSON.stringify(planted)); }
  const MUTS = [
    ["    if ((p.inflight || 0) === 0 && now - (p.lastNet || 0) >= quiet && now - lastMut >= quiet) return { ms: now - t0, timedOut: false };", "    return { ms: now - t0, timedOut: false };", 'M1 settle returns at once', '1.2'],
    ["    if (await p.evaluate((x) => !!document.querySelector(x), sel).catch(() => false)) return { ms: Date.now() - t0, timedOut: false };", "    return { ms: Date.now() - t0, timedOut: false };", 'M2 waitFor does not look', '2.2'],
    ["    if (pred(p.url())) return { ms: Date.now() - t0, timedOut: false };", "    return { ms: Date.now() - t0, timedOut: false };", 'M3 waitUrl does not look', '2.4'],
    ["if (size > mark) { const b = Buffer.alloc(size - mark); fs.readSync(fd, b, 0, b.length, mark);", "if (size > 0) { const b = Buffer.alloc(size); fs.readSync(fd, b, 0, b.length, 0);", 'M4 reloaded reads from the start, not the mark', '3.2'],
    ["    if (Date.now() - since >= quiet) return { ms: Date.now() - t0, timedOut: false };", "    return { ms: Date.now() - t0, timedOut: false };", 'M5 logQuiet returns at once', '3.3'],
    ["  return bad;\n}\nasync function open(", "  return [];\n}\nasync function open(", 'M6 anchorsClean sees nothing', '4.2'],
    ["    ok(drew && bad.length === 0, `${room} at ${w}: every row's facts in at most two lines, nothing clipped`", "    ok(bad.length === 0, `${room} at ${w}: every row's facts in at most two lines, nothing clipped`", 'M7 F-44.418 undone: the facts cell measures nothing and reads green', '6.1'],
  ];
  if (CHILD) { console.log(`b257 child · ${pass} pass · ${fail} fail`); process.exit(fail ? 1 : 0); }
  if (!CHILD) console.log('\n── 7  F-44.419 and F-44.422: the kit’s mutate() goes through the guard; the old journal is retired ──');
  if (!CHILD) {
    const DIR = path.join(ROOT, 'scripts', '.b257-scratch'); const REL7 = 'scripts/.b257-scratch/target.txt'; const T7 = path.join(ROOT, REL7);
    const ORIG7 = 'the word is Keep it\n'; const PEND = path.join(ROOT, 'scripts', '.mutation-pending');
    const kid = (code, env = {}) => cp.spawnSync(process.execPath, ['-e', `const K = require(${JSON.stringify(path.join(ROOT, 'scripts/lib/fe7_l4_kit.js'))}); ${code}`], { encoding: 'utf8', timeout: 60000, env: { ...process.env, ...env } });
    fs.mkdirSync(DIR, { recursive: true });
    try {
      fs.writeFileSync(T7, ORIG7);
      // 7.1 a mutation is planted through the guard: during its cell the marker names this run; after it, the file is back
      let r = kid(`const fs = require('fs'); const out = []; K.mutate((c, n) => out.push((c ? 'G ' : 'R ') + n), 'X', ${JSON.stringify(REL7)}, 'Keep it', 'Keep', async () => { const m = fs.readdirSync(${JSON.stringify(PEND)}).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(${JSON.stringify(PEND)} + '/' + f, 'utf8'))); console.log('MARK ' + JSON.stringify(m.map((x) => [x.rel, x.owner, x.pid === process.pid]))); console.log('DISK ' + fs.readFileSync(${JSON.stringify(T7)}, 'utf8').trim()); return false; }).then(() => console.log('OUT ' + out.join(' | ')));`);
      ok(/MARK \[\["scripts\/\.b257-scratch\/target\.txt","fe7_l4",true\]\]/.test(r.stdout) && /DISK the word is Keep$/m.test(r.stdout) && /OUT G X: the cell goes red with the mutation planted \| G X: scripts\/\.b257-scratch\/target\.txt restored to its sha/.test(r.stdout) && fs.readFileSync(T7, 'utf8') === ORIG7 && !fs.existsSync(PEND),
        '7.1 a mutation is planted through the guard (a marker naming this run), its cell sees it, and the file is restored by sha', r.stdout.replace(/\n/g, ' / ').slice(0, 200));
      // 7.2 a run SIGKILLed mid-mutation leaves the tree recoverable; the next start (recovered()) restores it by sha
      r = kid(`K.mutate(() => {}, 'X', ${JSON.stringify(REL7)}, 'Keep it', 'Keep', async () => { process.kill(process.pid, 'SIGKILL'); });`);
      const left = fs.readFileSync(T7, 'utf8'); const r2 = kid(`console.log('BACK ' + K.recovered());`);
      ok(r.signal === 'SIGKILL' && left.includes('is Keep\n') && /BACK restored scripts\/\.b257-scratch\/target\.txt by sha/.test(r2.stdout) && fs.readFileSync(T7, 'utf8') === ORIG7 && !fs.existsSync(PEND),
        '7.2 a run killed mid-mutation leaves it recoverable, and the next start restores it by sha', `${r.signal} ${JSON.stringify(left)} ${r2.stdout.trim()}`);
      // 7.3 below the free-space floor the mutation is not planted: its cell is a named red, the file untouched
      r = kid(`const out = []; K.mutate((c, n, i) => out.push((c ? 'G ' : 'R ') + n + (i ? ' [' + i + ']' : '')), 'X', ${JSON.stringify(REL7)}, 'Keep it', 'Keep', async () => false).then(() => console.log('OUT ' + out.join(' | ')));`, { FE7_MIN_FREE_BYTES: String(Number.MAX_SAFE_INTEGER) });
      ok(/OUT R X: the cell goes red with the mutation planted \[not planted: \d+ MB free/.test(r.stdout) && /G X: scripts\/\.b257-scratch\/target\.txt restored to its sha/.test(r.stdout) && fs.readFileSync(T7, 'utf8') === ORIG7 && !fs.existsSync(PEND),
        '7.3 below the free-space floor nothing is planted, and the cell says so', r.stdout.trim().slice(0, 200));
      // 7.4 the old journal: one whose file is already the original is removed; one whose file differs is SET ASIDE, never written in
      const J = kid(`console.log(K.OLD_JOURNAL);`).stdout.trim(); const had = fs.existsSync(J) ? fs.readFileSync(J) : null;
      try {
        fs.writeFileSync(J, JSON.stringify({ rel: REL7, sha: crypto.createHash('sha256').update(ORIG7).digest('hex'), orig: ORIG7 }));
        const a = kid(`console.log('BACK ' + K.recovered());`);
        fs.writeFileSync(T7, 'the word is Keep it, as tree Y has it\n');
        fs.writeFileSync(J, JSON.stringify({ rel: REL7, sha: crypto.createHash('sha256').update(ORIG7).digest('hex'), orig: ORIG7 }));
        const b = kid(`console.log('BACK ' + K.recovered());`);
        const aside = (b.stdout.match(/set aside at (\S+) /) || [])[1];
        const asideA = (a.stdout.match(/set aside at (\S+) /) || [])[1];
        ok(/the file is the original in this tree\); it names no tree, so nothing was written/.test(a.stdout) && /the file is NOT the original in this tree\); it names no tree, so nothing was written/.test(b.stdout)
          && fs.readFileSync(T7, 'utf8').includes('tree Y') && !fs.existsSync(J) && asideA && fs.existsSync(asideA) && aside && fs.existsSync(aside),
          '7.4 the old journal is retired: set aside and named either way (it names no tree), never deleted, never written into a tree', `${a.stdout.trim()} / ${b.stdout.trim()}`.slice(0, 240));
        for (const x of [asideA, aside]) if (x) fs.rmSync(x, { force: true });
      } finally { if (had) fs.writeFileSync(J, had); else fs.rmSync(J, { force: true }); }
    } finally { fs.rmSync(DIR, { recursive: true, force: true }); }
  }
  console.log('\n── 5  no bare read after K.open (the thirteen FE-7 benches, read as text) ──');
  { const BENCHES = fs.readdirSync(path.join(ROOT, 'scripts')).filter((f) => /^b1(7[7-9]|8[0-9])_fe7_.*_bench\.js$/.test(f)).sort();
    ok(BENCHES.length === 13 && BENCHES[0].startsWith('b177_') && BENCHES[12].startsWith('b189_'), '5.1 the thirteen benches, b177 to b189, are all here', BENCHES.join(' '));
    const seen = []; const bare = []; let bodies = 0;
    for (const f of BENCHES) { const s = fs.readFileSync(path.join(ROOT, 'scripts', f), 'utf8'); const r = bareReads(s); bodies += r.bodies;
      const ev = (s.match(/\.evaluate\(/g) || []).length; if (r.bodies !== ev) seen.push(`${f}: ${r.bodies} of ${ev}`);
      for (const h of [...r.hits, ...bareWords(s)]) bare.push([`${f.slice(0, 4)}:${h.line} form ${h.form}`, h.text]); }
    ok(seen.length === 0 && bodies > 0, `5.2 every .evaluate( in them is read to its close (${bodies} bodies)`, seen.join(' / '));
    ok(bare.length === 0, '5.3 none of the thirteen reads a second selector bare, in the page or from K.words: it waits on it or guards a null', bare.map(([w]) => w).join(' | '));
    for (const [w, t] of bare) console.log(`          ${w}  ${t}`);
    const at = (lines) => lines.map(([t, l]) => [t, bareReads(l).hits.map((h) => h.form)]);
    const found = at(BARE_AS_FOUND);
    ok(JSON.stringify(found.map(([t, f]) => `${t}:${f.join(',')}`)) === JSON.stringify(['b183:19:1', 'b183:20:2', 'b183:26:3', 'b179:40:3']), '5.4 both ways: each bare line as found reds, by its form (b183:19 form 1, :20 form 2, :26 form 3, b179:40 form 3)', JSON.stringify(found));
    const clean = at(GUARDED_AS_READ).filter(([, f]) => f.length);
    ok(clean.length === 0, `5.5 both ways: the ${GUARDED_AS_READ.length} guarded second reads stay green`, JSON.stringify(clean));
    const plant = (file, from, to) => { const s = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8'); if (s.split(from).length !== 2) return { anchor: false };
      const line = s.slice(0, s.indexOf(from)).split('\n').length; const h = bareReads(s.replace(from, to)).hits.filter((x) => x.line === line); return { anchor: true, forms: h.map((x) => x.form) }; };
    const P = [
      ['b185_fe7_expenses_bench.js', "(document.querySelector('.fr-h') || {}).textContent", "document.querySelector('.fr-h').textContent", 1],
      ['b180_fe7_wedding_pages_bench.js', "const b = document.querySelector('.wl-main .rp-next'); return b ? b.textContent.trim() : null;", "const b = document.querySelector('.wl-main .rp-next'); return b.textContent.trim();", 2],
      ['b186_fe7_tds_bench.js', 'return bs.length ? bs[bs.length - 1].textContent.trim() : null;', 'return bs[bs.length - 1].textContent.trim();', 3],
    ];
    for (const [file, from, to, form] of P) { const r = plant(file, from, to);
      ok(r.anchor && r.forms.length === 1 && r.forms[0] === form, `5.${5 + form} both ways: a form ${form} line planted in a copy of ${file.slice(0, 4)} reds on its line`, JSON.stringify(r)); }
    const x = (src) => bareReads(src).hits.map((h) => h.form).join(',');
    ok(x("p.evaluate(() => { if (document.querySelector('.a')) return 1; return !!document.querySelector('.b'); })") === '' && x("p.evaluate((i) => { const el = document.querySelectorAll('input')[i]; if (!el) return; el.click(); }, 0)") === '' && x("p.evaluate((i) => { const el = document.querySelectorAll('input')[i]; el.click(); }, 0)") === '2' && x("p.evaluate(() => document.querySelectorAll('.r')[0].click())") === '1',
      '5.9 the edges: if (…) and !!… are guards; an indexed querySelectorAll is bare until guarded', [x("p.evaluate(() => { if (document.querySelector('.a')) return 1; return !!document.querySelector('.b'); })"), x("p.evaluate((i) => { const el = document.querySelectorAll('input')[i]; el.click(); }, 0)"), x("p.evaluate(() => document.querySelectorAll('.r')[0].click())")].join(' / '));
    // CE-47 (7 Oct 2026): form 3 widened to a guard on the indexed element itself (FE-9's cure guards f[0] so), and form 4
    const fe9 = "p.evaluate(() => { const f = document.querySelectorAll('.ob-f'); if (!f[0]) return false; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(f[0], 'Kavya Rao'); f[0].dispatchEvent(new Event('input', { bubbles: true })); return true; })";
    ok(x(fe9) === '' && x(fe9.replace('if (!f[0]) return false;', 'if (!f[1]) return false;')) === '3' && x("p.evaluate(() => { const f = document.querySelectorAll('.a'); return f[0] ? f[0].id : null; })") === '',
      '5.10 both ways: a guard on the element itself is a guard (FE-9\'s if (!f[0])); a guard on another element is not', [x(fe9), x(fe9.replace('if (!f[0]) return false;', 'if (!f[1]) return false;'))].join(' / '));
    const W = ['ws', 'asked', 'words', 'page'];
    const wb = WORDS_BARE_AS_FOUND.filter(([, l]) => bareWords(l, W).length === 0).map(([t]) => t);
    ok(WORDS_BARE_AS_FOUND.length === 24 && wb.length === 0, '5.11 both ways: each of the 24 K.words uses as found reds (form 4)', wb.join(' '));
    const wg = WORDS_GUARDED_AS_READ.filter(([, l]) => bareWords(l, W).length > 0).map(([t]) => t);
    const fb = "const ws = (await K.words(p, '.ob-in')) || [await gone(p, '.ob-in')];\n    ok(F.ws.includes('x'), 'c');";
    ok(wg.length === 0 && bareWords(fb).length === 0 && bareWords(fb.replace("(await K.words(p, '.ob-in')) || [await gone(p, '.ob-in')]", "await K.words(p, '.ob-in')")).length === 1,
      `5.12 both ways: the ${WORDS_GUARDED_AS_READ.length} guarded uses stay green; FE-9's fallback (|| [gone line]) is a guard, and without it the use reds`, wg.join(' '));
    const plant4 = (file, from, to) => { const s = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8'); if (s.split(from).length !== 2) return { anchor: false };
      const line = s.slice(0, s.indexOf(from)).split('\n').length; return { anchor: true, n: bareWords(s.replace(from, to)).filter((h) => h.line === line).length }; };
    const p1 = plant4('b178_fe7_dates_introductions_bench.js', 'ok(Array.isArray(D.ws) && !D.ws.some(', 'ok(!D.ws.some(');
    const p2 = plant4('b185_fe7_expenses_bench.js', '${Array.isArray(r.words) ? r.words.find((w) => /filed/.test(w)) : r.words}', '${r.words.find((w) => /filed/.test(w))}');
    ok(p1.anchor && p1.n === 1 && p2.anchor && p2.n === 1, '5.13 both ways: a guard taken off a copy of b178 reds on its line; a guard in the condition does not cover the info argument (b185)', JSON.stringify([p1, p2])); }
  console.log('\n── 9  mutations (each in a fresh child, restored by sha) ──');
  // F-44.419 (CE-47 lesson 5): each mutation goes through scripts/lib/mutation_guard.js (the original kept and synced,
  // then a marker, then the mutation), so a run killed mid-mutation, or a disk that fills, never leaves the kit changed:
  // the next start of this bench restores it by sha or refuses. Free space is checked before the first write.
  const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
  const P = path.join(ROOT, 'scripts/lib/fe7_l4_kit.js'); const REL = 'scripts/lib/fe7_l4_kit.js';
  const free = (() => { try { const f = fs.statfsSync(ROOT); return f.bavail * f.bsize; } catch (_e) { return null; } })();
  ok(free === null || free >= 256 * 1024 * 1024, '9.0 free space before the first mutation (256 MB at least)', free === null ? 'statfs unavailable' : `${Math.round(free / 1048576)} MB`);
  if (free !== null && free < 256 * 1024 * 1024) { console.log(`\nb257 · ${pass} pass · ${fail} fail`); process.exit(1); }
  for (const [from, to, name, cell] of MUTS) {
    const src = fs.readFileSync(P, 'utf8'); const before = crypto.createHash('sha256').update(src).digest('hex');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`); continue; }
    let r; let planted = null;
    try { planted = guard.apply(ROOT, REL, from, to, 'b257'); r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B257_CHILD: '1' }, encoding: 'utf8', timeout: 120000 }); }
    finally { if (planted) planted.restore(); else if (crypto.createHash('sha256').update(fs.readFileSync(P)).digest('hex') !== before) fs.writeFileSync(P, src); }
    r = r || { status: null, stdout: '' };
    const after = crypto.createHash('sha256').update(fs.readFileSync(P)).digest('hex');
    ok(r.status === 1 && (r.stdout || '').includes(`FAIL  ${cell} `) && after === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  { // 9.K F-44.419 both ways: a run SIGKILLed with a mutation planted leaves the kit recoverable, and this bench's start restores it
    const orig = fs.readFileSync(P, 'utf8'); const before = crypto.createHash('sha256').update(orig).digest('hex');
    const kid = cp.spawnSync(process.execPath, ['-e', `const g = require(${JSON.stringify(path.join(ROOT, 'scripts/lib/mutation_guard.js'))}); g.apply(${JSON.stringify(ROOT)}, ${JSON.stringify(REL)}, ${JSON.stringify(MUTS[0][0])}, ${JSON.stringify(MUTS[0][1])}, 'b257'); process.kill(process.pid, 'SIGKILL');`], { encoding: 'utf8', timeout: 30000 });
    const planted = crypto.createHash('sha256').update(fs.readFileSync(P)).digest('hex') !== before;
    const rec = guard.recover(ROOT);
    const back = crypto.createHash('sha256').update(fs.readFileSync(P)).digest('hex') === before;
    ok(kid.signal === 'SIGKILL' && planted && rec.restored.includes(REL) && back && !fs.existsSync(path.join(ROOT, 'scripts', '.mutation-pending', `b257-${crypto.createHash('sha256').update(REL).digest('hex').slice(0, 12)}.json`)),
      '9.K F-44.419: a run killed with a mutation planted leaves it recoverable, and recovery puts the kit back by sha', JSON.stringify({ signal: kid.signal, planted, restored: rec.restored, back }));
    if (!back) fs.writeFileSync(P, orig);   // never leave the kit changed, whatever the cell found
  }
  console.log(`\nb257 · ${pass} pass · ${fail} fail`);
  if (failed.length) console.log('FAILED: ' + failed.join(' | '));
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('  FAIL  b257 crashed: ' + (e && e.message)); process.exit(1); });
