'use strict';
// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy of b146_design1_home_bench.js. The original at its own path proves the classic
// tree (main's, unchanged); this one proves the redesign in v2/, with its stage 1-3 amendments by label.
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // DESIGN-1 · THE LAYOUT SWITCH: this copy proves the v2 tree (middleware.ts serves it with no cookie)
// scripts/b146_design1_home_bench.js · DESIGN-1 · STAGE 2 · HOME IS THE DAY'S WORK.
//
// WHAT IT HOLDS (docs/review/REPORT.md §3, "What a vendor sees first", as the founder sanctioned it), in the REAL app:
// `next dev` in mock-session mode, /vendor/today, every door Home reads answered by this bench's own fixtures, so every
// answer below is known before the page draws it.
//   §1 Home's four parts, in the report's order: Check a date, Reply to, Today, Money due. Nothing else under the head.
//   §2 Check a date answers in WORDS: Free all day, Booked, Enquiry. A lost enquiry is not an enquiry; a block books.
//   §3 Reply to: every new enquiry the wire sends, in the wire's order, each with its last message and how long ago.
//   §4 Today: each function with its time, place and crew; "No crew yet" in the critical ink; This week opens the rest.
//   §5 Money due: one line (what is owed, from how many clients, the next due date).
//   §6 The page at 374x812 and 360x800, dark and light: no sideways scroll, rows 64 high, no dash in Home's words.
//   §7 Source: the pinned rooms KEPT and moved under More (founder: "kept, moved under More, not deleted"); crew wherever
//      an event shows (Events rows, the Calendar); Home's words in one home (v2/lib/worklist/home.ts).
// RED MUTATIONS (each turns a named cell red):
//   · in v2/lib/worklist/home.ts set answerFree to 'Available'                      -> §2 free cells
//   · in TodayHome.tsx answerFor, drop the OPEN_ENQUIRY filter                   -> §2 "a lost enquiry"
//   · in TodayHome.tsx, render `[...unanswered].reverse().map(`                  -> §3 order
//   · in v2/app/vendor/(shell)/rooms/page.tsx, remove <PinnedRooms />               -> §7 pinned kept
//   · in TodayHome.tsx, put the old last-message effect back (deps [unanswered, last], `for (const l of unanswered)`,
//     `if (l.id in last) continue`, a cleanup that drops replies on their way)       -> 8.7 (55 detail requests for ten)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 3146;
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stripComments } = require('./lib/stripComments.cjs');
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 300) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const code = (f) => stripComments(read(f));

// ── THE FIXTURES ──────────────────────────────────────────────────────────────────────────────────────────────────
// The IST day, computed the way lib/vendor/istDay.ts computes it, so Home's week window and this bench agree.
const istISO = (plus) => new Date(Date.now() + 330 * 60000 + plus * 864e5).toISOString().slice(0, 10);
const T = istISO(0);
const T2 = istISO(2);
const ago = (min) => new Date(Date.now() - min * 60000).toISOString();
const D_FREE = '2027-02-10';
const D_BOOK = '2027-02-11';
const D_ENQ = '2027-02-12';
const D_LOST = '2027-02-13';
const D_BLOCK = '2027-02-14';
// CE-46 (FE-5, by label): the months are written out in the new layout (the chair's ruling, R-42.13)
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// CE-46: no ages. An independent reading of the rule: the time in India today, else the date with the month written out
const WHEN = (iso) => { const ist = (ms) => new Date(ms + 330 * 60000); const a = ist(Date.parse(iso)), b = ist(Date.now());
  const k = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
  // the founder (L2, by label): the time today in clock words, "10:40 am", read independently of the app's helper
  if (k(a) === k(b)) { const h = a.getUTCHours(); return `${h % 12 === 0 ? 12 : h % 12}:${String(a.getUTCMinutes()).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; }
  return `${a.getUTCDate()} ${MON[a.getUTCMonth()]}` + (a.getUTCFullYear() === b.getUTCFullYear() ? '' : ` ${a.getUTCFullYear()}`); };
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayHead = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${DAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d} ${MON[m - 1]}`; };

const L1 = { id: 'b146-l1', name: 'Meera Shah', wedding_date: D_ENQ, wedding_city: 'Jaipur', budget_min: null, budget_max: null, state: 'new', created_at: ago(600), redacted: false, raw_message: 'Hello' };
const L2 = { id: 'b146-l2', name: 'Ritu Kapoor', wedding_date: null, wedding_city: null, budget_min: null, budget_max: null, state: 'new', created_at: ago(2 * 1440), redacted: false, raw_message: 'Need a quote for December' };
const L3 = { id: 'b146-l3', name: 'Asha Nair', wedding_date: D_LOST, wedding_city: null, budget_min: null, budget_max: null, state: 'lost', created_at: ago(9000), redacted: false, raw_message: null };
const KINDS = ['lead_unanswered', 'invoice_due', 'events_today', 'contract_unsigned', 'team_tasks'];
const FEED = {
  ok: true, today: T, has_any: true,
  needs_attention: { lead_unanswered: [L1, L2], invoice_due: [], events_today: [], contract_unsigned: [], team_tasks: [] },
  done_today: { invoice_paid: [], contract_signed: [], team_task_done: [] },
  counts: Object.fromEntries(KINDS.map((k) => [k, k === 'lead_unanswered' ? 2 : 0])),
  truncated: Object.fromEntries(KINDS.map((k) => [k, false])),
};
// CE-47 FE-8 (the founder's walk, 1 Oct 2026: "today is basically a never ending list of all enquiries"): two more feeds,
// one with five new enquiries and one the server capped, to read that Today draws the first three and links to the rest.
const LN = (n) => ({ id: 'b146-m' + n, name: 'Enquiry ' + n, wedding_date: null, wedding_city: null, budget_min: null, budget_max: null, state: 'new', created_at: ago(3000 + n), redacted: false, raw_message: 'Message ' + n });
const MANY = [L1, L2, LN(3), LN(4), LN(5)];
const feedOf = (rows, capped) => ({ ...FEED, needs_attention: { ...FEED.needs_attention, lead_unanswered: rows }, counts: { ...FEED.counts, lead_unanswered: rows.length }, truncated: { ...FEED.truncated, lead_unanswered: capped } });
let FEED_NOW = FEED;
// CE-47 FE-9 (T1): fixtures that answer at once hid Today's refetch (live: 530 requests, 22.6 s). With SLOW_DETAIL on, each
// enquiry's detail answers 150 to 650 ms late, as a real server does, and every detail request is counted by its id.
let SLOW_DETAIL = false;
const detailAsked = [];
const TEN = [L1, L2, ...[3, 4, 5, 6, 7, 8, 9, 10].map(LN)];
const DETAIL = {
  [L1.id]: { ok: true, lead: L1, vendor_summary: null, conversation: [{ id: 'm1', body: 'Is 14 Feb free for a haldi?', created_at: ago(180), direction: 'inbound' }], invoices: [], events: [] },
  [L2.id]: { ok: true, lead: L2, vendor_summary: null, conversation: [], invoices: [], events: [] },
};
const crew = (name, confirmation) => ({ member_id: name, name, initials: '', role: null, confirmation, external: false });
const F1 = { event_id: 'b146-e1', date: T, slot: null, kind: 'shoot', title: 'Sharma pre-wedding', event_time: '10:00:00', crew: [crew('Rhea Das', 'confirmed'), crew('Arjun Mehta', 'pending')], gap: false };
const F2 = { event_id: 'b146-e2', date: T, slot: null, kind: 'haldi', title: 'Gupta haldi', event_time: '16:00:00', crew: [], gap: true };
const F3 = { event_id: 'b146-e3', date: T2, slot: null, kind: 'wedding', title: 'Iyer wedding', event_time: '19:00:00', crew: [crew('Sana Khan', 'declined')], gap: false };
const BANDS = { ok: true, bands: [], loose: [F2, F3, F1], default_view: 'month', category: null, truncated: false };
const EVENTS = { ok: true, events: [
  { id: F1.event_id, title: F1.title, kind: 'shoot', event_date: T, event_time: F1.event_time, state: 'confirmed', notes: 'Lodhi Garden', lead_id: null, linked_binder_id: null },
  { id: F2.event_id, title: F2.title, kind: 'haldi', event_date: T, event_time: F2.event_time, state: 'confirmed', notes: null, lead_id: L1.id, linked_binder_id: null },
] };
const INVOICES = { ok: true, invoices: [
  { id: 'i1', invoice_number: 'TDW-1', client_name: 'Kapoor', amount_total: 100000, amount_paid: 50000, amount_owed: 50000, state: 'unpaid', due_date: '2026-10-05' },
  { id: 'i2', invoice_number: 'TDW-2', client_name: 'Iyer', amount_total: 25000, amount_paid: 0, amount_owed: 25000, state: 'unpaid', due_date: '2026-10-02' },
  { id: 'i3', invoice_number: 'TDW-3', client_name: 'Das', amount_total: 10000, amount_paid: 10000, amount_owed: 0, state: 'paid', due_date: '2026-09-01' },
], summary: { total_outstanding: 75000, total_collected: 60000 } };
const dayOf = (d) => {
  const base = { ok: true, date: d, events: [], blocks: [], hot: null, milestones: [], followups: [] };
  if (d === D_BOOK) base.events = [{ id: 'x1', title: 'Kapoor wedding', kind: 'wedding', slot: null, event_time: '18:00:00', state: 'confirmed', notes: null, lead_id: null, linked_binder_id: null, binder_name: 'Kapoor' }];
  if (d === D_BLOCK) base.blocks = [{ id: 'k1', slot: 'full_day', reason: 'Travel', title: 'Blocked' }];
  return base;
};

async function main() {
  // §7 first: the source cells need no server.
  sec('7 source: pinned kept under More, crew wherever an event shows, one home for Home’s words');
  // FE-5 (by label): /vendor/rooms goes to Today in the new layout; More is /vendor/more, where the pinned rooms are
  const rooms = code('v2/app/vendor/(shell)/more/page.tsx');
  const today = code('v2/app/vendor/(shell)/today/page.tsx');
  // CE-47 (the founder's ruling after his walk, by label): More is the rooms in today's Rooms order; Pinned goes
  ok(!/<PinnedRooms\b/.test(rooms) && /<RoomsGrid\s*\/>/.test(rooms), '7.1 More (/vendor/more) mounts the rooms in the classic order and no Pinned (the founder, after his walk)');
  ok(!/PinnedRooms/.test(today), '7.2 the pinned rooms MOVED: Home no longer mounts them');
  ok(fs.existsSync(path.join(ROOT, 'v2/components/worklist/PinnedRooms.tsx')), '7.3 the pinned rooms are not deleted (v2/components/worklist/PinnedRooms.tsx stands)');
  ok(/<TodayHome\s*\/>/.test(today), '7.4 Home mounts TodayHome');
  ok(/export const REPLY_SHOWN = 3;/.test(code('v2/lib/worklist/home.ts')) && /const shown = unanswered\.slice\(0, REPLY_SHOWN\);/.test(code('v2/components/worklist/TodayHome.tsx')) && /\{shown\.map\(/.test(code('v2/components/worklist/TodayHome.tsx')), '7.8 Reply to draws the first REPLY_SHOWN (three) of the wire, re-ordering nothing (CE-47 FE-8)');
  ok(/useCrew\(/.test(code('v2/app/vendor/(shell)/events/body.tsx')), '7.5 the Events rows read the crew');
  ok(/useCrew\(/.test(code('v2/app/vendor/(shell)/calendar/screen.tsx')) && /useCrew\(/.test(code('v2/components/vendor/CalendarDaySheet.tsx')), '7.6 the Calendar (Coming up and the day sheet) reads the crew');
  const home = code('v2/components/worklist/TodayHome.tsx');
  // JSX text: what follows a tag's own closing '>' (a tag name, a quoted attribute or a braced one; never '=>') up to '<'.
  const lits = [...home.matchAll(/[\w"'}]>([^<>{}()\n;=]*[A-Za-z][^<>{}()\n;=]*)(?=[<{])/g)].map((m) => m[1].trim()).filter(Boolean);
  ok(lits.length === 0, '7.7 TodayHome spells no words of its own: every one comes from v2/lib/worklist/home.ts', lits.join(' | '));

  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!(await server.up())) { console.log('b146: the dev server did not come up'); await server.stop(); process.exit(2); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const seen = [];

  async function open(mode, vp) {
    const p = await browser.newPage();
    await p.setViewport({ width: vp[0], height: vp[1], isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      seen.push(route);
      if (route === '/api/v2/vendor/worklist/today') return J(FEED_NOW);
      let m;
      if ((m = /^\/api\/v2\/vendor\/leads\/([^/]+)\/detail$/.exec(route))) {
        const id = m[1]; detailAsked.push(id);
        const answer = () => J(DETAIL[id] || { ok: false, error: 'not found' });
        if (!SLOW_DETAIL) return answer();
        return void setTimeout(() => { Promise.resolve().then(answer).catch(() => {}); }, 150 + Math.floor(Math.random() * 500));
      }
      if (/^\/api\/v2\/vendor\/leads\/[^/]+$/.test(route)) return J({ ok: true, leads: FEED_NOW === FEED ? [L1, L2, L3] : [...MANY, L3], total: FEED_NOW === FEED ? 3 : 6 });
      if ((m = /^\/api\/v2\/vendor\/day\/[^/]+\/(\d{4}-\d{2}-\d{2})$/.exec(route))) return J(dayOf(m[1]));
      if (/^\/api\/v2\/vendor\/bands\//.test(route)) return J(BANDS);
      if (/^\/api\/v2\/vendor\/events\//.test(route)) return J(EVENTS);
      if (/\/invoices\//.test(route)) return J(INVOICES);
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/today`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 120000;
    const ready = () => p.evaluate(() => document.querySelectorAll('.wl-home .wl-home-row').length >= 5 && !!document.querySelector('.wl-home-moneyrow'));
    while (Date.now() < until && !(await ready())) await new Promise((r) => setTimeout(r, 300));
    await new Promise((r) => setTimeout(r, 800));
    return p;
  }
  const texts = (p, sel) => p.evaluate((s) => Array.from(document.querySelectorAll(s)).map((e) => e.innerText.replace(/\s+/g, ' ').trim()), sel);

  async function check(p, date) {
    await p.evaluate((d) => {
      const i = document.querySelector('#wl-home-date');
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      set.call(i, d); i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true }));
    }, date);
    await p.click('.wl-home-go');
    const until = Date.now() + 20000;
    while (Date.now() < until && !(await p.evaluate((d) => { const a = document.querySelector('.wl-home-answer a'); return !!a && a.getAttribute('href').endsWith('day=' + d); }, date))) await new Promise((r) => setTimeout(r, 200));
    return p.evaluate(() => {
      const a = document.querySelector('.wl-home-answer');
      if (!a) return null;
      return { kind: a.className.replace('wl-home-answer', '').trim(), word: a.querySelector('.wl-home-word').innerText.trim(),
        lines: Array.from(a.querySelectorAll('.wl-home-line')).map((e) => e.innerText.trim()), href: a.querySelector('a').getAttribute('href') };
    });
  }

  try {
    for (const mode of ['dark', 'light']) {
      const p = await open(mode, [374, 812]);
      const tag = `[${mode} 374x812]`;

      sec(`1 ${tag} the four parts, in the report’s order`);
      const heads = await p.evaluate(() => Array.from(document.querySelectorAll('.wl-home h2')).map((h) => h.childNodes[0].textContent.trim()));
      ok(heads.join('|') === 'Check a date|Reply to|Today|Money due', `1.1 ${tag} Home reads Check a date, Reply to, Today, Money due`, heads.join('|'));
      const first = await p.evaluate(() => { const h = document.querySelector('.wl-home'); const s = h && h.querySelector('section'); return s ? s.getAttribute('aria-labelledby') : null; });
      ok(first === 'wl-home-check', `1.2 ${tag} Check a date is at the top`, first);
      ok((await p.$eval('#wl-home-date', (i) => i.value)) === T, `1.3 ${tag} the date box starts on today (the feed’s IST day)`);
      const pinned = await p.evaluate(() => !!document.querySelector('.wl-pins'));
      ok(!pinned, `1.4 ${tag} the pinned rooms are not on Home`);

      sec(`2 ${tag} Check a date answers in words`);
      const free = await check(p, D_FREE);
      ok(free && free.word === 'Free all day' && free.kind === 'free' && free.lines.length === 0, `2.1 ${tag} an empty day is "Free all day"`, JSON.stringify(free));
      ok(free && free.href === `/vendor/calendar?day=${D_FREE}`, `2.2 ${tag} Open in calendar opens that day`, free && free.href);
      const booked = await check(p, D_BOOK);
      ok(booked && booked.word === 'Booked' && booked.lines.includes('6:00 pm · Kapoor wedding · Kapoor')   /* the founder's clock words (L2, by label) */, `2.3 ${tag} a day with a function is "Booked" and names it`, JSON.stringify(booked));
      const enq = await check(p, D_ENQ);
      ok(enq && enq.word === 'Enquiry' && enq.lines.includes('Meera Shah asked for this date'), `2.4 ${tag} a day an open enquiry asked for is "Enquiry" and says who`, JSON.stringify(enq));
      const lost = await check(p, D_LOST);
      ok(lost && lost.word === 'Free all day', `2.5 ${tag} a lost enquiry is not an enquiry: that day is free`, JSON.stringify(lost));
      const block = await check(p, D_BLOCK);
      ok(block && block.word === 'Booked' && block.lines.includes('Blocked: Travel'), `2.6 ${tag} a blocked day is "Booked" and says why`, JSON.stringify(block));

      sec(`3 ${tag} Reply to`);
      const reply = await p.evaluate(() => Array.from(document.querySelectorAll('section[aria-labelledby="wl-home-reply"] .wl-home-row')).map((r) => ({
        name: r.querySelector('.wl-home-name').innerText.trim(), msg: r.querySelector('.wl-home-msg').innerText.trim(), ago: r.querySelector('.wl-home-ago').innerText.trim(),
        href: r.getAttribute('href'), h: r.getBoundingClientRect().height })));
      ok(reply.map((r) => r.name).join('|') === 'Meera Shah|Ritu Kapoor', `3.1 ${tag} every new enquiry, in the wire’s order`, reply.map((r) => r.name).join('|'));
      ok(reply[0] && reply[0].msg === 'Is 14 Feb free for a haldi?' && reply[0].ago === WHEN(DETAIL[L1.id].conversation[0].created_at), `3.2 ${tag} the last message of the conversation and when (CE-46: the time today, else the date)`, JSON.stringify(reply[0]));
      ok(reply[1] && reply[1].msg === 'Need a quote for December' && reply[1].ago === WHEN(L2.created_at), `3.3 ${tag} no conversation yet: the enquiry’s own words and when it came (CE-46)`, JSON.stringify(reply[1]));
      ok(reply.every((r) => r.href === `/vendor/leads?lead=${r.href.split('lead=')[1]}` && r.href.includes('b146-l')), `3.4 ${tag} each row opens its enquiry`, reply.map((r) => r.href).join(' '));
      ok(reply.length > 0 && reply.every((r) => r.h >= 64), `3.5 ${tag} each row is at least 64 high`, reply.map((r) => r.h).join(','));

      sec(`4 ${tag} Today, with time, place and crew`);
      const rowsOf = (sel) => p.evaluate((s) => Array.from(document.querySelectorAll(s)).map((r) => ({
        name: r.querySelector('.wl-home-name').innerText.trim(), facts: r.querySelector('.wl-home-facts').innerText.replace(/\s+/g, ' ').trim(),
        time: r.querySelector('.wl-home-right').innerText.trim(), h: r.getBoundingClientRect().height,
        nocrew: (() => { const n = r.querySelector('.wl-home-nocrew'); if (!n) return null; const probe = document.createElement('span'); probe.style.color = 'var(--role-critical)'; n.parentElement.appendChild(probe);
          const want = getComputedStyle(probe).color; probe.remove(); return { text: n.innerText.trim(), color: getComputedStyle(n).color, want }; })() })), sel);
      const todays = await rowsOf('section[aria-labelledby="wl-home-today"] > a.wl-home-row');
      ok(todays.map((r) => r.name).join('|') === 'Sharma pre-wedding|Gupta haldi', `4.1 ${tag} today’s functions, earliest first, and nothing from later in the week`, todays.map((r) => r.name).join('|'));
      ok(todays[0] && todays[0].facts === 'Shoot · Lodhi Garden · Rhea, Arjun (not replied yet)' && todays[0].time === '10:00 am'   /* the founder's clock words (L2, by label) */, `4.2 ${tag} a function says its time, place and crew in words`, JSON.stringify(todays[0]));
      ok(todays[1] && todays[1].facts === 'Haldi · Jaipur · No crew yet' && todays[1].nocrew && todays[1].nocrew.color === todays[1].nocrew.want, `4.3 ${tag} a function nobody is on says "No crew yet" in the critical ink`, JSON.stringify(todays[1]));
      ok(todays.length > 0 && todays.every((r) => r.h >= 64), `4.4 ${tag} each row is at least 64 high`, todays.map((r) => r.h).join(','));
      ok(!(await p.evaluate(() => !!document.querySelector('.wl-home-weeklist'))), `4.5 ${tag} the rest of the week waits behind This week`);
      const wk = await p.$('.wl-home-week');
      const wkWord = wk ? await p.evaluate((b) => b.innerText.trim(), wk) : null;
      ok(wkWord === 'This week', `4.6 ${tag} the link says This week`, wkWord);
      if (wk) await wk.click();
      await new Promise((r) => setTimeout(r, 300));
      const days = await texts(p, '.wl-home-weeklist .wl-home-day');
      const later = await rowsOf('.wl-home-weeklist a.wl-home-row');
      ok(days.join('|') === dayHead(T2) && later.length === 1 && later[0].name === 'Iyer wedding' && later[0].facts.endsWith('Sana (declined)'), `4.7 ${tag} This week lists the later days by heading, crew and all`, JSON.stringify({ days, later }));

      sec(`5 ${tag} Money due, one line`);
      const money = await texts(p, 'section[aria-labelledby="wl-home-money"] .wl-home-row');
      ok(money.length === 1 && money[0] === 'Rs 75,000 owed · 2 clients · next due 2 October', `5.1 ${tag} what is owed, by how many clients, and the next date`, money.join(' / '));
      ok((await p.$eval('section[aria-labelledby="wl-home-money"] .wl-home-row', (a) => a.getAttribute('href'))) === '/vendor/invoices', `5.2 ${tag} the line opens Invoices`);

      sec(`6 ${tag} words and fit`);
      const words = await p.evaluate(() => document.querySelector('.wl-home').innerText);
      ok(!/[—–]/.test(words), `6.1 ${tag} no dash in Home’s words`, (words.match(/.{0,20}[—–].{0,20}/) || [''])[0]);
      ok(!/\b(he|she|his|her)\b/i.test(words), `6.2 ${tag} no he or she`);
      const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(over <= 0, `6.3 ${tag} no sideways scroll`, over);
      await p.close();

      const q = await open(mode, [360, 800]);
      const over2 = await q.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const cut = await q.evaluate(() => Array.from(document.querySelectorAll('.wl-home *')).filter((e) => e.children.length === 0 && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible').map((e) => e.className || e.tagName));
      ok(over2 <= 0 && cut.length === 0, `6.4 [${mode} 360x800] no sideways scroll and nothing cut off`, JSON.stringify({ over2, cut }));
      await q.close();
    }
    sec('8 Reply to stops at three (CE-47 FE-8, the founder\'s walk)');
    const replyOf = (pg) => pg.evaluate(() => { const s = document.querySelector('section[aria-labelledby="wl-home-reply"]'); const a = s.querySelector('a[data-reply-all]');
      return { names: Array.from(s.querySelectorAll('.wl-home-row:not([data-reply-all]) .wl-home-name')).map((e) => e.innerText.trim()), last: (() => { const r = Array.from(s.querySelectorAll('.wl-home-row')); return r.length ? r[r.length - 1].hasAttribute('data-reply-all') : false; })(), allH: a ? Math.round(a.getBoundingClientRect().height) : 0, count: (s.querySelector('.wl-home-count') || { innerText: '' }).innerText.trim(), link: a ? [a.querySelector('.wl-home-name').innerText.trim(), a.getAttribute('href')] : null,
        heads: Array.from(document.querySelectorAll('.wl-home .wl-home-h')).map((e) => e.innerText.replace(/\s+/g, ' ').trim()) }; });
    {
      const two = await open('dark', [374, 812]); const r2 = await replyOf(two); await two.close();
      ok(r2.names.length === 2 && r2.count === '2' && r2.link === null, '8.1 two new enquiries: both drawn, the count says 2, no "See all" row (N is 3 or fewer)', JSON.stringify(r2));
      FEED_NOW = feedOf(MANY, false);
      for (const vp of [[374, 812], [360, 800]]) {
        const m = await open('dark', vp); const r5 = await replyOf(m);
        const over = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); await m.close();
        ok(r5.names.join('|') === 'Meera Shah|Ritu Kapoor|Enquiry 3' && r5.count === '5' && JSON.stringify(r5.link) === JSON.stringify(['See all 5', '/vendor/leads']) && r5.last && r5.allH >= 64 && over <= 0,
          `8.2 [${vp[0]}] five new enquiries: the first three in the wire's order, the count still says 5, and a last row "See all 5" (64 tall) opens Enquiries`, JSON.stringify(r5));
        ok(r5.heads.slice(0, 4).join('|').startsWith('Check a date|Reply to') && r5.heads.includes('Today') && r5.heads.includes('Money due'), `8.3 [${vp[0]}] Today and Money due still follow`, r5.heads.join('|'));
      }
      FEED_NOW = feedOf(MANY.slice(0, 3), true);
      const c = await open('dark', [374, 812]); const rc = await replyOf(c); await c.close();
      ok(rc.names.length === 3 && rc.count === '3+' && rc.link && rc.link[0] === 'See all 3+', '8.4 a list the server capped: three drawn, the count wears its "+", the last row says "See all 3+"', JSON.stringify(rc));
      FEED_NOW = feedOf(MANY.slice(0, 3), false);
      const t3 = await open('dark', [374, 812]); const r3 = await replyOf(t3); await t3.close();
      ok(r3.names.length === 3 && r3.count === '3' && r3.link === null, '8.5 exactly three: all three drawn and no "See all" row', JSON.stringify(r3));
      FEED_NOW = feedOf([...MANY.slice(0, 3), LN(4)], false);
      const t4 = await open('dark', [374, 812]); const r4 = await replyOf(t4); await t4.close();
      ok(r4.names.length === 3 && r4.link && r4.link[0] === 'See all 4', '8.6 four: three drawn and "See all 4"', JSON.stringify(r4));
      // 8.7 (CE-47 FE-9, T1): ten waiting, replies staggered. Today asks once for each row it DRAWS (three) and never again.
      FEED_NOW = feedOf(TEN, false); SLOW_DETAIL = true; detailAsked.length = 0;
      const t10 = await open('dark', [374, 812]);
      await new Promise((r) => setTimeout(r, 6000));
      const r10 = await replyOf(t10); const msg10 = await texts(t10, 'section[aria-labelledby="wl-home-reply"] .wl-home-row:not([data-reply-all]) .wl-home-msg');
      await t10.close();
      const asked10 = detailAsked.slice(); const drawn10 = TEN.slice(0, 3).map((l) => l.id);
      ok(asked10.length === 3 && new Set(asked10).size === 3 && drawn10.every((id) => asked10.includes(id)) && r10.names.length === 3 && r10.count === '10' && msg10[0] === 'Is 14 Feb free for a haldi?',
        '8.7 ten waiting, replies 150 to 650 ms late: exactly three detail requests, one for each drawn row, none repeated, and the late reply is still drawn',
        JSON.stringify({ requests: asked10.length, distinct: new Set(asked10).size, drawn: r10.names.length, count: r10.count, first: msg10[0] }));
      SLOW_DETAIL = false;
      FEED_NOW = FEED;
    }
    ok(seen.some((r) => r === '/api/v2/vendor/worklist/today') && seen.some((r) => /\/bands\//.test(r)), '6.5 the fixtures were read (the page asked the doors this bench answers)', [...new Set(seen)].slice(0, 12).join(' '));
  } finally {
    await browser.close();
    const s = await server.stop();
    ok(s.portFree, '6.6 the dev server stopped whole and freed its port');
  }

  console.log(`\nb146: ${pass} pass, ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' · ')); process.exit(1); }
}

main().catch((e) => { console.log('b146 crashed: ' + (e && e.stack || e)); process.exit(1); });
